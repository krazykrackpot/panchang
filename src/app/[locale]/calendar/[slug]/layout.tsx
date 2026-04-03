import type { Metadata } from 'next';
import { FESTIVAL_DETAILS } from '@/lib/constants/festival-details';

export function generateStaticParams() {
  return Object.keys(FESTIVAL_DETAILS).map(slug => ({ slug }));
}

type Props = { params: Promise<{ locale: string; slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  const festival = FESTIVAL_DETAILS[slug];

  if (!festival) {
    return { title: 'Festival Details — Dekho Panchang' };
  }

  const loc = locale as 'en' | 'hi' | 'sa';
  const name = festival.name[loc] || festival.name.en;
  const nameEn = festival.name.en;
  const title = `${name} — Date, Puja Vidhi & Significance | Dekho Panchang`;
  const description = `${nameEn}: ${festival.significance.en}`.slice(0, 160);

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `https://www.dekhopanchang.com/${locale}/calendar/${slug}`,
      siteName: 'Dekho Panchang',
      locale: locale === 'hi' ? 'hi_IN' : locale === 'sa' ? 'sa_IN' : 'en_US',
      type: 'article',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
    alternates: {
      canonical: `https://www.dekhopanchang.com/en/calendar/${slug}`,
      languages: {
        en: `/en/calendar/${slug}`,
        hi: `/hi/calendar/${slug}`,
        sa: `/sa/calendar/${slug}`,
      },
    },
  };
}

export default function CalendarSlugLayout({ children }: { children: React.ReactNode }) {
  return children;
}
