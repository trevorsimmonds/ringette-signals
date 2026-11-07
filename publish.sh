#!/usr/bin/env bash
# Publish Ringette Signals to GitHub Pages.
# First run: creates the GitHub repo, pushes, and turns on Pages.
# Later runs: commits any changes and pushes them.
# Usage:  bash publish.sh            (or: bash publish.sh "What changed")
set -euo pipefail

REPO="ringette-signals"
MSG="${1:-Update Ringette Signals}"
cd "$(dirname "$0")"

if ! command -v gh >/dev/null 2>&1; then
  echo "GitHub CLI (gh) isn't installed. Install it with:  brew install gh"
  exit 1
fi
gh auth status >/dev/null 2>&1 || gh auth login

OWNER="$(gh api user --jq .login)"
URL="https://github.com/$OWNER/$REPO.git"

# Local repo + commit
[ -d .git ] || git init -q
git add -A
if git diff --cached --quiet; then
  echo "No new changes to commit."
else
  git commit -q -m "$MSG"
  echo "Committed: $MSG"
fi
git branch -M main

# GitHub repo + push
if gh repo view "$OWNER/$REPO" >/dev/null 2>&1; then
  if git remote get-url origin >/dev/null 2>&1; then git remote set-url origin "$URL"; else git remote add origin "$URL"; fi
  git push -u origin main
else
  git remote remove origin 2>/dev/null || true
  gh repo create "$REPO" --public --source=. --remote=origin --push
fi

# GitHub Pages (only needs turning on once)
if ! gh api "repos/$OWNER/$REPO/pages" >/dev/null 2>&1; then
  gh api -X POST "repos/$OWNER/$REPO/pages" -f "source[branch]=main" -f "source[path]=/" >/dev/null
  echo "GitHub Pages turned on. The first build takes a minute or two."
fi

echo
echo "Live at: https://$OWNER.github.io/$REPO/"
echo "Tip: after changing app files, bump CACHE in sw.js so phones pick up the update."
