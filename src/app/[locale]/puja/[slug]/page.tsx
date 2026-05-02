'use client';

import { useState, useMemo, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { useLocale } from 'next-intl';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import Link from 'next/link';
import { getPujaVidhiBySlug } from '@/lib/constants/puja-vidhi';
import MantraCard from '@/components/puja/MantraCard';
import HeroCard from '@/components/puja/HeroCard';
import PujaMode from '@/components/puja/PujaMode';
import SamagriList from '@/components/puja/SamagriList';
import SankalpaDisplay from '@/components/puja/SankalpaDisplay';
import ParanaDisplay from '@/components/puja/ParanaDisplay';
import EkadashiParanaCard from '@/components/puja/EkadashiParanaCard';
import { computePujaMuhurta } from '@/lib/puja/muhurta-compute';
import GoldDivider from '@/components/ui/GoldDivider';
import { useLocationStore } from '@/stores/location-store';
import { generateFestivalCalendarV2 } from '@/lib/calendar/festival-generator';
import type { Locale } from '@/types/panchang';
import { isDevanagariLocale } from '@/lib/utils/locale-fonts';
import { tl } from '@/lib/utils/trilingual';
import VratFollowButton from '@/components/vrat/VratFollowButton';
import { TRACKABLE_VRATS } from '@/lib/vrat/trackable-vrats';
import { getVratKathaByFestivalSlug } from '@/lib/content/vrat-kathas';
import { BookOpen } from 'lucide-react';

type DisplayMode = 'devanagari' | 'iast' | 'both';

const LABELS = {
  en: {
    samagri: 'Materials',
    samagriSa: 'Samagri',
    ready: 'items ready',
    sankalpa: 'Sankalpa',
    sankalpaSa: 'Resolution',
    vidhi: 'Procedure',
    vidhiSa: 'Puja Vidhi',
    mantras: 'Mantras',
    mantrasSa: 'Mantras',
    stotras: 'Stotras',
    stotrasSa: 'Hymns',
    aarti: 'Aarti',
    aartiSa: 'Aarti',
    naivedya: 'Naivedya',
    naivedyaSa: 'Food Offering',
    precautions: 'Precautions',
    precautionsSa: 'Do\'s & Don\'ts',
    phala: 'Benefits',
    phalaSa: 'Phala',
    visarjan: 'Visarjan',
    visarjanSa: 'Closing Ritual',
    muhurta: 'நேரம்',
    festival: 'Festival',
    vrat: 'Vrat',
    verses: 'verses',
    comingSoon: 'Puja Vidhi coming soon',
    comingSoonDesc: 'This puja vidhi is being prepared. Please check back later.',
    backToPuja: 'Back to Puja Vidhi',
    devanagari: 'Devanagari',
    iast: 'IAST',
    both: 'Both',
  },
  hi: {
    samagri: 'सामग्री',
    samagriSa: 'Materials',
    ready: 'तैयार',
    sankalpa: 'सङ्कल्प',
    sankalpaSa: 'Resolution',
    vidhi: 'पूजा विधि',
    vidhiSa: 'Procedure',
    mantras: 'मन्त्र',
    mantrasSa: 'Mantras',
    stotras: 'स्तोत्र',
    stotrasSa: 'Hymns',
    aarti: 'आरती',
    aartiSa: 'Aarti',
    naivedya: 'नैवेद्य',
    naivedyaSa: 'Food Offering',
    precautions: 'सावधानियाँ',
    precautionsSa: 'Do\'s & Don\'ts',
    phala: 'फल',
    phalaSa: 'Benefits',
    visarjan: 'विसर्जन',
    visarjanSa: 'Closing Ritual',
    muhurta: 'समय',
    festival: 'त्योहार',
    vrat: 'व्रत',
    verses: 'श्लोक',
    comingSoon: 'पूजा विधि शीघ्र आ रही है',
    comingSoonDesc: 'यह पूजा विधि तैयार की जा रही है। कृपया बाद में देखें।',
    backToPuja: 'पूजा विधि पर वापस',
    devanagari: 'देवनागरी',
    iast: 'IAST',
    both: 'दोनों',
  },
  sa: {
    samagri: 'सामग्री',
    samagriSa: 'Materials',
    ready: 'सज्जम्',
    sankalpa: 'सङ्कल्पः',
    sankalpaSa: 'Resolution',
    vidhi: 'पूजाविधिः',
    vidhiSa: 'Procedure',
    mantras: 'मन्त्राः',
    mantrasSa: 'Mantras',
    stotras: 'स्तोत्राणि',
    stotrasSa: 'Hymns',
    aarti: 'आरती',
    aartiSa: 'Aarti',
    naivedya: 'नैवेद्यम्',
    naivedyaSa: 'Food Offering',
    precautions: 'सावधानताः',
    precautionsSa: 'Do\'s & Don\'ts',
    phala: 'फलम्',
    phalaSa: 'Benefits',
    visarjan: 'विसर्जनम्',
    visarjanSa: 'Closing Ritual',
    muhurta: 'समयः',
    festival: 'उत्सवः',
    vrat: 'व्रतम्',
    verses: 'श्लोकाः',
    comingSoon: 'पूजाविधिः शीघ्रम् आगच्छति',
    comingSoonDesc: 'इयं पूजाविधिः सज्जीक्रियते। कृपया पश्चात् पश्यतु।',
    backToPuja: 'पूजाविधिं प्रति',
    devanagari: 'देवनागरी',
    iast: 'IAST',
    both: 'उभयम्',
  },
  ta: {
    samagri: 'சாமக்ரி',
    samagriSa: 'Materials',
    ready: 'தயார்',
    sankalpa: 'சங்கல்பம்',
    sankalpaSa: 'Resolution',
    vidhi: 'பூஜை விதி',
    vidhiSa: 'Procedure',
    mantras: 'மந்திரங்கள்',
    mantrasSa: 'Mantras',
    stotras: 'ஸ்தோத்திரங்கள்',
    stotrasSa: 'Hymns',
    aarti: 'ஆரத்தி',
    aartiSa: 'Aarti',
    naivedya: 'நைவேத்யம்',
    naivedyaSa: 'Food Offering',
    precautions: 'எச்சரிக்கைகள்',
    precautionsSa: 'Do\'s & Don\'ts',
    phala: 'பலன்',
    phalaSa: 'Benefits',
    visarjan: 'விசர்ஜனம்',
    visarjanSa: 'Closing Ritual',
    muhurta: 'நேரம்',
    festival: 'பண்டிகை',
    vrat: 'விரதம்',
    verses: 'சுலோகங்கள்',
    comingSoon: 'பூஜை விதி விரைவில் வரும்',
    comingSoonDesc: 'இந்த பூஜை விதி தயாரிக்கப்படுகிறது. பின்னர் பார்க்கவும்.',
    backToPuja: 'பூஜை விதிக்குத் திரும்பு',
    devanagari: 'Devanagari',
    iast: 'IAST',
    both: 'Both',
  },
  te: {
    samagri: 'సామగ్రి', samagriSa: 'Materials', ready: 'సిద్ధం',
    sankalpa: 'సంకల్పం', sankalpaSa: 'Resolution',
    vidhi: 'పూజా విధి', vidhiSa: 'Procedure',
    mantras: 'మంత్రాలు', mantrasSa: 'Mantras',
    stotras: 'స్తోత్రాలు', stotrasSa: 'Hymns',
    aarti: 'ఆరతి', aartiSa: 'Aarti',
    naivedya: 'నైవేద్యం', naivedyaSa: 'Food Offering',
    precautions: 'జాగ్రత్తలు', precautionsSa: "Do's & Don'ts",
    phala: 'ఫలం', phalaSa: 'Benefits',
    visarjan: 'విసర్జన', visarjanSa: 'Closing Ritual',
    muhurta: 'సమయం', festival: 'పండుగ', vrat: 'వ్రతం',
    verses: 'శ్లోకాలు',
    comingSoon: 'పూజా విధి త్వరలో వస్తుంది',
    comingSoonDesc: 'ఈ పూజా విధి తయారవుతోంది. దయచేసి తర్వాత చూడండి.',
    backToPuja: 'పూజా విధికి తిరిగి',
    devanagari: 'Devanagari', iast: 'IAST', both: 'Both',
  },
  bn: {
    samagri: 'সামগ্রী', samagriSa: 'Materials', ready: 'প্রস্তুত',
    sankalpa: 'সংকল্প', sankalpaSa: 'Resolution',
    vidhi: 'পূজা বিধি', vidhiSa: 'Procedure',
    mantras: 'মন্ত্র', mantrasSa: 'Mantras',
    stotras: 'স্তোত্র', stotrasSa: 'Hymns',
    aarti: 'আরতি', aartiSa: 'Aarti',
    naivedya: 'নৈবেদ্য', naivedyaSa: 'Food Offering',
    precautions: 'সাবধানতা', precautionsSa: "Do's & Don'ts",
    phala: 'ফল', phalaSa: 'Benefits',
    visarjan: 'বিসর্জন', visarjanSa: 'Closing Ritual',
    muhurta: 'সময়', festival: 'উৎসব', vrat: 'ব্রত',
    verses: 'শ্লোক',
    comingSoon: 'পূজা বিধি শীঘ্রই আসছে',
    comingSoonDesc: 'এই পূজা বিধি প্রস্তুত করা হচ্ছে। পরে দেখুন।',
    backToPuja: 'পূজা বিধিতে ফিরুন',
    devanagari: 'Devanagari', iast: 'IAST', both: 'Both',
  },
  kn: {
    samagri: 'ಸಾಮಗ್ರಿ', samagriSa: 'Materials', ready: 'ಸಿದ್ಧ',
    sankalpa: 'ಸಂಕಲ್ಪ', sankalpaSa: 'Resolution',
    vidhi: 'ಪೂಜಾ ವಿಧಿ', vidhiSa: 'Procedure',
    mantras: 'ಮಂತ್ರಗಳು', mantrasSa: 'Mantras',
    stotras: 'ಸ್ತೋತ್ರಗಳು', stotrasSa: 'Hymns',
    aarti: 'ಆರತಿ', aartiSa: 'Aarti',
    naivedya: 'ನೈವೇದ್ಯ', naivedyaSa: 'Food Offering',
    precautions: 'ಎಚ್ಚರಿಕೆಗಳು', precautionsSa: "Do's & Don'ts",
    phala: 'ಫಲ', phalaSa: 'Benefits',
    visarjan: 'ವಿಸರ್ಜನ', visarjanSa: 'Closing Ritual',
    muhurta: 'ಸಮಯ', festival: 'ಹಬ್ಬ', vrat: 'ವ್ರತ',
    verses: 'ಶ್ಲೋಕಗಳು',
    comingSoon: 'ಪೂಜಾ ವಿಧಿ ಶೀಘ್ರದಲ್ಲೇ ಬರಲಿದೆ',
    comingSoonDesc: 'ಈ ಪೂಜಾ ವಿಧಿ ಸಿದ್ಧಪಡಿಸಲಾಗುತ್ತಿದೆ. ದಯವಿಟ್ಟು ನಂತರ ನೋಡಿ.',
    backToPuja: 'ಪೂಜಾ ವಿಧಿಗೆ ಹಿಂತಿರುಗಿ',
    devanagari: 'Devanagari', iast: 'IAST', both: 'Both',
  },
  mr: {
    samagri: 'सामग्री', samagriSa: 'Materials', ready: 'तयार',
    sankalpa: 'संकल्प', sankalpaSa: 'Resolution',
    vidhi: 'पूजा विधी', vidhiSa: 'Procedure',
    mantras: 'मंत्र', mantrasSa: 'Mantras',
    stotras: 'स्तोत्र', stotrasSa: 'Hymns',
    aarti: 'आरती', aartiSa: 'Aarti',
    naivedya: 'नैवेद्य', naivedyaSa: 'Food Offering',
    precautions: 'सावधानता', precautionsSa: "Do's & Don'ts",
    phala: 'फळ', phalaSa: 'Benefits',
    visarjan: 'विसर्जन', visarjanSa: 'Closing Ritual',
    muhurta: 'वेळ', festival: 'सण', vrat: 'व्रत',
    verses: 'श्लोक',
    comingSoon: 'पूजा विधी लवकरच येत आहे',
    comingSoonDesc: 'ही पूजा विधी तयार केली जात आहे. कृपया नंतर पहा.',
    backToPuja: 'पूजा विधीवर परत',
    devanagari: 'देवनागरी', iast: 'IAST', both: 'दोन्ही',
  },
  gu: {
    samagri: 'સામગ્રી', samagriSa: 'Materials', ready: 'તૈયાર',
    sankalpa: 'સંકલ્પ', sankalpaSa: 'Resolution',
    vidhi: 'પૂજા વિધિ', vidhiSa: 'Procedure',
    mantras: 'મંત્રો', mantrasSa: 'Mantras',
    stotras: 'સ્તોત્ર', stotrasSa: 'Hymns',
    aarti: 'આરતી', aartiSa: 'Aarti',
    naivedya: 'નૈવેદ્ય', naivedyaSa: 'Food Offering',
    precautions: 'સાવચેતીઓ', precautionsSa: "Do's & Don'ts",
    phala: 'ફળ', phalaSa: 'Benefits',
    visarjan: 'વિસર્જન', visarjanSa: 'Closing Ritual',
    muhurta: 'સમય', festival: 'તહેવાર', vrat: 'વ્રત',
    verses: 'શ્લોક',
    comingSoon: 'પૂજા વિધિ ટૂંક સમયમાં આવશે',
    comingSoonDesc: 'આ પૂજા વિધિ તૈયાર કરવામાં આવી રહી છે. કૃપા કરીને પછી જુઓ.',
    backToPuja: 'પૂજા વિધિ પર પાછા',
    devanagari: 'Devanagari', iast: 'IAST', both: 'Both',
  },
  mai: {
    samagri: 'सामग्री', samagriSa: 'Materials', ready: 'तैयार',
    sankalpa: 'संकल्प', sankalpaSa: 'Resolution',
    vidhi: 'पूजा विधि', vidhiSa: 'Procedure',
    mantras: 'मंत्र', mantrasSa: 'Mantras',
    stotras: 'स्तोत्र', stotrasSa: 'Hymns',
    aarti: 'आरती', aartiSa: 'Aarti',
    naivedya: 'नैवेद्य', naivedyaSa: 'Food Offering',
    precautions: 'सावधानी', precautionsSa: "Do's & Don'ts",
    phala: 'फल', phalaSa: 'Benefits',
    visarjan: 'विसर्जन', visarjanSa: 'Closing Ritual',
    muhurta: 'समय', festival: 'पर्व', vrat: 'व्रत',
    verses: 'श्लोक',
    comingSoon: 'पूजा विधि शीघ्र आबि रहल अछि',
    comingSoonDesc: 'ई पूजा विधि तैयार कएल जा रहल अछि। कृपया बादमे देखू.',
    backToPuja: 'पूजा विधि पर वापस',
    devanagari: 'देवनागरी', iast: 'IAST', both: 'दुनू',
  },
} as Record<string, Record<string, string>>;

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, ease: 'easeOut' as const },
};

function SectionAccordion({
  title,
  subtitle,
  defaultOpen = false,
  children,
  accentColor,
}: {
  title: string;
  subtitle?: string;
  defaultOpen?: boolean;
  children: React.ReactNode;
  accentColor?: string;
}) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <motion.div {...fadeInUp} className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full text-left p-5 flex items-center gap-3 hover:bg-gold-primary/5 transition-colors"
      >
        <div className="flex-1 min-w-0">
          <h2
            className={`text-lg font-bold ${accentColor || 'text-gold-light'}`}
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            {title}
          </h2>
          {subtitle && (
            <span className="text-text-secondary/70 text-xs">{subtitle}</span>
          )}
        </div>
        <ChevronDown
          className={`w-5 h-5 text-text-secondary/70 transition-transform flex-shrink-0 ${open ? 'rotate-180' : ''}`}
        />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: 'easeOut' as const }}
            className="overflow-hidden"
          >
            <div className="px-5 pb-5 pt-0 border-t border-gold-primary/5">
              <div className="pt-4">{children}</div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function PujaVidhiPage() {
  const locale = useLocale() as Locale;
  const params = useParams();
  const slug = params.slug as string;
  const isTamil = String(locale) === 'ta';
  const l = (LABELS as Record<string, Record<string, string>>)[locale] || LABELS.en;
  const isDevanagari = isDevanagariLocale(locale);
  const headingFont = isDevanagari
    ? { fontFamily: 'var(--font-devanagari-heading)' }
    : { fontFamily: 'var(--font-heading)' };

  const puja = useMemo(() => getPujaVidhiBySlug(slug), [slug]);

  // Location store
  const locationStore = useLocationStore();

  useEffect(() => {
    if (!locationStore.confirmed && !locationStore.detecting) {
      locationStore.detect();
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const userLat = locationStore.lat;
  const userLng = locationStore.lng;
  const userLocationName = locationStore.name || '';
  const userTimezone = locationStore.timezone || Intl.DateTimeFormat().resolvedOptions().timeZone;

  const timezoneOffset = useMemo(() => {
    try {
      const now = new Date();
      const utcDate = new Date(now.toLocaleString('en-US', { timeZone: 'UTC' }));
      const localDate = new Date(now.toLocaleString('en-US', { timeZone: userTimezone }));
      return (localDate.getTime() - utcDate.getTime()) / (1000 * 60 * 60);
    } catch {
      return new Date().getTimezoneOffset() / -60;
    }
  }, [userTimezone]);

  const [clientDate] = useState(() => new Date()); // Stable date for hydration
  const [pujaMode, setPujaMode] = useState(false);
  const [quickMode, setQuickMode] = useState(false);
  const [displayMode, setDisplayMode] = useState<DisplayMode>('both');
  const [expandedSteps, setExpandedSteps] = useState<Set<number>>(
    () => new Set(puja?.vidhiSteps.map(s => s.step) ?? [])
  );

  // Mantra map for step references
  const mantraMap = useMemo(() => {
    if (!puja) return new Map();
    const m = new Map();
    for (const mantra of puja.mantras) {
      m.set(mantra.id, mantra);
    }
    return m;
  }, [puja]);

  // Compute the next festival date for this puja (MUST be before computedMuhurta)
  const festivalDate = useMemo(() => {
    if (!puja || !userLat || !userLng) return undefined;
    // Skip graha_shanti — those are done on demand, not on a fixed date
    if (puja.category === 'graha_shanti') return undefined;

    // Weekly vrats: compute next occurrence of that weekday
    const weeklyVrats: Record<string, number> = {
      'somvar-vrat': 1,    // Monday
      'mangalvar-vrat': 2, // Tuesday
    };
    const weekday = weeklyVrats[puja.festivalSlug];
    if (weekday !== undefined) {
      const now = new Date();
      const today = now.getDay(); // 0=Sun, 1=Mon, ...
      const daysUntil = (weekday - today + 7) % 7 || 7; // next occurrence (not today)
      const next = new Date(now);
      next.setDate(next.getDate() + daysUntil);
      return next;
    }

    try {
      const now = new Date();
      const todayStr = `${now.getFullYear()}-${(now.getMonth() + 1).toString().padStart(2, '0')}-${now.getDate().toString().padStart(2, '0')}`;
      const year = now.getFullYear();

      // Map puja festivalSlug to the slug used in festival-generator output
      // Most match directly; some monthly vrats have different slug patterns
      const slugMap: Record<string, string> = {
        'sankashti-chaturthi': 'chaturthi',
        'amavasya-tarpan': 'amavasya',
        'purnima-vrat': 'purnima',
        'masik-shivaratri': 'masik-shivaratri',
        'satyanarayan': 'purnima', // Satyanarayan Puja is done on Purnima
        'vat-savitri': 'vat-savitri-vrat',
      };
      const lookupSlug = slugMap[puja.festivalSlug] || puja.festivalSlug;

      // Generate current year's festivals
      const festivals = generateFestivalCalendarV2(year, userLat, userLng, userTimezone);
      // Find the next occurrence on or after today
      let match = festivals.find(f => f.slug === lookupSlug && f.date >= todayStr);

      // If not found in current year, try next year
      if (!match) {
        const nextYearFestivals = generateFestivalCalendarV2(year + 1, userLat, userLng, userTimezone);
        match = nextYearFestivals.find(f => f.slug === lookupSlug && f.date >= todayStr);
      }

      if (match) {
        const [y, m, d] = match.date.split('-').map(Number);
        return new Date(y, m - 1, d);
      }
    } catch {
      // Fail silently — date is optional
    }
    return undefined;
  }, [puja, userLat, userLng, userTimezone]);

  // Compute muhurta for the ACTUAL festival date, not today
  const computedMuhurta = useMemo(() => {
    if (puja?.muhurtaType !== 'computed' || !puja.muhurtaWindow) return undefined;
    if (!userLat || !userLng || !festivalDate) return undefined;
    try {
      return computePujaMuhurta(
        puja.muhurtaWindow.type,
        festivalDate.getFullYear(), festivalDate.getMonth() + 1, festivalDate.getDate(),
        userLat, userLng, timezoneOffset
      );
    } catch { return undefined; }
  }, [puja, userLat, userLng, timezoneOffset, festivalDate]);

  // Ekadashi parana data from the festival calendar
  const ekadashiParana = useMemo(() => {
    if (!puja || !userLat || !userLng) return null;
    if (!puja.festivalSlug.includes('ekadashi')) return null;
    try {
      const now = new Date();
      const todayStr = `${now.getFullYear()}-${(now.getMonth() + 1).toString().padStart(2, '0')}-${now.getDate().toString().padStart(2, '0')}`;
      const year = now.getFullYear();
      const festivals = generateFestivalCalendarV2(year, userLat, userLng, userTimezone);
      // Find next upcoming ekadashi (any ekadashi) on or after today
      let entry = festivals.find(f => f.slug?.includes('ekadashi') && f.date >= todayStr && f.paranaStart);
      if (!entry) {
        const nextYear = generateFestivalCalendarV2(year + 1, userLat, userLng, userTimezone);
        entry = nextYear.find(f => f.slug?.includes('ekadashi') && f.paranaStart);
      }
      if (entry?.paranaStart && entry.paranaSunrise && entry.paranaHariVasaraEnd && entry.paranaDwadashiEnd && entry.paranaMadhyahnaStart && entry.paranaMadhyahnaEnd) {
        return entry;
      }
    } catch (err) {
      console.error('[puja] Failed to compute parana data:', err);
    }
    return null;
  }, [puja, userLat, userLng, userTimezone]);

  if (!puja) {
    return (
      <main className="min-h-screen pt-28 pb-16 px-4">
        <div className="max-w-2xl mx-auto text-center">
          <motion.div {...fadeInUp} className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-10">
            <h1
              className="text-2xl font-bold text-gold-light mb-4"
              style={headingFont}
            >
              {l.comingSoon}
            </h1>
            <p className="text-text-secondary mb-6">{l.comingSoonDesc}</p>
            <Link
              href={`/${locale}/puja`}
              className="inline-block px-6 py-2.5 rounded-lg bg-gold-primary/15 text-gold-primary border border-gold-primary/25 hover:bg-gold-primary/25 transition-colors font-medium"
            >
              {l.backToPuja}
            </Link>
          </motion.div>
        </div>
      </main>
    );
  }

  const toggleStep = (step: number) => {
    setExpandedSteps((prev) => {
      const next = new Set(prev);
      if (next.has(step)) next.delete(step);
      else next.add(step);
      return next;
    });
  };

  return (
    <main className="min-h-screen pt-28 pb-16 px-4">
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Header */}
        <HeroCard
          puja={puja}
          locale={locale}
          computedMuhurta={computedMuhurta}
          festivalDate={festivalDate}
          locationName={userLocationName}
          timezone={userTimezone}
        />

        {/* Follow button for trackable vrats */}
        {(() => {
          const trackable = TRACKABLE_VRATS.find(v => v.calendarSlug === slug || v.slug === slug);
          if (!trackable) return null;
          return (
            <div className="flex justify-center">
              <VratFollowButton slug={trackable.slug} name={tl(trackable.name, 'en')} size="md" />
            </div>
          );
        })()}

        {/* Parana display for vrats */}
        {ekadashiParana ? (
          <EkadashiParanaCard
            paranaDate={ekadashiParana.paranaDate!}
            paranaStart={ekadashiParana.paranaStart!}
            paranaEnd={ekadashiParana.paranaEnd!}
            paranaSunrise={ekadashiParana.paranaSunrise!}
            paranaHariVasaraEnd={ekadashiParana.paranaHariVasaraEnd!}
            paranaDwadashiEnd={ekadashiParana.paranaDwadashiEnd!}
            paranaMadhyahnaStart={ekadashiParana.paranaMadhyahnaStart!}
            paranaMadhyahnaEnd={ekadashiParana.paranaMadhyahnaEnd!}
            paranaEarlyEnd={ekadashiParana.paranaEarlyEnd}
            ekadashiStart={ekadashiParana.ekadashiStart}
            ekadashiStartDate={ekadashiParana.ekadashiStartDate}
            ekadashiEnd={ekadashiParana.ekadashiEnd}
            ekadashiEndDate={ekadashiParana.ekadashiEndDate}
            dwadashiEndTime={ekadashiParana.dwadashiEndTime}
            dwadashiEndDate={ekadashiParana.dwadashiEndDate}
            locale={locale}
          />
        ) : puja.parana && userLat && userLng ? (
          <ParanaDisplay
            parana={puja.parana}
            vratDate={clientDate}
            lat={userLat}
            lng={userLng}
            timezoneOffset={timezoneOffset}
            locationName={userLocationName}
            timezone={userTimezone}
            locale={locale}
          />
        ) : null}

        {/* Start Puja buttons */}
        <motion.div {...fadeInUp} className="flex flex-col sm:flex-row items-center gap-3">
          <button
            onClick={() => { setQuickMode(false); setPujaMode(true); }}
            className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-gradient-to-r from-gold-primary/80 to-gold-primary text-[#0a0e27] font-bold text-sm hover:from-gold-primary hover:to-gold-light transition-all shadow-lg shadow-gold-primary/20"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            {tl({ en: 'Start Full Puja', hi: 'पूर्ण पूजा आरम्भ करें', sa: 'पूर्णां पूजां आरभतु', ta: 'முழு பூஜையை தொடங்குங்கள்', te: 'పూర్తి పూజ ప్రారంభించండి', bn: 'সম্পূর্ণ পূজা শুরু করুন', kn: 'ಪೂರ್ಣ ಪೂಜೆ ಪ್ರಾರಂಭಿಸಿ', gu: 'સંપૂર્ણ પૂજા શરૂ કરો', mai: 'पूर्ण पूजा शुरू करू', mr: 'पूर्ण पूजा सुरू करा' }, locale)}
          </button>
          <button
            onClick={() => { setQuickMode(true); setPujaMode(true); }}
            className="w-full sm:w-auto px-8 py-3.5 rounded-xl border border-gold-primary/25 text-gold-primary font-bold text-sm hover:bg-gold-primary/10 transition-all"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            {tl({ en: 'Quick Mode (~15 min)', hi: 'संक्षिप्त (~15 मिनट)', sa: 'लघु-विधा (~15 मिनिटम्)', ta: 'விரைவு முறை (~15 நிமிடம்)', te: 'త్వరిత మోడ్ (~15 నిమిషాలు)', bn: 'দ্রুত মোড (~15 মিনিট)', kn: 'ತ್ವರಿತ ಮೋಡ್ (~15 ನಿಮಿಷ)', gu: 'ઝડપી મોડ (~15 મિનિટ)', mai: 'संक्षिप्त विधि (~15 मिनट)', mr: 'जलद मोड (~15 मिनिटे)' }, locale)}
          </button>
        </motion.div>

        {/* Quick links: Calendar + Sankalpa */}
        <motion.div {...fadeInUp} className="flex flex-wrap items-center justify-center gap-3">
          {puja.festivalSlug && (
            <Link
              href={`/${locale}/calendar/${puja.festivalSlug}`}
              className="inline-flex items-center gap-2 px-5 py-2 rounded-lg border border-gold-primary/15 text-gold-primary/80 text-sm hover:text-gold-light hover:bg-gold-primary/5 transition-colors"
            >
              {tl({ en: 'View dates in Calendar', hi: 'कैलेंडर में तिथियाँ देखें', sa: 'पञ्चाङ्गे दिनाङ्कान् पश्यतु', ta: 'காலெண்டரில் தேதிகளை காண்க', te: 'క్యాలెండర్‌లో తేదీలు చూడండి', bn: 'ক্যালেন্ডারে তারিখগুলি দেখুন', kn: 'ಕ್ಯಾಲೆಂಡರ್‌ನಲ್ಲಿ ದಿನಾಂಕಗಳನ್ನು ನೋಡಿ', gu: 'કૅલેન્ડરમાં તારીખો જુઓ', mai: 'कैलेंडरमे तिथि देखू', mr: 'कॅलेंडरमध्ये तारखा पाहा' }, locale)} &rarr;
            </Link>
          )}
          <Link
            href={`/${locale}/sankalpa?puja=${encodeURIComponent(tl(puja.deity, locale))}`}
            className="inline-flex items-center gap-2 px-5 py-2 rounded-lg border border-amber-500/20 bg-amber-500/5 text-amber-400 text-sm hover:bg-amber-500/10 transition-colors"
          >
            {tl({ en: 'Generate Sankalpa', hi: 'सङ्कल्प बनाएं', sa: 'सङ्कल्पं रचयतु', ta: 'சங்கல்பம் உருவாக்கு', te: 'సంకల్పం రూపొందించండి', bn: 'সংকল্প তৈরি করুন', kn: 'ಸಂಕಲ್ಪ ರಚಿಸಿ', gu: 'સંકલ્પ બનાવો', mai: 'सङ्कल्प बनाउ', mr: 'संकल्प तयार करा' }, locale)} &rarr;
          </Link>
        </motion.div>

        <GoldDivider />

        {/* 1. Samagri Section */}
        <SectionAccordion
          title={l.samagri}
          subtitle={l.samagriSa}
          defaultOpen
        >
          <SamagriList items={puja.samagri} slug={slug} locale={locale} />
        </SectionAccordion>

        {/* 2. Sankalpa Section */}
        <SectionAccordion
          title={l.sankalpa}
          subtitle={l.sankalpaSa}
          defaultOpen
        >
          {userLat && userLng ? (
            <SankalpaDisplay
              puja={puja}
              locale={locale}
              date={clientDate}
              lat={userLat}
              lng={userLng}
              timezoneOffset={timezoneOffset}
            />
          ) : (
            <p className="text-text-secondary/70 text-sm">
              {tl({ en: 'Detecting your location...', hi: 'आपका स्थान खोज रहे हैं...', sa: 'भवतः स्थानं निर्धारयति...', ta: 'உங்கள் இடத்தை கண்டறிகிறது...', te: 'మీ స్థానాన్ని గుర్తిస్తోంది...', bn: 'আপনার অবস্থান সনাক্ত করা হচ্ছে...', kn: 'ನಿಮ್ಮ ಸ್ಥಳ ಪತ್ತೆ ಮಾಡಲಾಗುತ್ತಿದೆ...', gu: 'તમારું સ્થળ શોધાઈ રહ્યું છે...', mai: 'अहाँक स्थान खोजि रहल अछि...', mr: 'तुमचे स्थान शोधत आहे...' }, locale)}
            </p>
          )}
        </SectionAccordion>

        {/* 3. Puja Vidhi Section */}
        <SectionAccordion
          title={l.vidhi}
          subtitle={l.vidhiSa}
          defaultOpen
        >
          <div className="space-y-3">
            {puja.vidhiSteps.map((step) => {
              const isOpen = expandedSteps.has(step.step);
              const linkedMantra = step.mantraRef ? mantraMap.get(step.mantraRef) : null;
              return (
                <div
                  key={step.step}
                  className="rounded-lg border border-gold-primary/10 overflow-hidden"
                >
                  <button
                    onClick={() => toggleStep(step.step)}
                    className="w-full text-left p-4 flex items-center gap-3 hover:bg-gold-primary/5 transition-colors"
                  >
                    <span className="w-8 h-8 rounded-full bg-gradient-to-br from-gold-primary/30 to-gold-primary/10 flex items-center justify-center text-gold-primary text-sm font-bold flex-shrink-0 border border-gold-primary/20">
                      {step.step}
                    </span>
                    <div className="flex-1 min-w-0">
                      <span
                        className="text-gold-light font-semibold text-sm"
                        style={isDevanagari ? { fontFamily: 'var(--font-devanagari-heading)' } : undefined}
                      >
                        {step.title[locale]}
                      </span>
                      {step.duration && (
                        <span className="text-text-secondary/65 text-xs ml-2">({step.duration})</span>
                      )}
                    </div>
                    <ChevronDown
                      className={`w-4 h-4 text-text-secondary/65 transition-transform flex-shrink-0 ${isOpen ? 'rotate-180' : ''}`}
                    />
                  </button>
                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2, ease: 'easeOut' as const }}
                        className="overflow-hidden"
                      >
                        <div className="px-4 pb-4 ml-11 border-t border-gold-primary/5 pt-3 space-y-3">
                          <p
                            className="text-text-secondary text-sm leading-relaxed"
                            style={isDevanagari ? { fontFamily: 'var(--font-devanagari-body)' } : undefined}
                          >
                            {step.description[locale]}
                          </p>
                          {linkedMantra && (
                            <div className="mt-3">
                              <MantraCard
                                mantra={linkedMantra}
                                displayMode={displayMode}
                                showMeaning
                                showJapaCount
                                locale={locale}
                              />
                            </div>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </SectionAccordion>

        {/* 4. Mantras Section */}
        <SectionAccordion
          title={l.mantras}
          subtitle={l.mantrasSa}
        >
          {/* Display mode toggle */}
          <div className="flex items-center gap-1 mb-4 bg-gold-primary/5 rounded-lg p-1 w-fit border border-gold-primary/10">
            {(['devanagari', 'iast', 'both'] as DisplayMode[]).map((mode) => (
              <button
                key={mode}
                onClick={() => setDisplayMode(mode)}
                className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                  displayMode === mode
                    ? 'bg-gold-primary/20 text-gold-primary border border-gold-primary/25'
                    : 'text-text-secondary/75 hover:text-text-secondary border border-transparent'
                }`}
              >
                {l[mode]}
              </button>
            ))}
          </div>
          <div className="grid grid-cols-1 gap-4">
            {puja.mantras.map((mantra) => (
              <MantraCard
                key={mantra.id}
                mantra={mantra}
                displayMode={displayMode}
                showMeaning
                showJapaCount
                locale={locale}
              />
            ))}
          </div>
        </SectionAccordion>

        {/* 5. Stotras Section */}
        {puja.stotras && puja.stotras.length > 0 && (
          <SectionAccordion
            title={l.stotras}
            subtitle={l.stotrasSa}
          >
            <div className="space-y-3">
              {puja.stotras.map((stotra, idx) => (
                <div
                  key={idx}
                  className="rounded-lg border border-gold-primary/10 p-4 bg-gold-primary/[0.02]"
                >
                  <h3
                    className="text-gold-light font-semibold text-sm mb-1"
                    style={isDevanagari ? { fontFamily: 'var(--font-devanagari-heading)' } : undefined}
                  >
                    {stotra.name[locale]}
                    {locale !== 'en' && (
                      <span className="text-text-secondary/65 text-xs ml-2 font-normal">
                        ({stotra.name.en})
                      </span>
                    )}
                  </h3>
                  <div className="flex items-center gap-3 text-xs text-text-secondary/70 mb-2">
                    {stotra.verseCount && (
                      <span>
                        {stotra.verseCount} {l.verses}
                      </span>
                    )}
                    {stotra.duration && <span>{stotra.duration}</span>}
                  </div>
                  {stotra.note && (
                    <p className="text-text-secondary/75 text-xs">{stotra.note[locale]}</p>
                  )}
                  {stotra.text && (
                    <div className="mt-3 p-3 rounded-md bg-gold-primary/[0.03] border border-gold-primary/8">
                      <p
                        className="text-gold-light/80 text-base leading-relaxed whitespace-pre-line"
                        style={{ fontFamily: 'var(--font-devanagari-heading)' }}
                      >
                        {stotra.text}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </SectionAccordion>
        )}

        {/* 6. Aarti Section */}
        {puja.aarti && (
          <SectionAccordion
            title={l.aarti}
            subtitle={l.aartiSa}
          >
            <div className="mb-3">
              <h3
                className="text-gold-light font-semibold text-base mb-3"
                style={isDevanagari ? { fontFamily: 'var(--font-devanagari-heading)' } : undefined}
              >
                {puja.aarti.name[locale]}
              </h3>
              {/* Display mode toggle */}
              <div className="flex items-center gap-1 mb-4 bg-gold-primary/5 rounded-lg p-1 w-fit border border-gold-primary/10">
                {(['devanagari', 'iast', 'both'] as DisplayMode[]).map((mode) => (
                  <button
                    key={mode}
                    onClick={() => setDisplayMode(mode)}
                    className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                      displayMode === mode
                        ? 'bg-gold-primary/20 text-gold-primary border border-gold-primary/25'
                        : 'text-text-secondary/75 hover:text-text-secondary border border-transparent'
                    }`}
                  >
                    {l[mode]}
                  </button>
                ))}
              </div>
            </div>
            <div className="rounded-lg border border-gold-primary/10 p-5 bg-gold-primary/[0.02] space-y-3">
              {(displayMode === 'devanagari' || displayMode === 'both') && (
                <p
                  className="text-gold-light text-lg leading-loose whitespace-pre-line"
                  style={{ fontFamily: 'var(--font-devanagari-heading)' }}
                >
                  {puja.aarti.devanagari}
                </p>
              )}
              {displayMode === 'both' && (
                <div className="border-t border-gold-primary/10 my-3" />
              )}
              {(displayMode === 'iast' || displayMode === 'both') && (
                <p className="text-text-secondary/70 text-sm italic leading-loose whitespace-pre-line">
                  {puja.aarti.iast}
                </p>
              )}
            </div>
          </SectionAccordion>
        )}

        {/* 7. Naivedya Section */}
        <SectionAccordion
          title={l.naivedya}
          subtitle={l.naivedyaSa}
        >
          <p
            className="text-text-secondary text-sm leading-relaxed"
            style={isDevanagari ? { fontFamily: 'var(--font-devanagari-body)' } : undefined}
          >
            {puja.naivedya[locale]}
          </p>
        </SectionAccordion>

        {/* 8. Precautions Section */}
        <SectionAccordion
          title={l.precautions}
          subtitle={l.precautionsSa}
          accentColor="text-amber-400"
        >
          <ul className="space-y-2">
            {puja.precautions.map((p, idx) => (
              <li
                key={idx}
                className="flex items-start gap-3 p-3 rounded-lg border border-amber-500/10 bg-amber-500/[0.04]"
              >
                <span className="w-5 h-5 rounded-full bg-amber-500/15 flex items-center justify-center flex-shrink-0 mt-0.5 text-amber-400 text-xs font-bold border border-amber-500/20">
                  !
                </span>
                <p
                  className="text-text-secondary text-sm leading-relaxed"
                  style={isDevanagari ? { fontFamily: 'var(--font-devanagari-body)' } : undefined}
                >
                  {p[locale]}
                </p>
              </li>
            ))}
          </ul>
        </SectionAccordion>

        {/* 9. Phala Section */}
        <SectionAccordion
          title={l.phala}
          subtitle={l.phalaSa}
        >
          <div className="rounded-lg border border-emerald-500/15 bg-emerald-500/[0.04] p-4">
            <p
              className="text-emerald-300/90 text-sm leading-relaxed"
              style={isDevanagari ? { fontFamily: 'var(--font-devanagari-body)' } : undefined}
            >
              {puja.phala[locale]}
            </p>
          </div>
        </SectionAccordion>

        {/* 10. Visarjan Section */}
        {puja.visarjan && (
          <SectionAccordion
            title={l.visarjan}
            subtitle={l.visarjanSa}
          >
            <p
              className="text-text-secondary text-sm leading-relaxed"
              style={isDevanagari ? { fontFamily: 'var(--font-devanagari-body)' } : undefined}
            >
              {puja.visarjan[locale]}
            </p>
          </SectionAccordion>
        )}

        {/* Vrat Katha cross-link — if a related katha exists */}
        {(() => {
          const katha = getVratKathaByFestivalSlug(slug);
          if (!katha) return null;
          const kathaTitle = locale === 'hi' ? katha.title.hi : katha.title.en;
          return (
            <Link
              href={`/${locale}/vrat-katha/${katha.slug}`}
              className="block mt-6 p-4 rounded-xl bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/20 hover:border-gold-primary/40 transition-colors group"
            >
              <div className="flex items-center gap-3">
                <BookOpen className="w-5 h-5 text-gold-primary flex-shrink-0" />
                <div>
                  <div className="text-gold-light text-sm font-bold">{kathaTitle}</div>
                  <div className="text-text-secondary text-xs">
                    {locale === 'hi' ? 'व्रत विधि, फल और कब करें — पढ़ें' : 'Vrat vidhi, benefits & when to observe'}
                  </div>
                </div>
              </div>
            </Link>
          );
        })()}

        {/* Back link */}
        <div className="text-center pt-4">
          <Link
            href={`/${locale}/puja`}
            className="text-gold-primary/60 hover:text-gold-primary text-sm transition-colors"
          >
            {l.backToPuja}
          </Link>
        </div>
      </div>

      <AnimatePresence>
        {pujaMode && puja && (
          <PujaMode
            puja={puja}
            locale={locale}
            quickMode={quickMode}
            onClose={() => setPujaMode(false)}
          />
        )}
      </AnimatePresence>
    </main>
  );
}
