'use client';

import { useState, useEffect, useRef } from 'react';
import { useLocale } from 'next-intl';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, LogIn } from 'lucide-react';
import { Link } from '@/lib/i18n/navigation';
import { useLearningProgressStore } from '@/stores/learning-progress-store';
import { useAuthStore } from '@/stores/auth-store';
import { PHASE_INFO, getPhaseModules, getModuleRef } from '@/lib/learn/module-sequence';
import ProgressIndicator from './ProgressIndicator';
import type { Locale } from '@/types/panchang';

// ── Labels ────────────────────────────────────────────────────────────────────

const LABELS = {
  yourJourney:    { en: 'Your Journey',           hi: 'आपकी यात्रा' },
  modulesOf:      { en: 'modules mastered',        hi: 'मॉड्यूल पूर्ण' },
  continueLearning:{ en: 'Continue Learning',      hi: 'आगे बढ़ें' },
  allMastered:    { en: 'All Mastered!',           hi: 'सब पूर्ण!' },
  allMasteredSub: { en: "You've completed the full curriculum.",  hi: 'आपने पूरा पाठ्यक्रम पूर्ण किया।' },
  signInToSave:   { en: 'Sign in to save progress across devices', hi: 'उपकरणों के पार प्रगति सहेजें' },
  nextUp:         { en: 'Next up',                 hi: 'अगला' },
};

function t(key: keyof typeof LABELS, locale: Locale): string {
  const entry = LABELS[key];
  return locale === 'en' ? entry.en : entry.hi;
}

// ── Phase progress bar ────────────────────────────────────────────────────────

function PhaseProgressBar({ percent }: { percent: number }) {
  return (
    <div className="h-1 w-full rounded-full bg-white/10 overflow-hidden">
      <div
        className="h-full rounded-full transition-all duration-500"
        style={{
          width: `${percent}%`,
          background: percent === 100
            ? 'linear-gradient(90deg, #10b981, #34d399)'
            : 'linear-gradient(90deg, #d4a853, #f0d48a)',
        }}
      />
    </div>
  );
}

// ── Collapsed rail dot ────────────────────────────────────────────────────────

interface PhaseDotProps {
  phase: number;
  label: string;
  mastered: number;
  total: number;
  percent: number;
}

function PhaseDot({ phase, label, mastered, total, percent }: PhaseDotProps) {
  const isComplete   = percent === 100;
  const isInProgress = percent > 0 && percent < 100;

  return (
    <div className="flex flex-col items-center gap-0.5 w-full">
      <div
        className={[
          'w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold transition-all',
          isComplete
            ? 'bg-emerald-500 text-[#0a0e27]'
            : isInProgress
              ? 'border-2 border-gold-primary text-gold-light'
              : 'border border-white/20 text-text-secondary',
        ].join(' ')}
        title={`P${phase}: ${mastered}/${total}`}
      >
        P{phase}
      </div>
      <span className="text-[9px] text-text-secondary leading-none">
        {mastered}/{total}
      </span>
    </div>
  );
}

// ── Overall % circle ──────────────────────────────────────────────────────────

function OverallCircle({ percent }: { percent: number }) {
  const r = 14;
  const circ = 2 * Math.PI * r;
  const dash = (percent / 100) * circ;

  return (
    <div className="flex items-center justify-center w-9 h-9 relative">
      <svg width="36" height="36" className="-rotate-90" viewBox="0 0 36 36">
        <circle cx="18" cy="18" r={r} fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="3" />
        <circle
          cx="18" cy="18" r={r}
          fill="none"
          stroke="#d4a853"
          strokeWidth="3"
          strokeDasharray={`${dash} ${circ}`}
          strokeLinecap="round"
          className="transition-all duration-500"
        />
      </svg>
      <span
        className="absolute text-[9px] font-bold text-gold-light leading-none"
        style={{ transform: 'rotate(0deg)' }}
      >
        {percent}%
      </span>
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────

export default function LearnSidebar() {
  const locale = useLocale() as Locale;
  const isHi = locale !== 'en';

  const {
    sidebarExpanded,
    toggleSidebar,
    hydrated,
    hydrateFromStorage,
    syncWithSupabase,
    getOverallProgress,
    getPhaseProgress,
    getNextModule,
    getModuleStatus,
    progress,
  } = useLearningProgressStore();

  const { user } = useAuthStore();

  // Track which phase panels are expanded in the sidebar
  const nextModuleId = hydrated ? getNextModule() : null;
  const nextModuleRef = nextModuleId ? getModuleRef(nextModuleId) : null;
  const autoPhase = nextModuleRef?.phase ?? 0;

  const [expandedPhases, setExpandedPhases] = useState<Set<number>>(new Set([autoPhase]));

  // Hydrate on mount
  useEffect(() => {
    hydrateFromStorage();
  }, [hydrateFromStorage]);

  // Auto-expand phase containing next module when hydrated
  const prevNextId = useRef<string | null>(null);
  useEffect(() => {
    if (!hydrated) return;
    const nid = getNextModule();
    if (nid === prevNextId.current) return;
    prevNextId.current = nid;
    const ref = nid ? getModuleRef(nid) : null;
    if (ref !== undefined && ref !== null) {
      setExpandedPhases(prev => new Set([...prev, ref.phase]));
    }
  }, [hydrated, getNextModule]);

  // Sync with Supabase when user logs in
  const prevUserId = useRef<string | undefined>(undefined);
  useEffect(() => {
    if (!hydrated) return;
    if (user?.id && user.id !== prevUserId.current) {
      syncWithSupabase(user.id);
    }
    prevUserId.current = user?.id;
  }, [user?.id, hydrated, syncWithSupabase]);

  if (!hydrated) return null;

  const overall = getOverallProgress();
  const allMastered = overall.mastered === overall.total && overall.total > 0;
  const hasProgress = overall.mastered > 0 || Object.keys(progress).length > 0;

  function togglePhase(phase: number) {
    setExpandedPhases(prev => {
      const next = new Set(prev);
      if (next.has(phase)) {
        next.delete(phase);
      } else {
        next.add(phase);
      }
      return next;
    });
  }

  // ── Collapsed rail ──────────────────────────────────────────────────────────
  if (!sidebarExpanded) {
    return (
      <aside
        className="flex flex-col items-center gap-3 py-4 px-1 bg-bg-secondary rounded-xl border border-white/8 transition-all duration-200"
        style={{ width: 64, minHeight: 320 }}
      >
        {/* Overall % circle */}
        <OverallCircle percent={overall.percent} />

        <div className="w-8 h-px bg-white/10" />

        {/* Phase dots */}
        <div className="flex flex-col items-center gap-2 w-full px-1">
          {PHASE_INFO.map(info => {
            const pp = getPhaseProgress(info.phase);
            return (
              <PhaseDot
                key={info.phase}
                phase={info.phase}
                label={isHi ? info.title.hi : info.title.en}
                mastered={pp.mastered}
                total={pp.total}
                percent={pp.percent}
              />
            );
          })}
        </div>

        {/* Spacer + expand chevron */}
        <div className="flex-1" />
        <button
          onClick={toggleSidebar}
          className="w-8 h-8 rounded-full border border-white/15 flex items-center justify-center text-text-secondary hover:text-gold-light hover:border-gold-primary/40 transition-colors"
          aria-label="Expand sidebar"
        >
          <ChevronRight size={14} />
        </button>
      </aside>
    );
  }

  // ── Expanded panel ──────────────────────────────────────────────────────────
  return (
    <aside
      className="flex flex-col bg-bg-secondary rounded-xl border border-white/8 overflow-hidden transition-all duration-200"
      style={{ width: 260, minHeight: 320 }}
    >
      {/* ── Header ── */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-white/8">
        <h2
          className="text-sm font-semibold text-gold-light tracking-wide"
          style={{ fontFamily: isHi ? 'var(--font-devanagari-heading)' : 'var(--font-heading)' }}
        >
          {t('yourJourney', locale)}
        </h2>
        <button
          onClick={toggleSidebar}
          className="w-7 h-7 rounded-full flex items-center justify-center text-text-secondary hover:text-gold-light transition-colors"
          aria-label="Collapse sidebar"
        >
          <ChevronLeft size={14} />
        </button>
      </div>

      {/* ── Overall progress ── */}
      <div className="px-4 pt-4 pb-3 border-b border-white/8">
        <div className="flex items-end gap-2">
          <span className="text-3xl font-bold text-gold-light leading-none">
            {overall.percent}%
          </span>
          <span className="text-xs text-text-secondary pb-0.5">
            {overall.mastered}/{overall.total} {t('modulesOf', locale)}
          </span>
        </div>
        <div className="mt-2">
          <PhaseProgressBar percent={overall.percent} />
        </div>
      </div>

      {/* ── Continue card or completion card ── */}
      {allMastered ? (
        <div className="mx-3 mt-3 p-3 rounded-lg border border-emerald-500/30 bg-emerald-500/8">
          <p className="text-xs font-semibold text-emerald-400">
            {t('allMastered', locale)}
          </p>
          <p className="text-[11px] text-text-secondary mt-0.5">
            {t('allMasteredSub', locale)}
          </p>
        </div>
      ) : nextModuleId && nextModuleRef ? (
        <div className="mx-3 mt-3">
          <Link
            href={`/learn/modules/${nextModuleId}`}
            className="block p-3 rounded-lg border border-emerald-500/30 bg-emerald-500/8 hover:bg-emerald-500/15 hover:border-emerald-500/50 transition-colors group"
          >
            <p className="text-[10px] font-medium text-emerald-400 uppercase tracking-widest mb-1">
              {t('continueLearning', locale)}
            </p>
            <p className="text-xs font-semibold text-text-primary group-hover:text-white transition-colors leading-snug">
              {isHi ? nextModuleRef.title.hi : nextModuleRef.title.en}
            </p>
            <p className="text-[10px] text-text-secondary mt-0.5">
              {t('nextUp', locale)} · {nextModuleRef.topic}
            </p>
          </Link>
        </div>
      ) : null}

      {/* ── Phase list ── */}
      <nav className="flex-1 overflow-y-auto py-3 space-y-0.5 px-2" aria-label="Learning phases">
        {PHASE_INFO.map(info => {
          const pp = getPhaseProgress(info.phase);
          const phaseModules = getPhaseModules(info.phase);
          const isExpanded = expandedPhases.has(info.phase);
          const phaseLabel = isHi ? info.title.hi : info.title.en;

          return (
            <div key={info.phase}>
              {/* Phase header row */}
              <button
                onClick={() => togglePhase(info.phase)}
                className="w-full flex items-center gap-2 px-2 py-2 rounded-lg hover:bg-white/5 transition-colors group text-left"
                aria-expanded={isExpanded}
              >
                {/* Phase completion indicator */}
                <div
                  className={[
                    'w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-bold shrink-0',
                    pp.percent === 100
                      ? 'bg-emerald-500 text-[#0a0e27]'
                      : pp.percent > 0
                        ? 'border-2 border-gold-primary text-gold-primary'
                        : 'border border-white/20 text-text-secondary',
                  ].join(' ')}
                >
                  {info.phase}
                </div>

                {/* Phase name + fraction */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1">
                    <span
                      className="text-xs font-medium text-text-primary group-hover:text-white transition-colors truncate"
                      style={{ fontFamily: isHi ? 'var(--font-devanagari-body)' : undefined }}
                    >
                      {phaseLabel}
                    </span>
                    <span className="text-[10px] text-text-secondary shrink-0">
                      {pp.mastered}/{pp.total}
                    </span>
                  </div>
                  <div className="mt-1">
                    <PhaseProgressBar percent={pp.percent} />
                  </div>
                </div>

                {/* Chevron */}
                <ChevronRight
                  size={12}
                  className={[
                    'shrink-0 text-text-secondary transition-transform duration-200',
                    isExpanded ? 'rotate-90' : '',
                  ].join(' ')}
                />
              </button>

              {/* Module list for this phase */}
              <AnimatePresence initial={false}>
                {isExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2, ease: 'easeInOut' }}
                    className="overflow-hidden"
                  >
                    <ul className="pl-7 pr-1 pb-1 space-y-0.5">
                      {phaseModules.map(mod => {
                        const status = getModuleStatus(mod.id);
                        const isNext = mod.id === nextModuleId;
                        const modTitle = isHi ? mod.title.hi : mod.title.en;

                        return (
                          <li key={mod.id}>
                            <Link
                              href={`/learn/modules/${mod.id}`}
                              className={[
                                'flex items-center gap-2 px-2 py-1.5 rounded-md text-xs transition-colors group/mod',
                                isNext
                                  ? 'bg-gold-primary/10 text-gold-light hover:bg-gold-primary/20'
                                  : status === 'mastered'
                                    ? 'text-emerald-400 hover:bg-white/5'
                                    : 'text-text-secondary hover:text-text-primary hover:bg-white/5',
                              ].join(' ')}
                            >
                              <ProgressIndicator status={status} size={12} />
                              <span
                                className="leading-snug"
                                style={{ fontFamily: isHi ? 'var(--font-devanagari-body)' : undefined }}
                              >
                                {modTitle}
                              </span>
                            </Link>
                          </li>
                        );
                      })}
                    </ul>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </nav>

      {/* ── Footer: sign in prompt ── */}
      {!user && hasProgress && (
        <div className="px-3 pb-3 pt-2 border-t border-white/8">
          <div className="flex items-center gap-2 p-2.5 rounded-lg bg-white/4 border border-white/8">
            <LogIn size={13} className="text-gold-primary shrink-0" />
            <p
              className="text-[11px] text-text-secondary leading-snug"
              style={{ fontFamily: isHi ? 'var(--font-devanagari-body)' : undefined }}
            >
              {t('signInToSave', locale)}
            </p>
          </div>
        </div>
      )}
    </aside>
  );
}
