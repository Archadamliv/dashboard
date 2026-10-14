/* ============================================================
   /api/share — create a time-limited share link (Cloudflare KV)
   ------------------------------------------------------------
   POST /api/share  { url, days }        → { link, expiresAt, days }
   Gated by DASHBOARD_PASSWORD (header x-dash-key).
   Stores a record under KV key "share:<token>" with expirationTtl
   (auto-expires). /r/<token> then 302-redirects until it expires.
   days: default 3, clamped to 1..31 (never longer than 31 days).
   ============================================================ */

function json(status, obj) {
  return new Response(JSON.stringify(obj), {
    status: status,
    headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store' }
  });
}

function randToken() {
  const a = new Uint8Array(16);
  crypto.getRandomValues(a);
  let s = '';
  for (let i = 0; i < a.length; i++) s += a[i].toString(16).padStart(2, '0');
  return s;
}

export async function onRequest(context) {
  const { request, env } = context;

  if (!env.DASH_LAYOUT) return json(503, { error: 'no_kv_binding' });
  if (request.method !== 'POST') return json(405, { error: 'method_not_allowed' });

  const password = env.DASHBOARD_PASSWORD;
  if (!password) return json(503, { error: 'locked' });
  if (request.headers.get('x-dash-key') !== password) return json(401, { error: 'unauthorized' });

  let body;
  try { body = await request.json(); } catch (e) { return json(400, { error: 'bad_json' }); }

  const url = ((body && body.url) || '').trim();
  if (!/^https?:\/\//i.test(url)) return json(400, { error: 'bad_url' });

  let days = parseInt(body && body.days, 10);
  if (!isFinite(days) || days < 1) days = 3;
  if (days > 31) days = 31;

  const ttl = days * 86400;
  const token = randToken();
  const exp = new Date(Date.now() + ttl * 1000).toISOString();

  await env.DASH_LAYOUT.put('share:' + token, JSON.stringify({ url: url, exp: exp }), { expirationTtl: ttl });

  const origin = new URL(request.url).origin;
  return json(200, { link: origin + '/r/' + token, expiresAt: exp, days: days });
}
