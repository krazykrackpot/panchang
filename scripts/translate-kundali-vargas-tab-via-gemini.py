#!/usr/bin/env python3
"""
Translate components/kundali/VargasTab chrome (~50 keys) to the 6
missing locales (mai/mr/ta/te/kn/gu/bn) via Gemini 2.5 Flash on
Vertex AI.

Output: src/lib/constants/kundali-vargas-tab-labels-overlay.json
"""
import json
import re
import subprocess
import sys
import time
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
OUT_PATH = ROOT / "src/lib/constants/kundali-vargas-tab-labels-overlay.json"
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
    "selectDivisionalChart": "Select Divisional Chart",
    "noChartData": "Divisional chart data not available for this chart.",
    "noPlanetsInHouse": "No planets in this house",
    "drekkanaFaces": "Drekkana Faces  –  Classical Image Interpretations",
    "shashtiamshaDeities": "Shashtiamsha Deities  –  Classical Segment Interpretation",
    "vimshopakaBala": "Vimshopaka Bala (All Vargas)",
    "parivartana": "Parivartana (Sign Exchanges)",
    "keyHouseLordshipTrace": "Key House Lordship Trace",
    "argalaOnKeyHouses": "Argala on Key Houses",
    "aspectsOnKeyHouses": "Aspects on Key Houses",
    "dispositorChain": "Dispositor Chain",
    "jaiminiKarakas": "Jaimini Karakas",
    "planetPlacements": "Planet Placements",
    "deepAnalysis": "Deep Analysis",
    "synthesizedPrognosis": "Synthesized Prognosis",
    "savOverlay": "SAV Overlay",
    "promise": "Promise",
    "delivery": "Delivery",
    "d1Promise": "D1 Promise",
    "exalted": "Exalted",
    "debilitatedShort": "Debil.",
    "own": "Own",
    "friend": "Friend",
    "enemy": "Enemy",
    "neutral": "Neutral",
    "vargottama": "Vargottama",
    "stable": "Stable",
    "saumya": "Saumya",
    "krura": "Krura",
    "domain": "Domain",
    "planet": "Planet",
    "sign": "Sign",
    "dignity": "Dignity",
    "badges": "Badges",
    "finalDispositor": "Final Dispositor: ",
    "supporting": "Supporting: ",
    "obstructing": "Obstructing: ",
    "noArgala": "No argala",
    "risingPrefix": "Rising: ",
    "ascendantPrefix": "Ascendant: ",
    "signPrefix": "Sign: ",
    "lordPrefix": "Lord: ",
    "planetsPrefix": "Planets: ",
    "unifiedExpression": "Unified expression",
    "strengthDeclined": "Strength declined",
    "strengthImproved": "Strength improved",
    "brief": "Brief",
    "showLess": "Show Less",
    "dashaLordInTemplate": "Dasha Lord in {CHART}",
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
        f"- Keep `{{CHART}}` placeholder EXACTLY as-is (it's a chart-id like D1/D9/D10).\n"
        f"- Keep em-dashes ` – ` consistent with the source.\n"
        f"- Keep trailing colons + spaces (e.g. 'Lord: ') consistent with the source — these are inline label prefixes.\n"
        f"- Sanskrit Jyotish terms (Drekkana/Shashtiamsha/Vimshopaka/Parivartana/Argala/Dispositor/Jaimini/Karaka/Vargottama/Saumya/Krura/SAV/Sarvashtakavarga) → locale-canonical form.\n"
        f"- Short dignity labels (Friend/Enemy/Neutral/Own/Exalted/Debil.) — render concisely (max ~6 chars where the script allows).\n"
        f"- D1/D9/D10 etc are divisional-chart names — keep Latin D-prefix (universal modern Vedic notation).\n\n"
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
