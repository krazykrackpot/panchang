'use client';

import { tl } from '@/lib/utils/trilingual';
import { useState, useEffect } from 'react';
import { useLocale } from 'next-intl';
import { useParams, useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, BookOpen, Flame, Star, AlertTriangle, Check, Copy, Clock, Sparkles, Gift, Shield } from 'lucide-react';
import Link from 'next/link';
import { FESTIVAL_DETAILS, CATEGORY_DETAILS, EKADASHI_NAMES } from '@/lib/constants/festival-details';
import type { FestivalDetail, EkadashiDetail } from '@/lib/constants/festival-details';
import { PUJA_VIDHIS } from '@/lib/constants/puja-vidhi';
import type { PujaVidhi, MantraDetail as MantraType } from '@/lib/constants/puja-vidhi/types';
import type { Locale,  LocaleText} from '@/types/panchang';
import SamagriList from '@/components/puja/SamagriList';
import PujaMode from '@/components/puja/PujaMode';
import EkadashiParanaCard from '@/components/puja/EkadashiParanaCard';
import { useLocationStore } from '@/stores/location-store';
import { isDevanagariLocale } from '@/lib/utils/locale-fonts';

/* ═══════════════════════════════════════════
   LABELS
   ═══════════════════════════════════════════ */

const LABELS = {
  back: { en: 'Back to Calendar', hi: 'कैलेंडर पर वापस', sa: 'पञ्चाङ्गं प्रति', ta: 'நாட்காட்டிக்குத் திரும்பு', te: 'క్యాలెండర్‌కు తిరిగి', bn: 'ক্যালেন্ডারে ফিরুন', kn: 'ಕ್ಯಾಲೆಂಡರ್‌ಗೆ ಹಿಂತಿರುಗಿ', mr: 'दिनदर्शिकेवर परत', gu: 'કેલેન્ડર પર પાછા', mai: 'कैलेंडर पर वापस' },
  about: { en: 'About', hi: 'परिचय', sa: 'परिचयः', ta: 'பற்றி', te: 'పరిచయం', bn: 'পরিচয়', kn: 'ಪರಿಚಯ', mr: 'परिचय', gu: 'પરિચય', mai: 'परिचय' },
  deity: { en: 'Deity', hi: 'देवता', sa: 'देवता', ta: 'தெய்வம்', te: 'దేవత', bn: 'দেবতা', kn: 'ದೇವತೆ', mr: 'देवता', gu: 'દેવતા', mai: 'देवता' },
  mythology: { en: 'Story & Origin', hi: 'कथा एवं उत्पत्ति', sa: 'कथा उत्पत्तिश्च', ta: 'கதை & தோற்றம்', te: 'కథ & మూలం', bn: 'কাহিনী ও উৎপত্তি', kn: 'ಕಥೆ & ಮೂಲ', mr: 'कथा आणि उत्पत्ती', gu: 'કથા અને ઉત્પત્તિ', mai: 'कथा आ उत्पत्ति' },
  observance: { en: 'How to Observe', hi: 'पालन विधि', sa: 'पालनविधिः', ta: 'எப்படி அனுசரிப்பது', te: 'ఎలా ఆచరించాలి', bn: 'কীভাবে পালন করবেন', kn: 'ಹೇಗೆ ಆಚರಿಸುವುದು', mr: 'कसे पाळावे', gu: 'કેવી રીતે પાળવું', mai: 'कोना पालन करी' },
  significance: { en: 'Significance', hi: 'महत्व', sa: 'महत्त्वम्', ta: 'முக்கியத்துவம்', te: 'ప్రాముఖ్యత', bn: 'গুরুত্ব', kn: 'ಮಹತ್ವ', mr: 'महत्त्व', gu: 'મહત્વ', mai: 'महत्व' },
  fasting: { en: 'Fasting Rules', hi: 'व्रत नियम', sa: 'व्रतनियमाः', ta: 'விரத விதிகள்', te: 'వ్రత నియమాలు', bn: 'ব্রত নিয়ম', kn: 'ವ್ರತ ನಿಯಮಗಳು', mr: 'व्रत नियम', gu: 'વ્રત નિયમો', mai: 'व्रत नियम' },
  pujaVidhi: { en: 'Puja Vidhi', hi: 'पूजा विधि', sa: 'पूजाविधिः', ta: 'பூஜை விதி', te: 'పూజా విధి', bn: 'পূজা বিধি', kn: 'ಪೂಜಾ ವಿಧಿ', mr: 'पूजा विधी', gu: 'પૂજા વિધિ', mai: 'पूजा विधि' },
  muhurta: { en: 'Auspicious Timing (Muhurta)', hi: 'शुभ मुहूर्त', sa: 'शुभमुहूर्तम्', ta: 'நல்ல நேரம் (முகூர்த்தம்)', te: 'శుభ ముహూర్తం', bn: 'শুভ মুহূর্ত', kn: 'ಶುಭ ಮುಹೂರ್ತ', mr: 'शुभ मुहूर्त', gu: 'શુભ મુહૂર્ત', mai: 'शुभ मुहूर्त' },
  samagri: { en: 'Materials (Samagri)', hi: 'सामग्री', sa: 'सामग्री', ta: 'சாமக்ரி (பொருட்கள்)', te: 'సామగ్రి (పదార్థాలు)', bn: 'সামগ্রী (উপকরণ)', kn: 'ಸಾಮಗ್ರಿ (ವಸ್ತುಗಳು)', mr: 'सामग्री', gu: 'સામગ્રી', mai: 'सामग्री' },
  sankalpa: { en: 'Sankalpa (Sacred Resolve)', hi: 'संकल्प', sa: 'सङ्कल्पः', ta: 'சங்கல்பம்', te: 'సంకల్పం', bn: 'সংকল্প', kn: 'ಸಂಕಲ್ಪ', mr: 'संकल्प', gu: 'સંકલ્પ', mai: 'संकल्प' },
  procedure: { en: 'Puja Steps', hi: 'पूजा विधि', sa: 'पूजाविधिः', ta: 'பூஜை படிகள்', te: 'పూజ దశలు', bn: 'পূজার ধাপ', kn: 'ಪೂಜೆ ಹಂತಗಳು', mr: 'पूजा चरण', gu: 'પૂજા પગલાં', mai: 'पूजा चरण' },
  mantras: { en: 'Mantras', hi: 'मन्त्र', sa: 'मन्त्राः', ta: 'மந்திரங்கள்', te: 'మంత్రాలు', bn: 'মন্ত্র', kn: 'ಮಂತ್ರಗಳು', mr: 'मंत्र', gu: 'મંત્રો', mai: 'मंत्र' },
  stotras: { en: 'Stotras', hi: 'स्तोत्र', sa: 'स्तोत्राणि', ta: 'ஸ்தோத்திரங்கள்', te: 'స్తోత్రాలు', bn: 'স্তোত্র', kn: 'ಸ್ತೋತ್ರಗಳು', mr: 'स्तोत्र', gu: 'સ્તોત્ર', mai: 'स्तोत्र' },
  aarti: { en: 'Aarti', hi: 'आरती', sa: 'आरतिः', ta: 'ஆரத்தி', te: 'ఆరతి', bn: 'আরতি', kn: 'ಆರತಿ', mr: 'आरती', gu: 'આરતી', mai: 'आरती' },
  naivedya: { en: 'Offering (Naivedya)', hi: 'नैवेद्य', sa: 'नैवेद्यम्', ta: 'நைவேத்யம்', te: 'నైవేద్యం', bn: 'নৈবেদ্য', kn: 'ನೈವೇದ್ಯ', mr: 'नैवेद्य', gu: 'નૈવેદ્ય', mai: 'नैवेद्य' },
  precautions: { en: 'Precautions', hi: 'सावधानियाँ', sa: 'सावधान्यानि', ta: 'எச்சரிக்கைகள்', te: 'జాగ్రత్తలు', bn: 'সাবধানতা', kn: 'ಎಚ್ಚರಿಕೆಗಳು', mr: 'सावधानता', gu: 'સાવચેતીઓ', mai: 'सावधानी' },
  phala: { en: 'Benefits (Phala)', hi: 'फल', sa: 'फलम्', ta: 'பலன்கள்', te: 'ఫలితాలు', bn: 'ফল', kn: 'ಫಲಗಳು', mr: 'फळ', gu: 'ફળ', mai: 'फल' },
  visarjan: { en: 'Visarjan (Conclusion)', hi: 'विसर्जन', sa: 'विसर्जनम्', ta: 'விசர்ஜனம்', te: 'విసర్జన', bn: 'বিসর্জন', kn: 'ವಿಸರ್ಜನ', mr: 'विसर्जन', gu: 'વિસર્જન', mai: 'विसर्जन' },
  ekadashiStory: { en: 'Legend', hi: 'कथा', sa: 'कथा', ta: 'புராணக்கதை', te: 'కథ', bn: 'কাহিনী', kn: 'ಕಥೆ', mr: 'कथा', gu: 'કથા', mai: 'कथा' },
  ekadashiBenefit: { en: 'Benefit', hi: 'फल', sa: 'फलम्', ta: 'பலன்', te: 'ఫలం', bn: 'ফল', kn: 'ಫಲ', mr: 'फळ', gu: 'ફળ', mai: 'फल' },
  notFound: { en: 'Festival details coming soon', hi: 'त्योहार विवरण शीघ्र आ रहा है', sa: 'उत्सवविवरणं शीघ्रम् आगच्छति', ta: 'பண்டிகை விவரங்கள் விரைவில் வரும்', te: 'పండుగ వివరాలు త్వరలో వస్తాయి', bn: 'উৎসবের বিবরণ শীঘ্রই আসছে', kn: 'ಹಬ್ಬದ ವಿವರಗಳು ಶೀಘ್ರದಲ್ಲೇ ಬರಲಿವೆ', mr: 'सण तपशील लवकरच येत आहे', gu: 'તહેવારની વિગતો ટૂંક સમયમાં આવશે', mai: 'पर्व विवरण शीघ्र आबि रहल अछि' },
  notFoundSub: { en: 'We are working on adding detailed information for this festival.', hi: 'हम इस त्योहार की विस्तृत जानकारी जोड़ने पर कार्य कर रहे हैं।', sa: 'अस्य उत्सवस्य विस्तृतं विवरणं योजयितुं वयं कार्यं कुर्मः।', ta: 'இந்த பண்டிகையின் விரிவான தகவல்களை சேர்க்க நாங்கள் பணியாற்றுகிறோம்.', te: 'ఈ పండుగ యొక్క వివరమైన సమాచారాన్ని జోడించడంపై పనిచేస్తున్నాము.', bn: 'আমরা এই উৎসবের বিস্তারিত তথ্য যোগ করতে কাজ করছি।', kn: 'ಈ ಹಬ್ಬದ ವಿವರವಾದ ಮಾಹಿತಿಯನ್ನು ಸೇರಿಸಲು ನಾವು ಕೆಲಸ ಮಾಡುತ್ತಿದ್ದೇವೆ.', mr: 'आम्ही या सणाची तपशीलवार माहिती जोडण्यावर काम करत आहोत.', gu: 'અમે આ તહેવારની વિગતવાર માહિતી ઉમેરવા પર કામ કરી રહ્યા છીએ.', mai: 'हम ई पर्वक विस्तृत जानकारी जोड़बाक लेल कार्य करि रहल छी.' },
  itemsSelected: { en: 'items collected', hi: 'सामग्री एकत्र', sa: 'सामग्री सङ्गृहीता', ta: 'பொருட்கள் சேகரிக்கப்பட்டன', te: 'సామగ్రి సేకరించబడింది', bn: 'উপকরণ সংগৃহীত', kn: 'ವಸ್ತುಗಳು ಸಂಗ್ರಹಿಸಲಾಗಿದೆ', mr: 'सामग्री गोळा केली', gu: 'સામગ્રી એકત્ર કરાઈ', mai: 'सामग्री एकत्र कएल गेल' },
  japaCount: { en: 'Japa Count', hi: 'जप संख्या', sa: 'जपसङ्ख्या', ta: 'ஜப எண்ணிக்கை', te: 'జప సంఖ్య', bn: 'জপ সংখ্যা', kn: 'ಜಪ ಸಂಖ್ಯೆ', mr: 'जप संख्या', gu: 'જપ સંખ્યા', mai: 'जप संख्या' },
};

const l = (tri: LocaleText, locale: Locale) => tri[locale] || tri.en;

/* ═══════════════════════════════════════════
   ANIMATION VARIANTS
   ═══════════════════════════════════════════ */

const fadeInUp = {
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, ease: 'easeOut' as const },
};

const staggerContainer = {
  animate: { transition: { staggerChildren: 0.08 } },
};

/* ═══════════════════════════════════════════
   CATEGORY BADGE COLORS
   ═══════════════════════════════════════════ */

const categoryBadgeColors: Record<string, string> = {
  festival: 'bg-amber-500/15 border-amber-500/30 text-amber-300',
  ekadashi: 'bg-blue-500/15 border-blue-500/30 text-blue-300',
  purnima: 'bg-amber-400/15 border-amber-400/30 text-amber-200',
  amavasya: 'bg-purple-500/15 border-purple-500/30 text-purple-300',
  chaturthi: 'bg-orange-500/15 border-orange-500/30 text-orange-300',
  pradosham: 'bg-indigo-500/15 border-indigo-500/30 text-indigo-300',
  sankranti: 'bg-red-500/15 border-red-500/30 text-red-300',
  vrat: 'bg-emerald-500/15 border-emerald-500/30 text-emerald-300',
};

/* ═══════════════════════════════════════════
   PAGE COMPONENT
   ═══════════════════════════════════════════ */

export default function FestivalDetailPage() {
  const locale = useLocale() as Locale;
  const params = useParams();
  const searchParams = useSearchParams();
  const slug = params.slug as string;
  const dateParam = searchParams.get('date'); // e.g., "2026-04-13" for specific ekadashi

  const isTamil = String(locale) === 'ta';
  const isDevanagari = isDevanagariLocale(locale);
  const headingFont: React.CSSProperties = isDevanagari ? { fontFamily: 'var(--font-devanagari-heading)' } : { fontFamily: 'var(--font-heading)' };
  const bodyFont: React.CSSProperties = isDevanagari ? { fontFamily: 'var(--font-devanagari-body)' } : {};

  // Look up data
  const detail: FestivalDetail | undefined = FESTIVAL_DETAILS[slug] || CATEGORY_DETAILS[slug];
  // Puja lookup: try exact slug, then common mappings for mismatched slugs
  const PUJA_SLUG_MAP: Record<string, string> = {
    'vat-savitri-vrat': 'vat-savitri',
    'amavasya': 'amavasya-tarpan',
    'pradosham-shukla': 'pradosham',
    'pradosham-krishna': 'pradosham',
    'masik-shivaratri': 'masik-shivaratri',
    'sankashti-chaturthi-shukla': 'sankashti-chaturthi',
  };
  const puja: PujaVidhi | undefined = PUJA_VIDHIS[slug] || PUJA_VIDHIS[PUJA_SLUG_MAP[slug] || ''];

  // Determine category from slug or puja — ekadashi slug check FIRST (before vrat)
  const category = slug.includes('ekadashi') ? 'ekadashi'
    : puja?.category === 'vrat' ? 'vrat'
    : puja?.category === 'graha_shanti' ? 'vrat'
    : slug.includes('purnima') ? 'purnima'
    : slug.includes('amavasya') ? 'amavasya'
    : slug.includes('chaturthi') ? 'chaturthi'
    : slug.includes('pradosham') ? 'pradosham'
    : 'festival';

  // Ekadashi detail lookup — deferred until after ekadashiParana is available
  // (the specific ekadashi name comes from the festival calendar entry)
  let ekadashiDetail: EkadashiDetail | null = null;

  // Derive the deity from detail or puja
  const deity = detail?.deity || puja?.deity;

  // festivalName is derived after ekadashiDetail is populated (below)

  // specificEkadashiName is derived after ekadashiParana memo below

  // PujaMode state
  const [pujaMode, setPujaMode] = useState(false);
  const [quickMode, setQuickMode] = useState(false);

  // Location store for Ekadashi parana
  const locationStore = useLocationStore();
  useEffect(() => {
    if (category === 'ekadashi' && !locationStore.confirmed && !locationStore.detecting) {
      locationStore.detect();
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const userLat = locationStore.lat;
  const userLng = locationStore.lng;
  const userTimezone = locationStore.timezone || Intl.DateTimeFormat().resolvedOptions().timeZone;

  // Compute Ekadashi parana via server action — eliminates hydration mismatch
  // from new Date() differences between server and client
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [ekadashiParana, setEkadashiParana] = useState<any>(null);
  useEffect(() => {
    if (category !== 'ekadashi' || !userLat || !userLng) return;
    let cancelled = false;
    import('@/app/actions/festival-lookup').then(({ lookupEkadashiAction }) =>
      lookupEkadashiAction({
        slug,
        dateParam: dateParam || undefined,
        lat: userLat,
        lng: userLng,
        timezone: userTimezone,
        year: new Date().getFullYear(),
      }).then(result => {
        if (!cancelled) setEkadashiParana(result);
      })
    ).catch(() => {});
    return () => { cancelled = true; };
  }, [category, slug, dateParam, userLat, userLng, userTimezone]);

  // Now that ekadashiParana is available, look up specific ekadashi detail by name
  if (category === 'ekadashi') {
    // First try matching by slug
    for (const monthKey of Object.keys(EKADASHI_NAMES)) {
      const monthData = EKADASHI_NAMES[monthKey];
      const shuklaSlug = monthData.shukla.name.en.toLowerCase().replace(/\s+/g, '-');
      const krishnaSlug = monthData.krishna.name.en.toLowerCase().replace(/\s+/g, '-');
      if (shuklaSlug === slug) { ekadashiDetail = monthData.shukla; break; }
      if (krishnaSlug === slug) { ekadashiDetail = monthData.krishna; break; }
    }
    // If not found by slug, try matching by the specific name from calendar entry
    if (!ekadashiDetail && ekadashiParana?.name) {
      const specificName = (ekadashiParana.name as { en: string }).en;
      for (const monthKey of Object.keys(EKADASHI_NAMES)) {
        const monthData = EKADASHI_NAMES[monthKey];
        if (monthData.shukla.name.en === specificName) { ekadashiDetail = monthData.shukla; break; }
        if (monthData.krishna.name.en === specificName) { ekadashiDetail = monthData.krishna; break; }
      }
    }
  }

  const hasContent = detail || ekadashiDetail || puja || ekadashiParana;

  // ─── Not Found ───
  if (!hasContent) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-4">
        <motion.div {...fadeInUp} className="text-center max-w-md">
          <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gold-primary/10 border border-gold-primary/20 flex items-center justify-center">
            <BookOpen className="w-10 h-10 text-gold-primary/50" />
          </div>
          <h1 className="text-3xl font-bold text-gold-gradient mb-3" style={headingFont}>
            {LABELS.notFound[locale]}
          </h1>
          <p className="text-text-secondary mb-8" style={bodyFont}>
            {LABELS.notFoundSub[locale]}
          </p>
          <Link
            href={`/${locale}/calendar`}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gold-primary/10 border border-gold-primary/20 text-gold-light hover:bg-gold-primary/20 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span style={headingFont}>{LABELS.back[locale]}</span>
          </Link>
        </motion.div>
      </div>
    );
  }

  // ─── Display name — prefer specific ekadashi name from calendar entry ───
  const specificEkadashiName = ekadashiParana?.name as LocaleText | undefined;
  const displayName = specificEkadashiName || detail?.name || ekadashiDetail?.name || { en: slug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' '), hi: slug, sa: slug };

  return (
    <div className="min-h-screen pb-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-6 sm:pt-10">
        <motion.div variants={staggerContainer} initial="initial" animate="animate" className="space-y-8">

          {/* ═══ Header ═══ */}
          <motion.div {...fadeInUp}>
            <Link
              href={`/${locale}/calendar`}
              className="inline-flex items-center gap-2 text-sm text-text-secondary hover:text-gold-light transition-colors mb-6 group"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              <span style={bodyFont}>{LABELS.back[locale]}</span>
            </Link>

            <div className="flex items-start gap-4">
              <div className="flex-1">
                <h1
                  className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gold-gradient leading-tight mb-3"
                  style={headingFont}
                  suppressHydrationWarning
                >
                  {l(displayName, locale)}
                </h1>
                {/* Show specific date for date-parameterized pages (e.g., ekadashi?date=2026-04-13) */}
                {(dateParam || ekadashiParana?.date) && (
                  <p className="text-xl sm:text-2xl font-black text-gold-light mb-3" style={headingFont} suppressHydrationWarning>
                    {(() => {
                      const d = dateParam || ekadashiParana?.date || '';
                      const [y, m, day] = d.split('-').map(Number);
                      const date = new Date(y, m - 1, day);
                      const loc = locale === 'hi' ? 'hi-IN' : 'en-US';
                      try { return date.toLocaleDateString(loc, { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }); }
                      catch { return d; }
                    })()}
                  </p>
                )}
                <div className="flex items-center gap-3 flex-wrap">
                  <span className={`text-xs px-3 py-1 rounded-full border font-bold uppercase tracking-wider ${categoryBadgeColors[category] || 'bg-gold-primary/10 border-gold-primary/20 text-gold-dark'}`}>
                    {category}
                  </span>
                  {deity && (
                    <span className="text-sm text-text-secondary" style={bodyFont}>
                      {l(deity, locale)}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </motion.div>

          {/* ═══ Ekadashi Parana — TOP of page ═══ */}
          {ekadashiParana && (
            <motion.div {...fadeInUp}>
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
            </motion.div>
          )}

          {/* ═══ Section 1: About ═══ */}
          {detail && (
            <motion.div {...fadeInUp} className="space-y-5">
              <SectionHeading icon={<BookOpen className="w-5 h-5" />} title={LABELS.about[locale]} headingFont={headingFont} />

              {detail.deity && (
                <div className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5">
                  <div className="flex items-center gap-3">
                    <Sparkles className="w-5 h-5 text-gold-primary" />
                    <span className="text-gold-dark text-sm font-bold uppercase tracking-wider" style={headingFont}>{LABELS.deity[locale]}</span>
                  </div>
                  <p className="text-gold-light text-lg mt-2 font-semibold" style={bodyFont}>{l(detail.deity, locale)}</p>
                </div>
              )}

              <ContentCard
                icon={<BookOpen className="w-5 h-5" />}
                title={LABELS.mythology[locale]}
                content={l(detail.mythology, locale)}
                headingFont={headingFont}
                bodyFont={bodyFont}
              />

              <ContentCard
                icon={<Star className="w-5 h-5" />}
                title={LABELS.significance[locale]}
                content={l(detail.significance, locale)}
                headingFont={headingFont}
                bodyFont={bodyFont}
                highlight
              />

              <ContentCard
                icon={<Flame className="w-5 h-5" />}
                title={LABELS.observance[locale]}
                content={l(detail.observance, locale)}
                headingFont={headingFont}
                bodyFont={bodyFont}
              />

              {detail.isFast && detail.fastNote && (
                <ContentCard
                  icon={<Clock className="w-5 h-5" />}
                  title={LABELS.fasting[locale]}
                  content={l(detail.fastNote, locale)}
                  headingFont={headingFont}
                  bodyFont={bodyFont}
                  highlight
                />
              )}
            </motion.div>
          )}

          {/* ═══ Section 2: Puja Vidhi ═══ */}
          {puja && (
            <motion.div {...fadeInUp} className="space-y-6">
              <SectionHeading icon={<Flame className="w-5 h-5" />} title={LABELS.pujaVidhi[locale]} headingFont={headingFont} />

              {/* Start Puja / Quick Mode buttons */}
              <div className="flex flex-col sm:flex-row items-center gap-3">
                <button
                  onClick={() => { setQuickMode(false); setPujaMode(true); }}
                  className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-gradient-to-r from-gold-primary/80 to-gold-primary text-[#0a0e27] font-bold text-sm hover:from-gold-primary hover:to-gold-light transition-all shadow-lg shadow-gold-primary/20"
                  style={headingFont}
                >
                  {tl({ en: 'Start Full Puja', hi: 'पूर्ण पूजा आरम्भ करें', sa: 'पूर्णपूजाम् आरभतु' }, locale)}
                </button>
                <button
                  onClick={() => { setQuickMode(true); setPujaMode(true); }}
                  className="w-full sm:w-auto px-8 py-3.5 rounded-xl border border-gold-primary/25 text-gold-primary font-bold text-sm hover:bg-gold-primary/10 transition-all"
                  style={headingFont}
                >
                  {tl({ en: 'Quick Mode (~15 min)', hi: 'संक्षिप्त (~15 मिनट)', sa: 'संक्षिप्तम् (~15 निमेषाः)' }, locale)}
                </button>
              </div>

              <FullPujaVidhi puja={puja} locale={locale} headingFont={headingFont} bodyFont={bodyFont} />
            </motion.div>
          )}

          {/* ═══ Section 3: Ekadashi-specific ═══ */}
          {ekadashiDetail && (
            <motion.div {...fadeInUp} className="space-y-5">
              <SectionHeading icon={<Star className="w-5 h-5" />} title={category === 'ekadashi' ? tl({ en: 'Ekadashi Details', hi: 'एकादशी विवरण', sa: 'एकादशी विवरण' }, locale) : ''} headingFont={headingFont} />

              <ContentCard
                icon={<BookOpen className="w-5 h-5" />}
                title={LABELS.ekadashiStory[locale]}
                content={l(ekadashiDetail.story, locale)}
                headingFont={headingFont}
                bodyFont={bodyFont}
              />

              <ContentCard
                icon={<Gift className="w-5 h-5" />}
                title={LABELS.ekadashiBenefit[locale]}
                content={l(ekadashiDetail.benefit, locale)}
                headingFont={headingFont}
                bodyFont={bodyFont}
                highlight
                accentColor="emerald"
              />
            </motion.div>
          )}

          {/* Ekadashi Parana card moved to top — see after title */}

          {/* ═══ Learn More Links ═══ */}
          <motion.div {...fadeInUp} className="mt-6 flex flex-wrap items-center gap-2">
            <span className="text-text-secondary text-xs">{l({ en: 'Learn more', hi: 'और जानें', sa: 'अधिकं जानीयात्', ta: 'மேலும் அறிக', te: 'మరింత తెలుసుకోండి', bn: 'আরও জানুন', kn: 'ಮತ್ತಷ್ಟು ತಿಳಿಯಿರಿ', mr: 'अधिक जाणा', gu: 'વધુ જાણો', mai: 'आओर जानू' }, locale)}:</span>
            <Link
              href={`/${locale}/learn/festival-rules`}
              className="text-xs text-gold-primary/70 hover:text-gold-light border border-gold-primary/15 hover:border-gold-primary/30 rounded-lg px-3 py-1 transition-colors"
            >
              {l({ en: 'Festival Timing Rules', hi: 'उत्सव काल नियम', sa: 'उत्सवकालनियमाः', ta: 'பண்டிகை நேர விதிகள்' }, locale)}
            </Link>
            <Link
              href={`/${locale}/learn/tithis`}
              className="text-xs text-gold-primary/70 hover:text-gold-light border border-gold-primary/15 hover:border-gold-primary/30 rounded-lg px-3 py-1 transition-colors"
            >
              {l({ en: 'Understanding Tithis', hi: 'तिथि को समझें', sa: 'तिथीनां ज्ञानम्', ta: 'திதிகளைப் புரிந்துகொள்ளுங்கள்' }, locale)}
            </Link>
            <Link
              href={`/${locale}/learn/masa`}
              className="text-xs text-gold-primary/70 hover:text-gold-light border border-gold-primary/15 hover:border-gold-primary/30 rounded-lg px-3 py-1 transition-colors"
            >
              {l({ en: 'Lunar Months Explained', hi: 'चंद्र मास विवरण', sa: 'चन्द्रमासव्याख्या', ta: 'சந்திர மாதங்கள் விளக்கம்' }, locale)}
            </Link>
            <Link
              href={`/${locale}/learn/smarta-vaishnava`}
              className="text-xs text-gold-primary/70 hover:text-gold-light border border-gold-primary/15 hover:border-gold-primary/30 rounded-lg px-3 py-1 transition-colors"
            >
              {l({ en: 'Smarta & Vaishnava Calendars', hi: 'स्मार्त और वैष्णव पंचांग', sa: 'स्मार्तवैष्णवपञ्चाङ्गम्', ta: 'ஸ்மார்த்த & வைஷ்ணவ நாட்காட்டிகள்' }, locale)}
            </Link>
          </motion.div>
        </motion.div>
      </div>

      {/* PujaMode fullscreen overlay */}
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
    </div>
  );
}

/* ═══════════════════════════════════════════
   SUB-COMPONENTS
   ═══════════════════════════════════════════ */

function SectionHeading({ icon, title, headingFont }: { icon: React.ReactNode; title: string; headingFont: React.CSSProperties }) {
  return (
    <div className="flex items-center gap-3">
      <div className="w-10 h-10 rounded-xl bg-gold-primary/10 border border-gold-primary/20 flex items-center justify-center text-gold-primary">
        {icon}
      </div>
      <h2 className="text-xl sm:text-2xl font-bold text-gold-light uppercase tracking-wider" style={headingFont}>
        {title}
      </h2>
      <div className="flex-1 h-px bg-gold-primary/15" />
    </div>
  );
}

function ContentCard({
  icon,
  title,
  content,
  headingFont,
  bodyFont,
  highlight = false,
  accentColor = 'gold',
}: {
  icon: React.ReactNode;
  title: string;
  content: string;
  headingFont: React.CSSProperties;
  bodyFont: React.CSSProperties;
  highlight?: boolean;
  accentColor?: 'gold' | 'emerald';
}) {
  const highlightClasses = accentColor === 'emerald'
    ? 'border-emerald-500/25'
    : 'border-gold-primary/20';

  return (
    <div className={`bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] rounded-xl p-5 sm:p-6 border ${highlight ? highlightClasses : 'border-gold-primary/12'}`}>
      <div className="flex items-center gap-2.5 mb-3">
        <span className={accentColor === 'emerald' ? 'text-emerald-400' : 'text-gold-primary'}>{icon}</span>
        <h3 className={`text-sm font-bold uppercase tracking-wider ${accentColor === 'emerald' ? 'text-emerald-300' : 'text-gold-light'}`} style={headingFont}>
          {title}
        </h3>
      </div>
      <p className="text-text-primary/90 text-base leading-relaxed" style={bodyFont}>
        {content}
      </p>
    </div>
  );
}

/* ═══════════════════════════════════════════
   INLINE MANTRA
   ═══════════════════════════════════════════ */

function InlineMantra({ mantra, locale, bodyFont }: { mantra: MantraType; locale: Locale; bodyFont: React.CSSProperties }) {
  const [copied, setCopied] = useState(false);
  const lk = (isDevanagariLocale(locale)) ? 'hi' as const : 'en' as const;

  const copy = () => {
    navigator.clipboard.writeText(mantra.devanagari).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    });
  };

  return (
    <div className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5 sm:p-6 relative">
      <button
        onClick={copy}
        className="absolute top-4 right-4 p-2 rounded-lg bg-bg-tertiary/50 hover:bg-bg-tertiary text-gold-primary/40 hover:text-gold-light transition-colors"
        aria-label="Copy mantra"
      >
        {copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
      </button>

      <p className="text-gold-dark text-xs uppercase tracking-wider font-bold mb-2">
        {mantra.name[lk as keyof typeof mantra.name]}
      </p>

      <p
        className="text-gold-light text-lg sm:text-xl leading-relaxed pr-10"
        style={{ fontFamily: 'var(--font-devanagari-heading)' }}
      >
        {mantra.devanagari}
      </p>

      <p className="text-text-secondary/75 text-sm italic mt-2">{mantra.iast}</p>

      <p className="text-text-secondary text-sm mt-2 leading-relaxed" style={bodyFont}>
        {mantra.meaning[lk as keyof typeof mantra.meaning]}
      </p>

      {mantra.japaCount && (
        <span className="inline-flex items-center gap-1.5 mt-3 text-xs px-3 py-1 rounded-full bg-gold-primary/10 border border-gold-primary/15 text-gold-dark font-bold">
          {mantra.japaCount}x {LABELS.japaCount[locale]}
        </span>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════
   FULL PUJA VIDHI (inline, full-page version)
   ═══════════════════════════════════════════ */

function FullPujaVidhi({ puja, locale, headingFont, bodyFont }: { puja: PujaVidhi; locale: Locale; headingFont: React.CSSProperties; bodyFont: React.CSSProperties }) {
  const t = (tri: LocaleText) => tri[locale] || tri.en;

  return (
    <div className="space-y-6">

      {/* ─── Muhurta ─── */}
      <div className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5 sm:p-6">
        <div className="flex items-center gap-2.5 mb-3">
          <Clock className="w-5 h-5 text-gold-primary" />
          <h3 className="text-sm font-bold text-gold-light uppercase tracking-wider" style={headingFont}>
            {LABELS.muhurta[locale]}
          </h3>
        </div>
        <p className="text-text-primary/90 text-base leading-relaxed" style={bodyFont}>{t(puja.muhurtaDescription)}</p>
      </div>

      {/* ─── Samagri (shared component) ─── */}
      <div className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5 sm:p-6">
        <div className="flex items-center gap-2.5 mb-4">
          <Gift className="w-5 h-5 text-gold-primary" />
          <h3 className="text-sm font-bold text-gold-light uppercase tracking-wider" style={headingFont}>
            {LABELS.samagri[locale]}
          </h3>
        </div>
        <SamagriList items={puja.samagri} slug={puja.festivalSlug} locale={locale} />
      </div>

      {/* ─── Sankalpa ─── */}
      <div className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5 sm:p-6 border border-amber-500/20 bg-amber-500/3">
        <div className="flex items-center gap-2.5 mb-3">
          <Shield className="w-5 h-5 text-amber-400" />
          <h3 className="text-sm font-bold text-amber-300 uppercase tracking-wider" style={headingFont}>
            {LABELS.sankalpa[locale]}
          </h3>
        </div>
        <p
          className="text-gold-light text-base sm:text-lg leading-relaxed"
          style={{ fontFamily: 'var(--font-devanagari-body)' }}
        >
          {t(puja.sankalpa)}
        </p>
      </div>

      {/* ─── Vidhi Steps ─── */}
      <div className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5 sm:p-6">
        <div className="flex items-center gap-2.5 mb-5">
          <Flame className="w-5 h-5 text-gold-primary" />
          <h3 className="text-sm font-bold text-gold-light uppercase tracking-wider" style={headingFont}>
            {LABELS.procedure[locale]}
          </h3>
        </div>
        <div className="space-y-4">
          {puja.vidhiSteps.map((step) => {
            const linkedMantra = step.mantraRef ? puja.mantras.find(m => m.id === step.mantraRef) : null;
            return (
              <div key={step.step} className="flex gap-4">
                <div className="flex-shrink-0">
                  <span className="w-8 h-8 rounded-full bg-gradient-to-br from-gold-light/20 to-gold-primary/10 border border-gold-primary/20 text-gold-primary text-sm font-bold flex items-center justify-center">
                    {step.step}
                  </span>
                </div>
                <div className="flex-1 min-w-0 pb-4 border-b border-gold-primary/5 last:border-0">
                  <h4 className="text-gold-light text-base font-semibold mb-1" style={bodyFont}>{t(step.title)}</h4>
                  <p className="text-text-secondary/80 text-sm leading-relaxed" style={bodyFont}>{t(step.description)}</p>
                  {linkedMantra && (
                    <div className="mt-3 pl-3 border-l-2 border-gold-primary/20">
                      <p className="text-gold-primary/60 text-xs uppercase tracking-wider font-bold mb-1">{linkedMantra.name[isDevanagariLocale(locale) ? 'hi' as const : 'en' as const]}</p>
                      <p className="text-amber-300 text-base font-bold" style={{ fontFamily: 'var(--font-devanagari-heading)' }}>{linkedMantra.devanagari}</p>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ─── Mantras ─── */}
      {puja.mantras.length > 0 && (
        <div>
          <div className="flex items-center gap-2.5 mb-4">
            <Sparkles className="w-5 h-5 text-gold-primary" />
            <h3 className="text-sm font-bold text-gold-light uppercase tracking-wider" style={headingFont}>
              {LABELS.mantras[locale]}
            </h3>
          </div>
          <div className="space-y-4">
            {puja.mantras.map((m) => (
              <InlineMantra key={m.id} mantra={m} locale={locale} bodyFont={bodyFont} />
            ))}
          </div>
        </div>
      )}

      {/* ─── Stotras ─── */}
      {puja.stotras && puja.stotras.length > 0 && (
        <div className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5 sm:p-6">
          <div className="flex items-center gap-2.5 mb-4">
            <BookOpen className="w-5 h-5 text-gold-primary" />
            <h3 className="text-sm font-bold text-gold-light uppercase tracking-wider" style={headingFont}>
              {LABELS.stotras[locale]}
            </h3>
          </div>
          <div className="space-y-3">
            {puja.stotras.map((stotra, i) => (
              <div key={i} className="flex items-center justify-between rounded-lg bg-gradient-to-br from-[#2d1b69]/30 via-[#1a1040]/35 to-[#0a0e27] border border-gold-primary/8 px-4 py-3">
                <div>
                  <p className="text-gold-light text-sm font-semibold" style={bodyFont}>{t(stotra.name)}</p>
                  {stotra.note && <p className="text-text-secondary/75 text-xs mt-0.5" style={bodyFont}>{t(stotra.note)}</p>}
                </div>
                {stotra.duration && (
                  <span className="text-xs text-text-secondary px-2 py-1 rounded-full bg-bg-tertiary/50 font-mono">
                    {stotra.duration}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ─── Aarti ─── */}
      {puja.aarti && (
        <div className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5 sm:p-6 border border-orange-500/15 bg-orange-500/3">
          <div className="flex items-center gap-2.5 mb-4">
            <Flame className="w-5 h-5 text-orange-400" />
            <h3 className="text-sm font-bold text-orange-300 uppercase tracking-wider" style={headingFont}>
              {LABELS.aarti[locale]}
            </h3>
          </div>
          <p
            className="text-gold-light text-base sm:text-lg whitespace-pre-line leading-relaxed mb-4"
            style={{ fontFamily: 'var(--font-devanagari-body)' }}
          >
            {puja.aarti.devanagari}
          </p>
          <p className="text-text-secondary/75 text-sm italic whitespace-pre-line leading-relaxed">
            {puja.aarti.iast}
          </p>
        </div>
      )}

      {/* ─── Naivedya ─── */}
      <div className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5 sm:p-6">
        <div className="flex items-center gap-2.5 mb-3">
          <Gift className="w-5 h-5 text-gold-primary" />
          <h3 className="text-sm font-bold text-gold-light uppercase tracking-wider" style={headingFont}>
            {LABELS.naivedya[locale]}
          </h3>
        </div>
        <p className="text-text-primary/90 text-base leading-relaxed" style={bodyFont}>{t(puja.naivedya)}</p>
      </div>

      {/* ─── Precautions ─── */}
      {puja.precautions.length > 0 && (
        <div className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5 sm:p-6 border border-amber-500/15 bg-amber-500/3">
          <div className="flex items-center gap-2.5 mb-4">
            <AlertTriangle className="w-5 h-5 text-amber-400" />
            <h3 className="text-sm font-bold text-amber-300 uppercase tracking-wider" style={headingFont}>
              {LABELS.precautions[locale]}
            </h3>
          </div>
          <ul className="space-y-2.5">
            {puja.precautions.map((p, i) => (
              <li key={i} className="flex gap-3 text-text-secondary text-sm" style={bodyFont}>
                <AlertTriangle className="w-4 h-4 text-amber-400/50 flex-shrink-0 mt-0.5" />
                <span>{t(p)}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* ─── Phala ─── */}
      <div className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-emerald-500/20 rounded-xl p-5 sm:p-6">
        <div className="flex items-center gap-2.5 mb-3">
          <Star className="w-5 h-5 text-emerald-400" />
          <h3 className="text-sm font-bold text-emerald-300 uppercase tracking-wider" style={headingFont}>
            {LABELS.phala[locale]}
          </h3>
        </div>
        <p className="text-text-primary/90 text-base leading-relaxed" style={bodyFont}>{t(puja.phala)}</p>
      </div>

      {/* ─── Visarjan ─── */}
      {puja.visarjan && (
        <div className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5 sm:p-6">
          <div className="flex items-center gap-2.5 mb-3">
            <Sparkles className="w-5 h-5 text-gold-primary" />
            <h3 className="text-sm font-bold text-gold-light uppercase tracking-wider" style={headingFont}>
              {LABELS.visarjan[locale]}
            </h3>
          </div>
          <p className="text-text-primary/90 text-base leading-relaxed" style={bodyFont}>{t(puja.visarjan)}</p>
        </div>
      )}
    </div>
  );
}
