'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import { resolveTimezoneFromCoords } from '@/lib/utils/timezone';
import { useLocale } from 'next-intl';
import { motion, AnimatePresence } from 'framer-motion';
import GoldDivider from '@/components/ui/GoldDivider';
import { RashiIconById } from '@/components/icons/RashiIcons';
import { NakshatraIconById } from '@/components/icons/NakshatraIcons';
import { RASHIS } from '@/lib/constants/rashis';
import { NAKSHATRAS } from '@/lib/constants/nakshatras';
import LocationSearch from '@/components/ui/LocationSearch';
import { useAuthStore } from '@/stores/auth-store';
import { getSupabase } from '@/lib/supabase/client';
import { formatDegrees } from '@/lib/ephem/astronomical';
import { computeBirthSignsAction } from '@/app/actions/birth-signs';
import type { Locale } from '@/types/panchang';

const SIGN_MEANING: Record<number, { en: string; hi: string }> = {
  1:  { en: 'Bold, pioneering, competitive. Natural leaders who act on instinct.', hi: 'साहसी, अग्रणी, प्रतिस्पर्धी। सहज ज्ञान से कार्य करने वाले नेता।' },
  2:  { en: 'Steady, sensual, loyal. Values stability, beauty, and material comfort.', hi: 'स्थिर, संवेदनशील, वफादार। स्थिरता, सौन्दर्य और भौतिक सुख को महत्व।' },
  3:  { en: 'Curious, communicative, adaptable. Quick thinkers who thrive on variety.', hi: 'जिज्ञासु, संवादी, अनुकूलनशील। तेज़ विचारक जो विविधता में पनपते हैं।' },
  4:  { en: 'Nurturing, intuitive, protective. Deeply emotional with strong family bonds.', hi: 'पोषक, सहज ज्ञानी, रक्षात्मक। गहरे भावनात्मक, मज़बूत पारिवारिक बन्धन।' },
  5:  { en: 'Charismatic, creative, generous. Born to lead, perform, and inspire.', hi: 'करिश्माई, रचनात्मक, उदार। नेतृत्व, प्रदर्शन और प्रेरणा के लिए जन्मे।' },
  6:  { en: 'Analytical, detail-oriented, service-minded. Seeks perfection in all things.', hi: 'विश्लेषणात्मक, विस्तार-उन्मुख, सेवाभावी। हर चीज़ में पूर्णता चाहते हैं।' },
  7:  { en: 'Diplomatic, charming, balance-seeking. Thrives in partnerships and art.', hi: 'कूटनीतिक, आकर्षक, संतुलन-प्रेमी। साझेदारी और कला में पनपते हैं।' },
  8:  { en: 'Intense, transformative, perceptive. Drawn to depth, mystery, and power.', hi: 'तीव्र, रूपान्तरकारी, सूक्ष्मदर्शी। गहराई, रहस्य और शक्ति की ओर।' },
  9:  { en: 'Optimistic, philosophical, adventurous. Eternal seeker of wisdom and truth.', hi: 'आशावादी, दार्शनिक, साहसी। ज्ञान और सत्य के शाश्वत खोजी।' },
  10: { en: 'Ambitious, disciplined, pragmatic. Builds lasting achievements through patience.', hi: 'महत्वाकांक्षी, अनुशासित, व्यावहारिक। धैर्य से स्थायी उपलब्धियाँ बनाते हैं।' },
  11: { en: 'Innovative, independent, humanitarian. Thinks ahead of their time.', hi: 'नवोन्मेषी, स्वतन्त्र, मानवतावादी। अपने समय से आगे सोचते हैं।' },
  12: { en: 'Intuitive, compassionate, spiritual. The mystic and healer of the zodiac.', hi: 'सहज ज्ञानी, करुणामय, आध्यात्मिक। राशिचक्र के रहस्यवादी और उपचारक।' },
};

export default function SignCalculatorPage() {
  const locale = useLocale() as Locale;
  const isDevanagari = locale !== 'en';
  const headingFont = isDevanagari ? { fontFamily: 'var(--font-devanagari-heading)' } : { fontFamily: 'var(--font-heading)' };
  const bodyFont = isDevanagari ? { fontFamily: 'var(--font-devanagari-body)' } : {};

  const [dateStr, setDateStr] = useState('');
  const [timeStr, setTimeStr] = useState('12:00');
  const [placeName, setPlaceName] = useState('');
  const [placeLat, setPlaceLat] = useState<number | null>(null);
  const [placeLng, setPlaceLng] = useState<number | null>(null);
  const [placeTimezone, setPlaceTimezone] = useState<string | null>(null);
  const [autoFilled, setAutoFilled] = useState(false);

  // Auto-fill from user profile if logged in
  const { user, initialized } = useAuthStore();
  useEffect(() => {
    if (!initialized || !user || autoFilled) return;
    const supabase = getSupabase();
    if (!supabase) return;

    supabase.from('user_profiles')
      .select('date_of_birth, time_of_birth, birth_time_known, birth_place, birth_lat, birth_lng, birth_timezone')
      .eq('id', user.id)
      .maybeSingle()
      .then(({ data }) => {
        if (data?.date_of_birth && data?.birth_lat != null) {
          setDateStr(data.date_of_birth);
          if (data.time_of_birth && data.birth_time_known) {
            setTimeStr(data.time_of_birth.substring(0, 5)); // HH:MM from HH:MM:SS
          }
          setPlaceName(data.birth_place || '');
          setPlaceLat(data.birth_lat);
          setPlaceLng(data.birth_lng);
          // ALWAYS resolve timezone from coordinates — never trust stored birth_timezone
          if (data.birth_lat && data.birth_lng) {
            resolveTimezoneFromCoords(Number(data.birth_lat), Number(data.birth_lng)).then(tz => setPlaceTimezone(tz));
          }
          setAutoFilled(true);
        }
      });
  }, [initialized, user, autoFilled]);

  // Server action: compute birth signs on server where Swiss Ephemeris is available
  const [result, setResult] = useState<{
    sunSign: number; sunSignName: { en: string; hi: string; sa: string }; sunDegree: string; sunLong: number;
    moonSign: number; moonSignName: { en: string; hi: string; sa: string }; moonDegree: string; moonLong: number;
    moonNakshatra: typeof NAKSHATRAS[0]; moonNakNum: number; moonPada: number;
    location: string; tzOffset: number;
  } | null>(null);

  useEffect(() => {
    if (!dateStr || !placeLat || !placeLng || !placeTimezone) { setResult(null); return; }
    let cancelled = false;
    computeBirthSignsAction(dateStr, timeStr, Number(placeLat), Number(placeLng), placeTimezone)
      .then(b => {
        if (cancelled) return;
        setResult({
          sunSign: b.sunSign,
          sunSignName: RASHIS[b.sunSign - 1].name,
          sunDegree: formatDegrees(b.sunLong % 30),
          sunLong: b.sunLong,
          moonSign: b.moonSign,
          moonSignName: RASHIS[b.moonSign - 1].name,
          moonDegree: formatDegrees(b.moonLong % 30),
          moonLong: b.moonLong,
          moonNakshatra: NAKSHATRAS[b.moonNakshatra - 1],
          moonNakNum: b.moonNakshatra,
          moonPada: b.moonPada,
          location: placeName,
          tzOffset: b.tzOffset,
        });
      })
      .catch(() => { if (!cancelled) setResult(null); });
    return () => { cancelled = true; };
  }, [dateStr, timeStr, placeLat, placeLng, placeName, placeTimezone]);

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4" style={headingFont}>
          <span className="text-gold-gradient">{locale === 'en' ? 'Sun & Moon Sign Calculator' : 'सूर्य एवं चन्द्र राशि गणक'}</span>
        </h1>
        <p className="text-text-secondary text-lg max-w-2xl mx-auto" style={bodyFont}>
          {locale === 'en'
            ? 'Find your Vedic (Sidereal) Sun and Moon signs from your birth details'
            : 'अपने जन्म विवरण से वैदिक (सायन) सूर्य और चन्द्र राशि जानें'}
        </p>
      </motion.div>

      {/* Input */}
      <div className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-2xl p-8 mb-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label className="text-gold-dark text-xs uppercase tracking-wider font-bold block mb-2" style={bodyFont}>
              {locale === 'en' ? 'Date of Birth' : 'जन्म तिथि'}
            </label>
            <input type="date" value={dateStr} onChange={e => setDateStr(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-bg-tertiary/50 border border-gold-primary/20 text-gold-light font-mono focus:outline-none focus:border-gold-primary/50"
            />
          </div>
          <div>
            <label className="text-gold-dark text-xs uppercase tracking-wider font-bold block mb-2" style={bodyFont}>
              {locale === 'en' ? 'Time of Birth' : 'जन्म समय'}
            </label>
            <input type="time" value={timeStr} onChange={e => setTimeStr(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-bg-tertiary/50 border border-gold-primary/20 text-gold-light font-mono focus:outline-none focus:border-gold-primary/50"
            />
          </div>
        </div>
        <div className="mt-6">
          <label className="text-gold-dark text-xs uppercase tracking-wider font-bold block mb-2" style={bodyFont}>
            {locale === 'en' ? 'Birth Place' : 'जन्म स्थान'}
          </label>
          <LocationSearch
            value={placeName}
            onSelect={(loc) => {
              setPlaceName(loc.name);
              setPlaceLat(loc.lat);
              setPlaceLng(loc.lng);
              setPlaceTimezone(loc.timezone);
            }}
            placeholder={locale === 'en' ? 'Search birth city...' : 'जन्म शहर खोजें...'}
          />
        </div>
        <p className="text-text-secondary/70 text-xs text-center mt-4" style={bodyFont}>
          {locale === 'en'
            ? 'Location is essential — Moon moves ~13° per day and timezone affects calculations.'
            : 'स्थान आवश्यक है — चन्द्रमा प्रतिदिन ~13° चलता है और समयक्षेत्र गणना को प्रभावित करता है।'}
        </p>
      </div>

      <AnimatePresence>
        {result && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            <GoldDivider />

            {/* Location + timezone confirmation */}
            <p className="text-text-secondary/75 text-xs text-center my-4">
              {result.location} (UTC{result.tzOffset >= 0 ? '+' : ''}{result.tzOffset})
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-10">
              {/* Sun Sign */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-2xl p-8 border-2 border-amber-500/30 bg-gradient-to-br from-amber-500/5 to-transparent text-center"
              >
                <div className="text-amber-400 text-xs uppercase tracking-[0.3em] font-bold mb-4">
                  {locale === 'en' ? 'SUN SIGN (Surya Rashi)' : 'सूर्य राशि'}
                </div>
                <RashiIconById id={result.sunSign} size={80} />
                <h3 className="text-amber-300 text-3xl font-bold mt-4" style={isDevanagari ? { fontFamily: 'var(--font-devanagari-heading)' } : headingFont}>
                  {result.sunSignName[locale]}
                </h3>
                <div className="text-text-secondary text-sm mt-2 font-mono">{result.sunDegree} ({result.sunLong.toFixed(2)}°)</div>
                {SIGN_MEANING[result.sunSign] && (
                  <p className="text-text-secondary/80 text-xs mt-3 leading-relaxed" style={bodyFont}>
                    {locale === 'en' ? SIGN_MEANING[result.sunSign].en : SIGN_MEANING[result.sunSign].hi}
                  </p>
                )}
              </motion.div>

              {/* Moon Sign */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-2xl p-8 text-center"
              >
                <div className="text-indigo-400 text-xs uppercase tracking-[0.3em] font-bold mb-4">
                  {locale === 'en' ? 'MOON SIGN (Chandra Rashi)' : 'चन्द्र राशि'}
                </div>
                <RashiIconById id={result.moonSign} size={80} />
                <h3 className="text-indigo-300 text-3xl font-bold mt-4" style={isDevanagari ? { fontFamily: 'var(--font-devanagari-heading)' } : headingFont}>
                  {result.moonSignName[locale]}
                </h3>
                <div className="text-text-secondary text-sm mt-2 font-mono">{result.moonDegree} ({result.moonLong.toFixed(2)}°)</div>
                {SIGN_MEANING[result.moonSign] && (
                  <p className="text-text-secondary/80 text-xs mt-3 leading-relaxed" style={bodyFont}>
                    {locale === 'en' ? SIGN_MEANING[result.moonSign].en : SIGN_MEANING[result.moonSign].hi}
                  </p>
                )}
              </motion.div>
            </div>

            {/* What do Sun & Moon signs mean? */}
            <div className="rounded-xl bg-gradient-to-br from-[#2d1b69]/30 via-[#1a1040]/35 to-[#0a0e27] border border-gold-primary/10 p-5 my-6">
              <h3 className="text-gold-light text-sm font-bold mb-2" style={headingFont}>
                {locale === 'en' ? 'What do Sun & Moon signs reveal?' : 'सूर्य और चन्द्र राशि क्या बताती हैं?'}
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-text-secondary leading-relaxed" style={bodyFont}>
                <div>
                  <span className="text-amber-400 font-bold">{locale === 'en' ? 'Sun Sign' : 'सूर्य राशि'}</span>
                  {locale === 'en'
                    ? ' — Your core identity, ego, and life purpose. It shows how you express your will and where you shine most brightly. In Vedic astrology, this is often one sign behind your Western sign.'
                    : ' — आपकी मूल पहचान, अहंकार और जीवन उद्देश्य। यह दर्शाती है कि आप अपनी इच्छाशक्ति कैसे व्यक्त करते हैं।'}
                </div>
                <div>
                  <span className="text-indigo-400 font-bold">{locale === 'en' ? 'Moon Sign' : 'चन्द्र राशि'}</span>
                  {locale === 'en'
                    ? ' — Your emotional nature, instincts, and subconscious mind. This is the MOST important sign in Vedic astrology — more than Sun sign. It determines your Nakshatra, Dasha system, and how transits affect you.'
                    : ' — आपका भावनात्मक स्वभाव, सहज वृत्ति और अवचेतन मन। वैदिक ज्योतिष में यह सबसे महत्वपूर्ण राशि है — सूर्य राशि से भी अधिक। यह आपका नक्षत्र, दशा और गोचर प्रभाव निर्धारित करती है।'}
                </div>
              </div>
            </div>

            {/* Moon Nakshatra */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-6 text-center"
            >
              <div className="flex items-center justify-center gap-4">
                <NakshatraIconById id={result.moonNakNum} size={48} />
                <div>
                  <div className="text-gold-dark text-xs uppercase tracking-wider font-bold mb-1" style={bodyFont}>
                    {locale === 'en' ? 'Birth Nakshatra (Janma Nakshatra)' : 'जन्म नक्षत्र'}
                  </div>
                  <div className="text-gold-light text-2xl font-bold" style={isDevanagari ? { fontFamily: 'var(--font-devanagari-heading)' } : headingFont}>
                    {result.moonNakshatra.name[locale]}
                  </div>
                  <div className="text-text-secondary text-sm" style={bodyFont}>
                    {locale === 'en' ? 'Pada' : 'पद'} {result.moonPada}
                  </div>
                </div>
              </div>
            </motion.div>

            <div className="text-center text-text-secondary/70 text-xs mt-6" style={bodyFont}>
              {locale === 'en'
                ? 'Note: These are Vedic (Sidereal) signs using Lahiri Ayanamsha, not Western (Tropical) signs.'
                : 'नोट: ये लाहिरी अयनांश के साथ वैदिक (सायन) राशियाँ हैं, पश्चिमी (सायन) राशियाँ नहीं।'}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
