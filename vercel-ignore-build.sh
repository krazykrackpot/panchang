#!/bin/bash
# Vercel Ignored Build Step
# https://vercel.com/docs/projects/overview#ignored-build-step
#
# Exit 0 = skip build (no deployment)
# Exit 1 = proceed with build
#
# Build policy (May 2026 onward):
#   • Pushes to main DO NOT auto-deploy. The default for a fresh push is SKIP.
#   • Production builds happen once per day via a scheduled GitHub Action
#     that pushes an empty commit with a `[deploy]` marker in the message
#     (see `.github/workflows/daily-deploy.yml`). The marker is the same
#     escape valve used for hotfixes — handled below.
#   • To force a build on a specific push, include one of these markers in
#     the commit message:
#         [deploy]   [release]   [force-deploy]
#     Example: `git commit -m "fix(api): critical hotfix [deploy]"`.
#
# Rationale: each Vercel build is ~9 min of compute. Batching pushes into a
# daily roll-up cut build-minutes by ~10× without hurting release cadence;
# the marker provides an escape valve for urgent hotfixes.
#
# Why not use Vercel deploy hooks? They run this script too (no env var
# distinguishes hook builds), so they were skipped whenever main HEAD's
# commit lacked the marker. The empty-commit approach is more reliable.
#
# Other notes:
#   • Non-main branches always skip (preview deploys disabled).
#   • Vercel "Canceled" deployments can come from this script returning 0
#     (skip), or from Vercel's own Auto-Cancel when a newer push arrives.

set -e

echo "──────────────────────────────────────────"
echo "Ignore Build Step — $(date -u '+%Y-%m-%d %H:%M:%S UTC')"
echo "Branch: ${VERCEL_GIT_COMMIT_REF:-unknown}"
echo "Commit: ${VERCEL_GIT_COMMIT_SHA:-unknown}"
echo "Previous: ${VERCEL_GIT_PREVIOUS_SHA:-none}"
echo "──────────────────────────────────────────"

# Non-main branches: always skip (no preview deploys for this project).
if [ "$VERCEL_GIT_COMMIT_REF" != "main" ]; then
  echo "SKIP: Not main branch ($VERCEL_GIT_COMMIT_REF)"
  exit 0
fi

# Force-deploy marker — must appear in the FIRST LINE (commit subject) only.
# Case-insensitive so [Deploy] / [RELEASE] / [Force-Deploy] all work.
#
# 2026-06-06 incident: previously this matched anywhere in the message, so a
# PR description that *documented* the marker (e.g. "this PR removes the
# bracket-deploy marker") was treated as having the marker itself and
# triggered an unwanted build. Restricting to the subject line is the
# standard convention for semantic commit markers (skip-ci, do-not-merge,
# etc.) and prevents prose mentions from accidentally firing the build.
COMMIT_SUBJECT_LOWER=$(echo "${VERCEL_GIT_COMMIT_MESSAGE:-}" | head -n 1 | tr '[:upper:]' '[:lower:]')
case "$COMMIT_SUBJECT_LOWER" in
  *"[deploy]"*|*"[release]"*|*"[force-deploy]"*)
    echo "BUILD: force-deploy marker present in commit subject"
    exit 1
    ;;
esac

# Default: skip.
echo "SKIP: no force marker in commit SUBJECT (first line)."
echo "      To deploy NOW: include [deploy] / [release] / [force-deploy] in"
echo "      the commit SUBJECT, OR (preferred) build + deploy from your"
echo "      laptop via 'npm run deploy' (see CLAUDE.md Deploy policy)."
exit 0
