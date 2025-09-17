---
id: quickstarts
title: Quickstarts
sidebar_position: 2
slug: /quickstarts
---

### Set environment
~~~bash
export API_BASE="https://api.useportpulse.com"
export API_KEY="DEMO_KEY"   # replace with your live key
~~~

### cURL — 30-day trend (JSON) and CSV/ETag
~~~bash
# JSON
curl -H "X-API-Key: $API_KEY" \
  "$API_BASE/v1/ports/USLAX/trend?window=30d&format=json" | jq .

# CSV + first response headers
curl -i -H "X-API-Key: $API_KEY" \
  "$API_BASE/v1/ports/USLAX/trend?window=14d&format=csv" | sed -n '1,12p'

# ETag/304 validation
ETAG=$(curl -s -D - -o /dev/null -H "X-API-Key: $API_KEY" \
  "$API_BASE/v1/ports/USLAX/trend?window=14d&format=csv" \
  | awk 'BEGIN{IGNORECASE=1}/^etag:/{gsub(/\r|\"/,"");print $2}')
curl -I -H "X-API-Key: $API_KEY" -H "If-None-Match: \"$ETAG\"" \
  "$API_BASE/v1/ports/USLAX/trend?window=14d&format=csv"
~~~

### Python — quick plot
~~~python
import requests, matplotlib.pyplot as plt
BASE="https://api.useportpulse.com"; KEY="DEMO_KEY"
r=requests.get(f"{BASE}/v1/ports/USLAX/trend?window=30d",headers={"X-API-Key":KEY})
data=r.json()
x=[d["date"] for d in data]
y=[d.get("congestion_score",0) for d in data]
plt.plot(x,y,marker="o"); plt.xticks(rotation=45); plt.title("USLAX (30d)")
plt.ylabel("Congestion Score"); plt.tight_layout(); plt.show()
~~~

### Node.js (fetch)
~~~js
const BASE=process.env.API_BASE||"https://api.useportpulse.com";
const KEY =process.env.API_KEY ||"DEMO_KEY";
const res=await fetch(`${BASE}/v1/ports/USLAX/trend?window=30d`,{headers:{'X-API-Key':KEY&#125;&#125;);
console.log((await res.json()).slice(0,5));
~~~

**Next**: API Reference → Endpoints; Guides → CSV & ETag; Tools → Insomnia/Postman.
