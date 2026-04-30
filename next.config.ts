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
    ],
    // Optimize CSS chunking — splits CSS by route for smaller critical CSS
    cssChunking: 'strict',
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
              "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://pagead2.googlesyndication.com https://www.googletagservices.com https://adservice.google.com https://va.vercel-scripts.com",
              // Styles: self + inline (Tailwind + Next.js) + Google Fonts
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
              // Fonts: self + Google Fonts CDN
              "font-src 'self' https://fonts.gstatic.com data:",
              // Images: self + data URIs + blob (for canvas/chart exports)
              "img-src 'self' data: blob: https://*.google.com https://*.googleapis.com",
              // API connections: self + Supabase + AI providers + geolocation + Nominatim
              "connect-src 'self' https://*.supabase.co wss://*.supabase.co https://api.anthropic.com https://api.openai.com https://api.cohere.com https://ipapi.co https://nominatim.openstreetmap.org https://pagead2.googlesyndication.com https://va.vercel-scripts.com https://*.google-analytics.com",
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
