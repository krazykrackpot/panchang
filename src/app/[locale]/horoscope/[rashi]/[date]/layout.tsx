import { setRequestLocale } from 'next-intl/server';
import type { Metadata } from 'next';
import { RASHIS } from '@/lib/constants/rashis';
import { getRashiBySlug } from '@/lib/constants/rashi-slugs';
import { safeJsonLd } from '@/lib/seo/safe-jsonld';
import { generateBreadcrumbLD } from '@/lib/seo/structured-data';
import { tl } from '@/lib/utils/trilingual';
import { isDevanagariLocale, isSuppressedSeoLocale, formatSeoDate } from '@/lib/utils/locale-fonts';
import { horoscopeDateSeo } from '@/lib/seo/date-page-seo';
import { isStrictYmd } from '@/lib/seo/date-validation';
import { isStale } from '@/lib/seo/staleness';
import { type Locale } from '@/lib/i18n/config';
import { isLocaleIndexable } from '@/lib/seo/indexable-locales';
import { buildIndexableHreflang } from '@/lib/seo/hreflang';

import { BASE_URL } from '@/lib/seo/base-url';

export const revalidate = 86400; // ISR: daily — content is deterministic per date

export function generateStaticParams() {
  // ISR: rendered on-demand, not pre-built (keeps deploy under 10 min)
  return [];
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string; rashi: string; date: string }> }): Promise<Metadata> {
  const { locale, rashi: slug, date } = await params;
  setRequestLocale(locale);
  const r = getRashiBySlug(slug);
  if (!r) return {};

  // Format + strict round-trip. Empty metadata for non-dates ('weekly',
  // 'monthly' — handled by sibling routes) and rollover dates like
  // 2026-02-30. The proxy already 404s rollover URLs at the edge, but
  // we still need empty metadata here to avoid emitting hreflang /
  // canonical for the rare case the metadata renders during build.
  if (!isStrictYmd(date)) return {};
  const [y, m, d] = date.split('-').map(Number);

  const vedicName = tl(r.name, locale);
  const westernName = r.name.en;
  const hindiName = r.name.hi;
  // Locale-aware date — Marathi gets "1 मे 2026", Hindi/Maithili/Sanskrit
  // get the tuned "1 जून 2026", English gets "1 June 2026". Previously
  // `en-US` was hardcoded → Marathi titles read "June 1, 2026 चे..." and
  // Hindi titles read "June 1, 2026" mixed with Hindi grammar.
  // Gemini PR #329 MEDIUM.
  const formatted = formatSeoDate(y, m, d, locale);

  // Per-locale title / description / keywords come from the exhaustive
  // `horoscopeDateSeo()` helper. If a new locale is added to `Locale`,
  // the helper fails to type-check until each new `case` is handled,
  // making it structurally impossible to ship the "Hindi-fallback
  // duplicate title" bug that crashed Marathi + Maithili 2026-05-31.
  //
  // `rashiName` choice per locale: Trilingual only has en/hi/sa, so for
  // bn/te/gu/kn/ta we pass the English name (current fallback). For mr
  // and mai we pass `hindiName` to preserve the existing Devanagari
  // rendering — those locales don't have native rashi name tables yet.
  // hindiName falls back to westernName if the Trilingual entry is
  // partial — every existing rashi has both, but the type isn't strict.
  const rashiNameForLocale =
    locale === 'hi' || locale === 'mr' || locale === 'mai' || locale === 'sa'
      ? (hindiName ?? westernName)
      : westernName;
  const { title, description, keywords } = horoscopeDateSeo({
    locale: locale as Locale,
    humanDate: formatted,
    rashiName: rashiNameForLocale,
  });

  const route = `/horoscope/${slug}/${date}`;

  // Three independent reasons to noindex this URL:
  //   - thin-coverage policy: regional Indic locales render the same
  //     en/hi content as the canonical (the horoscope engine is en+hi
  //     only); covered by `!isLocaleIndexable`, which also subsumes
  //     the sa retirement check.
  //   - Sanskrit (sa) retirement: kept as a redundant explicit check
  //     for clarity; the predicate already excludes sa for /horoscope/.
  //   - Staleness: URLs >14 days from today (past or future) noindex
  //     so Google drops them. See src/lib/seo/staleness.ts.
  const isIndexable = isLocaleIndexable(route, locale);
  const noindex =
    !isIndexable
    || isSuppressedSeoLocale(locale)
    || isStale({ kind: 'date-keyed', urlDate: date });
  const canonicalLocale = isIndexable ? locale : 'en';
  const url = `${BASE_URL}/${canonicalLocale}${route}`;

  return {
    title,
    description,
    keywords,
    robots: noindex ? { index: false, follow: true } : undefined,
    alternates: {
      canonical: url,
      languages: buildIndexableHreflang(route),
    },
    openGraph: {
      title,
      description,
      url,
      type: 'article',
      siteName: 'Dekho Panchang',
    },
  };
}

export default async function DateLayout({ children, params }: { children: React.ReactNode; params: Promise<{ locale: string; rashi: string; date: string }> }) {
  const { locale, rashi: slug, date } = await params;
  setRequestLocale(locale);
  const breadcrumbLD = generateBreadcrumbLD(`/${locale}/horoscope/${slug}/${date}`, locale);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(breadcrumbLD) }} />
      {children}
    </>
  );
}
