---
id: examples
title: Examples
sidebar_position: 3
slug: /getting-started/examples
---

- **CSV to CLI**  
  ```bash
  curl -H "X-API-Key: $API_KEY" \
    "$API_BASE/v1/ports/NLRTM/trend?window=14d&format=csv" > rotterdam.csv
  ```

- **304 cache probe (HEAD)**  
  ```bash
  curl -I -H "X-API-Key: $API_KEY" \
    "$API_BASE/v1/ports/SGSIN/trend?window=14d&format=csv"
  ```

- **Alerts**  
  ```bash
  curl -H "X-API-Key: $API_KEY" "$API_BASE/v1/ports/USNYC/alerts?window=14d"
  ```
