#!/usr/bin/env python3
"""
Translate /panchang/[city] chrome + intro/about long-form + share/CTA
copy + 12 month abbreviations to the 6 missing locales (mai/mr/ta/te/
kn/gu/bn) via Gemini 2.5 Flash on Vertex AI.

Output: src/lib/constants/panchang-city-labels-overlay.json
"""
import json
import re
import subprocess
import sys
import time
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
OUT_PATH = ROOT / "src/lib/constants/panchang-city-labels-overlay.json"
PROJECT = "dekhopanchang"
MODEL = "gemini-2.5-flash"
ENDPOINT = (
    f"https://us-central1-aiplatform.googleapis.com/v1/projects/"
    f"{PROJECT}/locations/us-central1/publishers/google/models/"
    f"{MODEL}:generateContent"
)

LOCALES = {
    "mai": "Maithili (Devanagari, natural Maithili register, distinct from Hindi: अछि not है, मे not में, सँ not से)",
    "mr":  "Marathi (Devanagari, natural Marathi register, distinct from Hindi: आहे not है, मध्ये not में, चे not का)",
    "ta":  "Tamil (Tamil script, canonical Vedic vocabulary: பஞ்சாங்கம்/திதி/நட்சத்திரம்/யோகம்/கரணம்/வாரம்/சூரிய உதயம்/சூரிய அஸ்தமனம்/ராகு காலம்/லாஹிரி அயனாம்சம்)",
    "te":  "Telugu (Telugu script, canonical Vedic vocabulary: పంచాంగం/తిథి/నక్షత్రం/యోగం/కరణం/వారం/సూర్యోదయం/సూర్యాస్తమయం/రాహుకాలం/లాహిరి అయనాంశం)",
    "kn":  "Kannada (Kannada script, canonical Vedic vocabulary: ಪಂಚಾಂಗ/ತಿಥಿ/ನಕ್ಷತ್ರ/ಯೋಗ/ಕರಣ/ವಾರ/ಸೂರ್ಯೋದಯ/ಸೂರ್ಯಾಸ್ತ/ರಾಹು ಕಾಲ/ಲಾಹಿರಿ ಅಯನಾಂಶ)",
    "gu":  "Gujarati (Gujarati script, canonical Vedic vocabulary: પંચાંગ/તિથિ/નક્ષત્ર/યોગ/કરણ/વાર/સૂર્યોદય/સૂર્યાસ્ત/રાહુ કાળ/લાહિરી અયનાંશ)",
    "bn":  "Bengali (Bengali script, canonical Vedic vocabulary: পঞ্জিকা/তিথি/নক্ষত্র/যোগ/করণ/বার/সূর্যোদয়/সূর্যাস্ত/রাহু কাল/লাহিড়ি অয়নাংশ)",
}

SOURCE_LABELS: dict[str, str] = {
    "titleDiasporaTemplate": "{CITY} Panchang Today ({TZ}) — {TITHI}, {NAK} | {DATE}",
    "titleDomesticTemplate": "{CITY} Panchang Today — {TITHI}, {NAK} | {DATE}",
    "descDiasporaTemplate": "Daily Vedic Panchang for Hindus in {CITY}. Accurate Tithi, Nakshatra, Muhurta times{TZ_SUFFIX}. Swiss Ephemeris precision.",
    "descDomesticTemplate": "Today's Panchang for {CITY}, {STATE} — accurate sunrise, sunset, tithi, nakshatra, yoga, karana, Rahu Kaal, Yamaganda & Gulika timings. Vedic calculations using Lahiri Ayanamsha.",
    "tzSuffixTemplate": " in {TZ}",
    "introTemplate": "Today's Panchang for {CITY}, {STATE} — accurate sunrise, sunset, tithi, nakshatra, yoga, and karana timings computed for {CITY}'s exact coordinates ({LAT}, {LNG}). All Vedic calendar elements are calculated using the Lahiri Ayanamsha and Meeus astronomical algorithms for sub-arcsecond accuracy. This page updates daily with {CITY}'s local timings, including Rahu Kaal, Yamaganda Kaal, and Gulika Kaal — essential for planning auspicious activities.",
    "shareTextTemplate": "{CITY} Panchang Today: {TITHI}, {NAK} | Sunrise {SR}",
    "calcProofHeader": "Calculation Proof — How These Values Were Computed",
    "calcProofIntroTemplate": "All values computed from {CITY}'s exact coordinates using Swiss Ephemeris precision. No approximations or defaults.",
    "calcLatitude": "Latitude",
    "calcLongitude": "Longitude",
    "calcTimezone": "Timezone",
    "calcAyanamsha": "Ayanamsha",
    "calcSunDepression": "Sun Depression",
    "calcTithiFormula": "Tithi Formula",
    "calcRahuKaalRow": "Rahu Kaal",
    "calcRahuKaalFormula": "1/8th of daytime, weekday-indexed segment",
    "calcProofFootnote": "Tithi transitions determined by 30-iteration binary search on Moon-Sun elongation (~1-second precision). Sunrise/sunset via 2-pass Meeus algorithm with atmospheric refraction.",
    "specialYogasHeading": "Special Yogas Today",
    "ctaSubtextTemplate": "Planetary positions, Choghadiya, Hora, Disha Shool — everything for {CITY}",
    "aboutPara1Template": "Daily Vedic Panchang for {CITY}, {STATE} — calculated each day for the exact latitude {LAT} and longitude {LNG}. The five limbs of the Panchang — Tithi (lunar day), Vara (weekday), Nakshatra (lunar mansion), Yoga (luni-solar combination), and Karana (half-tithi) — are essential for selecting auspicious timings and daily religious observances.",
    "aboutPara2Template": "All calculations use the Lahiri Ayanamsha (Chitrapaksha), the most widely used ayanamsha in Indian astrology. Sunrise and sunset times are computed for {CITY}'s geographic coordinates using the {TZ} timezone, accounting for daylight saving transitions where applicable. Rahu Kaal, Yamaganda Kaal, and Gulika Kaal are derived from the classical Vara-based formula.",
    "aboutPara3": "This page is server-rendered and updated daily. For personalized readings including planetary transit effects on your birth chart, use the interactive Panchang with your exact location.",
    "emailHeadline": "Get this delivered to your inbox every morning",
    "emailSubtext": "Free account — daily panchang, Rahu Kaal, and rashifal at sunrise",
    "emailButtonLabel": "Sign Up Free",
    "monthShort1":  "Jan", "monthShort2":  "Feb", "monthShort3":  "Mar",
    "monthShort4":  "Apr", "monthShort5":  "May", "monthShort6":  "Jun",
    "monthShort7":  "Jul", "monthShort8":  "Aug", "monthShort9":  "Sep",
    "monthShort10": "Oct", "monthShort11": "Nov", "monthShort12": "Dec",
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
        f"- Keep `{{CITY}}`, `{{STATE}}`, `{{TZ}}`, `{{TZ_SUFFIX}}`, `{{LAT}}`, `{{LNG}}`, `{{TITHI}}`, `{{NAK}}`, `{{DATE}}`, `{{SR}}` placeholders EXACTLY as-is.\n"
        f"- Keep em-dashes ` — ` and tildes `~` consistent with the source.\n"
        f"- Month abbreviations (monthShort1..12) — use locale-idiomatic 3-4 char abbreviations.\n"
        f"- Sanskrit Jyotish terms (Panchang/Tithi/Nakshatra/Yoga/Karana/Vara/Rahu Kaal/Yamaganda/Gulika/Lahiri Ayanamsha/Chitrapaksha/Swiss Ephemeris/Meeus/Choghadiya/Hora/Disha Shool/rashifal) → locale-canonical form.\n"
        f"- `Hindus in {{CITY}}` (diaspora description) — translate naturally; do not literally render 'Hindus' if your locale uses 'हिन्दू समुदाय'/'இந்து சமூகம்' etc.\n"
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
