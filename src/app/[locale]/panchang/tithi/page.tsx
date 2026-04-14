'use client';

import { tl } from '@/lib/utils/trilingual';
import { useState, useEffect } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from '@/lib/i18n/navigation';
import GoldDivider from '@/components/ui/GoldDivider';
import { TITHIS } from '@/lib/constants/tithis';
import type { Locale } from '@/types/panchang';
import { ArrowLeft } from 'lucide-react';
import { TithiIcon } from '@/components/icons/PanchangIcons';
import { isDevanagariLocale } from '@/lib/utils/locale-fonts';

function MoonPhase({ phase }: { phase: number }) {
  // phase: 0 = new moon, 0.5 = full moon, 1 = new moon again
  const r = 18;
  const illumination = phase <= 0.5 ? phase * 2 : (1 - phase) * 2;
  const isWaxing = phase <= 0.5;

  // Draw moon using two arcs
  const darkSide = isWaxing ? 'right' : 'left';
  const terminatorX = r * (1 - 2 * illumination);

  return (
    <svg viewBox="-22 -22 44 44" className="w-10 h-10">
      <defs>
        <radialGradient id={`moonGrad-${Math.round(phase * 100)}`} cx="40%" cy="35%">
          <stop offset="0%" stopColor="#f5e6b8" />
          <stop offset="100%" stopColor="#d4a853" />
        </radialGradient>
      </defs>
      {/* Dark background circle */}
      <circle cx="0" cy="0" r={r} fill="#1a1f4e" stroke="rgba(212,168,83,0.3)" strokeWidth="0.5" />
      {/* Illuminated part */}
      <clipPath id={`moonClip-${Math.round(phase * 100)}`}>
        <circle cx="0" cy="0" r={r} />
      </clipPath>
      <g clipPath={`url(#moonClip-${Math.round(phase * 100)})`}>
        {illumination >= 0.99 ? (
          <circle cx="0" cy="0" r={r} fill={`url(#moonGrad-${Math.round(phase * 100)})`} />
        ) : illumination <= 0.01 ? null : (
          <path
            d={`M 0 ${-r} A ${r} ${r} 0 0 ${isWaxing ? 0 : 1} 0 ${r} A ${Math.abs(terminatorX * r / r)} ${r} 0 0 ${(isWaxing && illumination > 0.5) || (!isWaxing && illumination > 0.5) ? 0 : 1} 0 ${-r}`}
            fill={`url(#moonGrad-${Math.round(phase * 100)})`}
          />
        )}
      </g>
    </svg>
  );
}

function AnimatedTithiWheel({ locale, onSelect }: { locale: Locale; onSelect: (idx: number) => void }) {
  const [hoveredTithi, setHoveredTithi] = useState<number | null>(null);

  return (
    <motion.svg
      viewBox="0 0 500 500"
      className="w-full max-w-lg mx-auto"
      initial={{ opacity: 0, rotate: -10 }}
      animate={{ opacity: 1, rotate: 0 }}
      transition={{ duration: 1.2, ease: 'easeOut' }}
    >
      <defs>
        <radialGradient id="wheelBg" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#1a1f4e" />
          <stop offset="100%" stopColor="#0a0e27" />
        </radialGradient>
        <filter id="tithiGlow">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Background */}
      <circle cx="250" cy="250" r="240" fill="url(#wheelBg)" />
      <circle cx="250" cy="250" r="240" fill="none" stroke="rgba(212,168,83,0.15)" strokeWidth="1" />

      {/* Concentric rings */}
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

      {/* 30 Tithi sectors */}
      {Array.from({ length: 30 }, (_, i) => {
        const startAngle = (i * 12 - 90) * Math.PI / 180;
        const endAngle = ((i + 1) * 12 - 90) * Math.PI / 180;
        const midAngle = ((i * 12 + 6) - 90) * Math.PI / 180;
        const isShukla = i < 15;
        const isHovered = hoveredTithi === i;
        const tithi = TITHIS[i];

        // Sector path
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

        const textR = 175;
        const textX = 250 + textR * Math.cos(midAngle);
        const textY = 250 + textR * Math.sin(midAngle);

        const numR = 135;
        const numX = 250 + numR * Math.cos(midAngle);
        const numY = 250 + numR * Math.sin(midAngle);

        return (
          <motion.g
            key={i}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 + i * 0.03 }}
            onMouseEnter={() => setHoveredTithi(i)}
            onMouseLeave={() => setHoveredTithi(null)}
            onClick={() => onSelect(i)}
            style={{ cursor: 'pointer' }}
          >
            {/* Sector */}
            <path
              d={`M ${x1i} ${y1i} L ${x1o} ${y1o} A ${outerR} ${outerR} 0 0 1 ${x2o} ${y2o} L ${x2i} ${y2i} A ${innerR} ${innerR} 0 0 0 ${x1i} ${y1i}`}
              fill={isHovered
                ? (isShukla ? 'rgba(240,212,138,0.2)' : 'rgba(138,109,43,0.2)')
                : (isShukla ? 'rgba(240,212,138,0.04)' : 'rgba(138,109,43,0.03)')}
              stroke={isShukla ? 'rgba(240,212,138,0.2)' : 'rgba(138,109,43,0.15)'}
              strokeWidth="0.5"
            />
            {/* Tithi number */}
            <text
              x={numX} y={numY}
              fill={isHovered ? '#f0d48a' : (isShukla ? 'rgba(240,212,138,0.6)' : 'rgba(138,109,43,0.5)')}
              fontSize={isHovered ? '11' : '9'}
              fontWeight={isHovered ? '700' : '400'}
              textAnchor="middle"
              dominantBaseline="middle"
            >
              {i + 1}
            </text>
            {/* Tithi name (abbreviated) */}
            <text
              x={textX} y={textY}
              fill={isHovered ? '#f0d48a' : (isShukla ? 'rgba(240,212,138,0.4)' : 'rgba(138,109,43,0.35)')}
              fontSize="6"
              fontWeight={isHovered ? '600' : '400'}
              textAnchor="middle"
              dominantBaseline="middle"
              transform={`rotate(${i * 12}, ${textX}, ${textY})`}
              style={(isDevanagariLocale(locale)) ? { fontFamily: 'var(--font-devanagari-body)' } : undefined}
            >
              {tithi?.name[locale]?.substring(0, 6) || ''}
            </text>
          </motion.g>
        );
      })}

      {/* Center moon animation */}
      <motion.g
        animate={{ rotate: 360 }}
        transition={{ duration: 60, repeat: Infinity, ease: 'linear' }}
        style={{ transformOrigin: '250px 250px' }}
      >
        <circle cx="250" cy="175" r="3" fill="#f0d48a" opacity="0.6" />
      </motion.g>

      {/* Center labels */}
      <circle cx="250" cy="250" r="80" fill="#0a0e27" stroke="rgba(212,168,83,0.15)" strokeWidth="0.5" />
      <text x="250" y="235" fill="#f0d48a" fontSize="14" textAnchor="middle" fontWeight="bold" fontFamily="var(--font-heading)">
        {tl({ en: 'TITHI', hi: 'तिथि', sa: 'तिथिः', ta: 'திதி', te: 'తిథి', bn: 'তিথি', kn: 'ತಿಥಿ', gu: 'તિથિ', mai: 'तिथि', mr: 'तिथी' }, locale)}
      </text>
      <text x="250" y="255" fill="rgba(212,168,83,0.5)" fontSize="9" textAnchor="middle">
        {tl({ en: '30 Lunar Days', hi: '३० चान्द्र दिवस', sa: 'त्रिंशत् चान्द्रदिवसाः', ta: '30 சந்திர நாட்கள்', te: '30 చాంద్రమాన రోజులు', bn: '৩০টি চান্দ্র দিবস', kn: '30 ಚಾಂದ್ರ ದಿನಗಳು', gu: '30 ચાંદ્ર દિવસ', mai: '30 चान्द्र दिवस', mr: '30 चांद्र दिवस' }, locale)}
      </text>

      {/* Shukla/Krishna labels */}
      <text x="250" y="50" fill="#f0d48a" fontSize="10" textAnchor="middle" fontWeight="600">
        {tl({ en: 'SHUKLA PAKSHA', hi: 'शुक्ल पक्ष', sa: 'शुक्लपक्षः', ta: 'சுக்ல பக்ஷம்', te: 'శుక్ల పక్షం', bn: 'শুক্ল পক্ষ', kn: 'ಶುಕ್ಲ ಪಕ್ಷ', gu: 'શુક્લ પક્ષ', mai: 'शुक्ल पक्ष', mr: 'शुक्ल पक्ष' }, locale)}
      </text>
      <text x="250" y="462" fill="#8a6d2b" fontSize="10" textAnchor="middle" fontWeight="600">
        {tl({ en: 'KRISHNA PAKSHA', hi: 'कृष्ण पक्ष', sa: 'कृष्णपक्षः', ta: 'கிருஷ்ண பக்ஷம்', te: 'కృష్ణ పక్షం', bn: 'কৃষ্ণ পক্ষ', kn: 'ಕೃಷ್ಣ ಪಕ್ಷ', gu: 'કૃષ્ણ પક્ષ', mai: 'कृष्ण पक्ष', mr: 'कृष्ण पक्ष' }, locale)}
      </text>
    </motion.svg>
  );
}

function SunMoonDiagram({ locale }: { locale: Locale }) {
  return (
    <motion.svg
      viewBox="0 0 600 200"
      className="w-full max-w-2xl mx-auto"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8 }}
    >
      <defs>
        <radialGradient id="sunGrad" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#f39c12" />
          <stop offset="100%" stopColor="#e67e22" />
        </radialGradient>
        <radialGradient id="moonGradDiag" cx="40%" cy="35%">
          <stop offset="0%" stopColor="#f5e6b8" />
          <stop offset="100%" stopColor="#d4a853" />
        </radialGradient>
        <radialGradient id="earthGrad" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#3498db" />
          <stop offset="100%" stopColor="#2980b9" />
        </radialGradient>
      </defs>

      {/* Ecliptic line */}
      <motion.line
        x1="50" y1="100" x2="550" y2="100"
        stroke="rgba(212,168,83,0.15)" strokeWidth="1" strokeDasharray="4 4"
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
        transition={{ duration: 1 }}
      />

      {/* Sun */}
      <motion.g initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.3, type: 'spring' }}>
        <circle cx="100" cy="100" r="30" fill="url(#sunGrad)" />
        <circle cx="100" cy="100" r="35" fill="none" stroke="#f39c12" strokeWidth="0.5" opacity="0.3" />
        <text x="100" y="155" fill="#f39c12" fontSize="11" textAnchor="middle" fontWeight="600">
          {tl({ en: 'Sun', hi: 'सूर्य', sa: 'सूर्यः', ta: 'சூரியன்', te: 'సూర్యుడు', bn: 'সূর্য', kn: 'ಸೂರ್ಯ', gu: 'સૂર્ય', mai: 'सूर्य', mr: 'सूर्य' }, locale)}
        </text>
      </motion.g>

      {/* Earth */}
      <motion.g initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.5, type: 'spring' }}>
        <circle cx="300" cy="100" r="18" fill="url(#earthGrad)" />
        <text x="300" y="145" fill="#3498db" fontSize="11" textAnchor="middle" fontWeight="600">
          {tl({ en: 'Earth', hi: 'पृथ्वी', sa: 'पृथ्वी', ta: 'பூமி', te: 'భూమి', bn: 'পৃথিবী', kn: 'ಭೂಮಿ', gu: 'પૃથ્વી', mai: 'पृथ्वी', mr: 'पृथ्वी' }, locale)}
        </text>
      </motion.g>

      {/* Moon */}
      <motion.g
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.7, type: 'spring' }}
      >
        <circle cx="420" cy="100" r="12" fill="url(#moonGradDiag)" />
        <text x="420" y="135" fill="#d4a853" fontSize="11" textAnchor="middle" fontWeight="600">
          {tl({ en: 'Moon', hi: 'चन्द्र', sa: 'चन्द्रः', ta: 'சந்திரன்', te: 'చంద్రుడు', bn: 'চন্দ্র', kn: 'ಚಂದ್ರ', gu: 'ચંદ્ર', mai: 'चन्द्र', mr: 'चंद्र' }, locale)}
        </text>
      </motion.g>

      {/* Angular separation arc */}
      <motion.path
        d="M 300 80 A 120 120 0 0 1 420 80"
        fill="none" stroke="#d4a853" strokeWidth="1.5" strokeDasharray="3 3"
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
        transition={{ delay: 1, duration: 0.8 }}
      />
      <motion.text
        x="370" y="55" fill="#d4a853" fontSize="10" textAnchor="middle"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
      >
        12° = 1 {tl({ en: 'Tithi', hi: 'तिथि', sa: 'तिथिः', ta: 'திதி', te: 'తిథి', bn: 'তিথি', kn: 'ತಿಥಿ', gu: 'તિથિ', mai: 'तिथि', mr: 'तिथी' }, locale)}
      </motion.text>
    </motion.svg>
  );
}

export default function TithiPage() {
  const t = useTranslations('deepDive');
  const locale = useLocale() as Locale;
  const isTamil = String(locale) === 'ta';
  const isDevanagari = isDevanagariLocale(locale);
  const headingFont = isDevanagari ? { fontFamily: 'var(--font-devanagari-heading)' } : { fontFamily: 'var(--font-heading)' };

  const [selectedTithi, setSelectedTithi] = useState<number | null>(null);
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const shukla = TITHIS.filter((t) => t.paksha === 'shukla');
  const krishna = TITHIS.filter((t) => t.paksha === 'krishna');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <Link href="/panchang" className="inline-flex items-center gap-2 text-gold-primary hover:text-gold-light mb-8 transition-colors">
        <ArrowLeft className="w-4 h-4" /> {t('backToPanchang')}
      </Link>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-6 mb-6">
        <TithiIcon size={72} />
        <div>
          <h1 className="text-4xl sm:text-5xl font-bold mb-2" style={headingFont}>
            <span className="text-gold-gradient">{tl({ en: 'Tithi', hi: 'तिथि', sa: 'तिथिः', ta: 'திதி', te: 'తిథి', bn: 'তিথি', kn: 'ತಿಥಿ', gu: 'તિથિ', mai: 'तिथि', mr: 'तिथी' }, locale)}</span>
          </h1>
          <p className="text-text-secondary text-lg" style={{ fontFamily: 'var(--font-heading)' }}>
            {tl({ en: 'The Lunar Day — Foundation of the Panchang', hi: 'चान्द्र दिवस — पञ्चाङ्ग का आधार', sa: 'चान्द्रदिवसः — पञ्चाङ्गस्य आधारः', ta: 'சந்திர நாள் — பஞ்சாங்கத்தின் அடிப்படை', te: 'చాంద్రమాన రోజు — పంచాంగం యొక్క ఆధారం', bn: 'চান্দ্র দিবস — পঞ্চাঙ্গের ভিত্তি', kn: 'ಚಾಂದ್ರ ದಿನ — ಪಂಚಾಂಗದ ಆಧಾರ', gu: 'ચાંદ્ર દિવસ — પંચાંગનો આધાર', mai: 'चान्द्र दिवस — पञ्चाङ्गक आधार', mr: 'चांद्र दिवस — पंचांगाचा आधार' }, locale)}
          </p>
        </div>
      </motion.div>

      <GoldDivider />

      {/* Sun-Moon Angular Separation Diagram */}
      <section className="my-12">
        <h2 className="text-2xl font-bold text-gold-gradient mb-6" style={headingFont}>{t('scientificBasis')}</h2>
        <div className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-8">
          <SunMoonDiagram locale={locale} />
          <div className="mt-8 text-text-secondary leading-relaxed">
            <p className="text-lg">
              {locale === 'en'
                ? `A Tithi is defined as the time it takes for the Moon to gain 12° of longitude over the Sun. Since the Moon moves approximately 13.2° per day and the Sun about 1° per day, the relative angular gain is about 12° per day — hence roughly one Tithi per day. However, because the Moon's orbital speed varies (perigee vs. apogee), a Tithi can last between 19 to 26 hours.`
                : tl({ en: `तिथिः तत्समयः यत्र चन्द्रमा सूर्यात् 12° अंशान् अग्रे गच्छति। चन्द्रमा प्रतिदिनं प्रायः 13.2° सूर्यश्च प्रायः 1° चलति, अतः सापेक्षकोणीयान्तरं प्रतिदिनं प्रायः 12° भवति — अतः प्रतिदिनं प्रायः एका तिथिः।`, hi: `तिथि वह समय है जिसमें चन्द्रमा सूर्य से 12° अंश आगे बढ़ता है। चन्द्रमा प्रतिदिन लगभग 13.2° और सूर्य लगभग 1° चलता है, अतः सापेक्ष कोणीय अन्तर प्रतिदिन लगभग 12° होता है — इसलिए लगभग एक तिथि प्रतिदिन। चन्द्रमा की कक्षीय गति में विभिन्नता (उपभू बनाम अपभू) के कारण तिथि 19 से 26 घंटे तक रह सकती है।`, sa: `तिथि वह समय है जिसमें चन्द्रमा सूर्य से 12° अंश आगे बढ़ता है। चन्द्रमा प्रतिदिन लगभग 13.2° और सूर्य लगभग 1° चलता है, अतः सापेक्ष कोणीय अन्तर प्रतिदिन लगभग 12° होता है — इसलिए लगभग एक तिथि प्रतिदिन। चन्द्रमा की कक्षीय गति में विभिन्नता (उपभू बनाम अपभू) के कारण तिथि 19 से 26 घंटे तक रह सकती है।`, ta: `तिथिः तत्समयः यत्र चन्द्रमा सूर्यात् 12° अंशान् अग्रे गच्छति। चन्द्रमा प्रतिदिनं प्रायः 13.2° सूर्यश्च प्रायः 1° चलति, अतः सापेक्षकोणीयान्तरं प्रतिदिनं प्रायः 12° भवति — अतः प्रतिदिनं प्रायः एका तिथिः।`, te: `तिथिः तत्समयः यत्र चन्द्रमा सूर्यात् 12° अंशान् अग्रे गच्छति। चन्द्रमा प्रतिदिनं प्रायः 13.2° सूर्यश्च प्रायः 1° चलति, अतः सापेक्षकोणीयान्तरं प्रतिदिनं प्रायः 12° भवति — अतः प्रतिदिनं प्रायः एका तिथिः।`, bn: `तिथिः तत्समयः यत्र चन्द्रमा सूर्यात् 12° अंशान् अग्रे गच्छति। चन्द्रमा प्रतिदिनं प्रायः 13.2° सूर्यश्च प्रायः 1° चलति, अतः सापेक्षकोणीयान्तरं प्रतिदिनं प्रायः 12° भवति — अतः प्रतिदिनं प्रायः एका तिथिः।`, kn: `तिथिः तत्समयः यत्र चन्द्रमा सूर्यात् 12° अंशान् अग्रे गच्छति। चन्द्रमा प्रतिदिनं प्रायः 13.2° सूर्यश्च प्रायः 1° चलति, अतः सापेक्षकोणीयान्तरं प्रतिदिनं प्रायः 12° भवति — अतः प्रतिदिनं प्रायः एका तिथिः।`, gu: `तिथिः तत्समयः यत्र चन्द्रमा सूर्यात् 12° अंशान् अग्रे गच्छति। चन्द्रमा प्रतिदिनं प्रायः 13.2° सूर्यश्च प्रायः 1° चलति, अतः सापेक्षकोणीयान्तरं प्रतिदिनं प्रायः 12° भवति — अतः प्रतिदिनं प्रायः एका तिथिः।`, mai: `तिथि वह समय है जिसमें चन्द्रमा सूर्य से 12° अंश आगे बढ़ता है। चन्द्रमा प्रतिदिन लगभग 13.2° और सूर्य लगभग 1° चलता है, अतः सापेक्ष कोणीय अन्तर प्रतिदिन लगभग 12° होता है — इसलिए लगभग एक तिथि प्रतिदिन। चन्द्रमा की कक्षीय गति में विभिन्नता (उपभू बनाम अपभू) के कारण तिथि 19 से 26 घंटे तक रह सकती है।`, mr: `तिथि वह समय है जिसमें चन्द्रमा सूर्य से 12° अंश आगे बढ़ता है। चन्द्रमा प्रतिदिन लगभग 13.2° और सूर्य लगभग 1° चलता है, अतः सापेक्ष कोणीय अन्तर प्रतिदिन लगभग 12° होता है — इसलिए लगभग एक तिथि प्रतिदिन। चन्द्रमा की कक्षीय गति में विभिन्नता (उपभू बनाम अपभू) के कारण तिथि 19 से 26 घंटे तक रह सकती है।` }, locale)}
            </p>
            <motion.div
              className="mt-6 p-4 bg-bg-primary/50 rounded-lg border border-gold-primary/10"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <p className="text-gold-light font-mono text-sm">
                {tl({ en: 'Formula:', hi: 'सूत्र:', sa: 'सूत्रम्:', ta: 'சூத்திரம்:', te: 'సూత్రం:', bn: 'সূত্র:', kn: 'ಸೂತ್ರ:', gu: 'સૂત્ર:', mai: 'सूत्र:', mr: 'सूत्र:' }, locale)} Tithi = ⌊(Moon_longitude - Sun_longitude) / 12°⌋ + 1
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Interactive Lunar Phase Wheel */}
      <section className="my-12">
        <h2 className="text-2xl font-bold text-gold-gradient mb-6" style={headingFont}>
          {tl({ en: 'Interactive Lunar Phase Wheel', hi: 'इंटरैक्टिव चन्द्र कला चक्र', sa: 'सक्रियचन्द्रकलाचक्रम्', ta: 'ஊடாடும் சந்திர கலை சக்கரம்', te: 'ఇంటరాక్టివ్ చంద్ర కళా చక్రం', bn: 'ইন্টারঅ্যাক্টিভ চন্দ্র কলা চক্র', kn: 'ಸಂವಾದಾತ್ಮಕ ಚಂದ್ರ ಕಲಾ ಚಕ್ರ', gu: 'ઇન્ટરૅક્ટિવ ચંદ્ર કળા ચક્ર', mai: 'इंटरैक्टिव चन्द्र कला चक्र', mr: 'इंटरॅक्टिव्ह चंद्र कला चक्र' }, locale)}
        </h2>
        <div className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-8">
          {mounted ? <AnimatedTithiWheel locale={locale} onSelect={setSelectedTithi} /> : (
            <div className="flex justify-center py-20">
              <div className="animate-spin rounded-full h-10 w-10 border-2 border-gold-primary border-t-transparent" />
            </div>
          )}

          {/* Selected tithi detail */}
          <AnimatePresence mode="wait">
            {selectedTithi !== null && TITHIS[selectedTithi] && (
              <motion.div
                key={selectedTithi}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="mt-8 bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-6 max-w-md mx-auto"
              >
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-gold-light text-lg font-bold" style={isDevanagari ? { fontFamily: 'var(--font-devanagari-heading)' } : undefined}>
                    {TITHIS[selectedTithi].name[locale]}
                  </h3>
                  <span className={`text-xs px-2 py-1 rounded-full ${TITHIS[selectedTithi].paksha === 'shukla' ? 'bg-gold-primary/20 text-gold-light' : 'bg-gold-dark/20 text-gold-dark'}`}>
                    {TITHIS[selectedTithi].paksha === 'shukla'
                      ? (tl({ en: 'Shukla Paksha', hi: 'शुक्ल पक्ष', sa: 'शुक्लपक्षः', ta: 'சுக்ல பக்ஷம்', te: 'శుక్ల పక్షం', bn: 'শুক্ল পক্ষ', kn: 'ಶುಕ್ಲ ಪಕ್ಷ', gu: 'શુક્લ પક્ષ', mai: 'शुक्ल पक्ष', mr: 'शुक्ल पक्ष' }, locale))
                      : (tl({ en: 'Krishna Paksha', hi: 'कृष्ण पक्ष', sa: 'कृष्णपक्षः', ta: 'கிருஷ்ண பக்ஷம்', te: 'కృష్ణ పక్షం', bn: 'কৃষ্ণ পক্ষ', kn: 'ಕೃಷ್ಣ ಪಕ್ಷ', gu: 'કૃષ્ણ પક્ષ', mai: 'कृष्ण पक्ष', mr: 'कृष्ण पक्ष' }, locale))}
                  </span>
                </div>
                <div className="text-text-secondary text-sm">
                  <p><span className="text-gold-dark">{tl({ en: 'Deity:', hi: 'देवता:', sa: 'देवता:', ta: 'தெய்வம்:', te: 'దేవత:', bn: 'দেবতা:', kn: 'ದೇವತೆ:', gu: 'દેવતા:', mai: 'देवता:', mr: 'देवता:' }, locale)}</span> {TITHIS[selectedTithi].deity[locale]}</p>
                  <p className="mt-1"><span className="text-gold-dark">{tl({ en: 'Tithi Number:', hi: 'तिथि संख्या:', sa: 'तिथिसंख्या:', ta: 'திதி எண்:', te: 'తిథి సంఖ్య:', bn: 'তিথি সংখ্যা:', kn: 'ತಿಥಿ ಸಂಖ್ಯೆ:', gu: 'તિથિ ક્રમાંક:', mai: 'तिथि संख्या:', mr: 'तिथी क्रमांक:' }, locale)}</span> {selectedTithi + 1} / 30</p>
                  <p className="mt-1"><span className="text-gold-dark">{tl({ en: 'Angular Span:', hi: 'कोणीय विस्तार:', sa: 'कोणीयविस्तारः:', ta: 'கோண வீச்சு:', te: 'కోణీయ విస్తీర్ణం:', bn: 'কোণীয় বিস্তার:', kn: 'ಕೋನೀಯ ವ್ಯಾಪ್ತಿ:', gu: 'કોણીય વ્યાપ:', mai: 'कोणीय विस्तार:', mr: 'कोनीय विस्तार:' }, locale)}</span> {selectedTithi * 12}° — {(selectedTithi + 1) * 12}°</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <p className="text-text-secondary text-xs text-center mt-4">
            {tl({ en: 'Click on any sector to see details', hi: 'विवरण देखने के लिए किसी भी खंड पर क्लिक करें', sa: 'विवरणार्थं यस्मिंश्चित् खण्डे क्लिक्कयत', ta: 'விவரங்கள் காண எந்த பகுதியிலும் கிளிக் செய்யுங்கள்', te: 'వివరాలు చూడటానికి ఏదైనా విభాగంపై క్లిక్ చేయండి', bn: 'বিবরণ দেখতে যেকোনো বিভাগে ক্লিক করুন', kn: 'ವಿವರಗಳನ್ನು ನೋಡಲು ಯಾವುದಾದರೂ ವಿಭಾಗದಲ್ಲಿ ಕ್ಲಿಕ್ ಮಾಡಿ', gu: 'વિગતો જોવા માટે કોઈ પણ વિભાગ પર ક્લિક કરો', mai: 'विवरण देखबाक लेल कोनो खंड पर क्लिक करू', mr: 'तपशील पाहण्यासाठी कोणत्याही विभागावर क्लिक करा' }, locale)}
          </p>
        </div>
      </section>

      <GoldDivider />

      {/* Moon Phase Progression */}
      <section className="my-12">
        <h2 className="text-2xl font-bold text-gold-gradient mb-6" style={headingFont}>
          {tl({ en: 'Moon Phase Progression', hi: 'चन्द्र कला क्रम', sa: 'चन्द्रकलाक्रमः', ta: 'சந்திர கலை வரிசை', te: 'చంద్ర కళా క్రమం', bn: 'চন্দ্র কলার ক্রম', kn: 'ಚಂದ್ರ ಕಲಾ ಕ್ರಮ', gu: 'ચંદ્ર કળા ક્રમ', mai: 'चन्द्र कला क्रम', mr: 'चंद्र कलेचा क्रम' }, locale)}
        </h2>
        <div className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-8">
          <div className="flex flex-wrap justify-center gap-3">
            {Array.from({ length: 30 }, (_, i) => {
              const phase = i / 30;
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.02 }}
                  className="flex flex-col items-center"
                >
                  <MoonPhase phase={phase} />
                  <span className="text-xs text-text-secondary mt-1">{i + 1}</span>
                </motion.div>
              );
            })}
          </div>
          <div className="flex justify-between mt-4 text-xs text-text-secondary">
            <span>{tl({ en: 'Amavasya (New Moon)', hi: 'अमावस्या', sa: 'अमावास्या (नवचन्द्रः)', ta: 'அமாவாசை (அமாவாசை)', te: 'అమావాస్య (నూతన చంద్రుడు)', bn: 'অমাবস্যা (নতুন চাঁদ)', kn: 'ಅಮಾವಾಸ್ಯೆ (ಹೊಸ ಚಂದ್ರ)', gu: 'અમાવાસ્યા (નવો ચંદ્ર)', mai: 'अमावस्या (नव चन्द्रमा)', mr: 'अमावास्या (अमावस्या)' }, locale)}</span>
            <span>{tl({ en: 'Purnima (Full Moon)', hi: 'पूर्णिमा', sa: 'पूर्णिमा (पूर्णचन्द्रः)', ta: 'பௌர்ணமி (நிறைநிலவு)', te: 'పూర్ణిమ (పూర్ణ చంద్రుడు)', bn: 'পূর্ণিমা (পূর্ণ চাঁদ)', kn: 'ಹುಣ್ಣಿಮೆ (ಪೂರ್ಣ ಚಂದ್ರ)', gu: 'પૂર્ણિમા (પૂર્ણ ચંદ્ર)', mai: 'पूर्णिमा (पूर्ण चन्द्रमा)', mr: 'पौर्णिमा (पूर्ण चंद्र)' }, locale)}</span>
            <span>{tl({ en: 'Amavasya (New Moon)', hi: 'अमावस्या', sa: 'अमावास्या (नवचन्द्रः)', ta: 'அமாவாசை (அமாவாசை)', te: 'అమావాస్య (నూతన చంద్రుడు)', bn: 'অমাবস্যা (নতুন চাঁদ)', kn: 'ಅಮಾವಾಸ್ಯೆ (ಹೊಸ ಚಂದ್ರ)', gu: 'અમાવાસ્યા (નવો ચંદ્ર)', mai: 'अमावस्या (नव चन्द्रमा)', mr: 'अमावास्या (अमावस्या)' }, locale)}</span>
          </div>
        </div>
      </section>

      <GoldDivider />

      {/* Complete Listing */}
      <section className="my-12">
        <h2 className="text-2xl font-bold text-gold-gradient mb-6" style={headingFont}>{t('completeListing')}</h2>

        {/* Shukla Paksha */}
        <h3 className="text-xl text-gold-light mb-4" style={headingFont}>
          {tl({ en: 'Shukla Paksha (Waxing Moon)', hi: 'शुक्ल पक्ष (बढ़ता चाँद)', sa: 'शुक्लपक्षः (वर्धमानचन्द्रः)', ta: 'சுக்ல பக்ஷம் (வளரும் சந்திரன்)', te: 'శుక్ల పక్షం (వర్ధమాన చంద్రుడు)', bn: 'শুক্ল পক্ষ (বাড়ন্ত চাঁদ)', kn: 'ಶುಕ್ಲ ಪಕ್ಷ (ಬೆಳೆಯುವ ಚಂದ್ರ)', gu: 'શુક્લ પક્ષ (વધતો ચંદ્ર)', mai: 'शुक्ल पक्ष (बढ़ैत चन्द्रमा)', mr: 'शुक्ल पक्ष (वाढता चंद्र)' }, locale)}
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 mb-8">
          {shukla.map((tithi, i) => (
            <motion.div
              key={tithi.number}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.03 }}
              whileHover={{ scale: 1.05, borderColor: 'rgba(212,168,83,0.4)' }}
              className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-lg p-4 text-center cursor-pointer"
              onClick={() => setSelectedTithi(i)}
            >
              <div className="text-gold-primary text-2xl mb-1">{i + 1}</div>
              <div className="text-gold-light font-semibold text-sm" style={isDevanagari ? { fontFamily: 'var(--font-devanagari-heading)' } : undefined}>
                {tithi.name[locale]}
              </div>
              <div className="text-text-secondary text-xs mt-1" style={isDevanagari ? { fontFamily: 'var(--font-devanagari-body)' } : undefined}>
                {tithi.deity[locale]}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Krishna Paksha */}
        <h3 className="text-xl text-gold-dark mb-4" style={headingFont}>
          {tl({ en: 'Krishna Paksha (Waning Moon)', hi: 'कृष्ण पक्ष (घटता चाँद)', sa: 'कृष्णपक्षः (क्षयमानचन्द्रः)', ta: 'கிருஷ்ண பக்ஷம் (தேயும் சந்திரன்)', te: 'కృష్ణ పక్షం (క్షీణించే చంద్రుడు)', bn: 'কৃষ্ণ পক্ষ (ক্ষয়িষ্ণু চাঁদ)', kn: 'ಕೃಷ್ಣ ಪಕ್ಷ (ಕ್ಷೀಣಿಸುವ ಚಂದ್ರ)', gu: 'કૃષ્ણ પક્ષ (ઘટતો ચંદ્ર)', mai: 'कृष्ण पक्ष (घटैत चन्द्रमा)', mr: 'कृष्ण पक्ष (कमी होणारा चंद्र)' }, locale)}
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
          {krishna.map((tithi, i) => (
            <motion.div
              key={tithi.number}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.03 }}
              whileHover={{ scale: 1.05, borderColor: 'rgba(138,109,43,0.4)' }}
              className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-lg p-4 text-center cursor-pointer"
              onClick={() => setSelectedTithi(i + 15)}
            >
              <div className="text-gold-dark text-2xl mb-1">{i + 1}</div>
              <div className="text-gold-light font-semibold text-sm" style={isDevanagari ? { fontFamily: 'var(--font-devanagari-heading)' } : undefined}>
                {tithi.name[locale]}
              </div>
              <div className="text-text-secondary text-xs mt-1" style={isDevanagari ? { fontFamily: 'var(--font-devanagari-body)' } : undefined}>
                {tithi.deity[locale]}
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Special Tithis */}
      <GoldDivider />
      <section className="my-12">
        <h2 className="text-2xl font-bold text-gold-gradient mb-6" style={headingFont}>
          {tl({ en: 'Special Tithis', hi: 'विशेष तिथियाँ', sa: 'विशेषतिथयः', ta: 'சிறப்பு திதிகள்', te: 'విశేష తిథులు', bn: 'বিশেষ তিথি', kn: 'ವಿಶೇಷ ತಿಥಿಗಳು', gu: 'વિશેષ તિથિ', mai: 'विशेष तिथि', mr: 'विशेष तिथी' }, locale)}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              name: { en: 'Ekadashi', hi: 'एकादशी', sa: 'एकादशी' },
              desc: { en: 'The 11th tithi of each paksha, considered highly sacred. Fasting on Ekadashi is one of the most observed vratas.', hi: 'प्रत्येक पक्ष की 11वीं तिथि, अत्यंत पवित्र मानी जाती है। एकादशी व्रत सबसे अधिक पालन किया जाने वाला व्रत है।', sa: 'प्रत्येकपक्षस्य एकादशी तिथिः अत्यन्तं पवित्रा मन्यते।' },
              svgIcon: (
                <svg viewBox="0 0 40 40" className="w-10 h-10">
                  <circle cx="20" cy="20" r="16" fill="none" stroke="#d4a853" strokeWidth="1.5" />
                  <path d="M20 6 L20 10 M20 30 L20 34 M6 20 L10 20 M30 20 L34 20" stroke="#d4a853" strokeWidth="1.5" />
                  <text x="20" y="24" textAnchor="middle" fill="#f0d48a" fontSize="12" fontWeight="bold" fontFamily="var(--font-devanagari-heading)">ॐ</text>
                </svg>
              ),
            },
            {
              name: { en: 'Purnima', hi: 'पूर्णिमा', sa: 'पूर्णिमा' },
              desc: { en: 'The 15th tithi of Shukla Paksha — Full Moon. The Moon and Sun are in direct opposition (180° apart). Auspicious for rituals, meditation, and charity.', hi: 'शुक्ल पक्ष की 15वीं तिथि — पूर्ण चन्द्रमा। चन्द्रमा और सूर्य प्रत्यक्ष विपरीत (180° अन्तर)। अनुष्ठान, ध्यान और दान के लिए शुभ।', sa: 'शुक्लपक्षस्य पञ्चदशी तिथिः — पूर्णचन्द्रः।' },
              svgIcon: (
                <svg viewBox="0 0 40 40" className="w-10 h-10">
                  <defs>
                    <radialGradient id="fullMoonGrad" cx="40%" cy="35%">
                      <stop offset="0%" stopColor="#f5e6b8" />
                      <stop offset="100%" stopColor="#d4a853" />
                    </radialGradient>
                  </defs>
                  <circle cx="20" cy="20" r="15" fill="url(#fullMoonGrad)" />
                  <circle cx="20" cy="20" r="17" fill="none" stroke="#f0d48a" strokeWidth="0.5" opacity="0.4" />
                </svg>
              ),
            },
            {
              name: { en: 'Amavasya', hi: 'अमावस्या', sa: 'अमावस्या' },
              desc: { en: 'The 30th tithi (15th of Krishna Paksha) — New Moon. The Moon and Sun are in conjunction (0° apart). Associated with ancestral rites (Pitru Tarpan).', hi: '30वीं तिथि (कृष्ण पक्ष की 15वीं) — अमावस्या। चन्द्रमा और सूर्य युति में (0° अन्तर)। पितृ तर्पण से सम्बन्धित।', sa: 'त्रिंशत्तमी तिथिः — अमावस्या। चन्द्रसूर्ययुतिः।' },
              svgIcon: (
                <svg viewBox="0 0 40 40" className="w-10 h-10">
                  <circle cx="20" cy="20" r="15" fill="#1a1f4e" stroke="#8a6d2b" strokeWidth="1" />
                  <circle cx="20" cy="20" r="17" fill="none" stroke="#8a6d2b" strokeWidth="0.5" opacity="0.3" />
                </svg>
              ),
            },
          ].map((special, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ y: -4 }}
              className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-6 hover:border-gold-primary/30 transition-all"
            >
              <div className="mb-3">{special.svgIcon}</div>
              <h3 className="text-gold-light font-bold text-lg mb-2" style={isDevanagari ? { fontFamily: 'var(--font-devanagari-heading)' } : undefined}>
                {tl(special.name, locale)}
              </h3>
              <p className="text-text-secondary text-sm leading-relaxed" style={isDevanagari ? { fontFamily: 'var(--font-devanagari-body)' } : undefined}>
                {tl(special.desc, locale)}
              </p>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
}
