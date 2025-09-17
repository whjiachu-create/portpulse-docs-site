---
title: SLA & Status
---

# SLA & Status

This page describes our service objectives (SLO), contractual Service Level Agreement (SLA, Pro+ plans), how we measure them, and how you can self‑check service health.

> **Demo key for examples:** `dev_demo_123`  
> Replace with your own key in production.

---

## At a glance

| Dimension     | Target (SLO for all plans)                    | How we measure (high level)                                  |
| ---           | ---                                            | ---                                                          |
| Availability  | **99.9% monthly**                             | Minute-level uptime of the **data plane** (read APIs)        |
| Latency       | **p95 &lt; 300ms** for cached reads            | p95 of end-to-end server time at edge (CDN + API)            |
| Freshness     | **p95 ≤ 2 hours**                             | p95 of `now() - last_updated` across covered ports           |
| Versioning    | **/v1 contract-frozen**                       | Breaking changes ship behind `/v1beta`; deprecations ≥ 90d   |

SLA (service credits) applies to **Pro and Enterprise** subscriptions. Free/Trial/Lite/Starter receive the SLO commitments (best effort) and full transparency via status communications.

See also: [/openapi](/openapi) · [/docs/rate-limits](/docs/rate-limits) · [/docs/errors](/docs/errors) · [/docs/changelog](/docs/changelog)

---

## Public status & communications

- **Status page:** Public status communications and incident timelines will be posted on our Status Page (coming soon). Until then, refer to the **Changelog** and this **SLA** page for important notices.
- **Incident comms:** For Sev‑1/2 incidents we provide real‑time updates (initial ETA within 30 minutes; cadence 60 minutes until resolved).
- **Subscribe:** Email `support@useportpulse.com` to subscribe to status updates.

---

## Definitions

- **Availability:** 1 − (user minutes of downtime ÷ total user minutes) in a calendar month, measured for the **read APIs** (data plane).  
- **Downtime:** A continuous 5‑minute interval with **error rate ≥ 5%** or **median latency ≥ 10× baseline** for the same endpoint/region.  
- **Freshness:** `now() - last_updated` of the dataset used to answer a request; we compute p50/p95 by port and overall.  
- **Latency (p95):** 95th percentile of server processing time as observed at the edge, excluding client/ISP delays.  
- **Replay window:** Historical lookback window guaranteed for time‑series endpoints (baseline: 30 days).  
- **Planned maintenance:** Announced changes with a stated window; see “Planned maintenance”.

---

## Measurement details

### Availability
- We monitor from multiple regions. A minute is **available** if ≥ 2 regions record success for a given endpoint family.  
- Control plane (billing, console) is **excluded** from availability calculations, but incidents are still communicated.

### Latency
- Reported as **p95** per endpoint family, aggregated daily and monthly. Cached reads are served at the edge; cold reads may be slower.

### Freshness
- For each port we compute `freshness_seconds = now() - last_updated`.  
- **Target:** p95 ≤ 2h across covered ports. Some ports may temporarily exceed this during source outages; we will disclose these in the status notes.

---

## Service credits (SLA — Pro/Enterprise)

If monthly **Availability** falls below **99.9%** for your account (excluding the items under “Exclusions”), you may request a service credit:

| Monthly availability | Credit on monthly fee |
| --- | --- |
| **99.0% – &lt; 99.9%** | **10%** |
| **97.0% – &lt; 99.0%** | **25%** |
| **&lt; 97.0%** | **50%** |

**Claim window:** within **30 days** after the month ends.  
**How to claim:** Email `billing@useportpulse.com` with (a) your account email, (b) the affected time window, and (c) **at least two** representative `x-request-id` values from failed calls.  
**Cap:** Combined credits for a month won’t exceed **100%** of that month’s fee. Credits are applied to future invoices only.

---

## Exclusions

SLA/SLO calculations exclude:
- Scheduled maintenance windows announced at least **72 hours** earlier.  
- Outages caused by customer networks, ISPs, DNS, misconfiguration, or **rate limit**/abuse safeguards.  
- Issues in **beta** endpoints or non‑production environments.  
- Force majeure events (e.g., large Internet routing incidents, natural disasters).  
- Third‑party data source outages that prevent updates; we will communicate impact under “Freshness notes”.

---

## Planned maintenance

- We aim for **zero‑downtime** changes. If downtime is unavoidable, we schedule in off‑peak UTC hours and announce at least **72 hours** in advance with start/end time and impact.
- Maintenance windows typically last **≤ 60 minutes**.

---

## Incident severity & response

| Severity | Example impact | Initial response | Update cadence | Workaround |
| --- | --- | --- | --- | --- |
| **Sev‑1** | Majority of read APIs failing or stale &gt; 12h | &lt; 30 min | 60 min | Prefer cached CSV/ETag or fallback snapshots |
| **Sev‑2** | Regional errors, p95 latency degradation, stale 4–12h | &lt; 1 h | 2 h | Retry with backoff; use alternate region |
| **Sev‑3** | Minor feature degradation; partial dataset delay | &lt; 4 h | Daily | None or documented |

---

## Self‑checks (copy & run)

> All examples use the demo key `dev_demo_123`.

**Health probe**
```bash
curl -sS -H "X-API-Key: dev_demo_123" \
  https://api.useportpulse.com/v1/health
```

**Port trend (USLAX, 30d)**
```bash
curl -sS -H "X-API-Key: dev_demo_123" \
  "https://api.useportpulse.com/v1/ports/USLAX/trend?window=30d&amp;format=json"
```

**Freshness quick check (JSON)**
```bash
curl -sS -H "X-API-Key: dev_demo_123" \
  "https://api.useportpulse.com/v1/ports/USLAX/overview" \
| jq '.last_updated'
```

**OpenAPI (for contract)**
```bash
curl -sS https://api.useportpulse.com/openapi.json | head -n 20
```

---

## Support & escalation

- **Tier‑1:** support@useportpulse.com (business hours)  
- **Priority support (Pro+):** dedicated Slack/email channel (24×5)  
- **Security:** security@useportpulse.com (PGP on request)

---

## Related

- **Errors & retries:** [/docs/errors](/docs/errors) · **Rate limits:** [/docs/rate-limits](/docs/rate-limits)  
- **API reference:** [/openapi](/openapi) · **Changelog:** [/docs/changelog](/docs/changelog)
