'use client';

import { useState, useEffect, createContext, useContext, type ReactNode } from 'react';
import { useLocale } from 'next-intl';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, CheckCircle, XCircle, BookOpen, HelpCircle, Users } from 'lucide-react';
import type { Locale } from '@/types/panchang';
import { Link } from '@/lib/i18n/navigation';
import { useLearningProgressStore } from '@/stores/learning-progress-store';
import { getNextModuleId, getModuleRef, isLastInPhase } from '@/lib/learn/module-sequence';
import { checkBadges } from '@/lib/learn/badges';
import ShareButton from '@/components/ui/ShareButton';
import BadgeUnlockToast from '@/components/learn/BadgeUnlockToast';

// ─── Bilingual text helper for module content ──────────────────────────────
// Modules can import `useT` and call `t(en, hi)` to get the locale-appropriate string
const ModuleLocaleContext = createContext<Locale>('en');
export function useModuleLocale(): Locale { return useContext(ModuleLocaleContext); }
export function T({ en, hi }: { en: string; hi: string }) {
  const locale = useContext(ModuleLocaleContext);
  return <>{locale === 'en' || String(locale) === 'ta' ? en : hi}</>;
}

// ─── Types ──────────────────────────────────────────────────────────────────

export interface ModuleQuestion {
  id: string;
  type: 'mcq' | 'true_false';
  question: { en: string; hi: string };
  options?: { en: string; hi: string }[];
  correctAnswer: number | boolean; // index for mcq, true/false for t/f
  explanation: { en: string; hi: string };
  classicalRef?: string;
}

export interface ModuleMeta {
  id: string;
  phase: number;
  topic: string;
  moduleNumber: string; // e.g. "1.1"
  title: { en: string; hi: string };
  subtitle: { en: string; hi: string };
  estimatedMinutes: number;
  prerequisites?: string[]; // module IDs
  crossRefs?: { label: { en: string; hi: string }; href: string }[];
}

interface ModuleContainerProps {
  meta: ModuleMeta;
  pages: ReactNode[]; // Content split into pages
  questions: ModuleQuestion[];
  children?: ReactNode; // Additional content after all pages
}

// ─── Module Container ───────────────────────────────────────────────────────

export default function ModuleContainer({ meta, pages, questions }: ModuleContainerProps) {
  const locale = useLocale() as Locale;
  const isHi = locale !== 'en';
  const hf = isHi ? { fontFamily: 'var(--font-devanagari-heading)' } : { fontFamily: 'var(--font-heading)' };

  const totalContentPages = pages.length;
  const [currentPage, setCurrentPage] = useState(0);
  const [showQuiz, setShowQuiz] = useState(false);
  const [quizQuestions, setQuizQuestions] = useState<ModuleQuestion[]>([]);
  const [currentQ, setCurrentQ] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | boolean | null>(null);
  const [answered, setAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [quizComplete, setQuizComplete] = useState(false);

  // Shuffle and pick 5 questions
  useEffect(() => {
    const shuffled = [...questions].sort(() => Math.random() - 0.5);
    setQuizQuestions(shuffled.slice(0, Math.min(5, shuffled.length)));
  }, [questions]);

  const isLastContentPage = currentPage === totalContentPages - 1;

  const handleNextPage = () => {
    if (isLastContentPage) {
      setShowQuiz(true);
    } else {
      setCurrentPage(p => p + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handlePrevPage = () => {
    if (showQuiz) {
      setShowQuiz(false);
    } else if (currentPage > 0) {
      setCurrentPage(p => p - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleAnswer = () => {
    if (selectedAnswer === null) return;
    setAnswered(true);
    const q = quizQuestions[currentQ];
    if (selectedAnswer === q.correctAnswer) {
      setScore(s => s + 1);
    }
  };

  const handleNextQuestion = () => {
    if (currentQ < quizQuestions.length - 1) {
      setCurrentQ(q => q + 1);
      setSelectedAnswer(null);
      setAnswered(false);
    } else {
      setQuizComplete(true);
    }
  };

  const handleRetry = () => {
    const shuffled = [...questions].sort(() => Math.random() - 0.5);
    setQuizQuestions(shuffled.slice(0, Math.min(5, shuffled.length)));
    setCurrentQ(0);
    setSelectedAnswer(null);
    setAnswered(false);
    setScore(0);
    setQuizComplete(false);
  };

  const [showChallenge, setShowChallenge] = useState(false);
  const [newBadges, setNewBadges] = useState<import('@/lib/learn/badges').Badge[]>([]);

  const passThreshold = Math.ceil(quizQuestions.length * 0.7);
  const passed = score >= passThreshold;

  const { markPageRead, markQuizPassed, getPhaseProgress, hydrateFromStorage, hydrated, progress, streak } = useLearningProgressStore();

  // Hydrate store on mount
  useEffect(() => { hydrateFromStorage(); }, [hydrateFromStorage]);

  // Track page reads
  useEffect(() => {
    if (hydrated) {
      markPageRead(meta.id, currentPage);
    }
  }, [currentPage, meta.id, hydrated, markPageRead]);

  // Track quiz pass + check for new badges
  useEffect(() => {
    if (quizComplete && passed && hydrated) {
      markQuizPassed(meta.id, score);
      // Check badges after a short delay to let the store update
      setTimeout(() => {
        const { newlyEarned } = checkBadges(
          useLearningProgressStore.getState().progress,
          useLearningProgressStore.getState().streak,
        );
        if (newlyEarned.length > 0) {
          setNewBadges(newlyEarned);
        }
      }, 100);
    }
  }, [quizComplete, passed, score, meta.id, hydrated, markQuizPassed]);

  // Next module info for post-quiz flow
  const nextId = getNextModuleId(meta.id);
  const nextRef = nextId ? getModuleRef(nextId) : null;
  const phaseProgress = hydrated ? getPhaseProgress(meta.phase) : null;
  const lastInPhase = isLastInPhase(meta.id);

  return (
    <ModuleLocaleContext.Provider value={locale}>
    <div className="space-y-6">
      {/* Module header */}
      <div className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-2xl p-5 border border-gold-primary/15 bg-gradient-to-br from-gold-primary/5 to-transparent">
        <div className="flex items-center gap-2 text-gold-dark text-xs uppercase tracking-widest font-bold mb-2">
          <BookOpen className="w-3.5 h-3.5" />
          {isHi ? `चरण ${meta.phase} · ${meta.topic}` : `Phase ${meta.phase} · ${meta.topic}`}
        </div>
        <h2 className="text-2xl font-bold text-gold-gradient mb-1" style={hf}>
          {isHi ? `${meta.moduleNumber}  ${meta.title.hi}` : `${meta.moduleNumber}  ${meta.title.en}`}
        </h2>
        <p className="text-text-secondary text-sm">{isHi ? meta.subtitle.hi : meta.subtitle.en}</p>
        <div className="flex items-center gap-4 mt-3 text-text-tertiary text-xs">
          <span>~{meta.estimatedMinutes} {isHi ? 'मिनट' : 'min'}</span>
          <span>{totalContentPages} {isHi ? 'पृष्ठ' : 'pages'} + {isHi ? 'ज्ञान परीक्षा' : 'knowledge check'}</span>
        </div>

        {/* Progress bar */}
        <div className="mt-3 flex items-center gap-2">
          <div className="flex-1 h-1.5 bg-bg-tertiary/50 rounded-full overflow-hidden">
            <div className="h-full bg-gold-primary rounded-full transition-all duration-500"
              style={{ width: showQuiz ? '100%' : `${((currentPage + 1) / (totalContentPages + 1)) * 100}%` }} />
          </div>
          <span className="text-text-tertiary text-xs font-mono shrink-0">
            {showQuiz ? (isHi ? 'परीक्षा' : 'Quiz') : `${currentPage + 1}/${totalContentPages}`}
          </span>
        </div>
      </div>

      {/* Content or Quiz */}
      <AnimatePresence mode="wait">
        {!showQuiz ? (
          <motion.div key={`page-${currentPage}`}
            initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}>
            {/* Content page */}
            <div className="prose-content">
              {pages[currentPage]}
            </div>
          </motion.div>
        ) : !quizComplete ? (
          <motion.div key="quiz"
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            {/* Quiz */}
            <div className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-2xl p-6 border border-indigo-500/20">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <HelpCircle className="w-5 h-5 text-indigo-400" />
                  <span className="text-indigo-400 text-xs uppercase tracking-widest font-bold">
                    {isHi ? 'ज्ञान परीक्षा' : 'Knowledge Check'}
                  </span>
                </div>
                <span className="text-text-tertiary text-xs font-mono">{currentQ + 1}/{quizQuestions.length}</span>
              </div>

              {quizQuestions[currentQ] && (() => {
                const q = quizQuestions[currentQ];
                return (
                  <div className="space-y-4">
                    <p className="text-text-primary text-sm font-medium leading-relaxed" style={isHi ? { fontFamily: 'var(--font-devanagari-body)' } : undefined}>
                      {isHi ? q.question.hi : q.question.en}
                    </p>

                    {/* MCQ options */}
                    {q.type === 'mcq' && q.options && (
                      <div className="space-y-2">
                        {q.options.map((opt, i) => {
                          const isCorrect = i === q.correctAnswer;
                          const isSelected = selectedAnswer === i;
                          let cls = 'border-gold-primary/10 hover:border-gold-primary/30';
                          if (answered) {
                            if (isCorrect) cls = 'border-emerald-500/40 bg-emerald-500/10';
                            else if (isSelected && !isCorrect) cls = 'border-red-500/40 bg-red-500/10';
                          } else if (isSelected) {
                            cls = 'border-gold-primary/40 bg-gold-primary/10';
                          }
                          return (
                            <button key={i} onClick={() => !answered && setSelectedAnswer(i)}
                              disabled={answered}
                              className={`w-full text-left px-4 py-3 rounded-xl border transition-all text-sm ${cls}`}>
                              <span className="text-text-secondary">{isHi ? opt.hi : opt.en}</span>
                              {answered && isCorrect && <CheckCircle className="inline w-4 h-4 text-emerald-400 ml-2" />}
                              {answered && isSelected && !isCorrect && <XCircle className="inline w-4 h-4 text-red-400 ml-2" />}
                            </button>
                          );
                        })}
                      </div>
                    )}

                    {/* True/False */}
                    {q.type === 'true_false' && (
                      <div className="flex gap-3">
                        {[true, false].map(val => {
                          const isCorrect = val === q.correctAnswer;
                          const isSelected = selectedAnswer === val;
                          let cls = 'border-gold-primary/10 hover:border-gold-primary/30';
                          if (answered) {
                            if (isCorrect) cls = 'border-emerald-500/40 bg-emerald-500/10';
                            else if (isSelected && !isCorrect) cls = 'border-red-500/40 bg-red-500/10';
                          } else if (isSelected) cls = 'border-gold-primary/40 bg-gold-primary/10';
                          return (
                            <button key={String(val)} onClick={() => !answered && setSelectedAnswer(val)}
                              disabled={answered}
                              className={`flex-1 px-4 py-3 rounded-xl border transition-all text-sm font-medium ${cls}`}>
                              {val ? (isHi ? 'सत्य' : 'True') : (isHi ? 'असत्य' : 'False')}
                            </button>
                          );
                        })}
                      </div>
                    )}

                    {/* Explanation after answering */}
                    {answered && (
                      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                        className="p-4 rounded-xl bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/10">
                        <div className="text-gold-dark text-xs uppercase tracking-widest font-bold mb-1">
                          {isHi ? 'व्याख्या' : 'Explanation'}
                        </div>
                        <p className="text-text-secondary text-xs leading-relaxed">{isHi ? q.explanation.hi : q.explanation.en}</p>
                        {q.classicalRef && <p className="text-text-tertiary text-xs mt-1">{q.classicalRef}</p>}
                      </motion.div>
                    )}

                    {/* Action buttons */}
                    <div className="flex justify-end gap-3">
                      {!answered && (
                        <button onClick={handleAnswer} disabled={selectedAnswer === null}
                          className="px-5 py-2 rounded-xl bg-indigo-500/20 text-indigo-300 text-sm font-medium hover:bg-indigo-500/30 transition-colors disabled:opacity-40">
                          {isHi ? 'जाँचें' : 'Check Answer'}
                        </button>
                      )}
                      {answered && (
                        <button onClick={handleNextQuestion}
                          className="px-5 py-2 rounded-xl bg-gold-primary text-bg-primary text-sm font-semibold hover:bg-gold-light transition-colors">
                          {currentQ < quizQuestions.length - 1 ? (isHi ? 'अगला प्रश्न →' : 'Next Question →') : (isHi ? 'परिणाम देखें' : 'See Results')}
                        </button>
                      )}
                    </div>
                  </div>
                );
              })()}
            </div>
          </motion.div>
        ) : (
          <motion.div key="results"
            initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
            <div className={`bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border rounded-2xl p-8 text-center ${passed ? 'border-emerald-500/30' : 'border-red-500/30'}`}>
              {passed ? (
                <>
                  <div className="text-5xl mb-3">🎉</div>
                  <h3 className="text-2xl font-bold text-emerald-400 mb-1" style={hf}>
                    {isHi ? 'उत्तीर्ण!' : 'Mastered!'}
                  </h3>
                  <p className="text-text-secondary text-lg font-mono mb-4">{score}/{quizQuestions.length}</p>

                  {phaseProgress && (
                    <div className="max-w-xs mx-auto mb-6">
                      {lastInPhase && phaseProgress.mastered === phaseProgress.total ? (
                        <div className="text-sm text-gold-light font-semibold mb-2" style={hf}>
                          {isHi ? `चरण ${meta.phase} पूर्ण!` : `Phase ${meta.phase} Complete!`}
                        </div>
                      ) : null}
                      <div className="h-1.5 bg-white/5 rounded-full overflow-hidden mb-1">
                        <motion.div
                          initial={{ width: `${Math.max(0, ((phaseProgress.mastered - 1) / phaseProgress.total) * 100)}%` }}
                          animate={{ width: `${phaseProgress.percent}%` }}
                          transition={{ duration: 0.8, ease: 'easeOut' as const }}
                          className="h-full bg-gradient-to-r from-gold-primary to-gold-light rounded-full"
                        />
                      </div>
                      <p className="text-text-secondary/60 text-xs">
                        {isHi
                          ? `चरण ${meta.phase} — ${phaseProgress.mastered}/${phaseProgress.total} पूर्ण`
                          : `Phase ${meta.phase} — ${phaseProgress.mastered}/${phaseProgress.total} mastered`}
                      </p>
                    </div>
                  )}

                  <div className="flex flex-col items-center gap-3">
                    {nextRef ? (
                      <Link href={`/learn/modules/${nextRef.id}`}
                        className="inline-flex items-center gap-2 px-8 py-3 rounded-xl bg-emerald-500/15 border-2 border-emerald-500/30 text-emerald-300 font-bold text-sm hover:bg-emerald-500/25 transition-colors"
                        style={hf}>
                        {isHi ? 'अगला:' : 'Next:'} {nextRef.id.replace('-', '.')} {isHi ? nextRef.title.hi : nextRef.title.en} →
                      </Link>
                    ) : (
                      <div className="px-8 py-3 rounded-xl bg-gold-primary/15 border-2 border-gold-primary/30 text-gold-light font-bold text-sm" style={hf}>
                        {isHi ? 'सम्पूर्ण पाठ्यक्रम पूर्ण!' : 'Entire Curriculum Complete!'}
                      </div>
                    )}

                    {/* Challenge a Friend */}
                    <button
                      onClick={() => setShowChallenge(c => !c)}
                      className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-indigo-500/15 border border-indigo-500/25 text-indigo-300 text-sm font-medium hover:bg-indigo-500/25 hover:border-indigo-500/40 transition-colors"
                    >
                      <Users className="w-4 h-4" />
                      {isHi ? 'मित्र को चुनौती दें' : 'Challenge a Friend'}
                    </button>

                    <AnimatePresence>
                      {showChallenge && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="overflow-hidden w-full max-w-sm"
                        >
                          <div className="pt-2">
                            <ShareButton
                              title={isHi ? meta.title.hi : meta.title.en}
                              text={
                                isHi
                                  ? `\u092E\u0948\u0902\u0928\u0947 '${meta.title.hi}' \u092E\u0947\u0902 ${score}/${quizQuestions.length} \u0938\u094D\u0915\u094B\u0930 \u0915\u093F\u092F\u093E \u2014 \u0915\u094D\u092F\u093E \u0906\u092A \u092E\u0941\u091D\u0938\u0947 \u092C\u0947\u0939\u0924\u0930 \u0915\u0930 \u0938\u0915\u0924\u0947 \u0939\u0948\u0902? \u{1F9E0}`
                                  : `I scored ${score}/${quizQuestions.length} on '${meta.title.en}' \u2014 Can you beat me? \u{1F9E0}`
                              }
                              url={`https://dekhopanchang.com/learn/modules/${meta.id}`}
                              locale={locale}
                              variant="inline"
                              className="justify-center"
                            />
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    <div className="flex gap-3">
                      <button onClick={() => { setShowQuiz(false); setCurrentPage(0); }}
                        className="px-4 py-2 rounded-xl border border-gold-primary/15 text-text-secondary text-xs hover:text-text-primary transition-colors">
                        {isHi ? 'सामग्री समीक्षा' : 'Review Content'}
                      </button>
                      <Link href="/learn/modules"
                        className="px-4 py-2 rounded-xl border border-gold-primary/15 text-text-secondary text-xs hover:text-text-primary transition-colors">
                        {isHi ? 'सभी मॉड्यूल' : 'All Modules'}
                      </Link>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div className="text-5xl mb-4">📚</div>
                  <h3 className="text-2xl font-bold text-red-400 mb-2" style={hf}>
                    {isHi ? 'पुनः प्रयास करें' : 'Try Again'}
                  </h3>
                  <p className="text-text-secondary text-lg font-mono mb-2">{score}/{quizQuestions.length}</p>
                  <p className="text-text-secondary text-sm mb-6">
                    {isHi
                      ? `उत्तीर्ण के लिए ${passThreshold}/${quizQuestions.length} आवश्यक। सामग्री की समीक्षा करें और पुनः प्रयास करें।`
                      : `Need ${passThreshold}/${quizQuestions.length} to pass. Review the content and try again.`}
                  </p>
                  <div className="flex justify-center gap-3">
                    <button onClick={handleRetry}
                      className="px-6 py-2.5 rounded-xl bg-gold-primary/10 border border-gold-primary/25 text-gold-light text-sm font-medium hover:bg-gold-primary/20 transition-colors">
                      {isHi ? 'पुनः प्रयास' : 'Retry Quiz'}
                    </button>
                    <button onClick={() => { setShowQuiz(false); setCurrentPage(0); }}
                      className="px-6 py-2.5 rounded-xl border border-gold-primary/15 text-text-secondary text-sm hover:text-text-primary transition-colors">
                      {isHi ? 'सामग्री पर वापस' : 'Back to Content'}
                    </button>
                  </div>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Navigation */}
      {!quizComplete && (
        <div className="flex items-center justify-between">
          <button onClick={handlePrevPage}
            disabled={currentPage === 0 && !showQuiz}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm text-text-secondary hover:text-text-primary disabled:opacity-30 disabled:cursor-not-allowed transition-colors">
            <ChevronLeft className="w-4 h-4" />
            {isHi ? 'पिछला' : 'Previous'}
          </button>
          <button onClick={handleNextPage}
            disabled={showQuiz}
            className={`flex items-center gap-1.5 px-5 py-2 rounded-xl text-sm font-medium transition-colors ${
              showQuiz
                ? 'opacity-30 cursor-not-allowed text-text-secondary'
                : isLastContentPage
                ? 'bg-indigo-500/20 text-indigo-300 hover:bg-indigo-500/30'
                : 'bg-gold-primary/10 text-gold-light hover:bg-gold-primary/20'
            }`}>
            {isLastContentPage && !showQuiz ? (isHi ? 'ज्ञान परीक्षा →' : 'Take Quiz →') : (isHi ? 'अगला' : 'Next')}
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}


      {/* Badge unlock toast */}
      <BadgeUnlockToast badges={newBadges} locale={locale} />
    </div>
    </ModuleLocaleContext.Provider>
  );
}
