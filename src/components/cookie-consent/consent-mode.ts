// Google Consent Mode v2 helpers + localStorage persistence for the cookie banner.
//
// Why this exists:
//   - AdSense (and any future GA4) requires Consent Mode v2 signals before serving
//     personalized ads to EEA/UK/CH traffic. Failing to send these signals throttles
//     ad serving and exposes us to GDPR enforcement.
//   - We default everything to 'denied' on first paint (compliant by default).
//   - On user accept, we update to 'granted' for ad/analytics storage.
//   - On user reject, defaults stand — no update needed.

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

export const STORAGE_KEY = 'dekho-panchang-cookie-consent';

// Bump this if we change the *scope* of cookies/consent. A bumped version forces
// re-consent: previously-stored decisions become invalid and the banner re-appears.
export const CONSENT_VERSION = 1;

export type ConsentStatus = 'accepted' | 'rejected';

export interface StoredConsent {
  status: ConsentStatus;
  timestamp: number;
  version: number;
}

export function getStoredConsent(): StoredConsent | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as StoredConsent;
    if (parsed.version !== CONSENT_VERSION) return null;
    if (parsed.status !== 'accepted' && parsed.status !== 'rejected') return null;
    return parsed;
  } catch (err) {
    console.error('[cookie-consent] failed to read stored consent:', err);
    return null;
  }
}

export function storeConsent(status: ConsentStatus): void {
  if (typeof window === 'undefined') return;
  try {
    const payload: StoredConsent = {
      status,
      timestamp: Date.now(),
      version: CONSENT_VERSION,
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
  } catch (err) {
    console.error('[cookie-consent] failed to store consent:', err);
  }
}

// Send a Consent Mode v2 update. Only needed for 'accepted' — a 'rejected' user
// matches the defaults set by CONSENT_DEFAULT_SCRIPT, so no signal is needed.
export function updateConsentMode(status: ConsentStatus): void {
  if (typeof window === 'undefined') return;
  if (typeof window.gtag !== 'function') {
    // Defensive: the inline default script should have defined gtag before any
    // React code runs. If it's missing, AdSense will still serve non-personalized
    // ads (defaults stand), so degrade silently with a warning rather than throw.
    console.warn('[cookie-consent] gtag not available — consent default script missing or blocked');
    return;
  }
  if (status === 'accepted') {
    window.gtag('consent', 'update', {
      ad_storage: 'granted',
      ad_user_data: 'granted',
      ad_personalization: 'granted',
      analytics_storage: 'granted',
    });
    window.gtag('set', 'ads_data_redaction', false);
  }
}

// Inline script string for the <Script strategy="beforeInteractive"> tag in the
// root layout. MUST run before adsbygoogle.js is fetched so AdSense reads the
// correct default consent state on initialization.
//
// Reads localStorage for a returning user's prior decision so accepted users get
// personalized ads from the first impression (no flash of non-personalized).
export const CONSENT_DEFAULT_SCRIPT = `(function(){
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  window.gtag = gtag;
  var accepted = false;
  try {
    var raw = localStorage.getItem('${STORAGE_KEY}');
    if (raw) {
      var parsed = JSON.parse(raw);
      if (parsed && parsed.version === ${CONSENT_VERSION} && parsed.status === 'accepted') {
        accepted = true;
      }
    }
  } catch (e) { /* localStorage unavailable — treat as not-accepted */ }
  gtag('consent', 'default', {
    ad_storage: accepted ? 'granted' : 'denied',
    ad_user_data: accepted ? 'granted' : 'denied',
    ad_personalization: accepted ? 'granted' : 'denied',
    analytics_storage: accepted ? 'granted' : 'denied',
    functionality_storage: 'granted',
    security_storage: 'granted',
    wait_for_update: 500
  });
  gtag('set', 'ads_data_redaction', !accepted);
  gtag('set', 'url_passthrough', false);
})();`;
