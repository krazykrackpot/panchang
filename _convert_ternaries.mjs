import { readFileSync, writeFileSync } from 'fs';

const FILES = [
  'src/app/[locale]/learn/vargas/page.tsx',
  'src/app/[locale]/learn/kundali/page.tsx',
  'src/app/[locale]/learn/advanced/page.tsx',
  'src/app/[locale]/learn/gochar/page.tsx',
  'src/app/[locale]/learn/matching/page.tsx',
  'src/app/[locale]/vedic-time/page.tsx',
  'src/app/[locale]/upagraha/page.tsx',
  'src/app/[locale]/retrograde/page.tsx',
  'src/app/[locale]/transits/page.tsx',
  'src/app/[locale]/calendar/page.tsx',
  'src/app/[locale]/regional/page.tsx',
  'src/app/[locale]/learn/page.tsx',
  'src/app/[locale]/learn/calculations/page.tsx',
  'src/app/[locale]/learn/modules/24-1/page.tsx',
];

const BASE = '/Users/adityakumar/Desktop/venture/panchang/';

// Build the tl() call from English and Hindi values
function buildTl(enVal, hiVal) {
  // Escape single quotes in values for the object literal
  const e = enVal;
  const h = hiVal;
  return `tl({ en: ${quoteStr(e)}, hi: ${quoteStr(h)}, sa: ${quoteStr(h)}, ta: ${quoteStr(e)}, te: ${quoteStr(e)}, bn: ${quoteStr(e)}, kn: ${quoteStr(e)}, gu: ${quoteStr(e)}, mai: ${quoteStr(h)}, mr: ${quoteStr(h)} }, locale)`;
}

function quoteStr(s) {
  // If string contains single quotes but no backticks, use backticks
  // If string contains neither, use single quotes
  // If contains both, escape single quotes
  if (!s.includes("'")) return `'${s}'`;
  if (!s.includes('`') && !s.includes('$')) return `\`${s}\``;
  return `'${s.replace(/'/g, "\\'")}'`;
}

// Patterns to match:
// Pattern 1: !isDevanagariLocale(locale) ? 'English' : 'Hindi'
// Pattern 2: isDevanagariLocale(locale) ? 'Hindi' : 'English'
// Pattern 3: !isHi ? 'English' : 'Hindi'  (or !isDev)
// Pattern 4: isHi ? 'Hindi' : 'English'  (or isDev)
//
// Values can be in single quotes, double quotes, backticks, or JSX expressions

// Helper to match a quoted string value (handles single, double, backtick quotes and escaped chars)
// Returns [fullMatch, innerValue, restOfString]
function matchQuotedValue(str) {
  const trimmed = str.trimStart();
  const leadingWS = str.length - trimmed.length;

  if (trimmed.startsWith("'")) {
    // Match single-quoted string, handling escaped single quotes
    const m = trimmed.match(/^'((?:[^'\\]|\\.)*)'/);
    if (m) return { full: str.slice(0, leadingWS) + m[0], value: m[1].replace(/\\'/g, "'"), rest: trimmed.slice(m[0].length) };
  }
  if (trimmed.startsWith('"')) {
    const m = trimmed.match(/^"((?:[^"\\]|\\.)*)"/);
    if (m) return { full: str.slice(0, leadingWS) + m[0], value: m[1].replace(/\\"/g, '"'), rest: trimmed.slice(m[0].length) };
  }
  if (trimmed.startsWith('`')) {
    const m = trimmed.match(/^`((?:[^`\\]|\\.)*)`/);
    if (m) return { full: str.slice(0, leadingWS) + m[0], value: m[1], rest: trimmed.slice(m[0].length) };
  }
  return null;
}

let totalReplacements = 0;

for (const relPath of FILES) {
  const fullPath = BASE + relPath;
  let content;
  try {
    content = readFileSync(fullPath, 'utf8');
  } catch (e) {
    console.error(`SKIP: ${relPath} — file not found`);
    continue;
  }

  let replacements = 0;
  let needsTlImport = false;
  let needsRemoveIsDevanagari = false;

  // Check if tl is already imported
  const hasTlImport = /import\s+\{[^}]*\btl\b[^}]*\}\s+from\s+['"]@\/lib\/utils\/trilingual['"]/.test(content);

  // Pattern: !isDevanagariLocale(locale) ? VALUE1 : VALUE2
  // Here VALUE1 = English, VALUE2 = Hindi
  // Also handle with extra space, and the isDevanagariLocale(locale) ? variant (Hindi first)

  // Use a regex-based approach with manual value extraction
  function processContent(text) {
    let result = '';
    let i = 0;

    while (i < text.length) {
      // Try to match patterns at current position
      let matched = false;

      // Pattern A: !isDevanagariLocale(locale) ? 'en' : 'hi'
      // Pattern A2: !isDevanagariLocale(locale)\n? 'en' : 'hi'  (multiline)
      const patternA = text.slice(i).match(/^!isDevanagariLocale\(locale\)\s*\?\s*/);
      if (patternA) {
        const afterCond = text.slice(i + patternA[0].length);
        const val1 = matchQuotedValue(afterCond);
        if (val1) {
          const afterVal1 = val1.rest;
          const colonMatch = afterVal1.match(/^\s*:\s*/);
          if (colonMatch) {
            const afterColon = afterVal1.slice(colonMatch[0].length);
            const val2 = matchQuotedValue(afterColon);
            if (val2) {
              // !isDev ? en : hi  → en is English, hi is Hindi
              const tlCall = buildTl(val1.value, val2.value);
              result += tlCall;
              i += patternA[0].length + val1.full.length + colonMatch[0].length + val2.full.length;
              // Trim leading whitespace that was part of val1.full
              replacements++;
              needsTlImport = true;
              matched = true;
            }
          }
        }
      }

      if (!matched) {
        // Pattern B: isDevanagariLocale(locale) ? 'hi' : 'en'
        const patternB = text.slice(i).match(/^isDevanagariLocale\(locale\)\s*\?\s*/);
        if (patternB) {
          const afterCond = text.slice(i + patternB[0].length);
          const val1 = matchQuotedValue(afterCond);
          if (val1) {
            const afterVal1 = val1.rest;
            const colonMatch = afterVal1.match(/^\s*:\s*/);
            if (colonMatch) {
              const afterColon = afterVal1.slice(colonMatch[0].length);
              const val2 = matchQuotedValue(afterColon);
              if (val2) {
                // isDev ? hi : en → val1 is Hindi, val2 is English
                const tlCall = buildTl(val2.value, val1.value);
                result += tlCall;
                i += patternB[0].length + val1.full.length + colonMatch[0].length + val2.full.length;
                replacements++;
                needsTlImport = true;
                matched = true;
              }
            }
          }
        }
      }

      if (!matched) {
        // Pattern C: !isHi ? 'en' : 'hi'  or !isDev ? 'en' : 'hi'
        const patternC = text.slice(i).match(/^!(isHi|isDev)\s*\?\s*/);
        if (patternC) {
          const afterCond = text.slice(i + patternC[0].length);
          const val1 = matchQuotedValue(afterCond);
          if (val1) {
            const afterVal1 = val1.rest;
            const colonMatch = afterVal1.match(/^\s*:\s*/);
            if (colonMatch) {
              const afterColon = afterVal1.slice(colonMatch[0].length);
              const val2 = matchQuotedValue(afterColon);
              if (val2) {
                const tlCall = buildTl(val1.value, val2.value);
                result += tlCall;
                i += patternC[0].length + val1.full.length + colonMatch[0].length + val2.full.length;
                replacements++;
                needsTlImport = true;
                matched = true;
              }
            }
          }
        }
      }

      if (!matched) {
        // Pattern D: isHi ? 'hi' : 'en'  or isDev ? 'hi' : 'en'
        const patternD = text.slice(i).match(/^(isHi|isDev)\s*\?\s*/);
        if (patternD) {
          const afterCond = text.slice(i + patternD[0].length);
          const val1 = matchQuotedValue(afterCond);
          if (val1) {
            const afterVal1 = val1.rest;
            const colonMatch = afterVal1.match(/^\s*:\s*/);
            if (colonMatch) {
              const afterColon = afterVal1.slice(colonMatch[0].length);
              const val2 = matchQuotedValue(afterColon);
              if (val2) {
                const tlCall = buildTl(val2.value, val1.value);
                result += tlCall;
                i += patternD[0].length + val1.full.length + colonMatch[0].length + val2.full.length;
                replacements++;
                needsTlImport = true;
                matched = true;
              }
            }
          }
        }
      }

      if (!matched) {
        result += text[i];
        i++;
      }
    }

    return result;
  }

  let newContent = processContent(content);

  // Handle the special case in vargas line 498 where there's a double ternary:
  // !isDevanagariLocale(locale) ? 'English' : isDevanagariLocale(locale) ? 'Hindi1' : 'Hindi2'
  // The first pass should handle the inner one, then the outer one
  // Actually the processContent should handle this naturally since it processes left to right

  // Add tl import if needed and not present
  if (needsTlImport && !hasTlImport) {
    // Add import after 'use client' line
    newContent = newContent.replace(
      /^('use client';?\s*\n)/,
      "$1\nimport { tl } from '@/lib/utils/trilingual';\n"
    );
  }

  // Check if isDevanagariLocale is still used after replacements
  const stillUsesIsDev = /isDevanagariLocale/.test(newContent.replace(/import.*isDevanagariLocale.*\n/, ''));
  if (!stillUsesIsDev) {
    // Remove the import
    newContent = newContent.replace(/import\s*\{\s*isDevanagariLocale\s*\}\s*from\s*['"]@\/lib\/utils\/locale-fonts['"];\s*\n/, '');
  }

  // Check if isHi or isDev variable declarations are still used
  // Remove `const isHi = ...` or `const isDev = ...` if no longer referenced
  const isHiDeclMatch = newContent.match(/const\s+(isHi|isDev)\s*=\s*[^;]+;\s*\n/);
  if (isHiDeclMatch) {
    const varName = isHiDeclMatch[1];
    // Count usages excluding the declaration itself
    const declRemoved = newContent.replace(isHiDeclMatch[0], '');
    const usageRegex = new RegExp(`\\b${varName}\\b`);
    if (!usageRegex.test(declRemoved)) {
      newContent = newContent.replace(isHiDeclMatch[0], '');
    }
  }

  if (replacements > 0) {
    writeFileSync(fullPath, newContent);
    console.log(`${relPath}: ${replacements} replacements`);
    totalReplacements += replacements;
  } else {
    console.log(`${relPath}: 0 replacements (no matches found)`);
  }
}

console.log(`\nTotal: ${totalReplacements} replacements across ${FILES.length} files`);
