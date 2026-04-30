import { Cinzel, Cormorant_Garamond, Inter, Noto_Sans_Devanagari, Noto_Sans_Tamil, Noto_Sans_Telugu, Noto_Sans_Bengali, Noto_Sans_Kannada, Noto_Sans_Gujarati } from 'next/font/google';

export const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],  // dropped 300 — unused
  display: 'swap',
  variable: '--font-inter',
  preload: true,
});

export const cinzel = Cinzel({
  subsets: ['latin'],
  weight: ['400', '700'],  // dropped 500, 600 — only need regular + bold for headings
  display: 'swap',
  variable: '--font-cinzel',
  preload: true,
});

export const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['400', '600'],  // dropped 300, 500, 700 — only need regular + semibold
  style: ['normal', 'italic'],
  display: 'swap',
  variable: '--font-cormorant',
});

// Indic fonts: 3 weights only (400=body, 600=semibold, 700=headings).
// Dropped 300 and 500 — saves ~12 WOFF2 files across 6 scripts.
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
