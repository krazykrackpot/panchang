'use client';

import { useState, useMemo } from 'react';
import { NAKSHATRAS } from '@/lib/constants/nakshatras';
import { computeAshtaKuta } from '@/lib/matching/ashta-kuta';

/** Derive Moon Rashi from Nakshatra ID (1-based). Each rashi spans 2.25 nakshatras. */
function rashiFromNakshatra(nakshatraId: number): number {
  // Nakshatra 1 starts at 0 deg Aries. Each rashi = 30 deg = 2.25 nakshatras.
  const startDeg = (nakshatraId - 1) * 13.333333;
  return Math.floor(startDeg / 30) + 1;
}

const VERDICT_COLORS: Record<string, string> = {
  excellent: 'text-emerald-400',
  good: 'text-teal-400',
  average: 'text-yellow-400',
  below_average: 'text-orange-400',
  not_recommended: 'text-red-400',
};

export default function TryCompatibility() {
  const [boyNak, setBoyNak] = useState(1);
  const [girlNak, setGirlNak] = useState(4);

  const result = useMemo(() => {
    const boy = { moonNakshatra: boyNak, moonRashi: rashiFromNakshatra(boyNak) };
    const girl = { moonNakshatra: girlNak, moonRashi: rashiFromNakshatra(girlNak) };
    return computeAshtaKuta(boy, girl);
  }, [boyNak, girlNak]);

  return (
    <div className="rounded-2xl border border-gold-primary/20 bg-gradient-to-br from-[#2d1b69]/20 to-[#0a0e27] p-5 my-6">
      <h4 className="text-gold-light font-bold text-base mb-1" style={{ fontFamily: 'var(--font-heading)' }}>
        Try It -- Ashta Kuta Compatibility
      </h4>
      <p className="text-text-secondary text-xs mb-4">Select Moon nakshatras for both partners and see the 36-point score.</p>

      <div className="flex flex-wrap gap-4 mb-4">
        <div className="flex-1 min-w-[140px]">
          <label className="block text-text-secondary text-xs mb-1">Boy&apos;s Nakshatra</label>
          <select
            value={boyNak}
            onChange={e => setBoyNak(Number(e.target.value))}
            className="bg-[#111633] border border-gold-primary/20 rounded-lg px-3 py-2 text-text-primary text-sm w-full focus:outline-none focus:border-gold-primary/50"
          >
            {NAKSHATRAS.map(n => (
              <option key={n.id} value={n.id}>{n.id}. {n.name.en}</option>
            ))}
          </select>
        </div>
        <div className="flex-1 min-w-[140px]">
          <label className="block text-text-secondary text-xs mb-1">Girl&apos;s Nakshatra</label>
          <select
            value={girlNak}
            onChange={e => setGirlNak(Number(e.target.value))}
            className="bg-[#111633] border border-gold-primary/20 rounded-lg px-3 py-2 text-text-primary text-sm w-full focus:outline-none focus:border-gold-primary/50"
          >
            {NAKSHATRAS.map(n => (
              <option key={n.id} value={n.id}>{n.id}. {n.name.en}</option>
            ))}
          </select>
        </div>
      </div>

      {result && (
        <div>
          {/* Score bar */}
          <div className="flex items-center gap-3 mb-3">
            <div className="flex-1 h-3 bg-[#111633] rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-300"
                style={{
                  width: `${result.percentage}%`,
                  background: result.percentage >= 66 ? '#34d399' : result.percentage >= 50 ? '#fbbf24' : '#f87171',
                }}
              />
            </div>
            <span className="text-gold-light font-mono text-lg font-bold">{result.totalScore}/36</span>
          </div>

          <div className="flex items-baseline gap-2 mb-3">
            <span className="text-text-secondary text-xs">Verdict:</span>
            <span className={`font-bold text-sm ${VERDICT_COLORS[result.verdict] ?? 'text-text-primary'}`}>
              {result.verdictText.en}
            </span>
            {result.nadiDoshaPresent && !result.nadiDoshaCancelled && (
              <span className="text-red-400 text-xs font-medium">(Nadi Dosha present)</span>
            )}
          </div>

          {/* Kuta breakdown */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {result.kutas.map(k => (
              <div key={k.name.en} className="bg-[#111633]/60 rounded-lg p-2 border border-gold-primary/10">
                <div className="text-text-secondary text-[10px]">{k.name.en}</div>
                <div className="text-gold-light font-mono text-sm font-bold">
                  {k.scored}/{k.maxPoints}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
