/**
 * Response Cache — LRU in-memory with split TTL.
 *
 * - Transit-dependent entries: 24h TTL (transits change daily)
 * - Natal-only entries: no TTL (chart never changes)
 * - Max 1,000 entries (~2MB)
 * - No external dependencies (no Redis, no Supabase)
 */

import type { PanditResponse } from '../types';

interface CacheEntry {
  response: PanditResponse;
  createdAt: number;
  hasTransitData: boolean;
}

const TRANSIT_TTL_MS = 24 * 60 * 60 * 1000; // 24 hours
const MAX_ENTRIES = 1000;

export class ResponseCache {
  private cache = new Map<string, CacheEntry>();

  get(key: string): PanditResponse | null {
    const entry = this.cache.get(key);
    if (!entry) return null;

    if (entry.hasTransitData) {
      const age = Date.now() - entry.createdAt;
      if (age > TRANSIT_TTL_MS) {
        this.cache.delete(key);
        return null;
      }
    }

    // Move to end of Map iteration order → marks as most recently used.
    // Without this, eviction is FIFO (oldest inserted), not LRU.
    this.cache.delete(key);
    this.cache.set(key, entry);

    return entry.response;
  }

  set(key: string, response: PanditResponse, hasTransitData: boolean): void {
    // LRU eviction — delete oldest entry if at capacity
    if (this.cache.size >= MAX_ENTRIES) {
      const oldest = this.cache.keys().next().value;
      if (oldest) this.cache.delete(oldest);
    }

    this.cache.set(key, {
      response,
      createdAt: Date.now(),
      hasTransitData,
    });
  }

  /** Number of entries in cache. */
  get size(): number {
    return this.cache.size;
  }

  /** Clear all entries. */
  clear(): void {
    this.cache.clear();
  }
}
