'use client';

interface MiniChartNorthProps {
  positions: { planetId: number; house: number; fromLagna?: boolean }[];
  size?: number;
}

const PLANET_ABBR: Record<number, string> = {
  0: 'Su', 1: 'Mo', 2: 'Ma', 3: 'Me', 4: 'Ju', 5: 'Ve', 6: 'Sa', 7: 'Ra', 8: 'Ke',
};

const PLANET_SYMBOLS: Record<number, string> = {
  0: '☉', 1: '☽', 2: '♂', 3: '☿', 4: '♃', 5: '♀', 6: '♄', 7: '☊', 8: '☋',
};

const PLANET_COLORS: Record<number, string> = {
  0: '#f0a020', 1: '#b0c8f0', 2: '#e84040', 3: '#50d890',
  4: '#f0c030', 5: '#f080c0', 6: '#8080d0', 7: '#70c0b0', 8: '#c07050',
};

// House geometry scaled to 500x500 viewBox (matches ChartNorth.tsx layout)
// cx/cy = centre of each triangular house region for placing planet text
const HOUSE_DATA: Record<number, { path: string; cx: number; cy: number; labelX: number; labelY: number }> = {
  1:  { path: 'M 250 30 L 140 140 L 250 250 L 360 140 Z', cx: 250, cy: 130, labelX: 250, labelY: 60 },
  2:  { path: 'M 30 30 L 140 140 L 250 30 Z',             cx: 138, cy: 62,  labelX: 100, labelY: 42 },
  3:  { path: 'M 30 30 L 30 250 L 140 140 Z',             cx: 60,  cy: 138, labelX: 40,  labelY: 100 },
  4:  { path: 'M 30 250 L 140 140 L 250 250 L 140 360 Z', cx: 130, cy: 250, labelX: 60,  labelY: 250 },
  5:  { path: 'M 30 250 L 140 360 L 30 470 Z',            cx: 60,  cy: 362, labelX: 40,  labelY: 400 },
  6:  { path: 'M 30 470 L 140 360 L 250 470 Z',           cx: 138, cy: 438, labelX: 100, labelY: 458 },
  7:  { path: 'M 250 470 L 140 360 L 250 250 L 360 360 Z',cx: 250, cy: 370, labelX: 250, labelY: 440 },
  8:  { path: 'M 250 470 L 360 360 L 470 470 Z',          cx: 362, cy: 438, labelX: 400, labelY: 458 },
  9:  { path: 'M 470 470 L 360 360 L 470 250 Z',          cx: 440, cy: 362, labelX: 460, labelY: 400 },
  10: { path: 'M 470 250 L 360 360 L 250 250 L 360 140 Z',cx: 370, cy: 250, labelX: 440, labelY: 250 },
  11: { path: 'M 470 250 L 360 140 L 470 30 Z',           cx: 440, cy: 138, labelX: 460, labelY: 100 },
  12: { path: 'M 470 30 L 360 140 L 250 30 Z',            cx: 362, cy: 62,  labelX: 400, labelY: 42 },
};

export default function MiniChartNorth({ positions, size = 200 }: MiniChartNorthProps) {
  // Group planets by house
  const planetsByHouse: Record<number, number[]> = {};
  for (const p of positions) {
    if (!planetsByHouse[p.house]) planetsByHouse[p.house] = [];
    planetsByHouse[p.house].push(p.planetId);
  }

  return (
    <div
      className="border border-gold-primary/20 rounded-xl overflow-hidden"
      style={{ width: size, height: size }}
    >
      <svg
        viewBox="0 0 500 500"
        width={size}
        height={size}
        role="img"
        aria-label="Mini North Indian birth chart showing yoga planet positions"
      >
        {/* Background */}
        <rect x="0" y="0" width="500" height="500" fill="#0a0e27" />

        {/* Outer border */}
        <rect x="28" y="28" width="444" height="444" fill="none" stroke="#d4a853" strokeWidth="1.2" strokeOpacity="0.3" />

        {/* Diamond */}
        <polygon points="250,30 470,250 250,470 30,250" fill="none" stroke="#d4a853" strokeWidth="1" strokeOpacity="0.3" />

        {/* Diagonal lines (corners to centre) */}
        <line x1="30" y1="30" x2="250" y2="250" stroke="#d4a853" strokeWidth="0.6" strokeOpacity="0.2" />
        <line x1="470" y1="30" x2="250" y2="250" stroke="#d4a853" strokeWidth="0.6" strokeOpacity="0.2" />
        <line x1="30" y1="470" x2="250" y2="250" stroke="#d4a853" strokeWidth="0.6" strokeOpacity="0.2" />
        <line x1="470" y1="470" x2="250" y2="250" stroke="#d4a853" strokeWidth="0.6" strokeOpacity="0.2" />

        {/* House numbers + planets */}
        {Object.entries(HOUSE_DATA).map(([houseStr, { labelX, labelY, cx, cy }]) => {
          const houseNum = parseInt(houseStr);
          const planets = planetsByHouse[houseNum] || [];

          return (
            <g key={houseNum}>
              {/* House number — tiny, subdued */}
              <text
                x={labelX}
                y={labelY}
                fill="#d4a853"
                fillOpacity="0.35"
                fontSize="20"
                fontWeight="600"
                textAnchor="middle"
                dominantBaseline="middle"
                style={{ fontFamily: 'Inter, system-ui, sans-serif' }}
              >
                {houseNum}
              </text>

              {/* Planets in this house */}
              {planets.map((planetId, idx) => {
                const color = PLANET_COLORS[planetId] ?? '#e6e2d8';
                const abbr = PLANET_ABBR[planetId] ?? '??';
                const count = planets.length;
                // Stack planets vertically, centred on the house centroid
                const stackOffset = (idx - (count - 1) / 2) * 30;

                return (
                  <text
                    key={planetId}
                    x={cx}
                    y={cy + stackOffset}
                    fill={color}
                    fontSize="22"
                    fontWeight="700"
                    textAnchor="middle"
                    dominantBaseline="middle"
                    style={{ fontFamily: 'Inter, system-ui, sans-serif' }}
                  >
                    {abbr}
                  </text>
                );
              })}
            </g>
          );
        })}
      </svg>
    </div>
  );
}
