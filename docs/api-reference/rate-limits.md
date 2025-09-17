---
id: rate-limits
title: Rate limits
sidebar_position: 3
slug: /api-reference/rate-limits
---

Baseline: **~60 rpm** per key (burst ×5). Overages auto-upgrade by plan in v1.  
On `429`, wait and retry with exponential backoff (e.g., 1s → 2s → 4s...).
