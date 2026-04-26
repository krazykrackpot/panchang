/**
 * Shareable Card Infrastructure — shared types and utilities.
 *
 * All shareable cards (birth-poster, daily-vibe, yoga-badge) share these
 * dimensions, colors, and helper functions.
 */

import QRCode from 'qrcode';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type CardFormat = 'story' | 'square' | 'og';

export type CardType = 'birth-poster' | 'daily-vibe' | 'yoga-badge';

export interface CardDimensions {
  width: number;
  height: number;
}

export interface ElementDistribution {
  fire: number;
  earth: number;
  air: number;
  water: number;
  dominant: 'fire' | 'earth' | 'air' | 'water' | 'balanced';
  archetype: { en: string; hi: string };
}

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

export const CARD_DIMENSIONS: Record<CardFormat, CardDimensions> = {
  story: { width: 1080, height: 1920 },
  square: { width: 1080, height: 1080 },
  og: { width: 1200, height: 630 },
} as const;

export const CARD_COLORS = {
  navy: '#0a0e27',
  gold: '#d4a853',
  goldLight: '#f0d48a',
  goldDark: '#8a6d2b',
  text: '#e6e2d8',
} as const;

export const WATERMARK_URL = 'dekhopanchang.com';

// Sign → element mapping (1-based rashi IDs)
const SIGN_ELEMENT: Record<number, 'fire' | 'earth' | 'air' | 'water'> = {
  1: 'fire',    // Aries
  2: 'earth',   // Taurus
  3: 'air',     // Gemini
  4: 'water',   // Cancer
  5: 'fire',    // Leo
  6: 'earth',   // Virgo
  7: 'air',     // Libra
  8: 'water',   // Scorpio
  9: 'fire',    // Sagittarius
  10: 'earth',  // Capricorn
  11: 'air',    // Aquarius
  12: 'water',  // Pisces
};

const ARCHETYPE_LABELS: Record<string, { en: string; hi: string }> = {
  fire: { en: 'The Catalyst', hi: 'अग्नि प्रेरक' },
  earth: { en: 'The Builder', hi: 'भूमि निर्माता' },
  air: { en: 'The Connector', hi: 'वायु संयोजक' },
  water: { en: 'The Intuitive', hi: 'जल अन्तर्ज्ञानी' },
  balanced: { en: 'The Balanced', hi: 'संतुलित' },
};

// ---------------------------------------------------------------------------
// Element Distribution
// ---------------------------------------------------------------------------

/**
 * Count planets by the element of the sign they occupy.
 * Accepts an array of planet objects with a `sign` field (1-based rashi ID).
 * Only the 7 visible planets (Sun=0 through Saturn=6) are counted per spec.
 */
export function computeElementDistribution(
  planets: Array<{ id: number; sign: number }>
): ElementDistribution {
  const counts = { fire: 0, earth: 0, air: 0, water: 0 };

  for (const planet of planets) {
    // Only count Sun(0) through Saturn(6)
    if (planet.id < 0 || planet.id > 6) continue;
    const element = SIGN_ELEMENT[planet.sign];
    if (element) {
      counts[element]++;
    }
  }

  // Find dominant element
  const entries = Object.entries(counts) as Array<['fire' | 'earth' | 'air' | 'water', number]>;
  entries.sort((a, b) => b[1] - a[1]);

  const dominant: ElementDistribution['dominant'] =
    entries[0][1] > entries[1][1] ? entries[0][0] : 'balanced';

  return {
    ...counts,
    dominant,
    archetype: ARCHETYPE_LABELS[dominant],
  };
}

// ---------------------------------------------------------------------------
// QR Code Generation
// ---------------------------------------------------------------------------

/**
 * Generate a QR code as a base64 PNG data URL.
 * Uses gold color on transparent background to match card aesthetic.
 *
 * NOTE: `qrcode` package generates PNGs server-side via node-canvas or
 * data URLs in browser. In Satori/OG context, use the returned data URL
 * directly in an <img> src.
 */
export async function generateQRDataUrl(url: string): Promise<string> {
  const dataUrl = await QRCode.toDataURL(url, {
    width: 96,
    margin: 0,
    color: {
      dark: CARD_COLORS.gold,
      light: '#00000000', // transparent background
    },
    errorCorrectionLevel: 'M',
  });
  return dataUrl;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Validate and normalize a CardFormat from a query param string. */
export function parseCardFormat(format: string | null | undefined): CardFormat {
  if (format === 'story' || format === 'square' || format === 'og') {
    return format;
  }
  return 'og'; // default to OG dimensions for link previews
}

/** Validate a CardType from a route param. */
export function isValidCardType(type: string): type is CardType {
  return type === 'birth-poster' || type === 'daily-vibe' || type === 'yoga-badge';
}
