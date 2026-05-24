/**
 * Web Push notification sender
 * Uses the web-push npm package to deliver push notifications
 * to subscribed users.
 */

import { createClient, type SupabaseClient } from '@supabase/supabase-js';

// Lazy-load web-push to avoid breaking builds if not installed
let webpush: typeof import('web-push') | null = null;

async function getWebPush() {
  if (webpush) return webpush;
  try {
    webpush = await import('web-push');
    const vapidPublic = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY?.trim();
    const vapidPrivate = process.env.VAPID_PRIVATE_KEY?.trim();
    const vapidEmail = process.env.VAPID_EMAIL?.trim() || 'mailto:hello@dekhopanchang.com';

    if (vapidPublic && vapidPrivate) {
      webpush.setVapidDetails(vapidEmail, vapidPublic, vapidPrivate);
    }
    return webpush;
  } catch (err) {
    console.error('[send-push] web-push init failed:', err);
    return null;
  }
}

// P2-23 — lazy-init. The previous top-level createClient with `!` non-null
// asserts crashed on module import if either env var was missing — which
// would take down ANY route that transitively imported send-push, not just
// the push routes. Now defer construction to first call; throw a clear
// error if env is missing, but only when send-push is actually used.
let supabaseAdminInstance: SupabaseClient | null = null;
function getSupabaseAdmin(): SupabaseClient {
  if (supabaseAdminInstance) return supabaseAdminInstance;
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();
  if (!url || !key) {
    throw new Error(
      '[send-push] Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY',
    );
  }
  supabaseAdminInstance = createClient(url, key);
  return supabaseAdminInstance;
}

export interface PushPayload {
  title: string;
  body: string;
  icon?: string;
  badge?: string;
  url?: string;
  tag?: string;
}

/**
 * Send push notification to a specific user's all devices
 */
export async function sendPushToUser(userId: string, payload: PushPayload): Promise<{ sent: number; failed: number }> {
  const wp = await getWebPush();
  if (!wp) return { sent: 0, failed: 0 };

  const supabaseAdmin = getSupabaseAdmin();
  const { data: subscriptions } = await supabaseAdmin
    .from('push_subscriptions')
    .select('id, endpoint, p256dh, auth')
    .eq('user_id', userId);

  if (!subscriptions || subscriptions.length === 0) return { sent: 0, failed: 0 };

  let sent = 0;
  let failed = 0;

  const payloadStr = JSON.stringify({
    ...payload,
    icon: payload.icon || '/favicon.svg',
    badge: payload.badge || '/apple-touch-icon.png',
  });

  for (const sub of subscriptions) {
    try {
      await wp.sendNotification(
        {
          endpoint: sub.endpoint,
          keys: { p256dh: sub.p256dh, auth: sub.auth },
        },
        payloadStr
      );
      sent++;
    } catch (err: unknown) {
      failed++;
      // If subscription is expired/invalid (410 Gone or 404), remove it
      const statusCode = (err as { statusCode?: number })?.statusCode;
      if (statusCode === 410 || statusCode === 404) {
        await supabaseAdmin
          .from('push_subscriptions')
          .delete()
          .eq('id', sub.id);
      }
    }
  }

  return { sent, failed };
}

/**
 * Send push to multiple users (batch)
 */
export async function sendPushBatch(
  userIds: string[],
  payload: PushPayload,
): Promise<{ totalSent: number; totalFailed: number }> {
  let totalSent = 0;
  let totalFailed = 0;

  // Process 10 users at a time
  for (let i = 0; i < userIds.length; i += 10) {
    const batch = userIds.slice(i, i + 10);
    const results = await Promise.all(
      batch.map(uid => sendPushToUser(uid, payload))
    );
    for (const r of results) {
      totalSent += r.sent;
      totalFailed += r.failed;
    }
  }

  return { totalSent, totalFailed };
}
