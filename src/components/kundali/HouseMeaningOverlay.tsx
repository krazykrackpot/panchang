'use client';

import { houseShortLabel } from '@/lib/i18n/house-meanings';

/**
 * Watermark layer that renders a one-word plain-language label inside
 * each of the 12 chart houses. Solves the symbol-decoding problem for
 * first-timers ("Self", "Money", "Career", …) without changing the
 * canonical North-Indian or South-Indian chart geometry.
 *
 * Consumers pass a `housePositions` map (house number → {x, y} centre
 * coordinate in the chart's SVG coordinate space). The overlay then
 * renders one <text> element per house at the matching position. The
 * label sits BEHIND planet glyphs (low opacity, mix-blend hint) so it
 * informs without competing with the primary chart content.
 *
 * Used by ChartNorth + ChartSouth. Toggle gating is owned by the
 * parent; this component just renders when mounted.
 */

interface HousePosition {
  x: number;
  y: number;
}

interface HouseMeaningOverlayProps {
  /** Map from house number (1-12) → SVG centre coordinates of that house cell. */
  housePositions: Record<number, HousePosition>;
  /** Active locale. Used to pick the right script for each watermark. */
  locale: string;
  /** Optional font-size override. Defaults to 14 — sized to read at
   *  typical chart render widths (≥ 280px). */
  fontSize?: number;
  /** Optional offset to shift the watermark relative to the cell centre.
   *  Useful when the chart already crowds the centre with planet glyphs;
   *  shifts the label to a less-busy corner of the cell. Defaults to 0. */
  offsetY?: number;
}

export function HouseMeaningOverlay({
  housePositions,
  locale,
  fontSize = 14,
  offsetY = 0,
}: HouseMeaningOverlayProps) {
  return (
    <g aria-hidden="true" data-house-meaning-overlay>
      {Object.entries(housePositions).map(([houseStr, pos]) => {
        const houseNum = Number(houseStr);
        const label = houseShortLabel(houseNum, locale);
        if (!label) return null;
        return (
          <text
            key={houseNum}
            x={pos.x}
            y={pos.y + offsetY}
            textAnchor="middle"
            dominantBaseline="middle"
            // Low-opacity gold so the label whispers rather than shouts.
            // Planet glyphs render on top with full opacity and remain
            // the primary visual.
            fill="#d4a853"
            fillOpacity={0.30}
            fontSize={fontSize}
            fontWeight={600}
            // Italics distinguish the meta-label from the canonical
            // sign/planet text rendered by the chart itself.
            fontStyle="italic"
            style={{ pointerEvents: 'none', userSelect: 'none' }}
          >
            {label}
          </text>
        );
      })}
    </g>
  );
}
