import { setRequestLocale } from 'next-intl/server';
import type { Metadata } from 'next';
import { CITIES, getCityBySlug } from '@/lib/constants/cities';
import { MAJOR_FESTIVALS } from '@/lib/calendar/festival-defs';
import { FESTIVAL_DETAILS } from '@/lib/constants/festival-details';
import { generateFestivalCalendarV2 } from '@/lib/calendar/festival-generator';
import { clearTithiTableCache } from '@/lib/calendar/tithi-table';
import { tl } from '@/lib/utils/trilingual';
import { locales } from '@/lib/i18n/config';
import {
  festivalCanonicalTitle,
  festivalCanonicalTitleHi,
  festivalCanonicalDesc,
} from '@/lib/seo/ctr-config';

const BASE_URL = (process.env.NEXT_PUBLIC_SITE_URL || 'https://dekhopanchang.com').trim();

/** Format HH:MM 24h → "6:12 AM" 12h */
function fmt12h(hhmm: string): string {
  const [h, m] = hhmm.split(':').map(Number);
  const ampm = h >= 12 ? 'PM' : 'AM';
  const h12 = h % 12 || 12;
  return `${h12}:${m.toString().padStart(2, '0')} ${ampm}`;
}

type Props = {
  params: Promise<{ locale: string; slug: string; year: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug, year } = await params;
  setRequestLocale(locale);

  const detail = FESTIVAL_DETAILS[slug];
  const def = MAJOR_FESTIVALS.find(f => f.slug === slug);

  if (!detail || !def) {
    return { title: 'Festival' };
  }

  const festivalNameEn = tl(detail.name, 'en');
  const festivalNameHi = tl(detail.name, 'hi');

  // Use Delhi as reference city for computing the national date
  const delhiCity = getCityBySlug('delhi');
  let festivalDate = '';
  let pujaMuhuratStr: string | null = null;

  try {
    const yearNum = parseInt(year, 10);
    if (!isNaN(yearNum) && yearNum >= 2025 && yearNum <= 2029 && delhiCity) {
      const festivals = generateFestivalCalendarV2(yearNum, delhiCity.lat, delhiCity.lng, delhiCity.timezone);
      clearTithiTableCache();
      const entry = festivals.find(f => f.slug === slug);
      if (entry) {
        festivalDate = entry.date;
        if (entry.pujaMuhurat) {
          pujaMuhuratStr = `${fmt12h(entry.pujaMuhurat.start)}\u2013${fmt12h(entry.pujaMuhurat.end)}`;
        }
      }
    }
  } catch {
    // If computation fails, fall back to generic title — don't block metadata
    console.error(`[festival-canonical-meta] Failed to compute date for ${slug}/${year}`);
  }

  // Build title using ctr-config formulas (no "| Dekho Panchang" — root layout template handles it)
  // Pass actual puja time string so it appears in the SERP title for high-CTR "time" queries
  const isHi = locale === 'hi';
  let title: string;
  if (festivalDate) {
    title = isHi
      ? festivalCanonicalTitleHi(festivalNameHi, year, festivalDate, !!pujaMuhuratStr, pujaMuhuratStr)
      : festivalCanonicalTitle(festivalNameEn, year, festivalDate, !!pujaMuhuratStr, pujaMuhuratStr);
  } else {
    title = isHi
      ? `${festivalNameHi} ${year} – तिथि व मुहूर्त`
      : `${festivalNameEn} ${year} – Date & Puja Muhurat`;
  }

  // Build description using ctr-config formula
  const TOP_CITY_COUNT = 6;
  let description: string;
  if (festivalDate) {
    description = festivalCanonicalDesc(festivalNameEn, festivalDate, pujaMuhuratStr, TOP_CITY_COUNT);
  } else {
    description = `${festivalNameEn} ${year}: exact date, puja muhurat & time. Vidhi, mantras & samagri checklist. Free city-wise timings for 800+ cities.`.slice(0, 160);
  }

  const url = `${BASE_URL}/${locale}/festivals/${slug}/${year}`;

  // Build alternates for all locales
  const languages: Record<string, string> = {};
  for (const alt of locales) {
    languages[alt] = `${BASE_URL}/${alt}/festivals/${slug}/${year}`;
  }
  languages['x-default'] = `${BASE_URL}/en/festivals/${slug}/${year}`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url,
      siteName: 'Dekho Panchang',
      locale: locale === 'hi' ? 'hi_IN' : locale === 'sa' ? 'sa_IN' : 'en_US',
      type: 'article',
      images: [
        {
          url: `${BASE_URL}/${locale}/festivals/opengraph-image`,
          width: 1200,
          height: 630,
          alt: `${festivalNameEn} ${year}`,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [`${BASE_URL}/${locale}/festivals/opengraph-image`],
    },
    alternates: {
      canonical: `${BASE_URL}/en/festivals/${slug}/${year}`,
      languages,
    },
  };
}

export default async function FestivalCanonicalLayout({
  children,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string; slug: string; year: string }>;
}) {
  return <>{children}</>;
}
