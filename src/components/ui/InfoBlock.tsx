'use client';

import { useState, useEffect, useCallback } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { HelpCircle, ChevronDown, ChevronUp } from 'lucide-react';

interface InfoBlockProps {
  id: string;
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}

export default function InfoBlock({
  id,
  title,
  children,
  defaultOpen = false,
}: InfoBlockProps) {
  const storageKey = `info_${id}`;
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    let initialOpen = defaultOpen;
    try {
      const dismissed = localStorage.getItem(storageKey);
      if (dismissed === '1') {
        initialOpen = false;
      }
    } catch {
      // localStorage not available
    }
    setIsOpen(initialOpen);
    setMounted(true);
  }, [storageKey, defaultOpen]);

  const toggle = useCallback(() => {
    setIsOpen((prev) => {
      const next = !prev;
      if (!next) {
        try {
          localStorage.setItem(storageKey, '1');
        } catch {
          // localStorage not available
        }
      } else {
        try {
          localStorage.removeItem(storageKey);
        } catch {
          // localStorage not available
        }
      }
      return next;
    });
  }, [storageKey]);

  if (!mounted) return null;

  return (
    <div className="my-3">
      <button
        onClick={toggle}
        className="flex items-center gap-2 text-sm text-[#d4a853]/70 hover:text-[#d4a853] transition-colors duration-200 group"
        aria-expanded={isOpen}
        aria-controls={`info-block-${id}`}
      >
        <span className="flex items-center justify-center w-5 h-5 rounded-full border border-[#d4a853]/40 group-hover:border-[#d4a853]/70 transition-colors duration-200">
          <HelpCircle className="w-3 h-3" />
        </span>
        <span className="font-medium">{title}</span>
        {isOpen ? (
          <ChevronUp className="w-3 h-3 opacity-60" />
        ) : (
          <ChevronDown className="w-3 h-3 opacity-60" />
        )}
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            id={`info-block-${id}`}
            key="content"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
            style={{ overflow: 'hidden' }}
          >
            <div
              className="mt-2 px-4 py-3 rounded-lg border text-sm leading-relaxed"
              style={{
                backgroundColor: 'rgba(212, 168, 83, 0.03)',
                borderColor: 'rgba(212, 168, 83, 0.2)',
                color: 'rgba(240, 212, 138, 0.85)',
              }}
            >
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
