import { setRequestLocale } from 'next-intl/server';
import type { Metadata } from 'next';
import { getPageMetadata } from '@/lib/seo/metadata';
import { generateFAQLD } from '@/lib/seo/faq-data';
import { safeJsonLd } from '@/lib/seo/safe-jsonld';
import { ToolStructuredData } from '@/components/seo/ToolStructuredData';
import { todayPanchangForSEO } from '@/lib/seo/ctr-config';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  setRequestLocale(locale);
  const base = getPageMetadata('/gauri-panchang', locale);
  const seo = todayPanchangForSEO(locale);
  if (!seo) return base;

  const { p, dateStr, isHi } = seo;
  const isTa = locale === 'ta';
  const slots = (p as { gauriPanchang?: { nature: string; period: string; startTime: string; endTime: string }[] }).gauriPanchang ?? [];
  const goodSlot = slots.find(s => s.nature === 'auspicious' && s.period === 'day');

  const title = isTa
    ? `இன்றைய கௌரி பஞ்சாங்கம் ${dateStr} – நல்ல நேரம்${goodSlot ? ` ${goodSlot.startTime}` : ''}`
    : isHi
      ? `आज का गौरी पंचांग ${dateStr} – शुभ समय${goodSlot ? ` ${goodSlot.startTime}` : ''}`
      : `Gauri Panchang Today ${dateStr} – Auspicious Time${goodSlot ? ` from ${goodSlot.startTime}` : ''}`;

  const desc = isTa
    ? `${dateStr} கௌரி பஞ்சாங்கம்: அமிர்தம், சித்தம், லாபம், தனம், சுகம் (நல்ல நேரம்)${goodSlot ? ` — முதல் சுப நேரம் ${goodSlot.startTime}–${goodSlot.endTime}` : ''}. உங்கள் நகரத்தைத் தேர்ந்தெடுக்கவும்.`
    : isHi
      ? `${dateStr} गौरी पंचांग: अमृत, सिद्ध, लाभ, धन, सुगम (शुभ काल)${goodSlot ? ` — पहला शुभ ${goodSlot.startTime}–${goodSlot.endTime}` : ''}। अपने शहर का सटीक समय।`
      : `${dateStr} Gauri Panchang (Gowri Nalla Neram): Amritha, Siddha, Laabha, Dhanam & Sugam auspicious slots${goodSlot ? ` — first ${goodSlot.startTime}–${goodSlot.endTime}` : ''}. Select your city for exact timings.`;

  return { ...base, title, description: desc };
}

export default async function Layout({ children, params }: { children: React.ReactNode; params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const faqLD = generateFAQLD('/gauri-panchang', locale);
  return (
    <>
      {faqLD && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(faqLD) }} />
      )}
      <ToolStructuredData
        name="Gauri Panchang Calculator"
        description="Today's Gowri Panchangam (Gauri Nalla Neram) windows — Amritha, Siddha, Laabha, Dhanam, Sugam (auspicious) and Marana, Rogam, Sokam (inauspicious) — for any South-Indian city."
        path="/gauri-panchang"
        locale={locale}
      />
      {children}
    </>
  );
}
