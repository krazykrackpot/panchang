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
import { permanentRedirect } from 'next/navigation';
import { MAJOR_FESTIVALS } from '@/lib/calendar/festival-defs';
import { notFound } from 'next/navigation';

// Years in scope for the existing year-route. Keep aligned with VALID_YEARS
// in /[slug]/[year]/page.tsx.
const VALID_YEARS = [2025, 2026, 2027, 2028, 2029] as const;

function pickRedirectYear(): number {
  const now = new Date().getUTCFullYear();
  if ((VALID_YEARS as readonly number[]).includes(now)) return now;
  // Outside the valid window — anchor to the nearest valid year so the
  // user gets a real page instead of another 404.
  if (now < VALID_YEARS[0]) return VALID_YEARS[0];
  return VALID_YEARS[VALID_YEARS.length - 1];
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

  // Reject unknown slugs as 404 (rather than redirecting to a non-existent
  // year page that would itself notFound). MAJOR_FESTIVALS is the canonical
  // list the year-route consumes.
  if (!MAJOR_FESTIVALS.some((f) => f.slug === slug)) {
    notFound();
  }

  permanentRedirect(`/${locale}/festivals/${slug}/${pickRedirectYear()}`);
}
