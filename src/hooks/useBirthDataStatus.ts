'use client';

/**
 * Shared birth-data status hook.
 *
 * Replaces two independent Supabase queries (BirthDetailsBanner +
 * SadhakaBanner) that were both fetching the same
 * `(onboarding_completed, date_of_birth)` row from user_profiles on
 * every page mount. Module-level cache keyed by user_id means at most
 * one query per user per session.
 *
 * Returns:
 *   - loaded: whether the initial fetch has resolved (use to skip
 *     render during the fetch to avoid an SSR/CSR flash)
 *   - missingBirthData: user is signed in and date_of_birth is null
 *     → BirthDetailsBanner should render, SadhakaBanner should defer.
 *     NOTE (2026-06-05 funnel review): the prior gate also required
 *     `onboardingCompleted` so the banner wouldn't double up with the
 *     OnboardingModal. But that left ~44% of signups (those who
 *     dismissed or never submitted the modal) with NO nudge at all —
 *     `onboarding_completed=false AND date_of_birth=null` slipped
 *     through both surfaces. The banner now triggers whenever birth
 *     data is missing; the OnboardingModal's full-screen overlay
 *     visually dominates while it's open, so no UX collision.
 *   - hasBirthData: user has a non-null date_of_birth (the chart-
 *     dependent surfaces can render their personalised view)
 *
 * Filed alongside fix/birth-data-status-hook to close out the MED
 * item from the self-review on PR #277/#278.
 */

import { useEffect, useState } from 'react';
import { useAuthStore } from '@/stores/auth-store';
import { getSupabase } from '@/lib/supabase/client';

interface ProfileState {
  onboardingCompleted: boolean;
  hasBirthData: boolean;
}

// Cache by user.id. Keeps the fetch to once per session per user — both
// banners reading the value get it for free after the first mount.
const cache = new Map<string, ProfileState>();
// In-flight promises so two near-simultaneous mounts only fire one query.
const inflight = new Map<string, Promise<ProfileState>>();
// Mounted-hook subscribers that re-fetch on invalidation. Without this,
// `invalidateBirthDataStatus()` would clear the cache but leave any
// currently-rendered <BirthDetailsBanner> with its stale React state —
// the banner would stay visible after the user fills the form, until
// they navigate to another page.
const subscribers = new Set<() => void>();

export interface BirthDataStatus {
  /** True once the initial profile fetch has resolved (or short-circuited). */
  loaded: boolean;
  /** `date_of_birth === null` — chart-dependent surfaces are locked, banner should nudge. */
  missingBirthData: boolean;
  /** `date_of_birth !== null` — chart-dependent surfaces can personalize. */
  hasBirthData: boolean;
  /** True when the user has completed the onboarding flow (with or without birth data). */
  onboardingCompleted: boolean;
}

/**
 * Discard the cached value for a given user (or all users if no id given),
 * and notify every mounted hook instance to re-fetch.
 *
 * Without the subscriber-notify step, a currently-mounted
 * <BirthDetailsBanner> would keep its stale React state (the cache being
 * empty doesn't itself trigger a re-render — the hook's useEffect only
 * re-runs on user.id change). The user fills the form, modal closes,
 * banner stays visible until they navigate away.
 */
export function invalidateBirthDataStatus(userId?: string): void {
  if (userId) {
    cache.delete(userId);
    inflight.delete(userId);
  } else {
    cache.clear();
    inflight.clear();
  }
  // Notify all mounted hook instances. They'll re-fetch and update their
  // React state, which causes mounted consumers to re-render with the
  // fresh data — banner disappears the moment the user finishes the form.
  for (const notify of subscribers) {
    try { notify(); } catch (err) {
      console.error('[useBirthDataStatus] subscriber notify failed:', err);
    }
  }
}

async function fetchProfileState(userId: string): Promise<ProfileState> {
  const supabase = getSupabase();
  if (!supabase) return { onboardingCompleted: false, hasBirthData: false };
  const { data, error } = await supabase
    .from('user_profiles')
    .select('onboarding_completed, date_of_birth')
    .eq('id', userId)
    .maybeSingle();
  if (error) {
    console.error('[useBirthDataStatus] profile fetch failed:', error.message);
    return { onboardingCompleted: false, hasBirthData: false };
  }
  return {
    onboardingCompleted: !!data?.onboarding_completed,
    hasBirthData: !!data?.date_of_birth,
  };
}

/**
 * Subscribe to the current user's birth-data status.
 *
 * Returns `{ loaded: false, missingBirthData: false, hasBirthData: false,
 * onboardingCompleted: false }` while unauthenticated or while the first
 * fetch is in flight. Subsequent mounts return synchronously from cache.
 */
export function useBirthDataStatus(): BirthDataStatus {
  const user = useAuthStore((s) => s.user);
  const [state, setState] = useState<{ loaded: boolean; profile: ProfileState | null }>({
    loaded: false,
    profile: null,
  });
  // Revision counter — bumped by invalidate via the subscriber callback
  // below. Listing it in the fetch useEffect's deps triggers a re-fetch
  // when invalidate fires, so a banner mounted on the same page as the
  // OnboardingModal disappears the moment the user finishes the form.
  const [revision, setRevision] = useState(0);

  // Register a subscriber on mount; clean up on unmount.
  useEffect(() => {
    const notify = () => setRevision((r) => r + 1);
    subscribers.add(notify);
    return () => { subscribers.delete(notify); };
  }, []);

  useEffect(() => {
    if (!user) {
      setState({ loaded: true, profile: null });
      return;
    }
    const cached = cache.get(user.id);
    if (cached) {
      setState({ loaded: true, profile: cached });
      return;
    }
    let cancelled = false;
    const existing = inflight.get(user.id);
    const promise =
      existing ??
      fetchProfileState(user.id).then((s) => {
        cache.set(user.id, s);
        inflight.delete(user.id);
        return s;
      });
    inflight.set(user.id, promise);
    promise.then((profile) => {
      if (cancelled) return;
      setState({ loaded: true, profile });
    });
    return () => { cancelled = true; };
    // `revision` is intentionally a dep — when invalidate bumps it, this
    // effect re-runs and re-reads the (now empty) cache, firing a new
    // fetch with the fresh post-save data.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, revision]);

  if (!state.loaded) {
    return { loaded: false, missingBirthData: false, hasBirthData: false, onboardingCompleted: false };
  }
  if (!state.profile) {
    return { loaded: true, missingBirthData: false, hasBirthData: false, onboardingCompleted: false };
  }
  const { onboardingCompleted, hasBirthData } = state.profile;
  return {
    loaded: true,
    // Banner triggers whenever birth data is missing, regardless of
    // onboarding_completed. The OnboardingModal's full-screen overlay
    // visually dominates while it's open, so simultaneous render with
    // the modal is fine — the banner becomes the persistent nudge once
    // the modal is dismissed. See doc comment at top for full reasoning
    // (2026-06-05 funnel review).
    missingBirthData: !hasBirthData,
    hasBirthData,
    onboardingCompleted,
  };
}
