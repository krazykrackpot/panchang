#!/usr/bin/env python3
"""
Translate NAKSHATRA_PADA_PROFILES (108 padas × 4 LocaleText fields) to
the 7 visible regional locales via Gemini 2.5 Flash on Vertex AI.

Output: src/lib/constants/nakshatra-pada-profiles-{locale}-overlay.json,
keyed by "<nakshatraId>-<pada>.<field>" (e.g. "1-1.personality").

Incorporates lessons from PR #550 Gemini review:
- maxOutputTokens 8192 (Vertex cap)
- mkdir BEFORE thread pool to avoid race with per-batch persistence
- guard against empty target_locales (ThreadPoolExecutor(0) raises)
- explicit encoding="utf-8" on all Path I/O
"""
import concurrent.futures
import json
import re
import subprocess
import sys
import time
from pathlib import Path


ROOT = Path(__file__).resolve().parent.parent
JOBS_FILE = Path("/tmp/nakshatra-pada-jobs.json")
OUT_DIR = ROOT / "src/lib/constants"
PROJECT = "dekhopanchang"
MODEL = "gemini-2.5-flash"
ENDPOINT = (
    f"https://us-central1-aiplatform.googleapis.com/v1/projects/"
    f"{PROJECT}/locations/us-central1/publishers/google/models/"
    f"{MODEL}:generateContent"
)

LOCALES = {
    "ta":  "Tamil (Tamil script, classical Jyotish register. Canonical: "
           "27 நட்சத்திரங்கள் / நவாம்சம் / பாதம் / ராசி / பாவம்.)",
    "te":  "Telugu (Telugu script, classical Jyotish register. Canonical: "
           "27 నక్షత్రాలు / నవాంశ / పాదం / రాశి / భావం.)",
    "bn":  "Bengali (Bengali script, classical Jyotish register. Canonical: "
           "২৭ নক্ষত্র / নবাংশ / পাদ / রাশি / ভাব.)",
    "gu":  "Gujarati (Gujarati script, classical Jyotish register. Canonical: "
           "27 નક્ષત્ર / નવાંશ / પાદ / રાશિ / ભાવ.)",
    "kn":  "Kannada (Kannada script, classical Jyotish register. Canonical: "
           "27 ನಕ್ಷತ್ರಗಳು / ನವಾಂಶ / ಪಾದ / ರಾಶಿ / ಭಾವ.)",
    "mai": "Maithili (Devanagari script, natural Maithili register — distinct "
           "from Hindi: prefer 'अछि/भेल/किनसँ'. Keep Sanskrit Jyotish vocab "
           "in Devanagari: नक्षत्र, पाद, राशि, भाव, नवांश.)",
    "mr":  "Marathi (Devanagari script, literary Marathi register. Keep "
           "Sanskrit Jyotish vocab: नक्षत्र, पाद, राशी, भाव, नवांश.)",
}


def get_access_token() -> str:
    return subprocess.check_output(
        ["gcloud", "auth", "print-access-token"], text=True
    ).strip()


def gemini_translate_batch(token: str, texts: list[str], locale: str, locale_desc: str) -> list[str]:
    prompt = (
        f"You are translating Hindu Vedic-astrology nakshatra-pada "
        f"profile content (personality / career / relationships / "
        f"health for one of the 108 padas) to {locale_desc}.\n\n"
        f"Rules:\n"
        f"- Output ONLY the JSON object, no markdown fences, no commentary.\n"
        f"- Translate ALL English prose to natural target-language prose. "
        f"Personality/career/relationships/health snippets should read as "
        f"crisp, practical advisory — not literal English-to-target.\n"
        f"- Nakshatra names, navamsha-sign names, deity names: target-language "
        f"canonical transliteration in the target script.\n"
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
            "maxOutputTokens": 8192,
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
    out_path = OUT_DIR / f"nakshatra-pada-profiles-{locale}-overlay.json"
    merged: dict[str, str] = {}
    if out_path.exists():
        try:
            merged = json.loads(out_path.read_text(encoding="utf-8"))
            if not isinstance(merged, dict):
                merged = {}
        except json.JSONDecodeError:
            merged = {}
    merged.update(overlay)
    tmp = out_path.with_suffix(".json.tmp")
    tmp.write_text(
        json.dumps(merged, ensure_ascii=False, indent=2, sort_keys=True),
        encoding="utf-8",
    )
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
        if (bi + 1) % 10 == 0 or bi + 1 == len(batches):
            print(f"  [{locale}] {bi+1}/{len(batches)} batches done ({len(out)} translations)")
    if new_since_persist > 0:
        _write_overlay(locale, out)
    return out


def main() -> int:
    if not JOBS_FILE.exists():
        print(f"jobs file missing: {JOBS_FILE}", file=sys.stderr)
        print("Run first: npx tsx scripts/extract-nakshatra-pada-translation-jobs.ts > /tmp/nakshatra-pada-jobs.json", file=sys.stderr)
        return 1

    jobs_data = json.loads(JOBS_FILE.read_text(encoding="utf-8"))
    print(f"Total jobs: {jobs_data['total']}")
    print(f"By locale: {jobs_data['by_locale']}")

    token = get_access_token()
    print(f"ADC token: {token[:20]}...")

    target_locales = [l for l in LOCALES if jobs_data["by_locale"].get(l, 0) > 0]
    if not target_locales:
        print("No translation jobs — every locale is already up to date.")
        return 0
    print(f"Translating {len(target_locales)} locales in parallel: {target_locales}")

    OUT_DIR.mkdir(parents=True, exist_ok=True)

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

    for locale, overlay in results.items():
        out_path = OUT_DIR / f"nakshatra-pada-profiles-{locale}-overlay.json"
        n_total = len(json.loads(out_path.read_text(encoding="utf-8"))) if out_path.exists() else 0
        print(f"wrote {out_path} ({n_total} total entries, {len(overlay)} new this run)")

    return 0


if __name__ == "__main__":
    sys.exit(main())
