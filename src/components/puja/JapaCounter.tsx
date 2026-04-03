'use client';

import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RotateCcw } from 'lucide-react';

interface JapaCounterProps {
  target: number;
  mantraName: string;
  onComplete?: () => void;
}

const VIEWBOX_SIZE = 200;
const STROKE_WIDTH = 6;
const RADIUS = (VIEWBOX_SIZE - STROKE_WIDTH) / 2;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

export default function JapaCounter({
  target,
  mantraName,
  onComplete,
}: JapaCounterProps) {
  const [count, setCount] = useState(0);
  const isComplete = count >= target;
  const progress = Math.min(count / target, 1);

  const handleTap = useCallback(() => {
    if (count >= target) return;

    const next = count + 1;
    setCount(next);

    // Haptic feedback
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      if (next >= target) {
        navigator.vibrate([100, 50, 100]);
      } else {
        navigator.vibrate(10);
      }
    }

    if (next >= target && onComplete) {
      onComplete();
    }
  }, [count, target, onComplete]);

  const handleReset = useCallback(() => {
    setCount(0);
  }, []);

  const dashOffset = CIRCUMFERENCE * (1 - progress);

  return (
    <div className="flex flex-col items-center gap-4">
      {/* Tap area */}
      <button
        type="button"
        onClick={handleTap}
        disabled={isComplete}
        className="relative cursor-pointer active:scale-95 transition-transform duration-100 disabled:cursor-default disabled:active:scale-100"
        aria-label={`Japa counter: ${count} of ${target}. Tap to increment.`}
      >
        <svg
          viewBox={`0 0 ${VIEWBOX_SIZE} ${VIEWBOX_SIZE}`}
          className="block w-[160px] h-[160px] sm:w-[200px] sm:h-[200px]"
        >
          {/* Background ring */}
          <circle
            cx={VIEWBOX_SIZE / 2}
            cy={VIEWBOX_SIZE / 2}
            r={RADIUS}
            fill="none"
            stroke="rgba(212, 168, 83, 0.1)"
            strokeWidth={STROKE_WIDTH}
          />
          {/* Progress ring */}
          <motion.circle
            cx={VIEWBOX_SIZE / 2}
            cy={VIEWBOX_SIZE / 2}
            r={RADIUS}
            fill="none"
            stroke={isComplete ? '#34d399' : '#d4a853'}
            strokeWidth={STROKE_WIDTH}
            strokeLinecap="round"
            strokeDasharray={CIRCUMFERENCE}
            animate={{ strokeDashoffset: dashOffset }}
            transition={{ type: 'spring', stiffness: 200, damping: 30 }}
            transform={`rotate(-90 ${VIEWBOX_SIZE / 2} ${VIEWBOX_SIZE / 2})`}
          />
        </svg>

        {/* Center text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <AnimatePresence mode="popLayout">
            <motion.span
              key={count}
              initial={{ scale: 1.3, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ duration: 0.15 }}
              className={`text-4xl font-black ${
                isComplete ? 'text-emerald-400' : 'text-gold-light'
              }`}
              style={{ fontFamily: 'var(--font-heading)' }}
            >
              {count}
            </motion.span>
          </AnimatePresence>
          <span className="text-sm text-text-secondary/50">/ {target}</span>
        </div>
      </button>

      {/* Mantra name */}
      <p className="text-gold-primary text-sm font-medium text-center">
        {mantraName}
      </p>

      {/* Controls row */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={handleReset}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-full border border-gold-primary/20 text-text-secondary/70 hover:text-gold-light hover:border-gold-primary/40 transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          Reset
        </button>

        {isComplete && (
          <motion.span
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="inline-flex items-center px-3 py-1.5 text-xs font-semibold rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/20"
          >
            Complete
          </motion.span>
        )}
      </div>
    </div>
  );
}
