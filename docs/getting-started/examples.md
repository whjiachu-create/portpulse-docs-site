---
id: examples
title: Examples
sidebar_position: 3
slug: /getting-started/examples
---

# Examples

A few copy‑paste examples to help you hit the API quickly.

> Demo API key for all examples: `dev_demo_123`  
> Replace with your own key when available.

## Prerequisites

- `curl` available in your shell
- Optional: Python 3.9+ with `requests`, Node.js 18+ (for the language examples)

Set two environment variables once per shell:

```bash
export API_BASE="https://api.useportpulse.com"
export API_KEY="dev_demo_123"
```

---

## 1) Get JSON trend (30d)

Los Angeles (USLAX), last 30 days, JSON:

```bash
curl -sS -H "X-API-Key: $API_KEY" \
  "$API_BASE/v1/ports/USLAX/trend?window=30d&format=json" | jq .
```

(You can omit `| jq .` if `jq` is not installed.)

---

## 2) Export CSV to a file

Rotterdam (NLRTM), last 14 days, CSV to a local file:

```bash
curl -sS -H "X-API-Key: $API_KEY" \
  "$API_BASE/v1/ports/NLRTM/trend?window=14d&format=csv" > rotterdam.csv
```

Quick peek:

```bash
head -5 rotterdam.csv
```

CSV responses include a strong `ETag` header so you can re‑use/cache efficiently.

---

## 3) Probe cache and ETag (HEAD)

Check headers only (Singapore, SGSIN):

```bash
curl -I -H "X-API-Key: $API_KEY" \
  "$API_BASE/v1/ports/SGSIN/trend?window=14d&format=csv"
```

You should see headers like:

- `cache-control: public, max-age=300`
- `etag: "..."`

---

## 4) Conditional request (If-None-Match → 304)

First, fetch once and capture the ETag:

```bash
ETAG=$(curl -sI -H "X-API-Key: $API_KEY" \
  "$API_BASE/v1/ports/SGSIN/trend?window=14d&format=csv" | awk -F': ' 'tolower($1)=="etag"{print $2}' | tr -d '\r')
echo "$ETAG"
```

Then send it back to avoid downloading unchanged content:

```bash
curl -sI -H "X-API-Key: $API_KEY" -H "If-None-Match: $ETAG" \
  "$API_BASE/v1/ports/SGSIN/trend?window=14d&format=csv"
# Expect: HTTP/1.1 304 Not Modified
```

---

## 5) Alerts (changes & thresholds)

New York / New Jersey (USNYC), last 14 days:

```bash
curl -sS -H "X-API-Key: $API_KEY" \
  "$API_BASE/v1/ports/USNYC/alerts?window=14d"
```

Typical response (example):

```json
[
  {"date":"2025-08-21","severity":"high","code":"CONGESTION_SPIKE","explain":"p95 wait +38% vs 7d baseline"},
  {"date":"2025-08-25","severity":"medium","code":"DWELL_ELEVATED","explain":"avg_wait_hours above 75p"}
]
```

---

## 6) Python (minimal)

```python
import requests

API_BASE = "https://api.useportpulse.com"
API_KEY = "dev_demo_123"

r = requests.get(
    f"{API_BASE}/v1/ports/USLAX/trend",
    params={"window": "30d", "format": "json"},
    headers={"X-API-Key": API_KEY},
    timeout=20,
)
r.raise_for_status()
data = r.json()  # [{"date":"2025-08-01","congestion_score":0.45,...}, ...]
print(len(data), "points")
```

---

## 7) Node.js (fetch)

```js
const API_BASE = "https://api.useportpulse.com";
const API_KEY = "dev_demo_123";

const url = `${API_BASE}/v1/ports/SGSIN/overview`;
const res = await fetch(url, { headers: { "X-API-Key": API_KEY } });
if (!res.ok) throw new Error(`HTTP ${res.status}`);
const body = await res.json();
console.log(body);
```

---

## Troubleshooting

- **401/403**: Check `X-API-Key` header or environment variable.  
- **404**: Verify UN/LOCODE (e.g., `USLAX`, `SGSIN`, `NLRTM`).  
- **429**: You’ve hit the limit — see [Rate Limits](/docs/guides/rate-limits).  
- **Other errors**: See [Errors](/docs/guides/errors) and include `x-request-id` when contacting support.

---

## Next steps

- Browse the [API Reference](/docs/api-reference/endpoints)  
- Learn about caching with CSV + ETag in [CSV & ETag](/docs/csv-etag)  
- Full authentication details: [Authentication](/docs/authentication)
