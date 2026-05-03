'use client';

import { useLocale } from 'next-intl';
import { useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { BookOpen, ArrowLeft, Star, Sparkles, Calendar, Info, ExternalLink } from 'lucide-react';
import GoldDivider from '@/components/ui/GoldDivider';
import { Link } from '@/lib/i18n/navigation';
import { generateBreadcrumbLD } from '@/lib/seo/structured-data';
import { safeJsonLd } from '@/lib/seo/safe-jsonld';
import { isDevanagariLocale } from '@/lib/utils/locale-fonts';
import AuthorByline from '@/components/ui/AuthorByline';
import { getVratKatha, VRAT_KATHAS } from '@/lib/content/vrat-kathas';

const LABELS = {
  back: { en: 'All Vrat Kathas', hi: 'सभी व्रत कथाएं' },
  overview: { en: 'Significance', hi: 'महत्व' },
  whenObserved: { en: 'When to Observe', hi: 'कब करें' },
  phal: { en: 'Benefits (Phal)', hi: 'फल (लाभ)' },
  vidhi: { en: 'Method of Fasting (Vidhi)', hi: 'व्रत विधि' },
  deity: { en: 'Deity', hi: 'देवता' },
  notFound: { en: 'Katha not found', hi: 'कथा नहीं मिली' },
  readMore: { en: 'More Vrat Kathas', hi: 'और व्रत कथाएं' },
  kathaNote: {
    en: 'is a sacred text that deserves to be read in its traditional form. We recommend consulting your family pandit or a trusted publication for the authentic full text.',
    hi: 'एक पवित्र ग्रन्थ है जिसे उसके पारम्परिक रूप में पढ़ना चाहिए। प्रामाणिक पूर्ण पाठ के लिए अपने पारिवारिक पण्डित या विश्वसनीय प्रकाशन से परामर्श करें।',
  },
  relatedPages: { en: 'Related on Dekho Panchang', hi: 'सम्बन्धित पृष्ठ' },
  samagri: { en: 'Puja Materials (Samagri)', hi: 'पूजन सामग्री' },
  completeKatha: { en: 'Complete Katha', hi: 'सम्पूर्ण कथा' },
  relatedAartis: { en: 'Related Aartis', hi: 'सम्बन्धित आरती' },
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
          <Link href="/vrat-katha" className="text-gold-primary hover:text-gold-light mt-4 inline-block">
            {L('back')}
          </Link>
        </div>
      </main>
    );
  }

  const title = (katha.title as Record<string, string>)[locale] || katha.title.en;
  const deity = (katha.deity as Record<string, string>)[locale] || katha.deity.en;
  const overview = (katha.overview as Record<string, string>)[locale] || katha.overview.en;
  const whenObserved = (katha.whenObserved as Record<string, string>)[locale] || katha.whenObserved.en;
  const phal = (katha.phal as Record<string, string>)[locale] || katha.phal.en;
  const vidhi = (katha.vidhi as Record<string, string>)[locale] || katha.vidhi.en;

  // Other kathas for "read more"
  const otherKathas = VRAT_KATHAS.filter(k => k.slug !== slug).slice(0, 4);

  // Related internal links
  const relatedLinks: Array<{ href: string; label: string }> = [];
  if (katha.linkedFestivalSlugs.length > 0) {
    for (const festSlug of katha.linkedFestivalSlugs) {
      relatedLinks.push({
        href: `/puja/${festSlug}`,
        label: locale === 'hi' ? `${festSlug} पूजा विधि` : `${festSlug} Puja Guide`,
      });
    }
  }
  relatedLinks.push({
    href: '/devotional',
    label: locale === 'hi' ? 'मन्त्र, स्तोत्र एवं आरती' : 'Mantras, Stotras & Aartis',
  });
  relatedLinks.push({
    href: '/vrat-calendar',
    label: locale === 'hi' ? 'व्रत पंचांग' : 'Vrat Calendar',
  });

  return (
    <main className="min-h-screen bg-bg-primary pt-24 pb-16">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        {/* Back link */}
        <Link href="/vrat-katha" className="inline-flex items-center gap-2 text-text-secondary hover:text-gold-light transition-colors mb-6">
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

        {/* Significance / Overview */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-10"
        >
          <div className="flex items-center gap-2 mb-4">
            <Info className="w-5 h-5 text-gold-primary" />
            <h2 className={`text-2xl font-bold text-gold-light ${isDev ? 'font-devanagari-heading' : ''}`}>
              {L('overview')}
            </h2>
          </div>
          <div className="rounded-2xl border border-gold-primary/12 bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] p-6 sm:p-8">
            <p className={`text-text-primary leading-relaxed ${isDev ? 'font-devanagari-body' : ''}`}>{overview}</p>
          </div>
        </motion.section>

        {/* When to Observe */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="mb-10"
        >
          <div className="flex items-center gap-2 mb-4">
            <Calendar className="w-5 h-5 text-gold-primary" />
            <h2 className={`text-2xl font-bold text-gold-light ${isDev ? 'font-devanagari-heading' : ''}`}>
              {L('whenObserved')}
            </h2>
          </div>
          <div className="rounded-2xl border border-gold-primary/12 bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] p-6 sm:p-8">
            <p className={`text-text-primary leading-relaxed ${isDev ? 'font-devanagari-body' : ''}`}>{whenObserved}</p>
          </div>
        </motion.section>

        {/* Phal */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-10"
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
          transition={{ delay: 0.25 }}
          className="mb-10"
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

        {/* Samagri (Puja Materials) */}
        {katha.samagri && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mb-10"
          >
            <h2 className={`text-2xl font-bold text-gold-light mb-4 ${isDev ? 'font-devanagari-heading' : ''}`}>
              {L('samagri')}
            </h2>
            <div className="rounded-2xl border border-gold-primary/12 bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] p-6">
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {(isDev ? katha.samagri.hi : katha.samagri.en).map((item, i) => (
                  <li key={i} className={`flex items-center gap-2 text-text-primary text-sm ${isDev ? 'font-devanagari-body' : ''}`}>
                    <span className="text-gold-primary flex-shrink-0">&#10022;</span> {item}
                  </li>
                ))}
              </ul>
            </div>
          </motion.section>
        )}

        {/* Chapters */}
        {katha.chapters && katha.chapters.length > 0 && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
            className="mb-10"
          >
            <h2 className={`text-2xl font-bold text-gold-light mb-6 ${isDev ? 'font-devanagari-heading' : ''}`}>
              {L('completeKatha')}
            </h2>
            <div className="space-y-4">
              {katha.chapters.map((ch) => (
                <details
                  key={ch.number}
                  open={ch.number === 1}
                  className="rounded-2xl border border-gold-primary/15 bg-gradient-to-br from-[#2d1b69]/30 via-[#1a1040]/40 to-[#0a0e27] overflow-hidden"
                >
                  <summary className="px-6 py-4 cursor-pointer flex items-center gap-3 hover:bg-gold-primary/5 transition-colors">
                    <span className="text-gold-primary font-mono text-sm">{ch.number}</span>
                    <span className={`text-gold-light font-bold ${isDev ? 'font-devanagari-heading' : ''}`}>
                      {isDev ? ch.title.hi : ch.title.en}
                    </span>
                  </summary>
                  <div className="px-6 pb-6 pt-2">
                    <p className={`text-text-primary leading-relaxed whitespace-pre-line ${isDev ? 'font-devanagari-body' : ''}`}>
                      {isDev ? ch.content.hi : ch.content.en}
                    </p>
                  </div>
                </details>
              ))}
            </div>
          </motion.section>
        )}

        {/* Related Aartis */}
        {katha.relatedAartis && katha.relatedAartis.length > 0 && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mb-10"
          >
            <h2 className={`text-2xl font-bold text-gold-light mb-4 ${isDev ? 'font-devanagari-heading' : ''}`}>
              {L('relatedAartis')}
            </h2>
            <div className="flex flex-wrap gap-2">
              {katha.relatedAartis.map(aartiSlug => (
                <Link
                  key={aartiSlug}
                  href={`/devotional/aarti/${aartiSlug}`}
                  className="px-4 py-2 rounded-lg bg-gold-primary/10 border border-gold-primary/20 text-gold-light text-sm hover:bg-gold-primary/20 transition-colors"
                >
                  {aartiSlug.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase())}
                </Link>
              ))}
            </div>
          </motion.section>
        )}

        {/* Katha Note */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45 }}
          className="rounded-2xl border border-gold-primary/20 bg-gradient-to-br from-[#2d1b69]/20 via-[#1a1040]/30 to-[#0a0e27] p-6 sm:p-8 mb-10"
        >
          <div className="flex gap-3">
            <BookOpen className="w-5 h-5 text-gold-primary flex-shrink-0 mt-0.5" />
            <p className={`text-text-secondary leading-relaxed text-sm ${isDev ? 'font-devanagari-body' : ''}`}>
              <span className="text-gold-light font-semibold">{title}</span>{' '}
              {L('kathaNote')}
            </p>
          </div>
        </motion.div>

        {/* Related Pages */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mb-10"
        >
          <h3 className={`text-lg font-bold text-gold-light mb-4 ${isDev ? 'font-devanagari-heading' : ''}`}>
            {L('relatedPages')}
          </h3>
          <div className="flex flex-wrap gap-3">
            {relatedLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="inline-flex items-center gap-1.5 text-sm text-gold-primary hover:text-gold-light border border-gold-primary/20 hover:border-gold-primary/40 rounded-lg px-3 py-1.5 transition-colors"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                {link.label}
              </Link>
            ))}
          </div>
        </motion.section>

        <GoldDivider className="my-12" />

        {/* More Kathas */}
        <section>
          <h2 className={`text-2xl font-bold text-gold-light mb-6 ${isDev ? 'font-devanagari-heading' : ''}`}>
            {L('readMore')}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {otherKathas.map((k) => (
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
