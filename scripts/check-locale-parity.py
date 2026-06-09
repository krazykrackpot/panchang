#!/usr/bin/env python3
"""
check-locale-parity.py

Verify that every key in the message files of `src/messages/{pages,learn}/`
carries values for all 9 visible locales: en, hi, ta, te, bn, gu, kn, mai, mr.

Two parity checks are run:

  1. STRUCTURAL parity — every string value object must have all 9 locale
     keys present, even if the value is identical to the English fallback.
     Missing locale keys are P0 — they cause `useTranslations()` callers to
     crash or render `undefined` (CLAUDE.md Lesson J — locale fallback is
     non-negotiable).

  2. TRANSLATION parity (advisory) — flag locale values that are byte-for-byte
     identical to the English value. Either they are a genuine cognate
     ("UTC" stays "UTC" in every language) or they are an unauthored fallback.
     Heuristic only — emits warnings, never fails the build.

Designed to satisfy the KP roadmap spec (`docs/specs/2026-06-04-kp-system-roadmap.md`
§2.6) and to be re-usable for every future namespace addition.

Exit codes:
  0  all checks pass
  1  structural parity failure — at least one key is missing locale variants
  2  ran with --strict and one or more advisory warnings were emitted

Usage:
  scripts/check-locale-parity.py                       # check pages/ + learn/
  scripts/check-locale-parity.py --namespace kp-system # one namespace only
  scripts/check-locale-parity.py --strict              # warnings → failure
  scripts/check-locale-parity.py --baseline FILE       # ignore known shadows
"""

from __future__ import annotations

import argparse
import json
import sys
from pathlib import Path

REPO_ROOT = Path(__file__).resolve().parents[1]
MESSAGES_ROOT = REPO_ROOT / "src" / "messages"
CONSTANTS_ROOT = REPO_ROOT / "src" / "lib" / "constants"
VISIBLE_LOCALES = ("en", "hi", "ta", "te", "bn", "gu", "kn", "mai", "mr")
SCAN_DIRS = ("pages", "learn", "components", "global")
# Overlay families in src/lib/constants/ ship one file per locale —
# pattern `(.+)-(<loc>)-overlay.json`. The parity check verifies that
# every locale within a family carries the SAME set of translation keys,
# closing the gap flagged in Gemini-substitute review of PR #623.


def find_namespaces(scope: str | None) -> list[Path]:
    """Return the JSON files to scan. `scope` filters by basename stem."""
    paths: list[Path] = []
    for sub in SCAN_DIRS:
        d = MESSAGES_ROOT / sub
        if not d.is_dir():
            continue
        for p in sorted(d.glob("*.json")):
            if scope is None or p.stem == scope:
                paths.append(p)
    return paths


def load_json(path: Path) -> dict | list:
    try:
        return json.loads(path.read_text(encoding="utf-8"))
    except Exception as e:
        print(f"ERROR: failed to parse {path}: {e}", file=sys.stderr)
        sys.exit(1)


def is_locale_object(value) -> bool:
    """A 'locale object' has at least an `en` key plus other locale strings."""
    if not isinstance(value, dict):
        return False
    if "en" not in value:
        return False
    return all(isinstance(v, str) for v in value.values())


def walk_locale_objects(data, prefix: str = ""):
    """Yield `(path, locale_obj)` tuples for every value that looks like a
    locale-keyed translation object inside an arbitrary JSON tree."""
    if is_locale_object(data):
        yield prefix.rstrip("."), data
        return
    if isinstance(data, dict):
        for k, v in data.items():
            yield from walk_locale_objects(v, f"{prefix}{k}.")
    elif isinstance(data, list):
        for i, v in enumerate(data):
            yield from walk_locale_objects(v, f"{prefix}{i}.")


def check_structural_parity(files: list[Path]) -> list[str]:
    """Return list of failure strings; empty if everything passes."""
    failures: list[str] = []
    for path in files:
        data = load_json(path)
        # `as_posix()` keeps the path forward-slashed on every platform so
        # baseline-file comparisons (which we author with `/`) work on Windows.
        rel = path.relative_to(REPO_ROOT).as_posix()
        for key_path, locale_obj in walk_locale_objects(data):
            missing = [loc for loc in VISIBLE_LOCALES if loc not in locale_obj]
            if missing:
                failures.append(
                    f"{rel}:{key_path or '<root>'}: missing locales {missing}"
                )
    return failures


def check_translation_shadows(
    files: list[Path], baseline: set[str]
) -> list[str]:
    """Return warnings for locale values that byte-equal the English fallback.

    Heuristic — short strings are often genuine cognates ("OK", "UTC"); we
    only flag values longer than 4 characters to reduce noise.
    """
    warnings: list[str] = []
    for path in files:
        data = load_json(path)
        rel = path.relative_to(REPO_ROOT).as_posix()
        for key_path, locale_obj in walk_locale_objects(data):
            en = locale_obj.get("en", "")
            if len(en) <= 4:
                continue
            for loc in VISIBLE_LOCALES:
                if loc == "en":
                    continue
                value = locale_obj.get(loc)
                if value is None or value != en:
                    continue
                marker = f"{rel}:{key_path or '<root>'}:{loc}"
                if marker in baseline:
                    continue
                warnings.append(f"shadow: {marker} == en value")
    return warnings


def discover_overlay_families() -> dict[str, dict[str, Path]]:
    """Group constants/*-{loc}-overlay.json into families.

    Returns `{ family_name: { locale: Path } }`. A family is keyed by the
    text before `-<loc>-overlay.json`. Locales outside VISIBLE_LOCALES are
    ignored (the legacy `sa` retirement may leave stale files lying around).
    """
    import re
    families: dict[str, dict[str, Path]] = {}
    if not CONSTANTS_ROOT.is_dir():
        return families
    pat = re.compile(r"^(?P<family>.+)-(?P<loc>[a-z]+)-overlay\.json$")
    for p in sorted(CONSTANTS_ROOT.glob("*-overlay.json")):
        m = pat.match(p.name)
        if not m:
            continue
        loc = m.group("loc")
        if loc not in VISIBLE_LOCALES:
            continue
        families.setdefault(m.group("family"), {})[loc] = p
    return families


def check_overlay_parity(families: dict[str, dict[str, Path]]) -> list[str]:
    """Verify every locale in each family has the same translation key set.

    A family that only ships SOME locales is OK (regional overlays often
    skip en/hi when they're the source-of-truth). The check is: WITHIN the
    locales that DO have a file, the key sets must match.
    """
    failures: list[str] = []
    for family, by_loc in families.items():
        # Each overlay's translations are at d['translations'] (the
        # convention used by all current overlays). Fall back to the whole
        # object if that key is missing — covers earlier overlay shapes.
        key_sets: dict[str, frozenset[str]] = {}
        for loc, path in by_loc.items():
            data = load_json(path)
            if isinstance(data, dict) and isinstance(data.get("translations"), dict):
                keys = frozenset(data["translations"].keys())
            elif isinstance(data, dict):
                keys = frozenset(k for k in data.keys() if not k.startswith("_"))
            else:
                continue
            key_sets[loc] = keys
        if len(key_sets) < 2:
            continue
        union = frozenset().union(*key_sets.values())
        for loc, keys in key_sets.items():
            missing = sorted(union - keys)
            if missing:
                rel = (by_loc[loc].relative_to(REPO_ROOT)).as_posix()
                failures.append(
                    f"{rel}: family '{family}' missing {len(missing)} key(s): "
                    f"{missing[:5]}{'…' if len(missing) > 5 else ''}"
                )
    return failures


def load_baseline(path: Path | None) -> set[str]:
    if path is None or not path.exists():
        return set()
    return {
        line.strip()
        for line in path.read_text(encoding="utf-8").splitlines()
        if line.strip() and not line.startswith("#")
    }


def main() -> int:
    ap = argparse.ArgumentParser(description=__doc__)
    ap.add_argument("--namespace", help="Limit scan to one namespace stem")
    ap.add_argument("--strict", action="store_true", help="Warnings cause exit 2")
    ap.add_argument(
        "--baseline",
        type=Path,
        help="Path to a file listing acceptable English-shadow markers",
    )
    args = ap.parse_args()

    files = find_namespaces(args.namespace)
    if not files:
        print(f"No message files found for scope '{args.namespace}'", file=sys.stderr)
        return 1

    print(f"Scanning {len(files)} namespace file(s) under {MESSAGES_ROOT.relative_to(REPO_ROOT)}/")

    failures = check_structural_parity(files)
    if failures:
        print(f"\n❌ Structural parity failures ({len(failures)}):")
        for f in failures[:50]:
            print(f"  {f}")
        if len(failures) > 50:
            print(f"  … and {len(failures) - 50} more")
        return 1
    print("✓ Structural parity: every key has all 9 locale variants")

    # Overlay families in src/lib/constants/ — added per Gemini-substitute
    # review of PR #623. Skipped when --namespace narrows to one messages
    # namespace (the overlays are a separate concern).
    if args.namespace is None:
        families = discover_overlay_families()
        if families:
            overlay_failures = check_overlay_parity(families)
            if overlay_failures:
                print(f"\n❌ Overlay key-set parity failures ({len(overlay_failures)}):")
                for f in overlay_failures[:30]:
                    print(f"  {f}")
                if len(overlay_failures) > 30:
                    print(f"  … and {len(overlay_failures) - 30} more")
                return 1
            print(f"✓ Overlay parity: {len(families)} families have matching key sets")

    baseline = load_baseline(args.baseline)
    shadows = check_translation_shadows(files, baseline)
    if shadows:
        print(f"\n⚠ English-shadow warnings ({len(shadows)} new entries vs baseline):")
        for s in shadows[:30]:
            print(f"  {s}")
        if len(shadows) > 30:
            print(f"  … and {len(shadows) - 30} more")
        if args.strict:
            return 2
    else:
        print("✓ Translation shadows: no new English-text fallbacks since baseline")

    return 0


if __name__ == "__main__":
    sys.exit(main())
