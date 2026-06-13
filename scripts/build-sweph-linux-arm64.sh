#!/usr/bin/env bash
# Cross-build the sweph native binary for Linux arm64.
#
# Why: `npm run deploy` uses `vercel deploy --prebuilt`, which uploads the
# locally-built artifacts to Vercel. The local machine is macOS arm64, so
# without this step the deploy ships a Mach-O `sweph.node` to a Linux arm64
# Lambda — `dlopen` fails, `isSwissEphAvailable()` returns false, and every
# /api/kundali response carries the "Swiss Ephemeris is unavailable" warning
# while planetary positions silently degrade to Meeus accuracy (±22° on Mars,
# 40-day-late Jupiter retrograde stations).
#
# This script:
#  1. Saves the local macOS Mach-O `sweph.node` to a backup path.
#  2. Rebuilds sweph inside a `node:24-bookworm` Linux arm64 container,
#     producing an ELF binary that matches the Vercel Lambda runtime
#     (vercel.json → arm64 + nodejs24.x).
#  3. Leaves the Linux binary in place at `node_modules/sweph/build/Release/`
#     so the subsequent `vercel build --prod` picks it up via the
#     `outputFileTracingIncludes` rule and ships it into the function bundle.
#  4. Schedules a restore-hook in `scripts/restore-sweph-macos.sh` so local
#     dev (next dev, vitest, manual `npx tsx` calls) keeps working — those
#     need the Mach-O binary to load via `require('sweph')`.
#
# Usage:
#   ./scripts/build-sweph-linux-arm64.sh        # cross-build + leave Linux .node
#   ./scripts/build-sweph-linux-arm64.sh restore # restore macOS .node from backup
#
# Prerequisites:
#   - Docker Desktop running (or any docker-compatible daemon)
#   - macOS arm64 host (script assumes local platform is what needs restoring)
#
# Idempotent: re-running the build is safe; restoring without a backup is a no-op.

set -euo pipefail

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
SWEPH_DIR="$REPO_ROOT/node_modules/sweph/build/Release"
SWEPH_NODE="$SWEPH_DIR/sweph.node"
MACOS_BACKUP="$REPO_ROOT/.cache/sweph.node.macos-arm64"
LINUX_BUILT="$REPO_ROOT/.cache/sweph.node.linux-arm64"
DOCKER_IMAGE="node:24-bookworm"

mkdir -p "$REPO_ROOT/.cache"

mode="${1:-build}"

if [ "$mode" = "restore" ]; then
  if [ -f "$MACOS_BACKUP" ]; then
    cp "$MACOS_BACKUP" "$SWEPH_NODE"
    echo "[sweph] Restored macOS arm64 binary from $MACOS_BACKUP"
    file "$SWEPH_NODE"
  else
    echo "[sweph] No macOS backup at $MACOS_BACKUP — nothing to restore."
    echo "[sweph] If you need the macOS binary, run: npm rebuild sweph"
  fi
  exit 0
fi

if ! command -v docker >/dev/null 2>&1; then
  echo "[sweph] ERROR: docker not installed. Install Docker Desktop or use a compatible runtime." >&2
  exit 1
fi

if ! docker info >/dev/null 2>&1; then
  echo "[sweph] ERROR: docker daemon not running. Start Docker Desktop and re-run." >&2
  exit 1
fi

# Step 1 — back up the current local binary (so we can restore after deploy).
# Only back up if the current binary looks like a macOS Mach-O; otherwise it's
# already a Linux binary from a previous cross-build and re-backing-up would
# overwrite the real macOS one.
if [ -f "$SWEPH_NODE" ]; then
  if file "$SWEPH_NODE" | grep -q 'Mach-O'; then
    cp "$SWEPH_NODE" "$MACOS_BACKUP"
    echo "[sweph] Backed up macOS arm64 binary → $MACOS_BACKUP"
  else
    echo "[sweph] Current binary is not Mach-O — skipping backup (already-built Linux binary)"
  fi
fi

# Step 2 — cross-build inside Linux arm64 container.
# Pulls node:24-bookworm (~120MB), installs the C++ toolchain, rebuilds sweph
# from source. The build artefact lands at node_modules/sweph/build/Release/
# on the host via the bind mount.
echo "[sweph] Cross-building inside $DOCKER_IMAGE (linux/arm64)..."
docker run --rm --platform=linux/arm64 \
  -v "$REPO_ROOT:/app" -w /app \
  "$DOCKER_IMAGE" \
  bash -c "
    set -e
    echo '[docker] Installing toolchain (python3 make g++)...'
    apt-get update -qq >/dev/null && apt-get install -y -qq python3 make g++ >/dev/null
    echo '[docker] Rebuilding sweph from source...'
    npm rebuild sweph --build-from-source
    echo '[docker] Build complete.'
  "

# Step 3 — verify the result and cache a copy in .cache/ for future fast restores.
if [ ! -f "$SWEPH_NODE" ]; then
  echo "[sweph] ERROR: build did not produce $SWEPH_NODE" >&2
  exit 1
fi

if ! file "$SWEPH_NODE" | grep -qE 'ELF.*aarch64|ELF.*ARM aarch64'; then
  echo "[sweph] ERROR: expected ELF aarch64 binary; got:" >&2
  file "$SWEPH_NODE" >&2
  exit 1
fi

cp "$SWEPH_NODE" "$LINUX_BUILT"
echo "[sweph] ✓ Linux arm64 binary ready at $SWEPH_NODE"
echo "[sweph] ✓ Cached copy at $LINUX_BUILT"
file "$SWEPH_NODE"

echo ""
echo "[sweph] Next: run 'npm run deploy' to ship this binary to Vercel."
echo "[sweph] After deploy: run '$0 restore' to put the macOS binary back so local dev works."
