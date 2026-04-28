'use client';

import type { BirthPosterData } from '@/lib/shareable/birth-poster';

/* ════════════════════════════════════════════════════════════════
   BirthPosterCard — Astro-Aesthetic Birth Poster
   "Spotify Wrapped for Jyotish"

   Renders as a styled div suitable for:
   - Client-side screenshot (html-to-image / html2canvas)
   - Satori server-side rendering (flexbox only, no CSS grid)

   Supports story (1080x1920), square (1080x1080), og (1200x630).
   ════════════════════════════════════════════════════════════════ */

/* ── Planet abbreviations for the mini chart ── */
const PLANET_ABBR: Record<number, string> = {
  0: 'Su', 1: 'Mo', 2: 'Ma', 3: 'Me', 4: 'Ju', 5: 'Ve', 6: 'Sa', 7: 'Ra', 8: 'Ke',
};

/**
 * North Indian diamond chart house geometry, scaled to a given size.
 * ViewBox is 0..size, diamond centered, 12 triangular/rhombus houses.
 * Returns: { path, cx, cy } for each house (1-indexed).
 */
function getHouseGeometry(s: number): Record<number, { path: string; cx: number; cy: number }> {
  // Key points on the diamond (padded 6% from edge)
  const p = Math.round(s * 0.06); // padding
  const m = Math.round(s / 2);    // midpoint
  const q1 = Math.round(s * 0.28);// 1/4-ish
  const q3 = Math.round(s * 0.72);// 3/4-ish

  // Corners: top=T, left=L, bottom=B, right=R
  const T = `${m} ${p}`;
  const L = `${p} ${m}`;
  const B = `${m} ${s - p}`;
  const R = `${s - p} ${m}`;
  const C = `${m} ${m}`;

  // Mid-edge points
  const TL = `${q1} ${q1}`;
  const TR = `${q3} ${q1}`;
  const BL = `${q1} ${q3}`;
  const BR = `${q3} ${q3}`;

  return {
    1:  { path: `M ${T} L ${TL} L ${C} L ${TR} Z`, cx: m, cy: Math.round(m * 0.52) },
    2:  { path: `M ${p} ${p} L ${TL} L ${T} Z`, cx: Math.round(m * 0.55), cy: Math.round(m * 0.42) },
    3:  { path: `M ${p} ${p} L ${p} ${m} L ${TL} Z`, cx: Math.round(m * 0.35), cy: Math.round(m * 0.55) },
    4:  { path: `M ${L} L ${TL} L ${C} L ${BL} Z`, cx: Math.round(m * 0.52), cy: m },
    5:  { path: `M ${L} L ${BL} L ${p} ${s - p} Z`, cx: Math.round(m * 0.35), cy: Math.round(m * 1.45) },
    6:  { path: `M ${p} ${s - p} L ${BL} L ${B} Z`, cx: Math.round(m * 0.55), cy: Math.round(m * 1.58) },
    7:  { path: `M ${B} L ${BL} L ${C} L ${BR} Z`, cx: m, cy: Math.round(m * 1.48) },
    8:  { path: `M ${B} L ${BR} L ${s - p} ${s - p} Z`, cx: Math.round(m * 1.45), cy: Math.round(m * 1.58) },
    9:  { path: `M ${s - p} ${s - p} L ${BR} L ${R} Z`, cx: Math.round(m * 1.65), cy: Math.round(m * 1.45) },
    10: { path: `M ${R} L ${BR} L ${C} L ${TR} Z`, cx: Math.round(m * 1.48), cy: m },
    11: { path: `M ${R} L ${TR} L ${s - p} ${p} Z`, cx: Math.round(m * 1.65), cy: Math.round(m * 0.55) },
    12: { path: `M ${s - p} ${p} L ${TR} L ${T} Z`, cx: Math.round(m * 1.45), cy: Math.round(m * 0.42) },
  };
}

/** Render a mini North Indian diamond chart as pure inline SVG (Satori-compatible). */
function MiniNorthChart({ houses, size }: { houses: number[][]; size: number }) {
  const geo = getHouseGeometry(size);
  const fontSize = Math.max(7, Math.round(size * 0.033));
  const lineHeight = fontSize + 2;

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      {/* Background */}
      <rect x="0" y="0" width={size} height={size} fill="#0a0e27" rx={Math.round(size * 0.03)} />
      {/* House paths and planet labels */}
      {[1,2,3,4,5,6,7,8,9,10,11,12].map((h) => {
        const g = geo[h];
        const planetIds = houses[h - 1] || [];
        const labels = planetIds.map(id => PLANET_ABBR[id] || '').filter(Boolean);
        return (
          <g key={h}>
            <path d={g.path} fill="none" stroke="#d4a853" strokeWidth={1} opacity={0.7} />
            {labels.map((lbl, i) => {
              // Stack labels vertically centered around cx, cy
              const yOffset = (i - (labels.length - 1) / 2) * lineHeight;
              return (
                <text
                  key={i}
                  x={g.cx}
                  y={g.cy + yOffset}
                  fill="#e6e2d8"
                  fontSize={fontSize}
                  fontFamily="monospace"
                  textAnchor="middle"
                  dominantBaseline="central"
                >
                  {lbl}
                </text>
              );
            })}
          </g>
        );
      })}
    </svg>
  );
}

const ELEMENT_COLORS: Record<number, string> = {
  0: '#f59e0b', // fire  — amber
  1: '#10b981', // earth — emerald
  2: '#38bdf8', // air   — sky
  3: '#818cf8', // water — indigo
};


const ELEMENT_LABELS: Record<string, string> = {
  fire: 'FIRE',
  earth: 'EARTH',
  air: 'AIR',
  water: 'WATER',
  tie: 'BALANCED',
};

/** Dimensions per format */
const FORMAT_DIMS: Record<string, { w: number; h: number }> = {
  story:  { w: 1080, h: 1920 },
  square: { w: 1080, h: 1080 },
  og:     { w: 1200, h: 630 },
};


interface BirthPosterCardProps {
  data: BirthPosterData;
  format: 'story' | 'square' | 'og';
  locale: string;
}

export default function BirthPosterCard({ data, format, locale }: BirthPosterCardProps) {
  const dims = FORMAT_DIMS[format] || FORMAT_DIMS.story;
  const isCompact = format === 'og' || format === 'square';
  const isOg = format === 'og';

  const elementLabel = ELEMENT_LABELS[data.elementDist.dominant] || 'BALANCED';
  const archLabel = locale === 'hi' ? data.elementDist.archetype.hi : data.elementDist.archetype.en;

  // Percentage bar width (capped at 100)
  const pct = Math.min(data.elementDist.percentage, 100);

  // Determine dominant element color for the bar
  const domIdx = data.elementDist.dominant === 'fire' ? 0
    : data.elementDist.dominant === 'earth' ? 1
    : data.elementDist.dominant === 'air' ? 2
    : data.elementDist.dominant === 'water' ? 3 : 0;
  const domColor = ELEMENT_COLORS[domIdx];

  // OG format uses horizontal layout
  if (isOg) {
    return (
      <div
        style={{
          width: dims.w,
          height: dims.h,
          background: 'linear-gradient(135deg, #0a0e27 0%, #111633 50%, #0a0e27 100%)',
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          padding: 40,
          fontFamily: 'serif',
          position: 'relative',
          overflow: 'hidden',
          border: '1px solid rgba(212, 168, 83, 0.1)',
          borderRadius: 24,
        }}
      >
        {/* Left: mini North Indian chart */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginRight: 40, flexShrink: 0 }}>
          <MiniNorthChart houses={data.chartHouses} size={150} />
        </div>

        {/* Right: content */}
        <div style={{ display: 'flex', flexDirection: 'column', flex: 1, justifyContent: 'center' }}>
          <div style={{ fontSize: 10, color: '#d4a853', letterSpacing: 4, textTransform: 'uppercase' as const, marginBottom: 8 }}>
            VEDIC BIRTH CHART
          </div>
          <div style={{ fontSize: 32, color: '#f0d48a', fontWeight: 700, lineHeight: 1.1, marginBottom: 6 }}>
            {data.name || 'Birth Chart'}
          </div>
          <div style={{ fontSize: 13, color: '#8a8478', fontFamily: 'monospace', marginBottom: 4 }}>
            {data.date} &middot; {data.time}
          </div>
          <div style={{ fontSize: 12, color: '#6b6560', marginBottom: 16 }}>
            {data.place}
          </div>
          <div style={{ display: 'flex', flexDirection: 'row', gap: 16, flexWrap: 'wrap' as const, marginBottom: 12 }}>
            <div style={{ fontSize: 13, color: '#e6e2d8' }}>
              <span style={{ color: '#d4a853' }}>{data.risingSign}</span> Rising
            </div>
            <div style={{ fontSize: 13, color: '#e6e2d8' }}>
              Moon in <span style={{ color: '#d4a853' }}>{data.moonSign}</span>
            </div>
            <div style={{ fontSize: 13, color: '#e6e2d8' }}>
              Sun in <span style={{ color: '#d4a853' }}>{data.sunSign}</span>
            </div>
          </div>
          <div style={{ fontSize: 11, color: '#8a8478' }}>
            {data.currentDasha}{data.standoutYoga ? ` · ${data.standoutYoga}` : ''}
          </div>
          {/* Watermark */}
          <div style={{ fontSize: 9, color: 'rgba(212, 168, 83, 0.5)', marginTop: 16 }}>
            dekhopanchang.com
          </div>
        </div>
      </div>
    );
  }

  // Story / Square layout (vertical)
  return (
    <div
      style={{
        width: dims.w,
        height: dims.h,
        background: 'linear-gradient(180deg, #0a0e27 0%, #111633 40%, #0a0e27 100%)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: isCompact ? 'center' : 'flex-start',
        padding: isCompact ? 40 : 64,
        paddingTop: isCompact ? 40 : 80,
        fontFamily: 'serif',
        position: 'relative',
        overflow: 'hidden',
        border: '1px solid rgba(212, 168, 83, 0.1)',
        borderRadius: 24,
      }}
    >
      {/* Top label */}
      <div style={{
        fontSize: isCompact ? 10 : 12,
        color: '#d4a853',
        letterSpacing: 6,
        textTransform: 'uppercase' as const,
        marginBottom: isCompact ? 16 : 24,
        textAlign: 'center' as const,
      }}>
        VEDIC BIRTH CHART
      </div>

      {/* Name */}
      <div style={{
        fontSize: isCompact ? 32 : 48,
        color: '#f0d48a',
        fontWeight: 700,
        lineHeight: 1.1,
        textAlign: 'center' as const,
        marginBottom: 8,
        maxWidth: '90%',
      }}>
        {data.name || 'Birth Chart'}
      </div>

      {/* Birth data */}
      <div style={{
        fontSize: isCompact ? 13 : 16,
        color: '#8a8478',
        fontFamily: 'monospace',
        marginBottom: 4,
        textAlign: 'center' as const,
      }}>
        {data.date} &middot; {data.time}
      </div>
      <div style={{
        fontSize: isCompact ? 12 : 14,
        color: '#6b6560',
        marginBottom: isCompact ? 20 : 40,
        textAlign: 'center' as const,
      }}>
        {data.place}
      </div>

      {/* North Indian Diamond Chart */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: isCompact ? 20 : 40,
      }}>
        <MiniNorthChart
          houses={data.chartHouses}
          size={isCompact ? 200 : 300}
        />
      </div>

      {/* Rising, Moon, Sun signs */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: isCompact ? 6 : 10,
        marginBottom: isCompact ? 16 : 32,
      }}>
        <div style={{
          fontSize: isCompact ? 20 : 28,
          color: '#f0d48a',
          fontWeight: 700,
          letterSpacing: 2,
          textTransform: 'uppercase' as const,
        }}>
          {data.risingSign} {locale === 'en' ? 'Rising' : 'लग्न'}
        </div>
        <div style={{
          fontSize: isCompact ? 14 : 18,
          color: '#e6e2d8',
        }}>
          {locale === 'en' ? 'Moon in' : 'चन्द्र'} {data.moonSign} &middot; {data.moonNakshatra}
        </div>
        <div style={{
          fontSize: isCompact ? 14 : 18,
          color: '#e6e2d8',
        }}>
          {locale === 'en' ? 'Sun in' : 'सूर्य'} {data.sunSign}
        </div>
      </div>

      {/* Element distribution bar */}
      <div style={{
        width: '80%',
        marginBottom: isCompact ? 16 : 32,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          marginBottom: 8,
        }}>
          <span style={{ fontSize: isCompact ? 16 : 22, color: domColor, fontWeight: 700 }}>
            {pct}% {elementLabel}
          </span>
        </div>
        {/* Bar */}
        <div style={{
          width: '100%',
          height: isCompact ? 8 : 12,
          background: 'rgba(255,255,255,0.05)',
          borderRadius: 6,
          overflow: 'hidden',
          display: 'flex',
        }}>
          <div style={{
            width: `${pct}%`,
            height: '100%',
            background: domColor,
            borderRadius: 6,
          }} />
        </div>
        <div style={{
          fontSize: isCompact ? 12 : 15,
          color: '#8a8478',
          marginTop: 6,
          fontStyle: 'italic' as const,
        }}>
          &ldquo;{archLabel}&rdquo;
        </div>
      </div>

      {/* Current Dasha + Standout Yoga */}
      {(data.currentDasha || data.standoutYoga) && (
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 4,
          marginBottom: isCompact ? 16 : 32,
        }}>
          {data.currentDasha && (
            <div style={{ fontSize: isCompact ? 13 : 16, color: '#e6e2d8' }}>
              {data.currentDasha}
            </div>
          )}
          {data.standoutYoga && (
            <div style={{ fontSize: isCompact ? 13 : 16, color: '#d4a853' }}>
              {data.standoutYoga}
            </div>
          )}
        </div>
      )}

      {/* Watermark */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
        marginTop: 'auto',
        paddingTop: 16,
      }}>
        <div style={{ fontSize: isCompact ? 10 : 12, color: 'rgba(212, 168, 83, 0.5)' }}>
          dekhopanchang.com
        </div>
        {/* QR placeholder — a small styled box with initials */}
        <div style={{
          width: isCompact ? 36 : 48,
          height: isCompact ? 36 : 48,
          border: '1px solid rgba(212, 168, 83, 0.3)',
          borderRadius: 6,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: isCompact ? 8 : 10,
          color: 'rgba(212, 168, 83, 0.4)',
        }}>
          QR
        </div>
      </div>
    </div>
  );
}
