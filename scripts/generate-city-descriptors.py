#!/usr/bin/env python3
"""
Generate per-city descriptor prose (44 cities, 9 locales) via Gemini 2.5
Flash on Vertex AI. Output: src/lib/constants/city-descriptors.json.

Each city gets an ~80-120 word descriptor paragraph covering:
  - Notable temples / pilgrimage sites
  - Local festival traditions specific to this city
  - Regional fast/feast / observance practices
  - Climate or seasonal note relevant to panchang timing
  - For diaspora cities: NRI / Hindu-community context

Why: post-cut, two Indian cities on the same date share identical
tithi/nakshatra/yoga/karana — the only body difference is the city name
substitution. This is textbook "city-name-swap" thin content. The
descriptor adds per-city differentiation that breaks the pattern at the
literal-text level.

Same Gemini pipeline as previous scripts (UTF-8 I/O, defensive candidate
unpacking, 3-attempt retry). One EN authoring call returns all 44
paragraphs; 8 translation calls fan out to mai/mr/ta/te/bn/gu/kn.
"""
import json
import re
import subprocess
import sys
import time
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
OUT_PATH = ROOT / "src/lib/constants/city-descriptors.json"
PROJECT = "dekhopanchang"
MODEL = "gemini-2.5-flash"
ENDPOINT = (
    f"https://us-central1-aiplatform.googleapis.com/v1/projects/"
    f"{PROJECT}/locations/us-central1/publishers/google/models/"
    f"{MODEL}:generateContent"
)

# The 44 SEO-indexable cities (mirror of SEO_INDEXABLE_CITY_SLUGS in
# src/lib/constants/cities-extended.ts).  Each tuple: (slug, name, state).
CITIES = [
    # Metros (8)
    ("delhi",            "Delhi",            "Delhi"),
    ("mumbai",           "Mumbai",           "Maharashtra"),
    ("kolkata",          "Kolkata",          "West Bengal"),
    ("bangalore",        "Bangalore",        "Karnataka"),
    ("chennai",          "Chennai",          "Tamil Nadu"),
    ("hyderabad",        "Hyderabad",        "Telangana"),
    ("pune",             "Pune",             "Maharashtra"),
    ("ahmedabad",        "Ahmedabad",        "Gujarat"),
    # Major Indian (15)
    ("jaipur",           "Jaipur",           "Rajasthan"),
    ("lucknow",          "Lucknow",          "Uttar Pradesh"),
    ("patna",            "Patna",            "Bihar"),
    ("bhopal",           "Bhopal",           "Madhya Pradesh"),
    ("indore",           "Indore",           "Madhya Pradesh"),
    ("kanpur",           "Kanpur",           "Uttar Pradesh"),
    ("surat",            "Surat",            "Gujarat"),
    ("nagpur",           "Nagpur",           "Maharashtra"),
    ("coimbatore",       "Coimbatore",       "Tamil Nadu"),
    ("visakhapatnam",    "Visakhapatnam",    "Andhra Pradesh"),
    ("madurai",          "Madurai",          "Tamil Nadu"),
    ("kochi",            "Kochi",            "Kerala"),
    ("bhubaneswar",      "Bhubaneswar",      "Odisha"),
    ("chandigarh",       "Chandigarh",       "Chandigarh"),
    ("amritsar",         "Amritsar",         "Punjab"),
    # Other Indian (8)
    ("dehradun",         "Dehradun",         "Uttarakhand"),
    ("raipur",           "Raipur",           "Chhattisgarh"),
    ("guwahati",         "Guwahati",         "Assam"),
    ("nashik",           "Nashik",           "Maharashtra"),
    ("goa",              "Goa (Panaji)",     "Goa"),
    ("ranchi",           "Ranchi",           "Jharkhand"),
    ("mysore",           "Mysore",           "Karnataka"),
    ("agra",             "Agra",             "Uttar Pradesh"),
    # Pilgrimage (7)
    ("ujjain",           "Ujjain",           "Madhya Pradesh"),
    ("varanasi",         "Varanasi (Kashi)", "Uttar Pradesh"),
    ("rishikesh",        "Rishikesh",        "Uttarakhand"),
    ("tirupati",         "Tirupati",         "Andhra Pradesh"),
    ("haridwar",         "Haridwar",         "Uttarakhand"),
    ("mathura",          "Mathura",          "Uttar Pradesh"),
    ("puri",             "Puri",             "Odisha"),
    # Diaspora (6)
    ("dubai",            "Dubai",            "UAE"),
    ("singapore",        "Singapore",        "Singapore"),
    ("new-york",         "New York",         "USA"),
    ("toronto",          "Toronto",          "Canada"),
    ("fiji",             "Suva (Fiji)",      "Fiji"),
    ("san-francisco",    "San Francisco",    "USA"),
]
assert len(CITIES) == 44, f"expected 44 cities, got {len(CITIES)}"

LOCALES = {
    "en": "English (clear, Wikipedia-style, no purple prose)",
    "hi": "Hindi (Devanagari, natural Hindi register)",
    "mai": "Maithili (Devanagari, authentic Maithili register: -क genitive, -ओ conjunction, के लेल, छी/अछि forms, अहांक. MUST be distinct from Hindi where the languages diverge)",
    "mr": "Marathi (Devanagari, natural Marathi register)",
    "ta": "Tamil (Tamil script, natural Tamil register)",
    "te": "Telugu (Telugu script, natural Telugu register)",
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
    inputs = {slug: {"name": name, "state": state} for slug, name, state in CITIES}
    prompt = (
        "Write a short descriptor paragraph (80-120 words) for each city below. "
        "The paragraph appears on a Vedic-panchang page for that city; its purpose "
        "is to give the reader genuinely city-specific context that differentiates "
        "the page from other cities' panchang pages.\n\n"
        "Each paragraph MUST mention concrete, verifiable city-specific facts. Cover "
        "two or three of:\n"
        "  - Notable temples or pilgrimage sites (e.g. Kashi Vishwanath in Varanasi, "
        "    Tirumala Tirupati Devasthanam, Jagannath Puri).\n"
        "  - Local festival traditions where the city's observance differs from the "
        "    pan-India default (Mumbai's Ganesh Chaturthi visarjan, Pune's Dahi Handi, "
        "    Kolkata's Durga Puja pandals, Madurai's Chithirai festival).\n"
        "  - Regional fast / feast practices tied to local deity or sampradaya.\n"
        "  - Climate or seasonal note relevant to panchang timing (the long northern "
        "    sunrise window in summer, monsoon affecting Shravan observances, etc.).\n"
        "  - For diaspora cities: the Hindu / Indian-origin community context "
        "    (Singapore Thaipusam, Trinidad Phagwa, Fiji Girmitiya Hindu heritage).\n\n"
        "Tone: factual, neutral, no marketing language, no 'experience the magic'. "
        "Don't invent facts. Don't repeat the city name more than twice. If a city "
        "is best-known as a pilgrimage centre, the paragraph should center on that.\n\n"
        "Output format: ONLY a JSON object where each key is the city slug and each "
        "value is the English paragraph as a string. No markdown fences.\n\n"
        f"Input (slug → {{name, state}}):\n{json.dumps(inputs, indent=2)}"
    )
    text = gemini_call(token, prompt)
    parsed = parse_json_text(text)
    missing = [s for s, _, _ in CITIES if s not in parsed or not isinstance(parsed[s], str)]
    if missing:
        raise RuntimeError(f"EN authoring missing slugs: {missing[:5]}")
    return parsed


def translate_locale(token: str, en_paragraphs: dict, locale: str, locale_desc: str) -> dict:
    prompt = (
        f"Translate the following English city descriptor paragraphs to {locale_desc}.\n\n"
        f"Rules:\n"
        f"- Output ONLY a JSON object with the SAME keys as the input.\n"
        f"- Each value is the translated paragraph.\n"
        f"- Retain proper nouns (city names, temple names, deity names) in the target "
        f"  script — Kashi Vishwanath → काशी विश्वनाथ in Devanagari, காசி விசுவநாதர் "
        f"  in Tamil, etc.\n"
        f"- Tone matches source: clear, factual, no purple prose.\n\n"
        f"Input:\n{json.dumps(en_paragraphs, ensure_ascii=False, indent=2)}"
    )
    text = gemini_call(token, prompt)
    parsed = parse_json_text(text)
    missing = [k for k in en_paragraphs.keys() if k not in parsed or not isinstance(parsed[k], str)]
    if missing:
        raise RuntimeError(f"{locale} translation missing keys: {missing[:5]}")
    return parsed


def main():
    token = get_token()
    print("Authoring EN city descriptor paragraphs via Gemini...")
    t0 = time.time()
    en = author_english(token)
    print(f"  done in {time.time()-t0:.1f}s ({sum(len(p) for p in en.values())} chars)")
    out = {slug: {"descriptor": {"en": en[slug]}} for slug, _, _ in CITIES}
    for locale, desc in LOCALES.items():
        if locale == "en":
            continue
        print(f"Translating to {locale}...")
        t0 = time.time()
        translated = translate_locale(token, en, locale, desc)
        print(f"  done in {time.time()-t0:.1f}s ({sum(len(p) for p in translated.values())} chars)")
        for slug, _, _ in CITIES:
            out[slug]["descriptor"][locale] = translated[slug]
    OUT_PATH.parent.mkdir(parents=True, exist_ok=True)
    OUT_PATH.write_text(json.dumps(out, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(f"Wrote {OUT_PATH}")


if __name__ == "__main__":
    main()
