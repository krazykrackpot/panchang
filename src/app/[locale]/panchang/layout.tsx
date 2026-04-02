import type { Metadata } from 'next';
import Script from 'next/script';
import { getPageMetadata } from '@/lib/seo/metadata';

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://dekhopanchang.com';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  return getPageMetadata('/panchang', locale);
}

export default async function PanchangLayout({ children, params }: { children: React.ReactNode; params: Promise<{ locale: string }> }) {
  const { locale } = await params;

  const today = new Date().toISOString().split('T')[0];

  const eventJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Event',
    name: `Daily Panchang — ${today}`,
    description: 'Hindu Vedic Panchang with Tithi, Nakshatra, Yoga, Karana, Muhurta timings, sunrise/sunset, and planetary positions.',
    startDate: today,
    endDate: today,
    eventAttendanceMode: 'https://schema.org/OnlineEventAttendanceMode',
    eventStatus: 'https://schema.org/EventScheduled',
    url: `${BASE_URL}/${locale}/panchang`,
    organizer: {
      '@type': 'Organization',
      name: 'Dekho Panchang',
      url: BASE_URL,
    },
    location: {
      '@type': 'VirtualLocation',
      url: `${BASE_URL}/${locale}/panchang`,
    },
    inLanguage: locale === 'hi' ? 'hi' : locale === 'sa' ? 'sa' : 'en',
  };

  return (
    <>
      <Script id="panchang-ld" type="application/ld+json" strategy="afterInteractive">{JSON.stringify(eventJsonLd)}</Script>
      {children}
    </>
  );
}
