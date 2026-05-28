/**
 * Shared types for the festival deep-dive layer.
 *
 * Powers the personalized astrology widget, wishes/greetings, do's & don'ts,
 * cross-link clusters, and historical archive on /festivals/[slug]/[year].
 *
 * Spec: docs/superpowers/specs/2026-05-28-festival-deep-dive-pages-design.md
 */

import type { LocaleText } from '@/types/panchang';

// ─── Astro focus ─────────────────────────────────────────────────────────────

/**
 * Maps a festival to the planet/house/karaka it astrologically emphasises.
 *
 * Used by the personalized-reading engine to pick the right transit lens
 * (e.g. for Diwali — a wealth/Lakshmi festival — we look at Jupiter/Venus
 * transits through the 2nd house from the user's rashi).
 *
 * Overlapping entries (festivals also in PLANET_FESTIVAL_MAP in
 * src/lib/personalization/festival-relevance.ts) MUST match that map's
 * planet ID. Enforced by a fixture test.
 */
export interface FestivalAstroFocus {
  /** 0=Sun, 1=Moon, 2=Mars, 3=Mercury, 4=Jupiter, 5=Venus, 6=Saturn, 7=Rahu, 8=Ketu */
  primaryPlanet: number;
  /** Optional second planet for festivals with twin karakas (e.g. Akshaya Tritiya = Jupiter + Venus) */
  secondaryPlanet?: number;
  /** 1-12, house the festival emphasises (counted from the user's rashi as the 1st) */
  primaryHouse: number;
  /** Free-form karaka tag: 'wealth', 'courage', 'dharma', 'devotion', etc. Used in template selection. */
  karaka: string;
  /** Short label for the karaka, surfaced in personalized reading copy. */
  karakaLabel: LocaleText;
}

// ─── Personalized reading ────────────────────────────────────────────────────

export interface PersonalizedFestivalReading {
  festival: string;       // slug
  year: number;
  /** 1=Aries, 2=Taurus, ..., 12=Pisces — the user's Moon rashi */
  rashi: number;
  /** 1-line transit summary on the festival date for this rashi */
  summary: LocaleText;
  /** 1-sentence ritual recommendation tied to the transit */
  ritual: LocaleText;
  /** House (from the user's rashi) most relevant on this date — used by the Brihaspati CTA template */
  relevantHouse: number;
  /** Template ID that generated this reading — for variation tests */
  templateId: string;
}

// ─── Wishes & greetings ──────────────────────────────────────────────────────

export interface FestivalWish {
  text: LocaleText;
  tone: 'traditional' | 'modern' | 'family' | 'business';
}

// ─── Do's & Don'ts ───────────────────────────────────────────────────────────

export interface FestivalObservanceItem {
  text: LocaleText;
  /** Optional source citation: "Dharmasindhu Ch.4", "Nirnayasindhu", etc. */
  source?: string;
}

export interface FestivalObservance {
  /** Exactly 6 items per spec §4C — locked by fixture test */
  dos: FestivalObservanceItem[];
  donts: FestivalObservanceItem[];
}

// ─── Clusters ────────────────────────────────────────────────────────────────

export type FestivalClusterType = 'sequence' | 'navratri' | 'pitru-paksha';

export interface FestivalClusterEntry {
  /** Festival slug. If the page doesn't exist yet, mark comingSoon: true. */
  slug: string;
  /** True if the per-festival page hasn't been built — renders as non-clickable badge */
  comingSoon?: boolean;
  /** Optional day-of-N label for long sequences (e.g. "Day 1 of 9" for Navratri) */
  dayLabel?: LocaleText;
}

export interface FestivalCluster {
  type: FestivalClusterType;
  /** Ordered sequence of festivals in this cluster */
  entries: FestivalClusterEntry[];
  /** Display name shown in the cluster card header */
  name: LocaleText;
  /** Short description rendered below the name */
  description: LocaleText;
}
