---
id: endpoints
title: Endpoints
sidebar_position: 1
slug: /api-reference/endpoints
---

| Endpoint | Purpose | Notes |
|---|---|---|
| `/v1/health` | service health | 200 with timestamp |
| `/v1/sources` | data sources & last fetch times | JSON |
| `/v1/ports/{UNLOCODE}/trend` | time-series congestion metrics | `window=7d/14d/30d` · `format=json|csv` |
| `/v1/ports/{UNLOCODE}/snapshot` | latest snapshot | point-in-time |
| `/v1/ports/{UNLOCODE}/dwell` | dwell/wait sequences | no data → 200 empty array |
| `/v1/ports/{UNLOCODE}/alerts` | thresholds/change-points | includes `severity` & `explain` |
| `/v1/hs/{code}/imports` | trade momentum (beta) | JSON & CSV (+ETag/304) |

**Auth:** `X-API-Key` header required.  
**IDs:** UN/LOCODE (e.g., `USLAX`, `SGSIN`, `NLRTM`).
