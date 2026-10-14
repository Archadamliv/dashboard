/* ============================================================
   /api/notion — Cloudflare Pages Function (read-only Notion proxy)
   ------------------------------------------------------------
   Port of the Vercel serverless version. The Notion token lives
   ONLY in the Pages env and is never returned to the client.
   Access is gated by a shared key the operator sets as
   DASHBOARD_PASSWORD.

   GET /api/notion            → list databases  [{id,title,url,lastEdited}]
   GET /api/notion?db=<id>    → query a database [{id,title,url,lastEdited}]

   Required request header: x-dash-key: <DASHBOARD_PASSWORD>
   Env: DASHBOARD_PASSWORD (gate), NOTION_API_TOKEN (server-side only)
   ============================================================ */

const NOTION_VERSION = '2022-06-28';

function richText(arr) {
  return (arr || []).map(function (t) { return t.plain_text || ''; }).join('').trim();
}

function titleOf(obj) {
  if (!obj) return '(untitled)';
  if (obj.object === 'database') return richText(obj.title) || '(untitled)';
  const props = obj.properties || {};
  for (const k in props) {
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

function json(status, obj) {
  return new Response(JSON.stringify(obj), {
    status: status,
    headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store' }
  });
}

export async function onRequest(context) {
  const { request, env } = context;

  /* 1. gate — locked until the operator sets DASHBOARD_PASSWORD */
  const password = env.DASHBOARD_PASSWORD;
  if (!password) return json(503, { error: 'locked' });

  /* 2. auth — shared key in the x-dash-key header */
  const key = request.headers.get('x-dash-key');
  if (key !== password) return json(401, { error: 'unauthorized' });

  /* 3. upstream token — server-side only, never sent to the client */
  const token = env.NOTION_API_TOKEN;
  if (!token) return json(503, { error: 'not_configured' });

  const url = new URL(request.url);
  const dbId = url.searchParams.get('db');
  const target = dbId
    ? 'https://api.notion.com/v1/databases/' + encodeURIComponent(dbId) + '/query'
    : 'https://api.notion.com/v1/search';
  const body = dbId
    ? { page_size: 50 }
    : { filter: { value: 'database', property: 'object' }, page_size: 100 };

  try {
    const r = await fetch(target, {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer ' + token,
        'Notion-Version': NOTION_VERSION,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    });
    const data = await r.json().catch(function () { return {}; });
    if (!r.ok) {
      return json(r.status, { error: 'notion_error', code: data.code || null, message: data.message || null });
    }
    return json(200, (data.results || []).map(mapItem));
  } catch (e) {
    return json(502, { error: 'upstream_failed' });
  }
}
