import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'My Vedic Profile — Dekho Panchang',
  description: 'Your Vedic birth profile — Rashi, Nakshatra, Tithi, Dasha, Sade Sati status, and birth chart. All computed from your birth details.',
  robots: { index: false }, // Private page, no indexing
};

export default function ProfileLayout({ children }: { children: React.ReactNode }) {
  return children;
}
