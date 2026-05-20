import { setRequestLocale } from 'next-intl/server';
import type { Metadata } from 'next';
import { getPageMetadata } from '@/lib/seo/metadata';
import { getMuhurtaType } from '@/lib/constants/muhurta-types';
import { findNextFutureDate, muhurtaTitle, muhurtaTitleHi, muhurtaDesc, fmtLong, fmtDay, fmtShortHi, fmtDayHi } from '@/lib/seo/ctr-config';

/**
 * Hindi muhurta description — matches "अन्नप्राशन मुहूर्त 2026" search pattern.
 * Example: "अगला अन्नप्राशन मुहूर्त: 21 सितम्बर 2026 (सोमवार, रोहिणी नक्षत्र)। 2026 की 5+ शुभ तिथियाँ। निःशुल्क, प्रतिदिन अपडेट।"
 */
function muhurtaDescHi(
  nameHi: string, year: number, nextDateStr: string | null,
  nakshatraHi: string | null, totalDates: number
): string {
  if (!nextDateStr) {
    return `${nameHi} ${year}: ${totalDates}+ शुभ तिथियाँ — नक्षत्र, तिथि व ग्रह विश्लेषण सहित। निःशुल्क, बिना पंजीकरण।`.slice(0, 155);
  }
  const short = fmtShortHi(nextDateStr);
  const day = fmtDayHi(nextDateStr);
  const nak = nakshatraHi ? `, ${nakshatraHi} नक्षत्र` : '';
  return `अगला ${nameHi}: ${short} ${year} (${day}${nak})। ${year} की ${totalDates}+ शुभ तिथियाँ। निःशुल्क, प्रतिदिन अपडेट।`.slice(0, 155);
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string; type: string }> }): Promise<Metadata> {
  const { locale, type } = await params;
  setRequestLocale(locale);

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
    const nakshatraLabelHi = nextEntry?.label?.hi?.match(/,\s*(.+?)(?:\s+नक्षत्र)?$/)?.[1] ?? null;

    // Locale-aware description — Hindi description matches Hindi search queries
    const description = locKey === 'hi'
      ? muhurtaDescHi(name, year, nextDateStr, nakshatraLabelHi, info.dates2026?.length ?? 0)
      : muhurtaDesc(nameEn, year, nextDateStr, nakshatraLabel, info.dates2026?.length ?? 0);

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
