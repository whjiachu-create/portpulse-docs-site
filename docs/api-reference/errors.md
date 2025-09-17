---
id: errors
title: Error Model
sidebar_position: 2
slug: /api-reference/errors
---

All 4xx/5xx return a uniform JSON body:
```json
{ "code": "string", "message": "string", "request_id": "uuid", "hint": "string" }
```

Common cases:
- `401/403` missing or invalid key  
- `404` not found (port/code)  
- `429` rate limit exceeded (see **Rate limits**)  
- `5xx` transient error — please retry with exponential backoff

Every response includes `x-request-id` — share it with support for tracing.
