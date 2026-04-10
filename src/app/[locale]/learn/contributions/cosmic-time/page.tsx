'use client';

import { useLocale } from 'next-intl';
import { motion } from 'framer-motion';
import { Link } from '@/lib/i18n/navigation';
import type { Locale } from '@/types/panchang';

const L = {
  title: { en: 'Cosmic Time — India\'s Billion-Year Calendar', hi: 'ब्रह्माण्डीय काल — भारत का अरब-वर्षीय कैलेंडर' },
  subtitle: {
    en: 'While other civilizations measured creation in thousands of years, Vedic cosmology spoke of billions — with a cyclic model that resonates with modern cosmology.',
    hi: 'जबकि अन्य सभ्यताओं ने सृष्टि को हजारों वर्षों में मापा, वैदिक ब्रह्माण्ड विज्ञान ने अरबों की बात की — एक चक्रीय मॉडल के साथ जो आधुनिक ब्रह्माण्ड विज्ञान से मेल खाता है।',
  },
  backLink: { en: '← Back to Learn', hi: '← सीखने पर वापस' },
};

export default function CosmicTimePage() {
  const locale = useLocale() as Locale;
  const isHi = locale !== 'en';
  const hf = isHi ? { fontFamily: 'var(--font-devanagari-heading)' } : { fontFamily: 'var(--font-heading)' };
  const l = (obj: { en: string; hi: string }) => (isHi ? obj.hi : obj.en);

  return (
    <div className="space-y-10">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
        <h2 className="text-3xl font-bold text-gold-gradient mb-3" style={hf}>{l(L.title)}</h2>
        <p className="text-text-secondary text-sm leading-relaxed max-w-3xl">{l(L.subtitle)}</p>
      </motion.div>

      <div className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-2xl p-8 text-center">
        <p className="text-text-secondary text-sm">{isHi ? 'यह पृष्ठ जल्द आ रहा है।' : 'This page is coming soon.'}</p>
      </div>

      <div className="pt-4">
        <Link href="/learn" className="text-text-secondary hover:text-gold-light text-sm transition-colors">
          {l(L.backLink)}
        </Link>
      </div>
    </div>
  );
}
