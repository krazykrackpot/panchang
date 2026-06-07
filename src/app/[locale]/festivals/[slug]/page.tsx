/**
 * Bare festival slug: /[locale]/festivals/[slug]
 *
 * Old route shape. The current route is /[locale]/festivals/[slug]/[year]
 * but Google indexed the bare-slug URLs from an earlier deployment, and
 * /festivals/diwali was returning 404 — wasting indexed crawl signal
 * and dead-ending users who clicked the SERP listing. Per audit N-2,
 * this page now 308-redirects to the same festival's current-year page.
 *
 * 308 (permanent + preserve-method) — Google forwards link equity, the
 * canonical eventually consolidates to /[slug]/[year].
 */
import { permanentRedirect, notFound } from 'next/navigation';
import { MAJOR_FESTIVALS, FESTIVAL_VALID_YEARS } from '@/lib/calendar/festival-defs';
import { FESTIVAL_DETAILS } from '@/lib/constants/festival-details-with-overlay';

function pickRedirectYear(): number {
  const now = new Date().getUTCFullYear();
  if ((FESTIVAL_VALID_YEARS as readonly number[]).includes(now)) return now;
  // Outside the valid window — anchor to the nearest valid year so the
  // user gets a real page instead of another 404.
  if (now < FESTIVAL_VALID_YEARS[0]) return FESTIVAL_VALID_YEARS[0];
  return FESTIVAL_VALID_YEARS[FESTIVAL_VALID_YEARS.length - 1];
}

export const dynamicParams = true;
// Always return [] — let the year-route handle SSG; this layer is a
// thin redirect that ISR'd-on-demand for any slug.
export async function generateStaticParams() {
  return [];
}

export default async function FestivalBareSlugRedirect({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;

  // Match the destination route's validation: the year-route requires the
  // slug to exist in BOTH MAJOR_FESTIVALS (canonical defs) AND
  // FESTIVAL_DETAILS (rendering data). Redirecting to a page that would
  // itself notFound is worse than 404-ing here — at least the SERP listing
  // gets a clean dead URL signal instead of a redirect chain into nothing.
  if (!MAJOR_FESTIVALS.some((f) => f.slug === slug) || !FESTIVAL_DETAILS[slug]) {
    notFound();
  }

  permanentRedirect(`/${locale}/festivals/${slug}/${pickRedirectYear()}`);
}
