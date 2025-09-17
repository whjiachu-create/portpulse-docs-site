---
id: versioning
title: Versioning & Deprecations
sidebar_label: Versioning
description: How PortPulse versions its API and communicates deprecations, with concrete timelines and headers.
---

PortPulse uses **path-based versioning** with strong stability guarantees. This page explains what we consider breaking vs. non‑breaking changes, how we signal deprecations, and how you should migrate safely.

## Version Tiers

| Tier | Base path | Stability | Typical changes |
|---|---|---|---|
| **Stable** | `/v1` | **Frozen** for backwards compatibility | Additive only (new optional fields or endpoints) |
| **Preview** | `/v1beta` | Iterates based on feedback | Experiments and **breaking** changes allowed |

> We do **not** use custom headers or query params for versioning; the **path** selects the version.

## What counts as breaking?

Breaking = anything that risks existing clients failing without code changes.

**Breaking examples (go to `/v1beta`)**
- Removing a field or endpoint
- Renaming fields or enum values
- Changing types (e.g., `number` → `string`)
- Changing required ↔ optional
- Changing semantics/units or response shape

**Non‑breaking (allowed in `/v1`)**
- Adding **optional** fields
- Adding new endpoints
- Extending enums with **new** values
- Adding pagination or new query params that are optional

## Deprecation & Sunset Signals

When we plan to remove or change behavior in `/v1`, we announce with **RFC 8594‑style** headers and the changelog entry:

- `Deprecation: true`
- `Sunset: 2026-01-15`  _(example date)_
- `Link: &lt;https://docs.useportpulse.com/docs/changelog&gt;; rel="deprecation"`

We also add a **Changelog** entry with migration notes and minimal cURL samples.

**Compatibility window:** we announce deprecations **≥ 90 days** before removal in stable environments.

### Example response headers (illustrative)

```http
HTTP/1.1 200 OK
Deprecation: true
Sunset: 2026-01-15
Link: &lt;https://docs.useportpulse.com/docs/changelog&gt;; rel="deprecation"
X-Request-Id: 5b0f3e2f-8bce-4a97-9b40-8e3f4b0b4f4a
Cache-Control: public, max-age=300
Content-Type: application/json; charset=utf-8
```

> Use `X-Request-Id` in all support communications so we can trace your call.

## Upgrade Playbook (Client Guidance)

1. **Generate clients** from our **OpenAPI** schema where possible (tolerate unknown fields).
2. Ensure JSON parsers ignore **unknown fields** and can handle **enum extensions**.
3. Build feature flags to test `/v1beta` in staging while keeping `/v1` in production.
4. Watch the **Changelog** and **Status** pages for timelines and impact.
5. Include `X-Request-Id` in logs; surface it in error reports.

### Try both versions side-by-side

```bash
# Set demo key for examples
export API_KEY="dev_demo_123"

# Stable
curl -sS -H "X-API-Key: $API_KEY" \
  "https://api.useportpulse.com/v1/ports/USLAX/trend?window=30d" | jq '.[:2]'

# Preview
curl -sS -H "X-API-Key: $API_KEY" \
  "https://api.useportpulse.com/v1beta/ports/USLAX/trend?window=30d" | jq '.[:2]'
```

> The `v1beta` response may include prototype fields that are **not** present in `v1`.

## Example: field rename flow

1. Introduce `new_field` in `/v1beta` with a documented mapping from `old_field`.
2. Announce deprecation for `old_field` in `/v1`: `Deprecation: true`, `Sunset: +90 days`, and a **Changelog** entry.
3. After clients migrate, promote `new_field` into `/v1` (additive) and freeze.
4. Remove `old_field` **after** the sunset date; record the removal in the changelog.

### Suggested internal timeline (illustrative)

| Day | Action |
|---:|---|
| 0 | `new_field` appears in `/v1beta` + docs + samples |
| 7 | Deprecation notice for `old_field` in `/v1` (headers + Changelog) |
| 30 | Majority clients migrated; monitor error rate |
| 90+ | Remove `old_field` from `/v1`; keep note pinned in **Changelog** |

## Communication Channels

- **Changelog**: `/docs/changelog` — all changes & migrations.
- **Status page**: `/docs/ops/sla-status` — incidents and scheduled maintenance.
- **Email**: opt‑in advisories for Pro+ customers.

## FAQs

**Q: How long will `/v1beta` features stay in preview?**  
A: Varies by feature. Most items stabilize within **1–3 cycles**; we avoid long‑lived previews.

**Q: Do you support SemVer in URLs?**  
A: No. We keep **major** in the path (`/v1`, `/v1beta`). SDKs follow SemVer independently.

**Q: Can I pin to older `/v1` behavior?**  
A: `/v1` is backwards compatible; we do not introduce breaking changes there. Use `/v1beta` to prepare for future stable changes.

