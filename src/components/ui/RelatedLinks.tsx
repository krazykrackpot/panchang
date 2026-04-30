'use client';

import { Link } from '@/lib/i18n/navigation';
import { BookOpen, Wrench } from 'lucide-react';
import type { CrossLinkEntry } from '@/lib/seo/cross-links';

interface RelatedLinksProps {
  /** "learn" = tool page linking to learn pages; "tool" = learn page linking to tools */
  type: 'learn' | 'tool';
  links: CrossLinkEntry[];
  /** Optional locale for heading text */
  locale?: string;
  className?: string;
}

const HEADINGS: Record<string, Record<string, string>> = {
  learn: {
    en: 'Deepen Your Knowledge',
    hi: 'अपना ज्ञान बढ़ाएँ',
    ta: 'உங்கள் அறிவை ஆழப்படுத்துங்கள்',
    bn: 'আপনার জ্ঞান গভীর করুন',
    te: 'మీ జ్ఞానాన్ని పెంచుకోండి',
    gu: 'તમારું જ્ઞાન વધારો',
    kn: 'ನಿಮ್ಮ ಜ್ಞಾನವನ್ನು ಹೆಚ್ಚಿಸಿ',
  },
  tool: {
    en: 'Try the Tool',
    hi: 'उपकरण आज़माएँ',
    ta: 'கருவியை முயற்சிக்கவும்',
    bn: 'সরঞ্জামটি ব্যবহার করুন',
    te: 'సాధనాన్ని ప్రయత్నించండి',
    gu: 'સાધન અજમાવો',
    kn: 'ಉಪಕರಣವನ್ನು ಪ್ರಯತ್ನಿಸಿ',
  },
};

/**
 * Reusable cross-linking section for SEO internal linking.
 * Renders a row of pill links with icon, label, and optional description.
 */
export default function RelatedLinks({ type, links, locale = 'en', className = '' }: RelatedLinksProps) {
  if (links.length === 0) return null;

  const heading = HEADINGS[type][locale] ?? HEADINGS[type].en;
  const Icon = type === 'learn' ? BookOpen : Wrench;

  return (
    <section className={`mt-8 mb-4 ${className}`}>
      <h3 className="flex items-center gap-2 text-sm font-semibold text-gold-dark uppercase tracking-[2px] mb-3">
        <Icon size={14} className="text-gold-primary" />
        {heading}
      </h3>
      <div className="flex flex-wrap gap-2">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="group inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-br from-[#2d1b69]/30 via-[#1a1040]/40 to-[#0a0e27] border border-white/8 text-text-primary hover:border-gold-primary/40 hover:text-gold-light transition-all text-sm"
          >
            <span className="font-medium">{link.label}</span>
            {link.description && (
              <span className="hidden sm:inline text-text-secondary text-xs group-hover:text-gold-dark transition-colors">
                &mdash; {link.description}
              </span>
            )}
          </Link>
        ))}
      </div>
    </section>
  );
}
