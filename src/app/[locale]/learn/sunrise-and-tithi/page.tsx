/**
 * /learn/sunrise-and-tithi — Phase 3 page 2.
 *
 * Argument-fuelling reference: why two panchangs can publish the same
 * tithi on different calendar days. The answer is the kala-vyapti
 * rule from Dharmasindhu / Nirnaya Sindhu — each festival/vrat has
 * its own anchor window (sunrise, arunodaya, nishita, …), and the
 * tithi present at that window decides the observance day.
 */

import { setRequestLocale, getLocale } from 'next-intl/server';
import type { Metadata } from 'next';
import { getHeadingFont, getBodyFont, isIndicLocale } from '@/lib/utils/locale-fonts';
import { lt } from '@/lib/learn/translations';
import type { LocaleText } from '@/lib/learn/translations';
import L from '@/messages/learn/sunrise-and-tithi.json';
import ReferenceBlock from '@/components/ui/ReferenceBlock';
import { Link } from '@/lib/i18n/navigation';
import { getPageMetadata } from '@/lib/seo/metadata';
import { safeJsonLd } from '@/lib/seo/safe-jsonld';
import { generateBreadcrumbLD, generatePersonLD } from '@/lib/seo/structured-data';

const T = L as unknown as Record<string, LocaleText>;

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  setRequestLocale(locale);
  return getPageMetadata('/learn/sunrise-and-tithi', locale);
}

export default async function SunriseAndTithiPage() {
  const locale = await getLocale();
  setRequestLocale(locale);
  const headingFont = getHeadingFont(locale);
  const bodyFont = isIndicLocale(locale) ? getBodyFont(locale) ?? undefined : undefined;
  const t = (k: string) => lt(T[k], locale);
  const breadcrumbLD = generateBreadcrumbLD(`/${locale}/learn/sunrise-and-tithi`, locale);

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
          { '@type': 'Thing', name: 'Tithi (lunar day)' },
          { '@type': 'Thing', name: 'Kala-vyapti rule for festival/vrat day determination' },
          { '@type': 'Thing', name: 'Smarta and Vaishnava tradition differences' },
        ],
        mentions: [
          { '@type': 'Book', name: 'Dharmasindhu', author: { '@type': 'Person', name: 'Kasinatha Upadhyaya' } },
          { '@type': 'Book', name: 'Nirnaya Sindhu', author: { '@type': 'Person', name: 'Kamalakara Bhatta' } },
          { '@type': 'Book', name: 'Surya Siddhanta' },
        ],
      }) }} />

      <header className="space-y-3">
        <p className="text-xs uppercase tracking-[0.18em] font-bold text-gold-primary">{t('tagline')}</p>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gold-light leading-tight" style={headingFont}>
          {t('title')}
        </h1>
        <p className="text-text-secondary text-base sm:text-lg leading-relaxed max-w-3xl" style={bodyFont}>{t('subtitle')}</p>
      </header>

      <ReferenceBlock
        id="kala-vyapti-windows"
        title={t('refBlockTitle')}
        intro={t('refBlockIntro')}
        rows={[
          { id: 'sunrise',     label: t('refRowSunrise'),     value: t('refRowSunriseV'),     note: t('refRowSunriseNote') },
          { id: 'arunodaya',   label: t('refRowArunodaya'),   value: t('refRowArunodayaV'),   note: t('refRowArunodayaNote') },
          { id: 'madhyahna',   label: t('refRowMadhyahna'),   value: t('refRowMadhyahnaV'),   note: t('refRowMadhyahnaNote') },
          { id: 'aparahna',    label: t('refRowAparahna'),    value: t('refRowAparahnaV'),    note: t('refRowAparahnaNote') },
          { id: 'pradosha',    label: t('refRowPradosha'),    value: t('refRowPradoshaV'),    note: t('refRowPradoshaNote') },
          { id: 'nishita',     label: t('refRowNishita'),     value: t('refRowNishitaV'),     note: t('refRowNishitaNote') },
          { id: 'chandrodaya', label: t('refRowChandrodaya'), value: t('refRowChandrodayaV'), note: t('refRowChandrodayaNote') },
          { id: 'sunset',      label: t('refRowSunset'),      value: t('refRowSunsetV'),      note: t('refRowSunsetNote') },
          { id: 'duration',    label: t('refRowDuration'),    value: t('refRowDurationV'),    note: t('refRowDurationNote') },
        ]}
        sourceCitation={t('refBlockSource')}
        copyLinkLabel={t('refCopyLink')}
        copiedLabel={t('refCopied')}
        locale={locale}
      />

      <section id="why-differ" className="space-y-4">
        <h2 className="text-2xl sm:text-3xl font-bold text-gold-light" style={headingFont}>{t('whyDifferTitle')}</h2>
        <p className="text-text-secondary leading-relaxed" style={bodyFont}>{t('whyDifferP1')}</p>
        <p className="text-text-secondary leading-relaxed" style={bodyFont}>{t('whyDifferP2')}</p>
      </section>

      <section id="engine-rule" className="space-y-4">
        <h2 className="text-2xl sm:text-3xl font-bold text-gold-light" style={headingFont}>{t('engineRuleTitle')}</h2>
        <p className="text-text-secondary leading-relaxed" style={bodyFont}>{t('engineRuleP1')}</p>
        <p className="text-text-secondary leading-relaxed" style={bodyFont}>{t('engineRuleP2')}</p>
      </section>

      <section id="example" className="space-y-4">
        <h2 className="text-2xl sm:text-3xl font-bold text-gold-light" style={headingFont}>{t('exampleTitle')}</h2>
        <p className="text-text-secondary leading-relaxed" style={bodyFont}>{t('exampleP1')}</p>
      </section>

      <section className="space-y-3 border-t border-gold-primary/15 pt-8">
        <h2 className="text-xl font-bold text-gold-light" style={headingFont}>{t('relatedTitle')}</h2>
        <ul className="space-y-2 text-sm">
          <li><Link href="/learn/tithis" className="text-gold-primary hover:text-gold-light transition-colors">→ {t('relatedTithis')}</Link></li>
          <li><Link href="/about/methodology" className="text-gold-primary hover:text-gold-light transition-colors">→ {t('relatedMethodology')}</Link></li>
          <li><Link href="/learn/ayanamsha-comparison" className="text-gold-primary hover:text-gold-light transition-colors">→ {t('relatedAyanamsha')}</Link></li>
        </ul>
      </section>
    </main>
  );
}
