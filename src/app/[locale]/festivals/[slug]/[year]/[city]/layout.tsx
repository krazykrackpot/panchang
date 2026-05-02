import type { Metadata } from 'next';
import { getCityBySlug } from '@/lib/constants/cities';
import { MAJOR_FESTIVALS } from '@/lib/calendar/festival-defs';
import { FESTIVAL_DETAILS } from '@/lib/constants/festival-details';
import { generateFestivalCalendarV2 } from '@/lib/calendar/festival-generator';
import { clearTithiTableCache } from '@/lib/calendar/tithi-table';
import { getSunTimes } from '@/lib/astronomy/sunrise';
import { getUTCOffsetForDate } from '@/lib/utils/timezone';
import { tl } from '@/lib/utils/trilingual';
import { locales } from '@/lib/i18n/config';

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://dekhopanchang.com';

/** Format "2026-08-22" → "Aug 22" (short, for title — saves characters) */
function fmtShortDate(dateStr: string): string {
  const [y, m, d] = dateStr.split('-').map(Number);
  const date = new Date(Date.UTC(y, m - 1, d));
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', timeZone: 'UTC' });
}

/** Format "2026-08-22" → "22 August 2026" (long, for description) */
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

type Props = {
  params: Promise<{ locale: string; slug: string; year: string; city: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug, year, city } = await params;

  const cityData = getCityBySlug(city);
  const detail = FESTIVAL_DETAILS[slug];
  const def = MAJOR_FESTIVALS.find(f => f.slug === slug);

  if (!cityData || !detail || !def) {
    return { title: 'Festival — Dekho Panchang' };
  }

  const festivalNameEn = tl(detail.name, 'en');
  const cityNameEn = cityData.name.en;

  // Compute the actual festival date + muhurta for this city/year
  let festivalDate = '';
  let pujaMuhuratStr = '';
  let sunriseStr = '';
  let sunsetStr = '';
  try {
    const yearNum = parseInt(year, 10);
    if (!isNaN(yearNum) && yearNum >= 2024 && yearNum <= 2030) {
      const festivals = generateFestivalCalendarV2(yearNum, cityData.lat, cityData.lng, cityData.timezone);
      clearTithiTableCache();
      const entry = festivals.find(f => f.slug === slug);
      if (entry) {
        festivalDate = entry.date;
        if (entry.pujaMuhurat) {
          pujaMuhuratStr = `${fmt12h(entry.pujaMuhurat.start)}\u2013${fmt12h(entry.pujaMuhurat.end)}`;
        }
        const [fy, fm, fd] = entry.date.split('-').map(Number);
        const tzOffset = getUTCOffsetForDate(fy, fm, fd, cityData.timezone);
        const sunTimes = getSunTimes(fy, fm, fd, cityData.lat, cityData.lng, tzOffset);
        const srH = sunTimes.sunrise.getHours().toString().padStart(2, '0');
        const srM = sunTimes.sunrise.getMinutes().toString().padStart(2, '0');
        sunriseStr = fmt12h(`${srH}:${srM}`);
        const ssH = sunTimes.sunset.getHours().toString().padStart(2, '0');
        const ssM = sunTimes.sunset.getMinutes().toString().padStart(2, '0');
        sunsetStr = fmt12h(`${ssH}:${ssM}`);
      }
    }
  } catch {
    // If computation fails, fall back to generic title — don't block metadata
    console.error(`[festival-meta] Failed to compute date for ${slug}/${year}/${city}`);
  }

  // Build title with actual date (under 60 chars target)
  // e.g. "Ganesh Chaturthi 2027 Mumbai — Aug 22, Puja 11:05 AM"
  let title: string;
  if (festivalDate) {
    const shortDate = fmtShortDate(festivalDate);
    if (pujaMuhuratStr) {
      title = `${festivalNameEn} ${year} ${cityNameEn} — ${shortDate}, Puja ${pujaMuhuratStr}`;
    } else {
      title = `${festivalNameEn} ${year} ${cityNameEn} — ${shortDate}, Sunrise ${sunriseStr}`;
    }
  } else {
    title = `${festivalNameEn} ${year} in ${cityNameEn} — Date & Puja Time`;
  }

  // Build description with actual timings (under 155 chars)
  let description: string;
  if (festivalDate) {
    const longDate = fmtLongDate(festivalDate);
    const muhurtaPart = pujaMuhuratStr ? ` Puja: ${pujaMuhuratStr}.` : '';
    const sunPart = sunriseStr ? ` Sunrise ${sunriseStr}, Sunset ${sunsetStr}.` : '';
    description = `${festivalNameEn} in ${cityNameEn} on ${longDate}.${muhurtaPart}${sunPart} Puja vidhi & significance.`;
    if (description.length > 155) {
      // Trim to fit — drop sun times first
      description = `${festivalNameEn} in ${cityNameEn} on ${longDate}.${muhurtaPart} Puja vidhi & significance.`;
    }
    if (description.length > 155) {
      description = description.slice(0, 152) + '...';
    }
  } else {
    description = `${festivalNameEn} ${year} in ${cityNameEn}: exact date, Puja Muhurta, sunrise & significance. Free, no ads.`.slice(0, 155);
  }

  const url = `${BASE_URL}/${locale}/festivals/${slug}/${year}/${city}`;

  // Build alternates for all locales
  const languages: Record<string, string> = {};
  for (const alt of locales) {
    languages[alt] = `${BASE_URL}/${alt}/festivals/${slug}/${year}/${city}`;
  }
  languages['x-default'] = `${BASE_URL}/en/festivals/${slug}/${year}/${city}`;

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
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
    alternates: {
      canonical: `${BASE_URL}/en/festivals/${slug}/${year}/${city}`,
      languages,
    },
  };
}

export default async function FestivalCityLayout({
  children,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string; slug: string; year: string; city: string }>;
}) {
  return <>{children}</>;
}
