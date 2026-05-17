'use client';

import { Sparkles, ScrollText } from 'lucide-react';

interface Props {
  mode: 'simple' | 'expert';
  locale?: string;
  onToggle: (mode: 'simple' | 'expert') => void;
}

export default function ViewModeToggle({ mode, locale, onToggle }: Props) {
  const isHi = locale === 'hi' || locale === 'sa';
  return (
    <div className="inline-flex rounded-xl border border-gold-primary/40 overflow-hidden bg-bg-secondary/40 backdrop-blur-sm">
      <button
        onClick={() => onToggle('simple')}
        className={`flex items-center gap-2 px-5 py-2.5 text-sm font-semibold transition-all duration-200 ${
          mode === 'simple'
            ? 'bg-gold-primary/20 text-gold-light border-r border-gold-primary/30 shadow-inner shadow-gold-primary/10'
            : 'text-text-secondary hover:text-gold-light hover:bg-gold-primary/5 border-r border-gold-primary/15'
        }`}
      >
        <Sparkles className="w-4 h-4" />
        {isHi ? 'सरल' : 'Simple'}
      </button>
      <button
        onClick={() => onToggle('expert')}
        className={`flex items-center gap-2 px-5 py-2.5 text-sm font-semibold transition-all duration-200 ${
          mode === 'expert'
            ? 'bg-gold-primary/20 text-gold-light shadow-inner shadow-gold-primary/10'
            : 'text-text-secondary hover:text-gold-light hover:bg-gold-primary/5'
        }`}
      >
        <ScrollText className="w-4 h-4" />
        {isHi ? 'विशेषज्ञ' : 'Expert'}
      </button>
    </div>
  );
}
