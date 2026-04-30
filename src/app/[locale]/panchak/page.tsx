'use client';

import { useState, useMemo } from 'react';
import { useLocale } from 'next-intl';
import { motion } from 'framer-motion';
import { Moon, AlertTriangle, MapPin, ArrowLeft, Shield, ShieldOff, Skull, HeartPulse, Flame, DollarSign, Navigation, CheckCircle } from 'lucide-react';
import GoldDivider from '@/components/ui/GoldDivider';
import InfoBlock from '@/components/ui/InfoBlock';
import { Link } from '@/lib/i18n/navigation';
import { computePanchang, type PanchangInput } from '@/lib/ephem/panchang-calc';
import { getUTCOffsetForDate } from '@/lib/utils/timezone';
import { CITIES, type CityData } from '@/lib/constants/cities';
import { getDefaultCityForLocale } from '@/lib/constants/rashi-slugs';
import { useLocationStore } from '@/stores/location-store';
import { generateBreadcrumbLD } from '@/lib/seo/structured-data';
import { checkPanchak } from '@/lib/panchang/panchak';
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
    title: 'Panchak Today',
    active: 'Panchak is ACTIVE',
    notActive: 'No Panchak Today',
    activeDesc: 'The Moon is currently in a Panchak nakshatra. Avoid the activities listed below.',
    notActiveDesc: 'The Moon is not in any Panchak nakshatra right now. All activities are unrestricted.',
    currentNakshatra: 'Current Moon Nakshatra',
    panchakType: 'Panchak Type',
    nakshatrasTable: 'The 5 Panchak Nakshatras',
    nakshatra: 'Nakshatra',
    fear: 'Fear Type',
    avoid: 'Activities to Avoid',
    avoidDuring: 'Activities to Avoid During Panchak',
    avoidItems: 'Collecting wood, straw, or fuel|Building or repairing roofs|Starting southward journeys|Making new beds or mattresses|Cremation without special rituals (5 effigies required)',
    faq: 'Frequently Asked Questions',
    faq1q: 'How long does Panchak last?',
    faq1a: 'Panchak lasts approximately 2.5 days (about 60 hours) as the Moon transits through 5 consecutive nakshatras — Dhanishtha, Shatabhisha, Purva Bhadrapada, Uttara Bhadrapada, and Revati.',
    faq2q: 'How often does Panchak occur?',
    faq2a: 'Panchak occurs approximately every 27 days, since the Moon completes one full cycle through all 27 nakshatras in about 27.3 days. This means Panchak happens roughly once a month.',
    faq3q: 'Can I travel during Panchak?',
    faq3a: 'Only southward journeys are specifically warned against in classical texts. Travel in other directions is not restricted. Emergency travel is always permissible regardless of Panchak.',
    faq4q: 'What happens if someone dies during Panchak?',
    faq4a: 'If death occurs during Panchak, special cremation rituals called Panchak Shanti are performed. Five effigies (putlas) made of grass or cloth are created and cremated alongside the deceased to protect surviving family members.',
    faq5q: 'Is Panchak observed all over India?',
    faq5a: 'Panchak is most strictly observed in North India (UP, Bihar, Rajasthan, MP). In South India, the concept exists but is observed with less strictness. Some communities consider only death-Panchak (Dhanishtha) and fire-Panchak (Purva Bhadrapada) as strictly inauspicious.',
    learnMore: 'Learn More About Panchak',
    seeAlso: 'See Also',
  },
  hi: {
    back: 'पंचांग',
    title: 'आज का पंचक',
    active: 'पंचक सक्रिय है',
    notActive: 'आज पंचक नहीं है',
    activeDesc: 'चन्द्रमा वर्तमान में पंचक नक्षत्र में है। नीचे सूचीबद्ध कार्यों से बचें।',
    notActiveDesc: 'चन्द्रमा अभी किसी भी पंचक नक्षत्र में नहीं है। सभी कार्य अप्रतिबंधित हैं।',
    currentNakshatra: 'वर्तमान चन्द्र नक्षत्र',
    panchakType: 'पंचक प्रकार',
    nakshatrasTable: 'पंचक के 5 नक्षत्र',
    nakshatra: 'नक्षत्र',
    fear: 'भय प्रकार',
    avoid: 'वर्जित कार्य',
    avoidDuring: 'पंचक में वर्जित कार्य',
    avoidItems: 'लकड़ी, भूसा या ईंधन संग्रह|छत का निर्माण या मरम्मत|दक्षिण दिशा की यात्रा|नई शय्या या गद्दा बनाना|विशेष विधि के बिना अंत्येष्टि (5 पुतले आवश्यक)',
    faq: 'अक्सर पूछे जाने वाले प्रश्न',
    faq1q: 'पंचक कितने समय तक रहता है?',
    faq1a: 'पंचक लगभग 2.5 दिन (लगभग 60 घंटे) तक रहता है जब चन्द्रमा 5 लगातार नक्षत्रों — धनिष्ठा, शतभिषा, पूर्वा भाद्रपद, उत्तरा भाद्रपद और रेवती से गुज़रता है।',
    faq2q: 'पंचक कितनी बार आता है?',
    faq2a: 'पंचक लगभग हर 27 दिनों में आता है, क्योंकि चन्द्रमा सभी 27 नक्षत्रों का एक पूर्ण चक्र लगभग 27.3 दिनों में पूरा करता है। अर्थात महीने में लगभग एक बार।',
    faq3q: 'क्या पंचक में यात्रा कर सकते हैं?',
    faq3a: 'शास्त्रीय ग्रंथों में केवल दक्षिण दिशा की यात्रा से विशेष चेतावनी है। अन्य दिशाओं में यात्रा प्रतिबंधित नहीं है। आपातकालीन यात्रा सदैव अनुमत है।',
    faq4q: 'यदि पंचक में किसी की मृत्यु हो जाए तो?',
    faq4a: 'यदि पंचक में मृत्यु हो, तो पंचक शांति नामक विशेष अंत्येष्टि अनुष्ठान किए जाते हैं। घास या कपड़े से बने 5 पुतले बनाकर मृतक के साथ दाह किए जाते हैं।',
    faq5q: 'क्या पंचक पूरे भारत में मनाया जाता है?',
    faq5a: 'पंचक सबसे कठोरता से उत्तर भारत (UP, बिहार, राजस्थान, MP) में मनाया जाता है। दक्षिण भारत में यह कम कठोरता से मनाया जाता है।',
    learnMore: 'पंचक के बारे में और जानें',
    seeAlso: 'यह भी देखें',
  },
};

// ─── Panchak nakshatra table data ─────────────────────────────
const PANCHAK_TABLE = [
  { id: 23, name: { en: 'Dhanishtha', hi: 'धनिष्ठा' }, fear: { en: 'Death', hi: 'मृत्यु' }, avoid: { en: 'Cremation, funeral rites', hi: 'अंत्येष्टि, श्राद्ध कर्म' }, icon: Skull, color: 'text-red-400' },
  { id: 24, name: { en: 'Shatabhisha', hi: 'शतभिषा' }, fear: { en: 'Disease', hi: 'रोग' }, avoid: { en: 'Starting medical treatments', hi: 'नई चिकित्सा' }, icon: HeartPulse, color: 'text-amber-400' },
  { id: 25, name: { en: 'Purva Bhadrapada', hi: 'पूर्वा भाद्रपद' }, fear: { en: 'Fire', hi: 'अग्नि' }, avoid: { en: 'Collecting fuel, building roofs', hi: 'ईंधन संग्रह, छत निर्माण' }, icon: Flame, color: 'text-orange-400' },
  { id: 26, name: { en: 'Uttara Bhadrapada', hi: 'उत्तरा भाद्रपद' }, fear: { en: 'Financial Loss', hi: 'आर्थिक हानि' }, avoid: { en: 'Major investments, contracts', hi: 'बड़े निवेश, अनुबंध' }, icon: DollarSign, color: 'text-yellow-400' },
  { id: 27, name: { en: 'Revati', hi: 'रेवती' }, fear: { en: 'Travel Danger', hi: 'यात्रा खतरा' }, avoid: { en: 'Southward journeys', hi: 'दक्षिण दिशा की यात्रा' }, icon: Navigation, color: 'text-blue-400' },
];

// ─── Animation ────────────────────────────────────────────────
const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.1, duration: 0.5, ease: 'easeOut' as const },
  }),
};

export default function PanchakPage() {
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

  // Check Panchak from current Moon nakshatra
  const nakshatraId = panchang.nakshatra?.id ?? 1;
  const panchakInfo = useMemo(() => checkPanchak(nakshatraId), [nakshatraId]);

  // Date formatting
  const dateStr = useMemo(() => {
    const d = new Date(year, month - 1, day);
    const LOCALE_MAP: Record<string, string> = { en: 'en-IN', hi: 'hi-IN', sa: 'hi-IN', ta: 'ta-IN', te: 'te-IN', bn: 'bn-IN', kn: 'kn-IN', gu: 'gu-IN', mai: 'hi-IN', mr: 'mr-IN' };
    const loc = LOCALE_MAP[locale] || 'en-IN';
    return d.toLocaleDateString(loc, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  }, [year, month, day, locale]);

  const nakshatraName = panchang.nakshatra?.name
    ? (locale === 'hi' ? panchang.nakshatra.name.hi : panchang.nakshatra.name.en)
    : '';

  const avoidItems = L.avoidItems.split('|');

  return (
    <main className="min-h-screen bg-bg-primary px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl">
        {/* JSON-LD */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: safeJsonLd(generateBreadcrumbLD('/panchak', locale)) }}
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
            panchakInfo.isActive
              ? 'bg-red-500/10 border-red-500/30'
              : 'bg-green-500/10 border-green-500/30'
          }`}
        >
          <div className="flex items-center gap-3 mb-3">
            {panchakInfo.isActive ? (
              <ShieldOff size={28} className="text-red-400" />
            ) : (
              <CheckCircle size={28} className="text-green-400" />
            )}
            <h2
              className={`text-2xl font-bold ${panchakInfo.isActive ? 'text-red-400' : 'text-green-400'}`}
              style={headingFont}
            >
              {panchakInfo.isActive ? L.active : L.notActive}
            </h2>
          </div>
          <p className="text-text-primary mb-4">
            {panchakInfo.isActive ? L.activeDesc : L.notActiveDesc}
          </p>

          {/* Current nakshatra info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="rounded-lg bg-white/5 border border-white/10 p-4">
              <p className="text-text-secondary text-sm mb-1">{L.currentNakshatra}</p>
              <p className="text-text-primary text-lg font-semibold flex items-center gap-2">
                <Moon size={18} className="text-gold-primary" />
                {nakshatraName} (#{nakshatraId})
              </p>
            </div>
            {panchakInfo.isActive && panchakInfo.type && (
              <div className="rounded-lg bg-white/5 border border-white/10 p-4">
                <p className="text-text-secondary text-sm mb-1">{L.panchakType}</p>
                <p className="text-text-primary text-lg font-semibold flex items-center gap-2">
                  <Shield size={18} className="text-red-400" />
                  {locale === 'hi' ? panchakInfo.description.hi : panchakInfo.description.en}
                </p>
              </div>
            )}
          </div>
        </motion.div>

        {/* Nakshatra table */}
        <motion.div
          custom={2}
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          className="rounded-xl border border-gold-primary/12 bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] p-5 mb-8"
        >
          <h2 className="text-xl font-bold text-gold-light mb-4" style={headingFont}>
            {L.nakshatrasTable}
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-left py-2 px-3 text-text-secondary font-medium">#</th>
                  <th className="text-left py-2 px-3 text-text-secondary font-medium">{L.nakshatra}</th>
                  <th className="text-left py-2 px-3 text-text-secondary font-medium">{L.fear}</th>
                  <th className="text-left py-2 px-3 text-text-secondary font-medium">{L.avoid}</th>
                </tr>
              </thead>
              <tbody>
                {PANCHAK_TABLE.map((nak) => {
                  const Icon = nak.icon;
                  const isCurrentNak = nakshatraId === nak.id;
                  return (
                    <tr
                      key={nak.id}
                      className={`border-b border-white/5 ${isCurrentNak ? 'bg-gold-primary/10' : ''}`}
                    >
                      <td className="py-3 px-3 text-text-secondary">{nak.id}</td>
                      <td className="py-3 px-3 text-text-primary font-medium flex items-center gap-2">
                        <Icon size={16} className={nak.color} />
                        {locale === 'hi' ? nak.name.hi : nak.name.en}
                        {isCurrentNak && (
                          <span className="text-xs px-1.5 py-0.5 rounded-full bg-gold-primary/20 text-gold-light">
                            NOW
                          </span>
                        )}
                      </td>
                      <td className={`py-3 px-3 ${nak.color} font-medium`}>
                        {locale === 'hi' ? nak.fear.hi : nak.fear.en}
                      </td>
                      <td className="py-3 px-3 text-text-secondary">
                        {locale === 'hi' ? nak.avoid.hi : nak.avoid.en}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* Activities to avoid */}
        <motion.div
          custom={3}
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          className="rounded-xl border border-gold-primary/12 bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] p-5 mb-8"
        >
          <h2 className="text-xl font-bold text-gold-light mb-4 flex items-center gap-2" style={headingFont}>
            <AlertTriangle size={20} className="text-red-400" />
            {L.avoidDuring}
          </h2>
          <ul className="space-y-2 ml-1">
            {avoidItems.map((item, i) => (
              <li key={i} className="flex items-start gap-2 text-text-primary">
                <span className="text-red-400 mt-1.5 flex-shrink-0">&#8226;</span>
                {item}
              </li>
            ))}
          </ul>
        </motion.div>

        <GoldDivider />

        {/* FAQ */}
        <motion.section
          custom={4}
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
              { q: L.faq1q, a: L.faq1a, id: 'panchak-faq1' },
              { q: L.faq2q, a: L.faq2a, id: 'panchak-faq2' },
              { q: L.faq3q, a: L.faq3a, id: 'panchak-faq3' },
              { q: L.faq4q, a: L.faq4a, id: 'panchak-faq4' },
              { q: L.faq5q, a: L.faq5a, id: 'panchak-faq5' },
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
            {[
              { href: '/learn/panchak' as const, label: L.learnMore },
              { href: '/panchang' as const, label: L.back },
              { href: '/holashtak' as const, label: locale === 'hi' ? 'होलाष्टक' : 'Holashtak Today' },
              { href: '/rahu-kaal' as const, label: locale === 'hi' ? 'राहु काल' : 'Rahu Kaal' },
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
