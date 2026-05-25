import { setRequestLocale } from 'next-intl/server';
import type { Metadata } from 'next';
import { getPageMetadata } from '@/lib/seo/metadata';
import { ToolStructuredData } from '@/components/seo/ToolStructuredData';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  setRequestLocale(locale);
  return getPageMetadata('/vedic-time', locale);
}

export default async function Layout({ children, params }: { children: React.ReactNode; params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return (
    <>
      <ToolStructuredData
        name="Vedic Time Converter"
        description="Convert clock time to Ghati, Pala, Vipala, Muhurta and Prahara — Surya Siddhanta time units."
        path="/vedic-time"
        locale={locale}
      />
      {children}
    </>
  );
}
