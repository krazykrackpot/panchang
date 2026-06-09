#!/usr/bin/env python3
"""
Translate nakshatra-pada-deep-extras EN bodies to 8 target locales
(hi + 7 regional Indic) via Gemini 2.5 Flash on Vertex AI.

Reads:  src/lib/constants/nakshatra-pada-deep-extras.json
        keyed by "<nakshatraId>-<pada>" → { mythologicalContext: {en},
        strengthsWeaknesses: {en}, partnerCompatibility: {en},
        classicalReference: {en} }.
Writes: src/lib/constants/nakshatra-pada-deep-extras-{loc}-overlay.json
        keyed by "<nakshatraId>-<pada>.<field>".

Plain-text response (responseMimeType=text/plain) — same fix as the
new chalisa translator (scripts/translate-new-chalisas-via-gemini.py):
JSON-mode kept hitting "Unterminated string" parse errors once the
Devanagari / Bengali / Tamil expansions inflated past the 8192-token
output cap. Plain-text bypasses the JSON-encoding overhead.

Per-batch persistence (every 8 keys) so partial progress survives
crashes / quota hits / cache misses.
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
from datetime import date
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT / "src/lib/constants/nakshatra-pada-deep-extras.json"
OVERLAY_DIR = ROOT / "src/lib/constants"
PROJECT = "dekhopanchang"
ENDPOINT = (
    f"https://us-central1-aiplatform.googleapis.com/v1/projects/"
    f"{PROJECT}/locations/us-central1/publishers/google/models/"
    f"gemini-2.5-flash:generateContent"
)

LOCALES = {
    "hi":  "Hindi (Devanagari script. Knowledgeable Jyotish + mythology "
           "educator register. Canonical: अश्विनी, भरणी, कृत्तिका … पाद, "
           "नवांश, धात्वंश.)",
    "mai": "Maithili (Devanagari script — distinct from Hindi: अछि/भेल/किनसँ. "
           "Knowledgeable register, slightly literary.)",
    "mr":  "Marathi (Devanagari script. Knowledgeable Jyotish register.)",
    "ta":  "Tamil (Tamil script. Knowledgeable register.)",
    "te":  "Telugu (Telugu script. Knowledgeable register.)",
    "bn":  "Bengali (Bengali script. Knowledgeable register.)",
    "gu":  "Gujarati (Gujarati script. Knowledgeable register.)",
    "kn":  "Kannada (Kannada script. Knowledgeable register.)",
}

FIELDS = ("mythologicalContext", "strengthsWeaknesses",
          "partnerCompatibility", "classicalReference")


def get_access_token() -> str:
    return subprocess.check_output(
        ["gcloud", "auth", "print-access-token"], text=True
    ).strip()


def gemini_translate(token: str, text: str, locale: str, desc: str) -> str:
    prompt = (
        f"Translate this Vedic-astrology nakshatra-pada enrichment "
        f"prose to {desc}.\n\n"
        f"Rules:\n"
        f"- Output ONLY the translated string. No JSON, no quotes, no "
        f"  markdown fences, no commentary.\n"
        f"- Knowledgeable Jyotish + mythology educator register.\n"
        f"- Canonical transliteration of Sanskrit / Vedic terms "
        f"(nakshatra names, deity names, pada, navamsha, rashi, planets).\n"
        f"- Preserve em-dashes ` – `, parentheticals, sentence boundaries.\n"
        f"- British English source — produce equally measured target.\n"
        f"- If the source is empty, return an empty string.\n\n"
        f"English source:\n\n{text}"
    )
    body = {
        "contents": [{"role": "user", "parts": [{"text": prompt}]}],
        "generationConfig": {
            "responseMimeType": "text/plain",
            "temperature": 0.3,
            "maxOutputTokens": 4096,
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
            translated = raw["candidates"][0]["content"]["parts"][0]["text"].strip()
            # Empty / whitespace responses → retry instead of silently
            # writing "" into the overlay. Gemini PR #621 cycle-3 HIGH
            # (applied here defensively even though this is text/plain).
            if not translated:
                raise RuntimeError("empty translation; retrying")
            return translated
        except urllib.error.HTTPError as e:
            if attempt == 2:
                body_excerpt = e.read().decode("utf-8", errors="replace")[:200]
                print(f"  [{locale}] HTTP {e.code}: {body_excerpt}", file=sys.stderr, flush=True)
                raise
            # HTTP 429 = rate limit. Longer backoff under parallel
            # load. Gemini PR #621 cycle-2 MED.
            backoff = 15 * (attempt + 1) if e.code == 429 else 2 ** attempt
            time.sleep(backoff)
        # OSError covers TimeoutError + ConnectionResetError etc. in
        # Python 3.10+, beyond urllib.error.URLError. Gemini PR #621
        # cycle-3 MED. The remaining `Exception` catch covers the
        # JSONDecodeError and KeyError paths that the JSON-mode
        # variants enumerated explicitly.
        except (OSError, Exception) as e:
            if attempt == 2:
                raise
            print(f"  [{locale}] retry {attempt+1}: {str(e)[:120]}", file=sys.stderr, flush=True)
            time.sleep(2 ** attempt)
    raise RuntimeError("unreachable")


def translate_locale(locale: str, source: dict, token: str) -> int:
    overlay_path = OVERLAY_DIR / f"nakshatra-pada-deep-extras-{locale}-overlay.json"
    overlay: dict = {}
    if overlay_path.exists() and overlay_path.stat().st_size > 4:
        try:
            overlay = json.loads(overlay_path.read_text(encoding="utf-8"))
        except json.JSONDecodeError:
            overlay = {}

    desc = LOCALES[locale]
    items: list[tuple[str, str]] = []
    for slug, fields in source.items():
        for field in FIELDS:
            v = fields.get(field, {}).get("en")
            if isinstance(v, str) and v.strip():
                key = f"{slug}.{field}"
                # Retry empty/whitespace overlay values, not just
                # missing keys (a partial-write from a prior crashed
                # run would stay broken forever otherwise). Gemini
                # PR #621 cycle-2 MED.
                existing = overlay.get(key)
                if isinstance(existing, str) and existing.strip():
                    continue
                items.append((key, v))

    PERSIST_EVERY = 8
    n_done = 0
    since_persist = 0
    print(f"[{locale}] {len(items)} fields todo", flush=True)
    for key, en_text in items:
        try:
            t = gemini_translate(token, en_text, locale, desc)
        except Exception as e:
            print(f"  [{locale}] {key} FAIL: {e}", file=sys.stderr, flush=True)
            continue
        if not t:
            continue
        overlay[key] = t
        n_done += 1
        since_persist += 1
        if since_persist >= PERSIST_EVERY:
            tmp = overlay_path.with_suffix(".json.tmp")
            tmp.write_text(json.dumps(overlay, ensure_ascii=False, indent=2, sort_keys=True), encoding="utf-8")
            tmp.replace(overlay_path)
            since_persist = 0
            print(f"  [{locale}] persist: {n_done}/{len(items)}", flush=True)
    tmp = overlay_path.with_suffix(".json.tmp")
    tmp.write_text(json.dumps(overlay, ensure_ascii=False, indent=2, sort_keys=True), encoding="utf-8")
    tmp.replace(overlay_path)
    return n_done


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--locales", nargs="+", default=list(LOCALES))
    args = parser.parse_args()
    targets = [l for l in args.locales if l in LOCALES]
    if not targets:
        print(f"No valid locales. Available: {list(LOCALES)}", file=sys.stderr)
        return 1

    source = json.loads(SRC.read_text(encoding="utf-8"))
    print(f"Source: {len(source)} padas", flush=True)
    token = get_access_token()
    print(f"ADC: {token[:20]}…", flush=True)
    print(f"Translating {len(targets)} locales in parallel: {targets}", flush=True)

    with concurrent.futures.ThreadPoolExecutor(max_workers=len(targets)) as ex:
        futs = {ex.submit(translate_locale, l, source, token): l for l in targets}
        for fut in concurrent.futures.as_completed(futs):
            l = futs[fut]
            try:
                n = fut.result()
                print(f"[{l}] DONE — {n} keys", flush=True)
            except Exception as e:
                print(f"[{l}] FAILED: {e}", file=sys.stderr, flush=True)
    return 0


if __name__ == "__main__":
    sys.exit(main())
