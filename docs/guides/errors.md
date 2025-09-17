---
title: Error Handling
---

# Error Handling

All API errors return consistent JSON format with HTTP status codes.

## Error Format

```json
{
  "code": "ERROR_CODE",
  "message": "Human readable description",
  "request_id": "req_123456789",
  "hint": "Actionable suggestion"
}
```

## Common Error Codes

### 400 Bad Request
- `INVALID_PORT_CODE`: Port code format invalid
- `INVALID_DATE_RANGE`: Date parameters out of range
- `INVALID_FORMAT`: Unsupported format parameter

### 401 Unauthorized
- `MISSING_API_KEY`: X-API-Key header required
- `INVALID_API_KEY`: API key not found or expired

### 404 Not Found
- `PORT_NOT_FOUND`: Requested port not in coverage
- `ENDPOINT_NOT_FOUND`: Invalid API endpoint

### 429 Too Many Requests
- `RATE_LIMIT_EXCEEDED`: API rate limit exceeded

### 500 Internal Server Error
- `INTERNAL_ERROR`: Unexpected server error
- `DATA_UNAVAILABLE`: Temporary data source issue

