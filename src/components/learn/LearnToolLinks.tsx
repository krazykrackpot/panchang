'use client';

/**
 * Renders "Try the Tool" links on learn pages — the reverse direction of
 * the tool→learn cross-links that already work on tool pages.
 *
 * Uses the pathname to look up related tools from the LEARN_TO_TOOL map.
 * Renders nothing if no tools are mapped for the current learn page.
 */

import { usePathname } from 'next/navigation';
import { getToolLinksForLearn, type CrossLinkEntry } from '@/lib/seo/cross-links';
import { Link } from '@/lib/i18n/navigation';
import { ArrowRight } from 'lucide-react';

export default function LearnToolLinks() {
  const pathname = usePathname();
  if (!pathname) return null;

  // Strip locale prefix: /en/learn/sade-sati → /learn/sade-sati
  const segments = pathname.split('/');
  const learnRoute = '/' + segments.slice(2).join('/');

  const links = getToolLinksForLearn(learnRoute);
  if (links.length === 0) return null;

  return (
    <div className="mt-10 pt-6 border-t border-gold-primary/15">
      <h3 className="text-sm font-semibold text-gold-dark uppercase tracking-wider mb-3">
        Try the Tool
      </h3>
      <div className="flex flex-wrap gap-2">
        {links.map((link: CrossLinkEntry) => (
          <Link
            key={link.href}
            href={link.href}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-gradient-to-r from-gold-primary/10 to-amber-500/5 border border-gold-primary/20 text-gold-light hover:border-gold-primary/40 hover:from-gold-primary/15 transition-all"
          >
            {link.label}
            <ArrowRight className="w-3 h-3" />
          </Link>
        ))}
      </div>
    </div>
  );
}
