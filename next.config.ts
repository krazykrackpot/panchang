import type { NextConfig } from "next";
import createNextIntlPlugin from 'next-intl/plugin';
import bundleAnalyzer from '@next/bundle-analyzer';

const withNextIntl = createNextIntlPlugin('./src/lib/i18n/request.ts');

// Enable with `ANALYZE=true npm run build` to produce .next/analyze/*.html
// treemaps showing where bundle weight comes from.
const withBundleAnalyzer = bundleAnalyzer({ enabled: process.env.ANALYZE === 'true' });

// ---------------------------------------------------------------------------
// Western zodiac → Vedic slug redirects (SEO aliases)
// Duplicated here because next.config.ts runs outside the src/ module graph.
// ---------------------------------------------------------------------------
const WESTERN_VEDIC_MAP: Record<string, string> = {
  aries: 'mesh', taurus: 'vrishabh', gemini: 'mithun', cancer: 'kark',
  leo: 'simha', virgo: 'kanya', libra: 'tula', scorpio: 'vrishchik',
  sagittarius: 'dhanu', capricorn: 'makar', aquarius: 'kumbh', pisces: 'meen',
};

const westernSlugs = Object.keys(WESTERN_VEDIC_MAP);
const vedicSlugs = Object.values(WESTERN_VEDIC_MAP);

function buildWesternRedirects() {
  const redirects: Array<{ source: string; destination: string; permanent: boolean }> = [];

  // 12 horoscope redirects: /horoscope/aries → /horoscope/mesh
  for (const [western, vedic] of Object.entries(WESTERN_VEDIC_MAP)) {
    redirects.push({
      source: `/:locale/horoscope/${western}`,
      destination: `/:locale/horoscope/${vedic}`,
      permanent: true,
    });
  }

  // 78 matching pair redirects: /matching/aries-and-leo → /matching/mesh-and-simha
  for (let i = 0; i < 12; i++) {
    for (let j = i; j < 12; j++) {
      redirects.push({
        source: `/:locale/matching/${westernSlugs[i]}-and-${westernSlugs[j]}`,
        destination: `/:locale/matching/${vedicSlugs[i]}-and-${vedicSlugs[j]}`,
        permanent: true,
      });
    }
  }

  return redirects;
}

const nextConfig: NextConfig = {
  turbopack: {
    root: __dirname,
  },
  experimental: {
    // Tree-shake barrel exports — reduces unused JS shipped to client
    optimizePackageImports: [
      'lucide-react',
      'framer-motion',
      'd3',
      'd3-scale',
      'd3-shape',
      'd3-selection',
      '@supabase/supabase-js',
      'three',
      '@react-three/fiber',
      '@react-three/drei',
      'jspdf',
    ],
    // Optimize CSS chunking — splits CSS by route for smaller critical CSS
    cssChunking: 'strict',
    // serverActions.bodySizeLimit was previously bumped to 5mb to work
    // around the 413 on computeKundaliInsights (Madhavi report
    // 2026-05-26). That bump was reverted because Next parses the
    // request body BEFORE verifying the action ID — a 5mb cap exposes
    // every Server Action to memory-exhaustion DoS (Gemini PR #200
    // HIGH). The proper fix lives in src/app/[locale]/kundali/actions.ts:
    // accept BirthData (~500 bytes) and recompute the kundali server-
    // side instead of shipping the precomputed ~1.5-4 MB KundaliData.
  },
  images: {
    formats: ['image/avif', 'image/webp'],
    domains: [],
  },
  trailingSlash: false,
  async redirects() {
    return [
      // /learn/yogas-detailed was removed; redirect to merged yogas page
      {
        source: '/:locale/learn/yogas-detailed',
        destination: '/:locale/learn/yogas',
        permanent: true,
      },
      // Round 2 UI-1 — /path was a near-duplicate of /sadhaka-path with no
      // inbound links. Canonical slug is /sadhaka-path (matches the
      // Brihaspati page link). 301 keeps the route name searchable but
      // funnels traffic to the linked destination.
      {
        source: '/:locale/path',
        destination: '/:locale/sadhaka-path',
        permanent: true,
      },
      // GSC 2026-05-25 — Google indexed bare /family across locales
      // (gu/family last crawled 22 May 2026) from a removed route. The
      // family synthesis feature now lives under the authenticated
      // /dashboard/family route. Redirect so GSC drops the dead URL from
      // its index and bookmarks reach the real page after login.
      {
        source: '/:locale/family',
        destination: '/:locale/dashboard/family',
        permanent: true,
      },
      // Round 2 UI-3 — /embed-demo duplicated /widget. /widget is the
      // canonical and is now linked from the footer (see Footer.tsx).
      {
        source: '/:locale/embed-demo',
        destination: '/:locale/widget',
        permanent: true,
      },
      // Bare /festivals/:slug → /festivals/:slug/2026 (current canonical year).
      // External backlinks and old GSC entries pointing at the bare slug
      // were returning 404 because only the /[slug]/[year] tree exists.
      // YEAR-FLIP: update `2026` here when CLAUDE.md's "Inception year"
      // moves to 2027. Tracked under the SEO click-drop recovery spec.
      {
        source: '/:locale/festivals/:slug',
        destination: '/:locale/festivals/:slug/2026',
        permanent: true,
      },
      // Western zodiac name → Vedic name URL aliases (90 redirects)
      ...buildWesternRedirects(),
    ];
  },
  // Include sweph native binary in serverless function bundles
  outputFileTracingIncludes: {
    '/api/**': ['./node_modules/sweph/**'],
    '/\\[locale\\]/**': ['./node_modules/sweph/**'],
  },
  serverExternalPackages: ['sweph'],

  // ---------------------------------------------------------------------------
  // Security headers — CSP, HSTS, clickjacking, COOP
  // ---------------------------------------------------------------------------
  async headers() {
    return [
      // Embeddable widget — allow framing from any origin
      {
        source: '/embed/:path*',
        headers: [
          { key: 'X-Frame-Options', value: 'ALLOWALL' },
          { key: 'Content-Security-Policy', value: "frame-ancestors *" },
        ],
      },
      {
        source: '/(.*)',
        headers: [
          // HSTS — force HTTPS for 1 year, include subdomains, allow preload list
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=31536000; includeSubDomains; preload',
          },
          // Clickjacking protection — allow same-origin framing only
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN',
          },
          // MIME type sniffing protection
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          // Referrer policy — send origin only to cross-origin, full to same-origin
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          // Cross-Origin Opener Policy — isolate browsing context
          {
            key: 'Cross-Origin-Opener-Policy',
            value: 'same-origin-allow-popups',
          },
          // Permissions Policy — restrict sensitive APIs
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), usb=(), accelerometer=(), gyroscope=(), magnetometer=()',
          },
          // Content Security Policy
          // - 'unsafe-inline' needed for Next.js inline scripts + styled-jsx + JSON-LD
          // - 'unsafe-eval' needed for Next.js dev mode; can be removed in strict mode
          // - google domains needed for AdSense + Fonts
          // - supabase for auth + DB
          // - vercel for analytics + deployment
          // - ipapi for geolocation fallback
          // - nominatim for reverse geocoding
          // - anthropic/openai/cohere for AI features
          {
            key: 'Content-Security-Policy',
            value: [
              // Scripts: self + inline (Next.js requirement) + Google AdSense + Vercel Analytics
              "default-src 'self'",
              "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://pagead2.googlesyndication.com https://www.googletagservices.com https://adservice.google.com https://ep2.adtrafficquality.google https://va.vercel-scripts.com",
              // Styles: self + inline (Tailwind + Next.js) + Google Fonts
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
              // Fonts: self + Google Fonts CDN
              "font-src 'self' https://fonts.gstatic.com data:",
              // Images: self + data URIs + blob (for canvas/chart exports) + AdSense image pixels
              "img-src 'self' data: blob: https://*.google.com https://*.googleapis.com https://pagead2.googlesyndication.com",
              // API connections: self + Supabase + AI providers + geolocation + Nominatim + AdSense quality signals
              "connect-src 'self' https://*.supabase.co wss://*.supabase.co https://api.anthropic.com https://api.openai.com https://api.cohere.com https://ipapi.co https://timeapi.io https://nominatim.openstreetmap.org https://pagead2.googlesyndication.com https://ep1.adtrafficquality.google https://ep2.adtrafficquality.google https://*.adtrafficquality.google https://va.vercel-scripts.com https://*.google-analytics.com",
              // Frames: Google AdSense ad iframes
              "frame-src 'self' https://googleads.g.doubleclick.net https://tpc.googlesyndication.com https://*.google.com",
              // Base URI restriction
              "base-uri 'self'",
              // Form action restriction
              "form-action 'self'",
              // Frame ancestors — same as X-Frame-Options SAMEORIGIN
              "frame-ancestors 'self'",
            ].join('; '),
          },
        ],
      },
    ];
  },
};

export default withBundleAnalyzer(withNextIntl(nextConfig));
