// functions/openapi.json.ts
export const onRequest: PagesFunction = async (ctx) => {
  const upstream = new URL("https://api.useportpulse.com/openapi.json");
  upstream.search = new URL(ctx.request.url).search;

  // 仅透传必要请求头
  const fwd = new Headers();
  const pass = (k: string) => { const v = ctx.request.headers.get(k); if (v) fwd.set(k, v); };
  pass("if-none-match"); pass("if-modified-since"); pass("accept"); pass("user-agent");

  const method = ctx.request.method === "HEAD" ? "HEAD" : "GET";
  const init: RequestInit = { method, headers: fwd };
  const u = await fetch(upstream.toString(), init);

  // 透传这些响应头；若无 ETag 我们会后补
  const keep = ["content-type","cache-control","etag","last-modified","access-control-allow-origin","access-control-expose-headers"];
  const out = new Headers();
  for (const k of keep) { const v = u.headers.get(k); if (v) out.set(k, v); }
  if (!out.has("access-control-allow-origin")) out.set("access-control-allow-origin","*");
  if (!out.has("access-control-expose-headers")) out.set("access-control-expose-headers","ETag, Content-Length, Content-Type");
  out.set("x-portpulse-proxy","pages-functions");

  const inm = ctx.request.headers.get("if-none-match");

  // 工具函数：计算强 ETag（sha256）
  const calcStrongEtag = async (buf: ArrayBuffer) => {
    const hash = await crypto.subtle.digest("SHA-256", buf);
    const hex = [...new Uint8Array(hash)].map(b => b.toString(16).padStart(2, "0")).join("");
    return `"sha256-${hex}"`;
  };

  if (method === "GET") {
    // 如果上游没有 ETag，则计算；用 clone() 安全读取
    if (!out.has("etag")) {
      const buf = await u.clone().arrayBuffer();
      const etag = await calcStrongEtag(buf);

      // If-None-Match 命中 → 304（无 body）
      if (inm && inm.replace(/^W\//i,"") === etag.replace(/^W\//i,"")) {
        out.set("etag", etag);
        return new Response(null, { status: 304, headers: out });
      }

      out.set("etag", etag);
      return new Response(buf, { status: u.status, headers: out });
    }

    // 上游已有 ETag，直接透传；若命中则 304
    const upstreamEtag = out.get("etag")!;
    if (inm && inm.replace(/^W\//i,"") === upstreamEtag.replace(/^W\//i,"")) {
      return new Response(null, { status: 304, headers: out });
    }
    // 不命中则直接把上游 body 原样回送（不再重复读取）
    return new Response(u.body, { status: u.status, headers: out });
  }

  // HEAD：若无 ETag，补一个（做一次 GET 计算哈希，但不返回 body）
  if (method === "HEAD") {
    if (!out.has("etag")) {
      const probe = await fetch(upstream.toString(), { method: "GET", headers: fwd });
      const pbuf = await probe.arrayBuffer();
      out.set("etag", await calcStrongEtag(pbuf));
    }
    return new Response(null, { status: u.status, headers: out });
  }

  return new Response(null, { status: 405, headers: out });
};