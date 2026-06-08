#!/usr/bin/env python3
"""
Translate components/panchang/BestWindowsCard chrome (~28 keys) to
the 6 missing locales (mai/mr/ta/te/kn/gu/bn) via Gemini 2.5 Flash
on Vertex AI.

Output: src/lib/constants/best-windows-card-labels-overlay.json
"""
import json
import re
import subprocess
import sys
import time
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
OUT_PATH = ROOT / "src/lib/constants/best-windows-card-labels-overlay.json"
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
    "ta":  "Tamil (Tamil script, canonical Vedic vocabulary: தாரா/நட்சத்திரம்/லக்னம்)",
    "te":  "Telugu (Telugu script, canonical Vedic vocabulary: తార/నక్షత్రం/లగ్నం)",
    "kn":  "Kannada (Kannada script, canonical Vedic vocabulary: ತಾರ/ನಕ್ಷತ್ರ/ಲಗ್ನ)",
    "gu":  "Gujarati (Gujarati script, canonical Vedic vocabulary: તારા/નક્ષત્ર/લગ્ન)",
    "bn":  "Bengali (Bengali script, canonical Vedic vocabulary: তারা/নক্ষত্র/লগ্ন)",
}

SOURCE_LABELS: dict[str, str] = {
    "bestWindowsToday": "Best Windows Today",
    "bestWindowsForDateTemplate": "Best Windows for {DATE}",
    "noVerdictData": "No verdict data available.",
    "myChart": "My Chart",
    "addBirthDataToPersonalise": "Sign in with birth data to personalise",
    "taraLabel": "Tara",
    "birthStarDay": "birth star day",
    "birthStarDayMixed": "birth star day — mixed",
    "fullStrength": "Full strength",
    "moderateStrength": "Moderate strength",
    "reducedStrength": "Reduced strength",
    "moderate": "moderate",
    "reduced": "reduced",
    "favourable": "favourable",
    "exerciseCaution": "exercise caution",
    "considerPostponing": "consider postponing",
    "excellent": "Excellent",
    "good": "Good",
    "caution": "Caution",
    "avoid": "Avoid",
    "all": "All",
    "personal": "Personal",
    "personalPlus": "Personal +",
    "personalMinus": "Personal −",
    "more": "More",
    "netResult": "Net Result",
    "nextFavourable": "Next favourable:",
    "nextShort": "next:",
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
        f"- Keep `{{DATE}}` placeholder EXACTLY as-is.\n"
        f"- Keep em-dashes ` — ` and the math symbols `+` `−` EXACTLY as-is.\n"
        f"- Short chip labels (Personal+, Personal−, Good, Caution, Avoid, etc.) — keep concise.\n"
        f"- Sanskrit Jyotish terms (Tara/Nakshatra/Lagna) → locale-canonical form.\n"
        f"- `favourable` (UK spelling) and `caution` — note that BOTH 'Caution' (title-case chip) and 'exercise caution' (lowercase inline) exist with different keys; keep them as different translations if natural in the target language (e.g. Hindi shares 'सावधान' for both).\n\n"
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
