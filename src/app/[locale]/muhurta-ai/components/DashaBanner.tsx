'use client';

import { useLocale } from 'next-intl';
import { GRAHAS } from '@/lib/constants/grahas';
import { getExtendedActivity } from '@/lib/muhurta/activity-rules-extended';
import { tl } from '@/lib/utils/trilingual';
import type { ExtendedActivityId } from '@/types/muhurta-ai';

interface DashaBannerProps {
  dashaLords: { maha: number; antar: number; pratyantar: number } | null;
  antarEndDate: string | null;
  activityId: ExtendedActivityId;
  chartName: string | null;
}

export default function DashaBanner({
  dashaLords,
  antarEndDate,
  activityId,
  chartName,
}: DashaBannerProps) {
  const locale = useLocale();

  if (!dashaLords) return null;

  const activity = getExtendedActivity(activityId);
  // goodHoras is indexed by planet ID (0=Sun…8=Ketu)
  const antarFavourable = activity.goodHoras.includes(dashaLords.antar);

  const mahaName = tl(GRAHAS[dashaLords.maha]?.name, locale);
  const antarName = tl(GRAHAS[dashaLords.antar]?.name, locale);
  const pratyantarName = tl(GRAHAS[dashaLords.pratyantar]?.name, locale);

  // Sun symbol used as a generic planet indicator
  const sunSymbol = GRAHAS[0].symbol;

  return (
    <div className="flex items-center gap-3 px-4 py-3 bg-[#a78bfa]/[0.08] border border-[#a78bfa]/20 rounded-xl text-sm flex-wrap">
      {/* Icon */}
      <span className="text-[#a78bfa] text-base leading-none select-none">{sunSymbol}</span>

      {/* Running Dasha label */}
      <span className="text-[#8a8478]">Running Dasha:</span>
      <span className="text-[#a78bfa] font-semibold">
        {mahaName} / {antarName} / {pratyantarName}
      </span>

      {/* Until */}
      {antarEndDate && (
        <>
          <span className="text-[#8a8478]">Until:</span>
          <span className="text-[#a78bfa] font-semibold">{antarEndDate}</span>
        </>
      )}

      {/* Relevance note */}
      {antarFavourable ? (
        <span className="text-emerald-400 text-xs font-medium">
          Favourable for this activity ✔
        </span>
      ) : (
        <span className="text-amber-400 text-xs font-medium">
          Caution — may suppress this activity
        </span>
      )}

      {/* Chart name */}
      {chartName && (
        <span className="text-[#8a8478] text-xs ml-auto">Using: {chartName}</span>
      )}
    </div>
  );
}
