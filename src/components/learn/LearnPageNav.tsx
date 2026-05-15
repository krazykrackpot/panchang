'use client';

/**
 * Next/Previous navigation for standalone learn pages.
 *
 * Auto-detects the current page from the URL pathname, looks it up in
 * MODULE_SEQUENCE, and renders prev/next links. Renders nothing if the
 * page isn't in the curriculum sequence (e.g. the learn landing page).
 *
 * Drop this component into any learn page layout or individual page to
 * get curriculum navigation without passing props.
 */

import { usePathname } from 'next/navigation';
import { useLocale } from 'next-intl';
import { Link } from '@/lib/i18n/navigation';
import { MODULE_SEQUENCE, getModuleRef, getNextModuleId, getPrevModuleId } from '@/lib/learn/module-sequence';
import { ChevronLeft, ChevronRight, BookOpen } from 'lucide-react';
import { isDevanagariLocale, getHeadingFont } from '@/lib/utils/locale-fonts';

function tl(obj: Record<string, string> | undefined, locale: string): string {
  if (!obj) return '';
  return obj[locale] || obj.en || '';
}

export default function LearnPageNav() {
  const pathname = usePathname();
  const locale = useLocale();
  const hf = getHeadingFont(locale);

  // Extract the learn page slug from pathname: /en/learn/grahas → grahas
  const parts = pathname.split('/');
  const learnIdx = parts.indexOf('learn');
  if (learnIdx < 0 || learnIdx + 1 >= parts.length) return null;

  const slug = parts[learnIdx + 1];

  // Skip for the learn landing page itself, module pages (have their own nav), and yoga detail pages
  if (!slug || slug === 'modules' || slug === 'yoga') return null;

  // Look up in MODULE_SEQUENCE by href match
  const currentModule = MODULE_SEQUENCE.find(m => m.href === `/learn/${slug}`);
  if (!currentModule) return null;

  const prevId = getPrevModuleId(currentModule.id);
  const nextId = getNextModuleId(currentModule.id);
  const prevModule = prevId ? getModuleRef(prevId) : null;
  const nextModule = nextId ? getModuleRef(nextId) : null;

  // Resolve href: numbered modules go to /learn/modules/X-Y, standalone go to their href
  const resolveHref = (mod: typeof currentModule) => {
    if (mod.href) return mod.href as any;
    return `/learn/modules/${mod.id}` as any;
  };

  return (
    <nav className="mt-10 pt-6 border-t border-gold-primary/10 flex items-center justify-between gap-4">
      {prevModule ? (
        <Link
          href={resolveHref(prevModule)}
          className="flex items-center gap-2 text-sm text-gold-primary hover:text-gold-light transition-colors group min-w-0"
        >
          <ChevronLeft size={16} className="shrink-0 group-hover:-translate-x-0.5 transition-transform" />
          <div className="min-w-0">
            <div className="text-[10px] text-text-secondary uppercase tracking-wider">Previous</div>
            <div className="text-xs font-medium truncate" style={hf}>{tl(prevModule.title, locale)}</div>
          </div>
        </Link>
      ) : <div />}

      <Link
        href={'/learn' as any}
        className="shrink-0 text-text-secondary hover:text-gold-light transition-colors"
        title="Back to Learning Path"
      >
        <BookOpen size={18} />
      </Link>

      {nextModule ? (
        <Link
          href={resolveHref(nextModule)}
          className="flex items-center gap-2 text-sm text-gold-primary hover:text-gold-light transition-colors group min-w-0 text-right"
        >
          <div className="min-w-0">
            <div className="text-[10px] text-text-secondary uppercase tracking-wider">Next</div>
            <div className="text-xs font-medium truncate" style={hf}>{tl(nextModule.title, locale)}</div>
          </div>
          <ChevronRight size={16} className="shrink-0 group-hover:translate-x-0.5 transition-transform" />
        </Link>
      ) : <div />}
    </nav>
  );
}
