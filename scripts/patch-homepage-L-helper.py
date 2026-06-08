#!/usr/bin/env python3
"""
Patch every L({...}) call on the homepage that is missing one or more
of te/gu/kn/mai/mr to have all 9 locales. Calls Gemini 2.5 Flash on
Vertex AI to translate from the existing en/hi anchors.

Background
----------
The 2026-06-08 translation audit found that src/app/[locale]/page.tsx
has 21 L() calls but te/gu/kn/mai/mr appear in only 1 of them (5%).
The homepage falls back to English for those 5 locales — the audit's
"Frankenstein page" complaint, confirmed real (it was wrong about the
JSON message files but right about this inline helper).

Method
------
1. Parse the file regex-style to find every L({...}, locale) object
   literal.
2. For each missing-locale call, ship en + hi to Gemini, get back
   te/gu/kn/mai/mr.
3. Surgically splice the new keys into the existing object literal,
   preserving original formatting (multi-line vs single-line).
"""
import json
import re
import subprocess
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
TARGET = ROOT / "src/app/[locale]/page.tsx"
MISSING_LOCALES = ["te", "gu", "kn", "mai", "mr"]
ENDPOINT = (
    "https://us-central1-aiplatform.googleapis.com/v1/projects/"
    "dekhopanchang/locations/us-central1/publishers/google/models/"
    "gemini-2.5-flash:generateContent"
)
LOCALE_DESCS = {
    "te": "Telugu (Telugu script, natural Telugu register, established Jyotish vocabulary)",
    "gu": "Gujarati (Gujarati script, natural Gujarati register, established Jyotish vocabulary)",
    "kn": "Kannada (Kannada script, natural Kannada register, established Jyotish vocabulary)",
    "mai": "Maithili (Devanagari, natural Maithili register — NOT Hindi; use Maithili inflection like अछि / छी / करैत)",
    "mr": "Marathi (Devanagari, natural Marathi register — NOT Hindi; use Marathi inflection like आहे / आहेत)",
}


def get_token() -> str:
    return subprocess.check_output(
        ["gcloud", "auth", "print-access-token"], text=True
    ).strip()


def gemini_translate_pairs(token: str, locale: str, locale_desc: str,
                           pairs: list[dict]) -> list[str]:
    """Given [{en, hi}, ...], return [translated, ...] for the target locale."""
    prompt = (
        f"Translate the following Vedic-astrology UI labels from English to "
        f"{locale_desc}. The Hindi version is provided as a register/voice "
        f"reference — match Hindi's tone but use the target language's own "
        f"script and natural idiom.\n\n"
        f"Rules:\n"
        f"- Output ONLY a JSON array of strings, one per input, no commentary.\n"
        f"- Preserve apostrophes in possessives (e.g. \"Today's\").\n"
        f"- Use Unicode curly quotes (“ ”) for ANY inner quotation — never "
        f"straight ASCII \" inside a string value.\n"
        f"- Sanskrit-rooted Jyotish terms (jyotish, kundali, panchang, dasha, "
        f"yoga, rashi, nakshatra) transliterate to target script using the "
        f"established Jyotish vocabulary.\n\n"
        f"Inputs (array of objects with en + hi keys):\n"
        + json.dumps(pairs, ensure_ascii=False, indent=2)
        + f"\n\nReturn a JSON array of {len(pairs)} {locale} translations, "
        f"same order as the input."
    )
    body = {
        "contents": [{"role": "user", "parts": [{"text": prompt}]}],
        "generationConfig": {
            "responseMimeType": "application/json",
            "temperature": 0.3,
            # Gemini 2.5 Flash actual cap is 65,535; 8,192 was the older
            # 1.5 Flash limit. The homepage has long-form L() values
            # (intro paragraphs) so 20 Indic translations need plenty of
            # headroom.
            "maxOutputTokens": 65535,
        },
    }
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
    raw = json.loads(proc.stdout)
    text = raw["candidates"][0]["content"]["parts"][0]["text"]
    # Three-stage extract (same as translate-messages-tier.py)
    try:
        return json.loads(text)
    except json.JSONDecodeError:
        pass
    cleaned = re.sub(r"^```(?:json)?\n?|\n?```$", "", text.strip(), flags=re.MULTILINE)
    try:
        return json.loads(cleaned)
    except json.JSONDecodeError:
        pass
    # Find first `[` and last `]` (array response)
    start = text.find("[")
    end = text.rfind("]")
    if start != -1 and end != -1 and end > start:
        try:
            return json.loads(text[start : end + 1])
        except json.JSONDecodeError:
            pass
    # Maybe Gemini returned an object like {"translations": [...]}
    obj_start = text.find("{")
    obj_end = text.rfind("}")
    if obj_start != -1 and obj_end != -1:
        try:
            obj = json.loads(text[obj_start : obj_end + 1])
            # Find the first array value
            for v in obj.values():
                if isinstance(v, list):
                    return v
        except json.JSONDecodeError:
            pass
    # Last resort — dump the raw text for diagnosis
    print(f"  Failed to parse JSON for {locale}; raw response (first 2KB):", file=sys.stderr)
    print(text[:2000], file=sys.stderr)
    raise json.JSONDecodeError("could not extract JSON array", text, 0)


def parse_l_call_keys(call_body: str) -> dict[str, str]:
    """Extract { locale: value } pairs from an L() call body.

    The TSX uses both single and double quotes interchangeably and may
    span multiple lines, so we need a forgiving extractor.
    """
    keys: dict[str, str] = {}
    # Match  locale: 'value'  OR  locale: "value"
    pattern = r"(\b(?:en|hi|sa|ta|te|bn|gu|kn|mai|mr)\b)\s*:\s*(['\"])((?:\\.|(?!\2).)*)\2"
    for m in re.finditer(pattern, call_body):
        keys[m.group(1)] = m.group(3)
    return keys


def patch_file():
    src = TARGET.read_text(encoding="utf-8")
    # Find every L({...}) — the body is non-greedy up to the matching brace.
    # Brace-balancing in a single regex is unreliable; we rely on the fact
    # that L() bodies in this file don't contain nested braces.
    pattern = re.compile(r"L\(\{([^{}]*)\}\s*,")
    calls = [(m.start(1), m.end(1), m.group(1)) for m in pattern.finditer(src)]
    print(f"Found {len(calls)} L() calls")

    # Identify the ones missing target locales
    needs_work = []
    for start, end, body in calls:
        parsed = parse_l_call_keys(body)
        if "en" not in parsed:
            continue
        missing = [L for L in MISSING_LOCALES if L not in parsed]
        if missing:
            needs_work.append({
                "start": start, "end": end, "body": body,
                "parsed": parsed, "missing": missing,
            })

    print(f"L() calls missing one or more of {MISSING_LOCALES}: {len(needs_work)}")
    if not needs_work:
        return 0

    # Build the input pairs (en + hi for each call needing work)
    pairs = []
    for w in needs_work:
        pairs.append({
            "en": w["parsed"]["en"],
            "hi": w["parsed"].get("hi", w["parsed"]["en"]),
        })

    token = get_token()
    new_values: dict[str, list[str]] = {}
    for locale in MISSING_LOCALES:
        print(f"  → translating {len(pairs)} pairs to {locale}...")
        result = gemini_translate_pairs(token, locale, LOCALE_DESCS[locale], pairs)
        if not isinstance(result, list) or len(result) != len(pairs):
            print(f"    ✗ unexpected response shape for {locale}: {type(result).__name__} len={len(result) if hasattr(result,'__len__') else '?'}")
            return 1
        new_values[locale] = result
        print(f"    ✓ {len(result)} translations")

    # Atomic string replacement: for each call, find its exact original
    # `L({...},` text and replace with `L({...with new keys...},`.
    # Each L() body in this file is unique (different content), so this
    # is safe. Process in forward order on a single working string.
    out = src
    applied = 0
    for i, w in enumerate(needs_work):
        body = w["body"]
        # Build additions: preserve multi-line vs single-line style.
        multiline = "\n" in body
        if multiline:
            first_key_match = re.search(r"\n(\s+)\b(?:en|hi)", body)
            indent = first_key_match.group(1) if first_key_match else "    "
            additions = "".join(
                f",\n{indent}{locale}: {format_value(new_values[locale][i])}"
                for locale in w["missing"]
            )
        else:
            additions = "".join(
                f", {locale}: {format_value(new_values[locale][i])}"
                for locale in w["missing"]
            )
        # Build the new body: strip trailing comma/whitespace, then append.
        trimmed_body = body.rstrip()
        ends_with_comma = trimmed_body.endswith(",")
        if ends_with_comma:
            new_body_inner = trimmed_body[:-1] + additions + ","
        else:
            new_body_inner = trimmed_body + additions
        trailing_ws = body[len(body.rstrip()):]
        new_body_with_ws = new_body_inner + trailing_ws

        # The full text we're matching is L({<body>}, — must be unique
        # because each L() call has different content. Use simple replace.
        old_text = "L({" + body + "},"
        new_text = "L({" + new_body_with_ws + "},"
        if out.count(old_text) != 1:
            print(f"  WARN call {i}: old text appears {out.count(old_text)} times — skipping",
                  file=sys.stderr)
            continue
        out = out.replace(old_text, new_text, 1)
        applied += 1

    TARGET.write_text(out, encoding="utf-8")
    print(f"\nWrote {TARGET} — patched {applied} of {len(needs_work)} calls")
    return 0 if applied == len(needs_work) else 1


def format_value(value: str) -> str:
    """Render a translated value back into TSX source as a double-quoted
    JS string with all double quotes and backslashes escaped.

    Always picking double quotes (and escaping inner ones) is simpler and
    matches the existing style in the file ("Today's Forecast" was already
    double-quoted). The script tried to be clever earlier and produced
    mixed quoting that broke JSX parsing.
    """
    escaped = value.replace("\\", "\\\\").replace('"', '\\"')
    return f'"{escaped}"'


if __name__ == "__main__":
    sys.exit(patch_file())
