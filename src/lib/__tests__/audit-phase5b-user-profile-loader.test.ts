/**
 * Audit 2026-06-05 Phase 5b — canonical `user_profiles` loader (#14).
 *
 * Builds `src/lib/user/get-profile.ts` and migrates 7 ad-hoc
 * `supabase.from('user_profiles').select(...)` sites to it:
 *
 *   1. src/app/[locale]/dashboard/clients/layout.tsx     — getAccountType
 *   2. src/app/[locale]/dashboard/settings/layout.tsx    — getAccountType
 *   3. src/app/[locale]/dashboard/calendar/layout.tsx    — getAccountType
 *   4. src/app/[locale]/dashboard/alerts/layout.tsx      — getAccountType
 *   5. src/components/pandit/dashboard/AccountTypeRouter — getAccountType
 *   6. src/app/api/pandit/clients/[id]/invite/route.ts   — getProfile(['display_name'])
 *   7. src/app/[locale]/kundali/Client.tsx               — getProfile(['experience_level'])
 *   8. src/app/[locale]/varshaphal/page.tsx              — getProfile(['default_location'])
 *
 * Sites intentionally NOT migrated in this PR (different surface contracts):
 *
 *   - src/lib/pandit/auth.ts — distinguishes profile load error (500
 *     → 'profile_load_failed') from non-pandit (403 →
 *     'pandit_account_required'). The helper collapses both into
 *     `null`. Keeping the inline query preserves the HTTP-status
 *     contract that downstream clients depend on.
 *   - src/components/pandit/dashboard/PanditDashboardHome.tsx — read
 *     is inside a `Promise.all` of parallel queries; sequentialising
 *     via the helper would lose parallelism.
 *   - src/app/api/pandit/deliverables/.../push/route.ts — reads the
 *     CLIENT's profile (not the requester's); needs RLS-review before
 *     mechanical migration.
 *   - src/app/api/pandit/invitations/[token]/route.ts — uses
 *     service-role client `svc`; trivially migratable but bundled
 *     with the deliverables review.
 *   - 4 settings/page.tsx loaders — multi-field form populator with
 *     bespoke field-by-field defaulting; separate Phase 5b2.
 *   - ~30 remaining read sites — chip away in follow-up PRs.
 */

import { describe, it, expect, vi } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import {
  getProfile,
  getAccountType,
  type UserProfile,
} from '@/lib/user/get-profile';

const repoFile = (p: string) => readFileSync(join(process.cwd(), p), 'utf8');

// ───────────────────────────────────────────────────────────────────────────
// 1 — helper contract
// ───────────────────────────────────────────────────────────────────────────
describe('Audit P5b.1: getProfile helper contract', () => {
  function mockSupabase(response: { data: unknown; error: { message: string } | null }) {
    const maybeSingle = vi.fn().mockResolvedValue(response);
    const eq = vi.fn(() => ({ maybeSingle }));
    const select = vi.fn(() => ({ eq }));
    const from = vi.fn(() => ({ select }));
    // The real client has many fields; for these unit tests we only need .from.
    return { client: { from } as never, from, select, eq, maybeSingle };
  }

  it('passes the joined field list to .select()', async () => {
    const m = mockSupabase({ data: { account_type: 'pandit', display_name: 'A' }, error: null });
    await getProfile(m.client, 'u1', ['account_type', 'display_name'] as const, 'test');
    expect(m.from).toHaveBeenCalledWith('user_profiles');
    expect(m.select).toHaveBeenCalledWith('account_type,display_name');
    expect(m.eq).toHaveBeenCalledWith('id', 'u1');
  });

  it('returns the projection on success', async () => {
    const m = mockSupabase({ data: { display_name: 'Alice' }, error: null });
    const result = await getProfile(m.client, 'u1', ['display_name'] as const, 'test');
    expect(result).toEqual({ display_name: 'Alice' });
  });

  it('returns null when the row is missing (no error, data null)', async () => {
    const m = mockSupabase({ data: null, error: null });
    const result = await getProfile(m.client, 'u1', ['account_type'] as const, 'test');
    expect(result).toBeNull();
  });

  it('returns null AND logs when the query errors (Lesson A)', async () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => undefined);
    const m = mockSupabase({ data: null, error: { message: 'RLS denied' } });
    const result = await getProfile(m.client, 'u1', ['account_type'] as const, 'my-ctx');
    expect(result).toBeNull();
    expect(spy).toHaveBeenCalledWith(
      '[my-ctx] user_profiles load failed:',
      'RLS denied',
    );
    spy.mockRestore();
  });

  it('refuses zero-field projections (defensive — almost always a caller bug)', async () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => undefined);
    const m = mockSupabase({ data: { account_type: 'pandit' }, error: null });
    const result = await getProfile(m.client, 'u1', [] as readonly (keyof UserProfile)[], 'test');
    expect(result).toBeNull();
    expect(m.from).not.toHaveBeenCalled();
    expect(spy).toHaveBeenCalledWith('[test] getProfile called with empty fields list');
    spy.mockRestore();
  });
});

describe('Audit P5b.2: getAccountType convenience wrapper', () => {
  function mockSupabase(response: { data: unknown; error: { message: string } | null }) {
    const maybeSingle = vi.fn().mockResolvedValue(response);
    const eq = vi.fn(() => ({ maybeSingle }));
    const select = vi.fn(() => ({ eq }));
    const from = vi.fn(() => ({ select }));
    return { client: { from } as never, select };
  }

  it("returns 'pandit' when the profile reports pandit", async () => {
    const m = mockSupabase({ data: { account_type: 'pandit' }, error: null });
    expect(await getAccountType(m.client, 'u1', 'test')).toBe('pandit');
    expect(m.select).toHaveBeenCalledWith('account_type');
  });

  it("returns 'seeker' when the profile reports seeker", async () => {
    const m = mockSupabase({ data: { account_type: 'seeker' }, error: null });
    expect(await getAccountType(m.client, 'u1', 'test')).toBe('seeker');
  });

  it('returns null when the profile row is missing', async () => {
    const m = mockSupabase({ data: null, error: null });
    expect(await getAccountType(m.client, 'u1', 'test')).toBeNull();
  });

  it('returns null on error (caller treats null as "not authorised as pandit")', async () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => undefined);
    const m = mockSupabase({ data: null, error: { message: 'timeout' } });
    expect(await getAccountType(m.client, 'u1', 'test')).toBeNull();
    expect(spy).toHaveBeenCalled();
    spy.mockRestore();
  });
});

// ───────────────────────────────────────────────────────────────────────────
// 2 — migration drift guards
// ───────────────────────────────────────────────────────────────────────────
describe('Audit P5b.3: dashboard layout guards use canonical helper', () => {
  const layouts = [
    'src/app/[locale]/dashboard/clients/layout.tsx',
    'src/app/[locale]/dashboard/settings/layout.tsx',
    'src/app/[locale]/dashboard/calendar/layout.tsx',
    'src/app/[locale]/dashboard/alerts/layout.tsx',
  ];

  for (const path of layouts) {
    it(`${path} routes through getAccountType()`, () => {
      const src = repoFile(path);
      expect(src).toMatch(/import\s+\{\s*getAccountType\s*\}\s+from\s+['"]@\/lib\/user\/get-profile['"]/);
      expect(src).toMatch(/getAccountType\(supabase,\s*user\.id/);
      expect(src).not.toMatch(/\.from\(['"]user_profiles['"]\)\s*\.select\(['"]account_type['"]\)/);
    });
  }
});

describe('Audit P5b.4: AccountTypeRouter uses canonical helper', () => {
  it('imports getAccountType + no inline account_type SELECT', () => {
    const src = repoFile('src/components/pandit/dashboard/AccountTypeRouter.tsx');
    expect(src).toMatch(/getAccountType/);
    expect(src).not.toMatch(/\.from\(['"]user_profiles['"]\)/);
  });
});

describe('Audit P5b.5: invite route uses canonical helper for display_name', () => {
  it('pandit invite resolver routes through getProfile', () => {
    const src = repoFile('src/app/api/pandit/clients/[id]/invite/route.ts');
    expect(src).toMatch(/getProfile\(supabase,\s*userId,\s*\[['"]display_name['"]\]/);
    expect(src).not.toMatch(/\.from\(['"]user_profiles['"]\)\s*\.select\(['"]display_name['"]\)/);
  });
});

describe('Audit P5b.6: kundali Client uses canonical helper for experience_level', () => {
  it('kundali Client.tsx routes through getProfile', () => {
    const src = repoFile('src/app/[locale]/kundali/Client.tsx');
    expect(src).toMatch(/getProfile\(supabase,\s*user\.id,\s*\[['"]experience_level['"]\]/);
    expect(src).not.toMatch(/\.from\(['"]user_profiles['"]\)\.select\(['"]experience_level['"]\)/);
  });
});

describe('Audit P5b.7: varshaphal page uses canonical helper for default_location', () => {
  const src = repoFile('src/app/[locale]/varshaphal/page.tsx');

  it('varshaphal page.tsx routes through getProfile', () => {
    expect(src).toMatch(/getProfile\(supabase,\s*user\.id,\s*\[['"]default_location['"]\]/);
    expect(src).not.toMatch(/supabase\.from\(['"]user_profiles['"]\)\s*\.select\(['"]default_location['"]\)/);
  });

  it('object-shape-guards the parsed default_location (Gemini P5b)', () => {
    // JSON.parse('null') returns null without throwing; JSON.parse('42')
    // returns a number; both would crash on `loc.birth_date`. Guard
    // asserts `typeof parsed === 'object' && !Array.isArray(parsed)`
    // before the field reads.
    expect(src).toMatch(/parsed && typeof parsed === ['"]object['"] && !Array\.isArray\(parsed\)/);
  });
});

// ───────────────────────────────────────────────────────────────────────────
// 3 — sites intentionally still inline (document the why)
// ───────────────────────────────────────────────────────────────────────────
describe('Audit P5b.8: documented exclusions retain inline reads', () => {
  it('lib/pandit/auth.ts keeps inline query (needs 500 vs 403 distinction)', () => {
    const src = repoFile('src/lib/pandit/auth.ts');
    // Still uses inline SELECT — intentional.
    expect(src).toMatch(/\.from\(['"]user_profiles['"]\)\s*\.select\(['"]account_type['"]\)/);
    // AND distinguishes the two error paths.
    expect(src).toMatch(/profile_load_failed/);
    expect(src).toMatch(/pandit_account_required/);
  });
});
