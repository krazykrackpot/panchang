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
  // /learn/* — opened wholesale 2026-06-17. ChatGPT alone drives ~400+
  // visits/week to a curated subset; surfacing the other ~120 standalone
  // learn pages (lagna, grahas, rashis, nakshatras, tithis, yogas,
  // karanas, muhurtas, dashas, doshas, ashtakavarga, shadbala, jaimini,
  // vargas, avasthas, argala, chandra-darshan, panchak, holashtak,
  // planet-in-house, transits, plus deep-dives like vivah-muhurta,
  // tripushkar-yoga, varshaphal, vedanga, the dozen rashi-specific
  // primers, etc.) gives AI assistants a much richer recommendation
  // corpus. /learn/modules/* stays Disallowed per the original design —
  // structured curriculum protected.
  '/*/learn',
];

/** Cohere — same broad learn access as the rest. */
const COHERE_ALLOW = [
  '/*/panchang',
  '/*/kundali',
  '/*/muhurta-ai',
  '/*/matching',
  '/*/horoscope',
  '/*/caesarean-muhurta',
  '/*/about',
  '/*/vs/',
  '/*/learn',
];

/** Paths blocked for AI crawlers (private dashboards, curriculum, internals). */
const AI_DISALLOW = [
  '/*/learn/modules/',
  '/*/learn/dashboard/',
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
];

const AI_CRAWLERS_FULL = [
  // OpenAI
  'GPTBot',         // training corpus
  'ChatGPT-User',   // live in-chat browsing
  'OAI-SearchBot',  // chatgpt.com web search index
  // Anthropic — ClaudeBot is the current name; anthropic-ai + Claude-Web
  // are legacy/alternate identifiers historically used by Claude clients.
  'ClaudeBot',
  'anthropic-ai',
  'Claude-Web',
  // Google — Gemini training + Search Generative Experience
  'Google-Extended',
  // Perplexity — site retrieval at query time
  'PerplexityBot',
  // Apple Intelligence
  'Applebot-Extended',
  // Amazon (Alexa, Bedrock, Q)
  'Amazonbot',
  // Meta (Meta AI, llama-related)
  'Meta-ExternalAgent',
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

  // Hard blocks — non-cooperative bots.
  sections.push('# ─── Hard Blocks ───');
  sections.push(`User-agent: CCBot\nDisallow: /`);
  sections.push(`User-agent: Bytespider\nDisallow: /`);

  return sections.join('\n\n') + '\n';
}

function main() {
  const out = build();
  const path = join(process.cwd(), 'public/robots.txt');
  writeFileSync(path, out);
  console.log(`Wrote ${out.split('\n').length} lines to ${path}`);
}

main();
