/**
 * Trim → reject empty → parse → require strictly positive finite.
 * Anything else returns the default. Closes the two Number(...) foot-
 * guns: `Number("")` is 0 (passes isFinite, fires alert spam), and
 * `Number("foo")` is NaN (passes nothing, disables detection).
 *
 * Used by SEO cron alerters that thresh-hold env-driven values. Lived in
 * `src/app/api/cron/seo-health/route.ts` originally; moved here on
 * 2026-06-06 because Next.js 16's route-module typegen rejects helper
 * exports from route files, which was failing `tsc --noEmit` on every PR.
 */
export function parsePositiveNumber(
  raw: string | undefined,
  fallback: number,
): number {
  const trimmed = raw?.trim();
  if (!trimmed) return fallback;
  const n = Number(trimmed);
  return Number.isFinite(n) && n > 0 ? n : fallback;
}
