# Supabase email templates

Templates in this directory are the source of truth for our Supabase
auth emails. They are pasted **manually** into the Supabase Dashboard —
we don't run a Send Email Hook (yet). See "Follow-up" at the bottom.

## Templates

| File | Supabase dashboard slot | Purpose |
|---|---|---|
| `confirm-signup.html` | Authentication → Email Templates → **Confirm signup** | Warmer replacement for Supabase's default "Confirm your mail: {link}" template. |

## Paste procedure

1. Open the Supabase dashboard for the production project.
2. Navigate to **Authentication → Email Templates**.
3. Select the target template (e.g., "Confirm signup").
4. Set the **Subject line** exactly as noted in the template file's
   header comment.
5. Copy the template file contents (everything after the `{{/* … */}}`
   comment block; the comment is documentation, not part of the
   rendered email) into the **Message (HTML)** editor.
6. Click **Save**.

## Verifying

- Trigger a signup with a throwaway email (Gmail alias or `+tag`).
- Wait ≤30s for delivery.
- Inspect the received email in Gmail Web:
  - Subject line matches
  - Preview text ("One click and your personalized kundali…") shows
    in the inbox line
  - Landed in **Primary** (not Promotions / Spam)
- Click the CTA — should redirect to the site URL configured on the
  Supabase project and confirm the user.

## Why not code-driven?

Supabase's built-in email templates only expose a small variable set
(`.ConfirmationURL`, `.Token`, `.Email`, `.SiteURL`). They do NOT
expose `user_metadata`, so we can't personalise with the recipient's
name or locale from the dashboard template alone.

If we ever want that (name in the greeting, per-locale subject/body),
the proper path is the **Send Email Hook** — Supabase POSTs the
confirmation payload to a route we own, we render our own HTML via
Resend and return 200. That's ~2–3 hours of work and requires manual
Dashboard hook configuration (URL + shared secret). Deferred.

Related follow-up doc: `docs/warmer-confirmation-email-plan.md`.
