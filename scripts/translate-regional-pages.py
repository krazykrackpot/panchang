#!/usr/bin/env python3
"""
Fill LocaleText overlays on the 10 regional calendar pages using Google
Translate (free tier via deep-translator). Replaces every `{ en: '...' }`
single-locale literal with `{ en: '...', hi: '...', <regional>: '...' }`.

Per-page regional target locale (mapped to our 9 visible locales):
  bengali  -> bn
  tamil    -> ta
  telugu   -> te
  kannada  -> kn
  mithila  -> mai
  gujarati -> gu
  marathi  -> mr
  malayalam, odia, iskcon -> hi only (no malayalam/odia in our 9 visible
                              locales; iskcon is pan-Indian)

The regex matches only single-locale `{ en: '...' }` — multi-locale
entries already present are skipped automatically.

Uses single-quoted strings with U+2019 (right single quote) for any
apostrophes inside the source, matching the convention in the existing
PR #687 refactor.
"""

import argparse
import re
import sys
import time
from pathlib import Path

from deep_translator import GoogleTranslator

# Repo-relative path so the script works for any contributor and in CI.
ROOT = Path(__file__).resolve().parent.parent / "src" / "app" / "[locale]" / "calendar" / "regional"

# (page-folder, [target_locales])
PAGES = [
    ("bengali",   ["hi", "bn"]),
    ("tamil",     ["hi", "ta"]),
    ("telugu",    ["hi", "te"]),
    ("kannada",   ["hi", "kn"]),
    ("mithila",   ["hi", "mai"]),
    ("gujarati",  ["hi", "gu"]),
    ("marathi",   ["hi", "mr"]),
    ("malayalam", ["hi"]),
    ("odia",      ["hi"]),
    ("iskcon",    ["hi"]),
]

# Match { en: '...' } where ... contains no plain ASCII single quote.
# (We use U+2019 for in-string apostrophes per the file convention.)
RE_LOCALE_TEXT = re.compile(r"\{\s*en:\s*'([^']*)'\s*\}")


def escape_single_quotes(s: str) -> str:
    """Translation may introduce ASCII apostrophes. Replace with U+2019
    so the resulting single-quoted TS literal stays well-formed."""
    return s.replace("'", "’")


def translate_to(en_text: str, target: str, cache: dict) -> str:
    key = (en_text, target)
    if key in cache:
        return cache[key]
    # Retry on transient network/rate-limit blips.
    last_err = None
    for attempt in range(3):
        try:
            out = GoogleTranslator(source="en", target=target).translate(en_text)
            if not out:
                raise RuntimeError("empty translation")
            cache[key] = escape_single_quotes(out)
            # Throttle to avoid free-tier rate-limit / IP block when running
            # over hundreds of strings (Gemini #688 MED finding).
            time.sleep(0.2)
            return cache[key]
        except Exception as e:
            last_err = e
            time.sleep(1 + attempt)
    raise RuntimeError(f"translate {target!r} failed for {en_text[:40]!r}: {last_err}")


def process_file(folder: str, targets: list[str], dry_run: bool) -> tuple[int, int]:
    path = ROOT / folder / "page.tsx"
    src = path.read_text(encoding="utf-8")
    matches = list(RE_LOCALE_TEXT.finditer(src))
    if not matches:
        print(f"  {folder}: no `{{ en: ... }}` literals found")
        return (0, 0)

    cache: dict = {}
    total_chars = 0
    replacements: list[tuple[int, int, str]] = []
    for m in matches:
        en_text = m.group(1)
        if not en_text.strip():
            continue
        parts = [f"en: '{en_text}'"]
        for target in targets:
            translated = translate_to(en_text, target, cache)
            parts.append(f"{target}: '{translated}'")
            total_chars += len(en_text)
        replacement = "{ " + ", ".join(parts) + " }"
        replacements.append((m.start(), m.end(), replacement))

    if dry_run:
        print(f"  {folder}: {len(replacements)} literals, ~{total_chars} chars translated (dry run, file unchanged)")
        return (len(replacements), total_chars)

    # Apply replacements right-to-left to preserve byte offsets
    out = src
    for start, end, rep in reversed(replacements):
        out = out[:start] + rep + out[end:]
    path.write_text(out, encoding="utf-8")
    print(f"  {folder}: rewrote {len(replacements)} literals, ~{total_chars} chars translated")
    return (len(replacements), total_chars)


def main() -> int:
    ap = argparse.ArgumentParser(description=__doc__)
    ap.add_argument("--dry-run", action="store_true", help="count + estimate; do not write files")
    ap.add_argument("--only", help="comma-separated list of page folders to process")
    args = ap.parse_args()

    if args.only:
        wanted = set(args.only.split(","))
        pages = [(p, t) for p, t in PAGES if p in wanted]
    else:
        pages = PAGES

    print(f"Processing {len(pages)} page(s); dry_run={args.dry_run}")
    grand_lits = 0
    grand_chars = 0
    for folder, targets in pages:
        try:
            lits, chars = process_file(folder, targets, args.dry_run)
            grand_lits += lits
            grand_chars += chars
        except Exception as e:
            print(f"  {folder}: FAILED — {e}")
            return 1
    print(f"\nTotals: {grand_lits} literals, ~{grand_chars} chars translated")
    return 0


if __name__ == "__main__":
    sys.exit(main())
