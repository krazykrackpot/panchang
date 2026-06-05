/**
 * North Indian diamond chart — canonical 12-house SVG path geometry.
 *
 * 500×500 viewBox, 30px inset, anchored at the four corners + four
 * mid-edges of the diamond. Audit P5f #23 extracted these from 5
 * duplicate copies:
 *
 *   - src/components/kundali/ChartNorth.tsx
 *   - src/components/kundali/MiniChart.tsx
 *   - src/components/kundali/MiniChartNorth.tsx
 *   - src/components/learn/ExampleKundaliChart.tsx
 *   - src/components/learn/HouseHighlightChart.tsx
 *
 * Each consuming component still owns its own centroid (`cx/cy`) and
 * label positions (`signX/signY`, `labelX/labelY`) — those are visual
 * idiom choices, not geometry. Only the `d` (path) attribute is
 * canonical here, because that is what determines house shape and
 * where one bug in a single file silently disagreed with the others.
 *
 * House numbering follows North Indian convention:
 *
 *     +--------+--------+
 *     | 12 \  1  / 2    |
 *     |     \  /        |
 *     |   11 X 3        |
 *     |     /  \        |
 *     | 10 /  ...        |
 *
 * 1 = Lagna (Ascendant), 4 = Patala (bottom), 7 = Setting (right),
 * 10 = Karma (top). Anti-clockwise from 1.
 */

export const NORTH_DIAMOND_HOUSE_PATHS: Readonly<Record<number, string>> = {
  1:  'M 250 30 L 140 140 L 250 250 L 360 140 Z',
  2:  'M 30 30 L 140 140 L 250 30 Z',
  3:  'M 30 30 L 30 250 L 140 140 Z',
  4:  'M 30 250 L 140 140 L 250 250 L 140 360 Z',
  5:  'M 30 250 L 140 360 L 30 470 Z',
  6:  'M 30 470 L 140 360 L 250 470 Z',
  7:  'M 250 470 L 140 360 L 250 250 L 360 360 Z',
  8:  'M 250 470 L 360 360 L 470 470 Z',
  9:  'M 470 470 L 360 360 L 470 250 Z',
  10: 'M 470 250 L 360 360 L 250 250 L 360 140 Z',
  11: 'M 470 250 L 360 140 L 470 30 Z',
  12: 'M 470 30 L 360 140 L 250 30 Z',
} as const;

/**
 * SVG viewBox dimensions the paths are designed for. Multiply by
 * `size / NORTH_DIAMOND_VIEWBOX` to derive intrinsic-size scaling.
 */
export const NORTH_DIAMOND_VIEWBOX = 500;
