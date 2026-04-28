/**
 * Birth Time Rectification — Main Orchestrator
 *
 * Ties together candidate generation, chart computation, event matching,
 * and scoring into a single entry point.
 *
 * Performance note: generates a full KundaliData for each candidate time.
 * With 2-minute steps over a 3-hour window this is ~90 charts. Each chart
 * takes ~5-15 ms on modern hardware → total ~0.5-1.5 s.
 */

import { generateKundali } from '@/lib/ephem/kundali-calc';
import { generateCandidates } from './candidate-generator';
import { scoreAllEvents } from './event-matcher';
import { rankCandidates } from './scorer';
import type { ScoredCandidate } from './scorer';
import type { RectificationInput, RectificationResult } from './types';

/**
 * Run full birth time rectification.
 *
 * 1. Generate candidate birth times (Phase 1)
 * 2. For each candidate, compute a kundali and score all events (Phase 2)
 * 3. Rank and return top 3 candidates with confidence (Phase 3)
 */
export function rectifyBirthTime(input: RectificationInput): RectificationResult {
  // Phase 1: generate candidates
  const candidates = generateCandidates(input);

  if (candidates.length === 0) {
    return {
      candidates: [],
      searchWindow: { from: '00:00', to: '00:00' },
      candidatesEvaluated: 0,
      strength: 'insufficient',
    };
  }

  const searchWindow = {
    from: candidates[0].time,
    to: candidates[candidates.length - 1].time,
  };

  // Phase 2: compute chart + score events for each candidate
  const scored: ScoredCandidate[] = [];

  for (const cand of candidates) {
    // Build a BirthData object for generateKundali
    // Per Lesson L: timezone is a numeric offset — generateKundali's resolveTimezone
    // handles both numeric and IANA strings, so passing the number as a string is safe.
    const birthData = {
      name: 'Rectification Candidate',
      date: input.birthDate,
      time: cand.time,
      place: `${input.birthLat},${input.birthLng}`,
      lat: input.birthLat,
      lng: input.birthLng,
      timezone: String(input.birthTimezone),
      ayanamsha: 'lahiri', // Default Lahiri — most widely used
    };

    try {
      const kundali = generateKundali(birthData);
      const eventMatches = scoreAllEvents(input.events, kundali);
      const totalScore = eventMatches.reduce((sum, em) => sum + em.score, 0);

      scored.push({
        candidate: cand,
        eventMatches,
        totalScore,
      });
    } catch (err) {
      // Skip candidates that fail chart computation (e.g. edge cases at midnight)
      // Log but don't block — per Lesson A, never silently swallow
      console.error(`[rectification] Chart computation failed for ${cand.time}:`, err);
    }
  }

  // Phase 3: rank and return
  return rankCandidates(scored, searchWindow);
}
