#!/usr/bin/env python3
"""
Translate nakshatra-baby-content EN overlay to 8 target locales via
Gemini 2.5 Flash on Vertex AI.

Reads:  src/lib/constants/nakshatra-baby-content-en-overlay.json
Writes: src/lib/constants/nakshatra-baby-content-{loc}-overlay.json
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
SRC = ROOT / "src/lib/constants/nakshatra-baby-content-en-overlay.json"
OUT_DIR = ROOT / "src/lib/constants"
PROJECT = "dekhopanchang"
MODEL = "gemini-2.5-flash"
ENDPOINT = (
    f"https://us-central1-aiplatform.googleapis.com/v1/projects/"
    f"{PROJECT}/locations/us-central1/publishers/google/models/"
    f"{MODEL}:generateContent"
)

LOCALES = {
    "hi":  "Hindi (Devanagari script. Knowledgeable Jyotish + Vedic-mythology "
           "educator register — flowing, classical, accessible. Sanskrit "
           "deity/nakshatra names in Devanagari transliteration: अश्विनी, "
           "भरणी, यम, अग्नि, etc.)",
    "mai": "Maithili (Devanagari script — distinct from Hindi: अछि/भेल/किनसँ. "
           "Knowledgeable register, slightly literary.)",
    "mr":  "Marathi (Devanagari script. Knowledgeable Jyotish + mythology "
           "register.)",
    "ta":  "Tamil (Tamil script. Knowledgeable register. Canonical: அசுவினி, "
           "பரணி, யமன், அக்னி, etc.)",
    "te":  "Telugu (Telugu script. Knowledgeable register. Canonical: అశ్విని, "
           "భరణి, యముడు, అగ్ని, etc.)",
    "bn":  "Bengali (Bengali script. Knowledgeable register. Canonical: "
           "অশ্বিনী, ভরণী, যম, অগ্নি, etc.)",
    "gu":  "Gujarati (Gujarati script. Knowledgeable register. Canonical: "
           "અશ્વિની, ભરણી, યમ, અગ્નિ, etc.)",
    "kn":  "Kannada (Kannada script. Knowledgeable register. Canonical: "
           "ಅಶ್ವಿನಿ, ಭರಣಿ, ಯಮ, ಅಗ್ನಿ, etc.)",
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
        f"You are translating Vedic-mythology nakshatra enrichment content "
        f"(deityLegend, symbolMeaning, personalityTraits, nameThemes, "
        f"famousBearers, namingTradition) to {locale_desc}.\n\n"
        f"Rules:\n"
        f"- Output ONLY the JSON object, no markdown fences.\n"
        f"- Knowledgeable Jyotish + mythology educator register — translate "
        f"ALL English prose to flowing target-language prose, not literal.\n"
        f"- Sanskrit/Vedic terms (Ashwini Kumaras, Yama, Agni, Aditi, etc.): "
        f"target-language canonical transliteration in the target script.\n"
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
                # No re.MULTILINE — anchors stay at absolute string
                # ends. Gemini PR #621 cycle-2 MED applied here too.
                text = re.sub(r"^```(?:json)?\n?|\n?```$", "", text.strip())
                parsed = json.loads(text)
            if isinstance(parsed, list):
                if len(parsed) != len(texts):
                    raise RuntimeError(f"array len {len(parsed)} != expected {len(texts)}")
                translations = [parsed[i] for i in range(len(texts))]
            elif isinstance(parsed, dict):
                translations = []
                for i in range(len(texts)):
                    if str(i) in parsed:
                        translations.append(parsed[str(i)])
                    elif i in parsed:
                        translations.append(parsed[i])
                    else:
                        raise KeyError(f"key {i} not in parsed dict (keys={list(parsed)[:5]})")
            elif isinstance(parsed, str) and len(texts) == 1:
                translations = [parsed]
            else:
                raise TypeError(f"unexpected JSON structure: {type(parsed).__name__}")
            if any(not isinstance(t, str) or not t.strip() for t in translations):
                raise RuntimeError("one or more translations are empty or non-string; retrying")
            return translations
        except urllib.error.HTTPError as e:
            try:
                body_excerpt = e.read().decode("utf-8", errors="replace")[:300]
            except Exception:
                body_excerpt = "(unreadable body)"
            if attempt == 2:
                print(f"  [{locale}] HTTP {e.code}: {body_excerpt}", file=sys.stderr)
                raise
            print(f"  [{locale}] retry {attempt+1} HTTP {e.code}: {body_excerpt[:150]}", file=sys.stderr)
            backoff = 15 * (attempt + 1) if e.code == 429 else 2 ** attempt
            time.sleep(backoff)
        # OSError covers TimeoutError + ConnectionResetError etc. in
        # Python 3.10+. Gemini PR #621 cycle-3 MED.
        except (OSError, json.JSONDecodeError, KeyError, IndexError, TypeError, RuntimeError) as e:
            if attempt == 2:
                raise
            print(f"  [{locale}] retry {attempt+1}: {str(e)[:120]}", file=sys.stderr)
            time.sleep(2 ** attempt)
    raise RuntimeError("unreachable")


def _persist(locale: str, merged: dict[str, str]) -> None:
    out_path = OUT_DIR / f"nakshatra-baby-content-{locale}-overlay.json"
    tmp = out_path.with_suffix(".json.tmp")
    tmp.write_text(json.dumps(merged, ensure_ascii=False, indent=2, sort_keys=True), encoding="utf-8")
    tmp.replace(out_path)


def translate_locale(locale: str, source: dict[str, str], token: str) -> int:
    locale_desc = LOCALES[locale]
    out_path = OUT_DIR / f"nakshatra-baby-content-{locale}-overlay.json"
    merged: dict[str, str] = {}
    if out_path.exists():
        try:
            merged = json.loads(out_path.read_text(encoding="utf-8"))
            if not isinstance(merged, dict):
                merged = {}
        except json.JSONDecodeError:
            merged = {}

    # Retry empty/whitespace overlay values, not just missing keys.
    # Gemini PR #621 cycle-2 MED.
    todo_items = [
        (k, v) for (k, v) in source.items()
        if not isinstance(merged.get(k), str) or not merged[k].strip()
    ]
    BATCH_SIZE = 10
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
