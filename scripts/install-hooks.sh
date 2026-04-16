#!/bin/sh
# Install git hooks from scripts/git-hooks into .git/hooks.
# Run once after cloning: bash scripts/install-hooks.sh
set -e
HERE="$(cd "$(dirname "$0")" && pwd)"
ROOT="$(cd "$HERE/.." && pwd)"
SRC="$ROOT/scripts/git-hooks"
DST="$ROOT/.git/hooks"

if [ ! -d "$DST" ]; then
  echo "Not a git repo (no .git/hooks). Aborting." >&2
  exit 1
fi

for hook in pre-commit pre-push; do
  if [ -f "$SRC/$hook" ]; then
    cp "$SRC/$hook" "$DST/$hook"
    chmod +x "$DST/$hook"
    echo "Installed: $hook"
  fi
done

echo "Done. Bypass with 'git commit --no-verify' when necessary."
