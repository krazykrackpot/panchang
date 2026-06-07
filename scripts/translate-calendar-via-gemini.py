#!/usr/bin/env python3
"""
Translate /calendar root chrome + long-form intro paragraphs + 12-month
abbreviations to the 6 missing locales (mai/mr/ta/te/kn/gu/bn) via
Gemini 2.5 Flash on Vertex AI.

Output: src/lib/constants/calendar-labels-overlay.json
"""
import json
import re
import subprocess
import sys
import time
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
OUT_PATH = ROOT / "src/lib/constants/calendar-labels-overlay.json"
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
    "ta":  "Tamil (Tamil script, canonical Vedic vocabulary: பஞ்சாங்கம்/திதி/நட்சத்திரம்/யோகம்/கரணம்/ஏகாதசி/பௌர்ணமி/அமாவாசை)",
    "te":  "Telugu (Telugu script, canonical Vedic vocabulary: పంచాంగం/తిథి/నక్షత్రం/యోగం/కరణం/ఏకాదశి/పూర్ణిమ/అమావాస్య)",
    "kn":  "Kannada (Kannada script, canonical Vedic vocabulary: ಪಂಚಾಂಗ/ತಿಥಿ/ನಕ್ಷತ್ರ/ಯೋಗ/ಕರಣ/ಏಕಾದಶಿ/ಪೂರ್ಣಿಮೆ/ಅಮಾವಾಸ್ಯೆ)",
    "gu":  "Gujarati (Gujarati script, canonical Vedic vocabulary: પંચાંગ/તિથિ/નક્ષત્ર/યોગ/કરણ/એકાદશી/પૂર્ણિમા/અમાવસ્યા)",
    "bn":  "Bengali (Bengali script, canonical Vedic vocabulary: পঞ্জিকা/তিথি/নক্ষত্র/যোগ/করণ/একাদশী/পূর্ণিমা/অমাবস্যা)",
}

SOURCE_LABELS: dict[str, str] = {
    # 12 month abbreviations (3-4 char idiomatic in target script)
    "monthShort1":  "Jan", "monthShort2":  "Feb", "monthShort3":  "Mar",
    "monthShort4":  "Apr", "monthShort5":  "May", "monthShort6":  "Jun",
    "monthShort7":  "Jul", "monthShort8":  "Aug", "monthShort9":  "Sep",
    "monthShort10": "Oct", "monthShort11": "Nov", "monthShort12": "Dec",
    "ssrListName": "Upcoming Hindu Festivals",
    "mainHeading": "Hindu Festival Calendar 2026",
    "introPara1": "The Hindu calendar (Panchang) follows a lunisolar system where months, tithis (lunar days), nakshatras (lunar mansions), yogas, and karanas form the five limbs of timekeeping. Every festival and vrat date is determined by the Moon’s phase (tithi) and the lunar month (Amanta or Purnimanta convention), which is why Gregorian dates shift each year.",
    "introPara2": "This calendar provides location-accurate dates for all major festivals, Ekadashi fasting days with Parana (fast-breaking) times, Purnima, Amavasya, Chaturthi, Pradosham, and eclipses. Click on any festival to see detailed puja vidhi, significance, and observance instructions.",
    "featuresHeading": "Calendar Features",
    "featuresPara": "Our calendar is location-aware — all tithi timings, sunrise/sunset, and Ekadashi Parana windows are computed for your city. Switch between Western months (January–December), Hindu lunar months (Chaitra–Phalguna), or a visual Tithi Grid view. Filter by category: festivals only, Ekadashi, Purnima, Amavasya, Chaturthi, Pradosham, or eclipses. Export to your Apple or Google Calendar via ICS download.",
    "regionalHeading": "Regional Calendar Traditions",
    "regionalPart1": "India does not follow a single uniform calendar. The ",
    "regionalAnchorBengali": "Bengali calendar (Bangabda)",
    "regionalPart2": " is solar and starts its year with Boishakh (around April 14). The ",
    "regionalAnchorTamil": "Tamil calendar (Thiruvalluvar)",
    "regionalPart3": " is also solar, beginning the year with Chithirai at Mesha Sankranti. The ",
    "regionalAnchorGujarati": "Gujarati calendar (Vikram Samvat)",
    "regionalPart4": " is uniquely lunisolar and starts its new year (Bestu Varas) the day after Diwali on Kartik Shukla Pratipada. Telugu, Kannada, Marathi, and Odia calendars follow the lunisolar Amanta system beginning with Chaitra. See month names, new year dates, and key regional festivals for all traditions on our ",
    "regionalAnchorRegional": "Regional Calendars page",
    "regionalPart5": ".",
    "linkPanchangToday": "Today’s Panchang →",
    "linkLearnTithis": "Learn about Tithis →",
    "linkLearnMuhurtas": "Learn about Muhurtas →",
    "linkVedicTime": "Vedic Time →",
    "upcomingHeading": "Upcoming Major Festivals",
    "tableFestivalCol": "Festival",
    "tableDateCol": "Date",
    "tableDescCol": "Description",
    "ujjainFootnote": "* Dates are computed for Ujjain (Indian reference). Use the location selector in the calendar above for your city’s exact timings.",
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
        f"- Keep em-dashes ` — ` and en-dashes `–` consistent with the source.\n"
        f"- Sanskrit Jyotish terms (Panchang/tithi/nakshatra/yoga/karana/Amanta/Purnimanta/Ekadashi/Purnima/Amavasya/Chaturthi/Pradosham/Parana/Boishakh/Chithirai/Mesha Sankranti/Bestu Varas/Kartik Shukla Pratipada/Diwali/Chaitra/Phalguna/Bangabda/Thiruvalluvar/Vikram Samvat/Ujjain/Brihat Samhita) → locale-canonical form in target script.\n"
        f"- The arrow `→` in link labels — keep it.\n"
        f"- Month abbreviations (monthShort1..12) — use locale-idiomatic 3-4 char abbreviations (en: Jan/Feb/...; mai/mr/hi: जन./फर./मार्च...; ta: ஜன./பிப்./மார்ச்...; etc).\n"
        f"- regionalPart1..5 are sentence fragments to be joined with inline links — preserve any leading/trailing space EXACTLY as in source.\n"
        f"- regionalAnchorBengali/Tamil/Gujarati/Regional are link anchor texts; keep concise.\n"
        f"- regionalPart5 is just `.` — adjust to locale sentence terminator (`.` or `।` depending on script convention).\n\n"
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
