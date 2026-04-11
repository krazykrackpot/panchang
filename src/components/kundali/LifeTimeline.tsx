'use client';

import { useMemo, useRef, useEffect, useState } from 'react';
import type { KundaliData } from '@/types/kundali';

// ── Layout constants ──────────────────────────────────────────────────────────
const PX = 30;         // pixels per year
const ML = 0;          // no left margin in SVG — labels are in a fixed panel outside
const LABEL_W = 72;    // fixed labels panel width
const YEARS = 90;
const TW = PX * YEARS + 32;

// Track layout: y = top of track, h = height
const T = {
  yearRuler:  { y: 0,   h: 26, label: '' },
  dasha:      { y: 26,  h: 62, label: '' },
  sadesati:   { y: 88,  h: 22, label: '' },
  yoga:       { y: 110, h: 22, label: '' },
  jupiter:    { y: 132, h: 26, label: '' },
  saturn:     { y: 158, h: 26, label: '' },
  ashtaka:    { y: 184, h: 16, label: '' },
  synthesis:  { y: 200, h: 28, label: '' },
  ageRuler:   { y: 232, h: 24, label: '' },
};
const TH = 260;

// Planet colors (bg, text, glow)
type PColor = { bg: string; fg: string; glow: string };
const PC: Record<string, PColor> = {
  Sun:     { bg: '#b35614', fg: '#ffd5b0', glow: '#e67e22' },
  Moon:    { bg: '#4a6f8f', fg: '#dceeff', glow: '#7fa8cc' },
  Mars:    { bg: '#8b1a1a', fg: '#ffc8c8', glow: '#e74c3c' },
  Mercury: { bg: '#1a6b40', fg: '#b8ffd8', glow: '#2ecc71' },
  Jupiter: { bg: '#8c6008', fg: '#fff4b0', glow: '#f0b429' },
  Venus:   { bg: '#6a3080', fg: '#f0d5ff', glow: '#c39bd3' },
  Saturn:  { bg: '#1a4f80', fg: '#c5e8ff', glow: '#3498db' },
  Rahu:    { bg: '#4a2060', fg: '#e8d5ff', glow: '#9b59b6' },
  Ketu:    { bg: '#404040', fg: '#e0e0e0', glow: '#95a5a6' },
};

const PLANET_HI: Record<string, string> = {
  Sun: 'सूर्य', Moon: 'चन्द्र', Mars: 'मंगल', Mercury: 'बुध',
  Jupiter: 'बृहस्पति', Venus: 'शुक्र', Saturn: 'शनि', Rahu: 'राहु', Ketu: 'केतु',
};

const norm360 = (d: number) => ((d % 360) + 360) % 360;

function dateToFracYear(dateStr: string): number {
  return toFracYear(new Date(dateStr));
}

// ── Tooltip state ─────────────────────────────────────────────────────────────
interface TooltipData { x: number; y: number; lines: string[] }

// ── Main component ────────────────────────────────────────────────────────────
interface Props {
  kundali: KundaliData;
  locale: string;
  isDevanagari: boolean;
  headingFont?: React.CSSProperties;
}

export default function LifeTimeline({ kundali, locale, isDevanagari, headingFont }: Props) {
  const isHi = locale !== 'en' && String(locale) !== 'ta';
  const scrollRef = useRef<HTMLDivElement>(null);
  const [tooltip, setTooltip] = useState<TooltipData | null>(null);

  const data = useMemo(() => computeTimeline(kundali), [kundali]);

  // Scroll to center today on mount
  useEffect(() => {
    const el = scrollRef.current;
    if (el && data.todayX > 0) {
      el.scrollLeft = Math.max(0, data.todayX - el.clientWidth * 0.4);
    }
  }, [data.todayX]);

  const yearToX = (y: number) => ML + (y - data.birthYear) * PX;

  const handleMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const svgX = e.clientX - rect.left;
    const svgY = e.clientY - rect.top;
    // Check event markers
    const hit = data.events.find(ev => Math.abs(yearToX(ev.year) - svgX) < 8 && Math.abs((ev.trackY ?? 0) - svgY) < 10);
    if (hit) {
      setTooltip({ x: svgX, y: svgY - 12, lines: isHi ? hit.labelHi : hit.label });
    } else {
      setTooltip(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-2xl font-bold mb-1" style={{ ...headingFont, background: 'linear-gradient(135deg, #f0d48a, #d4a853)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          {isHi ? 'जीवन-रेखा — सम्पूर्ण काल-संश्लेषण' : 'Life Timeline — Complete Synthesis'}
        </h3>
        <p className="text-text-secondary text-sm">
          {isHi ? 'सभी ज्योतिषीय तत्त्वों का कालानुक्रमिक समन्वय' : 'All astrological systems synthesized on a single timeline'}
        </p>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-2 justify-center text-xs">
        {[
          { color: '#f0b429', label: isHi ? 'विंशोत्तरी दशा' : 'Vimshottari Dasha' },
          { color: '#e74c3c', label: isHi ? 'साढ़े साती (♄ गोचर)' : 'Sade Sati (♄ transit)', opacity: '60%' },
          { color: '#2ecc71', label: isHi ? 'योग सक्रिय' : 'Major Yoga Active' },
          { color: '#f0b429', label: isHi ? '⭐ बृहस्पति→योगी' : '⭐ Jupiter→Yogi Pt' },
          { color: '#e74c3c', label: isHi ? '⚠ शनि→अवयोगी' : '⚠ Saturn→Avayogi' },
          { color: '#9b59b6', label: isHi ? '◉ राहु-अक्ष' : '◉ Rahu Axis Shift' },
          { color: '#d4a853', label: isHi ? 'आज' : 'Today', dashed: true },
        ].map((l, i) => (
          <div key={i} className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-[#111633] border border-white/5">
            {l.dashed
              ? <div className="w-6 border-t-2 border-dashed" style={{ borderColor: l.color }} />
              : <div className="w-3 h-3 rounded-sm" style={{ background: l.color, opacity: l.opacity }} />}
            <span className="text-text-secondary">{l.label}</span>
          </div>
        ))}
      </div>

      {/* Timeline: fixed labels + scrollable SVG */}
      <div className="flex rounded-xl border border-gold-primary/10 overflow-hidden" style={{ background: '#070a1a' }}>

        {/* ── Fixed labels panel (never scrolls) ── */}
        <div style={{ width: LABEL_W, minWidth: LABEL_W, height: TH, position: 'relative', flexShrink: 0, borderRight: '1px solid rgba(255,255,255,0.05)', zIndex: 2, background: '#070a1a' }}>
          {([
            { y: T.dasha.y + T.dasha.h / 2,        en: 'Dasha',     hi: 'दशा' },
            { y: T.sadesati.y + T.sadesati.h / 2,   en: '♄ Transit', hi: '♄ गोचर' },
            { y: T.yoga.y + T.yoga.h / 2,           en: 'Yogas',     hi: 'योग' },
            { y: T.jupiter.y + T.jupiter.h / 2,     en: '♃ Transit', hi: '♃ गोचर' },
            { y: T.saturn.y + T.saturn.h / 2,       en: '♄ ◉ Rahu',  hi: '♄ ◉ राहु' },
            { y: T.ashtaka.y + T.ashtaka.h / 2,     en: 'SAV',       hi: 'अष्ट' },
            { y: T.synthesis.y + T.synthesis.h / 2, en: 'Quality',   hi: 'गुण' },
            { y: T.ageRuler.y + T.ageRuler.h / 2,   en: 'Age',       hi: 'आयु' },
          ] as { y: number; en: string; hi: string }[]).map((lbl, i) => (
            <div key={i} style={{ position: 'absolute', top: lbl.y - 5, right: 6, lineHeight: '11px', color: '#6a6055', textAlign: 'right', fontSize: 9, fontFamily: 'system-ui' }}>
              {isHi ? lbl.hi : lbl.en}
            </div>
          ))}
        </div>

        {/* ── Scrollable SVG ── */}
        <div
          ref={scrollRef}
          className="overflow-x-auto flex-1"
        >
        <svg
          width={TW} height={TH}
          style={{ display: 'block', minWidth: TW }}
          onMouseMove={handleMouseMove}
          onMouseLeave={() => setTooltip(null)}
        >
          <defs>
            <filter id="tl-glow">
              <feGaussianBlur stdDeviation="2.5" result="blur" />
              <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
            </filter>
            <filter id="tl-glow-sm">
              <feGaussianBlur stdDeviation="1.5" result="blur" />
              <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
            </filter>
            {/* Synthesis gradient */}
            <linearGradient id="synth-good" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#2ecc71" stopOpacity="0.7" />
              <stop offset="100%" stopColor="#1a8a40" stopOpacity="0.4" />
            </linearGradient>
            <linearGradient id="synth-bad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#e74c3c" stopOpacity="0.6" />
              <stop offset="100%" stopColor="#8b1a1a" stopOpacity="0.3" />
            </linearGradient>
            <linearGradient id="synth-avg" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#f0b429" stopOpacity="0.5" />
              <stop offset="100%" stopColor="#8c6008" stopOpacity="0.3" />
            </linearGradient>
          </defs>

          {/* Full background */}
          <rect width={TW} height={TH} fill="#070a1a" />

          {/* Decade grid lines */}
          {Array.from({ length: YEARS / 10 + 1 }, (_, i) => {
            const yr = Math.ceil(data.birthYear / 10) * 10 + i * 10;
            if (yr > data.birthYear + YEARS) return null;
            const x = yearToX(yr);
            return (
              <line key={yr} x1={x} y1={T.yearRuler.h} x2={x} y2={T.ageRuler.y}
                stroke="#ffffff" strokeOpacity="0.04" strokeWidth="1" />
            );
          })}

          {/* Track labels are in the fixed panel outside the SVG */}

          {/* ── Top year ruler ─────────────────────────────────────────────── */}
          {Array.from({ length: YEARS + 1 }, (_, i) => {
            const yr = data.birthYear + i;
            const x = yearToX(yr);
            const isMajor = yr % 10 === 0;
            const isMid = yr % 5 === 0;
            if (!isMajor && !isMid && i % 2 !== 0) return null;
            return (
              <g key={yr}>
                <line x1={x} y1={T.yearRuler.y + T.yearRuler.h - (isMajor ? 8 : isMid ? 5 : 3)}
                  x2={x} y2={T.yearRuler.y + T.yearRuler.h}
                  stroke={isMajor ? '#6a6055' : '#3a3530'} strokeWidth="1" />
                {isMajor && (
                  <text x={x} y={T.yearRuler.y + 12} textAnchor="middle"
                    fontSize="9" fill="#8a7a60" fontFamily="system-ui">{yr}</text>
                )}
              </g>
            );
          })}

          {/* ── Dasha bands ────────────────────────────────────────────────── */}
          {data.dashas.map((d, i) => {
            const x1 = Math.max(ML, yearToX(d.startYear));
            const x2 = Math.min(TW - 4, yearToX(d.endYear));
            if (x2 <= x1) return null;
            const w = x2 - x1;
            const color = PC[d.planet] ?? { bg: '#333', fg: '#ccc', glow: '#666' };
            const label = isHi ? (PLANET_HI[d.planet] ?? d.planet) : d.planet;
            const hasYoga = d.hasYoga;
            const quality = d.quality; // 'strong' | 'avg' | 'weak'
            return (
              <g key={i}>
                <rect x={x1} y={T.dasha.y + 2} width={w} height={T.dasha.h - 4}
                  fill={color.bg} rx="3" ry="3" opacity="0.88" />
                {/* Quality shimmer on top edge */}
                <rect x={x1} y={T.dasha.y + 2} width={w} height={3}
                  fill={quality === 'strong' ? '#f0b429' : quality === 'weak' ? '#e74c3c' : '#555'}
                  rx="2" ry="2" opacity="0.7" />
                {/* Yoga glow border */}
                {hasYoga && (
                  <rect x={x1} y={T.dasha.y + 2} width={w} height={T.dasha.h - 4}
                    fill="none" stroke="#f0b429" strokeWidth="1.5" rx="3" ry="3" opacity="0.5" />
                )}
                {/* Planet label + quality */}
                {w > 22 && (
                  <text x={x1 + Math.min(w / 2, 40)} y={T.dasha.y + T.dasha.h / 2 + 4}
                    textAnchor={w > 80 ? 'middle' : 'start'} fontSize={w > 60 ? '11' : '9'}
                    fill={color.fg} fontFamily="system-ui" fontWeight="600">
                    {w > 80 ? label : label.slice(0, 3)}
                  </text>
                )}
                {/* Quality star/marker */}
                {w > 48 && quality === 'strong' && (
                  <text x={x1 + w / 2} y={T.dasha.y + T.dasha.h - 8} textAnchor="middle"
                    fontSize="10" fill="#f0b429">★</text>
                )}
                {w > 48 && quality === 'weak' && (
                  <text x={x1 + w / 2} y={T.dasha.y + T.dasha.h - 8} textAnchor="middle"
                    fontSize="10" fill="#e74c3c">▽</text>
                )}
                {/* Yoga badge */}
                {w > 70 && hasYoga && (
                  <text x={x1 + 6} y={T.dasha.y + 14} fontSize="8" fill="#f0b429" opacity="0.9">
                    {isHi ? 'योग' : 'Yoga'}
                  </text>
                )}
                {/* Year spans inside wide bands */}
                {w > 120 && (
                  <text x={x1 + 4} y={T.dasha.y + T.dasha.h - 6} fontSize="8" fill={color.fg} opacity="0.5">
                    {Math.round(d.startYear)}–{Math.round(d.endYear)}
                  </text>
                )}
              </g>
            );
          })}

          {/* ── Sade Sati overlay ──────────────────────────────────────────── */}
          {data.sadeSatiPeriods.map((ss, i) => {
            const x1 = Math.max(ML, yearToX(ss.startYear));
            // +1 because endYear is the last year Saturn is in target sign — bar should cover full year
            const x2 = Math.min(TW - 4, yearToX(ss.endYear + 1));
            if (x2 <= x1) return null;
            const w = x2 - x1;
            return (
              <g key={i}>
                {/* Full band */}
                <rect x={x1} y={T.sadesati.y + 1} width={w} height={T.sadesati.h - 2}
                  fill="#e74c3c" opacity="0.18" rx="2" />
                <rect x={x1} y={T.sadesati.y + 1} width={w} height={T.sadesati.h - 2}
                  fill="none" stroke="#e74c3c" strokeWidth="0.8" opacity="0.35" rx="2" />
                {/* Phase stripes */}
                {ss.phases?.map((ph, j) => {
                  const px1 = Math.max(x1, yearToX(ph.startYear));
                  const px2 = Math.min(x2, yearToX(ph.endYear + 1));
                  if (px2 <= px1) return null;
                  const intensity = ph.phase === 'peak' ? 0.35 : 0.15;
                  return (
                    <rect key={j} x={px1} y={T.sadesati.y + 1} width={px2 - px1} height={T.sadesati.h - 2}
                      fill="#e74c3c" opacity={intensity} rx="2" />
                  );
                })}
                {/* Label in wide bands */}
                {w > 50 && (
                  <text x={x1 + w / 2} y={T.sadesati.y + T.sadesati.h / 2 + 4}
                    textAnchor="middle" fontSize="8" fill="#e88" opacity="0.8" fontFamily="system-ui">
                    {isHi ? 'साढ़े साती' : 'Sade Sati'}
                  </text>
                )}
                {/* Also overlay on dasha band */}
                <rect x={x1} y={T.dasha.y + 2} width={w} height={T.dasha.h - 4}
                  fill="#e74c3c" opacity="0.12" rx="3" />
              </g>
            );
          })}

          {/* ── Yoga track ────────────────────────────────────────────────── */}
          {data.yogaPeriods.map((yp, i) => {
            const x1 = Math.max(ML, yearToX(yp.startYear));
            const x2 = Math.min(TW - 4, yearToX(yp.endYear));
            if (x2 <= x1) return null;
            const w = x2 - x1;
            return (
              <g key={i}>
                <rect x={x1} y={T.yoga.y + 2} width={w} height={T.yoga.h - 4}
                  fill="#2ecc71" opacity="0.20" rx="2" />
                <rect x={x1} y={T.yoga.y + 2} width={w} height={T.yoga.h - 4}
                  fill="none" stroke="#2ecc71" strokeWidth="0.8" opacity="0.5" rx="2" />
                {w > 40 && (
                  <text x={x1 + Math.min(w / 2, 30)} y={T.yoga.y + T.yoga.h / 2 + 4}
                    textAnchor={w > 70 ? 'middle' : 'start'} fontSize="8" fill="#6ef5a0" opacity="0.85" fontFamily="system-ui">
                    {w > 80 ? (isHi ? yp.nameHi : yp.name) : '✦'}
                  </text>
                )}
              </g>
            );
          })}

          {/* ── Jupiter events row ────────────────────────────────────────── */}
          {/* Jupiter return markers (small diamonds) */}
          {data.jupiterReturns.map((yr, i) => {
            const x = yearToX(yr);
            if (x < ML || x > TW - 4) return null;
            const cy = T.jupiter.y + T.jupiter.h / 2;
            return (
              <g key={i} style={{ cursor: 'pointer' }}>
                <polygon
                  points={`${x},${cy - 6} ${x + 5},${cy} ${x},${cy + 6} ${x - 5},${cy}`}
                  fill="#f0b429" opacity="0.4" />
              </g>
            );
          })}
          {/* Jupiter → Yogi Point (big star) */}
          {data.jupiterYogiTransits.map((ev, i) => {
            const x = yearToX(ev.year);
            if (x < ML || x > TW - 4) return null;
            const cy = T.jupiter.y + T.jupiter.h / 2;
            return (
              <g key={i} style={{ cursor: 'pointer' }}
                onMouseEnter={() => setTooltip({ x, y: cy - 20, lines: isHi ? ev.labelHi : ev.label })}>
                <text x={x} y={cy + 5} textAnchor="middle" fontSize="16" fill="#f0d060" filter="url(#tl-glow-sm)">★</text>
                {/* window band */}
                {ev.windowYears > 0 && (
                  <rect x={yearToX(ev.year - ev.windowYears / 2)}
                    y={T.jupiter.y} width={ev.windowYears * PX} height={T.jupiter.h}
                    fill="#f0b429" opacity="0.06" />
                )}
              </g>
            );
          })}
          {/* Jupiter track baseline */}
          <line x1={ML} y1={T.jupiter.y + T.jupiter.h / 2}
            x2={TW - 4} y2={T.jupiter.y + T.jupiter.h / 2}
            stroke="#f0b429" strokeOpacity="0.08" strokeWidth="1" />

          {/* ── Saturn events row ─────────────────────────────────────────── */}
          {data.saturnReturns.map((yr, i) => {
            const x = yearToX(yr);
            if (x < ML || x > TW - 4) return null;
            const cy = T.saturn.y + T.saturn.h / 2;
            return (
              <g key={i}>
                <polygon points={`${x},${cy + 6} ${x + 5},${cy - 4} ${x - 5},${cy - 4}`}
                  fill="#3498db" opacity="0.35" />
              </g>
            );
          })}
          {data.saturnAvayogiTransits.map((ev, i) => {
            const x = yearToX(ev.year);
            if (x < ML || x > TW - 4) return null;
            const cy = T.saturn.y + T.saturn.h / 2;
            return (
              <g key={i} style={{ cursor: 'pointer' }}
                onMouseEnter={() => setTooltip({ x, y: cy - 20, lines: isHi ? ev.labelHi : ev.label })}>
                <text x={x} y={cy + 6} textAnchor="middle" fontSize="15" fill="#e74c3c" filter="url(#tl-glow-sm)">⚠</text>
                {ev.windowYears > 0 && (
                  <rect x={yearToX(ev.year - ev.windowYears / 2)}
                    y={T.saturn.y} width={ev.windowYears * PX} height={T.saturn.h}
                    fill="#e74c3c" opacity="0.05" />
                )}
              </g>
            );
          })}
          {data.rahuAxisShifts.map((yr, i) => {
            const x = yearToX(yr);
            if (x < ML || x > TW - 4) return null;
            const cy = T.saturn.y + T.saturn.h / 2;
            if (i % 6 !== 0) return null; // only show every ~9yr cluster
            return (
              <g key={i}>
                <circle cx={x} cy={cy - 8} r="3" fill="#9b59b6" opacity="0.5" />
              </g>
            );
          })}
          {/* Saturn track baseline */}
          <line x1={ML} y1={T.saturn.y + T.saturn.h / 2}
            x2={TW - 4} y2={T.saturn.y + T.saturn.h / 2}
            stroke="#3498db" strokeOpacity="0.08" strokeWidth="1" />

          {/* ── Ashtakavarga heat bar ─────────────────────────────────────── */}
          {data.ashtakaHeat.map((seg, i) => {
            const x1 = yearToX(seg.year);
            const x2 = yearToX(seg.year + 1);
            if (x1 < ML || x2 > TW - 4) return null;
            // Score 0-56: 0-27 low, 28-35 avg, 36+ high
            const pct = Math.min(1, seg.score / 56);
            const color = seg.score >= 36 ? '#2ecc71' : seg.score >= 27 ? '#f0b429' : '#e74c3c';
            return (
              <rect key={i} x={x1} y={T.ashtaka.y} width={x2 - x1} height={T.ashtaka.h}
                fill={color} opacity={0.15 + pct * 0.35} />
            );
          })}
          <rect x={ML} y={T.ashtaka.y} width={TW - ML - 4} height={T.ashtaka.h}
            fill="none" stroke="#ffffff" strokeOpacity="0.04" />

          {/* ── Synthesis quality bar ─────────────────────────────────────── */}
          {data.synthesisScores.map((seg, i) => {
            const x1 = Math.max(ML, yearToX(seg.startYear));
            const x2 = Math.min(TW - 4, yearToX(seg.endYear));
            if (x2 <= x1) return null;
            const gradient = seg.score >= 60 ? 'url(#synth-good)' : seg.score <= 35 ? 'url(#synth-bad)' : 'url(#synth-avg)';
            return (
              <rect key={i} x={x1} y={T.synthesis.y + 2} width={x2 - x1} height={T.synthesis.h - 4}
                fill={gradient} rx="2" />
            );
          })}
          {/* Score labels for wide synthesis bands */}
          {data.synthesisScores.map((seg, i) => {
            const x1 = Math.max(ML, yearToX(seg.startYear));
            const x2 = Math.min(TW - 4, yearToX(seg.endYear));
            const w = x2 - x1;
            if (w < 40) return null;
            const label = seg.score >= 60 ? (isHi ? 'उत्तम' : 'Peak') : seg.score <= 35 ? (isHi ? 'कठिन' : 'Hard') : (isHi ? 'मध्यम' : 'Avg');
            return (
              <text key={i} x={x1 + w / 2} y={T.synthesis.y + T.synthesis.h / 2 + 4}
                textAnchor="middle" fontSize="9" fill="#d4c8b0" fontFamily="system-ui">{label}</text>
            );
          })}

          {/* ── Bottom age ruler ──────────────────────────────────────────── */}
          {Array.from({ length: YEARS + 1 }, (_, i) => {
            const age = i;
            const yr = data.birthYear + age;
            const x = yearToX(yr);
            const isMajor = age % 10 === 0;
            const isMid = age % 5 === 0;
            if (!isMajor && !isMid && age % 2 !== 0) return null;
            return (
              <g key={age}>
                <line x1={x} y1={T.ageRuler.y}
                  x2={x} y2={T.ageRuler.y + (isMajor ? 8 : isMid ? 5 : 3)}
                  stroke={isMajor ? '#6a6055' : '#3a3530'} strokeWidth="1" />
                {isMajor && (
                  <text x={x} y={T.ageRuler.y + T.ageRuler.h - 4} textAnchor="middle"
                    fontSize="9" fill="#8a7a60" fontFamily="system-ui">{age}</text>
                )}
              </g>
            );
          })}
          {/* "Age" label is in the fixed labels panel */}

          {/* ── Today vertical line ───────────────────────────────────────── */}
          {data.todayX >= ML && data.todayX <= TW - 4 && (
            <g filter="url(#tl-glow)">
              <line x1={data.todayX} y1={T.yearRuler.h} x2={data.todayX} y2={T.ageRuler.y}
                stroke="#d4a853" strokeWidth="1.5" strokeDasharray="5,3" />
              <text x={data.todayX} y={T.yearRuler.y + 10} textAnchor="middle"
                fontSize="9" fill="#d4a853" fontWeight="bold" fontFamily="system-ui">
                {isHi ? '● आज' : '● Now'}
              </text>
            </g>
          )}

          {/* ── Tooltip ───────────────────────────────────────────────────── */}
          {tooltip && (
            <g>
              <rect x={tooltip.x - 2} y={tooltip.y - 14} width={Math.max(...tooltip.lines.map(l => l.length)) * 6 + 12}
                height={tooltip.lines.length * 14 + 8} fill="#1a1040" stroke="#d4a853" strokeWidth="0.5" rx="4" opacity="0.95" />
              {tooltip.lines.map((line, i) => (
                <text key={i} x={tooltip.x + 4} y={tooltip.y + i * 14}
                  fontSize="10" fill="#e6e2d8" fontFamily="system-ui">{line}</text>
              ))}
            </g>
          )}
        </svg>
        </div> {/* end scrollable div */}
      </div> {/* end flex container */}

      {/* ── Key Periods Summary ──────────────────────────────────────────────── */}
      <KeyPeriodsSummary data={data} isHi={isHi} isDevanagari={isDevanagari} headingFont={headingFont} />
    </div>
  );
}

// ── Key Periods Summary component ─────────────────────────────────────────────
function KeyPeriodsSummary({ data, isHi, isDevanagari, headingFont }: {
  data: TimelineData;
  isHi: boolean;
  isDevanagari: boolean;
  headingFont?: React.CSSProperties;
}) {
  const upcoming = data.keyPeriods.filter(p => p.year >= data.todayYear).slice(0, 8);
  const past = data.keyPeriods.filter(p => p.year < data.todayYear).slice(-3).reverse();

  return (
    <div className="space-y-4">
      <h4 className="text-gold-light font-semibold text-base" style={headingFont}>
        {isHi ? 'आगामी महत्त्वपूर्ण काल' : 'Upcoming Key Periods'}
      </h4>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {upcoming.map((p, i) => (
          <div key={i}
            className={`rounded-lg p-3 border text-sm flex items-start gap-3 ${
              p.type === 'positive'
                ? 'bg-emerald-500/8 border-emerald-500/20'
                : p.type === 'challenging'
                ? 'bg-red-500/8 border-red-500/20'
                : 'bg-amber-500/8 border-amber-500/20'
            }`}>
            <div className="text-lg shrink-0 mt-0.5">{p.icon}</div>
            <div className="min-w-0">
              <div className={`font-bold text-xs mb-0.5 ${
                p.type === 'positive' ? 'text-emerald-300' : p.type === 'challenging' ? 'text-red-300' : 'text-amber-300'
              }`}>
                {p.yearLabel}
              </div>
              <div className="text-text-primary text-xs font-medium">{isHi ? p.titleHi : p.title}</div>
              <div className="text-text-secondary text-xs mt-0.5 leading-relaxed">{isHi ? p.descHi : p.desc}</div>
            </div>
          </div>
        ))}
      </div>

      {past.length > 0 && (
        <>
          <h4 className="text-text-secondary font-semibold text-sm mt-4" style={headingFont}>
            {isHi ? 'हाल की महत्त्वपूर्ण अवधियाँ' : 'Recent Key Periods'}
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 opacity-60">
            {past.map((p, i) => (
              <div key={i} className="rounded-lg p-3 border border-white/5 bg-white/3 text-xs flex items-start gap-2">
                <span className="text-base">{p.icon}</span>
                <div>
                  <div className="text-text-secondary font-bold">{p.yearLabel}</div>
                  <div className="text-text-primary">{isHi ? p.titleHi : p.title}</div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Per-system synthesis table */}
      <DashaSynthesisTable data={data} isHi={isHi} headingFont={headingFont} />
    </div>
  );
}

// ── Dasha synthesis table ─────────────────────────────────────────────────────
function DashaSynthesisTable({ data, isHi, headingFont }: {
  data: TimelineData;
  isHi: boolean;
  headingFont?: React.CSSProperties;
}) {
  return (
    <div>
      <h4 className="text-gold-light font-semibold text-base mb-3" style={headingFont}>
        {isHi ? 'दशा-वार संश्लेषण' : 'Period-by-Period Synthesis'}
      </h4>
      {/* Clarifying note about Sade Sati independence */}
      <div className="mb-3 rounded-lg bg-amber-500/8 border border-amber-500/15 px-3 py-2 text-xs text-amber-200/70 leading-relaxed">
        <strong className="text-amber-300">{isHi ? 'ध्यान दें:' : 'Note:'}</strong>
        {isHi
          ? ' साढ़े साती शनि के वर्तमान गोचर (आकाश में स्थिति) पर आधारित है — विंशोत्तरी दशा पर नहीं। यह हर ~30 वर्षों में होती है, चाहे कोई भी दशा चल रही हो। अलग-अलग दशाओं में "हाँ" का अर्थ है भिन्न साढ़े साती चक्र।'
          : ' Sade Sati is based on Saturn\'s current sky transit — independent of Vimshottari dasha. It repeats every ~30 years regardless of which planet\'s dasha is running. "Yes" in different non-consecutive dashas means different Sade Sati cycles, not one long one.'}
      </div>
      <div className="overflow-x-auto rounded-xl border border-gold-primary/10">
        <table className="w-full text-xs" style={{ minWidth: 580 }}>
          <thead>
            <tr className="border-b border-white/8" style={{ background: '#111633' }}>
              {[
                isHi ? 'महादशा' : 'Mahadasha',
                isHi ? 'काल' : 'Period',
                isHi ? 'षड्बल' : 'Shadbala',
                isHi ? 'योग' : 'Yogas',
                isHi ? '♄ गोचर (साढ़े साती)' : '♄ Transit (Sade Sati)',
                isHi ? 'गुण-स्कोर' : 'Quality',
              ].map((h, i) => (
                <th key={i} className="px-3 py-2.5 text-left font-semibold text-text-secondary">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.dashas.map((d, i) => {
              const color = PC[d.planet] ?? { bg: '#333', fg: '#ccc', glow: '#666' };
              // Find which specific Sade Sati cycle(s) overlap this dasha, and the overlap years
              const overlappingCycles = data.sadeSatiPeriods
                .filter(ss => d.startYear < ss.endYear + 1 && d.endYear > ss.startYear)
                .map(ss => {
                  const overlapStart = Math.max(d.startYear, ss.startYear);
                  const overlapEnd = Math.min(d.endYear, ss.endYear + 1);
                  return `${Math.round(overlapStart)}–${Math.round(overlapEnd)}`;
                });
              const qualityColor = d.quality === 'strong' ? 'text-emerald-300' : d.quality === 'weak' ? 'text-red-300' : 'text-amber-300';
              const qualityLabel = d.quality === 'strong'
                ? (isHi ? '★ बलवान' : '★ Strong')
                : d.quality === 'weak'
                ? (isHi ? '▽ दुर्बल' : '▽ Weak')
                : (isHi ? '◇ मध्यम' : '◇ Average');
              const score = d.synthesisScore;
              const scorePct = Math.round(score);
              const scoreColor = score >= 60 ? '#2ecc71' : score <= 35 ? '#e74c3c' : '#f0b429';
              return (
                <tr key={i} className="border-b border-white/4 hover:bg-white/2 transition-colors">
                  <td className="px-3 py-2">
                    <div className="flex items-center gap-2">
                      <div className="w-2.5 h-2.5 rounded-sm" style={{ background: color.glow, opacity: 0.8 }} />
                      <span className="font-medium text-text-primary">
                        {isHi ? (PLANET_HI[d.planet] ?? d.planet) : d.planet}
                      </span>
                    </div>
                  </td>
                  <td className="px-3 py-2 text-text-secondary font-mono">
                    {Math.round(d.startYear)}–{Math.round(d.endYear)}
                  </td>
                  <td className={`px-3 py-2 font-semibold ${qualityColor}`}>{qualityLabel}</td>
                  <td className="px-3 py-2">
                    {d.hasYoga
                      ? <span className="text-emerald-300 font-semibold">{isHi ? '✦ सक्रिय' : '✦ Active'}</span>
                      : <span className="text-text-secondary opacity-40">—</span>}
                  </td>
                  <td className="px-3 py-2">
                    {overlappingCycles.length > 0
                      ? <span className="text-orange-300 font-mono">⚠ {overlappingCycles.join(', ')}</span>
                      : <span className="text-text-secondary opacity-40">—</span>}
                  </td>
                  <td className="px-3 py-2">
                    <div className="flex items-center gap-2">
                      <div className="w-20 h-2 rounded-full bg-white/8 overflow-hidden">
                        <div className="h-full rounded-full" style={{ width: `${scorePct}%`, background: scoreColor, opacity: 0.8 }} />
                      </div>
                      <span style={{ color: scoreColor }} className="font-mono font-bold">{scorePct}</span>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ── Timeline computation ──────────────────────────────────────────────────────
interface TimelineEvent {
  year: number;
  type: 'positive' | 'challenging' | 'neutral';
  icon: string;
  title: string;
  titleHi: string;
  desc: string;
  descHi: string;
  yearLabel: string;
  label: string[];
  labelHi: string[];
  trackY?: number;
  windowYears: number;
}

interface SynthesisScore {
  startYear: number;
  endYear: number;
  score: number; // 0-100
}

interface DashaEntry {
  planet: string;
  startYear: number;
  endYear: number;
  quality: 'strong' | 'avg' | 'weak';
  hasYoga: boolean;
  synthesisScore: number;
}

interface SadeSatiPeriod {
  startYear: number;
  endYear: number;
  phases?: { phase: string; startYear: number; endYear: number }[];
}

interface YogaPeriod {
  startYear: number;
  endYear: number;
  name: string;
  nameHi: string;
}

interface JupiterTransitEvent extends TimelineEvent {
  year: number;
  windowYears: number;
}

interface AshtakaSegment {
  year: number;
  score: number;
}

interface TimelineData {
  birthYear: number;
  todayYear: number;
  todayX: number;
  dashas: DashaEntry[];
  sadeSatiPeriods: SadeSatiPeriod[];
  yogaPeriods: YogaPeriod[];
  jupiterYogiTransits: JupiterTransitEvent[];
  jupiterReturns: number[];
  saturnAvayogiTransits: JupiterTransitEvent[];
  saturnReturns: number[];
  rahuAxisShifts: number[];
  ashtakaHeat: AshtakaSegment[];
  synthesisScores: SynthesisScore[];
  keyPeriods: TimelineEvent[];
  events: TimelineEvent[];
}

function fmtYear(yr: number): string {
  const y = Math.floor(yr);
  const m = Math.round((yr - y) * 12);
  const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  return `${MONTHS[Math.min(11, Math.max(0, m))]} ${y}`;
}

function toFracYear(d: Date): number {
  const y = d.getFullYear();
  const start = new Date(y, 0, 1).getTime();
  const end = new Date(y + 1, 0, 1).getTime();
  return y + (d.getTime() - start) / (end - start);
}

function computeTimeline(kundali: KundaliData): TimelineData {
  const today = new Date();
  const todayYear = toFracYear(today);
  const birthDate = new Date(kundali.birthData.date);
  const birthYear = toFracYear(birthDate);
  const todayX = (todayYear - birthYear) * PX;

  // ── Dasha bands ────────────────────────────────────────────────────────────
  const mahaDashas = kundali.dashas.filter(d => d.level === 'maha');

  // Shadbala quality map
  const shadbalaQuality: Record<string, 'strong' | 'avg' | 'weak'> = {};
  const shadbalaSynthesisScore: Record<string, number> = {};
  if (kundali.fullShadbala && kundali.fullShadbala.length > 0) {
    const avg = kundali.fullShadbala.reduce((s, p) => s + p.rupas, 0) / kundali.fullShadbala.length;
    for (const p of kundali.fullShadbala) {
      const ratio = p.rupas / (avg || 1);
      shadbalaQuality[p.planet] = ratio >= 1.15 ? 'strong' : ratio <= 0.85 ? 'weak' : 'avg';
      shadbalaSynthesisScore[p.planet] = Math.round(Math.min(100, ratio * 50));
    }
  }

  // Yoga lords — which planets are involved in strong/present yogas
  const yogaLordPlanets = new Set<string>();
  const yogaNamesByPlanet: Record<string, string[]> = {};
  const yogaNamesByPlanetHi: Record<string, string[]> = {};
  if (kundali.yogasComplete) {
    for (const yoga of kundali.yogasComplete) {
      if (!yoga.present || yoga.strength === 'Weak') continue;
      if (!yoga.isAuspicious) continue;
      // Extract planet names from yoga formation rule (approximate: look for GRAHA names)
      const PLANET_NAMES = ['Sun','Moon','Mars','Mercury','Jupiter','Venus','Saturn','Rahu','Ketu'];
      for (const pn of PLANET_NAMES) {
        if (yoga.formationRule.en.includes(pn) || yoga.name.en.includes(pn)) {
          yogaLordPlanets.add(pn);
          yogaNamesByPlanet[pn] = yogaNamesByPlanet[pn] || [];
          yogaNamesByPlanetHi[pn] = yogaNamesByPlanetHi[pn] || [];
          if (!yogaNamesByPlanet[pn].includes(yoga.name.en)) {
            yogaNamesByPlanet[pn].push(yoga.name.en.replace(' Yoga','').slice(0,12));
            yogaNamesByPlanetHi[pn].push(yoga.name.hi.slice(0, 8));
          }
        }
      }
    }
  }

  const dashas: DashaEntry[] = mahaDashas.map(d => {
    const startYear = dateToFracYear(d.startDate);
    const endYear = dateToFracYear(d.endDate);
    const quality = shadbalaQuality[d.planet] ?? 'avg';
    const hasYoga = yogaLordPlanets.has(d.planet);
    const baseScore = shadbalaSynthesisScore[d.planet] ?? 50;
    return { planet: d.planet, startYear, endYear, quality, hasYoga, synthesisScore: baseScore };
  });

  // ── Sade Sati ──────────────────────────────────────────────────────────────
  const sadeSatiPeriods: SadeSatiPeriod[] = (kundali.sadeSati?.allCycles ?? []).map(c => ({
    startYear: c.startYear,
    endYear: c.endYear,
    phases: c.phases,
  }));

  // ── Yoga periods (overlap of dasha with yoga lord) ─────────────────────────
  const yogaPeriods: YogaPeriod[] = [];
  for (const d of dashas) {
    if (!d.hasYoga) continue;
    const names = yogaNamesByPlanet[d.planet] ?? [];
    const namesHi = yogaNamesByPlanetHi[d.planet] ?? [];
    yogaPeriods.push({
      startYear: d.startYear,
      endYear: d.endYear,
      name: names[0] ?? 'Yoga',
      nameHi: namesHi[0] ?? 'योग',
    });
  }

  // ── Jupiter and Saturn transit computation ─────────────────────────────────
  const JUP_SPEED = 0.0831; // deg/day
  const JUP_PERIOD_DAYS = 360 / JUP_SPEED; // ~4332 days

  const SAT_SPEED = 0.0335;
  const SAT_PERIOD_DAYS = 360 / SAT_SPEED; // ~10746 days

  const jupPlanet = kundali.planets.find(p => p.planet.id === 4);
  const satPlanet = kundali.planets.find(p => p.planet.id === 6);
  const rahuPlanet = kundali.planets.find(p => p.planet.id === 7);

  const jupBirthLong = jupPlanet?.longitude ?? 0;
  const satBirthLong = satPlanet?.longitude ?? 0;
  const rahuBirthLong = rahuPlanet?.longitude ?? 0;

  // Jupiter → Yogi Point transits
  const jupiterYogiTransits: JupiterTransitEvent[] = [];
  if (kundali.sphutas) {
    const yogiDeg = kundali.sphutas.yogiPoint.degree;
    let delta = norm360(yogiDeg - jupBirthLong);
    let daysToFirst = delta / JUP_SPEED;
    while (daysToFirst < YEARS * 365.25) {
      const yr = birthYear + daysToFirst / 365.25;
      const windowYears = (5 / JUP_SPEED) / 365.25;
      jupiterYogiTransits.push({
        year: yr,
        windowYears,
        type: 'positive',
        icon: '⭐',
        title: `Jupiter → Yogi Point (${fmtYear(yr)})`,
        titleHi: `बृहस्पति → योगी बिंदु (${fmtYear(yr)})`,
        desc: 'Jupiter crosses your most auspicious degree. Major positive window for career, fortune, and spiritual growth.',
        descHi: 'बृहस्पति आपके सबसे शुभ बिंदु को पार करता है। करियर, भाग्य और आध्यात्मिक विकास की प्रमुख सकारात्मक खिड़की।',
        yearLabel: fmtYear(yr - windowYears / 2) + ' – ' + fmtYear(yr + windowYears / 2),
        label: [`⭐ Jupiter → Yogi Point`, fmtYear(yr)],
        labelHi: [`⭐ बृहस्पति → योगी बिंदु`, fmtYear(yr)],
        trackY: T.jupiter.y + T.jupiter.h / 2,
      });
      daysToFirst += JUP_PERIOD_DAYS;
    }
  }

  // Jupiter returns
  const jupiterReturns: number[] = [];
  let jrDays = JUP_PERIOD_DAYS;
  while (jrDays < YEARS * 365.25) {
    jupiterReturns.push(birthYear + jrDays / 365.25);
    jrDays += JUP_PERIOD_DAYS;
  }

  // Saturn → Avayogi transits
  const saturnAvayogiTransits: JupiterTransitEvent[] = [];
  if (kundali.sphutas) {
    const avayogiDeg = kundali.sphutas.avayogiPoint.degree;
    let delta = norm360(avayogiDeg - satBirthLong);
    let daysToFirst = delta / SAT_SPEED;
    while (daysToFirst < YEARS * 365.25) {
      const yr = birthYear + daysToFirst / 365.25;
      const windowYears = (5 / SAT_SPEED) / 365.25;
      saturnAvayogiTransits.push({
        year: yr,
        windowYears,
        type: 'challenging',
        icon: '⚠',
        title: `Saturn → Avayogi Point (${fmtYear(yr)})`,
        titleHi: `शनि → अवयोगी बिंदु (${fmtYear(yr)})`,
        desc: 'Saturn crosses your most challenging degree. Increased pressure, but also potential for breakthrough discipline.',
        descHi: 'शनि आपके सबसे चुनौतीपूर्ण बिंदु को पार करता है। बाधाएं, किन्तु अनुशासन से सफलता।',
        yearLabel: fmtYear(yr - windowYears / 2) + ' – ' + fmtYear(yr + windowYears / 2),
        label: [`⚠ Saturn → Avayogi`, fmtYear(yr)],
        labelHi: [`⚠ शनि → अवयोगी`, fmtYear(yr)],
        trackY: T.saturn.y + T.saturn.h / 2,
      });
      daysToFirst += SAT_PERIOD_DAYS;
    }
  }

  // Saturn returns
  const saturnReturns: number[] = [];
  let srDays = SAT_PERIOD_DAYS;
  while (srDays < YEARS * 365.25) {
    saturnReturns.push(birthYear + srDays / 365.25);
    srDays += SAT_PERIOD_DAYS;
  }

  // Rahu axis shifts (every ~1.55 years, retrograde)
  const RAHU_SIGN_PERIOD_DAYS = (360 / 12) / 0.0529; // ~566 days
  const rahuAxisShifts: number[] = [];
  const degInSign = rahuBirthLong % 30;
  let raDays = degInSign / 0.0529;
  while (raDays < YEARS * 365.25) {
    rahuAxisShifts.push(birthYear + raDays / 365.25);
    raDays += RAHU_SIGN_PERIOD_DAYS;
  }

  // ── Ashtakavarga heat ──────────────────────────────────────────────────────
  const ashtakaHeat: AshtakaSegment[] = [];
  if (kundali.ashtakavarga?.savTable) {
    for (let i = 0; i < YEARS; i++) {
      const yr = birthYear + i;
      const days = i * 365.25;
      const jupLong = norm360(jupBirthLong + JUP_SPEED * days);
      const jupSign = Math.floor(jupLong / 30) % 12;
      const score = kundali.ashtakavarga.savTable[jupSign] ?? 28;
      ashtakaHeat.push({ year: yr, score });
    }
  }

  // ── Synthesis scores per dasha ─────────────────────────────────────────────
  // Base: shadbala quality (0-100)
  // Modifiers:
  //   +15 if major yoga active
  //   -25 if Sade Sati peak overlapping
  //   -15 if Sade Sati rising/setting overlapping
  //   +20 if Jupiter Yogi transit in window
  //   -15 if Saturn Avayogi transit in window
  const synthesisScores: SynthesisScore[] = dashas.map(d => {
    let score = shadbalaSynthesisScore[d.planet] ?? 50;
    if (d.hasYoga) score += 15;
    // Sade Sati overlap
    for (const ss of sadeSatiPeriods) {
      if (d.startYear < ss.endYear + 1 && d.endYear > ss.startYear) {
        const peakPhase = ss.phases?.find(p => p.phase === 'peak');
        if (peakPhase && d.startYear < peakPhase.endYear + 1 && d.endYear > peakPhase.startYear) {
          score -= 25;
        } else {
          score -= 15;
        }
      }
    }
    // Jupiter Yogi in window — cap at +20 per dasha regardless of how many transits occur
    const hasJupYogi = jupiterYogiTransits.some(jt => jt.year >= d.startYear && jt.year <= d.endYear);
    if (hasJupYogi) score += 20;
    // Saturn Avayogi in window — cap at -15 per dasha
    const hasSatAvayogi = saturnAvayogiTransits.some(st => st.year >= d.startYear && st.year <= d.endYear);
    if (hasSatAvayogi) score -= 15;
    score = Math.max(5, Math.min(95, score));
    return { startYear: d.startYear, endYear: d.endYear, score };
  });

  // Update dasha synthesisScore
  for (let i = 0; i < dashas.length; i++) {
    dashas[i].synthesisScore = synthesisScores[i]?.score ?? 50;
  }

  // ── Key periods list ───────────────────────────────────────────────────────
  const allEvents: TimelineEvent[] = [
    ...jupiterYogiTransits,
    ...saturnAvayogiTransits,
    // Notable dasha starts — deduplicated: one event per dasha (strong OR yoga, not both)
    ...dashas
      .filter(d => d.quality === 'strong' || d.hasYoga)
      .map(d => {
        const isStrong = d.quality === 'strong';
        const yogaNames = yogaNamesByPlanet[d.planet]?.slice(0, 2).join(', ') ?? '';
        const yogaNamesHi = yogaNamesByPlanetHi[d.planet]?.slice(0, 2).join(', ') ?? '';
        const suffix = isStrong && d.hasYoga ? ` — ★ + ${yogaNames || 'Yoga'}` : isStrong ? ' — ★ Strong' : ` — ${yogaNames || 'Yoga'}`;
        const suffixHi = isStrong && d.hasYoga ? ` — ★ + ${yogaNamesHi || 'योग'}` : isStrong ? ' — ★ बलवान' : ` — ${yogaNamesHi || 'योग'}`;
        return {
          year: d.startYear,
          type: 'positive' as const,
          icon: isStrong && d.hasYoga ? '🌟' : d.hasYoga ? '◆' : '✦',
          title: `${d.planet} Mahadasha${suffix}`,
          titleHi: `${PLANET_HI[d.planet] ?? d.planet} महादशा${suffixHi}`,
          desc: `${isStrong ? `Strong ${d.planet} (above-average Shadbala). ` : ''}${d.hasYoga ? `Major yoga involving ${d.planet} activates.` : ''}`,
          descHi: `${isStrong ? `बलवान ${PLANET_HI[d.planet] ?? d.planet} (षड्बल औसत से अधिक)। ` : ''}${d.hasYoga ? `${PLANET_HI[d.planet] ?? d.planet} से सम्बद्ध प्रमुख योग सक्रिय।` : ''}`,
          yearLabel: fmtYear(d.startYear),
          label: [`${d.planet} Dasha begins`, fmtYear(d.startYear)],
          labelHi: [`${PLANET_HI[d.planet] ?? d.planet} दशा`, fmtYear(d.startYear)],
          windowYears: 0,
          trackY: T.dasha.y + T.dasha.h / 2,
        };
      }),
    // Sade Sati starts
    ...sadeSatiPeriods.map(ss => ({
      year: ss.startYear,
      type: 'challenging' as const,
      icon: '🪐',
      title: `Sade Sati begins (${ss.startYear}–${ss.endYear})`,
      titleHi: `साढ़े साती आरम्भ (${ss.startYear}–${ss.endYear})`,
      desc: 'Saturn begins its 7.5-year transit over your Moon sign. Pressure on mind and emotions, but also deep maturation.',
      descHi: 'शनि चन्द्र राशि पर 7.5 वर्षीय गोचर आरम्भ करता है। मानसिक दबाव, किन्तु गहन परिपक्वता।',
      yearLabel: String(ss.startYear),
      label: ['Sade Sati begins', String(ss.startYear)],
      labelHi: ['साढ़े साती आरम्भ', String(ss.startYear)],
      windowYears: 0,
      trackY: T.sadesati.y + T.sadesati.h / 2,
    })),
    // Saturn returns
    ...saturnReturns.map(yr => ({
      year: yr,
      type: 'neutral' as const,
      icon: '♄',
      title: `Saturn Return (${fmtYear(yr)})`,
      titleHi: `शनि वापसी (${fmtYear(yr)})`,
      desc: 'Saturn returns to its birth position — a major life checkpoint. Reality restructuring, accountability, maturity milestone.',
      descHi: 'शनि जन्म स्थिति पर लौटता है — जीवन का बड़ा पड़ाव। वास्तविकता पुनर्गठन, जवाबदेही।',
      yearLabel: fmtYear(yr),
      label: ['Saturn Return', fmtYear(yr)],
      labelHi: ['शनि वापसी', fmtYear(yr)],
      windowYears: 0,
      trackY: T.saturn.y + T.saturn.h / 2,
    })),
  ];

  // Sort by year
  allEvents.sort((a, b) => a.year - b.year);

  return {
    birthYear,
    todayYear,
    todayX,
    dashas,
    sadeSatiPeriods,
    yogaPeriods,
    jupiterYogiTransits,
    jupiterReturns,
    saturnAvayogiTransits,
    saturnReturns,
    rahuAxisShifts,
    ashtakaHeat,
    synthesisScores,
    keyPeriods: allEvents,
    events: allEvents,
  };
}
