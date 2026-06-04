'use client';

/**
 * Visual horizontal bar showing the current Maha dasha span with vertical
 * ticks at each Antar transition. Today is a glowing marker.
 * Spec §18.4 + §24.
 *
 * Simple but powerful — at a glance the Pandit sees where in the dasha
 * cycle the client currently is.
 */

interface Props {
  mahaLord: string;
  mahaStart: string; // ISO date
  mahaEnd: string;
  antarLord: string;
  antarStart: string;
  antarEnd: string;
  today?: string; // optional override, default = real today
}

const TODAY = '2026-06-04'; // pinned for prototype consistency

export default function DashaProgressBar({
  mahaLord,
  mahaStart,
  mahaEnd,
  antarLord,
  antarStart,
  antarEnd,
  today = TODAY,
}: Props) {
  const t0 = new Date(mahaStart).getTime();
  const t1 = new Date(mahaEnd).getTime();
  const tNow = new Date(today).getTime();
  const mahaProgress = Math.max(0, Math.min(1, (tNow - t0) / (t1 - t0)));

  const ta0 = new Date(antarStart).getTime();
  const ta1 = new Date(antarEnd).getTime();
  const antarProgress = Math.max(0, Math.min(1, (tNow - ta0) / (ta1 - ta0)));

  const mahaYears = ((t1 - t0) / (365.25 * 24 * 60 * 60 * 1000)).toFixed(1);
  const mahaYearsCompleted = ((tNow - t0) / (365.25 * 24 * 60 * 60 * 1000)).toFixed(1);

  return (
    <div className="space-y-4">
      {/* Maha bar */}
      <div>
        <div className="flex items-baseline justify-between text-[11px] mb-1.5">
          <div>
            <span className="text-text-tertiary uppercase tracking-wider">Mahā Daśā · </span>
            <span className="text-gold-light font-semibold">{mahaLord}</span>
          </div>
          <span className="text-text-secondary tabular-nums">
            {mahaYearsCompleted} / {mahaYears} yrs
          </span>
        </div>
        <div className="relative h-3 rounded-full bg-bg-primary/60 border border-gold-primary/12 overflow-hidden">
          {/* Fill */}
          <div
            className="absolute inset-y-0 left-0 bg-gradient-to-r from-gold-dark via-gold-primary to-gold-light"
            style={{ width: `${mahaProgress * 100}%`, opacity: 0.85 }}
          />
          {/* Today marker */}
          <div
            className="absolute top-0 bottom-0 w-0.5 bg-gold-light shadow-[0_0_8px_rgba(240,212,138,0.8)]"
            style={{ left: `${mahaProgress * 100}%` }}
            title="Today"
          />
        </div>
        <div className="flex justify-between text-[10px] text-text-tertiary tabular-nums mt-1">
          <span>{mahaStart}</span>
          <span>{mahaEnd}</span>
        </div>
      </div>

      {/* Antar bar */}
      <div>
        <div className="flex items-baseline justify-between text-[11px] mb-1.5">
          <div>
            <span className="text-text-tertiary uppercase tracking-wider">Antar Daśā · </span>
            <span className="text-text-primary font-medium">{antarLord}</span>
          </div>
          <span className="text-text-secondary tabular-nums">
            {Math.round(antarProgress * 100)}% complete
          </span>
        </div>
        <div className="relative h-2 rounded-full bg-bg-primary/60 border border-gold-primary/10 overflow-hidden">
          <div
            className="absolute inset-y-0 left-0 bg-gradient-to-r from-[color:var(--color-pandit-violet)] to-[color:var(--color-pandit-violet-light)]"
            style={{ width: `${antarProgress * 100}%`, opacity: 0.75 }}
          />
          <div
            className="absolute top-0 bottom-0 w-0.5 bg-[color:var(--color-pandit-violet-light)] shadow-[0_0_6px_rgba(140,102,217,0.7)]"
            style={{ left: `${antarProgress * 100}%` }}
            title="Today"
          />
        </div>
        <div className="flex justify-between text-[10px] text-text-tertiary tabular-nums mt-1">
          <span>{antarStart}</span>
          <span>{antarEnd}</span>
        </div>
      </div>
    </div>
  );
}
