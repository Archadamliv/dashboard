/* ============================================================
   /api/library — auto-discovered pages (read-only, public)
   GET → { items: [ {url,name,nameZh,desc,descZh,status,expires,src,discoveredAt} ] }

   Populated by tools/discover.mjs (KV key "library"). The dashboard
   merges these into the 「库 / Library」 section, so new pages show up
   without a redeploy.
   ============================================================ */

function json(status, obj) {
  return new Response(JSON.stringify(obj), {
    status: status,
    headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store' }
  });
}

export async function onRequest(context) {
  const { env } = context;
  if (!env.DASH_LAYOUT) return json(200, { items: [] });

  let items = [];
  try {
    const raw = await env.DASH_LAYOUT.get('library');
    const parsed = JSON.parse(raw || '[]');
    if (Array.isArray(parsed)) items = parsed;
  } catch (e) { items = []; }

  return json(200, { items: items, count: items.length });
}
