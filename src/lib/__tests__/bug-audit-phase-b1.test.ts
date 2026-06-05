/**
 * Bug audit Phase B1 — MEDIUM bundle (#B1 + #B3).
 *
 * Source-shape drift guards for two fixes:
 *   - B1: matching/Client.tsx surfaces matchError when BOTH partner
 *     kundali fetches return null (previously rendered a stuck blank UI).
 *   - B3: tippanni-llm comparison-mode switched from Promise.all to
 *     allSettled so one model's failure doesn't kill the other.
 *
 * B2 (vrat-reminder TOCTOU) and B4 (email-alerts crash orphan) are
 * documented as known limitations in
 * docs/tech-debt/bug-audit-2026-06-05.md (one is LOW after re-analysis,
 * the other needs schema change).
 */

import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

const repoFile = (p: string) => readFileSync(join(process.cwd(), p), 'utf8');

describe('Bug audit B1: matching/Client.tsx surfaces both-null kundali failure', () => {
  const src = repoFile('src/app/[locale]/matching/Client.tsx');

  it('Promise.all .then branch sets matchError when both null', () => {
    expect(src).toMatch(/if \(!bk && !gk\) setMatchError\(connErr\)/);
  });

  it('Promise.all .catch branch also sets matchError', () => {
    expect(src).toMatch(/\.catch\(\(err\) => \{[\s\S]*?setMatchError\(connErr\)/);
  });

  it('connErr is computed once and reused (no string duplication)', () => {
    // Three occurrences of the same translated message would be a smell.
    // Now the value is bound once and reused in both branches.
    const branchHits = (src.match(/setMatchError\(connErr\)/g) ?? []).length;
    expect(branchHits).toBeGreaterThanOrEqual(2);
  });
});

describe('Bug audit B3: tippanni-llm compare uses Promise.allSettled', () => {
  const src = repoFile('src/app/api/tippanni-llm/route.ts');

  it('comparison mode uses allSettled, not Promise.all', () => {
    expect(src).toMatch(/await Promise\.allSettled\(\[\s*generateLLMSynthesis[\s\S]*?model: ['"]sonnet['"]/);
    // Confirm the destructured names are the Settled wrappers (not raw results).
    expect(src).toMatch(/\[sonnetSettled, opusSettled\] = await Promise\.allSettled/);
  });

  it('rejection paths return a structured { error } slot', () => {
    expect(src).toMatch(/sonnetSettled\.status === ['"]fulfilled['"]/);
    expect(src).toMatch(/opusSettled\.status === ['"]fulfilled['"]/);
    expect(src).toMatch(/errorMessageOf\(sonnetSettled\)/);
    expect(src).toMatch(/errorMessageOf\(opusSettled\)/);
  });

  it('rejections are logged with model-specific tags', () => {
    expect(src).toMatch(/\[tippanni-llm\] compare: sonnet synthesis rejected/);
    expect(src).toMatch(/\[tippanni-llm] compare: opus synthesis rejected/);
  });

  // Anti-regression: ensure the destructive [sonnetResult, opusResult]
  // Promise.all pattern doesn't sneak back in.
  it('no Promise.all destructure of {Result} pairs remains', () => {
    expect(src).not.toMatch(/const \[sonnetResult, opusResult\] = await Promise\.all/);
  });
});
