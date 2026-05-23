-- 034 — Server-side welcome-email guard (replaces client `isRecompute` flag)
--
-- The May-20 email-bombardment incident fired the welcome email on every
-- profile POST because the only guard was a client-supplied
-- `body.isRecompute` boolean, which any client that didn't set the flag
-- (Settings page save, OnboardingModal re-submit) would skip. Per audit
-- P0-7 the fix is to gate server-side on whether the welcome email has
-- ever been sent — not on a hint from the client.
--
-- Adds `welcome_email_sent_at` timestamptz to user_profiles. The route
-- handler then sends the email iff this column is NULL, and atomically
-- sets it to NOW() on success. Multiple concurrent profile POSTs are
-- safe — only the first that observes NULL wins the send.

ALTER TABLE public.user_profiles
  ADD COLUMN IF NOT EXISTS welcome_email_sent_at timestamptz;

-- Backfill: every existing user has already onboarded — mark them all as
-- already-sent so the next profile POST doesn't suddenly send a backlog
-- of welcome emails. (NULL means "never sent"; any non-null value means
-- "guard against re-send".)
UPDATE public.user_profiles
SET welcome_email_sent_at = COALESCE(welcome_email_sent_at, created_at, now())
WHERE welcome_email_sent_at IS NULL;
