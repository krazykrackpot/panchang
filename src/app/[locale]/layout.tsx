import { NextIntlClientProvider, useMessages } from 'next-intl';
import { getTranslations } from 'next-intl/server';
import { notFound } from 'next/navigation';
import Script from 'next/script';
import type { Metadata } from 'next';
import { locales, visibleLocales, type Locale } from '@/lib/i18n/config';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import StarField from '@/components/layout/StarField';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { ScrollToTop } from '@/components/layout/ScrollToTop';
import ClientShell from '@/components/layout/ClientShell';
import { generateSoftwareApplicationLD, generateOrganizationLD, generateWebSiteLD } from '@/lib/seo/structured-data';
import { inter, cinzel, cormorant, notoDevanagari, notoTamil, notoTelugu, notoBengali, notoKannada, notoGujarati } from '@/lib/fonts';
import { safeJsonLd } from '@/lib/seo/safe-jsonld';
import '@/styles/globals.css';

import { CONSENT_DEFAULT_SCRIPT } from '@/components/cookie-consent/consent-mode';

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://dekhopanchang.com';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
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
          alt: 'Dekho Panchang — Vedic Astrology',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
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
      icon: '/favicon.svg',
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
  // Pre-build only production locales to reduce CPU quota usage.
  // Other locales still render on-demand via SSR.
  return visibleLocales.map((locale: string) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!locales.includes(locale as Locale)) {
    notFound();
  }

  let messages;
  try {
    messages = (await import(`@/messages/${locale}.json`)).default;
  } catch {
    notFound();
  }

  return (
    <html lang={locale} className="dark" suppressHydrationWarning>
      <head>
        <link rel="alternate" type="application/rss+xml" title="Dekho Panchang" href="/api/feed" />
        <link rel="author" href="/llms.txt" />
      </head>
      <body className={`${inter.variable} ${cinzel.variable} ${cormorant.variable} ${notoDevanagari.variable} ${notoTamil.variable} ${notoTelugu.variable} ${notoBengali.variable} ${notoKannada.variable} ${notoGujarati.variable} min-h-screen bg-bg-primary text-text-primary antialiased`} suppressHydrationWarning>
        <Script id="theme-init" strategy="beforeInteractive">{`try{localStorage.removeItem('theme');document.documentElement.classList.remove('light');document.documentElement.classList.add('dark')}catch(e){}`}</Script>
        {/* Google Consent Mode v2 — MUST run before adsbygoogle.js below so
            consent defaults are set before AdSense initializes. */}
        <Script id="consent-default" strategy="beforeInteractive">{CONSENT_DEFAULT_SCRIPT}</Script>
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
          {/* Skip to main content — accessibility */}
          <a
            href="#main-content"
            className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:bg-gold-primary focus:text-bg-primary focus:rounded-lg focus:font-semibold"
          >
            Skip to main content
          </a>
          <StarField />
          <Navbar />
          <main id="main-content" className="relative z-10 pt-16 min-h-screen" role="main">
            <ScrollToTop />
            {children}
          </main>
          <Footer />
          <ClientShell locale={locale} />
          <Analytics />
          <SpeedInsights />
          {process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID && (
            <Script
              async
              src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID}`}
              crossOrigin="anonymous"
              strategy="lazyOnload"
            />
          )}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
