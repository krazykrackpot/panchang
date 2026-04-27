import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Jyotish Tools — 20 Vedic Astrology Calculators | Dekho Panchang',
  description:
    'Free Vedic astrology tools: Rahu Kaal, Choghadiya, Hora, Sade Sati, Kaal Sarpa Dosha, Mangal Dosha, Prashna, Sarvatobhadra Chakra, and more.',
  alternates: {
    languages: {
      en: '/en/tools',
      hi: '/hi/tools',
      ta: '/ta/tools',
      bn: '/bn/tools',
    },
  },
};

export default function ToolsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
