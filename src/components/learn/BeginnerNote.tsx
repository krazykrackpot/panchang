'use client';

import { useState, useCallback } from 'react';
import { Info } from 'lucide-react';

interface BeginnerNoteProps {
  term: string;
  explanation: string;
}

export default function BeginnerNote({ term, explanation }: BeginnerNoteProps) {
  const [expanded, setExpanded] = useState(false);

  const toggle = useCallback(() => {
    setExpanded(prev => !prev);
  }, []);

  return (
    <span className="inline">
      <button
        type="button"
        onClick={toggle}
        className="inline-flex items-center gap-1 text-gold-light border-b border-dotted border-gold-primary/40 hover:border-gold-primary/70 transition-colors cursor-help"
        aria-expanded={expanded}
        aria-label={`Explain: ${term}`}
      >
        <span>{term}</span>
        <Info className="w-3 h-3 text-gold-primary/50 inline" />
      </button>
      {expanded && (
        <span className="inline text-xs text-text-secondary italic ml-1">
          ({explanation})
        </span>
      )}
    </span>
  );
}
