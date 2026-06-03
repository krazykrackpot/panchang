'use client';

import { useState, useMemo, useEffect } from 'react';
import { useLocale } from 'next-intl';
import { HelpCircle, X, Search } from 'lucide-react';
import { GLOSSARY, type GlossaryEntry } from '@/lib/constants/glossary';
import { tl } from '@/lib/utils/trilingual';
import { isDevanagariLocale } from '@/lib/utils/locale-fonts';

/**
 * Floating "Jyotish 101" help button + side-drawer with a searchable
 * mini-glossary. Designed to live on /kundali so users encountering
 * unfamiliar terms (lagna, nakshatra, dasha, …) can resolve them
 * without leaving the page.
 *
 * Drawer content reuses `src/lib/constants/glossary.ts` — the same
 * source consumed by `<JyotishTerm>` tooltips and the standalone
 * /glossary page. Single source of truth.
 *
 * Behaviour:
 *   - Floating round button bottom-right (fixed position, sits above
 *     content, behind modals)
 *   - Tap opens a right-side drawer covering ~360px on desktop,
 *     full-screen on mobile (≤ sm)
 *   - Search filter narrows the list instantly
 *   - Each entry expands inline to reveal the full definition
 *   - "Open full glossary →" footer link for users who want the
 *     dedicated page
 */

const L = (en: string, hi: string) => ({ en, hi });
const LABELS = {
  buttonAria: L('Open Jyotish glossary', 'ज्योतिष शब्दकोश खोलें'),
  title: L('Jyotish 101', 'ज्योतिष 101'),
  subtitle: L('Quick reference for terms on this page.', 'इस पृष्ठ के शब्दों की त्वरित संदर्भिका।'),
  searchPlaceholder: L('Search terms…', 'शब्द खोजें…'),
  noResults: L('No terms match.', 'कोई शब्द मेल नहीं खाता।'),
  fullGlossary: L('Open full glossary →', 'पूर्ण शब्दकोश खोलें →'),
  close: L('Close', 'बंद करें'),
};

export function JyotishGlossaryDrawer() {
  const locale = useLocale();
  const isDevanagari = isDevanagariLocale(locale);
  const t = (key: keyof typeof LABELS) => (isDevanagari ? LABELS[key].hi : LABELS[key].en);

  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [expanded, setExpanded] = useState<string | null>(null);

  // Lock body scroll while drawer is open so background doesn't
  // jiggle behind it. Reset on close.
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  // Close on Escape
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [open]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return GLOSSARY;
    return GLOSSARY.filter((entry) => {
      const enTerm = entry.term.en.toLowerCase();
      const hiTerm = (entry.term.hi || '').toLowerCase();
      const shortDef = entry.shortDef.toLowerCase();
      return enTerm.includes(q) || hiTerm.includes(q) || shortDef.includes(q);
    });
  }, [query]);

  return (
    <>
      {/* Floating trigger button — fixed bottom-right. Always available
          while the user explores /kundali; z-index sits above page
          content but below any modal/sheet (modals typically use z-50+). */}
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label={t('buttonAria')}
        className="fixed bottom-5 right-5 z-40 inline-flex items-center gap-2 px-4 py-3 rounded-full border border-gold-primary/40 bg-gradient-to-br from-[#2d1b69]/80 via-[#1a1040]/85 to-[#0a0e27] text-gold-light shadow-xl shadow-black/40 hover:border-gold-primary/70 hover:from-[#2d1b69]/90 transition-all"
      >
        <HelpCircle className="w-4 h-4" />
        <span className="text-sm font-semibold">{t('title')}</span>
      </button>

      {/* Drawer + backdrop */}
      {open && (
        <>
          <div
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
            onClick={() => setOpen(false)}
            aria-hidden="true"
          />
          <aside
            role="dialog"
            aria-label={t('title')}
            className="fixed right-0 top-0 bottom-0 z-50 w-full sm:w-[400px] bg-gradient-to-br from-[#1a1040] via-[#0f0c2e] to-[#0a0e27] border-l border-gold-primary/20 shadow-2xl overflow-y-auto"
          >
            {/* Header */}
            <div className="sticky top-0 z-10 bg-gradient-to-b from-[#1a1040] to-[#1a1040]/95 border-b border-gold-primary/20 px-5 py-4">
              <div className="flex items-start justify-between gap-3 mb-3">
                <div>
                  <h2 className="text-gold-light font-bold text-lg">{t('title')}</h2>
                  <p className="text-text-secondary text-xs mt-0.5">{t('subtitle')}</p>
                </div>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  aria-label={t('close')}
                  className="p-1.5 rounded-md text-text-secondary hover:text-gold-light hover:bg-gold-primary/10 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-text-secondary/60" />
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder={t('searchPlaceholder')}
                  className="w-full pl-9 pr-3 py-2 text-sm rounded-md border border-gold-primary/20 bg-[#0a0e27]/60 text-gold-light placeholder:text-text-secondary/50 focus:outline-none focus:border-gold-primary/50 transition-colors"
                />
              </div>
            </div>

            {/* List */}
            <div className="px-3 py-3 space-y-1">
              {filtered.length === 0 ? (
                <p className="text-center text-text-secondary text-sm py-8">{t('noResults')}</p>
              ) : (
                filtered.map((entry) => (
                  <GlossaryRow
                    key={entry.id}
                    entry={entry}
                    locale={locale}
                    isExpanded={expanded === entry.id}
                    onToggle={() => setExpanded((cur) => (cur === entry.id ? null : entry.id))}
                  />
                ))
              )}
            </div>

            {/* Footer link to full glossary page */}
            <div className="sticky bottom-0 z-10 px-5 py-3 border-t border-gold-primary/15 bg-[#0a0e27]/90 backdrop-blur-sm">
              <a
                href={`/${locale}/glossary`}
                className="block text-center text-sm text-gold-primary hover:text-gold-light transition-colors font-semibold"
                onClick={() => setOpen(false)}
              >
                {t('fullGlossary')}
              </a>
            </div>
          </aside>
        </>
      )}
    </>
  );
}

interface GlossaryRowProps {
  entry: GlossaryEntry;
  locale: string;
  isExpanded: boolean;
  onToggle: () => void;
}

function GlossaryRow({ entry, locale, isExpanded, onToggle }: GlossaryRowProps) {
  return (
    <div className="rounded-md hover:bg-gold-primary/5 transition-colors">
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={isExpanded}
        className="w-full text-left px-3 py-2.5 flex items-baseline justify-between gap-2"
      >
        <span className="text-gold-light font-semibold text-sm">{tl(entry.term, locale)}</span>
        <span className="text-text-secondary/70 text-[10px] uppercase tracking-wider shrink-0">
          {entry.category}
        </span>
      </button>
      <p className="px-3 -mt-1.5 pb-2 text-text-secondary text-xs leading-relaxed">{entry.shortDef}</p>
      {isExpanded && (
        <div className="px-3 pb-3 space-y-2 border-t border-gold-primary/10 pt-3 mt-1">
          <p className="text-text-primary text-xs leading-relaxed">{entry.fullDef}</p>
          {entry.westernEquivalent && (
            <p className="text-text-secondary text-xs">
              <span className="text-gold-primary/70 font-semibold">Western: </span>
              {entry.westernEquivalent}
            </p>
          )}
          {entry.relatedTerms && entry.relatedTerms.length > 0 && (
            <p className="text-text-secondary/70 text-[10px]">
              <span className="text-gold-primary/60 uppercase tracking-wider">Related: </span>
              {entry.relatedTerms.join(', ')}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
