'use client';

import { useLocale } from 'next-intl';
import { useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { Link } from '@/lib/i18n/navigation';
import { ArrowLeft, Heart, MessageCircle, Briefcase, AlertTriangle, Sparkles, Shield } from 'lucide-react';
import GoldDivider from '@/components/ui/GoldDivider';
import { getRashiBySlug } from '@/lib/constants/rashi-slugs';
import { getPairContent } from '@/lib/constants/rashi-compatibility';
import { RashiIconById } from '@/components/icons/RashiIcons';
import { tl } from '@/lib/utils/trilingual';
import { isDevanagariLocale } from '@/lib/utils/locale-fonts';

// ──────────────────────────────────────────────────────────────
// Labels
// ──────────────────────────────────────────────────────────────

const LABELS: Record<string, Record<string, string>> = {
  en: {
    backToChart: 'Compatibility Chart',
    outOf: 'out of 36',
    temperament: 'Temperament',
    communication: 'Communication',
    romance: 'Romance',
    career: 'Career Partnership',
    challenges: 'Challenges',
    remedies: 'Remedies',
    explore: 'Explore More',
    viewRashi: 'View {name} Details',
    fullMatching: 'Try Full Matching Tool',
    viewChart: 'View Full Compatibility Chart',
    notFound: 'Pair not found',
    notFoundDesc: 'The rashi pair you are looking for does not exist.',
  },
  hi: {
    backToChart: 'संगतता चार्ट',
    outOf: '36 में से',
    temperament: 'स्वभाव',
    communication: 'संवाद',
    romance: 'प्रेम',
    career: 'करियर साझेदारी',
    challenges: 'चुनौतियाँ',
    remedies: 'उपाय',
    explore: 'और देखें',
    viewRashi: '{name} विवरण देखें',
    fullMatching: 'पूर्ण मिलान टूल',
    viewChart: 'पूर्ण संगतता चार्ट',
    notFound: 'जोड़ी नहीं मिली',
    notFoundDesc: 'यह राशि जोड़ी मौजूद नहीं है।',
  },
  sa: {
    backToChart: 'संगततासारिणी',
    outOf: '36 मध्ये',
    temperament: 'स्वभावः',
    communication: 'संवादः',
    romance: 'प्रेमः',
    career: 'वृत्तिसाझेदारी',
    challenges: 'आव्हानानि',
    remedies: 'उपायाः',
    explore: 'अधिकम्',
    viewRashi: '{name} विवरणम्',
    fullMatching: 'पूर्णमिलानम्',
    viewChart: 'सम्पूर्णसारिणी',
    notFound: 'युग्मं न प्राप्तम्',
    notFoundDesc: 'इयं राशियुग्मं न विद्यते।',
  },
};

// ──────────────────────────────────────────────────────────────
// Score color helpers
// ──────────────────────────────────────────────────────────────

function scoreColor(score: number): string {
  if (score >= 25) return 'text-emerald-400';
  if (score >= 18) return 'text-gold-light';
  if (score >= 13) return 'text-amber-400';
  return 'text-red-400';
}

function scoreBorderColor(score: number): string {
  if (score >= 25) return 'border-emerald-500/40';
  if (score >= 18) return 'border-gold-primary/40';
  if (score >= 13) return 'border-amber-500/40';
  return 'border-red-500/40';
}

function scoreBarColor(score: number): string {
  if (score >= 25) return 'bg-emerald-500';
  if (score >= 18) return 'bg-gold-primary';
  if (score >= 13) return 'bg-amber-500';
  return 'bg-red-500';
}

function scoreBarBg(score: number): string {
  if (score >= 25) return 'bg-emerald-500/15';
  if (score >= 18) return 'bg-gold-primary/15';
  if (score >= 13) return 'bg-amber-500/15';
  return 'bg-red-500/15';
}

function scoreVerdict(score: number, locale: string): string {
  if (isDevanagariLocale(locale)) {
    if (score >= 25) return 'उत्कृष्ट';
    if (score >= 18) return 'अच्छा';
    if (score >= 13) return 'औसत';
    return 'कठिन';
  }
  if (score >= 25) return 'Excellent';
  if (score >= 18) return 'Good';
  if (score >= 13) return 'Average';
  return 'Challenging';
}

// ──────────────────────────────────────────────────────────────
// Content section data
// ──────────────────────────────────────────────────────────────

const SECTIONS = [
  { key: 'temperament', icon: Heart },
  { key: 'communication', icon: MessageCircle },
  { key: 'romance', icon: Sparkles },
  { key: 'career', icon: Briefcase },
  { key: 'challenges', icon: AlertTriangle },
  { key: 'remedies', icon: Shield },
] as const;

// ──────────────────────────────────────────────────────────────
// Page Component
// ──────────────────────────────────────────────────────────────

export default function PairDetailPage() {
  const locale = useLocale();
  const { pair } = useParams<{ pair: string }>();
  const isDevanagari = isDevanagariLocale(locale);
  const headingFont = isDevanagari
    ? { fontFamily: 'var(--font-devanagari-heading)' }
    : { fontFamily: 'var(--font-heading)' };
  const lbl = LABELS[locale] || LABELS.en;

  // Parse pair slug
  const parts = (pair || '').split('-and-');
  const r1 = parts.length === 2 ? getRashiBySlug(parts[0]) : undefined;
  const r2 = parts.length === 2 ? getRashiBySlug(parts[1]) : undefined;

  if (!r1 || !r2) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-24 text-center">
        <h1 className="text-2xl font-bold text-gold-light mb-4" style={headingFont}>{lbl.notFound}</h1>
        <p className="text-text-secondary mb-8">{lbl.notFoundDesc}</p>
        <Link href="/matching/compatibility" className="text-gold-primary hover:text-gold-light underline underline-offset-4">
          {lbl.backToChart}
        </Link>
      </div>
    );
  }

  const pairContent = getPairContent(r1.id, r2.id);
  if (!pairContent) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-24 text-center">
        <h1 className="text-2xl font-bold text-gold-light mb-4" style={headingFont}>{lbl.notFound}</h1>
        <p className="text-text-secondary mb-8">{lbl.notFoundDesc}</p>
        <Link href="/matching/compatibility" className="text-gold-primary hover:text-gold-light underline underline-offset-4">
          {lbl.backToChart}
        </Link>
      </div>
    );
  }

  const name1 = tl(r1.name, locale);
  const name2 = tl(r2.name, locale);
  const { score } = pairContent;
  const pct = Math.round((score / 36) * 100);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Back link */}
      <motion.div
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3, ease: 'easeOut' as const }}
      >
        <Link
          href="/matching/compatibility"
          className="inline-flex items-center gap-2 text-gold-primary hover:text-gold-light text-sm mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          {lbl.backToChart}
        </Link>
      </motion.div>

      {/* Hero */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' as const }}
        className="text-center mb-12"
      >
        {/* Rashi icons */}
        <div className="flex items-center justify-center gap-6 sm:gap-10 mb-6">
          <div className="flex flex-col items-center gap-2">
            <RashiIconById id={r1.id} size={64} />
            <span className="text-text-secondary text-sm">{name1}</span>
          </div>
          <div className="text-gold-dark text-3xl font-light">&</div>
          <div className="flex flex-col items-center gap-2">
            <RashiIconById id={r2.id} size={64} />
            <span className="text-text-secondary text-sm">{name2}</span>
          </div>
        </div>

        {/* Title */}
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6" style={headingFont}>
          <span className="text-gold-gradient">{name1}</span>
          <span className="text-text-secondary mx-2">&</span>
          <span className="text-gold-gradient">{name2}</span>
        </h1>

        {/* Score badge */}
        <div className="inline-flex flex-col items-center gap-1">
          <div className={`text-5xl sm:text-6xl font-bold ${scoreColor(score)}`}>
            {score}
          </div>
          <div className="text-text-secondary text-sm">{lbl.outOf}</div>
          <div className={`text-sm font-semibold mt-1 px-3 py-1 rounded-full border ${scoreBorderColor(score)} ${scoreBarBg(score)} ${scoreColor(score)}`}>
            {scoreVerdict(score, locale)}
          </div>
        </div>
      </motion.div>

      {/* Score bar */}
      <motion.div
        initial={{ opacity: 0, scaleX: 0 }}
        animate={{ opacity: 1, scaleX: 1 }}
        transition={{ duration: 0.6, delay: 0.2, ease: 'easeOut' as const }}
        className="mb-12"
        style={{ transformOrigin: 'left' }}
      >
        <div className={`w-full h-3 rounded-full ${scoreBarBg(score)}`}>
          <div
            className={`h-full rounded-full ${scoreBarColor(score)} transition-all`}
            style={{ width: `${pct}%` }}
          />
        </div>
        <div className="flex justify-between text-xs text-text-secondary mt-1">
          <span>0</span>
          <span>36</span>
        </div>
      </motion.div>

      {/* Summary */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.3, ease: 'easeOut' as const }}
        className="mb-12"
      >
        <p className="text-text-primary text-lg leading-relaxed text-center max-w-3xl mx-auto">
          {(pairContent.summary as Record<string, string>)[locale] || pairContent.summary.en}
        </p>
      </motion.div>

      <GoldDivider className="mb-12" />

      {/* Content sections */}
      <div className="space-y-6">
        {SECTIONS.map(({ key, icon: Icon }, idx) => {
          const text = (pairContent[key] as Record<string, string>)[locale] || (pairContent[key] as Record<string, string>).en;
          return (
            <motion.div
              key={key}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.35 + idx * 0.08, ease: 'easeOut' as const }}
              className="bg-bg-secondary border border-gold-primary/10 rounded-2xl p-5 sm:p-6"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="w-8 h-8 rounded-lg bg-gold-primary/10 flex items-center justify-center">
                  <Icon className="w-4 h-4 text-gold-primary" />
                </div>
                <h2 className="text-lg font-bold text-gold-light" style={headingFont}>
                  {lbl[key]}
                </h2>
              </div>
              <p className="text-text-primary leading-relaxed">{text}</p>
            </motion.div>
          );
        })}
      </div>

      <GoldDivider className="my-12" />

      {/* Explore More */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.9, ease: 'easeOut' as const }}
      >
        <h2 className="text-2xl font-bold text-gold-light text-center mb-8" style={headingFont}>
          {lbl.explore}
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Rashi 1 detail */}
          <Link
            href={`/panchang/rashi/${r1.slug}`}
            className="flex items-center gap-3 p-4 rounded-xl border border-gold-primary/15 bg-bg-secondary hover:bg-gold-primary/5 transition-colors group"
          >
            <RashiIconById id={r1.id} size={32} />
            <span className="text-text-primary group-hover:text-gold-light transition-colors">
              {lbl.viewRashi.replace('{name}', name1)}
            </span>
          </Link>

          {/* Rashi 2 detail */}
          <Link
            href={`/panchang/rashi/${r2.slug}`}
            className="flex items-center gap-3 p-4 rounded-xl border border-gold-primary/15 bg-bg-secondary hover:bg-gold-primary/5 transition-colors group"
          >
            <RashiIconById id={r2.id} size={32} />
            <span className="text-text-primary group-hover:text-gold-light transition-colors">
              {lbl.viewRashi.replace('{name}', name2)}
            </span>
          </Link>

          {/* Full matching tool */}
          <Link
            href="/matching"
            className="flex items-center gap-3 p-4 rounded-xl border border-gold-primary/15 bg-bg-secondary hover:bg-gold-primary/5 transition-colors group"
          >
            <Heart className="w-6 h-6 text-gold-primary" />
            <span className="text-text-primary group-hover:text-gold-light transition-colors">
              {lbl.fullMatching}
            </span>
          </Link>

          {/* Heatmap */}
          <Link
            href="/matching/compatibility"
            className="flex items-center gap-3 p-4 rounded-xl border border-gold-primary/15 bg-bg-secondary hover:bg-gold-primary/5 transition-colors group"
          >
            <Sparkles className="w-6 h-6 text-gold-primary" />
            <span className="text-text-primary group-hover:text-gold-light transition-colors">
              {lbl.viewChart}
            </span>
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
