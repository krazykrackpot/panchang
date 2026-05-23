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
#     that hits a Vercel deploy hook (`.github/workflows/daily-deploy.yml`).
#     Deploy hooks bypass this script entirely, so the daily build runs
#     against main HEAD without needing a marker.
#   • To force a build on a specific push, include one of these markers in
#     the commit message:
#         [deploy]   [release]   [force-deploy]
#     Example: `git commit -m "fix(api): critical hotfix [deploy]"`.
#
# Rationale: each Vercel build is ~9 min of compute. Batching pushes into a
# daily roll-up cut build-minutes by ~10× without hurting release cadence;
# the marker provides an escape valve for urgent hotfixes.
#
# Other notes:
#   • Non-main branches always skip (preview deploys disabled).
#   • Vercel "Canceled" deployments come from Vercel's own Auto-Cancel
#     feature when a newer push arrives during a build — unrelated to this
#     script.

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

# Force-deploy marker in the commit message — only escape valve to deploy
# from a regular push outside the daily cron. Case-insensitive so
# [Deploy] / [RELEASE] / [Force-Deploy] all work.
COMMIT_MSG_LOWER=$(echo "${VERCEL_GIT_COMMIT_MESSAGE:-}" | tr '[:upper:]' '[:lower:]')
case "$COMMIT_MSG_LOWER" in
  *"[deploy]"*|*"[release]"*|*"[force-deploy]"*)
    echo "BUILD: force-deploy marker present in commit message"
    exit 1
    ;;
esac

# Default: skip. Production deploys come from the daily cron via deploy
# hook (which bypasses this script entirely — see daily-deploy.yml).
echo "SKIP: no force marker; production builds happen daily via deploy hook"
echo "      Include [deploy] / [release] / [force-deploy] in the commit"
echo "      message to override."
exit 0
