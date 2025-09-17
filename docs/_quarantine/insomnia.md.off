---
title: Insomnia
slug: /docs/insomnia
sidebar_position: 3
---

# Insomnia Setup

Learn how to use Insomnia REST client with PortPulse API.

## Installation

1. Download [Insomnia](https://insomnia.rest/download) for your platform
2. Install and launch the application

## Import PortPulse Workspace

### Method 1: Import from URL
1. Click **Create** → **Import from URL**
2. Enter: `https://api.useportpulse.com/v1/insomnia/workspace.json`
3. Click **Import**

### Method 2: Manual Setup
1. Create a new **Request Collection**
2. Name it "PortPulse API"
3. Set base URL: `https://api.useportpulse.com/v1`

## Environment Setup

Create a new environment with these variables:

```json
{
  "base_url": "https://api.useportpulse.com/v1",
  "api_key": "your_api_key_here"
}
```

## Authentication

For all requests, add this header:
- **Header Name**: `X-API-Key`
- **Header Value**: `&#123;&#123; _.api_key &#125;&#125;`

## Example Requests

### Health Check
```http
GET &#123;&#123; _.base_url &#125;&#125;/health
```

### Port Overview
```http
GET &#123;&#123; _.base_url &#125;&#125;/ports/USLAX/overview
X-API-Key: &#123;&#123; _.api_key &#125;&#125;
```

### Port Trends (JSON)
```http
GET &#123;&#123; _.base_url &#125;&#125;/ports/USLAX/trend?window=30d&format=json
X-API-Key: &#123;&#123; _.api_key &#125;&#125;
```

### Port Trends (CSV)
```http
GET &#123;&#123; _.base_url &#125;&#125;/ports/USLAX/trend?window=30d&format=csv
X-API-Key: &#123;&#123; _.api_key &#125;&#125;
```

## Response Validation

Insomnia automatically validates JSON responses. For additional validation, you can use tests:

1. Go to the **Tests** tab in your request
2. Add validation scripts as needed
3. Check response status, headers, and body structure

## Tips

- Use **Environments** to switch between development and production
- Save common requests in **Collections** for reuse
- Use the **Preview** tab to see formatted JSON responses
- Enable **Follow Redirects** for automatic redirect handling
