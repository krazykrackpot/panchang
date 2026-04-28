# Infrastructure & Hosting Plan

## Current Setup (Apr 2026)

| Layer | Provider | Cost |
|-------|----------|------|
| Hosting | Vercel Pro | $20/mo |
| CDN/DNS | Cloudflare (free) | $0 |
| Database | Supabase (free) | $0 |
| Email | Resend (free tier) | $0 |
| Payments | Stripe + Razorpay | transaction fees |
| Domain | Cloudflare Registrar | ~$10/yr |

**Cloudflare DNS:** `lennox.ns.cloudflare.com` / `lia.ns.cloudflare.com`
**Vercel team:** `adis-projects-13833487`
**Domain:** `dekhopanchang.com`

## Why Vercel Became a Problem

On Apr 27 2026, the free tier was paused at 300% Fluid Active CPU usage. Root cause: the panchang API recomputed heavy astronomical data (tithi tables, festival calendars) on every request with only 5-minute edge caching.

**Fix applied:** Bumped edge cache TTLs to match data freshness:
- `/api/panchang` — 12h (data is daily, sunrise-to-sunrise)
- `/api/tithi-table` — 7 days (year's table is static)
- `/api/calendar` — 24h (festival calendar is per-year)
- `/api/retrograde`, `/api/eclipses`, `/api/combustion` — 7 days (static per year)
- `/api/transits` — 24h (positions change daily)
- `robots.txt` — added `Crawl-delay: 2` to throttle bots
- Removed SpeedInsights ($10/mo add-on, unused)

Upgraded to Pro ($20/mo) as interim solution.

## Migration Plan: Hetzner + Coolify

When ready to move off Vercel (target: once stable for 1-2 months on Pro).

### Why Hetzner

- **No CPU metering** — fixed price, unlimited compute
- **In-memory cache persists** — tithi table computed once, stays in RAM forever
- **Close to user** — Falkenstein DC is ~400km from Corseaux, Switzerland
- **Cost** — CAX21 (4 ARM cores, 8GB RAM) at ~€7/mo vs Vercel Pro $20/mo

### Why Coolify

- Git-push-to-deploy (same workflow as Vercel)
- Auto-SSL via Let's Encrypt
- Secrets/env var management UI
- Docker-based — full control over runtime
- Free, self-hosted on the same Hetzner VPS

### Migration Steps

1. **Dockerize the app**
   ```dockerfile
   FROM node:24-alpine
   WORKDIR /app
   COPY package*.json ./
   RUN npm ci --production
   COPY . .
   RUN npm run build
   EXPOSE 3000
   CMD ["npm", "start"]
   ```

2. **Set up Hetzner VPS**
   - Create CAX21 instance (Falkenstein)
   - Install Coolify: `curl -fsSL https://cdn.coollabs.io/coolify/install.sh | bash`

3. **Configure Coolify**
   - Connect GitHub repo
   - Add all env vars (Supabase, Stripe, Razorpay, Resend keys)
   - Set up auto-deploy on push to `main`

4. **Replace Vercel Cron**
   - Daily panchang email cron (00:30 UTC) → system cron or node-cron
   - `crontab -e`: `30 0 * * * curl -s http://localhost:3000/api/cron/daily-email`

5. **Test on subdomain**
   - Point `staging.dekhopanchang.com` to Hetzner IP
   - Verify: auth, panchang, kundali, checkout, email

6. **Flip DNS**
   - Cloudflare: change A record from `76.76.21.21` (Vercel) → Hetzner IP
   - Enable orange cloud (Cloudflare proxy) for edge caching + DDoS
   - TTL 300s for quick rollback if needed

7. **Keep Vercel for previews**
   - Free tier covers preview deployments for PRs
   - No need to cancel Vercel entirely

### What Cloudflare Replaces

Vercel gives you edge CDN in 300+ locations. Cloudflare (free plan) provides:
- Global edge caching (same or better coverage)
- DDoS protection
- SSL termination
- Page Rules for cache control
- Analytics (free)

### Risk Mitigation

- Test for 48h on staging before DNS flip
- Keep Vercel project alive for 30 days as rollback
- Cloudflare TTL at 300s during cutover (5-min rollback)
- Monitor with `curl` health checks from multiple regions

## App-Level Optimizations (Done)

| Optimization | Status |
|-------------|--------|
| Edge caching on all API routes | Done (Apr 27 2026) |
| stale-while-revalidate on panchang | Done |
| Crawler throttle (robots.txt) | Done |
| SpeedInsights removed | Done |
| In-memory tithi table cache | Exists (useless on serverless, valuable on VPS) |
| Pre-computed static data | Not yet (would help on any platform) |

## Future Optimization: Pre-Compute Static Data

For data that doesn't change (tithi tables, retrograde dates, eclipse dates), pre-compute at build time:

```bash
# Build-time script
node scripts/precompute.js --year 2026 --year 2027
# Outputs: public/data/tithi-2026.json, public/data/retro-2026.json, etc.
```

API routes then read from static JSON instead of computing. This makes the app work on ANY hosting (even a $0 static host) for read-only data.
