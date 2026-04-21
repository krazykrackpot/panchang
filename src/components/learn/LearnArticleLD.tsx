/**
 * LearnArticleLD — Server component that injects Article JSON-LD
 * for learn topic pages. Placed inside individual topic layouts.
 */

import { safeJsonLd } from '@/lib/seo/safe-jsonld';
import { generateArticleLD } from '@/lib/seo/article-ld';

interface LearnArticleLDProps {
  route: string;
  locale: string;
  title: string;
  description: string;
}

export default function LearnArticleLD({ route, locale, title, description }: LearnArticleLDProps) {
  const articleLD = generateArticleLD(route, locale, title, description);
  if (!articleLD) return null;

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: safeJsonLd(articleLD) }}
    />
  );
}
