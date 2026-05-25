// src/components/gamification/LevelPortrait.tsx
import Image from 'next/image';
import { LEVEL_BY_ORDINAL } from '@/lib/constants/levels';
import { tl } from '@/lib/utils/trilingual';

interface Props {
  ordinal: number; // 1..7
  size?: number;   // height in px; width = 2/3 * height
  locked?: boolean;
  className?: string;
  /** Optional locale for the localised alt text. Defaults to 'en'.
   *  Audit 2026-05-25 §D10. */
  locale?: string;
}

export function LevelPortrait({ ordinal, size = 105, locked = false, className, locale = 'en' }: Props) {
  const level = LEVEL_BY_ORDINAL[ordinal];
  if (!level) return null;
  const w = Math.round(size * 2 / 3);

  return (
    <div
      className={className}
      style={{
        width: w,
        height: size,
        position: 'relative',
        borderRadius: 8,
        overflow: 'hidden',
        border: locked ? '1px solid rgba(212,168,83,0.25)' : '1px solid rgba(212,168,83,0.7)',
        boxShadow: locked ? undefined : '0 0 12px rgba(212,168,83,0.25)',
        filter: locked ? 'grayscale(0.6) brightness(0.7)' : undefined,
      }}
    >
      <Image
        src={level.image}
        alt={tl(level.name, locale)}
        width={w}
        height={size}
        style={{ objectFit: 'cover', width: '100%', height: '100%' }}
        priority={ordinal === 1}
      />
      {locked && (
        <div style={{
          position: 'absolute', inset: 0,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: '#f0d48a', fontSize: size * 0.25, opacity: 0.9,
        }}>🔒</div>
      )}
    </div>
  );
}
