#!/usr/bin/env python3
"""
Phase 3 data-layer translation: HOUSE_SIGNIFICATIONS (24 keys),
COMMON_YOGA_REMEDIES (10 keys), RAHU_KETU_FORECAST (2 keys),
PLANET_DASHA_FORECAST (28 keys). Total 64 keys × 7 missing locales
= 448 strings.

Reads /tmp/phase3_jobs.json (extracted by /tmp/phase3_extract.py),
writes per-data-structure overlay JSONs under src/lib/constants/.
"""
import json
import re
import subprocess
import sys
import time
from pathlib import Path

PROJECT = "dekhopanchang"
MODEL = "gemini-2.5-flash"
ENDPOINT = (
    f"https://us-central1-aiplatform.googleapis.com/v1/projects/"
    f"{PROJECT}/locations/us-central1/publishers/google/models/"
    f"{MODEL}:generateContent"
)

LOCALE_DESC = {
    "mai": "Maithili (Devanagari, distinct from Hindi: अछि/मे/सँ — never use Hindi verb endings)",
    "mr":  "Marathi (Devanagari, distinct from Hindi: आहे/मध्ये/चे — never use Hindi)",
    "ta":  "Tamil (Tamil script, canonical Vedic vocabulary)",
    "te":  "Telugu (Telugu script, canonical Vedic vocabulary)",
    "kn":  "Kannada (Kannada script, canonical Vedic vocabulary)",
    "gu":  "Gujarati (Gujarati script, canonical Vedic vocabulary)",
    "bn":  "Bengali (Bengali script, canonical Vedic vocabulary)",
}

OVERLAY_PATHS = {
    "houses":              "src/lib/constants/house-significations-overlay.json",
    "yoga_remedies":       "src/lib/constants/common-yoga-remedies-overlay.json",
    "rahu_ketu_forecast":  "src/lib/constants/rahu-ketu-forecast-overlay.json",
    "dasha_forecast":      "src/lib/constants/planet-dasha-forecast-overlay.json",
}

CONTEXTS = {
    "houses":             "12 Vedic-astrology houses — short significations (life areas) and short remedy prescriptions.",
    "yoga_remedies":      "Per-yoga issue summary and ritual remedy (gemstone / mantra / charity).",
    "rahu_ketu_forecast": "Mahadasha forecast for Rahu and Ketu — 1-2 sentence prose summarising the period.",
    "dasha_forecast":     "Per-planet Mahadasha prose by strength band (strong/adequate/weak/action). 1-2 sentences each.",
}


def get_access_token() -> str:
    return subprocess.check_output(
        ["gcloud", "auth", "print-access-token"], text=True
    ).strip()


def gemini_translate_batch(token: str, locale: str, source: dict, ctx: str) -> dict:
    locale_desc = LOCALE_DESC[locale]
    prompt = (
        f"Translate the following English Vedic-astrology UI copy to {locale_desc}.\n\n"
        f"Context: {ctx}\n\n"
        "Rules:\n"
        "- Output ONLY a JSON object, no markdown fences, no commentary.\n"
        "- Keys must be identical to the input.\n"
        "- Sanskrit Jyotish terms (graha/dasha/yoga/mantra/gem names) →"
        " locale-canonical form in the target script.\n"
        "- Maithili (mai) MUST use distinct Maithili grammar — never pure Hindi.\n"
        "- Marathi (mr) MUST use distinct Marathi grammar — never pure Hindi.\n\n"
        "Input:\n"
        + json.dumps(source, ensure_ascii=False, indent=2)
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
            "--max-time", "600",
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
    jobs = json.loads(Path("/tmp/phase3_jobs.json").read_text())

    for kind, source_pair in jobs.items():
        overlay_path = Path(OVERLAY_PATHS[kind])
        out = json.loads(overlay_path.read_text()) if overlay_path.exists() else {}
        if "hi" in source_pair and source_pair["hi"]:
            out["hi"] = source_pair["hi"]
        en_source = source_pair["en"]
        for locale in LOCALE_DESC:
            existing = out.get(locale, {})
            todo = {k: v for k, v in en_source.items() if k not in existing}
            if not todo:
                print(f"  skip {kind}/{locale}: complete")
                continue
            print(f"Translating {kind}/{locale} — {len(todo)} keys...", flush=True)
            t0 = time.time()
            translated = gemini_translate_batch(token, locale, todo, CONTEXTS[kind])
            elapsed = time.time() - t0
            out.setdefault(locale, {}).update(translated)
            print(f"  done ({elapsed:.1f}s)", flush=True)
            overlay_path.write_text(json.dumps(out, ensure_ascii=False, indent=2) + "\n")


if __name__ == "__main__":
    main()
