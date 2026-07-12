# WhatsApp Closed-Beta Launch — Operator Playbook

**Prereq:** WABA + templates approved (see `whatsapp-waba-setup.md` Steps 1-9 done), all env vars set on Vercel, migration 065 applied.

## Day 0 — pick the 25-user cohort

```bash
# From repo root, with .env.local sourced
npx tsx scripts/whatsapp-pick-beta-cohort.ts            # ranks all + prints top 25
npx tsx scripts/whatsapp-pick-beta-cohort.ts --dry      # show ranking, don't print env value
npx tsx scripts/whatsapp-pick-beta-cohort.ts --n 10     # smaller cohort for first 24h
```

Copy the printed `WHATSAPP_BETA_USER_IDS=…` line and set it on Vercel:

```bash
echo "uuid1,uuid2,…" | vercel env add WHATSAPP_BETA_USER_IDS production
vercel redeploy --prebuilt   # or just wait for the next deploy
```

Verify a non-beta user sees nothing on their `/dashboard` (the card should be invisible). Verify a beta user sees the green WhatsApp opt-in card.

## Day 1-7 — monitoring

**Daily SQL spot-check:**

```sql
-- Opt-ins so far
SELECT count(*) FILTER (WHERE verified_at IS NOT NULL) AS verified,
       count(*) FILTER (WHERE verified_at IS NULL AND opted_out_at IS NULL) AS pending,
       count(*) FILTER (WHERE opted_out_at IS NOT NULL) AS opted_out
FROM user_whatsapp_subscriptions;

-- Messages sent + failed by status
SELECT status, count(*) AS n,
       round(sum(cost_micros)::numeric / 1e6, 2) AS cost_usd
FROM whatsapp_send_log
WHERE sent_at > now() - interval '7 days'
GROUP BY status;

-- Recent failures (debug if anything's broken)
SELECT sent_at, failure_code, failure_message, count(*)
FROM whatsapp_send_log
WHERE status = 'failed' AND sent_at > now() - interval '24 hours'
GROUP BY sent_at, failure_code, failure_message
ORDER BY sent_at DESC LIMIT 20;

-- Opt-out reasons (high STOP-rate = message tone or frequency problem)
SELECT opt_out_reason, count(*)
FROM user_whatsapp_subscriptions
WHERE opted_out_at > now() - interval '7 days'
GROUP BY opt_out_reason;
```

**Vercel logs to watch:**

- `[wa-cron]` lines — one per hourly tick, shows matched/sent/skipped counts
- `[wa-cost-rollup]` line — once daily at 04:30 IST, MTD cost summary
- `[whatsapp/webhook]` — inbound STOP/HELP replies + delivery receipts
- `[whatsapp/send-daily]` failed sends — first sign of API issues

## Decision gates after 7 days

| If… | Then… |
|---|---|
| Verified ≥ 12 (of 25) AND opt-out rate < 15% AND budget < $5 | Broaden — add next 50 users |
| Verified < 12 | Investigate: phone-input UX issue? wrong cohort? Pause expansion. |
| Opt-out rate ≥ 15% | Message tone / frequency / send-time problem. Survey opted-out users (3-question form via email). |
| Budget > $5 in week 1 | Recompute projection. May need to raise cap or restrict cohort. |
| Any P0 (wrong panchang, sent to wrong number) | Pause cron — `vercel env add WHATSAPP_BETA_USER_IDS production` set to empty string. Investigate. |

## Going GA

```bash
echo "*" | vercel env add WHATSAPP_BETA_USER_IDS production
vercel redeploy --prebuilt
```

That's it — `"*"` opens the gate to all signed-in users. The card appears on everyone's dashboard from the next request.

## Killswitch

```bash
echo "" | vercel env add WHATSAPP_BETA_USER_IDS production
vercel redeploy --prebuilt
```

Empty string = nobody passes the gate. Existing subscriptions remain in the DB but the cron's send loop already filters by `verified_at IS NOT NULL AND opted_out_at IS NULL` so the killswitch only blocks NEW opt-ins. To stop EXISTING sends:

```sql
-- Pause all active subscriptions (preserves rows so you can resume later)
UPDATE user_whatsapp_subscriptions
SET opted_out_at = now(), opt_out_reason = 'admin'
WHERE opted_out_at IS NULL;
```
