#!/usr/bin/env python3
"""
Fill missing locale blocks (bn, ta, te, kn, gu) in src/app/[locale]/about/page.tsx
using Google Translate (free-tier via deep-translator).

Strategy: extract the `en: { ... },` block text, copy it, run regex
substitution over every `<key>: '...'` and standalone `'...'` value,
translate per target locale. Skip technical-identifier values
(currently just `icon: '...'`).

Inserts the new blocks immediately AFTER the `mr: { ... },` block
(per the existing en → hi → mai → mr ordering convention).
"""
import re
import sys
from pathlib import Path
from deep_translator import GoogleTranslator

ABOUT = Path(__file__).resolve().parent.parent / "src" / "app" / "[locale]" / "about" / "page.tsx"

TARGET_LOCALES = ["bn", "ta", "te", "kn", "gu"]

# Keys whose string values should NOT be translated (technical IDs)
SKIP_KEYS = {"icon"}

# Translation cache to avoid duplicate API calls
CACHE: dict[tuple[str, str], str] = {}


def translate(text: str, target: str) -> str:
    if not text.strip():
        return text
    key = (text, target)
    if key in CACHE:
        return CACHE[key]
    try:
        result = GoogleTranslator(source="en", target=target).translate(text)
        if not result:
            return text
        # Normalize apostrophes to U+2019 so single-quoted TS literals stay well-formed
        result = result.replace("'", "’")
        CACHE[key] = result
        return result
    except Exception as e:
        print(f"  WARN: translate {target!r} failed for {text[:40]!r}: {e}", file=sys.stderr)
        return text


def extract_en_block(src: str) -> tuple[int, int, str]:
    """Find the en: { ... } block and return (start, end, body)."""
    pat = re.compile(r"^  en: \{$", re.MULTILINE)
    m = pat.search(src)
    if not m:
        sys.exit("could not find `  en: {` in source")
    # Walk forward until matching `  },`
    depth = 1
    i = m.end()
    while i < len(src) and depth > 0:
        c = src[i]
        if c == '{':
            depth += 1
        elif c == '}':
            depth -= 1
            if depth == 0:
                # Include the closing `},`
                end = i + 1
                if src[end:end+1] == ',':
                    end += 1
                return m.start(), end, src[m.start():end]
        i += 1
    sys.exit("unbalanced braces in en block")


def find_mr_block_end(src: str) -> int:
    """Find the position immediately after the closing `},` of the mr block."""
    pat = re.compile(r"^  mr: \{$", re.MULTILINE)
    m = pat.search(src)
    if not m:
        sys.exit("could not find `  mr: {` in source")
    depth = 1
    i = m.end()
    while i < len(src) and depth > 0:
        c = src[i]
        if c == '{':
            depth += 1
        elif c == '}':
            depth -= 1
            if depth == 0:
                end = i + 1
                if src[end:end+1] == ',':
                    end += 1
                return end
        i += 1
    sys.exit("unbalanced braces in mr block")


def build_locale_block(en_block: str, target: str) -> str:
    """Copy the en block text, substituting in translated values."""
    # Match `<key>: '<value>'` anywhere — handles multi-key-on-same-line
    # array entries like `{ text: 'X', follow: 'Y' },`. Value regex
    # `(?:\\.|[^'\\])*` correctly handles escaped `\'` (e.g. `Bhadra\'s`).
    # Skip keys in SKIP_KEYS (technical IDs like `icon`).
    out = en_block
    keyed_pat = re.compile(r"(\w+):\s*'((?:\\.|[^'\\])*)'")
    def repl_keyed(m: re.Match) -> str:
        key, raw_value = m.group(1), m.group(2)
        if key in SKIP_KEYS:
            return m.group(0)
        # Unescape `\'` → `'` for translation input; output normalizes to U+2019
        value = raw_value.replace("\\'", "'")
        translated = translate(value, target)
        return f"{key}: '{translated}'"
    out = keyed_pat.sub(repl_keyed, out)

    # Header: change `en: {` to `<target>: {`
    out = re.sub(r"^  en: \{", f"  {target}: {{", out, count=1)
    return out


def main() -> int:
    src = ABOUT.read_text(encoding="utf-8")
    _, _, en_block = extract_en_block(src)
    print(f"Found en block ({len(en_block)} chars).")
    print(f"Translating to: {', '.join(TARGET_LOCALES)}")

    new_blocks = []
    for target in TARGET_LOCALES:
        # Skip if a locale block already exists
        if re.search(rf"^  {target}: \{{$", src, re.MULTILINE):
            print(f"  {target}: already exists, skipping")
            continue
        block = build_locale_block(en_block, target)
        new_blocks.append(block)
        # Approximate char count for the block we just translated
        keyed_pat = re.compile(r"\w+:\s*'([^']*)'")
        chars = sum(len(m.group(1)) for m in keyed_pat.finditer(en_block))
        print(f"  {target}: ready ({chars} chars translated)")

    if not new_blocks:
        print("Nothing to do.")
        return 0

    # Insert AFTER the mr block
    insert_at = find_mr_block_end(src)
    insertion = "\n" + "\n".join(new_blocks)
    out = src[:insert_at] + insertion + src[insert_at:]
    ABOUT.write_text(out, encoding="utf-8")
    print(f"\nInserted {len(new_blocks)} new locale block(s) after the `mr:` block.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
