'use client';

import { type ReactNode } from 'react';
import { motion } from 'framer-motion';
import type { Rating } from '@/lib/kundali/domain-synthesis/types';

// ─── Props ──────────────────────────────────────────────────────────────────

interface DomainRingsProps {
  /** Natal tier — determines outer ring colour + fill proportion. */
  natalRating: Rating;
  /** Dasha activation score 0-10 (maha=5 + antar=3 max). Middle ring fill. */
  dashaScore: number;
  /** Combined dasha+transit activation score 0-10. Inner ring fill = score/10.
   *  Always > 0 because dasha always contributes — no empty "Now" rings. */
  nowScore: number;
  /** Optional centre icon (used in Expert mode, omitted in Simple). */
  icon?: ReactNode;
  /** Size in px. Default 80. */
  size?: number;
  /** Pre-formatted accessible label from parent (localised). Falls back to English. */
  ariaLabel?: string;
}

// ─── Colours ────────────────────────────────────────────────────────────────
// Outer: rating-dependent. Middle: blue (dasha). Inner: amber (transits).

const NATAL_COLOURS: Record<Rating, string> = {
  uttama:    '#22c55e', // green
  madhyama:  '#60a5fa', // blue
  adhama:    '#f59e0b', // amber
  atyadhama: '#ef4444', // red
};

const DASHA_COLOUR  = '#3b82f6'; // blue-500
const TRANSIT_COLOUR = '#f59e0b'; // amber-500
const TRACK_COLOUR  = 'rgba(255, 255, 255, 0.10)';

// ─── Natal fill from tier ───────────────────────────────────────────────────
// Uses TIER_SCORES_MAP values: uttama=8.5, madhyama=6.0, adhama=3.5, atyadhama=1.5

const NATAL_FILL: Record<Rating, number> = {
  uttama:    0.85,
  madhyama:  0.60,
  adhama:    0.35,
  atyadhama: 0.15,
};

// ─── Ring geometry (viewBox 100×100, centre 50,50) ──────────────────────────

const RINGS = [
  { radius: 44, stroke: 8 },  // Outer — natal promise
  { radius: 34, stroke: 6 },  // Middle — dasha period
  { radius: 24, stroke: 5 },  // Inner — transits now
] as const;

function circ(r: number) { return 2 * Math.PI * r; }

// ─── Component ──────────────────────────────────────────────────────────────

export default function DomainRings({
  natalRating,
  dashaScore,
  nowScore,
  icon,
  size = 80,
  ariaLabel,
}: DomainRingsProps) {
  const natalFill = NATAL_FILL[natalRating];
  const dashaFill = Math.min(1, Math.max(0, dashaScore / 10));
  const transitFill = Math.min(1, Math.max(0, nowScore / 10));

  const fills = [natalFill, dashaFill, transitFill];
  const colours = [NATAL_COLOURS[natalRating], DASHA_COLOUR, TRANSIT_COLOUR];

  return (
    <div className="relative flex-shrink-0" style={{ width: size, height: size }}>
      <svg viewBox="0 0 100 100" width={size} height={size} role="img"
        aria-label={ariaLabel || `Natal: ${natalRating}, Life phase: ${Math.round(dashaFill * 100)}%, Now: ${Math.round(transitFill * 100)}%`}
      >
        {RINGS.map((ring, i) => {
          const c = circ(ring.radius);
          const fill = fills[i];
          const colour = colours[i];

          return (
            <g key={i}>
              {/* Track */}
              <circle cx={50} cy={50} r={ring.radius}
                fill="none" stroke={TRACK_COLOUR} strokeWidth={ring.stroke} />
              {/* Progress */}
              {fill > 0 && (
                <motion.circle cx={50} cy={50} r={ring.radius}
                  fill="none" stroke={colour} strokeWidth={ring.stroke} strokeLinecap="round"
                  strokeDasharray={c}
                  initial={{ strokeDashoffset: c }}
                  animate={{ strokeDashoffset: c * (1 - fill) }}
                  transition={{ type: 'spring', stiffness: 120, damping: 25, delay: i * 0.15 }}
                  transform="rotate(-90 50 50)"
                />
              )}
            </g>
          );
        })}
      </svg>

      {/* Centre icon (Expert mode) */}
      {icon && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="text-gold-light opacity-60">{icon}</div>
        </div>
      )}
    </div>
  );
}
