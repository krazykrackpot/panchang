#!/usr/bin/env python3
"""
Translate /choghadiya Client.tsx LABELS long-form paragraphs for the
6 missing locales (mai/mr/te/kn/gu/bn) via Gemini 2.5 Flash on Vertex AI.

Source: en/hi/sa already in Client.tsx. 13 keys × 6 locales = 78
translations. Output JSON is hand-pasted into the existing LABELS dict.
"""
import json
import re
import subprocess
import sys
import time
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
OUT_PATH = ROOT / "src/lib/constants/choghadiya-labels-overlay.json"
PROJECT = "dekhopanchang"
MODEL = "gemini-2.5-flash"
ENDPOINT = (
    f"https://us-central1-aiplatform.googleapis.com/v1/projects/"
    f"{PROJECT}/locations/us-central1/publishers/google/models/"
    f"{MODEL}:generateContent"
)

LOCALES = {
    "mai": "Maithili (Devanagari, natural Maithili register, retain Sanskrit Jyotish terms like चौघड़िया/घटी/मुहूर्त in Devanagari)",
    "mr":  "Marathi (Devanagari, natural Marathi register; use चोघडिया for the period name as that's the standard Marathi spelling)",
    "te":  "Telugu (Telugu script, natural Telugu register, canonical Telugu Jyotish: చోఘడియా/శుభ/అశుభ)",
    "kn":  "Kannada (Kannada script, natural Kannada register, canonical Kannada Jyotish: ಚೋಘಡಿಯಾ/ಶುಭ/ಅಶುಭ)",
    "gu":  "Gujarati (Gujarati script, natural Gujarati register, canonical Gujarati Jyotish: ચોઘડિયા/શુભ/અશુભ)",
    "bn":  "Bengali (Bengali script, natural Bengali register, canonical Bengali Jyotish: চোগাড়িয়া/শুভ/অশুভ)",
}

SOURCE_LABELS: dict[str, str] = {
    "back": "Panchang",
    "title": "Choghadiya Today",
    "dayChoghadiya": "Day Choghadiya",
    "nightChoghadiya": "Night Choghadiya",
    "auspicious": "Auspicious",
    "inauspicious": "Inauspicious",
    "neutral": "Neutral",
    "whatIs": "What is Choghadiya?",
    "whatIsText": "Choghadiya (also written Chaughadia) is a traditional Vedic time-division system used to find auspicious and inauspicious time slots throughout the day and night. The word literally means \"four ghatis\" — each Choghadiya period spans approximately 4 ghatis (about 96 minutes). There are 8 day slots (sunrise to sunset) and 8 night slots (sunset to next sunrise), giving 16 periods in total.",
    "typesTitle": "7 Types of Choghadiya Explained",
    "types": "Amrit|Most auspicious — ideal for all good works, especially starting new ventures|Shubh|Auspicious — good for marriage, religious ceremonies, and important decisions|Labh|Auspicious — excellent for business, trade, and financial transactions|Char|Neutral — suitable for travel and movement, but not for starting permanent works|Rog|Inauspicious — associated with illness; avoid medical procedures and new health regimens|Kaal|Inauspicious — ruled by Saturn; avoid important beginnings, especially financial|Udveg|Inauspicious — associated with anxiety; avoid travel, meetings with officials",
    "bestTitle": "Best Choghadiya for Travel & Business",
    "bestText": "For travel, the Char Choghadiya is traditionally recommended as its mobile nature supports journeys. For business and financial activities, Labh (gain) and Shubh (auspicious) are preferred. The Amrit Choghadiya is considered universally auspicious for all activities. Avoid starting any important work during Rog, Kaal, or Udveg periods.",
    "seeAlso": "See Also",
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
        f"- Keep the `|` (pipe) separator EXACTLY where it appears in the input — it's a UI delimiter, not punctuation.\n"
        f"- Keep the em-dash spacing ` — ` consistent with the source.\n"
        f"- The 7 Choghadiya period names (Amrit/Shubh/Labh/Char/Rog/Kaal/Udveg) are tatsama Sanskrit — translate to canonical Vedic form in the target script (e.g. mai/mr: अमृत/शुभ/लाभ/चर/रोग/काल/उद्वेग; gu: અમૃત/શુભ/લાભ/ચર/રોગ/કાળ/ઉદ્વેગ; bn: অমৃত/শুভ/লাভ/চর/রোগ/কাল/উদ্বেগ; te: అమృత/శుభ/లాభ/చర/రోగ/కాల/ఉద్వేగ; kn: ಅಮೃತ/ಶುಭ/ಲಾಭ/ಚರ/ರೋಗ/ಕಾಲ/ಉದ್ವೇಗ).\n\n"
        f"Input:\n"
        + json.dumps(SOURCE_LABELS, ensure_ascii=False, indent=2)
    )
    body = {
        "contents": [{"role": "user", "parts": [{"text": prompt}]}],
        "generationConfig": {
            "responseMimeType": "application/json",
            "temperature": 0.3,
            "maxOutputTokens": 32768,
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
