export const onRequest: PagesFunction = async (ctx) => {
  const upstream = new URL("https://api.useportpulse.com/openapi.json");
  upstream.search = new URL(ctx.request.url).search;

  // 只支持 GET/HEAD；其他方法直接 405
  const method = ctx.request.method === "HEAD" ? "HEAD" : "GET";

  // 透传少量有用头
  const fwd = new Headers();
  const pass = (k: string) => { const v = ctx.request.headers.get(k); if (v) fwd.set(k, v); };
  pass("accept"); pass("user-agent");

  const u = await fetch(upstream.toString(), { method: "GET", headers: fwd }); // 用 GET 拿实体，便于统一计算 ETag
  const baseHeaders = new Headers();

  // 带上常见上游头（如有）
  for (const k of ["content-type","last-modified","access-control-allow-origin","access-control-expose-headers","cache-control"]) {
    const v = u.headers.get(k);
    if (v) baseHeaders.set(k, v);
  }
  // CORS + 暴露 ETag/长度/类型
  if (!baseHeaders.has("access-control-allow-origin")) baseHeaders.set("access-control-allow-origin","*");
  const expose = baseHeaders.get("access-control-expose-headers");
  if (!expose) baseHeaders.set("access-control-expose-headers","ETag, Content-Length, Content-Type");
  else if (!/(^|,\s*)etag(\s*,|$)/i.test(expose)) baseHeaders.set("access-control-expose-headers", expose + ", ETag");

  // 统一缓存策略：确保 no-transform，避免边缘压缩改写导致 ETag 失效
  const cc = baseHeaders.get("cache-control");
  if (!cc) baseHeaders.set("cache-control","public, max-age=3600, must-revalidate, no-transform");
  else if (!/no-transform/i.test(cc)) baseHeaders.set("cache-control", cc + ", no-transform");

  baseHeaders.set("x-portpulse-proxy","pages-functions");

  // 读取实体并计算强 ETag（sha256-hex）
  const buf = await u.arrayBuffer();
  const hash = await crypto.subtle.digest("SHA-256", buf);
  const hex = [...new Uint8Array(hash)].map(b => b.toString(16).padStart(2,"0")).join("");
  const strongETag = `"sha256-${hex}"`;

  // 固定 ETag/Content-Length/Content-Type
  baseHeaders.set("etag", strongETag);
  baseHeaders.set("content-length", String(buf.byteLength));
  if (!baseHeaders.has("content-type")) baseHeaders.set("content-type", "application/json; charset=utf-8");

  // If-None-Match 对比（兼容弱标记）
  const inm = ctx.request.headers.get("if-none-match");
  const stripW = (s: string) => s.replace(/^W\//i,"");
  if (inm && stripW(inm) === stripW(strongETag)) {
    return new Response(null, { status: 304, headers: baseHeaders });
  }

  // HEAD 返回头即可；GET 返回实体
  if (method === "HEAD") return new Response(null, { status: u.ok ? 200 : u.status, headers: baseHeaders });
  return new Response(buf, { status: u.ok ? 200 : u.status, headers: baseHeaders });
};
