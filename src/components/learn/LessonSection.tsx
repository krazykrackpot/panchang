'use client';

import { motion } from 'framer-motion';
import type { ReactNode } from 'react';

interface LessonSectionProps {
  number?: number;
  title: string;
  children: ReactNode;
  illustration?: ReactNode;
  variant?: 'default' | 'highlight' | 'formula';
}

export default function LessonSection({ number, title, children, illustration, variant = 'default' }: LessonSectionProps) {
  const bgClass = variant === 'highlight'
    ? 'bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 border-gold-primary/20'
    : variant === 'formula'
    ? 'bg-bg-primary/50 border border-gold-primary/10'
    : 'bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12';

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.5 }}
      className={`rounded-xl p-6 sm:p-8 mb-6 ${bgClass}`}
    >
      <div className="flex items-start gap-4 mb-4">
        {number !== undefined && (
          <span className="flex-shrink-0 w-8 h-8 rounded-full bg-gold-primary/15 border border-gold-primary/30 flex items-center justify-center text-gold-light text-sm font-bold">
            {number}
          </span>
        )}
        <h3 className="text-xl sm:text-2xl font-bold text-gold-gradient" style={{ fontFamily: 'var(--font-heading)' }}>
          {title}
        </h3>
      </div>
      <div className={`${number !== undefined ? 'ml-12' : ''}`}>
        {illustration && (
          <div className="mb-6 flex justify-center">
            {illustration}
          </div>
        )}
        <div className="text-text-secondary text-base leading-relaxed space-y-4">
          {children}
        </div>
      </div>
    </motion.section>
  );
}
