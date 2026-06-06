-- 060 — nps_responses: capture in-email NPS clicks
--
-- The NPS feedback email used to embed `mailto:namaste@dekhopanchang.com`
-- links per score (0..10). Friction was too high — recipients had to
-- compose an email to register a score, so almost none did. 87 NPS emails
-- went out between 2026-04-02 and 2026-06-05 with zero replies landing
-- in the operator's inbox.
--
-- This migration backs a click-to-record flow: each score button in the
-- email becomes a signed HTTPS link to `/api/feedback/nps?score=N&token=T`.
-- The endpoint upserts a row here and notifies the operator. A reason
-- field is left nullable so the user can come back via the existing
-- mailto follow-up CTA and add prose without a duplicate row.
--
-- Upsert semantics: a respondent who reconsiders and clicks a different
-- score should replace their previous score, not append. Constrain on
-- (user_id, source) so each source can land at most one row per user.
--
-- RLS: users read their own. service_role does the inserts via the route
-- handler (which authenticates the user via a signed token, not via
-- supabase auth — so we deliberately don't grant insert to anon/auth
-- roles).

CREATE TABLE IF NOT EXISTS public.nps_responses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  score smallint NOT NULL CHECK (score BETWEEN 0 AND 10),
  reason text,
  source text NOT NULL DEFAULT 'nps_email',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT nps_responses_user_source_unique UNIQUE (user_id, source)
);

CREATE INDEX IF NOT EXISTS nps_responses_user_id_idx ON public.nps_responses (user_id);
CREATE INDEX IF NOT EXISTS nps_responses_created_at_idx ON public.nps_responses (created_at DESC);

-- updated_at maintenance — clicks-to-change-score path uses upsert; the
-- trigger guarantees updated_at moves forward even if a client omits it.
CREATE OR REPLACE FUNCTION public.nps_responses_set_updated_at()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at := now();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS nps_responses_updated_at_trg ON public.nps_responses;
CREATE TRIGGER nps_responses_updated_at_trg
  BEFORE UPDATE ON public.nps_responses
  FOR EACH ROW
  EXECUTE FUNCTION public.nps_responses_set_updated_at();

ALTER TABLE public.nps_responses ENABLE ROW LEVEL SECURITY;

-- Users may read their own row (useful for any future "what score did I
-- give you?" UI; harmless if unused).
DROP POLICY IF EXISTS nps_responses_self_read ON public.nps_responses;
CREATE POLICY nps_responses_self_read ON public.nps_responses
  FOR SELECT
  USING (auth.uid() = user_id);

-- No INSERT/UPDATE policy for non-service-role — the API route runs as
-- service_role after verifying the HMAC token, so we route all writes
-- through there.

-- Grant: service_role can do everything (default Supabase behaviour
-- already covers this, but explicit makes the intent clear).
GRANT ALL ON public.nps_responses TO service_role;
GRANT SELECT ON public.nps_responses TO authenticated;
