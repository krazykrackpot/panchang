'use client';

import { useState, useMemo } from 'react';
import { Search } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocale } from 'next-intl';
import { GLOSSARY, type GlossaryEntry } from '@/lib/constants/glossary';
import { tl } from '@/lib/utils/trilingual';

type Category = GlossaryEntry['category'] | 'all';

const CATEGORIES: { value: Category; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'panchang', label: 'Panchang' },
  { value: 'kundali', label: 'Kundali' },
  { value: 'dasha', label: 'Dasha' },
  { value: 'yoga', label: 'Yoga' },
  { value: 'general', label: 'General' },
];

const CATEGORY_LABELS: Record<GlossaryEntry['category'], string> = {
  panchang: 'Panchang',
  kundali: 'Kundali',
  dasha: 'Dasha',
  yoga: 'Yoga',
  general: 'General',
};

export default function GlossaryPage() {
  const locale = useLocale();
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState<Category>('all');

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return GLOSSARY.filter(entry => {
      const matchesCategory = activeCategory === 'all' || entry.category === activeCategory;
      if (!matchesCategory) return false;
      if (!q) return true;
      return (
        entry.term.en.toLowerCase().includes(q) ||
        (entry.term.hi && entry.term.hi.toLowerCase().includes(q)) ||
        entry.shortDef.toLowerCase().includes(q) ||
        entry.fullDef.toLowerCase().includes(q) ||
        (entry.westernEquivalent?.toLowerCase().includes(q) ?? false)
      );
    });
  }, [search, activeCategory]);

  // Group by first letter of term.en
  const grouped = useMemo(() => {
    const map = new Map<string, GlossaryEntry[]>();
    for (const entry of filtered) {
      const letter = entry.term.en[0].toUpperCase();
      if (!map.has(letter)) map.set(letter, []);
      map.get(letter)!.push(entry);
    }
    // Sort letters
    return Array.from(map.entries()).sort(([a], [b]) => a.localeCompare(b));
  }, [filtered]);

  // JSON-LD: DefinedTermSet
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'DefinedTermSet',
    name: 'Vedic Astrology Glossary',
    description: 'Comprehensive glossary of Vedic astrology terms with pronunciations, definitions, and Western equivalents.',
    hasDefinedTerm: GLOSSARY.map(entry => ({
      '@type': 'DefinedTerm',
      '@id': `#${entry.id}`,
      name: entry.term.en,
      description: entry.shortDef,
      inDefinedTermSet: 'Vedic Astrology Glossary',
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="min-h-screen bg-[#0a0e27] text-[#e6e2d8] py-12 px-4">
        <div className="max-w-4xl mx-auto">

          {/* Header */}
          <div className="text-center mb-10">
            <h1 className="text-3xl md:text-4xl font-bold text-[#f0d48a] mb-3">
              Vedic Astrology Glossary
            </h1>
            <p className="text-[#8a8478] text-base">
              {GLOSSARY.length} terms defined — from Panchang to Dasha systems
            </p>
          </div>

          {/* Search */}
          <div className="relative mb-6">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8a8478]" />
            <input
              type="text"
              placeholder="Search terms, definitions, Western equivalents…"
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full bg-[#111633] border border-[#d4a853]/20 rounded-lg pl-10 pr-4 py-3 text-[#e6e2d8] placeholder-[#8a8478] focus:outline-none focus:border-[#d4a853]/50 text-sm"
            />
          </div>

          {/* Category filter */}
          <div className="flex flex-wrap gap-2 mb-8">
            {CATEGORIES.map(cat => (
              <button
                key={cat.value}
                onClick={() => setActiveCategory(cat.value)}
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors border ${
                  activeCategory === cat.value
                    ? 'bg-[#d4a853]/20 text-[#f0d48a] border-[#d4a853]/40'
                    : 'bg-[#111633] text-[#8a8478] border-[#d4a853]/10 hover:text-[#e6e2d8] hover:border-[#d4a853]/20'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Results count */}
          {search && (
            <p className="text-[#8a8478] text-sm mb-6">
              {filtered.length} result{filtered.length !== 1 ? 's' : ''} for &ldquo;{search}&rdquo;
            </p>
          )}

          {/* Entries */}
          <AnimatePresence mode="wait">
            {grouped.length === 0 ? (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-center py-16 text-[#8a8478]"
              >
                No terms found. Try a different search or category.
              </motion.div>
            ) : (
              <motion.div
                key={`${search}-${activeCategory}`}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2, ease: 'easeInOut' as const }}
              >
                {grouped.map(([letter, entries]) => (
                  <div key={letter} className="mb-10">
                    {/* Letter heading */}
                    <h2 className="text-xl font-bold text-[#d4a853] border-b border-[#d4a853]/20 pb-2 mb-5">
                      {letter}
                    </h2>

                    <div className="space-y-6">
                      {entries.map(entry => (
                        <div
                          key={entry.id}
                          id={entry.id}
                          className="scroll-mt-24 bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] rounded-xl border border-[#d4a853]/12 p-5 hover:border-[#d4a853]/40 transition-all"
                        >
                          {/* Term header row */}
                          <div className="flex flex-wrap items-start gap-3 mb-3">
                            <div className="flex-1 min-w-0">
                              <h3 className="text-lg font-semibold text-[#f0d48a] leading-tight">
                                {tl(entry.term, locale)}
                                {locale !== 'en' && entry.term.en !== tl(entry.term, locale) && (
                                  <span className="ml-2 text-sm font-normal text-[#8a8478]">
                                    ({entry.term.en})
                                  </span>
                                )}
                              </h3>
                              {entry.pronunciation && (
                                <p className="text-[#8a8478] text-sm mt-0.5 font-mono">
                                  /{entry.pronunciation}/
                                </p>
                              )}
                            </div>
                            <span className="flex-shrink-0 text-xs px-2 py-0.5 rounded-full bg-[#d4a853]/10 text-[#d4a853] border border-[#d4a853]/20">
                              {CATEGORY_LABELS[entry.category]}
                            </span>
                          </div>

                          {/* Short definition */}
                          <p className="text-[#e6e2d8] text-sm font-medium mb-2">
                            {entry.shortDef}
                          </p>

                          {/* Full definition */}
                          <p className="text-[#8a8478] text-sm leading-relaxed mb-3">
                            {entry.fullDef}
                          </p>

                          {/* Western equivalent */}
                          {entry.westernEquivalent && (
                            <div className="flex items-center gap-2 mb-3 text-sm">
                              <span className="text-[#8a8478]">Western equivalent:</span>
                              <span className="text-[#e6e2d8] italic">{entry.westernEquivalent}</span>
                            </div>
                          )}

                          {/* Related terms */}
                          {entry.relatedTerms.length > 0 && (
                            <div className="flex flex-wrap items-center gap-1.5">
                              <span className="text-xs text-[#8a8478]">See also:</span>
                              {entry.relatedTerms.map(relId => {
                                const rel = GLOSSARY.find(g => g.id === relId);
                                return rel ? (
                                  <a
                                    key={relId}
                                    href={`#${relId}`}
                                    className="text-xs text-[#d4a853] hover:text-[#f0d48a] underline underline-offset-2 transition-colors"
                                  >
                                    {rel.term.en}
                                  </a>
                                ) : null;
                              })}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>

        </div>
      </div>
    </>
  );
}
