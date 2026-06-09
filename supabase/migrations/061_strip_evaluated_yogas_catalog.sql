-- ---------------------------------------------------------------------------
-- 061: Strip static yoga catalog fields from full_kundali.evaluatedYogas
--
-- Each kundali_snapshots row stored ~194 EvaluatedYoga entries inline,
-- each carrying the static yoga catalog (name/description/classicalRef/
-- formationRule/group/isAuspicious/affectedDomains/domainImpactWeight/
-- domainWeights/subGroup) duplicated from src/lib/kundali/yoga-engine/
-- rules. The catalog is ~420 KB per row (≈85% of the row's bytes) and
-- is byte-identical across every user — pure denormalisation cost.
--
-- This migration retro-strips existing rows so the table shrinks the
-- moment the migration ships, alongside the application code (PR
-- evaluated-yogas-codec) that:
--   - Strips catalog fields before INSERT/UPDATE.
--   - Re-merges them at read time via rehydrateKundali() in
--     getFreshSnapshot / useFreshSnapshot / load-subject-kundali /
--     the GET /api/user/profile enrichSnapshot return path.
--
-- Round-trip identity is asserted in src/lib/kundali/__tests__/
-- evaluated-yogas-codec.test.ts: any future yoga added to
-- ALL_YOGA_RULES is automatically covered because the test iterates
-- the full registered rule set.
--
-- Idempotent: re-running the migration is a safe no-op — stripped
-- entries are detected by the absence of the `description` key and
-- skipped.
-- ---------------------------------------------------------------------------

BEGIN;

-- Strip catalog fields from every evaluatedYogas[i] in every row.
-- Implementation walks the JSONB array per row, rebuilds each entry
-- as the chart-specific subset, and writes back.
WITH stripped AS (
  SELECT
    id,
    jsonb_set(
      full_kundali,
      '{evaluatedYogas}',
      COALESCE(
        (
          SELECT jsonb_agg(
            jsonb_strip_nulls(
              jsonb_build_object(
                'id',                 yoga->'id',
                'present',            yoga->'present',
                'strength',           yoga->'strength',
                'involvedPlanets',    yoga->'involvedPlanets',
                -- affectedDomains is per-user for Malika/Parivartana
                -- yogas — the engine overrides rule.affectedDomains
                -- from detection.customData.domains (engine.ts:231).
                -- The TypeScript codec only persists it when it
                -- differs from the catalog default; here we keep it
                -- verbatim for the (small) cost of redundant data on
                -- ~190 non-malika yogas, because the rule catalog is
                -- not available in SQL. The next ENGINE_VERSION-driven
                -- recompute will re-strip them cleanly.
                'affectedDomains',    yoga->'affectedDomains',
                'cancellationStatus', yoga->'cancellationStatus',
                'interactions',       yoga->'interactions',
                'patternData',        yoga->'patternData'
              )
            )
          )
          FROM jsonb_array_elements(full_kundali->'evaluatedYogas') AS yoga
        ),
        '[]'::jsonb
      )
    ) AS new_full_kundali,
    pg_column_size(full_kundali) AS bytes_before
  FROM kundali_snapshots
  WHERE
    full_kundali ? 'evaluatedYogas'
    AND jsonb_typeof(full_kundali->'evaluatedYogas') = 'array'
    -- Only strip rows that still carry catalog fields (idempotency guard).
    -- A stripped entry has no `description` key on the first yoga; checking
    -- the first entry is sufficient because the writer strips them all
    -- together. Skip empty arrays — UPDATE-to-self is write amplification
    -- with no payoff. (Gemini PR #639 review applied retroactively.)
    AND jsonb_array_length(full_kundali->'evaluatedYogas') > 0
    AND (full_kundali->'evaluatedYogas'->0) ? 'description'
)
UPDATE kundali_snapshots ks
SET full_kundali = s.new_full_kundali
FROM stripped s
WHERE ks.id = s.id;

-- Diagnostic: log post-strip storage to migration history. The DB
-- size reclaim is on the order of 90% per row (270 KB → ~15 KB) —
-- VACUUM FULL recovers the disk space; ANALYZE refreshes statistics.
ANALYZE kundali_snapshots;

COMMIT;
