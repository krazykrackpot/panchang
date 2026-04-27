import { describe, it, expect } from 'vitest';
import { findCollectiveMuhurta } from '../collective-muhurta';

const CORSEAUX = { lat: 46.4625, lng: 6.8035, tz: 2 };

describe('findCollectiveMuhurta', () => {
  it('finds collective windows for a 2-member family', () => {
    const result = findCollectiveMuhurta({
      members: [
        { name: 'Parent', birthNakshatra: 11, birthRashi: 5 },
        { name: 'Spouse', birthNakshatra: 4, birthRashi: 2 },
      ],
      activity: 'griha_pravesh',
      startDate: '2026-05-01',
      endDate: '2026-05-07',
      ...CORSEAUX,
    });

    expect(result.memberCount).toBe(2);
    expect(result.topWindows.length).toBeGreaterThan(0);
    expect(result.topWindows.length).toBeLessThanOrEqual(10);

    for (const w of result.topWindows) {
      expect(w.memberScores.length).toBe(2);
      expect(w.collectiveScore).toBeGreaterThanOrEqual(0);
      expect(w.collectiveScore).toBeLessThanOrEqual(100);
      expect(w.minScore).toBeLessThanOrEqual(w.maxScore);
      expect(w.minScore).toBeLessThanOrEqual(w.collectiveScore);
    }
  }, 60000);

  it('collective score is average of member scores', () => {
    const result = findCollectiveMuhurta({
      members: [
        { name: 'A', birthNakshatra: 11, birthRashi: 5 },
        { name: 'B', birthNakshatra: 20, birthRashi: 9 },
      ],
      activity: 'marriage',
      startDate: '2026-05-01',
      endDate: '2026-05-03',
      ...CORSEAUX,
    });

    for (const w of result.topWindows) {
      const avg = Math.round(
        w.memberScores.reduce((a, m) => a + m.score, 0) / w.memberScores.length,
      );
      expect(w.collectiveScore).toBe(avg);
    }
  }, 60000);

  it('windows are sorted by collective score descending', () => {
    const result = findCollectiveMuhurta({
      members: [
        { name: 'A', birthNakshatra: 11, birthRashi: 5 },
        { name: 'B', birthNakshatra: 4, birthRashi: 2 },
      ],
      activity: 'travel',
      startDate: '2026-05-01',
      endDate: '2026-05-05',
      ...CORSEAUX,
    });

    for (let i = 1; i < result.topWindows.length; i++) {
      expect(result.topWindows[i - 1].collectiveScore)
        .toBeGreaterThanOrEqual(result.topWindows[i].collectiveScore);
    }
  }, 60000);

  it('handles single member (degenerates to individual scan)', () => {
    const result = findCollectiveMuhurta({
      members: [
        { name: 'Solo', birthNakshatra: 11, birthRashi: 5 },
      ],
      activity: 'property',
      startDate: '2026-05-01',
      endDate: '2026-05-03',
      ...CORSEAUX,
    });

    expect(result.memberCount).toBe(1);
    expect(result.topWindows.length).toBeGreaterThan(0);
    for (const w of result.topWindows) {
      expect(w.memberScores.length).toBe(1);
      // Single member: collective = individual
      expect(w.collectiveScore).toBe(w.memberScores[0].score);
    }
  }, 60000);

  it('returns empty topWindows for zero members', () => {
    const result = findCollectiveMuhurta({
      members: [],
      activity: 'travel',
      startDate: '2026-05-01',
      endDate: '2026-05-03',
      ...CORSEAUX,
    });

    expect(result.memberCount).toBe(0);
    expect(result.topWindows).toEqual([]);
  });
});
