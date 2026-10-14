/* ============================================================
   /api/layout — canonical dashboard layout (Cloudflare KV)
   ------------------------------------------------------------
   Stores the authoritative layout Adam publishes from the UI:
     { order: {group:[url,…]}, cat: {url:group}, hidden: {url:true} }

   GET  /api/layout   → { layout: <object|null> }        (public read)
   POST /api/layout   → save layout                       (gated by key)

   Binding: DASH_LAYOUT (KV). Gate: DASHBOARD_PASSWORD (header x-dash-key).
   ============================================================ */

function json(status, obj) {
  return new Response(JSON.stringify(obj), {
    status: status,
    headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store' }
  });
}

export async function onRequest(context) {
  const { request, env } = context;

  if (!env.DASH_LAYOUT) return json(503, { error: 'no_kv_binding' });

  if (request.method === 'GET') {
    const raw = await env.DASH_LAYOUT.get('layout');
    let layout = null;
    if (raw) { try { layout = JSON.parse(raw); } catch (e) { layout = null; } }
    return json(200, { layout: layout });
  }

  if (request.method === 'POST' || request.method === 'PUT') {
    const password = env.DASHBOARD_PASSWORD;
    if (!password) return json(503, { error: 'locked' });
    if (request.headers.get('x-dash-key') !== password) return json(401, { error: 'unauthorized' });

    let body;
    try { body = await request.json(); } catch (e) { return json(400, { error: 'bad_json' }); }

    const clean = {
      order: (body && typeof body.order === 'object' && body.order) ? body.order : {},
      cat: (body && typeof body.cat === 'object' && body.cat) ? body.cat : {},
      hidden: (body && typeof body.hidden === 'object' && body.hidden) ? body.hidden : {},
      updatedAt: new Date().toISOString()
    };
    await env.DASH_LAYOUT.put('layout', JSON.stringify(clean));
    return json(200, { ok: true, updatedAt: clean.updatedAt });
  }

  return json(405, { error: 'method_not_allowed' });
}
