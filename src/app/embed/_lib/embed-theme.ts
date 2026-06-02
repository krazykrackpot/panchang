/**
 * Shared theme tokens + size configuration for the /embed/* widgets.
 *
 * Light is the safe default for embedded contexts (most temple / community
 * sites are on light backgrounds). Dark matches dekhopanchang.com's main
 * brand. `auto` honours the parent's prefers-color-scheme.
 *
 * Per-theme tokens are intentionally minimal — embed widgets are tiny
 * surfaces (240-480px wide) so they only need surface / text / accent
 * colours plus a divider. No design system pretensions.
 */

export type EmbedTheme = 'light' | 'dark' | 'auto';

export interface ThemeTokens {
  background: string;
  surface: string;
  surfaceMuted: string;
  text: string;
  textMuted: string;
  border: string;
  accent: string;
  accentSoft: string;
  badge: string;
  badgeText: string;
}

export const LIGHT: ThemeTokens = {
  background: '#ffffff',
  surface: '#faf8f2',
  surfaceMuted: '#fef9ee',
  text: '#222222',
  textMuted: '#888888',
  border: '#eeeeee',
  accent: '#8a6d2b',
  accentSoft: '#d4a853',
  badge: '#d4a853',
  badgeText: '#ffffff',
};

export const DARK: ThemeTokens = {
  background: '#0a0e27',
  surface: '#111633',
  surfaceMuted: '#1a1040',
  text: '#e6e2d8',
  textMuted: '#8a8478',
  border: 'rgba(212,168,83,0.18)',
  accent: '#d4a853',
  accentSoft: '#f0d48a',
  badge: '#d4a853',
  badgeText: '#0a0e27',
};

export function resolveTokens(theme: 'light' | 'dark'): ThemeTokens {
  return theme === 'dark' ? DARK : LIGHT;
}

export type EmbedSize = 'narrow' | 'default' | 'wide';

export interface SizeTokens {
  maxWidth: number;
  minWidth: number;
  fontBase: number;
  padding: number;
}

const SIZE_MAP: Record<EmbedSize, SizeTokens> = {
  narrow: { maxWidth: 280, minWidth: 220, fontBase: 12, padding: 12 },
  default: { maxWidth: 500, minWidth: 250, fontBase: 14, padding: 16 },
  wide: { maxWidth: 640, minWidth: 320, fontBase: 16, padding: 18 },
};

export function resolveSize(size: EmbedSize): SizeTokens {
  return SIZE_MAP[size];
}
