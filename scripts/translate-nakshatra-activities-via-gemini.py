#!/usr/bin/env python3
"""
Translate NAKSHATRA_ACTIVITIES (27 nakshatras × theme + goodFor[] + avoidFor[]
LocaleText fields) to the 7 visible regional locales via Gemini 2.5 Flash
on Vertex AI.

Output: src/lib/constants/nakshatra-activities-{locale}-overlay.json,
keyed by "<nakshatraId>.theme" / "<nakshatraId>.goodFor[N]" / etc.

Inherits all PR #550 review fixes (8192 token cap, mkdir before threads,
empty-target guard, utf-8 encoding everywhere).
"""
import concurrent.futures
import json
import re
import subprocess
import sys
import time
from pathlib import Path


ROOT = Path(__file__).resolve().parent.parent
JOBS_FILE = Path("/tmp/nakshatra-activities-jobs.json")
OUT_DIR = ROOT / "src/lib/constants"
PROJECT = "dekhopanchang"
MODEL = "gemini-2.5-flash"
ENDPOINT = (
    f"https://us-central1-aiplatform.googleapis.com/v1/projects/"
    f"{PROJECT}/locations/us-central1/publishers/google/models/"
    f"{MODEL}:generateContent"
)

LOCALES = {
    "ta":  "Tamil (Tamil script. Compact activity-label register for "
           "panchang muhurta UI: short 1-5 word labels.)",
    "te":  "Telugu (Telugu script. Compact panchang activity register.)",
    "bn":  "Bengali (Bengali script. Compact panchang activity register.)",
    "gu":  "Gujarati (Gujarati script. Compact panchang activity register.)",
    "kn":  "Kannada (Kannada script. Compact panchang activity register.)",
    "mai": "Maithili (Devanagari script — Maithili distinct from Hindi: "
           "अछि/भेल/किनसँ. Compact panchang activity register.)",
    "mr":  "Marathi (Devanagari script. Compact panchang activity register.)",
}


def get_access_token() -> str:
    return subprocess.check_output(
        ["gcloud", "auth", "print-access-token"], text=True
    ).strip()


def gemini_translate_batch(token: str, texts: list[str], locale: str, locale_desc: str) -> list[str]:
    prompt = (
        f"You are translating short Hindu Vedic-astrology activity labels "
        f"and themes (1-10 words each, used on the panchang page muhurta "
        f"guide) to {locale_desc}.\n\n"
        f"Rules:\n"
        f"- Output ONLY the JSON object, no markdown fences.\n"
        f"- Keep translations CRISP — these are UI labels, not prose.\n"
        f"- Activity nouns (Travel / Medicine / Buying Vehicles): use the "
        f"locale's most-common everyday form, not Sanskritised when there "
        f"is a natural target-language word.\n"
        f"- Theme one-liners are slightly longer (5-15 words) — flow natural.\n\n"
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
    out_path = OUT_DIR / f"nakshatra-activities-{locale}-overlay.json"
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
    BATCH_SIZE = 15  # short labels — bigger batch
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
            out[job["key"]] = t
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
        return 1
    jobs_data = json.loads(JOBS_FILE.read_text(encoding="utf-8"))
    print(f"Total jobs: {jobs_data['total']}")
    print(f"By locale: {jobs_data['by_locale']}")

    token = get_access_token()
    print(f"ADC token: {token[:20]}...")

    target_locales = [l for l in LOCALES if jobs_data["by_locale"].get(l, 0) > 0]
    if not target_locales:
        print("No translation jobs — every locale up to date.")
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
        out_path = OUT_DIR / f"nakshatra-activities-{locale}-overlay.json"
        n_total = len(json.loads(out_path.read_text(encoding="utf-8"))) if out_path.exists() else 0
        print(f"wrote {out_path} ({n_total} total entries, {len(overlay)} new this run)")

    return 0


if __name__ == "__main__":
    sys.exit(main())
