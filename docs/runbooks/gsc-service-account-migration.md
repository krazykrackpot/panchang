# GSC service-account migration — runbook

**Status**: client side shipped (PR #370), env-var flip pending
**Why**: `feedback_gsc_use_adc` — OAuth refresh tokens silently revoke when the underlying Google account changes its password / 2FA / OAuth-consent-screen settings. A service account is a first-class GCP principal — it does not get its credentials reset by user actions.

## What changed in the code

`src/lib/seo/gsc-client.ts` now tries the service-account JWT path FIRST. If `GOOGLE_SERVICE_ACCOUNT_EMAIL` + `GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY` are present, the cron mints a JWT, exchanges it for an access token, and queries Search Console. If those env vars are absent, it falls back to the legacy `GSC_REFRESH_TOKEN` + `GOOGLE_OAUTH_CLIENT_SECRET` path so the cron keeps running during the migration window.

The fallback emits a `console.warn('[gsc] using legacy OAuth refresh-token auth — migrate to service account')` on every invocation. That warning is the operator's reminder to finish step 4 below.

## Step-by-step migration

### 1. Create the service account in GCP

```bash
# Project ID — find from `gcloud config get-value project` or Vercel envs
PROJECT_ID="panchang-prod"  # adjust to your project

gcloud iam service-accounts create gsc-readonly \
  --display-name="GSC daily cron reader" \
  --project="${PROJECT_ID}"
```

Note the service account email format: `gsc-readonly@${PROJECT_ID}.iam.gserviceaccount.com`.

### 2. Grant the service account access to Search Console

Service accounts are NOT auto-added by GCP role; you grant them as a Search Console user manually:

1. Open https://search.google.com/search-console/users — pick the property `sc-domain:dekhopanchang.com`
2. Click **Add user** → enter the service account's email (`gsc-readonly@${PROJECT_ID}.iam.gserviceaccount.com`)
3. Permission level: **Full** (Restricted gives read-only-public; Full is needed for Search Analytics API)
4. Confirm with **Add**

The change propagates within ~5 minutes; the service account can then call the Search Analytics endpoint.

### 3. Generate a JSON key

```bash
gcloud iam service-accounts keys create gsc-key.json \
  --iam-account="gsc-readonly@${PROJECT_ID}.iam.gserviceaccount.com" \
  --project="${PROJECT_ID}"
```

The output file `gsc-key.json` looks roughly like:

```json
{
  "type": "service_account",
  "project_id": "panchang-prod",
  "private_key_id": "...",
  "private_key": "-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n",
  "client_email": "gsc-readonly@panchang-prod.iam.gserviceaccount.com",
  "client_id": "...",
  ...
}
```

### 4. Set Vercel env vars

```bash
# From the project root
cat gsc-key.json | jq -r '.client_email' | xargs -I {} sh -c '
  echo "{}" | vercel env add GOOGLE_SERVICE_ACCOUNT_EMAIL production
'

cat gsc-key.json | jq -r '.private_key' | xargs -I {} sh -c '
  echo "{}" | vercel env add GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY production
'
```

Or via the Vercel dashboard:

- `GOOGLE_SERVICE_ACCOUNT_EMAIL` = `gsc-readonly@panchang-prod.iam.gserviceaccount.com`
- `GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY` = the entire `private_key` string from the JSON file. **Keep the `\n` escape sequences as-is** — the gsc-client unescapes them at runtime (Vercel stores env values as a single line, so the JSON-escaped `\n` is necessary).

### 5. Verify the cron uses the new path

After the next scheduled cron run (or trigger it manually via `vercel cron trigger`), check `vercel logs`:

- ✅ Expected: no `[gsc] using legacy OAuth refresh-token auth` warning. The cron runs silently with the SA-backed token.
- ❌ If the warning still appears, the new env vars weren't picked up — re-check Step 4 spelling and the production environment scope.

### 6. Delete the local key file + retire OAuth vars

After at least one successful production run with the SA path:

```bash
# Local cleanup — the key is now in Vercel
shred -u gsc-key.json   # or: rm -P on macOS
```

Then in Vercel:

- Remove `GSC_REFRESH_TOKEN` (production)
- Remove `GOOGLE_OAUTH_CLIENT_SECRET` (production) — only if no other surface uses it; `grep -r GOOGLE_OAUTH_CLIENT` first
- Keep `GOOGLE_OAUTH_CLIENT_ID` if it's also used for end-user Google sign-in elsewhere

## Rollback

If the SA path fails for any reason, restore the legacy path by:

1. Removing `GOOGLE_SERVICE_ACCOUNT_EMAIL` from Vercel — the gsc-client falls through to OAuth automatically.
2. Re-checking that `GOOGLE_OAUTH_CLIENT_ID` + `GOOGLE_OAUTH_CLIENT_SECRET` + `GSC_REFRESH_TOKEN` are still set.
3. Triggering the cron again. It should run with the deprecation warning back.

No code change needed for rollback — the dual-path client handles it.

## Why the GSC indexing-request cron was paused

The cron at `scripts/gsc-indexing-cron.ts` was paused (Task #94, `launchctl bootout`) on 2026-05-20 after two consecutive runs failed with `[gsc] token exchange failed: 400 invalid_grant`. The refresh token had been revoked by a 2FA change. The pause was correct — there was no point re-enabling until the auth path was robust.

After this migration completes:

1. Re-enable the cron: `launchctl bootstrap ~/Library/LaunchAgents/com.dekhopanchang.gsc-indexing.plist`
2. Watch the first 7 days of runs in `~/Library/Logs/dekhopanchang-gsc/`
3. If still healthy at day 7, mark Task #94 + Task #100 fully complete

## Related work

- `src/lib/seo/gsc-client.ts` — the dual-path client
- `src/lib/seo/__tests__/gsc-client.test.ts` — source-level auth-flow invariants
- `src/app/api/cron/seo-health/route.ts` — main consumer of the GSC client
- `scripts/gsc-auth.ts` — legacy OAuth refresh-token bootstrap script (kept for reference; not needed for the SA path)
