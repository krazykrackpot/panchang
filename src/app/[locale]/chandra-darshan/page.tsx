'use client';

import { useState, useMemo, useEffect } from 'react';
import { useLocale } from 'next-intl';
import { motion } from 'framer-motion';
import { Moon, Eye, EyeOff, Compass, Clock, CalendarDays, ArrowLeft, Telescope, Info, MapPin } from 'lucide-react';
import GoldDivider from '@/components/ui/GoldDivider';
import InfoBlock from '@/components/ui/InfoBlock';
import RelatedLinks from '@/components/ui/RelatedLinks';
import { getLearnLinksForTool } from '@/lib/seo/cross-links';
import { Link } from '@/lib/i18n/navigation';
import { useLocationStore } from '@/stores/location-store';
import { getUTCOffsetForDate } from '@/lib/utils/timezone';
import { isDevanagariLocale } from '@/lib/utils/locale-fonts';
import { safeJsonLd } from '@/lib/seo/safe-jsonld';
import { generateBreadcrumbLD } from '@/lib/seo/structured-data';
import {
  computeChandraDarshan,
  getUpcomingDarshan,
  type ChandraDarshanInfo,
} from '@/lib/panchang/chandra-darshan';

// ── Labels ─────────────────────────────────────────────────────────
const LABELS: Record<string, Record<string, string>> = {
  en: {
    back: 'Tools',
    title: 'Chandra Darshan',
    subtitle: 'New Crescent Moon Sighting Calculator',
    tonightStatus: 'Tonight\'s Moon Visibility',
    moonAge: 'Moon Age',
    hours: 'hours',
    elongation: 'Elongation',
    altitude: 'Altitude at Sunset',
    bestTime: 'Best Viewing Time',
    direction: 'Direction',
    nextDarshan: 'Next Chandra Darshan',
    newMoonOn: 'Last New Moon (Amavasya)',
    upcoming: 'Upcoming Chandra Darshan Dates',
    date: 'Date',
    age: 'Age (hrs)',
    elong: 'Elong.',
    status: 'Status',
    notVisible: 'Not Visible',
    difficult: 'Difficult',
    visible: 'Visible',
    easilyVisible: 'Easily Visible',
    noLocation: 'Set your location to calculate Moon visibility',
    detectLocation: 'Detect Location',
    whatIs: 'What is Chandra Darshan?',
    whatIsText: 'Chandra Darshan (चन्द्र दर्शन) is the first sighting of the new crescent Moon after Amavasya (new Moon). In the Hindu calendar, sighting the new Moon — especially on Shukla Dwitiya (the second lunar day) — is considered highly auspicious. The Islamic calendar (Hijri) also depends on Moon sighting (Hilal) to mark the beginning of each lunar month.',
    significance: 'Religious Significance',
    significanceText: 'Sighting the new crescent Moon on Shukla Dwitiya is called "Chandra Darshan" and is believed to bring prosperity and remove sins. On Karva Chauth, married women break their fast only after sighting the Moon through a sieve. In Islam, the sighting of the Hilal (new Moon) determines the start of Ramadan, Eid, and other months.',
    howToSpot: 'How to Spot the Crescent',
    howToSpotText: 'Look toward the western horizon 20-30 minutes after sunset. The crescent will be a very thin arc of light just above where the Sun set. A clear, unobstructed horizon helps enormously. Binoculars can reveal a crescent that is invisible to the naked eye. The Moon sets soon after the Sun on the first evening, so you have only a brief window.',
    howCalculated: 'How is Visibility Calculated?',
    howCalculatedText: 'We use a simplified version of the Yallop/Odeh model, considering three key factors: (1) Moon age — hours since the last Sun-Moon conjunction, (2) Elongation — the angular distance between Moon and Sun in degrees, and (3) Moon altitude at sunset. Generally, a Moon younger than 15 hours is never visible. Between 15-24 hours with >10\u00b0 elongation, sighting is difficult. After 24-36 hours with >12\u00b0 elongation, naked-eye visibility is likely.',
    faq1q: 'Can I always see the crescent on Shukla Pratipada?',
    faq1a: 'Not always. Shukla Pratipada (the first lunar day after Amavasya) often has a Moon that is too young and too close to the Sun for naked-eye sighting. The crescent typically becomes visible on Dwitiya (second day) or later, depending on the Moon\'s age, elongation, and your location\'s horizon conditions.',
    faq2q: 'Why does the visibility differ by location?',
    faq2a: 'The crescent Moon\'s altitude above the horizon at sunset depends on your geographic latitude and longitude. At the same moment, the Moon may be above the horizon in one location and below it in another. Western regions see the crescent earlier than eastern regions on the same date.',
    faq3q: 'What is the connection between Chandra Darshan and the Hindu calendar?',
    faq3a: 'In the Purnimant system (North India), the month begins after Purnima and the new crescent marks the transition from Krishna Paksha to Shukla Paksha. In the Amant system (South/West India), the month begins after Amavasya — so Chandra Darshan marks the very start of a new month.',
    faq4q: 'Is Chandra Darshan the same as Hilal in Islam?',
    faq4a: 'Both refer to sighting the new crescent Moon, but they serve different calendrical systems. Hilal determines the start of Islamic months (including Ramadan). Chandra Darshan is observed in the Hindu tradition for auspiciousness. The astronomical phenomenon is identical — both depend on Moon age, elongation, and horizon conditions.',
    learnMore: 'Learn more about Chandra Darshan',
  },
  hi: {
    back: 'उपकरण',
    title: 'चन्द्र दर्शन',
    subtitle: 'नव चन्द्र दृश्यता गणक',
    tonightStatus: 'आज रात चन्द्रमा की दृश्यता',
    moonAge: 'चन्द्रमा की आयु',
    hours: 'घण्टे',
    elongation: 'दूरी (कोण)',
    altitude: 'सूर्यास्त पर ऊँचाई',
    bestTime: 'सर्वोत्तम देखने का समय',
    direction: 'दिशा',
    nextDarshan: 'अगला चन्द्र दर्शन',
    newMoonOn: 'अंतिम अमावस्या',
    upcoming: 'आगामी चन्द्र दर्शन तिथियाँ',
    date: 'तिथि',
    age: 'आयु (घण्टे)',
    elong: 'दूरी',
    status: 'स्थिति',
    notVisible: 'दृश्य नहीं',
    difficult: 'कठिन',
    visible: 'दृश्य',
    easilyVisible: 'सुगम दृश्य',
    noLocation: 'चन्द्रमा की दृश्यता गणना के लिए अपना स्थान निर्धारित करें',
    detectLocation: 'स्थान पहचानें',
    whatIs: 'चन्द्र दर्शन क्या है?',
    whatIsText: 'चन्द्र दर्शन अमावस्या (नव चन्द्रमा) के बाद नवीन चन्द्र दर्शन है। हिन्दू कैलेंडर में, नवीन चन्द्रमा का दर्शन — विशेषकर शुक्ल द्वितीया पर — अत्यन्त शुभ माना जाता है। इस्लामी कैलेंडर (हिजरी) भी प्रत्येक चन्द्र मास के आरम्भ के लिए चन्द्र दर्शन (हिलाल) पर निर्भर करता है।',
    significance: 'धार्मिक महत्त्व',
    significanceText: 'शुक्ल द्वितीया पर नवीन चन्द्र का दर्शन "चन्द्र दर्शन" कहलाता है और यह समृद्धि लाने वाला एवं पापनाशक माना जाता है। करवा चौथ पर विवाहित स्त्रियाँ छलनी से चन्द्रमा देखकर ही व्रत तोड़ती हैं।',
    howToSpot: 'चन्द्र दर्शन कैसे करें',
    howToSpotText: 'सूर्यास्त के 20-30 मिनट बाद पश्चिमी क्षितिज की ओर देखें। चन्द्रमा एक बहुत पतली चाप के रूप में दिखेगा। स्वच्छ, बाधारहित क्षितिज बहुत सहायक होता है। दूरबीन उन चन्द्रमाओं को भी दिखा सकती है जो नग्न नेत्रों से अदृश्य हों।',
    howCalculated: 'दृश्यता की गणना कैसे होती है?',
    howCalculatedText: 'हम यल्लोप/ओदेह मॉडल का सरलीकृत रूप उपयोग करते हैं। तीन मुख्य कारक: (1) चन्द्र आयु — अंतिम सूर्य-चन्द्र युति से घण्टे, (2) दूरी — चन्द्रमा और सूर्य के बीच कोणीय दूरी, (3) सूर्यास्त पर चन्द्रमा की ऊँचाई।',
    faq1q: 'क्या शुक्ल प्रतिपदा पर हमेशा चन्द्र दर्शन होता है?',
    faq1a: 'नहीं, हमेशा नहीं। शुक्ल प्रतिपदा पर प्रायः चन्द्रमा बहुत छोटा और सूर्य के बहुत निकट होता है। दर्शन सामान्यतः द्वितीया या उसके बाद सम्भव होता है।',
    faq2q: 'विभिन्न स्थानों पर दृश्यता भिन्न क्यों होती है?',
    faq2a: 'सूर्यास्त पर चन्द्रमा की ऊँचाई आपके भौगोलिक स्थान पर निर्भर करती है। एक ही समय पर चन्द्रमा एक स्थान पर क्षितिज से ऊपर और दूसरे स्थान पर नीचे हो सकता है।',
    faq3q: 'चन्द्र दर्शन और हिन्दू कैलेंडर का सम्बन्ध क्या है?',
    faq3a: 'अमान्त पद्धति में मास अमावस्या के बाद आरम्भ होता है — अतः चन्द्र दर्शन नवीन मास का आरम्भ चिह्नित करता है। पूर्णिमान्त पद्धति में यह कृष्ण पक्ष से शुक्ल पक्ष में संक्रमण है।',
    faq4q: 'क्या चन्द्र दर्शन और इस्लामी हिलाल एक ही हैं?',
    faq4a: 'दोनों नवीन चन्द्रमा के दर्शन को सन्दर्भित करते हैं, परन्तु भिन्न कैलेण्डर प्रणालियों के लिए। खगोलीय घटना समान है।',
    learnMore: 'चन्द्र दर्शन के बारे में और जानें',
  },
};

const l = (key: string, locale: string) => LABELS[locale]?.[key] ?? LABELS.en[key] ?? key;

const STATUS_COLORS: Record<ChandraDarshanInfo['assessment'], string> = {
  not_visible: '#ef4444',
  difficult: '#f59e0b',
  visible: '#22c55e',
  easily_visible: '#10b981',
};

const STATUS_BG: Record<ChandraDarshanInfo['assessment'], string> = {
  not_visible: 'rgba(239, 68, 68, 0.12)',
  difficult: 'rgba(245, 158, 11, 0.12)',
  visible: 'rgba(34, 197, 94, 0.12)',
  easily_visible: 'rgba(16, 185, 129, 0.12)',
};

function formatDateLocal(isoDate: string, locale: string): string {
  try {
    const [y, m, d] = isoDate.split('-').map(Number);
    const date = new Date(Date.UTC(y, m - 1, d));
    return date.toLocaleDateString(locale === 'hi' ? 'hi-IN' : 'en-GB', {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      timeZone: 'UTC',
    });
  } catch {
    return isoDate;
  }
}

export default function ChandraDarshanPage() {
  const locale = useLocale();
  const { lat, lng, name: locationName, timezone, confirmed, detect, detecting } = useLocationStore();
  const isHi = isDevanagariLocale(locale);
  const hf = isHi ? { fontFamily: 'var(--font-devanagari-heading)' } : { fontFamily: 'var(--font-heading)' };
  const bf = isHi ? { fontFamily: 'var(--font-devanagari-body)' } : {};

  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth() + 1;
  const day = now.getDate();

  const tzOffset = useMemo(() => {
    if (!confirmed || !timezone) return 0;
    return getUTCOffsetForDate(year, month, day, timezone);
  }, [confirmed, timezone, year, month, day]);

  const todayInfo = useMemo(() => {
    if (!confirmed || lat === null || lng === null) return null;
    return computeChandraDarshan(year, month, day, lat, lng, tzOffset);
  }, [confirmed, lat, lng, year, month, day, tzOffset]);

  const upcomingList = useMemo(() => {
    if (!confirmed || lat === null || lng === null) return [];
    return getUpcomingDarshan(year, month, day, lat, lng, tzOffset, 6);
  }, [confirmed, lat, lng, year, month, day, tzOffset]);

  const statusLabel = (a: ChandraDarshanInfo['assessment']) => {
    switch (a) {
      case 'not_visible': return l('notVisible', locale);
      case 'difficult': return l('difficult', locale);
      case 'visible': return l('visible', locale);
      case 'easily_visible': return l('easilyVisible', locale);
    }
  };

  const learnLinks = getLearnLinksForTool('/chandra-darshan');
  const breadcrumbLD = generateBreadcrumbLD('/chandra-darshan', locale);

  return (
    <div className="min-h-screen bg-bg-primary">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(breadcrumbLD) }} />

      {/* Header */}
      <div className="max-w-4xl mx-auto px-4 pt-6 pb-2">
        <Link href="/tools" className="inline-flex items-center gap-1.5 text-sm text-text-secondary hover:text-gold-light transition-colors mb-4">
          <ArrowLeft size={14} /> {l('back', locale)}
        </Link>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#2d1b69]/60 via-[#1a1040]/70 to-[#0a0e27] border border-gold-primary/20 flex items-center justify-center">
              <Moon size={24} className="text-gold-light" />
            </div>
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold text-gold-gradient" style={hf}>{l('title', locale)}</h1>
              <p className="text-text-secondary text-sm" style={bf}>{l('subtitle', locale)}</p>
            </div>
          </div>
        </motion.div>

        {locationName && (
          <p className="flex items-center gap-1.5 text-xs text-text-secondary mt-2">
            <MapPin size={12} className="text-gold-dark" /> {locationName}
          </p>
        )}
      </div>

      <GoldDivider className="my-4" />

      <div className="max-w-4xl mx-auto px-4 pb-16 space-y-6">
        {/* No location state */}
        {!confirmed && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="rounded-2xl bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 p-8 text-center"
          >
            <Moon size={48} className="text-gold-primary/40 mx-auto mb-4" />
            <p className="text-text-secondary mb-4" style={bf}>{l('noLocation', locale)}</p>
            <button
              onClick={() => detect()}
              disabled={detecting}
              className="px-6 py-2.5 rounded-xl bg-gold-primary/15 border border-gold-primary/30 text-gold-light font-medium hover:bg-gold-primary/25 transition-all disabled:opacity-50"
            >
              {detecting ? '...' : l('detectLocation', locale)}
            </button>
          </motion.div>
        )}

        {/* Tonight's status card */}
        {todayInfo && (
          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="rounded-2xl bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 overflow-hidden"
          >
            {/* Status header */}
            <div
              className="px-6 py-4 flex items-center gap-3"
              style={{ backgroundColor: STATUS_BG[todayInfo.assessment], borderBottom: `1px solid ${STATUS_COLORS[todayInfo.assessment]}33` }}
            >
              {todayInfo.isVisible ? <Eye size={24} style={{ color: STATUS_COLORS[todayInfo.assessment] }} /> : <EyeOff size={24} style={{ color: STATUS_COLORS[todayInfo.assessment] }} />}
              <div>
                <h2 className="text-lg font-bold" style={{ color: STATUS_COLORS[todayInfo.assessment], ...hf }}>{l('tonightStatus', locale)}</h2>
                <p className="text-sm font-semibold" style={{ color: STATUS_COLORS[todayInfo.assessment] }}>{statusLabel(todayInfo.assessment)}</p>
              </div>
            </div>

            {/* Description */}
            <div className="px-6 py-4">
              <p className="text-text-secondary text-sm leading-relaxed" style={bf}>
                {locale === 'hi' ? todayInfo.description.hi : todayInfo.description.en}
              </p>
            </div>

            {/* Details grid */}
            <div className="px-6 pb-5 grid grid-cols-2 sm:grid-cols-3 gap-4">
              <DetailCard icon={<Clock size={16} />} label={l('moonAge', locale)} value={`${todayInfo.moonAgeHours} ${l('hours', locale)}`} locale={locale} />
              <DetailCard icon={<Compass size={16} />} label={l('elongation', locale)} value={`${todayInfo.elongationDeg}\u00b0`} locale={locale} />
              <DetailCard icon={<Telescope size={16} />} label={l('altitude', locale)} value={`${todayInfo.altitudeAtSunset}\u00b0`} locale={locale} />
              {todayInfo.bestViewingTime && (
                <DetailCard icon={<Eye size={16} />} label={l('bestTime', locale)} value={todayInfo.bestViewingTime} locale={locale} />
              )}
              <DetailCard icon={<Compass size={16} />} label={l('direction', locale)} value={locale === 'hi' ? todayInfo.direction.hi : todayInfo.direction.en} locale={locale} />
              <DetailCard icon={<CalendarDays size={16} />} label={l('newMoonOn', locale)} value={formatDateLocal(todayInfo.newMoonDate, locale)} locale={locale} />
            </div>
          </motion.div>
        )}

        {/* Upcoming table */}
        {upcomingList.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            className="rounded-2xl bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 overflow-hidden"
          >
            <div className="px-6 py-4 border-b border-gold-primary/10">
              <h2 className="text-xl font-bold text-gold-gradient flex items-center gap-2" style={hf}>
                <CalendarDays size={20} className="text-gold-primary" /> {l('upcoming', locale)}
              </h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-text-secondary text-xs uppercase tracking-wider border-b border-white/5">
                    <th className="px-6 py-3 text-left" style={bf}>{l('date', locale)}</th>
                    <th className="px-4 py-3 text-center" style={bf}>{l('age', locale)}</th>
                    <th className="px-4 py-3 text-center" style={bf}>{l('elong', locale)}</th>
                    <th className="px-4 py-3 text-right" style={bf}>{l('status', locale)}</th>
                  </tr>
                </thead>
                <tbody>
                  {upcomingList.map((info, i) => (
                    <tr key={i} className="border-b border-white/5 hover:bg-white/2">
                      <td className="px-6 py-3 text-text-primary font-medium" style={bf}>{formatDateLocal(info.newMoonDate, locale)}</td>
                      <td className="px-4 py-3 text-center text-text-secondary">{info.moonAgeHours}</td>
                      <td className="px-4 py-3 text-center text-text-secondary">{info.elongationDeg}&deg;</td>
                      <td className="px-4 py-3 text-right">
                        <span
                          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium"
                          style={{ backgroundColor: STATUS_BG[info.assessment], color: STATUS_COLORS[info.assessment] }}
                        >
                          <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: STATUS_COLORS[info.assessment] }} />
                          {statusLabel(info.assessment)}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}

        {/* Educational sections */}
        <GoldDivider className="my-6" />

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="space-y-4">
          <EducationSection title={l('whatIs', locale)} text={l('whatIsText', locale)} icon={<Info size={18} />} hf={hf} bf={bf} />
          <EducationSection title={l('significance', locale)} text={l('significanceText', locale)} icon={<Moon size={18} />} hf={hf} bf={bf} />
          <EducationSection title={l('howToSpot', locale)} text={l('howToSpotText', locale)} icon={<Telescope size={18} />} hf={hf} bf={bf} />
          <EducationSection title={l('howCalculated', locale)} text={l('howCalculatedText', locale)} icon={<Compass size={18} />} hf={hf} bf={bf} />
        </motion.div>

        {/* FAQ */}
        <GoldDivider className="my-6" />

        <div className="space-y-2">
          <InfoBlock id="cd-faq1" title={l('faq1q', locale)}><p style={bf}>{l('faq1a', locale)}</p></InfoBlock>
          <InfoBlock id="cd-faq2" title={l('faq2q', locale)}><p style={bf}>{l('faq2a', locale)}</p></InfoBlock>
          <InfoBlock id="cd-faq3" title={l('faq3q', locale)}><p style={bf}>{l('faq3a', locale)}</p></InfoBlock>
          <InfoBlock id="cd-faq4" title={l('faq4q', locale)}><p style={bf}>{l('faq4a', locale)}</p></InfoBlock>
        </div>

        {/* Cross links */}
        <div className="mt-8">
          <Link
            href="/learn/chandra-darshan"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gold-primary/10 border border-gold-primary/20 text-gold-light font-medium hover:bg-gold-primary/20 hover:border-gold-primary/40 transition-all text-sm"
          >
            <Moon size={16} /> {l('learnMore', locale)}
          </Link>
        </div>

        <RelatedLinks type="learn" links={learnLinks} locale={locale} />
      </div>
    </div>
  );
}

function DetailCard({ icon, label, value, locale }: { icon: React.ReactNode; label: string; value: string; locale: string }) {
  const isHi = isDevanagariLocale(locale);
  const bf = isHi ? { fontFamily: 'var(--font-devanagari-body)' } : {};
  return (
    <div className="rounded-xl bg-white/3 border border-white/5 p-3">
      <div className="flex items-center gap-1.5 text-text-secondary text-xs mb-1">
        {icon} <span style={bf}>{label}</span>
      </div>
      <p className="text-text-primary text-sm font-medium" style={bf}>{value}</p>
    </div>
  );
}

function EducationSection({ title, text, icon, hf, bf }: { title: string; text: string; icon: React.ReactNode; hf: React.CSSProperties; bf: React.CSSProperties }) {
  return (
    <div className="rounded-xl bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 p-6">
      <h3 className="text-lg font-bold text-gold-gradient flex items-center gap-2 mb-3" style={hf}>
        <span className="text-gold-primary">{icon}</span> {title}
      </h3>
      <p className="text-text-secondary text-sm leading-relaxed" style={bf}>{text}</p>
    </div>
  );
}
