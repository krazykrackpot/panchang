/**
 * Layout for /[locale]/calendar/regional/bengali/[year].
 *
 * Provides ISR config, metadata (via getPageMetadata for static years +
 * a dynamic fallback for ISR years), JSON-LD, and the static-params
 * allowlist. Anything outside the allowlist still resolves via ISR
 * (dynamicParams is the implicit default).
 */
import { setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { getPageMetadata } from '@/lib/seo/metadata';
import { generateBreadcrumbLD, generateToolLD } from '@/lib/seo/structured-data';
import { safeJsonLd } from '@/lib/seo/safe-jsonld';

// Strict 4-digit year — prevents `/bengali/2026-foo` etc. from rendering
// duplicate content under a normalised parseInt result.
const YEAR_RE = /^\d{4}$/;
// Range must match the page-level guard so layout JSON-LD and metadata
// don't get rendered for years the page itself rejects.
const YEAR_MIN = 2020;
const YEAR_MAX = 2035;
// Years that have full PAGE_META entries (title + description + keywords
// per locale). Other years in the valid range fall back to the dynamic
// generators below — keeps the JSON-LD title/description in lockstep
// with the visible <title> regardless of whether the URL is statically
// pre-rendered or ISR-resolved.
const STATIC_META_YEARS = new Set([2025, 2026, 2027, 2028]);

function isValidYear(year: string): boolean {
  if (!YEAR_RE.test(year)) return false;
  const n = parseInt(year, 10);
  return n >= YEAR_MIN && n <= YEAR_MAX;
}

// ── Number / title localisation ───────────────────────────────────────
// Mirrors `localizeNumber` in page.tsx — kept inline here rather than
// shared because layout.tsx and page.tsx don't otherwise share code,
// and adding a util just to dedupe two trivial helpers would be more
// surface than it's worth.
const BENGALI_DIGITS = ['০','১','২','৩','৪','৫','৬','৭','৮','৯'] as const;
function localizeNumber(val: number | string, locale: string): string {
  const str = String(val);
  if (locale === 'bn') return str.replace(/\d/g, (d) => BENGALI_DIGITS[Number(d)]);
  return str;
}

function dynamicTitle(year: number, locale: string): string {
  const early = year - 594;
  const late = year - 593;
  const ly = localizeNumber(year, locale);
  const le = localizeNumber(early, locale);
  const ll = localizeNumber(late, locale);
  switch (locale) {
    case 'bn':
      return `বাংলা পঞ্জিকা ${ly} (বঙ্গাব্দ ${le}/${ll}) | Bangla Calendar ${ly} — উৎসব ও তারিখ`;
    case 'hi':
    case 'mai':
    case 'mr':
      return `बांग्ला कैलेंडर ${ly} | বাংলা পঞ্জিকা ${le}/${ll} — बंगाली त्योहार और तिथियाँ`;
    default:
      return `Bangla Calendar ${ly} | বাংলা পঞ্জিকা ${le}/${ll} — Bengali Festivals & Dates`;
  }
}

function dynamicDescription(year: number, locale: string): string {
  const early = year - 594;
  const late = year - 593;
  const ly = localizeNumber(year, locale);
  const le = localizeNumber(early, locale);
  const ll = localizeNumber(late, locale);
  switch (locale) {
    case 'bn':
      return `${ly} (বঙ্গাব্দ ${le}/${ll}) এর জন্য সম্পূর্ণ বাংলা পঞ্জিকা — পয়লা বৈশাখ, দুর্গা পূজা, কালী পূজা, লক্ষ্মী পূজা, সরস্বতী পূজার সঠিক তিথি।`;
    case 'hi':
    case 'mai':
    case 'mr':
      return `${ly} (बंगाब्द ${le}/${ll}) के लिए सम्पूर्ण बांग्ला कैलेंडर — पोइला बोइशाख, दुर्गा पूजा, काली पूजा, लक्ष्मी पूजा, सरस्वती पूजा की सटीक तिथियाँ।`;
    default:
      return `Complete Bangla calendar for ${year} (Bangabda ${early}/${late}) — Poila Boishakh, Durga Puja, Kali Puja, Lakshmi Puja, Saraswati Puja with exact tithi-based dates.`;
  }
}

export const revalidate = 86400;

export function generateStaticParams() {
  // Same window as VALID_YEARS in page.tsx — keep them in sync.
  return [{ year: '2025' }, { year: '2026' }, { year: '2027' }, { year: '2028' }];
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; year: string }>;
}): Promise<Metadata> {
  const { locale, year } = await params;
  if (!isValidYear(year)) notFound();
  setRequestLocale(locale);

  const yearNum = parseInt(year, 10);
  if (STATIC_META_YEARS.has(yearNum)) {
    return getPageMetadata(`/calendar/regional/bengali/${year}`, locale);
  }
  // ISR fallback for years outside the curated PAGE_META set.
  return {
    title: dynamicTitle(yearNum, locale),
    description: dynamicDescription(yearNum, locale),
    alternates: {
      canonical: `https://dekhopanchang.com/${locale}/calendar/regional/bengali/${year}`,
    },
  };
}

export default async function Layout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string; year: string }>;
}) {
  const { locale, year } = await params;
  if (!isValidYear(year)) notFound();
  setRequestLocale(locale);

  const yearNum = parseInt(year, 10);

  // Build localised title/description. Use the curated PAGE_META entries
  // for the static years (canonical SEO copy), dynamic generators for
  // ISR years. Either way the JSON-LD headline/description match the
  // <title> exactly — no mismatch across the static/dynamic boundary.
  let title = dynamicTitle(yearNum, locale);
  let description = dynamicDescription(yearNum, locale);
  if (STATIC_META_YEARS.has(yearNum)) {
    // `getPageMetadata` is typed to always return a Metadata object, but a
    // future PAGE_META reorganisation could return `undefined` for an
    // unmapped route. Guard before destructuring so we fall through to the
    // already-set dynamic title/description rather than throwing.
    const meta = getPageMetadata(`/calendar/regional/bengali/${year}`, locale);
    if (meta) {
      // `meta.title` can be a string, `{ absolute }`, `{ default }`, or
      // `{ template, default }` per Next.js Metadata types. Cover the
      // object shapes so the JSON-LD headline tracks the visible <title>
      // regardless of how the PAGE_META entry was authored.
      const metaTitle = typeof meta.title === 'string'
        ? meta.title
        : meta.title && typeof meta.title === 'object'
          ? (('absolute' in meta.title && meta.title.absolute)
              || ('default' in meta.title && meta.title.default)
              || undefined)
          : undefined;
      if (metaTitle) title = metaTitle;
      if (typeof meta.description === 'string') description = meta.description;
    }
  }

  const url = `https://dekhopanchang.com/${locale}/calendar/regional/bengali/${year}`;
  const toolLD = generateToolLD(title, description, url);
  const breadcrumbLD = generateBreadcrumbLD(`/${locale}/calendar/regional/bengali/${year}`, locale);

  const articleLD = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: title,
    description,
    url,
    publisher: { '@type': 'Organization', name: 'Dekho Panchang', url: 'https://dekhopanchang.com' },
    datePublished: '2026-05-30',
    dateModified: new Date().toISOString().slice(0, 10),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(toolLD) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(breadcrumbLD) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(articleLD) }} />
      {children}
    </>
  );
}
