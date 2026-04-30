'use client';

import { useState, useMemo } from 'react';
import { useLocale } from 'next-intl';
import { motion } from 'framer-motion';
import { Flame, AlertTriangle, MapPin, ArrowLeft, CheckCircle, ShieldOff, Calendar, Sparkles } from 'lucide-react';
import GoldDivider from '@/components/ui/GoldDivider';
import InfoBlock from '@/components/ui/InfoBlock';
import { Link } from '@/lib/i18n/navigation';
import { computePanchang, type PanchangInput } from '@/lib/ephem/panchang-calc';
import { getUTCOffsetForDate } from '@/lib/utils/timezone';
import { CITIES, type CityData } from '@/lib/constants/cities';
import { getDefaultCityForLocale } from '@/lib/constants/rashi-slugs';
import { useLocationStore } from '@/stores/location-store';
import { generateBreadcrumbLD } from '@/lib/seo/structured-data';
import { checkHolashtak, HOLASHTAK_AVOID_ACTIVITIES } from '@/lib/panchang/holashtak';
import type { Locale } from '@/types/panchang';
import { isDevanagariLocale } from '@/lib/utils/locale-fonts';
import { tl } from '@/lib/utils/trilingual';
import { safeJsonLd } from '@/lib/seo/safe-jsonld';

// ─── City selector ────────────────────────────────────────────
const CITY_SLUGS = ['delhi', 'mumbai', 'bangalore', 'chennai', 'kolkata', 'hyderabad', 'pune', 'ahmedabad', 'jaipur', 'varanasi'] as const;
const SELECTOR_CITIES = CITY_SLUGS.map(s => CITIES.find(c => c.slug === s)!).filter(Boolean);

// ─── Labels ────────────────────────────────────────────────────
const LABELS: Record<string, Record<string, string>> = {
  en: {
    back: 'Panchang',
    title: 'Holashtak Today',
    active: 'Holashtak is ACTIVE',
    notActive: 'No Holashtak Today',
    activeDescPrefix: 'Today is Day ',
    activeDescSuffix: '/8 of Holashtak. All auspicious activities are restricted.',
    notActiveDesc: 'Holashtak is not active today. Holashtak occurs during Phalguna Shukla Ashtami to Purnima (8 days before Holi).',
    currentTithi: 'Current Tithi',
    currentMasa: 'Current Masa (Amanta)',
    currentPaksha: 'Current Paksha',
    dayNumber: 'Holashtak Day',
    daysUntilHoli: 'Days Until Holi',
    activitiesToAvoid: 'Activities to Avoid During Holashtak',
    activitiesOkay: 'Activities That Are Okay',
    okayItems: 'Daily routine and office work|Emergency actions|Spiritual practices (enhanced)|Charity and donations|Studying and learning|Holi preparations',
    eightDaysTitle: 'The 8 Days of Holashtak',
    faq: 'Frequently Asked Questions',
    faq1q: 'When does Holashtak occur?',
    faq1a: 'Holashtak occurs every year from Phalguna Shukla Ashtami to Phalguna Shukla Purnima (Holi). In the Gregorian calendar, this typically falls in February or March. The exact dates change each year since they follow the lunar calendar.',
    faq2q: 'Can I get married during Holashtak?',
    faq2a: 'Marriage ceremonies are strictly avoided during Holashtak in North Indian tradition. This is one of the most important restrictions. If a wedding date falls during Holashtak, families typically reschedule.',
    faq3q: 'Is Holashtak observed in South India?',
    faq3a: 'Holashtak is primarily a North and Central Indian tradition. In South India, the concept is much less prominent, and Holi itself is celebrated differently (as Kamadahana in Karnataka, or modestly in Tamil Nadu/Kerala).',
    faq4q: 'Are spiritual practices affected during Holashtak?',
    faq4a: 'Spiritual practices are actually considered MORE powerful during Holashtak, not less. Fasting, prayer, mantra chanting, meditation, and charitable acts are encouraged and believed to yield enhanced results.',
    faq5q: 'What is the difference between Holashtak and Panchak?',
    faq5a: 'Panchak is based on the Moon\'s nakshatra position (nakshatras 23-27) and occurs approximately monthly for ~2.5 days. Holashtak is based on the lunar calendar month and tithi (Phalguna Shukla 8-15) and occurs once a year for 8 days before Holi. They restrict different things — Panchak focuses on wood/fuel/travel/cremation, while Holashtak restricts ceremonies and new ventures.',
    learnMore: 'Learn More About Holashtak',
    seeAlso: 'See Also',
  },
  hi: {
    back: 'पंचांग',
    title: 'आज का होलाष्टक',
    active: 'होलाष्टक सक्रिय है',
    notActive: 'आज होलाष्टक नहीं है',
    activeDescPrefix: 'आज होलाष्टक का दिन ',
    activeDescSuffix: '/8 है। सभी शुभ कार्य वर्जित हैं।',
    notActiveDesc: 'आज होलाष्टक सक्रिय नहीं है। होलाष्टक फाल्गुन शुक्ल अष्टमी से पूर्णिमा तक (होली से 8 दिन पहले) होता है।',
    currentTithi: 'वर्तमान तिथि',
    currentMasa: 'वर्तमान मास (अमान्त)',
    currentPaksha: 'वर्तमान पक्ष',
    dayNumber: 'होलाष्टक दिवस',
    daysUntilHoli: 'होली तक दिन',
    activitiesToAvoid: 'होलाष्टक में वर्जित कार्य',
    activitiesOkay: 'होलाष्टक में अनुमत कार्य',
    okayItems: 'दैनिक दिनचर्या और कार्यालय कार्य|आपातकालीन कार्य|आध्यात्मिक साधना (विशेष प्रभावी)|दान और दक्षिणा|अध्ययन और शिक्षा|होली की तैयारी',
    eightDaysTitle: 'होलाष्टक के 8 दिन',
    faq: 'अक्सर पूछे जाने वाले प्रश्न',
    faq1q: 'होलाष्टक कब होता है?',
    faq1a: 'होलाष्टक प्रत्येक वर्ष फाल्गुन शुक्ल अष्टमी से फाल्गुन शुक्ल पूर्णिमा (होली) तक होता है। ग्रेगोरियन कैलेंडर में यह आमतौर पर फरवरी या मार्च में आता है।',
    faq2q: 'क्या होलाष्टक में विवाह कर सकते हैं?',
    faq2a: 'उत्तर भारतीय परम्परा में होलाष्टक में विवाह संस्कार सख्ती से वर्जित है। यह सबसे महत्वपूर्ण प्रतिबंधों में से एक है। यदि विवाह की तिथि होलाष्टक में आती है, तो परिवार आमतौर पर पुनर्निर्धारित करते हैं।',
    faq3q: 'क्या दक्षिण भारत में होलाष्टक मनाया जाता है?',
    faq3a: 'होलाष्टक मुख्य रूप से उत्तर और मध्य भारतीय परम्परा है। दक्षिण भारत में यह अवधारणा बहुत कम प्रमुख है।',
    faq4q: 'क्या होलाष्टक में आध्यात्मिक साधना प्रभावित होती है?',
    faq4a: 'आध्यात्मिक साधनाएँ होलाष्टक में अधिक शक्तिशाली मानी जाती हैं। उपवास, प्रार्थना, मंत्र जप, ध्यान और दान को प्रोत्साहित किया जाता है।',
    faq5q: 'होलाष्टक और पंचक में क्या अंतर है?',
    faq5a: 'पंचक चन्द्रमा की नक्षत्र स्थिति (23-27) पर आधारित है और मासिक ~2.5 दिन होता है। होलाष्टक चान्द्र मास और तिथि (फाल्गुन शुक्ल 8-15) पर आधारित है और वर्ष में एक बार 8 दिन होता है।',
    learnMore: 'होलाष्टक के बारे में और जानें',
    seeAlso: 'यह भी देखें',
  },
};

// ─── 8 day descriptions ───────────────────────────────────────
const EIGHT_DAYS = [
  { day: 1, tithi: 'Ashtami', tithiHi: 'अष्टमी', desc: { en: 'Beginning of the inauspicious period', hi: 'अशुभ अवधि की शुरुआत' } },
  { day: 2, tithi: 'Navami', tithiHi: 'नवमी', desc: { en: 'Intensity builds. No new ventures', hi: 'तीव्रता बढ़ती है। कोई नया उद्यम नहीं' } },
  { day: 3, tithi: 'Dashami', tithiHi: 'दशमी', desc: { en: 'Focus on existing commitments', hi: 'मौजूदा प्रतिबद्धताओं पर ध्यान दें' } },
  { day: 4, tithi: 'Ekadashi', tithiHi: 'एकादशी', desc: { en: 'Fasting day. Spiritual practices emphasized', hi: 'उपवास दिवस। आध्यात्मिक साधना पर ज़ोर' } },
  { day: 5, tithi: 'Dwadashi', tithiHi: 'द्वादशी', desc: { en: 'Holi preparations begin', hi: 'होली की तैयारी शुरू' } },
  { day: 6, tithi: 'Trayodashi', tithiHi: 'त्रयोदशी', desc: { en: 'Community gathering for Holika Dahan prep', hi: 'होलिका दहन की तैयारी' } },
  { day: 7, tithi: 'Chaturdashi', tithiHi: 'चतुर्दशी', desc: { en: 'Holika Dahan eve — pyre assembled', hi: 'होलिका दहन की पूर्व संध्या' } },
  { day: 8, tithi: 'Purnima', tithiHi: 'पूर्णिमा', desc: { en: 'Holika Dahan night, Holi colors next day', hi: 'होलिका दहन, अगले दिन रंग' } },
];

// ─── Animation ────────────────────────────────────────────────
const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.1, duration: 0.5, ease: 'easeOut' as const },
  }),
};

export default function HolashtakPage() {
  const locale = useLocale() as Locale;
  const isDevanagari = isDevanagariLocale(locale);
  const headingFont = isDevanagari
    ? { fontFamily: 'var(--font-devanagari-heading)' }
    : { fontFamily: 'var(--font-heading)' };
  const L = LABELS[locale] || LABELS.en;

  const locationStore = useLocationStore();
  const initialCity = (): CityData => {
    if (locationStore.lat !== null && locationStore.lng !== null) {
      return {
        slug: 'current',
        name: { en: locationStore.name || 'Current Location', hi: locationStore.name || 'वर्तमान स्थान', sa: locationStore.name || 'वर्तमानस्थानम्' },
        lat: locationStore.lat,
        lng: locationStore.lng,
        timezone: locationStore.timezone || Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC',
      };
    }
    return getDefaultCityForLocale(locale) || SELECTOR_CITIES[0];
  };
  const [selectedCity, setSelectedCity] = useState<CityData>(initialCity);

  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth() + 1;
  const day = now.getDate();

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

  // Check Holashtak from panchang data
  const tithiNumber = panchang.tithi?.number ?? 1;
  const masaAmanta = panchang.amantMasa;
  const paksha = panchang.tithi?.paksha as 'shukla' | 'krishna' | undefined;

  const holashtakInfo = useMemo(() => {
    return checkHolashtak(tithiNumber, masaAmanta, paksha ?? 'krishna');
  }, [tithiNumber, masaAmanta, paksha]);

  // Date formatting
  const dateStr = useMemo(() => {
    const d = new Date(year, month - 1, day);
    const LOCALE_MAP: Record<string, string> = { en: 'en-IN', hi: 'hi-IN', sa: 'hi-IN', ta: 'ta-IN', te: 'te-IN', bn: 'bn-IN', kn: 'kn-IN', gu: 'gu-IN', mai: 'hi-IN', mr: 'mr-IN' };
    const loc = LOCALE_MAP[locale] || 'en-IN';
    return d.toLocaleDateString(loc, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  }, [year, month, day, locale]);

  const tithiName = panchang.tithi?.name
    ? (locale === 'hi' ? panchang.tithi.name.hi : panchang.tithi.name.en)
    : '';
  const masaName = masaAmanta
    ? tl(masaAmanta, locale)
    : '';
  const pakshaDisplay = paksha === 'shukla'
    ? (locale === 'hi' ? 'शुक्ल' : 'Shukla')
    : (locale === 'hi' ? 'कृष्ण' : 'Krishna');

  const okayItems = L.okayItems.split('|');

  return (
    <main className="min-h-screen bg-bg-primary px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl">
        {/* JSON-LD */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: safeJsonLd(generateBreadcrumbLD('/holashtak', locale)) }}
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
          <h1
            className="text-3xl sm:text-4xl font-bold text-gold-light mb-2"
            style={headingFont}
          >
            {L.title}
          </h1>
          <p className="text-text-secondary text-lg">{dateStr}</p>
          <p className="text-text-secondary flex items-center gap-1.5 mt-1">
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

        {/* Status card */}
        <motion.div
          custom={1}
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          className={`rounded-xl border p-6 mb-8 ${
            holashtakInfo.isActive
              ? 'bg-red-500/10 border-red-500/30'
              : 'bg-green-500/10 border-green-500/30'
          }`}
        >
          <div className="flex items-center gap-3 mb-3">
            {holashtakInfo.isActive ? (
              <ShieldOff size={28} className="text-red-400" />
            ) : (
              <CheckCircle size={28} className="text-green-400" />
            )}
            <h2
              className={`text-2xl font-bold ${holashtakInfo.isActive ? 'text-red-400' : 'text-green-400'}`}
              style={headingFont}
            >
              {holashtakInfo.isActive ? L.active : L.notActive}
            </h2>
          </div>
          <p className="text-text-primary mb-4">
            {holashtakInfo.isActive
              ? `${L.activeDescPrefix}${holashtakInfo.dayNumber}${L.activeDescSuffix}`
              : L.notActiveDesc}
          </p>

          {/* Current panchang info */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="rounded-lg bg-white/5 border border-white/10 p-4">
              <p className="text-text-secondary text-sm mb-1">{L.currentTithi}</p>
              <p className="text-text-primary text-lg font-semibold">
                {tithiName} (#{tithiNumber})
              </p>
            </div>
            <div className="rounded-lg bg-white/5 border border-white/10 p-4">
              <p className="text-text-secondary text-sm mb-1">{L.currentMasa}</p>
              <p className="text-text-primary text-lg font-semibold">{masaName}</p>
            </div>
            <div className="rounded-lg bg-white/5 border border-white/10 p-4">
              <p className="text-text-secondary text-sm mb-1">{L.currentPaksha}</p>
              <p className="text-text-primary text-lg font-semibold">{pakshaDisplay}</p>
            </div>
          </div>

          {holashtakInfo.isActive && holashtakInfo.dayNumber && (
            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="rounded-lg bg-gold-primary/10 border border-gold-primary/30 p-4">
                <p className="text-text-secondary text-sm mb-1">{L.dayNumber}</p>
                <p className="text-gold-light text-2xl font-bold">{holashtakInfo.dayNumber} / 8</p>
              </div>
              <div className="rounded-lg bg-gold-primary/10 border border-gold-primary/30 p-4">
                <p className="text-text-secondary text-sm mb-1">{L.daysUntilHoli}</p>
                <p className="text-gold-light text-2xl font-bold">{8 - holashtakInfo.dayNumber}</p>
              </div>
            </div>
          )}
        </motion.div>

        {/* Activities to avoid */}
        <motion.div
          custom={2}
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          className="rounded-xl border border-gold-primary/12 bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] p-5 mb-8"
        >
          <h2 className="text-xl font-bold text-gold-light mb-4 flex items-center gap-2" style={headingFont}>
            <AlertTriangle size={20} className="text-red-400" />
            {L.activitiesToAvoid}
          </h2>
          <ul className="space-y-2 ml-1">
            {HOLASHTAK_AVOID_ACTIVITIES.map((activity, i) => (
              <li key={i} className="flex items-start gap-2 text-text-primary">
                <span className="text-red-400 mt-1.5 flex-shrink-0">&#8226;</span>
                {locale === 'hi' ? activity.hi : activity.en}
              </li>
            ))}
          </ul>
        </motion.div>

        {/* Activities that are okay */}
        <motion.div
          custom={3}
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          className="rounded-xl border border-gold-primary/12 bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] p-5 mb-8"
        >
          <h2 className="text-xl font-bold text-gold-light mb-4 flex items-center gap-2" style={headingFont}>
            <Sparkles size={20} className="text-green-400" />
            {L.activitiesOkay}
          </h2>
          <ul className="space-y-2 ml-1">
            {okayItems.map((item, i) => (
              <li key={i} className="flex items-start gap-2 text-text-primary">
                <span className="text-green-400 mt-1.5 flex-shrink-0">&#8226;</span>
                {item}
              </li>
            ))}
          </ul>
        </motion.div>

        <GoldDivider />

        {/* 8 Days breakdown */}
        <motion.div
          custom={4}
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          className="rounded-xl border border-gold-primary/12 bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] p-5 mb-8 mt-4"
        >
          <h2 className="text-xl font-bold text-gold-light mb-4 flex items-center gap-2" style={headingFont}>
            <Calendar size={20} className="text-gold-primary" />
            {L.eightDaysTitle}
          </h2>
          <div className="space-y-3">
            {EIGHT_DAYS.map((d) => {
              const isCurrent = holashtakInfo.isActive && holashtakInfo.dayNumber === d.day;
              return (
                <div
                  key={d.day}
                  className={`flex items-start gap-3 rounded-lg border p-3 ${
                    isCurrent
                      ? 'bg-gold-primary/15 border-gold-primary/40'
                      : 'bg-white/5 border-white/10'
                  }`}
                >
                  <span className={`flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
                    isCurrent
                      ? 'bg-gold-primary/30 border border-gold-primary text-gold-light'
                      : 'bg-gold-primary/15 border border-gold-primary/30 text-gold-light'
                  }`}>
                    {d.day}
                  </span>
                  <div>
                    <span className={`font-semibold text-sm ${isCurrent ? 'text-gold-light' : 'text-text-primary'}`}>
                      {locale === 'hi' ? d.tithiHi : d.tithi}
                      {isCurrent && (
                        <span className="text-xs ml-2 px-1.5 py-0.5 rounded-full bg-gold-primary/20 text-gold-light">
                          TODAY
                        </span>
                      )}
                    </span>
                    <p className="text-text-secondary text-sm mt-0.5">
                      {locale === 'hi' ? d.desc.hi : d.desc.en}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>

        <GoldDivider />

        {/* FAQ */}
        <motion.section
          custom={5}
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          className="mt-4 mb-8"
        >
          <h2 className="text-xl font-bold text-gold-light mb-4" style={headingFont}>
            {L.faq}
          </h2>
          <div className="space-y-3">
            {[
              { q: L.faq1q, a: L.faq1a, id: 'holashtak-faq1' },
              { q: L.faq2q, a: L.faq2a, id: 'holashtak-faq2' },
              { q: L.faq3q, a: L.faq3a, id: 'holashtak-faq3' },
              { q: L.faq4q, a: L.faq4a, id: 'holashtak-faq4' },
              { q: L.faq5q, a: L.faq5a, id: 'holashtak-faq5' },
            ].map((faq, i) => (
              <InfoBlock key={faq.id} id={faq.id} title={faq.q} defaultOpen={i === 0}>
                <p className="text-text-primary text-sm leading-relaxed">{faq.a}</p>
              </InfoBlock>
            ))}
          </div>
        </motion.section>

        <GoldDivider />

        {/* See Also */}
        <motion.section
          custom={6}
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          className="mt-4 mb-12"
        >
          <h2 className="text-lg font-bold text-gold-light mb-4" style={headingFont}>
            {L.seeAlso}
          </h2>
          <div className="flex flex-wrap gap-3">
            {[
              { href: '/learn/holashtak' as const, label: L.learnMore },
              { href: '/panchang' as const, label: L.back },
              { href: '/panchak' as const, label: locale === 'hi' ? 'आज का पंचक' : 'Panchak Today' },
              { href: '/calendar' as const, label: locale === 'hi' ? 'त्योहार कैलेंडर' : 'Festival Calendar' },
            ].map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="px-4 py-2 rounded-lg bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-white/10 text-text-primary hover:border-gold-primary/40 hover:text-gold-light transition-all text-sm"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </motion.section>
      </div>
    </main>
  );
}
