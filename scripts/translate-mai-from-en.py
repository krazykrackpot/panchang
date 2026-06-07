#!/usr/bin/env python3
"""
Translate /mai/ Hindi pass-through to genuine Maithili via Gemini 2.5 Flash
on Vertex AI.

Two input shapes are supported:

  1. Namespace JSON files (src/messages/{pages,components,learn}/*.json)
     Shape: { keyPath: { en, hi, mai, mr, ta, te, bn, gu, kn }, ... }
     For every leaf where `mai === hi`, re-translate from the en value and
     overwrite the mai field. All other locales untouched.

  2. Top-level monolithic locale bundles (src/messages/{en,hi,mai}.json)
     Shape: nested { key: ... } strings, one bundle per locale.
     Compare mai.json key-by-key to hi.json; for every value where they
     match, re-translate the corresponding en.json value to Maithili and
     overwrite the mai.json entry.

Usage:
  # Single namespace file
  python3 scripts/translate-mai-from-en.py src/messages/pages/panchang-inline.json

  # Top-level mai.json (special mode)
  python3 scripts/translate-mai-from-en.py --top-level

  # Dry-run — show what would change without writing
  python3 scripts/translate-mai-from-en.py --dry-run src/messages/pages/panchang-inline.json

Output is written back in place; review the diff before committing.

Background — why this exists:
  /mai/ pages render predominantly Hindi text because the original /mai/
  translations were copy-pasted from /hi/. That triggers Google's
  duplicate-content classifier on the /mai/ vs /hi/ pair. Trace: see
  scripts/audit-mai-parity.mjs for the gap inventory.
"""
import argparse
import json
import re
import subprocess
import sys
import time
from pathlib import Path
from typing import Any

ROOT = Path(__file__).resolve().parent.parent
PROJECT = "dekhopanchang"
MODEL = "gemini-2.5-flash"
ENDPOINT = (
    f"https://us-central1-aiplatform.googleapis.com/v1/projects/"
    f"{PROJECT}/locations/us-central1/publishers/google/models/"
    f"{MODEL}:generateContent"
)

LOCALE_DESC_MAI = (
    "Maithili (Devanagari script). Use authentic Maithili register — "
    "this MUST be distinct from Hindi. Use Maithili-specific particles "
    "and forms wherever possible: -क instead of -का (genitive: दिनक not "
    "दिन का); -ओ instead of -और (conjunction); के लेल instead of के लिए "
    "(for); छी / अछि / रहल अछि forms; आ for 'and'; ई for 'this'; ओ for "
    "'that'; की instead of क्या in interrogatives. Retain Sanskrit "
    "Jyotish technical terms in Devanagari (तिथि, नक्षत्र, राशि, ग्रह, "
    "मुहूर्त, etc.) since these are canonical across all Indic registers. "
    "But every other word — verbs, pronouns, postpositions, conjunctions, "
    "adjectives — should be Maithili, NOT Hindi. The output strings will "
    "be compared character-by-character against the Hindi version, and if "
    "they match Google's duplicate-content classifier will flag the page. "
    "Where Hindi and Maithili genuinely share a word (e.g. राशि), keep it; "
    "where they diverge, prefer the Maithili form."
)


def get_access_token() -> str:
    try:
        return subprocess.check_output(
            ["gcloud", "auth", "print-access-token"], text=True
        ).strip()
    except FileNotFoundError as e:
        raise RuntimeError(
            "gcloud CLI not found on PATH. Install + run `gcloud auth login` "
            "and `gcloud config set project dekhopanchang` first."
        ) from e
    except subprocess.CalledProcessError as e:
        raise RuntimeError(
            "gcloud auth print-access-token failed — re-authenticate via "
            "`gcloud auth login` (or `gcloud auth application-default login` "
            "for ADC)."
        ) from e


def chunked_by_size(texts: list[str], max_count: int = 60, max_chars: int = 8000) -> list[tuple[int, list[str]]]:
    """
    Yield (start_index, batch) pairs. A new batch starts when EITHER the
    leaf count hits `max_count` OR cumulative chars hit `max_chars`. The
    Bhaskaracharya/Newton quiz modules contain leaves of 1.5–2KB each; a
    flat-count chunking at 60 sent ~80KB prompts that triggered curl
    error 56 (network receive failure). 8KB/chunk keeps prompts well
    under any Vertex AI request-size soft limit.
    """
    out: list[tuple[int, list[str]]] = []
    start = 0
    batch: list[str] = []
    batch_chars = 0
    for i, t in enumerate(texts):
        if batch and (len(batch) >= max_count or batch_chars + len(t) > max_chars):
            out.append((start, batch))
            start = i
            batch = []
            batch_chars = 0
        batch.append(t)
        batch_chars += len(t)
    if batch:
        out.append((start, batch))
    return out


def gemini_translate_batch(
    token: str,
    texts: list[str],
    chunk: int = 60,
) -> list[str]:
    """Translate a flat list of EN strings to Maithili. Order preserved."""
    out: list[str] = []
    chunks = chunked_by_size(texts, max_count=chunk, max_chars=8000)
    for chunk_start, batch in chunks:
        i = chunk_start  # preserve original semantics for error messages
        prompt = (
            f"Translate the following English Vedic-astrology / panchang "
            f"interface strings to {LOCALE_DESC_MAI}\n\n"
            f"Rules:\n"
            f"- Output ONLY a JSON object. No markdown fences, no commentary.\n"
            f"- Keys must be identical to the input keys (stringified indices).\n"
            f"- Preserve interpolation placeholders like {{name}}, {{date}}, "
            f"{{count}} verbatim — do not translate them.\n"
            f"- Preserve em-dash spacing ` – ` and short labels concise.\n"
            f"- Mantras (`Om ... Namah`) stay in Sanskrit transliteration in "
            f"Devanagari.\n"
            f"- If the source is a single common word like 'Home' / 'Settings' "
            f"/ 'Search', use the canonical Maithili word in Devanagari, NOT "
            f"the Hindi equivalent if they differ.\n\n"
            f"Input:\n"
            + json.dumps(
                {str(j): t for j, t in enumerate(batch)},
                ensure_ascii=False,
                indent=2,
            )
        )
        body = {
            "contents": [{"role": "user", "parts": [{"text": prompt}]}],
            "generationConfig": {
                "responseMimeType": "application/json",
                "temperature": 0.3,
                "maxOutputTokens": 65536,
            },
        }
        # Retry on transient curl/Gemini errors. Error 56 (receive failure)
        # has been seen on large prompts even within our 8KB chunk budget;
        # back off + retry covers it. After 3 failures, halve the batch and
        # recurse — splits an unrecoverably-large chunk in half automatically.
        last_err = None
        for attempt in range(3):
            try:
                proc = subprocess.run(
                    [
                        "curl",
                        "-s",
                        "-f",
                        "--max-time", "120",
                        "-X",
                        "POST",
                        "-H",
                        f"Authorization: Bearer {token}",
                        "-H",
                        "Content-Type: application/json",
                        ENDPOINT,
                        "-d",
                        json.dumps(body, ensure_ascii=False),
                    ],
                    capture_output=True,
                    text=True,
                    check=True,
                )
                break
            except subprocess.CalledProcessError as e:
                last_err = e
                wait = 2 ** attempt
                print(f"  curl failed (exit {e.returncode}) chunk {i}, retry {attempt+1}/3 in {wait}s", file=sys.stderr)
                time.sleep(wait)
        else:
            # All retries failed. If batch > 1, halve and recurse.
            if len(batch) > 1:
                mid = len(batch) // 2
                print(f"  halving chunk {i}: {len(batch)} → {mid} + {len(batch)-mid}", file=sys.stderr)
                left = gemini_translate_batch(token, batch[:mid], chunk=chunk)
                right = gemini_translate_batch(token, batch[mid:], chunk=chunk)
                out.extend(left)
                out.extend(right)
                continue
            else:
                raise RuntimeError(f"Single-leaf chunk failed after retries: {batch[0][:80]!r}") from last_err
        raw = json.loads(proc.stdout)
        # Defensive unpacking — Gemini returns `candidates: []` (no entries)
        # when a prompt trips a safety filter / recitation block. Bare
        # raw["candidates"][0] would IndexError instead of producing a
        # readable error for the operator.
        candidates = raw.get("candidates")
        if not candidates:
            print(
                f"Gemini error (chunk {i}):",
                json.dumps(raw)[:500],
                file=sys.stderr,
            )
            raise RuntimeError(
                f"Gemini returned no candidates for chunk {i} (safety filter, "
                f"recitation block, or empty response). First batch leaf: "
                f"{batch[0][:80]!r}"
            )
        parts = candidates[0].get("content", {}).get("parts")
        if not parts or "text" not in parts[0]:
            raise RuntimeError(
                f"Gemini candidate has no text part for chunk {i}: "
                f"{json.dumps(candidates[0])[:300]}"
            )
        text = parts[0]["text"]
        try:
            parsed = json.loads(text)
        except json.JSONDecodeError:
            text = re.sub(
                r"^```(?:json)?\n?|\n?```$", "", text.strip(), flags=re.MULTILINE
            )
            parsed = json.loads(text)
        for j in range(len(batch)):
            key = str(j)
            if key not in parsed:
                raise RuntimeError(f"Missing translation index {j} in chunk {i}")
            out.append(parsed[key])
    return out


# =============================================================================
# Mode A: namespace JSON files
# =============================================================================

def is_locale_leaf(node: Any) -> bool:
    """A leaf shaped as { en: '...', hi: '...', mai: '...', ... }."""
    return (
        isinstance(node, dict)
        and "en" in node
        and isinstance(node["en"], str)
    )


def collect_dup_hi_leaves(node: Any, path: list[str] = None, out: list = None):
    """
    Walk the tree, returning every (path, leaf-dict) where mai is missing
    or mai === hi (Hindi pass-through). These are the leaves we need to
    re-translate. Recurses into both dicts AND lists — namespace files
    like learn/modules/9-1.json wrap leaves inside a `crossRefs[]` array.
    """
    if path is None:
        path = []
    if out is None:
        out = []
    if is_locale_leaf(node):
        mai = node.get("mai")
        hi = node.get("hi")
        if mai is None or (hi is not None and mai == hi):
            out.append((".".join(path), node))
    elif isinstance(node, dict):
        for k, v in node.items():
            collect_dup_hi_leaves(v, path + [k], out)
    elif isinstance(node, list):
        for i, v in enumerate(node):
            collect_dup_hi_leaves(v, path + [f"[{i}]"], out)
    return out


def translate_namespace_file(path: Path, token: str, dry_run: bool):
    obj = json.loads(path.read_text(encoding="utf-8"))
    leaves = collect_dup_hi_leaves(obj)
    if not leaves:
        print(f"  {path}: no dup_hi leaves — skipping")
        return
    en_strings = [leaf["en"] for _key, leaf in leaves]
    print(f"  {path}: {len(leaves)} leaves to translate")
    if dry_run:
        for keypath, leaf in leaves[:5]:
            print(f"    DRY {keypath}: en={leaf['en'][:60]!r} hi={leaf.get('hi', '')[:40]!r}")
        if len(leaves) > 5:
            print(f"    ... and {len(leaves) - 5} more")
        return
    t0 = time.time()
    mai_strings = gemini_translate_batch(token, en_strings)
    elapsed = time.time() - t0
    assert len(mai_strings) == len(leaves), (
        f"Translation count mismatch: {len(mai_strings)} vs {len(leaves)}"
    )
    for (_keypath, leaf), mai_val in zip(leaves, mai_strings):
        leaf["mai"] = mai_val
    path.write_text(json.dumps(obj, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(f"    wrote {path.name} ({elapsed:.1f}s, {sum(len(s) for s in mai_strings)} chars)")


# =============================================================================
# Mode B: top-level mai.json (mai vs hi monolith compare)
# =============================================================================

def walk_flat(obj: Any, path: list[str] = None) -> list[tuple[str, str]]:
    """Walk a nested object emitting (dotted-key, str-value) pairs."""
    if path is None:
        path = []
    out: list[tuple[str, str]] = []
    if isinstance(obj, str):
        return [(".".join(path), obj)]
    if isinstance(obj, dict):
        for k, v in obj.items():
            out.extend(walk_flat(v, path + [k]))
    return out


def set_dotted(obj: dict, dotted: str, value: str):
    """Set a value at a dotted-key path inside a nested dict."""
    parts = dotted.split(".")
    cursor = obj
    for p in parts[:-1]:
        cursor = cursor[p]
    cursor[parts[-1]] = value


def translate_top_level(token: str, dry_run: bool):
    en_path = ROOT / "src/messages/en.json"
    hi_path = ROOT / "src/messages/hi.json"
    mai_path = ROOT / "src/messages/mai.json"
    en = json.loads(en_path.read_text(encoding="utf-8"))
    hi = json.loads(hi_path.read_text(encoding="utf-8"))
    mai = json.loads(mai_path.read_text(encoding="utf-8"))
    en_flat = dict(walk_flat(en))
    hi_flat = dict(walk_flat(hi))
    mai_flat = dict(walk_flat(mai))
    dup_keys: list[str] = []
    for k, mai_val in mai_flat.items():
        hi_val = hi_flat.get(k)
        if hi_val is not None and mai_val == hi_val:
            dup_keys.append(k)
    print(f"  top-level mai.json: {len(dup_keys)} keys are mai === hi")
    if not dup_keys:
        return
    en_strings = [en_flat.get(k, "") for k in dup_keys]
    if any(s == "" for s in en_strings):
        missing = [k for k, s in zip(dup_keys, en_strings) if s == ""]
        print(
            f"  WARNING: {len(missing)} dup_hi keys have no matching en.json entry; "
            f"skipping those. First 3: {missing[:3]}",
            file=sys.stderr,
        )
        kept = [(k, s) for k, s in zip(dup_keys, en_strings) if s != ""]
        dup_keys = [k for k, _ in kept]
        en_strings = [s for _, s in kept]
    if dry_run:
        for k, s in list(zip(dup_keys, en_strings))[:5]:
            print(f"    DRY {k}: en={s[:80]!r}")
        if len(dup_keys) > 5:
            print(f"    ... and {len(dup_keys) - 5} more")
        return
    t0 = time.time()
    mai_strings = gemini_translate_batch(token, en_strings)
    elapsed = time.time() - t0
    assert len(mai_strings) == len(dup_keys)
    for k, mai_val in zip(dup_keys, mai_strings):
        set_dotted(mai, k, mai_val)
    mai_path.write_text(json.dumps(mai, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(
        f"    wrote mai.json ({elapsed:.1f}s, "
        f"{sum(len(s) for s in mai_strings)} chars)"
    )


# =============================================================================
# CLI
# =============================================================================

def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("files", nargs="*", help="Namespace JSON file paths")
    ap.add_argument(
        "--top-level",
        action="store_true",
        help="Translate src/messages/mai.json (mai vs hi compare)",
    )
    ap.add_argument(
        "--dry-run",
        action="store_true",
        help="Show what would change without writing or calling Gemini",
    )
    args = ap.parse_args()
    if not args.files and not args.top_level:
        ap.error("Pass at least one file or --top-level")
    token = "" if args.dry_run else get_access_token()
    if args.top_level:
        translate_top_level(token, args.dry_run)
    for f in args.files:
        translate_namespace_file(Path(f), token, args.dry_run)


if __name__ == "__main__":
    main()
