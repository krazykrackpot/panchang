export { createEmbeddingProvider } from './embeddings';
export { getSupabaseClient, isSupabaseConfigured } from './supabase';
export {
  ClassicalTextRetriever,
  buildPlanetPlacementQuery,
  buildYogaQuery,
  buildDoshaQuery,
  buildDashaQuery,
  buildRemedyQuery,
} from './retriever';
export { ClassicalSynthesizer } from './synthesizer';
export type {
  EmbeddingResult,
  EmbeddingProvider,
  EmbeddingProviderType,
  EmbeddingConfig,
  ClassicalReference,
  RetrievalQuery,
  RetrievalResult,
  ClassicalInsight,
  SynthesizedCitation,
  RawChunk,
  TaggedChunk,
  TopicCategory,
  TextParser,
} from './types';
