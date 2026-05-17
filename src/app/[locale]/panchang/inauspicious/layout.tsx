import type { Metadata } from 'next';
import { getPageMetadata } from '@/lib/seo/metadata';
import { todayPanchangForSEO } from '@/lib/seo/ctr-config';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const base = getPageMetadata('/panchang/inauspicious', locale);
  const seo = todayPanchangForSEO(locale);
  if (!seo) return base;

  const { p, dateStr, isHi } = seo;

  const title = isHi
    ? `आज के अशुभ समय ${dateStr} – राहु काल ${p.rahuKaal.start}–${p.rahuKaal.end}`
    : `Inauspicious Times Today ${dateStr} – Rahu Kaal ${p.rahuKaal.start}–${p.rahuKaal.end}`;

  const desc = isHi
    ? `${dateStr}: राहु काल ${p.rahuKaal.start}–${p.rahuKaal.end}, यमगण्ड ${p.yamaganda.start}–${p.yamaganda.end}, गुलिक ${p.gulikaKaal.start}–${p.gulikaKaal.end}। अपने शहर का सटीक समय।`
    : `${dateStr}: Rahu Kaal ${p.rahuKaal.start}–${p.rahuKaal.end}, Yamaganda ${p.yamaganda.start}–${p.yamaganda.end}, Gulika ${p.gulikaKaal.start}–${p.gulikaKaal.end}. Your city's exact times.`;

  return { ...base, title, description: desc };
}

export default async function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
