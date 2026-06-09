#!/usr/bin/env python3
"""
Generate per-nakshatra enrichment content for /baby-names/[nakshatra]
detail pages via Gemini 2.5 Flash on Vertex AI.

Writes flat dotted-key overlay JSONs:
  src/lib/constants/nakshatra-baby-content-en-overlay.json
  src/lib/constants/nakshatra-baby-content-{loc}-overlay.json (stubs)

Output structure per nakshatra:
  - deityLegend           → 80-120 word prose
  - symbolMeaning          → 50-80 word prose
  - personalityTraits[]    → 4-5 bullets
  - nameThemes             → 40-60 word prose
  - famousBearers          → 30-40 word prose (or omitted)
  - namingTradition        → 40-60 word prose

Source: /tmp/nakshatra-baby-jobs.json — extracted via
scripts/extract-nakshatra-baby-jobs.ts (NAKSHATRAS + symbol +
deity from src/lib/constants/nakshatras.ts).
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
JOBS_FILE = Path("/tmp/nakshatra-baby-jobs.json")
OUT_PATH = ROOT / "src/lib/constants/nakshatra-baby-content-en-overlay.json"
PROJECT = "dekhopanchang"
MODEL = "gemini-2.5-flash"
ENDPOINT = (
    f"https://us-central1-aiplatform.googleapis.com/v1/projects/"
    f"{PROJECT}/locations/us-central1/publishers/google/models/"
    f"{MODEL}:generateContent"
)

PROMPT_TEMPLATE = """You are writing detailed Vedic-astrology enrichment content
for a nakshatra (lunar mansion) baby-naming page. Your output extends
an existing canonical record, adding 6 narrative fields that
distinguish this nakshatra from the other 26.

INPUT — canonical nakshatra record:
{nakshatra_json}

OUTPUT — JSON object with EXACTLY these 6 keys:
{{
  "deityLegend": "<80-120 word prose paragraph telling the puranic / vedic
    story of the nakshatra's presiding deity. For Ashwini Kumaras, the
    physician-twins of the gods. For Yama (Bharani), the lord of death and
    cosmic justice. Ground in classical sources (Rig Veda, Mahabharata,
    Puranas). 1-2 paragraphs. No invented mythology.>",
  "symbolMeaning": "<50-80 word prose on what the nakshatra's symbol
    represents and what qualitative energy it confers on natives. E.g.
    Ashwini's horse-head = velocity, healing, dawn-light. Bharani's
    yoni = receptacle, gestation, transformation through restraint.>",
  "personalityTraits": [
    "<short bullet 1 — observable trait drawn from classical Jyotish texts
    on this nakshatra. 8-18 words.>",
    "<short bullet 2>",
    "<short bullet 3>",
    "<short bullet 4>",
    "<optional bullet 5>"
  ],
  "nameThemes": "<40-60 word prose on what categories of name-meanings
    work well for this nakshatra's children, anchored in the deity +
    symbol + nature above. E.g. for Ashwini: names invoking speed,
    healing, twins, dawn, divine messengers.>",
  "famousBearers": "<30-40 word prose noting 1-3 well-attested public
    figures born under this nakshatra. Only include if the natal data is
    publicly recorded and verifiable. If uncertain, return an empty
    string and the field will be omitted on render.>",
  "namingTradition": "<40-60 word prose on naming customs specific to
    this nakshatra — gender preferences, sound qualities to favour,
    syllable-position observations, regional variations. Classical
    Jyotish sources may include observations on pada (quarter)
    sensitivity.>"
}}

Rules:
- Output ONLY the JSON object, no markdown fences, no commentary.
- British English spelling (colour, behaviour, recognise, etc.).
- Use canonical Sanskrit names for deities and planets.
- Tone: knowledgeable Jyotish-and-mythology educator, not a
  fortune-teller. Avoid "destiny", "must", "always"; prefer "tends to",
  "often", "typically".
- famousBearers: if you cannot name a person with high confidence in
  their natal data, return "" — DO NOT invent.
- All 27 nakshatras must be uniquely distinguishable from this output;
  no templated phrasing.
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


def gemini_generate(token: str, nakshatra_record: dict) -> dict:
    prompt = PROMPT_TEMPLATE.format(nakshatra_json=json.dumps(nakshatra_record, ensure_ascii=False, indent=2))
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


def flatten_to_overlay(slug: str, content: dict) -> dict[str, str]:
    out: dict[str, str] = {}
    for scalar in ('deityLegend', 'symbolMeaning', 'nameThemes', 'famousBearers', 'namingTradition'):
        v = content.get(scalar)
        if isinstance(v, str) and v.strip():
            out[f"{slug}.{scalar}"] = v.strip()
    pt = content.get('personalityTraits') or []
    if isinstance(pt, list):
        for i, item in enumerate(pt):
            if isinstance(item, str) and item.strip():
                out[f"{slug}.personalityTraits.{i}"] = item.strip()
    return out


def _persist(merged: dict[str, str]) -> None:
    tmp = OUT_PATH.with_suffix(".json.tmp")
    tmp.write_text(json.dumps(merged, ensure_ascii=False, indent=2, sort_keys=True), encoding="utf-8")
    tmp.replace(OUT_PATH)


def process_one(slug: str, record: dict, token: str) -> dict[str, str]:
    try:
        content = gemini_generate(token, record)
        return flatten_to_overlay(slug, content)
    except Exception as e:
        print(f"  [{slug}] FAILED: {e}", file=sys.stderr)
        return {}


def main() -> int:
    if not JOBS_FILE.exists():
        print(f"jobs file missing: {JOBS_FILE}", file=sys.stderr)
        return 1
    jobs = json.loads(JOBS_FILE.read_text(encoding="utf-8"))
    print(f"Total nakshatras: {len(jobs)}")

    merged: dict[str, str] = {}
    if OUT_PATH.exists():
        try:
            merged = json.loads(OUT_PATH.read_text(encoding="utf-8"))
            if not isinstance(merged, dict):
                merged = {}
        except json.JSONDecodeError:
            merged = {}
    print(f"Existing overlay entries: {len(merged)}")

    existing_slugs = {k.split(".")[0] for k in merged.keys()}
    todo = [(s, r) for (s, r) in jobs.items() if s not in existing_slugs]
    print(f"To generate: {len(todo)} nakshatras")

    if not todo:
        print("Nothing to do.")
        return 0

    token = get_access_token()
    print(f"ADC token: {token[:20]}...")

    PERSIST_EVERY = 3
    done_since_persist = 0
    with concurrent.futures.ThreadPoolExecutor(max_workers=6) as ex:
        futures = {ex.submit(process_one, slug, rec, token): slug for slug, rec in todo}
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
