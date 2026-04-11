'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Check, Share2, Printer } from 'lucide-react';
import type { SamagriItem } from '@/lib/constants/puja-vidhi/types';
import type { Locale } from '@/types/panchang';

/* ── Trilingual labels ─────────────────────────────────────── */

type CategoryKey = NonNullable<SamagriItem['category']> | 'uncategorized';

const CATEGORY_LABELS: Record<CategoryKey, Record<Locale, string>> = {
  flowers:       { en: 'Flowers & Leaves',    hi: 'पुष्प एवं पत्र',      sa: 'पुष्पाणि पत्राणि च' },
  food:          { en: 'Food & Offerings',     hi: 'खाद्य एवं नैवेद्य',    sa: 'भोज्यं नैवेद्यं च' },
  puja_items:    { en: 'Puja Items',           hi: 'पूजा सामग्री',         sa: 'पूजाद्रव्याणि' },
  clothing:      { en: 'Clothing & Cloth',     hi: 'वस्त्र',              sa: 'वस्त्राणि' },
  vessels:       { en: 'Vessels & Utensils',   hi: 'बर्तन',               sa: 'पात्राणि' },
  other:         { en: 'Other Items',          hi: 'अन्य सामग्री',        sa: 'अन्यद्रव्याणि' },
  uncategorized: { en: 'Materials',            hi: 'सामग्री',             sa: 'द्रव्याणि' },
};

const CATEGORY_ORDER: CategoryKey[] = [
  'puja_items', 'flowers', 'food', 'clothing', 'vessels', 'other', 'uncategorized',
];

const UI_LABELS = {
  ready:       { en: 'items ready',   hi: 'तैयार',       sa: 'सज्जानि' },
  optional:    { en: 'Optional',      hi: 'वैकल्पिक',    sa: 'वैकल्पिकम्' },
  substitute:  { en: 'Substitute:',   hi: 'विकल्प:',     sa: 'विकल्पः:' },
  prep:        { en: 'Prep:',         hi: 'तैयारी:',     sa: 'सज्जा:' },
  share:       { en: 'Share',         hi: 'साझा',        sa: 'प्रेषणम्' },
  print:       { en: 'Print',         hi: 'प्रिंट',       sa: 'मुद्रणम्' },
  copied:      { en: 'Copied!',       hi: 'कॉपी हुआ!',   sa: 'प्रतिलिपितम्!' },
};

/* ── Props ─────────────────────────────────────────────────── */

interface SamagriListProps {
  items: SamagriItem[];
  slug: string;
  locale: Locale;
}

/* ── Component ─────────────────────────────────────────────── */

export default function SamagriList({ items, slug, locale }: SamagriListProps) {
  const isDevanagari = locale !== 'en' && String(locale) !== 'ta';
  const bodyFont = isDevanagari ? 'var(--font-devanagari-body)' : undefined;

  /* ── localStorage persistence ────────────────────────────── */

  const storageKey = `puja-samagri-${slug}-${new Date().getFullYear()}`;

  const [checked, setChecked] = useState<boolean[]>(() => {
    if (typeof window === 'undefined') return new Array(items.length).fill(false);
    try {
      const raw = localStorage.getItem(storageKey);
      if (raw) {
        const parsed = JSON.parse(raw) as boolean[];
        if (Array.isArray(parsed) && parsed.length === items.length) return parsed;
      }
    } catch { /* ignore */ }
    return new Array(items.length).fill(false);
  });

  useEffect(() => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(checked));
    } catch { /* quota exceeded — ignore */ }
  }, [checked, storageKey]);

  const toggle = useCallback((idx: number) => {
    setChecked(prev => {
      const next = [...prev];
      next[idx] = !next[idx];
      return next;
    });
  }, []);

  const checkedCount = checked.filter(Boolean).length;
  const progressPct = items.length > 0 ? (checkedCount / items.length) * 100 : 0;

  /* ── Group items by category ─────────────────────────────── */

  const grouped = useMemo(() => {
    const map = new Map<CategoryKey, { item: SamagriItem; globalIdx: number }[]>();
    items.forEach((item, idx) => {
      const key: CategoryKey = item.category ?? 'uncategorized';
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push({ item, globalIdx: idx });
    });
    // Sort by defined order
    const sorted: { key: CategoryKey; entries: { item: SamagriItem; globalIdx: number }[] }[] = [];
    for (const key of CATEGORY_ORDER) {
      const entries = map.get(key);
      if (entries && entries.length > 0) sorted.push({ key, entries });
    }
    return sorted;
  }, [items]);

  /* ── Share / Print ───────────────────────────────────────── */

  const [showCopied, setShowCopied] = useState(false);

  const handleShare = useCallback(async () => {
    const text = items
      .map((it, i) => `${checked[i] ? '[x]' : '[ ]'} ${it.name[locale]}${it.quantity ? ` (${it.quantity})` : ''}`)
      .join('\n');

    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share({ title: `Puja Samagri - ${slug}`, text });
        return;
      } catch { /* user cancelled or not supported */ }
    }
    // Fallback: clipboard
    try {
      await navigator.clipboard.writeText(text);
      setShowCopied(true);
      setTimeout(() => setShowCopied(false), 1800);
    } catch { /* ignore */ }
  }, [items, checked, locale, slug]);

  const handlePrint = useCallback(() => {
    window.print();
  }, []);

  /* ── Render ──────────────────────────────────────────────── */

  return (
    <div className="space-y-6">
      {/* ── Header: progress + actions ─────────────────────── */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        {/* Progress */}
        <div className="flex-1 min-w-[180px]">
          <div className="flex items-baseline gap-2 mb-2">
            <span className="text-2xl font-black bg-gradient-to-r from-gold-light via-gold-primary to-gold-dark bg-clip-text text-transparent">
              {checkedCount} / {items.length}
            </span>
            <span
              className="text-sm text-text-secondary/75"
              style={bodyFont ? { fontFamily: bodyFont } : undefined}
            >
              {UI_LABELS.ready[locale]}
            </span>
          </div>
          {/* Progress bar */}
          <div className="h-2 rounded-full bg-white/5 overflow-hidden">
            <motion.div
              className="h-full rounded-full bg-gradient-to-r from-gold-light via-gold-primary to-gold-dark"
              initial={{ width: 0 }}
              animate={{ width: `${progressPct}%` }}
              transition={{ duration: 0.4, ease: 'easeOut' as const }}
            />
          </div>
        </div>

        {/* Share + Print */}
        <div className="flex items-center gap-2 print:hidden relative">
          <button
            onClick={handleShare}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-gold-primary/10 hover:bg-gold-primary/20 border border-gold-primary/15 text-gold-primary/80 hover:text-gold-primary transition-colors"
            aria-label={UI_LABELS.share[locale]}
          >
            <Share2 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{UI_LABELS.share[locale]}</span>
          </button>
          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-gold-primary/10 hover:bg-gold-primary/20 border border-gold-primary/15 text-gold-primary/80 hover:text-gold-primary transition-colors"
            aria-label={UI_LABELS.print[locale]}
          >
            <Printer className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{UI_LABELS.print[locale]}</span>
          </button>
          {/* Copied toast */}
          {showCopied && (
            <span className="absolute -bottom-7 right-0 text-xs bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded border border-emerald-500/20 whitespace-nowrap">
              {UI_LABELS.copied[locale]}
            </span>
          )}
        </div>
      </div>

      {/* ── Grouped items ──────────────────────────────────── */}
      <div className="space-y-8">
        {grouped.map(({ key, entries }) => (
          <section key={key}>
            {/* Category header */}
            <h3
              className="text-xs font-bold text-text-secondary/65 uppercase tracking-wider mb-3"
              style={bodyFont ? { fontFamily: bodyFont } : undefined}
            >
              {CATEGORY_LABELS[key][locale]}
            </h3>

            {/* Items grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {entries.map(({ item, globalIdx }) => {
                const isChecked = checked[globalIdx];
                return (
                  <button
                    key={globalIdx}
                    type="button"
                    onClick={() => toggle(globalIdx)}
                    className={`group relative w-full text-left rounded-xl border p-4 transition-all duration-200 ${
                      isChecked
                        ? 'bg-emerald-500/10 border-emerald-500/20'
                        : 'bg-gold-primary/[0.02] border-gold-primary/8 hover:border-gold-primary/20 hover:bg-gold-primary/[0.05]'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      {/* Checkbox */}
                      <div
                        className={`mt-0.5 flex-shrink-0 w-5 h-5 rounded-md border-2 flex items-center justify-center transition-colors ${
                          isChecked
                            ? 'bg-emerald-500 border-emerald-500'
                            : 'border-gold-primary/30 group-hover:border-gold-primary/50'
                        }`}
                      >
                        {isChecked && <Check className="w-3.5 h-3.5 text-white" strokeWidth={3} />}
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0 space-y-1">
                        {/* Name row */}
                        <div className="flex items-center gap-2 flex-wrap">
                          <span
                            className={`font-semibold text-sm leading-snug ${
                              isChecked ? 'line-through text-text-secondary/65' : 'text-gold-light'
                            }`}
                            style={bodyFont ? { fontFamily: bodyFont } : undefined}
                          >
                            {item.name[locale]}
                          </span>
                          {item.essential === false && (
                            <span className="text-xs px-1.5 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20 font-medium">
                              {UI_LABELS.optional[locale]}
                            </span>
                          )}
                          {item.quantity && (
                            <span className={`text-xs ${isChecked ? 'text-text-secondary/55' : 'text-text-secondary/70'}`}>
                              ({item.quantity})
                            </span>
                          )}
                        </div>

                        {/* Note */}
                        {item.note && (
                          <p
                            className={`text-xs leading-relaxed ${isChecked ? 'text-text-secondary/50' : 'text-text-secondary/70'}`}
                            style={bodyFont ? { fontFamily: bodyFont } : undefined}
                          >
                            {item.note[locale]}
                          </p>
                        )}

                        {/* Prep note */}
                        {item.prepNote && (
                          <p
                            className={`text-xs leading-relaxed ${isChecked ? 'text-blue-400/25' : 'text-blue-400/70'}`}
                            style={bodyFont ? { fontFamily: bodyFont } : undefined}
                          >
                            <span className="font-semibold">{UI_LABELS.prep[locale]}</span>{' '}
                            {item.prepNote[locale]}
                          </p>
                        )}

                        {/* Substitutions */}
                        {item.substitutions && item.substitutions.length > 0 && (
                          <div className="pl-2 border-l-2 border-gold-primary/15 mt-1.5 space-y-1">
                            {item.substitutions.map((sub, si) => (
                              <p
                                key={si}
                                className={`text-xs ${isChecked ? 'text-text-secondary/50' : 'text-text-secondary/70'}`}
                                style={bodyFont ? { fontFamily: bodyFont } : undefined}
                              >
                                <span className="text-gold-primary/70 font-semibold">
                                  {UI_LABELS.substitute[locale]}
                                </span>{' '}
                                {sub.item[locale]}
                                {sub.note && (
                                  <span className="text-text-secondary/55"> &mdash; {sub.note[locale]}</span>
                                )}
                              </p>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
