'use client';

import { motion } from 'framer-motion';
import { useLocale } from 'next-intl';
import type { Locale } from '@/types/panchang';

// Exact house paths from ChartNorth.tsx (500x500 viewBox)
const HOUSE_PATHS: Record<number, { path: string; cx: number; cy: number; signX: number; signY: number }> = {
  1:  { path: 'M 250 25 L 137 138 L 250 250 L 363 138 Z', cx: 250, cy: 130, signX: 250, signY: 60 },
  2:  { path: 'M 25 25 L 137 138 L 250 25 Z', cx: 135, cy: 60, signX: 88, signY: 38 },
  3:  { path: 'M 25 25 L 25 250 L 137 138 Z', cx: 60, cy: 135, signX: 38, signY: 88 },
  4:  { path: 'M 25 250 L 137 138 L 250 250 L 137 363 Z', cx: 130, cy: 250, signX: 60, signY: 250 },
  5:  { path: 'M 25 250 L 137 363 L 25 475 Z', cx: 60, cy: 365, signX: 38, signY: 412 },
  6:  { path: 'M 25 475 L 137 363 L 250 475 Z', cx: 135, cy: 440, signX: 88, signY: 462 },
  7:  { path: 'M 250 475 L 137 363 L 250 250 L 363 363 Z', cx: 250, cy: 370, signX: 250, signY: 440 },
  8:  { path: 'M 250 475 L 363 363 L 475 475 Z', cx: 365, cy: 440, signX: 412, signY: 462 },
  9:  { path: 'M 475 475 L 363 363 L 475 250 Z', cx: 440, cy: 365, signX: 462, signY: 412 },
  10: { path: 'M 475 250 L 363 363 L 250 250 L 363 138 Z', cx: 370, cy: 250, signX: 440, signY: 250 },
  11: { path: 'M 475 250 L 363 138 L 475 25 Z', cx: 440, cy: 135, signX: 462, signY: 88 },
  12: { path: 'M 475 25 L 363 138 L 250 25 Z', cx: 365, cy: 60, signX: 412, signY: 38 },
};

// Example: 15 Aug 1995, 10:30 AM IST, New Delhi — Tula Lagna
const RASHI_NAMES: Record<string, Record<number, string>> = {
  en: { 1: 'Lib', 2: 'Sco', 3: 'Sag', 4: 'Cap', 5: 'Aqu', 6: 'Pis', 7: 'Ari', 8: 'Tau', 9: 'Gem', 10: 'Can', 11: 'Leo', 12: 'Vir' },
  hi: { 1: 'तुला', 2: 'वृश्चि', 3: 'धनु', 4: 'मकर', 5: 'कुम्भ', 6: 'मीन', 7: 'मेष', 8: 'वृष', 9: 'मिथु', 10: 'कर्क', 11: 'सिंह', 12: 'कन्या' },
  sa: { 1: 'तुला', 2: 'वृश्चि', 3: 'धनुः', 4: 'मकरः', 5: 'कुम्भः', 6: 'मीनः', 7: 'मेषः', 8: 'वृषः', 9: 'मिथु', 10: 'कर्कः', 11: 'सिंहः', 12: 'कन्या' },
};

// Planet placements: house number → planet names per locale
const PLANET_PLACEMENTS: Record<number, { names: Record<string, string>; color: string }[]> = {
  1:  [{ names: { en: 'Ra', hi: 'रा', sa: 'रा' }, color: '#8b5cf6' }],
  2:  [{ names: { en: 'Ju', hi: 'गु', sa: 'गु' }, color: '#f0d48a' }],
  3:  [{ names: { en: 'Mo', hi: 'च', sa: 'च' }, color: '#e2e8f0' }],
  5:  [{ names: { en: 'Sa', hi: 'श', sa: 'श' }, color: '#3b82f6' }],
  7:  [{ names: { en: 'Ke', hi: 'के', sa: 'के' }, color: '#9ca3af' }],
  10: [{ names: { en: 'Su', hi: 'सू', sa: 'सू' }, color: '#f59e0b' }],
  11: [
    { names: { en: 'Me', hi: 'बु', sa: 'बु' }, color: '#22c55e' },
    { names: { en: 'Ve', hi: 'शु', sa: 'शु' }, color: '#ec4899' },
  ],
  12: [{ names: { en: 'Ma', hi: 'मं', sa: 'मं' }, color: '#ef4444' }],
};

export default function ExampleKundaliChart({ size = 420 }: { size?: number }) {
  const locale = useLocale() as Locale;
  const isDevanagari = locale !== 'en';

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.92 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.7, ease: 'easeOut' as const }}
      className="flex flex-col items-center"
    >
      <svg
        viewBox="0 0 500 500"
        style={{ maxWidth: size, width: '100%' }}
        role="img"
        aria-label="Example Kundali chart for 15 August 1995, 10:30 AM IST, New Delhi"
      >
        <defs>
          <radialGradient id="exBg" cx="50%" cy="50%" r="70%">
            <stop offset="0%" stopColor="#141940" />
            <stop offset="100%" stopColor="#0a0e27" />
          </radialGradient>
          <linearGradient id="exGold" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#8a6d2b" />
            <stop offset="50%" stopColor="#d4a853" />
            <stop offset="100%" stopColor="#8a6d2b" />
          </linearGradient>
          <radialGradient id="exAscGlow" cx="50%" cy="30%" r="60%">
            <stop offset="0%" stopColor="rgba(212,168,83,0.15)" />
            <stop offset="100%" stopColor="rgba(212,168,83,0)" />
          </radialGradient>
          <filter id="exPGlow">
            <feGaussianBlur stdDeviation="1.5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Background */}
        <rect x="0" y="0" width="500" height="500" rx="16" fill="url(#exBg)" />

        {/* Outer border */}
        <rect x="22" y="22" width="456" height="456" fill="none" stroke="url(#exGold)" strokeWidth="1.5" />

        {/* Inner diamond */}
        <polygon points="250,25 475,250 250,475 25,250" fill="none" stroke="url(#exGold)" strokeWidth="1" />

        {/* Diagonal lines */}
        <line x1="25" y1="25" x2="250" y2="250" stroke="#d4a853" strokeWidth="0.6" strokeOpacity="0.35" />
        <line x1="475" y1="25" x2="250" y2="250" stroke="#d4a853" strokeWidth="0.6" strokeOpacity="0.35" />
        <line x1="25" y1="475" x2="250" y2="250" stroke="#d4a853" strokeWidth="0.6" strokeOpacity="0.35" />
        <line x1="475" y1="475" x2="250" y2="250" stroke="#d4a853" strokeWidth="0.6" strokeOpacity="0.35" />

        {/* Midpoint lines */}
        <line x1="25" y1="250" x2="475" y2="250" stroke="#d4a853" strokeWidth="0.4" strokeOpacity="0.2" />
        <line x1="250" y1="25" x2="250" y2="475" stroke="#d4a853" strokeWidth="0.4" strokeOpacity="0.2" />

        {/* Ascendant glow on House 1 */}
        <path d={HOUSE_PATHS[1].path} fill="url(#exAscGlow)" stroke="none" />

        {/* House sections */}
        {Object.entries(HOUSE_PATHS).map(([houseNum, { path, cx, cy, signX, signY }]) => {
          const hNum = parseInt(houseNum);
          const isAsc = hNum === 1;
          const rashiNames = RASHI_NAMES[locale] || RASHI_NAMES.en;
          const planets = PLANET_PLACEMENTS[hNum] || [];

          return (
            <g key={houseNum}>
              {/* Hover fill for houses with planets */}
              <path
                d={path}
                fill={planets.length > 0 ? 'rgba(212,168,83,0.03)' : 'transparent'}
                stroke="none"
              />

              {/* Rashi name */}
              <text
                x={signX}
                y={signY}
                fill={isAsc ? '#f0d48a' : 'rgba(212,168,83,0.6)'}
                fontSize={isAsc ? '12' : '10'}
                fontWeight={isAsc ? '700' : '500'}
                textAnchor="middle"
                dominantBaseline="middle"
                style={isDevanagari ? { fontFamily: 'var(--font-devanagari-body)' } : undefined}
              >
                {rashiNames[hNum]}
              </text>

              {/* House number */}
              <text
                x={signX}
                y={signY + (isAsc || hNum === 7 ? 13 : hNum <= 3 || hNum >= 10 ? 12 : -12)}
                fill="rgba(212,168,83,0.2)"
                fontSize="8"
                textAnchor="middle"
                dominantBaseline="middle"
              >
                {houseNum}
              </text>

              {/* Planets */}
              {planets.map((planet, pIdx) => {
                const count = planets.length;
                const spacing = count <= 2 ? 36 : 28;
                const offsetX = (pIdx - (count - 1) / 2) * spacing;

                return (
                  <g key={planet.names.en}>
                    <circle
                      cx={cx + offsetX}
                      cy={cy}
                      r="13"
                      fill={planet.color}
                      opacity="0.12"
                    />
                    <text
                      x={cx + offsetX}
                      y={cy}
                      fill={planet.color}
                      fontSize="14"
                      fontWeight="800"
                      textAnchor="middle"
                      dominantBaseline="middle"
                      filter="url(#exPGlow)"
                      style={isDevanagari ? { fontFamily: 'var(--font-devanagari-body)' } : { fontFamily: 'Inter, system-ui, sans-serif' }}
                    >
                      {planet.names[locale] || planet.names.en}
                    </text>
                  </g>
                );
              })}
            </g>
          );
        })}

        {/* Ascendant label */}
        <text x="250" y="16" fill="#f0d48a" fontSize="11" textAnchor="middle" fontWeight="bold" letterSpacing="1.5">
          {isDevanagari ? 'लग्न' : 'ASC'}
        </text>

        {/* Corner decorations */}
        <circle cx="22" cy="22" r="3.5" fill="#d4a853" opacity="0.35" />
        <circle cx="478" cy="22" r="3.5" fill="#d4a853" opacity="0.35" />
        <circle cx="22" cy="478" r="3.5" fill="#d4a853" opacity="0.35" />
        <circle cx="478" cy="478" r="3.5" fill="#d4a853" opacity="0.35" />

        {/* Diamond corner dots */}
        <circle cx="250" cy="25" r="3" fill="#d4a853" opacity="0.6" />
        <circle cx="475" cy="250" r="3" fill="#d4a853" opacity="0.6" />
        <circle cx="250" cy="475" r="3" fill="#d4a853" opacity="0.6" />
        <circle cx="25" cy="250" r="3" fill="#d4a853" opacity="0.6" />
      </svg>

      {/* Caption */}
      <p className="text-text-secondary/60 text-xs mt-3 text-center font-mono">
        {locale === 'en'
          ? '15 Aug 1995 \u00B7 10:30 AM IST \u00B7 New Delhi'
          : '15 अगस्त 1995 \u00B7 10:30 AM IST \u00B7 नई दिल्ली'}
      </p>
    </motion.div>
  );
}
