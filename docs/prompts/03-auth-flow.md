# 03 — Auth flow

Use this when wiring authentication. Covers signup, signin, OAuth, session
restore, RLS integration, and the edge cases that always bite.

---

I need to wire the auth flow for `<PROJECT NAME>`. Tech: `<Supabase Auth /
Clerk / NextAuth / Auth0>` + `<Next.js App Router>`. Users: `<who signs up
— consumers, teams, both>`. Primary methods: `<Email+password, Google OAuth,
magic link, ...>`.

Goal: signup → profile row created → RLS lets the user read their own data
→ session survives refresh and locale switches.

## Hard requirements

1. **Single source of truth for the auth client.** ONE supabase browser
   client (cached in a module singleton), ONE supabase server client (per
   request, with service-role key). Never create a new one per component.

2. **Session restore always terminates.** The auth store has an
   `initialized: boolean` flag that flips to true once `getSession()` has
   completed, regardless of success. Pages gated on auth wait for
   `initialized === true` before deciding whether to show sign-in vs
   content. No route may spin forever during auth restore.

3. **OAuth hash handling.** After Google OAuth, the token comes back as
   `#access_token=...` in the URL. The client must detect this, exchange
   it, AND clean up the URL (`window.history.replaceState`) so the user
   doesn't see token fragments.

4. **Existing-account detection on signup.** Supabase returns `user.identities = []`
   when a signup collides with an existing email. Treat this as "account
   already exists, go sign in" — never show a generic success toast.

5. **Profile row auto-created via trigger.** `handle_new_user()` trigger on
   `auth.users` INSERT. Must use `SECURITY DEFINER`, `SET search_path = public`,
   `ON CONFLICT ... DO NOTHING` for idempotency, and
   `EXCEPTION WHEN OTHERS THEN RETURN NEW` so trigger bugs never block
   signup.

6. **RLS for every user-owned table.** Policy: `auth.uid() = user_id`. Test
   the policy with a real anon-key client before shipping — "it works with
   service role" is not a test.

7. **API routes authenticate via `Authorization: Bearer <token>`.** Route
   handlers pull the access token from the header, verify against
   `supabase.auth.getUser(token)`, and reject with 401 if missing/invalid.
   Never trust client-provided user IDs.

8. **Environment variables:** `.trim()` every env var read in a route
   handler — Vercel env values sometimes have trailing newlines that break
   string comparison.

9. **Signout clears local state.** Zustand store must reset user/session AND
   any cached data (charts, profile, etc.) on sign-out so the next user
   doesn't see stale data.

10. **Email confirmation** — required on signup. SMTP handled by `<Resend
    via Supabase SMTP / SendGrid / AWS SES>`. Test the confirmation link
    end-to-end on localhost AND production — redirect URLs differ.

## Error paths to handle (non-exhaustive)

- Network error during signup → show retry UI, don't leave spinner
- Email collision → "account exists, sign in instead"
- OAuth cancel → return to sign-in page with no error banner
- Expired session → silent refresh via `onAuthStateChange`; if refresh fails,
  redirect to sign-in with return-to URL preserved
- Service-role key missing in an API route → 500 with a CLEAR error message,
  not a silent failure
- RLS policy violation → Supabase returns `error` with code `42501`. Treat
  as user-facing "you don't have permission" (not a crash)

## Give me back

1. **Architecture diagram** (ASCII or bullet tree) showing: client auth
   store → browser client → Supabase, server-component flow, API route flow.

2. **File-by-file plan** — list every file that needs to be created/edited
   with a 1-line purpose.

3. **`handle_new_user` migration** with all safety wrappers.

4. **Client auth store** (Zustand) with `user`, `session`, `initialized`,
   `initialize()`, `signUp`, `signIn`, `signInWithGoogle`, `signOut`,
   `resetPassword` — and explicit error types, not `unknown`.

5. **API-route auth helper** that reads the Bearer token, verifies, and
   returns `{ user, supabase }` or a 401 response.

6. **Test plan** — at minimum:
   - Signup with new email → profile row created, session set
   - Signup with existing email → "account exists" error
   - Signin with wrong password → error shown, loading=false
   - Google OAuth round-trip → URL cleaned up, user set, navigated home
   - Visit auth-gated page unauthenticated → redirected to sign-in, not spinner-forever
   - Session refresh → silent, no user-visible flash
   - Signout → store cleared, redirected home
   - RLS: user A can't read user B's rows via anon key

## What NOT to do

- Don't store JWT tokens in localStorage yourself — let the Supabase client
  handle it (`persistSession: true, storageKey: '<app>-auth'`).
- Don't hard-redirect on auth state change inside components. Use the store
  + router, so the redirect happens once, not per-component-mount.
- Don't swallow `onAuthStateChange` errors. Log and surface.
- Don't couple the auth store to any specific page's UI state (e.g., modal
  open/closed). Auth is a global concern; UI state is local.

Propose the plan, wait for my sanity-check, then implement.
