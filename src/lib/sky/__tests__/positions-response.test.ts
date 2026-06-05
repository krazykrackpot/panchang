import { describe, it, expect } from 'vitest';
import { parsePositionsResponse } from '../positions-response';

// Regression guard for the June 2026 production crash:
//   /api/sky/positions returned { error: "Rate limit exceeded" } under 429
//   burst from the LiveSkyMap slider; every consumer naively did
//   setPositions(data.positions), landing `undefined` in state. The next
//   render hit `positions.map(...)` and React killed the tree.
//   parsePositionsResponse hardens the boundary so non-success shapes
//   return null instead of leaking undefined to consumer state.
describe('parsePositionsResponse', () => {
  it('returns the positions array on success shape', () => {
    const data = {
      positions: [
        { id: 0, name: 'Sun', siderealLongitude: 12.34, speed: 0.985, isRetrograde: false, rashi: 1, nakshatra: 1, nakshatraPada: 2 },
      ],
      timestamp: '2026-06-05T12:00:00.000Z',
    };
    const result = parsePositionsResponse(data);
    expect(result).not.toBeNull();
    expect(result).toHaveLength(1);
    expect(result![0].name).toBe('Sun');
  });

  it('returns an empty array unchanged (valid success shape with no planets)', () => {
    const result = parsePositionsResponse({ positions: [], timestamp: 't' });
    expect(result).toEqual([]);
  });

  it('returns null for a 4xx/5xx error body (no positions field)', () => {
    expect(parsePositionsResponse({ error: 'Rate limit exceeded. Please wait.' })).toBeNull();
    expect(parsePositionsResponse({ error: 'Invalid date format' })).toBeNull();
    expect(parsePositionsResponse({ error: 'Failed to compute planetary positions' })).toBeNull();
  });

  it('returns null when positions is the wrong type (string, number, object)', () => {
    expect(parsePositionsResponse({ positions: 'oops' })).toBeNull();
    expect(parsePositionsResponse({ positions: 42 })).toBeNull();
    expect(parsePositionsResponse({ positions: { not: 'an array' } })).toBeNull();
  });

  it('returns null for non-object inputs (null, undefined, primitives)', () => {
    expect(parsePositionsResponse(null)).toBeNull();
    expect(parsePositionsResponse(undefined)).toBeNull();
    expect(parsePositionsResponse('a string')).toBeNull();
    expect(parsePositionsResponse(42)).toBeNull();
    expect(parsePositionsResponse(true)).toBeNull();
  });

  it('returns null when the body has no positions field at all', () => {
    expect(parsePositionsResponse({})).toBeNull();
    expect(parsePositionsResponse({ timestamp: '...' })).toBeNull();
  });
});
