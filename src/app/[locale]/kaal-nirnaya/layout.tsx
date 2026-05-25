import { setRequestLocale } from 'next-intl/server';
import type { Metadata } from 'next';
import { getPageMetadata } from '@/lib/seo/metadata';
import { ToolStructuredData } from '@/components/seo/ToolStructuredData';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  setRequestLocale(locale);
  return getPageMetadata('/kaal-nirnaya', locale);
}

export default async function Layout({ children, params }: { children: React.ReactNode; params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return (
    <>
      <ToolStructuredData
        name="Kaal Nirnaya"
        description="Right time for every action — Hora, Choghadiya, Rahu Kaal, and muhurta windows in one view."
        path="/kaal-nirnaya"
        locale={locale}
      />
      {children}
    </>
  );
}
