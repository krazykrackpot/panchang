'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RefreshCw, CheckCircle, XCircle, ArrowRight } from 'lucide-react';
import { tl } from '@/lib/utils/trilingual';
import { isDevanagariLocale } from '@/lib/utils/locale-fonts';
import { useLearningProgressStore, type ReviewItem } from '@/stores/learning-progress-store';
import type { Locale } from '@/types/panchang';

interface ReviewSessionProps {
  locale: string;
}

const MAX_REVIEW_QUESTIONS = 5;

export default function ReviewSession({ locale }: ReviewSessionProps) {
  const isHi = isDevanagariLocale(locale);
  const hf = isHi ? { fontFamily: 'var(--font-devanagari-heading)' } : { fontFamily: 'var(--font-heading)' };
  const bf = isHi ? { fontFamily: 'var(--font-devanagari-body)' } : {};

  const { getReviewDue, updateReview } = useLearningProgressStore();

  // Pick up to MAX_REVIEW_QUESTIONS due items, prioritizing lower ease factor (harder items first)
  const dueItems = useMemo(() => {
    const all = getReviewDue();
    const sorted = [...all].sort((a, b) => a.easeFactor - b.easeFactor);
    return sorted.slice(0, MAX_REVIEW_QUESTIONS);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Computed once on mount — stable across the session

  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [answered, setAnswered] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const [sessionComplete, setSessionComplete] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  if (dueItems.length === 0 || dismissed) return null;

  const currentItem: ReviewItem = dueItems[currentIdx];
  const questionText = isHi ? currentItem.questionHi : currentItem.question;
  const options = isHi ? currentItem.optionsHi : currentItem.options;
  const explanation = isHi ? currentItem.explanationHi : currentItem.explanation;

  const handleCheckAnswer = () => {
    if (selectedAnswer === null) return;
    setAnswered(true);
    const isCorrect = selectedAnswer === currentItem.correctIndex;
    if (isCorrect) setCorrectCount((c) => c + 1);
    updateReview(currentItem.moduleId, currentItem.question, isCorrect);
  };

  const handleNext = () => {
    if (currentIdx < dueItems.length - 1) {
      setCurrentIdx((i) => i + 1);
      setSelectedAnswer(null);
      setAnswered(false);
    } else {
      setSessionComplete(true);
    }
  };

  const handleDismiss = () => {
    setDismissed(true);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl border border-violet-500/20 bg-violet-500/5 p-5 sm:p-6"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <RefreshCw className="w-5 h-5 text-violet-400" />
          <div>
            <h3 className="text-lg font-bold text-violet-300" style={hf}>
              {tl({ en: 'Quick Review', hi: 'त्वरित समीक्षा', sa: 'त्वरित समीक्षा' }, locale as Locale)}
            </h3>
            <p className="text-violet-400/60 text-xs" style={bf}>
              {tl({ en: 'Reinforce what you\'ve learned', hi: 'जो सीखा उसे दोहराएँ', sa: 'यद् अधीतं तद् पुनः स्मरतु' }, locale as Locale)}
            </p>
          </div>
        </div>
        {!sessionComplete && (
          <span className="text-violet-400/50 text-xs font-mono">
            {currentIdx + 1}/{dueItems.length}
          </span>
        )}
      </div>

      <AnimatePresence mode="wait">
        {!sessionComplete ? (
          <motion.div
            key={`review-q-${currentIdx}`}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
            className="space-y-3"
          >
            {/* Module tag */}
            <span className="inline-block text-violet-500/50 text-[10px] uppercase tracking-widest font-bold">
              {currentItem.moduleId.replace('-', '.')}
            </span>

            {/* Question */}
            <p className="text-text-primary text-sm font-medium leading-relaxed" style={bf}>
              {questionText}
            </p>

            {/* Options */}
            <div className="space-y-2">
              {options.map((opt, i) => {
                const isCorrect = i === currentItem.correctIndex;
                const isSelected = selectedAnswer === i;
                let cls = 'border-violet-500/15 hover:border-violet-500/30';
                if (answered) {
                  if (isCorrect) cls = 'border-emerald-500/40 bg-emerald-500/10';
                  else if (isSelected && !isCorrect) cls = 'border-red-500/40 bg-red-500/10';
                } else if (isSelected) {
                  cls = 'border-violet-500/40 bg-violet-500/10';
                }
                return (
                  <button
                    key={i}
                    onClick={() => !answered && setSelectedAnswer(i)}
                    disabled={answered}
                    className={`w-full text-left px-4 py-2.5 rounded-xl border transition-all text-sm ${cls}`}
                  >
                    <span className="text-text-secondary" style={bf}>{opt}</span>
                    {answered && isCorrect && <CheckCircle className="inline w-4 h-4 text-emerald-400 ml-2" />}
                    {answered && isSelected && !isCorrect && <XCircle className="inline w-4 h-4 text-red-400 ml-2" />}
                  </button>
                );
              })}
            </div>

            {/* Explanation */}
            {answered && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-3 rounded-xl bg-violet-500/5 border border-violet-500/10"
              >
                <p className="text-text-secondary text-xs leading-relaxed" style={bf}>
                  {explanation}
                </p>
              </motion.div>
            )}

            {/* Action buttons */}
            <div className="flex justify-between items-center pt-1">
              <button
                onClick={handleDismiss}
                className="text-text-tertiary text-xs hover:text-text-secondary transition-colors"
              >
                {tl({ en: 'Skip review', hi: 'समीक्षा छोड़ें', sa: 'समीक्षां त्यजतु' }, locale as Locale)}
              </button>
              {!answered ? (
                <button
                  onClick={handleCheckAnswer}
                  disabled={selectedAnswer === null}
                  className="px-4 py-2 rounded-xl bg-violet-500/20 text-violet-300 text-sm font-medium hover:bg-violet-500/30 transition-colors disabled:opacity-40"
                >
                  {tl({ en: 'Check', hi: 'जाँचें', sa: 'परीक्षताम्' }, locale as Locale)}
                </button>
              ) : (
                <button
                  onClick={handleNext}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-violet-500/20 text-violet-300 text-sm font-medium hover:bg-violet-500/30 transition-colors"
                >
                  {currentIdx < dueItems.length - 1
                    ? tl({ en: 'Next', hi: 'अगला', sa: 'अग्रे' }, locale as Locale)
                    : tl({ en: 'Finish', hi: 'पूर्ण', sa: 'समाप्तम्' }, locale as Locale)}
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="review-complete"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-4"
          >
            <div className="text-3xl mb-2">
              {correctCount === dueItems.length ? '🧠' : correctCount >= Math.ceil(dueItems.length * 0.6) ? '💪' : '📖'}
            </div>
            <h4 className="text-lg font-bold text-violet-300 mb-1" style={hf}>
              {tl({ en: 'Review Complete!', hi: 'समीक्षा पूर्ण!', sa: 'समीक्षा समाप्ता!' }, locale as Locale)}
            </h4>
            <p className="text-text-secondary text-sm mb-3" style={bf}>
              {correctCount}/{dueItems.length}{' '}
              {tl({ en: 'correct', hi: 'सही', sa: 'शुद्धम्' }, locale as Locale)}
              {correctCount === dueItems.length
                ? ` — ${tl({ en: 'Perfect recall!', hi: 'उत्तम स्मरण!', sa: 'उत्तमं स्मरणम्!' }, locale as Locale)}`
                : correctCount >= Math.ceil(dueItems.length * 0.6)
                ? ` — ${tl({ en: 'Keep it up!', hi: 'ऐसे ही जारी रखें!', sa: 'एवमेव चालयतु!' }, locale as Locale)}`
                : ` — ${tl({ en: 'Review again soon.', hi: 'जल्दी ही पुनः दोहराएँ।', sa: 'शीघ्रं पुनः स्मरतु।' }, locale as Locale)}`}
            </p>
            <button
              onClick={handleDismiss}
              className="px-5 py-2 rounded-xl bg-violet-500/15 border border-violet-500/25 text-violet-300 text-sm font-medium hover:bg-violet-500/25 transition-colors"
            >
              {tl({ en: 'Continue Learning', hi: 'सीखना जारी रखें', sa: 'अध्ययनं चालयतु' }, locale as Locale)}
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
