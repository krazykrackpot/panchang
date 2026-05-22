/**
 * Festival icons for the tithi calendar — polychrome SVG illustrations
 * (Path B in docs/tithi-festival-icons-mockup.html).
 *
 * Each icon is a small standalone SVG that references shared gradients
 * defined by `<FestivalIconDefs />`. Mount the defs component ONCE near
 * the grid root, then any icon below can reference `url(#g-*)` ids.
 *
 * Style baseline:
 *   - 48×48 viewBox so the same artwork works at 16px (cell ribbon)
 *     and 40-80px (detail panel) without redesign
 *   - 4-6 saturated colours per icon, layered fills, gradient depth
 *   - ~2-3 KB rendered per icon
 *
 * Map `FESTIVAL_ICONS[slug]` to look up the icon for a given festival.
 * Unknown slugs fall back to `<GenericFestivalIcon />`.
 *
 * Photographic deity portraits (Vishnu, etc.) use the same IconProps shape
 * so call sites stay uniform; under the hood they render `next/image`
 * instead of inline SVG. Source assets live in `public/festivals/`.
 */

import Image from 'next/image';

interface IconProps {
  size?: number;
  className?: string;
}

/* --------------------------------------------------------------------
 * Photographic deity portraits — square-cropped via object-cover so
 * the central 1:1 region of a wider painting reads cleanly in 16-80px
 * tiles. Mirrors the BrihaspatiAvatar pattern.
 * ------------------------------------------------------------------ */
export function VishnuImage({ size = 16, className }: IconProps) {
  return (
    <Image
      src="/festivals/vishnu.png"
      alt="Vishnu reclining on Sheshanaga — Ekadashi"
      width={size}
      height={size}
      // Source painting is 1024×558 (~1.83:1). Without an explicit
      // object-position the engine crops to the geometric centre; we
      // bias slightly toward the centre-left where the crown + face sit.
      className={`object-cover rounded-lg ${className ?? ''}`.trim()}
      style={{ objectPosition: '38% 50%' }}
      sizes={`${Math.max(size, 32) * 2}px`}
    />
  );
}

export function ShivaImage({ size = 16, className }: IconProps) {
  return (
    <Image
      src="/festivals/shiva.png"
      alt="Shiva in meditation — Shivaratri"
      width={size}
      height={size}
      // Source is portrait 572×1024 (~1:1.79). object-position 50% 30%
      // centres on Shiva's face + crescent + jata-bun rather than the
      // floor/snow at the bottom of the painting.
      className={`object-cover rounded-lg ${className ?? ''}`.trim()}
      style={{ objectPosition: '50% 28%' }}
      sizes={`${Math.max(size, 32) * 2}px`}
    />
  );
}

export function DeviImage({ size = 16, className }: IconProps) {
  return (
    <Image
      src="/festivals/devi.png"
      alt="Devi (Durga) — Navratri"
      width={size}
      height={size}
      // Same portrait aspect as Shiva — bias the crop to the face +
      // crown + Sri Yantra halo.
      className={`object-cover rounded-lg ${className ?? ''}`.trim()}
      style={{ objectPosition: '50% 30%' }}
      sizes={`${Math.max(size, 32) * 2}px`}
    />
  );
}

export function LakshmiImage({ size = 16, className }: IconProps) {
  return (
    <Image
      src="/festivals/lakshmi.png"
      alt="Lakshmi — Diwali / Dhanteras / Sharad Purnima"
      width={size}
      height={size}
      className={`object-cover rounded-lg ${className ?? ''}`.trim()}
      style={{ objectPosition: '50% 30%' }}
      sizes={`${Math.max(size, 32) * 2}px`}
    />
  );
}

export function GaneshaImage({ size = 16, className }: IconProps) {
  return (
    <Image
      src="/festivals/ganesha.png"
      alt="Ganesha — Ganesh Chaturthi"
      width={size}
      height={size}
      className={`object-cover rounded-lg ${className ?? ''}`.trim()}
      style={{ objectPosition: '50% 32%' }}
      sizes={`${Math.max(size, 32) * 2}px`}
    />
  );
}

export function RamImage({ size = 16, className }: IconProps) {
  return (
    <Image
      src="/festivals/ram.png"
      alt="Sita-Ram — Ram Navami / Dussehra / Vivah Panchami"
      width={size}
      height={size}
      // Sita-Ram portrait is composed centrally with both figures from
      // ~25%-60% horizontal; centre crop hits faces + crowns.
      className={`object-cover rounded-lg ${className ?? ''}`.trim()}
      style={{ objectPosition: '50% 25%' }}
      sizes={`${Math.max(size, 32) * 2}px`}
    />
  );
}

export function SaraswatiImage({ size = 16, className }: IconProps) {
  return (
    <Image
      src="/festivals/saraswati.png"
      alt="Saraswati — Vasant Panchami"
      width={size}
      height={size}
      className={`object-cover rounded-lg ${className ?? ''}`.trim()}
      style={{ objectPosition: '50% 30%' }}
      sizes={`${Math.max(size, 32) * 2}px`}
    />
  );
}

export function BuddhaImage({ size = 16, className }: IconProps) {
  return (
    <Image
      src="/festivals/buddha.png"
      alt="Buddha — Buddha Purnima"
      width={size}
      height={size}
      className={`object-cover rounded-lg ${className ?? ''}`.trim()}
      style={{ objectPosition: '50% 32%' }}
      sizes={`${Math.max(size, 32) * 2}px`}
    />
  );
}

export function KaliImage({ size = 16, className }: IconProps) {
  return (
    <Image
      src="/festivals/kali.png"
      alt="Kali — Kali Puja"
      width={size}
      height={size}
      className={`object-cover rounded-lg ${className ?? ''}`.trim()}
      style={{ objectPosition: '50% 22%' }}
      sizes={`${Math.max(size, 32) * 2}px`}
    />
  );
}

export function ParashuramaImage({ size = 16, className }: IconProps) {
  return (
    <Image
      src="/festivals/parashurama.png"
      alt="Parashurama — Parashurama Jayanti"
      width={size}
      height={size}
      className={`object-cover rounded-lg ${className ?? ''}`.trim()}
      style={{ objectPosition: '50% 25%' }}
      sizes={`${Math.max(size, 32) * 2}px`}
    />
  );
}

export function NarasimhaImage({ size = 16, className }: IconProps) {
  return (
    <Image
      src="/festivals/narasimha.png"
      alt="Narasimha — Narasimha Jayanti"
      width={size}
      height={size}
      className={`object-cover rounded-lg ${className ?? ''}`.trim()}
      style={{ objectPosition: '50% 30%' }}
      sizes={`${Math.max(size, 32) * 2}px`}
    />
  );
}

export function DattatreyaImage({ size = 16, className }: IconProps) {
  return (
    <Image
      src="/festivals/dattatreya.png"
      alt="Dattatreya — Dattatreya Jayanti"
      width={size}
      height={size}
      className={`object-cover rounded-lg ${className ?? ''}`.trim()}
      style={{ objectPosition: '50% 25%' }}
      sizes={`${Math.max(size, 32) * 2}px`}
    />
  );
}

export function SkandaImage({ size = 16, className }: IconProps) {
  return (
    <Image
      src="/festivals/skanda.png"
      alt="Skanda — Skanda Sashthi"
      width={size}
      height={size}
      className={`object-cover rounded-lg ${className ?? ''}`.trim()}
      style={{ objectPosition: '50% 22%' }}
      sizes={`${Math.max(size, 32) * 2}px`}
    />
  );
}

export function AnnapurnaImage({ size = 16, className }: IconProps) {
  return (
    <Image
      src="/festivals/annapurna.png"
      alt="Annapurna — Annapurna Jayanti"
      width={size}
      height={size}
      className={`object-cover rounded-lg ${className ?? ''}`.trim()}
      style={{ objectPosition: '50% 28%' }}
      sizes={`${Math.max(size, 32) * 2}px`}
    />
  );
}

export function JagannathImage({ size = 16, className }: IconProps) {
  return (
    <Image
      src="/festivals/jagannath.png"
      alt="Jagannath, Balabhadra, Subhadra — Rath Yatra"
      width={size}
      height={size}
      className={`object-cover rounded-lg ${className ?? ''}`.trim()}
      style={{ objectPosition: '50% 30%' }}
      sizes={`${Math.max(size, 32) * 2}px`}
    />
  );
}

export function SuryaImage({ size = 16, className }: IconProps) {
  return (
    <Image
      src="/festivals/surya.png"
      alt="Surya — Makar Sankranti / Ratha Saptami / Chhath Puja"
      width={size}
      height={size}
      // Surya is centred frontally with the sunburst crown at ~25% from
      // top — bias the crop there so the crown + face dominate.
      className={`object-cover rounded-lg ${className ?? ''}`.trim()}
      style={{ objectPosition: '50% 25%' }}
      sizes={`${Math.max(size, 32) * 2}px`}
    />
  );
}

export function KrishnaImage({ size = 16, className }: IconProps) {
  return (
    <Image
      src="/festivals/krishna.png"
      alt="Krishna — Janmashtami / Govardhan Puja"
      width={size}
      height={size}
      // Krishna stands centred with the flute at chest height; bias the
      // crop slightly above centre to catch crown + peacock feather.
      className={`object-cover rounded-lg ${className ?? ''}`.trim()}
      style={{ objectPosition: '50% 28%' }}
      sizes={`${Math.max(size, 32) * 2}px`}
    />
  );
}

export function HanumanImage({ size = 16, className }: IconProps) {
  return (
    <Image
      src="/festivals/hanuman.png"
      alt="Hanuman — Hanuman Jayanti"
      width={size}
      height={size}
      // Hanuman is full-body portrait centred — bias to face (~22% from
      // top of frame).
      className={`object-cover rounded-lg ${className ?? ''}`.trim()}
      style={{ objectPosition: '50% 22%' }}
      sizes={`${Math.max(size, 32) * 2}px`}
    />
  );
}

/* --------------------------------------------------------------------
 * Shared gradient + filter definitions. Mount once.
 * ------------------------------------------------------------------ */
export function FestivalIconDefs() {
  return (
    <svg width="0" height="0" style={{ position: 'absolute' }} aria-hidden="true">
      <defs>
        <linearGradient id="fi-gold" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#f0d48a" />
          <stop offset="50%" stopColor="#d4a853" />
          <stop offset="100%" stopColor="#8a6d2b" />
        </linearGradient>
        <linearGradient id="fi-terracotta" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#fbbf24" />
          <stop offset="40%" stopColor="#b45309" />
          <stop offset="100%" stopColor="#78350f" />
        </linearGradient>
        <linearGradient id="fi-flame" x1="0%" y1="100%" x2="0%" y2="0%">
          <stop offset="0%" stopColor="#fef3c7" />
          <stop offset="30%" stopColor="#fde047" />
          <stop offset="65%" stopColor="#f97316" />
          <stop offset="100%" stopColor="#dc2626" />
        </linearGradient>
        <linearGradient id="fi-magenta" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#fce7f3" />
          <stop offset="60%" stopColor="#ec4899" />
          <stop offset="100%" stopColor="#be185d" />
        </linearGradient>
        <linearGradient id="fi-cyan" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#cffafe" />
          <stop offset="60%" stopColor="#06b6d4" />
          <stop offset="100%" stopColor="#0e7490" />
        </linearGradient>
        <linearGradient id="fi-deep-green" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#bbf7d0" />
          <stop offset="60%" stopColor="#10b981" />
          <stop offset="100%" stopColor="#047857" />
        </linearGradient>
        <linearGradient id="fi-peacock" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#67e8f9" />
          <stop offset="50%" stopColor="#0891b2" />
          <stop offset="100%" stopColor="#155e75" />
        </linearGradient>
        <linearGradient id="fi-yellow" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#fef9c3" />
          <stop offset="50%" stopColor="#facc15" />
          <stop offset="100%" stopColor="#ca8a04" />
        </linearGradient>
        <linearGradient id="fi-linga" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#e2e8f0" />
          <stop offset="50%" stopColor="#475569" />
          <stop offset="100%" stopColor="#1e293b" />
        </linearGradient>
        <linearGradient id="fi-red" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#fb7185" />
          <stop offset="100%" stopColor="#9f1239" />
        </linearGradient>
        <linearGradient id="fi-purple" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#e9d5ff" />
          <stop offset="50%" stopColor="#a855f7" />
          <stop offset="100%" stopColor="#6b21a8" />
        </linearGradient>
        <radialGradient id="fi-moon" cx="35%" cy="35%">
          <stop offset="0%" stopColor="#fff8e1" />
          <stop offset="40%" stopColor="#f0d48a" />
          <stop offset="100%" stopColor="#d4a853" />
        </radialGradient>
        <radialGradient id="fi-warm-glow" cx="50%" cy="50%">
          <stop offset="0%" stopColor="#fde047" />
          <stop offset="100%" stopColor="#fde047" stopOpacity="0" />
        </radialGradient>
        <filter id="fi-soft">
          <feGaussianBlur stdDeviation="0.6" result="b" />
          <feMerge>
            <feMergeNode in="b" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
    </svg>
  );
}

const wrap = (size: number, className: string | undefined, body: React.ReactNode) => (
  <svg width={size} height={size} viewBox="0 0 48 48" className={className} aria-hidden="true">
    {body}
  </svg>
);

/* --------------------------------------------------------------------
 * 1. Light & Lamp Festivals
 * ------------------------------------------------------------------ */

export function DiwaliIcon({ size = 16, className }: IconProps) {
  return wrap(size, className, (
    <>
      <circle cx="24" cy="26" r="22" fill="url(#fi-warm-glow)" opacity="0.22" />
      <ellipse cx="10" cy="36.5" rx="6" ry="1.8" fill="#451a03" opacity="0.6" />
      <path d="M5 36 C5 30, 15 30, 15 36 Z" fill="url(#fi-terracotta)" stroke="#7c2d12" strokeWidth="0.35" />
      <ellipse cx="10" cy="30" rx="5" ry="1.2" fill="url(#fi-gold)" stroke="#92400e" strokeWidth="0.3" />
      <path d="M9 28 Q10 25.5 11 28 Q11 22 10 21 Q9 22 9 28 Z" fill="url(#fi-flame)" filter="url(#fi-soft)" />
      <ellipse cx="38" cy="36.5" rx="6" ry="1.8" fill="#451a03" opacity="0.6" />
      <path d="M33 36 C33 30, 43 30, 43 36 Z" fill="url(#fi-terracotta)" stroke="#7c2d12" strokeWidth="0.35" />
      <ellipse cx="38" cy="30" rx="5" ry="1.2" fill="url(#fi-gold)" stroke="#92400e" strokeWidth="0.3" />
      <path d="M37 28 Q38 25.5 39 28 Q39 22 38 21 Q37 22 37 28 Z" fill="url(#fi-flame)" filter="url(#fi-soft)" />
      <ellipse cx="24" cy="22.5" rx="7.5" ry="2" fill="#451a03" opacity="0.6" />
      <path d="M17 22 C17 13, 31 13, 31 22 Z" fill="url(#fi-terracotta)" stroke="#7c2d12" strokeWidth="0.45" />
      <ellipse cx="24" cy="13" rx="6.2" ry="1.4" fill="url(#fi-gold)" stroke="#78350f" strokeWidth="0.4" />
      <path d="M22 11 Q24 7 26 11 Q26 3 24 1.5 Q22 3 22 11 Z" fill="url(#fi-flame)" filter="url(#fi-soft)" />
      <ellipse cx="24" cy="5.5" rx="0.7" ry="2.3" fill="#fef3c7" opacity="0.95" />
      <circle cx="4" cy="14" r="0.7" fill="#fde047" />
      <circle cx="44" cy="14" r="0.7" fill="#fde047" />
      <circle cx="2" cy="22" r="0.5" fill="#fbbf24" />
      <circle cx="46" cy="22" r="0.5" fill="#fbbf24" />
    </>
  ));
}

export function NarakChaturdashiIcon({ size = 16, className }: IconProps) {
  // Single oil-lamp variant — one large diya for "small Diwali"
  return wrap(size, className, (
    <>
      <ellipse cx="24" cy="40" rx="14" ry="3" fill="#451a03" opacity="0.7" />
      <path d="M10 40 C10 30, 38 30, 38 40 Z" fill="url(#fi-terracotta)" stroke="#7c2d12" strokeWidth="0.5" />
      <ellipse cx="24" cy="30" rx="11" ry="2.2" fill="url(#fi-gold)" stroke="#78350f" strokeWidth="0.4" />
      <path d="M21 28 Q24 22 27 28 Q27 14 24 10 Q21 14 21 28 Z" fill="url(#fi-flame)" filter="url(#fi-soft)" />
      <ellipse cx="24" cy="16" rx="1" ry="3" fill="#fef3c7" opacity="0.9" />
    </>
  ));
}

export function KartikPurnimaIcon({ size = 16, className }: IconProps) {
  // 7-flame deepak (sapta-jyoti)
  return wrap(size, className, (
    <>
      <ellipse cx="24" cy="40" rx="16" ry="2.5" fill="#451a03" opacity="0.6" />
      <path d="M8 40 C8 30, 40 30, 40 40 Z" fill="url(#fi-terracotta)" stroke="#7c2d12" strokeWidth="0.5" />
      <ellipse cx="24" cy="30" rx="13" ry="2.4" fill="url(#fi-gold)" stroke="#78350f" strokeWidth="0.4" />
      {[12, 17, 22, 27, 32, 36].map((x, i) => (
        <g key={i}>
          <line x1={x} y1="30" x2={x} y2={i === 2 || i === 3 ? '22' : '24'} stroke="url(#fi-gold)" strokeWidth="1" />
          <path d={`M${x - 1} ${i === 2 || i === 3 ? '22' : '24'} Q${x} ${i === 2 || i === 3 ? '18' : '20'} ${x + 1} ${i === 2 || i === 3 ? '22' : '24'} Q${x + 1} ${i === 2 || i === 3 ? '15' : '18'} ${x} ${i === 2 || i === 3 ? '13' : '16'} Q${x - 1} ${i === 2 || i === 3 ? '15' : '18'} ${x - 1} ${i === 2 || i === 3 ? '22' : '24'}Z`} fill="url(#fi-flame)" />
        </g>
      ))}
    </>
  ));
}

export function DhanterasIcon({ size = 16, className }: IconProps) {
  // Lakshmi coin pot
  return wrap(size, className, (
    <>
      <path d="M14 24 C14 36, 14 40, 24 42 C34 40, 34 36, 34 24 Z" stroke="#78350f" strokeWidth="0.5" fill="url(#fi-terracotta)" />
      <ellipse cx="24" cy="24" rx="10" ry="2.5" fill="url(#fi-gold)" stroke="#78350f" strokeWidth="0.4" />
      <circle cx="14" cy="20" r="2.4" fill="url(#fi-gold)" stroke="#92400e" strokeWidth="0.3" />
      <circle cx="20" cy="14" r="2.6" fill="url(#fi-gold)" stroke="#92400e" strokeWidth="0.3" />
      <circle cx="28" cy="14" r="2.6" fill="url(#fi-gold)" stroke="#92400e" strokeWidth="0.3" />
      <circle cx="34" cy="20" r="2.4" fill="url(#fi-gold)" stroke="#92400e" strokeWidth="0.3" />
      <circle cx="24" cy="10" r="2.8" fill="url(#fi-gold)" stroke="#92400e" strokeWidth="0.3" />
      <text x="24" y="13.5" textAnchor="middle" fontFamily="serif" fontSize="3.5" fontWeight="bold" fill="#78350f">श्री</text>
      <line x1="16" y1="30" x2="32" y2="30" stroke="#78350f" strokeWidth="0.4" opacity="0.5" />
    </>
  ));
}

export function ChhathIcon({ size = 16, className }: IconProps) {
  // Setting sun + water lotus
  return wrap(size, className, (
    <>
      <circle cx="24" cy="20" r="9" fill="url(#fi-moon)" filter="url(#fi-soft)" />
      <line x1="24" y1="6" x2="24" y2="10" stroke="url(#fi-gold)" strokeWidth="1.2" />
      <line x1="10" y1="20" x2="14" y2="20" stroke="url(#fi-gold)" strokeWidth="1.2" />
      <line x1="38" y1="20" x2="34" y2="20" stroke="url(#fi-gold)" strokeWidth="1.2" />
      <line x1="13" y1="9" x2="16" y2="12" stroke="url(#fi-gold)" strokeWidth="1" />
      <line x1="35" y1="9" x2="32" y2="12" stroke="url(#fi-gold)" strokeWidth="1" />
      <path d="M2 36 Q12 32 24 36 Q36 40 46 36" stroke="url(#fi-cyan)" strokeWidth="1.2" fill="none" />
      <path d="M2 40 Q12 36 24 40 Q36 44 46 40" stroke="url(#fi-cyan)" strokeWidth="1.2" fill="none" />
      <path d="M18 32 Q24 30 30 32 Q28 36 24 35 Q20 36 18 32" fill="url(#fi-magenta)" opacity="0.85" />
      <ellipse cx="24" cy="34" rx="1.2" ry="0.5" fill="#fef3c7" />
    </>
  ));
}

/* --------------------------------------------------------------------
 * 2. Shiva & Shakti
 * ------------------------------------------------------------------ */

export function ShivaratriIcon({ size = 16, className }: IconProps) {
  return wrap(size, className, (
    <>
      <circle cx="24" cy="22" r="20" fill="#7dd3fc" opacity="0.05" />
      <path d="M32 5 A4.5 4.5 0 1 0 36 12 A3.3 3.3 0 1 1 32 5 Z" fill="#e0f2fe" filter="url(#fi-soft)" />
      <path d="M14 26 Q9 22 11 17 Q14 12 24 12 Q34 12 37 17 Q39 22 34 26" stroke="#475569" strokeWidth="2" fill="none" strokeLinecap="round" />
      <ellipse cx="34" cy="17" rx="1.5" ry="2.4" fill="#334155" />
      <circle cx="34" cy="16" r="0.5" fill="#facc15" />
      <line x1="34" y1="19" x2="34" y2="21" stroke="#dc2626" strokeWidth="0.4" />
      <ellipse cx="24" cy="38" rx="14" ry="2.5" fill="url(#fi-gold)" />
      <path d="M10 38 C10 34, 38 34, 38 38 Z" fill="url(#fi-gold)" stroke="#78350f" strokeWidth="0.4" />
      <ellipse cx="34" cy="34" rx="3.5" ry="0.8" fill="#075985" opacity="0.7" />
      <path d="M19 33 C19 22, 22 7, 24 7 C26 7, 29 22, 29 33 Z" fill="url(#fi-linga)" stroke="#1e293b" strokeWidth="0.4" />
      <line x1="20.5" y1="20" x2="27.5" y2="20" stroke="#f5f5f4" strokeWidth="0.7" />
      <line x1="20.5" y1="22" x2="27.5" y2="22" stroke="#f5f5f4" strokeWidth="0.7" />
      <line x1="20.5" y1="24" x2="27.5" y2="24" stroke="#f5f5f4" strokeWidth="0.7" />
      <circle cx="24" cy="22" r="1" fill="#dc2626" />
      <path d="M16 39 Q18 36 20 39 Q19 41 18 41 Q17 41 16 39 Z" fill="url(#fi-deep-green)" stroke="#047857" strokeWidth="0.3" />
      <path d="M21 41 Q23 38 25 41 Q24 43 24 43 Q23 43 22 41 Z" fill="url(#fi-deep-green)" stroke="#047857" strokeWidth="0.3" />
      <path d="M28 39 Q30 36 32 39 Q31 41 30 41 Q29 41 28 39 Z" fill="url(#fi-deep-green)" stroke="#047857" strokeWidth="0.3" />
    </>
  ));
}

export function HolikaDahanIcon({ size = 16, className }: IconProps) {
  return wrap(size, className, (
    <>
      <ellipse cx="24" cy="42" rx="16" ry="2.5" fill="url(#fi-terracotta)" opacity="0.8" />
      <path d="M14 38 L26 38 L24 36 L22 38" stroke="url(#fi-gold)" strokeWidth="1" />
      <line x1="13" y1="40" x2="35" y2="40" stroke="url(#fi-gold)" strokeWidth="1.2" />
      <line x1="15" y1="38" x2="33" y2="38" stroke="url(#fi-gold)" strokeWidth="0.9" />
      <path d="M14 38 L24 10 L34 38 Z" fill="url(#fi-flame)" filter="url(#fi-soft)" />
      <path d="M18 38 L24 18 L30 38 Z" fill="#fde047" opacity="0.85" />
      <path d="M21 38 L24 26 L27 38 Z" fill="#fef3c7" opacity="0.7" />
      <ellipse cx="22" cy="6" rx="0.4" ry="1" fill="#fde047" opacity="0.6" />
      <ellipse cx="26" cy="4" rx="0.4" ry="1" fill="#fde047" opacity="0.6" />
    </>
  ));
}

export function HoliIcon({ size = 16, className }: IconProps) {
  return wrap(size, className, (
    <>
      <rect x="22.5" y="40" width="3" height="3" fill="#78350f" rx="0.4" />
      <rect x="20" y="43" width="8" height="2" fill="url(#fi-gold)" rx="0.5" />
      <rect x="22" y="26" width="4" height="14" fill="url(#fi-gold)" rx="0.6" stroke="#78350f" strokeWidth="0.3" />
      <rect x="20" y="24" width="8" height="3" fill="url(#fi-gold)" stroke="#78350f" strokeWidth="0.3" rx="0.5" />
      <rect x="23" y="20" width="2" height="5" fill="url(#fi-gold)" stroke="#78350f" strokeWidth="0.3" />
      <ellipse cx="10" cy="13" rx="6.5" ry="5" fill="url(#fi-magenta)" opacity="0.92" filter="url(#fi-soft)" />
      <ellipse cx="24" cy="5.5" rx="4" ry="3.5" fill="url(#fi-yellow)" opacity="0.95" filter="url(#fi-soft)" />
      <ellipse cx="38" cy="13" rx="6.5" ry="5" fill="url(#fi-cyan)" opacity="0.9" filter="url(#fi-soft)" />
      <ellipse cx="40" cy="32" rx="5.5" ry="4.5" fill="url(#fi-deep-green)" opacity="0.9" />
      <ellipse cx="8" cy="32" rx="5.5" ry="4.5" fill="url(#fi-red)" opacity="0.9" />
      <circle cx="14" cy="22" r="1.2" fill="#ec4899" />
      <circle cx="34" cy="22" r="1.2" fill="#06b6d4" />
      <circle cx="4" cy="22" r="0.8" fill="#facc15" />
      <circle cx="44" cy="22" r="0.8" fill="#10b981" />
      <circle cx="44" cy="42" r="0.8" fill="#f43f5e" />
      <circle cx="2" cy="42" r="0.8" fill="#a855f7" />
    </>
  ));
}

export function NavaratriIcon({ size = 16, className }: IconProps) {
  // Red trishul on lotus base — Durga
  return wrap(size, className, (
    <>
      <path d="M14 38 Q24 33 34 38 Q32 42 24 42 Q16 42 14 38 Z" fill="url(#fi-red)" opacity="0.85" stroke="#9f1239" strokeWidth="0.4" />
      <path d="M16 39 Q24 35 32 39" stroke="#fce7f3" strokeWidth="0.4" fill="none" opacity="0.7" />
      <line x1="24" y1="38" x2="24" y2="18" stroke="url(#fi-red)" strokeWidth="2.4" />
      <path d="M14 18 L24 4 L34 18" stroke="url(#fi-red)" strokeWidth="2.4" fill="none" strokeLinejoin="round" />
      <line x1="14" y1="18" x2="14" y2="10" stroke="url(#fi-red)" strokeWidth="2.2" />
      <line x1="34" y1="18" x2="34" y2="10" stroke="url(#fi-red)" strokeWidth="2.2" />
      <line x1="24" y1="18" x2="24" y2="8" stroke="url(#fi-red)" strokeWidth="2.2" />
      <path d="M14 10 L11 6 L14 7 Z" fill="url(#fi-red)" />
      <path d="M34 10 L37 6 L34 7 Z" fill="url(#fi-red)" />
      <path d="M24 8 L24 2 L26 4 Z" fill="url(#fi-red)" />
      <circle cx="24" cy="13" r="0.8" fill="#fef3c7" />
    </>
  ));
}

export function DussehraIcon({ size = 16, className }: IconProps) {
  // Bow + arrow + golden glow (Ram's victory)
  return wrap(size, className, (
    <>
      <circle cx="24" cy="24" r="20" fill="url(#fi-warm-glow)" opacity="0.15" />
      <path d="M8 6 Q-2 24 8 42" stroke="url(#fi-gold)" strokeWidth="2.2" fill="none" strokeLinecap="round" />
      <line x1="8" y1="6" x2="8" y2="42" stroke="url(#fi-gold)" strokeWidth="0.6" opacity="0.5" />
      <line x1="8" y1="24" x2="44" y2="24" stroke="url(#fi-gold)" strokeWidth="1.5" />
      <path d="M42 22 L46 24 L42 26 Z" fill="url(#fi-gold)" stroke="#78350f" strokeWidth="0.3" />
      <path d="M6 22 L2 24 L6 26 Z" fill="url(#fi-red)" stroke="#9f1239" strokeWidth="0.3" />
      <line x1="9" y1="20" x2="11" y2="22" stroke="url(#fi-gold)" strokeWidth="0.6" />
      <line x1="9" y1="28" x2="11" y2="26" stroke="url(#fi-gold)" strokeWidth="0.6" />
    </>
  ));
}

/* --------------------------------------------------------------------
 * 3. Vishnu / Krishna / Rama
 * ------------------------------------------------------------------ */

export function JanmashtamiIcon({ size = 16, className }: IconProps) {
  return wrap(size, className, (
    <>
      <line x1="12" y1="2" x2="24" y2="10" stroke="#a16207" strokeWidth="0.7" />
      <line x1="36" y1="2" x2="24" y2="10" stroke="#a16207" strokeWidth="0.7" />
      <circle cx="24" cy="10" r="1" fill="url(#fi-gold)" />
      <path d="M15 14 C12 22, 12 34, 24 39 C36 34, 36 22, 33 14 Z" fill="url(#fi-terracotta)" stroke="#7c2d12" strokeWidth="0.5" />
      <ellipse cx="24" cy="24" rx="10" ry="2.6" fill="url(#fi-gold)" />
      <circle cx="18" cy="24" r="0.6" fill="#7c2d12" />
      <circle cx="22" cy="24" r="0.6" fill="#7c2d12" />
      <circle cx="26" cy="24" r="0.6" fill="#7c2d12" />
      <circle cx="30" cy="24" r="0.6" fill="#7c2d12" />
      <ellipse cx="24" cy="14" rx="9" ry="2.2" fill="url(#fi-gold)" stroke="#78350f" strokeWidth="0.5" />
      <ellipse cx="24" cy="13" rx="6" ry="1" fill="#fef3c7" />
      <ellipse cx="22" cy="12.5" rx="1.5" ry="0.5" fill="#fffbeb" />
      <path d="M30 12 Q33 7 38 2.5" stroke="#0891b2" strokeWidth="0.9" fill="none" />
      <ellipse cx="38" cy="3" rx="2.4" ry="3" fill="url(#fi-peacock)" filter="url(#fi-soft)" />
      <ellipse cx="38" cy="3" rx="1.5" ry="2" fill="url(#fi-deep-green)" />
      <ellipse cx="38" cy="3" rx="0.7" ry="1.1" fill="#facc15" />
      <circle cx="38" cy="3" r="0.35" fill="#1e293b" />
    </>
  ));
}

export function RamNavamiIcon({ size = 16, className }: IconProps) {
  // Bow + arrow + sun glow
  return wrap(size, className, (
    <>
      <circle cx="24" cy="24" r="20" fill="url(#fi-warm-glow)" opacity="0.18" />
      <path d="M10 6 Q-2 24 10 42" stroke="url(#fi-gold)" strokeWidth="2.4" fill="none" strokeLinecap="round" />
      <path d="M10 6 Q12 14 10 24 Q12 34 10 42" stroke="#78350f" strokeWidth="0.5" fill="none" opacity="0.6" />
      <line x1="10" y1="24" x2="42" y2="24" stroke="url(#fi-gold)" strokeWidth="1.6" />
      <path d="M40 22 L46 24 L40 26 Z" fill="url(#fi-gold)" stroke="#78350f" strokeWidth="0.4" />
      <path d="M8 22 L4 24 L8 26 Z" fill="url(#fi-yellow)" stroke="#a16207" strokeWidth="0.4" />
    </>
  ));
}

export function HanumanJayantiIcon({ size = 16, className }: IconProps) {
  // Gada (mace) with red wraps
  return wrap(size, className, (
    <>
      <line x1="24" y1="44" x2="24" y2="22" stroke="url(#fi-gold)" strokeWidth="2.6" />
      <ellipse cx="24" cy="14" rx="10" ry="9" fill="url(#fi-gold)" stroke="#78350f" strokeWidth="0.6" filter="url(#fi-soft)" />
      <ellipse cx="24" cy="14" rx="6.5" ry="5.5" fill="url(#fi-red)" opacity="0.4" />
      <line x1="24" y1="4" x2="24" y2="2" stroke="url(#fi-gold)" strokeWidth="1.5" />
      <line x1="34" y1="14" x2="36" y2="14" stroke="url(#fi-gold)" strokeWidth="1.5" />
      <line x1="14" y1="14" x2="12" y2="14" stroke="url(#fi-gold)" strokeWidth="1.5" />
      <line x1="17" y1="7" x2="15" y2="5" stroke="url(#fi-gold)" strokeWidth="1.2" />
      <line x1="31" y1="7" x2="33" y2="5" stroke="url(#fi-gold)" strokeWidth="1.2" />
      <line x1="20" y1="28" x2="28" y2="28" stroke="url(#fi-red)" strokeWidth="1.5" />
      <line x1="20" y1="32" x2="28" y2="32" stroke="url(#fi-red)" strokeWidth="1.5" />
      <line x1="20" y1="36" x2="28" y2="36" stroke="url(#fi-red)" strokeWidth="1.5" />
    </>
  ));
}

export function AkshayaTritiyaIcon({ size = 16, className }: IconProps) {
  // Gold coins overflowing pot
  return wrap(size, className, (
    <>
      <circle cx="24" cy="24" r="22" fill="url(#fi-warm-glow)" opacity="0.18" />
      <path d="M14 24 C14 36, 14 40, 24 42 C34 40, 34 36, 34 24 Z" stroke="#78350f" strokeWidth="0.5" fill="url(#fi-terracotta)" filter="url(#fi-soft)" />
      <ellipse cx="24" cy="24" rx="10" ry="2.5" fill="url(#fi-gold)" stroke="#78350f" strokeWidth="0.4" />
      <circle cx="14" cy="20" r="2.4" fill="url(#fi-gold)" stroke="#92400e" strokeWidth="0.3" />
      <circle cx="20" cy="14" r="2.6" fill="url(#fi-gold)" stroke="#92400e" strokeWidth="0.3" />
      <circle cx="28" cy="14" r="2.6" fill="url(#fi-gold)" stroke="#92400e" strokeWidth="0.3" />
      <circle cx="34" cy="20" r="2.4" fill="url(#fi-gold)" stroke="#92400e" strokeWidth="0.3" />
      <circle cx="24" cy="10" r="2.8" fill="url(#fi-gold)" stroke="#92400e" strokeWidth="0.3" />
      <text x="24" y="13.5" textAnchor="middle" fontFamily="serif" fontSize="3.5" fontWeight="bold" fill="#78350f">श्री</text>
    </>
  ));
}

export function BuddhaPurnimaIcon({ size = 16, className }: IconProps) {
  // Dharma wheel with subtle moon halo
  return wrap(size, className, (
    <>
      <circle cx="24" cy="24" r="20" fill="url(#fi-moon)" opacity="0.18" />
      <circle cx="24" cy="24" r="16" fill="none" stroke="url(#fi-gold)" strokeWidth="2" filter="url(#fi-soft)" />
      <circle cx="24" cy="24" r="4" fill="url(#fi-gold)" />
      <line x1="24" y1="8" x2="24" y2="40" stroke="url(#fi-gold)" strokeWidth="1.5" />
      <line x1="8" y1="24" x2="40" y2="24" stroke="url(#fi-gold)" strokeWidth="1.5" />
      <line x1="13" y1="13" x2="35" y2="35" stroke="url(#fi-gold)" strokeWidth="1.5" />
      <line x1="35" y1="13" x2="13" y2="35" stroke="url(#fi-gold)" strokeWidth="1.5" />
      <circle cx="24" cy="8" r="1.4" fill="url(#fi-gold)" />
      <circle cx="24" cy="40" r="1.4" fill="url(#fi-gold)" />
      <circle cx="8" cy="24" r="1.4" fill="url(#fi-gold)" />
      <circle cx="40" cy="24" r="1.4" fill="url(#fi-gold)" />
    </>
  ));
}

export function GuruPurnimaIcon({ size = 16, className }: IconProps) {
  // Padukas (sacred sandals) with golden aura
  return wrap(size, className, (
    <>
      <circle cx="24" cy="24" r="20" fill="url(#fi-warm-glow)" opacity="0.18" />
      <ellipse cx="16" cy="24" rx="6.5" ry="11" fill="url(#fi-gold)" stroke="#78350f" strokeWidth="0.6" filter="url(#fi-soft)" />
      <ellipse cx="16" cy="18" rx="3.2" ry="3.2" fill="url(#fi-terracotta)" />
      <ellipse cx="32" cy="24" rx="6.5" ry="11" fill="url(#fi-gold)" stroke="#78350f" strokeWidth="0.6" filter="url(#fi-soft)" />
      <ellipse cx="32" cy="18" rx="3.2" ry="3.2" fill="url(#fi-terracotta)" />
      <line x1="16" y1="22" x2="16" y2="32" stroke="#78350f" strokeWidth="0.7" opacity="0.7" />
      <line x1="32" y1="22" x2="32" y2="32" stroke="#78350f" strokeWidth="0.7" opacity="0.7" />
    </>
  ));
}

export function GaneshChaturthiIcon({ size = 16, className }: IconProps) {
  // Modak with Om
  return wrap(size, className, (
    <>
      <path d="M24 6 C16 6, 12 14, 12 22 C12 34, 18 40, 24 42 C30 40, 36 34, 36 22 C36 14, 32 6, 24 6 Z" fill="url(#fi-gold)" stroke="#78350f" strokeWidth="0.5" filter="url(#fi-soft)" />
      <path d="M14 14 Q24 12 34 14" stroke="#78350f" strokeWidth="0.5" fill="none" opacity="0.7" />
      <path d="M14 10 Q24 8 34 10" stroke="#78350f" strokeWidth="0.5" fill="none" opacity="0.7" />
      <path d="M22 6 L24 2 L26 6" stroke="url(#fi-red)" strokeWidth="1.2" fill="url(#fi-red)" />
      <circle cx="24" cy="1.5" r="1" fill="url(#fi-red)" />
      <text x="24" y="28" textAnchor="middle" fontFamily="serif" fontSize="10" fontWeight="bold" fill="#7c2d12">ॐ</text>
    </>
  ));
}

/* --------------------------------------------------------------------
 * 4. Women's Vrats & Family
 * ------------------------------------------------------------------ */

export function KarwaChauthIcon({ size = 16, className }: IconProps) {
  return wrap(size, className, (
    <>
      <path d="M40 8 A6 6 0 1 0 44 16 A4.5 4.5 0 1 1 40 8 Z" fill="url(#fi-moon)" filter="url(#fi-soft)" />
      <path d="M6 38 C6 32, 8 30, 14 30 L18 30 C18 22, 20 20, 24 20 L26 20 C26 16, 30 14, 34 16 C36 18, 36 22, 36 24 L42 24 C42 32, 38 38, 28 40 Z" stroke="#78350f" strokeWidth="0.6" fill="url(#fi-terracotta)" filter="url(#fi-soft)" />
      <ellipse cx="34" cy="16" rx="4" ry="1" fill="url(#fi-gold)" />
      <ellipse cx="24" cy="38" rx="14" ry="2" fill="#451a03" opacity="0.5" />
      <line x1="14" y1="32" x2="36" y2="32" stroke="url(#fi-gold)" strokeWidth="1.4" />
      <circle cx="20" cy="32" r="0.5" fill="#78350f" />
      <circle cx="28" cy="32" r="0.5" fill="#78350f" />
    </>
  ));
}

export function RakshaBandhanIcon({ size = 16, className }: IconProps) {
  return wrap(size, className, (
    <>
      <line x1="2" y1="24" x2="16" y2="24" stroke="url(#fi-red)" strokeWidth="3" strokeLinecap="round" />
      <line x1="32" y1="24" x2="46" y2="24" stroke="url(#fi-red)" strokeWidth="3" strokeLinecap="round" />
      <circle cx="24" cy="24" r="9" fill="url(#fi-gold)" stroke="#78350f" strokeWidth="0.6" filter="url(#fi-soft)" />
      <circle cx="24" cy="24" r="5" fill="url(#fi-red)" opacity="0.8" />
      <circle cx="24" cy="24" r="2" fill="url(#fi-gold)" />
      <circle cx="24" cy="24" r="0.8" fill="#fef3c7" />
      <line x1="20" y1="33" x2="18" y2="40" stroke="url(#fi-red)" strokeWidth="1" />
      <line x1="22" y1="33" x2="22" y2="42" stroke="url(#fi-red)" strokeWidth="1" />
      <line x1="24" y1="33" x2="24" y2="44" stroke="url(#fi-red)" strokeWidth="1" />
      <line x1="26" y1="33" x2="26" y2="42" stroke="url(#fi-red)" strokeWidth="1" />
      <line x1="28" y1="33" x2="30" y2="40" stroke="url(#fi-red)" strokeWidth="1" />
    </>
  ));
}

export function VatSavitriIcon({ size = 16, className }: IconProps) {
  // Banyan tree with golden trunk
  return wrap(size, className, (
    <>
      <ellipse cx="24" cy="46" rx="16" ry="1.5" fill="#451a03" opacity="0.5" />
      <line x1="24" y1="46" x2="24" y2="30" stroke="url(#fi-terracotta)" strokeWidth="3" />
      <path d="M8 28 Q10 20 14 20 Q14 14 22 14 Q22 8 26 8 Q26 14 34 14 Q34 20 38 20 Q40 28 32 30 Q24 32 16 30 Q8 28 8 28 Z" stroke="#047857" strokeWidth="0.5" fill="url(#fi-deep-green)" filter="url(#fi-soft)" />
      <circle cx="20" cy="20" r="1" fill="#bbf7d0" />
      <circle cx="28" cy="22" r="1.2" fill="#bbf7d0" />
      <circle cx="14" cy="24" r="0.8" fill="#bbf7d0" />
      <circle cx="34" cy="24" r="0.8" fill="#bbf7d0" />
      <line x1="14" y1="28" x2="14" y2="40" stroke="#92400e" strokeWidth="0.5" />
      <line x1="18" y1="30" x2="18" y2="42" stroke="#92400e" strokeWidth="0.4" />
      <line x1="30" y1="30" x2="30" y2="42" stroke="#92400e" strokeWidth="0.4" />
      <line x1="34" y1="28" x2="34" y2="40" stroke="#92400e" strokeWidth="0.5" />
    </>
  ));
}

export function HartalikaTeejIcon({ size = 16, className }: IconProps) {
  return wrap(size, className, (
    <>
      <ellipse cx="24" cy="42" rx="14" ry="2" fill="#451a03" opacity="0.5" />
      <path d="M16 40 C16 32, 16 28, 24 26 C32 28, 32 32, 32 40 Z" fill="url(#fi-terracotta)" stroke="#78350f" strokeWidth="0.5" />
      <ellipse cx="24" cy="24" rx="8" ry="2" fill="url(#fi-gold)" stroke="#78350f" strokeWidth="0.4" />
      <path d="M20 24 C20 14, 24 6, 24 6 C24 6, 28 14, 28 24 Z" stroke="#1e293b" strokeWidth="0.5" fill="url(#fi-linga)" />
      <path d="M24 4 C22 6, 22 4, 24 2 C26 4, 26 6, 24 4" fill="#7dd3fc" />
      <line x1="21" y1="14" x2="27" y2="14" stroke="#f5f5f4" strokeWidth="0.5" />
      <circle cx="24" cy="16" r="0.5" fill="#dc2626" />
      <circle cx="14" cy="36" r="1.6" fill="url(#fi-red)" />
      <circle cx="34" cy="36" r="1.6" fill="url(#fi-deep-green)" />
      <circle cx="10" cy="40" r="1" fill="url(#fi-gold)" />
      <circle cx="38" cy="40" r="1" fill="url(#fi-gold)" />
    </>
  ));
}

export function HariyaliTeejIcon({ size = 16, className }: IconProps) {
  // Green sapling / swing motif
  return wrap(size, className, (
    <>
      <line x1="6" y1="6" x2="42" y2="6" stroke="url(#fi-deep-green)" strokeWidth="1.5" />
      <line x1="14" y1="6" x2="14" y2="32" stroke="url(#fi-deep-green)" strokeWidth="0.8" />
      <line x1="34" y1="6" x2="34" y2="32" stroke="url(#fi-deep-green)" strokeWidth="0.8" />
      <rect x="10" y="30" width="28" height="3" fill="url(#fi-terracotta)" rx="0.5" />
      <ellipse cx="24" cy="40" rx="8" ry="2" fill="#451a03" opacity="0.5" />
      <line x1="24" y1="40" x2="24" y2="32" stroke="url(#fi-deep-green)" strokeWidth="1.4" />
      <ellipse cx="18" cy="36" rx="5" ry="2.5" fill="url(#fi-deep-green)" stroke="#047857" strokeWidth="0.4" transform="rotate(-30 18 36)" />
      <ellipse cx="30" cy="36" rx="5" ry="2.5" fill="url(#fi-deep-green)" stroke="#047857" strokeWidth="0.4" transform="rotate(30 30 36)" />
      <ellipse cx="20" cy="42" rx="3" ry="1.5" fill="url(#fi-deep-green)" transform="rotate(-30 20 42)" />
      <ellipse cx="28" cy="42" rx="3" ry="1.5" fill="url(#fi-deep-green)" transform="rotate(30 28 42)" />
    </>
  ));
}

export function NagPanchamiIcon({ size = 16, className }: IconProps) {
  // Coiled cobra
  return wrap(size, className, (
    <>
      <circle cx="24" cy="34" r="13" fill="url(#fi-deep-green)" opacity="0.18" />
      <ellipse cx="24" cy="38" rx="14" ry="2" fill="#451a03" opacity="0.5" />
      <path d="M12 38 Q18 32 24 38 Q30 32 36 38" stroke="#475569" strokeWidth="2.2" fill="none" />
      <path d="M16 32 Q20 26 24 32 Q28 26 32 32" stroke="#475569" strokeWidth="2" fill="none" />
      <path d="M20 26 Q24 22 28 26" stroke="#475569" strokeWidth="2" fill="none" />
      <path d="M22 20 C22 14, 26 14, 26 20 C26 24, 24 24, 24 24 C24 24, 22 24, 22 20 Z" fill="#334155" stroke="#1e293b" strokeWidth="0.5" />
      <path d="M19 22 Q20 14 24 14 Q28 14 29 22 Z" fill="url(#fi-deep-green)" opacity="0.6" />
      <circle cx="22.5" cy="19" r="0.6" fill="#facc15" />
      <circle cx="25.5" cy="19" r="0.6" fill="#facc15" />
      <path d="M24 23 L24 26 L23 27 L25 27 L24 26" stroke="#dc2626" strokeWidth="0.5" fill="none" />
    </>
  ));
}

/* --------------------------------------------------------------------
 * 5. Ekadashi (master) — used for all 24 variants
 * ------------------------------------------------------------------ */

export function EkadashiIcon({ size = 16, className }: IconProps) {
  return wrap(size, className, (
    <>
      <circle cx="24" cy="22" r="22" fill="url(#fi-warm-glow)" opacity="0.12" />
      <path d="M14 40 L14 30 L34 30 L34 40 Z" fill="url(#fi-terracotta)" stroke="#7c2d12" strokeWidth="0.5" />
      <rect x="12.5" y="28.5" width="23" height="2.2" fill="url(#fi-gold)" stroke="#78350f" strokeWidth="0.3" />
      <rect x="12.5" y="38.5" width="23" height="2.2" fill="url(#fi-gold)" stroke="#78350f" strokeWidth="0.3" />
      <text x="24" y="36.5" textAnchor="middle" fontFamily="serif" fontSize="4.5" fontWeight="bold" fill="#fef3c7">ॐ</text>
      <line x1="24" y1="30" x2="24" y2="8" stroke="#15803d" strokeWidth="1" />
      <ellipse cx="18" cy="26" rx="4.5" ry="2.2" fill="url(#fi-deep-green)" stroke="#047857" strokeWidth="0.4" transform="rotate(-30 18 26)" />
      <ellipse cx="30" cy="26" rx="4.5" ry="2.2" fill="url(#fi-deep-green)" stroke="#047857" strokeWidth="0.4" transform="rotate(30 30 26)" />
      <ellipse cx="17" cy="20" rx="4.2" ry="2" fill="#34d399" stroke="#047857" strokeWidth="0.35" transform="rotate(-30 17 20)" />
      <ellipse cx="31" cy="20" rx="4.2" ry="2" fill="#34d399" stroke="#047857" strokeWidth="0.35" transform="rotate(30 31 20)" />
      <ellipse cx="19" cy="14" rx="3.5" ry="1.7" fill="#86efac" stroke="#16a34a" strokeWidth="0.3" transform="rotate(-30 19 14)" />
      <ellipse cx="29" cy="14" rx="3.5" ry="1.7" fill="#86efac" stroke="#16a34a" strokeWidth="0.3" transform="rotate(30 29 14)" />
      <circle cx="24" cy="9" r="1.4" fill="#a855f7" />
      <circle cx="22.5" cy="10.5" r="1" fill="#c4b5fd" />
      <circle cx="25.5" cy="10.5" r="1" fill="#c4b5fd" />
      <circle cx="24" cy="7" r="0.7" fill="#e9d5ff" />
    </>
  ));
}

/* --------------------------------------------------------------------
 * 6. Eclipses + Sankranti
 * ------------------------------------------------------------------ */

export function SuryaGrahanIcon({ size = 16, className }: IconProps) {
  return wrap(size, className, (
    <>
      <circle cx="24" cy="24" r="16" fill="url(#fi-flame)" opacity="0.4" />
      <circle cx="24" cy="24" r="14" fill="url(#fi-yellow)" filter="url(#fi-soft)" />
      <circle cx="24" cy="24" r="11" fill="#0a0e27" />
      <circle cx="24" cy="24" r="11" fill="none" stroke="#dc2626" strokeWidth="0.4" opacity="0.7" />
      <line x1="24" y1="2" x2="24" y2="8" stroke="url(#fi-flame)" strokeWidth="1.2" />
      <line x1="24" y1="40" x2="24" y2="46" stroke="url(#fi-flame)" strokeWidth="1.2" />
      <line x1="2" y1="24" x2="8" y2="24" stroke="url(#fi-flame)" strokeWidth="1.2" />
      <line x1="40" y1="24" x2="46" y2="24" stroke="url(#fi-flame)" strokeWidth="1.2" />
      <line x1="8" y1="8" x2="12" y2="12" stroke="url(#fi-flame)" strokeWidth="1" />
      <line x1="40" y1="8" x2="36" y2="12" stroke="url(#fi-flame)" strokeWidth="1" />
      <line x1="8" y1="40" x2="12" y2="36" stroke="url(#fi-flame)" strokeWidth="1" />
      <line x1="40" y1="40" x2="36" y2="36" stroke="url(#fi-flame)" strokeWidth="1" />
    </>
  ));
}

export function ChandraGrahanIcon({ size = 16, className }: IconProps) {
  return wrap(size, className, (
    <>
      <circle cx="24" cy="24" r="16" fill="url(#fi-red)" opacity="0.3" />
      <circle cx="24" cy="24" r="14" fill="url(#fi-moon)" filter="url(#fi-soft)" />
      <path d="M24 10 A14 14 0 0 1 24 38 A11 11 0 0 0 24 10 Z" fill="#7f1d1d" opacity="0.85" />
      <circle cx="24" cy="24" r="14" fill="none" stroke="#dc2626" strokeWidth="0.6" opacity="0.7" />
    </>
  ));
}

export function SankrantiIcon({ size = 16, className }: IconProps) {
  return wrap(size, className, (
    <>
      <line x1="2" y1="32" x2="46" y2="32" stroke="url(#fi-gold)" strokeWidth="0.8" strokeDasharray="2 2" opacity="0.7" />
      <circle cx="24" cy="22" r="9" fill="url(#fi-yellow)" filter="url(#fi-soft)" />
      <circle cx="24" cy="22" r="6" fill="url(#fi-flame)" opacity="0.85" />
      <line x1="24" y1="6" x2="24" y2="10" stroke="url(#fi-gold)" strokeWidth="1.2" />
      <line x1="12" y1="18" x2="15" y2="20" stroke="url(#fi-gold)" strokeWidth="1" />
      <line x1="36" y1="18" x2="33" y2="20" stroke="url(#fi-gold)" strokeWidth="1" />
      <path d="M16 40 L22 40 L22 38 L26 42 L22 46 L22 44 L16 44 Z" fill="url(#fi-gold)" />
      <circle cx="38" cy="42" r="1.5" fill="url(#fi-magenta)" opacity="0.7" />
      <circle cx="10" cy="42" r="1.5" fill="url(#fi-cyan)" opacity="0.7" />
    </>
  ));
}

/* --------------------------------------------------------------------
 * 7. Additional specific festivals (replace generic fallbacks)
 * ------------------------------------------------------------------ */

export function GovardhanPujaIcon({ size = 16, className }: IconProps) {
  // Mountain held aloft on a finger — Krishna lifting Govardhan
  return wrap(size, className, (
    <>
      <circle cx="24" cy="24" r="22" fill="url(#fi-warm-glow)" opacity="0.15" />
      <path d="M6 36 L18 18 L24 26 L30 14 L42 36 Z" fill="url(#fi-terracotta)" stroke="#78350f" strokeWidth="0.6" filter="url(#fi-soft)" />
      <path d="M18 18 L20 22 L24 26" stroke="#fef3c7" strokeWidth="0.5" fill="none" opacity="0.6" />
      <path d="M30 14 L28 18 L26 22" stroke="#fef3c7" strokeWidth="0.5" fill="none" opacity="0.6" />
      <path d="M22 24 Q24 22 26 24" stroke="#fbbf24" strokeWidth="0.4" fill="none" opacity="0.6" />
      <ellipse cx="24" cy="40" rx="13" ry="2.5" fill="#451a03" opacity="0.5" />
      <line x1="22" y1="36" x2="24" y2="44" stroke="url(#fi-gold)" strokeWidth="2.2" strokeLinecap="round" />
      <ellipse cx="14" cy="42" rx="2.5" ry="1" fill="url(#fi-deep-green)" opacity="0.7" />
      <ellipse cx="34" cy="42" rx="2.5" ry="1" fill="url(#fi-deep-green)" opacity="0.7" />
    </>
  ));
}

export function BhaiDoojIcon({ size = 16, className }: IconProps) {
  // Forehead silhouette + tilak (red-yellow vertical mark)
  return wrap(size, className, (
    <>
      <path d="M14 38 C14 28, 16 16, 24 12 C32 16, 34 28, 34 38 Z" fill="url(#fi-terracotta)" stroke="#78350f" strokeWidth="0.5" />
      <ellipse cx="24" cy="38" rx="11" ry="2" fill="#451a03" opacity="0.5" />
      <rect x="22.5" y="14" width="3" height="14" rx="1.2" fill="url(#fi-red)" filter="url(#fi-soft)" />
      <rect x="23" y="14" width="2" height="8" fill="#fef3c7" opacity="0.4" />
      <circle cx="24" cy="11" r="1.5" fill="url(#fi-yellow)" />
      <ellipse cx="20" cy="22" rx="1.3" ry="2" fill="#78350f" opacity="0.65" />
      <ellipse cx="28" cy="22" rx="1.3" ry="2" fill="#78350f" opacity="0.65" />
    </>
  ));
}

export function VasantPanchamiIcon({ size = 16, className }: IconProps) {
  // Veena — Saraswati's instrument
  return wrap(size, className, (
    <>
      <ellipse cx="10" cy="34" rx="6.5" ry="5.5" fill="url(#fi-terracotta)" stroke="#78350f" strokeWidth="0.6" filter="url(#fi-soft)" />
      <ellipse cx="10" cy="34" rx="3" ry="2.5" fill="url(#fi-gold)" stroke="#78350f" strokeWidth="0.4" />
      <circle cx="10" cy="34" r="0.8" fill="#78350f" />
      <ellipse cx="40" cy="14" rx="4" ry="3" fill="url(#fi-terracotta)" stroke="#78350f" strokeWidth="0.5" />
      <line x1="14" y1="32" x2="38" y2="14" stroke="url(#fi-gold)" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="14" y1="32" x2="38" y2="14" stroke="#78350f" strokeWidth="0.5" />
      <line x1="15" y1="34" x2="39" y2="16" stroke="url(#fi-yellow)" strokeWidth="0.4" />
      <line x1="16" y1="35" x2="40" y2="17" stroke="url(#fi-yellow)" strokeWidth="0.4" />
      <line x1="17" y1="36" x2="41" y2="18" stroke="url(#fi-yellow)" strokeWidth="0.4" />
      <line x1="18" y1="37" x2="42" y2="19" stroke="url(#fi-yellow)" strokeWidth="0.4" />
      <circle cx="38" cy="14" r="0.5" fill="url(#fi-gold)" />
      <circle cx="40" cy="12" r="0.5" fill="url(#fi-gold)" />
      <circle cx="42" cy="14" r="0.5" fill="url(#fi-gold)" />
    </>
  ));
}

export function RathaSaptamiIcon({ size = 16, className }: IconProps) {
  // Sun chariot — wheel + sun disc + reins
  return wrap(size, className, (
    <>
      <circle cx="34" cy="14" r="9" fill="url(#fi-yellow)" filter="url(#fi-soft)" />
      <circle cx="34" cy="14" r="6" fill="url(#fi-flame)" opacity="0.8" />
      <line x1="34" y1="4" x2="34" y2="6" stroke="url(#fi-flame)" strokeWidth="0.8" />
      <line x1="44" y1="14" x2="42" y2="14" stroke="url(#fi-flame)" strokeWidth="0.8" />
      <line x1="40" y1="6" x2="38" y2="8" stroke="url(#fi-flame)" strokeWidth="0.6" />
      <line x1="40" y1="22" x2="38" y2="20" stroke="url(#fi-flame)" strokeWidth="0.6" />
      <rect x="6" y="28" width="22" height="8" fill="url(#fi-terracotta)" stroke="#78350f" strokeWidth="0.5" rx="1" />
      <line x1="28" y1="30" x2="34" y2="20" stroke="#78350f" strokeWidth="0.6" />
      <line x1="28" y1="34" x2="34" y2="22" stroke="#78350f" strokeWidth="0.6" />
      <circle cx="10" cy="40" r="5" fill="none" stroke="url(#fi-gold)" strokeWidth="1.2" filter="url(#fi-soft)" />
      <line x1="10" y1="35" x2="10" y2="45" stroke="url(#fi-gold)" strokeWidth="0.6" />
      <line x1="5" y1="40" x2="15" y2="40" stroke="url(#fi-gold)" strokeWidth="0.6" />
      <line x1="6.5" y1="36.5" x2="13.5" y2="43.5" stroke="url(#fi-gold)" strokeWidth="0.6" />
      <line x1="6.5" y1="43.5" x2="13.5" y2="36.5" stroke="url(#fi-gold)" strokeWidth="0.6" />
      <circle cx="24" cy="40" r="5" fill="none" stroke="url(#fi-gold)" strokeWidth="1.2" filter="url(#fi-soft)" />
      <line x1="24" y1="35" x2="24" y2="45" stroke="url(#fi-gold)" strokeWidth="0.6" />
      <line x1="19" y1="40" x2="29" y2="40" stroke="url(#fi-gold)" strokeWidth="0.6" />
      <line x1="20.5" y1="36.5" x2="27.5" y2="43.5" stroke="url(#fi-gold)" strokeWidth="0.6" />
      <line x1="20.5" y1="43.5" x2="27.5" y2="36.5" stroke="url(#fi-gold)" strokeWidth="0.6" />
    </>
  ));
}

export function OnamIcon({ size = 16, className }: IconProps) {
  // Pookalam — concentric flower mandala
  return wrap(size, className, (
    <>
      <circle cx="24" cy="24" r="20" fill="url(#fi-yellow)" opacity="0.18" />
      <circle cx="24" cy="24" r="18" fill="none" stroke="url(#fi-magenta)" strokeWidth="0.6" />
      <circle cx="24" cy="24" r="14" fill="none" stroke="url(#fi-yellow)" strokeWidth="0.6" />
      <circle cx="24" cy="24" r="10" fill="none" stroke="url(#fi-deep-green)" strokeWidth="0.6" />
      <circle cx="24" cy="6" r="2" fill="url(#fi-magenta)" />
      <circle cx="42" cy="24" r="2" fill="url(#fi-magenta)" />
      <circle cx="24" cy="42" r="2" fill="url(#fi-magenta)" />
      <circle cx="6" cy="24" r="2" fill="url(#fi-magenta)" />
      <circle cx="11" cy="11" r="1.5" fill="url(#fi-yellow)" />
      <circle cx="37" cy="11" r="1.5" fill="url(#fi-yellow)" />
      <circle cx="37" cy="37" r="1.5" fill="url(#fi-yellow)" />
      <circle cx="11" cy="37" r="1.5" fill="url(#fi-yellow)" />
      <circle cx="24" cy="14" r="1.5" fill="url(#fi-red)" />
      <circle cx="34" cy="24" r="1.5" fill="url(#fi-red)" />
      <circle cx="24" cy="34" r="1.5" fill="url(#fi-red)" />
      <circle cx="14" cy="24" r="1.5" fill="url(#fi-red)" />
      <circle cx="24" cy="24" r="3" fill="url(#fi-gold)" filter="url(#fi-soft)" />
      <circle cx="24" cy="24" r="1.2" fill="#fef3c7" />
    </>
  ));
}

export function RathYatraIcon({ size = 16, className }: IconProps) {
  // Jagannath chariot — tall, with face on top, flag
  return wrap(size, className, (
    <>
      <line x1="24" y1="2" x2="24" y2="10" stroke="url(#fi-gold)" strokeWidth="0.6" />
      <path d="M24 2 L34 4 L34 6 L24 6 Z" fill="url(#fi-red)" />
      <path d="M14 16 L24 8 L34 16 L34 22 L14 22 Z" fill="url(#fi-terracotta)" stroke="#78350f" strokeWidth="0.5" />
      <circle cx="24" cy="14" r="2" fill="#0a0e27" />
      <circle cx="20.5" cy="14.5" r="0.8" fill="url(#fi-yellow)" />
      <circle cx="27.5" cy="14.5" r="0.8" fill="url(#fi-yellow)" />
      <rect x="10" y="22" width="28" height="14" fill="url(#fi-red)" stroke="#9f1239" strokeWidth="0.5" rx="0.5" />
      <line x1="14" y1="26" x2="34" y2="26" stroke="url(#fi-gold)" strokeWidth="0.4" />
      <line x1="14" y1="30" x2="34" y2="30" stroke="url(#fi-gold)" strokeWidth="0.4" />
      <line x1="14" y1="34" x2="34" y2="34" stroke="url(#fi-gold)" strokeWidth="0.4" />
      <circle cx="14" cy="40" r="4.5" fill="none" stroke="url(#fi-gold)" strokeWidth="1.2" filter="url(#fi-soft)" />
      <line x1="14" y1="36" x2="14" y2="44" stroke="url(#fi-gold)" strokeWidth="0.5" />
      <line x1="10" y1="40" x2="18" y2="40" stroke="url(#fi-gold)" strokeWidth="0.5" />
      <circle cx="34" cy="40" r="4.5" fill="none" stroke="url(#fi-gold)" strokeWidth="1.2" filter="url(#fi-soft)" />
      <line x1="34" y1="36" x2="34" y2="44" stroke="url(#fi-gold)" strokeWidth="0.5" />
      <line x1="30" y1="40" x2="38" y2="40" stroke="url(#fi-gold)" strokeWidth="0.5" />
    </>
  ));
}

export function SharadPurnimaIcon({ size = 16, className }: IconProps) {
  // Full moon + lotus pair
  return wrap(size, className, (
    <>
      <circle cx="24" cy="18" r="12" fill="url(#fi-moon)" filter="url(#fi-soft)" />
      <circle cx="21" cy="16" r="1.5" fill="url(#fi-gold)" opacity="0.4" />
      <circle cx="26" cy="20" r="1" fill="url(#fi-gold)" opacity="0.3" />
      <circle cx="24" cy="18" r="14" fill="none" stroke="url(#fi-moon)" strokeWidth="0.4" opacity="0.4" />
      <ellipse cx="24" cy="40" rx="14" ry="2" fill="#451a03" opacity="0.5" />
      <path d="M10 40 Q14 32 18 40" fill="url(#fi-magenta)" stroke="#be185d" strokeWidth="0.3" />
      <path d="M30 40 Q34 32 38 40" fill="url(#fi-magenta)" stroke="#be185d" strokeWidth="0.3" />
      <path d="M16 40 Q24 30 32 40" fill="url(#fi-magenta)" opacity="0.85" stroke="#be185d" strokeWidth="0.3" />
      <ellipse cx="24" cy="36" rx="2.5" ry="1.5" fill="#fef3c7" />
      <circle cx="24" cy="36" r="0.7" fill="url(#fi-gold)" />
    </>
  ));
}

export function TulsiVivahIcon({ size = 16, className }: IconProps) {
  // Tulsi with mandap arch — wedding of Tulsi to Vishnu
  return wrap(size, className, (
    <>
      <path d="M10 36 Q10 14 14 14 L34 14 Q38 14 38 36" stroke="url(#fi-gold)" strokeWidth="1.4" fill="none" filter="url(#fi-soft)" />
      <path d="M14 14 L14 10 M34 14 L34 10" stroke="url(#fi-gold)" strokeWidth="1.2" />
      <circle cx="14" cy="10" r="1.3" fill="url(#fi-gold)" />
      <circle cx="34" cy="10" r="1.3" fill="url(#fi-gold)" />
      <path d="M12 16 Q24 8 36 16" stroke="url(#fi-red)" strokeWidth="0.6" fill="none" opacity="0.7" />
      <path d="M18 36 L18 30 L30 30 L30 36 Z" fill="url(#fi-terracotta)" stroke="#78350f" strokeWidth="0.4" />
      <rect x="16.5" y="29" width="15" height="1.6" fill="url(#fi-gold)" />
      <rect x="16.5" y="35" width="15" height="1.6" fill="url(#fi-gold)" />
      <line x1="24" y1="30" x2="24" y2="20" stroke="#15803d" strokeWidth="0.8" />
      <ellipse cx="20" cy="24" rx="3" ry="1.5" fill="url(#fi-deep-green)" transform="rotate(-30 20 24)" />
      <ellipse cx="28" cy="24" rx="3" ry="1.5" fill="url(#fi-deep-green)" transform="rotate(30 28 24)" />
      <circle cx="24" cy="20" r="1" fill="url(#fi-purple)" />
    </>
  ));
}

export function ParashuramaIcon({ size = 16, className }: IconProps) {
  // Parashu — Vishnu's axe avatar
  return wrap(size, className, (
    <>
      <line x1="14" y1="44" x2="34" y2="6" stroke="url(#fi-terracotta)" strokeWidth="2.4" strokeLinecap="round" />
      <line x1="14" y1="44" x2="34" y2="6" stroke="#78350f" strokeWidth="0.5" />
      <path d="M34 6 Q40 6 42 12 Q42 18 34 18 Q30 14 30 10 Q30 6 34 6 Z" fill="url(#fi-gold)" stroke="#78350f" strokeWidth="0.6" filter="url(#fi-soft)" />
      <path d="M34 6 Q38 8 40 12" stroke="#fef3c7" strokeWidth="0.4" fill="none" opacity="0.7" />
      <path d="M34 18 Q36 16 38 14" stroke="#78350f" strokeWidth="0.4" fill="none" opacity="0.7" />
      <ellipse cx="14" cy="44" rx="1.8" ry="1" fill="#451a03" />
      <line x1="18" y1="40" x2="20" y2="42" stroke="#92400e" strokeWidth="0.4" />
      <line x1="22" y1="35" x2="24" y2="37" stroke="#92400e" strokeWidth="0.4" />
    </>
  ));
}

export function NarasimhaIcon({ size = 16, className }: IconProps) {
  // Lion claw emerging from pillar — Narasimha avatar
  return wrap(size, className, (
    <>
      <rect x="18" y="6" width="12" height="36" fill="url(#fi-terracotta)" stroke="#78350f" strokeWidth="0.5" />
      <rect x="16" y="6" width="16" height="3" fill="url(#fi-gold)" />
      <rect x="16" y="39" width="16" height="3" fill="url(#fi-gold)" />
      <line x1="20" y1="9" x2="20" y2="39" stroke="#fef3c7" strokeWidth="0.4" opacity="0.4" />
      <line x1="28" y1="9" x2="28" y2="39" stroke="#78350f" strokeWidth="0.4" opacity="0.6" />
      <path d="M20 22 Q14 20 12 24" stroke="url(#fi-red)" strokeWidth="2" fill="none" strokeLinecap="round" />
      <path d="M20 26 Q14 24 12 28" stroke="url(#fi-red)" strokeWidth="2" fill="none" strokeLinecap="round" />
      <path d="M20 30 Q14 28 12 32" stroke="url(#fi-red)" strokeWidth="2" fill="none" strokeLinecap="round" />
      <path d="M12 24 L9 22 L11 26 Z" fill="url(#fi-red)" />
      <path d="M12 28 L9 26 L11 30 Z" fill="url(#fi-red)" />
      <path d="M12 32 L9 30 L11 34 Z" fill="url(#fi-red)" />
      <circle cx="24" cy="14" r="0.8" fill="url(#fi-yellow)" />
      <circle cx="24" cy="22" r="0.8" fill="url(#fi-yellow)" />
      <circle cx="24" cy="30" r="0.8" fill="url(#fi-yellow)" />
    </>
  ));
}

/* --------------------------------------------------------------------
 * 8. Generic fallback for unmapped festivals
 * ------------------------------------------------------------------ */

export function GenericFestivalIcon({ size = 16, className }: IconProps) {
  // Kalash — universal "auspicious day" marker
  return wrap(size, className, (
    <>
      <ellipse cx="24" cy="42" rx="11" ry="2" fill="#451a03" opacity="0.5" />
      <path d="M16 40 C13 30, 13 22, 24 18 C35 22, 35 30, 32 40 Z" fill="url(#fi-terracotta)" stroke="#78350f" strokeWidth="0.5" />
      <ellipse cx="24" cy="18" rx="9" ry="2" fill="url(#fi-gold)" stroke="#78350f" strokeWidth="0.5" />
      <path d="M20 18 C20 14, 28 14, 28 18" stroke="url(#fi-gold)" strokeWidth="1.4" fill="none" />
      <ellipse cx="20" cy="14" rx="2" ry="3" fill="url(#fi-deep-green)" transform="rotate(-20 20 14)" />
      <ellipse cx="28" cy="14" rx="2" ry="3" fill="url(#fi-deep-green)" transform="rotate(20 28 14)" />
      <ellipse cx="24" cy="11" rx="2" ry="3" fill="url(#fi-deep-green)" />
      <circle cx="24" cy="7" r="2" fill="url(#fi-flame)" filter="url(#fi-soft)" />
      <line x1="24" y1="5" x2="24" y2="2" stroke="url(#fi-yellow)" strokeWidth="0.8" />
    </>
  ));
}

/* --------------------------------------------------------------------
 * Slug → icon map
 * ------------------------------------------------------------------ */

import type { ComponentType } from 'react';

export const FESTIVAL_ICONS: Record<string, ComponentType<IconProps>> = {
  // Lights (diwali / dhanteras → see Lakshmi block below for the deity
  // image; the bespoke SVGs are kept on satellites in the Diwali family)
  'narak-chaturdashi': NarakChaturdashiIcon,
  'kartik-purnima': KartikPurnimaIcon,
  'dev-diwali': KartikPurnimaIcon,
  'chhath-puja': SuryaImage,

  // Shiva / Shakti
  'maha-shivaratri': ShivaImage,
  'masik-shivaratri': ShivaImage,

  // Lakshmi — Diwali family, Dhanteras, Sharad Purnima, Varalakshmi,
  // Akshaya Tritiya, Bengali Lakshmi Puja, Kojagiri Purnima.
  'diwali': LakshmiImage,
  'dhanteras': LakshmiImage,
  'sharad-purnima': LakshmiImage,
  'kojagiri-purnima': LakshmiImage,
  'lakshmi-puja-bengali': LakshmiImage,
  'varalakshmi-vratam': LakshmiImage,
  'akshaya-tritiya': LakshmiImage,
  'annakut': LakshmiImage,

  // Ganesha — Ganesh Chaturthi, recurring Vinayaka Chaturthi,
  // Sankashti, Anant Chaturdashi.
  'ganesh-chaturthi': GaneshaImage,
  'vinayaka-chaturthi': GaneshaImage,
  'sankashti-chaturthi': GaneshaImage,
  'anant-chaturdashi': GaneshaImage,
  // Bare `chaturthi` slug is what the engine emits for monthly
  // Sankashti Chaturthi (Krishna paksha 4) — route it to Ganesha too.
  'chaturthi': GaneshaImage,

  // Ram (Sita-Ram portrait) — Ram Navami, Dussehra/Vijaya Dashami,
  // Sita Navami, Vivah Panchami.
  'ram-navami': RamImage,
  'dussehra': RamImage,
  'vijaya-dashami': RamImage,
  'sita-navami': RamImage,
  'vivah-panchami': RamImage,

  // Saraswati — Vasant Panchami.
  'vasant-panchami': SaraswatiImage,

  // Hanuman — Hanuman Jayanti.
  'hanuman-jayanti': HanumanImage,

  // Kali — Kali Puja, Kalashtami.
  'kali-puja': KaliImage,
  'kalashtami': KaliImage,
  'mahakali-jayanti': KaliImage,

  // Dattatreya — Dattatreya Jayanti.
  'dattatreya-jayanti': DattatreyaImage,

  // Skanda / Kartikeya / Murugan — Skanda Sashthi (monthly + Kartik).
  'skanda-shashthi': SkandaImage,
  'skanda-shashthi-kartik': SkandaImage,
  'subramanya-sashti': SkandaImage,

  // Annapurna — Annapurna Jayanti.
  'annapurna-jayanti': AnnapurnaImage,

  // Multi-day Durga Puja variants — wire to Devi for consistency
  // with the existing durga-ashtami / maha-navami mappings.
  'durga-puja-saptami': DeviImage,
  'durga-puja-ashtami': DeviImage,
  'durga-puja-navami': DeviImage,
  'durga-puja-shashti': DeviImage,
  'holika-dahan': HolikaDahanIcon,
  'holi': HoliIcon,
  // Navratri family + Devi observances all use the Devi portrait so
  // navratri cells read as Durga/Devi celebrations at a glance.
  'navaratri': DeviImage,
  'chaitra-navratri': DeviImage,
  'magha-gupta-navratri': DeviImage,
  'sharad-navratri': DeviImage,
  'ashadha-gupta-navratri': DeviImage,
  'durga-ashtami': DeviImage,
  'maha-navami': DeviImage,
  'durga-puja': DeviImage,
  // Vishnu / Krishna / Rama  (ram-navami, hanuman-jayanti, akshaya-tritiya,
  // ganesh-chaturthi, sharad-purnima, varalakshmi-vratam, anant-chaturdashi,
  // dussehra, vijaya-dashami, vasant-panchami all live in the deity-image
  // block above — entries here are bespoke-SVG only)
  'janmashtami': KrishnaImage,
  'krishna-janmashtami': KrishnaImage,
  'parashurama-jayanti': ParashuramaImage,
  'buddha-purnima': BuddhaImage,
  'guru-purnima': GuruPurnimaIcon,
  'ganesha-chaturthi': GaneshaImage,
  'narasimha-jayanti': NarasimhaImage,
  'govardhan-puja': KrishnaImage,
  'bhai-dooj': BhaiDoojIcon,
  'tulsi-vivah': TulsiVivahIcon,

  // Women's vrats
  'karwa-chauth': KarwaChauthIcon,
  'raksha-bandhan': RakshaBandhanIcon,
  'vat-savitri-vrat': VatSavitriIcon,
  'vat-savitri': VatSavitriIcon,
  'hartalika-teej': HartalikaTeejIcon,
  'hariyali-teej': HariyaliTeejIcon,
  'kajari-teej': HariyaliTeejIcon,
  'nag-panchami': NagPanchamiIcon,
  'jagannath-rath-yatra': JagannathImage,
  'onam': OnamIcon,

  // Ekadashi (all 24 → one master) - registered programmatically below
  // Sankranti (all 12 → one master) - registered programmatically below

  // Eclipses
  'surya-grahan': SuryaGrahanIcon,
  'chandra-grahan': ChandraGrahanIcon,
  'solar-eclipse': SuryaGrahanIcon,
  'lunar-eclipse': ChandraGrahanIcon,

  // Misc / TODO
  'ratha-saptami': SuryaImage,
  'bhishma-ashtami': RamNavamiIcon, // arrow archetype works for Bhishma
  'bhishma-dwadashi': RamNavamiIcon,
  'ganga-dussehra': ChhathIcon, // water + sun
};

// Register the 24 Ekadashi slugs to the master Tulsi icon.
const EKADASHI_SLUGS = [
  'kamada-ekadashi', 'papamochani-ekadashi',
  'mohini-ekadashi', 'varuthini-ekadashi',
  'apara-ekadashi', 'nirjala-ekadashi',
  'devshayani-ekadashi', 'yogini-ekadashi',
  'shravana-putrada-ekadashi', 'kamika-ekadashi',
  'aja-ekadashi', 'parivartini-ekadashi', 'pavitra-ekadashi',
  'indira-ekadashi', 'papankusha-ekadashi',
  'rama-ekadashi', 'devuthana-ekadashi', 'devotthana-ekadashi', 'prabodhini-ekadashi',
  'utpanna-ekadashi', 'mokshada-ekadashi',
  'saphala-ekadashi', 'pausha-putrada-ekadashi',
  'shattila-ekadashi', 'jaya-ekadashi', 'vijaya-ekadashi',
  'amalaki-ekadashi',
];
// All Ekadashis → Vishnu portrait. The bespoke Tulsi-leaf SVG (EkadashiIcon)
// stays defined above so legacy callers / detail panels can opt back in,
// but cell ribbons should show a recognisable deity image per user request.
for (const s of EKADASHI_SLUGS) FESTIVAL_ICONS[s] = VishnuImage;

// Register the 12 Sankranti slugs.
const SANKRANTI_SLUGS = [
  'makar-sankranti', 'kumbha-sankranti', 'meena-sankranti',
  'mesha-sankranti', 'vrishabha-sankranti', 'mithuna-sankranti',
  'karka-sankranti', 'simha-sankranti', 'kanya-sankranti',
  'tula-sankranti', 'vrishchika-sankranti', 'dhanu-sankranti',
];
// Makar Sankranti gets the Surya portrait (Uttarayana — Sun's
// northward journey). The other 11 monthly Sankrantis keep the
// abstract SankrantiIcon SVG, which reads well at small sizes
// in the cell ribbon and avoids spamming Surya on every monthly
// sign-transition.
for (const s of SANKRANTI_SLUGS) FESTIVAL_ICONS[s] = SankrantiIcon;
FESTIVAL_ICONS['makar-sankranti'] = SuryaImage;

/**
 * Look up the icon for a given festival slug, with a sensible fallback.
 * Returns the component itself (not JSX) so callers can do <Icon size={...} />.
 */
export function festivalIconFor(slug: string | undefined): ComponentType<IconProps> {
  if (!slug) return GenericFestivalIcon;
  return FESTIVAL_ICONS[slug] ?? GenericFestivalIcon;
}
