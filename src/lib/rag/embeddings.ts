/**
 * Configurable Embedding Provider Abstraction
 *
 * Default: Cohere embed-multilingual-v3.0 (best for Sanskrit/Hindi/English)
 * Alternatives: OpenAI text-embedding-3-small, local sentence-transformers
 *
 * Switch via EMBEDDING_PROVIDER env var or createEmbeddingProvider({ provider: '...' })
 */

import type {
  EmbeddingResult,
  EmbeddingProvider,
  EmbeddingProviderType,
  EmbeddingConfig,
} from './types';

// ============================================================
// Cohere (Default)
// ============================================================

export class CohereEmbeddingProvider implements EmbeddingProvider {
  readonly name = 'cohere';
  readonly dimensions: number;
  readonly model: string;
  private apiKey: string;

  constructor(config?: Partial<EmbeddingConfig>) {
    this.apiKey = config?.apiKey || process.env.COHERE_API_KEY?.trim() || '';
    if (!this.apiKey) {
      throw new Error('CohereEmbeddingProvider: No API key. Set COHERE_API_KEY or pass apiKey in config.');
    }
    this.model = config?.model || 'embed-multilingual-v3.0';
    this.dimensions = config?.dimensions || 1024;
  }

  async embed(text: string): Promise<EmbeddingResult> {
    const response = await fetch('https://api.cohere.com/v2/embed', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        texts: [text],
        model: this.model,
        input_type: 'search_query',
        embedding_types: ['float'],
        truncate: 'END',
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      throw new Error(`Cohere embedding failed: ${response.status} ${errText}`);
    }

    const data = await response.json();
    return {
      embedding: data.embeddings.float[0],
      model: this.model,
      dimensions: this.dimensions,
      tokensUsed: data.meta?.billed_units?.input_tokens,
    };
  }

  async embedBatch(texts: string[], batchSize = 96): Promise<EmbeddingResult[]> {
    const results: EmbeddingResult[] = [];

    for (let i = 0; i < texts.length; i += batchSize) {
      const batch = texts.slice(i, i + batchSize);
      const response = await fetch('https://api.cohere.com/v2/embed', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          texts: batch,
          model: this.model,
          input_type: 'search_document',
          embedding_types: ['float'],
          truncate: 'END',
        }),
      });

      if (!response.ok) {
        throw new Error(`Cohere batch embedding failed: ${response.status}`);
      }

      const data = await response.json();
      for (const emb of data.embeddings.float) {
        results.push({
          embedding: emb,
          model: this.model,
          dimensions: this.dimensions,
        });
      }
    }

    return results;
  }
}

// ============================================================
// OpenAI
// ============================================================

export class OpenAIEmbeddingProvider implements EmbeddingProvider {
  readonly name = 'openai';
  readonly dimensions: number;
  readonly model: string;
  private apiKey: string;

  constructor(config?: Partial<EmbeddingConfig>) {
    this.apiKey = config?.apiKey || process.env.OPENAI_API_KEY?.trim() || '';
    if (!this.apiKey) {
      throw new Error('OpenAIEmbeddingProvider: No API key. Set OPENAI_API_KEY or pass apiKey in config.');
    }
    this.model = config?.model || 'text-embedding-3-small';
    this.dimensions = config?.dimensions || 1024;
  }

  async embed(text: string): Promise<EmbeddingResult> {
    const response = await fetch('https://api.openai.com/v1/embeddings', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        input: text,
        model: this.model,
        dimensions: this.dimensions,
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI embedding failed: ${response.status}`);
    }

    const data = await response.json();
    return {
      embedding: data.data[0].embedding,
      model: this.model,
      dimensions: this.dimensions,
      tokensUsed: data.usage?.total_tokens,
    };
  }

  async embedBatch(texts: string[], batchSize = 100): Promise<EmbeddingResult[]> {
    const results: EmbeddingResult[] = [];

    for (let i = 0; i < texts.length; i += batchSize) {
      const batch = texts.slice(i, i + batchSize);
      const response = await fetch('https://api.openai.com/v1/embeddings', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          input: batch,
          model: this.model,
          dimensions: this.dimensions,
        }),
      });

      if (!response.ok) {
        throw new Error(`OpenAI batch embedding failed: ${response.status}`);
      }

      const data = await response.json();
      for (const item of data.data) {
        results.push({
          embedding: item.embedding,
          model: this.model,
          dimensions: this.dimensions,
        });
      }
    }

    return results;
  }
}

// ============================================================
// Local (sentence-transformers sidecar)
// ============================================================

export class LocalEmbeddingProvider implements EmbeddingProvider {
  readonly name = 'local';
  readonly dimensions: number;
  readonly model: string;
  private baseUrl: string;

  constructor(config?: Partial<EmbeddingConfig>) {
    this.baseUrl = config?.baseUrl || process.env.LOCAL_EMBEDDING_URL || 'http://localhost:8080';
    this.model = config?.model || 'all-MiniLM-L6-v2';
    this.dimensions = config?.dimensions || 384;
  }

  async embed(text: string): Promise<EmbeddingResult> {
    const response = await fetch(`${this.baseUrl}/embed`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text, dimensions: this.dimensions }),
    });

    if (!response.ok) {
      throw new Error(`Local embedding failed: ${response.status}`);
    }

    const data = await response.json();
    return {
      embedding: data.embedding,
      model: this.model,
      dimensions: this.dimensions,
    };
  }

  async embedBatch(texts: string[]): Promise<EmbeddingResult[]> {
    const response = await fetch(`${this.baseUrl}/embed-batch`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ texts, dimensions: this.dimensions }),
    });

    if (!response.ok) {
      throw new Error(`Local batch embedding failed: ${response.status}`);
    }

    const data = await response.json();
    return data.embeddings.map((emb: number[]) => ({
      embedding: emb,
      model: this.model,
      dimensions: this.dimensions,
    }));
  }
}

// ============================================================
// Factory
// ============================================================

export function createEmbeddingProvider(config?: EmbeddingConfig): EmbeddingProvider {
  const providerType =
    config?.provider ||
    (process.env.EMBEDDING_PROVIDER as EmbeddingProviderType) ||
    'cohere';

  switch (providerType) {
    case 'openai':
      return new OpenAIEmbeddingProvider(config);
    case 'local':
      return new LocalEmbeddingProvider(config);
    case 'cohere':
    default:
      return new CohereEmbeddingProvider(config);
  }
}
