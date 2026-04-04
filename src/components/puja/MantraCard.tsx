'use client';

import { useState, useCallback, useEffect } from 'react';
import type { MantraDetail } from '@/lib/constants/puja-vidhi/types';
import type { Locale } from '@/types/panchang';

/** Shared hook for Web Speech API mantra pronunciation */
export function useMantraPronounce() {
  const [speaking, setSpeaking] = useState(false);
  const [voicesLoaded, setVoicesLoaded] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    const loadVoices = () => setVoicesLoaded(window.speechSynthesis.getVoices().length > 0);
    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;
  }, []);

  const pronounce = useCallback((text: string) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;

    window.speechSynthesis.cancel();

    if (speaking) {
      setSpeaking(false);
      return;
    }

    const utterance = new SpeechSynthesisUtterance(text);

    const voices = window.speechSynthesis.getVoices();
    const hindiVoice =
      voices.find((v) => v.lang.startsWith('hi')) ||
      voices.find((v) => v.lang.startsWith('sa')) ||
      voices[0];
    if (hindiVoice) utterance.voice = hindiVoice;

    utterance.rate = 0.8;
    utterance.pitch = 0.9;
    utterance.onstart = () => setSpeaking(true);
    utterance.onend = () => setSpeaking(false);
    utterance.onerror = () => setSpeaking(false);

    window.speechSynthesis.speak(utterance);
  }, [speaking]);

  const supported = typeof window !== 'undefined' && 'speechSynthesis' in window;

  return { speaking, voicesLoaded, pronounce, supported };
}

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
  const { speaking, pronounce, supported } = useMantraPronounce();

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(mantra.devanagari);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      // Fallback: do nothing on clipboard failure
    }
  }, [mantra.devanagari]);

  const handlePronounce = useCallback(() => {
    pronounce(mantra.iast);
  }, [pronounce, mantra.iast]);

  return (
    <div className="relative rounded-xl border border-gold-primary/15 bg-gradient-to-br from-gold-primary/[0.03] to-transparent p-5 group">
      {/* Action buttons */}
      <div className="absolute top-3 right-3 flex items-center gap-1.5">
        {/* Pronounce button */}
        <button
          onClick={handlePronounce}
          disabled={!supported}
          className="w-8 h-8 rounded-lg bg-gold-primary/10 hover:bg-gold-primary/20 border border-gold-primary/15 flex items-center justify-center transition-colors disabled:opacity-30 disabled:pointer-events-none"
          aria-label={speaking ? 'Stop pronunciation' : 'Pronounce mantra'}
        >
          {speaking ? (
            <svg className="w-4 h-4 text-gold-primary animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M11 5L6 9H2v6h4l5 4V5z" />
              <line x1="23" y1="9" x2="17" y2="15" strokeLinecap="round" strokeLinejoin="round" />
              <line x1="17" y1="9" x2="23" y2="15" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          ) : (
            <svg className="w-4 h-4 text-gold-primary/60 group-hover:text-gold-primary/90 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M11 5L6 9H2v6h4l5 4V5z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.07 4.93a10 10 0 010 14.14M15.54 8.46a5 5 0 010 7.08" />
            </svg>
          )}
        </button>
        {/* Copy button */}
        <button
          onClick={handleCopy}
          className="w-8 h-8 rounded-lg bg-gold-primary/10 hover:bg-gold-primary/20 border border-gold-primary/15 flex items-center justify-center transition-colors"
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
      </div>
      {/* Copied tooltip */}
      {copied && (
        <span className="absolute top-2 right-20 text-[10px] bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded border border-emerald-500/20 whitespace-nowrap">
          Copied!
        </span>
      )}

      {/* Mantra name */}
      <h3
        className="text-gold-light font-semibold text-sm mb-3 pr-20"
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
            className="text-amber-300 text-xl leading-relaxed whitespace-pre-line font-bold"
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
