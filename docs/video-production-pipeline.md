# Video Production Pipeline — Technical Specification

**Date:** 2026-05-03
**Status:** Implemented (Phase 2 — AI Video Generation)

---

## Pipeline Overview

```
                    ┌─────────────┐
                    │  1. SCRIPT  │  Write/edit JSON script with scenes
                    │   CREATE    │  src/video/scripts/<name>.json
                    └──────┬──────┘
                           ↓
              ┌────────────┼────────────┐
              ↓            ↓            ↓
       ┌────────────┐ ┌─────────┐ ┌──────────┐
       │ 2a. VOICE  │ │ 2b. AI  │ │ 2c.MUSIC │  All run in parallel
       │  Generate  │ │  VIDEO  │ │  Select   │
       │(ElevenLabs)│ │ CLIPS   │ │ (library) │
       └─────┬──────┘ └────┬────┘ └─────┬────┘
             └──────────┬───┘            │
                        ↓               ↓
                 ┌─────────────┐  ┌──────────┐
                 │ 3. COMPOSE  │←─│  Music   │
                 │  (FFmpeg)   │  │  layer   │
                 └──────┬──────┘  └──────────┘
                        ↓
                 ┌─────────────┐
                 │ 4. REVIEW   │  Watch final video
                 │  & PUBLISH  │  Upload to YT/IG/Twitter
                 └─────────────┘
```

---

## Quick Start

### 1. Write a script
```bash
# Scripts are JSON files in src/video/scripts/
# See existing examples: vedic-vs-western.json, sade-sati-saturn.json
```

### 2. Generate AI video clips (via fal.ai)
```bash
# Set FAL_KEY in .env.local first (get at https://fal.ai/dashboard/keys)
npx tsx scripts/generate-ai-clips.ts vedic-vs-western --model kling
npx tsx scripts/generate-ai-clips.ts vedic-vs-western --model veo     # premium quality
npx tsx scripts/generate-ai-clips.ts vedic-vs-western --model runway   # mid-tier
```

### 3. Generate voiceover (via ElevenLabs)
```bash
# ELEVENLABS_API_KEY must be in .env.local
npx tsx scripts/generate-voiceover.ts vedic-vs-western
```

### 4. Compose final video (FFmpeg)
```bash
npx tsx scripts/compose-video.ts vedic-vs-western
# Output: /tmp/videos/vedic-vs-western-final.mp4
```

### Alternative: CSS-only render (no AI clips needed)
```bash
# Uses Remotion with CSS cosmic backgrounds — no API costs
npx tsx scripts/render-video.ts vedic-vs-western
# Output: /tmp/videos/vedic-vs-western.mp4
```

---

## AI Video Models (via fal.ai)

All accessed through a single `@fal-ai/client` SDK. One API key, one billing dashboard.

| Model | Endpoint | Cost/sec | Max Res | Quality | Best For |
|---|---|---|---|---|---|
| **Kling 3.0** | `fal-ai/kling-video/v2/master/text-to-video` | $0.029/s | 1080p | Very Good | Volume, iteration |
| **Google Veo 3.1** | `fal-ai/veo3` | $0.20/s | 4K | Excellent | Hero content |
| **Runway Gen-4 Turbo** | `fal-ai/runway-gen4/turbo/text-to-video` | $0.05/s | 720p | Good | Middle ground |

### Cost per video (8 scenes × 8s clips)

| Model | Cost per video | Quality |
|---|---|---|
| Kling 3.0 | ~$1.90 | Very Good |
| Runway Gen-4 Turbo | ~$3.20 | Good |
| Google Veo 3.1 | ~$12.80 | Excellent |

### Recommendation
- **Draft/iteration:** Kling 3.0 ($0.029/s)
- **Final publish:** Google Veo 3.1 ($0.20/s) for hero content
- **Budget:** Kling for everything — quality is excellent for the price

---

## Script Format

```json
{
  "meta": {
    "topic": "vedic-vs-western-zodiac",
    "type": "short",
    "language": "en",
    "estimatedDuration": 75,
    "style": "dramatic",
    "musicMood": "dramatic",
    "voiceProfile": "narrator-en",
    "musicTrack": "ambient-short"
  },
  "scenes": [
    {
      "id": 1,
      "duration": 7,
      "narration": "Your zodiac sign... is probably wrong.",
      "visualType": "cosmic_text",
      "textOverlay": "YOUR SIGN IS *WRONG*",
      "textStyle": "burst",
      "cosmicPreset": "eclipse",
      "transition": "fade",
      "videoPrompt": "Cinematic total solar eclipse, diamond ring effect, dramatic..."
    }
  ]
}
```

### Key fields per scene:
- **narration** — voiceover text (sent to ElevenLabs)
- **videoPrompt** — AI video generation prompt (sent to Kling/Veo/Runway)
- **textOverlay** — text burned onto the final video (via FFmpeg drawtext)
- **cosmicPreset** — CSS fallback background (for Remotion-only render)
- **duration** — scene length in seconds

### Available visual types:
- `cosmic_text` — dramatic text with light burst/ascend/glow effects
- `planet_render` — CSS planet with atmosphere (set `planet` field)
- `zodiac_wheel` — animated zodiac ring
- `title_card` — opening title
- `cta` — call-to-action end card
- `comparison`, `timeline`, `data_table` — data displays

### Available cosmic presets (CSS fallback):
`nebula`, `planet`, `sun_corona`, `galaxy`, `deep_space`, `aurora`, `eclipse`, `constellation`, `celestial`

---

## Existing Scripts

| Script | Duration | Scenes | Topic |
|---|---|---|---|
| `vedic-vs-western.json` | 75s | 8 | Western vs Vedic zodiac |
| `sade-sati-saturn.json` | 80s | 7 | Saturn's 7.5-year test |
| `rahu-kaal-explained.json` | 75s | 6 | The forbidden hour |
| `pushya-nakshatra-gold.json` | 70s | 5 | Best day to buy gold |
| `moon-sign-personality.json` | 75s | 6 | Moon sign = real personality |

---

## File Structure

```
scripts/
├── generate-ai-clips.ts    # AI video clip generation (fal.ai)
├── generate-voiceover.ts   # ElevenLabs TTS per scene
├── compose-video.ts        # FFmpeg composition (clips + voice + music)
└── render-video.ts         # Remotion CSS-only render (no AI)

src/video/
├── index.ts                # Remotion entry point
├── Root.tsx                # Composition registration
├── types.ts                # TypeScript interfaces
├── scripts/                # Script JSON files
│   ├── vedic-vs-western.json
│   ├── sade-sati-saturn.json
│   ├── rahu-kaal-explained.json
│   ├── pushya-nakshatra-gold.json
│   └── moon-sign-personality.json
├── compositions/
│   └── ShortVideo.tsx      # Main Remotion composition
└── components/
    ├── CosmicBackground.tsx # 9 dramatic cosmic presets
    ├── CosmicText.tsx       # Text with light burst/ascend/glow
    ├── PlanetRender.tsx     # CSS planet spheres (9 planets)
    ├── SceneRenderer.tsx    # Routes visual types + transitions
    ├── TitleCard.tsx        # Animated title
    ├── TextReveal.tsx       # Kinetic typography
    ├── ZodiacWheel.tsx      # Animated zodiac ring
    ├── CTACard.tsx          # Call-to-action card
    ├── DataCard.tsx         # Data display variants
    └── Background.tsx       # Original star field (legacy)

/tmp/videos/                # Output directory
├── clips/<script>/         # AI-generated clips per scene
├── voiceover/<script>/     # Voiceover MP3s per scene
├── <script>.mp4            # Remotion CSS render
└── <script>-final.mp4     # Final composed video
```

---

## Environment Variables

```bash
# .env.local
FAL_KEY=...                  # fal.ai API key (for AI video generation)
ELEVENLABS_API_KEY=...       # ElevenLabs (for voiceover)
```

---

## Cost Model (per 75-second video, 8 scenes)

| Component | Kling | Veo | Budget (CSS only) |
|---|---|---|---|
| AI Video Clips | $1.90 | $12.80 | $0.00 |
| Voice (ElevenLabs) | $0.40 | $0.40 | $0.40 |
| Music | $0.00 | $0.00 | $0.00 |
| Composition | $0.00 | $0.00 | $0.00 |
| **Total** | **~$2.30** | **~$13.20** | **~$0.40** |

---

## Output Formats

| Platform | Resolution | Aspect | Max Duration |
|---|---|---|---|
| YouTube Shorts | 1080x1920 | 9:16 | 60s |
| Instagram Reels | 1080x1920 | 9:16 | 90s |
| YouTube (long) | 1920x1080 | 16:9 | unlimited |
| Twitter | 1280x720 | 16:9 | 140s |
