// Per-locale sitemap shard — emits the subset of buildSitemapEntries()
// whose `url` is under `${BASE_URL}/${loc}/`. The sitemap INDEX at
// /sitemap.xml points to one of these per visible locale.
//
// URL: /sitemaps/{en|hi|ta|te|bn|gu|kn|mai|mr}
// Content-Type: application/xml — Google accepts any URL as a sitemap
// location regardless of file extension; the path under /sitemaps/
// keeps the shard URLs visually distinct from the index at
// /sitemap.xml.
//
// Why: Vercel's edge-cache enforces a 5 MB UNCOMPRESSED body cap on
// prerendered route handlers. A monolithic sitemap of all locales
// expanded to ~13.5 MB and was rejected with HTTP 413
// `x-vercel-error: CONTENT_TOO_LARGE`. Splitting per-locale keeps each
// shard at ~1,200 URLs / ~1.4 MB raw, comfortably under the cap.
//
// See /sitemap.xml/route.ts for the full history (PR #622's metadata-
// route sharding hit a Turbopack bug; PR #625 went monolithic; this
// shards via route handlers which are not affected by the Turbopack
// issue).
//
// Behaviour:
//   - Unknown locale → 404 (dynamicParams=false prerenders only the 9
//     visible locales; anything else returns 404 without hitting the
//     handler at all).
//   - Known locale → gzipped XML of just that locale's <url> entries
//     PLUS the existing hreflang `alternates.languages` map per entry.

import { gzipSync } from 'node:zlib';
import { notFound } from 'next/navigation';
import { buildSitemapEntries } from '@/lib/seo/sitemap-data';
import { BASE_URL } from '@/lib/seo/base-url';
import { visibleLocales, type Locale } from '@/lib/i18n/config';

export const revalidate = 86400;
export const dynamicParams = false;

export function generateStaticParams() {
  return visibleLocales.map((loc) => ({ loc }));
}

function xmlEscape(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function serializeShard(
  entries: ReturnType<typeof buildSitemapEntries>,
  locale: string,
): string {
  const prefix = `${BASE_URL}/${locale}/`;
  const exactHome = `${BASE_URL}/${locale}`;

  const lines: string[] = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">',
  ];
  for (const e of entries) {
    if (typeof e.url !== 'string') continue;
    if (!e.url.startsWith(prefix) && e.url !== exactHome) continue;

    lines.push('<url>');
    lines.push(`<loc>${xmlEscape(e.url)}</loc>`);
    const langs = (e.alternates?.languages ?? {}) as Record<string, string>;
    for (const [lang, href] of Object.entries(langs)) {
      lines.push(`<xhtml:link rel="alternate" hreflang="${xmlEscape(lang)}" href="${xmlEscape(href)}" />`);
    }
    if (e.lastModified) {
      const iso = e.lastModified instanceof Date ? e.lastModified.toISOString() : String(e.lastModified);
      lines.push(`<lastmod>${iso}</lastmod>`);
    }
    if (e.changeFrequency) {
      lines.push(`<changefreq>${e.changeFrequency}</changefreq>`);
    }
    if (e.priority !== undefined) {
      lines.push(`<priority>${e.priority}</priority>`);
    }
    lines.push('</url>');
  }
  lines.push('</urlset>');
  return lines.join('\n');
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ loc: string }> },
): Promise<Response> {
  const { loc } = await params;
  if (!visibleLocales.includes(loc as Locale)) {
    notFound();
  }

  try {
    const entries = buildSitemapEntries();
    const xml = serializeShard(entries, loc);
    const gzipped = gzipSync(Buffer.from(xml, 'utf-8'));
    return new Response(gzipped, {
      status: 200,
      headers: {
        'Content-Type': 'application/xml; charset=utf-8',
        'Content-Encoding': 'gzip',
        'Cache-Control': 'public, max-age=0, s-maxage=86400, must-revalidate',
        'Vary': 'Accept-Encoding',
      },
    });
  } catch (err) {
    console.error(`[sitemaps/${loc}] generation failed:`, err);
    return new Response('Sitemap shard generation failed.', { status: 500 });
  }
}
