#!/usr/bin/env python3
"""
Translate /panchang (root page + PanchangClient) chrome + long-form
SSR paragraphs to the 6 missing locales (mai/mr/ta/te/kn/gu/bn) via
Gemini 2.5 Flash on Vertex AI.

Output: src/lib/constants/panchang-page-labels-overlay.json
"""
import json
import re
import subprocess
import sys
import time
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
OUT_PATH = ROOT / "src/lib/constants/panchang-page-labels-overlay.json"
PROJECT = "dekhopanchang"
MODEL = "gemini-2.5-flash"
ENDPOINT = (
    f"https://us-central1-aiplatform.googleapis.com/v1/projects/"
    f"{PROJECT}/locations/us-central1/publishers/google/models/"
    f"{MODEL}:generateContent"
)

LOCALES = {
    "mai": "Maithili (Devanagari, natural Maithili register, Sanskrit Jyotish terms in Devanagari)",
    "mr":  "Marathi (Devanagari, natural Marathi register, Sanskrit Jyotish terms in Devanagari)",
    "ta":  "Tamil (Tamil script, canonical Vedic vocabulary: திதி/நட்சத்திரம்/யோகம்/கரணம்/ராகு காலம்)",
    "te":  "Telugu (Telugu script, canonical Vedic vocabulary: తిథి/నక్షత్రం/యోగం/కరణం/రాహుకాలం)",
    "kn":  "Kannada (Kannada script, canonical Vedic vocabulary: ತಿಥಿ/ನಕ್ಷತ್ರ/ಯೋಗ/ಕರಣ/ರಾಹು ಕಾಲ)",
    "gu":  "Gujarati (Gujarati script, canonical Vedic vocabulary: તિથિ/નક્ષત્ર/યોગ/કરણ/રાહુ કાળ)",
    "bn":  "Bengali (Bengali script, canonical Vedic vocabulary: তিথি/নক্ষত্র/যোগ/করণ/রাহু কাল)",
}

SOURCE_LABELS: dict[str, str] = {
    # Nav chrome
    "generateKundali": "Generate Kundali",
    "festivalCalendar": "Festival Calendar",
    "muhuratCalendar": "Muhurat Calendar",
    "planetaryTransits": "Planetary Transits",
    "choghadiya": "Choghadiya",
    "rahuKaal": "Rahu Kaal",
    "dailyHoroscope": "Daily Horoscope",
    "babyNames": "Baby Names",
    "tomorrowsPanchang": "Tomorrow's Panchang",
    # Activity guide
    "todaysGuidance": "Today's Guidance",
    # Auspiciousness
    "auspicious": "auspicious",
    "moderatelyAuspicious": "moderately auspicious",
    # Featured-snippet paragraphs (templates with placeholders)
    "snippetIntro": "This {VARA} brings {TITHI} Tithi under {NAK} Nakshatra, with {YOGA} Yoga.",
    "snippetActivities": "The day is {AUSP} — {NAK} favors {ACTIVITIES}.",
    "snippetActivitiesFallback": "general activities",
    "snippetRahu": "Rahu Kaal runs {START}–{END}; hold off on new beginnings during that window.",
    # Why-five-elements section
    "whyFiveElementsHeading": "Why Five Elements?",
    "whyFiveElementsPara1Pre": "The Panchang (pancha + anga = five limbs) captures the five — and only five — observable relationships between the Sun, Moon, and the cosmos. Tithi measures the Sun-Moon angular separation (see year-round dates for ",
    "whyFiveElementsPara1Sep": ", ",
    "whyFiveElementsPara1And": ", and ",
    "whyFiveElementsPara1Post": "). Nakshatra tracks the Moon against the fixed stars. Yoga combines the solar and lunar longitudes. Karana divides the tithi into finer pulses. Vara (weekday) follows the planetary hour sequence.",
    "whyFiveElementsPara2": "These are not arbitrary divisions — they are the complete set of independent astronomical observables in this three-body system. The ancient astronomers did not choose five — five is all there is. Each calculation is computed from real planetary positions using Surya Siddhanta algorithms, whose precision modern instruments have confirmed.",
    # Popular Cities section
    "panchangByCity": "Panchang by City",
    "panchangByCityIntro": "View accurate sunrise, sunset, tithi, nakshatra, and Rahu Kaal timings for your city.",
    "indianCities": "Indian Cities",
    "internationalCities": "International Cities",
    "viewAll800Cities": "View all 800+ cities →",
    # Tithi anomalies (PanchangClient)
    "kshayaTithi": "Kshaya Tithi",
    "vriddhiTithi": "Vriddhi Tithi",
    "spansTwoSunrises": "spans two sunrises",
    "more": "more",
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
        f"- Keep `{{VARA}}`, `{{TITHI}}`, `{{NAK}}`, `{{YOGA}}`, `{{AUSP}}`, `{{ACTIVITIES}}`, `{{START}}`, `{{END}}` placeholders EXACTLY as-is — runtime substitutions.\n"
        f"- Keep em-dashes ` — ` and en-dashes `–` consistent with the source.\n"
        f"- `whyFiveElementsPara1Pre` ends with a trailing space before the inline links — keep the trailing space.\n"
        f"- `whyFiveElementsPara1Sep` / `whyFiveElementsPara1And` are sentence joiners — translate to the locale's natural list joiner (e.g. Tamil: `, `, `, மற்றும் `).\n"
        f"- `whyFiveElementsPara1Post` begins with `).` — keep the closing paren + locale-appropriate sentence terminator.\n"
        f"- Sanskrit Jyotish terms (Panchang/Tithi/Nakshatra/Yoga/Karana/Vara/Rahu Kaal/Surya Siddhanta) → locale-canonical form in the target script.\n"
        f"- `viewAll800Cities` ends with the arrow `→` — keep it.\n\n"
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
