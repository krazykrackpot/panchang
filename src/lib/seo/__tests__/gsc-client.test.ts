import { describe, it, expect, beforeEach } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

// Source-level invariants — the gsc-client module talks to a live
// Google endpoint, so we don't unit-test the network path. We DO
// assert the auth-flow selection logic at the source level so a
// refactor that accidentally drops the service-account path or the
// legacy fallback fails CI immediately.

const SRC = readFileSync(
  join(process.cwd(), 'src/lib/seo/gsc-client.ts'),
  'utf8',
);

describe('gsc-client — auth env wiring', () => {
  it('imports JWT from google-auth-library (service-account path)', () => {
    expect(SRC).toMatch(/import\s+\{\s*JWT\s*\}\s+from\s+['"]google-auth-library['"]/);
  });

  it('reads GOOGLE_SERVICE_ACCOUNT_EMAIL', () => {
    expect(SRC).toContain('GOOGLE_SERVICE_ACCOUNT_EMAIL');
  });

  it('reads GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY', () => {
    expect(SRC).toContain('GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY');
  });

  it('replaces literal \\n escapes in the private key (Vercel env quirk)', () => {
    expect(SRC).toMatch(/replace\(\s*\/\\\\n\/g\s*,\s*['"]\\n['"]\s*\)/);
  });

  it('still supports the legacy GSC_REFRESH_TOKEN fallback for the migration window', () => {
    expect(SRC).toContain('GSC_REFRESH_TOKEN');
    expect(SRC).toContain('GOOGLE_OAUTH_CLIENT_ID');
    expect(SRC).toContain('GOOGLE_OAUTH_CLIENT_SECRET');
  });

  it('uses the read-only GSC scope', () => {
    expect(SRC).toContain('https://www.googleapis.com/auth/webmasters.readonly');
  });

  it('prefers the service-account path when both env sets are present', () => {
    // Heuristic: the SA-env check must appear in source order before
    // the OAuth refresh-token check.
    const saIdx = SRC.indexOf('GOOGLE_SERVICE_ACCOUNT_EMAIL');
    const oauthIdx = SRC.indexOf('GSC_REFRESH_TOKEN');
    expect(saIdx).toBeGreaterThan(0);
    expect(oauthIdx).toBeGreaterThan(0);
    expect(saIdx).toBeLessThan(oauthIdx);
  });

  it('logs a deprecation warning on the legacy path', () => {
    expect(SRC).toMatch(/console\.warn[\s\S]*legacy OAuth/);
  });

  it('throws with both env-var sets in the error message when neither is set', () => {
    expect(SRC).toMatch(/no auth env/);
    expect(SRC).toMatch(/GOOGLE_SERVICE_ACCOUNT_EMAIL[\s\S]*GSC_REFRESH_TOKEN/);
  });
});
