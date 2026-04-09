import { NextIntlClientProvider, useMessages } from 'next-intl';
import { getTranslations } from 'next-intl/server';
import { notFound } from 'next/navigation';
import Script from 'next/script';
import type { Metadata } from 'next';
import { locales, type Locale } from '@/lib/i18n/config';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import StarField from '@/components/layout/StarField';
import ServiceWorkerRegistrar from '@/components/layout/ServiceWorkerRegistrar';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { ScrollToTop } from '@/components/layout/ScrollToTop';
import '@/styles/globals.css';

import InstallPrompt from '@/components/pwa/InstallPrompt';
import OfflineBanner from '@/components/pwa/OfflineBanner';

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
      locale: locale === 'hi' ? 'hi_IN' : locale === 'sa' ? 'sa_IN' : 'en_US',
      type: 'website',
      images: [
        {
          url: `${BASE_URL}/opengraph-image`,
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
      images: [`${BASE_URL}/opengraph-image`],
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
  return locales.map((locale) => ({ locale }));
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
        <link
          href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;0,700;1,400&family=Inter:wght@300;400;500;600;700&family=Tiro+Devanagari:ital@0;1&family=Noto+Sans+Devanagari:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen bg-bg-primary text-text-primary antialiased" suppressHydrationWarning>
        <Script id="theme-init" strategy="beforeInteractive">{`try{localStorage.removeItem('theme');document.documentElement.classList.remove('light');document.documentElement.classList.add('dark')}catch(e){}`}</Script>
        <Script id="json-ld" type="application/ld+json" strategy="afterInteractive">{JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'WebApplication',
          name: 'Dekho Panchang',
          url: `${BASE_URL}/${locale}`,
          description: 'Vedic astrology Panchang calculations, Kundali birth charts, and Jyotish tools with trilingual support.',
          applicationCategory: 'LifestyleApplication',
          operatingSystem: 'Web',
          inLanguage: [locale],
          offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
          creator: { '@type': 'Organization', name: 'Dekho Panchang', url: BASE_URL },
        })}</Script>
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
          <ServiceWorkerRegistrar />
          <InstallPrompt />
          <OfflineBanner />
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
