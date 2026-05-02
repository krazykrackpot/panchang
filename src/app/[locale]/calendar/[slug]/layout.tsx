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

/** Find the next occurrence date + muhurta for a festival (current year or next) */
function getNextFestivalDate(slug: string): { date: string; year: number; pujaMuhurat?: { start: string; end: string; name: string } } | null {
  try {
    const now = new Date();
    const currentYear = now.getFullYear();
    // Check current year first, then next 3 years
    for (const year of [currentYear, currentYear + 1, currentYear + 2, currentYear + 3]) {
      // Use Ujjain coordinates (traditional Indian prime meridian)
      const festivals = generateFestivalCalendarV2(year, 23.1765, 75.7885, 'Asia/Kolkata');
      const match = festivals.find(f => f.slug === slug);
      if (match && (year > currentYear || match.date >= now.toISOString().slice(0, 10))) {
        return { date: match.date, year, pujaMuhurat: match.pujaMuhurat };
      }
    }
  } catch {
    // Festival computation may fail for some slugs — log and continue
    console.error(`[calendar-slug-meta] Failed to compute date for ${slug}`);
  }
  return null;
}

/** Format "2026-08-22" → "Oct 20" (short, for title — saves characters) */
function fmtShortDate(dateStr: string): string {
  const [y, m, d] = dateStr.split('-').map(Number);
  const date = new Date(Date.UTC(y, m - 1, d));
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', timeZone: 'UTC' });
}

/** Format "2026-08-22" → "22 August 2026" */
function fmtLongDate(dateStr: string): string {
  const [y, m, d] = dateStr.split('-').map(Number);
  const date = new Date(Date.UTC(y, m - 1, d));
  return date.toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' });
}

/** Format HH:MM 24h → "6:12 AM" 12h */
function fmt12h(hhmm: string): string {
  const [h, m] = hhmm.split(':').map(Number);
  const ampm = h >= 12 ? 'PM' : 'AM';
  const h12 = h % 12 || 12;
  return `${h12}:${m.toString().padStart(2, '0')} ${ampm}`;
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
  const yearStr = nextDate ? String(nextDate.year) : '';

  // Title under 60 chars: "Diwali 2026 — Oct 20 | Puja Time & Significance"
  let title: string;
  if (nextDate) {
    const shortDate = fmtShortDate(nextDate.date);
    if (nextDate.pujaMuhurat) {
      const pujaTime = fmt12h(nextDate.pujaMuhurat.start);
      title = `${name} ${yearStr} — ${shortDate}, Puja ${pujaTime}`;
    } else {
      title = `${name} ${yearStr} — ${shortDate} | Date & Significance`;
    }
  } else {
    title = `${name} — Date, Puja Vidhi & Significance`;
  }

  // Description under 155 chars with actual date
  let description: string;
  if (nextDate) {
    const longDate = fmtLongDate(nextDate.date);
    const muhurtaPart = nextDate.pujaMuhurat
      ? ` Puja muhurta: ${fmt12h(nextDate.pujaMuhurat.start)}\u2013${fmt12h(nextDate.pujaMuhurat.end)}.`
      : '';
    description = `${nameEn} ${yearStr} falls on ${longDate}.${muhurtaPart} Tithi timing, puja vidhi & significance.`;
    if (description.length > 155) {
      description = `${nameEn} ${yearStr} on ${longDate}.${muhurtaPart} Puja vidhi & significance.`;
    }
    if (description.length > 155) {
      description = description.slice(0, 152) + '...';
    }
  } else {
    description = `${nameEn}: ${festival.significance.en}`.slice(0, 155);
  }

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
