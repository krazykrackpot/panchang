#!/usr/bin/env python3
"""
Translate /baby-names long-form chrome paragraphs via Gemini 2.5 Flash
on Vertex AI for the 6 missing locales (mai/mr/te/kn/gu/bn).

The /baby-names cluster has small surface: 2 pages × ~7 long paragraphs
each = 14 long-form strings per locale × 6 locales = 84 translations.
Short labels (page title, nav, button text) are inlined in the page
LABELS dict using well-known Vedic vocabulary — no need to run them
through Gemini.

Output: src/lib/constants/baby-names-labels-overlay.json — keyed by
locale then by label key. Hand-pasted into the page LABELS dict.
"""
import json
import re
import subprocess
import sys
import time
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
OUT_PATH = ROOT / "src/lib/constants/baby-names-labels-overlay.json"
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
    "te":  "Telugu (Telugu script, natural Telugu register, canonical Telugu Jyotish: నక్షత్రం/పదము/అక్షరం)",
    "kn":  "Kannada (Kannada script, natural Kannada register, canonical Kannada Jyotish: ನಕ್ಷತ್ರ/ಪಾದ/ಅಕ್ಷರ)",
    "gu":  "Gujarati (Gujarati script, natural Gujarati register, canonical Gujarati Jyotish: નક્ષત્ર/પાદ/અક્ષર)",
    "bn":  "Bengali (Bengali script, natural Bengali register, canonical Bengali Jyotish: নক্ষত্র/পদ/অক্ষর)",
}

SOURCE_LABELS: dict[str, str] = {
    # Index page
    "heroSubtitle": "Find auspicious name syllables based on your birth Nakshatra & Pada",
    "intro1": "Enter your child's birth date, time, and place below to find the starting syllables (Aksharas) prescribed by Vedic tradition. Each of the 27 birth Nakshatras has 4 Padas, giving 108 sacred starting sounds — one for each bead of the Japa Mala — and a name beginning with the right syllable aligns the child with the vibration of their birth star.",
    "intro2": "This naming convention comes from the Namakarana Samskara, one of the 16 sacred rites (Shodasha Samskaras) in the Grihya Sutras. Many families today use the Nakshatra syllable as a guide rather than a strict rule, choosing a name that begins with the right sound but fits their language and culture.",
    "whyTitle": "Why Nakshatra Syllables?",
    "whyBody": "Each nakshatra spans 13°20′ of the zodiac and has 4 padas (quarters). Each pada has a designated starting syllable rooted in Sanskrit phonetics. The sound vibration of the first syllable sets the energetic tone for the name.",
    "howTitle": "How It Works",
    "howBody": "Find the Moon's nakshatra at birth → identify the pada (1–4) → use the corresponding syllable as the starting sound for the child's name. The Moon's exact degree determines which of the 108 padas applies.",
    "modernTitle": "Modern Practice",
    "modernBody": "While traditional, many families today use nakshatra syllables as a guide rather than strict rule — choosing a name that starts with the right sound but fits their language and culture.",
    "padaTitle": "What are Padas?",
    "padaBody": "Each nakshatra (birth star) is divided into 4 quarters called \"Padas.\" Each pada is associated with a specific starting syllable for the baby's name. In the Hindu naming tradition (Namakarana), the child's name should begin with the syllable of their birth pada — this is believed to align the child's identity with their cosmic vibration. Your baby's pada is determined by the exact position of the Moon at the time of birth.",
    "syllableHint": "Your baby's name should ideally start with one of these syllables",
    "exampleHint": "For example, if the syllable is \"Chu\", names like \"Chudamani\", \"Chulbul\" etc. are auspicious.",
    "referenceTitle": "Complete Syllable Reference",
    "referenceSubtitle": "All 27 Nakshatras × 4 Padas — find the starting syllable for any birth star",
    # [nakshatra] detail page
    "detailEdu1": "According to Vedic tradition, a child's name should begin with the syllable associated with their birth nakshatra pada. For babies born in {NAK} nakshatra, the first letter of the name is determined by the pada (quarter) of the Moon's nakshatra at the time of birth. This practice, called Namakarana, aligns the child's name with their cosmic vibration.",
    "detailEdu2": "To determine the exact syllable, you need the child's birth date, time, and location — this allows precise calculation of the Moon's nakshatra and pada. Our Kundali tool computes this automatically.",
}


def get_access_token() -> str:
    return subprocess.check_output(
        ["gcloud", "auth", "print-access-token"], text=True
    ).strip()


def gemini_translate(token: str, locale: str, locale_desc: str) -> dict[str, str]:
    prompt = (
        f"Translate the following English Vedic-astrology baby-naming "
        f"content to {locale_desc}.\n\n"
        f"Rules:\n"
        f"- Output ONLY a JSON object, no markdown fences, no commentary.\n"
        f"- Keys must be identical to the input.\n"
        f"- Keep the placeholder `{{NAK}}` exactly as-is — it's a runtime "
        f"  variable substitution for the nakshatra name.\n"
        f"- Sanskrit terms (Nakshatra, Pada, Akshara, Namakarana, Samskara, "
        f"  Japa Mala, Grihya Sutras) → canonical Vedic form in the target "
        f"  script (e.g. mai/mr: नक्षत्र/पाद/अक्षर; gu: નક્ષત્ર/પાદ; "
        f"  bn: নক্ষত্র/পদ; te: నక్షత్రం/పదము; kn: ನಕ್ಷತ್ರ/ಪಾದ; ta: நட்சத்திரம்/பாதம்).\n"
        f"- Numeric symbols `°` `′` and arrow `→` stay as-is.\n"
        f"- Keep the em-dash spacing ` — ` consistent with the source.\n\n"
        f"Input:\n"
        + json.dumps(SOURCE_LABELS, ensure_ascii=False, indent=2)
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
    if "candidates" not in raw:
        print(f"Gemini error ({locale}):", json.dumps(raw)[:500], file=sys.stderr)
        raise RuntimeError(f"Gemini call failed for {locale}")
    text = raw["candidates"][0]["content"]["parts"][0]["text"]
    try:
        return json.loads(text)
    except json.JSONDecodeError:
        text = re.sub(r"^```(?:json)?\n?|\n?```$", "", text.strip(), flags=re.MULTILINE)
        return json.loads(text)


def main() -> None:
    token = get_access_token()
    out: dict[str, dict[str, str]] = {}
    if OUT_PATH.exists():
        existing = json.loads(OUT_PATH.read_text())
        out = existing if isinstance(existing, dict) else {}
    for locale, locale_desc in LOCALES.items():
        if locale in out and len(out[locale]) >= len(SOURCE_LABELS):
            print(f"  skip {locale}: complete")
            continue
        print(f"Translating {locale}...")
        t0 = time.time()
        out[locale] = gemini_translate(token, locale, locale_desc)
        elapsed = time.time() - t0
        total = sum(len(v) for v in out[locale].values())
        print(f"  wrote {locale}: {len(out[locale])} keys ({elapsed:.1f}s, {total} chars)")
        OUT_PATH.write_text(
            json.dumps(out, ensure_ascii=False, indent=2) + "\n"
        )


if __name__ == "__main__":
    main()
