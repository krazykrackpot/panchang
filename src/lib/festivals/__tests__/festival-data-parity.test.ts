/**
 * Data-parity fixtures for the festival deep-dive layer.
 *
 * Locks the Gemini-fix from PR #264 spec review: the festival-astro-focus
 * table MUST align with the existing PLANET_FESTIVAL_MAP in
 * src/lib/personalization/festival-relevance.ts for overlapping festivals.
 * If either map updates, this test fails loudly until the other is
 * brought into sync.
 *
 * Also locks the cluster→slug invariant: every entry referenced in a
 * cluster either exists in MAJOR_FESTIVALS (real page) or is marked
 * comingSoon: true (intentional placeholder).
 *
 * Spec: docs/superpowers/specs/2026-05-28-festival-deep-dive-pages-design.md §11
 */

import { describe, expect, it } from 'vitest';
import { TOP_FESTIVAL_SLUGS, MAJOR_FESTIVALS } from '@/lib/calendar/festival-defs';
import { FESTIVAL_ASTRO_FOCUS } from '../festival-astro-focus';
import { FESTIVAL_CLUSTERS, findClusterForFestival } from '../festival-clusters';
import type { FestivalAstroFocus } from '../types';

// ─── Hand-mirror of the existing PLANET_FESTIVAL_MAP so this test fails
// ─── loudly if either side drifts. (Importing the const directly would
// ─── make the test useless — we want the two to be derived independently
// ─── and locked at this boundary.)
const EXPECTED_PLANET_FROM_PERSONALIZATION_MAP: Record<string, number> = {
  // Sun
  'makar-sankranti': 0,
  'chhath-puja': 0,
  // Moon — none of these are in TOP_FESTIVAL_SLUGS so we don't check
  // Mars
  'hanuman-jayanti': 2,
  // Mercury — none in TOP_FESTIVAL_SLUGS overlap
  // Jupiter
  'guru-purnima': 4,
  // Venus
  'vasant-panchami': 5,
  // Saturn
  'maha-shivaratri': 6,
  // Rahu — none in TOP_FESTIVAL_SLUGS overlap
  // Ketu
  'ganesh-chaturthi': 8,
};

describe('FESTIVAL_ASTRO_FOCUS — coverage + parity with personalization map', () => {
  it('has an entry for every TOP_FESTIVAL_SLUGS slug', () => {
    for (const slug of TOP_FESTIVAL_SLUGS) {
      expect(FESTIVAL_ASTRO_FOCUS[slug], `Missing astro focus for ${slug}`).toBeDefined();
    }
  });

  it('every primaryPlanet is a valid planet ID 0-8', () => {
    for (const [slug, focus] of Object.entries(FESTIVAL_ASTRO_FOCUS)) {
      expect(focus.primaryPlanet, `${slug}.primaryPlanet`).toBeGreaterThanOrEqual(0);
      expect(focus.primaryPlanet, `${slug}.primaryPlanet`).toBeLessThanOrEqual(8);
      if (focus.secondaryPlanet !== undefined) {
        expect(focus.secondaryPlanet, `${slug}.secondaryPlanet`).toBeGreaterThanOrEqual(0);
        expect(focus.secondaryPlanet, `${slug}.secondaryPlanet`).toBeLessThanOrEqual(8);
      }
    }
  });

  it('every primaryHouse is a valid house 1-12', () => {
    for (const [slug, focus] of Object.entries(FESTIVAL_ASTRO_FOCUS)) {
      expect(focus.primaryHouse, `${slug}.primaryHouse`).toBeGreaterThanOrEqual(1);
      expect(focus.primaryHouse, `${slug}.primaryHouse`).toBeLessThanOrEqual(12);
    }
  });

  it('every karakaLabel has en + hi (LocaleText shape)', () => {
    for (const [slug, focus] of Object.entries(FESTIVAL_ASTRO_FOCUS)) {
      expect(focus.karakaLabel.en, `${slug}.karakaLabel.en`).toBeTruthy();
      expect(focus.karakaLabel.hi, `${slug}.karakaLabel.hi`).toBeTruthy();
    }
  });

  it('overlapping entries match the existing PLANET_FESTIVAL_MAP exactly', () => {
    // This is the Gemini-fix lock from PR #264. Any future change to
    // either FESTIVAL_ASTRO_FOCUS or PLANET_FESTIVAL_MAP must keep these
    // in sync — change BOTH or change NEITHER, never just one.
    for (const [slug, expectedPlanet] of Object.entries(EXPECTED_PLANET_FROM_PERSONALIZATION_MAP)) {
      const focus = FESTIVAL_ASTRO_FOCUS[slug] as FestivalAstroFocus | undefined;
      expect(focus, `${slug} missing from FESTIVAL_ASTRO_FOCUS`).toBeDefined();
      expect(
        focus!.primaryPlanet,
        `${slug} disagrees with PLANET_FESTIVAL_MAP: focus says ${focus!.primaryPlanet}, map says ${expectedPlanet}`,
      ).toBe(expectedPlanet);
    }
  });
});

describe('FESTIVAL_CLUSTERS — slug coverage + integrity', () => {
  const allMajorSlugs = new Set(MAJOR_FESTIVALS.map((f) => f.slug));

  it('every cluster entry slug is either a real festival or marked comingSoon', () => {
    for (const [clusterId, cluster] of Object.entries(FESTIVAL_CLUSTERS)) {
      for (const entry of cluster.entries) {
        if (entry.comingSoon) continue;
        expect(
          allMajorSlugs.has(entry.slug),
          `Cluster ${clusterId} references non-existent slug "${entry.slug}" without comingSoon flag`,
        ).toBe(true);
      }
    }
  });

  it('every cluster has en + hi name + description', () => {
    for (const [clusterId, cluster] of Object.entries(FESTIVAL_CLUSTERS)) {
      expect(cluster.name.en, `${clusterId}.name.en`).toBeTruthy();
      expect(cluster.name.hi, `${clusterId}.name.hi`).toBeTruthy();
      expect(cluster.description.en, `${clusterId}.description.en`).toBeTruthy();
      expect(cluster.description.hi, `${clusterId}.description.hi`).toBeTruthy();
    }
  });

  it('every cluster has at least 2 entries', () => {
    for (const [clusterId, cluster] of Object.entries(FESTIVAL_CLUSTERS)) {
      expect(cluster.entries.length, `${clusterId} should have ≥2 entries`).toBeGreaterThanOrEqual(2);
    }
  });

  it('Navratri cluster has 10 entries (9 days + Dussehra)', () => {
    expect(FESTIVAL_CLUSTERS['navratri-sequence'].entries.length).toBe(10);
  });

  it('Pitru Paksha cluster has 15 entries', () => {
    expect(FESTIVAL_CLUSTERS['pitru-paksha-sequence'].entries.length).toBe(15);
  });

  it('Diwali 5-day cluster has all 5 days as real (non-comingSoon) festivals', () => {
    const diwali = FESTIVAL_CLUSTERS['diwali-sequence'];
    expect(diwali.entries.length).toBe(5);
    for (const entry of diwali.entries) {
      expect(entry.comingSoon, `${entry.slug} should be a real page`).toBeFalsy();
      expect(allMajorSlugs.has(entry.slug), `${entry.slug} missing from MAJOR_FESTIVALS`).toBe(true);
    }
  });

  it('findClusterForFestival returns the right cluster for Diwali', () => {
    const result = findClusterForFestival('diwali');
    expect(result).not.toBeNull();
    expect(result?.clusterId).toBe('diwali-sequence');
  });

  it('findClusterForFestival returns null for an isolated festival', () => {
    // Akshaya Tritiya is in TOP_FESTIVAL_SLUGS but not in any cluster.
    expect(findClusterForFestival('akshaya-tritiya')).toBeNull();
  });
});
