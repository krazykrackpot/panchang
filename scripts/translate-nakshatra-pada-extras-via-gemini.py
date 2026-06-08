#!/usr/bin/env python3
"""
Translate NAKSHATRA_PADA_EXTRAS (108 padas × 2 LocaleText fields:
spiritualPractice + decisions) to the 7 visible regional locales.

Output: src/lib/constants/nakshatra-pada-extras-{locale}-overlay.json,
keyed by "<nakshatraId>-<pada>.<field>" (e.g. "1-1.spiritualPractice").

Inherits all PR #562 review fixes:
- urllib.request instead of curl subprocess (no ARG_MAX risk)
- gcloud SystemExit wrapper
- dict-or-array response defensiveness
- utf-8 encoding everywhere
"""
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
JOBS_FILE = Path("/tmp/npe-jobs.json")
OUT_DIR = ROOT / "src/lib/constants"
PROJECT = "dekhopanchang"
MODEL = "gemini-2.5-flash"
ENDPOINT = (
    f"https://us-central1-aiplatform.googleapis.com/v1/projects/"
    f"{PROJECT}/locations/us-central1/publishers/google/models/"
    f"{MODEL}:generateContent"
)

LOCALES = {
    "ta":  "Tamil (Tamil script, devotional/Jyotish register suited to "
           "spiritual-practice and decision-making prose. Canonical: "
           "மந்திரம், விரதம், கிரஹம், நட்சத்திரம்.)",
    "te":  "Telugu (Telugu script, devotional/Jyotish register. Canonical: "
           "మంత్రం, వ్రతం, గ్రహం, నక్షత్రం.)",
    "bn":  "Bengali (Bengali script, devotional/Jyotish register. Canonical: "
           "মন্ত্র, ব্রত, গ্রহ, নক্ষত্র.)",
    "gu":  "Gujarati (Gujarati script, devotional/Jyotish register. Canonical: "
           "મંત્ર, વ્રત, ગ્રહ, નક્ષત્ર.)",
    "kn":  "Kannada (Kannada script, devotional/Jyotish register. Canonical: "
           "ಮಂತ್ರ, ವ್ರತ, ಗ್ರಹ, ನಕ್ಷತ್ರ.)",
    "mai": "Maithili (Devanagari script — Maithili distinct from Hindi: "
           "अछि/भेल/किनसँ. Devotional/Jyotish register.)",
    "mr":  "Marathi (Devanagari script, literary devotional/Jyotish register.)",
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
        f"You are translating Hindu Vedic-astrology nakshatra-pada "
        f"supplementary content (spiritualPractice or decisions — 30-40 "
        f"word advisory prose per pada) to {locale_desc}.\n\n"
        f"Rules:\n"
        f"- Output ONLY the JSON object, no markdown fences.\n"
        f"- Translate ALL English prose to natural target-language prose. "
        f"Devotional/spiritual register for spiritualPractice; "
        f"contemplative/practical register for decisions.\n"
        f"- Mantras, deity names, classical-text names: target-language "
        f"canonical transliteration in the target script.\n"
        f"- Preserve em-dash spacing, parentheticals, numeric quantities.\n\n"
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
            # Gemini puts a detailed error JSON in the response body —
            # read it so the retry log actually says WHY (safety block,
            # quota, malformed request). Gemini PR #565 cycle-1 MED.
            try:
                body_excerpt = e.read().decode("utf-8", errors="replace")[:300]
            except Exception:
                body_excerpt = "(could not read response body)"
            if attempt == 2:
                print(f"  [{locale}] HTTP {e.code} body: {body_excerpt}", file=sys.stderr)
                raise
            print(f"  [{locale}] retry {attempt+1} HTTP {e.code}: {body_excerpt[:200]}", file=sys.stderr)
            time.sleep(2 ** attempt)
        except (urllib.error.URLError, json.JSONDecodeError, KeyError, IndexError, TypeError, RuntimeError) as e:
            # TypeError covers `parsed[str(i)]` when Gemini returns a
            # null / scalar JSON shape instead of dict/array. Gemini
            # PR #565 cycle-1 HIGH.
            if attempt == 2:
                raise
            print(f"  [{locale}] retry {attempt+1}: {str(e)[:100]}", file=sys.stderr)
            time.sleep(2 ** attempt)
    raise RuntimeError("unreachable")


def _write_overlay(locale: str, overlay: dict[str, str]) -> None:
    out_path = OUT_DIR / f"nakshatra-pada-extras-{locale}-overlay.json"
    merged: dict[str, str] = {}
    if out_path.exists():
        try:
            merged = json.loads(out_path.read_text(encoding="utf-8"))
            if not isinstance(merged, dict): merged = {}
        except json.JSONDecodeError:
            merged = {}
    merged.update(overlay)
    tmp = out_path.with_suffix(".json.tmp")
    tmp.write_text(json.dumps(merged, ensure_ascii=False, indent=2, sort_keys=True), encoding="utf-8")
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
                _write_overlay(locale, out); new_since_persist = 0
            continue
        for job, t in zip(batch, translations):
            out[job["key"]] = t
        new_since_persist += len(translations)
        if (bi + 1) % PERSIST_EVERY == 0:
            _write_overlay(locale, out); new_since_persist = 0
        if (bi + 1) % 5 == 0 or bi + 1 == len(batches):
            print(f"  [{locale}] {bi+1}/{len(batches)} batches done ({len(out)} translations)")
    if new_since_persist > 0: _write_overlay(locale, out)
    return out


def main() -> int:
    if not JOBS_FILE.exists():
        print(f"jobs file missing: {JOBS_FILE}", file=sys.stderr); return 1
    jobs_data = json.loads(JOBS_FILE.read_text(encoding="utf-8"))
    print(f"Total jobs: {jobs_data['total']}")
    print(f"By locale: {jobs_data['by_locale']}")
    token = get_access_token()
    print(f"ADC token: {token[:20]}...")
    target_locales = [l for l in LOCALES if jobs_data["by_locale"].get(l, 0) > 0]
    if not target_locales:
        print("No translation jobs."); return 0
    print(f"Translating {len(target_locales)} locales in parallel: {target_locales}")
    OUT_DIR.mkdir(parents=True, exist_ok=True)
    results: dict[str, dict[str, str]] = {}
    with concurrent.futures.ThreadPoolExecutor(max_workers=len(target_locales)) as ex:
        futures = {ex.submit(translate_locale, l, jobs_data["jobs"][l], token): l for l in target_locales}
        for fut in concurrent.futures.as_completed(futures):
            locale = futures[fut]
            try:
                results[locale] = fut.result()
                print(f"[{locale}] DONE — {len(results[locale])} translations")
            except Exception as e:
                print(f"[{locale}] FAILED: {e}", file=sys.stderr)
    for locale, overlay in results.items():
        out_path = OUT_DIR / f"nakshatra-pada-extras-{locale}-overlay.json"
        n_total = len(json.loads(out_path.read_text(encoding="utf-8"))) if out_path.exists() else 0
        print(f"wrote {out_path} ({n_total} total entries, {len(overlay)} new this run)")
    return 0


if __name__ == "__main__":
    sys.exit(main())
