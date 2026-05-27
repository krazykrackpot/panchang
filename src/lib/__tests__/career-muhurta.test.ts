/**
 * Career Muhurta regression tests.
 *
 * Pins three invariants the spec (§3.1, §10) treats as non-negotiable:
 *
 *   1. All 8 career activities are registered in EXTENDED_ACTIVITIES so
 *      the existing verdict-engine path can resolve them. Catches the
 *      "type added but registry skipped" class of bug.
 *
 *   2. Every CareerActivityId has a content entry — landing pages would
 *      throw notFound() otherwise.
 *
 *   3. Hard-veto invariant: any window overlapping Rahu Kaal must rate
 *      `avoid` regardless of nakshatra/tithi quality. This is the rule
 *      most likely to silently regress when someone refactors the
 *      verdict-engine — a positive-side change to the scoring path could
 *      theoretically lift the avoid override unless this test pins it.
 *
 *   4. Activity-rule shape: each new entry has the required arrays
 *      populated. Catches "added the id but forgot the goodNakshatras"
 *      mistakes that would compile cleanly but quietly under-score.
 */
import { describe, it, expect } from 'vitest';
import { EXTENDED_ACTIVITIES } from '@/lib/muhurta/activity-rules-extended';
import { CAREER_CONTENT, SLUG_TO_ACTIVITY } from '@/lib/career/career-content';
import { CAREER_ACTIVITY_IDS } from '@/types/muhurta-ai';
import { computePanchang } from '@/lib/ephem/panchang-calc';
import { computeDayVerdict } from '@/lib/muhurta/verdict-engine';

// Inline helper — `toMinutes` is the verdict-engine's internal convention
// for HH:MM → minutes-since-midnight. Kept inline here so the test
// doesn't reach into engine internals.
function toMinutes(hhmm: string): number {
  const [h, m] = hhmm.split(':').map(Number);
  return h * 60 + m;
}

describe('Career Muhurta — registry', () => {
  it('registers all 8 career activities in EXTENDED_ACTIVITIES', () => {
    expect(CAREER_ACTIVITY_IDS).toHaveLength(8);
    for (const id of CAREER_ACTIVITY_IDS) {
      expect(EXTENDED_ACTIVITIES[id], `${id} missing from EXTENDED_ACTIVITIES`).toBeDefined();
    }
  });

  it('has a content entry for every CareerActivityId', () => {
    for (const id of CAREER_ACTIVITY_IDS) {
      expect(CAREER_CONTENT[id], `CAREER_CONTENT.${id} missing`).toBeDefined();
      const c = CAREER_CONTENT[id];
      expect(c.name.en, `${id}.name.en empty`).toBeTruthy();
      expect(c.classicalName.sanskrit, `${id}.classicalName.sanskrit empty`).toBeTruthy();
      expect(c.faqs.length, `${id} has no FAQs`).toBeGreaterThanOrEqual(3);
      expect(c.siblings.length, `${id} has no siblings`).toBeGreaterThanOrEqual(2);
    }
  });

  it('SLUG_TO_ACTIVITY round-trips correctly', () => {
    for (const id of CAREER_ACTIVITY_IDS) {
      const slug = CAREER_CONTENT[id].slug;
      expect(SLUG_TO_ACTIVITY[slug], `slug ${slug} doesn't map back`).toBe(id);
    }
  });
});

describe('Career Muhurta — activity rule shape', () => {
  for (const id of [
    'job_interview', 'job_application', 'salary_negotiation', 'contract_signing',
    'first_day_at_job', 'business_launch', 'asking_promotion',
  ] as const) {
    it(`${id} has populated good lists`, () => {
      const a = EXTENDED_ACTIVITIES[id];
      expect(a.goodTithis.length, `${id}.goodTithis empty`).toBeGreaterThan(0);
      expect(a.goodNakshatras.length, `${id}.goodNakshatras empty`).toBeGreaterThan(0);
      expect(a.goodWeekdays.length, `${id}.goodWeekdays empty`).toBeGreaterThan(0);
      expect(a.goodHoras.length, `${id}.goodHoras empty`).toBeGreaterThan(0);
    });
  }

  // Resignation is intentionally INVERTED — its goodNakshatras are the
  // ending-friendly set (Bharani, Ardra, Ashlesha, Jyeshtha, Mula).
  // This invariant catches accidental "made it look like other careers"
  // refactors that would lose the inversion.
  it('resignation favours ending-friendly nakshatras', () => {
    const r = EXTENDED_ACTIVITIES.resignation;
    expect(r.goodNakshatras).toContain(2);  // Bharani
    expect(r.goodNakshatras).toContain(19); // Mula
    // And the new-beginning ones must be in the avoid list.
    expect(r.avoidNakshatras).toContain(4);  // Rohini
    expect(r.avoidNakshatras).toContain(8);  // Pushya
  });

  // Contract signing and first-day must hard-veto Bharani + Mula
  // (death-of-beginning / uprooting). Other career activities don't.
  it('contract_signing and first_day_at_job hard-veto Bharani + Mula', () => {
    for (const id of ['contract_signing', 'first_day_at_job', 'business_launch'] as const) {
      const a = EXTENDED_ACTIVITIES[id];
      expect(a.hardAvoidNakshatras, `${id}.hardAvoidNakshatras missing`).toBeDefined();
      expect(a.hardAvoidNakshatras).toContain(2);  // Bharani
      expect(a.hardAvoidNakshatras).toContain(19); // Mula
    }
  });
});

describe('Career Muhurta — hard-veto invariant', () => {
  // Generate a panchang for a known date in Chennai, then assert that
  // any window overlapping Rahu Kaal is rated 'avoid' for every career
  // activity, regardless of nakshatra/tithi quality on the day.
  //
  // We don't pin a specific date+expected-window because the engine's
  // slot boundaries are panchang-dependent — instead we assert the
  // structural invariant: ∀ slots overlapping Rahu Kaal, verdict === 'avoid'.
  it('every slot overlapping Rahu Kaal rates "avoid" across all career activities', () => {
    const panchang = computePanchang({
      year: 2026, month: 6, day: 4, // arbitrary near-future Thursday
      lat: 13.0827, lng: 80.2707,
      tzOffset: 5.5, timezone: 'Asia/Kolkata',
    });

    // The panchang exposes Rahu Kaal as { start: 'HH:MM', end: 'HH:MM' }.
    // Bail with a clear failure if the field is absent — that itself
    // would be a real regression.
    const rk = (panchang as unknown as { rahuKaal?: { start: string; end: string } }).rahuKaal;
    expect(rk, 'panchang.rahuKaal missing from panchang fixture').toBeDefined();
    if (!rk) return;

    const rkStart = toMinutes(rk.start);
    const rkEnd = toMinutes(rk.end);

    for (const activityId of CAREER_ACTIVITY_IDS) {
      const verdict = computeDayVerdict(panchang, activityId);
      for (const slot of verdict.slots) {
        const sStart = toMinutes(slot.start);
        const sEnd = toMinutes(slot.end);
        // Slot overlaps Rahu Kaal if their intervals intersect at all.
        const overlaps = sStart < rkEnd && sEnd > rkStart;
        if (overlaps) {
          expect(
            slot.verdict,
            `${activityId} slot ${slot.start}-${slot.end} overlaps Rahu Kaal ${rk.start}-${rk.end} but rated '${slot.verdict}' instead of 'avoid'`,
          ).toBe('avoid');
        }
      }
    }
  });
});
