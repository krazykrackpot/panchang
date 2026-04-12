'use client';

import { useState, useEffect } from 'react';
import { useLocale } from 'next-intl';
import { useParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from '@/lib/i18n/navigation';
import GoldDivider from '@/components/ui/GoldDivider';
import { RASHIS } from '@/lib/constants/rashis';
import { RASHI_DETAILS } from '@/lib/constants/rashi-details';
import { NAKSHATRAS } from '@/lib/constants/nakshatras';
import { RashiIconById } from '@/components/icons/RashiIcons';
import { generateBreadcrumbLD } from '@/lib/seo/structured-data';
import type { Locale } from '@/types/panchang';
import type { DailyHoroscope } from '@/lib/horoscope/daily-engine';
import {
  ArrowLeft, ArrowRight, Star, Briefcase, Heart, Activity,
  Gem, Hash, Palette, ChevronDown, ChevronUp, Sun, Sparkles,
  DollarSign, Flame,
} from 'lucide-react';

/* ─── Element color maps ─────────────────────────────────────────── */

const ELEMENT_HEX: Record<string, string> = {
  Fire: '#fb923c', Earth: '#4ade80', Air: '#22d3ee', Water: '#60a5fa',
};
const ELEMENT_BG: Record<string, string> = {
  Fire: 'bg-orange-500/10', Earth: 'bg-emerald-500/10', Air: 'bg-cyan-500/10', Water: 'bg-blue-500/10',
};
const ELEMENT_TEXT: Record<string, string> = {
  Fire: 'text-orange-400', Earth: 'text-emerald-400', Air: 'text-cyan-400', Water: 'text-blue-400',
};
const ELEMENT_BORDER: Record<string, string> = {
  Fire: 'border-orange-500/20', Earth: 'border-emerald-500/20', Air: 'border-cyan-500/20', Water: 'border-blue-500/20',
};

/* ─── Horoscope area icons ───────────────────────────────────────── */

const AREA_ICONS: Record<string, React.ReactNode> = {
  career: <Briefcase className="w-4 h-4" />,
  love: <Heart className="w-4 h-4" />,
  health: <Activity className="w-4 h-4" />,
  finance: <DollarSign className="w-4 h-4" />,
  spirituality: <Sparkles className="w-4 h-4" />,
};

const AREA_LABELS: Record<string, Record<string, string>> = {
  career: { en: 'Career', hi: 'करियर', sa: 'वृत्तिः' },
  love: { en: 'Love', hi: 'प्रेम', sa: 'प्रेमः' },
  health: { en: 'Health', hi: 'स्वास्थ्य', sa: 'स्वास्थ्यम्' },
  finance: { en: 'Finance', hi: 'वित्त', sa: 'वित्तम्' },
  spirituality: { en: 'Spirituality', hi: 'आध्यात्मिकता', sa: 'आध्यात्मिकता' },
};

/* ─── Labels ─────────────────────────────────────────────────────── */

const LABELS = {
  backToRashis: { en: 'All Rashis', hi: 'सभी राशियाँ', sa: 'सर्वाः राशयः' },
  notFound: { en: 'Rashi not found.', hi: 'राशि नहीं मिली।', sa: 'राशिः न प्राप्ता।' },
  of12: { en: 'of 12', hi: '12 में से', sa: '१२ मध्ये' },
  degrees: { en: 'Degrees', hi: 'अंश', sa: 'अंशाः' },
  element: { en: 'Element', hi: 'तत्व', sa: 'तत्त्वम्' },
  ruler: { en: 'Ruler', hi: 'स्वामी', sa: 'स्वामी' },
  quality: { en: 'Modality', hi: 'गुण', sa: 'गुणः' },
  luckyNumbers: { en: 'Lucky Numbers', hi: 'शुभ अंक', sa: 'शुभाङ्काः' },
  luckyColors: { en: 'Lucky Colors', hi: 'शुभ रंग', sa: 'शुभवर्णाः' },
  luckyGems: { en: 'Lucky Gems', hi: 'शुभ रत्न', sa: 'शुभरत्नानि' },
  personality: { en: 'Personality & Traits', hi: 'व्यक्तित्व एवं लक्षण', sa: 'व्यक्तित्वं लक्षणानि च' },
  strengths: { en: 'Strengths', hi: 'शक्तियाँ', sa: 'शक्तयः' },
  challenges: { en: 'Challenges', hi: 'चुनौतियाँ', sa: 'आह्वानानि' },
  career: { en: 'Career & Profession', hi: 'करियर एवं व्यवसाय', sa: 'वृत्तिः व्यवसायश्च' },
  health: { en: 'Health & Wellness', hi: 'स्वास्थ्य एवं कल्याण', sa: 'स्वास्थ्यं कल्याणं च' },
  relationships: { en: 'Relationships & Love', hi: 'रिश्ते एवं प्रेम', sa: 'सम्बन्धाः प्रेमश्च' },
  todayFor: { en: 'Today for', hi: 'आज का दिन', sa: 'अद्य' },
  overallScore: { en: 'Overall Score', hi: 'कुल अंक', sa: 'समग्राङ्कः' },
  luckyColor: { en: 'Lucky Color', hi: 'शुभ रंग', sa: 'शुभवर्णः' },
  luckyNumber: { en: 'Lucky Number', hi: 'शुभ अंक', sa: 'शुभाङ्कः' },
  luckyTime: { en: 'Lucky Time', hi: 'शुभ समय', sa: 'शुभसमयः' },
  insight: { en: 'Insight', hi: 'अन्तर्दृष्टि', sa: 'अन्तर्दृष्टिः' },
  loading: { en: 'Computing horoscope...', hi: 'राशिफल गणना हो रही है...', sa: 'राशिफलगणना प्रचलति...' },
  compatible: { en: 'Compatible Signs', hi: 'अनुकूल राशियाँ', sa: 'अनुकूलराशयः' },
  relatedNakshatras: { en: 'Nakshatras in this Rashi', hi: 'इस राशि के नक्षत्र', sa: 'अस्यां राश्यां नक्षत्राणि' },
  faq: { en: 'Frequently Asked Questions', hi: 'अक्सर पूछे जाने वाले प्रश्न', sa: 'बहुधा पृच्छ्यमानाः प्रश्नाः' },
  previous: { en: 'Previous', hi: 'पिछली', sa: 'पूर्वा' },
  next: { en: 'Next', hi: 'अगली', sa: 'अग्रिमा' },
} as const;

function tl(obj: Record<string, string> | undefined, locale: string): string {
  if (!obj) return '';
  return obj[locale] || obj.en || '';
}

/* ─── Score bar component ────────────────────────────────────────── */

function ScoreBar({ score, max = 10 }: { score: number; max?: number }) {
  const pct = Math.min(100, (score / max) * 100);
  const color = score >= 7 ? 'bg-emerald-500' : score >= 4 ? 'bg-amber-500' : 'bg-red-500';
  return (
    <div className="flex items-center gap-2 flex-1">
      <div className="h-2 flex-1 bg-bg-primary/60 rounded-full overflow-hidden">
        <motion.div
          className={`h-full rounded-full ${color}`}
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.6, ease: 'easeOut' as const }}
        />
      </div>
      <span className="text-xs text-text-secondary font-mono w-6 text-right">{score}/{max}</span>
    </div>
  );
}

/* ─── FAQ Accordion Item ─────────────────────────────────────────── */

function FAQItem({ question, answer, locale, index }: { question: Record<string, string>; answer: Record<string, string>; locale: string; index: number }) {
  const [open, setOpen] = useState(false);
  const isDevanagari = locale === 'hi' || locale === 'sa';
  return (
    <motion.div
      className="border border-gold-primary/10 rounded-lg overflow-hidden"
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.05, duration: 0.3 }}
    >
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between p-4 text-left hover:bg-gold-primary/5 transition-colors"
      >
        <span
          className="text-gold-light font-medium text-sm sm:text-base pr-4"
          style={isDevanagari ? { fontFamily: 'var(--font-devanagari-heading)' } : undefined}
        >
          {tl(question, locale)}
        </span>
        {open ? <ChevronUp className="w-4 h-4 text-gold-dark flex-shrink-0" /> : <ChevronDown className="w-4 h-4 text-gold-dark flex-shrink-0" />}
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            <div
              className="px-4 pb-4 text-text-secondary text-sm leading-relaxed"
              style={isDevanagari ? { fontFamily: 'var(--font-devanagari-body)' } : undefined}
            >
              {tl(answer, locale)}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════════════════════════ */
/*  Main Page Component                                               */
/* ═══════════════════════════════════════════════════════════════════ */

export default function RashiDetailPage() {
  const params = useParams();
  const locale = useLocale() as Locale;
  const isDevanagari = locale === 'hi' || String(locale) === 'sa';
  const headingFont = isDevanagari
    ? { fontFamily: 'var(--font-devanagari-heading)' }
    : { fontFamily: 'var(--font-heading)' };
  const bodyFont = isDevanagari
    ? { fontFamily: 'var(--font-devanagari-body)' }
    : undefined;

  const slug = params.id as string;

  // Find rashi by slug
  const rashi = RASHIS.find(r => r.slug === slug);
  const detail = rashi ? RASHI_DETAILS.find(d => d.id === rashi.id) : undefined;

  // Dynamic horoscope
  const [horoscope, setHoroscope] = useState<DailyHoroscope | null>(null);

  useEffect(() => {
    if (!rashi) return;
    import('@/lib/horoscope/daily-engine').then(({ generateDailyHoroscope }) => {
      const today = new Date();
      const dateStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
      setHoroscope(generateDailyHoroscope({ moonSign: rashi.id, date: dateStr }));
    });
  }, [rashi]);

  // ─── Not found ────────────────────────────────────────────────
  if (!rashi || !detail) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <p className="text-text-secondary text-lg">{tl(LABELS.notFound, locale)}</p>
        <Link href="/panchang/rashi" className="text-gold-primary hover:text-gold-light mt-4 inline-block">
          &larr; {tl(LABELS.backToRashis, locale)}
        </Link>
      </div>
    );
  }

  // ─── Derived data ─────────────────────────────────────────────
  const prevId = rashi.id > 1 ? rashi.id - 1 : 12;
  const nextId = rashi.id < 12 ? rashi.id + 1 : 1;
  const prevRashi = RASHIS[prevId - 1];
  const nextRashi = RASHIS[nextId - 1];

  const elemColor = ELEMENT_HEX[rashi.element.en] || '#f0d48a';
  const elemText = ELEMENT_TEXT[rashi.element.en] || 'text-gold-primary';
  const elemBg = ELEMENT_BG[rashi.element.en] || 'bg-gold-primary/10';
  const elemBorder = ELEMENT_BORDER[rashi.element.en] || 'border-gold-primary/20';

  // Nakshatras in this rashi's degree range
  const relatedNakshatras = NAKSHATRAS.filter(n => {
    // A nakshatra overlaps this rashi if its range overlaps [startDeg, endDeg)
    return n.startDeg < rashi.endDeg && n.endDeg > rashi.startDeg;
  });

  // Compatible rashis
  const compatRashis = detail.compatibleRashis.map(id => RASHIS[id - 1]).filter(Boolean);

  // Breadcrumb JSON-LD
  const breadcrumbLD = generateBreadcrumbLD(`/${locale}/panchang/rashi/${slug}`, locale);

  // FAQ JSON-LD
  const faqLD = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: detail.faqs.map(faq => ({
      '@type': 'Question',
      name: tl(faq.question, 'en'),
      acceptedAnswer: {
        '@type': 'Answer',
        text: tl(faq.answer, 'en'),
      },
    })),
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLD) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLD) }}
      />

      {/* ── Back navigation ──────────────────────────────────────── */}
      <Link
        href="/panchang/rashi"
        className="inline-flex items-center gap-2 text-gold-primary hover:text-gold-light mb-8 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> {tl(LABELS.backToRashis, locale)}
      </Link>

      {/* ══════════════════════════════════════════════════════════ */}
      {/* 1. HERO SECTION                                           */}
      {/* ══════════════════════════════════════════════════════════ */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border-2 border-gold-primary/20 rounded-2xl p-8 sm:p-10 mb-10"
      >
        <div className="flex flex-col sm:flex-row items-center gap-8">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, type: 'spring' }}
            className="flex-shrink-0"
          >
            <RashiIconById id={rashi.id} size={120} />
          </motion.div>
          <div className="text-center sm:text-left flex-1">
            <div className="text-gold-dark text-sm font-mono mb-2">
              #{rashi.id} {tl(LABELS.of12, locale)} &middot; {rashi.startDeg}&deg; &mdash; {rashi.endDeg}&deg;
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold mb-3" style={headingFont}>
              <span className="text-gold-gradient">{rashi.name[locale] || rashi.name.en}</span>
            </h1>
            {locale === 'en' && (
              <p className="text-gold-dark text-lg mb-2" style={{ fontFamily: 'var(--font-devanagari-heading)' }}>
                {rashi.name.sa}
              </p>
            )}
            <div className="flex flex-wrap justify-center sm:justify-start gap-2 mt-3">
              <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${elemBg} ${elemText} border ${elemBorder}`}>
                <Flame className="w-3 h-3" />
                {rashi.element[locale] || rashi.element.en}
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-gold-primary/10 text-gold-light border border-gold-primary/20">
                <Sun className="w-3 h-3" />
                {rashi.rulerName[locale] || rashi.rulerName.en}
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-purple-500/10 text-purple-300 border border-purple-500/20">
                <Star className="w-3 h-3" />
                {rashi.quality[locale] || rashi.quality.en}
              </span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* ══════════════════════════════════════════════════════════ */}
      {/* 2. QUICK INFO GRID                                        */}
      {/* ══════════════════════════════════════════════════════════ */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 mb-10">
        {[
          { icon: <Star className="w-4 h-4 text-gold-primary" />, label: tl(LABELS.ruler, locale), value: rashi.rulerName[locale] || rashi.rulerName.en },
          { icon: <Flame className="w-4 h-4" style={{ color: elemColor }} />, label: tl(LABELS.element, locale), value: rashi.element[locale] || rashi.element.en },
          { icon: <Sparkles className="w-4 h-4 text-purple-400" />, label: tl(LABELS.quality, locale), value: rashi.quality[locale] || rashi.quality.en },
          { icon: <Hash className="w-4 h-4 text-gold-dark" />, label: tl(LABELS.degrees, locale), value: `${rashi.startDeg}\u00B0 \u2013 ${rashi.endDeg}\u00B0` },
          { icon: <Hash className="w-4 h-4 text-emerald-400" />, label: tl(LABELS.luckyNumbers, locale), value: detail.luckyNumbers.join(', ') },
          { icon: <Palette className="w-4 h-4 text-pink-400" />, label: tl(LABELS.luckyColors, locale), value: tl(detail.luckyColors, locale) },
          { icon: <Gem className="w-4 h-4 text-cyan-400" />, label: tl(LABELS.luckyGems, locale), value: tl(detail.luckyGems, locale) },
          { icon: <Star className="w-4 h-4 text-amber-400" />, label: tl(LABELS.of12, locale), value: `#${rashi.id}` },
        ].map((item, idx) => (
          <motion.div
            key={idx}
            className="bg-bg-secondary/60 border border-gold-primary/8 rounded-lg p-4"
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: idx * 0.04, duration: 0.3 }}
          >
            <div className="flex items-center gap-2 mb-1.5">
              {item.icon}
              <span className="text-gold-dark text-xs" style={bodyFont}>{item.label}</span>
            </div>
            <div className="text-gold-light font-semibold text-sm" style={bodyFont}>
              {item.value}
            </div>
          </motion.div>
        ))}
      </div>

      <GoldDivider />

      {/* ══════════════════════════════════════════════════════════ */}
      {/* 3. PERSONALITY & TRAITS                                   */}
      {/* ══════════════════════════════════════════════════════════ */}
      <section className="my-12">
        <h2 className="text-2xl font-bold text-gold-gradient mb-6" style={headingFont}>
          {tl(LABELS.personality, locale)}
        </h2>
        <motion.div
          className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-6 sm:p-8"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <p className="text-text-primary text-base leading-relaxed mb-6" style={bodyFont}>
            {tl(detail.personality, locale)}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Strengths */}
            <div className="bg-emerald-500/5 border border-emerald-500/15 rounded-lg p-4">
              <h3 className="text-emerald-400 font-semibold text-sm mb-2" style={headingFont}>
                {tl(LABELS.strengths, locale)}
              </h3>
              <p className="text-text-secondary text-sm leading-relaxed" style={bodyFont}>
                {tl(detail.strengths, locale)}
              </p>
            </div>
            {/* Challenges */}
            <div className="bg-amber-500/5 border border-amber-500/15 rounded-lg p-4">
              <h3 className="text-amber-400 font-semibold text-sm mb-2" style={headingFont}>
                {tl(LABELS.challenges, locale)}
              </h3>
              <p className="text-text-secondary text-sm leading-relaxed" style={bodyFont}>
                {tl(detail.challenges, locale)}
              </p>
            </div>
          </div>
        </motion.div>
      </section>

      {/* ══════════════════════════════════════════════════════════ */}
      {/* 4. CAREER                                                 */}
      {/* ══════════════════════════════════════════════════════════ */}
      <section className="my-12">
        <h2 className="text-2xl font-bold text-gold-gradient mb-6" style={headingFont}>
          <Briefcase className="w-6 h-6 inline-block mr-2 -mt-1" />
          {tl(LABELS.career, locale)}
        </h2>
        <motion.div
          className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-6 sm:p-8"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <p className="text-text-primary text-base leading-relaxed" style={bodyFont}>
            {tl(detail.career, locale)}
          </p>
        </motion.div>
      </section>

      {/* ══════════════════════════════════════════════════════════ */}
      {/* 5. HEALTH                                                 */}
      {/* ══════════════════════════════════════════════════════════ */}
      <section className="my-12">
        <h2 className="text-2xl font-bold text-gold-gradient mb-6" style={headingFont}>
          <Activity className="w-6 h-6 inline-block mr-2 -mt-1" />
          {tl(LABELS.health, locale)}
        </h2>
        <motion.div
          className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-6 sm:p-8"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <p className="text-text-primary text-base leading-relaxed" style={bodyFont}>
            {tl(detail.health, locale)}
          </p>
        </motion.div>
      </section>

      {/* ══════════════════════════════════════════════════════════ */}
      {/* 6. RELATIONSHIPS                                          */}
      {/* ══════════════════════════════════════════════════════════ */}
      <section className="my-12">
        <h2 className="text-2xl font-bold text-gold-gradient mb-6" style={headingFont}>
          <Heart className="w-6 h-6 inline-block mr-2 -mt-1" />
          {tl(LABELS.relationships, locale)}
        </h2>
        <motion.div
          className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-6 sm:p-8"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <p className="text-text-primary text-base leading-relaxed" style={bodyFont}>
            {tl(detail.relationships, locale)}
          </p>
        </motion.div>
      </section>

      <GoldDivider />

      {/* ══════════════════════════════════════════════════════════ */}
      {/* 7. TODAY'S HOROSCOPE                                      */}
      {/* ══════════════════════════════════════════════════════════ */}
      <section className="my-12">
        <h2 className="text-2xl font-bold text-gold-gradient mb-6" style={headingFont}>
          {tl(LABELS.todayFor, locale)} {rashi.name[locale] || rashi.name.en}
        </h2>

        {!horoscope ? (
          <div className="bg-bg-secondary/60 border border-gold-primary/8 rounded-xl p-8 text-center">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
              className="inline-block mb-3"
            >
              <Sparkles className="w-6 h-6 text-gold-primary" />
            </motion.div>
            <p className="text-text-secondary text-sm" style={bodyFont}>{tl(LABELS.loading, locale)}</p>
          </div>
        ) : (
          <motion.div
            className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-6 sm:p-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {/* Overall score */}
            <div className="flex items-center gap-4 mb-6">
              <div className="text-4xl font-bold text-gold-light font-mono">
                {horoscope.overallScore}
                <span className="text-lg text-gold-dark">/10</span>
              </div>
              <div className="flex-1">
                <div className="text-gold-dark text-xs mb-1">{tl(LABELS.overallScore, locale)}</div>
                <ScoreBar score={horoscope.overallScore} />
              </div>
            </div>

            {/* Area scores */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
              {(Object.keys(horoscope.areas) as Array<keyof typeof horoscope.areas>).map(area => {
                const areaData = horoscope.areas[area];
                return (
                  <div key={area} className="bg-bg-primary/40 rounded-lg p-3">
                    <div className="flex items-center gap-2 mb-1.5">
                      {AREA_ICONS[area]}
                      <span className="text-gold-light text-xs font-semibold">{tl(AREA_LABELS[area], locale)}</span>
                    </div>
                    <ScoreBar score={areaData.score} />
                    <p className="text-text-secondary text-xs mt-1.5 leading-relaxed" style={bodyFont}>
                      {areaData.text[locale as 'en' | 'hi'] || areaData.text.en}
                    </p>
                  </div>
                );
              })}
            </div>

            {/* Insight & lucky items */}
            <div className="bg-bg-primary/40 rounded-lg p-4 mb-4">
              <h4 className="text-gold-light text-sm font-semibold mb-2">{tl(LABELS.insight, locale)}</h4>
              <p className="text-text-secondary text-sm leading-relaxed" style={bodyFont}>
                {horoscope.insight[locale as 'en' | 'hi'] || horoscope.insight.en}
              </p>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div className="bg-bg-primary/40 rounded-lg p-3 text-center">
                <div className="text-gold-dark text-xs mb-1">{tl(LABELS.luckyColor, locale)}</div>
                <div className="text-gold-light text-sm font-semibold">
                  {horoscope.luckyColor[locale as 'en' | 'hi'] || horoscope.luckyColor.en}
                </div>
              </div>
              <div className="bg-bg-primary/40 rounded-lg p-3 text-center">
                <div className="text-gold-dark text-xs mb-1">{tl(LABELS.luckyNumber, locale)}</div>
                <div className="text-gold-light text-sm font-semibold font-mono">{horoscope.luckyNumber}</div>
              </div>
              <div className="bg-bg-primary/40 rounded-lg p-3 text-center">
                <div className="text-gold-dark text-xs mb-1">{tl(LABELS.luckyTime, locale)}</div>
                <div className="text-gold-light text-sm font-semibold font-mono">{horoscope.luckyTime}</div>
              </div>
            </div>
          </motion.div>
        )}
      </section>

      <GoldDivider />

      {/* ══════════════════════════════════════════════════════════ */}
      {/* 8. COMPATIBLE RASHIS                                      */}
      {/* ══════════════════════════════════════════════════════════ */}
      <section className="my-12">
        <h2 className="text-2xl font-bold text-gold-gradient mb-6" style={headingFont}>
          {tl(LABELS.compatible, locale)}
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {compatRashis.map((cr, idx) => {
            // Build matching pair slug: lower ID first
            const s1 = rashi.id <= cr.id ? rashi.slug : cr.slug;
            const s2 = rashi.id <= cr.id ? cr.slug : rashi.slug;
            return (
              <Link key={cr.id} href={`/matching/${s1}-and-${s2}`}>
                <motion.div
                  className={`bg-bg-secondary/60 border rounded-lg p-4 text-center hover:border-gold-primary/30 transition-colors cursor-pointer ${ELEMENT_BORDER[cr.element.en] || 'border-gold-primary/10'}`}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.05, duration: 0.3 }}
                  whileHover={{ scale: 1.05 }}
                >
                  <div className="flex justify-center mb-2">
                    <RashiIconById id={cr.id} size={40} />
                  </div>
                  <div className="text-gold-light font-semibold text-sm" style={bodyFont}>
                    {cr.name[locale] || cr.name.en}
                  </div>
                  <div className={`text-xs mt-1 ${ELEMENT_TEXT[cr.element.en] || 'text-text-secondary'}`}>
                    {cr.element[locale] || cr.element.en}
                  </div>
                </motion.div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════ */}
      {/* 9. RELATED NAKSHATRAS                                     */}
      {/* ══════════════════════════════════════════════════════════ */}
      <section className="my-12">
        <h2 className="text-2xl font-bold text-gold-gradient mb-6" style={headingFont}>
          {tl(LABELS.relatedNakshatras, locale)}
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {relatedNakshatras.map((nak, idx) => {
            // Calculate overlap with this rashi
            const overlapStart = Math.max(nak.startDeg, rashi.startDeg);
            const overlapEnd = Math.min(nak.endDeg, rashi.endDeg);
            const overlapPct = ((overlapEnd - overlapStart) / (nak.endDeg - nak.startDeg) * 100).toFixed(0);
            return (
              <Link key={nak.id} href={`/panchang/nakshatra/${nak.id}`}>
                <motion.div
                  className="bg-bg-secondary/60 border border-gold-primary/10 rounded-lg p-4 hover:border-gold-primary/25 transition-colors cursor-pointer"
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.05, duration: 0.3 }}
                  whileHover={{ scale: 1.02 }}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gold-primary/10 flex items-center justify-center text-gold-light text-sm font-mono">
                      {nak.id}
                    </div>
                    <div className="flex-1">
                      <div className="text-gold-light font-semibold text-sm" style={bodyFont}>
                        {nak.name[locale] || nak.name.en}
                      </div>
                      <div className="text-text-secondary text-xs">
                        {nak.startDeg.toFixed(1)}&deg; &ndash; {nak.endDeg.toFixed(1)}&deg;
                        <span className="text-gold-dark ml-2">({overlapPct}% in {rashi.name.en})</span>
                      </div>
                    </div>
                    <ArrowRight className="w-3.5 h-3.5 text-gold-dark" />
                  </div>
                </motion.div>
              </Link>
            );
          })}
        </div>
      </section>

      <GoldDivider />

      {/* ══════════════════════════════════════════════════════════ */}
      {/* 10. FAQ ACCORDION                                         */}
      {/* ══════════════════════════════════════════════════════════ */}
      <section className="my-12">
        <h2 className="text-2xl font-bold text-gold-gradient mb-6" style={headingFont}>
          {tl(LABELS.faq, locale)}
        </h2>
        <div className="space-y-2">
          {detail.faqs.map((faq, idx) => (
            <FAQItem
              key={idx}
              question={faq.question}
              answer={faq.answer}
              locale={locale}
              index={idx}
            />
          ))}
        </div>
      </section>

      <GoldDivider />

      {/* ══════════════════════════════════════════════════════════ */}
      {/* 11 & 12. PREV/NEXT NAVIGATION                             */}
      {/* ══════════════════════════════════════════════════════════ */}
      <div className="flex items-center justify-between my-12">
        <Link
          href={`/panchang/rashi/${prevRashi.slug}`}
          className="group flex items-center gap-3 text-gold-primary hover:text-gold-light transition-colors"
        >
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          <div className="text-right">
            <div className="text-gold-dark text-xs">{tl(LABELS.previous, locale)}</div>
            <div className="font-semibold text-sm" style={bodyFont}>
              {prevRashi.name[locale] || prevRashi.name.en}
            </div>
          </div>
        </Link>

        <Link
          href="/panchang/rashi"
          className="text-gold-dark hover:text-gold-light text-xs transition-colors"
        >
          {tl(LABELS.backToRashis, locale)}
        </Link>

        <Link
          href={`/panchang/rashi/${nextRashi.slug}`}
          className="group flex items-center gap-3 text-gold-primary hover:text-gold-light transition-colors"
        >
          <div className="text-left">
            <div className="text-gold-dark text-xs">{tl(LABELS.next, locale)}</div>
            <div className="font-semibold text-sm" style={bodyFont}>
              {nextRashi.name[locale] || nextRashi.name.en}
            </div>
          </div>
          <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>
    </div>
  );
}
