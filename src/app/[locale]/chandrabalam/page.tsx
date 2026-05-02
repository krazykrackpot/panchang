'use client';

import { useState, useMemo, useEffect } from 'react';
import { useLocale } from 'next-intl';
import { motion } from 'framer-motion';
import { Moon, ArrowLeft, CheckCircle, XCircle, Info } from 'lucide-react';
import GoldDivider from '@/components/ui/GoldDivider';
import RelatedLinks from '@/components/ui/RelatedLinks';
import { getLearnLinksForTool } from '@/lib/seo/cross-links';
import { Link } from '@/lib/i18n/navigation';
import { useLocationStore } from '@/stores/location-store';
import { computePanchang } from '@/lib/ephem/panchang-calc';
import { getUTCOffsetForDate } from '@/lib/utils/timezone';
import { RASHIS } from '@/lib/constants/rashis';
import { RashiIconById } from '@/components/icons/RashiIcons';
import { computeChandrabalamGrid, FAVORABLE_HOUSES } from '@/lib/panchang/balam';
import { tl } from '@/lib/utils/trilingual';
import { safeJsonLd } from '@/lib/seo/safe-jsonld';
import { generateBreadcrumbLD } from '@/lib/seo/structured-data';
import { isDevanagariLocale } from '@/lib/utils/locale-fonts';
import type { Locale } from '@/lib/i18n/config';

// ── House descriptions ──
const HOUSE_LABELS: Record<number, { en: string; hi: string }> = {
  1: { en: 'Janma (Birth)', hi: 'जन्म (1st)' },
  2: { en: 'Dhan (Wealth)', hi: 'धन (2nd)' },
  3: { en: 'Sahaj (Siblings)', hi: 'सहज (3rd)' },
  4: { en: 'Sukha (Comfort)', hi: 'सुख (4th)' },
  5: { en: 'Putra (Children)', hi: 'पुत्र (5th)' },
  6: { en: 'Ari (Enemies)', hi: 'अरि (6th)' },
  7: { en: 'Yuvati (Partner)', hi: 'युवति (7th)' },
  8: { en: 'Ayu (Longevity)', hi: 'आयु (8th)' },
  9: { en: 'Dharma (Fortune)', hi: 'धर्म (9th)' },
  10: { en: 'Karma (Career)', hi: 'कर्म (10th)' },
  11: { en: 'Labha (Gains)', hi: 'लाभ (11th)' },
  12: { en: 'Vyaya (Loss)', hi: 'व्यय (12th)' },
};

const LABELS: Record<string, Record<string, string>> = {
  en: {
    back: 'Panchang',
    title: 'Chandrabalam Today',
    subtitle: 'Moon strength for all 12 signs based on today\'s Moon transit. Check if the Moon\'s current position is favorable or unfavorable for your birth rashi.',
    moonIn: 'Moon is in',
    favorable: 'Favorable',
    unfavorable: 'Unfavorable',
    house: 'House',
    yourRashi: 'Your Moon Sign',
    status: 'Status',
    transitHouse: 'Transit House',
    noLocation: 'Set your location to calculate today\'s Moon rashi',
    detectLocation: 'Detect Location',
    whatIs: 'What is Chandrabalam?',
    whatIsText: 'Chandrabalam (Moon Strength) measures the auspiciousness of the Moon\'s current transit position relative to your natal Moon sign. The Moon transits through one rashi roughly every 2.25 days. From your birth Moon sign, certain houses (3rd, 6th, 7th, 9th, 10th, 11th) are favorable for the Moon\'s transit, while others (1st, 2nd, 4th, 5th, 8th, 12th) indicate caution. This is a key factor in Muhurta (electional astrology) for timing important activities.',
    howToUse: 'How to Use',
    howToUseText: 'Find your birth Moon sign (Janma Rashi) in the grid below. Green means the Moon\'s transit today is supportive for you — good for starting new ventures, travel, and important decisions. Red means the transit is challenging — better to postpone major initiatives if possible. Chandrabalam is just one factor; combine with Tarabalam and Panchang elements for a complete picture.',
    favorableCount: 'favorable',
    unfavorableCount: 'unfavorable',
    loading: 'Computing Moon position...',
  },
  hi: {
    back: 'पंचांग',
    title: 'आज का चन्द्रबल',
    subtitle: 'आज के चन्द्र गोचर पर आधारित सभी 12 राशियों के लिए चन्द्रबल। जानें आपकी जन्म राशि के लिए चन्द्रमा अनुकूल है या प्रतिकूल।',
    moonIn: 'चन्द्रमा',
    favorable: 'अनुकूल',
    unfavorable: 'प्रतिकूल',
    house: 'भाव',
    yourRashi: 'आपकी चन्द्र राशि',
    status: 'स्थिति',
    transitHouse: 'गोचर भाव',
    noLocation: 'आज की चन्द्र राशि की गणना के लिए अपना स्थान सेट करें',
    detectLocation: 'स्थान पता लगाएं',
    whatIs: 'चन्द्रबल क्या है?',
    whatIsText: 'चन्द्रबल चन्द्रमा के वर्तमान गोचर स्थिति की आपकी जन्म चन्द्र राशि से शुभता का मापन करता है। चन्द्रमा लगभग 2.25 दिनों में एक राशि पार करता है। आपकी जन्म राशि से कुछ भाव (3, 6, 7, 9, 10, 11) गोचर के लिए अनुकूल हैं, जबकि अन्य (1, 2, 4, 5, 8, 12) सावधानी के सूचक हैं।',
    howToUse: 'कैसे उपयोग करें',
    howToUseText: 'नीचे दी गई तालिका में अपनी जन्म चन्द्र राशि खोजें। हरा रंग अनुकूल गोचर दर्शाता है — नए कार्य, यात्रा और महत्वपूर्ण निर्णयों के लिए शुभ। लाल रंग चुनौतीपूर्ण गोचर दर्शाता है — बड़े कार्य टालना उचित। सम्पूर्ण चित्र के लिए ताराबल और पंचांग तत्वों के साथ मिलाकर देखें।',
    favorableCount: 'अनुकूल',
    unfavorableCount: 'प्रतिकूल',
    loading: 'चन्द्र स्थिति की गणना हो रही है...',
  },
};

export default function ChandrabalamPage() {
  const locale = useLocale() as Locale;
  const isDevanagari = isDevanagariLocale(locale);
  const L = LABELS[isDevanagari ? 'hi' : 'en'] || LABELS.en;
  const headingFont = isDevanagari ? { fontFamily: 'var(--font-devanagari-heading)' } : { fontFamily: 'var(--font-heading)' };

  const { lat, lng, name: locationName, timezone: ianaTimezone } = useLocationStore();
  const [moonRashi, setMoonRashi] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!lat || !lng) { setLoading(false); return; }
    try {
      const now = new Date();
      const tz = getUTCOffsetForDate(now.getFullYear(), now.getMonth() + 1, now.getDate(), ianaTimezone || 'UTC');
      const panchang = computePanchang({
        year: now.getFullYear(), month: now.getMonth() + 1, day: now.getDate(),
        lat, lng, tzOffset: tz, timezone: ianaTimezone || undefined,
        locationName: locationName || undefined,
      });
      const moonPlanet = panchang.planets.find(p => p.id === 1);
      setMoonRashi(moonPlanet?.rashi || panchang.moonSign?.rashi || null);
    } catch (err) {
      console.error('[chandrabalam] Failed to compute panchang:', err);
    } finally {
      setLoading(false);
    }
  }, [lat, lng, ianaTimezone, locationName]);

  const grid = useMemo(() => moonRashi ? computeChandrabalamGrid(moonRashi) : [], [moonRashi]);
  const favCount = grid.filter(g => g.favorable).length;
  const unfavCount = grid.length - favCount;

  const moonRashiData = moonRashi ? RASHIS[moonRashi - 1] : null;

  const learnLinks = getLearnLinksForTool('/chandrabalam');

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Breadcrumb JSON-LD */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(generateBreadcrumbLD('/chandrabalam', locale)) }} />

      {/* Back link */}
      <Link href="/panchang" className="inline-flex items-center gap-1.5 text-gold-primary hover:text-gold-light text-sm mb-6 transition-colors">
        <ArrowLeft className="w-4 h-4" /> {L.back}
      </Link>

      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4" style={headingFont}>
          <span className="text-gold-gradient">{L.title}</span>
        </h1>
        <p className="text-text-secondary text-sm sm:text-base max-w-2xl mx-auto">{L.subtitle}</p>
      </motion.div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-2 border-gold-primary border-t-transparent" />
          <p className="text-text-secondary text-sm">{L.loading}</p>
        </div>
      ) : !moonRashi ? (
        <div className="text-center py-20">
          <Moon className="w-16 h-16 text-gold-primary/30 mx-auto mb-4" />
          <p className="text-text-secondary mb-4">{L.noLocation}</p>
        </div>
      ) : (
        <>
          {/* Current Moon Rashi badge */}
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center gap-3 mb-10">
            <div className="rounded-2xl bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/20 px-8 py-5 flex items-center gap-4">
              <RashiIconById id={moonRashi} size={56} />
              <div>
                <div className="text-gold-dark text-xs uppercase tracking-wider font-bold">{L.moonIn}</div>
                <div className="text-gold-light font-bold text-2xl" style={headingFont}>
                  {tl(moonRashiData?.name || { en: '' }, locale)}
                </div>
              </div>
            </div>
            <div className="flex gap-4 text-sm">
              <span className="flex items-center gap-1.5 text-emerald-400">
                <CheckCircle className="w-4 h-4" /> {favCount} {L.favorableCount}
              </span>
              <span className="flex items-center gap-1.5 text-red-400">
                <XCircle className="w-4 h-4" /> {unfavCount} {L.unfavorableCount}
              </span>
            </div>
          </motion.div>

          <GoldDivider />

          {/* 12-rashi grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 my-10">
            {grid.map((entry, i) => {
              const rashi = RASHIS[entry.rashiId - 1];
              const houseLabel = HOUSE_LABELS[entry.house];
              return (
                <motion.div
                  key={entry.rashiId}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.04 }}
                  className={`rounded-xl bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border p-4 text-center transition-all hover:scale-[1.03] ${
                    entry.favorable
                      ? 'border-emerald-500/25 hover:border-emerald-500/50'
                      : 'border-red-500/20 hover:border-red-500/40'
                  }`}
                >
                  <div className="flex justify-center mb-2">
                    <RashiIconById id={entry.rashiId} size={40} />
                  </div>
                  <div className="text-gold-light font-bold text-sm" style={isDevanagari ? { fontFamily: 'var(--font-devanagari-body)' } : undefined}>
                    {tl(rashi.name, locale)}
                  </div>
                  <div className="text-text-secondary text-xs mt-1">
                    {L.house} {entry.house} {isDevanagari ? houseLabel?.hi : houseLabel?.en}
                  </div>
                  <div className={`mt-2 text-xs font-bold uppercase tracking-wider ${
                    entry.favorable ? 'text-emerald-400' : 'text-red-400'
                  }`}>
                    {entry.favorable ? L.favorable : L.unfavorable}
                  </div>
                </motion.div>
              );
            })}
          </div>

          <GoldDivider />

          {/* Classical rules reference */}
          <div className="my-10">
            <h2 className="text-xl font-bold text-gold-gradient mb-4" style={headingFont}>
              {isDevanagari ? 'चन्द्रबल नियम (मुहूर्त चिन्तामणि)' : 'Chandrabalam Rules (Muhurta Chintamani)'}
            </h2>
            <div className="rounded-xl bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 p-5">
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {Array.from({ length: 12 }, (_, i) => i + 1).map(house => {
                  const isFav = FAVORABLE_HOUSES.has(house);
                  const label = HOUSE_LABELS[house];
                  return (
                    <div key={house} className="flex items-center gap-2 text-sm">
                      <span className={`w-2 h-2 rounded-full ${isFav ? 'bg-emerald-400' : 'bg-red-400'}`} />
                      <span className="text-text-secondary">{house}.</span>
                      <span className="text-text-primary text-xs">{isDevanagari ? label?.hi : label?.en}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <GoldDivider />

          {/* Explanation */}
          <div className="space-y-8 my-10">
            <div>
              <h2 className="text-xl font-bold text-gold-gradient mb-3 flex items-center gap-2" style={headingFont}>
                <Info className="w-5 h-5 text-gold-primary" /> {L.whatIs}
              </h2>
              <p className="text-text-secondary text-sm leading-relaxed">{L.whatIsText}</p>
            </div>
            <div>
              <h2 className="text-xl font-bold text-gold-gradient mb-3" style={headingFont}>{L.howToUse}</h2>
              <p className="text-text-secondary text-sm leading-relaxed">{L.howToUseText}</p>
            </div>
          </div>
        </>
      )}

      {/* Related links */}
      {learnLinks.length > 0 && (
        <div className="mt-14">
          <RelatedLinks type="learn" links={learnLinks} />
        </div>
      )}
    </div>
  );
}
