import { describe, it, expect } from 'vitest';
import { computeTrajectory } from '@/lib/kundali/domain-synthesis/trajectory';
import type { TrajectoryPoint, FullTrajectory } from '@/lib/kundali/domain-synthesis/trajectory';
import type { PersonalReading, DomainType } from '@/lib/kundali/domain-synthesis/types';

// ---------------------------------------------------------------------------
// Helpers to build test fixtures
// ---------------------------------------------------------------------------

const SCORED_DOMAINS: DomainType[] = [
  'health', 'wealth', 'career', 'marriage',
  'children', 'family', 'spiritual', 'education',
];

function makeScores(value: number): Record<DomainType, number> {
  const scores = {} as Record<DomainType, number>;
  for (const d of SCORED_DOMAINS) {
    scores[d] = value;
  }
  // currentPeriod is not scored but type requires it
  scores['currentPeriod' as DomainType] = 0;
  return scores;
}

function makeCustomScores(overrides: Partial<Record<DomainType, number>>): Record<DomainType, number> {
  const scores = makeScores(5);
  for (const [k, v] of Object.entries(overrides)) {
    scores[k as DomainType] = v!;
  }
  return scores;
}

function makePoint(date: string, scores: Record<DomainType, number>, opts?: Partial<TrajectoryPoint>): TrajectoryPoint {
  return {
    date,
    scores,
    mahaDasha: opts?.mahaDasha ?? 'Jupiter',
    antarDasha: opts?.antarDasha ?? 'Saturn',
    sadeSatiActive: opts?.sadeSatiActive ?? false,
    triggerEvent: opts?.triggerEvent,
  };
}

function makeMinimalReading(domainScores: Partial<Record<DomainType, number>>): PersonalReading {
  const domains = SCORED_DOMAINS.map(d => ({
    domain: d,
    overallRating: { rating: 'madhyama' as const, score: domainScores[d] ?? 5, label: { en: '', hi: '' }, color: '' },
    natalPromise: {} as never,
    currentActivation: {} as never,
    timelineTriggers: [],
    remedies: [],
    crossDomainLinks: [],
    headline: { en: '', hi: '' },
    detailedNarrative: { en: '', hi: '' },
  }));

  return {
    kundaliId: 'test-id',
    computedAt: new Date().toISOString(),
    domains,
    currentPeriod: {
      dashaSummary: { en: 'Jupiter period', hi: 'बृहस्पति काल' },
      keyTransits: [],
      activeDomainsNow: [],
      challengedDomainsNow: [],
      periodScore: 6,
      periodRating: { rating: 'madhyama', score: 6, label: { en: '', hi: '' }, color: '' },
      summary: { en: '', hi: '' },
    },
    topInsight: { en: '', hi: '' },
  } as PersonalReading;
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe('computeTrajectory', () => {
  it('returns stable trends with empty history', () => {
    const reading = makeMinimalReading({ health: 6, wealth: 6, career: 6, marriage: 6, children: 6, family: 6, spiritual: 6, education: 6 });
    const result = computeTrajectory([], reading, 'en');

    expect(result.domains).toHaveLength(8);
    for (const dt of result.domains) {
      expect(dt.trend).toBe('stable');
      expect(dt.delta).toBe(0);
      expect(dt.sparkline).toHaveLength(1); // only the current point
    }
    expect(result.overallTrend).toBe('stable');
    expect(result.biggestGain).toBeNull();
    expect(result.biggestDrop).toBeNull();
  });

  it('detects rising trends when scores increase significantly', () => {
    // 3 months of history with score 4, then current at 7
    const history: TrajectoryPoint[] = [
      makePoint('2026-01', makeScores(4)),
      makePoint('2026-02', makeScores(4)),
      makePoint('2026-03', makeScores(4)),
    ];
    const reading = makeMinimalReading({ health: 7, wealth: 7, career: 7, marriage: 7, children: 7, family: 7, spiritual: 7, education: 7 });
    const result = computeTrajectory(history, reading, 'en');

    for (const dt of result.domains) {
      expect(dt.trend).toBe('rising');
      expect(dt.delta).toBe(3);
      expect(dt.current).toBe(7);
      expect(dt.previous).toBe(4);
    }
    expect(result.overallTrend).toBe('improving');
  });

  it('detects falling trends when scores decrease significantly', () => {
    const history: TrajectoryPoint[] = [
      makePoint('2026-01', makeScores(8)),
      makePoint('2026-02', makeScores(8)),
      makePoint('2026-03', makeScores(8)),
    ];
    const reading = makeMinimalReading({ health: 4, wealth: 4, career: 4, marriage: 4, children: 4, family: 4, spiritual: 4, education: 4 });
    const result = computeTrajectory(history, reading, 'en');

    for (const dt of result.domains) {
      expect(dt.trend).toBe('falling');
      expect(dt.delta).toBe(-4);
      expect(dt.current).toBe(4);
      expect(dt.previous).toBe(8);
    }
    expect(result.overallTrend).toBe('declining');
  });

  it('detects biggestGain and biggestDrop correctly', () => {
    const history: TrajectoryPoint[] = [
      makePoint('2026-03', makeCustomScores({ health: 5, wealth: 8, career: 5, spiritual: 5 })),
    ];
    // Health jumps +3, Wealth drops -4, others stay
    const reading = makeMinimalReading({ health: 8, wealth: 4, career: 5, marriage: 5, children: 5, family: 5, spiritual: 5, education: 5 });
    const result = computeTrajectory(history, reading, 'en');

    expect(result.biggestGain).not.toBeNull();
    expect(result.biggestGain!.domain).toBe('health');
    expect(result.biggestGain!.delta).toBe(3);

    expect(result.biggestDrop).not.toBeNull();
    expect(result.biggestDrop!.domain).toBe('wealth');
    expect(result.biggestDrop!.delta).toBe(-4);
  });

  it('computes mixed overallTrend when some rise and some fall', () => {
    const history: TrajectoryPoint[] = [
      makePoint('2026-01', makeScores(5)),
      makePoint('2026-02', makeScores(5)),
      makePoint('2026-03', makeScores(5)),
    ];
    // 4 domains rise, 4 domains fall
    const reading = makeMinimalReading({
      health: 8, wealth: 8, career: 8, marriage: 8,
      children: 2, family: 2, spiritual: 2, education: 2,
    });
    const result = computeTrajectory(history, reading, 'en');

    const rising = result.domains.filter(d => d.trend === 'rising').length;
    const falling = result.domains.filter(d => d.trend === 'falling').length;
    expect(rising).toBe(4);
    expect(falling).toBe(4);
    expect(result.overallTrend).toBe('mixed');
  });

  it('sparkline contains history + current value', () => {
    const history: TrajectoryPoint[] = [
      makePoint('2026-01', makeScores(3)),
      makePoint('2026-02', makeScores(5)),
      makePoint('2026-03', makeScores(7)),
    ];
    const reading = makeMinimalReading({ health: 8, wealth: 8, career: 8, marriage: 8, children: 8, family: 8, spiritual: 8, education: 8 });
    const result = computeTrajectory(history, reading, 'en');

    for (const dt of result.domains) {
      expect(dt.sparkline).toEqual([3, 5, 7, 8]);
    }
  });

  it('insight text contains bilingual content', () => {
    const history: TrajectoryPoint[] = [
      makePoint('2026-01', makeScores(4)),
      makePoint('2026-02', makeScores(4)),
      makePoint('2026-03', makeScores(4)),
    ];
    const reading = makeMinimalReading({ health: 7, wealth: 7, career: 7, marriage: 7, children: 7, family: 7, spiritual: 7, education: 7 });
    const result = computeTrajectory(history, reading, 'en');

    const healthTrajectory = result.domains.find(d => d.domain === 'health')!;
    // English insight
    expect(healthTrajectory.insight.en).toContain('Health');
    expect(healthTrajectory.insight.en).toContain('upward');
    // Hindi insight
    expect(healthTrajectory.insight.hi).toContain('स्वास्थ्य');
    // Sanskrit falls back to English
    expect((healthTrajectory.insight as { sa?: string }).sa).toBeTruthy();
  });

  it('summary text references dasha context', () => {
    const history: TrajectoryPoint[] = [
      makePoint('2026-01', makeScores(4), { mahaDasha: 'Venus', antarDasha: 'Mercury' }),
      makePoint('2026-02', makeScores(4), { mahaDasha: 'Venus', antarDasha: 'Mercury' }),
      makePoint('2026-03', makeScores(4), { mahaDasha: 'Venus', antarDasha: 'Mercury' }),
    ];
    const reading = makeMinimalReading({ health: 7, wealth: 7, career: 7, marriage: 7, children: 7, family: 7, spiritual: 7, education: 7 });
    const result = computeTrajectory(history, reading, 'en');

    expect(result.summary.en).toContain('Venus');
    expect(result.summary.en).toContain('upward');
  });

  it('handles sade sati context in insights', () => {
    const history: TrajectoryPoint[] = [
      makePoint('2026-01', makeScores(6), { sadeSatiActive: true }),
      makePoint('2026-02', makeScores(6), { sadeSatiActive: true }),
      makePoint('2026-03', makeScores(6), { sadeSatiActive: true }),
    ];
    const reading = makeMinimalReading({ health: 8, wealth: 8, career: 8, marriage: 8, children: 8, family: 8, spiritual: 8, education: 8 });
    const result = computeTrajectory(history, reading, 'en');

    const healthInsight = result.domains.find(d => d.domain === 'health')!;
    expect(healthInsight.insight.en).toContain('Sade Sati');
  });

  it('delta is zero with no history', () => {
    const reading = makeMinimalReading({ health: 7 });
    const result = computeTrajectory([], reading, 'en');

    const healthDt = result.domains.find(d => d.domain === 'health')!;
    expect(healthDt.delta).toBe(0);
    expect(healthDt.current).toBe(7);
    expect(healthDt.previous).toBe(7);
  });
});
