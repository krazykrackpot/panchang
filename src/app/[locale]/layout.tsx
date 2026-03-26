import { NextIntlClientProvider, useMessages } from 'next-intl';
import { getTranslations } from 'next-intl/server';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { locales, type Locale } from '@/lib/i18n/config';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import StarField from '@/components/layout/StarField';
import ServiceWorkerRegistrar from '@/components/layout/ServiceWorkerRegistrar';
import '@/styles/globals.css';

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://jyotishpanchang.com';

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
      template: `%s | Jyotish Panchang`,
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
      siteName: 'Jyotish Panchang',
      locale: locale === 'hi' ? 'hi_IN' : locale === 'sa' ? 'sa_IN' : 'en_US',
      type: 'website',
      images: [
        {
          url: `${BASE_URL}/og-image.png`,
          width: 1200,
          height: 630,
          alt: 'Jyotish Panchang — Vedic Astrology',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [`${BASE_URL}/og-image.png`],
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
    <html lang={locale} className="dark">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;0,700;1,400&family=Inter:wght@300;400;500;600;700&family=Tiro+Devanagari:ital@0;1&family=Noto+Sans+Devanagari:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'WebApplication',
              name: 'Jyotish Panchang',
              url: `${BASE_URL}/${locale}`,
              description: 'Vedic astrology Panchang calculations, Kundali birth charts, and Jyotish tools with trilingual support.',
              applicationCategory: 'LifestyleApplication',
              operatingSystem: 'Web',
              inLanguage: [locale],
              offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
              creator: {
                '@type': 'Organization',
                name: 'Jyotish Panchang',
                url: BASE_URL,
              },
            }),
          }}
        />
      </head>
      <body className="min-h-screen bg-bg-primary text-text-primary antialiased">
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
            {children}
          </main>
          <Footer />
          <ServiceWorkerRegistrar />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
