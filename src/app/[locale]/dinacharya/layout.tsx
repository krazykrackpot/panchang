import type { Metadata } from 'next';

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Dinacharya — Vedic Daily Protocol | Dekho Panchang',
    description:
      'Personalized daily routine based on Vedic astrology. Hora-based activity scheduling, tithi-aligned nutrition, and dosha-aware wellness recommendations.',
  };
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
