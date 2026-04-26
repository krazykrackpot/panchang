import { describe, it, expect } from 'vitest';
import { computeHoraTable, HORA_PLANET_ACTIVITIES } from '../panchang/hora-engine';

describe('computeHoraTable', () => {
  // Sunday (varaDay=0) starts with Sun
  it('returns 24 hora slots', () => {
    const slots = computeHoraTable('06:00', '18:00', '06:00', 0);
    expect(slots).toHaveLength(24);
  });

  it('first slot on Sunday is Sun hora', () => {
    const slots = computeHoraTable('06:00', '18:00', '06:00', 0);
    expect(slots[0].planetId).toBe(0); // Sun
    expect(slots[0].isDay).toBe(true);
  });

  it('first slot on Monday is Moon hora', () => {
    const slots = computeHoraTable('06:00', '18:00', '06:00', 1);
    expect(slots[0].planetId).toBe(1); // Moon
  });

  it('first slot on Saturday is Saturn hora', () => {
    const slots = computeHoraTable('06:00', '18:00', '06:00', 6);
    expect(slots[0].planetId).toBe(6); // Saturn
  });

  it('day horas have correct duration (12 equal parts)', () => {
    const slots = computeHoraTable('06:00', '18:00', '06:00', 0);
    const daySlots = slots.filter(s => s.isDay);
    expect(daySlots).toHaveLength(12);
    // 12 hours / 12 = 1 hour each = 60 minutes
    expect(daySlots[0].startTime).toBe('06:00');
    expect(daySlots[0].endTime).toBe('07:00');
    expect(daySlots[11].endTime).toBe('18:00');
  });

  it('night horas handle midnight crossing', () => {
    const slots = computeHoraTable('06:00', '18:00', '06:00', 0);
    const nightSlots = slots.filter(s => !s.isDay);
    expect(nightSlots).toHaveLength(12);
    // Night = 18:00 to 06:00 = 12 hours, each slot = 60 min
    expect(nightSlots[0].startTime).toBe('18:00');
    expect(nightSlots[0].endTime).toBe('19:00');
    // Last night slot wraps to next day
    expect(nightSlots[11].endTime).toBe('06:00');
  });

  it('follows Chaldean sequence: Sun→Ven→Mer→Moon→Sat→Jup→Mars', () => {
    const slots = computeHoraTable('06:00', '18:00', '06:00', 0); // Sunday
    // Chaldean from Sun: Sun(0), Venus(5), Mercury(3), Moon(1), Saturn(6), Jupiter(4), Mars(2), repeat
    expect(slots[0].planetId).toBe(0);  // Sun
    expect(slots[1].planetId).toBe(5);  // Venus
    expect(slots[2].planetId).toBe(3);  // Mercury
    expect(slots[3].planetId).toBe(1);  // Moon
    expect(slots[4].planetId).toBe(6);  // Saturn
    expect(slots[5].planetId).toBe(4);  // Jupiter
    expect(slots[6].planetId).toBe(2);  // Mars
    expect(slots[7].planetId).toBe(0);  // Sun again
  });

  it('each slot has activities text', () => {
    const slots = computeHoraTable('06:00', '18:00', '06:00', 0);
    for (const s of slots) {
      expect(s.activities.en).toBeTruthy();
      expect(s.activities.hi).toBeTruthy();
    }
  });

  it('handles unequal day/night durations', () => {
    // Sunrise 05:30, sunset 20:30 = 15h day, 9h night
    const slots = computeHoraTable('05:30', '20:30', '05:30', 3); // Wednesday
    const daySlots = slots.filter(s => s.isDay);
    const nightSlots = slots.filter(s => !s.isDay);
    // Day: 15h / 12 = 75 min each
    expect(daySlots[0].startTime).toBe('05:30');
    expect(daySlots[0].endTime).toBe('06:45');
    // Night: 9h / 12 = 45 min each
    expect(nightSlots[0].startTime).toBe('20:30');
    expect(nightSlots[0].endTime).toBe('21:15');
  });
});

describe('HORA_PLANET_ACTIVITIES', () => {
  it('has entries for all 7 planets', () => {
    for (let i = 0; i <= 6; i++) {
      expect(HORA_PLANET_ACTIVITIES[i]).toBeDefined();
      expect(HORA_PLANET_ACTIVITIES[i].en).toBeTruthy();
    }
  });
});
