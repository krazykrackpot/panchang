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
            placeholder={tl({ en: 'Enter your name', hi: 'अपना नाम दर्ज करें', sa: 'अपना नाम दर्ज करें', ta: 'Enter your name', te: 'Enter your name', bn: 'Enter your name', kn: 'Enter your name', gu: 'Enter your name', mai: 'अपना नाम दर्ज करें', mr: 'अपना नाम दर्ज करें' }, locale)}
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
            placeholder={tl({ en: 'Search birth city...', hi: 'जन्म शहर खोजें...', sa: 'जन्म शहर खोजें...', ta: 'Search birth city...', te: 'Search birth city...', bn: 'Search birth city...', kn: 'Search birth city...', gu: 'Search birth city...', mai: 'जन्म शहर खोजें...', mr: 'जन्म शहर खोजें...' }, locale)}
          />
          {locationError && (
            <p className="text-red-400 text-xs mt-1">{tl({ en: 'Please select a birth location', hi: 'कृपया जन्म स्थान चुनें', sa: 'कृपया जन्म स्थान चुनें', ta: 'Please select a birth location', te: 'Please select a birth location', bn: 'Please select a birth location', kn: 'Please select a birth location', gu: 'Please select a birth location', mai: 'कृपया जन्म स्थान चुनें', mr: 'कृपया जन्म स्थान चुनें' }, locale)}</p>
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
            <optgroup label={tl({ en: 'Standard', hi: 'मानक', sa: 'मानक', ta: 'Standard', te: 'Standard', bn: 'Standard', kn: 'Standard', gu: 'Standard', mai: 'मानक', mr: 'मानक' }, locale)}>
              <option value="lahiri">{tl({ en: 'Lahiri (Chitrapaksha) — Indian Standard', hi: 'लाहिरी (चित्रपक्ष) — भारतीय मानक', sa: 'लाहिरी (चित्रपक्ष) — भारतीय मानक', ta: 'Lahiri (Chitrapaksha) — Indian Standard', te: 'Lahiri (Chitrapaksha) — Indian Standard', bn: 'Lahiri (Chitrapaksha) — Indian Standard', kn: 'Lahiri (Chitrapaksha) — Indian Standard', gu: 'Lahiri (Chitrapaksha) — Indian Standard', mai: 'लाहिरी (चित्रपक्ष) — भारतीय मानक', mr: 'लाहिरी (चित्रपक्ष) — भारतीय मानक' }, locale)}</option>
              <option value="true_chitra">{tl({ en: 'True Chitrapaksha — Tracks Spica live', hi: 'यथार्थ चित्रपक्ष — चित्रा तारे की वास्तविक स्थिति', sa: 'यथार्थ चित्रपक्ष — चित्रा तारे की वास्तविक स्थिति', ta: 'True Chitrapaksha — Tracks Spica live', te: 'True Chitrapaksha — Tracks Spica live', bn: 'True Chitrapaksha — Tracks Spica live', kn: 'True Chitrapaksha — Tracks Spica live', gu: 'True Chitrapaksha — Tracks Spica live', mai: 'यथार्थ चित्रपक्ष — चित्रा तारे की वास्तविक स्थिति', mr: 'यथार्थ चित्रपक्ष — चित्रा तारे की वास्तविक स्थिति' }, locale)}</option>
              <option value="kp">{tl({ en: 'KP (Krishnamurti)', hi: 'केपी (कृष्णमूर्ति)', sa: 'केपी (कृष्णमूर्ति)', ta: 'KP (Krishnamurti)', te: 'KP (Krishnamurti)', bn: 'KP (Krishnamurti)', kn: 'KP (Krishnamurti)', gu: 'KP (Krishnamurti)', mai: 'केपी (कृष्णमूर्ति)', mr: 'केपी (कृष्णमूर्ति)' }, locale)}</option>
            </optgroup>
            <optgroup label={tl({ en: 'Classical', hi: 'शास्त्रीय', sa: 'शास्त्रीय', ta: 'Classical', te: 'Classical', bn: 'Classical', kn: 'Classical', gu: 'Classical', mai: 'शास्त्रीय', mr: 'शास्त्रीय' }, locale)}>
              <option value="raman">{tl({ en: 'BV Raman', hi: 'बीवी रमण', sa: 'बीवी रमण', ta: 'BV Raman', te: 'BV Raman', bn: 'BV Raman', kn: 'BV Raman', gu: 'BV Raman', mai: 'बीवी रमण', mr: 'बीवी रमण' }, locale)}</option>
              <option value="yukteshwar">{tl({ en: 'Sri Yukteshwar', hi: 'श्री युक्तेश्वर', sa: 'श्री युक्तेश्वर', ta: 'Sri Yukteshwar', te: 'Sri Yukteshwar', bn: 'Sri Yukteshwar', kn: 'Sri Yukteshwar', gu: 'Sri Yukteshwar', mai: 'श्री युक्तेश्वर', mr: 'श्री युक्तेश्वर' }, locale)}</option>
              <option value="jn_bhasin">{tl({ en: 'JN Bhasin', hi: 'जेएन भसीन', sa: 'जेएन भसीन', ta: 'JN Bhasin', te: 'JN Bhasin', bn: 'JN Bhasin', kn: 'JN Bhasin', gu: 'JN Bhasin', mai: 'जेएन भसीन', mr: 'जेएन भसीन' }, locale)}</option>
            </optgroup>
            <optgroup label={tl({ en: 'Star-Anchored', hi: 'तारा-आधारित', sa: 'तारा-आधारित', ta: 'Star-Anchored', te: 'Star-Anchored', bn: 'Star-Anchored', kn: 'Star-Anchored', gu: 'Star-Anchored', mai: 'तारा-आधारित', mr: 'तारा-आधारित' }, locale)}>
              <option value="true_revati">{tl({ en: 'True Revati — Revati star at 0° Aries', hi: 'यथार्थ रेवती — रेवती तारा 0° मेष पर', sa: 'यथार्थ रेवती — रेवती तारा 0° मेष पर', ta: 'True Revati — Revati star at 0° Aries', te: 'True Revati — Revati star at 0° Aries', bn: 'True Revati — Revati star at 0° Aries', kn: 'True Revati — Revati star at 0° Aries', gu: 'True Revati — Revati star at 0° Aries', mai: 'यथार्थ रेवती — रेवती तारा 0° मेष पर', mr: 'यथार्थ रेवती — रेवती तारा 0° मेष पर' }, locale)}</option>
              <option value="true_pushya">{tl({ en: 'True Pushya — Pushya star anchored', hi: 'यथार्थ पुष्य — पुष्य तारा आधारित', sa: 'यथार्थ पुष्य — पुष्य तारा आधारित', ta: 'True Pushya — Pushya star anchored', te: 'True Pushya — Pushya star anchored', bn: 'True Pushya — Pushya star anchored', kn: 'True Pushya — Pushya star anchored', gu: 'True Pushya — Pushya star anchored', mai: 'यथार्थ पुष्य — पुष्य तारा आधारित', mr: 'यथार्थ पुष्य — पुष्य तारा आधारित' }, locale)}</option>
              <option value="galactic_center">{tl({ en: 'Galactic Center at 0° Sagittarius', hi: 'गैलेक्टिक केन्द्र 0° धनु पर', sa: 'गैलेक्टिक केन्द्र 0° धनु पर', ta: 'Galactic Center at 0° Sagittarius', te: 'Galactic Center at 0° Sagittarius', bn: 'Galactic Center at 0° Sagittarius', kn: 'Galactic Center at 0° Sagittarius', gu: 'Galactic Center at 0° Sagittarius', mai: 'गैलेक्टिक केन्द्र 0° धनु पर', mr: 'गैलेक्टिक केन्द्र 0° धनु पर' }, locale)}</option>
            </optgroup>
            <optgroup label={tl({ en: 'Western Sidereal', hi: 'पश्चिमी सायन', sa: 'पश्चिमी सायन', ta: 'Western Sidereal', te: 'Western Sidereal', bn: 'Western Sidereal', kn: 'Western Sidereal', gu: 'Western Sidereal', mai: 'पश्चिमी सायन', mr: 'पश्चिमी सायन' }, locale)}>
              <option value="fagan_bradley">{tl({ en: 'Fagan-Bradley', hi: 'फगन-ब्रैडले', sa: 'फगन-ब्रैडले', ta: 'Fagan-Bradley', te: 'Fagan-Bradley', bn: 'Fagan-Bradley', kn: 'Fagan-Bradley', gu: 'Fagan-Bradley', mai: 'फगन-ब्रैडले', mr: 'फगन-ब्रैडले' }, locale)}</option>
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
