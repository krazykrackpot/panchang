/**
 * /learn/ayanamsha-comparison — argument-fuelling reference page.
 *
 * First page in the Phase 3 "argument-fuelling" Learn series. Designed
 * to be the page bloggers and forum posters CITE when explaining "why
 * your Lagna shifts between ayanamsha systems." The Phase 1 work
 * (ReferenceBlock + Calculation Standards expansion) gives this page
 * the anchored-citation surface; this page adds the prose argument
 * + concrete worked example.
 *
 * Structure:
 *   - Hero (title + tagline + subtitle)
 *   - ReferenceBlock with 6 ayanamsha values at 2026.0 CE
 *   - "Why ayanamsha matters" (intro + math)
 *   - "Worked example" — 5 tropical-Lagna values + per-system sidereal
 *   - "Why our engine uses Lahiri"
 *   - "When you might prefer another system"
 *   - Related links (cross-link to /about/methodology + /learn/ayanamsha + /learn/kp-system)
 */

import { setRequestLocale, getLocale } from 'next-intl/server';
import type { Metadata } from 'next';
import { getHeadingFont, getBodyFont, isIndicLocale } from '@/lib/utils/locale-fonts';
import { lt } from '@/lib/learn/translations';
import type { LocaleText } from '@/lib/learn/translations';
import L from '@/messages/learn/ayanamsha-comparison.json';
import ReferenceBlock from '@/components/ui/ReferenceBlock';
import { Link } from '@/lib/i18n/navigation';
import { getPageMetadata } from '@/lib/seo/metadata';
import { safeJsonLd } from '@/lib/seo/safe-jsonld';
import { generateBreadcrumbLD } from '@/lib/seo/structured-data';

const T = L as unknown as Record<string, LocaleText>;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  setRequestLocale(locale);
  return getPageMetadata('/learn/ayanamsha-comparison', locale);
}

// ─── Worked-example table ────────────────────────────────────────────
//
// Each row is a TROPICAL Lagna value; the four right columns show
// what the sidereal Lagna becomes under each system at 2026.0 CE.
//
// Numbers are derived from the ReferenceBlock ayanamsha values
// (Lahiri 24.22°, Raman 22.82°, KP 24.13°, Fagan 24.87°) — pure
// subtraction with sign-boundary wrap. Stable, deterministic,
// verifiable against any sidereal calculator.
const EXAMPLE_ROWS: Array<{
  tropical: string;
  lahiri: string;
  raman: string;
  kp: string;
  fagan: string;
  /** When at least one system lands in a different rashi than the others
   *  this row is highlighted as the "cusp-shift" demonstration. */
  cuspShift?: boolean;
}> = [
  { tropical: "0°00' Aries",   lahiri: "5°47' Pisces",  raman: "7°10' Pisces",  kp: "5°52' Pisces",  fagan: "5°08' Pisces" },
  { tropical: "24°13' Aries",  lahiri: "0°00' Aries",   raman: "1°23' Aries",   kp: "0°05' Aries",   fagan: "-0°41' = 29°19' Pisces", cuspShift: true },
  { tropical: "24°50' Taurus", lahiri: "0°37' Taurus",  raman: "2°00' Taurus",  kp: "0°42' Taurus",  fagan: "-0°04' = 29°56' Aries",  cuspShift: true },
  { tropical: "15°00' Leo",    lahiri: "20°47' Cancer", raman: "22°10' Cancer", kp: "20°52' Cancer", fagan: "20°08' Cancer" },
  { tropical: "10°00' Sagittarius", lahiri: "15°47' Scorpio", raman: "17°10' Scorpio", kp: "15°52' Scorpio", fagan: "15°08' Scorpio" },
];

export default async function AyanamshaComparisonPage() {
  const locale = await getLocale();
  const headingFont = getHeadingFont(locale);
  const bodyFont = isIndicLocale(locale) ? getBodyFont(locale) ?? undefined : undefined;
  const t = (key: string) => lt(T[key], locale);
  const breadcrumbLD = generateBreadcrumbLD(`/${locale}/learn/ayanamsha-comparison`, locale);

  return (
    <main className="max-w-4xl mx-auto px-4 py-12 space-y-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: safeJsonLd(breadcrumbLD) }}
      />
      {/* TechArticle JSON-LD — citation-friendly so LLM scrapers pick up
          the canonical sources we reference. */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: safeJsonLd({
          '@context': 'https://schema.org',
          '@type': 'TechArticle',
          headline: t('title'),
          description: t('subtitle'),
          author: { '@type': 'Organization', name: 'Dekho Panchang' },
          dateModified: '2026-06-10',
          proficiencyLevel: 'Intermediate',
          about: [
            { '@type': 'Thing', name: 'Ayanamsha (sidereal-tropical offset)' },
            { '@type': 'Thing', name: 'Sidereal vs tropical zodiac' },
            { '@type': 'Thing', name: 'Lahiri Chitrapaksha' },
            { '@type': 'Thing', name: 'Krishnamurti Padhdhati (KP) ayanamsha' },
          ],
          mentions: [
            { '@type': 'Book', name: 'Indian Astronomical Ephemeris' },
            { '@type': 'CreativeWork', name: 'JPL Horizons' },
            { '@type': 'SoftwareApplication', name: 'Swiss Ephemeris' },
            { '@type': 'Person', name: 'N.C. Lahiri' },
            { '@type': 'Person', name: 'B.V. Raman' },
            { '@type': 'Person', name: 'K.S. Krishnamurti' },
          ],
        }) }}
      />

      {/* Hero */}
      <header className="space-y-3">
        <p className="text-xs uppercase tracking-[0.18em] font-bold text-gold-primary">
          {t('tagline')}
        </p>
        <h1
          className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gold-light leading-tight"
          style={headingFont}
        >
          {t('title')}
        </h1>
        <p className="text-text-secondary text-base sm:text-lg leading-relaxed max-w-3xl" style={bodyFont}>
          {t('subtitle')}
        </p>
      </header>

      {/* Reference block — quotable summary up top */}
      <ReferenceBlock
        id="ayanamsha-comparison"
        title={t('refBlockTitle')}
        intro={t('refBlockIntro')}
        rows={[
          { id: 'lahiri',     label: t('refRowLahiri'),     value: t('refRowLahiriValue'),     note: t('refRowLahiriNote') },
          { id: 'kp',         label: t('refRowKp'),         value: t('refRowKpValue'),         note: t('refRowKpNote') },
          { id: 'raman',      label: t('refRowRaman'),      value: t('refRowRamanValue'),      note: t('refRowRamanNote') },
          { id: 'fagan',      label: t('refRowFagan'),      value: t('refRowFaganValue'),      note: t('refRowFaganNote') },
          { id: 'yukteshwar', label: t('refRowYukteshwar'), value: t('refRowYukteshwarValue'), note: t('refRowYukteshwarNote') },
          { id: 'surya',      label: t('refRowSurya'),      value: t('refRowSuryaValue'),      note: t('refRowSuryaNote') },
        ]}
        sourceCitation={t('refBlockSource')}
        copyLinkLabel={t('refCopyLink')}
        copiedLabel={t('refCopied')}
        locale={locale}
      />

      {/* Why it matters */}
      <section id="why-ayanamsha-matters" className="space-y-4">
        <h2 className="text-2xl sm:text-3xl font-bold text-gold-light" style={headingFont}>
          {t('whyMattersTitle')}
        </h2>
        <p className="text-text-secondary leading-relaxed" style={bodyFont}>{t('whyMattersP1')}</p>
        <p className="text-text-secondary leading-relaxed" style={bodyFont}>{t('whyMattersP2')}</p>
      </section>

      {/* Worked example */}
      <section id="worked-example" className="space-y-4">
        <h2 className="text-2xl sm:text-3xl font-bold text-gold-light" style={headingFont}>
          {t('examplesTitle')}
        </h2>
        <p className="text-text-secondary leading-relaxed" style={bodyFont}>{t('examplesIntro')}</p>
        <div className="overflow-x-auto -mx-4 px-4 sm:mx-0 sm:px-0">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="border-b border-gold-primary/20 text-gold-light">
                <th className="text-left py-2 pr-4 font-semibold">Tropical Lagna</th>
                <th className="text-left py-2 pr-4 font-semibold">Lahiri</th>
                <th className="text-left py-2 pr-4 font-semibold">Raman</th>
                <th className="text-left py-2 pr-4 font-semibold">KP</th>
                <th className="text-left py-2 pr-4 font-semibold">Fagan-Bradley</th>
              </tr>
            </thead>
            <tbody className="font-mono tabular-nums">
              {EXAMPLE_ROWS.map((row, i) => (
                <tr
                  key={i}
                  className={
                    row.cuspShift
                      ? 'border-b border-gold-primary/10 bg-gold-primary/[0.06]'
                      : 'border-b border-gold-primary/10'
                  }
                  title={row.cuspShift ? 'Lagna lands in a different rashi under at least one system — cusp shift' : undefined}
                >
                  <td className="py-2 pr-4 text-text-primary">{row.tropical}</td>
                  <td className="py-2 pr-4 text-text-primary">{row.lahiri}</td>
                  <td className="py-2 pr-4 text-text-primary">{row.raman}</td>
                  <td className="py-2 pr-4 text-text-primary">{row.kp}</td>
                  <td className="py-2 pr-4 text-text-primary">{row.fagan}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-xs text-text-secondary italic">
          Rows highlighted in gold are <strong>cusp-shift</strong> examples — the tropical Lagna falls
          close enough to a sign boundary that the choice of ayanamsha changes the sidereal sign,
          and therefore the Lagna lord and the entire Vimshottari Dasha sequence anchor.
        </p>
      </section>

      {/* Why Lahiri */}
      <section id="why-lahiri" className="space-y-4">
        <h2 className="text-2xl sm:text-3xl font-bold text-gold-light" style={headingFont}>
          {t('whyLahiriTitle')}
        </h2>
        <p className="text-text-secondary leading-relaxed" style={bodyFont}>{t('whyLahiriP1')}</p>
        <p className="text-text-secondary leading-relaxed" style={bodyFont}>{t('whyLahiriP2')}</p>
      </section>

      {/* When to switch */}
      <section id="when-to-switch" className="space-y-4">
        <h2 className="text-2xl sm:text-3xl font-bold text-gold-light" style={headingFont}>
          {t('whenSwitchTitle')}
        </h2>
        <p className="text-text-secondary leading-relaxed" style={bodyFont}>{t('whenSwitchP1')}</p>
        <p className="text-text-secondary leading-relaxed" style={bodyFont}>{t('whenSwitchP2')}</p>
      </section>

      {/* Related */}
      <section className="space-y-3 border-t border-gold-primary/15 pt-8">
        <h2 className="text-xl font-bold text-gold-light" style={headingFont}>{t('relatedTitle')}</h2>
        <ul className="space-y-2 text-sm">
          <li>
            <Link href="/learn/ayanamsha" className="text-gold-primary hover:text-gold-light transition-colors">
              → {t('relatedAyanamsha')}
            </Link>
          </li>
          <li>
            <Link href="/about/methodology#kp-system" className="text-gold-primary hover:text-gold-light transition-colors">
              → {t('relatedKp')}
            </Link>
          </li>
          <li>
            <Link href="/about/methodology" className="text-gold-primary hover:text-gold-light transition-colors">
              → {t('relatedMethodology')}
            </Link>
          </li>
        </ul>
      </section>
    </main>
  );
}
