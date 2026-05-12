import type { Metadata } from 'next';
import { getPageMetadata } from '@/lib/seo/metadata';
import { getMuhurtaType } from '@/lib/constants/muhurta-types';
import { findNextFutureDate, muhurtaTitle, muhurtaTitleHi, muhurtaDesc } from '@/lib/seo/ctr-config';

export async function generateMetadata({ params }: { params: Promise<{ locale: string; type: string }> }): Promise<Metadata> {
  const { locale, type } = await params;

  const info = getMuhurtaType(type);
  if (info) {
    const locKey = locale as 'en' | 'hi' | 'sa';
    const name = info.name[locKey] || info.name.en;
    const nameEn = info.name.en;
    const year = new Date().getFullYear();

    // Find the next FUTURE date, not just the first in the list
    const nextEntry = findNextFutureDate(info.dates2026 ?? []);
    const nextDateStr = nextEntry?.date ?? null;

    // Title uses ctr-config formulas — no explicit brand suffix (root layout template handles it)
    const title = locKey === 'hi'
      ? muhurtaTitleHi(name, year, nextDateStr)
      : muhurtaTitle(name, year, nextDateStr);

    // Extract nakshatra from the label if available (e.g., "May 18 (Mon) – Jyeshtha Shukla Panchami, Uttara Phalguni")
    const nakshatraLabel = nextEntry?.label?.en?.match(/,\s*(.+?)(?:\s+Nakshatra)?$/)?.[1] ?? null;
    const description = muhurtaDesc(nameEn, year, nextDateStr, nakshatraLabel, info.dates2026?.length ?? 0);

    return {
      title,
      description,
      keywords: info.keywords,
      openGraph: { title, description },
      twitter: { card: 'summary_large_image', title, description },
    };
  }

  // Fallback to centralized metadata
  return getPageMetadata(`/muhurta/${type}`, locale);
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
