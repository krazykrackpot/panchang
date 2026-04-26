'use client';

import { Link } from '@/lib/i18n/navigation';
import { BookOpen } from 'lucide-react';

/**
 * Small inline "Learn more" link used next to panchang elements, tool sections, etc.
 * Unobtrusive helper — text-xs, gold color, with a subtle arrow.
 */
interface LearnLinkProps {
  /** Route path, e.g. "/learn/tithis" */
  href: string;
  /** Display label, e.g. "Learn about Tithis" */
  label: string;
  /** Optional extra Tailwind classes */
  className?: string;
  /** Show the BookOpen icon (default: false — arrow only) */
  showIcon?: boolean;
}

export default function LearnLink({ href, label, className = '', showIcon = false }: LearnLinkProps) {
  return (
    <Link
      href={href}
      className={`inline-flex items-center gap-1 text-xs text-gold-primary/70 hover:text-gold-light transition-colors group ${className}`}
    >
      {showIcon && <BookOpen className="w-3 h-3 shrink-0 opacity-70 group-hover:opacity-100" />}
      <span>{label}</span>
      <span className="transition-transform group-hover:translate-x-0.5" aria-hidden="true">&rarr;</span>
    </Link>
  );
}
