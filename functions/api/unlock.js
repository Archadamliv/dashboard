/* ============================================================
   /api/unlock — mint an owner unlock link for a gated origin.
   ------------------------------------------------------------
   POST /api/unlock { url }   (header x-dash-key = DASHBOARD_PASSWORD)
     → { link }  where link = <url>?k=<hmac(host, GATE_SECRET)>

   The origin middleware (functions/_middleware.js on each content
   project) accepts that k, sets a 1-year cookie and redirects to a
   clean URL — so Adam can open his own pages while everybody else
   (and every crawler) just gets 403.
   ============================================================ */

function json(status, obj) {
  return new Response(JSON.stringify(obj), {
    status: status,
    headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store' }
  });
}

async function hmac(secret, msg) {
  const key = await crypto.subtle.importKey(
    'raw', new TextEncoder().encode(secret),
    { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']
  );
  const sig = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(msg));
  return [...new Uint8Array(sig)].map(function (b) { return b.toString(16).padStart(2, '0'); }).join('');
}

export async function onRequest(context) {
  const { request, env } = context;

  if (request.method !== 'POST') return json(405, { error: 'method_not_allowed' });

  const password = env.DASHBOARD_PASSWORD;
  if (!password) return json(503, { error: 'locked' });
  if (request.headers.get('x-dash-key') !== password) return json(401, { error: 'unauthorized' });

  const secret = env.GATE_SECRET;
  if (!secret) return json(503, { error: 'no_gate' });

  let body;
  try { body = await request.json(); } catch (e) { return json(400, { error: 'bad_json' }); }

  const raw = ((body && body.url) || '').trim();
  if (!/^https?:\/\//i.test(raw)) return json(400, { error: 'bad_url' });

  const u = new URL(raw);
  u.searchParams.set('k', await hmac(secret, u.host));
  return json(200, { link: u.toString() });
}
