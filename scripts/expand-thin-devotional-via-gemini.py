#!/usr/bin/env python3
"""
Expand thin devotional pages (aarti, mantra, stotram) via Gemini 2.5
Flash on Vertex AI. Mirrors expand-thin-chalisas-via-gemini.py but
parameterised for the 3 non-chalisa types.

Reads:  /tmp/devo-rescue-jobs.json (45 items extracted from
        devotional-content.ts by an inline Python extractor)
Writes: /tmp/devo-rescue-output.json keyed by `<type>/<slug>` →
        {meaning, significance}

A surgical patcher (apply-devo-expansions.py) reads the output and
replaces the existing meaning/significance bodies in
devotional-content.ts via regex match by slug+type.

Goal: lift every page from sub-300-word thin content to ~600+ words,
matching the chalisa rescue (PR #620) and yoga rescue (PR #618).
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

JOBS_FILE = Path("/tmp/devo-rescue-jobs.json")
OUT_FILE = Path("/tmp/devo-rescue-output.json")
PROJECT = "dekhopanchang"
MODEL = "gemini-2.5-flash"
ENDPOINT = (
    f"https://us-central1-aiplatform.googleapis.com/v1/projects/"
    f"{PROJECT}/locations/us-central1/publishers/google/models/"
    f"{MODEL}:generateContent"
)

# Per-type prompt variants — the genre conventions differ. Aarti is
# sung worship at the close of puja; mantra is repeated invocation
# (often single bija/seed seeds for the 9 grahas); stotram is recited
# devotional poetry (often Sanskrit, longer than chalisa).
TYPE_GUIDE = {
    "aarti": (
        "An *aarti* is a devotional song offered at the climax of puja,"
        " usually paired with a lit camphor lamp (diya) circled before the"
        " deity. The meaning should walk through the song's praise stanzas,"
        " the deity's iconography invoked, and the offering context."
        " The significance should cover when (which weekday + festival),"
        " how (lamp materials, number of circulations), and what life-stage"
        " concerns devotees turn to it for."
    ),
    "mantra": (
        "A *mantra* is a repeated Sanskrit/Vedic invocation, often a single"
        " bija (seed) syllable repeated 108 or 1008 times. For navagraha"
        " bija mantras, ground in classical Vedic-astrology theory: each"
        " graha has a designated bija (Surya: Hraam, Chandra: Shraam, etc.)"
        " and prescribed count. The meaning should explain the seed sound"
        " etymology and the graha's symbolic energy; the significance"
        " should cover japa schedule (weekday, time, mala usage), dosha"
        " indications, and the relationship to the graha's afflictions or"
        " strength in the natal chart."
    ),
    "stotram": (
        "A *stotram* is a recited devotional poem, often Sanskrit and"
        " longer than a chalisa. Sometimes a sahasranama (1000 names),"
        " kavacham (protection-shield), or named-verses praise. The meaning"
        " should walk through the stotram's major themes and the iconography"
        " of the deity invoked; the significance should cover when, by"
        " whom, and for which life-circumstances it is traditionally"
        " recited (e.g. Mahalakshmi Stotram on Diwali, Rudram during"
        " Mahashivaratri, Vishnu Sahasranama on Ekadashi)."
    ),
}

PROMPT_TEMPLATE = """You are expanding the educational text for a Hindu
devotional page. The current meaning + significance fields are thin
(under 300 visible words total on the rendered page). Rewrite each to
be substantially richer (~200-300 words each), grounded in puranic,
vedic, and classical Indian sources.

GENRE — {genre_label}: {genre_guide}

INPUT — current record:
{record_json}

OUTPUT — JSON object with EXACTLY two keys:
{{
  "meaning": "<200-300 word prose explanation of the prayer's teaching.
    Reference the deity's specific iconography, vahana, consorts, weapons,
    and the major puranic episodes the text alludes to. Walk through the
    text's opening invocation, central verses, and closing prayer. Output
    as flowing prose, paragraphs separated by double-newlines (\\n\\n).>",
  "significance": "<200-300 word prose on when, how, and why it is
    recited. Cover which weekday it suits, which festival window
    intensifies it, life situations devotees turn to it for, recommended
    count of recitations, purification before recitation, and how it
    complements primary mantras of the same deity. Mention any regional
    or sectarian traditions. Output as flowing prose, paragraphs
    separated by double-newlines (\\n\\n).>"
}}

Rules:
- Output ONLY the JSON object, no markdown fences, no commentary.
- British English spelling.
- Use canonical Sanskrit names; do not italicise inline.
- Tone: educated devotee + scholar, not new-age. No hyperbole,
  guarantees, or salesy language.
- The deity's character must be portrayed accurately.
- Do not invent verses absent from the source text.
- For graha bija mantras: present the graha as a karmic actor, not as
  malevolent — reflect classical Jyotish view.
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


def gemini_generate(token: str, item_record: dict) -> dict:
    etype = item_record.get("type", "aarti")
    genre_label = etype.upper()
    genre_guide = TYPE_GUIDE.get(etype, TYPE_GUIDE["aarti"])
    prompt = PROMPT_TEMPLATE.format(
        genre_label=genre_label,
        genre_guide=genre_guide,
        record_json=json.dumps(item_record, ensure_ascii=False, indent=2),
    )
    body = {
        "contents": [{"role": "user", "parts": [{"text": prompt}]}],
        "generationConfig": {
            "responseMimeType": "application/json",
            "temperature": 0.4,
            "maxOutputTokens": 3072,
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
                raise RuntimeError("expected object")
            if 'meaning' not in parsed or 'significance' not in parsed:
                raise RuntimeError(f"missing keys: {list(parsed.keys())}")
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


def _persist(merged: dict) -> None:
    tmp = OUT_FILE.with_suffix(".json.tmp")
    tmp.write_text(json.dumps(merged, ensure_ascii=False, indent=2), encoding="utf-8")
    tmp.replace(OUT_FILE)


def process_one(key: str, record: dict, token: str) -> tuple[str, dict | None]:
    try:
        return key, gemini_generate(token, record)
    except Exception as e:
        print(f"  [{key}] FAILED: {e}", file=sys.stderr)
        return key, None


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--workers", type=int, default=8)
    args = parser.parse_args()

    if not JOBS_FILE.exists():
        print(f"jobs file missing: {JOBS_FILE}", file=sys.stderr)
        return 1
    jobs = json.loads(JOBS_FILE.read_text(encoding="utf-8"))
    print(f"Total items: {len(jobs)}")

    results: dict[str, dict] = {}
    if OUT_FILE.exists():
        try:
            results = json.loads(OUT_FILE.read_text(encoding="utf-8"))
        except json.JSONDecodeError:
            results = {}

    todo = [(k, r) for (k, r) in jobs.items() if k not in results]
    print(f"To generate: {len(todo)} items")
    if not todo:
        print("Nothing to do.")
        return 0

    token = get_access_token()
    print(f"ADC token: {token[:20]}...")

    PERSIST_EVERY = 4
    done_since_persist = 0
    with concurrent.futures.ThreadPoolExecutor(max_workers=args.workers) as ex:
        futures = {ex.submit(process_one, k, r, token): k for k, r in todo}
        for i, fut in enumerate(concurrent.futures.as_completed(futures), 1):
            key, expansion = fut.result()
            if expansion is not None:
                results[key] = expansion
                done_since_persist += 1
                print(f"  [{i}/{len(todo)}] {key}: OK ({len(expansion.get('meaning',''))}c meaning + {len(expansion.get('significance',''))}c sig)")
            else:
                print(f"  [{i}/{len(todo)}] {key}: skipped")
            if done_since_persist >= PERSIST_EVERY:
                _persist(results)
                done_since_persist = 0
    _persist(results)
    print(f"\nWrote {OUT_FILE} ({len(results)} items)")
    return 0


if __name__ == "__main__":
    sys.exit(main())
