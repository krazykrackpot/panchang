'use client';

import { tl } from '@/lib/utils/trilingual';
import { useState } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from '@/lib/i18n/navigation';
import GoldDivider from '@/components/ui/GoldDivider';
import type { Locale , LocaleText} from '@/types/panchang';
import { ArrowLeft } from 'lucide-react';
import { GrahanIcon } from '@/components/icons/PanchangIcons';
import { isDevanagariLocale } from '@/lib/utils/locale-fonts';

/* ------------------------------------------------------------------ */
/*  Mini SVG icons for eclipse type (replacing unicode chars)          */
/* ------------------------------------------------------------------ */

function SolarMiniIcon() {
  return (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none" aria-hidden="true">
      {/* Rays */}
      {Array.from({ length: 8 }, (_, i) => {
        const angle = (Math.PI * 2 * i) / 8;
        const x1 = 16 + 10 * Math.cos(angle);
        const y1 = 16 + 10 * Math.sin(angle);
        const x2 = 16 + 14 * Math.cos(angle);
        const y2 = 16 + 14 * Math.sin(angle);
        return (
          <line
            key={i}
            x1={x1}
            y1={y1}
            x2={x2}
            y2={y2}
            stroke="#fbbf24"
            strokeWidth="1.5"
            strokeLinecap="round"
            opacity={i % 2 === 0 ? 0.9 : 0.55}
          />
        );
      })}
      {/* Golden disc */}
      <circle cx="16" cy="16" r="8" fill="#fbbf24" opacity="0.85" />
      <circle cx="16" cy="16" r="5" fill="#f59e0b" />
    </svg>
  );
}

function LunarMiniIcon() {
  return (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none" aria-hidden="true">
      {/* Crescent moon */}
      <path
        d="M20 5C14 9 10 13.5 10 18s4 8.5 10 12c-1.5 0.5-3 0.7-4.5 0.7C8.6 30.7 3 25 3 18S8.6 5.3 15.5 5.3c1.5 0 3 0.2 4.5 0.7z"
        fill="#a5b4fc"
        opacity="0.85"
      />
      {/* Glow rim */}
      <path
        d="M20 5C14 9 10 13.5 10 18s4 8.5 10 12"
        fill="none"
        stroke="#c7d2fe"
        strokeWidth="0.7"
        opacity="0.5"
      />
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/*  Animated Eclipse Sequence (5 phases of a total solar eclipse)      */
/* ------------------------------------------------------------------ */

const PHASE_LABELS = {
  en: ['First Contact', 'Partial', 'Totality', 'Partial', 'Fourth Contact'],
  hi: ['प्रथम स्पर्श', 'आंशिक', 'पूर्णता', 'आंशिक', 'चतुर्थ स्पर्श'],
  sa: ['प्रथमस्पर्शः', 'आंशिकम्', 'पूर्णता', 'आंशिकम्', 'चतुर्थस्पर्शः'],
};

function AnimatedEclipseSequence({ locale }: { locale: Locale }) {
  const isDevanagari = isDevanagariLocale(locale);
  const [activePhase, setActivePhase] = useState<number | null>(null);
  const labels = (PHASE_LABELS as Record<string, string[]>)[locale] || PHASE_LABELS.en;

  // Moon x-offsets for each phase: far right -> overlap -> aligned -> overlap -> far left
  const moonOffsets = [28, 12, 0, -12, -28];

  return (
    <div className="flex flex-col items-center gap-6">
      {/* Phase strip */}
      <div className="flex items-end justify-center gap-3 sm:gap-6">
        {moonOffsets.map((offset, i) => {
          const isActive = activePhase === i;
          return (
            <motion.button
              key={i}
              type="button"
              className="flex flex-col items-center gap-2 focus:outline-none"
              onHoverStart={() => setActivePhase(i)}
              onHoverEnd={() => setActivePhase(null)}
              onTapStart={() => setActivePhase(i)}
              whileHover={{ scale: 1.12 }}
              whileTap={{ scale: 0.97 }}
            >
              <svg width="56" height="56" viewBox="0 0 56 56" aria-hidden="true">
                <defs>
                  <radialGradient id={`corona-${i}`} cx="50%" cy="50%" r="55%">
                    <stop offset="60%" stopColor="transparent" />
                    <stop offset="100%" stopColor="rgba(251,191,36,0.15)" />
                  </radialGradient>
                </defs>
                {/* Corona (visible during totality) */}
                {i === 2 && (
                  <motion.circle
                    cx="28"
                    cy="28"
                    r="22"
                    fill={`url(#corona-${i})`}
                    stroke="rgba(251,191,36,0.25)"
                    strokeWidth="1"
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 1.5, repeat: Infinity, repeatType: 'reverse' }}
                  />
                )}
                {/* Sun */}
                <circle cx="28" cy="28" r="16" fill="#fbbf24" opacity="0.7" />
                <circle cx="28" cy="28" r="14" fill="#f59e0b" opacity="0.85" />
                {/* Moon disc sliding over */}
                <motion.circle
                  cx={28}
                  cy={28}
                  r="15"
                  fill="#0a0e27"
                  initial={{ x: 30 }}
                  animate={{ x: offset }}
                  transition={{ duration: 0.6, ease: 'easeInOut' }}
                />
                {/* Diamond ring effect at contacts */}
                {(i === 0 || i === 4) && (
                  <motion.circle
                    cx={28 + (i === 0 ? -12 : 12)}
                    cy={28}
                    r="2"
                    fill="#fef3c7"
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: [0, 1, 0], scale: [0, 1.5, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                )}
              </svg>
              {/* Label */}
              <motion.span
                className="text-xs sm:text-xs text-center whitespace-nowrap"
                animate={{ color: isActive ? '#fbbf24' : 'rgba(200,200,200,0.6)' }}
              >
                {labels[i]}
              </motion.span>
            </motion.button>
          );
        })}
      </div>

      {/* Description */}
      <AnimatePresence mode="wait">
        {activePhase !== null && (
          <motion.p
            key={activePhase}
            className="text-text-secondary text-sm text-center max-w-md"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.2 }}
          >
            {locale === 'en'
              ? [
                  'The Moon first touches the solar disc -- eclipse begins.',
                  'The Moon progressively covers the Sun. Crescent shadows appear.',
                  'Total eclipse: the corona blazes around the dark Moon. Stars become visible.',
                  'The Moon recedes. Sunlight returns in a growing crescent.',
                  'The Moon fully clears the Sun -- eclipse ends.',
                ][activePhase]
              : isDevanagari
              ? [
                  'चन्द्रमा पहली बार सूर्य बिम्ब को स्पर्श करता है -- ग्रहण प्रारम्भ।',
                  'चन्द्रमा क्रमशः सूर्य को ढकता है। अर्धचन्द्राकार छायाएँ दिखती हैं।',
                  'पूर्ण ग्रहण: अन्धकार चन्द्र के चारों ओर किरीट चमकता है। तारे दिखते हैं।',
                  'चन्द्रमा हटता है। सूर्य का प्रकाश बढ़ता अर्धचन्द्र बनाता है।',
                  'चन्द्रमा पूर्णतः सूर्य से हटता है -- ग्रहण समाप्त।',
                ][activePhase]
              : [
                  'चन्द्रमाः प्रथमवारं सूर्यबिम्बं स्पृशति -- ग्रहणम् आरभते।',
                  'चन्द्रमाः क्रमशः सूर्यम् आच्छादयति।',
                  'पूर्णग्रहणम्: किरीटं प्रज्वलति। नक्षत्राणि दृश्यन्ते।',
                  'चन्द्रमाः अपसरति। सूर्यप्रकाशः प्रत्यागच्छति।',
                  'चन्द्रमाः पूर्णतया सूर्यात् अपसरति -- ग्रहणं समाप्तम्।',
                ][activePhase]}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Eclipse Geometry SVG (fully animated)                              */
/* ------------------------------------------------------------------ */

function EclipseGeometrySVG({ locale }: { locale: Locale }) {
  const isDevanagari = isDevanagariLocale(locale);
  const draw = {
    hidden: { pathLength: 0, opacity: 0 },
    visible: (d: number) => ({
      pathLength: 1,
      opacity: 1,
      transition: { pathLength: { duration: 1.2, delay: d, ease: 'easeInOut' as const }, opacity: { duration: 0.3, delay: d } },
    }),
  };

  const fadeUp = {
    hidden: { opacity: 0, y: 8 },
    visible: (d: number) => ({ opacity: 1, y: 0, transition: { duration: 0.5, delay: d } }),
  };

  return (
    <motion.svg
      viewBox="0 0 600 300"
      className="w-full max-w-2xl"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
    >
      {/* ── Solar Eclipse ── */}
      <motion.text
        x="150"
        y="25"
        fill="#f0d48a"
        fontSize="12"
        textAnchor="middle"
        fontFamily="var(--font-heading)"
        variants={fadeUp}
        custom={0}
      >
        {tl({ en: 'SOLAR ECLIPSE', hi: 'सूर्य ग्रहण', sa: 'सूर्यग्रहणम्', ta: 'சூரிய கிரகணம்', te: 'సూర్యగ్రహణం', bn: 'সূর্যগ্রহণ', kn: 'ಸೂರ್ಯಗ್ರಹಣ', gu: 'સૂર્યગ્રહણ', mai: 'सूर्य ग्रहण', mr: 'सूर्यग्रहण' }, locale)}
      </motion.text>

      {/* Sun (solar side) */}
      <motion.circle
        cx="40"
        cy="80"
        r="28"
        fill="#fbbf24"
        opacity="0.3"
        variants={fadeUp}
        custom={0.15}
      />
      <motion.circle
        cx="40"
        cy="80"
        r="22"
        fill="#fbbf24"
        opacity="0.5"
        variants={fadeUp}
        custom={0.2}
      />
      <motion.text x="40" y="120" fill="#fbbf24" fontSize="9" textAnchor="middle" variants={fadeUp} custom={0.25}>
        {tl({ en: 'Sun', hi: 'सूर्य', sa: 'सूर्यः', ta: 'சூரியன்', te: 'సూర్యుడు', bn: 'সূর্য', kn: 'ಸೂರ್ಯ', gu: 'સૂર્ય', mai: 'सूर्य', mr: 'सूर्य' }, locale)}
      </motion.text>

      {/* Moon slides in between Sun and Earth */}
      <motion.circle
        cx="130"
        cy="80"
        r="10"
        fill="#555"
        stroke="rgba(212,168,83,0.4)"
        strokeWidth="1"
        initial={{ x: -50, opacity: 0 }}
        whileInView={{ x: 0, opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.0, delay: 0.5, ease: 'easeOut' }}
      />
      <motion.text
        x="130"
        y="105"
        fill="#aaa"
        fontSize="8"
        textAnchor="middle"
        variants={fadeUp}
        custom={0.7}
      >
        {tl({ en: 'Moon', hi: 'चन्द्र', sa: 'चन्द्रः', ta: 'சந்திரன்', te: 'చంద్రుడు', bn: 'চন্দ্র', kn: 'ಚಂದ್ರ', gu: 'ચંદ્ર', mai: 'चन्द्र', mr: 'चंद्र' }, locale)}
      </motion.text>

      {/* Shadow cone lines (solar) */}
      <motion.line
        x1="130"
        y1="70"
        x2="240"
        y2="60"
        stroke="rgba(100,100,100,0.3)"
        strokeWidth="1"
        strokeDasharray="3,3"
        variants={draw}
        custom={0.8}
      />
      <motion.line
        x1="130"
        y1="90"
        x2="240"
        y2="100"
        stroke="rgba(100,100,100,0.3)"
        strokeWidth="1"
        strokeDasharray="3,3"
        variants={draw}
        custom={0.85}
      />

      {/* Earth (solar side) */}
      <motion.circle cx="240" cy="80" r="16" fill="#2563eb" opacity="0.3" variants={fadeUp} custom={0.3} />
      <motion.circle cx="240" cy="80" r="12" fill="#2563eb" opacity="0.5" variants={fadeUp} custom={0.35} />
      <motion.text x="240" y="110" fill="#60a5fa" fontSize="9" textAnchor="middle" variants={fadeUp} custom={0.4}>
        {tl({ en: 'Earth', hi: 'पृथ्वी', sa: 'पृथिवी', ta: 'பூமி', te: 'భూమి', bn: 'পৃথিবী', kn: 'ಭೂಮಿ', gu: 'પૃથ્વી', mai: 'पृथ्वी', mr: 'पृथ्वी' }, locale)}
      </motion.text>

      {/* ── Lunar Eclipse ── */}
      <motion.text
        x="450"
        y="25"
        fill="#f0d48a"
        fontSize="12"
        textAnchor="middle"
        fontFamily="var(--font-heading)"
        variants={fadeUp}
        custom={0.1}
      >
        {tl({ en: 'LUNAR ECLIPSE', hi: 'चन्द्र ग्रहण', sa: 'चन्द्रग्रहणम्', ta: 'சந்திர கிரகணம்', te: 'చంద్రగ్రహణం', bn: 'চন্দ্রগ্রহণ', kn: 'ಚಂದ್ರಗ್ರಹಣ', gu: 'ચંદ્રગ્રહણ', mai: 'चन्द्र ग्रहण', mr: 'चंद्रग्रहण' }, locale)}
      </motion.text>

      {/* Sun (lunar side) */}
      <motion.circle cx="340" cy="80" r="28" fill="#fbbf24" opacity="0.3" variants={fadeUp} custom={0.2} />
      <motion.circle cx="340" cy="80" r="22" fill="#fbbf24" opacity="0.5" variants={fadeUp} custom={0.25} />
      <motion.text x="340" y="120" fill="#fbbf24" fontSize="9" textAnchor="middle" variants={fadeUp} custom={0.3}>
        {tl({ en: 'Sun', hi: 'सूर्य', sa: 'सूर्यः', ta: 'சூரியன்', te: 'సూర్యుడు', bn: 'সূর্য', kn: 'ಸೂರ್ಯ', gu: 'સૂર્ય', mai: 'सूर्य', mr: 'सूर्य' }, locale)}
      </motion.text>

      {/* Earth (lunar side) */}
      <motion.circle cx="440" cy="80" r="16" fill="#2563eb" opacity="0.3" variants={fadeUp} custom={0.35} />
      <motion.circle cx="440" cy="80" r="12" fill="#2563eb" opacity="0.5" variants={fadeUp} custom={0.4} />
      <motion.text x="440" y="110" fill="#60a5fa" fontSize="9" textAnchor="middle" variants={fadeUp} custom={0.45}>
        {tl({ en: 'Earth', hi: 'पृथ्वी', sa: 'पृथिवी', ta: 'பூமி', te: 'భూమి', bn: 'পৃথিবী', kn: 'ಭೂಮಿ', gu: 'પૃથ્વી', mai: 'पृथ्वी', mr: 'पृथ्वी' }, locale)}
      </motion.text>

      {/* Shadow cone grows (lunar) */}
      <motion.line
        x1="440"
        y1="68"
        x2="540"
        y2="60"
        stroke="rgba(100,100,100,0.45)"
        strokeWidth="1"
        strokeDasharray="3,3"
        initial={{ x2: 440, y2: 68, opacity: 0 }}
        whileInView={{ x2: 540, y2: 60, opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.0, delay: 0.7, ease: 'easeOut' }}
      />
      <motion.line
        x1="440"
        y1="92"
        x2="540"
        y2="100"
        stroke="rgba(100,100,100,0.45)"
        strokeWidth="1"
        strokeDasharray="3,3"
        initial={{ x2: 440, y2: 92, opacity: 0 }}
        whileInView={{ x2: 540, y2: 100, opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.0, delay: 0.75, ease: 'easeOut' }}
      />

      {/* Moon in shadow */}
      <motion.circle
        cx="540"
        cy="80"
        r="10"
        fill="#7f1d1d"
        opacity="0.6"
        stroke="rgba(212,168,83,0.4)"
        strokeWidth="1"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 0.6 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, delay: 1.0 }}
      />
      <motion.text x="540" y="105" fill="#f87171" fontSize="8" textAnchor="middle" variants={fadeUp} custom={1.1}>
        {tl({ en: 'Moon', hi: 'चन्द्र', sa: 'चन्द्रः', ta: 'சந்திரன்', te: 'చంద్రుడు', bn: 'চন্দ্র', kn: 'ಚಂದ್ರ', gu: 'ચંદ્ર', mai: 'चन्द्र', mr: 'चंद्र' }, locale)}
      </motion.text>

      {/* ── Rahu-Ketu Axis (animated dashed line drawing) ── */}
      <motion.line
        x1="50"
        y1="200"
        x2="550"
        y2="200"
        stroke="rgba(212,168,83,0.3)"
        strokeWidth="1"
        strokeDasharray="6,4"
        variants={draw}
        custom={1.2}
      />
      <motion.text
        x="300"
        y="190"
        fill="rgba(212,168,83,0.5)"
        fontSize="10"
        textAnchor="middle"
        variants={fadeUp}
        custom={1.4}
      >
        {locale === 'en'
          ? 'Rahu-Ketu Axis (Lunar Nodes)'
          : tl({ en: 'राहु-केतु अक्षः', hi: 'राहु-केतु अक्ष (चन्द्र पातबिन्दु)', sa: 'राहु-केत्वक्षः', ta: 'ராகு-கேது அச்சு', te: 'రాహు-కేతు అక్షం', bn: 'রাহু-কেতু অক্ষ', kn: 'ರಾಹು-ಕೇತು ಅಕ್ಷ', gu: 'રાહુ-કેતુ અક્ષ', mai: 'राहु-केतु अक्ष', mr: 'राहु-केतु अक्ष' }, locale)}
      </motion.text>

      {/* Rahu node */}
      <motion.circle
        cx="100"
        cy="200"
        r="6"
        fill="none"
        stroke="#f87171"
        strokeWidth="1.5"
        variants={draw}
        custom={1.5}
      />
      <motion.text x="100" y="220" fill="#f87171" fontSize="8" textAnchor="middle" variants={fadeUp} custom={1.55}>
        {tl({ en: 'Rahu', hi: 'राहु', sa: 'राहुः', ta: 'ராகு', te: 'రాహువు', bn: 'রাহু', kn: 'ರಾಹು', gu: 'રાહુ', mai: 'राहु', mr: 'राहू' }, locale)}
      </motion.text>

      {/* Ketu node */}
      <motion.circle
        cx="500"
        cy="200"
        r="6"
        fill="none"
        stroke="#60a5fa"
        strokeWidth="1.5"
        variants={draw}
        custom={1.5}
      />
      <motion.text x="500" y="220" fill="#60a5fa" fontSize="8" textAnchor="middle" variants={fadeUp} custom={1.55}>
        {tl({ en: 'Ketu', hi: 'केतु', sa: 'केतुः', ta: 'கேது', te: 'కేతువు', bn: 'কেতু', kn: 'ಕೇತು', gu: 'કેતુ', mai: 'केतु', mr: 'केतू' }, locale)}
      </motion.text>

      {/* ── Ecliptic path (animated drawing) ── */}
      <motion.path
        d="M 50 250 Q 300 230 550 250"
        fill="none"
        stroke="rgba(240,212,138,0.3)"
        strokeWidth="1"
        variants={draw}
        custom={1.7}
      />
      <motion.text
        x="300"
        y="270"
        fill="rgba(212,168,83,0.4)"
        fontSize="8"
        textAnchor="middle"
        variants={fadeUp}
        custom={1.9}
      >
        {tl({ en: 'Ecliptic Plane', hi: 'क्रान्तिवृत्त तल', sa: 'क्रान्तिवृत्ततलम्', ta: 'கிரகண தளம்', te: 'క్రాంతివృత్త తలం', bn: 'ক্রান্তিবৃত্ত তল', kn: 'ಕ್ರಾಂತಿವೃತ್ತ ತಲ', gu: 'ક્રાંતિવૃત્ત તલ', mai: 'क्रान्तिवृत्त तल', mr: 'क्रांतिवृत्त तल' }, locale)}
      </motion.text>

      {/* ── Lunar orbit path (animated drawing, dashed) ── */}
      <motion.path
        d="M 50 260 Q 300 220 550 260"
        fill="none"
        stroke="rgba(150,150,220,0.3)"
        strokeWidth="1"
        strokeDasharray="4,3"
        variants={draw}
        custom={1.8}
      />
      <motion.text
        x="300"
        y="285"
        fill="rgba(150,150,220,0.4)"
        fontSize="8"
        textAnchor="middle"
        variants={fadeUp}
        custom={2.0}
      >
        {locale === 'en'
          ? 'Lunar Orbit (~5.14\u00B0 inclined)'
          : tl({ en: 'चन्द्रकक्षा (~5.14\u00B0)', hi: 'चन्द्र कक्षा (~5.14\u00B0 झुकी)', sa: 'चन्द्र कक्षा (~5.14\u00B0 झुकी)', ta: 'चन्द्रकक्षा (~5.14\u00B0)', te: 'चन्द्रकक्षा (~5.14\u00B0)', bn: 'चन्द्रकक्षा (~5.14\u00B0)', kn: 'चन्द्रकक्षा (~5.14\u00B0)', gu: 'चन्द्रकक्षा (~5.14\u00B0)', mai: 'चन्द्र कक्षा (~5.14\u00B0 झुकी)', mr: 'चन्द्र कक्षा (~5.14\u00B0 झुकी)' }, locale)}
      </motion.text>
    </motion.svg>
  );
}

/* ------------------------------------------------------------------ */
/*  Eclipse data                                                       */
/* ------------------------------------------------------------------ */

const UPCOMING_ECLIPSES: {
  type: 'solar' | 'lunar';
  date: string;
  name: LocaleText;
  visibility: LocaleText;
  kind: LocaleText;
}[] = [
  {
    type: 'lunar',
    date: '2025-03-14',
    name: { en: 'Total Lunar Eclipse', hi: 'पूर्ण चन्द्र ग्रहण', sa: 'पूर्णचन्द्रग्रहणम्' },
    visibility: { en: 'Americas, Europe, Africa', hi: 'अमेरिका, यूरोप, अफ्रीका', sa: 'अमेरिका, यूरोप, आफ्रिका' },
    kind: { en: 'Total', hi: 'पूर्ण', sa: 'पूर्णम्' },
  },
  {
    type: 'solar',
    date: '2025-03-29',
    name: { en: 'Partial Solar Eclipse', hi: 'आंशिक सूर्य ग्रहण', sa: 'आंशिकसूर्यग्रहणम्' },
    visibility: { en: 'Europe, N. Africa, Russia', hi: 'यूरोप, उ. अफ्रीका, रूस', sa: 'यूरोप, उत्तरआफ्रिका, रूसदेशः' },
    kind: { en: 'Partial', hi: 'आंशिक', sa: 'आंशिकम्' },
  },
  {
    type: 'lunar',
    date: '2025-09-07',
    name: { en: 'Total Lunar Eclipse', hi: 'पूर्ण चन्द्र ग्रहण', sa: 'पूर्णचन्द्रग्रहणम्' },
    visibility: { en: 'Europe, Africa, Asia', hi: 'यूरोप, अफ्रीका, एशिया', sa: 'यूरोप, आफ्रिका, एशिया' },
    kind: { en: 'Total', hi: 'पूर्ण', sa: 'पूर्णम्' },
  },
  {
    type: 'solar',
    date: '2025-09-21',
    name: { en: 'Partial Solar Eclipse', hi: 'आंशिक सूर्य ग्रहण', sa: 'आंशिकसूर्यग्रहणम्' },
    visibility: {
      en: 'S. Pacific, Antarctica, N. Zealand',
      hi: 'द. प्रशान्त, अण्टार्कटिका, न्यूज़ीलैण्ड',
      sa: 'दक्षिणप्रशान्तः, अण्टार्कटिका',
    },
    kind: { en: 'Partial', hi: 'आंशिक', sa: 'आंशिकम्' },
  },
  {
    type: 'solar',
    date: '2026-02-17',
    name: { en: 'Annular Solar Eclipse', hi: 'वलयाकार सूर्य ग्रहण', sa: 'वलयाकारसूर्यग्रहणम्' },
    visibility: {
      en: 'S. America, Antarctica, Africa',
      hi: 'द. अमेरिका, अण्टार्कटिका, अफ्रीका',
      sa: 'दक्षिणअमेरिका, आफ्रिका',
    },
    kind: { en: 'Annular', hi: 'वलयाकार', sa: 'वलयाकारम्' },
  },
  {
    type: 'lunar',
    date: '2026-03-03',
    name: { en: 'Total Lunar Eclipse', hi: 'पूर्ण चन्द्र ग्रहण', sa: 'पूर्णचन्द्रग्रहणम्' },
    visibility: {
      en: 'E. Asia, Australia, Americas',
      hi: 'पू. एशिया, ऑस्ट्रेलिया, अमेरिका',
      sa: 'पूर्वएशिया, अमेरिका',
    },
    kind: { en: 'Total', hi: 'पूर्ण', sa: 'पूर्णम्' },
  },
  {
    type: 'solar',
    date: '2026-08-12',
    name: { en: 'Total Solar Eclipse', hi: 'पूर्ण सूर्य ग्रहण', sa: 'पूर्णसूर्यग्रहणम्' },
    visibility: {
      en: 'Arctic, Greenland, Spain, Iceland',
      hi: 'आर्कटिक, ग्रीनलैंड, स्पेन',
      sa: 'आर्कटिक, स्पेनदेशः',
    },
    kind: { en: 'Total', hi: 'पूर्ण', sa: 'पूर्णम्' },
  },
  {
    type: 'lunar',
    date: '2026-08-28',
    name: { en: 'Partial Lunar Eclipse', hi: 'आंशिक चन्द्र ग्रहण', sa: 'आंशिकचन्द्रग्रहणम्' },
    visibility: { en: 'Americas, Europe, Africa', hi: 'अमेरिका, यूरोप, अफ्रीका', sa: 'अमेरिका, यूरोप, आफ्रिका' },
    kind: { en: 'Partial', hi: 'आंशिक', sa: 'आंशिकम्' },
  },
];

/* ------------------------------------------------------------------ */
/*  Main Page                                                          */
/* ------------------------------------------------------------------ */

export default function GrahanPage() {
  const t = useTranslations('deepDive');
  const locale = useLocale() as Locale;
  const isTamil = String(locale) === 'ta';
  const isDevanagari = isDevanagariLocale(locale);
  const headingFont = isDevanagari
    ? { fontFamily: 'var(--font-devanagari-heading)' }
    : { fontFamily: 'var(--font-heading)' };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Back link */}
      <Link
        href="/panchang"
        className="inline-flex items-center gap-2 text-gold-primary hover:text-gold-light mb-8 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> {t('backToPanchang')}
      </Link>

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-6 mb-6"
      >
        <GrahanIcon size={72} />
        <div>
          <h1 className="text-4xl sm:text-5xl font-bold mb-4" style={headingFont}>
            <span className="text-gold-gradient">
              {tl({ en: 'Grahan', hi: 'ग्रहण', sa: 'ग्रहणम्', ta: 'கிரகணம்', te: 'గ్రహణం', bn: 'গ্রহণ', kn: 'ಗ್ರಹಣ', gu: 'ગ્રહણ', mai: 'ग्रहण', mr: 'ग्रहण' }, locale)}
            </span>
          </h1>
          <p className="text-text-secondary text-lg" style={{ fontFamily: 'var(--font-heading)' }}>
            {tl({ en: 'Solar & Lunar Eclipses -- The Cosmic Shadow Play', hi: 'सूर्य एवं चन्द्र ग्रहण -- ब्रह्माण्डीय छाया नाटक', sa: 'सूर्यचन्द्रग्रहणे — ब्रह्माण्डस्य छायानाटकम्', ta: 'சூரிய மற்றும் சந்திர கிரகணங்கள் — அண்டத்தின் நிழல் நாடகம்', te: 'సూర్య మరియు చంద్ర గ్రహణాలు — విశ్వ నీడ నాటకం', bn: 'সূর্য ও চন্দ্রগ্রহণ — মহাজাগতিক ছায়া নাটক', kn: 'ಸೂರ್ಯ ಮತ್ತು ಚಂದ್ರಗ್ರಹಣ — ವಿಶ್ವದ ನೆರಳು ನಾಟಕ', gu: 'સૂર્ય અને ચંદ્ર ગ્રહણ — બ્રહ્માંડની છાયા-નાટ', mai: 'सूर्य आ चन्द्र ग्रहण — ब्रह्मांडीय छाया नाटक', mr: 'सूर्य व चंद्र ग्रहण — विश्वाचा छाया खेळ' }, locale)}
          </p>
        </div>
      </motion.div>

      <GoldDivider />

      {/* ── Scientific Basis ── */}
      <section className="my-12">
        <h2 className="text-2xl font-bold text-gold-gradient mb-6" style={headingFont}>
          {t('scientificBasis')}
        </h2>
        <motion.div
          className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-8"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="prose prose-invert max-w-none text-text-secondary">
            <p className="text-lg leading-relaxed">
              {locale === 'en'
                ? 'Eclipses occur when the Sun, Moon, and Earth align near the lunar nodes (Rahu-Ketu axis). A Solar Eclipse (Surya Grahan) happens at New Moon (Amavasya) when the Moon passes between the Sun and Earth, casting its shadow on Earth. A Lunar Eclipse (Chandra Grahan) occurs at Full Moon (Purnima) when the Earth\'s shadow falls on the Moon. The Moon\'s orbital plane is inclined ~5.14\u00B0 to the ecliptic, so eclipses only occur when the New/Full Moon is near the ascending (Rahu) or descending (Ketu) node -- within about 18.5\u00B0 for solar and 12.5\u00B0 for lunar eclipses. The Saros cycle of ~18 years 11 days governs the periodicity.'
                : tl({ en: 'ग्रहणं तदा भवति यदा सूर्यचन्द्रपृथिव्यः चन्द्रपातबिन्दूनां (राहु-केत्वक्षस्य) समीपे एकरेखायां भवन्ति। सूर्यग्रहणम् अमावस्यायां भवति यदा चन्द्रमाः सूर्यपृथिव्योः मध्ये गच्छति। चन्द्रग्रहणं पूर्णिमायां भवति यदा पृथिव्याः छाया चन्द्रमसि पतति।', hi: 'ग्रहण तब होता है जब सूर्य, चन्द्र और पृथ्वी चन्द्र पातबिन्दुओं (राहु-केतु अक्ष) के निकट एक रेखा में आते हैं। सूर्य ग्रहण अमावस्या को होता है जब चन्द्रमा सूर्य और पृथ्वी के बीच से गुज़रता है। चन्द्र ग्रहण पूर्णिमा को होता है जब पृथ्वी की छाया चन्द्रमा पर पड़ती है। चन्द्र कक्षा का तल क्रान्तिवृत्त से ~5.14\u00B0 झुका है, अतः ग्रहण केवल तभी होता है जब अमावस्या/पूर्णिमा राहु या केतु बिन्दु के निकट हो। सैरोस चक्र ~18 वर्ष 11 दिन का होता है।', sa: 'ग्रहणं तदा भवति यदा सूर्यचन्द्रपृथिव्यः चन्द्रपातबिन्दूनां (राहु-केत्वक्षस्य) समीपे एकरेखायां भवन्ति। सूर्यग्रहणम् अमावस्यायां भवति यदा चन्द्रमाः सूर्यपृथिव्योः मध्ये गच्छति। चन्द्रग्रहणं पूर्णिमायां भवति यदा पृथिव्याः छाया चन्द्रमसि पतति।', ta: 'சூரியன், சந்திரன், பூமி ஆகியவை ராகு-கேது அச்சுக்கு அருகில் ஒரே கோட்டில் வரும்போது கிரகணம் நிகழும். அமாவாசையன்று சந்திரன் சூரியனுக்கும் பூமிக்கும் இடையில் வரும்போது சூரிய கிரகணம் உண்டாகும். பௌர்ணமியன்று பூமியின் நிழல் சந்திரன் மீது விழும்போது சந்திர கிரகணம் உண்டாகும்.', te: 'సూర్యుడు, చంద్రుడు, భూమి రాహు-కేతు అక్షానికి దగ్గరగా ఒకే రేఖలో వచ్చినప్పుడు గ్రహణం సంభవిస్తుంది. అమావాస్యనాడు చంద్రుడు సూర్యునికి మరియు భూమికి మధ్య వచ్చినప్పుడు సూర్యగ్రహణం కలుగుతుంది. పౌర్ణమినాడు భూమి నీడ చంద్రుని మీద పడినప్పుడు చంద్రగ్రహణం కలుగుతుంది.', bn: 'গ্রহণ তখন হয় যখন সূর্য, চন্দ্র ও পৃথিবী রাহু-কেতু অক্ষের কাছে এক সরলরেখায় আসে। অমাবস্যায় চন্দ্র সূর্য ও পৃথিবীর মাঝে গেলে সূর্যগ্রহণ হয়। পূর্ণিমায় পৃথিবীর ছায়া চন্দ্রের উপর পড়লে চন্দ্রগ্রহণ হয়।', kn: 'ಸೂರ್ಯ, ಚಂದ್ರ ಮತ್ತು ಭೂಮಿ ರಾಹು-ಕೇತು ಅಕ್ಷದ ಸಮೀಪ ಒಂದೇ ರೇಖೆಯಲ್ಲಿ ಬಂದಾಗ ಗ್ರಹಣ ಸಂಭವಿಸುತ್ತದೆ. ಅಮಾವಾಸ್ಯೆಯಂದು ಚಂದ್ರನು ಸೂರ್ಯ ಮತ್ತು ಭೂಮಿಯ ಮಧ್ಯೆ ಬಂದಾಗ ಸೂರ್ಯಗ್ರಹಣ ಆಗುತ್ತದೆ. ಹುಣ್ಣಿಮೆಯಂದು ಭೂಮಿಯ ನೆರಳು ಚಂದ್ರನ ಮೇಲೆ ಬಿದ್ದಾಗ ಚಂದ್ರಗ್ರಹಣ ಆಗುತ್ತದೆ.', gu: 'સૂર્ય, ચંદ્ર અને પૃથ્વી રાહુ-કેતુ અક્ષ નજીક એક રેખામાં આવે ત્યારે ગ્રહણ થાય છે. અમાવસ્યાએ ચંદ્ર સૂર્ય અને પૃથ્વીની વચ્ચે આવે ત્યારે સૂર્યગ્રહણ થાય. પૂર્ણિમાએ પૃથ્વીનો પડછાયો ચંદ્ર પર પડે ત્યારે ચંદ્રગ્રહણ થાય.', mai: 'ग्रहण तखन होइत अछि जखन सूर्य, चन्द्र आ पृथ्वी राहु-केतु अक्षक समीप एक रेखामे आबि जाइत छथि। सूर्य ग्रहण अमावस्याकेँ होइत अछि जखन चन्द्रमा सूर्य आ पृथ्वीक मध्य जाइत छथि। चन्द्र ग्रहण पूर्णिमाकेँ होइत अछि जखन पृथ्वीक छाया चन्द्रमापर पड़ैत अछि।', mr: 'ग्रहण तेव्हा होते जेव्हा सूर्य, चंद्र आणि पृथ्वी राहु-केतु अक्षाजवळ एका रेषेत येतात. सूर्यग्रहण अमावस्येला होते जेव्हा चंद्र सूर्य व पृथ्वीच्या मध्ये जातो. चंद्रग्रहण पौर्णिमेला होते जेव्हा पृथ्वीची सावली चंद्रावर पडते.' }, locale)}
            </p>
            <div className="mt-6 p-4 bg-bg-primary/50 rounded-lg border border-gold-primary/10">
              <p className="text-gold-light font-mono text-sm">
                {tl({ en: 'Condition:', hi: 'शर्त:', sa: 'शर्तः:', ta: 'நிபந்தனை:', te: 'షరతు:', bn: 'শর্ত:', kn: 'ಷರತ್ತು:', gu: 'શરત:', mai: 'शर्त:', mr: 'अट:' }, locale)} |Moon_lat_node_distance| &lt; 18.5\u00B0 (Solar) or
                &lt; 12.5\u00B0 (Lunar)
              </p>
              <p className="text-gold-light/70 font-mono text-xs mt-1">
                {locale === 'en'
                  ? 'Saros cycle: ~6,585.3 days (223 synodic months)'
                  : 'सैरोस चक्र: ~6,585.3 दिन (223 सिनोडिक मास)'}
              </p>
            </div>
          </div>
        </motion.div>
      </section>

      {/* ── Eclipse Geometry Visualization (animated) ── */}
      <section className="my-12">
        <h2 className="text-2xl font-bold text-gold-gradient mb-6" style={headingFont}>
          {tl({ en: 'Eclipse Geometry', hi: 'ग्रहण ज्यामिति', sa: 'ग्रहणज्यामितिः', ta: 'கிரகண வடிவியல்', te: 'గ్రహణ జ్యామితి', bn: 'গ্রহণ জ্যামিতি', kn: 'ಗ್ರಹಣ ರೇಖಾಗಣಿತ', gu: 'ગ્રહણ ભૂમિતિ', mai: 'ग्रहण ज्यामिति', mr: 'ग्रहण भूमिती' }, locale)}
        </h2>
        <div className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-8 flex justify-center">
          <EclipseGeometrySVG locale={locale} />
        </div>
      </section>

      <GoldDivider />

      {/* ── Animated Eclipse Sequence ── */}
      <section className="my-12">
        <h2 className="text-2xl font-bold text-gold-gradient mb-6" style={headingFont}>
          {locale === 'en'
            ? 'Total Solar Eclipse Phases'
            : tl({ en: 'पूर्णसूर्यग्रहणस्य चरणानि', hi: 'पूर्ण सूर्य ग्रहण के चरण', sa: 'पूर्णसूर्यग्रहणस्य चरणानि', ta: 'முழு சூரிய கிரகணத்தின் நிலைகள்', te: 'పూర్ణ సూర్యగ్రహణం యొక్క దశలు', bn: 'পূর্ণ সূর্যগ্রহণের পর্যায়গুলি', kn: 'ಸಂಪೂರ್ಣ ಸೂರ್ಯಗ್ರಹಣದ ಹಂತಗಳು', gu: 'પૂર્ણ સૂર્યગ્રહણના તબક્કાઓ', mai: 'पूर्ण सूर्य ग्रहणक चरण', mr: 'पूर्ण सूर्यग्रहणाचे टप्पे' }, locale)}
        </h2>
        <motion.div
          className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-8"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <AnimatedEclipseSequence locale={locale} />
        </motion.div>
      </section>

      <GoldDivider />

      {/* ── Upcoming Eclipses ── */}
      <section className="my-12">
        <h2 className="text-2xl font-bold text-gold-gradient mb-6" style={headingFont}>
          {t('completeListing')}
        </h2>
        <h3 className="text-xl text-gold-light mb-4" style={headingFont}>
          {locale === 'en'
            ? 'Upcoming Eclipses (2025-2026)'
            : tl({ en: 'आगामिग्रहणानि (2025-2026)', hi: 'आगामी ग्रहण (2025-2026)', sa: 'आगामिग्रहणानि (2025-2026)', ta: 'வரவிருக்கும் கிரகணங்கள் (2025-2026)', te: 'రాబోయే గ్రహణాలు (2025-2026)', bn: 'আসন্ন গ্রহণ (2025-2026)', kn: 'ಮುಂಬರುವ ಗ್ರಹಣಗಳು (2025-2026)', gu: 'આગામી ગ્રહણ (2025-2026)', mai: 'आगामी ग्रहण (2025-2026)', mr: 'आगामी ग्रहणे (2025-2026)' }, locale)}
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {UPCOMING_ECLIPSES.map((eclipse, i) => (
            <motion.div
              key={eclipse.date}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              whileHover={{ y: -4 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className={`bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-lg p-5 border cursor-default transition-shadow ${
                eclipse.type === 'solar'
                  ? 'border-amber-500/20 hover:shadow-amber-500/10 hover:shadow-lg'
                  : 'border-indigo-500/20 hover:shadow-indigo-500/10 hover:shadow-lg'
              }`}
            >
              <div className="mb-2">
                {eclipse.type === 'solar' ? <SolarMiniIcon /> : <LunarMiniIcon />}
              </div>
              <div
                className="text-gold-light font-semibold text-sm"
                style={isDevanagari ? { fontFamily: 'var(--font-devanagari-heading)' } : undefined}
              >
                {eclipse.name[locale]}
              </div>
              <div className="text-gold-primary text-xs mt-1 font-mono">{eclipse.date}</div>
              <div
                className={`text-xs mt-2 ${eclipse.type === 'solar' ? 'text-amber-400' : 'text-indigo-300'}`}
              >
                {eclipse.kind[locale]}
              </div>
              <div
                className="text-text-secondary text-xs mt-1"
                style={isDevanagari ? { fontFamily: 'var(--font-devanagari-body)' } : undefined}
              >
                {eclipse.visibility[locale]}
              </div>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
}
