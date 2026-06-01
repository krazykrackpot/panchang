import type { ShadBalaComplete } from './shadbala';

// ---------------------------------------------------------------------------
// NormalizedBala  –  6 bala axes scaled to 0-100 plus passthrough fields
// needed for drill-down tables.
// ---------------------------------------------------------------------------

export interface NormalizedBala {
  planet: string;
  planetId: number;
  // Normalized axes (0-100). kalaBala can be null on polar non-rise charts —
  // mirrors the source ShadBalaComplete shape so the radar/table renders '—'
  // for the affected axis instead of plotting a fictional 0.
  sthanaBala: number;
  digBala: number;
  kalaBala: number | null;
  cheshtaBala: number;
  naisargikaBala: number;
  drikBala: number;
  // Passthrough for drill-down
  sthanaBreakdown: ShadBalaComplete['sthanaBreakdown'];
  kalaBreakdown: ShadBalaComplete['kalaBreakdown'];
  totalPinda: number | null;
  rupas: number | null;
  strengthRatio: number | null;
  rank: number;
}

type BalaKey = 'sthanaBala' | 'digBala' | 'kalaBala' | 'cheshtaBala' | 'naisargikaBala' | 'drikBala';

const BALA_KEYS: BalaKey[] = [
  'sthanaBala', 'digBala', 'kalaBala', 'cheshtaBala', 'naisargikaBala', 'drikBala',
];

/**
 * Normalize a raw ShadBalaComplete[] to 0-100 per axis.
 *
 * Algorithm per axis:
 *  1. Shift all values so the minimum is 0 (handles negative drikBala).
 *  2. Scale so the maximum maps to 100.
 *  3. If all values are equal (max-shifted = 0), return 50 for all.
 */
export function normalizeShadbala(data: ShadBalaComplete[]): NormalizedBala[] {
  if (data.length === 0) return [];

  // Pre-compute per-axis shift + scale factors.
  //
  // Strategy:
  //  - If the axis has negative values, shift the entire range up so the minimum = 0,
  //    then scale the shifted range to [0, 100].
  //  - If all values are non-negative, scale relative to 0 (i.e. just divide by max),
  //    so the ratios between planets are preserved (e.g. Sun=200, Moon=100 → 100 vs 50).
  //  - If every planet has the same value, return 50 for all.
  const axisParams: Record<BalaKey, { shift: number; scale: number }> = {} as never;

  for (const key of BALA_KEYS) {
    // kalaBala can be null on polar non-rise charts. Exclude nulls from
    // the shift/scale calibration so a polar chart in the dataset doesn't
    // skew the normalization for the non-polar planets. Null values are
    // preserved as null in the per-planet output below.
    const rawValuesAll = data.map(d => d[key]);
    const rawValues = rawValuesAll.filter((v): v is number => v !== null);
    if (rawValues.length === 0) {
      // Every planet null on this axis (entire chart at polar non-rise).
      axisParams[key] = { shift: 0, scale: 0 };
      continue;
    }
    const minVal = Math.min(...rawValues);
    // Shift only when negative values are present
    const shift = minVal < 0 ? minVal : 0;
    const shifted = rawValues.map(v => v - shift);
    const maxShifted = Math.max(...shifted);

    // Detect all-equal across the (non-null) dataset.
    const allEqual = rawValues.every(v => v === rawValues[0]);

    axisParams[key] = {
      shift,
      // allEqual → scale = 0 signals "emit 50 for all"
      scale: allEqual ? 0 : 100 / maxShifted,
    };
  }

  return data.map(d => {
    // Among the 6 axes only kalaBala can be null (polar non-rise propagation
    // from horaBala/varaBala). All other axes always have a numeric value.
    // Narrow the local type accordingly so the NormalizedBala spread typechecks.
    const normalized: { sthanaBala: number; digBala: number; kalaBala: number | null;
                        cheshtaBala: number; naisargikaBala: number; drikBala: number } = {
      sthanaBala: 0, digBala: 0, kalaBala: 0,
      cheshtaBala: 0, naisargikaBala: 0, drikBala: 0,
    };
    for (const key of BALA_KEYS) {
      const v = d[key];
      if (v === null) {
        // Polar non-rise — propagate null on the affected axis (kalaBala).
        // Radar/table renders '—' instead of plotting a fictional 0.
        (normalized as Record<BalaKey, number | null>)[key] = null;
        continue;
      }
      const { shift, scale } = axisParams[key];
      if (scale === 0) {
        // All planets have the same value on this axis → neutral 50
        normalized[key] = 50;
      } else {
        normalized[key] = (v - shift) * scale;
      }
    }

    return {
      planet: d.planet,
      planetId: d.planetId,
      ...normalized,
      sthanaBreakdown: d.sthanaBreakdown,
      kalaBreakdown: d.kalaBreakdown,
      totalPinda: d.totalPinda,
      rupas: d.rupas,
      strengthRatio: d.strengthRatio,
      rank: d.rank,
    };
  });
}
