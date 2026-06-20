// GET /api/whatsapp/eligibility
//
// Lightweight check the dashboard component calls on mount to decide
// whether to show the WhatsApp opt-in card at all. The actual gate is
// also enforced on /optin (defense-in-depth) — this endpoint just lets
// the UI hide cleanly for non-beta users instead of dangling a card
// that 403s on submit.
//
// Auth: Bearer token.
// Response: { eligible: boolean }

import { NextRequest, NextResponse } from 'next/server';
import { getServerSupabase } from '@/lib/supabase/server';
import { isWhatsAppBetaUser } from '@/lib/whatsapp/beta-gate';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const supabase = getServerSupabase();
  if (!supabase) return NextResponse.json({ eligible: false });

  const authHeader = req.headers.get('authorization');
  if (!authHeader?.startsWith('Bearer ')) {
    return NextResponse.json({ eligible: false });
  }
  const token = authHeader.slice(7).trim();
  const { data: { user } } = await supabase.auth.getUser(token);
  return NextResponse.json({ eligible: isWhatsAppBetaUser(user?.id) });
}
