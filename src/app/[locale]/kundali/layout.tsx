import type { Metadata } from 'next';
import Script from 'next/script';
import { getPageMetadata } from '@/lib/seo/metadata';
import { generateFAQLD } from '@/lib/seo/faq-data';
import { isDevanagariLocale } from '@/lib/utils/locale-fonts';
import { safeJsonLd } from '@/lib/seo/safe-jsonld';

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://dekhopanchang.com';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  return getPageMetadata('/kundali', locale);
}

export default async function KundaliLayout({ children, params }: { children: React.ReactNode; params: Promise<{ locale: string }> }) {
  const { locale } = await params;

  const softwareJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'Dekho Panchang — Kundali Generator',
    description: 'Free Vedic birth chart (Kundali) generator with planetary positions, Vimshottari Dasha, Shadbala, Ashtakavarga, divisional charts, and interpretive Tippanni.',
    url: `${BASE_URL}/${locale}/kundali`,
    applicationCategory: 'LifestyleApplication',
    operatingSystem: 'Web',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
    inLanguage: locale === 'hi' ? 'hi' : locale === 'sa' ? 'sa' : 'en',
  };

  const faqLD = generateFAQLD('/kundali', locale);

  const isHi = isDevanagariLocale(locale);
  const howToJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: isHi ? 'वैदिक जन्म कुण्डली कैसे बनाएं' : 'How to Generate a Vedic Birth Chart (Kundali)',
    description: isHi
      ? 'अपनी जन्म तिथि, समय और स्थान दर्ज करके निःशुल्क वैदिक कुण्डली बनाएं। ग्रह स्थिति, दशा, योग, दोष और उपाय देखें।'
      : 'Enter your birth date, time, and place to generate a free Vedic birth chart. See planetary positions, dashas, yogas, doshas, and remedies.',
    totalTime: 'PT2M',
    tool: { '@type': 'HowToTool', name: 'Dekho Panchang Kundali Generator' },
    step: [
      {
        '@type': 'HowToStep',
        position: 1,
        name: isHi ? 'नाम दर्ज करें' : 'Enter Name',
        text: isHi ? 'जिस व्यक्ति की कुण्डली बनानी है उसका नाम दर्ज करें।' : 'Enter the name of the person whose chart you want to generate.',
      },
      {
        '@type': 'HowToStep',
        position: 2,
        name: isHi ? 'जन्म तिथि और समय दर्ज करें' : 'Enter Birth Date and Time',
        text: isHi ? 'सटीक जन्म तिथि और समय दर्ज करें। समय जितना सटीक होगा, लग्न और भाव उतने सही होंगे।' : 'Enter the exact birth date and time. The more precise the time, the more accurate the Lagna and house positions.',
      },
      {
        '@type': 'HowToStep',
        position: 3,
        name: isHi ? 'जन्म स्थान चुनें' : 'Select Birth Place',
        text: isHi ? 'जन्म शहर खोजें और चुनें। अक्षांश, देशांतर और समय क्षेत्र स्वतः निर्धारित होंगे।' : 'Search and select the birth city. Latitude, longitude, and timezone are determined automatically.',
      },
      {
        '@type': 'HowToStep',
        position: 4,
        name: isHi ? 'कुण्डली बनाएं' : 'Generate Kundali',
        text: isHi ? '"कुण्डली बनाएं" बटन दबाएं। Swiss Ephemeris द्वारा सटीक ग्रह स्थिति, दशा, योग, दोष और 20+ विश्लेषण टैब तुरन्त प्रदर्शित होंगे।' : 'Click "Generate Kundali". Swiss Ephemeris computes precise planetary positions, dashas, yogas, doshas, and 20+ analysis tabs instantly.',
      },
    ],
  };

  return (
    <>
      <Script id="kundali-ld" type="application/ld+json" strategy="afterInteractive">{JSON.stringify(softwareJsonLd)}</Script>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(howToJsonLd) }} />
      {faqLD && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: safeJsonLd(faqLD) }}
        />
      )}
      {children}
    </>
  );
}
