'use client';

import { useMemo, useEffect } from 'react';
import { useLocale } from 'next-intl';
import { Link } from '@/lib/i18n/navigation';
import { tl } from '@/lib/utils/trilingual';
import { CheckCircle, ArrowRight } from 'lucide-react';
import { PHASE_INFO, getPhaseModules } from '@/lib/learn/module-sequence';
import { useLearningProgressStore } from '@/stores/learning-progress-store';
import { isDevanagariLocale, pickByLocale } from '@/lib/utils/locale-fonts';

/**
 * LearningPath  –  vertical milestone visualization of the 12-phase Jyotish curriculum.
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

  const { progress, hydrated, hydrateFromStorage, getPhaseProgress, getModuleStatus } = useLearningProgressStore();

  // Defensive self-hydration — in case parent didn't hydrate first
  useEffect(() => {
    if (!hydrated) hydrateFromStorage();
  }, [hydrated, hydrateFromStorage]);

  const phases = useMemo(() => {
    return PHASE_INFO.map((pi) => {
      const { mastered, total, percent } = getPhaseProgress(pi.phase);
      const modules = getPhaseModules(pi.phase);

      // Find the first uncompleted module in this phase for the "Continue" link
      const firstUncompleted = modules.find(
        (m) => getModuleStatus(m.id) !== 'mastered'
      );
      const continueModule = firstUncompleted ?? modules[0];
      const continueModuleId = continueModule?.id ?? '0-1';
      // Standalone pages have href (/learn/grahas), module pages use /learn/modules/X-Y
      const continueHref = continueModule?.href ?? `/learn/modules/${continueModuleId}`;

      let status: 'completed' | 'in-progress' | 'not-started' = 'not-started';
      if (mastered === total && total > 0) {
        status = 'completed';
      } else if (mastered > 0 || modules.some((m) => getModuleStatus(m.id) !== 'not_started')) {
        status = 'in-progress';
      }

      return {
        ...pi,
        mastered,
        total,
        percent,
        status,
        continueModuleId,
        continueHref,
      };
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [progress, hydrated]);

  // All phases are always unlocked  –  users can explore any topic freely.
  // Progress tracking still works (completion badges, progress bars) but
  // nothing is gated behind sequential completion.
  const phasesWithLock = phases.map((p) => ({ ...p, locked: false }));

  // Find the "current" phase  –  the first one that's in-progress, or the first not-started unlocked
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
    pickByLocale({ en: 'Continue', hi: 'जारी रखें', ta: 'தொடரவும்', bn: 'চালিয়ে যান' }, locale);

  const completedLabel =
    pickByLocale({ en: 'Completed', hi: 'पूर्ण', ta: 'முடிந்தது', bn: 'সম্পন্ন' }, locale);

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
          const isInProgress = phase.status === 'in-progress';

          // Tier labels at phase boundaries to break up the long list
          const TIER_BREAKS: Record<number, { en: string; hi: string; ta: string; bn: string }> = {
            0: { en: 'Foundations', hi: 'आधार', ta: 'அடிப்படை', bn: 'ভিত্তি' },
            3: { en: 'Chart Reading', hi: 'कुण्डली पठन', ta: 'சார்ட் வாசிப்பு', bn: 'চার্ট পাঠ' },
            6: { en: 'Advanced Systems', hi: 'उन्नत पद्धतियाँ', ta: 'மேம்பட்ட முறைகள்', bn: 'উন্নত পদ্ধতি' },
            10: { en: 'Mastery', hi: 'दक्षता', ta: 'தேர்ச்சி', bn: 'দক্ষতা' },
          };
          const tier = TIER_BREAKS[phase.phase];

          return (
            <div key={phase.phase}>
              {tier && (
                <div className={`flex items-center gap-3 ${i > 0 ? 'mt-6 mb-3' : 'mb-3'} ml-14 sm:ml-[4.5rem]`}>
                  <div className="h-px flex-1 max-w-16 bg-gradient-to-r from-gold-primary/25 to-transparent" />
                  <span className="text-gold-dark text-[10px] uppercase tracking-[3px] font-bold">
                    {pickByLocale({ en: tier.en, hi: tier.hi, ta: tier.ta, bn: tier.bn }, locale)}
                  </span>
                  <div className="h-px flex-1 bg-gradient-to-r from-transparent via-gold-primary/15 to-transparent" />
                </div>
              )}
            <div className="relative flex items-start gap-4 sm:gap-5">
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
                    : 'bg-white/3 border-white/8 hover:border-white/15 hover:border-gold-primary/20'
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
                      {pickByLocale({ en: `Phase ${phase.phase}`, hi: `चरण ${phase.phase}`, ta: `நிலை ${phase.phase}`, bn: `পর্যায় ${phase.phase}` }, locale)}
                    </span>

                    {/* Phase title */}
                    <h3
                      className={`text-base sm:text-lg font-bold leading-tight ${
                        isCompleted
                          ? 'text-emerald-300'
                          : isCurrent
                          ? 'text-gold-light'
                          : 'text-text-primary/70'
                      }`}
                      style={hf}
                    >
                      {tl(phase.title, locale)}
                    </h3>
                    {phase.subtitle && (
                      <p className="text-xs text-text-secondary/50 mt-0.5">{phase.subtitle}</p>
                    )}

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
                              suppressHydrationWarning
                            />
                          </div>
                          <span className="text-[10px] text-gold-primary/60 font-medium" suppressHydrationWarning>
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

                  {/* Action button  –  always visible, every phase is accessible */}
                  <div className="flex-shrink-0">
                    <Link
                      href={phase.continueHref as any}
                      className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all ${
                        isCompleted
                          ? 'text-emerald-400/70 hover:text-emerald-400 hover:bg-emerald-500/10'
                          : isCurrent || isInProgress
                          ? 'bg-gold-primary/15 border border-gold-primary/30 text-gold-light hover:bg-gold-primary/25 hover:border-gold-primary/50'
                          : 'bg-white/5 border border-white/10 text-text-secondary hover:text-gold-light hover:border-gold-primary/30 hover:bg-gold-primary/10'
                      }`}
                    >
                      {isCompleted
                        ? (pickByLocale({ en: 'Review', hi: 'पुनः देखें', ta: 'மீண்டும் பார்', bn: 'আবার দেখুন' }, locale))
                        : isInProgress
                        ? continueLabel
                        : (pickByLocale({ en: 'Start', hi: 'शुरू करें', ta: 'தொடங்கு', bn: 'শুরু করুন' }, locale))}
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
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
