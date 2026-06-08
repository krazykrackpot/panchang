#!/usr/bin/env python3
"""
Detect scaffolded 9-locale data tables in the staged diff and re-run
their Gemini translators so the overlay JSON stays in lockstep with
the inline AUTHORED_EN / AUTHORED_HI. Invoked by pre-commit
(scripts/git-hooks/pre-commit).

Per touched module:
  1. Identify the overlay slug via the import line
     (`import OVERLAY_RAW from '@/lib/constants/<slug>-overlay.json'`).
  2. Look for `scripts/translate-<slug>-via-gemini.py`.
     - Found → step 3.
     - Not found AND module uses the scaffolder pattern (`OVERLAY_RAW`)
       → BLOCK (per-slug translator was never generated).
     - Not found AND module is legacy (`OVERLAY`, prior to PR #580)
       → WARN and skip (legacy multi-purpose translators handle these).
  3. Require `gcloud auth print-access-token` to succeed (user pref:
     BLOCK on missing auth).
  4. Run the translator (idempotent — no-op when overlay is already
     complete). Stage any updated overlay JSON so it lands in the
     same commit.

Usage:
    python3 scripts/sync-locale-overlays.py <ts-file> [<ts-file> ...]
"""
import argparse
import re
import subprocess
import sys
from pathlib import Path

REPO_ROOT = Path(__file__).resolve().parent.parent

# Match any common overlay-import alias used across scaffolder + the
# pre-scaffolder PRs (#574 / #576 / #578).
OVERLAY_IMPORT_RE = re.compile(
    r"""import\s+(?P<alias>OVERLAY_RAW|OVERLAY|BLOCK_OVERLAY|TEMPLATE_OVERLAY)"""
    r"""\s+from\s+['"]@/lib/constants/(?P<slug>[a-z0-9][a-z0-9-]*)-overlay\.json['"]"""
)


def detect_imports(ts_path: Path) -> list[tuple[str, str]]:
    """Return [(alias, slug), ...] for every overlay import in this .ts."""
    try:
        body = ts_path.read_text()
    except OSError:
        return []
    return [(m.group("alias"), m.group("slug")) for m in OVERLAY_IMPORT_RE.finditer(body)]


def gcloud_available() -> bool:
    try:
        proc = subprocess.run(
            ["gcloud", "auth", "print-access-token"],
            capture_output=True, text=True, timeout=10,
        )
        return proc.returncode == 0 and bool(proc.stdout.strip())
    except (FileNotFoundError, subprocess.TimeoutExpired):
        return False


def red(s: str) -> str:
    return f"\033[31m{s}\033[0m" if sys.stdout.isatty() else s


def yellow(s: str) -> str:
    return f"\033[33m{s}\033[0m" if sys.stdout.isatty() else s


def green(s: str) -> str:
    return f"\033[32m{s}\033[0m" if sys.stdout.isatty() else s


def main() -> int:
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("files", nargs="*", help="staged .ts files (typically passed by the pre-commit hook)")
    args = ap.parse_args()

    if not args.files:
        return 0

    # Group by slug — multiple files may import the same overlay; one translator covers them
    slug_aliases: dict[str, str] = {}  # slug → alias seen
    slug_sources: dict[str, list[Path]] = {}  # slug → list of importing .ts files
    for f in args.files:
        p = REPO_ROOT / f if not Path(f).is_absolute() else Path(f)
        if not p.exists() or p.suffix != ".ts":
            continue
        for alias, slug in detect_imports(p):
            slug_aliases.setdefault(slug, alias)
            slug_sources.setdefault(slug, []).append(p)

    if not slug_sources:
        return 0

    # Classify each slug: per-slug translator vs legacy vs missing
    to_translate: list[tuple[str, Path, Path]] = []  # (slug, script, overlay)
    legacy_warned: list[str] = []
    for slug, alias in slug_aliases.items():
        script_path = REPO_ROOT / "scripts" / f"translate-{slug}-via-gemini.py"
        overlay_path = REPO_ROOT / "src" / "lib" / "constants" / f"{slug}-overlay.json"
        if script_path.exists():
            to_translate.append((slug, script_path, overlay_path))
        elif alias == "OVERLAY_RAW":
            print(
                red(
                    f"    COMMIT BLOCKED: {slug} uses the scaffolder pattern but "
                    f"{script_path.relative_to(REPO_ROOT)} does not exist."
                ),
                file=sys.stderr,
            )
            print(
                red(f"    Generate it with: python3 scripts/scaffold-locale-table.py {slug} …"),
                file=sys.stderr,
            )
            return 1
        else:
            legacy_warned.append(slug)

    for slug in legacy_warned:
        srcs = ", ".join(p.name for p in slug_sources[slug])
        print(yellow(f"    legacy {slug} ({srcs}) — no per-slug translator; skipping (multi-purpose script handles this)"))

    if not to_translate:
        return 0

    # Auth gate
    if not gcloud_available():
        print()
        print(red("    COMMIT BLOCKED: scaffolded module(s) modified, but `gcloud auth print-access-token` failed."), file=sys.stderr)
        print(red("    Fix one of:"), file=sys.stderr)
        print(red("      a) `gcloud auth application-default login` (then retry commit)"), file=sys.stderr)
        print(red("      b) bypass: `git commit --no-verify` (run the translator manually before pushing)"), file=sys.stderr)
        return 1

    # Run translators (idempotent — translator prints "skip <locale>: complete" if no work)
    overlays_to_stage: list[Path] = []
    for slug, script_path, overlay_path in to_translate:
        srcs = ", ".join(p.name for p in slug_sources[slug])
        print(yellow(f"    sync {slug} ({srcs}) → {script_path.name}"))
        before_mtime = overlay_path.stat().st_mtime if overlay_path.exists() else 0.0
        proc = subprocess.run(["python3", str(script_path)], cwd=str(REPO_ROOT))
        if proc.returncode != 0:
            print(red(f"    BLOCK: translator exited {proc.returncode} for {slug}."), file=sys.stderr)
            return 1
        after_mtime = overlay_path.stat().st_mtime if overlay_path.exists() else 0.0
        if after_mtime > before_mtime:
            overlays_to_stage.append(overlay_path)

    if overlays_to_stage:
        subprocess.run(
            ["git", "add", "--"] + [str(p.relative_to(REPO_ROOT)) for p in overlays_to_stage],
            check=True, cwd=str(REPO_ROOT),
        )
        print(green(f"    overlay sync complete — {len(overlays_to_stage)} JSON file(s) re-staged"))
    else:
        print(green(f"    overlay sync complete — all {len(to_translate)} overlay(s) already in sync"))
    return 0


if __name__ == "__main__":
    sys.exit(main())
