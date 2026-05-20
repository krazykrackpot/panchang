'use client';

import { useId } from 'react';

/**
 * Full-card SVG artwork for each of the 12 lagna archetypes.
 * Style: refined, elegant silhouettes — temple sculpture meets modern design.
 * Each archetype has a unique illustration + colour palette.
 * viewBox 380×570 (card proportions 2:3).
 */

interface Props {
  rashiId: number;
  className?: string;
}

// Per-archetype colour palettes
const PALETTES: Record<number, { primary: string; glow: string; bg1: string; bg2: string }> = {
  1:  { primary: '#ef4444', glow: '#ef4444', bg1: '#3d1010', bg2: '#1a0808' },   // Aries — Mars red
  2:  { primary: '#22c55e', glow: '#22c55e', bg1: '#0a3d1a', bg2: '#081a0e' },   // Taurus — Earth green
  3:  { primary: '#60a5fa', glow: '#3b82f6', bg1: '#0a1a3d', bg2: '#080e1a' },   // Gemini — Mercury blue
  4:  { primary: '#c4b5fd', glow: '#8b5cf6', bg1: '#1a0a3d', bg2: '#0e081a' },   // Cancer — Moon violet
  5:  { primary: '#d4a853', glow: '#d4a853', bg1: '#2d1b69', bg2: '#0a0e27' },   // Leo — Sun gold
  6:  { primary: '#34d399', glow: '#10b981', bg1: '#0a3d2d', bg2: '#081a15' },   // Virgo — Mercury emerald
  7:  { primary: '#f0abfc', glow: '#d946ef', bg1: '#3d0a3d', bg2: '#1a081a' },   // Libra — Venus pink
  8:  { primary: '#ef4444', glow: '#dc2626', bg1: '#3d0a1a', bg2: '#1a0810' },   // Scorpio — Mars crimson
  9:  { primary: '#fbbf24', glow: '#f59e0b', bg1: '#3d2d0a', bg2: '#1a1508' },   // Sagittarius — Jupiter amber
  10: { primary: '#6b7280', glow: '#9ca3af', bg1: '#1a1a2e', bg2: '#0a0a15' },   // Capricorn — Saturn grey
  11: { primary: '#38bdf8', glow: '#0ea5e9', bg1: '#0a2d3d', bg2: '#08151a' },   // Aquarius — Saturn cyan
  12: { primary: '#a78bfa', glow: '#7c3aed', bg1: '#1a0a3d', bg2: '#0e081a' },   // Pisces — Jupiter purple
};

function Stars({ color }: { color: string }) {
  const stars = [
    [45,80,1],[120,45,0.7],[290,70,1.1],[340,130,0.6],[60,200,0.8],
    [310,220,0.9],[180,50,0.5],[250,160,0.7],[100,300,0.6],[330,280,1],
    [200,380,0.4],[70,420,0.7],[155,120,0.5],[270,350,0.8],[30,340,0.6],
  ];
  return (
    <g opacity="0.5">
      {stars.map(([cx,cy,r], i) => (
        <circle key={i} cx={cx} cy={cy} r={r} fill={color} />
      ))}
    </g>
  );
}

function Mandala({ cx, cy, color }: { cx: number; cy: number; color: string }) {
  return (
    <g>
      <circle cx={cx} cy={cy} r={100} fill="none" stroke={color} strokeWidth="0.5" opacity="0.15" strokeDasharray="4 8" />
      <circle cx={cx} cy={cy} r={118} fill="none" stroke={color} strokeWidth="0.3" opacity="0.08" strokeDasharray="2 12" />
      <circle cx={cx} cy={cy} r={135} fill="none" stroke={color} strokeWidth="0.3" opacity="0.05" strokeDasharray="1 14" />
    </g>
  );
}

// ═══ ARCHETYPE ILLUSTRATIONS ═══
// Refined silhouettes — clean lines, no cartoon features

function LionSovereign({ color }: { color: string }) {
  return (
    <g transform="translate(190, 205)">
      {/* Mane — elegant radiating arcs */}
      <g opacity="0.4">
        {Array.from({ length: 16 }).map((_, i) => {
          const angle = (i * 22.5 - 90) * Math.PI / 180;
          const x1 = Math.cos(angle) * 45, y1 = Math.sin(angle) * 45;
          const x2 = Math.cos(angle) * 80, y2 = Math.sin(angle) * 80;
          return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke={color} strokeWidth={i % 2 === 0 ? 2 : 1} strokeLinecap="round" opacity={0.3 + (i % 3) * 0.15} />;
        })}
      </g>
      {/* Head — refined oval */}
      <ellipse cx="0" cy="-5" rx="38" ry="42" fill="none" stroke={color} strokeWidth="1.5" opacity="0.7" />
      {/* Eyes — almond shaped, not circles */}
      <path d="M-20,-18 Q-14,-24 -8,-18 Q-14,-14 -20,-18" fill={color} opacity="0.8" />
      <path d="M8,-18 Q14,-24 20,-18 Q14,-14 8,-18" fill={color} opacity="0.8" />
      {/* Nose bridge — single elegant line */}
      <path d="M0,-10 L0,4" stroke={color} strokeWidth="1" opacity="0.4" />
      {/* Crown — geometric, refined */}
      <path d="M-22,-48 L-15,-65 L-5,-52 L0,-72 L5,-52 L15,-65 L22,-48" fill="none" stroke={color} strokeWidth="1.5" strokeLinejoin="round" />
      <circle cx="0" cy="-66" r="3" fill={color} opacity="0.5" />
    </g>
  );
}

function ScorpionTransformer({ color }: { color: string }) {
  return (
    <g transform="translate(190, 215)">
      {/* Body — elegant curves */}
      <ellipse cx="0" cy="5" rx="30" ry="20" fill="none" stroke={color} strokeWidth="1.5" opacity="0.6" />
      {/* Tail — sweeping arc with stinger */}
      <path d="M18,-10 Q35,-40 30,-65 Q28,-78 22,-85 Q18,-90 14,-82 Q12,-72 20,-60 Q28,-42 12,-15"
        fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" opacity="0.8" />
      {/* Stinger point */}
      <path d="M14,-82 L10,-94 L18,-87" fill={color} opacity="0.9" />
      <circle cx="12" cy="-90" r="5" fill={color} opacity="0.15" />
      {/* Pincers — graceful arcs */}
      <path d="M-22,-12 Q-42,-28 -48,-18 Q-50,-12 -42,-10" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
      <path d="M22,-12 Q42,-28 48,-18 Q50,-12 42,-10" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
    </g>
  );
}

function WarriorAries({ color }: { color: string }) {
  return (
    <g transform="translate(190, 200)">
      {/* Ram horns — bold, sweeping */}
      <path d="M-8,-30 Q-35,-60 -50,-45 Q-60,-35 -45,-28 Q-30,-22 -12,-25"
        fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" />
      <path d="M8,-30 Q35,-60 50,-45 Q60,-35 45,-28 Q30,-22 12,-25"
        fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" />
      {/* Head — strong, angular */}
      <path d="M-20,-20 Q0,-55 20,-20 Q15,5 0,15 Q-15,5 -20,-20" fill="none" stroke={color} strokeWidth="1.5" opacity="0.6" />
      {/* Sword below */}
      <line x1="0" y1="30" x2="0" y2="80" stroke={color} strokeWidth="2" opacity="0.5" />
      <path d="M-8,30 L0,22 L8,30" fill="none" stroke={color} strokeWidth="1.5" opacity="0.5" />
    </g>
  );
}

function BullBuilder({ color }: { color: string }) {
  return (
    <g transform="translate(190, 210)">
      {/* Horns — wide, powerful */}
      <path d="M-18,-30 Q-40,-55 -55,-40" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" />
      <path d="M18,-30 Q40,-55 55,-40" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" />
      {/* Head */}
      <ellipse cx="0" cy="-10" rx="30" ry="32" fill="none" stroke={color} strokeWidth="1.5" opacity="0.6" />
      {/* Eyes */}
      <circle cx="-12" cy="-16" r="3" fill={color} opacity="0.7" />
      <circle cx="12" cy="-16" r="3" fill={color} opacity="0.7" />
      {/* Nose ring */}
      <circle cx="0" cy="5" r="8" fill="none" stroke={color} strokeWidth="1" opacity="0.4" />
    </g>
  );
}

function TwinsCommunicator({ color }: { color: string }) {
  return (
    <g transform="translate(190, 200)">
      {/* Twin figures — mirrored, connected */}
      <path d="M-25,-40 Q-25,-60 -20,-70 Q-15,-75 -15,-60 L-15,-10" fill="none" stroke={color} strokeWidth="1.5" opacity="0.6" />
      <path d="M25,-40 Q25,-60 20,-70 Q15,-75 15,-60 L15,-10" fill="none" stroke={color} strokeWidth="1.5" opacity="0.6" />
      {/* Heads */}
      <circle cx="-20" cy="-45" r="12" fill="none" stroke={color} strokeWidth="1.5" opacity="0.7" />
      <circle cx="20" cy="-45" r="12" fill="none" stroke={color} strokeWidth="1.5" opacity="0.7" />
      {/* Connection arc */}
      <path d="M-8,-45 Q0,-30 8,-45" fill="none" stroke={color} strokeWidth="1" opacity="0.4" strokeDasharray="3 3" />
    </g>
  );
}

function CrabNurturer({ color }: { color: string }) {
  return (
    <g transform="translate(190, 210)">
      {/* Crescent moon */}
      <path d="M-35,-50 Q0,-80 35,-50 Q10,-55 -10,-55 Q-25,-50 -35,-50" fill="none" stroke={color} strokeWidth="1.5" opacity="0.7" />
      {/* Shell */}
      <ellipse cx="0" cy="0" rx="40" ry="30" fill="none" stroke={color} strokeWidth="1.5" opacity="0.5" />
      <path d="M-30,-10 Q0,-25 30,-10" fill="none" stroke={color} strokeWidth="1" opacity="0.3" />
    </g>
  );
}

function ScalesHarmoniser({ color }: { color: string }) {
  return (
    <g transform="translate(190, 200)">
      {/* Balance beam */}
      <line x1="-50" y1="-10" x2="50" y2="-10" stroke={color} strokeWidth="1.5" opacity="0.7" />
      {/* Fulcrum */}
      <path d="M0,-10 L0,-50" stroke={color} strokeWidth="1.5" />
      <circle cx="0" cy="-55" r="6" fill="none" stroke={color} strokeWidth="1.5" opacity="0.6" />
      {/* Pans — elegant arcs */}
      <path d="M-50,-10 Q-55,10 -40,15 Q-30,17 -20,10 Q-25,-5 -50,-10" fill="none" stroke={color} strokeWidth="1" opacity="0.5" />
      <path d="M50,-10 Q55,10 40,15 Q30,17 20,10 Q25,-5 50,-10" fill="none" stroke={color} strokeWidth="1" opacity="0.5" />
    </g>
  );
}

function ArcherSeeker({ color }: { color: string }) {
  return (
    <g transform="translate(190, 200)">
      {/* Bow — elegant arc */}
      <path d="M-30,30 Q-50,-30 -10,-60" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" opacity="0.7" />
      {/* Bowstring */}
      <line x1="-30" y1="30" x2="-10" y2="-60" stroke={color} strokeWidth="0.8" opacity="0.4" />
      {/* Arrow */}
      <line x1="-20" y1="-15" x2="50" y2="-50" stroke={color} strokeWidth="1.5" opacity="0.6" />
      <path d="M50,-50 L42,-42 L46,-54" fill={color} opacity="0.6" />
      {/* Star target */}
      <circle cx="55" cy="-55" r="8" fill={color} opacity="0.1" />
    </g>
  );
}

function SeaGoatArchitect({ color }: { color: string }) {
  return (
    <g transform="translate(190, 200)">
      {/* Goat horns */}
      <path d="M-10,-35 Q-20,-60 -30,-55" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" />
      <path d="M10,-35 Q20,-60 30,-55" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" />
      {/* Head */}
      <ellipse cx="0" cy="-20" rx="22" ry="25" fill="none" stroke={color} strokeWidth="1.5" opacity="0.6" />
      {/* Fish tail */}
      <path d="M0,15 Q10,40 5,60 Q0,70 -10,65 Q-5,50 0,35" fill="none" stroke={color} strokeWidth="1.5" opacity="0.5" />
      {/* Geometric overlay */}
      <rect x="-35" y="-40" width="70" height="70" fill="none" stroke={color} strokeWidth="0.5" opacity="0.12" transform="rotate(45, 0, -5)" />
    </g>
  );
}

function WaterBearerVisionary({ color }: { color: string }) {
  return (
    <g transform="translate(190, 200)">
      {/* Vessel */}
      <path d="M-15,-30 L-20,10 Q0,20 20,10 L15,-30 Z" fill="none" stroke={color} strokeWidth="1.5" opacity="0.6" />
      {/* Water streams */}
      <path d="M-5,15 Q-15,35 -8,55 Q0,65 8,55 Q15,35 5,15" fill="none" stroke={color} strokeWidth="1" opacity="0.4" />
      <path d="M-12,45 Q-20,60 -15,75" fill="none" stroke={color} strokeWidth="0.8" opacity="0.3" />
      <path d="M12,45 Q20,60 15,75" fill="none" stroke={color} strokeWidth="0.8" opacity="0.3" />
      {/* Light rays from vessel */}
      {[0,30,60,90,120,150].map((a, i) => {
        const rad = (a - 90) * Math.PI / 180;
        return <line key={i} x1={Math.cos(rad)*22} y1={-30+Math.sin(rad)*22} x2={Math.cos(rad)*35} y2={-30+Math.sin(rad)*35} stroke={color} strokeWidth="0.8" opacity="0.2" />;
      })}
    </g>
  );
}

function FishMystic({ color }: { color: string }) {
  return (
    <g transform="translate(190, 210)">
      {/* Two fish — elegant, flowing */}
      <path d="M-10,-40 Q-35,-30 -40,-5 Q-35,15 -10,20 Q10,15 15,-5 Q10,-30 -10,-40"
        fill="none" stroke={color} strokeWidth="1.5" opacity="0.6" />
      <path d="M10,40 Q35,30 40,5 Q35,-15 10,-20 Q-10,-15 -15,5 Q-10,30 10,40"
        fill="none" stroke={color} strokeWidth="1.5" opacity="0.6" />
      {/* Connection — infinity loop */}
      <path d="M5,-10 Q15,10 5,20" fill="none" stroke={color} strokeWidth="1" opacity="0.3" strokeDasharray="3 3" />
      <path d="M-5,10 Q-15,-10 -5,-20" fill="none" stroke={color} strokeWidth="1" opacity="0.3" strokeDasharray="3 3" />
      {/* Eyes */}
      <circle cx="-15" cy="-10" r="2.5" fill={color} opacity="0.5" />
      <circle cx="15" cy="10" r="2.5" fill={color} opacity="0.5" />
    </g>
  );
}

function AnalystVirgo({ color }: { color: string }) {
  return (
    <g transform="translate(190, 200)">
      {/* Quill */}
      <path d="M10,-65 Q5,-40 0,-10 Q-2,5 -5,20" fill="none" stroke={color} strokeWidth="1.5" opacity="0.7" strokeLinecap="round" />
      <path d="M10,-65 Q15,-60 12,-55" fill={color} opacity="0.4" />
      {/* Celestial map / grid */}
      <rect x="-35" y="-25" width="70" height="50" rx="3" fill="none" stroke={color} strokeWidth="1" opacity="0.3" />
      <line x1="-35" y1="0" x2="35" y2="0" stroke={color} strokeWidth="0.5" opacity="0.2" />
      <line x1="0" y1="-25" x2="0" y2="25" stroke={color} strokeWidth="0.5" opacity="0.2" />
      {/* Dots on the map */}
      <circle cx="-15" cy="-12" r="2" fill={color} opacity="0.3" />
      <circle cx="20" cy="8" r="2" fill={color} opacity="0.3" />
      <circle cx="-8" cy="15" r="2" fill={color} opacity="0.3" />
    </g>
  );
}

const ILLUSTRATIONS: Record<number, (props: { color: string }) => React.ReactNode> = {
  1: WarriorAries,
  2: BullBuilder,
  3: TwinsCommunicator,
  4: CrabNurturer,
  5: LionSovereign,
  6: AnalystVirgo,
  7: ScalesHarmoniser,
  8: ScorpionTransformer,
  9: ArcherSeeker,
  10: SeaGoatArchitect,
  11: WaterBearerVisionary,
  12: FishMystic,
};

export default function ArchetypeSVG({ rashiId, className }: Props) {
  const uid = useId();
  const p = PALETTES[rashiId] || PALETTES[5];
  const Illustration = ILLUSTRATIONS[rashiId] || LionSovereign;

  return (
    <svg viewBox="0 0 380 570" xmlns="http://www.w3.org/2000/svg" className={className}>
      <defs>
        <radialGradient id={`bg-${rashiId}-${uid}`} cx="50%" cy="35%" r="60%">
          <stop offset="0%" stopColor={p.bg1} stopOpacity="0.9" />
          <stop offset="50%" stopColor={p.bg2} stopOpacity="1" />
          <stop offset="100%" stopColor="#040610" stopOpacity="1" />
        </radialGradient>
        <radialGradient id={`glow-${rashiId}-${uid}`} cx="50%" cy="30%" r="40%">
          <stop offset="0%" stopColor={p.glow} stopOpacity="0.12" />
          <stop offset="100%" stopColor={p.glow} stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Background */}
      <rect width="380" height="570" fill={`url(#bg-${rashiId}-${uid})`} />
      <rect width="380" height="570" fill={`url(#glow-${rashiId}-${uid})`} />

      <Stars color={p.primary} />
      <Mandala cx={190} cy={210} color={p.primary} />
      <Illustration color={p.primary} />

      {/* Bottom fade for text overlay */}
      <rect y="340" width="380" height="230" fill={`url(#bg-${rashiId}-${uid})`} opacity="0.8" />
    </svg>
  );
}
