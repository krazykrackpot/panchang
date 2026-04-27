'use client';

import { useState, useMemo } from 'react';
import type { PlanetComparison, PrecessionData } from '@/lib/ephem/comparison-engine';

// ── Sidereal constellation names (fixed inner ring) ─────────
const SIDEREAL_SIGNS = [
  'Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo',
  'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces',
];

// ── Tropical sign names (rotating outer ring) ───────────────
const TROPICAL_SIGNS = [
  'Ari', 'Tau', 'Gem', 'Can', 'Leo', 'Vir',
  'Lib', 'Sco', 'Sag', 'Cap', 'Aqu', 'Pis',
];

// ── Planet symbols for dot placement ────────────────────────
const PLANET_SYMBOLS: Record<number, string> = {
  0: '\u2609', 1: '\u263D', 2: '\u2642', 3: '\u263F', 4: '\u2643',
  5: '\u2640', 6: '\u2644', 7: '\u260A', 8: '\u260B',
};

interface PrecessionSliderProps {
  precessionData: PrecessionData;
  planets?: PlanetComparison[];
}

/** Contextual text for the current slider year */
function getContextText(year: number, ayanamsha: number): string {
  if (year <= 300) return 'The zodiacs were aligned \u2014 tropical and sidereal pointed to the same stars.';
  if (year <= 500) return `The drift has begun. A ${ayanamsha.toFixed(1)}\u00b0 gap is opening between the two systems.`;
  if (year <= 1000) return `${ayanamsha.toFixed(1)}\u00b0 offset \u2014 the first signs begin to split between tropical and sidereal.`;
  if (year <= 1500) return `${ayanamsha.toFixed(1)}\u00b0 offset \u2014 most planets now land in different signs depending on which zodiac you use.`;
  if (year <= 1900) return `${ayanamsha.toFixed(1)}\u00b0 offset \u2014 the gap is large enough that nearly every planet shifts.`;
  if (year <= 2020) return `${ayanamsha.toFixed(1)}\u00b0 offset \u2014 approaching the present day.`;
  return `Current day \u2014 ${ayanamsha.toFixed(1)}\u00b0 offset. Your Western sign may not match the stars you were actually born under.`;
}

export default function PrecessionSlider({ precessionData, planets }: PrecessionSliderProps) {
  const { zeroYear, yearlyRate } = precessionData;
  const [year, setYear] = useState(2026);

  const ayanamsha = useMemo(() => Math.max(0, (year - zeroYear) * yearlyRate), [year, zeroYear, yearlyRate]);

  // SVG geometry constants
  const size = 500;
  const cx = size / 2;
  const cy = size / 2;
  const outerR = 220; // outer ring outer edge
  const outerInner = 185; // outer ring inner edge
  const innerR = 180; // inner ring outer edge
  const innerInner = 140; // inner ring inner edge
  const planetR = 125; // planet dot radius from center

  return (
    <div className="mt-6 rounded-2xl bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 hover:border-gold-primary/40 transition-all p-6">
      {/* SVG Zodiac Rings */}
      <div className="flex justify-center mb-6">
        <svg
          viewBox={`0 0 ${size} ${size}`}
          className="w-full max-w-[500px]"
          aria-label="Precession visualization showing tropical and sidereal zodiac rings"
        >
          <defs>
            <clipPath id="precession-clip">
              <circle cx={cx} cy={cy} r={outerR + 2} />
            </clipPath>
          </defs>

          {/* Background circle */}
          <circle cx={cx} cy={cy} r={outerR + 5} fill="#0a0e27" stroke="#d4a853" strokeOpacity={0.1} strokeWidth={1} />

          {/* ── Inner ring (FIXED): Sidereal constellations ── */}
          <g>
            {SIDEREAL_SIGNS.map((name, i) => {
              const startAngle = (i * 30 - 90) * (Math.PI / 180);
              const endAngle = ((i + 1) * 30 - 90) * (Math.PI / 180);
              const midAngle = ((i + 0.5) * 30 - 90) * (Math.PI / 180);

              const x1o = cx + innerR * Math.cos(startAngle);
              const y1o = cy + innerR * Math.sin(startAngle);
              const x2o = cx + innerR * Math.cos(endAngle);
              const y2o = cy + innerR * Math.sin(endAngle);
              const x1i = cx + innerInner * Math.cos(startAngle);
              const y1i = cy + innerInner * Math.sin(startAngle);
              const x2i = cx + innerInner * Math.cos(endAngle);
              const y2i = cy + innerInner * Math.sin(endAngle);

              const labelR = (innerR + innerInner) / 2;
              const lx = cx + labelR * Math.cos(midAngle);
              const ly = cy + labelR * Math.sin(midAngle);
              // Rotate text to follow the arc
              const textRotation = (i + 0.5) * 30;

              return (
                <g key={`sid-${i}`}>
                  <path
                    d={`M ${x1o} ${y1o} A ${innerR} ${innerR} 0 0 1 ${x2o} ${y2o} L ${x2i} ${y2i} A ${innerInner} ${innerInner} 0 0 0 ${x1i} ${y1i} Z`}
                    fill="#d4a853"
                    fillOpacity={0.04}
                    stroke="#d4a853"
                    strokeOpacity={0.2}
                    strokeWidth={0.5}
                  />
                  <text
                    x={lx}
                    y={ly}
                    textAnchor="middle"
                    dominantBaseline="central"
                    fill="#e6e2d8"
                    fontSize={8.5}
                    fontWeight={500}
                    transform={`rotate(${textRotation}, ${lx}, ${ly})`}
                  >
                    {name}
                  </text>
                </g>
              );
            })}
          </g>

          {/* ── Outer ring (ROTATES): Tropical signs ── */}
          <g
            style={{
              transform: `rotate(${ayanamsha}deg)`,
              transformOrigin: `${cx}px ${cy}px`,
              transition: 'transform 0.05s linear',
            }}
          >
            {TROPICAL_SIGNS.map((name, i) => {
              const startAngle = (i * 30 - 90) * (Math.PI / 180);
              const endAngle = ((i + 1) * 30 - 90) * (Math.PI / 180);
              const midAngle = ((i + 0.5) * 30 - 90) * (Math.PI / 180);

              const x1o = cx + outerR * Math.cos(startAngle);
              const y1o = cy + outerR * Math.sin(startAngle);
              const x2o = cx + outerR * Math.cos(endAngle);
              const y2o = cy + outerR * Math.sin(endAngle);
              const x1i = cx + outerInner * Math.cos(startAngle);
              const y1i = cy + outerInner * Math.sin(startAngle);
              const x2i = cx + outerInner * Math.cos(endAngle);
              const y2i = cy + outerInner * Math.sin(endAngle);

              const labelR = (outerR + outerInner) / 2;
              const lx = cx + labelR * Math.cos(midAngle);
              const ly = cy + labelR * Math.sin(midAngle);
              const textRotation = (i + 0.5) * 30;

              // Highlight segments that have shifted relative to inner ring
              const isShifted = ayanamsha > 0;

              return (
                <g key={`trop-${i}`}>
                  <path
                    d={`M ${x1o} ${y1o} A ${outerR} ${outerR} 0 0 1 ${x2o} ${y2o} L ${x2i} ${y2i} A ${outerInner} ${outerInner} 0 0 0 ${x1i} ${y1i} Z`}
                    fill="#d4a853"
                    fillOpacity={isShifted ? 0.08 : 0.02}
                    stroke="#d4a853"
                    strokeOpacity={0.2}
                    strokeWidth={0.5}
                  />
                  <text
                    x={lx}
                    y={ly}
                    textAnchor="middle"
                    dominantBaseline="central"
                    fill="#d4a853"
                    fontSize={9}
                    fontWeight={600}
                    transform={`rotate(${textRotation}, ${lx}, ${ly})`}
                  >
                    {name}
                  </text>
                </g>
              );
            })}
          </g>

          {/* ── Planet dots on the inner (sidereal) ring ── */}
          {planets && planets.length > 0 && (
            <g>
              {planets.map((p) => {
                // Place planet at its sidereal longitude on the inner ring
                const angle = (p.siderealLongitude - 90) * (Math.PI / 180);
                const px = cx + planetR * Math.cos(angle);
                const py = cy + planetR * Math.sin(angle);

                return (
                  <g key={`planet-${p.id}`}>
                    <circle
                      cx={px}
                      cy={py}
                      r={6}
                      fill="#d4a853"
                      fillOpacity={0.9}
                      stroke="#f0d48a"
                      strokeWidth={1}
                    />
                    <text
                      x={px}
                      y={py}
                      textAnchor="middle"
                      dominantBaseline="central"
                      fill="#0a0e27"
                      fontSize={8}
                      fontWeight={700}
                    >
                      {PLANET_SYMBOLS[p.id]}
                    </text>
                  </g>
                );
              })}
            </g>
          )}

          {/* Center label */}
          <circle cx={cx} cy={cy} r={innerInner - 5} fill="#0a0e27" />
          <text x={cx} y={cy - 16} textAnchor="middle" fill="#e6e2d8" fontSize={11} fontWeight={600}>
            {year} AD
          </text>
          <text x={cx} y={cy + 2} textAnchor="middle" fill="#d4a853" fontSize={13} fontWeight={700}>
            {ayanamsha.toFixed(1)}&deg;
          </text>
          <text x={cx} y={cy + 18} textAnchor="middle" fill="#8a8478" fontSize={8}>
            ayanamsha offset
          </text>

          {/* Ring labels */}
          <text x={cx} y={cy - outerR - 10} textAnchor="middle" fill="#d4a853" fontSize={9} fontWeight={600} opacity={0.7}>
            TROPICAL (rotates)
          </text>
          <text x={cx} y={cy + outerR + 18} textAnchor="middle" fill="#8a8478" fontSize={9} fontWeight={500} opacity={0.7}>
            SIDEREAL (fixed)
          </text>
        </svg>
      </div>

      {/* ── Year Slider ── */}
      <div className="max-w-md mx-auto">
        <div className="flex items-center justify-between text-xs text-text-secondary mb-1">
          <span>{zeroYear} AD</span>
          <span>2026 AD</span>
        </div>
        <input
          type="range"
          min={zeroYear}
          max={2026}
          value={year}
          onChange={(e) => setYear(Number(e.target.value))}
          className="w-full h-2 rounded-full appearance-none cursor-pointer
            bg-bg-primary
            [&::-webkit-slider-thumb]:appearance-none
            [&::-webkit-slider-thumb]:w-5
            [&::-webkit-slider-thumb]:h-5
            [&::-webkit-slider-thumb]:rounded-full
            [&::-webkit-slider-thumb]:bg-gold-primary
            [&::-webkit-slider-thumb]:shadow-[0_0_8px_rgba(212,168,83,0.5)]
            [&::-webkit-slider-thumb]:cursor-pointer
            [&::-moz-range-thumb]:w-5
            [&::-moz-range-thumb]:h-5
            [&::-moz-range-thumb]:rounded-full
            [&::-moz-range-thumb]:bg-gold-primary
            [&::-moz-range-thumb]:border-0
            [&::-moz-range-thumb]:cursor-pointer
            [&::-moz-range-track]:bg-bg-primary
            [&::-moz-range-track]:rounded-full
          "
          aria-label="Select year to see ayanamsha offset"
        />

        {/* Dynamic text */}
        <div className="mt-4 text-center">
          <p className="text-text-primary text-sm font-medium">
            Year: <span className="text-gold-light">{year}</span> &mdash; Ayanamsha offset: <span className="text-gold-light">{ayanamsha.toFixed(2)}&deg;</span>
          </p>
          <p className="text-text-secondary text-xs mt-2 leading-relaxed max-w-sm mx-auto">
            {getContextText(year, ayanamsha)}
          </p>
        </div>
      </div>
    </div>
  );
}
