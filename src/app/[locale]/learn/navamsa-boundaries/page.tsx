/**
 * /learn/navamsa-boundaries — Phase 3 page 5.
 *
 * Argument-fuelling reference: the D-9 Navamsa is the most-cited
 * divisional chart in Vedic astrology, and two tools that agree on
 * the Lagna can still disagree on the Navamsa Lagna. This page
 * shows the 3°20' pada grid, where the disagreements come from
 * (ayanamsha choice + pre-1880 tz + engine precision), and how to
 * verify a boundary call.
 */

import { setRequestLocale, getLocale } from 'next-intl/server';
import type { Metadata } from 'next';
import { getHeadingFont, getBodyFont, isIndicLocale } from '@/lib/utils/locale-fonts';
import { lt } from '@/lib/learn/translations';
import type { LocaleText } from '@/lib/learn/translations';
import L from '@/messages/learn/navamsa-boundaries.json';
import ReferenceBlock from '@/components/ui/ReferenceBlock';
import { Link } from '@/lib/i18n/navigation';
import { getPageMetadata } from '@/lib/seo/metadata';
import { safeJsonLd } from '@/lib/seo/safe-jsonld';
import { generateBreadcrumbLD, generatePersonLD } from '@/lib/seo/structured-data';

const T = L as unknown as Record<string, LocaleText>;

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  setRequestLocale(locale);
  return getPageMetadata('/learn/navamsa-boundaries', locale);
}

export default async function NavamsaBoundariesPage() {
  const locale = await getLocale();
  setRequestLocale(locale);
  const headingFont = getHeadingFont(locale);
  const bodyFont = isIndicLocale(locale) ? getBodyFont(locale) ?? undefined : undefined;
  const t = (k: string) => lt(T[k], locale);
  const breadcrumbLD = generateBreadcrumbLD(`/${locale}/learn/navamsa-boundaries`, locale);

  return (
    <main className="max-w-4xl mx-auto px-4 py-12 space-y-12">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(breadcrumbLD) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd({
        '@context': 'https://schema.org', '@type': 'TechArticle',
        headline: t('title'), description: t('subtitle'),
        // Person author (not Organization) per E-E-A-T guidelines —
        // matches article-ld.ts pattern. Gemini #659 MED.
        author: generatePersonLD(),
        dateModified: '2026-06-10', proficiencyLevel: 'Intermediate',
        about: [
          { '@type': 'Thing', name: 'Navamsa chart (D-9)' },
          { '@type': 'Thing', name: 'Pada division of rashis' },
          { '@type': 'Thing', name: 'Divisional charts (Vargas)' },
        ],
        mentions: [
          { '@type': 'Book', name: 'Brihat Parashara Hora Shastra', alternateName: 'BPHS' },
          { '@type': 'Book', name: 'Brihat Jataka' },
          { '@type': 'SoftwareApplication', name: 'JHora' },
          { '@type': 'SoftwareApplication', name: 'Swiss Ephemeris' },
        ],
      }) }} />

      <header className="space-y-3">
        <p className="text-xs uppercase tracking-[0.18em] font-bold text-gold-primary">{t('tagline')}</p>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gold-light leading-tight" style={headingFont}>{t('title')}</h1>
        <p className="text-text-secondary text-base sm:text-lg leading-relaxed max-w-3xl" style={bodyFont}>{t('subtitle')}</p>
      </header>

      <ReferenceBlock
        id="pada-boundaries"
        title={t('refBlockTitle')}
        intro={t('refBlockIntro')}
        rows={[
          { id: 'pada1', label: t('refRowPada1'), value: t('refRowPada1V') },
          { id: 'pada2', label: t('refRowPada2'), value: t('refRowPada2V') },
          { id: 'pada3', label: t('refRowPada3'), value: t('refRowPada3V') },
          { id: 'pada4', label: t('refRowPada4'), value: t('refRowPada4V') },
          { id: 'pada5', label: t('refRowPada5'), value: t('refRowPada5V') },
          { id: 'pada6', label: t('refRowPada6'), value: t('refRowPada6V') },
          { id: 'pada7', label: t('refRowPada7'), value: t('refRowPada7V') },
          { id: 'pada8', label: t('refRowPada8'), value: t('refRowPada8V') },
          { id: 'pada9', label: t('refRowPada9'), value: t('refRowPada9V') },
        ]}
        sourceCitation={t('refBlockSource')}
        copyLinkLabel={t('refCopyLink')}
        copiedLabel={t('refCopied')}
        locale={locale}
      />

      <section id="how-works" className="space-y-4">
        <h2 className="text-2xl sm:text-3xl font-bold text-gold-light" style={headingFont}>{t('howWorksTitle')}</h2>
        <p className="text-text-secondary leading-relaxed" style={bodyFont}>{t('howWorksP1')}</p>
        <p className="text-text-secondary leading-relaxed" style={bodyFont}>{t('howWorksP2')}</p>
      </section>

      <section id="why-shifts" className="space-y-4">
        <h2 className="text-2xl sm:text-3xl font-bold text-gold-light" style={headingFont}>{t('whyShiftsTitle')}</h2>
        <p className="text-text-secondary leading-relaxed" style={bodyFont}>{t('whyShiftsP1')}</p>
        <p className="text-text-secondary leading-relaxed" style={bodyFont}>{t('whyShiftsP2')}</p>
        <p className="text-text-secondary leading-relaxed" style={bodyFont}>{t('whyShiftsP3')}</p>
        <p className="text-text-secondary leading-relaxed" style={bodyFont}>{t('whyShiftsP4')}</p>
      </section>

      <section id="how-to-verify" className="space-y-4">
        <h2 className="text-2xl sm:text-3xl font-bold text-gold-light" style={headingFont}>{t('howToVerifyTitle')}</h2>
        <p className="text-text-secondary leading-relaxed" style={bodyFont}>{t('howToVerifyP1')}</p>
      </section>

      <section className="space-y-3 border-t border-gold-primary/15 pt-8">
        <h2 className="text-xl font-bold text-gold-light" style={headingFont}>{t('relatedTitle')}</h2>
        <ul className="space-y-2 text-sm">
          <li><Link href="/learn/vargas" className="text-gold-primary hover:text-gold-light transition-colors">→ {t('relatedVargas')}</Link></li>
          <li><Link href="/learn/ayanamsha-comparison" className="text-gold-primary hover:text-gold-light transition-colors">→ {t('relatedAyanamshaComparison')}</Link></li>
          <li><Link href="/about/methodology" className="text-gold-primary hover:text-gold-light transition-colors">→ {t('relatedMethodology')}</Link></li>
        </ul>
      </section>
    </main>
  );
}
