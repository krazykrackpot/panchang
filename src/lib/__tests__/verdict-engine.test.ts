import { describe, it, expect } from 'vitest';
import { computeDayVerdict } from '../muhurta/verdict-engine';
import type { PanchangData } from '@/types/panchang';

// ─── Helper: minimal PanchangData factory ───────────────────────────────────
function makePanchang(overrides: Partial<PanchangData> = {}): PanchangData {
  return {
    date: '2026-05-11',
    location: { lat: 46.47, lng: 6.84, name: 'Corseaux' },
    tithi: { number: 1, name: { en: 'Pratipada', hi: 'प्रतिपदा', sa: 'प्रतिपदा' }, paksha: 'shukla', deity: { en: 'Agni', hi: 'अग्नि', sa: 'अग्निः' } },
    nakshatra: { id: 1, name: { en: 'Ashwini', hi: 'अश्विनी', sa: 'अश्विनी' }, deity: { en: 'Ashwini Kumaras', hi: 'अश्विनी कुमार', sa: 'अश्विनौ' }, ruler: 'Ketu', rulerName: { en: 'Ketu', hi: 'केतु', sa: 'केतुः' }, startDeg: 0, endDeg: 13.333, symbol: '🐴', nature: { en: 'Light', hi: 'लघु', sa: 'लघु' } },
    yoga: { number: 1, name: { en: 'Vishkumbha', hi: 'विष्कम्भ', sa: 'विष्कम्भः' }, nature: 'inauspicious', meaning: { en: 'Obstacle', hi: 'बाधा', sa: 'बाधा' } },
    karana: { number: 1, name: { en: 'Bava', hi: 'बव', sa: 'बवः' }, type: 'chara' },
    vara: { day: 0, name: { en: 'Sunday', hi: 'रविवार', sa: 'रविवासरः' }, ruler: { en: 'Sun', hi: 'सूर्य', sa: 'सूर्यः' } },
    sunrise: '06:00',
    sunset: '20:00',
    moonrise: '07:00',
    moonset: '21:00',
    rahuKaal: { start: '16:30', end: '18:00' },
    yamaganda: { start: '12:00', end: '13:30' },
    gulikaKaal: { start: '14:00', end: '15:30' },
    muhurtas: [],
    abhijitMuhurta: { start: '12:00', end: '12:48', available: true },
    planets: [],
    masa: { en: 'Vaishakha', hi: 'वैशाख', sa: 'वैशाखः' },
    samvatsara: { en: 'Shobhana', hi: 'शोभन', sa: 'शोभनः' },
    ritu: { en: 'Grishma', hi: 'ग्रीष्म', sa: 'ग्रीष्मः' },
    ayana: { en: 'Uttarayana', hi: 'उत्तरायण', sa: 'उत्तरायणम्' },
    ...overrides,
  } as PanchangData;
}

describe('verdict-engine: computeDayVerdict', () => {
  // ─── Test 1: Rahu Kaal slots → AVOID ─────────────────────────────────────
  it('marks slots overlapping Rahu Kaal as AVOID with rahu_kaal in hardBlocks', () => {
    const p = makePanchang({
      rahuKaal: { start: '16:30', end: '18:00' },
      // Move Abhijit away from Rahu Kaal
      abhijitMuhurta: { start: '12:00', end: '12:48', available: true },
      // Remove day-level blocks
      yoga: { number: 1, name: { en: 'Vishkumbha', hi: 'विष्कम्भ', sa: 'विष्कम्भः' }, nature: 'inauspicious', meaning: { en: 'Obstacle', hi: 'बाधा', sa: 'बाधा' } },
    });
    const result = computeDayVerdict(p);

    // Slot 16:30-17:00 should be fully inside Rahu Kaal
    const rahuSlot = result.slots.find(s => s.start === '16:30');
    expect(rahuSlot).toBeDefined();
    expect(rahuSlot!.verdict).toBe('avoid');
    expect(rahuSlot!.hardBlocks.some(b => b.id === 'rahu_kaal')).toBe(true);

    // Slot 17:00-17:30 also overlaps
    const rahuSlot2 = result.slots.find(s => s.start === '17:00');
    expect(rahuSlot2).toBeDefined();
    expect(rahuSlot2!.verdict).toBe('avoid');
  });

  // ─── Test 2: Abhijit + Amrit Kalam with no blocks → EXCELLENT or better ──
  it('rates Abhijit + Amrit Kalam with no blocks as excellent or better', () => {
    const p = makePanchang({
      sunrise: '06:00',
      sunset: '20:00',
      // Abhijit at midday
      abhijitMuhurta: { start: '12:48', end: '13:36', available: true },
      // Amrit Kalam overlapping Abhijit
      amritKalamAll: [{ start: '12:30', end: '14:00' }],
      // Move inauspicious periods away
      rahuKaal: { start: '07:00', end: '08:30' },
      yamaganda: { start: '08:30', end: '10:00' },
      gulikaKaal: { start: '10:00', end: '11:30' },
      // No day-level blocks
      yoga: { number: 1, name: { en: 'Vishkumbha', hi: 'विष्कम्भ', sa: 'विष्कम्भः' }, nature: 'inauspicious', meaning: { en: 'x', hi: 'x', sa: 'x' } },
      // Non-Wednesday for full Abhijit strength
      vara: { day: 4, name: { en: 'Thursday', hi: 'गुरुवार', sa: 'गुरुवासरः' }, ruler: { en: 'Jupiter', hi: 'गुरु', sa: 'गुरुः' } },
    });
    const result = computeDayVerdict(p);

    // Slot 13:00-13:30 should overlap both Abhijit (12:48-13:36) and Amrit Kalam (12:30-14:00)
    const slot = result.slots.find(s => s.start === '13:00');
    expect(slot).toBeDefined();
    // Abhijit (88) + Amrit Kalam (75) = 2 positives, max <90 → very_good
    expect(['very_good', 'excellent', 'exceptional']).toContain(slot!.verdict);
    expect(slot!.positives.some(p => p.id === 'abhijit')).toBe(true);
    expect(slot!.positives.some(p => p.id === 'amrit_kalam')).toBe(true);
  });

  // ─── Test 3: Guru Pushya Yoga from specialYogas ──────────────────────────
  it('detects Guru Pushya Yoga from specialYogas when Thursday + Pushya', () => {
    const p = makePanchang({
      vara: { day: 4, name: { en: 'Thursday', hi: 'गुरुवार', sa: 'गुरुवासरः' }, ruler: { en: 'Jupiter', hi: 'गुरु', sa: 'गुरुः' } },
      nakshatra: { id: 8, name: { en: 'Pushya', hi: 'पुष्य', sa: 'पुष्यः' }, deity: { en: 'Brihaspati', hi: 'बृहस्पति', sa: 'बृहस्पतिः' }, ruler: 'Saturn', rulerName: { en: 'Saturn', hi: 'शनि', sa: 'शनिः' }, startDeg: 93.333, endDeg: 106.666, symbol: '🌸', nature: { en: 'Light', hi: 'लघु', sa: 'लघु' } },
      specialYogas: [
        { name: { en: 'Guru Pushya Yoga', hi: 'गुरु पुष्य योग', sa: 'x' }, isActive: true, description: { en: 'Most auspicious', hi: 'सर्वश्रेष्ठ', sa: 'x' } },
      ],
      // Move blocks away
      rahuKaal: { start: '07:00', end: '08:30' },
      yamaganda: { start: '08:30', end: '10:00' },
      gulikaKaal: { start: '10:00', end: '11:30' },
      abhijitMuhurta: { start: '12:48', end: '13:36', available: true },
    });
    const result = computeDayVerdict(p);

    // Day-level yoga should appear in dayLevelYogas
    expect(result.dayLevelYogas.some(y => y.id === 'guru_pushya')).toBe(true);

    // A clean slot (no blocks) should have guru_pushya in positives and rate high
    const cleanSlot = result.slots.find(s => s.start === '14:00');
    expect(cleanSlot).toBeDefined();
    expect(cleanSlot!.positives.some(p => p.id === 'guru_pushya')).toBe(true);
    // Guru Pushya alone (strength 100) → at least very_good
    expect(['very_good', 'excellent', 'exceptional']).toContain(cleanSlot!.verdict);
  });

  // ─── Test 4: Abhijit overlapping Rahu Kaal → CAUTION ─────────────────────
  it('rates Abhijit overlapping Rahu Kaal as caution with conflicts populated', () => {
    const p = makePanchang({
      // Contrived: Abhijit and Rahu Kaal overlap at 12:00-12:48
      abhijitMuhurta: { start: '12:00', end: '12:48', available: true },
      rahuKaal: { start: '12:00', end: '13:30' },
      yamaganda: { start: '08:30', end: '10:00' },
      gulikaKaal: { start: '10:00', end: '11:30' },
      vara: { day: 1, name: { en: 'Monday', hi: 'सोमवार', sa: 'सोमवासरः' }, ruler: { en: 'Moon', hi: 'चंद्रमा', sa: 'चन्द्रः' } },
    });
    const result = computeDayVerdict(p);

    // Slot 12:00-12:30 overlaps both Abhijit and Rahu Kaal
    const slot = result.slots.find(s => s.start === '12:00');
    expect(slot).toBeDefined();
    expect(slot!.verdict).toBe('caution');
    expect(slot!.conflicts.length).toBeGreaterThan(0);
    expect(slot!.conflicts[0].positive).toBe('abhijit');
    expect(slot!.conflicts[0].negative).toBe('rahu_kaal');
  });

  // ─── Test 5: Vishti → AVOID even with Amrit Kalam; Abhijit + Vishti = CAUTION
  it('marks Vishti as AVOID even when Amrit Kalam is active', () => {
    const p = makePanchang({
      bhadraAll: [{ start: '14:00', end: '16:00' }],
      amritKalamAll: [{ start: '14:00', end: '16:00' }],
      // Move Abhijit away
      abhijitMuhurta: { start: '12:00', end: '12:48', available: true },
      rahuKaal: { start: '07:00', end: '08:30' },
      yamaganda: { start: '08:30', end: '10:00' },
      gulikaKaal: { start: '10:00', end: '11:30' },
    });
    const result = computeDayVerdict(p);

    // 14:30-15:00 has Vishti but no Abhijit → AVOID
    const vishtiSlot = result.slots.find(s => s.start === '14:30');
    expect(vishtiSlot).toBeDefined();
    expect(vishtiSlot!.verdict).toBe('avoid');
    expect(vishtiSlot!.hardBlocks.some(b => b.id === 'vishti')).toBe(true);
  });

  it('marks Vishti + Abhijit overlap as caution', () => {
    const p = makePanchang({
      bhadraAll: [{ start: '12:00', end: '14:00' }],
      abhijitMuhurta: { start: '12:00', end: '12:48', available: true },
      rahuKaal: { start: '07:00', end: '08:30' },
      yamaganda: { start: '08:30', end: '10:00' },
      gulikaKaal: { start: '10:00', end: '11:30' },
    });
    const result = computeDayVerdict(p);

    const slot = result.slots.find(s => s.start === '12:00');
    expect(slot).toBeDefined();
    expect(slot!.verdict).toBe('caution');
    expect(slot!.conflicts.length).toBeGreaterThan(0);
  });

  // ─── Test 6: Varjyam → CAUTION ───────────────────────────────────────────
  it('marks Varjyam slots as caution (conditional, not hard block)', () => {
    const p = makePanchang({
      varjyamAll: [{ start: '15:00', end: '16:30' }],
      rahuKaal: { start: '07:00', end: '08:30' },
      yamaganda: { start: '08:30', end: '10:00' },
      gulikaKaal: { start: '10:00', end: '11:30' },
      abhijitMuhurta: { start: '12:00', end: '12:48', available: true },
    });
    const result = computeDayVerdict(p);

    const slot = result.slots.find(s => s.start === '15:00');
    expect(slot).toBeDefined();
    expect(slot!.verdict).toBe('caution');
    expect(slot!.conditionalBlocks.some(b => b.id === 'varjyam')).toBe(true);
    // Should NOT be in hardBlocks
    expect(slot!.hardBlocks.length).toBe(0);
  });

  // ─── Test 7: bestWindow is the highest-rated slot ─────────────────────────
  it('sets bestWindow to the highest-rated non-avoid/non-caution slot', () => {
    const p = makePanchang({
      abhijitMuhurta: { start: '12:48', end: '13:36', available: true },
      amritKalamAll: [{ start: '12:30', end: '14:00' }],
      rahuKaal: { start: '07:00', end: '08:30' },
      yamaganda: { start: '08:30', end: '10:00' },
      gulikaKaal: { start: '10:00', end: '11:30' },
      vara: { day: 4, name: { en: 'Thursday', hi: 'गुरुवार', sa: 'गुरुवासरः' }, ruler: { en: 'Jupiter', hi: 'गुरु', sa: 'गुरुः' } },
    });
    const result = computeDayVerdict(p);

    expect(result.bestWindow).not.toBeNull();
    // bestWindow should not be avoid or caution
    expect(['good', 'very_good', 'excellent', 'exceptional']).toContain(result.bestWindow!.verdict);

    // No slot rated higher than bestWindow should exist
    const ratingOrder: Record<string, number> = { avoid: 0, caution: 1, good: 2, very_good: 3, excellent: 4, exceptional: 5 };
    const bestRank = ratingOrder[result.bestWindow!.verdict];
    for (const slot of result.slots) {
      expect(ratingOrder[slot.verdict]).toBeLessThanOrEqual(bestRank);
    }
  });

  // ─── Test 8: Choghadiya shown as separate indicator, doesn't affect verdict
  it('shows choghadiya but does not let it affect verdict (Labh during Rahu Kaal still AVOID)', () => {
    const p = makePanchang({
      rahuKaal: { start: '16:30', end: '18:00' },
      abhijitMuhurta: { start: '12:00', end: '12:48', available: true },
      choghadiya: [
        {
          name: { en: 'Labh', hi: 'लाभ', sa: 'लाभः' },
          type: 'labh' as const,
          nature: 'auspicious' as const,
          startTime: '16:30',
          endTime: '18:00',
          period: 'day' as const,
        },
      ],
    });
    const result = computeDayVerdict(p);

    // Slot during Rahu Kaal with auspicious Labh choghadiya should still be AVOID
    const slot = result.slots.find(s => s.start === '16:30');
    expect(slot).toBeDefined();
    expect(slot!.verdict).toBe('avoid');
    // But choghadiya should still be attached
    expect(slot!.choghadiya).toBeDefined();
    expect(slot!.choghadiya!.type).toBe('labh');
  });

  // ─── Test 9: Slots cover sunrise to sunset in 30-min increments ──────────
  it('generates slots from sunrise to sunset in 30-minute increments', () => {
    const p = makePanchang({
      sunrise: '06:00',
      sunset: '20:00',
    });
    const result = computeDayVerdict(p);

    // 06:00 to 20:00 = 14 hours = 28 half-hour slots
    expect(result.slots.length).toBe(28);
    expect(result.slots[0].start).toBe('06:00');
    expect(result.slots[0].end).toBe('06:30');
    expect(result.slots[result.slots.length - 1].start).toBe('19:30');
    expect(result.slots[result.slots.length - 1].end).toBe('20:00');

    // Verify sequential
    for (let i = 1; i < result.slots.length; i++) {
      expect(result.slots[i].start).toBe(result.slots[i - 1].end);
    }
  });

  // ─── Test: Vyatipata (yoga #17) blocks ALL slots ─────────────────────────
  it('marks all slots as AVOID when Vyatipata yoga is active (day-level block)', () => {
    const p = makePanchang({
      yoga: { number: 17, name: { en: 'Vyatipata', hi: 'व्यतीपात', sa: 'व्यतीपातः' }, nature: 'inauspicious', meaning: { en: 'Calamity', hi: 'विपत्ति', sa: 'विपत्तिः' } },
      // Even with Abhijit, the slot should be caution (not avoid) due to conflict resolution
      abhijitMuhurta: { start: '12:00', end: '12:48', available: true },
      rahuKaal: { start: '07:00', end: '08:30' },
      yamaganda: { start: '08:30', end: '10:00' },
      gulikaKaal: { start: '10:00', end: '11:30' },
    });
    const result = computeDayVerdict(p);

    expect(result.hasDayLevelDosha).toBe(true);

    // Non-Abhijit slots should all be AVOID
    const nonAbhijitSlots = result.slots.filter(
      s => !s.positives.some(p => p.id === 'abhijit')
    );
    for (const slot of nonAbhijitSlots) {
      expect(slot.verdict).toBe('avoid');
    }

    // Abhijit slots should be caution (conflict resolution)
    const abhijitSlots = result.slots.filter(
      s => s.positives.some(p => p.id === 'abhijit')
    );
    for (const slot of abhijitSlots) {
      expect(slot.verdict).toBe('caution');
    }
  });

  // ─── Test: Vaidhriti (yoga #27) day-level block ──────────────────────────
  it('marks Vaidhriti (yoga #27) as a day-level hard block', () => {
    const p = makePanchang({
      yoga: { number: 27, name: { en: 'Vaidhriti', hi: 'वैधृति', sa: 'वैधृतिः' }, nature: 'inauspicious', meaning: { en: 'Harsh', hi: 'कठोर', sa: 'कठोरः' } },
      abhijitMuhurta: { start: '12:00', end: '12:48', available: true },
      rahuKaal: { start: '07:00', end: '08:30' },
      yamaganda: { start: '08:30', end: '10:00' },
      gulikaKaal: { start: '10:00', end: '11:30' },
    });
    const result = computeDayVerdict(p);

    expect(result.hasDayLevelDosha).toBe(true);
    expect(result.dayLevelYogas).toBeDefined();
  });

  // ─── Test: Abhijit on Wednesday is weakened ───────────────────────────────
  it('treats Abhijit on Wednesday as conditional (not full positive)', () => {
    const p = makePanchang({
      vara: { day: 3, name: { en: 'Wednesday', hi: 'बुधवार', sa: 'बुधवासरः' }, ruler: { en: 'Mercury', hi: 'बुध', sa: 'बुधः' } },
      abhijitMuhurta: { start: '12:48', end: '13:36', available: true },
      rahuKaal: { start: '07:00', end: '08:30' },
      yamaganda: { start: '08:30', end: '10:00' },
      gulikaKaal: { start: '10:00', end: '11:30' },
    });
    const result = computeDayVerdict(p);

    // The Abhijit slot should not rate as high as on a non-Wednesday
    const slot = result.slots.find(s => s.start === '13:00');
    expect(slot).toBeDefined();
    // On Wednesday, Abhijit alone should yield caution or good, not very_good
    expect(['caution', 'good']).toContain(slot!.verdict);
  });

  // ─── Test: avoidWindows populated ─────────────────────────────────────────
  it('populates avoidWindows with all AVOID-rated slots', () => {
    const p = makePanchang({
      rahuKaal: { start: '16:30', end: '18:00' },
      abhijitMuhurta: { start: '12:00', end: '12:48', available: true },
    });
    const result = computeDayVerdict(p);

    expect(result.avoidWindows.length).toBeGreaterThan(0);
    for (const slot of result.avoidWindows) {
      expect(slot.verdict).toBe('avoid');
    }
  });

  // ─── Test: amritSiddhiYoga boolean detected ───────────────────────────────
  it('detects amritSiddhiYoga from the boolean field on PanchangData', () => {
    const p = makePanchang({
      amritSiddhiYoga: true,
      rahuKaal: { start: '07:00', end: '08:30' },
      yamaganda: { start: '08:30', end: '10:00' },
      gulikaKaal: { start: '10:00', end: '11:30' },
      abhijitMuhurta: { start: '12:00', end: '12:48', available: true },
    });
    const result = computeDayVerdict(p);

    // Should appear as a day-level positive
    expect(result.dayLevelYogas.some(y => y.id === 'amrit_siddhi')).toBe(true);

    // Any clean slot should have it
    const cleanSlot = result.slots.find(s => s.start === '14:00');
    expect(cleanSlot).toBeDefined();
    expect(cleanSlot!.positives.some(p => p.id === 'amrit_siddhi')).toBe(true);
  });

  // ─── Test: sarvarthaSiddhi boolean detected ───────────────────────────────
  it('detects sarvarthaSiddhi from the boolean field on PanchangData', () => {
    const p = makePanchang({
      sarvarthaSiddhi: true,
      rahuKaal: { start: '07:00', end: '08:30' },
      yamaganda: { start: '08:30', end: '10:00' },
      gulikaKaal: { start: '10:00', end: '11:30' },
      abhijitMuhurta: { start: '12:00', end: '12:48', available: true },
    });
    const result = computeDayVerdict(p);

    expect(result.dayLevelYogas.some(y => y.id === 'sarvartha_siddhi')).toBe(true);
  });

  // ─── Test: DurMuhurtam → CAUTION ──────────────────────────────────────────
  it('marks DurMuhurtam slots as caution', () => {
    const p = makePanchang({
      durMuhurtam: [{ start: '08:00', end: '08:48' }],
      rahuKaal: { start: '16:30', end: '18:00' },
      yamaganda: { start: '14:00', end: '15:30' },
      gulikaKaal: { start: '10:00', end: '11:30' },
      abhijitMuhurta: { start: '12:00', end: '12:48', available: true },
    });
    const result = computeDayVerdict(p);

    const slot = result.slots.find(s => s.start === '08:00');
    expect(slot).toBeDefined();
    expect(slot!.verdict).toBe('caution');
    expect(slot!.conditionalBlocks.some(b => b.id === 'durmuhurta')).toBe(true);
  });

  // ─── Test: Supreme combo (P1/P2 + P6 + no blocks) → EXCEPTIONAL ──────────
  it('rates supreme combo (Guru Pushya + Amrit Kalam + Abhijit + no blocks) as exceptional', () => {
    const p = makePanchang({
      vara: { day: 4, name: { en: 'Thursday', hi: 'गुरुवार', sa: 'गुरुवासरः' }, ruler: { en: 'Jupiter', hi: 'गुरु', sa: 'गुरुः' } },
      specialYogas: [
        { name: { en: 'Guru Pushya Yoga', hi: 'गुरु पुष्य योग', sa: 'x' }, isActive: true, description: { en: 'Most auspicious', hi: 'सर्वश्रेष्ठ', sa: 'x' } },
      ],
      abhijitMuhurta: { start: '12:48', end: '13:36', available: true },
      amritKalamAll: [{ start: '12:30', end: '14:00' }],
      rahuKaal: { start: '07:00', end: '08:30' },
      yamaganda: { start: '08:30', end: '10:00' },
      gulikaKaal: { start: '10:00', end: '11:30' },
    });
    const result = computeDayVerdict(p);

    // 13:00-13:30 has Guru Pushya (day) + Abhijit + Amrit Kalam
    const slot = result.slots.find(s => s.start === '13:00');
    expect(slot).toBeDefined();
    expect(slot!.verdict).toBe('exceptional');
  });

  // ─── Test: secondBest is populated and different from bestWindow ───────────
  it('sets secondBest different from bestWindow when multiple good slots exist', () => {
    const p = makePanchang({
      abhijitMuhurta: { start: '12:48', end: '13:36', available: true },
      amritKalamAll: [{ start: '12:30', end: '14:00' }],
      rahuKaal: { start: '07:00', end: '08:30' },
      yamaganda: { start: '08:30', end: '10:00' },
      gulikaKaal: { start: '10:00', end: '11:30' },
      vara: { day: 4, name: { en: 'Thursday', hi: 'गुरुवार', sa: 'गुरुवासरः' }, ruler: { en: 'Jupiter', hi: 'गुरु', sa: 'गुरुः' } },
    });
    const result = computeDayVerdict(p);

    expect(result.bestWindow).not.toBeNull();
    expect(result.secondBest).not.toBeNull();
    expect(result.secondBest!.start).not.toBe(result.bestWindow!.start);
  });

  // ─── Test: Visha Ghatika → CAUTION ────────────────────────────────────────
  it('marks Visha Ghatika as conditional block (caution)', () => {
    const p = makePanchang({
      vishaGhatika: { start: '15:00', end: '15:48' },
      rahuKaal: { start: '07:00', end: '08:30' },
      yamaganda: { start: '08:30', end: '10:00' },
      gulikaKaal: { start: '10:00', end: '11:30' },
      abhijitMuhurta: { start: '12:00', end: '12:48', available: true },
    });
    const result = computeDayVerdict(p);

    const slot = result.slots.find(s => s.start === '15:00');
    expect(slot).toBeDefined();
    expect(slot!.verdict).toBe('caution');
    expect(slot!.conditionalBlocks.some(b => b.id === 'visha_ghatika')).toBe(true);
  });
});
