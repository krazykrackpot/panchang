#!/usr/bin/env python3
"""
Translate the /devotional/[type]/[slug] cluster strings via Gemini 2.5
Flash on Vertex AI. The corpus is in src/lib/content/devotional-content.ts:

  - 55 DevotionalItem entries, each carrying:
      title.en        → translate to 7 locales
      meaning         → long EN paragraph (mantra explanation)
      significance    → long EN paragraph (when/why to recite)
  - DEVANAGARI text + transliteration stay AS-IS (sacred text — not
    translated, only the surrounding chrome and explanatory paragraphs
    get localized).

Output: src/lib/constants/devotional-{locale}-overlay.json — keyed by
`<slug>.<field>` (title / meaning / significance). Runtime merger
attaches these to the existing items at module load.
"""
import json
import re
import subprocess
import sys
import time
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
SOURCE = ROOT / "src/lib/content/devotional-content.ts"
OUT_DIR = ROOT / "src/lib/constants"
PROJECT = "dekhopanchang"
MODEL = "gemini-2.5-flash"
ENDPOINT = (
    f"https://us-central1-aiplatform.googleapis.com/v1/projects/"
    f"{PROJECT}/locations/us-central1/publishers/google/models/"
    f"{MODEL}:generateContent"
)

LOCALES = {
    "mai": "Maithili (Devanagari, natural Maithili register, retain Sanskrit Jyotish/devotional terms in Devanagari)",
    "mr":  "Marathi (Devanagari, natural Marathi register, retain Sanskrit devotional terms in Devanagari)",
    "ta":  "Tamil (Tamil script, natural Tamil register, retain Sanskrit deity names in Tamil transliteration: விஷ்ணு/சிவன்/லட்சுமி/etc.)",
    "te":  "Telugu (Telugu script, natural Telugu register, canonical Telugu devotional vocabulary)",
    "kn":  "Kannada (Kannada script, natural Kannada register, canonical Kannada devotional vocabulary)",
    "gu":  "Gujarati (Gujarati script, natural Gujarati register, canonical Gujarati devotional vocabulary)",
    "bn":  "Bengali (Bengali script, natural Bengali register, canonical Bengali devotional vocabulary: বিষ্ণু/শিব/লক্ষ্মী/etc.)",
}


def get_access_token() -> str:
    return subprocess.check_output(
        ["gcloud", "auth", "print-access-token"], text=True
    ).strip()


def extract_devotional_strings(content: str) -> dict[str, str]:
    """
    Walk DevotionalItem literals and extract:
        <slug>.title       — item.title.en
        <slug>.meaning     — item.meaning (template literal or string)
        <slug>.significance — item.significance
    Returns {key: en_string} preserving newlines and unicode literally.
    """
    out: dict[str, str] = {}

    # Walk by `slug: 'xxx'` markers. From each marker to the next
    # `^  }` (closing brace at item indent), that's the body — short-
    # circuiting on the next `slug:` line catches malformed cases.
    item_pattern = re.compile(
        r"(    slug:\s*'[^']+',(?:.*\n)*?)(?=^  \},)",
        re.MULTILINE,
    )
    slug_re = re.compile(r"^    slug:\s*'([^']+)',", re.MULTILINE)
    title_en_re = re.compile(
        r"^    title:\s*\{\s*en:\s*'((?:\\.|[^'])*)',\s*hi:",
        re.MULTILINE,
    )
    # meaning: backtick template literal OR single-quoted string.
    field_template_re = re.compile(
        r"^    (meaning|significance):\s*`((?:\\.|[^`])*?)`,",
        re.MULTILINE | re.DOTALL,
    )
    field_string_re = re.compile(
        r"^    (meaning|significance):\s*'((?:\\.|[^'])*)',",
        re.MULTILINE,
    )

    for match in item_pattern.finditer(content):
        body = match.group(1)
        slug_match = slug_re.search(body)
        if not slug_match:
            continue
        slug = slug_match.group(1)
        title_match = title_en_re.search(body)
        if title_match:
            out[f"{slug}.title"] = _unescape(title_match.group(1))
        for field_match in field_template_re.finditer(body):
            field = field_match.group(1)
            text = field_match.group(2)
            out[f"{slug}.{field}"] = _unescape_template(text)
        for field_match in field_string_re.finditer(body):
            field = field_match.group(1)
            text = field_match.group(2)
            key = f"{slug}.{field}"
            if key not in out:  # template regex wins if both matched somehow
                out[key] = _unescape(text)

    return out


def _unescape(s: str) -> str:
    """Single-quoted JS string: only `\\'` and basic backslash escapes."""
    return s.replace("\\'", "'").replace('\\"', '"').replace("\\\\", "\\")


def _unescape_template(s: str) -> str:
    """Template literal: handles `\\n`, `\\``, `\\$` and preserves newlines."""
    return (
        s.replace("\\`", "`")
         .replace("\\$", "$")
         .replace("\\n", "\n")
    )


def _call_gemini(
    token: str, chunk: dict[str, str], locale_desc: str, locale: str, chunk_idx: int,
) -> dict[str, str]:
    """Single Gemini call; raises on retryable issues."""
    prompt = (
        f"Translate the following English Vedic-devotional content to {locale_desc}.\n\n"
        f"Rules:\n"
        f"- Output ONLY a JSON object, no markdown fences, no commentary.\n"
        f"- Keys must be identical to the input.\n"
        f"- Deity names (Vishnu, Shiva, Lakshmi, Hanuman, etc.) translate to the locale's canonical devotional form.\n"
        f"- Preserve sacred Sanskrit terms (aarti, chalisa, stotram, mantra, bhakti, japa) in the target script — these are tatsama loanwords.\n"
        f"- Keep proper noun lists and Sanskrit slokas intact when they appear inside the English text.\n"
        f"- Maintain natural sentence flow in the target language.\n\n"
        f"Input:\n"
        + json.dumps(chunk, ensure_ascii=False, indent=2)
    )
    body = {
        "contents": [{"role": "user", "parts": [{"text": prompt}]}],
        "generationConfig": {
            "responseMimeType": "application/json",
            "temperature": 0.3,
            "maxOutputTokens": 65536,
        },
    }
    # curl --retry 3 + retry-on-transient-errors handles flaky network
    # paths (curl exit 56 = mid-stream truncation, exit 28 = timeout).
    # --max-time 300 puts an upper bound per call so a stuck connection
    # doesn't hang the whole batch.
    proc = subprocess.run(
        [
            "curl", "-s", "-f", "-X", "POST",
            "--retry", "3", "--retry-all-errors", "--retry-delay", "5",
            "--max-time", "300",
            "-H", f"Authorization: Bearer {token}",
            "-H", "Content-Type: application/json",
            ENDPOINT,
            "-d", json.dumps(body, ensure_ascii=False),
        ],
        capture_output=True, text=True, check=True,
    )
    raw = json.loads(proc.stdout)
    if "candidates" not in raw:
        raise RuntimeError(f"Gemini error ({locale} chunk {chunk_idx}): {json.dumps(raw)[:400]}")
    cand = raw["candidates"][0]
    finish_reason = cand.get("finishReason", "STOP")
    text = cand.get("content", {}).get("parts", [{}])[0].get("text", "")
    if finish_reason == "MAX_TOKENS":
        raise RuntimeError(f"MAX_TOKENS hit ({locale} chunk {chunk_idx})")
    try:
        return json.loads(text)
    except json.JSONDecodeError:
        stripped = re.sub(r"^```(?:json)?\n?|\n?```$", "", text.strip(), flags=re.MULTILINE)
        return json.loads(stripped)


def gemini_translate(
    token: str,
    texts: dict[str, str],
    locale: str,
    locale_desc: str,
    chunk_size: int = 15,
) -> dict[str, str]:
    """
    Translate `texts` in chunks with retry-on-truncation. If Gemini
    returns truncated/malformed JSON the chunk is split in half and
    retried up to `max_retries` times before giving up on the chunk.
    Partial successes are preserved so re-running picks up where we
    left off.
    """
    out: dict[str, str] = {}
    keys = list(texts.keys())

    def do_chunk(chunk_keys: list[str], depth: int = 0) -> None:
        if not chunk_keys:
            return
        chunk = {k: texts[k] for k in chunk_keys}
        try:
            parsed = _call_gemini(token, chunk, locale_desc, locale, len(out))
        except (json.JSONDecodeError, RuntimeError, subprocess.CalledProcessError) as e:
            err_msg = str(e)[:200]
            if depth >= 5 or len(chunk_keys) <= 1:
                raise RuntimeError(
                    f"{locale} chunk of {len(chunk_keys)} failed after depth {depth}: {err_msg}"
                ) from e
            mid = len(chunk_keys) // 2
            print(f"  [retry] {locale} chunk of {len(chunk_keys)} → splitting at {mid}: {err_msg}", file=sys.stderr)
            do_chunk(chunk_keys[:mid], depth + 1)
            do_chunk(chunk_keys[mid:], depth + 1)
            return
        for k in chunk_keys:
            if k not in parsed:
                raise RuntimeError(f"Missing translation for {k} in {locale}")
            out[k] = parsed[k]

    for i in range(0, len(keys), chunk_size):
        do_chunk(keys[i : i + chunk_size])
    return out


def main() -> None:
    if not SOURCE.exists():
        sys.exit(f"Source not found: {SOURCE}")
    print(f"Reading: {SOURCE}")
    contents = SOURCE.read_text()
    extracted = extract_devotional_strings(contents)
    print(f"Extracted {len(extracted)} strings from {len({k.split('.')[0] for k in extracted})} items")

    # Also extract TYPE_LABELS and DAY_NAMES for chrome translation.
    chrome = {
        "type.aarti": "Aarti",
        "type.chalisa": "Chalisa",
        "type.stotram": "Stotram",
        "type.mantra": "Mantra",
        "day.0": "Sunday",
        "day.1": "Monday",
        "day.2": "Tuesday",
        "day.3": "Wednesday",
        "day.4": "Thursday",
        "day.5": "Friday",
        "day.6": "Saturday",
    }
    extracted.update(chrome)
    print(f"Including chrome: {len(chrome)} entries → {len(extracted)} total")

    token = get_access_token()
    for locale, locale_desc in LOCALES.items():
        out_path = OUT_DIR / f"devotional-{locale}-overlay.json"
        if out_path.exists():
            existing = json.loads(out_path.read_text())
            translations = existing.get("translations", {})
            if len(translations) >= len(extracted):
                print(f"  skip {locale}: complete")
                continue
        print(f"Translating to {locale} ({len(extracted)} strings)...")
        t0 = time.time()
        translations = gemini_translate(token, extracted, locale, locale_desc)
        elapsed = time.time() - t0
        overlay = {
            "_meta": {
                "locale": locale,
                "source": f"Translated from devotional-content.ts via Gemini 2.5 Flash on Vertex AI ({MODEL}).",
                "generated": "2026-06-07",
                "review_status": "pending-native-review",
                "string_count": len(extracted),
            },
            "translations": translations,
        }
        out_path.write_text(
            json.dumps(overlay, ensure_ascii=False, indent=2) + "\n"
        )
        total_chars = sum(len(v) for v in translations.values())
        print(f"  wrote {out_path.name} ({elapsed:.1f}s, {total_chars} chars)")


if __name__ == "__main__":
    main()
