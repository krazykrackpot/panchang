import type { Metadata } from 'next';
import { FESTIVAL_DETAILS } from '@/lib/constants/festival-details';

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

export default function CalendarSlugLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string; slug: string }>;
}) {
  return <CalendarSlugLayoutInner params={params}>{children}</CalendarSlugLayoutInner>;
}

async function CalendarSlugLayoutInner({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { slug } = await params;
  const festival = FESTIVAL_DETAILS[slug];

  if (!festival) {
    return <>{children}</>;
  }

  const nameEn = festival.name.en;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Event',
    name: nameEn,
    description: `${nameEn}: ${festival.significance.en}`.slice(0, 300),
    about: {
      '@type': 'Thing',
      name: nameEn,
      description: festival.mythology.en.slice(0, 200),
    },
    ...(festival.deity && {
      organizer: {
        '@type': 'Thing',
        name: festival.deity.en,
      },
    }),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {children}
    </>
  );
}
