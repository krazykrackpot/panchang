#!/usr/bin/env python3
"""
Generate 3 editorial extras per rashi (dashaSignificance, transitsPlaybook,
luckyAndUnlucky) for the 12 zodiac signs via Gemini 2.5 Flash on
Vertex AI.

Output: src/lib/horoscope/rashi-editorial-extras.json keyed by
"<rashiId>" (1-12).

The 3 fields together add ~220-280 words per rashi to RashiArticle,
which renders on /horoscope/[rashi] + /horoscope/[rashi]/weekly +
/horoscope/[rashi]/monthly — 36 page surfaces × 9 locales = 324
surfaces benefit from each rashi's update.
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
OUT_FILE = ROOT / "src/lib/horoscope/rashi-editorial-extras.json"
PROJECT = "dekhopanchang"
ENDPOINT = (
    f"https://us-central1-aiplatform.googleapis.com/v1/projects/"
    f"{PROJECT}/locations/us-central1/publishers/google/models/"
    f"gemini-2.5-flash:generateContent"
)

RASHIS = [
    {"id": 1, "vedic": "Mesh", "western": "Aries", "element": "Fire", "lord": "Mars (Mangal)"},
    {"id": 2, "vedic": "Vrishabh", "western": "Taurus", "element": "Earth", "lord": "Venus (Shukra)"},
    {"id": 3, "vedic": "Mithun", "western": "Gemini", "element": "Air", "lord": "Mercury (Budha)"},
    {"id": 4, "vedic": "Kark", "western": "Cancer", "element": "Water", "lord": "Moon (Chandra)"},
    {"id": 5, "vedic": "Simha", "western": "Leo", "element": "Fire", "lord": "Sun (Surya)"},
    {"id": 6, "vedic": "Kanya", "western": "Virgo", "element": "Earth", "lord": "Mercury (Budha)"},
    {"id": 7, "vedic": "Tula", "western": "Libra", "element": "Air", "lord": "Venus (Shukra)"},
    {"id": 8, "vedic": "Vrishchik", "western": "Scorpio", "element": "Water", "lord": "Mars (Mangal); modern: Ketu"},
    {"id": 9, "vedic": "Dhanu", "western": "Sagittarius", "element": "Fire", "lord": "Jupiter (Guru)"},
    {"id": 10, "vedic": "Makar", "western": "Capricorn", "element": "Earth", "lord": "Saturn (Shani)"},
    {"id": 11, "vedic": "Kumbh", "western": "Aquarius", "element": "Air", "lord": "Saturn (Shani); modern: Rahu"},
    {"id": 12, "vedic": "Meen", "western": "Pisces", "element": "Water", "lord": "Jupiter (Guru); modern: Ketu"},
]

PROMPT_TEMPLATE = """You are authoring editorial enrichment for a single
rashi's horoscope hub page. Output 3 narrative fields that round out
the existing personality / ruler / element / strengths / compatibility
sections already on the page.

INPUT — rashi record:
{record_json}

OUTPUT — JSON object with EXACTLY these 3 keys:
{{
  "dashaSignificance": "<80-100 word prose on how this rashi's lord
    shapes life chapters when its mahadasha or antardasha is active.
    Cite the Vimshottari dasha length of that planet (e.g. Mars 7
    years, Jupiter 16, Saturn 19), the houses it tends to activate
    for this sign's natives, and the life themes that surface. Use
    the lord's Sanskrit + English name first reference.>",
  "transitsPlaybook": "<80-100 word prose on which planet's gocharas
    (transits) carry the most weight for this rashi's natives,
    typically Sade Sati / Saturn transits over the moon, Jupiter
    transits through key kendras / trikonas, Rahu-Ketu axis shifts.
    Name the planet, the houses to watch, and what to brace for or
    leverage. Practical Jyotish reading register.>",
  "luckyAndUnlucky": "<60-80 word prose listing lucky colours, lucky
    gemstones (with Sanskrit name), lucky weekday, and 2-3 short do /
    don't items rooted in classical advice for this sign. Flowing
    prose, not a bullet list. The lucky/unlucky number tradition
    varies by source — only mention numbers if classical citation
    supports it for this sign.>"
}}

Rules:
- Output ONLY the JSON object, no markdown fences, no commentary.
- British English spelling.
- Knowledgeable Jyotish educator register — measured, classical,
  practical. Avoid hyperbole. No "destined", no "soulmate".
- Use canonical Sanskrit terms (rashi, lord, mahadasha, gochara,
  navamsha) without italicising inline.
- Each of the 12 rashis must read uniquely. Use the input's specific
  rashi name + element + lord to anchor the output.
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
            required = {"dashaSignificance", "transitsPlaybook", "luckyAndUnlucky"}
            if not required.issubset(parsed.keys()):
                raise RuntimeError(f"missing keys: {sorted(required - set(parsed.keys()))}")
            return parsed
        except urllib.error.HTTPError as e:
            if attempt == 2:
                body_excerpt = e.read().decode("utf-8", errors="replace")[:200]
                print(f"  HTTP {e.code}: {body_excerpt}", file=sys.stderr, flush=True)
                raise
            time.sleep(2 ** attempt)
        except Exception as e:
            if attempt == 2:
                raise
            time.sleep(2 ** attempt)
    raise RuntimeError("unreachable")


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--workers", type=int, default=4)
    args = parser.parse_args()

    merged: dict = {}
    if OUT_FILE.exists() and OUT_FILE.stat().st_size > 4:
        try:
            merged = json.loads(OUT_FILE.read_text(encoding="utf-8"))
        except json.JSONDecodeError:
            merged = {}
    print(f"Existing entries: {len(merged)}", flush=True)

    todo = [r for r in RASHIS if str(r["id"]) not in merged]
    print(f"To generate: {len(todo)}", flush=True)
    if not todo:
        return 0

    token = get_access_token()
    print(f"ADC token: {token[:20]}...", flush=True)

    def process_one(r):
        try:
            parsed = gemini_generate(token, r)
            return str(r["id"]), {k: {"en": v} for k, v in parsed.items() if k in (
                "dashaSignificance", "transitsPlaybook", "luckyAndUnlucky",
            )}
        except Exception as e:
            print(f"  [{r['vedic']}] FAILED: {e}", file=sys.stderr, flush=True)
            return str(r["id"]), None

    with concurrent.futures.ThreadPoolExecutor(max_workers=args.workers) as ex:
        futures = {ex.submit(process_one, r): r for r in todo}
        for i, fut in enumerate(concurrent.futures.as_completed(futures), 1):
            rid, parsed = fut.result()
            if parsed is not None:
                merged[rid] = parsed
                print(f"  [{i}/{len(todo)}] rashi {rid}: OK", flush=True)

    tmp = OUT_FILE.with_suffix(".json.tmp")
    tmp.write_text(json.dumps(merged, ensure_ascii=False, indent=2, sort_keys=True), encoding="utf-8")
    tmp.replace(OUT_FILE)
    print(f"\nWrote {OUT_FILE} ({len(merged)} entries)", flush=True)
    return 0


if __name__ == "__main__":
    sys.exit(main())
