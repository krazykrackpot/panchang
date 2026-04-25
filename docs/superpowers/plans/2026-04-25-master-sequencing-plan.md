# Master Sequencing Plan — Directions 5, 6, 3

> **For agentic workers:** This is the master tracking document for 19 features across 3 directions. Each feature gets its own implementation plan in this directory. Use superpowers:subagent-driven-development or superpowers:executing-plans for each individual plan.

**Goal:** Ship all 19 features from Directions 5 (Computation), 6 (Visualization), and 3 (Data Intelligence)

**Total features:** 19
**Estimated total:** ~40 weeks (features overlap and can be parallelized)

---

## Dependency Graph

```
Phase 1 (Foundation)
  6G Strength Radar ──────────────────────────────────────────────┐
  3A Astro Journal (DB tables) ───────────┬─────────────���─────────┤
                                          │                       │
Phase 2 (Core)                            │                       │
  6B Dasha Timeline ──────────────────────┤                       │
  5B Medical Astrology ────────────────���──┤                       │
  6A Live Sky Map                         │                       │
                                          │                       │
Phase 3 (Expansion)                       │                       │
  5D Financial Astrology ─────────────────┤                       │
  6E Retrograde Visualizer                │                       │
  3C Life Event Timeline ←── depends on 6B│+ 3A                   │
  3B Prediction Scorecard ←── depends on 3A                       │
                                          │                       │
Phase 4 (Advanced)                        │                       │
  5A Mundane Astrology                    │                       │
  6C Transit Playground                   │                       │
  6H Yoga Animator                        │                       │
  3D Transit Replay ←── depends on 6C     │                       │
  3E Dasha Diary ←── depends on 3A        │                       │
                                          │                       │
Phase 5 (Deep)                            │                       │
  5C Nadi Jyotish (Bhrigu Nandi)          │                       │
  5F Tajika Expansion                     │                       │
  6D 3D Celestial Sphere                  │                       │
  6F Eclipse Simulator ←── depends on 6D (shared Three.js)        │
  3F Personalized Almanac ←── depends on 3A + 3B + 3C (needs data)│
```

---

## Feature Tracking Table

| # | Feature | Direction | Est. | Depends On | Plan File | Status |
|---|---------|-----------|------|------------|-----------|--------|
| 1 | 6G Strength Radar | Viz | 1w | — | `2026-04-25-6g-strength-radar.md` | NEXT |
| 2 | 3A Astro Journal | Data | 2-3w | — | TBD | queued |
| 3 | 6B Dasha Timeline | Viz | 1.5w | — | TBD | queued |
| 4 | 5B Medical Astrology | Comp | 2-3w | — | TBD | queued |
| 5 | 6A Live Sky Map | Viz | 2w | — | TBD | queued |
| 6 | 5D Financial Astrology | Comp | 2w | — | TBD | queued |
| 7 | 6E Retrograde Visualizer | Viz | 1w | — | TBD | queued |
| 8 | 3C Life Event Timeline | Data | 2w | 3A, 6B | TBD | blocked |
| 9 | 3B Prediction Scorecard | Data | 2w | 3A | TBD | blocked |
| 10 | 5A Mundane Astrology | Comp | 3w | — | TBD | queued |
| 11 | 6C Transit Playground | Viz | 2w | — | TBD | queued |
| 12 | 6H Yoga Animator | Viz | 2w | — | TBD | queued |
| 13 | 3D Transit Replay | Data | 1.5w | 6C | TBD | blocked |
| 14 | 3E Dasha Diary | Data | 1.5w | 3A | TBD | blocked |
| 15 | 5C Nadi Jyotish | Comp | 4-6w | — | TBD | queued |
| 16 | 5F Tajika Expansion | Comp | 2w | — | TBD | queued |
| 17 | 6D 3D Celestial Sphere | Viz | 3-4w | — | TBD | queued |
| 18 | 6F Eclipse Simulator | Viz | 2-3w | 6D | TBD | blocked |
| 19 | 3F Personalized Almanac | Data | 2w | 3A, 3B, 3C | TBD | blocked |

**Legend:** NEXT = being planned now, queued = no blockers but not started, blocked = waiting on dependency

---

## Phase Details

### Phase 1: Foundation (Weeks 1-3)
**Goal:** Prove the visualization pattern with D3 + lay the data foundation.

- **6G Strength Radar** (1 week): D3 radar chart on the existing Shadbala tab. Proves we can ship interactive D3 visualizations within the existing kundali page architecture. Simplest possible feature — zero new data, zero new APIs.
- **3A Astro Journal** (2-3 weeks): Database tables (`astro_journal`, `prediction_tracking`, `life_events`), API routes, daily check-in UI, journal browse/search. This is the foundation ALL Direction 3 features depend on.

### Phase 2: Core (Weeks 3-6)
**Goal:** Ship the highest-impact features from each direction.

- **6B Dasha Timeline** (1.5 weeks): D3 horizontal timeline with zoom/pan. Needed by 3C (Life Event Timeline). Ships as a new kundali tab + standalone dashboard page.
- **5B Medical Astrology** (2-3 weeks): Prakriti calculator, body vulnerability map, health timeline, Ayurvedic remedy engine. The flagship computation feature — no competitor has this.
- **6A Live Sky Map** (2 weeks): D3 polar projection of the ecliptic. The daily-engagement visualization. Ships as `/sky` page + home page widget.

### Phase 3: Expansion (Weeks 6-9)
**Goal:** Second wave of computation + unlock Direction 3 features that depend on Phase 1-2.

- **5D Financial Astrology** (2 weeks): Dhana Yoga activation timeline, personal financial windows, Hora-based activity guide. Mass appeal.
- **6E Retrograde Visualizer** (1 week): Canvas 2D orbital animation. Perfect for /learn. Standalone, no dependencies.
- **3C Life Event Timeline** (2 weeks): Events plotted on the Dasha Timeline (6B). Correlation engine. Unlocked by 3A + 6B.
- **3B Prediction Scorecard** (2 weeks): Auto-capture predictions from existing generators. Review queue. Accuracy dashboard. Unlocked by 3A.

### Phase 4: Advanced (Weeks 9-13)
**Goal:** Interactive tools + deeper data intelligence.

- **5A Mundane Astrology** (3 weeks): Nation chart database, Mesha Sankranti ingress engine, Great Conjunction tracker. Research-heavy.
- **6C Transit Playground** (2 weeks): Draggable transit planets on natal chart. Real-time aspect/yoga computation.
- **6H Yoga Animator** (2 weeks): Animated yoga formation on chart diagram. Educational tool.
- **3D Transit Replay** (1.5 weeks): Time-machine mode using Transit Playground infrastructure (6C).
- **3E Dasha Diary** (1.5 weeks): Structured reflection at dasha boundaries. Unlocked by 3A.

### Phase 5: Deep (Weeks 13-22+)
**Goal:** The most ambitious and technically complex features.

- **5C Nadi Jyotish** (4-6 weeks): BNN rule database (108 base predictions + modifiers). Content-heavy, research-intensive.
- **5F Tajika Expansion** (2 weeks): Maasaphal, Varshesha Dasha, Patyayini Dasha. Extends existing Varshaphal engine.
- **6D 3D Celestial Sphere** (3-4 weeks): Three.js / React Three Fiber. Most technically complex visualization.
- **6F Eclipse Simulator** (2-3 weeks): Three.js eclipse visualization. Shares 3D infrastructure with 6D.
- **3F Personalized Almanac** (2 weeks): Annual retrospective document. Needs 6+ months of journal data to be meaningful — ships last.

---

## Parallelization Opportunities

Features within the same phase that have no mutual dependency can be built in parallel using worktrees:

- **Phase 1:** 6G and 3A are independent → parallel
- **Phase 2:** 6B, 5B, 6A are all independent → up to 3 parallel
- **Phase 3:** 5D, 6E are independent of each other → parallel; 3C and 3B are independent of each other (both need 3A done) → parallel
- **Phase 4:** 5A, 6C, 6H are independent → up to 3 parallel; 3D depends on 6C, 3E depends on 3A only
- **Phase 5:** 5C, 5F, 6D are independent → up to 3 parallel; 6F waits for 6D; 3F waits for data accumulation

---

## How to Use This Plan

1. When starting a new feature: write a detailed implementation plan in this directory (`docs/superpowers/plans/2026-MM-DD-<feature>.md`)
2. Execute the plan using subagent-driven-development or executing-plans
3. Update the Status column in the tracking table above (queued → NEXT → in progress → done)
4. Update "Depends On" for any feature that was blocking another
5. After completing a phase: review the next phase's features and write plans for the next batch

---

## Specs (Reference)

All design specs live in `docs/superpowers/specs/`:
- `2026-04-25-feature-roadmap-v2.md` — Master roadmap (all 6 directions)
- `2026-04-25-direction5-computation-verticals.md` — Direction 5 deep dive
- `2026-04-25-direction6-interactive-visuals.md` — Direction 6 deep dive
- `2026-04-25-direction3-data-over-time.md` — Direction 3 deep dive
