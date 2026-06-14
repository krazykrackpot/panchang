# Vercel cost log

Change-log of cost-affecting commits + monthly line-item snapshots.

## How to read this

Two sections:

1. **Changes** — every commit that we expect to move a Vercel line
   item, with date, PR/SHA, expected direction.
2. **Monthly snapshots** — append-only table of line-item costs from
   `vercel usage --scope adis-projects-13833487` on the 1st of each
   month. Compare with `Δ` columns to see which line item moved.

For the raw per-service-per-snapshot history, see
`docs/vercel-usage-history.csv` (populated by
`scripts/snapshot-vercel-usage.ts`).

## How to refresh

```bash
# Snapshot current usage + write a new row per service into
# docs/vercel-usage-history.csv. Also prints a diff vs the last
# snapshot for at-a-glance regression detection.
npx tsx scripts/snapshot-vercel-usage.ts

# Diff-only (no CSV write):
npx tsx scripts/snapshot-vercel-usage.ts --diff
```

Run this weekly (or on the 1st of each month) to keep the table
below current. The script's diff output is what catches early
warning signs — a single line item jumping >50% week-over-week is a
regression signal.

## Changes

| Date | Commit / PR | Surface | Expected Δ |
|---|---|---|---|
| 2026-06-12 | #691 | `STRIPE_SECRET_KEY` `\n` cleanup; USD pricing $0.99 → $1.30 | small Δ on Stripe revenue, no Vercel impact |
| 2026-06-13 | #692 PR-1 | Engine-hash Blob prefix + narrow revalidate fan-out 1098 → 54 paths | ⬇⬇ ISR Writes (target line item) |
| 2026-06-13 | #693 PR-2 | `/panchang/date/[date]` precompute + cron 42 → 57 cities | ⬇ Fluid CPU |
| 2026-06-13 | #694 PR-3 | `/panchang/[city]` SSR + `/api/panchang` short-circuit | ⬇⬇ Fluid CPU (biggest single route family) |
| 2026-06-13 | #695 PR-4 | `/hindu-calendar/[year]` + `/daily/[date]/[city]` precompute | ⬇ Fluid CPU |
| 2026-06-13 | #696 PR-5 | `/festivals/[slug]/[year]/[city]` precompute | ⬇ Fluid CPU |
| 2026-06-13 | #697 PR-6 | `/muhurta/[type]/[year]/[month]/[city]` precompute (2026) | ⬇ Fluid CPU |
| 2026-06-14 | #700 PR-7 | Parallelize precompute cron + cleanup workflow | enables Δ from PRs 692-697 to actually land |
| 2026-06-14 | #701 PR-8 | TodayPanchangWidget Blob short-circuit + 2027 muhurta backfill | ⬇ Fluid CPU |
| 2026-06-14 | #702 PR-9 | Cost log + monthly snapshot + cron failure alerting | none direct; observability/detection |

## Monthly snapshots — Total billed

| Month | Billed total | Daily rate | Notes |
|---|---:|---:|---|
| 2026-05 (full) | $26.01 | $0.84/day | May baseline — pre-migration. |
| 2026-06-01 → 06-12 (12 days) | $120.36 | $10.03/day | Pre-PR-1 peak. ISR Writes runaway. |
| 2026-06-01 → 06-14 (14 days) | $131.70 | $5.67/day (last 2 days) | Post-PR-1 narrowing — 43% drop in daily rate. |

## Monthly snapshots — Top line items

Updated by `scripts/snapshot-vercel-usage.ts`. See the CSV for full
history with timestamps and services.

| Period | Fluid CPU | ISR Writes | Provisioned Memory | Fast Origin |
|---|---:|---:|---:|---:|
| 2026-05 (full) | $13.29 | $6.16 | $2.82 | — |
| 2026-06-01 → 06-12 | $44.38 | $43.95 | $9.66 | $8.62 |
| 2026-06-01 → 06-14 | $48.78 | $48.32 | $10.58 | $9.41 |

## Watch list

Line items to track as cost drivers:
- **Fluid Active CPU** — drops as precompute Blobs serve traffic.
- **ISR Writes** — most sensitive to revalidate fan-out. Spiked 7× in early June; PR-1 fixed the root cause.
- **Fluid Provisioned Memory** — function memory × invocations. Watch if it doesn't track CPU down.
- **Fast Origin Transfer** — bandwidth from functions back to edge.
