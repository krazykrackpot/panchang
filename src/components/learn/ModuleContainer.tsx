'use client';

import { useState, useEffect, type ReactNode } from 'react';
import { useLocale } from 'next-intl';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, CheckCircle, XCircle, BookOpen, HelpCircle } from 'lucide-react';
import type { Locale } from '@/types/panchang';

// ─── Module Sequence (ordered) ───────────────────────────────────────────────

export const MODULE_SEQUENCE = [
  '1-1','1-2','1-3','2-1','2-2','2-3','2-4','3-1','3-2','3-3',
  '4-1','4-2','4-3','5-1','5-2','5-3','6-1','6-2','6-3','6-4',
  '7-1','7-2','7-3','8-1','9-1','9-2','9-3','9-4','10-1','10-2',
  '10-3','11-1','11-2','11-3','12-1','12-2','12-3','13-1','13-2',
  '13-3','14-1','14-2','14-3','15-1','15-2','15-3','15-4','16-1','16-2','16-3',
  '17-1','17-2','17-3','17-4',
];

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

  const passThreshold = Math.ceil(quizQuestions.length * 0.7);
  const passed = score >= passThreshold;

  return (
    <div className="space-y-6">
      {/* Module header */}
      <div className="glass-card rounded-2xl p-5 border border-gold-primary/15 bg-gradient-to-br from-gold-primary/5 to-transparent">
        <div className="flex items-center gap-2 text-gold-dark text-[10px] uppercase tracking-widest font-bold mb-2">
          <BookOpen className="w-3.5 h-3.5" />
          {isHi ? `चरण ${meta.phase} · ${meta.topic}` : `Phase ${meta.phase} · ${meta.topic}`}
        </div>
        <h2 className="text-2xl font-bold text-gold-gradient mb-1" style={hf}>
          {isHi ? `${meta.moduleNumber}  ${meta.title.hi}` : `${meta.moduleNumber}  ${meta.title.en}`}
        </h2>
        <p className="text-text-secondary text-sm">{isHi ? meta.subtitle.hi : meta.subtitle.en}</p>
        <div className="flex items-center gap-4 mt-3 text-text-tertiary text-[10px]">
          <span>~{meta.estimatedMinutes} {isHi ? 'मिनट' : 'min'}</span>
          <span>{totalContentPages} {isHi ? 'पृष्ठ' : 'pages'} + {isHi ? 'ज्ञान परीक्षा' : 'knowledge check'}</span>
        </div>

        {/* Progress bar */}
        <div className="mt-3 flex items-center gap-2">
          <div className="flex-1 h-1.5 bg-bg-tertiary/50 rounded-full overflow-hidden">
            <div className="h-full bg-gold-primary rounded-full transition-all duration-500"
              style={{ width: showQuiz ? '100%' : `${((currentPage + 1) / (totalContentPages + 1)) * 100}%` }} />
          </div>
          <span className="text-text-tertiary text-[10px] font-mono shrink-0">
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
            <div className="glass-card rounded-2xl p-6 border border-indigo-500/20">
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
                        className="p-4 rounded-xl bg-bg-secondary/50 border border-gold-primary/10">
                        <div className="text-gold-dark text-[10px] uppercase tracking-widest font-bold mb-1">
                          {isHi ? 'व्याख्या' : 'Explanation'}
                        </div>
                        <p className="text-text-secondary text-xs leading-relaxed">{isHi ? q.explanation.hi : q.explanation.en}</p>
                        {q.classicalRef && <p className="text-text-tertiary text-[10px] mt-1">{q.classicalRef}</p>}
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
            {/* Results */}
            <div className={`glass-card rounded-2xl p-8 text-center border ${passed ? 'border-emerald-500/30' : 'border-red-500/30'}`}>
              <div className={`text-5xl mb-4`}>{passed ? '🎉' : '📚'}</div>
              <h3 className={`text-2xl font-bold mb-2 ${passed ? 'text-emerald-400' : 'text-red-400'}`} style={hf}>
                {passed
                  ? (isHi ? 'उत्तीर्ण!' : 'Passed!')
                  : (isHi ? 'पुनः प्रयास करें' : 'Try Again')}
              </h3>
              <p className="text-text-secondary text-lg font-mono mb-2">{score}/{quizQuestions.length}</p>
              <p className="text-text-secondary text-sm mb-6">
                {passed
                  ? (isHi ? 'बहुत बढ़िया! आप अगले मॉड्यूल पर आगे बढ़ सकते हैं।' : 'Excellent! You can proceed to the next module.')
                  : (isHi ? `उत्तीर्ण के लिए ${passThreshold}/${quizQuestions.length} आवश्यक। सामग्री की समीक्षा करें और पुनः प्रयास करें।` : `Need ${passThreshold}/${quizQuestions.length} to pass. Review the content and try again.`)}
              </p>
              <div className="flex justify-center gap-3">
                {!passed && (
                  <button onClick={handleRetry}
                    className="px-6 py-2.5 rounded-xl bg-gold-primary/10 border border-gold-primary/25 text-gold-light text-sm font-medium hover:bg-gold-primary/20 transition-colors">
                    {isHi ? 'पुनः प्रयास' : 'Retry Quiz'}
                  </button>
                )}
                <button onClick={() => { setShowQuiz(false); setCurrentPage(0); }}
                  className="px-6 py-2.5 rounded-xl border border-gold-primary/15 text-text-secondary text-sm hover:text-text-primary transition-colors">
                  {isHi ? 'सामग्री पर वापस' : 'Back to Content'}
                </button>
              </div>
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

      {/* Cross-references */}
      {meta.crossRefs && meta.crossRefs.length > 0 && (
        <div className="glass-card rounded-xl p-4 border border-gold-primary/10">
          <div className="text-gold-dark text-[10px] uppercase tracking-widest font-bold mb-2">{isHi ? 'संबंधित मॉड्यूल' : 'Related Modules'}</div>
          <div className="flex flex-wrap gap-2">
            {meta.crossRefs.map((ref, i) => (
              <a key={i} href={ref.href} className="text-xs text-gold-primary/70 hover:text-gold-primary px-2 py-1 rounded-lg bg-gold-primary/5 transition-colors">
                {isHi ? ref.label.hi : ref.label.en}
              </a>
            ))}
          </div>
        </div>
      )}

      {/* ── Module Navigation (Prev / Index / Next) ── */}
      {(() => {
        const currentIdx = MODULE_SEQUENCE.indexOf(meta.moduleNumber.replace('.', '-'));
        const prevMod = currentIdx > 0 ? MODULE_SEQUENCE[currentIdx - 1] : null;
        const nextMod = currentIdx < MODULE_SEQUENCE.length - 1 ? MODULE_SEQUENCE[currentIdx + 1] : null;
        return (
          <div className="flex items-center justify-between mt-6 pt-4 border-t border-gold-primary/10">
            {prevMod ? (
              <a href={`/learn/modules/${prevMod}`}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm text-text-secondary hover:text-gold-light hover:bg-gold-primary/5 transition-colors">
                <ChevronLeft className="w-4 h-4" />
                {isHi ? `मॉड्यूल ${prevMod.replace('-', '.')}` : `Module ${prevMod.replace('-', '.')}`}
              </a>
            ) : <div />}
            <a href="/learn/modules"
              className="px-4 py-2 rounded-xl text-xs text-gold-primary/60 hover:text-gold-primary hover:bg-gold-primary/5 transition-colors">
              {isHi ? 'सभी मॉड्यूल' : 'All Modules'}
            </a>
            {nextMod ? (
              <a href={`/learn/modules/${nextMod}`}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium text-gold-light bg-gold-primary/10 hover:bg-gold-primary/20 transition-colors">
                {isHi ? `मॉड्यूल ${nextMod.replace('-', '.')} →` : `Module ${nextMod.replace('-', '.')} →`}
                <ChevronRight className="w-4 h-4" />
              </a>
            ) : (
              <a href="/learn"
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium text-emerald-400 bg-emerald-500/10 hover:bg-emerald-500/20 transition-colors">
                {isHi ? 'पाठ्यक्रम पूर्ण!' : 'Course Complete!'}
              </a>
            )}
          </div>
        );
      })()}
    </div>
  );
}
