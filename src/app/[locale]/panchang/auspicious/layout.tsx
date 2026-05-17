import type { Metadata } from 'next';
import { getPageMetadata } from '@/lib/seo/metadata';
import { todayPanchangForSEO } from '@/lib/seo/ctr-config';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const base = getPageMetadata('/panchang/auspicious', locale);
  const seo = todayPanchangForSEO(locale);
  if (!seo) return base;

  const { p, dateStr, isHi } = seo;
  const abhijit = (p as { abhijitMuhurta?: { start: string; end: string } }).abhijitMuhurta;

  const title = isHi
    ? `आज के शुभ मुहूर्त ${dateStr}${abhijit ? ` – अभिजित ${abhijit.start}–${abhijit.end}` : ''}`
    : `Auspicious Timings Today ${dateStr}${abhijit ? ` – Abhijit ${abhijit.start}–${abhijit.end}` : ''}`;

  const desc = isHi
    ? `${dateStr} शुभ मुहूर्त: ब्रह्म मुहूर्त, अभिजित${abhijit ? ` ${abhijit.start}–${abhijit.end}` : ''}, अमृत काल, गोधूलि। अपने शहर के लिए सटीक समय।`
    : `${dateStr} auspicious times: Brahma Muhurta, Abhijit${abhijit ? ` ${abhijit.start}–${abhijit.end}` : ''}, Amrit Kalam, Godhuli. Exact times for your city.`;

  return { ...base, title, description: desc };
}

export default async function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
