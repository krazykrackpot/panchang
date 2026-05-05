/**
 * Tests for Tithi-Gandanthara muhurta rule
 *
 * The rule penalises windows at tithi junctions:
 *   - Last 2 ghatis (0.4°) of tithis 5, 10, 15, 20, 25, 30
 *   - First 2 ghatis (0.4°) of tithis 6, 11, 16, 21, 26, 1
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { RuleContext } from '@/lib/muhurta/engine/types';
import { getExtendedActivity } from '@/lib/muhurta/activity-rules-extended';
import type { PanchangSnapshot } from '@/lib/muhurta/ai-recommender';

// Mock the astronomical functions so we can control elongation precisely
vi.mock('@/lib/ephem/astronomical', () => ({
  sunLongitude: vi.fn(() => 0),
  moonLongitude: vi.fn(() => 0),
  normalizeDeg: (deg: number) => ((deg % 360) + 360) % 360,
}));

import { sunLongitude, moonLongitude } from '@/lib/ephem/astronomical';
import { GANDANTHARA_RULES } from '@/lib/muhurta/engine/rules/gandanthara';

const rule = GANDANTHARA_RULES[0];

function makeCtx(): RuleContext {
  const marriageRules = getExtendedActivity('marriage');
  const snap: PanchangSnapshot = {
    tithi: 5,
    nakshatra: 4,
    yoga: 5,
    karana: 3,
    weekday: 4,
    moonSign: 2,
    moonSid: 45.0,
  };
  return {
    date: '2026-06-15',
    jdNoon: 2461575.0,
    sunriseUT: 2461574.7,
    sunsetUT: 2461575.3,
    weekday: 4,
    windowStartUT: 2461574.8,
    windowEndUT: 2461574.9,
    midpointJD: 2461574.85,
    snap,
    activity: 'marriage',
    activityRules: marriageRules,
    lat: 46.46,
    lng: 6.84,
    tz: 2,
  };
}

describe('Tithi-Gandanthara Rule', () => {
  beforeEach(() => {
    vi.mocked(sunLongitude).mockReturnValue(0);
    vi.mocked(moonLongitude).mockReturnValue(0);
  });

  it('exports a single rule with correct metadata', () => {
    expect(GANDANTHARA_RULES).toHaveLength(1);
    expect(rule.id).toBe('tithi-gandanthara');
    expect(rule.tier).toBe(3);
    expect(rule.scope).toBe('window');
    expect(rule.effect).toBe('penalty');
    expect(rule.appliesTo).toBe('all');
  });

  it('triggers at end of tithi 5 (elongation near 60°)', () => {
    // End of tithi 5 = elongation near 60° (5*12°), last 0.4°
    // Elongation = moonLon - sunLon = 59.7° → posInTithi = 59.7%12 = 11.7 > 11.6 ✓
    vi.mocked(sunLongitude).mockReturnValue(10);
    vi.mocked(moonLongitude).mockReturnValue(69.7); // 69.7 - 10 = 59.7°
    const result = rule.evaluate(makeCtx());
    expect(result).not.toBeNull();
    expect(result!.points).toBe(-4);
  });

  it('triggers at start of tithi 6 (elongation just past 60°)', () => {
    // Start of tithi 6 = elongation just past 60°, first 0.4°
    // Elongation = 60.2° → currentTithi = floor(60.2/12)+1 = 6, posInTithi = 0.2 < 0.4 ✓
    vi.mocked(sunLongitude).mockReturnValue(10);
    vi.mocked(moonLongitude).mockReturnValue(70.2); // 70.2 - 10 = 60.2°
    const result = rule.evaluate(makeCtx());
    expect(result).not.toBeNull();
    expect(result!.points).toBe(-4);
  });

  it('triggers at end of tithi 15 (Purnima end, elongation near 180°)', () => {
    // End of tithi 15 = elongation near 180°, last 0.4°
    // Elongation = 179.7° → currentTithi = floor(179.7/12)+1 = 15, posInTithi = 11.7 > 11.6 ✓
    vi.mocked(sunLongitude).mockReturnValue(0);
    vi.mocked(moonLongitude).mockReturnValue(179.7);
    const result = rule.evaluate(makeCtx());
    expect(result).not.toBeNull();
    expect(result!.points).toBe(-4);
  });

  it('triggers at start of tithi 1 (elongation near 0°)', () => {
    // Start of tithi 1 = elongation near 0°, first 0.4°
    // Elongation = 0.3° → currentTithi = floor(0.3/12)+1 = 1, posInTithi = 0.3 < 0.4 ✓
    vi.mocked(sunLongitude).mockReturnValue(100);
    vi.mocked(moonLongitude).mockReturnValue(100.3); // 100.3 - 100 = 0.3°
    const result = rule.evaluate(makeCtx());
    expect(result).not.toBeNull();
    expect(result!.points).toBe(-4);
  });

  it('does NOT trigger in the middle of tithi 5', () => {
    // Middle of tithi 5 = elongation ~54° → posInTithi = 6.0
    vi.mocked(sunLongitude).mockReturnValue(0);
    vi.mocked(moonLongitude).mockReturnValue(54);
    const result = rule.evaluate(makeCtx());
    expect(result).toBeNull();
  });

  it('does NOT trigger in the middle of tithi 7 (not a gandanthara tithi)', () => {
    // Tithi 7 at any position is never gandanthara
    vi.mocked(sunLongitude).mockReturnValue(0);
    vi.mocked(moonLongitude).mockReturnValue(83.9); // Near end of tithi 7 — posInTithi = 11.9
    const result = rule.evaluate(makeCtx());
    expect(result).toBeNull();
  });

  it('does NOT trigger at the START of tithi 5 (only end matters)', () => {
    // Start of tithi 5 = elongation 48.2° → posInTithi = 0.2
    // tithi 5 is in END list, not START list
    vi.mocked(sunLongitude).mockReturnValue(0);
    vi.mocked(moonLongitude).mockReturnValue(48.2);
    const result = rule.evaluate(makeCtx());
    expect(result).toBeNull();
  });

  it('triggers at end of tithi 30 (Amavasya end, elongation near 360°)', () => {
    // End of tithi 30 = elongation near 360°, last 0.4°
    // Elongation = 359.7° → currentTithi = floor(359.7/12)+1 = 30, posInTithi = 11.7 > 11.6 ✓
    vi.mocked(sunLongitude).mockReturnValue(0);
    vi.mocked(moonLongitude).mockReturnValue(359.7);
    const result = rule.evaluate(makeCtx());
    expect(result).not.toBeNull();
    expect(result!.points).toBe(-4);
  });
});
