# Production Plan: "Why 7 Days in THAT Order?"

## Pipeline Overview

```
Script → Voice (ElevenLabs) → Visuals (Remotion + Runway) → Assembly → Export
```

## Step 1: Voice Narration (ElevenLabs)

### English
- Voice: "Adam" or "Antoni" (deep, authoritative, educational)
- Speed: 1.0x
- Stability: 0.5 (natural variation)
- Input: script-en.md narration blocks
- Output: 001-narration-en.mp3

### Hindi  
- Voice: Custom Hindi voice or "Arjun" 
- Speed: 1.0x
- Input: script-hi.md narration blocks
- Output: 001-narration-hi.mp3

### API Call Pattern
```bash
curl -X POST "https://api.elevenlabs.io/v1/text-to-speech/{voice_id}" \
  -H "xi-api-key: ${ELEVENLABS_API_KEY}" \
  -H "Content-Type: application/json" \
  -d '{
    "text": "...",
    "model_id": "eleven_multilingual_v2",
    "voice_settings": { "stability": 0.5, "similarity_boost": 0.75 }
  }' \
  --output narration.mp3
```

**Cost:** ~$0.30/min for Pro plan. 2:30 video × 2 languages = ~$1.50 total.

## Step 2: Visual Scenes

### Animated Diagram Scenes (Remotion — React)
These use our existing SVG components and design language:

| Scene | Type | Source |
|-------|------|--------|
| S1: Days appearing | Text animation | Custom Remotion composition |
| S2: Orbital speed ladder | Animated bars | Reuse ORBITAL_KEYS from vara/page.tsx |
| S3: 24-hour Hora wheel | Animated SVG wheel | Reuse/adapt from hora/page.tsx |
| S4: Skip-3 pattern | Arrow animation | Custom SVG |
| S5: Cross-cultural table | Reveal animation | Reuse CROSS_CULTURAL from vara/page.tsx |
| S6: App screenshot | Screen capture | Live app at /hora |
| S7: Logo + CTA | Branded endcard | Static |

### Cinematic B-Roll (AI Generated)
| Scene | Prompt for Runway/Kling | Duration |
|-------|------------------------|----------|
| S1 background | "Ancient Indian observatory at night, starry sky, cinematic, 4K" | 8s |
| S2 background | "Solar system planets orbiting, cosmic, dark space, gold highlights" | 27s |
| S3 transition | "Ancient manuscript with astronomical diagrams, warm candlelight" | 5s |
| S5 background | "World map with glowing connections between India, Rome, Japan" | 25s |

### Runway API Call Pattern
```bash
curl -X POST "https://api.dev.runwayml.com/v1/image_to_video" \
  -H "Authorization: Bearer ${RUNWAY_API_KEY}" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "gen4_turbo",
    "promptImage": "reference-image.png",
    "promptText": "Ancient Indian observatory...",
    "duration": 10,
    "ratio": "16:9"
  }'
```

**Cost:** ~$0.50/5s clip on Runway Gen-4. ~6 clips = ~$6 total.

## Step 3: Assembly (FFmpeg)

```bash
# Combine narration + visuals + background music
ffmpeg -i narration-en.mp3 \
       -i scene1.mp4 -i scene2.mp4 ... \
       -i ambient-music.mp3 \
       -filter_complex "[audio mix + video concat]" \
       -c:v libx264 -c:a aac \
       output-en-16x9.mp4

# Create vertical (9:16) version
ffmpeg -i output-en-16x9.mp4 \
       -vf "crop=ih*9/16:ih,scale=1080:1920" \
       output-en-9x16.mp4
```

## Step 4: Publish

### YouTube
- Title: "Why Are the Days of the Week in This Order? | 4000-Year-Old Indian Code"
- Tags: vedic astronomy, panchang, hora, weekday order, indian science
- Description: Full explanation + link to dekhopanchang.com/hora
- Thumbnail: Bold "WHY THIS ORDER?" text over cosmic background

### YouTube Shorts (vertical 9:16)
- Cut to 60s (Hook + Hora explanation + CTA)
- Title: "Why Sunday comes after Saturday #astronomy #india"

### Instagram Reels
- Same 60s vertical cut
- Add text overlays for silent viewing

## Required API Keys

| Service | Purpose | Cost |
|---------|---------|------|
| ElevenLabs | Voice narration | ~$22/mo Pro (1M chars) |
| Runway | AI video B-roll | ~$15/mo Standard (125 credits) |
| OR Kling AI | Alternative to Runway | ~$10/mo |

## File Structure
```
scripts/video/001-seven-days/
├── script-en.md          ← English script (done)
├── script-hi.md          ← Hindi script (done)
├── production-plan.md    ← This file
├── narration-en.mp3      ← Generated
├── narration-hi.mp3      ← Generated
├── scenes/               ← Remotion compositions
│   ├── S1-hook.tsx
│   ├── S2-planets.tsx
│   ├── S3-hora-wheel.tsx
│   ├── S4-skip3.tsx
│   ├── S5-crosscultural.tsx
│   ├── S6-app.tsx
│   └── S7-cta.tsx
├── broll/                ← AI-generated clips
├── music/                ← Background track
├── output/
│   ├── en-16x9.mp4
│   ├── en-9x16.mp4
│   ├── hi-16x9.mp4
│   └── hi-9x16.mp4
└── thumbnails/
    ├── youtube-en.png
    └── youtube-hi.png
```

## Next Videos (same pipeline)
1. India calculated Pi before Europe
2. Speed of Light in the Rig Veda  
3. Why Ekadashi fasting works
4. Your Dasha is your life's screenplay
5. Zero was invented for astronomy
