#!/usr/bin/env python3
"""
Generate EN-locale expansion content for all yoga slugs via Gemini 2.5
Flash on Vertex AI. Output: src/lib/constants/yoga-expansions-en-overlay.json
keyed by `<slug>.<field>(.idx)?`.

The expansion adds 4 new optional fields per yoga, taking thin slug
pages (most 200-296 words currently) up to 500+ words:

  - realWorldManifestation  → 2-4 sentence prose paragraph
  - strengthFactors          → 3-5 short bullets (Jyotish-grounded)
  - activationTiming         → 1-2 sentences on dasha activation
  - practicalGuidance        → 3-4 actionable behavioural recommendations

Input: extracts each yoga's EXISTING structured data from
YOGA_DETAIL_DATA (name, formation rule, brief description, effects)
and uses it as context. Output stays grounded — no invented effects,
no contradicting the canonical data.

Run once. Locale fan-out is a separate translate pass.
"""
import concurrent.futures
import json
import os
import re
import subprocess
import sys
import tempfile
import time
import urllib.error
import urllib.request
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
# Jobs file path is configurable via env. Avoid hardcoded /tmp/ — on
# some platforms (Windows, certain CI runners, Docker images) /tmp does
# not exist or is wiped between steps. tempfile.gettempdir() resolves
# to the platform-appropriate temp dir.
JOBS_FILE = Path(
    os.environ.get(
        "YOGA_EXPANSIONS_JOBS_FILE",
        str(Path(tempfile.gettempdir()) / "yoga-expansions-jobs.json"),
    )
)
OUT_PATH = ROOT / "src/lib/constants/yoga-expansions-en-overlay.json"
PROJECT = "dekhopanchang"
MODEL = "gemini-2.5-flash"
ENDPOINT = (
    f"https://us-central1-aiplatform.googleapis.com/v1/projects/"
    f"{PROJECT}/locations/us-central1/publishers/google/models/"
    f"{MODEL}:generateContent"
)

PROMPT_TEMPLATE = """You are writing detailed Vedic-astrology expansion content for a
yoga (planetary combination) reference page. Your output extends an
existing structured entry, adding 4 narrative fields.

INPUT — canonical yoga record:
{yoga_json}

OUTPUT — JSON object with EXACTLY these 4 keys:
{{
  "realWorldManifestation": "<2-4 sentence prose paragraph describing how this yoga shows up in a chartholder's life — career patterns, relationship dynamics, health tendencies, recognisable temperament. Not a list. 50-90 words. Grounded in the formation rule and effects above; do not invent new effects.>",
  "strengthFactors": [
    "<short bullet 1 — what amplifies or weakens this yoga (planetary dignity, aspect from natural benefic, dasha lord position, navamsa confirmation, etc.). 8-22 words.>",
    "<short bullet 2>",
    "<short bullet 3>",
    "<optional bullet 4>",
    "<optional bullet 5>"
  ],
  "activationTiming": "<1-2 sentences on which dasha or antardasha periods typically trigger the yoga's results. Reference the planets involved by name. 25-45 words.>",
  "practicalGuidance": [
    "<actionable behavioural / lifestyle / spiritual recommendation 1 — NOT a duplicate of the remedies field above (no gemstone/mantra/charity). 10-25 words.>",
    "<recommendation 2>",
    "<recommendation 3>",
    "<optional recommendation 4>"
  ]
}}

Rules:
- Output ONLY the JSON object, no markdown fences, no commentary.
- British English spelling (colour, behaviour, recognise, etc.).
- No em-dashes from MS Word; use `—` (U+2014) where needed.
- Use canonical Sanskrit names for grahas in transliteration: Surya (Sun),
  Chandra (Moon), Mangal (Mars), Budha (Mercury), Guru (Jupiter),
  Shukra (Venus), Shani (Saturn), Rahu, Ketu. Mix freely with English.
- Tone: knowledgeable Jyotish practitioner explaining to a serious
  student, not a fortune-teller. Avoid hyperbole ("destiny", "must",
  "always"); prefer "tends to", "often", "typically".
- If isAuspicious is false, frame practical guidance as harm-reduction.
- Use the formationRule + effects + frequency as primary anchors — do not
  invent contradicting effects.
"""


def get_access_token() -> str:
    try:
        return subprocess.check_output(
            ["gcloud", "auth", "print-access-token"], text=True, stderr=subprocess.PIPE
        ).strip()
    except FileNotFoundError as exc:
        raise SystemExit("gcloud CLI not found on PATH.") from exc
    except subprocess.CalledProcessError as exc:
        raise SystemExit(f"gcloud token retrieval failed: {exc.stderr or '(empty)'}") from exc


def gemini_generate(yoga_record: dict) -> dict:
    prompt = PROMPT_TEMPLATE.format(yoga_json=json.dumps(yoga_record, ensure_ascii=False, indent=2))
    body = {
        "contents": [{"role": "user", "parts": [{"text": prompt}]}],
        "generationConfig": {
            "responseMimeType": "application/json",
            "temperature": 0.4,
            "maxOutputTokens": 2048,
        },
    }
    body_bytes = json.dumps(body, ensure_ascii=False).encode("utf-8")
    for attempt in range(3):
        try:
            # Refresh ADC token per attempt — OAuth tokens are 1-hour, and
            # long parallel runs (#618 / PR #645 pattern) exhausted the
            # single-fetch token mid-run, silently 401-ing all workers.
            token = get_access_token()
            req = urllib.request.Request(
                ENDPOINT, data=body_bytes, method="POST",
                headers={
                    "Authorization": f"Bearer {token}",
                    "Content-Type": "application/json; charset=utf-8",
                },
            )
            with urllib.request.urlopen(req, timeout=180) as resp:
                raw = json.loads(resp.read().decode("utf-8"))
            candidates = raw.get("candidates")
            if not candidates or not isinstance(candidates, list):
                raise RuntimeError(f"no candidates: {json.dumps(raw)[:300]}")
            text = candidates[0]["content"]["parts"][0]["text"]
            try:
                parsed = json.loads(text)
            except json.JSONDecodeError:
                stripped = text.strip()
                if stripped.startswith("```json"):
                    stripped = stripped[len("```json"):].lstrip("\n")
                elif stripped.startswith("```"):
                    stripped = stripped[3:].lstrip("\n")
                if stripped.endswith("```"):
                    stripped = stripped[:-3].rstrip()
                parsed = json.loads(stripped)
            if not isinstance(parsed, dict):
                raise RuntimeError(f"expected object, got {type(parsed).__name__}")
            return parsed
        except urllib.error.HTTPError as e:
            try:
                body_excerpt = e.read().decode("utf-8", errors="replace")[:300]
            except Exception:
                body_excerpt = "(unreadable body)"
            if attempt == 2:
                print(f"  HTTP {e.code}: {body_excerpt}", file=sys.stderr)
                raise
            print(f"  retry {attempt+1} HTTP {e.code}: {body_excerpt[:150]}", file=sys.stderr)
            time.sleep(2 ** attempt)
        except (urllib.error.URLError, json.JSONDecodeError, KeyError, IndexError, TypeError, RuntimeError) as e:
            if attempt == 2:
                raise
            print(f"  retry {attempt+1}: {str(e)[:120]}", file=sys.stderr)
            time.sleep(2 ** attempt)
    raise RuntimeError("unreachable")


def flatten_to_overlay(slug: str, expansion: dict) -> dict[str, str]:
    """Convert {realWorldManifestation, strengthFactors[], …} → overlay
    JSON keys `<slug>.<field>(.<idx>)?`. Empty/missing fields skipped."""
    out: dict[str, str] = {}
    rwm = expansion.get("realWorldManifestation")
    if isinstance(rwm, str) and rwm.strip():
        out[f"{slug}.realWorldManifestation"] = rwm.strip()
    sf = expansion.get("strengthFactors") or []
    if isinstance(sf, list):
        for i, item in enumerate(sf):
            if isinstance(item, str) and item.strip():
                out[f"{slug}.strengthFactors.{i}"] = item.strip()
    at = expansion.get("activationTiming")
    if isinstance(at, str) and at.strip():
        out[f"{slug}.activationTiming"] = at.strip()
    pg = expansion.get("practicalGuidance") or []
    if isinstance(pg, list):
        for i, item in enumerate(pg):
            if isinstance(item, str) and item.strip():
                out[f"{slug}.practicalGuidance.{i}"] = item.strip()
    return out


def _persist(merged: dict[str, str]) -> None:
    tmp = OUT_PATH.with_suffix(".json.tmp")
    tmp.write_text(json.dumps(merged, ensure_ascii=False, indent=2, sort_keys=True), encoding="utf-8")
    tmp.replace(OUT_PATH)


def process_one(slug: str, yoga_record: dict) -> dict[str, str]:
    try:
        expansion = gemini_generate(yoga_record)
        return flatten_to_overlay(slug, expansion)
    except Exception as e:
        print(f"  [{slug}] FAILED: {e}", file=sys.stderr)
        return {}


def main() -> int:
    if not JOBS_FILE.exists():
        print(f"jobs file missing: {JOBS_FILE}", file=sys.stderr)
        return 1
    jobs = json.loads(JOBS_FILE.read_text(encoding="utf-8"))
    print(f"Total yogas: {len(jobs)}")

    # Resume from existing partial output if present.
    merged: dict[str, str] = {}
    if OUT_PATH.exists():
        try:
            merged = json.loads(OUT_PATH.read_text(encoding="utf-8"))
            if not isinstance(merged, dict):
                merged = {}
        except json.JSONDecodeError:
            merged = {}
    print(f"Existing overlay entries: {len(merged)}")

    # Skip slugs that already have at least one expansion key (resume support).
    existing_slugs = {k.split(".")[0] for k in merged.keys()}
    todo = [(s, r) for (s, r) in jobs.items() if s not in existing_slugs]
    print(f"To generate: {len(todo)} slugs")

    # Sanity-check ADC at startup; gemini_generate() re-fetches per attempt
    # so the actual token lifecycle is handled inside the call.
    _ = get_access_token()
    print("ADC token: ok (per-attempt refresh in gemini_generate)")

    PERSIST_EVERY = 5
    done_since_persist = 0
    with concurrent.futures.ThreadPoolExecutor(max_workers=6) as ex:
        futures = {ex.submit(process_one, slug, rec): slug for slug, rec in todo}
        for i, fut in enumerate(concurrent.futures.as_completed(futures), 1):
            slug = futures[fut]
            overlay = fut.result()
            if overlay:
                merged.update(overlay)
                done_since_persist += 1
            print(f"  [{i}/{len(todo)}] {slug}: +{len(overlay)} keys")
            if done_since_persist >= PERSIST_EVERY:
                _persist(merged)
                done_since_persist = 0
    _persist(merged)
    print(f"\nWrote {OUT_PATH} ({len(merged)} total keys)")
    return 0


if __name__ == "__main__":
    sys.exit(main())
