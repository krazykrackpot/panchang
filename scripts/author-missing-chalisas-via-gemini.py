#!/usr/bin/env python3
"""
Author canonical chalisa text + transliteration + meaning + significance
for the 7 slugs that were previously sitting in the sitemap as soft-404
leaks (PR #626 made them return the 404 component; this PR turns them
into real indexable pages).

Slugs + presiding deity:
  krishna-chalisa   — Sri Krishna (Vishnu's eighth avatar)
  kali-chalisa      — Goddess Kali (the fierce mother)
  santoshi-chalisa  — Goddess Santoshi Maa (a popular folk goddess of contentment)
  sai-baba-chalisa  — Shirdi Sai Baba (19th century saint)
  navagraha-chalisa — Navagraha collective (the nine planetary deities)
  surya-chalisa     — Surya Dev (Sun God)
  vishnu-chalisa    — Maha Vishnu (the preserver of the trimurti)

Output: /tmp/missing-chalisas.json keyed by slug → {devanagari, transliteration, meaning, significance, deityDay}.
A separate Python patcher prepends each entry to the CHALISAS array
in src/lib/content/devotional-content.ts.

Gemini receives the canonical traditional chalisa text where one
exists in classical sources (Hanuman Chalisa is by Tulsidas; Shiv
Chalisa, Durga Chalisa etc. each have well-established versions).
For slugs where the canonical text is sparse or apocryphal (e.g.
Santoshi Maa Chalisa is a 20th-century devotional composition), the
prompt asks Gemini to draw from publicly-known mainstream renderings.
"""
import json
import re
import subprocess
import sys
import time
import urllib.error
import urllib.request
from pathlib import Path

OUT_FILE = Path("/tmp/missing-chalisas.json")
PROJECT = "dekhopanchang"
MODEL = "gemini-2.5-flash"
ENDPOINT = (
    f"https://us-central1-aiplatform.googleapis.com/v1/projects/"
    f"{PROJECT}/locations/us-central1/publishers/google/models/"
    f"{MODEL}:generateContent"
)

SLUGS = [
    {
        "slug": "krishna-chalisa",
        "titleEn": "Krishna Chalisa",
        "titleHi": "कृष्ण चालीसा",
        "deity": "Krishna",
        "deityDay": 1,  # Monday — though Krishna is often worshipped on Wednesday too
        "lore": "Krishna is Vishnu's eighth avatar, born at midnight on Janmashtami in Kartik Krishna Ashtami. Famous for the Bhagavad Gita teachings to Arjuna at Kurukshetra, the playful Govardhan-lifting episode, the Maharaas with the gopis of Vrindavan, and the slaying of Kamsa. His standard iconography: blue-bodied, peacock-feather crown, flute (Murali), yellow pitambara dhoti, garland of vaijayanti flowers.",
    },
    {
        "slug": "kali-chalisa",
        "titleEn": "Kali Chalisa",
        "titleHi": "काली चालीसा",
        "deity": "Kali",
        "deityDay": 2,  # Tuesday
        "lore": "Kali is the fierce dark-skinned form of Shakti, slayer of Mahishasura, Raktabija (whose blood she drank), Chanda, and Munda. Iconography: garland of severed heads (mundamala), skirt of severed arms, four arms holding sword/sickle + severed head + boon and protection mudras, tongue lolling, dancing on Shiva's chest at the burning ground. Worshipped fiercely in Bengal, Assam, Odisha. Connected to Tantra and Dakshineshwar (Sri Ramakrishna's tradition).",
    },
    {
        "slug": "santoshi-chalisa",
        "titleEn": "Santoshi Chalisa",
        "titleHi": "सन्तोषी चालीसा",
        "deity": "Santoshi",
        "deityDay": 5,  # Friday — Santoshi Maa vrat is Friday
        "lore": "Santoshi Maa (Mother of Contentment) is a 20th-century folk goddess whose worship spread widely after the 1975 film 'Jai Santoshi Maa'. Daughter of Ganesha and sister of Shubha-Labh. Associated with the 16-Friday vrat (solah shukravar vrat) — devotees offer gur-chana, avoid khatta (sour foods), and listen to her katha. Iconography: red sari, lotus seat, two arms — sword and trishul; sometimes depicted with kheer offerings. Her boon is contentment (santosh), removal of family discord, and resolution of long-standing wishes.",
    },
    {
        "slug": "sai-baba-chalisa",
        "titleEn": "Sai Baba Chalisa",
        "titleHi": "साईं बाबा चालीसा",
        "deity": "Sai Baba",
        "deityDay": 4,  # Thursday — Sai Baba's day
        "lore": "Shirdi Sai Baba (c.1838-1918) was a saint of Maharashtra whose teaching synthesised Hindu and Sufi traditions. He lived in a dilapidated mosque (Dwarkamai) he renamed 'Mosque-Mata', kept a perpetual fire (Dhuni) burning, distributed udi (sacred ash) to devotees, and taught 'Sabka Malik Ek' (one master of all). Iconography: white kafni robe, head wrapped in cloth, seated cross-legged on a stone. Worshipped Thursday at Shirdi's Samadhi Mandir.",
    },
    {
        "slug": "navagraha-chalisa",
        "titleEn": "Navagraha Chalisa",
        "titleHi": "नवग्रह चालीसा",
        "deity": "Navagraha",
        "deityDay": 0,  # Sunday — multi-graha; the Sun day suits the navagraha mandala which centres on Surya
        "lore": "The Navagraha (nine planets) are: Surya (Sun), Chandra (Moon), Mangala (Mars), Budha (Mercury), Brihaspati/Guru (Jupiter), Shukra (Venus), Shani (Saturn), Rahu (north node), Ketu (south node). Each is a deva who governs a portion of karmic destiny. The Navagraha Chalisa praises all nine in turn, asking each to bestow benefic results and withhold malefic results. Recited to balance graha doshas (afflictions) in the natal chart — particularly during sade-sati, mahadasha transitions, and grahana periods.",
    },
    {
        "slug": "surya-chalisa",
        "titleEn": "Surya Chalisa",
        "titleHi": "सूर्य चालीसा",
        "deity": "Surya",
        "deityDay": 0,  # Sunday
        "lore": "Surya Dev is the visible Sun, riding a chariot drawn by seven horses driven by Aruna (the dawn). Father of Yama, Yamuna, Manu, the Ashwini Kumaras, Shani, and Karna. Consorts: Sanjana and Chhaya. Major temples: Konark, Modhera, Suryanar. Worshipped at Arghya at sunrise (the Surya Namaskar tradition derives from this). In Jyotish, Surya governs ego, vitality, paternal lineage, government, and the soul (atma karaka). Worshipped on Sundays and during Sankranti / Ratha Saptami / Chhath.",
    },
    {
        "slug": "vishnu-chalisa",
        "titleEn": "Vishnu Chalisa",
        "titleHi": "विष्णु चालीसा",
        "deity": "Vishnu",
        "deityDay": 4,  # Thursday — Vishnu's day (also linked to Brihaspati)
        "lore": "Vishnu is the preserver of the trimurti (with Brahma the creator and Shiva the destroyer). Iconography: four arms holding shankha (conch), chakra (Sudarshana discus), gada (mace), and padma (lotus); reclining on Shesha-naga in Kshira Sagara with Lakshmi at his feet; Garuda is his vahana. His ten avatars (Dashavatara): Matsya, Kurma, Varaha, Narasimha, Vamana, Parashurama, Rama, Krishna, Buddha, Kalki. Worshipped Thursday, on Ekadashi (the 11th lunar day of each fortnight), and at Vaikuntha Ekadashi.",
    },
]

PROMPT_TEMPLATE = """You are authoring the canonical text of a Hindu chalisa
(a devotional hymn of 40 chaupais bookended by two dohas) for a Vedic-
astrology educational website. Output an authentic, traditional rendering
that reflects mainstream sources — NOT a creative reinterpretation.

INPUT — slug + presiding deity:
{record_json}

OUTPUT — JSON object with EXACTLY these 4 keys:
{{
  "devanagari": "<the complete chalisa in Devanagari script. Format:
    line 1 is `॥ दोहा ॥` (opening doha label). Lines 2-3 are the
    opening doha (2 lines). Then `॥ चौपाई ॥` label. Then 40 chaupais
    (typically 20 line-pairs, so 40 lines, each a-end-rhymed). Then a
    closing `॥ दोहा ॥` label and a final closing doha. Use Devanagari
    danda (।) and double-danda (॥) punctuation. Source from mainstream
    published renderings — DO NOT invent new chaupais. If a canonical
    full 40-chaupai text is not publicly available for this deity,
    output the most widely circulated published version even if shorter
    (e.g. Santoshi Chalisa is typically 20 chaupais).>",
  "transliteration": "<the same chalisa transliterated to Roman script
    with IAST conventions where possible. Same line structure as
    devanagari. Use `||` for danda and double-danda. About 60-80% the
    length of the Devanagari is fine; this is a navigation aid, not a
    word-for-word phonetic.>",
  "meaning": "<200-300 word prose walking through the chalisa's
    teaching. Reference the deity's specific iconography, vahana,
    consorts, weapons, and major puranic episodes the text alludes to.
    Walk through the opening doha, the central chaupais, and the closing
    prayer. Output as flowing prose, paragraphs separated by double-
    newlines (\\n\\n).>",
  "significance": "<200-300 word prose on when, how, and why the
    chalisa is recited. Cover the weekday, festival window, life
    situations devotees turn to it for, recommended count, purification
    rituals, and how it complements primary mantras of the same deity.
    Mention regional or sectarian traditions. Output as flowing prose,
    paragraphs separated by double-newlines.>"
}}

Rules:
- Output ONLY the JSON object, no markdown fences, no commentary.
- British English spelling for the meaning + significance prose.
- Devanagari + transliteration use traditional terminology.
- Educated devotee + scholar register. No hyperbole, no salesy claims.
- The deity's character must be portrayed accurately (Kali fierce
  warrior + Tantric mother, Krishna playful + Yogeshvara, Santoshi
  Maa folk-goddess of contentment, Sai Baba Sufi-Hindu synthesis,
  Surya solar-jyotish, Vishnu preserver, Navagraha karmic regulators).
- Strict: chalisa text is from published mainstream sources only.
  DO NOT compose new verses.
"""


def get_access_token() -> str:
    return subprocess.check_output(
        ["gcloud", "auth", "print-access-token"], text=True, stderr=subprocess.PIPE
    ).strip()


def gemini_generate(token: str, record: dict) -> dict:
    prompt = PROMPT_TEMPLATE.format(record_json=json.dumps(record, ensure_ascii=False, indent=2))
    body = {
        "contents": [{"role": "user", "parts": [{"text": prompt}]}],
        "generationConfig": {
            "responseMimeType": "application/json",
            "temperature": 0.4,
            "maxOutputTokens": 8192,
        },
    }
    body_bytes = json.dumps(body, ensure_ascii=False).encode("utf-8")
    for attempt in range(5):
        try:
            req = urllib.request.Request(
                ENDPOINT, data=body_bytes, method="POST",
                headers={
                    "Authorization": f"Bearer {token}",
                    "Content-Type": "application/json; charset=utf-8",
                },
            )
            with urllib.request.urlopen(req, timeout=240) as resp:
                raw = json.loads(resp.read().decode("utf-8"))
            text = raw["candidates"][0]["content"]["parts"][0]["text"]
            try:
                parsed = json.loads(text)
            except json.JSONDecodeError:
                text = re.sub(r"^```(?:json)?\n?|\n?```$", "", text.strip(), flags=re.MULTILINE)
                parsed = json.loads(text)
            if not all(k in parsed for k in ("devanagari", "transliteration", "meaning", "significance")):
                raise RuntimeError(f"missing keys: {list(parsed.keys())}")
            return parsed
        except urllib.error.HTTPError as e:
            print(f"  attempt {attempt+1} HTTP {e.code}: {e.read().decode('utf-8','replace')[:200]}", file=sys.stderr, flush=True)
            time.sleep(2 ** attempt)
        except Exception as e:
            print(f"  attempt {attempt+1}: {type(e).__name__}: {str(e)[:200]}", file=sys.stderr, flush=True)
            time.sleep(2 ** attempt)
    raise RuntimeError("exhausted retries")


def main() -> int:
    token = get_access_token()
    print(f"ADC token: {token[:20]}...", flush=True)

    existing: dict[str, dict] = {}
    if OUT_FILE.exists():
        try:
            existing = json.loads(OUT_FILE.read_text(encoding="utf-8"))
        except json.JSONDecodeError:
            existing = {}

    for spec in SLUGS:
        slug = spec["slug"]
        if slug in existing:
            print(f"  [{slug}] already authored ({len(existing[slug]['devanagari'])}c Devanagari)", flush=True)
            continue
        print(f"  [{slug}] generating...", flush=True)
        try:
            parsed = gemini_generate(token, spec)
        except Exception as e:
            print(f"  [{slug}] FAILED: {e}", file=sys.stderr, flush=True)
            continue
        parsed["_spec"] = spec
        existing[slug] = parsed
        OUT_FILE.write_text(json.dumps(existing, ensure_ascii=False, indent=2), encoding="utf-8")
        print(
            f"  [{slug}] OK — "
            f"devanagari {len(parsed['devanagari'])}c, "
            f"meaning {len(parsed['meaning'])}c, "
            f"significance {len(parsed['significance'])}c",
            flush=True,
        )

    print(f"\nWrote {OUT_FILE} ({len(existing)} chalisas)", flush=True)
    return 0


if __name__ == "__main__":
    sys.exit(main())
