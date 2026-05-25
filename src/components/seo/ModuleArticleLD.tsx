import { MODULE_SEQUENCE } from '@/lib/learn/module-sequence';
import { safeJsonLd } from '@/lib/seo/safe-jsonld';

const BASE_URL = (process.env.NEXT_PUBLIC_SITE_URL || 'https://dekhopanchang.com').trim();

/**
 * Article + LearningResource JSON-LD for /learn/modules/<id> lessons.
 *
 * Pairs every module with `schema.org/Article` + `LearningResource`
 * markers so Google can surface module pages as rich learning results.
 * The publisher, datePublished, and inLanguage fields close the
 * E-E-A-T loop. Audit 2026-05-25 §C2 — was missing on all 118 modules.
 */
interface ModuleArticleLDProps {
  modId: string;
  locale: string;
}

export function ModuleArticleLD({ modId, locale }: ModuleArticleLDProps) {
  const mod = MODULE_SEQUENCE.find((m) => m.id === modId);
  if (!mod) return null;

  const title = (mod.title as Record<string, string>)[locale] || mod.title.en;
  const url = `${BASE_URL}/${locale}/learn/modules/${modId}`;

  const articleLD = {
    '@context': 'https://schema.org',
    '@type': ['Article', 'LearningResource'],
    name: title,
    headline: title,
    description: `${mod.topic} · Module ${modId} — Interactive Vedic astrology lesson at Dekho Panchang.`,
    url,
    inLanguage: locale,
    isPartOf: {
      '@type': 'Course',
      name: 'Sadhaka Path — Vedic Astrology Learning Quest',
      url: `${BASE_URL}/${locale}/learn`,
    },
    learningResourceType: 'Lesson',
    // Phase 0 = "Getting Started" / "Foundations" → Beginner.
    // Phases 1-5 cover the mathematical heritage + sky basics + panchang +
    // kundali fundamentals → Intermediate.
    // Phases 6+ = dasha, yogas, varga, advanced topics → Advanced.
    // (Was: phase > 1 ⇒ Advanced — overclassified building-block phases.
    // Gemini #180 MED.)
    educationalLevel: mod.phase === 0 ? 'Beginner' : mod.phase <= 5 ? 'Intermediate' : 'Advanced',
    about: mod.topic,
    publisher: { '@type': 'Organization', name: 'Dekho Panchang', url: BASE_URL },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: safeJsonLd(articleLD) }}
    />
  );
}
