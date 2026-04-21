import type { Metadata } from 'next';
import { getPageMetadata } from '@/lib/seo/metadata';

export async function generateMetadata({ params }: { params: Promise<{ locale: string; type: string }> }): Promise<Metadata> {
  const { locale, type } = await params;
  return getPageMetadata(`/muhurta/${type}`, locale);
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
