'use client';

import { useState } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from '@/lib/i18n/navigation';
import GoldDivider from '@/components/ui/GoldDivider';
import { KARANAS } from '@/lib/constants/karanas';
import type { Locale } from '@/types/panchang';
import { ArrowLeft } from 'lucide-react';
import { KaranaIcon } from '@/components/icons/PanchangIcons';
import { isDevanagariLocale } from '@/lib/utils/locale-fonts';
import { tl } from '@/lib/utils/trilingual';

/* ------------------------------------------------------------------ */
/*  60-slot Karana sequence: Shakuni at pos 1, Chara cycle 2-58,      */
/*  Chatushpada 58, Nagava 59, Kimstughna 60                         */
/* ------------------------------------------------------------------ */
const CHARA_KARANAS = KARANAS.filter((k) => k.type === 'chara'); // 7
const STHIRA_KARANAS = KARANAS.filter((k) => k.type === 'sthira'); // 4

function getKaranaAt(pos: number): { karana: typeof KARANAS[number]; isSthira: boolean } {
  // pos is 0-indexed (0..59)
  if (pos === 0) return { karana: KARANAS[7], isSthira: true };  // Shakuni
  if (pos === 57) return { karana: KARANAS[8], isSthira: true }; // Chatushpada
  if (pos === 58) return { karana: KARANAS[9], isSthira: true }; // Nagava
  if (pos === 59) return { karana: KARANAS[10], isSthira: true }; // Kimstughna
  // Positions 1..56 => 7 chara cycle
  const charaIdx = (pos - 1) % 7;
  return { karana: CHARA_KARANAS[charaIdx], isSthira: false };
}

function karanaColor(karana: typeof KARANAS[number], isSthira: boolean): string {
  if (isSthira) return '#f87171'; // red for fixed
  if (karana.name.en === 'Vishti') return '#ef4444'; // bright red for Bhadra
  return '#4ade80'; // gold-green for chara
}

function karanaFillColor(karana: typeof KARANAS[number], isSthira: boolean, hovered: boolean): string {
  if (isSthira) return hovered ? 'rgba(248,113,113,0.18)' : 'rgba(248,113,113,0.04)';
  if (karana.name.en === 'Vishti') return hovered ? 'rgba(239,68,68,0.2)' : 'rgba(239,68,68,0.05)';
  return hovered ? 'rgba(74,222,128,0.15)' : 'rgba(74,222,128,0.03)';
}

/* ------------------------------------------------------------------ */
/*  AnimatedKaranaWheel                                               */
/* ------------------------------------------------------------------ */
function AnimatedKaranaWheel({
  locale,
  onSelect,
  selectedKarana,
}: {
  locale: Locale;
  onSelect: (pos: number) => void;
  selectedKarana: number | null;
}) {
  const [hoveredSlot, setHoveredSlot] = useState<number | null>(null);

  const CX = 250;
  const CY = 250;
  const OUTER_R = 225;
  const INNER_R = 145;
  const NAME_R = 115;
  const SLOTS = 60;
  const SLOT_DEG = 360 / SLOTS; // 6 degrees

  return (
    <motion.svg
      viewBox="0 0 500 500"
      className="w-full max-w-lg mx-auto"
      initial={{ opacity: 0, rotate: -20 }}
      animate={{ opacity: 1, rotate: 0 }}
      transition={{ duration: 1.2, ease: 'easeOut' }}
    >
      <defs>
        <radialGradient id="karanaWheelBg" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#1a1f4e" />
          <stop offset="100%" stopColor="#0a0e27" />
        </radialGradient>
        <filter id="karanaGlow">
          <feGaussianBlur stdDeviation="2.5" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <filter id="moonGlowK">
          <feGaussianBlur stdDeviation="4" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Background disc */}
      <circle cx={CX} cy={CY} r={240} fill="url(#karanaWheelBg)" />
      <circle cx={CX} cy={CY} r={240} fill="none" stroke="rgba(212,168,83,0.12)" strokeWidth="1" />

      {/* Concentric rings animated in */}
      {[OUTER_R, INNER_R, 90].map((r, i) => (
        <motion.circle
          key={r}
          cx={CX} cy={CY} r={r}
          fill="none"
          stroke="rgba(212,168,83,0.08)"
          strokeWidth="0.5"
          initial={{ r: 0 }}
          animate={{ r }}
          transition={{ duration: 0.8, delay: 0.3 + i * 0.15 }}
        />
      ))}

      {/* 60 karana slot marks around the outer ring */}
      {Array.from({ length: SLOTS }, (_, i) => {
        const angleDeg = i * SLOT_DEG - 90;
        const angleRad = angleDeg * Math.PI / 180;
        const x1 = CX + INNER_R * Math.cos(angleRad);
        const y1 = CY + INNER_R * Math.sin(angleRad);
        const x2 = CX + OUTER_R * Math.cos(angleRad);
        const y2 = CY + OUTER_R * Math.sin(angleRad);
        const { isSthira } = getKaranaAt(i);
        return (
          <motion.line
            key={`tick-${i}`}
            x1={x1} y1={y1} x2={x2} y2={y2}
            stroke={isSthira ? 'rgba(248,113,113,0.25)' : 'rgba(212,168,83,0.1)'}
            strokeWidth="0.5"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 + i * 0.008 }}
          />
        );
      })}

      {/* 60 interactive sectors */}
      {Array.from({ length: SLOTS }, (_, i) => {
        const startDeg = i * SLOT_DEG - 90;
        const endDeg = (i + 1) * SLOT_DEG - 90;
        const startRad = startDeg * Math.PI / 180;
        const endRad = endDeg * Math.PI / 180;
        const midRad = ((startDeg + endDeg) / 2) * Math.PI / 180;

        const { karana, isSthira } = getKaranaAt(i);
        const isHovered = hoveredSlot === i;
        const isSelected = selectedKarana === i;
        const outerR = isHovered || isSelected ? OUTER_R + 8 : OUTER_R;

        const x1i = CX + INNER_R * Math.cos(startRad);
        const y1i = CY + INNER_R * Math.sin(startRad);
        const x2i = CX + INNER_R * Math.cos(endRad);
        const y2i = CY + INNER_R * Math.sin(endRad);
        const x1o = CX + outerR * Math.cos(startRad);
        const y1o = CY + outerR * Math.sin(startRad);
        const x2o = CX + outerR * Math.cos(endRad);
        const y2o = CY + outerR * Math.sin(endRad);

        const color = karanaColor(karana, isSthira);
        const fillBg = karanaFillColor(karana, isSthira, isHovered || isSelected);

        // Small label for slot number in the middle of the sector
        const numR = (INNER_R + outerR) / 2;
        const numX = CX + numR * Math.cos(midRad);
        const numY = CY + numR * Math.sin(midRad);

        return (
          <motion.g
            key={`sector-${i}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 + i * 0.012 }}
            onMouseEnter={() => setHoveredSlot(i)}
            onMouseLeave={() => setHoveredSlot(null)}
            onClick={() => onSelect(i)}
            style={{ cursor: 'pointer' }}
          >
            <path
              d={`M ${x1i} ${y1i} L ${x1o} ${y1o} A ${outerR} ${outerR} 0 0 1 ${x2o} ${y2o} L ${x2i} ${y2i} A ${INNER_R} ${INNER_R} 0 0 0 ${x1i} ${y1i}`}
              fill={fillBg}
              stroke={`${color}22`}
              strokeWidth="0.3"
            />
            {/* Slot number — show on hover or every 5th */}
            {(isHovered || isSelected || i % 5 === 0) && (
              <text
                x={numX} y={numY}
                fill={isHovered || isSelected ? color : `${color}66`}
                fontSize={isHovered || isSelected ? '7' : '5'}
                fontWeight={isHovered || isSelected ? '700' : '400'}
                textAnchor="middle"
                dominantBaseline="middle"
              >
                {i + 1}
              </text>
            )}
          </motion.g>
        );
      })}

      {/* 11 karana names on the inner ring */}
      {KARANAS.map((k, i) => {
        const angleDeg = (i * 360 / 11) - 90;
        const angleRad = angleDeg * Math.PI / 180;
        const tx = CX + NAME_R * Math.cos(angleRad);
        const ty = CY + NAME_R * Math.sin(angleRad);
        const isSthira = k.type === 'sthira';
        const isVishti = k.name.en === 'Vishti';
        const color = isSthira ? '#f87171' : isVishti ? '#ef4444' : '#f0d48a';
        return (
          <motion.text
            key={`name-${k.number}`}
            x={tx} y={ty}
            fill={color}
            fontSize="7"
            fontWeight="600"
            textAnchor="middle"
            dominantBaseline="middle"
            transform={`rotate(${angleDeg + 90}, ${tx}, ${ty})`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.85 }}
            transition={{ delay: 0.8 + i * 0.06 }}
            style={(isDevanagariLocale(locale)) ? { fontFamily: 'var(--font-devanagari-body)' } : undefined}
          >
            {k.name[locale]}
          </motion.text>
        );
      })}

      {/* Orbiting Moon dot — Moon-Sun difference / 6 degrees */}
      <motion.g
        animate={{ rotate: 360 }}
        transition={{ duration: 50, repeat: Infinity, ease: 'linear' }}
        style={{ transformOrigin: `${CX}px ${CY}px` }}
      >
        <circle cx={CX} cy={CY - OUTER_R + 12} r="5" fill="#f5e6b8" opacity="0.85" filter="url(#moonGlowK)" />
        <circle cx={CX} cy={CY - OUTER_R + 12} r="2.5" fill="#fffbe6" opacity="0.5" />
      </motion.g>

      {/* Center disc */}
      <circle cx={CX} cy={CY} r="75" fill="#0a0e27" stroke="rgba(212,168,83,0.15)" strokeWidth="0.5" />
      <text x={CX} y={CY - 20} fill="#f0d48a" fontSize="13" textAnchor="middle" fontWeight="bold" fontFamily="var(--font-heading)">
        {tl({ en: 'KARANA', hi: 'करण', sa: 'करणम्', ta: 'கரணம்', te: 'కరణం', bn: 'করণ', kn: 'ಕರಣ', gu: 'કરણ', mai: 'करण', mr: 'करण' }, locale)}
      </text>
      <text x={CX} y={CY - 3} fill="rgba(212,168,83,0.5)" fontSize="8" textAnchor="middle">
        {tl({ en: '60 Half-Tithis', hi: '60 अर्ध-तिथि', sa: 'षष्टिः अर्धतिथयः', ta: '60 அரை-திதிகள்', te: '60 అర్ధ-తిథులు', bn: '60 অর্ধ-তিথি', kn: '60 ಅರ್ಧ-ತಿಥಿಗಳು', gu: '60 અર્ધ-તિથિ', mai: '60 अर्ध-तिथि', mr: '60 अर्ध-तिथी' }, locale)}
      </text>
      <text x={CX} y={CY + 14} fill="#4ade80" fontSize="10" textAnchor="middle" fontFamily="var(--font-heading)">
        {tl({ en: '7 CHARA', hi: '7 चर', sa: 'सप्त चराणि', ta: '7 சர', te: '7 చర', bn: '7 চর', kn: '7 ಚರ', gu: '7 ચર', mai: '7 चर', mr: '7 चर' }, locale)}
      </text>
      <text x={CX} y={CY + 28} fill="rgba(74,222,128,0.45)" fontSize="7" textAnchor="middle">
        {tl({ en: 'cycle 8 times', hi: '8 बार चक्र', sa: 'अष्टवारं आवर्तते', ta: '8 முறை சுழல்கிறது', te: '8 సార్లు చక్రం', bn: '8 বার চক্র', kn: '8 ಬಾರಿ ಚಕ್ರ', gu: '8 વખત ચક્ર', mai: '8 बेर चक्र', mr: '8 वेळा चक्र' }, locale)}
      </text>
      <text x={CX} y={CY + 44} fill="#f87171" fontSize="10" textAnchor="middle" fontFamily="var(--font-heading)">
        {tl({ en: '4 STHIRA', hi: '4 स्थिर', sa: 'चत्वारि स्थिराणि', ta: '4 ஸ்திர', te: '4 స్థిర', bn: '4 স্থির', kn: '4 ಸ್ಥಿರ', gu: '4 સ્થિર', mai: '4 स्थिर', mr: '4 स्थिर' }, locale)}
      </text>
      <text x={CX} y={CY + 57} fill="rgba(248,113,113,0.45)" fontSize="7" textAnchor="middle">
        {tl({ en: 'appear once', hi: 'एक बार', sa: 'एकवारम् आयाति', ta: 'ஒரு முறை வருகிறது', te: 'ఒక్కసారి వస్తుంది', bn: 'একবার আসে', kn: 'ಒಮ್ಮೆ ಬರುತ್ತದೆ', gu: 'એક વખત આવે છે', mai: 'एक बेर आबैत अछि', mr: 'एकदा येते' }, locale)}
      </text>

      {/* Legend at bottom */}
      <circle cx={55} cy={468} r="5" fill="#4ade80" opacity="0.6" />
      <text x={70} y={471} fill="#4ade80" fontSize="8" fontWeight="500">
        {tl({ en: 'Chara (Movable)', hi: 'चर (गतिशील)', sa: 'चरम् (चलम्)', ta: 'சர (நகரும்)', te: 'చర (చర)', bn: 'চর (গতিশীল)', kn: 'ಚರ (ಚಲನಶೀಲ)', gu: 'ચર (ચળ)', mai: 'चर (गतिशील)', mr: 'चर (चल)' }, locale)}
      </text>
      <circle cx={195} cy={468} r="5" fill="#ef4444" opacity="0.6" />
      <text x={210} y={471} fill="#ef4444" fontSize="8" fontWeight="500">
        {tl({ en: 'Vishti / Bhadra', hi: 'विष्टि / भद्रा', sa: 'विष्टिः / भद्रा', ta: 'விஷ்டி / பத்ரா', te: 'విష్టి / భద్ర', bn: 'বিষ্টি / ভদ্রা', kn: 'ವಿಷ್ಟಿ / ಭದ್ರಾ', gu: 'વિષ્ટિ / ભદ્રા', mai: 'विष्टि / भद्रा', mr: 'विष्टी / भद्रा' }, locale)}
      </text>
      <circle cx={345} cy={468} r="5" fill="#f87171" opacity="0.6" />
      <text x={360} y={471} fill="#f87171" fontSize="8" fontWeight="500">
        {tl({ en: 'Sthira (Fixed)', hi: 'स्थिर (अचल)', sa: 'स्थिरम् (अचलम्)', ta: 'ஸ்திர (நிலையான)', te: 'స్థిర (స్థిర)', bn: 'স্থির (অচল)', kn: 'ಸ್ಥಿರ (ಅಚಲ)', gu: 'સ્થિર (અચળ)', mai: 'स्थिर (अचल)', mr: 'स्थिर (अचल)' }, locale)}
      </text>
    </motion.svg>
  );
}

/* ------------------------------------------------------------------ */
/*  AngularSeparationDiagram — 6 degree increments                     */
/* ------------------------------------------------------------------ */
function AngularSeparationDiagram({ locale }: { locale: Locale }) {
  const isDevanagari = isDevanagariLocale(locale);
  return (
    <motion.svg
      viewBox="0 0 620 240"
      className="w-full max-w-2xl mx-auto"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8 }}
    >
      <defs>
        <radialGradient id="sunGradK" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#f39c12" />
          <stop offset="100%" stopColor="#e67e22" />
        </radialGradient>
        <radialGradient id="moonGradK" cx="40%" cy="35%">
          <stop offset="0%" stopColor="#f5e6b8" />
          <stop offset="100%" stopColor="#d4a853" />
        </radialGradient>
        <radialGradient id="earthGradK" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#3498db" />
          <stop offset="100%" stopColor="#2980b9" />
        </radialGradient>
      </defs>

      {/* Ecliptic line */}
      <motion.line
        x1="30" y1="110" x2="590" y2="110"
        stroke="rgba(212,168,83,0.15)" strokeWidth="1" strokeDasharray="4 4"
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
        transition={{ duration: 1 }}
      />

      {/* Sun */}
      <motion.g initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.3, type: 'spring' }}>
        <circle cx="100" cy="110" r="28" fill="url(#sunGradK)" />
        <circle cx="100" cy="110" r="34" fill="none" stroke="#f39c12" strokeWidth="0.5" opacity="0.3" />
        {/* Sun rays */}
        {Array.from({ length: 8 }, (_, i) => {
          const a = (i * 45) * Math.PI / 180;
          return (
            <motion.line
              key={i}
              x1={100 + 30 * Math.cos(a)} y1={110 + 30 * Math.sin(a)}
              x2={100 + 38 * Math.cos(a)} y2={110 + 38 * Math.sin(a)}
              stroke="#f39c12" strokeWidth="1.5" opacity="0.4"
              initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
              transition={{ delay: 0.5 + i * 0.05 }}
            />
          );
        })}
        <text x="100" y="160" fill="#f39c12" fontSize="11" textAnchor="middle" fontWeight="600">
          {tl({ en: 'Sun', hi: 'सूर्य', sa: 'सूर्यः', ta: 'சூரியன்', te: 'సూర్యుడు', bn: 'সূর্য', kn: 'ಸೂರ್ಯ', gu: 'સૂર્ય', mai: 'सूर्य', mr: 'सूर्य' }, locale)}
        </text>
        <text x="100" y="175" fill="#f39c12" fontSize="8" textAnchor="middle" opacity="0.6">0°</text>
      </motion.g>

      {/* 6-degree increment markers between Sun and Moon */}
      {[1, 2, 3, 4, 5].map((tick) => {
        const xPos = 100 + tick * 50;
        return (
          <motion.g
            key={tick}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 + tick * 0.1 }}
          >
            <line
              x1={xPos} y1="95" x2={xPos} y2="125"
              stroke="rgba(212,168,83,0.25)" strokeWidth="1"
            />
            <text x={xPos} y="88" fill="rgba(212,168,83,0.5)" fontSize="7" textAnchor="middle">
              {tick * 6}°
            </text>
          </motion.g>
        );
      })}

      {/* Moon */}
      <motion.g initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.7, type: 'spring' }}>
        <circle cx="400" cy="110" r="18" fill="url(#moonGradK)" />
        <text x="400" y="150" fill="#d4a853" fontSize="11" textAnchor="middle" fontWeight="600">
          {tl({ en: 'Moon', hi: 'चन्द्र', sa: 'चन्द्रः', ta: 'சந்திரன்', te: 'చంద్రుడు', bn: 'চন্দ্র', kn: 'ಚಂದ್ರ', gu: 'ચંદ્ર', mai: 'चन्द्र', mr: 'चंद्र' }, locale)}
        </text>
        <text x="400" y="165" fill="#d4a853" fontSize="8" textAnchor="middle" opacity="0.6">
          {tl({ en: '+6° ahead', hi: '+6° आगे', sa: '+6° अग्रे', ta: '+6° முன்னேறி', te: '+6° ముందు', bn: '+6° সামনে', kn: '+6° ಮುಂದೆ', gu: '+6° આગળ', mai: '+6° आगाँ', mr: '+6° पुढे' }, locale)}
        </text>
      </motion.g>

      {/* 6-degree angular separation arc */}
      <motion.path
        d="M 100 78 Q 250 15 400 78"
        fill="none" stroke="#4ade80" strokeWidth="1.5" strokeDasharray="4 3"
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
        transition={{ delay: 0.9, duration: 0.8 }}
      />
      <motion.text
        x="250" y="32" fill="#4ade80" fontSize="11" textAnchor="middle" fontWeight="600"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        transition={{ delay: 1.3 }}
      >
        {tl({ en: '6° = 1 Karana = Half Tithi', hi: '6° = 1 करण = अर्ध तिथि', sa: '6° = एकं करणम् = अर्धतिथिः', ta: '6° = 1 கரணம் = அரை திதி', te: '6° = 1 కరణం = అర్ధ తిథి', bn: '6° = 1 করণ = অর্ধ তিথি', kn: '6° = 1 ಕರಣ = ಅರ್ಧ ತಿಥಿ', gu: '6° = 1 કરણ = અર્ધ તિથિ', mai: '6° = 1 करण = अर्ध तिथि', mr: '6° = 1 करण = अर्ध तिथी' }, locale)}
      </motion.text>

      {/* Tithi bracket */}
      <motion.path
        d="M 100 135 L 100 185 L 400 185 L 400 135"
        fill="none" stroke="rgba(240,212,138,0.3)" strokeWidth="1" strokeDasharray="3 3"
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
        transition={{ delay: 1.1, duration: 0.6 }}
      />
      <motion.text
        x="250" y="202" fill="rgba(240,212,138,0.6)" fontSize="9" textAnchor="middle"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
      >
        {tl({ en: '12° = 1 Tithi = 2 Karanas', hi: '12° = 1 तिथि = 2 करण', sa: '12° = एका तिथिः = द्वे करणे', ta: '12° = 1 திதி = 2 கரணங்கள்', te: '12° = 1 తిథి = 2 కరణాలు', bn: '12° = 1 তিথি = 2 করণ', kn: '12° = 1 ತಿಥಿ = 2 ಕರಣಗಳು', gu: '12° = 1 તિથિ = 2 કરણ', mai: '12° = 1 तिथि = 2 करण', mr: '12° = 1 तिथी = 2 करण' }, locale)}
      </motion.text>

      {/* Result box */}
      <motion.g
        initial={{ opacity: 0, x: 30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 1.6 }}
      >
        <rect x="460" y="72" width="145" height="76" rx="8" fill="rgba(74,222,128,0.08)" stroke="rgba(74,222,128,0.3)" strokeWidth="1" />
        <text x="532" y="95" fill="#4ade80" fontSize="8" textAnchor="middle" opacity="0.8">
          {tl({ en: 'Formula', hi: 'सूत्र', sa: 'सूत्रम्', ta: 'சூத்திரம்', te: 'సూత్రం', bn: 'সূত্র', kn: 'ಸೂತ್ರ', gu: 'સૂત્ર', mai: 'सूत्र', mr: 'सूत्र' }, locale)}
        </text>
        <text x="532" y="112" fill="#4ade80" fontSize="9" textAnchor="middle" fontWeight="bold" fontFamily="monospace">
          K = floor(D/6°)
        </text>
        <text x="532" y="128" fill="rgba(74,222,128,0.6)" fontSize="7" textAnchor="middle">
          D = Moon - Sun
        </text>
        <text x="532" y="142" fill="rgba(74,222,128,0.5)" fontSize="7" textAnchor="middle">
          {tl({ en: '60 Karanas / month', hi: '60 करण / मास', sa: 'षष्टिः करणानि / मासः', ta: '60 கரணங்கள் / மாதம்', te: '60 కరణాలు / నెల', bn: '60 করণ / মাস', kn: '60 ಕರಣಗಳು / ತಿಂಗಳು', gu: '60 કરણ / મહિનો', mai: '60 करण / मास', mr: '60 करण / महिना' }, locale)}
        </text>
      </motion.g>
    </motion.svg>
  );
}

/* ------------------------------------------------------------------ */
/*  Main Page                                                          */
/* ------------------------------------------------------------------ */
export default function KaranaPage() {
  const t = useTranslations('deepDive');
  const locale = useLocale() as Locale;
  const isTamil = String(locale) === 'ta';
  const isDevanagari = isDevanagariLocale(locale);
  const headingFont = isDevanagari ? { fontFamily: 'var(--font-devanagari-heading)' } : { fontFamily: 'var(--font-heading)' };

  const [selectedKarana, setSelectedKarana] = useState<number | null>(null);

  const chara = KARANAS.filter((k) => k.type === 'chara');
  const sthira = KARANAS.filter((k) => k.type === 'sthira');

  const handleSelectSlot = (pos: number) => {
    setSelectedKarana(pos === selectedKarana ? null : pos);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <Link href="/panchang" className="inline-flex items-center gap-2 text-gold-primary hover:text-gold-light mb-8 transition-colors">
        <ArrowLeft className="w-4 h-4" /> {t('backToPanchang')}
      </Link>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-6 mb-6">
        <KaranaIcon size={72} />
        <div>
          <h1 className="text-4xl sm:text-5xl font-bold mb-4" style={headingFont}>
            <span className="text-gold-gradient">{tl({ en: 'Karana', hi: 'करण', sa: 'करणम्', ta: 'கரணம்', te: 'కరణం', bn: 'করণ', kn: 'ಕರಣ', gu: 'કરણ', mai: 'करण', mr: 'करण' }, locale)}</span>
          </h1>
          <p className="text-text-secondary text-lg" style={{ fontFamily: 'var(--font-heading)' }}>
            {tl({ en: 'The Half-Tithi — 11 Building Blocks of Lunar Time', hi: 'अर्ध-तिथि — चान्द्र काल के 11 खण्ड', sa: 'अर्धतिथिः — चान्द्रकालस्य एकादश खण्डाः', ta: 'அரை-திதி — சந்திர காலத்தின் 11 கட்டுமான தொகுதிகள்', te: 'అర్ధ-తిథి — చంద్ర కాలంలో 11 నిర్మాణ ఖండాలు', bn: 'অর্ধ-তিথি — চান্দ্রকালের ১১টি নির্মাণ খণ্ড', kn: 'ಅರ್ಧ-ತಿಥಿ — ಚಾಂದ್ರ ಕಾಲದ 11 ನಿರ್ಮಾಣ ಖಂಡಗಳು', gu: 'અર્ધ-તિથિ — ચાંદ્ર કાળના 11 નિર્માણ ખંડ', mai: 'अर्ध-तिथि — चान्द्र काल केँ 11 खण्ड', mr: 'अर्ध-तिथी — चांद्र कालाचे 11 घटक' }, locale)}
          </p>
        </div>
      </motion.div>

      <GoldDivider />

      {/* Scientific Basis with Angular Separation Diagram */}
      <section className="my-12">
        <h2 className="text-2xl font-bold text-gold-gradient mb-6" style={headingFont}>{t('scientificBasis')}</h2>
        <div className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-8">
          <AngularSeparationDiagram locale={locale} />
          <div className="mt-8 prose prose-invert max-w-none text-text-secondary">
            <p className="text-lg leading-relaxed">
              {locale === 'en'
                ? `A Karana is half a Tithi, i.e., the time for the Moon to gain 6° over the Sun. There are 60 Karanas in a full lunar month (30 Tithis x 2). However, only 11 distinct Karanas exist: 7 "Chara" (movable) Karanas that cycle repeatedly through positions 2-58, and 4 "Sthira" (fixed) Karanas that appear only once each — Shakuni at position 1 (first half of Shukla Pratipada), and Chatushpada, Nagava, and Kimstughna occupying the last three positions (58-60). The Chara Karanas (Bava through Vishti) repeat 8 times across the month.`
                : tl({ en: `करणं तिथेः अर्धभागः, अर्थात् चन्द्रमसा सूर्यात् 6° अग्रे गमनस्य कालः। एकस्मिन् पूर्णचान्द्रमासे 60 करणानि भवन्ति। केवलम् 11 विशिष्टकरणानि सन्ति — 7 चरकरणानि यानि 2-58 स्थानेषु चक्रयन्ते, 4 स्थिरकरणानि च।`, hi: `करण तिथि का आधा भाग है, अर्थात् चन्द्रमा द्वारा सूर्य से 6° आगे बढ़ने का समय। एक पूर्ण चान्द्र मास में 60 करण होते हैं (30 तिथि x 2)। केवल 11 विशिष्ट करण हैं: 7 "चर" (गतिशील) करण जो स्थान 2-58 में चक्रित होते हैं, और 4 "स्थिर" करण जो केवल एक बार आते हैं — शकुनि स्थान 1 पर (शुक्ल प्रतिपदा का पूर्वार्ध), तथा चतुष्पद, नागव और किंस्तुघ्न अन्तिम तीन स्थानों (58-60) पर।`, sa: `करण तिथि का आधा भाग है, अर्थात् चन्द्रमा द्वारा सूर्य से 6° आगे बढ़ने का समय। एक पूर्ण चान्द्र मास में 60 करण होते हैं (30 तिथि x 2)। केवल 11 विशिष्ट करण हैं: 7 "चर" (गतिशील) करण जो स्थान 2-58 में चक्रित होते हैं, और 4 "स्थिर" करण जो केवल एक बार आते हैं — शकुनि स्थान 1 पर (शुक्ल प्रतिपदा का पूर्वार्ध), तथा चतुष्पद, नागव और किंस्तुघ्न अन्तिम तीन स्थानों (58-60) पर।`, ta: `करणं तिथेः अर्धभागः, अर्थात् चन्द्रमसा सूर्यात् 6° अग्रे गमनस्य कालः। एकस्मिन् पूर्णचान्द्रमासे 60 करणानि भवन्ति। केवलम् 11 विशिष्टकरणानि सन्ति — 7 चरकरणानि यानि 2-58 स्थानेषु चक्रयन्ते, 4 स्थिरकरणानि च।`, te: `करणं तिथेः अर्धभागः, अर्थात् चन्द्रमसा सूर्यात् 6° अग्रे गमनस्य कालः। एकस्मिन् पूर्णचान्द्रमासे 60 करणानि भवन्ति। केवलम् 11 विशिष्टकरणानि सन्ति — 7 चरकरणानि यानि 2-58 स्थानेषु चक्रयन्ते, 4 स्थिरकरणानि च।`, bn: `करणं तिथेः अर्धभागः, अर्थात् चन्द्रमसा सूर्यात् 6° अग्रे गमनस्य कालः। एकस्मिन् पूर्णचान्द्रमासे 60 करणानि भवन्ति। केवलम् 11 विशिष्टकरणानि सन्ति — 7 चरकरणानि यानि 2-58 स्थानेषु चक्रयन्ते, 4 स्थिरकरणानि च।`, kn: `करणं तिथेः अर्धभागः, अर्थात् चन्द्रमसा सूर्यात् 6° अग्रे गमनस्य कालः। एकस्मिन् पूर्णचान्द्रमासे 60 करणानि भवन्ति। केवलम् 11 विशिष्टकरणानि सन्ति — 7 चरकरणानि यानि 2-58 स्थानेषु चक्रयन्ते, 4 स्थिरकरणानि च।`, gu: `करणं तिथेः अर्धभागः, अर्थात् चन्द्रमसा सूर्यात् 6° अग्रे गमनस्य कालः। एकस्मिन् पूर्णचान्द्रमासे 60 करणानि भवन्ति। केवलम् 11 विशिष्टकरणानि सन्ति — 7 चरकरणानि यानि 2-58 स्थानेषु चक्रयन्ते, 4 स्थिरकरणानि च।`, mai: `करण तिथि का आधा भाग है, अर्थात् चन्द्रमा द्वारा सूर्य से 6° आगे बढ़ने का समय। एक पूर्ण चान्द्र मास में 60 करण होते हैं (30 तिथि x 2)। केवल 11 विशिष्ट करण हैं: 7 "चर" (गतिशील) करण जो स्थान 2-58 में चक्रित होते हैं, और 4 "स्थिर" करण जो केवल एक बार आते हैं — शकुनि स्थान 1 पर (शुक्ल प्रतिपदा का पूर्वार्ध), तथा चतुष्पद, नागव और किंस्तुघ्न अन्तिम तीन स्थानों (58-60) पर।`, mr: `करण तिथि का आधा भाग है, अर्थात् चन्द्रमा द्वारा सूर्य से 6° आगे बढ़ने का समय। एक पूर्ण चान्द्र मास में 60 करण होते हैं (30 तिथि x 2)। केवल 11 विशिष्ट करण हैं: 7 "चर" (गतिशील) करण जो स्थान 2-58 में चक्रित होते हैं, और 4 "स्थिर" करण जो केवल एक बार आते हैं — शकुनि स्थान 1 पर (शुक्ल प्रतिपदा का पूर्वार्ध), तथा चतुष्पद, नागव और किंस्तुघ्न अन्तिम तीन स्थानों (58-60) पर।` }, locale)}
            </p>
            <motion.div
              className="mt-6 p-4 bg-bg-primary/50 rounded-lg border border-gold-primary/10"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <p className="text-gold-light font-mono text-sm">
                {tl({ en: 'Formula:', hi: 'सूत्र:', sa: 'सूत्रम्:', ta: 'சூத்திரம்:', te: 'సూత్రం:', bn: 'সূত্র:', kn: 'ಸೂತ್ರ:', gu: 'સૂત્ર:', mai: 'सूत्र:', mr: 'सूत्र:' }, locale)} Karana_index = floor((Moon_long - Sun_long) / 6°)
              </p>
              <p className="text-gold-light/70 font-mono text-xs mt-1">
                {tl({ en: '60 Karanas = 7 Chara (cycle 8x) + 4 Sthira (once each)', hi: '60 करण = 7 चर (8 बार) + 4 स्थिर (एक बार)', sa: 'षष्टिः करणानि = सप्त चराणि (अष्टवारम्) + चत्वारि स्थिराणि (एकवारम्)', ta: '60 கரணங்கள் = 7 சர (8 முறை சுழல்) + 4 ஸ்திர (ஒவ்வொன்றும் ஒரு முறை)', te: '60 కరణాలు = 7 చర (8 సార్లు) + 4 స్థిర (ఒక్కొక్కటి ఒకసారి)', bn: '60 করণ = 7 চর (8 বার) + 4 স্থির (প্রতিটি একবার)', kn: '60 ಕರಣಗಳು = 7 ಚರ (8 ಬಾರಿ) + 4 ಸ್ಥಿರ (ಪ್ರತಿಯೊಂದೂ ಒಮ್ಮೆ)', gu: '60 કરણ = 7 ચર (8 વખત) + 4 સ્થિર (દરેક એકવાર)', mai: '60 करण = 7 चर (8 बेर) + 4 स्थिर (एक-एक बेर)', mr: '60 करण = 7 चर (8 वेळा) + 4 स्थिर (प्रत्येकी एकदा)' }, locale)}
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Interactive Karana Wheel */}
      <section className="my-12">
        <h2 className="text-2xl font-bold text-gold-gradient mb-6" style={headingFont}>
          {tl({ en: 'Interactive Karana Wheel — 60 Half-Tithis', hi: 'इंटरैक्टिव करण चक्र — 60 अर्ध-तिथियाँ', sa: 'सक्रियकरणचक्रम् — षष्टिः अर्धतिथयः', ta: 'இடைவினைப்பு கரண சக்கரம் — 60 அரை-திதிகள்', te: 'ఇంటరాక్టివ్ కరణ చక్రం — 60 అర్ధ-తిథులు', bn: 'ইন্টারেক্টিভ করণ চক্র — 60 অর্ধ-তিথি', kn: 'ಸಂವಾದಾತ್ಮಕ ಕರಣ ಚಕ್ರ — 60 ಅರ್ಧ-ತಿಥಿಗಳು', gu: 'ઇન્ટરેક્ટિવ કરણ ચક્ર — 60 અર્ધ-તિથિ', mai: 'इंटरैक्टिव करण चक्र — 60 अर्ध-तिथि', mr: 'परस्परसंवादी करण चक्र — 60 अर्ध-तिथी' }, locale)}
        </h2>
        <div className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-8">
          <AnimatedKaranaWheel
            locale={locale}
            onSelect={handleSelectSlot}
            selectedKarana={selectedKarana}
          />

          {/* Selected karana detail panel */}
          <AnimatePresence mode="wait">
            {selectedKarana !== null && (() => {
              const { karana, isSthira } = getKaranaAt(selectedKarana);
              const color = isSthira ? 'red' : karana.name.en === 'Vishti' ? 'red' : 'emerald';
              const badgeClasses = color === 'red'
                ? 'bg-red-500/20 text-red-400'
                : 'bg-emerald-500/20 text-emerald-400';
              return (
                <motion.div
                  key={selectedKarana}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="mt-8 bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-6 max-w-md mx-auto"
                >
                  <div className="flex items-center justify-between mb-3">
                    <h3
                      className="text-gold-light text-lg font-bold"
                      style={isDevanagari ? { fontFamily: 'var(--font-devanagari-heading)' } : undefined}
                    >
                      {karana.name[locale]}
                    </h3>
                    <span className={`text-xs px-2 py-1 rounded-full ${badgeClasses}`}>
                      {isSthira
                        ? (tl({ en: 'Sthira (Fixed)', hi: 'स्थिर', sa: 'स्थिरम् (अचलम्)', ta: 'ஸ்திர (நிலையான)', te: 'స్థిర (స్థిర)', bn: 'স্থির (অচল)', kn: 'ಸ್ಥಿರ (ಅಚಲ)', gu: 'સ્થિર (અચળ)', mai: 'स्थिर (अचल)', mr: 'स्थिर (अचल)' }, locale))
                        : karana.name.en === 'Vishti'
                        ? (tl({ en: 'Vishti / Bhadra', hi: 'विष्टि / भद्रा', sa: 'विष्टिः / भद्रा', ta: 'விஷ்டி / பத்ரா', te: 'విష్టి / భద్ర', bn: 'বিষ্টি / ভদ্রা', kn: 'ವಿಷ್ಟಿ / ಭದ್ರಾ', gu: 'વિષ્ટિ / ભદ્રા', mai: 'विष्टि / भद्रा', mr: 'विष्टी / भद्रा' }, locale))
                        : (tl({ en: 'Chara (Movable)', hi: 'चर', sa: 'चरम् (चलम्)', ta: 'சர (நகரும்)', te: 'చర (చర)', bn: 'চর (গতিশীল)', kn: 'ಚರ (ಚಲನಶೀಲ)', gu: 'ચર (ચળ)', mai: 'चर (गतिशील)', mr: 'चर (चल)' }, locale))}
                    </span>
                  </div>
                  <div className="text-text-secondary text-sm space-y-1">
                    <p>
                      <span className="text-gold-dark">{tl({ en: 'Position:', hi: 'स्थान:', sa: 'स्थानम्:', ta: 'நிலை:', te: 'స్థానం:', bn: 'অবস্থান:', kn: 'ಸ್ಥಾನ:', gu: 'સ્થાન:', mai: 'स्थान:', mr: 'स्थान:' }, locale)}</span>{' '}
                      {selectedKarana + 1} / 60
                    </p>
                    <p>
                      <span className="text-gold-dark">{tl({ en: 'Angular Span:', hi: 'कोणीय विस्तार:', sa: 'कोणीयविस्तारः:', ta: 'கோண வீச்சு:', te: 'కోణీయ విస్తీర్ణం:', bn: 'কোণীয় বিস্তার:', kn: 'ಕೋನೀಯ ವ್ಯಾಪ್ತಿ:', gu: 'કોણીય વ્યાપ:', mai: 'कोणीय विस्तार:', mr: 'कोनीय विस्तार:' }, locale)}</span>{' '}
                      {(selectedKarana * 6)}° — {((selectedKarana + 1) * 6)}°
                    </p>
                    <p>
                      <span className="text-gold-dark">{tl({ en: 'Within Tithi:', hi: 'तिथि में:', sa: 'तिथ्यन्तर्गतम्:', ta: 'திதியின் உள்ளே:', te: 'తిథిలో:', bn: 'তিথির মধ্যে:', kn: 'ತಿಥಿಯ ಒಳಗೆ:', gu: 'તિથિની અંદર:', mai: 'तिथि मे:', mr: 'तिथीमध्ये:' }, locale)}</span>{' '}
                      {locale === 'en'
                        ? `Tithi ${Math.floor(selectedKarana / 2) + 1}, ${selectedKarana % 2 === 0 ? '1st' : '2nd'} half`
                        : `तिथि ${Math.floor(selectedKarana / 2) + 1}, ${selectedKarana % 2 === 0 ? 'पूर्वार्ध' : 'उत्तरार्ध'}`}
                    </p>
                    <p>
                      <span className="text-gold-dark">{tl({ en: 'Karana #:', hi: 'करण #:', sa: 'करणसंख्या:', ta: 'கரணம் #:', te: 'కరణం #:', bn: 'করণ #:', kn: 'ಕರಣ #:', gu: 'કરણ #:', mai: 'करण #:', mr: 'करण #:' }, locale)}</span>{' '}
                      {karana.number} ({karana.name.en})
                    </p>
                    {karana.name.en === 'Vishti' && (
                      <p className="text-red-400 text-xs mt-2 border-t border-red-500/20 pt-2">
                        {locale === 'en'
                          ? 'Vishti (Bhadra) is considered inauspicious. Avoid starting new ventures.'
                          : 'विष्टि (भद्रा) अशुभ मानी जाती है। नए कार्य आरम्भ न करें।'}
                      </p>
                    )}
                    {isSthira && (
                      <p className="text-red-400/80 text-xs mt-2 border-t border-red-500/20 pt-2">
                        {locale === 'en'
                          ? `${karana.name.en} is a Sthira (fixed) Karana that appears only once per lunar month.`
                          : `${karana.name[locale]} एक स्थिर करण है जो प्रति चान्द्र मास में केवल एक बार आता है।`}
                      </p>
                    )}
                  </div>
                </motion.div>
              );
            })()}
          </AnimatePresence>

          <p className="text-text-secondary text-xs text-center mt-4">
            {tl({ en: 'Click on any sector to see details', hi: 'विवरण देखने के लिए किसी भी खंड पर क्लिक करें', sa: 'विवरणार्थं यस्मिंश्चित् खण्डे क्लिक्कयत', ta: 'விவரங்கள் காண எந்த பகுதியிலும் கிளிக் செய்யுங்கள்', te: 'వివరాలు చూడటానికి ఏదైనా విభాగంపై క్లిక్ చేయండి', bn: 'বিবরণ দেখতে যেকোনো বিভাগে ক্লিক করুন', kn: 'ವಿವರಗಳನ್ನು ನೋಡಲು ಯಾವುದಾದರೂ ವಿಭಾಗದಲ್ಲಿ ಕ್ಲಿಕ್ ಮಾಡಿ', gu: 'વિગતો જોવા માટે કોઈ પણ વિભાગ પર ક્લિક કરો', mai: 'विवरण देखबाक लेल कोनो खंड पर क्लिक करू', mr: 'तपशील पाहण्यासाठी कोणत्याही विभागावर क्लिक करा' }, locale)}
          </p>
        </div>
      </section>

      <GoldDivider />

      {/* Complete Listing */}
      <section className="my-12">
        <h2 className="text-2xl font-bold text-gold-gradient mb-6" style={headingFont}>{t('completeListing')}</h2>

        {/* Chara Karanas */}
        <h3 className="text-xl text-gold-light mb-4" style={headingFont}>
          {tl({ en: 'Chara Karanas (Movable — cycle 8 times)', hi: 'चर करण (गतिशील — 8 बार चक्र)', sa: 'चरकरणानि (चलानि — अष्टवारम् आवर्तन्ते)', ta: 'சர கரணங்கள் (நகரும் — 8 முறை சுழற்சி)', te: 'చర కరణాలు (చర — 8 సార్లు చక్రం)', bn: 'চর করণ (গতিশীল — 8 বার চক্র)', kn: 'ಚರ ಕರಣಗಳು (ಚಲನಶೀಲ — 8 ಬಾರಿ ಚಕ್ರ)', gu: 'ચર કરણ (ચળ — 8 વખત ચક્ર)', mai: 'चर करण (गतिशील — 8 बेर चक्र)', mr: 'चर करण (चल — 8 वेळा चक्र)' }, locale)}
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 mb-8">
          {chara.map((karana, i) => (
            <motion.div
              key={karana.number}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.03 }}
              whileHover={{ scale: 1.05, borderColor: karana.name.en === 'Vishti' ? 'rgba(239,68,68,0.5)' : 'rgba(74,222,128,0.4)' }}
              className={`bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-lg p-4 text-center cursor-pointer border ${
                karana.name.en === 'Vishti' ? 'border-red-500/20' : 'border-emerald-500/10'
              }`}
              onClick={() => {
                // Find first occurrence of this chara in the 60-slot sequence (pos 1 = index 1)
                setSelectedKarana(i + 1);
              }}
            >
              <div className={`text-2xl mb-1 ${karana.name.en === 'Vishti' ? 'text-red-400' : 'text-gold-primary'}`}>
                {karana.number}
              </div>
              <div className="text-gold-light font-semibold text-sm" style={isDevanagari ? { fontFamily: 'var(--font-devanagari-heading)' } : undefined}>
                {karana.name[locale]}
              </div>
              <div className={`text-xs mt-1 ${karana.name.en === 'Vishti' ? 'text-red-400' : 'text-emerald-400'}`}>
                {karana.name.en === 'Vishti'
                  ? (tl({ en: 'Vishti / Bhadra', hi: 'विष्टि / भद्रा', sa: 'विष्टिः / भद्रा', ta: 'விஷ்டி / பத்ரா', te: 'విష్టి / భద్ర', bn: 'বিষ্টি / ভদ্রা', kn: 'ವಿಷ್ಟಿ / ಭದ್ರಾ', gu: 'વિષ્ટિ / ભદ્રા', mai: 'विष्टि / भद्रा', mr: 'विष्टी / भद्रा' }, locale))
                  : (tl({ en: 'Chara (Movable)', hi: 'चर (गतिशील)', sa: 'चरम् (चलम्)', ta: 'சர (நகரும்)', te: 'చర (చర)', bn: 'চর (গতিশীল)', kn: 'ಚರ (ಚಲನಶೀಲ)', gu: 'ચર (ચળ)', mai: 'चर (गतिशील)', mr: 'चर (चल)' }, locale))}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Sthira Karanas */}
        <h3 className="text-xl text-red-400/80 mb-4" style={headingFont}>
          {tl({ en: 'Sthira Karanas (Fixed — appear once each)', hi: 'स्थिर करण (अचल — प्रत्येक एक बार)', sa: 'स्थिरकरणानि (अचलानि — प्रत्येकम् एकवारम् आगच्छन्ति)', ta: 'ஸ்திர கரணங்கள் (நிலையான — ஒவ்வொன்றும் ஒரு முறை மட்டும்)', te: 'స్థిర కరణాలు (అచలమైన — ప్రతిది ఒకసారి మాత్రమే వస్తాయి)', bn: 'স্থির করণ (অচল — প্রতিটি একবার করে আসে)', kn: 'ಸ್ಥಿರ ಕರಣಗಳು (ಅಚಲ — ಪ್ರತಿಯೊಂದೂ ಒಮ್ಮೆ ಮಾತ್ರ ಬರುತ್ತದೆ)', gu: 'સ્થિર કરણ (અચળ — દરેક એક વાર આવે છે)', mai: 'स्थिर करण (अचल — प्रत्येक एक बेर अबैत अछि)', mr: 'स्थिर करणे (अचल — प्रत्येक एकदाच येतात)' }, locale)}
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {sthira.map((karana, i) => {
            // Map sthira to their wheel positions
            const slotPositions = [0, 57, 58, 59];
            return (
              <motion.div
                key={karana.number}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.03 }}
                whileHover={{ scale: 1.05, borderColor: 'rgba(248,113,113,0.5)' }}
                className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-lg p-4 text-center border border-red-500/10 cursor-pointer"
                onClick={() => setSelectedKarana(slotPositions[i])}
              >
                <div className="text-red-400/80 text-2xl mb-1">{karana.number}</div>
                <div className="text-gold-light font-semibold text-sm" style={isDevanagari ? { fontFamily: 'var(--font-devanagari-heading)' } : undefined}>
                  {karana.name[locale]}
                </div>
                <div className="text-red-400 text-xs mt-1">
                  {tl({ en: 'Sthira (Fixed)', hi: 'स्थिर (अचल)', sa: 'स्थिरम् (अचलम्)', ta: 'ஸ்திர (நிலையான)', te: 'స్థిర (స్థిర)', bn: 'স্থির (অচল)', kn: 'ಸ್ಥಿರ (ಅಚಲ)', gu: 'સ્થિર (અચળ)', mai: 'स्थिर (अचल)', mr: 'स्थिर (अचल)' }, locale)}
                </div>
                <div className="text-red-400/50 text-xs mt-0.5">
                  {tl({ en: `Position ${slotPositions[i] + 1}`, hi: `स्थान ${slotPositions[i] + 1}`, sa: `स्थान ${slotPositions[i] + 1}`, ta: `Position ${slotPositions[i] + 1}`, te: `Position ${slotPositions[i] + 1}`, bn: `Position ${slotPositions[i] + 1}`, kn: `Position ${slotPositions[i] + 1}`, gu: `Position ${slotPositions[i] + 1}`, mai: `स्थान ${slotPositions[i] + 1}`, mr: `स्थान ${slotPositions[i] + 1}` }, locale)}
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
