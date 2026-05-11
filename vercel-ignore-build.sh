#!/bin/bash
# Vercel Ignored Build Step
# https://vercel.com/docs/projects/overview#ignored-build-step
#
# Exit 0 = skip build (no deployment)
# Exit 1 = proceed with build
#
# Skips builds when ONLY non-code files changed (docs, scripts, video scripts,
# audit reports, plans, markdown). Saves ~9 min of build time per skip.
#
# Set this in Vercel Dashboard → Project Settings → Git → Ignored Build Step:
#   bash vercel-ignore-build.sh

echo "Checking if build is needed..."

# Always build on main branch for production
if [ "$VERCEL_GIT_COMMIT_REF" != "main" ]; then
  echo "Not main branch — building for preview"
  exit 1
fi

# Get the list of changed files since last successful deployment
# VERCEL_GIT_PREVIOUS_SHA is set by Vercel to the last deployed commit
if [ -z "$VERCEL_GIT_PREVIOUS_SHA" ]; then
  echo "No previous SHA — first deployment, building"
  exit 1
fi

CHANGED_FILES=$(git diff --name-only "$VERCEL_GIT_PREVIOUS_SHA" HEAD 2>/dev/null)

if [ -z "$CHANGED_FILES" ]; then
  echo "No changed files detected — skipping build"
  exit 0
fi

echo "Changed files:"
echo "$CHANGED_FILES" | head -20

# Check if ANY changed file is code (not just docs/scripts/markdown)
NEEDS_BUILD=false

while IFS= read -r file; do
  case "$file" in
    # Skip: documentation, plans, specs, audit reports
    docs/*) ;;
    *.md) ;;
    # Skip: local scripts (not deployed)
    scripts/*) ;;
    # Skip: video scripts (content, not code)
    src/video/*) ;;
    # Skip: git hooks (not deployed)
    .git/*) ;;
    # Skip: editor config
    .vscode/*) ;;
    .idea/*) ;;
    # Skip: Supabase temp files
    supabase/.temp/*) ;;
    # Everything else = code that needs a build
    *)
      echo "Code change detected: $file"
      NEEDS_BUILD=true
      break
      ;;
  esac
done <<< "$CHANGED_FILES"

if [ "$NEEDS_BUILD" = true ]; then
  echo "Code changes found — building"
  exit 1
else
  echo "Only docs/scripts/markdown changed — skipping build"
  exit 0
fi
