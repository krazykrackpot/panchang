-- 029_brihaspati_subject_chart.sql
-- Add subject_saved_chart_id to brihaspati_questions so each question
-- can be tied to a specific saved chart (self OR a family member). NULL
-- means "the asker's own chart" (default behaviour, backward compatible
-- with all existing rows).
--
-- Companion to: docs/superpowers/specs/2026-05-21-brihaspati-ai-astrologer-design.md
-- (Family integration, added 2026-05-22 in response to user feedback that
-- "many questions are about family or incomplete without family dynamics".)
--
-- Why FK + ON DELETE SET NULL (not CASCADE):
--   - If the user deletes a saved chart, we want to preserve the historic
--     question rows for the §11 training-data flywheel
--   - SET NULL keeps the row valid while marking the subject as "deleted"
--   - CASCADE would silently delete training-eligible rows

ALTER TABLE public.brihaspati_questions
  ADD COLUMN IF NOT EXISTS subject_saved_chart_id UUID
    REFERENCES public.saved_charts(id) ON DELETE SET NULL;

COMMENT ON COLUMN public.brihaspati_questions.subject_saved_chart_id IS
  'The saved chart this question is about. NULL = asker''s own kundali_snapshots row. References saved_charts.id; ON DELETE SET NULL preserves the question row for training-data flywheel.';

-- Index for any future "what % of questions are about saved charts" query
CREATE INDEX IF NOT EXISTS idx_brihaspati_questions_subject
  ON public.brihaspati_questions (subject_saved_chart_id)
  WHERE subject_saved_chart_id IS NOT NULL;

NOTIFY pgrst, 'reload schema';
