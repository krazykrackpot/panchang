'use client';

import { useState, useCallback } from 'react';
import { useLocale } from 'next-intl';
import { MapPin, Search, Loader2, Calendar } from 'lucide-react';
import { useLocationStore } from '@/stores/location-store';
import { lt } from '@/lib/learn/translations';
import type { LocaleText } from '@/types/panchang';
import MSG from '@/messages/pages/caesarean-muhurta.json';

const msg = (key: string, locale: string) =>
  lt((MSG as unknown as Record<string, LocaleText>)[key], locale);

export interface ScanFormData {
  startDate: string;
  endDate: string;
  lat: number;
  lng: number;
  timezone: string;
  opStart: number;
  opEnd: number;
}

interface ScanFormProps {
  loading: boolean;
  onScan: (data: ScanFormData) => void;
}

/** Build hour options for a select dropdown */
function hourOptions(from: number, to: number): { value: number; label: string }[] {
  const opts: { value: number; label: string }[] = [];
  for (let h = from; h <= to; h++) {
    const ampm = h < 12 ? 'AM' : 'PM';
    const display = h === 0 ? 12 : h > 12 ? h - 12 : h;
    opts.push({ value: h, label: `${display}:00 ${ampm}` });
  }
  return opts;
}

const START_HOURS = hourOptions(6, 12);
const END_HOURS = hourOptions(12, 20);

export default function ScanForm({ loading, onScan }: ScanFormProps) {
  const locale = useLocale();
  const { lat, lng, name: locationName, timezone } = useLocationStore();

  // Default: tomorrow to 7 days from now
  const tomorrow = new Date(Date.now() + 86400000);
  const weekLater = new Date(Date.now() + 7 * 86400000);
  const fmt = (d: Date) => d.toISOString().slice(0, 10);

  const [startDate, setStartDate] = useState(fmt(tomorrow));
  const [endDate, setEndDate] = useState(fmt(weekLater));
  const [opStart, setOpStart] = useState(8);
  const [opEnd, setOpEnd] = useState(17);

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (!lat || !lng) return;
      onScan({
        startDate,
        endDate,
        lat,
        lng,
        timezone: timezone || Intl.DateTimeFormat().resolvedOptions().timeZone,
        opStart,
        opEnd,
      });
    },
    [startDate, endDate, lat, lng, timezone, opStart, opEnd, onScan],
  );

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-2xl p-5 sm:p-6 space-y-5"
    >
      {/* Date range */}
      <div className="grid sm:grid-cols-2 gap-4">
        <label className="block space-y-1.5">
          <span className="text-text-secondary text-xs font-medium flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5" />
            {msg('formStartDate', locale)}
          </span>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            required
            className="w-full bg-[#0a0e27]/80 border border-gold-primary/20 rounded-lg px-3 py-2 text-text-primary text-sm focus:outline-none focus:border-gold-primary/50 transition-colors"
          />
        </label>
        <label className="block space-y-1.5">
          <span className="text-text-secondary text-xs font-medium flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5" />
            {msg('formEndDate', locale)}
          </span>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            required
            className="w-full bg-[#0a0e27]/80 border border-gold-primary/20 rounded-lg px-3 py-2 text-text-primary text-sm focus:outline-none focus:border-gold-primary/50 transition-colors"
          />
        </label>
      </div>

      {/* Location */}
      <div className="space-y-1.5">
        <span className="text-text-secondary text-xs font-medium flex items-center gap-1.5">
          <MapPin className="w-3.5 h-3.5" />
          {msg('formLocation', locale)}
        </span>
        <div className="bg-[#0a0e27]/80 border border-gold-primary/20 rounded-lg px-3 py-2 text-text-primary text-sm">
          {locationName || 'Detecting location...'}
          {lat && lng && (
            <span className="text-text-secondary text-[10px] ml-2">
              ({lat.toFixed(2)}, {lng.toFixed(2)})
            </span>
          )}
        </div>
      </div>

      {/* Operating hours */}
      <div className="grid sm:grid-cols-2 gap-4">
        <label className="block space-y-1.5">
          <span className="text-text-secondary text-xs font-medium">
            {msg('formOpStart', locale)}
          </span>
          <select
            value={opStart}
            onChange={(e) => setOpStart(Number(e.target.value))}
            className="w-full bg-[#0a0e27]/80 border border-gold-primary/20 rounded-lg px-3 py-2 text-text-primary text-sm focus:outline-none focus:border-gold-primary/50 transition-colors"
          >
            {START_HOURS.map((h) => (
              <option key={h.value} value={h.value}>
                {h.label}
              </option>
            ))}
          </select>
        </label>
        <label className="block space-y-1.5">
          <span className="text-text-secondary text-xs font-medium">
            {msg('formOpEnd', locale)}
          </span>
          <select
            value={opEnd}
            onChange={(e) => setOpEnd(Number(e.target.value))}
            className="w-full bg-[#0a0e27]/80 border border-gold-primary/20 rounded-lg px-3 py-2 text-text-primary text-sm focus:outline-none focus:border-gold-primary/50 transition-colors"
          >
            {END_HOURS.map((h) => (
              <option key={h.value} value={h.value}>
                {h.label}
              </option>
            ))}
          </select>
        </label>
      </div>

      {/* Scan button */}
      <button
        type="submit"
        disabled={loading || !lat || !lng}
        className="w-full flex items-center justify-center gap-2 py-3 px-6 rounded-xl font-semibold text-sm
          bg-gradient-to-r from-[#d4a853] to-[#f0d48a] text-[#0a0e27]
          hover:from-[#f0d48a] hover:to-[#d4a853] transition-all
          disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            {msg('formScanning', locale)}
          </>
        ) : (
          <>
            <Search className="w-4 h-4" />
            {msg('formScan', locale)}
          </>
        )}
      </button>
    </form>
  );
}
