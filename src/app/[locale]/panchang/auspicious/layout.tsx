import type { Metadata } from 'next';
import { getPageMetadata } from '@/lib/seo/metadata';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  // Fallback to /panchang metadata until /panchang/auspicious is added to PAGE_META
  return getPageMetadata('/panchang/auspicious', locale);
}

export default async function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
