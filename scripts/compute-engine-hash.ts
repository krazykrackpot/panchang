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

// Every file whose change could affect kundali computation output.
// IMPORTANT: include ALL health-diagnosis files so cache invalidation
// fires automatically when scoring weights or element scorers change.
// Spec: docs/superpowers/specs/2026-05-27-vercel-cost-reduction-design.md §4
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
  // ── Health-diagnosis pipeline (Fix 2 — added 2026-05-27) ─────────────────
  // Without these, a change to a scoring weight would serve stale cached
  // diagnoses until the user's snapshot is manually cleared.
  'src/lib/kundali/health-diagnosis/index.ts',
  'src/lib/kundali/health-diagnosis/layer-1-natal.ts',
  'src/lib/kundali/health-diagnosis/layer-2-mode.ts',
  'src/lib/kundali/health-diagnosis/layer-3-activation.ts',
  'src/lib/kundali/health-diagnosis/signatures.ts',
  'src/lib/kundali/health-diagnosis/weights.ts',
  'src/lib/kundali/health-diagnosis/scoring-utils.ts',
  'src/lib/kundali/health-diagnosis/strength-inputs.ts',
  'src/lib/kundali/health-diagnosis/element-catalog.ts',
  'src/lib/kundali/health-diagnosis/disclaimers.ts',
  // 22 element scorers
  'src/lib/kundali/health-diagnosis/elements/accidents.ts',
  'src/lib/kundali/health-diagnosis/elements/addictions.ts',
  'src/lib/kundali/health-diagnosis/elements/allergies.ts',
  'src/lib/kundali/health-diagnosis/elements/cancer.ts',
  'src/lib/kundali/health-diagnosis/elements/cardiac.ts',
  'src/lib/kundali/health-diagnosis/elements/chronic.ts',
  'src/lib/kundali/health-diagnosis/elements/digestive.ts',
  'src/lib/kundali/health-diagnosis/elements/endocrine.ts',
  'src/lib/kundali/health-diagnosis/elements/eyes.ts',
  'src/lib/kundali/health-diagnosis/elements/immunity.ts',
  'src/lib/kundali/health-diagnosis/elements/index.ts',
  'src/lib/kundali/health-diagnosis/elements/longevity.ts',
  'src/lib/kundali/health-diagnosis/elements/mental.ts',
  'src/lib/kundali/health-diagnosis/elements/muscular.ts',
  'src/lib/kundali/health-diagnosis/elements/nervous.ts',
  'src/lib/kundali/health-diagnosis/elements/pinda-ayurdaya.ts',
  'src/lib/kundali/health-diagnosis/elements/psychiatric.ts',
  'src/lib/kundali/health-diagnosis/elements/reproductive.ts',
  'src/lib/kundali/health-diagnosis/elements/respiratory.ts',
  'src/lib/kundali/health-diagnosis/elements/skeletal.ts',
  'src/lib/kundali/health-diagnosis/elements/skin.ts',
  'src/lib/kundali/health-diagnosis/elements/sleep.ts',
  'src/lib/kundali/health-diagnosis/elements/surgery.ts',
  'src/lib/kundali/health-diagnosis/elements/vitality.ts',
  // M1 audit fix: add the 6 legacy files that index.ts imports and that
  // contribute to the final HealthDiagnosis output. Previously omitted —
  // a change to legacy/constants.ts (e.g. SIGN_LORD typo fix) would NOT
  // invalidate cached diagnoses because the hash never saw the file change.
  'src/lib/kundali/health-diagnosis/legacy/body-map.ts',
  'src/lib/kundali/health-diagnosis/legacy/disease-profile.ts',
  'src/lib/kundali/health-diagnosis/legacy/health-timeline.ts',
  'src/lib/kundali/health-diagnosis/legacy/prakriti.ts',
  'src/lib/kundali/health-diagnosis/legacy/health-prognosis.ts',
  'src/lib/kundali/health-diagnosis/legacy/constants.ts',
];

const hash = createHash('sha256');

for (const file of PIPELINE_FILES) {
  // M1 audit fix: throw on missing files instead of silently skipping.
  // A silent skip (the original `catch { /* skip */ }`) means a renamed file
  // no longer contributes to the hash — the hash stays the same even when
  // the renamed file's content changes, so stale cached diagnoses are served
  // forever. Violation of CLAUDE.md "Never silently swallow errors".
  const content = readFileSync(resolve(file), 'utf-8');
  hash.update(content);
}

const version = hash.digest('hex').slice(0, 12);

const output = `// AUTO-GENERATED — do not edit. Run: npx tsx scripts/compute-engine-hash.ts
// Changes whenever any file in the kundali computation pipeline is modified.
export const ENGINE_VERSION = '${version}';
`;

writeFileSync(resolve('src/lib/kundali/engine-version.ts'), output);
console.log(`Engine version: ${version}`);
