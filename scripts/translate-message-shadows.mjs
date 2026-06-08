#!/usr/bin/env node
/**
 * translate-message-shadows.mjs
 *
 * For each src/messages/**\/*.json passed on the command line, find
 * translation-block entries (`{ en, hi, ta, te, bn, gu, kn, mai, mr }`)
 * where the 7 non-en/hi locales hold the byte-identical English value,
 * translate them via Gemini per-locale fan-out, and patch the file in
 * place.
 *
 * Why: parity check `scripts/check-locale-parity.py` lists many shadow
 * strings; this script fills them. Same Gemini contract as
 * `scripts/translate-tsx-labels.mjs` but for our message-JSON shape.
 *
 *   node scripts/translate-message-shadows.mjs \
 *     src/messages/components/today-panchang.json \
 *     src/messages/pages/kundali-detail.json
 */

import { execSync, spawnSync } from 'node:child_process';
import { readFileSync, writeFileSync } from 'node:fs';

const TARGETS = ['ta', 'te', 'bn', 'gu', 'kn', 'mai', 'mr'];
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

function getAccessToken() {
  return execSync('gcloud auth print-access-token', { encoding: 'utf-8' }).trim();
}

async function geminiTranslateOne(token, enObject, locale) {
  const prompt =
    `Translate the following English UI strings to ${LOCALE_DESCS[locale]}.\n\n` +
    `Rules:\n` +
    `- Output ONLY a JSON object with the SAME keys as the input.\n` +
    `- Preserve interpolation placeholders like {name}, {date}, {count}, {city}, etc.\n` +
    `- Preserve any pipe-delimited tokens (\`A|B|C\`) and em-dash spacing \` – \`.\n` +
    `- Single-word labels (directions, day names, A+/A/B/C/D grades) stay canonical or unchanged where appropriate.\n` +
    `- Mantras (\`Om ... Namah\`) stay in Sanskrit transliterated to the target script.\n` +
    `- Apostrophes inside English (e.g. "Tonight's") handled idiomatically.\n\n` +
    `Input (en object):\n${JSON.stringify(enObject, null, 2)}`;

  const body = {
    contents: [{ role: 'user', parts: [{ text: prompt }] }],
    generationConfig: {
      responseMimeType: 'application/json',
      temperature: 0.3,
      maxOutputTokens: 65536,
    },
  };

  let lastErr = null;
  const maxAttempts = 5;
  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    const res = spawnSync(
      'curl',
      [
        '-s',
        '-f',
        '--max-time',
        '180',
        '-X',
        'POST',
        '-H',
        `Authorization: Bearer ${token}`,
        '-H',
        'Content-Type: application/json',
        ENDPOINT,
        '-d',
        JSON.stringify(body),
      ],
      { encoding: 'utf-8', maxBuffer: 50 * 1024 * 1024 },
    );
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
    lastErr = new Error(`curl exit ${res.status}: ${res.stderr?.slice(0, 200)}`);
    // Backoff: 2s, 6s, 14s, 30s — gives transient outages time to recover.
    const wait = 2000 * (2 ** attempt - 1) + 2000;
    process.stderr.write(`    curl failed (exit ${res.status}), retry ${attempt + 1}/${maxAttempts} in ${wait / 1000}s\n`);
    await new Promise((r) => setTimeout(r, wait));
  }
  throw lastErr;
}

function collectShadows(data) {
  const shadows = [];
  function visit(node, path) {
    if (typeof node !== 'object' || node === null) return;
    if (typeof node.en === 'string' && typeof node.hi === 'string') {
      // Skip legitimate cognates: single-token short strings (locale codes,
      // grades, abbreviations) and en==hi Sanskrit/Devanagari identity.
      const en = node.en;
      if (!(en.includes(' ') || en.length >= 12)) return;
      if (node.en === node.hi) return;
      const missing = TARGETS.filter((l) => node[l] === en);
      if (missing.length > 0) shadows.push({ path, en, missingLocales: missing });
      return;
    }
    for (const [k, v] of Object.entries(node)) visit(v, [...path, k]);
  }
  visit(data, []);
  return shadows;
}

function getNode(root, path) {
  let n = root;
  for (const k of path) n = n[k];
  return n;
}

async function processFile(filePath, token) {
  process.stderr.write(`\n=== ${filePath} ===\n`);
  const data = JSON.parse(readFileSync(filePath, 'utf-8'));
  const shadows = collectShadows(data);
  if (shadows.length === 0) {
    process.stderr.write('  no shadows — skipping\n');
    return { filePath, written: false };
  }

  const buckets = new Map();
  for (const s of shadows) {
    const bucketKey = s.missingLocales.slice().sort().join(',');
    let b = buckets.get(bucketKey);
    if (!b) {
      b = { locales: s.missingLocales.slice().sort(), entries: [] };
      buckets.set(bucketKey, b);
    }
    b.entries.push(s);
  }

  process.stderr.write(`  ${shadows.length} shadow rows across ${buckets.size} bucket(s)\n`);

  let totalCalls = 0;
  for (const [bucketKey, b] of buckets.entries()) {
    const enObj = {};
    for (const s of b.entries) enObj[s.path.join('>')] = s.en;

    process.stderr.write(`  bucket [${bucketKey}] — ${b.entries.length} keys × ${b.locales.length} locales\n`);

    for (const locale of b.locales) {
      process.stderr.write(`    → ${locale}...`);
      const t0 = Date.now();
      const translated = await geminiTranslateOne(token, enObj, locale);
      totalCalls++;
      process.stderr.write(` ${((Date.now() - t0) / 1000).toFixed(1)}s\n`);

      for (const s of b.entries) {
        const key = s.path.join('>');
        const tx = translated[key];
        if (typeof tx !== 'string' || tx.trim() === '') {
          process.stderr.write(`      WARN missing translation for ${locale}:${key}\n`);
          continue;
        }
        const node = getNode(data, s.path);
        node[locale] = tx;
      }
    }
  }

  writeFileSync(filePath, JSON.stringify(data, null, 2) + '\n');
  process.stderr.write(`  ✓ wrote ${filePath} (${totalCalls} Gemini calls)\n`);
  return { filePath, written: true, calls: totalCalls };
}

async function main() {
  const files = process.argv.slice(2);
  if (files.length === 0) {
    process.stderr.write('usage: node scripts/translate-message-shadows.mjs <file.json> [...]\n');
    process.exit(2);
  }
  const token = getAccessToken();
  const results = [];
  const failures = [];
  for (const f of files) {
    try {
      results.push(await processFile(f, token));
    } catch (err) {
      // One file's transient outage shouldn't kill the whole batch — the
      // script is idempotent, so just record and continue. Re-run on the
      // failed files to fill remaining shadows.
      process.stderr.write(`  ✗ FAILED ${f}: ${err.message?.slice(0, 200)}\n`);
      failures.push({ filePath: f, error: err.message });
    }
  }
  process.stderr.write('\n=== summary ===\n');
  for (const r of results) {
    process.stderr.write(`  ${r.written ? '✓' : '·'} ${r.filePath}${r.calls != null ? ` (${r.calls} calls)` : ''}\n`);
  }
  for (const fail of failures) {
    process.stderr.write(`  ✗ ${fail.filePath} — ${fail.error?.slice(0, 120)}\n`);
  }
  if (failures.length > 0) process.exit(3);
}

main().catch((err) => {
  console.error('fatal:', err);
  process.exit(1);
});
