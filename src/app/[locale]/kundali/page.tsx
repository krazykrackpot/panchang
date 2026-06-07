import { setRequestLocale } from 'next-intl/server';
import Link from 'next/link';
import { FEATURED_YOGAS } from '@/lib/seo/lagna-seo';
import { RASHIS } from '@/lib/constants/rashis';
import { tl } from '@/lib/utils/trilingual';
import { pickKundaliLabel as L } from '@/lib/content/kundali-page-labels';
import KundaliClient from './Client';

export const revalidate = 86400;

// Symbol-only map for the 12 ascendant chips. Names + slugs come from
// the canonical RASHIS constant (10-locale) so we don't duplicate
// translations or sign IDs.
const LAGNA_SYMBOLS: Record<string, string> = {
  mesh: '♈', vrishabh: '♉', mithun: '♊', kark: '♋',
  simha: '♌', kanya: '♍', tula: '♎', vrishchik: '♏',
  dhanu: '♐', makar: '♑', kumbh: '♒', meen: '♓',
};
// /kundali/lagna/[sign] expects English slugs (aries/taurus/…), not the
// Sanskrit slugs used in RASHIS. Map locally so the SEO route layout is
// preserved without forking the canonical constant.
const LAGNA_ROUTE_SLUG: Record<string, string> = {
  mesh: 'aries', vrishabh: 'taurus', mithun: 'gemini', kark: 'cancer',
  simha: 'leo', kanya: 'virgo', tula: 'libra', vrishchik: 'scorpio',
  dhanu: 'sagittarius', makar: 'capricorn', kumbh: 'aquarius', meen: 'pisces',
};

export default async function KundaliPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <>
      {/* ── Interactive client component FIRST — form must be above the fold ── */}
      <KundaliClient />

      {/* ── Server-rendered SEO content BELOW the form (crawlable but not blocking conversion) ── */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">
        <article className="prose-sm text-text-secondary leading-relaxed space-y-4 mb-10">
          <h2 className="text-gold-light text-xl font-bold">{L('introHeading', locale)}</h2>
          <p>{L('intro', locale)}</p>

          <h3 className="text-gold-light text-lg font-bold mt-6">{L('requirementsHeading', locale)}</h3>
          <p><strong>{L('requirementsLead', locale)}</strong></p>
          <ul className="list-disc ml-4 space-y-1">
            <li><strong>{L('req1Label', locale)}</strong> {L('req1Text', locale)}</li>
            <li><strong>{L('req2Label', locale)}</strong> {L('req2Text', locale)}</li>
            <li><strong>{L('req3Label', locale)}</strong> {L('req3Text', locale)}</li>
          </ul>
          <p>{L('requirementsExplain', locale)}</p>

          <h3 className="text-gold-light text-lg font-bold mt-6">{L('stylesHeading', locale)}</h3>
          <p><strong>{L('stylesNorthLabel', locale)}</strong> {L('stylesNorthText', locale)}</p>
          <p><strong>{L('stylesSouthLabel', locale)}</strong> {L('stylesSouthText', locale)}</p>

          {/* 12 Houses table */}
          <h3 className="text-gold-light text-lg font-bold mt-6">{L('tableHeading', locale)}</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse mt-3">
              <thead>
                <tr className="border-b border-gold-primary/15">
                  <th className="text-center py-2 px-2 text-gold-dark font-bold w-12">#</th>
                  <th className="text-left py-2 px-3 text-gold-dark font-bold">{L('tableHouseCol', locale)}</th>
                  <th className="text-left py-2 px-3 text-gold-dark font-bold">{L('tableAreaCol', locale)}</th>
                </tr>
              </thead>
              <tbody>
                {Array.from({ length: 12 }, (_, i) => i + 1).map((n) => (
                  <tr key={n} className="border-b border-gold-primary/5">
                    <td className="py-1.5 px-2 text-center text-gold-light font-bold">{n}</td>
                    <td className="py-1.5 px-3 text-text-primary font-medium text-xs">{L(`h${n}Name`, locale)}</td>
                    <td className="py-1.5 px-3 text-text-secondary text-xs">{L(`h${n}Area`, locale)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <p className="mt-4">{L('formIntroBelow', locale)}</p>

          {/* SEO step 3 PR-2 — Explore by Lagna. Sign names + slugs come
              from the canonical RASHIS constant (10-locale); the route
              slugs (/kundali/lagna/<aries>) stay English via LAGNA_ROUTE_SLUG. */}
          <h3 className="text-gold-light text-lg font-bold mt-8">{L('exploreLagnaHeading', locale)}</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 text-sm mt-3 mb-2">
            {RASHIS.map(r => (
              <Link
                key={r.slug}
                href={`/${locale}/kundali/lagna/${LAGNA_ROUTE_SLUG[r.slug]}`}
                className="block px-3 py-2 rounded-lg border border-white/10 text-text-primary hover:border-gold-primary/40 hover:bg-gold-primary/5 transition-colors text-xs"
              >
                {LAGNA_SYMBOLS[r.slug]} {tl(r.name, locale)} {L('lagnaSuffix', locale)}
              </Link>
            ))}
          </div>

          {/* Featured yogas — cross-link to /learn/yoga/[slug]. FEATURED_YOGAS
              ships en/hi only; tl() degrades to en for other locales. The
              surrounding chrome (heading + "Yoga" suffix) IS localised. */}
          <h3 className="text-gold-light text-lg font-bold mt-8">{L('featuredYogasHeading', locale)}</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2 text-sm mt-3 mb-2">
            {FEATURED_YOGAS.map(y => (
              <Link
                key={y.slug}
                href={`/${locale}/learn/yoga/${y.slug}`}
                className="block px-3 py-2 rounded-lg border border-white/10 text-text-primary hover:border-gold-primary/40 hover:bg-gold-primary/5 transition-colors text-xs"
              >
                {tl({ en: y.en, hi: y.hi }, locale)} {L('yogaSuffix', locale)}
              </Link>
            ))}
          </div>

          {/* Internal links */}
          <div className="flex flex-wrap gap-3 mt-8 text-sm">
            <Link href={`/${locale}/matching`} className="text-gold-primary hover:text-gold-light transition-colors">{L('linkMatching', locale)}</Link>
            <Link href={`/${locale}/sade-sati`} className="text-gold-primary hover:text-gold-light transition-colors">{L('linkSadeSati', locale)}</Link>
            <Link href={`/${locale}/learn/kundali`} className="text-gold-primary hover:text-gold-light transition-colors">{L('linkLearnKundali', locale)}</Link>
            <Link href={`/${locale}/learn/grahas`} className="text-gold-primary hover:text-gold-light transition-colors">{L('linkLearnGrahas', locale)}</Link>
          </div>
        </article>
      </section>
    </>
  );
}
