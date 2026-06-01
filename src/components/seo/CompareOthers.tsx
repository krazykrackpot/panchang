'use client';

import { useLocale } from 'next-intl';
import { motion } from 'framer-motion';
import { Link } from '@/lib/i18n/navigation';
import { COMPETITORS } from '@/lib/seo/competitors';
import { isDevanagariLocale } from '@/lib/utils/locale-fonts';

interface Props {
  currentSlug: string;
}

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.05, duration: 0.4, ease: 'easeOut' as const },
  }),
};

// Section header translated across all 10 supported locales. `t()`
// below falls back to EN when a key is absent, but Maithili is the #1
// traffic driver so the keys are populated explicitly.
const HEADER = {
  en:  'Compare with other panchang platforms',
  hi:  'अन्य पंचांग प्लेटफ़ॉर्म से तुलना',
  sa:  'अन्यैः पञ्चाङ्ग-संस्थानैः सह तुलनम्',
  mr:  'इतर पंचांग प्लॅटफॉर्मशी तुलना',
  mai: 'आन पंचांग प्लेटफॉर्म सँग तुलना',
  ta:  'மற்ற பஞ்சாங்க தளங்களுடன் ஒப்பிடவும்',
  bn:  'অন্যান্য পঞ্জিকা প্ল্যাটফর্মের সাথে তুলনা',
  te:  'ఇతర పంచాంగ ప్లాట్‌ఫామ్‌లతో పోలిక',
  gu:  'અન્ય પંચાંગ પ્લેટફોર્મ સાથે સરખામણી',
  kn:  'ಇತರ ಪಂಚಾಂಗ ಪ್ಲಾಟ್‌ಫಾರ್ಮ್‌ಗಳೊಂದಿಗೆ ಹೋಲಿಕೆ',
};

function t(obj: Record<string, string>, locale: string): string {
  return obj[locale] || obj.en || '';
}

// Renders a cross-link block linking the OTHER 4 /vs/ pages. Mounted on
// each /vs/<slug>/page.tsx to densify the internal-link graph — without
// inbound links, Google deprioritises crawl + indexation. (Lesson D —
// unlinked pages are dead pages.)
export function CompareOthers({ currentSlug }: Props) {
  const locale = useLocale();
  const useDevanagari = isDevanagariLocale(locale);
  const others = COMPETITORS.filter(c => c.slug !== currentSlug);

  return (
    <motion.div
      custom={9.5}
      initial="hidden"
      animate="visible"
      variants={fadeUp}
      className="mb-10 px-4 py-5 rounded-xl border border-gold-primary/12 bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27]"
    >
      <p className="text-xs uppercase tracking-widest text-gold-dark mb-4 text-center font-semibold">
        {t(HEADER, locale)}
      </p>
      <div className="flex flex-wrap justify-center gap-3">
        {others.map(c => (
          <Link
            key={c.slug}
            href={`/vs/${c.slug}`}
            className="inline-flex items-center px-4 py-2 rounded-lg border border-gold-primary/20 bg-bg-secondary/50 text-text-primary text-sm hover:border-gold-primary/40 hover:text-gold-light transition-all"
          >
            {useDevanagari ? c.hiName : c.displayName}
          </Link>
        ))}
      </div>
    </motion.div>
  );
}
