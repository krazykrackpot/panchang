#!/usr/bin/env python3
"""
Scaffold a 9-locale data table the same way PRs #574 / #576 / #578 did:
- A typed module under `src/lib/<domain>/<slug>.ts` with EN+HI authored
  inline and the remaining 7 locales merged from a Gemini overlay.
- An empty overlay JSON stub at `src/lib/constants/<slug>-overlay.json`.
- A per-slug Gemini translation script at
  `scripts/translate-<slug>-via-gemini.py`.

Usage:
    python3 scripts/scaffold-locale-table.py <slug> --domain <subdir> \\
        [--key-type number|string] [--axes axis1,axis2,...] \\
        [--description "one-line summary"]

Examples:
    # Single LocaleText per row, string keys (e.g. NAMED_WINDOW_LABELS):
    python3 scripts/scaffold-locale-table.py named-window-labels --domain panchang

    # Per-row sub-axes, number keys (e.g. PLANET_THEMES):
    python3 scripts/scaffold-locale-table.py planet-themes --domain kundali \\
        --key-type number --axes strong,weak

After scaffolding:
  1. Fill in AUTHORED_EN + AUTHORED_HI in the generated .ts file.
  2. Run `python3 scripts/translate-<slug>-via-gemini.py` (needs gcloud
     ADC) to populate the overlay JSON for mai/mr/ta/te/kn/gu/bn.
  3. Wire consumers to read via `tlScript(<NAME>[key].axis, locale)`
     from `@/lib/utils/trilingual`.
"""
import argparse
import re
import subprocess
import sys
from pathlib import Path


def kebab_to_pascal(s: str) -> str:
    return ''.join(p.capitalize() for p in s.split('-'))


def kebab_to_screaming(s: str) -> str:
    return s.replace('-', '_').upper()


def emit_ts_module(slug: str, domain: str, key_type: str, axes: list[str], description: str) -> str:
    name_const = kebab_to_screaming(slug)
    if axes:
        axis_union = ' | '.join(f"'{a}'" for a in axes)
        axis_type = "type Axis = " + axis_union + ";"
        # Sample placeholder for AUTHORED_EN/HI
        per_row = '{ ' + ', '.join(f"{a}: 'TODO: en'" for a in axes) + ' }'
        per_row_hi = '{ ' + ', '.join(f"{a}: 'TODO: hi'" for a in axes) + ' }'
        sample_key_en = "/* example */ 1: " + per_row + ","
        sample_key_hi = "/* example */ 1: " + per_row_hi + ","
        record_inner = "Record<Axis, string>"
        record_inner_lt = "Record<Axis, LocaleText>"
        # build helper
        build_fn = f"""function build(rowKey: {key_type}, axis: Axis): LocaleText {{
  const en = AUTHORED_EN[rowKey][axis];
  const hi = AUTHORED_HI[rowKey][axis];
  const overlayKey = `${{rowKey}}_${{axis}}`;
  const out: LocaleText = {{ en, hi }};
  for (const locale of ['mai', 'mr', 'ta', 'te', 'kn', 'gu', 'bn'] as const) {{
    const v = overlay[locale]?.[overlayKey];
    if (v) out[locale] = v;
  }}
  return out;
}}"""
        build_call = "(() => {\n  const result: Record<" + key_type + ", " + record_inner_lt + "> = {} as Record<" + key_type + ", " + record_inner_lt + ">;\n  for (const id of Object.keys(AUTHORED_EN)) {\n    const k = " + ("Number(id)" if key_type == "number" else "id") + ";\n    result[k] = { " + ', '.join(f"{a}: build(k, '{a}')" for a in axes) + " };\n  }\n  return result;\n})()"
        export_type = f"Record<{key_type}, {record_inner_lt}>"
    else:
        axis_type = ""
        per_row = "'TODO: en'"
        per_row_hi = "'TODO: hi'"
        sample_key_en = "/* example */ 1: " + per_row + ","
        sample_key_hi = "/* example */ 1: " + per_row_hi + ","
        record_inner = "string"
        record_inner_lt = "LocaleText"
        build_fn = f"""function build(rowKey: {key_type}): LocaleText {{
  const en = AUTHORED_EN[rowKey];
  const hi = AUTHORED_HI[rowKey];
  const overlayKey = `${{rowKey}}`;
  const out: LocaleText = {{ en, hi }};
  for (const locale of ['mai', 'mr', 'ta', 'te', 'kn', 'gu', 'bn'] as const) {{
    const v = overlay[locale]?.[overlayKey];
    if (v) out[locale] = v;
  }}
  return out;
}}"""
        build_call = "(() => {\n  const result: Record<" + key_type + ", " + record_inner_lt + "> = {} as Record<" + key_type + ", " + record_inner_lt + ">;\n  for (const id of Object.keys(AUTHORED_EN)) {\n    const k = " + ("Number(id)" if key_type == "number" else "id") + ";\n    result[k] = build(k);\n  }\n  return result;\n})()"
        export_type = f"Record<{key_type}, {record_inner_lt}>"

    doc = description or f"9-locale data table — {slug}."
    return f"""/**
 * {doc}
 *
 * EN and HI are authored inline below. The remaining 7 visible locales
 * (mai/mr/ta/te/kn/gu/bn) come from a Gemini-translated overlay JSON.
 * Consumers should read via `tlScript()` from `@/lib/utils/trilingual`
 * so Devanagari script-family fallback (hi → mai/mr) works correctly.
 *
 * To refresh translations: `python3 scripts/translate-{slug}-via-gemini.py`.
 */
import type {{ LocaleText }} from '@/types/panchang';
import OVERLAY_RAW from '@/lib/constants/{slug}-overlay.json';

{axis_type}
type OverlayShape = Partial<Record<string, Record<string, string>>>;
const overlay = OVERLAY_RAW as OverlayShape;

const AUTHORED_EN: Record<{key_type}, {record_inner}> = {{
  {sample_key_en}
}};

const AUTHORED_HI: Record<{key_type}, {record_inner}> = {{
  {sample_key_hi}
}};

{build_fn}

export const {name_const}: {export_type} = {build_call};
"""


def emit_gemini_script(slug: str, axes: list[str]) -> str:
    name_const = kebab_to_screaming(slug)
    overlay_path = f"src/lib/constants/{slug}-overlay.json"
    extra_axis_note = (
        f"# Overlay keys use `${{rowKey}}_${{axis}}` (axes: {', '.join(axes)})."
        if axes else "# Overlay keys are just `${rowKey}` (no per-row axes)."
    )
    return f'''#!/usr/bin/env python3
"""
Translate `{name_const}` (src/lib/<domain>/{slug}.ts) — authored EN+HI
inline — into mai/mr/ta/te/kn/gu/bn via Gemini 2.5 Flash on Vertex AI.

{extra_axis_note}

Idempotent: re-running skips locales/keys already present in the overlay
so partial runs resume cleanly.
"""
import json
import re
import subprocess
import sys
import time
from pathlib import Path

PROJECT = "dekhopanchang"
MODEL = "gemini-2.5-flash"
ENDPOINT = (
    f"https://us-central1-aiplatform.googleapis.com/v1/projects/"
    f"{{PROJECT}}/locations/us-central1/publishers/google/models/"
    f"{{MODEL}}:generateContent"
)
OVERLAY_PATH = Path("{overlay_path}")
MODULE_PATH = Path("src/lib").rglob("{slug}.ts").__next__()

LOCALE_DESC = {{
    "mai": "Maithili (Devanagari, distinct from Hindi: अछि/मे/सँ — never use Hindi)",
    "mr":  "Marathi (Devanagari, distinct from Hindi: आहे/मध्ये/चे — never use Hindi)",
    "ta":  "Tamil (Tamil script, canonical Vedic vocabulary)",
    "te":  "Telugu (Telugu script, canonical Vedic vocabulary)",
    "kn":  "Kannada (Kannada script, canonical Vedic vocabulary)",
    "gu":  "Gujarati (Gujarati script, canonical Vedic vocabulary)",
    "bn":  "Bengali (Bengali script, canonical Vedic vocabulary)",
}}

CONTEXT = (
    "Short Vedic-astrology UI copy. "
    "EDIT THIS CONTEXT LINE to describe what your specific table is."
)


def get_access_token() -> str:
    return subprocess.check_output(
        ["gcloud", "auth", "print-access-token"], text=True
    ).strip()


def extract_authored_keys() -> dict:
    """Parse AUTHORED_EN from the generated .ts module to build the
    translation source. Supports both single-LocaleText and per-axis
    forms by walking the literal."""
    src = MODULE_PATH.read_text()
    m = re.search(r"const AUTHORED_EN[^=]*=\\s*\\{{(.*?)\\n\\}};", src, re.DOTALL)
    if not m:
        raise SystemExit(f"Could not find AUTHORED_EN in {{MODULE_PATH}}")
    body = m.group(1)

    out = {{}}
    # Per-axis: `  1: {{ strong: '...', weak: '...' }},`
    for pm in re.finditer(
        r"^\\s*(\\d+|'[^']+'):\\s*\\{{(.*?)\\}},?\\s*$",
        body,
        re.MULTILINE,
    ):
        raw_key, inner = pm.group(1), pm.group(2)
        key = raw_key.strip("'")
        for am in re.finditer(r"(\\w+):\\s*'((?:[^'\\\\]|\\\\.)*)'", inner):
            axis, val = am.group(1), am.group(2).replace("\\\\'", "'")
            out[f"{{key}}_{{axis}}"] = val
    # Single-LocaleText: `  1: '...',`
    for pm in re.finditer(
        r"^\\s*(\\d+|'[^']+'):\\s*'((?:[^'\\\\]|\\\\.)*)',?\\s*$",
        body,
        re.MULTILINE,
    ):
        raw_key, val = pm.group(1), pm.group(2)
        key = raw_key.strip("'")
        out[key] = val.replace("\\\\'", "'")
    return out


def gemini_translate(token: str, locale: str, source: dict, ctx: str) -> dict:
    locale_desc = LOCALE_DESC[locale]
    prompt = (
        f"Translate the following English Vedic-astrology UI copy to {{locale_desc}}.\\n\\n"
        f"Context: {{ctx}}\\n\\n"
        "Rules:\\n"
        "- Output ONLY a JSON object, no markdown fences, no commentary.\\n"
        "- Keys must be identical to the input.\\n"
        "- Sanskrit Jyotish proper nouns → locale-canonical form in target script.\\n"
        "- Maithili (mai) MUST use distinct Maithili grammar — never pure Hindi.\\n"
        "- Marathi (mr) MUST use distinct Marathi grammar — never pure Hindi.\\n"
        "- Preserve any literal `{{TOKEN}}` placeholders verbatim.\\n\\n"
        "Input:\\n"
        + json.dumps(source, ensure_ascii=False, indent=2)
    )
    body = {{
        "contents": [{{"role": "user", "parts": [{{"text": prompt}}]}}],
        "generationConfig": {{
            "responseMimeType": "application/json",
            "temperature": 0.3,
            "maxOutputTokens": 32768,
        }},
    }}
    proc = subprocess.run(
        [
            "curl", "-s", "-f", "-X", "POST",
            "--retry", "3", "--retry-all-errors", "--retry-delay", "5",
            "--max-time", "600",
            "-H", f"Authorization: Bearer {{token}}",
            "-H", "Content-Type: application/json",
            ENDPOINT,
            "-d", json.dumps(body, ensure_ascii=False),
        ],
        capture_output=True, text=True, check=True,
    )
    raw = json.loads(proc.stdout)
    if "candidates" not in raw:
        print(f"Gemini error ({{locale}}):", json.dumps(raw)[:500], file=sys.stderr)
        raise RuntimeError(f"Gemini call failed for {{locale}}")
    text = raw["candidates"][0]["content"]["parts"][0]["text"]
    try:
        return json.loads(text)
    except json.JSONDecodeError:
        text = re.sub(r"^```(?:json)?\\n?|\\n?```$", "", text.strip(), flags=re.MULTILINE)
        return json.loads(text)


def main() -> None:
    token = get_access_token()
    source = extract_authored_keys()
    if not source:
        raise SystemExit(
            "AUTHORED_EN parsed empty — fill in the inline EN keys first."
        )
    out = json.loads(OVERLAY_PATH.read_text()) if OVERLAY_PATH.exists() else {{}}
    for locale in LOCALE_DESC:
        existing = out.get(locale, {{}})
        todo = {{k: v for k, v in source.items() if k not in existing}}
        if not todo:
            print(f"  skip {{locale}}: complete")
            continue
        print(f"Translating {{locale}} — {{len(todo)}} keys...", flush=True)
        t0 = time.time()
        translated = gemini_translate(token, locale, todo, CONTEXT)
        elapsed = time.time() - t0
        out.setdefault(locale, {{}}).update(translated)
        print(f"  done ({{elapsed:.1f}}s)", flush=True)
        OVERLAY_PATH.write_text(json.dumps(out, ensure_ascii=False, indent=2) + "\\n")


if __name__ == "__main__":
    main()
'''


def main() -> None:
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("slug", help="kebab-case name, e.g. 'planet-themes'")
    ap.add_argument("--domain", default="constants", help="Subdir under src/lib (kundali, panchang, muhurta, …)")
    ap.add_argument("--key-type", choices=("number", "string"), default="string")
    ap.add_argument("--axes", default="", help="Comma-separated per-row axes, e.g. 'strong,weak'. Omit for single LocaleText per row.")
    ap.add_argument("--description", default="", help="One-line module description")
    args = ap.parse_args()

    if not re.fullmatch(r"[a-z0-9]+(?:-[a-z0-9]+)*", args.slug):
        ap.error(f"slug must be kebab-case (lowercase + hyphens), got: {args.slug!r}")
    axes = [a.strip() for a in args.axes.split(",") if a.strip()]
    for a in axes:
        if not re.fullmatch(r"[a-zA-Z][a-zA-Z0-9_]*", a):
            ap.error(f"axis name not a valid TS identifier: {a!r}")

    repo_root = Path(__file__).resolve().parent.parent
    ts_path = repo_root / "src" / "lib" / args.domain / f"{args.slug}.ts"
    overlay_path = repo_root / "src" / "lib" / "constants" / f"{args.slug}-overlay.json"
    script_path = repo_root / "scripts" / f"translate-{args.slug}-via-gemini.py"

    for p in (ts_path, overlay_path, script_path):
        if p.exists():
            print(f"REFUSE: {p.relative_to(repo_root)} already exists. Aborting (no overwrite).", file=sys.stderr)
            sys.exit(2)

    ts_path.parent.mkdir(parents=True, exist_ok=True)
    overlay_path.parent.mkdir(parents=True, exist_ok=True)

    ts_path.write_text(emit_ts_module(args.slug, args.domain, args.key_type, axes, args.description))
    overlay_path.write_text("{}\n")
    script_path.write_text(emit_gemini_script(args.slug, axes))
    subprocess.run(["chmod", "+x", str(script_path)], check=False)

    rel = lambda p: p.relative_to(repo_root)
    print(f"✓ Created {rel(ts_path)}")
    print(f"✓ Created {rel(overlay_path)} (empty stub)")
    print(f"✓ Created {rel(script_path)} (chmod +x)")
    print()
    print("Next steps:")
    print(f"  1. Edit {rel(ts_path)} — fill in AUTHORED_EN and AUTHORED_HI.")
    print(f"  2. Edit {rel(script_path)} CONTEXT line to describe the table.")
    print(f"  3. Run: python3 {rel(script_path)}")
    print(f"  4. Import and consume via tlScript(MAP[key]{'.axis' if axes else ''}, locale).")


if __name__ == "__main__":
    main()
