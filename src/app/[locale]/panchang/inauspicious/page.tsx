'use client';

import { useState, useEffect, useCallback } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { Link } from '@/lib/i18n/navigation';
import { ArrowLeft, MapPin, Loader2 } from 'lucide-react';
import LocationSearch from '@/components/ui/LocationSearch';
import GoldDivider from '@/components/ui/GoldDivider';
import type { PanchangData, Locale, LocaleText } from '@/types/panchang';
import { getUTCOffsetForDate } from '@/lib/utils/timezone';
import { isDevanagariLocale } from '@/lib/utils/locale-fonts';
import { useLocationStore } from '@/stores/location-store';
import { tl as _tl } from '@/lib/utils/trilingual';
import { lt } from '@/lib/learn/translations';
import PMSG from '@/messages/pages/panchang-inline.json';

const msg = (key: string, locale: string): string =>
  lt((PMSG as unknown as Record<string, LocaleText>)[key], locale);

// Section heading — same component as PanchangClient
function SectionHeading({
  icon,
  title,
  subtitle,
  accentClass = 'text-gold-gradient',
}: {
  icon: React.ReactNode;
  title: string;
  subtitle?: string;
  accentClass?: string;
}) {
  return (
    <div className="text-center mb-8">
      <div className="flex justify-center mb-3">{icon}</div>
      <h2 className={`text-3xl font-bold mb-2 ${accentClass}`}>{title}</h2>
      {subtitle && <p className="text-text-secondary text-sm max-w-xl mx-auto">{subtitle}</p>}
    </div>
  );
}

interface LocationData {
  lat: number;
  lng: number;
  name: string;
  tz: number;
}

export default function InauspiciousTimingsPage() {
  const t = useTranslations('panchang');
  const locale = useLocale() as Locale;
  const isDevanagari = isDevanagariLocale(locale);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const tl = (obj: any): string => _tl(obj, locale);
  const headingFont = isDevanagari ? { fontFamily: 'var(--font-devanagari-heading)' } : { fontFamily: 'var(--font-heading)' };

  const [panchang, setPanchang] = useState<PanchangData | null>(null);
  const [loading, setLoading] = useState(true);
  const [location, setLocation] = useState<LocationData>({ lat: 0, lng: 0, name: '', tz: 0 });
  const [selectedDate, setSelectedDate] = useState('');
  const [showLocationSearch, setShowLocationSearch] = useState(false);
  const [detectingLocation, setDetectingLocation] = useState(false);

  // Initialize date on client only to avoid hydration mismatch
  useEffect(() => {
    const d = new Date();
    setSelectedDate(`${d.getFullYear()}-${(d.getMonth() + 1).toString().padStart(2, '0')}-${d.getDate().toString().padStart(2, '0')}`);
  }, []);

  // Geolocate user
  useEffect(() => {
    if ('geolocation' in navigator) {
      setDetectingLocation(true);
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          try {
            const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=10`);
            const data = await res.json();
            const city = data.address?.city || data.address?.town || data.address?.village || data.address?.county || '';
            const country = data.address?.country || '';
            const name = [city, country].filter(Boolean).join(', ') || `${latitude.toFixed(2)}N, ${longitude.toFixed(2)}E`;
            const browserTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC';
            const now = new Date();
            const tz = getUTCOffsetForDate(now.getUTCFullYear(), now.getUTCMonth() + 1, now.getUTCDate(), browserTimezone);
            setLocation({ lat: latitude, lng: longitude, name, tz });
          } catch {
            const browserTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC';
            const now = new Date();
            const tz = getUTCOffsetForDate(now.getUTCFullYear(), now.getUTCMonth() + 1, now.getUTCDate(), browserTimezone);
            setLocation({ lat: latitude, lng: longitude, name: `${latitude.toFixed(2)}N, ${longitude.toFixed(2)}E`, tz });
          }
          setDetectingLocation(false);
        },
        async () => {
          try {
            const res = await fetch('https://ipapi.co/json/');
            const data = await res.json();
            if (data.latitude && data.longitude) {
              let name = `${data.latitude.toFixed(2)}, ${data.longitude.toFixed(2)}`;
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
            console.error('[inauspicious] IP geolocation fallback failed:', err);
          }
          setDetectingLocation(false);
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
    // Location store timezone takes priority over browser timezone
    const ianaTimezone = useLocationStore.getState().timezone || Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC';
    fetch(`/api/panchang?year=${year}&month=${month}&day=${day}&lat=${location.lat}&lng=${location.lng}&timezone=${encodeURIComponent(ianaTimezone)}&location=${encodeURIComponent(location.name)}`)
      .then(res => res.json())
      .then(data => { setPanchang(data); setLoading(false); })
      .catch((err) => {
        console.error('[inauspicious] panchang fetch failed:', err);
        setLoading(false);
      });
  }, [selectedDate, location]);

  useEffect(() => { fetchPanchang(); }, [fetchPanchang]);


  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Back link */}
      <Link href="/panchang" className="inline-flex items-center gap-2 text-gold-primary hover:text-gold-light transition-colors mb-8 text-sm">
        <ArrowLeft className="w-4 h-4" />
        {isDevanagari ? 'पंचांग पर वापस' : 'Back to Panchang'}
      </Link>

      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10">
        <h1 className="text-3xl sm:text-4xl font-bold mb-3" style={headingFont}>
          <span className="text-gold-gradient">{msg('inauspiciousTimings', locale)}</span>
        </h1>
        <p className="text-text-secondary text-base max-w-xl mx-auto">{msg('inauspiciousTimingsDesc', locale)}</p>
      </motion.div>

      {/* Date & Location controls */}
      <div className="mb-8">
        <div className="flex flex-wrap items-center justify-center gap-3">
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="bg-bg-secondary border border-gold-primary/20 rounded-lg px-3 py-2 text-gold-light text-sm focus:outline-none focus:border-gold-primary/50"
          />
          <div className="flex items-center gap-2 text-sm text-text-secondary">
            <MapPin className="w-4 h-4 text-gold-primary" />
            {detectingLocation ? (
              <span className="flex items-center gap-1"><Loader2 className="w-3 h-3 animate-spin" /> {msg('detecting', locale)}</span>
            ) : (
              <span className="text-text-primary">{location.name || '...'}</span>
            )}
            <button
              onClick={() => setShowLocationSearch(!showLocationSearch)}
              className="text-gold-primary hover:text-gold-light text-xs underline underline-offset-2 cursor-pointer"
            >
              {msg('change', locale)}
            </button>
          </div>
        </div>
        {showLocationSearch && (
          <div className="flex justify-center mt-3">
            <LocationSearch
              value=""
              placeholder={msg('searchCity', locale)}
              className="w-full max-w-sm"
              onSelect={(loc) => {
                const now = new Date();
                const tz = getUTCOffsetForDate(now.getFullYear(), now.getMonth() + 1, now.getDate(), loc.timezone);
                setLocation({ lat: loc.lat, lng: loc.lng, name: loc.name, tz });
                setShowLocationSearch(false);
              }}
            />
          </div>
        )}
      </div>

      {/* Loading state */}
      {loading && (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-gold-primary" />
        </div>
      )}

      {/* Content */}
      {!loading && panchang && (
        <div>
          <SectionHeading
            icon={
              <svg width={56} height={56} viewBox="0 0 64 64" fill="none" aria-hidden="true">
                <defs>
                  <linearGradient id="red-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#fca5a5" />
                    <stop offset="100%" stopColor="#ef4444" />
                  </linearGradient>
                </defs>
                <circle cx="32" cy="32" r="26" stroke="url(#red-grad)" strokeWidth="2" fill="none" opacity="0.4" />
                <path d="M32 12v24M32 42v4" stroke="url(#red-grad)" strokeWidth="3" strokeLinecap="round" />
                <circle cx="32" cy="50" r="3" fill="#ef4444" />
              </svg>
            }
            title={msg('inauspiciousTimings', locale)}
            subtitle={msg('inauspiciousTimingsDesc', locale)}
            accentClass="text-red-400"
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-6">
            {/* Rahu Kalam */}
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.05 }}
              className="rounded-xl bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 p-3 sm:p-4 md:p-6 text-center border border-red-500/30 bg-gradient-to-br from-red-500/5 to-transparent">
              <div className="text-red-400 text-xs uppercase tracking-widest mb-2 font-bold">{t('rahuKaal')}</div>
              <div className="font-mono text-2xl font-bold text-red-300">{panchang.rahuKaal.start} — {panchang.rahuKaal.end}</div>
              <div className="text-text-secondary text-xs mt-2">{msg('rahuKaalDesc', locale)}</div>
            </motion.div>

            {/* Yamaganda */}
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.08 }}
              className="rounded-xl bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 p-3 sm:p-4 md:p-6 text-center border border-orange-500/30 bg-gradient-to-br from-orange-500/5 to-transparent">
              <div className="text-orange-400 text-xs uppercase tracking-widest mb-2 font-bold">{t('yamaganda')}</div>
              <div className="font-mono text-2xl font-bold text-orange-300">{panchang.yamaganda.start} — {panchang.yamaganda.end}</div>
              <div className="text-text-secondary text-xs mt-2">{msg('yamagandaDesc', locale)}</div>
            </motion.div>

            {/* Gulika Kaal */}
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.11 }}
              className="rounded-xl bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 p-3 sm:p-4 md:p-6 text-center border border-yellow-500/30 bg-gradient-to-br from-yellow-500/5 to-transparent">
              <div className="text-yellow-400 text-xs uppercase tracking-widest mb-2 font-bold">{t('gulikaKaal')}</div>
              <div className="font-mono text-2xl font-bold text-yellow-300">{panchang.gulikaKaal.start} — {panchang.gulikaKaal.end}</div>
              <div className="text-text-secondary text-xs mt-2">{msg('gulikaKaalDesc', locale)}</div>
            </motion.div>

            {/* Dur Muhurtam — two classical traditions */}
            {panchang.durMuhurtam && panchang.durMuhurtam.length > 0 && (
              <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.14 }}
                className="rounded-xl border border-red-600/30 bg-gradient-to-br from-red-600/5 to-transparent p-3 sm:p-4 md:p-6 text-center">
                <div className="text-red-500 text-xs uppercase tracking-widest mb-2 font-bold">
                  {msg('durMuhurtam', locale)}
                </div>
                <div className="text-text-secondary/50 text-[10px] mb-2">
                  {msg('kaalaPrakashika', locale)}
                </div>
                {panchang.durMuhurtam.map((w, i) => (
                  <div key={i} className="font-mono text-lg font-bold text-red-400 leading-tight">{w.start} — {w.end}</div>
                ))}
                {panchang.durMuhurtamAlt && panchang.durMuhurtamAlt.length > 0 && (
                  <details className="mt-3 text-left">
                    <summary className="text-text-tertiary/50 text-[10px] cursor-pointer hover:text-text-secondary transition-colors text-center">
                      {'▸ ' + msg('nirnayaSindhu', locale)}
                    </summary>
                    <div className="mt-2 text-center">
                      {panchang.durMuhurtamAlt.map((w: { start: string; end: string }, i: number) => (
                        <div key={i} className="font-mono text-sm text-red-400/60 leading-tight">{w.start} — {w.end}</div>
                      ))}
                    </div>
                  </details>
                )}
                <div className="text-text-secondary text-xs mt-2">{msg('inauspiciousAvoidAll', locale)}</div>
              </motion.div>
            )}

            {/* Visha Ghatika — 25th Ghatika poison period */}
            {panchang.vishaGhatika && (
              <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.15 }}
                className="rounded-xl bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-red-700/30 p-3 sm:p-4 md:p-6 text-center bg-gradient-to-br from-red-700/5 to-transparent">
                <div className="text-red-500 text-xs uppercase tracking-widest mb-2 font-bold">
                  {msg('vishaGhatika', locale)}
                </div>
                <div className="font-mono text-lg font-bold text-red-400">{panchang.vishaGhatika.start} — {panchang.vishaGhatika.end}</div>
                <div className="text-text-secondary text-xs mt-2">
                  {msg('vishaGhatikaDesc', locale)}
                </div>
              </motion.div>
            )}

            {/* Varjyam — show all windows */}
            {((panchang as unknown as Record<string, unknown>).varjyamAll as Array<{ start: string; end: string }> | undefined)?.length || panchang.varjyam ? (
              <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.17 }}
                className="rounded-xl bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 p-3 sm:p-4 md:p-6 text-center border border-red-400/25 bg-gradient-to-br from-red-400/5 to-transparent">
                <div className="text-red-400 text-xs uppercase tracking-widest mb-2 font-bold">{t('varjyam')}</div>
                {((panchang as unknown as Record<string, unknown>).varjyamAll as Array<{ start: string; end: string }> || [panchang.varjyam]).map((v: { start: string; end: string }, i: number) => (
                  <div key={i} className="font-mono text-xl font-bold text-red-300">{v.start} — {v.end}</div>
                ))}
                <div className="text-text-secondary text-xs mt-2">{t('varjyamDesc')}</div>
              </motion.div>
            ) : null}

            {/* Bhadra (Vishti Karana) */}
            {panchang.bhadra && (
              <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.18 }}
                className="rounded-xl border border-orange-500/30 bg-gradient-to-br from-orange-500/8 to-transparent p-3 sm:p-4 md:p-6 text-center">
                <div className="text-orange-400 text-xs uppercase tracking-widest mb-2 font-bold">
                  {msg('bhadraVishti', locale)}
                </div>
                {((panchang as unknown as Record<string, unknown>).bhadraAll as Array<{ start: string; end: string; endDate?: string }> || [panchang.bhadra]).map((b: { start: string; end: string; endDate?: string }, i: number) => (
                  <div key={i} className="font-mono text-xl font-bold text-orange-300">
                    {b.start} — {b.end}{b.endDate ? `, ${b.endDate.split('-').reverse().join('/')}` : ''}
                  </div>
                ))}
                <div className="text-text-secondary text-xs mt-2">
                  {msg('inauspiciousKarana', locale)}
                </div>
              </motion.div>
            )}

            {/* Ganda Moola — with time window */}
            {panchang.gandaMoola?.active && (
              <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.20 }}
                className="rounded-xl p-3 sm:p-4 md:p-6 text-center border-2 border-red-500/50 bg-gradient-to-br from-red-500/10 to-transparent">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse" />
                  <div className="text-red-400 text-xs uppercase tracking-widest font-bold">
                    {msg('gandaMoola', locale)}
                  </div>
                  <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse" />
                </div>
                {panchang.gandaMoola.nakshatra && (
                  <div className="text-red-300 font-bold text-base" style={headingFont}>
                    {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                    {((panchang.gandaMoola as any).nakshatra?.[locale] || (panchang.gandaMoola as any).nakshatra?.en || '')}
                  </div>
                )}
                {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                {(panchang.gandaMoola as any).start && (
                  <div className="font-mono text-lg font-bold text-red-300 mt-1">
                    {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                    {(panchang.gandaMoola as any).start} — {(panchang.gandaMoola as any).end}{(panchang.gandaMoola as any).endDate ? `, ${(panchang.gandaMoola as any).endDate.split('-').slice(1).join('/')}` : ''}
                  </div>
                )}
                <div className="text-text-secondary text-xs mt-2">
                  {msg('inauspiciousNakshatraJunction', locale)}
                </div>
              </motion.div>
            )}

            {/* Aadal Yoga */}
            {panchang.aadalYoga && (
              <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.21 }}
                className="rounded-xl border border-amber-500/25 bg-gradient-to-br from-amber-500/5 to-transparent p-3 sm:p-4 md:p-6 text-center">
                <div className="text-amber-400 text-xs uppercase tracking-widest mb-2 font-bold">
                  {msg('aadalYoga', locale)}
                </div>
                <div className="font-mono text-xl font-bold text-amber-300">
                  {panchang.aadalYoga.start} — {panchang.aadalYoga.end}{panchang.aadalYoga.endDate ? `, ${panchang.aadalYoga.endDate.split('-').slice(1).join('/')}` : ''}
                </div>
                <div className="text-text-secondary text-xs mt-2">
                  {msg('aadalYogaDesc', locale)}
                </div>
              </motion.div>
            )}

            {/* Vidaal Yoga */}
            {panchang.vidaalYoga && (
              <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.22 }}
                className="rounded-xl border border-rose-500/25 bg-gradient-to-br from-rose-500/5 to-transparent p-3 sm:p-4 md:p-6 text-center">
                <div className="text-rose-400 text-xs uppercase tracking-widest mb-2 font-bold">
                  {msg('vidaalYoga', locale)}
                </div>
                <div className="font-mono text-xl font-bold text-rose-300">
                  {panchang.vidaalYoga.start} — {panchang.vidaalYoga.end}{panchang.vidaalYoga.endDate ? `, ${panchang.vidaalYoga.endDate.split('-').slice(1).join('/')}` : ''}
                </div>
                <div className="text-text-secondary text-xs mt-2">
                  {msg('vidaalYogaDesc', locale)}
                </div>
              </motion.div>
            )}

            {/* Panchaka — pulsing purple warning */}
            {panchang.panchaka?.active && (
              <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.23 }}
                className="rounded-xl bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 p-3 sm:p-4 md:p-6 text-center border-2 border-purple-500/50 bg-gradient-to-br from-purple-500/10 to-transparent">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-purple-500 animate-pulse" />
                  <div className="text-purple-400 text-xs uppercase tracking-widest font-bold">
                    {msg('panchaka', locale)}
                  </div>
                  <span className="w-2.5 h-2.5 rounded-full bg-purple-500 animate-pulse" />
                </div>
                {panchang.panchaka.type && (
                  <div className="text-purple-300 font-bold text-base" style={headingFont}>
                    {tl(panchang.panchaka.type)}
                  </div>
                )}
                <div className="text-text-secondary text-xs mt-2">
                  {msg('panchakaDesc', locale)}
                </div>
              </motion.div>
            )}
          </div>

          <GoldDivider />
        </div>
      )}
    </div>
  );
}
