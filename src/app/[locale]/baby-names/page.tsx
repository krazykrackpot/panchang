'use client';

import { useState, useEffect, useMemo } from 'react';
import { useLocale } from 'next-intl';
import { resolveTimezoneFromCoords } from '@/lib/utils/timezone';
import { motion, AnimatePresence } from 'framer-motion';
import GoldDivider from '@/components/ui/GoldDivider';
import { NakshatraIconById } from '@/components/icons/NakshatraIcons';
import { NAKSHATRAS } from '@/lib/constants/nakshatras';
import { NAKSHATRA_SYLLABLES } from '@/lib/constants/nakshatra-syllables';
import LocationSearch from '@/components/ui/LocationSearch';
import { useAuthStore } from '@/stores/auth-store';
import { getSupabase } from '@/lib/supabase/client';
import { computeBirthSignsAction } from '@/app/actions/birth-signs';
import type { Locale } from '@/types/panchang';
import { tl } from '@/lib/utils/trilingual';
import { isDevanagariLocale } from '@/lib/utils/locale-fonts';
import RelatedLinks from '@/components/ui/RelatedLinks';
import { getLearnLinksForTool } from '@/lib/seo/cross-links';

export default function BabyNamesPage() {
  const locale = useLocale() as Locale;
  const isTamil = String(locale) === 'ta';
  const isDevanagari = isDevanagariLocale(locale);
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
          // ALWAYS resolve timezone from coordinates — never trust stored birth_timezone
          if (data.birth_lat && data.birth_lng) {
            resolveTimezoneFromCoords(Number(data.birth_lat), Number(data.birth_lng)).then(tz => setBirthTz(tz));
          }
        }
      });
  }, [initialized, user]);

  // Server action: compute nakshatra on server where Swiss Ephemeris is available
  useEffect(() => {
    if (!birthDate || birthLat == null || birthLng == null || !birthTz) return;
    let cancelled = false;
    computeBirthSignsAction(birthDate, birthTime, birthLat, birthLng, birthTz)
      .then(b => {
        if (cancelled) return;
        setDetectedNak(b.moonNakshatra);
        setDetectedPada(b.moonPada);
        setSelectedNak(b.moonNakshatra);
        setSelectedPada(b.moonPada);
      })
      .catch(() => { /* timezone invalid or server error */ });
    return () => { cancelled = true; };
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

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
        <h1 className="text-5xl sm:text-6xl font-bold mb-4" style={headingFont}>
          <span className="text-gold-gradient">{isTamil ? 'குழந்தை பெயர் பரிந்துரை' : locale === 'en' ? 'Baby Name Suggester' : 'शिशु नाम सुझावक'}</span>
        </h1>
        <p className="text-text-secondary text-lg max-w-2xl mx-auto">
          {locale === 'en'
            ? 'Find auspicious name syllables based on your birth Nakshatra & Pada'
            : 'जन्म नक्षत्र और पद के अनुसार शुभ नाम अक्षर खोजें'}
        </p>
      </motion.div>

      {/* Static educational content for SEO */}
      <div className="max-w-4xl mx-auto px-4 mb-8">
        <div className="rounded-2xl bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 p-6 sm:p-8">
          {locale === 'en' || isTamil ? (
            <>
              <p className="text-text-secondary/80 text-base leading-relaxed mb-4">
                In the Vedic tradition, a child&apos;s name begins with the syllable (Akshara) determined by their birth Nakshatra and Pada. Each of the 27 Nakshatras has 4 Padas, yielding 108 sacred syllables — one for each bead of the Japa Mala. This system ensures the name resonates with the child&apos;s cosmic blueprint, aligning their identity with the vibrational frequency of their birth star.
              </p>
              <p className="text-text-secondary/80 text-base leading-relaxed">
                The tradition dates to the Namakarana Samskara, one of the 16 sacred rites (Shodasha Samskaras) prescribed in the Grihya Sutras. Enter the child&apos;s birth details to discover the recommended starting syllables and curated name suggestions.
              </p>
            </>
          ) : (
            <>
              <p className="text-text-secondary/80 text-base leading-relaxed mb-4" style={isDevanagari ? { fontFamily: 'var(--font-devanagari-body)' } : undefined}>
                वैदिक परम्परा में, शिशु का नाम उनके जन्म नक्षत्र और पद द्वारा निर्धारित अक्षर से प्रारम्भ होता है। 27 नक्षत्रों में से प्रत्येक के 4 पद होते हैं, जिनसे 108 पवित्र अक्षर निकलते हैं — जप माला के प्रत्येक मनके के लिए एक। यह प्रणाली सुनिश्चित करती है कि नाम शिशु की ब्रह्मांडीय रचना के साथ प्रतिध्वनित हो।
              </p>
              <p className="text-text-secondary/80 text-base leading-relaxed" style={isDevanagari ? { fontFamily: 'var(--font-devanagari-body)' } : undefined}>
                यह परम्परा नामकरण संस्कार से आती है, जो गृह्य सूत्रों में वर्णित 16 पवित्र संस्कारों (षोडश संस्कार) में से एक है। अनुशंसित आरम्भिक अक्षर और नाम सुझाव जानने के लिए जन्म विवरण दर्ज करें।
              </p>
            </>
          )}
        </div>
      </div>

      {/* Educational sub-cards */}
      <div className="max-w-4xl mx-auto px-4 mb-8">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="bg-white/[0.04] border border-gold-primary/10 rounded-xl p-5">
            <h3 className="text-gold-light text-sm font-bold mb-2" style={headingFont}>
              {locale === 'en' ? 'Why Nakshatra Syllables?' : 'नक्षत्र अक्षर क्यों?'}
            </h3>
            <p className="text-text-secondary text-xs leading-relaxed" style={isDevanagari ? { fontFamily: 'var(--font-devanagari-body)' } : undefined}>
              {locale === 'en'
                ? 'Each nakshatra spans 13\u00B020\u2032 of the zodiac and has 4 padas (quarters). Each pada has a designated starting syllable rooted in Sanskrit phonetics. The sound vibration of the first syllable sets the energetic tone for the name.'
                : 'प्रत्येक नक्षत्र राशिचक्र के 13\u00B020\u2032 में फैला है और इसके 4 पाद हैं। प्रत्येक पाद का संस्कृत ध्वनि विज्ञान में निहित एक निर्धारित प्रारम्भिक अक्षर है। पहले अक्षर का ध्वनि कम्पन नाम की ऊर्जा का स्वर निर्धारित करता है।'}
            </p>
          </div>
          <div className="bg-white/[0.04] border border-gold-primary/10 rounded-xl p-5">
            <h3 className="text-gold-light text-sm font-bold mb-2" style={headingFont}>
              {locale === 'en' ? 'How It Works' : 'यह कैसे काम करता है'}
            </h3>
            <p className="text-text-secondary text-xs leading-relaxed" style={isDevanagari ? { fontFamily: 'var(--font-devanagari-body)' } : undefined}>
              {locale === 'en'
                ? 'Find the Moon\u2019s nakshatra at birth \u2192 identify the pada (1\u20134) \u2192 use the corresponding syllable as the starting sound for the child\u2019s name. The Moon\u2019s exact degree determines which of the 108 padas applies.'
                : 'जन्म के समय चन्द्रमा का नक्षत्र ज्ञात करें \u2192 पाद (1\u20134) पहचानें \u2192 बच्चे के नाम के लिए संबंधित अक्षर का उपयोग करें। चन्द्रमा का सटीक अंश निर्धारित करता है कि 108 पादों में से कौन सा लागू होता है।'}
            </p>
          </div>
          <div className="bg-white/[0.04] border border-gold-primary/10 rounded-xl p-5">
            <h3 className="text-gold-light text-sm font-bold mb-2" style={headingFont}>
              {locale === 'en' ? 'Modern Practice' : 'आधुनिक अभ्यास'}
            </h3>
            <p className="text-text-secondary text-xs leading-relaxed" style={isDevanagari ? { fontFamily: 'var(--font-devanagari-body)' } : undefined}>
              {locale === 'en'
                ? 'While traditional, many families today use nakshatra syllables as a guide rather than strict rule \u2014 choosing a name that starts with the right sound but fits their language and culture.'
                : 'परम्परागत होते हुए भी, आज कई परिवार नक्षत्र अक्षरों को कठोर नियम के बजाय मार्गदर्शक के रूप में उपयोग करते हैं \u2014 ऐसा नाम चुनते हैं जो सही ध्वनि से शुरू हो पर उनकी भाषा और संस्कृति के अनुरूप हो।'}
            </p>
          </div>
        </div>
      </div>

      {/* Birth details — compact row */}
      <div className="mb-8 rounded-xl bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 p-5">
        <label className="text-gold-dark text-xs uppercase tracking-wider font-bold block mb-3 text-center">
          {isTamil ? 'பிறப்பு விவரங்களை உள்ளிடுங்கள் (நட்சத்திரம் தானாக கணிக்கப்படும்)' : locale === 'en' ? 'Enter Birth Details (auto-detects Nakshatra)' : 'जन्म विवरण दर्ज करें (नक्षत्र स्वतः पहचानेगा)'}
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
              placeholder={isTamil ? 'பிறந்த நகரம்...' : locale === 'en' ? 'Birth city...' : 'जन्म शहर...'}
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
          {isTamil ? 'பிறப்பு நட்சத்திரத்தைத் தேர்ந்தெடுக்கவும்' : locale === 'en' ? 'Select Birth Nakshatra' : 'जन्म नक्षत्र चुनें'}
          {detectedNak > 0 && <span className="text-text-secondary/65 font-normal ml-2">({isTamil ? 'அல்லது கீழே மாற்றவும்' : locale === 'en' ? 'or change below' : 'या नीचे बदलें'})</span>}
        </label>
        <div className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-9 gap-2">
          {NAKSHATRAS.map(n => {
            const isDetected = detectedNak === n.id;
            const isSelected = selectedNak === n.id;
            return (
              <button key={n.id} onClick={() => { setSelectedNak(n.id); setSelectedPada(0); }}
                className={`rounded-xl text-center transition-all ${
                  isSelected
                    ? 'col-span-2 row-span-2 p-4 bg-gradient-to-br from-gold-primary/15 to-gold-primary/5 border-gold-primary/50 border-2 shadow-xl shadow-gold-primary/15 ring-1 ring-gold-primary/20'
                    : isDetected
                    ? 'p-2.5 bg-gradient-to-br from-[#2d1b69]/30 via-[#1a1040]/40 to-[#0a0e27] border-gold-primary/30 border-2 border-dashed'
                    : 'p-2.5 bg-gradient-to-br from-[#2d1b69]/20 via-[#1a1040]/25 to-[#0a0e27] border border-gold-primary/8 hover:border-gold-primary/20'
                }`}>
                <div className="flex justify-center">
                  <NakshatraIconById id={n.id} size={isSelected ? 48 : 24} />
                </div>
                <div className={`mt-1 font-medium ${isSelected ? 'text-gold-light text-sm' : 'text-text-secondary text-xs'}`} style={isDevanagari ? { fontFamily: 'var(--font-devanagari-body)' } : undefined}>
                  {tl(n.name, locale)}
                </div>
                {isSelected && detectedPada > 0 && (
                  <div className="text-gold-primary/60 text-xs mt-1">{isTamil ? `பாதம் ${detectedPada}` : locale === 'en' ? `Pada ${detectedPada}` : `पाद ${detectedPada}`}</div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      <AnimatePresence>
        {selectedNak > 0 && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            {/* Explanation: What are Padas? */}
            <div className="rounded-xl bg-gradient-to-br from-[#2d1b69]/30 via-[#1a1040]/35 to-[#0a0e27] border border-gold-primary/12 p-5 mb-6">
              <h3 className="text-gold-light text-sm font-bold mb-2" style={headingFont}>
                {isTamil ? 'பாதங்கள் என்றால் என்ன?' : locale === 'en' ? 'What are Padas?' : 'पाद क्या हैं?'}
              </h3>
              <p className="text-text-secondary text-sm leading-relaxed">
                {locale === 'en'
                  ? 'Each nakshatra (birth star) is divided into 4 quarters called "Padas." Each pada is associated with a specific starting syllable for the baby\'s name. In the Hindu naming tradition (Namakarana), the child\'s name should begin with the syllable of their birth pada — this is believed to align the child\'s identity with their cosmic vibration. Your baby\'s pada is determined by the exact position of the Moon at the time of birth.'
                  : 'प्रत्येक नक्षत्र (जन्म तारा) को 4 भागों में बाँटा जाता है जिन्हें "पाद" कहते हैं। प्रत्येक पाद एक विशिष्ट प्रारम्भिक अक्षर से जुड़ा होता है। हिन्दू नामकरण परम्परा में बच्चे का नाम उनके जन्म पाद के अक्षर से शुरू होना चाहिए — माना जाता है कि यह बच्चे की पहचान को उनके ब्रह्मांडीय कम्पन से जोड़ता है। पाद जन्म के समय चन्द्रमा की सटीक स्थिति से निर्धारित होता है।'}
              </p>
            </div>

            {/* Pada selector */}
            <div className="mb-8">
              <label className="text-gold-dark text-xs uppercase tracking-wider font-bold block mb-3 text-center">
                {isTamil ? 'பாதத்தைத் தேர்ந்தெடுக்கவும்' : locale === 'en' ? 'Select Pada (Quarter)' : 'पाद चुनें (चतुर्थांश)'}
                {detectedPada > 0 && <span className="text-gold-primary font-normal ml-2">— {isTamil ? `பாதம் ${detectedPada} பிறப்பு நேரத்திலிருந்து கணிக்கப்பட்டது` : locale === 'en' ? `Pada ${detectedPada} detected from birth time` : `जन्म समय से पाद ${detectedPada} पहचाना`}</span>}
              </label>
              <div className="flex justify-center gap-3">
                <button onClick={() => setSelectedPada(0)}
                  className={`px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${selectedPada === 0 ? 'bg-gradient-to-br from-gold-primary/20 to-gold-primary/10 text-gold-light border border-gold-primary/40' : 'bg-gradient-to-br from-[#2d1b69]/20 to-[#0a0e27] text-text-secondary border border-gold-primary/8 hover:border-gold-primary/20'}`}>
                  {isTamil ? 'அனைத்து பாதங்கள்' : locale === 'en' ? 'All Padas' : 'सभी पाद'}
                </button>
                {[1, 2, 3, 4].map(p => (
                  <button key={p} onClick={() => setSelectedPada(p)}
                    className={`px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
                      selectedPada === p
                        ? 'bg-gradient-to-br from-gold-primary/20 to-gold-primary/10 text-gold-light border-2 border-gold-primary/50'
                        : p === detectedPada
                        ? 'bg-gradient-to-br from-[#2d1b69]/30 to-[#0a0e27] text-gold-primary border-2 border-gold-primary/30 border-dashed'
                        : 'bg-gradient-to-br from-[#2d1b69]/20 to-[#0a0e27] text-text-secondary border border-gold-primary/8 hover:border-gold-primary/20'
                    }`}>
                    {isTamil ? `பாதம் ${p}` : locale === 'en' ? `Pada ${p}` : `पाद ${p}`}
                  </button>
                ))}
              </div>
            </div>

            <GoldDivider />

            {/* Syllables — the main result */}
            <div className="my-8">
              <h3 className="text-gold-light text-xl font-bold mb-2 text-center" style={headingFont}>
                {isTamil ? 'பரிந்துரைக்கப்பட்ட எழுத்துகள்' : locale === 'en' ? 'Name Starting Syllables' : 'नाम के प्रारम्भिक अक्षर'}
              </h3>
              <p className="text-text-secondary/75 text-sm text-center mb-6">
                {locale === 'en'
                  ? 'Your baby\'s name should ideally start with one of these syllables'
                  : 'आपके बच्चे का नाम इनमें से किसी एक अक्षर से शुरू होना चाहिए'}
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                {syllables.map((syl, i) => (
                  <motion.div key={i}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.1 }}
                    className="bg-gradient-to-br from-[#2d1b69]/50 via-[#1a1040]/60 to-[#0a0e27] rounded-2xl p-6 border-2 border-gold-primary/25 min-w-[110px] text-center shadow-lg shadow-gold-primary/10"
                  >
                    <div className="text-5xl font-bold text-gold-light mb-2" style={isDevanagari ? { fontFamily: 'var(--font-devanagari-heading)' } : headingFont}>
                      {!isDevanagariLocale(locale) ? syl.en : syl.hi}
                    </div>
                    <div className="text-text-secondary text-sm">
                      {!isDevanagariLocale(locale) ? syl.hi : syl.en}
                    </div>
                    <div className="text-text-secondary/55 text-xs mt-1">
                      {isTamil ? `பாதம் ${selectedPada || (i + 1)}` : locale === 'en' ? `Pada ${selectedPada || (i + 1)}` : `पाद ${selectedPada || (i + 1)}`}
                    </div>
                  </motion.div>
                ))}
              </div>
              <p className="text-text-secondary/65 text-xs text-center mt-6">
                {locale === 'en'
                  ? 'For example, if the syllable is "Chu", names like "Chudamani", "Chulbul" etc. are auspicious.'
                  : 'उदाहरण: यदि अक्षर "चू" है तो "चूड़ामणि", "चुलबुल" आदि नाम शुभ हैं।'}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Ready Reckoner — full Nakshatra × Pada syllable table */}
      <GoldDivider />
      <div className="my-10">
        <h3 className="text-gold-gradient text-2xl font-bold mb-2 text-center" style={headingFont}>
          {isTamil ? 'முழுமையான எழுத்துகள் குறிப்பு' : locale === 'en' ? 'Complete Syllable Reference' : 'सम्पूर्ण अक्षर सन्दर्भ'}
        </h3>
        <p className="text-text-secondary/70 text-sm text-center mb-6">
          {locale === 'en'
            ? 'All 27 Nakshatras × 4 Padas — find the starting syllable for any birth star'
            : 'सभी 27 नक्षत्र × 4 पाद — किसी भी जन्म तारे के लिए प्रारम्भिक अक्षर'}
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {NAKSHATRAS.map(n => {
            const syls = NAKSHATRA_SYLLABLES[n.id];
            const isHighlighted = n.id === selectedNak;
            return (
              <motion.div
                key={n.id}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                onClick={() => { setSelectedNak(n.id); setSelectedPada(0); }}
                className={`rounded-xl p-4 transition-all cursor-pointer ${
                  isHighlighted
                    ? 'bg-gradient-to-br from-gold-primary/15 via-gold-primary/5 to-transparent border-2 border-gold-primary/40 shadow-lg shadow-gold-primary/10 ring-1 ring-gold-primary/15'
                    : 'bg-gradient-to-br from-[#2d1b69]/20 via-[#1a1040]/25 to-[#0a0e27] border border-gold-primary/8 hover:border-gold-primary/20 hover:bg-[#1a1040]/40'
                }`}
              >
                {/* Nakshatra header */}
                <div className="flex items-center gap-3 mb-3">
                  <NakshatraIconById id={n.id} size={isHighlighted ? 28 : 22} />
                  <div>
                    <span className={`font-bold ${isHighlighted ? 'text-gold-light text-base' : 'text-text-primary text-sm'}`} style={isDevanagari ? { fontFamily: 'var(--font-devanagari-heading)' } : undefined}>
                      {tl(n.name, locale)}
                    </span>
                    <span className="text-text-secondary/55 text-xs ml-2">#{n.id}</span>
                  </div>
                </div>
                {/* 4 Pada syllables in a row */}
                <div className="grid grid-cols-4 gap-1.5">
                  {[0, 1, 2, 3].map(pi => {
                    const syl = syls?.[pi];
                    const isThisPada = isHighlighted && (selectedPada === 0 || selectedPada === pi + 1);
                    return (
                      <div key={pi} className={`rounded-lg py-2 px-1 text-center ${
                        isThisPada
                          ? 'bg-gold-primary/20 border border-gold-primary/40'
                          : 'bg-gradient-to-br from-[#2d1b69]/20 via-[#1a1040]/25 to-[#0a0e27] border border-gold-primary/8'
                      }`}>
                        <div className={`font-bold ${isThisPada ? 'text-gold-light text-lg' : 'text-text-secondary text-sm'}`} style={isDevanagari ? { fontFamily: 'var(--font-devanagari-body)' } : undefined}>
                          {syl ? (!isDevanagariLocale(locale) ? syl.en : syl.hi) : '—'}
                        </div>
                        <div className="text-xs text-text-secondary/55 mt-0.5">P{pi + 1}</div>
                      </div>
                    );
                  })}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      <RelatedLinks type="learn" links={getLearnLinksForTool('/baby-names')} locale={locale} />
    </div>
  );
}
