'use client';

import { useState, useEffect } from 'react';
import { useLocale } from 'next-intl';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { Link } from '@/lib/i18n/navigation';
import { useLearningProgressStore } from '@/stores/learning-progress-store';
import { useAuthStore } from '@/stores/auth-store';
import { PHASE_INFO, getPhaseModules, getModuleRef } from '@/lib/learn/module-sequence';
import ProgressIndicator from './ProgressIndicator';
import type { Locale } from '@/types/panchang';

export default function LearnSidebarMobile() {
  const [open, setOpen] = useState(false);
  const locale = useLocale() as Locale;
  const isHi = locale !== 'en';

  const { user } = useAuthStore();
  const {
    hydrated,
    hydrateFromStorage,
    syncWithSupabase,
    getOverallProgress,
    getPhaseProgress,
    getNextModule,
    getModuleStatus,
  } = useLearningProgressStore();

  // Hydrate from localStorage on mount
  useEffect(() => {
    hydrateFromStorage();
  }, [hydrateFromStorage]);

  // Sync with Supabase when user logs in
  useEffect(() => {
    if (user?.id) {
      syncWithSupabase(user.id);
    }
  }, [user?.id, syncWithSupabase]);

  if (!hydrated) return null;

  const overall = getOverallProgress();
  const nextModuleId = getNextModule();
  const nextModuleRef = nextModuleId ? getModuleRef(nextModuleId) : undefined;

  // Find the current phase (phase of the next module, or last phase if all done)
  const currentPhase = nextModuleRef?.phase ?? PHASE_INFO[PHASE_INFO.length - 1].phase;
  const currentPhaseInfo = PHASE_INFO.find((p) => p.phase === currentPhase) ?? PHASE_INFO[0];
  const phaseLabel = isHi ? currentPhaseInfo.title.hi : currentPhaseInfo.title.en;

  // Pill label: "42% · P1"
  const pillLabel = `${overall.percent}% · P${currentPhase}`;

  return (
    <>
      {/* Floating Pill — mobile only */}
      <button
        onClick={() => setOpen(true)}
        className="lg:hidden fixed bottom-4 left-4 z-40 flex items-center gap-2 px-3 py-1.5 rounded-full bg-gradient-to-br from-[#2d1b69]/90 via-[#1a1040]/95 to-[#0a0e27] border border-gold-primary/25 shadow-lg shadow-gold-primary/10 backdrop-blur-sm text-sm font-medium text-gold-light"
        aria-label="Open learning progress"
      >
        <span className="w-1.5 h-1.5 rounded-full bg-gold-primary shrink-0" />
        {pillLabel}
      </button>

      {/* Bottom Sheet */}
      <AnimatePresence>
        {open && (
          <>
            {/* Backdrop */}
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="lg:hidden fixed inset-0 z-50 bg-black/60"
              onClick={() => setOpen(false)}
            />

            {/* Sheet */}
            <motion.div
              key="sheet"
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="lg:hidden fixed bottom-0 left-0 right-0 z-50 max-h-[80vh] overflow-y-auto rounded-t-2xl bg-gradient-to-br from-[#2d1b69]/95 via-[#1a1040]/98 to-[#0a0e27] border-t border-gold-primary/20"
            >
              {/* Drag handle */}
              <div className="flex justify-center pt-3 pb-1">
                <div className="w-10 h-1 rounded-full bg-gold-primary/20" />
              </div>

              {/* Sticky header */}
              <div className="sticky top-0 z-10 flex items-center justify-between px-5 py-3 bg-[#0a0e27]/95 backdrop-blur-sm border-b border-gold-primary/10">
                <div className="flex items-center gap-3">
                  <span className="text-gold-light font-semibold text-base">
                    {isHi ? 'शिक्षा प्रगति' : 'Learning Progress'}
                  </span>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-gold-primary/15 text-gold-primary font-medium">
                    {overall.percent}%
                  </span>
                </div>
                <button
                  onClick={() => setOpen(false)}
                  className="p-1.5 rounded-full hover:bg-gold-primary/5 transition-colors text-text-secondary"
                  aria-label="Close"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="px-4 py-4 space-y-5">
                {/* Continue card */}
                {nextModuleRef && (
                  <Link
                    href={`/learn/modules/${nextModuleRef.id}`}
                    onClick={() => setOpen(false)}
                    className="block p-4 rounded-xl bg-gold-primary/10 border border-gold-primary/25 hover:bg-gold-primary/15 transition-colors"
                  >
                    <p className="text-xs text-text-secondary mb-1">
                      {isHi ? 'जारी रखें' : 'Continue'}
                    </p>
                    <p className="text-sm font-semibold text-gold-light leading-snug">
                      {isHi ? nextModuleRef.title.hi : nextModuleRef.title.en}
                    </p>
                    <p className="text-xs text-text-secondary mt-1">
                      {isHi
                        ? `चरण ${nextModuleRef.phase} · ${nextModuleRef.topic}`
                        : `Phase ${nextModuleRef.phase} · ${nextModuleRef.topic}`}
                    </p>
                  </Link>
                )}

                {/* Phase list */}
                {PHASE_INFO.map((phaseInfo) => {
                  const phaseProgress = getPhaseProgress(phaseInfo.phase);
                  const modules = getPhaseModules(phaseInfo.phase);
                  const phaseName = isHi ? phaseInfo.title.hi : phaseInfo.title.en;

                  return (
                    <div key={phaseInfo.phase}>
                      {/* Phase header */}
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-semibold text-text-secondary uppercase tracking-wider">
                          {`P${phaseInfo.phase} · `}{phaseName}
                        </span>
                        <span className="text-xs text-text-secondary">
                          {phaseProgress.mastered}/{phaseProgress.total}
                        </span>
                      </div>

                      {/* Progress bar */}
                      <div className="h-1 rounded-full bg-gold-primary/8 mb-3">
                        <div
                          className="h-1 rounded-full bg-gold-primary transition-all duration-500"
                          style={{ width: `${phaseProgress.percent}%` }}
                        />
                      </div>

                      {/* Module links */}
                      <div className="space-y-1">
                        {modules.map((mod) => {
                          const status = getModuleStatus(mod.id);
                          return (
                            <Link
                              key={mod.id}
                              href={`/learn/modules/${mod.id}`}
                              onClick={() => setOpen(false)}
                              className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gold-primary/5 transition-colors group"
                            >
                              <ProgressIndicator status={status} size={14} />
                              <span
                                className={`text-sm leading-snug ${
                                  status === 'mastered'
                                    ? 'text-emerald-400'
                                    : status === 'in_progress'
                                    ? 'text-gold-light'
                                    : 'text-text-secondary group-hover:text-text-primary'
                                }`}
                              >
                                {isHi ? mod.title.hi : mod.title.en}
                              </span>
                            </Link>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
