'use client';

/**
 * YogaBadgeCard — Renders a single yoga achievement badge as a shareable card.
 *
 * Uses Satori-compatible flexbox layout (no CSS grid).
 * Dark navy background with gold accents matching the card design system.
 */

import type { YogaBadge } from '@/lib/shareable/yoga-badges';
import { CARD_COLORS } from '@/lib/shareable/card-base';

interface YogaBadgeCardProps {
  badge: YogaBadge;
  personName: string;
  format: 'story' | 'square' | 'og';
  locale: string;
}

// Abstract geometric glyph SVGs by rarity tier
function RarityGlyph({ rarity }: { rarity: YogaBadge['rarity'] }) {
  const size = 96;
  const gradientId = `glyph-grad-${rarity}`;

  if (rarity === 'legendary') {
    // Hexagon
    const cx = size / 2;
    const cy = size / 2;
    const r = size / 2 - 4;
    const points = Array.from({ length: 6 }, (_, i) => {
      const angle = (Math.PI / 3) * i - Math.PI / 2;
      return `${cx + r * Math.cos(angle)},${cy + r * Math.sin(angle)}`;
    }).join(' ');

    return (
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#f0d48a" />
            <stop offset="50%" stopColor="#d4a853" />
            <stop offset="100%" stopColor="#8a6d2b" />
          </linearGradient>
        </defs>
        <polygon
          points={points}
          fill={`url(#${gradientId})`}
          stroke="#f0d48a"
          strokeWidth="2"
          opacity="0.9"
        />
      </svg>
    );
  }

  if (rarity === 'rare') {
    // Diamond (rotated square)
    const cx = size / 2;
    const cy = size / 2;
    const r = size / 2 - 6;
    const points = `${cx},${cy - r} ${cx + r},${cy} ${cx},${cy + r} ${cx - r},${cy}`;

    return (
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#f0d48a" />
            <stop offset="50%" stopColor="#d4a853" />
            <stop offset="100%" stopColor="#8a6d2b" />
          </linearGradient>
        </defs>
        <polygon
          points={points}
          fill={`url(#${gradientId})`}
          stroke="#f0d48a"
          strokeWidth="2"
          opacity="0.85"
        />
      </svg>
    );
  }

  // Uncommon — circle
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <defs>
        <linearGradient id={gradientId} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#f0d48a" />
          <stop offset="50%" stopColor="#d4a853" />
          <stop offset="100%" stopColor="#8a6d2b" />
        </linearGradient>
      </defs>
      <circle
        cx={size / 2}
        cy={size / 2}
        r={size / 2 - 6}
        fill={`url(#${gradientId})`}
        stroke="#f0d48a"
        strokeWidth="2"
        opacity="0.8"
      />
    </svg>
  );
}

const RARITY_LABEL: Record<YogaBadge['rarity'], { en: string; hi: string }> = {
  legendary: { en: 'LEGENDARY ACHIEVEMENT', hi: 'पौराणिक उपलब्धि' },
  rare: { en: 'RARE ACHIEVEMENT UNLOCKED', hi: 'दुर्लभ उपलब्धि' },
  uncommon: { en: 'ACHIEVEMENT UNLOCKED', hi: 'उपलब्धि अनलॉक' },
};

export default function YogaBadgeCard({ badge, personName, locale }: YogaBadgeCardProps) {
  const isHi = locale === 'hi';
  const label = isHi ? RARITY_LABEL[badge.rarity].hi : RARITY_LABEL[badge.rarity].en;
  const yogaName = isHi ? badge.yogaName.hi : badge.yogaName.en;
  const quality = isHi ? badge.quality.hi : badge.quality.en;
  const description = isHi ? badge.description.hi : badge.description.en;

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        padding: '48px 32px',
        background: `radial-gradient(ellipse at 50% 30%, #1a1545 0%, ${CARD_COLORS.navy} 70%)`,
        borderRadius: '24px',
        border: `1px solid ${CARD_COLORS.goldDark}20`,
        position: 'relative',
        overflow: 'hidden',
        gap: '24px',
      }}
    >
      {/* Animated gold label */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          padding: '8px 20px',
          borderRadius: '9999px',
          border: `1px solid ${CARD_COLORS.gold}40`,
          background: `linear-gradient(135deg, ${CARD_COLORS.goldDark}20, ${CARD_COLORS.gold}10)`,
        }}
      >
        <span style={{ color: CARD_COLORS.goldLight, fontSize: '14px', letterSpacing: '0.15em', fontWeight: 700 }}>
          &#9733; {label}
        </span>
      </div>

      {/* Geometric glyph */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <RarityGlyph rarity={badge.rarity} />
      </div>

      {/* Yoga name */}
      <div
        style={{
          color: CARD_COLORS.goldLight,
          fontSize: '28px',
          fontWeight: 700,
          textAlign: 'center',
          lineHeight: 1.3,
        }}
      >
        {yogaName}
      </div>

      {/* Quality subtitle */}
      <div
        style={{
          color: CARD_COLORS.gold,
          fontSize: '16px',
          fontWeight: 500,
          textAlign: 'center',
          letterSpacing: '0.05em',
        }}
      >
        {quality}
      </div>

      {/* Description */}
      <div
        style={{
          color: CARD_COLORS.text,
          fontSize: '14px',
          textAlign: 'center',
          maxWidth: '360px',
          lineHeight: 1.6,
          opacity: 0.9,
        }}
      >
        {description}
      </div>

      {/* Formation rule */}
      <div
        style={{
          color: '#8a8478',
          fontSize: '12px',
          textAlign: 'center',
          fontStyle: 'italic',
        }}
      >
        {badge.formationRule}
      </div>

      {/* Rarity stat */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          padding: '6px 16px',
          borderRadius: '9999px',
          background: badge.rarity === 'legendary'
            ? `${CARD_COLORS.gold}15`
            : badge.rarity === 'rare'
              ? `${CARD_COLORS.gold}10`
              : `${CARD_COLORS.gold}08`,
          border: `1px solid ${CARD_COLORS.goldDark}30`,
        }}
      >
        <span style={{ color: CARD_COLORS.gold, fontSize: '13px', fontWeight: 600 }}>
          {isHi ? 'पाया गया' : 'Found in'} {badge.percentage}
        </span>
      </div>

      {/* Person name */}
      <div
        style={{
          color: CARD_COLORS.text,
          fontSize: '15px',
          fontWeight: 600,
          marginTop: '8px',
        }}
      >
        {personName}
      </div>

      {/* Watermark */}
      <div
        style={{
          color: CARD_COLORS.gold,
          fontSize: '11px',
          opacity: 0.5,
          marginTop: '4px',
        }}
      >
        dekhopanchang.com
      </div>
    </div>
  );
}
