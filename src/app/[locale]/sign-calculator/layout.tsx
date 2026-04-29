import type { Metadata } from 'next';
import { getPageMetadata } from '@/lib/seo/metadata';
import { generateFAQLD } from '@/lib/seo/faq-data';
import { generateToolLD, generateHowToLD } from '@/lib/seo/structured-data';
import { safeJsonLd } from '@/lib/seo/safe-jsonld';

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://dekhopanchang.com';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  return getPageMetadata('/sign-calculator', locale);
}

export default async function Layout({ children, params }: { children: React.ReactNode; params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const faqLD = generateFAQLD('/sign-calculator', locale);

  const toolLD = generateToolLD(
    'Vedic Sign Calculator',
    'Find your Vedic Rashi (Moon sign), Sun sign, and Lagna (Ascendant) from your birth details using precise astronomical calculations.',
    `${BASE_URL}/${locale}/sign-calculator`,
  );

  const howToLD = generateHowToLD({
    name: 'How to Find Your Vedic Moon Sign (Rashi)',
    description: 'Calculate your Vedic Moon sign, Sun sign, and Ascendant using your exact birth date, time, and place.',
    steps: [
      { name: 'Enter your birth date', text: 'Select your date of birth from the calendar picker.' },
      { name: 'Enter your birth time', text: 'Enter your exact time of birth. Accuracy to the minute matters for Lagna calculation.' },
      { name: 'Enter your birthplace', text: 'Search for your birth city. The tool resolves coordinates and timezone automatically.' },
      { name: 'View your signs', text: 'Your Vedic Moon sign (Rashi), Sun sign, and Lagna (Ascendant) are computed instantly using Meeus algorithms.' },
    ],
  });

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(toolLD) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(howToLD) }} />
      {faqLD && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(faqLD) }} />
      )}
      {children}
    </>
  );
}
