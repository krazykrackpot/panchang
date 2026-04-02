import type { NextConfig } from "next";
import createNextIntlPlugin from 'next-intl/plugin';
import { resolve } from 'path';

const withNextIntl = createNextIntlPlugin('./src/lib/i18n/request.ts');

const nextConfig: NextConfig = {
  images: {
    domains: [],
  },
  turbopack: {
    root: resolve(__dirname),
  },
  // Include sweph native binary in serverless function bundles
  outputFileTracingIncludes: {
    '/api/**': ['./node_modules/sweph/**'],
    '/\\[locale\\]/**': ['./node_modules/sweph/**'],
  },
  serverExternalPackages: ['sweph'],
};

export default withNextIntl(nextConfig);
