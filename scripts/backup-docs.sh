#!/usr/bin/env bash
set -euo pipefail

# ensure location
test -f package.json || { echo "Please cd into portpulse/docs-site first"; exit 1; }

# stop local preview if any
lsof -ti:8090 2>/dev/null | xargs -I{} kill -9 {} 2>/dev/null || true

TS=$(date +%F-%H%M%S)
BACKUP_DIR="../_backups"
ARCHIVE="${BACKUP_DIR}/docs-site_${TS}.tgz"
BRANCH="backup/docs-site-${TS}"
TAG="docs-backup-${TS}"

echo "=> making backups folder: ${BACKUP_DIR}"
mkdir -p "${BACKUP_DIR}"

# keep .gitignore clean and idempotent
add_ignore() { grep -qxF "$1" .gitignore 2>/dev/null || echo "$1" >> .gitignore; }
touch .gitignore
add_ignore ".DS_Store"
add_ignore "**/.DS_Store"
add_ignore "**/.DocumentRevisions-V100"
add_ignore "**/.Spotlight-V100"
add_ignore "**/.fseventsd"
add_ignore "**/.Trashes"
add_ignore "backups/"
add_ignore "docs-site.bak*/"
add_ignore "build/"
add_ignore ".cache/"

git add .gitignore || true
git commit -m "chore(docs): ignore macOS system dirs & local artifacts (pre-backup)" || true

# create snapshot branch and tag (safe if re-run)
echo "=> creating snapshot branch: ${BRANCH}"
git switch -c "${BRANCH}" 2>/dev/null || git switch "${BRANCH}"
git add -A || true
git commit -m "chore(docs): snapshot before external archive (${TS})" || true
git tag -f "${TAG}" || true

# external archive (exclude heavy/system paths)
echo "=> creating archive: ${ARCHIVE}"
tar \
  --exclude=".git" \
  --exclude="node_modules" \
  --exclude="build" \
  --exclude=".cache" \
  --exclude="backups" \
  --exclude="docs-site.bak*" \
  --exclude="*.tgz" \
  --exclude="**/.DS_Store" \
  --exclude="**/.DocumentRevisions-V100" \
  -czf "${ARCHIVE}" .

echo "=> archive head:"
tar -tzf "${ARCHIVE}" | head -n 20 || true
echo "=> archive size:"
du -h "${ARCHIVE}"

echo "=> sha256 checksum"
shasum -a 256 "${ARCHIVE}" | tee "${ARCHIVE}.sha256"

echo "OK backup finished"
echo " - git branch: ${BRANCH}"
echo " - git tag:    ${TAG}"
echo " - archive:    ${ARCHIVE}"
echo " - checksum:   ${ARCHIVE}.sha256"
echo "Optional push:"
echo "   git push -u origin ${BRANCH} && git push -f origin ${TAG}"
