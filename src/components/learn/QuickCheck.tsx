'use client';

import { useState } from 'react';

interface QuickCheckProps {
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  locale?: string;
}

export default function QuickCheck({ question, options, correctIndex, explanation }: QuickCheckProps) {
  const [selected, setSelected] = useState<number | null>(null);
  const isCorrect = selected === correctIndex;

  return (
    <div className="my-6 rounded-xl border border-sky-500/20 bg-sky-500/5 p-4">
      <p className="text-sky-300 font-medium text-sm mb-3">Quick Check</p>
      <p className="text-text-primary text-sm mb-3">{question}</p>
      <div className="space-y-2">
        {options.map((opt, i) => (
          <button
            key={i}
            onClick={() => setSelected(i)}
            disabled={selected !== null}
            className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all ${
              selected === null ? 'bg-bg-secondary/50 hover:bg-sky-500/10 border border-transparent hover:border-sky-500/20 text-text-secondary' :
              i === correctIndex ? 'bg-emerald-500/15 border border-emerald-500/30 text-emerald-300' :
              i === selected ? 'bg-red-500/15 border border-red-500/30 text-red-300' :
              'bg-bg-secondary/30 border border-transparent text-text-secondary/50'
            }`}
          >
            {opt}
          </button>
        ))}
      </div>
      {selected !== null && (
        <p className={`mt-3 text-xs ${isCorrect ? 'text-emerald-400' : 'text-amber-400'}`}>
          {isCorrect ? '\u2713 Correct! ' : '\u2717 Not quite. '}{explanation}
        </p>
      )}
    </div>
  );
}
