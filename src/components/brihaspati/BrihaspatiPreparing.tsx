'use client';

/**
 * Shown during the streaming state when no answer tokens have arrived
 * yet — the gap between the SSE connection opening and the LLM's first
 * token. Without this, the panel looks frozen on "Awaiting payment
 * confirmation…" or worse, blank.
 *
 * Rotates through Jyotish-themed status messages every ~3 seconds so
 * the user sees something is happening AND learns a little about what
 * Brihaspati is doing.
 */
import { useEffect, useState } from 'react';
import { BrihaspatiAvatar } from './BrihaspatiAvatar';

const MESSAGES: string[] = [
  'Reading your chart…',
  'Examining the houses and their lords…',
  'Considering the active dashas and their context…',
  'Looking at relevant transits…',
  'Cross-checking yogas and doshas…',
  'Weighing functional natures for your lagna…',
  'Drawing the picture together…',
  'Almost ready — preparing the reading…',
];

export function BrihaspatiPreparing() {
  const [idx, setIdx] = useState(0);
  useEffect(() => {
    const t = setInterval(() => {
      setIdx((i) => (i + 1) % MESSAGES.length);
    }, 3000);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center py-10 px-4 text-center">
      <div className="
        relative h-24 w-24 rounded-full overflow-hidden mb-5
        bg-gradient-to-br from-[#f0d48a] via-[#d4a853] to-[#8a6d2b]
        border-2 border-gold-primary/40 shadow-md shadow-gold-primary/30
      ">
        <BrihaspatiAvatar size={92} />
        {/* Pulsing aureole */}
        <span className="
          absolute inset-0 rounded-full
          ring-2 ring-gold-light/60
          animate-ping
        " />
      </div>
      <p className="text-gold-light text-base font-medium leading-relaxed transition-opacity duration-500">
        {MESSAGES[idx]}
      </p>
      <p className="text-text-secondary text-xs mt-3 italic">
        बृहस्पति is consulting your janma patrika
      </p>
      {/* Three pulsing dots */}
      <div className="flex gap-1.5 mt-4">
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="h-1.5 w-1.5 rounded-full bg-gold-primary/60 animate-pulse"
            style={{ animationDelay: `${i * 200}ms` }}
          />
        ))}
      </div>
    </div>
  );
}
