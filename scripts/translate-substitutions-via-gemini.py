#!/usr/bin/env python3
"""
Translate COMMON_SUBSTITUTIONS (10 entries × 3 LocaleText fields) to
7 visible regional locales via Gemini 2.5 Flash on Vertex AI.

Output: src/lib/constants/puja-vidhi/substitutions-{locale}-overlay.json
Keyed by `<key>.<field>` (e.g. "durva.note").

Single-shot script — corpus is small enough for one batch per locale.
"""
import concurrent.futures
import json
import re
import subprocess
import sys
import time
import urllib.error
import urllib.request
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
OUT_DIR = ROOT / "src/lib/constants/puja-vidhi"
PROJECT = "dekhopanchang"
MODEL = "gemini-2.5-flash"
ENDPOINT = (
    f"https://us-central1-aiplatform.googleapis.com/v1/projects/"
    f"{PROJECT}/locations/us-central1/publishers/google/models/"
    f"{MODEL}:generateContent"
)

LOCALES = {
    "ta":  "Tamil (Tamil script. Practical how-to register — sourcing-tip "
           "instructions. Sanskrit/Hindi ritual terms keep canonical "
           "transliteration: துர்வா, துளசி, பில்வம், கற்பூரம், குங்குமம், "
           "சுபாரி, அக்ஷதம், சிந்தூரம், கோமயம், பான்.)",
    "te":  "Telugu (Telugu script. Practical how-to register. Canonical: "
           "దూర్వా, తులసి, బిల్వం, కర్పూరం, కుంకుమ, సుపారి, అక్షతం, "
           "సింధూరం, గోమయం, పాన్.)",
    "bn":  "Bengali (Bengali script. Practical how-to register. Canonical: "
           "দূর্বা, তুলসী, বিল্ব, কর্পূর, কুমকুম, সুপারি, অক্ষত, সিঁদুর, "
           "গোময়, পান.)",
    "gu":  "Gujarati (Gujarati script. Practical how-to register. "
           "Canonical: દૂર્વા, તુલસી, બિલ્વ, કપૂર, કુમકુમ, સોપારી, "
           "અક્ષત, સિંદૂર, ગોમય, પાન.)",
    "kn":  "Kannada (Kannada script. Practical how-to register. Canonical: "
           "ದೂರ್ವಾ, ತುಳಸಿ, ಬಿಲ್ವ, ಕರ್ಪೂರ, ಕುಂಕುಮ, ಸುಪಾರಿ, ಅಕ್ಷತ, "
           "ಸಿಂದೂರ, ಗೋಮಯ, ಪಾನ.)",
    "mai": "Maithili (Devanagari script — distinct from Hindi: अछि/भेल/किनसँ. "
           "Practical how-to register.)",
    "mr":  "Marathi (Devanagari script. Practical how-to register.)",
}

# Extracted from src/lib/constants/puja-vidhi/substitutions.ts. Keys are
# `<entry-key>.<field>`. Brand names (Amazon) and quoted English search
# terms ("dried bel patra", "edible camphor", "cow dung cakes",
# "lead-free", "pachai karpooram") stay in English in the translations.
JOBS: dict[str, str] = {
    "durva.original":   "Durva grass",
    "durva.substitute": "Fresh wheatgrass",
    "durva.note":       "Available at health food stores or juice bars. Can also grow at home from wheat berries in a tray within 7–10 days.",
    "tulsi.original":   "Tulsi (Holy Basil)",
    "tulsi.substitute": "Sweet Basil",
    "tulsi.note":       "Same plant family (Ocimum), available at any grocery store. Italian basil works as a substitute in puja.",
    "bilva.original":   "Bilva/Bel leaves",
    "bilva.substitute": "Order dried bilva online",
    "bilva.note":       "Search \"dried bel patra\" on Amazon or Indian grocery websites. Dried leaves are accepted in Shiva puja when fresh ones are unavailable.",
    "camphor.original": "Camphor (Bhimseni)",
    "camphor.substitute": "Edible camphor tablets",
    "camphor.note":     "Search \"edible camphor\" or \"pachai karpooram\" on Amazon. Do not use synthetic/industrial camphor  –  only food-grade for puja.",
    "kumkum.original":  "Kumkum (Vermillion)",
    "kumkum.substitute": "Turmeric + lime juice",
    "kumkum.note":      "Mix turmeric powder with a few drops of lime juice to get a red kumkum-like colour. This is the traditional method of making kumkum.",
    "supari.original":  "Supari (Betel nut)",
    "supari.substitute": "Available at Indian stores",
    "supari.note":      "Most Indian grocery stores stock whole supari. In puja, even a small piece suffices as a symbolic offering.",
    "akshat.original":  "Akshat (unbroken rice)",
    "akshat.substitute": "Any unbroken white rice",
    "akshat.note":      "Any unbroken long-grain or basmati white rice works. Ensure the grains are whole  –  broken rice should not be used in puja.",
    "sindoor.original": "Sindoor",
    "sindoor.substitute": "Available at Indian stores",
    "sindoor.note":     "Find at Indian grocery stores in the puja supplies section. Lead-free sindoor is recommended  –  check for \"lead-free\" on the label.",
    "cowdung.original": "Cow dung cakes",
    "cowdung.substitute": "Order online or skip",
    "cowdung.note":     "Search \"cow dung cakes\" on Amazon or Indian grocery sites. If unavailable, this item can be omitted  –  the puja remains valid without it.",
    "paan.original":    "Paan (Betel leaves)",
    "paan.substitute":  "Any broad green leaf",
    "paan.note":        "Check Indian stores first. If unavailable, a broad green leaf like spinach or chard can serve as a symbolic substitute.",
}


def get_access_token() -> str:
    try:
        return subprocess.check_output(
            ["gcloud", "auth", "print-access-token"], text=True, stderr=subprocess.PIPE
        ).strip()
    except FileNotFoundError as exc:
        raise SystemExit("gcloud CLI not found on PATH.") from exc
    except subprocess.CalledProcessError as exc:
        raise SystemExit(f"gcloud token retrieval failed: {exc.stderr or '(empty)'}") from exc


def gemini_translate_batch(token: str, texts: list[str], locale: str, locale_desc: str) -> list[str]:
    prompt = (
        f"You are translating Hindu puja-substitution sourcing tips "
        f"(when traditional materials are unavailable, what to use "
        f"instead and where to find substitutes) to {locale_desc}.\n\n"
        f"Rules:\n"
        f"- Output ONLY the JSON object, no markdown fences.\n"
        f"- Practical instructional register — clear, brief, helpful.\n"
        f"- Sacred plant/material names (Tulsi, Bilva, Durva, Supari, "
        f"Akshat, Sindoor, Kumkum, Camphor, Paan, Bhimseni): "
        f"target-language canonical transliteration in the target script.\n"
        f"- Brand names (Amazon) and English search-query strings inside "
        f"double-quotes (\"dried bel patra\", \"edible camphor\", "
        f"\"pachai karpooram\", \"cow dung cakes\", \"lead-free\") stay "
        f"AS-IS in English.\n"
        f"- Preserve em-dash spacing ` – `, parentheticals, "
        f"and the 7–10 day-range hyphen.\n\n"
        f"Input is a JSON object with numeric keys mapping to English text. "
        f"Output a JSON object with the SAME numeric keys mapping to "
        f"translations.\n\n"
        f"Input:\n"
        + json.dumps({str(i): t for i, t in enumerate(texts)}, ensure_ascii=False, indent=2)
    )
    body = {
        "contents": [{"role": "user", "parts": [{"text": prompt}]}],
        "generationConfig": {
            "responseMimeType": "application/json",
            "temperature": 0.3,
            "maxOutputTokens": 8192,
        },
    }
    body_bytes = json.dumps(body, ensure_ascii=False).encode("utf-8")
    for attempt in range(3):
        try:
            req = urllib.request.Request(
                ENDPOINT, data=body_bytes, method="POST",
                headers={
                    "Authorization": f"Bearer {token}",
                    "Content-Type": "application/json; charset=utf-8",
                },
            )
            with urllib.request.urlopen(req, timeout=180) as resp:
                raw = json.loads(resp.read().decode("utf-8"))
            if "candidates" not in raw:
                raise RuntimeError(f"no candidates: {json.dumps(raw)[:300]}")
            text = raw["candidates"][0]["content"]["parts"][0]["text"]
            try:
                parsed = json.loads(text)
            except json.JSONDecodeError:
                text = re.sub(r"^```(?:json)?\n?|\n?```$", "", text.strip(), flags=re.MULTILINE)
                parsed = json.loads(text)
            if isinstance(parsed, list):
                if len(parsed) != len(texts):
                    raise RuntimeError(f"array len {len(parsed)} != expected {len(texts)}")
                return [str(parsed[i]) for i in range(len(texts))]
            return [parsed[str(i)] for i in range(len(texts))]
        except urllib.error.HTTPError as e:
            try:
                body_excerpt = e.read().decode("utf-8", errors="replace")[:300]
            except Exception:
                body_excerpt = "(unreadable body)"
            if attempt == 2:
                print(f"  [{locale}] HTTP {e.code}: {body_excerpt}", file=sys.stderr)
                raise
            print(f"  [{locale}] retry {attempt+1} HTTP {e.code}: {body_excerpt[:150]}", file=sys.stderr)
            time.sleep(2 ** attempt)
        except (urllib.error.URLError, json.JSONDecodeError, KeyError, IndexError, TypeError, RuntimeError) as e:
            if attempt == 2:
                raise
            print(f"  [{locale}] retry {attempt+1}: {str(e)[:100]}", file=sys.stderr)
            time.sleep(2 ** attempt)
    raise RuntimeError("unreachable")


def translate_locale(locale: str, token: str) -> dict[str, str]:
    locale_desc = LOCALES[locale]
    keys = list(JOBS.keys())
    texts = [JOBS[k] for k in keys]
    print(f"[{locale}] {len(texts)} strings — single batch")
    translations = gemini_translate_batch(token, texts, locale, locale_desc)
    out = {k: t for k, t in zip(keys, translations)}
    out_path = OUT_DIR / f"substitutions-{locale}-overlay.json"
    tmp = out_path.with_suffix(".json.tmp")
    tmp.write_text(json.dumps(out, ensure_ascii=False, indent=2, sort_keys=True), encoding="utf-8")
    tmp.replace(out_path)
    print(f"[{locale}] wrote {out_path} ({len(out)} entries)")
    return out


def main() -> int:
    OUT_DIR.mkdir(parents=True, exist_ok=True)
    token = get_access_token()
    print(f"ADC token: {token[:20]}...")
    print(f"Translating {len(LOCALES)} locales in parallel: {list(LOCALES.keys())}")
    with concurrent.futures.ThreadPoolExecutor(max_workers=len(LOCALES)) as ex:
        futures = {ex.submit(translate_locale, l, token): l for l in LOCALES}
        for fut in concurrent.futures.as_completed(futures):
            locale = futures[fut]
            try:
                fut.result()
                print(f"[{locale}] DONE")
            except Exception as e:
                print(f"[{locale}] FAILED: {e}", file=sys.stderr)
    return 0


if __name__ == "__main__":
    sys.exit(main())
