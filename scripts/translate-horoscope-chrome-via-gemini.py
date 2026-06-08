#!/usr/bin/env python3
"""
Translate /horoscope/[rashi] CHROME (H1/desc templates, period tabs,
area labels, festivals headings, HubClient labels, RashiArticle H2) to
the 6 missing locales via Gemini 2.5 Flash on Vertex AI.

Distinct from translate-horoscope-via-gemini.py which targets the
editorial content (rashi-editorial.ts + templates.ts).

Output: src/lib/constants/horoscope-labels-overlay.json
"""
import json
import re
import subprocess
import sys
import time
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
OUT_PATH = ROOT / "src/lib/constants/horoscope-labels-overlay.json"
PROJECT = "dekhopanchang"
MODEL = "gemini-2.5-flash"
ENDPOINT = (
    f"https://us-central1-aiplatform.googleapis.com/v1/projects/"
    f"{PROJECT}/locations/us-central1/publishers/google/models/"
    f"{MODEL}:generateContent"
)

LOCALES = {
    "mai": "Maithili (Devanagari, natural Maithili register: अछि/मे/सँ. 'राशिफल' is the canonical term.)",
    "mr":  "Marathi (Devanagari, natural Marathi register: आहे/मध्ये/चे. Marathi spells it 'राशीभविष्य' or 'राशीफळ' — use whichever is more natural; AVOID Hindi 'राशिफल' on /mr/ pages.)",
    "ta":  "Tamil (Tamil script, canonical: ராசிபலன், ராசி, கிரகம், விரதம், பஞ்சாங்கம், திதி)",
    "te":  "Telugu (Telugu script, canonical: రాశిఫలం, రాశి, గ్రహం, వ్రతం, పంచాంగం, తిథి)",
    "kn":  "Kannada (Kannada script, canonical: ರಾಶಿಫಲ, ರಾಶಿ, ಗ್ರಹ, ವ್ರತ, ಪಂಚಾಂಗ, ತಿಥಿ)",
    "gu":  "Gujarati (Gujarati script, canonical: રાશિફળ, રાશિ, ગ્રહ, વ્રત, પંચાંગ, તિથિ)",
    "bn":  "Bengali (Bengali script, canonical: রাশিফল, রাশি, গ্রহ, ব্রত, পঞ্জিকা, তিথি)",
}

SOURCE_LABELS: dict[str, str] = {
    "weeklyH1Template": "{NAME} ({WESTERN_NAME}) Weekly Horoscope  –  {RANGE}",
    "weeklyDescTemplate": "{WESTERN_NAME} ({NAME}) weekly horoscope for {RANGE}. Day-by-day scores, career, love, health and finance predictions based on actual Vedic planetary transits.",
    "monthlyH1Template": "{NAME} ({WESTERN_NAME}) Monthly Horoscope  –  {MONTH}",
    "monthlyDescTemplate": "{WESTERN_NAME} ({NAME}) monthly horoscope for {MONTH}. Calendar heatmap, career, love, health and finance predictions based on actual Vedic planetary transits.",
    "dailyDateH1Template": "{NAME} ({WESTERN_NAME}) Horoscope  –  {WEEKDAY}, {DATE}",
    "overallScoreTemplate": "Overall score: {SCORE}/10",
    "areaCareer": "Career",
    "areaLove": "Love",
    "areaHealth": "Health",
    "areaFinance": "Finance",
    "areaSpirituality": "Spirituality",
    "tabDaily": "Daily",
    "tabWeekly": "Weekly",
    "tabMonthly": "Monthly",
    "tabDasha": "Dasha",
    "featuredSignOfTheDay": "Featured Sign of the Day",
    "me": "Me",
    "noStandoutStrongDays": "No standout strong days",
    "noChallengingDays": "No especially challenging days",
    "festivalsThisWeek": "Festivals & Vrats This Week",
    "festivalsThisMonth": "Festivals & Vrats This Month",
    "signUpFree": "Sign Up Free",
    "aboutRashiTemplate": "About {WESTERN_NAME} ({NAME})  –  Personality & Traits",
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
        f"- Keep `{{NAME}}`, `{{WESTERN_NAME}}`, `{{RANGE}}`, `{{MONTH}}`, `{{WEEKDAY}}`, `{{DATE}}`, `{{SCORE}}` placeholders EXACTLY as-is.\n"
        f"- Keep em-dash ` – ` consistent with the source.\n"
        f"- Sanskrit Jyotish terms (Horoscope/Rashi/Dasha/Vrat/Panchang) → locale-canonical form.\n"
        f"- 5 area labels (Career/Love/Health/Finance/Spirituality) — render concisely (1 word where possible).\n"
        f"- 4 period-tab labels (Daily/Weekly/Monthly/Dasha) — short, sentence-case.\n"
        f"- For H1 templates: in Hindi/Marathi/Maithili the H1 reads naturally WITHOUT the parenthetical English name. The English-language template keeps both.\n"
        f"- Maithili (mai) MUST use distinct Maithili grammar — never pure Hindi.\n"
        f"- Marathi (mr) MUST spell 'राशीभविष्य' or 'राशीफळ' (with ी), NEVER Hindi 'राशिफल' (with ि).\n\n"
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
