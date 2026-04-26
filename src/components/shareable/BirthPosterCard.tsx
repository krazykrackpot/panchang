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

const ELEMENT_COLORS: Record<number, string> = {
  0: '#f59e0b', // fire  — amber
  1: '#10b981', // earth — emerald
  2: '#38bdf8', // air   — sky
  3: '#818cf8', // water — indigo
};

const ELEMENT_COLORS_DIM: Record<number, string> = {
  0: '#78500d', // fire dim
  1: '#065f46', // earth dim
  2: '#0c4a6e', // air dim
  3: '#3730a3', // water dim
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

/**
 * Generate 12 SVG pie-slice paths for the geometric mandala.
 * Each slice is a 30-degree wedge.
 */
function generateWedgePath(index: number, innerR: number, outerR: number, cx: number, cy: number): string {
  const startAngle = (index * 30 - 90) * (Math.PI / 180);
  const endAngle = ((index + 1) * 30 - 90) * (Math.PI / 180);

  const x1 = cx + outerR * Math.cos(startAngle);
  const y1 = cy + outerR * Math.sin(startAngle);
  const x2 = cx + outerR * Math.cos(endAngle);
  const y2 = cy + outerR * Math.sin(endAngle);
  const x3 = cx + innerR * Math.cos(endAngle);
  const y3 = cy + innerR * Math.sin(endAngle);
  const x4 = cx + innerR * Math.cos(startAngle);
  const y4 = cy + innerR * Math.sin(startAngle);

  return `M ${x1} ${y1} A ${outerR} ${outerR} 0 0 1 ${x2} ${y2} L ${x3} ${y3} A ${innerR} ${innerR} 0 0 0 ${x4} ${y4} Z`;
}

interface BirthPosterCardProps {
  data: BirthPosterData;
  format: 'story' | 'square' | 'og';
  locale: string;
}

export default function BirthPosterCard({ data, format, locale }: BirthPosterCardProps) {
  const dims = FORMAT_DIMS[format] || FORMAT_DIMS.story;
  const isCompact = format === 'og' || format === 'square';
  const isOg = format === 'og';

  // Scale factor relative to story format
  const scale = dims.w / 1080;
  const mandalaSize = isOg ? 180 : isCompact ? 260 : 340;
  const cx = mandalaSize / 2;
  const cy = mandalaSize / 2;
  const outerR = mandalaSize / 2 - 4;
  const innerR = outerR * 0.45;

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
        {/* Left: mandala */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginRight: 40, flexShrink: 0 }}>
          <svg width={mandalaSize} height={mandalaSize} viewBox={`0 0 ${mandalaSize} ${mandalaSize}`}>
            {data.houseLordElements.map((elIdx, i) => {
              const bright = data.occupiedHouses[i];
              const color = bright ? ELEMENT_COLORS[elIdx] : ELEMENT_COLORS_DIM[elIdx];
              return (
                <path
                  key={i}
                  d={generateWedgePath(i, innerR, outerR, cx, cy)}
                  fill={color}
                  opacity={bright ? 0.9 : 0.4}
                  stroke="#0a0e27"
                  strokeWidth={1.5}
                />
              );
            })}
            <circle cx={cx} cy={cy} r={4} fill="#d4a853" />
          </svg>
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

      {/* Geometric Mandala */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: isCompact ? 20 : 40,
      }}>
        <svg width={mandalaSize} height={mandalaSize} viewBox={`0 0 ${mandalaSize} ${mandalaSize}`}>
          {/* Outer decorative ring */}
          <circle cx={cx} cy={cy} r={outerR + 2} fill="none" stroke="rgba(212, 168, 83, 0.15)" strokeWidth={1} />
          {/* 12 house wedges */}
          {data.houseLordElements.map((elIdx, i) => {
            const bright = data.occupiedHouses[i];
            const color = bright ? ELEMENT_COLORS[elIdx] : ELEMENT_COLORS_DIM[elIdx];
            return (
              <path
                key={i}
                d={generateWedgePath(i, innerR, outerR, cx, cy)}
                fill={color}
                opacity={bright ? 0.9 : 0.35}
                stroke="#0a0e27"
                strokeWidth={2}
              />
            );
          })}
          {/* Inner decorative ring */}
          <circle cx={cx} cy={cy} r={innerR - 2} fill="none" stroke="rgba(212, 168, 83, 0.12)" strokeWidth={1} />
          {/* Lagna dot at center */}
          <circle cx={cx} cy={cy} r={5} fill="#d4a853" />
          <circle cx={cx} cy={cy} r={2} fill="#f0d48a" />
        </svg>
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
