#!/usr/bin/env python3
"""
Generic next-intl message-file translator. Reusable across Tier 2/3 of the
2026-06-07 translation audit (see memory project-translation-audit-2026-06-07).

Improvements over translate-tier1-interpretation-panchang-city.py (the
single-purpose Tier-1 script). Addresses every issue Gemini flagged on
PR #512 round-3:

  1. maxOutputTokens lowered to 8192 (the documented Gemini 2.5 Flash
     output cap). Earlier 65535 worked empirically for the Tier-1 payload
     but is technically over-spec; chunking by FILE × LOCALE keeps each
     response well within 8192.
  2. encoding='utf-8' explicit on every file read and write — non-ASCII
     scripts (Tamil, Bengali, Devanagari, etc.) corrupt on Windows
     without this.
  3. get_access_token wraps gcloud in try/except with an actionable
     error message — common new-user failure mode.
  4. subprocess.run failures surface the captured stderr/stdout instead
     of a bare CalledProcessError (Vertex AI error bodies live there).
  5. JSON extraction uses first-{ / last-} substring before regex
     fallback — defensive against LLMs that occasionally prefix with
     'Here is the JSON:' despite system instructions.

Usage:
  python3 scripts/translate-messages-tier.py FILE [FILE ...]

  # Tier 2 example (10 learn modules):
  python3 scripts/translate-messages-tier.py \\
    src/messages/learn/planets.json \\
    src/messages/learn/eclipses.json \\
    src/messages/learn/tithis.json \\
    ...

Per call: ONE file × ONE locale. So N files × 7 non-Hindi locales = 7N
API calls. Slower than Tier-1's batched approach but keeps output under
the 8192-token cap and isolates any per-file failures.

Writes directly into the src/messages JSON file. Only locale values that
are CURRENTLY shadows (== en) or missing get overwritten — existing real
translations are preserved.
"""
from __future__ import annotations

import argparse
import json
import re
import subprocess
import sys
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

LOCALES: dict[str, str] = {
    "ta": "Tamil (Tamil script, natural Tamil register; established Tamil Jyotish: ராசி/கிரகம்/நட்சத்திரம்/லக்னம்/தசை/பாவம்)",
    "te": "Telugu (Telugu script, natural Telugu register; established Telugu Jyotish: రాశి/గ్రహం/నక్షత్రం/లగ్నం/దశ/భావం)",
    "bn": "Bengali (Bengali script, natural Bengali register; established Bengali Jyotish: রাশি/গ্রহ/নক্ষত্র/লগ্ন/দশা/ভাব)",
    "gu": "Gujarati (Gujarati script, natural Gujarati register; established Gujarati Jyotish: રાશિ/ગ્રહ/નક્ષત્ર/લગ્ન/દશા/ભાવ)",
    "kn": "Kannada (Kannada script, natural Kannada register; established Kannada Jyotish: ರಾಶಿ/ಗ್ರಹ/ನಕ್ಷತ್ರ/ಲಗ್ನ/ದಶೆ/ಭಾವ)",
    "mai": "Maithili (Devanagari, natural Maithili register — NOT Hindi; use Maithili grammar/inflection like अछि/छी/करैत/लेल; established Jyotish: राशि/ग्रह/नक्षत्र/लग्न/दशा/भाव)",
    "mr": "Marathi (Devanagari, natural Marathi register — NOT Hindi; use Marathi inflection like आहे/आहेत/करते; established Jyotish: राशी/ग्रह/नक्षत्र/लग्न/दशा/भाव)",
}


# ────────────────────────────────────────────────────────────────────────────
# Walking message-file structure
# ────────────────────────────────────────────────────────────────────────────


def walk_leaves(obj: Any, prefix: str = ""):
    """Yield (path, locale_dict) for each locale-value leaf object."""
    if not isinstance(obj, dict):
        return
    if "en" in obj and all(isinstance(v, str) for v in obj.values()):
        yield prefix, obj
        return
    for k, v in obj.items():
        yield from walk_leaves(v, f"{prefix}.{k}" if prefix else k)


def build_payload(fp: Path) -> tuple[dict[str, str], dict[str, str]]:
    """Returns ({key: en_value}, {key: hi_value}) for the keys that
    NEED translating — i.e. keys where at least one non-hi locale is
    currently a shadow (== en) or missing.

    Earlier versions of this script sent the whole file's keys to
    Gemini and then filtered on apply, which wasted token budget on
    keys that already had real translations. For karanas.json with
    4 shadows of 102 keys, that was a 25× overhead — and tripped the
    output-token cap on Devanagari-heavy translations (Maithili
    truncated mid-paragraph on the full payload). Filtering here keeps
    the prompt tight.
    """
    data = json.loads(fp.read_text(encoding="utf-8"))
    en_payload: dict[str, str] = {}
    hi_payload: dict[str, str] = {}
    for path, leaf in walk_leaves(data):
        en = leaf["en"]
        # Include the key if ANY non-hi locale needs work. Different
        # locales may have different shadow sets in principle; in practice
        # the audit shows the shadow set is usually identical across the
        # 7 non-hi locales (a past translation batch skipped the same keys
        # everywhere). Taking the union is the safe, simple call.
        needs_work = any(
            leaf.get(L, "") == en or not leaf.get(L)
            for L in LOCALES
        )
        if needs_work:
            en_payload[path] = en
            hi_payload[path] = leaf.get("hi", "")
    return en_payload, hi_payload


# ────────────────────────────────────────────────────────────────────────────
# Auth + Gemini call
# ────────────────────────────────────────────────────────────────────────────


def get_access_token() -> str:
    try:
        return subprocess.check_output(
            ["gcloud", "auth", "print-access-token"],
            text=True,
        ).strip()
    except FileNotFoundError as e:
        print(
            "Error: `gcloud` was not found on PATH. Install Google Cloud SDK "
            "and run `gcloud auth login` + `gcloud auth application-default login`.",
            file=sys.stderr,
        )
        raise RuntimeError("gcloud missing") from e
    except subprocess.CalledProcessError as e:
        print(
            "Error: `gcloud auth print-access-token` failed. Run "
            "`gcloud auth login` to refresh credentials.",
            file=sys.stderr,
        )
        if e.stderr:
            print(f"  gcloud stderr: {e.stderr}", file=sys.stderr)
        raise RuntimeError("gcloud auth failed") from e


def extract_json(text: str) -> dict[str, str]:
    """Three-stage decoder for LLM output:
      1. Direct json.loads
      2. Strip ``` fences and retry
      3. Substring between first `{` and last `}` and retry

    Anything LLM-shaped (conversational prefix/suffix, markdown wrappers,
    trailing commas — well, no, json.loads is still strict on trailing
    commas) gets normalised before raising.
    """
    try:
        return json.loads(text)
    except json.JSONDecodeError:
        pass
    cleaned = re.sub(r"^```(?:json)?\n?|\n?```$", "", text.strip(), flags=re.MULTILINE)
    try:
        return json.loads(cleaned)
    except json.JSONDecodeError:
        pass
    start = text.find("{")
    end = text.rfind("}")
    if start != -1 and end != -1 and end > start:
        return json.loads(text[start : end + 1])
    raise json.JSONDecodeError("could not extract JSON from response", text, 0)


def gemini_translate(
    token: str,
    locale: str,
    locale_desc: str,
    en_payload: dict[str, str],
    hi_payload: dict[str, str],
    file_label: str,
) -> dict[str, str]:
    prompt = (
        f"You are translating Vedic-astrology UI copy from English to {locale_desc}.\n\n"
        f"The Hindi translations are provided as REFERENCE for register and "
        f"terminology — match the formality level and astrological vocabulary "
        f"choices Hindi made, transposed into the target language's script and "
        f"natural idiom. Do NOT copy Hindi text directly into a non-Devanagari "
        f"script.\n\n"
        f"Source file: {file_label}\n\n"
        f"Rules:\n"
        f"1. Output ONLY a JSON object (no markdown fences, no commentary).\n"
        f"2. Output keys must EXACTLY match the input keys.\n"
        f"3. Preserve any embedded HTML tags (<strong>, <br>, etc.) verbatim.\n"
        f"4. Preserve any {{placeholder}} interpolations exactly.\n"
        f"5. Preserve newline characters (\\n) and any literal HTML entities.\n"
        f"6. Sanskrit-rooted Jyotish terms (yoga, dasha, lagna, rashi, "
        f"nakshatra, graha, masa, tithi, karana, varga, ashtakavarga, etc.) "
        f"should be transliterated to the target script using established "
        f"Jyotish vocabulary, not given English Anglicized spelling.\n"
        f"7. Keep canonical planet names (Surya/Sun, Chandra/Moon, Mangal/Mars, "
        f"Budh/Mercury, Guru/Jupiter, Shukra/Venus, Shani/Saturn, Rahu, Ketu).\n\n"
        f"ENGLISH SOURCE:\n"
        + json.dumps(en_payload, ensure_ascii=False, indent=2)
        + f"\n\nHINDI REFERENCE (same keys; match this register):\n"
        + json.dumps(hi_payload, ensure_ascii=False, indent=2)
        + f"\n\nReturn the {locale} translations in the same flat-key structure as the ENGLISH SOURCE."
    )
    body = {
        "contents": [{"role": "user", "parts": [{"text": prompt}]}],
        "generationConfig": {
            "responseMimeType": "application/json",
            "temperature": 0.3,
            # Gemini 2.5 Flash on Vertex AI supports up to 65,535 output
            # tokens (NOT 8,192 — that was Gemini 1.5 Flash). Empirically
            # confirmed twice: the original Tier-1 batch returned ~30 KB
            # JSON per locale with this setting, and during the Tier-2
            # run, the 32,768 middle-ground value REPEATEDLY truncated
            # Devanagari (Maithili/Marathi) and Bengali responses
            # mid-paragraph because those scripts emit ~2-3 tokens per
            # rendered glyph. Going back to 65,535 — the actual cap —
            # because Devanagari output sizes are not a knob we can
            # tighten from this side.
            "maxOutputTokens": 65535,
        },
    }

    try:
        proc = subprocess.run(
            [
                "curl", "-s", "-f", "-X", "POST",
                "--retry", "3", "--retry-all-errors", "--retry-delay", "5",
                "--max-time", "300",
                "-H", f"Authorization: Bearer {token}",
                "-H", "Content-Type: application/json",
                ENDPOINT,
                "-d", json.dumps(body, ensure_ascii=False),
            ],
            capture_output=True, text=True, check=True,
        )
    except subprocess.CalledProcessError as e:
        print(
            f"Gemini API call failed for {file_label}:{locale} "
            f"(curl exit {e.returncode})",
            file=sys.stderr,
        )
        if e.stderr:
            print(f"  curl stderr: {e.stderr[:600]}", file=sys.stderr)
        if e.stdout:
            print(f"  api body: {e.stdout[:600]}", file=sys.stderr)
        raise RuntimeError(f"Gemini API failed for {file_label}:{locale}") from e

    raw = json.loads(proc.stdout)
    candidates = raw.get("candidates")
    if not candidates:
        # Most common cause: safety-filter block (PromptFeedback.blockReason
        # is set on raw instead of returning candidates).
        print(
            f"Gemini returned no candidates for {file_label}:{locale}",
            file=sys.stderr,
        )
        print(f"  raw: {json.dumps(raw)[:800]}", file=sys.stderr)
        raise RuntimeError(f"Gemini returned no candidates for {file_label}:{locale}")

    try:
        text = candidates[0]["content"]["parts"][0]["text"]
    except (KeyError, IndexError) as e:
        print(
            f"Gemini response structure unexpected for {file_label}:{locale}: {e}",
            file=sys.stderr,
        )
        print(f"  raw: {json.dumps(raw)[:800]}", file=sys.stderr)
        raise RuntimeError(
            f"Gemini response structure invalid for {file_label}:{locale}"
        ) from e

    try:
        return extract_json(text)
    except json.JSONDecodeError as e:
        print(
            f"Failed to parse JSON from Gemini for {file_label}:{locale}: {e}",
            file=sys.stderr,
        )
        print(f"  raw text:\n{text[:2000]}", file=sys.stderr)
        raise


# ────────────────────────────────────────────────────────────────────────────
# File mutation
# ────────────────────────────────────────────────────────────────────────────


def apply_translations(fp: Path, translations_by_locale: dict[str, dict[str, str]]) -> dict[str, int]:
    """Mutate the JSON file in place; return {locale: count_applied}."""
    data = json.loads(fp.read_text(encoding="utf-8"))
    counts = {L: 0 for L in LOCALES}
    for path, leaf in walk_leaves(data):
        en = leaf["en"]
        for L in LOCALES:
            t = translations_by_locale.get(L, {}).get(path)
            if not t:
                continue
            # Only overwrite shadows or missing values.
            if leaf.get(L) == en or not leaf.get(L):
                leaf[L] = t
                counts[L] += 1
    fp.write_text(
        json.dumps(data, ensure_ascii=False, indent=2) + "\n",
        encoding="utf-8",
    )
    return counts


def process_file(fp: Path, token: str) -> dict[str, int]:
    rel = fp.relative_to(ROOT).as_posix()
    en_payload, hi_payload = build_payload(fp)
    if not en_payload:
        print(f"\n=== {rel} — already 100% translated, skipping ===")
        return {L: 0 for L in LOCALES}
    print(f"\n=== {rel} ({len(en_payload)} shadow keys to translate) ===")

    translations_by_locale: dict[str, dict[str, str]] = {}
    for locale, desc in LOCALES.items():
        print(f"  → {locale}...", end="", flush=True)
        try:
            translations_by_locale[locale] = gemini_translate(
                token, locale, desc, en_payload, hi_payload, rel
            )
            print(f" {len(translations_by_locale[locale])} keys")
        except Exception as e:
            print(f" FAILED ({type(e).__name__})", flush=True)
            raise

    counts = apply_translations(fp, translations_by_locale)
    print(f"  Applied: {sum(counts.values())} strings ({counts})")
    return counts


def main() -> int:
    parser = argparse.ArgumentParser(
        description="Translate next-intl message files via Gemini 2.5 Flash"
    )
    parser.add_argument("files", nargs="+", type=Path,
                        help="Paths to src/messages/**/*.json files to translate")
    args = parser.parse_args()

    files = [(f if f.is_absolute() else ROOT / f) for f in args.files]
    missing = [f for f in files if not f.exists()]
    if missing:
        print(f"Error: file(s) not found: {missing}", file=sys.stderr)
        return 1

    print(f"Translating {len(files)} file(s) for {len(LOCALES)} non-Hindi locales")
    print("Fetching gcloud access token...")
    token = get_access_token()

    grand_total = 0
    for fp in files:
        try:
            counts = process_file(fp, token)
            grand_total += sum(counts.values())
        except Exception as e:
            print(f"\n✗ {fp.name} failed: {e}", file=sys.stderr)
            return 1

    print(f"\n=== Total: {grand_total} strings written across {len(files)} file(s) ===")
    return 0


if __name__ == "__main__":
    sys.exit(main())
