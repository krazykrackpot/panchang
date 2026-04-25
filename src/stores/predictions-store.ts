'use client';

import { create } from 'zustand';
import type { PredictionEntry } from '@/types/journal';

export interface PredictionCreateInput {
  predictionText: string;
  domain?: string;
  source?: string;
  predictedFor?: { start: string; end: string };
}

export interface PredictionRateInput {
  outcome: 'correct' | 'partially_correct' | 'incorrect';
  outcomeNote?: string;
}

export interface PredictionStats {
  total: number;
  pending: number;
  resolved: number;
  correct: number;
  partiallyCorrect: number;
  incorrect: number;
  /** 0-100, null when no resolved predictions */
  accuracyPct: number | null;
  byDomain: Record<string, { total: number; correct: number; accuracyPct: number | null }>;
  bySource: Record<string, { total: number; correct: number; accuracyPct: number | null }>;
}

interface PredictionsState {
  predictions: PredictionEntry[];
  loading: boolean;
  total: number;
  stats: PredictionStats | null;

  // Actions
  trackPrediction: (token: string, input: PredictionCreateInput) => Promise<{ error?: string }>;
  fetchPredictions: (token: string, outcome?: 'pending' | 'resolved', domain?: string) => Promise<{ error?: string }>;
  ratePrediction: (token: string, id: string, input: PredictionRateInput) => Promise<{ error?: string }>;
  deletePrediction: (token: string, id: string) => Promise<{ error?: string }>;
  fetchStats: (token: string) => Promise<{ error?: string }>;
}

function computeStats(predictions: PredictionEntry[]): PredictionStats {
  const resolved = predictions.filter((p) => p.outcome !== 'pending' && p.outcome != null);
  const correct = resolved.filter((p) => p.outcome === 'correct').length;
  const partiallyCorrect = resolved.filter((p) => p.outcome === 'partially_correct').length;
  const incorrect = resolved.filter((p) => p.outcome === 'incorrect').length;

  const accuracyPct =
    resolved.length > 0
      ? Math.round(((correct + partiallyCorrect * 0.5) / resolved.length) * 100)
      : null;

  const byDomain: PredictionStats['byDomain'] = {};
  const bySource: PredictionStats['bySource'] = {};

  for (const p of predictions) {
    if (p.domain) {
      if (!byDomain[p.domain]) byDomain[p.domain] = { total: 0, correct: 0, accuracyPct: null };
      byDomain[p.domain].total++;
      if (p.outcome === 'correct') byDomain[p.domain].correct++;
      else if (p.outcome === 'partially_correct') byDomain[p.domain].correct += 0.5;
    }
    if (p.source) {
      if (!bySource[p.source]) bySource[p.source] = { total: 0, correct: 0, accuracyPct: null };
      bySource[p.source].total++;
      if (p.outcome === 'correct') bySource[p.source].correct++;
      else if (p.outcome === 'partially_correct') bySource[p.source].correct += 0.5;
    }
  }

  // Compute accuracyPct per domain / source
  for (const key of Object.keys(byDomain)) {
    const d = byDomain[key];
    const resolvedInDomain = predictions.filter(
      (p) => p.domain === key && p.outcome !== 'pending' && p.outcome != null,
    ).length;
    d.accuracyPct = resolvedInDomain > 0 ? Math.round((d.correct / resolvedInDomain) * 100) : null;
  }
  for (const key of Object.keys(bySource)) {
    const s = bySource[key];
    const resolvedInSource = predictions.filter(
      (p) => p.source === key && p.outcome !== 'pending' && p.outcome != null,
    ).length;
    s.accuracyPct = resolvedInSource > 0 ? Math.round((s.correct / resolvedInSource) * 100) : null;
  }

  return {
    total: predictions.length,
    pending: predictions.filter((p) => p.outcome === 'pending').length,
    resolved: resolved.length,
    correct,
    partiallyCorrect,
    incorrect,
    accuracyPct,
    byDomain,
    bySource,
  };
}

export const usePredictionsStore = create<PredictionsState>((set, get) => ({
  predictions: [],
  loading: false,
  total: 0,
  stats: null,

  // ---------------------------------------------------------------------------
  // trackPrediction — POST /api/predictions
  // ---------------------------------------------------------------------------
  trackPrediction: async (token, input) => {
    set({ loading: true });
    try {
      const res = await fetch('/api/predictions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(input),
      });

      const data = await res.json() as { prediction?: PredictionEntry; error?: string };

      if (!res.ok || data.error) {
        const msg = data.error ?? 'Failed to track prediction';
        console.error('[predictions] trackPrediction failed:', msg);
        set({ loading: false });
        return { error: msg };
      }

      if (data.prediction) {
        set((state) => {
          const newPredictions = [data.prediction!, ...state.predictions];
          return {
            predictions: newPredictions,
            total: state.total + 1,
            stats: computeStats(newPredictions),
            loading: false,
          };
        });
      } else {
        set({ loading: false });
      }

      return {};
    } catch (err) {
      console.error('[predictions] trackPrediction error:', err);
      set({ loading: false });
      return { error: 'Network error — please try again' };
    }
  },

  // ---------------------------------------------------------------------------
  // fetchPredictions — GET /api/predictions
  // ---------------------------------------------------------------------------
  fetchPredictions: async (token, outcome, domain) => {
    set({ loading: true });
    try {
      const params = new URLSearchParams();
      if (outcome) params.set('outcome', outcome);
      if (domain)  params.set('domain',  domain);
      params.set('limit', '100');

      const res = await fetch(`/api/predictions?${params.toString()}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json() as { predictions?: PredictionEntry[]; total?: number; error?: string };

      if (!res.ok || data.error) {
        const msg = data.error ?? 'Failed to load predictions';
        console.error('[predictions] fetchPredictions failed:', msg);
        set({ loading: false });
        return { error: msg };
      }

      const predictions = data.predictions ?? [];
      set({
        predictions,
        total: data.total ?? 0,
        stats: computeStats(predictions),
        loading: false,
      });

      return {};
    } catch (err) {
      console.error('[predictions] fetchPredictions error:', err);
      set({ loading: false });
      return { error: 'Network error — please try again' };
    }
  },

  // ---------------------------------------------------------------------------
  // ratePrediction — PATCH /api/predictions/[id]
  // ---------------------------------------------------------------------------
  ratePrediction: async (token, id, input) => {
    set({ loading: true });
    try {
      const res = await fetch(`/api/predictions/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(input),
      });

      const data = await res.json() as { prediction?: PredictionEntry; error?: string };

      if (!res.ok || data.error) {
        const msg = data.error ?? 'Failed to rate prediction';
        console.error('[predictions] ratePrediction failed:', msg);
        set({ loading: false });
        return { error: msg };
      }

      if (data.prediction) {
        set((state) => {
          const newPredictions = state.predictions.map((p) =>
            p.id === id ? data.prediction! : p,
          );
          return {
            predictions: newPredictions,
            stats: computeStats(newPredictions),
            loading: false,
          };
        });
      } else {
        set({ loading: false });
      }

      return {};
    } catch (err) {
      console.error('[predictions] ratePrediction error:', err);
      set({ loading: false });
      return { error: 'Network error — please try again' };
    }
  },

  // ---------------------------------------------------------------------------
  // deletePrediction — DELETE /api/predictions/[id]
  // ---------------------------------------------------------------------------
  deletePrediction: async (token, id) => {
    set({ loading: true });
    try {
      const res = await fetch(`/api/predictions/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json() as { success?: boolean; error?: string };

      if (!res.ok || data.error) {
        const msg = data.error ?? 'Failed to delete prediction';
        console.error('[predictions] deletePrediction failed:', msg);
        set({ loading: false });
        return { error: msg };
      }

      set((state) => {
        const newPredictions = state.predictions.filter((p) => p.id !== id);
        return {
          predictions: newPredictions,
          total: Math.max(0, state.total - 1),
          stats: computeStats(newPredictions),
          loading: false,
        };
      });

      return {};
    } catch (err) {
      console.error('[predictions] deletePrediction error:', err);
      set({ loading: false });
      return { error: 'Network error — please try again' };
    }
  },

  // ---------------------------------------------------------------------------
  // fetchStats — compute stats from all predictions (loads all, no filter)
  // ---------------------------------------------------------------------------
  fetchStats: async (token) => {
    set({ loading: true });
    try {
      const res = await fetch('/api/predictions?limit=100', {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json() as { predictions?: PredictionEntry[]; error?: string };

      if (!res.ok || data.error) {
        const msg = data.error ?? 'Failed to load prediction stats';
        console.error('[predictions] fetchStats failed:', msg);
        set({ loading: false });
        return { error: msg };
      }

      const predictions = data.predictions ?? [];
      // Don't overwrite the current filtered list — only update stats and total
      set((state) => ({
        stats: computeStats(predictions),
        // Only update predictions if not already loaded (avoids clobbering active filter view)
        predictions: state.predictions.length === 0 ? predictions : state.predictions,
        loading: false,
      }));

      return {};
    } catch (err) {
      console.error('[predictions] fetchStats error:', err);
      set({ loading: false });
      return { error: 'Network error — please try again' };
    }
  },
}));
