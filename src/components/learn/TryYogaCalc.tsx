'use client';

import { useState, useMemo } from 'react';
import { dateToJD, sunLongitude, moonLongitude, calculateYoga, lahiriAyanamsha, normalizeDeg } from '@/lib/ephem/astronomical';
import { YOGAS } from '@/lib/constants/yogas';

function formatDate(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

const NATURE_COLORS: Record<string, string> = {
  auspicious: 'text-emerald-400',
  inauspicious: 'text-red-400',
  mixed: 'text-yellow-400',
};

export default function TryYogaCalc() {
  const [dateStr, setDateStr] = useState(formatDate(new Date()));

  const result = useMemo(() => {
    const [y, m, d] = dateStr.split('-').map(Number);
    if (!y || !m || !d) return null;
    const jd = dateToJD(y, m, d, 12);
    const aya = lahiriAyanamsha(jd);
    const sunTrop = sunLongitude(jd);
    const moonTrop = moonLongitude(jd);
    const sunSid = normalizeDeg(sunTrop - aya);
    const moonSid = normalizeDeg(moonTrop - aya);
    const sum = normalizeDeg(sunSid + moonSid);
    const yogaNum = calculateYoga(jd);
    const yoga = YOGAS.find(y => y.number === yogaNum);

    return {
      sunSid: sunSid.toFixed(2),
      moonSid: moonSid.toFixed(2),
      sum: sum.toFixed(2),
      yogaNum,
      name: yoga?.name.en ?? `Yoga ${yogaNum}`,
      nature: yoga?.nature ?? 'mixed',
      meaning: yoga?.meaning.en ?? '',
    };
  }, [dateStr]);

  return (
    <div className="rounded-2xl border border-gold-primary/20 bg-gradient-to-br from-[#2d1b69]/20 to-[#0a0e27] p-5 my-6">
      <h4 className="text-gold-light font-bold text-base mb-1" style={{ fontFamily: 'var(--font-heading)' }}>
        Try It -- Yoga Calculator
      </h4>
      <p className="text-text-secondary text-xs mb-4">See how the Sun + Moon sidereal longitudes determine the day&apos;s yoga.</p>

      <label className="block text-text-secondary text-xs mb-1">Date</label>
      <input
        type="date"
        value={dateStr}
        onChange={e => setDateStr(e.target.value)}
        className="bg-[#111633] border border-gold-primary/20 rounded-lg px-3 py-2 text-text-primary text-sm w-full max-w-xs focus:outline-none focus:border-gold-primary/50 mb-4"
      />

      {result && (
        <div className="space-y-2">
          <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs">
            <span className="text-text-secondary">Sun (sidereal):</span>
            <span className="text-gold-light font-mono">{result.sunSid}&deg;</span>
            <span className="text-text-secondary">Moon (sidereal):</span>
            <span className="text-gold-light font-mono">{result.moonSid}&deg;</span>
            <span className="text-text-secondary">Sum (mod 360):</span>
            <span className="text-gold-light font-mono font-bold">{result.sum}&deg;</span>
          </div>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-text-secondary text-xs">Yoga #:</span>
            <span className="text-gold-light font-mono text-sm font-bold">{result.yogaNum}</span>
            <span className="text-text-secondary text-xs">(= floor({result.sum} / 13.333) + 1)</span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-text-secondary text-xs">Name:</span>
            <span className="text-gold-light font-bold text-sm">{result.name}</span>
            <span className={`text-xs font-medium ${NATURE_COLORS[result.nature] ?? 'text-text-secondary'}`}>
              ({result.nature})
            </span>
          </div>
          {result.meaning && (
            <div className="text-text-secondary text-xs">
              Meaning: <span className="text-text-primary">{result.meaning}</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
