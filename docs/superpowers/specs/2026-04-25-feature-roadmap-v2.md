# Feature Roadmap v2 — Beyond the Canon

**Date**: 2026-04-25
**Status**: Brainstorm — directions documented, deep dives pending for #5, #6, #3

## Context

As of April 2026, dekhopanchang.com has 95+ pages, 40+ API routes, and 20+ lib modules covering nearly every classical Jyotish system: Parashari, Jaimini, KP, Tajika Varshaphal, Prashna (Ashtamangala + full horary + Pancha Pakshi), Ashtakavarga with Shodhana, Shadbala, Bhavabala, all Dashas (Vimshottari, Yogini, Ashtottari, Kalachakra, Mudda), full Gochara with Vedha + Kakshya + Double Transit, Sarvatobhadra Chakra, Tippanni Convergence, RAG over classical texts, 26-module learning system, and a personalized dashboard with 8-domain life readings.

The canon is covered. What follows are six directions that would move the app from "comprehensive Jyotish calculator" to "the platform serious practitioners and curious seekers both live in."

---

## Direction 1: Social & Community

**The gap**: The app is single-player. No user can interact with any other user.

### Features

**1A. Shared Charts & Public Profiles**
- Generate shareable chart links (read-only, expiring or permanent)
- Optional public profile: "Taurus Moon, Virgo Lagna, Rahu Mahadasha" — shown as a card
- Privacy controls: share chart without birth time, share only rashi/nakshatra

**1B. Community Q&A Forum**
- Question threads tagged by topic (dasha interpretation, transit confusion, muhurta timing)
- Chart context auto-attached when the asker opts in — other users see the relevant chart data without having to re-enter it
- Reputation system: upvotes on answers, "Verified Jyotishi" badge tier
- RAG-augmented answers: the system surfaces relevant classical text chunks alongside community answers

**1C. Astrologer Marketplace**
- Professional Jyotishis can list services (consultation, matching, muhurta selection)
- In-app booking with calendar integration
- Payment via existing Stripe/Razorpay infrastructure
- Client-side chart sharing (one-click "share my chart with this astrologer")

**1D. Group Compatibility View**
- Beyond couple matching: family group compatibility matrix
- Team/business partnership compatibility (Graha Maitri + Gana + Vashya for professional relationships)
- Visual heatmap of compatibility scores across a group

### Why this matters
Retention. Single-player tools get used once and forgotten. Social features create reasons to return — "someone answered my question," "my astrologer posted an update," "my family compatibility card changed because my sister's dasha shifted."

---

## Direction 2: Temporal Engagement Loops

**The gap**: Cron emails and push notifications exist, but there's no in-app daily ritual.

### Features

**2A. Morning Briefing Card ("Your Day in 30 Seconds")**
- One glanceable card: today's tithi/nakshatra, personal gochara score, one-line dasha insight, any conflicts (Rahu Kaal, Varjyam overlapping your commute hours)
- Animated reveal (card flips, particles, gold shimmer) — makes opening the app feel like a ritual
- Personalized to birth chart + location + saved preferences

**2B. Evening Reflection**
- End-of-day prompt: "How did today feel?" (5-point scale + optional journal entry)
- System correlates response with the day's transits and stores for longitudinal analysis (Direction 3)
- Surfaces one insight: "You've rated 4 of the last 5 Pushya nakshatra days as 'productive'"

**2C. Streak & Ritual Mechanics**
- Daily check-in streak counter (visible on dashboard)
- "Panchang Observer" badges: 7-day streak, 30-day streak, 108-day tapas
- Weekly challenge: "This week, notice how you feel during Rahu Kaal. Log it."

**2D. Notification Intelligence**
- Smart notification timing: send the morning briefing 30 min after the user's local sunrise (not a fixed UTC time)
- Notification fatigue detection: if the user dismisses 3 in a row, reduce frequency automatically
- "Quiet mode" during inauspicious periods (user preference)

### Why this matters
Habit. The most successful apps (Duolingo, meditation apps) win on daily engagement loops, not feature depth. A user who opens the app every morning for their briefing will eventually explore deeper features.

---

## Direction 3: Data-Over-Time Intelligence

**The gap**: Everything is computed fresh per request. No longitudinal view. No "was the prediction right?"

### Features

**3A. Astro Journal**
- Daily/weekly journal entries with auto-tagged context: current dasha, transiting planets, tithi, nakshatra
- Tags: mood (5-point), energy (5-point), event type (career, health, relationship, financial, spiritual, creative)
- Search and filter by planetary period: "Show me all entries from my Jupiter antardasha"
- Pattern detection over 3+ months: "Your energy ratings are 1.3 points higher during Shukla Paksha"

**3B. Prediction Scorecard**
- The app already generates predictions (annual forecast, transit alerts, dasha narratives). Start tracking them.
- Each prediction gets a card: what was predicted, when, what planetary basis, user's rating (accurate / partially / missed)
- Personal accuracy dashboard: "Transit-based predictions are 68% accurate for you; dasha-based are 42%"
- This builds trust AND improves the system (weight factors that predict well for this user)

**3C. Life Event Timeline**
- Major life events (job change, marriage, birth, loss, relocation, health event) plotted on a timeline
- Overlay: dasha periods, Saturn transits, eclipses, retrograde windows
- Visual correlation: "Your last 3 job changes all happened during Mercury antardasha"
- Retrospective analysis: "On the day you got married, here's what the sky looked like and how it connected to your birth chart"

**3D. Transit Replay**
- Pick any past date → see the full sky state + how it aspected the natal chart
- "Time machine" mode: scrub through months/years, watch transits move across houses
- Overlay journal entries on the timeline: connect subjective experience with objective planetary positions

**3E. Dasha Diary**
- Structured reflection at each dasha/antardasha boundary
- System generates a prompt based on the incoming dasha lord: "Mars antardasha begins next month. Mars rules your 7th house. How are your partnerships feeling?"
- After the period ends, compare the prompt with what actually happened

**3F. Personalized Almanac**
- Auto-generated annual retrospective: "Your 2026 in the Stars"
- Month-by-month summary tying journal entries, life events, and predictions to planetary positions
- Exportable as PDF — a personal astrological diary for the year

### Why this matters
This is the moat. Any app can compute a chart. No app currently tracks whether its predictions were right and learns from the user's actual experience. This converts the app from a calculator into a personal astrological intelligence system.

---

## Direction 4: Practitioner Tools

**The gap**: Professional Jyotishis can use the app for personal charts but can't manage a practice.

### Features

**4A. Client Management**
- Client list with saved charts, consultation notes, follow-up dates
- Quick-generate: batch chart + tippanni for a new client in one click
- Consultation history: what was discussed, what was recommended, when to follow up

**4B. Consultation Mode**
- Distraction-free view: chart + tippanni + live transit overlay, no navigation chrome
- Side-by-side: client chart + current panchang (for live consultation timing)
- Quick notes panel: markdown notes saved to the client record
- Screen-share friendly: high-contrast, large text option

**4C. Report Builder**
- Drag-and-drop report sections: choose which tippanni sections, which dashas, which yogas to include
- White-label: practitioner's name/logo on the report
- PDF export with professional formatting (already have PDF infrastructure)
- Template system: save report templates for common consultation types (marriage, career, annual)

**4D. Batch Operations**
- Upload CSV of birth data → generate charts for entire family/group
- Bulk matching: all-pairs compatibility for a family
- Bulk transit alerts: "notify me when any of my 50 clients enters Sade Sati"

### Why this matters
Monetization. Professional Jyotishis are the highest-value users. They'd pay for a tool that replaces their current workflow (Jagannatha Hora + Excel + WhatsApp). This is also the clearest path to the Jyotishi subscription tier earning its price.

---

## Direction 5: New Computation Verticals

**The gap**: The classical Parashari/Jaimini/KP/Tajika canon is complete. But several specialized branches of Jyotish remain unimplemented.

### Sub-verticals (deep dive pending)

**5A. Mundane Astrology** — Nation charts, ingress charts, eclipse-over-nation analysis, economic cycles tied to Jupiter-Saturn conjunctions. Currently absent from the codebase.

**5B. Medical Astrology / Ayurvedic Correlations** — Planet → body part mapping, Prakriti (Vata/Pitta/Kapha) derivation from chart, health vulnerability windows from dasha + transit, Ayurvedic remedy correlations. Currently absent (SEO page exists but no computation).

**5C. Nadi Jyotish (beyond D-150)** — The D-150 Nadi Amsha is computed. But true Nadi Jyotish involves Bhrigu Nandi Nadi rules (planet-in-sign-with-aspect chains), predictive sequences, and past-life karmic indicators. Entirely unbuilt.

**5D. Hora Shastra / Financial Astrology** — Planetary hours for trading decisions, wealth yogas timed to transit activations, market cycle correlation with Jupiter-Saturn-Rahu conjunctions, personal wealth windows from 2nd/11th house dasha lords.

**5E. Prasna Marga Deep System** — Current Prashna is solid (Ashtamangala + scored horary + Pancha Pakshi) but Prasna Marga goes much deeper: Nimitta (omens), Ashtavarga Prashna, Chatushpada (4-footed) method, Trishula technique, specific protocols for lost objects, disease diagnosis, theft, and pregnancy.

**5F. Tajika Expansion** — Varshaphal is complete, but Tajika also includes Maasaphal (monthly charts), Dinaphal (daily charts), Varshesha Dasha (beyond Mudda), and all 16 Tajika yogas applied to monthly/daily charts.

**5G. Agama / Temple Astrology** — Muhurta for temple consecration (Kumbhabhishekam), deity installation, yagna timing. Specialized rules from Agama Shastra that go beyond general muhurta.

### Why this matters
Depth differentiator. No competing app covers mundane or medical astrology computationally. These are the features that make advanced practitioners say "I can't get this anywhere else."

---

## Direction 6: Interactive & Visual Experiences

**The gap**: All visualization is static SVG. No animation, no interactivity beyond clicking tabs. No spatial understanding of the sky.

### Sub-features (deep dive pending)

**6A. Live Sky Map** — Real-time ecliptic with planets positioned by current longitude, nakshatra boundaries marked. WebGL or D3-based. Shows what's actually happening in the sky right now.

**6B. Animated Dasha Timeline** — Scrub through your life. See dasha/antardasha/pratyantardasha periods as nested colored bands. Overlay life events. Click any period to see its interpretation.

**6C. Transit Playground** — Drag planets to different positions, watch aspects/yogas form and dissolve in real time. Educational + "what if" predictive tool.

**6D. 3D Celestial Sphere** — Three.js visualization: ecliptic plane, horizon, houses as sectors, planets as glowing orbs. Rotate, zoom, time-scrub.

**6E. Retrograde Visualizer** — Animated geocentric view showing the apparent retrograde loop. Explains the astronomy behind retrograde motion visually.

**6F. Eclipse Simulator** — Visual simulation of solar/lunar eclipses with umbra/penumbra cones, local visibility path on a globe.

**6G. Planetary Strength Radar** — Interactive radar/spider chart showing Shadbala components. Click a planet → drill into its 6 strength components. Compare two charts side-by-side.

**6H. Yoga Formation Animator** — Select a yoga (e.g., Gajakesari) → see planets animate into the required positions, with house boundaries highlighted. Educational visualization of what makes a yoga form.

### Why this matters
Delight and comprehension. Static charts are a barrier for beginners. Interactive visualizations make abstract concepts visceral. The 3D sky map alone would be a signature feature no competitor has.

---

## Priority Order (per user)

1. **Direction 5**: New Computation Verticals — deep dive first
2. **Direction 6**: Interactive & Visual Experiences — deep dive second
3. **Direction 3**: Data-Over-Time Intelligence — deep dive third
4. Direction 4: Practitioner Tools — future
5. Direction 2: Temporal Engagement Loops — future
6. Direction 1: Social & Community — future

---

## Next Steps

- Deep dive brainstorm on Direction 5 (computation verticals)
- Deep dive brainstorm on Direction 6 (interactive visualizations)
- Deep dive brainstorm on Direction 3 (data-over-time)
- For each: propose 2-3 approaches, recommend one, design it, write spec
