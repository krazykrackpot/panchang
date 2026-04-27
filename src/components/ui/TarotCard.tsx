'use client';

import { motion } from 'framer-motion';
import { type ReactNode } from 'react';
import { Link } from '@/lib/i18n/navigation';

interface TarotCardProps {
  icon: ReactNode;
  title: string;
  subtitle?: string;
  description?: string;
  href?: string;
  onClick?: () => void;
  size?: 'sm' | 'md' | 'lg' | 'full';
  glowColor?: string;
}

const SIZE_MAP = {
  sm: 'w-[140px]',
  md: 'w-[180px]',
  lg: 'w-[220px]',
  full: 'w-full',
} as const;

const ICON_SIZE_MAP = {
  sm: 64,
  md: 80,
  lg: 96,
  full: 128,
} as const;

export default function TarotCard({
  icon,
  title,
  subtitle,
  description,
  href,
  onClick,
  size = 'md',
  glowColor = '#d4a853',
}: TarotCardProps) {
  const card = (
    <motion.div
      whileHover={{ scale: 1.05, y: -8 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      className={`${SIZE_MAP[size]} aspect-[2/3] cursor-pointer select-none`}
      onClick={onClick}
    >
      <div className="relative w-full h-full rounded-xl overflow-hidden">
        {/* Background gradient — deep indigo/navy */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#1a0a3e] via-[#0f0825] to-[#0a0520]" />

        {/* Subtle celestial noise texture */}
        <div className="absolute inset-0 opacity-[0.04]" style={{
          backgroundImage: 'radial-gradient(circle at 20% 30%, #f0d48a 0.5px, transparent 0.5px), radial-gradient(circle at 70% 15%, #f0d48a 0.3px, transparent 0.3px), radial-gradient(circle at 45% 80%, #f0d48a 0.4px, transparent 0.4px), radial-gradient(circle at 85% 55%, #f0d48a 0.3px, transparent 0.3px), radial-gradient(circle at 10% 70%, #f0d48a 0.5px, transparent 0.5px), radial-gradient(circle at 60% 45%, #f0d48a 0.3px, transparent 0.3px)',
        }} />

        {/* Outer border */}
        <div className="absolute inset-0 rounded-xl border border-[#d4a853]/30" />

        {/* Inner ornate frame (inset 6px) */}
        <div className="absolute inset-[6px] rounded-lg border border-[#d4a853]/15" />

        {/* Corner flourishes — gold angle brackets at each corner of outer border */}
        <div className="absolute top-[3px] left-[3px] w-2.5 h-2.5 border-t border-l border-[#d4a853]/50 rounded-tl-sm" />
        <div className="absolute top-[3px] right-[3px] w-2.5 h-2.5 border-t border-r border-[#d4a853]/50 rounded-tr-sm" />
        <div className="absolute bottom-[3px] left-[3px] w-2.5 h-2.5 border-b border-l border-[#d4a853]/50 rounded-bl-sm" />
        <div className="absolute bottom-[3px] right-[3px] w-2.5 h-2.5 border-b border-r border-[#d4a853]/50 rounded-br-sm" />

        {/* Content */}
        <div className="relative z-10 flex flex-col items-center justify-between h-full px-3 py-4">
          {/* Subtitle */}
          {subtitle && (
            <div className="text-[9px] uppercase tracking-[0.2em] text-[#8a6d2b] font-semibold mt-1">
              {subtitle}
            </div>
          )}

          {/* Decorative star dots */}
          <div className="flex items-center gap-1.5 text-[#d4a853]/30 text-[8px]" aria-hidden="true">
            <span>&#10022;</span>
            <span>&middot;</span>
            <span>&#10022;</span>
            <span>&middot;</span>
            <span>&#10022;</span>
          </div>

          {/* Icon with radial glow */}
          <div className="relative flex items-center justify-center">
            <div
              className="absolute rounded-full blur-xl scale-150"
              style={{
                inset: '-20%',
                backgroundColor: glowColor,
                opacity: 0.08,
              }}
            />
            <div className="relative">
              {icon}
            </div>
          </div>

          {/* Decorative divider line */}
          <div className="flex items-center gap-2 w-full px-4" aria-hidden="true">
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-[#d4a853]/30 to-transparent" />
            <span className="text-[#d4a853]/40 text-[8px]">&#10022;</span>
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-[#d4a853]/30 to-transparent" />
          </div>

          {/* Title + Description */}
          <div className="text-center pb-1">
            <div className="font-[var(--font-cinzel)] text-sm font-bold text-[#f0d48a] leading-tight">
              {title}
            </div>
            {description && (
              <div className="text-[10px] text-[#8a8478] mt-0.5 leading-tight">
                {description}
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );

  if (href) {
    return <Link href={href}>{card}</Link>;
  }

  return card;
}

// Re-export the icon size map so consumers can pass the right size to icons
export { ICON_SIZE_MAP as TAROT_ICON_SIZES };
