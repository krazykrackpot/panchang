#!/usr/bin/env python3
"""Translate 7 newly-authored chalisas × 4 fields to 7 regional locales."""
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
ENDPOINT = (
    f"https://us-central1-aiplatform.googleapis.com/v1/projects/"
    f"{PROJECT}/locations/us-central1/publishers/google/models/"
    f"gemini-2.5-flash:generateContent"
)

NEW_SLUGS = [
    "krishna-chalisa", "kali-chalisa", "santoshi-chalisa", "sai-baba-chalisa",
    "navagraha-chalisa", "surya-chalisa", "vishnu-chalisa",
]

LOCALES = {
    "mai": "Maithili (Devanagari script — distinct from Hindi: अछि/भेल/किनसँ. Knowledgeable register.)",
    "mr":  "Marathi (Devanagari script. Knowledgeable Jyotish + puranic register.)",
    "ta":  "Tamil (Tamil script. Knowledgeable register.)",
    "te":  "Telugu (Telugu script. Knowledgeable register.)",
    "bn":  "Bengali (Bengali script. Knowledgeable register.)",
    "gu":  "Gujarati (Gujarati script. Knowledgeable register.)",
    "kn":  "Kannada (Kannada script. Knowledgeable register.)",
}


def get_access_token() -> str:
    return subprocess.check_output(["gcloud", "auth", "print-access-token"], text=True).strip()


def find_arrays(text):
    out = {}
    for name in ('AARTIS', 'CHALISAS', 'STOTRAMS', 'MANTRAS'):
        m = re.search(rf'const {name}: DevotionalItem\[\] = \[', text)
        if not m: continue
        s = m.end(); depth = 1; i = s
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
        out[name] = (s, i - 1)
    return out


def scan_entries(body):
    out = []; i = 0
    while i < len(body):
        while i < len(body) and body[i] in ' \t\n,': i += 1
        if i >= len(body) or body[i] != '{': break
        s = i; depth = 1; j = i + 1
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
        out.append((s, j, body[s:j])); i = j
    return out


def extract_en_strings():
    text = SOURCE.read_text()
    arrays = find_arrays(text)
    by_slug = {}
    s_a, e_a = arrays['CHALISAS']
    body = text[s_a:e_a]
    entries = scan_entries(body)
    for _, _, content in entries:
        sm = re.search(r"slug:\s*'([^']+)'", content)
        if not sm: continue
        slug = sm.group(1)
        if slug not in NEW_SLUGS: continue
        out = {}
        # Title is locale text {en, hi}; only translate en→<loc> for title
        tm = re.search(r"title:\s*\{\s*en:\s*'([^']+)'", content)
        if tm: out['title'] = tm.group(1)
        for field in ('meaning', 'significance'):
            m = re.search(rf"\b{field}:\s*", content)
            if not m: continue
            i = m.end()
            if i >= len(content) or content[i] not in "`'": continue
            delim = content[i]; end_i = i + 1
            while end_i < len(content):
                if content[end_i] == '\\': end_i += 2; continue
                if content[end_i] == delim: break
                end_i += 1
            if end_i < len(content):
                raw = content[i + 1:end_i]
                raw = raw.replace('\\`', '`').replace('\\${', '${')
                out[field] = raw
        if out:
            by_slug[slug] = out
    return by_slug


def gemini_translate(token, text, locale, desc):
    prompt = (
        f"Translate this Hindu devotional chalisa text (a piece of either "
        f"title, meaning, or significance prose) to {desc}.\n\n"
        f"Rules:\n"
        f"- Output ONLY the translated string, no JSON, no quotes, no commentary.\n"
        f"- Knowledgeable devotee + scholar register.\n"
        f"- Canonical transliteration of Sanskrit / Vedic terms.\n"
        f"- Preserve em-dashes, paragraph breaks (\\n\\n).\n\n"
        f"English source:\n\n{text}"
    )
    body = {
        "contents": [{"role": "user", "parts": [{"text": prompt}]}],
        "generationConfig": {
            "responseMimeType": "text/plain",
            "temperature": 0.3,
            "maxOutputTokens": 8192,
        },
    }
    body_bytes = json.dumps(body, ensure_ascii=False).encode("utf-8")
    for attempt in range(3):
        try:
            req = urllib.request.Request(ENDPOINT, data=body_bytes, method="POST",
                headers={"Authorization": f"Bearer {token}", "Content-Type": "application/json; charset=utf-8"})
            with urllib.request.urlopen(req, timeout=180) as resp:
                raw = json.loads(resp.read().decode("utf-8"))
            return raw["candidates"][0]["content"]["parts"][0]["text"].strip()
        except urllib.error.HTTPError as e:
            if attempt == 2:
                print(f"  [{locale}] HTTP {e.code}: {e.read().decode('utf-8','replace')[:200]}", file=sys.stderr, flush=True)
                raise
            time.sleep(2 ** attempt)
        except Exception as e:
            if attempt == 2: raise
            time.sleep(2 ** attempt)
    raise RuntimeError("unreachable")


def translate_locale(locale, by_slug, token):
    overlay_path = OVERLAY_DIR / f"devotional-{locale}-overlay.json"
    overlay = json.loads(overlay_path.read_text(encoding="utf-8"))
    overlay.setdefault("translations", {})
    desc = LOCALES[locale]
    PERSIST_EVERY = 4
    n = 0; since = 0
    items = []
    for slug, fields in by_slug.items():
        for field, en_value in fields.items():
            items.append((f"{slug}.{field}", en_value))
    print(f"[{locale}] {len(items)} fields todo", flush=True)
    for key, en_text in items:
        try:
            translated = gemini_translate(token, en_text, locale, desc)
        except Exception as e:
            print(f"  [{locale}] {key} FAIL: {e}", file=sys.stderr, flush=True)
            continue
        overlay["translations"][key] = translated
        n += 1; since += 1
        if since >= PERSIST_EVERY:
            overlay.setdefault("_meta", {})
            overlay["_meta"]["locale"] = locale
            overlay["_meta"]["string_count"] = len(overlay["translations"])
            overlay["_meta"]["generated"] = str(date.today())
            tmp = overlay_path.with_suffix(".json.tmp")
            tmp.write_text(json.dumps(overlay, ensure_ascii=False, indent=2), encoding="utf-8")
            tmp.replace(overlay_path)
            since = 0
            print(f"  [{locale}] persist: {n}/{len(items)}", flush=True)
    overlay["_meta"]["string_count"] = len(overlay["translations"])
    overlay["_meta"]["generated"] = str(date.today())
    tmp = overlay_path.with_suffix(".json.tmp")
    tmp.write_text(json.dumps(overlay, ensure_ascii=False, indent=2), encoding="utf-8")
    tmp.replace(overlay_path)
    return n


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--locales", nargs="+", default=list(LOCALES))
    args = parser.parse_args()
    targets = [l for l in args.locales if l in LOCALES]

    by_slug = extract_en_strings()
    print(f"Extracted {len(by_slug)} slugs × ~3 fields each", flush=True)
    token = get_access_token()
    print(f"ADC: {token[:20]}...", flush=True)
    print(f"Translating {len(targets)} locales in parallel", flush=True)
    with concurrent.futures.ThreadPoolExecutor(max_workers=len(targets)) as ex:
        futs = {ex.submit(translate_locale, l, by_slug, token): l for l in targets}
        for fut in concurrent.futures.as_completed(futs):
            l = futs[fut]
            try:
                n = fut.result()
                print(f"[{l}] DONE — {n} keys", flush=True)
            except Exception as e:
                print(f"[{l}] FAILED: {e}", file=sys.stderr, flush=True)


if __name__ == "__main__":
    main()
