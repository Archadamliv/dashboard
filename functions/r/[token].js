/* ============================================================
   /r/<token> — resolve a time-limited share link.
   302-redirect to the target while the KV record exists;
   410 Gone once it has expired (KV expirationTtl).
   ============================================================ */

function gone(msg) {
  return new Response(msg, {
    status: 410,
    headers: { 'content-type': 'text/plain; charset=utf-8', 'cache-control': 'no-store' }
  });
}

export async function onRequest(context) {
  const { env, params } = context;
  const token = params && params.token;
  if (!env.DASH_LAYOUT) return new Response('Not configured', { status: 503 });
  if (!token) return gone('Link not found · 链接不存在');

  const raw = await env.DASH_LAYOUT.get('share:' + token);
  if (!raw) return gone('This link has expired · 此链接已失效');

  let data = null;
  try { data = JSON.parse(raw); } catch (e) { data = null; }
  if (!data || !data.url) return gone('This link has expired · 此链接已失效');

  return Response.redirect(data.url, 302);
}
