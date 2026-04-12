'use client';

import { useState } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { motion } from 'framer-motion';
import { Link } from '@/lib/i18n/navigation';
import GoldDivider from '@/components/ui/GoldDivider';
import { RASHIS } from '@/lib/constants/rashis';
import type { Rashi, Locale } from '@/types/panchang';
import { ArrowLeft } from 'lucide-react';
import { RashiIcon } from '@/components/icons/PanchangIcons';
import { RashiIconById } from '@/components/icons/RashiIcons';

/* ─── Element helpers ────────────────────────────────────────────── */

const ELEMENT_HEX: Record<string, string> = {
  Fire: '#fb923c',
  Earth: '#4ade80',
  Air: '#22d3ee',
  Water: '#60a5fa',
};
const ELEMENT_HEX_DIM: Record<string, string> = {
  Fire: 'rgba(251,146,60,0.18)',
  Earth: 'rgba(74,222,128,0.18)',
  Air: 'rgba(34,211,238,0.18)',
  Water: 'rgba(96,165,250,0.18)',
};
const elementTextColor: Record<string, string> = {
  Fire: 'text-orange-400',
  Earth: 'text-emerald-400',
  Air: 'text-cyan-400',
  Water: 'text-blue-400',
};
const elementBorders: Record<string, string> = {
  Fire: 'border-orange-500/20',
  Earth: 'border-emerald-500/20',
  Air: 'border-cyan-500/20',
  Water: 'border-blue-500/20',
};
const ELEMENT_LABELS: { key: string; label: Record<Locale, string> }[] = [
  { key: 'Fire', label: { en: 'Fire', hi: 'अग्नि', sa: 'अग्निः' } },
  { key: 'Earth', label: { en: 'Earth', hi: 'पृथ्वी', sa: 'पृथिवी' } },
  { key: 'Air', label: { en: 'Air', hi: 'वायु', sa: 'वायुः' } },
  { key: 'Water', label: { en: 'Water', hi: 'जल', sa: 'जलम्' } },
];

/* ─── AnimatedZodiacWheel ────────────────────────────────────────── */

function AnimatedZodiacWheel({
  locale,
  selectedRashi,
  onSelect,
}: {
  locale: Locale;
  selectedRashi: Rashi | null;
  onSelect: (r: Rashi) => void;
}) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const CX = 250;
  const CY = 250;
  const INNER_R = 130;
  const OUTER_R = 220;
  const SECTOR = 30;

  return (
    <motion.svg
      viewBox="0 0 500 500"
      className="w-full max-w-lg"
      initial={{ opacity: 0, rotate: -30 }}
      animate={{ opacity: 1, rotate: 0 }}
      transition={{ duration: 1.2, ease: 'easeOut' }}
    >
      <defs>
        <filter id="glow-sector">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <radialGradient id="center-glow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="rgba(240,212,138,0.12)" />
          <stop offset="100%" stopColor="rgba(240,212,138,0)" />
        </radialGradient>
      </defs>

      {/* Subtle center glow */}
      <circle cx={CX} cy={CY} r={INNER_R - 10} fill="url(#center-glow)" />

      {/* Animated concentric rings */}
      {[OUTER_R + 8, OUTER_R, INNER_R, INNER_R - 20, 70].map((r, i) => (
        <motion.circle
          key={`ring-${i}`}
          cx={CX}
          cy={CY}
          r={r}
          fill="none"
          stroke="rgba(212,168,83,0.12)"
          strokeWidth={i === 1 || i === 2 ? 1.5 : 0.5}
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.15 * i, ease: 'easeOut' }}
        />
      ))}

      {/* Slow rotating outer decorative ring */}
      <motion.g
        animate={{ rotate: 360 }}
        transition={{ duration: 120, repeat: Infinity, ease: 'linear' }}
        style={{ transformOrigin: `${CX}px ${CY}px` }}
      >
        {Array.from({ length: 72 }).map((_, i) => {
          const a = (i * 5 - 90) * (Math.PI / 180);
          const r1 = OUTER_R + 4;
          const r2 = OUTER_R + (i % 6 === 0 ? 14 : 8);
          return (
            <line
              key={`tick-${i}`}
              x1={CX + r1 * Math.cos(a)}
              y1={CY + r1 * Math.sin(a)}
              x2={CX + r2 * Math.cos(a)}
              y2={CY + r2 * Math.sin(a)}
              stroke="rgba(212,168,83,0.15)"
              strokeWidth={i % 6 === 0 ? 1 : 0.4}
            />
          );
        })}
      </motion.g>

      {/* 12 Rashi sectors */}
      {RASHIS.map((rashi, i) => {
        const startAngle = i * SECTOR;
        const endAngle = (i + 1) * SECTOR;
        const midAngleRad = ((startAngle + SECTOR / 2 - 90) * Math.PI) / 180;
        const isHovered = hoveredIndex === i;
        const isSelected = selectedRashi?.id === rashi.id;
        const elemColor = ELEMENT_HEX[rashi.element.en] || '#f0d48a';
        const elemDim = ELEMENT_HEX_DIM[rashi.element.en] || 'rgba(240,212,138,0.1)';

        // Sector arc path (wedge)
        const rad = (a: number) => ((a - 90) * Math.PI) / 180;
        const ix1 = CX + INNER_R * Math.cos(rad(startAngle));
        const iy1 = CY + INNER_R * Math.sin(rad(startAngle));
        const ix2 = CX + INNER_R * Math.cos(rad(endAngle));
        const iy2 = CY + INNER_R * Math.sin(rad(endAngle));
        const ox1 = CX + OUTER_R * Math.cos(rad(startAngle));
        const oy1 = CY + OUTER_R * Math.sin(rad(startAngle));
        const ox2 = CX + OUTER_R * Math.cos(rad(endAngle));
        const oy2 = CY + OUTER_R * Math.sin(rad(endAngle));

        const wedgePath = [
          `M ${ix1} ${iy1}`,
          `L ${ox1} ${oy1}`,
          `A ${OUTER_R} ${OUTER_R} 0 0 1 ${ox2} ${oy2}`,
          `L ${ix2} ${iy2}`,
          `A ${INNER_R} ${INNER_R} 0 0 0 ${ix1} ${iy1}`,
          'Z',
        ].join(' ');

        // Symbol position (outer half of band)
        const symbolR = INNER_R + (OUTER_R - INNER_R) * 0.65;
        const symbolX = CX + symbolR * Math.cos(midAngleRad);
        const symbolY = CY + symbolR * Math.sin(midAngleRad);

        // Name position (inner half of band)
        const nameR = INNER_R + (OUTER_R - INNER_R) * 0.3;
        const nameX = CX + nameR * Math.cos(midAngleRad);
        const nameY = CY + nameR * Math.sin(midAngleRad);

        // Spoke line
        const spokeX1 = CX + INNER_R * Math.cos(rad(startAngle));
        const spokeY1 = CY + INNER_R * Math.sin(rad(startAngle));
        const spokeX2 = CX + OUTER_R * Math.cos(rad(startAngle));
        const spokeY2 = CY + OUTER_R * Math.sin(rad(startAngle));

        return (
          <motion.g
            key={rashi.id}
            onMouseEnter={() => setHoveredIndex(i)}
            onMouseLeave={() => setHoveredIndex(null)}
            onClick={() => onSelect(rashi)}
            style={{ cursor: 'pointer' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.08 * i }}
          >
            {/* Sector wedge fill */}
            <motion.path
              d={wedgePath}
              fill={isSelected ? elemDim.replace('0.18', '0.35') : elemDim}
              stroke={elemColor}
              strokeWidth={isSelected ? 1.5 : 0.3}
              strokeOpacity={isSelected ? 0.8 : 0.3}
              animate={{
                scale: isHovered ? 1.04 : 1,
                filter: isHovered ? 'brightness(1.6)' : 'brightness(1)',
              }}
              transition={{ duration: 0.2 }}
              style={{ transformOrigin: `${symbolX}px ${symbolY}px` }}
            />

            {/* Spoke line */}
            <line
              x1={spokeX1} y1={spokeY1}
              x2={spokeX2} y2={spokeY2}
              stroke="rgba(212,168,83,0.2)"
              strokeWidth="0.5"
            />

            {/* Rashi symbol */}
            <motion.text
              x={symbolX}
              y={symbolY}
              fill={elemColor}
              fontSize={isHovered || isSelected ? '22' : '18'}
              textAnchor="middle"
              dominantBaseline="middle"
              filter={isHovered || isSelected ? 'url(#glow-sector)' : undefined}
              animate={{ scale: isHovered ? 1.2 : 1 }}
              transition={{ duration: 0.2 }}
            >
              {rashi.symbol}
            </motion.text>

            {/* Rashi name */}
            <text
              x={nameX}
              y={nameY}
              fill={isSelected ? '#f0d48a' : 'rgba(240,212,138,0.7)'}
              fontSize="7"
              textAnchor="middle"
              dominantBaseline="middle"
              transform={`rotate(${startAngle + SECTOR / 2}, ${nameX}, ${nameY})`}
            >
              {rashi.name[locale]}
            </text>
          </motion.g>
        );
      })}

      {/* Center text */}
      <text x={CX} y={CY - 14} fill="#f0d48a" fontSize="12" textAnchor="middle" fontFamily="var(--font-heading)">
        {(locale !== 'hi' && String(locale) !== 'sa') ? 'RASHI CHAKRA' : locale === 'hi' ? 'राशि चक्र' : 'राशिचक्रम्'}
      </text>
      <text x={CX} y={CY + 4} fill="rgba(212,168,83,0.5)" fontSize="9" textAnchor="middle">
        360° / 12 = 30°
      </text>
      <text x={CX} y={CY + 18} fill="rgba(212,168,83,0.3)" fontSize="7" textAnchor="middle">
        {(locale !== 'hi' && String(locale) !== 'sa') ? 'Click a sign' : locale === 'hi' ? 'राशि चुनें' : 'राशिं चिनुत'}
      </text>
    </motion.svg>
  );
}

/* ─── Element Legend ──────────────────────────────────────────────── */

function ElementLegend({ locale }: { locale: Locale }) {
  return (
    <motion.div
      className="flex flex-wrap justify-center gap-4 mt-6"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1.0, duration: 0.6 }}
    >
      {ELEMENT_LABELS.map((el) => (
        <div key={el.key} className="flex items-center gap-2">
          <span
            className="inline-block w-3 h-3 rounded-full"
            style={{ backgroundColor: ELEMENT_HEX[el.key], boxShadow: `0 0 6px ${ELEMENT_HEX[el.key]}40` }}
          />
          <span className="text-text-secondary text-xs">{el.label[locale]}</span>
        </div>
      ))}
    </motion.div>
  );
}

/* ─── Ecliptic Diagram ───────────────────────────────────────────── */

function EclipticDiagram({ locale }: { locale: Locale }) {
  const AYANAMSHA = 24.17; // approximate current value in degrees
  const BAR_WIDTH = 720; // viewBox width for the bar
  const BAR_HEIGHT = 50;
  const SEGMENT_WIDTH = BAR_WIDTH / 12;

  return (
    <motion.div
      className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-6 sm:p-8"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.7 }}
    >
      <h3 className="text-lg font-semibold text-gold-light mb-2">
        {(locale !== 'hi' && String(locale) !== 'sa') ? 'Sidereal vs Tropical Ecliptic' : locale === 'hi' ? 'नाक्षत्रिक बनाम उष्णकटिबन्धीय क्रान्तिवृत्त' : 'नाक्षत्रिकं उष्णकटिबन्धीयं च क्रान्तिवृत्तम्'}
      </h3>
      <p className="text-text-secondary text-sm mb-4">
        {locale === 'en'
          ? `The Ayanamsha correction (~${AYANAMSHA.toFixed(1)}°) shifts the sidereal zodiac relative to the tropical one. Below, the colored bar is the sidereal zodiac; the pointer shows where 0° Aries (tropical) falls in the sidereal frame.`
          : locale === 'hi'
          ? `अयनांश सुधार (~${AYANAMSHA.toFixed(1)}°) नाक्षत्रिक राशिचक्र को उष्णकटिबन्धीय के सापेक्ष स्थानान्तरित करता है।`
          : `अयनांशशोधनं (~${AYANAMSHA.toFixed(1)}°) नाक्षत्रिकराशिचक्रम् उष्णकटिबन्धीयस्य सापेक्षं स्थानान्तरयति।`}
      </p>

      <svg viewBox={`0 0 ${BAR_WIDTH} ${BAR_HEIGHT + 60}`} className="w-full" preserveAspectRatio="xMidYMid meet">
        {/* 12 colored segments — sidereal zodiac bar */}
        {RASHIS.map((rashi, i) => {
          const color = ELEMENT_HEX_DIM[rashi.element.en] || 'rgba(240,212,138,0.1)';
          const strokeColor = ELEMENT_HEX[rashi.element.en] || '#f0d48a';
          return (
            <g key={rashi.id}>
              <motion.rect
                x={i * SEGMENT_WIDTH}
                y={20}
                width={SEGMENT_WIDTH}
                height={BAR_HEIGHT}
                fill={color}
                stroke={strokeColor}
                strokeWidth="0.5"
                strokeOpacity={0.4}
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: 0.04 * i }}
                style={{ transformOrigin: `${i * SEGMENT_WIDTH}px ${20 + BAR_HEIGHT / 2}px` }}
              />
              {/* Rashi symbol */}
              <text
                x={i * SEGMENT_WIDTH + SEGMENT_WIDTH / 2}
                y={20 + BAR_HEIGHT / 2 - 4}
                fill={strokeColor}
                fontSize="14"
                textAnchor="middle"
                dominantBaseline="middle"
              >
                {rashi.symbol}
              </text>
              {/* Degree label below bar */}
              <text
                x={i * SEGMENT_WIDTH + SEGMENT_WIDTH / 2}
                y={20 + BAR_HEIGHT / 2 + 14}
                fill="rgba(240,212,138,0.45)"
                fontSize="7"
                textAnchor="middle"
                dominantBaseline="middle"
              >
                {rashi.startDeg}°-{rashi.endDeg}°
              </text>
            </g>
          );
        })}

        {/* "Sidereal 0°" label */}
        <text x={2} y={14} fill="#f0d48a" fontSize="8" textAnchor="start">
          {(locale !== 'hi' && String(locale) !== 'sa') ? 'Sidereal 0°' : 'नाक्षत्रिक 0°'}
        </text>
        <text x={BAR_WIDTH - 2} y={14} fill="rgba(240,212,138,0.4)" fontSize="8" textAnchor="end">
          360°
        </text>

        {/* Animated ayanamsha pointer — shows where tropical 0° Aries falls */}
        {(() => {
          // Tropical 0° = Sidereal (360 - ayanamsha)°, i.e. it falls in Pisces region
          const tropicalZeroInSidereal = 360 - AYANAMSHA;
          const pointerX = (tropicalZeroInSidereal / 360) * BAR_WIDTH;
          return (
            <motion.g
              initial={{ opacity: 0, y: -10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              {/* Pointer line */}
              <motion.line
                x1={pointerX}
                y1={10}
                x2={pointerX}
                y2={20 + BAR_HEIGHT + 4}
                stroke="#f87171"
                strokeWidth="2"
                strokeDasharray="4 2"
                initial={{ pathLength: 0 }}
                whileInView={{ pathLength: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1, delay: 0.7 }}
              />
              {/* Pointer diamond */}
              <motion.polygon
                points={`${pointerX},${20 + BAR_HEIGHT + 4} ${pointerX - 4},${20 + BAR_HEIGHT + 10} ${pointerX},${20 + BAR_HEIGHT + 16} ${pointerX + 4},${20 + BAR_HEIGHT + 10}`}
                fill="#f87171"
                animate={{ y: [0, 2, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
              />
              {/* Label */}
              <text
                x={pointerX}
                y={20 + BAR_HEIGHT + 28}
                fill="#f87171"
                fontSize="8"
                textAnchor="middle"
                fontWeight="bold"
              >
                {(locale !== 'hi' && String(locale) !== 'sa') ? `Tropical 0° (Ayanamsha ~${AYANAMSHA.toFixed(1)}°)` : `उष्णकटिबन्धीय 0° (अयनांश ~${AYANAMSHA.toFixed(1)}°)`}
              </text>
            </motion.g>
          );
        })()}

        {/* Ayanamsha offset bracket */}
        {(() => {
          const siderealZeroX = 0;
          const tropicalZeroX = ((360 - AYANAMSHA) / 360) * BAR_WIDTH;
          const bracketY = 20 + BAR_HEIGHT + 40;
          return (
            <motion.g
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 1.2, duration: 0.6 }}
            >
              {/* Bracket line */}
              <line x1={siderealZeroX} y1={bracketY} x2={tropicalZeroX} y2={bracketY} stroke="rgba(248,113,113,0.4)" strokeWidth="1" />
              <line x1={siderealZeroX} y1={bracketY - 3} x2={siderealZeroX} y2={bracketY + 3} stroke="rgba(248,113,113,0.4)" strokeWidth="1" />
              <line x1={tropicalZeroX} y1={bracketY - 3} x2={tropicalZeroX} y2={bracketY + 3} stroke="rgba(248,113,113,0.4)" strokeWidth="1" />
              <text x={(siderealZeroX + tropicalZeroX) / 2} y={bracketY + 14} fill="rgba(248,113,113,0.6)" fontSize="7" textAnchor="middle">
                {locale === 'en'
                  ? `~${(360 - AYANAMSHA).toFixed(1)}° offset in sidereal frame`
                  : `~${(360 - AYANAMSHA).toFixed(1)}° नाक्षत्रिक अन्तर`}
              </text>
            </motion.g>
          );
        })()}
      </svg>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════════════════════════ */
/*  Main Page Component                                               */
/* ═══════════════════════════════════════════════════════════════════ */

export default function RashiPage() {
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

      {/* Hero header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-6 mb-6"
      >
        <RashiIcon size={72} />
        <div>
          <h1 className="text-4xl sm:text-5xl font-bold mb-4" style={headingFont}>
            <span className="text-gold-gradient">
              {isTamil ? 'ராசி' : locale === 'en' ? 'Rashi' : locale === 'hi' ? 'राशि' : 'राशिः'}
            </span>
          </h1>
          <p className="text-text-secondary text-lg" style={{ fontFamily: 'var(--font-heading)' }}>
            {isTamil
              ? '12 ராசிகள் \u2014 கிரகண வட்டத்தின் நட்சத்திரப் பிரிவுகள்'
              : locale === 'en'
              ? 'The 12 Zodiac Signs \u2014 Sidereal Divisions of the Ecliptic'
              : locale === 'hi'
              ? '12 राशियाँ \u2014 क्रान्तिवृत्त के नाक्षत्रिक विभाग'
              : 'द्वादश राशयः \u2014 क्रान्तिवृत्तस्य नाक्षत्रिकविभागाः'}
          </p>
        </div>
      </motion.div>

      <GoldDivider />

      {/* ── Scientific Basis ───────────────────────────────────────── */}
      <section className="my-12">
        <h2 className="text-2xl font-bold text-gold-gradient mb-6" style={headingFont}>
          {t('scientificBasis')}
        </h2>
        <motion.div
          className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-8"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="prose prose-invert max-w-none text-text-secondary">
            <p className="text-lg leading-relaxed">
              {locale === 'en'
                ? `The 12 Rashis divide the 360° sidereal zodiac into equal segments of 30° each. Unlike the Western tropical zodiac (anchored to the vernal equinox), the Vedic sidereal zodiac is anchored to fixed stars and accounts for the precession of equinoxes via the Ayanamsha correction (~24° currently). Each Rashi is ruled by a planet, belongs to one of four elements (Fire, Earth, Air, Water), and has a quality (Cardinal/Chara, Fixed/Sthira, Mutable/Dvisvabhava). The Sun transits each Rashi in about one month, and the Moon in about 2.25 days.`
                : locale === 'hi'
                ? `12 राशियाँ 360° नाक्षत्रिक राशिचक्र को 30° के बराबर खण्डों में विभाजित करती हैं। पश्चिमी उष्णकटिबन्धीय राशिचक्र (जो वसन्त विषुव पर आधारित है) के विपरीत, वैदिक नाक्षत्रिक राशिचक्र स्थिर तारों पर आधारित है और अयनांश सुधार (~24° वर्तमान) द्वारा विषुव अयन का हिसाब रखता है। प्रत्येक राशि एक ग्रह द्वारा शासित है, चार तत्वों (अग्नि, पृथ्वी, वायु, जल) में से एक से सम्बन्धित है, और एक गुण (चर, स्थिर, द्विस्वभाव) रखती है।`
                : `द्वादश राशयः 360° नाक्षत्रिकराशिचक्रं 30° समखण्डेषु विभजन्ति। पाश्चात्योष्णकटिबन्धीयराशिचक्रात् भिन्नं वैदिकं नाक्षत्रिकराशिचक्रं स्थिरताराणाम् आधारेण स्थितम्, अयनांशशोधनेन च विषुवायनं गणयति।`}
            </p>
            <div className="mt-6 p-4 bg-bg-primary/50 rounded-lg border border-gold-primary/10">
              <p className="text-gold-light font-mono text-sm">
                {(locale !== 'hi' && String(locale) !== 'sa') ? 'Formula:' : 'सूत्र:'} Rashi = floor(Sidereal_longitude / 30°) + 1
              </p>
              <p className="text-gold-light/70 font-mono text-xs mt-1">
                {locale === 'en'
                  ? 'Sidereal = Tropical - Ayanamsha (~24°)'
                  : 'नाक्षत्रिक = उष्णकटिबन्धीय - अयनांश (~24°)'}
              </p>
            </div>
          </div>
        </motion.div>
      </section>

      {/* ── Zodiac Wheel Visualization ─────────────────────────────── */}
      <section className="my-12">
        <h2 className="text-2xl font-bold text-gold-gradient mb-6" style={headingFont}>
          {locale === 'en'
            ? 'Sidereal Zodiac Wheel'
            : locale === 'hi'
            ? 'नाक्षत्रिक राशि चक्र'
            : 'नाक्षत्रिकराशिचक्रम्'}
        </h2>
        <div className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-8 flex flex-col items-center">
          <AnimatedZodiacWheel
            locale={locale}
            selectedRashi={null}
            onSelect={() => {}}
          />
          <ElementLegend locale={locale} />
        </div>
      </section>

      {/* ── Ecliptic Diagram ───────────────────────────────────────── */}
      <section className="my-12">
        <h2 className="text-2xl font-bold text-gold-gradient mb-6" style={headingFont}>
          {locale === 'en'
            ? 'Ayanamsha & the Ecliptic'
            : locale === 'hi'
            ? 'अयनांश एवं क्रान्तिवृत्त'
            : 'अयनांशः क्रान्तिवृत्तं च'}
        </h2>
        <EclipticDiagram locale={locale} />
      </section>

      <GoldDivider />

      {/* ── Complete Listing ───────────────────────────────────────── */}
      <section className="my-12">
        <h2 className="text-2xl font-bold text-gold-gradient mb-6" style={headingFont}>
          {t('completeListing')}
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {RASHIS.map((rashi, i) => (
            <Link key={rashi.id} href={`/panchang/rashi/${rashi.slug}`}>
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                whileHover={{ scale: 1.05 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.03, duration: 0.3 }}
                className={`bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-lg p-5 text-center cursor-pointer ${
                  elementBorders[rashi.element.en] || ''
                }`}
              >
                <div className="flex justify-center mb-2">
                  <RashiIconById id={rashi.id} size={40} />
                </div>
                <div className="text-gold-primary text-xs mb-1">{rashi.id}</div>
                <div
                  className="text-gold-light font-semibold text-base"
                  style={isDevanagari ? { fontFamily: 'var(--font-devanagari-heading)' } : undefined}
                >
                  {rashi.name[locale]}
                </div>
                <div className="text-gold-dark text-xs mt-1">
                  {rashi.startDeg}&deg; &ndash; {rashi.endDeg}&deg;
                </div>
                <div
                  className={`text-xs mt-2 ${elementTextColor[rashi.element.en] || 'text-text-secondary'}`}
                  style={isDevanagari ? { fontFamily: 'var(--font-devanagari-body)' } : undefined}
                >
                  {rashi.element[locale]}
                </div>
                <div
                  className="text-text-secondary text-xs mt-1"
                  style={isDevanagari ? { fontFamily: 'var(--font-devanagari-body)' } : undefined}
                >
                  {rashi.rulerName[locale]}
                </div>
                <div
                  className="text-gold-dark/60 text-xs mt-0.5"
                  style={isDevanagari ? { fontFamily: 'var(--font-devanagari-body)' } : undefined}
                >
                  {rashi.quality[locale]}
                </div>
              </motion.div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
