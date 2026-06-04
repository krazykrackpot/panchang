# Bing Webmaster Tools — setup runbook

**Status**: code shipped 2026-06-04; operator action pending to verify the property and set the API key.

## Why this exists

The codebase has two parallel Bing-notification pipelines:

| Pipeline | Purpose | Where | Status |
|---|---|---|---|
| **IndexNow** | Ping Bing's index that specific URLs changed | `src/lib/seo/indexnow.ts` + 4 daily Vercel crons | ✅ Active |
| **Webmaster API** | Surface URLs in Bing Webmaster Tools dashboard + submit sitemap directly | `src/lib/seo/bing-webmaster.ts` + `/api/cron/bing-submit-urls` daily + `scripts/bing-submit-sitemap.ts` CLI | ⚠️ Code shipped; account verification + API key still pending |

IndexNow tells Bing about new URLs without authentication. The Webmaster API surfaces those URLs in your Bing Webmaster Tools dashboard with coverage stats, search-query data, and per-URL inspection — the equivalent of Google Search Console.

Both pipelines should run. They don't conflict; Bing de-dupes internally.

## Operator setup

### Step 1 — Verify the apex property in Bing Webmaster Tools

1. Open https://www.bing.com/webmasters
2. Sign in with the operator Microsoft account
3. Click **Add a site**
4. Enter `https://dekhopanchang.com` — **NOT** `https://www.dekhopanchang.com`. Vercel 308-redirects `www.` to apex, and the Webmaster API POST body would be dropped on the redirect (same root cause as the Stripe webhook incident — see `CLAUDE.md` Lesson on Stripe Webhook Conventions).
5. Verify via one of the supported methods:
   - **Preferred**: import from Google Search Console (Bing reads the GSC verification record). Works instantly if `dekhopanchang.com` is already a verified GSC property — which it is.
   - **Alternative**: DNS TXT record or HTML meta tag. Slower (15+ min DNS propagation).

### Step 2 — Generate an API key

1. In Bing Webmaster Tools → click the gear icon top-right → **API access**
2. Click **Generate** under "API Key"
3. Copy the key. It's a 32-char hex string.

The key inherits the verified-site permissions of the account that generated it. Don't share or commit it — same operational sensitivity as `GSC_REFRESH_TOKEN`.

### Step 3 — Set the env var in Vercel

```bash
vercel env add BING_WEBMASTER_API_KEY production
# Paste the key when prompted
```

Or via dashboard: https://vercel.com/<team>/<project>/settings/environment-variables — add `BING_WEBMASTER_API_KEY` for the Production environment.

**No redeploy needed** — `process.env.BING_WEBMASTER_API_KEY` is read at runtime by both the cron route and the CLI script.

### Step 4 — Submit the sitemap

One-shot. After the cron has caught up:

```bash
BING_WEBMASTER_API_KEY=<key> npx tsx scripts/bing-submit-sitemap.ts
```

Output:
```
[bing-submit-sitemap] submitting https://dekhopanchang.com/sitemap.xml ...
[bing-submit-sitemap] OK (status 200)
```

The Webmaster dashboard will start showing crawl + coverage data within 24–48h.

### Step 5 — Verify the daily URL-submission cron is firing

Wait one cycle (cron runs at 02:05 UTC daily). Then in Vercel:

1. Open the project → **Logs** → filter by `path:/api/cron/bing-submit-urls`
2. Look for the line `[bing-submit-urls] submitted N URLs` — N should be 100 (the daily quota cap)
3. If you see `BING_WEBMASTER_API_KEY not set — skipping submission`, the env var didn't apply. Re-check step 3.

## Why we cap at 100 URLs/day in the cron

Bing's documentation claims 10,000 URLs/day per quota, but the actual production limit is **100/day per site**. Over-submission returns a 4xx without persisting the batch. The cron picks the highest-traffic locale rotation (en + hi) so the 100-URL window goes to the URLs Bing's index is most likely to be queried about.

If we ever need to submit more than 100 (say a one-shot push after a major sitemap change), use `scripts/bing-submit-sitemap.ts` to push the sitemap URL instead — Bing's crawler will then discover all the URLs from the sitemap without burning the daily quota.

## Verifying the IndexNow pipeline is hitting Bing

Separate from the Webmaster API: verify IndexNow is alive.

1. Bing Webmaster Tools → **URL Submission** → **IndexNow URL Submission**
2. The bottom of the page shows recent IndexNow submissions. If the daily Vercel crons are firing, you'll see a fresh entry every 8 hours.
3. The "Status" column should be **Indexed** or **Pending Crawl**. If it's **Rejected (key not found)**, the key file at `https://dekhopanchang.com/89ef80b257d5a8596056ec514f3c1f47.txt` isn't being served — re-deploy and re-check.

## Rollback

If the Bing daily-submission cron starts failing repeatedly:

1. Remove `BING_WEBMASTER_API_KEY` from Vercel → the cron silently no-ops without breaking anything else
2. Investigate via the cron logs
3. Re-add the key when the issue is resolved

The IndexNow pipeline is independent — it keeps running regardless.

## Cross-references

- `src/lib/seo/indexnow.ts` — the IndexNow helper (Bing/Yandex/Seznam/Naver)
- `src/lib/seo/bing-webmaster.ts` — the Webmaster API client
- `scripts/bing-submit-sitemap.ts` — CLI sitemap push
- `src/app/api/cron/bing-submit-urls/route.ts` — daily URL push (this runbook's main wiring)
- `docs/runbooks/gsc-service-account-migration.md` — analogous setup for Google
- `vercel.json` — cron entry for `/api/cron/bing-submit-urls` at 02:05 UTC daily
