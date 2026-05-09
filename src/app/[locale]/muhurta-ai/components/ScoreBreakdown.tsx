'use client';

import { useState } from 'react';
import { Info } from 'lucide-react';
import { Link } from '@/lib/i18n/navigation';
import type { DetailBreakdown } from '@/types/muhurta-ai';

interface ScoreBreakdownProps {
  breakdown: DetailBreakdown;
  totalScore: number;          // 0-100
  /** Which personal factors were actually computed (empty = no birth data provided) */
  personalFactorsUsed?: ('taraBala' | 'chandraBala' | 'dashaHarmony')[];
}

interface FactorRow {
  label: string;
  value: number;
  max: number;
  /** true if this factor requires personalisation and none was provided */
  needsPersonalisation?: boolean;
}

// Factors that require the user's birth nakshatra/rashi/dasha to compute
const PERSONAL_FACTOR_MAP: Record<string, 'taraBala' | 'chandraBala' | 'dashaHarmony'> = {
  'Tara Bala': 'taraBala',
  'Chandra Bala': 'chandraBala',
  'Dasha Harmony': 'dashaHarmony',
};

function buildRows(b: DetailBreakdown, personalFactorsUsed?: string[]): FactorRow[] {
  const used = new Set(personalFactorsUsed || []);
  return [
    { label: 'Tithi',         value: b.tithi,         max: 20 },
    { label: 'Nakshatra',     value: b.nakshatra,     max: 20 },
    { label: 'Yoga',          value: b.yoga,          max: 20 },
    { label: 'Karana',        value: b.karana,        max: 10 },
    { label: 'Tara Bala',     value: b.taraBala,      max: 10, needsPersonalisation: !used.has('taraBala') },
    { label: 'Chandra Bala',  value: b.chandraBala,   max: 10, needsPersonalisation: !used.has('chandraBala') },
    { label: 'Dasha Harmony', value: b.dashaHarmony,  max: 10, needsPersonalisation: !used.has('dashaHarmony') },
    { label: 'Lagna',          value: b.lagna,          max: 8 },
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

export default function ScoreBreakdown({ breakdown, totalScore, personalFactorsUsed }: ScoreBreakdownProps) {
  const rows = buildRows(breakdown, personalFactorsUsed);
  const [showAyanamshaNote, setShowAyanamshaNote] = useState(false);
  const [showLagnaNote, setShowLagnaNote] = useState(false);

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
              <span className="w-[140px] text-sm text-[#8a8478] shrink-0 flex items-center gap-1">
                {row.label}
                {row.label === 'Lagna' && (
                  <button
                    onClick={() => setShowLagnaNote(v => !v)}
                    className="text-[#8a8478] hover:text-gold-light transition-colors"
                    aria-label="Lagna scoring information"
                    title="What is Lagna and why does it matter?"
                  >
                    <Info size={12} />
                  </button>
                )}
              </span>

              {row.needsPersonalisation ? (
                <>
                  {/* Dashed placeholder bar + hint for factors that need birth details */}
                  <div className="flex-1 h-1.5 bg-white/[0.03] rounded-full border border-dashed border-white/[0.08]" />
                  <span className="w-10 text-right text-xs text-text-secondary italic" title="Set your birth nakshatra above to unlock this score">
                    —
                  </span>
                </>
              ) : (
                <>
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
                </>
              )}
            </div>
          );
        })}

        {showLagnaNote && (
          <div className="mt-2 p-3 rounded-lg bg-gold-primary/5 border border-gold-primary/15 text-xs text-text-secondary leading-relaxed">
            <span className="font-semibold text-gold-light">What is Lagna?</span>{' '}
            Lagna is the zodiac sign rising on the eastern horizon at the start of your activity. A strong, appropriate
            lagna can compensate for minor inauspicious factors &mdash; classical texts (Muhurta Chintamani Ch. 4) give
            it disproportionate weight. Fixed signs suit permanent events (marriage, house), movable signs suit travel,
            and dual signs suit learning.{' '}
            <Link href="/learn/lagna" className="text-gold-light underline hover:text-gold-primary">
              Learn more &rarr;
            </Link>
          </div>
        )}

        {/* Personalisation hint if any factors are missing */}
        {rows.some(r => r.needsPersonalisation) && (
          <p className="mt-2 text-xs text-text-secondary italic">
            Set your birth nakshatra &amp; rashi above to unlock Tara Bala, Chandra Bala, and Dasha scores.
          </p>
        )}
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
