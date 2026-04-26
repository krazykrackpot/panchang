import { getPageMetadata } from '@/lib/seo/metadata';
import type { Metadata } from 'next';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  return getPageMetadata('/glossary', locale);
}

export default function GlossaryLayout({ children }: { children: React.ReactNode }) {
  return children;
}
