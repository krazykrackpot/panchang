#!/usr/bin/env python3
"""
Translate /panchang/auspicious chrome + muhurta rows + 4 educational
paragraphs + cross-links + 7 weekday names to the 6 missing locales
(mai/mr/ta/te/kn/gu/bn) via Gemini 2.5 Flash on Vertex AI.

Output: src/lib/constants/panchang-auspicious-labels-overlay.json
"""
import json
import re
import subprocess
import sys
import time
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
OUT_PATH = ROOT / "src/lib/constants/panchang-auspicious-labels-overlay.json"
PROJECT = "dekhopanchang"
MODEL = "gemini-2.5-flash"
ENDPOINT = (
    f"https://us-central1-aiplatform.googleapis.com/v1/projects/"
    f"{PROJECT}/locations/us-central1/publishers/google/models/"
    f"{MODEL}:generateContent"
)

LOCALES = {
    "mai": "Maithili (Devanagari, natural Maithili register, distinct from Hindi)",
    "mr":  "Marathi (Devanagari, natural Marathi register, distinct from Hindi)",
    "ta":  "Tamil (Tamil script, canonical Vedic vocabulary: முகூர்த்தம்/பிரம்ம முகூர்த்தம்/அபிஜித் முகூர்த்தம்/அம்ருத காலம்/ராகு காலம்/யமகண்டம்/குளிக காலம்/வர்ஜ்யம்/துர் முகூர்த்தம்)",
    "te":  "Telugu (Telugu script, canonical Vedic vocabulary: ముహూర్తం/బ్రహ్మ ముహూర్తం/అభిజిత్ ముహూర్తం/అమృత కాలం/రాహుకాలం/యమగండం/గుళికాకాలం/వర్జ్యం/దుర్ ముహూర్తం)",
    "kn":  "Kannada (Kannada script, canonical Vedic vocabulary: ಮುಹೂರ್ತ/ಬ್ರಹ್ಮ ಮುಹೂರ್ತ/ಅಭಿಜಿತ್ ಮುಹೂರ್ತ/ಅಮೃತ ಕಾಲ/ರಾಹು ಕಾಲ/ಯಮಗಂಡ/ಗುಳಿಕ ಕಾಲ/ವರ್ಜ್ಯ/ದುರ್ ಮುಹೂರ್ತ)",
    "gu":  "Gujarati (Gujarati script, canonical Vedic vocabulary: મુહૂર્ત/બ્રહ્મ મુહૂર્ત/અભિજિત મુહૂર્ત/અમૃત કાળ/રાહુ કાળ/યમગંડ/ગુળિક કાળ/વર્જ્ય/દુર્ મુહૂર્ત)",
    "bn":  "Bengali (Bengali script, canonical Vedic vocabulary: মুহূর্ত/ব্রহ্ম মুহূর্ত/অভিজিত মুহূর্ত/অমৃত কাল/রাহু কাল/যমগণ্ড/গুলিক কাল/বর্জ্য/দুর্ মুহূর্ত)",
}

SOURCE_LABELS: dict[str, str] = {
    "weekday0": "Sunday", "weekday1": "Monday", "weekday2": "Tuesday",
    "weekday3": "Wednesday", "weekday4": "Thursday", "weekday5": "Friday",
    "weekday6": "Saturday",
    "h1Template": "{CITY} Auspicious & Inauspicious Timings Today — {WEEKDAY}, {DATE}",
    "introTemplate": "Today's auspicious and inauspicious time windows for {CITY} on {WEEKDAY}. Includes Abhijit Muhurta, Brahma Muhurta, Amrit Kalam, Rahu Kaal, Yamaganda, and other important muhurtas.",
    "auspiciousSectionTemplate": "Auspicious Timings ({CITY})",
    "inauspiciousSectionTemplate": "Inauspicious Periods ({CITY})",
    "colMuhurta": "Muhurta",
    "colPeriod": "Period",
    "colTime": "Time",
    "colDescription": "Description",
    "brahmaName": "Brahma Muhurta",
    "brahmaDesc": "Pre-dawn sacred period (~96 min before sunrise). Ideal for meditation, study, and spiritual practice.",
    "abhijitName": "Abhijit Muhurta",
    "abhijitDesc": "The 8th muhurta of the day — the most auspicious time window. Named after Nakshatra Abhijit (Vega). Ideal for all important activities.",
    "abhijitDescWed": "Abhijit Muhurta is NOT auspicious on Wednesdays. The 8th muhurta of the day is otherwise the most powerful auspicious window.",
    "amritKalamName": "Amrit Kalam",
    "amritKalamDesc": "Nakshatra-based nectar period — the most auspicious window of the day. Perfect for new beginnings, worship, and important decisions.",
    "amritKalamDescShort": "Nakshatra-based nectar period — the most auspicious window of the day.",
    "rahuKaalName": "Rahu Kaal",
    "rahuKaalDesc": "~90-minute inauspicious period ruled by Rahu. Avoid new ventures, travel, and important decisions.",
    "yamagandaName": "Yamaganda",
    "yamagandaDesc": "Inauspicious period ruled by Yama, lord of death. Particularly unfavourable for travel.",
    "gulikaKaalName": "Gulika Kaal",
    "gulikaKaalDesc": "Period ruled by Gulika (son of Saturn). Unfavourable for financial decisions and new beginnings.",
    "varjyamName": "Varjyam",
    "varjyamDesc": "Nakshatra-based forbidden period. Avoid all auspicious activities during this window.",
    "durMuhurtamName": "Dur Muhurtam",
    "durMuhurtamDesc": "An inauspicious muhurta. Avoid starting any new work or important activity.",
    "whatAreHeading": "What Are Auspicious & Inauspicious Timings?",
    "whatArePara": "In Vedic astrology, each day contains both auspicious and inauspicious time windows. These are calculated based on sunrise, sunset, nakshatra positions, and planetary configurations. Auspicious muhurtas like Abhijit Muhurta and Amrit Kalam are ideal for new ventures, worship, and important decisions. Inauspicious periods like Rahu Kaal, Yamaganda, and Varjyam should be avoided for initiating new activities.",
    "abhijitHeading": "Abhijit Muhurta — The Most Auspicious Time of Day",
    "abhijitPara": "Abhijit Muhurta is the 8th muhurta of the day, falling around midday. Named after the 28th nakshatra Abhijit (the star Vega), it is considered the muhurta of victory and is ideal for all auspicious activities. Note that Abhijit Muhurta is NOT considered auspicious on Wednesdays.",
    "rahuYamaGulikaHeading": "Rahu Kaal, Yamaganda & Gulika Kaal",
    "rahuYamaGulikaPara": "These three major inauspicious periods are derived by dividing the time between sunrise and sunset into 8 equal parts. Rahu Kaal is the most inauspicious — new ventures, contracts, and travel should be avoided. Yamaganda is associated with Yama (lord of death) and is particularly unfavourable for travel. Gulika Kaal is ruled by Gulika, son of Saturn. Each rotates to a different segment of the day depending on the weekday.",
    "varjyamAmritHeading": "Varjyam & Amrit Kalam",
    "varjyamAmritPara": "Varjyam and Amrit Kalam are nakshatra-based time windows. Each nakshatra has a specific ghati span that is varjya (forbidden) and one that is amrit (highly auspicious). Varjyam should be avoided for all auspicious activities, while Amrit Kalam is the most auspicious window of the day — ideal for new beginnings, worship, and important decisions.",
    "linkTodaysPanchang": "Today's Panchang",
    "linkRahuKaal": "Rahu Kaal",
    "linkChoghadiya": "Choghadiya",
    "linkHoraChart": "Hora Chart",
    "linkMuhurtaAi": "Auspicious Muhurat AI",
    "linkFestivalCalendar": "Festival Calendar",
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
        f"- Keep `{{CITY}}`, `{{WEEKDAY}}`, `{{DATE}}` placeholders EXACTLY as-is.\n"
        f"- Keep em-dashes ` — ` and tildes `~` consistent with the source.\n"
        f"- Sanskrit Jyotish terms (Muhurta/Abhijit/Brahma/Amrit Kalam/Rahu Kaal/Yamaganda/Gulika/Varjyam/Dur Muhurtam/Nakshatra/Vega/Saturn/Yama/Choghadiya/Hora/Panchang) → locale-canonical form in target script.\n"
        f"- Maithili (mai) MUST use distinct Maithili grammar (अछि/मे/सँ/क) — never pure Hindi.\n"
        f"- Marathi (mr) MUST use distinct Marathi grammar (आहे/मध्ये/चे) — never pure Hindi.\n"
        f"- Weekday names: use locale-canonical Vedic forms (Sanskrit-rooted in Devanagari/Tamil/Telugu/etc — not Latin-letter loanwords).\n\n"
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
