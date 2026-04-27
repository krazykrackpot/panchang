'use client';

/**
 * SignShiftCard — Shareable visual card showing Western vs Vedic sign comparison.
 *
 * Satori-compatible (flexbox only, no grid/CSS features). Designed for
 * og/story/square formats. Dark luxe navy + gold aesthetic.
 */

import { tl } from '@/lib/utils/trilingual';
import type { SignShiftData } from '@/lib/shareable/sign-shift';
import type { CardFormat } from '@/lib/shareable/card-base';
import { CARD_DIMENSIONS, CARD_COLORS } from '@/lib/shareable/card-base';

// ── Planet symbols (Unicode) ──────────────────────────────────────────────────
const PLANET_SYMBOLS: Record<number, string> = {
  0: '\u2609', // Sun
  1: '\u263D', // Moon
  2: '\u2642', // Mars
  3: '\u263F', // Mercury
  4: '\u2643', // Jupiter
  5: '\u2640', // Venus
  6: '\u2644', // Saturn
  7: '\u260A', // Rahu
  8: '\u260B', // Ketu
};

interface SignShiftCardProps {
  data: SignShiftData;
  personName: string;
  format: CardFormat;
  locale: string;
}

/**
 * Render as a React component for on-page display.
 * Also usable with Satori for OG image generation.
 */
export function SignShiftCard({ data, personName, format, locale }: SignShiftCardProps) {
  const dims = CARD_DIMENSIONS[format];
  const isStory = format === 'story';
  const isSquare = format === 'square';

  const titleSize = isStory ? 42 : isSquare ? 36 : 28;
  const subtitleSize = isStory ? 24 : isSquare ? 20 : 16;
  const rowSize = isStory ? 22 : isSquare ? 18 : 14;
  const hookSize = isStory ? 28 : isSquare ? 24 : 18;

  return (
    <div
      style={{
        width: dims.width,
        height: dims.height,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: `linear-gradient(135deg, ${CARD_COLORS.navy} 0%, #111633 50%, #0d1129 100%)`,
        padding: isStory ? 60 : 40,
        fontFamily: 'sans-serif',
        color: CARD_COLORS.text,
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Background decoration */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: `radial-gradient(circle at 30% 20%, rgba(212, 168, 83, 0.06) 0%, transparent 50%), radial-gradient(circle at 70% 80%, rgba(212, 168, 83, 0.04) 0%, transparent 50%)`,
          display: 'flex',
        }}
      />

      {/* Title */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          marginBottom: isStory ? 40 : 24,
          position: 'relative',
        }}
      >
        <div
          style={{
            fontSize: titleSize,
            fontWeight: 700,
            color: CARD_COLORS.goldLight,
            textAlign: 'center',
            display: 'flex',
          }}
        >
          {locale === 'hi' ? 'पश्चिमी बनाम वैदिक राशि' : 'WESTERN vs VEDIC SIGNS'}
        </div>
        {personName && (
          <div
            style={{
              fontSize: subtitleSize,
              color: CARD_COLORS.gold,
              marginTop: 8,
              display: 'flex',
            }}
          >
            {personName}
          </div>
        )}
      </div>

      {/* Header row */}
      <div
        style={{
          display: 'flex',
          width: '100%',
          justifyContent: 'space-between',
          paddingBottom: 12,
          borderBottom: `1px solid ${CARD_COLORS.goldDark}`,
          marginBottom: 8,
        }}
      >
        <div style={{ flex: 1, fontSize: rowSize - 2, color: CARD_COLORS.goldDark, display: 'flex' }}>
          {locale === 'hi' ? 'ग्रह' : 'Planet'}
        </div>
        <div style={{ flex: 1, fontSize: rowSize - 2, color: CARD_COLORS.goldDark, textAlign: 'center', display: 'flex', justifyContent: 'center' }}>
          {locale === 'hi' ? 'पश्चिमी' : 'Western'}
        </div>
        <div style={{ flex: '0 0 30px', display: 'flex', justifyContent: 'center' }} />
        <div style={{ flex: 1, fontSize: rowSize - 2, color: CARD_COLORS.goldDark, textAlign: 'center', display: 'flex', justifyContent: 'center' }}>
          {locale === 'hi' ? 'वैदिक' : 'Vedic'}
        </div>
        <div style={{ flex: '0 0 30px', display: 'flex' }} />
      </div>

      {/* Planet rows */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          width: '100%',
          gap: isStory ? 14 : 8,
        }}
      >
        {data.planets.map((planet) => (
          <div
            key={planet.planetId}
            style={{
              display: 'flex',
              width: '100%',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: `${isStory ? 10 : 6}px 0`,
              borderBottom: '1px solid rgba(138, 109, 43, 0.15)',
            }}
          >
            {/* Planet name */}
            <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontSize: rowSize + 2, display: 'flex' }}>
                {PLANET_SYMBOLS[planet.planetId] || ''}
              </span>
              <span style={{ fontSize: rowSize, fontWeight: 600, display: 'flex', color: CARD_COLORS.text }}>
                {tl(planet.planetName, locale)}
              </span>
            </div>

            {/* Tropical sign */}
            <div style={{ flex: 1, textAlign: 'center', display: 'flex', justifyContent: 'center' }}>
              <span
                style={{
                  fontSize: rowSize,
                  color: planet.shifted ? '#f59e0b' : '#86efac',
                  display: 'flex',
                }}
              >
                {tl(planet.tropicalSign, locale)}
              </span>
            </div>

            {/* Arrow */}
            <div style={{ flex: '0 0 30px', display: 'flex', justifyContent: 'center' }}>
              <span style={{ fontSize: rowSize, color: planet.shifted ? '#f59e0b' : '#86efac', display: 'flex' }}>
                {planet.shifted ? '\u2192' : '='}
              </span>
            </div>

            {/* Sidereal sign */}
            <div style={{ flex: 1, textAlign: 'center', display: 'flex', justifyContent: 'center' }}>
              <span
                style={{
                  fontSize: rowSize,
                  color: planet.shifted ? '#f59e0b' : '#86efac',
                  fontWeight: planet.shifted ? 700 : 400,
                  display: 'flex',
                }}
              >
                {tl(planet.siderealSign, locale)}
              </span>
            </div>

            {/* Status icon */}
            <div style={{ flex: '0 0 30px', display: 'flex', justifyContent: 'center' }}>
              <span style={{ fontSize: rowSize + 2, display: 'flex' }}>
                {planet.shifted ? '\u26A1' : '\u2713'}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Hook line */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          marginTop: isStory ? 40 : 24,
          position: 'relative',
        }}
      >
        <div
          style={{
            fontSize: hookSize,
            fontWeight: 700,
            color: data.shiftCount > 0 ? '#f59e0b' : '#86efac',
            textAlign: 'center',
            display: 'flex',
          }}
        >
          {tl(data.hookLine, locale)}
        </div>
        <div
          style={{
            fontSize: rowSize,
            color: CARD_COLORS.goldDark,
            marginTop: 8,
            display: 'flex',
          }}
        >
          ({data.ayanamsha.toFixed(1)}{locale === 'hi' ? '\u00B0 अयनांश अन्तर' : '\u00B0 ayanamsha difference'})
        </div>
      </div>

      {/* Watermark */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          marginTop: isStory ? 40 : 20,
          position: 'relative',
        }}
      >
        <div
          style={{
            fontSize: rowSize - 2,
            color: CARD_COLORS.goldDark,
            letterSpacing: '0.1em',
            display: 'flex',
          }}
        >
          dekhopanchang.com
        </div>
      </div>
    </div>
  );
}
