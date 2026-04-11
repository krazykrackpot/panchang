import { Cormorant_Garamond, Inter, Noto_Sans_Devanagari, Noto_Sans_Tamil } from 'next/font/google';

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
