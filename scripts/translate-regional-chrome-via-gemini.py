#!/usr/bin/env python3
"""
Translate the shared chrome strings (column headers + related-calendars
heading + 9 region-to-region link labels) used by every /calendar/
regional/<slug> page to the 6 missing locales (mai/mr/ta/te/kn/gu/bn)
via Gemini 2.5 Flash on Vertex AI.

Output: src/lib/constants/regional-chrome-labels-overlay.json
"""
import json
import re
import subprocess
import sys
import time
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
OUT_PATH = ROOT / "src/lib/constants/regional-chrome-labels-overlay.json"
PROJECT = "dekhopanchang"
MODEL = "gemini-2.5-flash"
ENDPOINT = (
    f"https://us-central1-aiplatform.googleapis.com/v1/projects/"
    f"{PROJECT}/locations/us-central1/publishers/google/models/"
    f"{MODEL}:generateContent"
)

LOCALES = {
    "mai": "Maithili (Devanagari, natural Maithili register)",
    "mr":  "Marathi (Devanagari, natural Marathi register)",
    "ta":  "Tamil (Tamil script, canonical Vedic vocabulary)",
    "te":  "Telugu (Telugu script, canonical Vedic vocabulary)",
    "kn":  "Kannada (Kannada script, canonical Vedic vocabulary)",
    "gu":  "Gujarati (Gujarati script, canonical Vedic vocabulary)",
    "bn":  "Bengali (Bengali script, canonical Vedic vocabulary)",
}

SOURCE_LABELS: dict[str, str] = {
    "colMonth": "Month",
    "colRashi": "Rashi (Zodiac)",
    "colGregorian": "Gregorian",
    "relatedHeading": "Related Regional Calendars",
    "linkTamil": "Tamil Calendar (Panchangam)",
    "linkTelugu": "Telugu Calendar (Panchangam)",
    "linkKannada": "Kannada Calendar (Panchangam)",
    "linkMalayalam": "Malayalam Calendar (Kollavarsham)",
    "linkBengali": "Bengali Calendar (Bangabda)",
    "linkGujarati": "Gujarati Calendar (Vikram Samvat)",
    "linkOdia": "Odia Calendar (Panji)",
    "linkMithila": "Mithila Panchang (Maithili Tirhuta)",
    "linkFestivalCalendar": "Festival Calendar 2026",
}


def get_access_token() -> str:
    return subprocess.check_output(
        ["gcloud", "auth", "print-access-token"], text=True
    ).strip()


def gemini_translate(token: str, locale: str, locale_desc: str) -> dict[str, str]:
    prompt = (
        f"Translate the following English Vedic-astrology UI copy to {locale_desc}.\n\n"
        f"Rules:\n"
        f"- Output ONLY a JSON object, no markdown fences, no commentary.\n"
        f"- Keys must be identical to the input.\n"
        f"- Region/calendar proper names (Tamil/Telugu/Kannada/Malayalam/Bengali/Gujarati/Odia/Mithila/Maithili/Tirhuta/Panchangam/Kollavarsham/Bangabda/Vikram Samvat/Panji) → locale-canonical form in the target script.\n"
        f"- Maithili (mai) MUST use distinct Maithili grammar/forms.\n"
        f"- Marathi (mr) MUST use distinct Marathi grammar/forms.\n\n"
        f"Input:\n"
        + json.dumps(SOURCE_LABELS, ensure_ascii=False, indent=2)
    )
    body = {
        "contents": [{"role": "user", "parts": [{"text": prompt}]}],
        "generationConfig": {
            "responseMimeType": "application/json",
            "temperature": 0.3,
            "maxOutputTokens": 16384,
        },
    }
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
    out: dict[str, dict[str, str]] = {}
    if OUT_PATH.exists():
        existing = json.loads(OUT_PATH.read_text())
        out = existing if isinstance(existing, dict) else {}
    for locale, locale_desc in LOCALES.items():
        if locale in out and len(out[locale]) >= len(SOURCE_LABELS):
            print(f"  skip {locale}: complete")
            continue
        print(f"Translating {locale}...")
        t0 = time.time()
        out[locale] = gemini_translate(token, locale, locale_desc)
        elapsed = time.time() - t0
        total = sum(len(v) for v in out[locale].values())
        print(f"  wrote {locale}: {len(out[locale])} keys ({elapsed:.1f}s, {total} chars)")
        OUT_PATH.write_text(json.dumps(out, ensure_ascii=False, indent=2) + "\n")


if __name__ == "__main__":
    main()
