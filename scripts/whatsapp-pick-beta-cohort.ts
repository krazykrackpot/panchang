/**
 * Pick the initial WhatsApp closed-beta cohort.
 *
 * Selects up to N high-engagement users from the signed-up base, ranked by
 * a simple signal blend:
 *   + recency        (signed up in the last 60 days)
 *   + saved kundali  (at least one kundali_snapshot row = they generated their chart)
 *   + locale fit     (prioritises hi/en first since v1 templates are en+hi only)
 *
 * Prints a Vercel-ready env line:
 *   WHATSAPP_BETA_USER_IDS=uuid1,uuid2,...
 *
 * Usage:
 *   npx tsx scripts/whatsapp-pick-beta-cohort.ts          # default 25
 *   npx tsx scripts/whatsapp-pick-beta-cohort.ts --n 10   # custom size
 *   npx tsx scripts/whatsapp-pick-beta-cohort.ts --dry    # show ranking only
 *
 * Required env: NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY
 */

import { createClient } from '@supabase/supabase-js';

interface Candidate {
  id: string;
  email: string | null;
  created_at: string;
  locale: string | null;
  has_kundali: boolean;
  score: number;
}

const N_DEFAULT = 25;
const RECENCY_WINDOW_DAYS = 60;

async function main() {
  const args = process.argv.slice(2);
  const n = parseInt(
    args[args.indexOf('--n') + 1] ?? String(N_DEFAULT),
    10,
  );
  const dryRun = args.includes('--dry');

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();
  if (!url || !key) {
    console.error('Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY');
    process.exit(1);
  }
  const supabase = createClient(url, key, { auth: { persistSession: false } });

  // 1. All users
  const { data: users, error: usersErr } = await supabase
    .from('auth.users' as never)
    .select('id, email, created_at, raw_user_meta_data');
  if (usersErr) {
    console.error('users query failed:', usersErr.message);
    process.exit(1);
  }

  // 2. Users with at least one saved kundali
  const { data: kundalis } = await supabase
    .from('kundali_snapshots' as never)
    .select('user_id');
  const userIdsWithKundali = new Set(
    ((kundalis ?? []) as Array<{ user_id: string }>).map((k) => k.user_id),
  );

  // 3. Locale preference (from user_profiles if set, else en)
  const { data: profiles } = await supabase
    .from('user_profiles')
    .select('user_id, preferred_locale');
  const userIdToLocale = new Map<string, string>();
  for (const p of (profiles ?? []) as Array<{ user_id: string; preferred_locale: string | null }>) {
    if (p.preferred_locale) userIdToLocale.set(p.user_id, p.preferred_locale);
  }

  const now = Date.now();
  const recencyCutoff = now - RECENCY_WINDOW_DAYS * 24 * 60 * 60 * 1000;

  const candidates: Candidate[] = ((users ?? []) as Array<{
    id: string;
    email: string | null;
    created_at: string;
  }>).map((u) => {
    const createdMs = new Date(u.created_at).getTime();
    const isRecent = createdMs >= recencyCutoff;
    const hasKundali = userIdsWithKundali.has(u.id);
    const locale = userIdToLocale.get(u.id) ?? 'en';
    const v1LangFit = ['en', 'hi', 'mai'].includes(locale); // Phase 1 templates

    // Score: 0-100 blend. Tuned by hand for the 126-user base; revisit
    // when adding more signals (DAU, AI usage, etc.).
    let score = 0;
    if (isRecent) score += 30;
    if (hasKundali) score += 50;
    if (v1LangFit) score += 20;

    return {
      id: u.id,
      email: u.email,
      created_at: u.created_at,
      locale,
      has_kundali: hasKundali,
      score,
    };
  });

  const ranked = candidates
    .filter((c) => c.score >= 30) // require at least recency OR kundali
    .sort((a, b) => b.score - a.score);

  console.log(`\nRanked ${ranked.length} eligible candidates (score >= 30):\n`);
  for (const [i, c] of ranked.slice(0, n).entries()) {
    console.log(
      `${(i + 1).toString().padStart(3)}. score=${c.score.toString().padStart(3)} ` +
      `locale=${c.locale.padEnd(3)} kundali=${c.has_kundali ? 'Y' : 'N'}  ` +
      `${c.email ?? '(no email)'}  ${c.id}`,
    );
  }

  const picked = ranked.slice(0, n).map((c) => c.id).join(',');
  if (dryRun) {
    console.log('\n(dry run — not printing the env value; rerun without --dry)');
    return;
  }
  console.log(`\nSet on Vercel (production):`);
  console.log(`\n  WHATSAPP_BETA_USER_IDS=${picked}\n`);
  console.log(`Or via CLI:`);
  console.log(`  echo "${picked}" | vercel env add WHATSAPP_BETA_USER_IDS production\n`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
