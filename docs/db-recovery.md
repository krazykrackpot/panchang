# Database recovery posture — Dekho Panchang

**Updated:** 2026-04-16
**Status:** **TODO — PITR verification pending** (action required on Supabase dashboard)

This document is the operational playbook for database disasters. It's deliberately short: when you need it, you need it fast.

---

## Supabase Point-in-Time Recovery (PITR)

### What it does

PITR lets you restore the database to any second within a retention window (7–14 days depending on plan). Protects against:

- Accidental `DELETE` / `UPDATE` without a `WHERE` clause
- Dropped migrations / corrupted schema changes
- A compromised service-role key being used to wipe or modify data
- A regrettable `supabase db reset` on production

Without PITR, your only safety net is Supabase's daily logical backup — which can lose up to 24 hours of data and takes ~hours to restore.

### ⚠️ Action required

**Verify PITR is enabled on the Supabase dashboard:**

1. Log into [supabase.com/dashboard](https://supabase.com/dashboard)
2. Open the `qtxbbeyjvkhvciseswpr` project (the Dekho Panchang prod project)
3. Go to **Project Settings → Add Ons / Database** (exact label depends on Supabase's UI at the time)
4. Look for **Point-in-Time Recovery** — confirm it shows an active retention period

If PITR is not active: on the Pro plan ($25/mo) this is included at 7-day retention. On higher plans you can extend to 14 or 28 days. **This is the single highest-leverage $25 you can spend on this project.** Enable before any further production writes.

Once confirmed, update the status line at the top of this file from "TODO" to "CONFIRMED: N-day retention, verified YYYY-MM-DD".

### When to use PITR

Trigger: "oh god I just ran the wrong query in production."

1. Stop writing to the database immediately. If it's a runaway app bug, deploy a maintenance-mode page; if it's a manual SQL mistake, step away from the keyboard.
2. Note the exact timestamp of the bad operation (within a few seconds is good enough).
3. From the Supabase dashboard, initiate PITR to 60 seconds **before** the bad operation.
4. PITR creates a **new** restored project — the original stays intact. You then manually copy rows from the restored instance into prod, or swap the connection string and promote.
5. Post-incident: write up a timeline and add a guardrail to prevent recurrence (see below).

**Expected recovery time:** 15–60 minutes for the restored project to become queryable. Plan accordingly — this is not an instant rollback.

---

## Other recovery layers

### Nightly logical backups

Supabase runs these on all paid plans. Dashboard → Database → Backups. Less precise than PITR but good for "I deleted a row three days ago and noticed today." You download the SQL dump and extract the missing row manually.

### Migration history

Every schema change lives in `supabase/migrations/NNN_*.sql`. If a migration corrupts data, rolling back is not automatic — you write a new migration that reverses it. See `scripts/apply-migrations.sh`.

**House rule:** never apply a destructive migration (DROP, ALTER ... DROP COLUMN, UPDATE without WHERE) without first capturing a `pg_dump` of the affected tables. Script:

```bash
# Belt-and-suspenders before a risky migration:
npx supabase db dump --file "pre-migration-$(date +%F).sql"
# then apply migration
# then sanity-check row counts
```

### Repo-level RLS audit

All 10 user-owned tables have RLS enabled (verified 2026-04-16 via `pg_tables`). Anon clients cannot read or write other users' rows even if the app code has a bug. This is a *containment* layer, not a recovery layer — it limits blast radius during an incident but doesn't restore lost data.

---

## Blast radius scenarios

### 1. Accidental cross-user DELETE via service-role

**Who:** a developer running `supabase db query --linked "DELETE FROM saved_charts WHERE ..."` with a typo in the WHERE clause.

**Blast:** potentially every saved_charts row.

**Recovery:** PITR to just before the DELETE. ~30 min RTO.

**Prevention:** never write production SQL without a corresponding SELECT-of-same-predicate first. See `docs/prompts/06-feature-delivery.md` principle 10 (destructive ops require explicit intent).

### 2. Compromised service-role key

**Who:** the `SUPABASE_SERVICE_ROLE_KEY` leaks (committed by mistake, exposed in a client bundle, stolen from a dev machine).

**Blast:** total takeover. Attacker can read all user data, write arbitrary rows, delete tables.

**Recovery:**
1. Rotate the key IMMEDIATELY on the Supabase dashboard → Settings → API.
2. Update `.env.local` + Vercel env vars + any CI secrets.
3. Redeploy.
4. Audit database for unexpected changes in the key's active window. PITR restore if needed.
5. Audit auth logs for signup spam or password-reset abuse.
6. If user PII was potentially read: notify affected users (GDPR may require this within 72h).

**Prevention:** the key lives ONLY in server-side code. `src/lib/supabase/server.ts` is the ONE import site. `src/lib/supabase/client.ts` uses only the anon key. Verified by grep.

### 3. Dropped / corrupted migration

**Who:** a `DROP TABLE` in a migration that shouldn't have been there; a botched `ALTER COLUMN TYPE`.

**Blast:** tables lost, columns dropped, data that lived in them is gone.

**Recovery:** PITR to just before the migration applied. Note the migration number that caused it; revise the migration SQL; apply the corrected version on top of the restored state.

**Prevention:** `npx supabase db dump` before every migration touching existing tables.

### 4. Auth user wipeout

**Who:** the `auth.users` table gets truncated (very unlikely — triggers + foreign keys usually prevent this), or a signup trigger regression breaks the profile-creation chain.

**Blast:** existing users can't sign in; their linked user_profiles rows become orphaned.

**Recovery:** PITR. Auth user rows can't be recreated post-hoc from our side.

**Prevention:** every `auth.users` trigger uses `SECURITY DEFINER` + `SET search_path = public` + `EXCEPTION WHEN OTHERS THEN RETURN NEW` so trigger bugs never block signup. This is enforced in CLAUDE.md and all current triggers follow it. Still worth running `curl -X POST .../auth/v1/signup` after any trigger change to verify.

---

## Incident response — first 5 minutes

If something's on fire in production:

1. **Stop writes.** Deploy maintenance mode or take the app offline via Vercel's deploy protection.
2. **Note the timestamp.** To the second. This is what PITR needs.
3. **Don't panic-query.** Don't run anything that could make it worse.
4. **Open this file.** Follow the relevant scenario above.
5. **After:** write a postmortem at `docs/incidents/YYYY-MM-DD-short-title.md`. What happened, why, what recovery steps worked, what new guardrail prevents recurrence.

---

## Verification log

Update this section whenever you verify posture:

| Date | What was verified | Verdict |
|---|---|---|
| 2026-04-16 | Audit doc created | Initial |
| | PITR enabled + retention days | TODO |
| | `.env.local` service-role key not in git | PASS — `.gitignore` covers `.env*` |
| | Service-role key imported only in server code | PASS — grep confirmed |
| | `auth.users` triggers have `EXCEPTION WHEN OTHERS` | PASS — 006_fix_signup_trigger.sql |
| | Last successful signup verified | TODO |
