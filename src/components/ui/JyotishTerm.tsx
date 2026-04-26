'use client';

import Link from 'next/link';
import { useLocale } from 'next-intl';
import React, {
  type ReactNode,
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
} from 'react';

import { getGlossaryEntry } from '@/lib/constants/glossary';
import { tl } from '@/lib/utils/trilingual';

const SEEN_STORAGE_KEY = 'jyotish-terms-seen';

interface JyotishTermProps {
  /** Glossary key: "nakshatra", "tithi", "dasha", etc. */
  term: string;
  /** Override display text (default: term's display name in current locale) */
  children?: ReactNode;
  /** Only show tooltip on first encounter; renders plain text after */
  showOnce?: boolean;
}

function getSeenTerms(): Set<string> {
  try {
    const raw = localStorage.getItem(SEEN_STORAGE_KEY);
    if (!raw) return new Set();
    return new Set(JSON.parse(raw) as string[]);
  } catch {
    // localStorage unavailable (SSR guard, private browsing, etc.) — degrade gracefully
    return new Set();
  }
}

function markTermSeen(term: string): void {
  try {
    const seen = getSeenTerms();
    seen.add(term);
    localStorage.setItem(SEEN_STORAGE_KEY, JSON.stringify([...seen]));
  } catch {
    // localStorage write failed — ignore, progressive enhancement
  }
}

export default function JyotishTerm({ term, children, showOnce = false }: JyotishTermProps) {
  const locale = useLocale();
  const entry = getGlossaryEntry(term);
  const tooltipId = useId();

  const [open, setOpen] = useState(false);
  const [flipAbove, setFlipAbove] = useState(false);
  const [alreadySeen, setAlreadySeen] = useState(false);

  const triggerRef = useRef<HTMLSpanElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);

  // Check localStorage once on mount (client only)
  useEffect(() => {
    if (showOnce) {
      setAlreadySeen(getSeenTerms().has(term));
    }
  }, [showOnce, term]);

  // Close on outside click / focus-out
  useEffect(() => {
    if (!open) return;

    function handlePointerDown(e: PointerEvent) {
      if (
        triggerRef.current &&
        !triggerRef.current.contains(e.target as Node) &&
        tooltipRef.current &&
        !tooltipRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    }

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpen(false);
    }

    document.addEventListener('pointerdown', handlePointerDown);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('pointerdown', handlePointerDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [open]);

  // Position check: flip tooltip above if < 200px below trigger
  const checkFlip = useCallback(() => {
    if (!triggerRef.current) return;
    const rect = triggerRef.current.getBoundingClientRect();
    const spaceBelow = window.innerHeight - rect.bottom;
    setFlipAbove(spaceBelow < 200);
  }, []);

  function openTooltip() {
    checkFlip();
    setOpen(true);
    if (showOnce) {
      markTermSeen(term);
      setAlreadySeen(true);
    }
  }

  function toggleTooltip() {
    if (open) {
      setOpen(false);
    } else {
      openTooltip();
    }
  }

  // If entry not found, render plain text — no crash
  if (!entry) {
    return <>{children ?? term}</>;
  }

  // showOnce: after first view, render plain text
  if (showOnce && alreadySeen && !open) {
    return <>{children ?? tl(entry.term, locale)}</>;
  }

  const displayText = children ?? tl(entry.term, locale);

  return (
    <span className="relative inline">
      {/* Trigger */}
      <span
        ref={triggerRef}
        role="button"
        tabIndex={0}
        aria-describedby={open ? tooltipId : undefined}
        className="cursor-help border-b border-dotted border-gold-primary/40 transition-colors duration-150 hover:border-gold-primary/70 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gold-primary/60 rounded-[1px]"
        onClick={toggleTooltip}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            toggleTooltip();
          }
        }}
        onMouseEnter={openTooltip}
        onMouseLeave={() => setOpen(false)}
        onFocus={openTooltip}
        onBlur={(e) => {
          // Only close if focus moves outside both trigger and tooltip
          if (
            !tooltipRef.current?.contains(e.relatedTarget as Node) &&
            !triggerRef.current?.contains(e.relatedTarget as Node)
          ) {
            setOpen(false);
          }
        }}
      >
        {displayText}
      </span>

      {/* Tooltip */}
      {open && (
        <div
          ref={tooltipRef}
          id={tooltipId}
          role="tooltip"
          onMouseEnter={() => setOpen(true)}
          onMouseLeave={() => setOpen(false)}
          className={[
            'absolute z-50 w-72',
            'bg-bg-secondary border border-gold-primary/20 rounded-lg shadow-lg shadow-black/40',
            'p-3 text-left',
            // Horizontal center on trigger
            'left-1/2 -translate-x-1/2',
            // Position above or below
            flipAbove
              ? 'bottom-full mb-2'
              : 'top-full mt-2',
          ].join(' ')}
        >
          {/* Arrow indicator */}
          <div
            className={[
              'absolute left-1/2 -translate-x-1/2 w-2 h-2 rotate-45 bg-bg-secondary border-gold-primary/20',
              flipAbove
                ? 'bottom-[-5px] border-r border-b'
                : 'top-[-5px] border-l border-t',
            ].join(' ')}
          />

          {/* Term name */}
          <p className="text-gold-light font-semibold text-sm leading-snug mb-0.5">
            {tl(entry.term, locale)}
          </p>

          {/* Pronunciation */}
          <p className="text-text-secondary text-xs mb-2 italic">
            /{entry.pronunciation}/
          </p>

          {/* Short definition */}
          <p className="text-text-primary text-xs leading-relaxed mb-2">
            {entry.shortDef}
          </p>

          {/* Western equivalent */}
          {entry.westernEquivalent && (
            <p className="text-text-secondary text-xs mb-2">
              <span className="text-gold-primary/70">Western:</span>{' '}
              {entry.westernEquivalent}
            </p>
          )}

          {/* Glossary link */}
          <Link
            href={`/glossary#${term}`}
            className="text-gold-primary text-xs hover:text-gold-light transition-colors duration-150 inline-flex items-center gap-1"
            tabIndex={0}
            onClick={() => setOpen(false)}
          >
            Full glossary entry →
          </Link>
        </div>
      )}
    </span>
  );
}
