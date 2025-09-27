---
id: intro
title: Introduction
sidebar_position: 0
slug: /intro
---
# Introduction

**PortPulse** provides API-first metrics for port **congestion, dwell, snapshots, trends, and alerts** (HS imports in beta).  
Outputs: **JSON & CSV** with strong **ETag/304**, a **unified error model**, and header auth via **`X-API-Key`**.

> **SLO/SLA at a glance**
>
> - Endpoint latency: **p95 &lt; 300 ms** (with edge caching)  
> - Freshness: **p95 ≤ 2 hours** (per `last_updated`)  
> - Availability: **99.9%** SLA (for **Pro** and above)  
> See details in **[SLA &amp; Status](/docs/ops/sla-status)**.

### Start here
- **Quickstarts** → [/docs/quickstarts](/docs/quickstarts)
- **Authentication** → [/docs/authentication](/docs/authentication)
- **CSV &amp; ETag** → [/docs/csv-etag](/docs/csv-etag)

### Tools &amp; Integration
- **Postman** → [/docs/postman](/docs/postman)
- **Insomnia** → [/docs/insomnia](/docs/insomnia)

### One‑minute sanity check
Use the demo key to make your first request:

```bash
BASE="https://api.useportpulse.com"
KEY="dev_demo_123"

curl -s "$BASE/v1/ports/USLAX/trend?window=30" -H "X-API-Key: $KEY" | head -n 3
```

Want CSV with strong ETag?

```bash
curl -sD - "$BASE/v1/ports/USLAX/trend?window=30&amp;format=csv" -H "X-API-Key: $KEY" \
  | awk 'BEGINIGNORECASE=1(/^etag:/){gsub(/["\r]/,"",$2);print $2}'
```

Continue in **[Quickstarts](/docs/quickstarts)** for Python/Node examples.

### Operations
- **Versioning** → [/docs/guides/versioning](/docs/guides/versioning)
- **SLA &amp; Status** → [/docs/ops/sla-status](/docs/ops/sla-status)

### Field dictionary
See field-by-field definitions and units in **[Field Dictionary](/docs/guides/field-dictionary)**.

Open the full **API Reference** from the top navigation.

## OpenAPI (Download)

Use the button below to download the exact OpenAPI spec that this docs build uses.

<!-- Force download & absolute path -->
<p>
  <a href="/openapi.json" download="portpulse-openapi.json">
    👉 <strong>Download OpenAPI (JSON)</strong>
  </a>
</p>
