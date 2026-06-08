#!/usr/bin/env python3
"""
Translate the per-page LABELS body prose on the 5 regional calendar
pages (telugu/tamil/bengali/odia/mithila) — fills the gaps in each
existing inline LABELS dict for the missing locales.

Reads /tmp/regional_prose_jobs.json (produced by
/tmp/regional_prose_extract.py) and writes
/tmp/regional_prose_translations.json with the same shape but with
{en, missing} → {locale: text} for each missing locale.
"""
import json
import re
import subprocess
import sys
import time
from pathlib import Path

PROJECT = "dekhopanchang"
MODEL = "gemini-2.5-flash"
ENDPOINT = (
    f"https://us-central1-aiplatform.googleapis.com/v1/projects/"
    f"{PROJECT}/locations/us-central1/publishers/google/models/"
    f"{MODEL}:generateContent"
)

LOCALE_DESC = {
    "mai": "Maithili (Devanagari, natural Maithili register, distinct from Hindi: अछि/मे/सँ/क/ओ)",
    "mr":  "Marathi (Devanagari, natural Marathi register, distinct from Hindi: आहे/मध्ये/चे/ची)",
    "ta":  "Tamil (Tamil script, canonical Vedic vocabulary)",
    "te":  "Telugu (Telugu script, canonical Vedic vocabulary)",
    "kn":  "Kannada (Kannada script, canonical Vedic vocabulary)",
    "gu":  "Gujarati (Gujarati script, canonical Vedic vocabulary)",
    "bn":  "Bengali (Bengali script, canonical Vedic vocabulary)",
}


def get_access_token() -> str:
    return subprocess.check_output(
        ["gcloud", "auth", "print-access-token"], text=True
    ).strip()


def gemini_translate_batch(token: str, locale: str, source: dict) -> dict:
    """Translate a {key: en_text} dict to one locale, return {key: text}."""
    locale_desc = LOCALE_DESC[locale]
    prompt = (
        f"Translate the following English Vedic-astrology UI copy to {locale_desc}.\n\n"
        "Rules:\n"
        "- Output ONLY a JSON object, no markdown fences, no commentary.\n"
        "- Keys must be identical to the input.\n"
        "- Long-form prose: respect the locale's natural grammar.\n"
        "- Sanskrit Jyotish terms (Tithi/Nakshatra/Yoga/Muhurat/Panchang/Rashi etc.)"
        " → locale-canonical form.\n"
        "- Maithili (mai) MUST use distinct Maithili grammar (अछि/मे/सँ).\n"
        "- Marathi (mr) MUST use distinct Marathi grammar (आहे/मध्ये/चे).\n"
        "- Region-specific proper nouns (Puthandu, Pongal, Durga Puja, Rath Yatra,"
        " Madhubani, Ugadi, Chhath, Vishu, Mahabali, etc.) keep canonical form"
        " in target script.\n\n"
        "Input:\n"
        + json.dumps(source, ensure_ascii=False, indent=2)
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
        print(f"Gemini error ({locale}):", json.dumps(raw)[:500], file=sys.stderr)
        raise RuntimeError(f"Gemini call failed for {locale}")
    text = raw["candidates"][0]["content"]["parts"][0]["text"]
    try:
        return json.loads(text)
    except json.JSONDecodeError:
        text = re.sub(r"^```(?:json)?\n?|\n?```$", "", text.strip(), flags=re.MULTILINE)
        return json.loads(text)


def main() -> None:
    token = get_access_token()
    jobs = json.loads(Path("/tmp/regional_prose_jobs.json").read_text())

    out_path = Path("/tmp/regional_prose_translations.json")
    out = {}
    if out_path.exists():
        try:
            out = json.loads(out_path.read_text())
        except Exception:
            out = {}

    for region, region_jobs in jobs.items():
        if region not in out:
            out[region] = {}

        # Collect (locale -> {key: en_text}) batches
        per_locale = {}
        for key, info in region_jobs.items():
            for locale in info["missing"]:
                per_locale.setdefault(locale, {})[key] = info["en"]

        for locale, source in per_locale.items():
            # Skip if already translated for this region+locale (full coverage)
            existing = out[region].get(locale, {})
            todo = {k: v for k, v in source.items() if k not in existing}
            if not todo:
                print(f"  skip {region}/{locale}: complete")
                continue
            print(f"Translating {region}/{locale} — {len(todo)} keys...")
            t0 = time.time()
            translated = gemini_translate_batch(token, locale, todo)
            elapsed = time.time() - t0
            out[region].setdefault(locale, {}).update(translated)
            print(f"  done ({elapsed:.1f}s)")
            out_path.write_text(json.dumps(out, ensure_ascii=False, indent=2) + "\n")


if __name__ == "__main__":
    main()
