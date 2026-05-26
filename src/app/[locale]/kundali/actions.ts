'use server';

import { generateKundali } from '@/lib/ephem/kundali-calc';
import { generateTippanni } from '@/lib/kundali/tippanni-engine';
import { generateVargaTippanni } from '@/lib/tippanni/varga-tippanni';
import type { BirthData } from '@/types/kundali';
import type { TippanniContent } from '@/lib/kundali/tippanni-types';
import type { VargaSynthesis } from '@/lib/tippanni/varga-tippanni';
import type { Locale } from '@/types/panchang';

/**
 * Bundle the two heaviest client-side compute passes (tippanni + varga
 * tippanni) into a Server Action. The kundali itself is already computed
 * server-side via /api/kundali; this completes the move of the insight
 * layer off the main thread.
 *
 * Why a Server Action and not an additional API route:
 *   - The compute reads from the same trilingual constants the existing
 *     api/kundali route uses, so we're already paying the bundle cost on
 *     the server.
 *   - Server Actions auto-handle the serialization round-trip + Next.js
 *     provides progressive enhancement (the click handler stays a normal
 *     async function on the client).
 *
 * Why we accept `BirthData` (~500 bytes) and recompute the kundali server-
 * side instead of receiving the full `KundaliData` (~1.5 MB English,
 * ~4 MB Devanagari):
 *   - The full payload tripped Next's 1 MB Server Action body limit and
 *     the 413 left tippanni+varga sections blank for every non-English
 *     seeker (Madhavi report 2026-05-26, production digest 2666761503).
 *   - The naive fix — bump bodySizeLimit to 5 MB — opened every Server
 *     Action to memory-exhaustion DoS, because Next parses the request
 *     body BEFORE verifying the action ID (Gemini PR #200 HIGH review).
 *   - `BirthData` is ~500 bytes. The kundali computation is deterministic
 *     given birth data, so recomputing server-side is equivalent to
 *     shipping the precomputed value. Trade-off: ~500 ms of extra server
 *     CPU per call — acceptable because this fires off the critical
 *     render path (insights are shown below the chart) and on locale
 *     switch (a rare interaction).
 *
 * INP impact (mid-range mobile, 3G fast):
 *   - Before: ~500-800 ms sync compute on "Generate Chart" click, blocks
 *             the main thread + framer-motion render thrash.
 *   - After:  ~500-900 ms network round-trip (recompute + serialize);
 *             main thread stays yielded throughout.
 *
 * Closes Audit 2026-05-25 §D1. Hardens PR #200.
 */
export async function computeKundaliInsights(
  birthData: BirthData,
  locale: Locale,
): Promise<{ tippanni: TippanniContent; vargaSynthesis: VargaSynthesis }> {
  const kundali = generateKundali(birthData);
  const tippanni = generateTippanni(kundali, locale);
  const vargaSynthesis = generateVargaTippanni(kundali, locale);
  return { tippanni, vargaSynthesis };
}
