'use client';

/**
 * Auto-tracks progress for standalone learn pages (those without ModuleContainer).
 *
 * On mount: marks the page as `in_progress` (markPageRead).
 * After 30 seconds of reading: marks as `mastered` (markComplete).
 *
 * Only fires for pages that exist in MODULE_SEQUENCE with an `href`.
 * Pages already mastered are not downgraded.
 */

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { useLearningProgressStore } from '@/stores/learning-progress-store';
import { MODULE_SEQUENCE } from '@/lib/learn/module-sequence';

const MASTERY_READ_TIME_MS = 30_000; // 30 seconds of reading → mastered

export function useLearnPageProgress() {
  const pathname = usePathname();
  const { markPageRead, markComplete, hydrateFromStorage, hydrated } = useLearningProgressStore();
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!hydrated) hydrateFromStorage();
  }, [hydrated, hydrateFromStorage]);

  useEffect(() => {
    // Extract slug: /en/learn/grahas → grahas
    const parts = pathname.split('/');
    const learnIdx = parts.indexOf('learn');
    if (learnIdx < 0 || learnIdx + 1 >= parts.length) return;
    const slug = parts[learnIdx + 1];

    // Skip module pages (they have their own tracking via ModuleContainer)
    if (!slug || slug === 'modules' || slug === 'yoga') return;

    // Find matching curriculum entry
    const mod = MODULE_SEQUENCE.find(m => m.href === `/learn/${slug}`);
    if (!mod) return;

    // Mark as in_progress immediately
    markPageRead(mod.id, 0);

    // Mark as mastered after 30s of reading
    timerRef.current = setTimeout(() => {
      markComplete(mod.id);
    }, MASTERY_READ_TIME_MS);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [pathname, markPageRead, markComplete]);
}
