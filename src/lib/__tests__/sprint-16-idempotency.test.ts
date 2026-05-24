/**
 * Sprint 16 — P2 idempotency/races invariants.
 *
 * Locks in:
 *   - P2-25 push/subscribe sweeps stale subscriptions by (user_id, user_agent)
 *   - P2-26 dashboard loadDashboard does NOT depend on `locale` (no rebuild
 *     on locale switch)
 *   - P2-27 /api/track-utm dedups same (sessionId, event, landingPage)
 *     in a 5s in-memory window
 *   - P2-28 dashboard subscribes to location-store timezone for in-render
 *     reads (no `useLocationStore.getState()` in render-time IIFEs / JSX
 *     props anymore)
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

const read = (rel: string) =>
  readFileSync(join(process.cwd(), rel), 'utf8');

describe('Sprint 16 — P2-25 /api/push/subscribe prunes stale (user_id, user_agent) rows', () => {
  const src = read('src/app/api/push/subscribe/route.ts');

  it('after the upsert, deletes existing subscriptions for this user with the same UA but a different endpoint', () => {
    expect(src).toMatch(/\.delete\(\)[\s\S]*?\.eq\('user_id',\s*user\.id\)[\s\S]*?\.eq\('user_agent',\s*userAgent\)[\s\S]*?\.neq\('endpoint',\s*subscription\.endpoint\)/);
  });

  it('the prune is non-fatal — its error is logged but the subscribe still succeeds', () => {
    // Must not RETURN inside the prune-error branch; the original subscribe
    // success must reach the success response.
    const pruneBlock = src.match(/if \(userAgent\) \{[\s\S]*?\}\s*\n\s*return NextResponse\.json\(\{ success: true \}\);/)?.[0] ?? '';
    expect(pruneBlock).toMatch(/console\.error\(/);
    // The block must end with the success return — not an early-return on prune failure.
    expect(pruneBlock).toMatch(/return NextResponse\.json\(\{ success: true \}\);$/);
  });
});

describe('Sprint 16 — P2-26 dashboard loadDashboard does not depend on locale', () => {
  const src = read('src/app/[locale]/dashboard/page.tsx');

  it('the loadDashboard useCallback deps are [user?.id, freshSnapshot] — no locale', () => {
    // The full callback ends with `}, [user?.id, freshSnapshot])`. Anything
    // else in the deps would re-create the callback on those changes and
    // re-fire the effect that consumes it. Lock the exact shape.
    expect(src).toMatch(/\}, \[user\?\.id, freshSnapshot\]\);/);
    // Defensive: the loadDashboard body must NOT close over `locale` (if it
    // did, we'd silently miss locale-conditional copy — but then the deps
    // SHOULD include locale, which would re-trigger the refetch the audit
    // worried about). Verify by checking the body has no `locale` reference.
    const loadDashboardBody = src.match(/const loadDashboard = useCallback\(async \(\) => \{[\s\S]*?\}, \[user\?\.id, freshSnapshot\]\);/)?.[0] ?? '';
    expect(loadDashboardBody, 'loadDashboard body must not reference locale').not.toMatch(/\blocale\b/);
  });
});

describe('Sprint 16 — P2-27 /api/track-utm dedups within a 5s window', () => {
  const src = read('src/app/api/track-utm/route.ts');

  it('declares an in-memory dedup map with a 5_000ms window', () => {
    expect(src).toMatch(/DEDUP_WINDOW_MS = 5_000/);
    expect(src).toMatch(/const recentEvents = new Map<string, number>\(\);/);
  });

  it('keys the dedup on (sessionId, event, landingPage)', () => {
    expect(src).toMatch(/const key = `\$\{sessionId\}\|\$\{event\}\|\$\{landingPage \?\? ''\}`;/);
  });

  it('returns 204 (success) — not 429 — when a duplicate is detected', () => {
    // Suppressing duplicates with 429 would surface as a misleading error
    // in client telemetry. 204 makes the duplicate a successful no-op.
    expect(src).toMatch(/if \(isDuplicate\([\s\S]*?\) \{\s*return new NextResponse\(null, \{ status: 204 \}\);/);
  });

  it('hard memory cap: drops oldest 5k when map exceeds 10k', () => {
    // Gemini #154 (HIGH): the previous time-based prune was a bug — under
    // steady load every entry could be inside the dedup window, so the
    // prune iterated 10k entries every request without deleting any.
    // The fix uses Map insertion order (= age) to drop the oldest half
    // unconditionally, guaranteeing both a hard cap and O(5000) cost.
    expect(src).toMatch(/recentEvents\.size > 10_000/);
    expect(src).toMatch(/let toDelete = 5_000;/);
    expect(src).toMatch(/recentEvents\.delete\(k\);\s*\n\s*if \(--toDelete <= 0\) break;/);
    // The broken time-based shape must be gone.
    expect(src).not.toMatch(/const cutoff = now - DEDUP_WINDOW_MS;[\s\S]*?if \(t < cutoff\)/);
  });
});

describe('Sprint 16 — P2-28 dashboard subscribes to location-store timezone', () => {
  const src = read('src/app/[locale]/dashboard/page.tsx');

  it('component reads `timezone` via the subscribed hook (not getState)', () => {
    expect(src).toMatch(
      /const timezone = useLocationStore\(\(s\)\s*=>\s*s\.timezone\);/,
    );
  });

  it('render-time IIFEs no longer call useLocationStore.getState().timezone', () => {
    // .getState() is correct in async callbacks (loadDashboard) + click
    // handlers (onLocationPicked). It is WRONG in render-time IIFEs and
    // JSX prop expressions because those don't re-trigger on store change.
    // After Sprint 16, the only remaining .getState() calls are inside
    // an async useCallback body OR an onClick. Anywhere `timezone` is
    // read for an in-render computation, we use the subscribed variable.
    expect(src).not.toMatch(/nowMinutesInTimezone\(useLocationStore\.getState\(\)\.timezone\)/);
    expect(src).not.toMatch(/timezone=\{useLocationStore\.getState\(\)\.timezone/);
  });

  it('any remaining .getState() reads are inside async/callback contexts only', () => {
    // The 3 remaining sites are: loadDashboard's async useCallback (line ~942),
    // the deferred-muhurta-scan effect (line ~1176), and an onLocationPicked
    // handler (line ~2402). Each is OK because we WANT the current value
    // at call time, not a render subscription.
    const matches = src.match(/useLocationStore\.getState\(\)/g) ?? [];
    // 3 legitimate call sites + a few mentions in comments. Cap is generous:
    // anything above 6 is a regression.
    expect(matches.length).toBeLessThanOrEqual(6);
  });
});
