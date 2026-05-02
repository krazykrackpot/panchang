'use client';

import { useLocale } from 'next-intl';
import { motion } from 'framer-motion';
import { BookOpen, Calendar, Star } from 'lucide-react';
import GoldDivider from '@/components/ui/GoldDivider';
import { Link } from '@/lib/i18n/navigation';
import { isDevanagariLocale } from '@/lib/utils/locale-fonts';
import AuthorByline from '@/components/ui/AuthorByline';
import { VRAT_KATHAS } from '@/lib/content/vrat-kathas';

const LABELS = {
  title: { en: 'Vrat Katha Reference', hi: 'व्रत कथा संदर्भ' },
  subtitle: {
    en: '10 sacred vrats — deity, timing, vidhi & significance at a glance',
    hi: '10 पवित्र व्रत — देवता, समय, विधि एवं महत्व एक नज़र में',
  },
  vratName: { en: 'Vrat', hi: 'व्रत' },
  deity: { en: 'Deity', hi: 'देवता' },
  when: { en: 'When', hi: 'कब' },
  significance: { en: 'Significance', hi: 'महत्व' },
  viewDetails: { en: 'View Details', hi: 'विवरण देखें' },
  note: {
    en: 'Each katha is a sacred text that deserves to be read in its traditional form. We provide the practical reference — timing, vidhi, and significance — and recommend consulting your family pandit or a trusted publication for the complete narrative.',
    hi: 'प्रत्येक कथा एक पवित्र ग्रन्थ है जिसे उसके पारम्परिक रूप में पढ़ना चाहिए। हम व्यावहारिक संदर्भ — समय, विधि और महत्व — प्रदान करते हैं और पूर्ण कथा के लिए पारिवारिक पण्डित या विश्वसनीय प्रकाशन की सलाह देते हैं।',
  },
};

export default function VratKathaHubPage() {
  const locale = useLocale();
  const isDev = isDevanagariLocale(locale);
  const L = (key: keyof typeof LABELS) => (LABELS[key] as Record<string, string>)[locale] || (LABELS[key] as Record<string, string>).en;

  return (
    <main className="min-h-screen bg-bg-primary pt-24 pb-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        {/* Hero */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10">
          <div className="inline-flex items-center gap-3 mb-4">
            <BookOpen className="w-8 h-8 text-gold-primary" />
            <h1 className={`text-3xl sm:text-4xl font-bold text-gold-light ${isDev ? 'font-devanagari-heading' : ''}`}>
              {L('title')}
            </h1>
          </div>
          <p className={`text-text-secondary max-w-2xl mx-auto ${isDev ? 'font-devanagari-body' : ''}`}>
            {L('subtitle')}
          </p>
        </motion.div>

        <GoldDivider className="mb-10" />

        {/* Note about authentic kathas */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="rounded-2xl border border-gold-primary/20 bg-gradient-to-br from-[#2d1b69]/20 via-[#1a1040]/30 to-[#0a0e27] p-5 sm:p-6 mb-10"
        >
          <div className="flex gap-3">
            <BookOpen className="w-5 h-5 text-gold-primary flex-shrink-0 mt-0.5" />
            <p className={`text-text-secondary text-sm leading-relaxed ${isDev ? 'font-devanagari-body' : ''}`}>
              {L('note')}
            </p>
          </div>
        </motion.div>

        {/* Vrat Table — card-based for mobile friendliness */}
        <div className="space-y-4">
          {VRAT_KATHAS.map((katha, idx) => {
            const title = (katha.title as Record<string, string>)[locale] || katha.title.en;
            const deity = (katha.deity as Record<string, string>)[locale] || katha.deity.en;
            const when = (katha.whenObserved as Record<string, string>)[locale] || katha.whenObserved.en;
            const overview = (katha.overview as Record<string, string>)[locale] || katha.overview.en;
            // Take only the first sentence of overview for the table
            const briefOverview = overview.split('. ').slice(0, 1).join('. ') + '.';

            return (
              <motion.div
                key={katha.slug}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + idx * 0.04 }}
              >
                <Link
                  href={`/vrat-katha/${katha.slug}`}
                  className="block rounded-2xl border border-gold-primary/12 bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] p-5 sm:p-6 hover:border-gold-primary/40 transition-colors group"
                >
                  {/* Top: Title + Deity */}
                  <div className="flex items-start justify-between gap-4 mb-3">
                    <div>
                      <h2 className={`text-lg sm:text-xl font-bold text-gold-light group-hover:text-gold-primary transition-colors ${isDev ? 'font-devanagari-heading' : ''}`}>
                        {title}
                      </h2>
                      <p className="text-text-secondary text-sm mt-0.5">
                        <Star className="w-3.5 h-3.5 inline mr-1 text-gold-primary/60" />
                        {deity}
                      </p>
                    </div>
                    <span className="text-gold-primary text-xs uppercase tracking-wider font-semibold whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
                      {L('viewDetails')} &rarr;
                    </span>
                  </div>

                  {/* When */}
                  <div className="flex items-start gap-2 mb-2">
                    <Calendar className="w-4 h-4 text-gold-primary/60 flex-shrink-0 mt-0.5" />
                    <p className={`text-text-primary text-sm leading-relaxed ${isDev ? 'font-devanagari-body' : ''}`}>
                      {when}
                    </p>
                  </div>

                  {/* Brief significance */}
                  <p className={`text-text-secondary text-sm leading-relaxed ${isDev ? 'font-devanagari-body' : ''}`}>
                    {briefOverview}
                  </p>
                </Link>
              </motion.div>
            );
          })}
        </div>

        <GoldDivider className="my-12" />
        <AuthorByline />
      </div>
    </main>
  );
}
