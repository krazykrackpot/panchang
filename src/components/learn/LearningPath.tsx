'use client';

import { useMemo } from 'react';
import { useLocale } from 'next-intl';
import { Link } from '@/lib/i18n/navigation';
import { tl } from '@/lib/utils/trilingual';
import { CheckCircle, ArrowRight, Lock } from 'lucide-react';
import { PHASE_INFO, getPhaseModules } from '@/lib/learn/module-sequence';
import { useLearningProgressStore } from '@/stores/learning-progress-store';
import { isDevanagariLocale } from '@/lib/utils/locale-fonts';

/**
 * LearningPath — vertical milestone visualization of the 12-phase Jyotish curriculum.
 *
 * Each phase is a node on a connected gold line. Completion status is read from
 * the learning progress store (localStorage + Supabase sync).
 *
 * Phase statuses:
 *   - completed: all modules mastered
 *   - in-progress: at least one module started but not all mastered
 *   - locked: no modules started AND the previous phase is not completed
 *     (Phase 0 is never locked)
 */
export default function LearningPath() {
  const locale = useLocale();
  const isDevanagari = isDevanagariLocale(locale);
  const hf = isDevanagari
    ? { fontFamily: 'var(--font-devanagari-heading)' }
    : { fontFamily: 'var(--font-heading)' };
  const bf = isDevanagari ? { fontFamily: 'var(--font-devanagari-body)' } : {};

  const { progress, hydrated, getPhaseProgress } = useLearningProgressStore();

  const phases = useMemo(() => {
    return PHASE_INFO.map((pi) => {
      const { mastered, total, percent } = getPhaseProgress(pi.phase);
      const modules = getPhaseModules(pi.phase);

      // Find the first uncompleted module in this phase for the "Continue" link
      const firstUncompleted = modules.find(
        (m) => progress[m.id]?.status !== 'mastered'
      );
      const continueModuleId = firstUncompleted?.id ?? modules[0]?.id ?? '0-1';

      let status: 'completed' | 'in-progress' | 'not-started' = 'not-started';
      if (mastered === total && total > 0) {
        status = 'completed';
      } else if (mastered > 0 || modules.some((m) => progress[m.id])) {
        status = 'in-progress';
      }

      return {
        ...pi,
        mastered,
        total,
        percent,
        status,
        continueModuleId,
      };
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [progress, hydrated]);

  // Determine which phases are "locked" — a phase is locked if it's not-started
  // AND the previous phase is also not completed. Phase 0 is never locked.
  const phasesWithLock = phases.map((p, i) => {
    if (i === 0) return { ...p, locked: false };
    if (p.status !== 'not-started') return { ...p, locked: false };
    // Locked if previous phase isn't completed
    const prev = phases[i - 1];
    const locked = prev.status !== 'completed';
    return { ...p, locked };
  });

  // Find the "current" phase — the first one that's in-progress, or the first not-started unlocked
  const currentPhaseIdx = phasesWithLock.findIndex(
    (p) => p.status === 'in-progress'
  );
  const firstUnlockedIdx = currentPhaseIdx >= 0
    ? currentPhaseIdx
    : phasesWithLock.findIndex((p) => !p.locked && p.status === 'not-started');
  const activeIdx = firstUnlockedIdx >= 0 ? firstUnlockedIdx : 0;

  const moduleLabel = (count: number) => {
    if (locale === 'hi') return `${count} मॉड्यूल`;
    if (locale === 'ta') return `${count} தொகுதிகள்`;
    if (locale === 'bn') return `${count} মডিউল`;
    return `${count} modules`;
  };

  const continueLabel =
    locale === 'hi' ? 'जारी रखें' :
    locale === 'ta' ? 'தொடரவும்' :
    locale === 'bn' ? 'চালিয়ে যান' :
    'Continue';

  const completedLabel =
    locale === 'hi' ? 'पूर्ण' :
    locale === 'ta' ? 'முடிந்தது' :
    locale === 'bn' ? 'সম্পন্ন' :
    'Completed';

  return (
    <div className="relative max-w-2xl mx-auto">
      {/* Vertical gold line connecting all nodes */}
      <div
        className="absolute left-5 sm:left-7 top-0 bottom-0 w-px"
        style={{
          background: 'linear-gradient(to bottom, #d4a853 0%, #8a6d2b 70%, #8a6d2b33 100%)',
        }}
      />

      <div className="space-y-1">
        {phasesWithLock.map((phase, i) => {
          const isCurrent = i === activeIdx && phase.status !== 'completed';
          const isCompleted = phase.status === 'completed';
          const isLocked = phase.locked;
          const isInProgress = phase.status === 'in-progress';

          return (
            <div key={phase.phase} className="relative flex items-start gap-4 sm:gap-5">
              {/* ── Node dot ── */}
              <div className="relative z-10 flex-shrink-0 mt-1">
                {isCompleted ? (
                  <div className="w-10 h-10 sm:w-14 sm:h-14 rounded-full bg-emerald-500/20 border-2 border-emerald-500/60 flex items-center justify-center">
                    <CheckCircle className="w-5 h-5 sm:w-7 sm:h-7 text-emerald-400" />
                  </div>
                ) : isCurrent ? (
                  <div className="w-10 h-10 sm:w-14 sm:h-14 rounded-full bg-gold-primary/20 border-2 border-gold-primary/70 flex items-center justify-center animate-pulse">
                    <span className="w-3 h-3 sm:w-4 sm:h-4 rounded-full bg-gold-primary" />
                  </div>
                ) : isLocked ? (
                  <div className="w-10 h-10 sm:w-14 sm:h-14 rounded-full bg-white/3 border-2 border-white/10 flex items-center justify-center">
                    <Lock className="w-4 h-4 sm:w-5 sm:h-5 text-text-secondary/40" />
                  </div>
                ) : (
                  <div className="w-10 h-10 sm:w-14 sm:h-14 rounded-full bg-white/5 border-2 border-white/15 flex items-center justify-center">
                    <span className="text-text-secondary/50 text-xs sm:text-sm font-bold">{phase.phase}</span>
                  </div>
                )}
              </div>

              {/* ── Content card ── */}
              <div
                className={`flex-1 rounded-xl border p-4 sm:p-5 mb-2 transition-all duration-200 ${
                  isCurrent
                    ? 'bg-gradient-to-r from-gold-primary/8 via-gold-primary/4 to-transparent border-gold-primary/30 shadow-lg shadow-gold-primary/5'
                    : isCompleted
                    ? 'bg-emerald-500/5 border-emerald-500/15'
                    : isLocked
                    ? 'bg-white/2 border-white/5 opacity-50'
                    : 'bg-white/3 border-white/8 hover:border-white/15'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                  <div className="min-w-0">
                    {/* Phase number tag */}
                    <span
                      className={`text-[10px] sm:text-xs uppercase tracking-widest font-bold ${
                        isCompleted
                          ? 'text-emerald-400/70'
                          : isCurrent
                          ? 'text-gold-primary/80'
                          : 'text-text-secondary/40'
                      }`}
                    >
                      {locale === 'hi' ? `चरण ${phase.phase}` :
                       locale === 'ta' ? `நிலை ${phase.phase}` :
                       locale === 'bn' ? `পর্যায় ${phase.phase}` :
                       `Phase ${phase.phase}`}
                    </span>

                    {/* Phase title */}
                    <h3
                      className={`text-base sm:text-lg font-bold leading-tight ${
                        isCompleted
                          ? 'text-emerald-300'
                          : isCurrent
                          ? 'text-gold-light'
                          : isLocked
                          ? 'text-text-secondary/50'
                          : 'text-text-primary/70'
                      }`}
                      style={hf}
                    >
                      {tl(phase.title, locale)}
                    </h3>

                    {/* Module count + progress */}
                    <div className="flex items-center gap-3 mt-1">
                      <span
                        className={`text-xs ${
                          isCompleted ? 'text-emerald-400/60' : 'text-text-secondary/60'
                        }`}
                        style={bf}
                      >
                        {moduleLabel(phase.total)}
                      </span>

                      {/* Mini progress bar for in-progress phases */}
                      {isInProgress && phase.total > 0 && (
                        <div className="flex items-center gap-2">
                          <div className="w-16 sm:w-24 h-1.5 rounded-full bg-white/10 overflow-hidden">
                            <div
                              className="h-full rounded-full bg-gold-primary/70 transition-all duration-500"
                              style={{ width: `${phase.percent}%` }}
                            />
                          </div>
                          <span className="text-[10px] text-gold-primary/60 font-medium">
                            {phase.mastered}/{phase.total}
                          </span>
                        </div>
                      )}

                      {isCompleted && (
                        <span className="text-[10px] sm:text-xs text-emerald-400/70 font-medium" style={bf}>
                          {completedLabel}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Action button */}
                  <div className="flex-shrink-0">
                    {(isCurrent || isInProgress) && (
                      <Link
                        href={`/learn/modules/${phase.continueModuleId}`}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gold-primary/15 border border-gold-primary/30 text-gold-light text-sm font-bold hover:bg-gold-primary/25 hover:border-gold-primary/50 transition-all"
                      >
                        {continueLabel}
                        <ArrowRight className="w-4 h-4" />
                      </Link>
                    )}
                    {isCompleted && (
                      <Link
                        href={`/learn/modules/${phase.continueModuleId}`}
                        className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-emerald-400/60 text-xs hover:text-emerald-400 hover:bg-emerald-500/10 transition-all"
                      >
                        {locale === 'hi' ? 'पुनः देखें' :
                         locale === 'ta' ? 'மீண்டும் பார்' :
                         locale === 'bn' ? 'আবার দেখুন' :
                         'Review'}
                        <ArrowRight className="w-3 h-3" />
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
