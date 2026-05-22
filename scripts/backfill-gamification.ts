#!/usr/bin/env npx tsx
// scripts/backfill-gamification.ts
// One-shot: compute initial user_progress + user_badges rows for existing users.
import { getServerSupabase } from '../src/lib/supabase/server';
import { awardProgress } from '../src/lib/gamification/award';

async function main() {
  const sb = getServerSupabase();
  if (!sb) { console.error('No supabase'); process.exit(1); }

  const { data: users, error: uErr } = await sb.auth.admin.listUsers();
  if (uErr) { console.error('listUsers failed:', uErr); process.exit(1); }
  console.log(`Found ${users.users.length} users`);

  for (const u of users.users) {
    // Seed streak/progress row
    await awardProgress(u.id, { type: 'sign_in' });

    // Profile completion?
    const { data: profile } = await sb.from('user_profiles')
      .select('date_of_birth, time_of_birth, birth_place, birth_lat, birth_lng')
      .eq('id', u.id).maybeSingle();
    if (profile?.date_of_birth && profile?.time_of_birth && profile?.birth_place) {
      await awardProgress(u.id, { type: 'profile_completed' });
    }

    // Saved charts count
    const { data: charts } = await sb.from('saved_charts').select('id').eq('user_id', u.id);
    if (charts) {
      for (let i = 0; i < charts.length; i++) {
        await awardProgress(u.id, { type: 'chart_saved' });
      }
    }

    console.log(`✓ backfilled ${u.email ?? u.id}`);
  }
  console.log('Done.');
}

main().catch(err => { console.error(err); process.exit(1); });
