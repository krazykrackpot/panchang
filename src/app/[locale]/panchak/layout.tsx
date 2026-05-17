import { setRequestLocale } from 'next-intl/server';
import type { Metadata } from 'next';
import { getPageMetadata } from '@/lib/seo/metadata';
import { todayPanchangForSEO } from '@/lib/seo/ctr-config';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  setRequestLocale(locale);
  const base = getPageMetadata('/panchak', locale);
  const seo = todayPanchangForSEO(locale);
  if (!seo) return base;

  const { p, dateStr, isHi } = seo;
  // Panchak = Moon in nakshatras 23-27 (Dhanishtha through Revati)
  const nakNum = p.nakshatra.id || 0;
  const isPanchak = nakNum >= 23 && nakNum <= 27;

  const title = isHi
    ? `पंचक आज ${dateStr} – ${isPanchak ? 'पंचक चल रहा है' : 'पंचक नहीं'}`
    : `Panchak Today ${dateStr} – ${isPanchak ? 'Panchak Active' : 'No Panchak'}`;

  const desc = isHi
    ? `${dateStr} पंचक: ${isPanchak ? 'हाँ, पंचक चल रहा है — शुभ कार्य टालें।' : 'आज पंचक नहीं है।'} नक्षत्र: ${p.nakshatra.name.hi}। अगले पंचक की तिथि देखें।`
    : `${dateStr} Panchak: ${isPanchak ? 'Yes, Panchak is active — avoid auspicious activities.' : 'No Panchak today.'} Nakshatra: ${p.nakshatra.name.en}. Check next Panchak dates.`;

  return { ...base, title, description: desc };
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
