import { Cinzel, Cormorant_Garamond, Inter, Noto_Sans_Devanagari, Noto_Sans_Tamil, Noto_Sans_Telugu, Noto_Sans_Bengali, Noto_Sans_Kannada, Noto_Sans_Gujarati } from 'next/font/google';

export const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],  // dropped 300  –  unused
  display: 'swap',
  variable: '--font-inter',
  preload: true,
});

export const cinzel = Cinzel({
  subsets: ['latin'],
  weight: ['400', '700'],  // dropped 500, 600  –  only need regular + bold for headings
  display: 'swap',
  variable: '--font-cinzel',
  preload: true,
});

export const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['400', '600'],  // dropped 300, 500, 700  –  only need regular + semibold
  style: ['normal', 'italic'],
  display: 'swap',
  variable: '--font-cormorant',
});

// Indic fonts: 3 weights only (400=body, 600=semibold, 700=headings).
// Dropped 300 and 500  –  saves ~12 WOFF2 files across 6 scripts.
export const notoDevanagari = Noto_Sans_Devanagari({
  subsets: ['devanagari'],
  weight: ['400', '600', '700'],
  display: 'swap',
  variable: '--font-devanagari',
});

export const notoTamil = Noto_Sans_Tamil({
  subsets: ['tamil'],
  weight: ['400', '600', '700'],
  display: 'swap',
  variable: '--font-tamil',
});

export const notoTelugu = Noto_Sans_Telugu({
  subsets: ['telugu'],
  weight: ['400', '600', '700'],
  display: 'swap',
  variable: '--font-telugu',
});

export const notoBengali = Noto_Sans_Bengali({
  subsets: ['bengali'],
  weight: ['400', '600', '700'],
  display: 'swap',
  variable: '--font-bengali',
});

export const notoKannada = Noto_Sans_Kannada({
  subsets: ['kannada'],
  weight: ['400', '600', '700'],
  display: 'swap',
  variable: '--font-kannada',
});

export const notoGujarati = Noto_Sans_Gujarati({
  subsets: ['gujarati'],
  weight: ['400', '600', '700'],
  display: 'swap',
  variable: '--font-gujarati',
});

/**
 * Build the body className font-variable list for a given locale. Only
 * includes the Indic font(s) actually needed for that locale's script.
 *
 * Latin fonts (Inter, Cinzel, Cormorant) are always included because the
 * navbar / footer / CTAs / English co-titles render Latin on every locale.
 *
 * Devanagari is included on hi/mai/mr AND on en/ta/te/bn/gu/kn — many
 * Trilingual rendering paths embed Devanagari names inline (rashi badges,
 * JyotishTerm popovers, panchang field labels). Without it, the system
 * fallback font handles Devanagari with poor metrics → visible swap on hi
 * tokens that appear on non-Hindi pages.
 *
 * Audit 2026-05-25 §C (perf-cwv-remediation): saves 90-180 KB on Latin
 * locales by dropping Tamil/Telugu/Bengali/Kannada/Gujarati when the
 * active locale isn't one of them.
 */
export function fontClassesForLocale(locale: string): string {
  const base = `${inter.variable} ${cinzel.variable} ${cormorant.variable} ${notoDevanagari.variable}`;
  switch (locale) {
    case 'ta':
      return `${base} ${notoTamil.variable}`;
    case 'te':
      return `${base} ${notoTelugu.variable}`;
    case 'bn':
      return `${base} ${notoBengali.variable}`;
    case 'kn':
      return `${base} ${notoKannada.variable}`;
    case 'gu':
      return `${base} ${notoGujarati.variable}`;
    case 'en':
    case 'hi':
    case 'mai':
    case 'mr':
    default:
      return base;
  }
}
