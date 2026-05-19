const UTM_KEYS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term'] as const;
const COOKIE_NAME = 'dp_utm';
const COOKIE_MAX_AGE = 30 * 24 * 60 * 60; // 30 days in seconds
const SESSION_KEY = 'dp_utm_session';

export interface UtmParams {
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_content?: string;
  utm_term?: string;
}

export interface UtmContext extends UtmParams {
  sessionId: string;
  landingPage: string;
  referrer: string;
}

export function parseUtmFromUrl(url: string): UtmParams | null {
  try {
    const parsed = new URL(url);
    const params: UtmParams = {};
    let found = false;

    for (const key of UTM_KEYS) {
      const val = parsed.searchParams.get(key)?.trim().slice(0, 200);
      if (val) {
        params[key] = val;
        found = true;
      }
    }

    return found ? params : null;
  } catch {
    return null;
  }
}

export function captureUtm(): void {
  if (typeof window === 'undefined') return;

  const utm = parseUtmFromUrl(window.location.href);
  if (utm) {
    document.cookie = `${COOKIE_NAME}=${encodeURIComponent(JSON.stringify(utm))}; path=/; max-age=${COOKIE_MAX_AGE}; SameSite=Lax; Secure`;
  }

  if (!sessionStorage.getItem(SESSION_KEY)) {
    sessionStorage.setItem(SESSION_KEY, crypto.randomUUID());
  }
}

export function getUtmParams(): UtmContext | null {
  if (typeof window === 'undefined') return null;

  const match = document.cookie.match(new RegExp(`(?:^|; )${COOKIE_NAME}=([^;]*)`));
  if (!match) return null;

  try {
    const utm: UtmParams = JSON.parse(decodeURIComponent(match[1]));
    return {
      ...utm,
      sessionId: sessionStorage.getItem(SESSION_KEY) || crypto.randomUUID(),
      landingPage: window.location.pathname,
      referrer: document.referrer || '',
    };
  } catch {
    return null;
  }
}

export function getReferrerContext(): { referrer: string; sessionId: string } | null {
  if (typeof window === 'undefined') return null;
  const ref = document.referrer || '';
  if (!ref) return null;

  return {
    referrer: ref,
    sessionId: sessionStorage.getItem(SESSION_KEY) || crypto.randomUUID(),
  };
}
