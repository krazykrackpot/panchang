#!/usr/bin/env python3
"""
Translate components/kundali/SummaryView chrome strings (~35 keys)
to the 6 missing locales (mai/mr/ta/te/kn/gu/bn) via Gemini 2.5 Flash
on Vertex AI.

Output: src/lib/constants/kundali-summary-labels-overlay.json
"""
import json
import re
import subprocess
import sys
import time
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
OUT_PATH = ROOT / "src/lib/constants/kundali-summary-labels-overlay.json"
PROJECT = "dekhopanchang"
MODEL = "gemini-2.5-flash"
ENDPOINT = (
    f"https://us-central1-aiplatform.googleapis.com/v1/projects/"
    f"{PROJECT}/locations/us-central1/publishers/google/models/"
    f"{MODEL}:generateContent"
)

LOCALES = {
    "mai": "Maithili (Devanagari, natural Maithili register, distinct from Hindi: अछि not है)",
    "mr":  "Marathi (Devanagari, natural Marathi register, distinct from Hindi)",
    "ta":  "Tamil (Tamil script, canonical Vedic vocabulary: ஜாதகம்/லக்னம்/ராசி/நட்சத்திரம்/தசை/யோகம்/தோஷம்)",
    "te":  "Telugu (Telugu script, canonical Vedic vocabulary: జాతకం/లగ్నం/రాశి/నక్షత్రం/దశ/యోగం/దోషం)",
    "kn":  "Kannada (Kannada script, canonical Vedic vocabulary: ಜಾತಕ/ಲಗ್ನ/ರಾಶಿ/ನಕ್ಷತ್ರ/ದಶೆ/ಯೋಗ/ದೋಷ)",
    "gu":  "Gujarati (Gujarati script, canonical Vedic vocabulary: કુંડળી/લગ્ન/રાશિ/નક્ષત્ર/દશા/યોગ/દોષ)",
    "bn":  "Bengali (Bengali script, canonical Vedic vocabulary: কুণ্ডলী/লগ্ন/রাশি/নক্ষত্র/দশা/যোগ/দোষ)",
}

SOURCE_LABELS: dict[str, str] = {
    "vitalityStrong": "Strong",
    "vitalityBalanced": "Balanced",
    "vitalityChallenging": "Challenging",
    "vitalityLabel": "Chart Vitality",
    "houseMeanings": "House Meanings",
    "toggleOn": "ON",
    "toggleOff": "OFF",
    "chartTitle": "Birth Chart",
    "viewTechAnalysis": "View Technical Analysis  –  Charts, Planets, Houses, Ashtakavarga",
    "techAnalysisHeading": "Advanced Technical Chart Analysis",
    "lagnaLabel": "Lagna",
    "moonLabel": "Moon",
    "dashaLabel": "Dasha",
    "ageLabel": "Age",
    "strongestLabel": "Strongest",
    "phaseSuffix": "Phase",
    "ageTemplate": "Age {AGE}",
    "whoYouAre": "Who You Are",
    "whatMeansNow": "What This Means for You Now",
    "yourPlanetaryStrengths": "Your Planetary Strengths",
    "seePlanetByPlanet": "See detailed planet-by-planet analysis",
    "whatChartCarries": "What Your Chart Carries",
    "yogasHeadingTemplate": "Yogas ({COUNT} active)",
    "doshasHeading": "Doshas",
    "showLess": "Show less",
    "seeAllYogasTemplate": "See all {COUNT} yogas",
    "seeAllDoshas": "See all doshas",
    "yourLifeDomains": "Your Life Domains",
    "domainsConnect": "How Your Domains Connect",
    "personalMonth": "Your Personal Month",
    "whereYouAreNow": "Where You Are Now",
    "whatYouCanDo": "What You Can Do",
    "yourKeyTakeaways": "Your 3 Key Takeaways",
    "relevantNow": "Relevant now",
    "cancellationConditions": "Cancellation conditions:",
    "printBtn": "Print",
    "copyLink": "Share Link",
    "copied": "Copied!",
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
        f"- Keep `{{AGE}}` and `{{COUNT}}` placeholders EXACTLY as-is.\n"
        f"- Keep the em-dash ` – ` consistent with the source.\n"
        f"- Sanskrit Jyotish terms (Lagna/Moon/Dasha/Ashtakavarga/Charts/Yoga/Dosha/etc.) → locale-canonical form.\n"
        f"- Short toggle labels (ON/OFF) — use 2-3 character locale equivalents.\n\n"
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
