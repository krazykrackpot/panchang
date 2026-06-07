#!/usr/bin/env python3
"""
Translate /kundali (root page + Client + compare + layout HowTo schema)
chrome + long-form article + 12-houses table to the 6 missing locales
(mai/mr/ta/te/kn/gu/bn) via Gemini 2.5 Flash on Vertex AI.

Output: src/lib/constants/kundali-page-labels-overlay.json
"""
import json
import re
import subprocess
import sys
import time
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
OUT_PATH = ROOT / "src/lib/constants/kundali-page-labels-overlay.json"
PROJECT = "dekhopanchang"
MODEL = "gemini-2.5-flash"
ENDPOINT = (
    f"https://us-central1-aiplatform.googleapis.com/v1/projects/"
    f"{PROJECT}/locations/us-central1/publishers/google/models/"
    f"{MODEL}:generateContent"
)

LOCALES = {
    "mai": "Maithili (Devanagari, natural Maithili register, Sanskrit Jyotish terms in Devanagari: कुण्डली/लग्न/भाव/राशि/नक्षत्र/दशा/योग/दोष)",
    "mr":  "Marathi (Devanagari, natural Marathi register, Sanskrit Jyotish terms in Devanagari: कुंडली/लग्न/भाव/राशी/नक्षत्र/दशा/योग/दोष)",
    "ta":  "Tamil (Tamil script, canonical Vedic vocabulary: ஜாதகம்/லக்னம்/பாவம்/ராசி/நட்சத்திரம்/தசை/யோகம்/தோஷம்)",
    "te":  "Telugu (Telugu script, canonical Vedic vocabulary: కుండలి/లగ్నం/భావం/రాశి/నక్షత్రం/దశ/యోగం/దోషం)",
    "kn":  "Kannada (Kannada script, canonical Vedic vocabulary: ಕುಂಡಲಿ/ಲಗ್ನ/ಭಾವ/ರಾಶಿ/ನಕ್ಷತ್ರ/ದಶೆ/ಯೋಗ/ದೋಷ)",
    "gu":  "Gujarati (Gujarati script, canonical Vedic vocabulary: કુંડળી/લગ્ન/ભાવ/રાશિ/નક્ષત્ર/દશા/યોગ/દોષ)",
    "bn":  "Bengali (Bengali script, canonical Vedic vocabulary: কুণ্ডলী/লগ্ন/ভাব/রাশি/নক্ষত্র/দশা/যোগ/দোষ)",
}

# Source = English authored canonical. The article paragraphs have been
# decomposed so inline <strong>/<Link> markup stays out of the translated
# strings — the page composes label fragments with JSX wrappers.
SOURCE_LABELS: dict[str, str] = {
    # ── /kundali article ──
    "introHeading": "What is a Kundali (Birth Chart)?",
    "intro": "A Kundali (also called Janam Patrika, Janam Kundli, or natal chart) is the foundational tool of Vedic astrology. It is a map of the sky at the exact moment and location of your birth, showing the positions of 9 celestial bodies (Sun, Moon, Mars, Mercury, Jupiter, Venus, Saturn, Rahu, and Ketu) across 12 houses. Each house governs a specific domain of life — health, career, marriage, children, wealth, spirituality — and the planets placed there reveal the karmic patterns and potential of that domain.",
    "requirementsHeading": "What Do You Need to Generate a Kundali?",
    "requirementsLead": "Three essential inputs:",
    "req1Label": "Date of birth:",
    "req1Text": "Day, month, and year",
    "req2Label": "Time of birth:",
    "req2Text": "As precise as possible (the Ascendant changes every ~2 hours; nakshatra pada shifts every ~3.2 hours)",
    "req3Label": "Place of birth:",
    "req3Text": "Latitude and longitude (entering a city name is sufficient — we resolve the coordinates automatically)",
    "requirementsExplain": "Birth time accuracy is critical because the Ascendant (Lagna) changes approximately every 2 hours. House lordships, planetary strengths, and dasha periods are all calculated from the Ascendant, so even a 4–5 minute error can shift the entire chart interpretation.",
    "stylesHeading": "North Indian vs South Indian Chart Styles",
    "stylesNorthLabel": "North Indian (Diamond/Kendra):",
    "stylesNorthText": "Houses are fixed in position; signs rotate. The Ascendant is always at the top-centre diamond. This style is used across North India, Nepal, and Sri Lanka.",
    "stylesSouthLabel": "South Indian (Grid):",
    "stylesSouthText": "Signs are fixed in position; planets move between them. Aries is always in the top-left cell. Used in Tamil Nadu, Karnataka, Kerala, and Andhra Pradesh. Our tool supports both styles — toggle between them after generating your chart.",
    "tableHeading": "The 12 Houses at a Glance",
    "tableHouseCol": "House",
    "tableAreaCol": "Life Area",
    "formIntroBelow": "Enter your birth details in the form below. Our engine will compute planetary positions, Ascendant, Vimshottari dasha periods, yogas, doshas, Shadbala, Ashtakavarga, and a comprehensive interpretive commentary (Tippanni) — all computed locally in your browser using Meeus algorithms, with no external APIs.",
    "exploreLagnaHeading": "Explore by Ascendant (Lagna)",
    "lagnaSuffix": "Ascendant",
    "featuredYogasHeading": "Featured Yogas",
    "yogaSuffix": "Yoga",
    "linkMatching": "Kundali Matching →",
    "linkSadeSati": "Sade Sati Check →",
    "linkLearnKundali": "Learn to Read a Kundali →",
    "linkLearnGrahas": "Nine Planets →",
    # ── 12 houses table ──
    "h1Name": "Lagna / Ascendant",
    "h1Area": "Self, personality, physical body, general temperament",
    "h2Name": "2nd House (Dhana)",
    "h2Area": "Wealth, family, speech, food habits, early education",
    "h3Name": "3rd House (Sahaja)",
    "h3Area": "Siblings, courage, short journeys, communication, skills",
    "h4Name": "4th House (Sukha)",
    "h4Area": "Mother, home, vehicles, property, domestic happiness",
    "h5Name": "5th House (Putra)",
    "h5Area": "Children, intelligence, creativity, romance, past-life merit",
    "h6Name": "6th House (Ripu)",
    "h6Area": "Enemies, disease, debts, daily work, service, litigation",
    "h7Name": "7th House (Kalatra)",
    "h7Area": "Marriage, partnerships, business associates, public dealings",
    "h8Name": "8th House (Ayu)",
    "h8Area": "Longevity, transformation, inheritance, occult, sudden events",
    "h9Name": "9th House (Dharma)",
    "h9Area": "Fortune, father, guru, long journeys, higher learning, dharma",
    "h10Name": "10th House (Karma)",
    "h10Area": "Career, reputation, authority, public image, government",
    "h11Name": "11th House (Labha)",
    "h11Area": "Gains, income, elder siblings, social networks, aspirations",
    "h12Name": "12th House (Vyaya)",
    "h12Area": "Losses, expenses, foreign lands, spirituality, liberation",
    # ── Client.tsx ──
    "generateError": "Failed to generate chart. Please check your inputs and try again.",
    "generateErrorRetry": "Failed to generate chart. Please try again.",
    "viewFullPoster": "View Full Poster",
    "shareYourChart": "Share Your Chart",
    "intensityIntense": "Intense",
    "intensityModerate": "Moderate",
    "intensityMild": "Mild",
    # ── compare/page.tsx ──
    "pickSavedChart": "Pick a saved chart...",
    "orNewDetails": "or enter new details below",
    # ── layout.tsx HowTo schema ──
    "schemaName": "How to Generate a Vedic Birth Chart (Kundali)",
    "schemaDescription": "Step-by-step guide to creating an accurate Kundali (Janam Patrika) using your birth date, time, and place. Get planetary positions, dashas, yogas, doshas, and 20+ interpretive analyses computed via Swiss Ephemeris.",
    "schemaStep1Name": "Enter Name",
    "schemaStep1Text": "Enter the name of the person whose chart you want to generate.",
    "schemaStep2Name": "Enter Birth Date and Time",
    "schemaStep2Text": "Enter the exact birth date and time. The more precise the time, the more accurate the Lagna and house positions.",
    "schemaStep3Name": "Select Birth Place",
    "schemaStep3Text": "Search and select the birth city. Latitude, longitude, and timezone are determined automatically.",
    "schemaStep4Name": "Generate Kundali",
    "schemaStep4Text": "Click \"Generate Kundali\". Swiss Ephemeris computes precise planetary positions, dashas, yogas, doshas, and 20+ analysis tabs instantly.",
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
        f"- Sanskrit Jyotish terms (Kundali/Lagna/Ascendant/Dhana/Sahaja/Sukha/Putra/Ripu/Kalatra/Ayu/Dharma/Karma/Labha/Vyaya/Vimshottari/Shadbala/Ashtakavarga/Tippanni/Janam Patrika/Swiss Ephemeris/Meeus) → locale-canonical form in the target script; for purely instrumental names (Swiss Ephemeris, Meeus) you may keep the Latin form.\n"
        f"- Sanskrit names of the 9 grahas (Sun/Moon/Mars/Mercury/Jupiter/Venus/Saturn/Rahu/Ketu) → locale-canonical form.\n"
        f"- Yoga / dosha / dasha words: locale-canonical form.\n"
        f"- The arrow `→` in linkMatching/linkSadeSati/linkLearnKundali/linkLearnGrahas — keep the arrow.\n"
        f"- Ordinals (1st, 2nd, 3rd, …, 12th) in the 12-houses table — use locale-canonical Vedic house naming (प्रथम, द्वितीय, … or முதலாம், இரண்டாம், …, or the canonical name only if the English shows just '4th House (Sukha)' → '4थ भाव (सुख)' style.\n"
        f"- For shorter labels (intensity, table column headers), keep them concise — single-word equivalents preferred.\n\n"
        f"Input:\n"
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
