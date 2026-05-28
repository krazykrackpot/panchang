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
 *   - missingBirthData: user is onboarded but date_of_birth is null
 *     → BirthDetailsBanner should render, SadhakaBanner should defer
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

export interface BirthDataStatus {
  /** True once the initial profile fetch has resolved (or short-circuited). */
  loaded: boolean;
  /** `onboarding_completed === true && date_of_birth === null` — chart-dependent surfaces are locked. */
  missingBirthData: boolean;
  /** `date_of_birth !== null` — chart-dependent surfaces can personalize. */
  hasBirthData: boolean;
  /** True when the user has completed the onboarding flow (with or without birth data). */
  onboardingCompleted: boolean;
}

/**
 * Discard the cached value for a given user (or all users if no id given).
 * Call after an OnboardingModal save so any mounted banner re-fetches and
 * notices the user now has birth data.
 */
export function invalidateBirthDataStatus(userId?: string): void {
  if (userId) {
    cache.delete(userId);
    inflight.delete(userId);
  } else {
    cache.clear();
    inflight.clear();
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
  }, [user]);

  if (!state.loaded) {
    return { loaded: false, missingBirthData: false, hasBirthData: false, onboardingCompleted: false };
  }
  if (!state.profile) {
    return { loaded: true, missingBirthData: false, hasBirthData: false, onboardingCompleted: false };
  }
  const { onboardingCompleted, hasBirthData } = state.profile;
  return {
    loaded: true,
    missingBirthData: onboardingCompleted && !hasBirthData,
    hasBirthData,
    onboardingCompleted,
  };
}
