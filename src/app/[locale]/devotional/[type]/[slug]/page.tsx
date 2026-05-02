'use client';

import { useState, useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useLocale } from 'next-intl';
import { motion } from 'framer-motion';
import { Link } from '@/lib/i18n/navigation';
import { ArrowLeft, BookOpen, Languages, MessageCircle, Share2, Clock, Star, ChevronRight } from 'lucide-react';
import GoldDivider from '@/components/ui/GoldDivider';
import {
  getDevotionalItem,
  getDevotionalItemsByDeity,
  TYPE_LABELS,
  DAY_NAMES,
} from '@/lib/content/devotional-content';
import type { DevotionalType } from '@/lib/content/devotional-content';
import { isDevanagariLocale } from '@/lib/utils/locale-fonts';

type TabKey = 'devanagari' | 'transliteration' | 'meaning';

const TAB_LABELS: Record<TabKey, { en: string; hi: string }> = {
  devanagari: { en: 'Devanagari', hi: 'देवनागरी' },
  transliteration: { en: 'Transliteration', hi: 'लिप्यंतरण' },
  meaning: { en: 'Meaning', hi: 'अर्थ' },
};

export default function DevotionalItemPage() {
  const params = useParams();
  const locale = useLocale();
  const router = useRouter();
  const isHi = locale === 'hi';
  const isDevanagari = isDevanagariLocale(locale as 'en' | 'hi');
  const headingFont = isDevanagari
    ? { fontFamily: 'var(--font-devanagari-heading)' }
    : { fontFamily: 'var(--font-heading)' };
  const bodyFont = isDevanagari
    ? { fontFamily: 'var(--font-devanagari-body)' }
    : undefined;

  const type = params.type as DevotionalType;
  const slug = params.slug as string;

  const item = useMemo(() => getDevotionalItem(type, slug), [type, slug]);
  const relatedItems = useMemo(() => {
    if (!item) return [];
    return getDevotionalItemsByDeity(item.deity).filter(
      (r) => r.slug !== item.slug
    );
  }, [item]);

  const [activeTab, setActiveTab] = useState<TabKey>('devanagari');

  if (!item) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <p className="text-text-secondary text-lg">
          {isHi ? 'सामग्री नहीं मिली।' : 'Content not found.'}
        </p>
        <Link
          href="/devotional"
          className="text-gold-primary hover:text-gold-light mt-4 inline-block"
        >
          &larr; {isHi ? 'वापस जाएँ' : 'Back to Devotional'}
        </Link>
      </div>
    );
  }

  const typeLabel = TYPE_LABELS[type];
  const title = isHi ? item.title.hi : item.title.en;
  const typeName = isHi ? typeLabel.hi : typeLabel.en;

  const tabContent: Record<TabKey, string> = {
    devanagari: item.devanagari,
    transliteration: item.transliteration,
    meaning: item.meaning,
  };

  const handleShare = () => {
    const url = window.location.href;
    const text = `${item.title.en} — ${typeName}`;
    if (navigator.share) {
      navigator.share({ title: text, url }).catch(() => {
        // User cancelled — not an error
      });
    } else {
      // Fallback: open WhatsApp share
      const waUrl = `https://wa.me/?text=${encodeURIComponent(text + '\n' + url)}`;
      window.open(waUrl, '_blank');
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-text-secondary mb-8 flex-wrap">
        <Link
          href="/devotional"
          className="hover:text-gold-primary transition-colors"
        >
          {isHi ? 'भक्ति' : 'Devotional'}
        </Link>
        <ChevronRight className="w-3 h-3" />
        <Link
          href={`/devotional?type=${type}`}
          className="hover:text-gold-primary transition-colors"
        >
          {typeName}
        </Link>
        <ChevronRight className="w-3 h-3" />
        <span className="text-gold-light">{title}</span>
      </nav>

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <div className="inline-block px-3 py-1 rounded-full bg-gold-primary/10 text-gold-primary text-xs font-bold uppercase tracking-wider mb-3">
          {typeName} &middot; {item.deity}
        </div>
        <h1
          className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-3"
          style={headingFont}
        >
          <span className="text-gold-gradient">{title}</span>
        </h1>

        {/* Best time to recite */}
        {item.deityDay !== undefined && (
          <div className="flex items-center justify-center gap-2 text-text-secondary text-sm mt-2">
            <Clock className="w-4 h-4 text-gold-dark" />
            <span>
              {isHi ? 'सर्वोत्तम दिन: ' : 'Best day: '}
              <span className="text-gold-light font-semibold">
                {isHi
                  ? DAY_NAMES[item.deityDay].hi
                  : DAY_NAMES[item.deityDay].en}
              </span>
            </span>
          </div>
        )}
      </motion.div>

      {/* Action buttons */}
      <div className="flex justify-center gap-3 mb-8">
        <button
          onClick={handleShare}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gold-primary/10 text-gold-primary hover:bg-gold-primary/20 transition-colors text-sm font-medium"
        >
          <Share2 className="w-4 h-4" />
          {isHi ? 'शेयर करें' : 'Share'}
        </button>
      </div>

      {/* Tab selector */}
      <div className="flex justify-center mb-6">
        <div className="inline-flex rounded-xl bg-bg-secondary/80 border border-gold-primary/10 p-1 gap-1">
          {(Object.keys(TAB_LABELS) as TabKey[]).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === tab
                  ? 'bg-gold-primary/20 text-gold-light shadow-sm'
                  : 'text-text-secondary hover:text-gold-primary hover:bg-gold-primary/5'
              }`}
            >
              <span className="flex items-center gap-1.5">
                {tab === 'devanagari' && (
                  <BookOpen className="w-3.5 h-3.5" />
                )}
                {tab === 'transliteration' && (
                  <Languages className="w-3.5 h-3.5" />
                )}
                {tab === 'meaning' && (
                  <MessageCircle className="w-3.5 h-3.5" />
                )}
                {isHi ? TAB_LABELS[tab].hi : TAB_LABELS[tab].en}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Main content card */}
      <motion.div
        key={activeTab}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
        className="rounded-2xl bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 p-6 sm:p-8 mb-8"
      >
        <div
          className={`whitespace-pre-wrap leading-relaxed ${
            activeTab === 'devanagari'
              ? 'text-gold-primary text-lg sm:text-xl'
              : activeTab === 'transliteration'
              ? 'text-text-primary text-base sm:text-lg italic'
              : 'text-text-secondary text-base sm:text-lg'
          }`}
          style={
            activeTab === 'devanagari'
              ? { fontFamily: 'var(--font-devanagari-body)' }
              : undefined
          }
        >
          {tabContent[activeTab]}
        </div>
      </motion.div>

      <GoldDivider />

      {/* Significance section */}
      <div className="my-8">
        <h2
          className="text-2xl font-bold text-gold-light mb-4 flex items-center gap-2"
          style={headingFont}
        >
          <Star className="w-5 h-5 text-gold-primary" />
          {isHi ? 'महत्व और पाठ विधि' : 'Significance & When to Recite'}
        </h2>
        <div className="rounded-xl bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 p-6">
          <p
            className="text-text-secondary leading-relaxed"
            style={bodyFont}
          >
            {item.significance}
          </p>
        </div>
      </div>

      {/* Related items */}
      {relatedItems.length > 0 && (
        <div className="my-8">
          <h2
            className="text-2xl font-bold text-gold-light mb-4"
            style={headingFont}
          >
            {isHi
              ? `${item.deity} के अन्य पाठ`
              : `More ${item.deity} Prayers`}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {relatedItems.slice(0, 6).map((rel) => {
              const relType = TYPE_LABELS[rel.type];
              return (
                <Link
                  key={`${rel.type}-${rel.slug}`}
                  href={`/devotional/${rel.type}/${rel.slug}`}
                  className="rounded-xl bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 hover:border-gold-primary/40 p-4 transition-colors group"
                >
                  <div className="text-gold-primary text-xs uppercase tracking-wider font-bold mb-1">
                    {isHi ? relType.hi : relType.en}
                  </div>
                  <div
                    className="text-gold-light font-semibold group-hover:text-gold-primary transition-colors"
                    style={headingFont}
                  >
                    {isHi ? rel.title.hi : rel.title.en}
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      )}

      {/* Back link */}
      <div className="mt-10 text-center">
        <Link
          href="/devotional"
          className="inline-flex items-center gap-2 text-gold-primary hover:text-gold-light transition-colors font-medium"
        >
          <ArrowLeft className="w-4 h-4" />
          {isHi
            ? 'सम्पूर्ण भक्ति संग्रह'
            : 'Browse All Devotional Content'}
        </Link>
      </div>
    </div>
  );
}
