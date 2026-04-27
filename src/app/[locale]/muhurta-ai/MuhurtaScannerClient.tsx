'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import { toPng } from 'html-to-image';
import { Share2, Loader2 } from 'lucide-react';
import { useLocale } from 'next-intl';
import { useLocationStore } from '@/stores/location-store';
import { useBirthDataStore } from '@/stores/birth-data-store';
import { getExtendedActivity } from '@/lib/muhurta/activity-rules-extended';
import { tl } from '@/lib/utils/trilingual';
import type { ExtendedActivityId, HeatmapCell, DetailWindow } from '@/types/muhurta-ai';
import { sl } from './scanner-labels';
import ScanControls from './components/ScanControls';
import QuickPersonalize from './components/QuickPersonalize';
import DashaBanner from './components/DashaBanner';
import MonthHeatmap from './components/MonthHeatmap';
import MobileMonthView from './components/MobileMonthView';
import DayDrilldown from './components/DayDrilldown';
import PeakCards from './components/PeakCards';
import ScoreBreakdown from './components/ScoreBreakdown';

function formatDisplayDate(dateStr: string): string {
  const [y, m, d] = dateStr.split('-').map(Number);
  const date = new Date(Date.UTC(y, m - 1, d));
  return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', timeZone: 'UTC' });
}

function getMonthBounds(year: number, month: number): { start: string; end: string } {
  const lastDay = new Date(Date.UTC(year, month, 0)).getUTCDate();
  const mm = String(month).padStart(2, '0');
  return {
    start: `${year}-${mm}-01`,
    end: `${year}-${mm}-${String(lastDay).padStart(2, '0')}`,
  };
}

export default function MuhurtaScannerClient() {
  const locale = useLocale();
  const { lat, lng, name: locationName, timezone, detect: detectLocation } = useLocationStore();
  const { birthNakshatra: storeBirthNak, birthRashi: storeBirthRashi, isSet: hasBirthData, loadFromStorage: loadBirthData } = useBirthDataStore();

  // Load stores on mount
  useEffect(() => {
    detectLocation();
    loadBirthData();
  }, [detectLocation, loadBirthData]);

  // Current month for defaults
  const now = new Date();
  const initYear = now.getFullYear();
  const initMonth = now.getMonth() + 1; // 1-12
  const initBounds = getMonthBounds(initYear, initMonth);

  // --- State ---
  const [activity, setActivity] = useState<ExtendedActivityId>('property');
  const [startDate, setStartDate] = useState(initBounds.start);
  const [endDate, setEndDate] = useState(initBounds.end);

  // Personalization
  const [birthNakshatra, setBirthNakshatra] = useState<number | null>(null);
  const [birthRashi, setBirthRashi] = useState<number | null>(null);
  const [dashaLords, setDashaLords] = useState<{ maha: number; antar: number; pratyantar: number } | null>(null);
  const [antarEndDate, setAntarEndDate] = useState<string | null>(null);
  const [chartName, setChartName] = useState<string | null>(null);

  // Sync store birth data into local state
  useEffect(() => {
    if (hasBirthData) {
      setBirthNakshatra(storeBirthNak || null);
      setBirthRashi(storeBirthRashi || null);
    }
  }, [hasBirthData, storeBirthNak, storeBirthRashi]);

  // Share
  const peaksRef = useRef<HTMLDivElement>(null);
  const [sharing, setSharing] = useState(false);
  const activityLabel = tl(getExtendedActivity(activity).label, locale);

  const handleShareResults = useCallback(async () => {
    if (!peaksRef.current) return;
    setSharing(true);
    try {
      const dataUrl = await toPng(peaksRef.current, { pixelRatio: 2, backgroundColor: '#0a0e27' });
      const res = await fetch(dataUrl);
      const blob = await res.blob();
      if (typeof navigator !== 'undefined' && navigator.share) {
        const file = new File([blob], 'muhurta-results.png', { type: 'image/png' });
        const shareLabel = tl(getExtendedActivity(activity).label, locale);
        const shareData: ShareData = { title: 'Best Muhurta Windows', text: `Top auspicious times for ${shareLabel}` };
        if (navigator.canShare?.({ files: [file] })) shareData.files = [file];
        await navigator.share(shareData);
      } else {
        const link = document.createElement('a');
        link.href = dataUrl;
        link.download = `muhurta-${activity}-${new Date().toISOString().slice(0, 10)}.png`;
        link.click();
      }
    } catch (err) {
      if ((err as Error).name !== 'AbortError') console.error('[muhurta-scanner] Share failed:', err);
    } finally {
      setSharing(false);
    }
  }, [activity, locale]);

  // Results
  const [overviewCells, setOverviewCells] = useState<HeatmapCell[]>([]);
  const [detailWindows, setDetailWindows] = useState<DetailWindow[]>([]);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedWindow, setSelectedWindow] = useState<DetailWindow | null>(null);
  const [peaks, setPeaks] = useState<DetailWindow[]>([]);

  // Loading & error
  const [overviewLoading, setOverviewLoading] = useState(false);
  const [detailLoading, setDetailLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Derived
  const todayStr = new Date().toISOString().slice(0, 10);
  const [viewYear, viewMonth] = startDate.split('-').map(Number);

  // --- Handlers ---

  const handleDaySelect = useCallback(async (date: string) => {
    if (!lat || !lng) return;
    setSelectedDate(date);
    setSelectedWindow(null);
    setDetailLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/muhurta-scan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          activity,
          startDate: date,
          endDate: date,
          lat,
          lng,
          timezone: timezone || Intl.DateTimeFormat().resolvedOptions().timeZone,
          resolution: 'detail',
          detailDate: date,
          ...(birthNakshatra ? { birthNakshatra } : {}),
          ...(birthRashi ? { birthRashi } : {}),
          ...(dashaLords ? { dashaLords } : {}),
        }),
      });

      if (!res.ok) {
        const errBody = await res.json().catch(() => ({ error: `HTTP ${res.status}` }));
        throw new Error(errBody.error || `Request failed (${res.status})`);
      }

      const data = await res.json();
      setDetailWindows(data.windows || []);
    } catch (err) {
      console.error('[muhurta-scanner] Detail scan failed:', err);
      setError(err instanceof Error ? err.message : sl('scanFailed', locale));
    } finally {
      setDetailLoading(false);
    }
  }, [activity, lat, lng, timezone, birthNakshatra, birthRashi, dashaLords]);

  const handleScan = useCallback(async () => {
    if (!lat || !lng) {
      setError('Location not available. Please allow location access or wait for detection.');
      return;
    }

    setOverviewLoading(true);
    setError(null);
    setOverviewCells([]);
    setPeaks([]);
    setSelectedDate(null);
    setSelectedWindow(null);
    setDetailWindows([]);

    try {
      // Pass 1: Overview scan
      const res = await fetch('/api/muhurta-scan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          activity,
          startDate,
          endDate,
          lat,
          lng,
          timezone: timezone || Intl.DateTimeFormat().resolvedOptions().timeZone,
          resolution: 'overview',
          ...(birthNakshatra ? { birthNakshatra } : {}),
          ...(birthRashi ? { birthRashi } : {}),
          ...(dashaLords ? { dashaLords } : {}),
        }),
      });

      if (!res.ok) {
        const errBody = await res.json().catch(() => ({ error: `HTTP ${res.status}` }));
        throw new Error(errBody.error || `Request failed (${res.status})`);
      }

      const overviewData = await res.json();
      const cells: HeatmapCell[] = overviewData.windows || [];
      setOverviewCells(cells);

      // Find top 3 unique dates by max cell score
      const dateScores = new Map<string, number>();
      for (const cell of cells) {
        const existing = dateScores.get(cell.date) ?? 0;
        if (cell.score > existing) dateScores.set(cell.date, cell.score);
      }
      const topDates = [...dateScores.entries()]
        .sort((a, b) => b[1] - a[1])
        .slice(0, 3)
        .map(([date]) => date);

      // Auto-trigger detail scans for top 3 days
      const peakResults: DetailWindow[] = [];
      await Promise.all(
        topDates.map(async (date) => {
          try {
            const detailRes = await fetch('/api/muhurta-scan', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                activity,
                startDate: date,
                endDate: date,
                lat,
                lng,
                timezone: timezone || Intl.DateTimeFormat().resolvedOptions().timeZone,
                resolution: 'detail',
                detailDate: date,
                ...(birthNakshatra ? { birthNakshatra } : {}),
                ...(birthRashi ? { birthRashi } : {}),
                ...(dashaLords ? { dashaLords } : {}),
              }),
            });

            if (!detailRes.ok) return;
            const detailData = await detailRes.json();
            const windows: DetailWindow[] = detailData.windows || [];
            // Pick highest-scoring window for this day
            if (windows.length > 0) {
              const best = windows.reduce((a, b) => (b.score > a.score ? b : a));
              peakResults.push(best);
            }
          } catch (peakErr) {
            console.error(`[muhurta-scanner] Peak detail scan failed for ${date}:`, peakErr);
          }
        }),
      );

      // Sort peaks by score descending
      peakResults.sort((a, b) => b.score - a.score);
      setPeaks(peakResults);
    } catch (err) {
      console.error('[muhurta-scanner] Overview scan failed:', err);
      setError(err instanceof Error ? err.message : sl('scanFailed', locale));
    } finally {
      setOverviewLoading(false);
    }
  }, [activity, startDate, endDate, lat, lng, timezone, birthNakshatra, birthRashi, dashaLords]);

  const handleWindowSelect = useCallback((window: DetailWindow) => {
    setSelectedWindow(window);
  }, []);

  const handleMonthChange = useCallback((year: number, month: number) => {
    const bounds = getMonthBounds(year, month);
    setStartDate(bounds.start);
    setEndDate(bounds.end);
  }, []);

  return (
    <div className="mx-auto max-w-6xl px-4 pt-8 pb-20">
      {/* Page header */}
      <div className="text-center mb-8">
        <h1 className="font-[Cinzel] text-3xl font-semibold text-[#f0d48a] mb-1.5">
          {sl('scannerTitle', locale)}
        </h1>
        <p className="text-[#8a8478] text-sm">
          {sl('scannerSubtitle', locale)}
        </p>
      </div>

      <ScanControls
        activity={activity}
        startDate={startDate}
        endDate={endDate}
        locationName={locationName || 'Detecting...'}
        loading={overviewLoading}
        onActivityChange={setActivity}
        onStartDateChange={setStartDate}
        onEndDateChange={setEndDate}
        onScan={handleScan}
      />

      {/* Personalization: QuickPersonalize OR DashaBanner */}
      {dashaLords ? (
        <DashaBanner
          dashaLords={dashaLords}
          antarEndDate={antarEndDate}
          activityId={activity}
          chartName={chartName}
        />
      ) : (
        <QuickPersonalize
          birthNakshatra={birthNakshatra}
          birthRashi={birthRashi}
          onNakshatraChange={setBirthNakshatra}
          onRashiChange={setBirthRashi}
        />
      )}

      {/* Error banner */}
      {error && (
        <div className="bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3 text-red-400 text-sm mt-4">
          {error}
        </div>
      )}

      {/* Pass 1: Monthly Overview (only after scan) */}
      {(overviewCells.length > 0 || overviewLoading) && (
        <>
          <div className="mt-6 mb-3">
            <h2 className="font-[Cinzel] text-base text-[#f0d48a] flex items-center gap-2">
              {sl('monthlyOverview', locale)}
              <span className="font-sans text-[10px] bg-[#d4a853]/15 text-[#d4a853] px-2 py-0.5 rounded uppercase tracking-wider">
                {sl('pass1Label', locale)}
              </span>
            </h2>
          </div>
          {/* Desktop heatmap (hidden on mobile) */}
          <div className="hidden lg:block">
            <MonthHeatmap
              cells={overviewCells}
              selectedDate={selectedDate}
              today={todayStr}
              year={viewYear}
              month={viewMonth}
              loading={overviewLoading}
              onCellClick={handleDaySelect}
              onMonthChange={handleMonthChange}
            />
          </div>
          {/* Mobile month view (hidden on desktop) */}
          <div className="lg:hidden">
            <MobileMonthView
              cells={overviewCells}
              selectedDate={selectedDate}
              today={todayStr}
              loading={overviewLoading}
              onDaySelect={handleDaySelect}
            />
          </div>
        </>
      )}

      {/* Peak Cards (only after scan) */}
      {peaks.length > 0 && (
        <>
          <div className="mt-6 mb-3">
            <h2 className="font-[Cinzel] text-base text-[#f0d48a]">
              {sl('bestWindowsFor', locale)} &ldquo;{activityLabel}&rdquo;
            </h2>
          </div>
          <div ref={peaksRef}>
            <PeakCards peaks={peaks} onCardClick={(w) => handleDaySelect(w.date)} />
          </div>
          <div className="flex justify-center mt-4">
            <button
              onClick={handleShareResults}
              disabled={sharing}
              className="flex items-center gap-2 px-4 py-2 rounded-full bg-[#d4a853]/15 border border-[#d4a853]/30 text-[#f0d48a] text-xs font-medium hover:bg-[#d4a853]/25 transition-all disabled:opacity-50"
            >
              {sharing ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Share2 className="w-3.5 h-3.5" />}
              {sharing ? 'Generating...' : 'Share Results'}
            </button>
          </div>
        </>
      )}

      {/* Pass 2: Day Drill-down (only when a date is selected) */}
      {selectedDate && (
        <>
          <div className="mt-6 mb-3">
            <h2 className="font-[Cinzel] text-base text-[#f0d48a] flex items-center gap-2">
              {sl('dayDetail', locale)} — {formatDisplayDate(selectedDate)}
              <span className="font-sans text-[10px] bg-[#d4a853]/15 text-[#d4a853] px-2 py-0.5 rounded uppercase tracking-wider">
                {sl('pass2Label', locale)}
              </span>
            </h2>
          </div>
          <DayDrilldown
            windows={detailWindows}
            date={selectedDate}
            loading={detailLoading}
            isToday={selectedDate === todayStr}
            onWindowSelect={handleWindowSelect}
          />
        </>
      )}

      {/* Score Breakdown (only when a specific window is selected) */}
      {selectedWindow && (
        <>
          <div className="mt-6 mb-3">
            <h2 className="font-[Cinzel] text-base text-[#f0d48a]">
              {sl('scoreBreakdown', locale)} — {selectedWindow.date}, {selectedWindow.startTime}
            </h2>
          </div>
          <ScoreBreakdown
            breakdown={selectedWindow.breakdown}
            totalScore={selectedWindow.score}
          />
        </>
      )}
    </div>
  );
}
