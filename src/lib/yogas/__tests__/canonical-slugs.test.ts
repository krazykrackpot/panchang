import { describe, it, expect } from 'vitest';
import { CANONICAL_YOGA_SLUGS, resolveCanonicalYogaSlug } from '../canonical-slugs';
import { YOGA_DETAIL_DATA } from '@/lib/constants/yoga-details';

describe('canonical-slugs', () => {
  it('stays in sync with YOGA_DETAIL_DATA keys', () => {
    // Drift guard: the proxy validates against CANONICAL_YOGA_SLUGS but
    // the page renders from YOGA_DETAIL_DATA. If they ever diverge,
    // either the proxy 404s URLs the page would render (real yogas
    // become inaccessible), or the page soft-404s URLs the proxy lets
    // through (regression of the very bug this PR exists to fix).
    const dataKeys = new Set(Object.keys(YOGA_DETAIL_DATA));
    const missingFromSlugs = [...dataKeys].filter((k) => !CANONICAL_YOGA_SLUGS.has(k));
    const missingFromData = [...CANONICAL_YOGA_SLUGS].filter((k) => !dataKeys.has(k));
    expect({ missingFromSlugs, missingFromData }).toEqual({
      missingFromSlugs: [],
      missingFromData: [],
    });
  });

  it('resolves an exact canonical key', () => {
    expect(resolveCanonicalYogaSlug('gajakesari')).toBe('gajakesari');
    expect(resolveCanonicalYogaSlug('chandra_mangala')).toBe('chandra_mangala');
  });

  it('resolves a hyphen-stripped variant to its canonical', () => {
    expect(resolveCanonicalYogaSlug('gaja-kesari')).toBe('gajakesari');
  });

  it('resolves a hyphen-to-underscore variant to its canonical', () => {
    expect(resolveCanonicalYogaSlug('chandra-mangala')).toBe('chandra_mangala');
  });

  it('returns null for an unknown slug (GSC Soft 404 case)', () => {
    expect(resolveCanonicalYogaSlug('lagna_mallika')).toBeNull();
    expect(resolveCanonicalYogaSlug('lagna-mallika')).toBeNull();
    expect(resolveCanonicalYogaSlug('totally-fake-yoga-xyz')).toBeNull();
  });

  it('is pure — does not implicitly lowercase', () => {
    // Caller (layout.tsx + proxy) is responsible for lowercasing.
    // Helper must not silently fix case so the uppercase-only 308
    // canonicalisation flow can detect the mismatch.
    expect(resolveCanonicalYogaSlug('Gajakesari')).toBeNull();
  });
});
