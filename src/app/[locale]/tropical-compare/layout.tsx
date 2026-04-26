import type { Metadata } from 'next';
import { getPageMetadata } from '@/lib/seo/metadata';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  return getPageMetadata('/tropical-compare', locale);
}

export default function TropicalCompareLayout({ children }: { children: React.ReactNode }) {
  return children;
}
