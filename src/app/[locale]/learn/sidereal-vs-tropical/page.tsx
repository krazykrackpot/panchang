/**
 * /learn/sidereal-vs-tropical — Phase 3 page 3.
 *
 * Argument-fuelling reference: the math of why your Vedic Sun sign
 * differs from your Western one. Both are internally consistent; they
 * just measure from different zero points (equinox vs Chitra).
 */

import { setRequestLocale, getLocale } from 'next-intl/server';
import type { Metadata } from 'next';
import { getHeadingFont, getBodyFont, isIndicLocale } from '@/lib/utils/locale-fonts';
import { lt } from '@/lib/learn/translations';
import type { LocaleText } from '@/lib/learn/translations';
import L from '@/messages/learn/sidereal-vs-tropical.json';
import ReferenceBlock from '@/components/ui/ReferenceBlock';
import { Link } from '@/lib/i18n/navigation';
import { getPageMetadata } from '@/lib/seo/metadata';
import { safeJsonLd } from '@/lib/seo/safe-jsonld';
import { generateBreadcrumbLD } from '@/lib/seo/structured-data';

const T = L as unknown as Record<string, LocaleText>;

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  setRequestLocale(locale);
  return getPageMetadata('/learn/sidereal-vs-tropical', locale);
}

export default async function SiderealVsTropicalPage() {
  const locale = await getLocale();
  setRequestLocale(locale);
  const headingFont = getHeadingFont(locale);
  const bodyFont = isIndicLocale(locale) ? getBodyFont(locale) ?? undefined : undefined;
  const t = (k: string) => lt(T[k], locale);
  const breadcrumbLD = generateBreadcrumbLD(`/${locale}/learn/sidereal-vs-tropical`, locale);

  return (
    <main className="max-w-4xl mx-auto px-4 py-12 space-y-12">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(breadcrumbLD) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd({
        '@context': 'https://schema.org', '@type': 'TechArticle',
        headline: t('title'), description: t('subtitle'),
        author: { '@type': 'Organization', name: 'Dekho Panchang' },
        dateModified: '2026-06-10', proficiencyLevel: 'Beginner',
        about: [
          { '@type': 'Thing', name: 'Sidereal zodiac' },
          { '@type': 'Thing', name: 'Tropical zodiac' },
          { '@type': 'Thing', name: 'Precession of the equinoxes' },
        ],
        mentions: [
          { '@type': 'Book', name: 'Surya Siddhanta' },
          { '@type': 'CreativeWork', name: 'Lahiri ayanamsha — Calendar Reform Committee 1957' },
        ],
      }) }} />

      <header className="space-y-3">
        <p className="text-xs uppercase tracking-[0.18em] font-bold text-gold-primary">{t('tagline')}</p>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gold-light leading-tight" style={headingFont}>{t('title')}</h1>
        <p className="text-text-secondary text-base sm:text-lg leading-relaxed max-w-3xl" style={bodyFont}>{t('subtitle')}</p>
      </header>

      <ReferenceBlock
        id="zodiac-boundaries-2026"
        title={t('refBlockTitle')}
        intro={t('refBlockIntro')}
        rows={[
          { id: 'mesh',      label: t('refRowMesh'),      value: t('refRowMeshV') },
          { id: 'vrishabh',  label: t('refRowVrishabh'),  value: t('refRowVrishabhV') },
          { id: 'mithun',    label: t('refRowMithun'),    value: t('refRowMithunV') },
          { id: 'kark',      label: t('refRowKark'),      value: t('refRowKarkV') },
          { id: 'simha',     label: t('refRowSimha'),     value: t('refRowSimhaV') },
          { id: 'kanya',     label: t('refRowKanya'),     value: t('refRowKanyaV') },
          { id: 'tula',      label: t('refRowTula'),      value: t('refRowTulaV') },
          { id: 'vrishchik', label: t('refRowVrishchik'), value: t('refRowVrishchikV') },
          { id: 'dhanu',     label: t('refRowDhanu'),     value: t('refRowDhanuV') },
          { id: 'makar',     label: t('refRowMakar'),     value: t('refRowMakarV') },
          { id: 'kumbh',     label: t('refRowKumbh'),     value: t('refRowKumbhV') },
          { id: 'meen',      label: t('refRowMeen'),      value: t('refRowMeenV') },
        ]}
        sourceCitation={t('refBlockSource')}
        copyLinkLabel={t('refCopyLink')}
        copiedLabel={t('refCopied')}
        locale={locale}
      />

      <section id="two-zeros" className="space-y-4">
        <h2 className="text-2xl sm:text-3xl font-bold text-gold-light" style={headingFont}>{t('twoZerosTitle')}</h2>
        <p className="text-text-secondary leading-relaxed" style={bodyFont}>{t('twoZerosP1')}</p>
        <p className="text-text-secondary leading-relaxed" style={bodyFont}>{t('twoZerosP2')}</p>
      </section>

      <section id="example" className="space-y-4">
        <h2 className="text-2xl sm:text-3xl font-bold text-gold-light" style={headingFont}>{t('exampleTitle')}</h2>
        <p className="text-text-secondary leading-relaxed" style={bodyFont}>{t('exampleP1')}</p>
      </section>

      <section id="which-right" className="space-y-4">
        <h2 className="text-2xl sm:text-3xl font-bold text-gold-light" style={headingFont}>{t('whichRightTitle')}</h2>
        <p className="text-text-secondary leading-relaxed" style={bodyFont}>{t('whichRightP1')}</p>
        <p className="text-text-secondary leading-relaxed" style={bodyFont}>{t('whichRightP2')}</p>
      </section>

      <section className="space-y-3 border-t border-gold-primary/15 pt-8">
        <h2 className="text-xl font-bold text-gold-light" style={headingFont}>{t('relatedTitle')}</h2>
        <ul className="space-y-2 text-sm">
          <li><Link href="/learn/ayanamsha" className="text-gold-primary hover:text-gold-light transition-colors">→ {t('relatedAyanamsha')}</Link></li>
          <li><Link href="/learn/ayanamsha-comparison" className="text-gold-primary hover:text-gold-light transition-colors">→ {t('relatedAyanamshaComparison')}</Link></li>
          <li><Link href="/about/methodology" className="text-gold-primary hover:text-gold-light transition-colors">→ {t('relatedMethodology')}</Link></li>
        </ul>
      </section>
    </main>
  );
}
