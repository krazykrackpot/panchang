-- ---------------------------------------------------------------------------
-- 062: Strip yoga catalog from saved_charts.chart_data
--
-- saved_charts.chart_data is the same `KundaliData` shape stored in
-- kundali_snapshots.full_kundali — see brihaspati/router/load-subject-
-- kundali.ts (the "saved_charts.chart_data IS the full kundali" comment).
-- Migration 061 stripped kundali_snapshots; this is the same fix for
-- saved_charts so family-member charts don't carry the catalog
-- redundancy (~272 KB per row × pandit-CRM clients).
--
-- Today's state: 85 rows, 82 with NULL chart_data, 3 with the full
-- shape. Each of those 3 averages 287 KB; strip drops them to ~15 KB.
-- Net DB recovery: small now (~800 KB), but every future family-member
-- chart computed via brihaspati/router/load-subject-kundali.ts will
-- ship through the codec.
--
-- Idempotent: skips rows already stripped (no `description` key on
-- the first yoga entry).
-- ---------------------------------------------------------------------------

BEGIN;

WITH stripped AS (
  SELECT id,
    jsonb_set(chart_data, '{evaluatedYogas}',
      COALESCE((SELECT jsonb_agg(jsonb_strip_nulls(jsonb_build_object(
        'id', yoga->'id', 'present', yoga->'present', 'strength', yoga->'strength',
        'involvedPlanets', yoga->'involvedPlanets', 'affectedDomains', yoga->'affectedDomains',
        'cancellationStatus', yoga->'cancellationStatus', 'interactions', yoga->'interactions',
        'patternData', yoga->'patternData'
      ))) FROM jsonb_array_elements(chart_data->'evaluatedYogas') AS yoga), '[]'::jsonb)
    ) AS new_chart_data
  FROM saved_charts
  WHERE chart_data IS NOT NULL
    AND chart_data ? 'evaluatedYogas'
    AND jsonb_typeof(chart_data->'evaluatedYogas') = 'array'
    -- Skip empty arrays — they'd UPDATE to themselves (write amplification
    -- with no payoff). Gemini PR #639 review.
    AND jsonb_array_length(chart_data->'evaluatedYogas') > 0
    AND (chart_data->'evaluatedYogas'->0) ? 'description'
)
UPDATE saved_charts sc SET chart_data = s.new_chart_data FROM stripped s WHERE sc.id = s.id;

ANALYZE saved_charts;

COMMIT;
