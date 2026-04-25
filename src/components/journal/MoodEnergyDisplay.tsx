'use client';

/**
 * MoodEnergyDisplay — small read-only mood + energy indicator.
 *
 * Mood levels use a colour ramp (red → emerald).
 * Energy levels use vertical bar segments of increasing height.
 * Both are 1-based (1 = lowest, 5 = highest).
 */

interface Props {
  mood: number;
  energy: number;
  size?: 'sm' | 'md';
}

// Colour per level (1-indexed, index 0 unused)
const MOOD_COLOURS = [
  '',
  'bg-red-400',
  'bg-orange-400',
  'bg-yellow-400',
  'bg-lime-400',
  'bg-emerald-400',
] as const;

const MOOD_BORDER_COLOURS = [
  '',
  'border-red-400',
  'border-orange-400',
  'border-yellow-400',
  'border-lime-400',
  'border-emerald-400',
] as const;

const ENERGY_COLOURS = [
  '',
  'bg-sky-400',
  'bg-sky-400',
  'bg-sky-400',
  'bg-sky-400',
  'bg-sky-400',
] as const;

export default function MoodEnergyDisplay({ mood, energy, size = 'md' }: Props) {
  const dotSize  = size === 'sm' ? 'w-3 h-3'   : 'w-4 h-4';
  const barW     = size === 'sm' ? 'w-2'        : 'w-2.5';
  const barMaxH  = size === 'sm' ? 10            : 14; // px for the tallest bar
  const gap      = size === 'sm' ? 'gap-1'       : 'gap-1.5';
  const labelCls = 'text-[10px] text-text-secondary uppercase tracking-widest font-semibold mb-1';

  return (
    <div className="flex items-start gap-5">
      {/* Mood */}
      <div>
        <p className={labelCls}>Mood</p>
        <div className={`flex items-center ${gap}`}>
          {[1, 2, 3, 4, 5].map((level) => {
            const active = level <= mood;
            return (
              <span
                key={level}
                className={[
                  'rounded-full border',
                  dotSize,
                  active
                    ? `${MOOD_COLOURS[level]} border-transparent`
                    : `bg-transparent ${MOOD_BORDER_COLOURS[level]} opacity-30`,
                ].join(' ')}
                aria-hidden="true"
              />
            );
          })}
        </div>
      </div>

      {/* Energy — vertical bars of increasing height */}
      <div>
        <p className={labelCls}>Energy</p>
        <div className={`flex items-end ${gap}`}>
          {[1, 2, 3, 4, 5].map((level) => {
            const active  = level <= energy;
            // Height grows linearly: level/5 × barMaxH, minimum 3px
            const heightPx = Math.round(3 + ((level / 5) * (barMaxH - 3)));
            return (
              <span
                key={level}
                className={[
                  'rounded-sm',
                  barW,
                  active
                    ? `${ENERGY_COLOURS[level]}`
                    : 'bg-sky-400/20',
                ].join(' ')}
                style={{ height: `${heightPx}px` }}
                aria-hidden="true"
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}
