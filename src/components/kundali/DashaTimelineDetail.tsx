'use client';

import { GrahaIconById } from '@/components/icons/GrahaIcons';
import type { DashaEntry } from '@/types/kundali';
import { tl } from '@/lib/utils/trilingual';

/* ─── Planet name → graha id (0-based) ────────────────────────────────────── */
const PLANET_NAME_TO_ID: Record<string, number> = {
  Sun: 0, Moon: 1, Mars: 2, Mercury: 3, Jupiter: 4, Venus: 5, Saturn: 6, Rahu: 7, Ketu: 8,
};

/* ─── Planet accent colors ──────────────────────────────────────────────────── */
const PLANET_COLORS: Record<string, string> = {
  Sun: '#FF6B35', Moon: '#C0C0C0', Mars: '#DC143C', Mercury: '#50C878',
  Jupiter: '#FFD700', Venus: '#FF69B4', Saturn: '#4169E1', Rahu: '#8B6914', Ketu: '#808080',
};

function formatDate(iso: string): string {
  try {
    return new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
  } catch {
    return iso;
  }
}

function formatDuration(startIso: string, endIso: string): string {
  const start = new Date(startIso);
  const end = new Date(endIso);
  if (isNaN(start.getTime()) || isNaN(end.getTime())) return '';
  const totalMonths =
    (end.getFullYear() - start.getFullYear()) * 12 + (end.getMonth() - start.getMonth());
  const years = Math.floor(totalMonths / 12);
  const months = totalMonths % 12;
  const parts: string[] = [];
  if (years > 0) parts.push(`${years}y`);
  if (months > 0) parts.push(`${months}m`);
  return parts.join(' ') || '<1m';
}

const LEVEL_LABELS: Record<string, string> = {
  maha: 'Mahadasha',
  antar: 'Antardasha',
  pratyantar: 'Pratyantardasha',
};

interface DashaTimelineDetailProps {
  period: DashaEntry;
  locale: string;
  onClose?: () => void;
}

export default function DashaTimelineDetail({ period, locale, onClose }: DashaTimelineDetailProps) {
  const planetId = PLANET_NAME_TO_ID[period.planet] ?? -1;
  const color = PLANET_COLORS[period.planet] ?? '#d4a853';
  const levelLabel = LEVEL_LABELS[period.level] ?? period.level;
  const now = new Date();
  const start = new Date(period.startDate);
  const end = new Date(period.endDate);
  const isCurrent = now >= start && now <= end;

  return (
    <div
      className="rounded-2xl border border-gold-primary/20 bg-gradient-to-br from-[#1a1040]/60 to-[#0a0e27] p-4 relative"
      style={{ borderLeftColor: color, borderLeftWidth: 3 }}
    >
      {onClose && (
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-text-secondary hover:text-text-primary transition-colors text-lg leading-none"
          aria-label="Close detail panel"
        >
          ×
        </button>
      )}

      <div className="flex items-center gap-3 mb-3">
        {planetId >= 0 && <GrahaIconById id={planetId} size={36} />}
        <div>
          <div className="flex items-center gap-2">
            <span className="text-gold-light font-semibold text-base">
              {tl(period.planetName, locale)}
            </span>
            {isCurrent && (
              <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-gold-primary/20 text-gold-primary border border-gold-primary/30 animate-pulse">
                NOW
              </span>
            )}
          </div>
          <span className="text-text-secondary text-xs">{levelLabel}</span>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3 text-center">
        <div className="rounded-lg bg-white/5 px-2 py-2">
          <div className="text-[10px] text-text-secondary mb-0.5">Starts</div>
          <div className="text-text-primary text-xs font-medium">{formatDate(period.startDate)}</div>
        </div>
        <div className="rounded-lg bg-white/5 px-2 py-2">
          <div className="text-[10px] text-text-secondary mb-0.5">Duration</div>
          <div className="text-text-primary text-xs font-medium">{formatDuration(period.startDate, period.endDate)}</div>
        </div>
        <div className="rounded-lg bg-white/5 px-2 py-2">
          <div className="text-[10px] text-text-secondary mb-0.5">Ends</div>
          <div className="text-text-primary text-xs font-medium">{formatDate(period.endDate)}</div>
        </div>
      </div>
    </div>
  );
}
