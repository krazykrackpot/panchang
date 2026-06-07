#!/usr/bin/env python3
"""
Generate tithi-observance prose (30 paragraphs, 9 locales) via Gemini 2.5
Flash on Vertex AI. Output: src/lib/constants/tithi-observances.json.

Each tithi gets a 60-90 word intro paragraph covering:
  - presiding deity + what they signify
  - general nature of the tithi (auspicious for X, avoid Y)
  - one traditional observance / practice

Authored in EN first, then translated to the 8 non-EN locales. The EN
content goes through Gemini too (with a Vedic-astrology system prompt)
because (a) classical observances follow well-known patterns the model
knows, (b) keeps the editorial voice consistent across all 30 entries.

Output shape consumed by src/lib/constants/tithi-observances.ts:
  {
    "1": { "intro": { "en": "...", "hi": "...", "mai": "...", ... } },
    "2": { "intro": { ... } },
    ...
    "30": { ... }
  }

Tithi numbering matches src/lib/constants/tithis.ts:
  1-15 = shukla paksha (waxing): Pratipada → Purnima
  16-30 = krishna paksha (waning): Pratipada → Amavasya (where 30 = Amavasya)
"""
import json
import re
import subprocess
import sys
import time
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
OUT_PATH = ROOT / "src/lib/constants/tithi-observances.json"
PROJECT = "dekhopanchang"
MODEL = "gemini-2.5-flash"
ENDPOINT = (
    f"https://us-central1-aiplatform.googleapis.com/v1/projects/"
    f"{PROJECT}/locations/us-central1/publishers/google/models/"
    f"{MODEL}:generateContent"
)

# Tithi name + deity + paksha lookup. Mirrors src/lib/constants/tithis.ts;
# duplicated here so the script can run standalone without pulling in the
# TS build pipeline. If tithis.ts ever changes, update both in one commit.
TITHIS = [
    # 1-15 shukla paksha
    {"n": 1,  "name": "Pratipada",  "deity": "Agni",      "paksha": "shukla"},
    {"n": 2,  "name": "Dwitiya",    "deity": "Brahma",    "paksha": "shukla"},
    {"n": 3,  "name": "Tritiya",    "deity": "Gauri",     "paksha": "shukla"},
    {"n": 4,  "name": "Chaturthi",  "deity": "Ganesha",   "paksha": "shukla"},
    {"n": 5,  "name": "Panchami",   "deity": "Sarpa (Nagas)", "paksha": "shukla"},
    {"n": 6,  "name": "Shashthi",   "deity": "Kartikeya", "paksha": "shukla"},
    {"n": 7,  "name": "Saptami",    "deity": "Surya",     "paksha": "shukla"},
    {"n": 8,  "name": "Ashtami",    "deity": "Rudra",     "paksha": "shukla"},
    {"n": 9,  "name": "Navami",     "deity": "Durga",     "paksha": "shukla"},
    {"n": 10, "name": "Dashami",    "deity": "Dharma",    "paksha": "shukla"},
    {"n": 11, "name": "Ekadashi",   "deity": "Vishnu",    "paksha": "shukla"},
    {"n": 12, "name": "Dwadashi",   "deity": "Vishnu",    "paksha": "shukla"},
    {"n": 13, "name": "Trayodashi", "deity": "Kamadeva",  "paksha": "shukla"},
    {"n": 14, "name": "Chaturdashi","deity": "Shiva",     "paksha": "shukla"},
    {"n": 15, "name": "Purnima",    "deity": "Chandra",   "paksha": "shukla"},
    # 16-30 krishna paksha
    {"n": 16, "name": "Pratipada",  "deity": "Agni",      "paksha": "krishna"},
    {"n": 17, "name": "Dwitiya",    "deity": "Brahma",    "paksha": "krishna"},
    {"n": 18, "name": "Tritiya",    "deity": "Gauri",     "paksha": "krishna"},
    {"n": 19, "name": "Chaturthi",  "deity": "Ganesha",   "paksha": "krishna"},
    {"n": 20, "name": "Panchami",   "deity": "Sarpa",     "paksha": "krishna"},
    {"n": 21, "name": "Shashthi",   "deity": "Kartikeya", "paksha": "krishna"},
    {"n": 22, "name": "Saptami",    "deity": "Surya",     "paksha": "krishna"},
    {"n": 23, "name": "Ashtami",    "deity": "Rudra",     "paksha": "krishna"},
    {"n": 24, "name": "Navami",     "deity": "Durga",     "paksha": "krishna"},
    {"n": 25, "name": "Dashami",    "deity": "Dharma",    "paksha": "krishna"},
    {"n": 26, "name": "Ekadashi",   "deity": "Vishnu",    "paksha": "krishna"},
    {"n": 27, "name": "Dwadashi",   "deity": "Vishnu",    "paksha": "krishna"},
    {"n": 28, "name": "Trayodashi", "deity": "Kamadeva",  "paksha": "krishna"},
    {"n": 29, "name": "Chaturdashi","deity": "Shiva",     "paksha": "krishna"},
    {"n": 30, "name": "Amavasya",   "deity": "Pitru (ancestors)", "paksha": "krishna"},
]

LOCALES = {
    "en": "English (clear, Wikipedia-style, no purple prose)",
    "hi": "Hindi (Devanagari, natural Hindi register)",
    "mai": "Maithili (Devanagari, authentic Maithili register: -क genitive, -ओ conjunction, के लेल, छी/अछि forms, अहांक. MUST be distinct from Hindi where the languages diverge — output is compared against Hindi and matches trigger duplicate-content scoring)",
    "mr": "Marathi (Devanagari, natural Marathi register)",
    "ta": "Tamil (Tamil script, natural Tamil register, canonical Tamil Jyotish: திதி/நட்சத்திரம்)",
    "te": "Telugu (Telugu script, natural Telugu register, canonical Telugu Jyotish: తిథి/నక్షత్రం)",
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
        raise RuntimeError(
            "gcloud CLI auth failed — run `gcloud auth login`."
        ) from e


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
                raise RuntimeError(
                    f"Gemini returned no candidates: {json.dumps(raw)[:300]}"
                )
            parts = candidates[0].get("content", {}).get("parts")
            if not parts or "text" not in parts[0]:
                raise RuntimeError(
                    f"Gemini candidate has no text: {json.dumps(candidates[0])[:300]}"
                )
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
    """One Gemini call returns all 30 EN paragraphs keyed by tithi number."""
    inputs = {
        str(t["n"]): {
            "tithi": t["name"],
            "deity": t["deity"],
            "paksha": t["paksha"],
        }
        for t in TITHIS
    }
    prompt = (
        "Write a short paragraph (60-90 words) for each tithi in a Vedic-astrology "
        "panchang. Each paragraph should cover:\n"
        "  - The presiding deity and what they signify\n"
        "  - The general character of the tithi (what activities it favours / disfavours)\n"
        "  - One traditional observance or practice associated with it\n\n"
        "Tone: clear, factual, classical Hindu calendar tradition. No purple prose. "
        "No marketing language. Mention paksha (Shukla / Krishna) where it shapes the "
        "observance — Shukla (waxing Moon) emphasises new beginnings and growth; Krishna "
        "(waning Moon) emphasises release, purification, and ancestral observances.\n\n"
        "Sources to draw from: standard Hindu panchang traditions — observances of "
        "Ekadashi (fasting, Vishnu worship), Chaturthi (Ganesha), Ashtami (Devi/Shiva), "
        "Amavasya (Pitru tarpan, ancestor rites), Purnima (deity bathing, Satyanarayan "
        "katha), etc. For tithi-deity pairings, follow the classical Brahma-vaivarta / "
        "Skanda Purana attributions already in the input.\n\n"
        "Output format: ONLY a JSON object where each key is the tithi number "
        "(string 1-30) and each value is the English paragraph as a string. No markdown "
        "fences. No commentary.\n\n"
        f"Input (tithi number → {{tithi, deity, paksha}}):\n"
        + json.dumps(inputs, indent=2)
    )
    text = gemini_call(token, prompt)
    parsed = parse_json_text(text)
    # Validate: 30 entries, all strings
    if not all(str(i) in parsed and isinstance(parsed[str(i)], str) for i in range(1, 31)):
        missing = [i for i in range(1, 31) if str(i) not in parsed]
        raise RuntimeError(f"EN authoring missing keys: {missing[:5]}")
    return parsed


def translate_locale(token: str, en_paragraphs: dict, locale: str, locale_desc: str) -> dict:
    """One Gemini call returns translations of all 30 EN paragraphs for one locale."""
    prompt = (
        f"Translate the following English Vedic-astrology paragraphs to {locale_desc}.\n\n"
        f"Rules:\n"
        f"- Output ONLY a JSON object with the SAME keys as the input.\n"
        f"- Each value is the translated paragraph.\n"
        f"- Retain canonical Sanskrit Jyotish terms (तिथि, राशि, ग्रह, मुहूर्त, etc.) "
        f"transliterated to the target script.\n"
        f"- Keep deity names in the target script (Vishnu → विष्णु in Devanagari, "
        f"விஷ்ணு in Tamil, etc.)\n"
        f"- Tone matches the source: clear, classical, no purple prose.\n\n"
        f"Input:\n{json.dumps(en_paragraphs, ensure_ascii=False, indent=2)}"
    )
    text = gemini_call(token, prompt)
    parsed = parse_json_text(text)
    if not all(str(i) in parsed and isinstance(parsed[str(i)], str) for i in range(1, 31)):
        missing = [i for i in range(1, 31) if str(i) not in parsed]
        raise RuntimeError(f"{locale} translation missing keys: {missing[:5]}")
    return parsed


def main():
    token = get_token()
    print("Authoring EN tithi-observance paragraphs via Gemini...")
    t0 = time.time()
    en = author_english(token)
    print(f"  done in {time.time()-t0:.1f}s ({sum(len(p) for p in en.values())} chars)")
    out = {str(i): {"intro": {"en": en[str(i)]}} for i in range(1, 31)}
    for locale, desc in LOCALES.items():
        if locale == "en":
            continue
        print(f"Translating to {locale}...")
        t0 = time.time()
        translated = translate_locale(token, en, locale, desc)
        print(f"  done in {time.time()-t0:.1f}s ({sum(len(p) for p in translated.values())} chars)")
        for i in range(1, 31):
            out[str(i)]["intro"][locale] = translated[str(i)]
    OUT_PATH.parent.mkdir(parents=True, exist_ok=True)
    OUT_PATH.write_text(
        json.dumps(out, ensure_ascii=False, indent=2) + "\n",
        encoding="utf-8",
    )
    print(f"Wrote {OUT_PATH}")


if __name__ == "__main__":
    main()
