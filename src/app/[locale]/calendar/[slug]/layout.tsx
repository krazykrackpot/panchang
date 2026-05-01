import type { Metadata } from 'next';
import { FESTIVAL_DETAILS } from '@/lib/constants/festival-details';
import { isDevanagariLocale } from '@/lib/utils/locale-fonts';
import { generateEventLD } from '@/lib/seo/structured-data';
import { safeJsonLd } from '@/lib/seo/safe-jsonld';
import { generateFestivalCalendarV2 } from '@/lib/calendar/festival-generator';

export function generateStaticParams() {
  return Object.keys(FESTIVAL_DETAILS).map(slug => ({ slug }));
}

type Props = { params: Promise<{ locale: string; slug: string }> };

/** Find the next occurrence date for a festival (current year or next) */
function getNextFestivalDate(slug: string): { date: string; year: number } | null {
  try {
    const now = new Date();
    const currentYear = now.getFullYear();
    // Check current year first, then next 3 years
    for (const year of [currentYear, currentYear + 1, currentYear + 2, currentYear + 3]) {
      // Use Ujjain coordinates (traditional Indian prime meridian)
      const festivals = generateFestivalCalendarV2(year, 23.1765, 75.7885, 'Asia/Kolkata');
      const match = festivals.find(f => f.slug === slug);
      if (match && (year > currentYear || match.date >= now.toISOString().slice(0, 10))) {
        return { date: match.date, year };
      }
    }
  } catch { /* Festival computation may fail for some slugs */ }
  return null;
}

/** Format date as "May 7, 2027" */
function formatFestivalDate(dateStr: string): string {
  const [y, m, d] = dateStr.split('-').map(Number);
  const date = new Date(Date.UTC(y, m - 1, d));
  return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric', timeZone: 'UTC' });
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  const festival = FESTIVAL_DETAILS[slug];

  if (!festival) {
    return { title: 'Festival Details — Dekho Panchang' };
  }

  const loc = locale as 'en' | 'hi' | 'sa';
  const name = festival.name[loc] || festival.name.en;
  const nameEn = festival.name.en;

  // Compute the actual date for the title
  const nextDate = getNextFestivalDate(slug);
  const dateStr = nextDate ? formatFestivalDate(nextDate.date) : '';
  const yearStr = nextDate ? String(nextDate.year) : '';

  // Title with actual date: "Diwali 2027 — October 29 | Puja Time & Significance"
  const title = nextDate
    ? `${name} ${yearStr} — ${dateStr} | Puja Time & Significance | Dekho Panchang`
    : `${name} — Date, Puja Vidhi & Significance | Dekho Panchang`;
  const description = nextDate
    ? `${nameEn} ${yearStr} falls on ${dateStr}. Exact Puja Muhurat, Tithi timing, and significance. ${festival.significance.en}`.slice(0, 160)
    : `${nameEn}: ${festival.significance.en}`.slice(0, 160);

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `https://dekhopanchang.com/${locale}/calendar/${slug}`,
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
      canonical: `https://dekhopanchang.com/en/calendar/${slug}`,
      languages: {
        en: `/en/calendar/${slug}`,
        hi: `/hi/calendar/${slug}`,
        sa: `/sa/calendar/${slug}`,
      },
    },
  };
}

export default async function CalendarSlugLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  const festival = FESTIVAL_DETAILS[slug];

  if (!festival) return <>{children}</>;

  const BASE_URL = 'https://dekhopanchang.com';
  const nameEn = festival.name.en;
  const description = `${nameEn}: ${festival.significance.en}`.slice(0, 160);

  const articleJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: `${nameEn} — Date, Puja Vidhi & Significance`,
    description,
    url: `${BASE_URL}/${locale}/calendar/${slug}`,
    publisher: {
      '@type': 'Organization',
      name: 'Dekho Panchang',
      url: BASE_URL,
    },
    inLanguage: locale === 'hi' ? 'hi' : locale === 'sa' ? 'sa' : 'en',
  };

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: `${BASE_URL}/${locale}` },
      { '@type': 'ListItem', position: 2, name: 'Festival Calendar', item: `${BASE_URL}/${locale}/calendar` },
      { '@type': 'ListItem', position: 3, name: nameEn, item: `${BASE_URL}/${locale}/calendar/${slug}` },
    ],
  };

  // Event JSON-LD — marks this as a calendar event for Google rich results
  const year = new Date().getFullYear();
  const eventJsonLd = generateEventLD({
    name: nameEn,
    startDate: `${year}-01-01`, // approximate; exact dates vary by lunar calendar each year
    description: festival.significance.en.slice(0, 300),
    url: `${BASE_URL}/${locale}/calendar/${slug}`,
  });

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: safeJsonLd(articleJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: safeJsonLd(eventJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: safeJsonLd(breadcrumbJsonLd) }}
      />
      {children}
    </>
  );
}
