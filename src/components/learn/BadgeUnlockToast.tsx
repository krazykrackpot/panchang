'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Badge } from '@/lib/learn/badges';
import type { Locale } from '@/types/panchang';
import { isDevanagariLocale } from '@/lib/utils/locale-fonts';

interface BadgeUnlockToastProps {
  badges: Badge[];
  locale: Locale;
}

export default function BadgeUnlockToast({ badges, locale }: BadgeUnlockToastProps) {
  const [queue, setQueue] = useState<Badge[]>([]);
  const [current, setCurrent] = useState<Badge | null>(null);
  const isHi = isDevanagariLocale(locale);

  // Populate queue when badges change
  useEffect(() => {
    if (badges.length > 0) {
      setQueue(badges);
    }
  }, [badges]);

  // Show next badge from queue
  useEffect(() => {
    if (current || queue.length === 0) return;
    const [next, ...rest] = queue;
    setCurrent(next);
    setQueue(rest);

    const timer = setTimeout(() => {
      setCurrent(null);
    }, 3500);

    return () => clearTimeout(timer);
  }, [current, queue]);

  return (
    <AnimatePresence>
      {current && (
        <motion.div
          key={current.id}
          initial={{ opacity: 0, y: 60, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -30, scale: 0.95 }}
          transition={{ type: 'spring', stiffness: 400, damping: 25 }}
          className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[100] pointer-events-none"
        >
          <div className="flex items-center gap-3 px-5 py-3 rounded-2xl bg-gradient-to-r from-[#2d1b69]/95 via-[#1a1040]/95 to-[#0a0e27]/95 border border-gold-primary/30 shadow-2xl shadow-gold-primary/10 backdrop-blur-xl">
            <span className="text-3xl">{current.icon}</span>
            <div>
              <p className="text-gold-light text-xs font-bold uppercase tracking-widest">
                {isHi ? 'बैज अनलॉक!' : 'Badge Unlocked!'}
              </p>
              <p className="text-text-primary text-sm font-semibold">
                {isHi ? current.label.hi : current.label.en}
              </p>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
