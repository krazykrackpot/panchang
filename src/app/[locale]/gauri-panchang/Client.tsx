'use client';

import { useState, useMemo, useEffect } from 'react';
import { useLocale } from 'next-intl';
import { motion } from 'framer-motion';
import { Sun, Moon, MapPin, ArrowLeft, Sparkles } from 'lucide-react';
import GoldDivider from '@/components/ui/GoldDivider';
import RelatedLinks from '@/components/ui/RelatedLinks';
import { getLearnLinksForTool } from '@/lib/seo/cross-links';
import { Link } from '@/lib/i18n/navigation';
import { tl } from '@/lib/utils/trilingual';
import { nowMinutesInTimezone, todayInTimezone } from '@/lib/utils/now-in-timezone';
import { computePanchang, type PanchangInput } from '@/lib/ephem/panchang-calc';
import { getUTCOffsetForDate } from '@/lib/utils/timezone';
import { CITIES, type CityData } from '@/lib/constants/cities';
import { useLocationStore } from '@/stores/location-store';
import { generateBreadcrumbLD } from '@/lib/seo/structured-data';
import type { Locale, GauriSlot } from '@/types/panchang';
import { isDevanagariLocale } from '@/lib/utils/locale-fonts';
import { safeJsonLd } from '@/lib/seo/safe-jsonld';

// ─── City selector ───────────────────────────────────────────────
// Gauri Panchang's primary audience is South-Indian — front the list
// with TN/KA/AP/TS/KL cities, then add the top North-Indian metros so
// users elsewhere can still pick a meaningful default.
const CITY_SLUGS = [
  'chennai',
  'bangalore',
  'hyderabad',
  'thiruvananthapuram',
  'coimbatore',
  'madurai',
  'mysore',
  'visakhapatnam',
  'mumbai',
  'delhi',
] as const;
const SELECTOR_CITIES = CITY_SLUGS
  .map(s => CITIES.find(c => c.slug === s))
  .filter((c): c is CityData => Boolean(c));

// Default for the initial render — must match the server (which uses
// Chennai for SSR). After mount we may switch to a stored location.
const DEFAULT_CITY: CityData = CITIES.find(c => c.slug === 'chennai') ?? CITIES[0];

// ─── Nature color mapping (only two tiers in Gauri) ──────────────
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
};

// ─── Labels ──────────────────────────────────────────────────────
const LABELS: Record<string, Record<string, string>> = {
  en: {
    back: 'Panchang',
    title: 'Gauri Panchang Today',
    dayGauri: 'Day Gauri Panchang',
    nightGauri: 'Night Gauri Panchang',
    auspicious: 'Auspicious',
    inauspicious: 'Inauspicious',
    whatIs: 'What is Gauri Panchang?',
    whatIsText: 'Gauri Panchang (also called Gowri Panchangam or Gauri Nalla Neram) is the South-Indian counterpart of Choghadiya — a Vedic time-division system that splits each day and night into 8 equal periods. Five periods are auspicious (Amritha, Siddha, Laabha, Dhanam, Sugam) and three are inauspicious (Marana, Rogam, Sokam). It is widely used across Tamil Nadu, Karnataka, Andhra Pradesh, Telangana, and Kerala to choose auspicious times for new ventures, travel, business, and ceremonies.',
    typesTitle: 'The 8 Gauri Periods Explained',
    types: 'Amritha|Nectar — the most auspicious period, ideal for all new ventures and important beginnings|Siddha|Achievement — excellent for finishing important work, signing agreements, exams|Laabha|Gain — best for business transactions, trade, financial decisions|Dhanam|Wealth — auspicious for investments, purchases, banking activities|Sugam|Comfort — gentle and supportive period, good for travel and social events|Marana|Death — strongly inauspicious; avoid medical procedures, surgeries, journeys|Rogam|Disease — avoid health-related decisions, new diets, or stressful activities|Sokam|Sorrow — avoid arguments, contract signings, emotional commitments',
    bestTitle: 'Best Gauri Period for Each Activity',
    bestText: 'For starting a new venture or moving into a new home, Amritha is universally considered the most powerful. Business and financial activities are best timed during Laabha (gain) or Dhanam (wealth). For travel and family gatherings, Sugam (comfort) is preferred. For finishing exams, certifications, or signing important agreements, Siddha (achievement) brings the strongest support. Avoid Marana, Rogam, and Sokam for any auspicious work — these periods are best reserved for rest, routine maintenance, or activities you wish to conclude rather than begin.',
    seeAlso: 'See Also',
  },
  ta: {
    back: 'பஞ்சாங்கம்',
    title: 'இன்றைய கௌரி பஞ்சாங்கம்',
    dayGauri: 'பகல் கௌரி பஞ்சாங்கம்',
    nightGauri: 'இரவு கௌரி பஞ்சாங்கம்',
    auspicious: 'நல்ல நேரம்',
    inauspicious: 'கெட்ட நேரம்',
    whatIs: 'கௌரி பஞ்சாங்கம் என்றால் என்ன?',
    whatIsText: 'கௌரி பஞ்சாங்கம் (கௌரி நல்ல நேரம்) என்பது தென்னிந்தியாவில் பரவலாகப் பயன்படுத்தப்படும் வைதீக கால-பிரிவு முறையாகும். ஒவ்வொரு பகலும் இரவும் 8 சமமான கால-பகுதிகளாகப் பிரிக்கப்படுகின்றன. அமிர்தம், சித்தம், லாபம், தனம், சுகம் — இவை ஐந்தும் சுபமான நேரங்கள். மரணம், ரோகம், சோகம் — இவை மூன்றும் கெட்ட நேரம். தமிழ்நாடு, கர்நாடகா, ஆந்திரா, தெலங்கானா, கேரளாவில் புதிய காரியங்கள், பயணம், வியாபாரம், சடங்குகளுக்கு உகந்த நேரம் தேர்வு செய்ய பயன்படுகிறது.',
    typesTitle: '8 கௌரி காலங்களின் விளக்கம்',
    types: 'அமிர்தம்|அமுதம் — மிக சுபமான காலம், புதிய காரியங்களுக்கும் முக்கிய தொடக்கங்களுக்கும் சிறந்தது|சித்தம்|சாதனை — முக்கியமான பணிகளை முடிக்க, ஒப்பந்தங்கள் கையெழுத்திட, தேர்வுகளுக்கு சிறந்தது|லாபம்|லாபம் — வியாபாரம், வர்த்தகம், நிதி முடிவுகளுக்கு சிறந்தது|தனம்|செல்வம் — முதலீடு, கொள்முதல், வங்கி செயல்பாடுகளுக்கு சுபம்|சுகம்|சௌகர்யம் — மென்மையான ஆதரவான காலம், பயணம் மற்றும் சமூக நிகழ்வுகளுக்கு நல்லது|மரணம்|மரணம் — மிகவும் அசுபம்; மருத்துவ செயல்முறைகள், அறுவை சிகிச்சை, பயணங்களைத் தவிர்க்கவும்|ரோகம்|நோய் — உடல்நலம் தொடர்பான முடிவுகள், புதிய உணவு முறை, அழுத்தமான செயல்பாடுகளைத் தவிர்க்கவும்|சோகம்|சோகம் — வாதங்கள், ஒப்பந்தம் கையெழுத்திட, உணர்ச்சிபூர்வமான உறுதிமொழிகளைத் தவிர்க்கவும்',
    bestTitle: 'ஒவ்வொரு செயலுக்கும் சிறந்த கௌரி காலம்',
    bestText: 'புதிய காரியம் தொடங்க அல்லது புதிய வீட்டில் குடியேற — அமிர்தம் சர்வசாதாரணமாக மிக சக்திவாய்ந்தது. வியாபாரம் மற்றும் நிதி நடவடிக்கைகள் — லாபம் அல்லது தனம் காலத்தில் சிறந்தது. பயணம் மற்றும் குடும்ப கூட்டங்கள் — சுகம் காலத்தில் உகந்தது. தேர்வுகள், சான்றிதழ்கள், ஒப்பந்தங்கள் — சித்தம் காலத்தில் வலுவான ஆதரவு. மரணம், ரோகம், சோகம் காலங்களில் எந்த சுப காரியத்தையும் தொடங்க வேண்டாம் — இந்த நேரங்கள் ஓய்வு, வழக்கமான பராமரிப்பு, அல்லது நீங்கள் முடிக்க விரும்பும் செயல்பாடுகளுக்காக ஒதுக்கப்பட்டவை.',
    seeAlso: 'மேலும் பார்க்க',
  },
  hi: {
    back: 'पंचांग',
    title: 'आज का गौरी पंचांग',
    dayGauri: 'दिन का गौरी पंचांग',
    nightGauri: 'रात का गौरी पंचांग',
    auspicious: 'शुभ',
    inauspicious: 'अशुभ',
    whatIs: 'गौरी पंचांग क्या है?',
    whatIsText: 'गौरी पंचांग (जिसे गौरी नल्ल नेरम भी कहा जाता है) दक्षिण भारत में प्रचलित चौघड़िया का समकक्ष है — एक वैदिक काल-विभाजन प्रणाली जो प्रत्येक दिन और रात को 8 बराबर भागों में बाँटती है। पाँच काल शुभ हैं (अमृत, सिद्ध, लाभ, धन, सुगम) और तीन अशुभ (मरण, रोग, शोक)। यह तमिलनाडु, कर्नाटक, आंध्र प्रदेश, तेलंगाना और केरल में नए कार्य, यात्रा, व्यापार और अनुष्ठान के लिए शुभ समय चुनने में व्यापक रूप से प्रयुक्त है।',
    typesTitle: '8 गौरी कालों का विस्तृत विवरण',
    types: 'अमृत|अमृत — सबसे शुभ काल, सभी नए कार्यों और महत्वपूर्ण आरम्भ के लिए उत्तम|सिद्ध|कार्य-सिद्धि — महत्वपूर्ण कार्य पूरा करने, अनुबंध हस्ताक्षर, परीक्षा के लिए उत्कृष्ट|लाभ|लाभ — व्यापार, वाणिज्य, वित्तीय निर्णयों के लिए सर्वश्रेष्ठ|धन|धन — निवेश, खरीद, बैंकिंग गतिविधियों के लिए शुभ|सुगम|सुख-सुविधा — सौम्य और सहायक काल, यात्रा और सामाजिक कार्यों के लिए|मरण|मृत्यु-सूचक — दृढ़ता से अशुभ; चिकित्सा प्रक्रिया, शल्य, यात्रा से बचें|रोग|रोग — स्वास्थ्य सम्बन्धी निर्णय, नया आहार, तनावपूर्ण गतिविधियों से बचें|शोक|दुःख — विवाद, अनुबंध हस्ताक्षर, भावनात्मक प्रतिबद्धताओं से बचें',
    bestTitle: 'प्रत्येक कार्य के लिए सर्वश्रेष्ठ गौरी काल',
    bestText: 'नए कार्य आरम्भ या नए घर में प्रवेश के लिए — अमृत सार्वभौमिक रूप से सबसे शक्तिशाली माना जाता है। व्यापार और वित्तीय गतिविधियाँ लाभ या धन काल में सर्वोत्तम। यात्रा और पारिवारिक समारोह — सुगम काल में। परीक्षा, प्रमाणपत्र, महत्वपूर्ण अनुबंध — सिद्ध काल में सबसे मजबूत सहायता। मरण, रोग, शोक काल में कोई भी शुभ कार्य न करें — ये काल विश्राम, नियमित रखरखाव, या जो आप समाप्त करना चाहते हैं उसके लिए उपयुक्त हैं।',
    seeAlso: 'यह भी देखें',
  },
};

// ─── Helpers ─────────────────────────────────────────────────────
function timeToMinutes(t: string): number {
  const [h, m] = t.split(':').map(Number);
  return h * 60 + m;
}

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.45, ease: 'easeOut' as const },
  }),
};

export default function GauriPanchangClient() {
  const locale = useLocale() as Locale;
  const isDevanagari = isDevanagariLocale(locale);
  const headingFont = isDevanagari
    ? { fontFamily: 'var(--font-devanagari-heading)' }
    : { fontFamily: 'var(--font-heading)' };
  // Pick the best matching label set. Tamil is first-class for this
  // feature; Telugu/Kannada/Malayalam users will see English labels but
  // Tamil period-names in the table (via the GAURI_NAMES.ta render) —
  // that's still more relevant than Hindi for them. Falls back to en.
  const L = LABELS[locale] || (locale === 'te' || locale === 'kn' ? LABELS.en : LABELS.en);

  const [selectedCity, setSelectedCity] = useState<CityData>(DEFAULT_CITY);

  useEffect(() => {
    const store = useLocationStore.getState();
    if (store.lat !== null && store.lng !== null) {
      setSelectedCity({
        slug: 'current',
        // URL params take priority over cached state — no URL params here, so store wins
        name: {
          en: store.name || 'Current Location',
          hi: store.name || 'वर्तमान स्थान',
          sa: store.name || 'वर्तमानस्थानम्',
        },
        lat: store.lat,
        lng: store.lng,
        timezone: store.timezone || 'UTC',
      });
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Track current time in the selected city's TZ for the NOW badge.
  // Init `null` so SSR and the client's first render produce identical
  // HTML (no NOW badge yet). The badge appears only after the useEffect
  // tick post-hydration. Skipping this caused hydration mismatches on
  // every paint that straddled a minute boundary.
  const [nowMin, setNowMin] = useState<number | null>(null);
  useEffect(() => {
    setNowMin(nowMinutesInTimezone(selectedCity.timezone));
    const iv = setInterval(() => setNowMin(nowMinutesInTimezone(selectedCity.timezone)), 60_000);
    return () => clearInterval(iv);
  }, [selectedCity.timezone]);

  const [year, month, day] = todayInTimezone(selectedCity.timezone).split('-').map(Number);

  const panchang = useMemo(() => {
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
  }, [year, month, day, selectedCity]);

  const dateStr = useMemo(() => {
    const d = new Date(year, month - 1, day);
    const LOCALE_MAP: Record<string, string> = {
      en: 'en-IN', hi: 'hi-IN', sa: 'hi-IN', ta: 'ta-IN', te: 'te-IN',
      bn: 'bn-IN', kn: 'kn-IN', gu: 'gu-IN', mai: 'hi-IN', mr: 'mr-IN',
    };
    const loc = LOCALE_MAP[locale] || 'en-IN';
    return d.toLocaleDateString(loc, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  }, [year, month, day, locale]);

  const slots = panchang.gauriPanchang || [];
  const daySlots = slots.filter((s: GauriSlot) => s.period === 'day');
  const nightSlots = slots.filter((s: GauriSlot) => s.period === 'night');

  const natureLabel = (n: string) => n === 'auspicious' ? L.auspicious : L.inauspicious;

  // Parse the 8-entry "name|desc" pipe string into structured entries.
  const typeEntries = useMemo(() => {
    const parts = L.types.split('|');
    const result: { name: string; desc: string }[] = [];
    for (let i = 0; i < parts.length; i += 2) {
      result.push({ name: parts[i], desc: parts[i + 1] || '' });
    }
    return result;
  }, [L.types]);

  // Pick the best regional script variant for the period name. ml
  // (Malayalam) is in the constants for completeness but not yet a
  // supported app locale — Kerala users land on `en` for now.
  const renderName = (slot: GauriSlot): string => {
    const n = slot.name as { en?: string; hi?: string; sa?: string; ta?: string; te?: string; kn?: string; ml?: string };
    if (locale === 'ta' && n.ta) return n.ta;
    if (locale === 'te' && n.te) return n.te;
    if (locale === 'kn' && n.kn) return n.kn;
    return tl(slot.name, locale);
  };

  const renderSlotCard = (slot: GauriSlot, i: number) => {
    const style = NATURE_STYLES[slot.nature] || NATURE_STYLES.auspicious;
    const startMin = timeToMinutes(slot.startTime);
    const endMin = timeToMinutes(slot.endTime);
    // Midnight-wrapping comparison (Lesson R). `nowMin` is null during
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
            {renderName(slot)}
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

  return (
    <div className="px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl">
        {/* JSON-LD breadcrumb */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: safeJsonLd(generateBreadcrumbLD('/gauri-panchang', locale)) }}
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

        {/* Day Gauri */}
        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.4, ease: 'easeOut' as const }}
          className="mb-8"
        >
          <h2 className="text-xl font-bold text-gold-light mb-4 flex items-center gap-2" style={headingFont}>
            <Sun size={20} className="text-gold-primary" />
            {L.dayGauri}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {daySlots.map((slot, i) => renderSlotCard(slot, i))}
          </div>
        </motion.section>

        {/* Night Gauri */}
        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.35, duration: 0.4, ease: 'easeOut' as const }}
          className="mb-8"
        >
          <h2 className="text-xl font-bold text-gold-light mb-4 flex items-center gap-2" style={headingFont}>
            <Moon size={20} className="text-gold-primary" />
            {L.nightGauri}
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
          {/* What is Gauri Panchang */}
          <div>
            <h2 className="text-xl font-bold text-gold-light mb-3" style={headingFont}>
              {L.whatIs}
            </h2>
            <p className="text-text-primary leading-relaxed">{L.whatIsText}</p>
          </div>

          {/* 8 Types */}
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

          {/* Best uses */}
          <div>
            <h2 className="text-xl font-bold text-gold-light mb-3" style={headingFont}>
              {L.bestTitle}
            </h2>
            <p className="text-text-primary leading-relaxed">{L.bestText}</p>
          </div>
        </motion.section>

        <RelatedLinks type="learn" links={getLearnLinksForTool('/gauri-panchang')} locale={locale} className="mt-8" />

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
              href="/choghadiya"
              className="px-4 py-2 rounded-lg bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-white/10 text-text-primary hover:border-gold-primary/40 hover:text-gold-light transition-all text-sm"
            >
              Choghadiya
            </Link>
            <Link
              href="/rahu-kaal"
              className="px-4 py-2 rounded-lg bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-white/10 text-text-primary hover:border-gold-primary/40 hover:text-gold-light transition-all text-sm"
            >
              Rahu Kaal
            </Link>
            <Link
              href="/hora"
              className="px-4 py-2 rounded-lg bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-white/10 text-text-primary hover:border-gold-primary/40 hover:text-gold-light transition-all text-sm"
            >
              Hora
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
