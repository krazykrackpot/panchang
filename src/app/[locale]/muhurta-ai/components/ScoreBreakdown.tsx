'use client';

import { useState } from 'react';
import { Info } from 'lucide-react';
import type { DetailBreakdown } from '@/types/muhurta-ai';

interface ScoreBreakdownProps {
  breakdown: DetailBreakdown;
  totalScore: number;          // 0-100
}

interface FactorRow {
  label: string;
  value: number;
  max: number;
}

function buildRows(b: DetailBreakdown): FactorRow[] {
  return [
    { label: 'Tithi',         value: b.tithi,         max: 20 },
    { label: 'Nakshatra',     value: b.nakshatra,     max: 20 },
    { label: 'Yoga',          value: b.yoga,          max: 20 },
    { label: 'Karana',        value: b.karana,        max: 10 },
    { label: 'Tara Bala',     value: b.taraBala,      max: 10 },
    { label: 'Chandra Bala',  value: b.chandraBala,   max: 10 },
    { label: 'Dasha Harmony', value: b.dashaHarmony,  max: 10 },
    { label: 'Inauspicious',  value: b.inauspicious,  max: 10 },
  ];
}

function barFillClass(value: number, max: number): string {
  const pct = value / max;
  if (pct > 0.6) return 'bg-green-400';
  if (pct > 0.3) return 'bg-amber-500';
  return 'bg-red-500';
}

function scoreTextClass(value: number, max: number): string {
  const pct = value / max;
  if (pct > 0.6) return 'text-green-400 font-semibold';
  if (pct > 0.3) return 'text-amber-500 font-semibold';
  return 'text-red-500 font-semibold';
}

function totalScoreClass(score: number): string {
  if (score > 70) return 'text-green-400';
  if (score > 40) return 'text-amber-400';
  return 'text-red-400';
}

export default function ScoreBreakdown({ breakdown, totalScore }: ScoreBreakdownProps) {
  const rows = buildRows(breakdown);
  const [showAyanamshaNote, setShowAyanamshaNote] = useState(false);

  return (
    <div className="bg-[#111633] border border-[#d4a853]/10 rounded-xl p-5">
      <div className="flex items-center gap-2 mb-3">
        <h3 className="font-[Cinzel] text-base text-[#f0d48a]">Score Breakdown</h3>
        <button
          onClick={() => setShowAyanamshaNote(v => !v)}
          className="text-[#8a8478] hover:text-gold-light transition-colors"
          aria-label="Ayanamsha information"
          title="Why does muhurta scoring use Lahiri ayanamsha?"
        >
          <Info size={14} />
        </button>
      </div>

      {showAyanamshaNote && (
        <div className="mb-3 p-3 rounded-lg bg-gold-primary/5 border border-gold-primary/15 text-xs text-text-secondary leading-relaxed">
          <span className="font-semibold text-gold-light">Why Lahiri?</span>{' '}
          Muhurta scoring always uses Lahiri (Chitrapaksha) ayanamsha, even if you&apos;ve selected KP or Raman for your birth chart.
          Classical muhurta rules from texts like Muhurta Chintamani and Dharma Sindhu were composed under Lahiri
          boundaries &mdash; applying those rules with a different ayanamsha would shift nakshatra boundaries and produce
          less accurate results. Your kundali and panchang pages still respect your chosen ayanamsha for display.
        </div>
      )}

      <div>
        {rows.map((row, i) => {
          const widthPct = Math.min(100, Math.max(0, (row.value / row.max) * 100));
          return (
            <div
              key={row.label}
              className={`flex items-center gap-3 py-2 ${
                i < rows.length - 1 ? 'border-b border-white/[0.04]' : ''
              }`}
            >
              {/* Label */}
              <span className="w-[140px] text-sm text-[#8a8478] shrink-0">{row.label}</span>

              {/* Bar track */}
              <div className="flex-1 h-1.5 bg-white/[0.05] rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${barFillClass(row.value, row.max)}`}
                  style={{ width: `${widthPct}%` }}
                />
              </div>

              {/* Score */}
              <span className={`w-10 text-right text-sm ${scoreTextClass(row.value, row.max)}`}>
                {row.value}
              </span>
            </div>
          );
        })}
      </div>

      {/* Total row */}
      <div className="mt-3 pt-3 border-t border-white/[0.08] flex items-center justify-between">
        <span className="text-sm text-[#8a8478]">Total Score</span>
        <span className={`text-xl font-bold ${totalScoreClass(totalScore)}`}>
          {totalScore}
          <span className="text-sm font-normal text-[#8a8478]">/100</span>
        </span>
      </div>
    </div>
  );
}
