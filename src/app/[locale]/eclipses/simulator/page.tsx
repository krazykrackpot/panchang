'use client';

/**
 * Eclipse Simulator page — educational interactive canvas animation of
 * solar and lunar eclipses, with Jyotish (Rahu/Ketu) context.
 *
 * EclipseSimulator is dynamically imported with ssr:false because it uses
 * canvas + requestAnimationFrame which cannot run server-side.
 */

import dynamic from 'next/dynamic';
import { useState } from 'react';
import { useLocale } from 'next-intl';
import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';
import GoldDivider from '@/components/ui/GoldDivider';
import { isDevanagariLocale } from '@/lib/utils/locale-fonts';
import type { Locale } from '@/types/panchang';

// Dynamically load the canvas component — cannot SSR
const EclipseSimulator = dynamic(
  () => import('@/components/eclipses/EclipseSimulator'),
  {
    ssr: false,
    loading: () => (
      <div className="w-full aspect-video rounded-2xl bg-[#111633] border border-gold-primary/15 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-2 border-gold-primary border-t-transparent" />
      </div>
    ),
  }
);

// ─── Labels ────────────────────────────────────────────────────────────────────

const LABELS: Record<string, Record<string, string>> = {
  en: {
    backToCalendar: '← Eclipse Calendar',
    pageTitle: 'Eclipse Simulator',
    pageSubtitle: 'Interactive visualisation of solar and lunar eclipses',
    howTitle: 'How eclipses work',
    solarExplain: 'A solar eclipse occurs when the Moon passes between Earth and the Sun, blocking sunlight. Because the Moon\'s orbit is tilted ~5° to the ecliptic, this only happens at specific New Moon moments when the Moon crosses the ecliptic plane — near Rahu (north node) or Ketu (south node).',
    lunarExplain: 'A lunar eclipse occurs when Earth passes between the Sun and Moon, casting its shadow on the Moon. This only happens at Full Moon when the Moon is near a node. The Moon turns copper-red during totality because Earth\'s atmosphere bends red sunlight into the umbra — the same reason sunsets are red.',
    jyotishTitle: 'Jyotish significance',
    jyotishText1: 'In Vedic astrology, eclipses mark the mythological battle between the demon Svarbhānu (who became Rahu and Ketu after being sliced by Vishnu\'s discus) and the Sun/Moon. Eclipses occurring near natal planets — especially the Sun, Moon, or lagna lord — are considered powerful transit triggers.',
    jyotishText2: 'The Sutak period begins 12 hours before a solar eclipse and 9 hours before a lunar eclipse. During this time, traditional observances advise fasting, prayer, and avoiding auspicious activities. Eclipse effects in the birth chart are judged by the house and sign where the eclipse falls.',
    jyotishText3: 'Rahu causes solar eclipses at ascending nodes; Ketu causes them at descending nodes. Rahu eclipses are considered more externally visible (material upheaval), while Ketu eclipses point inward (spiritual transformation).',
    solarLabel: 'Solar Eclipse',
    lunarLabel: 'Lunar Eclipse',
    simulatorNote: 'This simulation is educational — it illustrates geometric principles, not precise Besselian elements.',
  },
  hi: {
    backToCalendar: '← ग्रहण पञ्चाङ्ग',
    pageTitle: 'ग्रहण अनुकर्त्ता',
    pageSubtitle: 'सूर्य एवं चन्द्र ग्रहण का इंटरैक्टिव दृश्य प्रदर्शन',
    howTitle: 'ग्रहण कैसे होते हैं',
    solarExplain: 'सूर्य ग्रहण तब होता है जब चन्द्रमा, पृथ्वी और सूर्य के बीच आ जाता है। चन्द्रमा की कक्षा क्रान्तिवृत्त से ~5° झुकी होने के कारण, यह केवल तभी होता है जब चन्द्रमा राहु या केतु के पास अमावस्या पर होता है।',
    lunarExplain: 'चन्द्र ग्रहण तब होता है जब पृथ्वी, सूर्य और चन्द्रमा के बीच आ जाती है। पूर्ण ग्रहण में चन्द्रमा रक्तिम (ताम्रवर्ण) हो जाता है क्योंकि पृथ्वी का वायुमंडल सूर्य के लाल प्रकाश को मोड़कर पृथ्वी की छाया में भेज देता है।',
    jyotishTitle: 'ज्योतिष महत्त्व',
    jyotishText1: 'वैदिक ज्योतिष में ग्रहण राहु और केतु की पौराणिक कथा से जुड़े हैं। जन्मकुंडली में जिस भाव में ग्रहण पड़ता है, उस भाव के कारकत्व पर विशेष प्रभाव माना जाता है।',
    jyotishText2: 'सूर्य ग्रहण से 12 घंटे पहले और चन्द्र ग्रहण से 9 घंटे पहले सूतक काल आरम्भ होता है। इस अवधि में उपवास, मन्त्रजाप और ध्यान का विधान है।',
    jyotishText3: 'राहु आरोही नोड पर सूर्य ग्रहण करता है; केतु अवरोही नोड पर। राहु ग्रहण बाह्य उथल-पुथल का संकेत देते हैं, जबकि केतु ग्रहण आन्तरिक आध्यात्मिक परिवर्तन की ओर इंगित करते हैं।',
    solarLabel: 'सूर्य ग्रहण',
    lunarLabel: 'चन्द्र ग्रहण',
    simulatorNote: 'यह अनुकरण शैक्षणिक है — यह ज्यामितीय सिद्धान्त दर्शाता है, सटीक बेसेलियन तत्त्व नहीं।',
  },
  ta: {
    backToCalendar: '← கிரகண நாள்காட்டி',
    pageTitle: 'கிரகண உருவகப்படுத்தி',
    pageSubtitle: 'சூரிய மற்றும் சந்திர கிரகணங்களின் ஊடாடும் காட்சி',
    howTitle: 'கிரகணங்கள் எவ்வாறு நிகழ்கின்றன',
    solarExplain: 'சந்திரன் பூமிக்கும் சூரியனுக்கும் இடையில் வரும்போது சூரிய கிரகணம் நிகழ்கிறது. சந்திரனின் சுற்றுப்பாதை சுமார் 5° சாய்ந்திருப்பதால், இது ராகு அல்லது கேது அருகே அமாவாசையில் மட்டுமே நிகழ்கிறது.',
    lunarExplain: 'பூமி சூரியனுக்கும் சந்திரனுக்கும் இடையில் வரும்போது சந்திர கிரகணம் நிகழ்கிறது. முழு கிரகணத்தின்போது சந்திரன் செம்பு-சிவப்பு நிறமாக மாறுகிறது.',
    jyotishTitle: 'ஜோதிட முக்கியத்துவம்',
    jyotishText1: 'வேத ஜோதிடத்தில், கிரகணங்கள் ராகு மற்றும் கேதுவின் புராண வரலாற்றோடு தொடர்புடையவை. ஜாதகத்தில் கிரகணம் விழும் இடம் முக்கியமான வாழ்க்கை மாற்றங்களை குறிக்கும்.',
    jyotishText2: 'சூரிய கிரகணத்திற்கு 12 மணி நேரம் முன்பும், சந்திர கிரகணத்திற்கு 9 மணி நேரம் முன்பும் சூதக காலம் தொடங்குகிறது.',
    jyotishText3: 'ராகு ஏறு நோடில் சூரிய கிரகணம் ஏற்படுத்துகிறது; கேது இறங்கு நோடில். ராகு கிரகணங்கள் வெளிப்புற மாற்றங்களை, கேது கிரகணங்கள் ஆன்மீக மாற்றங்களை குறிக்கின்றன.',
    solarLabel: 'சூரிய கிரகணம்',
    lunarLabel: 'சந்திர கிரகணம்',
    simulatorNote: 'இந்த உருவகப்படுத்தல் கல்வி நோக்கத்திற்கானது — இது வடிவியல் கொள்கைகளை விளக்குகிறது.',
  },
  bn: {
    backToCalendar: '← গ্রহণ পঞ্চাঙ্গ',
    pageTitle: 'গ্রহণ সিমুলেটর',
    pageSubtitle: 'সূর্য ও চন্দ্রগ্রহণের ইন্টারেক্টিভ দৃশ্য প্রদর্শন',
    howTitle: 'গ্রহণ কীভাবে হয়',
    solarExplain: 'চাঁদ পৃথিবী ও সূর্যের মাঝে এলে সূর্যগ্রহণ হয়। চাঁদের কক্ষপথ ক্রান্তিবৃত্ত থেকে ~৫° হেলে থাকায়, এটি কেবল রাহু বা কেতুর কাছে অমাবস্যায় হয়।',
    lunarExplain: 'পৃথিবী সূর্য ও চাঁদের মাঝে এলে চন্দ্রগ্রহণ হয়। পূর্ণ গ্রহণে চাঁদ তামাটে-লাল হয় কারণ পৃথিবীর বায়ুমণ্ডল লাল আলোকে ছায়ায় বাঁকিয়ে পাঠায়।',
    jyotishTitle: 'জ্যোতিষ গুরুত্ব',
    jyotishText1: 'বৈদিক জ্যোতিষে গ্রহণ রাহু ও কেতুর পৌরাণিক কাহিনীর সাথে যুক্ত। জন্মকুণ্ডলীতে যে ভাবে গ্রহণ পড়ে, তার কারকত্বে বিশেষ প্রভাব হয়।',
    jyotishText2: 'সূর্যগ্রহণের ১২ ঘণ্টা আগে ও চন্দ্রগ্রহণের ৯ ঘণ্টা আগে সূতক শুরু হয়।',
    jyotishText3: 'রাহু আরোহী নোডে সূর্যগ্রহণ ঘটায়; কেতু অবরোহী নোডে। রাহু গ্রহণ বাহ্যিক পরিবর্তন, কেতু গ্রহণ আধ্যাত্মিক রূপান্তরের ইঙ্গিত দেয়।',
    solarLabel: 'সূর্যগ্রহণ',
    lunarLabel: 'চন্দ্রগ্রহণ',
    simulatorNote: 'এই সিমুলেশন শিক্ষামূলক — এটি জ্যামিতিক নীতি দেখায়, সঠিক বেসেলিয়ান উপাদান নয়।',
  },
};

type EclipseMode = 'solar' | 'lunar';

export default function EclipseSimulatorPage() {
  const locale = useLocale() as Locale;
  const L = LABELS[locale] || LABELS.en;
  const isHi = isDevanagariLocale(locale);
  const headingFont = isHi
    ? { fontFamily: 'var(--font-devanagari-heading)' }
    : { fontFamily: 'var(--font-heading)' };
  const bodyFont = isHi ? { fontFamily: 'var(--font-devanagari-body)' } : undefined;

  const [mode, setMode] = useState<EclipseMode>('solar');

  return (
    <div className="min-h-screen bg-[#0a0e27] text-text-primary px-4 py-8 max-w-4xl mx-auto">
      {/* Back link */}
      <Link
        href={`/${locale}/eclipses`}
        className="inline-flex items-center gap-1 text-gold-primary/70 hover:text-gold-light text-sm mb-6 transition-colors"
        style={bodyFont}
      >
        <ChevronLeft className="w-4 h-4" />
        {L.backToCalendar}
      </Link>

      {/* Header */}
      <div className="text-center mb-8">
        <h1
          className="text-3xl sm:text-4xl font-bold text-gold-gradient mb-2"
          style={headingFont}
        >
          {L.pageTitle}
        </h1>
        <p className="text-text-secondary text-sm sm:text-base" style={bodyFont}>
          {L.pageSubtitle}
        </p>
      </div>

      {/* Type selector tabs */}
      <div className="flex gap-2 justify-center mb-6">
        {(['solar', 'lunar'] as EclipseMode[]).map(m => (
          <button
            key={m}
            onClick={() => setMode(m)}
            className={`px-6 py-2.5 rounded-xl font-semibold text-sm transition-all border ${
              mode === m
                ? m === 'solar'
                  ? 'bg-amber-500/20 border-amber-400/50 text-amber-300'
                  : 'bg-indigo-500/20 border-indigo-400/50 text-indigo-300'
                : 'border-gold-primary/20 text-text-secondary hover:border-gold-primary/40 hover:text-gold-primary'
            }`}
            style={bodyFont}
          >
            {m === 'solar' ? L.solarLabel : L.lunarLabel}
          </button>
        ))}
      </div>

      {/* Simulator */}
      <EclipseSimulator initialMode={mode} locale={locale} key={mode} />

      {/* Simulator note */}
      <p className="text-center text-text-secondary/50 text-xs mt-3 italic" style={bodyFont}>
        {L.simulatorNote}
      </p>

      <GoldDivider className="my-10" />

      {/* Educational content */}
      <div className="space-y-8">
        {/* How it works */}
        <section>
          <h2
            className="text-xl font-bold text-gold-light mb-4"
            style={headingFont}
          >
            {L.howTitle}
          </h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {/* Solar */}
            <div className="bg-[#111633] rounded-2xl p-5 border border-amber-500/20">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-5 h-5 rounded-full bg-amber-400/80 shadow-[0_0_8px_#FFD700]" />
                <span className="font-semibold text-amber-300" style={bodyFont}>
                  {L.solarLabel}
                </span>
              </div>
              <p className="text-text-secondary text-sm leading-relaxed" style={bodyFont}>
                {L.solarExplain}
              </p>
            </div>
            {/* Lunar */}
            <div className="bg-[#111633] rounded-2xl p-5 border border-indigo-500/20">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-5 h-5 rounded-full bg-indigo-400/80 shadow-[0_0_8px_#4169E1]" />
                <span className="font-semibold text-indigo-300" style={bodyFont}>
                  {L.lunarLabel}
                </span>
              </div>
              <p className="text-text-secondary text-sm leading-relaxed" style={bodyFont}>
                {L.lunarExplain}
              </p>
            </div>
          </div>
        </section>

        <GoldDivider />

        {/* Jyotish significance */}
        <section>
          <h2
            className="text-xl font-bold text-gold-light mb-4"
            style={headingFont}
          >
            {L.jyotishTitle}
          </h2>
          <div className="bg-[#111633] rounded-2xl p-6 border border-gold-primary/15 space-y-4">
            {/* Rahu/Ketu diagram */}
            <div className="flex items-center justify-center gap-6 py-3">
              <div className="flex flex-col items-center gap-1">
                <div className="w-8 h-8 rounded-full bg-purple-500/30 border border-purple-400/50 flex items-center justify-center">
                  <span className="text-purple-300 font-bold text-xs">☊</span>
                </div>
                <span className="text-purple-300/80 text-xs">Rahu</span>
              </div>
              <div className="flex-1 h-px bg-gradient-to-r from-purple-500/30 via-gold-primary/40 to-purple-500/30" />
              <div className="flex flex-col items-center gap-1">
                <svg viewBox="0 0 40 40" className="w-9 h-9">
                  <circle cx="20" cy="20" r="16" fill="#4169E1" opacity="0.7" />
                  <circle cx="20" cy="20" r="16" fill="none" stroke="#6BB8FF" strokeWidth="1.5" />
                </svg>
                <span className="text-blue-300/80 text-xs">Earth</span>
              </div>
              <div className="flex-1 h-px bg-gradient-to-r from-purple-500/30 via-gold-primary/40 to-purple-500/30" />
              <div className="flex flex-col items-center gap-1">
                <div className="w-8 h-8 rounded-full bg-purple-500/30 border border-purple-400/50 flex items-center justify-center">
                  <span className="text-purple-300 font-bold text-xs">☋</span>
                </div>
                <span className="text-purple-300/80 text-xs">Ketu</span>
              </div>
            </div>

            <p className="text-text-secondary text-sm leading-relaxed" style={bodyFont}>
              {L.jyotishText1}
            </p>
            <p className="text-text-secondary text-sm leading-relaxed" style={bodyFont}>
              {L.jyotishText2}
            </p>
            <p className="text-text-secondary text-sm leading-relaxed" style={bodyFont}>
              {L.jyotishText3}
            </p>
          </div>
        </section>
      </div>

      <GoldDivider className="my-10" />

      {/* Cross-link back */}
      <div className="text-center">
        <Link
          href={`/${locale}/eclipses`}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gold-primary/10 border border-gold-primary/25 text-gold-light hover:bg-gold-primary/20 transition-all font-semibold text-sm"
          style={bodyFont}
        >
          <ChevronLeft className="w-4 h-4" />
          {L.backToCalendar}
        </Link>
      </div>
    </div>
  );
}
