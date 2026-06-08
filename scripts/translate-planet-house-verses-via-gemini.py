#!/usr/bin/env python3
"""
Translate PLANET_HOUSE_VERSES (84 entries × 2 LocaleText fields each)
to the 7 visible regional locales via Gemini 2.5 Flash on Vertex AI.

Output: src/lib/constants/planet-in-house-verses-{locale}-overlay.json,
keyed by "<planetId>-<house>.<field>" (e.g. "0-1.verse",
"4-9.interpretation").

Mirrors translate-transit-articles-via-gemini.py — per-batch
persistence and parallel locales.
"""
import concurrent.futures
import json
import re
import subprocess
import sys
import time
from pathlib import Path


ROOT = Path(__file__).resolve().parent.parent
JOBS_FILE = Path("/tmp/planet-house-verses-jobs.json")
OUT_DIR = ROOT / "src/lib/constants"
PROJECT = "dekhopanchang"
MODEL = "gemini-2.5-flash"
ENDPOINT = (
    f"https://us-central1-aiplatform.googleapis.com/v1/projects/"
    f"{PROJECT}/locations/us-central1/publishers/google/models/"
    f"{MODEL}:generateContent"
)

LOCALES = {
    "ta":  "Tamil (Tamil script, classical Jyotish register. Canonical "
           "deity/planet names: சூரியன்/சந்திரன்/செவ்வாய்/புதன்/குரு/சுக்ரன்/சனி, "
           "ராசி, பாவம் (house), யோகம்.)",
    "te":  "Telugu (Telugu script, classical Jyotish register. Canonical: "
           "సూర్యుడు/చంద్రుడు/కుజుడు/బుధుడు/గురువు/శుక్రుడు/శని, రాశి, భావం, యోగం.)",
    "bn":  "Bengali (Bengali script, classical Jyotish register. Canonical: "
           "সূর্য/চন্দ্র/মঙ্গল/বুধ/বৃহস্পতি/শুক্র/শনি, রাশি, ভাব, যোগ.)",
    "gu":  "Gujarati (Gujarati script, classical Jyotish register. Canonical: "
           "સૂર્ય/ચંદ્ર/મંગળ/બુધ/ગુરુ/શુક્ર/શનિ, રાશિ, ભાવ, યોગ.)",
    "kn":  "Kannada (Kannada script, classical Jyotish register. Canonical: "
           "ಸೂರ್ಯ/ಚಂದ್ರ/ಮಂಗಳ/ಬುಧ/ಗುರು/ಶುಕ್ರ/ಶನಿ, ರಾಶಿ, ಭಾವ, ಯೋಗ.)",
    "mai": "Maithili (Devanagari script, natural Maithili register — distinct "
           "from Hindi: prefer 'अछि/भेल/किनसँ'. Keep Sanskrit Jyotish vocab "
           "in Devanagari.)",
    "mr":  "Marathi (Devanagari script, literary Marathi register. Keep "
           "Sanskrit Jyotish vocab: सूर्य/चंद्र/मंगळ/बुध/गुरू/शुक्र/शनि, राशी, "
           "भाव, योग.)",
}


def get_access_token() -> str:
    return subprocess.check_output(
        ["gcloud", "auth", "print-access-token"], text=True
    ).strip()


def gemini_translate_batch(token: str, texts: list[str], locale: str, locale_desc: str) -> list[str]:
    prompt = (
        f"You are translating Hindu Vedic-astrology planet-in-house "
        f"reference content (classical verse paraphrases from Brihat "
        f"Parashara Hora Shastra + Phaladeepika, plus modern "
        f"interpretations) to {locale_desc}.\n\n"
        f"Rules:\n"
        f"- Output ONLY the JSON object, no markdown fences, no commentary.\n"
        f"- Translate ALL English prose to natural target-language prose. "
        f"Classical verses (paraphrased) should sound classical; modern "
        f"interpretations should sound contemporary and practical.\n"
        f"- Planet names, sign names, house references: target-language "
        f"canonical transliteration. House numbers stay numeric.\n"
        f"- Preserve em-dash spacing, parentheticals.\n\n"
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
                timeout=180,
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
        except (subprocess.CalledProcessError, json.JSONDecodeError, KeyError, IndexError, RuntimeError) as e:
            if attempt == 2:
                raise
            print(f"  [{locale}] retry {attempt+1}: {str(e)[:100]}", file=sys.stderr)
            time.sleep(2 ** attempt)
    raise RuntimeError("unreachable")


def _write_overlay(locale: str, overlay: dict[str, str]) -> None:
    out_path = OUT_DIR / f"planet-in-house-verses-{locale}-overlay.json"
    merged: dict[str, str] = {}
    if out_path.exists():
        try:
            merged = json.loads(out_path.read_text())
            if not isinstance(merged, dict):
                merged = {}
        except json.JSONDecodeError:
            merged = {}
    merged.update(overlay)
    tmp = out_path.with_suffix(".json.tmp")
    tmp.write_text(json.dumps(merged, ensure_ascii=False, indent=2, sort_keys=True))
    tmp.replace(out_path)


def translate_locale(locale: str, jobs: list[dict], token: str) -> dict[str, str]:
    locale_desc = LOCALES[locale]
    out: dict[str, str] = {}
    BATCH_SIZE = 10
    PERSIST_EVERY = 5
    batches = [jobs[i:i + BATCH_SIZE] for i in range(0, len(jobs), BATCH_SIZE)]

    print(f"[{locale}] {len(jobs)} jobs in {len(batches)} batches")
    new_since_persist = 0
    for bi, batch in enumerate(batches):
        texts = [j["en"] for j in batch]
        try:
            translations = gemini_translate_batch(token, texts, locale, locale_desc)
        except Exception as e:
            print(f"  [{locale}] batch {bi+1}/{len(batches)} FAILED: {e}", file=sys.stderr)
            if new_since_persist > 0:
                _write_overlay(locale, out)
                new_since_persist = 0
            continue
        for job, t in zip(batch, translations):
            key = f"{job['key']}.{job['field']}"
            out[key] = t
        new_since_persist += len(translations)
        if (bi + 1) % PERSIST_EVERY == 0:
            _write_overlay(locale, out)
            new_since_persist = 0
        if (bi + 1) % 5 == 0 or bi + 1 == len(batches):
            print(f"  [{locale}] {bi+1}/{len(batches)} batches done ({len(out)} translations)")
    if new_since_persist > 0:
        _write_overlay(locale, out)
    return out


def main() -> int:
    if not JOBS_FILE.exists():
        print(f"jobs file missing: {JOBS_FILE}", file=sys.stderr)
        print("Run first: npx tsx scripts/extract-planet-house-verses-translation-jobs.ts > /tmp/planet-house-verses-jobs.json", file=sys.stderr)
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
        _write_overlay(locale, overlay)
        out_path = OUT_DIR / f"planet-in-house-verses-{locale}-overlay.json"
        n_total = len(json.loads(out_path.read_text())) if out_path.exists() else 0
        print(f"wrote {out_path} ({n_total} total entries, {len(overlay)} new this run)")

    return 0


if __name__ == "__main__":
    sys.exit(main())
