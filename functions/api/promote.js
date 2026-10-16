/* ============================================================
   /api/promote — "solidify this page" requests (Cloudflare KV)
   ------------------------------------------------------------
   GET  /api/promote                     → { pending: [url,…] }   (public read)
   POST /api/promote { url, action }      → gated by x-dash-key
        action:"request" (default) → add to the pending list
        action:"clear"             → remove from the pending list

   Adam clicks 固化 · Promote on a Library card → the url lands in
   the KV key "promote"; the agent picks it up, promotes the page to
   a permanent home, flips the card to STABLE and clears the request.
   ============================================================ */

const KEY = 'promote';

function json(status, obj) {
  return new Response(JSON.stringify(obj), {
    status: status,
    headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store' }
  });
}

async function readList(env) {
  const raw = await env.DASH_LAYOUT.get(KEY);
  let list = [];
  try { list = JSON.parse(raw || '[]'); } catch (e) { list = []; }
  return Array.isArray(list) ? list : [];
}

export async function onRequest(context) {
  const { request, env } = context;

  if (!env.DASH_LAYOUT) return json(503, { error: 'no_kv_binding' });

  if (request.method === 'GET') {
    const list = await readList(env);
    return json(200, {
      pending: list.map(function (x) { return x && x.url; }).filter(Boolean),
      items: list
    });
  }

  if (request.method !== 'POST') return json(405, { error: 'method_not_allowed' });

  const password = env.DASHBOARD_PASSWORD;
  if (!password) return json(503, { error: 'locked' });
  if (request.headers.get('x-dash-key') !== password) return json(401, { error: 'unauthorized' });

  let body;
  try { body = await request.json(); } catch (e) { return json(400, { error: 'bad_json' }); }

  const url = ((body && body.url) || '').trim();
  if (!/^https?:\/\//i.test(url)) return json(400, { error: 'bad_url' });

  const action = (body && body.action) || 'request';
  let list = await readList(env);
  list = list.filter(function (x) { return x && x.url !== url; });
  if (action === 'request') {
    list.push({ url: url, at: new Date().toISOString(), by: (body && body.by) || 'dashboard' });
  }
  await env.DASH_LAYOUT.put(KEY, JSON.stringify(list));
  return json(200, { ok: true, pending: list.map(function (x) { return x.url; }) });
}
