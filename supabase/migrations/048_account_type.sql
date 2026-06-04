-- 048_account_type.sql
-- Pandit CRM P1 — add account_type column on user_profiles.
--
-- account_type distinguishes the workspace identity (what dashboard the
-- user sees) from experience_level which encodes skill depth (what depth
-- of content is rendered). They are orthogonal:
--
--   - account_type='seeker' + experience_level='advanced' = a skilled
--     consumer who reads charts (existing acharya persona mode).
--   - account_type='pandit'  + experience_level='beginner' = a new pandit
--     just starting their practice.
--   - account_type='pandit'  + experience_level='advanced' = the
--     prototypical pro user.
--
-- Default 'seeker' keeps every existing account on the current
-- dashboard. Users opt into 'pandit' via the onboarding modal or
-- Settings. A Pandit can revert to 'seeker' losslessly — their
-- pandit_clients data persists (just hidden until they flip back).
--
-- Spec: docs/specs/2026-06-04-pandit-crm.md §2 + §4.

ALTER TABLE public.user_profiles
  ADD COLUMN IF NOT EXISTS account_type TEXT NOT NULL DEFAULT 'seeker'
    CHECK (account_type IN ('seeker', 'pandit'));

COMMENT ON COLUMN public.user_profiles.account_type IS
  'Workspace identity. "seeker" shows the consumer dashboard at /dashboard. "pandit" shows the Pandit CRM dashboard. Independent of experience_level. Pandit CRM P1.';

-- Index because we route on account_type at every /dashboard hit
CREATE INDEX IF NOT EXISTS idx_user_profiles_account_type
  ON public.user_profiles (account_type)
  WHERE account_type = 'pandit';
-- Partial index — most users are seekers, no point indexing the default
