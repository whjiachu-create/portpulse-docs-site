// /functions/openapi.json.ts
export const onRequest: PagesFunction = async (ctx) => {
  // Upstream OpenAPI (允许把查询串透传上去，便于调试)
  const upstream = new URL("https://api.useportpulse.com/openapi.json");
  upstream.search = new URL(ctx.request.url).search;

  // 仅转发有意义的条件请求与协商头
  const fwd = new Headers();
  const pass = (k: string) => {
    const v = ctx.request.headers.get(k);
    if (v) fwd.set(k, v);
  };
  pass("if-none-match");
  pass("if-modified-since");
  pass("accept");
  pass("user-agent");

  const method = ctx.request.method === "HEAD" ? "HEAD" : "GET";
  const upstreamRes = await fetch(upstream.toString(), { method, headers: fwd });

  // 先拷贝上游头，再进行最小化规范化；默认透传 ETag，不覆盖
  const headers = new Headers(upstreamRes.headers);

  // CORS & 公开响应头
  if (!headers.has("access-control-allow-origin")) {
    headers.set("access-control-allow-origin", "*");
  }
  const expose = headers.get("access-control-expose-headers");
  if (!expose) {
    headers.set("access-control-expose-headers", "ETag, Content-Length, Content-Type");
  } else if (!/(^|,\s*)etag(\s*,|$)/i.test(expose)) {
    headers.set("access-control-expose-headers", expose + ", ETag");
  }

  // 缓存策略：补充 no-transform，避免边缘改写破坏 ETag；无则给一个温和策略
  const cc = headers.get("cache-control");
  if (!cc) {
    headers.set("cache-control", "public, max-age=3600, must-revalidate, no-transform");
  } else if (!/no-transform/i.test(cc)) {
    headers.set("cache-control", cc + ", no-transform");
  }

  // 标记来源
  headers.set("x-portpulse-proxy", "pages-functions");

  // 如果上游已经返回了 ETag，**绝对不要覆盖**
  const upstreamEtag = upstreamRes.headers.get("etag");
  if (upstreamEtag) {
    headers.set("x-upstream-etag", upstreamEtag);
  }

  // 若上游**没有 ETag** 且为 GET，我们再读取 body 来补一个强 ETag
  let bodyToSend: BodyInit | null = null;
  if (!upstreamEtag && method === "GET" && upstreamRes.ok) {
    const buf = await upstreamRes.clone().arrayBuffer();
    // 仅当有实体时才计算；空体就不写 ETag
    if (buf.byteLength > 0) {
      const hash = await crypto.subtle.digest("SHA-256", buf);
      const hex = [...new Uint8Array(hash)].map(b => b.toString(16).padStart(2, "0")).join("");
      headers.set("etag", `"sha256-${hex}"`); // 强校验
      headers.set("content-length", String(buf.byteLength));
    }
    bodyToSend = buf;
  }

  // 若上游已返回 304，则直接透传（不需要我们再做 304 判断）
  if (upstreamRes.status === 304) {
    return new Response(null, { status: 304, headers });
  }

  // HEAD 请求：不返回实体，只归一化后的头与状态码
  if (method === "HEAD") {
    return new Response(null, { status: upstreamRes.status, headers });
  }

  // GET 请求：优先用我们为补 ETag 已经读取的实体；否则直接透传上游 body（零拷贝）
  if (bodyToSend) {
    return new Response(bodyToSend, { status: upstreamRes.status, headers });
  }
  return new Response(upstreamRes.body, { status: upstreamRes.status, headers });
};