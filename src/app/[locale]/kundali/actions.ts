'use server';

import { generateTippanni } from '@/lib/kundali/tippanni-engine';
import { generateVargaTippanni } from '@/lib/tippanni/varga-tippanni';
import type { KundaliData } from '@/types/kundali';
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
 * INP impact (mid-range mobile, 3G fast):
 *   - Before: ~500-800 ms sync compute on "Generate Chart" click, blocks
 *             the main thread + framer-motion render thrash.
 *   - After:  ~250-400 ms network round-trip, main thread stays yielded.
 *
 * Closes Audit 2026-05-25 §D1.
 */
export async function computeKundaliInsights(
  kundali: KundaliData,
  locale: Locale,
): Promise<{ tippanni: TippanniContent; vargaSynthesis: VargaSynthesis }> {
  const tippanni = generateTippanni(kundali, locale);
  const vargaSynthesis = generateVargaTippanni(kundali, locale);
  return { tippanni, vargaSynthesis };
}
