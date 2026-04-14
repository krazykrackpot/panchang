'use client';
import { tl } from '@/lib/utils/trilingual';

import type { Locale } from '@/types/panchang';
import { isDevanagariLocale } from '@/lib/utils/locale-fonts';

interface ConflictTimelineProps {
  locale: Locale;
}

// Rahu Kalam by weekday (fraction of daytime from sunrise)
const RAHU_KALAM_BY_DAY = [
  { day: 'Sun', start: 12/15, end: 13.5/15 },  // ~4:30 PM
  { day: 'Mon', start: 1.5/15, end: 3/15 },    // ~7:30 AM
  { day: 'Tue', start: 10.5/15, end: 12/15 },   // ~3:00 PM
  { day: 'Wed', start: 9/15, end: 10.5/15 },    // ~12:00 PM
  { day: 'Thu', start: 6/15, end: 7.5/15 },     // ~10:30 AM
  { day: 'Fri', start: 4.5/15, end: 6/15 },     // ~9:00 AM
  { day: 'Sat', start: 3/15, end: 4.5/15 },     // ~7:30 AM
];

export default function ConflictTimeline({ locale }: ConflictTimelineProps) {
  const width = 700;
  const muhurtaH = 22;
  const headerH = 30;
  const totalH = headerH + 15 * muhurtaH + 20;
  const barLeft = 120;
  const barWidth = width - barLeft - 20;

  const muhurtaNames = [
    'Rudra', 'Ahi', 'Mitra', 'Pitru', 'Vasu', 'Vara', 'Vishvedeva', 'Vidhi (Abhijit)',
    'Satamukhi', 'Puruhuta', 'Vahini', 'Naktanakara', 'Varuna', 'Aryaman', 'Bhaga',
  ];

  const natures: ('a' | 'i')[] = ['i', 'i', 'a', 'i', 'a', 'a', 'a', 'a', 'a', 'a', 'i', 'i', 'a', 'a', 'a'];

  return (
    <div className="overflow-x-auto">
      <svg viewBox={`0 0 ${width} ${totalH}`} className="w-full min-w-[320px] sm:min-w-[500px]">
        {/* Header */}
        <text x={barLeft} y={18} fill="#f0d48a" fontSize="10" fontFamily="monospace">
          {tl({ en: 'Sunrise', hi: 'सूर्योदय', sa: 'सूर्योदय', ta: 'Sunrise', te: 'Sunrise', bn: 'Sunrise', kn: 'Sunrise', gu: 'Sunrise', mai: 'सूर्योदय', mr: 'सूर्योदय' }, locale)}
        </text>
        <text x={barLeft + barWidth} y={18} fill="#8a6d2b" fontSize="10" textAnchor="end" fontFamily="monospace">
          {tl({ en: 'Sunset', hi: 'सूर्यास्त', sa: 'सूर्यास्त', ta: 'Sunset', te: 'Sunset', bn: 'Sunset', kn: 'Sunset', gu: 'Sunset', mai: 'सूर्यास्त', mr: 'सूर्यास्त' }, locale)}
        </text>

        {/* Time markers */}
        {[0, 3, 6, 9, 12, 15].map((h) => {
          const x = barLeft + (h / 15) * barWidth;
          const time = 6 + (h / 15) * 12; // approx hours
          return (
            <g key={h}>
              <line x1={x} y1={headerH - 5} x2={x} y2={totalH - 20} stroke="rgba(212,168,83,0.1)" strokeWidth="0.5" />
              <text x={x} y={headerH - 8} fill="rgba(212,168,83,0.4)" fontSize="7" textAnchor="middle" fontFamily="monospace">
                ~{Math.floor(time)}:{(time % 1) * 60 === 0 ? '00' : '30'}
              </text>
            </g>
          );
        })}

        {/* 15 Muhurta bars */}
        {muhurtaNames.map((name, i) => {
          const y = headerH + i * muhurtaH;
          const x = barLeft + (i / 15) * barWidth;
          const w = barWidth / 15;
          const isAuspicious = natures[i] === 'a';
          const isAbhijit = i === 7;

          return (
            <g key={i}>
              {/* Label */}
              <text x={barLeft - 5} y={y + muhurtaH / 2 + 3} fill={isAuspicious ? '#4ade80' : '#f87171'} fontSize="8" textAnchor="end">
                {i + 1}. {name}
              </text>
              {/* Bar */}
              <rect
                x={x} y={y + 2} width={w} height={muhurtaH - 4}
                rx="2"
                fill={isAbhijit ? 'rgba(240,212,138,0.2)' : isAuspicious ? 'rgba(74,222,128,0.1)' : 'rgba(248,113,113,0.1)'}
                stroke={isAbhijit ? 'rgba(240,212,138,0.4)' : isAuspicious ? 'rgba(74,222,128,0.2)' : 'rgba(248,113,113,0.2)'}
                strokeWidth="0.5"
              />
            </g>
          );
        })}

        {/* Rahu Kalam overlays for each day */}
        {RAHU_KALAM_BY_DAY.map((rk, di) => {
          const y = totalH - 18;
          const x = barLeft + rk.start * barWidth;
          const w = (rk.end - rk.start) * barWidth;
          return (
            <g key={di} opacity="0.15">
              <rect x={x} y={headerH} width={w} height={15 * muhurtaH} rx="2" fill="#8b5cf6" />
            </g>
          );
        })}

        {/* Legend */}
        <rect x={barLeft} y={totalH - 15} width={8} height={8} rx="1" fill="rgba(74,222,128,0.3)" />
        <text x={barLeft + 12} y={totalH - 8} fill="rgba(74,222,128,0.7)" fontSize="7">{tl({ en: 'Auspicious', hi: 'शुभ', sa: 'शुभ', ta: 'Auspicious', te: 'Auspicious', bn: 'Auspicious', kn: 'Auspicious', gu: 'Auspicious', mai: 'शुभ', mr: 'शुभ' }, locale)}</text>

        <rect x={barLeft + 70} y={totalH - 15} width={8} height={8} rx="1" fill="rgba(248,113,113,0.3)" />
        <text x={barLeft + 82} y={totalH - 8} fill="rgba(248,113,113,0.7)" fontSize="7">{tl({ en: 'Inauspicious', hi: 'अशुभ', sa: 'अशुभ', ta: 'Inauspicious', te: 'Inauspicious', bn: 'Inauspicious', kn: 'Inauspicious', gu: 'Inauspicious', mai: 'अशुभ', mr: 'अशुभ' }, locale)}</text>

        <rect x={barLeft + 150} y={totalH - 15} width={8} height={8} rx="1" fill="rgba(139,92,246,0.3)" />
        <text x={barLeft + 162} y={totalH - 8} fill="rgba(139,92,246,0.7)" fontSize="7">{tl({ en: 'Rahu Kalam zones', hi: 'राहु काल क्षेत्र', sa: 'राहु काल क्षेत्र', ta: 'Rahu Kalam zones', te: 'Rahu Kalam zones', bn: 'Rahu Kalam zones', kn: 'Rahu Kalam zones', gu: 'Rahu Kalam zones', mai: 'राहु काल क्षेत्र', mr: 'राहु काल क्षेत्र' }, locale)}</text>

        <rect x={barLeft + 270} y={totalH - 15} width={8} height={8} rx="1" fill="rgba(240,212,138,0.3)" />
        <text x={barLeft + 282} y={totalH - 8} fill="rgba(240,212,138,0.7)" fontSize="7">{tl({ en: 'Abhijit (8th)', hi: 'अभिजित् (8वाँ)', sa: 'अभिजित् (8वाँ)', ta: 'Abhijit (8th)', te: 'Abhijit (8th)', bn: 'Abhijit (8th)', kn: 'Abhijit (8th)', gu: 'Abhijit (8th)', mai: 'अभिजित् (8वाँ)', mr: 'अभिजित् (8वाँ)' }, locale)}</text>
      </svg>
    </div>
  );
}
