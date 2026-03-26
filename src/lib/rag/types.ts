/**
 * Shared types for the Classical Jyotish Texts RAG system.
 */

// ============================================================
// Embedding Types
// ============================================================

export interface EmbeddingResult {
  embedding: number[];
  model: string;
  dimensions: number;
  tokensUsed?: number;
}

export interface EmbeddingProvider {
  readonly name: string;
  readonly dimensions: number;
  readonly model: string;
  embed(text: string): Promise<EmbeddingResult>;
  embedBatch(texts: string[], batchSize?: number): Promise<EmbeddingResult[]>;
}

export type EmbeddingProviderType = 'cohere' | 'openai' | 'local';

export interface EmbeddingConfig {
  provider: EmbeddingProviderType;
  apiKey?: string;
  model?: string;
  dimensions?: number;
  baseUrl?: string;
}

// ============================================================
// Retrieval Types
// ============================================================

export interface ClassicalReference {
  id: string;
  textName: string;
  textFullName: string;
  chapter: number | null;
  chapterTitle: string | null;
  verseStart: number | null;
  verseEnd: number | null;
  sanskritText: string | null;
  translation: string;
  commentary: string | null;
  topicTags: string[];
  topicCategory: string;
  similarity: number;
}

export interface RetrievalQuery {
  naturalLanguageQuery: string;
  topicCategory?: string;
  grahaTags?: string[];
  bhavaTags?: number[];
  rashiTags?: string[];
  yogaTags?: string[];
  doshaTags?: string[];
  textNames?: string[];
  maxResults?: number;
  threshold?: number;
}

export interface RetrievalResult {
  references: ClassicalReference[];
  query: RetrievalQuery;
  cached: boolean;
}

// ============================================================
// Synthesis Types
// ============================================================

export interface SynthesizedCitation {
  textName: string;
  textFullName: string;
  chapter: number | null;
  verseRange: string;
  sanskritExcerpt: string | null;
  translationExcerpt: string;
  relevanceNote: string;
}

export interface ClassicalInsight {
  summary: string;
  references: SynthesizedCitation[];
  confidence: 'high' | 'medium' | 'low';
}

// ============================================================
// Ingestion Types
// ============================================================

export interface RawChunk {
  chapterNumber: number;
  chapterTitle: string;
  verseStart: number;
  verseEnd: number;
  sanskritText: string;
  translation: string;
  commentary: string;
}

export type TopicCategory =
  | 'graha-in-bhava'
  | 'graha-in-rashi'
  | 'yoga'
  | 'dosha'
  | 'dasha'
  | 'remedy'
  | 'bhava-analysis'
  | 'dignity'
  | 'aspect'
  | 'nakshatra'
  | 'general';

export interface TaggedChunk extends RawChunk {
  topicCategory: TopicCategory;
  topicTags: string[];
  grahaTags: string[];
  bhavaTags: number[];
  rashiTags: string[];
  yogaTags: string[];
  doshaTags: string[];
}

export interface TextParser {
  readonly textName: string;
  readonly textFullName: string;
  parse(content: string): RawChunk[];
}
