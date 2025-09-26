---
id: api-reference-endpoints
title: Endpoints
sidebar_position: 1
slug: /api-reference/endpoints
---

## Overview

**Base URL:** `https://api.useportpulse.com`

All endpoints are **GET** unless stated otherwise.

**Authentication:** send your key in the header `X-API-Key`. For demos in this page we use
`X-API-Key: dev_demo_123`.

**Identifiers:** Ports use **UN/LOCODE** (e.g., `USLAX`, `SGSIN`, `NLRTM`). See the
[Field Dictionary](/docs/guides/field-dictionary) for definitions and units.

> See also: [Authentication](/docs/authentication), [Rate limits](/docs/api-reference/rate-limits),
> [Errors](/docs/api-reference/errors), and [CSV & ETag](/docs/csv-etag).

---

### Endpoint catalog

| Endpoint | Purpose | Notes |
|---|---|---|
| `/v1/health` | service health | returns `200` with timestamp |
| `/v1/meta/sources` | data sources & last fetch times | JSON |
| `/v1/ports/{UNLOCODE}/trend` | time‑series congestion metrics | `window=7|14d|30d` · `format=json|csv` |
| `/v1/ports/{UNLOCODE}/snapshot` | latest snapshot | point‑in‑time |
| `/v1/ports/{UNLOCODE}/dwell` | dwell / wait sequences | no data → `200` empty array |
| `/v1/ports/{UNLOCODE}/alerts` | thresholds & change‑points | includes `severity` and `explain` |
| `/v1/hs/{code}/imports` | trade momentum (beta) | JSON & CSV (ETag/304) |

---

## `GET /v1/health`

Lightweight probe for availability.

**Response (200):**
```json
{
  "status": "ok",
  "time": "2025-09-08T10:24:11Z",
  "region": "global"
}
```

**Quick test:**
```bash
curl -s https://api.useportpulse.com/v1/health | jq .
```

---

## `GET /v1/meta/sources`

> Alias: `/v1/sources` (backward compatible). Prefer `/v1/meta/sources` in all integrations.

Returns the upstream data sources and the most recent successful fetch times.

**Request:**
```bash
curl -H "X-API-Key: dev_demo_123" \
  https://api.useportpulse.com/v1/meta/sources
```

**Response (200):**
```json
[
  {"source":"ais_public","last_fetch_iso":"2025-09-08T09:55:00Z"},
  {"source":"port_bulletins","last_fetch_iso":"2025-09-08T09:40:00Z"}
]
```

---

## `GET /v1/ports/{UNLOCODE}/trend`

Time‑series metrics for a port (e.g., congestion score, average wait hours).

**Query parameters**
- `window` (required): one of `7d`, `14d`, `30d`.
- `format` (optional): `json` (default) or `csv`.

**Example (JSON):**
```bash
curl -H "X-API-Key: dev_demo_123" \
  "https://api.useportpulse.com/v1/ports/USLAX/trend?window=30&format=json"
```

**Response (200 JSON):**
```json
[
  {"date":"2025-08-10","congestion_score":0.42,"avg_wait_hours":18.7,"vessels":73},
  {"date":"2025-08-11","congestion_score":0.45,"avg_wait_hours":19.3,"vessels":75}
]
```

**Example (CSV + strong ETag/304):**
```bash
curl -H "X-API-Key: dev_demo_123" \
  "https://api.useportpulse.com/v1/ports/USLAX/trend?window=14&format=csv" -I
# ...
# HTTP/1.1 200 OK
# Cache-Control: public, max-age=300
# ETag: "04b3d5..."
```

**CSV preview:**
```csv
date,congestion_score,avg_wait_hours,vessels
2025-08-10,0.42,18.7,73
2025-08-11,0.45,19.3,75
```

---

## `GET /v1/ports/{UNLOCODE}/snapshot`

Latest point‑in‑time snapshot for a port.

**Request:**
```bash
curl -H "X-API-Key: dev_demo_123" \
  https://api.useportpulse.com/v1/ports/SGSIN/snapshot
```

**Response (200):**
```json
{
  "port":"SGSIN",
  "as_of":"2025-09-08T09:50:00Z",
  "congestion_score":0.31,
  "avg_wait_hours":12.4,
  "vessels": {
    "arrivals_24h":58,
    "departures_24h":57,
    "at_anchor":21,
    "in_port":102
  }
}
```

---

## `GET /v1/ports/{UNLOCODE}/dwell`

Returns sequences of dwell/wait periods derived from vessel calls. If there is no data,
returns **`200` with an empty array**.

**Request:**
```bash
curl -H "X-API-Key: dev_demo_123" \
  https://api.useportpulse.com/v1/ports/NLRTM/dwell
```

**Response (200):**
```json
[
  {"start":"2025-08-29T06:10:00Z","end":"2025-08-29T18:40:00Z","kind":"wait","hours":12.5},
  {"start":"2025-08-30T03:00:00Z","end":"2025-08-30T10:10:00Z","kind":"berth","hours":7.2}
]
```

---

## `GET /v1/ports/{UNLOCODE}/alerts`

Threshold or change‑point alerts for key metrics.

**Request:**
```bash
curl -H "X-API-Key: dev_demo_123" \
  https://api.useportpulse.com/v1/ports/USLAX/alerts
```

**Response (200):**
```json
[
  {
    "type":"threshold",
    "metric":"congestion_score",
    "severity":"high",
    "change_pct":0.22,
    "as_of":"2025-09-08T09:00:00Z",
    "explain":"7‑day score rose above the 0.40 threshold"
  }
]
```

---

## `GET /v1/hs/{code}/imports` *(beta)*

Monthly import momentum by HS code (beta). Supports JSON and CSV with strong ETag/304.

**Request (JSON):**
```bash
curl -H "X-API-Key: dev_demo_123" \
  https://api.useportpulse.com/v1/hs/8501/imports
```

**Response (200 JSON):**
```json
[
  {"month":"2025-06","index":104.2},
  {"month":"2025-07","index":107.8}
]
```

**Request (CSV):**
```bash
curl -H "X-API-Key: dev_demo_123" \
  "https://api.useportpulse.com/v1/hs/8501/imports?format=csv"
```

---

## Status codes & headers

- `200` — success.
- `304` — not modified (CSV with `If-None-Match`).
- `400` — bad request (see `hint` in [Errors](/docs/api-reference/errors)).
- `401/403` — authentication/authorization failed.
- `404` — not found (e.g., unknown UN/LOCODE).
- `429` — too many requests (see [Rate limits](/docs/api-reference/rate-limits)).
- `5xx` — service error.

**Common response headers**
- `X-Request-Id`: unique id for support.
- `Cache-Control`: `public, max-age=300` on read endpoints.
- `ETag`: strong validator on CSV endpoints.
- `Retry-After`: present on `429`.

---

## Minimal client examples

**cURL**
```bash
curl -H "X-API-Key: dev_demo_123" \
  "https://api.useportpulse.com/v1/ports/USLAX/trend?window=30"
```

**Python**
```python
import requests
r = requests.get(
    "https://api.useportpulse.com/v1/ports/USLAX/trend?window=30",
    headers={"X-API-Key":"dev_demo_123"}
)
print(r.json()[:2])
```

**Node.js**
```js
const res = await fetch(
  "https://api.useportpulse.com/v1/ports/USLAX/trend?window=30",
  { headers: { "X-API-Key": "dev_demo_123" } }
);
console.log(await res.json());
```

> For field definitions and calculation notes, see the
> [Field Dictionary](/docs/guides/field-dictionary) and [Methodology](/docs/methodology).
