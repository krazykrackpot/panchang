-- 033_brihaspati_public_share.sql
--
-- Adds is_public_share to brihaspati_questions for the "share link" UX.
--
-- Asker opts in by clicking Copy / WhatsApp / native share — the share UI
-- POSTs /api/brihaspati/share/enable which flips this flag and returns a
-- URL like https://dekhopanchang.com/<locale>/brihaspati/answer/<id>. Any
-- visitor with that URL can read the question + answer (no auth).
--
-- Default is FALSE: an answer is private until the asker explicitly shares.
-- Once flipped TRUE we don't auto-revert; the asker can revoke via a
-- future settings UI (not in this migration).
--
-- We deliberately do NOT change RLS. The public GET endpoint reads via
-- the service role and gates on is_public_share=true server-side. This
-- avoids opening a public SELECT policy on the table (the row carries
-- the user's prompt + LLM reasoning + model info — only `question` and
-- `answer` should leak to anon).

alter table public.brihaspati_questions
  add column if not exists is_public_share boolean not null default false;

-- No index — the lookup is by primary key (id), the flag is just a
-- per-row gate. is_public_share is a small boolean column that won't
-- bloat the table.

comment on column public.brihaspati_questions.is_public_share is
  'When true, the public GET /api/brihaspati/share/<id> endpoint returns this row''s question + answer to unauthenticated visitors. Asker opts in via the share buttons in the panel.';
