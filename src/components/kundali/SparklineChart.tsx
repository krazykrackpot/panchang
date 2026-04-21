'use client';

/**
 * SparklineChart — tiny SVG line chart for domain score trends.
 *
 * Renders a smooth polyline with a gradient fill beneath it.
 * Trend determines colour: gold for stable, emerald for rising, red for falling.
 * The rightmost point gets a pulsing dot to represent the current score.
 */

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface SparklineChartProps {
  /** 6-12 monthly scores (0-10). */
  data: number[];
  /** Direction of the trend — determines line colour. */
  trend: 'rising' | 'falling' | 'stable';
  /** SVG width in px. Default 120. */
  width?: number;
  /** SVG height in px. Default 32. */
  height?: number;
  /** Show a pulsing dot at the current (rightmost) value. Default true. */
  showCurrentDot?: boolean;
}

// ---------------------------------------------------------------------------
// Colour mapping
// ---------------------------------------------------------------------------

const TREND_COLORS: Record<SparklineChartProps['trend'], string> = {
  rising: '#34d399',  // emerald-400
  falling: '#ef4444', // red-500
  stable: '#d4a853',  // gold-primary
};

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function SparklineChart({
  data,
  trend,
  width = 120,
  height = 32,
  showCurrentDot = true,
}: SparklineChartProps) {
  // ---- Edge case: no data ----
  if (!data || data.length === 0) {
    return (
      <svg
        width={width}
        height={height}
        viewBox={`0 0 ${width} ${height}`}
        aria-hidden="true"
        role="img"
      >
        <line
          x1={0}
          y1={height / 2}
          x2={width}
          y2={height / 2}
          stroke={TREND_COLORS.stable}
          strokeWidth={1.5}
          strokeDasharray="4 4"
          opacity={0.3}
        />
      </svg>
    );
  }

  const color = TREND_COLORS[trend];
  const gradientId = `sparkline-grad-${trend}-${width}-${height}`;

  // Padding so the dot doesn't clip
  const padX = 4;
  const padY = 4;
  const innerW = width - padX * 2;
  const innerH = height - padY * 2;

  // ---- Edge case: single data point — render a dot ----
  if (data.length === 1) {
    const cx = width / 2;
    const cy = height / 2;
    return (
      <svg
        width={width}
        height={height}
        viewBox={`0 0 ${width} ${height}`}
        aria-hidden="true"
        role="img"
      >
        <circle cx={cx} cy={cy} r={3} fill={color}>
          {showCurrentDot && (
            <animate
              attributeName="r"
              values="3;4.5;3"
              dur="2s"
              repeatCount="indefinite"
            />
          )}
        </circle>
      </svg>
    );
  }

  // ---- Map data to SVG coordinates ----
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1; // avoid division by zero for flat data

  const points = data.map((v, i) => {
    const x = padX + (i / (data.length - 1)) * innerW;
    // Invert Y — SVG y=0 is top
    const y = padY + (1 - (v - min) / range) * innerH;
    return { x, y };
  });

  // Build polyline points string
  const polylinePoints = points.map(p => `${p.x},${p.y}`).join(' ');

  // Build closed polygon for the gradient fill (line + bottom edge)
  const fillPoints =
    polylinePoints +
    ` ${points[points.length - 1].x},${height} ${points[0].x},${height}`;

  const lastPoint = points[points.length - 1];

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      aria-hidden="true"
      role="img"
      className="flex-shrink-0"
    >
      <defs>
        <linearGradient id={gradientId} x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity={0.25} />
          <stop offset="100%" stopColor={color} stopOpacity={0.02} />
        </linearGradient>
      </defs>

      {/* Gradient fill beneath the line */}
      <polygon points={fillPoints} fill={`url(#${gradientId})`} />

      {/* The sparkline */}
      <polyline
        points={polylinePoints}
        fill="none"
        stroke={color}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Current-value dot (pulsing) */}
      {showCurrentDot && lastPoint && (
        <>
          {/* Glow ring */}
          <circle cx={lastPoint.x} cy={lastPoint.y} r={3} fill={color} opacity={0.3}>
            <animate
              attributeName="r"
              values="3;6;3"
              dur="2.5s"
              repeatCount="indefinite"
            />
            <animate
              attributeName="opacity"
              values="0.3;0.08;0.3"
              dur="2.5s"
              repeatCount="indefinite"
            />
          </circle>
          {/* Solid dot */}
          <circle cx={lastPoint.x} cy={lastPoint.y} r={3} fill={color} />
        </>
      )}
    </svg>
  );
}
