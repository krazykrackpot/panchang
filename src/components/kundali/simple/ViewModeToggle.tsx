'use client';

interface Props {
  mode: 'simple' | 'expert';
  onToggle: (mode: 'simple' | 'expert') => void;
}

export default function ViewModeToggle({ mode, onToggle }: Props) {
  return (
    <div className="inline-flex rounded-full border border-gold-primary/30 overflow-hidden text-xs">
      <button
        onClick={() => onToggle('simple')}
        className={`px-4 py-1.5 font-semibold transition-colors ${
          mode === 'simple'
            ? 'bg-gold-primary/20 text-gold-light'
            : 'text-text-secondary hover:text-gold-light'
        }`}
      >
        Simple
      </button>
      <button
        onClick={() => onToggle('expert')}
        className={`px-4 py-1.5 font-semibold transition-colors ${
          mode === 'expert'
            ? 'bg-gold-primary/20 text-gold-light'
            : 'text-text-secondary hover:text-gold-light'
        }`}
      >
        Expert
      </button>
    </div>
  );
}
