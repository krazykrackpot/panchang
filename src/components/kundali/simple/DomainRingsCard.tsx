'use client';

import { useState } from 'react';

interface Props {
  domain: string;
  natalScore: number;
  currentScore: number;
  overallScore: number;
  natalLabel: string;
  currentLabel: string;
  overallLabel: string;
  rating: 'uttama' | 'madhyama' | 'adhama' | 'atyadhama';
  locale: string;
}

const RING_COLOURS: Record<'uttama' | 'madhyama' | 'adhama' | 'atyadhama', string> = {
  uttama: '#22c55e',
  madhyama: '#60a5fa',
  adhama: '#f59e0b',
  atyadhama: '#ef4444',
};

const CIRCUMFERENCE = (r: number) => 2 * Math.PI * r;

function Ring({ radius, score, colour, trackOpacity = 0.15 }: {
  radius: number;
  score: number;
  colour: string;
  trackOpacity?: number;
}) {
  const c = CIRCUMFERENCE(radius);
  const offset = c - (score / 10) * c;

  return (
    <>
      {/* Track */}
      <circle
        cx="50"
        cy="50"
        r={radius}
        fill="none"
        stroke={colour}
        strokeWidth="5"
        opacity={trackOpacity}
      />
      {/* Fill */}
      <circle
        cx="50"
        cy="50"
        r={radius}
        fill="none"
        stroke={colour}
        strokeWidth="5"
        strokeDasharray={c}
        strokeDashoffset={offset}
        strokeLinecap="round"
        transform="rotate(-90 50 50)"
        className="transition-all duration-700"
      />
    </>
  );
}

export default function DomainRingsCard({
  domain,
  natalScore,
  currentScore,
  overallScore,
  natalLabel,
  currentLabel,
  overallLabel,
  rating,
  locale,
}: Props) {
  const isHi = locale === 'hi' || locale === 'sa';
  const L = {
    natal: isHi ? 'जन्म' : 'Natal',
    current: isHi ? 'वर्तमान' : 'Current',
    overall: isHi ? 'समग्र' : 'Overall',
  };
  const [expanded, setExpanded] = useState(false);
  const overallColour = RING_COLOURS[rating] ?? '#f59e0b';

  return (
    <div
      className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-2xl p-4 cursor-pointer hover:border-gold-primary/40 transition-colors"
      onClick={() => setExpanded(!expanded)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') setExpanded(!expanded); }}
    >
      <div className="flex items-center gap-4">
        {/* SVG Rings */}
        <svg viewBox="0 0 100 100" className="w-24 h-24 shrink-0">
          {/* Outer: Overall */}
          <Ring radius={44} score={overallScore} colour={overallColour} />
          {/* Middle: Natal */}
          <Ring radius={34} score={natalScore} colour="#3b82f6" />
          {/* Inner: Current */}
          <Ring radius={24} score={currentScore} colour="#f59e0b" trackOpacity={0.1} />
          {/* Centre score */}
          <text
            x="50"
            y="50"
            textAnchor="middle"
            dominantBaseline="central"
            className="fill-gold-light text-lg font-bold"
            fontSize="16"
          >
            {overallScore.toFixed(1)}
          </text>
        </svg>

        {/* Domain name + summary bullets */}
        <div className="flex-1 min-w-0">
          <h4 className="text-gold-light font-semibold text-sm">{domain}</h4>
          <div className="mt-1.5 space-y-0.5 text-xs">
            <p className="text-blue-400 truncate">
              <span className="inline-block w-2 h-2 rounded-full bg-blue-500 mr-1.5" />
              {L.natal}
            </p>
            <p className="text-amber-400 truncate">
              <span className="inline-block w-2 h-2 rounded-full bg-amber-500 mr-1.5" />
              {L.current}
            </p>
            <p style={{ color: overallColour }} className="truncate">
              <span className="inline-block w-2 h-2 rounded-full mr-1.5" style={{ backgroundColor: overallColour }} />
              {L.overall}
            </p>
          </div>
        </div>
      </div>

      {/* Expanded labels */}
      {expanded && (
        <div className="mt-3 pt-3 border-t border-gold-primary/10 space-y-2 text-xs text-text-primary">
          <p><span className="text-blue-400 font-medium">{L.natal}:</span> {natalLabel}</p>
          <p><span className="text-amber-400 font-medium">{L.current}:</span> {currentLabel}</p>
          <p><span className="font-medium" style={{ color: overallColour }}>{L.overall}:</span> {overallLabel}</p>
        </div>
      )}
    </div>
  );
}
