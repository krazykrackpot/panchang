-- 031_unique_self_saved_chart.sql
-- One self chart per user — enforced at the database level.
--
-- The "Save Chart" button on /kundali previously INSERTed a new row every time
-- the user saved (or edited) their own chart with a different birth date/time,
-- leaving multiple relationship='self' rows. Brihaspati's "answer about MY
-- chart" routing then had no canonical self chart to pick — meaningless
-- responses or wrong-chart answers.
--
-- Two parts:
--   1. Safety dedupe — keep one self row per user, preferring is_primary=true,
--      then most recent. Drops the rest before the unique index would reject
--      them.
--   2. UNIQUE partial index on (user_id) WHERE relationship='self'. Future
--      duplicate inserts fail with 23505. The application save path now does
--      UPDATE-if-exists / INSERT-otherwise.

WITH ranked AS (
  SELECT id, user_id,
    ROW_NUMBER() OVER (
      PARTITION BY user_id
      ORDER BY is_primary DESC NULLS LAST, created_at DESC
    ) AS rn
  FROM public.saved_charts
  WHERE relationship = 'self'
)
DELETE FROM public.saved_charts
WHERE id IN (SELECT id FROM ranked WHERE rn > 1);

CREATE UNIQUE INDEX IF NOT EXISTS saved_charts_user_id_self_unique
  ON public.saved_charts (user_id)
  WHERE relationship = 'self';
