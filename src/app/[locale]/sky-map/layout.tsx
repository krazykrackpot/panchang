import type { Metadata } from 'next';

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Interactive Sky Map — Real-Time Vedic Star Chart | Dekho Panchang',
    description:
      'See planets and stars in real-time from your location with stereographic projection. Connects astronomical positions to Vedic astrology concepts like rashis and nakshatras.',
    openGraph: {
      title: 'Interactive Sky Map — Real-Time Vedic Star Chart',
      description:
        'See planets and stars in real-time from your location. Stereographic planisphere with constellation lines and Vedic zodiac overlay.',
    },
  };
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
