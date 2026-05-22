import { describe, it, expect } from 'vitest';
import { detectSubject, type SavedChartRef } from './subject-detector';

const CHARTS: SavedChartRef[] = [
  { id: 'self-id', label: 'Adi Kumar', is_primary: true },
  { id: 'vaibhavi-id', label: 'Vaibhavi Jha', is_primary: false },
  { id: 'arjun-id', label: 'Arjun Jha', is_primary: false },
  { id: 'neelima-id', label: 'Neelima Dahiya', is_primary: false },
];

describe('detectSubject — auto-detection from question text', () => {
  it('matches a first-name mention', () => {
    const r = detectSubject('What about the education of my daughter Vaibhavi?', CHARTS);
    expect(r.chartId).toBe('vaibhavi-id');
    expect(r.reason).toBe('name_match');
    expect(r.matchedTokens).toContain('vaibhavi');
  });

  it('matches a last-name mention', () => {
    const r = detectSubject('Should we worry about Dahiya?', CHARTS);
    expect(r.chartId).toBe('neelima-id');
  });

  it('matches across multiple tokens (full name)', () => {
    const r = detectSubject("Arjun Jha's career — what does his chart say?", CHARTS);
    expect(r.chartId).toBe('arjun-id');
    expect(r.matchedTokens).toEqual(expect.arrayContaining(['arjun', 'jha']));
  });

  it('prefers non-primary chart on tie (family member > self)', () => {
    // Two charts share 'Jha' surname (Vaibhavi and Arjun). A bare "Jha"
    // mention matches both with score=1; tie-break prefers neither over
    // the other but never the primary (self), per the design.
    const r = detectSubject('Jha — when?', CHARTS);
    expect(['vaibhavi-id', 'arjun-id']).toContain(r.chartId);
    expect(r.chartId).not.toBe('self-id');
  });

  it('returns null when no name is mentioned', () => {
    const r = detectSubject('What does my chart say about career?', CHARTS);
    expect(r.chartId).toBeNull();
    expect(r.reason).toBe('no_match');
  });

  it('ignores common stop words (son, daughter, family, kundali, chart)', () => {
    const r = detectSubject('My daughter\'s education?', CHARTS);
    // "daughter" alone doesn't match any chart label
    expect(r.chartId).toBeNull();
  });

  it('returns no_charts when the user has no saved charts', () => {
    const r = detectSubject('Vaibhavi?', []);
    expect(r.chartId).toBeNull();
    expect(r.reason).toBe('no_charts');
  });

  it('handles questions with punctuation and capitalisation', () => {
    const r = detectSubject('What’s the chart say about VAIBHAVI?', CHARTS);
    expect(r.chartId).toBe('vaibhavi-id');
  });

  it('ignores words shorter than 3 chars', () => {
    // Avoid matching against an extremely short chart label or random
    // tokens like 'is', 'me', etc.
    const r = detectSubject('it is a question', CHARTS);
    expect(r.chartId).toBeNull();
  });

  it('the LAST mention wins on equal scores', () => {
    const r = detectSubject('Vaibhavi started, then Arjun took over.', CHARTS);
    // Both names appear once → tie on score=1 → last position wins → Arjun
    expect(r.chartId).toBe('arjun-id');
  });

  it('two-token match beats one-token match', () => {
    const r = detectSubject('Tell me about Vaibhavi Jha career.', CHARTS);
    // Vaibhavi → 2 tokens (vaibhavi + jha). Arjun shares 'jha' → 1 token.
    // Vaibhavi wins.
    expect(r.chartId).toBe('vaibhavi-id');
  });
});
