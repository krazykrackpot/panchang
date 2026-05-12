'use client';

import { useState, useMemo } from 'react';
import { useLocale } from 'next-intl';
import { Link } from '@/lib/i18n/navigation';
import { motion } from 'framer-motion';
import { Search, BookOpen, ChevronRight, Star, AlertTriangle } from 'lucide-react';
import { YOGA_DETAIL_DATA, type YogaDetailEntry } from '@/lib/constants/yoga-details';
import { isDevanagariLocale } from '@/lib/utils/locale-fonts';
import AuthorByline from '@/components/ui/AuthorByline';

const CATEGORIES = [
  { key: 'all', label: { en: 'All Yogas', hi: 'सभी योग' } },
  { key: 'dosha', label: { en: 'Doshas', hi: 'दोष' } },
  { key: 'mahapurusha', label: { en: 'Mahapurusha', hi: 'महापुरुष' } },
  { key: 'moon_based', label: { en: 'Moon-based', hi: 'चन्द्र आधारित' } },
  { key: 'sun_based', label: { en: 'Sun-based', hi: 'सूर्य आधारित' } },
  { key: 'raja', label: { en: 'Raja Yogas', hi: 'राज योग' } },
  { key: 'wealth', label: { en: 'Wealth', hi: 'धन योग' } },
  { key: 'inauspicious', label: { en: 'Inauspicious', hi: 'अशुभ' } },
  { key: 'other', label: { en: 'Other', hi: 'अन्य' } },
] as const;

const CATEGORY_COLOURS: Record<string, string> = {
  dosha: 'bg-red-500/15 text-red-400 border-red-500/25',
  mahapurusha: 'bg-violet-500/15 text-violet-400 border-violet-500/25',
  moon_based: 'bg-blue-500/15 text-blue-400 border-blue-500/25',
  sun_based: 'bg-amber-500/15 text-amber-400 border-amber-500/25',
  raja: 'bg-gold-primary/15 text-gold-light border-gold-primary/25',
  wealth: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/25',
  inauspicious: 'bg-orange-500/15 text-orange-400 border-orange-500/25',
  other: 'bg-cyan-500/15 text-cyan-400 border-cyan-500/25',
};

export default function YogaIndexPage() {
  const locale = useLocale();
  const isDevanagari = isDevanagariLocale(locale);
  const hf = isDevanagari ? { fontFamily: 'var(--font-devanagari-heading)' } : { fontFamily: 'var(--font-heading)' };
  const bf = isDevanagari ? { fontFamily: 'var(--font-devanagari-body)' } : {};

  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const allYogas = useMemo(() =>
    Object.entries(YOGA_DETAIL_DATA).map(([slug, data]) => ({ slug, ...data })),
    []
  );

  const filtered = useMemo(() => {
    let list = allYogas;
    if (activeCategory !== 'all') {
      list = list.filter(y => y.category === activeCategory);
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(y =>
        y.name.en.toLowerCase().includes(q) ||
        y.name.hi.toLowerCase().includes(q) ||
        y.slug.includes(q) ||
        y.category.includes(q)
      );
    }
    return list;
  }, [allYogas, activeCategory, searchQuery]);

  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { all: allYogas.length };
    for (const y of allYogas) {
      counts[y.category] = (counts[y.category] || 0) + 1;
    }
    return counts;
  }, [allYogas]);

  const getName = (y: YogaDetailEntry) => locale === 'hi' ? y.name.hi : y.name.en;

  return (
    <div>
      {/* Hero */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 p-8 sm:p-10 mb-10"
      >
        <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full bg-gold-primary/5 blur-3xl" />
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-4">
            <BookOpen className="w-5 h-5 text-gold-primary" />
            <span className="text-gold-primary text-xs uppercase tracking-widest font-bold">
              {locale === 'hi' ? 'योग विश्वकोश' : 'Yoga Encyclopedia'}
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4" style={hf}>
            <span className="text-gold-gradient">
              {locale === 'hi' ? '104 वैदिक ज्योतिष योग' : '104 Vedic Astrology Yogas'}
            </span>
          </h1>
          <p className="text-text-secondary text-lg max-w-2xl" style={bf}>
            {locale === 'hi'
              ? 'दोष, महापुरुष, राज, धन, चन्द्र और सूर्य योग — प्रत्येक का विस्तृत निर्माण नियम, प्रभाव, उपाय और शास्त्रीय सन्दर्भ।'
              : 'Doshas, Mahapurusha, Raja, Wealth, Moon-based and Sun-based yogas — each with detailed formation rules, effects, remedies, and classical references.'}
          </p>
        </div>
      </motion.div>

      {/* Search */}
      <div className="relative mb-6">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary/60" />
        <input
          type="text"
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          placeholder={locale === 'hi' ? 'योग खोजें...' : 'Search yogas...'}
          className="w-full pl-11 pr-4 py-3 rounded-xl bg-gradient-to-br from-[#2d1b69]/20 via-[#1a1040]/25 to-transparent border border-gold-primary/12 text-text-primary placeholder:text-text-secondary/50 focus:outline-none focus:border-gold-primary/30 transition-colors"
          style={bf}
        />
      </div>

      {/* Category tabs */}
      <div className="flex flex-wrap gap-2 mb-8">
        {CATEGORIES.map(cat => (
          <button
            key={cat.key}
            onClick={() => setActiveCategory(cat.key)}
            className={`px-4 py-2 rounded-lg text-sm font-medium border transition-all ${
              activeCategory === cat.key
                ? 'bg-gold-primary/20 border-gold-primary/40 text-gold-light'
                : 'bg-transparent border-gold-primary/10 text-text-secondary hover:border-gold-primary/25 hover:text-text-primary'
            }`}
            style={bf}
          >
            {locale === 'hi' ? cat.label.hi : cat.label.en}
            <span className="ml-1.5 text-xs opacity-60">({categoryCounts[cat.key] || 0})</span>
          </button>
        ))}
      </div>

      {/* Results count */}
      <p className="text-text-secondary text-sm mb-6" style={bf}>
        {locale === 'hi'
          ? `${filtered.length} योग दिखा रहे हैं`
          : `Showing ${filtered.length} yoga${filtered.length !== 1 ? 's' : ''}`}
      </p>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-12">
        {filtered.map((yoga, i) => (
          <motion.div
            key={yoga.slug}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: Math.min(i * 0.02, 0.4), ease: 'easeOut' as const }}
          >
            <Link
              href={`/learn/yoga/${yoga.slug}`}
              className="block group rounded-2xl bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 hover:border-gold-primary/40 p-5 transition-all hover:shadow-lg hover:shadow-gold-primary/5"
            >
              <div className="flex items-start justify-between gap-3 mb-3">
                <h3 className="text-gold-light font-bold group-hover:text-gold-primary transition-colors leading-tight" style={hf}>
                  {getName(yoga)}
                </h3>
                <div className="flex items-center gap-1.5 shrink-0">
                  {yoga.isAuspicious ? (
                    <Star className="w-4 h-4 text-emerald-400" />
                  ) : (
                    <AlertTriangle className="w-4 h-4 text-red-400" />
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2 mb-3">
                <span className={`text-xs px-2 py-0.5 rounded-full border font-medium ${CATEGORY_COLOURS[yoga.category] || CATEGORY_COLOURS.other}`}>
                  {yoga.category.replace(/_/g, ' ')}
                </span>
                <span className="text-xs text-text-secondary/60">
                  ~{yoga.frequency}% {locale === 'hi' ? 'कुण्डलियों में' : 'of charts'}
                </span>
              </div>
              <p className="text-text-secondary text-sm line-clamp-2 mb-3" style={bf}>
                {locale === 'hi' ? yoga.formationRule.hi : yoga.formationRule.en}
              </p>
              <div className="flex items-center gap-1 text-gold-primary/60 group-hover:text-gold-primary text-xs font-medium transition-colors">
                {locale === 'hi' ? 'विस्तार से पढ़ें' : 'Read more'}
                <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
              </div>
            </Link>
          </motion.div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-16">
          <p className="text-text-secondary text-lg" style={bf}>
            {locale === 'hi' ? 'कोई योग नहीं मिला' : 'No yogas found'}
          </p>
          <button
            onClick={() => { setSearchQuery(''); setActiveCategory('all'); }}
            className="mt-3 text-gold-primary text-sm hover:underline"
          >
            {locale === 'hi' ? 'फ़िल्टर हटाएँ' : 'Clear filters'}
          </button>
        </div>
      )}

      <AuthorByline />
    </div>
  );
}
