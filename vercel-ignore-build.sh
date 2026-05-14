#!/bin/bash
# Vercel Ignored Build Step
# https://vercel.com/docs/projects/overview#ignored-build-step
#
# Exit 0 = skip build (no deployment)
# Exit 1 = proceed with build
#
# Set this in Vercel Dashboard → Project Settings → Git → Ignored Build Step:
#   bash vercel-ignore-build.sh
#
# NOTE: "Canceled" deployments are NOT caused by this script — they're caused
# by Vercel's "Auto-Cancel Deployments" feature (when a newer push arrives).
# To avoid: batch commits, push once, don't push again until build completes.

set -e

echo "──────────────────────────────────────────"
echo "Ignore Build Step — $(date -u '+%Y-%m-%d %H:%M:%S UTC')"
echo "Branch: ${VERCEL_GIT_COMMIT_REF:-unknown}"
echo "Commit: ${VERCEL_GIT_COMMIT_SHA:-unknown}"
echo "Previous: ${VERCEL_GIT_PREVIOUS_SHA:-none}"
echo "──────────────────────────────────────────"

# ONLY build on main branch — skip ALL other branches
if [ "$VERCEL_GIT_COMMIT_REF" != "main" ]; then
  echo "SKIP: Not main branch ($VERCEL_GIT_COMMIT_REF)"
  exit 0
fi

# First deployment — always build
if [ -z "$VERCEL_GIT_PREVIOUS_SHA" ]; then
  echo "BUILD: No previous SHA — first deployment"
  exit 1
fi

# Get changed files
CHANGED_FILES=$(git diff --name-only "$VERCEL_GIT_PREVIOUS_SHA" HEAD 2>/dev/null || echo "")

if [ -z "$CHANGED_FILES" ]; then
  echo "SKIP: No changed files"
  exit 0
fi

FILE_COUNT=$(echo "$CHANGED_FILES" | wc -l | tr -d ' ')
echo "Changed files: $FILE_COUNT"
echo "$CHANGED_FILES" | head -30

# Check if ANY changed file is code
NEEDS_BUILD=false
CODE_FILE=""

while IFS= read -r file; do
  case "$file" in
    docs/*|*.md) ;;
    scripts/*) ;;
    src/video/*) ;;
    .git/*|.vscode/*|.idea/*) ;;
    supabase/.temp/*) ;;
    *)
      CODE_FILE="$file"
      NEEDS_BUILD=true
      break
      ;;
  esac
done <<< "$CHANGED_FILES"

if [ "$NEEDS_BUILD" = true ]; then
  echo "BUILD: Code change detected → $CODE_FILE"
  exit 1
else
  echo "SKIP: Only docs/scripts/markdown ($FILE_COUNT files)"
  exit 0
fi
