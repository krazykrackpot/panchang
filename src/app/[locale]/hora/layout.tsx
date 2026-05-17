import { setRequestLocale } from 'next-intl/server';
import type { Metadata } from 'next';
import { getPageMetadata } from '@/lib/seo/metadata';
import { generateFAQLD } from '@/lib/seo/faq-data';
import { safeJsonLd } from '@/lib/seo/safe-jsonld';
import { todayPanchangForSEO } from '@/lib/seo/ctr-config';

const PLANET_NAMES_EN = ['Sun', 'Moon', 'Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn'];
const PLANET_NAMES_HI = ['सूर्य', 'चन्द्र', 'मंगल', 'बुध', 'बृहस्पति', 'शुक्र', 'शनि'];

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  setRequestLocale(locale);
  const base = getPageMetadata('/hora', locale);
  const seo = todayPanchangForSEO(locale);
  if (!seo) return base;

  const { p, dateStr, isHi } = seo;
  const weekday = p.vara?.day ?? new Date().getUTCDay();
  const lordName = isHi ? PLANET_NAMES_HI[weekday] : PLANET_NAMES_EN[weekday];

  const title = isHi
    ? `आज की होरा ${dateStr} – ${lordName} होरा से आरम्भ`
    : `Hora Today ${dateStr} – ${lordName} Hora at Sunrise`;

  const desc = isHi
    ? `${dateStr} होरा: सूर्योदय ${p.sunrise} से ${lordName} होरा। प्रत्येक ग्रह का शुभ समय जानें। शहर चुनें, सटीक गणना पाएँ।`
    : `${dateStr} planetary hours: ${lordName} hora from sunrise ${p.sunrise}. Know which planet rules each hour. Select your city for exact timings.`;

  return { ...base, title, description: desc };
}

export default async function Layout({ children, params }: { children: React.ReactNode; params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const faqLD = generateFAQLD('/hora', locale);
  return (
    <>
      {faqLD && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(faqLD) }} />
      )}
      {children}
    </>
  );
}
