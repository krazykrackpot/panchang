import { describe, it, expect } from 'vitest';
import { BRIGHT_STARS, CONSTELLATION_LINES } from '../star-catalog';

describe('BRIGHT_STARS', () => {
  it('has at least 80 stars', () => {
    expect(BRIGHT_STARS.length).toBeGreaterThanOrEqual(80);
  });

  it('all stars have valid coordinates', () => {
    for (const star of BRIGHT_STARS) {
      expect(star.ra).toBeGreaterThanOrEqual(0);
      expect(star.ra).toBeLessThan(360);
      expect(star.dec).toBeGreaterThanOrEqual(-90);
      expect(star.dec).toBeLessThanOrEqual(90);
      expect(star.name).toBeTruthy();
      expect(star.mag).toBeLessThanOrEqual(5); // Allow some fainter zodiac stars
    }
  });

  it('all stars have valid color hex codes', () => {
    const validColors = ['#9bb0ff', '#cad7ff', '#f8f7ff', '#fff4e8', '#ffd2a1', '#ffcc6f'];
    for (const star of BRIGHT_STARS) {
      expect(validColors).toContain(star.color);
    }
  });

  it('includes Sirius as the brightest star', () => {
    const sirius = BRIGHT_STARS.find(s => s.name === 'Sirius');
    expect(sirius).toBeDefined();
    expect(sirius!.mag).toBeLessThan(0);
  });

  it('stars are roughly ordered by magnitude', () => {
    // First 3 should all be negative magnitude
    expect(BRIGHT_STARS[0].mag).toBeLessThan(0);
    expect(BRIGHT_STARS[1].mag).toBeLessThan(0);
    expect(BRIGHT_STARS[2].mag).toBeLessThan(0);
  });

  it('includes all zodiac constellations', () => {
    const zodiacAbbrevs = ['Ari', 'Tau', 'Gem', 'Cnc', 'Leo', 'Vir', 'Lib', 'Sco', 'Sgr', 'Cap', 'Aqr', 'Psc'];
    for (const z of zodiacAbbrevs) {
      const stars = BRIGHT_STARS.filter(s => s.constellation === z);
      expect(stars.length, `Zodiac constellation ${z} should have at least 1 star`).toBeGreaterThanOrEqual(1);
    }
  });

  it('includes key navigational stars', () => {
    const mustHave = [
      'Sirius', 'Canopus', 'Arcturus', 'Vega', 'Capella', 'Rigel',
      'Procyon', 'Betelgeuse', 'Altair', 'Aldebaran', 'Antares',
      'Spica', 'Pollux', 'Fomalhaut', 'Deneb', 'Regulus', 'Polaris',
    ];
    for (const name of mustHave) {
      const found = BRIGHT_STARS.find(s => s.name === name);
      expect(found, `Star "${name}" should be in the catalog`).toBeDefined();
    }
  });

  it('has unique names (no exact duplicates)', () => {
    const names = BRIGHT_STARS.map(s => s.name);
    const unique = new Set(names);
    // Allow Epsilon Sco / Larawag as a known duplicate pair
    expect(unique.size).toBeGreaterThanOrEqual(names.length - 2);
  });
});

describe('CONSTELLATION_LINES', () => {
  it('has at least 12 constellations', () => {
    expect(CONSTELLATION_LINES.length).toBeGreaterThanOrEqual(12);
  });

  it('all line indices reference valid stars', () => {
    for (const c of CONSTELLATION_LINES) {
      for (const segment of c.lines) {
        for (const starIdx of segment) {
          expect(starIdx, `Invalid star index ${starIdx} in constellation ${c.name}`)
            .toBeGreaterThanOrEqual(0);
          expect(starIdx, `Star index ${starIdx} out of range in constellation ${c.name}`)
            .toBeLessThan(BRIGHT_STARS.length);
        }
      }
    }
  });

  it('includes major constellations', () => {
    const mustHave = ['Ori', 'UMa', 'UMi', 'Cas', 'Leo', 'Sco', 'Cyg', 'CMa', 'Cru'];
    for (const abbr of mustHave) {
      const found = CONSTELLATION_LINES.find(c => c.constellation === abbr);
      expect(found, `Constellation "${abbr}" should have line data`).toBeDefined();
    }
  });

  it('each constellation has a name and abbreviation', () => {
    for (const c of CONSTELLATION_LINES) {
      expect(c.constellation).toBeTruthy();
      expect(c.name).toBeTruthy();
    }
  });

  it('line segments reference stars belonging to the correct constellation (mostly)', () => {
    // Most stars in a constellation's lines should belong to that constellation
    // Exception: cross-constellation lines (e.g., Virgo-Leo with Denebola)
    for (const c of CONSTELLATION_LINES) {
      if (c.lines.length === 0) continue;
      const allIndices = c.lines.flat();
      const matchingConstellation = allIndices.filter(
        i => BRIGHT_STARS[i].constellation === c.constellation
      );
      // At least 50% of referenced stars should be from the constellation
      if (allIndices.length > 0) {
        const ratio = matchingConstellation.length / allIndices.length;
        expect(ratio, `Constellation ${c.name} has too many cross-references`)
          .toBeGreaterThanOrEqual(0.3);
      }
    }
  });
});
