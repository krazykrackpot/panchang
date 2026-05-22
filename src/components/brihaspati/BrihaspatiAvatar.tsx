/**
 * Brihaspati sage avatar — a stylised Indian guru / Devaguru illustration.
 *
 * Reads as a sage at any size (28px button → 96px panel header). Uses gold
 * gradient consistent with the project's design system (#f0d48a → #d4a853
 * → #8a6d2b). NOT a photograph, NOT a cartoon — graphic / iconographic
 * style inspired by classical Indian temple silhouettes.
 *
 * Elements:
 *   - Aureole / halo (Brihaspati is yellow / Jupiter)
 *   - Jata (matted-hair topknot) — sign of a sage
 *   - Forehead with vibhuti tilak
 *   - Closed-eye expression (meditative)
 *   - Beard (long, gives gravitas)
 *   - Shoulders draped in dhoti / uttariya
 */

import type { CSSProperties } from 'react';

interface BrihaspatiAvatarProps {
  size?: number;
  className?: string;
  style?: CSSProperties;
  /** Add the halo/aureole behind the head. Default true for ≥40px, false below. */
  withAureole?: boolean;
}

export function BrihaspatiAvatar({
  size = 64,
  className,
  style,
  withAureole,
}: BrihaspatiAvatarProps) {
  const showAureole = withAureole ?? size >= 40;
  const id = `bri-${size}`;

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="Brihaspati — Vedic sage"
      className={className}
      style={style}
    >
      <defs>
        <radialGradient id={`${id}-aureole`} cx="50%" cy="40%" r="50%">
          <stop offset="0%" stopColor="#fff7e0" stopOpacity="0.9" />
          <stop offset="60%" stopColor="#d4a853" stopOpacity="0.6" />
          <stop offset="100%" stopColor="#5d4716" stopOpacity="0" />
        </radialGradient>
        <linearGradient id={`${id}-skin`} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#f5deb3" />
          <stop offset="100%" stopColor="#d4a853" />
        </linearGradient>
        <linearGradient id={`${id}-robe`} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#f0d48a" />
          <stop offset="100%" stopColor="#8a6d2b" />
        </linearGradient>
        <linearGradient id={`${id}-beard`} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#f5f5f5" />
          <stop offset="100%" stopColor="#c9c2b0" />
        </linearGradient>
      </defs>

      {/* Aureole — soft golden halo behind the head */}
      {showAureole && (
        <circle cx="32" cy="28" r="26" fill={`url(#${id}-aureole)`} />
      )}

      {/* Robe / shoulders draped */}
      <path
        d="M10 60 Q10 46 32 46 Q54 46 54 60 L54 64 L10 64 Z"
        fill={`url(#${id}-robe)`}
      />

      {/* Neck */}
      <path d="M27 42 L37 42 L37 47 L27 47 Z" fill={`url(#${id}-skin)`} />

      {/* Beard — flowing, classical sage */}
      <path
        d="M20 36 Q22 50 32 54 Q42 50 44 36 Q40 42 32 42 Q24 42 20 36 Z"
        fill={`url(#${id}-beard)`}
      />
      <path
        d="M28 44 Q30 52 32 53 Q34 52 36 44 Q34 46 32 46 Q30 46 28 44 Z"
        fill="#a8a292"
        opacity="0.45"
      />

      {/* Face */}
      <ellipse cx="32" cy="29" rx="11" ry="13" fill={`url(#${id}-skin)`} />

      {/* Jata / topknot — matted hair tied above the head */}
      <path
        d="M24 18 Q24 11 32 9 Q40 11 40 18 Q40 16 32 16 Q24 16 24 18 Z"
        fill="#3d2817"
      />
      <ellipse cx="32" cy="11" rx="5" ry="3" fill="#5d3a1f" />
      <ellipse cx="32" cy="11" rx="2" ry="1.2" fill="#7a4d2a" opacity="0.7" />

      {/* Hair line — gentle wave around the face */}
      <path
        d="M21 21 Q23 17 27 17 M43 21 Q41 17 37 17"
        stroke="#3d2817"
        strokeWidth="1.8"
        fill="none"
        strokeLinecap="round"
      />

      {/* Eyes — closed (meditative). Two gentle curves. */}
      <path
        d="M26 30 Q28 28.5 30 30 M34 30 Q36 28.5 38 30"
        stroke="#3d2817"
        strokeWidth="1.4"
        fill="none"
        strokeLinecap="round"
      />

      {/* Brow ridge — adds gravitas */}
      <path
        d="M25 27 Q27 25.5 30 27 M34 27 Q37 25.5 39 27"
        stroke="#3d2817"
        strokeWidth="1"
        fill="none"
        strokeLinecap="round"
        opacity="0.7"
      />

      {/* Vibhuti tilak — three horizontal lines on the forehead */}
      <path
        d="M28 22 L36 22 M28.5 24 L35.5 24 M29 26 L35 26"
        stroke="#fff"
        strokeWidth="0.8"
        opacity="0.9"
        strokeLinecap="round"
      />
      {/* Centre dot of the tilak — red bindu */}
      <circle cx="32" cy="24" r="1" fill="#c43a3a" />

      {/* Subtle nose */}
      <path
        d="M32 28 Q31 32 32 34 Q33 32 32 28"
        fill="#b8895c"
        opacity="0.6"
      />

      {/* Lips — subtle */}
      <path
        d="M30 36 Q32 37 34 36"
        stroke="#7a4d2a"
        strokeWidth="0.8"
        fill="none"
        strokeLinecap="round"
        opacity="0.6"
      />

      {/* Uttariya — sash across one shoulder, gold accent */}
      <path
        d="M20 50 Q24 48 32 48 L34 60 L26 60 Z"
        fill={`url(#${id}-robe)`}
        opacity="0.7"
      />
    </svg>
  );
}
