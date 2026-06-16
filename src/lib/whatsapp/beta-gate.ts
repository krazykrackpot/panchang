// Closed-beta gate for the WhatsApp daily-panchang feature.
//
// Behaviour:
//   - If env WHATSAPP_BETA_USER_IDS is set to a comma-separated list of
//     user UUIDs, only those users see the opt-in card and can hit the
//     /api/whatsapp/* routes
//   - If env WHATSAPP_BETA_USER_IDS is the literal string "*", the gate
//     is open to all signed-in users (post-beta GA flip)
//   - If env WHATSAPP_BETA_USER_IDS is unset or empty, the feature is
//     fully closed (returns false for everyone) — fail-closed by design
//
// Set on Vercel:
//   vercel env add WHATSAPP_BETA_USER_IDS production
//   → paste "uuid1,uuid2,uuid3,..." (or "*" once GA)
//
// Refresh the list with `scripts/whatsapp-pick-beta-cohort.ts` (see
// docs/runbooks/whatsapp-waba-setup.md §10 for the workflow).

const ALLOW_ALL = '*';

let cachedSet: Set<string> | null = null;
let cachedAllowAll = false;
let cachedRaw = '';

function loadGate(): { allowAll: boolean; ids: Set<string> } {
  const raw = (process.env.WHATSAPP_BETA_USER_IDS ?? '').trim();
  if (raw === cachedRaw && cachedSet !== null) {
    return { allowAll: cachedAllowAll, ids: cachedSet };
  }
  cachedRaw = raw;
  if (raw === ALLOW_ALL) {
    cachedAllowAll = true;
    cachedSet = new Set();
  } else if (raw === '') {
    cachedAllowAll = false;
    cachedSet = new Set();
  } else {
    cachedAllowAll = false;
    // Split on commas + trim each id; skip blanks and obvious non-UUIDs
    cachedSet = new Set(
      raw
        .split(',')
        .map((s) => s.trim())
        .filter((s) => /^[0-9a-f-]{36}$/i.test(s)),
    );
  }
  return { allowAll: cachedAllowAll, ids: cachedSet };
}

export function isWhatsAppBetaUser(userId: string | null | undefined): boolean {
  if (!userId) return false;
  const { allowAll, ids } = loadGate();
  if (allowAll) return true;
  return ids.has(userId);
}

/**
 * Test-only: clear the in-memory cache so tests can rewrite the env var
 * mid-test without stale state.
 */
export function _resetBetaGateCache(): void {
  cachedSet = null;
  cachedRaw = '';
  cachedAllowAll = false;
}
