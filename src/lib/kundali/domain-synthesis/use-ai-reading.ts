/**
 * useAIReading — Client-side hook for fetching and caching AI readings.
 *
 * Manages the lifecycle of a single comprehensive AI reading call:
 * 1. Check if readings are already loaded (from a previous call)
 * 2. If not, call /api/ai-reading which checks Supabase cache → LLM fallback
 * 3. Store the result in state so all domain tabs can use it immediately
 *
 * Usage:
 *   const { readings, overallInsight, loading, error, fetchReadings, getReading, regenerate }
 *     = useAIReading();
 *
 *   // Trigger fetch (pass kundali + personalReading)
 *   fetchReadings(kundali, reading, nativeAge);
 *
 *   // Get reading for a specific domain
 *   const healthReading = getReading('health'); // string | null
 */

'use client';

import { useState, useCallback, useRef } from 'react';
import { useAuthStore } from '@/stores/auth-store';
import type { KundaliData } from '@/types/kundali';
import type { PersonalReading, DomainType } from './types';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface AIReadingState {
  overallInsight: string | null;
  domains: Record<string, string>; // domain key → reading prose
  cached: boolean;
  fingerprint: string | null;
}

export interface UseAIReadingReturn {
  /** The full reading state */
  readings: AIReadingState;
  /** Whether a fetch is in progress */
  loading: boolean;
  /** Error message if the last fetch failed */
  error: string | null;
  /** Whether readings have been loaded (from cache or LLM) */
  hasReadings: boolean;
  /** Fetch readings for the given kundali. No-op if already loaded for same fingerprint. */
  fetchReadings: (kundali: KundaliData, reading: PersonalReading, nativeAge?: number) => Promise<void>;
  /** Get the AI reading for a specific domain, or null if not yet loaded */
  getReading: (domain: DomainType) => string | null;
  /** Force regenerate (bypasses cache) */
  regenerate: (kundali: KundaliData, reading: PersonalReading, nativeAge?: number) => Promise<void>;
}

// ---------------------------------------------------------------------------
// Hook
// ---------------------------------------------------------------------------

const EMPTY_STATE: AIReadingState = {
  overallInsight: null,
  domains: {},
  cached: false,
  fingerprint: null,
};

export function useAIReading(): UseAIReadingReturn {
  const session = useAuthStore((s) => s.session);
  const [readings, setReadings] = useState<AIReadingState>(EMPTY_STATE);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Track which fingerprint we've loaded to avoid duplicate fetches
  const loadedFingerprintRef = useRef<string | null>(null);

  const doFetch = useCallback(
    async (
      kundali: KundaliData,
      reading: PersonalReading,
      nativeAge?: number,
      regenerate = false,
    ) => {
      setLoading(true);
      setError(null);

      try {
        const headers: Record<string, string> = {
          'Content-Type': 'application/json',
        };
        if (session?.access_token) {
          headers['Authorization'] = `Bearer ${session.access_token}`;
        }

        const res = await fetch('/api/ai-reading', {
          method: 'POST',
          headers,
          body: JSON.stringify({
            kundali,
            reading,
            nativeAge,
            regenerate,
          }),
        });

        const data = await res.json();

        if (!res.ok) {
          if (res.status === 429 || data.rateLimited) {
            setError(
              data.error ||
                "You've used your AI reading quota for today. Try again tomorrow.",
            );
          } else {
            setError(data.error || 'Unable to generate reading. Please try again.');
          }
          return;
        }

        const newState: AIReadingState = {
          overallInsight: data.overallInsight ?? null,
          domains: data.domains ?? {},
          cached: data.cached ?? false,
          fingerprint: data.fingerprint ?? null,
        };

        setReadings(newState);
        loadedFingerprintRef.current = newState.fingerprint;
      } catch (err) {
        console.error('[useAIReading] Fetch failed:', err);
        setError('Unable to generate reading. Please check your connection and try again.');
      } finally {
        setLoading(false);
      }
    },
    [session],
  );

  // Track in-flight fetch to prevent duplicate calls
  const fetchingRef = useRef(false);

  const fetchReadings = useCallback(
    async (kundali: KundaliData, reading: PersonalReading, nativeAge?: number) => {
      // Skip if already loaded for this chart or currently fetching
      if (loadedFingerprintRef.current || fetchingRef.current) {
        return;
      }
      fetchingRef.current = true;
      try {
        await doFetch(kundali, reading, nativeAge, false);
      } finally {
        fetchingRef.current = false;
      }
    },
    [doFetch],
  );

  const regenerate = useCallback(
    async (kundali: KundaliData, reading: PersonalReading, nativeAge?: number) => {
      loadedFingerprintRef.current = null;
      setReadings(EMPTY_STATE);
      await doFetch(kundali, reading, nativeAge, true);
    },
    [doFetch],
  );

  const getReading = useCallback(
    (domain: DomainType): string | null => {
      return readings.domains[domain] ?? null;
    },
    [readings.domains],
  );

  const hasReadings = readings.overallInsight !== null && Object.keys(readings.domains).length > 0;

  return {
    readings,
    loading,
    error,
    hasReadings,
    fetchReadings,
    getReading,
    regenerate,
  };
}
