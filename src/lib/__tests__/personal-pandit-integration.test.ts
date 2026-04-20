/**
 * Personal Pandit Engine — Integration Tests
 *
 * End-to-end verification of the domain synthesis engine.
 * Uses a real KundaliData generated from the kundali calculator
 * with known birth data: Delhi, 1990-01-15, 10:30 AM IST.
 */

import { describe, it, expect, beforeAll } from 'vitest';
import { generateKundali } from '@/lib/ephem/kundali-calc';
import { synthesizeReading } from '@/lib/kundali/domain-synthesis/synthesizer';
import type { KundaliData } from '@/types/kundali';
import type { PersonalReading, DomainType } from '@/lib/kundali/domain-synthesis/types';

let kundali: KundaliData;
let reading: PersonalReading;

beforeAll(() => {
  kundali = generateKundali({
    name: 'Test Native',
    date: '1990-01-15',
    time: '10:30',
    place: 'Delhi',
    lat: 28.6139,
    lng: 77.2090,
    timezone: '5.5',
    ayanamsha: 'lahiri',
  });

  reading = synthesizeReading(kundali, 'en', 36);
});

describe('Personal Pandit Integration', () => {
  // -----------------------------------------------------------------------
  // 1. Full reading produces all 8 domains
  // -----------------------------------------------------------------------
  it('synthesizeReading returns 8 domain readings', () => {
    expect(reading.domains).toHaveLength(8);
    const domainIds = reading.domains.map(d => d.domain);
    expect(domainIds).toContain('health');
    expect(domainIds).toContain('wealth');
    expect(domainIds).toContain('career');
    expect(domainIds).toContain('marriage');
    expect(domainIds).toContain('children');
    expect(domainIds).toContain('family');
    expect(domainIds).toContain('spiritual');
    expect(domainIds).toContain('education');
  });

  // -----------------------------------------------------------------------
  // 2. Every domain has a valid rating
  // -----------------------------------------------------------------------
  it('every domain has a valid rating', () => {
    const validRatings = ['uttama', 'madhyama', 'adhama', 'atyadhama'];
    for (const d of reading.domains) {
      expect(validRatings).toContain(d.overallRating.rating);
      expect(d.overallRating.score).toBeGreaterThanOrEqual(0);
      expect(d.overallRating.score).toBeLessThanOrEqual(10);
    }
  });

  // -----------------------------------------------------------------------
  // 3. Every domain has a non-empty headline
  // -----------------------------------------------------------------------
  it('every domain has a non-empty headline', () => {
    for (const d of reading.domains) {
      expect(d.headline.en.length).toBeGreaterThan(10);
    }
  });

  // -----------------------------------------------------------------------
  // 4. Current period is populated
  // -----------------------------------------------------------------------
  it('current period has dasha summary and narrative', () => {
    expect(reading.currentPeriod.dashaSummary).toBeDefined();
    expect(reading.currentPeriod.dashaSummary.en.length).toBeGreaterThan(10);
    expect(reading.currentPeriod.summary.en.length).toBeGreaterThan(10);
  });

  // -----------------------------------------------------------------------
  // 5. Top insight (life overview) is populated
  // -----------------------------------------------------------------------
  it('top insight is a non-empty narrative', () => {
    expect(reading.topInsight.en.length).toBeGreaterThan(50);
  });

  // -----------------------------------------------------------------------
  // 6. Cross-domain links detected (per-domain)
  // -----------------------------------------------------------------------
  it('detects at least 1 cross-domain link across all domains', () => {
    const totalLinks = reading.domains.reduce(
      (sum, d) => sum + d.crossDomainLinks.length,
      0,
    );
    expect(totalLinks).toBeGreaterThanOrEqual(1);
  });

  // -----------------------------------------------------------------------
  // 7. Domain differentiation — not all ratings are identical
  // -----------------------------------------------------------------------
  it('domains have differentiated ratings (not all identical)', () => {
    const scores = reading.domains.map(d => d.overallRating.score);
    const uniqueScores = new Set(scores);
    expect(uniqueScores.size).toBeGreaterThan(1);
  });

  // -----------------------------------------------------------------------
  // 8. At least one domain has future timeline triggers
  // -----------------------------------------------------------------------
  it('at least one domain has future timeline triggers', () => {
    const hasTimeline = reading.domains.some(d => d.timelineTriggers.length > 0);
    expect(hasTimeline).toBe(true);
  });

  // -----------------------------------------------------------------------
  // 9. Performance: completes in under 2 seconds
  // -----------------------------------------------------------------------
  it('completes in under 2 seconds', () => {
    const start = Date.now();
    synthesizeReading(kundali, 'en', 36);
    const elapsed = Date.now() - start;
    expect(elapsed).toBeLessThan(2000);
  });

  // -----------------------------------------------------------------------
  // 10. Natal promise block is well-formed for every domain
  // -----------------------------------------------------------------------
  it('every domain has a well-formed natal promise block', () => {
    const validRatings = ['uttama', 'madhyama', 'adhama', 'atyadhama'];
    for (const d of reading.domains) {
      expect(validRatings).toContain(d.natalPromise.rating.rating);
      expect(d.natalPromise.rating.score).toBeGreaterThanOrEqual(0);
      expect(d.natalPromise.rating.score).toBeLessThanOrEqual(10);
      expect(d.natalPromise.summary.en.length).toBeGreaterThan(10);
    }
  });

  // -----------------------------------------------------------------------
  // 11. Current activation block is populated for every domain
  // -----------------------------------------------------------------------
  it('every domain has a current activation block', () => {
    for (const d of reading.domains) {
      expect(d.currentActivation).toBeDefined();
      expect(d.currentActivation.overallActivationScore).toBeGreaterThanOrEqual(0);
      expect(d.currentActivation.overallActivationScore).toBeLessThanOrEqual(10);
    }
  });

  // -----------------------------------------------------------------------
  // 12. Detailed narrative is present for every domain
  // -----------------------------------------------------------------------
  it('every domain has a detailed narrative', () => {
    for (const d of reading.domains) {
      expect(d.detailedNarrative.en.length).toBeGreaterThan(50);
    }
  });
});
