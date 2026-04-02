'use client';

import { useLocale } from 'next-intl';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { PUJA_VIDHIS } from '@/lib/constants/puja-vidhi';
import GoldDivider from '@/components/ui/GoldDivider';
import type { Locale } from '@/types/panchang';

const LABELS = {
  en: {
    title: 'Puja Vidhi',
    subtitle: 'Step-by-step guides for Hindu festivals and vrats with mantras, samagri lists, and procedures.',
    festivals: 'Festivals',
    vrats: 'Vrats',
    viewVidhi: 'View Vidhi',
  },
  hi: {
    title: 'पूजा विधि',
    subtitle: 'हिन्दू त्योहारों और व्रतों की चरणबद्ध विधि — मन्त्र, सामग्री सूची और प्रक्रिया सहित।',
    festivals: 'त्योहार',
    vrats: 'व्रत',
    viewVidhi: 'विधि देखें',
  },
  sa: {
    title: 'पूजाविधिः',
    subtitle: 'हिन्दूत्सवानां व्रतानां च क्रमशः विधिः — मन्त्रैः सामग्रीसूच्या प्रक्रियया च सह।',
    festivals: 'उत्सवाः',
    vrats: 'व्रतानि',
    viewVidhi: 'विधिं पश्यतु',
  },
};

const CARD_GRADIENTS = [
  'from-amber-500/8 via-orange-500/5 to-transparent',
  'from-rose-500/8 via-pink-500/5 to-transparent',
  'from-indigo-500/8 via-blue-500/5 to-transparent',
  'from-emerald-500/8 via-teal-500/5 to-transparent',
  'from-purple-500/8 via-violet-500/5 to-transparent',
  'from-cyan-500/8 via-sky-500/5 to-transparent',
];

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
};

function PujaCard({
  deity,
  slug,
  category,
  locale,
  index,
  viewLabel,
}: {
  deity: { en: string; hi: string; sa: string };
  slug: string;
  category: 'festival' | 'vrat';
  locale: Locale;
  index: number;
  viewLabel: string;
}) {
  const isDevanagari = locale !== 'en';
  const gradient = CARD_GRADIENTS[index % CARD_GRADIENTS.length];

  return (
    <motion.div
      variants={fadeInUp}
      transition={{ duration: 0.4, delay: index * 0.08, ease: 'easeOut' as const }}
    >
      <Link href={`/${locale}/puja/${slug}`} className="block group">
        <div
          className={`glass-card rounded-xl border border-gold-primary/10 p-5 bg-gradient-to-br ${gradient} hover:border-gold-primary/25 transition-all duration-300 hover:shadow-lg hover:shadow-gold-primary/5`}
        >
          <h3
            className="text-gold-light font-bold text-lg mb-1 group-hover:text-gold-primary transition-colors"
            style={isDevanagari ? { fontFamily: 'var(--font-devanagari-heading)' } : undefined}
          >
            {deity[locale]}
          </h3>
          {locale !== 'en' && (
            <p className="text-text-secondary/40 text-xs mb-3">{deity.en}</p>
          )}
          <div className="flex items-center justify-between mt-3">
            <span
              className={`text-[10px] px-2 py-0.5 rounded-full font-semibold border ${
                category === 'festival'
                  ? 'bg-amber-500/15 text-amber-400 border-amber-500/25'
                  : 'bg-blue-500/15 text-blue-400 border-blue-500/25'
              }`}
            >
              {category === 'festival'
                ? locale === 'en' ? 'Festival' : locale === 'hi' ? 'त्योहार' : 'उत्सवः'
                : locale === 'en' ? 'Vrat' : locale === 'hi' ? 'व्रत' : 'व्रतम्'}
            </span>
            <span className="text-gold-primary/60 text-xs group-hover:text-gold-primary transition-colors">
              {viewLabel} &rarr;
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

export default function PujaIndexPage() {
  const locale = useLocale() as Locale;
  const isDevanagari = locale !== 'en';
  const headingFont = isDevanagari
    ? { fontFamily: 'var(--font-devanagari-heading)' }
    : { fontFamily: 'var(--font-heading)' };
  const l = LABELS[locale];

  const allPujas = Object.values(PUJA_VIDHIS);
  const festivals = allPujas.filter((p) => p.category === 'festival');
  const vrats = allPujas.filter((p) => p.category === 'vrat');

  return (
    <main className="min-h-screen pt-28 pb-16 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: 'easeOut' as const }}
          className="text-center mb-10"
        >
          <h1
            className="text-4xl sm:text-5xl font-black bg-gradient-to-r from-gold-light via-gold-primary to-gold-dark bg-clip-text text-transparent mb-4"
            style={headingFont}
          >
            {l.title}
          </h1>
          <p className="text-text-secondary max-w-xl mx-auto text-sm sm:text-base">
            {l.subtitle}
          </p>
        </motion.div>

        <GoldDivider />

        {/* Festivals */}
        {festivals.length > 0 && (
          <section className="mt-10 mb-12">
            <motion.h2
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, ease: 'easeOut' as const }}
              className="text-xl font-bold text-gold-light mb-5"
              style={headingFont}
            >
              {l.festivals}
            </motion.h2>
            <motion.div
              initial="initial"
              animate="animate"
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
            >
              {festivals.map((puja, idx) => (
                <PujaCard
                  key={puja.festivalSlug}
                  deity={puja.deity}
                  slug={puja.festivalSlug}
                  category={puja.category}
                  locale={locale}
                  index={idx}
                  viewLabel={l.viewVidhi}
                />
              ))}
            </motion.div>
          </section>
        )}

        {/* Vrats */}
        {vrats.length > 0 && (
          <section className="mb-12">
            <motion.h2
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: 0.2, ease: 'easeOut' as const }}
              className="text-xl font-bold text-gold-light mb-5"
              style={headingFont}
            >
              {l.vrats}
            </motion.h2>
            <motion.div
              initial="initial"
              animate="animate"
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
            >
              {vrats.map((puja, idx) => (
                <PujaCard
                  key={puja.festivalSlug}
                  deity={puja.deity}
                  slug={puja.festivalSlug}
                  category={puja.category}
                  locale={locale}
                  index={idx}
                  viewLabel={l.viewVidhi}
                />
              ))}
            </motion.div>
          </section>
        )}
      </div>
    </main>
  );
}
