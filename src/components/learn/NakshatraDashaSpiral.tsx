'use client';

import { useState } from 'react';
import { NAKSHATRAS } from '@/lib/constants/nakshatras';
import type { Locale } from '@/types/panchang';

// The Vimshottari sequence — 9 planets, 3 rounds
const DASHA_SEQUENCE = [
  { id: 8, en: 'Ketu', hi: 'केतु', years: 7, color: '#95a5a6' },
  { id: 5, en: 'Venus', hi: 'शुक्र', years: 20, color: '#e8e6e3' },
  { id: 0, en: 'Sun', hi: 'सूर्य', years: 6, color: '#e67e22' },
  { id: 1, en: 'Moon', hi: 'चन्द्र', years: 10, color: '#ecf0f1' },
  { id: 2, en: 'Mars', hi: 'मंगल', years: 7, color: '#e74c3c' },
  { id: 7, en: 'Rahu', hi: 'राहु', years: 18, color: '#8e44ad' },
  { id: 4, en: 'Jupiter', hi: 'गुरु', years: 16, color: '#f39c12' },
  { id: 6, en: 'Saturn', hi: 'शनि', years: 19, color: '#3498db' },
  { id: 3, en: 'Mercury', hi: 'बुध', years: 17, color: '#2ecc71' },
];

interface Props { locale: Locale }

export default function NakshatraDashaSpiral({ locale }: Props) {
  const [hoveredNak, setHoveredNak] = useState<number | null>(null);
  const [hoveredPlanet, setHoveredPlanet] = useState<number | null>(null);
  const isHi = locale !== 'en' && String(locale) !== 'ta';

  // Build the 27 nakshatra-planet assignments
  const assignments = NAKSHATRAS.map((n, i) => ({
    nakshatra: n,
    planet: DASHA_SEQUENCE[i % 9],
    round: Math.floor(i / 9) + 1,
  }));

  return (
    <div className="space-y-6">
      {/* Planet legend — 9 colored dots */}
      <div className="flex flex-wrap justify-center gap-1.5">
        {DASHA_SEQUENCE.map((p, i) => (
          <button
            key={p.id}
            onMouseEnter={() => setHoveredPlanet(i)}
            onMouseLeave={() => setHoveredPlanet(null)}
            className={`flex items-center gap-1.5 px-2 py-1 rounded-md border transition-all text-[11px] ${
              hoveredPlanet === i
                ? 'border-gold-primary/40 bg-gold-primary/10'
                : 'border-gold-primary/8 hover:border-gold-primary/20'
            }`}
          >
            <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: p.color, boxShadow: `0 0 6px ${p.color}40` }} />
            <span className="text-text-primary font-medium whitespace-nowrap" style={isHi ? { fontFamily: 'var(--font-devanagari-body)' } : undefined}>
              {isHi ? p.hi : p.en}
            </span>
            <span className="text-text-secondary/65 text-[9px]">{p.years}</span>
          </button>
        ))}
      </div>

      {/* Three rounds — visual strips */}
      <div className="space-y-4">
        {[0, 1, 2].map(round => (
          <div key={round}>
            <div className="flex items-center gap-2 mb-2">
              <div className="text-gold-dark text-[10px] uppercase tracking-widest font-bold">
                {isHi ? `चक्र ${round + 1}` : `Round ${round + 1}`}
              </div>
              <div className="flex-1 h-px bg-gold-primary/10" />
              <div className="text-text-secondary/55 text-[10px]">
                #{round * 9 + 1} – #{round * 9 + 9}
              </div>
            </div>
            <div className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-9 gap-1.5">
              {assignments.slice(round * 9, round * 9 + 9).map((a, idx) => {
                const globalIdx = round * 9 + idx;
                const isNakHovered = hoveredNak === globalIdx;
                const isPlanetHovered = hoveredPlanet === (idx % 9);
                const isHighlighted = isNakHovered || isPlanetHovered;
                return (
                  <div
                    key={globalIdx}
                    onMouseEnter={() => { setHoveredNak(globalIdx); setHoveredPlanet(idx % 9); }}
                    onMouseLeave={() => { setHoveredNak(null); setHoveredPlanet(null); }}
                    className={`relative rounded-xl p-2 text-center transition-all cursor-default ${
                      isHighlighted
                        ? 'bg-gold-primary/10 border-2 shadow-lg'
                        : 'bg-gradient-to-br from-[#2d1b69]/30 via-[#1a1040]/40 to-[#0a0e27] border'
                    }`}
                    style={{
                      borderColor: isHighlighted ? `${a.planet.color}60` : 'rgba(212,168,83,0.06)',
                      boxShadow: isHighlighted ? `0 0 12px ${a.planet.color}20` : undefined,
                    }}
                  >
                    {/* Planet dot */}
                    <div
                      className="w-5 h-5 rounded-full mx-auto mb-1.5"
                      style={{
                        backgroundColor: a.planet.color,
                        opacity: isHighlighted ? 1 : 0.5,
                        boxShadow: isHighlighted ? `0 0 10px ${a.planet.color}60` : undefined,
                      }}
                    />
                    {/* Nakshatra name */}
                    <div
                      className={`text-[9px] font-medium leading-tight ${isHighlighted ? 'text-gold-light' : 'text-text-secondary/75'}`}
                      style={isHi ? { fontFamily: 'var(--font-devanagari-body)' } : undefined}
                    >
                      {a.nakshatra.name[locale].length > 9
                        ? a.nakshatra.name[locale].substring(0, 8) + '…'
                        : a.nakshatra.name[locale]}
                    </div>
                    {/* Planet name */}
                    <div
                      className="text-[8px] mt-0.5 font-semibold"
                      style={{ color: isHighlighted ? a.planet.color : `${a.planet.color}80`, ...(isHi ? { fontFamily: 'var(--font-devanagari-body)' } : {}) }}
                    >
                      {isHi ? a.planet.hi : a.planet.en}
                    </div>
                    {/* Number badge */}
                    <div className="text-[7px] text-text-secondary/50 mt-0.5">#{globalIdx + 1}</div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Vertical alignment lines — show the 3-round pattern */}
      <div className="rounded-xl bg-gradient-to-br from-[#2d1b69]/30 via-[#1a1040]/40 to-[#0a0e27] border border-gold-primary/8 p-4">
        <div className="text-gold-dark text-[10px] uppercase tracking-widest font-bold mb-3 text-center">
          {isHi ? 'तीन चक्रों में समान स्वामी' : 'Same Lord Across Three Rounds'}
        </div>
        <div className="space-y-1.5">
          {DASHA_SEQUENCE.map((planet, pi) => {
            const naks = [pi, pi + 9, pi + 18].map(i => NAKSHATRAS[i]);
            return (
              <div
                key={pi}
                className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3 py-2 px-3 rounded-lg hover:bg-gold-primary/5 transition-colors"
                onMouseEnter={() => setHoveredPlanet(pi)}
                onMouseLeave={() => setHoveredPlanet(null)}
              >
                <div className="flex items-center gap-2 shrink-0">
                  <div className="w-4 h-4 rounded-full shrink-0" style={{ backgroundColor: planet.color, boxShadow: `0 0 6px ${planet.color}30` }} />
                  <span className="text-xs font-bold w-14" style={{ color: planet.color, ...(isHi ? { fontFamily: 'var(--font-devanagari-body)' } : {}) }}>
                    {isHi ? planet.hi : planet.en}
                  </span>
                  <span className="text-text-secondary/55 text-[9px]">({planet.years}yr)</span>
                </div>
                <div className="flex items-center gap-1 flex-wrap ml-6 sm:ml-0">
                  {naks.map((n, ni) => (
                    <span key={ni} className="flex items-center gap-1 whitespace-nowrap">
                      <span className="text-text-secondary/65 text-[9px]">#{pi + ni * 9 + 1}</span>
                      <span className="text-text-primary text-xs font-medium" style={isHi ? { fontFamily: 'var(--font-devanagari-body)' } : undefined}>
                        {n.name[locale]}
                      </span>
                      {ni < 2 && <span className="text-gold-primary/20 mx-1">→</span>}
                    </span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
        <div className="text-center text-text-secondary/55 text-[10px] mt-3">
          {isHi
            ? 'प्रत्येक ग्रह ठीक 3 नक्षत्रों का शासन करता है, 9 अन्तराल पर (जैसे केतु: #1, #10, #19)'
            : 'Each planet rules exactly 3 nakshatras, spaced 9 apart (e.g., Ketu: #1, #10, #19)'}
        </div>
      </div>
    </div>
  );
}
