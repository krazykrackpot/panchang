'use client';

import { useState, useMemo, useEffect } from 'react';
import { useLocale } from 'next-intl';
import { motion } from 'framer-motion';
import { Clock, ArrowLeft, Sparkles, Timer, CalendarDays } from 'lucide-react';
import GoldDivider from '@/components/ui/GoldDivider';
import RelatedLinks from '@/components/ui/RelatedLinks';
import { getLearnLinksForTool } from '@/lib/seo/cross-links';
import { Link } from '@/lib/i18n/navigation';
import { useLocationStore } from '@/stores/location-store';
import { dateToJD, approximateSunriseSafe, approximateSunsetSafe, formatTime } from '@/lib/ephem/astronomical';
import { getUTCOffsetForDate } from '@/lib/utils/timezone';
import { GRAHAS } from '@/lib/constants/grahas';
import { tl } from '@/lib/utils/trilingual';
import { safeJsonLd } from '@/lib/seo/safe-jsonld';
import { generateBreadcrumbLD } from '@/lib/seo/structured-data';
import { isDevanagariLocale } from '@/lib/utils/locale-fonts';
import {
  calculateHoras,
  findBestHorasForActivities,
  parseHHMM,
  type HoraEntry,
  type HoraData,
} from '@/lib/hora/hora-calculator';

// ── Planet colors (inline style, not dynamic Tailwind) ─────────────
const PLANET_COLORS: Record<number, string> = {
  0: '#e67e22', // Sun - orange
  1: '#ecf0f1', // Moon - silver
  2: '#e74c3c', // Mars - red
  3: '#2ecc71', // Mercury - green
  4: '#f39c12', // Jupiter - gold
  5: '#e8e6e3', // Venus - cream
  6: '#3498db', // Saturn - blue
};

// ── Labels ─────────────────────────────────────────────────────────
const LABELS: Record<string, Record<string, string>> = {
  en: {
    back: 'Panchang',
    title: 'Hora — Planetary Hours',
    subtitle: 'Each hour of the day is ruled by a planet in the Chaldean sequence. Choose the right hora for your activities.',
    currentHora: 'Current Hora',
    timeRemaining: 'Time Remaining',
    dayLord: 'Day Lord',
    sunrise: 'Sunrise',
    sunset: 'Sunset',
    dayHoras: 'Day Horas',
    nightHoras: 'Night Horas',
    timeline: 'Full 24-Hour Timeline',
    bestFor: 'Best Hora For...',
    activity: 'Activity',
    planet: 'Planet',
    nextSlot: 'Next Slot Today',
    none: 'None remaining today',
    noLocation: 'Set your location to see hora timings',
    detectLocation: 'Detect Location',
    whatIsHora: 'What are Planetary Hours?',
    whatIsHoraText: 'Planetary hours (Hora) are an ancient time-division system used in Vedic and Western astrology. The period from sunrise to sunset is divided into 12 equal parts (day horas), and sunset to next sunrise into 12 more (night horas). Each hora is governed by one of the 7 classical planets following the Chaldean order: Saturn, Jupiter, Mars, Sun, Venus, Mercury, Moon. The first hora of each day is ruled by the day\'s planetary lord (e.g., Sunday = Sun, Monday = Moon).',
    howToUse: 'How to Use Hora',
    howToUseText: 'Start important activities during a hora ruled by a favourable planet. Mercury hora is ideal for communication and business. Jupiter hora favours education, law, and spirituality. Venus hora suits arts and relationships. Avoid starting auspicious work during Saturn or Mars hora unless the activity specifically aligns (e.g., construction in Saturn hora).',
    min: 'min',
    hr: 'hr',
  },
  hi: {
    back: 'पंचांग',
    title: 'होरा — ग्रह घण्टे',
    subtitle: 'दिन के प्रत्येक घण्टे पर एक ग्रह का शासन होता है। अपने कार्यों के लिए सही होरा चुनें।',
    currentHora: 'वर्तमान होरा',
    timeRemaining: 'शेष समय',
    dayLord: 'दिन का स्वामी',
    sunrise: 'सूर्योदय',
    sunset: 'सूर्यास्त',
    dayHoras: 'दिवा होरा',
    nightHoras: 'रात्रि होरा',
    timeline: 'पूर्ण 24-घण्टा समयरेखा',
    bestFor: 'किस कार्य के लिए सर्वोत्तम होरा...',
    activity: 'कार्य',
    planet: 'ग्रह',
    nextSlot: 'आज का अगला समय',
    none: 'आज शेष नहीं',
    noLocation: 'होरा समय देखने के लिए स्थान निर्धारित करें',
    detectLocation: 'स्थान पहचानें',
    whatIsHora: 'ग्रह होरा क्या है?',
    whatIsHoraText: 'ग्रह होरा एक प्राचीन काल-विभाजन पद्धति है। सूर्योदय से सूर्यास्त तक 12 समान भागों (दिवा होरा) और सूर्यास्त से अगले सूर्योदय तक 12 भागों (रात्रि होरा) में विभाजित किया जाता है। प्रत्येक होरा का स्वामी कैल्डियन क्रम में 7 शास्त्रीय ग्रहों में से एक होता है। प्रत्येक दिन की पहली होरा उस दिन के ग्रह स्वामी द्वारा शासित होती है।',
    howToUse: 'होरा का उपयोग कैसे करें',
    howToUseText: 'महत्वपूर्ण कार्य अनुकूल ग्रह की होरा में आरम्भ करें। बुध होरा संवाद और व्यापार के लिए उत्तम है। गुरु होरा शिक्षा, कानून और आध्यात्मिकता के लिए अनुकूल है। शुक्र होरा कला और सम्बन्धों के लिए उपयुक्त है।',
    min: 'मिनट',
    hr: 'घंटा',
  },
  sa: {
    back: 'पञ्चाङ्गम्',
    title: 'होरा — ग्रहघण्टाः',
    subtitle: 'प्रत्येकं दिनस्य घण्टा एकेन ग्रहेण शासितः। स्वकार्याय उचितां होरां चिनुत।',
    currentHora: 'वर्तमानहोरा',
    timeRemaining: 'अवशिष्टसमयः',
    dayLord: 'दिनस्वामी',
    sunrise: 'सूर्योदयः',
    sunset: 'सूर्यास्तः',
    dayHoras: 'दिवाहोराः',
    nightHoras: 'रात्रिहोराः',
    timeline: 'पूर्णा चतुर्विंशतिघण्टासमयरेखा',
    bestFor: 'कस्मै कार्याय श्रेष्ठा होरा...',
    activity: 'कार्यम्',
    planet: 'ग्रहः',
    nextSlot: 'अद्य आगामिसमयः',
    none: 'अद्य न अवशिष्टम्',
    noLocation: 'होरासमयार्थं स्थानं निर्धारयतु',
    detectLocation: 'स्थानं पहचानयतु',
    whatIsHora: 'ग्रहहोरा किम्?',
    whatIsHoraText: 'ग्रहहोरा प्राचीनकालविभाजनपद्धतिः अस्ति। सूर्योदयात् सूर्यास्तपर्यन्तं द्वादशसमभागेषु विभज्यते। प्रत्येकं होरायाः स्वामी कैल्डियनक्रमेण सप्तशास्त्रीयग्रहेषु एकः भवति।',
    howToUse: 'होरायाः उपयोगः कथम्',
    howToUseText: 'महत्त्वपूर्णानि कार्याणि अनुकूलग्रहस्य होरायां आरभत। बुधहोरा संवादव्यापारयोः उत्तमा। गुरुहोरा शिक्षाविधिआध्यात्मिकतायै अनुकूला।',
    min: 'निमेषाः',
    hr: 'घण्टा',
  },
};

function L(key: string, locale: string): string {
  return LABELS[locale]?.[key] ?? LABELS['en'][key] ?? key;
}

// ── Component ─────────────────────────────────────────────────────

export default function HoraPage() {
  const locale = useLocale();
  const devFont = isDevanagariLocale(locale) ? { fontFamily: 'var(--font-devanagari-body)' } : {};
  const { lat, lng, name: locationName, timezone, confirmed, detect, detecting } = useLocationStore();

  // Date picker state
  const [selectedDate, setSelectedDate] = useState(() => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
  });

  // Current time state — updates every 30s
  const [nowMinutes, setNowMinutes] = useState(() => {
    const now = new Date();
    return now.getHours() * 60 + now.getMinutes();
  });

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      setNowMinutes(now.getHours() * 60 + now.getMinutes());
    }, 30_000);
    return () => clearInterval(timer);
  }, []);

  // Is selected date today?
  const isToday = useMemo(() => {
    const now = new Date();
    const todayStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
    return selectedDate === todayStr;
  }, [selectedDate]);

  // Compute hora data
  const horaData: HoraData | null = useMemo(() => {
    if (lat === null || lng === null) return null;

    const [y, m, d] = selectedDate.split('-').map(Number);
    const tz = timezone || 'UTC';
    const tzOffset = getUTCOffsetForDate(y, m, d, tz);
    const jd = dateToJD(y, m, d, 12 - tzOffset); // noon local → UT

    // Sunrise/sunset in UT decimal hours
    const sunriseUT = approximateSunriseSafe(jd, lat, lng);
    const sunsetUT = approximateSunsetSafe(jd, lat, lng);

    // Next day sunrise
    const nextDaySunriseUT = approximateSunriseSafe(jd + 1, lat, lng);

    // Convert to local HH:MM
    const sunriseLocal = formatTime(sunriseUT, tzOffset);
    const sunsetLocal = formatTime(sunsetUT, tzOffset);
    const nextSunriseLocal = formatTime(nextDaySunriseUT, tzOffset);

    // Weekday: 0=Sunday
    const dateObj = new Date(y, m - 1, d);
    const weekday = dateObj.getDay();

    return calculateHoras(
      dateObj,
      sunriseLocal,
      sunsetLocal,
      nextSunriseLocal,
      weekday,
      isToday ? nowMinutes : -1,
    );
  }, [lat, lng, timezone, selectedDate, nowMinutes, isToday]);

  // Best horas for activities
  const bestHoras = useMemo(() => {
    if (!horaData || !isToday) return null;
    return findBestHorasForActivities(horaData.horas, nowMinutes);
  }, [horaData, isToday, nowMinutes]);

  // Time remaining in current hora
  const timeRemaining = useMemo(() => {
    if (!horaData?.currentHora) return null;
    const endMin = parseHHMM(horaData.currentHora.endTime);
    const diff = endMin - nowMinutes;
    if (diff <= 0) return null;
    const hrs = Math.floor(diff / 60);
    const mins = diff % 60;
    if (hrs > 0) return `${hrs} ${L('hr', locale)} ${mins} ${L('min', locale)}`;
    return `${mins} ${L('min', locale)}`;
  }, [horaData, nowMinutes, locale]);

  // Breadcrumb JSON-LD
  const breadcrumbLD = generateBreadcrumbLD('/hora', locale);

  return (
    <main className="min-h-screen bg-bg-primary pt-20 pb-16 px-4 sm:px-6" style={devFont}>
      {/* Breadcrumb LD */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(breadcrumbLD) }} />

      <div className="max-w-4xl mx-auto">
        {/* Back link */}
        <Link href="/panchang" className="inline-flex items-center gap-1.5 text-text-secondary hover:text-gold-light transition-colors text-sm mb-6">
          <ArrowLeft className="w-4 h-4" />
          {L('back', locale)}
        </Link>

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <h1 className="text-3xl sm:text-4xl font-bold text-gold-gradient mb-2" style={{ fontFamily: 'var(--font-heading)' }}>
            {L('title', locale)}
          </h1>
          <p className="text-text-secondary text-sm sm:text-base mb-6">{L('subtitle', locale)}</p>
        </motion.div>

        <GoldDivider className="mb-6" />

        {/* Date picker */}
        <div className="flex flex-wrap items-center gap-4 mb-6">
          <div className="flex items-center gap-2">
            <CalendarDays className="w-5 h-5 text-gold-primary" />
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/20 rounded-lg px-3 py-2 text-text-primary text-sm focus:outline-none focus:border-gold-primary/50"
            />
          </div>
          {confirmed && locationName && (
            <span className="text-text-secondary text-sm">{locationName}</span>
          )}
        </div>

        {/* No location state */}
        {!confirmed && (
          <div className="text-center py-16">
            <Clock className="w-12 h-12 text-gold-primary/30 mx-auto mb-4" />
            <p className="text-text-secondary mb-4">{L('noLocation', locale)}</p>
            <button
              onClick={() => detect()}
              disabled={detecting}
              className="px-6 py-2.5 bg-gold-primary/15 border border-gold-primary/30 rounded-lg text-gold-light hover:bg-gold-primary/25 transition-colors text-sm"
            >
              {detecting ? '...' : L('detectLocation', locale)}
            </button>
          </div>
        )}

        {/* Main content */}
        {confirmed && horaData && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4, delay: 0.1 }}>
            {/* Day info bar */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
              <InfoCard label={L('dayLord', locale)} value={tl(horaData.dayLordName, locale)} color={PLANET_COLORS[horaData.dayLord]} />
              <InfoCard label={L('sunrise', locale)} value={horaData.sunrise} />
              <InfoCard label={L('sunset', locale)} value={horaData.sunset} />
              <InfoCard label={isToday ? L('timeRemaining', locale) : L('dayHoras', locale)} value={isToday ? (timeRemaining ?? '--') : `${horaData.dayDuration} ${L('min', locale)}`} />
            </div>

            {/* Current hora highlight */}
            {horaData.currentHora && isToday && (
              <CurrentHoraCard hora={horaData.currentHora} locale={locale} timeRemaining={timeRemaining} />
            )}

            {/* 24-hour timeline */}
            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gold-light mb-4 flex items-center gap-2">
                <Timer className="w-5 h-5" />
                {L('timeline', locale)}
              </h2>

              {/* Day horas */}
              <h3 className="text-sm font-medium text-text-secondary mb-2 uppercase tracking-wider">{L('dayHoras', locale)}</h3>
              <div className="grid gap-1.5 mb-4">
                {horaData.horas.filter(h => h.isDayHora).map(h => (
                  <HoraBar key={h.horaNumber} hora={h} locale={locale} />
                ))}
              </div>

              {/* Night horas */}
              <h3 className="text-sm font-medium text-text-secondary mb-2 uppercase tracking-wider">{L('nightHoras', locale)}</h3>
              <div className="grid gap-1.5">
                {horaData.horas.filter(h => !h.isDayHora).map(h => (
                  <HoraBar key={h.horaNumber} hora={h} locale={locale} />
                ))}
              </div>
            </section>

            {/* Best hora for activities */}
            {bestHoras && isToday && (
              <section className="mb-8">
                <h2 className="text-xl font-semibold text-gold-light mb-4 flex items-center gap-2">
                  <Sparkles className="w-5 h-5" />
                  {L('bestFor', locale)}
                </h2>
                <div className="bg-gradient-to-br from-[#2d1b69]/35 via-[#1a1040]/45 to-[#0a0e27] border border-gold-primary/10 rounded-xl overflow-hidden">
                  <div className="grid grid-cols-3 text-xs font-medium text-text-secondary uppercase tracking-wider px-4 py-2.5 border-b border-gold-primary/10">
                    <span>{L('activity', locale)}</span>
                    <span>{L('planet', locale)}</span>
                    <span>{L('nextSlot', locale)}</span>
                  </div>
                  {bestHoras.map((item, idx) => (
                    <div key={idx} className="grid grid-cols-3 px-4 py-2.5 text-sm border-b border-gold-primary/5 last:border-b-0 hover:bg-gold-primary/5 transition-colors">
                      <span className="text-text-primary">{locale === 'hi' || locale === 'sa' ? item.activityHi : item.activity}</span>
                      <span className="flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full" style={{ backgroundColor: PLANET_COLORS[item.planet] }} />
                        {tl(GRAHAS[item.planet].name, locale)}
                      </span>
                      <span className="text-text-secondary">
                        {item.nextHora ? `${item.nextHora.startTime}–${item.nextHora.endTime}` : L('none', locale)}
                      </span>
                    </div>
                  ))}
                </div>
              </section>
            )}

            <GoldDivider className="mb-8" />

            {/* Educational content */}
            <section className="space-y-6 mb-8">
              <div>
                <h2 className="text-xl font-semibold text-gold-light mb-2">{L('whatIsHora', locale)}</h2>
                <p className="text-text-secondary text-sm leading-relaxed">{L('whatIsHoraText', locale)}</p>
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gold-light mb-2">{L('howToUse', locale)}</h2>
                <p className="text-text-secondary text-sm leading-relaxed">{L('howToUseText', locale)}</p>
              </div>
            </section>

            <RelatedLinks type="learn" links={getLearnLinksForTool('/hora')} locale={locale} className="mt-8" />
          </motion.div>
        )}
      </div>
    </main>
  );
}

// ── Sub-components ─────────────────────────────────────────────────

function InfoCard({ label, value, color }: { label: string; value: string; color?: string }) {
  return (
    <div className="bg-gradient-to-br from-[#2d1b69]/35 via-[#1a1040]/45 to-[#0a0e27] border border-gold-primary/10 rounded-xl px-4 py-3">
      <div className="text-xs text-text-secondary mb-1">{label}</div>
      <div className="text-base font-semibold text-text-primary" style={color ? { color } : undefined}>{value}</div>
    </div>
  );
}

function CurrentHoraCard({ hora, locale, timeRemaining }: { hora: HoraEntry; locale: string; timeRemaining: string | null }) {
  const color = PLANET_COLORS[hora.planet];
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      className="mb-6 p-5 rounded-xl border-2"
      style={{
        borderColor: color,
        backgroundColor: `${color}10`,
        boxShadow: `0 0 30px ${color}15`,
      }}
    >
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <div className="text-xs text-text-secondary uppercase tracking-wider mb-1">
            {LABELS[locale]?.currentHora ?? LABELS.en.currentHora}
          </div>
          <div className="text-2xl font-bold" style={{ color }}>
            {tl(hora.planetName, locale)} {LABELS[locale]?.currentHora ? '' : ''}
          </div>
          <div className="text-sm text-text-secondary mt-1">{hora.startTime} – {hora.endTime}</div>
        </div>
        <div className="text-right">
          {timeRemaining && (
            <div>
              <div className="text-xs text-text-secondary">{LABELS[locale]?.timeRemaining ?? LABELS.en.timeRemaining}</div>
              <div className="text-lg font-semibold text-gold-light">{timeRemaining}</div>
            </div>
          )}
        </div>
      </div>
      <div className="text-sm text-text-secondary mt-3 italic">{hora.signification}</div>
    </motion.div>
  );
}

function HoraBar({ hora, locale }: { hora: HoraEntry; locale: string }) {
  const color = PLANET_COLORS[hora.planet];
  return (
    <div
      className={`flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all ${
        hora.isCurrent
          ? 'border-2 ring-1 ring-gold-primary/30'
          : 'border border-transparent hover:border-gold-primary/10'
      }`}
      style={{
        backgroundColor: hora.isCurrent ? `${color}18` : `${color}08`,
        borderColor: hora.isCurrent ? color : undefined,
      }}
    >
      {/* Planet dot */}
      <span className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: color }} />

      {/* Planet name */}
      <span className="w-20 sm:w-28 text-sm font-medium truncate" style={{ color }}>
        {tl(hora.planetName, locale)}
      </span>

      {/* Time range */}
      <span className="text-sm text-text-secondary font-mono whitespace-nowrap">
        {hora.startTime} – {hora.endTime}
      </span>

      {/* Signification (hidden on small screens) */}
      <span className="hidden sm:block text-xs text-text-secondary truncate ml-auto">
        {hora.signification}
      </span>

      {/* Current indicator */}
      {hora.isCurrent && (
        <span className="ml-auto sm:ml-2 text-xs font-medium px-2 py-0.5 rounded-full bg-gold-primary/20 text-gold-light whitespace-nowrap">
          NOW
        </span>
      )}
    </div>
  );
}
