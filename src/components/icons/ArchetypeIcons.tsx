'use client';

import type { ArchetypeId } from '@/lib/constants/archetype-data';

interface Props {
  archetype: ArchetypeId;
  size?: number;
  className?: string;
}

export default function ArchetypeIcon({ archetype, size = 96, className = '' }: Props) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 96 96"
      fill="none"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id={`ag-${archetype}`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#f0d48a" />
          <stop offset="50%" stopColor="#d4a853" />
          <stop offset="100%" stopColor="#8a6d2b" />
        </linearGradient>
        <filter id={`aglow-${archetype}`}>
          <feGaussianBlur stdDeviation="2" result="glow" />
          <feMerge>
            <feMergeNode in="glow" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <filter id={`aglow2-${archetype}`}>
          <feGaussianBlur stdDeviation="1" result="glow" />
          <feMerge>
            <feMergeNode in="glow" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      {ICON_PATHS[archetype]}
    </svg>
  );
}

const ICON_PATHS: Record<ArchetypeId, React.ReactNode> = {
  // sovereign — Sun archetype: crown with radiating rays
  sovereign: (
    <>
      {/* Outer ring of light */}
      <circle cx="48" cy="48" r="38" stroke="url(#ag-sovereign)" strokeWidth="1" opacity="0.2" />
      {/* Crown base band */}
      <rect x="22" y="56" width="52" height="8" rx="2"
        fill="url(#ag-sovereign)" fillOpacity="0.9" filter="url(#aglow-sovereign)" />
      {/* Crown points */}
      <polygon points="22,56 30,34 38,48 48,28 58,48 66,34 74,56"
        fill="url(#ag-sovereign)" fillOpacity="0.85" filter="url(#aglow-sovereign)" />
      {/* Crown inner shadow for depth */}
      <polygon points="27,56 33,40 38,50 48,33 58,50 63,40 69,56"
        fill="#0a0e27" fillOpacity="0.35" />
      {/* Central gemstone */}
      <circle cx="48" cy="44" r="5" fill="#f0d48a" opacity="0.95" filter="url(#aglow2-sovereign)" />
      <circle cx="48" cy="44" r="3" fill="white" opacity="0.4" />
      {/* Side gemstones */}
      <circle cx="31" cy="51" r="3" fill="#d4a853" opacity="0.8" />
      <circle cx="65" cy="51" r="3" fill="#d4a853" opacity="0.8" />
      {/* Radiating rays above crown */}
      <line x1="48" y1="14" x2="48" y2="22" stroke="url(#ag-sovereign)" strokeWidth="2.5" strokeLinecap="round" opacity="0.7" />
      <line x1="34" y1="17" x2="37" y2="24" stroke="url(#ag-sovereign)" strokeWidth="2" strokeLinecap="round" opacity="0.5" />
      <line x1="62" y1="17" x2="59" y2="24" stroke="url(#ag-sovereign)" strokeWidth="2" strokeLinecap="round" opacity="0.5" />
      <line x1="22" y1="26" x2="28" y2="30" stroke="url(#ag-sovereign)" strokeWidth="1.5" strokeLinecap="round" opacity="0.4" />
      <line x1="74" y1="26" x2="68" y2="30" stroke="url(#ag-sovereign)" strokeWidth="1.5" strokeLinecap="round" opacity="0.4" />
    </>
  ),

  // empath — Moon archetype: crescent moon with flowing water drops
  empath: (
    <>
      {/* Outer glow halo */}
      <circle cx="48" cy="48" r="36" stroke="url(#ag-empath)" strokeWidth="1" opacity="0.15" />
      {/* Main crescent shape — outer circle */}
      <circle cx="48" cy="44" r="28" fill="url(#ag-empath)" fillOpacity="0.15"
        stroke="url(#ag-empath)" strokeWidth="2" filter="url(#aglow-empath)" />
      {/* Inner cutout to form crescent */}
      <circle cx="58" cy="40" r="22" fill="#0a0e27" />
      {/* Crescent highlight edge */}
      <path d="M 36 20 A 28 28 0 0 1 60 68" stroke="url(#ag-empath)" strokeWidth="3"
        fill="none" strokeLinecap="round" filter="url(#aglow-empath)" />
      {/* Star in crescent field */}
      <circle cx="30" cy="38" r="2.5" fill="#f0d48a" opacity="0.9" />
      <circle cx="24" cy="54" r="1.5" fill="#f0d48a" opacity="0.6" />
      <circle cx="36" cy="62" r="1.5" fill="#f0d48a" opacity="0.5" />
      {/* Water drops flowing down */}
      <ellipse cx="44" cy="76" rx="3" ry="4.5" fill="url(#ag-empath)" opacity="0.8"
        filter="url(#aglow2-empath)" />
      <ellipse cx="54" cy="80" rx="2.5" ry="3.5" fill="url(#ag-empath)" opacity="0.6" />
      <ellipse cx="36" cy="81" rx="2" ry="3" fill="url(#ag-empath)" opacity="0.4" />
      {/* Reflection dots */}
      <circle cx="38" cy="32" r="1" fill="white" opacity="0.5" />
      <circle cx="34" cy="42" r="0.8" fill="white" opacity="0.3" />
    </>
  ),

  // warrior — Mars archetype: shield with crossed spears
  warrior: (
    <>
      {/* Shield base */}
      <path d="M48 10 L76 24 L76 54 Q76 74 48 86 Q20 74 20 54 L20 24 Z"
        fill="url(#ag-warrior)" fillOpacity="0.15"
        stroke="url(#ag-warrior)" strokeWidth="2.5" filter="url(#aglow-warrior)" />
      {/* Shield inner border */}
      <path d="M48 18 L68 29 L68 53 Q68 68 48 78 Q28 68 28 53 L28 29 Z"
        fill="url(#ag-warrior)" fillOpacity="0.08"
        stroke="url(#ag-warrior)" strokeWidth="1" opacity="0.5" />
      {/* Central emblem — diamond */}
      <polygon points="48,32 56,48 48,64 40,48"
        fill="url(#ag-warrior)" fillOpacity="0.7" filter="url(#aglow-warrior)" />
      <polygon points="48,37 53,48 48,59 43,48"
        fill="#0a0e27" fillOpacity="0.5" />
      <circle cx="48" cy="48" r="3" fill="#f0d48a" opacity="0.9" />
      {/* Crossed spears */}
      <line x1="14" y1="14" x2="82" y2="82" stroke="url(#ag-warrior)" strokeWidth="3"
        strokeLinecap="round" opacity="0.6" filter="url(#aglow2-warrior)" />
      <line x1="82" y1="14" x2="14" y2="82" stroke="url(#ag-warrior)" strokeWidth="3"
        strokeLinecap="round" opacity="0.6" filter="url(#aglow2-warrior)" />
      {/* Spear tips */}
      <polygon points="14,14 20,18 18,20" fill="#f0d48a" opacity="0.8" />
      <polygon points="82,14 76,18 78,20" fill="#f0d48a" opacity="0.8" />
      <polygon points="14,82 20,78 18,76" fill="#f0d48a" opacity="0.8" />
      <polygon points="82,82 76,78 78,76" fill="#f0d48a" opacity="0.8" />
    </>
  ),

  // analyst — Mercury archetype: all-seeing eye with geometric patterns
  analyst: (
    <>
      {/* Outer geometric hexagon */}
      <polygon points="48,10 78,26 78,58 48,74 18,58 18,26"
        stroke="url(#ag-analyst)" strokeWidth="1.5" fill="url(#ag-analyst)" fillOpacity="0.08" opacity="0.6" />
      {/* Inner triangle pointing up */}
      <polygon points="48,20 70,60 26,60"
        stroke="url(#ag-analyst)" strokeWidth="1.5" fill="url(#ag-analyst)" fillOpacity="0.1" />
      {/* Inner triangle pointing down */}
      <polygon points="48,60 26,30 70,30"
        stroke="url(#ag-analyst)" strokeWidth="1.5" fill="url(#ag-analyst)" fillOpacity="0.1" />
      {/* Eye outline — outer */}
      <path d="M16 44 Q32 20 48 20 Q64 20 80 44 Q64 68 48 68 Q32 68 16 44 Z"
        fill="url(#ag-analyst)" fillOpacity="0.12"
        stroke="url(#ag-analyst)" strokeWidth="2.5" filter="url(#aglow-analyst)" />
      {/* Iris */}
      <circle cx="48" cy="44" r="12" fill="url(#ag-analyst)" fillOpacity="0.3"
        stroke="url(#ag-analyst)" strokeWidth="2" />
      {/* Pupil */}
      <circle cx="48" cy="44" r="6" fill="url(#ag-analyst)" opacity="0.9"
        filter="url(#aglow-analyst)" />
      <circle cx="48" cy="44" r="3" fill="#0a0e27" opacity="0.8" />
      {/* Eye shine */}
      <circle cx="51" cy="41" r="1.5" fill="white" opacity="0.6" />
      {/* Geometric tick marks at hexagon vertices */}
      <circle cx="48" cy="10" r="1.5" fill="#f0d48a" opacity="0.7" />
      <circle cx="78" cy="26" r="1.5" fill="#f0d48a" opacity="0.7" />
      <circle cx="78" cy="58" r="1.5" fill="#f0d48a" opacity="0.7" />
      <circle cx="48" cy="74" r="1.5" fill="#f0d48a" opacity="0.7" />
      <circle cx="18" cy="58" r="1.5" fill="#f0d48a" opacity="0.7" />
      <circle cx="18" cy="26" r="1.5" fill="#f0d48a" opacity="0.7" />
    </>
  ),

  // visionary — Jupiter archetype: open third eye with cosmic spiral
  visionary: (
    <>
      {/* Cosmic background rings */}
      <circle cx="48" cy="48" r="38" stroke="url(#ag-visionary)" strokeWidth="1" opacity="0.2" />
      <circle cx="48" cy="48" r="30" stroke="url(#ag-visionary)" strokeWidth="1" opacity="0.15" />
      {/* Forehead silhouette — stylised brow arch */}
      <path d="M20 55 Q20 22 48 22 Q76 22 76 55"
        stroke="url(#ag-visionary)" strokeWidth="2.5" fill="none"
        strokeLinecap="round" opacity="0.5" />
      {/* Third eye outer glow */}
      <ellipse cx="48" cy="46" rx="16" ry="12"
        fill="url(#ag-visionary)" fillOpacity="0.2"
        stroke="url(#ag-visionary)" strokeWidth="2" filter="url(#aglow-visionary)" />
      {/* Third eye inner */}
      <ellipse cx="48" cy="46" rx="10" ry="7"
        fill="url(#ag-visionary)" fillOpacity="0.4" />
      {/* Cosmic spiral inside the eye */}
      <path d="M48 46 C50 44 53 44 53 46 C53 49 49 51 46 49 C43 47 43 43 47 42 C51 41 55 44 55 48 C55 53 50 56 45 54"
        stroke="#f0d48a" strokeWidth="1.5" fill="none" strokeLinecap="round" opacity="0.9"
        filter="url(#aglow2-visionary)" />
      {/* Central star point */}
      <circle cx="48" cy="46" r="3" fill="#f0d48a" opacity="1" filter="url(#aglow-visionary)" />
      {/* Radiating insight lines */}
      <line x1="48" y1="30" x2="48" y2="36" stroke="url(#ag-visionary)" strokeWidth="2" strokeLinecap="round" opacity="0.7" />
      <line x1="36" y1="33" x2="39" y2="38" stroke="url(#ag-visionary)" strokeWidth="1.5" strokeLinecap="round" opacity="0.5" />
      <line x1="60" y1="33" x2="57" y2="38" stroke="url(#ag-visionary)" strokeWidth="1.5" strokeLinecap="round" opacity="0.5" />
      {/* Lower star accents */}
      <circle cx="34" cy="70" r="2" fill="#d4a853" opacity="0.6" />
      <circle cx="48" cy="76" r="2.5" fill="#d4a853" opacity="0.5" />
      <circle cx="62" cy="70" r="2" fill="#d4a853" opacity="0.6" />
    </>
  ),

  // harmonizer — Venus archetype: balanced scales with lotus flowers
  harmonizer: (
    <>
      {/* Central beam / fulcrum post */}
      <line x1="48" y1="18" x2="48" y2="72" stroke="url(#ag-harmonizer)" strokeWidth="3"
        strokeLinecap="round" filter="url(#aglow-harmonizer)" />
      {/* Pivot point */}
      <circle cx="48" cy="38" r="5" fill="url(#ag-harmonizer)" opacity="0.9"
        filter="url(#aglow-harmonizer)" />
      <circle cx="48" cy="38" r="2.5" fill="#0a0e27" opacity="0.6" />
      {/* Scales horizontal beam */}
      <line x1="16" y1="38" x2="80" y2="38" stroke="url(#ag-harmonizer)" strokeWidth="2.5"
        strokeLinecap="round" opacity="0.8" />
      {/* Left pan cords */}
      <line x1="22" y1="38" x2="18" y2="56" stroke="url(#ag-harmonizer)" strokeWidth="1.5" strokeLinecap="round" opacity="0.7" />
      <line x1="30" y1="38" x2="26" y2="56" stroke="url(#ag-harmonizer)" strokeWidth="1.5" strokeLinecap="round" opacity="0.7" />
      {/* Right pan cords */}
      <line x1="66" y1="38" x2="70" y2="56" stroke="url(#ag-harmonizer)" strokeWidth="1.5" strokeLinecap="round" opacity="0.7" />
      <line x1="74" y1="38" x2="78" y2="56" stroke="url(#ag-harmonizer)" strokeWidth="1.5" strokeLinecap="round" opacity="0.7" />
      {/* Left pan */}
      <path d="M12 56 Q22 64 32 56" stroke="url(#ag-harmonizer)" strokeWidth="2"
        fill="url(#ag-harmonizer)" fillOpacity="0.2" strokeLinecap="round" />
      {/* Right pan */}
      <path d="M64 56 Q74 64 84 56" stroke="url(#ag-harmonizer)" strokeWidth="2"
        fill="url(#ag-harmonizer)" fillOpacity="0.2" strokeLinecap="round" />
      {/* Left lotus flower */}
      <circle cx="22" cy="59" r="5" fill="url(#ag-harmonizer)" fillOpacity="0.4" />
      <ellipse cx="22" cy="54" rx="3" ry="5" fill="url(#ag-harmonizer)" fillOpacity="0.6" filter="url(#aglow2-harmonizer)" />
      <ellipse cx="17" cy="58" rx="3" ry="4" fill="url(#ag-harmonizer)" fillOpacity="0.5" transform="rotate(-30 17 58)" />
      <ellipse cx="27" cy="58" rx="3" ry="4" fill="url(#ag-harmonizer)" fillOpacity="0.5" transform="rotate(30 27 58)" />
      {/* Right lotus flower */}
      <circle cx="74" cy="59" r="5" fill="url(#ag-harmonizer)" fillOpacity="0.4" />
      <ellipse cx="74" cy="54" rx="3" ry="5" fill="url(#ag-harmonizer)" fillOpacity="0.6" filter="url(#aglow2-harmonizer)" />
      <ellipse cx="69" cy="58" rx="3" ry="4" fill="url(#ag-harmonizer)" fillOpacity="0.5" transform="rotate(-30 69 58)" />
      <ellipse cx="79" cy="58" rx="3" ry="4" fill="url(#ag-harmonizer)" fillOpacity="0.5" transform="rotate(30 79 58)" />
      {/* Fulcrum base triangle */}
      <polygon points="48,72 40,84 56,84" fill="url(#ag-harmonizer)" fillOpacity="0.6" />
      {/* Venus symbol circle at top */}
      <circle cx="48" cy="18" r="6" stroke="url(#ag-harmonizer)" strokeWidth="2"
        fill="url(#ag-harmonizer)" fillOpacity="0.15" />
    </>
  ),

  // architect — Saturn archetype: pillared temple structure
  architect: (
    <>
      {/* Temple roof / pediment */}
      <polygon points="48,8 84,28 12,28"
        fill="url(#ag-architect)" fillOpacity="0.25"
        stroke="url(#ag-architect)" strokeWidth="2.5" filter="url(#aglow-architect)" />
      {/* Pediment inner triangle */}
      <polygon points="48,14 76,28 20,28"
        fill="url(#ag-architect)" fillOpacity="0.12"
        stroke="url(#ag-architect)" strokeWidth="1" opacity="0.5" />
      {/* Apex ornament */}
      <circle cx="48" cy="8" r="4" fill="#f0d48a" opacity="0.9" filter="url(#aglow-architect)" />
      {/* Entablature / top beam */}
      <rect x="12" y="28" width="72" height="8" rx="1"
        fill="url(#ag-architect)" fillOpacity="0.5"
        stroke="url(#ag-architect)" strokeWidth="1.5" />
      {/* 5 Columns */}
      {[20, 30, 48, 66, 76].map((x, i) => (
        <rect key={i} x={x - 4} y="36" width="8" height="40" rx="2"
          fill="url(#ag-architect)" fillOpacity="0.5"
          stroke="url(#ag-architect)" strokeWidth="1.5" />
      ))}
      {/* Column base stylobate */}
      <rect x="12" y="76" width="72" height="6" rx="1"
        fill="url(#ag-architect)" fillOpacity="0.6"
        stroke="url(#ag-architect)" strokeWidth="1.5" />
      {/* Ground step */}
      <rect x="8" y="82" width="80" height="5" rx="1"
        fill="url(#ag-architect)" fillOpacity="0.35"
        stroke="url(#ag-architect)" strokeWidth="1" opacity="0.7" />
      {/* Saturn rings across the pediment */}
      <ellipse cx="48" cy="18" rx="20" ry="4" stroke="url(#ag-architect)" strokeWidth="1.5"
        fill="none" opacity="0.4" />
    </>
  ),

  // maverick — Rahu archetype: comet with disrupted orbit trail
  maverick: (
    <>
      {/* Disrupted elliptical orbit — broken dashed ring */}
      <ellipse cx="48" cy="52" rx="36" ry="22"
        stroke="url(#ag-maverick)" strokeWidth="1.5" fill="none"
        strokeDasharray="4 6" opacity="0.4" />
      {/* Comet nucleus */}
      <circle cx="22" cy="30" r="10" fill="url(#ag-maverick)" opacity="0.9"
        filter="url(#aglow-maverick)" />
      <circle cx="22" cy="30" r="6" fill="#f0d48a" opacity="0.7" />
      <circle cx="20" cy="28" r="2.5" fill="white" opacity="0.4" />
      {/* Main comet tail — broad */}
      <path d="M30 36 Q52 42 84 28 Q72 48 60 56 Q46 54 32 44 Z"
        fill="url(#ag-maverick)" fillOpacity="0.3" filter="url(#aglow-maverick)" />
      {/* Tail streamers */}
      <path d="M30 34 Q58 30 86 18" stroke="url(#ag-maverick)" strokeWidth="2"
        fill="none" strokeLinecap="round" opacity="0.7" filter="url(#aglow2-maverick)" />
      <path d="M31 38 Q60 40 84 36" stroke="url(#ag-maverick)" strokeWidth="1.5"
        fill="none" strokeLinecap="round" opacity="0.5" />
      <path d="M32 42 Q58 50 78 52" stroke="url(#ag-maverick)" strokeWidth="1"
        fill="none" strokeLinecap="round" opacity="0.35" />
      {/* Disruption sparks scattered */}
      <circle cx="62" cy="20" r="2" fill="#f0d48a" opacity="0.8" />
      <circle cx="74" cy="28" r="1.5" fill="#f0d48a" opacity="0.6" />
      <circle cx="68" cy="38" r="1.5" fill="#d4a853" opacity="0.5" />
      <circle cx="46" cy="72" r="1.5" fill="#d4a853" opacity="0.4" />
      <circle cx="58" cy="68" r="1" fill="#d4a853" opacity="0.35" />
      {/* Broken orbit node markers */}
      <circle cx="84" cy="52" r="3" stroke="url(#ag-maverick)" strokeWidth="1.5"
        fill="none" opacity="0.6" />
      <circle cx="12" cy="52" r="3" stroke="url(#ag-maverick)" strokeWidth="1.5"
        fill="none" opacity="0.4" />
    </>
  ),

  // mystic — Ketu archetype: flame dissolving into cosmic void
  mystic: (
    <>
      {/* Void — dark cosmic circle */}
      <circle cx="48" cy="48" r="38" stroke="url(#ag-mystic)" strokeWidth="1" opacity="0.15" />
      <circle cx="48" cy="56" r="24" fill="url(#ag-mystic)" fillOpacity="0.08"
        stroke="url(#ag-mystic)" strokeWidth="1" opacity="0.3" />
      {/* Flame base */}
      <ellipse cx="48" cy="72" rx="12" ry="4" fill="url(#ag-mystic)" fillOpacity="0.4" />
      {/* Main flame body */}
      <path d="M36 72 Q34 58 40 48 Q44 40 48 28 Q52 40 56 48 Q62 58 60 72 Z"
        fill="url(#ag-mystic)" fillOpacity="0.7" filter="url(#aglow-mystic)" />
      {/* Inner flame — brighter core */}
      <path d="M42 72 Q41 60 44 52 Q46 44 48 36 Q50 44 52 52 Q55 60 54 72 Z"
        fill="url(#ag-mystic)" fillOpacity="0.9" filter="url(#aglow-mystic)" />
      {/* Flame tip */}
      <path d="M45 38 Q48 20 51 38" stroke="#f0d48a" strokeWidth="2"
        fill="none" strokeLinecap="round" filter="url(#aglow-mystic)" />
      {/* Dissolution particles rising */}
      <circle cx="38" cy="42" r="2.5" fill="#f0d48a" opacity="0.7" filter="url(#aglow2-mystic)" />
      <circle cx="32" cy="32" r="1.8" fill="#d4a853" opacity="0.5" />
      <circle cx="36" cy="22" r="1.2" fill="#d4a853" opacity="0.3" />
      <circle cx="58" cy="40" r="2" fill="#f0d48a" opacity="0.65" filter="url(#aglow2-mystic)" />
      <circle cx="64" cy="30" r="1.5" fill="#d4a853" opacity="0.45" />
      <circle cx="60" cy="20" r="1" fill="#d4a853" opacity="0.25" />
      <circle cx="48" cy="14" r="1.5" fill="#8a6d2b" opacity="0.3" />
      {/* Void rings — concentric dissolution */}
      <circle cx="48" cy="48" r="14" stroke="url(#ag-mystic)" strokeWidth="1"
        fill="none" opacity="0.25" strokeDasharray="3 5" />
      <circle cx="48" cy="48" r="22" stroke="url(#ag-mystic)" strokeWidth="1"
        fill="none" opacity="0.15" strokeDasharray="2 7" />
    </>
  ),
};
