#!/usr/bin/env python3
"""
Generate weekday-significance prose (7 paragraphs, 9 locales) via Gemini 2.5
Flash on Vertex AI. Output: src/lib/constants/weekday-significance.json.

Each weekday gets a 70-100 word paragraph covering:
  - Ruling planet (Surya / Chandra / Mangala / Budha / Brihaspati /
    Shukra / Shani) and its character
  - General auspiciousness (favourable activities / things to avoid)
  - One traditional observance (deity worship, mantra direction, fast)

Source for classical mappings:
  0 Sunday    → Surya (Sun)
  1 Monday    → Chandra (Moon)
  2 Tuesday   → Mangala (Mars)
  3 Wednesday → Budha (Mercury)
  4 Thursday  → Brihaspati (Jupiter)
  5 Friday    → Shukra (Venus)
  6 Saturday  → Shani (Saturn)

Output shape consumed by src/lib/constants/weekday-significance.ts:
  {
    "0": { "intro": { "en": "...", "hi": "...", "mai": "...", ... } },
    ...
    "6": { ... }
  }
"""
import json
import re
import subprocess
import sys
import time
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
OUT_PATH = ROOT / "src/lib/constants/weekday-significance.json"
PROJECT = "dekhopanchang"
MODEL = "gemini-2.5-flash"
ENDPOINT = (
    f"https://us-central1-aiplatform.googleapis.com/v1/projects/"
    f"{PROJECT}/locations/us-central1/publishers/google/models/"
    f"{MODEL}:generateContent"
)

WEEKDAYS = [
    {"n": 0, "name": "Sunday",    "planet": "Surya (Sun)",     "deity": "Surya"},
    {"n": 1, "name": "Monday",    "planet": "Chandra (Moon)",  "deity": "Chandra / Shiva"},
    {"n": 2, "name": "Tuesday",   "planet": "Mangala (Mars)",  "deity": "Hanuman / Kartikeya"},
    {"n": 3, "name": "Wednesday", "planet": "Budha (Mercury)", "deity": "Vishnu / Vithoba"},
    {"n": 4, "name": "Thursday",  "planet": "Brihaspati (Jupiter)", "deity": "Brihaspati / Vishnu / Dattatreya"},
    {"n": 5, "name": "Friday",    "planet": "Shukra (Venus)",  "deity": "Shukra / Lakshmi / Santoshi Ma"},
    {"n": 6, "name": "Saturday",  "planet": "Shani (Saturn)",  "deity": "Shani / Hanuman"},
]

LOCALES = {
    "en": "English (clear, Wikipedia-style, no purple prose)",
    "hi": "Hindi (Devanagari, natural Hindi register)",
    "mai": "Maithili (Devanagari, authentic Maithili register — use -क genitive, -ओ conjunction, के लेल, छी/अछि forms, अहांक. MUST be distinct from Hindi where the languages diverge — output is compared against Hindi and matches trigger duplicate-content scoring)",
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
        str(d["n"]): {"weekday": d["name"], "planet": d["planet"], "deity": d["deity"]}
        for d in WEEKDAYS
    }
    prompt = (
        "Write a short paragraph (70-100 words) for each weekday in a Vedic-astrology "
        "panchang. Each paragraph should cover:\n"
        "  - The ruling planet and its character\n"
        "  - General auspiciousness (favourable activities / things to avoid)\n"
        "  - One traditional observance — deity worship, mantra recitation direction, "
        "    or fast — actually practised on that day\n\n"
        "Tone: clear, factual, classical Hindu calendar tradition. Reference real practices "
        "(Monday → Shiva worship and fast for unmarried girls; Tuesday → Hanuman Chalisa; "
        "Wednesday → Vishnu / Vithoba; Thursday → Brihaspati / Sai Baba bhajan and fasting; "
        "Friday → Santoshi Ma vrat; Saturday → Shani Sade Sati relief, Hanuman Chalisa; "
        "Sunday → Surya namaskara, copper water offering). Don't invent practices.\n\n"
        "Output format: ONLY a JSON object where each key is the weekday number (string 0-6, "
        "0=Sunday) and each value is the English paragraph as a string. No markdown fences.\n\n"
        f"Input (weekday number → {{weekday, planet, deity}}):\n"
        + json.dumps(inputs, indent=2)
    )
    text = gemini_call(token, prompt)
    parsed = parse_json_text(text)
    if not all(str(i) in parsed and isinstance(parsed[str(i)], str) for i in range(7)):
        missing = [i for i in range(7) if str(i) not in parsed]
        raise RuntimeError(f"EN authoring missing keys: {missing}")
    return parsed


def translate_locale(token: str, en_paragraphs: dict, locale: str, locale_desc: str) -> dict:
    prompt = (
        f"Translate the following English Vedic-astrology paragraphs to {locale_desc}.\n\n"
        f"Rules:\n"
        f"- Output ONLY a JSON object with the SAME keys as the input.\n"
        f"- Each value is the translated paragraph.\n"
        f"- Retain canonical Sanskrit Jyotish terms transliterated to the target script "
        f"(Surya → सूर्य in Devanagari, சூரியன் in Tamil, etc.)\n"
        f"- Tone matches source: clear, classical.\n\n"
        f"Input:\n{json.dumps(en_paragraphs, ensure_ascii=False, indent=2)}"
    )
    text = gemini_call(token, prompt)
    parsed = parse_json_text(text)
    if not all(str(i) in parsed and isinstance(parsed[str(i)], str) for i in range(7)):
        missing = [i for i in range(7) if str(i) not in parsed]
        raise RuntimeError(f"{locale} translation missing keys: {missing}")
    return parsed


def main():
    token = get_token()
    print("Authoring EN weekday paragraphs via Gemini...")
    t0 = time.time()
    en = author_english(token)
    print(f"  done in {time.time()-t0:.1f}s ({sum(len(p) for p in en.values())} chars)")
    out = {str(i): {"intro": {"en": en[str(i)]}} for i in range(7)}
    for locale, desc in LOCALES.items():
        if locale == "en":
            continue
        print(f"Translating to {locale}...")
        t0 = time.time()
        translated = translate_locale(token, en, locale, desc)
        print(f"  done in {time.time()-t0:.1f}s ({sum(len(p) for p in translated.values())} chars)")
        for i in range(7):
            out[str(i)]["intro"][locale] = translated[str(i)]
    OUT_PATH.parent.mkdir(parents=True, exist_ok=True)
    OUT_PATH.write_text(
        json.dumps(out, ensure_ascii=False, indent=2) + "\n",
        encoding="utf-8",
    )
    print(f"Wrote {OUT_PATH}")


if __name__ == "__main__":
    main()
