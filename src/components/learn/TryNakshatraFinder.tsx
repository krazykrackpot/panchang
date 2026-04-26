'use client';

import { useState, useMemo } from 'react';
import { dateToJD, moonLongitude, toSidereal } from '@/lib/ephem/astronomical';
import { NAKSHATRAS } from '@/lib/constants/nakshatras';

function formatDate(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

export default function TryNakshatraFinder() {
  const [mode, setMode] = useState<'date' | 'slider'>('date');
  const [dateStr, setDateStr] = useState(formatDate(new Date()));
  const [manualLong, setManualLong] = useState(0);

  const result = useMemo(() => {
    let sidLong: number;
    if (mode === 'date') {
      const [y, m, d] = dateStr.split('-').map(Number);
      if (!y || !m || !d) return null;
      const jd = dateToJD(y, m, d, 12);
      const tropMoon = moonLongitude(jd);
      sidLong = toSidereal(tropMoon, jd);
    } else {
      sidLong = manualLong;
    }

    const nakshatraIndex = Math.floor(sidLong / 13.333333);
    const nak = NAKSHATRAS[Math.min(nakshatraIndex, 26)];
    const posInNak = sidLong - nakshatraIndex * 13.333333;
    const pada = Math.min(Math.floor(posInNak / 3.333333) + 1, 4);

    return {
      longitude: sidLong.toFixed(3),
      nakshatraNum: nak.id,
      nakshatraName: nak.name.en,
      ruler: nak.ruler,
      pada,
      posInNak: posInNak.toFixed(2),
    };
  }, [mode, dateStr, manualLong]);

  return (
    <div className="rounded-2xl border border-gold-primary/20 bg-gradient-to-br from-[#2d1b69]/20 to-[#0a0e27] p-5 my-6">
      <h4 className="text-gold-light font-bold text-base mb-1" style={{ fontFamily: 'var(--font-heading)' }}>
        Try It -- Nakshatra Finder
      </h4>
      <p className="text-text-secondary text-xs mb-4">Find which nakshatra and pada a Moon longitude falls in.</p>

      <div className="flex gap-3 mb-4">
        <button
          onClick={() => setMode('date')}
          className={`text-xs px-3 py-1.5 rounded-lg border transition-colors ${mode === 'date' ? 'border-gold-primary/50 bg-gold-primary/10 text-gold-light' : 'border-gold-primary/15 text-text-secondary hover:text-gold-light'}`}
        >
          From Date
        </button>
        <button
          onClick={() => setMode('slider')}
          className={`text-xs px-3 py-1.5 rounded-lg border transition-colors ${mode === 'slider' ? 'border-gold-primary/50 bg-gold-primary/10 text-gold-light' : 'border-gold-primary/15 text-text-secondary hover:text-gold-light'}`}
        >
          Manual Longitude
        </button>
      </div>

      {mode === 'date' ? (
        <>
          <label className="block text-text-secondary text-xs mb-1">Date (Moon position at noon UTC)</label>
          <input
            type="date"
            value={dateStr}
            onChange={e => setDateStr(e.target.value)}
            className="bg-[#111633] border border-gold-primary/20 rounded-lg px-3 py-2 text-text-primary text-sm w-full max-w-xs focus:outline-none focus:border-gold-primary/50 mb-4"
          />
        </>
      ) : (
        <>
          <label className="block text-text-secondary text-xs mb-1">
            Sidereal Moon Longitude: <span className="text-gold-light font-mono">{manualLong.toFixed(1)}&deg;</span>
          </label>
          <input
            type="range"
            min={0}
            max={359.99}
            step={0.1}
            value={manualLong}
            onChange={e => setManualLong(Number(e.target.value))}
            className="w-full max-w-sm mb-4 accent-[#d4a853]"
          />
        </>
      )}

      {result && (
        <div className="space-y-2">
          <div className="flex items-baseline gap-2">
            <span className="text-text-secondary text-xs">Sidereal Moon:</span>
            <span className="text-gold-light font-mono text-sm font-bold">{result.longitude}&deg;</span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-text-secondary text-xs">Nakshatra:</span>
            <span className="text-gold-light font-bold text-sm">#{result.nakshatraNum} {result.nakshatraName}</span>
            <span className="text-text-secondary text-xs">(ruler: {result.ruler})</span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-text-secondary text-xs">Pada:</span>
            <span className="text-gold-light font-mono text-sm font-bold">{result.pada}</span>
            <span className="text-text-secondary text-xs">({result.posInNak}&deg; into nakshatra)</span>
          </div>
          <div className="text-text-secondary text-xs mt-2 opacity-70">
            Formula: nakshatra = floor({result.longitude} / 13.333) + 1 = {result.nakshatraNum}
          </div>
        </div>
      )}
    </div>
  );
}
