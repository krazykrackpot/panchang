#!/usr/bin/env python3
"""
Translate the 44 SEO-indexable city names (5 locales) + 26 Indian-state /
country names (8 locales) for the /panchang/[city] surface to close the
"Latin city name in non-Latin locale title" SEO gap (Phase 0a + 0b of the
2026-06-10 content-differentiation pass).

Why this matters:
  - cities-extended.ts:expandIndian() emits ta/te/bn/kn/gu = en fallback for
    every Indian city tuple. Tamil readers searching `மும்பை பஞ்சாங்கம்` see
    `Mumbai இன்றைய பஞ்சாங்கம்` and don't match. Confirmed live for all 5 of
    ta/te/bn/kn/gu via SSR curl with Googlebot UA on 2026-06-10.
  - state field is `string` (English only) and gets rendered verbatim in
    body prose alongside the locale-native city name — produces mixed-script
    output ("मुंबई, Maharashtra के लिए...").

Outputs:
  - src/lib/constants/city-name-overlay.json   — {slug: {ta,te,bn,kn,gu}}
  - src/lib/constants/state-name-overlay.json  — {state_en: {hi,mai,mr,ta,te,bn,kn,gu}}

Both are idempotent; per-locale skips on completion. Author-reviewed
seed values from cities.ts (delhi/mumbai/bangalore/hyderabad/chennai/
kolkata/ujjain in all locales) get merged after the Gemini call so we
prefer canonical authority over LLM transliteration where available.
"""
import json
import re
import subprocess
import sys
import time
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
CITY_OUT = ROOT / "src/lib/constants/city-name-overlay.json"
STATE_OUT = ROOT / "src/lib/constants/state-name-overlay.json"
PROJECT = "dekhopanchang"
MODEL = "gemini-2.5-flash"
ENDPOINT = (
    f"https://us-central1-aiplatform.googleapis.com/v1/projects/"
    f"{PROJECT}/locations/us-central1/publishers/google/models/"
    f"{MODEL}:generateContent"
)

CITY_LOCALES = {
    "ta": "Tamil (Tamil script — Wikipedia-canonical native city name)",
    "te": "Telugu (Telugu script — Wikipedia-canonical native city name)",
    "bn": "Bengali (Bengali script — Wikipedia-canonical native city name)",
    "kn": "Kannada (Kannada script — Wikipedia-canonical native city name)",
    "gu": "Gujarati (Gujarati script — Wikipedia-canonical native city name)",
}

STATE_LOCALES = {
    "hi": "Hindi (Devanagari, formal/canonical state name)",
    "mai": "Maithili (Devanagari, formal/canonical state name)",
    "mr": "Marathi (Devanagari, formal/canonical state name)",
    "ta": "Tamil (Tamil script, formal/canonical state name)",
    "te": "Telugu (Telugu script, formal/canonical state name)",
    "bn": "Bengali (Bengali script, formal/canonical state name)",
    "kn": "Kannada (Kannada script, formal/canonical state name)",
    "gu": "Gujarati (Gujarati script, formal/canonical state name)",
}

# 44 SEO_INDEXABLE_CITY_SLUGS with their canonical English names. Kept inline
# (not auto-pulled from cities-extended.ts) so the translator gets a frozen
# input even if the indexable list moves later — re-run only if the keys here
# change.
CITY_NAMES_EN: dict[str, str] = {
    "delhi": "Delhi",
    "mumbai": "Mumbai",
    "bangalore": "Bangalore",
    "chennai": "Chennai",
    "kolkata": "Kolkata",
    "hyderabad": "Hyderabad",
    "pune": "Pune",
    "ahmedabad": "Ahmedabad",
    "jaipur": "Jaipur",
    "lucknow": "Lucknow",
    "patna": "Patna",
    "bhopal": "Bhopal",
    "indore": "Indore",
    "kanpur": "Kanpur",
    "surat": "Surat",
    "nagpur": "Nagpur",
    "coimbatore": "Coimbatore",
    "visakhapatnam": "Visakhapatnam",
    "madurai": "Madurai",
    "kochi": "Kochi",
    "bhubaneswar": "Bhubaneswar",
    "chandigarh": "Chandigarh",
    "amritsar": "Amritsar",
    "dehradun": "Dehradun",
    "raipur": "Raipur",
    "guwahati": "Guwahati",
    "nashik": "Nashik",
    "goa": "Goa",
    "ranchi": "Ranchi",
    "mysore": "Mysore",
    "agra": "Agra",
    "ujjain": "Ujjain",
    "varanasi": "Varanasi",
    "rishikesh": "Rishikesh",
    "tirupati": "Tirupati",
    "haridwar": "Haridwar",
    "mathura": "Mathura",
    "puri": "Puri",
    "dubai": "Dubai",
    "singapore": "Singapore",
    "new-york": "New York",
    "toronto": "Toronto",
    "fiji": "Suva, Fiji",
    "san-francisco": "San Francisco",
}

# 26 unique states/countries pulled from the indexable city list. Includes
# countries because the diaspora cities have country as `state` field.
STATE_NAMES_EN: dict[str, str] = {
    "Andhra Pradesh": "Andhra Pradesh",
    "Assam": "Assam",
    "Bihar": "Bihar",
    "Canada": "Canada",
    "Chandigarh": "Chandigarh",
    "Chhattisgarh": "Chhattisgarh",
    "Delhi": "Delhi",
    "Fiji": "Fiji",
    "Goa": "Goa",
    "Gujarat": "Gujarat",
    "Jharkhand": "Jharkhand",
    "Karnataka": "Karnataka",
    "Kerala": "Kerala",
    "Madhya Pradesh": "Madhya Pradesh",
    "Maharashtra": "Maharashtra",
    "Odisha": "Odisha",
    "Punjab": "Punjab",
    "Rajasthan": "Rajasthan",
    "Singapore": "Singapore",
    "Tamil Nadu": "Tamil Nadu",
    "Telangana": "Telangana",
    "UAE": "United Arab Emirates",
    "USA": "United States",
    "Uttar Pradesh": "Uttar Pradesh",
    "Uttarakhand": "Uttarakhand",
    "West Bengal": "West Bengal",
}

# Author-curated seeds from cities.ts (7 cities × 5 locales = 35 strings)
# that we trust over Gemini output for the highest-traffic cities.
CITY_SEEDS: dict[str, dict[str, str]] = {
    "delhi":      {"ta": "டெல்லி",     "te": "ఢిల్లీ",    "bn": "দিল্লি",       "kn": "ದೆಹಲಿ",      "gu": "દિલ્હી"},
    "mumbai":     {"ta": "மும்பை",     "te": "ముంబై",    "bn": "মুম্বই",       "kn": "ಮುಂಬೈ",      "gu": "મુંબઈ"},
    "bangalore":  {"ta": "பெங்களூரு",   "te": "బెంగళూరు", "bn": "বেঙ্গালুরু",   "kn": "ಬೆಂಗಳೂರು",  "gu": "બેંગ્લોર"},
    "hyderabad":  {"ta": "ஹைதராபாத்",  "te": "హైదరాబాద్","bn": "হায়দ্রাবাদ",   "kn": "ಹೈದರಾಬಾದ್",  "gu": "હૈદરાબાદ"},
    "chennai":    {"ta": "சென்னை",     "te": "చెన్నై",    "bn": "চেন্নাই",      "kn": "ಚೆನ್ನೈ",     "gu": "ચેન્નાઇ"},
    "kolkata":    {"ta": "கொல்கத்தா", "te": "కోల్‌కతా", "bn": "কলকাতা",       "kn": "ಕೋಲ್ಕತ್ತಾ", "gu": "કોલકાતા"},
    "ujjain":     {"ta": "உஜ்ஜைன்",   "te": "ఉజ్జయిని", "bn": "উজ্জয়িনী",    "kn": "ಉಜ್ಜಯಿನಿ",  "gu": "ઉજ્જૈન"},
}


def get_access_token() -> str:
    return subprocess.check_output(
        ["gcloud", "auth", "print-access-token"], text=True
    ).strip()


def gemini_call(token: str, prompt: str, what: str) -> dict[str, str]:
    body = {
        "contents": [{"role": "user", "parts": [{"text": prompt}]}],
        "generationConfig": {
            "responseMimeType": "application/json",
            "temperature": 0.2,
            "maxOutputTokens": 8192,
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
    # Defensive: candidates can be missing (safety filter block), empty
    # (no completion produced), or have a malformed parts payload. Surface
    # the raw response when we hit any of those so a re-run isn't a guessing
    # game — see scripts/translate-yoga-expansions-via-gemini.py for the
    # same pattern (#643 Gemini round).
    try:
        candidates = raw.get("candidates", [])
        if not candidates:
            raise KeyError("no candidates (possibly safety-filter block)")
        text = candidates[0]["content"]["parts"][0]["text"]
    except (KeyError, IndexError, TypeError) as e:
        print(f"Gemini error ({what}):", json.dumps(raw)[:1000], file=sys.stderr)
        raise RuntimeError(f"Gemini call failed for {what}: {e}") from e
    try:
        return json.loads(text)
    except json.JSONDecodeError:
        text = re.sub(r"^```(?:json)?\n?|\n?```$", "", text.strip(), flags=re.MULTILINE)
        return json.loads(text)


def translate_cities(token: str, locale: str, locale_desc: str) -> dict[str, str]:
    seed_lines = []
    for slug, seeds in CITY_SEEDS.items():
        if locale in seeds:
            seed_lines.append(f'  "{slug}" → "{seeds[locale]}"')
    seed_block = "\n".join(seed_lines)
    prompt = (
        f"Translate the following Indian and diaspora city names to {locale_desc}.\n\n"
        f"Rules:\n"
        f"- Output ONLY a JSON object: {{\"slug\": \"native_name\", ...}}\n"
        f"- No markdown fences, no commentary, no extra keys.\n"
        f"- Use the Wikipedia-canonical native-script name (not transliteration).\n"
        f"- For diaspora cities (Dubai, Singapore, New York, Toronto, Fiji,\n"
        f"  San Francisco) use the locale-canonical transliteration.\n"
        f"- For Fiji (key 'fiji') the English name is 'Suva, Fiji' — keep both parts.\n"
        f"- Authority anchors (use these exactly for these slugs — do not alter):\n"
        f"{seed_block}\n\n"
        f"Input (English city names by slug):\n"
        + json.dumps(CITY_NAMES_EN, ensure_ascii=False, indent=2)
    )
    return gemini_call(token, prompt, f"cities/{locale}")


def translate_states(token: str, locale: str, locale_desc: str) -> dict[str, str]:
    prompt = (
        f"Translate the following Indian state names and country names to {locale_desc}.\n\n"
        f"Rules:\n"
        f"- Output ONLY a JSON object: {{\"english_name\": \"native_name\", ...}}\n"
        f"- Keys must be IDENTICAL to the input keys.\n"
        f"- Use formal/government-canonical native-script names.\n"
        f"- For countries (Canada, United Arab Emirates, United States, Singapore, Fiji)\n"
        f"  use the locale-canonical name.\n\n"
        f"Input:\n"
        + json.dumps(STATE_NAMES_EN, ensure_ascii=False, indent=2)
    )
    return gemini_call(token, prompt, f"states/{locale}")


def load_existing(path: Path) -> dict:
    if path.exists():
        try:
            return json.loads(path.read_text())
        except json.JSONDecodeError:
            return {}
    return {}


def merge_seeds(translated: dict[str, dict[str, str]]) -> dict[str, dict[str, str]]:
    """Overwrite Gemini output with author-curated seed values where defined."""
    out = {locale: dict(values) for locale, values in translated.items()}
    for slug, seeds in CITY_SEEDS.items():
        for locale, native in seeds.items():
            if locale in out:
                out[locale][slug] = native
    return out


def main() -> None:
    token = get_access_token()

    # --- Cities ---
    city_out = load_existing(CITY_OUT)
    for locale, desc in CITY_LOCALES.items():
        if locale in city_out and len(city_out[locale]) >= len(CITY_NAMES_EN):
            print(f"  skip cities/{locale}: complete ({len(city_out[locale])} keys)")
            continue
        print(f"Translating cities/{locale}…")
        t0 = time.time()
        city_out[locale] = translate_cities(token, locale, desc)
        print(f"  wrote cities/{locale}: {len(city_out[locale])} keys "
              f"({time.time()-t0:.1f}s)")
    city_out = merge_seeds(city_out)
    CITY_OUT.write_text(json.dumps(city_out, ensure_ascii=False, indent=2) + "\n")
    print(f"  saved {CITY_OUT}")

    # --- States ---
    state_out = load_existing(STATE_OUT)
    for locale, desc in STATE_LOCALES.items():
        if locale in state_out and len(state_out[locale]) >= len(STATE_NAMES_EN):
            print(f"  skip states/{locale}: complete ({len(state_out[locale])} keys)")
            continue
        print(f"Translating states/{locale}…")
        t0 = time.time()
        state_out[locale] = translate_states(token, locale, desc)
        print(f"  wrote states/{locale}: {len(state_out[locale])} keys "
              f"({time.time()-t0:.1f}s)")
    STATE_OUT.write_text(json.dumps(state_out, ensure_ascii=False, indent=2) + "\n")
    print(f"  saved {STATE_OUT}")


if __name__ == "__main__":
    main()
