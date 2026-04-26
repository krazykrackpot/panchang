'use client';

import { useLocale } from 'next-intl';
import { getAllExtendedActivities } from '@/lib/muhurta/activity-rules-extended';
import { tl } from '@/lib/utils/trilingual';
import type { ExtendedActivityId } from '@/types/muhurta-ai';

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
}: ScanControlsProps) {
  const locale = useLocale();

  return (
    <div className="bg-[#111633] border border-[#8a6d2b]/30 rounded-xl p-4 flex flex-wrap gap-3 items-end">
      {/* Activity */}
      <div className="flex flex-col gap-1">
        <label className="text-[10px] uppercase tracking-wider text-[#8a8478]">Activity</label>
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
        <label className="text-[10px] uppercase tracking-wider text-[#8a8478]">From</label>
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
        <label className="text-[10px] uppercase tracking-wider text-[#8a8478]">To</label>
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
        <label className="text-[10px] uppercase tracking-wider text-[#8a8478]">Location</label>
        <div className="bg-[#161b42] border border-[#d4a853]/20 text-[#8a8478] rounded-lg px-3 py-2 text-sm min-w-[140px] truncate">
          {locationName || 'No location set'}
        </div>
      </div>

      {/* Scan Button */}
      <button
        onClick={onScan}
        disabled={loading}
        className="ml-auto px-6 py-2.5 bg-gradient-to-br from-[#d4a853] to-[#8a6d2b] text-[#0a0e27] font-semibold rounded-lg text-sm hover:from-[#f0d48a] hover:to-[#d4a853] transition-all disabled:opacity-50"
      >
        {loading ? 'Scanning…' : 'Scan Month'}
      </button>
    </div>
  );
}
