import { setRequestLocale } from 'next-intl/server';
import type { Metadata } from 'next';
import { getCityBySlugExtended } from '@/lib/constants/cities-extended';
import { MAJOR_FESTIVALS } from '@/lib/calendar/festival-defs';
import { FESTIVAL_DETAILS } from '@/lib/constants/festival-details';
import { generateFestivalCalendarV2 } from '@/lib/calendar/festival-generator';
import { clearTithiTableCache } from '@/lib/calendar/tithi-table';
import { formatMinutesHHMM } from '@/lib/astronomy/sunrise';
// Audit P5d #22: canonical Swiss+Meeus sunrise pipeline.
import { getSunriseSunsetLocalMinutes } from '@/lib/ephem/sunrise-sunset-local';
import { getUTCOffsetForDate } from '@/lib/utils/timezone';
import { tl } from '@/lib/utils/trilingual';
import { locales } from '@/lib/i18n/config';

import { BASE_URL } from '@/lib/seo/base-url';

/** Format "2026-08-22" → "Aug 22" (short, for title  –  saves characters) */
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
  setRequestLocale(locale);

  // 1. Switched from getCityBySlug (~50 base cities) to extended (325)
  //    because /festivals/<slug>/<year>/[city] serves any extended city.
  //    The old base lookup left ~125 city slugs un-resolved, which hit
  //    the early bailout below — and the early bailout did NOT set
  //    robots:noindex. Result: extended-only cities (washington-dc,
  //    karnal, …) shipped with `index, follow` despite being templated
  //    regional variants, exactly the pattern Google should NOT see in
  //    its main index. GSC 2026-06-07 export confirmed ~140 such URLs
  //    in the "Crawled, currently not indexed" bucket.
  //
  // 2. Build `baseMeta` up-front with canonical + noindex so the early
  //    bailout ALSO emits the right SEO signals — mirror of the muhurta
  //    [city] layout (src/app/[locale]/muhurta/[type]/[year]/[month]/[city]
  //    /layout.tsx) which has done this since #383.
  const cityData = getCityBySlugExtended(city);
  const detail = FESTIVAL_DETAILS[slug];
  const def = MAJOR_FESTIVALS.find(f => f.slug === slug);

  // Festival + year MUST be valid before we emit a canonical. The proxy
  // (PR #500) already 404s unknown festival slugs at the edge and
  // isInvalidYearPath rejects bad years — so this path is defence-in-
  // depth. But if either reaches here (e.g. drift between
  // CANONICAL_FESTIVAL_SLUGS and FESTIVAL_DETAILS, or a future code
  // path that bypasses the proxy), we still need to refuse to point
  // canonical at a URL the no-city year-route page would itself
  // notFound on. Gemini PR #503 round-2 HIGH.
  // Strict 4-digit regex BEFORE parseInt — `parseInt('2026-foo')` returns
  // 2026, which would otherwise pass the numeric range check and pollute
  // the canonical URL with the malformed segment. Gemini PR #503 round-3.
  const yearNum = parseInt(year, 10);
  const isYearValid = /^\d{4}$/.test(year) && yearNum >= 2024 && yearNum <= 2030;
  if (!detail || !def || !isYearValid) {
    return {
      title: 'Festival  –  Dekho Panchang',
      robots: { index: false, follow: false },
    };
  }

  // Canonical mirrors the success path below — always /en/ (consolidation
  // hreflang strategy this surface has used since route inception:
  // every locale variant points to /en, languages map provides per-
  // locale alternatives, signals consolidate at the EN URL). Keeping
  // baseMeta locale-specific would mid-flight-split the strategy.
  // Gemini PR #503 round-1 HIGH.
  const baseMeta: Metadata = {
    alternates: { canonical: `${BASE_URL}/en/festivals/${slug}/${year}` },
    robots: { index: false, follow: true },
  };

  if (!cityData) {
    return { ...baseMeta, title: 'Festival  –  Dekho Panchang' };
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
        const sunTimes = getSunriseSunsetLocalMinutes(fy, fm, fd, cityData.lat, cityData.lng, tzOffset);
        // tz-safe: format from minute fields, not Date accessors
        // (Audit P0-15 follow-up).
        sunriseStr = fmt12h(formatMinutesHHMM(sunTimes.sunriseMinutes));
        sunsetStr = fmt12h(formatMinutesHHMM(sunTimes.sunsetMinutes));
      }
    }
  } catch {
    // If computation fails, fall back to generic title  –  don't block metadata
    console.error(`[festival-meta] Failed to compute date for ${slug}/${year}/${city}`);
  }

  // Build title with actual date (under 60 chars target)
  // e.g. "Ganesh Chaturthi 2027 Mumbai  –  Aug 22, Puja 11:05 AM"
  let title: string;
  if (festivalDate) {
    const shortDate = fmtShortDate(festivalDate);
    if (pujaMuhuratStr) {
      title = `${festivalNameEn} ${year} ${cityNameEn}  –  ${shortDate}, Puja ${pujaMuhuratStr}`;
    } else {
      title = `${festivalNameEn} ${year} ${cityNameEn}  –  ${shortDate}, Sunrise ${sunriseStr}`;
    }
  } else {
    title = `${festivalNameEn} ${year} in ${cityNameEn}  –  Date & Puja Time`;
  }

  // Build description with actual timings (under 155 chars)
  let description: string;
  if (festivalDate) {
    const longDate = fmtLongDate(festivalDate);
    const muhurtaPart = pujaMuhuratStr ? ` Puja: ${pujaMuhuratStr}.` : '';
    const sunPart = sunriseStr ? ` Sunrise ${sunriseStr}, Sunset ${sunsetStr}.` : '';
    description = `${festivalNameEn} in ${cityNameEn} on ${longDate}.${muhurtaPart}${sunPart} Step-by-step puja vidhi, mantras & samagri list inside.`;
    if (description.length > 155) {
      description = `${festivalNameEn} in ${cityNameEn} on ${longDate}.${muhurtaPart} Step-by-step puja vidhi, mantras & samagri list inside.`;
    }
    if (description.length > 155) {
      description = description.slice(0, 152) + '...';
    }
  } else {
    description = `${festivalNameEn} ${year} in ${cityNameEn}: exact date & puja muhurta. Step-by-step vidhi, mantras & samagri checklist.`.slice(0, 155);
  }

  const url = `${BASE_URL}/${locale}/festivals/${slug}/${year}/${city}`;

  // Build alternates for all locales — point to canonical (no city) URLs
  const languages: Record<string, string> = {};
  for (const alt of locales) {
    languages[alt] = `${BASE_URL}/${alt}/festivals/${slug}/${year}`;
  }
  languages['x-default'] = `${BASE_URL}/en/festivals/${slug}/${year}`;

  return {
    title,
    description,
    // City-variant pages are noindexed — canonical is the no-city URL.
    // Google consolidates signals from city variants to the canonical page.
    robots: { index: false, follow: true },
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
          alt: `${festivalNameEn} ${year} in ${cityNameEn}`,
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

export default async function FestivalCityLayout({
  children,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string; slug: string; year: string; city: string }>;
}) {
  return <>{children}</>;
}
