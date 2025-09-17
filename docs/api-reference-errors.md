---
id: api-reference-errors
title: Error Model
sidebar_position: 2
slug: /api-reference/errors
---
# Errors

All error responses (HTTP `4xx`/`5xx`) use a **uniform JSON envelope**.

```json
{
  "code": "string",
  "message": "string",
  "request_id": "uuid",
  "hint": "string"
}
```

### Fields
- `code` — Machine‑readable error key (e.g. `auth_missing`, `auth_invalid`, `not_found`, `rate_limited`, `validation_failed`, `internal_error`).
- `message` — Human‑readable, single‑line explanation.
- `request_id` — UUID also emitted in the `x-request-id` response header. Include this when contacting support.
- `hint` — Optional actionable guidance (how to fix, when to retry, etc.).

> Errors are always returned as `application/json` **even if** you requested CSV (`format=csv`).

---

### HTTP status mapping

| Status | When it happens | Example `code` | Notes |
|---|---|---|---|
| `401 Unauthorized` | Missing `X-API-Key` or malformed key | `auth_missing` / `auth_invalid` | See [Authentication](/docs/authentication). |
| `403 Forbidden` | Key is valid but not allowed to access the resource | `auth_forbidden` | Contact support if you believe this is an error. |
| `404 Not Found` | Resource/port does not exist, or path is wrong | `not_found` | Double‑check UN/LOCODE or URL. |
| `409 Conflict` | Mutually exclusive parameters | `conflict` | Fix request and retry. |
| `422 Unprocessable Entity` | Invalid parameters or types | `validation_failed` | See example below. |
| `429 Too Many Requests` | Rate limit exceeded | `rate_limited` | Respect `Retry-After` header. See [Rate limits](/docs/api-reference/rate-limits). |
| `5xx` (Server error) | Transient/internal/ upstream failure | `internal_error` / `upstream_error` | Retry with **exponential backoff + jitter**. If persistent, provide `x-request-id`. |

**Response headers**
- `x-request-id`: unique ID for this request (echoed in body as `request_id`).
- `retry-after`: seconds to wait before retrying (`429` and occasionally `503`).

---

### Examples

#### 1) Missing key → `401 Unauthorized`
```bash
curl -i "https://api.useportpulse.com/v1/ports/USLAX/trend?window=7d"
```

Example response:
```http
HTTP/1.1 401 Unauthorized
x-request-id: 2f1c9b9d-2a3f-4612-8d4d-8f3b0c6a6d21
content-type: application/json
```
```json
{
  "code": "auth_missing",
  "message": "Missing X-API-Key header.",
  "request_id": "2f1c9b9d-2a3f-4612-8d4d-8f3b0c6a6d21",
  "hint": "Add header: X-API-Key: &lt;your_key&gt;."
}
```

#### 2) Invalid parameter → `422 Unprocessable Entity`
```bash
curl -s "https://api.useportpulse.com/v1/ports/USLAX/trend?window=sevendays" \
  -H "X-API-Key: dev_demo_123"
```

Example response:
```json
{
  "code": "validation_failed",
  "message": "window must be like 7d, 30d, 12h.",
  "request_id": "a3a1b0c5-8e12-4cec-9b2d-922d70f2a8f0",
  "hint": "Try window=7d or window=30d."
}
```

#### 3) Rate limited → `429 Too Many Requests`
```bash
curl -i "https://api.useportpulse.com/v1/ports/USLAX/trend?window=1d" \
  -H "X-API-Key: dev_demo_123"
```

Example response:
```http
HTTP/1.1 429 Too Many Requests
retry-after: 10
x-request-id: 6b2f2e9f-7f0e-48a2-9db9-09d77b1ad9cf
content-type: application/json
```
```json
{
  "code": "rate_limited",
  "message": "Rate limit exceeded.",
  "request_id": "6b2f2e9f-7f0e-48a2-9db9-09d77b1ad9cf",
  "hint": "Wait 10 seconds and retry. See docs for per-key quotas."
}
```

---

### Troubleshooting checklist
- Verify the header spelling and value: `X-API-Key: dev_demo_123` (demo key) or your live key.
- Recheck the endpoint path and parameters (`UNLOCODE`, `window`, `format`, etc.).
- If you get `429`, back off according to `Retry-After` and consider batching or caching.
- For repeated `5xx`, retry with backoff; if it persists, send us the `x-request-id` and timestamp.
- See also: [Authentication](/docs/authentication) • [Rate limits](/docs/api-reference/rate-limits)
