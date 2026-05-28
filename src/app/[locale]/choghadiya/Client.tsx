'use client';

import { useState, useMemo, useEffect } from 'react';
import { useLocale } from 'next-intl';
import { motion } from 'framer-motion';
import { Clock, Sun, Moon, MapPin, ArrowLeft, Sparkles } from 'lucide-react';
import GoldDivider from '@/components/ui/GoldDivider';
import RelatedLinks from '@/components/ui/RelatedLinks';
import { getLearnLinksForTool } from '@/lib/seo/cross-links';
import { Link } from '@/lib/i18n/navigation';
import { tl } from '@/lib/utils/trilingual';
import { nowMinutesInTimezone, todayInTimezone } from '@/lib/utils/now-in-timezone';
import { computePanchang, type PanchangInput } from '@/lib/ephem/panchang-calc';
import { getUTCOffsetForDate } from '@/lib/utils/timezone';
import { CITIES, type CityData } from '@/lib/constants/cities';
import { getDefaultCityForLocale } from '@/lib/constants/rashi-slugs';
import { useLocationStore } from '@/stores/location-store';
import { generateBreadcrumbLD } from '@/lib/seo/structured-data';
import type { Locale, ChoghadiyaSlot } from '@/types/panchang';
import { isDevanagariLocale } from '@/lib/utils/locale-fonts';
import { safeJsonLd } from '@/lib/seo/safe-jsonld';

// ─── City selector list ────────────────────────────────────────
const CITY_SLUGS = ['delhi', 'mumbai', 'bangalore', 'chennai', 'kolkata', 'hyderabad', 'pune', 'ahmedabad', 'jaipur', 'varanasi'] as const;
const SELECTOR_CITIES = CITY_SLUGS.map(s => CITIES.find(c => c.slug === s)!).filter(Boolean);

// Static default used for the initial render — must match the server's render to avoid
// hydration mismatches. Delhi is what getDefaultCityForLocale() returns for en/hi/sa.
// We update from the user's stored location in useEffect after mount.
const DEFAULT_CITY: CityData = CITIES.find(c => c.slug === 'delhi')!;

// ─── Nature color mapping ──────────────────────────────────────
const NATURE_STYLES: Record<string, { bg: string; border: string; badge: string; text: string }> = {
  auspicious: {
    bg: 'bg-emerald-500/10',
    border: 'border-emerald-500/30',
    badge: 'bg-emerald-500/20 text-emerald-300',
    text: 'text-emerald-400',
  },
  inauspicious: {
    bg: 'bg-red-500/10',
    border: 'border-red-500/30',
    badge: 'bg-red-500/20 text-red-300',
    text: 'text-red-400',
  },
  neutral: {
    bg: 'bg-amber-500/10',
    border: 'border-amber-500/30',
    badge: 'bg-amber-500/20 text-amber-300',
    text: 'text-amber-400',
  },
};

// ─── Labels ────────────────────────────────────────────────────
const LABELS: Record<string, Record<string, string>> = {
  en: {
    back: 'Panchang',
    title: 'Choghadiya Today',
    dayChoghadiya: 'Day Choghadiya',
    nightChoghadiya: 'Night Choghadiya',
    auspicious: 'Auspicious',
    inauspicious: 'Inauspicious',
    neutral: 'Neutral',
    whatIs: 'What is Choghadiya?',
    whatIsText: 'Choghadiya (also written Chaughadia) is a traditional Vedic time-division system used to find auspicious and inauspicious time slots throughout the day and night. The word literally means "four ghatis"  –  each Choghadiya period spans approximately 4 ghatis (about 96 minutes). There are 8 day slots (sunrise to sunset) and 8 night slots (sunset to next sunrise), giving 16 periods in total.',
    typesTitle: '7 Types of Choghadiya Explained',
    types: 'Amrit|Most auspicious  –  ideal for all good works, especially starting new ventures|Shubh|Auspicious  –  good for marriage, religious ceremonies, and important decisions|Labh|Auspicious  –  excellent for business, trade, and financial transactions|Char|Neutral  –  suitable for travel and movement, but not for starting permanent works|Rog|Inauspicious  –  associated with illness; avoid medical procedures and new health regimens|Kaal|Inauspicious  –  ruled by Saturn; avoid important beginnings, especially financial|Udveg|Inauspicious  –  associated with anxiety; avoid travel, meetings with officials',
    bestTitle: 'Best Choghadiya for Travel & Business',
    bestText: 'For travel, the Char Choghadiya is traditionally recommended as its mobile nature supports journeys. For business and financial activities, Labh (gain) and Shubh (auspicious) are preferred. The Amrit Choghadiya is considered universally auspicious for all activities. Avoid starting any important work during Rog, Kaal, or Udveg periods.',
    seeAlso: 'See Also',
  },
  hi: {
    back: 'पंचांग',
    title: 'आज का चौघड़िया',
    dayChoghadiya: 'दिन का चौघड़िया',
    nightChoghadiya: 'रात का चौघड़िया',
    auspicious: 'शुभ',
    inauspicious: 'अशुभ',
    neutral: 'सामान्य',
    whatIs: 'चौघड़िया क्या है?',
    whatIsText: 'चौघड़िया (चौघाड़िया) एक पारम्परिक वैदिक समय-विभाजन प्रणाली है जिसका उपयोग दिन और रात के शुभ-अशुभ समय खण्डों को जानने के लिए किया जाता है। इस शब्द का शाब्दिक अर्थ है "चार घटी"  –  प्रत्येक चौघड़िया अवधि लगभग 4 घटी (लगभग 96 मिनट) की होती है। सूर्योदय से सूर्यास्त तक 8 दिन के और सूर्यास्त से अगले सूर्योदय तक 8 रात के, कुल 16 खण्ड होते हैं।',
    typesTitle: 'चौघड़िया के 7 प्रकार',
    types: 'अमृत|सर्वाधिक शुभ  –  सभी अच्छे कार्यों, विशेषकर नए कार्य आरम्भ के लिए उत्तम|शुभ|शुभ  –  विवाह, धार्मिक अनुष्ठान और महत्वपूर्ण निर्णयों के लिए अच्छा|लाभ|शुभ  –  व्यापार, व्यापार और वित्तीय लेनदेन के लिए उत्कृष्ट|चर|सामान्य  –  यात्रा और गमन के लिए उपयुक्त, लेकिन स्थायी कार्य शुरू करने के लिए नहीं|रोग|अशुभ  –  रोग से सम्बन्धित; चिकित्सा प्रक्रिया और नए स्वास्थ्य कार्यक्रम से बचें|काल|अशुभ  –  शनि द्वारा शासित; महत्वपूर्ण आरम्भ, विशेषकर वित्तीय, से बचें|उद्वेग|अशुभ  –  चिंता से सम्बन्धित; यात्रा, अधिकारियों से मिलने से बचें',
    bestTitle: 'यात्रा और व्यापार के लिए सर्वश्रेष्ठ चौघड़िया',
    bestText: 'यात्रा के लिए चर चौघड़िया पारम्परिक रूप से अनुशंसित है। व्यापार और वित्तीय गतिविधियों के लिए लाभ और शुभ चौघड़िया उत्तम हैं। अमृत चौघड़िया सभी कार्यों के लिए सर्वव्यापी शुभ माना जाता है। रोग, काल या उद्वेग काल में कोई भी महत्वपूर्ण कार्य शुरू न करें।',
    seeAlso: 'यह भी देखें',
  },
  sa: {
    back: 'पञ्चाङ्गम्',
    title: 'अद्य चौघड़िया',
    dayChoghadiya: 'दिवसस्य चौघड़िया',
    nightChoghadiya: 'रात्रेः चौघड़िया',
    auspicious: 'शुभम्',
    inauspicious: 'अशुभम्',
    neutral: 'सामान्यम्',
    whatIs: 'चौघड़िया किम्?',
    whatIsText: 'चौघड़िया एका पारम्परिकवैदिककालविभाजनपद्धतिः अस्ति या दिवसरात्र्योः शुभाशुभकालखण्डान् ज्ञातुं प्रयुज्यते। अस्य शब्दस्य शाब्दिकार्थः "चतस्रः घट्यः" इति  –  प्रत्येकं चौघड़ियाकालखण्डं प्रायः ४ घटीनाम् (प्रायः ९६ निमेषाणाम्) भवति।',
    typesTitle: 'चौघड़ियायाः ७ प्रकाराः',
    types: 'अमृतम्|सर्वाधिकशुभम्  –  सर्वेषां शुभकार्याणां कृते उत्तमम्|शुभम्|शुभम्  –  विवाहधार्मिकानुष्ठानमहत्त्वपूर्णनिर्णयानां कृते|लाभः|शुभम्  –  व्यापारवित्तीयलेनदेनयोः कृते उत्कृष्टम्|चरम्|सामान्यम्  –  यात्रागमनयोः कृते उपयुक्तम्|रोगः|अशुभम्  –  रोगसम्बद्धम्|कालः|अशुभम्  –  शनिशासितम्|उद्वेगः|अशुभम्  –  चिन्तासम्बद्धम्',
    bestTitle: 'यात्राव्यापारयोः कृते श्रेष्ठचौघड़िया',
    bestText: 'यात्रायै चरचौघड़िया पारम्परिकरूपेण अनुशंसितम्। व्यापारवित्तीयकार्याणां कृते लाभशुभचौघड़ियौ उत्तमौ। अमृतचौघड़िया सर्वकार्याणां कृते सर्वव्यापीशुभम्। रोगकालोद्वेगकाले महत्त्वपूर्णं कार्यम् आरभेत् मा।',
    seeAlso: 'एतदपि पश्यतु',
  },
};

// ─── Helpers ──────────────────────────────────────────────────
function timeToMinutes(t: string): number {
  const [h, m] = t.split(':').map(Number);
  return h * 60 + m;
}

// ─── Animation variants ────────────────────────────────────────
const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.45, ease: 'easeOut' as const },
  }),
};

export default function ChoghadiyaClient() {
  const locale = useLocale() as Locale;
  const isDevanagari = isDevanagariLocale(locale);
  const headingFont = isDevanagari
    ? { fontFamily: 'var(--font-devanagari-heading)' }
    : { fontFamily: 'var(--font-heading)' };
  const L = LABELS[locale] || LABELS.en;

  // CLAUDE.md Lesson ZD — defer all rendering until after hydration.
  // The index `/choghadiya` page mounts this component below an
  // already-server-rendered SEO block (day/night tables, education).
  // This component's own rendering depends on selectedCity (which
  // hydrates from useLocationStore localStorage), `nowMin` (60s tick),
  // and date formatting (Intl ICU which can vary between Node and
  // browser). Any of these caused subtle SSR vs first-render
  // mismatches → React #418 → entire React tree died post-hydration →
  // analytics page-view events stopped firing site-wide (the 81%
  // analytics drop on 2026-05-28). Render nothing during SSR and the
  // first client render; the SEO block above this component carries
  // all crawler-visible content.
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => { setHydrated(true); }, []);

  // Static default keeps server and client initial renders identical (no hydration mismatch).
  // After mount we update from the user's stored location if available.
  const [selectedCity, setSelectedCity] = useState<CityData>(DEFAULT_CITY);

  useEffect(() => {
    const store = useLocationStore.getState();
    if (store.lat !== null && store.lng !== null) {
      setSelectedCity({
        slug: 'current',
        // URL params take priority over cached state — none here, so store wins
        name: { en: store.name || 'Current Location', hi: store.name || 'वर्तमान स्थान', sa: store.name || 'वर्तमानस्थानम्' },
        lat: store.lat,
        lng: store.lng,
        timezone: store.timezone || 'UTC',
      });
    } else {
      const localeCity = getDefaultCityForLocale(locale);
      if (localeCity) setSelectedCity(localeCity);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Track current time in the LOCATION's timezone for NOW highlighting.
  // Init null so SSR + first client render produce identical HTML (no
  // NOW badge yet). The badge appears post-hydration via useEffect.
  const [nowMin, setNowMin] = useState<number | null>(null);
  useEffect(() => {
    setNowMin(nowMinutesInTimezone(selectedCity.timezone));
    const iv = setInterval(() => setNowMin(nowMinutesInTimezone(selectedCity.timezone)), 60_000);
    return () => clearInterval(iv);
  }, [selectedCity.timezone]);

  // React still evaluates the WHOLE function body (including all
  // useMemos) during SSR + the first client render — the
  // `if (!hydrated) return null` guard at the bottom only stops the
  // *render output*, not hook execution. computePanchang is a heavy
  // astronomical calculation, so we MUST gate both the wall-clock
  // read and the useMemo body on `hydrated` to avoid running it twice
  // for nothing on every page load. Gemini #273 HIGH (PR #273
  // cycle-1 second batch, 2026-05-28T17:09Z).
  const [year, month, day] = hydrated
    ? todayInTimezone(selectedCity.timezone).split('-').map(Number)
    : [1970, 1, 1];

  const panchang = useMemo(() => {
    if (!hydrated) return { choghadiya: [] as ChoghadiyaSlot[] };
    const tzOffset = getUTCOffsetForDate(year, month, day, selectedCity.timezone);
    const input: PanchangInput = {
      year, month, day,
      lat: selectedCity.lat,
      lng: selectedCity.lng,
      tzOffset,
      timezone: selectedCity.timezone,
      locationName: selectedCity.name.en,
    };
    return computePanchang(input);
  }, [hydrated, year, month, day, selectedCity]);

  // Date formatting
  const dateStr = useMemo(() => {
    const d = new Date(year, month - 1, day);
    const LOCALE_MAP: Record<string, string> = { en: 'en-IN', hi: 'hi-IN', sa: 'hi-IN', ta: 'ta-IN', te: 'te-IN', bn: 'bn-IN', kn: 'kn-IN', gu: 'gu-IN', mai: 'hi-IN', mr: 'mr-IN' };
    const loc = LOCALE_MAP[locale] || 'en-IN';
    return d.toLocaleDateString(loc, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  }, [year, month, day, locale]);

  const slots = panchang.choghadiya || [];
  const daySlots = slots.filter((s: ChoghadiyaSlot) => s.period === 'day');
  const nightSlots = slots.filter((s: ChoghadiyaSlot) => s.period === 'night');

  const natureLabel = (nature: string) => {
    if (nature === 'auspicious') return L.auspicious;
    if (nature === 'inauspicious') return L.inauspicious;
    return L.neutral;
  };

  // Parse the types explanation
  const typeEntries = useMemo(() => {
    const parts = L.types.split('|');
    const result: { name: string; desc: string }[] = [];
    for (let i = 0; i < parts.length; i += 2) {
      result.push({ name: parts[i], desc: parts[i + 1] || '' });
    }
    return result;
  }, [L.types]);

  const renderSlotCard = (slot: ChoghadiyaSlot, i: number) => {
    const style = NATURE_STYLES[slot.nature] || NATURE_STYLES.neutral;
    const startMin = timeToMinutes(slot.startTime);
    const endMin = timeToMinutes(slot.endTime);
    // Midnight-wrapping comparison (Lesson R). nowMin is null during
    // SSR/first render — no slot is "active" until the client clock tick.
    const isActive = nowMin !== null && (endMin < startMin
      ? nowMin >= startMin || nowMin < endMin
      : nowMin >= startMin && nowMin < endMin);
    return (
      <motion.div
        key={`${slot.period}-${i}`}
        custom={i}
        initial="hidden"
        animate="visible"
        variants={fadeUp}
        className={`rounded-xl border p-4 ${style.bg} ${style.border} ${isActive ? 'ring-2 ring-gold-primary/60' : ''}`}
      >
        <div className="flex items-center justify-between mb-2">
          <h3 className={`font-semibold ${style.text}`} style={headingFont}>
            {tl(slot.name, locale)}
          </h3>
          <div className="flex items-center gap-2">
            {isActive && (
              <span className="text-xs px-2 py-0.5 rounded-full bg-gold-primary/30 text-gold-light font-bold animate-pulse" suppressHydrationWarning>
                NOW
              </span>
            )}
            <span className={`text-xs px-2 py-0.5 rounded-full ${style.badge}`}>
              {natureLabel(slot.nature)}
            </span>
          </div>
        </div>
        <p className="text-lg font-bold text-text-primary tracking-wide">
          {slot.startTime}  –  {slot.endTime}
        </p>
      </motion.div>
    );
  };

  // Defer all rendering until after hydration (Lesson ZD — see above).
  if (!hydrated) return null;

  return (
    <div className="px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl">
        {/* JSON-LD */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: safeJsonLd(generateBreadcrumbLD('/choghadiya', locale)) }}
        />

        {/* Back link */}
        <Link
          href="/panchang"
          className="inline-flex items-center gap-1.5 text-text-secondary hover:text-gold-light transition-colors mb-6 text-sm"
        >
          <ArrowLeft size={16} />
          {L.back}
        </Link>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: 'easeOut' as const }}
          className="mb-8"
        >
          <h2
            className="text-3xl sm:text-4xl font-bold text-gold-light mb-2"
            style={headingFont}
          >
            {L.title}
          </h2>
          <p className="text-text-secondary text-lg">{dateStr}</p>
          <p className="text-text-secondary flex items-center gap-1.5 mt-1" suppressHydrationWarning>
            <MapPin size={14} className="text-gold-primary" />
            {tl(selectedCity.name, locale)}
          </p>
        </motion.div>

        {/* City selector */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.15, duration: 0.4, ease: 'easeOut' as const }}
          className="flex flex-wrap gap-2 mb-8"
        >
          {SELECTOR_CITIES.map((city) => (
            <button
              key={city.slug}
              onClick={() => setSelectedCity(city)}
              className={`px-3 py-1.5 rounded-full text-sm transition-all ${
                selectedCity.slug === city.slug
                  ? 'bg-gold-primary/20 border border-gold-primary text-gold-light'
                  : 'bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-white/10 text-text-secondary hover:border-gold-primary/40 hover:text-text-primary'
              }`}
            >
              {tl(city.name, locale)}
            </button>
          ))}
        </motion.div>

        {/* Day Choghadiya */}
        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.4, ease: 'easeOut' as const }}
          className="mb-8"
        >
          <h2 className="text-xl font-bold text-gold-light mb-4 flex items-center gap-2" style={headingFont}>
            <Sun size={20} className="text-gold-primary" />
            {L.dayChoghadiya}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {daySlots.map((slot, i) => renderSlotCard(slot, i))}
          </div>
        </motion.section>

        {/* Night Choghadiya */}
        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.35, duration: 0.4, ease: 'easeOut' as const }}
          className="mb-8"
        >
          <h2 className="text-xl font-bold text-gold-light mb-4 flex items-center gap-2" style={headingFont}>
            <Moon size={20} className="text-gold-primary" />
            {L.nightChoghadiya}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {nightSlots.map((slot, i) => renderSlotCard(slot, i + 8))}
          </div>
        </motion.section>

        <GoldDivider />

        {/* Educational section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.5, ease: 'easeOut' as const }}
          className="space-y-8 mt-4"
        >
          {/* What is Choghadiya */}
          <div>
            <h2 className="text-xl font-bold text-gold-light mb-3" style={headingFont}>
              {L.whatIs}
            </h2>
            <p className="text-text-primary leading-relaxed">{L.whatIsText}</p>
          </div>

          {/* 7 Types */}
          <div>
            <h2 className="text-xl font-bold text-gold-light mb-4" style={headingFont}>
              <Sparkles size={18} className="inline-block mr-2 text-gold-primary -mt-0.5" />
              {L.typesTitle}
            </h2>
            <div className="space-y-3">
              {typeEntries.map((entry) => (
                <div key={entry.name} className="rounded-lg border border-white/10 bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] p-4">
                  <h3 className="font-semibold text-gold-light mb-1" style={headingFont}>
                    {entry.name}
                  </h3>
                  <p className="text-text-secondary text-sm">{entry.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Best for travel/business */}
          <div>
            <h2 className="text-xl font-bold text-gold-light mb-3" style={headingFont}>
              {L.bestTitle}
            </h2>
            <p className="text-text-primary leading-relaxed">{L.bestText}</p>
          </div>
        </motion.section>

        <RelatedLinks type="learn" links={getLearnLinksForTool('/choghadiya')} locale={locale} className="mt-8" />

        <GoldDivider className="mt-8" />

        {/* See Also */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.5, ease: 'easeOut' as const }}
          className="mt-4 mb-12"
        >
          <h2 className="text-lg font-bold text-gold-light mb-4" style={headingFont}>
            {L.seeAlso}
          </h2>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/rahu-kaal"
              className="px-4 py-2 rounded-lg bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-white/10 text-text-primary hover:border-gold-primary/40 hover:text-gold-light transition-all text-sm"
            >
              Rahu Kaal
            </Link>
            <Link
              href="/panchang"
              className="px-4 py-2 rounded-lg bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-white/10 text-text-primary hover:border-gold-primary/40 hover:text-gold-light transition-all text-sm"
            >
              {L.back}
            </Link>
          </div>
        </motion.section>
      </div>
    </div>
  );
}
