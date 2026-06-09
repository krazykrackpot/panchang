#!/usr/bin/env python3
"""
Re-translate the 45 expanded devotional items' meaning + significance
fields (rescue PRs #620 + #628 + karva-chauth) into the 7 regional
locales.

The pre-existing translations in devotional-{loc}-overlay.json were
generated against the OLD short EN values. After the EN body was
~3x expanded, those translations are stale and represent ~1/3 of the
current EN text. This pass re-translates only the affected keys
(meaning, significance) for the 8 items in PR #620 + 44 items in
#628 + the karva-chauth-aarti added in this PR.

Reads:  src/lib/content/devotional-content.ts (extracts the current
        EN meaning + significance per expanded slug)
Writes: src/lib/constants/devotional-{loc}-overlay.json (in-place
        update of the two affected keys per slug)
"""
import argparse
import concurrent.futures
import json
import re
import subprocess
import sys
import time
import urllib.error
import urllib.request
from datetime import date
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
SOURCE = ROOT / "src/lib/content/devotional-content.ts"
OVERLAY_DIR = ROOT / "src/lib/constants"
PROJECT = "dekhopanchang"
MODEL = "gemini-2.5-flash"
ENDPOINT = (
    f"https://us-central1-aiplatform.googleapis.com/v1/projects/"
    f"{PROJECT}/locations/us-central1/publishers/google/models/"
    f"{MODEL}:generateContent"
)

# Target slugs — 7 chalisas from #620 + 44 from #628 + 1 karva from
# this PR. Tracked here so the script doesn't redundantly hit items
# whose EN body was NOT changed (e.g. hanuman-chalisa stayed at 640w).
RESCUE_SLUGS: dict[str, str] = {
    # PR #620
    "ganesh-chalisa": "chalisa",
    "durga-chalisa": "chalisa",
    "saraswati-chalisa": "chalisa",
    "lakshmi-chalisa": "chalisa",
    "ram-chalisa": "chalisa",
    "shani-chalisa": "chalisa",
    "bajrang-baan": "chalisa",
    # PR #628 (44 non-chalisa) — auto-discovered below by parsing the
    # current devotional-content.ts vs the pre-#628 git baseline.
    # Inlined here for explicit auditability:
    "om-jai-jagdish-hare": "aarti",
    "ganesh-aarti": "aarti",
    "lakshmi-aarti": "aarti",
    "durga-aarti": "aarti",
    "santoshi-maa-aarti": "aarti",
    "ram-aarti": "aarti",
    "saraswati-aarti": "aarti",
    "surya-aarti": "aarti",
    "tulsi-aarti": "aarti",
    "hanuman-aarti": "aarti",
    "shani-dev-aarti": "aarti",
    "ganga-aarti": "aarti",
    "satyanarayan-aarti": "aarti",
    "shiv-aarti": "aarti",
    "vishnu-aarti": "aarti",
    "diwali-aarti": "aarti",
    "krishna-aarti": "aarti",
    "sai-baba-aarti": "aarti",
    "navratri-aarti": "aarti",
    "karva-chauth-aarti": "aarti",
    "lalita-sahasranama": "stotram",
    "vishnu-sahasranama": "stotram",
    "shiva-tandava-stotram": "stotram",
    "kanakadhara-stotram": "stotram",
    "mahishasura-mardini-stotram": "stotram",
    "sri-suktam": "stotram",
    "rudram-chamakam": "stotram",
    "purusha-suktam": "stotram",
    "aditya-hridayam": "stotram",
    "hanuman-bahuk": "stotram",
    "mahamrityunjaya-mantra": "mantra",
    "gayatri-mantra": "mantra",
    "surya-beej-mantra": "mantra",
    "chandra-beej-mantra": "mantra",
    "mangal-beej-mantra": "mantra",
    "budha-beej-mantra": "mantra",
    "guru-beej-mantra": "mantra",
    "shukra-beej-mantra": "mantra",
    "shani-beej-mantra": "mantra",
    "rahu-beej-mantra": "mantra",
    "ketu-beej-mantra": "mantra",
    "lakshmi-mantra": "mantra",
    "ganesh-mantra": "mantra",
    "saraswati-mantra": "mantra",
    "navgraha-mantra": "mantra",
}

LOCALES = {
    "mai": "Maithili (Devanagari script — distinct from Hindi: अछि/भेल/किनसँ. Knowledgeable devotee + scholar register, slightly literary.)",
    "mr":  "Marathi (Devanagari script. Knowledgeable Jyotish + puranic register.)",
    "ta":  "Tamil (Tamil script. Knowledgeable register. Canonical: சூரியன்/சந்திரன்/குரு/சுக்கிரன்/சனி/ராகு/கேது.)",
    "te":  "Telugu (Telugu script. Knowledgeable register. Canonical: సూర్యుడు/చంద్రుడు/గురువు/శుక్రుడు/శని/రాహువు/కేతువు.)",
    "bn":  "Bengali (Bengali script. Knowledgeable register. Canonical: সূর্য/চন্দ্র/বৃহস্পতি/শুক্র/শনি/রাহু/কেতু.)",
    "gu":  "Gujarati (Gujarati script. Knowledgeable register. Canonical: સૂર્ય/ચંદ્ર/ગુરુ/શુક્ર/શનિ/રાહુ/કેતુ.)",
    "kn":  "Kannada (Kannada script. Knowledgeable register. Canonical: ಸೂರ್ಯ/ಚಂದ್ರ/ಗುರು/ಶುಕ್ರ/ಶನಿ/ರಾಹು/ಕೇತು.)",
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


def find_arrays(text: str) -> dict[str, tuple[int, int]]:
    out = {}
    for name in ['AARTIS', 'CHALISAS', 'STOTRAMS', 'MANTRAS']:
        m = re.search(rf'const {name}: DevotionalItem\[\] = \[', text)
        if not m:
            continue
        start = m.end()
        depth = 1
        i = start
        in_btck = in_sq = in_dq = False
        while i < len(text) and depth > 0:
            ch = text[i]
            if in_btck:
                if ch == '\\': i += 2; continue
                if ch == '`': in_btck = False
                i += 1; continue
            if in_sq:
                if ch == '\\': i += 2; continue
                if ch == "'": in_sq = False
                i += 1; continue
            if in_dq:
                if ch == '\\': i += 2; continue
                if ch == '"': in_dq = False
                i += 1; continue
            if ch == '`': in_btck = True; i += 1; continue
            if ch == "'": in_sq = True; i += 1; continue
            if ch == '"': in_dq = True; i += 1; continue
            if ch == '[': depth += 1
            elif ch == ']': depth -= 1
            i += 1
        out[name] = (start, i - 1)
    return out


def scan_entries(body: str) -> list[tuple[int, int, str]]:
    out = []
    i = 0
    while i < len(body):
        while i < len(body) and body[i] in ' \t\n,':
            i += 1
        if i >= len(body) or body[i] != '{':
            break
        start = i
        depth = 1
        j = i + 1
        in_btck = in_sq = in_dq = False
        while j < len(body) and depth > 0:
            ch = body[j]
            if in_btck:
                if ch == '\\': j += 2; continue
                if ch == '`': in_btck = False
                j += 1; continue
            if in_sq:
                if ch == '\\': j += 2; continue
                if ch == "'": in_sq = False
                j += 1; continue
            if in_dq:
                if ch == '\\': j += 2; continue
                if ch == '"': in_dq = False
                j += 1; continue
            if ch == '`': in_btck = True; j += 1; continue
            if ch == "'": in_sq = True; j += 1; continue
            if ch == '"': in_dq = True; j += 1; continue
            if ch == '{': depth += 1
            elif ch == '}': depth -= 1
            j += 1
        out.append((start, j, body[start:j]))
        i = j
    return out


def extract_en_strings() -> dict[str, dict[str, str]]:
    """For each rescue slug, return the current EN meaning + significance."""
    text = SOURCE.read_text()
    arrays = find_arrays(text)
    by_slug: dict[str, dict[str, str]] = {}
    for arr_name, (s, e) in arrays.items():
        body = text[s:e]
        entries = scan_entries(body)
        for _, _, content in entries:
            slug_m = re.search(r"slug:\s*'([^']+)'", content)
            if not slug_m:
                continue
            slug = slug_m.group(1)
            if slug not in RESCUE_SLUGS:
                continue
            out: dict[str, str] = {}
            for field in ('meaning', 'significance'):
                m = re.search(rf"\b{field}:\s*", content)
                if not m:
                    continue
                i = m.end()
                if i >= len(content) or content[i] not in "`'":
                    continue
                delim = content[i]
                end_i = i + 1
                while end_i < len(content):
                    if content[end_i] == '\\':
                        end_i += 2
                        continue
                    if content[end_i] == delim:
                        break
                    end_i += 1
                if end_i < len(content):
                    raw = content[i + 1:end_i]
                    # Unescape backtick literal sequences
                    raw = raw.replace('\\`', '`').replace('\\${', '${')
                    out[field] = raw
            if out:
                by_slug[slug] = out
    return by_slug


def gemini_translate_batch(token: str, texts: list[str], locale: str, locale_desc: str) -> list[str]:
    prompt = (
        f"You are translating Hindu devotional educational text "
        f"(meaning + significance of an aarti, chalisa, mantra, or "
        f"stotram) to {locale_desc}.\n\n"
        f"Rules:\n"
        f"- Output ONLY the JSON object, no markdown fences.\n"
        f"- Knowledgeable devotee + scholar register — translate ALL "
        f"English prose to flowing target-language prose, not literal.\n"
        f"- Sanskrit / Vedic terms (Chandra, Surya, Mahishasura, "
        f"navratri, ekadashi, sahasranama, kavacham, etc.): "
        f"canonical transliteration in the target script.\n"
        f"- Preserve em-dashes, parentheticals, paragraph breaks "
        f"(`\\n\\n`).\n"
        f"- British English source — produce equally measured target.\n\n"
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
            with urllib.request.urlopen(req, timeout=240) as resp:
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
                    raise RuntimeError(f"array len mismatch")
                return [str(x) for x in parsed]
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
            print(f"  [{locale}] retry {attempt+1}: {str(e)[:120]}", file=sys.stderr)
            time.sleep(2 ** attempt)
    raise RuntimeError("unreachable")


def translate_one_locale(locale: str, by_slug: dict[str, dict[str, str]], token: str) -> int:
    overlay_path = OVERLAY_DIR / f"devotional-{locale}-overlay.json"
    overlay = json.loads(overlay_path.read_text(encoding="utf-8"))
    if "translations" not in overlay:
        overlay["translations"] = {}
    locale_desc = LOCALES[locale]

    # Build the flat (key, en_value) list for this locale.
    items: list[tuple[str, str]] = []
    for slug, fields in by_slug.items():
        for field, en_value in fields.items():
            items.append((f"{slug}.{field}", en_value))

    # One field per Gemini call. Earlier batches of 4 hit the 8192-
    # output-token cap once the expanded meaning + significance fields
    # crossed ~1500 EN chars and ballooned 1.5-2x in Devanagari /
    # Bengali / etc. (Vertex AI was returning truncated responses with
    # "Unterminated string" parse errors). One field per call keeps
    # output deterministic, costs ~4x more API calls but stays inside
    # the cap.
    BATCH = 1
    PERSIST_EVERY = 8   # save every 8 successful translations
    n_changed = 0
    since_persist = 0
    total = len(items)
    for i in range(0, total, BATCH):
        batch = items[i:i + BATCH]
        texts = [v for (_, v) in batch]
        try:
            translations = gemini_translate_batch(token, texts, locale, locale_desc)
        except Exception as e:
            print(f"  [{locale}] batch {i // BATCH + 1} FAILED: {e}", file=sys.stderr, flush=True)
            continue
        for (key, _), t in zip(batch, translations):
            if not isinstance(t, str) or not t.strip():
                continue
            overlay["translations"][key] = t.strip()
            n_changed += 1
            since_persist += 1
        if since_persist >= PERSIST_EVERY:
            # Mid-run persist so we can resume after crashes / quota hits.
            overlay.setdefault("_meta", {})
            overlay["_meta"]["locale"] = locale
            overlay["_meta"]["string_count"] = len(overlay["translations"])
            overlay["_meta"]["generated"] = str(date.today())
            overlay["_meta"]["source"] = (
                "Re-translated via scripts/translate-devo-rescue-via-gemini.py "
                "after the thin-content rescue (PRs #620 + #628 + karva expansion)."
            )
            tmp = overlay_path.with_suffix(".json.tmp")
            tmp.write_text(json.dumps(overlay, ensure_ascii=False, indent=2), encoding="utf-8")
            tmp.replace(overlay_path)
            since_persist = 0
            print(f"  [{locale}] persist: {n_changed}/{total} done", file=sys.stderr, flush=True)

    # Refresh metadata
    overlay.setdefault("_meta", {})
    overlay["_meta"]["locale"] = locale
    overlay["_meta"]["string_count"] = len(overlay["translations"])
    overlay["_meta"]["generated"] = str(date.today())
    overlay["_meta"]["source"] = (
        "Re-translated via scripts/translate-devo-rescue-via-gemini.py "
        "after the thin-content rescue (PRs #620 + #628 + karva expansion)."
    )

    tmp = overlay_path.with_suffix(".json.tmp")
    tmp.write_text(json.dumps(overlay, ensure_ascii=False, indent=2), encoding="utf-8")
    tmp.replace(overlay_path)
    return n_changed


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--locales", nargs="+", default=list(LOCALES.keys()))
    args = parser.parse_args()
    targets = [l for l in args.locales if l in LOCALES]
    if not targets:
        print(f"No valid locales. Available: {list(LOCALES)}", file=sys.stderr)
        return 1

    by_slug = extract_en_strings()
    print(f"Extracted EN body for {len(by_slug)} / {len(RESCUE_SLUGS)} rescue slugs")
    missing = sorted(set(RESCUE_SLUGS) - set(by_slug))
    if missing:
        print(f"WARN missing in source: {missing}", file=sys.stderr)
    total_keys = sum(len(fields) for fields in by_slug.values())
    print(f"Total fields to translate per locale: {total_keys}")

    token = get_access_token()
    print(f"ADC token: {token[:20]}...")
    print(f"Translating {len(targets)} locales in parallel: {targets}")

    with concurrent.futures.ThreadPoolExecutor(max_workers=len(targets)) as ex:
        futures = {ex.submit(translate_one_locale, l, by_slug, token): l for l in targets}
        for fut in concurrent.futures.as_completed(futures):
            locale = futures[fut]
            try:
                n = fut.result()
                print(f"[{locale}] DONE — {n} keys updated")
            except Exception as e:
                print(f"[{locale}] FAILED: {e}", file=sys.stderr)
    return 0


if __name__ == "__main__":
    sys.exit(main())
