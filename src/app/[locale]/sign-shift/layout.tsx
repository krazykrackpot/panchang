import { setRequestLocale } from 'next-intl/server';
import type { Metadata } from 'next';
import { getPageMetadata } from '@/lib/seo/metadata';
import { ToolStructuredData } from '@/components/seo/ToolStructuredData';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  setRequestLocale(locale);
  return getPageMetadata('/sign-shift', locale);
}

export default async function SignShiftLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  return (
    <>
      <ToolStructuredData
        name="Sign Shift Visualiser"
        description="Watch your Sun, Moon, and rising signs shift between tropical and sidereal zodiacs."
        path="/sign-shift"
        locale={locale}
      />
      {children}
    </>
  );
}
