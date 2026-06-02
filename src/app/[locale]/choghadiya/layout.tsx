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
  const base = getPageMetadata('/choghadiya', locale);
  const seo = todayPanchangForSEO(locale);
  if (!seo) return base;

  const { p, dateStr } = seo;
  const slots = (p as { choghadiya?: { nature: string; period: string; startTime: string; endTime: string }[] }).choghadiya ?? [];
  const goodSlot = slots.find(s => s.nature === 'auspicious' && s.period === 'day');

  // Per-locale title/desc strings — never branch on isHi/isDevanagari (collapses
  // 7 locales onto 2 byte-identical strings → Google duplicate-content demotion).
  // See 2026-06-02 dynamic-title-locale-collapse audit.
  const TITLES = {
    en: `Choghadiya Today ${dateStr} – Shubh Time${goodSlot ? ` from ${goodSlot.startTime}` : ''}`,
    hi: `आज का चौघड़िया ${dateStr} – शुभ समय${goodSlot ? ` ${goodSlot.startTime} से` : ''}`,
    ta: `இன்றைய சோகடியா ${dateStr} – சுபவேளை${goodSlot ? ` ${goodSlot.startTime}` : ''}`,
    te: `నేటి చౌఘడియా ${dateStr} – శుభ సమయం${goodSlot ? ` ${goodSlot.startTime}` : ''}`,
    bn: `আজকের চৌঘড়িয়া ${dateStr} – শুভ সময়${goodSlot ? ` ${goodSlot.startTime} থেকে` : ''}`,
    gu: `આજનું ચોઘડિયું ${dateStr} – શુભ સમય${goodSlot ? ` ${goodSlot.startTime}થી` : ''}`,
    kn: `ಇಂದಿನ ಚೌಘಡಿಯ ${dateStr} – ಶುಭ ಸಮಯ${goodSlot ? ` ${goodSlot.startTime}ರಿಂದ` : ''}`,
    mr: `आजचे चौघडिया ${dateStr} – शुभ वेळ${goodSlot ? ` ${goodSlot.startTime} पासून` : ''}`,
    mai: `आजुक चौघड़िया ${dateStr} – शुभ समय${goodSlot ? ` ${goodSlot.startTime} सँ` : ''}`,
  };
  const DESCS = {
    en: `${dateStr} Choghadiya: Shubh, Amrit & Labh slots${goodSlot ? ` — first auspicious ${goodSlot.startTime}–${goodSlot.endTime}` : ''}. Select your city for exact times.`,
    hi: `${dateStr} चौघड़िया: शुभ, अमृत, लाभ समय${goodSlot ? ` — पहला शुभ ${goodSlot.startTime}–${goodSlot.endTime}` : ''}। अपने शहर का सटीक समय देखें।`,
    ta: `${dateStr} சோகடியா: சுபம், அமிர்தம், லாபம் சுபவேளைகள்${goodSlot ? ` — முதல் சுப ${goodSlot.startTime}–${goodSlot.endTime}` : ''}. உங்கள் நகரத்தைத் தேர்ந்தெடுக்கவும்.`,
    te: `${dateStr} చౌఘడియా: శుభ, అమృత, లాభ సమయాలు${goodSlot ? ` — మొదటి శుభ ${goodSlot.startTime}–${goodSlot.endTime}` : ''}. మీ నగరం ఎంచుకోండి.`,
    bn: `${dateStr} চৌঘড়িয়া: শুভ, অমৃত, লাভ সময়${goodSlot ? ` — প্রথম শুভ ${goodSlot.startTime}–${goodSlot.endTime}` : ''}। আপনার শহরের সঠিক সময় দেখুন।`,
    gu: `${dateStr} ચોઘડિયું: શુભ, અમૃત, લાભ સમય${goodSlot ? ` — પ્રથમ શુભ ${goodSlot.startTime}–${goodSlot.endTime}` : ''}. તમારું શહેર પસંદ કરો.`,
    kn: `${dateStr} ಚೌಘಡಿಯ: ಶುಭ, ಅಮೃತ, ಲಾಭ ಸಮಯ${goodSlot ? ` — ಮೊದಲ ಶುಭ ${goodSlot.startTime}–${goodSlot.endTime}` : ''}. ನಿಮ್ಮ ನಗರ ಆಯ್ಕೆಮಾಡಿ.`,
    mr: `${dateStr} चौघडिया: शुभ, अमृत, लाभ वेळा${goodSlot ? ` — पहिली शुभ ${goodSlot.startTime}–${goodSlot.endTime}` : ''}. आपले शहर निवडा.`,
    mai: `${dateStr} चौघड़िया: शुभ, अमृत, लाभ समय${goodSlot ? ` — पहिल शुभ ${goodSlot.startTime}–${goodSlot.endTime}` : ''}। अपन शहरक सटीक समय देखू।`,
  };

  const title = pickByLocale(TITLES, locale);
  const desc = pickByLocale(DESCS, locale);

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
      <ToolStructuredData
        name="Choghadiya Calculator"
        description="Today's Choghadiya muhurta windows — Shubh, Amrit, Labh, Char (auspicious) and Kaal, Rog, Udveg (inauspicious) — for any city."
        path="/choghadiya"
        locale={locale}
      />
      {children}
    </>
  );
}
