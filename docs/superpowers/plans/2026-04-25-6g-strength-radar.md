# 6G Shadbala Strength Radar — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add an interactive D3.js radar (spider) chart to the Shadbala tab of the kundali page, showing the 6 Bala components for each planet with click-to-drill-down detail.

**Architecture:** A new `ShadbalaRadar.tsx` client component rendered above the existing `ShadbalaTab` table. Uses D3.js (already installed, v7.9.0) for the radar chart SVG. Planet selection via toggle buttons. Click any axis to expand a breakdown panel. No new API routes — uses existing `fullShadbala` data from `KundaliData`.

**Tech Stack:** D3.js v7, React 19, TypeScript, Tailwind CSS v4, existing `ShadBalaComplete` type from `src/lib/kundali/shadbala.ts`

**Spec reference:** `docs/superpowers/specs/2026-04-25-direction6-interactive-visuals.md` § 6G

---

## File Structure

```
src/
  components/
    kundali/
      ShadbalaRadar.tsx        ← NEW: Main radar chart component
      ShadbalaRadarDetail.tsx   ← NEW: Drill-down breakdown panel
  lib/
    kundali/
      shadbala-normalize.ts     ← NEW: Normalization utilities for radar display
  lib/
    __tests__/
      shadbala-normalize.test.ts ← NEW: Tests for normalization
  app/
    [locale]/
      kundali/
        page.tsx                ← MODIFY: Add radar above ShadbalaTab table
```

---

### Task 1: Shadbala Normalization Utility

**Files:**
- Create: `src/lib/kundali/shadbala-normalize.ts`
- Create: `src/lib/__tests__/shadbala-normalize.test.ts`

The radar chart needs each of the 6 Bala axes normalized to a 0-100 scale. Raw Shadbala values have wildly different ranges (Naisargika is fixed 7.14-60, while Kala can exceed 200). Without normalization, the radar would be meaningless.

- [ ] **Step 1: Write the test file**

```typescript
// src/lib/__tests__/shadbala-normalize.test.ts
import { describe, it, expect } from 'vitest';
import { normalizeShadbala, type NormalizedBala } from '@/lib/kundali/shadbala-normalize';
import type { ShadBalaComplete } from '@/lib/kundali/shadbala';

// Minimal ShadBalaComplete fixture — only the fields normalization needs
function makePlanet(overrides: Partial<ShadBalaComplete>): ShadBalaComplete {
  return {
    planet: 'Sun',
    planetId: 0,
    sthanaBala: 100,
    digBala: 30,
    kalaBala: 120,
    cheshtaBala: 40,
    naisargikaBala: 60,
    drikBala: 15,
    totalPinda: 365,
    rupas: 6.08,
    minRequired: 6.5,
    strengthRatio: 0.94,
    rank: 4,
    ishtaPhala: 35,
    kashtaPhala: 20,
    sthanaBreakdown: {
      ucchaBala: 40, saptavargaja: 30, ojhayugmaRashi: 10,
      ojhayugmaNavamsha: 10, kendradiBala: 5, drekkanaBala: 5,
    },
    kalaBreakdown: {
      natonnataBala: 30, pakshaBala: 20, tribhagaBala: 15,
      abdaBala: 10, masaBala: 10, varaBala: 10, horaBala: 10,
      ayanaBala: 10, yuddhaBala: 5,
    },
    ...overrides,
  };
}

describe('normalizeShadbala', () => {
  it('returns 6 normalized values between 0 and 100 for each planet', () => {
    const planets = [makePlanet({ planet: 'Sun', planetId: 0 })];
    const result = normalizeShadbala(planets);

    expect(result).toHaveLength(1);
    expect(result[0].planetId).toBe(0);
    expect(result[0].planet).toBe('Sun');

    const fields: (keyof NormalizedBala)[] = [
      'sthanaBala', 'digBala', 'kalaBala', 'cheshtaBala', 'naisargikaBala', 'drikBala',
    ];
    for (const f of fields) {
      const val = result[0][f];
      if (typeof val === 'number') {
        expect(val).toBeGreaterThanOrEqual(0);
        expect(val).toBeLessThanOrEqual(100);
      }
    }
  });

  it('normalizes relative to the maximum in the dataset', () => {
    const planets = [
      makePlanet({ planet: 'Sun', planetId: 0, sthanaBala: 200 }),
      makePlanet({ planet: 'Moon', planetId: 1, sthanaBala: 100 }),
    ];
    const result = normalizeShadbala(planets);

    // Sun has max sthanaBala → should be 100
    expect(result[0].sthanaBala).toBe(100);
    // Moon has half → should be 50
    expect(result[1].sthanaBala).toBe(50);
  });

  it('handles negative drikBala by shifting to 0-based', () => {
    const planets = [
      makePlanet({ planet: 'Sun', planetId: 0, drikBala: -20 }),
      makePlanet({ planet: 'Moon', planetId: 1, drikBala: 30 }),
    ];
    const result = normalizeShadbala(planets);

    // drikBala range is -20 to 30 (span 50). Sun at -20 = 0%, Moon at 30 = 100%
    expect(result[0].drikBala).toBe(0);
    expect(result[1].drikBala).toBe(100);
  });

  it('handles all equal values gracefully (returns 50 for all)', () => {
    const planets = [
      makePlanet({ planet: 'Sun', planetId: 0, sthanaBala: 100 }),
      makePlanet({ planet: 'Moon', planetId: 1, sthanaBala: 100 }),
    ];
    const result = normalizeShadbala(planets);

    expect(result[0].sthanaBala).toBe(50);
    expect(result[1].sthanaBala).toBe(50);
  });

  it('preserves sthanaBreakdown and kalaBreakdown from original', () => {
    const planets = [makePlanet({})];
    const result = normalizeShadbala(planets);

    expect(result[0].sthanaBreakdown).toEqual(planets[0].sthanaBreakdown);
    expect(result[0].kalaBreakdown).toEqual(planets[0].kalaBreakdown);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/lib/__tests__/shadbala-normalize.test.ts`
Expected: FAIL — module `@/lib/kundali/shadbala-normalize` does not exist

- [ ] **Step 3: Write the normalization utility**

```typescript
// src/lib/kundali/shadbala-normalize.ts
import type { ShadBalaComplete } from '@/lib/kundali/shadbala';

export interface NormalizedBala {
  planet: string;
  planetId: number;
  sthanaBala: number;   // 0-100
  digBala: number;       // 0-100
  kalaBala: number;      // 0-100
  cheshtaBala: number;   // 0-100
  naisargikaBala: number; // 0-100
  drikBala: number;      // 0-100
  // Pass through for drill-down
  sthanaBreakdown: ShadBalaComplete['sthanaBreakdown'];
  kalaBreakdown: ShadBalaComplete['kalaBreakdown'];
  totalPinda: number;
  rupas: number;
  strengthRatio: number;
  rank: number;
}

const BALA_KEYS = ['sthanaBala', 'digBala', 'kalaBala', 'cheshtaBala', 'naisargikaBala', 'drikBala'] as const;

/**
 * Normalizes Shadbala values to 0-100 scale for radar chart display.
 * Each axis is normalized independently: 0 = minimum value in the dataset,
 * 100 = maximum value. If all values are equal, returns 50 for all.
 * DrikBala can be negative — the range is shifted so the minimum maps to 0.
 */
export function normalizeShadbala(shadbala: ShadBalaComplete[]): NormalizedBala[] {
  if (shadbala.length === 0) return [];

  // Compute min/max for each bala across all planets
  const ranges: Record<string, { min: number; max: number }> = {};
  for (const key of BALA_KEYS) {
    let min = Infinity;
    let max = -Infinity;
    for (const s of shadbala) {
      const val = s[key];
      if (val < min) min = val;
      if (val > max) max = val;
    }
    ranges[key] = { min, max };
  }

  return shadbala.map((s) => {
    const normalized: Record<string, number> = {};
    for (const key of BALA_KEYS) {
      const { min, max } = ranges[key];
      const span = max - min;
      // If all values equal, use 50 (midpoint)
      normalized[key] = span === 0 ? 50 : ((s[key] - min) / span) * 100;
    }

    return {
      planet: s.planet,
      planetId: s.planetId,
      sthanaBala: normalized.sthanaBala,
      digBala: normalized.digBala,
      kalaBala: normalized.kalaBala,
      cheshtaBala: normalized.cheshtaBala,
      naisargikaBala: normalized.naisargikaBala,
      drikBala: normalized.drikBala,
      sthanaBreakdown: s.sthanaBreakdown,
      kalaBreakdown: s.kalaBreakdown,
      totalPinda: s.totalPinda,
      rupas: s.rupas,
      strengthRatio: s.strengthRatio,
      rank: s.rank,
    };
  });
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/lib/__tests__/shadbala-normalize.test.ts`
Expected: 5 tests PASS

- [ ] **Step 5: Commit**

```bash
git add src/lib/kundali/shadbala-normalize.ts src/lib/__tests__/shadbala-normalize.test.ts
git commit -m "feat(6G): add shadbala normalization utility with tests"
```

---

### Task 2: Radar Chart Component (SVG rendering)

**Files:**
- Create: `src/components/kundali/ShadbalaRadar.tsx`

This is the core D3 radar chart. It renders a hexagonal grid with 6 axes and overlays planet strength polygons. D3 is used only for math (scales, line generators) — the DOM is React SVG.

- [ ] **Step 1: Create the ShadbalaRadar component**

```tsx
// src/components/kundali/ShadbalaRadar.tsx
'use client';

import { useState, useMemo, useCallback } from 'react';
import * as d3 from 'd3';
import { GrahaIconById } from '@/components/icons/GrahaIcons';
import { tl } from '@/lib/utils/trilingual';
import { normalizeShadbala, type NormalizedBala } from '@/lib/kundali/shadbala-normalize';
import type { ShadBalaComplete } from '@/lib/kundali/shadbala';
import type { Locale, LocaleText } from '@/types/panchang';

// Planet colors — consistent with the app's graha color scheme
const PLANET_COLORS: Record<number, string> = {
  0: '#FF6B35', // Sun — burnt orange
  1: '#C0C0C0', // Moon — silver
  2: '#DC143C', // Mars — crimson
  3: '#50C878', // Mercury — emerald
  4: '#FFD700', // Jupiter — gold
  5: '#FF69B4', // Venus — pink
  6: '#4169E1', // Saturn — royal blue
};

const AXIS_LABELS: { key: keyof NormalizedBala; label: LocaleText }[] = [
  { key: 'sthanaBala', label: { en: 'Sthana', hi: 'स्थान', sa: 'स्थान', ta: 'ஸ்தான', bn: 'স্থান', te: 'స్థాన', kn: 'ಸ್ಥಾನ', mr: 'स्थान', gu: 'સ્થાન', mai: 'स्थान' } },
  { key: 'digBala', label: { en: 'Dig', hi: 'दिक्', sa: 'दिक्', ta: 'திக்', bn: 'দিক্', te: 'దిక్', kn: 'ದಿಕ್', mr: 'दिक्', gu: 'દિક્', mai: 'दिक्' } },
  { key: 'kalaBala', label: { en: 'Kāla', hi: 'काल', sa: 'काल', ta: 'கால', bn: 'কাল', te: 'కాల', kn: 'ಕಾಲ', mr: 'काल', gu: 'કાલ', mai: 'काल' } },
  { key: 'cheshtaBala', label: { en: 'Cheshta', hi: 'चेष्टा', sa: 'चेष्टा', ta: 'சேஷ்டா', bn: 'চেষ্টা', te: 'చేష్టా', kn: 'ಚೇಷ್ಟಾ', mr: 'चेष्टा', gu: 'ચેષ્ટા', mai: 'चेष्टा' } },
  { key: 'naisargikaBala', label: { en: 'Naisargika', hi: 'नैसर्गिक', sa: 'नैसर्गिक', ta: 'நைசர்கிக', bn: 'নৈসর্গিক', te: 'నైసర్గిక', kn: 'ನೈಸರ್ಗಿಕ', mr: 'नैसर्गिक', gu: 'નૈસર્ગિક', mai: 'नैसर्गिक' } },
  { key: 'drikBala', label: { en: 'Drik', hi: 'दृक्', sa: 'दृक्', ta: 'திருஷ்டி', bn: 'দৃক্', te: 'దృక్', kn: 'ದೃಕ್', mr: 'दृक्', gu: 'દૃક્', mai: 'दृक्' } },
];

const AXIS_DESCRIPTIONS: Record<string, { en: string; hi: string }> = {
  sthanaBala: { en: 'Positional strength — sign placement, exaltation, varga dignity', hi: 'स्थान बल — राशि, उच्च, वर्ग गरिमा' },
  digBala: { en: 'Directional strength — house placement vs natural direction', hi: 'दिग्बल — भाव बनाम प्राकृतिक दिशा' },
  kalaBala: { en: 'Temporal strength — time of birth, day/night, season', hi: 'कालबल — जन्म समय, दिन/रात, ऋतु' },
  cheshtaBala: { en: 'Motional strength — speed, retrograde status', hi: 'चेष्टाबल — गति, वक्री स्थिति' },
  naisargikaBala: { en: 'Natural strength — inherent planetary power (fixed)', hi: 'नैसर्गिक बल — नैसर्गिक ग्रह शक्ति (स्थिर)' },
  drikBala: { en: 'Aspectual strength — benefic/malefic aspects received', hi: 'दृक्बल — शुभ/अशुभ दृष्टि' },
};

interface Props {
  shadbala: ShadBalaComplete[];
  locale: Locale;
}

export default function ShadbalaRadar({ shadbala, locale }: Props) {
  const [selectedPlanets, setSelectedPlanets] = useState<Set<number>>(() => {
    // Default: show the top 3 strongest planets
    const sorted = [...shadbala].sort((a, b) => b.strengthRatio - a.strengthRatio);
    return new Set(sorted.slice(0, 3).map((s) => s.planetId));
  });
  const [hoveredAxis, setHoveredAxis] = useState<string | null>(null);

  const isDevanagari = locale === 'hi' || locale === 'sa' || locale === 'mai' || locale === 'mr';

  const normalized = useMemo(() => normalizeShadbala(shadbala), [shadbala]);

  const togglePlanet = useCallback((id: number) => {
    setSelectedPlanets((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }, []);

  // Radar geometry
  const size = 300; // SVG viewBox size
  const cx = size / 2;
  const cy = size / 2;
  const radius = size * 0.38; // Leave room for labels
  const levels = 4; // Concentric grid rings (25%, 50%, 75%, 100%)
  const numAxes = 6;
  const angleSlice = (Math.PI * 2) / numAxes;

  // D3 radial scale: 0-100 → 0-radius
  const rScale = d3.scaleLinear().domain([0, 100]).range([0, radius]);

  // Compute polygon points for a planet
  const getPolygonPoints = (planet: NormalizedBala): string => {
    return AXIS_LABELS.map((axis, i) => {
      const value = planet[axis.key] as number;
      const angle = angleSlice * i - Math.PI / 2; // Start from top
      const r = rScale(value);
      return `${cx + r * Math.cos(angle)},${cy + r * Math.sin(angle)}`;
    }).join(' ');
  };

  // Axis endpoint coordinates
  const axisPoints = AXIS_LABELS.map((_, i) => {
    const angle = angleSlice * i - Math.PI / 2;
    return {
      x: cx + radius * Math.cos(angle),
      y: cy + radius * Math.sin(angle),
      labelX: cx + (radius + 24) * Math.cos(angle),
      labelY: cy + (radius + 24) * Math.sin(angle),
    };
  });

  return (
    <div className="space-y-4">
      {/* Planet toggle buttons */}
      <div className="flex flex-wrap justify-center gap-2">
        {shadbala.map((s) => {
          const isActive = selectedPlanets.has(s.planetId);
          const color = PLANET_COLORS[s.planetId] || '#888';
          return (
            <button
              key={s.planetId}
              onClick={() => togglePlanet(s.planetId)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all border ${
                isActive
                  ? 'border-opacity-60 bg-opacity-15'
                  : 'border-gold-primary/10 bg-bg-secondary/30 opacity-40 hover:opacity-70'
              }`}
              style={isActive ? {
                borderColor: color,
                backgroundColor: `${color}15`,
                color: color,
              } : undefined}
            >
              <GrahaIconById id={s.planetId} size={14} />
              <span>{tl(AXIS_LABELS[0].label, locale) ? s.planet : s.planet}</span>
              <span className="text-text-secondary text-[10px]">
                {s.strengthRatio.toFixed(2)}
              </span>
            </button>
          );
        })}
      </div>

      {/* Radar chart SVG */}
      <div className="flex justify-center">
        <svg
          viewBox={`0 0 ${size} ${size}`}
          className="w-full max-w-[400px] sm:max-w-[450px]"
          role="img"
          aria-label={isDevanagari ? 'षड्बल रडार चार्ट' : 'Shadbala Radar Chart'}
        >
          {/* Concentric grid rings */}
          {Array.from({ length: levels }, (_, i) => {
            const r = rScale(((i + 1) / levels) * 100);
            const points = Array.from({ length: numAxes }, (_, j) => {
              const angle = angleSlice * j - Math.PI / 2;
              return `${cx + r * Math.cos(angle)},${cy + r * Math.sin(angle)}`;
            }).join(' ');
            return (
              <polygon
                key={`grid-${i}`}
                points={points}
                fill="none"
                stroke="#8a6d2b"
                strokeWidth={i === levels - 1 ? 1 : 0.5}
                strokeOpacity={0.3}
              />
            );
          })}

          {/* Axis lines */}
          {axisPoints.map((pt, i) => (
            <line
              key={`axis-${i}`}
              x1={cx}
              y1={cy}
              x2={pt.x}
              y2={pt.y}
              stroke="#8a6d2b"
              strokeWidth={hoveredAxis === AXIS_LABELS[i].key ? 1.5 : 0.5}
              strokeOpacity={hoveredAxis === AXIS_LABELS[i].key ? 0.8 : 0.3}
            />
          ))}

          {/* Planet polygons — render in reverse order so highest-rank renders on top */}
          {normalized
            .filter((p) => selectedPlanets.has(p.planetId))
            .sort((a, b) => a.rank - b.rank) // Lower rank (stronger) renders last (on top)
            .map((planet) => {
              const color = PLANET_COLORS[planet.planetId] || '#888';
              return (
                <polygon
                  key={`poly-${planet.planetId}`}
                  points={getPolygonPoints(planet)}
                  fill={color}
                  fillOpacity={0.12}
                  stroke={color}
                  strokeWidth={2}
                  strokeOpacity={0.8}
                  className="transition-all duration-300"
                />
              );
            })}

          {/* Planet dots on polygon vertices */}
          {normalized
            .filter((p) => selectedPlanets.has(p.planetId))
            .map((planet) => {
              const color = PLANET_COLORS[planet.planetId] || '#888';
              return AXIS_LABELS.map((axis, i) => {
                const value = planet[axis.key] as number;
                const angle = angleSlice * i - Math.PI / 2;
                const r = rScale(value);
                return (
                  <circle
                    key={`dot-${planet.planetId}-${i}`}
                    cx={cx + r * Math.cos(angle)}
                    cy={cy + r * Math.sin(angle)}
                    r={3}
                    fill={color}
                    stroke="#0a0e27"
                    strokeWidth={1}
                  />
                );
              });
            })}

          {/* Axis labels (outermost) — clickable for drill-down */}
          {axisPoints.map((pt, i) => {
            const axis = AXIS_LABELS[i];
            const isHovered = hoveredAxis === axis.key;
            return (
              <text
                key={`label-${i}`}
                x={pt.labelX}
                y={pt.labelY}
                textAnchor="middle"
                dominantBaseline="central"
                className="cursor-pointer select-none"
                fill={isHovered ? '#f0d48a' : '#8a8478'}
                fontSize={11}
                fontWeight={isHovered ? 700 : 500}
                onMouseEnter={() => setHoveredAxis(axis.key)}
                onMouseLeave={() => setHoveredAxis(null)}
              >
                {tl(axis.label, locale)}
              </text>
            );
          })}
        </svg>
      </div>

      {/* Axis detail tooltip — shown below the chart when an axis is hovered */}
      {hoveredAxis && (
        <div className="text-center text-xs text-text-secondary animate-fade-in-up">
          <span className="text-gold-light font-semibold">
            {tl(AXIS_LABELS.find((a) => a.key === hoveredAxis)!.label, locale)}
          </span>
          {' — '}
          {isDevanagari
            ? AXIS_DESCRIPTIONS[hoveredAxis]?.hi
            : AXIS_DESCRIPTIONS[hoveredAxis]?.en}
        </div>
      )}
    </div>
  );
}
```

- [ ] **Step 2: Verify the component renders without errors**

Run: `npx tsc --noEmit -p tsconfig.build-check.json`
Expected: 0 errors

- [ ] **Step 3: Commit**

```bash
git add src/components/kundali/ShadbalaRadar.tsx
git commit -m "feat(6G): add ShadbalaRadar component with D3 radar chart"
```

---

### Task 3: Drill-Down Breakdown Panel

**Files:**
- Create: `src/components/kundali/ShadbalaRadarDetail.tsx`

When a user clicks an axis label, this panel expands below the chart showing the sub-component breakdown for the selected Bala, per planet.

- [ ] **Step 1: Create the detail panel component**

```tsx
// src/components/kundali/ShadbalaRadarDetail.tsx
'use client';

import { GrahaIconById } from '@/components/icons/GrahaIcons';
import type { ShadBalaComplete } from '@/lib/kundali/shadbala';
import type { Locale } from '@/types/panchang';

const STHANA_ROWS: { key: keyof ShadBalaComplete['sthanaBreakdown']; en: string; hi: string }[] = [
  { key: 'ucchaBala', en: 'Uchcha (Exaltation)', hi: 'उच्चबल' },
  { key: 'saptavargaja', en: 'Saptavargaja (7-division)', hi: 'सप्तवर्गज' },
  { key: 'ojhayugmaRashi', en: 'Ojhayugma Rashi', hi: 'ओजयुग्म राशि' },
  { key: 'ojhayugmaNavamsha', en: 'Ojhayugma Navamsha', hi: 'ओजयुग्म नवांश' },
  { key: 'kendradiBala', en: 'Kendradi', hi: 'केन्द्रादि' },
  { key: 'drekkanaBala', en: 'Drekkana', hi: 'द्रेष्काण' },
];

const KALA_ROWS: { key: keyof ShadBalaComplete['kalaBreakdown']; en: string; hi: string }[] = [
  { key: 'natonnataBala', en: 'Natonnata (Day/Night)', hi: 'नतोन्नत' },
  { key: 'pakshaBala', en: 'Paksha (Lunar phase)', hi: 'पक्ष' },
  { key: 'tribhagaBala', en: 'Tribhaga (1/3 of day)', hi: 'त्रिभाग' },
  { key: 'abdaBala', en: 'Abda (Year lord)', hi: 'अब्द' },
  { key: 'masaBala', en: 'Masa (Month lord)', hi: 'मास' },
  { key: 'varaBala', en: 'Vara (Weekday lord)', hi: 'वार' },
  { key: 'horaBala', en: 'Hora (Hour lord)', hi: 'होरा' },
  { key: 'ayanaBala', en: 'Ayana (Declination)', hi: 'अयन' },
  { key: 'yuddhaBala', en: 'Yuddha (War)', hi: 'युद्ध' },
];

interface Props {
  selectedAxis: string;
  shadbala: ShadBalaComplete[];
  locale: Locale;
}

export default function ShadbalaRadarDetail({ selectedAxis, shadbala, locale }: Props) {
  const isDevanagari = locale === 'hi' || locale === 'sa' || locale === 'mai' || locale === 'mr';

  // Only Sthana and Kala have sub-breakdowns
  const hasBreakdown = selectedAxis === 'sthanaBala' || selectedAxis === 'kalaBala';

  if (!hasBreakdown) {
    // For other axes, show raw value + explanation per planet
    const axisKey = selectedAxis as keyof ShadBalaComplete;
    return (
      <div className="rounded-xl bg-gradient-to-br from-[#2d1b69]/30 via-[#1a1040]/40 to-[#0a0e27] border border-gold-primary/12 p-4 animate-fade-in-up">
        <div className="flex flex-wrap justify-center gap-4">
          {shadbala.map((s) => {
            const val = s[axisKey];
            const display = typeof val === 'number' ? val.toFixed(2) : String(val);
            return (
              <div key={s.planetId} className="flex items-center gap-2 text-xs">
                <GrahaIconById id={s.planetId} size={16} />
                <span className="text-text-secondary">{s.planet}</span>
                <span className="text-gold-light font-mono font-semibold">{display}</span>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  const rows = selectedAxis === 'sthanaBala' ? STHANA_ROWS : KALA_ROWS;

  return (
    <div className="rounded-xl bg-gradient-to-br from-[#2d1b69]/30 via-[#1a1040]/40 to-[#0a0e27] border border-gold-primary/12 p-4 overflow-x-auto animate-fade-in-up">
      <table className="w-full text-xs">
        <thead>
          <tr className="border-b border-gold-primary/15">
            <th className="text-left py-2 px-2 text-text-secondary"></th>
            {shadbala.map((s) => (
              <th key={s.planetId} className="text-center py-2 px-2 min-w-[60px]">
                <GrahaIconById id={s.planetId} size={16} />
                <p className="text-gold-light text-[10px] mt-0.5">{s.planet}</p>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.key} className="hover:bg-gold-primary/3">
              <td className="py-1.5 px-2 text-text-secondary whitespace-nowrap">
                {isDevanagari ? row.hi : row.en}
              </td>
              {shadbala.map((s) => {
                const breakdown = selectedAxis === 'sthanaBala' ? s.sthanaBreakdown : s.kalaBreakdown;
                const val = breakdown[row.key as keyof typeof breakdown];
                return (
                  <td key={s.planetId} className="py-1.5 px-2 text-center font-mono text-text-secondary">
                    {typeof val === 'number' ? val.toFixed(2) : '—'}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
```

- [ ] **Step 2: Verify type-check**

Run: `npx tsc --noEmit -p tsconfig.build-check.json`
Expected: 0 errors

- [ ] **Step 3: Commit**

```bash
git add src/components/kundali/ShadbalaRadarDetail.tsx
git commit -m "feat(6G): add ShadbalaRadarDetail drill-down panel"
```

---

### Task 4: Wire Drill-Down into Radar Component

**Files:**
- Modify: `src/components/kundali/ShadbalaRadar.tsx`

Add click-to-drill-down: clicking an axis label opens the `ShadbalaRadarDetail` panel below the chart.

- [ ] **Step 1: Add selectedAxis state and ShadbalaRadarDetail import to ShadbalaRadar.tsx**

At the top of the file, add the import:
```tsx
import ShadbalaRadarDetail from './ShadbalaRadarDetail';
```

In the component body, after the existing `hoveredAxis` state, add:
```tsx
const [selectedAxis, setSelectedAxis] = useState<string | null>(null);
```

- [ ] **Step 2: Make axis labels clickable**

Replace the axis label `<text>` element's event handlers. Find the `onMouseEnter` / `onMouseLeave` section in the axis labels map and replace:

```tsx
              <text
                key={`label-${i}`}
                x={pt.labelX}
                y={pt.labelY}
                textAnchor="middle"
                dominantBaseline="central"
                className="cursor-pointer select-none"
                fill={isHovered ? '#f0d48a' : '#8a8478'}
                fontSize={11}
                fontWeight={isHovered ? 700 : 500}
                onMouseEnter={() => setHoveredAxis(axis.key)}
                onMouseLeave={() => setHoveredAxis(null)}
```

Replace with:

```tsx
              <text
                key={`label-${i}`}
                x={pt.labelX}
                y={pt.labelY}
                textAnchor="middle"
                dominantBaseline="central"
                className="cursor-pointer select-none"
                fill={selectedAxis === axis.key ? '#f0d48a' : isHovered ? '#f0d48a' : '#8a8478'}
                fontSize={11}
                fontWeight={selectedAxis === axis.key || isHovered ? 700 : 500}
                onMouseEnter={() => setHoveredAxis(axis.key)}
                onMouseLeave={() => setHoveredAxis(null)}
                onClick={() => setSelectedAxis(selectedAxis === axis.key ? null : axis.key)}
```

- [ ] **Step 3: Add the detail panel below the axis tooltip**

After the closing `</div>` of the axis detail tooltip section (the `{hoveredAxis && (...)}` block), add:

```tsx
      {/* Drill-down breakdown panel */}
      {selectedAxis && (
        <ShadbalaRadarDetail
          selectedAxis={selectedAxis}
          shadbala={shadbala}
          locale={locale}
        />
      )}
```

- [ ] **Step 4: Verify type-check**

Run: `npx tsc --noEmit -p tsconfig.build-check.json`
Expected: 0 errors

- [ ] **Step 5: Commit**

```bash
git add src/components/kundali/ShadbalaRadar.tsx
git commit -m "feat(6G): wire drill-down panel into radar chart"
```

---

### Task 5: Integrate into Kundali Page

**Files:**
- Modify: `src/app/[locale]/kundali/page.tsx` (lines ~2411-2427)

Add the `ShadbalaRadar` component above the existing `ShadbalaTab` table in the shadbala tab section.

- [ ] **Step 1: Add dynamic import at the top of the kundali page**

Find the other `next/dynamic` imports near the top of `src/app/[locale]/kundali/page.tsx` (there should be several already). Add alongside them:

```tsx
const ShadbalaRadar = dynamic(() => import('@/components/kundali/ShadbalaRadar'), { ssr: false });
```

- [ ] **Step 2: Insert the radar above the ShadbalaTab table**

In `src/app/[locale]/kundali/page.tsx`, find the shadbala tab section (around line 2411):

```tsx
          {activeTab === 'shadbala' && kundali.fullShadbala && (
            <div className="space-y-6">
              <a href={`/${locale}/learn/shadbala`} className="text-gold-primary/60 text-xs hover:text-gold-light transition-colors inline-flex items-center gap-1">
                {locale === 'en' || isTamil ? 'Learn about Shadbala \u2192' : 'षड्बल के बारे में जानें \u2192'}
              </a>
              <InfoBlock
```

After the closing `</InfoBlock>` tag (which is followed by `<ShadbalaInterpretation`) and before `<ShadbalaInterpretation`, insert:

```tsx
              <ShadbalaRadar shadbala={kundali.fullShadbala} locale={locale} />
```

So the order becomes:
1. Learn link
2. InfoBlock
3. **ShadbalaRadar** (new)
4. ShadbalaInterpretation
5. ShadbalaTab (existing table)

- [ ] **Step 3: Verify type-check**

Run: `npx tsc --noEmit -p tsconfig.build-check.json`
Expected: 0 errors

- [ ] **Step 4: Verify build**

Run: `npx next build`
Expected: Build succeeds with 0 errors

- [ ] **Step 5: Commit**

```bash
git add src/app/[locale]/kundali/page.tsx
git commit -m "feat(6G): integrate ShadbalaRadar into kundali page shadbala tab"
```

---

### Task 6: Browser Verification

**Files:** None (testing only)

- [ ] **Step 1: Start dev server**

Run: `npx next dev --turbopack`

- [ ] **Step 2: Generate a kundali**

Open `http://localhost:3000/en/kundali` in a browser. Fill in the birth form with:
- Name: Test
- Date: 1990-01-15
- Time: 10:30
- Location: Corseaux, Switzerland (46.46°N, 6.80°E)

Click Generate.

- [ ] **Step 3: Navigate to Shadbala tab**

Click the "Shadbala" tab in the tab strip. Verify:
- [ ] The radar chart appears above the interpretation section
- [ ] 3 planets are selected by default (the top 3 by strength ratio)
- [ ] The radar shows a hexagonal grid with 6 axes
- [ ] Planet polygons are visible with distinct colors
- [ ] Hovering an axis label highlights it and shows a description below
- [ ] Clicking an axis label opens the drill-down panel
- [ ] Clicking "Sthana" shows 6 sub-rows (Uchcha, Saptavargaja, etc.)
- [ ] Clicking "Kāla" shows 9 sub-rows (Natonnata, Paksha, etc.)
- [ ] Clicking other axes shows raw values per planet
- [ ] Toggling planets on/off updates the radar chart
- [ ] The radar is responsive — looks good on mobile width (< 640px)
- [ ] No console errors

- [ ] **Step 4: Test with Hindi locale**

Switch to `http://localhost:3000/hi/kundali`, generate a chart, and verify:
- [ ] Axis labels are in Devanagari
- [ ] Breakdown panel labels are in Devanagari
- [ ] No missing translations or raw key paths

- [ ] **Step 5: Final commit with verification note**

```bash
git add -A
git commit -m "feat(6G): shadbala strength radar — complete with drill-down

Interactive D3.js radar chart on the kundali Shadbala tab:
- 6-axis radar (Sthana, Dig, Kala, Cheshta, Naisargika, Drik)
- Per-planet polygon overlays with toggle buttons
- Click-to-drill-down breakdown panels for Sthana (6 sub-components) and Kala (9 sub-components)
- Normalized 0-100 scale for fair cross-axis comparison
- Responsive, dark theme, bilingual (EN/HI)

Verified in browser: EN and HI locales, mobile and desktop."
```

---

### Task 7: Run Full Test Suite + Build

**Files:** None (verification only)

- [ ] **Step 1: Run vitest**

Run: `npx vitest run`
Expected: All existing tests pass + new `shadbala-normalize.test.ts` passes

- [ ] **Step 2: Run type-check**

Run: `npx tsc --noEmit -p tsconfig.build-check.json`
Expected: 0 errors

- [ ] **Step 3: Run production build**

Run: `npx next build`
Expected: Build succeeds, 0 errors

---

## Summary

| Task | What | Files | Est. |
|------|------|-------|------|
| 1 | Normalization utility + tests | `shadbala-normalize.ts`, test file | 10 min |
| 2 | Radar chart component | `ShadbalaRadar.tsx` | 20 min |
| 3 | Drill-down panel | `ShadbalaRadarDetail.tsx` | 15 min |
| 4 | Wire drill-down into radar | modify `ShadbalaRadar.tsx` | 5 min |
| 5 | Integrate into kundali page | modify `page.tsx` | 5 min |
| 6 | Browser verification | — | 15 min |
| 7 | Full test suite + build | — | 5 min |
| **Total** | | **3 new files, 2 modified** | **~75 min** |
