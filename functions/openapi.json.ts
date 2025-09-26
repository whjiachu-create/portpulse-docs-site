export const onRequest: PagesFunction = async (ctx) => {
  const upstream = new URL("https://api.useportpulse.com/openapi.json");
  upstream.search = new URL(ctx.request.url).search;

  const fwd = new Headers();
  const pass = (k: string) => { const v = ctx.request.headers.get(k); if (v) fwd.set(k, v); };
  pass("if-none-match"); pass("if-modified-since"); pass("accept"); pass("user-agent");

  const method = ctx.request.method === "HEAD" ? "HEAD" : "GET";
  const u = await fetch(upstream.toString(), { method, headers: fwd });

  const headers = new Headers();
  // 先带上可能有用的上游头
  for (const k of ["content-type","cache-control","last-modified","access-control-allow-origin","access-control-expose-headers","etag"]) {
    const v = u.headers.get(k);
    if (v) headers.set(k, v);
  }
  if (!headers.has("access-control-allow-origin")) headers.set("access-control-allow-origin","*");
  if (!headers.has("access-control-expose-headers")) headers.set("access-control-expose-headers","ETag, Content-Length, Content-Type");
  headers.set("x-portpulse-proxy","pages-functions");

  const upstreamEtag = u.headers.get("etag");
  if (upstreamEtag) headers.set("x-upstream-etag", upstreamEtag);

  // 读取响应体为 buffer（HEAD 时为空），计算强 ETag + Content-Length
  const buf = method === "GET" ? await u.clone().arrayBuffer() : new ArrayBuffer(0);

  const computeStrongEtag = async (ab: ArrayBuffer): Promise<string> => {
    if (ab.byteLength === 0 && upstreamEtag) return upstreamEtag; // 空体时复用上游（如果有）
    const hash = await crypto.subtle.digest("SHA-256", ab);
    const hex = [...new Uint8Array(hash)].map(b => b.toString(16).padStart(2, "0")).join("");
    return `"sha256-${hex}"`;
  };

  const etag = await computeStrongEtag(buf);
  headers.set("etag", etag);

  // 缓存策略：确保 no-transform，避免边缘改写后丢 ETag；并固定 Content-Length
  const cc = headers.get("cache-control");
  if (!cc) {
    headers.set("cache-control","public, max-age=3600, must-revalidate, no-transform");
  } else if (!/no-transform/i.test(cc)) {
    headers.set("cache-control", cc + ", no-transform");
  }
  if (method === "GET") headers.set("content-length", String(buf.byteLength));

  // 304 判定（兼容弱标记）
  const inm = ctx.request.headers.get("if-none-match");
  const stripW = (s: string) => s.replace(/^W\//i,"");
  if (inm && stripW(inm) === stripW(etag)) {
    return new Response(null, { status: 304, headers });
  }

  if (method === "HEAD") {
    return new Response(null, { status: u.status, headers });
  }

  return new Response(buf, { status: u.status, headers });
};
