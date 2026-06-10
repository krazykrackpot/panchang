/**
 * /learn/dasha-year-length — Phase 3 page 4.
 *
 * Argument-fuelling reference: why two dasha calculators publish
 * different Mahadasha end dates for the same birth chart. BPHS is
 * silent on the year-length convention; modern software picks one of
 * Julian (365.25), Gregorian (365.2425), Savana (360), Sidereal, or
 * Tropical.
 */

import { setRequestLocale, getLocale } from 'next-intl/server';
import type { Metadata } from 'next';
import { getHeadingFont, getBodyFont, isIndicLocale } from '@/lib/utils/locale-fonts';
import { lt } from '@/lib/learn/translations';
import type { LocaleText } from '@/lib/learn/translations';
import L from '@/messages/learn/dasha-year-length.json';
import ReferenceBlock from '@/components/ui/ReferenceBlock';
import { Link } from '@/lib/i18n/navigation';
import { getPageMetadata } from '@/lib/seo/metadata';
import { safeJsonLd } from '@/lib/seo/safe-jsonld';
import { generateBreadcrumbLD } from '@/lib/seo/structured-data';

const T = L as unknown as Record<string, LocaleText>;

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  setRequestLocale(locale);
  return getPageMetadata('/learn/dasha-year-length', locale);
}

export default async function DashaYearLengthPage() {
  const locale = await getLocale();
  setRequestLocale(locale);
  const headingFont = getHeadingFont(locale);
  const bodyFont = isIndicLocale(locale) ? getBodyFont(locale) ?? undefined : undefined;
  const t = (k: string) => lt(T[k], locale);
  const breadcrumbLD = generateBreadcrumbLD(`/${locale}/learn/dasha-year-length`, locale);

  return (
    <main className="max-w-4xl mx-auto px-4 py-12 space-y-12">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(breadcrumbLD) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd({
        '@context': 'https://schema.org', '@type': 'TechArticle',
        headline: t('title'), description: t('subtitle'),
        author: { '@type': 'Organization', name: 'Dekho Panchang' },
        dateModified: '2026-06-10', proficiencyLevel: 'Intermediate',
        about: [
          { '@type': 'Thing', name: 'Vimshottari Dasha' },
          { '@type': 'Thing', name: 'Year-length convention in Vedic dasha calculation' },
        ],
        mentions: [
          { '@type': 'Book', name: 'Brihat Parashara Hora Shastra', alternateName: 'BPHS' },
          { '@type': 'Book', name: 'Surya Siddhanta' },
          { '@type': 'SoftwareApplication', name: 'JHora' },
          { '@type': 'SoftwareApplication', name: "Parashara's Light" },
        ],
      }) }} />

      <header className="space-y-3">
        <p className="text-xs uppercase tracking-[0.18em] font-bold text-gold-primary">{t('tagline')}</p>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gold-light leading-tight" style={headingFont}>{t('title')}</h1>
        <p className="text-text-secondary text-base sm:text-lg leading-relaxed max-w-3xl" style={bodyFont}>{t('subtitle')}</p>
      </header>

      <ReferenceBlock
        id="year-length-conventions"
        title={t('refBlockTitle')}
        intro={t('refBlockIntro')}
        rows={[
          { id: 'julian',    label: t('refRowJulian'),    value: t('refRowJulianV'),    note: t('refRowJulianNote') },
          { id: 'savana',    label: t('refRowSavana'),    value: t('refRowSavanaV'),    note: t('refRowSavanaNote') },
          { id: 'gregorian', label: t('refRowGregorian'), value: t('refRowGregorianV'), note: t('refRowGregorianNote') },
          { id: 'sidereal',  label: t('refRowSidereal'),  value: t('refRowSiderealV'),  note: t('refRowSiderealNote') },
          { id: 'tropical',  label: t('refRowSolar'),     value: t('refRowSolarV'),     note: t('refRowSolarNote') },
        ]}
        sourceCitation={t('refBlockSource')}
        copyLinkLabel={t('refCopyLink')}
        copiedLabel={t('refCopied')}
        locale={locale}
      />

      <section id="why-matters" className="space-y-4">
        <h2 className="text-2xl sm:text-3xl font-bold text-gold-light" style={headingFont}>{t('whyMattersTitle')}</h2>
        <p className="text-text-secondary leading-relaxed" style={bodyFont}>{t('whyMattersP1')}</p>
        <p className="text-text-secondary leading-relaxed" style={bodyFont}>{t('whyMattersP2')}</p>
      </section>

      <section id="why-julian" className="space-y-4">
        <h2 className="text-2xl sm:text-3xl font-bold text-gold-light" style={headingFont}>{t('whyJulianTitle')}</h2>
        <p className="text-text-secondary leading-relaxed" style={bodyFont}>{t('whyJulianP1')}</p>
        <p className="text-text-secondary leading-relaxed" style={bodyFont}>{t('whyJulianP2')}</p>
      </section>

      <section id="example" className="space-y-4">
        <h2 className="text-2xl sm:text-3xl font-bold text-gold-light" style={headingFont}>{t('exampleTitle')}</h2>
        <p className="text-text-secondary leading-relaxed" style={bodyFont}>{t('exampleP1')}</p>
        <p className="text-text-secondary leading-relaxed" style={bodyFont}>{t('exampleP2')}</p>
      </section>

      <section className="space-y-3 border-t border-gold-primary/15 pt-8">
        <h2 className="text-xl font-bold text-gold-light" style={headingFont}>{t('relatedTitle')}</h2>
        <ul className="space-y-2 text-sm">
          <li><Link href="/learn/dashas" className="text-gold-primary hover:text-gold-light transition-colors">→ {t('relatedDashas')}</Link></li>
          <li><Link href="/about/methodology" className="text-gold-primary hover:text-gold-light transition-colors">→ {t('relatedMethodology')}</Link></li>
          <li><Link href="/learn/ayanamsha-comparison" className="text-gold-primary hover:text-gold-light transition-colors">→ {t('relatedAyanamshaComparison')}</Link></li>
        </ul>
      </section>
    </main>
  );
}
