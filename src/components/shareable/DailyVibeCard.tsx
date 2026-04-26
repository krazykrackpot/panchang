'use client';

/**
 * DailyVibeCard — the "Daily Energy Weather" shareable card.
 *
 * Renders using Satori-compatible layout (flexbox only, no CSS grid).
 * Dark navy background with gold accents matching the app's design system.
 *
 * Formats: 'story' (1080x1920), 'square' (1080x1080), 'og' (1200x630)
 */

import type { DailyVibeData } from '@/lib/shareable/daily-vibe';
import { CARD_COLORS, CARD_DIMENSIONS, WATERMARK_URL, type CardFormat } from '@/lib/shareable/card-base';

interface DailyVibeCardProps {
  data: DailyVibeData;
  format: CardFormat;
  locale: string;
}

export default function DailyVibeCard({ data, format, locale }: DailyVibeCardProps) {
  const dims = CARD_DIMENSIONS[format];
  const isStory = format === 'story';
  const isOg = format === 'og';

  // Scale factor for rendering at a reasonable size in the browser preview
  // Card is rendered at a scaled-down size; the actual export will be full-res
  const scale = isOg ? 0.5 : isStory ? 0.35 : 0.45;

  const vibeTitle = locale === 'hi' ? data.vibeTitle.hi : data.vibeTitle.en;

  // Energy bar color
  const barColor =
    data.energyScore >= 70
      ? '#22c55e' // green
      : data.energyScore >= 40
        ? '#f59e0b' // amber
        : '#ef4444'; // red

  const barWidth = `${data.energyScore}%`;

  return (
    <div
      style={{
        width: dims.width * scale,
        height: dims.height * scale,
        background: `radial-gradient(ellipse at 30% 20%, #1a1048 0%, ${CARD_COLORS.navy} 70%)`,
        borderRadius: 24 * scale,
        border: `${Math.max(1, 1.5 * scale)}px solid ${CARD_COLORS.goldDark}33`,
        padding: isOg ? 32 * scale : 48 * scale,
        display: 'flex',
        flexDirection: isOg ? 'row' : 'column',
        alignItems: isOg ? 'center' : 'stretch',
        justifyContent: isOg ? 'space-between' : 'center',
        gap: isOg ? 24 * scale : 0,
        overflow: 'hidden',
        position: 'relative',
        fontFamily: 'system-ui, -apple-system, sans-serif',
        color: CARD_COLORS.text,
      }}
    >
      {/* OG format: left column */}
      {isOg ? (
        <>
          <div style={{ display: 'flex', flexDirection: 'column', flex: 1, gap: 12 * scale }}>
            <div
              style={{
                fontSize: 14 * scale,
                letterSpacing: '0.2em',
                textTransform: 'uppercase' as const,
                color: CARD_COLORS.gold,
                fontWeight: 700,
              }}
            >
              Today&apos;s Energy Weather
            </div>
            <div style={{ fontSize: 12 * scale, color: CARD_COLORS.goldDark }}>{data.date}</div>
            <div
              style={{
                fontSize: 32 * scale,
                fontWeight: 800,
                color: CARD_COLORS.goldLight,
                lineHeight: 1.2,
              }}
            >
              &ldquo;{vibeTitle}&rdquo;
            </div>
            <div style={{ fontSize: 11 * scale, color: '#8a8478' }}>{data.keyTransit}</div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 * scale, minWidth: 160 * scale }}>
            <EnergyBar score={data.energyScore} barColor={barColor} barWidth={barWidth} scale={scale} />
            <div style={{ fontSize: 9 * scale, color: '#8a8478', textAlign: 'right' as const }}>
              {WATERMARK_URL}
            </div>
          </div>
        </>
      ) : (
        /* Story / Square layout */
        <>
          {/* Header label */}
          <div
            style={{
              textAlign: 'center' as const,
              marginBottom: isStory ? 48 * scale : 20 * scale,
            }}
          >
            <div
              style={{
                fontSize: (isStory ? 28 : 22) * scale,
                letterSpacing: '0.2em',
                textTransform: 'uppercase' as const,
                color: CARD_COLORS.gold,
                fontWeight: 700,
                marginBottom: 8 * scale,
              }}
            >
              Today&apos;s Energy Weather
            </div>
            <div
              style={{
                fontSize: (isStory ? 24 : 18) * scale,
                color: CARD_COLORS.goldDark,
              }}
            >
              {data.date}
            </div>
          </div>

          {/* Vibe title — the hero */}
          <div
            style={{
              textAlign: 'center' as const,
              padding: `${(isStory ? 40 : 24) * scale}px ${24 * scale}px`,
              marginBottom: (isStory ? 40 : 20) * scale,
              borderTop: `1px solid ${CARD_COLORS.goldDark}44`,
              borderBottom: `1px solid ${CARD_COLORS.goldDark}44`,
            }}
          >
            <div
              style={{
                fontSize: (isStory ? 64 : 48) * scale,
                fontWeight: 800,
                color: CARD_COLORS.goldLight,
                lineHeight: 1.2,
              }}
            >
              &ldquo;{vibeTitle}&rdquo;
            </div>
          </div>

          {/* Key transit + secondary */}
          <div
            style={{
              textAlign: 'center' as const,
              marginBottom: (isStory ? 40 : 20) * scale,
            }}
          >
            <div
              style={{
                fontSize: (isStory ? 24 : 18) * scale,
                color: CARD_COLORS.text,
                marginBottom: 6 * scale,
              }}
            >
              {data.keyTransit}
            </div>
            <div
              style={{
                fontSize: (isStory ? 20 : 15) * scale,
                color: '#8a8478',
              }}
            >
              {data.secondaryInfluence}
            </div>
          </div>

          {/* Best For */}
          <div style={{ marginBottom: (isStory ? 28 : 16) * scale }}>
            <div
              style={{
                fontSize: (isStory ? 20 : 16) * scale,
                fontWeight: 700,
                letterSpacing: '0.15em',
                textTransform: 'uppercase' as const,
                color: '#22c55e',
                marginBottom: 8 * scale,
              }}
            >
              Best For
            </div>
            <div
              style={{
                fontSize: (isStory ? 22 : 16) * scale,
                color: '#86efac',
                lineHeight: 1.6,
              }}
            >
              {data.bestFor.slice(0, 4).join('  ·  ')}
            </div>
          </div>

          {/* Avoid */}
          <div style={{ marginBottom: (isStory ? 40 : 24) * scale }}>
            <div
              style={{
                fontSize: (isStory ? 20 : 16) * scale,
                fontWeight: 700,
                letterSpacing: '0.15em',
                textTransform: 'uppercase' as const,
                color: '#ef4444',
                marginBottom: 8 * scale,
              }}
            >
              Avoid
            </div>
            <div
              style={{
                fontSize: (isStory ? 22 : 16) * scale,
                color: '#fca5a5',
                lineHeight: 1.6,
              }}
            >
              {data.avoid.slice(0, 3).join('  ·  ')}
            </div>
          </div>

          {/* Energy bar */}
          <EnergyBar
            score={data.energyScore}
            barColor={barColor}
            barWidth={barWidth}
            scale={scale}
            large={isStory}
          />

          {/* Watermark */}
          <div
            style={{
              marginTop: isStory ? 48 * scale : 24 * scale,
              textAlign: 'center' as const,
              fontSize: (isStory ? 18 : 14) * scale,
              color: `${CARD_COLORS.gold}99`,
            }}
          >
            {WATERMARK_URL}
          </div>
        </>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Energy bar sub-component
// ---------------------------------------------------------------------------

function EnergyBar({
  score,
  barColor,
  barWidth,
  scale,
  large = false,
}: {
  score: number;
  barColor: string;
  barWidth: string;
  scale: number;
  large?: boolean;
}) {
  const labelSize = (large ? 20 : 14) * scale;
  const barHeight = (large ? 16 : 10) * scale;

  return (
    <div>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: 6 * scale,
        }}
      >
        <span
          style={{
            fontSize: labelSize,
            fontWeight: 700,
            letterSpacing: '0.1em',
            textTransform: 'uppercase' as const,
            color: '#8a8478',
          }}
        >
          Energy
        </span>
        <span
          style={{
            fontSize: labelSize,
            fontWeight: 800,
            color: barColor,
          }}
        >
          {score}%
        </span>
      </div>
      <div
        style={{
          width: '100%',
          height: barHeight,
          borderRadius: barHeight / 2,
          backgroundColor: '#1e2340',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            width: barWidth,
            height: '100%',
            borderRadius: barHeight / 2,
            backgroundColor: barColor,
            transition: 'width 0.5s ease-out',
          }}
        />
      </div>
    </div>
  );
}
