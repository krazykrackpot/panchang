#!/usr/bin/env python3
"""
Translate LOCALIZED_TRANSIT_ARTICLES (10 transit articles × ~100 LocaleText
fields each) to the 7 visible regional locales via Gemini 2.5 Flash on
Vertex AI.

Output: src/lib/content/transit-articles-{locale}-overlay.json, keyed by
"<slug>.<path>" → translated text. Runtime merger
(transit-articles-with-overlay.ts) attaches overlay strings onto the
wrapped article tree at module load.

Per-batch persistence: writes overlay every 5 batches AND on each
batch failure, so a kill/crash loses at most ~50 entries.

Mirrors translate-puja-vidhi-via-gemini.py — see that file for
auth/batch/retry detail.

Run:
  npx tsx scripts/extract-transit-articles-translation-jobs.ts > /tmp/transit-jobs.json
  python3 scripts/translate-transit-articles-via-gemini.py
"""
import concurrent.futures
import json
import re
import subprocess
import sys
import time
from pathlib import Path


ROOT = Path(__file__).resolve().parent.parent
JOBS_FILE = Path("/tmp/transit-jobs.json")
OUT_DIR = ROOT / "src/lib/content"
PROJECT = "dekhopanchang"
MODEL = "gemini-2.5-flash"
ENDPOINT = (
    f"https://us-central1-aiplatform.googleapis.com/v1/projects/"
    f"{PROJECT}/locations/us-central1/publishers/google/models/"
    f"{MODEL}:generateContent"
)

# Per-locale register notes — transit-article-specific. Long-form
# editorial Jyotish prose with classical references (BPHS, Parashara,
# Phaladeepika) and lots of planet/sign vocabulary.
LOCALES = {
    "ta":  "Tamil (Tamil script, natural literary Tamil register suited "
           "to editorial Jyotish prose. Canonical deity/planet vocab: "
           "குரு/சனி/செவ்வாய்/புதன்/சுக்ரன்/சந்திரன்/சூரியன்/ராகு/கேது, "
           "மேஷம்/ரிஷபம்/மிதுனம்/கடகம்/சிம்மம்/கன்னி/துலாம்/விருச்சிகம்/"
           "தனுசு/மகரம்/கும்பம்/மீனம், கோசரம் (transit), "
           "தசை, ராசி, பாவம் (house).)",
    "te":  "Telugu (Telugu script, natural literary Telugu register. "
           "Canonical vocab: గురువు/శని/కుజ/బుధ/శుక్ర/చంద్ర/సూర్య/రాహు/కేతువు, "
           "మేషం/వృషభం/మిథునం/కర్కాటకం/సింహం/కన్య/తుల/వృశ్చికం/ధనస్సు/మకరం/"
           "కుంభం/మీనం, గోచారం, దశ.)",
    "bn":  "Bengali (Bengali script, natural literary Bengali register. "
           "Canonical vocab: বৃহস্পতি/শনি/মঙ্গল/বুধ/শুক্র/চন্দ্র/সূর্য/রাহু/কেতু, "
           "মেষ/বৃষ/মিথুন/কর্কট/সিংহ/কন্যা/তুলা/বৃশ্চিক/ধনু/মকর/কুম্ভ/মীন, গোচর, দশা.)",
    "gu":  "Gujarati (Gujarati script, natural literary Gujarati register. "
           "Canonical vocab: ગુરુ/શનિ/મંગળ/બુધ/શુક્ર/ચંદ્ર/સૂર્ય/રાહુ/કેતુ, "
           "મેષ/વૃષભ/મિથુન/કર્ક/સિંહ/કન્યા/તુલા/વૃશ્ચિક/ધનુ/મકર/કુંભ/મીન, ગોચર, દશા.)",
    "kn":  "Kannada (Kannada script, natural literary Kannada register. "
           "Canonical vocab: ಗುರು/ಶನಿ/ಮಂಗಳ/ಬುಧ/ಶುಕ್ರ/ಚಂದ್ರ/ಸೂರ್ಯ/ರಾಹು/ಕೇತು, "
           "ಮೇಷ/ವೃಷಭ/ಮಿಥುನ/ಕರ್ಕಾಟಕ/ಸಿಂಹ/ಕನ್ಯಾ/ತುಲಾ/ವೃಶ್ಚಿಕ/ಧನು/ಮಕರ/ಕುಂಭ/ಮೀನ, "
           "ಗೋಚಾರ, ದಶೆ.)",
    "mai": "Maithili (Devanagari script, natural Maithili register. "
           "Maithili differs from Hindi: prefer 'अछि/भेल' over 'है/हुआ', "
           "'किनसँ' over 'किसी से'. Keep Sanskrit Jyotish vocab "
           "in Devanagari: बृहस्पति, शनि, मेष, गोचर, दशा.)",
    "mr":  "Marathi (Devanagari script, natural literary Marathi register. "
           "Keep Sanskrit Jyotish vocab in Devanagari: गुरू/शनि/मंगळ/बुध/शुक्र/"
           "चंद्र/सूर्य/राहू/केतू, मेष/वृषभ/मिथुन/कर्क/सिंह/कन्या/तूळ/वृश्चिक/धनू/"
           "मकर/कुंभ/मीन, गोचर, दशा.)",
}


def get_access_token() -> str:
    return subprocess.check_output(
        ["gcloud", "auth", "print-access-token"], text=True
    ).strip()


def gemini_translate_batch(token: str, texts: list[str], locale: str, locale_desc: str) -> list[str]:
    prompt = (
        f"You are translating a Hindu Vedic-astrology transit article "
        f"to {locale_desc}.\n\n"
        f"Rules:\n"
        f"- Output ONLY the JSON object, no markdown fences, no commentary.\n"
        f"- Translate ALL English prose to natural, flowing target-language "
        f"editorial prose. Not literal — these are long-form articles.\n"
        f"- Planet names, sign names, dasha names, classical text names "
        f"(Brihat Hora Shastra / Parashara / Phaladeepika / Saravali): use "
        f"the locale's canonical transliteration in the target script.\n"
        f"- House numbers / Moon-sign references / year-dates stay numeric.\n"
        f"- Preserve em-dash spacing, parentheticals, and any English "
        f"date strings inside the prose (e.g. 'June 2, 2026' may stay).\n"
        f"- Tone: classical-but-accessible, suited to a literate reader.\n\n"
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
    out_path = OUT_DIR / f"transit-articles-{locale}-overlay.json"
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
            key = f"{job['slug']}.{job['path']}"
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
        print("Run first: npx tsx scripts/extract-transit-articles-translation-jobs.ts > /tmp/transit-jobs.json", file=sys.stderr)
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
        out_path = OUT_DIR / f"transit-articles-{locale}-overlay.json"
        # Final flush already happened inside translate_locale; reprint for log clarity.
        n_total = len(json.loads(out_path.read_text())) if out_path.exists() else 0
        print(f"wrote {out_path} ({n_total} total entries, {len(overlay)} new this run)")

    return 0


if __name__ == "__main__":
    sys.exit(main())
