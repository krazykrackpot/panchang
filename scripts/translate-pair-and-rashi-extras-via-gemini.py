#!/usr/bin/env python3
"""
Translate rashi-pair-deep-content + rashi-editorial-extras EN bodies
to 8 target locales (hi + 7 regional Indic) via Gemini 2.5 Flash on
Vertex AI.

Reads two source files:
  src/lib/constants/rashi-pair-deep-content.json (78 pairs × 4 fields)
  src/lib/horoscope/rashi-editorial-extras.json  (12 rashis × 3 fields)

Writes:
  src/lib/constants/rashi-pair-deep-content-{loc}-overlay.json
  src/lib/horoscope/rashi-editorial-extras-{loc}-overlay.json

Overlay keys:
  pairs:   "<lowerRashiId>-<higherRashiId>.<field>"
  rashis:  "<rashiId>.<field>"

Plain-text response (responseMimeType=text/plain) — same fix as
translate-nakshatra-pada-deep-extras-via-gemini.py: JSON mode hit
"Unterminated string" parse errors once Devanagari / Bengali / Tamil
expansions inflated past the 8192-token cap.

Per-batch persistence (every 8 keys) so partial progress survives
crashes / quota hits.
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
PAIR_SRC = ROOT / "src/lib/constants/rashi-pair-deep-content.json"
RASHI_SRC = ROOT / "src/lib/horoscope/rashi-editorial-extras.json"
PAIR_OVERLAY_DIR = ROOT / "src/lib/constants"
RASHI_OVERLAY_DIR = ROOT / "src/lib/horoscope"
PROJECT = "dekhopanchang"
ENDPOINT = (
    f"https://us-central1-aiplatform.googleapis.com/v1/projects/"
    f"{PROJECT}/locations/us-central1/publishers/google/models/"
    f"gemini-2.5-flash:generateContent"
)

LOCALES = {
    "hi":  "Hindi (Devanagari script. Knowledgeable Jyotish + mythology educator register.)",
    "mai": "Maithili (Devanagari script — distinct from Hindi: अछि/भेल/किनसँ. Knowledgeable register.)",
    "mr":  "Marathi (Devanagari script. Knowledgeable Jyotish register.)",
    "ta":  "Tamil (Tamil script. Knowledgeable register.)",
    "te":  "Telugu (Telugu script. Knowledgeable register.)",
    "bn":  "Bengali (Bengali script. Knowledgeable register.)",
    "gu":  "Gujarati (Gujarati script. Knowledgeable register.)",
    "kn":  "Kannada (Kannada script. Knowledgeable register.)",
}

PAIR_FIELDS = ("mythologicalDynamic", "deepCompatibilityNotes",
               "careerBondInsight", "growthPath")
RASHI_FIELDS = ("dashaSignificance", "transitsPlaybook", "luckyAndUnlucky")


def get_access_token() -> str:
    return subprocess.check_output(
        ["gcloud", "auth", "print-access-token"], text=True
    ).strip()


def gemini_translate(token: str, text: str, locale: str, desc: str) -> str:
    prompt = (
        f"Translate this Vedic-astrology enrichment prose to {desc}.\n\n"
        f"Rules:\n"
        f"- Output ONLY the translated string. No JSON, no quotes, no "
        f"  markdown fences, no commentary.\n"
        f"- Knowledgeable Jyotish + mythology educator register.\n"
        f"- Canonical transliteration of Sanskrit / Vedic terms (rashi, "
        f"  pada, navamsha, mahadasha, gochara, kuta, gana, nadi, etc.).\n"
        f"- Preserve em-dashes ` – `, parentheticals, sentence boundaries.\n"
        f"- British English source — produce equally measured target.\n\n"
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
            if not translated:
                raise RuntimeError("empty translation; retrying")
            return translated
        except urllib.error.HTTPError as e:
            if attempt == 2:
                body_excerpt = e.read().decode("utf-8", errors="replace")[:200]
                print(f"  [{locale}] HTTP {e.code}: {body_excerpt}", file=sys.stderr, flush=True)
                raise
            backoff = 15 * (attempt + 1) if e.code == 429 else 2 ** attempt
            time.sleep(backoff)
        except (OSError, Exception) as e:
            if attempt == 2:
                raise
            print(f"  [{locale}] retry {attempt+1}: {str(e)[:120]}", file=sys.stderr, flush=True)
            time.sleep(2 ** attempt)
    raise RuntimeError("unreachable")


def translate_overlay(locale: str, source: dict, fields: tuple,
                      overlay_path: Path, token: str) -> int:
    overlay: dict = {}
    if overlay_path.exists() and overlay_path.stat().st_size > 4:
        try:
            overlay = json.loads(overlay_path.read_text(encoding="utf-8"))
        except json.JSONDecodeError:
            overlay = {}

    desc = LOCALES[locale]
    items: list[tuple[str, str]] = []
    for slug, content in source.items():
        for field in fields:
            v = content.get(field, {}).get("en")
            if isinstance(v, str) and v.strip():
                key = f"{slug}.{field}"
                # Retry empty/whitespace overlay values. Gemini PR #621
                # cycle-2 MED.
                existing = overlay.get(key)
                if isinstance(existing, str) and existing.strip():
                    continue
                items.append((key, v))

    PERSIST_EVERY = 8
    n_done = 0
    since = 0
    total = len(items)
    print(f"[{locale}/{overlay_path.name}] {total} fields todo", flush=True)
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
        since += 1
        if since >= PERSIST_EVERY:
            tmp = overlay_path.with_suffix(".json.tmp")
            tmp.write_text(json.dumps(overlay, ensure_ascii=False, indent=2, sort_keys=True), encoding="utf-8")
            tmp.replace(overlay_path)
            since = 0
            print(f"  [{locale}/{overlay_path.stem}] persist: {n_done}/{total}", flush=True)
    tmp = overlay_path.with_suffix(".json.tmp")
    tmp.write_text(json.dumps(overlay, ensure_ascii=False, indent=2, sort_keys=True), encoding="utf-8")
    tmp.replace(overlay_path)
    return n_done


def translate_locale(locale: str, pair_source: dict, rashi_source: dict, token: str) -> int:
    pair_path = PAIR_OVERLAY_DIR / f"rashi-pair-deep-content-{locale}-overlay.json"
    rashi_path = RASHI_OVERLAY_DIR / f"rashi-editorial-extras-{locale}-overlay.json"
    n1 = translate_overlay(locale, pair_source, PAIR_FIELDS, pair_path, token)
    n2 = translate_overlay(locale, rashi_source, RASHI_FIELDS, rashi_path, token)
    return n1 + n2


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--locales", nargs="+", default=list(LOCALES))
    args = parser.parse_args()
    targets = [l for l in args.locales if l in LOCALES]

    pair_source = json.loads(PAIR_SRC.read_text(encoding="utf-8"))
    rashi_source = json.loads(RASHI_SRC.read_text(encoding="utf-8"))
    total_keys = len(pair_source) * len(PAIR_FIELDS) + len(rashi_source) * len(RASHI_FIELDS)
    print(f"Pairs: {len(pair_source)} × {len(PAIR_FIELDS)} = {len(pair_source) * len(PAIR_FIELDS)}", flush=True)
    print(f"Rashis: {len(rashi_source)} × {len(RASHI_FIELDS)} = {len(rashi_source) * len(RASHI_FIELDS)}", flush=True)
    print(f"Total per locale: {total_keys}", flush=True)

    token = get_access_token()
    print(f"ADC: {token[:20]}…", flush=True)
    print(f"Translating {len(targets)} locales in parallel: {targets}", flush=True)

    with concurrent.futures.ThreadPoolExecutor(max_workers=len(targets)) as ex:
        futs = {ex.submit(translate_locale, l, pair_source, rashi_source, token): l for l in targets}
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
