'use client';

import { useState, useEffect, useCallback } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { Link } from '@/lib/i18n/navigation';
import { ArrowLeft, MapPin, Loader2, Compass } from 'lucide-react';
import LocationSearch from '@/components/ui/LocationSearch';
import GoldDivider from '@/components/ui/GoldDivider';
import LearnLink from '@/components/ui/LearnLink';
import { MuhurtaIcon } from '@/components/icons/PanchangIcons';
import type { PanchangData, Locale, LocaleText } from '@/types/panchang';
import { GRAHAS } from '@/lib/constants/grahas';
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

export default function AuspiciousTimingsPage() {
  const t = useTranslations('panchang');
  const locale = useLocale() as Locale;
  const isDevanagari = isDevanagariLocale(locale);
  const tl = (obj: unknown): string => _tl(obj as Record<string, string>, locale);
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
            setLocation({ lat: latitude, lng: longitude, name, tz: -new Date().getTimezoneOffset() / 60 });
          } catch {
            setLocation({ lat: latitude, lng: longitude, name: `${latitude.toFixed(2)}N, ${longitude.toFixed(2)}E`, tz: -new Date().getTimezoneOffset() / 60 });
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
            console.error('[auspicious] IP geolocation fallback failed:', err);
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
        console.error('[auspicious] panchang fetch failed:', err);
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
          <span className="text-gold-gradient">{msg('auspiciousTimings', locale)}</span>
        </h1>
        <p className="text-text-secondary text-base max-w-xl mx-auto">{msg('auspiciousTimingsDesc', locale)}</p>
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
            icon={<MuhurtaIcon size={56} />}
            title={msg('auspiciousTimings', locale)}
            subtitle={msg('auspiciousTimingsDesc', locale)}
            accentClass="text-emerald-400"
          />
          <div className="text-center -mt-4 mb-6">
            <LearnLink href="/learn/muhurtas" label={isDevanagari ? 'मुहूर्त के बारे में जानें' : 'Learn about Muhurtas'} />
          </div>

          {/* Sarvartha Siddhi full-width banner */}
          {panchang.sarvarthaSiddhi && (
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="mb-6">
              <div className="rounded-2xl bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 p-3 sm:p-4 md:p-6 border-2 border-gold-primary/40 bg-gradient-to-r from-gold-primary/10 via-emerald-500/5 to-gold-primary/10 text-center">
                <div className="flex items-center justify-center gap-3 mb-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-gold-primary animate-pulse" />
                  <div className="text-gold-primary text-xs uppercase tracking-[0.3em] font-bold">{t('sarvarthaSiddhi')}</div>
                  <span className="w-2.5 h-2.5 rounded-full bg-gold-primary animate-pulse" />
                </div>
                <div className="text-gold-light text-xl font-bold" style={headingFont}>{t('sarvarthaSiddhiActive')}</div>
                <div className="text-text-secondary text-sm mt-2">{t('sarvarthaSiddhiDesc')}</div>
              </div>
            </motion.div>
          )}

          {/* Ravi Yoga badge with time window */}
          {panchang.raviYogaWindow?.active && (
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="mb-6 flex justify-center">
              <div className="flex items-center gap-2 px-5 py-2.5 rounded-full border border-amber-400/40 bg-amber-500/10">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                <span className="text-amber-300 text-sm font-bold uppercase tracking-wider">
                  {msg('raviYoga', locale)}
                </span>
                <span className="text-amber-400/70 text-xs font-mono">
                  {panchang.raviYogaWindow.start} — {panchang.raviYogaWindow.end}{panchang.raviYogaWindow.endDate ? `, ${panchang.raviYogaWindow.endDate.split('-').slice(1).join('/')}` : ''}
                </span>
                <span className="text-amber-400/70 text-xs">{'· ' + msg('highlyAuspicious', locale)}</span>
              </div>
            </motion.div>
          )}

          {/* Amrit Siddhi Yoga banner */}
          {panchang.amritSiddhiYoga && (
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
              <div className="rounded-2xl border-2 border-emerald-500/40 bg-gradient-to-r from-emerald-500/10 via-gold-primary/5 to-emerald-500/10 p-4 text-center">
                <div className="flex items-center justify-center gap-2 mb-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-emerald-400 text-xs uppercase tracking-[0.3em] font-bold">
                    {msg('amritSiddhiYoga', locale)}
                  </span>
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                </div>
                <div className="text-emerald-300 text-base font-bold">
                  {msg('supremelyAuspiciousDay', locale)}
                </div>
                <div className="text-text-secondary text-xs mt-1">
                  {msg('amritSiddhiDesc', locale)}
                </div>
              </div>
            </motion.div>
          )}

          {/* Dagdha Tithi warning */}
          {panchang.dagdhaTithi && (
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="mb-6 flex justify-center">
              <div className="flex items-center gap-2 px-5 py-2.5 rounded-full border border-rose-500/40 bg-rose-500/10">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                <span className="text-rose-400 text-sm font-bold uppercase tracking-wider">
                  {msg('dagdhaTithi', locale)}
                </span>
                <span className="text-rose-400/70 text-xs">
                  {'· ' + msg('avoidNewBeginnings', locale)}
                </span>
              </div>
            </motion.div>
          )}

          {/* Auspicious timings grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {/* Brahma Muhurta */}
            {panchang.brahmaMuhurta && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}
                className="rounded-xl bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 p-5 text-center">
                <div className="text-indigo-400 text-xs uppercase tracking-wider font-bold mb-2">{t('brahmaMuhurta')}</div>
                <div className="font-mono text-xl font-bold text-amber-300">{panchang.brahmaMuhurta.start} — {panchang.brahmaMuhurta.end}</div>
                <div className="text-text-secondary text-xs mt-2 leading-relaxed">{t('brahmaMuhurtaDesc')}</div>
              </motion.div>
            )}

            {/* Abhijit Muhurta — not auspicious on Wednesdays (available=false) */}
            {panchang.abhijitMuhurta.available !== false ? (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 }}
                className="rounded-xl bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 p-5 text-center border-2 border-gold-primary/40 bg-gradient-to-br from-gold-primary/10 to-transparent">
                <div className="text-gold-primary text-xs uppercase tracking-wider font-bold mb-2">
                  {msg('abhijitMuhurta', locale)}
                </div>
                <div className="font-mono text-xl font-bold text-amber-300">{panchang.abhijitMuhurta.start} — {panchang.abhijitMuhurta.end}</div>
                <div className="text-text-secondary text-xs mt-2 leading-relaxed">
                  {msg('mostAuspiciousVictory', locale)}
                </div>
              </motion.div>
            ) : (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 }}
                className="rounded-xl bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 p-5 text-center border border-amber-500/30 bg-gradient-to-br from-amber-500/5 to-transparent">
                <div className="text-amber-400 text-xs uppercase tracking-wider font-bold mb-2">
                  {msg('abhijitMuhurta', locale)}
                </div>
                <div className="font-mono text-xl font-bold text-amber-400/60">{panchang.abhijitMuhurta.start} — {panchang.abhijitMuhurta.end}</div>
                <div className="text-amber-400/70 text-xs mt-2 leading-relaxed">
                  {tl({ en: 'Not auspicious today (Wednesday)', hi: 'आज शुभ नहीं (बुधवार)', ta: 'இன்று சுபமில்லை (புதன்கிழமை)', bn: 'আজ শুভ নয় (বুধবার)' })}
                </div>
              </motion.div>
            )}

            {/* Vijaya Muhurta */}
            {panchang.vijayaMuhurta && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.11 }}
                className="rounded-xl bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 p-5 text-center border border-amber-400/30 bg-gradient-to-br from-amber-500/5 to-transparent">
                <div className="text-amber-400 text-xs uppercase tracking-wider font-bold mb-2">
                  {msg('vijayaMuhurta', locale)}
                </div>
                <div className="font-mono text-xl font-bold text-amber-300">{panchang.vijayaMuhurta.start} — {panchang.vijayaMuhurta.end}</div>
                <div className="text-text-secondary text-xs mt-2 leading-relaxed">
                  {msg('tenthMuhurtaVictory', locale)}
                </div>
              </motion.div>
            )}

            {/* Amrit Kalam — show all windows */}
            {((panchang as any).amritKalamAll as Array<{ start: string; end: string }> | undefined)?.length || panchang.amritKalam ? (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.14 }}
                className="rounded-xl p-5 text-center border border-emerald-500/30 bg-gradient-to-br from-emerald-500/5 to-transparent">
                <div className="text-emerald-400 text-xs uppercase tracking-wider font-bold mb-2">{t('amritKalam')}</div>
                {((panchang as any).amritKalamAll as Array<{ start: string; end: string }> || [panchang.amritKalam]).map((a: { start: string; end: string }, i: number) => (
                  <div key={i} className="font-mono text-xl font-bold text-amber-300">{a.start} — {a.end}</div>
                ))}
                <div className="text-text-secondary text-xs mt-2 leading-relaxed">{t('amritKalamDesc')}</div>
              </motion.div>
            ) : null}

            {/* Godhuli Muhurta */}
            {panchang.godhuli && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.17 }}
                className="rounded-xl bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 p-5 text-center border border-amber-600/30 bg-gradient-to-br from-amber-600/5 to-transparent">
                <div className="text-amber-500 text-xs uppercase tracking-wider font-bold mb-2">{t('godhuli')}</div>
                <div className="font-mono text-xl font-bold text-amber-300">{panchang.godhuli.start} — {panchang.godhuli.end}</div>
                <div className="text-text-secondary text-xs mt-2 leading-relaxed">{t('godhuliDesc')}</div>
              </motion.div>
            )}

            {/* Morning Sandhya */}
            {panchang.sandhyaKaal && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.20 }}
                className="rounded-xl bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 p-5 text-center border border-orange-400/30 bg-gradient-to-br from-orange-500/5 to-transparent">
                <div className="text-orange-400 text-xs uppercase tracking-wider font-bold mb-2">
                  {msg('morningSandhya', locale)}
                </div>
                <div className="font-mono text-xl font-bold text-orange-300">{panchang.sandhyaKaal.morning.start} — {panchang.sandhyaKaal.morning.end}</div>
                <div className="text-text-secondary text-xs mt-2 leading-relaxed">
                  {msg('morningSandhyaDesc', locale)}
                </div>
              </motion.div>
            )}

            {/* Evening Sandhya */}
            {panchang.sandhyaKaal && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.23 }}
                className="rounded-xl bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 p-5 text-center border border-purple-400/30 bg-gradient-to-br from-purple-500/5 to-transparent">
                <div className="text-purple-400 text-xs uppercase tracking-wider font-bold mb-2">
                  {msg('eveningSandhya', locale)}
                </div>
                <div className="font-mono text-xl font-bold text-purple-300">{panchang.sandhyaKaal.evening.start} — {panchang.sandhyaKaal.evening.end}</div>
                <div className="text-text-secondary text-xs mt-2 leading-relaxed">
                  {msg('eveningSandhyaDesc', locale)}
                </div>
              </motion.div>
            )}

            {/* Nishita Kaal */}
            {panchang.nishitaKaal && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.26 }}
                className="rounded-xl bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 p-5 text-center">
                <div className="text-blue-400 text-xs uppercase tracking-wider font-bold mb-2">{t('nishitaKaal')}</div>
                <div className="font-mono text-xl font-bold text-blue-300">{panchang.nishitaKaal.start} — {panchang.nishitaKaal.end}</div>
                <div className="text-text-secondary text-xs mt-2 leading-relaxed">{t('nishitaKaalDesc')}</div>
              </motion.div>
            )}

            {/* Anandadi Yoga */}
            {panchang.anandadiYoga && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.29 }}
                className={`rounded-xl bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 p-5 text-center border ${
                  panchang.anandadiYoga.nature === 'auspicious'
                    ? 'border-emerald-500/30 bg-gradient-to-br from-emerald-500/5 to-transparent'
                    : 'border-orange-500/30 bg-gradient-to-br from-orange-500/5 to-transparent'
                }`}>
                <div className={`text-xs uppercase tracking-wider font-bold mb-2 ${panchang.anandadiYoga.nature === 'auspicious' ? 'text-emerald-400' : 'text-orange-400'}`}>
                  {msg('anandadiYoga', locale)}
                </div>
                <div className={`font-bold text-lg ${panchang.anandadiYoga.nature === 'auspicious' ? 'text-emerald-300' : 'text-orange-300'}`}
                  style={headingFont}>
                  {tl(panchang.anandadiYoga.name)}
                </div>
                <div className="text-text-secondary text-xs mt-2 leading-relaxed">
                  {panchang.anandadiYoga.nature === 'auspicious'
                    ? msg('auspiciousYogaEnergy', locale)
                    : msg('mixedEnergyCaution', locale)}
                </div>
              </motion.div>
            )}

            {/* Tamil Yoga */}
            {panchang.tamilYoga && (
              <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.35 }}
                className={`rounded-xl bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 p-5 border ${panchang.tamilYoga.nature === 'auspicious' ? 'border-emerald-500/20' : 'border-red-500/20'}`}>
                <div className={`text-xs uppercase tracking-wider font-bold mb-2 ${panchang.tamilYoga.nature === 'auspicious' ? 'text-emerald-400' : 'text-red-400'}`}>
                  {msg('tamilYoga', locale)}
                </div>
                <div className={`font-bold text-lg ${panchang.tamilYoga.nature === 'auspicious' ? 'text-emerald-300' : 'text-red-300'}`} style={headingFont}>
                  {tl(panchang.tamilYoga.name)}
                </div>
                <div className="text-text-secondary text-xs mt-2">
                  {panchang.tamilYoga.nature === 'auspicious'
                    ? msg('auspiciousGoodForImportant', locale)
                    : msg('inauspiciousAvoidNewVentures', locale)}
                </div>
              </motion.div>
            )}

            {/* Homahuti */}
            {panchang.homahuti && (
              <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.4 }}
                className="rounded-xl bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 p-5 border border-orange-500/20">
                <div className="text-orange-400 text-xs uppercase tracking-wider font-bold mb-2">
                  {msg('homahutiDirection', locale)}
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 rounded-full bg-orange-500/10 border border-orange-500/20 flex items-center justify-center">
                    <Compass className="w-5 h-5 text-orange-400" />
                  </div>
                  <div>
                    <div className="text-gold-light font-bold text-lg" style={headingFont}>{tl(panchang.homahuti.direction)}</div>
                    <div className="text-text-secondary text-xs">{msg('faceDirectionHoma', locale)}</div>
                  </div>
                </div>
                <div className="text-text-tertiary text-xs mt-2">
                  {`${msg('presidingDeity', locale)} ${_tl(panchang.homahuti.deity, locale)}`}
                </div>
              </motion.div>
            )}

            {/* Mantri Mandala + Hora Table */}
            {panchang.mantriMandala && (
              <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.45 }}
                className="rounded-xl bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 p-5">
                <div className="text-gold-dark text-xs uppercase tracking-wider font-bold mb-3">
                  {msg('mantriMandalaHora', locale)}
                </div>
                <div className="space-y-2 mb-3">
                  <div className="flex items-center justify-between">
                    <span className="text-text-secondary text-xs">{msg('dayLordKing', locale)}</span>
                    <span className="text-gold-light font-bold text-sm">{(GRAHAS[panchang.mantriMandala.king.planet]?.name[locale] || GRAHAS[panchang.mantriMandala.king.planet]?.name.en || '')}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-text-secondary text-xs">{msg('middayHoraLord', locale)}</span>
                    <span className="text-gold-light font-bold text-sm">{(GRAHAS[panchang.mantriMandala.minister.planet]?.name[locale] || GRAHAS[panchang.mantriMandala.minister.planet]?.name.en || '')}</span>
                  </div>
                </div>
                <div className="text-text-tertiary text-xs mb-3">
                  {msg('dayLordRules', locale)}
                </div>
                {/* Hora timetable with conflict detection */}
                {panchang.mantriMandala.horas && (() => {
                  const now = new Date();
                  const toM = (t: string) => { const [hh, mm] = t.split(':').map(Number); return hh * 60 + mm; };
                  const nm = now.getHours() * 60 + now.getMinutes();
                  const ov = (aS: string, aE: string, bS: string, bE: string) => toM(aS) < toM(bE) && toM(bS) < toM(aE);
                  const beneficIds = new Set([1, 3, 4, 5]);
                  const badW: { start: string; end: string; label: string; labelHi: string }[] = [];
                  if (panchang.varjyam) badW.push({ ...panchang.varjyam, label: 'Varjyam', labelHi: 'वर्ज्यम्' });
                  if ((panchang as any).varjyamAll) {
                    const varjAll = (panchang as any).varjyamAll as Array<{ start: string; end: string }>;
                    for (let vi = 1; vi < varjAll.length; vi++) badW.push({ ...varjAll[vi], label: 'Varjyam', labelHi: 'वर्ज्यम्' });
                  }
                  badW.push({ start: panchang.rahuKaal.start, end: panchang.rahuKaal.end, label: 'Rahu Kaal', labelHi: 'राहु काल' });
                  badW.push({ start: panchang.yamaganda.start, end: panchang.yamaganda.end, label: 'Yamaganda', labelHi: 'यमगण्ड' });

                  const renderHora = (h: { planet: number; start: string; end: string }, i: number) => {
                    const hNow = nm >= toM(h.start) && nm < toM(h.end);
                    const isBenefic = beneficIds.has(h.planet);
                    const conflicts = isBenefic ? badW.filter(w => ov(h.start, h.end, w.start, w.end)) : [];
                    const hasConflict = conflicts.length > 0;
                    return (
                      <div key={i} className={`flex flex-col py-0.5 border-b border-gold-primary/5 ${hNow ? 'bg-gold-primary/10 rounded px-1 -mx-1 font-bold' : ''}`}>
                        <div className="flex justify-between">
                          <span className={hNow ? 'text-gold-light' : 'text-text-secondary'}>{h.start}–{h.end}{hNow ? ' ◂' : ''}</span>
                          <span className={`font-semibold ${hasConflict ? 'text-amber-400' : hNow ? 'text-gold-primary' : 'text-gold-light'}`}>
                            {(GRAHAS[h.planet]?.name[locale] || GRAHAS[h.planet]?.name.en || '')}
                            {hasConflict && ' ⚠'}
                          </span>
                        </div>
                        {hasConflict && (
                          <span className="text-amber-400/80 text-[9px] leading-tight">
                            {isDevanagariLocale(locale) ? conflicts.map(c => c.labelHi).join(', ') : conflicts.map(c => c.label).join(', ')}
                          </span>
                        )}
                      </div>
                    );
                  };

                  return (
                  <details className="group">
                    <summary className="text-gold-primary/70 text-xs cursor-pointer hover:text-gold-light transition-colors">
                      {'▸ ' + msg('viewAll24Horas', locale)}
                    </summary>
                    <div className="mt-2 grid grid-cols-2 gap-x-4 gap-y-0.5 text-xs">
                      <div>
                        <div className="text-gold-dark font-bold text-[10px] uppercase tracking-wider mb-1">{msg('dayHoras', locale)}</div>
                        {panchang.mantriMandala!.horas.filter((h: { isDay: boolean }) => h.isDay).map((h: { planet: number; start: string; end: string }, i: number) => renderHora(h, i))}
                      </div>
                      <div>
                        <div className="text-gold-dark font-bold text-[10px] uppercase tracking-wider mb-1">{msg('nightHoras', locale)}</div>
                        {panchang.mantriMandala!.horas.filter((h: { isDay: boolean }) => !h.isDay).map((h: { planet: number; start: string; end: string }, i: number) => renderHora(h, i))}
                      </div>
                    </div>
                  </details>
                  );
                })()}
              </motion.div>
            )}
          </div>

          <GoldDivider />

          {/* ═══════════════════════════════════════════════════
              INAUSPICIOUS TIMINGS (combined on same page)
          ═══════════════════════════════════════════════════ */}
          <div className="mt-12">
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
                className="rounded-xl bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-red-500/30 p-3 sm:p-4 md:p-6 text-center">
                <div className="text-red-400 text-xs uppercase tracking-widest mb-2 font-bold">{t('rahuKaal')}</div>
                <div className="font-mono text-2xl font-bold text-red-300">{panchang.rahuKaal.start} — {panchang.rahuKaal.end}</div>
                <div className="text-text-secondary text-xs mt-2">{msg('rahuKaalDesc', locale)}</div>
              </motion.div>

              {/* Yamaganda */}
              <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.08 }}
                className="rounded-xl bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-orange-500/30 p-3 sm:p-4 md:p-6 text-center">
                <div className="text-orange-400 text-xs uppercase tracking-widest mb-2 font-bold">{t('yamaganda')}</div>
                <div className="font-mono text-2xl font-bold text-orange-300">{panchang.yamaganda.start} — {panchang.yamaganda.end}</div>
                <div className="text-text-secondary text-xs mt-2">{msg('yamagandaDesc', locale)}</div>
              </motion.div>

              {/* Gulika Kaal */}
              <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.11 }}
                className="rounded-xl bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-yellow-500/30 p-3 sm:p-4 md:p-6 text-center">
                <div className="text-yellow-400 text-xs uppercase tracking-widest mb-2 font-bold">{t('gulikaKaal')}</div>
                <div className="font-mono text-2xl font-bold text-yellow-300">{panchang.gulikaKaal.start} — {panchang.gulikaKaal.end}</div>
                <div className="text-text-secondary text-xs mt-2">{msg('gulikaKaalDesc', locale)}</div>
              </motion.div>

              {/* Dur Muhurtam */}
              {panchang.durMuhurtam && panchang.durMuhurtam.length > 0 && (
                <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.14 }}
                  className="rounded-xl border border-red-600/30 bg-gradient-to-br from-red-600/5 to-transparent p-3 sm:p-4 md:p-6 text-center">
                  <div className="text-red-500 text-xs uppercase tracking-widest mb-2 font-bold">{msg('durMuhurtam', locale)}</div>
                  <div className="text-text-secondary/50 text-[10px] mb-2">{msg('kaalaPrakashika', locale)}</div>
                  {panchang.durMuhurtam.map((w: { start: string; end: string }, i: number) => (
                    <div key={i} className="font-mono text-lg font-bold text-red-400 leading-tight">{w.start} — {w.end}</div>
                  ))}
                  {panchang.durMuhurtamAlt && panchang.durMuhurtamAlt.length > 0 && (
                    <details className="mt-3">
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

              {/* Visha Ghatika */}
              {panchang.vishaGhatika && (
                <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.15 }}
                  className="rounded-xl bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-red-700/30 p-3 sm:p-4 md:p-6 text-center">
                  <div className="text-red-500 text-xs uppercase tracking-widest mb-2 font-bold">{msg('vishaGhatika', locale)}</div>
                  <div className="font-mono text-lg font-bold text-red-400">{panchang.vishaGhatika.start} — {panchang.vishaGhatika.end}</div>
                  <div className="text-text-secondary text-xs mt-2">{msg('vishaGhatikaDesc', locale)}</div>
                </motion.div>
              )}

              {/* Varjyam */}
              {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
              {((panchang as any).varjyamAll?.length || panchang.varjyam) && (
                <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.17 }}
                  className="rounded-xl bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-red-400/25 p-3 sm:p-4 md:p-6 text-center">
                  <div className="text-red-400 text-xs uppercase tracking-widest mb-2 font-bold">{t('varjyam')}</div>
                  {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                  {((panchang as any).varjyamAll || [panchang.varjyam]).map((v: { start: string; end: string }, i: number) => (
                    <div key={i} className="font-mono text-xl font-bold text-red-300">{v.start} — {v.end}</div>
                  ))}
                  <div className="text-text-secondary text-xs mt-2">{t('varjyamDesc')}</div>
                </motion.div>
              )}

              {/* Bhadra (Vishti) */}
              {panchang.bhadra && (
                <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.18 }}
                  className="rounded-xl border border-orange-500/30 bg-gradient-to-br from-orange-500/8 to-transparent p-3 sm:p-4 md:p-6 text-center">
                  <div className="text-orange-400 text-xs uppercase tracking-widest mb-2 font-bold">{msg('bhadraVishti', locale)}</div>
                  {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                  {((panchang as any).bhadraAll || [panchang.bhadra]).map((b: { start: string; end: string; endDate?: string }, i: number) => (
                    <div key={i} className="font-mono text-xl font-bold text-orange-300">
                      {b.start} — {b.end}{b.endDate ? `, ${b.endDate.split('-').reverse().join('/')}` : ''}
                    </div>
                  ))}
                  <div className="text-text-secondary text-xs mt-2">{msg('inauspiciousKarana', locale)}</div>
                </motion.div>
              )}

              {/* Ganda Moola */}
              {panchang.gandaMoola?.active && (
                <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.20 }}
                  className="rounded-xl p-3 sm:p-4 md:p-6 text-center border-2 border-red-500/50 bg-gradient-to-br from-red-500/10 to-transparent">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse" />
                    <div className="text-red-400 text-xs uppercase tracking-widest font-bold">{msg('gandaMoola', locale)}</div>
                    <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse" />
                  </div>
                  {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                  {(panchang.gandaMoola as any).start && (
                    <div className="font-mono text-lg font-bold text-red-300 mt-1">
                      {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                      {(panchang.gandaMoola as any).start} — {(panchang.gandaMoola as any).end}
                    </div>
                  )}
                  <div className="text-text-secondary text-xs mt-2">{msg('inauspiciousNakshatraJunction', locale)}</div>
                </motion.div>
              )}

              {/* Aadal Yoga */}
              {panchang.aadalYoga && (
                <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.21 }}
                  className="rounded-xl border border-amber-500/25 bg-gradient-to-br from-amber-500/5 to-transparent p-3 sm:p-4 md:p-6 text-center">
                  <div className="text-amber-400 text-xs uppercase tracking-widest mb-2 font-bold">{msg('aadalYoga', locale)}</div>
                  <div className="font-mono text-xl font-bold text-amber-300">
                    {panchang.aadalYoga.start} — {panchang.aadalYoga.end}
                  </div>
                  <div className="text-text-secondary text-xs mt-2">{msg('aadalYogaDesc', locale)}</div>
                </motion.div>
              )}

              {/* Vidaal Yoga */}
              {panchang.vidaalYoga && (
                <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.22 }}
                  className="rounded-xl border border-rose-500/25 bg-gradient-to-br from-rose-500/5 to-transparent p-3 sm:p-4 md:p-6 text-center">
                  <div className="text-rose-400 text-xs uppercase tracking-widest mb-2 font-bold">{msg('vidaalYoga', locale)}</div>
                  <div className="font-mono text-xl font-bold text-rose-300">
                    {panchang.vidaalYoga.start} — {panchang.vidaalYoga.end}
                  </div>
                  <div className="text-text-secondary text-xs mt-2">{msg('vidaalYogaDesc', locale)}</div>
                </motion.div>
              )}

              {/* Panchaka */}
              {panchang.panchaka?.active && (
                <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.23 }}
                  className="rounded-xl p-3 sm:p-4 md:p-6 text-center border-2 border-purple-500/50 bg-gradient-to-br from-purple-500/10 to-transparent">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-purple-500 animate-pulse" />
                    <div className="text-purple-400 text-xs uppercase tracking-widest font-bold">{msg('panchaka', locale)}</div>
                    <span className="w-2.5 h-2.5 rounded-full bg-purple-500 animate-pulse" />
                  </div>
                  {panchang.panchaka.type && (
                    <div className="text-purple-300 font-bold text-base" style={headingFont}>
                      {tl(panchang.panchaka.type)}
                    </div>
                  )}
                  <div className="text-text-secondary text-xs mt-2">{msg('panchakaDesc', locale)}</div>
                </motion.div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
