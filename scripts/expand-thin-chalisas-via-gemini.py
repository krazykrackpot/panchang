#!/usr/bin/env python3
"""
Generate expanded meaning + significance text for thin chalisas via
Gemini 2.5 Flash on Vertex AI.

Reads existing chalisa entries from devotional-content.ts (extracted
into /tmp/thin-chalisa-jobs.json by extract-thin-chalisas-jobs.ts).
Writes the expanded text to /tmp/thin-chalisa-output.json keyed by
slug → {meaning, significance}.

A separate Python patcher (apply-thin-chalisa-expansions.py) reads
that output and surgically replaces the existing meaning/significance
strings in devotional-content.ts.

Target slugs: ganesh-chalisa, durga-chalisa, saraswati-chalisa,
lakshmi-chalisa, ram-chalisa, vishnu-chalisa, shani-chalisa,
bajrang-baan. Each currently renders 280-340 words; goal is
~600+ words per page (matching hanuman + shiv chalisa quality).
"""
import json
import re
import subprocess
import sys
import time
import urllib.error
import urllib.request
from pathlib import Path

JOBS_FILE = Path("/tmp/thin-chalisa-jobs.json")
OUT_FILE = Path("/tmp/thin-chalisa-output.json")
PROJECT = "dekhopanchang"
MODEL = "gemini-2.5-flash"
ENDPOINT = (
    f"https://us-central1-aiplatform.googleapis.com/v1/projects/"
    f"{PROJECT}/locations/us-central1/publishers/google/models/"
    f"{MODEL}:generateContent"
)

PROMPT_TEMPLATE = """You are expanding the educational text for a Hindu
devotional chalisa page. Current meaning + significance fields are
too short (~80-130 words each). Rewrite each to be substantially
richer (~200-300 words each), grounded in puranic, vedic, and classical
Indian sources.

INPUT — current chalisa record:
{chalisa_json}

OUTPUT — JSON object with EXACTLY two keys:
{{
  "meaning": "<200-300 word prose explanation of the chalisa's verse-by-verse
    teaching. Walk through the opening doha, the central chaupais, and the
    closing prayer. Show what each section praises and asks. Reference the
    deity's specific iconography, weapons, vahana, consorts, and major puranic
    episodes the chalisa alludes to. Output as flowing prose, paragraphs
    separated by double-newlines (\\n\\n).>",
  "significance": "<200-300 word prose on when, how, and why the chalisa is
    recited. Cover: which weekday it suits, which festival window it
    intensifies in (Navratri, Ganesh Chaturthi, Shivaratri, etc.), which
    life situations devotees turn to it for (career obstacles, illness,
    marriage, exams, fear), the recommended count of recitations,
    purification before recitation, and how it complements the deity's
    primary mantra. Mention any regional traditions (Bengal Durga Puja,
    Maharashtrian Ganesh Visarjan, etc.). Output as flowing prose,
    paragraphs separated by double-newlines (\\n\\n).>"
}}

Rules:
- Output ONLY the JSON object, no markdown fences, no commentary.
- British English spelling.
- Use canonical Sanskrit names. Italicise Sanskrit terms via single asterisks
  only if the surrounding context calls for it; otherwise plain Roman text.
- Tone: educated devotee + scholar, not new-age. Avoid hyperbole,
  guarantees, or salesy language.
- The deity's character must be portrayed accurately: e.g. Durga is the
  fierce warrior, Lakshmi is the gentle bestower, Shani is the strict
  but fair karmic teacher.
- Do not invent verses that aren't in the source chalisa text.
- For Shani Chalisa specifically: present Shani's role as karmic
  educator, not as malevolent — reflect classical Jyotish view.
- Preserve em-dashes ` – ` between clauses where they appear.
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


def gemini_generate(token: str, chalisa_record: dict) -> dict:
    prompt = PROMPT_TEMPLATE.format(chalisa_json=json.dumps(chalisa_record, ensure_ascii=False, indent=2))
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
                raise RuntimeError(f"expected object")
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


def main() -> int:
    if not JOBS_FILE.exists():
        print(f"jobs file missing: {JOBS_FILE}", file=sys.stderr)
        return 1
    jobs = json.loads(JOBS_FILE.read_text(encoding="utf-8"))
    print(f"Total chalisas to expand: {len(jobs)}")

    results: dict[str, dict] = {}
    if OUT_FILE.exists():
        try:
            results = json.loads(OUT_FILE.read_text(encoding="utf-8"))
        except json.JSONDecodeError:
            results = {}

    todo = [(s, r) for (s, r) in jobs.items() if s not in results]
    print(f"To generate: {len(todo)} slugs")

    if not todo:
        print("Nothing to do.")
        return 0

    token = get_access_token()
    print(f"ADC token: {token[:20]}...")

    for slug, record in todo:
        print(f"  [{slug}] generating...")
        try:
            results[slug] = gemini_generate(token, record)
        except Exception as e:
            print(f"  [{slug}] FAILED: {e}", file=sys.stderr)
            continue
        OUT_FILE.write_text(json.dumps(results, ensure_ascii=False, indent=2), encoding="utf-8")
        print(f"  [{slug}] OK ({len(results[slug].get('meaning',''))} + {len(results[slug].get('significance',''))} chars)")

    print(f"\nWrote {OUT_FILE} ({len(results)} chalisas)")
    return 0


if __name__ == "__main__":
    sys.exit(main())
