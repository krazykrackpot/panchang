// Meta WhatsApp webhook.
//
// GET  — Meta sends a one-time verification challenge during webhook setup
//        (see docs/runbooks/whatsapp-waba-setup.md Step 7). We compare the
//        verify_token query param against WHATSAPP_WEBHOOK_VERIFY_TOKEN env
//        and echo the challenge string back.
//
// POST — Meta sends inbound events:
//          1. messages: user sends us a message (e.g. "STOP" reply)
//          2. message status updates: delivery/read receipts for messages
//             we sent (correlated via the whatsapp_message_id we stored in
//             whatsapp_send_log)
//
//        We verify the X-Hub-Signature-256 header before doing ANY work
//        on the body. An unsigned POST is dropped silently with 200 (Meta
//        requires 200 to stop retries, but we don't want to leak that the
//        body was rejected as a Probe — silent drop is fine).

import { NextRequest, NextResponse } from 'next/server';
import { getServerSupabase } from '@/lib/supabase/server';
import { verifyWebhookSignature } from '@/lib/whatsapp/client';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// Always return 200 to Meta to suppress retries, unless we want them to
// retry (e.g. our DB is briefly down).
const OK_200 = NextResponse.json({ ok: true }, { status: 200 });

// ─────────────────────────────────────────────────────────────────────────
// GET — verify challenge during webhook setup
// ─────────────────────────────────────────────────────────────────────────
export async function GET(req: NextRequest) {
  const expected = (process.env.WHATSAPP_WEBHOOK_VERIFY_TOKEN ?? '').trim();
  if (!expected) {
    return NextResponse.json({ error: 'Not configured' }, { status: 503 });
  }
  const url = new URL(req.url);
  const mode = url.searchParams.get('hub.mode');
  const token = url.searchParams.get('hub.verify_token');
  const challenge = url.searchParams.get('hub.challenge');
  if (mode !== 'subscribe' || token !== expected || !challenge) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }
  // Meta requires the challenge string echoed as plain text
  return new NextResponse(challenge, { status: 200, headers: { 'Content-Type': 'text/plain' } });
}

// ─────────────────────────────────────────────────────────────────────────
// POST — inbound messages + delivery receipts
// ─────────────────────────────────────────────────────────────────────────
export async function POST(req: NextRequest) {
  const appSecret = (process.env.META_APP_SECRET ?? '').trim();
  if (!appSecret) {
    console.error('[whatsapp/webhook] META_APP_SECRET not set; dropping');
    return OK_200;
  }

  // Read raw body for signature verification
  const rawBody = await req.text();
  const sigHeader = req.headers.get('x-hub-signature-256');
  const valid = await verifyWebhookSignature(rawBody, sigHeader, appSecret);
  if (!valid) {
    console.warn('[whatsapp/webhook] signature mismatch; dropping');
    return OK_200;
  }

  let payload: WhatsAppWebhookPayload;
  try {
    payload = JSON.parse(rawBody);
  } catch {
    console.warn('[whatsapp/webhook] body not JSON; dropping');
    return OK_200;
  }

  const supabase = getServerSupabase();
  if (!supabase) {
    // Don't 200 — let Meta retry once the env is fixed
    return NextResponse.json({ error: 'Not configured' }, { status: 503 });
  }

  for (const entry of payload.entry ?? []) {
    for (const change of entry.changes ?? []) {
      if (change.field !== 'messages') continue;
      const value = change.value;
      if (!value) continue;

      // ─── Inbound messages (STOP / HELP / other replies) ─────────────────
      for (const msg of value.messages ?? []) {
        if (msg.type !== 'text' || !msg.text?.body) continue;
        const from = msg.from; // E.164 without leading + per Meta
        const phoneE164 = from.startsWith('+') ? from : `+${from}`;
        const text = msg.text.body.trim();
        const classification = classifyInbound(text);

        // Log the inbound (200-char truncation in DB trigger)
        await supabase.from('whatsapp_inbound_log').insert({
          phone_e164: phoneE164,
          message_body: text,
          classification,
        }).then(({ error }) => {
          if (error) console.error('[whatsapp/webhook] inbound insert failed:', error);
        });

        if (classification === 'stop') {
          const { error } = await supabase
            .from('user_whatsapp_subscriptions')
            .update({
              opted_out_at: new Date().toISOString(),
              opt_out_reason: 'user_reply_stop',
            })
            .eq('phone_e164', phoneE164)
            .is('opted_out_at', null);
          if (error) console.error('[whatsapp/webhook] STOP opt-out failed:', error);
        }
      }

      // ─── Delivery + read receipts ───────────────────────────────────────
      for (const st of value.statuses ?? []) {
        if (!st.id || !st.status) continue;
        const { error } = await supabase
          .from('whatsapp_send_log')
          .update({ status: mapMetaStatus(st.status) })
          .eq('whatsapp_message_id', st.id);
        if (error) console.error('[whatsapp/webhook] status update failed:', error);
      }
    }
  }

  return OK_200;
}

// ─────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────

const STOP_KEYWORDS = ['stop', 'unsubscribe', 'cancel', 'quit', 'end', 'opt out', 'optout', 'रोको', 'বন্ধ', 'நிறுத்து'];
const HELP_KEYWORDS = ['help', 'info', 'मदद', 'সাহায্য', 'உதவி'];

function classifyInbound(text: string): 'stop' | 'help' | 'other' {
  const lower = text.toLowerCase();
  if (STOP_KEYWORDS.some((k) => lower === k || lower.startsWith(k + ' '))) return 'stop';
  if (HELP_KEYWORDS.some((k) => lower === k || lower.startsWith(k + ' '))) return 'help';
  return 'other';
}

function mapMetaStatus(metaStatus: string): string {
  // Meta uses: 'sent' | 'delivered' | 'read' | 'failed' | 'deleted'
  // Our DB constraint allows: 'pending', 'sent', 'delivered', 'read', 'failed', ...
  if (['sent', 'delivered', 'read', 'failed'].includes(metaStatus)) return metaStatus;
  return 'failed'; // 'deleted' or anything unexpected
}

// ─── Meta payload types ──────────────────────────────────────────────────

interface WhatsAppWebhookPayload {
  object?: string;
  entry?: Array<{
    id?: string;
    changes?: Array<{
      field?: string;
      value?: {
        messaging_product?: string;
        metadata?: { display_phone_number?: string; phone_number_id?: string };
        contacts?: Array<{ wa_id?: string }>;
        messages?: Array<{
          from: string;
          id: string;
          timestamp: string;
          type: string;
          text?: { body?: string };
        }>;
        statuses?: Array<{
          id?: string;
          status?: string;
          timestamp?: string;
          recipient_id?: string;
        }>;
      };
    }>;
  }>;
}
