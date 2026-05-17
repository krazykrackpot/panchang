import { setRequestLocale } from 'next-intl/server';
import type { Metadata } from 'next';
import { getPageMetadata } from '@/lib/seo/metadata';
import { generateFAQLD } from '@/lib/seo/faq-data';
import { safeJsonLd } from '@/lib/seo/safe-jsonld';
import { todayPanchangForSEO } from '@/lib/seo/ctr-config';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  setRequestLocale(locale);
  const base = getPageMetadata('/choghadiya', locale);
  const seo = todayPanchangForSEO(locale);
  if (!seo) return base;

  const { p, dateStr, isHi } = seo;
  const slots = (p as { choghadiya?: { nature: string; period: string; startTime: string; endTime: string }[] }).choghadiya ?? [];
  const goodSlot = slots.find(s => s.nature === 'auspicious' && s.period === 'day');

  const title = isHi
    ? `आज का चौघड़िया ${dateStr} – शुभ समय ${goodSlot ? goodSlot.startTime : ''}`
    : `Choghadiya Today ${dateStr} – Shubh Time${goodSlot ? ` from ${goodSlot.startTime}` : ''}`;

  const desc = isHi
    ? `${dateStr} चौघड़िया: शुभ, अमृत, लाभ समय${goodSlot ? ` — पहला शुभ ${goodSlot.startTime}–${goodSlot.endTime}` : ''}। अपने शहर का सटीक समय देखें।`
    : `${dateStr} Choghadiya: Shubh, Amrit & Labh slots${goodSlot ? ` — first auspicious ${goodSlot.startTime}–${goodSlot.endTime}` : ''}. Select your city for exact times.`;

  return { ...base, title, description: desc };
}

export default async function Layout({ children, params }: { children: React.ReactNode; params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const faqLD = generateFAQLD('/choghadiya', locale);
  return (
    <>
      {faqLD && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(faqLD) }} />
      )}
      {children}
    </>
  );
}
