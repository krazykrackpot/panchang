// Expand {en, hi} inline label objects to all 10 locales.
// Devanagari locales (sa, mai, mr) copy from hi.
// Other locales (ta, te, bn, kn, gu) copy from en.
// Usage: node scripts/expand-locales.mjs file1 [file2] ...

import { readFileSync, writeFileSync } from 'fs';

const files = process.argv.slice(2);
if (!files.length) {
  console.error('Usage: node scripts/expand-locales.mjs file1 [file2] ...');
  process.exit(1);
}

// Match single-line { en: '...', hi: '...' } objects without sa:
const INLINE_PATTERN = /\{(\s*)en:\s*('[^']*'|"[^"]*"|`[^`]*`)\s*,\s*hi:\s*('[^']*'|"[^"]*"|`[^`]*`)\s*\}/g;

let totalFiles = 0;
let totalExpanded = 0;

for (const filepath of files) {
  let content = readFileSync(filepath, 'utf-8');
  let fileExpanded = 0;

  // Skip if file already has sa: keys throughout (already expanded)
  const enCount = (content.match(/\ben:\s*['"]/g) || []).length;
  const saCount = (content.match(/\bsa:\s*['"]/g) || []).length;
  if (saCount > enCount * 0.8) {
    console.log('  SKIP ' + filepath + ' (already has sa: keys)');
    continue;
  }

  // Expand single-line { en: '...', hi: '...' } patterns
  content = content.replace(INLINE_PATTERN, (match, space, enVal, hiVal) => {
    if (match.includes('sa:')) return match;
    if (match.includes('string')) return match;
    fileExpanded++;
    return '{' + space + 'en: ' + enVal + ', hi: ' + hiVal + ', sa: ' + hiVal + ', mai: ' + hiVal + ', mr: ' + hiVal + ', ta: ' + enVal + ', te: ' + enVal + ', bn: ' + enVal + ', kn: ' + enVal + ', gu: ' + enVal + ' }';
  });

  if (fileExpanded > 0) {
    writeFileSync(filepath, content, 'utf-8');
    console.log('  OK ' + filepath + ' — ' + fileExpanded + ' objects expanded');
    totalFiles++;
    totalExpanded += fileExpanded;
  } else {
    console.log('  - ' + filepath + ' — no changes needed');
  }
}

console.log('\nDone: ' + totalExpanded + ' objects expanded across ' + totalFiles + ' files.');
