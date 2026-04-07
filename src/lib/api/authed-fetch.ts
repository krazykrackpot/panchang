/**
 * Authenticated fetch wrapper — automatically attaches the Supabase session
 * Bearer token when available. Use this for ALL client-side API calls to
 * endpoints that check auth (gated or hard-auth).
 *
 * Usage:
 *   import { authedFetch } from '@/lib/api/authed-fetch';
 *   const res = await authedFetch('/api/kundali', { method: 'POST', body: JSON.stringify(data) });
 */
import { useAuthStore } from '@/stores/auth-store';

export function authedFetch(url: string, init?: RequestInit): Promise<Response> {
  const session = useAuthStore.getState().session;
  const headers = new Headers(init?.headers);

  if (!headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }

  if (session?.access_token && !headers.has('Authorization')) {
    headers.set('Authorization', `Bearer ${session.access_token}`);
  }

  return fetch(url, { ...init, headers });
}
