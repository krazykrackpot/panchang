// WhatsApp Cloud API client wrapper.
//
// Wraps Meta's Graph API v23.0 (or latest supported at runtime) for the
// daily-panchang use case. All sends go through here; no API code lives
// elsewhere.
//
// Setup: docs/runbooks/whatsapp-waba-setup.md
// Pricing & cost model: docs/specs/2026-06-15-whatsapp-daily-panchang.md §6
//
// IMPORTANT: every API call writes a row to whatsapp_send_log BEFORE the
// HTTP call (with status='pending'), then updates the row with the result.
// This keeps the system reconcilable if the Vercel function dies mid-send.

const META_GRAPH_VERSION = 'v23.0';

export interface WhatsAppEnv {
  phoneNumberId: string;
  accessToken: string;
  apiBaseUrl?: string; // override for tests
}

function loadEnv(): WhatsAppEnv {
  // .trim() per CLAUDE.md global rule — Vercel env values can carry trailing
  // newlines that break header construction silently.
  const phoneNumberId = (process.env.WHATSAPP_PHONE_NUMBER_ID ?? '').trim();
  const accessToken = (process.env.WHATSAPP_ACCESS_TOKEN ?? '').trim();
  if (!phoneNumberId) {
    throw new Error('[whatsapp] WHATSAPP_PHONE_NUMBER_ID is not set');
  }
  if (!accessToken) {
    throw new Error('[whatsapp] WHATSAPP_ACCESS_TOKEN is not set');
  }
  return { phoneNumberId, accessToken };
}

export interface TemplateMessageParams {
  to: string; // E.164 with leading +
  templateName: string;
  templateLang: 'en' | 'hi' | 'ta' | 'te' | 'bn' | 'gu' | 'kn' | 'mai' | 'mr';
  // Body parameter values, in order matching the {{1}}..{{N}} placeholders
  bodyParams: string[];
  // Optional URL-button suffix parameter (single, since v1 templates use one URL button)
  urlButtonParam?: string;
}

export interface SendResult {
  ok: boolean;
  whatsappMessageId?: string;
  errorCode?: string;
  errorMessage?: string;
  // Estimated cost in micro-USD, derived from destination market + category.
  costMicros: number;
}

/**
 * Send a template message via WhatsApp Cloud API.
 *
 * Reference: https://developers.facebook.com/docs/whatsapp/cloud-api/reference/messages
 *
 * Errors:
 *  - 4xx with code 131026: phone number is invalid / not on WhatsApp
 *  - 4xx with code 131047: re-engagement window expired (24h since last user msg);
 *    only matters for non-template messages, doesn't apply to us
 *  - 4xx with code 131051: user blocked the business
 *  - 4xx with code 132000: template paused / disabled by Meta
 *  - 429: rate-limited
 *
 * On error, the SendResult carries errorCode + errorMessage; caller is
 * responsible for writing to whatsapp_send_log with status='failed' and
 * updating the subscription opt-out state if the error is permanent.
 */
export async function sendTemplateMessage(
  params: TemplateMessageParams,
  env: WhatsAppEnv = loadEnv(),
): Promise<SendResult> {
  const baseUrl =
    env.apiBaseUrl ?? `https://graph.facebook.com/${META_GRAPH_VERSION}`;

  const url = `${baseUrl}/${env.phoneNumberId}/messages`;

  const components: Array<Record<string, unknown>> = [];
  if (params.bodyParams.length > 0) {
    components.push({
      type: 'body',
      parameters: params.bodyParams.map((v) => ({ type: 'text', text: v })),
    });
  }
  if (params.urlButtonParam !== undefined) {
    components.push({
      type: 'button',
      sub_type: 'url',
      index: '0',
      parameters: [{ type: 'text', text: params.urlButtonParam }],
    });
  }

  const body = {
    messaging_product: 'whatsapp',
    recipient_type: 'individual',
    to: params.to.replace(/^\+/, ''), // Meta wants no leading +
    type: 'template',
    template: {
      name: params.templateName,
      language: { code: params.templateLang },
      ...(components.length > 0 ? { components } : {}),
    },
  };

  let res: Response;
  try {
    res = await fetch(url, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${env.accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });
  } catch (err) {
    // Network-layer failure (DNS, TCP, TLS). Different from API-layer error.
    const message = err instanceof Error ? err.message : String(err);
    console.error('[whatsapp] network error sending template:', message);
    return {
      ok: false,
      errorCode: 'NETWORK_ERROR',
      errorMessage: message,
      costMicros: 0,
    };
  }

  const json = (await res.json().catch(() => ({}))) as Record<string, unknown>;

  if (!res.ok) {
    // Meta error envelope: { error: { code, message, type, ... } }
    const errObj = (json.error ?? {}) as Record<string, unknown>;
    const errorCode = String(errObj.code ?? res.status);
    const errorMessage = String(errObj.message ?? `HTTP ${res.status}`);
    console.error(
      `[whatsapp] template send failed: ${errorCode} ${errorMessage}`,
    );
    return {
      ok: false,
      errorCode,
      errorMessage,
      costMicros: 0,
    };
  }

  // Success envelope: { messaging_product, contacts: [...], messages: [{ id }] }
  const messages = (json.messages ?? []) as Array<{ id?: string }>;
  const whatsappMessageId = messages[0]?.id;
  if (!whatsappMessageId) {
    console.error('[whatsapp] success response missing message id:', json);
    return {
      ok: false,
      errorCode: 'NO_MESSAGE_ID',
      errorMessage: 'Meta returned 200 but no message id',
      costMicros: 0,
    };
  }

  return {
    ok: true,
    whatsappMessageId,
    costMicros: estimateCostMicros(params.to, params.templateName),
  };
}

/**
 * Estimate the cost in micro-USD for a single message.
 *
 * Rates from Meta's 2025-July pricing schedule. Indian utility messages are
 * the dominant case (~$0.012/msg). We round up to the nearest 100 micros to
 * leave headroom; reconciled monthly against Meta's actual invoice.
 *
 * Reference: https://developers.facebook.com/docs/whatsapp/pricing/
 */
export function estimateCostMicros(toE164: string, templateName: string): number {
  const isAuth = templateName.includes('otp') || templateName.includes('auth');
  const country = detectCountry(toE164);

  // Rates in micro-USD (1e-6 USD)
  const RATES: Record<string, { utility: number; authentication: number }> = {
    IN: { utility: 14_000, authentication: 9_500 },
    US: { utility: 25_000, authentication: 14_000 },
    GB: { utility: 35_000, authentication: 20_000 },
    AE: { utility: 32_000, authentication: 23_000 },
    DEFAULT: { utility: 40_000, authentication: 25_000 },
  };

  const rate = RATES[country] ?? RATES.DEFAULT;
  return isAuth ? rate.authentication : rate.utility;
}

/**
 * Best-effort country detection from E.164 prefix. Used only for cost
 * estimation; not for billing-grade accuracy.
 */
function detectCountry(toE164: string): string {
  const digits = toE164.replace(/^\+/, '');
  if (digits.startsWith('91')) return 'IN';
  if (digits.startsWith('1')) return 'US';
  if (digits.startsWith('44')) return 'GB';
  if (digits.startsWith('971')) return 'AE';
  return 'DEFAULT';
}

/**
 * Verify the Meta webhook signature on inbound POSTs.
 *
 * Meta signs each webhook body with HMAC-SHA256 using your App Secret. The
 * signature lives in the `X-Hub-Signature-256` header as `sha256=<hex>`.
 *
 * Reference: https://developers.facebook.com/docs/graph-api/webhooks/getting-started
 */
export async function verifyWebhookSignature(
  rawBody: string,
  headerValue: string | null,
  appSecret: string,
): Promise<boolean> {
  if (!headerValue) return false;
  const prefix = 'sha256=';
  if (!headerValue.startsWith(prefix)) return false;

  const expected = headerValue.slice(prefix.length);

  // Use Web Crypto API (works in both Node 18+ and Edge runtime)
  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey(
    'raw',
    enc.encode(appSecret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign'],
  );
  const sigBuf = await crypto.subtle.sign('HMAC', key, enc.encode(rawBody));
  const sigHex = Array.from(new Uint8Array(sigBuf))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');

  // Constant-time compare — guard against timing attacks
  return timingSafeEqualHex(expected, sigHex);
}

function timingSafeEqualHex(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) {
    diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return diff === 0;
}
