'use client';

import { useState, useMemo, useCallback, useRef, Fragment } from 'react';
import { useLocale } from 'next-intl';
import { motion } from 'framer-motion';
import { Link } from '@/lib/i18n/navigation';
import { ArrowLeft } from 'lucide-react';
import GoldDivider from '@/components/ui/GoldDivider';
import { RASHIS } from '@/lib/constants/rashis';
import { getPairContent } from '@/lib/constants/rashi-compatibility';
import { RashiIconById } from '@/components/icons/RashiIcons';
import { tl } from '@/lib/utils/trilingual';
import { generateBreadcrumbLD } from '@/lib/seo/structured-data';
import type { Locale } from '@/types/panchang';
import { isDevanagariLocale } from '@/lib/utils/locale-fonts';
import { safeJsonLd } from '@/lib/seo/safe-jsonld';

// ─── Labels ────────────────────────────────────────────────
const LABELS: Record<string, Record<string, string>> = {
  en: {
    title: 'Vedic Rashi Compatibility Chart',
    subtitle: 'Click any cell to see detailed compatibility analysis',
    selectFirst: 'Select First Rashi',
    selectSecond: 'Select Second Rashi',
    viewDetail: 'View Detailed Analysis',
    howToUse: 'How to Use This Chart',
    howToUseDesc: 'Find your Moon sign (Rashi) on the left axis and your partner\'s on the top. The cell color and score indicate compatibility: green is excellent, gold is good, amber is average, red needs attention. Click any cell for a detailed breakdown.',
    backToMatching: 'Back to Matching Tool',
    fullMatchingCta: 'For personalized compatibility analysis using your exact birth details, use our full Ashta Kuta matching tool.',
    aboutTitle: 'About Vedic Compatibility',
    aboutDesc: 'Vedic compatibility is based on the Ashta Kuta system, which evaluates eight factors between two Moon signs. Scores range from 0 to 36, with 18+ generally considered favorable for marriage. This chart provides a quick overview based on Rashi (Moon sign) alone.',
    score: 'Score',
    outOf: 'out of 36',
    legend: 'Legend',
    excellent: 'Excellent (25+)',
    good: 'Good (18-24)',
    average: 'Average (13-17)',
    challenging: 'Challenging (<13)',
  },
  hi: {
    title: 'वैदिक राशि संगतता चार्ट',
    subtitle: 'विस्तृत विश्लेषण के लिए किसी भी सेल पर क्लिक करें',
    selectFirst: 'पहली राशि चुनें',
    selectSecond: 'दूसरी राशि चुनें',
    viewDetail: 'विस्तृत विश्लेषण देखें',
    howToUse: 'इस चार्ट का उपयोग कैसे करें',
    howToUseDesc: 'बाईं ओर अपनी चंद्र राशि और ऊपर अपने साथी की राशि खोजें। सेल का रंग और स्कोर संगतता दर्शाता है।',
    backToMatching: 'मिलान टूल पर वापस',
    fullMatchingCta: 'अपने सटीक जन्म विवरण के साथ व्यक्तिगत विश्लेषण के लिए हमारे अष्ट कूट मिलान टूल का उपयोग करें।',
    aboutTitle: 'वैदिक संगतता के बारे में',
    aboutDesc: 'वैदिक संगतता अष्ट कूट प्रणाली पर आधारित है, जो दो चंद्र राशियों के बीच आठ कारकों का मूल्यांकन करती है। स्कोर 0 से 36 तक होता है, 18+ विवाह के लिए अनुकूल माना जाता है।',
    score: 'स्कोर',
    outOf: '/ 36',
    legend: 'रंग-संकेत',
    excellent: 'उत्कृष्ट (25+)',
    good: 'अच्छा (18-24)',
    average: 'औसत (13-17)',
    challenging: 'कठिन (<13)',
  },
  sa: {
    title: 'वैदिकराशिसंगततासारिणी',
    subtitle: 'विशदविश्लेषणाय क्लिक् कुरुत',
    selectFirst: 'प्रथमां राशिं चिनुत',
    selectSecond: 'द्वितीयां राशिं चिनुत',
    viewDetail: 'विशदं पश्यतु',
    howToUse: 'अस्याः सारिण्याः उपयोगः',
    howToUseDesc: 'वामपार्श्वे स्वराशिं शीर्षे साथिनः राशिं च अन्विष्यतु।',
    backToMatching: 'मिलानम्',
    fullMatchingCta: 'अष्टकूटमिलानसाधनस्य उपयोगं कुरुत।',
    aboutTitle: 'वैदिकसंगतताविषये',
    aboutDesc: 'वैदिकसंगतता अष्टकूटपद्धत्या आधारिता। अङ्काः ० तः ३६ पर्यन्तम्, १८+ विवाहाय अनुकूलम्।',
    score: 'अङ्कः',
    outOf: '/ ३६',
    legend: 'वर्णसङ्केतः',
    excellent: 'उत्कृष्टम् (25+)',
    good: 'उत्तमम् (18-24)',
    average: 'साधारणम् (13-17)',
    challenging: 'कठिनम् (<13)',
  },
};

// Short rashi names for compact headers
const SHORT_NAMES: Record<string, string[]> = {
  en: ['Ari', 'Tau', 'Gem', 'Can', 'Leo', 'Vir', 'Lib', 'Sco', 'Sag', 'Cap', 'Aqu', 'Pis'],
  hi: ['मेष', 'वृष', 'मिथ', 'कर्क', 'सिंह', 'कन्या', 'तुला', 'वृश्चि', 'धनु', 'मकर', 'कुम्भ', 'मीन'],
  sa: ['मेष', 'वृष', 'मिथ', 'कर्क', 'सिंह', 'कन्या', 'तुला', 'वृश्चि', 'धनु', 'मकर', 'कुम्भ', 'मीन'],
};

// ─── Helpers ───────────────────────────────────────────────

function getScore(r1: number, r2: number): number {
  const pair = getPairContent(r1, r2);
  return pair?.score ?? 0;
}

function getOneLiner(r1: number, r2: number, locale: string): string {
  const pair = getPairContent(r1, r2);
  if (!pair) return '';
  return pair.oneLiner[locale] || pair.oneLiner.en || '';
}

function getPairSlug(r1: number, r2: number): string {
  const lo = Math.min(r1, r2);
  const hi = Math.max(r1, r2);
  return `${RASHIS[lo - 1].slug}-and-${RASHIS[hi - 1].slug}`;
}

function getScoreColor(score: number): string {
  if (score >= 25) return 'bg-emerald-500/25 text-emerald-300 border-emerald-500/30';
  if (score >= 18) return 'bg-gold-primary/25 text-gold-light border-gold-primary/30';
  if (score >= 13) return 'bg-amber-500/25 text-amber-300 border-amber-500/30';
  return 'bg-red-500/30 text-red-300 border-red-500/30';
}

function getScoreColorMinimal(score: number): string {
  if (score >= 25) return 'bg-emerald-500/25';
  if (score >= 18) return 'bg-gold-primary/25';
  if (score >= 13) return 'bg-amber-500/25';
  return 'bg-red-500/30';
}

// ─── Component ─────────────────────────────────────────────

export default function CompatibilityHeatmapPage() {
  const locale = useLocale() as Locale;
  const L = LABELS[locale] || LABELS.en;
  const shortNames = SHORT_NAMES[locale] || SHORT_NAMES.en;
  const isDevanagari = isDevanagariLocale(locale);
  const headingFont = isDevanagari
    ? { fontFamily: 'var(--font-devanagari-heading)' }
    : { fontFamily: 'var(--font-heading)' };

  // Tooltip state for desktop heatmap
  const [tooltip, setTooltip] = useState<{ x: number; y: number; text: string; score: number; r1: string; r2: string } | null>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  // Mobile dropdown state
  const [rashi1, setRashi1] = useState<number>(0);
  const [rashi2, setRashi2] = useState<number>(0);

  // Precompute all scores
  const scoreMatrix = useMemo(() => {
    const matrix: number[][] = [];
    for (let r = 1; r <= 12; r++) {
      const row: number[] = [];
      for (let c = 1; c <= 12; c++) {
        row.push(getScore(r, c));
      }
      matrix.push(row);
    }
    return matrix;
  }, []);

  const handleCellHover = useCallback((e: React.MouseEvent, r1: number, r2: number) => {
    const rect = gridRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const score = scoreMatrix[r1 - 1][r2 - 1];
    setTooltip({
      x,
      y,
      text: getOneLiner(r1, r2, locale),
      score,
      r1: tl(RASHIS[r1 - 1].name, locale),
      r2: tl(RASHIS[r2 - 1].name, locale),
    });
  }, [locale, scoreMatrix]);

  const handleCellLeave = useCallback(() => {
    setTooltip(null);
  }, []);

  // Mobile result
  const mobileResult = useMemo(() => {
    if (rashi1 === 0 || rashi2 === 0) return null;
    const score = getScore(rashi1, rashi2);
    const oneLiner = getOneLiner(rashi1, rashi2, locale);
    const pair = getPairContent(rashi1, rashi2);
    const summary = pair ? (pair.summary[locale] || pair.summary.en || '') : '';
    const slug = getPairSlug(rashi1, rashi2);
    return { score, oneLiner, summary, slug };
  }, [rashi1, rashi2, locale]);

  // Breadcrumb JSON-LD
  const breadcrumbLD = generateBreadcrumbLD(`/${locale}/matching/compatibility`, locale);

  return (
    <main className="min-h-screen bg-primary">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: safeJsonLd(breadcrumbLD) }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back link */}
        <Link
          href="/matching"
          className="inline-flex items-center gap-2 text-text-secondary hover:text-gold-light transition-colors mb-6"
        >
          <ArrowLeft size={16} />
          <span>{L.backToMatching}</span>
        </Link>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: 'easeOut' as const }}
          className="text-center mb-10"
        >
          <h1
            className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gold-light mb-3"
            style={headingFont}
          >
            {L.title}
          </h1>
          <p className="text-text-secondary text-lg max-w-2xl mx-auto">
            {L.subtitle}
          </p>
        </motion.div>

        {/* Legend */}
        <div className="flex flex-wrap items-center justify-center gap-4 mb-8">
          <span className="text-text-secondary text-sm font-medium">{L.legend}:</span>
          <span className="inline-flex items-center gap-1.5 text-xs">
            <span className="w-4 h-4 rounded bg-emerald-500/25 border border-emerald-500/30" />
            <span className="text-emerald-300">{L.excellent}</span>
          </span>
          <span className="inline-flex items-center gap-1.5 text-xs">
            <span className="w-4 h-4 rounded bg-gold-primary/25 border border-gold-primary/30" />
            <span className="text-gold-light">{L.good}</span>
          </span>
          <span className="inline-flex items-center gap-1.5 text-xs">
            <span className="w-4 h-4 rounded bg-amber-500/25 border border-amber-500/30" />
            <span className="text-amber-300">{L.average}</span>
          </span>
          <span className="inline-flex items-center gap-1.5 text-xs">
            <span className="w-4 h-4 rounded bg-red-500/30 border border-red-500/30" />
            <span className="text-red-300">{L.challenging}</span>
          </span>
        </div>

        {/* ─── Desktop Heatmap (md+) ─────────────────────────── */}
        <div className="hidden md:block" ref={gridRef}>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2, ease: 'easeOut' as const }}
            className="relative overflow-x-auto"
          >
            <div
              className="grid gap-[2px] min-w-[700px]"
              style={{ gridTemplateColumns: 'auto repeat(12, minmax(0, 1fr))' }}
            >
              {/* Corner cell */}
              <div className="w-16" />

              {/* Column headers */}
              {RASHIS.map((r, i) => (
                <div
                  key={`col-${r.id}`}
                  className="flex flex-col items-center justify-end pb-1 px-0.5"
                >
                  <RashiIconById id={r.id} size={20} />
                  <span className="text-[10px] text-text-secondary mt-0.5 leading-tight text-center whitespace-nowrap">
                    {shortNames[i]}
                  </span>
                </div>
              ))}

              {/* Rows */}
              {RASHIS.map((rowRashi, ri) => (
                <Fragment key={`row-${rowRashi.id}`}>
                  {/* Row header */}
                  <div
                    className="flex items-center gap-1.5 pr-2 justify-end w-16"
                  >
                    <span className="text-[10px] text-text-secondary whitespace-nowrap">
                      {shortNames[ri]}
                    </span>
                    <RashiIconById id={rowRashi.id} size={20} />
                  </div>

                  {/* Cells */}
                  {RASHIS.map((colRashi) => {
                    const score = scoreMatrix[ri][colRashi.id - 1];
                    const colorClass = getScoreColor(score);
                    const slug = getPairSlug(rowRashi.id, colRashi.id);

                    return (
                      <Link
                        key={`cell-${rowRashi.id}-${colRashi.id}`}
                        href={`/matching/${slug}`}
                        className={`
                          flex items-center justify-center aspect-square rounded-sm
                          border text-xs font-semibold cursor-pointer
                          transition-all duration-150
                          hover:scale-110 hover:z-10 hover:border-gold-primary hover:shadow-lg hover:shadow-gold-primary/20
                          ${colorClass}
                        `}
                        onMouseEnter={(e) => handleCellHover(e, rowRashi.id, colRashi.id)}
                        onMouseLeave={handleCellLeave}
                      >
                        {score}
                      </Link>
                    );
                  })}
                </Fragment>
              ))}
            </div>

            {/* Tooltip */}
            {tooltip && (
              <div
                className="absolute z-50 pointer-events-none bg-bg-secondary border border-gold-primary/30 rounded-lg px-3 py-2 shadow-xl max-w-xs"
                style={{
                  left: Math.min(tooltip.x + 12, (gridRef.current?.clientWidth ?? 800) - 260),
                  top: tooltip.y - 60,
                }}
              >
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-gold-light font-semibold text-sm">
                    {tooltip.r1} + {tooltip.r2}
                  </span>
                  <span className={`text-xs font-bold px-1.5 py-0.5 rounded ${getScoreColorMinimal(tooltip.score)}`}>
                    {tooltip.score}/36
                  </span>
                </div>
                <p className="text-text-secondary text-xs leading-relaxed">
                  {tooltip.text}
                </p>
              </div>
            )}
          </motion.div>
        </div>

        {/* ─── Mobile Dropdown Picker (below md) ─────────────── */}
        <div className="md:hidden">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: 'easeOut' as const }}
            className="space-y-4"
          >
            {/* First rashi select */}
            <div>
              <label className="block text-text-secondary text-sm mb-1.5">{L.selectFirst}</label>
              <select
                value={rashi1}
                onChange={(e) => setRashi1(Number(e.target.value))}
                className="w-full bg-bg-secondary border border-gold-primary/20 text-text-primary rounded-lg px-4 py-3 text-base focus:outline-none focus:border-gold-primary/50 transition-colors"
              >
                <option value={0}>{L.selectFirst}</option>
                {RASHIS.map((r) => (
                  <option key={r.id} value={r.id}>
                    {tl(r.name, locale)}
                  </option>
                ))}
              </select>
            </div>

            {/* Second rashi select */}
            <div>
              <label className="block text-text-secondary text-sm mb-1.5">{L.selectSecond}</label>
              <select
                value={rashi2}
                onChange={(e) => setRashi2(Number(e.target.value))}
                className="w-full bg-bg-secondary border border-gold-primary/20 text-text-primary rounded-lg px-4 py-3 text-base focus:outline-none focus:border-gold-primary/50 transition-colors"
              >
                <option value={0}>{L.selectSecond}</option>
                {RASHIS.map((r) => (
                  <option key={r.id} value={r.id}>
                    {tl(r.name, locale)}
                  </option>
                ))}
              </select>
            </div>

            {/* Result card */}
            {mobileResult && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, ease: 'easeOut' as const }}
                className="bg-bg-secondary border border-gold-primary/20 rounded-xl p-5 space-y-4"
              >
                {/* Icons and score */}
                <div className="flex items-center justify-center gap-6">
                  <div className="flex flex-col items-center gap-1">
                    <RashiIconById id={rashi1} size={40} />
                    <span className="text-text-primary text-sm font-medium">
                      {tl(RASHIS[rashi1 - 1].name, locale)}
                    </span>
                  </div>

                  <div className="flex flex-col items-center">
                    <span className={`text-3xl font-bold px-3 py-1 rounded-lg ${getScoreColor(mobileResult.score)}`}>
                      {mobileResult.score}
                    </span>
                    <span className="text-text-secondary text-xs mt-1">{L.outOf}</span>
                  </div>

                  <div className="flex flex-col items-center gap-1">
                    <RashiIconById id={rashi2} size={40} />
                    <span className="text-text-primary text-sm font-medium">
                      {tl(RASHIS[rashi2 - 1].name, locale)}
                    </span>
                  </div>
                </div>

                {/* One liner */}
                <p className="text-gold-light text-sm text-center font-medium">
                  {mobileResult.oneLiner}
                </p>

                {/* Summary */}
                {mobileResult.summary && (
                  <p className="text-text-secondary text-sm leading-relaxed text-center">
                    {mobileResult.summary}
                  </p>
                )}

                {/* Link to detail page */}
                <Link
                  href={`/matching/${mobileResult.slug}`}
                  className="block w-full text-center bg-gold-primary/15 border border-gold-primary/30 text-gold-light rounded-lg py-3 font-medium hover:bg-gold-primary/25 transition-colors"
                >
                  {L.viewDetail}
                </Link>
              </motion.div>
            )}
          </motion.div>
        </div>

        <GoldDivider className="my-12" />

        {/* ─── Educational Content ───────────────────────────── */}
        <div className="max-w-3xl mx-auto space-y-10">
          {/* How to Use */}
          <section>
            <h2
              className="text-2xl font-bold text-gold-light mb-3"
              style={headingFont}
            >
              {L.howToUse}
            </h2>
            <p className="text-text-secondary leading-relaxed">
              {L.howToUseDesc}
            </p>
          </section>

          {/* About */}
          <section>
            <h2
              className="text-2xl font-bold text-gold-light mb-3"
              style={headingFont}
            >
              {L.aboutTitle}
            </h2>
            <p className="text-text-secondary leading-relaxed">
              {L.aboutDesc}
            </p>
          </section>

          {/* CTA */}
          <div className="bg-bg-secondary border border-gold-primary/20 rounded-xl p-6 text-center">
            <p className="text-text-secondary mb-4">
              {L.fullMatchingCta}
            </p>
            <Link
              href="/matching"
              className="inline-flex items-center gap-2 bg-gold-primary/15 border border-gold-primary/30 text-gold-light rounded-lg px-6 py-3 font-medium hover:bg-gold-primary/25 transition-colors"
            >
              <ArrowLeft size={16} />
              {L.backToMatching}
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
