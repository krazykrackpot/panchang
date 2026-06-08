#!/usr/bin/env python3
"""
Translate PUJA_VIDHIS (47 puja-vidhi files) to the 7 visible regional
locales via Gemini 2.5 Flash on Vertex AI.

The corpus is ~140 LocaleText fields per puja × 47 pujas × 7 locales
= ~19,800 jobs at first run. Output is per-locale overlay JSON at:

  src/lib/constants/puja-vidhi-{locale}-overlay.json
  keyed by "<slug>.<path>" → translated text

Sacred Devanagari + IAST mantra/aarti/stotra text are NOT translated —
they stay AS-IS in the canonical TS files. The walker in the extract
script naturally skips them because they're strings, not LocaleText
objects.

`sa` (Sanskrit) is NOT a translation target — already authored in the
TS files for puja content, and the locale is retired (HTTP 410).

A runtime merger (puja-vidhi-with-overlay.ts) walks the same path
notation at module load and attaches overlay strings onto the
in-memory PUJA_VIDHIS.

Mirrors translate-festival-details-via-gemini.py — see that file for
auth/batch/idempotency commentary.

Run:
  npx tsx scripts/extract-puja-translation-jobs.ts > /tmp/puja-jobs.json
  python3 scripts/translate-puja-vidhi-via-gemini.py
"""
import concurrent.futures
import json
import re
import subprocess
import sys
import time
from pathlib import Path


ROOT = Path(__file__).resolve().parent.parent
JOBS_FILE = Path("/tmp/puja-jobs.json")
OUT_DIR = ROOT / "src/lib/constants"
PROJECT = "dekhopanchang"
MODEL = "gemini-2.5-flash"
ENDPOINT = (
    f"https://us-central1-aiplatform.googleapis.com/v1/projects/"
    f"{PROJECT}/locations/us-central1/publishers/google/models/"
    f"{MODEL}:generateContent"
)

# Per-locale translation register notes — puja-specific vocabulary:
# samagri (ritual ingredients), mantra, sankalpa, vidhi (procedure),
# naivedya (offering), aarti, prasad, etc. Keep traditional Sanskrit
# loanwords in their canonical transliterated form per locale.
LOCALES = {
    "ta":  "Tamil (Tamil script, natural Tamil register. Use canonical Tamil "
           "puja vocabulary: லக்ஷ்மி/கணேசர்/சிவன், சங்கல்பம், ஆசமனம், "
           "ஸமாக்ரி, பிரசாதம், ஆரத்தி, மந்திரம், etc.)",
    "te":  "Telugu (Telugu script, natural Telugu register. Use canonical Telugu "
           "puja vocabulary: లక్ష్మి/గణేశుడు/శివుడు, సంకల్పం, ఆచమనం, "
           "సామగ్రి, ప్రసాదం, ఆరతి, మంత్రం, etc.)",
    "bn":  "Bengali (Bengali script, natural Bengali register. Use canonical "
           "Bengali puja vocabulary: লক্ষ্মী/গণেশ/শিব, সঙ্কল্প, আচমন, "
           "সামগ্রী, প্রসাদ, আরতি, মন্ত্র, etc.)",
    "gu":  "Gujarati (Gujarati script, natural Gujarati register. Use canonical "
           "Gujarati puja vocabulary: લક્ષ્મી/ગણેશ/શિવ, સંકલ્પ, આચમન, "
           "સામગ્રી, પ્રસાદ, આરતી, મંત્ર, etc.)",
    "kn":  "Kannada (Kannada script, natural Kannada register. Use canonical "
           "Kannada puja vocabulary: ಲಕ್ಷ್ಮಿ/ಗಣೇಶ/ಶಿವ, ಸಂಕಲ್ಪ, ಆಚಮನ, "
           "ಸಾಮಗ್ರಿ, ಪ್ರಸಾದ, ಆರತಿ, ಮಂತ್ರ, etc.)",
    "mai": "Maithili (Devanagari script, natural Maithili register — note "
           "Maithili differs from Hindi: prefer 'अछि/भेल' over 'है/हुआ', "
           "'किनसँ' over 'किसी से'. Keep Sanskrit puja terms in Devanagari: "
           "लक्ष्मी, गणेश, सङ्कल्प, सामग्री, मन्त्र, आरती.)",
    "mr":  "Marathi (Devanagari script, natural Marathi register. Keep "
           "Sanskrit puja terms in Devanagari: लक्ष्मी, गणेश, संकल्प, "
           "सामग्री, मंत्र, आरती.)",
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
        f"You are translating Hindu puja-vidhi (worship procedure) "
        f"reference content to {locale_desc}.\n\n"
        f"Rules:\n"
        f"- Output ONLY the JSON object, no markdown fences, no commentary.\n"
        f"- Translate ALL English prose. Proper nouns (deity names, festival "
        f"names, mantra names, ritual stages like Sankalpa / Achamana / "
        f"Pradakshina / Aarti) → canonical transliteration in target script.\n"
        f"- Samagri ingredient names: use the target-language CANONICAL name "
        f"if one exists (kumkum → குங்குமம் / குമ്കಮ / কুঙ্কুম / etc.); "
        f"otherwise transliterate the Sanskrit/Hindi loanword.\n"
        f"- Step procedures: natural target-language imperative voice (e.g. "
        f"'Light the lamp', 'Sip water three times'). Not literal translation.\n"
        f"- Mantra meanings: faithful + clear, not paraphrased away from the "
        f"Sanskrit/Hindu theological content.\n"
        f"- Preserve em-dash spacing, parentheticals, numeric quantities.\n"
        f"- Devanagari mantras / IAST transliteration inside the source text "
        f"(if any) MUST be preserved AS-IS, not transliterated to the target.\n\n"
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
    """Persist overlay (merged with any existing file) atomically. Called
    per-batch so a kill/crash doesn't lose more than the last in-flight batch."""
    out_path = OUT_DIR / f"puja-vidhi-{locale}-overlay.json"
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
    PERSIST_EVERY = 5  # write overlay after every N batches (~50 translations)
    batches = [jobs[i:i + BATCH_SIZE] for i in range(0, len(jobs), BATCH_SIZE)]

    print(f"[{locale}] {len(jobs)} jobs in {len(batches)} batches")
    new_since_persist = 0
    for bi, batch in enumerate(batches):
        texts = [j["en"] for j in batch]
        try:
            translations = gemini_translate_batch(token, texts, locale, locale_desc)
        except Exception as e:
            print(f"  [{locale}] batch {bi+1}/{len(batches)} FAILED: {e}", file=sys.stderr)
            # Persist whatever we have so far before moving on — a long
            # failure cluster shouldn't lose preceding good batches.
            if new_since_persist > 0:
                _write_overlay(locale, out)
                new_since_persist = 0
            continue
        for job, t in zip(batch, translations):
            key = f"{job['slug']}.{job['path']}"
            out[key] = t
        new_since_persist += len(translations)
        if (bi + 1) % PERSIST_EVERY == 0:
            _write_overlay(locale, out)
            new_since_persist = 0
        if (bi + 1) % 10 == 0 or bi + 1 == len(batches):
            print(f"  [{locale}] {bi+1}/{len(batches)} batches done ({len(out)} translations)")
    # Final flush.
    if new_since_persist > 0:
        _write_overlay(locale, out)
    return out


def main() -> int:
    if not JOBS_FILE.exists():
        print(f"jobs file missing: {JOBS_FILE}", file=sys.stderr)
        print("Run first: npx tsx scripts/extract-puja-translation-jobs.ts > /tmp/puja-jobs.json", file=sys.stderr)
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
        out_path = OUT_DIR / f"puja-vidhi-{locale}-overlay.json"
        merged: dict[str, str] = {}
        if out_path.exists():
            try:
                merged = json.loads(out_path.read_text())
                if not isinstance(merged, dict):
                    merged = {}
            except json.JSONDecodeError:
                merged = {}
        merged.update(overlay)
        out_path.write_text(json.dumps(merged, ensure_ascii=False, indent=2, sort_keys=True))
        print(f"wrote {out_path} ({len(merged)} total entries, {len(overlay)} new this run)")

    return 0


if __name__ == "__main__":
    sys.exit(main())
