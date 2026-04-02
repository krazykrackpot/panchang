import type { NextConfig } from "next";
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./src/lib/i18n/request.ts');

const nextConfig: NextConfig = {
  images: {
    domains: [],
  },
  trailingSlash: false,
  // Include sweph native binary in serverless function bundles
  outputFileTracingIncludes: {
    '/api/**': ['./node_modules/sweph/**'],
    '/\\[locale\\]/**': ['./node_modules/sweph/**'],
  },
  serverExternalPackages: ['sweph'],
};

export default withNextIntl(nextConfig);
