// src/lib/kundali/health-diagnosis/__tests__/signatures.test.ts
import { describe, it, expect } from 'vitest';
import { detectAllSignatures, SIGNATURE_REGISTRY } from '../signatures';
import { generateKundali } from '@/lib/ephem/kundali-calc';

describe('signatures registry', () => {
  it('exposes at least 12 detectors covering the spec\'s named yogas/patterns', () => {
    const ids = Object.keys(SIGNATURE_REGISTRY);
    expect(ids.length).toBeGreaterThanOrEqual(12);
    expect(ids).toEqual(expect.arrayContaining([
      'cardiac_risk', 'anxiety_mental', 'chronic_digestive', 'urogenital',
      'chronic_hidden', 'nervous_system_vata', 'respiratory', 'eye_sleep',
      'kemadruma', 'pisaca', 'mars_rahu_accident', 'saturn_rahu_malignancy',
    ]));
  });

  it('every signature has a direction field set to risk or protective', () => {
    for (const [id, def] of Object.entries(SIGNATURE_REGISTRY)) {
      expect(
        def.direction,
        `signature '${id}' is missing direction field`,
      ).toMatch(/^(risk|protective)$/);
    }
  });

  it('all currently-registered signatures are direction:risk (no protective ones yet)', () => {
    // This test documents the Phase B state. When a protective signature is added
    // in a future phase, this test should be updated to exclude it from the assertion.
    for (const [id, def] of Object.entries(SIGNATURE_REGISTRY)) {
      expect(def.direction, `signature '${id}' expected to be risk`).toBe('risk');
    }
  });

  it('detectAllSignatures returns boolean map keyed by signature id', () => {
    const k = generateKundali({
      date: '1990-01-15', time: '06:30', lat: 28.61, lng: 77.21,
      timezone: 'Asia/Kolkata', ayanamsha: 'lahiri',
    });
    const detected = detectAllSignatures(k);
    for (const id of Object.keys(SIGNATURE_REGISTRY)) {
      expect(typeof detected[id]).toBe('boolean');
    }
  });
});
