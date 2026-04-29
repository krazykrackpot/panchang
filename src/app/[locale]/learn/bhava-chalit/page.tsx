'use client';

import { useLocale } from 'next-intl';
import { motion } from 'framer-motion';
import { Link } from '@/lib/i18n/navigation';
import type { Locale } from '@/types/panchang';
import { isDevanagariLocale } from '@/lib/utils/locale-fonts';
import { lt } from '@/lib/learn/translations';
import type { LocaleText } from '@/lib/learn/translations';
import KeyTakeaway from '@/components/learn/KeyTakeaway';
import WhyItMatters from '@/components/learn/WhyItMatters';
import BeginnerNote from '@/components/learn/BeginnerNote';
import ClassicalReference from '@/components/learn/ClassicalReference';
import L from '@/messages/learn/bhava-chalit.json';

const t = (key: string, locale: string) => lt((L as unknown as Record<string, LocaleText>)[key], locale);

/* ─── Expert schools data ─── */
const SCHOOLS = [
  {
    nameKey: 'debateParashari',
    school: { en: 'Parashari (Traditional)', hi: 'पराशरी (परम्परागत)' },
    color: 'text-amber-400',
    border: 'border-amber-500/20',
    icon: '\u0950', // OM
  },
  {
    nameKey: 'debateKNRao',
    school: { en: 'K.N. Rao School', hi: 'के.एन. राव सम्प्रदाय' },
    color: 'text-emerald-400',
    border: 'border-emerald-500/20',
    icon: '\u2694', // crossed swords
  },
  {
    nameKey: 'debateKP',
    school: { en: 'KP (Krishnamurti)', hi: 'KP (कृष्णमूर्ति)' },
    color: 'text-blue-300',
    border: 'border-blue-500/20',
    icon: '\u2609', // sun
  },
  {
    nameKey: 'debateSouth',
    school: { en: 'South Indian Tradition', hi: 'दक्षिण भारतीय परम्परा' },
    color: 'text-violet-400',
    border: 'border-violet-500/20',
    icon: '\u25C8', // diamond
  },
];

/* ─── When-to-use items ─── */
const USE_CASES = [
  { key: 'usePersonality', icon: '\u263A' },
  { key: 'usePrediction', icon: '\u231A' },
  { key: 'useLifeQuestions', icon: '\u2764' },
  { key: 'useYogas', icon: '\u2728' },
  { key: 'useAspects', icon: '\u25CE' },
];

/* ─── Cross references ─── */
const CROSS_REFS = [
  { href: '/learn/bhavas', labelKey: 'crossRefBhavas', descKey: 'crossRefBhavasDesc' },
  { href: '/learn/advanced-houses', labelKey: 'crossRefAdvancedHouses', descKey: 'crossRefAdvancedHousesDesc' },
  { href: '/learn/kundali', labelKey: 'crossRefKundali', descKey: 'crossRefKundaliDesc' },
  { href: '/learn/lagna', labelKey: 'crossRefLagna', descKey: 'crossRefLagnaDesc' },
];

/* ─── Calculation steps ─── */
const CALC_STEPS = ['calcStep1', 'calcStep2', 'calcStep3', 'calcStep4', 'calcStep5'];

/* ─── Visual: worked example rows ─── */
const EXAMPLE_ROWS = [
  'exampleAsc',
  'exampleMars',
  'exampleRashi',
  'exampleBhava5',
  'exampleBhava5Range',
  'exampleBhava6',
  'exampleBhava6Range',
  'exampleResult',
];

const sectionMotion = {
  initial: { opacity: 0, y: 20 } as const,
  whileInView: { opacity: 1, y: 0 } as const,
  viewport: { once: true, margin: '-50px' } as const,
  transition: { duration: 0.5 } as const,
};

export default function LearnBhavaChalitPage() {
  const locale = useLocale() as Locale;
  const headingFont = isDevanagariLocale(locale)
    ? { fontFamily: 'var(--font-devanagari-heading)' }
    : { fontFamily: 'var(--font-heading)' };
  const tx = (key: string) => t(key, locale);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold text-gold-gradient mb-3" style={headingFont}>
          {tx('title')}
        </h2>
        <p className="text-text-secondary text-sm leading-relaxed max-w-3xl">
          {tx('subtitle')}
        </p>
      </div>

      {/* Key Takeaway */}
      <KeyTakeaway locale={locale} points={[
        'The Rashi chart places planets by sign. Bhava Chalit places them by actual house cusps centered on the ascendant degree.',
        'When D1 and Bhava Chalit agree, that is the strongest reading. When they disagree, use Bhava Chalit for prediction.',
        'Most working astrologers check BOTH charts. This is not optional for serious predictive work.',
      ]} />

      {/* Beginner terms */}
      <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm text-text-secondary mb-4">
        <BeginnerNote term="Bhava" explanation="A 'house' in the chart -- one of 12 life domains (self, wealth, siblings, etc.). In Bhava Chalit, these are degree-based arcs, not sign-based." />
        <BeginnerNote term="Bhava Madhya" explanation="The midpoint (center degree) of a house. In Equal Bhava, House 1 madhya = the exact ascendant degree." />
        <BeginnerNote term="Bhava Sandhi" explanation="The boundary between two houses. Planets near a sandhi are the ones most likely to shift between Rashi and Bhava Chalit." />
      </div>

      {/* 1. What is Bhava Chalit? */}
      <motion.section {...sectionMotion}
        className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-6 sm:p-8"
      >
        <h3 className="text-xl sm:text-2xl font-bold text-gold-gradient mb-4" style={headingFont}>
          {tx('whatIsTitle')}
        </h3>
        <div className="text-text-secondary text-base leading-relaxed space-y-4">
          <p>{tx('whatIsBody1')}</p>
          <p>{tx('whatIsBody2')}</p>
          <p>{tx('whatIsBody3')}</p>

          {/* Visual: Sign vs Degree comparison */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 my-6">
            <div className="bg-gradient-to-br from-[#2d1b69]/30 via-[#1a1040]/40 to-[#0a0e27] border border-gold-primary/15 rounded-xl p-4 text-center">
              <div className="text-gold-dark text-xs uppercase tracking-widest font-bold mb-2">
                {locale === 'hi' ? 'राशि कुण्डली (D1)' : 'Rashi Chart (D1)'}
              </div>
              <div className="text-3xl mb-2">&#x25A6;</div>
              <div className="text-text-secondary text-sm">
                {locale === 'hi'
                  ? 'प्रत्येक राशि = एक भाव\nसरल, राशि सीमाओं पर आधारित'
                  : 'Each sign = one house\nSimple, based on sign boundaries'}
              </div>
            </div>
            <div className="bg-gradient-to-br from-[#2d1b69]/30 via-[#1a1040]/40 to-[#0a0e27] border border-emerald-500/20 rounded-xl p-4 text-center">
              <div className="text-emerald-400 text-xs uppercase tracking-widest font-bold mb-2">
                {locale === 'hi' ? 'भाव चलित' : 'Bhava Chalit'}
              </div>
              <div className="text-3xl mb-2">&#x25CE;</div>
              <div className="text-text-secondary text-sm">
                {locale === 'hi'
                  ? 'लग्न अंश = भाव 1 का मध्य\nअंश-आधारित, 30° चाप'
                  : 'Ascendant degree = House 1 midpoint\nDegree-based, 30° arcs'}
              </div>
            </div>
          </div>
        </div>
      </motion.section>

      {/* 2. Why It Matters */}
      <motion.section {...sectionMotion}
        className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-6 sm:p-8"
      >
        <h3 className="text-xl sm:text-2xl font-bold text-gold-gradient mb-4" style={headingFont}>
          {tx('whyMattersTitle')}
        </h3>
        <WhyItMatters locale={locale}>
          <ul className="space-y-2 list-disc list-inside">
            <li>{tx('whyMattersNature')}</li>
            <li>{tx('whyMattersAction')}</li>
          </ul>
        </WhyItMatters>
        <div className="mt-4 bg-gradient-to-br from-[#2d1b69]/30 via-[#1a1040]/40 to-[#0a0e27] border border-amber-500/20 rounded-xl p-4">
          <div className="text-amber-400 text-xs uppercase tracking-widest font-bold mb-2">
            {locale === 'hi' ? 'उदाहरण' : 'Example'}
          </div>
          <p className="text-text-secondary text-sm leading-relaxed">
            {tx('whyMattersExample')}
          </p>
        </div>
      </motion.section>

      {/* 3. How Is It Calculated? */}
      <motion.section {...sectionMotion}
        className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-6 sm:p-8"
      >
        <h3 className="text-xl sm:text-2xl font-bold text-gold-gradient mb-4" style={headingFont}>
          {tx('calculationTitle')}
        </h3>
        <ol className="space-y-3 text-text-secondary text-base leading-relaxed">
          {CALC_STEPS.map((key, i) => (
            <li key={key} className="flex items-start gap-3">
              <span className="flex-shrink-0 w-7 h-7 rounded-full bg-gold-primary/15 border border-gold-primary/30 text-gold-primary text-sm font-bold flex items-center justify-center">
                {i + 1}
              </span>
              <span>{tx(key)}</span>
            </li>
          ))}
        </ol>
      </motion.section>

      {/* 4. Equal vs Sripati */}
      <motion.section {...sectionMotion}
        className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-6 sm:p-8"
      >
        <h3 className="text-xl sm:text-2xl font-bold text-gold-gradient mb-4" style={headingFont}>
          {tx('equalVsSripatiTitle')}
        </h3>
        <div className="text-text-secondary text-base leading-relaxed space-y-4">
          <p>{tx('equalDesc')}</p>
          <p>{tx('sripatiDesc')}</p>
        </div>
        <ClassicalReference
          shortName="BPHS"
          chapter="Ch. 7 — Bhava Division"
          topic={tx('bphsNote')}
        />
      </motion.section>

      {/* 5. The Expert Debate */}
      <motion.section {...sectionMotion}
        className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-6 sm:p-8"
      >
        <h3 className="text-xl sm:text-2xl font-bold text-gold-gradient mb-4" style={headingFont}>
          {tx('debateTitle')}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          {SCHOOLS.map((s) => (
            <div
              key={s.nameKey}
              className={`bg-gradient-to-br from-[#2d1b69]/30 via-[#1a1040]/40 to-[#0a0e27] border ${s.border} rounded-xl p-4`}
            >
              <div className="flex items-center gap-2 mb-2">
                <span className="text-lg">{s.icon}</span>
                <span className={`font-bold text-sm ${s.color}`}>
                  {locale === 'hi' ? s.school.hi : s.school.en}
                </span>
              </div>
              <p className="text-text-secondary text-sm leading-relaxed">
                {tx(s.nameKey)}
              </p>
            </div>
          ))}
        </div>
        <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-4">
          <div className="text-emerald-400 text-xs uppercase tracking-widest font-bold mb-2">
            {locale === 'hi' ? 'व्यावहारिक सहमति' : 'Practical Consensus'}
          </div>
          <p className="text-text-secondary text-sm leading-relaxed">
            {tx('debateConsensus')}
          </p>
        </div>
      </motion.section>

      {/* 6. When to Use Which */}
      <motion.section {...sectionMotion}
        className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-6 sm:p-8"
      >
        <h3 className="text-xl sm:text-2xl font-bold text-gold-gradient mb-4" style={headingFont}>
          {tx('whenToUseTitle')}
        </h3>
        <div className="space-y-3">
          {USE_CASES.map((uc) => (
            <div key={uc.key} className="flex items-start gap-3 text-text-secondary text-base leading-relaxed">
              <span className="text-gold-primary text-lg flex-shrink-0">{uc.icon}</span>
              <span>{tx(uc.key)}</span>
            </div>
          ))}
        </div>
      </motion.section>

      {/* 7. Worked Example */}
      <motion.section {...sectionMotion}
        className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-6 sm:p-8"
      >
        <h3 className="text-xl sm:text-2xl font-bold text-gold-gradient mb-4" style={headingFont}>
          {tx('exampleTitle')}
        </h3>
        <div className="space-y-2 text-text-secondary text-sm leading-relaxed font-mono bg-gradient-to-br from-[#2d1b69]/20 via-[#1a1040]/30 to-[#0a0e27] border border-gold-primary/10 rounded-lg p-4">
          {EXAMPLE_ROWS.map((key) => (
            <p key={key}>{tx(key)}</p>
          ))}
        </div>
        <div className="mt-4 bg-amber-500/10 border border-amber-500/20 rounded-lg p-4">
          <p className="text-text-secondary text-sm leading-relaxed">
            {tx('exampleShiftNote')}
          </p>
        </div>
      </motion.section>

      {/* 8. CTA — Generate your kundali */}
      <motion.section {...sectionMotion}
        className="bg-gradient-to-br from-[#2d1b69]/60 via-[#1a1040]/70 to-[#0a0e27] border border-gold-primary/20 rounded-2xl p-6 sm:p-8 text-center"
      >
        <h3 className="text-xl sm:text-2xl font-bold text-gold-gradient mb-3" style={headingFont}>
          {tx('ctaTitle')}
        </h3>
        <p className="text-text-secondary text-sm leading-relaxed max-w-2xl mx-auto mb-5">
          {tx('ctaBody')}
        </p>
        <Link
          href="/kundali"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gold-primary/15 border border-gold-primary/40 text-gold-light font-bold hover:bg-gold-primary/25 hover:border-gold-primary/60 transition-all"
        >
          {tx('ctaLink')}
        </Link>
      </motion.section>

      {/* 9. Cross References */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {CROSS_REFS.map((ref) => (
          <Link
            key={ref.href}
            href={ref.href}
            className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 hover:border-gold-primary/40 rounded-xl p-4 transition-colors group"
          >
            <span className="text-gold-light font-bold text-sm group-hover:text-gold-primary transition-colors">
              {tx(ref.labelKey)}
            </span>
            <p className="text-text-secondary text-xs mt-1 leading-relaxed">
              {tx(ref.descKey)}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}
