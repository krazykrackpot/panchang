import { setRequestLocale } from 'next-intl/server';
import Link from 'next/link';
import CalendarClient from './Client';
import { generateFestivalCalendarV2 } from '@/lib/calendar/festival-generator';
import { safeJsonLd } from '@/lib/seo/safe-jsonld';
import { generateFAQLD } from '@/lib/seo/faq-data';
import { pickCalendarLabel as L, calendarMonthShort } from '@/lib/content/calendar-labels';
import { isDevanagariLocale } from '@/lib/utils/locale-fonts';

export const revalidate = 86400;

import { BASE_URL } from '@/lib/seo/base-url';

// Ujjain reference location for the SSR "upcoming festivals" overview.
// Picked because it's the canonical 0° UT reference in many panchang
// traditions; the date list is approximate-to-Ujjain. The interactive
// client below computes location-accurate dates for the user's actual
// city. Audit 2026-05-25 §D2 (SSR fallback for Googlebot).
const UJJAIN = { lat: 23.1765, lng: 75.7885, tz: 'Asia/Kolkata' };

interface SSRFestivalRow {
  name: string;
  nameLocale: string;
  date: string;
  desc: string;
  descLocale: string;
  slug?: string;
  paksha?: 'shukla' | 'krishna';
}

function buildSsrFestivalList(locale: string): SSRFestivalRow[] {
  const year = new Date().getUTCFullYear();
  const todayISO = new Date().toISOString().slice(0, 10);
  // Generate this year's calendar then fall through to next year if we're
  // late in the year and only have a few entries left.
  let entries = generateFestivalCalendarV2(year, UJJAIN.lat, UJJAIN.lng, UJJAIN.tz)
    .filter(e => e.type === 'major' && e.date >= todayISO);
  if (entries.length < 12) {
    entries = entries.concat(
      generateFestivalCalendarV2(year + 1, UJJAIN.lat, UJJAIN.lng, UJJAIN.tz)
        .filter(e => e.type === 'major'),
    );
  }
  entries = entries.slice(0, 18);

  // Indo-Aryan / Devanagari-script locales (hi/sa/mr/mai) inherit hi
  // festival names/descriptions when the entry doesn't carry a
  // locale-specific translation. Dravidian (ta/te/kn) and Bengali (bn)
  // fall back to en since the script and vocabulary differ enough that
  // Hindi would look out of place. Gemini #189 HIGH (do not force HI
  // for sa/mr/mai when the entry has a specific translation).
  const inheritsHi = isDevanagariLocale(locale);

  return entries.map((e): SSRFestivalRow => {
    const [yyyy, mm, dd] = e.date.split('-').map(Number);
    const dateStr = `${dd} ${calendarMonthShort(mm - 1, locale)} ${yyyy}`;
    const en = e.name.en ?? '';
    const hi = (e.name as Record<string, string | undefined>).hi ?? '';
    const descEn = e.description.en ?? '';
    const descHi = (e.description as Record<string, string | undefined>).hi ?? '';
    const localeName = (e.name as Record<string, string | undefined>)[locale];
    const localeDesc = (e.description as Record<string, string | undefined>)[locale];
    const nameOut = localeName || (inheritsHi ? hi : '') || en;
    const descOut = localeDesc || (inheritsHi ? descHi : '') || descEn;
    return {
      name: en,
      nameLocale: nameOut,
      date: dateStr,
      desc: descEn,
      descLocale: descOut,
      slug: e.slug,
      paksha: e.paksha,
    };
  });
}

export default async function CalendarPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const festivalsList = buildSsrFestivalList(locale);

  // ItemList JSON-LD — gives Googlebot a machine-readable view of the
  // server-rendered festival list. Pairs with the BreadcrumbList /
  // CollectionPage LD that festivals/layout.tsx already emits. Audit §D2.
  // Gemini #189 MED — Google penalises structured-data / visible-content
  // mismatches. The visible page shows localised names + a localised list
  // heading, so the JSON-LD must do the same.
  const itemListLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: L('ssrListName', locale),
    itemListOrder: 'https://schema.org/ItemListOrderAscending',
    numberOfItems: festivalsList.length,
    itemListElement: festivalsList.map((f, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: f.nameLocale,
      url: f.slug ? `${BASE_URL}/${locale}/calendar/${f.slug}` : `${BASE_URL}/${locale}/calendar`,
    })),
  };

  // Generic /calendar FAQ — was previously emitted from layout.tsx and
  // cascaded onto every regional sub-page (duplicate-FAQPage Rich Results
  // ERROR on Bengali, Gujarati, etc.). Emitting only here, on the /calendar
  // landing route, keeps the FAQ for this page and removes the duplicate
  // on sub-pages that own their own FAQ content.
  const faqLD = generateFAQLD('/calendar', locale);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(itemListLd) }} />
      {faqLD && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(faqLD) }} />
      )}
      {/* ── Server-rendered SEO content ── */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">
        <article className="prose-sm text-text-secondary leading-relaxed space-y-4 mb-10">
          {/* Intro title + the two explanatory paragraphs are wrapped in
              a native <details> so visitors can collapse the explainer
              once they know what the calendar is. Default-closed because
              repeat users don't need to re-read it on every visit; the
              summary keeps the H2 visible for SEO + first-time context. */}
          <details className="group">
            <summary className="cursor-pointer list-none [&::-webkit-details-marker]:hidden flex items-center justify-between gap-3">
              <h2 className="text-gold-light text-xl font-bold">{L('mainHeading', locale)}</h2>
              <span aria-hidden="true" className="text-gold-primary/60 text-sm shrink-0 transition-transform group-open:rotate-180">▾</span>
            </summary>
            <div className="space-y-4 mt-4">
              <p>{L('introPara1', locale)}</p>
              <p>{L('introPara2', locale)}</p>
            </div>
          </details>

          <h3 className="text-gold-light text-lg font-bold mt-6">{L('featuresHeading', locale)}</h3>
          <p>{L('featuresPara', locale)}</p>

          {/* Regional traditions paragraph wraps four inline links;
              translated as Part1/Anchor/Part2/.../Part5 fragments so JSX
              structure is preserved. Each anchor points at /regional. */}
          <h3 className="text-gold-light text-lg font-bold mt-6">{L('regionalHeading', locale)}</h3>
          <p>
            {L('regionalPart1', locale)}
            <Link href={`/${locale}/regional`} className="text-gold-primary hover:text-gold-light transition-colors">{L('regionalAnchorBengali', locale)}</Link>
            {L('regionalPart2', locale)}
            <Link href={`/${locale}/regional`} className="text-gold-primary hover:text-gold-light transition-colors">{L('regionalAnchorTamil', locale)}</Link>
            {L('regionalPart3', locale)}
            <Link href={`/${locale}/regional`} className="text-gold-primary hover:text-gold-light transition-colors">{L('regionalAnchorGujarati', locale)}</Link>
            {L('regionalPart4', locale)}
            <Link href={`/${locale}/regional`} className="text-gold-primary hover:text-gold-light transition-colors">{L('regionalAnchorRegional', locale)}</Link>
            {L('regionalPart5', locale)}
          </p>

          {/* Internal links */}
          <div className="flex flex-wrap gap-3 mt-8 text-sm">
            <Link href={`/${locale}/panchang`} className="text-gold-primary hover:text-gold-light transition-colors">{L('linkPanchangToday', locale)}</Link>
            <Link href={`/${locale}/learn/tithis`} className="text-gold-primary hover:text-gold-light transition-colors">{L('linkLearnTithis', locale)}</Link>
            <Link href={`/${locale}/learn/muhurtas`} className="text-gold-primary hover:text-gold-light transition-colors">{L('linkLearnMuhurtas', locale)}</Link>
            <Link href={`/${locale}/vedic-time`} className="text-gold-primary hover:text-gold-light transition-colors">{L('linkVedicTime', locale)}</Link>
          </div>
        </article>
      </section>

      {/* ── Interactive client component ── */}
      <CalendarClient />

      {/* ── Upcoming Major Festivals (moved to page end per UX) ──
          The interactive calendar above is the primary surface; the
          static list below is a quick-glance secondary view for users
          who want a list rather than a grid. Dynamically generated from
          generateFestivalCalendarV2 (Ujjain reference), updates daily
          via revalidate. Audit §D2. */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 pt-8">
        <article className="prose-sm text-text-secondary leading-relaxed space-y-4">
          <h2 className="text-gold-light text-xl font-bold">{L('upcomingHeading', locale)}</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse mt-3">
              <thead>
                <tr className="border-b border-gold-primary/15">
                  <th className="text-left py-2 px-3 text-gold-dark font-bold">{L('tableFestivalCol', locale)}</th>
                  <th className="text-left py-2 px-3 text-gold-dark font-bold">{L('tableDateCol', locale)}</th>
                  <th className="text-left py-2 px-3 text-gold-dark font-bold">{L('tableDescCol', locale)}</th>
                </tr>
              </thead>
              <tbody>
                {festivalsList.map((f, i) => (
                  <tr key={i} className="border-b border-gold-primary/5">
                    <td className="py-1.5 px-3 text-gold-light font-medium whitespace-nowrap">
                      {f.slug ? (
                        <Link href={`/${locale}/calendar/${f.slug}`} className="hover:text-gold-primary transition-colors">{f.nameLocale}</Link>
                      ) : f.nameLocale}
                    </td>
                    <td className="py-1.5 px-3 text-text-primary whitespace-nowrap">{f.date}</td>
                    <td className="py-1.5 px-3 text-text-secondary text-xs">{f.descLocale}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-xs text-text-secondary/60 mt-2">{L('ujjainFootnote', locale)}</p>
        </article>
      </section>
    </>
  );
}
