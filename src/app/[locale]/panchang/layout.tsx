import type { Metadata } from 'next';

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://jyotishpanchang.com';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;

  const titles: Record<string, string> = {
    en: "Today's Panchang — Tithi, Nakshatra, Yoga, Karana",
    hi: 'आज का पंचांग — तिथि, नक्षत्र, योग, करण',
    sa: 'अद्य पञ्चाङ्गम् — तिथिः, नक्षत्रम्, योगः, करणम्',
  };
  const descriptions: Record<string, string> = {
    en: 'Daily Panchang with accurate Tithi, Nakshatra, Yoga, Karana, Muhurta timings, planetary positions, and auspicious/inauspicious periods.',
    hi: 'दैनिक पंचांग — सटीक तिथि, नक्षत्र, योग, करण, मुहूर्त समय, ग्रह स्थिति, शुभ-अशुभ काल।',
    sa: 'दैनिकं पञ्चाङ्गम् — तिथिः, नक्षत्रम्, योगः, करणम्, मुहूर्तकालाः, ग्रहस्थितयः।',
  };

  return {
    title: titles[locale] || titles.en,
    description: descriptions[locale] || descriptions.en,
    openGraph: {
      title: titles[locale] || titles.en,
      description: descriptions[locale] || descriptions.en,
      url: `${BASE_URL}/${locale}/panchang`,
    },
  };
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
      name: 'Jyotish Panchang',
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
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(eventJsonLd) }}
      />
      {children}
    </>
  );
}
