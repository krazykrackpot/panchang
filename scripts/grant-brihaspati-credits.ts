#!/usr/bin/env npx tsx
/**
 * scripts/grant-brihaspati-credits.ts
 *
 * Issue a comp / admin grant of Brihaspati credits to a user. Writes
 * into public.brihaspati_admin_grants — never into public.brihaspati_credits,
 * which is reserved for actual Razorpay / Stripe payment rows.
 *
 * Usage:
 *   npx tsx --env-file=.env.local scripts/grant-brihaspati-credits.ts \
 *     --email user@example.com \
 *     --amount 10 \
 *     --reason "manual comp for X" \
 *     --by aditya@dekhopanchang.com \
 *     [--days 30] \
 *     [--yes]
 *
 * --yes skips the interactive confirmation. Without it, the script
 * prints the resolved user + intended insert and waits for y/N.
 *
 * Env: NEXT_PUBLIC_SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY must be
 * loaded into the script's process. Unlike Next.js, `tsx` does not
 * auto-load `.env.local` — pass `--env-file=.env.local` to the Node
 * CLI (Node 20.6+) or export the vars manually before running.
 * (Gemini PR #333 cycle-2 MED.)
 */

import { createInterface } from 'node:readline/promises';
import { stdin, stdout } from 'node:process';
import { getServerSupabase } from '../src/lib/supabase/server';
import { grantAdminCredits, getBalance } from '../src/lib/brihaspati/credits/credit-manager';

interface Args {
  email: string;
  amount: number;
  reason: string;
  by: string;
  days: number;
  yes: boolean;
}

function parseArgs(): Args {
  const argv = process.argv.slice(2);
  const get = (flag: string): string | undefined => {
    const i = argv.indexOf(flag);
    return i >= 0 && i + 1 < argv.length ? argv[i + 1] : undefined;
  };

  const email = get('--email');
  const amountStr = get('--amount');
  const reason = get('--reason');
  const by = get('--by');
  const daysStr = get('--days');
  const yes = argv.includes('--yes');

  if (!email || !amountStr || !reason || !by) {
    console.error('Usage: npx tsx scripts/grant-brihaspati-credits.ts --email <email> --amount <n> --reason "<text>" --by <admin-id> [--days 30] [--yes]');
    process.exit(2);
  }

  const amount = Number(amountStr);
  if (!Number.isInteger(amount) || amount <= 0) {
    console.error(`[grant-brihaspati-credits] --amount must be a positive integer (got ${amountStr})`);
    process.exit(2);
  }

  const days = daysStr ? Number(daysStr) : 30;
  if (!Number.isInteger(days) || days <= 0) {
    console.error(`[grant-brihaspati-credits] --days must be a positive integer (got ${daysStr})`);
    process.exit(2);
  }

  return { email, amount, reason, by, days, yes };
}

async function confirm(prompt: string): Promise<boolean> {
  const rl = createInterface({ input: stdin, output: stdout });
  try {
    const answer = (await rl.question(`${prompt} (y/N) `)).trim().toLowerCase();
    return answer === 'y' || answer === 'yes';
  } finally {
    rl.close();
  }
}

async function main() {
  const args = parseArgs();
  const sb = getServerSupabase();
  if (!sb) {
    console.error('[grant-brihaspati-credits] No Supabase — check env vars');
    process.exit(1);
  }

  // Look up by email via the public.admin_lookup_user_by_email RPC
  // (migration 058). Previous approaches:
  //   - auth.admin.listUsers({ perPage: 1000 }) — O(N) and silently
  //     truncates past 1000 users (Gemini PR #333 cycle-1 HIGH).
  //   - .schema('auth').from('users') — broke on the current supabase-js
  //     because `auth` is not in PostgREST's exposed-schemas allowlist
  //     (and we don't want to add it; auth tables hold identities,
  //     refresh tokens, etc. that should never be REST-reachable).
  // The RPC is SECURITY DEFINER with service_role-only GRANT, normalises
  // (trim+lower) inside the function, and uses the unique email index
  // for O(log N) lookup. Returns NULL when no row matches — distinguished
  // from a real error by the error vs data-NULL signal.
  const emailLower = args.email.trim().toLowerCase();
  const { data: resolvedId, error: lookupErr } = await sb.rpc(
    'admin_lookup_user_by_email',
    { p_email: emailLower },
  );
  if (lookupErr) {
    console.error('[grant-brihaspati-credits] auth lookup RPC failed:', lookupErr.message);
    process.exit(1);
  }
  if (!resolvedId) {
    console.error(`[grant-brihaspati-credits] no auth user matches ${args.email}`);
    process.exit(1);
  }
  const target = { id: resolvedId as string, email: emailLower };

  // Show current balance + intended grant; confirm unless --yes.
  const before = await getBalance(sb, target.id);
  console.log('');
  console.log('  user.id        :', target.id);
  console.log('  user.email     :', target.email);
  console.log('  balance before :', before);
  console.log('  granting       :', args.amount, 'credits');
  console.log('  reason         :', args.reason);
  console.log('  by             :', args.by);
  console.log('  expires in     :', args.days, 'days');
  console.log('');

  if (!args.yes) {
    const ok = await confirm('Proceed?');
    if (!ok) {
      console.log('[grant-brihaspati-credits] aborted by user');
      process.exit(0);
    }
  }

  await grantAdminCredits(sb, target.id, args.amount, args.reason, args.by, args.days);
  const after = await getBalance(sb, target.id);
  console.log('[grant-brihaspati-credits] balance after:', after);
  console.log('[grant-brihaspati-credits] done.');
}

main().catch(err => {
  console.error('[grant-brihaspati-credits] fatal:', err);
  process.exit(1);
});
