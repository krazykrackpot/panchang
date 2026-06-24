'use client';

import { tl } from '@/lib/utils/trilingual';
import { useState } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from '@/lib/i18n/navigation';
import GoldDivider from '@/components/ui/GoldDivider';
import { SAMVATSARA_NAMES } from '@/lib/ephem/astronomical';
import type { Locale } from '@/types/panchang';
import { ArrowLeft } from 'lucide-react';
import { SamvatsaraIcon } from '@/components/icons/PanchangIcons';
import { isDevanagariLocale, getHeadingFont } from '@/lib/utils/locale-fonts';
import AuthorByline from '@/components/ui/AuthorByline';

const yugaColors = ['#4ade80', '#fbbf24', '#f97316', '#60a5fa', '#a78bfa'];

/* ------------------------------------------------------------------ */
/*  AnimatedSamvatsaraWheel                                           */
/* ------------------------------------------------------------------ */
function AnimatedSamvatsaraWheel({
  locale,
  selected,
  onSelect,
}: {
  locale: Locale;
  selected: number | null;
  onSelect: (index: number) => void;
}) {
  const CX = 290;
  const CY = 290;
  // Script-aware font for SVG <text> elements — Devanagari/Tamil/Telugu/
  // Bengali etc. all have their own heading family. Hardcoding
  // var(--font-heading) renders Latin for those locales.
  const localeHeadingFont = getHeadingFont(locale);
  const localeHeadingFamily = (localeHeadingFont.fontFamily as string | undefined) ?? 'var(--font-heading)';

  /* ---------- helpers ---------- */
  function describeArc(
    cx: number, cy: number, r: number,
    startDeg: number, endDeg: number,
  ): string {
    const toRad = (d: number) => ((d - 90) * Math.PI) / 180;
    const x1 = cx + r * Math.cos(toRad(startDeg));
    const y1 = cy + r * Math.sin(toRad(startDeg));
    const x2 = cx + r * Math.cos(toRad(endDeg));
    const y2 = cy + r * Math.sin(toRad(endDeg));
    const largeArc = endDeg - startDeg > 180 ? 1 : 0;
    return `M ${x1} ${y1} A ${r} ${r} 0 ${largeArc} 1 ${x2} ${y2}`;
  }

  /* ---------- concentric ring radii ---------- */
  const ringRadii = [150, 190, 230];

  const sectorAngle = 360 / 60;

  return (
    <motion.svg
      viewBox="0 0 580 580"
      className="w-full max-w-xl"
      initial={{ opacity: 0, rotate: -45 }}
      animate={{ opacity: 1, rotate: 0 }}
      transition={{ duration: 1.4, ease: 'easeOut' }}
    >
      {/* Glow filter for Jupiter */}
      <defs>
        <filter id="jupiterGlow">
          <feGaussianBlur stdDeviation="3.5" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <filter id="selectedGlow">
          <feGaussianBlur stdDeviation="4" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* ---- Animated concentric rings ---- */}
      {ringRadii.map((r, i) => (
        <motion.circle
          key={`ring-${i}`}
          cx={CX}
          cy={CY}
          fill="none"
          stroke="rgba(212,168,83,0.1)"
          strokeWidth="1"
          initial={{ r: 0 }}
          animate={{ r }}
          transition={{ duration: 1.0, delay: 0.15 * i, ease: 'easeOut' }}
        />
      ))}

      {/* ---- 5 Yuga arcs ---- */}
      {[0, 1, 2, 3, 4].map((yuga) => {
        const startDeg = yuga * 72;
        const endDeg = (yuga + 1) * 72;
        const arcPath = describeArc(CX, CY, 155, startDeg, endDeg);
        const arcLen = (Math.PI * 155 * 72) / 180;

        return (
          <motion.path
            key={`yuga-${yuga}`}
            d={arcPath}
            fill="none"
            stroke={yugaColors[yuga]}
            strokeWidth="35"
            opacity="0.1"
            strokeDasharray={arcLen}
            strokeDashoffset={arcLen}
            initial={{ strokeDashoffset: arcLen }}
            animate={{ strokeDashoffset: 0 }}
            transition={{ duration: 1.2, delay: 0.5 + yuga * 0.15, ease: 'easeInOut' }}
          />
        );
      })}

      {/* ---- 60 year markers (staggered reveal) ----
          Tick lines hug the outer rings; number labels sit OUTSIDE the
          tick at r=255 so they're not crowded against the wheel body.
          Labels are kept upright (no per-tick rotation) — easier to read
          at a glance. Font size is large enough to read on a phone. */}
      {SAMVATSARA_NAMES.map((s, i) => {
        const angle = (i * sectorAngle - 90) * Math.PI / 180;
        const x1 = CX + 200 * Math.cos(angle);
        const y1 = CY + 200 * Math.sin(angle);
        const x2 = CX + 235 * Math.cos(angle);
        const y2 = CY + 235 * Math.sin(angle);
        const textX = CX + 255 * Math.cos(angle);
        const textY = CY + 255 * Math.sin(angle);
        const yugaIndex = Math.floor(i / 12);
        const isSelected = selected === i;
        // Show every label clearly; emphasise the multiples of 5 so the
        // ring scans cleanly without losing per-year resolution.
        const isMilestone = (i + 1) % 5 === 0;

        // Localised name for the aria-label so screen-reader users hear
        // "Prabhava, year 1" rather than a bare number.
        const samvatsaraName = tl(s, locale);
        const ariaLabel = `${samvatsaraName} — year ${i + 1} of 60`;

        return (
          <g
            key={`marker-${i}`}
            onClick={() => onSelect(i)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                onSelect(i);
              }
            }}
            tabIndex={0}
            role="button"
            aria-label={ariaLabel}
            aria-pressed={isSelected}
            style={{ cursor: 'pointer', outline: 'none' }}
          >
            {/* Larger invisible hit target — taps on phones must land. */}
            <circle cx={textX} cy={textY} r="14" fill="transparent" />
            {/* Tick line */}
            <motion.line
              x1={x1} y1={y1} x2={x2} y2={y2}
              stroke={isSelected ? '#fbbf24' : isMilestone ? 'rgba(212,168,83,0.55)' : 'rgba(212,168,83,0.25)'}
              strokeWidth={isSelected ? 2 : isMilestone ? 1.5 : 1}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3, delay: 1.2 + i * 0.02 }}
            />
            {/* Number label */}
            <motion.text
              x={textX}
              y={textY}
              fill={isSelected ? '#fbbf24' : yugaColors[yugaIndex]}
              fontSize={isSelected ? '18' : isMilestone ? '14' : '11'}
              fontWeight={isSelected || isMilestone ? 'bold' : 'normal'}
              textAnchor="middle"
              dominantBaseline="middle"
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: isSelected ? 1 : isMilestone ? 1 : 0.85, scale: 1 }}
              transition={{ duration: 0.3, delay: 1.2 + i * 0.025 }}
              filter={isSelected ? 'url(#selectedGlow)' : undefined}
            >
              {i + 1}
            </motion.text>
          </g>
        );
      })}

      {/* ---- Orbiting Jupiter dot (golden, ~90s rotation) ---- */}
      <motion.circle
        r="7"
        fill="#fbbf24"
        filter="url(#jupiterGlow)"
        animate={{
          cx: [
            CX + 175 * Math.cos(-Math.PI / 2),
            CX + 175 * Math.cos(-Math.PI / 2 + Math.PI / 2),
            CX + 175 * Math.cos(-Math.PI / 2 + Math.PI),
            CX + 175 * Math.cos(-Math.PI / 2 + (3 * Math.PI) / 2),
            CX + 175 * Math.cos(-Math.PI / 2 + 2 * Math.PI),
          ],
          cy: [
            CY + 175 * Math.sin(-Math.PI / 2),
            CY + 175 * Math.sin(-Math.PI / 2 + Math.PI / 2),
            CY + 175 * Math.sin(-Math.PI / 2 + Math.PI),
            CY + 175 * Math.sin(-Math.PI / 2 + (3 * Math.PI) / 2),
            CY + 175 * Math.sin(-Math.PI / 2 + 2 * Math.PI),
          ],
        }}
        transition={{
          duration: 90,
          repeat: Infinity,
          ease: 'linear',
        }}
      />

      {/* ---- Animated center labels ---- */}
      <motion.text
        x={CX} y={CY - 20}
        fill="#f0d48a"
        fontSize="36"
        fontWeight="bold"
        textAnchor="middle"
        fontFamily={localeHeadingFamily}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 1.6 }}
      >
        {tl({ en: '60', hi: '६०', sa: '६०', ta: '60', te: '60', bn: '60', kn: '60', gu: '60', mai: '६०', mr: '६०' }, locale)}
      </motion.text>
      <motion.text
        x={CX} y={CY - 2}
        fill="#d4a853"
        fontSize="9"
        textAnchor="middle"
        fontFamily={localeHeadingFamily}
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.7 }}
        transition={{ duration: 0.8, delay: 1.7 }}
      >
        {tl({ en: 'years', hi: 'वर्ष', sa: 'वर्षाणि', ta: 'ஆண்டுகள்', te: 'సంవత్సరాలు', bn: 'বছর', kn: 'ವರ್ಷಗಳು', gu: 'વર્ષો', mai: 'वर्ष', mr: 'वर्षे' }, locale)}
      </motion.text>
      <motion.text
        x={CX} y={CY + 18}
        fill="#d4a853"
        fontSize="12"
        textAnchor="middle"
        fontFamily={localeHeadingFamily}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 1.8 }}
      >
        {tl({ en: 'Samvatsaras', hi: 'संवत्सराः', sa: 'संवत्सराः', ta: 'சம்வத்சரங்கள்', te: 'సంవత్సరాలు', bn: 'সংবৎসর', kn: 'ಸಂವತ್ಸರಗಳು', gu: 'સંવત્સર', mai: 'संवत्सर', mr: 'संवत्सरे' }, locale)}
      </motion.text>
      <motion.text
        x={CX} y={CY + 34}
        fill="#8a6d2b"
        fontSize="10"
        textAnchor="middle"
        fontFamily={localeHeadingFamily}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 2.0 }}
      >
        {tl({ en: 'Jupiter–Saturn Cycle', hi: 'बृहस्पति-शनि चक्र', sa: 'बृहस्पति-शनिचक्रम्', ta: 'குரு-சனி சுழற்சி', te: 'గురు-శని చక్రం', bn: 'বৃহস্পতি-শনি চক্র', kn: 'ಗುರು-ಶನಿ ಚಕ್ರ', gu: 'ગુરુ-શની ચક્ર', mai: 'बृहस्पति-शनि चक्र', mr: 'गुरू-शनी चक्र' }, locale)}
      </motion.text>
    </motion.svg>
  );
}

/* ================================================================== */
/*  Page                                                              */
/* ================================================================== */
export default function SamvatsaraPage() {
  const t = useTranslations('deepDive');
  const locale = useLocale() as Locale;
  const isDevanagari = isDevanagariLocale(locale);
  const headingFont = isDevanagari
    ? { fontFamily: 'var(--font-devanagari-heading)' }
    : { fontFamily: 'var(--font-heading)' };

  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  // Group into 5 cycles of 12 (Yugas)
  const yugaNames = [
    { en: 'Prabhava Group (1-12)', hi: 'प्रभव वर्ग (1-12)', sa: 'प्रभववर्गः (1-12)' },
    { en: 'Pramodoota Group (13-24)', hi: 'प्रमोदूत वर्ग (13-24)', sa: 'प्रमोदूतवर्गः (13-24)' },
    { en: 'Nandana Group (25-36)', hi: 'नन्दन वर्ग (25-36)', sa: 'नन्दनवर्गः (25-36)' },
    { en: 'Plavanga Group (37-48)', hi: 'प्लवंग वर्ग (37-48)', sa: 'प्लवङ्गवर्गः (37-48)' },
    { en: 'Ananda Group (49-60)', hi: 'आनन्द वर्ग (49-60)', sa: 'आनन्दवर्गः (49-60)' },
  ];

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
        <SamvatsaraIcon size={72} />
        <div>
          <h1 className="text-4xl sm:text-5xl font-bold mb-4" style={headingFont}>
            <span className="text-gold-gradient">
              {locale === 'en'
                ? 'Samvatsara'
                : tl({ en: 'संवत्सरः', hi: 'संवत्सर', sa: 'संवत्सरः', ta: 'சம்வத்சரம்', te: 'సంవత్సరం', bn: 'সংবৎসর', kn: 'ಸಂವತ್ಸರ', gu: 'સંવત્સર', mai: 'संवत्सर', mr: 'संवत्सर' }, locale)}
            </span>
          </h1>
          <p
            className="text-text-secondary text-lg"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            {locale === 'en'
              ? 'The 60-Year Jovian Cycle  –  Brihaspati Samvatsara Chakra'
              : tl({ en: 'षष्टिवार्षिकबृहस्पतिचक्रम्  –  संवत्सरचक्रम्', hi: '60-वर्षीय बृहस्पति चक्र  –  संवत्सर चक्र', sa: 'षष्टिवार्षिकबृहस्पतिचक्रम्  –  संवत्सरचक्रम्', ta: '60 ஆண்டு குரு சுழற்சி  –  சம்வத்சர சக்கரம்', te: '60-సంవత్సర గురు చక్రం  –  సంవత్సర చక్రం', bn: '60-বার্ষিক বৃহস্পতি চক্র  –  সংবৎসর চক্র', kn: '60-ವರ್ಷದ ಗುರು ಚಕ್ರ  –  ಸಂವತ್ಸರ ಚಕ್ರ', gu: '60-વર્ષીય ગુરુ ચક્ર  –  સંવત્સર ચક્ર', mai: '60-वर्षीय बृहस्पति चक्र  –  संवत्सर चक्र', mr: '60-वर्षीय गुरू चक्र  –  संवत्सर चक्र' }, locale)}
          </p>
        </div>
      </motion.div>

      <GoldDivider />

      {/* Scientific Basis */}
      <section className="my-12">
        <h2 className="text-2xl font-bold text-gold-gradient mb-6" style={headingFont}>
          {t('scientificBasis')}
        </h2>
        <div className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-8">
          <div className="prose prose-invert max-w-none text-text-secondary">
            <p className="text-lg leading-relaxed">
              {locale === 'en'
                ? `The 60-year Samvatsara cycle (Brihaspati Samvatsara Chakra) is based on the orbital period of Jupiter (~11.86 years) combined with Saturn's (~29.46 years). Jupiter takes approximately 12 years to orbit the Sun, traversing one Rashi per year. The combination of Jupiter's 12-year cycle with the 5 revolutions it takes for both Jupiter and Saturn to return to approximately the same zodiacal positions yields a 60-year super-cycle (12 x 5 = 60). Each year in this cycle has a unique name, beginning with Prabhava. The current cycle is tracked from Vikari Samvatsara (2019-20), and the system has been in continuous use for millennia.`
                : tl({ en: `षष्टिवार्षिकसंवत्सरचक्रं (बृहस्पतिसंवत्सरचक्रम्) बृहस्पतेः (~11.86 वर्षाणि) शनेश्च (~29.46 वर्षाणि) कक्षीयकालयोः आधारेण स्थितम्। बृहस्पतिः सूर्यपरिक्रमायां प्रायः 12 वर्षाणि गृह्णाति, प्रतिवर्षम् एकां राशिं पारयति। बृहस्पतेः 12-वार्षिकचक्रस्य 5 परिक्रमाणां संयोजनेन 60-वार्षिकमहाचक्रं (12 x 5 = 60) जायते।`, hi: `60-वर्षीय संवत्सर चक्र (बृहस्पति संवत्सर चक्र) बृहस्पति (~11.86 वर्ष) और शनि (~29.46 वर्ष) की कक्षीय अवधियों पर आधारित है। बृहस्पति सूर्य की परिक्रमा में लगभग 12 वर्ष लेता है, प्रति वर्ष एक राशि पार करता है। बृहस्पति के 12-वर्षीय चक्र और 5 परिक्रमाओं के संयोजन से 60-वर्षीय महाचक्र (12 x 5 = 60) बनता है। इस चक्र में प्रत्येक वर्ष का एक अद्वितीय नाम है, प्रभव से आरम्भ होकर।`, sa: `60-वर्षीय संवत्सर चक्र (बृहस्पति संवत्सर चक्र) बृहस्पति (~11.86 वर्ष) और शनि (~29.46 वर्ष) की कक्षीय अवधियों पर आधारित है। बृहस्पति सूर्य की परिक्रमा में लगभग 12 वर्ष लेता है, प्रति वर्ष एक राशि पार करता है। बृहस्पति के 12-वर्षीय चक्र और 5 परिक्रमाओं के संयोजन से 60-वर्षीय महाचक्र (12 x 5 = 60) बनता है। इस चक्र में प्रत्येक वर्ष का एक अद्वितीय नाम है, प्रभव से आरम्भ होकर।`, ta: `षष्टिवार्षिकसंवत्सरचक्रं (बृहस्पतिसंवत्सरचक्रम्) बृहस्पतेः (~11.86 वर्षाणि) शनेश्च (~29.46 वर्षाणि) कक्षीयकालयोः आधारेण स्थितम्। बृहस्पतिः सूर्यपरिक्रमायां प्रायः 12 वर्षाणि गृह्णाति, प्रतिवर्षम् एकां राशिं पारयति। बृहस्पतेः 12-वार्षिकचक्रस्य 5 परिक्रमाणां संयोजनेन 60-वार्षिकमहाचक्रं (12 x 5 = 60) जायते।`, te: `षष्टिवार्षिकसंवत्सरचक्रं (बृहस्पतिसंवत्सरचक्रम्) बृहस्पतेः (~11.86 वर्षाणि) शनेश्च (~29.46 वर्षाणि) कक्षीयकालयोः आधारेण स्थितम्। बृहस्पतिः सूर्यपरिक्रमायां प्रायः 12 वर्षाणि गृह्णाति, प्रतिवर्षम् एकां राशिं पारयति। बृहस्पतेः 12-वार्षिकचक्रस्य 5 परिक्रमाणां संयोजनेन 60-वार्षिकमहाचक्रं (12 x 5 = 60) जायते।`, bn: `षष्टिवार्षिकसंवत्सरचक्रं (बृहस्पतिसंवत्सरचक्रम्) बृहस्पतेः (~11.86 वर्षाणि) शनेश्च (~29.46 वर्षाणि) कक्षीयकालयोः आधारेण स्थितम्। बृहस्पतिः सूर्यपरिक्रमायां प्रायः 12 वर्षाणि गृह्णाति, प्रतिवर्षम् एकां राशिं पारयति। बृहस्पतेः 12-वार्षिकचक्रस्य 5 परिक्रमाणां संयोजनेन 60-वार्षिकमहाचक्रं (12 x 5 = 60) जायते।`, kn: `षष्टिवार्षिकसंवत्सरचक्रं (बृहस्पतिसंवत्सरचक्रम्) बृहस्पतेः (~11.86 वर्षाणि) शनेश्च (~29.46 वर्षाणि) कक्षीयकालयोः आधारेण स्थितम्। बृहस्पतिः सूर्यपरिक्रमायां प्रायः 12 वर्षाणि गृह्णाति, प्रतिवर्षम् एकां राशिं पारयति। बृहस्पतेः 12-वार्षिकचक्रस्य 5 परिक्रमाणां संयोजनेन 60-वार्षिकमहाचक्रं (12 x 5 = 60) जायते।`, gu: `षष्टिवार्षिकसंवत्सरचक्रं (बृहस्पतिसंवत्सरचक्रम्) बृहस्पतेः (~11.86 वर्षाणि) शनेश्च (~29.46 वर्षाणि) कक्षीयकालयोः आधारेण स्थितम्। बृहस्पतिः सूर्यपरिक्रमायां प्रायः 12 वर्षाणि गृह्णाति, प्रतिवर्षम् एकां राशिं पारयति। बृहस्पतेः 12-वार्षिकचक्रस्य 5 परिक्रमाणां संयोजनेन 60-वार्षिकमहाचक्रं (12 x 5 = 60) जायते।`, mai: `60-वर्षीय संवत्सर चक्र (बृहस्पति संवत्सर चक्र) बृहस्पति (~11.86 वर्ष) और शनि (~29.46 वर्ष) की कक्षीय अवधियों पर आधारित है। बृहस्पति सूर्य की परिक्रमा में लगभग 12 वर्ष लेता है, प्रति वर्ष एक राशि पार करता है। बृहस्पति के 12-वर्षीय चक्र और 5 परिक्रमाओं के संयोजन से 60-वर्षीय महाचक्र (12 x 5 = 60) बनता है। इस चक्र में प्रत्येक वर्ष का एक अद्वितीय नाम है, प्रभव से आरम्भ होकर।`, mr: `60-वर्षीय संवत्सर चक्र (बृहस्पति संवत्सर चक्र) बृहस्पति (~11.86 वर्ष) और शनि (~29.46 वर्ष) की कक्षीय अवधियों पर आधारित है। बृहस्पति सूर्य की परिक्रमा में लगभग 12 वर्ष लेता है, प्रति वर्ष एक राशि पार करता है। बृहस्पति के 12-वर्षीय चक्र और 5 परिक्रमाओं के संयोजन से 60-वर्षीय महाचक्र (12 x 5 = 60) बनता है। इस चक्र में प्रत्येक वर्ष का एक अद्वितीय नाम है, प्रभव से आरम्भ होकर।` }, locale)}
            </p>
            <div className="mt-6 p-4 bg-bg-primary/50 rounded-lg border border-gold-primary/10">
              <p className="text-gold-light font-mono text-sm">
                {tl({ en: 'Cycle:', hi: 'चक्र:', sa: 'चक्रम्:', ta: 'சுழற்சி:', te: 'చక్రం:', bn: 'চক্র:', kn: 'ಚಕ್ರ:', gu: 'ચક્ર:', mai: 'चक्र:', mr: 'चक्र:' }, locale)} Jupiter_orbit (~12 yr) x 5 = 60{' '}
                {tl({ en: 'years', hi: 'वर्षाणि', sa: 'वर्षाणि', ta: 'ஆண்டுகள்', te: 'సంవత్సరాలు', bn: 'বছর', kn: 'ವರ್ಷಗಳು', gu: 'વર્ષો', mai: 'वर्ष', mr: 'वर्षे' }, locale)}
              </p>
              <p className="text-gold-light/70 font-mono text-xs mt-1">
                {locale === 'en'
                  ? 'LCM(Jupiter ~12yr, Saturn ~30yr) = ~60yr'
                  : 'LCM(बृहस्पति ~12वर्ष, शनि ~30वर्ष) = ~60 वर्ष'}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 60-Year Cycle Visualization */}
      <section className="my-12">
        <h2 className="text-2xl font-bold text-gold-gradient mb-6" style={headingFont}>
          {locale === 'en'
            ? 'The 60-Year Wheel'
            : tl({ en: 'षष्टिवार्षिकचक्रम्', hi: '60-वर्षीय चक्र', sa: 'षष्टिवार्षिकचक्रम्', ta: '60 ஆண்டு சுழற்சி', te: '60-సంవత్సర చక్రం', bn: '60-বার্ষিক চক্র', kn: '60-ವರ್ಷದ ಚಕ್ರ', gu: '60-વર્ષીય ચક્ર', mai: '60-वर्षीय चक्र', mr: '60-वर्षीय चक्र' }, locale)}
        </h2>
        {/* Significance of 60 — front-and-centre so the wheel isn't just
            "60 dots in a circle" but a visual proof of the Jupiter-Saturn
            super-cycle. Two-line block: instruction + the WHY. */}
        <div className="mb-4 rounded-xl border border-gold-primary/15 bg-gradient-to-br from-[#2d1b69]/30 via-[#1a1040]/40 to-[#0a0e27] px-4 py-3">
          {/* Why-60 + click-instruction strings — tl() handles all 10 locales;
              en: must hold real English so any locale without a translation
              falls back to English (per CLAUDE.md lesson J), not Sanskrit. */}
          <p className="text-gold-light text-sm font-medium mb-1">
            {tl({
              en: 'Why 60? — Jupiter orbits the Sun every ~12 years; Saturn every ~30. After exactly 60 years both planets return close to their starting positions, completing the great Jupiter–Saturn super-cycle. Every year in this cycle has its own name and character.',
              hi: '60 क्यों? — बृहस्पति सूर्य की परिक्रमा ~12 वर्ष में करता है; शनि ~30 वर्ष में। ठीक 60 वर्ष बाद दोनों ग्रह अपनी आरम्भिक स्थिति के निकट लौटते हैं, और बृहस्पति-शनि का महाचक्र पूर्ण होता है। इस चक्र के हर वर्ष का अपना नाम और स्वभाव है।',
              sa: 'किमर्थं षष्टिः? — बृहस्पतिः सूर्यपरिक्रमायां प्रायः 12 वर्षाणि गृह्णाति; शनिः ~30 वर्षाणि। षष्टिवर्षानन्तरं उभौ ग्रहौ आरम्भस्थानसमीपं प्रत्यागच्छतः, बृहस्पति-शनिमहाचक्रं पूर्णं भवति।',
              ta: 'ஏன் 60? — குரு சூரியனை ~12 ஆண்டுகளில் சுற்றுகிறான்; சனி ~30 ஆண்டுகளில். சரியாக 60 ஆண்டுகளுக்குப் பிறகு இரண்டு கிரகங்களும் தங்கள் தொடக்க நிலைக்கு அருகில் திரும்புகின்றன, குரு-சனி பெருஞ்சுழற்சியை முடிக்கின்றன।',
              te: '60 ఎందుకు? — గురు సూర్యుని ~12 సంవత్సరాలకు ఒకసారి, శని ~30 సంవత్సరాలకు ఒకసారి పరిభ్రమిస్తారు. ఖచ్చితంగా 60 సంవత్సరాల తర్వాత ఇద్దరూ తమ ప్రారంభ స్థానాలకు దగ్గరగా తిరిగి వస్తారు, గురు-శని మహాచక్రాన్ని పూర్తి చేస్తారు।',
              bn: '60 কেন? — বৃহস্পতি ~12 বছরে সূর্যকে প্রদক্ষিণ করে; শনি ~30 বছরে। ঠিক 60 বছর পর উভয় গ্রহই তাদের সূচনা অবস্থানের কাছাকাছি ফিরে আসে, বৃহস্পতি-শনি মহাচক্র সম্পূর্ণ হয়।',
              kn: 'ಏಕೆ 60? — ಗುರು ಸೂರ್ಯನನ್ನು ~12 ವರ್ಷಗಳಿಗೊಮ್ಮೆ ಸುತ್ತುತ್ತಾನೆ; ಶನಿ ~30 ವರ್ಷಗಳಿಗೊಮ್ಮೆ. ನಿಖರವಾಗಿ 60 ವರ್ಷಗಳ ನಂತರ ಎರಡೂ ಗ್ರಹಗಳು ತಮ್ಮ ಪ್ರಾರಂಭದ ಸ್ಥಾನಗಳಿಗೆ ಹತ್ತಿರ ಮರಳುತ್ತವೆ, ಗುರು-ಶನಿ ಮಹಾಚಕ್ರವನ್ನು ಪೂರ್ಣಗೊಳಿಸುತ್ತವೆ।',
              gu: 'કેમ 60? — ગુરુ સૂર્યની પરિક્રમા ~12 વર્ષમાં કરે છે; શની ~30 વર્ષમાં. બરાબર 60 વર્ષ પછી બંને ગ્રહો તેમની પ્રારંભિક સ્થિતિની નજીક પાછા ફરે છે, ગુરુ-શની મહાચક્ર પૂર્ણ થાય છે.',
              mai: '60 किएक? — बृहस्पति सूर्यक परिक्रमा ~12 वर्षमे करैत अछि; शनि ~30 वर्षमे। ठीक 60 वर्ष बाद दुनू ग्रह अपन आरम्भिक स्थानके नजदीक घुरि अबैत अछि, बृहस्पति-शनिक महाचक्र पूर्ण भ जाइत अछि।',
              mr: '60 का? — गुरू सूर्याची प्रदक्षिणा ~12 वर्षांत करतो; शनी ~30 वर्षांत. नक्की 60 वर्षांनंतर दोन्ही ग्रह त्यांच्या आरंभिक स्थानाजवळ परत येतात, गुरू-शनी महाचक्र पूर्ण होते.',
            }, locale)}
          </p>
          <p className="text-text-secondary text-xs">
            {tl({
              en: 'Click any year marker on the wheel to see its Samvatsara name and meaning.',
              hi: 'नाम देखने के लिए चक्र में किसी भी वर्ष पर क्लिक करें।',
              sa: 'नाम द्रष्टुं चक्रे कस्मिन् अपि वर्षे क्लिक्यताम्।',
              ta: 'பெயரைக் காண சுழற்சியில் எந்த வருடத்திலும் கிளிக் செய்யவும்.',
              te: 'పేరు చూడడానికి చక్రంలో ఏ సంవత్సరంపైనైనా క్లిక్ చేయండి.',
              bn: 'নাম দেখতে চক্রে যেকোনো বছরে ক্লিক করুন।',
              kn: 'ಹೆಸರು ನೋಡಲು ಚಕ್ರದಲ್ಲಿ ಯಾವುದೇ ವರ್ಷದ ಮೇಲೆ ಕ್ಲಿಕ್ ಮಾಡಿ.',
              gu: 'નામ જોવા ચક્રમાં કોઈ પણ વર્ષ પર ક્લિક કરો.',
              mai: 'नाम देखबाक लेल चक्रमे कोनो वर्षपर क्लिक करू।',
              mr: 'नाव पाहण्यासाठी चक्रातील कोणत्याही वर्षावर क्लिक करा.',
            }, locale)}
          </p>
        </div>
        <div className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-8 flex flex-col items-center gap-6">
          <AnimatedSamvatsaraWheel
            locale={locale}
            selected={selectedIndex}
            onSelect={setSelectedIndex}
          />

          {/* ---- Selected samvatsara detail panel ---- */}
          <AnimatePresence mode="wait">
            {selectedIndex !== null && (
              <motion.div
                key={selectedIndex}
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.95 }}
                transition={{ duration: 0.3 }}
                className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-6 w-full max-w-md text-center"
              >
                <div
                  className="text-3xl font-bold mb-1"
                  style={{ color: yugaColors[Math.floor(selectedIndex / 12)] }}
                >
                  #{selectedIndex + 1}
                </div>
                <div
                  className="text-gold-light text-xl font-semibold"
                  style={
                    isDevanagari
                      ? { fontFamily: 'var(--font-devanagari-heading)' }
                      : { fontFamily: 'var(--font-heading)' }
                  }
                >
                  {tl(SAMVATSARA_NAMES[selectedIndex], locale)}
                </div>
                <div className="text-text-secondary text-sm mt-2">
                  {tl(yugaNames[Math.floor(selectedIndex / 12)], locale)}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      <GoldDivider />

      {/* Complete Listing */}
      <section className="my-12">
        <h2 className="text-2xl font-bold text-gold-gradient mb-6" style={headingFont}>
          {t('completeListing')}
        </h2>

        {yugaNames.map((yuga, yugaIdx) => (
          <div key={yugaIdx} className="mb-8">
            <h3 className="text-xl text-gold-light mb-4" style={headingFont}>
              {tl(yuga, locale)}
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
              {SAMVATSARA_NAMES.slice(yugaIdx * 12, (yugaIdx + 1) * 12).map((s, i) => {
                const globalIndex = yugaIdx * 12 + i;
                const isActive = selectedIndex === globalIndex;
                return (
                  <motion.div
                    key={globalIndex}
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    whileHover={{ scale: 1.05 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.02 }}
                    onClick={() => setSelectedIndex(globalIndex)}
                    className={`bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-lg p-3 text-center cursor-pointer transition-colors ${
                      isActive ? 'ring-2 ring-gold-primary/60' : ''
                    }`}
                  >
                    <div
                      className="text-lg mb-0.5"
                      style={{ color: yugaColors[yugaIdx] }}
                    >
                      {globalIndex + 1}
                    </div>
                    <div
                      className="text-gold-light font-semibold text-xs"
                      style={
                        isDevanagari
                          ? { fontFamily: 'var(--font-devanagari-heading)' }
                          : undefined
                      }
                    >
                      {tl(s, locale)}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        ))}
      </section>

      <AuthorByline />
    </div>
  );
}
