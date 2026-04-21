import { describe, it, expect } from 'vitest';
import { getVargaPlanetText, VARGA_PLANET_TEXT } from '../tippanni/varga-planet-interpretations';

describe('varga-planet-interpretations', () => {
  it('returns D9 marriage text for Venus in 7th', () => {
    const result = getVargaPlanetText('marriage', 5, 7);
    expect(result).not.toBeNull();
    expect(result!.en.length).toBeGreaterThan(20);
    expect(result!.hi.length).toBeGreaterThan(10);
  });

  it('returns null for missing domain', () => {
    expect(getVargaPlanetText('nonexistent', 0, 1)).toBeNull();
  });

  it('D9 marriage has all 108 entries (9 planets x 12 houses)', () => {
    let count = 0;
    const marriage = VARGA_PLANET_TEXT.marriage;
    for (let pid = 0; pid <= 8; pid++) {
      for (let h = 1; h <= 12; h++) {
        if (marriage?.[pid]?.[h]) count++;
      }
    }
    expect(count).toBe(108);
  });

  it('each entry has non-empty en and hi', () => {
    const marriage = VARGA_PLANET_TEXT.marriage;
    for (let pid = 0; pid <= 8; pid++) {
      for (let h = 1; h <= 12; h++) {
        const entry = marriage?.[pid]?.[h];
        if (entry) {
          expect(entry.en.length, `planet ${pid} house ${h} en`).toBeGreaterThan(10);
          expect(entry.hi.length, `planet ${pid} house ${h} hi`).toBeGreaterThan(5);
        }
      }
    }
  });

  it('returns null for out-of-range planet or house', () => {
    expect(getVargaPlanetText('marriage', 9, 1)).toBeNull();
    expect(getVargaPlanetText('marriage', 0, 13)).toBeNull();
    expect(getVargaPlanetText('marriage', -1, 1)).toBeNull();
  });

  it('D10 career has all 108 entries', () => {
    let count = 0;
    const career = VARGA_PLANET_TEXT.career;
    for (let pid = 0; pid <= 8; pid++) {
      for (let h = 1; h <= 12; h++) {
        if (career?.[pid]?.[h]) count++;
      }
    }
    expect(count).toBe(108);
  });

  it('D10 career entries are career-contextualized', () => {
    const sun10 = getVargaPlanetText('career', 0, 10);
    expect(sun10).not.toBeNull();
    expect(sun10!.en.toLowerCase()).toMatch(/leader|authority|govern|career|executive/);
  });

  it('D10 career entries have non-empty en and hi', () => {
    const career = VARGA_PLANET_TEXT.career;
    for (let pid = 0; pid <= 8; pid++) {
      for (let h = 1; h <= 12; h++) {
        const entry = career?.[pid]?.[h];
        if (entry) {
          expect(entry.en.length, `career planet ${pid} house ${h} en`).toBeGreaterThan(10);
          expect(entry.hi.length, `career planet ${pid} house ${h} hi`).toBeGreaterThan(5);
        }
      }
    }
  });

  it('key placements contain domain-specific keywords', () => {
    // Venus in 7th should mention spouse/partner/harmony
    const venus7 = getVargaPlanetText('marriage', 5, 7)!;
    expect(venus7.en).toMatch(/spouse|partner|harmon/i);

    // Saturn in 7th should mention delay/durable/mature
    const saturn7 = getVargaPlanetText('marriage', 6, 7)!;
    expect(saturn7.en).toMatch(/delay|durable|mature/i);

    // Rahu in 7th should mention unconventional/foreign
    const rahu7 = getVargaPlanetText('marriage', 7, 7)!;
    expect(rahu7.en).toMatch(/unconventional|foreign|cross-cultural/i);

    // Ketu in 7th should mention past-life/spiritual/detach
    const ketu7 = getVargaPlanetText('marriage', 8, 7)!;
    expect(ketu7.en).toMatch(/past.life|spiritual|detach/i);
  });
});
