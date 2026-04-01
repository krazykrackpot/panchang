'use client';

import { useEffect } from 'react';
import { useLocale } from 'next-intl';
import { usePathname } from '@/lib/i18n/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, Trophy, Zap } from 'lucide-react';
import { useLearnProgressStore, ACHIEVEMENTS, PHASE_PAGES, ALL_PAGES } from '@/stores/learn-progress-store';
import type { Locale } from '@/types/panchang';

/**
 * Floating progress bar + mark complete button shown on every learn page
 */
export function LearnProgressBar() {
  const locale = useLocale() as Locale;
  const pathname = usePathname();
  const isHi = locale !== 'en';
  const { markComplete, isCompleted, getOverallProgress, xp, loaded, loadFromStorage } = useLearnProgressStore();

  useEffect(() => { loadFromStorage(); }, [loadFromStorage]);

  if (!loaded) return null;

  const isLearnPage = ALL_PAGES.includes(pathname);
  const pageCompleted = isCompleted(pathname);
  const overall = getOverallProgress();

  return (
    <div className="mb-6">
      {/* Overall progress */}
      <div className="flex items-center gap-3 mb-3">
        <div className="flex-1 h-2 bg-bg-tertiary/50 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-gold-primary to-gold-light rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${overall.percent}%` }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          />
        </div>
        <div className="flex items-center gap-1.5 shrink-0">
          <Zap className="w-3.5 h-3.5 text-gold-primary" />
          <span className="text-gold-light text-xs font-bold font-mono">{xp} XP</span>
        </div>
        <span className="text-text-tertiary text-[10px] shrink-0">{overall.completed}/{overall.total}</span>
      </div>

      {/* Mark complete button */}
      {isLearnPage && (
        <AnimatePresence>
          {!pageCompleted ? (
            <motion.button
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              onClick={() => markComplete(pathname)}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gold-primary/10 border border-gold-primary/25 text-gold-light text-sm font-medium hover:bg-gold-primary/20 hover:border-gold-primary/40 transition-all"
            >
              <CheckCircle className="w-4 h-4" />
              {isHi ? 'पाठ पूर्ण चिह्नित करें (+50 XP)' : 'Mark Lesson Complete (+50 XP)'}
            </motion.button>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm font-medium"
            >
              <CheckCircle className="w-4 h-4" />
              {isHi ? 'पूर्ण' : 'Completed'}
            </motion.div>
          )}
        </AnimatePresence>
      )}
    </div>
  );
}

/**
 * Phase progress cards shown on the foundations/landing page
 */
export function PhaseProgressCards() {
  const locale = useLocale() as Locale;
  const isHi = locale !== 'en';
  const { getPhaseProgress, loaded, loadFromStorage } = useLearnProgressStore();

  useEffect(() => { loadFromStorage(); }, [loadFromStorage]);

  if (!loaded) return null;

  const phaseInfo = [
    { key: '1', name: { en: 'The Sky', hi: 'आकाश' }, icon: '🌌', color: 'from-blue-500/10 to-indigo-500/10' },
    { key: '2', name: { en: 'Pancha Anga', hi: 'पंच अंग' }, icon: '🌙', color: 'from-amber-500/10 to-orange-500/10' },
    { key: '2.5', name: { en: 'Time', hi: 'काल' }, icon: '⏳', color: 'from-violet-500/10 to-purple-500/10' },
    { key: '3', name: { en: 'The Chart', hi: 'कुण्डली' }, icon: '📊', color: 'from-emerald-500/10 to-teal-500/10' },
    { key: '4', name: { en: 'Applied', hi: 'प्रायोगिक' }, icon: '🔮', color: 'from-pink-500/10 to-rose-500/10' },
    { key: '5', name: { en: 'Classical', hi: 'शास्त्रीय' }, icon: '📚', color: 'from-gold-primary/10 to-amber-500/10' },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
      {phaseInfo.map((phase) => {
        const progress = getPhaseProgress(phase.key);
        const isComplete = progress.percent === 100;
        return (
          <motion.div key={phase.key} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            className={`glass-card rounded-xl p-3 text-center bg-gradient-to-br ${phase.color} ${isComplete ? 'ring-1 ring-emerald-500/30' : ''}`}>
            <div className="text-2xl mb-1">{phase.icon}</div>
            <div className="text-gold-light text-xs font-bold mb-1">{isHi ? phase.name.hi : phase.name.en}</div>
            <div className="h-1.5 bg-bg-tertiary/50 rounded-full overflow-hidden mb-1">
              <div className="h-full bg-gold-primary rounded-full transition-all duration-500" style={{ width: `${progress.percent}%` }} />
            </div>
            <div className={`text-[10px] font-mono ${isComplete ? 'text-emerald-400' : 'text-text-tertiary'}`}>
              {progress.completed}/{progress.total}
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}

/**
 * Achievement badges display
 */
export function AchievementBadges() {
  const locale = useLocale() as Locale;
  const isHi = locale !== 'en';
  const { unlockedAchievements, loaded, loadFromStorage } = useLearnProgressStore();

  useEffect(() => { loadFromStorage(); }, [loadFromStorage]);

  if (!loaded || unlockedAchievements.length === 0) return null;

  return (
    <div className="glass-card rounded-2xl p-4 border border-gold-primary/15">
      <div className="flex items-center gap-2 mb-3">
        <Trophy className="w-4 h-4 text-gold-primary" />
        <span className="text-gold-dark text-[10px] uppercase tracking-widest font-bold">
          {isHi ? 'उपलब्धियाँ' : 'Achievements'}
        </span>
        <span className="text-text-tertiary text-[10px]">{unlockedAchievements.length}/{ACHIEVEMENTS.length}</span>
      </div>
      <div className="flex flex-wrap gap-2">
        {ACHIEVEMENTS.map((ach) => {
          const unlocked = unlockedAchievements.includes(ach.id);
          return (
            <div key={ach.id} title={isHi ? ach.description.hi : ach.description.en}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs transition-all ${
                unlocked
                  ? 'bg-gold-primary/10 border border-gold-primary/25 text-gold-light'
                  : 'bg-bg-tertiary/30 border border-gold-primary/5 text-text-tertiary opacity-40'
              }`}>
              <span className="text-base">{ach.icon}</span>
              <span className="font-medium">{isHi ? ach.name.hi : ach.name.en}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
