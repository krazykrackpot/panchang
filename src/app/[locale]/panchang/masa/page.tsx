'use client';

import { useTranslations, useLocale } from 'next-intl';
import { motion } from 'framer-motion';
import { Link } from '@/lib/i18n/navigation';
import GoldDivider from '@/components/ui/GoldDivider';
import { MASA_NAMES, RITU_NAMES } from '@/lib/ephem/astronomical';
import type { Locale } from '@/types/panchang';
import { ArrowLeft } from 'lucide-react';
import { MasaIcon } from '@/components/icons/PanchangIcons';

const MASA_DETAILS: { gregApprox: string; nakshatraLink: string }[] = [
  { gregApprox: 'Mar-Apr', nakshatraLink: 'Chitra' },
  { gregApprox: 'Apr-May', nakshatraLink: 'Vishakha' },
  { gregApprox: 'May-Jun', nakshatraLink: 'Jyeshtha' },
  { gregApprox: 'Jun-Jul', nakshatraLink: 'Purva Ashadha' },
  { gregApprox: 'Jul-Aug', nakshatraLink: 'Shravana' },
  { gregApprox: 'Aug-Sep', nakshatraLink: 'Purva Bhadrapada' },
  { gregApprox: 'Sep-Oct', nakshatraLink: 'Ashwini' },
  { gregApprox: 'Oct-Nov', nakshatraLink: 'Krittika' },
  { gregApprox: 'Nov-Dec', nakshatraLink: 'Mrigashira' },
  { gregApprox: 'Dec-Jan', nakshatraLink: 'Pushya' },
  { gregApprox: 'Jan-Feb', nakshatraLink: 'Magha' },
  { gregApprox: 'Feb-Mar', nakshatraLink: 'Purva Phalguni' },
];

const rituColors = ['#4ade80', '#f97316', '#3b82f6', '#eab308', '#a78bfa', '#60a5fa'];

/* ------------------------------------------------------------------ */
/*  AnimatedAnnualWheel                                               */
/* ------------------------------------------------------------------ */
function AnimatedAnnualWheel({ locale }: { locale: Locale }) {
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
  const ringRadii = [110, 155, 185, 220];

  return (
    <motion.svg
      viewBox="0 0 500 500"
      className="w-full max-w-lg"
      initial={{ opacity: 0, rotate: -30 }}
      animate={{ opacity: 1, rotate: 0 }}
      transition={{ duration: 1.2, ease: 'easeOut' }}
    >
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

      {/* ---- Outer ring : 6 Ritu (season) arcs ---- */}
      {RITU_NAMES.map((ritu, i) => {
        const startDeg = i * 60;
        const endDeg = (i + 1) * 60;
        const midRad = ((i * 60 + 30) - 90) * Math.PI / 180;
        const arcPath = describeArc(CX, CY, 185, startDeg, endDeg);
        /* Calculate approximate arc length for strokeDasharray */
        const arcLen = (Math.PI * 185 * 60) / 180;
        const textX = CX + 200 * Math.cos(midRad);
        const textY = CY + 200 * Math.sin(midRad);

        return (
          <g key={`ritu-${i}`}>
            {/* Animated arc drawing */}
            <motion.path
              d={arcPath}
              fill="none"
              stroke={rituColors[i]}
              strokeWidth="30"
              opacity="0.15"
              strokeDasharray={arcLen}
              strokeDashoffset={arcLen}
              initial={{ strokeDashoffset: arcLen }}
              animate={{ strokeDashoffset: 0 }}
              transition={{ duration: 1.0, delay: 0.6 + i * 0.12, ease: 'easeInOut' }}
            />
            {/* Season label */}
            <motion.text
              x={textX}
              y={textY}
              fill={rituColors[i]}
              fontSize="8"
              textAnchor="middle"
              dominantBaseline="middle"
              transform={`rotate(${i * 60}, ${textX}, ${textY})`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 1.2 + i * 0.08 }}
            >
              {ritu[locale]}
            </motion.text>
          </g>
        );
      })}

      {/* ---- Inner ring : 12 Masa divisions ---- */}
      {MASA_NAMES.map((masa, i) => {
        const angle = (i * 30 - 90) * Math.PI / 180;
        const midAngle = ((i * 30 + 15) - 90) * Math.PI / 180;
        const x1 = CX + 110 * Math.cos(angle);
        const y1 = CY + 110 * Math.sin(angle);
        const x2 = CX + 155 * Math.cos(angle);
        const y2 = CY + 155 * Math.sin(angle);
        const textX = CX + 133 * Math.cos(midAngle);
        const textY = CY + 133 * Math.sin(midAngle);

        return (
          <g key={`masa-${i}`}>
            {/* Spoke line */}
            <motion.line
              x1={CX} y1={CY} x2={x2} y2={y2}
              stroke="rgba(212,168,83,0.15)"
              strokeWidth="0.5"
              initial={{ x1: CX, y1: CY, x2: CX, y2: CY }}
              animate={{ x1, y1, x2, y2 }}
              transition={{ duration: 0.6, delay: 0.8 + i * 0.04 }}
            />
            {/* Masa label (gold) */}
            <motion.text
              x={textX}
              y={textY}
              fill="#f0d48a"
              fontSize="7"
              textAnchor="middle"
              dominantBaseline="middle"
              transform={`rotate(${i * 30}, ${textX}, ${textY})`}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: 1.0 + i * 0.05 }}
            >
              {masa[locale]}
            </motion.text>
          </g>
        );
      })}

      {/* ---- Orbiting sun indicator (golden dot, ~60s) ---- */}
      <motion.circle
        r="6"
        fill="#fbbf24"
        filter="url(#sunGlow)"
        initial={{ offsetDistance: '0%' }}
        animate={{
          cx: [
            CX + 170 * Math.cos(-Math.PI / 2),
            CX + 170 * Math.cos(-Math.PI / 2 + Math.PI / 2),
            CX + 170 * Math.cos(-Math.PI / 2 + Math.PI),
            CX + 170 * Math.cos(-Math.PI / 2 + (3 * Math.PI) / 2),
            CX + 170 * Math.cos(-Math.PI / 2 + 2 * Math.PI),
          ],
          cy: [
            CY + 170 * Math.sin(-Math.PI / 2),
            CY + 170 * Math.sin(-Math.PI / 2 + Math.PI / 2),
            CY + 170 * Math.sin(-Math.PI / 2 + Math.PI),
            CY + 170 * Math.sin(-Math.PI / 2 + (3 * Math.PI) / 2),
            CY + 170 * Math.sin(-Math.PI / 2 + 2 * Math.PI),
          ],
        }}
        transition={{
          duration: 60,
          repeat: Infinity,
          ease: 'linear',
        }}
      />
      {/* Glow filter for sun */}
      <defs>
        <filter id="sunGlow">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* ---- Animated center labels ---- */}
      <motion.text
        x={CX} y={CY - 10}
        fill="#f0d48a"
        fontSize="12"
        textAnchor="middle"
        fontFamily="var(--font-heading)"
        initial={{ opacity: 0, y: CY }}
        animate={{ opacity: 1, y: CY - 10 }}
        transition={{ duration: 0.8, delay: 1.4 }}
      >
        {(locale !== 'hi' && String(locale) !== 'sa') ? 'LUNISOLAR' : locale === 'hi' ? 'चान्द्र-सौर' : 'चान्द्रसौरम्'}
      </motion.text>
      <motion.text
        x={CX} y={CY + 8}
        fill="rgba(212,168,83,0.5)"
        fontSize="9"
        textAnchor="middle"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 1.6 }}
      >
        {(locale !== 'hi' && String(locale) !== 'sa') ? '12 Months x 6 Seasons' : '12 मास x 6 ऋतु'}
      </motion.text>
    </motion.svg>
  );
}

/* ================================================================== */
/*  Page                                                              */
/* ================================================================== */
export default function MasaPage() {
  const t = useTranslations('deepDive');
  const locale = useLocale() as Locale;
  const isTamil = String(locale) === 'ta';
  const isDevanagari = (locale === 'hi' || String(locale) === 'sa');
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
        <MasaIcon size={72} />
        <div>
          <h1 className="text-4xl sm:text-5xl font-bold mb-4" style={headingFont}>
            <span className="text-gold-gradient">
              {isTamil
                ? 'மாசம் & பருவம்'
                : locale === 'en'
                ? 'Masa & Ritu'
                : locale === 'hi'
                ? 'मास एवं ऋतु'
                : 'मासः ऋतुश्च'}
            </span>
          </h1>
          <p
            className="text-text-secondary text-lg"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            {isTamil
              ? '12 மாதங்கள் மற்றும் 6 பருவங்கள் — சந்திர-சூரிய நாட்காட்டி'
              : locale === 'en'
              ? '12 Months and 6 Seasons — The Lunisolar Calendar'
              : locale === 'hi'
              ? '12 मास और 6 ऋतुएँ — चान्द्र-सौर पञ्चाङ्ग'
              : 'द्वादश मासाः षड् ऋतवश्च — चान्द्रसौरपञ्चाङ्गम्'}
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
                ? `The Hindu calendar is lunisolar. Months (Masa) are primarily lunar — each month spans one New Moon to the next (Amanta system) or one Full Moon to the next (Purnimanta system). The month name is derived from the Nakshatra in which the Full Moon falls. Seasons (Ritu) follow the solar cycle: 6 Ritus of 2 months each track the Sun's progression through the zodiac. A solar year has ~365.25 days, while 12 lunar months total only ~354 days. The ~11-day gap is resolved by intercalation — an extra "Adhika Masa" (leap month) is inserted roughly every 2.7 years when two New Moons fall within the same solar month.`
                : locale === 'hi'
                ? `हिन्दू पञ्चाङ्ग चान्द्र-सौर है। मास मुख्यतः चान्द्र हैं — प्रत्येक मास एक अमावस्या से अगली तक (अमान्त) या एक पूर्णिमा से अगली तक (पूर्णिमान्त) होता है। मास का नाम उस नक्षत्र से आता है जिसमें पूर्णिमा पड़ती है। ऋतुएँ सौर चक्र का अनुसरण करती हैं: 2-2 मास की 6 ऋतुएँ। सौर वर्ष ~365.25 दिन और 12 चान्द्र मास ~354 दिन होते हैं। ~11 दिन का अन्तर अधिक मास (लौंद मास) से पूरा किया जाता है, जो लगभग हर 2.7 वर्ष में जुड़ता है।`
                : `हिन्दूपञ्चाङ्गं चान्द्रसौरम्। मासाः मुख्यतः चान्द्राः — प्रत्येकं मासः एकामावस्यातः अपरामावस्यापर्यन्तम् (अमान्तपद्धतिः) भवति। मासनाम तस्मात् नक्षत्रात् आगच्छति यस्मिन् पूर्णिमा पतति। ऋतवः सौरचक्रम् अनुसरन्ति — द्वौ-द्वौ मासयोः 6 ऋतवः।`}
            </p>
            <div className="mt-6 p-4 bg-bg-primary/50 rounded-lg border border-gold-primary/10">
              <p className="text-gold-light font-mono text-sm">
                {(locale !== 'hi' && String(locale) !== 'sa') ? 'Lunar year:' : 'चान्द्र वर्ष:'} 12 x 29.53 = ~354.36{' '}
                {(locale !== 'hi' && String(locale) !== 'sa') ? 'days' : 'दिन'}
              </p>
              <p className="text-gold-light/70 font-mono text-xs mt-1">
                {locale === 'en'
                  ? 'Solar year: ~365.25 days | Gap: ~11 days (Adhika Masa correction)'
                  : 'सौर वर्ष: ~365.25 दिन | अन्तर: ~11 दिन (अधिक मास सुधार)'}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Month-Season Wheel Visualization */}
      <section className="my-12">
        <h2 className="text-2xl font-bold text-gold-gradient mb-6" style={headingFont}>
          {locale === 'en'
            ? 'Annual Cycle — Months & Seasons'
            : locale === 'hi'
            ? 'वार्षिक चक्र — मास और ऋतु'
            : 'वार्षिकचक्रम् — मासाः ऋतवश्च'}
        </h2>
        <div className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-8 flex justify-center">
          <AnimatedAnnualWheel locale={locale} />
        </div>
      </section>

      <GoldDivider />

      {/* Complete Listing - Months */}
      <section className="my-12">
        <h2 className="text-2xl font-bold text-gold-gradient mb-6" style={headingFont}>
          {t('completeListing')}
        </h2>

        <h3 className="text-xl text-gold-light mb-4" style={headingFont}>
          {locale === 'en'
            ? '12 Lunar Months (Masa)'
            : locale === 'hi'
            ? '12 चान्द्र मास'
            : 'द्वादश चान्द्रमासाः'}
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 mb-10">
          {MASA_NAMES.map((masa, i) => {
            const rituIndex = Math.floor(i / 2);
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                whileHover={{ scale: 1.05 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.03 }}
                className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-lg p-4 text-center cursor-default"
              >
                <div className="text-gold-primary text-2xl mb-1">{i + 1}</div>
                <div
                  className="text-gold-light font-semibold text-sm"
                  style={
                    isDevanagari
                      ? { fontFamily: 'var(--font-devanagari-heading)' }
                      : undefined
                  }
                >
                  {masa[locale]}
                </div>
                <div className="text-text-secondary text-xs mt-1 font-mono">
                  {MASA_DETAILS[i].gregApprox}
                </div>
                <div className="text-xs mt-1" style={{ color: rituColors[rituIndex] }}>
                  {RITU_NAMES[rituIndex][locale]}
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* 6 Seasons */}
        <h3 className="text-xl text-gold-light mb-4" style={headingFont}>
          {(locale !== 'hi' && String(locale) !== 'sa') ? '6 Seasons (Ritu)' : locale === 'hi' ? '6 ऋतुएँ' : 'षड् ऋतवः'}
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {RITU_NAMES.map((ritu, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              whileHover={{ scale: 1.05 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-lg p-5 text-center cursor-default"
            >
              <div className="text-2xl mb-2" style={{ color: rituColors[i] }}>
                {i + 1}
              </div>
              <div
                className="text-gold-light font-semibold"
                style={
                  isDevanagari
                    ? { fontFamily: 'var(--font-devanagari-heading)' }
                    : undefined
                }
              >
                {ritu[locale]}
              </div>
              <div
                className="text-text-secondary text-xs mt-2"
                style={
                  isDevanagari
                    ? { fontFamily: 'var(--font-devanagari-body)' }
                    : undefined
                }
              >
                {MASA_NAMES[i * 2][locale]} &ndash; {MASA_NAMES[i * 2 + 1][locale]}
              </div>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
}
