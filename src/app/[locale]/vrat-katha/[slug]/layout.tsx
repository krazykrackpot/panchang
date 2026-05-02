import type { Metadata } from 'next';
import { getVratKatha, getAllVratKathaSlugs } from '@/lib/content/vrat-kathas';

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://dekhopanchang.com';

export async function generateMetadata({ params }: { params: Promise<{ locale: string; slug: string }> }): Promise<Metadata> {
  const { locale, slug } = await params;
  const katha = getVratKatha(slug);
  if (!katha) return {};

  const title = (katha.title as Record<string, string>)[locale] || katha.title.en;
  const description = locale === 'hi'
    ? `${title} — सम्पूर्ण कथा, विधि और फल। Dekho Panchang पर पढ़ें।`
    : `${title} — Complete story, method, and benefits. Read on Dekho Panchang.`;

  return {
    title: `${title} | Dekho Panchang`,
    description,
    alternates: {
      canonical: `${BASE_URL}/${locale}/vrat-katha/${slug}`,
      languages: {
        en: `${BASE_URL}/en/vrat-katha/${slug}`,
        hi: `${BASE_URL}/hi/vrat-katha/${slug}`,
      },
    },
  };
}

export async function generateStaticParams() {
  return getAllVratKathaSlugs().map(slug => ({ slug }));
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
