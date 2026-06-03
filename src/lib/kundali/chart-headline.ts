/**
 * Build the "1 chart, 1 verdict" headline + 4 vital-sign tiles shown
 * at the top of /kundali Simple Mode.
 *
 * Deterministic synthesis from already-computed data:
 *   - PersonalReading.topInsight — the single most-important sentence
 *     the synthesiser already produced. We promote it to a page-level
 *     headline; no AI call, no fresh prose.
 *   - CosmicBlueprint — provides archetype, current Dasha chapter,
 *     top yoga, and the existing one-line `headline` field as a
 *     fallback when personalReading.topInsight is missing.
 *   - PersonalReading.domains — sorted to surface the strongest and
 *     weakest domains for the "strongest" and "watch-out" tiles.
 *
 * The returned shape is presentation-ready (already-localised strings),
 * so the React component is a thin renderer with no business logic.
 */

import type { CosmicBlueprint } from './archetype-engine';
import type { PersonalReading, DomainReading } from './domain-synthesis/types';
import { tl } from '@/lib/utils/trilingual';
import { GRAHAS } from '@/lib/constants/grahas';

export interface VitalTile {
  /** Short uppercase label shown above the value ("Strongest Domain"). */
  label: string;
  /** Headline value shown big ("Career", "Saturn Maha", "Gajakesari Yoga"). */
  value: string;
  /** Sub-line shown small below the value ("Uttama rating", "4y 2m left"). */
  sub?: string;
  /** Tile accent colour. Indicates verdict tone — emerald for strong,
   *  amber for caution, red for watch-outs, gold neutral. */
  tone: 'gold' | 'emerald' | 'amber' | 'red';
}

export interface ChartHeadlineData {
  /** The big 1-sentence verdict. Always populated — falls back through
   *  topInsight → blueprint.headline → "Your kundali is ready." */
  headline: string;
  /** 4 vital-sign tiles. May contain fewer if data is unavailable. */
  tiles: VitalTile[];
}

interface BuildInput {
  blueprint: CosmicBlueprint | null;
  personalReading: PersonalReading | null;
  locale: string;
}

// ─── Locale helpers ─────────────────────────────────────────────
// Inline mini-i18n for the static label words ("Strongest Domain",
// "Current Period", etc.). Sanskrit/Devanagari locales reuse hi; non-
// Devanagari locales fall through to English. Matches the pattern used
// by other simple-mode components.

const L = (en: string, hi: string) => ({ en, hi });

const LABELS = {
  strongestDomain: L('Strongest Domain', 'सबसे प्रबल क्षेत्र'),
  currentPeriod: L('Current Period', 'वर्तमान दशा'),
  topYoga: L('Top Yoga', 'प्रमुख योग'),
  watchOut: L('Watch-Out', 'सावधानी'),
  yearsRemainingShort: L('y left', 'व शेष'),
  monthsRemainingShort: L('m left', 'मा शेष'),
  fallbackHeadline: L('Your kundali is ready — explore your chart below.', 'आपकी कुण्डली तैयार है — नीचे अपना चार्ट देखें।'),
  noYogaActive: L('No marquee yoga active', 'कोई प्रमुख योग सक्रिय नहीं'),
  noWatchout: L('All domains balanced', 'सभी क्षेत्र संतुलित'),
  mahaDashaSuffix: L('Maha', 'महादशा'),
};

function pick(key: keyof typeof LABELS, locale: string): string {
  const entry = LABELS[key];
  // Devanagari-family locales get Hindi text.
  if (locale === 'hi' || locale === 'sa' || locale === 'mr' || locale === 'mai') {
    return entry.hi;
  }
  return entry.en;
}

// Pretty domain key → user-facing label per locale.
// Wired to the same 9 DomainType values used by the synthesiser.
const DOMAIN_LABELS: Record<string, { en: string; hi: string }> = {
  currentPeriod: { en: 'Current Period', hi: 'वर्तमान दशा' },
  health: { en: 'Health', hi: 'स्वास्थ्य' },
  wealth: { en: 'Wealth', hi: 'धन' },
  career: { en: 'Career', hi: 'करियर' },
  marriage: { en: 'Marriage', hi: 'विवाह' },
  children: { en: 'Children', hi: 'सन्तान' },
  family: { en: 'Family', hi: 'परिवार' },
  spiritual: { en: 'Spiritual', hi: 'आध्यात्म' },
  education: { en: 'Education', hi: 'शिक्षा' },
};

function domainLabel(domain: string, locale: string): string {
  const entry = DOMAIN_LABELS[domain];
  if (!entry) return domain;
  if (locale === 'hi' || locale === 'sa' || locale === 'mr' || locale === 'mai') return entry.hi;
  return entry.en;
}

// Rating → verdict tone for tile colouring.
function ratingTone(rating: string): VitalTile['tone'] {
  switch (rating) {
    case 'uttama':
      return 'emerald';
    case 'madhyama':
      return 'gold';
    case 'adhama':
      return 'amber';
    case 'atyadhama':
      return 'red';
    default:
      return 'gold';
  }
}

// ─── Tile builders ──────────────────────────────────────────────

function strongestDomainTile(domains: DomainReading[], locale: string): VitalTile | null {
  // Skip the `currentPeriod` synthetic domain — that's its own tile.
  const candidates = domains.filter((d) => d.domain !== 'currentPeriod');
  if (candidates.length === 0) return null;
  // Pick highest overallRating.score; ties broken by domain order.
  const top = [...candidates].sort((a, b) => b.overallRating.score - a.overallRating.score)[0];
  return {
    label: pick('strongestDomain', locale),
    value: domainLabel(top.domain, locale),
    sub: tl(top.overallRating.label, locale),
    tone: ratingTone(top.overallRating.rating),
  };
}

function currentDashaTile(blueprint: CosmicBlueprint, locale: string): VitalTile {
  const lordName = GRAHAS[blueprint.currentChapter.dashaLord]?.name;
  const lordStr = lordName ? tl(lordName, locale) : '—';
  // Years remaining: round to 1 decimal when < 10 years for granularity,
  // else integer. Add a months tail when < 1 year remains.
  const yrs = blueprint.currentChapter.yearsRemaining;
  let sub: string;
  if (yrs < 1) {
    const months = Math.max(1, Math.round(yrs * 12));
    sub = `${months} ${pick('monthsRemainingShort', locale)}`;
  } else if (yrs < 10) {
    sub = `${yrs.toFixed(1)} ${pick('yearsRemainingShort', locale)}`;
  } else {
    sub = `${Math.round(yrs)} ${pick('yearsRemainingShort', locale)}`;
  }
  return {
    label: pick('currentPeriod', locale),
    value: `${lordStr} ${pick('mahaDashaSuffix', locale)}`,
    sub,
    tone: 'gold',
  };
}

function topYogaTile(blueprint: CosmicBlueprint, locale: string): VitalTile {
  const top = blueprint.activeYogas?.[0];
  if (!top) {
    return {
      label: pick('topYoga', locale),
      value: pick('noYogaActive', locale),
      tone: 'gold',
    };
  }
  return {
    label: pick('topYoga', locale),
    value: tl(top.name, locale),
    sub: top.influence,
    tone: 'emerald',
  };
}

function watchOutTile(domains: DomainReading[], locale: string): VitalTile {
  // Pick the weakest non-currentPeriod domain; ignore if even the
  // weakest is rated 'uttama' (everything strong → no watch-out).
  const candidates = domains.filter((d) => d.domain !== 'currentPeriod');
  if (candidates.length === 0) {
    return { label: pick('watchOut', locale), value: pick('noWatchout', locale), tone: 'gold' };
  }
  const weakest = [...candidates].sort((a, b) => a.overallRating.score - b.overallRating.score)[0];
  if (weakest.overallRating.rating === 'uttama') {
    return { label: pick('watchOut', locale), value: pick('noWatchout', locale), tone: 'emerald' };
  }
  return {
    label: pick('watchOut', locale),
    value: domainLabel(weakest.domain, locale),
    sub: tl(weakest.overallRating.label, locale),
    tone: ratingTone(weakest.overallRating.rating),
  };
}

// ─── Main entry ─────────────────────────────────────────────────

export function buildChartHeadline({ blueprint, personalReading, locale }: BuildInput): ChartHeadlineData {
  // Headline preference order:
  //   1. personalReading.topInsight — synthesiser's chosen "headline"
  //   2. blueprint.headline — archetype-engine's one-liner
  //   3. Fallback constant
  let headline: string;
  if (personalReading?.topInsight) {
    headline = tl(personalReading.topInsight, locale);
  } else if (blueprint?.headline) {
    headline = blueprint.headline;
  } else {
    headline = pick('fallbackHeadline', locale);
  }

  const tiles: VitalTile[] = [];

  // Tile 1: Strongest Domain (needs personalReading)
  if (personalReading?.domains) {
    const t = strongestDomainTile(personalReading.domains, locale);
    if (t) tiles.push(t);
  }

  // Tile 2: Current Dasha (needs blueprint)
  if (blueprint?.currentChapter) {
    tiles.push(currentDashaTile(blueprint, locale));
  }

  // Tile 3: Top Yoga (needs blueprint)
  if (blueprint) {
    tiles.push(topYogaTile(blueprint, locale));
  }

  // Tile 4: Watch-Out (needs personalReading)
  if (personalReading?.domains) {
    tiles.push(watchOutTile(personalReading.domains, locale));
  }

  return { headline, tiles };
}
