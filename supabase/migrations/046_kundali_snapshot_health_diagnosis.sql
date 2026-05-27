-- 046_kundali_snapshot_health_diagnosis.sql
--
-- Adds health-diagnosis cache columns to kundali_snapshots.
-- The /api/medical route will write here after first compute and serve
-- the cached value on subsequent requests for the same user/engine-version.
--
-- Two payload columns (default + extended) allow the extended set to be
-- computed lazily on first request without blowing away the default cache.
--
-- Cache invalidation is handled by the existing computation_version column:
-- when ENGINE_VERSION changes (new code release), the version-mismatch check
-- in the route causes a recompute + overwrite of these columns.
--
-- Three-state semantics for each field:
--   NULL                = not yet computed for this user/version
--   {} / valid JSONB    = computed and cached
-- The route uses strict IS NULL / IS NOT NULL checks, not a truthiness check.
--
-- Spec: docs/superpowers/specs/2026-05-27-vercel-cost-reduction-design.md §2 Fix 2 + §3

ALTER TABLE kundali_snapshots
  ADD COLUMN IF NOT EXISTS health_diagnosis JSONB,
  ADD COLUMN IF NOT EXISTS health_diagnosis_extended JSONB,
  ADD COLUMN IF NOT EXISTS health_diagnosis_computed_at TIMESTAMPTZ;
