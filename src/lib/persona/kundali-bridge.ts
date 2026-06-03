/**
 * Bridge between the sitewide persona context (beginner / enthusiast /
 * acharya) and the kundali page's per-page view mode (simple /
 * detailed / expert).
 *
 * Read-direction only. The persona context provides the DEFAULT mode
 * for /kundali when no explicit per-page override exists. The kundali
 * page's own ViewModeToggle still owns the user-facing UI — clicking
 * a tab writes to `kundali-view-mode-v3` and that storage wins over
 * the persona-derived default on subsequent visits.
 *
 * Why this split exists:
 *   - Persona is a sitewide hint — used by /matching, /sade-sati, the
 *     daily briefing, and (eventually) every persona-aware surface.
 *   - Kundali view-mode is a per-page override — a user who's broadly
 *     "enthusiast" but wants to dig into the technical tabs on this
 *     particular chart should be able to without changing their
 *     sitewide persona.
 *
 * The persona spec (PR #379) intends to collapse these into one system
 * in v2 (PR-7, ~2 weeks after shipping). For now both coexist with
 * this bridge.
 *
 * See:
 *   docs/superpowers/specs/2026-06-03-persona-mode-setting-v1-design.md
 *   docs/internals/kundali-persona-bridge.md
 */

import type { PersonaMode } from './types';
import type { KundaliViewMode } from '@/components/kundali/simple/ViewModeToggle';

/**
 * Map a sitewide persona to the kundali page's default view mode.
 *
 *   beginner   → simple   (Cosmic identity + 4 domain cards)
 *   enthusiast → detailed (Personalised Life Summary + deep-dives)
 *   acharya    → expert   (Technical tabs — chart, dasha, vargas, KP, …)
 *
 * The mapping is total — every PersonaMode produces a kundali mode.
 * No fallback branch needed at call sites.
 */
export function personaToKundali(persona: PersonaMode): KundaliViewMode {
  switch (persona) {
    case 'beginner':
      return 'simple';
    case 'enthusiast':
      return 'detailed';
    case 'acharya':
      return 'expert';
  }
}
