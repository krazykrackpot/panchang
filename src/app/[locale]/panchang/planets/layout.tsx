import { setRequestLocale } from 'next-intl/server';
import type { Metadata } from 'next';
import { getPageMetadata } from '@/lib/seo/metadata';
import { todayPanchangForSEO } from '@/lib/seo/ctr-config';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  setRequestLocale(locale);
  const base = getPageMetadata('/panchang/planets', locale);
  const seo = todayPanchangForSEO(locale);
  if (!seo) return base;

  const { p, dateStr, isHi } = seo;
  // Show Moon's current rashi as the hook — it changes every ~2.5 days
  const moonRashi = isHi ? p.nakshatra.name.hi : p.nakshatra.name.en;

  const title = isHi
    ? `आज की ग्रह स्थिति ${dateStr} – चन्द्र ${moonRashi} में`
    : `Planetary Positions Today ${dateStr} – Moon in ${moonRashi}`;

  const desc = isHi
    ? `${dateStr} नवग्रह स्थिति: सभी 9 ग्रहों की राशि व नक्षत्र। गोचर विश्लेषण, वक्री ग्रह, दृष्टि। निःशुल्क, प्रतिदिन अपडेट।`
    : `${dateStr} Navagraha positions: all 9 planets in signs & nakshatras. Transit analysis, retrograde status, aspects. Free, updated daily.`;

  return { ...base, title, description: desc };
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
