#!/usr/bin/env python3
"""
Batch-translate /horoscope cluster source strings via Gemini 2.5 Flash
on Vertex AI. Three source files contribute the corpus:

  1. src/lib/horoscope/rashi-editorial.ts
     12 rashis × 5 sections (personality, rulerInfluence, elementTraits,
     strengthsWeaknesses, compatibility) = 60 unique EN strings.

  2. src/lib/horoscope/templates.ts
     5 life areas × 3 quality tiers × 6 templates each = 90 EN strings,
     plus a handful of insight/dos/donts/luckies templates outside the
     main pools = ~120 EN strings total.

  3. src/lib/horoscope/daily-engine.ts
     Inline direction names, mantra names, etc. — ~70 EN strings, many
     are short single-word labels.

Each source file already declares the 10-locale LocaleText shape but
ships fake en/hi duplicates for the regional Indic locales. This
script generates the proper translations and emits them as overlay
JSONs — wired in by a runtime merger that mutates the LocaleText
objects in place at module load.

Output: src/lib/constants/horoscope-{locale}-overlay.json — keyed by
EN string. The runtime merger looks up each EN string and attaches
the correct `[locale]` value.
"""
import json
import re
import subprocess
import sys
import time
from pathlib import Path
from typing import Any

ROOT = Path(__file__).resolve().parent.parent
SOURCES = [
    ROOT / "src/lib/horoscope/rashi-editorial.ts",
    ROOT / "src/lib/horoscope/templates.ts",
    ROOT / "src/lib/horoscope/daily-engine.ts",
    ROOT / "src/lib/horoscope/daily-article.ts",
]
OUT_DIR = ROOT / "src/lib/constants"
PROJECT = "dekhopanchang"
MODEL = "gemini-2.5-flash"
ENDPOINT = (
    f"https://us-central1-aiplatform.googleapis.com/v1/projects/"
    f"{PROJECT}/locations/us-central1/publishers/google/models/"
    f"{MODEL}:generateContent"
)

LOCALES = {
    "mai": "Maithili (Devanagari, natural Maithili register, retain Sanskrit Jyotish terms in Devanagari)",
    "mr":  "Marathi (Devanagari, natural Marathi register, retain Sanskrit Jyotish terms in Devanagari)",
    "ta":  "Tamil (Tamil script, natural Tamil register, canonical Tamil Jyotish: லக்னம்/ராசி/கிரகம்/பாவம்/நட்சத்திரம்)",
    "te":  "Telugu (Telugu script, natural Telugu register, canonical Telugu Jyotish: లగ్నం/రాశి/గ్రహం/భావం/నక్షత్రం)",
    "kn":  "Kannada (Kannada script, natural Kannada register, canonical Kannada Jyotish: ಲಗ್ನ/ರಾಶಿ/ಗ್ರಹ/ಭಾವ/ನಕ್ಷತ್ರ)",
    "gu":  "Gujarati (Gujarati script, natural Gujarati register, canonical Gujarati Jyotish: લગ્ન/રાશિ/ગ્રહ/ભાવ/નક્ષત્ર)",
    "bn":  "Bengali (Bengali script, natural Bengali register, canonical Bengali Jyotish: লগ্ন/রাশি/গ্রহ/ভাব/নক্ষত্র)",
}


def get_access_token() -> str:
    return subprocess.check_output(
        ["gcloud", "auth", "print-access-token"], text=True
    ).strip()


def extract_en_strings(content: str) -> list[str]:
    """
    Pull every `en: '...'` (or `"..."`) value from the TS source.
    Handles multi-line strings and escaped quotes.
    """
    out: list[str] = []
    seen: set[str] = set()
    # Match en: 'string', en: "string", en: `string`. Greedy stop at the
    # closing quote followed by `,` or `\n }` to avoid eating the next
    # field. Use a backreference for the quote character.
    pattern = re.compile(
        r"\ben\s*:\s*(['\"`])((?:\\.|(?!\1).)*?)\1\s*[,}\n]",
        re.DOTALL,
    )
    for m in pattern.finditer(content):
        raw = m.group(2)
        # Unescape JS string sequences while preserving literal non-ASCII
        # characters (em-dashes, Indic scripts). `unicode_escape` decodes
        # via Latin-1, so we must round-trip through latin1 first with
        # backslashreplace to avoid mojibake (Gemini PR #496 round-1 HIGH).
        try:
            decoded = raw.encode("latin1", "backslashreplace").decode("unicode_escape")
        except (UnicodeDecodeError, UnicodeEncodeError):
            decoded = raw
        decoded = decoded.replace("\\'", "'").replace('\\"', '"').replace("\\n", "\n")
        if not decoded.strip():
            continue
        if decoded in seen:
            continue
        seen.add(decoded)
        out.append(decoded)
    return out


def gemini_translate_batch(
    token: str,
    texts: list[str],
    locale: str,
    locale_desc: str,
    chunk: int = 70,
) -> list[str]:
    """
    Translate `texts` via Gemini in chunks. Structured-JSON output;
    keys are stringified indices in the current chunk. Concatenates
    results in input order.
    """
    out: list[str] = []
    for i in range(0, len(texts), chunk):
        batch = texts[i : i + chunk]
        prompt = (
            f"Translate the following English Vedic-astrology horoscope "
            f"text to {locale_desc}.\n\n"
            f"Rules:\n"
            f"- Output ONLY a JSON object, no markdown fences, no commentary.\n"
            f"- Keys must be identical to the input.\n"
            f"- Translate proper nouns to the locale's canonical form: "
            f"rashi names (e.g. Aries→see locale's canonical rashi list), "
            f"planet names (Sun/Moon/Mars/Mercury/Jupiter/Venus/Saturn), "
            f"nakshatras (where applicable).\n"
            f"- Keep em-dash spacing ` – ` and short labels concise.\n"
            f"- Single-word labels (directions: East/West/North/South, "
            f"colours, day names) should translate to the canonical "
            f"single word in your target script.\n"
            f"- Mantras (`Om ... Namah`) stay in Sanskrit transliteration "
            f"appropriate to the target script.\n\n"
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
        proc = subprocess.run(
            [
                "curl",
                "-s",
                "-f",  # fail on HTTP 4xx/5xx (Gemini PR #496 round-1 MED)
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
        raw = json.loads(proc.stdout)
        if "candidates" not in raw:
            print(f"Gemini error ({locale} chunk {i}):", json.dumps(raw)[:500], file=sys.stderr)
            raise RuntimeError(f"Gemini call failed for {locale}")
        text = raw["candidates"][0]["content"]["parts"][0]["text"]
        try:
            parsed = json.loads(text)
        except json.JSONDecodeError:
            text = re.sub(
                r"^```(?:json)?\n?|\n?```$", "", text.strip(), flags=re.MULTILINE
            )
            parsed = json.loads(text)
        chunk_out: list[str] = []
        for j in range(len(batch)):
            key = str(j)
            if key not in parsed:
                raise RuntimeError(f"Missing translation index {j} in {locale} chunk {i}")
            chunk_out.append(parsed[key])
        out.extend(chunk_out)
    return out


def main() -> None:
    all_strings: list[str] = []
    seen: set[str] = set()
    by_file: dict[str, list[str]] = {}
    for src in SOURCES:
        if not src.exists():
            print(f"  skip missing source: {src}")
            continue
        contents = src.read_text()
        strings = extract_en_strings(contents)
        deduped: list[str] = []
        for s in strings:
            if s in seen:
                continue
            seen.add(s)
            deduped.append(s)
            all_strings.append(s)
        by_file[str(src.relative_to(ROOT))] = deduped
        print(f"  {src.name}: {len(strings)} raw → {len(deduped)} unique-new")

    print(f"Total unique EN strings: {len(all_strings)}")

    token = get_access_token()
    for locale, locale_desc in LOCALES.items():
        out_path = OUT_DIR / f"horoscope-{locale}-overlay.json"
        if out_path.exists():
            existing = json.loads(out_path.read_text())
            translations = existing.get("translations", {})
            if len(translations) >= len(all_strings):
                print(f"  skip {locale}: overlay complete")
                continue
        print(f"Translating to {locale} ({len(all_strings)} strings)...")
        t0 = time.time()
        translations = gemini_translate_batch(token, all_strings, locale, locale_desc)
        elapsed = time.time() - t0
        overlay = {
            "_meta": {
                "locale": locale,
                "source": f"Translated from horoscope/* via Gemini 2.5 Flash on Vertex AI ({MODEL}).",
                "generated": "2026-06-07",
                "review_status": "pending-native-review",
                "string_count": len(all_strings),
                "files_covered": list(by_file.keys()),
            },
            "translations": {
                en: tr for en, tr in zip(all_strings, translations)
            },
        }
        out_path.write_text(
            json.dumps(overlay, ensure_ascii=False, indent=2) + "\n"
        )
        total_chars = sum(len(t) for t in translations)
        print(f"  wrote {out_path.name} ({elapsed:.1f}s, {total_chars} chars)")


if __name__ == "__main__":
    main()
