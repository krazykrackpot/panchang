'use client';

/**
 * DashaTimeline — Animated D3-powered interactive horizontal timeline
 * showing the full Vimshottari Dasha cycle across 3 nested bands:
 *   1. Mahadasha  (outer, ~40px tall)
 *   2. Antardasha (middle, ~28px tall)
 *   3. Pratyantardasha (inner, ~18px tall — only shown when zoom ≥ 3x)
 *
 * D3 is used for scaleTime + zoom math only — DOM is React SVG.
 *
 * NOTE: d3-selection / d3-zoom direct DOM attachment is avoided here;
 *       we use d3.zoom() to compute transform math but apply pointer
 *       events via React handlers so we don't fight the React tree.
 */

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import * as d3 from 'd3';
import type { DashaEntry } from '@/types/kundali';
import { tl } from '@/lib/utils/trilingual';
import DashaTimelineDetail from './DashaTimelineDetail';

/* ─── Planet colors ──────────────────────────────────────────────────────── */
const PLANET_COLORS: Record<string, string> = {
  Sun: '#FF6B35', Moon: '#C0C0C0', Mars: '#DC143C', Mercury: '#50C878',
  Jupiter: '#FFD700', Venus: '#FF69B4', Saturn: '#4169E1', Rahu: '#8B6914', Ketu: '#808080',
};

function planetColor(name: string) {
  return PLANET_COLORS[name] ?? '#d4a853';
}

/* ─── Layout constants ───────────────────────────────────────────────────── */
const MAHA_Y = 0;
const MAHA_H = 40;
const ANTAR_Y = 44;
const ANTAR_H = 28;
const PRATYA_Y = 76;
const PRATYA_H = 18;
const LABEL_H = 22;
const RULER_H = 18;
const SVG_H = PRATYA_Y + PRATYA_H + LABEL_H + RULER_H + 4;  // ~102px

const MIN_ZOOM = 1;
const MAX_ZOOM = 60;
const PRATYA_ZOOM_THRESHOLD = 3;
// Minimum pixel width before a segment label is rendered
const MIN_LABEL_PX = 18;

/* ─── Helpers ────────────────────────────────────────────────────────────── */
function parseDate(iso: string): Date {
  // Use Date.UTC to avoid local-timezone interpretation (Lesson L)
  const [y, m, d] = iso.split('T')[0].split('-').map(Number);
  return new Date(Date.UTC(y, m - 1, d));
}

function addYears(date: Date, years: number): Date {
  // Millisecond arithmetic to avoid fractional-year truncation (Lesson P)
  return new Date(date.getTime() + years * 365.25 * 24 * 60 * 60 * 1000);
}

function yearTick(date: Date): string {
  return String(date.getUTCFullYear());
}

/* ─── Props ──────────────────────────────────────────────────────────────── */
interface DashaTimelineProps {
  dashas: DashaEntry[];
  birthDate: string;
  locale: string;
}

/* ─── Segment type for rendering ─────────────────────────────────────────── */
interface Seg {
  entry: DashaEntry;
  x: number;
  w: number;
  y: number;
  h: number;
  color: string;
  isCurrent: boolean;
  level: 'maha' | 'antar' | 'pratyantar';
}

export default function DashaTimeline({ dashas, birthDate, locale }: DashaTimelineProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(800);
  const [transform, setTransform] = useState<d3.ZoomTransform>(d3.zoomIdentity);
  const [selected, setSelected] = useState<DashaEntry | null>(null);
  const [isPanning, setIsPanning] = useState(false);
  // Store the D3 zoom instance so we can call .scaleBy / .translateBy programmatically
  const zoomRef = useRef<d3.ZoomBehavior<SVGSVGElement, unknown> | null>(null);
  // Drag state
  const dragRef = useRef<{ startX: number; startTx: number } | null>(null);

  /* Resize observer */
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const ro = new ResizeObserver(entries => {
      const w = entries[0]?.contentRect.width ?? 800;
      if (w > 0) setWidth(w);
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  /* Parse dates — memoised */
  const birth = useMemo(() => parseDate(birthDate || '1990-01-01'), [birthDate]);
  const cycleEnd = useMemo(() => addYears(birth, 120), [birth]);
  const today = useMemo(() => new Date(), []);

  /* Base scale: full 120-year cycle across the available width */
  const baseScale = useMemo(
    () => d3.scaleTime().domain([birth, cycleEnd]).range([0, width]),
    [birth, cycleEnd, width],
  );

  /* Zoomed scale derived from transform */
  const scale = useMemo(
    () => transform.rescaleX(baseScale),
    [transform, baseScale],
  );

  /* D3 zoom setup — attach once per SVG mount */
  useEffect(() => {
    const svgEl = svgRef.current;
    if (!svgEl) return;

    const zoom = d3.zoom<SVGSVGElement, unknown>()
      .scaleExtent([MIN_ZOOM, MAX_ZOOM])
      .translateExtent([[0, 0], [width, SVG_H]])
      .on('zoom', event => {
        setTransform(event.transform);
      });

    zoomRef.current = zoom;

    // Attach wheel zoom to SVG — drag is handled via React pointer events
    const sel = d3.select(svgEl);
    sel.call(zoom);

    // Disable default double-click zoom; we handle clicks for selection
    sel.on('dblclick.zoom', null);

    return () => {
      sel.on('.zoom', null);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [svgRef.current, width]);

  /* Update zoom translate extent when width changes */
  useEffect(() => {
    const svgEl = svgRef.current;
    if (!svgEl || !zoomRef.current) return;
    zoomRef.current.translateExtent([[0, 0], [width * transform.k, SVG_H]]);
  }, [width, transform.k]);

  /* Build segments from Mahadasha/Antardasha/Pratyantardasha entries */
  const { mahaSegs, antarSegs, pratyaSegs } = useMemo(() => {
    const now = today;
    const maha: Seg[] = [];
    const antar: Seg[] = [];
    const pratya: Seg[] = [];

    const addSeg = (
      entry: DashaEntry,
      y: number,
      h: number,
      level: 'maha' | 'antar' | 'pratyantar',
      arr: Seg[],
    ) => {
      const start = parseDate(entry.startDate);
      const end = parseDate(entry.endDate);
      const x0 = scale(start);
      const x1 = scale(end);
      const w = Math.max(x1 - x0, 0);
      arr.push({
        entry,
        x: x0,
        w,
        y,
        h,
        color: planetColor(entry.planet),
        isCurrent: now >= start && now <= end,
        level,
      });
    };

    for (const m of dashas) {
      if (m.level !== 'maha') continue;
      addSeg(m, MAHA_Y, MAHA_H, 'maha', maha);
      if (m.subPeriods) {
        for (const a of m.subPeriods) {
          if (a.level !== 'antar') continue;
          addSeg(a, ANTAR_Y, ANTAR_H, 'antar', antar);
          if (a.subPeriods) {
            for (const p of a.subPeriods) {
              if (p.level !== 'pratyantar') continue;
              addSeg(p, PRATYA_Y, PRATYA_H, 'pratyantar', pratya);
            }
          }
        }
      }
    }

    return { mahaSegs: maha, antarSegs: antar, pratyaSegs: pratya };
  }, [dashas, scale, today]);

  /* "NOW" line x position */
  const nowX = useMemo(() => {
    if (today < birth || today > cycleEnd) return null;
    return scale(today);
  }, [scale, today, birth, cycleEnd]);

  /* Year ruler ticks */
  const ticks = useMemo(() => {
    const zoomed = transform.k;
    // Increase tick density as zoom increases
    const step = zoomed >= 20 ? 1 : zoomed >= 8 ? 2 : zoomed >= 3 ? 5 : 10;
    const birthYear = birth.getUTCFullYear();
    const endYear = cycleEnd.getUTCFullYear();
    const years: Date[] = [];
    for (let y = birthYear; y <= endYear; y += step) {
      years.push(new Date(Date.UTC(y, 0, 1)));
    }
    return years.map(d => ({ date: d, x: scale(d), label: yearTick(d) }));
  }, [scale, birth, cycleEnd, transform.k]);

  /* Pointer-drag panning */
  const onPointerDown = useCallback((e: React.PointerEvent<SVGSVGElement>) => {
    if (e.button !== 0) return;
    dragRef.current = { startX: e.clientX, startTx: transform.x };
    setIsPanning(false);
    (e.target as Element).setPointerCapture(e.pointerId);
  }, [transform.x]);

  const onPointerMove = useCallback((e: React.PointerEvent<SVGSVGElement>) => {
    if (!dragRef.current) return;
    const dx = e.clientX - dragRef.current.startX;
    if (Math.abs(dx) > 3) setIsPanning(true);
    const svgEl = svgRef.current;
    if (!svgEl || !zoomRef.current) return;
    const newTx = dragRef.current.startTx + dx;
    const newT = d3.zoomIdentity.translate(newTx, 0).scale(transform.k);
    d3.select(svgEl).call(zoomRef.current.transform, newT);
  }, [transform.k]);

  const onPointerUp = useCallback(() => {
    dragRef.current = null;
  }, []);

  /* Click on segment (only fires if not panning) */
  const handleSegClick = useCallback((entry: DashaEntry, e: React.MouseEvent) => {
    e.stopPropagation();
    if (isPanning) return;
    setSelected(prev => prev === entry ? null : entry);
  }, [isPanning]);

  /* Clear selection on SVG background click */
  const handleSvgClick = useCallback(() => {
    if (!isPanning) setSelected(null);
  }, [isPanning]);

  /* Zoom controls */
  const doZoom = useCallback((factor: number) => {
    const svgEl = svgRef.current;
    if (!svgEl || !zoomRef.current) return;
    d3.select(svgEl).call(zoomRef.current.scaleBy, factor, [width / 2, SVG_H / 2]);
  }, [width]);

  const resetZoom = useCallback(() => {
    const svgEl = svgRef.current;
    if (!svgEl || !zoomRef.current) return;
    d3.select(svgEl).call(zoomRef.current.transform, d3.zoomIdentity);
  }, []);

  /* Scroll to TODAY */
  const scrollToNow = useCallback(() => {
    if (nowX === null) return;
    const svgEl = svgRef.current;
    if (!svgEl || !zoomRef.current) return;
    const targetTx = width / 2 - nowX;
    const newT = d3.zoomIdentity.translate(targetTx, 0).scale(transform.k);
    d3.select(svgEl).call(zoomRef.current.transform, newT);
  }, [nowX, width, transform.k]);

  const showPratya = transform.k >= PRATYA_ZOOM_THRESHOLD;

  /* ─── Render ─────────────────────────────────────────────────────────── */
  return (
    <div className="rounded-2xl border border-gold-primary/15 bg-gradient-to-br from-[#1a1040]/40 to-[#0a0e27] p-4">
      {/* Header row */}
      <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
        <h4 className="text-gold-light text-sm font-semibold">Vimshottari Dasha Timeline</h4>
        <div className="flex items-center gap-2">
          <button
            onClick={scrollToNow}
            className="px-2 py-1 rounded-lg text-xs bg-gold-primary/15 text-gold-primary hover:bg-gold-primary/25 transition-colors border border-gold-primary/20"
          >
            Today
          </button>
          <button
            onClick={() => doZoom(2)}
            className="w-7 h-7 rounded-lg flex items-center justify-center text-sm bg-white/5 hover:bg-white/10 text-text-primary transition-colors"
            aria-label="Zoom in"
          >+</button>
          <button
            onClick={() => doZoom(0.5)}
            className="w-7 h-7 rounded-lg flex items-center justify-center text-sm bg-white/5 hover:bg-white/10 text-text-primary transition-colors"
            aria-label="Zoom out"
          >−</button>
          <button
            onClick={resetZoom}
            className="px-2 py-1 rounded-lg text-xs bg-white/5 hover:bg-white/10 text-text-secondary transition-colors"
          >Reset</button>
        </div>
      </div>

      {/* Band legend */}
      <div className="flex items-center gap-4 mb-2 flex-wrap">
        {[
          { label: 'Mahadasha', h: MAHA_H },
          { label: 'Antardasha', h: ANTAR_H },
          { label: `Pratyantardasha ${!showPratya ? '(zoom ×3 to show)' : ''}`, h: PRATYA_H },
        ].map(({ label, h }) => (
          <span key={label} className="flex items-center gap-1.5 text-[11px] text-text-secondary">
            <span
              className="inline-block rounded-sm bg-gold-primary/40"
              style={{ width: 14, height: Math.max(4, h / 5) }}
            />
            {label}
          </span>
        ))}
        <span className="flex items-center gap-1.5 text-[11px] text-text-secondary">
          <span className="inline-block w-0.5 h-3 bg-gold-primary" />
          Now
        </span>
      </div>

      {/* SVG timeline */}
      <div ref={containerRef} className="w-full overflow-hidden rounded-xl" style={{ height: SVG_H }}>
        <svg
          ref={svgRef}
          width={width}
          height={SVG_H}
          style={{ cursor: isPanning ? 'grabbing' : 'grab', display: 'block' }}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerUp}
          onClick={handleSvgClick}
        >
          {/* Background */}
          <rect width={width} height={SVG_H} fill="transparent" />

          {/* ── Mahadasha band ──────────────────────────────────────────── */}
          <g>
            {mahaSegs.map((seg, i) => (
              <g key={`maha-${i}`} onClick={e => handleSegClick(seg.entry, e)} style={{ cursor: 'pointer' }}>
                <rect
                  x={seg.x + 0.5}
                  y={seg.y + 0.5}
                  width={Math.max(seg.w - 1, 0)}
                  height={seg.h}
                  rx={3}
                  fill={seg.color}
                  fillOpacity={seg.isCurrent ? 0.55 : 0.28}
                  stroke={seg.color}
                  strokeWidth={0.5}
                  strokeOpacity={0.7}
                />
                {/* Highlight border for selected */}
                {selected === seg.entry && (
                  <rect
                    x={seg.x + 0.5}
                    y={seg.y + 0.5}
                    width={Math.max(seg.w - 1, 0)}
                    height={seg.h}
                    rx={3}
                    fill="none"
                    stroke="#f0d48a"
                    strokeWidth={2}
                  />
                )}
                {/* Planet label */}
                {seg.w > MIN_LABEL_PX && (
                  <text
                    x={seg.x + seg.w / 2}
                    y={seg.y + seg.h / 2 + 4.5}
                    textAnchor="middle"
                    fontSize={11}
                    fontWeight={seg.isCurrent ? 700 : 500}
                    fill={seg.isCurrent ? '#f0d48a' : '#e6e2d8'}
                    style={{ pointerEvents: 'none', userSelect: 'none' }}
                  >
                    {seg.w > 50 ? tl(seg.entry.planetName, locale) : seg.entry.planet.slice(0, 3)}
                  </text>
                )}
              </g>
            ))}
          </g>

          {/* ── Antardasha band ──────────────────────────────────────────── */}
          <g>
            {antarSegs.map((seg, i) => (
              <g key={`antar-${i}`} onClick={e => handleSegClick(seg.entry, e)} style={{ cursor: 'pointer' }}>
                <rect
                  x={seg.x + 0.5}
                  y={seg.y + 0.5}
                  width={Math.max(seg.w - 1, 0)}
                  height={seg.h}
                  rx={2}
                  fill={seg.color}
                  fillOpacity={seg.isCurrent ? 0.5 : 0.22}
                  stroke={seg.color}
                  strokeWidth={0.5}
                  strokeOpacity={0.6}
                />
                {selected === seg.entry && (
                  <rect
                    x={seg.x + 0.5}
                    y={seg.y + 0.5}
                    width={Math.max(seg.w - 1, 0)}
                    height={seg.h}
                    rx={2}
                    fill="none"
                    stroke="#f0d48a"
                    strokeWidth={1.5}
                  />
                )}
                {seg.w > MIN_LABEL_PX && (
                  <text
                    x={seg.x + seg.w / 2}
                    y={seg.y + seg.h / 2 + 4}
                    textAnchor="middle"
                    fontSize={9}
                    fontWeight={seg.isCurrent ? 700 : 400}
                    fill={seg.isCurrent ? '#f0d48a' : '#8a8478'}
                    style={{ pointerEvents: 'none', userSelect: 'none' }}
                  >
                    {seg.w > 40 ? seg.entry.planet.slice(0, 3) : ''}
                  </text>
                )}
              </g>
            ))}
          </g>

          {/* ── Pratyantardasha band (only when zoomed in) ──────────────── */}
          {showPratya && (
            <g>
              {pratyaSegs.map((seg, i) => (
                <g key={`pratya-${i}`} onClick={e => handleSegClick(seg.entry, e)} style={{ cursor: 'pointer' }}>
                  <rect
                    x={seg.x + 0.5}
                    y={seg.y + 0.5}
                    width={Math.max(seg.w - 1, 0)}
                    height={seg.h}
                    rx={1.5}
                    fill={seg.color}
                    fillOpacity={seg.isCurrent ? 0.45 : 0.18}
                    stroke={seg.color}
                    strokeWidth={0.4}
                    strokeOpacity={0.5}
                  />
                  {selected === seg.entry && (
                    <rect
                      x={seg.x + 0.5}
                      y={seg.y + 0.5}
                      width={Math.max(seg.w - 1, 0)}
                      height={seg.h}
                      rx={1.5}
                      fill="none"
                      stroke="#f0d48a"
                      strokeWidth={1.5}
                    />
                  )}
                </g>
              ))}
            </g>
          )}

          {/* ── Year ruler ───────────────────────────────────────────────── */}
          <g transform={`translate(0, ${PRATYA_Y + PRATYA_H + 4})`}>
            {/* Ruler baseline */}
            <line x1={0} y1={0} x2={width} y2={0} stroke="#8a8478" strokeOpacity={0.3} strokeWidth={0.5} />
            {ticks.map(({ x, label }) => (
              <g key={label + x}>
                <line x1={x} y1={0} x2={x} y2={4} stroke="#8a8478" strokeOpacity={0.4} strokeWidth={0.5} />
                <text
                  x={x}
                  y={14}
                  textAnchor="middle"
                  fontSize={9}
                  fill="#8a8478"
                  fillOpacity={0.7}
                  style={{ userSelect: 'none' }}
                >{label}</text>
              </g>
            ))}
          </g>

          {/* ── NOW line ────────────────────────────────────────────────── */}
          {nowX !== null && nowX >= 0 && nowX <= width && (
            <g>
              <line
                x1={nowX}
                y1={MAHA_Y}
                x2={nowX}
                y2={PRATYA_Y + PRATYA_H + 4}
                stroke="#d4a853"
                strokeWidth={1.5}
                strokeDasharray="3 2"
              />
              {/* Pulsing circle at top */}
              <circle cx={nowX} cy={MAHA_Y + 4} r={4} fill="#d4a853" opacity={0.9}>
                <animate attributeName="opacity" values="0.9;0.3;0.9" dur="2s" repeatCount="indefinite" />
              </circle>
              {/* NOW label */}
              <text
                x={nowX + 4}
                y={MAHA_Y + 13}
                fontSize={9}
                fontWeight={600}
                fill="#f0d48a"
                style={{ userSelect: 'none' }}
              >NOW</text>
            </g>
          )}
        </svg>
      </div>

      {/* Zoom hint */}
      <p className="text-text-secondary/50 text-[10px] mt-1.5 text-center">
        Scroll to zoom · Drag to pan · Click segment for details
        {!showPratya && <span> · Zoom ×3 for Pratyantardasha</span>}
      </p>

      {/* Detail panel */}
      {selected && (
        <div className="mt-3">
          <DashaTimelineDetail
            period={selected}
            locale={locale}
            onClose={() => setSelected(null)}
          />
        </div>
      )}
    </div>
  );
}
