#!/bin/bash
# deploy.sh — push current changes to GitHub (triggers Cloudflare Pages auto-deploy)
set -e

cd /Users/jackmcgrath/trustlinebiz

echo "[deploy] Staging changes..."
git add -A

# Only commit if there are staged changes
if git diff --cached --quiet; then
  echo "[deploy] Nothing to commit. Pushing existing HEAD..."
else
  TIMESTAMP=$(date "+%Y-%m-%d %H:%M")
  git commit -m "deploy: site update $TIMESTAMP"
  echo "[deploy] Committed."
fi

echo "[deploy] Pushing to origin/main..."
git push origin main

echo "[deploy] Done — Cloudflare Pages will build and deploy shortly."
