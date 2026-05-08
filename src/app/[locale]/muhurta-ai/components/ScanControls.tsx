'use client';

import { useLocale } from 'next-intl';
import { getAllExtendedActivities } from '@/lib/muhurta/activity-rules-extended';
import { tl } from '@/lib/utils/trilingual';
import type { ExtendedActivityId } from '@/types/muhurta-ai';
import { sl } from '../scanner-labels';

interface ScanControlsProps {
  activity: ExtendedActivityId;
  startDate: string;        // YYYY-MM-DD
  endDate: string;          // YYYY-MM-DD
  locationName: string;
  loading: boolean;
  onActivityChange: (id: ExtendedActivityId) => void;
  onStartDateChange: (date: string) => void;
  onEndDateChange: (date: string) => void;
  onScan: () => void;
  viewMode?: 'calendar' | 'heatmap';
  onViewModeChange?: (mode: 'calendar' | 'heatmap') => void;
}

const ACTIVITIES = getAllExtendedActivities();

export default function ScanControls({
  activity,
  startDate,
  endDate,
  locationName,
  loading,
  onActivityChange,
  onStartDateChange,
  onEndDateChange,
  onScan,
  viewMode = 'heatmap',
  onViewModeChange,
}: ScanControlsProps) {
  const locale = useLocale();

  return (
    <div className="bg-[#111633] border border-[#8a6d2b]/30 rounded-xl p-4 flex flex-wrap gap-3 items-end">
      {/* View toggle */}
      <div className="flex flex-col gap-1">
        <label className="text-[10px] uppercase tracking-wider text-[#8a8478]">{sl('view', locale) ?? 'View'}</label>
        <div className="flex gap-1 bg-[#0a0e27] rounded-xl p-1">
          <button
            type="button"
            onClick={() => onViewModeChange?.('calendar')}
            className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${
              viewMode === 'calendar'
                ? 'bg-gold-primary/20 text-gold-light'
                : 'text-text-secondary hover:text-text-primary'
            }`}
          >
            Calendar
          </button>
          <button
            type="button"
            onClick={() => onViewModeChange?.('heatmap')}
            className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${
              viewMode === 'heatmap'
                ? 'bg-gold-primary/20 text-gold-light'
                : 'text-text-secondary hover:text-text-primary'
            }`}
          >
            Heatmap
          </button>
        </div>
      </div>

      {/* Activity */}
      <div className="flex flex-col gap-1">
        <label className="text-[10px] uppercase tracking-wider text-[#8a8478]">{sl('activity', locale)}</label>
        <select
          value={activity}
          onChange={(e) => onActivityChange(e.target.value as ExtendedActivityId)}
          disabled={loading}
          className="bg-[#161b42] border border-[#d4a853]/20 text-[#e6e2d8] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#d4a853] focus:ring-2 focus:ring-[#d4a853]/15 disabled:opacity-50"
        >
          {ACTIVITIES.map((act) => (
            <option key={act.id} value={act.id}>
              {tl(act.label, locale)}
            </option>
          ))}
        </select>
      </div>

      {/* Start Date */}
      <div className="flex flex-col gap-1">
        <label className="text-[10px] uppercase tracking-wider text-[#8a8478]">{sl('from', locale)}</label>
        <input
          type="date"
          value={startDate}
          onChange={(e) => onStartDateChange(e.target.value)}
          disabled={loading}
          className="bg-[#161b42] border border-[#d4a853]/20 text-[#e6e2d8] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#d4a853] focus:ring-2 focus:ring-[#d4a853]/15 disabled:opacity-50"
        />
      </div>

      {/* End Date */}
      <div className="flex flex-col gap-1">
        <label className="text-[10px] uppercase tracking-wider text-[#8a8478]">{sl('to', locale)}</label>
        <input
          type="date"
          value={endDate}
          onChange={(e) => onEndDateChange(e.target.value)}
          disabled={loading}
          className="bg-[#161b42] border border-[#d4a853]/20 text-[#e6e2d8] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#d4a853] focus:ring-2 focus:ring-[#d4a853]/15 disabled:opacity-50"
        />
      </div>

      {/* Location (read-only) */}
      <div className="flex flex-col gap-1">
        <label className="text-[10px] uppercase tracking-wider text-[#8a8478]">{sl('location', locale)}</label>
        <div className="bg-[#161b42] border border-[#d4a853]/20 text-[#8a8478] rounded-lg px-3 py-2 text-sm min-w-[140px] truncate">
          {locationName || sl('noLocationSet', locale)}
        </div>
      </div>

      {/* Scan Button — prominent in heatmap mode, subtle refresh in calendar mode */}
      {viewMode === 'heatmap' ? (
        <button
          onClick={onScan}
          disabled={loading}
          className="ml-auto px-6 py-2.5 bg-gradient-to-br from-[#d4a853] to-[#8a6d2b] text-[#0a0e27] font-semibold rounded-lg text-sm hover:from-[#f0d48a] hover:to-[#d4a853] transition-all disabled:opacity-50"
        >
          {loading ? sl('scanning', locale) : sl('scanMonth', locale)}
        </button>
      ) : (
        <button
          onClick={onScan}
          disabled={loading}
          className="ml-auto px-4 py-2 border border-[#d4a853]/30 text-[#d4a853] rounded-lg text-sm hover:bg-[#d4a853]/10 transition-all disabled:opacity-50"
          title="Refresh results"
        >
          {loading ? sl('scanning', locale) : 'Refresh'}
        </button>
      )}
    </div>
  );
}
