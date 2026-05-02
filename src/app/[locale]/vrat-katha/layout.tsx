import type { Metadata } from 'next';
import { locales } from '@/lib/i18n/config';

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://dekhopanchang.com';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;

  const title = locale === 'hi'
    ? 'व्रत कथा संदर्भ — विधि, फल एवं समय | Dekho Panchang'
    : 'Vrat Katha Reference — Vidhi, Benefits & Timing | Dekho Panchang';

  const description = locale === 'hi'
    ? '10 पवित्र व्रतों का सम्पूर्ण संदर्भ — देवता, तिथि, विधि और फल। Dekho Panchang पर पढ़ें।'
    : 'Complete reference for 10 sacred Hindu vrats — deity, timing, vidhi, and benefits. Read on Dekho Panchang.';

  const alternateLanguages: Record<string, string> = {};
  for (const l of locales) {
    alternateLanguages[l] = `${BASE_URL}/${l}/vrat-katha`;
  }
  alternateLanguages['x-default'] = `${BASE_URL}/en/vrat-katha`;

  return {
    title,
    description,
    keywords: [
      'vrat katha',
      'hindu fasting stories',
      'vrat vidhi',
      'ekadashi vrat',
      'satyanarayan katha',
      'somvar vrat',
      'karva chauth',
    ],
    openGraph: {
      title,
      description,
      type: 'website',
      url: `${BASE_URL}/${locale}/vrat-katha`,
      siteName: 'Dekho Panchang',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
    alternates: {
      canonical: `${BASE_URL}/${locale}/vrat-katha`,
      languages: alternateLanguages,
    },
  };
}

export default async function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
