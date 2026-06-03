# Personas & User Journeys — Dekho Panchang

**Last updated**: 2026-06-03
**Owner**: product strategy
**Audience**: anyone making a roadmap decision on what to build, write, or remove

---

## TL;DR (60-second read)

Three personas use Dekho Panchang. We currently treat them as one.

1. **Pandit / jyotishacharya** — paying-client consultations, time-pressed, citation-driven. We are the engine for them; we lack the artifact (printable PDF report). **~2% of traffic but the trust amplifier.**
2. **Informed enthusiast** — self-taught for 2-10 years, wants depth on their own chart. Patrika serves them; transit alerts + sharable yoga cards would multiply them. **~25-30% of traffic, vocal evangelists.**
3. **Complete beginner** — first exposure, mobile-first, jargon-shy, often anxious. We let them down with jargon walls and no Beginner mode. **~65-70% of traffic, mass-discovery funnel.**

**The single highest-leverage move**: a persona mode setting (Beginner / Enthusiast / Acharya) that persists across visits and tailors every surface. The `kundali-view-mode` localStorage already exists at `src/app/[locale]/kundali/Client.tsx:397`; promoting it to a 3-mode sitewide preference is **1-2 weeks**, not a quarter. Every other recommendation depends on or benefits from this.

After mode setting, in order: verdict badges everywhere (3-5d), weekly transit digest email (2w), rule-citation badges on muhurta (1w), glossary-on-tap (1-2w), sharable cards (1w), PDF consultation report (3-4w), module→chart deep-link (2-3w), family synastry (3-4w), locale-register (4-6w).

The traffic % splits are rough estimates — replace with analytics in v2 of this doc.

---

## Why this doc exists

We have grown a feature set that is already richer than most commercial sites — ~185 runtime yoga detection rules (with detailed content pages for ~100), full Jaimini + KP, Tajika varshaphal, Prashna, regional calendars in 9 languages. The risk now is not under-building, it is **building for the wrong reader**.

Three readers visit `/kundali` and each sees the same page:

- A **jyotishacharya** preparing for a paid consultation in 20 minutes.
- An **informed enthusiast** who has read three Vedic astrology books and wants to find every yoga in their own chart.
- A **complete beginner** who just typed *"what is my rashi"* into Google and landed here by accident.

Today we hand all three the same thing: a deep technical chart, a 17-tab patrika, a side panel of advanced controls. The pandit thinks it is impressive but wishes it were terser. The enthusiast is delighted but lost on first visit. The beginner closes the tab.

This document defines who those three readers are, what they are actually trying to accomplish on a given visit, where our current product helps them, where it gets in their way, and the PR-shaped work that would close each gap.

**How to use this doc**:
- Before adding a feature, ask: which persona is it for, and which journey?
- Before changing a page, check the journeys that touch it.
- Before writing copy, pick a single persona and write to them — broad copy that "speaks to everyone" speaks to no-one.
- Treat the "Sized work" entries as candidate PRs, not commitments.

---

## Cross-persona principles

These hold across all three personas and are worth stating once.

### 1. The Patrika vs Expert tab is the single most important UI signal we ship

The kundali page already has the right axis: a Patrika (narrative) view and an Expert (technical) view. The problem is that this is buried inside the tab strip and most beginners never discover Patrika exists. The same axis maps cleanly to our three personas:

| Persona | Default view |
|---|---|
| Beginner | Patrika narrative, Expert hidden |
| Enthusiast | Patrika + Expert tabs, no preset |
| Pandit | Expert default, Patrika hidden or collapsed |

Promoting this from a tab strip to a **persistent persona setting** (cookie or auth-bound) is the single highest-leverage move in this doc. Every journey below either benefits from it or assumes it.

### 2. Mobile is the dominant device for the long tail

Indian traffic skews mobile (~60-70% on most Indian-vertical sites; verify with our analytics). Our Daily Panchang, Choghadiya, Sade Sati, and Sign Calculator surfaces are mobile-first today. Our Kundali Expert mode is desktop-first and degrades visibly on mobile — the personas most likely to use Expert (pandit) skew desktop, which has masked the issue, but the enthusiast on mobile bounces.

### 3. "What does this mean for me?" is the universal moment of truth

Every persona, at some point in every journey, hits a Sanskrit term they don't fully understand and asks *"what does this mean for me?"*. The site that wins is the one that answers that question on the same page, in their language, without making them leave for `/learn`. We do this well in Patrika but not in Expert.

### 4. Locale ≠ persona, but it shapes vocabulary

The 9 locales cut across all three personas. A pandit reading Hindi expects classical Sanskrit-loan vocabulary (विष्टि, गण्डान्त). A beginner reading Hindi expects Hinglish vocabulary (शुभ टाइम, अच्छा दिन). Same persona, same locale, different register. We do not handle register today — we render the same Hindi string to both.

### 5. The Brihaspati AI changes the economics of the beginner segment

If a beginner can ask Brihaspati in their natural language and get a friendly answer, the rest of our complex pages become optional rather than required. Brihaspati is currently positioned as a paywalled depth tool; for beginners it is also a translation layer. That dual role is worth exploring.

---

## Persona 1 — Pandit / Jyotishacharya

### Profile

- **Who**: traditional astrologer, Sanskrit-trained scholar, or temple/community ritualist who advises clients. May have a small private practice (3-30 clients/month), may consult for a temple committee, may produce wedding-match reports for a fee.
- **Age**: 35-70
- **Languages**: Hindi or a regional language first; English-comfortable but not preferred for technical work. Sanskrit comfortable for citations.
- **Geography**: India predominantly; diaspora pandits in US/UK/UAE/Australia.
- **Training**: years of guru-shishya study OR a formal Jyotish degree (acharya/jyotishacharya). May be trained in Parashari, Jaimini, KP, Nadi, or some combination.
- **Tech literacy**: variable — many use WhatsApp + traditional ephemeris books; younger pandits use modern apps as a calculation aid. Almost none read JSON or care about TypeScript.
- **Device**: desktop for client-facing work (laptop on a desk during consultation); mobile for quick lookups while away from the desk.
- **Time-of-day patterns**:
  - 04:30-06:00 — daily panchang for personal sadhana (Brahma Muhurta)
  - 07:00-10:00 — morning consultations
  - 14:00-18:00 — afternoon consultations + planning evening pujas
  - 20:00-22:00 — preparing tomorrow's muhurta recommendations

### Goals

1. **Be right**. A wrong muhurta or a missed dosha is reputational damage that compounds across their client network.
2. **Cite the source**. *"Phaladeepika says..."* carries weight in their world. Computation without classical anchoring is useless to them.
3. **Save time per consultation**. A 30-minute consultation that takes 30 minutes to prepare is unprofitable.
4. **Produce something for the client to take home** — handwritten note, printed report, PDF.
5. **Verify against their own intuition**. They are not learning Jyotish from us; they are using us as a fast calculator. If our output contradicts their gut, they will trust their gut and stop trusting us.

### Anti-goals

- Being talked down to.
- Beginner explanations cluttering the screen ("Mars is the planet of energy" — they know).
- Marketing copy on a results page.
- An "ask AI" button next to a Shadbala table they computed by hand 20 years ago.
- Anything that suggests we know Jyotish better than they do.

### Monetization profile

- **Subscription unlikely to convert** unless it removes a friction they feel daily (e.g., PDF export, bulk muhurta scan, faster Brihaspati).
- **API/embed licence is the real prize** — a pandit who runs a small practice with a website would pay for an authoritative panchang widget they can embed.
- **One-time printable client reports** — a paid PDF per client chart, ₹49-299, is a plausible business.
- **Trust signal**: name a few pandits as advisors on /about; this segment values endorsements they recognise.

### Brand role for us

This is the **trust amplifier** segment. If 50 working pandits regularly recommend us to clients ("yeh website ka calculation accha hai"), we gain 5000 indirect users. If one prominent pandit publicly criticises a calculation, we lose far more. The asymmetry justifies designing for them even if they are <2% of traffic.

### What we are already great at for pandits

- **Engine accuracy**: Swiss Ephemeris + verified algorithms; we are within 1-2 min of reference sources.
- **Multi-system**: Parashari + Jaimini + KP + Tajika all present.
- **Classical references**: tippanni cites BPHS / Phaladeepika by chapter for many findings.
- **Prashna Ashtamangala**: differentiated Kerala-tradition tool.
- **Sade Sati phases with classical remedies**.

### Where we currently let pandits down

- The Expert tab still includes beginner copy ("Mars is energy") that the pandit must scroll past.
- The PDF export is a poster card, not a multi-page consultation report.
- No bulk muhurta scan (enter a 30-day window, see top 5 windows for activity X).
- The Drishti / dignity overlay is brilliant but is not explained to a pandit in classical vocabulary.
- Ayanamsha switching is hidden behind a settings drawer; Lahiri is correct as default but a Drik-following pandit needs the toggle within 1 click.
- No "save chart with consultation notes" — the dashboard saves charts but does not let the pandit annotate them.

### Journeys

---

#### J1.1 — Walk-in muhurta consultation, 5-minute turnaround

**Trigger**: Client phones at 14:30. *"Pandit-ji, my son needs a mundan ceremony this Saturday. What is the best time?"*

**Mental state at start**: alert, pressed for time, client is waiting on the line, will quote the muhurta verbally and confirm tomorrow.

**Context**: desktop, possibly with the ephemeris book open as a backup.

**Journey**:

1. Pandit opens a new tab → types `dekhopanchang.com/muhurta-ai` (he has it bookmarked).
2. Selects activity *Mundan / Chudakarana*. Thinks *"do we have this activity? if not I'll use sacred-thread"*.
3. Enters the date — Sat 7 Jun 2026 — and city — Pune.
4. Page returns: 3 candidate windows scored, each with a one-line reason.
5. Pandit scans for: which nakshatra, which tithi, any Vishti, any Rahu Kaal overlap, what is Saturn doing.
6. He picks the best window and confirms to the client: *"10:42 to 11:36 IST, Pushya nakshatra, Tritiya, no Vishti."*
7. He hangs up, screenshots the result, and pastes it into the family's WhatsApp group as a record.

**Current product reality**:

- `/muhurta-ai` exists and scores by multiple factors (✅).
- Mundan is in the activity catalog (verify).
- The result already shows the top window with a score breakdown.

**Gap**:

- The one-line *reason* is sometimes generic ("Auspicious window") rather than the classical rule that fired ("Pushya nakshatra, no Vishti, Moon-Jupiter trine"). The pandit cannot cite a generic reason.
- No screenshot-optimised view — the current card is dark-themed and not designed to be pasted into WhatsApp as evidence.
- The "Vishti/Bhadra" exclusion check is present but not surfaced as a badge.

**Outcome metric**: time-to-first-window-quote < 60 seconds; pandit returns to `/muhurta-ai` ≥3 times in the next 7 days.

**Sized work**:
- **PR-A**: add a "Why this window" rule-citation list under each scored slot (Pushya = +X, no Vishti = +Y, Wednesday Abhijit ineligible = -Z, etc.). Pulls from the existing rule engine; surfaces what is already computed.
- **PR-B**: a "share as image" button that renders the recommendation as a 1080×1080 card with the citation and a small Dekho Panchang watermark. Low effort, high pandit-loyalty payoff.

---

#### J1.2 — Generate + print a full natal report for a paying client

**Trigger**: A client paid ₹2100 for a natal consultation and is coming in tomorrow. Pandit needs a 15-20 page artifact to hand them at the end.

**Mental state at start**: methodical, perfectionist. *"This is the artifact that says my consultation was worth paying for."*

**Context**: desktop, evening session at home (20:00-22:00).

**Journey**:

1. Goes to `/kundali`, enters the client's birth details, hits generate.
2. Switches to **Expert mode**.
3. Toggles chart style to **South Indian** (his school's preference).
4. Reviews the Shadbala table — verifies each planet's strength bucket matches his memorised reference.
5. Reviews divisional charts D1, D9, D10, D60 side-by-side.
6. Reads the tippanni → flags 3 yogas to discuss with the client.
7. Looks at the dasha tree → notes the current Antar-Pratyantar.
8. Hits "Save chart" → wants this saved under client's name with a tag.
9. Hits Print → wants a PDF that includes everything he reviewed, not just the poster.
10. Realises the PDF is a poster card and the technical sections are not in it. Either screenshots each section into a Word doc (current workflow) or opens a separate kundali software for the printable.

**Current product reality**:

- Expert mode + South Indian style + all 25+ modules: ✅.
- Save chart to dashboard: ✅ but no client-name field, just a default name.
- Print: ❌ only renders the poster card.

**Gap**:

- The end-of-session **printable report** is the single biggest gap for this persona. Without it, the pandit's workflow stays in another tool, and our excellent compute engine is bypassed at the moment of monetisation.
- No client-name / consultation-date metadata on saved charts.
- No "Acharya Mode" that suppresses beginner copy in the technical sections.

**Outcome metric**: pandit prints / shares ≥1 PDF per saved chart; weekly active pandits with print events > 0.

**Sized work**:
- **Spec-needed**: a 12-20 page A4 printable consultation report. Sections: cover (with client name + sankalp date), Patrika summary, all 6 chart styles, Shadbala, dashas, yogas, doshas with remedies, Rashi-by-rashi karaka analysis, sealed pandit signature panel. Two-week effort minimum; specify a v1 with 6-8 sections.
- **PR**: add a "client name" + "consultation date" field on the save dialog.
- **PR**: an Acharya Mode toggle in user settings that hides beginner explanations from Expert sections.

---

#### J1.3 — Horary (Prashna) for a difficult client question

**Trigger**: A client asks *"Will the Mumbai property deal close before Diwali?"* and the pandit notes the exact moment of the question.

**Mental state at start**: focused, treating the prashna moment as sacred (Kerala tradition). The question is a real money decision; the answer will be quoted.

**Context**: desktop, immediate (within minutes of the question).

**Journey**:

1. Goes to `/prashna-ashtamangala`.
2. Enters the prashna moment + the consultation city (Pune, not Mumbai — the consultation location, not the property location).
3. Reviews the lagna of the prashna chart, the Arudha, the 7 sahams (Punya, Vidya, Yashas, Mitra, Vivaha, Karma, Roga).
4. Reads the verdict.
5. Verifies the verdict against his own reading of the prashna chart.
6. Quotes the answer with a caveat ("the planetary indications suggest yes, with completion after Sept 15 — but Mars hovering on the 7th cusp adds uncertainty").

**Current product reality**:

- Ashtamangala Prashna is implemented with Kerala tradition (✅).
- This is **differentiated content** — almost no free tool offers this.

**Gap**:

- Verdict could be more declarative for the pandit who wants to verify, not learn. Currently the wording skews educational.
- No "prashna history" log — pandits would love to compare 6 months of prashnas against actual outcomes (a learning loop for them, validation for us).

**Outcome metric**: prashna runs per pandit > 1/week; prashna-history reload events > 0.

**Sized work**:
- **PR**: more concise verdict mode for Expert users.
- **Feature**: prashna history with a "what actually happened?" annotation field (sets up a future ML signal too).

---

#### J1.4 — Annual Varshaphal (Tajika) for repeat client

**Trigger**: A long-standing client's solar return is next week. Pandit has been doing their annual chart for 7 years.

**Mental state at start**: confident, this is routine work, but the client expects fresh insights every year.

**Context**: desktop, prepared session.

**Journey**:

1. `/varshaphal` → loads the client's saved natal chart.
2. Picks the solar year (e.g., 2026-27).
3. Reviews: Muntha placement, Lord of the Year (Varshesh), Mudda Dasha sequence, the 32 sahams.
4. Compares this year's Muntha-Lord interaction with last year's notes (if he had them).
5. Drafts the annual reading.

**Current product reality**:

- Full Tajika engine: Muntha, Sahams, Mudda Dasha, Yearly chart, classical predictions (✅).

**Gap**:

- No year-over-year comparison view ("last year vs this year").
- No annotation persistence across consultations.

**Outcome metric**: varshaphal repeat usage on same chart in successive years.

**Sized work**:
- **Feature**: year-over-year diff view in `/varshaphal` (probably 1-2 weeks).
- **Feature**: per-chart consultation notes timeline.

---

#### J1.5 — Birth-time rectification (the hardest journey)

**Trigger**: A client says they were born on Tuesday at 6:30 AM but does not feel like their life matches the chart. Pandit suspects birth-time rectification is needed — narrow the actual minute by working backwards from known life events.

**Mental state at start**: investigative, slow, this is craft work.

**Context**: desktop, dedicated 30-60 minute session.

**Journey**:

1. Opens two `/kundali` tabs with two candidate times (e.g., 06:18 and 06:42).
2. Switches to **Expert mode** on both.
3. Compares D9, D10, D60 between the two charts.
4. Cross-checks: which lagna lord gives more sensible Vimshottari periods around major life events (marriage in 2014, job change in 2019)?
5. Picks the more likely time, possibly bisects further.

**Current product reality**:

- A-vs-B chart comparison: **not first-class**. Pandit opens two tabs and eyeballs.
- No rectification tooling.

**Gap**:

- This is a meaningful gap. Birth-time rectification is high-skill, paid work for pandits, and we have all the compute to support a dedicated tool. JHora-style users may switch to us if we ship this.

**Outcome metric**: rectification tool usage; saved rectifications per user.

**Sized work**:
- **Spec needed**: rectification workspace. Input: candidate birth-time range + 3-7 known life events with dates. Output: ranked list of candidate exact times by likelihood (Vimshottari period match score). 4-6 week effort, but defining feature for pandits.

---

#### J1.6 — Sade Sati for an anxious elderly client

**Trigger**: 68-year-old client worried that Saturn is "doing something" to her. Family is pressuring her to do remedies.

**Mental state at start**: needs to be authoritative and reassuring. Wants the science (transit dates) + the prescription (mantra count, vrat days, offerings).

**Context**: phone consultation; pandit checks while talking.

**Journey**:

1. `/sade-sati` → enters DOB.
2. Sees current phase + phase-end date.
3. Cites classical remedies — Shani Sade Sati specific mantras, oil bath on Saturdays, etc.
4. Suggests the client visit a Shani temple on a specific date during the peak phase.

**Current product reality**:

- Sade Sati calculator with phases: ✅
- Classical remedies: present but generic.

**Gap**:

- Remedies are listed but not customised to the specific phase (peak vs setting-out vs ending). Each phase has different traditional remedies.
- No "next Shani-related muhurta near you" feature that would extend this into action.

**Sized work**:
- **PR**: phase-specific remedy section in `/sade-sati`.
- **Idea**: temple-finder via OSM Nominatim API (we already use Nominatim for location).

---

#### J1.7 — Daily personal sadhana check (early morning)

**Trigger**: 04:45, pandit just finished pranayama, opens phone to check today's panchang before sankalp.

**Mental state at start**: calm, ritual mode. Not looking for a feature — looking for a clean read.

**Context**: mobile, dark mode, possibly with reduced eye strain.

**Journey**:

1. Opens app/PWA on phone.
2. Sees today's tithi, nakshatra, yoga, karana, vara at a glance.
3. Notes Brahma Muhurta window (already past, sankalp is the relevant marker now).
4. Notes if today is Ekadashi (fast) or any vrat day.
5. Closes the app — total elapsed time: 10 seconds.

**Current product reality**:

- Mobile panchang loads ~600ms TTFB.
- 5 panchang cards are present and readable.
- Daily Cosmic Briefing narrative is present.

**Gap**:

- The Cosmic Briefing is friendly, beginner-oriented. The pandit does not need *"The Moon transits through Purva Ashadha today — The former invincible one"* — he needs the classical fact only.
- No "Acharya Mode" on the briefing.
- Wednesday Abhijit was being shown as Best Window until 2026-06-03 (fixed in PR #377). The pandit would have noticed immediately and lost trust.

**Outcome metric**: daily mobile visits from saved-pandit accounts.

**Sized work**:
- Mode-aware briefing: Beginner gets the narrative, Acharya gets a classical table.

---

#### J1.8 — Quick festival date verification (during conversation)

**Trigger**: Mid-conversation with a client. *"Pandit-ji, when exactly is Diwali this year?"*

**Journey**:

1. `/festivals/diwali/2026` on phone (already bookmarked).
2. Notes: Lakshmi puja muhurat 18:45-20:25 in the client's city.
3. Quotes immediately.

**Current product reality**:

- Festival pages with city-specific muhurta: ✅.

**Gap**:

- For the pandit, the city dropdown is sometimes a friction (they want their saved location). Auth-bound location persistence would help.

---

### Pandit persona — summary takeaways

- **Biggest single gap**: a real multi-page printable client report (J1.2 unblocks consultation monetisation).
- **Biggest delight**: rectification tool (J1.5) — currently nobody offers this for free; we have the compute.
- **Highest-frequency**: muhurta lookups (J1.1) — small improvements here compound across daily use.
- **Most authority-building**: rule-citation badges on muhurta + prashna verdict tightening.
- **Trust risk**: any classical exclusion we miss (Wednesday Abhijit, Vishti) will be noticed first by this segment.

---

## Persona 2 — Informed Enthusiast

### Profile

- **Who**: a curious, self-directed learner who has been engaging with Vedic astrology for 2-10 years. Reads B.V. Raman, K.N. Rao, Sanjay Rath, or modern Western Jyotish authors (Komilla Sutton, James Braha). Watches Pundit Mahesh, Dr. Bali, Ksitij Singh on YouTube. May have done a short certification.
- **Age**: 25-55
- **Languages**: English most often; bilingual with Hindi or regional language. Comfortable with Sanskrit transliterated terms.
- **Geography**: India + global diaspora (US/UK/AUS/SG/UAE). Significant US/UK Indian-American + spiritual-curious Western users.
- **Tech literacy**: high. Comfortable with multiple tabs, screenshots, can read a chart, may have tried free apps before landing here.
- **Device**: 50/50 desktop and mobile. Desktop for deep sessions, mobile for transit checks.
- **Time-of-day patterns**: episodic. Spike around major personal events (job interview, marriage, birth, relocation), Saturday astrology-content binges, weekly transit checks.

### Goals

1. **Understand their own chart deeply** — not learn Jyotish from scratch, but make sense of *their* configuration.
2. **Verify what other tools / pandits told them** — cross-check.
3. **Find every yoga / dosha that applies to them** — the more obscure the better.
4. **Watch transits affecting their dashas** — especially Saturn, Rahu, Jupiter on natal points.
5. **Make personal decisions** with astrological input (job, relocation, marriage, surgery date).
6. **Share their chart highlights** in WhatsApp groups, Reddit threads.

### Anti-goals

- Being told what to think rather than shown the rule.
- Pop-astrology personality framing (*"Mars in Scorpio means you're intense!"*).
- Paywalls in front of basic interpretation.
- Missing a yoga they had to find on a competitor site.
- Generic horoscope-by-rashi content (they want their *birth* chart, not their Moon sign).

### Monetization profile

- **Subscription is plausible** at the right price (₹199-499/month) if it unlocks: ad-free, unlimited Brihaspati questions, advanced transits, saved family charts.
- **One-time deep-dive reports** (₹499-1499) work — e.g., "Career arc 2026-2030" report, "Marriage probability window" report.
- **Family member charts** — once they save one, they want to save spouse + parents + kids. The "saved kundali" surface is the retention engine here.

### Brand role for us

This is the **vocal evangelist** segment. They post screenshots in WhatsApp groups and tag us on Twitter when something is good. Their TG (target group) overlaps with the discovery channel (referral + organic search), so winning them compounds.

### What we are already great at for enthusiasts

- **~185 runtime yoga detection rules + ~100 detail pages** — most free tools cover 30-50. (Source: `src/lib/kundali/yogas-complete.ts`, `src/lib/constants/yoga-details.ts`.)
- **Patrika narrative** — translates technical findings into "what does it mean for you".
- **Transits + Sade Sati personalised** — the personal transit radar is genuinely differentiated.
- **Full Jaimini + KP + Tajika** — enthusiasts who have read about these but never tried them get a sandbox.
- **Regional calendars** — Bengali, Marathi, Maithili speakers feel seen.
- **Learn curriculum** — 242 modules; they can deepen their knowledge.

### Where we currently let enthusiasts down

- **Onboarding**: first-time `/kundali` is overwhelming. There is no "your top 5 chart insights" landing card.
- **Personalised learn**: the `/learn/` modules use generic examples, not the user's own chart. Linking modules to their saved chart would be a major step up.
- **Transit alerts**: the personal transit radar exists but does not push the user a notification when a major transit is 7 days out. Without alerts, they have to remember to come back.
- **WhatsApp-friendly share**: no 1080×1080 sharable card for "I have Gajakesari Yoga".
- **Family charts** — dashboard supports saving but the linking ("my chart vs spouse") is shallow.
- **Compatibility narrative** — the matching tool returns a score and a kuta breakdown but does not give the interpretive narrative this segment craves.

### Journeys

---

#### J2.1 — First-ever full-chart deep dive (45-90 minute session)

**Trigger**: A friend casually mentioned *"you have Vargottama Lagna, that's a big deal"*. The enthusiast wants to verify and find everything else they might have.

**Mental state at start**: excited, settled in for a long session, has tea.

**Context**: desktop, evening.

**Journey**:

1. `/kundali` → enters birth details carefully (they have looked up the exact time in the hospital book).
2. Lands on Patrika tab — reads top-level summary, scans for the words "Vargottama" and "Yoga".
3. Finds Vargottama Lagna mentioned ✅ — small dopamine hit. Reads the explanation. Cross-references against what their friend told them.
4. Scrolls through every yoga section, expanding each one. Reads about Gajakesari (they have it!), Mahabhagya (they don't), Vasumati (they do — googles it).
5. Reads the doshas section. They have mild Mangal Dosha. Reads cancellations. Decides it does not really apply to them.
6. Clicks Expert mode out of curiosity. Confused by the 17 tabs. Closes back to Patrika.
7. Reads about their current dasha — Saturn Mahadasha, Mercury Antar. Reads the interpretation.
8. Scrolls to Sade Sati section — they are mid-Sade Sati. Notes the end date.
9. Screenshots the Vargottama Lagna paragraph and shares it in the family group.
10. Bookmarks the page. Returns 3 days later.

**Current product reality**:

- All steps 1-8 work; this is the journey we serve best today.
- Expert mode is overwhelming on first visit (step 6).
- No share-card for step 9 (they screenshot).

**Gap**:

- **Onboarding paragraph**: a 3-line "your chart's top 5 highlights" at the top of Patrika would convert step 2 into a hook. Currently the top of Patrika is title + birth details, not the interesting findings.
- **Expert-mode-onboarding**: a "first time in Expert?" callout that highlights the 3 most-used tabs (Shadbala, Vargas, Dashas) and lets the user dismiss it.
- **Sharable card**: 1080×1080 Vargottama Lagna card (or Gajakesari card, etc.) generated on demand. Already we have BirthPosterCard infrastructure.

**Outcome metric**:
- Time-on-page > 20 minutes for new kundali visitors.
- Share-card generation events > 0.
- Return visit within 7 days > 25%.

**Sized work**:
- **PR**: Patrika top section — "5 highlights of your chart" auto-extracted from the strongest yogas + doshas + current dasha. 1 week.
- **PR**: per-yoga share card (re-uses BirthPosterCard machinery). 1 week.
- **PR**: Expert mode onboarding tour (intro.js or just a dismissible callout). 1 week.

---

#### J2.2 — Weekly transit check

**Trigger**: Saturday morning routine. *"What's happening in the sky this week?"*

**Mental state**: relaxed, curious.

**Context**: mobile.

**Journey**:

1. Opens app/PWA. Goes to Dashboard.
2. Sees today's panchang + their personal transit radar.
3. Scans key dates feed: *"11 Jun — Jupiter enters Virgo (your 10th house) — favourable career period begins"*.
4. Clicks the Jupiter entry → reads what Jupiter in the 10th house means classically + for them.
5. Decides to plan a job application around that date.

**Current product reality**:

- Personal transit radar in dashboard: ✅.
- Key dates engine pulls major transits + dasha changes: ✅.

**Gap**:

- **No push/email alerts** — they have to remember to come check. Setting a calendar reminder for "11 Jun Jupiter in Virgo" is too much friction.
- The key dates feed is rich but not prioritised — every transit shows equal weight. The user wants the "top 3 transits affecting me this month" pinned.

**Outcome metric**:
- Weekly active users on dashboard > 40% of saved-chart users.
- Email-alert subscription rate, once added.

**Sized work**:
- **PR**: weekly digest email — top 3 personal transits for the next 14 days. Reuses key dates engine. 2 weeks (email template + cron + opt-in).
- **PR**: "pinned this month" filter on the key dates feed.

---

#### J2.3 — New relationship compatibility check

**Trigger**: 4 dates in. Things are getting serious. They have their partner's birth details from Instagram (or asked over dinner). Want to check before family gets involved.

**Mental state at start**: tense — outcome matters.

**Context**: laptop, evening, private.

**Journey**:

1. `/matching` → enters both birth details.
2. Sees Ashta Kuta score: 27/36.
3. Drills into each kuta — Bhakoot is poor, Gana is good, Nadi is okay.
4. Reads the Mangal Dosha cross-check — both have mild Mangal, mutual cancellation applies.
5. Wants narrative interpretation. *"Is 27/36 actually good? What does poor Bhakoot mean for daily life?"*
6. Scrolls to find the narrative — it is there but brief.
7. Opens Brihaspati AI → asks for a deeper take.

**Current product reality**:

- 36-point Ashta Kuta with full breakdown: ✅.
- Mangal Dosha cross-check: ✅.
- Brihaspati AI: ✅.

**Gap**:

- The **narrative** after the score is thin. Enthusiasts want a 2-3 paragraph "what this score means for your day-to-day, and what to be aware of given the weak kutas". Today they have to ask Brihaspati for this.
- No "compatibility timeline" — when are the difficult periods in the next 5 years where the weak kutas might trigger?
- No save-as-couple option — they cannot save the matching analysis for later return.

**Outcome metric**:
- Saved matching analyses per logged-in user.
- Time-on-page > 8 minutes.

**Sized work**:
- **PR**: post-score narrative section — 2-3 paragraphs auto-generated from the kuta scores. 1 week.
- **PR**: save matching analysis to dashboard.

---

#### J2.4 — Festival/vrat planner (regional identity)

**Trigger**: A Marathi user wants Ganesh Chaturthi 2026 planning. Pune family is coming for the festival.

**Mental state**: practical, planning mode.

**Context**: mobile.

**Journey**:

1. `/calendar/regional/marathi/2026` → sees the Marathi festival list.
2. Clicks Ganesh Chaturthi → sees date + significance + puja muhurat for Pune.
3. Decides to share the date with the family WhatsApp group.
4. Wants to set a calendar reminder.

**Current product reality**:

- Regional calendars in 4 traditions: ✅.
- Per-city puja muhurat: ✅.

**Gap**:

- **"Add to my calendar"** — no .ics export. Friction at the moment of intent.
- The Marathi-specific content depth varies — some festivals have richer narrative than others.

**Outcome metric**:
- .ics download events per regional festival page.
- Return visits to regional pages within 7 days of a festival.

**Sized work**:
- **PR**: .ics export per festival event. 3-5 days (need to handle city-specific puja times).

---

#### J2.5 — Self-education through `/learn`

**Trigger**: They want to actually understand Shadbala — not just see the table but learn the math.

**Mental state**: studious, will spend 30-60 minutes.

**Context**: desktop, with their notebook.

**Journey**:

1. `/learn` → finds Shadbala in module list.
2. Reads the theory section.
3. Wants to see Shadbala worked out on their own chart.
4. Goes back to `/kundali`, generates their chart, scrolls to Shadbala.
5. Sees the table — but the table is opaque. *"How did we get 8.2 for Sun in Sthana Bala?"*
6. Cross-references their notes from the module with the chart output.

**Current product reality**:

- Learn module exists (✅).
- Shadbala compute is correct (✅).
- The module and the chart output are not cross-linked.

**Gap**:

- **Module-to-my-chart binding**: the Shadbala module could include a "see this on your chart" link that opens the user's saved chart with the Shadbala tab pre-selected and an explainer overlay showing how each value was computed.
- The kundali Shadbala table needs "how was this computed?" hover-tooltips with the 6 sub-balas spelled out.

**Outcome metric**:
- Module-to-chart click-throughs > 30% of module-readers.

**Sized work**:
- **PR**: module → chart deep-link pattern, demonstrated on Shadbala first. 1-2 weeks.
- **PR**: Shadbala table tooltips with sub-bala breakdown. 3-5 days.

---

#### J2.6 — Personal muhurta for important event (surgery, interview, travel)

**Trigger**: Knee surgery scheduled. Doctor offered three dates. *"Which is most auspicious?"*

**Mental state at start**: anxious, decisive — outcome matters physically.

**Context**: laptop, evening, may also call family for second opinion.

**Journey**:

1. `/muhurta-ai` → selects activity *Surgery*.
2. Enters each of the three candidate dates.
3. Sees scores for each.
4. Picks the highest-scored date and asks doctor to schedule.
5. Notes the within-day window for the surgery start.

**Current product reality**:

- Multi-activity muhurta scoring: ✅.
- Surgery is one of the supported activities (verify).

**Gap**:

- The enthusiast wants the rule cited (same as pandit J1.1) — *why* is this date better?
- The rule citation is also a hedge — if the surgery goes well, we get credit; if not, the rule was the rule.

**Sized work**: same as PR-A in J1.1 (rule-citation badges) — single PR serves both personas.

---

#### J2.7 — Deep yoga study

**Trigger**: Stumbled on Neechabhanga Raja Yoga in a YouTube video. *"Do I have it?"*

**Journey**:

1. `/learn/yoga/neechabhanga_raja` → reads the explanation.
2. Clicks "Find this in my chart" → either present (yes/no) or absent flag.
3. If present → reads the personalised interpretation.
4. If absent → curious about which other Raja Yogas they might have.

**Current product reality**:

- ~100 yoga detail pages + ~185 runtime detection rules: ✅
- "Find in my chart" CTA: **partial** — they have to go to /kundali manually and search.

**Gap**:

- **Cross-link from yoga page to user's chart**: if the user is logged in with a saved chart, the yoga detail page should show "✓ You have this yoga, see your placement" or "✗ This yoga is not in your chart".

**Sized work**:
- **PR**: cross-link yoga detail → user's saved chart with the yoga highlighted. 1-2 weeks.

---

#### J2.8 — Ask Brihaspati a deep technical question

**Trigger**: They have read about Argala but the engine output is hard to parse. *"What does it mean that Saturn has primary argala on my 7th house?"*

**Journey**:

1. `/kundali` → Brihaspati floating button.
2. Asks the question in conversational English.
3. Gets a classical-grounded reply with citation.
4. Follows up with a second question.
5. Hits the daily / monthly free quota cap.

**Current product reality**:

- Brihaspati AI with classical grounding: ✅.
- Monetisation: paid-per-session via Stripe (current model). The legacy free-tier daily/monthly caps were removed from the subscription tier definitions (see `src/lib/subscription/tiers.ts` comment).

**Gap**:

- The paywall is the first conversion moment for the enthusiast — the messaging at that moment is the highest-value monetisation surface in the entire product.
- No "preview" / "first question free" hook for visitors who have never used Brihaspati. This blunts the funnel.

**Sized work**:
- **PR**: a "first question free" hook for anonymous + logged-in-but-never-paid users. Establishes the AI's value before asking for payment.
- **PR**: optimise the post-purchase experience so a satisfied buyer becomes a repeat purchaser (in-session follow-up question, conversation history).
- **Idea**: a "bundle of N questions for ₹X" option for users who want depth without subscribing.

---

#### J2.9 — Saving family charts (retention loop)

**Trigger**: They saved their own chart. Then they want to do their spouse's, parents', kids'.

**Journey**:

1. Dashboard → "Add family member" → enter details → save.
2. Switch between charts on dashboard.
3. Compare own dashas vs spouse's transit.

**Current product reality**:

- Multiple saved charts in dashboard: ✅.
- Family relationship tagging: partial (the data model supports it, the UI surfaces it loosely).

**Gap**:

- **Family analysis** is shallow. No "show me the days where my Saturn aspects my spouse's Moon" — the cross-chart synastry layer is light.
- No "child's first-name nakshatra check" linked from a saved family member.

**Sized work**:
- **Spec needed**: family chart bundle. Synastry overlay between two saved charts. 3-4 weeks.

---

#### J2.10 — Daily horoscope (habit visit)

**Trigger**: Morning routine, opens phone, checks horoscope.

**Journey**:

1. `/horoscope/mesh/2026-06-03` (their saved rashi).
2. Reads 2-3 sentence prediction.
3. Closes.

**Current product reality**:

- Daily horoscope per rashi: ✅.

**Gap**:

- The enthusiast wants the prediction *personalised to their chart*, not just their rashi. A "personalised daily insight" using their birth chart + transits would be a major differentiator.

**Sized work**:
- **Feature**: personalised daily insight for logged-in users with a saved chart. Builds on existing Personalization System. 2-4 weeks.

---

### Enthusiast persona — summary takeaways

- **Biggest single gap**: onboarding hook on Kundali first visit (the "5 highlights" card unblocks J2.1).
- **Biggest retention lever**: weekly digest email of personal transits (J2.2).
- **Biggest monetisation lever**: the Brihaspati quota cap conversion moment (J2.8).
- **Biggest delight**: yoga page ↔ user's chart binding (J2.7) — *"the site knows my chart"* moment.
- **Most under-served**: personalised daily horoscope (J2.10) — the segment is huge and we render generic content today.

---

## Persona 3 — Complete Beginner

### Profile

- **Who**: someone new to Vedic astrology this week. May have searched a festival date, a "what is my rashi" query, or been sent here by an Indian family member. May be Western with no prior context, may be Indian-origin who grew up away from the tradition.
- **Age**: 18-65 (no tight cluster).
- **Languages**: English, Hindi, Tamil, Telugu, Bengali, Gujarati, Kannada, Marathi, Maithili — any of the 9. **Often mixed**: Hinglish, Tanglish.
- **Geography**: ~70% India, ~20% Indian diaspora, ~10% Western curious.
- **Tech literacy**: variable, skews mobile-first. Comfortable with WhatsApp + Instagram, less comfortable with multi-tab desktop sessions.
- **Device**: mobile-dominant (80%+). Small screens.
- **Time-of-day patterns**: lunchtime curiosity, evening anxiety-driven sessions, weekend planning.

### Goals

1. **Get a quick answer** to a specific question (*"what is my rashi"*, *"when is Diwali"*, *"will I marry my partner"*).
2. **Feel in control** of a tradition that family/society pressures them about.
3. **Not feel stupid** for not knowing the terminology.
4. **Decide** about an action — pray today, fast next Thursday, get married in November.

### Anti-goals

- A wall of Sanskrit terms.
- A "register first" gate before getting their answer.
- A subscription pop-up before they have got value.
- Being made to feel like a tourist in their own tradition.
- Astrology presented as deterministic ("you WILL have a bad year").

### Monetization profile

- **Low direct revenue**: this segment does not pay for subscriptions in significant numbers.
- **Indirect revenue**: ads (AdSense), affiliate referrals to Rudraksha / gemstones / temple services.
- **The long arc**: a beginner today who returns weekly for 6 months may become an enthusiast tomorrow. The retention path matters more than immediate conversion.
- **Anti-pattern**: putting Brihaspati paywalls in front of beginner questions destroys the funnel.

### Brand role for us

This is the **mass-discovery** segment. They are 70%+ of organic traffic. SEO depends on serving them well. They do not generate revenue directly but their volume drives our Google authority + AdSense yield.

### What we are already great at for beginners

- **`/sign-calculator`** — single-purpose, fast, mobile-first.
- **Festival pages with date + significance** — answer the query in the first paragraph.
- **9-locale support** — they can read in their first language.
- **Daily Cosmic Briefing** — translates raw panchang into a friendly paragraph (Wednesday Abhijit aside).
- **`/sade-sati`** — clean phase visualisation with yes/no answer.

### Where we currently let beginners down

- **Kundali first visit is overwhelming**. The full Patrika is great if you commit; otherwise the page looks intimidating.
- **Sanskrit terms without glossary**. *"Tithi: Tritiya, Yoga: Shukla, Karana: Vishti"* on the panchang page — the beginner needs each word explained on hover or tap.
- **No Beginner mode** on `/kundali` — no way to hide Expert features.
- **`/matching` returns a score with no plain-language verdict**. *"27/36, Excellent"* would help; *"27/36"* alone confuses.
- **Daily horoscope** by rashi works but the user must know their rashi (often they don't).
- **No mobile-first navigation onboarding** — they land on the homepage and do not know where to go.

### Journeys

---

#### J3.1 — "What is my rashi?"

**Trigger**: A friend at lunch said *"Wait, you're Sagittarius? In Vedic you're probably Scorpio actually"*. They want to verify.

**Mental state at start**: mild surprise, ~30 seconds of attention budget.

**Context**: mobile, lunchtime.

**Journey**:

1. Google *"vedic rashi from date of birth"*.
2. Lands on `/sign-calculator`.
3. Enters DOB (no time needed for Moon rashi).
4. Sees *"Your Moon Rashi is Vrishchik (Scorpio)"* in 2 seconds.
5. Reads the one-paragraph explanation.
6. Either closes (story over) or clicks the next CTA (*"want your full chart?"*).

**Current product reality**:

- Sign calculator is single-purpose and fast: ✅.

**Gap**:

- **Conversion to next step** — after step 5, the CTA is present but generic. A *"want to know what your Vrishchik Moon means today?"* hook into `/horoscope/vrishchik` would convert better than a generic *"see your full chart"*.
- For first-time visitors, the home page is not visible from the sign-calculator — they have no sense of what else is here.

**Outcome metric**:
- Click-through from sign-calc to one more page > 25%.
- Sign-calc → horoscope conversion > 15%.

**Sized work**:
- **PR**: sign-calculator results page — add a "What does Vrishchik Moon mean today?" hook card linking to today's horoscope for that rashi. 3-5 days.

---

#### J3.2 — "When is Diwali this year?"

**Trigger**: Need to book leave from work. Lakshmi puja typically Tuesday-Wednesday of Diwali week.

**Mental state**: practical, 2-minute attention budget.

**Context**: mobile, work hours, on the side.

**Journey**:

1. Google *"diwali 2026 date"*.
2. Lands on `/festivals/diwali/2026`.
3. Sees the date prominently — *"8 November 2026"*.
4. Reads the puja muhurat for their city (geo-detected or asked).
5. Notes the dates, requests leave from manager.
6. Optionally — clicks to read the Diwali story.

**Current product reality**:

- Festival pages with city-specific muhurat: ✅.
- Hindi/multilingual content: ✅.

**Gap**:

- **The 5-day Diwali sequence** (Dhanteras, Chaturdashi, Lakshmi puja, Govardhan, Bhai Dooj) is not presented as a single sequence. The beginner needs to understand they all link together.
- **No "add to calendar"** — they have to manually create the calendar event.

**Sized work**:
- **PR**: Diwali (and Navratri, Pitru Paksha) multi-day sequence card showing all related dates inline. 1 week.
- **PR**: .ics export (also serves J2.4). 3-5 days.

---

#### J3.3 — "Today's panchang" (curiosity click)

**Trigger**: WhatsApp morning forward mentioned today's tithi or nakshatra. They want to see what it is.

**Mental state**: casually curious, 90-second attention budget.

**Context**: mobile.

**Journey**:

1. Google or app → `/panchang`.
2. Sees 5 cards (tithi, nakshatra, yoga, karana, vara) + daily briefing.
3. The 5 Sanskrit words are unfamiliar. Reads the briefing.
4. Briefing makes sense in plain English. Done.

**Current product reality**:

- 5 panchang cards: ✅.
- Daily Cosmic Briefing in plain English: ✅.
- Mobile rendering: good.

**Gap**:

- **Glossary on tap**: each of the 5 Sanskrit terms should have a tooltip/expandable explanation. *"What is a tithi?"* should answer in 1 sentence without leaving the page.
- **Audio pronunciation**: a beginner may not know how to pronounce *"Tithi: Tritiya"*. A play-button on each term ("Tritiya 🔊") would be unusual but lovable.

**Sized work**:
- **PR**: hover/tap glossary on each panchang card (1-line definition). 1 week.

---

#### J3.4 — "Is Saturn affecting me?" (anxiety-driven)

**Trigger**: Aunt at a family gathering said *"You're in Sade Sati! Do remedies, beta"*. They are mildly anxious and want to verify.

**Mental state**: anxious, want either confirmation or release.

**Context**: mobile, evening, in private.

**Journey**:

1. Google *"am i in sade sati"*.
2. Lands on `/sade-sati`.
3. Enters DOB.
4. Sees phase + start/end dates.
5. Reads remedies.
6. Either reassured ("I'm not in Sade Sati") or motivated ("I am, and these are the remedies").

**Current product reality**:

- Sade Sati calculator: ✅.
- Phases + remedies: ✅.

**Gap**:

- **Tone**. For an anxious beginner, the result page should lead with reassurance: *"Yes, you are in Sade Sati's second phase. This is a 7.5-year transit that most people experience twice in their lifetime. Here is what classical sources advise."* Today the tone is more clinical.
- **Phase-specific narrative**: the three phases (rising, peak, setting) have different lived experiences. Each phase deserves its own paragraph.

**Sized work**:
- **PR**: reassuring intro paragraph + phase-specific narrative. 1 week.

---

#### J3.5 — Baby name nakshatra check

**Trigger**: First-time parent. Family wants the baby's name to match the birth nakshatra. They are not sure how the rule works.

**Mental state**: emotionally invested, wants to do this right.

**Context**: desktop or tablet, evening, possibly with extended family present.

**Journey**:

1. Google *"baby name as per nakshatra"*.
2. Lands on `/baby-names/[nakshatra]` after entering baby's birth details.
3. Sees the 4 syllables for the nakshatra-pada.
4. Lists name candidates starting with those syllables.
5. Either picks a name or returns to negotiate with family.

**Current product reality**:

- Baby name tool with nakshatra-syllable mapping: ✅.

**Gap**:

- **The reverse lookup**: *"is the name we want compatible?"* — they have a name in mind, want to check if it matches. Today they have to figure out the syllable themselves and cross-check.
- **Name meaning database**: integrate a Sanskrit name meaning list (open licence).
- **Boy/Girl filter**: gender filter on candidate names.

**Sized work**:
- **PR**: name-to-nakshatra checker (input: name, baby's nakshatra; output: matches/doesn't match). 1-2 weeks.

---

#### J3.6 — "Are we compatible?" (anxiety-driven, high stakes)

**Trigger**: Family is pushing back on the partner choice. The beginner wants ammo.

**Mental state**: high stakes, defensive, wants a number to point at.

**Context**: mobile, evening, private.

**Journey**:

1. `/matching` → enters both birth details.
2. Sees score 27/36.
3. Wants to know: *"is 27 good?"*.
4. Looks for a verdict — *"Excellent"*, *"Good"*, *"Marginal"*.
5. If green: takes the screenshot, shares with mom.
6. If yellow/red: closes the tab, never returns.

**Current product reality**:

- 36-point Ashta Kuta: ✅.
- Kuta breakdown: ✅.
- **Traffic-light verdict**: missing or buried.

**Gap**:

- **A single-word verdict above the score** is essential for this persona. *"27/36 — Compatible"* or *"22/36 — Caution"*. They need this to know whether to share or hide.
- **Tone of the breakdown**: for marginal scores, the breakdown should not be alarming. *"Your Bhakoot is weak but..."* is more helpful than *"BHAKOOT: FAIL"*.

**Sized work**:
- **PR**: verdict word + colour above the score; tone audit on weak-kuta narrative. 1 week.

---

#### J3.7 — "Build my first chart" (curiosity)

**Trigger**: A friend posted a chart screenshot on Instagram. The beginner thinks it looks cool and wants their own.

**Mental state**: light, curious, 5-minute attention budget.

**Context**: mobile.

**Journey**:

1. `/kundali` → enters birth details.
2. Lands on the chart.
3. Sees a diamond they do not recognise (they expected the Western circle).
4. Scrolls to read what it means.
5. Hits the Patrika section — first paragraph either hooks them or they bounce.

**Current product reality**:

- Patrika narrative is good: ✅.
- Expert mode is overwhelming for this user.

**Gap**:

- **Beginner mode toggle** — make Patrika the default, hide all Expert tabs entirely.
- **Chart-style explainer** — a 1-sentence "this is the North Indian chart, here's how to read it" with a link to the recently-fixed help tooltip.
- **First-paragraph hook** — the Patrika top section should immediately say *"Your most striking feature: ..."*.

**Sized work**:
- **PR**: Beginner mode toggle in user settings. Promotes Patrika, hides Expert tabs. 2 weeks.
- **PR**: first-paragraph hook (overlaps with J2.1 "top 5 highlights").

---

#### J3.8 — Daily horoscope (habit-forming)

**Trigger**: They know their Moon rashi now (from J3.1). Set a habit of checking horoscope every morning.

**Journey**:

1. Bookmarked `/horoscope/vrishchik` or `/horoscope/vrishchik/2026-06-03`.
2. Reads 2-3 sentences.
3. Closes.

**Current product reality**:

- Daily horoscope per rashi: ✅.

**Gap**:

- **No email/push subscription** — they have to remember to come back.
- **No streak/habit gamification** — Duolingo proved this works for daily habits.

**Sized work**:
- **PR**: opt-in daily horoscope email per rashi. 2 weeks.
- **Idea**: a 7-day check-in streak indicator on the dashboard.

---

#### J3.9 — Festival significance (cultural curiosity)

**Trigger**: Akshaya Tritiya is being mentioned everywhere. They do not know what it is or why people are buying gold.

**Journey**:

1. Google *"akshaya tritiya 2026"*.
2. Lands on `/festivals/akshaya-tritiya/2026`.
3. Reads significance, why gold is bought, when to buy.
4. May buy gold or just learn.

**Current product reality**:

- Festival pages with significance + dates: ✅.

**Gap**:

- **Cross-link to related calendar surfaces** — a beginner who reads about Akshaya Tritiya may not know about Akshaya Tritiya muhurta for non-gold actions (marriage, business launch).
- **Personalised "should I do X today?"** — a logged-in user with a saved chart could see "today is auspicious for you to start a new project" tailored to their chart.

---

### Beginner persona — summary takeaways

- **Biggest single gap**: Beginner mode toggle on Kundali (J3.7) — collapses Expert noise.
- **Biggest retention lever**: daily horoscope email (J3.8).
- **Biggest engagement lever**: glossary-on-tap across panchang (J3.3).
- **Biggest conversion lever**: traffic-light verdict on matching (J3.6).
- **Biggest cultural-fit win**: tone of Sade Sati page (J3.4) — being reassuring instead of clinical.

---

## Cross-cutting product moves

These moves serve multiple personas at once. Sequencing them by leverage:

### 1. Persona mode setting (persists across visits)

- **Modes**: Beginner / Enthusiast / Acharya.
- **Persists**: anonymous (cookie/localStorage) and logged-in (user setting).
- **Default**: Enthusiast (the middle persona, least surprising).
- **Surfaces affected**: Kundali (most), Panchang briefing (medium), Matching (medium), Sade Sati (light).
- **Infrastructure already partly in place**: `kundali-view-mode` is already persisted to localStorage in `src/app/[locale]/kundali/Client.tsx:397`, with two values (`simple` and `expert`). Promoting this from a 2-mode kundali-local toggle to a 3-mode sitewide preference is the work, not net-new infrastructure.
- **Effort**: 1-2 weeks for v1 (sitewide context + 3-mode generalisation + branching in ~10 components). The OnboardingModal infrastructure in `src/components/auth/` can collect the mode on first visit.
- **Leverage**: every other recommendation in this doc depends on or benefits from this.

### 2. Rule-citation badges on muhurta + prashna

- **What**: every scored window shows the classical rule that drove the score.
- **Serves**: J1.1 (pandit muhurta), J1.3 (pandit prashna), J2.6 (enthusiast muhurta).
- **Effort**: 1 week. Engine already computes the rule; surface it.

### 3. Multi-page printable kundali report (PDF)

- **What**: A4 PDF with cover, Patrika, Shadbala, dashas, yogas, doshas, vargas, dasha calendar.
- **Serves**: J1.2 (pandit monetisation).
- **Effort**: 3-4 weeks for v1.
- **Monetisation tie-in**: ₹49-99 per generation, or unlimited under pandit subscription tier.

### 4. Personal transit weekly digest email

- **What**: opt-in weekly email per logged-in user: top 3 transits affecting them next 14 days.
- **Serves**: J2.2 (enthusiast retention), J3.8 (beginner habit).
- **Effort**: 2 weeks (email template + cron + opt-in UI).
- **Retention impact**: estimated +30-50% weekly active rate among saved-chart users.

### 5. Yoga/dosha sharable card (1080×1080)

- **What**: per-yoga or per-dosha share card generated on demand with the user's chart highlight.
- **Serves**: J2.1, J2.7 (enthusiast pride sharing), indirectly J3.7 (beginner brag).
- **Effort**: 1 week (reuses BirthPosterCard machinery).

### 6. Glossary-on-tap

- **What**: tap any Sanskrit term in panchang/kundali → 1-sentence definition + link to /learn/term.
- **Serves**: J3.3 (beginner), partially J2.5 (enthusiast self-education).
- **Effort**: 1-2 weeks (need a glossary dataset; many terms exist in /learn already).

### 7. Beginner-friendly verdicts everywhere

- **What**: traffic-light or single-word verdicts above scores on `/matching`, `/sade-sati`, `/muhurta-ai`.
- **Serves**: J3.4, J3.6.
- **Effort**: 3-5 days.

### 8. Module → user-chart deep-linking

- **What**: each /learn module that uses a technical concept (Shadbala, dashas, yogas) has a CTA opening the user's saved chart with the relevant section highlighted.
- **Serves**: J2.5 (enthusiast study).
- **Effort**: 2-3 weeks (template work + per-module wiring).

### 9. Locale-register awareness

- **What**: separate "scholarly" vs "Hinglish" register for Hindi (same key, two variants) chosen by persona setting.
- **Serves**: J1 (pandit), J3 (beginner) — same locale, different voice.
- **Effort**: 4-6 weeks. Lower priority but high authenticity payoff.

### 10. Family chart bundle + synastry

- **What**: save family members, view synastry overlays.
- **Serves**: J2.9 (enthusiast retention loop).
- **Effort**: 3-4 weeks.

---

## Prioritisation matrix

A rough impact × effort × strategic-fit ranking:

| Move | Personas served | Effort | Impact | Order |
|---|---|---|---|---|
| 1. Persona mode setting | All 3 | 1-2w | Foundational | **First** |
| 7. Verdict badges everywhere | J3 (beginner) | 3-5d | Mass-traffic conversion | Second |
| 4. Weekly transit digest email | J2, J3 | 2w | Retention | Third |
| 2. Rule-citation badges | J1, J2 | 1w | Pandit trust | Fourth |
| 6. Glossary-on-tap | J3, J2 | 1-2w | Mass-traffic comprehension | Fifth |
| 5. Sharable cards | J2 | 1w | Organic virality | Sixth |
| 3. PDF consultation report | J1 | 3-4w | Pandit monetisation | Seventh |
| 8. Module → chart deep-link | J2 | 2-3w | Enthusiast depth | Eighth |
| 10. Family synastry | J2 | 3-4w | Retention | Ninth |
| 9. Locale-register | J1, J3 | 4-6w | Authenticity | Tenth |

Build these in roughly this order. Mode setting must come first because every other move below it assumes its existence.

---

## Open questions

These are unresolved and worth a separate discussion:

1. **How does Brihaspati AI's quota model interact with the Beginner persona?** Beginners should arguably get more free questions than today; enthusiasts will pay if the cap is right.
2. **Where does the Western-curious beginner sit?** They are not in any of the three personas above cleanly — they are not Indian-cultural beginners. Do they get their own?
3. **Do we want a Pandit account type?** A separate verified account with PDF report quota, bulk muhurta scans, advisor-tagging?
4. **How aggressive should we be about email habit-forming?** Daily horoscope email opens a door to deeper segmentation (which rashi, which time of day to send).
5. **Is the Marathi → Maithili → Bengali regional segmentation a persona or a locale?** I have treated it as locale; arguably each has a distinct regional persona overlay.
6. **What is the right pricing for the pandit PDF report?** ₹49 disposable, ₹199 considered, ₹499 quality signal? A/B test required.

---

## Appendix — current product surface mapped to personas

A quick reference: which feature primarily serves which persona today.

| Surface | Pandit | Enthusiast | Beginner |
|---|---|---|---|
| `/kundali` Patrika tab | secondary | primary | primary |
| `/kundali` Expert tabs | primary | secondary | hidden ideally |
| `/panchang` daily | secondary | secondary | primary |
| `/sign-calculator` | n/a | n/a | primary |
| `/sade-sati` | primary | secondary | primary |
| `/muhurta-ai` | primary | secondary | secondary |
| `/prashna-ashtamangala` | primary | n/a | n/a |
| `/varshaphal` | primary | secondary | n/a |
| `/kp-system` | primary | secondary | n/a |
| `/matching` | secondary | primary | primary (anxiety) |
| `/festivals/[slug]/[year]` | secondary | secondary | primary |
| `/calendar/regional/[tradition]` | secondary | primary | primary (cultural) |
| `/horoscope/[rashi]` | n/a | secondary | primary |
| `/learn/[module]` | secondary | primary | secondary |
| `/baby-names/[nakshatra]` | secondary | secondary | primary |
| Brihaspati AI | secondary | primary | secondary |
| Dashboard | secondary | primary | secondary |

Reading the table: every primary cell deserves a fast, mode-aware default. Every secondary cell deserves a respectful presence without overwhelm.

---

## How this doc evolves

- Add journeys as we observe new ones in analytics or user reports.
- Annotate each journey with "what we shipped" once a sized fix lands.
- Re-prioritise quarterly based on actual engagement data.
- Retire journeys that observation shows are not real.
- Promote PR-shaped recommendations into the Roadmap doc once accepted.

---

*Document version 1.0 — 2026-06-03. First draft from 3-persona kick-off session.*
