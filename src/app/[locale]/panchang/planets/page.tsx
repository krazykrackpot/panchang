'use client';

import { useState, useEffect, useCallback } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { motion } from 'framer-motion';
import { Link } from '@/lib/i18n/navigation';
import { ArrowLeft, Loader2 } from 'lucide-react';
import GoldDivider from '@/components/ui/GoldDivider';
import { GrahaIconById } from '@/components/icons/GrahaIcons';
import { RashiIconById } from '@/components/icons/RashiIcons';
import { RASHIS } from '@/lib/constants/rashis';
import { NAKSHATRAS } from '@/lib/constants/nakshatras';
import type { PanchangData, Locale } from '@/types/panchang';
import { isDevanagariLocale } from '@/lib/utils/locale-fonts';

interface LocationData {
  lat: number;
  lng: number;
  name: string;
  tz: number;
}

export default function PlanetsPage() {
  const t = useTranslations('panchang');
  const locale = useLocale() as Locale;
  const isDevanagari = isDevanagariLocale(locale);
  const headingFont = isDevanagari ? { fontFamily: 'var(--font-devanagari-heading)' } : { fontFamily: 'var(--font-heading)' };

  const [panchang, setPanchang] = useState<PanchangData | null>(null);
  const [loading, setLoading] = useState(true);
  const [location, setLocation] = useState<LocationData>({ lat: 0, lng: 0, name: '', tz: 0 });
  const [selectedDate, setSelectedDate] = useState('');

  // Initialize date on client only
  useEffect(() => {
    const d = new Date();
    setSelectedDate(`${d.getFullYear()}-${(d.getMonth() + 1).toString().padStart(2, '0')}-${d.getDate().toString().padStart(2, '0')}`);
  }, []);

  // Detect location
  useEffect(() => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          try {
            const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=10`);
            const data = await res.json();
            const city = data.address?.city || data.address?.town || data.address?.village || data.address?.county || '';
            const country = data.address?.country || '';
            const name = [city, country].filter(Boolean).join(', ') || `${latitude.toFixed(2)}°N, ${longitude.toFixed(2)}°E`;
            setLocation({ lat: latitude, lng: longitude, name, tz: -new Date().getTimezoneOffset() / 60 });
          } catch {
            setLocation({ lat: latitude, lng: longitude, name: `${latitude.toFixed(2)}°N, ${longitude.toFixed(2)}°E`, tz: -new Date().getTimezoneOffset() / 60 });
          }
        },
        async () => {
          try {
            const res = await fetch('https://ipapi.co/json/');
            const data = await res.json();
            if (data.latitude && data.longitude) {
              let name = `${data.latitude.toFixed(2)}°, ${data.longitude.toFixed(2)}°`;
              try {
                const geo = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${data.latitude}&lon=${data.longitude}&zoom=10`);
                const geoData = await geo.json();
                const city = geoData.address?.city || geoData.address?.town || geoData.address?.village || '';
                const country = geoData.address?.country || '';
                name = [city, country].filter(Boolean).join(', ') || name;
              } catch { /* use coordinate fallback */ }
              let tz = -(new Date().getTimezoneOffset() / 60);
              if (data.utc_offset) {
                const sign = data.utc_offset[0] === '-' ? -1 : 1;
                const hh = parseInt(data.utc_offset.slice(1, 3), 10);
                const mm = parseInt(data.utc_offset.slice(3, 5), 10);
                tz = sign * (hh + mm / 60);
              }
              setLocation({ lat: data.latitude, lng: data.longitude, name, tz });
            }
          } catch (err) {
            console.error('[planets] IP geolocation fallback failed:', err);
          }
        },
        { timeout: 5000 }
      );
    }
  }, []);

  const fetchPanchang = useCallback(() => {
    if (!selectedDate) return;
    if (location.lat === 0 && location.lng === 0) return;
    setLoading(true);
    const [year, month, day] = selectedDate.split('-').map(Number);
    const ianaTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC';
    fetch(`/api/panchang?year=${year}&month=${month}&day=${day}&lat=${location.lat}&lng=${location.lng}&timezone=${encodeURIComponent(ianaTimezone)}&location=${encodeURIComponent(location.name)}`)
      .then(res => res.json())
      .then(data => { setPanchang(data); setLoading(false); })
      .catch((err) => { console.error('[planets] fetch failed:', err); setLoading(false); });
  }, [selectedDate, location]);

  useEffect(() => { fetchPanchang(); }, [fetchPanchang]);

  return (
    <div className="min-h-screen bg-bg-primary text-text-primary py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Back link */}
        <Link href="/panchang" className="inline-flex items-center gap-2 text-gold-primary hover:text-gold-light transition-colors mb-6">
          <ArrowLeft className="w-4 h-4" />
          <span className="text-sm">{isDevanagari ? 'पंचांग पर वापस' : 'Back to Panchang'}</span>
        </Link>

        {/* Date & location header */}
        <div className="text-center mb-4">
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="bg-bg-secondary border border-gold-primary/20 rounded-lg px-3 py-2 text-text-primary text-sm focus:outline-none focus:border-gold-primary/50 mb-2"
          />
          {location.name && (
            <p className="text-text-secondary text-xs">{location.name}</p>
          )}
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 text-gold-primary animate-spin" />
          </div>
        ) : panchang ? (
          <>
            <div className="my-14 scroll-mt-16">
              <h1 className="text-3xl font-bold text-gold-gradient mb-8 text-center" style={headingFont}>
                {t('planetaryPositions')}
              </h1>
              <div className="rounded-2xl bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-gold-primary/10">
                        <th className="text-left px-5 py-4 text-gold-dark uppercase text-xs tracking-wider font-bold">{t('planet')}</th>
                        <th className="text-left px-5 py-4 text-gold-dark uppercase text-xs tracking-wider font-bold">{t('sign')}</th>
                        <th className="text-left px-5 py-4 text-gold-dark uppercase text-xs tracking-wider font-bold">{t('longitude')}</th>
                        <th className="text-left px-5 py-4 text-gold-dark uppercase text-xs tracking-wider font-bold">{t('nakshatraCol')}</th>
                        <th className="text-center px-5 py-4 text-gold-dark uppercase text-xs tracking-wider font-bold">{t('retrograde')}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {panchang.planets.map((planet) => {
                        const rashi = RASHIS[(planet.rashi || 1) - 1];
                        const nak = NAKSHATRAS[(planet.nakshatra || 1) - 1];
                        return (
                          <motion.tr
                            key={planet.id}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="border-b border-gold-primary/5 hover:bg-bg-tertiary/30 transition-colors"
                          >
                            <td className="px-5 py-4">
                              <div className="flex items-center gap-3">
                                <GrahaIconById id={planet.id} size={32} />
                                <span className="text-text-primary font-medium" style={isDevanagari ? { fontFamily: 'var(--font-devanagari-body)' } : undefined}>
                                  {(planet.name[locale] || planet.name.en || '')}
                                </span>
                              </div>
                            </td>
                            <td className="px-5 py-4">
                              <div className="flex items-center gap-2">
                                <RashiIconById id={planet.rashi || 1} size={24} />
                                <span className="text-text-primary" style={isDevanagari ? { fontFamily: 'var(--font-devanagari-body)' } : undefined}>
                                  {(rashi?.name[locale] || rashi?.name?.en || '')}
                                </span>
                              </div>
                            </td>
                            <td className="px-5 py-4 font-mono text-text-secondary">{planet.longitude !== undefined ? `${planet.longitude.toFixed(2)}°` : '—'}</td>
                            <td className="px-5 py-4">
                              <span className="text-text-secondary" style={isDevanagari ? { fontFamily: 'var(--font-devanagari-body)' } : undefined}>{(nak?.name[locale] || nak?.name?.en || '')}</span>
                            </td>
                            <td className="px-5 py-4 text-center">
                              {planet.isRetrograde ? <span className="text-red-400 font-bold text-lg">R</span> : <span className="text-text-secondary/55">—</span>}
                            </td>
                          </motion.tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            <GoldDivider />

            {/* Back to panchang CTA */}
            <div className="text-center mt-8">
              <Link
                href="/panchang"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gold-primary/10 text-gold-light border border-gold-primary/20 hover:bg-gold-primary/20 transition-colors font-medium"
              >
                <ArrowLeft className="w-4 h-4" />
                {isDevanagari ? 'पंचांग पर वापस जाएं' : 'Back to Full Panchang'}
              </Link>
            </div>
          </>
        ) : (
          <div className="text-center text-text-secondary py-20">
            {isDevanagari ? 'डेटा लोड नहीं हो सका' : 'Could not load data'}
          </div>
        )}
      </div>
    </div>
  );
}
