'use client';

/**
 * UnifiedTimeline — Combines Vimshottari Dasha bands with transit event
 * markers (from computeKeyDates) on a single horizontal timeline.
 *
 * D3 is used for scaleTime + zoom math only — DOM is React SVG.
 * Standalone component — does NOT import or extend DashaTimeline.tsx.
 */

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import * as d3 from 'd3';
import { Calendar, ZoomIn, ZoomOut, RotateCcw, Sun, CircleDot } from 'lucide-react';
import type { DashaEntry } from '@/types/kundali';
import type { KeyDate, KeyDateType, KeyDateImpact } from '@/lib/kundali/domain-synthesis/key-dates';
import { tl } from '@/lib/utils/trilingual';

/* ─── Planet colors (shared with DashaTimeline) ────────────────────────── */
const PLANET_COLORS: Record<string, string> = {
  Sun: '#FF6B35', Moon: '#C0C0C0', Mars: '#DC143C', Mercury: '#50C878',
  Jupiter: '#FFD700', Venus: '#FF69B4', Saturn: '#4169E1', Rahu: '#8B6914', Ketu: '#808080',
};

function planetColor(name: string) {
  return PLANET_COLORS[name] ?? '#d4a853';
}

/* ─── Impact → marker colors ──────────────────────────────────────────── */
const IMPACT_COLORS: Record<KeyDateImpact, string> = {
  positive: '#34d399',     // emerald-400
  challenging: '#f87171',  // red-400
  transformative: '#a78bfa', // violet-400
  neutral: '#d4a853',      // gold-primary
};

/* ─── Type → marker shape / label ──────────────────────────────────────── */
const TYPE_META: Record<KeyDateType, { shape: 'triangle' | 'diamond' | 'circle' | 'saturn'; label: string }> = {
  dasha:        { shape: 'diamond',  label: 'Dasha' },
  transit:      { shape: 'triangle', label: 'Transit' },
  eclipse:      { shape: 'circle',   label: 'Eclipse' },
  sadeSati:     { shape: 'saturn',   label: 'Sade Sati' },
  varshaphal:   { shape: 'circle',   label: 'Solar Return' },
  retroStation: { shape: 'triangle', label: 'Retro Station' },
  rahuKetuAxis: { shape: 'triangle', label: 'Rahu-Ketu' },
  dashaSandhi:  { shape: 'diamond',  label: 'Sandhi' },
  muhurta:      { shape: 'circle',   label: 'Muhurta' },
};

/* ─── Layout constants ─────────────────────────────────────────────────── */
const MAHA_Y = 0;
const MAHA_H = 40;
const ANTAR_Y = 44;
const ANTAR_H = 28;
const GAP = 10;
const MARKER_ROW_Y = ANTAR_Y + ANTAR_H + GAP;
const MARKER_H = 40;
const LABEL_AREA_H = 30;
const RULER_Y = MARKER_ROW_Y + MARKER_H + LABEL_AREA_H;
const RULER_H = 18;
const SVG_H = RULER_Y + RULER_H + 4;

const MIN_ZOOM = 1;
const MAX_ZOOM = 60;
const MIN_LABEL_PX = 18;
// If two markers are within this fraction of the timeline width, stack them
const OVERLAP_THRESHOLD = 0.03;

/* ─── Helpers ──────────────────────────────────────────────────────────── */
function parseDate(iso: string): Date {
  // Use Date.UTC to avoid local-timezone interpretation (Lesson L)
  const [y, m, dd] = iso.split('T')[0].split('-').map(Number);
  return new Date(Date.UTC(y, m - 1, dd));
}

function addYears(date: Date, years: number): Date {
  // Millisecond arithmetic to avoid fractional-year truncation (Lesson P)
  return new Date(date.getTime() + years * 365.25 * 24 * 60 * 60 * 1000);
}

function yearTick(date: Date): string {
  return String(date.getUTCFullYear());
}

function formatShortDate(iso: string, locale: string): string {
  const d = new Date(iso + 'T00:00:00');
  const isHi = locale === 'hi' || locale === 'sa';
  return d.toLocaleDateString(isHi ? 'hi-IN' : 'en-IN', {
    day: 'numeric', month: 'short', year: 'numeric',
  });
}

function daysFromNow(iso: string, locale: string): string {
  const diff = Math.ceil((new Date(iso + 'T00:00:00').getTime() - Date.now()) / 86400000);
  const isHi = locale === 'hi' || locale === 'sa';
  if (diff === 0) return isHi ? 'आज' : 'Today';
  if (diff === 1) return isHi ? 'कल' : 'Tomorrow';
  if (diff < 0) return isHi ? `${Math.abs(diff)} दिन पहले` : `${Math.abs(diff)}d ago`;
  return isHi ? `${diff} दिन` : `in ${diff}d`;
}

/* ─── Marker shape SVG paths ───────────────────────────────────────────── */
function MarkerShape({ shape, x, y, color, size = 8 }: {
  shape: 'triangle' | 'diamond' | 'circle' | 'saturn';
  x: number; y: number; color: string; size?: number;
}) {
  const s = size;
  switch (shape) {
    case 'triangle':
      // Downward triangle
      return (
        <polygon
          points={`${x},${y + s} ${x - s * 0.7},${y - s * 0.3} ${x + s * 0.7},${y - s * 0.3}`}
          fill={color} fillOpacity={0.85} stroke={color} strokeWidth={0.5}
        />
      );
    case 'diamond':
      return (
        <polygon
          points={`${x},${y - s} ${x + s * 0.6},${y} ${x},${y + s} ${x - s * 0.6},${y}`}
          fill={color} fillOpacity={0.85} stroke={color} strokeWidth={0.5}
        />
      );
    case 'saturn':
      // Saturn-like: circle with a small ring
      return (
        <g>
          <circle cx={x} cy={y} r={s * 0.55} fill={color} fillOpacity={0.85} />
          <ellipse cx={x} cy={y} rx={s * 0.85} ry={s * 0.3}
            fill="none" stroke={color} strokeWidth={1} strokeOpacity={0.7} />
        </g>
      );
    case 'circle':
    default:
      return (
        <circle cx={x} cy={y} r={s * 0.6} fill={color} fillOpacity={0.85}
          stroke={color} strokeWidth={0.5} />
      );
  }
}

/* ─── Segment type for rendering ─────────────────────────────────────── */
interface Seg {
  entry: DashaEntry;
  x: number;
  w: number;
  y: number;
  h: number;
  color: string;
  isCurrent: boolean;
  level: 'maha' | 'antar';
}

/* ─── Positioned marker for transit events ────────────────────────────── */
interface PositionedMarker {
  keyDate: KeyDate;
  x: number;
  row: number; // 0 = base row, 1 = stacked
  color: string;
  shape: 'triangle' | 'diamond' | 'circle' | 'saturn';
}

/* ─── Props ─────────────────────────────────────────────────────────────── */
interface UnifiedTimelineProps {
  dashas: DashaEntry[];
  keyDates: KeyDate[];
  locale: string;
  /** Current date highlighted */
  today?: Date;
}

export default function UnifiedTimeline({ dashas, keyDates, locale, today: todayProp }: UnifiedTimelineProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(800);
  const [transform, setTransform] = useState<d3.ZoomTransform>(d3.zoomIdentity);
  const [hoveredMarker, setHoveredMarker] = useState<KeyDate | null>(null);
  const [hoveredSeg, setHoveredSeg] = useState<DashaEntry | null>(null);
  const [tooltipPos, setTooltipPos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const zoomRef = useRef<d3.ZoomBehavior<SVGSVGElement, unknown> | null>(null);
  const dragRef = useRef<{ startX: number; startTx: number } | null>(null);

  const isHi = locale === 'hi' || locale === 'sa';

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

  /* Parse dates */
  const today = useMemo(() => todayProp ?? new Date(), [todayProp]);

  const { birth, cycleEnd } = useMemo(() => {
    if (!dashas.length) return { birth: new Date(), cycleEnd: addYears(new Date(), 120) };
    const firstStart = parseDate(dashas[0].startDate);
    return { birth: firstStart, cycleEnd: addYears(firstStart, 120) };
  }, [dashas]);

  /* Base scale */
  const baseScale = useMemo(
    () => d3.scaleTime().domain([birth, cycleEnd]).range([0, width]),
    [birth, cycleEnd, width],
  );

  /* Zoomed scale */
  const scale = useMemo(
    () => transform.rescaleX(baseScale),
    [transform, baseScale],
  );

  /* D3 zoom setup */
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
    const sel = d3.select(svgEl);
    sel.call(zoom);
    sel.on('dblclick.zoom', null);

    return () => { sel.on('.zoom', null); };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [svgRef.current, width]);

  /* Update zoom translate extent when width changes */
  useEffect(() => {
    if (!svgRef.current || !zoomRef.current) return;
    zoomRef.current.translateExtent([[0, 0], [width * transform.k, SVG_H]]);
  }, [width, transform.k]);

  /* Build dasha segments (Maha + Antar only) */
  const { mahaSegs, antarSegs } = useMemo(() => {
    const now = today;
    const maha: Seg[] = [];
    const antar: Seg[] = [];

    const addSeg = (
      entry: DashaEntry, y: number, h: number,
      level: 'maha' | 'antar', arr: Seg[],
    ) => {
      const start = parseDate(entry.startDate);
      const end = parseDate(entry.endDate);
      const x0 = scale(start);
      const x1 = scale(end);
      arr.push({
        entry, x: x0, w: Math.max(x1 - x0, 0), y, h,
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
        }
      }
    }

    return { mahaSegs: maha, antarSegs: antar };
  }, [dashas, scale, today]);

  /* Position transit markers with overlap avoidance */
  const markers = useMemo(() => {
    const result: PositionedMarker[] = [];
    const sortedDates = [...keyDates].sort((a, b) => a.date.localeCompare(b.date));

    for (const kd of sortedDates) {
      const d = parseDate(kd.date);
      const x = scale(d);
      // Skip markers outside the visible area
      if (x < -50 || x > width + 50) continue;

      const meta = TYPE_META[kd.type] ?? { shape: 'circle' as const, label: '' };
      const color = IMPACT_COLORS[kd.impact] ?? IMPACT_COLORS.neutral;

      // Check overlap with previously placed markers
      let row = 0;
      for (const placed of result) {
        if (Math.abs(placed.x - x) < width * OVERLAP_THRESHOLD && placed.row === row) {
          row = 1;
        }
      }

      result.push({ keyDate: kd, x, row, color, shape: meta.shape });
    }

    return result;
  }, [keyDates, scale, width]);

  /* "NOW" line x position */
  const nowX = useMemo(() => {
    if (today < birth || today > cycleEnd) return null;
    return scale(today);
  }, [scale, today, birth, cycleEnd]);

  /* Year ruler ticks */
  const ticks = useMemo(() => {
    const zoomed = transform.k;
    const step = zoomed >= 20 ? 1 : zoomed >= 8 ? 2 : zoomed >= 3 ? 5 : 10;
    const birthYear = birth.getUTCFullYear();
    const endYear = cycleEnd.getUTCFullYear();
    const years: Date[] = [];
    for (let y = birthYear; y <= endYear; y += step) {
      years.push(new Date(Date.UTC(y, 0, 1)));
    }
    return years.map(d => ({ date: d, x: scale(d), label: yearTick(d) }));
  }, [scale, birth, cycleEnd, transform.k]);

  /* Active context: current dasha + nearest upcoming key date */
  const activeContext = useMemo(() => {
    const now = today;
    const nowIso = now.toISOString().slice(0, 10);

    // Find current mahadasha
    let currentMaha: DashaEntry | null = null;
    let currentAntar: DashaEntry | null = null;
    for (const m of dashas) {
      if (m.level !== 'maha') continue;
      const s = parseDate(m.startDate);
      const e = parseDate(m.endDate);
      if (now >= s && now <= e) {
        currentMaha = m;
        if (m.subPeriods) {
          for (const a of m.subPeriods) {
            const as = parseDate(a.startDate);
            const ae = parseDate(a.endDate);
            if (now >= as && now <= ae) {
              currentAntar = a;
              break;
            }
          }
        }
        break;
      }
    }

    // Find active transit (most recent past key date of type transit)
    const pastTransits = keyDates.filter(kd =>
      kd.type === 'transit' && kd.date <= nowIso
    ).sort((a, b) => b.date.localeCompare(a.date));
    const activeTransit = pastTransits[0] ?? null;

    // Find next upcoming key date
    const upcoming = keyDates.filter(kd => kd.date > nowIso)
      .sort((a, b) => a.date.localeCompare(b.date));
    const nextEvent = upcoming[0] ?? null;

    return { currentMaha, currentAntar, activeTransit, nextEvent };
  }, [dashas, keyDates, today]);

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

  const scrollToNow = useCallback(() => {
    if (nowX === null) return;
    const svgEl = svgRef.current;
    if (!svgEl || !zoomRef.current) return;
    const targetTx = width / 2 - nowX;
    const newT = d3.zoomIdentity.translate(targetTx, 0).scale(transform.k);
    d3.select(svgEl).call(zoomRef.current.transform, newT);
  }, [nowX, width, transform.k]);

  /* Handle marker hover */
  const handleMarkerEnter = useCallback((kd: KeyDate, e: React.MouseEvent) => {
    if (isPanning) return;
    setHoveredMarker(kd);
    const rect = containerRef.current?.getBoundingClientRect();
    if (rect) {
      setTooltipPos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
    }
  }, [isPanning]);

  const handleSegEnter = useCallback((entry: DashaEntry, e: React.MouseEvent) => {
    if (isPanning) return;
    setHoveredSeg(entry);
    const rect = containerRef.current?.getBoundingClientRect();
    if (rect) {
      setTooltipPos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
    }
  }, [isPanning]);

  /* ─── Render ─────────────────────────────────────────────────────────── */
  return (
    <div className="rounded-2xl border border-gold-primary/15 bg-gradient-to-br from-[#1a1040]/40 to-[#0a0e27] p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-gold-primary" />
          <h4 className="text-gold-light text-sm font-semibold">
            {isHi ? 'दशा-गोचर समयरेखा' : 'Dasha-Transit Timeline'}
          </h4>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={scrollToNow}
            className="px-2 py-1 rounded-lg text-xs bg-gold-primary/15 text-gold-primary hover:bg-gold-primary/25 transition-colors border border-gold-primary/20"
          >
            {isHi ? 'आज' : 'Today'}
          </button>
          <button
            onClick={() => doZoom(2)}
            className="w-7 h-7 rounded-lg flex items-center justify-center bg-white/5 hover:bg-white/10 text-text-primary transition-colors"
            aria-label="Zoom in"
          >
            <ZoomIn className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => doZoom(0.5)}
            className="w-7 h-7 rounded-lg flex items-center justify-center bg-white/5 hover:bg-white/10 text-text-primary transition-colors"
            aria-label="Zoom out"
          >
            <ZoomOut className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={resetZoom}
            className="w-7 h-7 rounded-lg flex items-center justify-center bg-white/5 hover:bg-white/10 text-text-secondary transition-colors"
            aria-label="Reset zoom"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center gap-4 mb-2 flex-wrap">
        <span className="flex items-center gap-1.5 text-[11px] text-text-secondary">
          <span className="inline-block w-3.5 h-2 rounded-sm bg-gold-primary/40" />
          {isHi ? 'महादशा' : 'Mahadasha'}
        </span>
        <span className="flex items-center gap-1.5 text-[11px] text-text-secondary">
          <span className="inline-block w-3 h-1.5 rounded-sm bg-gold-primary/25" />
          {isHi ? 'अन्तर्दशा' : 'Antardasha'}
        </span>
        <span className="flex items-center gap-1.5 text-[11px] text-text-secondary">
          <svg width="10" height="10" viewBox="0 0 10 10"><polygon points="5,9 2,3 8,3" fill="#34d399" /></svg>
          {isHi ? 'गोचर' : 'Transit'}
        </span>
        <span className="flex items-center gap-1.5 text-[11px] text-text-secondary">
          <svg width="10" height="10" viewBox="0 0 10 10"><polygon points="5,1 8,5 5,9 2,5" fill="#d4a853" /></svg>
          {isHi ? 'दशा संक्रमण' : 'Dasha change'}
        </span>
        <span className="flex items-center gap-1.5 text-[11px] text-text-secondary">
          <span className="inline-block w-0.5 h-3 bg-gold-primary" />
          {isHi ? 'अभी' : 'Now'}
        </span>
      </div>

      {/* SVG Timeline */}
      <div ref={containerRef} className="w-full overflow-hidden rounded-xl relative" style={{ height: SVG_H }}>
        <svg
          ref={svgRef}
          width={width}
          height={SVG_H}
          style={{ cursor: isPanning ? 'grabbing' : 'grab', display: 'block' }}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerUp}
          onClick={() => { if (!isPanning) { setHoveredMarker(null); setHoveredSeg(null); } }}
        >
          <rect width={width} height={SVG_H} fill="transparent" />

          {/* ── Mahadasha band ──────────────────────────────────────── */}
          <g>
            {mahaSegs.map((seg, i) => (
              <g key={`maha-${i}`}
                onMouseEnter={e => handleSegEnter(seg.entry, e)}
                onMouseLeave={() => setHoveredSeg(null)}
                style={{ cursor: 'pointer' }}
              >
                <rect
                  x={seg.x + 0.5} y={seg.y + 0.5}
                  width={Math.max(seg.w - 1, 0)} height={seg.h}
                  rx={3} fill={seg.color}
                  fillOpacity={seg.isCurrent ? 0.55 : 0.28}
                  stroke={seg.color} strokeWidth={0.5} strokeOpacity={0.7}
                />
                {seg.isCurrent && (
                  <rect
                    x={seg.x + 0.5} y={seg.y + 0.5}
                    width={Math.max(seg.w - 1, 0)} height={seg.h}
                    rx={3} fill="none" stroke="#f0d48a" strokeWidth={1.5}
                  />
                )}
                {seg.w > MIN_LABEL_PX && (
                  <text
                    x={seg.x + seg.w / 2} y={seg.y + seg.h / 2 + 4.5}
                    textAnchor="middle" fontSize={11}
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

          {/* ── Antardasha band ─────────────────────────────────────── */}
          <g>
            {antarSegs.map((seg, i) => (
              <g key={`antar-${i}`}
                onMouseEnter={e => handleSegEnter(seg.entry, e)}
                onMouseLeave={() => setHoveredSeg(null)}
                style={{ cursor: 'pointer' }}
              >
                <rect
                  x={seg.x + 0.5} y={seg.y + 0.5}
                  width={Math.max(seg.w - 1, 0)} height={seg.h}
                  rx={2} fill={seg.color}
                  fillOpacity={seg.isCurrent ? 0.5 : 0.22}
                  stroke={seg.color} strokeWidth={0.5} strokeOpacity={0.6}
                />
                {seg.isCurrent && (
                  <rect
                    x={seg.x + 0.5} y={seg.y + 0.5}
                    width={Math.max(seg.w - 1, 0)} height={seg.h}
                    rx={2} fill="none" stroke="#f0d48a" strokeWidth={1}
                  />
                )}
                {seg.w > MIN_LABEL_PX && (
                  <text
                    x={seg.x + seg.w / 2} y={seg.y + seg.h / 2 + 4}
                    textAnchor="middle" fontSize={9}
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

          {/* ── Transit marker row ──────────────────────────────────── */}
          {/* Separator line between antar band and markers */}
          <line
            x1={0} y1={MARKER_ROW_Y - 3} x2={width} y2={MARKER_ROW_Y - 3}
            stroke="#8a8478" strokeOpacity={0.15} strokeWidth={0.5}
          />
          <g>
            {markers.map((m, i) => {
              const markerCenterY = MARKER_ROW_Y + 10 + m.row * 22;
              return (
                <g key={`marker-${i}`}
                  onMouseEnter={e => handleMarkerEnter(m.keyDate, e)}
                  onMouseLeave={() => setHoveredMarker(null)}
                  style={{ cursor: 'pointer' }}
                >
                  {/* Vertical connecting line from antar band to marker */}
                  <line
                    x1={m.x} y1={ANTAR_Y + ANTAR_H}
                    x2={m.x} y2={markerCenterY - 8}
                    stroke={m.color} strokeOpacity={0.25} strokeWidth={0.5}
                    strokeDasharray="2 2"
                  />
                  <MarkerShape
                    shape={m.shape} x={m.x} y={markerCenterY}
                    color={m.color} size={7}
                  />
                  {/* Label below marker (only when zoomed enough) */}
                  {transform.k >= 3 && (
                    <text
                      x={m.x} y={markerCenterY + 14}
                      textAnchor="middle" fontSize={7}
                      fill={m.color} fillOpacity={0.7}
                      style={{ pointerEvents: 'none', userSelect: 'none' }}
                      transform={`rotate(-30, ${m.x}, ${markerCenterY + 14})`}
                    >
                      {TYPE_META[m.keyDate.type]?.label ?? ''}
                    </text>
                  )}
                </g>
              );
            })}
          </g>

          {/* ── Year ruler ──────────────────────────────────────────── */}
          <g transform={`translate(0, ${RULER_Y})`}>
            <line x1={0} y1={0} x2={width} y2={0}
              stroke="#8a8478" strokeOpacity={0.3} strokeWidth={0.5} />
            {ticks.map(({ x, label }) => (
              <g key={label + x}>
                <line x1={x} y1={0} x2={x} y2={4}
                  stroke="#8a8478" strokeOpacity={0.4} strokeWidth={0.5} />
                <text x={x} y={14} textAnchor="middle" fontSize={9}
                  fill="#8a8478" fillOpacity={0.7}
                  style={{ userSelect: 'none' }}
                >{label}</text>
              </g>
            ))}
          </g>

          {/* ── NOW line ────────────────────────────────────────────── */}
          {nowX !== null && nowX >= 0 && nowX <= width && (
            <g>
              <line
                x1={nowX} y1={MAHA_Y}
                x2={nowX} y2={RULER_Y}
                stroke="#d4a853" strokeWidth={1.5} strokeDasharray="3 2"
              />
              {/* Pulsing circle at top */}
              <circle cx={nowX} cy={MAHA_Y + 4} r={4} fill="#d4a853" opacity={0.9}>
                <animate attributeName="opacity" values="0.9;0.3;0.9" dur="2s" repeatCount="indefinite" />
              </circle>
              <text
                x={nowX + 5} y={MAHA_Y + 13}
                fontSize={9} fontWeight={600} fill="#f0d48a"
                style={{ userSelect: 'none' }}
              >NOW</text>
            </g>
          )}
        </svg>

        {/* ── Hover tooltip for transit markers ─────────────────── */}
        {hoveredMarker && (
          <div
            className="absolute z-50 pointer-events-none"
            style={{
              left: Math.min(tooltipPos.x, width - 220),
              top: Math.max(tooltipPos.y - 100, 0),
            }}
          >
            <div className="bg-[#111633] border border-gold-primary/20 rounded-lg p-3 shadow-xl max-w-[220px]">
              <p className="text-xs font-mono text-text-secondary mb-1">
                {formatShortDate(hoveredMarker.date, locale)}
                <span className="ml-2 text-gold-primary/80">{daysFromNow(hoveredMarker.date, locale)}</span>
              </p>
              <p className="text-sm font-semibold text-text-primary leading-snug mb-1">
                {tl(hoveredMarker.title as Record<string, string>, locale)}
              </p>
              <p className="text-xs text-text-secondary/70 leading-relaxed">
                {tl(hoveredMarker.description as Record<string, string>, locale)}
              </p>
              <div className="flex items-center gap-2 mt-1.5">
                <span
                  className="text-[10px] px-1.5 py-0.5 rounded font-medium"
                  style={{
                    backgroundColor: IMPACT_COLORS[hoveredMarker.impact] + '22',
                    color: IMPACT_COLORS[hoveredMarker.impact],
                  }}
                >
                  {hoveredMarker.impact}
                </span>
                {hoveredMarker.domain && (
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-white/5 text-text-secondary capitalize">
                    {hoveredMarker.domain}
                  </span>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ── Hover tooltip for dasha segments ──────────────────── */}
        {hoveredSeg && !hoveredMarker && (
          <div
            className="absolute z-50 pointer-events-none"
            style={{
              left: Math.min(tooltipPos.x, width - 200),
              top: Math.max(tooltipPos.y - 80, 0),
            }}
          >
            <div className="bg-[#111633] border border-gold-primary/20 rounded-lg p-2.5 shadow-xl max-w-[200px]">
              <p className="text-sm font-semibold text-text-primary">
                {tl(hoveredSeg.planetName, locale)} {hoveredSeg.level === 'maha' ? (isHi ? 'महादशा' : 'Mahadasha') : (isHi ? 'अन्तर्दशा' : 'Antardasha')}
              </p>
              <p className="text-xs text-text-secondary font-mono mt-1">
                {hoveredSeg.startDate.slice(0, 10)} → {hoveredSeg.endDate.slice(0, 10)}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Hint text */}
      <p className="text-text-secondary/50 text-[10px] mt-1.5 text-center">
        {isHi
          ? 'ज़ूम करें · खींचें · मार्कर पर होवर करें'
          : 'Scroll to zoom · Drag to pan · Hover markers for details'}
      </p>

      {/* ── Active Context Card ────────────────────────────────────── */}
      <ActiveContextCard
        context={activeContext}
        locale={locale}
        isHi={isHi}
      />
    </div>
  );
}

/* ─── Active Context Card Component ──────────────────────────────────── */
interface ActiveContextProps {
  context: {
    currentMaha: DashaEntry | null;
    currentAntar: DashaEntry | null;
    activeTransit: KeyDate | null;
    nextEvent: KeyDate | null;
  };
  locale: string;
  isHi: boolean;
}

function ActiveContextCard({ context, locale, isHi }: ActiveContextProps) {
  const { currentMaha, currentAntar, activeTransit, nextEvent } = context;
  if (!currentMaha) return null;

  return (
    <div className="mt-3 rounded-xl border border-gold-primary/10 bg-gradient-to-r from-[#111633]/80 to-[#0a0e27]/80 p-3">
      <div className="flex items-center gap-1.5 mb-2">
        <CircleDot className="w-3.5 h-3.5 text-gold-primary" />
        <span className="text-xs font-semibold text-gold-light">
          {isHi ? 'वर्तमान स्थिति' : 'Active Context'}
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
        {/* Current Dasha */}
        <div className="rounded-lg bg-white/3 p-2.5 border border-white/5">
          <p className="text-[10px] uppercase tracking-wider text-text-secondary/60 mb-1">
            {isHi ? 'दशा' : 'Dasha'}
          </p>
          <p className="text-sm font-semibold text-text-primary">
            <span style={{ color: planetColor(currentMaha.planet) }}>
              {tl(currentMaha.planetName, locale)}
            </span>
            {currentAntar && (
              <>
                <span className="text-text-secondary/40 mx-1">/</span>
                <span style={{ color: planetColor(currentAntar.planet) }}>
                  {tl(currentAntar.planetName, locale)}
                </span>
              </>
            )}
          </p>
          <p className="text-[10px] text-text-secondary/50 font-mono mt-0.5">
            {currentAntar
              ? `${currentAntar.startDate.slice(0, 10)} → ${currentAntar.endDate.slice(0, 10)}`
              : `${currentMaha.startDate.slice(0, 10)} → ${currentMaha.endDate.slice(0, 10)}`
            }
          </p>
        </div>

        {/* Active Transit */}
        <div className="rounded-lg bg-white/3 p-2.5 border border-white/5">
          <p className="text-[10px] uppercase tracking-wider text-text-secondary/60 mb-1">
            {isHi ? 'सक्रिय गोचर' : 'Active Transit'}
          </p>
          {activeTransit ? (
            <>
              <p className="text-sm font-semibold leading-snug" style={{ color: IMPACT_COLORS[activeTransit.impact] }}>
                {tl(activeTransit.title as Record<string, string>, locale)}
              </p>
              <span
                className="inline-block mt-1 text-[10px] px-1.5 py-0.5 rounded font-medium"
                style={{
                  backgroundColor: IMPACT_COLORS[activeTransit.impact] + '22',
                  color: IMPACT_COLORS[activeTransit.impact],
                }}
              >
                {activeTransit.impact}
              </span>
            </>
          ) : (
            <p className="text-xs text-text-secondary/50 italic">
              {isHi ? 'कोई सक्रिय गोचर नहीं' : 'No active transit'}
            </p>
          )}
        </div>

        {/* Upcoming Event */}
        <div className="rounded-lg bg-white/3 p-2.5 border border-white/5">
          <p className="text-[10px] uppercase tracking-wider text-text-secondary/60 mb-1">
            {isHi ? 'आगामी' : 'Upcoming'}
          </p>
          {nextEvent ? (
            <>
              <p className="text-sm font-semibold text-text-primary leading-snug">
                {tl(nextEvent.title as Record<string, string>, locale)}
              </p>
              <p className="text-[10px] text-text-secondary/60 mt-0.5">
                {formatShortDate(nextEvent.date, locale)}
                <span className="ml-1.5 text-gold-primary/80">{daysFromNow(nextEvent.date, locale)}</span>
              </p>
            </>
          ) : (
            <p className="text-xs text-text-secondary/50 italic">
              {isHi ? 'कोई आगामी घटना नहीं' : 'No upcoming events'}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
