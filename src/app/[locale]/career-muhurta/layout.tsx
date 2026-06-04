import { setRequestLocale } from 'next-intl/server';
import type { Metadata } from 'next';
import { getPageMetadata } from '@/lib/seo/metadata';
import { ToolStructuredData } from '@/components/seo/ToolStructuredData';

// Generic /career-muhurta FAQ JSON-LD used to live here. That cascaded
// onto every /career-muhurta/[activity] sub-page (which already emits
// its own per-activity FAQ from [activity]/layout.tsx), causing
// "Duplicate field FAQPage" Rich Results errors on production. Same
// bug class as the calendar/layout.tsx fix in PR #409. FAQ now emitted
// from /career-muhurta/page.tsx only.
export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  setRequestLocale(locale);
  return getPageMetadata('/career-muhurta', locale);
}

export default async function Layout({ children, params }: { children: React.ReactNode; params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  return (
    <>
      <ToolStructuredData
        name="Career Muhurta"
        description="Auspicious time finder for career decisions — job interviews, contract signings, salary negotiations, business launches, resignations, promotions."
        path="/career-muhurta"
        locale={locale}
      />
      {children}
    </>
  );
}
