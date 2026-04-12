'use client';

import { useLocale } from 'next-intl';
import { motion } from 'framer-motion';
import { Link } from '@/lib/i18n/navigation';
import { WEB_STORIES } from '@/lib/stories/story-data';
import { ChevronRight, Sparkles } from 'lucide-react';
import { ShareRow } from '@/components/ui/ShareButton';
import type { Locale } from '@/types/panchang';
import { isDevanagariLocale } from '@/lib/utils/locale-fonts';

const STORY_COLORS = [
  'from-[#2d1b69]/50 via-[#1a1040]/60 to-[#0a0e27]',
  'from-[#0a1a3a]/60 via-[#0a1025]/50 to-[#0a0e27]',
  'from-[#0a2a1a]/50 via-[#0a1a10]/50 to-[#0a0e27]',
  'from-[#2a0a1a]/50 via-[#1a0a10]/50 to-[#0a0e27]',
  'from-[#0a1a3a]/50 via-[#0a1030]/50 to-[#0a0e27]',
];

const STORY_BORDERS = [
  'border-purple-500/15 hover:border-purple-500/40',
  'border-blue-500/15 hover:border-blue-500/40',
  'border-emerald-500/15 hover:border-emerald-500/40',
  'border-rose-500/15 hover:border-rose-500/40',
  'border-cyan-500/15 hover:border-cyan-500/40',
];

const STORY_ACCENTS = [
  'text-purple-400',
  'text-blue-400',
  'text-emerald-400',
  'text-rose-400',
  'text-cyan-400',
];

const L = {
  en: {
    title: 'Web Stories',
    subtitle: 'Swipe through India\'s greatest mathematical discoveries — 8 slides each, built for mobile.',
    badge: '5 Stories',
    slideCount: 'slides',
    swipeToExplore: 'Tap to explore',
  },
  hi: {
    title: 'वेब स्टोरीज़',
    subtitle: 'भारत की महानतम गणितीय खोजों को स्वाइप करें — प्रत्येक 8 स्लाइड, मोबाइल के लिए।',
    badge: '5 स्टोरीज़',
    slideCount: 'स्लाइड',
    swipeToExplore: 'खोलने के लिए टैप करें',
  },
};

export default function StoriesIndexPage() {
  const locale = useLocale() as Locale;
  const isDevanagari = isDevanagariLocale(locale);
  const hf = isDevanagari ? { fontFamily: 'var(--font-devanagari-heading)' } : { fontFamily: 'var(--font-heading)' };
  const bf = isDevanagari ? { fontFamily: 'var(--font-devanagari-body)' } : {};
  const l = L[isDevanagariLocale(locale) ? 'hi' : 'en'];

  return (
    <div className="max-w-4xl mx-auto">
      {/* Hero */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 p-8 sm:p-10 mb-10"
      >
        <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full bg-gold-primary/5 blur-3xl" />
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="w-5 h-5 text-gold-primary" />
            <span className="text-gold-primary text-xs uppercase tracking-widest font-bold">
              Indian Contributions
            </span>
            <span className="ml-2 text-xs px-2 py-0.5 rounded-full bg-gold-primary/15 text-gold-light border border-gold-primary/20 font-medium">
              {l.badge}
            </span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold mb-3" style={hf}>
            <span className="text-gold-gradient">{l.title}</span>
          </h1>
          <p className="text-text-secondary text-base sm:text-lg max-w-2xl" style={bf}>{l.subtitle}</p>
          <div className="flex justify-center mt-5">
            <ShareRow
              pageTitle={l.title}
              shareText={locale === 'en'
                ? 'India\'s greatest math discoveries as swipeable Web Stories — Dekho Panchang'
                : 'भारत की महानतम गणितीय खोजें — वेब स्टोरीज़ — Dekho Panchang'}
              locale={locale}
            />
          </div>
        </div>
      </motion.div>

      {/* Story grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {WEB_STORIES.map((story, i) => {
          const t = (v: { en: string; hi: string }) => isDevanagariLocale(locale) ? v.hi : v.en;
          return (
            <motion.div
              key={story.slug}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <Link href={`/stories/${story.slug}`} className="block group">
                <div className={`relative overflow-hidden rounded-2xl border ${STORY_BORDERS[i]} bg-gradient-to-br ${STORY_COLORS[i]} transition-all duration-300 hover:scale-[1.03] hover:shadow-2xl`}>
                  {/* Fake "phone" preview */}
                  <div className="aspect-[9/16] max-h-[380px] flex flex-col items-center justify-center p-6 text-center relative">
                    <div className="absolute inset-0" style={{ background: `radial-gradient(ellipse at center, ${story.slides[0].bgColor || '#0a0e27'}99 0%, transparent 70%)` }} />

                    <div className="relative z-10">
                      {/* Slide count badge */}
                      <div className="flex gap-0.5 mb-6 justify-center">
                        {story.slides.map((_, si) => (
                          <div key={si} className="w-6 h-[2px] rounded-full bg-white/20" />
                        ))}
                      </div>

                      <h3 className={`text-lg sm:text-xl font-bold text-gold-light leading-snug mb-3 whitespace-pre-line group-hover:text-gold-primary transition-colors`} style={hf}>
                        {t(story.title)}
                      </h3>
                      <p className="text-text-secondary text-xs sm:text-sm leading-relaxed line-clamp-3" style={bf}>
                        {t(story.description)}
                      </p>
                    </div>

                    {/* Bottom area */}
                    <div className="absolute bottom-4 left-0 right-0 flex items-center justify-center gap-1.5 z-10">
                      <span className={`text-xs font-medium ${STORY_ACCENTS[i]} opacity-80 group-hover:opacity-100 transition-opacity`}>
                        {l.swipeToExplore}
                      </span>
                      <ChevronRight className={`w-3.5 h-3.5 ${STORY_ACCENTS[i]} opacity-60 group-hover:translate-x-1 transition-transform`} />
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          );
        })}
      </div>

      {/* Back to learn link */}
      <div className="mt-10 text-center">
        <Link
          href="/learn/contributions/timeline"
          className="text-gold-primary/70 hover:text-gold-primary text-sm transition-colors"
          style={bf}
        >
          {isDevanagariLocale(locale) ? 'सभी भारतीय योगदान देखें' : 'View all Indian Contributions'} &rarr;
        </Link>
      </div>
    </div>
  );
}
