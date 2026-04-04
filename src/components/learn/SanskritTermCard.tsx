'use client';

import { motion } from 'framer-motion';

interface SanskritTermCardProps {
  term: string;
  transliteration: string;
  meaning: string;
  devanagari?: string;
}

export default function SanskritTermCard({ term, transliteration, meaning, devanagari }: SanskritTermCardProps) {
  return (
    <motion.div
      whileHover={{ y: -2 }}
      className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-lg p-4 text-center"
    >
      {devanagari && (
        <div className="text-2xl text-gold-primary mb-1" style={{ fontFamily: 'var(--font-devanagari-heading)' }}>
          {devanagari}
        </div>
      )}
      <div className="text-gold-light font-semibold text-sm" style={{ fontFamily: 'var(--font-heading)' }}>
        {term}
      </div>
      {transliteration !== term && (
        <div className="text-text-secondary/60 text-xs italic mt-0.5">{transliteration}</div>
      )}
      <div className="text-text-secondary text-xs mt-1">{meaning}</div>
    </motion.div>
  );
}
