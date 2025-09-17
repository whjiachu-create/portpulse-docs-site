# fix-last-badlink.sh
set -euo pipefail
test -f package.json || { echo "❌ 请先 cd 到 portpulse/docs-site"; exit 1; }

echo "→ Kill :8090 if any"
lsof -ti:8090 2>/dev/null | xargs -I{} kill -9 {} 2>/dev/null || true

echo "→ Snapshot backup"
TS=$(date +%F-%H%M%S)
mkdir -p ../_backups
tar --exclude='.git' --exclude='node_modules' --exclude='build' --exclude='.cache' \
  -czf "../_backups/docs-site_lastfix_${TS}.tgz" docs || true

echo "→ Patch the only remaining bad link (Guides → guides)"
# 只改 "field-dictionary" 这一个链接；支持 .md 或 .mdx
for f in docs/Guides/methodology.md docs/Guides/methodology.mdx; do
  if [ -f "$f" ]; then
    sed -i '' -E \
      -e 's#\.\./[Gg]uides/field-dictionary#/docs/guides/field-dictionary#g' \
      -e 's#/docs/[Gg]uides/field-dictionary#/docs/guides/field-dictionary#g' \
      "$f"
  fi
done

echo "→ Sanity check (should print nothing)"
grep -RIn "/docs/Guides/field-dictionary" docs || true

echo "→ Rebuild"
pnpm build

echo "→ Serve on :8090"
pnpm docs:serve --port 8090 & sleep 2

echo "→ Link check (skip github/mailto/useportpulse.com 以避免外链偶发误报)"
npx linkinator http://127.0.0.1:8090 --recurse --concurrency 8 \
  --skip "mailto:|#|^https://github.com|^https://useportpulse.com"

echo "✅ All green. Commit if happy:"
echo "   git add -A && git commit -m 'docs: fix final bad link in Guides/methodology → field-dictionary'"