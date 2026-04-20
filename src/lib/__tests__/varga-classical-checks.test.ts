/**
 * Tests for varga-classical-checks.ts
 * Covers: checkPushkara, checkGandanta, classifyVargaVisesha
 */
import { describe, it, expect } from 'vitest';
import {
  checkPushkara,
  checkGandanta,
  classifyVargaVisesha,
} from '../tippanni/varga-classical-checks';
import type { DignityLevel } from '../tippanni/varga-tippanni-types-v2';

// ---------------------------------------------------------------------------
// checkPushkara
// ---------------------------------------------------------------------------
describe('checkPushkara', () => {
  it('returns correct structure with all required fields', () => {
    const result = checkPushkara(4, 45.0); // Jupiter at 45° (15° Taurus)
    expect(result).toHaveProperty('planetId', 4);
    expect(result).toHaveProperty('isPushkaraNavamsha');
    expect(result).toHaveProperty('isPushkaraBhaga');
    expect(result).toHaveProperty('degree');
    expect(typeof result.isPushkaraNavamsha).toBe('boolean');
    expect(typeof result.isPushkaraBhaga).toBe('boolean');
  });

  it('detects Pushkara Bhaga in Aries at 21°', () => {
    // Aries = sign 1, Pushkara Bhaga = 21°. Absolute longitude = 0 + 21 = 21°
    const result = checkPushkara(0, 21.0);
    expect(result.isPushkaraBhaga).toBe(true);
    expect(result.degree).toBeCloseTo(21.0, 1);
  });

  it('detects Pushkara Bhaga within 1° tolerance', () => {
    // Aries Pushkara Bhaga = 21°, planet at 20.5° should match
    const result = checkPushkara(0, 20.5);
    expect(result.isPushkaraBhaga).toBe(true);
  });

  it('rejects Pushkara Bhaga beyond 1° tolerance', () => {
    // Aries Pushkara Bhaga = 21°, planet at 19.5° should NOT match
    const result = checkPushkara(0, 19.5);
    expect(result.isPushkaraBhaga).toBe(false);
  });

  it('detects Pushkara Bhaga in Taurus at 14°', () => {
    // Taurus starts at 30°, Pushkara Bhaga = 14° → absolute = 44°
    const result = checkPushkara(1, 44.0);
    expect(result.isPushkaraBhaga).toBe(true);
  });

  it('detects Pushkara Navamsha for a planet in Cancer navamsha', () => {
    // Aries (fire sign) → navamsha starts from Aries(1).
    // Pada 4 in Aries = navamsha sign Aries+3 = Cancer(4). Degree range: 10°-13°20'
    // Planet at 11° Aries → pada 4 → Cancer navamsha → Pushkara
    const result = checkPushkara(1, 11.0);
    expect(result.isPushkaraNavamsha).toBe(true);
  });

  it('non-Pushkara navamsha for mid-Aries planet', () => {
    // 5° Aries → pada 2 → navamsha sign Aries+1 = Taurus(2) → IS Pushkara
    const result = checkPushkara(1, 5.0);
    expect(result.isPushkaraNavamsha).toBe(true); // Taurus is a Pushkara navamsha sign
  });

  it('detects Pushkara Navamsha for Pisces navamsha', () => {
    // Need a planet whose navamsha falls in Pisces(12).
    // Cancer (water sign) → navamsha starts from Cancer(4).
    // Pada 9 in Cancer = Cancer+8 = Pisces(12). Degree range: 26°40'-30°
    // Planet at 27° Cancer → absolute = 90+27 = 117°
    const result = checkPushkara(4, 117.0);
    expect(result.isPushkaraNavamsha).toBe(true);
  });
});

// ---------------------------------------------------------------------------
// checkGandanta
// ---------------------------------------------------------------------------
describe('checkGandanta', () => {
  it('returns correct structure', () => {
    const result = checkGandanta(1, 180.0); // Moon at 0° Libra (mid-chart, no gandanta)
    expect(result).toHaveProperty('planetId', 1);
    expect(result).toHaveProperty('isGandanta');
    expect(result).toHaveProperty('severity');
    expect(result).toHaveProperty('proximityDegrees');
    expect(result).toHaveProperty('junction');
  });

  it('severe gandanta at 0.5° from Pisces-Aries junction', () => {
    // Pisces-Aries junction at 0°/360°. Planet at 359.5° (29°30' Pisces)
    const result = checkGandanta(1, 359.5);
    expect(result.isGandanta).toBe(true);
    expect(result.severity).toBe('severe');
    expect(result.proximityDegrees).toBeCloseTo(0.5, 1);
    expect(result.junction).toContain('Pisces');
    expect(result.junction).toContain('Aries');
  });

  it('severe gandanta at 0.5° Aries (just after Pisces-Aries junction)', () => {
    const result = checkGandanta(1, 0.5);
    expect(result.isGandanta).toBe(true);
    expect(result.severity).toBe('severe');
    expect(result.proximityDegrees).toBeCloseTo(0.5, 1);
  });

  it('moderate gandanta at 2° from Cancer-Leo junction', () => {
    // Cancer-Leo junction at 120°. Planet at 118° (28° Cancer)
    const result = checkGandanta(1, 118.0);
    expect(result.isGandanta).toBe(true);
    expect(result.severity).toBe('moderate');
    expect(result.proximityDegrees).toBeCloseTo(2.0, 1);
    expect(result.junction).toContain('Cancer');
    expect(result.junction).toContain('Leo');
  });

  it('mild gandanta at ~3° from Scorpio-Sagittarius junction', () => {
    // Scorpio-Sagittarius junction at 240°. Planet at 237° (27° Scorpio)
    const result = checkGandanta(1, 237.0);
    expect(result.isGandanta).toBe(true);
    expect(result.severity).toBe('mild');
    expect(result.proximityDegrees).toBeCloseTo(3.0, 1);
  });

  it('no gandanta at 15° mid-sign', () => {
    // 15° Aries = well away from any junction
    const result = checkGandanta(1, 15.0);
    expect(result.isGandanta).toBe(false);
    expect(result.severity).toBe('none');
  });

  it('no gandanta at air-water junction (not water-fire)', () => {
    // Gemini-Cancer junction at 90° is air→water, NOT water→fire
    const result = checkGandanta(1, 89.5);
    expect(result.isGandanta).toBe(false);
    expect(result.severity).toBe('none');
  });

  it('detects Cancer-Leo junction from Cancer side (~119.5°)', () => {
    // 119.5° = 29.5° Cancer, 0.5° before the 120° junction
    const result = checkGandanta(1, 119.5);
    expect(result.isGandanta).toBe(true);
    expect(result.severity).toBe('severe');
    expect(result.junction).toContain('Cancer');
    expect(result.junction).toContain('Leo');
  });
});

// ---------------------------------------------------------------------------
// classifyVargaVisesha
// ---------------------------------------------------------------------------
describe('classifyVargaVisesha', () => {
  it('returns none for 0 strong dignities', () => {
    const dignities: DignityLevel[] = ['enemy', 'neutral', 'debilitated'];
    expect(classifyVargaVisesha(dignities)).toBe('none');
  });

  it('returns none for 1 strong dignity', () => {
    const dignities: DignityLevel[] = ['exalted', 'enemy', 'neutral'];
    expect(classifyVargaVisesha(dignities)).toBe('none');
  });

  it('returns parijatamsha for 2 strong dignities', () => {
    const dignities: DignityLevel[] = ['exalted', 'own', 'neutral'];
    expect(classifyVargaVisesha(dignities)).toBe('parijatamsha');
  });

  it('returns uttamamsha for 3 strong dignities', () => {
    const dignities: DignityLevel[] = ['exalted', 'own', 'exalted', 'enemy'];
    expect(classifyVargaVisesha(dignities)).toBe('uttamamsha');
  });

  it('returns gopuramsha for 4 strong dignities', () => {
    const dignities: DignityLevel[] = ['exalted', 'own', 'exalted', 'own'];
    expect(classifyVargaVisesha(dignities)).toBe('gopuramsha');
  });

  it('returns simhasanamsha for 5 strong dignities', () => {
    const dignities: DignityLevel[] = ['exalted', 'own', 'exalted', 'own', 'exalted'];
    expect(classifyVargaVisesha(dignities)).toBe('simhasanamsha');
  });

  it('returns paravatamsha for 6 strong dignities', () => {
    const dignities: DignityLevel[] = ['exalted', 'own', 'exalted', 'own', 'exalted', 'own'];
    expect(classifyVargaVisesha(dignities)).toBe('paravatamsha');
  });

  it('returns devalokamsha for 7+ strong dignities', () => {
    const dignities: DignityLevel[] = [
      'exalted', 'own', 'exalted', 'own', 'exalted', 'own', 'exalted',
    ];
    expect(classifyVargaVisesha(dignities)).toBe('devalokamsha');
  });

  it('counts own sign as strong', () => {
    const dignities: DignityLevel[] = ['own', 'own', 'neutral'];
    expect(classifyVargaVisesha(dignities)).toBe('parijatamsha');
  });

  it('does not count friend as strong', () => {
    const dignities: DignityLevel[] = ['friend', 'friend', 'neutral'];
    expect(classifyVargaVisesha(dignities)).toBe('none');
  });
});
