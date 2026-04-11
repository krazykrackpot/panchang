'use client';

import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import type { PujaVidhi, MantraDetail, VidhiStep } from '@/lib/constants/puja-vidhi/types';
import type { Locale } from '@/types/panchang';
import JapaCounter from './JapaCounter';
import { useMantraPronounce } from './MantraCard';

interface PujaModeProps {
  puja: PujaVidhi;
  locale: Locale;
  quickMode: boolean;
  onClose: () => void;
}

const LABELS = {
  en: { step: 'Step', of: 'of', quick: 'Quick Mode', full: 'Full Mode', exit: 'Exit Puja Mode', chant: 'Tap to count' },
  hi: { step: 'चरण', of: 'में से', quick: 'संक्षिप्त', full: 'पूर्ण', exit: 'बाहर निकलें', chant: 'गिनने के लिए टैप करें' },
  sa: { step: 'सोपानम्', of: 'मध्ये', quick: 'संक्षिप्तम्', full: 'पूर्णम्', exit: 'बहिर्गच्छतु', chant: 'गणनार्थं स्पृशतु' },
} as const;

export default function PujaMode({ puja, locale, quickMode: initialQuickMode, onClose }: PujaModeProps) {
  const [quickMode, setQuickMode] = useState(initialQuickMode);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0); // -1 = left, 1 = right
  const wakeLockRef = useRef<WakeLockSentinel | null>(null);

  const labels = LABELS[locale];
  const { speaking, pronounce, supported: speechSupported } = useMantraPronounce();

  // Build mantra lookup map
  const mantraMap = useMemo(() => {
    const map = new Map<string, MantraDetail>();
    for (const m of puja.mantras) {
      map.set(m.id, m);
    }
    return map;
  }, [puja.mantras]);

  // Filter steps based on quick mode
  const steps = useMemo(() => {
    if (!quickMode) return puja.vidhiSteps;
    const hasEssentialField = puja.vidhiSteps.some((s) => s.essential !== undefined);
    if (!hasEssentialField) return puja.vidhiSteps;
    return puja.vidhiSteps.filter((s) => s.essential !== false);
  }, [puja.vidhiSteps, quickMode]);

  const totalSteps = steps.length;
  const currentStep = steps[currentIndex] as VidhiStep | undefined;
  const linkedMantra = currentStep?.mantraRef ? mantraMap.get(currentStep.mantraRef) : undefined;

  // Clamp index when steps change (e.g. toggling quick mode)
  useEffect(() => {
    if (currentIndex >= steps.length) {
      setCurrentIndex(Math.max(0, steps.length - 1));
    }
  }, [steps.length, currentIndex]);

  // Screen Wake Lock
  useEffect(() => {
    let active = true;

    async function requestWakeLock() {
      try {
        if ('wakeLock' in navigator) {
          const sentinel = await navigator.wakeLock.request('screen');
          if (active) {
            wakeLockRef.current = sentinel;
          } else {
            sentinel.release();
          }
        }
      } catch {
        // Wake lock not supported or denied — ignore
      }
    }

    requestWakeLock();

    return () => {
      active = false;
      wakeLockRef.current?.release();
      wakeLockRef.current = null;
    };
  }, []);

  const goNext = useCallback(() => {
    setCurrentIndex((i) => {
      if (i >= totalSteps - 1) return i;
      setDirection(1);
      return i + 1;
    });
  }, [totalSteps]);

  const goPrev = useCallback(() => {
    setCurrentIndex((i) => {
      if (i <= 0) return i;
      setDirection(-1);
      return i - 1;
    });
  }, []);

  // Keyboard navigation
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'ArrowRight' || e.key === ' ') {
        e.preventDefault();
        goNext();
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        goPrev();
      } else if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      }
    }

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [goNext, goPrev, onClose]);

  // Lock body scroll
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);

  const progress = totalSteps > 0 ? (currentIndex + 1) / totalSteps : 0;

  const slideVariants = {
    enter: (dir: number) => ({
      x: dir >= 0 ? 120 : -120,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (dir: number) => ({
      x: dir >= 0 ? -120 : 120,
      opacity: 0,
    }),
  };

  if (!currentStep) return null;

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-[#070b1f] text-white">
      {/* Top bar */}
      <div className="flex items-center justify-between px-4 py-3 sm:px-6">
        <button
          type="button"
          onClick={onClose}
          className="inline-flex items-center gap-2 rounded-full border border-gold-primary/20 px-4 py-2 text-sm text-text-secondary/70 transition-colors hover:border-gold-primary/40 hover:text-gold-light"
        >
          <X className="h-4 w-4" />
          {labels.exit}
        </button>

        {/* Quick/Full toggle pill */}
        <div className="relative flex rounded-full border border-gold-primary/20 bg-gold-primary/[0.04] p-0.5">
          <button
            type="button"
            onClick={() => setQuickMode(true)}
            className={`relative z-10 rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
              quickMode ? 'text-[#070b1f]' : 'text-text-secondary/75'
            }`}
          >
            {labels.quick}
          </button>
          <button
            type="button"
            onClick={() => setQuickMode(false)}
            className={`relative z-10 rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
              !quickMode ? 'text-[#070b1f]' : 'text-text-secondary/75'
            }`}
          >
            {labels.full}
          </button>
          {/* Sliding indicator */}
          <motion.div
            className="absolute top-0.5 bottom-0.5 rounded-full bg-gold-primary"
            animate={{
              left: quickMode ? '2px' : '50%',
              right: quickMode ? '50%' : '2px',
            }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          />
        </div>
      </div>

      {/* Progress bar */}
      <div className="h-0.5 w-full bg-gold-primary/10">
        <motion.div
          className="h-full bg-gradient-to-r from-[#d4a853] to-[#f0d48a]"
          animate={{ width: `${progress * 100}%` }}
          transition={{ type: 'spring', stiffness: 200, damping: 30 }}
        />
      </div>

      {/* Main content area */}
      <div className="flex flex-1 flex-col items-center overflow-y-auto px-4 py-8 sm:px-6">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={currentIndex}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.25, ease: 'easeInOut' as const }}
            className="flex w-full max-w-lg flex-col items-center gap-6"
          >
            {/* Step indicator */}
            <p className="text-sm font-medium tracking-wider text-text-secondary/70 uppercase">
              {labels.step} {currentIndex + 1} {labels.of} {totalSteps}
            </p>

            {/* Step title */}
            <h2
              className="text-center text-2xl font-black text-gold-primary sm:text-4xl break-words"
              style={{ fontFamily: (locale !== 'en' && String(locale) !== 'ta') ? 'var(--font-devanagari-heading)' : undefined }}
            >
              {currentStep.title[locale]}
            </h2>

            {/* Step description */}
            <p
              className="text-center text-base leading-relaxed text-text-secondary/70"
              style={{ fontFamily: (locale !== 'en' && String(locale) !== 'ta') ? 'var(--font-devanagari-body)' : undefined }}
            >
              {currentStep.description[locale]}
            </p>

            {/* Duration badge */}
            {currentStep.duration && (
              <span className="inline-flex rounded-full border border-gold-primary/20 bg-gold-primary/[0.06] px-3 py-1 text-xs font-medium text-gold-light">
                {currentStep.duration}
              </span>
            )}

            {/* Linked mantra card */}
            {linkedMantra && (
              <div className="relative w-full rounded-xl border border-gold-primary/15 bg-gold-primary/[0.04] p-5">
                {/* Pronounce button */}
                {speechSupported && (
                  <button
                    type="button"
                    onClick={() => pronounce(linkedMantra.iast)}
                    className="absolute top-2 right-2 w-11 h-11 rounded-lg bg-gold-primary/10 hover:bg-gold-primary/20 border border-gold-primary/15 flex items-center justify-center transition-colors"
                    aria-label={speaking ? 'Stop pronunciation' : 'Pronounce mantra'}
                  >
                    {speaking ? (
                      <svg className="w-4 h-4 text-gold-primary animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M11 5L6 9H2v6h4l5 4V5z" />
                        <line x1="23" y1="9" x2="17" y2="15" strokeLinecap="round" strokeLinejoin="round" />
                        <line x1="17" y1="9" x2="23" y2="15" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    ) : (
                      <svg className="w-4 h-4 text-gold-primary/60 hover:text-gold-primary/90 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M11 5L6 9H2v6h4l5 4V5z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19.07 4.93a10 10 0 010 14.14M15.54 8.46a5 5 0 010 7.08" />
                      </svg>
                    )}
                  </button>
                )}
                <p
                  className="text-center text-2xl leading-relaxed text-amber-300 font-bold sm:text-3xl"
                  style={{ fontFamily: 'var(--font-devanagari-heading)' }}
                >
                  {linkedMantra.devanagari}
                </p>
                <p className="mt-3 text-center text-sm italic text-text-secondary/70">
                  {linkedMantra.iast}
                </p>
                <p
                  className="mt-2 text-center text-sm text-text-secondary/75"
                  style={{ fontFamily: (locale !== 'en' && String(locale) !== 'ta') ? 'var(--font-devanagari-body)' : undefined }}
                >
                  {linkedMantra.meaning[locale]}
                </p>
              </div>
            )}

            {/* Japa counter */}
            {linkedMantra && linkedMantra.japaCount != null && linkedMantra.japaCount > 1 && (
              <div className="flex flex-col items-center gap-2">
                <JapaCounter
                  target={linkedMantra.japaCount}
                  mantraName={linkedMantra.name[locale]}
                />
                <p className="text-xs text-text-secondary/65">{labels.chant}</p>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Bottom navigation — extra pb for iPhone home indicator */}
      <div className="flex items-center justify-between border-t border-gold-primary/10 px-4 py-4 pb-[max(1rem,env(safe-area-inset-bottom))] sm:px-6">
        <button
          type="button"
          onClick={goPrev}
          disabled={currentIndex <= 0}
          className="inline-flex items-center justify-center rounded-full border border-gold-primary/20 w-11 h-11 text-sm text-gold-light transition-colors hover:border-gold-primary/40 disabled:opacity-30 disabled:pointer-events-none"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>

        <span className="text-sm font-medium text-text-secondary/70">
          {currentIndex + 1} / {totalSteps}
        </span>

        <button
          type="button"
          onClick={goNext}
          disabled={currentIndex >= totalSteps - 1}
          className="inline-flex items-center justify-center rounded-full border border-gold-primary/20 w-11 h-11 text-sm text-gold-light transition-colors hover:border-gold-primary/40 disabled:opacity-30 disabled:pointer-events-none"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
}
