---
id: guides-field-dictionary
slug: /guides/field-dictionary
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

