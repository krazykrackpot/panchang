'use client';

import { Sparkles, Calendar, Star, AlertCircle } from 'lucide-react';
import type { CosmicBlueprint } from '@/lib/kundali/archetype-engine';
import type { PersonalReading } from '@/lib/kundali/domain-synthesis/types';
import { buildChartHeadline, type VitalTile } from '@/lib/kundali/chart-headline';

/**
 * 4 vital-sign tiles that summarise a chart at-a-glance:
 *   - Strongest Domain (best-rated life area)
 *   - Current Period (active Maha Dasha + years left)
 *   - Top Yoga (most influential active combination)
 *   - Watch-Out (weakest domain, if any)
 *
 * Deterministically derived from the synthesiser output already on the
 * page (no AI calls) — see `src/lib/kundali/chart-headline.ts`. Mounted
 * inside CosmicIdentityCard below the archetype description so users
 * see the data right under the archetype that explains them (rather
 * than as a separate above-the-card block that could read as a
 * competing verdict).
 *
 * Renders nothing if neither blueprint nor personalReading is available.
 * Graceful degrade: only the buildable tiles appear when some inputs
 * are missing.
 */

interface Props {
  blueprint: CosmicBlueprint | null;
  personalReading: PersonalReading | null;
  locale: string;
}

const TILE_ICON: Record<number, typeof Sparkles> = {
  0: Sparkles,   // Strongest Domain
  1: Calendar,   // Current Period
  2: Star,       // Top Yoga
  3: AlertCircle, // Watch-Out
};

// Tone → solid hex for borders + sub-text accents. Keeps consistent
// with the verdict palette used in BestWindowsCard + DomainRingsCard.
const TONE_COLOURS: Record<VitalTile['tone'], { border: string; sub: string; bg: string }> = {
  emerald: { border: 'border-emerald-500/40', sub: 'text-emerald-300', bg: 'from-emerald-500/8 to-transparent' },
  gold:    { border: 'border-gold-primary/35', sub: 'text-gold-light', bg: 'from-gold-primary/8 to-transparent' },
  amber:   { border: 'border-amber-500/40', sub: 'text-amber-300', bg: 'from-amber-500/8 to-transparent' },
  red:     { border: 'border-red-500/40', sub: 'text-red-300', bg: 'from-red-500/8 to-transparent' },
};

export default function ChartHeadline({ blueprint, personalReading, locale }: Props) {
  // Skip render entirely when there's nothing to summarise — Simple
  // mode's other cards will show their own loading/empty states.
  if (!blueprint && !personalReading) return null;

  // Build via the existing helper but ignore its `headline` field —
  // we no longer render the prose verdict (it conflicted with the
  // archetype description in CosmicIdentityCard). Only the 4 deterministic
  // data tiles render, mounted INSIDE CosmicIdentityCard under the
  // archetype block.
  const { tiles } = buildChartHeadline({ blueprint, personalReading, locale });
  if (tiles.length === 0) return null;

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3 mb-2">
      {tiles.map((tile, i) => {
        const Icon = TILE_ICON[i] ?? Sparkles;
        const colours = TONE_COLOURS[tile.tone];
        return (
          <div
            key={i}
            className={`rounded-xl border ${colours.border} bg-gradient-to-br ${colours.bg} via-[#1a1040]/30 to-[#0a0e27] p-3 sm:p-4 flex flex-col gap-1.5`}
          >
            <div className="flex items-center gap-1.5 text-text-secondary/80 text-[10px] uppercase tracking-widest font-semibold">
              <Icon className="w-3 h-3 shrink-0" />
              <span className="truncate">{tile.label}</span>
            </div>
            <div className="text-gold-light font-bold text-sm sm:text-base leading-tight line-clamp-2">
              {tile.value}
            </div>
            {tile.sub && (
              <div className={`text-[11px] ${colours.sub} truncate`}>{tile.sub}</div>
            )}
          </div>
        );
      })}
    </div>
  );
}
