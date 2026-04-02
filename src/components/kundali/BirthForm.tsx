'use client';

import { useState } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import type { BirthData, ChartStyle } from '@/types/kundali';
import type { Locale } from '@/types/panchang';

interface BirthFormProps {
  onSubmit: (data: BirthData, style: ChartStyle) => void;
  loading: boolean;
}

export default function BirthForm({ onSubmit, loading }: BirthFormProps) {
  const t = useTranslations('kundali');
  const locale = useLocale() as Locale;
  const isDevanagari = locale !== 'en';
  const headingFont = isDevanagari ? { fontFamily: 'var(--font-devanagari-heading)' } : { fontFamily: 'var(--font-heading)' };

  const [formData, setFormData] = useState({
    name: '',
    date: '1990-01-15',
    time: '06:00',
    place: '',
    lat: 0,
    lng: 0,
    timezone: typeof window !== 'undefined' ? Intl.DateTimeFormat().resolvedOptions().timeZone : 'UTC',
    ayanamsha: 'lahiri' as 'lahiri' | 'raman' | 'kp',
    chartStyle: 'north' as ChartStyle,
  });

  const [searchingPlace, setSearchingPlace] = useState(false);

  const handlePlaceSearch = async () => {
    if (!formData.place) return;
    setSearchingPlace(true);
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(formData.place)}&limit=1`
      );
      const data = await res.json();
      if (data.length > 0) {
        setFormData((prev) => ({
          ...prev,
          lat: parseFloat(data[0].lat),
          lng: parseFloat(data[0].lon),
          place: data[0].display_name.split(',').slice(0, 3).join(', '),
        }));
      }
    } catch {
      // Geocoding failed, keep existing coords
    }
    setSearchingPlace(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(
      {
        name: formData.name,
        date: formData.date,
        time: formData.time,
        place: formData.place,
        lat: formData.lat,
        lng: formData.lng,
        timezone: formData.timezone,
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
      className="glass-card rounded-2xl p-8 max-w-2xl mx-auto"
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
            placeholder={locale === 'en' ? 'Enter your name' : 'अपना नाम दर्ज करें'}
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
          <div className="flex gap-2">
            <input
              type="text"
              value={formData.place}
              onChange={(e) => setFormData({ ...formData, place: e.target.value })}
              required
              className="flex-1 bg-bg-tertiary/50 border border-gold-primary/20 rounded-lg px-4 py-3 text-text-primary focus:outline-none focus:border-gold-primary/50 transition-colors"
              placeholder={locale === 'en' ? 'City, Country' : 'शहर, देश'}
            />
            <button
              type="button"
              onClick={handlePlaceSearch}
              disabled={searchingPlace}
              className="px-4 py-3 bg-bg-tertiary border border-gold-primary/20 rounded-lg text-gold-light hover:bg-gold-primary/10 transition-colors disabled:opacity-50"
            >
              {searchingPlace ? <Loader2 className="w-4 h-4 animate-spin" /> : '📍'}
            </button>
          </div>
          <div className="text-text-secondary text-xs mt-1">
            Lat: {formData.lat.toFixed(4)}, Lng: {formData.lng.toFixed(4)}
          </div>
        </div>

        {/* Timezone */}
        <div>
          <label className="block text-gold-dark text-sm mb-2">Timezone</label>
          <input
            type="text"
            value={formData.timezone}
            onChange={(e) => setFormData({ ...formData, timezone: e.target.value })}
            placeholder="e.g., Asia/Kolkata or 5.5"
            className="w-full bg-bg-tertiary/50 border border-gold-primary/20 rounded-lg px-4 py-3 text-text-primary focus:outline-none focus:border-gold-primary/50 transition-colors"
          />
        </div>

        {/* Ayanamsha */}
        <div>
          <label className="block text-gold-dark text-sm mb-2">{t('ayanamsha')}</label>
          <select
            value={formData.ayanamsha}
            onChange={(e) => setFormData({ ...formData, ayanamsha: e.target.value as 'lahiri' | 'raman' | 'kp' })}
            className="w-full bg-bg-tertiary/50 border border-gold-primary/20 rounded-lg px-4 py-3 text-text-primary focus:outline-none focus:border-gold-primary/50 transition-colors"
          >
            <option value="lahiri">{t('lahiri')}</option>
            <option value="raman">{t('raman')}</option>
            <option value="kp">{t('kp')}</option>
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
