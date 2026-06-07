#!/usr/bin/env python3
"""
Translate MUHURTA_TYPES LocaleText fields (name/subtitle/description) to
the 7 missing locales via Gemini 2.5 Flash on Vertex AI. Mirror of
translate-festival-details-via-gemini.py.

Corpus is 10 types × 3 fields × 7 locales = 210 jobs. Output:
  src/lib/constants/muhurta-{locale}-overlay.json
  keyed by "<slug>.<field>" → translated text.

Run:
  npx tsx scripts/extract-muhurta-translation-jobs.ts > /tmp/muhurta-jobs.json
  python3 scripts/translate-muhurta-via-gemini.py
"""
import concurrent.futures
import json
import re
import subprocess
import sys
import time
from pathlib import Path


ROOT = Path(__file__).resolve().parent.parent
JOBS_FILE = Path("/tmp/muhurta-jobs.json")
OUT_DIR = ROOT / "src/lib/constants"
PROJECT = "dekhopanchang"
MODEL = "gemini-2.5-flash"
ENDPOINT = (
    f"https://us-central1-aiplatform.googleapis.com/v1/projects/"
    f"{PROJECT}/locations/us-central1/publishers/google/models/"
    f"{MODEL}:generateContent"
)

LOCALES = {
    "ta":  "Tamil (Tamil script, natural Tamil register, canonical Tamil "
           "muhurta/Jyotish vocabulary: திருமணம், கிரஹப்பிரவேசம், "
           "சுப முகூர்த்தம், etc.)",
    "te":  "Telugu (Telugu script, natural Telugu register, canonical Telugu "
           "muhurta/Jyotish vocabulary: వివాహం, గృహప్రవేశం, శుభ ముహూర్తం, etc.)",
    "bn":  "Bengali (Bengali script, natural Bengali register, canonical Bengali "
           "muhurta vocabulary: বিবাহ, গৃহপ্রবেশ, শুভ মুহূর্ত, etc.)",
    "gu":  "Gujarati (Gujarati script, natural Gujarati register, canonical "
           "Gujarati muhurta vocabulary: લગ્ન, ગૃહપ્રવેશ, શુભ મુહૂર્ત, etc.)",
    "kn":  "Kannada (Kannada script, natural Kannada register, canonical "
           "Kannada muhurta vocabulary: ವಿವಾಹ, ಗೃಹಪ್ರವೇಶ, ಶುಭ ಮುಹೂರ್ತ, etc.)",
    "mai": "Maithili (Devanagari script, natural Maithili register, retain "
           "Sanskrit muhurta terms in Devanagari)",
    "mr":  "Marathi (Devanagari script, natural Marathi register, retain "
           "Sanskrit muhurta terms in Devanagari)",
}


def get_access_token() -> str:
    return subprocess.check_output(
        ["gcloud", "auth", "print-access-token"], text=True
    ).strip()


def gemini_translate_batch(
    token: str,
    texts: list[str],
    locale: str,
    locale_desc: str,
) -> list[str]:
    prompt = (
        f"You are translating Vedic muhurta (auspicious-timing) UI copy "
        f"to {locale_desc}.\n\n"
        f"Rules:\n"
        f"- Output ONLY the JSON object, no markdown fences, no commentary.\n"
        f"- Translate ALL English prose. Keep canonical Sanskrit/Jyotish "
        f"terms in the target script (Muhurat → मुहूर्त / முகூர்த்தம் / etc.).\n"
        f"- Marriage/Wedding/Griha Pravesh/Mundan/Vehicle/Travel/Business "
        f"use locale-native terms where they exist.\n"
        f"- Concise — these are titles/subtitles/short descriptions, not paragraphs.\n\n"
        f"Input is a JSON object with numeric keys mapping to English text. "
        f"Output a JSON object with the SAME numeric keys mapping to translations.\n\n"
        f"Input:\n"
        + json.dumps({str(i): t for i, t in enumerate(texts)}, ensure_ascii=False, indent=2)
    )
    body = {
        "contents": [{"role": "user", "parts": [{"text": prompt}]}],
        "generationConfig": {
            "responseMimeType": "application/json",
            "temperature": 0.3,
            "maxOutputTokens": 16384,
        },
    }
    for attempt in range(3):
        try:
            proc = subprocess.run(
                ["curl", "-s", "-f", "-X", "POST",
                 "-H", f"Authorization: Bearer {token}",
                 "-H", "Content-Type: application/json",
                 ENDPOINT, "-d",
                 json.dumps(body, ensure_ascii=False)],
                capture_output=True, text=True, check=True, timeout=60,
            )
            raw = json.loads(proc.stdout)
            if "candidates" not in raw:
                raise RuntimeError(f"no candidates: {json.dumps(raw)[:300]}")
            text = raw["candidates"][0]["content"]["parts"][0]["text"]
            try:
                parsed = json.loads(text)
            except json.JSONDecodeError:
                text = re.sub(r"^```(?:json)?\n?|\n?```$", "", text.strip(), flags=re.MULTILINE)
                parsed = json.loads(text)
            return [parsed[str(i)] for i in range(len(texts))]
        except (subprocess.CalledProcessError, json.JSONDecodeError, KeyError, RuntimeError) as e:
            if attempt == 2:
                raise
            print(f"  [{locale}] retry {attempt+1}: {str(e)[:100]}", file=sys.stderr)
            time.sleep(2 ** attempt)
    raise RuntimeError("unreachable")


def translate_locale(locale: str, jobs: list[dict], token: str) -> dict[str, str]:
    locale_desc = LOCALES[locale]
    out: dict[str, str] = {}
    BATCH_SIZE = 10
    batches = [jobs[i:i + BATCH_SIZE] for i in range(0, len(jobs), BATCH_SIZE)]
    print(f"[{locale}] {len(jobs)} jobs in {len(batches)} batches")
    for bi, batch in enumerate(batches):
        texts = [j["en"] for j in batch]
        try:
            translations = gemini_translate_batch(token, texts, locale, locale_desc)
        except Exception as e:
            print(f"  [{locale}] batch {bi+1} FAILED: {e}", file=sys.stderr)
            continue
        for job, t in zip(batch, translations):
            key = f"{job['slug']}.{job['field']}"
            out[key] = t
    return out


def main() -> int:
    if not JOBS_FILE.exists():
        print(f"jobs file missing: {JOBS_FILE}", file=sys.stderr)
        return 1
    jobs_data = json.loads(JOBS_FILE.read_text())
    print(f"Total jobs: {jobs_data['total']}")
    print(f"By locale: {jobs_data['by_locale']}")

    token = get_access_token()
    print(f"ADC token: {token[:20]}...")

    target_locales = [l for l in LOCALES if jobs_data["by_locale"].get(l, 0) > 0]
    print(f"Translating {len(target_locales)} locales in parallel: {target_locales}")

    results: dict[str, dict[str, str]] = {}
    with concurrent.futures.ThreadPoolExecutor(max_workers=len(target_locales)) as ex:
        futures = {
            ex.submit(translate_locale, l, jobs_data["jobs"][l], token): l
            for l in target_locales
        }
        for fut in concurrent.futures.as_completed(futures):
            locale = futures[fut]
            try:
                results[locale] = fut.result()
                print(f"[{locale}] DONE — {len(results[locale])} translations")
            except Exception as e:
                print(f"[{locale}] FAILED: {e}", file=sys.stderr)

    OUT_DIR.mkdir(parents=True, exist_ok=True)
    for locale, overlay in results.items():
        out_path = OUT_DIR / f"muhurta-{locale}-overlay.json"
        out_path.write_text(json.dumps(overlay, ensure_ascii=False, indent=2, sort_keys=True))
        print(f"wrote {out_path} ({len(overlay)} entries)")
    return 0


if __name__ == "__main__":
    sys.exit(main())
