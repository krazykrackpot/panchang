'use client';

/**
 * Compact visual house indicator — a 4×3 grid showing 12 houses
 * with highlighted houses for quick reference. Used in interpretation
 * sections to make "House 7" visually concrete.
 *
 * North Indian house numbering layout:
 *        12  1  2
 *     11          3
 *     10          4
 *        9  7  5
 *           8
 *        (simplified to 4×3 grid)
 */

interface HouseVisualProps {
  /** Houses to highlight (1-12). Can be a single number or array. */
  highlight: number | number[];
  /** Optional: significations to show for highlighted house */
  label?: string;
  /** Size variant */
  size?: 'sm' | 'md';
  /** Color for highlighted houses */
  color?: 'gold' | 'emerald' | 'red' | 'amber' | 'sky';
}

const HOUSE_SIGNIFICATIONS: Record<number, { en: string; hi: string; icon: string }> = {
  1: { en: 'Self', hi: 'आत्म', icon: '👤' },
  2: { en: 'Wealth', hi: 'धन', icon: '💰' },
  3: { en: 'Siblings', hi: 'भाई-बहन', icon: '🤝' },
  4: { en: 'Home', hi: 'घर', icon: '🏠' },
  5: { en: 'Children', hi: 'सन्तान', icon: '👶' },
  6: { en: 'Enemies', hi: 'शत्रु', icon: '⚔️' },
  7: { en: 'Marriage', hi: 'विवाह', icon: '💍' },
  8: { en: 'Transform', hi: 'परिवर्तन', icon: '🔄' },
  9: { en: 'Dharma', hi: 'धर्म', icon: '🙏' },
  10: { en: 'Career', hi: 'कैरियर', icon: '📈' },
  11: { en: 'Gains', hi: 'लाभ', icon: '🎯' },
  12: { en: 'Moksha', hi: 'मोक्ष', icon: '🕉️' },
};

const COLOR_MAP = {
  gold: { bg: 'bg-gold-primary/20', border: 'border-gold-primary/50', text: 'text-gold-light' },
  emerald: { bg: 'bg-emerald-500/20', border: 'border-emerald-500/50', text: 'text-emerald-300' },
  red: { bg: 'bg-red-500/20', border: 'border-red-500/50', text: 'text-red-300' },
  amber: { bg: 'bg-amber-500/20', border: 'border-amber-500/50', text: 'text-amber-300' },
  sky: { bg: 'bg-sky-500/20', border: 'border-sky-500/50', text: 'text-sky-300' },
};

// Grid positions for houses 1-12 in a compact layout
// Row 1: 12, 1, 2, 3
// Row 2: 11, (center), (center), 4
// Row 3: 10, 9, 8, 5
//                     6, 7
const GRID_POS: Record<number, [number, number]> = {
  12: [0, 0], 1: [0, 1], 2: [0, 2], 3: [0, 3],
  11: [1, 0],                        4: [1, 3],
  10: [2, 0], 9: [2, 1], 8: [2, 2], 5: [2, 3],
              6: [1, 1], 7: [1, 2],
};

export default function HouseVisual({ highlight, label, size = 'sm', color = 'gold' }: HouseVisualProps) {
  const highlights = Array.isArray(highlight) ? highlight : [highlight];
  const colors = COLOR_MAP[color];
  const cellSize = size === 'sm' ? 'w-8 h-8 text-[10px]' : 'w-10 h-10 text-xs';

  return (
    <div className="inline-flex flex-col items-center gap-1">
      <div className="grid grid-cols-4 gap-0.5">
        {[0, 1, 2].map(row => (
          [0, 1, 2, 3].map(col => {
            const house = Object.entries(GRID_POS).find(([, pos]) => pos[0] === row && pos[1] === col);
            if (!house) return <div key={`${row}-${col}`} className={cellSize} />;
            const hNum = parseInt(house[0]);
            const isHighlighted = highlights.includes(hNum);
            return (
              <div
                key={hNum}
                className={`${cellSize} rounded flex items-center justify-center font-bold border transition-all ${
                  isHighlighted
                    ? `${colors.bg} ${colors.border} ${colors.text}`
                    : 'border-gold-primary/10 text-text-tertiary'
                }`}
                title={`House ${hNum}: ${HOUSE_SIGNIFICATIONS[hNum]?.en}`}
              >
                {hNum}
              </div>
            );
          })
        ))}
      </div>
      {label && <span className={`text-[9px] ${colors.text} font-medium`}>{label}</span>}
    </div>
  );
}

/**
 * Inline house badge — shows house number with signification
 */
export function HouseBadge({ house, locale = 'en', color = 'gold' }: { house: number; locale?: string; color?: 'gold' | 'emerald' | 'red' | 'amber' }) {
  const isHi = locale !== 'en';
  const sig = HOUSE_SIGNIFICATIONS[house];
  const colors = COLOR_MAP[color];
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-xs font-medium ${colors.bg} border ${colors.border} ${colors.text}`}>
      <span className="font-bold">H{house}</span>
      <span className="text-[10px] opacity-80">{isHi ? sig?.hi : sig?.en}</span>
    </span>
  );
}
