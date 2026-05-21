/**
 * Structural tests for supabase/migrations/028_brihaspati.sql.
 *
 * We don't spin up Postgres in vitest; instead we assert the migration text
 * contains every contract item the Brihaspati spec and CLAUDE.md require.
 * The real migration applies via `npx supabase db query --linked` and is
 * verified end-to-end in the Phase 10 test plan.
 */
import { describe, it, expect, beforeAll } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

const MIGRATION_PATH = join(
  process.cwd(),
  'supabase/migrations/028_brihaspati.sql',
);

let sql = '';
beforeAll(() => {
  sql = readFileSync(MIGRATION_PATH, 'utf8');
});

// Helpers ────────────────────────────────────────────────────────────────

const requireMatch = (re: RegExp, label: string) => {
  expect(sql.match(re), `migration missing: ${label}`).toBeTruthy();
};

const requireAllMatches = (patterns: { re: RegExp; label: string }[]) => {
  for (const { re, label } of patterns) requireMatch(re, label);
};

// ── 1. Tables exist ─────────────────────────────────────────────────────

describe('028_brihaspati: tables', () => {
  it.each([
    'brihaspati_questions',
    'brihaspati_credits',
    'brihaspati_webhook_events',
    'brihaspati_deletion_ledger',
  ])('creates table public.%s', (table) => {
    requireMatch(
      new RegExp(`CREATE TABLE IF NOT EXISTS public\\.${table}\\b`, 'i'),
      `CREATE TABLE ${table}`,
    );
  });

  it('adds the two Brihaspati columns to user_profiles', () => {
    requireMatch(
      /ALTER TABLE public\.user_profiles[\s\S]*ADD COLUMN IF NOT EXISTS brihaspati_subscription JSONB/i,
      'user_profiles.brihaspati_subscription',
    );
    requireMatch(
      /ADD COLUMN IF NOT EXISTS brihaspati_training_opt_out BOOLEAN NOT NULL DEFAULT FALSE/i,
      'user_profiles.brihaspati_training_opt_out',
    );
  });
});

// ── 2. brihaspati_questions schema contract ─────────────────────────────

describe('028_brihaspati: brihaspati_questions schema', () => {
  it('has primary key UUID with gen_random_uuid default', () => {
    requireMatch(
      /id\s+UUID\s+PRIMARY\s+KEY\s+DEFAULT\s+gen_random_uuid\(\)/i,
      'uuid PK',
    );
  });

  it('references auth.users with ON DELETE CASCADE', () => {
    requireMatch(
      /user_id\s+UUID\s+NOT\s+NULL\s+REFERENCES\s+auth\.users\(id\)\s+ON\s+DELETE\s+CASCADE/i,
      'user_id FK cascade',
    );
  });

  it('declares all spec §11 training-flywheel columns', () => {
    requireAllMatches([
      { re: /\bcontext_json\s+JSONB\b/i, label: 'context_json' },
      { re: /\bengine_version\s+TEXT\b/i, label: 'engine_version' },
      { re: /\bsystem_prompt_version\s+TEXT\b/i, label: 'system_prompt_version' },
      {
        re: /user_rating\s+SMALLINT\s+NOT\s+NULL\s+DEFAULT\s+0\s+CHECK\s*\(\s*user_rating\s+IN\s*\(\s*-1\s*,\s*0\s*,\s*1\s*\)/i,
        label: 'user_rating constrained to -1/0/1',
      },
      { re: /\buser_rating_reason\s+TEXT\b/i, label: 'user_rating_reason' },
      { re: /\btraining_eligible\s+BOOLEAN\b/i, label: 'training_eligible' },
      {
        re: /training_opt_out\s+BOOLEAN\s+NOT\s+NULL\s+DEFAULT\s+FALSE/i,
        label: 'training_opt_out default false',
      },
    ]);
  });

  it('constrains status to the four allowed values', () => {
    requireMatch(
      /status\s+TEXT\s+NOT\s+NULL\s+DEFAULT\s+'pending'\s+CHECK\s*\(\s*status\s+IN\s*\(\s*'pending'\s*,\s*'streaming'\s*,\s*'completed'\s*,\s*'failed'\s*\)\s*\)/i,
      'status CHECK',
    );
  });

  it('constrains locale to the 10 supported codes', () => {
    requireMatch(
      /locale\s+TEXT\s+NOT\s+NULL\s+DEFAULT\s+'en'[\s\S]*?CHECK\s*\(\s*locale\s+IN\s*\([^)]*'en'[^)]*'hi'[^)]*'ta'[^)]*'bn'[^)]*\)/i,
      'locale CHECK includes en/hi/ta/bn',
    );
  });

  it('constrains query_category to the 12 spec categories', () => {
    const categories = [
      'career', 'marriage', 'health', 'finance', 'children', 'education',
      'dasha', 'remedies', 'compatibility', 'timing', 'transit', 'general',
    ];
    for (const c of categories) {
      requireMatch(
        new RegExp(`query_category[\\s\\S]{0,400}'${c}'`, 'i'),
        `query_category includes '${c}'`,
      );
    }
  });

  it('constrains pricing_tier and provider', () => {
    requireMatch(
      /pricing_tier[\s\S]{0,200}'single'[\s\S]{0,80}'pack_5'[\s\S]{0,80}'monthly'[\s\S]{0,80}'annual'/i,
      'pricing_tier CHECK',
    );
    requireMatch(
      /provider[\s\S]{0,200}'razorpay'[\s\S]{0,80}'stripe'[\s\S]{0,80}'credit'[\s\S]{0,80}'subscription'/i,
      'provider CHECK',
    );
  });

  it('has all spec timestamps', () => {
    requireAllMatches([
      { re: /created_at\s+TIMESTAMPTZ\s+NOT\s+NULL\s+DEFAULT\s+NOW\(\)/i, label: 'created_at' },
      { re: /updated_at\s+TIMESTAMPTZ\s+NOT\s+NULL\s+DEFAULT\s+NOW\(\)/i, label: 'updated_at' },
      { re: /completed_at\s+TIMESTAMPTZ/i, label: 'completed_at' },
    ]);
  });
});

// ── 3. Indexes ──────────────────────────────────────────────────────────

describe('028_brihaspati: indexes', () => {
  it('creates the user_id + created_at history index', () => {
    requireMatch(
      /CREATE INDEX IF NOT EXISTS\s+idx_brihaspati_questions_user_created[\s\S]*?\(user_id,\s*created_at\s+DESC\)/i,
      'idx_brihaspati_questions_user_created',
    );
  });

  it('creates the pending/failed status partial index for the cron retry job', () => {
    requireMatch(
      /CREATE INDEX IF NOT EXISTS\s+idx_brihaspati_questions_status_pending_failed[\s\S]*?WHERE\s+status\s+IN\s*\(\s*'pending'\s*,\s*'failed'\s*\)/i,
      'status partial index',
    );
  });

  it('creates the training-eligible partial index', () => {
    requireMatch(
      /CREATE INDEX IF NOT EXISTS\s+idx_brihaspati_questions_training[\s\S]*?WHERE\s+training_eligible\s*=\s*TRUE\s+AND\s+training_opt_out\s*=\s*FALSE/i,
      'training-eligible partial index',
    );
  });

  it('creates the unique partial index for payment idempotency', () => {
    requireMatch(
      /CREATE UNIQUE INDEX IF NOT EXISTS\s+uniq_brihaspati_questions_payment[\s\S]*?\(provider,\s*payment_ref\)[\s\S]*?WHERE\s+payment_ref\s+IS\s+NOT\s+NULL/i,
      'questions payment uniqueness',
    );
  });

  it('creates the credits user_id + expires_at index', () => {
    requireMatch(
      /CREATE INDEX IF NOT EXISTS\s+idx_brihaspati_credits_user_expires[\s\S]*?\(user_id,\s*expires_at\)/i,
      'credits lookup index',
    );
  });
});

// ── 4. Idempotency constraints ──────────────────────────────────────────

describe('028_brihaspati: idempotency', () => {
  it('credits row is unique by (provider, payment_ref)', () => {
    requireMatch(
      /CONSTRAINT\s+uniq_brihaspati_credits_payment\s+UNIQUE\s*\(provider,\s*payment_ref\)/i,
      'credits payment unique',
    );
  });

  it('webhook events are unique by (provider, provider_event_id)', () => {
    requireMatch(
      /CONSTRAINT\s+uniq_brihaspati_webhook_events\s+UNIQUE\s*\(provider,\s*provider_event_id\)/i,
      'webhook events unique',
    );
  });

  it('deletion ledger is unique by user_id_hash', () => {
    requireMatch(
      /CONSTRAINT\s+uniq_brihaspati_deletion_ledger_hash\s+UNIQUE\s*\(user_id_hash\)/i,
      'deletion ledger unique',
    );
  });
});

// ── 5. RLS ──────────────────────────────────────────────────────────────

describe('028_brihaspati: row-level security', () => {
  it.each([
    'brihaspati_questions',
    'brihaspati_credits',
    'brihaspati_webhook_events',
    'brihaspati_deletion_ledger',
  ])('enables RLS on %s', (table) => {
    requireMatch(
      new RegExp(`ALTER TABLE public\\.${table} ENABLE ROW LEVEL SECURITY`, 'i'),
      `RLS on ${table}`,
    );
  });

  it('users can SELECT their own questions only', () => {
    requireMatch(
      /CREATE POLICY\s+"users_select_own_questions"\s+ON\s+public\.brihaspati_questions\s+FOR\s+SELECT\s+USING\s*\(\s*auth\.uid\(\)\s*=\s*user_id\s*\)/i,
      'users_select_own_questions policy',
    );
  });

  it('users can SELECT their own credits only', () => {
    requireMatch(
      /CREATE POLICY\s+"users_select_own_credits"\s+ON\s+public\.brihaspati_credits\s+FOR\s+SELECT\s+USING\s*\(\s*auth\.uid\(\)\s*=\s*user_id\s*\)/i,
      'users_select_own_credits policy',
    );
  });

  it('webhook_events and deletion_ledger have no permissive policy (service-role only)', () => {
    // No CREATE POLICY referencing these tables should grant client-side access.
    const offenders = sql.match(/CREATE POLICY[^;]*ON\s+public\.brihaspati_(webhook_events|deletion_ledger)/gi);
    expect(offenders, 'no client policies should be created on internal tables').toBeNull();
  });
});

// ── 6. Trigger safety (CLAUDE.md universal rule) ────────────────────────

describe('028_brihaspati: trigger safety', () => {
  it('updated_at function uses SECURITY DEFINER + SET search_path = public', () => {
    requireMatch(
      /CREATE OR REPLACE FUNCTION public\.brihaspati_set_updated_at\(\)[\s\S]*?SECURITY DEFINER[\s\S]*?SET\s+search_path\s*=\s*public/i,
      'updated_at function hardening',
    );
  });

  it.each([
    'brihaspati_questions',
    'brihaspati_credits',
    'brihaspati_deletion_ledger',
  ])('attaches BEFORE UPDATE updated_at trigger to %s', (table) => {
    requireMatch(
      new RegExp(
        `CREATE TRIGGER\\s+trg_${table}_updated_at[\\s\\S]*?BEFORE UPDATE ON public\\.${table}[\\s\\S]*?EXECUTE FUNCTION public\\.brihaspati_set_updated_at\\(\\)`,
        'i',
      ),
      `updated_at trigger on ${table}`,
    );
  });

  it('exactly one trigger fires on auth.users — the deletion-ledger one', () => {
    // Split into statements to avoid lazy-regex spanning past semicolons.
    // The DROP TRIGGER ... ON auth.users; line is a separate statement and
    // does not count as creating a trigger.
    const statements = sql.split(';');
    const created = statements.filter(
      (s) => /CREATE TRIGGER/i.test(s) && /ON\s+auth\.users/i.test(s),
    );
    expect(created.length, `expected 1 CREATE TRIGGER on auth.users, found ${created.length}`).toBe(1);
    expect(created[0]).toMatch(/trg_auth_user_brihaspati_log_deletion/i);
  });

  it('deletion-ledger trigger function is hardened per CLAUDE.md auth-trigger rules', () => {
    const fn = sql.match(
      /CREATE OR REPLACE FUNCTION public\.brihaspati_log_user_deletion\(\)[\s\S]*?\$\$[\s\S]*?\$\$/i,
    );
    expect(fn, 'brihaspati_log_user_deletion function').toBeTruthy();
    const body = fn![0];
    // Each of these is non-negotiable per CLAUDE.md.
    expect(body, 'SECURITY DEFINER').toMatch(/SECURITY DEFINER/);
    expect(body, 'SET search_path = public').toMatch(/SET\s+search_path\s*=\s*public/i);
    expect(body, 'EXCEPTION WHEN OTHERS').toMatch(/EXCEPTION\s+WHEN\s+OTHERS/i);
    expect(body, 'ON CONFLICT DO NOTHING (idempotent)').toMatch(/ON\s+CONFLICT[\s\S]*?DO\s+NOTHING/i);
    // Hash, not raw id — GDPR-erasure requirement.
    expect(body, 'sha256 hash of OLD.id').toMatch(/digest\s*\(\s*OLD\.id::text\s*,\s*'sha256'\s*\)/i);
  });

  it('deletion-ledger trigger is BEFORE DELETE (must run before cascade wipes user_id)', () => {
    requireMatch(
      /CREATE TRIGGER\s+trg_auth_user_brihaspati_log_deletion[\s\S]*?BEFORE DELETE ON auth\.users/i,
      'BEFORE DELETE on auth.users',
    );
  });

  it('ensures pgcrypto is available for digest()', () => {
    requireMatch(
      /CREATE EXTENSION IF NOT EXISTS pgcrypto/i,
      'pgcrypto extension',
    );
  });
});

// ── 7. Documentation guarantees ─────────────────────────────────────────

describe('028_brihaspati: documentation', () => {
  it.each([
    ['context_json', /COMMENT ON COLUMN public\.brihaspati_questions\.context_json/i],
    ['engine_version', /COMMENT ON COLUMN public\.brihaspati_questions\.engine_version/i],
    ['training_eligible', /COMMENT ON COLUMN public\.brihaspati_questions\.training_eligible/i],
    ['brihaspati_subscription', /COMMENT ON COLUMN public\.user_profiles\.brihaspati_subscription/i],
    ['brihaspati_training_opt_out', /COMMENT ON COLUMN public\.user_profiles\.brihaspati_training_opt_out/i],
  ])('column %s is documented', (_name, re) => {
    requireMatch(re, `COMMENT on ${_name}`);
  });
});

// ── 8. PostgREST schema reload ──────────────────────────────────────────

describe('028_brihaspati: PostgREST', () => {
  it('ends with NOTIFY pgrst, reload schema', () => {
    requireMatch(
      /NOTIFY\s+pgrst,\s*'reload schema'/i,
      'PostgREST cache notify',
    );
  });
});

// ── 9. Hygiene ──────────────────────────────────────────────────────────

describe('028_brihaspati: hygiene', () => {
  it('never CASCADEs on user_profiles drop (we only add columns)', () => {
    const dangerous = sql.match(/DROP\s+TABLE[\s\S]*?user_profiles/i);
    expect(dangerous, 'migration must not drop user_profiles').toBeNull();
  });

  it('uses TIMESTAMPTZ, never plain TIMESTAMP', () => {
    const plain = sql.match(/\bTIMESTAMP\b(?!TZ)/i);
    expect(plain, 'all timestamps must be TIMESTAMPTZ').toBeNull();
  });

  it('makes every CREATE TABLE re-runnable (IF NOT EXISTS)', () => {
    const tableStmts = sql.match(/CREATE TABLE(?:\s+IF NOT EXISTS)?\s+public\.brihaspati_/gi) ?? [];
    expect(tableStmts.length).toBeGreaterThanOrEqual(4);
    const unsafe = tableStmts.filter((s) => !/IF NOT EXISTS/i.test(s));
    expect(unsafe, 'all Brihaspati tables must be IF NOT EXISTS').toEqual([]);
  });
});
