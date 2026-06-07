#!/usr/bin/env python3
"""
Translate the /gauri-panchang Client.tsx LABELS long-form paragraphs
to 6 missing locales (mai/mr/te/kn/gu/bn). The hub LABELS dict
currently ships en/ta/hi only; this script generates the rest via
Gemini 2.5 Flash on Vertex AI.

Output: src/lib/constants/gauri-labels-overlay.json — keyed by locale
then by label key. Hand-pasted into Client.tsx LABELS dict (the dict
is small enough that an inline literal beats a runtime overlay
merger — only 13 keys × 6 locales = 78 strings, single source of
truth still works).
"""
import json
import re
import subprocess
import sys
import time
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
SOURCE = ROOT / "src/app/[locale]/gauri-panchang/Client.tsx"
OUT_PATH = ROOT / "src/lib/constants/gauri-labels-overlay.json"
PROJECT = "dekhopanchang"
MODEL = "gemini-2.5-flash"
ENDPOINT = (
    f"https://us-central1-aiplatform.googleapis.com/v1/projects/"
    f"{PROJECT}/locations/us-central1/publishers/google/models/"
    f"{MODEL}:generateContent"
)

LOCALES = {
    "mai": "Maithili (Devanagari, natural Maithili register, retain Sanskrit Jyotish terms in Devanagari)",
    "mr":  "Marathi (Devanagari, natural Marathi register, retain Sanskrit Jyotish terms in Devanagari)",
    "te":  "Telugu (Telugu script, natural Telugu register, canonical Telugu Jyotish: ಗౌరి/ಶుభ/ಅಶುಭ)",
    "kn":  "Kannada (Kannada script, natural Kannada register, canonical Kannada Jyotish: ಗೌರಿ/ಶುಭ/ಅಶುಭ)",
    "gu":  "Gujarati (Gujarati script, natural Gujarati register, canonical Gujarati Jyotish: ગૌરી/શુભ/અશુભ)",
    "bn":  "Bengali (Bengali script, natural Bengali register, canonical Bengali Jyotish: গৌরী/শুভ/অশুভ)",
}


def get_access_token() -> str:
    return subprocess.check_output(
        ["gcloud", "auth", "print-access-token"], text=True
    ).strip()


# Source strings (English) for the 13 LABEL keys.
SOURCE_LABELS: dict[str, str] = {
    "back": "Panchang",
    "title": "Gauri Panchang Today",
    "dayGauri": "Day Gauri Panchang",
    "nightGauri": "Night Gauri Panchang",
    "auspicious": "Auspicious",
    "inauspicious": "Inauspicious",
    "whatIs": "What is Gauri Panchang?",
    "whatIsText": (
        "Gauri Panchang (also called Gowri Panchangam or Gauri Nalla Neram) "
        "is the South-Indian counterpart of Choghadiya — a Vedic time-division "
        "system that splits each day and night into 8 equal periods. Five "
        "periods are auspicious (Amritha, Siddha, Laabha, Dhanam, Sugam) and "
        "three are inauspicious (Marana, Rogam, Sokam). It is widely used "
        "across Tamil Nadu, Karnataka, Andhra Pradesh, Telangana, and Kerala "
        "to choose auspicious times for new ventures, travel, business, and "
        "ceremonies."
    ),
    "typesTitle": "The 8 Gauri Periods Explained",
    "types": (
        "Amritha|Nectar — the most auspicious period, ideal for all new "
        "ventures and important beginnings|Siddha|Achievement — excellent "
        "for finishing important work, signing agreements, exams|Laabha|"
        "Gain — best for business transactions, trade, financial decisions|"
        "Dhanam|Wealth — auspicious for investments, purchases, banking "
        "activities|Sugam|Comfort — gentle and supportive period, good for "
        "travel and social events|Marana|Death — strongly inauspicious; "
        "avoid medical procedures, surgeries, journeys|Rogam|Disease — "
        "avoid health-related decisions, new diets, or stressful activities|"
        "Sokam|Sorrow — avoid arguments, contract signings, emotional "
        "commitments"
    ),
    "bestTitle": "Best Gauri Period for Each Activity",
    "bestText": (
        "For starting a new venture or moving into a new home, Amritha is "
        "universally considered the most powerful. Business and financial "
        "activities are best timed during Laabha (gain) or Dhanam (wealth). "
        "For travel and family gatherings, Sugam (comfort) is preferred. "
        "For finishing exams, certifications, or signing important agreements, "
        "Siddha (achievement) brings the strongest support. Avoid Marana, "
        "Rogam, and Sokam for any auspicious work — these periods are best "
        "reserved for rest, routine maintenance, or activities you wish to "
        "conclude rather than begin."
    ),
    "seeAlso": "See Also",
}


def gemini_translate(token: str, locale: str, locale_desc: str) -> dict[str, str]:
    prompt = (
        f"Translate the following English UI labels and Vedic-astrology copy "
        f"to {locale_desc}.\n\n"
        f"Rules:\n"
        f"- Output ONLY a JSON object, no markdown fences, no commentary.\n"
        f"- Keys must be identical to the input.\n"
        f"- Keep the `|` (pipe) separator EXACTLY where it appears in the "
        f"input — that's a UI delimiter, not punctuation.\n"
        f"- Keep the em-dash spacing ` — ` exactly.\n"
        f"- The 8 Gauri period names (Amritha/Siddha/Marana/Rogam/Laabha/"
        f"Dhanam/Sugam/Sokam) are tatsama Sanskrit terms — translate to the "
        f"locale's canonical Vedic-astrology form (e.g. mai/mr: अमृत/सिद्ध/"
        f"मरण/रोग/लाभ/धन/सुगम/शोक; gu: અમૃત/સિદ્ધ/મરણ/રોગ/લાભ/ધન/સુગમ/શોક; "
        f"bn: অমৃত/সিদ্ধ/মরণ/রোগ/লাভ/ধন/সুগম/শোক; te: అమృత/సిద్ధ/మరణ/రోగ/లాభ/"
        f"ధన/సుగమ/శోక; kn: ಅಮೃತ/ಸಿದ್ಧ/ಮರಣ/ರೋಗ/ಲಾಭ/ಧನ/ಸುಗಮ/ಶೋಕ).\n"
        f"- Keep proper-noun region names (Tamil Nadu, Karnataka, Andhra "
        f"Pradesh, Telangana, Kerala) in their locale-native form.\n\n"
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
            "curl",
            "-s",
            "-f",
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
        print(f"Gemini error ({locale}):", json.dumps(raw)[:500], file=sys.stderr)
        raise RuntimeError(f"Gemini call failed for {locale}")
    text = raw["candidates"][0]["content"]["parts"][0]["text"]
    try:
        parsed = json.loads(text)
    except json.JSONDecodeError:
        text = re.sub(
            r"^```(?:json)?\n?|\n?```$", "", text.strip(), flags=re.MULTILINE
        )
        parsed = json.loads(text)
    return parsed


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
        OUT_PATH.write_text(
            json.dumps(out, ensure_ascii=False, indent=2) + "\n"
        )


if __name__ == "__main__":
    main()
