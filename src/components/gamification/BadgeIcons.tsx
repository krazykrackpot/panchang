// src/components/gamification/BadgeIcons.tsx
// 18 SVG glyphs, gold tarot style, ~40×40 default size.

import React from 'react';

const grad = (id: string) => (
  <defs>
    <linearGradient id={id} x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stopColor="#f0d48a"/>
      <stop offset="55%" stopColor="#d4a853"/>
      <stop offset="100%" stopColor="#8a6d2b"/>
    </linearGradient>
  </defs>
);

interface IconProps { size?: number; locked?: boolean }
const Frame: React.FC<React.PropsWithChildren<IconProps>> = ({ size = 40, locked, children }) => (
  <svg viewBox="0 0 40 40" width={size} height={size}
       style={{ filter: locked ? 'grayscale(1) brightness(0.4)' : undefined }}>
    {children}
  </svg>
);

export const BADGE_ICONS: Record<string, React.FC<IconProps>> = {
  'lit-the-lamp': (p) => (
    <Frame {...p}>{grad('g1')}
      <path d="M20 6 Q18 12 16 18 Q16 22 20 22 Q24 22 24 18 Q22 12 20 6 Z" fill="url(#g1)"/>
      <ellipse cx="20" cy="30" rx="10" ry="3" fill="url(#g1)"/>
      <path d="M12 28 Q12 34 20 34 Q28 34 28 28 Z" fill="url(#g1)" opacity="0.85"/>
    </Frame>
  ),
  'star-identified': (p) => (
    <Frame {...p}>{grad('g2')}
      <path d="M20 6 L22 16 L32 18 L22 21 L20 32 L18 21 L8 18 L18 16 Z" fill="url(#g2)"/>
    </Frame>
  ),
  'family-constellation': (p) => (
    <Frame {...p}>{grad('g3')}
      <circle cx="14" cy="14" r="3" fill="url(#g3)"/>
      <circle cx="26" cy="14" r="3" fill="url(#g3)"/>
      <circle cx="20" cy="26" r="3" fill="url(#g3)"/>
      <line x1="14" y1="14" x2="26" y2="14" stroke="url(#g3)" strokeWidth="1"/>
      <line x1="14" y1="14" x2="20" y2="26" stroke="url(#g3)" strokeWidth="1"/>
      <line x1="26" y1="14" x2="20" y2="26" stroke="url(#g3)" strokeWidth="1"/>
    </Frame>
  ),
  'five-star-family': (p) => (
    <Frame {...p}>{grad('g4')}
      {[6, 14, 22, 28, 32].map((x, i) => (
        <path key={i} d={`M${x} 16 L${x+1} 19 L${x+4} 19 L${x+1.5} 21 L${x+2.5} 24 L${x} 22 L${x-2.5} 24 L${x-1.5} 21 L${x-4} 19 L${x-1} 19 Z`}
              fill="url(#g4)" transform={`translate(0,${i%2===0?0:4})`}/>
      ))}
    </Frame>
  ),
  'constellation-keeper': (p) => (
    <Frame {...p}>{grad('g5')}
      <circle cx="20" cy="20" r="12" fill="none" stroke="url(#g5)" strokeWidth="1.5"/>
      {[0, 60, 120, 180, 240, 300].map((deg, i) => {
        const rad = (deg * Math.PI) / 180;
        const x = 20 + 10 * Math.cos(rad);
        const y = 20 + 10 * Math.sin(rad);
        return <circle key={i} cx={x} cy={y} r="1.8" fill="url(#g5)"/>;
      })}
    </Frame>
  ),
  'first-page': (p) => (
    <Frame {...p}>{grad('g6')}
      <rect x="10" y="8" width="20" height="24" rx="1.5" fill="none" stroke="url(#g6)" strokeWidth="1.5"/>
      <line x1="13" y1="14" x2="27" y2="14" stroke="url(#g6)" strokeWidth="1.2"/>
      <line x1="13" y1="18" x2="27" y2="18" stroke="url(#g6)" strokeWidth="1.2"/>
      <line x1="13" y1="22" x2="22" y2="22" stroke="url(#g6)" strokeWidth="1.2"/>
    </Frame>
  ),
  'scholar': (p) => (
    <Frame {...p}>{grad('g7')}
      <rect x="6" y="12" width="28" height="4" fill="url(#g7)" opacity="0.7"/>
      <rect x="4" y="18" width="32" height="4" fill="url(#g7)" opacity="0.85"/>
      <rect x="6" y="24" width="28" height="4" fill="url(#g7)" opacity="0.7"/>
      <rect x="18" y="8" width="4" height="24" fill="url(#g7)"/>
    </Frame>
  ),
  'curriculum-master': (p) => (
    <Frame {...p}>{grad('g8')}
      <path d="M6 30 L20 8 L34 30 Z" fill="none" stroke="url(#g8)" strokeWidth="1.5"/>
      <rect x="16" y="22" width="8" height="8" fill="url(#g8)" opacity="0.7"/>
    </Frame>
  ),
  'twenty-seven-nakshatras': (p) => (
    <Frame {...p}>{grad('g9')}
      <circle cx="20" cy="20" r="14" fill="none" stroke="url(#g9)" strokeWidth="1.5"/>
      <text x="20" y="24" textAnchor="middle" fill="url(#g9)" fontSize="11" fontWeight="700">27</text>
    </Frame>
  ),
  'tool-explorer': (p) => (
    <Frame {...p}>{grad('g10')}
      <polygon points="20,4 36,20 20,36 4,20" fill="none" stroke="url(#g10)" strokeWidth="1.5"/>
      <circle cx="20" cy="20" r="3" fill="url(#g10)"/>
    </Frame>
  ),
  'pentavalent': (p) => (
    <Frame {...p}>{grad('g11')}
      <polygon points="20,6 33,15 28,30 12,30 7,15" fill="none" stroke="url(#g11)" strokeWidth="1.5"/>
      <circle cx="20" cy="20" r="3" fill="url(#g11)"/>
    </Frame>
  ),
  'all-around': (p) => (
    <Frame {...p}>{grad('g12')}
      <polygon points="20,4 32,11 32,29 20,36 8,29 8,11" fill="none" stroke="url(#g12)" strokeWidth="1.5"/>
      <polygon points="20,10 28,15 28,25 20,30 12,25 12,15" fill="url(#g12)" opacity="0.6"/>
    </Frame>
  ),
  'first-cycle': (p) => (
    <Frame {...p}>{grad('g13')}
      <path d="M28 8 A 14 14 0 1 0 32 22 Z" fill="url(#g13)"/>
    </Frame>
  ),
  'lunar-cycle': (p) => (
    <Frame {...p}>{grad('g14')}
      <circle cx="20" cy="20" r="14" fill="url(#g14)"/>
      <path d="M20 6 A 14 14 0 0 1 20 34 Z" fill="#0a0e27"/>
    </Frame>
  ),
  'full-moon': (p) => (
    <Frame {...p}>{grad('g15')}
      <circle cx="20" cy="20" r="14" fill="url(#g15)"/>
      <circle cx="14" cy="16" r="2" fill="#0a0e27" opacity="0.4"/>
      <circle cx="24" cy="20" r="1.5" fill="#0a0e27" opacity="0.4"/>
      <circle cx="20" cy="26" r="2.5" fill="#0a0e27" opacity="0.4"/>
    </Frame>
  ),
  'solar-return': (p) => (
    <Frame {...p}>{grad('g16')}
      <circle cx="20" cy="20" r="8" fill="url(#g16)"/>
      {[0, 45, 90, 135, 180, 225, 270, 315].map((deg, i) => {
        const rad = (deg * Math.PI) / 180;
        return <line key={i}
          x1={20 + 10 * Math.cos(rad)} y1={20 + 10 * Math.sin(rad)}
          x2={20 + 16 * Math.cos(rad)} y2={20 + 16 * Math.sin(rad)}
          stroke="url(#g16)" strokeWidth="1.5"/>;
      })}
    </Frame>
  ),
  'early-bird': (p) => (
    <Frame {...p}>{grad('g17')}
      <path d="M4 28 L36 28" stroke="url(#g17)" strokeWidth="1.5"/>
      <path d="M20 16 A 8 8 0 0 1 28 24 L12 24 A 8 8 0 0 1 20 16 Z" fill="url(#g17)" opacity="0.7"/>
    </Frame>
  ),
  'festival-witness': (p) => (
    <Frame {...p}>{grad('g18')}
      <path d="M20 6 L24 16 L34 18 L26 24 L28 34 L20 28 L12 34 L14 24 L6 18 L16 16 Z" fill="url(#g18)" opacity="0.85"/>
    </Frame>
  ),
};

export interface BadgeIconProps { slug: string; size?: number; locked?: boolean }
export const BadgeIcon: React.FC<BadgeIconProps> = ({ slug, size = 40, locked = false }) => {
  const Cmp = BADGE_ICONS[slug];
  if (!Cmp) return null;
  return <Cmp size={size} locked={locked} />;
};
