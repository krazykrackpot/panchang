'use client';

import { useState } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from '@/lib/i18n/navigation';
import GoldDivider from '@/components/ui/GoldDivider';
import { YOGAS } from '@/lib/constants/yogas';
import type { Locale } from '@/types/panchang';
import { ArrowLeft } from 'lucide-react';
import { YogaIcon, SunriseIcon } from '@/components/icons/PanchangIcons';
import { isDevanagariLocale } from '@/lib/utils/locale-fonts';
import { tl } from '@/lib/utils/trilingual';
import { lt } from '@/lib/learn/translations';
import type { LocaleText } from '@/lib/learn/translations';
import AuthorByline from '@/components/ui/AuthorByline';
import MSG from '@/messages/pages/panchang-yoga.json';
const msg = (key: string, locale: string) => lt((MSG as unknown as Record<string, LocaleText>)[key], locale);

function AnimatedYogaWheel({ locale, onSelect }: { locale: Locale; onSelect: (idx: number) => void }) {
  const [hoveredYoga, setHoveredYoga] = useState<number | null>(null);

  return (
    <motion.svg
      viewBox="0 0 500 500"
      className="w-full max-w-lg mx-auto"
      initial={{ opacity: 0, rotate: -15 }}
      animate={{ opacity: 1, rotate: 0 }}
      transition={{ duration: 1.2, ease: 'easeOut' }}
    >
      <defs>
        <radialGradient id="yogaWheelBg" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#1a1f4e" />
          <stop offset="100%" stopColor="#0a0e27" />
        </radialGradient>
        <filter id="yogaGlow">
          <feGaussianBlur stdDeviation="2" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <linearGradient id="sunArc" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#f39c12" />
          <stop offset="100%" stopColor="#e67e22" />
        </linearGradient>
        <linearGradient id="moonArc" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#f5e6b8" />
          <stop offset="100%" stopColor="#d4a853" />
        </linearGradient>
      </defs>

      {/* Background */}
      <circle cx="250" cy="250" r="240" fill="url(#yogaWheelBg)" />
      <circle cx="250" cy="250" r="240" fill="none" stroke="rgba(212,168,83,0.12)" strokeWidth="1" />

      {/* Concentric rings - animated */}
      {[200, 160, 120].map((r, i) => (
        <motion.circle
          key={r}
          cx="250" cy="250" r={r}
          fill="none"
          stroke="rgba(212,168,83,0.08)"
          strokeWidth="0.5"
          initial={{ r: 0 }}
          animate={{ r }}
          transition={{ duration: 0.8, delay: 0.3 + i * 0.15 }}
        />
      ))}

      {/* 27 Yoga sectors */}
      {YOGAS.map((yoga, i) => {
        const sectorAngle = 360 / 27;
        const startAngle = (i * sectorAngle - 90) * Math.PI / 180;
        const endAngle = ((i + 1) * sectorAngle - 90) * Math.PI / 180;
        const midAngle = ((i * sectorAngle + sectorAngle / 2) - 90) * Math.PI / 180;
        const isHovered = hoveredYoga === i;

        const innerR = 120;
        const outerR = isHovered ? 230 : 220;
        const x1i = 250 + innerR * Math.cos(startAngle);
        const y1i = 250 + innerR * Math.sin(startAngle);
        const x2i = 250 + innerR * Math.cos(endAngle);
        const y2i = 250 + innerR * Math.sin(endAngle);
        const x1o = 250 + outerR * Math.cos(startAngle);
        const y1o = 250 + outerR * Math.sin(startAngle);
        const x2o = 250 + outerR * Math.cos(endAngle);
        const y2o = 250 + outerR * Math.sin(endAngle);

        const textR = 170;
        const textX = 250 + textR * Math.cos(midAngle);
        const textY = 250 + textR * Math.sin(midAngle);

        const numR = 135;
        const numX = 250 + numR * Math.cos(midAngle);
        const numY = 250 + numR * Math.sin(midAngle);

        const fill = yoga.nature === 'auspicious' ? '#4ade80' : yoga.nature === 'inauspicious' ? '#f87171' : '#fbbf24';
        const fillBg = yoga.nature === 'auspicious'
          ? (isHovered ? 'rgba(74,222,128,0.15)' : 'rgba(74,222,128,0.03)')
          : yoga.nature === 'inauspicious'
          ? (isHovered ? 'rgba(248,113,113,0.15)' : 'rgba(248,113,113,0.03)')
          : (isHovered ? 'rgba(251,191,36,0.15)' : 'rgba(251,191,36,0.03)');

        return (
          <motion.g
            key={i}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 + i * 0.03 }}
            onMouseEnter={() => setHoveredYoga(i)}
            onMouseLeave={() => setHoveredYoga(null)}
            onClick={() => onSelect(i)}
            style={{ cursor: 'pointer' }}
          >
            <path
              d={`M ${x1i} ${y1i} L ${x1o} ${y1o} A ${outerR} ${outerR} 0 0 1 ${x2o} ${y2o} L ${x2i} ${y2i} A ${innerR} ${innerR} 0 0 0 ${x1i} ${y1i}`}
              fill={fillBg}
              stroke={`${fill}33`}
              strokeWidth="0.5"
            />
            <text
              x={numX} y={numY}
              fill={isHovered ? fill : `${fill}99`}
              fontSize={isHovered ? '11' : '9'}
              fontWeight={isHovered ? '700' : '400'}
              textAnchor="middle"
              dominantBaseline="middle"
            >
              {yoga.number}
            </text>
            <text
              x={textX} y={textY}
              fill={isHovered ? fill : `${fill}66`}
              fontSize="5"
              fontWeight={isHovered ? '600' : '400'}
              textAnchor="middle"
              dominantBaseline="middle"
              transform={`rotate(${i * sectorAngle}, ${textX}, ${textY})`}
            >
              {yoga.name[locale]?.substring(0, 7) || ''}
            </text>
          </motion.g>
        );
      })}

      {/* Orbiting indicator — combined Sun+Moon dot */}
      <motion.g
        animate={{ rotate: 360 }}
        transition={{ duration: 45, repeat: Infinity, ease: 'linear' }}
        style={{ transformOrigin: '250px 250px' }}
      >
        <circle cx="250" cy="140" r="4" fill="#f39c12" opacity="0.7" filter="url(#yogaGlow)" />
        <circle cx="265" cy="140" r="3" fill="#f5e6b8" opacity="0.6" />
      </motion.g>

      {/* Center */}
      <circle cx="250" cy="250" r="85" fill="#0a0e27" stroke="rgba(212,168,83,0.15)" strokeWidth="0.5" />
      <text x="250" y="232" fill="#f0d48a" fontSize="14" textAnchor="middle" fontWeight="bold" fontFamily="var(--font-heading)">
        {msg('wheelCenterYoga', locale)}
      </text>
      <text x="250" y="250" fill="rgba(212,168,83,0.5)" fontSize="9" textAnchor="middle">
        {msg('wheelCenterSunMoon', locale)}
      </text>
      <text x="250" y="268" fill="rgba(212,168,83,0.35)" fontSize="8" textAnchor="middle">
        27 x 13°20&apos;
      </text>

      {/* Legend */}
      <circle cx="60" cy="460" r="5" fill="#4ade80" opacity="0.6" />
      <text x="75" y="463" fill="#4ade80" fontSize="8">{msg('auspiciousLegend', locale)}</text>
      <circle cx="160" cy="460" r="5" fill="#fbbf24" opacity="0.6" />
      <text x="175" y="463" fill="#fbbf24" fontSize="8">{msg('neutralLegend', locale)}</text>
      <circle cx="250" cy="460" r="5" fill="#f87171" opacity="0.6" />
      <text x="265" y="463" fill="#f87171" fontSize="8">{msg('inauspiciousLegend', locale)}</text>
    </motion.svg>
  );
}

function SunMoonSumDiagram({ locale }: { locale: Locale }) {
  return (
    <motion.svg
      viewBox="0 0 600 220"
      className="w-full max-w-2xl mx-auto"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8 }}
    >
      <defs>
        <radialGradient id="sunGradY" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#f39c12" />
          <stop offset="100%" stopColor="#e67e22" />
        </radialGradient>
        <radialGradient id="moonGradY" cx="40%" cy="35%">
          <stop offset="0%" stopColor="#f5e6b8" />
          <stop offset="100%" stopColor="#d4a853" />
        </radialGradient>
      </defs>

      {/* Ecliptic line */}
      <motion.line
        x1="30" y1="100" x2="570" y2="100"
        stroke="rgba(212,168,83,0.15)" strokeWidth="1" strokeDasharray="4 4"
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
        transition={{ duration: 1 }}
      />

      {/* Sun at position */}
      <motion.g initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.3, type: 'spring' }}>
        <circle cx="120" cy="100" r="24" fill="url(#sunGradY)" />
        <circle cx="120" cy="100" r="30" fill="none" stroke="#f39c12" strokeWidth="0.5" opacity="0.3" />
        {/* Sun rays */}
        {Array.from({ length: 8 }, (_, i) => {
          const a = (i * 45) * Math.PI / 180;
          return (
            <motion.line
              key={i}
              x1={120 + 26 * Math.cos(a)} y1={100 + 26 * Math.sin(a)}
              x2={120 + 34 * Math.cos(a)} y2={100 + 34 * Math.sin(a)}
              stroke="#f39c12" strokeWidth="1.5" opacity="0.4"
              initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
              transition={{ delay: 0.5 + i * 0.05 }}
            />
          );
        })}
        <text x="120" y="150" fill="#f39c12" fontSize="11" textAnchor="middle" fontWeight="600">
          {msg('sun', locale)}
        </text>
        <text x="120" y="165" fill="#f39c12" fontSize="8" textAnchor="middle" opacity="0.6">
          75°
        </text>
      </motion.g>

      {/* Moon */}
      <motion.g initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.5, type: 'spring' }}>
        <circle cx="340" cy="100" r="16" fill="url(#moonGradY)" />
        <text x="340" y="140" fill="#d4a853" fontSize="11" textAnchor="middle" fontWeight="600">
          {msg('moon', locale)}
        </text>
        <text x="340" y="155" fill="#d4a853" fontSize="8" textAnchor="middle" opacity="0.6">
          120°
        </text>
      </motion.g>

      {/* Sum arc */}
      <motion.path
        d="M 120 70 Q 230 20 340 70"
        fill="none" stroke="#4ade80" strokeWidth="1.5" strokeDasharray="4 3"
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
        transition={{ delay: 0.8, duration: 0.8 }}
      />
      <motion.text
        x="230" y="35" fill="#4ade80" fontSize="11" textAnchor="middle" fontWeight="600"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
      >
        {msg('sumEquals195', locale)}
      </motion.text>

      {/* Result */}
      <motion.g
        initial={{ opacity: 0, x: 30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 1.5 }}
      >
        <rect x="430" y="70" width="140" height="60" rx="8" fill="rgba(74,222,128,0.08)" stroke="rgba(74,222,128,0.3)" strokeWidth="1" />
        <text x="500" y="92" fill="#4ade80" fontSize="9" textAnchor="middle">
          195° / 13.33° = 14.6
        </text>
        <text x="500" y="110" fill="#4ade80" fontSize="12" textAnchor="middle" fontWeight="bold">
          {msg('yogaNum15', locale)}
        </text>
        <text x="500" y="125" fill="#4ade80" fontSize="9" textAnchor="middle" opacity="0.7">
          {YOGAS[14]?.name[locale] || 'Vajra'}
        </text>
      </motion.g>
    </motion.svg>
  );
}

export default function YogaPage() {
  const t = useTranslations('deepDive');
  const locale = useLocale() as Locale;
  const isTamil = String(locale) === 'ta';
  const isDevanagari = isDevanagariLocale(locale);
  const headingFont = isDevanagari ? { fontFamily: 'var(--font-devanagari-heading)' } : { fontFamily: 'var(--font-heading)' };

  const [selectedYoga, setSelectedYoga] = useState<number | null>(null);

  const natureColor = (nature: string) => {
    if (nature === 'auspicious') return 'text-emerald-400';
    if (nature === 'inauspicious') return 'text-red-400';
    return 'text-amber-400';
  };

  const natureBorder = (nature: string) => {
    if (nature === 'auspicious') return 'border-emerald-500/20';
    if (nature === 'inauspicious') return 'border-red-500/20';
    return 'border-amber-500/20';
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <Link href="/panchang" className="inline-flex items-center gap-2 text-gold-primary hover:text-gold-light mb-8 transition-colors">
        <ArrowLeft className="w-4 h-4" /> {t('backToPanchang')}
      </Link>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-6 mb-6">
        <YogaIcon size={72} />
        <div>
          <h1 className="text-4xl sm:text-5xl font-bold mb-4" style={headingFont}>
            <span className="text-gold-gradient">{msg('yogaWord', locale)}</span>
          </h1>
          <p className="text-text-secondary text-lg" style={{ fontFamily: 'var(--font-heading)' }}>
            {msg('yogaSubtitle', locale)}
          </p>
        </div>
      </motion.div>

      <GoldDivider />

      {/* Scientific Basis with animated diagram */}
      <section className="my-12">
        <h2 className="text-2xl font-bold text-gold-gradient mb-6" style={headingFont}>{t('scientificBasis')}</h2>
        <div className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-8">
          <SunMoonSumDiagram locale={locale} />
          <div className="mt-8 prose prose-invert max-w-none text-text-secondary">
            <p className="text-lg leading-relaxed">
              {locale === 'en'
                ? `A Yoga is determined by the sum of the sidereal longitudes of the Sun and Moon. The 360° arc is divided into 27 equal parts of 13°20' each. When the combined longitude of Sun and Moon falls within a particular segment, that Yoga is in effect. Unlike Tithi (which depends on the difference), Yoga depends on the sum — hence it captures the combined "energy" of both luminaries. Each Yoga lasts approximately one day but varies because both the Sun and Moon are in continuous motion.`
                : msg('yogaDescription', locale)}
            </p>
            <motion.div
              className="mt-6 p-4 bg-bg-primary/50 rounded-lg border border-gold-primary/10"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <p className="text-gold-light font-mono text-sm">
                {msg('formula', locale)} Yoga = floor((Sun_sidereal + Moon_sidereal) / 13.333) + 1
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Interactive Yoga Wheel */}
      <section className="my-12">
        <h2 className="text-2xl font-bold text-gold-gradient mb-6" style={headingFont}>
          {msg('interactiveYogaWheel', locale)}
        </h2>
        <div className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-8">
          <AnimatedYogaWheel locale={locale} onSelect={setSelectedYoga} />

          {/* Selected yoga detail */}
          <AnimatePresence mode="wait">
            {selectedYoga !== null && YOGAS[selectedYoga] && (
              <motion.div
                key={selectedYoga}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="mt-8 bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-6 max-w-md mx-auto"
              >
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-gold-light text-lg font-bold" style={isDevanagari ? { fontFamily: 'var(--font-devanagari-heading)' } : undefined}>
                    {YOGAS[selectedYoga].name[locale]}
                  </h3>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    YOGAS[selectedYoga].nature === 'auspicious' ? 'bg-emerald-500/20 text-emerald-400'
                    : YOGAS[selectedYoga].nature === 'inauspicious' ? 'bg-red-500/20 text-red-400'
                    : 'bg-amber-500/20 text-amber-400'
                  }`}>
                    {YOGAS[selectedYoga].nature === 'auspicious'
                      ? (msg('auspicious', locale))
                      : YOGAS[selectedYoga].nature === 'inauspicious'
                      ? (msg('inauspicious', locale))
                      : (msg('neutral', locale))}
                  </span>
                </div>
                <div className="text-text-secondary text-sm">
                  <p><span className="text-gold-dark">{msg('yogaNumberLabel', locale)}</span> {selectedYoga + 1} / 27</p>
                  <p className="mt-1"><span className="text-gold-dark">{msg('meaningLabel', locale)}</span> {YOGAS[selectedYoga].meaning[locale]}</p>
                  <p className="mt-1"><span className="text-gold-dark">{msg('angularSpanLabel', locale)}</span> {(selectedYoga * 13.333).toFixed(1)}° — {((selectedYoga + 1) * 13.333).toFixed(1)}°</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <p className="text-text-secondary text-xs text-center mt-4">
            {msg('clickSectorHint', locale)}
          </p>
        </div>
      </section>

      <GoldDivider />

      {/* Complete Listing */}
      <section className="my-12">
        <h2 className="text-2xl font-bold text-gold-gradient mb-6" style={headingFont}>{t('completeListing')}</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {YOGAS.map((yoga, i) => (
            <motion.div
              key={yoga.number}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.02 }}
              whileHover={{ scale: 1.05, borderColor: 'rgba(212,168,83,0.4)' }}
              className={`bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-lg p-4 text-center border cursor-pointer ${natureBorder(yoga.nature)}`}
              onClick={() => setSelectedYoga(i)}
            >
              <div className="text-gold-primary text-2xl mb-1">{yoga.number}</div>
              <div className="text-gold-light font-semibold text-sm" style={isDevanagari ? { fontFamily: 'var(--font-devanagari-heading)' } : undefined}>
                {yoga.name[locale]}
              </div>
              <div className="text-text-secondary text-xs mt-1" style={isDevanagari ? { fontFamily: 'var(--font-devanagari-body)' } : undefined}>
                {yoga.meaning[locale]}
              </div>
              <div className={`text-xs mt-1 ${natureColor(yoga.nature)}`}>
                {yoga.nature === 'auspicious'
                  ? (msg('auspicious', locale))
                  : yoga.nature === 'inauspicious'
                  ? (msg('inauspicious', locale))
                  : (msg('neutral', locale))}
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      <AuthorByline />
    </div>
  );
}
