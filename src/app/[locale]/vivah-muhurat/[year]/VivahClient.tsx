'use client';

/**
 * VivahClient — Client island for the Vivah Muhurat page.
 *
 * Scans the full year via /api/muhurta-scan on mount, using the user's
 * location from useLocationStore (falls back to Delhi if not set).
 * Displays month-by-month date cards with expand/collapse and share.
 */

import { useState, useEffect, useCallback, useMemo } from 'react';
import { useLocationStore } from '@/stores/location-store';
import { MapPin, Loader2, Share2, ChevronUp } from 'lucide-react';

// Default location for initial scan: Delhi, India
const DEFAULT_LAT = 28.6139;
const DEFAULT_LNG = 77.209;

interface VivahClientProps {
  year: number;
  locale: string;
}

interface DateResult {
  date: string;
  score: number;
  startTime: string;
  endTime: string;
  nakshatraName: string;
  tithiName: string;
  paksha: 'shukla' | 'krishna';
  lagnaSign?: string;
}

const MONTH_NAMES_EN = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const MONTH_NAMES_HI = ['जनवरी', 'फरवरी', 'मार्च', 'अप्रैल', 'मई', 'जून', 'जुलाई', 'अगस्त', 'सितम्बर', 'अक्टूबर', 'नवम्बर', 'दिसम्बर'];

function getMonthName(month: number, locale: string): string {
  const names = locale === 'hi' ? MONTH_NAMES_HI : MONTH_NAMES_EN;
  return names[month - 1] ?? '';
}

function gradeColor(score: number): string {
  if (score >= 72) return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30';
  if (score >= 58) return 'bg-green-500/15 text-green-300 border-green-500/25';
  return 'bg-amber-500/15 text-amber-300 border-amber-500/25';
}

function gradeLabel(score: number, locale: string): string {
  if (locale === 'hi') {
    if (score >= 72) return 'उत्तम';
    if (score >= 58) return 'शुभ';
    return 'ठीक';
  }
  if (score >= 72) return 'Excellent';
  if (score >= 58) return 'Good';
  return 'Fair';
}

const WEEKDAY_NAMES: Record<string, string[]> = {
  en: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
  hi: ['रविवार', 'सोमवार', 'मंगलवार', 'बुधवार', 'गुरुवार', 'शुक्रवार', 'शनिवार'],
};

function formatDate(dateStr: string, locale: string): string {
  const [y, m, d] = dateStr.split('-').map(Number);
  const dow = new Date(Date.UTC(y, m - 1, d)).getUTCDay();
  const names = WEEKDAY_NAMES[locale] ?? WEEKDAY_NAMES.en;
  const weekday = names[dow] ?? '';
  const month = getMonthName(m, locale);
  return `${weekday}, ${d} ${month} ${y}`;
}

export default function VivahClient({ year, locale }: VivahClientProps) {
  const { lat, lng, name: locationName, timezone, detect: detectLocation } = useLocationStore();
  const [results, setResults] = useState<DateResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedDate, setExpandedDate] = useState<string | null>(null);

  // Detect location on mount
  useEffect(() => {
    detectLocation();
  }, [detectLocation]);

  const scan = useCallback(async (scanLat: number, scanLng: number, scanTz?: string | null) => {
    setLoading(true);
    setError(null);

    try {
      const resp = await fetch('/api/muhurta-scan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          activity: 'marriage',
          startDate: `${year}-01-01`,
          endDate: `${year}-12-31`,
          lat: scanLat,
          lng: scanLng,
          timezone: scanTz ?? undefined,
          resolution: 'overview',
        }),
      });

      if (!resp.ok) {
        const errData = await resp.json().catch(() => null);
        throw new Error(errData?.error ?? `Scan failed (${resp.status})`);
      }

      const data = await resp.json();
      if (data.days && Array.isArray(data.days)) {
        const dates: DateResult[] = data.days
          .filter((d: { score: number }) => d.score >= 50)
          .map((d: {
            date: string;
            score: number;
            bestStart?: string;
            bestEnd?: string;
            nakshatra?: string;
            tithi?: string;
            paksha?: string;
            lagnaSign?: string;
          }) => ({
            date: d.date,
            score: d.score,
            startTime: d.bestStart ?? '09:00',
            endTime: d.bestEnd ?? '11:00',
            nakshatraName: d.nakshatra ?? '',
            tithiName: d.tithi ?? '',
            paksha: (d.paksha === 'krishna' ? 'krishna' : 'shukla') as 'shukla' | 'krishna',
            lagnaSign: d.lagnaSign,
          }));
        setResults(dates);
      }
    } catch (err) {
      console.error('[VivahClient] scan failed:', err);
      setError(err instanceof Error ? err.message : 'Failed to scan');
    } finally {
      setLoading(false);
    }
  }, [year]);

  // Scan on mount and when location changes
  useEffect(() => {
    const scanLat = lat ?? DEFAULT_LAT;
    const scanLng = lng ?? DEFAULT_LNG;
    scan(scanLat, scanLng, timezone);
  }, [lat, lng, timezone, scan]);

  // Group by month
  const monthGroups = useMemo(() => {
    const groups: Map<number, DateResult[]> = new Map();
    for (let m = 1; m <= 12; m++) groups.set(m, []);
    for (const r of results) {
      const m = parseInt(r.date.split('-')[1], 10);
      groups.get(m)?.push(r);
    }
    // Sort each month by date
    for (const dates of groups.values()) {
      dates.sort((a, b) => a.date.localeCompare(b.date));
    }
    return groups;
  }, [results]);

  const totalDates = results.length;
  const monthsWithDates = [...monthGroups.values()].filter((d) => d.length > 0).length;

  // Month quick-nav
  const scrollToMonth = (month: number) => {
    const el = document.getElementById(`month-${month}`);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  // Share handler
  const shareDate = async (dateStr: string, score: number) => {
    const text = locale === 'hi'
      ? `शुभ विवाह मुहूर्त: ${dateStr} (स्कोर: ${score}/100)`
      : `Auspicious Marriage Date: ${dateStr} (Score: ${score}/100)`;
    const url = `${window.location.origin}${window.location.pathname}#date-${dateStr}`;

    if (navigator.share) {
      try {
        await navigator.share({ title: text, url });
      } catch {
        // User cancelled share — not an error
      }
    } else {
      try {
        await navigator.clipboard.writeText(`${text}\n${url}`);
      } catch {
        // Clipboard API not available — not critical
      }
    }
  };

  return (
    <div>
      {/* Location bar + summary */}
      <div className="mb-6 flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2 rounded-xl border border-gold-primary/12 bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] px-4 py-2.5">
          <MapPin className="h-4 w-4 text-gold-primary" />
          <span className="text-sm text-text-primary">
            {locationName || (locale === 'hi' ? 'दिल्ली, भारत' : 'Delhi, India')}
          </span>
        </div>

        {loading && (
          <div className="flex items-center gap-2 text-sm text-text-secondary">
            <Loader2 className="h-4 w-4 animate-spin text-gold-primary" />
            {locale === 'hi' ? 'गणना हो रही है...' : 'Scanning...'}
          </div>
        )}

        {!loading && !error && (
          <p className="text-sm text-text-primary">
            <span className="text-lg font-bold text-gold-primary">{totalDates}</span>{' '}
            {locale === 'hi' ? 'शुभ तिथियाँ' : 'auspicious dates'}{' '}
            <span className="text-text-secondary">
              {locale === 'hi' ? `${monthsWithDates} महीनों में` : `across ${monthsWithDates} months`}
            </span>
          </p>
        )}

        {error && (
          <p className="text-sm text-red-400">{error}</p>
        )}
      </div>

      {/* Month quick-nav */}
      <div className="mb-6 flex flex-wrap gap-2">
        {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => {
          const count = monthGroups.get(m)?.length ?? 0;
          return (
            <button
              key={m}
              onClick={() => scrollToMonth(m)}
              className={`rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors ${
                count > 0
                  ? 'border-gold-primary/20 bg-gold-primary/10 text-gold-light hover:bg-gold-primary/20'
                  : 'border-gold-primary/8 bg-transparent text-text-secondary/50'
              }`}
            >
              {getMonthName(m, locale).slice(0, 3)}
              {count > 0 && <span className="ml-1 text-gold-primary">({count})</span>}
            </button>
          );
        })}
      </div>

      {/* Loading skeleton */}
      {loading && (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-24 animate-pulse rounded-2xl border border-gold-primary/8 bg-gradient-to-br from-[#2d1b69]/20 via-[#1a1040]/30 to-[#0a0e27]" />
          ))}
        </div>
      )}

      {/* Month-by-month sections */}
      {!loading && !error && Array.from({ length: 12 }, (_, i) => i + 1).map((m) => {
        const dates = monthGroups.get(m) ?? [];
        return (
          <div key={m} id={`month-${m}`} className="mb-10">
            <h2
              className="mb-4 text-xl font-bold text-gold-light md:text-2xl"
              style={{ fontFamily: locale === 'hi' ? 'var(--font-devanagari-heading)' : 'var(--font-heading)' }}
            >
              {getMonthName(m, locale)} {year}{' '}
              <span className="text-base font-normal text-text-secondary">
                &mdash; {dates.length} {locale === 'hi' ? 'शुभ तिथियाँ' : 'auspicious dates'}
              </span>
            </h2>

            {dates.length === 0 ? (
              <div className="rounded-2xl border border-gold-primary/8 bg-gradient-to-br from-[#2d1b69]/20 via-[#1a1040]/30 to-[#0a0e27] p-6 text-center text-text-secondary">
                {locale === 'hi' ? 'इस माह कोई शुभ विवाह तिथि नहीं' : 'No auspicious marriage dates this month'}
              </div>
            ) : (
              <div className="space-y-3">
                {dates.map((d) => {
                  const isExpanded = expandedDate === d.date;
                  return (
                    <div
                      key={d.date}
                      id={`date-${d.date}`}
                      className="rounded-2xl border border-gold-primary/12 bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] transition-colors hover:border-gold-primary/40"
                    >
                      <button
                        onClick={() => setExpandedDate(isExpanded ? null : d.date)}
                        className="flex w-full items-center justify-between p-5 text-left"
                      >
                        <div>
                          <p className="font-medium text-gold-light">{formatDate(d.date, locale)}</p>
                          <p className="mt-1 text-sm text-text-secondary">
                            {d.nakshatraName} &middot; {d.tithiName} &middot;{' '}
                            <span className="text-gold-primary">{d.startTime} &mdash; {d.endTime}</span>
                          </p>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className={`rounded-full border px-2.5 py-0.5 text-xs font-bold ${gradeColor(d.score)}`}>
                            {d.score} &middot; {gradeLabel(d.score, locale)}
                          </span>
                          <ChevronUp className={`h-4 w-4 text-text-secondary transition-transform ${isExpanded ? '' : 'rotate-180'}`} />
                        </div>
                      </button>

                      {isExpanded && (
                        <div className="border-t border-gold-primary/8 px-5 pb-5 pt-4">
                          <div className="grid gap-3 text-sm sm:grid-cols-2">
                            <div>
                              <span className="text-text-secondary">{locale === 'hi' ? 'नक्षत्र' : 'Nakshatra'}:</span>{' '}
                              <span className="text-text-primary">{d.nakshatraName}</span>
                            </div>
                            <div>
                              <span className="text-text-secondary">{locale === 'hi' ? 'तिथि' : 'Tithi'}:</span>{' '}
                              <span className="text-text-primary">
                                {d.tithiName} ({d.paksha === 'shukla' ? (locale === 'hi' ? 'शुक्ल' : 'Shukla') : (locale === 'hi' ? 'कृष्ण' : 'Krishna')})
                              </span>
                            </div>
                            {d.lagnaSign && (
                              <div>
                                <span className="text-text-secondary">{locale === 'hi' ? 'लग्न' : 'Lagna'}:</span>{' '}
                                <span className="text-text-primary">{d.lagnaSign}</span>
                              </div>
                            )}
                            <div>
                              <span className="text-text-secondary">{locale === 'hi' ? 'सर्वोत्तम समय' : 'Best window'}:</span>{' '}
                              <span className="font-medium text-gold-primary">{d.startTime} &mdash; {d.endTime}</span>
                            </div>
                          </div>

                          <button
                            onClick={() => shareDate(formatDate(d.date, 'en'), d.score)}
                            className="mt-4 inline-flex items-center gap-2 rounded-lg border border-gold-primary/20 bg-gold-primary/10 px-3 py-1.5 text-xs font-medium text-gold-light transition-colors hover:bg-gold-primary/20"
                          >
                            <Share2 className="h-3.5 w-3.5" />
                            {locale === 'hi' ? 'शेयर करें' : 'Share'}
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
