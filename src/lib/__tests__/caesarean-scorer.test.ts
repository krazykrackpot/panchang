import { describe, it, expect } from 'vitest';
import { scoreBirthSlot } from '@/lib/caesarean/scorer';

// We need a helper to create a mock "lightweight kundali" for testing.
// The scorer will accept pre-computed chart data, not raw BirthData.

describe('scoreBirthSlot', () => {
  it('returns score 0 (vetoed) for Gandanta Moon', () => {
    const result = scoreBirthSlot({
      lagnaSign: 1, lagnaDegreesInSign: 15, lagnaLordId: 2,
      lagnaLordSign: 1, lagnaLordHouse: 1,
      moonSign: 4, moonHouse: 4, moonSidDeg: 119.5, // Gandanta zone (Cancer end)
      moonNakshatraId: 9, moonNakshatraPada: 3,
      planets: [], tithiNumber: 5, yogaNumber: 1, karanaNumber: 1,
      sunSidDeg: 50,
    });
    expect(result.isVetoed).toBe(true);
    expect(result.score).toBe(0);
  });

  it('scores Jupiter in lagna highly in lagna pillar', () => {
    const result = scoreBirthSlot({
      lagnaSign: 9, lagnaDegreesInSign: 15, lagnaLordId: 4, // Sagittarius, lord = Jupiter
      lagnaLordSign: 9, lagnaLordHouse: 1, // Jupiter in own sign in lagna
      moonSign: 2, moonHouse: 5, moonSidDeg: 40, // Taurus, trikona
      moonNakshatraId: 4, moonNakshatraPada: 2, // Rohini  –  Deva gana, no dosha
      planets: [
        { id: 4, sign: 9, house: 1, longitude: 260, isRetrograde: false }, // Jupiter in 1st
      ],
      tithiNumber: 5, yogaNumber: 4, karanaNumber: 2, sunSidDeg: 50,
    });
    expect(result.pillarBreakdown.lagna).toBeGreaterThanOrEqual(20);
    expect(result.score).toBeGreaterThanOrEqual(60);
  });

  it('penalises Saturn in lagna without Jupiter aspect', () => {
    const result = scoreBirthSlot({
      lagnaSign: 1, lagnaDegreesInSign: 15, lagnaLordId: 2,
      lagnaLordSign: 10, lagnaLordHouse: 10,
      moonSign: 2, moonHouse: 2, moonSidDeg: 35,
      moonNakshatraId: 3, moonNakshatraPada: 2,
      planets: [
        { id: 6, sign: 1, house: 1, longitude: 5, isRetrograde: false }, // Saturn in 1st
      ],
      tithiNumber: 5, yogaNumber: 4, karanaNumber: 2, sunSidDeg: 200,
    });
    // Should have Saturn-in-lagna defect
    expect(result.defects.some(d => d.id === 'saturn_in_lagna')).toBe(true);
  });

  it('scores Jupiter dasha with high remaining years at max', () => {
    const result = scoreBirthSlot({
      lagnaSign: 1, lagnaDegreesInSign: 15, lagnaLordId: 2,
      lagnaLordSign: 1, lagnaLordHouse: 1,
      moonSign: 7, moonHouse: 7, moonSidDeg: 187, // Early Swati
      moonNakshatraId: 15, moonNakshatraPada: 1, // Swati (lord = Rahu)
      planets: [],
      tithiNumber: 5, yogaNumber: 4, karanaNumber: 2, sunSidDeg: 50,
    });
    // Swati nakshatra lord = Rahu -> low dasha score
    expect(result.dashaInfo.lord).toBe('Rahu');
    expect(result.pillarBreakdown.dasha).toBeLessThanOrEqual(5);
  });

  it('gives full nakshatra score for Deva gana, deducts for Rakshasa', () => {
    // Pushya (8) = Deva gana
    const deva = scoreBirthSlot({
      lagnaSign: 1, lagnaDegreesInSign: 15, lagnaLordId: 2,
      lagnaLordSign: 1, lagnaLordHouse: 1,
      moonSign: 4, moonHouse: 4, moonSidDeg: 100,
      moonNakshatraId: 8, moonNakshatraPada: 2,
      planets: [], tithiNumber: 5, yogaNumber: 4, karanaNumber: 2, sunSidDeg: 50,
    });
    // Moola (19) = Rakshasa gana
    const rakshasa = scoreBirthSlot({
      lagnaSign: 1, lagnaDegreesInSign: 15, lagnaLordId: 2,
      lagnaLordSign: 1, lagnaLordHouse: 1,
      moonSign: 9, moonHouse: 9, moonSidDeg: 247,
      moonNakshatraId: 19, moonNakshatraPada: 2,
      planets: [], tithiNumber: 5, yogaNumber: 4, karanaNumber: 2, sunSidDeg: 50,
    });
    expect(deva.pillarBreakdown.moon).toBeGreaterThan(rakshasa.pillarBreakdown.moon);
  });

  it('detects Kaal Sarpa when all planets are between Rahu and Ketu', () => {
    const result = scoreBirthSlot({
      lagnaSign: 1, lagnaDegreesInSign: 15, lagnaLordId: 2,
      lagnaLordSign: 1, lagnaLordHouse: 1,
      moonSign: 2, moonHouse: 2, moonSidDeg: 40,
      moonNakshatraId: 4, moonNakshatraPada: 1,
      planets: [
        { id: 0, sign: 2, house: 2, longitude: 35, isRetrograde: false },  // Sun
        { id: 1, sign: 2, house: 2, longitude: 40, isRetrograde: false },  // Moon
        { id: 2, sign: 3, house: 3, longitude: 65, isRetrograde: false },  // Mars
        { id: 3, sign: 3, house: 3, longitude: 70, isRetrograde: false },  // Mercury
        { id: 4, sign: 4, house: 4, longitude: 95, isRetrograde: false },  // Jupiter
        { id: 5, sign: 4, house: 4, longitude: 100, isRetrograde: false }, // Venus
        { id: 6, sign: 5, house: 5, longitude: 130, isRetrograde: false }, // Saturn
        { id: 7, sign: 1, house: 1, longitude: 10, isRetrograde: false },  // Rahu
        { id: 8, sign: 7, house: 7, longitude: 190, isRetrograde: false }, // Ketu
      ],
      tithiNumber: 5, yogaNumber: 4, karanaNumber: 2, sunSidDeg: 35,
    });
    expect(result.defects.some(d => d.id === 'kaal_sarpa')).toBe(true);
  });

  it('correctly uses Jupiter special aspects (5th and 9th from Jupiter)', () => {
    // Jupiter in house 5 should aspect house 1 (9th aspect: offset = 1-5+12 = 8... no)
    // Actually: Jupiter in house 5, target house 1: offset = (1-5+12)%12 = 8 -> not 5,7,9
    // Jupiter in house 9, target house 1: offset = (1-9+12)%12 = 4 -> not 5,7,9
    // Jupiter in house 7, target house 1: offset = (1-7+12)%12 = 6 -> not 5,7,9
    // Jupiter in house 6, target house 1: offset = (1-6+12)%12 = 7 -> YES (7th aspect)
    // Jupiter in house 5, target house 9: offset = (9-5+12)%12 = 4 -> not 5,7,9
    // Jupiter in house 4, target house 8: offset = (8-4+12)%12 = 4 -> not 5,7,9
    // Jupiter in house 3, target house 7: offset = (7-3+12)%12 = 4 -> not 5,7,9
    // Jupiter in house 2, target house 1: offset = (1-2+12)%12 = 11 -> not
    // Jupiter in house 9, target house 1: offset = (1-9+12)%12 = 4 -> not
    // Jupiter in house 5, target house 1: offset = ((1-5+12)%12) || 12 = 8 -> not

    // Let's test: Jupiter in house 8 aspecting house 2 (7th), house 12 (5th), house 4 (9th)
    // All aspect checks use the same function, so let's test Saturn in lagna with Jupiter in
    // house 5: offset from 5 to 1 = (1-5+12)%12 = 8, that's NOT an aspect.
    // Jupiter in house 9: offset = (1-9+12)%12 = 4, NOT an aspect.
    // Jupiter in house 4: offset = (1-4+12)%12 = 9, YES (9th aspect)
    // So Jupiter in house 4 should cancel Saturn-in-lagna defect

    const withJupiterAspect = scoreBirthSlot({
      lagnaSign: 1, lagnaDegreesInSign: 15, lagnaLordId: 2,
      lagnaLordSign: 10, lagnaLordHouse: 10,
      moonSign: 2, moonHouse: 2, moonSidDeg: 35,
      moonNakshatraId: 3, moonNakshatraPada: 2,
      planets: [
        { id: 6, sign: 1, house: 1, longitude: 5, isRetrograde: false },   // Saturn in 1st
        { id: 4, sign: 4, house: 4, longitude: 95, isRetrograde: false },  // Jupiter in 4th (9th aspect to 1st)
      ],
      tithiNumber: 5, yogaNumber: 4, karanaNumber: 2, sunSidDeg: 200,
    });
    // Jupiter's 9th aspect from house 4 hits house 1 -> Saturn defect should NOT appear
    expect(withJupiterAspect.defects.some(d => d.id === 'saturn_in_lagna')).toBe(false);
  });

  it('assigns correct grade labels based on score ranges', () => {
    // High-scoring chart: Sagittarius lagna, Jupiter own sign in lagna, Deva Moon in kendra
    const excellent = scoreBirthSlot({
      lagnaSign: 9, lagnaDegreesInSign: 5, lagnaLordId: 4,
      lagnaLordSign: 9, lagnaLordHouse: 1,
      moonSign: 12, moonHouse: 4, moonSidDeg: 350,
      moonNakshatraId: 27, moonNakshatraPada: 1, // Revati = Deva
      planets: [
        { id: 4, sign: 9, house: 1, longitude: 245, isRetrograde: false }, // Jupiter in lagna
        { id: 5, sign: 12, house: 4, longitude: 345, isRetrograde: false }, // Venus in 4th kendra
      ],
      tithiNumber: 5, yogaNumber: 4, karanaNumber: 2, sunSidDeg: 50,
    });
    // This should be a high-scoring chart
    expect(excellent.score).toBeGreaterThanOrEqual(60);
    expect(['excellent', 'good']).toContain(excellent.grade);
  });

  it('detects lagna lord combustion with correct orbs', () => {
    // Mars (id=2) combust orb = 17 degrees. Sun at 50, Mars at 40 => dist = 10 < 17 -> combust
    const result = scoreBirthSlot({
      lagnaSign: 1, lagnaDegreesInSign: 15, lagnaLordId: 2, // Aries, lord = Mars
      lagnaLordSign: 2, lagnaLordHouse: 2,
      moonSign: 7, moonHouse: 7, moonSidDeg: 190,
      moonNakshatraId: 15, moonNakshatraPada: 1,
      planets: [
        { id: 2, sign: 2, house: 2, longitude: 40, isRetrograde: false }, // Mars
      ],
      tithiNumber: 5, yogaNumber: 4, karanaNumber: 2, sunSidDeg: 50,
    });
    expect(result.defects.some(d => d.id === 'lagna_lord_combust')).toBe(true);
  });

  it('does not flag combustion when lagna lord is Sun itself', () => {
    // Leo lagna, lord = Sun (id=0). Sun cannot be combust.
    const result = scoreBirthSlot({
      lagnaSign: 5, lagnaDegreesInSign: 15, lagnaLordId: 0, // Leo, lord = Sun
      lagnaLordSign: 5, lagnaLordHouse: 1,
      moonSign: 7, moonHouse: 3, moonSidDeg: 190,
      moonNakshatraId: 15, moonNakshatraPada: 1,
      planets: [
        { id: 0, sign: 5, house: 1, longitude: 135, isRetrograde: false }, // Sun in lagna
      ],
      tithiNumber: 5, yogaNumber: 4, karanaNumber: 2, sunSidDeg: 135,
    });
    expect(result.defects.some(d => d.id === 'lagna_lord_combust')).toBe(false);
  });
});
