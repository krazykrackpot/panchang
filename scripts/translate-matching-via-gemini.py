#!/usr/bin/env python3
"""
Batch-translate /matching cluster source strings via Gemini 2.5 Flash
on Vertex AI (free for first 1500 RPM on flash-tier).

Authenticates via gcloud Application Default Credentials.

Source: src/lib/constants/rashi-compatibility.ts — extracts the 3 data
dictionaries' English entries (ELEMENT_COMPAT, LORD_REL_TEXT,
DISTANCE_TEXT). 52 unique English paragraphs total.

Output: src/lib/constants/matching-{locale}-overlay.json — one JSON
file per locale, keyed identically to the source structure for a
trivial runtime overlay merger.

Locales: 7 (mai, mr, ta, te, kn, gu, bn) — matches the lagna parity
roll.

Usage:
  gcloud auth application-default login   # one-time
  python3 scripts/translate-matching-via-gemini.py
"""
import json
import re
import subprocess
import sys
import time
from pathlib import Path
from typing import Any

ROOT = Path(__file__).resolve().parent.parent
SOURCE = ROOT / "src/lib/constants/rashi-compatibility.ts"
OUT_DIR = ROOT / "src/lib/constants"
PROJECT = "dekhopanchang"
MODEL = "gemini-2.5-flash"
ENDPOINT = (
    f"https://us-central1-aiplatform.googleapis.com/v1/projects/"
    f"{PROJECT}/locations/us-central1/publishers/google/models/"
    f"{MODEL}:generateContent"
)

LOCALES = {
    "mai": "Maithili (Devanagari script, natural Maithili register, retain Sanskrit Jyotish terms like ग्रह/राशि/लग्न/भाव in Devanagari)",
    "mr":  "Marathi (Devanagari script, natural Marathi register, retain Sanskrit Jyotish terms in Devanagari)",
    "ta":  "Tamil (Tamil script, natural Tamil register, use canonical Tamil Jyotish vocabulary: லக்னம் for ascendant, ராசி for sign, கிரகம் for planet, பாவம் for house)",
    "te":  "Telugu (Telugu script, natural Telugu register, use canonical Telugu Jyotish vocabulary: లగ్నం for ascendant, రాశి for sign, గ్రహం for planet, భావం for house)",
    "kn":  "Kannada (Kannada script, natural Kannada register, use canonical Kannada Jyotish vocabulary: ಲಗ್ನ for ascendant, ರಾಶಿ for sign, ಗ್ರಹ for planet, ಭಾವ for house)",
    "gu":  "Gujarati (Gujarati script, natural Gujarati register, use canonical Gujarati Jyotish vocabulary: લગ્ન for ascendant, રાશિ for sign, ગ્રહ for planet, ભાવ for house)",
    "bn":  "Bengali (Bengali script, natural Bengali register, use canonical Bengali Jyotish vocabulary: লগ্ন for ascendant, রাশি for sign, গ্রহ for planet, ভাব for house)",
}


def get_access_token() -> str:
    return subprocess.check_output(
        ["gcloud", "auth", "print-access-token"], text=True
    ).strip()


def extract_english_strings(source_ts: str) -> dict[str, dict[str, str]]:
    """
    Pulls English entries from ELEMENT_COMPAT, LORD_REL_TEXT,
    DISTANCE_TEXT dictionaries. Returns a nested map keyed by
    section -> key -> field -> en string.

    We rely on the source's stable `en: '...'` lines following each
    field declaration. Each field is on its own block; we walk
    the matching brace structure.
    """
    out: dict[str, dict[str, dict[str, str]]] = {
        "ELEMENT_COMPAT": {},
        "LORD_REL_TEXT": {},
        "DISTANCE_TEXT": {},
    }

    section_re = re.compile(
        r"const (ELEMENT_COMPAT|LORD_REL_TEXT|DISTANCE_TEXT): "
        r"Record<[^>]+>\s*=\s*\{(.*?)^\};",
        re.DOTALL | re.MULTILINE,
    )
    # Entry per section: "  'fire-fire': { temperament: { en: '...', hi: '...', ... }, romance: { en: '...', ... } },"
    entry_re = re.compile(
        r"^  ['\"]?([\w/-]+)['\"]?:\s*\{(.*?)^  \},",
        re.DOTALL | re.MULTILINE,
    )
    # Within an entry: "    temperament: { en: '...', hi: '...', sa: '...' },"
    field_re = re.compile(
        r"^    (\w+):\s*\{(.*?)^    \},",
        re.DOTALL | re.MULTILINE,
    )
    en_re = re.compile(r"^      en:\s*['\"](.*?)['\"],\s*$", re.MULTILINE | re.DOTALL)

    for section_match in section_re.finditer(source_ts):
        section = section_match.group(1)
        body = section_match.group(2)
        for entry_match in entry_re.finditer(body):
            key = entry_match.group(1)
            entry_body = entry_match.group(2)
            out[section][key] = {}
            for field_match in field_re.finditer(entry_body):
                field = field_match.group(1)
                field_body = field_match.group(2)
                en_match = en_re.search(field_body)
                if not en_match:
                    continue
                # Unescape simple JS string escapes
                en = en_match.group(1).encode("utf-8").decode("unicode_escape")
                # Re-encode TS apostrophe escapes back to plain text
                en = en.replace("\\'", "'").replace('\\"', '"')
                out[section][key][field] = en
    return out


def gemini_translate_batch(
    token: str,
    texts: list[str],
    locale: str,
    locale_desc: str,
) -> list[str]:
    """
    Single Vertex AI call with multiple texts. Returns a list of
    translated strings in the same order. Uses structured JSON
    output to avoid prose contamination.
    """
    prompt = (
        f"You are translating Vedic astrology relationship/compatibility text "
        f"to {locale_desc}.\n\n"
        f"Rules:\n"
        f"- Output ONLY the JSON object, no markdown fences, no commentary.\n"
        f"- Keep numeric scores (X/36), house-axis notation (5/9, 6/8), "
        f"and the em-dash spacing identical to the source.\n"
        f"- Translate ALL English prose, including transitional words.\n"
        f"- Preserve natural sentence flow in the target language.\n"
        f"- Astrological terms (rashi names, planet names, house axis) "
        f"should follow the locale's canonical Jyotish vocabulary.\n\n"
        f"Input is a JSON object with numeric keys mapping to English text. "
        f"Output a JSON object with the SAME numeric keys mapping to translations.\n\n"
        f"Input:\n"
        + json.dumps({str(i): t for i, t in enumerate(texts)}, ensure_ascii=False, indent=2)
    )
    body = {
        "contents": [{"role": "user", "parts": [{"text": prompt}]}],
        "generationConfig": {
            "responseMimeType": "application/json",
            "temperature": 0.3,
            "maxOutputTokens": 65536,
        },
    }
    proc = subprocess.run(
        [
            "curl",
            "-s",
            "-X",
            "POST",
            "-H",
            f"Authorization: Bearer {token}",
            "-H",
            "Content-Type: application/json",
            ENDPOINT,
            "-d",
            json.dumps(body, ensure_ascii=False),
        ],
        capture_output=True,
        text=True,
        check=True,
    )
    raw = json.loads(proc.stdout)
    if "candidates" not in raw:
        print("Gemini error:", json.dumps(raw)[:600], file=sys.stderr)
        raise RuntimeError(f"Gemini call failed for {locale}")
    text = raw["candidates"][0]["content"]["parts"][0]["text"]
    try:
        parsed = json.loads(text)
    except json.JSONDecodeError:
        # strip code fences if Gemini ignored the format hint
        text = re.sub(r"^```(?:json)?\n?|\n?```$", "", text.strip(), flags=re.MULTILINE)
        parsed = json.loads(text)
    return [parsed[str(i)] for i in range(len(texts))]


def main() -> None:
    if not SOURCE.exists():
        sys.exit(f"Source not found: {SOURCE}")
    print(f"Reading: {SOURCE}")
    source_ts = SOURCE.read_text()
    extracted = extract_english_strings(source_ts)

    # Build a single ordered list of (section, key, field, en) tuples
    flat: list[tuple[str, str, str, str]] = []
    for section in ("ELEMENT_COMPAT", "LORD_REL_TEXT", "DISTANCE_TEXT"):
        for key in sorted(extracted[section].keys(), key=lambda k: (len(k), k)):
            for field in extracted[section][key].keys():
                en = extracted[section][key][field]
                flat.append((section, key, field, en))
    en_texts = [en for _, _, _, en in flat]

    print(f"Extracted {len(flat)} English strings: "
          f"{sum(1 for s,_,_,_ in flat if s=='ELEMENT_COMPAT')} element, "
          f"{sum(1 for s,_,_,_ in flat if s=='LORD_REL_TEXT')} lord, "
          f"{sum(1 for s,_,_,_ in flat if s=='DISTANCE_TEXT')} distance")

    token = get_access_token()

    for locale, locale_desc in LOCALES.items():
        out_path = OUT_DIR / f"matching-{locale}-overlay.json"
        if out_path.exists():
            print(f"  skip {locale}: {out_path.name} exists")
            continue
        print(f"Translating to {locale} ...")
        t0 = time.time()
        translations = gemini_translate_batch(token, en_texts, locale, locale_desc)
        elapsed = time.time() - t0
        if len(translations) != len(en_texts):
            sys.exit(f"Translation count mismatch for {locale}: "
                     f"expected {len(en_texts)}, got {len(translations)}")
        overlay: dict[str, dict[str, dict[str, str]]] = {
            "_meta": {
                "locale": locale,
                "source": f"Translated from rashi-compatibility.ts via Gemini 2.5 Flash on Vertex AI ({MODEL}).",
                "generated": "2026-06-07",
                "review_status": "pending-native-review",
                "section_count": "ELEMENT_COMPAT 10 keys, LORD_REL_TEXT 4 keys, DISTANCE_TEXT 12 keys",
            },
            "ELEMENT_COMPAT": {},
            "LORD_REL_TEXT": {},
            "DISTANCE_TEXT": {},
        }
        for (section, key, field, _), tr in zip(flat, translations):
            overlay[section].setdefault(key, {})[field] = tr
        out_path.write_text(
            json.dumps(overlay, ensure_ascii=False, indent=2) + "\n"
        )
        print(f"  wrote {out_path.name} ({elapsed:.1f}s, "
              f"{sum(len(t) for t in translations)} chars)")


if __name__ == "__main__":
    main()
