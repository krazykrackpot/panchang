/**
 * Mock Provider — for all testing.
 *
 * Returns pre-configured fixture responses. Supports simulating
 * failures, latency, and unavailability for router testing.
 */

import type { LLMProvider, LLMProviderRequest, LLMProviderResponse } from '../types';

export interface MockProviderOptions {
  /** The raw string to return as content. Usually JSON.stringify(LLMOutput). */
  response: string;
  /** Simulate network failure on Nth call (1-indexed). 0 = never fail. */
  failOnCall?: number;
  /** Simulate provider being unavailable. */
  unavailable?: boolean;
  /** Simulate latency (ms). Not actually waited — just recorded. */
  simulatedLatencyMs?: number;
}

export class MockProvider implements LLMProvider {
  name = 'mock';
  private callCount = 0;
  private options: MockProviderOptions;

  /** Track all calls for test assertions. */
  calls: LLMProviderRequest[] = [];

  constructor(options: MockProviderOptions) {
    this.options = options;
  }

  isAvailable(): boolean {
    return !this.options.unavailable;
  }

  async complete(params: LLMProviderRequest): Promise<LLMProviderResponse> {
    this.callCount++;
    this.calls.push(params);

    if (this.options.failOnCall && this.callCount === this.options.failOnCall) {
      throw new Error('[mock] Simulated network failure');
    }

    return {
      content: this.options.response,
      inputTokens: params.system.length + params.user.length,
      outputTokens: this.options.response.length,
    };
  }

  /** Reset call tracking between tests. */
  reset(): void {
    this.callCount = 0;
    this.calls = [];
  }
}
