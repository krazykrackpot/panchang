-- 030_user_progress_and_badges.sql
-- Gamification: Sadhaka Path levels + badges.
-- Idempotent per project convention (see 027_user_profiles_node_type.sql).

CREATE TABLE IF NOT EXISTS public.user_progress (
  user_id              uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  current_level        smallint NOT NULL DEFAULT 1 CHECK (current_level BETWEEN 1 AND 7),
  level_unlocked_at    jsonb NOT NULL DEFAULT '{}'::jsonb,
  streak_days          integer NOT NULL DEFAULT 0 CHECK (streak_days >= 0),
  streak_last_visit    date,
  streak_freeze_used_at date,
  tools_used           text[] NOT NULL DEFAULT '{}',
  modules_done         integer NOT NULL DEFAULT 0 CHECK (modules_done >= 0),
  charts_saved         integer NOT NULL DEFAULT 0 CHECK (charts_saved >= 0),
  referrals_count      integer NOT NULL DEFAULT 0 CHECK (referrals_count >= 0),
  updated_at           timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.user_progress ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "own row read" ON public.user_progress;
CREATE POLICY "own row read"
  ON public.user_progress FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- service_role bypasses RLS — used by awardProgress server-side.

CREATE TABLE IF NOT EXISTS public.user_badges (
  user_id    uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  badge_slug text NOT NULL,
  earned_at  timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id, badge_slug)
);

CREATE INDEX IF NOT EXISTS idx_user_badges_user_id ON public.user_badges (user_id);

ALTER TABLE public.user_badges ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "own row read" ON public.user_badges;
CREATE POLICY "own row read"
  ON public.user_badges FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Auto-refresh updated_at on any UPDATE to user_progress.
-- Reuses the existing brihaspati_set_updated_at() function from migration 028
-- (function is generic — name predates this use; renaming would require updating
-- the brihaspati table trigger too, deferred).
DROP TRIGGER IF EXISTS trg_user_progress_updated_at ON public.user_progress;
CREATE TRIGGER trg_user_progress_updated_at
  BEFORE UPDATE ON public.user_progress
  FOR EACH ROW EXECUTE FUNCTION public.brihaspati_set_updated_at();

NOTIFY pgrst, 'reload schema';
