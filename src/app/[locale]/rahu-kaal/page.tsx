'use client';

import { useState, useMemo } from 'react';
import { useLocale } from 'next-intl';
import { motion } from 'framer-motion';
import { Clock, AlertTriangle, MapPin, ArrowLeft, Shield, ShieldAlert, ShieldOff } from 'lucide-react';
import GoldDivider from '@/components/ui/GoldDivider';
import { Link } from '@/lib/i18n/navigation';
import { computePanchang, type PanchangInput } from '@/lib/ephem/panchang-calc';
import { getUTCOffsetForDate } from '@/lib/utils/timezone';
import { CITIES, type CityData } from '@/lib/constants/cities';
import { getDefaultCityForLocale } from '@/lib/constants/rashi-slugs';
import { generateBreadcrumbLD } from '@/lib/seo/structured-data';
import type { Locale } from '@/types/panchang';
import { isDevanagariLocale } from '@/lib/utils/locale-fonts';
import { tl } from '@/lib/utils/trilingual';
import { safeJsonLd } from '@/lib/seo/safe-jsonld';

// ─── City selector list ────────────────────────────────────────
const CITY_SLUGS = ['delhi', 'mumbai', 'bangalore', 'chennai', 'kolkata', 'hyderabad', 'pune', 'ahmedabad', 'jaipur', 'varanasi'] as const;
const SELECTOR_CITIES = CITY_SLUGS.map(s => CITIES.find(c => c.slug === s)!).filter(Boolean);

// ─── Labels ────────────────────────────────────────────────────
const LABELS: Record<string, Record<string, string>> = {
  en: {
    back: 'Panchang',
    title: 'Rahu Kaal Today',
    rahuKaal: 'Rahu Kaal',
    yamaganda: 'Yamaganda',
    gulika: 'Gulika Kaal',
    sunrise: 'Sunrise',
    sunset: 'Sunset',
    timeline: 'Timeline',
    whatIs: 'What is Rahu Kaal?',
    whatIsText: 'Rahu Kaal (also spelled Rahu Kalam) is a period of approximately 90 minutes each day that is considered inauspicious in Vedic astrology. It is ruled by the shadow planet Rahu, one of the nine celestial bodies (Navagraha). During this time, starting new ventures, journeys, or important activities is traditionally avoided. Rahu Kaal occurs at different times each day based on the day of the week and the local sunrise/sunset times.',
    howCalc: 'How is it Calculated?',
    howCalcText: 'The day (sunrise to sunset) is divided into 8 equal parts. Each part is assigned to a planet in a fixed weekly sequence. The segment assigned to Rahu is Rahu Kaal. For example, on Monday, Rahu Kaal falls in the 2nd segment; on Saturday, it falls in the 6th. Yamaganda (ruled by Yama) and Gulika Kaal (ruled by Saturn\'s son Gulika) are similarly calculated from different segments of the day.',
    avoid: 'Activities to Avoid During Rahu Kaal',
    avoidItems: 'Starting a new business or venture|Signing important contracts or agreements|Beginning a journey or travel|Purchasing property or vehicles|Conducting marriage or engagement ceremonies|Starting construction of a new building|Filing legal documents|Making major financial investments',
    seeAlso: 'See Also',
    inauspicious: 'Inauspicious',
    caution: 'Caution',
  },
  hi: {
    back: 'पंचांग',
    title: 'आज का राहु काल',
    rahuKaal: 'राहु काल',
    yamaganda: 'यमगण्ड',
    gulika: 'गुलिक काल',
    sunrise: 'सूर्योदय',
    sunset: 'सूर्यास्त',
    timeline: 'समयरेखा',
    whatIs: 'राहु काल क्या है?',
    whatIsText: 'राहु काल (राहु कालम्) प्रतिदिन लगभग 90 मिनट की एक अवधि है जिसे वैदिक ज्योतिष में अशुभ माना जाता है। यह छाया ग्रह राहु द्वारा शासित है, जो नवग्रहों में से एक है। इस समय नए कार्य, यात्रा या महत्वपूर्ण गतिविधियां शुरू करना परम्परागत रूप से वर्जित है। राहु काल प्रतिदिन सप्ताह के दिन और स्थानीय सूर्योदय/सूर्यास्त समय के आधार पर अलग-अलग समय पर होता है।',
    howCalc: 'इसकी गणना कैसे होती है?',
    howCalcText: 'दिन (सूर्योदय से सूर्यास्त) को 8 समान भागों में विभाजित किया जाता है। प्रत्येक भाग एक निश्चित साप्ताहिक क्रम में एक ग्रह को सौंपा जाता है। राहु को सौंपा गया भाग राहु काल है। यमगण्ड (यम द्वारा शासित) और गुलिक काल (शनि पुत्र गुलिक द्वारा शासित) की गणना भी इसी प्रकार दिन के अलग-अलग भागों से की जाती है।',
    avoid: 'राहु काल में टालने योग्य कार्य',
    avoidItems: 'नया व्यापार या उद्यम शुरू करना|महत्वपूर्ण अनुबंध या समझौतों पर हस्ताक्षर करना|यात्रा या सफर शुरू करना|सम्पत्ति या वाहन खरीदना|विवाह या सगाई समारोह करना|नए भवन का निर्माण शुरू करना|कानूनी दस्तावेज दाखिल करना|बड़ा वित्तीय निवेश करना',
    seeAlso: 'यह भी देखें',
    inauspicious: 'अशुभ',
    caution: 'सावधानी',
  },
  sa: {
    back: 'पञ्चाङ्गम्',
    title: 'अद्य राहुकालः',
    rahuKaal: 'राहुकालः',
    yamaganda: 'यमगण्डः',
    gulika: 'गुलिककालः',
    sunrise: 'सूर्योदयः',
    sunset: 'सूर्यास्तः',
    timeline: 'समयरेखा',
    whatIs: 'राहुकालः किम्?',
    whatIsText: 'राहुकालः प्रतिदिनं प्रायः नवतिनिमेषाणां कालखण्डमस्ति यत् वैदिकज्योतिषे अशुभं मन्यते। एषः छायाग्रहेण राहुणा शासितः, यः नवग्रहेषु अन्यतमः। अस्मिन् काले नवकार्याणां यात्रायाः महत्त्वपूर्णकार्याणां वा आरम्भः परम्परया वर्जितः।',
    howCalc: 'गणना कथं भवति?',
    howCalcText: 'दिनं (सूर्योदयात् सूर्यास्तपर्यन्तम्) अष्टसमभागेषु विभज्यते। प्रत्येकं भागः निश्चितसाप्ताहिकक्रमेण एकस्मै ग्रहाय दीयते। राहवे दत्तं खण्डं राहुकालः। यमगण्डः गुलिककालश्च एवमेव दिनस्य भिन्नखण्डेभ्यः गण्यन्ते।',
    avoid: 'राहुकाले वर्जनीयानि कार्याणि',
    avoidItems: 'नवव्यापारस्य आरम्भः|महत्त्वपूर्णानुबन्धेषु हस्ताक्षरम्|यात्रायाः आरम्भः|सम्पत्तेः वाहनस्य वा क्रयणम्|विवाहसगाईसमारोहः|नवभवनस्य निर्माणारम्भः|विधिदस्तावेजदाखिला|वृहद्वित्तीयनिवेशः',
    seeAlso: 'एतदपि पश्यतु',
    inauspicious: 'अशुभम्',
    caution: 'सावधानता',
  },
};

// ─── Animation variants ────────────────────────────────────────
const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.5, ease: 'easeOut' as const },
  }),
};

// ─── Helpers ───────────────────────────────────────────────────
function timeToMinutes(t: string): number {
  const [h, m] = t.split(':').map(Number);
  return h * 60 + m;
}

export default function RahuKaalPage() {
  const locale = useLocale() as Locale;
  const isDevanagari = isDevanagariLocale(locale);
  const headingFont = isDevanagari
    ? { fontFamily: 'var(--font-devanagari-heading)' }
    : { fontFamily: 'var(--font-heading)' };
  const L = LABELS[locale] || LABELS.en;

  const defaultCity = getDefaultCityForLocale(locale);
  const [selectedCity, setSelectedCity] = useState<CityData>(defaultCity || SELECTOR_CITIES[0]);

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

  // Date formatting
  const dateStr = useMemo(() => {
    const d = new Date(year, month - 1, day);
    const LOCALE_MAP: Record<string, string> = { en: 'en-IN', hi: 'hi-IN', sa: 'hi-IN', ta: 'ta-IN', te: 'te-IN', bn: 'bn-IN', kn: 'kn-IN', gu: 'gu-IN', mai: 'hi-IN', mr: 'mr-IN' };
    const loc = LOCALE_MAP[locale] || 'en-IN';
    return d.toLocaleDateString(loc, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  }, [year, month, day, locale]);

  // Timeline calculation
  const sunriseMin = timeToMinutes(panchang.sunrise);
  const sunsetMin = timeToMinutes(panchang.sunset);
  const dayDuration = sunsetMin - sunriseMin;

  const timeCards = [
    {
      label: L.rahuKaal,
      start: panchang.rahuKaal.start,
      end: panchang.rahuKaal.end,
      icon: ShieldOff,
      colorClass: 'bg-red-500/10 border-red-500/30',
      textColor: 'text-red-400',
      badgeColor: 'bg-red-500/20 text-red-300',
      badgeText: L.inauspicious,
    },
    {
      label: L.yamaganda,
      start: panchang.yamaganda.start,
      end: panchang.yamaganda.end,
      icon: ShieldAlert,
      colorClass: 'bg-amber-500/10 border-amber-500/30',
      textColor: 'text-amber-400',
      badgeColor: 'bg-amber-500/20 text-amber-300',
      badgeText: L.caution,
    },
    {
      label: L.gulika,
      start: panchang.gulikaKaal.start,
      end: panchang.gulikaKaal.end,
      icon: Shield,
      colorClass: 'bg-orange-500/10 border-orange-500/30',
      textColor: 'text-orange-400',
      badgeColor: 'bg-orange-500/20 text-orange-300',
      badgeText: L.caution,
    },
  ];

  // Timeline segments for Rahu Kaal, Yamaganda, Gulika
  const segments = [
    { start: panchang.rahuKaal.start, end: panchang.rahuKaal.end, color: 'bg-red-500/60', label: L.rahuKaal },
    { start: panchang.yamaganda.start, end: panchang.yamaganda.end, color: 'bg-amber-500/50', label: L.yamaganda },
    { start: panchang.gulikaKaal.start, end: panchang.gulikaKaal.end, color: 'bg-orange-500/50', label: L.gulika },
  ];

  const avoidItems = L.avoidItems.split('|');

  return (
    <main className="min-h-screen bg-bg-primary px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl">
        {/* JSON-LD */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: safeJsonLd(generateBreadcrumbLD('/rahu-kaal', locale)) }}
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
                  : 'bg-bg-secondary border border-white/10 text-text-secondary hover:border-gold-primary/40 hover:text-text-primary'
              }`}
            >
              {tl(city.name, locale)}
            </button>
          ))}
        </motion.div>

        {/* Time cards grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          {timeCards.map((card, i) => {
            const Icon = card.icon;
            return (
              <motion.div
                key={card.label}
                custom={i}
                initial="hidden"
                animate="visible"
                variants={fadeUp}
                className={`rounded-xl border p-5 ${card.colorClass}`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Icon size={20} className={card.textColor} />
                    <h2 className={`font-semibold ${card.textColor}`} style={headingFont}>
                      {card.label}
                    </h2>
                  </div>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${card.badgeColor}`}>
                    {card.badgeText}
                  </span>
                </div>
                <p className="text-2xl font-bold text-text-primary tracking-wide">
                  {card.start} — {card.end}
                </p>
              </motion.div>
            );
          })}
        </div>

        {/* Visual timeline */}
        <motion.div
          custom={3}
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          className="rounded-xl border border-white/10 bg-bg-secondary p-5 mb-8"
        >
          <h2 className="text-sm font-medium text-text-secondary mb-4 flex items-center gap-2">
            <Clock size={14} className="text-gold-primary" />
            {L.timeline} &mdash; {panchang.sunrise} ({L.sunrise}) &rarr; {panchang.sunset} ({L.sunset})
          </h2>
          <div className="relative h-8 rounded-full bg-white/5 overflow-hidden">
            {segments.map((seg) => {
              const startMin = timeToMinutes(seg.start);
              const endMin = timeToMinutes(seg.end);
              const leftPct = ((startMin - sunriseMin) / dayDuration) * 100;
              const widthPct = ((endMin - startMin) / dayDuration) * 100;
              return (
                <div
                  key={seg.label}
                  className={`absolute top-0 h-full ${seg.color} rounded-sm`}
                  style={{ left: `${Math.max(0, leftPct)}%`, width: `${Math.min(widthPct, 100 - leftPct)}%` }}
                  title={`${seg.label}: ${seg.start} — ${seg.end}`}
                />
              );
            })}
          </div>
          <div className="flex justify-between mt-2 text-xs text-text-secondary">
            <span>{panchang.sunrise}</span>
            <span>{panchang.sunset}</span>
          </div>
          {/* Legend */}
          <div className="flex flex-wrap gap-4 mt-3">
            {segments.map((seg) => (
              <div key={seg.label} className="flex items-center gap-1.5 text-xs text-text-secondary">
                <span className={`inline-block w-3 h-3 rounded-sm ${seg.color}`} />
                {seg.label}
              </div>
            ))}
          </div>
        </motion.div>

        <GoldDivider />

        {/* Educational section */}
        <motion.section
          custom={4}
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          className="space-y-8 mt-4"
        >
          {/* What is Rahu Kaal */}
          <div>
            <h2 className="text-xl font-bold text-gold-light mb-3" style={headingFont}>
              {L.whatIs}
            </h2>
            <p className="text-text-primary leading-relaxed">{L.whatIsText}</p>
          </div>

          {/* How calculated */}
          <div>
            <h2 className="text-xl font-bold text-gold-light mb-3" style={headingFont}>
              {L.howCalc}
            </h2>
            <p className="text-text-primary leading-relaxed">{L.howCalcText}</p>
          </div>

          {/* Activities to avoid */}
          <div>
            <h2 className="text-xl font-bold text-gold-light mb-3" style={headingFont}>
              <AlertTriangle size={18} className="inline-block mr-2 text-red-400 -mt-0.5" />
              {L.avoid}
            </h2>
            <ul className="space-y-2 ml-1">
              {avoidItems.map((item, i) => (
                <li key={i} className="flex items-start gap-2 text-text-primary">
                  <span className="text-red-400 mt-1.5 flex-shrink-0">&#8226;</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </motion.section>

        <GoldDivider className="mt-8" />

        {/* See Also */}
        <motion.section
          custom={5}
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          className="mt-4 mb-12"
        >
          <h2 className="text-lg font-bold text-gold-light mb-4" style={headingFont}>
            {L.seeAlso}
          </h2>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/choghadiya"
              className="px-4 py-2 rounded-lg bg-bg-secondary border border-white/10 text-text-primary hover:border-gold-primary/40 hover:text-gold-light transition-all text-sm"
            >
              Choghadiya
            </Link>
            <Link
              href="/panchang"
              className="px-4 py-2 rounded-lg bg-bg-secondary border border-white/10 text-text-primary hover:border-gold-primary/40 hover:text-gold-light transition-all text-sm"
            >
              {L.back}
            </Link>
          </div>
        </motion.section>
      </div>
    </main>
  );
}
