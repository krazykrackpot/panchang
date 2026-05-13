'use client';

import { useMemo, useState, useEffect } from 'react';
import { Sparkles, Star, Clock, Sunrise, Sunset, Moon, AlertTriangle } from 'lucide-react';
import type { PanchangData } from '@/types/panchang';
import type { DayVerdict, VerdictRating } from '@/lib/muhurta/verdict-types';
import { computeDayVerdict } from '@/lib/muhurta/verdict-engine';
import { isDevanagariLocale } from '@/lib/utils/locale-fonts';
import { nowMinutesInTimezone } from '@/lib/utils/now-in-timezone';
import { useLocationStore } from '@/stores/location-store';

// ── Colours — solid hex for visibility on dark bg ──

const VERDICT_HEX: Record<VerdictRating, string> = {
  avoid: '#991b1b',
  caution: '#92400e',
  good: '#065f46',
  very_good: '#047857',
  excellent: '#d4a853',
  exceptional: '#f0d48a',
};

const VERDICT_LABEL: Record<VerdictRating, { en: string; hi: string }> = {
  avoid: { en: 'Avoid', hi: 'वर्जित' },
  caution: { en: 'Caution', hi: 'सावधान' },
  good: { en: 'Good', hi: 'शुभ' },
  very_good: { en: 'Very Good', hi: 'अति शुभ' },
  excellent: { en: 'Excellent', hi: 'उत्तम' },
  exceptional: { en: 'Exceptional', hi: 'सर्वश्रेष्ठ' },
};

// ── Time helpers ──

function toMin(hhmm: string): number {
  const [h, m] = hhmm.split(':').map(Number);
  return h * 60 + m;
}

function fmt12(hhmm: string): string {
  const [h, m] = hhmm.split(':').map(Number);
  const suffix = h >= 12 ? 'PM' : 'AM';
  return `${h === 0 ? 12 : h > 12 ? h - 12 : h}:${String(m).padStart(2, '0')} ${suffix}`;
}

function fmtShort(mins: number): string {
  const h = Math.floor(mins / 60) % 24;
  const m = mins % 60;
  const suffix = h >= 12 ? 'p' : 'a';
  return `${h === 0 ? 12 : h > 12 ? h - 12 : h}:${String(m).padStart(2, '0')}${suffix}`;
}

function toHHMM(mins: number): string {
  const h = Math.floor(mins / 60) % 24;
  const m = mins % 60;
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
}

// ── Named time window for lanes ──

interface NamedWindow {
  id: string;
  name: string;
  nameHi: string;
  start: number; // minutes
  end: number;
  colour: string; // hex
}

function collectInauspicious(p: PanchangData): NamedWindow[] {
  const windows: NamedWindow[] = [];
  if (p.rahuKaal) windows.push({ id: 'rk', name: 'Rahu Kaal', nameHi: 'राहु काल', start: toMin(p.rahuKaal.start), end: toMin(p.rahuKaal.end), colour: '#dc2626' });
  if (p.yamaganda) windows.push({ id: 'ym', name: 'Yamaganda', nameHi: 'यमगण्ड', start: toMin(p.yamaganda.start), end: toMin(p.yamaganda.end), colour: '#b91c1c' });
  if (p.gulikaKaal) windows.push({ id: 'gk', name: 'Gulika', nameHi: 'गुलिक', start: toMin(p.gulikaKaal.start), end: toMin(p.gulikaKaal.end), colour: '#991b1b' });
  const varjyam = p.varjyamAll ?? (p.varjyam ? [p.varjyam] : []);
  varjyam.forEach((v, i) => windows.push({ id: `vj${i}`, name: 'Varjyam', nameHi: 'वर्ज्यम्', start: toMin(v.start), end: toMin(v.end), colour: '#d97706' }));
  const bhadra = p.bhadraAll ?? (p.bhadra ? [p.bhadra] : []);
  bhadra.forEach((b, i) => windows.push({ id: `bh${i}`, name: 'Vishti', nameHi: 'विष्टि', start: toMin(b.start), end: toMin(b.end), colour: '#7f1d1d' }));
  if (p.durMuhurtam) p.durMuhurtam.forEach((d, i) => windows.push({ id: `dm${i}`, name: 'Durmuhurta', nameHi: 'दुर्मुहूर्त', start: toMin(d.start), end: toMin(d.end), colour: '#92400e' }));
  if (p.vishaGhatika) windows.push({ id: 'vg', name: 'Visha Ghatika', nameHi: 'विष घटिका', start: toMin(p.vishaGhatika.start), end: toMin(p.vishaGhatika.end), colour: '#78350f' });
  return windows;
}

function collectAuspicious(p: PanchangData): NamedWindow[] {
  const windows: NamedWindow[] = [];
  if (p.brahmaMuhurta) windows.push({ id: 'bm', name: 'Brahma Muhurta', nameHi: 'ब्रह्म मुहूर्त', start: toMin(p.brahmaMuhurta.start), end: toMin(p.brahmaMuhurta.end), colour: '#6d28d9' });
  if (p.abhijitMuhurta?.available !== false) windows.push({ id: 'ab', name: 'Abhijit', nameHi: 'अभिजित', start: toMin(p.abhijitMuhurta.start), end: toMin(p.abhijitMuhurta.end), colour: '#d4a853' });
  const amrit = p.amritKalamAll ?? (p.amritKalam ? [p.amritKalam] : []);
  amrit.forEach((a, i) => windows.push({ id: `ak${i}`, name: 'Amrit Kalam', nameHi: 'अमृत काल', start: toMin(a.start), end: toMin(a.end), colour: '#059669' }));
  if (p.vijayaMuhurta) windows.push({ id: 'vj', name: 'Vijaya', nameHi: 'विजय', start: toMin(p.vijayaMuhurta.start), end: toMin(p.vijayaMuhurta.end), colour: '#10b981' });
  if (p.godhuli) windows.push({ id: 'gd', name: 'Godhuli', nameHi: 'गोधूलि', start: toMin(p.godhuli.start), end: toMin(p.godhuli.end), colour: '#f59e0b' });
  return windows;
}

// ── Props ──

interface BestWindowsCardProps {
  panchang: PanchangData;
  locale: string;
  timezone?: string;
}

// ── Lane Bar sub-component ──

function LaneBar({ windows, label, labelHi, isHi, tlStart, tlSpan, emptyColour }: {
  windows: NamedWindow[];
  label: string;
  labelHi: string;
  isHi: boolean;
  tlStart: number;
  tlSpan: number;
  emptyColour: string;
}) {
  const pct = (min: number) => Math.max(0, Math.min(100, ((min - tlStart) / tlSpan) * 100));

  return (
    <div>
      <span className="text-[9px] text-text-secondary font-medium uppercase tracking-wider mb-0.5 block">
        {isHi ? labelHi : label}
      </span>
      <div className="relative h-7 rounded-md" style={{ backgroundColor: emptyColour }}>
        {windows.map(w => {
          const left = pct(Math.max(w.start, tlStart));
          const right = pct(Math.min(w.end, tlStart + tlSpan));
          const width = right - left;
          if (width <= 0) return null;
          return (
            <div
              key={w.id}
              className="absolute top-0 bottom-0 flex items-center justify-center overflow-hidden rounded-sm"
              style={{ left: `${left}%`, width: `${width}%`, backgroundColor: w.colour }}
              title={`${isHi ? w.nameHi : w.name}: ${fmt12(toHHMM(w.start))} – ${fmt12(toHHMM(w.end))}`}
            >
              {width > 6 && (
                <span className="text-[8px] font-bold text-white/90 truncate px-1 drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
                  {isHi ? w.nameHi : w.name}
                </span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── Main Component ──

export default function BestWindowsCard({ panchang, locale, timezone }: BestWindowsCardProps) {
  const isHi = isDevanagariLocale(locale);
  const storeTz = useLocationStore(s => s.timezone);
  const effectiveTz = timezone || storeTz || null;

  const verdict: DayVerdict = useMemo(() => computeDayVerdict(panchang), [panchang]);
  const { slots, bestWindow, dayLevelYogas } = verdict;

  // NOW — updates every 60s
  const [nowMin, setNowMin] = useState(() => nowMinutesInTimezone(effectiveTz));
  useEffect(() => {
    setNowMin(nowMinutesInTimezone(effectiveTz));
    const iv = setInterval(() => setNowMin(nowMinutesInTimezone(effectiveTz)), 60_000);
    return () => clearInterval(iv);
  }, [effectiveTz]);

  // Timeline range: Brahma Muhurta (or sunrise-1h) to sunset+1h
  const sunriseMin = toMin(panchang.sunrise);
  const sunsetMin = toMin(panchang.sunset);
  const tlStart = panchang.brahmaMuhurta ? toMin(panchang.brahmaMuhurta.start) : Math.max(0, sunriseMin - 60);
  const tlEnd = Math.min(1440, sunsetMin + 60);
  const tlSpan = tlEnd - tlStart;

  const moonriseMin = panchang.moonrise ? toMin(panchang.moonrise) : null;
  const moonsetMin = panchang.moonset ? toMin(panchang.moonset) : null;

  const pct = (min: number) => tlSpan > 0 ? Math.max(0, Math.min(100, ((min - tlStart) / tlSpan) * 100)) : 0;
  const nowPct = pct(nowMin);
  const nowInRange = nowMin >= tlStart && nowMin <= tlEnd;

  // Collect named windows for lanes
  const inauspicious = useMemo(() => collectInauspicious(panchang), [panchang]);
  const auspicious = useMemo(() => collectAuspicious(panchang), [panchang]);

  // Hour tick marks within range
  const hourTicks = useMemo(() => {
    const ticks: number[] = [];
    const firstHour = Math.ceil(tlStart / 60) * 60;
    for (let m = firstHour; m <= tlEnd; m += 60) ticks.push(m);
    return ticks;
  }, [tlStart, tlEnd]);

  if (slots.length === 0) {
    return (
      <div className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-2xl p-5">
        <p className="text-text-secondary text-sm text-center">{isHi ? 'कोई डेटा उपलब्ध नहीं।' : 'No verdict data available.'}</p>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-2xl p-5 space-y-4">
      {/* ── Header ── */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-gold-primary" />
          <h3 className="text-gold-light font-semibold text-base">{isHi ? 'आज की सर्वश्रेष्ठ अवधियाँ' : 'Best Windows Today'}</h3>
        </div>
        {dayLevelYogas.length > 0 && (
          <span className="text-gold-primary/70 text-[10px]">
            ✦ {dayLevelYogas.map(y => isHi ? y.nameHi : y.name).join(', ')}
          </span>
        )}
      </div>

      {/* ── Best Window Callout ── */}
      {bestWindow && (
        <div className="border border-gold-primary/30 rounded-xl p-3 bg-gold-primary/[0.07] shadow-[0_0_20px_rgba(212,168,83,0.08)]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-gold-light/70" />
              <span className="text-gold-light font-mono text-sm">{fmt12(bestWindow.start)} – {fmt12(bestWindow.end)}</span>
              <span className="text-emerald-400/80 text-xs">
                {bestWindow.positives.map(p => isHi ? p.nameHi : p.name).join(' + ')}
              </span>
            </div>
            <span className="flex items-center gap-0.5">
              {Array.from({ length: bestWindow.verdict === 'exceptional' ? 3 : bestWindow.verdict === 'excellent' ? 3 : bestWindow.verdict === 'very_good' ? 2 : 1 }, (_, i) => (
                <Star key={i} className="w-3 h-3 text-gold-primary fill-gold-primary" />
              ))}
            </span>
          </div>
        </div>
      )}

      {/* ── Three-Lane Timeline ── */}
      <div className="space-y-1.5 relative">
        {/* Hour ticks + labels (shared axis) */}
        <div className="relative h-4">
          {hourTicks.map(m => (
            <span key={m} className="absolute text-[8px] text-text-secondary/50 font-mono -translate-x-1/2"
              style={{ left: `${pct(m)}%` }}>
              {fmtShort(m)}
            </span>
          ))}
        </div>

        {/* Lane 1: Inauspicious (red) */}
        <LaneBar
          windows={inauspicious}
          label="Inauspicious"
          labelHi="अशुभ काल"
          isHi={isHi}
          tlStart={tlStart}
          tlSpan={tlSpan}
          emptyColour="rgba(255,255,255,0.02)"
        />

        {/* Lane 2: Auspicious (green) */}
        <LaneBar
          windows={auspicious}
          label="Auspicious"
          labelHi="शुभ काल"
          isHi={isHi}
          tlStart={tlStart}
          tlSpan={tlSpan}
          emptyColour="rgba(255,255,255,0.02)"
        />

        {/* Lane 3: Net Verdict (synthesised) */}
        <div>
          <span className="text-[9px] text-text-secondary font-medium uppercase tracking-wider mb-0.5 block">
            {isHi ? 'परिणाम' : 'Net Result'}
          </span>
          <div className="relative h-9 rounded-md bg-white/[0.02]">
            {slots.map((slot, i) => {
              const startMin = toMin(slot.start);
              const endMin = toMin(slot.end);
              const left = pct(startMin);
              const width = pct(endMin) - left;
              if (width <= 0) return null;
              return (
                <div
                  key={i}
                  className="absolute top-0 bottom-0"
                  style={{ left: `${left}%`, width: `${width}%`, backgroundColor: VERDICT_HEX[slot.verdict] }}
                  title={`${fmt12(slot.start)}–${fmt12(slot.end)}: ${VERDICT_LABEL[slot.verdict].en}`}
                />
              );
            })}
          </div>
        </div>

        {/* ── Vertical markers overlaid on ALL three lanes ── */}
        {/* These are positioned relative to the lane container */}

        {/* Sunrise */}
        <div className="absolute pointer-events-none z-10" style={{ left: `${pct(sunriseMin)}%`, top: '16px', bottom: '0' }}>
          <div className="w-px h-full" style={{ backgroundColor: '#fbbf24' }} />
          <Sunrise className="absolute -top-1 -translate-x-1/2 w-4 h-4 drop-shadow-[0_0_6px_rgba(251,191,36,0.9)]" style={{ color: '#fbbf24', left: '0.5px' }} />
        </div>

        {/* Sunset */}
        <div className="absolute pointer-events-none z-10" style={{ left: `${pct(sunsetMin)}%`, top: '16px', bottom: '0' }}>
          <div className="w-px h-full" style={{ backgroundColor: '#fb923c' }} />
          <Sunset className="absolute -top-1 -translate-x-1/2 w-4 h-4 drop-shadow-[0_0_6px_rgba(251,146,60,0.9)]" style={{ color: '#fb923c', left: '0.5px' }} />
        </div>

        {/* Moonrise */}
        {moonriseMin !== null && moonriseMin >= tlStart && moonriseMin <= tlEnd && (
          <div className="absolute pointer-events-none z-10" style={{ left: `${pct(moonriseMin)}%`, top: '16px', bottom: '0' }}>
            <div className="w-px h-full" style={{ backgroundColor: 'rgba(147,197,253,0.4)' }} />
            <Moon className="absolute -top-1 -translate-x-1/2 w-3.5 h-3.5" style={{ color: '#93c5fd', left: '0.5px' }} />
          </div>
        )}

        {/* Moonset */}
        {moonsetMin !== null && moonsetMin >= tlStart && moonsetMin <= tlEnd && (
          <div className="absolute pointer-events-none z-10" style={{ left: `${pct(moonsetMin)}%`, top: '16px', bottom: '0' }}>
            <div className="w-px h-full" style={{ backgroundColor: 'rgba(96,165,250,0.2)' }} />
            <Moon className="absolute -top-1 -translate-x-1/2 w-3 h-3 opacity-40" style={{ color: '#60a5fa', left: '0.5px' }} />
          </div>
        )}

        {/* NOW — spans all lanes */}
        {nowInRange && (
          <div className="absolute pointer-events-none z-20" style={{ left: `${nowPct}%`, top: '16px', bottom: '0' }}>
            <div className="w-0.5 h-full shadow-[0_0_12px_rgba(212,168,83,1)]" style={{ backgroundColor: '#d4a853' }} />
            <span className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 text-[7px] font-black px-1.5 py-0.5 rounded-full shadow-[0_0_10px_rgba(212,168,83,0.7)]"
              style={{ backgroundColor: '#f0d48a', color: '#0a0e27', left: '0.5px' }}>
              NOW
            </span>
          </div>
        )}
      </div>

      {/* ── Legend ── */}
      <div className="flex items-center gap-4 flex-wrap">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1 text-[9px] text-text-secondary">
            <span className="inline-block w-2.5 h-2.5 rounded-sm" style={{ backgroundColor: '#991b1b' }} /> {isHi ? 'वर्जित' : 'Avoid'}
          </span>
          <span className="flex items-center gap-1 text-[9px] text-text-secondary">
            <span className="inline-block w-2.5 h-2.5 rounded-sm" style={{ backgroundColor: '#92400e' }} /> {isHi ? 'सावधान' : 'Caution'}
          </span>
          <span className="flex items-center gap-1 text-[9px] text-text-secondary">
            <span className="inline-block w-2.5 h-2.5 rounded-sm" style={{ backgroundColor: '#065f46' }} /> {isHi ? 'शुभ' : 'Good'}
          </span>
          <span className="flex items-center gap-1 text-[9px] text-text-secondary">
            <span className="inline-block w-2.5 h-2.5 rounded-sm" style={{ backgroundColor: '#d4a853' }} /> {isHi ? 'उत्तम' : 'Excellent'}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Sunrise className="w-3 h-3" style={{ color: '#fbbf24' }} />
          <span className="text-[9px] text-text-secondary">{fmt12(panchang.sunrise)}</span>
          <Sunset className="w-3 h-3" style={{ color: '#fb923c' }} />
          <span className="text-[9px] text-text-secondary">{fmt12(panchang.sunset)}</span>
        </div>
      </div>

      {/* ── Conflict callout (when inauspicious overrides auspicious) ── */}
      {slots.some(s => s.hardBlocks.length > 0 && s.positives.length > 0) && (
        <div className="flex items-start gap-2 bg-red-500/[0.06] rounded-lg px-3 py-2 border border-red-500/10">
          <AlertTriangle className="w-3.5 h-3.5 text-red-400 shrink-0 mt-0.5" />
          <p className="text-red-400/70 text-[10px] leading-snug">
            {isHi
              ? 'विषमिश्रित मधु भी व्यर्थ है — कठोर दोष के समय शुभ योग भी समय को शुद्ध नहीं कर सकता। केवल अभिजित मुहूर्त में दोष-निवारण शक्ति है।'
              : 'Even honey is useless if poisoned — an auspicious yoga during a hard dosha cannot purify the time. Only Abhijit Muhurta claims dosha-override power (Muhurta Chintamani).'}
          </p>
        </div>
      )}
    </div>
  );
}
