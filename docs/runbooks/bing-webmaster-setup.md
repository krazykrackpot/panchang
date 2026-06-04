# Bing Webmaster Tools — setup runbook

**Status**: code shipped 2026-06-04; operator action remaining is installing the local launchd agent (Bing property + API key already set up per the in-conversation walkthrough).

## Why this exists

The codebase has two parallel Bing-notification pipelines. They don't conflict; Bing de-dupes internally.

| Pipeline | Purpose | Where |
|---|---|---|
| **IndexNow** | Ping Bing's index that specific URLs changed | `src/lib/seo/indexnow.ts` + 4 daily Vercel crons (free for Bing — no auth) |
| **Webmaster API** | Surface URLs in Bing Webmaster Tools dashboard + submit sitemap directly | `src/lib/seo/bing-webmaster.ts` + `scripts/bing-submit-urls.ts` (local launchd, not Vercel) + `scripts/bing-submit-sitemap.ts` (CLI) |

Why the Webmaster API path is local launchd instead of Vercel cron: the cron is one HTTPS POST per day. Vercel would charge compute quota; local launchd costs nothing. Same pattern as `scripts/gsc-recovery-watch.plist.template`.

## Operator setup

### Step 1 — Verify the apex property in Bing Webmaster Tools

1. Open https://www.bing.com/webmasters
2. Sign in with a Microsoft account
3. Click **Import from Google Search Console** (or **Add a site manually** if GSC import fails)
4. Tick `https://dekhopanchang.com` (apex — NOT www; Vercel 308-redirects www to apex and the API POST body would be dropped during the redirect)
5. Click **Import**

Verification takes about a minute via GSC import. Manual verification (HTML meta tag or DNS TXT) takes 15+ min.

### Step 2 — Generate an API key

1. Bing Webmaster Tools → gear icon (top right) → **API access**
2. **Generate** under "API Key"
3. Copy the 32-char hex key

The key inherits permissions from your Microsoft account — it's effectively a personal access token. Treat it as a secret.

### Step 3 — One-shot sitemap submission

Run from your local checkout:

```bash
BING_WEBMASTER_API_KEY=<key> npx tsx scripts/bing-submit-sitemap.ts
```

Expected output:

```
[bing-submit-sitemap] submitting https://dekhopanchang.com/sitemap.xml ...
[bing-submit-sitemap] OK (status 200)
```

If status 400 with "feed not found": wait 30 minutes for property verification to propagate, then retry.

### Step 4 — Install the daily launchd agent

The agent runs `scripts/bing-submit-urls.ts` at 02:05 local time every day. Picks up to 100 URLs from the EN+HI rotation and submits them to Bing Webmaster API.

```bash
# 1. Copy the template into LaunchAgents
cp scripts/bing-submit-urls.plist.template \
  ~/Library/LaunchAgents/com.dekhopanchang.bing-submit-urls.plist

# 2. Compute the values you'll substitute
REPO="$(pwd)"              # if you're in the panchang checkout
NPX="$(command -v npx)"
KEY='<paste your Bing API key here>'

# 3. Replace placeholders in the installed plist (sed -i '' is macOS in-place edit)
sed -i '' \
  -e "s|__REPO__|$REPO|g" \
  -e "s|__NPX__|$NPX|g" \
  -e "s|__BING_WEBMASTER_API_KEY__|$KEY|g" \
  ~/Library/LaunchAgents/com.dekhopanchang.bing-submit-urls.plist

# 4. Validate the XML
plutil -lint ~/Library/LaunchAgents/com.dekhopanchang.bing-submit-urls.plist

# 5. Load it
launchctl bootstrap gui/$(id -u) ~/Library/LaunchAgents/com.dekhopanchang.bing-submit-urls.plist

# 6. Verify it's loaded
launchctl print gui/$(id -u)/com.dekhopanchang.bing-submit-urls | head -20
```

### Step 5 — Manual test run

Don't wait until 02:05 — kick the agent now to verify it works:

```bash
launchctl kickstart -k gui/$(id -u)/com.dekhopanchang.bing-submit-urls
```

Then check the logs:

```bash
cat /tmp/bing-submit-urls.out.log
cat /tmp/bing-submit-urls.err.log
```

Expected output in the out.log:

```
[bing-submit-urls] submitting 100 URLs for 2026-06-04
[bing-submit-urls] OK (status 200, 100 URLs)
```

If you see `BING_WEBMASTER_API_KEY not set — skipping`, the placeholder didn't get replaced in the plist. Re-do step 4.3 carefully.

### Step 6 — Verify in Bing Webmaster Tools dashboard

After the first successful submission:

1. Bing Webmaster Tools → **URL Submission** (left sidebar)
2. The page shows today's submitted batch with status (Indexed, Pending Crawl, or Rejected)
3. Wait 24–48h, then check the **Crawl Information** card on the overview — indexed pages should start climbing

## Verifying IndexNow is also being received

Separate from the Webmaster API path: confirm IndexNow is alive.

1. Bing Webmaster Tools → **URL Submission** → **IndexNow URL Submission** (sub-tab)
2. The page shows recent IndexNow submissions. With our 4×/day cron schedule you should see entries at:
   - 00:05 UTC (en + hi rotation)
   - 08:05 UTC (Devanagari rotation: mai + mr + bn)
   - 16:05 UTC (Southern rotation: ta + te + gu + kn)
3. Status should be **Indexed** or **Pending Crawl**. If it's **Rejected (key not found)**, the key file at `https://dekhopanchang.com/89ef80b257d5a8596056ec514f3c1f47.txt` isn't being served — re-verify the file is in production after PR #416 deploys.

## Rotating the API key

If the key is suspected leaked or you just want to rotate hygienically:

1. Bing Webmaster Tools → gear icon → **API access** → **Regenerate**
2. Edit `~/Library/LaunchAgents/com.dekhopanchang.bing-submit-urls.plist` — replace the `EnvironmentVariables` → `BING_WEBMASTER_API_KEY` value with the new key
3. Reload:
   ```bash
   launchctl bootout gui/$(id -u) ~/Library/LaunchAgents/com.dekhopanchang.bing-submit-urls.plist
   launchctl bootstrap gui/$(id -u) ~/Library/LaunchAgents/com.dekhopanchang.bing-submit-urls.plist
   ```
4. Manual test: `launchctl kickstart -k gui/$(id -u)/com.dekhopanchang.bing-submit-urls`

No redeploy of the app needed — the key only lives in the launchd plist, never in Vercel or the repo.

## Uninstall

```bash
launchctl bootout gui/$(id -u) ~/Library/LaunchAgents/com.dekhopanchang.bing-submit-urls.plist
rm ~/Library/LaunchAgents/com.dekhopanchang.bing-submit-urls.plist
```

The CLI script `scripts/bing-submit-urls.ts` is harmless if left in the repo; it only runs when explicitly invoked.

## Why we cap at 100 URLs/day

Bing's documentation claims 10,000 URLs/day per quota, but the actual production limit is **100/day per site**. Over-submission returns 4xx without persisting the batch. The cron picks the highest-traffic locale rotation (en + hi) so the 100-URL window goes to URLs Bing's index is most likely to be queried about.

If you ever need to push more than 100 URLs (one-shot after a major sitemap restructure), use `scripts/bing-submit-sitemap.ts` instead — Bing's crawler will discover URLs from the sitemap without burning the daily quota.

## Cross-references

- `src/lib/seo/indexnow.ts` — IndexNow helper (Bing / Yandex / Seznam / Naver)
- `src/lib/seo/bing-webmaster.ts` — Webmaster API client
- `scripts/bing-submit-sitemap.ts` — CLI sitemap push
- `scripts/bing-submit-urls.ts` — Daily URL push (called by the launchd agent)
- `scripts/bing-submit-urls.plist.template` — launchd agent template
- `scripts/gsc-recovery-watch.plist.template` — analogous setup pattern for Google
- `docs/runbooks/gsc-service-account-migration.md` — Google equivalent
