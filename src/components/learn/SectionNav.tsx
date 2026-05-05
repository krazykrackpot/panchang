'use client';

import { useState, useEffect, useCallback } from 'react';
import { List, X, ChevronUp } from 'lucide-react';

interface Section {
  id: string;
  label: string;
}

interface SectionNavProps {
  sections: Section[];
}

/**
 * Floating section navigation for long learn pages.
 * Mobile: bottom-right pill that expands into a jump menu.
 * Desktop: hidden (pages are manageable width on desktop).
 *
 * Also shows a "back to top" button when scrolled past the first section.
 */
export default function SectionNav({ sections }: SectionNavProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('');
  const [showNav, setShowNav] = useState(false);

  // Track which section is in view
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        }
      },
      { rootMargin: '-80px 0px -60% 0px', threshold: 0 }
    );

    for (const s of sections) {
      const el = document.getElementById(s.id);
      if (el) observer.observe(el);
    }

    return () => observer.disconnect();
  }, [sections]);

  // Show nav only after scrolling past 400px
  useEffect(() => {
    const onScroll = () => setShowNav(window.scrollY > 400);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const jumpTo = useCallback((id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
      setIsOpen(false);
    }
  }, []);

  const scrollToTop = useCallback(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setIsOpen(false);
  }, []);

  if (!showNav || sections.length < 3) return null;

  return (
    <>
      {/* Expanded menu */}
      {isOpen && (
        <div className="fixed inset-0 z-40 bg-black/40" onClick={() => setIsOpen(false)} />
      )}

      <div className={`fixed bottom-6 right-4 z-50 transition-all duration-200 ${isOpen ? 'bottom-0 right-0 left-0' : ''}`}>
        {isOpen ? (
          /* Expanded section list */
          <div className="bg-bg-primary/95 backdrop-blur-xl border-t border-gold-primary/20 rounded-t-2xl shadow-2xl shadow-black/40 max-h-[60vh] overflow-y-auto overscroll-contain p-4 pb-8">
            <div className="flex items-center justify-between mb-3">
              <span className="text-gold-light text-sm font-semibold">Jump to section</span>
              <button onClick={() => setIsOpen(false)} className="p-2 text-text-secondary hover:text-gold-light">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="space-y-1">
              {sections.map((s) => (
                <button
                  key={s.id}
                  onClick={() => jumpTo(s.id)}
                  className={`w-full text-left px-3 py-2.5 rounded-lg text-sm transition-colors ${
                    activeSection === s.id
                      ? 'bg-gold-primary/15 text-gold-light font-medium'
                      : 'text-text-secondary hover:text-text-primary hover:bg-white/5'
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>
            <button
              onClick={scrollToTop}
              className="w-full mt-3 px-3 py-2.5 rounded-lg text-sm text-gold-dark hover:text-gold-light hover:bg-white/5 transition-colors flex items-center gap-2 justify-center border-t border-gold-primary/10 pt-3"
            >
              <ChevronUp className="w-3.5 h-3.5" />
              Back to top
            </button>
          </div>
        ) : (
          /* Collapsed pill button */
          <div className="flex gap-2">
            <button
              onClick={scrollToTop}
              className="w-10 h-10 rounded-full bg-bg-primary/90 backdrop-blur-lg border border-gold-primary/20 shadow-lg shadow-black/30 flex items-center justify-center text-gold-primary hover:text-gold-light hover:border-gold-primary/40 transition-all"
              aria-label="Back to top"
            >
              <ChevronUp className="w-4 h-4" />
            </button>
            <button
              onClick={() => setIsOpen(true)}
              className="h-10 px-4 rounded-full bg-bg-primary/90 backdrop-blur-lg border border-gold-primary/20 shadow-lg shadow-black/30 flex items-center gap-2 text-gold-primary hover:text-gold-light hover:border-gold-primary/40 transition-all"
              aria-label="Jump to section"
            >
              <List className="w-4 h-4" />
              <span className="text-xs font-medium">Sections</span>
            </button>
          </div>
        )}
      </div>
    </>
  );
}
