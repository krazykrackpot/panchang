/**
 * Generates public/robots.txt from a single template.
 *
 * Replaces a hand-edited 510-line file that repeated the same ~50-line
 * Allow list under every AI crawler (GPTBot, ChatGPT-User, Claude-Web,
 * anthropic-ai, Google-Extended, PerplexityBot, cohere-ai). One missed
 * line meant a crawler couldn't reach a page — and 510 lines of repeats
 * made the typos hard to spot.
 *
 * Run via `npx tsx scripts/build-robots.ts` whenever the lists change.
 */

import { writeFileSync } from 'node:fs';
import { join } from 'node:path';

const SITEMAP_URL = 'https://dekhopanchang.com/sitemap.xml';

/** Paths every crawler (general + AI) is allowed to fetch. */
const COMMON_ALLOW = [
  '/llms.txt',
  '/llms-full.txt',
  '/*/regional',
  '/*/festivals',
  '/*/sade-sati',
  '/*/eclipses',
  '/*/retrograde',
  '/*/transits',
  '/*/vedic-time',
  '/*/shraddha',
  '/*/devotional',
  '/*/vrat-katha',
  '/*/vrat-calendar',
  '/*/rudraksha',
  '/*/glossary',
  '/*/tools',
  '/*/dinacharya',
  '/*/charts',
  '/*/varshaphal',
  '/*/dates/',
  '/*/accuracy',
  '/*/lunar-calendar',
  '/*/annual-forecast',
];

/** Tool + landing pages AI crawlers are explicitly allowed (in addition to COMMON_ALLOW). */
const AI_ALLOW = [
  '/*/panchang',
  '/*/kundali',
  '/*/muhurta-ai',
  '/*/matching',
  '/*/calendar',
  '/*/choghadiya',
  '/*/hora',
  '/*/sky',
  '/*/sign-calculator',
  '/*/baby-names',
  '/*/horoscope',
  '/*/caesarean-muhurta',
  '/*/about',
  '/*/vs/',
  '/*/learn/contributions',
  '/*/learn/lagna',
  '/*/learn/grahas',
  '/*/learn/rashis',
  '/*/learn/nakshatras',
  '/*/learn/tithis',
  '/*/learn/yogas',
  '/*/learn/karanas',
  '/*/learn/muhurtas',
  '/*/learn/kundali',
  '/*/learn/dashas',
  '/*/learn/doshas',
  '/*/learn/matching',
  '/*/learn/gochar',
  '/*/learn/sade-sati',
  '/*/learn/ashtakavarga',
  '/*/learn/shadbala',
  '/*/learn/jaimini',
  '/*/learn/vargas',
  '/*/learn/avasthas',
  '/*/learn/argala',
  '/*/learn/chandra-darshan',
  '/*/learn/panchak',
  '/*/learn/holashtak',
  '/*/learn/planet-in-house',
  '/*/learn/transits',
];

/** Cohere gets a tighter list — drop the more niche learn pages. */
const COHERE_ALLOW = [
  '/*/panchang',
  '/*/kundali',
  '/*/muhurta-ai',
  '/*/matching',
  '/*/horoscope',
  '/*/caesarean-muhurta',
  '/*/about',
  '/*/vs/',
  '/*/learn/contributions',
  '/*/learn/lagna',
  '/*/learn/grahas',
  '/*/learn/rashis',
  '/*/learn/nakshatras',
  '/*/learn/tithis',
  '/*/learn/yogas',
  '/*/learn/karanas',
  '/*/learn/muhurtas',
  '/*/learn/kundali',
  '/*/learn/dashas',
  '/*/learn/doshas',
  '/*/learn/matching',
  '/*/learn/gochar',
  '/*/learn/sade-sati',
  '/*/learn/planet-in-house',
  '/*/learn/transits',
];

/** Paths blocked for AI crawlers (private dashboards, curriculum, internals). */
const AI_DISALLOW = [
  '/*/learn/modules/',
  '/*/learn/dashboard/',
  // Festival city variants are noindex + too expensive to render for crawlers.
  '/*/festivals/*/*/*',
];

/** Paths every crawler is blocked from. */
const COMMON_DISALLOW = [
  '/api/',
  '/_next/',
  '/*/auth/',
  '/*/settings/',
  '/*/profile/',
  '/*/dashboard/',
  '/*/embed/',
  // Festival × city variant pages (/locale/festivals/slug/year/city/).
  // These pages are noindex in metadata but `Allow: /*/festivals` above
  // was letting crawlers reach every city variant (54K invocations/day,
  // 7s P75 compute per request = #1 CPU cost driver). The year-level
  // page (/locale/festivals/slug/year/) stays allowed; only the 5th
  // path segment (city) is blocked.
  '/*/festivals/*/*/*',
];

const AI_CRAWLERS_FULL = [
  'GPTBot',
  'ChatGPT-User',
  'Claude-Web',
  'anthropic-ai',
  'Google-Extended',
  'PerplexityBot',
];

function block(userAgent: string, allow: string[], disallow: string[]): string {
  const lines = [`User-agent: ${userAgent}`];
  for (const a of allow) lines.push(`Allow: ${a}`);
  for (const d of disallow) lines.push(`Disallow: ${d}`);
  return lines.join('\n');
}

function build(): string {
  const sections: string[] = [];

  // Generic crawler block — wide-open with documented disallows.
  sections.push(
    block('*', ['/', ...COMMON_ALLOW], COMMON_DISALLOW),
  );

  sections.push(`# Sitemap location\nSitemap: ${SITEMAP_URL}`);

  sections.push('# ─── AI Crawlers: Strategic Access ───');
  sections.push('# Allow tool pages + discovery content (contributions, standalone learn pages).');
  sections.push('# Block structured course modules (/learn/modules/*) to protect curriculum.');
  sections.push('# Lists generated from scripts/build-robots.ts — edit there, not here.');

  for (const ua of AI_CRAWLERS_FULL) {
    sections.push(block(ua, [...AI_ALLOW, ...COMMON_ALLOW], AI_DISALLOW));
  }

  // Cohere — narrower list.
  sections.push(block('cohere-ai', [...COHERE_ALLOW, ...COMMON_ALLOW], AI_DISALLOW));

  // Hard blocks — non-cooperative bots + zero-traffic crawlers.
  // Baiduspider/YandexBot: heavy crawl volume (~12-14k req/period each
  // per Vercel analytics 2026-06-26), zero meaningful traffic — neither
  // engine drives users to a global EN/Hindi/Tamil Vedic-astrology site.
  // Both honour robots.txt; if either keeps hammering we'll add a Vercel
  // firewall rule.
  sections.push('# ─── Hard Blocks ───');
  sections.push(`User-agent: CCBot\nDisallow: /`);
  sections.push(`User-agent: Bytespider\nDisallow: /`);
  sections.push(`User-agent: Baiduspider\nDisallow: /`);
  sections.push(`User-agent: YandexBot\nDisallow: /`);

  return sections.join('\n\n') + '\n';
}

function main() {
  const out = build();
  const path = join(process.cwd(), 'public/robots.txt');
  writeFileSync(path, out);
  console.log(`Wrote ${out.split('\n').length} lines to ${path}`);
}

main();
