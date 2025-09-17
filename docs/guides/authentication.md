---
title: Authentication
---

# Authentication

The PortPulse API uses API keys for authentication.

## Getting Your API Key

1. Sign up at [PortPulse Dashboard](https://useportpulse.com)
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

