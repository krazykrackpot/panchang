'use client';

import ChartNorth from '@/components/kundali/ChartNorth';
import type { ChartData } from '@/types/kundali';

/**
 * ExampleChart — renders a North Indian diamond chart for learn module worked examples.
 *
 * Usage:
 *   <ExampleChart
 *     ascendant={1}  // Aries = 1, Taurus = 2, etc.
 *     planets={{ 2: [10], 4: [2], 5: [7] }}  // house → planet IDs
 *     title="Mars in 10th, Jupiter in 2nd"
 *     highlight={[10, 2]}  // houses to visually highlight
 *   />
 *
 * Planet IDs: 0=Sun, 1=Moon, 2=Mars, 3=Mercury, 4=Jupiter, 5=Venus, 6=Saturn, 7=Rahu, 8=Ketu
 * House numbers are 1-12 from the ascendant.
 */

interface ExampleChartProps {
  /** Ascendant sign (1=Aries, 2=Taurus, ..., 12=Pisces) */
  ascendant: number;
  /** Map of house number (1-12) → array of planet IDs in that house */
  planets: Record<number, number[]>;
  /** Chart title */
  title?: string;
  /** Houses to visually emphasize */
  highlight?: number[];
  /** Retrograde planet IDs */
  retrograde?: number[];
  /** Size in pixels (default 280) */
  size?: number;
}

export default function ExampleChart({
  ascendant,
  planets,
  title = 'Example Chart',
  highlight,
  retrograde = [],
  size = 280,
}: ExampleChartProps) {
  // Build the ChartData structure: 12 houses, each with planet IDs
  const houses: number[][] = Array.from({ length: 12 }, () => []);
  for (const [houseStr, planetIds] of Object.entries(planets)) {
    const houseIdx = parseInt(houseStr) - 1;
    if (houseIdx >= 0 && houseIdx < 12) {
      houses[houseIdx] = planetIds;
    }
  }

  const chartData: ChartData = {
    houses,
    ascendantDeg: (ascendant - 1) * 30 + 15, // midpoint of the sign
    ascendantSign: ascendant,
  };

  return (
    <div className="flex justify-center my-4">
      <div className="inline-block">
        <ChartNorth
          data={chartData}
          title={title}
          size={size}
          retrogradeIds={new Set(retrograde)}
        />
        {highlight && highlight.length > 0 && (
          <div className="text-center mt-2 text-[10px] text-gold-primary/50">
            {highlight.map(h => `H${h}`).join(', ')} highlighted in the example
          </div>
        )}
      </div>
    </div>
  );
}
