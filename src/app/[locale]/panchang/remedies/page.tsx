'use client';

import { useState, useEffect, useCallback } from 'react';
import { useLocale } from 'next-intl';
import { motion } from 'framer-motion';
import { Link } from '@/lib/i18n/navigation';
import { ArrowLeft, Loader2 } from 'lucide-react';
import GoldDivider from '@/components/ui/GoldDivider';
import { GrahaIconById } from '@/components/icons/GrahaIcons';
import type { PanchangData, Locale } from '@/types/panchang';
import { isDevanagariLocale } from '@/lib/utils/locale-fonts';
import { useAuthStore } from '@/stores/auth-store';
import { computeHoraTable } from '@/lib/panchang/hora-engine';
import { getVaraRemedies } from '@/lib/remedies/prescription-engine';
import type { VaraRemedy } from '@/lib/remedies/prescription-engine';

interface LocationData {
  lat: number;
  lng: number;
  name: string;
  tz: number;
}

export default function RemediesPage() {
  const locale = useLocale() as Locale;
  const isDevanagari = isDevanagariLocale(locale);
  const headingFont = isDevanagari ? { fontFamily: 'var(--font-devanagari-heading)' } : { fontFamily: 'var(--font-heading)' };
  const authUser = useAuthStore(s => s.user);

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
            console.error('[remedies] IP geolocation fallback failed:', err);
            setLoading(false);
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
      .catch((err) => { console.error('[remedies] fetch failed:', err); setLoading(false); });
  }, [selectedDate, location]);

  useEffect(() => { fetchPanchang(); }, [fetchPanchang]);

  // Compute remedies when panchang is available
  let varaRemedy: VaraRemedy | null = null;
  let dayHoraWindows: { start: string; end: string }[] = [];
  if (panchang) {
    const horaTable = computeHoraTable(panchang.sunrise, panchang.sunset, panchang.sunrise, panchang.vara.day);
    varaRemedy = getVaraRemedies(panchang.vara.day, horaTable, locale);
    dayHoraWindows = varaRemedy.horaWindows.filter((_, i) => i < 4);
  }

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
        ) : panchang && varaRemedy ? (
          <>
            <div className="my-14 scroll-mt-16">
              <h1 className="text-3xl font-bold text-gold-gradient mb-2 text-center" style={headingFont}>
                {isDevanagari ? 'आज के उपाय' : "Today's Remedies"}
              </h1>
              <p className="text-text-secondary text-sm text-center mb-8 max-w-2xl mx-auto">
                {isDevanagari
                  ? `${varaRemedy.message.hi}`
                  : `${varaRemedy.message.en}`}
              </p>

              <div className="rounded-2xl bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 p-6">
                {/* Planet header */}
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-14 h-14 rounded-full bg-gold-primary/10 border border-gold-primary/20 flex items-center justify-center">
                    <GrahaIconById id={varaRemedy.planet.id} size={32} />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gold-light" style={headingFont}>
                      {isDevanagari ? varaRemedy.planet.name.hi : varaRemedy.planet.name.en}
                    </h3>
                    <span className="inline-block mt-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-amber-500/15 text-amber-400 border border-amber-500/20">
                      {isDevanagari ? 'अनुशंसित' : 'Recommended'}
                    </span>
                  </div>
                </div>

                {/* Hora windows */}
                <div className="mb-5">
                  <h4 className="text-xs uppercase tracking-wider text-gold-dark font-bold mb-2">
                    {isDevanagari ? 'श्रेष्ठ होरा समय' : 'Optimal Hora Windows'}
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {dayHoraWindows.map((hw, i) => (
                      <div key={i} className="px-3 py-1.5 rounded-lg bg-gold-primary/8 border border-gold-primary/15">
                        <span className="font-mono text-xs text-gold-light">{hw.start}</span>
                        <span className="text-text-secondary/50 mx-1">—</span>
                        <span className="font-mono text-xs text-gold-light">{hw.end}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Prescription grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {/* Mantra */}
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}
                    className="rounded-xl bg-bg-secondary/60 border border-gold-primary/8 p-4">
                    <h5 className="text-[10px] uppercase tracking-wider text-gold-dark font-bold mb-2">
                      {isDevanagari ? 'बीज मंत्र' : 'Beej Mantra'}
                    </h5>
                    <p className="text-gold-light text-lg font-bold" style={{ fontFamily: 'var(--font-devanagari-body)' }}>
                      {varaRemedy.mantra.beej}
                    </p>
                    <p className="text-text-secondary/60 text-[10px] mt-1">
                      {varaRemedy.mantra.count}x {isDevanagari ? 'जप' : 'recitations'}
                    </p>
                  </motion.div>

                  {/* Charity */}
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
                    className="rounded-xl bg-bg-secondary/60 border border-gold-primary/8 p-4">
                    <h5 className="text-[10px] uppercase tracking-wider text-gold-dark font-bold mb-2">
                      {isDevanagari ? 'दान' : 'Charity'}
                    </h5>
                    <p className="text-text-primary text-sm">
                      {isDevanagari ? varaRemedy.charity.item.hi : varaRemedy.charity.item.en}
                    </p>
                    <p className="text-text-secondary/60 text-[10px] mt-1">
                      {isDevanagari ? varaRemedy.charity.direction.hi : varaRemedy.charity.direction.en}
                    </p>
                  </motion.div>

                  {/* Color */}
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
                    className="rounded-xl bg-bg-secondary/60 border border-gold-primary/8 p-4">
                    <h5 className="text-[10px] uppercase tracking-wider text-gold-dark font-bold mb-2">
                      {isDevanagari ? 'आज का रंग' : 'Color of the Day'}
                    </h5>
                    <p className="text-text-primary text-sm">
                      {isDevanagari ? varaRemedy.color.hi : varaRemedy.color.en}
                    </p>
                  </motion.div>

                  {/* Gemstone */}
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
                    className="rounded-xl bg-bg-secondary/60 border border-gold-primary/8 p-4">
                    <h5 className="text-[10px] uppercase tracking-wider text-gold-dark font-bold mb-2">
                      {isDevanagari ? 'रत्न' : 'Gemstone'}
                    </h5>
                    <p className="text-text-primary text-sm">
                      {isDevanagari ? varaRemedy.gemstone.hi : varaRemedy.gemstone.en}
                    </p>
                  </motion.div>
                </div>

                {/* Login prompt for personalized remedies */}
                {!authUser && (
                  <div className="mt-5 pt-4 border-t border-gold-primary/8 text-center">
                    <p className="text-text-secondary/60 text-xs">
                      {isDevanagari
                        ? 'व्यक्तिगत उपाय के लिए जन्मकुंडली बनाएं →'
                        : 'Generate your Kundali for personalized remedy prescriptions →'}
                    </p>
                    <Link
                      href="/kundali"
                      className="inline-block mt-2 px-4 py-1.5 rounded-full text-xs font-medium bg-gold-primary/10 text-gold-light border border-gold-primary/20 hover:bg-gold-primary/20 transition-colors"
                    >
                      {isDevanagari ? 'कुंडली बनाएं' : 'Create Kundali'}
                    </Link>
                  </div>
                )}
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
