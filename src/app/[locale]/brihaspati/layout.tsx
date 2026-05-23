import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import { getPageMetadata } from '@/lib/seo/metadata';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  setRequestLocale(locale);
  return getPageMetadata('/brihaspati', locale);
}

export default function BrihaspatiLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
