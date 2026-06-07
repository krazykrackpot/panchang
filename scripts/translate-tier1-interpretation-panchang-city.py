#!/usr/bin/env python3
"""
Translate the two remaining Tier-1 hi-only files for 7 non-Hindi locales:

  components/interpretation-helpers.json   81 keys
  pages/panchang-city.json                 28 keys

Total: 109 keys × 7 locales = 763 strings.

Batches per-locale (one Gemini call per locale, both files in the same
prompt) — 7 API calls total. The model gets English + the existing Hindi
translation as paired references for register/terminology consistency.

Writes directly into the src/messages JSON files (no overlay layer —
those files are next-intl messages, NOT runtime overlays).

Background: ekadashi/panchang/choghadiya translation scripts use the
overlay pattern (writing to src/lib/constants/*-overlay.json) because
they translate data files at runtime. For src/messages/{pages,components,
learn}/*.json, useTranslations() reads the file directly — so we mutate
in place.
"""
import json
import re
import subprocess
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
PROJECT = "dekhopanchang"
MODEL = "gemini-2.5-flash"
ENDPOINT = (
    f"https://us-central1-aiplatform.googleapis.com/v1/projects/"
    f"{PROJECT}/locations/us-central1/publishers/google/models/"
    f"{MODEL}:generateContent"
)

FILES = [
    ROOT / "src/messages/components/interpretation-helpers.json",
    ROOT / "src/messages/pages/panchang-city.json",
]

LOCALES = {
    "ta": "Tamil (Tamil script, natural Tamil register, retain canonical Jyotish terms; use Tamil Jyotish vocabulary where established, e.g. ராசி for sign, கிரகம் for planet, நட்சத்திரம் for nakshatra)",
    "te": "Telugu (Telugu script, natural Telugu register; canonical Jyotish vocabulary: రాశి, గ్రహం, నక్షత్రం)",
    "bn": "Bengali (Bengali script, natural Bengali register; canonical Jyotish vocabulary: রাশি, গ্রহ, নক্ষত্র)",
    "gu": "Gujarati (Gujarati script, natural Gujarati register; canonical Jyotish vocabulary: રાશિ, ગ્રહ, નક્ષત્ર)",
    "kn": "Kannada (Kannada script, natural Kannada register; canonical Jyotish vocabulary: ರಾಶಿ, ಗ್ರಹ, ನಕ್ಷತ್ರ)",
    "mai": "Maithili (Devanagari, natural Maithili register — NOT Hindi; use Maithili grammar/inflection like अछि, छी, करैत; canonical Jyotish vocabulary: राशि, ग्रह, नक्षत्र)",
    "mr": "Marathi (Devanagari, natural Marathi register — NOT Hindi; canonical Jyotish vocabulary: राशी, ग्रह, नक्षत्र)",
}


def walk_leaves(obj, prefix=""):
    """Yield (path, locale_dict) for each locale-value leaf object."""
    if not isinstance(obj, dict):
        return
    if "en" in obj and all(isinstance(v, str) for v in obj.values()):
        yield prefix, obj
        return
    for k, v in obj.items():
        yield from walk_leaves(v, f"{prefix}.{k}" if prefix else k)


def get_access_token() -> str:
    return subprocess.check_output(
        ["gcloud", "auth", "print-access-token"], text=True
    ).strip()


def build_payload() -> dict[str, dict[str, str]]:
    """Returns {file_relative_path: {flat_key: en_value, ...}} +
    parallel {file_relative_path: {flat_key: hi_value, ...}}."""
    en_payload = {}
    hi_payload = {}
    for fp in FILES:
        rel = fp.relative_to(ROOT).as_posix()
        en_payload[rel] = {}
        hi_payload[rel] = {}
        data = json.loads(fp.read_text())
        for path, leaf in walk_leaves(data):
            en_payload[rel][path] = leaf["en"]
            hi_payload[rel][path] = leaf.get("hi", "")
    return en_payload, hi_payload


def gemini_translate(token: str, locale: str, locale_desc: str,
                     en_payload: dict, hi_payload: dict) -> dict[str, dict[str, str]]:
    prompt = (
        f"You are translating Vedic-astrology UI copy from English to {locale_desc}.\n\n"
        f"The Hindi translations are provided as REFERENCE for register and "
        f"terminology — match the formality level and astrological vocabulary "
        f"choices Hindi made, transposed into the target language's script and "
        f"natural idiom. Do NOT copy Hindi text directly into a non-Devanagari "
        f"script.\n\n"
        f"Rules:\n"
        f"1. Output ONLY a JSON object (no markdown fences, no commentary).\n"
        f"2. Output keys must EXACTLY match the input file-paths and inner keys.\n"
        f"3. Preserve any embedded HTML tags (<strong>, <br>, etc.) verbatim.\n"
        f"4. Preserve any {{placeholder}} interpolations exactly.\n"
        f"5. Preserve newline characters (\\n) at the same positions.\n"
        f"6. Sanskrit-rooted astrology terms (yoga, dasha, lagna, rashi, nakshatra, "
        f"graha, etc.) should be transliterated to the target script using the "
        f"established Jyotish vocabulary, not given English Anglicized spelling.\n"
        f"7. Keep proper-noun planet names canonical (Surya/Sun, Chandra/Moon, Mangal/Mars, "
        f"Budh/Mercury, Guru/Jupiter, Shukra/Venus, Shani/Saturn, Rahu, Ketu).\n\n"
        f"ENGLISH SOURCE (group by file):\n"
        + json.dumps(en_payload, ensure_ascii=False, indent=2)
        + f"\n\nHINDI REFERENCE (same keys; match this register):\n"
        + json.dumps(hi_payload, ensure_ascii=False, indent=2)
        + f"\n\nReturn the {locale} translations in the same nested file→key structure as the ENGLISH SOURCE."
    )
    body = {
        "contents": [{"role": "user", "parts": [{"text": prompt}]}],
        "generationConfig": {
            "responseMimeType": "application/json",
            "temperature": 0.3,
            "maxOutputTokens": 65535,
        },
    }
    proc = subprocess.run(
        [
            "curl", "-s", "-f", "-X", "POST",
            "--retry", "3", "--retry-all-errors", "--retry-delay", "5",
            "--max-time", "600",
            "-H", f"Authorization: Bearer {token}",
            "-H", "Content-Type: application/json",
            ENDPOINT,
            "-d", json.dumps(body, ensure_ascii=False),
        ],
        capture_output=True, text=True, check=True,
    )
    raw = json.loads(proc.stdout)
    if "candidates" not in raw:
        print(f"Gemini error ({locale}):", json.dumps(raw)[:800], file=sys.stderr)
        raise RuntimeError(f"Gemini call failed for {locale}")
    text = raw["candidates"][0]["content"]["parts"][0]["text"]
    try:
        return json.loads(text)
    except json.JSONDecodeError:
        text = re.sub(r"^```(?:json)?\n?|\n?```$", "", text.strip(), flags=re.MULTILINE)
        return json.loads(text)


def apply_translations(translations_by_locale: dict[str, dict[str, dict[str, str]]]) -> dict[str, int]:
    """Mutate the JSON files in place, returning {locale: count_applied}."""
    counts = {L: 0 for L in LOCALES}
    for fp in FILES:
        rel = fp.relative_to(ROOT).as_posix()
        data = json.loads(fp.read_text())
        for path, leaf in walk_leaves(data):
            en = leaf["en"]
            for L in LOCALES:
                t = translations_by_locale.get(L, {}).get(rel, {}).get(path)
                if not t:
                    continue
                # Only overwrite shadows or missing values.
                if leaf.get(L) == en or not leaf.get(L):
                    leaf[L] = t
                    counts[L] += 1
        # Save the file
        fp.write_text(json.dumps(data, ensure_ascii=False, indent=2) + "\n")
    return counts


def main():
    print("Resolving en + hi payloads from both files...")
    en_payload, hi_payload = build_payload()
    total_keys = sum(len(v) for v in en_payload.values())
    print(f"  {total_keys} keys total across {len(FILES)} files")

    print("Fetching gcloud access token...")
    token = get_access_token()

    translations_by_locale = {}
    for locale, desc in LOCALES.items():
        print(f"\n→ Translating to {locale}...")
        try:
            t = gemini_translate(token, locale, desc, en_payload, hi_payload)
            translations_by_locale[locale] = t
            received = sum(len(v) for v in t.values()) if isinstance(t, dict) else 0
            print(f"  ✓ received {received} keys")
        except Exception as e:
            print(f"  ✗ FAILED: {e}", file=sys.stderr)
            sys.exit(1)

    print("\nApplying translations to JSON files...")
    counts = apply_translations(translations_by_locale)
    for L, n in counts.items():
        print(f"  {L}: applied {n} translations")
    total_applied = sum(counts.values())
    print(f"\nTotal: {total_applied} strings written")


if __name__ == "__main__":
    main()
