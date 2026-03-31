'use client';

import { useTranslations, useLocale } from 'next-intl';
import LearnTabNav from '@/components/learn/LearnTabNav';
import GoldDivider from '@/components/ui/GoldDivider';
import type { Locale } from '@/types/panchang';
import { BookOpen } from 'lucide-react';
import { motion } from 'framer-motion';

export default function LearnLayout({ children }: { children: React.ReactNode }) {
  const t = useTranslations('learn');
  const locale = useLocale() as Locale;
  const isDevanagari = locale !== 'en';
  const headingFont = isDevanagari ? { fontFamily: 'var(--font-devanagari-heading)' } : { fontFamily: 'var(--font-heading)' };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-4 mb-4">
        <div className="p-3 rounded-xl bg-gold-primary/10 border border-gold-primary/20">
          <BookOpen className="w-8 h-8 text-gold-primary" />
        </div>
        <div>
          <h1 className="text-3xl sm:text-4xl font-bold" style={headingFont}>
            <span className="text-gold-gradient">{t('title')}</span>
          </h1>
          <p className="text-text-secondary text-sm mt-1">{t('subtitle')}</p>
        </div>
      </motion.div>

      <GoldDivider />

      {/* Desktop: sidebar + content. Mobile: collapsible dropdown + content. */}
      <div className="lg:flex lg:gap-8 mt-6">
        {/* Sidebar (desktop sticky) / Dropdown (mobile) */}
        <div className="lg:w-56 lg:shrink-0 lg:sticky lg:top-20 lg:self-start">
          <LearnTabNav />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          {children}
        </div>
      </div>
    </div>
  );
}
