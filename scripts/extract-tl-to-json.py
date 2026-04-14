#!/usr/bin/env python3
"""
Extract inline tl({...}, locale) calls from .tsx/.ts files into JSON message files.
Usage: python3 scripts/extract-tl-to-json.py <source.tsx> <output.json> [--dry-run]
"""
import re, json, sys, os

def slugify(text):
    words = re.sub(r'[^a-zA-Z0-9\s]', '', text).strip().split()[:6]
    if not words: return 'unknown'
    return words[0].lower() + ''.join(w.title() for w in words[1:])

def extract_tl_objects(content):
    results = []
    pattern = r'_?tl\(\{([^}]+)\}\s*(?:as\s+LocaleText\s*)?,\s*locale\)'
    for m in re.finditer(pattern, content):
        obj_str = m.group(1)
        locale_obj = {}
        for kv in re.finditer(r"(\w+):\s*(?:'([^']*)'|\"([^\"]*)\"|`([^`]*)`)", obj_str):
            key = kv.group(1)
            val = kv.group(2) or kv.group(3) or kv.group(4) or ''
            locale_obj[key] = val
        if 'en' in locale_obj and len(locale_obj['en']) > 0:
            results.append({
                'full_match': m.group(0),
                'locales': locale_obj,
                'start': m.start(),
                'end': m.end(),
            })
    return results

def generate_keys(results):
    seen_keys = {}
    for r in results:
        en = r['locales']['en']
        base_key = slugify(en)
        if base_key in seen_keys:
            if seen_keys[base_key]['locales']['en'] == en:
                r['key'] = base_key
                continue
            i = 2
            while f"{base_key}{i}" in seen_keys: i += 1
            base_key = f"{base_key}{i}"
        seen_keys[base_key] = r
        r['key'] = base_key
    return results

def build_json(results):
    messages = {}
    seen_en = {}
    for r in results:
        en = r['locales']['en']
        if en in seen_en:
            r['key'] = seen_en[en]
            continue
        seen_en[en] = r['key']
        messages[r['key']] = r['locales']
    return messages

def rewrite_source(content, results, t_func):
    sorted_results = sorted(results, key=lambda r: r['start'], reverse=True)
    for r in sorted_results:
        content = content[:r['start']] + f"{t_func}('{r['key']}')" + content[r['end']:]
    return content

def add_imports(content, json_path, t_func):
    rel_path = json_path.replace('src/', '@/')
    has_lt = "from '@/lib/learn/translations'" in content
    has_json = rel_path in content
    
    import_lines = []
    if not has_lt:
        import_lines.append("import { lt } from '@/lib/learn/translations';")
        # Only add LocaleText if not already imported
        if 'LocaleText' not in content:
            import_lines.append("import type { LocaleText } from '@/lib/learn/translations';")
    if not has_json:
        import_lines.append(f"import MSG from '{rel_path}';")
    
    if import_lines:
        if "'use client'" in content:
            insert_after = content.index("'use client';") + len("'use client';")
            content = content[:insert_after] + '\n' + '\n'.join(import_lines) + content[insert_after:]
        else:
            # Find first import line
            first_import = content.find('import ')
            if first_import >= 0:
                content = content[:first_import] + '\n'.join(import_lines) + '\n' + content[first_import:]
            else:
                content = '\n'.join(import_lines) + '\n' + content
    
    # Add t() helper — find the component function and add after locale declaration
    if f"const {t_func} = (key: string)" not in content:
        # Find 'const locale = useLocale()' or similar
        locale_match = re.search(r'const locale = useLocale\(\)', content)
        if locale_match:
            # Find the end of the line
            line_end = content.index('\n', locale_match.end()) + 1
            t_def = f"  const {t_func} = (key: string) => lt((MSG as unknown as Record<string, LocaleText>)[key], locale);\n"
            content = content[:line_end] + t_def + content[line_end:]
    
    return content

def main():
    if len(sys.argv) < 3:
        print("Usage: python3 scripts/extract-tl-to-json.py <source.tsx> <output.json> [--dry-run]")
        sys.exit(1)
    
    source_path = sys.argv[1]
    json_path = sys.argv[2]
    dry_run = '--dry-run' in sys.argv
    
    with open(source_path) as f:
        content = f.read()
    
    results = extract_tl_objects(content)
    if not results:
        print(f"  No tl() calls found in {source_path}")
        return
    
    results = generate_keys(results)
    messages = build_json(results)
    
    # Choose t function name — avoid conflicts with existing 't'
    existing_t = bool(re.search(r'const t\s*=\s*useTranslations', content))
    t_func = 'msg' if existing_t else 't'
    
    print(f"  {source_path}: {len(results)} tl() → {len(messages)} keys (using {t_func}())")
    
    if dry_run:
        return
    
    os.makedirs(os.path.dirname(json_path), exist_ok=True)
    with open(json_path, 'w') as f:
        json.dump(messages, f, ensure_ascii=False, indent=2)
    
    new_content = rewrite_source(content, results, t_func)
    new_content = add_imports(new_content, json_path, t_func)
    
    with open(source_path, 'w') as f:
        f.write(new_content)
    
    print(f"  ✓ {json_path} ({len(messages)} keys), {source_path} rewritten")

if __name__ == '__main__':
    main()
