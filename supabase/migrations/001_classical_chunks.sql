-- ============================================================
-- Classical Jyotish Texts RAG Schema
-- Stores verse-level chunks with pgvector embeddings
-- ============================================================

-- Enable pgvector extension
CREATE EXTENSION IF NOT EXISTS vector;

-- ============================================================
-- Core chunks table
-- ============================================================
CREATE TABLE classical_chunks (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  text_name       TEXT NOT NULL,
  text_full_name  TEXT NOT NULL,
  chapter         INTEGER,
  chapter_title   TEXT,
  verse_start     INTEGER,
  verse_end       INTEGER,

  -- Content
  sanskrit_text   TEXT,
  translation     TEXT NOT NULL,
  commentary      TEXT,

  -- Embedding (1024 dims for Cohere embed-multilingual-v3)
  embedding       vector(1024) NOT NULL,

  -- Metadata tags for filtered retrieval
  topic_tags      TEXT[] NOT NULL DEFAULT '{}',
  graha_tags      TEXT[] DEFAULT '{}',
  bhava_tags      INTEGER[] DEFAULT '{}',
  rashi_tags      TEXT[] DEFAULT '{}',
  yoga_tags       TEXT[] DEFAULT '{}',
  dosha_tags      TEXT[] DEFAULT '{}',
  topic_category  TEXT NOT NULL DEFAULT 'general',

  -- Provenance
  source_file     TEXT,
  embedding_model TEXT NOT NULL DEFAULT 'cohere-embed-multilingual-v3.0',

  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- Indexes
-- ============================================================

-- Vector similarity search (HNSW — works on empty tables, no reindex needed)
CREATE INDEX idx_chunks_embedding
  ON classical_chunks
  USING hnsw (embedding vector_cosine_ops)
  WITH (m = 16, ef_construction = 64);

-- Prevent duplicate ingestion
CREATE UNIQUE INDEX idx_chunks_unique_verse
  ON classical_chunks (text_name, chapter, verse_start, verse_end);

-- Metadata filtering
CREATE INDEX idx_chunks_topic_category ON classical_chunks (topic_category);
CREATE INDEX idx_chunks_text_name ON classical_chunks (text_name);

-- GIN indexes for array tag filtering
CREATE INDEX idx_chunks_graha_tags ON classical_chunks USING GIN (graha_tags);
CREATE INDEX idx_chunks_bhava_tags ON classical_chunks USING GIN (bhava_tags);
CREATE INDEX idx_chunks_rashi_tags ON classical_chunks USING GIN (rashi_tags);
CREATE INDEX idx_chunks_topic_tags ON classical_chunks USING GIN (topic_tags);
CREATE INDEX idx_chunks_yoga_tags ON classical_chunks USING GIN (yoga_tags);
CREATE INDEX idx_chunks_dosha_tags ON classical_chunks USING GIN (dosha_tags);

-- ============================================================
-- Query cache
-- ============================================================
CREATE TABLE rag_query_cache (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  query_hash      TEXT UNIQUE NOT NULL,
  query_context   JSONB NOT NULL,
  retrieved_ids   UUID[] NOT NULL,
  synthesis       JSONB,
  model_version   TEXT,
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  expires_at      TIMESTAMPTZ DEFAULT NOW() + INTERVAL '7 days'
);

CREATE INDEX idx_cache_hash ON rag_query_cache (query_hash);
CREATE INDEX idx_cache_expires ON rag_query_cache (expires_at);

-- ============================================================
-- Ingestion job tracking
-- ============================================================
CREATE TABLE ingestion_jobs (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  text_name        TEXT NOT NULL,
  source_file      TEXT NOT NULL,
  status           TEXT NOT NULL DEFAULT 'pending',
  total_chunks     INTEGER DEFAULT 0,
  processed_chunks INTEGER DEFAULT 0,
  error_message    TEXT,
  started_at       TIMESTAMPTZ,
  completed_at     TIMESTAMPTZ,
  created_at       TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- RPC: Filtered vector similarity search
-- ============================================================
CREATE OR REPLACE FUNCTION match_classical_chunks(
  query_embedding vector(1024),
  match_threshold FLOAT DEFAULT 0.3,
  match_count INT DEFAULT 10,
  filter_topic_category TEXT DEFAULT NULL,
  filter_graha TEXT DEFAULT NULL,
  filter_bhava INTEGER DEFAULT NULL,
  filter_rashi TEXT DEFAULT NULL,
  filter_text_names TEXT[] DEFAULT NULL
)
RETURNS TABLE (
  id UUID,
  text_name TEXT,
  text_full_name TEXT,
  chapter INTEGER,
  chapter_title TEXT,
  verse_start INTEGER,
  verse_end INTEGER,
  sanskrit_text TEXT,
  translation TEXT,
  commentary TEXT,
  topic_tags TEXT[],
  topic_category TEXT,
  similarity FLOAT
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT
    c.id,
    c.text_name,
    c.text_full_name,
    c.chapter,
    c.chapter_title,
    c.verse_start,
    c.verse_end,
    c.sanskrit_text,
    c.translation,
    c.commentary,
    c.topic_tags,
    c.topic_category,
    (1 - (c.embedding <=> query_embedding))::FLOAT AS similarity
  FROM classical_chunks c
  WHERE
    (1 - (c.embedding <=> query_embedding)) > match_threshold
    AND (filter_topic_category IS NULL OR c.topic_category = filter_topic_category)
    AND (filter_graha IS NULL OR filter_graha = ANY(c.graha_tags))
    AND (filter_bhava IS NULL OR filter_bhava = ANY(c.bhava_tags))
    AND (filter_rashi IS NULL OR filter_rashi = ANY(c.rashi_tags))
    AND (filter_text_names IS NULL OR c.text_name = ANY(filter_text_names))
  ORDER BY c.embedding <=> query_embedding
  LIMIT match_count;
END;
$$;
