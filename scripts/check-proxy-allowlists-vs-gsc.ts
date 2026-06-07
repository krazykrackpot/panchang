/* eslint-disable no-console */
/**
 * Pre-merge SEO safety check.
 *
 * For every currently-indexed URL (GSC ranking list + sitemap), simulate
 * what the new proxy validators would do. Fail if ANY URL would 404
 * — that's a confirmed SEO regression we cannot ship.
 *
 * Run from within the proxy-cohort fix worktree:
 *   npx tsx scripts/check-proxy-allowlists-vs-gsc.ts
 */
import {
  CANONICAL_RASHI_SLUGS,
  CANONICAL_FESTIVAL_SLUGS,
  CANONICAL_CITY_SLUGS,
} from '@/lib/seo/proxy-allowlists';
import { resolveCanonicalYogaSlug } from '@/lib/yogas/canonical-slugs';
import fs from 'node:fs';

const PANCHANG_RESERVED = new Set([
  'date', 'rashi', 'nakshatra', 'masa', 'yoga', 'tithi', 'karana',
  'grahan', 'muhurta', 'samvatsara', 'yearly', 'auspicious',
  'inauspicious', 'nivas', 'planets', 'remedies', 'activity-guide',
  'locations',
]);

function wouldProxy404(url: string): { hit404: boolean; reason: string } {
  let pathname: string;
  try {
    pathname = new URL(url).pathname;
  } catch {
    return { hit404: false, reason: '' };
  }
  const segs = pathname.split('/').filter(Boolean);

  if (segs.length >= 3 && segs[1] === 'horoscope' && !CANONICAL_RASHI_SLUGS.has(segs[2])) {
    return { hit404: true, reason: `rashi:${segs[2]}` };
  }
  if (segs.length >= 3 && segs[1] === 'festivals' && !CANONICAL_FESTIVAL_SLUGS.has(segs[2])) {
    return { hit404: true, reason: `festival:${segs[2]}` };
  }
  if (segs.length === 3 && segs[1] === 'panchang' && !PANCHANG_RESERVED.has(segs[2])
      && !CANONICAL_CITY_SLUGS.has(segs[2])) {
    return { hit404: true, reason: `panchang-city:${segs[2]}` };
  }
  if (segs.length === 4 && segs[1] === 'learn' && segs[2] === 'yoga'
      && resolveCanonicalYogaSlug(segs[3].toLowerCase()) === null) {
    return { hit404: true, reason: `yoga:${segs[3]}` };
  }
  return { hit404: false, reason: '' };
}

const gscPath = '/tmp/gsc-urls.txt';
const sitemapPath = '/tmp/sitemap-urls.txt';

const gscUrls = fs.existsSync(gscPath)
  ? fs.readFileSync(gscPath, 'utf8').split('\n').filter(Boolean).map((l) => l.split('\t')[2])
  : [];
const sitemapUrls = fs.existsSync(sitemapPath)
  ? fs.readFileSync(sitemapPath, 'utf8').split('\n').filter(Boolean)
  : [];

const gscFails: { url: string; reason: string }[] = [];
for (const url of gscUrls) {
  const r = wouldProxy404(url);
  if (r.hit404) gscFails.push({ url, reason: r.reason });
}
const sitemapFails: { url: string; reason: string }[] = [];
for (const url of sitemapUrls) {
  const r = wouldProxy404(url);
  if (r.hit404) sitemapFails.push({ url, reason: r.reason });
}

console.log(`GSC ranking URLs that would 404: ${gscFails.length} / ${gscUrls.length}`);
if (gscFails.length > 0) {
  console.log(JSON.stringify(gscFails.slice(0, 30), null, 2));
}
console.log(`Sitemap URLs that would 404: ${sitemapFails.length} / ${sitemapUrls.length}`);
if (sitemapFails.length > 0) {
  console.log(JSON.stringify(sitemapFails.slice(0, 30), null, 2));
}

if (gscFails.length > 0 || sitemapFails.length > 0) {
  console.error('\nSEO REGRESSION: at least one currently-ranking URL would be 404ed.');
  process.exit(1);
}
console.log('\n✅ No SEO regression — all GSC + sitemap URLs pass the new allowlists.');
