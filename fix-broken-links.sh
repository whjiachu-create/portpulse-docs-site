#!/bin/bash

set -e

echo "🔗 Fixing broken links in Docusaurus..."

# Create missing directories
mkdir -p docs/Guides
mkdir -p docs/getting-started

# Create missing field-dictionary
cat > docs/Guides/field-dictionary.md << 'EOF'
---
title: Field Dictionary
---

# Field Dictionary

This page contains definitions and calculation methods for all API fields.

## Port Metrics

### congestion_score
- **Type**: Float (0.0 - 1.0)
- **Description**: Normalized congestion level based on vessel wait times and berth availability
- **Calculation**: `(current_wait_time - baseline_wait_time) / max_historical_wait_time`

### avg_wait_hours
- **Type**: Float
- **Description**: Average vessel waiting time in hours
- **Unit**: Hours
- **Range**: 0 - 168 (1 week max)

### vessels_at_anchor
- **Type**: Integer
- **Description**: Number of vessels currently waiting at anchor
- **Update Frequency**: Every 2 hours

## Data Quality

All metrics include data quality indicators and are validated against historical baselines.

EOF

# Create missing rate-limits guide
cat > docs/Guides/rate-limits.md << 'EOF'
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

EOF

# Create missing errors guide
cat > docs/Guides/errors.md << 'EOF'
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

EOF

# Create missing authentication guide
cat > docs/Guides/authentication.md << 'EOF'
---
title: Authentication
---

# Authentication

The PortPulse API uses API keys for authentication.

## Getting Your API Key

1. Sign up at [PortPulse Dashboard](/signup)
2. Navigate to API Keys section
3. Generate a new key for your project

## Using API Keys

Include your API key in the request header:

```bash
curl -H "X-API-Key: pp_live_your_key_here" \
  "https://api.useportpulse.com/v1/ports/USLAX/overview"
```

## Key Formats

- **Development**: `pp_dev_*`
- **Production**: `pp_live_*`

## Security Best Practices

- Store keys in environment variables
- Use different keys for dev/staging/prod
- Rotate keys regularly
- Never commit keys to version control

EOF

# Fix broken links in existing files
echo "🔧 Fixing broken links in existing files..."

# Fix csv-etag.md links
if [ -f "docs/csv-etag.md" ]; then
    sed -i '' 's|./Guides/rate-limits|../Guides/rate-limits|g' docs/csv-etag.md
    sed -i '' 's|./Guides/errors|../Guides/errors|g' docs/csv-etag.md
fi

# Fix insomnia.md links
if [ -f "docs/insomnia.md" ]; then
    sed -i '' 's|/docs/Guides/rate-limits|../Guides/rate-limits|g' docs/insomnia.md
    sed -i '' 's|/docs/Guides/errors|../Guides/errors|g' docs/insomnia.md
    sed -i '' 's|/docs/Guides/authentication|../Guides/authentication|g' docs/insomnia.md
    sed -i '' 's|/signup|https://app.useportpulse.com/signup|g' docs/insomnia.md
    sed -i '' 's|/play|https://useportpulse.com/play|g' docs/insomnia.md
fi

# Fix intro.md links
if [ -f "docs/intro.md" ]; then
    sed -i '' 's|/docs/getting-started/quickstarts|getting-started/quickstarts|g' docs/intro.md
fi

# Fix methodology.md links
if [ -f "docs/methodology.md" ]; then
    sed -i '' 's|/docs/Guides/errors|../Guides/errors|g' docs/methodology.md
    sed -i '' 's|/docs/Guides/field-dictionary|../Guides/field-dictionary|g' docs/methodology.md
fi

if [ -f "docs/Guides/methodology.md" ]; then
    sed -i '' 's|/docs/Guides/field-dictionary|field-dictionary|g' docs/Guides/methodology.md
fi

# Fix endpoints links
if [ -f "docs/endpoints.md" ]; then
    sed -i '' 's|/docs/Guides/field-dictionary|../Guides/field-dictionary|g' docs/endpoints.md
fi

echo "✅ Broken links fixed!"
echo "🏗️  Rebuilding to verify fixes..."

pnpm build

echo "✅ Build completed! Check for any remaining broken links above."
