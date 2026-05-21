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

# Vercel uses a shallow git clone — the previous SHA may not be reachable.
# Try to fetch it; if that still leaves diff unable to compute, default to
# BUILD (safer than skipping a real change).
if ! git cat-file -e "$VERCEL_GIT_PREVIOUS_SHA" 2>/dev/null; then
  echo "Previous SHA not in shallow clone — fetching..."
  git fetch --depth=200 origin "$VERCEL_GIT_PREVIOUS_SHA" 2>/dev/null || true
fi

# Get changed files. Distinguish "diff worked, no changes" from "diff failed".
if ! CHANGED_FILES=$(git diff --name-only "$VERCEL_GIT_PREVIOUS_SHA" HEAD 2>/dev/null); then
  echo "BUILD: git diff against $VERCEL_GIT_PREVIOUS_SHA failed — defaulting to build"
  exit 1
fi

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
