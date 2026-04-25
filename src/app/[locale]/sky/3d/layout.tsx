import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '3D Celestial Sphere — Live Sky',
  description: 'Interactive 3D visualization of the celestial sphere with real-time sidereal planet positions.',
  robots: { index: true, follow: true },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
