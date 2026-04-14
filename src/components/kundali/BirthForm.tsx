'use client';
import { tl } from '@/lib/utils/trilingual';

import { useState, useEffect } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import LocationSearch from '@/components/ui/LocationSearch';
import { useAuthStore } from '@/stores/auth-store';
import { getSupabase } from '@/lib/supabase/client';
import { resolveTimezoneFromCoords } from '@/lib/utils/timezone';
import type { BirthData, ChartStyle } from '@/types/kundali';
import type { Locale } from '@/types/panchang';
import { isDevanagariLocale, getHeadingFont } from '@/lib/utils/locale-fonts';

interface BirthFormProps {
  onSubmit: (data: BirthData, style: ChartStyle) => void;
  loading: boolean;
  initialData?: Partial<BirthData & { ayanamsha?: string; chartStyle?: ChartStyle }>;
}

export default function BirthForm({ onSubmit, loading, initialData }: BirthFormProps) {
  const t = useTranslations('kundali');
  const locale = useLocale() as Locale;
  const isDevanagari = isDevanagariLocale(locale);
  const headingFont = getHeadingFont(locale);

  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    date: initialData?.date || '1990-01-15',
    time: initialData?.time || '06:00',
    place: initialData?.place || '',
    lat: initialData?.lat || 0,
    lng: initialData?.lng || 0,
    timezone: initialData?.timezone || '', // Must come from LocationSearch — never use browser timezone
    ayanamsha: initialData?.ayanamsha || 'lahiri',
    chartStyle: (initialData?.chartStyle || 'north') as ChartStyle,
  });

  const [placeTimezone, setPlaceTimezone] = useState<string | null>(null);
  const user = useAuthStore(s => s.user);

  // Pre-fill from user profile if logged in
  useEffect(() => {
    if (!user) return;
    const supabase = getSupabase();
    if (!supabase) return;

    supabase.from('user_profiles')
      .select('display_name, date_of_birth, time_of_birth, birth_place, birth_lat, birth_lng, birth_timezone, default_location')
      .eq('id', user.id)
      .maybeSingle()
      .then(({ data }) => {
        if (!data) return;
        const loc = data.default_location as { lat?: number; lng?: number; name?: string; timezone?: string; birth_date?: string; birth_time?: string } | null;
        const newData: Partial<typeof formData> = {};

        if (data.display_name) newData.name = data.display_name;
        if (data.date_of_birth) newData.date = data.date_of_birth;
        if (data.time_of_birth) newData.time = data.time_of_birth.slice(0, 5); // HH:MM
        if (data.birth_place) newData.place = data.birth_place;
        if (data.birth_lat) newData.lat = Number(data.birth_lat);
        if (data.birth_lng) newData.lng = Number(data.birth_lng);
        if (data.birth_timezone) newData.timezone = data.birth_timezone;

        // Fallback to default_location if birth columns are empty
        if (!newData.place && loc?.name) newData.place = loc.name;
        if (!newData.lat && loc?.lat) newData.lat = loc.lat;
        if (!newData.lng && loc?.lng) newData.lng = loc.lng;
        if (!newData.date && loc?.birth_date) newData.date = loc.birth_date;
        if (!newData.time && loc?.birth_time) newData.time = loc.birth_time;
        if (!newData.timezone && loc?.timezone) newData.timezone = loc.timezone;

        if (Object.keys(newData).length > 0) {
          // ALWAYS resolve timezone from birth coordinates — never trust stored timezone.
          // Stored timezone may be stale, wrong (browser tz instead of birth location tz), or corrupted.
          delete newData.timezone;
          setFormData(prev => ({ ...prev, ...newData }));
          const lat = newData.lat || initialData?.lat;
          const lng = newData.lng || initialData?.lng;
          if (lat && lng) {
            resolveTimezoneFromCoords(lat, lng).then(tz => {
              setFormData(prev => ({ ...prev, timezone: tz }));
            });
          }
        }
      });
  }, [user]);

  const [locationError, setLocationError] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // ALWAYS resolve timezone from birth coordinates at submit time — never trust any stored value
    if (!formData.lat || !formData.lng) {
      setLocationError(true);
      return;
    }
    setLocationError(false);
    const tz = await resolveTimezoneFromCoords(formData.lat, formData.lng);
    setFormData(prev => ({ ...prev, timezone: tz }));
    if (!tz) return;
    onSubmit(
      {
        name: formData.name,
        date: formData.date,
        time: formData.time,
        place: formData.place,
        lat: formData.lat,
        lng: formData.lng,
        timezone: tz,
        ayanamsha: formData.ayanamsha,
      },
      formData.chartStyle
    );
  };

  return (
    <motion.form
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      onSubmit={handleSubmit}
      className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-2xl p-8 max-w-2xl mx-auto"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Name */}
        <div className="md:col-span-2">
          <label className="block text-gold-dark text-sm mb-2">{t('name')}</label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full bg-bg-tertiary/50 border border-gold-primary/20 rounded-lg px-4 py-3 text-text-primary focus:outline-none focus:border-gold-primary/50 transition-colors"
            placeholder={tl({ en: 'Enter your name', hi: 'अपना नाम दर्ज करें', sa: 'स्वनाम लिखत', ta: 'உங்கள் பெயரை உள்ளிடுக', te: 'మీ పేరు నమోదు చేయండి', bn: 'আপনার নাম লিখুন', kn: 'ನಿಮ್ಮ ಹೆಸರು ನಮೂದಿಸಿ', gu: 'તમારું નામ દાખલ કરો', mai: 'अपन नाम लिखू', mr: 'तुमचे नाव टाका' }, locale)}
          />
        </div>

        {/* Date of Birth */}
        <div>
          <label className="block text-gold-dark text-sm mb-2">{t('dateOfBirth')}</label>
          <input
            type="date"
            value={formData.date}
            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
            required
            className="w-full bg-bg-tertiary/50 border border-gold-primary/20 rounded-lg px-4 py-3 text-text-primary focus:outline-none focus:border-gold-primary/50 transition-colors"
          />
        </div>

        {/* Time of Birth */}
        <div>
          <label className="block text-gold-dark text-sm mb-2">{t('timeOfBirth')}</label>
          <input
            type="time"
            value={formData.time}
            onChange={(e) => setFormData({ ...formData, time: e.target.value })}
            required
            className="w-full bg-bg-tertiary/50 border border-gold-primary/20 rounded-lg px-4 py-3 text-text-primary focus:outline-none focus:border-gold-primary/50 transition-colors"
          />
        </div>

        {/* Place of Birth */}
        <div className="md:col-span-2">
          <label className="block text-gold-dark text-sm mb-2">{t('placeOfBirth')}</label>
          <LocationSearch
            value={formData.place}
            onSelect={(loc) => {
              setFormData({
                ...formData,
                place: loc.name,
                lat: loc.lat,
                lng: loc.lng,
                timezone: loc.timezone || formData.timezone,
              });
              setPlaceTimezone(loc.timezone || null);
            }}
            placeholder={tl({ en: 'Search birth city...', hi: 'जन्म शहर खोजें...', sa: 'जन्मनगरं अन्वेषयत...', ta: 'பிறந்த நகரைத் தேடுங்கள்...', te: 'జన్మ నగరాన్ని వెతకండి...', bn: 'জন্মশহর খুঁজুন...', kn: 'ಜನ್ಮ ನಗರ ಹುಡುಕಿ...', gu: 'જન્મ શહેર શોધો...', mai: 'जन्म नगर खोजू...', mr: 'जन्म शहर शोधा...' }, locale)}
          />
          {locationError && (
            <p className="text-red-400 text-xs mt-1">{tl({ en: 'Please select a birth location', hi: 'कृपया जन्म स्थान चुनें', sa: 'कृपया जन्मस्थानं चिनुत', ta: 'தயவுசெய்து பிறந்த இடத்தைத் தேர்ந்தெடுங்கள்', te: 'దయచేసి జన్మ స్థానాన్ని ఎంచుకోండి', bn: 'অনুগ্রহ করে জন্মস্থান নির্বাচন করুন', kn: 'ದಯವಿಟ್ಟು ಜನ್ಮಸ್ಥಳ ಆಯ್ಕೆ ಮಾಡಿ', gu: 'કૃપા કરી જન્મ સ્થળ પસંદ કરો', mai: 'कृपया जन्म स्थान चुनू', mr: 'कृपया जन्मस्थान निवडा' }, locale)}</p>
          )}
        </div>

        {/* Ayanamsha */}
        <div>
          <label className="block text-gold-dark text-sm mb-2">{t('ayanamsha')}</label>
          <select
            value={formData.ayanamsha}
            onChange={(e) => setFormData({ ...formData, ayanamsha: e.target.value })}
            className="w-full bg-bg-tertiary/50 border border-gold-primary/20 rounded-lg px-4 py-3 text-text-primary focus:outline-none focus:border-gold-primary/50 transition-colors"
          >
            <optgroup label={tl({ en: 'Standard', hi: 'मानक', sa: 'मानकः', ta: 'நிலையான', te: 'ప్రమాణ', bn: 'মানক', kn: 'ಮಾನದಂಡ', gu: 'માનક', mai: 'मानक', mr: 'मानक' }, locale)}>
              <option value="lahiri">{tl({ en: 'Lahiri (Chitrapaksha) — Indian Standard', hi: 'लाहिरी (चित्रपक्ष) — भारतीय मानक', sa: 'लाहिरी (चित्रपक्षः) — भारतीयमानकः', ta: 'லாஹிரி (சித்ரபக்ஷ) — இந்திய நிலையான', te: 'లాహిరీ (చిత్రపక్ష) — భారతీయ ప్రమాణం', bn: 'লাহিড়ি (চিত্রপক্ষ) — ভারতীয় মানক', kn: 'ಲಾಹಿರಿ (ಚಿತ್ರಪಕ್ಷ) — ಭಾರತೀಯ ಮಾನದಂಡ', gu: 'લાહિરી (ચિત્રપક્ષ) — ભારતીય માનક', mai: 'लाहिरी (चित्रपक्ष) — भारतीय मानक', mr: 'लाहिरी (चित्रपक्ष) — भारतीय मानक' }, locale)}</option>
              <option value="true_chitra">{tl({ en: 'True Chitrapaksha — Tracks Spica live', hi: 'यथार्थ चित्रपक्ष — चित्रा तारे की वास्तविक स्थिति', sa: 'यथार्थचित्रपक्षः — चित्रातारकां साक्षात् अनुसरति', ta: 'உண்மையான சித்ரபக்ஷ — சிட்ரா நட்சத்திரை நேரடியாக கண்காணிக்கிறது', te: 'నిజమైన చిత్రపక్ష — చిత్రా నక్షత్రాన్ని నేరుగా అనుసరిస్తుంది', bn: 'প্রকৃত চিত্রপক্ষ — চিত্রা তারা সরাসরি অনুসরণ করে', kn: 'ನಿಜವಾದ ಚಿತ್ರಪಕ್ಷ — ಚಿತ್ರಾ ನಕ್ಷತ್ರವನ್ನು ನೇರವಾಗಿ ಅನುಸರಿಸುತ್ತದೆ', gu: 'સાચો ચિત્રપક્ષ — ચિત્રા તારાને સીધો અનુસરે છે', mai: 'यथार्थ चित्रपक्ष — चित्रा तारा केँ प्रत्यक्ष अनुसरण', mr: 'यथार्थ चित्रपक्ष — चित्रा ताऱ्याचे थेट अनुसरण' }, locale)}</option>
              <option value="kp">{tl({ en: 'KP (Krishnamurti)', hi: 'केपी (कृष्णमूर्ति)', sa: 'केपी (कृष्णमूर्तिः)', ta: 'கேபி (கிருஷ்ணமூர்த்தி)', te: 'కేపీ (కృష్ణమూర్తి)', bn: 'কেপি (কৃষ্ণমূর্তি)', kn: 'ಕೆಪಿ (ಕೃಷ್ಣಮೂರ್ತಿ)', gu: 'કેપી (કૃષ્ણમૂર્તિ)', mai: 'केपी (कृष्णमूर्ति)', mr: 'केपी (कृष्णमूर्ती)' }, locale)}</option>
            </optgroup>
            <optgroup label={tl({ en: 'Classical', hi: 'शास्त्रीय', sa: 'शास्त्रीयः', ta: 'சாஸ்திரீய', te: 'శాస్త్రీయ', bn: 'শাস্ত্রীয়', kn: 'ಶಾಸ್ತ್ರೀಯ', gu: 'શાસ્ત્રીય', mai: 'शास्त्रीय', mr: 'शास्त्रीय' }, locale)}>
              <option value="raman">{tl({ en: 'BV Raman', hi: 'बीवी रमण', sa: 'बीवी रमणः', ta: 'பிவி ராமன்', te: 'బివి రమణ', bn: 'বিভি রামন', kn: 'ಬಿವಿ ರಮಣ', gu: 'બીવી રમણ', mai: 'बीवी रमण', mr: 'बीव्ही रमण' }, locale)}</option>
              <option value="yukteshwar">{tl({ en: 'Sri Yukteshwar', hi: 'श्री युक्तेश्वर', sa: 'श्रीयुक्तेश्वरः', ta: 'ஸ்ரீ யுக்தேஸ்வர்', te: 'శ్రీ యుక్తేశ్వర్', bn: 'শ্রী যুক্তেশ্বর', kn: 'ಶ್ರೀ ಯುಕ್ತೇಶ್ವರ', gu: 'શ્રી યુક્તેશ્વર', mai: 'श्री युक्तेश्वर', mr: 'श्री युक्तेश्वर' }, locale)}</option>
              <option value="jn_bhasin">{tl({ en: 'JN Bhasin', hi: 'जेएन भसीन', sa: 'जेएन भसीनः', ta: 'ஜேஎன் பாசின்', te: 'జెఎన్ భసిన్', bn: 'জেএন ভাসিন', kn: 'ಜೆಎನ್ ಭಾಸಿನ್', gu: 'જેએન ભાસિન', mai: 'जेएन भसीन', mr: 'जेएन भसीन' }, locale)}</option>
            </optgroup>
            <optgroup label={tl({ en: 'Star-Anchored', hi: 'तारा-आधारित', sa: 'तारा-आधारितः', ta: 'நட்சத்திர-நங்கூரமிட்ட', te: 'నక్షత్ర-స్థిరీకృత', bn: 'তারা-নির্ধারিত', kn: 'ನಕ್ಷತ್ರ-ಆಧಾರಿತ', gu: 'તારા-આધારિત', mai: 'तारा-आधारित', mr: 'तारा-आधारित' }, locale)}>
              <option value="true_revati">{tl({ en: 'True Revati — Revati star at 0° Aries', hi: 'यथार्थ रेवती — रेवती तारा 0° मेष पर', sa: 'यथार्थरेवती — रेवतीतारका 0° मेषे', ta: 'உண்மையான ரேவதி — ரேவதி நட்சத்திரம் 0° மேஷத்தில்', te: 'నిజమైన రేవతి — రేవతి నక్షత్రం 0° మేషంలో', bn: 'প্রকৃত রেবতী — রেবতী তারা 0° মেষে', kn: 'ನಿಜವಾದ ರೇವತಿ — ರೇವತಿ ನಕ್ಷತ್ರ 0° ಮೇಷದಲ್ಲಿ', gu: 'સાચી રેવતી — રેવતી તારો 0° મેષ રાશિ પર', mai: 'यथार्थ रेवती — रेवती तारा 0° मेष पर', mr: 'यथार्थ रेवती — रेवती तारा 0° मेषावर' }, locale)}</option>
              <option value="true_pushya">{tl({ en: 'True Pushya — Pushya star anchored', hi: 'यथार्थ पुष्य — पुष्य तारा आधारित', sa: 'यथार्थपुष्यः — पुष्यतारका आधारितः', ta: 'உண்மையான புஷ்யா — புஷ்யா நட்சத்திரம் நங்கூரமிட்டது', te: 'నిజమైన పుష్య — పుష్య నక్షత్రం స్థిరీకృతం', bn: 'প্রকৃত পুষ্য — পুষ্য তারা নির্ধারিত', kn: 'ನಿಜವಾದ ಪುಷ್ಯ — ಪುಷ್ಯ ನಕ್ಷತ್ರ ಆಧಾರಿತ', gu: 'સાચો પુષ્ય — પુષ્ય તારો નિર્ધારિત', mai: 'यथार्थ पुष्य — पुष्य तारा आधारित', mr: 'यथार्थ पुष्य — पुष्य तारा आधारित' }, locale)}</option>
              <option value="galactic_center">{tl({ en: 'Galactic Center at 0° Sagittarius', hi: 'गैलेक्टिक केन्द्र 0° धनु पर', sa: 'गगनकेन्द्रं 0° धनुषि', ta: 'விண்மீன்மண்டல மையம் 0° தனுசில்', te: 'గెలాక్టిక్ కేంద్రం 0° ధనుస్సులో', bn: 'গ্যালাক্টিক কেন্দ্র 0° ধনুতে', kn: 'ಗ್ಯಾಲಕ್ಟಿಕ್ ಕೇಂದ್ರ 0° ಧನುಸ್ಸಿನಲ್ಲಿ', gu: 'ગેલેક્ટિક કેન્દ્ર 0° ધનુ પર', mai: 'गैलेक्टिक केन्द्र 0° धनु पर', mr: 'गॅलेक्टिक केंद्र 0° धनुवर' }, locale)}</option>
            </optgroup>
            <optgroup label={tl({ en: 'Western Sidereal', hi: 'पश्चिमी सायन', sa: 'पाश्चात्यनाक्षत्रम्', ta: 'மேற்கத்திய நட்சத்திர', te: 'పాశ్చాత్య నాక్షత్ర', bn: 'পাশ্চাত্য নাক্ষত্র', kn: 'ಪಾಶ್ಚಾತ್ಯ ನಾಕ್ಷತ್ರ', gu: 'પાશ્ચાત્ય નાક્ષત્ર', mai: 'पश्चिमी नाक्षत्र', mr: 'पाश्चात्य नाक्षत्र' }, locale)}>
              <option value="fagan_bradley">{tl({ en: 'Fagan-Bradley', hi: 'फगन-ब्रैडले', sa: 'फगन-ब्रैडलेः', ta: 'ஃபேகன்-பிராட்லி', te: 'ఫేగన్-బ్రాడ్లీ', bn: 'ফেগান-ব্র্যাডলি', kn: 'ಫೇಗನ್-ಬ್ರಾಡ್ಲಿ', gu: 'ફેગન-બ્રેડ્લી', mai: 'फगन-ब्रैडले', mr: 'फेगन-ब्रॅडले' }, locale)}</option>
            </optgroup>
          </select>
        </div>

        {/* Chart Style */}
        <div className="md:col-span-2">
          <label className="block text-gold-dark text-sm mb-2">{t('chartStyle')}</label>
          <div className="flex gap-4">
            <button
              type="button"
              onClick={() => setFormData({ ...formData, chartStyle: 'north' })}
              className={`flex-1 py-3 rounded-lg border transition-all ${
                formData.chartStyle === 'north'
                  ? 'bg-gold-primary/20 border-gold-primary text-gold-light'
                  : 'border-gold-primary/20 text-text-secondary hover:border-gold-primary/40'
              }`}
            >
              ◇ {t('north')}
            </button>
            <button
              type="button"
              onClick={() => setFormData({ ...formData, chartStyle: 'south' })}
              className={`flex-1 py-3 rounded-lg border transition-all ${
                formData.chartStyle === 'south'
                  ? 'bg-gold-primary/20 border-gold-primary text-gold-light'
                  : 'border-gold-primary/20 text-text-secondary hover:border-gold-primary/40'
              }`}
            >
              ▦ {t('south')}
            </button>
          </div>
        </div>
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={loading}
        className="w-full mt-8 py-4 bg-gradient-to-r from-gold-dark to-gold-primary text-bg-primary font-semibold rounded-lg hover:from-gold-primary hover:to-gold-light transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        {loading ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            {t('generating')}
          </>
        ) : (
          t('generate')
        )}
      </button>
    </motion.form>
  );
}
