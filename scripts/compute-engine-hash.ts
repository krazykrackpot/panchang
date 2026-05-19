/**
 * Computes a hash of all files in the kundali computation pipeline.
 * Run at build time to generate a version string that auto-changes
 * whenever any computation logic changes.
 *
 * Usage: npx tsx scripts/compute-engine-hash.ts
 * Output: writes src/lib/kundali/engine-version.ts
 */

import { createHash } from 'crypto';
import { readFileSync, writeFileSync } from 'fs';
import { resolve } from 'path';

// Every file whose change could affect kundali computation output
const PIPELINE_FILES = [
  'src/lib/ephem/kundali-calc.ts',
  'src/lib/ephem/panchang-calc.ts',
  'src/lib/ephem/astronomical.ts',
  'src/lib/kundali/yoga-engine/engine.ts',
  'src/lib/kundali/yoga-engine/evaluator.ts',
  'src/lib/kundali/yoga-engine/context.ts',
  'src/lib/kundali/domain-synthesis/synthesizer.ts',
  'src/lib/kundali/domain-synthesis/scorer.ts',
  'src/lib/kundali/domain-synthesis/current-period.ts',
  'src/lib/constants/dignities.ts',
  'src/lib/constants/grahas.ts',
  'src/lib/kundali/yoga-engine/rules/raja.ts',
  'src/lib/kundali/yoga-engine/rules/per-lagna-raja.ts',
  'src/lib/kundali/yoga-engine/rules/chandra.ts',
  'src/lib/kundali/yoga-engine/rules/surya.ts',
  'src/lib/kundali/yoga-engine/rules/dosha.ts',
  'src/lib/kundali/yoga-engine/rules/mahapurusha.ts',
  'src/lib/kundali/yoga-engine/rules/nabhasa.ts',
  'src/lib/kundali/yoga-engine/rules/dhana.ts',
  'src/lib/kundali/yoga-engine/rules/conjunction.ts',
  'src/lib/kundali/yoga-engine/rules/malika.ts',
  'src/lib/kundali/tippanni-engine.ts',
  'src/lib/kundali/sade-sati-analysis.ts',
];

const hash = createHash('sha256');

for (const file of PIPELINE_FILES) {
  try {
    const content = readFileSync(resolve(file), 'utf-8');
    hash.update(content);
  } catch {
    // File might not exist yet — skip
  }
}

const version = hash.digest('hex').slice(0, 12);

const output = `// AUTO-GENERATED — do not edit. Run: npx tsx scripts/compute-engine-hash.ts
// Changes whenever any file in the kundali computation pipeline is modified.
export const ENGINE_VERSION = '${version}';
`;

writeFileSync(resolve('src/lib/kundali/engine-version.ts'), output);
console.log(`Engine version: ${version}`);
