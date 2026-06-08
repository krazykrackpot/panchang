import { setRequestLocale } from 'next-intl/server';
import type { Metadata } from 'next';
import { YOGA_DETAIL_DATA } from '@/lib/constants/yoga-details';
import { generateYogaCollectionLD, generateBreadcrumbLD } from '@/lib/seo/structured-data';
import { safeJsonLd } from '@/lib/seo/safe-jsonld';
import LearnArticleLD from '@/components/learn/LearnArticleLD';

import { BASE_URL } from '@/lib/seo/base-url';
import { pickByScript } from "@/lib/utils/locale-fonts";

const ACTIVE_LOCALES = ['en', 'hi', 'ta', 'bn'] as const;
const YOGA_COUNT = Object.keys(YOGA_DETAIL_DATA).length;

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  setRequestLocale(locale);
  const url = `${BASE_URL}/${locale}/learn/yoga`;

  const title = pickByScript(`Yoga Encyclopedia — ${YOGA_COUNT} Vedic Astrology Yogas | Dekho Panchang`, `योग विश्वकोश — ${YOGA_COUNT} वैदिक ज्योतिष योग | Dekho Panchang`, locale);
  const description = pickByScript(`Comprehensive guide to ${YOGA_COUNT} Vedic astrology yogas — Gajakesari, Budhaditya, Mangal Dosha, Kaal Sarpa, Pancha Mahapurusha and more. Formation rules, effects, remedies, and classical references.`, `गजकेसरी, बुधादित्य, मंगल दोष, काल सर्प, पंच महापुरुष और ${YOGA_COUNT - 5} अन्य योगों का विस्तृत विवरण — निर्माण नियम, प्रभाव, उपाय और शास्त्रीय सन्दर्भ।`, locale);

  const languages: Record<string, string> = {};
  for (const loc of ACTIVE_LOCALES) {
    languages[loc] = `${BASE_URL}/${loc}/learn/yoga`;
  }

  return {
    title,
    description,
    keywords: ['vedic astrology yogas', 'jyotish yoga', 'kundali yoga', 'birth chart combinations', 'gajakesari yoga', 'raja yoga', 'mangal dosha', 'kaal sarpa yoga'],
    openGraph: {
      title,
      description,
      url,
      type: 'website',
      siteName: 'Dekho Panchang',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
    alternates: {
      canonical: url,
      languages,
    },
  };
}

export default async function Layout({ children, params }: { children: React.ReactNode; params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);

  const collectionLD = generateYogaCollectionLD(locale, YOGA_COUNT);
  const breadcrumbLD = generateBreadcrumbLD(`/${locale}/learn/yoga`, locale);

  return (
    <>
      <LearnArticleLD route="/learn/yoga" locale={locale} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(collectionLD) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(breadcrumbLD) }} />
      {children}
    </>
  );
}
