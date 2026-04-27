import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Family Command Center — Astro Status for Your Household | Dekho Panchang',
  description:
    'Track dasha periods, Sade Sati status, and transit alerts for your entire family. Find collective muhurta windows for family activities.',
  robots: { index: false }, // authenticated page — no indexing
};

export default function FamilyLayout({ children }: { children: React.ReactNode }) {
  return children;
}
