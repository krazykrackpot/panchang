# Claude Desktop — Video Production Task

## What You Are Making
A 2:30 educational video titled "Why Are the 7 Days in THAT Order?" for the YouTube channel @DekhoPanchang. The video explains the Hora system — how ancient Indian astronomers assigned planetary hours and derived the weekday sequence.

All scripts, animations, and prompts are pre-built at:
`/Users/adityakumar/Desktop/venture/panchang/scripts/video/001-seven-days/`

## Step-by-Step Instructions

### STEP 1: Generate Narration Audio

Open Terminal and run:
```bash
cd /Users/adityakumar/Desktop/venture/panchang
```

If GOOGLE_CLOUD_TTS_KEY exists in .env.local:
```bash
./scripts/video/generate-narration.sh 001-seven-days
```

If no TTS key yet — skip this step. Instead, open the file `scripts/video/001-seven-days/narration-en.txt`, select all text, and use macOS built-in TTS:
```bash
say -v "Rishi" -r 160 -o scripts/video/001-seven-days/narration-en.aiff < scripts/video/001-seven-days/narration-en.txt
# Convert to mp3
ffmpeg -i scripts/video/001-seven-days/narration-en.aiff scripts/video/001-seven-days/narration-en.mp3
```

For Hindi:
```bash
say -v "Lekha" -r 150 -o scripts/video/001-seven-days/narration-hi.aiff < scripts/video/001-seven-days/narration-hi.txt
ffmpeg -i scripts/video/001-seven-days/narration-hi.aiff scripts/video/001-seven-days/narration-hi.mp3
```

Note: macOS `say` voices are decent but not as good as Google WaveNet. If Rishi/Lekha are not installed, go to System Settings → Accessibility → Spoken Content → System Voice → Manage Voices → download "Rishi" (Indian English) and "Lekha" (Hindi).

### STEP 2: Screen-Record the Hora Animation

1. Open Chrome at: `file:///Users/adityakumar/Desktop/venture/panchang/scripts/video/001-seven-days/hora-animation.html`
2. Make Chrome full-screen (Cmd+Shift+F)
3. Open QuickTime Player → File → New Screen Recording
4. Set recording area to the Chrome window (1920×1080)
5. Click Record
6. In the Chrome window, press **P** to start the auto-play animation
7. Wait for it to cycle through all 4 scenes (~45 seconds)
8. Stop recording
9. Save as: `scripts/video/001-seven-days/hora-recording.mov`

Also record `scenes.html` the same way:
1. Open: `file:///Users/adityakumar/Desktop/venture/panchang/scripts/video/001-seven-days/scenes.html`
2. Record each scene by pressing Arrow Right to advance:
   - Scene 1: Days appearing (wait 4 seconds)
   - Scene 2: Orbital speed ladder (wait 4 seconds)  
   - Scene 5: Cross-cultural table (wait 4 seconds)
   - Scene 7: CTA endcard (wait 3 seconds)
3. Save as: `scripts/video/001-seven-days/scenes-recording.mov`

### STEP 3: Generate AI B-Roll on Kling AI

1. Open Chrome → https://klingai.com (sign in with Google if needed)
2. For each prompt below, click "Create" → "AI Video" → paste the prompt → generate:

**Clip 1 (8s):**
```
Cinematic tracking shot of an ancient Indian stone observatory at night, Jantar Mantar style, brilliant stars and Milky Way visible overhead. Camera slowly tilts up from carved stone instruments to the starry sky. Warm amber torchlight on the stone. 4K cinematic.
```

**Clip 2 (10s):**
```
Seven luminous celestial bodies orbiting in concentric circles against deep space. Saturn outermost with rings, Jupiter large golden, Mars small red, Sun bright center, Venus white, Mercury tiny, Moon closest. Slow majestic orbital motion. Dark background, faint nebula. Cinematic 4K.
```

**Clip 3 (6s):**
```
Extreme close-up of an ancient Indian astronomical manuscript with Sanskrit Devanagari script, hand-drawn planetary diagrams and circular charts. Warm candlelight illumination, slight camera push-in. Aged parchment, gold ink diagram lines. Cinematic shallow depth of field.
```

**Clip 4 (8s):**
```
Slowly rotating Earth globe in space with glowing golden lines connecting India to Rome, Tokyo, Paris, London. Lines pulse with light. Night side of Earth visible with city lights. Indian subcontinent glows warmest. Cinematic, elegant.
```

**Clip 5 (5s):**
```
Dramatic sunrise over ancient Indian temple silhouette, golden light rays breaking through misty atmosphere. Sun appears as a perfect golden disc. Warm tones, cinematic lens flare, time-lapse speed.
```

3. Download each clip and save to: `scripts/video/001-seven-days/broll/`
   - `broll/01-observatory.mp4`
   - `broll/02-planets.mp4`
   - `broll/03-manuscript.mp4`
   - `broll/04-globe.mp4`
   - `broll/05-sunrise.mp4`

### STEP 4: Get Background Music

1. Open: https://studio.youtube.com → Audio Library
2. Search for: "ambient meditation" or "cosmic" or "cinematic India"
3. Download a 3-minute ambient track (no lyrics, builds subtly)
4. Save as: `scripts/video/001-seven-days/music/ambient.mp3`

Alternative free sources:
- https://pixabay.com/music/search/cinematic%20ambient/
- https://freemusicarchive.org

### STEP 5: Assemble in CapCut (Free)

If CapCut is not installed: download from https://www.capcut.com (free, no watermark)

1. Open CapCut → New Project → 16:9 (1920×1080)
2. Import all files:
   - `narration-en.mp3`
   - `hora-recording.mov`
   - `scenes-recording.mov`
   - All `broll/*.mp4` clips
   - `music/ambient.mp3`

3. Timeline assembly (match narration timing):

```
0:00–0:08  HOOK
  Video: broll/01-observatory.mp4 (full screen)
  Overlay: scenes-recording Scene 1 (days appearing) at 50% opacity
  Audio: narration "Sunday, Monday..."

0:08–0:35  THE 7 PLANETS
  Video: broll/02-planets.mp4
  Overlay: scenes-recording Scene 2 (orbital speed bars)
  Audio: narration "Ancient astronomers could see 7 moving objects..."

0:35–0:38  TRANSITION
  Video: broll/03-manuscript.mp4
  Audio: (narration continues)

0:38–1:15  THE HORA SYSTEM
  Video: hora-recording.mov (Scene A + Scene B)
  Audio: narration "Here's where it gets brilliant..."
  Key moment at ~1:05: Scene B counter reveal — "SUNDAY" appears

1:15–1:40  SKIP-3 PATTERN
  Video: hora-recording.mov (Scene D)
  Audio: narration "There's an elegant shortcut..."

1:40–2:05  CROSS-CULTURAL
  Video: broll/04-globe.mp4
  Overlay: scenes-recording Scene 5 (table)
  Audio: narration "This system spread everywhere..."

2:05–2:20  TODAY'S CONNECTION
  Video: broll/05-sunrise.mp4
  Audio: narration "This 4,000-year-old system isn't just history..."

2:20–2:30  CTA
  Video: scenes-recording Scene 7 (logo + URL)
  Audio: narration "Explore 4,000 years of astronomical wisdom..."
```

4. Add background music track at 15-20% volume under the narration
5. Add subtle transitions (1s cross-dissolve between major sections)
6. Add text overlays for key moments:
   - "WHY THIS ORDER?" at 0:05
   - "THE HORA SYSTEM" at 0:38
   - "4,000 YEARS OLD" at 1:42
   - "dekhopanchang.com/hora" at 2:22

7. Export:
   - 16:9 → `output/en-16x9.mp4` (YouTube)
   - Duplicate project, crop to 9:16 → `output/en-9x16.mp4` (Shorts/Reels)

### STEP 6: Upload to YouTube

1. Open: https://studio.youtube.com → Create → Upload video
2. Upload `output/en-16x9.mp4`
3. Title: `Why Are the Days of the Week in This Order? | Ancient Indian Astronomy`
4. Description:
```
Sunday, Monday, Tuesday... this order isn't random. It's a 4,000-year-old astronomical code from ancient India called the Hora system.

This video explains how ancient astronomers assigned each hour of the day to one of 7 visible celestial bodies, and how the first hour determines the day's name.

🔗 Compute your personal Hora table: https://dekhopanchang.com/hora
🔗 Learn more about Vara (weekdays): https://dekhopanchang.com/learn/vara
🔗 Full Panchang for today: https://dekhopanchang.com/panchang

#astronomy #india #vedic #panchang #hora #weekdays #science #history
```
5. Thumbnail: Use a screenshot from Scene B (the "SUNDAY" reveal moment) or generate one in Canva
6. Tags: vedic astronomy, panchang, hora, weekday order, indian science, ancient india, sunday, monday, planetary hours
7. Category: Education
8. Visibility: Public

### STEP 7: Create YouTube Short

1. Upload `output/en-9x16.mp4` as a YouTube Short
2. Title: `Why Sunday comes after Saturday #astronomy #india #science`
3. Add the same description (shortened)

### STEP 8: Repeat for Hindi

Repeat Steps 5-7 with:
- Hindi narration (`narration-hi.mp3`)
- Same visuals (animation is language-independent)
- Hindi title: `सप्ताह के दिन इसी क्रम में क्यों? | प्राचीन भारतीय खगोल विज्ञान`
- Hindi description with same links

---

## Files Reference
```
scripts/video/001-seven-days/
├── narration-en.txt          ← English narration text
├── narration-hi.txt          ← Hindi narration text
├── script-en.md              ← Full English script with scene directions
├── script-hi.md              ← Full Hindi script
├── hora-animation.html       ← Animated Hora mechanism (press P to play)
├── scenes.html               ← Static scenes (arrow keys to switch)
├── ai-video-prompts.md       ← All Kling AI prompts
├── production-plan.md        ← Technical production plan
├── claude-desktop-prompt.md  ← THIS FILE
├── broll/                    ← AI-generated clips (you generate these)
├── music/                    ← Background track (you download this)
└── output/                   ← Final exported videos
    ├── en-16x9.mp4
    ├── en-9x16.mp4
    ├── hi-16x9.mp4
    └── hi-9x16.mp4
```
