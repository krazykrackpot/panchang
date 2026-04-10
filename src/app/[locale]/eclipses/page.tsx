'use client';

import { useState, useEffect } from 'react';
import { useLocale } from 'next-intl';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, ChevronDown, MapPin, Clock, Shield, Eye, EyeOff, Sun, Moon, X } from 'lucide-react';
import GoldDivider from '@/components/ui/GoldDivider';
import InfoBlock from '@/components/ui/InfoBlock';
import LocationSearch from '@/components/ui/LocationSearch';
import { useLocationStore } from '@/stores/location-store';
import type { Locale } from '@/types/panchang';
import type { LocalEclipseResult } from '@/lib/calendar/eclipse-compute';

interface EclipseEvent {
  type: 'solar' | 'lunar';
  typeName: { en: string; hi: string; sa: string };
  date: string;
  magnitude: string;
  magnitudeName: { en: string; hi: string; sa: string };
  description: { en: string; hi: string; sa: string };
  local?: LocalEclipseResult;
}

export default function EclipsesPage() {
  const locale = useLocale() as Locale;
  const isHi = locale !== 'en';
  const headingFont = isHi ? { fontFamily: 'var(--font-devanagari-heading)' } : { fontFamily: 'var(--font-heading)' };
  const bodyFont = isHi ? { fontFamily: 'var(--font-devanagari-body)' } : undefined;

  const locationStore = useLocationStore();
  const [year, setYear] = useState(new Date().getFullYear());
  const [eclipses, setEclipses] = useState<EclipseEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [showLocationSearch, setShowLocationSearch] = useState(false);

  // Override location — when set, overrides the auto-detected location
  const [overrideLoc, setOverrideLoc] = useState<{ name: string; lat: number; lng: number; timezone: string } | null>(null);

  // Effective location: override > auto-detected
  const effectiveLat = overrideLoc?.lat ?? locationStore.lat;
  const effectiveLng = overrideLoc?.lng ?? locationStore.lng;
  const effectiveTz = overrideLoc?.timezone ?? locationStore.timezone;
  const effectiveName = overrideLoc?.name ?? locationStore.name;

  // Auto-detect location
  useEffect(() => {
    if (!locationStore.confirmed && !locationStore.detecting) {
      locationStore.detect();
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Fetch eclipses with location params
  useEffect(() => {
    setLoading(true);
    const params = new URLSearchParams({ year: String(year) });
    if (effectiveLat != null && effectiveLng != null && effectiveTz) {
      params.set('lat', String(effectiveLat));
      params.set('lng', String(effectiveLng));
      params.set('tz', effectiveTz);
    }
    fetch(`/api/eclipses?${params}`)
      .then(r => r.json())
      .then(data => {
        setEclipses(data.eclipses || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [year, effectiveLat, effectiveLng, effectiveTz]);

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr + 'T00:00:00');
    return d.toLocaleDateString(locale === 'en' ? 'en-IN' : 'hi-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
  };

  const toggleExpand = (key: string) => setExpanded(prev => prev === key ? null : key);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
        <h1 className="text-5xl sm:text-6xl font-bold mb-4" style={headingFont}>
          <span className="text-gold-gradient">
            {isHi ? 'ग्रहण पञ्चाङ्ग' : 'Eclipse Calendar'}
          </span>
        </h1>
        <p className="text-text-secondary text-lg max-w-2xl mx-auto" style={bodyFont}>
          {isHi
            ? 'सूर्य एवं चन्द्र ग्रहण — स्थानीय समय, सूतक काल और दृश्यता सहित'
            : 'Solar and Lunar eclipses with local timings, Sutak periods, and visibility'}
        </p>
        {/* Location selector */}
        <div className="mt-4 flex flex-col items-center gap-2">
          <div className="flex items-center gap-2">
            <MapPin className="w-3.5 h-3.5 text-gold-primary" />
            <span className="text-text-secondary text-sm">{effectiveName || (isHi ? 'स्थान का पता लगा रहे हैं...' : 'Detecting location...')}</span>
            {overrideLoc && (
              <button
                onClick={() => { setOverrideLoc(null); setShowLocationSearch(false); }}
                className="p-0.5 rounded-full hover:bg-gold-primary/10 text-text-secondary/50 hover:text-gold-light transition-colors"
                title={isHi ? 'अपना स्थान पुनः उपयोग करें' : 'Reset to my location'}
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
            <button
              onClick={() => setShowLocationSearch(!showLocationSearch)}
              className="text-gold-primary hover:text-gold-light text-xs border border-gold-primary/15 px-2 py-0.5 rounded hover:bg-gold-primary/10 transition-all"
            >
              {isHi ? 'बदलें' : 'Change'}
            </button>
          </div>
          {showLocationSearch && (
            <motion.div initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-sm">
              <LocationSearch
                value=""
                onSelect={(loc) => {
                  setOverrideLoc({ name: loc.name, lat: loc.lat, lng: loc.lng, timezone: loc.timezone });
                  setShowLocationSearch(false);
                }}
                placeholder={isHi ? 'शहर खोजें...' : 'Search any city...'}
              />
            </motion.div>
          )}
        </div>
      </motion.div>

      {/* Year selector */}
      <div className="flex items-center justify-center gap-6 mb-10">
        <button onClick={() => setYear(y => y - 1)} className="p-2 rounded-xl border border-gold-primary/20 hover:bg-gold-primary/10 transition-all">
          <ChevronLeft className="w-5 h-5 text-gold-primary" />
        </button>
        <span className="text-4xl font-bold text-gold-gradient" style={headingFont}>{year}</span>
        <button onClick={() => setYear(y => y + 1)} className="p-2 rounded-xl border border-gold-primary/20 hover:bg-gold-primary/10 transition-all">
          <ChevronRight className="w-5 h-5 text-gold-primary" />
        </button>
      </div>

      {/* InfoBlock */}
      <InfoBlock
        id="eclipse-grahan-kaal"
        title={isHi ? 'ग्रहण काल और सूतक क्या है? ग्रहण में क्या करें?' : 'What is Grahan Kaal & Sutak? What should you do during an eclipse?'}
        defaultOpen={false}
      >
        {!isHi ? (
          <div className="space-y-3">
            <p><strong>Grahan Kaal</strong> is the duration of the eclipse itself. During this period, the luminaries are considered weakened.</p>
            <p><strong>Sutak Period</strong> is the restriction period <em>before</em> the eclipse:</p>
            <ul className="list-disc ml-4 space-y-1 text-xs">
              <li><strong className="text-amber-300">Solar Eclipse</strong> — Sutak begins <strong>12 hours</strong> before first contact.</li>
              <li><strong className="text-indigo-300">Lunar Eclipse</strong> — Sutak begins <strong>9 hours</strong> before first contact.</li>
            </ul>
            <p><strong>Do:</strong> Chant mantras, meditate, bathe after eclipse, donate food/clothes.</p>
            <p><strong>Avoid:</strong> Eating during Sutak, new ventures, pregnant women avoid sharp objects, don&apos;t look directly at solar eclipses.</p>
            <p className="text-text-secondary/60 text-xs">Sutak applies only when the eclipse is visible from your location.</p>
          </div>
        ) : (
          <div className="space-y-3">
            <p><strong>ग्रहण काल</strong> ग्रहण की अवधि है। <strong>सूतक काल</strong> ग्रहण से पहले की प्रतिबन्ध अवधि:</p>
            <ul className="list-disc ml-4 space-y-1 text-xs">
              <li><strong className="text-amber-300">सूर्य ग्रहण</strong> — सूतक <strong>12 घंटे</strong> पहले।</li>
              <li><strong className="text-indigo-300">चन्द्र ग्रहण</strong> — सूतक <strong>9 घंटे</strong> पहले।</li>
            </ul>
            <p><strong>करें:</strong> मन्त्र जाप, ध्यान, स्नान, दान। <strong>न करें:</strong> भोजन, नए कार्य।</p>
            <p className="text-text-secondary/60 text-xs">सूतक केवल तभी लागू जब ग्रहण दृश्य हो।</p>
          </div>
        )}
      </InfoBlock>

      <GoldDivider />

      {/* Eclipse list */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-2 border-gold-primary border-t-transparent" />
        </div>
      ) : eclipses.length === 0 ? (
        <div className="text-center py-16 text-text-secondary">
          <div className="text-6xl mb-4 opacity-30">
            <svg viewBox="0 0 100 100" className="w-20 h-20 mx-auto">
              <circle cx="50" cy="50" r="40" fill="none" stroke="#d4a853" strokeWidth="2" strokeOpacity="0.3" />
              <circle cx="50" cy="50" r="38" fill="#0a0e27" />
              <circle cx="50" cy="50" r="40" fill="none" stroke="#d4a853" strokeWidth="1" strokeDasharray="4 4" />
            </svg>
          </div>
          <p className="text-lg" style={bodyFont}>
            {isHi ? 'इस वर्ष कोई ग्रहण नहीं।' : 'No eclipses this year.'}
          </p>
        </div>
      ) : (
        <div className="space-y-6 my-10">
          {eclipses.map((eclipse, i) => {
            const isSolar = eclipse.type === 'solar';
            const local = eclipse.local;
            const isVisible = local?.visible !== false;
            const key = `${eclipse.date}-${eclipse.type}`;
            const isExpanded = expanded === key;

            const accentColor = isSolar ? 'text-amber-400' : 'text-indigo-400';
            const borderAccent = isSolar ? 'border-amber-500/25' : 'border-indigo-500/25';
            const badgeBg = isSolar ? 'bg-amber-500/15 text-amber-300 border-amber-500/25' : 'bg-indigo-500/15 text-indigo-300 border-indigo-500/25';

            return (
              <motion.div
                key={key}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className={`bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] rounded-2xl border-2 ${borderAccent} overflow-hidden ${!isVisible ? 'opacity-60' : ''}`}
              >
                {/* Header row — always visible, clickable to expand */}
                <button
                  onClick={() => toggleExpand(key)}
                  className="w-full text-left p-6 sm:p-8 flex items-start gap-5 hover:bg-gold-primary/3 transition-colors"
                >
                  {/* Eclipse icon */}
                  <div className="flex-shrink-0">
                    <svg viewBox="0 0 64 64" className="w-16 h-16">
                      {isSolar ? (
                        <>
                          <circle cx="32" cy="32" r="24" fill="#f59e0b" opacity="0.15" />
                          <circle cx="32" cy="32" r="20" fill="#0a0e27" />
                          <circle cx="32" cy="32" r="24" fill="none" stroke="#f59e0b" strokeWidth="1.5" />
                          {Array.from({ length: 8 }).map((_, j) => {
                            const angle = (j * 45 * Math.PI) / 180;
                            return (
                              <line key={j} x1={32 + 26 * Math.cos(angle)} y1={32 + 26 * Math.sin(angle)}
                                x2={32 + 30 * Math.cos(angle)} y2={32 + 30 * Math.sin(angle)}
                                stroke="#f59e0b" strokeWidth="1.5" strokeOpacity="0.4" />
                            );
                          })}
                        </>
                      ) : (
                        <>
                          <circle cx="32" cy="32" r="22" fill="#818cf8" opacity="0.15" />
                          <circle cx="32" cy="32" r="22" fill="none" stroke="#818cf8" strokeWidth="1.5" />
                          <path d="M 32 10 A 22 22 0 0 1 32 54" fill="#0a0e27" />
                        </>
                      )}
                    </svg>
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 flex-wrap mb-1">
                      <h3 className={`text-xl sm:text-2xl font-bold ${accentColor}`} style={headingFont}>
                        {eclipse.typeName[locale]}
                      </h3>
                      <span className={`text-[10px] px-2.5 py-0.5 rounded-full font-bold border ${badgeBg}`}>
                        {eclipse.magnitudeName[locale]}
                      </span>
                      {/* Visibility badge */}
                      {local && (
                        isVisible ? (
                          <span className="text-[10px] px-2.5 py-0.5 rounded-full font-bold bg-emerald-500/15 text-emerald-300 border border-emerald-500/25 flex items-center gap-1">
                            <Eye className="w-3 h-3" /> {isHi ? 'दृश्य' : 'Visible'}
                          </span>
                        ) : (
                          <span className="text-[10px] px-2.5 py-0.5 rounded-full font-bold bg-red-500/10 text-red-400 border border-red-500/20 flex items-center gap-1">
                            <EyeOff className="w-3 h-3" /> {isHi ? 'अदृश्य' : 'Not Visible'}
                          </span>
                        )
                      )}
                    </div>
                    <div className="text-gold-light text-base font-mono mb-2">{formatDate(eclipse.date)}</div>

                    {/* Quick stats row */}
                    {local && isVisible && (
                      <div className="flex flex-wrap gap-x-5 gap-y-1 text-xs text-text-secondary/70">
                        {local.maximum && (
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3 text-gold-dark" />
                            {isHi ? 'अधिकतम' : 'Max'}: <span className="text-gold-light font-mono">{local.maximum}</span>
                          </span>
                        )}
                        {local.maxMagnitude > 0 && (
                          <span>
                            {isHi ? 'परिमाण' : 'Mag'}: <span className="text-gold-light font-mono">{local.maxMagnitude.toFixed(2)}</span>
                          </span>
                        )}
                        {local.durationFormatted && (
                          <span>
                            {isHi ? 'अवधि' : 'Duration'}: <span className="text-gold-light font-mono">{local.durationFormatted}</span>
                          </span>
                        )}
                      </div>
                    )}
                  </div>

                  <ChevronDown className={`w-5 h-5 text-text-secondary/40 shrink-0 mt-2 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                </button>

                {/* Expanded detail section */}
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="px-6 sm:px-8 pb-6 sm:pb-8 space-y-5 border-t border-gold-primary/10 pt-5">
                        {/* Description */}
                        <p className="text-text-secondary text-sm leading-relaxed" style={bodyFont}>
                          {eclipse.description[locale]}
                        </p>

                        {local && isVisible && (
                          <>
                            {/* ── Contact Times ── */}
                            <div className="rounded-xl bg-gradient-to-br from-[#2d1b69]/30 via-[#1a1040]/35 to-[#0a0e27] border border-gold-primary/10 p-5">
                              <div className="flex items-center gap-2 mb-4">
                                <Clock className={`w-4 h-4 ${accentColor}`} />
                                <h4 className="text-sm font-bold text-gold-light uppercase tracking-wider" style={headingFont}>
                                  {isHi ? 'ग्रहण समय (स्थानीय)' : 'Eclipse Timings (Local)'}
                                </h4>
                              </div>
                              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                                {local.eclipseStart && (
                                  <TimeCell label={isHi ? 'ग्रहण आरम्भ' : 'Eclipse Start'} time={local.eclipseStart} accent={accentColor} />
                                )}
                                {local.partialStart && local.partialStart !== local.eclipseStart && (
                                  <TimeCell label={isHi ? 'आंशिक आरम्भ' : 'Partial Start'} time={local.partialStart} accent={accentColor} />
                                )}
                                {local.maximum && (
                                  <TimeCell label={isHi ? 'अधिकतम ग्रहण' : 'Maximum Eclipse'} time={local.maximum} accent="text-gold-light" highlight />
                                )}
                                {local.partialEnd && (
                                  <TimeCell label={isHi ? 'आंशिक समाप्त' : 'Partial End'} time={local.partialEnd} accent={accentColor} />
                                )}
                                <TimeCell
                                  label={
                                    local.endsAtSunset
                                      ? (isHi ? 'सूर्यास्त पर समाप्त' : 'Ends at Sunset')
                                      : local.endsAtMoonset
                                      ? (isHi ? 'चन्द्रास्त पर समाप्त' : 'Ends at Moonset')
                                      : (isHi ? 'ग्रहण समाप्त' : 'Eclipse End')
                                  }
                                  time={local.eclipseEnd || '--:--'}
                                  accent={accentColor}
                                />
                              </div>

                              {/* Duration + Magnitude row */}
                              <div className="flex flex-wrap gap-4 mt-4 pt-4 border-t border-gold-primary/8">
                                {local.durationFormatted && (
                                  <div>
                                    <div className="text-[10px] text-text-secondary/50 uppercase tracking-wider">{isHi ? 'कुल अवधि' : 'Total Duration'}</div>
                                    <div className="text-sm text-gold-light font-mono font-bold">{local.durationFormatted}</div>
                                  </div>
                                )}
                                <div>
                                  <div className="text-[10px] text-text-secondary/50 uppercase tracking-wider">{isHi ? 'अधिकतम परिमाण' : 'Max Magnitude'}</div>
                                  <div className="text-sm text-gold-light font-mono font-bold">{local.maxMagnitude.toFixed(2)}</div>
                                </div>
                                {local.magnitudeAtSunset !== null && local.magnitudeAtSunset !== undefined && (
                                  <div>
                                    <div className="text-[10px] text-text-secondary/50 uppercase tracking-wider">{isHi ? 'सूर्यास्त पर परिमाण' : 'Magnitude at Sunset'}</div>
                                    <div className="text-sm text-gold-light font-mono font-bold">{local.magnitudeAtSunset.toFixed(2)}</div>
                                  </div>
                                )}
                                {local.sunrise && (
                                  <div>
                                    <div className="text-[10px] text-text-secondary/50 uppercase tracking-wider">{isHi ? 'सूर्योदय' : 'Sunrise'}</div>
                                    <div className="text-sm text-text-secondary font-mono">{local.sunrise}</div>
                                  </div>
                                )}
                                {local.sunset && (
                                  <div>
                                    <div className="text-[10px] text-text-secondary/50 uppercase tracking-wider">{isHi ? 'सूर्यास्त' : 'Sunset'}</div>
                                    <div className="text-sm text-text-secondary font-mono">{local.sunset}</div>
                                  </div>
                                )}
                              </div>
                            </div>

                            {/* ── Sutak Period ── */}
                            {local.sutakApplicable && (
                              <div className="rounded-xl bg-gradient-to-br from-[#2d1b69]/30 via-[#1a1040]/35 to-[#0a0e27] border border-amber-500/15 p-5">
                                <div className="flex items-center gap-2 mb-4">
                                  <Shield className="w-4 h-4 text-amber-400" />
                                  <h4 className="text-sm font-bold text-amber-300 uppercase tracking-wider" style={headingFont}>
                                    {isHi ? 'सूतक काल' : 'Sutak Period'}
                                  </h4>
                                </div>

                                {/* Recommended (most conservative) */}
                                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-5">
                                  {local.sutakStart && (
                                    <TimeCell label={isHi ? 'सूतक आरम्भ (अनुशंसित)' : 'Sutak Begins (Recommended)'} time={local.sutakStart} accent="text-amber-400" highlight />
                                  )}
                                  {local.sutakEnd && (
                                    <TimeCell label={isHi ? 'सूतक समाप्त' : 'Sutak Ends'} time={local.sutakEnd} accent="text-amber-400" />
                                  )}
                                  {local.sutakVulnerableStart && (
                                    <TimeCell
                                      label={isHi ? 'बच्चे/वृद्ध/रोगी' : 'Kids/Old/Sick'}
                                      time={local.sutakVulnerableStart}
                                      accent="text-amber-400/70"
                                      subtitle={isHi ? 'सूतक आरम्भ' : 'Sutak Begins'}
                                    />
                                  )}
                                </div>

                                {/* 3 Classical Traditions */}
                                <div className="border-t border-amber-500/10 pt-4">
                                  <p className="text-[10px] text-text-secondary/40 uppercase tracking-wider font-bold mb-3">
                                    {isHi ? 'शास्त्रीय ग्रन्थों के अनुसार सूतक' : 'Sutak per Classical Texts'}
                                  </p>
                                  <div className="space-y-2">
                                    {local.sutakTraditions.muhurtaChintamani && (
                                      <div className="flex items-center justify-between gap-3 px-3 py-2 rounded-lg bg-amber-500/5">
                                        <div className="min-w-0">
                                          <span className="text-xs text-amber-300 font-semibold">{isHi ? 'मुहूर्त चिन्तामणि' : 'Muhurta Chintamani'}</span>
                                          <span className="text-[10px] text-text-secondary/40 ml-2">{local.sutakTraditions.muhurtaChintamani.label}</span>
                                        </div>
                                        <span className="text-sm font-mono font-bold text-amber-400 shrink-0">{local.sutakTraditions.muhurtaChintamani.start}</span>
                                      </div>
                                    )}
                                    {local.sutakTraditions.dharmaSindhu && (
                                      <div className="flex items-center justify-between gap-3 px-3 py-2 rounded-lg bg-amber-500/5">
                                        <div className="min-w-0">
                                          <span className="text-xs text-amber-300 font-semibold">{isHi ? 'धर्मसिन्धु' : 'Dharmasindhu'}</span>
                                          <span className="text-[10px] text-text-secondary/40 ml-2">{local.sutakTraditions.dharmaSindhu.label}</span>
                                        </div>
                                        <span className="text-sm font-mono font-bold text-amber-400 shrink-0">{local.sutakTraditions.dharmaSindhu.start}</span>
                                      </div>
                                    )}
                                    {local.sutakTraditions.nirnyaSindhu && (
                                      <div className="flex items-center justify-between gap-3 px-3 py-2 rounded-lg bg-amber-500/5">
                                        <div className="min-w-0">
                                          <span className="text-xs text-amber-300 font-semibold">{isHi ? 'निर्णय सिन्धु' : 'Nirnaya Sindhu'}</span>
                                          <span className="text-[10px] text-text-secondary/40 ml-2">{local.sutakTraditions.nirnyaSindhu.label}</span>
                                        </div>
                                        <span className="text-sm font-mono font-bold text-amber-400 shrink-0">{local.sutakTraditions.nirnyaSindhu.start}</span>
                                      </div>
                                    )}
                                  </div>
                                  <p className="text-[10px] text-text-secondary/30 mt-2 italic">
                                    {isHi
                                      ? 'अनुशंसित समय सबसे रूढ़िवादी (सबसे पहले) ग्रन्थ पर आधारित है।'
                                      : 'Recommended time is based on the most conservative (earliest) tradition.'}
                                  </p>
                                </div>
                              </div>
                            )}

                            {/* Visibility note */}
                            {local.visibilityNote && (
                              <div className="flex items-center gap-2 text-xs text-text-secondary/60">
                                {isSolar ? <Sun className="w-3.5 h-3.5 text-amber-400/50" /> : <Moon className="w-3.5 h-3.5 text-indigo-400/50" />}
                                <span style={bodyFont}>{local.visibilityNote}</span>
                                {local.saros > 0 && <span className="ml-auto text-text-secondary/30 font-mono">Saros {local.saros}</span>}
                              </div>
                            )}
                          </>
                        )}

                        {/* Not visible message */}
                        {local && !isVisible && (
                          <div className="text-center py-4">
                            <EyeOff className="w-8 h-8 text-text-secondary/20 mx-auto mb-2" />
                            <p className="text-text-secondary/50 text-sm" style={bodyFont}>
                              {isHi
                                ? 'यह ग्रहण आपके स्थान से दृश्य नहीं है। सूतक लागू नहीं।'
                                : 'This eclipse is not visible from your location. Sutak does not apply.'}
                            </p>
                          </div>
                        )}

                        {/* No location */}
                        {!local && (
                          <div className="text-center py-4 text-text-secondary/50 text-sm">
                            <MapPin className="w-5 h-5 mx-auto mb-2 opacity-30" />
                            <p style={bodyFont}>
                              {isHi ? 'स्थानीय समय के लिए स्थान की अनुमति दें।' : 'Allow location access for local timings.'}
                            </p>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
          <div className="text-center text-text-secondary/50 text-sm mt-6">
            {eclipses.length} {isHi ? 'ग्रहण इस वर्ष' : `eclipse${eclipses.length !== 1 ? 's' : ''} this year`}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Sub-components ──────────────────────────────────────────────────────────

function TimeCell({
  label,
  time,
  accent,
  highlight = false,
  subtitle,
}: {
  label: string;
  time: string;
  accent: string;
  highlight?: boolean;
  subtitle?: string;
}) {
  return (
    <div className={`${highlight ? 'bg-gold-primary/5 border border-gold-primary/15 rounded-lg p-2.5' : ''}`}>
      <div className="text-[10px] text-text-secondary/50 uppercase tracking-wider leading-tight">{label}</div>
      {subtitle && <div className="text-[9px] text-text-secondary/30">{subtitle}</div>}
      <div className={`text-lg font-mono font-bold ${highlight ? 'text-gold-light' : accent}`}>{time}</div>
    </div>
  );
}
