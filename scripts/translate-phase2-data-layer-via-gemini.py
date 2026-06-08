#!/usr/bin/env python3
"""
Phase 2 data-layer translation: PLANET_THEMES (14 keys), PLANET_REMEDIES
(14 keys), NamedWindow labels (14 keys) — extends from en/hi to all 9
locales via Gemini 2.5 Flash on Vertex AI.

Reads /tmp/phase2_jobs.json (extracted by /tmp/phase2_extract.py),
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

# Three overlay files (one per data structure)
OVERLAY_PATHS = {
    "themes": "src/lib/constants/planet-themes-overlay.json",
    "remedies": "src/lib/constants/planet-remedies-overlay.json",
    "windows": "src/lib/constants/named-window-labels-overlay.json",
}


def get_access_token() -> str:
    return subprocess.check_output(
        ["gcloud", "auth", "print-access-token"], text=True
    ).strip()


def gemini_translate_batch(token: str, locale: str, source: dict, prompt_context: str) -> dict:
    locale_desc = LOCALE_DESC[locale]
    prompt = (
        f"Translate the following English Vedic-astrology UI copy to {locale_desc}.\n\n"
        f"Context: {prompt_context}\n\n"
        "Rules:\n"
        "- Output ONLY a JSON object, no markdown fences, no commentary.\n"
        "- Keys must be identical to the input.\n"
        "- Sanskrit Jyotish terms (planet names, gemstones, mantras, deities)"
        " → locale-canonical form in the target script.\n"
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
            "maxOutputTokens": 32768,
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


CONTEXTS = {
    "themes": "Strong/weak themes per planet (1-2 sentences each, planet-influence interpretation).",
    "remedies": "Per-planet ritual remedies (gemstones, mantras, fasting, charity) with why-it-works explanations.",
    "windows": "Vedic time-window names (Rahu Kaal, Brahma Muhurta, Abhijit, Yamaganda, etc.) used as short labels on lane bars.",
}


def main() -> None:
    token = get_access_token()
    jobs = json.loads(Path("/tmp/phase2_jobs.json").read_text())

    for kind, source_pair in jobs.items():
        overlay_path = Path(OVERLAY_PATHS[kind])
        if overlay_path.exists():
            out = json.loads(overlay_path.read_text())
        else:
            out = {}
        # Pre-seed hi from extracted source
        if "hi" in source_pair and source_pair["hi"]:
            out["hi"] = source_pair["hi"]
        en_source = source_pair["en"]
        for locale in LOCALE_DESC:
            existing = out.get(locale, {})
            todo = {k: v for k, v in en_source.items() if k not in existing}
            if not todo:
                print(f"  skip {kind}/{locale}: complete")
                continue
            print(f"Translating {kind}/{locale} — {len(todo)} keys...")
            t0 = time.time()
            translated = gemini_translate_batch(token, locale, todo, CONTEXTS[kind])
            elapsed = time.time() - t0
            out.setdefault(locale, {}).update(translated)
            print(f"  done ({elapsed:.1f}s)")
            overlay_path.write_text(json.dumps(out, ensure_ascii=False, indent=2) + "\n")


if __name__ == "__main__":
    main()
