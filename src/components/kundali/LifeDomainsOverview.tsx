'use client';

import { motion } from 'framer-motion';
import type { DomainReading, Rating } from '@/lib/kundali/domain-synthesis/types';
import { getDomainConfig } from '@/lib/kundali/domain-synthesis/config';
import { tl } from '@/lib/utils/trilingual';

interface LifeDomainsOverviewProps {
  domains: DomainReading[];
  locale: string;
}

// ─── Consistent ring colours ────────────────────────────────────────────────

const NATAL_COLOR = '#34d399';   // emerald
const DASHA_COLOR = '#818cf8';   // indigo
const CURRENT_COLOR = '#22d3ee'; // cyan
const TRACK_COLOR = 'rgba(255, 255, 255, 0.06)';

const NATAL_FILLS: Record<Rating, number> = {
  uttama: 1.0, madhyama: 0.75, adhama: 0.5, atyadhama: 0.25,
};

// ─── Per-domain mini ring (one small set of 3 concentric rings) ─────────────

function MiniDomainRing({ domain, locale }: { domain: DomainReading; locale: string }) {
  const config = getDomainConfig(domain.domain);
  const name = config ? tl(config.name, locale) : domain.domain;
  const act = domain.currentActivation;

  const natalFill = NATAL_FILLS[domain.overallRating.rating];
  const dashaFill = Math.max(0.15, Math.min(1, act.dashaActivationScore / 10));
  const currentFill = Math.min(1, (act.overallActivationScore - act.dashaActivationScore * 0.5) / 6);

  const SIZE = 56;
  const rings = [
    { r: 24, sw: 4, fill: natalFill, color: NATAL_COLOR },
    { r: 18, sw: 3, fill: dashaFill, color: DASHA_COLOR },
    { r: 13, sw: 2.5, fill: Math.max(0, currentFill), color: CURRENT_COLOR },
  ];

  const tierEmoji = domain.overallRating.rating === 'uttama' ? '+'
    : domain.overallRating.rating === 'madhyama' ? '~'
    : domain.overallRating.rating === 'adhama' ? '-'
    : '!';

  return (
    <div className="flex flex-col items-center gap-1">
      <div className="relative" style={{ width: SIZE, height: SIZE }}>
        <svg viewBox="0 0 56 56" width={SIZE} height={SIZE}>
          {rings.map((ring, i) => {
            const c = 2 * Math.PI * ring.r;
            return (
              <g key={i}>
                <circle cx={28} cy={28} r={ring.r} fill="none" stroke={TRACK_COLOR} strokeWidth={ring.sw} />
                {ring.fill > 0 && (
                  <motion.circle
                    cx={28} cy={28} r={ring.r}
                    fill="none" stroke={ring.color}
                    strokeWidth={ring.sw} strokeLinecap="round"
                    strokeDasharray={c}
                    initial={{ strokeDashoffset: c }}
                    animate={{ strokeDashoffset: c * (1 - ring.fill) }}
                    transition={{ type: 'spring', stiffness: 100, damping: 20, delay: i * 0.1 }}
                    transform="rotate(-90 28 28)"
                  />
                )}
              </g>
            );
          })}
          {/* Tier indicator in center */}
          <text x={28} y={30} textAnchor="middle" dominantBaseline="middle"
            fill="#e6e2d8" fontSize="12" fontWeight="700" opacity="0.5">
            {tierEmoji}
          </text>
        </svg>
      </div>
      <span className="text-[10px] text-text-secondary text-center leading-tight max-w-[56px] truncate">
        {name}
      </span>
    </div>
  );
}

// ─── Main overview component ────────────────────────────────────────────────

export default function LifeDomainsOverview({ domains, locale }: LifeDomainsOverviewProps) {
  const isHi = locale === 'hi' || locale === 'sa';

  return (
    <div className="rounded-2xl bg-gradient-to-br from-[#2d1b69]/30 via-[#1a1040]/40 to-[#0a0e27] border border-gold-primary/10 p-4 sm:p-5">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-bold text-gold-light uppercase tracking-wider">
          {isHi ? 'जीवन क्षेत्र सारांश' : 'Life Domains at a Glance'}
        </h3>
        {/* Legend */}
        <div className="flex gap-3">
          <span className="flex items-center gap-1 text-[9px] text-text-secondary">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#34d399]" /> Natal
          </span>
          <span className="flex items-center gap-1 text-[9px] text-text-secondary">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#818cf8]" /> Mahadasha
          </span>
          <span className="flex items-center gap-1 text-[9px] text-text-secondary">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#22d3ee]" /> Current
          </span>
        </div>
      </div>

      <div className="flex justify-between gap-1 overflow-x-auto">
        {domains.map(d => (
          <MiniDomainRing key={d.domain} domain={d} locale={locale} />
        ))}
      </div>
    </div>
  );
}
