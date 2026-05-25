import { NextIntlClientProvider, useMessages } from 'next-intl';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { headers } from 'next/headers';
import { notFound } from 'next/navigation';
import Script from 'next/script';
import type { Metadata } from 'next';
import { locales, visibleLocales, type Locale } from '@/lib/i18n/config';
import Navbar from '@/components/layout/Navbar';
import { SadhakaBanner } from '@/components/gamification/SadhakaBanner';
import { ChunkErrorListener } from '@/components/ChunkErrorListener';
import Footer from '@/components/layout/Footer';
import StarField from '@/components/layout/StarField';
// SignupPrompt (gentler modal: 3 page views / 90s, 3-day cooldown) loaded via ClientShell
import { Analytics } from '@vercel/analytics/react';
import { ScrollToTop } from '@/components/layout/ScrollToTop';
import ClientShell from '@/components/layout/ClientShell';
import { UtmCapture } from '@/components/layout/UtmCapture';
import { generateSoftwareApplicationLD, generateOrganizationLD, generateWebSiteLD } from '@/lib/seo/structured-data';
import { fontClassesForLocale } from '@/lib/fonts';
import { safeJsonLd } from '@/lib/seo/safe-jsonld';
import '@/styles/globals.css';

import { CONSENT_DEFAULT_SCRIPT } from '@/components/cookie-consent/consent-mode';

const BASE_URL = (process.env.NEXT_PUBLIC_SITE_URL || 'https://dekhopanchang.com').trim();

// Origin of the Supabase project — extracted at module load so the
// preconnect hint in <head> resolves to the right host. Falls back to
// the bare supabase.co apex if unset (preconnect to apex is harmless).
const SUPABASE_ORIGIN = (() => {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  if (!url) return 'https://supabase.co';
  try { return new URL(url).origin; } catch { return 'https://supabase.co'; }
})();

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: 'metadata' });

  const title = t('title');
  const description = t('description');
  const url = `${BASE_URL}/${locale}`;

  const alternateLanguages: Record<string, string> = {};
  for (const l of locales) {
    alternateLanguages[l] = `${BASE_URL}/${l}`;
  }
  alternateLanguages['x-default'] = `${BASE_URL}/en`;

  return {
    title: {
      default: title,
      template: `%s | Dekho Panchang`,
    },
    description,
    metadataBase: new URL(BASE_URL),
    alternates: {
      canonical: url,
      languages: alternateLanguages,
    },
    openGraph: {
      title,
      description,
      url,
      siteName: 'Dekho Panchang',
      locale: ({ hi: 'hi_IN', sa: 'sa_IN', ta: 'ta_IN', te: 'te_IN', bn: 'bn_IN', kn: 'kn_IN', mr: 'mr_IN', gu: 'gu_IN', mai: 'mai_IN' } as Record<string, string>)[locale] || 'en_US',
      type: 'website',
      images: [
        {
          url: `${BASE_URL}/${locale}/opengraph-image`,
          width: 1200,
          height: 630,
          alt: 'Dekho Panchang  –  Vedic Astrology',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      site: '@dekhopanchang',
      creator: '@dekhopanchang',
      title,
      description,
      images: [`${BASE_URL}/${locale}/twitter-image`],
    },
    robots: {
      index: true,
      follow: true,
      'max-image-preview': 'large' as const,
      'max-snippet': -1,
      'max-video-preview': -1,
    },
    icons: {
      icon: [
        { url: '/favicon.ico', sizes: '32x32' },
        { url: '/favicon.svg', type: 'image/svg+xml' },
        { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
        { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      ],
      apple: '/apple-touch-icon.png',
    },
    manifest: '/manifest.json',
    other: {
      'theme-color': '#0a0e27',
      'msapplication-TileColor': '#0a0e27',
    },
  };
}

export function generateStaticParams() {
  // Pre-build every active locale. The 4-locale cap was a band-aid for
  // the muhurta-combo prebuild that exploded the build into stack
  // overflow; with that route now returning [] (see
  // src/app/[locale]/muhurta/[type]/[year]/[month]/[city]/page.tsx),
  // the 8-locale prebuild fits comfortably under the 18 K ceiling.
  //
  // Dropping Maithili from prebuild silently demoted /mai/* URLs to
  // cold-ISR — Googlebot's first hit became a slow render, the ranking
  // model deprioritised the cluster, and Maithili clicks dropped. This
  // restores the static prerender for all 8 visible locales.
  return visibleLocales.map(locale => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  if (!locales.includes(locale as Locale)) {
    notFound();
  }

  // Read the Vercel geo header once at the layout level so client-side
  // components (notably BrihaspatiShell) can pick a sensible initial
  // currency. Returns undefined locally — that's fine, BrihaspatiShell
  // treats undefined as non-India → USD default.
  const hdrs = await headers();
  const country = hdrs.get('x-vercel-ip-country') ?? undefined;

  let messages;
  try {
    messages = (await import(`@/messages/${locale}.json`)).default;
  } catch {
    notFound();
  }

  return (
    <html lang={locale} className="dark" suppressHydrationWarning>
      <head>
        <meta name="google-adsense-account" content="ca-pub-4787764488539456" />
        <link rel="alternate" type="application/rss+xml" title="Dekho Panchang" href="/api/feed" />
        <link rel="author" href="/llms.txt" />
        <link rel="alternate" type="text/plain" href="/llms-full.txt" title="LLM Full Context" />
        {/* Preconnect critical third-party origins to shave 200-400ms off LCP.
            Audit 2026-05-25 §B (perf-cwv-remediation). Supabase hits on every
            authenticated page hydration; AdSense fires from AdUnit on ad
            routes; Vercel Analytics on all pages. */}
        <link rel="preconnect" href={SUPABASE_ORIGIN} crossOrigin="anonymous" />
        <link rel="dns-prefetch" href={SUPABASE_ORIGIN} />
        <link rel="preconnect" href="https://pagead2.googlesyndication.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://pagead2.googlesyndication.com" />
        <link rel="preconnect" href="https://va.vercel-scripts.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://va.vercel-scripts.com" />
      </head>
      <body className={`${fontClassesForLocale(locale)} min-h-screen bg-bg-primary text-text-primary antialiased`} suppressHydrationWarning>
        <Script id="theme-init" strategy="beforeInteractive">{`try{localStorage.removeItem('theme');document.documentElement.classList.remove('light');document.documentElement.classList.add('dark')}catch(e){}`}</Script>
        {/* Google Consent Mode v2 — fires before any adsbygoogle.js the
            AdUnit component may inject on ad-bearing routes. Consent
            defaults set here apply globally to every consent-aware vendor.
            Audit 2026-05-25 §A (perf-cwv-remediation). */}
        <Script id="consent-default" strategy="beforeInteractive">{CONSENT_DEFAULT_SCRIPT}</Script>
        {/* AdSense script is no longer loaded globally — `AdUnit.tsx` injects
            it on-demand only on routes that render ads. Saves ~80KB +
            one TLS handshake on every ad-free route (dashboard, kundali,
            brihaspati, panchang, …). */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: safeJsonLd(generateOrganizationLD()) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: safeJsonLd(generateWebSiteLD()) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: safeJsonLd(generateSoftwareApplicationLD()) }}
        />
        <NextIntlClientProvider locale={locale} messages={messages}>
          {/* Skip to main content  –  accessibility */}
          <a
            href="#main-content"
            className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:bg-gold-primary focus:text-bg-primary focus:rounded-lg focus:font-semibold"
          >
            Skip to main content
          </a>
          <ChunkErrorListener />
          <StarField />
          <Navbar />
          <SadhakaBanner locale={locale} />
          {/* No `overflow-x` here on purpose. Any non-visible overflow
              value (`hidden`, `clip`, `auto`) makes <main> a scroll container
              or causes the spec to normalise the other axis to `auto` —
              either of which traps `position: sticky` on descendants. The
              tithi calendar's day-name header depends on document-scroll
              sticky. */}
          <main id="main-content" className="relative z-10 pt-16 min-h-screen" role="main">
            <ScrollToTop />
            {children}
          </main>
          <Footer />
          <ClientShell locale={locale} country={country} />
          <Analytics />
          <UtmCapture />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
