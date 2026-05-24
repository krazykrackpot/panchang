# Bug Hunt Round 3 — Silent Failures, Error Handling, Observability

**Date:** 2026-05-24
**Scope:** Surviving silent-failure / fail-open / observability gaps after Round 2 sprints 18–25 (HEAD `b4cd2720`, PRs #156–#163).
**Method:** Read every cron handler not yet touched (onboarding-drip, weekly-digest, social-post, brihaspati-mark-eligible, index-urls, youtube-short, daily-panchang), every secondary API route (journal, life-events, predictions, almanac, notifications, subscription cancel, push, whatsapp), the service worker, client stores (`charts-store`, `learning-progress-store`), and grep the diff for `.then(({ data }) => …)` patterns that drop `error`, fire-and-forget `void async`, and empty arrow catches. Cross-checked Round 1 + Round 2 closed lists to avoid re-reporting.

---

### R3-SF-1 — Subscription cancel update discards Supabase error → "cancelled" UI but DB unchanged

- **File:** `src/app/api/subscription/route.ts:84-87`
- **Severity:** P0
- **Evidence:**
  ```ts
  // Update DB to cancel at period end
  await supabase.from('subscriptions').update({
    cancel_at_period_end: true,
    updated_at: new Date().toISOString(),
  }).eq('user_id', user.id);

  // Optionally cancel with provider
  if (subscription.provider === 'stripe' && subscription.provider_subscription_id) { … }
  ```
- **Why it's a bug:** The DB `.update()` returns `{ error }` and does not throw. The discarded `{ error }` means a transient RLS or connection failure leaves `cancel_at_period_end=false` in Supabase, but the handler returns `{ success: true, message: 'Subscription will cancel at period end' }` and proceeds to call Stripe/Razorpay to cancel at period end. The provider stops billing (or queues period-end cancel), but our DB still reports the subscription as fully active. On the next renewal day the user sees: provider invoice declined, our `tier='pro'` and `status='active'` still set, paywall/AdUnit gated to free. Mixed-source drift — exactly the shape Round 1 P0-9 (subscription-store) was meant to close, except here it's the *server* path, not the store.
- **Proposed fix:** Destructure `{ error: updErr }`; on `updErr` return 500 BEFORE the provider call. The DB write is the source of truth; if it fails the provider must not be touched, otherwise we end up half-cancelled.

### R3-SF-2 — Subscription cancel: provider failure leaves DB cancelled but provider still billing

- **File:** `src/app/api/subscription/route.ts:90-120` (sibling of R3-SF-1)
- **Severity:** P0
- **Evidence:** DB update at :84-87 commits `cancel_at_period_end=true`. Provider cancel at :99-101 (Stripe) and :115 (Razorpay) is wrapped in try/catch that only logs `console.error('Failed to cancel with Stripe:', providerErr)` then continues. Response returns `{ success: true }`.
- **Why it's a bug:** Inverse of R3-SF-1. If Stripe's API returns 5xx (well known to happen during their incidents), our DB marks the subscription cancelled but the Stripe sub keeps charging at the next billing cycle. Refund tickets follow. The user sees "Subscription will cancel at period end" UI ⇒ trusts it ⇒ next invoice hits their card. Brand damage.
- **Proposed fix:** Either (a) reverse the order — provider cancel FIRST, DB update SECOND, then return 500 if either fails; OR (b) on provider error, rollback the DB update (`cancel_at_period_end=false`) and return 500. The current pattern is unsafe in both directions.

### R3-SF-3 — WhatsApp webhook fire-and-forget `sendWhatsAppMessage` lost after response

- **File:** `src/app/api/whatsapp/route.ts:140-143`
- **Severity:** P1
- **Evidence:**
  ```ts
  // Fire-and-forget: send reply asynchronously but don't block the 200 response
  sendWhatsAppMessage(from, reply).catch(err => {
    console.error('[whatsapp] failed to send reply:', err);
  });
  return NextResponse.json({ status: 'ok' });
  ```
- **Why it's a bug:** Same shape as Round 2 SF-30 — Vercel Functions kill the runtime after the response returns. The outbound fetch to `graph.facebook.com` can be cut mid-flight; the `.catch` log never reaches Vercel because the function is already torn down. WhatsApp users sometimes see "msg sent — bot didn't reply." Compounding the issue: Meta does NOT retry the inbound webhook because we ACKed 200, so the user must DM again. Public failure surface on a paid Meta credit channel.
- **Proposed fix:** Use `waitUntil(sendWhatsAppMessage(from, reply))` from `@vercel/functions` so the runtime keeps the function alive until the WhatsApp API call completes. Same recipe Round 2 SF-30 recommended for welcome-email; both must be fixed.

### R3-SF-4 — WhatsApp panchang reply computes day from server-local Date, not city tz

- **File:** `src/app/api/whatsapp/route.ts:205-208`, `:259-262`
- **Severity:** P1
- **Evidence:**
  ```ts
  function generatePanchangMessage(city: CityData): string {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth() + 1;
    const day = now.getDate();
    const tz = city.timezone;
    ```
  The city's `tz` is used downstream (line 220, 235) for `computePanchang`'s `timezone` field, but the y/m/d that determine WHICH day the panchang is FOR are pulled from server-local `Date`. On a Vercel UTC instance, a Sydney user texting "panchang sydney" at 23:30 AEST (UTC 12:30) gets the UTC day's panchang (today UTC = today AEST so OK) — but a Delhi user at 02:00 IST (UTC 20:30 the day before) gets *yesterday's* panchang. Same shape as Round 2 SF-19.
- **Proposed fix:** Resolve y/m/d via `Intl.DateTimeFormat('en-CA', { timeZone: tz }).formatToParts(new Date())` (the pattern `daily-panchang/route.ts:144-149` already established).

### R3-SF-5 — onboarding-drip `getUserById` drops admin auth error → user silently skipped

- **File:** `src/app/api/cron/onboarding-drip/route.ts:61-62`
- **Severity:** P1
- **Evidence:**
  ```ts
  const { data: { user: authUser } } = await supabase.auth.admin.getUserById(user.id);
  if (!authUser?.email) { continue; }
  ```
- **Why it's a bug:** No `error` capture. If `auth.admin.getUserById` errors (admin token blip, network), `authUser === undefined`, `continue` skips the user entirely and the loop moves on. The drip-day claim at line 99-103 has not yet been made, so this user is dropped for THIS run only — next-day cron retries. But there is no log either: ops sees `usersChecked: N, sent: 0` and cannot tell whether the failure is "all users genuinely skipped because day-already-sent" vs "DB blip just took out every getUserById call." After a sustained outage every new signup loses every drip email and the activation funnel silently zeroes.
- **Proposed fix:** Destructure `{ data, error }`; on `error` log with `console.error('[OnboardingDrip] getUserById failed for', user.id, ':', error.message); failedCount++; continue;`. Surfaces the failure mode in ops.

### R3-SF-6 — weekly-digest profile + email-lookup + send all swallow errors

- **File:** `src/app/api/cron/weekly-digest/route.ts:50-54`, `:61-62`, `:141-142`
- **Severity:** P1
- **Evidence:**
  ```ts
  // Line 50: profile read drops error
  const { data: profile } = await supabase
    .from('user_profiles')
    .select('display_name, notification_prefs, panchang_lat, panchang_lng, panchang_timezone')
    .eq('id', snap.user_id)
    .maybeSingle();

  // Line 61: admin getUserById drops error
  const { data: { user: authUser } } = await supabase.auth.admin.getUserById(snap.user_id);
  if (!authUser?.email) { skipped++; continue; }

  // Line 141: sendEmail success-only counter, no error log
  const result = await sendEmail({ to: authUser.email, ...email });
  if (result.success) sent++;
  // (no else — Resend errors vanish; failures aren't counted, aren't logged)
  ```
- **Why it's a bug:** Three layered silent failures in one cron. On profile DB blip → `prefs = {}` (line 57) → digest goes out to a user who set `weekly_digest: false` (preferences ignored). On getUserById blip → skipped silently. On sendEmail failure → tally says "sent N" but actually fewer landed in inboxes. The cron returns `{ sent, skipped, total }` and an operator sees a healthy number — but the actual delivery rate is unknown.
- **Proposed fix:** All three sites need `{ error }` capture + log. The sendEmail tally needs an `errors++` branch that matches `daily-panchang`'s shape.

### R3-SF-7 — weekly-digest `now.getFullYear()` for festival year + crude day-construction

- **File:** `src/app/api/cron/weekly-digest/route.ts:82-89`, `:121`
- **Severity:** P2
- **Evidence:**
  ```ts
  for (let i = 0; i < 3; i++) {
    const d = new Date();
    d.setDate(d.getDate() + i);
    // …
    days.push({
      date: `${dayNames[d.getDay()]}, ${monthNames[d.getMonth()]} ${d.getDate()}`,
      …
    });
  }
  // … later
  const thisYear = now.getFullYear();
  const festEntries = generateFestivalCalendarV2(thisYear, festLat, festLng, festTz);
  const weekCutoff = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10);
  const todayStr = now.toISOString().slice(0, 10);
  ```
- **Why it's a bug:** Lesson L. `new Date()` + `setDate`/`getDay`/`getMonth`/`getDate` and `getFullYear` are local-TZ — Vercel cron runs UTC today, but the date labels printed in the email say `Sun, May 24` when in the user's CET timezone it's `May 25`. Festival year crosses also off-by-one near Dec 31 UTC. Cosmetic for the day labels, but the festival year selection at Dec 31 UTC could miss New Year's Day festivals.
- **Proposed fix:** Use the user's stored `panchang_timezone` to derive day labels via `Intl.DateTimeFormat`. For festival year, `now.getUTCFullYear()`.

### R3-SF-8 — `social-post` composeTweet recomputes dayOfYear via local-TZ `new Date()`

- **File:** `src/app/api/cron/social-post/route.ts:564`
- **Severity:** P2
- **Evidence:**
  ```ts
  // Rotate temple/mandir tags daily  –  uses shared helper
  const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000);
  lines.push(getTempleHashtags(dayOfYear));
  ```
  Note line 85-86 of the same file correctly uses `Date.UTC(year, 0, 0)`. The Monday branch (composeTweet) re-derives the index using `new Date(new Date().getFullYear(), 0, 0)` — local-TZ. Two-codepath drift in the SAME file.
- **Why it's a bug:** Lesson M. The hashtag selection at the top of the route uses one formula; the Monday daily-panchang branch uses a different one. On a non-UTC server the rotation lags by one tag; the file's own assertion that "rotate daily" is broken on year-end. Public tweet content lands on the wrong hashtag pool.
- **Proposed fix:** Replace with `Math.floor((Date.now() - Date.UTC(new Date().getUTCFullYear(), 0, 0)) / 86400000)` — match the route's own pattern.

### R3-SF-9 — `generate-notifications.getUpcomingFestivals` uses local-TZ year + month boundary

- **File:** `src/app/api/cron/generate-notifications/route.ts:179-186`
- **Severity:** P2
- **Evidence:**
  ```ts
  function getUpcomingFestivals(): FestivalStub[] {
    const now = new Date();
    const cutoff = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
    const todayStr = now.toISOString().slice(0, 10);
    const cutoffStr = cutoff.toISOString().slice(0, 10);

    // Generate festivals for current year (and next if we're near year-end)
    const years = [now.getFullYear()];
    if (now.getMonth() >= 11) years.push(now.getFullYear() + 1);
    ```
- **Why it's a bug:** Lesson L. `now.getFullYear()` + `now.getMonth() >= 11` evaluate in server-local TZ. At UTC 23:30 on Dec 31, a UTC-5 server still says `getMonth() === 11` (December) and `getFullYear() === current`, missing the upcoming year entirely. The cron runs at 06:00 UTC so this exact moment is improbable but the design is wrong: server TZ guarantees nothing. Sprint 21 closed the cron's INSERT-side dedup with UTC bucketing — but the `getUpcomingFestivals()` helper kept its local-TZ accessors.
- **Proposed fix:** `now.getUTCFullYear()` + `now.getUTCMonth() >= 11`.

### R3-SF-10 — `learning-progress-store` streak math runs entirely on local-TZ Date

- **File:** `src/stores/learning-progress-store.ts:243-264`
- **Severity:** P1
- **Evidence:**
  ```ts
  /** Get today's date string in YYYY-MM-DD (local time) */
  function getTodayStr(): string {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  }
  /** Get date N days ago in YYYY-MM-DD (local time) */
  function getDaysAgoStr(n: number): string {
    const d = new Date();
    d.setDate(d.getDate() - n);
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  }
  /** Check if today is Monday (for weekly freeze reset) */
  function isTodayMonday(): boolean {
    return new Date().getDay() === 1;
  }
  ```
- **Why it's a bug:** This is the second-half of MEMORY.md's "audit deferred: local-TZ day math" item. The streak engine reads `getTodayStr()` and compares against the stored `lastActiveDate`. A user who studies at 23:55 local time and again at 00:05 the next day in a different IANA zone (DST jump, travel) sees their streak break. Same shape: `getFutureDateStr` for SR-2 spaced-repetition reviews — a user who flies from PST to CET has their flashcards re-scheduled to a date that's already in the past from the server's view. Streak gamification is the only persistent retention loop in the app; silent miscount is brand-damage shape.
- **Proposed fix:** Resolve the user's stored `panchang_timezone` (or birth_timezone fallback), then `Intl.DateTimeFormat('en-CA', { timeZone: tz }).format(new Date())` for all three helpers. Until the helper exists, fall back to UTC accessors with a tagged comment — at least the server, all users, and the on-device computation agree.

### R3-SF-11 — `learning-progress-store.upsertToSupabase` is `void (async () => …)` fire-and-forget

- **File:** `src/stores/learning-progress-store.ts:269-292`
- **Severity:** P2
- **Evidence:**
  ```ts
  function upsertToSupabase(entry: ModuleProgress): void {
    void (async () => {
      const userId = await getCurrentUserId();
      if (!userId) return;
      // …
      const { error } = await supabase
        .from('learning_progress')
        .upsert({ … }, { onConflict: 'user_id,module_id' });
      if (error) console.warn('[LearningProgress] Upsert error:', error.message);
    })();
  }
  ```
- **Why it's a bug:** Called from `markPageRead`, `markQuizPassed`, `markComplete`. The wrapping `void (async () => …)()` runs detached: a network failure logs `console.warn` (not even `.error`) but no UI feedback. The user's progress was written to localStorage and the in-memory store; the next time they refresh on a different device, their progress doesn't appear. Worse, because writeProgressToStorage already succeeded the user has no signal that the sync failed — they think they're done with Module 5, but their other devices show "in_progress."
- **Proposed fix:** Either await the upsert (callers can stay synchronous by returning a Promise that the caller chooses not to await), or attach a status flag (`syncFailed: true`) to the row in the store so a future `syncWithSupabase` re-attempts. `console.warn` → `console.error` either way — UPSERT failure for user data is not a warning.

### R3-SF-12 — `charts-store.fetchCharts` getSession drops auth error

- **File:** `src/stores/charts-store.ts:47-48`, `:99-101`
- **Severity:** P1
- **Evidence:**
  ```ts
  // Line 47:
  const { data: { session } } = await supabase.auth.getSession();
  const user = session?.user ?? null;
  const key = user?.id ?? 'anon';
  // …
  if (!user) {
    set({ charts: [], loading: false });  // wipes the UI on transient session blip
    return;
  }
  ```
- **Why it's a bug:** Identical shape to Round 2 SF-21 (auth-store.initialize), now closed. The charts store survived. On any `getSession` blip (network, JWT decode race), session resolves to null, charts get wiped to `[]`, dashboard re-renders "no saved charts — add one." The user re-saves the same chart → either dedupe at line 116-121 catches it (if the dedupe-read also doesn't blip) OR a duplicate row lands. Cumulatively, a flaky network creates phantom charts.
- **Proposed fix:** `const { data, error } = await supabase.auth.getSession(); if (error) { console.error('[charts] getSession failed:', error.message); return; }` — don't wipe charts on error, leave the current state and let the next call recover.

### R3-SF-13 — `charts-store.saveChart` dedupe-read drops Supabase error → duplicate row

- **File:** `src/stores/charts-store.ts:116-121`
- **Severity:** P1
- **Evidence:**
  ```ts
  const { data: candidateRows } = await supabase
    .from('saved_charts')
    .select('id, label, birth_data')
    .eq('user_id', user.id)
    .ilike('label', label.trim())
    .limit(20);
  const normalizedNewTime = normalizeBirthTime(birthData.time);
  const dup = (candidateRows ?? []).find((row) => { … });
  if (dup) { await get().fetchCharts(); return {}; }
  ```
- **Why it's a bug:** Lesson G (idempotent writes). The natural-key dedupe ONLY works if `candidateRows` is reliably the set of existing rows. Discarding `{ error }` means a DB read failure → empty array → `dup === undefined` → insert proceeds → duplicate saved chart row. The user sees "two of the same chart" in the dashboard, has to delete one manually. Compounded by the partial unique index from migration 031 that only covers the `isSelf` branch — non-self saves have no DB-level dedup. This is exactly the shape Round 1 P0-7 (settings welcome-email bombardment) closed for emails; the saved-chart twin survived.
- **Proposed fix:** Destructure error; on error, return `{ error: 'Failed to check existing charts' }` and don't insert. Better a user-visible "save failed, please retry" than a duplicate that survives on disk.

### R3-SF-14 — `charts-store.saveChart` is_primary clear drops error → two primary charts

- **File:** `src/stores/charts-store.ts:142-148`
- **Severity:** P2
- **Evidence:**
  ```ts
  if (isPrimary) {
    await supabase
      .from('saved_charts')
      .update({ is_primary: false })
      .eq('user_id', user.id)
      .eq('is_primary', true);
  }
  const { error } = await supabase.from('saved_charts').insert({ … is_primary: isPrimary });
  ```
- **Why it's a bug:** Demote-others-then-insert: if the demote silently fails (RLS, network), the insert at line 150 still flips a new chart to `is_primary=true` while the previous primary is still `is_primary=true` → the dashboard sees two primary charts. The natal-chart selector in `HubClient.tsx:281-298` uses `.order('is_primary', { ascending: false })` and falls through to `created_at`, so one chart wins arbitrarily — but the user explicitly intended the most-recent-flagged one. Same root-cause shape as Round 1 P1-24 (kundali Client demote-others-then-insert race).
- **Proposed fix:** Capture `{ error }` on the demote; on error, return `{ error: '…' }` and abort the insert.

### R3-SF-15 — Service worker prefetch URL constructs date in client-local TZ

- **File:** `public/sw.js:76-83`
- **Severity:** P1
- **Evidence:**
  ```js
  if (event.data && event.data.type === 'PREFETCH_PANCHANG') {
    var lat = event.data.lat;
    var lng = event.data.lng;
    var tz = event.data.timezone || 'UTC';
    if (!lat || !lng) return;
    var today = new Date();
    var urls = [];
    for (var i = 0; i < 7; i++) {
      var d = new Date(today);
      d.setDate(d.getDate() + i);
      var y = d.getFullYear(), m = d.getMonth() + 1, day = d.getDate();
      urls.push('/api/panchang?year=' + y + '&month=' + m + '&day=' + day + '&lat=' + lat + '&lng=' + lng + '&timezone=' + encodeURIComponent(tz));
    }
  }
  ```
- **Why it's a bug:** The whole point of the prefetch is to make 7 days of the user's *city* panchang available offline. The query string carries `timezone=tz` (correct), but the y/m/d that select WHICH calendar day were constructed via the browser's local-TZ accessors. A Bay Area user prefetching Delhi panchang for the next 7 days at 8 PM PST gets the URL for `year=2026&month=05&day=24` while in Delhi (`tz`) the calendar day is already May 25. Result: the user opens the app at midnight IST offline → no entry for IST May 25 in cache → "{error: offline}" → app falls back to a non-existent stale entry. Same shape as Round 2 SF-19 (family-synthesis).
- **Proposed fix:** Compute date components using `Intl.DateTimeFormat('en-CA', { timeZone: tz }).format(d)` so the URL day matches the panchang city. The prefetch happens once at registration; the few-millisecond cost is invisible.

### R3-SF-16 — Service worker prefetch `.catch(function() {})` per URL is banned pattern

- **File:** `public/sw.js:96`
- **Severity:** P2
- **Evidence:**
  ```js
  fetch(url).then(function(res) {
    if (res.ok) { … }
  }).catch(function() { /* Prefetch failed silently — not critical */ });
  ```
- **Why it's a bug:** Banned pattern (global rule §1). Per-URL silent failures during prefetch mean a flaky cellular connection could drop 7/7 days and the user thinks offline panchang is working when nothing was cached. The comment says "not critical" — but offline-panchang IS the value proposition of the PWA. Ops cannot detect when prefetch is broken across the user base.
- **Proposed fix:** `.catch(function(err) { console.warn('[sw] panchang prefetch failed for', url, ':', err); })` — at least a tagged log so a dev tools console open during install shows the issue.

### R3-SF-17 — Service worker netFirst / swr / cacheFirst all use `if (res.ok)` and silently drop non-2xx

- **File:** `public/sw.js:122-134`, `:194-199`, `:209-215`, `:226-231`
- **Severity:** P2
- **Evidence:** Every caching helper checks `if (res.ok)` before caching, then returns `res`. There is NO branch that logs when `res.ok === false` — a 502, 504, 500 from the origin returns to the page without any signal, then on the next offline attempt the user gets a stale or no-cache response. Combined with R3-SF-16 the service worker has zero observability.
- **Why it's a bug:** A backend incident shows up as "the app feels stale" or "the panchang seems wrong" with no diagnostic trail in browser devtools or server logs. The service worker is the silent middleman.
- **Proposed fix:** Add `else { console.warn('[sw] cache skipped on', res.status, r.url); }` in each helper. This is the only path to know SW behavior at scale.

### R3-SF-18 — `cron/index-urls` "today" derived from server-UTC ISO slice, not Ujjain/India-meridian

- **File:** `src/app/api/cron/index-urls/route.ts:29`
- **Severity:** P2
- **Evidence:**
  ```ts
  const today = new Date().toISOString().slice(0, 10);
  // …
  paths.push(`/${locale}/horoscope/${r}/${today}`);    // Today's date-specific URL
  ```
- **Why it's a bug:** The IndexNow cron runs at 00:05 UTC. The URL `/horoscope/mesh/2026-05-24` is built from UTC `today`. But Indian users (>90% of horoscope traffic) live in IST (UTC+5:30) where it's already 05:35 of May 24 — the date is the same. The case to worry about: cron migrating to a different schedule, or a manual run at 18:00 UTC → URL says today=2026-05-24 (UTC) while IST calendar is already May 25. Bing/Yandex re-crawl the wrong date page, marking it as "the canonical today." Low impact for now but the contract is fragile.
- **Proposed fix:** Either accept the UTC convention with an explicit comment, or use Asia/Kolkata-formatted date if the horoscope pages canonicalise on IST sunrise.

### R3-SF-19 — Auth callback page survives Round 2 SF-23 unchanged (setTimeout 500ms + drops getSession error)

- **File:** `src/app/[locale]/auth/callback/page.tsx:29`, `:31`, `:51`
- **Severity:** P2
- **Evidence:**
  ```ts
  await new Promise(r => setTimeout(r, 500));
  const { data } = await supabase.auth.getSession();    // line 31, no error
  // …
  supabase.auth.getSession().then(({ data }) => {       // line 51, no error, no .catch()
    if (data.session) handleAuth();
  });
  ```
- **Why it's a bug:** Round 2 SF-23 flagged this; the file is unchanged at HEAD `b4cd2720`. Three sub-defects per Round 2: 500ms hardcoded substitutes for an event (rule §3/E), both getSession calls drop `{ error }`, line 51 has no `.catch()` so a thrown rejection becomes an unhandled-rejection event. The error UI says "Something went wrong" with zero diagnostic.
- **Proposed fix:** Per Round 2: replace setTimeout with awaiting the `onAuthStateChange` SIGNED_IN event (already registered above). Destructure error on both `getSession()` calls. Add `.catch()` on line 51.

### R3-SF-20 — `signInWithEmail` doesn't wrap in try/finally → button stays disabled on network throw

- **File:** `src/stores/auth-store.ts:159-166`
- **Severity:** P2 (regression — Round 1 P1-8 was flagged, never closed)
- **Evidence:**
  ```ts
  signInWithEmail: async (email, password) => {
    const supabase = getSupabase();
    if (!supabase) return { error: 'Auth not configured' };
    set({ loading: true });
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    set({ loading: false });
    return error ? { error: error.message } : {};
  },
  ```
- **Why it's a bug:** If `signInWithPassword` throws (network drop, opaque JSON parse), `loading: false` is never set → button spins forever until the user navigates. Same pattern as Round 1 P1-8. Note Round 2 fixed `signUpWithEmail` (line 168-184) implicitly by short-circuiting — `signInWithEmail` was not.
- **Proposed fix:** Wrap in try/finally so `set({ loading: false })` always runs.

### R3-SF-21 — Push subscribe DELETE survives Round 2 SF-24 unchanged

- **File:** `src/app/api/push/subscribe/route.ts:106-110`
- **Severity:** P2
- **Evidence:**
  ```ts
  await supabaseAdmin
    .from('push_subscriptions')
    .delete()
    .eq('user_id', user.id)
    .eq('endpoint', endpoint);
  return NextResponse.json({ success: true });
  ```
- **Why it's a bug:** Round 2 SF-24 flagged this and was not closed. On RLS denial or transient blip, response says `success: true` but the row stays → device keeps receiving pushes the user thinks they unsubscribed from. Trust-eroding UX on the only opt-out path.
- **Proposed fix:** `const { error } = await … delete(…); if (error) { console.error('[PushUnsubscribe] delete failed:', error.message); return NextResponse.json({ error: 'Unsubscribe failed' }, { status: 500 }); }`.

### R3-SF-22 — `send-push.ts` survives Round 2 SF-25 in full

- **File:** `src/lib/push/send-push.ts:66-69`, `:92-102`, `:121-128`
- **Severity:** P2
- **Evidence:**
  - Line 66: `const { data: subscriptions } = await supabaseAdmin…` — drops error
  - Line 92-102: catch block only logs via implicit `failed++`, no `console.error` outside the 410/404 cleanup branch
  - Line 97-101: cleanup `delete` drops its own error
  - Line 121: `Promise.all` in batch path — one user's rejection breaks the entire batch
- **Why it's a bug:** Round 2 SF-25 flagged this; nothing was changed. Cron `generate-notifications` (now Sprint 21–closed for its OWN dedup but still calls `sendPushToUser`) catches `try/catch` around the call (route.ts:142-152), so a thrown rejection from a `Promise.all` failure doesn't take down the cron. But: silent subscription-read failure → no push sent → user expected an antardasha-transition alert and got nothing. No diagnostic.
- **Proposed fix:** Per Round 2: destructure subscriptions-read error; add `else { console.error('[send-push] send failed for', sub.endpoint, ':', err); }`; swap `Promise.all` → `Promise.allSettled` in the batch path.

### R3-SF-23 — `welcomeEmail` survives Round 2 SF-30 with fire-and-forget pattern

- **File:** `src/app/api/user/profile/route.ts:382-386`
- **Severity:** P2
- **Evidence:**
  ```ts
  sendEmail({ to: user.email, ...email }).catch((err) => {
    console.error('[user/profile] welcome email send failed (claim already set):', err);
  });
  ```
- **Why it's a bug:** Round 2 SF-30 flagged this; nothing was changed. The `welcome_email_sent_at` claim is committed BEFORE the fire-and-forget send. Vercel may kill the function after the response → email never reaches Resend → claim stays set → user never gets a welcome email. Activation-funnel leak.
- **Proposed fix:** Use `waitUntil(sendEmail(…))` from `@vercel/functions`, or `await` and accept ~300ms response delay.

### R3-SF-24 — `HubClient.tsx` saved-charts read drops `{ error }`

- **File:** `src/app/[locale]/horoscope/HubClient.tsx:280-298`
- **Severity:** P2
- **Evidence:**
  ```ts
  supabase
    .from('saved_charts')
    .select('id, label, birth_data, is_primary')
    .eq('user_id', user.id)
    .order('is_primary', { ascending: false })
    .order('created_at', { ascending: true })
    .then(({ data }) => {
      if (!data) return;
      const people: SavedPerson[] = data.map(…);
      setSavedPeople(people);
    });
  ```
- **Why it's a bug:** `.then(({ data }) => …)` without `error` is the banned pattern (rule §1). On a DB blip, `data === null` → early return → the hub renders "No saved people" with a Quick Add CTA. The user has 5 saved charts but sees zero. Same shape as Round 1 P1-12; HubClient was named in P1-12 but the fix did not actually destructure `{ error }`.
- **Proposed fix:** `.then(({ data, error }) => { if (error) { console.error('[hub] saved_charts read failed:', error.message); return; } … })`.

### R3-SF-25 — `HubClient.tsx` 12-rashi cosmic weather uses `.catch(() => null)`

- **File:** `src/app/[locale]/horoscope/HubClient.tsx:314-319`
- **Severity:** P2
- **Evidence:**
  ```ts
  const results = await Promise.all(
    RASHIS.map(r =>
      fetch(`/api/horoscope/daily?moonSign=${r.id}&date=${date}`)
        .then(res => res.ok ? res.json() as Promise<DailyHoroscope> : null)
        .catch(() => null)
    )
  );
  ```
- **Why it's a bug:** Banned pattern. 12 fetches fan out; on partial failures `null`s are filtered out at the next step → the cosmic weather widget shows whatever subset succeeded with no indication that 5 are missing. Ops cannot detect when `/api/horoscope/daily` is in distress: zero log signal. Bonus: the parent `try/catch` at line 313/330 wraps the entire `await Promise.all`, but Promise.all only rejects if `.catch(() => null)` weren't suppressing the rejections — so the outer catch never fires.
- **Proposed fix:** `.catch((err) => { console.error('[hub] daily horoscope failed for rashi', r.id, ':', err); return null; })`.

### R3-SF-26 — `MonthlyClient.tsx` per-day horoscope drops the error completely

- **File:** `src/app/[locale]/horoscope/[rashi]/monthly/MonthlyClient.tsx:181-186`
- **Severity:** P2
- **Evidence:**
  ```ts
  return fetch(`/api/horoscope/daily?moonSign=${rashi.id}&date=${dateStr}`)
    .then(res => {
      if (res.ok) return res.json();
      throw new Error('Failed');
    })
    .then((data: DailyHoroscope) => ({ day, data }))
    .catch(() => ({ day, data: null as DailyHoroscope | null }));
  ```
- **Why it's a bug:** Same shape as R3-SF-25. The monthly view interpolates scores when a sample day is null; the user sees a smooth gradient but a few days are made up. No log when the upstream is failing — silently degrades quality with no operator signal.
- **Proposed fix:** `.catch((err) => { console.error('[monthly] day fetch failed:', dateStr, err); return { day, data: null }; })`.

### R3-SF-27 — Saved-charts page `.then(({ data }))` drops error on the read

- **File:** `src/app/[locale]/dashboard/saved-charts/page.tsx:48-55`
- **Severity:** P2 (regression — Round 1 P1-9 listed this file but the fix didn't land here)
- **Evidence:**
  ```ts
  supabase.from('saved_charts')
    .select('id, label, birth_data, is_primary, created_at')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .then(({ data }) => {
      if (data) setCharts(data as SavedChart[]);
      setLoading(false);
    });
  ```
- **Why it's a bug:** Round 1 P1-9 named this file. The current state at HEAD still discards `error`. On DB blip, `data === undefined` → `setCharts` skipped → empty list. Loading state terminates (good), but the user sees "no saved charts" + CTA → re-saves an existing chart → duplicate (mitigated by the partial unique index from migration 031 only for the self-chart case; spouse/parent charts can still duplicate).
- **Proposed fix:** `.then(({ data, error }) => { if (error) console.error('[saved-charts] read failed:', error.message); if (data) setCharts(data as SavedChart[]); setLoading(false); })`.

### R3-SF-28 — `baby-names/page.tsx` profile auto-fill drops `{ error }`

- **File:** `src/app/[locale]/baby-names/page.tsx:46-62`
- **Severity:** P2 (regression — Round 1 P1-13 listed this file)
- **Evidence:**
  ```ts
  supabase.from('user_profiles')
    .select('date_of_birth, …, birth_lng, birth_timezone')
    .eq('id', user.id)
    .maybeSingle()
    .then(({ data }) => {
      if (data?.date_of_birth && data?.birth_lat != null) {
        setBirthDate(data.date_of_birth);
        // …
      }
    });
  ```
- **Why it's a bug:** Round 1 P1-13 listed both baby-names and sign-calculator. The current code still drops `error`. On DB blip → fields not autofilled → user must re-enter birth details → form re-submission creates a kundali computed at a slightly different precision (rounded coords) than the stored snapshot → duplicate `kundali_snapshots` upsert tracks divergent rows.
- **Proposed fix:** `.then(({ data, error }) => { if (error) console.error('[baby-names] profile autofill failed:', error.message); if (data?.date_of_birth && …) { … } })`.

### R3-SF-29 — `puja/[slug]/page.tsx` computed muhurta + ekadashi parana both `catch { return undefined/null; }`

- **File:** `src/app/[locale]/puja/[slug]/page.tsx:454-461`, `:464-489` (uses local-TZ date construction at :467-469)
- **Severity:** P2
- **Evidence:**
  ```ts
  // Line 454:
  try {
    return computePujaMuhurta(
      puja.muhurtaWindow.type,
      festivalDate.getFullYear(), festivalDate.getMonth() + 1, festivalDate.getDate(),
      userLat, userLng, timezoneOffset
    );
  } catch { return undefined; }

  // Line 467 (parana):
  const now = new Date();
  const todayStr = `${now.getFullYear()}-${(now.getMonth() + 1).toString().padStart(2, '0')}-${now.getDate().toString().padStart(2, '0')}`;
  ```
- **Why it's a bug:** Empty catch (banned, rule §1) — when computePujaMuhurta throws (e.g., on engine bug, undefined for an unknown muhurta type), the puja page silently renders without a muhurta section. User sees an incomplete page and cannot tell whether (a) this puja has no computed muhurta by design, (b) the engine errored. Compounding: parana date `now.getFullYear/getMonth/getDate` is local-TZ (Lesson L) — at midnight in the user's tz the displayed "next ekadashi" can be off by a day.
- **Proposed fix:** `} catch (err) { console.error('[puja] computePujaMuhurta failed for', puja.slug, ':', err); return undefined; }`. For the parana, use `Intl.DateTimeFormat('en-CA', { timeZone: userTimezone })`.

### R3-SF-30 — `EclipseAlert.tsx` swallows fetch errors with `} catch { return null; }`

- **File:** `src/components/dashboard/EclipseAlert.tsx:46-65`
- **Severity:** P3
- **Evidence:**
  ```ts
  try {
    const res = await fetch(`/api/eclipses?${params}`);
    const data = await res.json();
    // …
    return eclipses.find(e => e.date > today && …) || null;
  } catch { return null; }
  ```
- **Why it's a bug:** Banned pattern (rule §1). Eclipse alerts are a high-value notification for visible eclipses (rare). If /api/eclipses fails, the alert silently disappears from the dashboard — the user misses the eclipse. Ops cannot detect.
- **Proposed fix:** `} catch (err) { console.error('[EclipseAlert] fetch failed:', err); return null; }`.

---

## Cross-cutting themes

1. **Razorpay parity sprints landed for the WEBHOOK + BINDING, but the in-app cancel path is still asymmetric.** R3-SF-1 + R3-SF-2 are the Stripe twin's missing cancel-rollback semantics. Whoever closed Round 2 SF-1/SF-2/SF-3 must also audit `subscription/route.ts` POST `cancel` branch — DB + provider must be either both-or-neither.

2. **Fire-and-forget across Vercel response boundaries persists in three places.** R3-SF-3 (WhatsApp), R3-SF-11 (learning-progress upsert), R3-SF-23 (welcome email — Round 2 SF-30 unchanged). The same `waitUntil` recipe applies to all three; worth a one-PR pass.

3. **Local-TZ Date math in client stores and the SW is the biggest surviving instance of Lesson L.** R3-SF-7, R3-SF-8, R3-SF-9, R3-SF-10, R3-SF-15, R3-SF-18 are all the same shape: "the cron / store / SW uses `new Date()` accessors instead of UTC or the user's tz." Sprint 21 fixed the cron *insert dedup* path; sprint 24 fixed several page-level cases. Streak engine (R3-SF-10) is the highest-impact survivor — gamification miscount is brand-damage shape.

4. **Three Round 2 silent-failure findings shipped to Round 2's audit list but did NOT land in any sprint.** R3-SF-19 (auth/callback SF-23), R3-SF-21 (push DELETE SF-24), R3-SF-22 (send-push SF-25), R3-SF-23 (welcomeEmail SF-30). Verified by re-grep against HEAD `b4cd2720`. They are not regressions — they were never closed.

5. **`.then(({ data }) => …)` without `{ error }` is the surviving idiom across client pages.** R3-SF-12, R3-SF-13, R3-SF-24, R3-SF-27, R3-SF-28 all have this exact shape. Round 1's P1-9/P1-12/P1-13 listed the files; the fixes apparently only landed in some. A grep + replace audit is justified — likely 6–10 more surviving instances.

6. **The service worker is observability-dead.** R3-SF-15 + R3-SF-16 + R3-SF-17. The SW caches authenticated endpoints (correctly per AUTH_PREFIXES), but provides zero log signal when it skips, when prefetch fails, or when the origin returns 5xx. A backend incident is invisible from the SW path. Adding `console.warn` lines costs nothing and gives the browser console a diagnostic trail.

7. **Cron handlers still mix two-codepath drift within the same file.** `social-post` uses `Date.UTC` correctly at line 85 and `new Date(year, 0, 0)` (local-TZ) at line 564 — a single contributor wrote one and a different one wrote the other, and they never compared. The pattern in `generate-notifications.getUpcomingFestivals` is identical to the (now-closed) INSERT-side dedup pattern in the same file. Audits going forward should grep the whole file, not just the changed line.

## Diminishing-returns note

The silent-failure surface has been heavily worked across Rounds 1 + 2 (25+ sprints). The biggest *new* findings here are R3-SF-1 / R3-SF-2 (subscription cancel symmetry — genuine P0 because money-state mismatch), R3-SF-3 (WhatsApp fire-and-forget — P1, brand-visible), and R3-SF-10 (learning-progress streak local-TZ — P1, retention impact). Most other items are P2/P3: regressions of named-but-unfixed Round 1/2 findings (R3-SF-19/21/22/23/24/27/28), the same idioms in different files, or low-volume edges (SW observability, dashboard widget fallbacks). The pattern types are well-mapped at this point — what remains is a methodical sweep, not new pattern discovery. A single AST codemod for `.then(({ data }) =>` → `.then(({ data, error }) =>` + a wrapper helper `supabaseExec()` that throws on `{ error }` would close ~70% of the survivors mechanically. Beyond that, future audits should focus on *interaction* bugs — e.g., the SW + dasha cron + push subscribe triangle — rather than re-grepping for the next `catch {}`.
