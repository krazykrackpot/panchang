'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, AlertTriangle, Sparkles, ArrowRightLeft, Clock, Shield, Heart, Briefcase, Coins, Activity, Star, Users } from 'lucide-react';
import type { ConvergenceResult, PatternTheme, Tone, FlagIcon, TemporalFrame, ExecutiveInsight } from '@/lib/tippanni/convergence/types';
import type { Locale } from '@/types/panchang';

// ─── Labels ─────────────────────────────────────────────────────────────────

const LABELS = {
  title: { en: 'Your Chart Synthesis', hi: 'आपका कुंडली संश्लेषण', sa: 'भवदीय कुण्डली संश्लेषणम्' },
  insights: { en: 'insights', hi: 'अंतर्दृष्टि', sa: 'अन्तर्दृष्टयः' },
  quiet: {
    en: 'No major convergence patterns active — consolidation period',
    hi: 'कोई प्रमुख अभिसरण प्रतिरूप सक्रिय नहीं — समेकन काल',
    sa: 'न कोऽपि प्रमुख अभिसरण प्रतिरूपः सक्रियः — समेकनकालः',
  },
  advice: { en: 'Advice', hi: 'सलाह', sa: 'उपदेशः' },
  simpleExplanation: { en: 'In Simple Terms', hi: 'सरल शब्दों में', sa: 'सरलभाषया' },
  timeframe: { en: 'Timeframe', hi: 'समय सीमा', sa: 'कालावधिः' },
  matchStrength: { en: 'Match Strength', hi: 'मिलान शक्ति', sa: 'सामञ्जस्य बलम्' },
};

const TONE_LABELS: Record<Tone, { en: string; hi: string; sa: string }> = {
  growth: { en: 'Growth', hi: 'विकास', sa: 'वृद्धिः' },
  pressure: { en: 'Pressure', hi: 'दबाव', sa: 'पीडनम्' },
  transformation: { en: 'Transformation', hi: 'परिवर्तन', sa: 'रूपान्तरणम्' },
  quiet: { en: 'Quiet', hi: 'शांत', sa: 'शान्तम्' },
  mixed: { en: 'Mixed', hi: 'मिश्रित', sa: 'मिश्रम्' },
};

const TEMPORAL_LABELS: Record<TemporalFrame, { en: string; hi: string; sa: string }> = {
  lifetime: { en: 'Lifetime', hi: 'जीवनकाल', sa: 'आजीवनम्' },
  'multi-year': { en: 'Multi-Year', hi: 'बहु-वर्षीय', sa: 'बहुवार्षिकम्' },
  'this-year': { en: 'This Year', hi: 'इस वर्ष', sa: 'अस्मिन् वर्षे' },
  'this-month': { en: 'This Month', hi: 'इस माह', sa: 'अस्मिन् मासे' },
};

const THEME_LABELS: Record<PatternTheme, { en: string; hi: string; sa: string }> = {
  career: { en: 'Career', hi: 'करियर', sa: 'वृत्तिः' },
  relationship: { en: 'Relationship', hi: 'सम्बन्ध', sa: 'सम्बन्धः' },
  wealth: { en: 'Wealth', hi: 'धन', sa: 'धनम्' },
  health: { en: 'Health', hi: 'स्वास्थ्य', sa: 'स्वास्थ्यम्' },
  spiritual: { en: 'Spiritual', hi: 'आध्यात्मिक', sa: 'आध्यात्मिकम्' },
  family: { en: 'Family', hi: 'परिवार', sa: 'कुटुम्बम्' },
};

// ─── Color maps ─────────────────────────────────────────────────────────────

const TONE_COLORS: Record<Tone, { border: string; text: string; bg: string; stroke: string }> = {
  growth: { border: 'border-emerald-500/50', text: 'text-emerald-400', bg: 'bg-emerald-500/15', stroke: '#34d399' },
  pressure: { border: 'border-red-500/50', text: 'text-red-400', bg: 'bg-red-500/15', stroke: '#f87171' },
  transformation: { border: 'border-amber-500/50', text: 'text-amber-400', bg: 'bg-amber-500/15', stroke: '#fbbf24' },
  quiet: { border: 'border-emerald-500/50', text: 'text-emerald-400', bg: 'bg-emerald-500/15', stroke: '#34d399' },
  mixed: { border: 'border-amber-500/50', text: 'text-amber-400', bg: 'bg-amber-500/15', stroke: '#fbbf24' },
};

const THEME_BORDERS: Record<PatternTheme, string> = {
  career: 'border-l-violet-500/60',
  relationship: 'border-l-pink-500/60',
  wealth: 'border-l-amber-400/60',
  health: 'border-l-blue-500/60',
  spiritual: 'border-l-indigo-500/60',
  family: 'border-l-orange-500/60',
};

const THEME_ICONS: Record<PatternTheme, typeof Briefcase> = {
  career: Briefcase,
  relationship: Heart,
  wealth: Coins,
  health: Activity,
  spiritual: Star,
  family: Users,
};

const FLAG_ICONS: Record<FlagIcon, typeof AlertTriangle> = {
  warning: AlertTriangle,
  opportunity: Sparkles,
  transition: ArrowRightLeft,
};

const FLAG_COLORS: Record<FlagIcon, string> = {
  warning: 'bg-red-500/20 text-red-400 border-red-500/30',
  opportunity: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
  transition: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
};

// ─── Helper ─────────────────────────────────────────────────────────────────

function pickText(obj: { en: string; hi: string } | undefined, locale: Locale): string {
  if (!obj) return '';
  const key = (locale === 'hi' || locale === 'sa') ? 'hi' as const : 'en' as const;
  return obj[key as 'en' | 'hi'] || obj.en;
}

function pickLabel(obj: { en: string; hi: string; sa: string }, locale: Locale): string {
  return obj[locale] || obj.en;
}

// ─── Activation Gauge ───────────────────────────────────────────────────────

function ActivationGauge({ activation, toneStroke }: { activation: number; toneStroke: string }) {
  const circumference = 2 * Math.PI * 28; // ~175.93
  const dashLen = (activation / 10) * circumference;
  return (
    <svg width={64} height={64} viewBox="0 0 64 64" className="shrink-0">
      <circle cx="32" cy="32" r="28" fill="none" stroke="rgba(212,168,83,0.1)" strokeWidth="4" />
      <motion.circle
        cx="32" cy="32" r="28" fill="none"
        stroke={toneStroke} strokeWidth="4"
        strokeDasharray={`${dashLen} ${circumference}`}
        strokeLinecap="round"
        transform="rotate(-90 32 32)"
        initial={{ strokeDasharray: `0 ${circumference}` }}
        animate={{ strokeDasharray: `${dashLen} ${circumference}` }}
        transition={{ duration: 1.2, ease: 'easeOut' as const }}
      />
      <text x="32" y="30" textAnchor="middle" fill="#f0d48a" fontSize="16" fontWeight="bold">
        {activation}
      </text>
      <text x="32" y="42" textAnchor="middle" fill="#9b97a0" fontSize="8">
        ACTIVE
      </text>
    </svg>
  );
}

// ─── Insight Card ───────────────────────────────────────────────────────────

function InsightCard({ insight, locale, headingFont, isExpanded, onToggle }: {
  insight: ExecutiveInsight;
  locale: Locale;
  headingFont: React.CSSProperties;
  isExpanded: boolean;
  onToggle: () => void;
}) {
  const theme = insight.themeIcon;
  const Icon = THEME_ICONS[theme] || Star;
  const borderClass = THEME_BORDERS[theme] || 'border-l-gold-primary/40';

  return (
    <motion.div
      layout
      className={`rounded-lg bg-gradient-to-br from-[#1a1040]/60 to-[#0a0e27]/80 border border-gold-primary/8 border-l-4 ${borderClass} overflow-hidden cursor-pointer`}
      onClick={onToggle}
      whileHover={{ scale: 1.01 }}
      transition={{ duration: 0.2 }}
    >
      <div className="p-4">
        <div className="flex items-start gap-3">
          <Icon className="w-4 h-4 text-gold-light mt-0.5 shrink-0" />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <span className="text-xs font-medium text-amber-400 uppercase tracking-wider">
                {pickLabel(THEME_LABELS[theme] || THEME_LABELS.career, locale)}
              </span>
              <span className="text-xs text-text-tertiary flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {pickLabel(TEMPORAL_LABELS[insight.temporalFrame] || TEMPORAL_LABELS['this-year'], locale)}
              </span>
              <span className="text-xs text-text-tertiary">
                {insight.matchCount}
              </span>
            </div>
            <p className="text-sm text-text-primary leading-relaxed" style={headingFont}>
              {pickText(insight.summary, locale)}
            </p>
          </div>
          <motion.div
            animate={{ rotate: isExpanded ? 180 : 0 }}
            transition={{ duration: 0.2 }}
            className="shrink-0"
          >
            <ChevronDown className="w-4 h-4 text-gold-primary/50" />
          </motion.div>
        </div>
      </div>

      <AnimatePresence initial={false}>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' as const }}
          >
            <div className="px-4 pb-4 pt-0 space-y-3 border-t border-gold-primary/8">
              {/* Layperson note */}
              {insight.laypersonNote && pickText(insight.laypersonNote, locale) && (
                <div className="mt-3 p-3 bg-gold-primary/5 rounded-lg">
                  <p className="text-xs text-gold-dark uppercase tracking-wider mb-1 font-semibold">
                    {pickLabel(LABELS.simpleExplanation, locale)}
                  </p>
                  <p className="text-sm text-text-secondary leading-relaxed">
                    {pickText(insight.laypersonNote, locale)}
                  </p>
                </div>
              )}
              {/* Expanded detail */}
              {insight.expandedDetail && pickText(insight.expandedDetail, locale) && (
                <p className="text-sm text-text-secondary leading-relaxed">
                  {pickText(insight.expandedDetail, locale)}
                </p>
              )}
              {/* Advice */}
              {insight.advice && pickText(insight.advice, locale) && (
                <div className="p-3 bg-emerald-500/5 rounded-lg border border-emerald-500/10">
                  <p className="text-xs text-emerald-400 uppercase tracking-wider mb-1 font-semibold">
                    {pickLabel(LABELS.advice, locale)}
                  </p>
                  <p className="text-sm text-text-secondary leading-relaxed">
                    {pickText(insight.advice, locale)}
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// ─── Main Component ─────────────────────────────────────────────────────────

interface Props {
  convergence: ConvergenceResult;
  locale: Locale;
  headingFont: React.CSSProperties;
}

export default function ConvergenceSummary({ convergence, locale, headingFont }: Props) {
  const [expandedInsight, setExpandedInsight] = useState<number | null>(null);

  const { executive } = convergence;
  const { activation, tone, insights, urgentFlags, metaInsights } = executive;
  const toneStyle = TONE_COLORS[tone] || TONE_COLORS.quiet;

  // ─── Quiet state: no patterns ─────────────────────────────────────────
  if (!insights || insights.length === 0) {
    return (
      <motion.section
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="rounded-xl border-2 border-emerald-500/30 bg-gradient-to-br from-[#1a2a1a]/40 via-[#0f1a20]/50 to-[#0a0e27] p-6 sm:p-8"
      >
        <div className="flex items-center gap-3 justify-center">
          <Shield className="w-5 h-5 text-emerald-400" />
          <p className="text-emerald-300 text-sm font-medium" style={headingFont}>
            {pickLabel(LABELS.quiet, locale)}
          </p>
        </div>
      </motion.section>
    );
  }

  // ─── Active state ─────────────────────────────────────────────────────
  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className={`rounded-xl border-2 ${toneStyle.border} bg-gradient-to-br from-[#2d1b69]/50 via-[#1a1040]/60 to-[#0a0e27] p-6 sm:p-8 shadow-lg shadow-black/20`}
    >
      {/* ─── Header row ────────────────────────────────────────────────── */}
      <div className="flex items-center gap-3 sm:gap-5 mb-6">
        <ActivationGauge activation={activation} toneStroke={toneStyle.stroke} />
        <div className="flex-1 min-w-0">
          <h3 className="text-xl sm:text-2xl font-bold text-gold-gradient" style={headingFont}>
            {pickLabel(LABELS.title, locale)}
          </h3>
          <div className="flex items-center gap-3 mt-2 flex-wrap">
            {/* Tone badge */}
            <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${toneStyle.bg} ${toneStyle.text}`}>
              {pickLabel(TONE_LABELS[tone], locale)}
            </span>
            {/* Insight count */}
            <span className="text-xs text-text-tertiary">
              {insights.length} {pickLabel(LABELS.insights, locale)}
            </span>
          </div>
        </div>
      </div>

      {/* ─── Urgent flags ──────────────────────────────────────────────── */}
      {urgentFlags && urgentFlags.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-6">
          {urgentFlags.map((flag, i) => {
            const FIcon = FLAG_ICONS[flag.icon] || AlertTriangle;
            const flagColor = FLAG_COLORS[flag.icon] || FLAG_COLORS.warning;
            return (
              <motion.span
                key={i}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 + i * 0.1 }}
                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border ${flagColor}`}
              >
                <FIcon className="w-3 h-3 animate-pulse" />
                {pickText(flag.message, locale)}
              </motion.span>
            );
          })}
        </div>
      )}

      {/* ─── Meta insights ─────────────────────────────────────────────── */}
      {metaInsights && metaInsights.length > 0 && (
        <div className="space-y-2 mb-6">
          {metaInsights.map((meta, i) => (
            <div key={i} className="flex items-start gap-2 p-3 rounded-lg bg-amber-500/5 border border-amber-500/10">
              <Sparkles className="w-3.5 h-3.5 text-amber-400 mt-0.5 shrink-0" />
              <p className="text-sm text-amber-200/80 leading-relaxed">
                {pickText(meta.text, locale)}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* ─── Insight cards grid ────────────────────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {insights.map((insight, i) => (
          <InsightCard
            key={i}
            insight={insight}
            locale={locale}
            headingFont={headingFont}
            isExpanded={expandedInsight === i}
            onToggle={() => setExpandedInsight(expandedInsight === i ? null : i)}
          />
        ))}
      </div>
    </motion.section>
  );
}
