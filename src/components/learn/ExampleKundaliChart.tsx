'use client';

import { motion } from 'framer-motion';
import { useLocale } from 'next-intl';
import type { Locale } from '@/types/panchang';

// Updated house paths matching ChartNorth (500x500 viewBox, 30px inset)
const HOUSE_PATHS: Record<number, { path: string; cx: number; cy: number; signX: number; signY: number }> = {
  1:  { path: 'M 250 30 L 140 140 L 250 250 L 360 140 Z', cx: 250, cy: 132, signX: 250, signY: 62 },
  2:  { path: 'M 30 30 L 140 140 L 250 30 Z', cx: 138, cy: 62, signX: 92, signY: 42 },
  3:  { path: 'M 30 30 L 30 250 L 140 140 Z', cx: 62, cy: 138, signX: 42, signY: 92 },
  4:  { path: 'M 30 250 L 140 140 L 250 250 L 140 360 Z', cx: 132, cy: 250, signX: 62, signY: 250 },
  5:  { path: 'M 30 250 L 140 360 L 30 470 Z', cx: 62, cy: 362, signX: 42, signY: 408 },
  6:  { path: 'M 30 470 L 140 360 L 250 470 Z', cx: 138, cy: 438, signX: 92, signY: 458 },
  7:  { path: 'M 250 470 L 140 360 L 250 250 L 360 360 Z', cx: 250, cy: 368, signX: 250, signY: 438 },
  8:  { path: 'M 250 470 L 360 360 L 470 470 Z', cx: 362, cy: 438, signX: 408, signY: 458 },
  9:  { path: 'M 470 470 L 360 360 L 470 250 Z', cx: 438, cy: 362, signX: 458, signY: 408 },
  10: { path: 'M 470 250 L 360 360 L 250 250 L 360 140 Z', cx: 368, cy: 250, signX: 438, signY: 250 },
  11: { path: 'M 470 250 L 360 140 L 470 30 Z', cx: 438, cy: 138, signX: 458, signY: 92 },
  12: { path: 'M 470 30 L 360 140 L 250 30 Z', cx: 362, cy: 62, signX: 408, signY: 42 },
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
  3:  [{ names: { en: 'Mo', hi: 'चं', sa: 'चं' }, color: '#e2e8f0' }],
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
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, ease: 'easeOut' as const }}
      className="flex flex-col items-center"
    >
      <svg
        viewBox="0 0 500 500"
        style={{ maxWidth: size, width: '100%' }}
        role="img"
        aria-label="Example Kundali chart for 15 August 1995, 10:30 AM IST, New Delhi"
      >
        <defs>
          <radialGradient id="exBg" cx="50%" cy="50%" r="72%">
            <stop offset="0%" stopColor="#111638" />
            <stop offset="100%" stopColor="#080b1f" />
          </radialGradient>
          <linearGradient id="exGold" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#7a5e22" />
            <stop offset="30%" stopColor="#d4a853" />
            <stop offset="70%" stopColor="#d4a853" />
            <stop offset="100%" stopColor="#7a5e22" />
          </linearGradient>
          <linearGradient id="exGoldFine" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#6b5320" />
            <stop offset="50%" stopColor="#b8913f" />
            <stop offset="100%" stopColor="#6b5320" />
          </linearGradient>
          <radialGradient id="exAscGlow" cx="50%" cy="30%" r="55%">
            <stop offset="0%" stopColor="rgba(212,168,83,0.12)" />
            <stop offset="100%" stopColor="rgba(212,168,83,0)" />
          </radialGradient>
          {/* No blur filter — crisp text */}
        </defs>

        {/* Background */}
        <rect x="0" y="0" width="500" height="500" rx="12" fill="url(#exBg)" />

        {/* Double border */}
        <rect x="18" y="18" width="464" height="464" fill="none" stroke="url(#exGold)" strokeWidth="2" rx="6" />
        <rect x="24" y="24" width="452" height="452" fill="none" stroke="url(#exGold)" strokeWidth="0.5" opacity="0.4" rx="4" />

        {/* Inner diamond */}
        <polygon points="250,30 470,250 250,470 30,250" fill="none" stroke="url(#exGold)" strokeWidth="1.5" />

        {/* Diagonal lines */}
        <line x1="30" y1="30" x2="250" y2="250" stroke="url(#exGoldFine)" strokeWidth="0.8" />
        <line x1="470" y1="30" x2="250" y2="250" stroke="url(#exGoldFine)" strokeWidth="0.8" />
        <line x1="30" y1="470" x2="250" y2="250" stroke="url(#exGoldFine)" strokeWidth="0.8" />
        <line x1="470" y1="470" x2="250" y2="250" stroke="url(#exGoldFine)" strokeWidth="0.8" />

        {/* Cross lines */}
        <line x1="30" y1="250" x2="470" y2="250" stroke="#d4a853" strokeWidth="0.3" strokeOpacity="0.18" />
        <line x1="250" y1="30" x2="250" y2="470" stroke="#d4a853" strokeWidth="0.3" strokeOpacity="0.18" />

        {/* Ascendant glow */}
        <path d={HOUSE_PATHS[1].path} fill="url(#exAscGlow)" stroke="none" />

        {/* Houses */}
        {Object.entries(HOUSE_PATHS).map(([houseNum, { path, cx, cy, signX, signY }]) => {
          const hNum = parseInt(houseNum);
          const isAsc = hNum === 1;
          const rashiNames = RASHI_NAMES[locale] || RASHI_NAMES.en;
          const planets = PLANET_PLACEMENTS[hNum] || [];

          return (
            <g key={houseNum}>
              <path
                d={path}
                fill={planets.length > 0 ? 'rgba(212,168,83,0.025)' : 'transparent'}
                stroke="none"
              />

              {/* Sign name */}
              <text
                x={signX}
                y={signY}
                fill={isAsc ? '#f0d48a' : 'rgba(212,168,83,0.55)'}
                fontSize={isAsc ? '12' : '10'}
                fontWeight={isAsc ? '700' : '500'}
                textAnchor="middle"
                dominantBaseline="middle"
                letterSpacing="0.5"
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

              {/* Planets with colored dots */}
              {planets.map((planet, pIdx) => {
                const count = planets.length;
                const spacing = count <= 2 ? 36 : 28;
                const offsetX = (pIdx - (count - 1) / 2) * spacing;

                return (
                  <g key={planet.names.en}>
                    {/* Colored dot */}
                    <circle
                      cx={cx + offsetX - (isDevanagari ? 11 : 10)}
                      cy={cy}
                      r="3"
                      fill={planet.color}
                      opacity="0.9"
                    />
                    {/* Subtle glow */}
                    <circle
                      cx={cx + offsetX}
                      cy={cy}
                      r="14"
                      fill={planet.color}
                      opacity="0.06"
                    />
                    {/* Planet abbr */}
                    <text
                      x={cx + offsetX + 2}
                      y={cy}
                      fill={planet.color}
                      fontSize="13"
                      fontWeight="700"
                      textAnchor="middle"
                      dominantBaseline="middle"
                      style={isDevanagari ? { fontFamily: 'var(--font-devanagari-body)' } : { fontFamily: 'Inter, system-ui, sans-serif', letterSpacing: '0.5px' }}
                    >
                      {planet.names[locale] || planet.names.en}
                    </text>
                  </g>
                );
              })}
            </g>
          );
        })}

        {/* ASC label */}
        <text x="250" y="16" fill="#f0d48a" fontSize="10" textAnchor="middle" fontWeight="600" letterSpacing="2" opacity="0.8">
          {isDevanagari ? 'लग्न' : 'ASC'}
        </text>

        {/* Corner ornaments */}
        <g opacity="0.5">
          <line x1="18" y1="30" x2="18" y2="18" stroke="#d4a853" strokeWidth="1.5" />
          <line x1="18" y1="18" x2="30" y2="18" stroke="#d4a853" strokeWidth="1.5" />
          <line x1="470" y1="18" x2="482" y2="18" stroke="#d4a853" strokeWidth="1.5" />
          <line x1="482" y1="18" x2="482" y2="30" stroke="#d4a853" strokeWidth="1.5" />
          <line x1="18" y1="470" x2="18" y2="482" stroke="#d4a853" strokeWidth="1.5" />
          <line x1="18" y1="482" x2="30" y2="482" stroke="#d4a853" strokeWidth="1.5" />
          <line x1="470" y1="482" x2="482" y2="482" stroke="#d4a853" strokeWidth="1.5" />
          <line x1="482" y1="482" x2="482" y2="470" stroke="#d4a853" strokeWidth="1.5" />
        </g>

        {/* Diamond points */}
        <circle cx="250" cy="30" r="2.5" fill="#d4a853" opacity="0.7" />
        <circle cx="470" cy="250" r="2.5" fill="#d4a853" opacity="0.7" />
        <circle cx="250" cy="470" r="2.5" fill="#d4a853" opacity="0.7" />
        <circle cx="30" cy="250" r="2.5" fill="#d4a853" opacity="0.7" />
      </svg>

      {/* Caption */}
      <p className="text-text-secondary/75 text-xs mt-3 text-center font-mono">
        {locale === 'en'
          ? '15 Aug 1995 \u00B7 10:30 AM IST \u00B7 New Delhi'
          : '15 अगस्त 1995 \u00B7 10:30 AM IST \u00B7 नई दिल्ली'}
      </p>
    </motion.div>
  );
}
