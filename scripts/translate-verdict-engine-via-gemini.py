#!/usr/bin/env python3
"""
Verdict-engine block-name translation: 22 BLOCK_DEFINITIONS + 3 dynamic
activity-template strings. Total 25 keys × 7 missing locales = 175
strings. Reads /tmp/phase4_jobs.json, writes per-structure overlays
under src/lib/constants/.
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
    "mai": "Maithili (Devanagari, distinct from Hindi: अछि/मे/सँ — never use Hindi)",
    "mr":  "Marathi (Devanagari, distinct from Hindi: आहे/मध्ये/चे — never use Hindi)",
    "ta":  "Tamil (Tamil script, canonical Vedic vocabulary)",
    "te":  "Telugu (Telugu script, canonical Vedic vocabulary)",
    "kn":  "Kannada (Kannada script, canonical Vedic vocabulary)",
    "gu":  "Gujarati (Gujarati script, canonical Vedic vocabulary)",
    "bn":  "Bengali (Bengali script, canonical Vedic vocabulary)",
}

OVERLAY_PATHS = {
    "block_names":         "src/lib/constants/verdict-block-names-overlay.json",
    "activity_templates":  "src/lib/constants/verdict-activity-templates-overlay.json",
}

CONTEXTS = {
    "block_names": "Short labels for muhurta verdict blocks (Vedic timing factors — yogas, doshas, nakshatra/tithi quality flags). Used on small lane bars / chips; keep short.",
    "activity_templates": "Templates for 'X unsuitable for {ACTIVITY}' messages. KEEP the literal token {ACTIVITY} unchanged in the translated string — it is substituted at runtime.",
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
        "- Sanskrit Jyotish proper nouns (Vyatipata, Rahu Kaal, Yamaganda, Gulika,"
        " Varjyam, Vishti, Durmuhurta, Abhijit, Amrit Siddhi, Sarvartha Siddhi,"
        " Guru Pushya, Ravi Pushya, Brahma Muhurta, Siddha Yoga, Vijaya Muhurta,"
        " Godhuli) → locale-canonical form in target script.\n"
        "- Maithili (mai) MUST use distinct Maithili grammar — never pure Hindi.\n"
        "- Marathi (mr) MUST use distinct Marathi grammar — never pure Hindi.\n"
        "- {ACTIVITY} placeholders MUST appear verbatim in the output.\n\n"
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


def main() -> None:
    token = get_access_token()
    jobs = json.loads(Path("/tmp/phase4_jobs.json").read_text())

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
