---
id: methodology
title: Methodology & Definitions
sidebar_label: Methodology
description: Source cadence, field definitions, formulas and calculation notes for PortPulse metrics.
---

> This page is the **normative reference** for how PortPulse calculates congestion, dwell and related metrics. It is versioned together with the API contract. When this page changes in a breaking manner, the API moves to `/v1beta` and a deprecation cycle starts (see [/docs/changelog](/docs/changelog)).

## Scope

- **Product scope**: port congestion, dwell, snapshots, trends, alerts; HS imports (beta).
- **Granularity**: **port level**, keyed by **UN/LOCODE** (e.g., `USLAX`).
- **Time conventions**: all timestamps are **UTC**, RFC3339.

## Sources & Cadence

- Multi-source (public/authorized): port authority notices, vessel events, AIS-derived movement summaries, customs/official statistical releases (for HS).
- Ingestion: **hourly ETL**, exponential retries; failed jobs are **backfilled next day**.
- Coverage target: **≥67 ports**, **30‑day replay** with **no gaps**.
- Each record carries an `as_of` (UTC) and a stable `source_id`.

## Entities & Keys

| concept         | key / example        | notes |
|-----------------|----------------------|-------|
| Port            | UN/LOCODE (`USLAX`)  | Primary key across all endpoints. Aliases normalize to UN/LOCODE. |
| Day bucket      | `YYYY‑MM‑DD`         | Used by `/trend` and dwell distributions. |
| Snapshot        | `as_of` (RFC3339)    | Latest event per day is kept when multiple updates exist. |

## Core Fields (Contract)

| field                | type          | example                 | contract notes |
|----------------------|---------------|-------------------------|----------------|
| `as_of`              | RFC3339       | `2025-09-08T12:00:00Z` | Snapshot timestamp. |
| `date`               | date          | `2025-09-08`           | Daily bucket in `/trend` and dwell. |
| `vessel_count`       | integer       | `57`                    | Population used for statistics. |
| `avg_wait_hours`     | number        | `36.7`                  | Trimmed mean on the window. |
| `dwell_hours`        | number        | `21.5`                  | Median dwell time (where applicable). |
| `congestion_score`   | number [0..1] | `0.62`                  | Normalized congestion index. |
| `request_id`         | string        | `req_01HE..`            | Present on all responses; log it in tickets. |

## Formulas (High-level)

We publish high-level formulas to ensure **reproducibility** across clients. Pseudocode is illustrative and may omit micro-optimizations.

### 1) Trimmed mean wait (per day)

```
# inputs: waits[] in hours for vessels contributing that day
if len(waits) < MIN_SAMPLE: return null
sorted = sort(waits)
lo = quantile(sorted, 0.02)
hi = quantile(sorted, 0.98)
winsorized = clamp_each(waits, lo, hi)
avg_wait_hours = mean(winsorized)
```

### 2) Median dwell hours

```
# inputs: dwell_durations[] in hours
if len(dwell_durations) < MIN_SAMPLE: return null
dwell_hours = median(dwell_durations)
```

### 3) Congestion score (0–1)

```
# normalized by corridor-specific baseline
z = robust_z(avg_wait_hours, corridor_baseline, corridor_scale)
congestion_score = sigmoid(z)
```

Where `robust_z` uses MAD or IQR; parameters are corridor-specific and available on request for audit.

## Data Quality & Missing Data

- Same-day multiple updates → we keep the **latest** by `as_of`.
- Missing data returns **200 with an empty array**; we never emit sentinel numbers.
- Each daily point has **minimum-sample checks**; otherwise the field is `null`.
- Hourly ETL with **retry + next-day backfill**; backfills never rewrite historical data outside the documented replay window.

## CSV & Caching

- JSON and CSV carry the **same keys** and the same ordering.
- Read endpoints return `Cache-Control: public, max-age=300`.
- CSV responses use **strong ETag**; use conditional requests to avoid re-downloading unchanged data.
- See details in **[CSV & ETag](/docs/csv-etag)**.

### Example: 30‑day trend + ETag/304 (cURL)

```bash
# Replace the demo key with your own when ready
API_KEY="dev_demo_123"

# First fetch (JSON)
curl -sS -H "X-API-Key: $API_KEY" \
  "https://api.useportpulse.com/v1/ports/USLAX/trend?window=30d" \
  -o trend.json

# First CSV fetch and capture ETag
curl -sS -H "X-API-Key: $API_KEY" \
  -H "Accept: text/csv" \
  -D headers.txt \
  "https://api.useportpulse.com/v1/ports/USLAX/trend?window=30d" \
  -o trend.csv

# Conditional CSV fetch (returns 304 if unchanged)
ETAG=$(grep -i '^ETag:' headers.txt | awk '{print $2}' | tr -d '\r')
curl -sS -H "X-API-Key: $API_KEY" \
  -H "If-None-Match: $ETAG" \
  "https://api.useportpulse.com/v1/ports/USLAX/trend?window=30d" \
  -o trend_2.csv -w "HTTP %{http_code}\n"
```

## Definitions (Glossary)

- **Freshness**: `now - as_of` at request time. SLO target: p95 ≤ **2 hours**.
- **Replay window**: continuous historical range we guarantee to serve without gaps; target **30 days**.
- **Corridor**: trade lane grouping with shared baselines (e.g., Asia→USWC).

## Reproducibility Checklist

- Pin endpoints and query params in pipelines; do not depend on undocumented fields.
- Use OpenAPI for type generation; treat unknown fields as non-existent.
- Save `request_id` in logs when contacting support; include raw `curl` for repro.
- Track changes via **[Changelog](/docs/changelog)**; breaking methodology changes map to `/v1beta`.

## See also

- **[Field Dictionary](/docs/guides/field-dictionary)**
- **[Rate limits](/docs/guides/rate-limits)**
- **[Errors & conventions](/docs/guides/errors)**
- **[SLA & Status](/docs/ops/sla-status)**
- **[Endpoints](/docs/api-reference/endpoints)**
