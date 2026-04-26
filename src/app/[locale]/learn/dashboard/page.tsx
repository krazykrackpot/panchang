'use client';

import { useEffect, useMemo } from 'react';
import { useLocale } from 'next-intl';
import { Link } from '@/lib/i18n/navigation';
import { motion } from 'framer-motion';
import {
  Flame, GraduationCap, BookOpen, Trophy, ArrowRight,
  CheckCircle, Clock, Star, ChevronRight, Sparkles,
} from 'lucide-react';
import { isDevanagariLocale } from '@/lib/utils/locale-fonts';
import { useLearningProgressStore } from '@/stores/learning-progress-store';
import { getLevel, checkBadges, BADGES } from '@/lib/learn/badges';
import {
  MODULE_SEQUENCE, PHASE_INFO, TOTAL_MODULES, getModuleRef,
} from '@/lib/learn/module-sequence';
import { tl } from '@/lib/utils/trilingual';

// ── Labels ─────────────────────────────────────────────────────────────────────

const LABELS = {
  pageTitle: { en: 'My Learning Dashboard', hi: 'मेरा सीखने का डैशबोर्ड', ta: 'என் கற்றல் டாஷ்போர்ட்', bn: 'আমার শেখার ড্যাশবোর্ড' },
  streak: { en: 'Day Streak', hi: 'दिन स्ट्रीक', ta: 'நாள் தொடர்', bn: 'দিন ধারাবাহিক' },
  level: { en: 'Level', hi: 'स्तर', ta: 'நிலை', bn: 'স্তর' },
  completed: { en: 'Completed', hi: 'पूर्ण', ta: 'நிறைவு', bn: 'সম্পূর্ণ' },
  xp: { en: 'XP Earned', hi: 'XP अर्जित', ta: 'XP பெற்றது', bn: 'XP অর্জিত' },
  phase: { en: 'Current Phase', hi: 'वर्तमान चरण', ta: 'நடப்பு கட்டம்', bn: 'বর্তমান পর্যায়' },
  continueLearning: { en: 'Continue Learning', hi: 'सीखना जारी रखें', ta: 'கற்றலைத் தொடரவும்', bn: 'শেখা চালিয়ে যান' },
  allComplete: { en: 'You\'ve mastered the entire curriculum!', hi: 'आपने पूरा पाठ्यक्रम पूरा कर लिया!', ta: 'நீங்கள் முழு பாடத்திட்டத்தையும் தேர்ச்சி பெற்றுவிட்டீர்கள்!', bn: 'আপনি সম্পূর্ণ পাঠ্যক্রম আয়ত্ত করেছেন!' },
  allCompleteSub: { en: 'Congratulations, Pandit! Every module mastered.', hi: 'बधाई, पण्डित! हर मॉड्यूल पूर्ण।', ta: 'வாழ்த்துகள், பண்டிதர்! ஒவ்வொரு தொகுதியும் தேர்ச்சி பெற்றது.', bn: 'অভিনন্দন, পণ্ডিত! প্রতিটি মডিউল আয়ত্ত।' },
  nextModule: { en: 'Next Module', hi: 'अगला मॉड्यूल', ta: 'அடுத்த தொகுதி', bn: 'পরবর্তী মডিউল' },
  phaseProgress: { en: 'Phase Progress', hi: 'चरण प्रगति', ta: 'கட்ட முன்னேற்றம்', bn: 'পর্যায় অগ্রগতি' },
  recentActivity: { en: 'Recent Activity', hi: 'हाल की गतिविधि', ta: 'சமீபத்திய செயல்பாடு', bn: 'সাম্প্রতিক কার্যকলাপ' },
  badges: { en: 'Badges & Achievements', hi: 'बैज एवं उपलब्धियाँ', ta: 'பதக்கங்கள் & சாதனைகள்', bn: 'ব্যাজ ও কৃতিত্ব' },
  earned: { en: 'Earned', hi: 'अर्जित', ta: 'பெற்றது', bn: 'অর্জিত' },
  locked: { en: 'Locked', hi: 'लॉक', ta: 'பூட்டப்பட்டது', bn: 'লক করা' },
  noActivity: { en: 'No modules completed yet. Start learning!', hi: 'अभी तक कोई मॉड्यूल पूर्ण नहीं। सीखना शुरू करें!', ta: 'இன்னும் எந்த தொகுதியும் நிறைவு செய்யப்படவில்லை. கற்றலைத் தொடங்குங்கள்!', bn: 'এখনও কোনো মডিউল সম্পূর্ণ হয়নি। শেখা শুরু করুন!' },
  longestStreak: { en: 'Longest', hi: 'सबसे लंबी', ta: 'நீண்ட', bn: 'দীর্ঘতম' },
  nextLevel: { en: 'modules to next level', hi: 'अगले स्तर तक मॉड्यूल', ta: 'அடுத்த நிலைக்கு தொகுதிகள்', bn: 'পরবর্তী স্তরে মডিউল' },
  mastered: { en: 'Mastered', hi: 'पूर्ण', ta: 'தேர்ச்சி', bn: 'আয়ত্ত' },
  backToLearn: { en: 'Back to Learn', hi: 'सीखने पर वापस', ta: 'கற்றலுக்குத் திரும்பு', bn: 'শেখায় ফিরে যান' },
} as const;

// ── Page ────────────────────────────────────────────────────────────────────────

export default function LearnDashboardPage() {
  const locale = useLocale();
  const isDevanagari = isDevanagariLocale(locale);
  const hf = isDevanagari ? { fontFamily: 'var(--font-devanagari-heading)' } : { fontFamily: 'var(--font-heading)' };
  const bf = isDevanagari ? { fontFamily: 'var(--font-devanagari-body)' } : {};

  const l = (key: keyof typeof LABELS) => tl(LABELS[key], locale);

  const {
    progress, streak, hydrated, hydrateFromStorage,
    getNextModule, getOverallProgress, getPhaseProgress,
  } = useLearningProgressStore();

  useEffect(() => { hydrateFromStorage(); }, [hydrateFromStorage]);

  // ── Computed values ────────────────────────────────────────────────────────

  const overall = getOverallProgress();
  const nextModuleId = getNextModule();
  const nextModuleRef = nextModuleId ? getModuleRef(nextModuleId) : null;

  const levelInfo = useMemo(() => getLevel(overall.mastered), [overall.mastered]);
  const badgeInfo = useMemo(
    () => (hydrated ? checkBadges(progress, streak) : { earned: [], newlyEarned: [] }),
    [hydrated, progress, streak],
  );

  // XP: 10 per mastered module (the store doesn't track XP directly)
  const xp = overall.mastered * 10;

  // Current phase: the phase of the next uncompleted module
  const currentPhaseIdx = nextModuleRef ? nextModuleRef.phase : (PHASE_INFO.length - 1);
  const currentPhase = PHASE_INFO.find(p => p.phase === currentPhaseIdx) ?? PHASE_INFO[0];

  // Recent activity: last 5 completed modules sorted by lastAccessedAt desc
  const recentModules = useMemo(() => {
    return Object.values(progress)
      .filter(p => p.status === 'mastered')
      .sort((a, b) => b.lastAccessedAt.localeCompare(a.lastAccessedAt))
      .slice(0, 5)
      .map(p => ({
        ...p,
        ref: getModuleRef(p.moduleId),
      }));
  }, [progress]);

  if (!hydrated) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-8 h-8 border-2 border-gold-primary/30 border-t-gold-primary rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto">
      {/* Back link */}
      <Link href="/learn" className="inline-flex items-center gap-1.5 text-text-secondary hover:text-gold-light text-sm mb-6 transition-colors">
        <ChevronRight className="w-4 h-4 rotate-180" />
        {l('backToLearn')}
      </Link>

      {/* ── Page Title ──────────────────────────────────────────────────────── */}
      <motion.h1
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-3xl sm:text-4xl font-bold text-gold-gradient mb-8"
        style={hf}
      >
        {l('pageTitle')}
      </motion.h1>

      {/* ── 1. Hero Stats Row ───────────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
        className="grid grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4 mb-8"
      >
        {/* Streak */}
        <StatCard
          icon={<Flame className="w-5 h-5 text-amber-400" />}
          value={streak.streakDays}
          label={l('streak')}
          sub={`${l('longestStreak')}: ${streak.longestStreak}`}
          accent="amber"
        />
        {/* Level */}
        <StatCard
          icon={<GraduationCap className="w-5 h-5 text-violet-400" />}
          value={tl(levelInfo.label, locale)}
          label={l('level')}
          sub={levelInfo.nextLevel ? `${levelInfo.nextLevel.modulesNeeded} ${l('nextLevel')}` : undefined}
          accent="violet"
        />
        {/* Modules completed */}
        <StatCard
          icon={<BookOpen className="w-5 h-5 text-emerald-400" />}
          value={`${overall.mastered}/${TOTAL_MODULES}`}
          label={l('completed')}
          sub={`${overall.percent}%`}
          accent="emerald"
        />
        {/* XP */}
        <StatCard
          icon={<Star className="w-5 h-5 text-gold-primary" />}
          value={xp}
          label={l('xp')}
          accent="gold"
        />
        {/* Current Phase */}
        <StatCard
          icon={<Sparkles className="w-5 h-5 text-cyan-400" />}
          value={`Phase ${currentPhase.phase}`}
          label={tl(currentPhase.title, locale)}
          accent="cyan"
          className="col-span-2 lg:col-span-1"
        />
      </motion.div>

      {/* ── 2. Continue Learning CTA ────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="mb-8"
      >
        {nextModuleRef ? (
          <Link
            href={`/learn/modules/${nextModuleRef.id}` as '/learn'}
            className="group block rounded-2xl bg-gradient-to-r from-gold-primary/15 via-gold-primary/8 to-transparent border border-gold-primary/25 hover:border-gold-primary/50 p-6 sm:p-8 transition-all"
          >
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <p className="text-gold-dark text-xs uppercase tracking-widest font-bold mb-1" style={bf}>
                  {l('nextModule')} &middot; Phase {nextModuleRef.phase}
                </p>
                <h2 className="text-xl sm:text-2xl font-bold text-gold-light" style={hf}>
                  {nextModuleRef.id}: {tl(nextModuleRef.title, locale)}
                </h2>
              </div>
              <div className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gold-primary/20 border border-gold-primary/30 text-gold-light font-bold text-lg group-hover:bg-gold-primary/30 transition-colors shrink-0">
                {l('continueLearning')}
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </Link>
        ) : (
          <div className="rounded-2xl bg-gradient-to-r from-emerald-500/15 via-emerald-500/8 to-transparent border border-emerald-500/25 p-6 sm:p-8 text-center">
            <Trophy className="w-12 h-12 text-emerald-400 mx-auto mb-3" />
            <h2 className="text-2xl font-bold text-emerald-400 mb-2" style={hf}>
              {l('allComplete')}
            </h2>
            <p className="text-text-secondary" style={bf}>{l('allCompleteSub')}</p>
          </div>
        )}
      </motion.div>

      {/* ── 3. Phase Progress Breakdown ─────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="mb-8"
      >
        <h2 className="text-xl font-bold text-gold-light mb-4" style={hf}>{l('phaseProgress')}</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {PHASE_INFO.map((p) => {
            const pp = getPhaseProgress(p.phase);
            return (
              <div
                key={p.phase}
                className="rounded-xl bg-bg-secondary/60 border border-gold-primary/8 p-4"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-text-primary text-sm font-medium" style={bf}>
                    {p.phase}. {tl(p.title, locale)}
                  </span>
                  <span className="text-text-secondary text-xs">
                    {pp.mastered}/{pp.total}
                  </span>
                </div>
                <div className="h-2 rounded-full bg-gold-primary/10 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-emerald-500 transition-all duration-500"
                    style={{ width: `${pp.percent}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </motion.div>

      {/* ── 4. Recent Activity ──────────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="mb-8"
      >
        <h2 className="text-xl font-bold text-gold-light mb-4" style={hf}>{l('recentActivity')}</h2>
        {recentModules.length === 0 ? (
          <div className="rounded-xl bg-bg-secondary/40 border border-gold-primary/8 p-6 text-center">
            <p className="text-text-secondary" style={bf}>{l('noActivity')}</p>
            <Link href="/learn/modules/0-1" className="inline-flex items-center gap-2 mt-3 text-gold-primary hover:text-gold-light transition-colors font-medium">
              {l('continueLearning')} <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        ) : (
          <div className="space-y-2">
            {recentModules.map((m) => (
              <Link
                key={m.moduleId}
                href={`/learn/modules/${m.moduleId}` as '/learn'}
                className="flex items-center gap-3 rounded-xl bg-bg-secondary/40 border border-gold-primary/8 hover:border-gold-primary/20 p-4 transition-colors group"
              >
                <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-text-primary text-sm font-medium truncate" style={bf}>
                    {m.moduleId}: {m.ref ? tl(m.ref.title, locale) : m.moduleId}
                  </p>
                  <p className="text-text-secondary text-xs">
                    {m.quizScore !== null && `Score: ${m.quizScore}/5`}
                    {m.quizScore !== null && m.lastAccessedAt && ' · '}
                    {m.lastAccessedAt && formatDate(m.lastAccessedAt, locale)}
                  </p>
                </div>
                <ChevronRight className="w-4 h-4 text-text-secondary group-hover:text-gold-primary transition-colors shrink-0" />
              </Link>
            ))}
          </div>
        )}
      </motion.div>

      {/* ── 5. Badges & Achievements ────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25 }}
        className="mb-12"
      >
        <h2 className="text-xl font-bold text-gold-light mb-4" style={hf}>{l('badges')}</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {BADGES.map((badge) => {
            const isEarned = badgeInfo.earned.some(b => b.id === badge.id);
            return (
              <div
                key={badge.id}
                className={`rounded-xl border p-4 text-center transition-colors ${
                  isEarned
                    ? 'bg-gold-primary/10 border-gold-primary/25'
                    : 'bg-bg-secondary/30 border-gold-primary/5 opacity-50'
                }`}
              >
                <div className="text-3xl mb-2">{badge.icon}</div>
                <p className="text-sm font-medium text-text-primary truncate" style={bf}>
                  {tl(badge.label, locale)}
                </p>
                <p className="text-xs text-text-secondary mt-0.5">
                  {isEarned ? l('earned') : l('locked')}
                </p>
              </div>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
}

// ── StatCard Component ──────────────────────────────────────────────────────────

function StatCard({
  icon,
  value,
  label,
  sub,
  accent,
  className = '',
}: {
  icon: React.ReactNode;
  value: string | number;
  label: string;
  sub?: string;
  accent: 'amber' | 'violet' | 'emerald' | 'gold' | 'cyan';
  className?: string;
}) {
  const borderColor = {
    amber: 'border-amber-500/20',
    violet: 'border-violet-500/20',
    emerald: 'border-emerald-500/20',
    gold: 'border-gold-primary/20',
    cyan: 'border-cyan-500/20',
  }[accent];

  const bgColor = {
    amber: 'bg-amber-500/5',
    violet: 'bg-violet-500/5',
    emerald: 'bg-emerald-500/5',
    gold: 'bg-gold-primary/5',
    cyan: 'bg-cyan-500/5',
  }[accent];

  return (
    <div className={`rounded-xl border ${borderColor} ${bgColor} p-4 ${className}`}>
      <div className="flex items-center gap-2 mb-2">
        {icon}
        <span className="text-text-secondary text-xs uppercase tracking-wider font-medium">{label}</span>
      </div>
      <p className="text-2xl font-bold text-text-primary">{value}</p>
      {sub && <p className="text-xs text-text-secondary mt-1">{sub}</p>}
    </div>
  );
}

// ── Helpers ─────────────────────────────────────────────────────────────────────

function formatDate(isoStr: string, locale: string): string {
  try {
    const d = new Date(isoStr);
    const loc = locale === 'hi' ? 'hi-IN' : locale === 'ta' ? 'ta-IN' : locale === 'bn' ? 'bn-IN' : 'en-US';
    return d.toLocaleDateString(loc, { month: 'short', day: 'numeric' });
  } catch {
    return isoStr.slice(0, 10);
  }
}
