import type { Metadata } from 'next';
import { getPageMetadata } from '@/lib/seo/metadata';
import { generateFAQLD } from '@/lib/seo/faq-data';
import { safeJsonLd } from '@/lib/seo/safe-jsonld';
import { computePanchang } from '@/lib/ephem/panchang-calc';
import { getUTCOffsetForDate } from '@/lib/utils/timezone';

// Ujjain reference for India-wide metadata
const REF_LAT = 23.1765;
const REF_LNG = 75.7885;
const REF_TZ = 'Asia/Kolkata';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const base = getPageMetadata('/choghadiya', locale);

  try {
    const now = new Date();
    const tzOffset = getUTCOffsetForDate(now.getFullYear(), now.getMonth() + 1, now.getDate(), REF_TZ);
    const istMs = now.getTime() + tzOffset * 3600 * 1000;
    const istDate = new Date(istMs);
    const year = istDate.getUTCFullYear();
    const month = istDate.getUTCMonth() + 1;
    const day = istDate.getUTCDate();

    const p = computePanchang({ year, month, day, lat: REF_LAT, lng: REF_LNG, tzOffset, timezone: REF_TZ });
    const dateStr = istDate.toLocaleDateString(locale === 'hi' ? 'hi-IN' : 'en-US', { month: 'short', day: 'numeric', timeZone: 'UTC' });

    // Find the first upcoming Shubh or Amrit slot
    const goodSlot = ((p as { choghadiya?: { nature: string; period: string; startTime: string; endTime: string }[] }).choghadiya ?? []).find(s =>
      (s.nature === 'auspicious') && s.period === 'day'
    );

    const isHi = locale === 'hi' || locale === 'sa';
    const title = isHi
      ? `आज का चौघड़िया ${dateStr} – शुभ समय ${goodSlot ? goodSlot.startTime : ''}`
      : `Choghadiya Today ${dateStr} – Shubh Time${goodSlot ? ` from ${goodSlot.startTime}` : ''}`;

    const desc = isHi
      ? `${dateStr} चौघड़िया: शुभ, अमृत, लाभ समय${goodSlot ? ` — पहला शुभ ${goodSlot.startTime}–${goodSlot.endTime}` : ''}। अपने शहर का सटीक समय दे��ें।`
      : `${dateStr} Choghadiya: Shubh, Amrit & Labh slots${goodSlot ? ` — first auspicious ${goodSlot.startTime}–${goodSlot.endTime}` : ''}. Select your city for exact times.`;

    return { ...base, title, description: desc };
  } catch {
    return base;
  }
}

export default async function Layout({ children, params }: { children: React.ReactNode; params: Promise<{ locale: string }> }) {
  const { locale } = await params;
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
