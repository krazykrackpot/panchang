'use client';

import { useState, useCallback } from 'react';
import type { MantraDetail } from '@/lib/constants/puja-vidhi/types';
import type { Locale } from '@/types/panchang';

interface MantraCardProps {
  mantra: MantraDetail;
  displayMode?: 'devanagari' | 'iast' | 'both';
  showMeaning?: boolean;
  showJapaCount?: boolean;
  locale: string;
}

export default function MantraCard({
  mantra,
  displayMode = 'both',
  showMeaning = false,
  showJapaCount = false,
  locale,
}: MantraCardProps) {
  const [copied, setCopied] = useState(false);
  const loc = locale as Locale;
  const isDevanagari = loc !== 'en';

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(mantra.devanagari);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      // Fallback: do nothing on clipboard failure
    }
  }, [mantra.devanagari]);

  return (
    <div className="relative rounded-xl border border-gold-primary/15 bg-gradient-to-br from-gold-primary/[0.03] to-transparent p-5 group">
      {/* Copy button */}
      <button
        onClick={handleCopy}
        className="absolute top-3 right-3 w-8 h-8 rounded-lg bg-gold-primary/10 hover:bg-gold-primary/20 border border-gold-primary/15 flex items-center justify-center transition-colors"
        aria-label="Copy mantra"
      >
        {copied ? (
          <svg className="w-4 h-4 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        ) : (
          <svg className="w-4 h-4 text-gold-primary/60 group-hover:text-gold-primary/90 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <rect x="9" y="9" width="13" height="13" rx="2" />
            <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" />
          </svg>
        )}
      </button>
      {/* Copied tooltip */}
      {copied && (
        <span className="absolute top-2 right-12 text-[10px] bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded border border-emerald-500/20 whitespace-nowrap">
          Copied!
        </span>
      )}

      {/* Mantra name */}
      <h3
        className="text-gold-light font-semibold text-sm mb-3 pr-10"
        style={isDevanagari ? { fontFamily: 'var(--font-devanagari-heading)' } : undefined}
      >
        {mantra.name[loc]}
        {loc !== 'en' && (
          <span className="text-text-secondary/40 text-xs ml-2 font-normal">
            ({mantra.name.en})
          </span>
        )}
      </h3>

      {/* Mantra text */}
      <div className="space-y-2">
        {(displayMode === 'devanagari' || displayMode === 'both') && (
          <p
            className="text-gold-light text-xl leading-relaxed whitespace-pre-line"
            style={{ fontFamily: 'var(--font-devanagari-heading)' }}
          >
            {mantra.devanagari}
          </p>
        )}

        {displayMode === 'both' && (
          <div className="border-t border-gold-primary/8 my-2" />
        )}

        {(displayMode === 'iast' || displayMode === 'both') && (
          <p className="text-text-secondary/70 text-sm italic leading-relaxed whitespace-pre-line">
            {mantra.iast}
          </p>
        )}
      </div>

      {/* Meaning */}
      {showMeaning && (
        <p
          className="text-text-secondary/60 text-xs mt-3 leading-relaxed"
          style={isDevanagari ? { fontFamily: 'var(--font-devanagari-body)' } : undefined}
        >
          {mantra.meaning[loc]}
        </p>
      )}

      {/* Japa count badge + usage */}
      <div className="flex items-center flex-wrap gap-2 mt-3">
        {showJapaCount && mantra.japaCount && (
          <span className="inline-flex items-center text-[11px] px-2.5 py-1 rounded-full bg-gold-primary/15 text-gold-primary font-semibold border border-gold-primary/20">
            {mantra.japaCount}x
          </span>
        )}
        <span
          className="text-text-secondary/40 text-[11px]"
          style={isDevanagari ? { fontFamily: 'var(--font-devanagari-body)' } : undefined}
        >
          {mantra.usage[loc]}
        </span>
      </div>
    </div>
  );
}
