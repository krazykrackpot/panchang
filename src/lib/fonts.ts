import { Cormorant_Garamond, Inter, Noto_Sans_Devanagari, Noto_Sans_Tamil, Noto_Sans_Telugu, Noto_Sans_Bengali, Noto_Sans_Kannada } from 'next/font/google';

export const inter = Inter({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  display: 'swap',
  variable: '--font-inter',
});

export const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  style: ['normal', 'italic'],
  display: 'swap',
  variable: '--font-cormorant',
});

export const notoDevanagari = Noto_Sans_Devanagari({
  subsets: ['devanagari'],
  weight: ['300', '400', '500', '600', '700'],
  display: 'swap',
  variable: '--font-devanagari',
});

export const notoTamil = Noto_Sans_Tamil({
  subsets: ['tamil'],
  weight: ['300', '400', '500', '600', '700'],
  display: 'swap',
  variable: '--font-tamil',
});

export const notoTelugu = Noto_Sans_Telugu({
  subsets: ['telugu'],
  weight: ['300', '400', '500', '600', '700'],
  display: 'swap',
  variable: '--font-telugu',
});

export const notoBengali = Noto_Sans_Bengali({
  subsets: ['bengali'],
  weight: ['300', '400', '500', '600', '700'],
  display: 'swap',
  variable: '--font-bengali',
});

export const notoKannada = Noto_Sans_Kannada({
  subsets: ['kannada'],
  weight: ['300', '400', '500', '600', '700'],
  display: 'swap',
  variable: '--font-kannada',
});
