#!/bin/bash
# filepath: /Users/huayufei/马/数据产品/Port Operations API/portpulse/docs-site/fix-docusaurus-build.sh

set -e

echo "🔧 Fixing Docusaurus duplicate routes & MDX parse errors..."

# Kill any process on port 8090
echo "📦 Stopping any process on port 8090..."
lsof -ti:8090 | xargs kill -9 2>/dev/null || true

# Create backup
echo "💾 Creating backup..."
mkdir -p ../_backups
BACKUP_NAME="docs_$(date +%Y-%m-%d-%H%M%S)_pre-fix.tgz"
tar -czf "../_backups/$BACKUP_NAME" docs/
echo "✅ Backup created: ../_backups/$BACKUP_NAME"

# Create quarantine directory
mkdir -p docs/_quarantine

# Find and move duplicate intro files (keep only docs/intro.md)
echo "🔍 Fixing duplicate /intro routes..."
find docs/ -name "*.md" -o -name "*.mdx" | while read file; do
    if [ "$file" != "docs/intro.md" ] && grep -q "slug.*:.*['\"]*/.*intro['\"]" "$file" 2>/dev/null; then
        echo "📦 Moving duplicate intro file: $file"
        mv "$file" "docs/_quarantine/$(basename "$file").off"
    fi
done

# Fix postman.mdx MDX syntax issues
echo "🔧 Fixing postman.mdx MDX syntax..."
if [ -f "docs/postman.mdx" ]; then
    # Create temp file
    cp "docs/postman.mdx" "docs/postman.mdx.tmp"
    
    # Replace double braces
    sed -i '' 's/{{/\&#123;\&#123;/g' "docs/postman.mdx.tmp"
    sed -i '' 's/}}/\&#125;\&#125;/g' "docs/postman.mdx.tmp"
    
    # Replace bare {UNLOCODE} outside code fences with inline code
    awk '
    BEGIN { in_code_fence = 0 }
    /^```/ { in_code_fence = !in_code_fence; print; next }
    !in_code_fence && /{[A-Z_][A-Z0-9_]*}/ {
        gsub(/{([A-Z_][A-Z0-9_]*)}/, "`{\\1}`")
    }
    { print }
    ' "docs/postman.mdx.tmp" > "docs/postman.mdx"
    
    rm "docs/postman.mdx.tmp"
    
    # Check for remaining bare tokens outside code fences
    echo "🔍 Checking for remaining bare {Token} outside code fences..."
    awk '
    BEGIN { in_code_fence = 0; line_num = 0 }
    { line_num++ }
    /^```/ { in_code_fence = !in_code_fence; next }
    !in_code_fence && /{[^}]*}/ && !/{#[^}]*}/ && !/`{[^}]*}`/ {
        print "⚠️  Line " line_num ": " $0
    }
    ' "docs/postman.mdx"
fi

# Create valid sidebars.ts
echo "📝 Creating valid sidebars.ts..."
cat > sidebars.ts << 'EOF'
import type {SidebarsConfig} from '@docusaurus/plugin-content-docs';

const sidebars: SidebarsConfig = {
  docsSidebar: [
    'intro',
    {
      type: 'category',
      label: 'Getting Started',
      items: [
        'getting-started/quickstarts',
        'getting-started/examples', 
        'getting-started/authentication',
      ],
    },
    'authentication',
    'rate-limits',
    'csv-etag',
    'errors',
    'methodology',
    {
      type: 'category',
      label: 'API Clients',
      items: [
        'postman',
        'insomnia',
      ],
    },
    {
      type: 'category',
      label: 'Guides',
      items: [
        'guides/versioning',
      ],
    },
    {
      type: 'category',
      label: 'Operations',
      items: [
        'ops/sla-status',
      ],
    },
    'changelog',
    {
      type: 'category',
      label: 'API Reference',
      items: [
        'api-reference/endpoints',
        'api-reference/errors',
        'api-reference/rate-limits',
      ],
    },
  ],
};

export default sidebars;
EOF

# Create missing doc files if they don't exist
echo "📄 Creating missing doc files..."
mkdir -p docs/getting-started docs/guides docs/ops docs/api-reference

# Create basic docs if they don't exist
docs_to_create=(
    "getting-started/quickstarts.md:Quick Start Guide"
    "getting-started/examples.md:Code Examples"
    "getting-started/authentication.md:Authentication Guide"
    "authentication.md:Authentication"
    "rate-limits.md:Rate Limits"
    "csv-etag.md:CSV & ETag Caching"
    "errors.md:Error Handling"
    "methodology.md:Data Methodology"
    "guides/versioning.md:API Versioning"
    "ops/sla-status.md:SLA & Status"
    "changelog.md:Changelog"
    "api-reference/endpoints.md:API Endpoints"
    "api-reference/errors.md:Error Codes"
    "api-reference/rate-limits.md:Rate Limiting"
)

for doc_info in "${docs_to_create[@]}"; do
    IFS=':' read -r doc_path doc_title <<< "$doc_info"
    if [ ! -f "docs/$doc_path" ]; then
        cat > "docs/$doc_path" << EOF
---
title: $doc_title
---

# $doc_title

This section is under development. Please check back soon for more information.

## Overview

Content coming soon...
EOF
        echo "✅ Created: docs/$doc_path"
    fi
done

# Ensure intro.md exists and has proper frontmatter
if [ ! -f "docs/intro.md" ]; then
    cat > docs/intro.md << 'EOF'
---
title: Introduction
slug: /intro
sidebar_position: 1
---

# PortPulse API Documentation

Welcome to the PortPulse API documentation. This API provides real-time and historical data about port congestion, vessel traffic, and trade flows.

## Quick Start

Get started with the PortPulse API in just a few minutes:

1. **Get your API key** from the dashboard
2. **Make your first request** to check port status
3. **Integrate** the data into your application

## Example Request

```bash
curl -H "X-API-Key: your-api-key" \
  "https://api.useportpulse.com/v1/ports/USLAX/overview"
```

## Next Steps

- [Quick Start Guide](getting-started/quickstarts)
- [Authentication](authentication)
- [API Reference](api-reference/endpoints)
EOF
fi

echo "🏗️  Building with pnpm..."
pnpm install
pnpm build

echo "🚀 Starting development server on port 8090..."
pnpm docusaurus serve --port 8090 --no-open &
sleep 3

echo "✅ Fix completed! Check http://localhost:8090"
echo "📦 Quarantined files are in docs/_quarantine/"
echo "💾 Backup available at: ../_backups/$BACKUP_NAME"