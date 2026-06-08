/**
 * Puja-vidhi HowTo JSON-LD helper.
 *
 * Wraps the existing puja-vidhi step data (src/lib/constants/puja-vidhi/)
 * in schema.org's HowTo structured data so Google can render it as a
 * rich result for queries like "how to perform Diwali puja".
 *
 * Spec: docs/superpowers/specs/2026-05-28-festival-deep-dive-pages-design.md §4D
 *
 * Returns `null` if no puja-vidhi exists for the slug — caller must
 * handle the null case and simply not emit the HowTo script tag.
 */

import { getPujaVidhiBySlug } from '@/lib/constants/puja-vidhi-with-overlay';
import { tl } from '@/lib/utils/trilingual';
import type { Locale } from '@/types/panchang';

import { BASE_URL } from '@/lib/seo/base-url';

export interface HowToLDInput {
  /**
   * Festival slug (e.g. 'diwali'). The puja-vidhi store is keyed by the
   * same slug; the 1:1 mapping is verified by the howto-ld.test.ts
   * fixture against TOP_FESTIVAL_SLUGS.
   */
  festivalSlug: string;
  /** Locale for translating the step text. Falls back to English via tl(). */
  locale: Locale;
  /** Optional override for the BASE_URL — defaults to process.env.NEXT_PUBLIC_SITE_URL */
  baseUrl?: string;
}

/**
 * Build a HowTo JSON-LD object for the puja-vidhi associated with a
 * festival slug. Returns null when the festival has no puja-vidhi
 * data — caller should skip emitting a script tag in that case.
 */
export function generateHowToLD(input: HowToLDInput): Record<string, unknown> | null {
  const { festivalSlug, locale, baseUrl = BASE_URL } = input;
  const vidhi = getPujaVidhiBySlug(festivalSlug);
  if (!vidhi) return null;

  const deityName = tl(vidhi.deity, locale);
  // i18n the schema name across all supported locales via tl() with a
  // {deity} placeholder. Locales without an explicit entry fall back to
  // English per the project's "Locale fallback is non-negotiable" rule.
  const name = tl(
    {
      en: 'How to perform {deity} Puja — Step-by-step',
      hi: '{deity} पूजा विधि — चरण-दर-चरण',
    },
    locale,
  ).replace('{deity}', deityName);

  // Map each VidhiStep to a HowToStep. Each step's text uses tl() so
  // missing-locale fields fall back to English per the project's
  // "Locale fallback is non-negotiable" rule.
  const steps = vidhi.vidhiSteps.map((step) => {
    const stepName = tl(step.title, locale);
    const stepText = tl(step.description, locale);
    const item: Record<string, unknown> = {
      '@type': 'HowToStep',
      position: step.step,
      name: stepName,
      text: stepText,
      url: `${baseUrl}/${locale}/learn/puja-vidhi/${festivalSlug}#step-${step.step}`,
    };
    return item;
  });

  // Map samagri (puja materials) to HowToSupply — Google supports this
  // when it's actually a how-to. Only essential items are listed (keeps
  // the schema focused; non-essentials are optional in practice).
  const supplies = vidhi.samagri
    .filter((s) => s.essential)
    .map((s) => ({
      '@type': 'HowToSupply',
      name: tl(s.name, locale),
    }));

  const result: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name,
    description: tl(vidhi.muhurtaDescription, locale),
    step: steps,
  };

  if (supplies.length > 0) {
    result.supply = supplies;
  }

  return result;
}
