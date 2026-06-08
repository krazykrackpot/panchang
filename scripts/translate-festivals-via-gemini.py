#!/usr/bin/env python3
"""
Translate /festivals/[slug]/[year] + /[city] chrome (~45 keys) to the
6 missing locales (mai/mr/ta/te/kn/gu/bn) via Gemini 2.5 Flash on
Vertex AI.

Output: src/lib/constants/festivals-labels-overlay.json
"""
import json
import re
import subprocess
import sys
import time
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
OUT_PATH = ROOT / "src/lib/constants/festivals-labels-overlay.json"
PROJECT = "dekhopanchang"
MODEL = "gemini-2.5-flash"
ENDPOINT = (
    f"https://us-central1-aiplatform.googleapis.com/v1/projects/"
    f"{PROJECT}/locations/us-central1/publishers/google/models/"
    f"{MODEL}:generateContent"
)

LOCALES = {
    "mai": "Maithili (Devanagari, natural Maithili register, distinct from Hindi: अछि/मे/सँ)",
    "mr":  "Marathi (Devanagari, natural Marathi register, distinct from Hindi: आहे/मध्ये/चे)",
    "ta":  "Tamil (Tamil script, canonical Vedic vocabulary: திதி/நட்சத்திரம்/பூஜை/முகூர்த்தம்/பஞ்சாங்கம்/விரதம்/சம்வத்/சக)",
    "te":  "Telugu (Telugu script, canonical Vedic vocabulary: తిథి/నక్షత్రం/పూజ/ముహూర్తం/పంచాంగం/వ్రతం/సంవత్/శక)",
    "kn":  "Kannada (Kannada script, canonical Vedic vocabulary: ತಿಥಿ/ನಕ್ಷತ್ರ/ಪೂಜೆ/ಮುಹೂರ್ತ/ಪಂಚಾಂಗ/ವ್ರತ/ಸಂವತ್/ಶಕ)",
    "gu":  "Gujarati (Gujarati script, canonical Vedic vocabulary: તિથિ/નક્ષત્ર/પૂજા/મુહૂર્ત/પંચાંગ/વ્રત/સંવત/શક)",
    "bn":  "Bengali (Bengali script, canonical Vedic vocabulary: তিথি/নক্ষত্র/পূজা/মুহূর্ত/পঞ্জিকা/ব্রত/সংবৎ/শক)",
}

SOURCE_LABELS: dict[str, str] = {
    "crumbHome": "Home",
    "crumbFestivals": "Festivals",
    "subtitleTemplate": "Exact date, puja muhurat & city-wise timings for {NAME} {YEAR}",
    "yearCalendarContextTemplate": "{YEAR} Calendar Context",
    "inCityTemplate": "in {CITY}",
    "linkTodaysPanchang": "Today's Panchang",
    "linkEkadashi2026": "Ekadashi 2026",
    "linkFindMuhurta": "Find Auspicious Muhurta",
    "linkGenerateKundali": "Generate Kundali",
    "keyInformation": "Key Information",
    "keyTimings": "Key Timings",
    "festivalDate": "Festival Date",
    "weekday": "Weekday",
    "tithi": "Tithi",
    "observationRule": "Observation Rule",
    "vikramSamvat": "Vikram Samvat",
    "shakaSamvat": "Shaka Samvat",
    "city": "City",
    "sunrise": "Sunrise",
    "sunset": "Sunset",
    "pujaMuhurat": "Puja Muhurat",
    "pujaWindow": "Puja Window",
    "whyThisDate": "Why This Date?",
    "tithiDeterminationRule": "Tithi Determination Rule",
    "pujaVidhi": "Puja Vidhi",
    "materialsRequired": "Materials Required",
    "pujaSteps": "Puja Steps",
    "vratPhalaFastingBenefits": "Vrat Phala (Fasting Benefits)",
    "phalaBenefits": "Phala (Benefits)",
    "deity": "Deity",
    "festivalSingular": "Festival",
    "festivalsPlural": "Festivals",
    "howToObserve": "How to Observe",
    "legendHistory": "Legend & History",
    "readFullLegend": "Read full legend →",
    "significance": "Significance",
    "fasting": "Fasting",
    "festivalTimingRules": "Festival Timing Rules",
    "kalaRule": "Kala Rule",
    "lunarMonthsExplained": "Lunar Months Explained",
    "smartaVaishnava": "Smarta & Vaishnava Calendars",
    "understandingTithis": "Understanding Tithis",
    "calculationProof": "Calculation Proof  –  Transparent Audit Trail",
    "timezone": "Timezone",
    "coordinates": "Coordinates",
    "viewAllFestivalsVrats": "View All Festivals & Vrats",
    "showLessUp": "Show less ↑",
    "learnMore": "Learn more",
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
        f"- Keep `{{NAME}}`, `{{YEAR}}`, `{{CITY}}` placeholders EXACTLY as-is.\n"
        f"- `inCityTemplate` is 'in {{CITY}}' — Hindi uses postposition ('{{CITY}}' में). Translate as natural for the locale (English-style preposition for ta/te/kn/gu/bn if those locales prefer it; postposition where natural).\n"
        f"- Keep em-dashes ` – ` and arrows ↑ → EXACTLY as-is.\n"
        f"- Sanskrit Jyotish terms (Tithi/Nakshatra/Puja/Muhurat/Vikram Samvat/Shaka Samvat/Vrat/Phala/Vidhi/Kala/Smarta/Vaishnava) → locale-canonical form.\n"
        f"- Short field labels (City/Sunrise/Sunset/Weekday/Coordinates/Timezone) — render concisely.\n"
        f"- `Festival` (singular) and `Festivals` (plural) may translate to the same word in some locales (e.g. Hindi 'त्योहार' for both) — that's fine, the page uses them in distinct contexts.\n"
        f"- Maithili (mai) MUST use distinct Maithili grammar (अछि/मे/सँ) — never pure Hindi.\n"
        f"- Marathi (mr) MUST use distinct Marathi grammar (आहे/मध्ये/चे) — never pure Hindi.\n\n"
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
