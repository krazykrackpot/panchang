#!/usr/bin/env node
/**
 * Add missing locale blocks (mai/mr/ta/te/bn/gu/kn) to inline `LABELS`
 * objects in TSX page components. Background: 38 page components use the
 * pattern
 *
 *   const LABELS: Record<string, Record<string, string>> = {
 *     en: { ... },
 *     hi: { ... },
 *     // sometimes sa: { ... },
 *   };
 *
 * and then read `LABELS[locale] || LABELS.en` at render time. Locales not
 * in the LABELS object silently fall through to `LABELS.en` — so every
 * page using this pattern renders English chrome on /mai/, /mr/, /ta/,
 * /te/, /bn/, /gu/, /kn/. This drives part of the /mai/-vs-/hi/
 * duplicate-content signal that triggered the May 31 demotion (English
 * chrome + Hindi data = neither-fish-nor-fowl page).
 *
 * Strategy: AST-edit each file with ts-morph. For each LABELS object:
 *   1. Find the en property (always present in every LABELS instance).
 *   2. Extract its inner key/value pairs.
 *   3. For each locale not already present, ask Gemini to translate the
 *      en object into that locale. Inject as a new PropertyAssignment.
 *
 * Why ts-morph instead of regex: LABELS objects contain strings with
 * embedded apostrophes ('Tonight\'s ...'), em-dashes, JSON-encoded
 * payloads ('Amrit|Most auspicious  – ...'), and split across multiple
 * lines. AST handling is the only reliable approach.
 *
 * Usage:
 *   node scripts/translate-tsx-labels.mjs <file1> <file2> ...
 *   node scripts/translate-tsx-labels.mjs --all      # auto-discover
 *   node scripts/translate-tsx-labels.mjs --dry-run  # show plan only
 */

import { Project, SyntaxKind } from 'ts-morph';
import { execSync, spawnSync } from 'node:child_process';
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';

const TARGETS = ['mai', 'mr', 'ta', 'te', 'bn', 'gu', 'kn'];
const PROJECT = 'dekhopanchang';
const MODEL = 'gemini-2.5-flash';
const ENDPOINT =
  `https://us-central1-aiplatform.googleapis.com/v1/projects/${PROJECT}` +
  `/locations/us-central1/publishers/google/models/${MODEL}:generateContent`;

const LOCALE_DESCS = {
  mai: 'Maithili (Devanagari, natural Maithili register — use -क genitive, -ओ conjunction, के लेल for "for", छी/अछि forms, अहांक for "your", आ for "and", की for "what". Retain canonical Sanskrit Jyotish terms like तिथि, राशि, ग्रह, नक्षत्र, मुहूर्त. Must be DISTINCT from Hindi where the languages diverge — output is compared character-by-character against Hindi and matches trigger duplicate-content scoring.)',
  mr: 'Marathi (Devanagari, natural Marathi register: -चा/ची/चे genitive, आणि for "and", आहे for "is", तुमचा for "your", काय for "what", retain Sanskrit Jyotish terms)',
  ta: 'Tamil (Tamil script, natural Tamil register, canonical Tamil Jyotish vocabulary: லக்னம் / ராசி / கிரகம் / பாவம் / நட்சத்திரம்)',
  te: 'Telugu (Telugu script, natural Telugu register, canonical Telugu Jyotish vocabulary: లగ్నం / రాశి / గ్రహం / భావం / నక్షత్రం)',
  bn: 'Bengali (Bengali script, natural Bengali register, canonical Bengali Jyotish vocabulary: লগ্ন / রাশি / গ্রহ / ভাব / নক্ষত্র)',
  gu: 'Gujarati (Gujarati script, natural Gujarati register, canonical Gujarati Jyotish vocabulary: લગ્ન / રાશિ / ગ્રહ / ભાવ / નક્ષત્ર)',
  kn: 'Kannada (Kannada script, natural Kannada register, canonical Kannada Jyotish vocabulary: ಲಗ್ನ / ರಾಶಿ / ಗ್ರಹ / ಭಾವ / ನಕ್ಷತ್ರ)',
};

const PATTERN = /Record<string,\s*Record<string,\s*string>>/;

function walkTsx(dir, out = []) {
  for (const e of readdirSync(dir)) {
    const f = join(dir, e);
    if (statSync(f).isDirectory()) walkTsx(f, out);
    else if (e.endsWith('.tsx')) out.push(f);
  }
  return out;
}

function discoverFiles() {
  const candidates = walkTsx('src/app/[locale]');
  const need = [];
  for (const f of candidates) {
    const src = readFileSync(f, 'utf-8');
    if (!PATTERN.test(src)) continue;
    const missing = TARGETS.filter(l => !new RegExp(`\\b${l}:\\s*\\{`).test(src));
    if (missing.length > 0) need.push({ file: f, missing });
  }
  return need;
}

function getAccessToken() {
  return execSync('gcloud auth print-access-token', { encoding: 'utf-8' }).trim();
}

async function geminiTranslateOne(token, enObject, locale) {
  // Translate to a SINGLE locale. Original `geminiTranslateMulti` packed
  // all 7 target locales into one prompt — for large LABELS objects
  // (e.g. /dates/[category]/Client.tsx with 77 keys × 7 locales = 539
  // strings) Gemini consistently timed out at 180s. One-locale-per-call
  // produces ~77 strings/call which Gemini handles in 30-60s reliably.
  const prompt =
    `Translate the following English UI strings to ${LOCALE_DESCS[locale]}.\n\n` +
    `Rules:\n` +
    `- Output ONLY a JSON object with the SAME keys as the input.\n` +
    `- Preserve interpolation placeholders like {name}, {date}, {count}.\n` +
    `- Preserve em-dash spacing \` – \` and string-encoded list separators (e.g. ` +
    `'Amrit|Most auspicious|Shubh|...' — keep the \`|\` delimiter exactly).\n` +
    `- Mantras (\`Om ... Namah\`) stay in Sanskrit transliterated to the target script.\n` +
    `- Apostrophes inside English (e.g. "Tonight's") should be handled idiomatically in the target.\n` +
    `- Single-word labels (directions, day names, etc.) get the canonical single word in the target script.\n\n` +
    `Input (en object):\n${JSON.stringify(enObject, null, 2)}`;

  const body = {
    contents: [{ role: 'user', parts: [{ text: prompt }] }],
    generationConfig: {
      responseMimeType: 'application/json',
      temperature: 0.3,
      maxOutputTokens: 65536,
    },
  };

  let last_err = null;
  for (let attempt = 0; attempt < 3; attempt++) {
    const res = spawnSync('curl', [
      '-s', '-f',
      '--max-time', '180',
      '-X', 'POST',
      '-H', `Authorization: Bearer ${token}`,
      '-H', 'Content-Type: application/json',
      ENDPOINT,
      '-d', JSON.stringify(body),
    ], { encoding: 'utf-8', maxBuffer: 50 * 1024 * 1024 });
    if (res.status === 0) {
      const raw = JSON.parse(res.stdout);
      if (!raw.candidates) throw new Error(`Gemini error: ${JSON.stringify(raw).slice(0, 400)}`);
      const text = raw.candidates[0].content.parts[0].text;
      try {
        return JSON.parse(text);
      } catch {
        const stripped = text.replace(/^```(?:json)?\n?|\n?```$/gm, '').trim();
        return JSON.parse(stripped);
      }
    }
    last_err = new Error(`curl exit ${res.status}: ${res.stderr?.slice(0, 200)}`);
    const wait = 1000 * 2 ** attempt;
    console.error(`  curl failed (exit ${res.status}) for ${locale}, retry ${attempt + 1}/3 in ${wait/1000}s`);
    await new Promise(r => setTimeout(r, wait));
  }
  throw last_err;
}

async function geminiTranslateMulti(token, enObject, missingLocales) {
  // Fan out one Gemini call per locale instead of packing all into one
  // prompt. Each per-locale call is small enough to fit in Gemini's
  // 180s budget even for 70+ key LABELS objects.
  const out = {};
  for (const locale of missingLocales) {
    process.stderr.write(`    → ${locale}...`);
    const t0 = Date.now();
    out[locale] = await geminiTranslateOne(token, enObject, locale);
    process.stderr.write(` ${((Date.now() - t0) / 1000).toFixed(1)}s\n`);
  }
  return out;
}

/**
 * For a LABELS ObjectLiteralExpression, return the en property's
 * { key: stringValue } object, throwing if shapes don't match.
 */
function extractEnObject(labelsObj) {
  const enProp = labelsObj.getProperty('en');
  if (!enProp || enProp.getKind() !== SyntaxKind.PropertyAssignment) {
    throw new Error(`LABELS.en not a PropertyAssignment`);
  }
  const enInit = enProp.getInitializer();
  if (enInit.getKind() !== SyntaxKind.ObjectLiteralExpression) {
    throw new Error(`LABELS.en value is not an object literal`);
  }
  const out = {};
  for (const prop of enInit.getProperties()) {
    if (prop.getKind() !== SyntaxKind.PropertyAssignment) continue;
    const name = prop.getName();
    const init = prop.getInitializer();
    const kind = init.getKind();
    let value = null;
    if (kind === SyntaxKind.StringLiteral) {
      value = init.getLiteralText();
    } else if (kind === SyntaxKind.NoSubstitutionTemplateLiteral) {
      value = init.getLiteralText();
    } else {
      // Skip non-string values (template expressions with interpolation,
      // computed keys, etc). Rare in this codebase but defensible.
      console.error(`  warn: skipping non-string ${name} (${SyntaxKind[kind]})`);
      continue;
    }
    out[name] = value;
  }
  return out;
}

/**
 * Build a TSX-source ObjectLiteral text from a { key: stringValue } map.
 * Indentation: 4-space (2 levels deep inside LABELS).
 */
function buildLocaleBlock(localeName, translations, indent = '  ') {
  const inner = Object.entries(translations).map(([k, v]) => {
    // Escape: backslash, single-quote, control chars
    const esc = String(v)
      .replace(/\\/g, '\\\\')
      .replace(/'/g, "\\'")
      .replace(/\n/g, '\\n')
      .replace(/\r/g, '\\r');
    return `${indent}  ${k}: '${esc}',`;
  }).join('\n');
  return `${indent}${localeName}: {\n${inner}\n${indent}},`;
}

/**
 * Insert new locale properties into a LABELS ObjectLiteralExpression.
 * Adds them at the end (after the last existing property).
 */
function injectLocaleBlocks(labelsObj, translationsByLocale) {
  // Use addPropertyAssignments which ts-morph will indent correctly.
  for (const [locale, translations] of Object.entries(translationsByLocale)) {
    labelsObj.addPropertyAssignment({
      name: locale,
      initializer: writer => {
        writer.write('{').newLine();
        for (const [k, v] of Object.entries(translations)) {
          const esc = String(v)
            .replace(/\\/g, '\\\\')
            .replace(/'/g, "\\'")
            .replace(/\n/g, '\\n')
            .replace(/\r/g, '\\r');
          writer.write(`  ${k}: '${esc}',`).newLine();
        }
        writer.write('}');
      },
    });
  }
}

function findLabelsObjects(sourceFile) {
  // Walk the file looking for `const <name>: Record<string, Record<string, string>>
  // = { ... }` patterns. Returns the ObjectLiteralExpression nodes.
  const found = [];
  sourceFile.forEachDescendant(node => {
    if (node.getKind() !== SyntaxKind.VariableDeclaration) return;
    const typeNode = node.getTypeNode();
    if (!typeNode) return;
    if (!PATTERN.test(typeNode.getText())) return;
    const init = node.getInitializer();
    if (init?.getKind() === SyntaxKind.ObjectLiteralExpression) {
      found.push({ name: node.getName(), obj: init });
    }
  });
  return found;
}

async function processFile(token, filePath, dryRun) {
  const project = new Project({
    tsConfigFilePath: 'tsconfig.json',
    skipAddingFilesFromTsConfig: true,
  });
  const sourceFile = project.addSourceFileAtPath(filePath);
  const labelsBlocks = findLabelsObjects(sourceFile);
  if (labelsBlocks.length === 0) {
    console.log(`  ${filePath}: no LABELS pattern found — skipping`);
    return;
  }
  for (const { name, obj } of labelsBlocks) {
    const existingLocales = obj.getProperties()
      .filter(p => p.getKind() === SyntaxKind.PropertyAssignment)
      .map(p => p.getName());
    const missing = TARGETS.filter(l => !existingLocales.includes(l));
    if (missing.length === 0) {
      console.log(`  ${filePath} [${name}]: all 7 locales present — skipping`);
      continue;
    }
    let enObject;
    try {
      enObject = extractEnObject(obj);
    } catch (err) {
      console.error(`  ${filePath} [${name}]: ${err.message} — skipping`);
      continue;
    }
    console.log(`  ${filePath} [${name}]: ${Object.keys(enObject).length} keys × ${missing.length} locales`);
    if (dryRun) continue;
    const translations = await geminiTranslateMulti(token, enObject, missing);
    // Validate we got something for each missing locale
    for (const loc of missing) {
      if (!translations[loc]) throw new Error(`Gemini returned no block for ${loc}`);
      const keys = Object.keys(translations[loc]);
      const missing_keys = Object.keys(enObject).filter(k => !(k in translations[loc]));
      if (missing_keys.length > 0) {
        throw new Error(`Gemini ${loc} missing keys: ${missing_keys.slice(0, 3).join(',')}...`);
      }
    }
    injectLocaleBlocks(obj, translations);
  }
  if (!dryRun) {
    sourceFile.saveSync();
    // ts-morph's writer inserts new properties without matching the
    // surrounding indentation. Prettier normalises this in one pass —
    // cheap (~50ms per file) and the output diff is much more reviewable.
    const r = spawnSync('node_modules/.bin/prettier', ['--write', filePath], {
      encoding: 'utf-8',
    });
    if (r.status !== 0) console.error(`  prettier failed: ${r.stderr?.slice(0, 200)}`);
  }
  console.log(`    saved ${filePath}`);
}

async function main() {
  const args = process.argv.slice(2);
  const dryRun = args.includes('--dry-run');
  const wantAll = args.includes('--all');
  let files;
  if (wantAll) {
    files = discoverFiles().map(x => x.file);
    console.log(`Discovered ${files.length} files needing locale blocks.`);
  } else {
    files = args.filter(a => !a.startsWith('--'));
  }
  if (files.length === 0) {
    console.error('Usage: node scripts/translate-tsx-labels.mjs [--all | --dry-run] <file>...');
    process.exit(1);
  }
  const token = dryRun ? '' : getAccessToken();
  const failures = [];
  for (const f of files) {
    try {
      await processFile(token, f, dryRun);
    } catch (err) {
      console.error(`  ERROR ${f}: ${err.message}`);
      failures.push(f);
      // Continue with the next file. Persistent Gemini outages on one
      // file (e.g. /dates/[category] has 100+ long quiz leaves that
      // sometimes time out) shouldn't block the other 37.
    }
  }
  if (failures.length > 0) {
    console.error(`\n${failures.length} files failed — re-run after API recovers:`);
    for (const f of failures) console.error(`  ${f}`);
    process.exit(2);
  }
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
