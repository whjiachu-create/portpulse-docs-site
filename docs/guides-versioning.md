---
id: guides-versioning
slug: /guides/versioning
title: API Versioning
---

# API Versioning

> **TL;DR**  
> • Stable contract lives at **`/v1`** (backward compatible).  
> • Any **breaking change** is previewed at **`/v1beta`** first.  
> • **Deprecation window ≥ 90 days** before removal or behavior change.  
> • We announce changes in the **[Changelog](/docs/changelog)** and mark deprecated endpoints with response headers.

## Why we version
Versioning lets us ship improvements quickly *without* breaking existing integrations. The rules below define what we consider breaking vs. non‑breaking, how long changes are previewed, and the migration path you can rely on.

## Version scheme
- **Path-based major version**: All production endpoints are served under `https://api.useportpulse.com/**v1**/...`.
- **Preview channel**: Breaking or experimental changes appear under `**/v1beta**`.
- **Stability**: `v1` is a frozen contract—only **backward compatible** changes are allowed. `v1beta` can change at any time and is **not** covered by SLA.
- **Sunset policy**: When `v1beta` graduates to `v1`, the old `v1beta` surfaces are marked deprecated for **≥ 90 days** before removal.

### What counts as breaking?
Breaking (requires `v1beta` first):
- Removing a field, renaming a field, or changing its type/semantics.
- Changing default behavior (e.g., pagination defaults) or response status codes.
- Renaming/removing query parameters or changing required parameters.
- For CSV: removing or reordering existing columns, or changing a column’s meaning.

Non‑breaking (can ship directly to `v1`):
- Adding **optional** query parameters with safe defaults.
- Adding **new response fields** (JSON clients should ignore unknown fields).
- Adding **trailing CSV columns** (existing column order preserved; header row always present).
- Extending enum values; clients should handle unknown enum values defensively.

## Deprecation & removal
When we deprecate a `v1` field/endpoint, you’ll see:
- **Changelog entry** describing impact and the migration path.
- Response headers on the affected resources, e.g.:

```
Deprecation: true
Sunset: Tue, 30 Dec 2025 00:00:00 GMT
Link: </docs/changelog>; rel="deprecation"
```

We keep deprecated `v1` behavior for **at least 90 days** before removal or change takes effect.

## Pinning your integration
- Always call **`/v1/...`** for production use.
- Treat unknown JSON fields and enum values as **forwards‑compatible**.
- For CSV, do not hard‑code column indices; read by **header name** where possible.
- If you evaluate `v1beta`, isolate it behind feature flags and expect breaking revisions.

## Migrating from `v1beta` to `v1`
1. **Read the Changelog** entry for breaking notes and examples.  
2. Update your client to the new field names/types as documented.  
3. Validate error handling still follows **[Errors](/docs/api-reference/errors)**.  
4. For CSV, confirm header names and any new trailing columns.  
5. Roll out gradually; monitor for **304/ETag**, rate limits, and error rates.

## Examples
### Stable (`v1`)
**cURL**
```bash
curl -sS \
  -H "X-API-Key: dev_demo_123" \
  "https://api.useportpulse.com/v1/ports/USLAX/trend?window=30d&format=json"
```

### Preview (`v1beta`)
**cURL**
```bash
curl -sS \
  -H "X-API-Key: dev_demo_123" \
  "https://api.useportpulse.com/v1beta/ports/USLAX/alerts?window=30d"
```

## Frequently asked questions
**When will there be a `v2`?**  
We favor additive change. A new major version is introduced only when `v1` can’t evolve without breaking the contract. If/when that happens, we will run **parallel channels** with a deprecation window ≥ 180 days.

**How will I know about changes?**  
Track the **[Changelog](/docs/changelog)**. Breaking changes always appear first in `v1beta` with examples, and we add deprecation headers to affected `v1` calls.

**Are `v1beta` endpoints covered by SLA and rate limits?**  
`v1beta` is best‑effort (no SLA). Rate limits still apply; see **[Rate limits](/docs/api-reference/rate-limits)**.

---

If anything here is unclear or you need an extended deprecation window for a critical workflow, please open an issue with details of the endpoint and payload shape you rely on.
