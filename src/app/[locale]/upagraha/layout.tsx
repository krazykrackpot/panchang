import { setRequestLocale } from 'next-intl/server';
import type { Metadata } from 'next';
import { getPageMetadata } from '@/lib/seo/metadata';
import { ToolStructuredData } from '@/components/seo/ToolStructuredData';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  setRequestLocale(locale);
  return getPageMetadata('/upagraha', locale);
}

export default async function Layout({ children, params }: { children: React.ReactNode; params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return (
    <>
      <ToolStructuredData
        name="Upagraha Calculator"
        description="Shadow-planet sphutas — Mandi, Gulika, Dhuma, Vyatipata and the rest of the 11 upagrahas."
        path="/upagraha"
        locale={locale}
      />
      {children}
    </>
  );
}
