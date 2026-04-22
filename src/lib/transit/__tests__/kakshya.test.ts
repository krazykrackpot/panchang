import { describe, it, expect } from 'vitest';
import { getKakshyaPosition, getKakshyaBavScore } from '../kakshya';

describe('getKakshyaPosition', () => {
  it('planet at 0° Aries → kakshya 0 (Saturn), range 0-3.75', () => {
    const pos = getKakshyaPosition(0);
    expect(pos.sign).toBe(1);
    expect(pos.kakshyaIndex).toBe(0);
    expect(pos.kakshyaLord).toBe(6); // Saturn
    expect(pos.kakshyaLordName).toBe('Saturn');
    expect(pos.degreeRange.start).toBe(0);
    expect(pos.degreeRange.end).toBe(3.75);
  });

  it('planet at 15° Aries → kakshya 4 (Venus), range 15-18.75', () => {
    const pos = getKakshyaPosition(15);
    expect(pos.sign).toBe(1);
    expect(pos.kakshyaIndex).toBe(4);
    expect(pos.kakshyaLord).toBe(5); // Venus
    expect(pos.kakshyaLordName).toBe('Venus');
    expect(pos.degreeRange.start).toBe(15);
    expect(pos.degreeRange.end).toBe(18.75);
  });

  it('planet at 29° Aries → kakshya 7 (Lagna)', () => {
    const pos = getKakshyaPosition(29);
    expect(pos.sign).toBe(1);
    expect(pos.kakshyaIndex).toBe(7);
    expect(pos.kakshyaLord).toBe(99); // Lagna
    expect(pos.kakshyaLordName).toBe('Lagna');
    expect(pos.degreeRange.start).toBe(26.25);
    expect(pos.degreeRange.end).toBe(30);
  });

  it('planet at 30° → first kakshya of Taurus (sign 2)', () => {
    const pos = getKakshyaPosition(30);
    expect(pos.sign).toBe(2);
    expect(pos.kakshyaIndex).toBe(0);
    expect(pos.kakshyaLord).toBe(6); // Saturn
  });

  it('planet at 359.9° → last kakshya of Pisces (sign 12)', () => {
    const pos = getKakshyaPosition(359.9);
    expect(pos.sign).toBe(12);
    expect(pos.kakshyaIndex).toBe(7);
    expect(pos.kakshyaLord).toBe(99); // Lagna
  });

  it('handles negative longitude (normalization)', () => {
    // -30° should normalize to 330° → Pisces (sign 12), 0° in sign → kakshya 0
    const pos = getKakshyaPosition(-30);
    expect(pos.sign).toBe(12);
    expect(pos.kakshyaIndex).toBe(0);
  });

  it('each kakshya spans exactly 3.75°', () => {
    for (let k = 0; k < 8; k++) {
      const degInSign = k * 3.75 + 0.01; // slightly into each kakshya
      const pos = getKakshyaPosition(degInSign);
      expect(pos.kakshyaIndex).toBe(k);
    }
  });
});

describe('getKakshyaBavScore', () => {
  // Dummy 7×12 BAV table — planet rows 0-6, sign columns 0-11
  const bpiTable: number[][] = [
    [3, 4, 5, 2, 1, 6, 3, 4, 2, 5, 1, 3], // Sun (0)
    [4, 2, 3, 5, 6, 1, 4, 3, 5, 2, 6, 1], // Moon (1)
    [5, 3, 2, 4, 1, 6, 5, 2, 4, 3, 1, 6], // Mars (2)
    [2, 5, 4, 3, 6, 1, 2, 5, 3, 4, 6, 1], // Mercury (3)
    [6, 1, 3, 4, 5, 2, 6, 1, 4, 3, 5, 2], // Jupiter (4)
    [1, 6, 2, 5, 3, 4, 1, 6, 2, 5, 3, 4], // Venus (5)
    [4, 3, 6, 1, 2, 5, 4, 3, 1, 6, 2, 5], // Saturn (6)
  ];

  const savTable = [28, 30, 25, 32, 27, 35, 29, 31, 26, 33, 28, 34];

  it('uses correct planet row from bpiTable when kakshya lord is a planet', () => {
    // 0° Aries → kakshya lord = Saturn(6), sign = Aries (index 0)
    // Expected BAV = bpiTable[6][0] = 4
    const result = getKakshyaBavScore(0, bpiTable, savTable);
    expect(result.kakshya.kakshyaLord).toBe(6);
    expect(result.kakshya.sign).toBe(1);
    expect(result.bavScore).toBe(4);
  });

  it('uses SAV score when kakshya lord is Lagna', () => {
    // 29° Aries → kakshya lord = Lagna(99), sign = Aries (index 0)
    // Expected BAV = savTable[0] = 28
    const result = getKakshyaBavScore(29, bpiTable, savTable);
    expect(result.kakshya.kakshyaLord).toBe(99);
    expect(result.bavScore).toBe(28);
  });

  it('uses Venus row for kakshya 4 in Aries', () => {
    // 15° Aries → kakshya lord = Venus(5), sign = Aries (index 0)
    // Expected BAV = bpiTable[5][0] = 1
    const result = getKakshyaBavScore(15, bpiTable, savTable);
    expect(result.kakshya.kakshyaLord).toBe(5);
    expect(result.bavScore).toBe(1);
  });

  it('uses correct sign column for non-Aries sign', () => {
    // 45° → Taurus (sign 2, index 1), degree 15 in sign → kakshya 4 (Venus=5)
    // Expected BAV = bpiTable[5][1] = 6
    const result = getKakshyaBavScore(45, bpiTable, savTable);
    expect(result.kakshya.sign).toBe(2);
    expect(result.kakshya.kakshyaLord).toBe(5);
    expect(result.bavScore).toBe(6);
  });
});
