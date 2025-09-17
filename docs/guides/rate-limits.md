---
title: Rate Limits
---

# Rate Limits

API rate limits are enforced per API key across all endpoints.

## Limits by Plan

- **Lite**: 60 requests/minute (burst: 300)
- **Starter**: 300 requests/minute (burst: 1500)  
- **Pro**: 1000 requests/minute (burst: 5000)

## Headers

Rate limit information is returned in response headers:

```
X-RateLimit-Limit: 60
X-RateLimit-Remaining: 59
X-RateLimit-Reset: 1640995200
```

## Handling Rate Limits

When rate limited, you'll receive a 429 status with:

```json
{
  "code": "RATE_LIMIT_EXCEEDED",
  "message": "Rate limit exceeded",
  "request_id": "req_123456789",
  "hint": "Retry after 60 seconds"
}
```

