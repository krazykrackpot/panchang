'use client';

import { useLocale } from 'next-intl';
import { useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { BookOpen, ArrowLeft, Star, Sparkles, ScrollText } from 'lucide-react';
import GoldDivider from '@/components/ui/GoldDivider';
import { Link } from '@/lib/i18n/navigation';
import { generateBreadcrumbLD } from '@/lib/seo/structured-data';
import { safeJsonLd } from '@/lib/seo/safe-jsonld';
import { isDevanagariLocale } from '@/lib/utils/locale-fonts';
import AuthorByline from '@/components/ui/AuthorByline';
import { getVratKatha, VRAT_KATHAS } from '@/lib/content/vrat-kathas';

const LABELS = {
  back: { en: 'All Vrat Kathas', hi: 'सभी व्रत कथाएं' },
  story: { en: 'The Story', hi: 'कथा' },
  phal: { en: 'Benefits (Phal)', hi: 'फल (लाभ)' },
  vidhi: { en: 'Method of Fasting (Vidhi)', hi: 'व्रत विधि' },
  deity: { en: 'Deity', hi: 'देवता' },
  notFound: { en: 'Katha not found', hi: 'कथा नहीं मिली' },
  readMore: { en: 'More Vrat Kathas', hi: 'और व्रत कथाएं' },
};

export default function VratKathaPage() {
  const locale = useLocale();
  const { slug } = useParams<{ slug: string }>();
  const isDev = isDevanagariLocale(locale);
  const L = (key: keyof typeof LABELS) => (LABELS[key] as Record<string, string>)[locale] || (LABELS[key] as Record<string, string>).en;

  const katha = getVratKatha(slug);

  if (!katha) {
    return (
      <main className="min-h-screen bg-bg-primary pt-24 pb-16">
        <div className="max-w-3xl mx-auto px-4 text-center py-20">
          <h1 className="text-2xl text-gold-light">{L('notFound')}</h1>
          <Link href="/vrat-katha/ekadashi" className="text-gold-primary hover:text-gold-light mt-4 inline-block">
            {L('back')}
          </Link>
        </div>
      </main>
    );
  }

  const title = (katha.title as Record<string, string>)[locale] || katha.title.en;
  const deity = (katha.deity as Record<string, string>)[locale] || katha.deity.en;
  const story = (katha.story as Record<string, string>)[locale] || katha.story.en;
  const phal = (katha.phal as Record<string, string>)[locale] || katha.phal.en;
  const vidhi = (katha.vidhi as Record<string, string>)[locale] || katha.vidhi.en;

  // Other kathas for "read more"
  const otherKathas = VRAT_KATHAS.filter(k => k.slug !== slug).slice(0, 4);

  return (
    <main className="min-h-screen bg-bg-primary pt-24 pb-16">
      {safeJsonLd(generateBreadcrumbLD(`/${locale}/vrat-katha/${slug}`, locale))}

      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        {/* Back link */}
        <Link href={`/vrat-katha/${VRAT_KATHAS[0].slug}`} className="inline-flex items-center gap-2 text-text-secondary hover:text-gold-light transition-colors mb-6">
          <ArrowLeft className="w-4 h-4" />
          <span>{L('back')}</span>
        </Link>

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10">
          <div className="inline-flex items-center gap-3 mb-4">
            <BookOpen className="w-8 h-8 text-gold-primary" />
            <h1 className={`text-3xl sm:text-4xl font-bold text-gold-light ${isDev ? 'font-devanagari-heading' : ''}`}>
              {title}
            </h1>
          </div>
          <p className="text-text-secondary">
            <span className="text-gold-primary">{L('deity')}:</span> {deity}
          </p>
        </motion.div>

        <GoldDivider className="mb-10" />

        {/* Story */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-12"
        >
          <div className="flex items-center gap-2 mb-4">
            <ScrollText className="w-5 h-5 text-gold-primary" />
            <h2 className={`text-2xl font-bold text-gold-light ${isDev ? 'font-devanagari-heading' : ''}`}>
              {L('story')}
            </h2>
          </div>
          <div className="rounded-2xl border border-gold-primary/12 bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] p-6 sm:p-8">
            {story.split('\n\n').map((para, i) => (
              <p key={i} className={`text-text-primary leading-relaxed mb-4 last:mb-0 ${isDev ? 'font-devanagari-body' : ''}`}>
                {para}
              </p>
            ))}
          </div>
        </motion.section>

        {/* Phal */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-12"
        >
          <div className="flex items-center gap-2 mb-4">
            <Star className="w-5 h-5 text-gold-primary" />
            <h2 className={`text-2xl font-bold text-gold-light ${isDev ? 'font-devanagari-heading' : ''}`}>
              {L('phal')}
            </h2>
          </div>
          <div className="rounded-2xl border border-gold-primary/12 bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] p-6 sm:p-8">
            <p className={`text-text-primary leading-relaxed ${isDev ? 'font-devanagari-body' : ''}`}>{phal}</p>
          </div>
        </motion.section>

        {/* Vidhi */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-12"
        >
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="w-5 h-5 text-gold-primary" />
            <h2 className={`text-2xl font-bold text-gold-light ${isDev ? 'font-devanagari-heading' : ''}`}>
              {L('vidhi')}
            </h2>
          </div>
          <div className="rounded-2xl border border-gold-primary/12 bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] p-6 sm:p-8">
            <p className={`text-text-primary leading-relaxed ${isDev ? 'font-devanagari-body' : ''}`}>{vidhi}</p>
          </div>
        </motion.section>

        <GoldDivider className="my-12" />

        {/* More Kathas */}
        <section>
          <h2 className={`text-2xl font-bold text-gold-light mb-6 ${isDev ? 'font-devanagari-heading' : ''}`}>
            {L('readMore')}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {otherKathas.map(k => (
              <Link
                key={k.slug}
                href={`/vrat-katha/${k.slug}`}
                className="rounded-xl border border-gold-primary/12 bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] p-4 hover:border-gold-primary/40 transition-colors group"
              >
                <h3 className="text-gold-light font-semibold group-hover:text-gold-primary transition-colors">
                  {(k.title as Record<string, string>)[locale] || k.title.en}
                </h3>
                <p className="text-text-secondary text-sm mt-1">
                  {(k.deity as Record<string, string>)[locale] || k.deity.en}
                </p>
              </Link>
            ))}
          </div>
        </section>

        <GoldDivider className="my-12" />
        <AuthorByline />
      </div>
    </main>
  );
}
