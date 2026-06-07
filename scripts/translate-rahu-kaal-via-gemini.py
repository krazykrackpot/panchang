#!/usr/bin/env python3
"""
Translate /rahu-kaal Client.tsx LABELS + page.tsx long-form SSR
paragraphs to the 6 missing locales (mai/mr/te/kn/gu/bn) via Gemini
2.5 Flash on Vertex AI.

Combines both surfaces into one batch since they share vocabulary.
"""
import json
import re
import subprocess
import sys
import time
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
OUT_PATH = ROOT / "src/lib/constants/rahu-kaal-labels-overlay.json"
PROJECT = "dekhopanchang"
MODEL = "gemini-2.5-flash"
ENDPOINT = (
    f"https://us-central1-aiplatform.googleapis.com/v1/projects/"
    f"{PROJECT}/locations/us-central1/publishers/google/models/"
    f"{MODEL}:generateContent"
)

LOCALES = {
    "mai": "Maithili (Devanagari, natural Maithili register, Sanskrit Jyotish terms in Devanagari: राहु काल/यमगण्ड/गुलिक)",
    "mr":  "Marathi (Devanagari, natural Marathi register, Sanskrit Jyotish terms in Devanagari)",
    "te":  "Telugu (Telugu script, canonical Vedic vocabulary: రాహుకాలం/యమగండం/గులిక కాలం)",
    "kn":  "Kannada (Kannada script, canonical Vedic vocabulary: ರಾಹು ಕಾಲ/ಯಮಗಂಡ/ಗುಳಿಕ ಕಾಲ)",
    "gu":  "Gujarati (Gujarati script, canonical Vedic vocabulary: રાહુ કાળ/યમગંડ/ગુળિક કાળ)",
    "bn":  "Bengali (Bengali script, canonical Vedic vocabulary: রাহু কাল/যমগণ্ড/গুলিক কাল)",
}

SOURCE_LABELS: dict[str, str] = {
    # Client.tsx LABELS
    "back": "Panchang",
    "title": "Rahu Kaal Today",
    "rahuKaal": "Rahu Kaal",
    "yamaganda": "Yamaganda",
    "gulika": "Gulika Kaal",
    "sunrise": "Sunrise",
    "sunset": "Sunset",
    "timeline": "Timeline",
    "whatIs": "What is Rahu Kaal?",
    "whatIsText": "Rahu Kaal (also spelled Rahu Kalam) is a period of approximately 90 minutes each day that is considered inauspicious in Vedic astrology. It is ruled by the shadow planet Rahu, one of the nine celestial bodies (Navagraha). During this time, starting new ventures, journeys, or important activities is traditionally avoided. Rahu Kaal occurs at different times each day based on the day of the week and the local sunrise/sunset times.",
    "howCalc": "How is it Calculated?",
    "howCalcText": "The day (sunrise to sunset) is divided into 8 equal parts. Each part is assigned to a planet in a fixed weekly sequence. The segment assigned to Rahu is Rahu Kaal. For example, on Monday, Rahu Kaal falls in the 2nd segment; on Saturday, it falls in the 6th. Yamaganda (ruled by Yama) and Gulika Kaal (ruled by Saturn's son Gulika) are similarly calculated from different segments of the day.",
    "avoid": "Activities to Avoid During Rahu Kaal",
    "avoidItems": "Starting a new business or venture|Signing important contracts or agreements|Beginning a journey or travel|Purchasing property or vehicles|Conducting marriage or engagement ceremonies|Starting construction of a new building|Filing legal documents|Making major financial investments",
    "seeAlso": "See Also",
    "inauspicious": "Inauspicious",
    "caution": "Caution",
    # page.tsx chrome
    "city": "City",
    "todaysPanchang": "Today's Panchang",
    "choghadiya": "Choghadiya",
    "horaChart": "Hora Chart",
    "auspiciousMuhurat": "Auspicious Muhurat",
    "festivalCalendar": "Festival Calendar",
    # page.tsx headline + intro (with {WEEKDAY} placeholder)
    "headline": "Rahu Kaal Today — {WEEKDAY}, {DATE}",
    "primaryAnswer": "Today's Rahu Kaal on {WEEKDAY} is {START} to {END} (Delhi). Avoid starting new ventures during this period.",
    "introNote": "Rahu Kaal is a ~90-minute inauspicious period every day. It is calculated from sunrise and sunset, so times differ for each city.",
    # page.tsx long-form educational paragraphs
    "edu1Heading": "What is Rahu Kaal?",
    "edu1Body": "Rahu Kaal is an inauspicious time period in Vedic astrology that occurs daily for approximately 90 minutes. It is calculated by dividing the time between sunrise and sunset into 8 equal parts. Each day of the week has Rahu Kaal in a different segment — Sunday in the 8th part, Monday in the 2nd, Tuesday in the 7th, Wednesday in the 5th, Thursday in the 6th, Friday in the 4th, and Saturday in the 3rd part.",
    "edu2Heading": "What to Avoid During Rahu Kaal?",
    "edu2Body": "During Rahu Kaal, it is considered inauspicious to start new ventures, sign contracts, begin travel, or make important decisions. However, continuing work that was already started before Rahu Kaal is not affected.",
    "edu3HeadingTemplate": "Rahu Kaal Order for {WEEKDAY}",
    "edu3BodyTemplate": "On {WEEKDAY}, Rahu Kaal falls in the {RAHU} segment after sunrise. Yamaganda falls in the {YAMA} segment, and Gulika Kaal in the {GULIKA} segment.",
    # ordinals used in edu3BodyTemplate ({RAHU}/{YAMA}/{GULIKA}) — translated separately
    "ord1": "1st",
    "ord2": "2nd",
    "ord3": "3rd",
    "ord4": "4th",
    "ord5": "5th",
    "ord6": "6th",
    "ord7": "7th",
    "ord8": "8th",
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
        f"- Keep `|` (pipe) separators EXACTLY where they appear in `avoidItems` — that's a UI delimiter.\n"
        f"- Keep `{{WEEKDAY}}`, `{{DATE}}`, `{{START}}`, `{{END}}`, `{{RAHU}}`, `{{YAMA}}`, `{{GULIKA}}` placeholders EXACTLY as-is — runtime substitutions.\n"
        f"- Keep the em-dash spacing ` — ` consistent with the source.\n"
        f"- Ordinals (ord1..ord8): use locale-native ordinal forms (e.g. mai/mr: 1ले/2रे/3रे..., gu: 1લો/2જો/3જો..., bn: ১ম/২য়/৩য়..., te: 1వ/2వ/3వ..., kn: 1ನೇ/2ನೇ/3ನೇ...).\n"
        f"- Sanskrit Jyotish terms (Rahu/Yamaganda/Gulika/Navagraha) → locale-canonical form in the target script.\n\n"
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
