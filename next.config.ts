import type { NextConfig } from "next";
import createNextIntlPlugin from 'next-intl/plugin';
import bundleAnalyzer from '@next/bundle-analyzer';

const withNextIntl = createNextIntlPlugin('./src/lib/i18n/request.ts');

// Enable with `ANALYZE=true npm run build` to produce .next/analyze/*.html
// treemaps showing where bundle weight comes from.
const withBundleAnalyzer = bundleAnalyzer({ enabled: process.env.ANALYZE === 'true' });

const nextConfig: NextConfig = {
  turbopack: {
    root: __dirname,
  },
  experimental: {
    optimizePackageImports: ['lucide-react', 'framer-motion'],
  },
  images: {
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
