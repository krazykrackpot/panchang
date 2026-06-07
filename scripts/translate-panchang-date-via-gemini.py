#!/usr/bin/env python3
"""
Translate /panchang/date/[date] chrome + H1 + summary template + InfoRow
labels + related-link labels to the 6 missing locales (mai/mr/ta/te/kn/
gu/bn) via Gemini 2.5 Flash on Vertex AI.

Output: src/lib/constants/panchang-date-labels-overlay.json
"""
import json
import re
import subprocess
import sys
import time
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
OUT_PATH = ROOT / "src/lib/constants/panchang-date-labels-overlay.json"
PROJECT = "dekhopanchang"
MODEL = "gemini-2.5-flash"
ENDPOINT = (
    f"https://us-central1-aiplatform.googleapis.com/v1/projects/"
    f"{PROJECT}/locations/us-central1/publishers/google/models/"
    f"{MODEL}:generateContent"
)

LOCALES = {
    "mai": "Maithili (Devanagari, natural Maithili register — distinct from Hindi: use अछि not है, मे not में, सँ not से, क not को, ओ not और)",
    "mr":  "Marathi (Devanagari, natural Marathi register — distinct from Hindi: use चे not का, आहे not है, मध्ये not में)",
    "ta":  "Tamil (Tamil script, canonical Vedic vocabulary: திதி/நட்சத்திரம்/யோகம்/கரணம்/வாரம்/சூரிய உதயம்/சூரிய அஸ்தமனம்/ராகு காலம்/அபிஜித் முகூர்த்தம்/பஞ்சாங்கம்/சோகடியா/கோயில்/குண்டலி)",
    "te":  "Telugu (Telugu script, canonical Vedic vocabulary: తిథి/నక్షత్రం/యోగం/కరణం/వారం/సూర్యోదయం/సూర్యాస్తమయం/రాహుకాలం/అభిజిత్ ముహూర్తం/పంచాంగం/చోఘడియా/కుండలి)",
    "kn":  "Kannada (Kannada script, canonical Vedic vocabulary: ತಿಥಿ/ನಕ್ಷತ್ರ/ಯೋಗ/ಕರಣ/ವಾರ/ಸೂರ್ಯೋದಯ/ಸೂರ್ಯಾಸ್ತ/ರಾಹು ಕಾಲ/ಅಭಿಜಿತ್ ಮುಹೂರ್ತ/ಪಂಚಾಂಗ/ಚೋಘಡಿಯಾ/ಕುಂಡಲಿ)",
    "gu":  "Gujarati (Gujarati script, canonical Vedic vocabulary: તિથિ/નક્ષત્ર/યોગ/કરણ/વાર/સૂર્યોદય/સૂર્યાસ્ત/રાહુ કાળ/અભિજિત મુહૂર્ત/પંચાંગ/ચોઘડિયા/કુંડળી)",
    "bn":  "Bengali (Bengali script, canonical Vedic vocabulary: তিথি/নক্ষত্র/যোগ/করণ/বার/সূর্যোদয়/সূর্যাস্ত/রাহু কাল/অভিজিৎ মুহূর্ত/পঞ্জিকা/চোঘড়িয়া/কুণ্ডলী)",
}

SOURCE_LABELS: dict[str, str] = {
    "prevDay": "Previous day",
    "today": "Today",
    "nextDay": "Next day",
    "dateNavAria": "Date navigation",
    "relatedPagesAria": "Related pages",
    "festivalTodayTemplate": "Today is {NAME}.",
    "seeMuhurat": "See muhurat",
    "h1Template": "{CITY} Panchang for {WEEKDAY}, {DATE}",
    "summaryTemplate": "In {CITY} on {WEEKDAY}, {DATE} the [[1]] is {TITHI}, [[2]] is {NAK}, [[3]] is {YOGA} and [[4]] is {KARANA}. Sunrise {SUNRISE}, sunset {SUNSET}. [[5]] runs {RK_START}–{RK_END} — avoid starting new auspicious work during this window.",
    "linkText1": "Tithi",
    "linkText2": "Nakshatra",
    "linkText3": "Yoga",
    "linkText4": "Karana",
    "linkText5": "Rahu Kaal",
    "rowTithi": "Tithi",
    "rowNakshatra": "Nakshatra",
    "rowYoga": "Yoga",
    "rowKarana": "Karana",
    "rowVara": "Vara",
    "rowSunrise": "Sunrise",
    "rowSunset": "Sunset",
    "rowRahuKaal": "Rahu Kaal",
    "rowAbhijitMuhurta": "Abhijit Muhurta",
    "computedForTemplate": "Computed for {CITY}. For your city, visit the main Panchang page.",
    "linkChoghadiyaTemplate": "{DATE} Choghadiya",
    "linkTodaysPanchang": "Today's Panchang",
    "linkFestivalCalendar": "Festival Calendar",
    "linkKundali": "Kundali",
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
        f"- Keep `{{CITY}}`, `{{WEEKDAY}}`, `{{DATE}}`, `{{TITHI}}`, `{{NAK}}`, `{{YOGA}}`, `{{KARANA}}`, `{{SUNRISE}}`, `{{SUNSET}}`, `{{RK_START}}`, `{{RK_END}}`, `{{NAME}}` placeholders EXACTLY as-is.\n"
        f"- Keep the link markers `[[1]]`, `[[2]]`, `[[3]]`, `[[4]]`, `[[5]]` EXACTLY as-is — they are JSX <Link> insertion points.\n"
        f"- The 5 link markers in `summaryTemplate` correspond to the linkText1..5 anchor texts (Tithi/Nakshatra/Yoga/Karana/Rahu Kaal). The translated paragraph must still place each link marker at the grammatical position where its anchor noun belongs in the target language. For verb-final languages (Tamil/Telugu/Kannada), this is fine — the marker stays adjacent to its noun in the original Subject-marker-Predicate order; restructure the sentence around the markers as needed.\n"
        f"- `h1Template` may rearrange `{{CITY}}`/`{{WEEKDAY}}`/`{{DATE}}` order to match the target language's natural genitive/postposition.\n"
        f"- Keep en-dashes `–` and em-dashes `—` consistent with the source.\n"
        f"- Sanskrit Jyotish terms (Panchang/Tithi/Nakshatra/Yoga/Karana/Vara/Rahu Kaal/Abhijit Muhurta/Sunrise/Sunset/Choghadiya/Kundali/Festival Calendar) → locale-canonical form.\n"
        f"- Maithili (mai) MUST use distinct Maithili grammar — not Hindi text. Verb endings: अछि/होइत अछि (not है); postpositions: मे/सँ/क (not में/से/को); conjunctions: ओ (not और). Reason: Hindi prose on /mai/* paths triggers Google duplicate-content dedup vs the existing Hindi page; see PR #391 HIGH x2.\n"
        f"- Marathi (mr) MUST use distinct Marathi grammar — not Hindi. Postpositions: चे/मध्ये (not का/में); verb endings: आहे (not है).\n\n"
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
