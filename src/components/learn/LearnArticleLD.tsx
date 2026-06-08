/**
 * LearnArticleLD  –  Server component that injects Article JSON-LD
 * for learn topic pages. Placed inside individual topic layouts.
 *
 * Title and description are auto-resolved from PAGE_META by default;
 * layouts only need to pass `route` and `locale`. Explicit `title` /
 * `description` props still accepted as overrides for legacy callers.
 *
 * Audit-A coverage pass (2026-06-08): only ~15 of 55 ARTICLE_META
 * routes had a LearnArticleLD layout wrapper before this PR. Making
 * title/description optional lets the bulk coverage extension skip
 * manual title authoring per route.
 */

import { safeJsonLd } from '@/lib/seo/safe-jsonld';
import { generateArticleLD } from '@/lib/seo/article-ld';
import { PAGE_META } from '@/lib/seo/metadata';

interface LearnArticleLDProps {
  route: string;
  locale: string;
  /** Optional override — defaults to the route's PAGE_META title for `locale`. */
  title?: string;
  /** Optional override — defaults to the route's PAGE_META description for `locale`. */
  description?: string;
}

function pickLocale(obj: Record<string, string> | undefined, locale: string): string | undefined {
  if (!obj) return undefined;
  return obj[locale] ?? obj.en ?? Object.values(obj)[0];
}

export default function LearnArticleLD({ route, locale, title, description }: LearnArticleLDProps) {
  // PAGE_META isn't typed for arbitrary route → object lookup, but every
  // /learn/* entry has the same { title, description } shape — cast to
  // a permissive accessor type here so the wrapper can stay generic.
  const meta = (PAGE_META as Record<string, { title?: Record<string, string>; description?: Record<string, string> }>)[route];
  const resolvedTitle = title ?? pickLocale(meta?.title, locale) ?? route;
  const resolvedDescription = description ?? pickLocale(meta?.description, locale) ?? resolvedTitle;
  const articleLD = generateArticleLD(route, locale, resolvedTitle, resolvedDescription);
  if (!articleLD) return null;

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: safeJsonLd(articleLD) }}
    />
  );
}
