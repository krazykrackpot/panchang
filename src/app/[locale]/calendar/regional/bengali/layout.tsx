import type { Metadata } from 'next';
import { getPageMetadata } from '@/lib/seo/metadata';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  return getPageMetadata('/calendar/regional/bengali', locale);
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
