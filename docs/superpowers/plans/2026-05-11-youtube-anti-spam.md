# YouTube Short Anti-Spam Redesign

**Goal:** Make daily YouTube Shorts look hand-crafted, not automated. Introduce variation in schedule, visuals, content structure, audio, and metadata to avoid YouTube's programmatic upload detection.

**Current problem:** Every video uses identical 5-slide template, same colours, same music, same Ken Burns zoom, same CTA, posted at exactly 01:00 UTC daily. YouTube flags this as automated bulk content.

---

## 1. Schedule Randomisation

**Current:** Fixed `0 1 * * *` (01:00 UTC daily)

**Proposed:** GitHub Actions can't do random cron. Instead:

**Option A (simple):** 7 different cron schedules, one per weekday:
```yaml
schedule:
  - cron: '15 0 * * 0'   # Sunday 00:15 UTC
  - cron: '45 2 * * 1'   # Monday 02:45 UTC  
  - cron: '30 1 * * 2'   # Tuesday 01:30 UTC
  - cron: '0 3 * * 3'    # Wednesday 03:00 UTC
  - cron: '20 0 * * 4'   # Thursday 00:20 UTC
  - cron: '50 1 * * 5'   # Friday 01:50 UTC
  - cron: '10 2 * * 6'   # Saturday 02:10 UTC
```
This gives irregular posting times that look human. All within 00:00-03:00 UTC (05:30-08:30 IST) so the video is up before Indian morning.

**Option B (better):** Add a random sleep at the start of the workflow:
```yaml
- name: Random delay (0-90 minutes)
  run: sleep $((RANDOM % 5400))
```
Combined with a single cron entry, this makes posting time unpredictable.

**Recommendation:** Option B — simpler config, genuinely random.

---

## 2. Visual Variation — Multiple Templates

**Current:** One template with 5 hardcoded slide designs.

**Proposed:** 4 template themes that rotate (day-of-year % 4):

| Theme | Colour palette | Border style | Background |
|-------|---------------|-------------|------------|
| **Cosmic** (current) | Navy + gold | Gold gradient borders | Starfield gradient |
| **Sunrise** | Deep orange + amber | Warm glow borders | Dawn gradient (#1a0a00 → #4a2000) |
| **Moonlit** | Deep blue + silver | Silver frost borders | Night sky (#050520 → #0a1040) |
| **Emerald** | Deep green + gold | Leaf-pattern borders | Forest gradient (#001a00 → #0a2010) |

Implementation: The `/api/social/youtube` route receives a `theme` query param. The colour palette object `C` is selected based on the theme. Same data, different visual identity.

---

## 3. Content Variation — Different Slide Structures

**Current:** Always slides 1-2-3-4-5 (intro, pancha anga, timings, nakshatra, CTA).

**Proposed:** 5 different content formats that rotate weekly (week-of-year % 5):

| Format | Slides | When |
|--------|--------|------|
| **Classic** (current) | Intro → Pancha Anga → Timings → Nakshatra Spotlight → CTA | Week 1 |
| **Festival Focus** | Intro → Festival Story (if any, else nakshatra) → Puja Muhurta → Timings → CTA | Week 2 |
| **Rahu Kaal Alert** | Rahu Kaal hero → Safe windows → Pancha Anga summary → Tip of the day → CTA | Week 3 |
| **Nakshatra Deep Dive** | Nakshatra hero + mythology → Personality traits → Today's energy → Best activities → CTA | Week 4 |
| **Quick Glance** | Single mega-slide with all 5 pancha anga elements + timings compactly | Week 5 |

The CTA slide also varies — rotate between 3 different CTAs:
- "Generate your free Kundali"
- "Check Rahu Kaal for your city"
- "Find your Shubh Muhurta"

---

## 4. Audio Variation

**Current:** Same `ambient-short.mp3` every day.

**Proposed:** 4 ambient tracks that rotate with the visual theme:
- `ambient-cosmic.mp3` — current track (for Cosmic theme)
- `ambient-sunrise.mp3` — morning raga style
- `ambient-moonlit.mp3` — nighttime meditative
- `ambient-emerald.mp3` — nature/forest sounds

These should be royalty-free tracks, each ~30 seconds. Place in `public/audio/`.

**Interim (before sourcing tracks):** Randomly vary the music volume (0.2-0.4), add pitch shift (-2 to +2 semitones via ffmpeg `atempo`/`asetrate`), and randomly use or skip music entirely (some days = silent).

---

## 5. Metadata Variation

**Title templates (rotate randomly):**
1. `Panchang {Month Day} — {Tithi} {Nakshatra} | आज का पंचांग #Shorts`
2. `{Nakshatra} Nakshatra Today — {Weekday} {Month Day} | दैनिक पंचांग #Shorts`
3. `Rahu Kaal {Start}-{End} — {Month Day, Year} Panchang #Shorts`
4. `{Festival} Special — {Month Day} Panchang | {Tithi} {Nakshatra} #Shorts` (when festival exists)
5. `{Weekday} Panchang — {Month Day} | {Yoga} Yoga, {Karana} Karana #Shorts`

**Description:** Shuffle the order of sections. Some days lead with festival, some with timings, some with nakshatra.

**Tags:** Shuffle array order randomly (YouTube may detect fixed tag ordering). Add 2-3 day-specific tags (`{nakshatra name}`, `{tithi name}`, `{festival name}`).

---

## 6. Transition Variation

**Current:** Fixed zoom-in/zoom-out alternation + fade/fadeblack cycle.

**Proposed:** Random selection per video:
- Zoom: randomly choose zoom-in or zoom-out per slide (not alternating)
- Zoom speed: vary increment between 0.0001 and 0.0003
- Transitions: randomly pick from `fade`, `fadeblack`, `fadewhite`, `dissolve`, `wipeleft`, `slideup`
- Slide duration: vary between 4-6 seconds per slide (not always 5)

---

## Implementation Plan

### Task 1: Schedule randomisation
- Modify `.github/workflows/youtube-short.yml` — add random sleep (0-90 min)

### Task 2: Theme system
- Add `theme` param to `/api/social/youtube` route
- Create 4 colour palettes (Cosmic, Sunrise, Moonlit, Emerald)
- Select theme based on `dayOfYear % 4`

### Task 3: Content format rotation
- Add `format` param to route
- Implement 5 slide structures
- Select format based on `weekOfYear % 5`
- Rotate CTA slide text

### Task 4: Metadata variation
- 5 title templates, randomly selected
- Shuffle description sections
- Shuffle + vary tags

### Task 5: Transition/audio variation
- Randomise zoom direction, speed, transition type, slide duration in `generate-short.ts`
- Vary music volume, optionally skip music
- Source/create additional ambient tracks later

### Task 6: Anti-pattern removal
- Remove the identical Slide 5 (CTA) — make it vary
- Don't always post — skip 1-2 days per week randomly (human creators don't post EVERY day)
- Vary video duration (18-25 seconds instead of always 22)
