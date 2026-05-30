'use client';

/**
 * DrishtiOverlay — visual layer for "click a planet → see its aspects".
 *
 * The overlay is **geometry-agnostic**: the caller passes the path strings
 * and centroids for each house in the chart's own SVG coordinate space.
 * That keeps the same component reusable for both North Indian (diamond)
 * and South Indian (rectangular grid) layouts — only the coordinates
 * differ between the two callers.
 *
 * Spec: `docs/design/drishti-overlay-spec.md` §6.2.
 */

import { useId } from 'react';
import styles from './DrishtiOverlay.module.css';

export interface DrishtiOverlayProps {
  /** SVG `d` path string for each house (1-12), in the chart's coordinate
   *  space. Used to draw the soft-gold fill + 2 px gold boundary on each
   *  aspected house. */
  housePaths: Record<number, string>;
  /** Centroid (cx, cy) of each house in the same coordinate space — used
   *  both as the comet origin (the house containing the selected planet)
   *  and as the comet landing point in each aspected house. */
  houseCentroids: Record<number, [number, number]>;
  /** The house index (1-12) currently containing the selected planet.
   *  Origin point of every comet. */
  sourceHouse: number;
  /** List of houses (1-12) that the selected planet aspects. Order matters
   *  — the first house in the list lands first (no delay), then each
   *  subsequent house gets a 350 ms reveal stagger and a 400 ms comet
   *  launch stagger. */
  aspectedHouses: readonly number[];
  /** When true, all reveal animations are disabled and the end state is
   *  shown immediately. Caller should derive this from
   *  `window.matchMedia('(prefers-reduced-motion: reduce)').matches` plus
   *  any in-app reduced-motion toggle. */
  reduceMotion?: boolean;
  /** Optional accessible label for the overlay region as a whole. The
   *  consumer also owns the aria-live announcer for selection changes. */
  ariaLabel?: string;
}

/**
 * The overlay renders **inside** the chart's existing `<svg>` element —
 * it does not own an `<svg>` of its own. Just compose:
 *
 *   <svg viewBox="0 0 500 500">
 *     {…chart contents…}
 *     {selectedPlanetId !== null && (
 *       <DrishtiOverlay … />
 *     )}
 *   </svg>
 */
export function DrishtiOverlay({
  housePaths,
  houseCentroids,
  sourceHouse,
  aspectedHouses,
  reduceMotion = false,
  ariaLabel,
}: DrishtiOverlayProps) {
  const [srcX, srcY] = houseCentroids[sourceHouse] ?? [0, 0];

  // Stable unique path IDs scoped to this overlay instance. If two charts
  // sit on the same page (e.g. a comparison view), we need distinct IDs
  // per overlay so SMIL `<mpath href="#…"/>` lookups don't cross-talk.
  // React's useId() handles SSR + concurrent rendering correctly; colons
  // are valid SVG id chars but we strip them for href readability.
  const reactId = useId().replace(/:/g, '');
  const idPrefix = `drishti-${reactId}-${sourceHouse}-${aspectedHouses.join('-')}`;

  return (
    <g
      data-reduce-motion={reduceMotion ? 'true' : undefined}
      role="presentation"
      aria-label={ariaLabel}
    >
      {/* ── Aspected house polygon fills + gold boundaries ── */}
      {aspectedHouses.map((house, idx) => {
        const path = housePaths[house];
        if (!path) return null;
        const delayClass =
          idx === 0 ? '' :
          idx === 1 ? styles.delay1 :
          styles.delay2;
        return (
          <path
            key={`house-${house}`}
            d={path}
            className={`${styles.houseActive} ${delayClass}`}
          />
        );
      })}

      {/* ── Static dashed guide paths source-house → destination ── */}
      {aspectedHouses.map((house) => {
        const dest = houseCentroids[house];
        if (!dest) return null;
        return (
          <path
            key={`path-${house}`}
            id={`${idPrefix}-${house}`}
            className={styles.cometPath}
            d={`M ${srcX} ${srcY} L ${dest[0]} ${dest[1]}`}
          />
        );
      })}

      {/* ── Persistent landed glow + ring at each destination ── */}
      {aspectedHouses.map((house, idx) => {
        const dest = houseCentroids[house];
        if (!dest) return null;
        // Sync each landed glow with its comet's arrival: comets launch
        // at idx*0.4s and fly for 1.8s, so they land at idx*0.4 + 1.8.
        // The previous idx*0.6 had the first glow already pulsing
        // before the first comet had even left.
        const delay = idx * 0.4 + 1.8;
        return (
          <g key={`landed-${idPrefix}-${house}`}>
            <circle
              cx={dest[0]} cy={dest[1]} r="6"
              className={styles.landedGlow}
              style={{ animationDelay: `${delay}s` }}
            />
            <circle
              cx={dest[0]} cy={dest[1]} r="6"
              className={styles.landedRing}
              style={{ animationDelay: `${delay}s` }}
            />
          </g>
        );
      })}

      {/* ── Comets flying along each guide path ─────────────── */}
      {!reduceMotion && aspectedHouses.map((house, idx) => {
        const begin = idx * 0.4; // 0s, 0.4s, 0.8s
        return (
          <circle key={`comet-${idPrefix}-${house}`} r="3.5" className={styles.comet}>
            <animateMotion
              dur="1.8s"
              begin={`${begin}s`}
              repeatCount="indefinite"
              rotate="auto"
            >
              <mpath href={`#${idPrefix}-${house}`} />
            </animateMotion>
          </circle>
        );
      })}
    </g>
  );
}

export default DrishtiOverlay;
