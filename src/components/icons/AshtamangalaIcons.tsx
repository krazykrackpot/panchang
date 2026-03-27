'use client';

interface IconProps {
  size?: number;
  className?: string;
}

const goldGradientDefs = (id: string) => (
  <defs>
    <linearGradient id={`gold-${id}`} x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stopColor="#f0d48a" />
      <stop offset="50%" stopColor="#d4a853" />
      <stop offset="100%" stopColor="#8a6d2b" />
    </linearGradient>
    <filter id={`glow-${id}`}>
      <feGaussianBlur stdDeviation="1" result="blur" />
      <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
    </filter>
  </defs>
);

// 1. Darpana (Mirror)
export function MirrorIcon({ size = 48, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" className={className}>
      {goldGradientDefs('mirror')}
      <ellipse cx="24" cy="20" rx="12" ry="14" stroke="url(#gold-mirror)" strokeWidth="2" fill="none" filter="url(#glow-mirror)" />
      <ellipse cx="24" cy="20" rx="8" ry="10" stroke="url(#gold-mirror)" strokeWidth="1" fill="url(#gold-mirror)" fillOpacity="0.15" />
      <line x1="24" y1="34" x2="24" y2="44" stroke="url(#gold-mirror)" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="19" y1="44" x2="29" y2="44" stroke="url(#gold-mirror)" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

// 2. Purna Kumbha (Full Vessel)
export function VesselIcon({ size = 48, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" className={className}>
      {goldGradientDefs('vessel')}
      <path d="M14 38 C14 38, 12 20, 16 14 C18 10, 30 10, 32 14 C36 20, 34 38, 34 38 Z" stroke="url(#gold-vessel)" strokeWidth="2" fill="url(#gold-vessel)" fillOpacity="0.1" filter="url(#glow-vessel)" />
      <ellipse cx="24" cy="14" rx="8" ry="3" stroke="url(#gold-vessel)" strokeWidth="1.5" fill="none" />
      <path d="M20 8 C20 4, 28 4, 28 8" stroke="url(#gold-vessel)" strokeWidth="1.5" fill="none" />
      <path d="M22 8 L22 5 M26 8 L26 5 M24 8 L24 3" stroke="url(#gold-vessel)" strokeWidth="1" />
      <line x1="14" y1="38" x2="34" y2="38" stroke="url(#gold-vessel)" strokeWidth="2" />
    </svg>
  );
}

// 3. Matsya Yugma (Fish Pair)
export function FishIcon({ size = 48, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" className={className}>
      {goldGradientDefs('fish')}
      <path d="M8 18 C14 12, 22 12, 28 18 C22 24, 14 24, 8 18Z" stroke="url(#gold-fish)" strokeWidth="1.5" fill="url(#gold-fish)" fillOpacity="0.15" filter="url(#glow-fish)" />
      <circle cx="12" cy="17" r="1" fill="url(#gold-fish)" />
      <path d="M28 18 L32 14 L32 22Z" stroke="url(#gold-fish)" strokeWidth="1" fill="url(#gold-fish)" fillOpacity="0.2" />
      <path d="M20 30 C26 24, 34 24, 40 30 C34 36, 26 36, 20 30Z" stroke="url(#gold-fish)" strokeWidth="1.5" fill="url(#gold-fish)" fillOpacity="0.15" />
      <circle cx="24" cy="29" r="1" fill="url(#gold-fish)" />
      <path d="M40 30 L44 26 L44 34Z" stroke="url(#gold-fish)" strokeWidth="1" fill="url(#gold-fish)" fillOpacity="0.2" />
    </svg>
  );
}

// 4. Deepa (Lamp)
export function LampIcon({ size = 48, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" className={className}>
      {goldGradientDefs('lamp')}
      <path d="M24 8 C22 12, 21 14, 21 16 C21 19, 24 20, 24 20 C24 20, 27 19, 27 16 C27 14, 26 12, 24 8Z" stroke="url(#gold-lamp)" strokeWidth="1.5" fill="url(#gold-lamp)" fillOpacity="0.3" filter="url(#glow-lamp)" />
      <ellipse cx="24" cy="24" rx="8" ry="4" stroke="url(#gold-lamp)" strokeWidth="2" fill="url(#gold-lamp)" fillOpacity="0.15" />
      <path d="M16 24 C16 28, 18 32, 24 34 C30 32, 32 28, 32 24" stroke="url(#gold-lamp)" strokeWidth="1.5" fill="none" />
      <line x1="24" y1="34" x2="24" y2="40" stroke="url(#gold-lamp)" strokeWidth="2" />
      <ellipse cx="24" cy="42" rx="10" ry="3" stroke="url(#gold-lamp)" strokeWidth="1.5" fill="none" />
    </svg>
  );
}

// 5. Simhasana (Throne)
export function ThroneIcon({ size = 48, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" className={className}>
      {goldGradientDefs('throne')}
      <rect x="14" y="20" width="20" height="16" rx="2" stroke="url(#gold-throne)" strokeWidth="2" fill="url(#gold-throne)" fillOpacity="0.1" filter="url(#glow-throne)" />
      <path d="M14 20 L14 6 C14 4, 16 4, 18 6 L18 14" stroke="url(#gold-throne)" strokeWidth="2" fill="none" />
      <path d="M34 20 L34 6 C34 4, 32 4, 30 6 L30 14" stroke="url(#gold-throne)" strokeWidth="2" fill="none" />
      <circle cx="14" cy="5" r="2" fill="url(#gold-throne)" />
      <circle cx="34" cy="5" r="2" fill="url(#gold-throne)" />
      <line x1="14" y1="36" x2="14" y2="44" stroke="url(#gold-throne)" strokeWidth="2" />
      <line x1="34" y1="36" x2="34" y2="44" stroke="url(#gold-throne)" strokeWidth="2" />
      <line x1="10" y1="44" x2="38" y2="44" stroke="url(#gold-throne)" strokeWidth="2" />
    </svg>
  );
}

// 6. Vrishabha (Bull)
export function BullIcon({ size = 48, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" className={className}>
      {goldGradientDefs('bull')}
      <ellipse cx="24" cy="28" rx="14" ry="10" stroke="url(#gold-bull)" strokeWidth="2" fill="url(#gold-bull)" fillOpacity="0.1" filter="url(#glow-bull)" />
      <circle cx="20" cy="18" r="6" stroke="url(#gold-bull)" strokeWidth="1.5" fill="none" />
      <path d="M14 14 L8 8" stroke="url(#gold-bull)" strokeWidth="2" strokeLinecap="round" />
      <path d="M26 14 L32 8" stroke="url(#gold-bull)" strokeWidth="2" strokeLinecap="round" />
      <circle cx="18" cy="17" r="1" fill="url(#gold-bull)" />
      <circle cx="22" cy="17" r="1" fill="url(#gold-bull)" />
      <line x1="14" y1="38" x2="14" y2="44" stroke="url(#gold-bull)" strokeWidth="2" />
      <line x1="22" y1="38" x2="22" y2="44" stroke="url(#gold-bull)" strokeWidth="2" />
      <line x1="26" y1="38" x2="26" y2="44" stroke="url(#gold-bull)" strokeWidth="2" />
      <line x1="34" y1="38" x2="34" y2="44" stroke="url(#gold-bull)" strokeWidth="2" />
    </svg>
  );
}

// 7. Dhvaja (Flag)
export function FlagIcon({ size = 48, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" className={className}>
      {goldGradientDefs('flag')}
      <line x1="14" y1="4" x2="14" y2="44" stroke="url(#gold-flag)" strokeWidth="2.5" strokeLinecap="round" filter="url(#glow-flag)" />
      <path d="M14 6 L38 10 L38 14 L14 20Z" stroke="url(#gold-flag)" strokeWidth="1.5" fill="url(#gold-flag)" fillOpacity="0.2" />
      <path d="M38 14 C34 16, 30 15, 26 16 C22 17, 18 18, 14 20" stroke="url(#gold-flag)" strokeWidth="1" fill="none" />
      <circle cx="14" cy="4" r="2" fill="url(#gold-flag)" />
    </svg>
  );
}

// 8. Chamara (Fan)
export function FanIcon({ size = 48, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" className={className}>
      {goldGradientDefs('fan')}
      <path d="M24 24 C18 10, 10 8, 8 12 C6 16, 14 20, 24 24Z" stroke="url(#gold-fan)" strokeWidth="1.5" fill="url(#gold-fan)" fillOpacity="0.15" filter="url(#glow-fan)" />
      <path d="M24 24 C24 8, 20 4, 16 6 C12 8, 18 16, 24 24Z" stroke="url(#gold-fan)" strokeWidth="1.5" fill="url(#gold-fan)" fillOpacity="0.15" />
      <path d="M24 24 C32 10, 28 4, 24 6 C20 8, 22 16, 24 24Z" stroke="url(#gold-fan)" strokeWidth="1.5" fill="url(#gold-fan)" fillOpacity="0.15" />
      <path d="M24 24 C38 14, 40 10, 36 8 C32 6, 28 14, 24 24Z" stroke="url(#gold-fan)" strokeWidth="1.5" fill="url(#gold-fan)" fillOpacity="0.15" />
      <line x1="24" y1="24" x2="24" y2="44" stroke="url(#gold-fan)" strokeWidth="2.5" strokeLinecap="round" />
      <circle cx="24" cy="24" r="3" fill="url(#gold-fan)" />
    </svg>
  );
}

const ICONS = [MirrorIcon, VesselIcon, FishIcon, LampIcon, ThroneIcon, BullIcon, FlagIcon, FanIcon];

export function AshtamangalaIconById({ id, size = 48, className }: { id: number; size?: number; className?: string }) {
  const Icon = ICONS[(id - 1) % 8] || MirrorIcon;
  return <Icon size={size} className={className} />;
}
