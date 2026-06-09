#!/usr/bin/env python3
"""
Generate 4 deep-content fields per rashi pair (78 unique unordered
pairs across the 12 rashis) via Gemini 2.5 Flash on Vertex AI.

Reads:  /tmp/rashi-pair-deep-jobs.json (extracted from RASHI +
        existing pair templates by extract-rashi-pair-deep-jobs.ts).
Writes: src/lib/constants/rashi-pair-deep-content.json keyed by
        "<lowerRashiId>-<higherRashiId>".

The 4 fields together add ~300-400 words per pair. Combined with the
existing ~360w shell, each /matching/[pair] page lands in the safe
650-750w range.

Same architecture as nakshatra-pada-deep-extras gen — 4-worker
parallel, 4096 maxOutputTokens to avoid the truncation seen with
2048 on long classical-citation outputs.
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
OUT_FILE = ROOT / "src/lib/constants/rashi-pair-deep-content.json"
PROJECT = "dekhopanchang"
ENDPOINT = (
    f"https://us-central1-aiplatform.googleapis.com/v1/projects/"
    f"{PROJECT}/locations/us-central1/publishers/google/models/"
    f"gemini-2.5-flash:generateContent"
)

PROMPT_TEMPLATE = """You are authoring deep enrichment content for a
Vedic-astrology educational website page on a single rashi pair's
compatibility. Output 4 narrative fields that distinguish this
particular pair's character from the other 77.

INPUT — canonical pair record:
{record_json}

OUTPUT — JSON object with EXACTLY these 4 keys:
{{
  "mythologicalDynamic": "<80-120 word prose on how the deities or
    archetypes of these two rashis interact in puranic / vedic
    narrative. Reference each rashi's iconography (Mesh: ram + Mars's
    fire; Vrishchik: scorpion + Mars's depth; Tula: scales + Venus's
    balance; etc.) and any classical story that connects them or
    illuminates their dynamic. Stay grounded in mainstream sources.>",
  "deepCompatibilityNotes": "<80-120 word prose going beyond the
    templated element-pair analysis. Reference kuta matching dimensions
    that are nakshatra-anchored (yoni, gana, nadi) plus the navamsha-
    lordship interplay. Frame the strengths AND specific friction
    points, not just glowing affirmations. NOT a list — flowing prose.>",
  "careerBondInsight": "<60-100 word prose on how these two rashis
    collaborate in professional or creative partnerships. Anchor in
    the planetary-lordship combination (e.g. Mars-Venus pairings
    around action+aesthetics, Mercury-Jupiter around reasoning+
    breadth). Practical, concrete — what kinds of joint ventures
    naturally suit this pair vs which need explicit boundary-setting.>",
  "growthPath": "<60-100 word prose on the karmic-growth arc this
    pairing catalyses in each native. What does the relationship
    invite each partner to develop in themselves through the friction
    + harmony with the other? Frame as mutual transformation, not
    one-sided fixing.>"
}}

Rules:
- Output ONLY the JSON object, no markdown fences, no commentary.
- British English spelling.
- Knowledgeable Jyotish + mythology educator register — measured,
  scholarly, not new-age. Avoid hyperbole, no "destined" or "soulmate".
- Use canonical Sanskrit terms (rashi, kuta, nadi, gana, navamsha,
  graha, lordship) without italicising inline.
- Each of the 78 pairs must read uniquely — no templated phrasing
  across siblings. Use the input's specific (r1, r2) combination and
  the listed planetary lords + elements + iconography to anchor each
  output.
"""


def get_access_token() -> str:
    return subprocess.check_output(
        ["gcloud", "auth", "print-access-token"], text=True
    ).strip()


def gemini_generate(token: str, record: dict) -> dict:
    prompt = PROMPT_TEMPLATE.format(record_json=json.dumps(record, ensure_ascii=False, indent=2))
    body = {
        "contents": [{"role": "user", "parts": [{"text": prompt}]}],
        "generationConfig": {
            "responseMimeType": "application/json",
            "temperature": 0.4,
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
            text = raw["candidates"][0]["content"]["parts"][0]["text"]
            try:
                parsed = json.loads(text)
            except json.JSONDecodeError:
                text = re.sub(r"^```(?:json)?\n?|\n?```$", "", text.strip(), flags=re.MULTILINE)
                parsed = json.loads(text)
            required = {"mythologicalDynamic", "deepCompatibilityNotes",
                        "careerBondInsight", "growthPath"}
            if not required.issubset(parsed.keys()):
                raise RuntimeError(f"missing keys: {sorted(required - set(parsed.keys()))}")
            return parsed
        except urllib.error.HTTPError as e:
            if attempt == 2:
                body_excerpt = e.read().decode("utf-8", errors="replace")[:200]
                print(f"  HTTP {e.code}: {body_excerpt}", file=sys.stderr, flush=True)
                raise
            print(f"  retry {attempt+1} HTTP {e.code}", file=sys.stderr, flush=True)
            time.sleep(2 ** attempt)
        except Exception as e:
            if attempt == 2:
                raise
            print(f"  retry {attempt+1}: {str(e)[:120]}", file=sys.stderr, flush=True)
            time.sleep(2 ** attempt)
    raise RuntimeError("unreachable")


def _persist(merged: dict) -> None:
    tmp = OUT_FILE.with_suffix(".json.tmp")
    tmp.write_text(json.dumps(merged, ensure_ascii=False, indent=2, sort_keys=True), encoding="utf-8")
    tmp.replace(OUT_FILE)


def process_one(slug: str, record: dict, token: str) -> tuple[str, dict | None]:
    try:
        parsed = gemini_generate(token, record)
        return slug, {k: {"en": v} for k, v in parsed.items() if k in (
            "mythologicalDynamic", "deepCompatibilityNotes",
            "careerBondInsight", "growthPath",
        )}
    except Exception as e:
        print(f"  [{slug}] FAILED: {e}", file=sys.stderr, flush=True)
        return slug, None


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--workers", type=int, default=4)
    parser.add_argument("--jobs-file", default="/tmp/rashi-pair-deep-jobs.json")
    args = parser.parse_args()

    jobs_path = Path(args.jobs_file)
    if not jobs_path.exists():
        print(f"jobs file missing: {jobs_path}", file=sys.stderr)
        return 1
    jobs = json.loads(jobs_path.read_text(encoding="utf-8"))
    print(f"Total pairs: {len(jobs)}", flush=True)

    merged: dict[str, dict] = {}
    if OUT_FILE.exists() and OUT_FILE.stat().st_size > 4:
        try:
            merged = json.loads(OUT_FILE.read_text(encoding="utf-8"))
        except json.JSONDecodeError:
            merged = {}
    print(f"Existing entries: {len(merged)}", flush=True)

    todo = [(s, r) for (s, r) in jobs.items() if s not in merged]
    print(f"To generate: {len(todo)}", flush=True)
    if not todo:
        return 0

    token = get_access_token()
    print(f"ADC token: {token[:20]}...", flush=True)

    PERSIST_EVERY = 4
    done_since = 0
    with concurrent.futures.ThreadPoolExecutor(max_workers=args.workers) as ex:
        futures = {ex.submit(process_one, s, r, token): s for s, r in todo}
        for i, fut in enumerate(concurrent.futures.as_completed(futures), 1):
            slug, parsed = fut.result()
            if parsed is not None:
                merged[slug] = parsed
                done_since += 1
                print(f"  [{i}/{len(todo)}] {slug}: OK", flush=True)
            else:
                print(f"  [{i}/{len(todo)}] {slug}: skipped", flush=True)
            if done_since >= PERSIST_EVERY:
                _persist(merged)
                done_since = 0
    _persist(merged)
    print(f"\nWrote {OUT_FILE} ({len(merged)} entries)", flush=True)
    return 0


if __name__ == "__main__":
    sys.exit(main())
