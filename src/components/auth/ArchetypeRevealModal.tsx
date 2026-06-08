'use client';

import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RashiIconById } from '@/components/icons/RashiIcons';
import { getArchetype } from '@/lib/constants/archetypes-with-overlay';
import { tl } from '@/lib/utils/trilingual';
import { isDevanagariLocale } from '@/lib/utils/locale-fonts';
import { useRouter } from 'next/navigation';

interface ArchetypeRevealModalProps {
  isOpen: boolean;
  onClose: () => void;
  lagnaSignId: number;
  locale: string;
  chartUrl?: string; // e.g. /kundali or /dashboard/chart
}

export default function ArchetypeRevealModal({
  isOpen, onClose, lagnaSignId, locale, chartUrl,
}: ArchetypeRevealModalProps) {
  const router = useRouter();
  const archetype = getArchetype(lagnaSignId);
  const isHi = isDevanagariLocale(locale);
  const hf = isHi ? { fontFamily: 'var(--font-devanagari-heading)' } : { fontFamily: 'var(--font-heading)' };
  const bf = isHi ? { fontFamily: 'var(--font-devanagari-body)' } : undefined;

  // Round 2 UI-13 — Escape dismissal. Previously the backdrop click worked
  // but Tab still navigated underlying page elements and Escape did
  // nothing — keyboard users couldn't dismiss the post-signup reveal.
  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [isOpen, onClose]);

  if (!archetype) return null;

  const name = tl(archetype.name, locale);
  const title = tl(archetype.title, locale);
  const essence = tl(archetype.essence, locale);
  const description = tl(archetype.description, locale);
  const superpower = tl(archetype.superpower, locale);
  const shadow = tl(archetype.shadow, locale);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-[9999] flex items-center justify-center p-4 overflow-y-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-black/80 backdrop-blur-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            onClick={onClose}
          />

          {/* Card */}
          <motion.div
            className="relative z-10 w-full max-w-sm"
            initial={{ scale: 0.5, opacity: 0, rotateY: 180 }}
            animate={{ scale: 1, opacity: 1, rotateY: 0 }}
            transition={{ type: 'spring', stiffness: 100, damping: 20, delay: 0.2 }}
          >
            {/* Tarot card — tall portrait */}
            <div
              className="aspect-[2/3] rounded-3xl overflow-hidden relative"
              style={{
                background: 'linear-gradient(135deg, #1a0a3e 0%, #0a0e27 40%, #1a0a3e 100%)',
                boxShadow: '0 0 80px rgba(212, 168, 83, 0.3), 0 0 160px rgba(212, 168, 83, 0.1)',
              }}
            >
              {/* Ornate gold border */}
              <div className="absolute inset-0 rounded-3xl border-2 border-gold-primary/60" />
              <div className="absolute inset-[6px] rounded-[20px] border border-gold-primary/30" />
              <div className="absolute inset-[12px] rounded-[16px] border border-gold-dark/20" />

              {/* Corner ornaments */}
              {['top-4 left-4', 'top-4 right-4 rotate-90', 'bottom-4 left-4 -rotate-90', 'bottom-4 right-4 rotate-180'].map((pos, i) => (
                <div key={i} className={`absolute ${pos} w-6 h-6`}>
                  <svg viewBox="0 0 24 24" fill="none" className="w-full h-full">
                    <path d="M2 2v8l4-4 4 4V2H2z" fill="#d4a853" opacity="0.5" />
                  </svg>
                </div>
              ))}

              {/* Content */}
              <div className="absolute inset-0 flex flex-col items-center justify-between p-8 pt-10 pb-8">
                {/* Top: "YOUR ARCHETYPE" label */}
                <motion.p
                  className="text-gold-primary/80 text-[10px] uppercase tracking-[0.4em] font-bold"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 }}
                >
                  {isHi ? 'आपका आदर्शरूप' : 'YOUR ARCHETYPE'}
                </motion.p>

                {/* Centre: Icon + Name */}
                <div className="flex flex-col items-center gap-4">
                  <motion.div
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: 'spring', stiffness: 80, damping: 15, delay: 0.5 }}
                    className="relative"
                  >
                    {/* Glow behind icon */}
                    <div className="absolute inset-0 blur-2xl bg-gold-primary/20 rounded-full scale-150" />
                    <div className="relative w-28 h-28">
                      <RashiIconById id={lagnaSignId} size={112} />
                    </div>
                  </motion.div>

                  <motion.div
                    className="text-center"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7 }}
                  >
                    <h2
                      className="text-3xl font-black text-gold-gradient leading-tight"
                      style={hf}
                    >
                      {name}
                    </h2>
                    <p className="text-gold-primary/60 text-xs mt-1 tracking-wider uppercase" style={bf}>
                      {title}
                    </p>
                  </motion.div>

                  <motion.p
                    className="text-text-primary text-sm text-center leading-relaxed max-w-[260px]"
                    style={bf}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.0 }}
                  >
                    {essence}
                  </motion.p>
                </div>

                {/* Bottom: CTA */}
                <motion.button
                  className="w-full py-3 bg-gradient-to-r from-gold-dark to-gold-primary text-bg-primary font-bold rounded-xl text-sm tracking-wide hover:from-gold-primary hover:to-gold-light transition-all"
                  style={hf}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.2 }}
                  onClick={() => {
                    onClose();
                    if (chartUrl) router.push(chartUrl);
                  }}
                >
                  {isHi ? 'अपनी कुण्डली देखें →' : 'Explore Your Birth Chart →'}
                </motion.button>
              </div>
            </div>

            {/* Below card: expanded details */}
            <motion.div
              className="mt-4 space-y-3 px-2"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.4 }}
            >
              <p className="text-text-secondary text-xs text-center leading-relaxed" style={bf}>
                {description}
              </p>
              <div className="grid grid-cols-2 gap-2">
                <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-lg p-3">
                  <p className="text-emerald-400 text-[10px] uppercase tracking-wider font-bold mb-1">
                    {isHi ? 'महाशक्ति' : 'Superpower'}
                  </p>
                  <p className="text-text-secondary text-xs" style={bf}>{superpower}</p>
                </div>
                <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg p-3">
                  <p className="text-amber-400 text-[10px] uppercase tracking-wider font-bold mb-1">
                    {isHi ? 'छाया' : 'Shadow'}
                  </p>
                  <p className="text-text-secondary text-xs" style={bf}>{shadow}</p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
