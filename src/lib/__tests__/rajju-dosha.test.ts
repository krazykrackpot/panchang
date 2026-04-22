/**
 * Rajju Dosha Tests
 * Covers all 5 Rajju groups, the no-dosha case, full nakshatra coverage,
 * and multilingual field presence.
 */

import { describe, it, expect } from 'vitest';
import { analyzeRajjuDosha, NAKSHATRA_RAJJU } from '@/lib/matching/rajju-dosha';
import type { RajjuGroup } from '@/lib/matching/rajju-dosha';

describe('analyzeRajjuDosha', () => {
  // ── Same-group dosha cases ─────────────────────────────────────────────────

  it('same Pada Rajju (Ashwini=1 + Revati=27) → doshaPresent=true, severity=mild', () => {
    const result = analyzeRajjuDosha(1, 27); // Ashwini + Revati → both pada
    expect(result.doshaPresent).toBe(true);
    expect(result.severity).toBe('mild');
    expect(result.boyRajju).toBe('pada');
    expect(result.girlRajju).toBe('pada');
  });

  it('same Kantha Rajju (Rohini=4 + Hasta=13) → doshaPresent=true, severity=severe', () => {
    const result = analyzeRajjuDosha(4, 13); // Rohini + Hasta → both kantha
    expect(result.doshaPresent).toBe(true);
    expect(result.severity).toBe('severe');
    expect(result.boyRajju).toBe('kantha');
    expect(result.girlRajju).toBe('kantha');
  });

  it('same Shiro Rajju (Mrigashira=5 + Chitra=14) → doshaPresent=true, severity=severe', () => {
    const result = analyzeRajjuDosha(5, 14); // Mrigashira + Chitra → both shiro
    expect(result.doshaPresent).toBe(true);
    expect(result.severity).toBe('severe');
    expect(result.boyRajju).toBe('shiro');
    expect(result.girlRajju).toBe('shiro');
  });

  it('same Nabhi Rajju (Krittika=3 + Punarvasu=7) → doshaPresent=true, severity=moderate', () => {
    const result = analyzeRajjuDosha(3, 7); // Krittika + Punarvasu → both nabhi
    expect(result.doshaPresent).toBe(true);
    expect(result.severity).toBe('moderate');
    expect(result.boyRajju).toBe('nabhi');
    expect(result.girlRajju).toBe('nabhi');
  });

  it('same Kati Rajju (Bharani=2 + Pushya=8) → doshaPresent=true, severity=mild', () => {
    const result = analyzeRajjuDosha(2, 8); // Bharani + Pushya → both kati
    expect(result.doshaPresent).toBe(true);
    expect(result.severity).toBe('mild');
    expect(result.boyRajju).toBe('kati');
    expect(result.girlRajju).toBe('kati');
  });

  // ── No-dosha case ─────────────────────────────────────────────────────────

  it('different Rajju (Ashwini=1 pada + Bharani=2 kati) → doshaPresent=false, severity=none', () => {
    const result = analyzeRajjuDosha(1, 2); // Ashwini (pada) + Bharani (kati)
    expect(result.doshaPresent).toBe(false);
    expect(result.severity).toBe('none');
    expect(result.boyRajju).toBe('pada');
    expect(result.girlRajju).toBe('kati');
  });

  // ── Additional cross-group pairs ──────────────────────────────────────────

  it('different Rajju (Dhanishtha=23 shiro + Shatabhisha=24 kantha) → doshaPresent=false', () => {
    const result = analyzeRajjuDosha(23, 24);
    expect(result.doshaPresent).toBe(false);
    expect(result.severity).toBe('none');
  });

  it('same Shiro Rajju (Mrigashira=5 + Dhanishtha=23) → severe', () => {
    const result = analyzeRajjuDosha(5, 23);
    expect(result.doshaPresent).toBe(true);
    expect(result.severity).toBe('severe');
    expect(result.boyRajju).toBe('shiro');
    expect(result.girlRajju).toBe('shiro');
  });

  it('same Kantha Rajju (Ardra=6 + Shravana=22) → severe', () => {
    const result = analyzeRajjuDosha(6, 22);
    expect(result.doshaPresent).toBe(true);
    expect(result.severity).toBe('severe');
  });

  // ── Full nakshatra coverage ───────────────────────────────────────────────

  it('all 27 nakshatras have a valid Rajju group assignment', () => {
    const validGroups: RajjuGroup[] = ['pada', 'kati', 'nabhi', 'kantha', 'shiro'];
    for (let nak = 1; nak <= 27; nak++) {
      const group = NAKSHATRA_RAJJU[nak];
      expect(group, `Nakshatra ${nak} should have a Rajju group`).toBeDefined();
      expect(validGroups, `Nakshatra ${nak} group '${group}' should be valid`).toContain(group);
    }
    // Exactly 27 nakshatras are mapped
    const assignedNakshatras = Object.keys(NAKSHATRA_RAJJU).map(Number);
    expect(assignedNakshatras.length).toBe(27);
  });

  it('each Rajju group has the expected nakshatra count', () => {
    // pada: 6, kati: 6, nabhi: 6, kantha: 6, shiro: 3
    const counts: Record<string, number> = {};
    for (let nak = 1; nak <= 27; nak++) {
      const g = NAKSHATRA_RAJJU[nak];
      counts[g] = (counts[g] ?? 0) + 1;
    }
    expect(counts['pada']).toBe(6);
    expect(counts['kati']).toBe(6);
    expect(counts['nabhi']).toBe(6);
    expect(counts['kantha']).toBe(6);
    expect(counts['shiro']).toBe(3);
  });

  // ── Multilingual fields ───────────────────────────────────────────────────

  it('description has en, hi, ta keys for dosha case', () => {
    const result = analyzeRajjuDosha(5, 14); // same shiro
    expect(result.description.en).toBeTruthy();
    expect(result.description.hi).toBeTruthy();
    expect(result.description.ta).toBeTruthy();
    expect(result.groupName.en).toBeTruthy();
    expect(result.groupName.hi).toBeTruthy();
    expect(result.groupName.ta).toBeTruthy();
  });

  it('description has en, hi, ta keys for no-dosha case', () => {
    const result = analyzeRajjuDosha(1, 2); // different
    expect(result.description.en).toBeTruthy();
    expect(result.description.hi).toBeTruthy();
    expect(result.description.ta).toBeTruthy();
    expect(result.groupName.en).toBeTruthy();
    expect(result.groupName.hi).toBeTruthy();
    expect(result.groupName.ta).toBeTruthy();
  });

  it('all 5 dosha severity levels match their expected groups', () => {
    // Test one representative nakshatra pair per group
    const cases: [number, number, RajjuGroup, string][] = [
      [1, 10, 'pada', 'mild'],      // Ashwini + Magha → pada
      [8, 20, 'kati', 'mild'],      // Pushya + P.Ashadha → kati
      [7, 16, 'nabhi', 'moderate'], // Punarvasu + Vishakha → nabhi
      [15, 22, 'kantha', 'severe'], // Swati + Shravana → kantha
      [5, 23, 'shiro', 'severe'],   // Mrigashira + Dhanishtha → shiro
    ];
    for (const [boy, girl, expectedGroup, expectedSeverity] of cases) {
      const result = analyzeRajjuDosha(boy, girl);
      expect(result.doshaPresent).toBe(true);
      expect(result.boyRajju).toBe(expectedGroup);
      expect(result.girlRajju).toBe(expectedGroup);
      expect(result.severity).toBe(expectedSeverity);
    }
  });
});
