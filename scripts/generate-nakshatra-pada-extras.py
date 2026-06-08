#!/usr/bin/env python3
"""
Generate two additional per-pada fields (spiritualPractice, decisions) for
each of the 108 nakshatra-padas, in en + hi. Output:
src/lib/constants/nakshatra-pada-extras.json.

Background: the existing NAKSHATRA_PADA_PROFILES carries 4 sub-sections
(personality/career/relationships/health) of ~25-30 words each. Combined
body is ~100-120 words pre-chrome — borderline thin for SEO. Adding two
more domain-specific sections (~30-40 words each) brings the body into
the safe ~160-200 word range per page.

The new fields:
  - spiritualPractice: recommended sadhana, mantra, deity worship,
    fast/observance for natives of this pada. Grounded in classical
    nakshatra correspondences (Ashwini → Ashwini Kumara prayer,
    Bharani → Yama Sukta, etc.).
  - decisions: how this pada native approaches life decisions —
    pace, risk tolerance, signature blind spots, recommended
    advisory style.

Same Gemini pipeline as previous scripts (UTF-8, defensive candidate
unpacking, 3-attempt retry). One EN authoring call + one HI translation
call. /learn/nakshatra-pada/* is en+hi-only (INDEXABLE_EN_HI per
src/lib/seo/indexable-locales.ts) — no need to translate the other 7.
"""
import json
import re
import subprocess
import sys
import time
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
OUT_PATH = ROOT / "src/lib/constants/nakshatra-pada-extras.json"
PROJECT = "dekhopanchang"
MODEL = "gemini-2.5-flash"
ENDPOINT = (
    f"https://us-central1-aiplatform.googleapis.com/v1/projects/"
    f"{PROJECT}/locations/us-central1/publishers/google/models/"
    f"{MODEL}:generateContent"
)

# 27 nakshatras → presiding deity (mirror of NAKSHATRAS in src/lib/constants/
# nakshatras.ts).  Keys 1-27.
NAKSHATRA_DEITIES = {
    1: "Ashwini Kumaras", 2: "Yama", 3: "Agni", 4: "Brahma / Prajapati",
    5: "Soma / Chandra", 6: "Rudra", 7: "Aditi", 8: "Brihaspati",
    9: "Sarpa (Naga)", 10: "Pitru", 11: "Aryaman", 12: "Bhaga",
    13: "Savitur / Surya", 14: "Tvashtar / Vishwakarma", 15: "Vayu",
    16: "Indra / Agni", 17: "Mitra", 18: "Indra", 19: "Nirriti",
    20: "Apas (Waters)", 21: "Vishvedeva", 22: "Vishnu", 23: "Vasus",
    24: "Varuna", 25: "Aja Ekapada", 26: "Ahirbudhnya", 27: "Pushan",
}
NAKSHATRA_NAMES = {
    1: "Ashwini", 2: "Bharani", 3: "Krittika", 4: "Rohini", 5: "Mrigashira",
    6: "Ardra", 7: "Punarvasu", 8: "Pushya", 9: "Ashlesha", 10: "Magha",
    11: "Purva Phalguni", 12: "Uttara Phalguni", 13: "Hasta", 14: "Chitra",
    15: "Swati", 16: "Vishakha", 17: "Anuradha", 18: "Jyeshtha", 19: "Mula",
    20: "Purva Ashadha", 21: "Uttara Ashadha", 22: "Shravana", 23: "Dhanishta",
    24: "Shatabhisha", 25: "Purva Bhadrapada", 26: "Uttara Bhadrapada", 27: "Revati",
}
NAVAMSHA_SIGNS = {
    1: "Aries", 2: "Taurus", 3: "Gemini", 4: "Cancer", 5: "Leo", 6: "Virgo",
    7: "Libra", 8: "Scorpio", 9: "Sagittarius", 10: "Capricorn",
    11: "Aquarius", 12: "Pisces",
}


def navamsha_for(nakshatra_id: int, pada: int) -> int:
    # Each pada is one navamsha (1/4 rashi). Pada 1 of nakshatra 1 = Aries (1).
    # Total padas before this one: (nakshatra_id - 1) * 4 + (pada - 1).
    # Each navamsha is 1/9 of a sign — but the standard convention is that
    # 27 nakshatras × 4 padas = 108 navamshas = 12 signs × 9 navamshas/sign.
    # The first pada of each nakshatra steps forward 4 navamshas. The cycle
    # restarts every 3 nakshatras (3 × 4 = 12 = full circle), so the
    # navamsha sign for (nakshatra_id, pada) = ((nakshatra_id - 1) * 4 + (pada - 1)) % 12 + 1.
    return ((nakshatra_id - 1) * 4 + (pada - 1)) % 12 + 1


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
                    "curl", "-s", "-f", "--max-time", "300",
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


def all_padas() -> list:
    out = []
    for n in range(1, 28):
        for p in range(1, 5):
            out.append({
                "key": f"{n}-{p}",
                "nakshatra": NAKSHATRA_NAMES[n],
                "deity": NAKSHATRA_DEITIES[n],
                "pada": p,
                "navamsha": NAVAMSHA_SIGNS[navamsha_for(n, p)],
            })
    return out


def author_english(token: str) -> dict:
    padas = all_padas()
    # 108 entries × ~80 chars input = ~8.6KB; Gemini handles it in one call.
    inputs = {pd["key"]: {k: v for k, v in pd.items() if k != "key"} for pd in padas}
    prompt = (
        "For each of the 108 nakshatra-padas below, write TWO short prose "
        "fields. The pada is identified by its nakshatra name + presiding "
        "deity + pada number (1-4) + navamsha sign. Use those four anchors "
        "to ground each field in classical Vedic-astrology tradition.\n\n"
        "Field 1 — `spiritualPractice` (30-40 words):\n"
        "  Recommended sadhana / spiritual practice for natives of this "
        "pada. Cover the presiding deity's mantra or stotra; a fasting / "
        "observance day if applicable; a charitable or service-oriented "
        "practice that suits the pada's nature. Be specific (named mantra, "
        "named tithi, named dāna).\n\n"
        "Field 2 — `decisions` (30-40 words):\n"
        "  How this pada native approaches major life decisions — their "
        "pace, risk tolerance, signature blind spots, and the kind of "
        "advice they need. Practical, not abstract.\n\n"
        "Tone: factual, classical Vedic-astrology register. No purple "
        "prose. Don't invent practices — reference real classical "
        "traditions (Ashwini → Ashwini Kumara prayer / Madhu Vidya / "
        "Sushruta Samhita lineage; Bharani → Yama Sukta + Kalashtami "
        "observance; Pushya → Pushya Mantra / Guru Pushya Yoga; etc.).\n\n"
        "Output format: ONLY a JSON object with the SAME 108 keys as the "
        "input. Each value is an object with `spiritualPractice` and "
        "`decisions` (both strings). No markdown fences.\n\n"
        f"Input (key → {{nakshatra, deity, pada, navamsha}}):\n"
        + json.dumps(inputs, indent=2)
    )
    text = gemini_call(token, prompt)
    parsed = parse_json_text(text)
    missing = [
        pd["key"] for pd in padas
        if pd["key"] not in parsed
           or not isinstance(parsed[pd["key"]].get("spiritualPractice"), str)
           or not isinstance(parsed[pd["key"]].get("decisions"), str)
    ]
    if missing:
        raise RuntimeError(f"EN authoring missing entries: {missing[:5]}")
    return parsed


def translate_hi(token: str, en_obj: dict) -> dict:
    prompt = (
        "Translate the following English Vedic-astrology pada-prose pairs to "
        "Hindi (Devanagari, natural Hindi register).\n\n"
        "Rules:\n"
        "- Output ONLY a JSON object with the SAME keys and field names as the input.\n"
        "- Each entry has `spiritualPractice` and `decisions` — translate both.\n"
        "- Retain canonical Sanskrit terms (तिथि, नक्षत्र, मंत्र, स्तोत्र, यज्ञ, etc.) "
        "transliterated to Devanagari.\n"
        "- Deity names: target script (Yama → यम, Aryaman → अर्यमा, etc.)\n"
        "- Tone matches source: clear, classical, no purple prose.\n\n"
        f"Input:\n{json.dumps(en_obj, ensure_ascii=False, indent=2)}"
    )
    text = gemini_call(token, prompt)
    parsed = parse_json_text(text)
    missing = [
        k for k in en_obj.keys()
        if k not in parsed
           or not isinstance(parsed[k].get("spiritualPractice"), str)
           or not isinstance(parsed[k].get("decisions"), str)
    ]
    if missing:
        raise RuntimeError(f"HI translation missing: {missing[:5]}")
    return parsed


def main():
    token = get_token()
    print("Authoring EN pada extras via Gemini (108 entries)...")
    t0 = time.time()
    en = author_english(token)
    print(f"  done in {time.time()-t0:.1f}s")
    print("Translating to hi...")
    t0 = time.time()
    hi = translate_hi(token, en)
    print(f"  done in {time.time()-t0:.1f}s")
    out = {}
    for key, en_entry in en.items():
        hi_entry = hi[key]
        out[key] = {
            "spiritualPractice": {"en": en_entry["spiritualPractice"], "hi": hi_entry["spiritualPractice"]},
            "decisions": {"en": en_entry["decisions"], "hi": hi_entry["decisions"]},
        }
    OUT_PATH.parent.mkdir(parents=True, exist_ok=True)
    OUT_PATH.write_text(json.dumps(out, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(f"Wrote {OUT_PATH} ({len(out)} entries)")


if __name__ == "__main__":
    main()
