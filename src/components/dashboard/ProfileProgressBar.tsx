'use client';

import { motion } from 'framer-motion';
import { User, Calendar, Clock, MapPin, CheckCircle } from 'lucide-react';
import { tl } from '@/lib/utils/trilingual';
import { isDevanagariLocale } from '@/lib/utils/locale-fonts';
import { Link } from '@/lib/i18n/navigation';

interface ProfileProgressBarProps {
  hasName: boolean;
  hasDob: boolean;
  hasTime: boolean;
  hasPlace: boolean;
  locale: string;
}

export default function ProfileProgressBar({
  hasName, hasDob, hasTime, hasPlace, locale,
}: ProfileProgressBarProps) {
  const isHi = isDevanagariLocale(locale);
  const hf = isHi ? { fontFamily: 'var(--font-devanagari-heading)' } : { fontFamily: 'var(--font-heading)' };

  const steps = [
    { done: hasName, icon: User, label: isHi ? 'नाम' : 'Name' },
    { done: hasDob, icon: Calendar, label: isHi ? 'जन्म तिथि' : 'Birth Date' },
    { done: hasTime, icon: Clock, label: isHi ? 'जन्म समय' : 'Birth Time' },
    { done: hasPlace, icon: MapPin, label: isHi ? 'जन्म स्थान' : 'Birth Place' },
  ];

  const completed = steps.filter(s => s.done).length;
  const percent = Math.round((completed / steps.length) * 100);

  if (percent === 100) return null;

  const nextStep = steps.find(s => !s.done);

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/20 rounded-2xl p-5"
    >
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-gold-light text-sm font-bold" style={hf}>
          {isHi ? 'प्रोफ़ाइल पूर्णता' : 'Profile Completion'}
        </h3>
        <span className="text-gold-primary text-lg font-black">{percent}%</span>
      </div>

      {/* Progress bar */}
      <div className="h-2 bg-white/[0.06] rounded-full overflow-hidden mb-4">
        <motion.div
          className="h-full rounded-full bg-gradient-to-r from-gold-dark to-gold-primary"
          initial={{ width: 0 }}
          animate={{ width: `${percent}%` }}
          transition={{ type: 'spring', stiffness: 100, damping: 20 }}
        />
      </div>

      {/* Step indicators */}
      <div className="flex justify-between mb-4">
        {steps.map((step, i) => {
          const Icon = step.done ? CheckCircle : step.icon;
          return (
            <div key={i} className="flex flex-col items-center gap-1">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                step.done
                  ? 'bg-emerald-500/20 text-emerald-400'
                  : 'bg-white/[0.06] text-text-secondary/50'
              }`}>
                <Icon className="w-4 h-4" />
              </div>
              <span className={`text-[10px] ${step.done ? 'text-emerald-400' : 'text-text-secondary/50'}`}>
                {step.label}
              </span>
            </div>
          );
        })}
      </div>

      {/* Next step CTA */}
      {nextStep && (
        <Link
          href="/settings"
          className="block w-full py-2.5 text-center bg-gold-primary/10 hover:bg-gold-primary/20 border border-gold-primary/20 rounded-xl text-gold-light text-sm font-medium transition-colors"
        >
          {isHi
            ? `${nextStep.label} जोड़ें → अपना आदर्शरूप अनलॉक करें`
            : `Add ${nextStep.label} → Unlock Your Archetype`}
        </Link>
      )}
    </motion.div>
  );
}
