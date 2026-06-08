import { Suspense } from 'react';
import { setRequestLocale } from 'next-intl/server';
import { tl } from '@/lib/utils/trilingual';
import { isDevanagariLocale } from '@/lib/utils/locale-fonts';
import { FESTIVAL_DETAILS, CATEGORY_DETAILS, EKADASHI_NAMES } from '@/lib/constants/festival-details-with-overlay';
import type { Locale, LocaleText } from '@/types/panchang';
import CalendarSlugClient from './CalendarSlugClient';
import AuthorByline from '@/components/ui/AuthorByline';

/**
 * Server-rendered festival / vrat / ekadashi detail page.
 *
 * Bingbot flagged /calendar/<slug> URLs for missing <h1> on 2026-05-29.
 * The pre-split page was 'use client' with `useSearchParams()` at module
 * scope. With no Suspense boundary above it, Next 16 collapses the route
 * to client-side rendering and Bingbot's initial HTML contains no h1.
 *
 * Same shape as sankalpa (PR #282) / tropical-compare / pricing /
 * sarvatobhadra / sign-shift: the SEO-critical h1 is server-rendered
 * here with a synchronous slug lookup; CalendarSlugClient holds the
 * interactive puja mode, location-aware ekadashi parana, and back link
 * inside a <Suspense> boundary so the useSearchParams() bailout is
 * contained below the h1.
 *
 * Name resolution priority (sync, server-safe):
 *   1. FESTIVAL_DETAILS[slug].name   (Diwali, Holi, …)
 *   2. CATEGORY_DETAILS[slug].name   (purnima, amavasya, ekadashi, …)
 *   3. EKADASHI_NAMES walk           (papmochani-ekadashi → "Papmochani Ekadashi")
 *   4. slug → title-case fallback    (unknown slug → "Some Festival")
 *
 * The async-only specific-ekadashi name (resolved via the location-aware
 * parana lookup in the client) cannot be derived without lat/lng/tz, so
 * the server-side h1 sticks with the slug-derived name; the client shows
 * the resolved-date paragraph below the h1.
 */
function resolveDisplayName(slug: string): LocaleText {
  const detail = FESTIVAL_DETAILS[slug] || CATEGORY_DETAILS[slug];
  if (detail) return detail.name;

  for (const monthKey of Object.keys(EKADASHI_NAMES)) {
    const monthData = EKADASHI_NAMES[monthKey];
    const shuklaSlug = monthData.shukla.name.en.toLowerCase().replace(/\s+/g, '-');
    const krishnaSlug = monthData.krishna.name.en.toLowerCase().replace(/\s+/g, '-');
    if (shuklaSlug === slug) return monthData.shukla.name;
    if (krishnaSlug === slug) return monthData.krishna.name;
  }

  const titleCased = slug
    .split('-')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
  return { en: titleCased, hi: titleCased, sa: titleCased };
}

export default async function CalendarSlugPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const displayName = resolveDisplayName(slug);
  const headingFont = isDevanagariLocale(locale as Locale)
    ? { fontFamily: 'var(--font-devanagari-heading)' }
    : { fontFamily: 'var(--font-heading)' };

  return (
    <>
      <header className="max-w-4xl mx-auto px-4 sm:px-6 pt-6 sm:pt-10">
        <h1
          className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gold-gradient leading-tight mb-3"
          style={headingFont}
        >
          {tl(displayName, locale)}
        </h1>
      </header>

      <Suspense fallback={<CalendarSlugFallback />}>
        <CalendarSlugClient />
      </Suspense>
    </>
  );
}

function CalendarSlugFallback() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 pb-20" aria-label="Loading festival details">
      <div className="space-y-6">
        <div className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-2xl h-32 animate-pulse" />
        <div className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-2xl h-64 animate-pulse" />
      </div>
    <AuthorByline />
    </div>
  );
}
