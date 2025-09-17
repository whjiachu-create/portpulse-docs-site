---
id: authentication
title: Authentication
sidebar_position: 1
slug: /getting-started/authentication
---
All requests require an API key via header:

```
X-API-Key: <your_key>
```

### Test your key
```bash
export API_BASE="https://api.useportpulse.com"
export API_KEY="DEMO_KEY"   # replace with your live key

curl -i -H "X-API-Key: $API_KEY" "$API_BASE/v1/health"
```

You should see `200 OK`. A `401/403` means the key is missing or invalid.
