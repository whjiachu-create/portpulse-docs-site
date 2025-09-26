---
id: api-reference-rate-limits
title: Rate limits
sidebar_position: 3
slug: /api-reference/rate-limits
---

## Overview

PortPulse applies **per‑API key** limits to keep the platform reliable for everyone. Limits are enforced with a token‑bucket style throttler and short bursts are allowed.

- **Baseline:** ~**60 requests/minute** (rpm) **per key**, with short **burst ×5** headroom.
- **Scope:** counted **per API key** across IPs/services. Additional protective WAF rules may apply during incidents.
- **Window:** sliding 60s.
- **Versioning:** limits and quotas may be tuned per plan as the product evolves; breaking changes are announced in the [Changelog](/docs/changelog).

## Plans & monthly quotas

| Plan    | Baseline rate (per key) | Monthly quota (requests) | Notes |
|:--------|:-------------------------|:--------------------------|:------|
| Lite    | ~60 rpm (burst ×5)       | ≤ **0.5M**                | Fair‑use; upgrade recommended if you hit sustained throttling. |
| Starter | ~60 rpm (burst ×5)       | ≤ **2M**                  | Priority support routing. |
| Pro     | ~60 rpm (burst ×5)\*     | **5–10M**                 | Higher/consolidated limits available on request. |

\* Pro/Enterprise keys can be granted custom baselines or burst windows. If you need higher throughput, reach out and we’ll right‑size your limits.

## What you’ll see on throttling

When you exceed your effective limit, requests return **HTTP `429 Too Many Requests`** with PortPulse’s standard error body:

```json
{
  "code": "rate_limited",
  "message": "Too many requests. Slow down and retry later.",
  "request_id": "req_1234567890",
  "hint": "Respect Retry-After and apply exponential backoff."
}
```

Important response headers:

- **`Retry-After`** — seconds to wait before the next attempt.
- **`x-request-id`** — copy this when contacting support or for log correlation.

> Errors always return **JSON**, even if you requested CSV. See [Errors](/docs/api-reference/errors) for the common format.

## How to back off correctly

1. **Always honor `Retry-After`** if present.  
2. Otherwise use **exponential backoff with jitter** (e.g., 1s → 2s → 4s → 8s; add ±20% random jitter).  
3. **Cap** the wait (e.g., 16–30s) and stop after a reasonable number of retries.  
4. **Queue** and **throttle client‑side** if you run high‑QPS batch jobs.  
5. Prefer **incremental fetch** and **conditional requests** (ETag/`304`) for CSV—see [CSV & ETag](/docs/csv-etag).

### Minimal examples

**cURL**

```bash
# Replace the demo key with your live key in production
API_KEY="dev_demo_123"

curl -i \
  -H "X-API-Key: ${API_KEY}" \
  "https://api.useportpulse.com/v1/ports/USLAX/trend?window=30&amp;format=json"
# If throttled, you'll receive HTTP/1.1 429 and a Retry-After header.
```

**Python (requests) — retry with backoff + Retry-After**

```python
import time, random, requests

API_KEY = "dev_demo_123"
URL = "https://api.useportpulse.com/v1/ports/USLAX/trend?window=30"

def get_with_backoff(url, headers, max_retries=5, base=1.0, cap=16.0):
    for attempt in range(max_retries):
        r = requests.get(url, headers=headers)
        if r.status_code != 429:
            return r
        # honor Retry-After if provided
        retry_after = r.headers.get("Retry-After")
        if retry_after and retry_after.isdigit():
            wait = float(retry_after)
        else:
            wait = min(cap, base * (2 ** attempt)) * (0.8 + 0.4 * random.random())
        time.sleep(wait)
    r.raise_for_status()
    return r

resp = get_with_backoff(URL, {"X-API-Key": API_KEY})
print(resp.status_code)
print(resp.json()[:1])  # peek
```

**JavaScript (fetch)**

```js
const API_KEY = "dev_demo_123";
const URL = "https://api.useportpulse.com/v1/ports/USLAX/trend?window=30";

async function fetchWithBackoff(url, { maxRetries = 5 } = {}) {
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    const res = await fetch(url, { headers: { "X-API-Key": API_KEY } });
    if (res.status !== 429) return res;

    // Honor Retry-After if present (seconds)
    const ra = res.headers.get("Retry-After");
    let wait = ra ? Number(ra) : Math.min(16, Math.pow(2, attempt));
    // add ±20% jitter
    wait = wait * (0.8 + Math.random() * 0.4);
    await new Promise(r => setTimeout(r, wait * 1000));
  }
  throw new Error("Too many retries after HTTP 429");
}

fetchWithBackoff(URL).then(async r => {
  console.log(r.status);
  console.log((await r.json()).slice(0, 1));
});
```

## Operational notes

- Limits are **subject to change** for platform stability; we will communicate material adjustments in advance via the [Changelog](/docs/changelog) and Status updates.  
- If you see sustained `429`s despite backoff, consider batching, caching, or requesting a **higher plan/limit**.
- For incident visibility and SLOs, see **[SLA & Status](/docs/ops/sla-status)**.

## FAQ

**Is the limit per IP or per account?**  
Per **API key**. Multiple services using the same key will share the limit.

**Do CSV endpoints count the same as JSON?**  
Yes. All HTTP requests count toward your per‑key rate.

**Can I get higher limits?**  
Yes. Pro/Enterprise can be granted higher baselines and/or burst windows. Contact us with your use case and observed `429` rate.

