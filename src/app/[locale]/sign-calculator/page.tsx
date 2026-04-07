'use client';

import { useState, useEffect, useMemo } from 'react';
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
import { computeBirthSigns, formatDegrees } from '@/lib/ephem/astronomical';
import type { Locale } from '@/types/panchang';

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
          setPlaceTimezone(data.birth_timezone || null);
          setAutoFilled(true);
        }
      });
  }, [initialized, user, autoFilled]);

  const result = useMemo(() => {
    if (!dateStr || !placeLat || !placeLng || !placeTimezone) return null;
    try {
      const b = computeBirthSigns(dateStr, timeStr, placeLat, placeLng, placeTimezone);
      return {
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
      };
    } catch { return null; }
  }, [dateStr, timeStr, placeLat, placeLng, placeName, placeTimezone]);

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
        <h1 className="text-5xl sm:text-6xl font-bold mb-4" style={headingFont}>
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
              </motion.div>

              {/* Moon Sign */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-2xl p-8 border-2 border-indigo-500/30 bg-gradient-to-br from-indigo-500/5 to-transparent text-center"
              >
                <div className="text-indigo-400 text-xs uppercase tracking-[0.3em] font-bold mb-4">
                  {locale === 'en' ? 'MOON SIGN (Chandra Rashi)' : 'चन्द्र राशि'}
                </div>
                <RashiIconById id={result.moonSign} size={80} />
                <h3 className="text-indigo-300 text-3xl font-bold mt-4" style={isDevanagari ? { fontFamily: 'var(--font-devanagari-heading)' } : headingFont}>
                  {result.moonSignName[locale]}
                </h3>
                <div className="text-text-secondary text-sm mt-2 font-mono">{result.moonDegree} ({result.moonLong.toFixed(2)}°)</div>
              </motion.div>
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
