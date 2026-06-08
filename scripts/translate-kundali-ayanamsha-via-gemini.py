#!/usr/bin/env python3
"""
Translate components/kundali/AyanamshaComparison chrome + 12 cusp-life
labels to the 6 missing locales (mai/mr/ta/te/kn/gu/bn) via Gemini 2.5
Flash on Vertex AI.

Output: src/lib/constants/kundali-ayanamsha-labels-overlay.json
"""
import json
import re
import subprocess
import sys
import time
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
OUT_PATH = ROOT / "src/lib/constants/kundali-ayanamsha-labels-overlay.json"
PROJECT = "dekhopanchang"
MODEL = "gemini-2.5-flash"
ENDPOINT = (
    f"https://us-central1-aiplatform.googleapis.com/v1/projects/"
    f"{PROJECT}/locations/us-central1/publishers/google/models/"
    f"{MODEL}:generateContent"
)

LOCALES = {
    "mai": "Maithili (Devanagari, natural Maithili register)",
    "mr":  "Marathi (Devanagari, natural Marathi register)",
    "ta":  "Tamil (Tamil script, canonical Vedic vocabulary)",
    "te":  "Telugu (Telugu script, canonical Vedic vocabulary)",
    "kn":  "Kannada (Kannada script, canonical Vedic vocabulary)",
    "gu":  "Gujarati (Gujarati script, canonical Vedic vocabulary)",
    "bn":  "Bengali (Bengali script, canonical Vedic vocabulary)",
}

SOURCE_LABELS: dict[str, str] = {
    "allPlanetsSame": "✓ All planets remain in the same sign across all three ayanamsha systems",
    "chartStable": "Your chart is ayanamsha-stable  –  any system will produce the same sign-level interpretation.",
    "planetBoundariesTemplate": "⚡ {COUNT} Planets at Sign Boundaries  –  Detailed Analysis",
    "planetBoundariesTemplateSingular": "⚡ {COUNT} Planet at Sign Boundaries  –  Detailed Analysis",
    "lagnaShiftsTemplate": "Lagna Shifts: {S1} → {S2}",
    "whichAyanamshaRight": "Which Ayanamsha Is Right For You?",
    "whatConcretely": "What This Concretely Means For Your Life",
    "lagnaRowLabel": "Lagna",
    "yourChartAcross": "Your Chart Across Three Ayanamsha Systems",
    "planetColHeader": "Planet",
    "signChangesTooltip": "Sign changes across ayanamshas",
    "kpCuspalSubLords": "KP Cuspal Sub-Lords (Placidus)",
    "cuspHeader": "Cusp",
    "degreeHeader": "Degree",
    "signLordHeader": "Sign Lord",
    "starLordHeader": "Star Lord",
    "subLordHeader": "Sub Lord",
    "kpFootnote": "Computed using Krishnamurti ayanamsha and the Placidus house system",
    "amberLegend": "Amber = sign differs from Lahiri in this ayanamsha",
    "boundaryFootnote": "Planets near sign boundaries may shift signs depending on the ayanamsha. Most Vedic astrologers use Lahiri (Chitrapaksha). KP practitioners use Krishnamurti. B.V. Raman's system is popular in South India.",
    "cusp1": "Self",
    "cusp2": "Wealth",
    "cusp3": "Courage",
    "cusp4": "Home",
    "cusp5": "Children",
    "cusp6": "Health",
    "cusp7": "Marriage",
    "cusp8": "Transform",
    "cusp9": "Fortune",
    "cusp10": "Career",
    "cusp11": "Gains",
    "cusp12": "Liberation",
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
        f"- Keep `{{COUNT}}`, `{{S1}}`, `{{S2}}` placeholders EXACTLY as-is.\n"
        f"- Keep the em-dash ` – ` and the symbols ✓ ⚡ → EXACTLY as-is.\n"
        f"- Sanskrit Jyotish terms (Ayanamsha/Lahiri/Krishnamurti/Raman/Chitrapaksha/Lagna/Cusp/Placidus/Sign Lord/Star Lord/Sub Lord) → locale-canonical form.\n"
        f"- 12 cusp-life labels (cusp1..cusp12) are SHORT 1-2 word life-area labels — render concisely (max ~6 chars where the script allows).\n"
        f"- B.V. Raman is a proper name — keep transliterated or in Latin.\n\n"
        f"Input:\n"
        + json.dumps(SOURCE_LABELS, ensure_ascii=False, indent=2)
    )
    body = {
        "contents": [{"role": "user", "parts": [{"text": prompt}]}],
        "generationConfig": {
            "responseMimeType": "application/json",
            "temperature": 0.3,
            "maxOutputTokens": 16384,
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
