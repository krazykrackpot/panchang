'use client';

import { useState, useEffect, useMemo } from 'react';
import { useLocale } from 'next-intl';
import { motion } from 'framer-motion';
import { Link } from '@/lib/i18n/navigation';
import { Eye, Calendar, ChevronRight } from 'lucide-react';
import { useLocationStore } from '@/stores/location-store';
import type { Locale } from '@/types/panchang';
import type { LocalEclipseResult } from '@/lib/calendar/eclipse-compute';

interface EclipseEvent {
  type: 'solar' | 'lunar';
  typeName: { en: string; hi: string; sa: string };
  date: string;
  magnitude: string;
  node?: 'rahu' | 'ketu';
  nodeName?: { en: string; hi: string; sa: string };
  local?: LocalEclipseResult;
}

/**
 * Shows a personalized eclipse alert on the dashboard when an eclipse
 * visible from the user's location is coming up within the next 6 months.
 */
export default function EclipseAlert() {
  const locale = useLocale() as Locale;
  const isHi = locale !== 'en' && String(locale) !== 'ta';
  const headingFont = isHi ? { fontFamily: 'var(--font-devanagari-heading)' } : { fontFamily: 'var(--font-heading)' };
  const bodyFont = isHi ? { fontFamily: 'var(--font-devanagari-body)' } : undefined;

  const locationStore = useLocationStore();
  const [nextEclipse, setNextEclipse] = useState<EclipseEvent | null>(null);
  const [daysUntil, setDaysUntil] = useState<number>(0);

  useEffect(() => {
    if (locationStore.lat == null || locationStore.lng == null || !locationStore.timezone) return;

    const now = new Date();
    const currentYear = now.getFullYear();

    // Check current year and next year
    const fetchYear = async (year: number): Promise<EclipseEvent | null> => {
      try {
        const params = new URLSearchParams({
          year: String(year),
          lat: String(locationStore.lat),
          lng: String(locationStore.lng),
          tz: locationStore.timezone!,
        });
        const res = await fetch(`/api/eclipses?${params}`);
        const data = await res.json();
        const eclipses: EclipseEvent[] = data.eclipses || [];

        // Find next visible eclipse after today
        const today = now.toISOString().slice(0, 10);
        return eclipses.find(e =>
          e.date > today &&
          e.local?.visible &&
          (e.local?.maxMagnitude ?? 0) > 0.2 // Skip barely-visible ones
        ) || null;
      } catch { return null; }
    };

    (async () => {
      let found = await fetchYear(currentYear);
      if (!found) found = await fetchYear(currentYear + 1);
      if (found) {
        const eclDate = new Date(found.date + 'T00:00:00');
        const diffDays = Math.ceil((eclDate.getTime() - now.getTime()) / 86400000);
        if (diffDays <= 180) { // Only show if within 6 months
          setNextEclipse(found);
          setDaysUntil(diffDays);
        }
      }
    })();
  }, [locationStore.lat, locationStore.lng, locationStore.timezone]);

  if (!nextEclipse) return null;

  const isSolar = nextEclipse.type === 'solar';
  const local = nextEclipse.local;
  const borderColor = isSolar ? 'border-amber-500/25' : 'border-indigo-500/25';
  const accentColor = isSolar ? 'text-amber-400' : 'text-indigo-400';
  const bgGlow = isSolar ? 'from-amber-500/5 to-transparent' : 'from-indigo-500/5 to-transparent';

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr + 'T00:00:00');
    return d.toLocaleDateString(isHi ? 'hi-IN' : 'en-IN', { weekday: 'short', day: 'numeric', month: 'long', year: 'numeric' });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
      <Link href="/eclipses" className="block group">
        <div className={`rounded-2xl bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border-2 ${borderColor} p-5 sm:p-6 bg-gradient-to-r ${bgGlow} hover:border-gold-primary/40 transition-all`}>
          <div className="flex items-start gap-4">
            {/* Icon */}
            <div className="shrink-0 mt-1">
              <svg viewBox="0 0 40 40" className="w-10 h-10">
                {isSolar ? (
                  <>
                    <circle cx="20" cy="20" r="16" fill="#f59e0b" opacity="0.15" />
                    <circle cx="20" cy="20" r="12" fill="#0a0e27" />
                    <circle cx="20" cy="20" r="16" fill="none" stroke="#f59e0b" strokeWidth="1.5" />
                  </>
                ) : (
                  <>
                    <circle cx="20" cy="20" r="14" fill="#818cf8" opacity="0.15" />
                    <circle cx="20" cy="20" r="14" fill="none" stroke="#818cf8" strokeWidth="1.5" />
                    <path d="M 20 6 A 14 14 0 0 1 20 34" fill="#0a0e27" />
                  </>
                )}
              </svg>
            </div>

            <div className="flex-1 min-w-0">
              {/* Title */}
              <div className="flex items-center gap-2 flex-wrap mb-1">
                <h3 className={`text-sm font-bold ${accentColor}`} style={headingFont}>
                  {isHi ? '🔮 आगामी ग्रहण' : '🔮 Upcoming Eclipse'}
                </h3>
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold border ${
                  isSolar ? 'bg-amber-500/10 text-amber-300 border-amber-500/20' : 'bg-indigo-500/10 text-indigo-300 border-indigo-500/20'
                }`}>
                  {nextEclipse.typeName[locale]}
                </span>
                {nextEclipse.node && (
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold border ${
                    nextEclipse.node === 'rahu' ? 'bg-gold-primary/10 text-gold-light border-gold-primary/20' : 'bg-purple-500/10 text-purple-300 border-purple-500/20'
                  }`}>
                    {nextEclipse.node === 'rahu' ? '☊' : '☋'} {nextEclipse.nodeName?.[locale]}
                  </span>
                )}
              </div>

              {/* Date + countdown */}
              <div className="flex items-center gap-3 mb-2">
                <span className="text-gold-light text-sm font-mono">{formatDate(nextEclipse.date)}</span>
                <span className={`text-xs px-2 py-0.5 rounded-full font-bold ${
                  daysUntil <= 30 ? 'bg-red-500/15 text-red-300 border border-red-500/20' :
                  daysUntil <= 90 ? 'bg-amber-500/10 text-amber-300 border border-amber-500/20' :
                  'bg-blue-500/10 text-blue-300 border border-blue-500/20'
                }`}>
                  {daysUntil === 0 ? (isHi ? 'आज!' : 'Today!') :
                   daysUntil === 1 ? (isHi ? 'कल!' : 'Tomorrow!') :
                   isHi ? `${daysUntil} दिन शेष` : `${daysUntil} days away`}
                </span>
              </div>

              {/* Quick stats */}
              {local && (
                <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-text-secondary/70" style={bodyFont}>
                  {local.eclipseStart && (
                    <span><Eye className="w-3 h-3 inline mr-1 text-emerald-400" />{isHi ? 'आरम्भ' : 'Start'}: <span className="text-gold-light font-mono">{local.eclipseStart}</span></span>
                  )}
                  {local.maximum && (
                    <span>{isHi ? 'अधिकतम' : 'Max'}: <span className="text-gold-light font-mono">{local.maximum}</span></span>
                  )}
                  {local.maxMagnitude > 0 && (
                    <span>{isHi ? 'परिमाण' : 'Mag'}: <span className="text-gold-light font-mono">{local.maxMagnitude.toFixed(2)}</span></span>
                  )}
                </div>
              )}
            </div>

            {/* CTA arrow */}
            <div className="shrink-0 flex items-center">
              <ChevronRight className="w-5 h-5 text-text-secondary/30 group-hover:text-gold-light group-hover:translate-x-1 transition-all" />
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
