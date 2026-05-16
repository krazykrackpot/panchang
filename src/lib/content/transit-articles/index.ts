// Re-export all types
export type { MoonSignEffect, KeyDate, TransitArticle } from './types';

// Import all article constants
import { jupiterInCancer2026 } from './jupiter-in-cancer-2026';
import { jupiterInLeo2026 } from './jupiter-in-leo-2026';
import { rahuInCapricorn2026 } from './rahu-in-capricorn-2026';
import { ketuInCancer2026 } from './ketu-in-cancer-2026';
import { saturnInPisces2026 } from './saturn-in-pisces-2026';
import { marsRetrograde2026 } from './mars-retrograde-2026';
import { jupiterInVirgo2027 } from './jupiter-in-virgo-2027';

import type { TransitArticle } from './types';

// Aggregate all articles into the canonical record
export const TRANSIT_ARTICLES: Record<string, TransitArticle> = {
  [jupiterInCancer2026.slug]: jupiterInCancer2026,
  [jupiterInLeo2026.slug]: jupiterInLeo2026,
  [rahuInCapricorn2026.slug]: rahuInCapricorn2026,
  [ketuInCancer2026.slug]: ketuInCancer2026,
  [saturnInPisces2026.slug]: saturnInPisces2026,
  [marsRetrograde2026.slug]: marsRetrograde2026,
  [jupiterInVirgo2027.slug]: jupiterInVirgo2027,
};

/** Get all published article slugs (for sitemap and index pages) */
export function getTransitArticleSlugs(): string[] {
  return Object.keys(TRANSIT_ARTICLES);
}

/** Find article slug for a specific planet → sign transit (if published) */
export function findArticleSlug(planetId: number, toSignId: number): string | null {
  for (const [slug, article] of Object.entries(TRANSIT_ARTICLES)) {
    if (article.planetId === planetId && article.toSignId === toSignId) return slug;
  }
  return null;
}

/** Get the Moon-sign effect for a specific rashi from an article */
export function getMoonSignEffect(slug: string, rashiId: number): import('./types').MoonSignEffect | null {
  const article = TRANSIT_ARTICLES[slug];
  if (!article) return null;
  return article.moonSignEffects.find(e => e.rashiId === rashiId) || null;
}
