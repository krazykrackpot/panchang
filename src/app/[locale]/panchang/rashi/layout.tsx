import type { Metadata } from 'next';
import { getPageMetadata } from '@/lib/seo/metadata';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  return getPageMetadata('/panchang/rashi', locale);
}

// NOTE: FAQ LD intentionally NOT injected here. Each /panchang/rashi/[id]
// page injects its own rashi-specific FAQPage schema. Injecting a generic
// one here caused "Duplicate field 'FAQPage'" errors in GSC.
export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
