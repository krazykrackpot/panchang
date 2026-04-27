import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Celestial Events | Dekho Panchang',
  description:
    'Upcoming celestial events — retrogrades, eclipses, and combustions with survival guides and personalized impact analysis.',
  openGraph: {
    title: 'Celestial Events | Dekho Panchang',
    description: 'Retrograde survival guides, eclipse alerts, and personalized planetary impact cards.',
  },
};

export default function EventsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
