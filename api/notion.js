/* ============================================================
   /api/notion — zero-config read-only Notion proxy (Vercel, Node)
   ------------------------------------------------------------
   The Notion token lives ONLY in the serverless env and is never
   returned to the client. Access is gated by a shared key the
   operator sets as DASHBOARD_PASSWORD (Adam sets it himself).

   GET /api/notion            → list databases  [{id,title,url,lastEdited}]
   GET /api/notion?db=<id>    → query a database [{id,title,url,lastEdited}]

   Required request header: x-dash-key: <DASHBOARD_PASSWORD>
   Env: DASHBOARD_PASSWORD (gate), NOTION_API_TOKEN (server-side only)
   ============================================================ */

var NOTION_VERSION = '2022-06-28';

function richText(arr) {
  return (arr || []).map(function (t) { return t.plain_text || ''; }).join('').trim();
}

function titleOf(obj) {
  if (!obj) return '(untitled)';
  if (obj.object === 'database') return richText(obj.title) || '(untitled)';
  /* page: the title property varies by name — scan for type === 'title' */
  var props = obj.properties || {};
  for (var k in props) {
    if (props[k] && props[k].type === 'title') return richText(props[k].title) || '(untitled)';
  }
  return '(untitled)';
}

function mapItem(obj) {
  return {
    id: obj.id,
    title: titleOf(obj),
    url: obj.url || '',
    lastEdited: obj.last_edited_time || ''
  };
}

module.exports = async function handler(req, res) {
  /* 1. gate — locked until the operator sets DASHBOARD_PASSWORD */
  var password = process.env.DASHBOARD_PASSWORD;
  if (!password) {
    res.status(503).json({ error: 'locked' });
    return;
  }

  /* 2. auth — shared key in the x-dash-key header */
  var key = req.headers['x-dash-key'];
  if (key !== password) {
    res.status(401).json({ error: 'unauthorized' });
    return;
  }

  /* 3. upstream token — server-side only, never sent to the client */
  var token = process.env.NOTION_API_TOKEN;
  if (!token) {
    res.status(503).json({ error: 'not_configured' });
    return;
  }

  var dbId = req.query && req.query.db;
  var url = dbId
    ? 'https://api.notion.com/v1/databases/' + encodeURIComponent(dbId) + '/query'
    : 'https://api.notion.com/v1/search';
  var body = dbId
    ? { page_size: 50 }
    : { filter: { value: 'database', property: 'object' }, page_size: 100 };

  try {
    var r = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer ' + token,
        'Notion-Version': NOTION_VERSION,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    });
    var data = await r.json().catch(function () { return {}; });
    if (!r.ok) {
      res.status(r.status).json({
        error: 'notion_error',
        code: data.code || null,
        message: data.message || null
      });
      return;
    }
    var items = (data.results || []).map(mapItem);
    res.status(200).json(items);
  } catch (e) {
    res.status(502).json({ error: 'upstream_failed' });
  }
};
