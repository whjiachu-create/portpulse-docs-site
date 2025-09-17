---
title: Postman
slug: /docs/postman
---

import { UNLOCODE } from '@site/src/constants';

---
sidebar_position: 2
---

# Postman Collection

Learn how to use Postman with PortPulse API for testing and development.

## Quick Start

### 1. Import Collection

Download and import our Postman collection:

```bash
curl -o portpulse-collection.json https://api.useportpulse.com/v1/postman/collection.json
```

Then import the file into Postman:
1. Open Postman
2. Click **Import**
3. Select the downloaded `portpulse-collection.json` file

### 2. Set Environment Variables

Create a new environment in Postman with these variables:

- `base_url`: `https://api.useportpulse.com/v1`
- `api_key`: `your_api_key_here`

### 3. Test Your Setup

Run the "Health Check" request to verify your setup:

```http
GET &#123;&#123;base_url&#125;&#125;/health
```

Expected response:
```json
{
  "status": "healthy",
  "version": "1.0.0",
  "timestamp": "2025-09-16T10:30:00Z"
}
```

## Available Endpoints

### Port Overview
```http
GET &#123;&#123;base_url&#125;&#125;/ports/USLAX/overview
X-API-Key: &#123;&#123;api_key&#125;&#125;
```

### Port Trends
```http
GET &#123;&#123;base_url&#125;&#125;/ports/USLAX/trend?window=30d&format=json
X-API-Key: &#123;&#123;api_key&#125;&#125;
```

### Port Alerts
```http
GET &#123;&#123;base_url&#125;&#125;/ports/USLAX/alerts
X-API-Key: &#123;&#123;api_key&#125;&#125;
```

## Response Examples

All responses include standard headers:
- `x-request-id`: Unique request identifier
- `cache-control`: Caching directives
- `etag`: Resource version (for CSV responses)

Error responses follow this format:
```json
{
  "code": "INVALID_PORT_CODE",
  "message": "Port code 'INVALID' not found",
  "request_id": "req_123456789",
  "hint": "Use UN/LOCODE format like 'USLAX' or 'SGSIN'"
}
```
});
```

## Error Handling

PortPulse API returns consistent error format:

```json
{
  "code": "INVALID_PORT_CODE",
  "message": "Port code 'INVALID' not found",
  "request_id": "req_123456789",
  "hint": "Use UN/LOCODE format like 'USLAX' or 'SGSIN'"
}
```
