---
id: sla-status
title: SLA, SLOs & Status Page
sidebar_label: SLA & Status
description: Availability, latency and freshness objectives, service credits, and public status page practices.
---

This page describes our **SLO targets** (measured but non‑contractual), the **contractual SLA** (Pro and above), and how we communicate incidents on our public status page. It also clarifies definitions and measurement.

## SLO Targets (measured, non‑contractual)

| Metric                  | Target            | How we define it |
|------------------------|-------------------|------------------|
| Availability (monthly) | **≥ 99.9%**       | 1 − `outage_minutes / total_minutes` (UTC calendar month), excluding planned maintenance. |
| Read latency (p95)     | **&lt; 300 ms**   | p95 across successful `GET` reads; when applicable, measured from edge cache. |
| Data freshness (p95)   | **≤ 2 hours**     | `now() − as_of` for read endpoints that include an `as_of` or `last_updated` field. |
| Replay window          | **30 days**       | Continuous historical reads with no gaps for trend endpoints. |

> These targets reflect what customers should typically observe. Only the **SLA** below is contractual for Pro+ plans.

## SLA (contractual, Pro and above)

If monthly availability (UTC) falls below the thresholds below, you can request service credits:

| Measured availability (month) | Service credit |
|-------------------------------|----------------|
| **99.9% → 99.5%**             | **10%** of the monthly fee |
| **&lt; 99.5%**                 | **25%** of the monthly fee |

**Exclusions.** SLA does not apply to: (a) customer‑caused incidents (misconfiguration, abusive traffic), (b) upstream ISP/carrier failures outside our control, (c) force majeure, and (d) scheduled maintenance announced ≥ 24h in advance on the status page.

**Credit application.** Credits are applied to the **next invoice** once approved.

## Definitions

- **Availability** — ability to successfully perform reads on core endpoints (`/v1/health`, `/v1/meta/sources`, `/v1/ports/{code}/trend`), excluding planned maintenance windows.
- **p95 latency** — 95th percentile of successful `GET` response times within the month, aggregated across regions.
- **Data freshness** — `now() − as_of` (or `last_updated`) reported by the API payload. Freshness is computed per‑endpoint then summarized as p95.
- **Replay window** — how far back you can request historical data (e.g., `?window=30d`), with no gaps.

## How we measure

- External probes run from multiple regions against:
  - `/v1/health`
  - `/v1/meta/sources`
  - `/v1/ports/USLAX/trend`
- Uptime is computed as **1 − outage_minutes / total_minutes** per UTC calendar month.
- Latency SLO is calculated on **p95** across successful reads.
- Data freshness SLO uses the payload’s `as_of` / `last_updated` fields.

### Self‑check (you can reproduce)

```bash
API_KEY="dev_demo_123"
# Health
curl -i "https://api.useportpulse.com/v1/health" \
  -H "X-API-Key: ${API_KEY}" -H "X-Request-Id: demo-sla-check"

# Example trend read (freshness seen in payload fields)
curl -s "https://api.useportpulse.com/v1/ports/USLAX/trend?window=30d&amp;format=json" \
  -H "X-API-Key: ${API_KEY}" | head -n 20
```

## Status page & incident communication

- Public status: **status.useportpulse.com** — current incidents, historical uptime, and regional partitions.
- We classify incidents by severity and provide updates at regular intervals until resolved.
- Each incident includes a timeline: identification → mitigation → recovery → **post‑mortem** (published within **5 business days**).

## Planned maintenance

- Standard window (if needed): **Saturdays 02:00–04:00 UTC**, announced ≥ 24h in advance on the status page.
- We aim for **zero‑downtime** deploys; maintenance is rare and typically affects only write/admin paths.

## How to request an SLA credit

1. Email **support@useportpulse.com** within **30 days** after the impacted month.
2. Include your **organization name**, plan, impacted **time window (UTC)**, and your **`X-Request-Id`** samples.
3. Attach minimal reproduction (endpoint + query) and any relevant dashboards/logs.
4. We validate against our independent probes and respond within **10 business days**.

## Support & escalation

- Email: **support@useportpulse.com**
- Include **`x-request-id`**, UTC timestamp, endpoint, query string, and a minimal `curl` reproduction (see above).

## Security & privacy

- API keys are prefixed (`pp_dev_*`, `pp_live_*`) and scoped by least privilege.
- We avoid personal data by design and follow GDPR/CCPA principles.
- Auditability: structured logs with `request_id`; retention aligned with legal requirements.

## Related

- Error model: **/docs/errors**
- Rate limits: **/docs/rate-limits**
- Changelog & deprecations: **/docs/changelog**
