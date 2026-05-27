-- 044_classical_chunks_rls.sql
--
-- Add Row Level Security to the three RAG tables that 001_classical_chunks.sql
-- created without it: classical_chunks, ingestion_jobs, rag_query_cache.
--
-- Deep-audit found these tables exposed to anon role with no policies,
-- meaning a leak of NEXT_PUBLIC_SUPABASE_ANON_KEY would let a reader
-- pull raw shastra excerpts + ingestion-job state + query-cache rows
-- (which include the user's question text). All three are server-only
-- in practice — the API routes that touch them use SERVICE_ROLE_KEY —
-- so blocking the anon role costs nothing.
--
-- Defense in depth, per the rest of the user-data tables which all
-- have RLS on by default.

ALTER TABLE classical_chunks ENABLE ROW LEVEL SECURITY;
ALTER TABLE ingestion_jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE rag_query_cache ENABLE ROW LEVEL SECURITY;

-- Service role bypasses RLS automatically, so the server-side API
-- routes that read/write these tables (e.g. /api/tippanni-llm,
-- /api/domain-pandit, ingestion crons) keep working unchanged.
--
-- The policies below are NO-OP for service_role and DENY for anon /
-- authenticated. Adding a positive "service role manages all" policy
-- makes the intent explicit for anyone reading the schema later.

CREATE POLICY "Service role manages classical_chunks"
  ON classical_chunks
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Service role manages ingestion_jobs"
  ON ingestion_jobs
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Service role manages rag_query_cache"
  ON rag_query_cache
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);
