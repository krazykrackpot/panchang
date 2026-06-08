#!/usr/bin/env python3
"""Translate /dates, /sade-sati, /matching, /vedic-time, /upagraha,
/gauri-panchang, /hora chrome (95 keys) via Gemini 2.5 Flash on Vertex AI."""
import json
import re
import subprocess
import sys
import time
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
OUT_PATH = ROOT / "src/lib/constants/tool-pages-labels-overlay.json"
PROJECT = "dekhopanchang"
MODEL = "gemini-2.5-flash"
ENDPOINT = (
    f"https://us-central1-aiplatform.googleapis.com/v1/projects/"
    f"{PROJECT}/locations/us-central1/publishers/google/models/"
    f"{MODEL}:generateContent"
)

LOCALES = {
    "mai": "Maithili (Devanagari, distinct from Hindi: अछि/मे/सँ)",
    "mr":  "Marathi (Devanagari, distinct from Hindi: आहे/मध्ये/चे)",
    "ta":  "Tamil (Tamil script, canonical Vedic vocabulary)",
    "te":  "Telugu (Telugu script, canonical Vedic vocabulary)",
    "kn":  "Kannada (Kannada script, canonical Vedic vocabulary)",
    "gu":  "Gujarati (Gujarati script, canonical Vedic vocabulary)",
    "bn":  "Bengali (Bengali script, canonical Vedic vocabulary)",
}

SOURCE_LABELS = {
    "somvatiAmavasya": "Somvati Amavasya",
    "shaniAmavasya": "Shani Amavasya",
    "diwaliAmavasya": "Diwali Amavasya",
    "mauniAmavasya": "Mauni Amavasya",
    "amavasya": "Amavasya",
    "shaniPradosham": "Shani Pradosham",
    "somaPradosham": "Soma Pradosham",
    "pradosham": "Pradosham",
    "sankashtiChaturthi": "Sankashti Chaturthi",
    "vinayakaChaturthi": "Vinayaka Chaturthi",
    "date": "Date",
    "day": "Day",
    "hinduMonth": "Hindu Month",
    "paksha": "Paksha",
    "nameSignificance": "Name / Significance",
    "shukla": "Shukla",
    "krishna": "Krishna",
    "saturnTransit2026": "Saturn Transit 2026",
    "saturnTransitSchedule2023u20132032": "Saturn Transit Schedule (2023\\u20132032)",
    "sign": "Sign",
    "enters": "Enters",
    "exits": "Exits",
    "whichMoonSignsAre": "Which Moon Signs Are Currently in Sade Sati?",
    "risingPhase": "Rising Phase",
    "financialPressureHiddenAnxieties": "Financial pressure, hidden anxieties",
    "peakPhase": "Peak Phase",
    "mostIntenseU2014Mental": "Most intense \\u2014 mental pressure, transformation",
    "settingPhase": "Setting Phase",
    "familyMattersSpeechrelatedIssues": "Family matters, speech-related issues",
    "learnAboutGrahasU2192": "Learn about Grahas \\u2192",
    "generateBirthChartU2192": "Generate Birth Chart \\u2192",
    "kuta": "Kuta",
    "points": "Points",
    "whatItMeasures": "What It Measures",
    "rashiCompatibilityChartU2192": "Rashi Compatibility Chart \\u2192",
    "learnAboutMatchingU2192": "Learn about Matching \\u2192",
    "learnAboutNakshatrasU2192": "Learn about Nakshatras \\u2192",
    "theAncientIndianTime": "The ancient Indian time system — Ghati, Pala, Muhurta, Prahar. The Vedic day begins at sunrise and is divided into 60 Ghatis, 30 Muhurtas, and 8 Prahars.",
    "whatIsVedicTime": "What is Vedic Time?",
    "theVedicTimeSystem": "The Vedic time system is an ancient Indian method of time measurement described in the Surya Siddhanta and other astronomical texts. Unlike the modern 24-hour clock which starts at midnight, the Vedic day begins at sunrise. This means Ghati-Pala timings shift every day and by location, because sunrise varies with season and latitude.",
    "theFundamentalUnitIs": "The fundamental unit is the \"Ghati\" (or \"Nadika\"), equal to 24 modern minutes. Each Ghati contains 60 Palas (each 24 seconds). Sixty Ghatis make one Ahoratra (full day-night cycle). These units were measured using water clocks (Ghati Yantra) — a copper vessel with a small hole through which water flowed at a calibrated rate.",
    "theGhatiSystem": "The Ghati System",
    "theGhatiSystemIs": "The Ghati system is sexagesimal (base-60), mirroring the modern convention of 60 seconds = 1 minute, 60 minutes = 1 hour. In the Vedic system: 60 Palas = 1 Ghati, 60 Ghatis = 1 day. This likely reflects an ancient mathematical connection between Sumerian and Indian civilisations. The Muhurta (2 Ghatis = 48 minutes) and Prahar (7.5 Ghatis = 3 hours) are larger units used for daily rituals and ceremonies.",
    "inJyotishTheMuhurta": "In Jyotish, the Muhurta is of special significance. Each of the day\\",
    "vedicTimeConversionTable": "Vedic Time Conversion Table",
    "vedicUnit": "Vedic Unit",
    "duration": "Duration",
    "perDay": "Per Day",
    "description": "Description",
    "_30MuhurtasOfThe": "30 Muhurtas of the Day",
    "eachMuhurtaSpans48": "Each Muhurta spans 48 minutes. Starting from sunrise, 15 belong to the daytime and 15 to nighttime. Auspicious Muhurtas are marked green, inauspicious in red.",
    "keyRelationships": "Key Relationships",
    "practicalUseToday": "Practical Use Today",
    "vedicTimeUnitsAre": "Vedic time units are still used in Muhurta Shastra (electional astrology), Panchang computation, Hora charts, and astrological consultations. When selecting auspicious times for weddings, housewarming (Griha Pravesh), or naming ceremonies, timings are often given in Ghati-Pala notation. Every Panchang records tithi, nakshatra, and yoga start/end times in Ghati-Pala format.",
    "theInteractiveToolBelow": "The interactive tool below shows the current Vedic time (Ghati, Pala, Vipala), running Muhurta, and Prahar based on your location\\",
    "horaChart": "Hora Chart",
    "choghadiya": "Choghadiya",
    "auspiciousMuhurat": "Auspicious Muhurat",
    "upagraha": "Upagraha",
    "degrees": "Degrees",
    "nature": "Nature",
    "malefic": "Malefic",
    "benefic": "Benefic",
    "mixed": "Mixed",
    "detailedUpagrahaGuide": "Detailed Upagraha Guide",
    "effects": "Effects: ",
    "calculationMethod": "Calculation Method",
    "gulikaMandiIsComputed": "Gulika (Mandi) is computed differently -- from Saturn\\",
    "rahuKaal": "Rahu Kaal",
    "vedicTime": "Vedic Time",
    "kundali": "Kundali",
    "gauriPeriod": "Gauri Period",
    "time": "Time",
    "gauriPanchangSlotsAre": "Gauri Panchang slots are computed from sunrise and sunset, so timings vary by city. Use the interactive tool below to select your location for precise Gowri Nalla Neram timings.",
    "whatIsGauriPanchang": "What is Gauri Panchang?",
    "gauriPanchangGowriNalla": "Gauri Panchang (Gowri Nalla Neram) is a Vedic time-division system widely used across South India — Tamil Nadu, Karnataka, Andhra Pradesh, Telangana and Kerala. It is the South-Indian counterpart of Choghadiya, which is more common in North India. Each day and night is divided into 8 equal parts, yielding 16 named periods in total.",
    "theEightGauriPeriods": "The Eight Gauri Periods",
    "theEightPeriodsAre": "The eight periods are: Amritha (nectar, most auspicious), Siddha (achievement), Laabha (gain), Dhanam (wealth), Sugam (comfort) — five auspicious; and Marana (death), Rogam (disease), Sokam (sorrow) — three inauspicious. Unlike Choghadiya, Gauri has no \"neutral\" tier — every period is either clearly auspicious or inauspicious.",
    "howIsGauriPanchang": "How is Gauri Panchang Calculated?",
    "dayGauriTheTime": "Day Gauri: the time between sunrise and sunset is divided into 8 equal parts (each ~90 minutes). Night Gauri: sunset to next sunrise, also 8 parts. The starting period rotates by weekday — Sunday starts with Sokam, Monday with Amritha (the Moon\\",
    "gauriPanchangVsChoghadiya": "Gauri Panchang vs Choghadiya",
    "bothAreVedicTimedivision": "Both are Vedic time-division systems, but they differ: (1) Gauri has 8 distinct period names; Choghadiya has 7 (Char repeats). (2) Gauri has no \"neutral\" category — every period is auspicious or inauspicious. (3) The weekday rotation is different — weekdays start with different periods. (4) Gauri is the traditional South-Indian system; Choghadiya is more common in Gujarat, Rajasthan, and Madhya Pradesh.",
    "auspiciousTimings": "Auspicious Timings",
    "learnMore": "Learn More",
    "horaSlotsAreCalculated": "Hora slots are calculated from sunrise and sunset, so times vary by city. Use the interactive tool below to select your city.",
    "planet": "Planet",
    "bestFor": "Best For",
    "whatIsHora": "What is Hora?",
    "horaIsTheVedic": "Hora is the Vedic astrology system of planetary hours. Each day and night is divided into 12 horas each, totalling 24 horas per day. Each hora is ruled by one of the seven classical planets (Sun, Moon, Mars, Mercury, Jupiter, Venus, Saturn) in the \"Chaldean order\" — planets ordered by their orbital period from slowest to fastest.",
    "whichHoraIsGood": "Which Hora is Good for Which Activity?",
    "sunHoraGovernmentWork": "Sun Hora: government work, authority, health matters. Moon Hora: travel, public relations, creative work. Mars Hora: property, legal matters, surgery, courageous acts. Mercury Hora: education, communication, writing, trade. Jupiter Hora: finance, teaching, religious ceremonies, marriage (most auspicious). Venus Hora: arts, entertainment, romance, luxury purchases. Saturn Hora: agriculture, iron/steel work, disciplined labour.",
    "howIsHoraCalculated": "How is Hora Calculated?",
    "dayHorasSunriseTo": "Day horas: sunrise to sunset divided into 12 equal parts. Night horas: sunset to next sunrise divided into 12 parts. The first hora belongs to the weekday lord (Sunday = Sun, Monday = Moon, etc.). Subsequent horas follow the Chaldean sequence: Saturn → Jupiter → Mars → Sun → Venus → Mercury → Moon, cycling repeatedly.",
    "muhuratAi": "Muhurat AI",
    "festivalCalendar": "Festival Calendar"
}


def get_access_token() -> str:
    return subprocess.check_output(
        ["gcloud", "auth", "print-access-token"], text=True
    ).strip()


def gemini_translate(token: str, locale: str, locale_desc: str) -> dict:
    prompt = (
        f"Translate the following English Vedic-astrology UI copy to {locale_desc}.\n\n"
        "Rules:\n"
        "- Output ONLY a JSON object, no markdown fences, no commentary.\n"
        "- Keys must be identical to the input.\n"
        "- Keep arrows → and em-dashes — consistent with the source.\n"
        "- Sanskrit Jyotish terms (Tithi/Nakshatra/Muhurat/Hora/Rashi/Lagna/Gauri/Choghadiya/Upagraha/Panchang) → locale-canonical form.\n"
        "- Maithili (mai) MUST use distinct Maithili grammar — never pure Hindi.\n"
        "- Marathi (mr) MUST use distinct Marathi grammar — never pure Hindi.\n\n"
        "Input:\n"
        + json.dumps(SOURCE_LABELS, ensure_ascii=False, indent=2)
    )
    body = {
        "contents": [{"role": "user", "parts": [{"text": prompt}]}],
        "generationConfig": {
            "responseMimeType": "application/json",
            "temperature": 0.3,
            "maxOutputTokens": 65536,
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
    out: dict = {}
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
