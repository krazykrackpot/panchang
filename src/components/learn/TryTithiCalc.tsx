'use client';

import { useState, useMemo } from 'react';
import { dateToJD, calculateTithi } from '@/lib/ephem/astronomical';
import { TITHIS } from '@/lib/constants/tithis';

function formatDate(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

export default function TryTithiCalc() {
  const [dateStr, setDateStr] = useState(formatDate(new Date()));

  const result = useMemo(() => {
    const [y, m, d] = dateStr.split('-').map(Number);
    if (!y || !m || !d) return null;
    // Use noon UTC for a stable mid-day calculation
    const jd = dateToJD(y, m, d, 12);
    const { number, degree } = calculateTithi(jd);
    const tithi = TITHIS.find(t => t.number === number);
    const paksha = number <= 15 ? 'Shukla' : 'Krishna';
    const pakshaNum = number <= 15 ? number : number - 15;
    return { number, degree: degree.toFixed(2), name: tithi?.name.en ?? `Tithi ${number}`, paksha, pakshaNum };
  }, [dateStr]);

  return (
    <div className="rounded-2xl border border-gold-primary/20 bg-gradient-to-br from-[#2d1b69]/20 to-[#0a0e27] p-5 my-6">
      <h4 className="text-gold-light font-bold text-base mb-1" style={{ fontFamily: 'var(--font-heading)' }}>
        Try It -- Tithi Calculator
      </h4>
      <p className="text-text-secondary text-xs mb-4">Pick a date and see the Sun-Moon elongation and resulting tithi.</p>

      <label className="block text-text-secondary text-xs mb-1">Date</label>
      <input
        type="date"
        value={dateStr}
        onChange={e => setDateStr(e.target.value)}
        className="bg-[#111633] border border-gold-primary/20 rounded-lg px-3 py-2 text-text-primary text-sm w-full max-w-xs focus:outline-none focus:border-gold-primary/50 mb-4"
      />

      {result && (
        <div className="space-y-2">
          <div className="flex items-baseline gap-2">
            <span className="text-text-secondary text-xs">Moon-Sun Elongation:</span>
            <span className="text-gold-light font-mono text-sm font-bold">{result.degree}&deg;</span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-text-secondary text-xs">Tithi #:</span>
            <span className="text-gold-light font-mono text-sm font-bold">{result.number}</span>
            <span className="text-text-secondary text-xs">(= floor({result.degree} / 12) + 1)</span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-text-secondary text-xs">Name:</span>
            <span className="text-gold-light font-bold text-sm">{result.paksha} {result.name}</span>
            <span className="text-text-secondary text-xs">({result.paksha} Paksha, {result.pakshaNum} of 15)</span>
          </div>
        </div>
      )}
    </div>
  );
}
