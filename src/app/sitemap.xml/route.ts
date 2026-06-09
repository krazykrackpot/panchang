// Custom sitemap route — emits the full sitemap with gzip compression.
//
// Why not Next.js's app/sitemap.ts metadata-route convention:
//   1. Turbopack's metadata-route bundler shipped EMPTY chunks for our
//      generateSitemaps()-sharded sitemap in the 2026-06-09 deploy
//      (commit 07d2181f). The compiled bundle at
//      .next/server/chunks/_next-internal_server_app_sitemap_*.js was
//      143 bytes containing an empty function — buildAllEntries() never
//      executed at build time. All 6 shards rendered as <urlset></urlset>.
//      Locally the same code returned 1,842 URLs per shard.
//   2. Next.js's MetadataRoute helper has no Content-Encoding control,
//      so even when it does work, it serves the raw XML — 13.8 MB on
//      the current 11,061-URL fan-out. GSC's sitemap fetcher reliably
//      chokes on uncompressed XML above ~10 MB, producing "Couldn't
//      fetch" — the original incident that prompted the sharding
//      attempt.
//
// This route handler bypasses both. It calls buildSitemapEntries()
// directly, serialises the urlset by hand, gzips, and returns the
// compressed body with the right Content-Encoding header. ~13.8 MB raw
// → ~500 KB gzipped, single fetch, no shard discovery needed.

import { gzipSync } from 'node:zlib';
import { buildSitemapEntries } from '@/lib/seo/sitemap-data';

// Match what app/sitemap.ts used (1-day ISR — sitemap regen needs to
// reflect daily content rolls like the 7-day horoscope window).
export const revalidate = 86400;

function xmlEscape(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function serializeSitemap(entries: ReturnType<typeof buildSitemapEntries>): string {
  const lines: string[] = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">',
  ];
  for (const e of entries) {
    lines.push('<url>');
    lines.push(`<loc>${xmlEscape(e.url)}</loc>`);
    // alternates.languages emits <xhtml:link rel="alternate" hreflang="…" href="…" />
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

export function GET(): Response {
  try {
    const entries = buildSitemapEntries();
    const xml = serializeSitemap(entries);
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
    console.error('[sitemap.xml] generation failed:', err);
    return new Response('Sitemap generation failed.', { status: 500 });
  }
}
