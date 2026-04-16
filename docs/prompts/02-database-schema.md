# 02 — Database schema design

Use this after architecture is settled and before writing any migrations.
Postgres-flavored but the principles apply to any relational DB.

---

I need to design the database schema for `<PROJECT NAME>`. Here's what the
app does: `<2–3 SENTENCE RECAP>`. Full product spec in `docs/PRODUCT-SPEC.md`.

I want schema + migrations + RLS, not code yet.

## Entities I've identified

1. `<entity 1>` — `<what it represents, key fields>`
2. `<entity 2>` — `<...>`
3. `<entity 3>` — `<...>`

Challenge this list. What am I missing? What should be collapsed or split?

## Hard requirements

- **Every user-owned table has RLS enabled** with policies that restrict
  reads/writes to `auth.uid() = user_id` (or whatever the owning column is).
  Service-role key bypasses for admin/cron — never anon.
- **Every mutation trigger on `auth.users` uses `SECURITY DEFINER` +
  `SET search_path = public` + `EXCEPTION WHEN OTHERS THEN RETURN NEW`.**
  Never block auth. Verify signup survives after every trigger change.
- **Every INSERT trigger uses `ON CONFLICT ... DO NOTHING`** for idempotency.
- **Every table has `id UUID PRIMARY KEY DEFAULT gen_random_uuid()`,
  `created_at TIMESTAMPTZ DEFAULT NOW()`, and `updated_at TIMESTAMPTZ`
  where the row is mutable.**
- **Natural-key uniqueness** for every table where a user write could be
  replayed (save, upsert, webhook). Add a UNIQUE index on the natural key
  OR a unique partial index where applicable. Idempotency is not optional.
- **Timestamps are TIMESTAMPTZ.** Never TIMESTAMP. Always store UTC.
- **Timezones are TEXT** (IANA names like `Europe/Zurich`), never offset
  strings like `+01:00` that break at DST boundaries.
- **JSONB columns** — use them where shape is genuinely fluid, but document
  the expected shape in a comment on the column. Don't use JSONB as a
  dumping ground.
- **Indexes** — at minimum, one on `user_id` for every user-owned table,
  one partial index on hot-path predicates (e.g., `is_primary = true`).

## Give me back

1. **ER diagram in ASCII** — tables, columns, foreign keys, key indexes.
2. **Migration file #1** — creates every table + RLS + policies + triggers
   in dependency order. Follow the project's migration numbering convention
   (`001_init.sql`, etc.).
3. **For each table**, a 2-line comment above `CREATE TABLE` explaining what
   it represents and the natural key for dedupe.
4. **For each RLS policy**, a comment naming the threat it mitigates
   ("prevents users from reading other users' rows").
5. **A test plan:** list of 8–10 queries that should succeed and 4–5 that
   should fail (policy violations), so we can write integration tests
   against the DB directly.
6. **Migration safety checklist** — what to verify after applying:
   - `curl -X POST /auth/v1/signup` still works
   - Service-role key can still read/write everything
   - Anon role cannot read user-owned tables
   - Each unique index actually rejects duplicates

## What NOT to do

- Don't add columns "in case we need them later." YAGNI.
- Don't denormalize on day 1. Start normalized; denormalize when a real query
  requires it and we've measured the cost.
- Don't use `CASCADE` on delete unless explicitly required — prefer
  `ON DELETE RESTRICT` and deal with cleanup explicitly.
- Don't design around a specific ORM. Raw SQL is the source of truth.

Propose the schema, wait for my feedback, iterate. Don't write application
code until the schema is frozen.
