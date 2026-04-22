import { describe, it, expect } from 'vitest';
import { findTransitNatalAspects } from '../natal-aspects';

describe('findTransitNatalAspects', () => {
  it('Saturn at 100° conjunct natal Moon at 102° → conjunction, orb≈2, major', () => {
    const transit = [{ id: 6, longitude: 100, speed: 0.05 }];
    const natal = [{ id: 1, longitude: 102 }];
    const aspects = findTransitNatalAspects(transit, natal);

    const conj = aspects.find(a => a.aspectType === 'conjunction');
    expect(conj).toBeDefined();
    expect(conj!.transitPlanet).toBe(6);
    expect(conj!.natalPlanet).toBe(1);
    expect(conj!.orb).toBe(2);
    expect(conj!.significance).toBe('major');
  });

  it('Jupiter at 180° opposing natal Sun at 0° → opposition, orb=0, major', () => {
    const transit = [{ id: 4, longitude: 180, speed: 0.08 }];
    const natal = [{ id: 0, longitude: 0 }];
    const aspects = findTransitNatalAspects(transit, natal);

    const opp = aspects.find(a => a.aspectType === 'opposition');
    expect(opp).toBeDefined();
    expect(opp!.orb).toBe(0);
    expect(opp!.significance).toBe('major');
  });

  it('no aspect when planets are 45° apart (no standard aspect at that angle)', () => {
    const transit = [{ id: 6, longitude: 45, speed: 0.05 }];
    const natal = [{ id: 0, longitude: 0 }];
    const aspects = findTransitNatalAspects(transit, natal);

    // 45° is not conjunction(0), opposition(180), trine(120), square(90), or sextile(60)
    // Closest would be sextile at 60° but orb=15 exceeds max orb of 4
    expect(aspects.length).toBe(0);
  });

  it('isApplying when speed is positive and transit approaches natal (conjunction)', () => {
    // Transit Saturn at 98°, natal planet at 102°, speed +0.05 → approaching conjunction
    const transit = [{ id: 6, longitude: 98, speed: 0.05 }];
    const natal = [{ id: 3, longitude: 102 }];
    const aspects = findTransitNatalAspects(transit, natal);

    const conj = aspects.find(a => a.aspectType === 'conjunction');
    expect(conj).toBeDefined();
    expect(conj!.isApplying).toBe(true);
  });

  it('isSeparating when speed is positive and transit has passed natal', () => {
    // Transit Saturn at 104°, natal at 102°, speed +0.05 → separating from conjunction
    const transit = [{ id: 6, longitude: 104, speed: 0.05 }];
    const natal = [{ id: 3, longitude: 102 }];
    const aspects = findTransitNatalAspects(transit, natal);

    const conj = aspects.find(a => a.aspectType === 'conjunction');
    expect(conj).toBeDefined();
    expect(conj!.isApplying).toBe(false);
  });

  it('only checks slow planets (Jupiter=4, Saturn=6, Rahu=7)', () => {
    // Sun (id=0) should NOT be checked as a transit planet
    const transit = [
      { id: 0, longitude: 100, speed: 1.0 }, // Sun — skipped
      { id: 6, longitude: 100, speed: 0.05 }, // Saturn — checked
    ];
    const natal = [{ id: 1, longitude: 100 }];
    const aspects = findTransitNatalAspects(transit, natal);

    // Only Saturn's aspects should appear
    expect(aspects.every(a => a.transitPlanet === 6)).toBe(true);
    expect(aspects.some(a => a.transitPlanet === 0)).toBe(false);
  });

  it('finds trine aspect (120° apart within orb)', () => {
    const transit = [{ id: 4, longitude: 122, speed: 0.1 }];
    const natal = [{ id: 0, longitude: 0 }];
    const aspects = findTransitNatalAspects(transit, natal);

    const trine = aspects.find(a => a.aspectType === 'trine');
    expect(trine).toBeDefined();
    expect(trine!.orb).toBe(2);
    expect(trine!.significance).toBe('moderate');
  });

  it('finds square aspect (90° apart within orb)', () => {
    const transit = [{ id: 7, longitude: 88, speed: -0.02 }]; // Rahu
    const natal = [{ id: 2, longitude: 0 }];
    const aspects = findTransitNatalAspects(transit, natal);

    const square = aspects.find(a => a.aspectType === 'square');
    expect(square).toBeDefined();
    expect(square!.orb).toBe(2);
    expect(square!.significance).toBe('moderate');
  });

  it('finds sextile aspect (60° apart within orb)', () => {
    const transit = [{ id: 6, longitude: 61, speed: 0.05 }];
    const natal = [{ id: 5, longitude: 0 }];
    const aspects = findTransitNatalAspects(transit, natal);

    const sextile = aspects.find(a => a.aspectType === 'sextile');
    expect(sextile).toBeDefined();
    expect(sextile!.orb).toBe(1);
    expect(sextile!.significance).toBe('minor');
  });

  it('handles wrap-around at 0°/360° boundary', () => {
    // Transit at 358°, natal at 2° → angular distance = 4° → conjunction within orb
    const transit = [{ id: 6, longitude: 358, speed: 0.05 }];
    const natal = [{ id: 0, longitude: 2 }];
    const aspects = findTransitNatalAspects(transit, natal);

    const conj = aspects.find(a => a.aspectType === 'conjunction');
    expect(conj).toBeDefined();
    expect(conj!.orb).toBe(4);
  });
});
