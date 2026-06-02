import { setRequestLocale } from 'next-intl/server';
import type { Metadata } from 'next';
import { getPageMetadata } from '@/lib/seo/metadata';
import { generateFAQLD } from '@/lib/seo/faq-data';
import { safeJsonLd } from '@/lib/seo/safe-jsonld';
import { ToolStructuredData } from '@/components/seo/ToolStructuredData';
import { todayPanchangForSEO } from '@/lib/seo/ctr-config';
import { pickByLocale } from '@/lib/utils/locale-fonts';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  setRequestLocale(locale);
  const base = getPageMetadata('/gauri-panchang', locale);
  const seo = todayPanchangForSEO(locale);
  if (!seo) return base;

  const { p, dateStr } = seo;
  const slots = (p as { gauriPanchang?: { nature: string; period: string; startTime: string; endTime: string }[] }).gauriPanchang ?? [];
  const goodSlot = slots.find(s => s.nature === 'auspicious' && s.period === 'day');

  // Per-locale title/desc strings — never branch on isHi/isDevanagari (collapses
  // 7 locales onto 2 byte-identical strings → Google duplicate-content demotion).
  // See 2026-06-02 dynamic-title-locale-collapse audit.
  const TITLES = {
    en: `Gauri Panchang Today ${dateStr} – Auspicious Time${goodSlot ? ` from ${goodSlot.startTime}` : ''}`,
    hi: `आज का गौरी पंचांग ${dateStr} – शुभ समय${goodSlot ? ` ${goodSlot.startTime}` : ''}`,
    ta: `இன்றைய கௌரி பஞ்சாங்கம் ${dateStr} – நல்ல நேரம்${goodSlot ? ` ${goodSlot.startTime}` : ''}`,
    te: `నేటి గౌరి పంచాంగం ${dateStr} – శుభ సమయం${goodSlot ? ` ${goodSlot.startTime}` : ''}`,
    bn: `আজকের গৌরী পঞ্চাঙ্গ ${dateStr} – শুভ সময়${goodSlot ? ` ${goodSlot.startTime}` : ''}`,
    gu: `આજનું ગૌરી પંચાંગ ${dateStr} – શુભ સમય${goodSlot ? ` ${goodSlot.startTime}` : ''}`,
    kn: `ಇಂದಿನ ಗೌರಿ ಪಂಚಾಂಗ ${dateStr} – ಶುಭ ಸಮಯ${goodSlot ? ` ${goodSlot.startTime}` : ''}`,
    mr: `आजचे गौरी पंचांग ${dateStr} – शुभ वेळ${goodSlot ? ` ${goodSlot.startTime}` : ''}`,
    mai: `आजुक गौरी पंचांग ${dateStr} – शुभ समय${goodSlot ? ` ${goodSlot.startTime}` : ''}`,
  };
  const DESCS = {
    en: `${dateStr} Gauri Panchang (Gowri Nalla Neram): Amritha, Siddha, Laabha, Dhanam & Sugam auspicious slots${goodSlot ? ` — first ${goodSlot.startTime}–${goodSlot.endTime}` : ''}. Select your city for exact timings.`,
    hi: `${dateStr} गौरी पंचांग: अमृत, सिद्ध, लाभ, धन, सुगम (शुभ काल)${goodSlot ? ` — पहला शुभ ${goodSlot.startTime}–${goodSlot.endTime}` : ''}। अपने शहर का सटीक समय।`,
    ta: `${dateStr} கௌரி பஞ்சாங்கம்: அமிர்தம், சித்தம், லாபம், தனம், சுகம் (நல்ல நேரம்)${goodSlot ? ` — முதல் சுப நேரம் ${goodSlot.startTime}–${goodSlot.endTime}` : ''}. உங்கள் நகரத்தைத் தேர்ந்தெடுக்கவும்.`,
    te: `${dateStr} గౌరి పంచాంగం: అమృత, సిద్ధ, లాభ, ధన, సుగమ శుభ సమయాలు${goodSlot ? ` — మొదటి శుభ ${goodSlot.startTime}–${goodSlot.endTime}` : ''}. మీ నగరం ఎంచుకోండి.`,
    bn: `${dateStr} গৌরী পঞ্চাঙ্গ: অমৃত, সিদ্ধ, লাভ, ধন, সুগম শুভ সময়${goodSlot ? ` — প্রথম শুভ ${goodSlot.startTime}–${goodSlot.endTime}` : ''}। আপনার শহরের সময়।`,
    gu: `${dateStr} ગૌરી પંચાંગ: અમૃત, સિદ્ધ, લાભ, ધન, સુગમ શુભ સમય${goodSlot ? ` — પ્રથમ શુભ ${goodSlot.startTime}–${goodSlot.endTime}` : ''}. તમારું શહેર પસંદ કરો.`,
    kn: `${dateStr} ಗೌರಿ ಪಂಚಾಂಗ: ಅಮೃತ, ಸಿದ್ಧ, ಲಾಭ, ಧನ, ಸುಗಮ ಶುಭ ಸಮಯ${goodSlot ? ` — ಮೊದಲ ಶುಭ ${goodSlot.startTime}–${goodSlot.endTime}` : ''}. ನಿಮ್ಮ ನಗರ ಆಯ್ಕೆಮಾಡಿ.`,
    mr: `${dateStr} गौरी पंचांग: अमृत, सिद्ध, लाभ, धन, सुगम शुभ वेळा${goodSlot ? ` — पहिली शुभ ${goodSlot.startTime}–${goodSlot.endTime}` : ''}. आपले शहर निवडा.`,
    mai: `${dateStr} गौरी पंचांग: अमृत, सिद्ध, लाभ, धन, सुगम शुभ समय${goodSlot ? ` — पहिल शुभ ${goodSlot.startTime}–${goodSlot.endTime}` : ''}। अपन शहर चुनू।`,
  };

  const title = pickByLocale(TITLES, locale);
  const desc = pickByLocale(DESCS, locale);

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
