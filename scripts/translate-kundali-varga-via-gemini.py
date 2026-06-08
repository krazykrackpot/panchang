#!/usr/bin/env python3
"""
Translate components/kundali/VargaAnalysisTab chrome strings (13 keys)
to the 6 missing locales (mai/mr/ta/te/kn/gu/bn) via Gemini 2.5 Flash
on Vertex AI.

Output: src/lib/constants/kundali-varga-labels-overlay.json
"""
import json
import re
import subprocess
import sys
import time
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
OUT_PATH = ROOT / "src/lib/constants/kundali-varga-labels-overlay.json"
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
    "ta":  "Tamil (Tamil script, canonical Vedic vocabulary: வர்க்கம்/அமிசம்/லக்னம்/ராசி)",
    "te":  "Telugu (Telugu script, canonical Vedic vocabulary: వర్గం/అంశం/లగ్నం/రాశి)",
    "kn":  "Kannada (Kannada script, canonical Vedic vocabulary: ವರ್ಗ/ಅಂಶ/ಲಗ್ನ/ರಾಶಿ)",
    "gu":  "Gujarati (Gujarati script, canonical Vedic vocabulary: વર્ગ/અંશ/લગ્ન/રાશિ)",
    "bn":  "Bengali (Bengali script, canonical Vedic vocabulary: বর্গ/অংশ/লগ্ন/রাশি)",
}

SOURCE_LABELS: dict[str, str] = {
    "promiseVsDelivery": "Promise vs Delivery",
    "d1Promise": "D1 Promise",
    "deliverySuffix": "Delivery",
    "dignityShiftsTemplate": "D1 → {CHART} Dignity Shifts",
    "yogasInChartTemplate": "Yogas in {CHART}",
    "dispositorChain": "Dispositor Chain",
    "lifeAreaVerdicts": "Life Area Verdicts",
    "overallSynthesis": "Overall Synthesis",
    "vargaRemedialGuidance": "Varga-Based Remedial Guidance",
    "weakPlacementsSubtitle": "Specific remedies for weak varga placements",
    "debilitatedIn": "debilitated in",
    "recommendedRemedies": "Recommended Remedies",
    "selfAssessmentQuestions": "Self-Assessment Questions",
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
        f"- Keep `{{CHART}}` placeholder EXACTLY as-is — it's a chart-id like D1/D9/D10.\n"
        f"- Keep the arrow `→` EXACTLY as-is.\n"
        f"- D1, D9, D10 etc are divisional-chart names — keep the Latin D-prefix (these are universal divisional-chart shorthands in modern Vedic astrology UI).\n"
        f"- Sanskrit Jyotish terms (Varga/Dignity/Dispositor/Yoga/Promise/Remedy) → locale-canonical form.\n"
        f"- `debilitatedIn` is two words joined with a comma — render as the locale's natural way of saying 'debilitated in [chart]', for example Hindi: 'नीच, में' (Devanagari) or Tamil: 'நீசம் இல்' (Tamil).\n\n"
        f"Input:\n"
        + json.dumps(SOURCE_LABELS, ensure_ascii=False, indent=2)
    )
    body = {
        "contents": [{"role": "user", "parts": [{"text": prompt}]}],
        "generationConfig": {
            "responseMimeType": "application/json",
            "temperature": 0.3,
            "maxOutputTokens": 8192,
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
