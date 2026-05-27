'use client';

import type { BodyRegionResult } from '@/lib/kundali/health-diagnosis/legacy/body-map';
import type { BodyRegion } from '@/lib/kundali/health-diagnosis/legacy/constants';
import type { Locale } from '@/types/panchang';
import { useState } from 'react';

const VIEWBOX = { w: 800, h: 900 };
const BODY_COLOR = 'rgba(212, 168, 83, 0.18)';
const BODY_STROKE = 'rgba(240, 212, 138, 0.55)';

// Anchor points on the body for each house (1-12).
// SVG coords inside the viewBox (0,0 top-left → 800,900 bottom-right).
const ANCHORS: Record<number, { x: number; y: number; side: 'left' | 'right' }> = {
  1:  { x: 400, y:  90, side: 'left'  },  // Head & Brain — top of head
  2:  { x: 400, y: 165, side: 'right' },  // Face, Throat, Speech — neck
  3:  { x: 340, y: 230, side: 'left'  },  // Arms, Lungs, Chest — upper chest L
  4:  { x: 410, y: 285, side: 'right' },  // Heart, Breast — heart area
  5:  { x: 400, y: 360, side: 'left'  },  // Stomach, Liver — upper abdomen
  6:  { x: 400, y: 430, side: 'right' },  // Intestines — lower abdomen
  7:  { x: 400, y: 490, side: 'left'  },  // Kidneys, Reproductive — pelvis
  8:  { x: 460, y: 460, side: 'right' },  // Chronic / Hidden — back-kidney area
  9:  { x: 360, y: 560, side: 'left'  },  // Hips, Thighs — upper thigh
  10: { x: 410, y: 680, side: 'right' },  // Knees, Spine — knees
  11: { x: 380, y: 780, side: 'left'  },  // Calves, Ankles
  12: { x: 410, y: 855, side: 'right' },  // Feet, Eyes, Sleep
};

function vulnerabilityTier(score: number): { tier: 'low' | 'moderate' | 'high' | 'severe'; colour: string; bg: string; ring: string } {
  if (score >= 75) return { tier: 'severe',   colour: '#f87171', bg: 'rgba(248,113,113,0.12)', ring: 'rgba(248,113,113,0.45)' };
  if (score >= 50) return { tier: 'high',     colour: '#fbbf24', bg: 'rgba(251,191,36,0.12)',  ring: 'rgba(251,191,36,0.45)'  };
  if (score >= 25) return { tier: 'moderate', colour: '#d4a853', bg: 'rgba(212,168,83,0.12)',  ring: 'rgba(212,168,83,0.45)'  };
  return               { tier: 'low',      colour: '#4ade80', bg: 'rgba(74,222,128,0.10)',  ring: 'rgba(74,222,128,0.35)'  };
}

// Returns the localised body-region name, falling back to English for locales
// not yet translated (te/gu/kn/mai/mr). The BodyRegion type has optional fields
// for these locales; undefined means "use English" per CLAUDE.md fallback rule.
function regionLabel(region: BodyRegionResult & { bodyRegion: BodyRegion }, locale: Locale): string {
  const r = region.bodyRegion;
  // Use the locale-specific field when present; fall back to en.
  const field = r[locale as keyof BodyRegion];
  return field ?? r.en;
}

// Place a callout box at the edge of the body. Returns its (x, y) inside the SVG.
function calloutPos(side: 'left' | 'right', indexOnSide: number): { x: number; y: number } {
  const colX = side === 'left' ? 30 : 540;
  const rowY = 60 + indexOnSide * 130; // vertical spacing per row
  return { x: colX, y: rowY };
}

export default function BodyMapVisual({
  bodyMap,
  locale,
}: {
  bodyMap: (BodyRegionResult & { bodyRegion: BodyRegion })[];
  locale: Locale;
}) {
  const [hoveredHouse, setHoveredHouse] = useState<number | null>(null);

  // Sort by anchor y, then assign row indices per side
  const sortedByY = [...bodyMap].sort((a, b) => ANCHORS[a.house].y - ANCHORS[b.house].y);
  const leftRow: Record<number, number>  = {};
  const rightRow: Record<number, number> = {};
  let leftIdx = 0, rightIdx = 0;
  for (const r of sortedByY) {
    if (ANCHORS[r.house].side === 'left') {
      leftRow[r.house] = leftIdx++;
    } else {
      rightRow[r.house] = rightIdx++;
    }
  }

  const CALLOUT_W = 230;
  const CALLOUT_H = 90;

  return (
    <div className="w-full">
      <svg
        viewBox={`0 0 ${VIEWBOX.w} ${VIEWBOX.h}`}
        className="w-full h-auto"
        preserveAspectRatio="xMidYMid meet"
      >
        {/* Background body silhouette — simplified front view */}
        <g fill={BODY_COLOR} stroke={BODY_STROKE} strokeWidth="2">
          {/* Head */}
          <ellipse cx="400" cy="100" rx="50" ry="60" />
          {/* Neck */}
          <rect x="385" y="155" width="30" height="25" />
          {/* Torso — broad shoulders down to hips */}
          <path d="M 310 200 Q 310 180, 340 175 L 460 175 Q 490 180, 490 200 L 480 380 Q 475 420, 460 450 L 340 450 Q 325 420, 320 380 Z" />
          {/* Hips/pelvis transition */}
          <path d="M 340 450 L 460 450 L 470 530 L 330 530 Z" />
          {/* Left arm */}
          <path d="M 310 200 Q 280 220, 270 280 L 250 380 Q 245 420, 250 460 Q 255 470, 265 470 Q 275 465, 275 455 L 290 380 Q 295 320, 320 260 Z" />
          {/* Right arm (mirror) */}
          <path d="M 490 200 Q 520 220, 530 280 L 550 380 Q 555 420, 550 460 Q 545 470, 535 470 Q 525 465, 525 455 L 510 380 Q 505 320, 480 260 Z" />
          {/* Left leg */}
          <path d="M 330 530 L 360 530 L 365 720 Q 365 760, 360 800 L 360 850 Q 360 860, 350 860 Q 340 860, 340 850 L 335 800 Q 325 760, 325 720 Z" />
          {/* Right leg */}
          <path d="M 440 530 L 470 530 L 475 720 Q 475 760, 470 800 L 470 850 Q 470 860, 460 860 Q 450 860, 450 850 L 445 800 Q 435 760, 435 720 Z" />
        </g>

        {/* Anchor + connecting line + callout for each region */}
        {bodyMap.map((region) => {
          const anchor = ANCHORS[region.house];
          if (!anchor) return null;
          const v = vulnerabilityTier(region.vulnerability);
          const rowIdx = anchor.side === 'left' ? leftRow[region.house] : rightRow[region.house];
          const c = calloutPos(anchor.side, rowIdx);
          const isHovered = hoveredHouse === region.house;
          // Line origin = edge of callout closest to anchor
          const lineFromX = anchor.side === 'left' ? c.x + CALLOUT_W : c.x;
          const lineFromY = c.y + CALLOUT_H / 2;
          const opacity = hoveredHouse == null ? 1 : isHovered ? 1 : 0.35;
          const label = regionLabel(region, locale);
          const truncLabel = label.length > 22 ? label.slice(0, 20) + '…' : label;

          return (
            <g
              key={region.house}
              onMouseEnter={() => setHoveredHouse(region.house)}
              onMouseLeave={() => setHoveredHouse(null)}
              style={{ opacity, transition: 'opacity 200ms' }}
            >
              {/* Connecting line */}
              <line
                x1={lineFromX} y1={lineFromY}
                x2={anchor.x}  y2={anchor.y}
                stroke={v.colour}
                strokeWidth={isHovered ? 2.5 : 1.5}
                strokeOpacity="0.7"
              />
              {/* Anchor dot on body */}
              <circle cx={anchor.x} cy={anchor.y} r={isHovered ? 9 : 6}  fill={v.colour} stroke="#0a0e27" strokeWidth="2" />
              <circle cx={anchor.x} cy={anchor.y} r={isHovered ? 14 : 10} fill="none"    stroke={v.ring}   strokeWidth="1.5" />

              {/* Callout box */}
              <g>
                <rect
                  x={c.x} y={c.y}
                  width={CALLOUT_W} height={CALLOUT_H}
                  rx="8" ry="8"
                  fill="rgba(10, 14, 39, 0.92)"
                  stroke={v.ring}
                  strokeWidth={isHovered ? 2 : 1}
                />
                {/* House number badge */}
                <circle cx={c.x + 18} cy={c.y + 18} r={12} fill={v.bg} stroke={v.colour} strokeWidth="1.5" />
                <text x={c.x + 18} y={c.y + 22} textAnchor="middle" fontSize="13" fontWeight="700" fill={v.colour}>
                  {region.house}
                </text>
                {/* Region name */}
                <text x={c.x + 38} y={c.y + 24} fontSize="14" fontWeight="600" fill="#e6e2d8">
                  <tspan>{truncLabel}</tspan>
                </text>
                {/* Vulnerability bar background */}
                <rect
                  x={c.x + 14} y={c.y + 42}
                  width={CALLOUT_W - 28} height={8}
                  rx="4" ry="4"
                  fill="rgba(255,255,255,0.06)"
                />
                {/* Vulnerability bar fill */}
                <rect
                  x={c.x + 14} y={c.y + 42}
                  width={Math.max(0, Math.min(CALLOUT_W - 28, (CALLOUT_W - 28) * region.vulnerability / 100))}
                  height={8} rx="4" ry="4"
                  fill={v.colour}
                />
                {/* Score text */}
                <text x={c.x + 14} y={c.y + 68} fontSize="11" fill="rgba(230, 226, 216, 0.65)">
                  {region.vulnerability}/100 — {v.tier}
                </text>
              </g>
            </g>
          );
        })}
      </svg>

      {/* Factor details — shown below SVG when a region is hovered */}
      {hoveredHouse != null && (
        <div className="mt-4 p-4 bg-bg-primary/60 border border-gold-primary/15 rounded-xl">
          {(() => {
            const r = bodyMap.find((x) => x.house === hoveredHouse);
            if (!r || r.factors.length === 0) {
              return (
                <p className="text-text-secondary/70 text-sm">
                  No specific factors detected for house {hoveredHouse}.
                </p>
              );
            }
            return (
              <>
                <p className="text-gold-light text-sm font-medium mb-2">
                  House {hoveredHouse} — {regionLabel(r, locale)}
                </p>
                <ul className="text-text-secondary/80 text-xs space-y-1 list-disc list-inside">
                  {r.factors.map((f, i) => <li key={i}>{f}</li>)}
                </ul>
              </>
            );
          })()}
        </div>
      )}
    </div>
  );
}
