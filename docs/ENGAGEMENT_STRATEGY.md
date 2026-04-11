# Engagement Strategy — Dekho Panchang

**Date:** 2026-04-11
**Status:** Planned — implementing sequentially through all tiers

---

## Goal

Transform Dekho Panchang from a "visit when needed" tool into a **daily habit** with viral sharing loops. Target: 3x daily active users within 3 months.

---

## Tier 1: Daily Hooks (Highest Impact — Implement First)

### 1.1 Daily Learning Streak
**What:** Track consecutive days of learning activity. Show streak counter in sidebar + dashboard.
**Why:** Duolingo-proven mechanic. Users return daily to avoid breaking their streak.
**Implementation:**
- Add `streakDays`, `lastActiveDate` to `learning-progress-store.ts`
- Streak increments when user reads a page or passes a quiz
- Show 🔥 streak badge in sidebar + dashboard
- "Don't break your streak!" nudge if user hasn't visited today
- Streak freeze (1 free per week) to reduce frustration
**Effort:** Small — builds on existing learning progress system
**Files:** `src/stores/learning-progress-store.ts`, `src/components/learn/LearnSidebar.tsx`, `src/app/[locale]/dashboard/page.tsx`

### 1.2 WhatsApp Share Button (Every Page)
**What:** One-tap WhatsApp share button on every content page — panchang, eclipses, festivals, contributions, kundali summary.
**Why:** WhatsApp is the #1 communication app in India. Sharing is the primary viral loop.
**Implementation:**
- Create `ShareButton` component with WhatsApp, X/Twitter, copy-link options
- Generate shareable text per page type:
  - Panchang: "Today's Panchang: Shukla Ekadashi, Ashwini Nakshatra — check yours at dekhopanchang.com/panchang"
  - Eclipse: "Next visible eclipse Aug 12, 2026 — 91% coverage from Zurich! dekhopanchang.com/eclipses"
  - Contribution: "Did you know 'Sine' is a Sanskrit word? The entire history → dekhopanchang.com/learn/contributions/sine"
  - Festival: "Ekadashi Vrat tomorrow — Parana 6:12-8:45am. Full details → dekhopanchang.com/calendar/ekadashi"
- WhatsApp API: `https://wa.me/?text={encodedText}`
- Floating share button (bottom-right) or inline share row
**Effort:** Small — one component, integrate everywhere
**Files:** New `src/components/ui/ShareButton.tsx`, add to all page layouts

### 1.3 Festival Countdown + Reminders
**What:** Dashboard card showing next 3 upcoming festivals with countdown. Push notification 1 day before.
**Why:** Festivals are the #1 reason people check panchang. Proactive reminders = guaranteed return.
**Implementation:**
- Dashboard: "Upcoming" card with next 3 festivals, countdown badges ("Tomorrow!", "In 3 days")
- Web push notification (service worker already exists): "Ekadashi tomorrow — begin fasting at sunset. Parana window: 6:12-8:45am"
- User can toggle notification preferences in settings
- Link notification to festival detail page
**Effort:** Medium — needs push notification opt-in + scheduling
**Files:** `src/components/dashboard/FestivalCountdown.tsx`, `public/sw.js` (push handler), settings page

### 1.4 Morning Briefing (Email/Dashboard)
**What:** Personalized daily briefing: today's tithi, nakshatra, yoga, hora schedule, any transit alerts, festival if applicable. Delivered as email (Resend) and/or dashboard card.
**Why:** The single most valuable daily touchpoint. "Your cosmic weather forecast."
**Implementation:**
- API route: `/api/daily-briefing?userId=X` — computes personalized panchang + transit alerts
- Dashboard: "Today's Briefing" card at top (already have PersonalizedDay computation)
- Email: Daily digest via Resend at user's preferred time (default: 6 AM local)
- Content: tithi + nakshatra + yoga + favorable/unfavorable hours + any dasha transitions
- Settings: opt-in, delivery time, email vs push vs both
**Effort:** Medium — email scheduling needs cron job + Resend integration
**Files:** New `src/app/api/daily-briefing/route.ts`, `src/components/dashboard/MorningBriefing.tsx`

---

## Tier 2: Sharing & Virality

### 2.1 Share Cards for Contribution Pages
**What:** Beautiful OG-image cards for each "India's Contributions" page. When shared on social media, they show an eye-catching card with the key fact.
**Why:** "Did you know?" content is inherently viral. Each share brings new users.
**Implementation:**
- Dynamic OG images using `@vercel/og` or Satori for each contribution page
- Card design: dark background, gold text, key stat ("300 years before Pythagoras"), Dekho Panchang branding
- Share button with pre-filled text for WhatsApp, X, Facebook
- Track shares as analytics events
**Effort:** Medium — need OG image generation per page
**Files:** `src/app/[locale]/learn/contributions/*/opengraph-image.tsx`

### 2.2 Shareable Kundali Summary Card
**What:** One-tap generate + share a beautiful summary card of your birth chart.
**Why:** Astrology is inherently social — people love sharing their chart details.
**Implementation:**
- Generate card: Ascendant sign icon, Moon sign, Sun sign, current Mahadasha, key yoga
- Render as image (canvas/SVG → PNG)
- Share via WhatsApp/social with link to full chart
- "Generate your chart → dekhopanchang.com/kundali"
**Effort:** Medium
**Files:** New `src/components/kundali/ShareableCard.tsx`

### 2.3 "Challenge a Friend" Quiz Share
**What:** After passing a quiz, share: "I scored 5/5 on 'Why 7 Days in a Week' — can you beat me?"
**Why:** Competition drives engagement. Friends click → sign up → take quiz → share.
**Implementation:**
- Post-quiz pass screen: add "Challenge a Friend" button
- Generate shareable link with quiz ID
- Landing page shows challenge + "Take the quiz" CTA
- Track challenger completions
**Effort:** Small — add share button to existing post-quiz flow
**Files:** `src/components/learn/ModuleContainer.tsx` (post-quiz section)

### 2.4 Your Week Ahead
**What:** Weekly personalized transit forecast card on dashboard + optional email.
**Why:** Users check weekly horoscope religiously. We can do it better — backed by actual calculations.
**Implementation:**
- Compute: this week's major transits to natal chart, dasha sub-period themes, favorable/challenging days
- Dashboard card: "Your Week: Apr 11-17" with day-by-day summary
- Optional weekly email every Sunday evening
- Uses existing transit computation + kundali data
**Effort:** Medium
**Files:** New `src/components/dashboard/WeekAhead.tsx`, API route for computation

---

## Tier 3: Retention Mechanics

### 3.1 Learning Badges + Levels
**What:** Achievement badges for milestones. Jyotish proficiency levels.
**Why:** Visual progress markers motivate completion. Shareable badges = social proof.
**Implementation:**
- Levels: Beginner (0-10 modules) → Student (11-30) → Practitioner (31-60) → Vidwan (61-90) → Pandit (91+)
- Badges: "Phase 1 Complete", "Eclipse Expert", "First Quiz Passed", "7-Day Streak", "All Contributions Read"
- Show on profile page, sidebar, and shareable
- Animate badge unlocks with celebration
**Effort:** Small — extends existing progress system
**Files:** `src/stores/learning-progress-store.ts`, new `src/components/learn/BadgeDisplay.tsx`

### 3.2 Dasha Transition Alerts
**What:** "You enter Jupiter Antardasha in 21 days — here's what to expect."
**Why:** Deeply personal, high-value. Users mark their calendar for this.
**Implementation:**
- Scan user's dasha timeline for upcoming transitions (next 90 days)
- Dashboard alert card when transition is within 30 days
- Email notification 7 days before
- Link to dasha explanation + remedies
**Effort:** Medium — needs dasha scanning + notification scheduling
**Files:** `src/components/dashboard/DashaTransitionAlert.tsx`

### 3.3 Eclipse Countdown Homepage Widget
**What:** Small widget on homepage/dashboard: "Next visible eclipse: Aug 12, 2026 (128 days). It falls in YOUR 10th house."
**Why:** Eclipses are high-interest events. Countdown creates anticipation.
**Implementation:**
- Already built as `EclipseAlert` on dashboard
- Add to homepage as well
- Make countdown more prominent with visual timer
**Effort:** Small — extend existing component
**Files:** `src/app/[locale]/page.tsx` (homepage)

### 3.4 Personalized Festival Relevance
**What:** Tag festivals with personal significance: "This Ekadashi falls in your Janma Nakshatra — extra auspicious for you."
**Why:** Makes generic calendar deeply personal.
**Implementation:**
- Cross-reference festival tithi/nakshatra with user's birth nakshatra/rashi
- Show relevance badge: "Personally significant" / "Standard observance"
- Highlight festivals where eclipse/transit coincides with natal positions
**Effort:** Medium
**Files:** `src/components/calendar/PersonalRelevanceBadge.tsx`

---

## Tier 4: Growth Channels

### 4.1 SEO: Structured Data for Contribution Pages
**What:** Add FAQ schema, Article schema, HowTo schema to learning pages.
**Why:** Rich snippets in Google → higher CTR → more organic traffic.
**Implementation:**
- FAQ schema for "Did you know?" questions
- Article schema with author, datePublished, dateModified
- BreadcrumbList schema (already have some)
- Course schema for the learning modules
**Effort:** Small
**Files:** Each page's `layout.tsx` or inline `<script type="application/ld+json">`

### 4.2 Email Onboarding Drip (7-Day)
**What:** After signup, 7 automated emails introducing the app's features.
**Why:** Converts signups into active users. Best practice for SaaS retention.
**Implementation:**
- Day 1: "Welcome! Here's your Kundali" (if birth data provided)
- Day 2: "Today's Panchang — explained in 2 minutes"
- Day 3: "Did you know Sine is Sanskrit? 10 Indian discoveries that changed the world"
- Day 4: "Your upcoming eclipses — personalized analysis"
- Day 5: "Learn Vedic Astrology — start Module 1.1"
- Day 6: "Your Dasha period — what it means for your next 5 years"
- Day 7: "Share Dekho Panchang with family — they deserve cosmic guidance too"
- Use Resend (already integrated) with scheduled sends
**Effort:** Medium — content creation + Resend drip setup
**Files:** `src/lib/email/onboarding-drip.ts`, 7 email templates

### 4.3 Google Discover / Social OG
**What:** Optimized OG images + article metadata for Google Discover and social sharing.
**Why:** Google Discover drives massive traffic to "Did you know?" style content.
**Implementation:**
- Dynamic OG images for all contribution pages
- Article structured data
- Compelling titles and descriptions optimized for Discover
- Image aspect ratio 1200x630 for social, 1200x800 for Discover
**Effort:** Medium
**Files:** OG image routes for each contribution page

### 4.4 YouTube Shorts / Reels Content
**What:** 60-second "Did you know?" videos from contribution page content.
**Why:** Short-form video is the highest-growth content format. Each video links to app.
**Implementation:**
- Script 14 videos (one per contribution page)
- Simple format: text on dark background, key visuals, Dekho Panchang branding
- CTA: "Full story + interactive timeline → dekhopanchang.com"
- Can be generated programmatically from page content
**Effort:** Medium (content creation, not code)

---

## Implementation Order

### Week 1 (Quick Wins)
1. ✅ 1.2 WhatsApp Share Button
2. ✅ 1.1 Daily Learning Streak
3. ✅ 2.3 Challenge a Friend Quiz Share
4. ✅ 3.1 Learning Badges + Levels

### Week 2 (Daily Hooks)
5. ✅ 1.3 Festival Countdown + Reminders
6. ✅ 3.3 Eclipse Countdown Homepage Widget
7. ✅ 1.4 Morning Briefing Dashboard Card

### Week 3 (Sharing)
8. ✅ 2.1 Share Cards for Contributions
9. ✅ 2.2 Shareable Kundali Summary
10. ✅ 2.4 Your Week Ahead

### Week 4 (Retention + Growth)
11. ✅ 3.2 Dasha Transition Alerts
12. ✅ 3.4 Personalized Festival Relevance
13. ✅ 4.1 SEO Structured Data
14. ✅ 4.2 Email Onboarding Drip

### Week 5+ (Growth)
15. ✅ 4.3 Google Discover OG images
16. ✅ 4.4 YouTube Shorts content

---

## Metrics to Track

| Metric | Current | Target (3 months) |
|--------|---------|-------------------|
| Daily Active Users | ? | 3x current |
| Learning module completions/week | ? | 500+ |
| Streak users (3+ day streak) | 0 | 20% of active users |
| Social shares/week | ~0 | 100+ |
| Email open rate | N/A | 40%+ |
| Quiz challenge completions | 0 | 50/week |
| Push notification opt-in | 0% | 30% of users |

---

## Technical Dependencies

- **Resend** (email) — already integrated ✅
- **Service Worker** (push notifications) — already exists ✅
- **Learning Progress Store** (streaks, badges) — already exists ✅
- **Kundali computation** (personalization) — already exists ✅
- **Transit computation** (weekly forecast) — already exists ✅
- **Festival calendar** (countdown, reminders) — already exists ✅
- **Eclipse engine** (countdown, alerts) — already exists ✅
- **@vercel/og or Satori** (OG images) — already used for some pages ✅

Most engagement features build on infrastructure we ALREADY have. The gap is mainly in the presentation layer and notification scheduling.
