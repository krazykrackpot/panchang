#!/usr/bin/env python3
"""
Translate /transits chrome + title/description templates to the 6
missing locales (mai/mr/ta/te/kn/gu/bn) via Gemini 2.5 Flash on
Vertex AI.

Output: src/lib/constants/transits-labels-overlay.json
"""
import json
import re
import subprocess
import sys
import time
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
OUT_PATH = ROOT / "src/lib/constants/transits-labels-overlay.json"
PROJECT = "dekhopanchang"
MODEL = "gemini-2.5-flash"
ENDPOINT = (
    f"https://us-central1-aiplatform.googleapis.com/v1/projects/"
    f"{PROJECT}/locations/us-central1/publishers/google/models/"
    f"{MODEL}:generateContent"
)

LOCALES = {
    "mai": "Maithili (Devanagari, natural Maithili register, Sanskrit Jyotish terms in Devanagari: ग्रह/गोचर/नक्षत्र/राशि/वक्री/संक्रान्ति/नवग्रह)",
    "mr":  "Marathi (Devanagari, natural Marathi register, Sanskrit Jyotish terms in Devanagari)",
    "ta":  "Tamil (Tamil script, canonical Vedic vocabulary: கிரகம்/பெயர்ச்சி/நட்சத்திரம்/ராசி/வக்ர/சங்கராந்தி/நவகிரகம்)",
    "te":  "Telugu (Telugu script, canonical Vedic vocabulary: గ్రహం/సంచారం/నక్షత్రం/రాశి/వక్రి/సంక్రాంతి/నవగ్రహాలు)",
    "kn":  "Kannada (Kannada script, canonical Vedic vocabulary: ಗ್ರಹ/ಸಂಚಾರ/ನಕ್ಷತ್ರ/ರಾಶಿ/ವಕ್ರಿ/ಸಂಕ್ರಾಂತಿ/ನವಗ್ರಹಗಳು)",
    "gu":  "Gujarati (Gujarati script, canonical Vedic vocabulary: ગ્રહ/ગોચર/નક્ષત્ર/રાશિ/વક્રી/સંક્રાંતિ/નવગ્રહ)",
    "bn":  "Bengali (Bengali script, canonical Vedic vocabulary: গ্রহ/গোচর/নক্ষত্র/রাশি/বক্রী/সংক্রান্তি/নবগ্রহ)",
}

SOURCE_LABELS: dict[str, str] = {
    "titleTemplate": "Planet Transits Today {DATE} – Live Navagraha Positions",
    "descTemplate": "{DATE} transits: all 9 planets' current signs, nakshatras & retrograde status. Transit effects & predictions. Free, updated daily.",
    "daysLabel": "days",
    "nextMajorTransit": "Next Major Transit",
    "jupiterInHouseTemplate": "Jupiter in your {ORDINAL} house",
    "todayBadge": "TODAY",
    "sankrantiSuffix": "Sankranti",
    "jupiterVedhaTemplate": "Jupiter in {SIGN_A} is Vedha-blocked by Saturn in {SIGN_B}.",
    "ashtamaShaniTemplate": "Saturn in {SIGN} is 8th from your Moon — intense karmic pressure.",
    "sunEntersTemplate": "Sun enters 0° sidereal {SIGN}",
    "astroNewYearSuffix": "the astrological new year (Brihat Samhita)",
    "ordH1": "1st", "ordH2": "2nd", "ordH3": "3rd", "ordH4": "4th",
    "ordH5": "5th", "ordH6": "6th", "ordH7": "7th", "ordH8": "8th",
    "ordH9": "9th", "ordH10": "10th", "ordH11": "11th", "ordH12": "12th",
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
        f"- Keep `{{DATE}}`, `{{ORDINAL}}`, `{{SIGN}}`, `{{SIGN_A}}`, `{{SIGN_B}}` placeholders EXACTLY as-is — runtime substitutions.\n"
        f"- `Vedha-blocked` is a Jyotish technical term — render as `वेध` (Devanagari/IndoAryan) / `வேதம்` (Tamil — or `வேதி` if more idiomatic) / locale-canonical equivalent.\n"
        f"- `Brihat Samhita` is a proper name — keep in Latin or use the locale-canonical Sanskrit form (बृहत्संहिता/பிருஹத் சம்ஹிதா/etc).\n"
        f"- Keep the en-dash `–` and em-dashes consistent with the source.\n"
        f"- ordH1..ordH12 are house ordinals — use locale-canonical Vedic house naming where natural (e.g. mai/mr/hi: प्रथम/द्वितीय/तृतीय/चतुर्थ/पंचम/षष्ठ/सप्तम/अष्टम/नवम/दशम/एकादश/द्वादश; ta: முதலாம்/இரண்டாம்/மூன்றாம்...; te: ప్రథమ/ద్వితీయ/తృతీయ...; etc).\n"
        f"- Sanskrit Jyotish terms (Jupiter/Navagraha/Sankranti/nakshatra/retrograde/transit) → locale-canonical form in the target script.\n"
        f"- `todayBadge` is a short badge label (max ~6 chars rendered) — keep it short and uppercase if the script supports casing (otherwise just a single short word).\n\n"
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
