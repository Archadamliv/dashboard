/* ============================================================
   /api/ping — record which dashboard address was last used.
   GET /api/ping?h=<host>   → 204 (fire and forget)

   Stores { host, at, ua } under the KV key "lastseen" so the agent
   can tell whether the old or the new (nest-adam-dashboard) address
   is the one Adam actually opens.
   ============================================================ */

export async function onRequest(context) {
  const { request, env } = context;
  if (!env.DASH_LAYOUT) return new Response(null, { status: 204 });

  let host = '';
  try { host = new URL(request.url).searchParams.get('h') || ''; } catch (e) {}
  if (host) {
    try {
      await env.DASH_LAYOUT.put('lastseen', JSON.stringify({
        host: host.slice(0, 120),
        at: new Date().toISOString(),
        ua: (request.headers.get('user-agent') || '').slice(0, 90)
      }));
    } catch (e) {}
  }
  return new Response(null, { status: 204, headers: { 'cache-control': 'no-store' } });
}
