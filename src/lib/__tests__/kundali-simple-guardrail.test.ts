/**
 * Guardrail test: KundaliSimple must NEVER recompute astronomical/synthesis data.
 *
 * Root cause of the wrong-nakshatra bug (2026-05-17): KundaliSimple independently
 * called synthesizeReading() and generateCosmicBlueprint(), producing divergent
 * results from the kundali engine's already-correct values.
 *
 * Rule: Simple mode READS from KundaliData and receives blueprint as a prop.
 * It must never import computation functions. This test enforces that by
 * scanning the source file for banned imports.
 */

import { readFileSync } from 'fs';
import { resolve } from 'path';
import { describe, it, expect } from 'vitest';

const SIMPLE_MODE_FILE = resolve(__dirname, '../../components/kundali/KundaliSimple.tsx');

// Computation functions that must NEVER appear in KundaliSimple.
// If you're tempted to add one, you're recomputing — use the data from KundaliData instead.
const BANNED_IMPORTS = [
  'synthesizeReading',
  'synthesizeDomainDeepDive',
  'generateCosmicBlueprint',
  'generateKundali',
  'buildBlueprintInput',
  'scoreDomain',
  'evaluateSignificatorsHolistic',
  'computePanchang',
  'calculateTithi',
  'calculateYoga',
  'getNakshatraNumber',
  'sunLongitude',
  'moonLongitude',
];

describe('KundaliSimple guardrail — no recomputation', () => {
  const source = readFileSync(SIMPLE_MODE_FILE, 'utf-8');

  it.each(BANNED_IMPORTS)('must not import %s', (fnName) => {
    expect(source).not.toContain(fnName);
  });

  it('must not import from domain-synthesis/synthesizer', () => {
    expect(source).not.toContain('domain-synthesis/synthesizer');
  });

  it('must not import from ephem/', () => {
    expect(source).not.toContain("from '@/lib/ephem/");
  });

  it('must not import from archetype-engine (blueprint comes as prop)', () => {
    // Importing the TYPE is fine, importing the function is not
    const lines = source.split('\n');
    const importLines = lines.filter(l => l.includes("from '@/lib/kundali/archetype-engine'"));
    for (const line of importLines) {
      expect(line).toMatch(/^import\s+type\b/);
    }
  });

  it('must accept blueprint as a prop (not compute it)', () => {
    expect(source).toContain('blueprint: CosmicBlueprint');
  });
});
