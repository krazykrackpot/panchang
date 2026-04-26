'use client';

import { BookOpen } from 'lucide-react';

/**
 * Lookup table of common classical texts referenced across learn pages.
 * Used by ClassicalReference to auto-fill metadata when only shortName is provided.
 */
const CLASSICAL_TEXTS: Record<string, { fullName: string; author: string; era: string; about: string }> = {
  'BPHS': {
    fullName: 'Brihat Parashara Hora Shastra',
    author: 'Maharishi Parashara',
    era: '~1st century CE',
    about: 'The foundational text of Vedic astrology, covering chart interpretation, dashas, yogas, and predictive techniques.',
  },
  'SS': {
    fullName: 'Surya Siddhanta',
    author: 'Unknown (divine revelation tradition)',
    era: '~4th century CE',
    about: 'The primary Indian astronomical treatise, covering planetary positions, eclipses, and timekeeping.',
  },
  'Meeus': {
    fullName: 'Astronomical Algorithms',
    author: 'Jean Meeus',
    era: '1991',
    about: 'The modern reference for astronomical computations, used worldwide for planetary position calculations.',
  },
  'BS': {
    fullName: 'Brihat Samhita',
    author: 'Varahamihira',
    era: '~6th century CE',
    about: 'Encyclopedia of astrology, gemology, architecture, and natural phenomena.',
  },
  'JP': {
    fullName: 'Jataka Parijata',
    author: 'Vaidyanatha Dikshita',
    era: '~14th century CE',
    about: 'Comprehensive treatise on natal astrology and chart interpretation.',
  },
  'PD': {
    fullName: 'Phaladeepika',
    author: 'Mantreshwara',
    era: '~13th century CE',
    about: 'Popular text on predictive astrology, yogas, and dasha interpretation.',
  },
  'MC': {
    fullName: 'Muhurta Chintamani',
    author: 'Ram Daivagya',
    era: '~16th century CE',
    about: 'The definitive guide to electional astrology (muhurta selection).',
  },
  'CS': {
    fullName: 'Charaka Samhita',
    author: 'Acharya Charaka',
    era: '~2nd century BCE',
    about: 'Foundational Ayurvedic medical text covering constitution, disease, and treatment.',
  },
};

/**
 * Helper to look up a classical text by its short name.
 * Returns the full metadata object, or undefined if not found.
 */
export function getRef(shortName: string) {
  return CLASSICAL_TEXTS[shortName];
}

interface ClassicalReferenceProps {
  text?: string;
  shortName: string;
  author?: string;
  era?: string;
  chapter?: string;
  topic?: string;
  locale?: string;
}

export default function ClassicalReference({
  text,
  shortName,
  author,
  era,
  chapter,
  topic,
}: ClassicalReferenceProps) {
  const lookup = CLASSICAL_TEXTS[shortName];

  const displayName = text ?? lookup?.fullName ?? shortName;
  const displayAuthor = author ?? lookup?.author;
  const displayEra = era ?? lookup?.era;

  return (
    <div className="rounded-lg bg-bg-secondary/50 border border-gold-primary/10 px-4 py-3 my-4">
      <div className="flex items-start gap-3">
        <BookOpen className="w-4 h-4 text-gold-primary/60 flex-shrink-0 mt-0.5" />
        <div className="min-w-0">
          <div className="flex flex-wrap items-baseline gap-x-2">
            <span className="text-sm font-semibold text-gold-light">
              {displayName}
            </span>
            {shortName !== displayName && (
              <span className="text-xs text-text-secondary/60">
                ({shortName})
              </span>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-x-3 mt-1 text-xs text-text-secondary">
            {displayAuthor && <span>{displayAuthor}</span>}
            {displayEra && (
              <span className="text-text-secondary/50">{displayEra}</span>
            )}
            {chapter && (
              <span className="text-gold-primary/50">{chapter}</span>
            )}
          </div>

          {topic && (
            <p className="text-xs text-text-secondary/70 mt-1 italic">
              {topic}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
