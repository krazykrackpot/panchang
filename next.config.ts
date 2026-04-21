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
  experimental: {
    optimizePackageImports: ['lucide-react', 'framer-motion'],
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
};

export default withBundleAnalyzer(withNextIntl(nextConfig));
