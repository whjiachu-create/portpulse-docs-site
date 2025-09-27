---
id: quickstarts
title: Quickstarts
sidebar_position: 2
slug: /quickstarts
---

### Set environment
~~~bash
export API_BASE="https://api.useportpulse.com"
export API_KEY="dev_demo_123"   # demo key; replace with your live key in production
~~~

### cURL — 30-day trend (JSON) and CSV/ETag
~~~bash
# JSON (pretty-printed with jq)
curl -sS -H "X-API-Key: $API_KEY" \
  "$API_BASE/v1/ports/USLAX/trend?window=30&format=json" | jq .

# CSV + show first response headers
curl -sS -i -H "X-API-Key: $API_KEY" \
  "$API_BASE/v1/ports/USLAX/trend?window=14&format=csv" | sed -n '1,20p'

# ETag/304 validation (second call should return 304 Not Modified)
ETAG=$(
  curl -s -D - -o /dev/null -H "X-API-Key: $API_KEY" \
    "$API_BASE/v1/ports/USLAX/trend?window=14&format=csv" \
  | awk 'BEGIN{IGNORECASE=1} /^etag:/{gsub(/\r|\"/,"");print $2}'
)
curl -I -H "X-API-Key: $API_KEY" -H "If-None-Match: \"$ETAG\"" \
  "$API_BASE/v1/ports/USLAX/trend?window=14&format=csv"
~~~

### Python — quick plot
~~~python
import requests, matplotlib.pyplot as plt
BASE = "https://api.useportpulse.com"; KEY = "dev_demo_123"
r = requests.get(f"{BASE}/v1/ports/USLAX/trend?window=30",
                 headers={"X-API-Key": KEY}, timeout=30)
r.raise_for_status()
data = r.json()
x = [d["date"] for d in data]
y = [d.get("congestion_score", 0) for d in data]
plt.plot(x, y, marker="o")
plt.xticks(rotation=45)
plt.title("USLAX — 30d congestion")
plt.ylabel("Congestion Score")
plt.tight_layout()
plt.show()
~~~

### Node.js (fetch)
~~~js
// Node 18+ has global fetch. For Node <18, install: npm i node-fetch
const BASE = process.env.API_BASE || "https://api.useportpulse.com";
const KEY  = process.env.API_KEY  || "dev_demo_123";

(async () => {
  const res = await fetch(`${BASE}/v1/ports/USLAX/trend?window=30`, {
    headers: { "X-API-Key": KEY }
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const data = await res.json();
  console.log(data.points ? data.points.slice(0, 5) : data.slice(0, 5));
})();
~~~

**Next**: [API Reference → Endpoints](/docs/api-reference-endpoints) ·
[CSV &amp; ETag](/docs/csv-etag) ·
Guides: [Rate Limits](/docs/guides-rate-limits), [Errors](/docs/guides-errors), [Field Dictionary](/docs/guides-field-dictionary) ·
Tools: [Insomnia](/docs/insomnia), [Postman](/docs/postman)
