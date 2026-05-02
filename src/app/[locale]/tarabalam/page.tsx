'use client';

import { useState, useMemo, useEffect } from 'react';
import { useLocale } from 'next-intl';
import { motion } from 'framer-motion';
import { Star, ArrowLeft, CheckCircle, XCircle, Info } from 'lucide-react';
import GoldDivider from '@/components/ui/GoldDivider';
import RelatedLinks from '@/components/ui/RelatedLinks';
import { getLearnLinksForTool } from '@/lib/seo/cross-links';
import { Link } from '@/lib/i18n/navigation';
import { useLocationStore } from '@/stores/location-store';
import { computePanchang } from '@/lib/ephem/panchang-calc';
import { getUTCOffsetForDate } from '@/lib/utils/timezone';
import { NAKSHATRAS } from '@/lib/constants/nakshatras';
import { NakshatraIconById } from '@/components/icons/NakshatraIcons';
import { computeTarabalamGrid, TARA_NAMES, FAVORABLE_TARAS } from '@/lib/panchang/balam';
import { tl } from '@/lib/utils/trilingual';
import { safeJsonLd } from '@/lib/seo/safe-jsonld';
import { generateBreadcrumbLD } from '@/lib/seo/structured-data';
import { isDevanagariLocale } from '@/lib/utils/locale-fonts';
import type { Locale } from '@/lib/i18n/config';

const TARA_COLORS: Record<number, string> = {
  1: '#ef4444', // Janma - red
  2: '#22c55e', // Sampat - green
  3: '#ef4444', // Vipat - red
  4: '#22c55e', // Kshema - green
  5: '#ef4444', // Pratyari - red
  6: '#22c55e', // Sadhana - green
  7: '#ef4444', // Vadha - red
  8: '#22c55e', // Mitra - green
  9: '#22c55e', // Parama Mitra - green
};

const LABELS: Record<string, Record<string, string>> = {
  en: {
    back: 'Panchang',
    title: 'Tarabalam Today',
    subtitle: 'Star strength for all 27 nakshatras based on today\'s Moon nakshatra. Find your birth nakshatra to see if today\'s tara is favorable.',
    moonNakshatra: 'Moon Nakshatra',
    favorable: 'Favorable',
    unfavorable: 'Unfavorable',
    tara: 'Tara',
    yourNakshatra: 'Your Birth Nakshatra',
    status: 'Status',
    noLocation: 'Set your location to calculate today\'s Moon nakshatra',
    whatIs: 'What is Tarabalam?',
    whatIsText: 'Tarabalam (Star Strength) evaluates the relationship between today\'s Moon nakshatra and your birth nakshatra. The 27 nakshatras are grouped into 9 repeating cycles of "taras" (stars). Each tara has a distinct quality — some bring prosperity and success, others signal obstacles. The formula is: Tara = ((Transit Nakshatra - Birth Nakshatra + 27) mod 9), yielding values 1-9.',
    howToUse: 'How to Use',
    howToUseText: 'Find your birth nakshatra in the table below. Favorable taras (Sampat, Kshema, Sadhana, Mitra, Parama Mitra) indicate a good day for important activities. Unfavorable taras (Janma, Vipat, Pratyari, Vadha) suggest caution. For best results, combine Tarabalam with Chandrabalam — both favorable means an excellent day for major decisions.',
    favorableCount: 'favorable',
    unfavorableCount: 'unfavorable',
    loading: 'Computing Moon nakshatra...',
    nineStars: 'The 9 Taras',
    groupFavorable: 'Favorable Nakshatras',
    groupUnfavorable: 'Unfavorable Nakshatras',
  },
  hi: {
    back: 'पंचांग',
    title: 'आज का ताराबल',
    subtitle: 'आज के चन्द्र नक्षत्र पर आधारित सभी 27 नक्षत्रों के लिए ताराबल। अपना जन्म नक्षत्र खोजें और जानें आज की तारा अनुकूल है या नहीं।',
    moonNakshatra: 'चन्द्र नक्षत्र',
    favorable: 'अनुकूल',
    unfavorable: 'प्रतिकूल',
    tara: 'तारा',
    yourNakshatra: 'आपका जन्म नक्षत्र',
    status: 'स्थिति',
    noLocation: 'आज के चन्द्र नक्षत्र की गणना के लिए अपना स्थान सेट करें',
    whatIs: 'ताराबल क्या है?',
    whatIsText: 'ताराबल आज के चन्द्र नक्षत्र और आपके जन्म नक्षत्र के सम्बन्ध का मूल्यांकन करता है। 27 नक्षत्रों को 9 "तारा" के चक्रों में विभाजित किया जाता है। प्रत्येक तारा का एक विशिष्ट गुण है — कुछ समृद्धि और सफलता लाते हैं, अन्य बाधाओं का संकेत देते हैं।',
    howToUse: 'कैसे उपयोग करें',
    howToUseText: 'नीचे की तालिका में अपना जन्म नक्षत्र खोजें। अनुकूल तारा (सम्पत्, क्षेम, साधन, मित्र, परम मित्र) महत्वपूर्ण कार्यों के लिए शुभ दिन दर्शाते हैं। प्रतिकूल तारा (जन्म, विपत्, प्रत्यरि, वध) सावधानी का संकेत देते हैं। सर्वोत्तम परिणामों के लिए ताराबल को चन्द्रबल के साथ मिलाकर देखें।',
    favorableCount: 'अनुकूल',
    unfavorableCount: 'प्रतिकूल',
    loading: 'चन्द्र नक्षत्र की गणना हो रही है...',
    nineStars: '9 तारा',
    groupFavorable: 'अनुकूल नक्षत्र',
    groupUnfavorable: 'प्रतिकूल नक्षत्र',
  },
};

export default function TarabalamPage() {
  const locale = useLocale() as Locale;
  const isDevanagari = isDevanagariLocale(locale);
  const L = LABELS[isDevanagari ? 'hi' : 'en'] || LABELS.en;
  const headingFont = isDevanagari ? { fontFamily: 'var(--font-devanagari-heading)' } : { fontFamily: 'var(--font-heading)' };

  const { lat, lng, name: locationName, timezone: ianaTimezone } = useLocationStore();
  const [moonNakshatra, setMoonNakshatra] = useState<number | null>(null);
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
      setMoonNakshatra(panchang.nakshatra.id);
    } catch (err) {
      console.error('[tarabalam] Failed to compute panchang:', err);
    } finally {
      setLoading(false);
    }
  }, [lat, lng, ianaTimezone, locationName]);

  const grid = useMemo(() => moonNakshatra ? computeTarabalamGrid(moonNakshatra) : [], [moonNakshatra]);
  const favEntries = grid.filter(g => g.favorable);
  const unfavEntries = grid.filter(g => !g.favorable);

  const moonNakData = moonNakshatra ? NAKSHATRAS[moonNakshatra - 1] : null;

  const learnLinks = getLearnLinksForTool('/tarabalam');

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Breadcrumb JSON-LD */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(generateBreadcrumbLD('/tarabalam', locale)) }} />

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
      ) : !moonNakshatra ? (
        <div className="text-center py-20">
          <Star className="w-16 h-16 text-gold-primary/30 mx-auto mb-4" />
          <p className="text-text-secondary mb-4">{L.noLocation}</p>
        </div>
      ) : (
        <>
          {/* Current Moon Nakshatra badge */}
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center gap-3 mb-10">
            <div className="rounded-2xl bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/20 px-8 py-5 flex items-center gap-4">
              <NakshatraIconById id={moonNakshatra} size={56} />
              <div>
                <div className="text-gold-dark text-xs uppercase tracking-wider font-bold">{L.moonNakshatra}</div>
                <div className="text-gold-light font-bold text-2xl" style={headingFont}>
                  {tl(moonNakData?.name || { en: '' }, locale)}
                </div>
              </div>
            </div>
            <div className="flex gap-4 text-sm">
              <span className="flex items-center gap-1.5 text-emerald-400">
                <CheckCircle className="w-4 h-4" /> {favEntries.length} {L.favorableCount}
              </span>
              <span className="flex items-center gap-1.5 text-red-400">
                <XCircle className="w-4 h-4" /> {unfavEntries.length} {L.unfavorableCount}
              </span>
            </div>
          </motion.div>

          <GoldDivider />

          {/* 9 Taras legend */}
          <div className="my-8">
            <h2 className="text-lg font-bold text-gold-gradient mb-4 text-center" style={headingFont}>{L.nineStars}</h2>
            <div className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-9 gap-2">
              {TARA_NAMES.map((tara, i) => {
                const num = i + 1;
                const isFav = FAVORABLE_TARAS.has(num);
                return (
                  <div key={num} className={`rounded-lg border p-2 text-center ${isFav ? 'border-emerald-500/25 bg-emerald-500/5' : 'border-red-500/20 bg-red-500/5'}`}>
                    <div className="text-xs text-text-secondary">{num}</div>
                    <div className={`text-xs font-bold ${isFav ? 'text-emerald-400' : 'text-red-400'}`}
                      style={isDevanagari ? { fontFamily: 'var(--font-devanagari-body)' } : undefined}>
                      {tl(tara, locale)}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <GoldDivider />

          {/* Grouped view: Favorable / Unfavorable */}
          {[
            { label: L.groupFavorable, entries: favEntries, color: 'emerald' as const },
            { label: L.groupUnfavorable, entries: unfavEntries, color: 'red' as const },
          ].map(group => (
            <div key={group.label} className="my-8">
              <h3 className={`text-sm font-bold uppercase tracking-widest mb-4 ${group.color === 'emerald' ? 'text-emerald-400' : 'text-red-400'}`}>
                {group.color === 'emerald' ? <CheckCircle className="w-4 h-4 inline mr-1.5 -mt-0.5" /> : <XCircle className="w-4 h-4 inline mr-1.5 -mt-0.5" />}
                {group.label} ({group.entries.length})
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {group.entries.map((entry, i) => {
                  const nak = NAKSHATRAS[entry.nakshatraId - 1];
                  const taraColor = TARA_COLORS[entry.tara] || '#888';
                  return (
                    <motion.div
                      key={entry.nakshatraId}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.02 }}
                      className={`rounded-xl bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border p-3 flex items-center gap-3 ${
                        group.color === 'emerald' ? 'border-emerald-500/15' : 'border-red-500/12'
                      }`}
                    >
                      <NakshatraIconById id={entry.nakshatraId} size={32} />
                      <div className="flex-1 min-w-0">
                        <div className="text-gold-light text-sm font-bold truncate"
                          style={isDevanagari ? { fontFamily: 'var(--font-devanagari-body)' } : undefined}>
                          {tl(nak.name, locale)}
                        </div>
                        <div className="text-text-secondary text-xs">
                          {entry.nakshatraId}. {nak.ruler}
                        </div>
                      </div>
                      <div className="text-right shrink-0">
                        <div className="text-xs font-bold" style={{ color: taraColor }}>
                          {tl(entry.taraName, locale)}
                        </div>
                        <div className="text-text-secondary text-[10px]">{L.tara} {entry.tara}</div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          ))}

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
