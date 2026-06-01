'use client';

import { useLocale } from 'next-intl';
import { motion } from 'framer-motion';
import { Link } from '@/lib/i18n/navigation';
import { COMPETITORS } from '@/lib/seo/competitors';

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

// Renders a cross-link block linking the OTHER 4 /vs/ pages. Mounted on
// each /vs/<slug>/page.tsx to densify the internal-link graph — without
// inbound links, Google deprioritises crawl + indexation. (Lesson D —
// unlinked pages are dead pages.)
export function CompareOthers({ currentSlug }: Props) {
  const locale = useLocale();
  const isHi = locale === 'hi';
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
        {isHi ? 'अन्य पंचांग प्लेटफ़ॉर्म से तुलना' : 'Compare with other panchang platforms'}
      </p>
      <div className="flex flex-wrap justify-center gap-3">
        {others.map(c => (
          <Link
            key={c.slug}
            href={`/vs/${c.slug}`}
            className="inline-flex items-center px-4 py-2 rounded-lg border border-gold-primary/20 bg-bg-secondary/50 text-text-primary text-sm hover:border-gold-primary/40 hover:text-gold-light transition-all"
          >
            {isHi ? c.hiName : c.displayName}
          </Link>
        ))}
      </div>
    </motion.div>
  );
}
