#!/usr/bin/env python3
"""
Translate YOGA_PLAIN_NAMES (48 yoga plain-language names) to 7 visible
regional locales via Gemini 2.5 Flash on Vertex AI.

Output: src/lib/constants/yoga-plain-names-{locale}-overlay.json, keyed by
"<yoga-slug>".

Inherits all earlier review fixes (urllib, gcloud SystemExit,
dict-or-array response, TypeError catch, HTTPError body logging,
utf-8 encoding, pre-thread mkdir, empty-target guard).
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
JOBS_FILE = Path("/tmp/ypn-jobs.json")
OUT_DIR = ROOT / "src/lib/constants"
PROJECT = "dekhopanchang"
MODEL = "gemini-2.5-flash"
ENDPOINT = (
    f"https://us-central1-aiplatform.googleapis.com/v1/projects/"
    f"{PROJECT}/locations/us-central1/publishers/google/models/"
    f"{MODEL}:generateContent"
)

LOCALES = {
    "ta":  "Tamil (Tamil script. Personality-archetype register — short, "
           "punchy, identity-affirming. Canonical: மேஷம், ரிஷபம் … ராசி.)",
    "te":  "Telugu (Telugu script. Short identity-affirming register. "
           "Canonical: మేషం, వృషభం … రాశి.)",
    "bn":  "Bengali (Bengali script. Identity-affirming literary register. "
           "Canonical: মেষ, বৃষ … রাশি.)",
    "gu":  "Gujarati (Gujarati script. Identity-affirming register. "
           "Canonical: મેષ, વૃષભ … રાશિ.)",
    "kn":  "Kannada (Kannada script. Identity-affirming register. "
           "Canonical: ಮೇಷ, ವೃಷಭ … ರಾಶಿ.)",
    "mai": "Maithili (Devanagari script — distinct from Hindi: अछि/भेल/किनसँ. "
           "Identity-affirming literary register.)",
    "mr":  "Marathi (Devanagari script. Literary identity-affirming register.)",
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
        f"You are translating Hindu Vedic-astrology lagna-archetype "
        f"copy (12 ascendant archetypes — name, title, essence, "
        f"description, superpower, shadow) to {locale_desc}.\n\n"
        f"Rules:\n"
        f"- Output ONLY the JSON object, no markdown fences.\n"
        f"- This is identity-affirming, slightly poetic personality copy. "
        f"Translate ALL English prose to flowing target-language prose, "
        f"not literal.\n"
        f"- Lagna names (Mesha, Vrishabha…), planet names (Mars/Mangal, "
        f"Venus/Shukra…): target-language canonical transliteration in "
        f"the target script.\n"
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
            print(f"  [{locale}] retry {attempt+1}: {str(e)[:100]}", file=sys.stderr)
            time.sleep(2 ** attempt)
    raise RuntimeError("unreachable")


def _write_overlay(locale: str, overlay: dict[str, str]) -> None:
    out_path = OUT_DIR / f"yoga-plain-names-{locale}-overlay.json"
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
    PERSIST_EVERY = 3
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
    if new_since_persist > 0: _write_overlay(locale, out)
    print(f"  [{locale}] {len(batches)}/{len(batches)} batches done ({len(out)} translations)")
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
        out_path = OUT_DIR / f"yoga-plain-names-{locale}-overlay.json"
        n_total = len(json.loads(out_path.read_text(encoding="utf-8"))) if out_path.exists() else 0
        print(f"wrote {out_path} ({n_total} total entries, {len(overlay)} new this run)")
    return 0


if __name__ == "__main__":
    sys.exit(main())
