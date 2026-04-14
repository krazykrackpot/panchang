#!/usr/bin/env python3
"""
Convert bilingual ternaries to tl() calls with LocaleText objects.
Pattern: !isDevanagariLocale(locale) ? 'English' : 'Hindi'
      -> tl({ en: 'English', hi: 'Hindi', sa: 'Hindi', ta: 'English', ... }, locale)

For now, sa/mai/mr get Hindi value, ta/te/bn/kn/gu get English value.
This is a structural fix to eliminate the bilingual ternary anti-pattern.
Real translations for each locale can be refined later.
"""
import re, sys, glob

def convert_ternary(match):
    """Convert a bilingual ternary to tl() call."""
    full = match.group(0)
    en_val = match.group(1) or match.group(3)
    hi_val = match.group(2) or match.group(4)
    
    if not en_val or not hi_val:
        return full
    
    # Skip if values contain JSX, template literals, or are too complex
    if '${' in en_val or '${' in hi_val or '<' in en_val or '<' in hi_val:
        return full
    if len(en_val) > 200 or len(hi_val) > 200:
        return full
    
    # Escape single quotes in values
    en_esc = en_val.replace("'", "\\'")
    hi_esc = hi_val.replace("'", "\\'")
    
    return f"tl({{ en: '{en_esc}', hi: '{hi_esc}', sa: '{hi_esc}', mai: '{hi_esc}', mr: '{hi_esc}', ta: '{en_esc}', te: '{en_esc}', bn: '{en_esc}', kn: '{en_esc}', gu: '{en_esc}' }}, locale)"

def process_file(fpath):
    with open(fpath, 'r') as f:
        content = f.read()
    original = content
    
    # Pattern 1: !isDevanagariLocale(locale) ? 'EN' : 'HI'
    pattern1 = r"!isDevanagariLocale\(locale\)\s*\?\s*'([^']+)'\s*:\s*'([^']+)'"
    content = re.sub(pattern1, convert_ternary, content)
    
    # Pattern 2: isDevanagariLocale(locale) ? 'HI' : 'EN'  (reversed order)
    # Need a different group mapping
    def convert_reversed(m):
        full = m.group(0)
        hi_val = m.group(1)
        en_val = m.group(2)
        if not en_val or not hi_val:
            return full
        if '${' in en_val or '${' in hi_val or '<' in en_val or '<' in hi_val:
            return full
        if len(en_val) > 200 or len(hi_val) > 200:
            return full
        en_esc = en_val.replace("'", "\\'")
        hi_esc = hi_val.replace("'", "\\'")
        return f"tl({{ en: '{en_esc}', hi: '{hi_esc}', sa: '{hi_esc}', mai: '{hi_esc}', mr: '{hi_esc}', ta: '{en_esc}', te: '{en_esc}', bn: '{en_esc}', kn: '{en_esc}', gu: '{en_esc}' }}, locale)"
    
    pattern2 = r"isDevanagariLocale\(locale\)\s*\?\s*'([^']+)'\s*:\s*'([^']+)'"
    content = re.sub(pattern2, convert_reversed, content)
    
    # Pattern 3: isDev ? 'HI' : 'EN' (using isDev variable)
    pattern3 = r"isDev\s*\?\s*'([^']+)'\s*:\s*'([^']+)'"
    content = re.sub(pattern3, convert_reversed, content)
    
    # Pattern 4: isHi ? 'HI' : 'EN'
    pattern4 = r"isHi\s*\?\s*'([^']+)'\s*:\s*'([^']+)'"
    content = re.sub(pattern4, convert_reversed, content)
    
    # Pattern 5: !isDev ? 'EN' : 'HI'
    pattern5 = r"!isDev\s*\?\s*'([^']+)'\s*:\s*'([^']+)'"
    content = re.sub(pattern5, convert_ternary, content)
    
    # Pattern 6: !isHi ? 'EN' : 'HI'
    pattern6 = r"!isHi\s*\?\s*'([^']+)'\s*:\s*'([^']+)'"
    content = re.sub(pattern6, convert_ternary, content)
    
    if content != original:
        # Ensure tl import exists
        if "from '@/lib/utils/trilingual'" not in content:
            # Add import after 'use client' or at top
            if "'use client'" in content:
                content = content.replace("'use client';", "'use client';\n\nimport { tl } from '@/lib/utils/trilingual';", 1)
            else:
                content = "import { tl } from '@/lib/utils/trilingual';\n" + content
        elif "tl" not in content.split("from '@/lib/utils/trilingual'")[0].split('\n')[-1]:
            # tl not in the import line — add it
            content = re.sub(
                r"import \{([^}]*)\} from '@/lib/utils/trilingual'",
                lambda m: f"import {{{m.group(1)}, tl}} from '@/lib/utils/trilingual'" if 'tl' not in m.group(1) else m.group(0),
                content
            )
        
        with open(fpath, 'w') as f:
            f.write(content)
        
        # Count conversions
        conversions = content.count("tl({ en:") - original.count("tl({ en:")
        print(f"  OK {fpath} — {conversions} ternaries converted")
        return conversions
    return 0

files = sys.argv[1:] if len(sys.argv) > 1 else sorted(
    glob.glob('src/app/**/*.tsx', recursive=True) + 
    glob.glob('src/components/**/*.tsx', recursive=True)
)
files = [f for f in files if 'node_modules' not in f and '.test.' not in f]

total = sum(process_file(f) for f in files)
print(f"\nDone: {total} ternaries converted")
