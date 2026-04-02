'use client';

import { useState } from 'react';
import { useLocale } from 'next-intl';
import { useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { ArrowLeft, BookOpen, Flame, Star, AlertTriangle, Check, Copy, Clock, Sparkles, Gift, Shield } from 'lucide-react';
import Link from 'next/link';
import { FESTIVAL_DETAILS, CATEGORY_DETAILS, EKADASHI_NAMES } from '@/lib/constants/festival-details';
import type { FestivalDetail, EkadashiDetail } from '@/lib/constants/festival-details';
import { PUJA_VIDHIS } from '@/lib/constants/puja-vidhi';
import type { PujaVidhi, MantraDetail as MantraType } from '@/lib/constants/puja-vidhi/types';
import type { Locale, Trilingual } from '@/types/panchang';

/* ═══════════════════════════════════════════
   LABELS
   ═══════════════════════════════════════════ */

const LABELS = {
  back: { en: 'Back to Calendar', hi: 'कैलेंडर पर वापस', sa: 'पञ्चाङ्गं प्रति' },
  about: { en: 'About', hi: 'परिचय', sa: 'परिचयः' },
  deity: { en: 'Deity', hi: 'देवता', sa: 'देवता' },
  mythology: { en: 'Story & Origin', hi: 'कथा एवं उत्पत्ति', sa: 'कथा उत्पत्तिश्च' },
  observance: { en: 'How to Observe', hi: 'पालन विधि', sa: 'पालनविधिः' },
  significance: { en: 'Significance', hi: 'महत्व', sa: 'महत्त्वम्' },
  fasting: { en: 'Fasting Rules', hi: 'व्रत नियम', sa: 'व्रतनियमाः' },
  pujaVidhi: { en: 'Puja Vidhi', hi: 'पूजा विधि', sa: 'पूजाविधिः' },
  muhurta: { en: 'Auspicious Timing (Muhurta)', hi: 'शुभ मुहूर्त', sa: 'शुभमुहूर्तम्' },
  samagri: { en: 'Materials (Samagri)', hi: 'सामग्री', sa: 'सामग्री' },
  sankalpa: { en: 'Sankalpa (Sacred Resolve)', hi: 'संकल्प', sa: 'सङ्कल्पः' },
  procedure: { en: 'Puja Steps', hi: 'पूजा विधि', sa: 'पूजाविधिः' },
  mantras: { en: 'Mantras', hi: 'मन्त्र', sa: 'मन्त्राः' },
  stotras: { en: 'Stotras', hi: 'स्तोत्र', sa: 'स्तोत्राणि' },
  aarti: { en: 'Aarti', hi: 'आरती', sa: 'आरतिः' },
  naivedya: { en: 'Offering (Naivedya)', hi: 'नैवेद्य', sa: 'नैवेद्यम्' },
  precautions: { en: 'Precautions', hi: 'सावधानियाँ', sa: 'सावधान्यानि' },
  phala: { en: 'Benefits (Phala)', hi: 'फल', sa: 'फलम्' },
  visarjan: { en: 'Visarjan (Conclusion)', hi: 'विसर्जन', sa: 'विसर्जनम्' },
  ekadashiStory: { en: 'Legend', hi: 'कथा', sa: 'कथा' },
  ekadashiBenefit: { en: 'Benefit', hi: 'फल', sa: 'फलम्' },
  notFound: { en: 'Festival details coming soon', hi: 'त्योहार विवरण शीघ्र आ रहा है', sa: 'उत्सवविवरणं शीघ्रम् आगच्छति' },
  notFoundSub: { en: 'We are working on adding detailed information for this festival.', hi: 'हम इस त्योहार की विस्तृत जानकारी जोड़ने पर कार्य कर रहे हैं।', sa: 'अस्य उत्सवस्य विस्तृतं विवरणं योजयितुं वयं कार्यं कुर्मः।' },
  itemsSelected: { en: 'items collected', hi: 'सामग्री एकत्र', sa: 'सामग्री सङ्गृहीता' },
  japaCount: { en: 'Japa Count', hi: 'जप संख्या', sa: 'जपसङ्ख्या' },
};

const l = (tri: Trilingual, locale: Locale) => tri[locale] || tri.en;

/* ═══════════════════════════════════════════
   ANIMATION VARIANTS
   ═══════════════════════════════════════════ */

const fadeInUp = {
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, ease: 'easeOut' as const },
};

const staggerContainer = {
  animate: { transition: { staggerChildren: 0.08 } },
};

/* ═══════════════════════════════════════════
   CATEGORY BADGE COLORS
   ═══════════════════════════════════════════ */

const categoryBadgeColors: Record<string, string> = {
  festival: 'bg-amber-500/15 border-amber-500/30 text-amber-300',
  ekadashi: 'bg-blue-500/15 border-blue-500/30 text-blue-300',
  purnima: 'bg-amber-400/15 border-amber-400/30 text-amber-200',
  amavasya: 'bg-purple-500/15 border-purple-500/30 text-purple-300',
  chaturthi: 'bg-orange-500/15 border-orange-500/30 text-orange-300',
  pradosham: 'bg-indigo-500/15 border-indigo-500/30 text-indigo-300',
  sankranti: 'bg-red-500/15 border-red-500/30 text-red-300',
  vrat: 'bg-emerald-500/15 border-emerald-500/30 text-emerald-300',
};

/* ═══════════════════════════════════════════
   PAGE COMPONENT
   ═══════════════════════════════════════════ */

export default function FestivalDetailPage() {
  const locale = useLocale() as Locale;
  const params = useParams();
  const slug = params.slug as string;

  const isDevanagari = locale !== 'en';
  const headingFont: React.CSSProperties = isDevanagari ? { fontFamily: 'var(--font-devanagari-heading)' } : { fontFamily: 'var(--font-heading)' };
  const bodyFont: React.CSSProperties = isDevanagari ? { fontFamily: 'var(--font-devanagari-body)' } : {};

  // Look up data
  const detail: FestivalDetail | undefined = FESTIVAL_DETAILS[slug] || CATEGORY_DETAILS[slug];
  const puja: PujaVidhi | undefined = PUJA_VIDHIS[slug];

  // Determine category from slug or puja
  const category = puja?.category === 'vrat' ? 'vrat'
    : puja?.category === 'graha_shanti' ? 'vrat'
    : slug.includes('ekadashi') ? 'ekadashi'
    : slug.includes('purnima') ? 'purnima'
    : slug.includes('amavasya') ? 'amavasya'
    : slug.includes('chaturthi') ? 'chaturthi'
    : slug.includes('pradosham') ? 'pradosham'
    : 'festival';

  // Ekadashi detail lookup
  let ekadashiDetail: EkadashiDetail | null = null;
  if (category === 'ekadashi') {
    // Try to find matching ekadashi by slug
    for (const monthKey of Object.keys(EKADASHI_NAMES)) {
      const monthData = EKADASHI_NAMES[monthKey];
      const shuklaSlug = monthData.shukla.name.en.toLowerCase().replace(/\s+/g, '-');
      const krishnaSlug = monthData.krishna.name.en.toLowerCase().replace(/\s+/g, '-');
      if (shuklaSlug === slug) { ekadashiDetail = monthData.shukla; break; }
      if (krishnaSlug === slug) { ekadashiDetail = monthData.krishna; break; }
    }
  }

  // Derive the deity from detail or puja
  const deity = detail?.deity || puja?.deity;

  // Derive festival name
  const festivalName: Trilingual | null = detail?.name || ekadashiDetail?.name || puja ? (puja?.deity ? { en: slug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' '), hi: slug, sa: slug } : null) : null;

  const hasContent = detail || ekadashiDetail || puja;

  // ─── Not Found ───
  if (!hasContent) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-4">
        <motion.div {...fadeInUp} className="text-center max-w-md">
          <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gold-primary/10 border border-gold-primary/20 flex items-center justify-center">
            <BookOpen className="w-10 h-10 text-gold-primary/50" />
          </div>
          <h1 className="text-3xl font-bold text-gold-gradient mb-3" style={headingFont}>
            {LABELS.notFound[locale]}
          </h1>
          <p className="text-text-secondary mb-8" style={bodyFont}>
            {LABELS.notFoundSub[locale]}
          </p>
          <Link
            href={`/${locale}/calendar`}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gold-primary/10 border border-gold-primary/20 text-gold-light hover:bg-gold-primary/20 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span style={headingFont}>{LABELS.back[locale]}</span>
          </Link>
        </motion.div>
      </div>
    );
  }

  // ─── Display name ───
  const displayName = detail?.name || ekadashiDetail?.name || { en: slug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' '), hi: slug, sa: slug };

  return (
    <div className="min-h-screen pb-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-6 sm:pt-10">
        <motion.div variants={staggerContainer} initial="initial" animate="animate" className="space-y-8">

          {/* ═══ Header ═══ */}
          <motion.div {...fadeInUp}>
            <Link
              href={`/${locale}/calendar`}
              className="inline-flex items-center gap-2 text-sm text-text-secondary hover:text-gold-light transition-colors mb-6 group"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              <span style={bodyFont}>{LABELS.back[locale]}</span>
            </Link>

            <div className="flex items-start gap-4">
              <div className="flex-1">
                <h1
                  className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gold-gradient leading-tight mb-3"
                  style={headingFont}
                >
                  {l(displayName, locale)}
                </h1>
                <div className="flex items-center gap-3 flex-wrap">
                  <span className={`text-xs px-3 py-1 rounded-full border font-bold uppercase tracking-wider ${categoryBadgeColors[category] || 'bg-gold-primary/10 border-gold-primary/20 text-gold-dark'}`}>
                    {category}
                  </span>
                  {deity && (
                    <span className="text-sm text-text-secondary" style={bodyFont}>
                      {l(deity, locale)}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </motion.div>

          {/* ═══ Section 1: About ═══ */}
          {detail && (
            <motion.div {...fadeInUp} className="space-y-5">
              <SectionHeading icon={<BookOpen className="w-5 h-5" />} title={LABELS.about[locale]} headingFont={headingFont} />

              {detail.deity && (
                <div className="glass-card rounded-xl p-5 border border-gold-primary/10">
                  <div className="flex items-center gap-3">
                    <Sparkles className="w-5 h-5 text-gold-primary" />
                    <span className="text-gold-dark text-sm font-bold uppercase tracking-wider" style={headingFont}>{LABELS.deity[locale]}</span>
                  </div>
                  <p className="text-gold-light text-lg mt-2 font-semibold" style={bodyFont}>{l(detail.deity, locale)}</p>
                </div>
              )}

              <ContentCard
                icon={<BookOpen className="w-5 h-5" />}
                title={LABELS.mythology[locale]}
                content={l(detail.mythology, locale)}
                headingFont={headingFont}
                bodyFont={bodyFont}
              />

              <ContentCard
                icon={<Star className="w-5 h-5" />}
                title={LABELS.significance[locale]}
                content={l(detail.significance, locale)}
                headingFont={headingFont}
                bodyFont={bodyFont}
                highlight
              />

              <ContentCard
                icon={<Flame className="w-5 h-5" />}
                title={LABELS.observance[locale]}
                content={l(detail.observance, locale)}
                headingFont={headingFont}
                bodyFont={bodyFont}
              />

              {detail.isFast && detail.fastNote && (
                <ContentCard
                  icon={<Clock className="w-5 h-5" />}
                  title={LABELS.fasting[locale]}
                  content={l(detail.fastNote, locale)}
                  headingFont={headingFont}
                  bodyFont={bodyFont}
                  highlight
                />
              )}
            </motion.div>
          )}

          {/* ═══ Section 2: Puja Vidhi ═══ */}
          {puja && (
            <motion.div {...fadeInUp} className="space-y-6">
              <SectionHeading icon={<Flame className="w-5 h-5" />} title={LABELS.pujaVidhi[locale]} headingFont={headingFont} />
              <FullPujaVidhi puja={puja} locale={locale} headingFont={headingFont} bodyFont={bodyFont} />
            </motion.div>
          )}

          {/* ═══ Section 3: Ekadashi-specific ═══ */}
          {ekadashiDetail && (
            <motion.div {...fadeInUp} className="space-y-5">
              <SectionHeading icon={<Star className="w-5 h-5" />} title={category === 'ekadashi' ? (locale === 'en' ? 'Ekadashi Details' : 'एकादशी विवरण') : ''} headingFont={headingFont} />

              <ContentCard
                icon={<BookOpen className="w-5 h-5" />}
                title={LABELS.ekadashiStory[locale]}
                content={l(ekadashiDetail.story, locale)}
                headingFont={headingFont}
                bodyFont={bodyFont}
              />

              <ContentCard
                icon={<Gift className="w-5 h-5" />}
                title={LABELS.ekadashiBenefit[locale]}
                content={l(ekadashiDetail.benefit, locale)}
                headingFont={headingFont}
                bodyFont={bodyFont}
                highlight
                accentColor="emerald"
              />
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════
   SUB-COMPONENTS
   ═══════════════════════════════════════════ */

function SectionHeading({ icon, title, headingFont }: { icon: React.ReactNode; title: string; headingFont: React.CSSProperties }) {
  return (
    <div className="flex items-center gap-3">
      <div className="w-10 h-10 rounded-xl bg-gold-primary/10 border border-gold-primary/20 flex items-center justify-center text-gold-primary">
        {icon}
      </div>
      <h2 className="text-xl sm:text-2xl font-bold text-gold-light uppercase tracking-wider" style={headingFont}>
        {title}
      </h2>
      <div className="flex-1 h-px bg-gold-primary/15" />
    </div>
  );
}

function ContentCard({
  icon,
  title,
  content,
  headingFont,
  bodyFont,
  highlight = false,
  accentColor = 'gold',
}: {
  icon: React.ReactNode;
  title: string;
  content: string;
  headingFont: React.CSSProperties;
  bodyFont: React.CSSProperties;
  highlight?: boolean;
  accentColor?: 'gold' | 'emerald';
}) {
  const highlightClasses = accentColor === 'emerald'
    ? 'bg-emerald-500/5 border-emerald-500/20'
    : 'bg-gold-primary/5 border-gold-primary/15';

  return (
    <div className={`glass-card rounded-xl p-5 sm:p-6 border ${highlight ? highlightClasses : 'border-gold-primary/10'}`}>
      <div className="flex items-center gap-2.5 mb-3">
        <span className={accentColor === 'emerald' ? 'text-emerald-400' : 'text-gold-primary'}>{icon}</span>
        <h3 className={`text-sm font-bold uppercase tracking-wider ${accentColor === 'emerald' ? 'text-emerald-300' : 'text-gold-light'}`} style={headingFont}>
          {title}
        </h3>
      </div>
      <p className="text-text-primary/90 text-base leading-relaxed" style={bodyFont}>
        {content}
      </p>
    </div>
  );
}

/* ═══════════════════════════════════════════
   INLINE MANTRA
   ═══════════════════════════════════════════ */

function InlineMantra({ mantra, locale, bodyFont }: { mantra: MantraType; locale: Locale; bodyFont: React.CSSProperties }) {
  const [copied, setCopied] = useState(false);
  const lk = locale === 'sa' ? 'hi' : locale;

  const copy = () => {
    navigator.clipboard.writeText(mantra.devanagari).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    });
  };

  return (
    <div className="glass-card rounded-xl p-5 sm:p-6 border border-gold-primary/10 relative">
      <button
        onClick={copy}
        className="absolute top-4 right-4 p-2 rounded-lg bg-bg-tertiary/50 hover:bg-bg-tertiary text-gold-primary/40 hover:text-gold-light transition-colors"
        aria-label="Copy mantra"
      >
        {copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
      </button>

      <p className="text-gold-dark text-xs uppercase tracking-wider font-bold mb-2">
        {mantra.name[lk as keyof typeof mantra.name]}
      </p>

      <p
        className="text-gold-light text-lg sm:text-xl leading-relaxed pr-10"
        style={{ fontFamily: 'var(--font-devanagari-heading)' }}
      >
        {mantra.devanagari}
      </p>

      <p className="text-text-secondary/60 text-sm italic mt-2">{mantra.iast}</p>

      <p className="text-text-secondary text-sm mt-2 leading-relaxed" style={bodyFont}>
        {mantra.meaning[lk as keyof typeof mantra.meaning]}
      </p>

      {mantra.japaCount && (
        <span className="inline-flex items-center gap-1.5 mt-3 text-xs px-3 py-1 rounded-full bg-gold-primary/10 border border-gold-primary/15 text-gold-dark font-bold">
          {mantra.japaCount}x {LABELS.japaCount[locale]}
        </span>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════
   FULL PUJA VIDHI (inline, full-page version)
   ═══════════════════════════════════════════ */

function FullPujaVidhi({ puja, locale, headingFont, bodyFont }: { puja: PujaVidhi; locale: Locale; headingFont: React.CSSProperties; bodyFont: React.CSSProperties }) {
  const t = (tri: Trilingual) => tri[locale] || tri.en;
  const [checkedItems, setCheckedItems] = useState<Set<number>>(new Set());

  const toggleItem = (idx: number) => {
    setCheckedItems(prev => {
      const next = new Set(prev);
      if (next.has(idx)) next.delete(idx);
      else next.add(idx);
      return next;
    });
  };

  return (
    <div className="space-y-6">

      {/* ─── Muhurta ─── */}
      <div className="glass-card rounded-xl p-5 sm:p-6 border border-gold-primary/10">
        <div className="flex items-center gap-2.5 mb-3">
          <Clock className="w-5 h-5 text-gold-primary" />
          <h3 className="text-sm font-bold text-gold-light uppercase tracking-wider" style={headingFont}>
            {LABELS.muhurta[locale]}
          </h3>
        </div>
        <p className="text-text-primary/90 text-base leading-relaxed" style={bodyFont}>{t(puja.muhurtaDescription)}</p>
      </div>

      {/* ─── Samagri ─── */}
      <div className="glass-card rounded-xl p-5 sm:p-6 border border-gold-primary/10">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2.5">
            <Gift className="w-5 h-5 text-gold-primary" />
            <h3 className="text-sm font-bold text-gold-light uppercase tracking-wider" style={headingFont}>
              {LABELS.samagri[locale]}
            </h3>
          </div>
          <span className="text-xs text-text-secondary px-3 py-1 rounded-full bg-bg-tertiary/50 border border-gold-primary/10">
            {checkedItems.size}/{puja.samagri.length} {LABELS.itemsSelected[locale]}
          </span>
        </div>
        <div className="flex flex-wrap gap-2">
          {puja.samagri.map((item, i) => {
            const isChecked = checkedItems.has(i);
            return (
              <button
                key={i}
                onClick={() => toggleItem(i)}
                className={`text-sm px-3 py-1.5 rounded-full border transition-all duration-200 ${
                  isChecked
                    ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-300 line-through opacity-70'
                    : 'bg-gold-primary/8 border-gold-primary/10 text-text-secondary hover:border-gold-primary/30'
                }`}
                style={bodyFont}
              >
                {isChecked && <Check className="w-3 h-3 inline mr-1" />}
                {t(item.name)}{item.quantity ? ` (${item.quantity})` : ''}
              </button>
            );
          })}
        </div>
      </div>

      {/* ─── Sankalpa ─── */}
      <div className="glass-card rounded-xl p-5 sm:p-6 border border-amber-500/20 bg-amber-500/3">
        <div className="flex items-center gap-2.5 mb-3">
          <Shield className="w-5 h-5 text-amber-400" />
          <h3 className="text-sm font-bold text-amber-300 uppercase tracking-wider" style={headingFont}>
            {LABELS.sankalpa[locale]}
          </h3>
        </div>
        <p
          className="text-gold-light text-base sm:text-lg leading-relaxed"
          style={{ fontFamily: 'var(--font-devanagari-body)' }}
        >
          {t(puja.sankalpa)}
        </p>
      </div>

      {/* ─── Vidhi Steps ─── */}
      <div className="glass-card rounded-xl p-5 sm:p-6 border border-gold-primary/10">
        <div className="flex items-center gap-2.5 mb-5">
          <Flame className="w-5 h-5 text-gold-primary" />
          <h3 className="text-sm font-bold text-gold-light uppercase tracking-wider" style={headingFont}>
            {LABELS.procedure[locale]}
          </h3>
        </div>
        <div className="space-y-4">
          {puja.vidhiSteps.map((step) => {
            const linkedMantra = step.mantraRef ? puja.mantras.find(m => m.id === step.mantraRef) : null;
            return (
              <div key={step.step} className="flex gap-4">
                <div className="flex-shrink-0">
                  <span className="w-8 h-8 rounded-full bg-gradient-to-br from-gold-light/20 to-gold-primary/10 border border-gold-primary/20 text-gold-primary text-sm font-bold flex items-center justify-center">
                    {step.step}
                  </span>
                </div>
                <div className="flex-1 min-w-0 pb-4 border-b border-gold-primary/5 last:border-0">
                  <h4 className="text-gold-light text-base font-semibold mb-1" style={bodyFont}>{t(step.title)}</h4>
                  <p className="text-text-secondary/80 text-sm leading-relaxed" style={bodyFont}>{t(step.description)}</p>
                  {linkedMantra && (
                    <div className="mt-3 pl-3 border-l-2 border-gold-primary/20">
                      <p className="text-gold-primary/60 text-xs uppercase tracking-wider font-bold mb-1">{linkedMantra.name[locale === 'sa' ? 'hi' : locale as 'en' | 'hi']}</p>
                      <p className="text-gold-light text-base" style={{ fontFamily: 'var(--font-devanagari-heading)' }}>{linkedMantra.devanagari}</p>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ─── Mantras ─── */}
      {puja.mantras.length > 0 && (
        <div>
          <div className="flex items-center gap-2.5 mb-4">
            <Sparkles className="w-5 h-5 text-gold-primary" />
            <h3 className="text-sm font-bold text-gold-light uppercase tracking-wider" style={headingFont}>
              {LABELS.mantras[locale]}
            </h3>
          </div>
          <div className="space-y-4">
            {puja.mantras.map((m) => (
              <InlineMantra key={m.id} mantra={m} locale={locale} bodyFont={bodyFont} />
            ))}
          </div>
        </div>
      )}

      {/* ─── Stotras ─── */}
      {puja.stotras && puja.stotras.length > 0 && (
        <div className="glass-card rounded-xl p-5 sm:p-6 border border-gold-primary/10">
          <div className="flex items-center gap-2.5 mb-4">
            <BookOpen className="w-5 h-5 text-gold-primary" />
            <h3 className="text-sm font-bold text-gold-light uppercase tracking-wider" style={headingFont}>
              {LABELS.stotras[locale]}
            </h3>
          </div>
          <div className="space-y-3">
            {puja.stotras.map((stotra, i) => (
              <div key={i} className="flex items-center justify-between rounded-lg bg-bg-tertiary/30 px-4 py-3">
                <div>
                  <p className="text-gold-light text-sm font-semibold" style={bodyFont}>{t(stotra.name)}</p>
                  {stotra.note && <p className="text-text-secondary/60 text-xs mt-0.5" style={bodyFont}>{t(stotra.note)}</p>}
                </div>
                {stotra.duration && (
                  <span className="text-xs text-text-secondary px-2 py-1 rounded-full bg-bg-tertiary/50 font-mono">
                    {stotra.duration}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ─── Aarti ─── */}
      {puja.aarti && (
        <div className="glass-card rounded-xl p-5 sm:p-6 border border-orange-500/15 bg-orange-500/3">
          <div className="flex items-center gap-2.5 mb-4">
            <Flame className="w-5 h-5 text-orange-400" />
            <h3 className="text-sm font-bold text-orange-300 uppercase tracking-wider" style={headingFont}>
              {LABELS.aarti[locale]}
            </h3>
          </div>
          <p
            className="text-gold-light text-base sm:text-lg whitespace-pre-line leading-relaxed mb-4"
            style={{ fontFamily: 'var(--font-devanagari-body)' }}
          >
            {puja.aarti.devanagari}
          </p>
          <p className="text-text-secondary/60 text-sm italic whitespace-pre-line leading-relaxed">
            {puja.aarti.iast}
          </p>
        </div>
      )}

      {/* ─── Naivedya ─── */}
      <div className="glass-card rounded-xl p-5 sm:p-6 border border-gold-primary/10">
        <div className="flex items-center gap-2.5 mb-3">
          <Gift className="w-5 h-5 text-gold-primary" />
          <h3 className="text-sm font-bold text-gold-light uppercase tracking-wider" style={headingFont}>
            {LABELS.naivedya[locale]}
          </h3>
        </div>
        <p className="text-text-primary/90 text-base leading-relaxed" style={bodyFont}>{t(puja.naivedya)}</p>
      </div>

      {/* ─── Precautions ─── */}
      {puja.precautions.length > 0 && (
        <div className="glass-card rounded-xl p-5 sm:p-6 border border-amber-500/15 bg-amber-500/3">
          <div className="flex items-center gap-2.5 mb-4">
            <AlertTriangle className="w-5 h-5 text-amber-400" />
            <h3 className="text-sm font-bold text-amber-300 uppercase tracking-wider" style={headingFont}>
              {LABELS.precautions[locale]}
            </h3>
          </div>
          <ul className="space-y-2.5">
            {puja.precautions.map((p, i) => (
              <li key={i} className="flex gap-3 text-text-secondary text-sm" style={bodyFont}>
                <AlertTriangle className="w-4 h-4 text-amber-400/50 flex-shrink-0 mt-0.5" />
                <span>{t(p)}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* ─── Phala ─── */}
      <div className="glass-card rounded-xl p-5 sm:p-6 border border-emerald-500/20 bg-emerald-500/3">
        <div className="flex items-center gap-2.5 mb-3">
          <Star className="w-5 h-5 text-emerald-400" />
          <h3 className="text-sm font-bold text-emerald-300 uppercase tracking-wider" style={headingFont}>
            {LABELS.phala[locale]}
          </h3>
        </div>
        <p className="text-text-primary/90 text-base leading-relaxed" style={bodyFont}>{t(puja.phala)}</p>
      </div>

      {/* ─── Visarjan ─── */}
      {puja.visarjan && (
        <div className="glass-card rounded-xl p-5 sm:p-6 border border-gold-primary/10">
          <div className="flex items-center gap-2.5 mb-3">
            <Sparkles className="w-5 h-5 text-gold-primary" />
            <h3 className="text-sm font-bold text-gold-light uppercase tracking-wider" style={headingFont}>
              {LABELS.visarjan[locale]}
            </h3>
          </div>
          <p className="text-text-primary/90 text-base leading-relaxed" style={bodyFont}>{t(puja.visarjan)}</p>
        </div>
      )}
    </div>
  );
}
