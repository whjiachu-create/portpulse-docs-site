export const onRequest: PagesFunction = async (ctx) => {
  const upstream = new URL("https://api.useportpulse.com/openapi.json");
  upstream.search = new URL(ctx.request.url).search;

  const fwd = new Headers();
  const pass = (k: string) => { const v = ctx.request.headers.get(k); if (v) fwd.set(k, v); };
  pass("if-none-match"); pass("if-modified-since"); pass("accept"); pass("user-agent");

  const init: RequestInit = { method: ctx.request.method === "HEAD" ? "HEAD" : "GET", headers: fwd };
  const u = await fetch(upstream.toString(), init);

  const keep = ["content-type","cache-control","etag","last-modified","access-control-allow-origin","access-control-expose-headers"];
  const out = new Headers();
  for (const k of keep) { const v = u.headers.get(k); if (v) out.set(k, v); }
  if (!out.has("access-control-allow-origin")) out.set("access-control-allow-origin","*");
  if (!out.has("access-control-expose-headers")) out.set("access-control-expose-headers","ETag, Content-Length, Content-Type");
  out.set("x-portpulse-proxy","pages-functions");

  if (ctx.request.method === "HEAD") return new Response(null, { status: u.status, headers: out });
  return new Response(u.body, { status: u.status, headers: out });
};
