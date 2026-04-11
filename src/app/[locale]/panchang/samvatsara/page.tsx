'use client';

import { useState } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from '@/lib/i18n/navigation';
import GoldDivider from '@/components/ui/GoldDivider';
import { SAMVATSARA_NAMES } from '@/lib/ephem/astronomical';
import type { Locale } from '@/types/panchang';
import { ArrowLeft } from 'lucide-react';
import { SamvatsaraIcon } from '@/components/icons/PanchangIcons';

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
  const CX = 250;
  const CY = 250;

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
      viewBox="0 0 500 500"
      className="w-full max-w-lg"
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

      {/* ---- 60 year markers (staggered reveal) ---- */}
      {SAMVATSARA_NAMES.map((s, i) => {
        const angle = (i * sectorAngle - 90) * Math.PI / 180;
        const midAngle = ((i * sectorAngle + sectorAngle / 2) - 90) * Math.PI / 180;
        const x1 = CX + 190 * Math.cos(angle);
        const y1 = CY + 190 * Math.sin(angle);
        const x2 = CX + 230 * Math.cos(angle);
        const y2 = CY + 230 * Math.sin(angle);
        const textX = CX + 210 * Math.cos(midAngle);
        const textY = CY + 210 * Math.sin(midAngle);
        const yugaIndex = Math.floor(i / 12);
        const isSelected = selected === i;

        return (
          <g
            key={`marker-${i}`}
            onClick={() => onSelect(i)}
            style={{ cursor: 'pointer' }}
          >
            {/* Tick line */}
            <motion.line
              x1={x1} y1={y1} x2={x2} y2={y2}
              stroke={isSelected ? '#fbbf24' : 'rgba(212,168,83,0.1)'}
              strokeWidth={isSelected ? 1.5 : 0.5}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3, delay: 1.2 + i * 0.02 }}
            />
            {/* Number label */}
            <motion.text
              x={textX}
              y={textY}
              fill={isSelected ? '#fbbf24' : yugaColors[yugaIndex]}
              fontSize={isSelected ? '6' : '4'}
              fontWeight={isSelected ? 'bold' : 'normal'}
              textAnchor="middle"
              dominantBaseline="middle"
              transform={`rotate(${i * sectorAngle}, ${textX}, ${textY})`}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
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
        x={CX} y={CY - 15}
        fill="#f0d48a"
        fontSize="14"
        textAnchor="middle"
        fontFamily="var(--font-heading)"
        initial={{ opacity: 0, y: CY }}
        animate={{ opacity: 1, y: CY - 15 }}
        transition={{ duration: 0.8, delay: 1.6 }}
      >
        {locale === 'en' || String(locale) === 'ta' ? '60' : '६०'}
      </motion.text>
      <motion.text
        x={CX} y={CY + 5}
        fill="#d4a853"
        fontSize="9"
        textAnchor="middle"
        fontFamily="var(--font-heading)"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 1.8 }}
      >
        {locale === 'en' || String(locale) === 'ta' ? 'Samvatsaras' : 'संवत्सराः'}
      </motion.text>
      <motion.text
        x={CX} y={CY + 20}
        fill="#8a6d2b"
        fontSize="7"
        textAnchor="middle"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 2.0 }}
      >
        {locale === 'en' || String(locale) === 'ta' ? 'Jupiter-Saturn Cycle' : 'बृहस्पति-शनि चक्र'}
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
  const isDevanagari = locale !== 'en';
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
                : locale === 'hi'
                ? 'संवत्सर'
                : 'संवत्सरः'}
            </span>
          </h1>
          <p
            className="text-text-secondary text-lg"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            {locale === 'en'
              ? 'The 60-Year Jovian Cycle — Brihaspati Samvatsara Chakra'
              : locale === 'hi'
              ? '60-वर्षीय बृहस्पति चक्र — संवत्सर चक्र'
              : 'षष्टिवार्षिकबृहस्पतिचक्रम् — संवत्सरचक्रम्'}
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
                : locale === 'hi'
                ? `60-वर्षीय संवत्सर चक्र (बृहस्पति संवत्सर चक्र) बृहस्पति (~11.86 वर्ष) और शनि (~29.46 वर्ष) की कक्षीय अवधियों पर आधारित है। बृहस्पति सूर्य की परिक्रमा में लगभग 12 वर्ष लेता है, प्रति वर्ष एक राशि पार करता है। बृहस्पति के 12-वर्षीय चक्र और 5 परिक्रमाओं के संयोजन से 60-वर्षीय महाचक्र (12 x 5 = 60) बनता है। इस चक्र में प्रत्येक वर्ष का एक अद्वितीय नाम है, प्रभव से आरम्भ होकर।`
                : `षष्टिवार्षिकसंवत्सरचक्रं (बृहस्पतिसंवत्सरचक्रम्) बृहस्पतेः (~11.86 वर्षाणि) शनेश्च (~29.46 वर्षाणि) कक्षीयकालयोः आधारेण स्थितम्। बृहस्पतिः सूर्यपरिक्रमायां प्रायः 12 वर्षाणि गृह्णाति, प्रतिवर्षम् एकां राशिं पारयति। बृहस्पतेः 12-वार्षिकचक्रस्य 5 परिक्रमाणां संयोजनेन 60-वार्षिकमहाचक्रं (12 x 5 = 60) जायते।`}
            </p>
            <div className="mt-6 p-4 bg-bg-primary/50 rounded-lg border border-gold-primary/10">
              <p className="text-gold-light font-mono text-sm">
                {locale === 'en' || String(locale) === 'ta' ? 'Cycle:' : 'चक्र:'} Jupiter_orbit (~12 yr) x 5 = 60{' '}
                {locale === 'en' || String(locale) === 'ta' ? 'years' : 'वर्षाणि'}
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
            : locale === 'hi'
            ? '60-वर्षीय चक्र'
            : 'षष्टिवार्षिकचक्रम्'}
        </h2>
        <p className="text-text-secondary text-sm mb-4">
          {locale === 'en'
            ? 'Click on any year marker in the wheel to see its name.'
            : locale === 'hi'
            ? 'नाम देखने के लिए चक्र में किसी भी वर्ष पर क्लिक करें।'
            : 'नाम द्रष्टुं चक्रे कस्मिन् अपि वर्षे क्लिक्यताम्।'}
        </p>
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
                  {SAMVATSARA_NAMES[selectedIndex][locale]}
                </div>
                <div className="text-text-secondary text-sm mt-2">
                  {yugaNames[Math.floor(selectedIndex / 12)][locale]}
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
              {yuga[locale]}
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
                      {s[locale]}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        ))}
      </section>
    </div>
  );
}
