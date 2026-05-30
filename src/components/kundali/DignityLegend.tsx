'use client';

/**
 * Dignity-halo legend — six tier swatches plus the parama-uccha flame
 * badge. Lives in its own file so the SummaryView (Simple/Expert landing
 * card) and the Expert-mode "Advanced Technical Chart Analysis" tab
 * render the identical legend. Single source of truth — if the halo
 * colours in ChartNorth/ChartSouth change, update them here too.
 *
 * Swatch opacities mirror the halo opacities used on the chart so the
 * legend → chart match is visual, not nominal.
 */

import { isDevanagariLocale } from '@/lib/utils/locale-fonts';

interface DignityLegendProps {
  locale: string;
  className?: string;
}

function Swatch({ color, label, opacity = 0.85 }: { color: string; label: string; opacity?: number }) {
  return (
    <span className="flex items-center gap-1">
      <span
        aria-hidden="true"
        className="inline-block w-2.5 h-2.5 rounded-full"
        style={{ backgroundColor: color, opacity }}
      />
      <span>{label}</span>
    </span>
  );
}

export default function DignityLegend({ locale, className = '' }: DignityLegendProps) {
  const isHi = isDevanagariLocale(locale);
  return (
    <div className={className}>
      <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1.5 text-[10.5px] text-text-secondary px-2">
        <Swatch color="#fbbf24" label={isHi ? 'परम-उच्च' : 'Parama-uccha'} />
        <Swatch color="#facc15" label={isHi ? 'उच्च' : 'Exalted'} />
        <Swatch color="#a3e635" label={isHi ? 'स्वगृह / मूल' : 'Own / Mool'} />
        <Swatch color="#86efac" label={isHi ? 'मित्र' : 'Friend'} />
        <Swatch color="#fda4af" label={isHi ? 'शत्रु' : 'Enemy'} />
        <Swatch color="#f87171" label={isHi ? 'नीच' : 'Debilitated'} />
        <span className="flex items-center gap-1">
          <svg viewBox="-4 -4 8 8" className="w-2.5 h-2.5">
            <path d="M0,4 C-2,2 -2,-1 0,-4 C2,-1 2,2 0,4 Z" fill="#fbbf24" />
          </svg>
          <span>{isHi ? 'परम-शिखर (±1°)' : 'Parama peak (±1°)'}</span>
        </span>
      </div>
      <p className="mt-2 text-[10.5px] text-text-secondary/70 text-center px-2">
        {isHi ? 'किसी ग्रह पर क्लिक करें — दृष्टि देखें' : 'Click any planet to see its aspects (drishti)'}
      </p>
    </div>
  );
}
