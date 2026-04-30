'use client';
import { lt } from '@/lib/learn/translations';
import type { LocaleText } from '@/lib/learn/translations';
import MSG from '@/messages/components/birth-form.json';

const msg = (key: string, locale: string) => lt((MSG as unknown as Record<string, LocaleText>)[key], locale);

import { useState, useEffect } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import LocationSearch from '@/components/ui/LocationSearch';
import { useAuthStore } from '@/stores/auth-store';
import { getSupabase } from '@/lib/supabase/client';
import { resolveTimezoneFromCoords } from '@/lib/utils/timezone';
import type { BirthData, ChartStyle, ChartRelationship } from '@/types/kundali';
import type { Locale } from '@/types/panchang';
import { isDevanagariLocale, getHeadingFont } from '@/lib/utils/locale-fonts';

const RELATIONSHIP_OPTIONS: { value: ChartRelationship; en: string; hi: string }[] = [
  { value: 'self',    en: 'Self',    hi: 'स्वयं' },
  { value: 'spouse',  en: 'Spouse',  hi: 'पति/पत्नी' },
  { value: 'child',   en: 'Child',   hi: 'संतान' },
  { value: 'parent',  en: 'Parent',  hi: 'माता/पिता' },
  { value: 'sibling', en: 'Sibling', hi: 'भाई/बहन' },
  { value: 'friend',  en: 'Friend',  hi: 'मित्र' },
  { value: 'other',   en: 'Other',   hi: 'अन्य' },
];

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
    relationship: (initialData?.relationship || 'self') as ChartRelationship,
  });

  const [placeTimezone, setPlaceTimezone] = useState<string | null>(null);
  const user = useAuthStore(s => s.user);

  // Pre-fill from user profile if logged in — but NOT when editing an existing chart
  useEffect(() => {
    if (!user) return;
    if (initialData?.name) return; // Editing an existing chart — don't overwrite with profile data
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
        relationship: formData.relationship,
      },
      formData.chartStyle
    );
  };

  return (
    <motion.form
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      onSubmit={handleSubmit}
      className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-2xl p-4 sm:p-6 md:p-8 max-w-2xl mx-auto"
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
            placeholder={msg('namePlaceholder', locale)}
          />
        </div>

        {/* Chart for (relationship) */}
        <div className="md:col-span-2">
          <label className="block text-gold-dark text-sm mb-2">
            {isDevanagari ? 'किसके लिए' : 'Chart for'}
          </label>
          <div className="flex flex-wrap gap-2">
            {RELATIONSHIP_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => setFormData({ ...formData, relationship: opt.value })}
                className={`px-4 py-2.5 sm:px-3 sm:py-1.5 rounded-lg text-sm sm:text-xs font-medium border transition-all ${
                  formData.relationship === opt.value
                    ? 'bg-gold-primary/20 border-gold-primary/50 text-gold-light'
                    : 'border-gold-primary/15 text-text-secondary hover:border-gold-primary/30 hover:text-text-primary'
                }`}
              >
                {isDevanagari ? opt.hi : opt.en}
              </button>
            ))}
          </div>
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
            placeholder={msg('cityPlaceholder', locale)}
          />
          {locationError && (
            <p className="text-red-400 text-xs mt-1">{msg('locationError', locale)}</p>
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
            <optgroup label={msg('ayanamshaGroupStandard', locale)}>
              <option value="lahiri">{msg('ayanamshaLahiri', locale)}</option>
              <option value="true_chitra">{msg('ayanamshatrueChitra', locale)}</option>
              <option value="kp">{msg('ayanamshaKp', locale)}</option>
            </optgroup>
            <optgroup label={msg('ayanamshaGroupClassical', locale)}>
              <option value="raman">{msg('ayanamshaRaman', locale)}</option>
              <option value="yukteshwar">{msg('ayanamshaYukteshwar', locale)}</option>
              <option value="jn_bhasin">{msg('ayanamshaJnBhasin', locale)}</option>
            </optgroup>
            <optgroup label={msg('ayanamshaGroupStarAnchored', locale)}>
              <option value="true_revati">{msg('ayanamshatrueRevati', locale)}</option>
              <option value="true_pushya">{msg('ayanamshaTruePushya', locale)}</option>
              <option value="galactic_center">{msg('ayanamshaGalacticCenter', locale)}</option>
            </optgroup>
            <optgroup label={msg('ayanamshaGroupWesternSidereal', locale)}>
              <option value="fagan_bradley">{msg('ayanamshaFaganBradley', locale)}</option>
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
