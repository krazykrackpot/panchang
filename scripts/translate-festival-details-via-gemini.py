#!/usr/bin/env python3
"""
Translate FESTIVAL_DETAILS + CATEGORY_DETAILS (festival-details.ts) to the
8 missing/partial locales via Gemini 2.5 Flash on Vertex AI.

The corpus is 81 slugs × ~6 fields × ~7 locales = ~2,300 jobs. Output is
per-locale overlay JSON files at:

  src/lib/constants/festival-details-{locale}-overlay.json
  keyed by "<slug>.<field>" → translated text

The TS file stays the canonical source for EN + already-filled locales.
A runtime merger (festival-details-with-overlay.ts) attaches overlays
to FESTIVAL_DETAILS / CATEGORY_DETAILS at module load.

Why a separate script per corpus (matches translate-matching /
horoscope / devotional / gauri / baby-names pattern):
- Each corpus has its own structural quirks (LocaleText vs nested
  shape) that one generic pipeline would have to encode anyway
- Prompt text is corpus-specific (festival-context vs compatibility-
  context affects translation register / Jyotish vocabulary)
- Each run is idempotent — re-running fills only the empty cells

Run:
  npx tsx scripts/extract-festival-translation-jobs.ts > /tmp/festival-jobs.json
  python3 scripts/translate-festival-details-via-gemini.py
"""
import concurrent.futures
import json
import os
import re
import subprocess
import sys
import time
from pathlib import Path


ROOT = Path(__file__).resolve().parent.parent
JOBS_FILE = Path("/tmp/festival-jobs.json")
OUT_DIR = ROOT / "src/lib/constants"
PROJECT = "dekhopanchang"
MODEL = "gemini-2.5-flash"
ENDPOINT = (
    f"https://us-central1-aiplatform.googleapis.com/v1/projects/"
    f"{PROJECT}/locations/us-central1/publishers/google/models/"
    f"{MODEL}:generateContent"
)

# Per-locale translation register notes for the Gemini prompt.
# Same shape as translate-devotional-via-gemini.py / matching.
LOCALES = {
    "ta":  "Tamil (Tamil script, natural Tamil register, use canonical Tamil "
           "Jyotish/festival vocabulary: விஷ்ணு/சிவன்/லட்சுமி, மகர சங்கராந்தி, "
           "பௌர்ணமி/அமாவாசை, மஹா சிவராத்திரி, etc.)",
    "te":  "Telugu (Telugu script, natural Telugu register, canonical Telugu "
           "Jyotish/festival vocabulary: విష్ణు/శివుడు/లక్ష్మి, మకర సంక్రాంతి, "
           "పౌర్ణమి/అమావాస్య, మహా శివరాత్రి, etc.)",
    "bn":  "Bengali (Bengali script, natural Bengali register, canonical Bengali "
           "festival vocabulary: বিষ্ণু/শিব/লক্ষ্মী, মকর সংক্রান্তি, "
           "পূর্ণিমা/অমাবস্যা, মহা শিবরাত্রি, etc.)",
    "gu":  "Gujarati (Gujarati script, natural Gujarati register, canonical "
           "Gujarati festival vocabulary: વિષ્ણુ/શિવ/લક્ષ્મી, મકર સંક્રાંતિ, "
           "પૂર્ણિમા/અમાવસ્યા, મહા શિવરાત્રિ, etc.)",
    "kn":  "Kannada (Kannada script, natural Kannada register, canonical "
           "Kannada festival vocabulary: ವಿಷ್ಣು/ಶಿವ/ಲಕ್ಷ್ಮಿ, ಮಕರ ಸಂಕ್ರಾಂತಿ, "
           "ಪೂರ್ಣಿಮಾ/ಅಮಾವಾಸ್ಯೆ, ಮಹಾ ಶಿವರಾತ್ರಿ, etc.)",
    "mai": "Maithili (Devanagari script, natural Maithili register — note "
           "Maithili differs from Hindi: prefer 'अछि/भेल' over 'है/हुआ', "
           "'किनसँ' over 'किसी से', retain Sanskrit Jyotish/devotional "
           "terms in Devanagari)",
    "mr":  "Marathi (Devanagari script, natural Marathi register, retain "
           "Sanskrit Jyotish terms in Devanagari)",
    "sa":  "Sanskrit (Devanagari script, classical Sanskrit register, "
           "appropriate for traditional Jyotish/Dharma texts)",
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
    """
    Translate a batch of texts to a locale. Returns translations in the
    same order. Uses Gemini structured JSON output to keep keys aligned.
    """
    prompt = (
        f"You are translating Hindu/Jyotish festival reference content "
        f"to {locale_desc}.\n\n"
        f"Rules:\n"
        f"- Output ONLY the JSON object, no markdown fences, no commentary.\n"
        f"- Translate ALL English prose. Keep proper nouns transliterated to "
        f"the target script (Vishnu → विष्णु / விஷ்ணு / etc.).\n"
        f"- Festival names (Diwali, Makar Sankranti, Maha Shivaratri, …) "
        f"use the locale's canonical name, not Roman.\n"
        f"- Tithi/nakshatra/yoga/karana names use the locale's canonical "
        f"Sanskrit-rooted form in the locale's script.\n"
        f"- Preserve em-dash spacing and parenthetical structures.\n"
        f"- Natural target-language sentence flow — not word-for-word.\n\n"
        f"Input is a JSON object with numeric keys mapping to English text. "
        f"Output a JSON object with the SAME numeric keys mapping to "
        f"translations.\n\n"
        f"Input:\n"
        + json.dumps({str(i): t for i, t in enumerate(texts)}, ensure_ascii=False, indent=2)
    )
    body = {
        "contents": [{"role": "user", "parts": [{"text": prompt}]}],
        "generationConfig": {
            "responseMimeType": "application/json",
            "temperature": 0.3,
            "maxOutputTokens": 65536,
        },
    }
    for attempt in range(3):
        try:
            proc = subprocess.run(
                [
                    "curl", "-s", "-f", "-X", "POST",
                    "-H", f"Authorization: Bearer {token}",
                    "-H", "Content-Type: application/json",
                    ENDPOINT, "-d",
                    json.dumps(body, ensure_ascii=False),
                ],
                capture_output=True, text=True, check=True,
                timeout=120,
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
            # Order by numeric key, return list
            return [parsed[str(i)] for i in range(len(texts))]
        except (subprocess.CalledProcessError, json.JSONDecodeError, KeyError, IndexError, RuntimeError) as e:
            # IndexError covers `candidates[0]` when Gemini returns an
            # empty candidates list (safety blocks, transient API issues).
            # Without it the retry loop silently aborted the batch on
            # the first failure. Gemini PR #511.
            if attempt == 2:
                raise
            print(f"  [{locale}] retry {attempt+1}: {str(e)[:100]}", file=sys.stderr)
            time.sleep(2 ** attempt)
    raise RuntimeError("unreachable")


def translate_locale(locale: str, jobs: list[dict], token: str) -> dict[str, str]:
    """Translate all jobs for one locale, return key→translation map."""
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
            print(f"  [{locale}] batch {bi+1}/{len(batches)} FAILED: {e}", file=sys.stderr)
            continue
        for job, t in zip(batch, translations):
            key = f"{job['slug']}.{job['field']}"
            out[key] = t
        if (bi + 1) % 5 == 0 or bi + 1 == len(batches):
            print(f"  [{locale}] {bi+1}/{len(batches)} batches done ({len(out)} translations)")
    return out


def main() -> int:
    if not JOBS_FILE.exists():
        print(f"jobs file missing: {JOBS_FILE}", file=sys.stderr)
        print("Run first: npx tsx scripts/extract-festival-translation-jobs.ts > /tmp/festival-jobs.json", file=sys.stderr)
        return 1

    jobs_data = json.loads(JOBS_FILE.read_text())
    print(f"Total jobs: {jobs_data['total']}")
    print(f"By locale: {jobs_data['by_locale']}")

    token = get_access_token()
    print(f"ADC token: {token[:20]}...")

    # Run all locales in parallel — independent Gemini calls, network-bound
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

    # Write overlays — MERGE with any existing file so a partial re-run
    # (e.g. to fill batches that failed last time) doesn't clobber the
    # already-good translations. Gemini PR #511 round-2.
    OUT_DIR.mkdir(parents=True, exist_ok=True)
    for locale, overlay in results.items():
        out_path = OUT_DIR / f"festival-details-{locale}-overlay.json"
        merged: dict[str, str] = {}
        if out_path.exists():
            try:
                merged = json.loads(out_path.read_text())
                if not isinstance(merged, dict):
                    merged = {}
            except json.JSONDecodeError:
                # Corrupt existing — start from this run only.
                merged = {}
        merged.update(overlay)  # new translations win on conflict (re-running re-translates)
        out_path.write_text(json.dumps(merged, ensure_ascii=False, indent=2, sort_keys=True))
        print(f"wrote {out_path} ({len(merged)} total entries, {len(overlay)} new this run)")

    return 0


if __name__ == "__main__":
    sys.exit(main())
