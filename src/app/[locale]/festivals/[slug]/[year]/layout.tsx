import { setRequestLocale } from 'next-intl/server';
import type { Metadata } from 'next';
import { CITIES, getCityBySlug } from '@/lib/constants/cities';
import { MAJOR_FESTIVALS } from '@/lib/calendar/festival-defs';
import { FESTIVAL_DETAILS } from '@/lib/constants/festival-details-with-overlay';
import { generateFestivalCalendarV2 } from '@/lib/calendar/festival-generator';
import { clearTithiTableCache } from '@/lib/calendar/tithi-table';
import { tl } from '@/lib/utils/trilingual';
import { locales } from '@/lib/i18n/config';
import { isStale } from '@/lib/seo/staleness';
import { isDevanagariLocale, isSuppressedSeoLocale } from '@/lib/utils/locale-fonts';
import {
  festivalCanonicalTitle,
  festivalCanonicalTitleHi,
  festivalCanonicalTitleLocale,
  festivalCanonicalDesc,
  festivalCanonicalDescHi,
  festivalCanonicalDescLocale,
  dateMuhuratLabel,
} from '@/lib/seo/ctr-config';

import { BASE_URL } from '@/lib/seo/base-url';

function ogLocale(locale: string): string {
  switch (locale) {
    case 'hi': return 'hi_IN';
    case 'mai': return 'mai_IN';
    case 'ta': return 'ta_IN';
    case 'te': return 'te_IN';
    case 'bn': return 'bn_IN';
    case 'gu': return 'gu_IN';
    case 'kn': return 'kn_IN';
    default: return 'en_US';
  }
}

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
  const festivalNameLocale = tl(detail.name, locale);

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
  // Pass actual puja time string so it appears in the SERP title for high-CTR "time" queries.
  //
  // Locale routing:
  //   - hi, mai (and sa) — Devanagari "कब है" formulation via festivalCanonicalTitleHi.
  //     Maithili shares Devanagari script and most festival vocabulary; reusing the
  //     Hindi formula matches what mai users actually type in GSC.
  //   - ta, te, bn, kn, gu — native-script festival name + native puja label via
  //     festivalCanonicalTitleLocale. Date stays in English digits (universally legible).
  //   - en — English template.
  const isHi = isDevanagariLocale(locale);
  const isNativeScript = !isHi && locale !== 'en';

  // Significance excerpt for description (locale-native if available, else English fallback).
  // Limit to ~80 chars so the date + name + puja time still fit in the 160-char window.
  const sigFull = tl(detail.significance, locale);
  const sigExcerpt = sigFull
    ? (sigFull.length > 80 ? `${sigFull.slice(0, 77)}...` : sigFull)
    : null;

  let title: string;
  if (festivalDate) {
    if (isHi) {
      title = festivalCanonicalTitleHi(festivalNameHi, year, festivalDate, !!pujaMuhuratStr, pujaMuhuratStr);
    } else if (isNativeScript) {
      title = festivalCanonicalTitleLocale(festivalNameLocale, year, festivalDate, !!pujaMuhuratStr, pujaMuhuratStr, locale);
    } else {
      title = festivalCanonicalTitle(festivalNameEn, year, festivalDate, !!pujaMuhuratStr, pujaMuhuratStr);
    }
  } else {
    if (isHi) {
      title = `${festivalNameHi} ${year} – तिथि व मुहूर्त`;
    } else if (isNativeScript) {
      title = `${festivalNameLocale} ${year} – ${dateMuhuratLabel(locale)}`;
    } else {
      title = `${festivalNameEn} ${year} – Date & Puja Muhurat`;
    }
  }

  let description: string;
  if (festivalDate) {
    if (isHi) {
      description = festivalCanonicalDescHi(festivalNameHi, year, festivalDate, pujaMuhuratStr);
    } else if (isNativeScript) {
      description = festivalCanonicalDescLocale(festivalNameLocale, year, festivalDate, pujaMuhuratStr, sigExcerpt, locale);
    } else {
      description = festivalCanonicalDesc(festivalNameEn, festivalDate, pujaMuhuratStr);
    }
  } else {
    description = (isHi
      ? `${festivalNameHi} ${year}: तिथि, पूजा मुहूर्त व समय। विधि, मंत्र व 800+ शहरों के समय।`
      : isNativeScript
      ? `${festivalNameLocale} ${year}: ${sigExcerpt || ''}`.trim().slice(0, 160)
      : `${festivalNameEn} ${year}: exact date, puja muhurat & time. Vidhi, mantras & samagri checklist. Free city-wise timings for 800+ cities.`
    ).slice(0, 160);
  }

  const url = `${BASE_URL}/${locale}/festivals/${slug}/${year}`;

  // Build alternates for all locales
  const languages: Record<string, string> = {};
  for (const alt of locales) {
    languages[alt] = `${BASE_URL}/${alt}/festivals/${slug}/${year}`;
  }
  languages['x-default'] = `${BASE_URL}/en/festivals/${slug}/${year}`;

  // Rule 3 — year staleness: festival pages for years older than
  // currentYear - 1 are stale (e.g., when now=2026, drop 2024 and
  // earlier; 2025 stays indexable for residual "diwali 2025"
  // searches lingering past year-end). See src/lib/seo/staleness.ts.
  // `isSuppressedSeoLocale(locale)` also suppresses retired locales
  // (Sanskrit) — defense in depth against any path that bypasses
  // proxy.ts's /sa/* → /en/* redirect. Matches the noindex pattern in
  // the sibling date-keyed routes. Gemini PR #390 HIGH.
  const yearNum = parseInt(year, 10);
  const noindex =
    isSuppressedSeoLocale(locale) ||
    (!isNaN(yearNum) && isStale({ kind: 'year-keyed', urlYear: yearNum }));

  return {
    title,
    description,
    ...(noindex && { robots: { index: false, follow: true } }),
    openGraph: {
      title,
      description,
      url,
      siteName: 'Dekho Panchang',
      locale: ogLocale(locale),
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
      // Canonical now points to the current locale (locale-self) rather
      // than always /en/. Unlocked by PR #511 shipping FESTIVAL_DETAILS
      // overlays for ta/te/bn/gu/kn/mai/mr (99.6% coverage). Before that,
      // non-EN festival URLs rendered substantially EN body content;
      // Google's content-similarity dedup correctly folded them into
      // /en — the "Alternative canonical" cohort the 2026-06-07 audit
      // surfaced. With real translations in place, each locale's page
      // is a distinct surface that should rank in its own market.
      // hreflang `languages` map (built above) declares the per-locale
      // alternates so Google still understands the translation graph.
      canonical: `${BASE_URL}/${locale}/festivals/${slug}/${year}`,
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
