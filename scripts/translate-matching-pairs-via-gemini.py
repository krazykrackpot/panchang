#!/usr/bin/env python3
"""
Translate the procedurally-generated summary + oneLiner text for all
78 rashi pairs in /matching, per locale. Runs after the data-dict
overlay (translate-matching-via-gemini.py) so the page achieves full
locale parity rather than half-translated.

The source `summary` and `oneLiner` are built at module load by
generateAllPairs() in rashi-compatibility.ts. We import that module
via a tiny TypeScript shim that dumps the EN strings, then send 78 of
each to Gemini per locale → 156 strings per locale × 7 = 1,092
translations across 7 calls.

Output: same per-locale overlay JSON files as the data-dict script,
with two new top-level keys: PAIR_SUMMARY (78 entries keyed by
"r1-r2") and PAIR_ONELINER (78 entries).
"""
import json
import re
import subprocess
import sys
import time
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
OUT_DIR = ROOT / "src/lib/constants"
PROJECT = "dekhopanchang"
MODEL = "gemini-2.5-flash"
ENDPOINT = (
    f"https://us-central1-aiplatform.googleapis.com/v1/projects/"
    f"{PROJECT}/locations/us-central1/publishers/google/models/"
    f"{MODEL}:generateContent"
)

LOCALES = {
    "mai": "Maithili (Devanagari, natural Maithili register, Sanskrit Jyotish terms in Devanagari)",
    "mr":  "Marathi (Devanagari, natural Marathi register, Sanskrit Jyotish terms in Devanagari)",
    "ta":  "Tamil (Tamil script, natural Tamil register, canonical Tamil Jyotish: லக்னம்/ராசி/கிரகம்/பாவம்)",
    "te":  "Telugu (Telugu script, natural Telugu register, canonical Telugu Jyotish: లగ్నం/రాశి/గ్రహం/భావం)",
    "kn":  "Kannada (Kannada script, natural Kannada register, canonical Kannada Jyotish: ಲಗ್ನ/ರಾಶಿ/ಗ್ರಹ/ಭಾವ)",
    "gu":  "Gujarati (Gujarati script, natural Gujarati register, canonical Gujarati Jyotish: લગ્ન/રાશિ/ગ્રહ/ભાવ)",
    "bn":  "Bengali (Bengali script, natural Bengali register, canonical Bengali Jyotish: লগ্ন/রাশি/গ্রহ/ভাব)",
}


def get_access_token() -> str:
    return subprocess.check_output(
        ["gcloud", "auth", "print-access-token"], text=True
    ).strip()


def dump_en_pairs() -> dict[str, dict[str, str]]:
    """
    Run a one-off TS evaluation to dump all 78 pair EN strings to JSON.
    Uses tsx + the existing generator. The dumper script is written
    next to this file so the import path resolves via tsconfig.
    """
    dumper = ROOT / "scripts/_dump-matching-en-pairs.ts"
    dumper.write_text(
        '''import { RASHI_PAIR_CONTENT } from '../src/lib/constants/rashi-compatibility';

const out: Record<string, { summary: string; oneLiner: string }> = {};
for (const p of RASHI_PAIR_CONTENT) {
  out[`${p.rashi1}-${p.rashi2}`] = {
    summary: p.summary.en,
    oneLiner: p.oneLiner.en,
  };
}
console.log(JSON.stringify(out));
'''
    )
    raw = subprocess.check_output(
        ["npx", "tsx", str(dumper)], text=True, cwd=str(ROOT)
    )
    dumper.unlink()
    return json.loads(raw.splitlines()[-1])


def gemini_translate_pair_strings(
    token: str,
    pairs: dict[str, dict[str, str]],
    locale: str,
    locale_desc: str,
) -> dict[str, dict[str, str]]:
    """
    Translate both summary and oneLiner for every pair in one Gemini call.
    Input + output are objects keyed by pair_id ("1-1" .. "12-12").
    """
    # Flatten to a single map for the prompt: {"1-1.summary": "...", "1-1.oneLiner": "..."}
    flat: dict[str, str] = {}
    for pair_id, fields in pairs.items():
        flat[f"{pair_id}.summary"] = fields["summary"]
        flat[f"{pair_id}.oneLiner"] = fields["oneLiner"]
    prompt = (
        f"You are translating Vedic astrology rashi-compatibility text "
        f"to {locale_desc}.\n\n"
        f"Rules:\n"
        f"- Output ONLY a JSON object, no markdown fences, no prose.\n"
        f"- Keys must be identical to the input.\n"
        f"- Keep numeric values (X/36) and house-axis notation (5/9, 6/8, 1/7) "
        f"identical to the source.\n"
        f"- Translate rashi names to the target locale's canonical form: "
        f"Aries→मेष/मेष/மேஷம்/మేషం/ಮೇಷ/મેષ/মেষ, "
        f"Taurus→वृषभ/वृषभ/ரிஷபம்/వృషభం/ವೃಷಭ/વૃષભ/বৃষ, "
        f"Gemini→मिथुन/मिथुन/மிதுனம்/మిథునం/ಮಿಥುನ/મિથુન/মিথুন, "
        f"Cancer→कर्क/कर्क/கடகம்/కర్కాటకం/ಕರ್ಕಾಟಕ/કર્ક/কর্কট, "
        f"Leo→सिंह/सिंह/சிம்மம்/సింహం/ಸಿಂಹ/સિંહ/সিংহ, "
        f"Virgo→कन्या/कन्या/கன்னி/కన్య/ಕನ್ಯಾ/કન્યા/কন্যা, "
        f"Libra→तुला/तुला/துலாம்/తులా/ತುಲಾ/તુલા/তুলা, "
        f"Scorpio→वृश्चिक/वृश्चिक/விருச்சிகம்/వృశ్చికం/ವೃಶ್ಚಿಕ/વૃશ્ચિક/বৃশ্চিক, "
        f"Sagittarius→धनु/धनु/தனுசு/ధనుస్సు/ಧನು/ધનુ/ধনু, "
        f"Capricorn→मकर/मकर/மகரம்/మకరం/ಮಕರ/મકર/মকর, "
        f"Aquarius→कुम्भ/कुम्भ/கும்பம்/కుంభం/ಕುಂಭ/કુંભ/কুম্ভ, "
        f"Pisces→मीन/मीन/மீனம்/మీనం/ಮೀನ/મીન/মীন. "
        f"Use only the form for your target locale.\n"
        f"- Translate planet names to canonical form (Sun=सूर्य/சூரியன்/సూర్యుడు/ಸೂರ್ಯ/સૂર્ય/সূর্য, etc.).\n"
        f"- Preserve the em-dash spacing ` – ` exactly.\n\n"
        f"Input:\n"
        + json.dumps(flat, ensure_ascii=False, indent=2)
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
        print(f"Gemini error ({locale}):", json.dumps(raw)[:800], file=sys.stderr)
        raise RuntimeError(f"Gemini call failed for {locale}")
    text = raw["candidates"][0]["content"]["parts"][0]["text"]
    try:
        parsed = json.loads(text)
    except json.JSONDecodeError:
        text = re.sub(
            r"^```(?:json)?\n?|\n?```$", "", text.strip(), flags=re.MULTILINE
        )
        parsed = json.loads(text)
    # Reconstitute nested form
    out: dict[str, dict[str, str]] = {}
    for k, v in parsed.items():
        pair_id, field = k.rsplit(".", 1)
        out.setdefault(pair_id, {})[field] = v
    return out


def main() -> None:
    print("Dumping EN pair strings...")
    en_pairs = dump_en_pairs()
    print(f"  got {len(en_pairs)} pairs")

    token = get_access_token()

    for locale, locale_desc in LOCALES.items():
        out_path = OUT_DIR / f"matching-{locale}-overlay.json"
        if not out_path.exists():
            print(f"  skip {locale}: base overlay missing; run data-dict script first")
            continue
        overlay = json.loads(out_path.read_text())
        if "PAIR_SUMMARY" in overlay and "PAIR_ONELINER" in overlay:
            sums = overlay.get("PAIR_SUMMARY") or {}
            ons = overlay.get("PAIR_ONELINER") or {}
            if len(sums) == 78 and len(ons) == 78:
                print(f"  skip {locale}: pair strings already present")
                continue
        print(f"Translating pair strings to {locale} ...")
        t0 = time.time()
        translated = gemini_translate_pair_strings(token, en_pairs, locale, locale_desc)
        elapsed = time.time() - t0
        sums: dict[str, str] = {}
        ons: dict[str, str] = {}
        missing = []
        for pair_id in en_pairs:
            entry = translated.get(pair_id) or {}
            if "summary" not in entry or "oneLiner" not in entry:
                missing.append(pair_id)
                continue
            sums[pair_id] = entry["summary"]
            ons[pair_id] = entry["oneLiner"]
        if missing:
            print(f"  WARN: {locale} missing {len(missing)} pairs (e.g. {missing[:5]})")
        overlay["PAIR_SUMMARY"] = sums
        overlay["PAIR_ONELINER"] = ons
        out_path.write_text(
            json.dumps(overlay, ensure_ascii=False, indent=2) + "\n"
        )
        total = sum(len(v) for v in sums.values()) + sum(len(v) for v in ons.values())
        print(f"  wrote {locale}: {len(sums)} summary + {len(ons)} oneLiner "
              f"({elapsed:.1f}s, {total} chars)")


if __name__ == "__main__":
    main()
