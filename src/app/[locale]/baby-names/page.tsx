'use client';

import { useState, useEffect, useMemo } from 'react';
import { useLocale } from 'next-intl';
import { motion, AnimatePresence } from 'framer-motion';
import GoldDivider from '@/components/ui/GoldDivider';
import { NakshatraIconById } from '@/components/icons/NakshatraIcons';
import { NAKSHATRAS } from '@/lib/constants/nakshatras';
import { NAKSHATRA_SYLLABLES, SAMPLE_NAMES } from '@/lib/constants/nakshatra-syllables';
import LocationSearch from '@/components/ui/LocationSearch';
import { useAuthStore } from '@/stores/auth-store';
import { getSupabase } from '@/lib/supabase/client';
import { dateToJD, moonLongitude, toSidereal, getNakshatraNumber, getNakshatraPada } from '@/lib/ephem/astronomical';
import { getUTCOffsetForDate } from '@/lib/utils/timezone';
import type { Locale } from '@/types/panchang';

export default function BabyNamesPage() {
  const locale = useLocale() as Locale;
  const isDevanagari = locale !== 'en';
  const headingFont = isDevanagari ? { fontFamily: 'var(--font-devanagari-heading)' } : { fontFamily: 'var(--font-heading)' };

  const [selectedNak, setSelectedNak] = useState(0);
  const [selectedPada, setSelectedPada] = useState(0); // 0 = all padas

  // Birth details for auto-detection
  const [birthDate, setBirthDate] = useState('');
  const [birthTime, setBirthTime] = useState('12:00');
  const [birthPlaceName, setBirthPlaceName] = useState('');
  const [birthLat, setBirthLat] = useState<number | null>(null);
  const [birthLng, setBirthLng] = useState<number | null>(null);
  const [birthTz, setBirthTz] = useState<string | null>(null);
  const [detectedNak, setDetectedNak] = useState(0);
  const [detectedPada, setDetectedPada] = useState(0);

  // Auto-fill from user profile
  const { user, initialized } = useAuthStore();
  useEffect(() => {
    if (!initialized || !user) return;
    const supabase = getSupabase();
    if (!supabase) return;
    supabase.from('user_profiles')
      .select('date_of_birth, time_of_birth, birth_time_known, birth_place, birth_lat, birth_lng, birth_timezone')
      .eq('id', user.id)
      .maybeSingle()
      .then(({ data }) => {
        if (data?.date_of_birth && data?.birth_lat != null) {
          setBirthDate(data.date_of_birth);
          if (data.time_of_birth && data.birth_time_known) setBirthTime(data.time_of_birth.substring(0, 5));
          setBirthPlaceName(data.birth_place || '');
          setBirthLat(data.birth_lat);
          setBirthLng(data.birth_lng);
          setBirthTz(data.birth_timezone || null);
        }
      });
  }, [initialized, user]);

  // Auto-compute nakshatra from birth details
  useEffect(() => {
    if (!birthDate || birthLat == null || birthLng == null) return;
    const [y, m, d] = birthDate.split('-').map(Number);
    const [h, min] = birthTime.split(':').map(Number);
    const tzOffset = birthTz ? getUTCOffsetForDate(y, m, d, birthTz) : -(new Date(y, m - 1, d).getTimezoneOffset() / 60);
    const utHour = h + min / 60 - tzOffset;
    const jd = dateToJD(y, m, d, utHour);
    const moonSid = toSidereal(moonLongitude(jd), jd);
    const nak = getNakshatraNumber(moonSid);
    const pada = getNakshatraPada(moonSid);
    setDetectedNak(nak);
    setDetectedPada(pada);
    setSelectedNak(nak);
    setSelectedPada(pada);
  }, [birthDate, birthTime, birthLat, birthLng, birthTz]);

  const syllables = useMemo(() => {
    if (!selectedNak) return [];
    const data = NAKSHATRA_SYLLABLES[selectedNak];
    if (!data) return [];
    if (selectedPada > 0 && selectedPada <= 4) {
      return [data[selectedPada - 1]];
    }
    return data;
  }, [selectedNak, selectedPada]);

  const suggestedNames = useMemo(() => {
    const names: string[] = [];
    for (const syl of syllables) {
      const key = syl.en;
      if (SAMPLE_NAMES[key]) {
        names.push(...SAMPLE_NAMES[key]);
      }
    }
    return [...new Set(names)];
  }, [syllables]);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
        <h1 className="text-5xl sm:text-6xl font-bold mb-4" style={headingFont}>
          <span className="text-gold-gradient">{locale === 'en' ? 'Baby Name Suggester' : 'शिशु नाम सुझावक'}</span>
        </h1>
        <p className="text-text-secondary text-lg max-w-2xl mx-auto">
          {locale === 'en'
            ? 'Find auspicious name syllables based on your birth Nakshatra & Pada'
            : 'जन्म नक्षत्र और पद के अनुसार शुभ नाम अक्षर खोजें'}
        </p>
      </motion.div>

      {/* Birth details — compact row */}
      <div className="mb-8 rounded-xl border border-gold-primary/12 bg-bg-secondary/30 p-4">
        <label className="text-gold-dark text-xs uppercase tracking-wider font-bold block mb-3 text-center">
          {locale === 'en' ? 'Enter Birth Details (auto-detects Nakshatra)' : 'जन्म विवरण दर्ज करें (नक्षत्र स्वतः पहचानेगा)'}
        </label>
        <div className="flex flex-wrap items-center justify-center gap-3">
          <input type="date" value={birthDate} onChange={e => setBirthDate(e.target.value)}
            className="bg-transparent border border-gold-primary/15 rounded-md px-3 py-1.5 text-text-primary text-sm focus:outline-none focus:border-gold-primary/40 [color-scheme:dark]" />
          <input type="time" value={birthTime} onChange={e => setBirthTime(e.target.value)}
            className="bg-transparent border border-gold-primary/15 rounded-md px-3 py-1.5 text-text-primary text-sm focus:outline-none focus:border-gold-primary/40 [color-scheme:dark]" />
          <div className="w-48">
            <LocationSearch
              value={birthPlaceName}
              onSelect={(loc) => { setBirthPlaceName(loc.name); setBirthLat(loc.lat); setBirthLng(loc.lng); setBirthTz(loc.timezone); }}
              placeholder={locale === 'en' ? 'Birth city...' : 'जन्म शहर...'}
            />
          </div>
        </div>
        {detectedNak > 0 && (
          <p className="text-center text-gold-primary text-xs mt-3">
            {locale === 'en'
              ? `Detected: ${NAKSHATRAS[detectedNak - 1]?.name?.en} Pada ${detectedPada}`
              : `पहचाना: ${NAKSHATRAS[detectedNak - 1]?.name?.hi} पाद ${detectedPada}`}
          </p>
        )}
      </div>

      {/* Nakshatra selector */}
      <div className="mb-6">
        <label className="text-gold-dark text-xs uppercase tracking-wider font-bold block mb-3 text-center">
          {locale === 'en' ? 'Select Birth Nakshatra' : 'जन्म नक्षत्र चुनें'}
          {detectedNak > 0 && <span className="text-text-secondary/40 font-normal ml-2">({locale === 'en' ? 'or change below' : 'या नीचे बदलें'})</span>}
        </label>
        <div className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-9 gap-2">
          {NAKSHATRAS.map(n => {
            const isDetected = detectedNak === n.id;
            const isSelected = selectedNak === n.id;
            return (
              <button key={n.id} onClick={() => { setSelectedNak(n.id); setSelectedPada(0); }}
                className={`rounded-xl p-2.5 text-center transition-all ${
                  isSelected
                    ? 'bg-gold-primary/20 border-gold-primary/50 border-2 shadow-lg shadow-gold-primary/10'
                    : isDetected
                    ? 'bg-gold-primary/10 border-gold-primary/30 border-2 border-dashed'
                    : 'bg-bg-tertiary/30 border border-gold-primary/10 hover:border-gold-primary/25'
                }`}>
                <div className="flex justify-center"><NakshatraIconById id={n.id} size={isSelected ? 28 : 24} /></div>
                <div className={`text-[10px] mt-1 font-medium ${isSelected ? 'text-gold-light' : 'text-text-secondary'}`} style={isDevanagari ? { fontFamily: 'var(--font-devanagari-body)' } : undefined}>
                  {n.name[locale]}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      <AnimatePresence>
        {selectedNak > 0 && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            {/* Pada selector */}
            <div className="flex justify-center gap-3 mb-8">
              <button onClick={() => setSelectedPada(0)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${selectedPada === 0 ? 'bg-gold-primary/20 text-gold-light border border-gold-primary/40' : 'text-text-secondary border border-gold-primary/10'}`}>
                {locale === 'en' ? 'All Padas' : 'सभी पद'}
              </button>
              {[1, 2, 3, 4].map(p => (
                <button key={p} onClick={() => setSelectedPada(p)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${selectedPada === p ? 'bg-gold-primary/20 text-gold-light border border-gold-primary/40' : 'text-text-secondary border border-gold-primary/10'}`}>
                  {locale === 'en' ? `Pada ${p}` : `पद ${p}`}
                </button>
              ))}
            </div>

            <GoldDivider />

            {/* Syllables */}
            <div className="my-8">
              <h3 className="text-gold-light text-xl font-bold mb-4 text-center" style={headingFont}>
                {locale === 'en' ? 'Starting Syllables' : 'प्रारम्भिक अक्षर'}
              </h3>
              <div className="flex flex-wrap justify-center gap-3">
                {syllables.map((syl, i) => (
                  <motion.div key={i}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.1 }}
                    className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-2xl p-6 border-2 border-gold-primary/30 min-w-[100px] text-center"
                  >
                    <div className="text-4xl font-bold text-gold-light mb-1" style={isDevanagari ? { fontFamily: 'var(--font-devanagari-heading)' } : headingFont}>
                      {locale === 'en' ? syl.en : syl.hi}
                    </div>
                    <div className="text-text-secondary text-xs">
                      {locale === 'en' ? syl.hi : syl.en}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Name suggestions — show directly without filter */}
            {suggestedNames.length > 0 && (
              <div className="my-8">
                <h3 className="text-gold-light text-xl font-bold mb-4 text-center" style={headingFont}>
                  {locale === 'en' ? 'Suggested Names' : 'सुझावित नाम'}
                </h3>
                <div className="flex flex-wrap justify-center gap-2">
                  {suggestedNames.map((name, i) => (
                    <motion.span key={name}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: Math.min(i * 0.03, 0.5) }}
                      className="px-4 py-2 rounded-xl bg-bg-tertiary/30 border border-gold-primary/10 text-gold-light text-sm font-medium"
                    >
                      {name}
                    </motion.span>
                  ))}
                </div>
                <p className="text-text-secondary/50 text-xs text-center mt-4">
                  {locale === 'en' ? 'Traditional suggestions based on nakshatra syllables. The first syllable is most important.' : 'नक्षत्र अक्षरों पर आधारित परम्परागत सुझाव। प्रथम अक्षर सबसे महत्त्वपूर्ण है।'}
                </p>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
