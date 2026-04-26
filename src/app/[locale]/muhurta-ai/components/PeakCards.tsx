'use client';

import type { DetailWindow } from '@/types/muhurta-ai';

interface PeakCardsProps {
  peaks: DetailWindow[];     // Top 3 windows, pre-sorted by score descending
  onCardClick: (window: DetailWindow) => void;
}

const RANK_LABELS = [
  { label: '★ Best Match', textClass: 'text-green-400', bgClass: 'bg-green-400/10' },
  { label: '2nd Best',     textClass: 'text-amber-400', bgClass: 'bg-amber-400/10' },
  { label: '3rd Best',     textClass: 'text-[#8a8478]', bgClass: 'bg-white/[0.04]' },
];

function scoreColor(value: number, max: number): string {
  const pct = value / max;
  if (pct > 0.6) return 'text-green-400 font-medium';
  if (pct > 0.3) return 'text-amber-500 font-medium';
  return 'text-red-500 font-medium';
}

function activeInauspiciousNames(w: DetailWindow): string[] {
  return w.inauspiciousPeriods.filter(p => p.active).map(p => p.name);
}

export default function PeakCards({ peaks, onCardClick }: PeakCardsProps) {
  if (peaks.length === 0) return null;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
      {peaks.slice(0, 3).map((w, idx) => {
        const rank = RANK_LABELS[idx] ?? RANK_LABELS[2];
        const isBest = idx === 0;
        const badPeriods = activeInauspiciousNames(w);

        return (
          <div
            key={`${w.date}-${w.startTime}-${idx}`}
            onClick={() => onCardClick(w)}
            className={[
              'rounded-xl p-3.5 cursor-pointer transition-all hover:-translate-y-0.5 hover:shadow-lg hover:shadow-black/30',
              isBest
                ? 'bg-gradient-to-br from-green-400/[0.06] to-green-400/[0.02] border border-green-400/40'
                : 'bg-[#161b42] border border-green-400/15',
            ].join(' ')}
          >
            {/* Rank badge */}
            <div className="flex items-center justify-between mb-2.5">
              <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${rank.bgClass} ${rank.textClass}`}>
                {rank.label}
              </span>
              <span
                className={`text-base font-bold ${
                  w.score >= 70 ? 'text-green-400' : w.score >= 45 ? 'text-amber-400' : 'text-red-400'
                }`}
              >
                {w.score}
              </span>
            </div>

            {/* Time window */}
            <div className="text-lg font-bold text-[#e6e2d8] leading-tight">
              {w.startTime} – {w.endTime}
            </div>

            {/* Date + panchang context */}
            <div className="text-xs text-[#8a8478] mt-0.5 mb-3">
              {w.date} · {w.panchangContext.tithiName} · {w.panchangContext.nakshatraName}
            </div>

            {/* Factor rows */}
            <div className="space-y-1.5 border-t border-white/[0.05] pt-2.5">
              {/* Panchang Score */}
              <div className="flex justify-between text-[11px]">
                <span className="text-[#8a8478]">Panchang Score</span>
                <span className={scoreColor(w.score, 100)}>{w.score}</span>
              </div>

              {/* Tara Bala */}
              <div className="flex justify-between text-[11px]">
                <span className="text-[#8a8478]">Tara Bala</span>
                {w.taraBala ? (
                  <span className={w.taraBala.auspicious ? 'text-green-400 font-medium' : 'text-amber-500 font-medium'}>
                    {w.taraBala.name}
                  </span>
                ) : (
                  <span className="text-[#8a8478]">—</span>
                )}
              </div>

              {/* Chandra Bala */}
              <div className="flex justify-between text-[11px]">
                <span className="text-[#8a8478]">Chandra Bala</span>
                {w.chandraBala !== undefined ? (
                  <span className={w.chandraBala ? 'text-green-400 font-medium' : 'text-amber-500 font-medium'}>
                    {w.chandraBala ? 'Good' : 'Weak'}
                  </span>
                ) : (
                  <span className="text-[#8a8478]">—</span>
                )}
              </div>

              {/* Dasha Harmony */}
              <div className="flex justify-between text-[11px]">
                <span className="text-[#8a8478]">Dasha Harmony</span>
                <span className={scoreColor(w.breakdown.dashaHarmony, 10)}>
                  {w.breakdown.dashaHarmony}/10
                </span>
              </div>

              {/* Inauspicious */}
              <div className="flex justify-between text-[11px]">
                <span className="text-[#8a8478]">Inauspicious</span>
                {badPeriods.length === 0 ? (
                  <span className="text-green-400 font-medium">None</span>
                ) : (
                  <span className="text-red-500 font-medium text-right max-w-[120px] truncate">
                    {badPeriods.join(', ')}
                  </span>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
