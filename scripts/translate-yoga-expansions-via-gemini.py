#!/usr/bin/env python3
"""
Translate yoga-expansions EN overlay to 8 target locales via Gemini
2.5 Flash on Vertex AI.

Reads:  src/lib/constants/yoga-expansions-en-overlay.json
Writes: src/lib/constants/yoga-expansions-{loc}-overlay.json

Each overlay file is keyed by the same dotted scheme as the EN source
(`<slug>.<field>(.<idx>)?`). Batches 12 entries per Gemini call so
output stays within the 8192-token cap.
"""
import argparse
import concurrent.futures
import json
import re
import subprocess
import sys
import time
import urllib.error
import urllib.request
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT / "src/lib/constants/yoga-expansions-en-overlay.json"
OUT_DIR = ROOT / "src/lib/constants"
PROJECT = "dekhopanchang"
MODEL = "gemini-2.5-flash"
ENDPOINT = (
    f"https://us-central1-aiplatform.googleapis.com/v1/projects/"
    f"{PROJECT}/locations/us-central1/publishers/google/models/"
    f"{MODEL}:generateContent"
)

LOCALES = {
    "hi":  "Hindi (Devanagari script. Knowledgeable Jyotish practitioner "
           "register — flowing, classical, accessible. Canonical: सूर्य/"
           "चन्द्र/मङ्गल/बुध/गुरु/शुक्र/शनि/राहु/केतु, दशा/अन्तर्दशा, नवांश, "
           "केन्द्र.)",
    "mai": "Maithili (Devanagari script — distinct from Hindi: अछि/भेल/किनसँ. "
           "Knowledgeable register, slightly literary.)",
    "mr":  "Marathi (Devanagari script. Knowledgeable Jyotish register.)",
    "ta":  "Tamil (Tamil script. Knowledgeable Jyotish register. Canonical: "
           "சூரியன்/சந்திரன்/செவ்வாய்/புதன்/குரு/சுக்கிரன்/சனி/ராகு/கேது, "
           "தசை/அந்தர்தசை, நவாம்சம், கேந்திரம்.)",
    "te":  "Telugu (Telugu script. Knowledgeable Jyotish register. Canonical: "
           "సూర్యుడు/చంద్రుడు/అంగారకుడు/బుధుడు/గురువు/శుక్రుడు/శని/రాహువు/కేతువు, "
           "దశ/అంతర్దశ, నవాంశం.)",
    "bn":  "Bengali (Bengali script. Knowledgeable Jyotish register. Canonical: "
           "সূর্য/চন্দ্র/মঙ্গল/বুধ/বৃহস্পতি/শুক্র/শনি/রাহু/কেতু, দশা/অন্তর্দশা, "
           "নবাংশ, কেন্দ্র.)",
    "gu":  "Gujarati (Gujarati script. Knowledgeable Jyotish register. "
           "Canonical: સૂર્ય/ચંદ્ર/મંગળ/બુધ/ગુરુ/શુક્ર/શનિ/રાહુ/કેતુ, "
           "દશા/અંતર્દશા, નવાંશ, કેન્દ્ર.)",
    "kn":  "Kannada (Kannada script. Knowledgeable Jyotish register. Canonical: "
           "ಸೂರ್ಯ/ಚಂದ್ರ/ಕುಜ/ಬುಧ/ಗುರು/ಶುಕ್ರ/ಶನಿ/ರಾಹು/ಕೇತು, ದಶೆ/ಅಂತರ್ದಶೆ, "
           "ನವಾಂಶ, ಕೇಂದ್ರ.)",
}


def get_access_token() -> str:
    try:
        return subprocess.check_output(
            ["gcloud", "auth", "print-access-token"], text=True, stderr=subprocess.PIPE
        ).strip()
    except FileNotFoundError as exc:
        raise SystemExit("gcloud CLI not found on PATH.") from exc
    except subprocess.CalledProcessError as exc:
        raise SystemExit(f"gcloud token retrieval failed: {exc.stderr or '(empty)'}") from exc


def gemini_translate_batch(token: str, texts: list[str], locale: str, locale_desc: str) -> list[str]:
    prompt = (
        f"You are translating Vedic-astrology yoga expansion content "
        f"(realWorldManifestation, strengthFactors, activationTiming, "
        f"practicalGuidance) to {locale_desc}.\n\n"
        f"Rules:\n"
        f"- Output ONLY the JSON object, no markdown fences.\n"
        f"- Knowledgeable Jyotish-practitioner register — translate ALL "
        f"English prose to flowing target-language prose, not literal.\n"
        f"- Sanskrit/Vedic terms (Gajakesari, Mahapurusha, dasha, "
        f"antardasha, navamsa, etc.): target-language canonical "
        f"transliteration in the target script.\n"
        f"- Preserve em-dashes, parentheticals, sentence boundaries.\n"
        f"- Avoid hyperbole; mirror the source's measured tone.\n\n"
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
    body_bytes = json.dumps(body, ensure_ascii=False).encode("utf-8")
    for attempt in range(3):
        try:
            req = urllib.request.Request(
                ENDPOINT, data=body_bytes, method="POST",
                headers={
                    "Authorization": f"Bearer {token}",
                    "Content-Type": "application/json; charset=utf-8",
                },
            )
            with urllib.request.urlopen(req, timeout=180) as resp:
                raw = json.loads(resp.read().decode("utf-8"))
            if "candidates" not in raw:
                raise RuntimeError(f"no candidates: {json.dumps(raw)[:300]}")
            text = raw["candidates"][0]["content"]["parts"][0]["text"]
            try:
                parsed = json.loads(text)
            except json.JSONDecodeError:
                text = re.sub(r"^```(?:json)?\n?|\n?```$", "", text.strip(), flags=re.MULTILINE)
                parsed = json.loads(text)
            if isinstance(parsed, list):
                if len(parsed) != len(texts):
                    raise RuntimeError(f"array len {len(parsed)} != expected {len(texts)}")
                return [str(parsed[i]) for i in range(len(texts))]
            return [parsed[str(i)] for i in range(len(texts))]
        except urllib.error.HTTPError as e:
            try:
                body_excerpt = e.read().decode("utf-8", errors="replace")[:300]
            except Exception:
                body_excerpt = "(unreadable body)"
            if attempt == 2:
                print(f"  [{locale}] HTTP {e.code}: {body_excerpt}", file=sys.stderr)
                raise
            print(f"  [{locale}] retry {attempt+1} HTTP {e.code}: {body_excerpt[:150]}", file=sys.stderr)
            time.sleep(2 ** attempt)
        except (urllib.error.URLError, json.JSONDecodeError, KeyError, IndexError, TypeError, RuntimeError) as e:
            if attempt == 2:
                raise
            print(f"  [{locale}] retry {attempt+1}: {str(e)[:120]}", file=sys.stderr)
            time.sleep(2 ** attempt)
    raise RuntimeError("unreachable")


def _persist(locale: str, merged: dict[str, str]) -> None:
    out_path = OUT_DIR / f"yoga-expansions-{locale}-overlay.json"
    tmp = out_path.with_suffix(".json.tmp")
    tmp.write_text(json.dumps(merged, ensure_ascii=False, indent=2, sort_keys=True), encoding="utf-8")
    tmp.replace(out_path)


def translate_locale(locale: str, source: dict[str, str], token: str) -> int:
    locale_desc = LOCALES[locale]
    out_path = OUT_DIR / f"yoga-expansions-{locale}-overlay.json"
    merged: dict[str, str] = {}
    if out_path.exists():
        try:
            merged = json.loads(out_path.read_text(encoding="utf-8"))
            if not isinstance(merged, dict):
                merged = {}
        except json.JSONDecodeError:
            merged = {}

    # Skip keys we've already translated.
    todo_items = [(k, v) for (k, v) in source.items() if k not in merged]
    BATCH_SIZE = 12
    PERSIST_EVERY = 3
    batches = [todo_items[i:i + BATCH_SIZE] for i in range(0, len(todo_items), BATCH_SIZE)]
    print(f"[{locale}] {len(todo_items)} todo / {len(source)} total, {len(batches)} batches")

    new_since_persist = 0
    for bi, batch in enumerate(batches):
        texts = [v for (_, v) in batch]
        try:
            translations = gemini_translate_batch(token, texts, locale, locale_desc)
        except Exception as e:
            print(f"  [{locale}] batch {bi+1}/{len(batches)} FAILED: {e}", file=sys.stderr)
            if new_since_persist > 0:
                _persist(locale, merged)
                new_since_persist = 0
            continue
        for (k, _), t in zip(batch, translations):
            merged[k] = t
        new_since_persist += len(translations)
        if (bi + 1) % PERSIST_EVERY == 0:
            _persist(locale, merged)
            new_since_persist = 0
    if new_since_persist > 0:
        _persist(locale, merged)
    return len(merged)


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--locales", nargs="+", default=list(LOCALES.keys()))
    args = parser.parse_args()
    targets = [l for l in args.locales if l in LOCALES]
    if not targets:
        print(f"No valid locales. Available: {list(LOCALES.keys())}", file=sys.stderr)
        return 1

    source = json.loads(SRC.read_text(encoding="utf-8"))
    print(f"Source: {SRC} ({len(source)} keys)")
    token = get_access_token()
    print(f"ADC token: {token[:20]}...")
    print(f"Translating {len(targets)} locales in parallel: {targets}")

    with concurrent.futures.ThreadPoolExecutor(max_workers=len(targets)) as ex:
        futures = {ex.submit(translate_locale, l, source, token): l for l in targets}
        for fut in concurrent.futures.as_completed(futures):
            locale = futures[fut]
            try:
                n = fut.result()
                print(f"[{locale}] DONE — {n} total translations on disk")
            except Exception as e:
                print(f"[{locale}] FAILED: {e}", file=sys.stderr)
    return 0


if __name__ == "__main__":
    sys.exit(main())
