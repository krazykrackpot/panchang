/**
 * Cron endpoint — monthly cleanup of orphan auth accounts.
 *
 * An "orphan" is an auth.users row that:
 *   - Never confirmed their email (email_confirmed_at IS NULL)
 *   - Never signed in (last_sign_in_at IS NULL)
 *   - Was created more than 24 hours ago
 *
 * The 24h grace window covers the legitimate "I just signed up, I'll
 * confirm in the morning" case. Anything older than that is either a
 * typo in the email address (we saw this 2026-06-27 with deepakkhertla9
 * vs deepakkhertla756 — first attempt was a typo, never confirmed),
 * a bot signup, or an abandoned signup. Deleting frees:
 *   - The email-address-uniqueness slot (so a real user can re-sign-up
 *     with the same address without seeing "email already in use")
 *   - The user_profiles row (if any — the on-signup trigger creates one)
 *   - The auth audit log entries
 *
 * Cadence: monthly on the 1st at 03:30 UTC (low-traffic window;
 * deliberately offset from the 00:05 / 08:05 / 16:05 IndexNow slots).
 *
 * Per-user rate is so low (~1–2 orphans/month at current scale) that
 * a monthly batch is right-sized. If orphan creation accelerates 10x,
 * we'd revisit cadence — but the cost is tiny either way.
 *
 * Protected by CRON_SECRET header via verifyCronAuth (same pattern as
 * the rest of the cron family).
 */

import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { verifyCronAuth } from '@/lib/api/cron-auth';
import { sendEmail } from '@/lib/email/resend-client';

export const maxDuration = 60;

const GRACE_HOURS = 24;
const OPERATOR_EMAIL = 'aditya.kr.jha@gmail.com';

export async function GET(request: Request) {
  const authError = verifyCronAuth(request);
  if (authError) return authError;

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();
  if (!supabaseUrl || !serviceRoleKey) {
    console.error('[purge-orphan-accounts] Missing Supabase env vars');
    return NextResponse.json({ error: 'not configured' }, { status: 503 });
  }
  const svc = createClient(supabaseUrl, serviceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  // Pull all users; orphan-filter client-side. admin.listUsers caps at
  // 200/page so we paginate. Bounded by total users which is currently
  // ~150 — this completes well within the 60s maxDuration.
  let all: { id: string; email?: string; created_at: string; email_confirmed_at?: string | null; last_sign_in_at?: string | null }[] = [];
  let page = 1;
  while (true) {
    const { data, error } = await svc.auth.admin.listUsers({ page, perPage: 200 });
    if (error) {
      console.error('[purge-orphan-accounts] listUsers failed:', error.message);
      return NextResponse.json({ error: 'listUsers failed', detail: error.message }, { status: 500 });
    }
    if (!data?.users?.length) break;
    all = all.concat(data.users);
    if (data.users.length < 200) break;
    page++;
  }

  const cutoffMs = Date.now() - GRACE_HOURS * 3600 * 1000;
  const orphans = all.filter((u) => {
    // Never confirmed AND never signed in AND older than the grace window.
    // Either condition alone is too aggressive (confirmed-but-never-used
    // is still a real account; never-confirmed-but-just-signed-up is fine).
    if (u.email_confirmed_at) return false;
    if (u.last_sign_in_at) return false;
    if (new Date(u.created_at).getTime() > cutoffMs) return false;
    return true;
  });

  const deleted: { id: string; email: string; created_at: string }[] = [];
  const failed: { id: string; email: string; reason: string }[] = [];

  for (const u of orphans) {
    const { error } = await svc.auth.admin.deleteUser(u.id);
    if (error) {
      failed.push({ id: u.id, email: u.email ?? '<no email>', reason: error.message });
      console.error('[purge-orphan-accounts] deleteUser failed:', u.id, error.message);
    } else {
      deleted.push({ id: u.id, email: u.email ?? '<no email>', created_at: u.created_at });
    }
  }

  console.log(
    `[purge-orphan-accounts] Scanned ${all.length}, identified ${orphans.length} orphan(s), ` +
      `deleted ${deleted.length}, failed ${failed.length}`,
  );

  // Operator notification — only fire when there's actually something to
  // report. A zero-orphan month doesn't need an email; if it ever fails
  // mid-batch (deleted.length === 0 but failed.length > 0) we still want
  // to know about the failure.
  if (deleted.length > 0 || failed.length > 0) {
    const sampleRows = deleted
      .slice(0, 20)
      .map((d) => `  • ${d.email}  (created ${d.created_at.slice(0, 19)}Z, id ${d.id.slice(0, 8)}…)`)
      .join('\n');
    const failedRows = failed.length > 0
      ? '\n\nFailed:\n' + failed.map((f) => `  • ${f.email} — ${f.reason}`).join('\n')
      : '';
    const html = `<div style="font-family:-apple-system,BlinkMacSystemFont,Helvetica,Arial,sans-serif;font-size:14px;line-height:1.55;color:#1f1f1f;max-width:560px;">
      <p><strong>Orphan-account cleanup ran.</strong></p>
      <p>
        Scanned: <strong>${all.length}</strong> total accounts<br/>
        Identified orphan: <strong>${orphans.length}</strong> (unconfirmed + never signed in, &gt;${GRACE_HOURS}h old)<br/>
        Deleted: <strong>${deleted.length}</strong><br/>
        Failed: <strong>${failed.length}</strong>
      </p>
      <pre style="font-family:Menlo,monospace;font-size:12px;background:#f6f6f6;padding:10px;border-radius:4px;overflow-x:auto;">${sampleRows}${failedRows}</pre>
      <p style="color:#666;font-size:12px;">— Dekho Panchang cron · /api/cron/purge-orphan-accounts</p>
    </div>`;
    const result = await sendEmail({
      to: OPERATOR_EMAIL,
      subject: `[Dekho Panchang] Orphan cleanup: deleted ${deleted.length}, failed ${failed.length}`,
      html,
      bcc: [],
    });
    if (!result.success) {
      console.error('[purge-orphan-accounts] operator notify failed:', result.error);
    }
  }

  return NextResponse.json({
    ok: failed.length === 0,
    scanned: all.length,
    orphansIdentified: orphans.length,
    deleted: deleted.length,
    failed: failed.length,
    graceHours: GRACE_HOURS,
  });
}
