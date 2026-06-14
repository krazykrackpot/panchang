# Engine-version auto-invalidation smoke test

Verifies end-to-end that an `ENGINE_VERSION` bump auto-invalidates
precompute Blobs (PR #692 design). The infra is unit-tested in
`src/lib/precompute/__tests__/vercel-blob-storage.test.ts` but the
end-to-end behaviour has never been exercised in production.

## What we expect

1. Edit a file in the 22-file pipeline list at the top of
   `scripts/compute-engine-hash.ts`.
2. Rebuild — `engine-version.ts` is regenerated with a new hash.
3. `ENGINE_PREFIX` (first 7 chars) changes.
4. Page handlers read Blobs from the new prefix path; old prefix
   becomes orphaned but still in storage (cheap; cleanup workflow
   reclaims it on demand).
5. Reads under the new prefix return null until the nightly cron
   writes fresh Blobs.
6. Page handlers fall back to live compute in the interim (the
   `getPrecomputed` reader's null-Blob branch).

## Quick check (does the hash actually change?)

```bash
# Before — record current value
grep ENGINE_VERSION src/lib/kundali/engine-version.ts

# Touch any file in the pipeline list (use a comment-only edit; no
# behaviour change). Example pipeline file:
echo "// engine-version smoke test $(date)" >> src/lib/ephem/panchang-calc.ts

# Regenerate
npx tsx scripts/compute-engine-hash.ts

# Verify new value
grep ENGINE_VERSION src/lib/kundali/engine-version.ts
```

The two `grep` outputs should differ. Revert with `git checkout
src/lib/ephem/panchang-calc.ts src/lib/kundali/engine-version.ts`.

## Full verification (post-deploy)

After a production deploy that includes an engine-version-changing
commit:

1. **Pre-deploy snapshot**: hit a precomputed URL (e.g.
   `/en/choghadiya/2026-06-15`) and capture the response body. Note
   `x-vercel-cache` header (`HIT` or `MISS` or `PRERENDER`).

2. **Deploy** the engine-version-changing commit.

3. **Wait for cache propagation** (~5 min for ISR + Blob edge
   cache).

4. **Immediately after deploy**: hit the same URL again. Expected:
   - Response body is the same as pre-deploy *if the engine change
     was content-neutral* (e.g. a comment, a refactor).
   - Response body differs if the change was content-affecting.
   - `getPrecomputed` reader's null-Blob branch fires → page handler
     falls back to live `computePanchang()`. Performance should be
     slightly worse (no Blob hit) until the next nightly cron run.

5. **Verify in Vercel Blob dashboard**: the new
   `precompute/v1/{newPrefix}/...` path exists and contains 0 keys
   (cron hasn't written yet). The old `precompute/v1/{oldPrefix}/...`
   path still has its 22,500+ Blobs.

6. **Trigger the nightly cron manually** via `gh workflow run
   precompute-nightly.yml`. Wait for it to complete (~50 min worst
   case on first backfill under the new prefix).

7. **Verify**:
   - Same URL now reads from new-prefix Blob (re-hit and check
     response time / `x-vercel-cache: HIT`).
   - `vercel blob ls precompute/v1/{newPrefix}/` shows expected key
     counts.
   - Old-prefix Blobs are still there (orphaned). Run the
     `precompute-cleanup` workflow with `apply: true` to reclaim.

## Failure modes

- **Hash didn't change after pipeline edit**: `scripts/compute-engine-hash.ts`
  didn't pick up the file. Verify the file path is in the
  hashed-file list at the top of that script.

- **Old URLs serve stale content after deploy**: ISR cache for the
  page hasn't expired yet. Either wait for the 24h/86400s window or
  manually trigger a revalidate via `POST /api/precompute/revalidate`
  with the path list.

- **Cleanup deletes nothing**: confirm the script is running with the
  current `ENGINE_PREFIX` (the script reads it from `storage.ts`).
  Dry run prints the prefix it considers "current".

## Why we trust the infra without doing this manually

Unit tests in `src/lib/precompute/__tests__/vercel-blob-storage.test.ts`
already verify:

- Writes go to `precompute/v1/{ENGINE_PREFIX}/{key}.json`.
- Reads from a different prefix would miss (the path generator
  always uses the current `ENGINE_PREFIX`).
- `ENGINE_PREFIX` is a 7-char hex slice of `ENGINE_VERSION`.

So the failure mode would have to be either:
- `ENGINE_VERSION` doesn't actually change when a pipeline file
  changes (unlikely — `scripts/compute-engine-hash.ts` is a clean
  SHA over the file contents).
- Page handlers don't use `getPrecomputed` correctly (covered by
  the equivalence tests for each route family).

Run this smoke test if either of those assumptions is in doubt, or
after a substantial change to the precompute pipeline.
