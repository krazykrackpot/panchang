#!/usr/bin/env python3
"""
Generate 4 deep-extras fields per nakshatra-pada via Gemini 2.5 Flash on
Vertex AI. Output: src/lib/constants/nakshatra-pada-deep-extras.json
keyed by "<nakshatraId>-<pada>" → {mythologicalContext, strengthsWeaknesses,
partnerCompatibility, classicalReference}, each shape {en: string}.

Inputs: the 108 padas (27 nakshatras × 4 padas). For each pada we pass
Gemini the existing profile context (nakshatra name, deity, ruler,
syllable, element, navamsha-rashi, personality summary) so the new
fields are grounded in canonical data, not invented.

Why 4 new fields:
  mythologicalContext   ~80-120 words — puranic backstory anchoring
    this specific deity + pada combination.
  strengthsWeaknesses   ~80-120 words — flowing prose pairing 3-4
    strengths with corresponding shadows. NOT a list.
  partnerCompatibility  ~80-120 words — which nakshatra/pada types
    pair well, grounded in navamsha rashi + element + lordship.
  classicalReference    ~50-80 words — paraphrase of BPHS / Brihat
    Samhita / Phaladeepika on this nakshatra (sometimes pada-specific).

The 4 fields together add ~300-400 words per page. Combined with the
existing ~260w shell, each pada page lands in the safe 600-700w range.
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
OUT_FILE = ROOT / "src/lib/constants/nakshatra-pada-deep-extras.json"
PROJECT = "dekhopanchang"
MODEL = "gemini-2.5-flash"
ENDPOINT = (
    f"https://us-central1-aiplatform.googleapis.com/v1/projects/"
    f"{PROJECT}/locations/us-central1/publishers/google/models/"
    f"{MODEL}:generateContent"
)

PROMPT_TEMPLATE = """You are authoring deep enrichment content for a Vedic-
astrology educational website page on a single nakshatra-pada. Output
4 narrative fields that distinguish this particular pada's character
from the other 107.

INPUT — canonical pada record:
{record_json}

OUTPUT — JSON object with EXACTLY these 4 keys:
{{
  "mythologicalContext": "<80-120 word prose describing the puranic /
    vedic backstory of this deity + nakshatra + pada combination.
    Reference the deity's signature episode (e.g. for Ashwini Kumaras,
    the horse-headed physician-twins of the gods; for Bharani, Yama's
    role in death + cosmic justice; for Kṛttikā, Agni and the Pleiades).
    Tie it to the pada's navamsha sign + ruler if the connection is
    classical. Stay grounded in mainstream sources (Rig Veda, Mahabharata,
    Puranas) — do not invent mythology.>",
  "strengthsWeaknesses": "<80-120 word flowing prose paragraph pairing
    3-4 strengths native to this pada with 3-4 corresponding shadows or
    weaknesses. NOT a list — a single prose paragraph that frames each
    strength alongside its tradeoff (e.g. 'their tireless drive translates
    into burnout if unchecked'). Anchored in the pada's element, navamsha
    sign + nakshatra ruler.>",
  "partnerCompatibility": "<80-120 words on which nakshatra/pada types
    make natural romantic and creative partners for this pada. Ground
    in classical kuta matching principles — yoni (animal compatibility),
    gana (deva/manushya/rakshasa harmony), nadi (humour balance), and
    the navamsha-rashi + element dynamics. Mention 2-3 compatible
    nakshatras by name where this nakshatra has known classical
    affinities. Realistic — note frictions, not just glowing pairings.>",
  "classicalReference": "<50-80 word paraphrase of what BPHS (Brihat
    Parashara Hora Shastra), Brihat Samhita, or Phaladeepika say about
    this nakshatra (and the pada when classical sources mention it
    specifically). Name the source. If you cannot recall a specific
    classical citation for this nakshatra with high confidence, return
    an empty string rather than inventing one.>"
}}

Rules:
- Output ONLY the JSON object, no markdown fences, no commentary.
- British English spelling.
- Knowledgeable Jyotish + mythology educator register — measured,
  scholarly, not new-age.
- Use canonical Sanskrit terms (nakshatra, pada, navamsha, ruler,
  vahana, deity names) without italicising inline.
- Each of the 108 padas must read uniquely — no templated phrasing
  across siblings. Use the input's specific nakshatra+pada+navamsha+
  element combination to anchor each output.
- classicalReference: when no citation comes to mind with confidence,
  return "" — DO NOT invent a verse.
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


def gemini_generate(record: dict) -> dict:
    prompt = PROMPT_TEMPLATE.format(record_json=json.dumps(record, ensure_ascii=False, indent=2))
    body = {
        "contents": [{"role": "user", "parts": [{"text": prompt}]}],
        "generationConfig": {
            "responseMimeType": "application/json",
            "temperature": 0.4,
            # 4096 covers 4 fields × ~120 words × ~5 tokens/word with
            # JSON-encoding overhead — 2048 was tripping "Unterminated
            # string" on long puranic references during the first pass.
            "maxOutputTokens": 4096,
        },
    }
    body_bytes = json.dumps(body, ensure_ascii=False).encode("utf-8")
    for attempt in range(3):
        try:
            # Fetch the ADC token per attempt — gcloud caches/refreshes
            # locally and the call is ~50ms, so the overhead is trivial.
            # Avoids 401s on long-running batches where a single startup
            # token expires mid-run (Gemini PR review HIGH).
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
            required = {"mythologicalContext", "strengthsWeaknesses", "partnerCompatibility", "classicalReference"}
            if not required.issubset(parsed.keys()):
                raise RuntimeError(f"missing keys: {sorted(required - set(parsed.keys()))}")
            return parsed
        except urllib.error.HTTPError as e:
            try:
                body_excerpt = e.read().decode("utf-8", errors="replace")[:300]
            except Exception:
                body_excerpt = "(unreadable body)"
            if attempt == 2:
                print(f"  HTTP {e.code}: {body_excerpt}", file=sys.stderr, flush=True)
                raise
            print(f"  retry {attempt+1} HTTP {e.code}: {body_excerpt[:150]}", file=sys.stderr, flush=True)
            time.sleep(2 ** attempt)
        except (urllib.error.URLError, json.JSONDecodeError, KeyError, IndexError, TypeError, RuntimeError) as e:
            if attempt == 2:
                raise
            print(f"  retry {attempt+1}: {str(e)[:120]}", file=sys.stderr, flush=True)
            time.sleep(2 ** attempt)
    raise RuntimeError("unreachable")


def _persist(merged: dict) -> None:
    tmp = OUT_FILE.with_suffix(".json.tmp")
    tmp.write_text(json.dumps(merged, ensure_ascii=False, indent=2, sort_keys=True), encoding="utf-8")
    tmp.replace(OUT_FILE)


def process_one(slug: str, record: dict) -> tuple[str, dict | None]:
    try:
        parsed = gemini_generate(record)
        # Wrap each field as { en: <value> } per the type definition
        return slug, {k: {"en": v} for k, v in parsed.items() if k in (
            "mythologicalContext", "strengthsWeaknesses",
            "partnerCompatibility", "classicalReference",
        )}
    except Exception as e:
        print(f"  [{slug}] FAILED: {e}", file=sys.stderr, flush=True)
        return slug, None


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--workers", type=int, default=8)
    parser.add_argument("--jobs-file", default="/tmp/nakshatra-pada-deep-jobs.json")
    args = parser.parse_args()

    jobs_path = Path(args.jobs_file)
    if not jobs_path.exists():
        print(f"jobs file missing: {jobs_path}", file=sys.stderr)
        return 1
    jobs = json.loads(jobs_path.read_text(encoding="utf-8"))
    print(f"Total padas: {len(jobs)}", flush=True)

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
        print("Nothing to do.", flush=True)
        return 0

    # Verify gcloud auth at startup so we fail fast on missing ADC,
    # but each gemini_generate() call re-fetches the token internally
    # (gcloud caches/refreshes locally — keeps long batches alive past
    # the 1-hour token expiry).
    token = get_access_token()
    print(f"ADC token (startup probe): {token[:20]}...", flush=True)

    PERSIST_EVERY = 5
    done_since = 0
    with concurrent.futures.ThreadPoolExecutor(max_workers=args.workers) as ex:
        futures = {ex.submit(process_one, s, r): s for s, r in todo}
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
