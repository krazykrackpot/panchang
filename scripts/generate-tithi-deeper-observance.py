#!/usr/bin/env python3
"""
Generate deeper observance prose for each tithi (30 paragraphs, 9 locales)
via Gemini 2.5 Flash. Merges into the existing
src/lib/constants/tithi-observances.json under a new `observance` field
on each tithi entry.

The `intro` field (Pass 1) is ~60-90 words covering deity + character +
one practice. This new `observance` field is 110-160 words covering:
  - Specific dos (puja, fast, donation, mantra recitation, food choice)
  - Specific don'ts (avoid certain foods, activities, journeys)
  - A traditional mantra or sankalpa direction
  - A typical dana (donation) — what's given and to whom

Tone matches `intro`: clear, factual, classical Hindu observance
tradition. Same Gemini pipeline as
scripts/generate-tithi-observances.py — UTF-8 throughout, defensive
candidate unpacking, 3-attempt retry on transient curl failures.
"""
import json
import re
import subprocess
import sys
import time
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
DATA_PATH = ROOT / "src/lib/constants/tithi-observances.json"
PROJECT = "dekhopanchang"
MODEL = "gemini-2.5-flash"
ENDPOINT = (
    f"https://us-central1-aiplatform.googleapis.com/v1/projects/"
    f"{PROJECT}/locations/us-central1/publishers/google/models/"
    f"{MODEL}:generateContent"
)

# Tithi metadata (mirror of TITHIS in src/lib/constants/tithis.ts).
TITHIS = [
    {"n": 1,  "name": "Pratipada",  "deity": "Agni",     "paksha": "shukla"},
    {"n": 2,  "name": "Dwitiya",    "deity": "Brahma",   "paksha": "shukla"},
    {"n": 3,  "name": "Tritiya",    "deity": "Gauri",    "paksha": "shukla"},
    {"n": 4,  "name": "Chaturthi",  "deity": "Ganesha",  "paksha": "shukla"},
    {"n": 5,  "name": "Panchami",   "deity": "Sarpa (Nagas)", "paksha": "shukla"},
    {"n": 6,  "name": "Shashthi",   "deity": "Kartikeya","paksha": "shukla"},
    {"n": 7,  "name": "Saptami",    "deity": "Surya",    "paksha": "shukla"},
    {"n": 8,  "name": "Ashtami",    "deity": "Rudra",    "paksha": "shukla"},
    {"n": 9,  "name": "Navami",     "deity": "Durga",    "paksha": "shukla"},
    {"n": 10, "name": "Dashami",    "deity": "Dharma",   "paksha": "shukla"},
    {"n": 11, "name": "Ekadashi",   "deity": "Vishnu",   "paksha": "shukla"},
    {"n": 12, "name": "Dwadashi",   "deity": "Vishnu",   "paksha": "shukla"},
    {"n": 13, "name": "Trayodashi", "deity": "Kamadeva", "paksha": "shukla"},
    {"n": 14, "name": "Chaturdashi","deity": "Shiva",    "paksha": "shukla"},
    {"n": 15, "name": "Purnima",    "deity": "Chandra",  "paksha": "shukla"},
    {"n": 16, "name": "Pratipada",  "deity": "Agni",     "paksha": "krishna"},
    {"n": 17, "name": "Dwitiya",    "deity": "Brahma",   "paksha": "krishna"},
    {"n": 18, "name": "Tritiya",    "deity": "Gauri",    "paksha": "krishna"},
    {"n": 19, "name": "Chaturthi",  "deity": "Ganesha",  "paksha": "krishna"},
    {"n": 20, "name": "Panchami",   "deity": "Sarpa",    "paksha": "krishna"},
    {"n": 21, "name": "Shashthi",   "deity": "Kartikeya","paksha": "krishna"},
    {"n": 22, "name": "Saptami",    "deity": "Surya",    "paksha": "krishna"},
    {"n": 23, "name": "Ashtami",    "deity": "Rudra",    "paksha": "krishna"},
    {"n": 24, "name": "Navami",     "deity": "Durga",    "paksha": "krishna"},
    {"n": 25, "name": "Dashami",    "deity": "Dharma",   "paksha": "krishna"},
    {"n": 26, "name": "Ekadashi",   "deity": "Vishnu",   "paksha": "krishna"},
    {"n": 27, "name": "Dwadashi",   "deity": "Vishnu",   "paksha": "krishna"},
    {"n": 28, "name": "Trayodashi", "deity": "Kamadeva", "paksha": "krishna"},
    {"n": 29, "name": "Chaturdashi","deity": "Shiva",    "paksha": "krishna"},
    {"n": 30, "name": "Amavasya",   "deity": "Pitru (ancestors)", "paksha": "krishna"},
]

LOCALES = {
    "en": "English (clear, Wikipedia-style, no purple prose)",
    "hi": "Hindi (Devanagari, natural Hindi register)",
    "mai": "Maithili (Devanagari, authentic Maithili register: -क genitive, -ओ conjunction, के लेल, छी/अछि forms, अहांक. MUST be distinct from Hindi where the languages diverge)",
    "mr": "Marathi (Devanagari, natural Marathi register)",
    "ta": "Tamil (Tamil script, natural Tamil register, canonical Tamil Jyotish vocabulary)",
    "te": "Telugu (Telugu script, natural Telugu register, canonical Telugu Jyotish vocabulary)",
    "bn": "Bengali (Bengali script, natural Bengali register)",
    "kn": "Kannada (Kannada script, natural Kannada register)",
    "gu": "Gujarati (Gujarati script, natural Gujarati register)",
}


def get_token() -> str:
    try:
        return subprocess.check_output(
            ["gcloud", "auth", "print-access-token"], text=True
        ).strip()
    except (FileNotFoundError, subprocess.CalledProcessError) as e:
        raise RuntimeError("gcloud CLI auth failed — run `gcloud auth login`.") from e


def gemini_call(token: str, prompt: str) -> str:
    body = {
        "contents": [{"role": "user", "parts": [{"text": prompt}]}],
        "generationConfig": {
            "responseMimeType": "application/json",
            "temperature": 0.4,
            "maxOutputTokens": 65536,
        },
    }
    for attempt in range(3):
        try:
            proc = subprocess.run(
                [
                    "curl", "-s", "-f", "--max-time", "180",
                    "-X", "POST",
                    "-H", f"Authorization: Bearer {token}",
                    "-H", "Content-Type: application/json",
                    ENDPOINT,
                    "-d", json.dumps(body, ensure_ascii=False),
                ],
                capture_output=True, text=True, check=True,
            )
            raw = json.loads(proc.stdout)
            candidates = raw.get("candidates")
            if not candidates:
                raise RuntimeError(f"Gemini returned no candidates: {json.dumps(raw)[:300]}")
            parts = candidates[0].get("content", {}).get("parts")
            if not parts or "text" not in parts[0]:
                raise RuntimeError(f"Gemini candidate has no text: {json.dumps(candidates[0])[:300]}")
            return parts[0]["text"]
        except subprocess.CalledProcessError as e:
            wait = 2 ** attempt
            print(f"  curl exit {e.returncode}, retry {attempt+1}/3 in {wait}s", file=sys.stderr)
            time.sleep(wait)
    raise RuntimeError("Gemini call failed after 3 retries")


def parse_json_text(text: str):
    try:
        return json.loads(text)
    except json.JSONDecodeError:
        text = re.sub(r"^```(?:json)?\n?|\n?```$", "", text.strip(), flags=re.MULTILINE)
        return json.loads(text)


def author_english(token: str) -> dict:
    inputs = {
        str(t["n"]): {"tithi": t["name"], "deity": t["deity"], "paksha": t["paksha"]}
        for t in TITHIS
    }
    prompt = (
        "For each tithi in a Vedic-astrology panchang, write a deeper observance "
        "paragraph (110-160 words) covering ALL FOUR of:\n"
        "  1. Specific DOS — what to actually do (puja, fast, donation, mantra recitation, "
        "     food choice). Be concrete, not vague.\n"
        "  2. Specific DON'TS — what to avoid (foods, activities, journeys, decisions).\n"
        "  3. A traditional MANTRA or sankalpa direction (name the mantra; e.g. "
        "     'Aum Namo Bhagavate Vasudevaya' for Ekadashi, 'Aum Gam Ganapataye Namaha' "
        "     for Chaturthi). If a tithi doesn't have a single canonical mantra, name "
        "     the deity-stotra (e.g. 'Lalita Sahasranama' for Devi tithis).\n"
        "  4. A typical DANA (donation) — what's given and to whom (e.g. yellow cloth + "
        "     turmeric on Trayodashi, sesame oil on Saturday-Amavasya, food + clothing "
        "     to brahmins on Pitru observances).\n\n"
        "Tone: clear, factual, classical Hindu observance tradition. No purple prose. "
        "Mention paksha (Shukla / Krishna) where it shapes the practice. Reference real "
        "observances; don't invent.\n\n"
        "Output format: ONLY a JSON object where each key is the tithi number (string "
        "1-30) and each value is the English paragraph as a string. No markdown fences.\n\n"
        f"Input (tithi number → {{tithi, deity, paksha}}):\n"
        + json.dumps(inputs, indent=2)
    )
    text = gemini_call(token, prompt)
    parsed = parse_json_text(text)
    if not all(str(i) in parsed and isinstance(parsed[str(i)], str) for i in range(1, 31)):
        missing = [i for i in range(1, 31) if str(i) not in parsed]
        raise RuntimeError(f"EN authoring missing keys: {missing[:5]}")
    return parsed


def translate_locale(token: str, en_paragraphs: dict, locale: str, locale_desc: str) -> dict:
    prompt = (
        f"Translate the following English Vedic-astrology paragraphs to {locale_desc}.\n\n"
        f"Rules:\n"
        f"- Output ONLY a JSON object with the SAME keys as the input.\n"
        f"- Each value is the translated paragraph.\n"
        f"- Retain canonical Sanskrit Jyotish terms (तिथि, मुहूर्त, etc.) and mantras "
        f"(Aum / Om sequences) transliterated to the target script.\n"
        f"- Deity names: target script (Vishnu → विष्णु, விஷ்ணு, etc.)\n"
        f"- Tone matches source: clear, classical.\n\n"
        f"Input:\n{json.dumps(en_paragraphs, ensure_ascii=False, indent=2)}"
    )
    text = gemini_call(token, prompt)
    parsed = parse_json_text(text)
    if not all(str(i) in parsed and isinstance(parsed[str(i)], str) for i in range(1, 31)):
        missing = [i for i in range(1, 31) if str(i) not in parsed]
        raise RuntimeError(f"{locale} translation missing keys: {missing[:5]}")
    return parsed


def main():
    existing = json.loads(DATA_PATH.read_text(encoding="utf-8"))
    token = get_token()
    print("Authoring EN deeper observance paragraphs via Gemini...")
    t0 = time.time()
    en = author_english(token)
    print(f"  done in {time.time()-t0:.1f}s ({sum(len(p) for p in en.values())} chars)")
    by_locale = {"en": en}
    for locale, desc in LOCALES.items():
        if locale == "en":
            continue
        print(f"Translating to {locale}...")
        t0 = time.time()
        translated = translate_locale(token, en, locale, desc)
        by_locale[locale] = translated
        print(f"  done in {time.time()-t0:.1f}s ({sum(len(p) for p in translated.values())} chars)")
    # Merge into existing JSON — adds `observance` alongside `intro`.
    for n in range(1, 31):
        key = str(n)
        if key not in existing:
            existing[key] = {"intro": {}, "observance": {}}
        existing[key]["observance"] = {
            locale: by_locale[locale][key] for locale in LOCALES
        }
    DATA_PATH.write_text(
        json.dumps(existing, ensure_ascii=False, indent=2) + "\n",
        encoding="utf-8",
    )
    print(f"Updated {DATA_PATH}")


if __name__ == "__main__":
    main()
