'use client';

import { type ReactNode } from 'react';
import { motion } from 'framer-motion';
import type { Rating } from '@/lib/kundali/domain-synthesis/types';

interface DomainRingsProps {
  natalRating: Rating;
  /** Dasha activation score 0-10 for this domain. */
  dashaScore: number;
  /** Current period intensity 0-1 (antardasha + transits). */
  currentIntensity: number;
  /** Domain icon rendered in the center. */
  icon: ReactNode;
  /** Size in px. Default 140. */
  size?: number;
}

// ─── Consistent colours (same across ALL domains) ───────────────────────────
// Natal: gold (brand). Fill % conveys tier strength.
// Mahadasha: indigo. Fill % conveys how much this dasha activates the domain.
// Current: cyan. Fill % conveys antardasha + transit activity.

const NATAL_COLOR = '#34d399';   // emerald-400 — natal promise
const DASHA_COLOR = '#818cf8';   // indigo-400 — mahadasha
const CURRENT_COLOR = '#22d3ee'; // cyan-400 — current period
const TRACK_COLOR = 'rgba(255, 255, 255, 0.10)';

// Natal fill proportional to tier (not always 100%)
const NATAL_FILLS: Record<Rating, number> = {
  uttama:    1.00,  // full ring
  madhyama:  0.75,
  adhama:    0.50,
  atyadhama: 0.25,
};

// ─── Ring geometry (viewBox 140×140, center 70,70) ──────────────────────────

const RINGS = [
  { label: 'Natal Promise', radius: 62, stroke: 10 },
  { label: 'Mahadasha',     radius: 48, stroke: 8 },
  { label: 'Current Period', radius: 36, stroke: 6 },
] as const;

function circ(r: number) { return 2 * Math.PI * r; }
function offset(circumference: number, fill: number) {
  return circumference * (1 - Math.max(0, Math.min(1, fill)));
}

// ─── Component ──────────────────────────────────────────────────────────────

export default function DomainRings({
  natalRating,
  dashaScore,
  currentIntensity,
  icon,
  size = 140,
}: DomainRingsProps) {
  // Natal: tier-proportional fill
  const natalFill = NATAL_FILLS[natalRating];

  // Mahadasha: proportional to activation. Empty if dasha doesn't activate this domain.
  const dashaFill = Math.min(1, Math.max(0, dashaScore / 10));

  // Current: antardasha + transits. Can be 0 (genuinely nothing happening).
  const currentFill = Math.min(1, Math.max(0, currentIntensity));

  const fills = [natalFill, dashaFill, currentFill];
  const colors = [NATAL_COLOR, DASHA_COLOR, CURRENT_COLOR];

  const tierLabel = natalRating.charAt(0).toUpperCase() + natalRating.slice(1);

  return (
    <div className="relative flex-shrink-0" style={{ width: size, height: size }}>
      <svg
        viewBox="0 0 140 140"
        width={size}
        height={size}
        role="img"
        aria-label={`Natal: ${tierLabel}, Mahadasha: ${Math.round(dashaFill * 100)}%, Current: ${Math.round(currentFill * 100)}%`}
      >
        {RINGS.map((ring, i) => {
          const c = circ(ring.radius);
          const fill = fills[i];
          const color = colors[i];

          return (
            <g key={ring.label}>
              {/* Track */}
              <circle
                cx={70} cy={70} r={ring.radius}
                fill="none" stroke={TRACK_COLOR} strokeWidth={ring.stroke}
                aria-hidden="true"
              />
              {/* Progress */}
              {fill > 0 && (
                <motion.circle
                  cx={70} cy={70} r={ring.radius}
                  fill="none"
                  stroke={color}
                  strokeWidth={ring.stroke}
                  strokeLinecap="round"
                  strokeDasharray={c}
                  initial={{ strokeDashoffset: c }}
                  animate={{ strokeDashoffset: offset(c, fill) }}
                  transition={{
                    type: 'spring',
                    stiffness: 120,
                    damping: 25,
                    delay: i * 0.15,
                  }}
                  transform="rotate(-90 70 70)"
                />
              )}
            </g>
          );
        })}
      </svg>

      {/* Center icon */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-5 h-5 text-gold-light opacity-60">
          {icon}
        </div>
      </div>
    </div>
  );
}
