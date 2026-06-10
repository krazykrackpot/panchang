// Sitemap INDEX — emits a small XML pointing at 9 per-locale sub-sitemaps.
//
// Why this exists (2026-06-10 hotfix):
//   The previous single-sitemap implementation built one ~13.5 MB
//   uncompressed XML (10,820 URLs × 9 locales of alternates each).
//   That fit Google's 50 MB / 50,000-URL sitemap limit comfortably,
//   but Vercel's edge-cache layer enforces a tighter 5 MB UNCOMPRESSED
//   response-body cap on prerendered routes. On a cold edge, the
//   response was rejected with `x-vercel-error: CONTENT_TOO_LARGE`
//   (HTTP 413) — Google's sitemap fetcher then reported "Couldn't
//   fetch" and the index dried up.
//
// History of attempts:
//   - PR #622 (2026-06-09): sharded via Next.js `generateSitemaps()`
//     metadata-route — shipped broken because Turbopack emitted empty
//     bundles for the sharded variants (each `<urlset>` came out empty
//     in prod, populated locally).
//   - PR #625 (2026-06-09): replaced metadata-route with a single
//     gzip route handler — fixed the Turbopack issue but kept the
//     monolithic body, hitting the 5 MB cap once the URL count grew.
//
// This commit reuses the PR #625 route-handler approach (not affected
// by the Turbopack bug) but splits the body into:
//   /sitemap.xml      → this file, the INDEX (tiny — ~9 entries)
//   /sitemaps/en      → per-locale child (handled by
//                       app/sitemaps/[loc]/route.ts)
//   /sitemaps/hi      → "
//   ... × 9
//
// The shard path uses `/sitemaps/<loc>` rather than
// `/sitemap-<loc>.xml` because Next.js dynamic segments must match an
// entire folder name — a literal-prefixed folder like `sitemap-[loc].xml`
// is parsed as a static name, not as a dynamic route.
//
// Each sub-sitemap is ~1,200 URLs / ~1.4 MB raw / ~25 KB gzipped.
// All well inside Vercel's 5 MB cap.
//
// Google sitemap index spec: https://www.sitemaps.org/protocol.html#index
// — Google accepts any URL as a sitemap location regardless of the
// `.xml` suffix; Content-Type alone is what they check.

import { gzipSync } from 'node:zlib';
import { BASE_URL } from '@/lib/seo/base-url';
import { visibleLocales } from '@/lib/i18n/config';

export const revalidate = 86400;

function xmlEscape(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function serializeIndex(): string {
  const lastmod = new Date().toISOString();
  const lines: string[] = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
  ];
  for (const loc of visibleLocales) {
    lines.push('<sitemap>');
    lines.push(`<loc>${xmlEscape(`${BASE_URL}/sitemaps/${loc}`)}</loc>`);
    lines.push(`<lastmod>${lastmod}</lastmod>`);
    lines.push('</sitemap>');
  }
  lines.push('</sitemapindex>');
  return lines.join('\n');
}

export function GET(): Response {
  try {
    const xml = serializeIndex();
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
    console.error('[sitemap.xml] index generation failed:', err);
    return new Response('Sitemap index generation failed.', { status: 500 });
  }
}
