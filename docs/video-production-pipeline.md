# Video Production Pipeline — Technical Specification

**Date:** 2026-05-02
**Status:** Design phase

---

## Pipeline Overview

```
                    ┌─────────────┐
                    │  1. TOPIC    │  User picks topic OR auto-suggested from content
                    │   SELECT    │
                    └──────┬──────┘
                           ↓
                    ┌─────────────┐
                    │  2. SCRIPT  │  Learn page → AI narration script
                    │  GENERATE   │  Multiple styles: educational / dramatic / casual
                    └──────┬──────┘
                           ↓
                    ┌─────────────┐
                    │  3. REVIEW  │  User reviews/edits script in terminal
                    │   SCRIPT    │  Can adjust tone, length, emphasis
                    └──────┬──────┘
                           ↓
              ┌────────────┼────────────┐
              ↓            ↓            ↓
       ┌────────────┐ ┌─────────┐ ┌──────────┐
       │ 4a. VOICE  │ │ 4b. VFX │ │ 4c.MUSIC │  All run in parallel
       │  Generate  │ │ Generate│ │  Select   │
       │ (AI TTS)   │ │ (HTML)  │ │ (library) │
       └─────┬──────┘ └────┬────┘ └─────┬────┘
             └──────────┬───┘            │
                        ↓               ↓
                 ┌─────────────┐  ┌──────────┐
                 │ 5. COMPOSE  │←─│  Music   │
                 │   (FFmpeg)  │  │  layer   │
                 └──────┬──────┘  └──────────┘
                        ↓
                 ┌─────────────┐
                 │ 6. PREVIEW  │  User watches draft in browser
                 │  & ITERATE  │  Can change: music / voice / pacing / visuals
                 └──────┬──────┘
                        ↓
                 ┌─────────────┐
                 │ 7. APPROVE  │  User explicitly approves
                 │  & PUBLISH  │  Then posts to YT/Insta/Twitter (manual OR API)
                 └─────────────┘
```

---

## Step 1: Topic Selection

### Auto-suggestion engine

An API route that suggests the next best video topic based on:
- Search volume (GSC data — which learn pages get impressions)
- Content freshness (upcoming festivals, imminent transits)
- Gap analysis (which topics we haven't covered in video yet)
- Trending (seasonal — Navratri in Sep, Diwali in Oct, etc.)

### Manual selection

User can also specify:
```
! claude video create --topic "27 nakshatras" --type short --language hi
! claude video create --topic "jupiter-in-cancer-2026" --type explainer --language en
! claude video create --topic "daily-panchang" --language hi  # auto-detects type
```

### Topic → Content mapping

The system finds the relevant learn page(s) and extracts content:
```ts
interface VideoTopic {
  slug: string;
  title: string;
  sourcePages: string[];     // learn page paths to pull content from
  type: 'short' | 'explainer' | 'course';
  language: 'en' | 'hi' | 'both';
  targetDuration: number;    // seconds
  category: 'panchang' | 'kundali' | 'transit' | 'festival' | 'dosha' | 'remedy' | 'general';
}
```

---

## Step 2: Script Generation

### Script structure

```ts
interface VideoScript {
  meta: {
    topic: string;
    type: 'short' | 'explainer' | 'course';
    language: 'en' | 'hi';
    estimatedDuration: number;
    style: ScriptStyle;
  };
  scenes: Scene[];
}

interface Scene {
  id: number;
  duration: number;          // seconds
  narration: string;         // voiceover text
  visualType: VisualType;    // what to show on screen
  visualData: any;           // data for the visual
  textOverlay?: string;      // text shown on screen (different from narration)
  transition: 'cut' | 'fade' | 'zoom' | 'slide' | 'wipe';
  musicMood?: MusicMood;     // if mood changes within the video
}

type VisualType = 
  | 'title_card'        // title text with celestial background
  | 'zodiac_wheel'      // our animated zodiac ring
  | 'kundali_chart'     // north indian diamond chart
  | 'planet_showcase'   // single planet with glow + facts
  | 'sign_carousel'     // cycling through 12 signs
  | 'nakshatra_card'    // nakshatra spotlight
  | 'text_reveal'       // kinetic typography
  | 'comparison'        // side-by-side (e.g., Vedic vs Western)
  | 'timeline'          // horizontal timeline (dasha, transit)
  | 'data_table'        // animated table appearing row by row
  | 'quote'             // Sanskrit shloka with translation
  | 'cta'               // call-to-action screen
  | 'custom_svg'        // one of our SVG icons, animated
  | 'screen_recording'  // capture of our actual website
  ;

type ScriptStyle = 
  | 'educational'       // calm, professorial, "Let me explain..."
  | 'dramatic'          // intense, "What if I told you..."
  | 'storyteller'       // kathavachak style, "एक समय की बात है..."
  | 'casual'            // friendly, "Hey, did you know..."
  | 'documentary'       // BBC-style, "In the ancient temples of India..."
  ;

type MusicMood = 
  | 'mystical'          // veena + ambient pads
  | 'dramatic'          // dhol + tension strings  
  | 'celebratory'       // shehnai + tabla
  | 'peaceful'          // flute + singing bowls
  | 'energetic'         // fast tabla + sitar
  | 'reverent'          // temple bells + chanting ambient
  | 'cosmic'            // synthesizer + space ambient
  ;
```

### Script generation via Claude API

```ts
async function generateScript(topic: VideoTopic, style: ScriptStyle): Promise<VideoScript> {
  // 1. Read the source learn page content
  const sourceContent = await readLearnPages(topic.sourcePages);
  
  // 2. Generate script via Claude API
  const prompt = `
    You are a Vedic astrology video script writer. Create a ${topic.type} video script 
    (${topic.targetDuration} seconds) about "${topic.title}" in ${topic.language}.
    
    Style: ${style}
    ${style === 'storyteller' ? 'Use traditional kathavachak Hindi phrases.' : ''}
    ${style === 'dramatic' ? 'Open with a surprising hook. Build tension.' : ''}
    
    Source content:
    ${sourceContent}
    
    Output a JSON array of scenes with: narration, visualType, textOverlay, duration, transition.
    Each scene should be 3-8 seconds for Shorts, 10-30 seconds for Explainers.
    
    RULES:
    - Hook in first 3 seconds (question, surprising fact, or bold statement)
    - One concept per scene — don't overload
    - End with a clear CTA to dekhopanchang.com
    - For Hindi: use natural spoken Hindi, not Sanskrit-heavy academic Hindi
    - Total narration word count: ~${topic.targetDuration * 2.5} words (2.5 words/second)
  `;
  
  return await claudeAPI.generate(prompt);
}
```

### Style presets

| Style | Best for | Voice tone | Music | Pacing |
|---|---|---|---|---|
| Educational | Explainers, courses | Calm, clear, authoritative | Soft ambient | Moderate |
| Dramatic | Shorts, hooks | Intense, building, surprising | Dramatic strings | Fast |
| Storyteller | Vrat Kathas, mythology | Warm, narrative, traditional | Sitar/veena | Slow-medium |
| Casual | Social media tips | Friendly, conversational | Light acoustic | Fast |
| Documentary | History, traditions | Measured, BBC-style gravitas | Cinematic | Moderate |

---

## Step 3: Script Review & Edit

### Interactive review in terminal

```
╔══════════════════════════════════════════════════╗
║  VIDEO SCRIPT: "27 Nakshatras Explained" (60s)  ║
║  Style: dramatic | Language: hi | Scenes: 8     ║
╠══════════════════════════════════════════════════╣

Scene 1 [0:00-0:04] — title_card
  Narration: "क्या आप जानते हैं कि आपका नक्षत्र आपकी कुण्डली से भी ज़्यादा बताता है?"
  Text: "27 नक्षत्र — आपका ब्रह्माण्डीय DNA"
  Transition: fade

Scene 2 [0:04-0:12] — zodiac_wheel (animated, nakshatras highlighted)
  Narration: "राशिचक्र के 360 अंशों को 27 नक्षत्रों में बांटा गया है — प्रत्येक 13 अंश 20 कला का..."
  Text: "360° ÷ 27 = 13°20' प्रति नक्षत्र"
  Transition: zoom

[... more scenes ...]

Actions:
  [E] Edit a scene    [S] Change style    [M] Change music mood
  [V] Change voice    [R] Regenerate all  [A] Approve & proceed
  [P] Preview audio   [D] Adjust duration [Q] Quit

> _
```

### Iteration options:
- **Edit scene:** modify narration text, visual type, or duration for a specific scene
- **Change style:** regenerate entire script in a different style
- **Change music mood:** adjust the background music category
- **Change voice:** switch between available AI voices
- **Regenerate:** completely new script from the same source content
- **Adjust duration:** make it shorter/longer (add/remove scenes)

---

## Step 4a: Voice Generation

### AI TTS Options (ranked by quality for Hindi)

| Provider | Hindi Quality | Cost | Latency | API |
|---|---|---|---|---|
| ElevenLabs | Excellent — natural, emotional | $0.30/min | 5s/min | REST |
| Google Cloud TTS | Good — clear, slightly robotic | $0.016/min | 2s/min | REST |
| Azure Cognitive | Good — many Hindi voices | $0.016/min | 2s/min | REST |
| OpenAI TTS | Good — natural but limited Hindi | $0.015/min | 3s/min | REST |

### Voice profiles

```ts
interface VoiceProfile {
  id: string;
  name: string;
  provider: 'elevenlabs' | 'google' | 'azure' | 'openai';
  language: 'hi' | 'en' | 'sa';
  gender: 'male' | 'female';
  style: string;       // "pandit", "professor", "narrator", "friendly"
  voiceId: string;     // provider-specific voice ID
  sampleUrl?: string;  // preview audio
}

const VOICE_PROFILES: VoiceProfile[] = [
  { id: 'pandit-m', name: 'Pandit Ji', provider: 'elevenlabs', language: 'hi', gender: 'male', style: 'pandit — warm, authoritative, devotional', voiceId: '...' },
  { id: 'guru-m', name: 'Guru Voice', provider: 'elevenlabs', language: 'hi', gender: 'male', style: 'professor — calm, clear, educational', voiceId: '...' },
  { id: 'storyteller-f', name: 'Katha Vachak', provider: 'elevenlabs', language: 'hi', gender: 'female', style: 'storyteller — warm, narrative, emotional', voiceId: '...' },
  { id: 'narrator-en', name: 'Narrator', provider: 'elevenlabs', language: 'en', gender: 'male', style: 'documentary — deep, measured, BBC-style', voiceId: '...' },
  { id: 'teacher-en', name: 'Teacher', provider: 'openai', language: 'en', gender: 'female', style: 'friendly — conversational, approachable', voiceId: 'nova' },
];
```

### Voice generation process

```ts
async function generateVoiceover(script: VideoScript, profile: VoiceProfile): Promise<AudioSegment[]> {
  const segments: AudioSegment[] = [];
  
  for (const scene of script.scenes) {
    // Add SSML markers for emphasis, pauses, speed
    const ssml = addSSMLMarkers(scene.narration, script.meta.style);
    
    // Generate audio via chosen provider
    const audio = await ttsProviders[profile.provider].synthesize({
      text: ssml,
      voiceId: profile.voiceId,
      speed: scene.duration < 5 ? 1.1 : 1.0,  // slightly faster for short scenes
      pitch: 0,
      format: 'mp3',
    });
    
    segments.push({
      sceneId: scene.id,
      audio,
      duration: getAudioDuration(audio),
      targetDuration: scene.duration,
    });
  }
  
  return segments;
}
```

---

## Step 4b: Visual Frame Generation

### Remotion-based rendering

Each `VisualType` maps to a Remotion component:

```ts
// src/video/components/TitleCard.tsx
export const TitleCard: React.FC<{ title: string; subtitle?: string; style: string }> = ...

// src/video/components/ZodiacWheel.tsx  
export const ZodiacWheel: React.FC<{ highlightSign?: number; animateRotation: boolean }> = ...

// src/video/components/KundaliChart.tsx
export const KundaliChart: React.FC<{ planets: PlanetPosition[]; animateEntry: boolean }> = ...

// src/video/components/TextReveal.tsx
export const TextReveal: React.FC<{ text: string; style: 'typewriter' | 'fade' | 'slide' }> = ...

// src/video/components/NakshatraCard.tsx
export const NakshatraCard: React.FC<{ id: number; showDetails: boolean }> = ...

// etc.
```

### Visual themes

```ts
type VideoTheme = 'celestial' | 'temple' | 'minimal' | 'neon';

const THEMES = {
  celestial: {
    background: 'linear-gradient(135deg, #0a0e27, #1a1040, #0a0e27)',
    titleColor: '#f0d48a',
    textColor: '#e6e2d8',
    accentColor: '#d4a853',
    particleEffect: 'stars',
  },
  temple: {
    background: 'linear-gradient(135deg, #1a0a00, #2d1500, #0a0500)',
    titleColor: '#f0d48a',
    textColor: '#e6d5c3',
    accentColor: '#c4873b',
    particleEffect: 'diyas',
  },
  minimal: {
    background: '#0a0e27',
    titleColor: '#ffffff',
    textColor: '#cccccc',
    accentColor: '#d4a853',
    particleEffect: 'none',
  },
  neon: {
    background: '#000000',
    titleColor: '#00ff88',
    textColor: '#ffffff',
    accentColor: '#ff6b35',
    particleEffect: 'glow',
  },
};
```

---

## Step 4c: Music Selection

### Music library structure

```
public/audio/music/
├── mystical/
│   ├── veena-ambient-01.mp3      (2:30, loop-safe)
│   ├── sitar-meditation-01.mp3   (3:00, loop-safe)
│   └── cosmic-drone-01.mp3      (4:00, loop-safe)
├── dramatic/
│   ├── dhol-tension-01.mp3       (1:30, builds)
│   ├── strings-reveal-01.mp3     (2:00, crescendo)
│   └── tabla-intense-01.mp3     (2:00, loop-safe)
├── celebratory/
│   ├── shehnai-joy-01.mp3        (2:00, loop-safe)
│   └── dhol-celebration-01.mp3  (1:30, loop-safe)
├── peaceful/
│   ├── flute-morning-01.mp3      (3:00, loop-safe)
│   ├── bowls-meditation-01.mp3  (4:00, loop-safe)
│   └── nature-ambient-01.mp3   (5:00, loop-safe)
├── energetic/
│   ├── tabla-fast-01.mp3         (1:30, loop-safe)
│   └── fusion-beat-01.mp3      (2:00, loop-safe)
├── reverent/
│   ├── bells-chanting-01.mp3     (3:00, loop-safe)
│   └── temple-morning-01.mp3   (4:00, loop-safe)
└── sfx/
    ├── whoosh-01.mp3             (0.5s)
    ├── reveal-hit-01.mp3        (1s)
    ├── bell-single-01.mp3       (1s)
    ├── transition-swoosh-01.mp3 (0.5s)
    └── intro-jingle.mp3        (3s, branded)
```

### Auto-selection logic

```ts
function selectMusic(category: string, mood: MusicMood, duration: number): MusicTrack {
  // Category-specific defaults
  const CATEGORY_MOODS: Record<string, MusicMood> = {
    panchang: 'peaceful',
    kundali: 'mystical',
    transit: 'cosmic',
    festival: 'celebratory',
    dosha: 'dramatic',
    remedy: 'reverent',
    general: 'mystical',
  };
  
  const effectiveMood = mood || CATEGORY_MOODS[category] || 'mystical';
  const tracks = musicLibrary.getByMood(effectiveMood);
  
  // Pick track that's closest to video duration (or loop-safe)
  return tracks.find(t => t.duration >= duration || t.loopSafe) || tracks[0];
}
```

### Music mixing

```ts
interface MusicMix {
  backgroundTrack: string;     // main background music
  backgroundVolume: number;    // 0.0-1.0 (typically 0.15-0.25 behind narration)
  fadeInDuration: number;      // seconds
  fadeOutDuration: number;     // seconds
  duckingEnabled: boolean;     // lower music when narration plays
  duckingLevel: number;        // volume during narration (typically 0.08-0.12)
  sfxTimings: { time: number; sfx: string; volume: number }[];
}
```

---

## Step 5: Composition (FFmpeg)

### Composition pipeline

```bash
# 1. Render visual frames via Remotion
npx remotion render src/video/compositions/Short.tsx \
  --props='{"script": "..."}' \
  --output /tmp/video/visuals.mp4 \
  --codec h264

# 2. Combine narration segments into single audio
ffmpeg -i "concat:scene1.mp3|scene2.mp3|..." -c copy /tmp/video/narration.mp3

# 3. Mix background music (ducking behind narration)
ffmpeg -i /tmp/video/narration.mp3 -i /tmp/video/music.mp3 \
  -filter_complex "[1]volume=0.15[music];[0][music]amix=inputs=2:duration=longest" \
  /tmp/video/mixed-audio.mp3

# 4. Combine visuals + mixed audio
ffmpeg -i /tmp/video/visuals.mp4 -i /tmp/video/mixed-audio.mp3 \
  -c:v copy -c:a aac -shortest \
  /tmp/video/final.mp4

# 5. Add subtitles (burned in)
ffmpeg -i /tmp/video/final.mp4 \
  -vf "subtitles=/tmp/video/subs.srt:force_style='FontSize=24,PrimaryColour=&H00d4a853'" \
  /tmp/video/final-with-subs.mp4
```

### Output formats

| Platform | Resolution | Aspect | Max Duration | File |
|---|---|---|---|---|
| YouTube Shorts | 1080x1920 | 9:16 | 60s | MP4 H.264 |
| Instagram Reels | 1080x1920 | 9:16 | 90s | MP4 H.264 |
| YouTube (long) | 1920x1080 | 16:9 | unlimited | MP4 H.264 |
| Twitter | 1280x720 | 16:9 | 140s | MP4 H.264 |
| Website embed | 1280x720 | 16:9 | unlimited | MP4 H.264 |

---

## Step 6: Preview & Iterate

### Browser-based preview

Generate an HTML preview page that shows:
- Video player with the composed draft
- Script text alongside (synced to playback)
- Quick action buttons:

```
╔═══════════════════════════════════════════════════════════╗
║  🎬 PREVIEW: "27 Nakshatras" (58s, Hindi, Dramatic)     ║
╠═══════════════════════════════════════════════════════════╣
║                                                           ║
║  [▶ VIDEO PLAYER - 1080x1920]                            ║
║                                                           ║
║  Current scene: 3/8 — zodiac_wheel                       ║
║  "राशिचक्र के 360 अंशों को..."                              ║
║                                                           ║
╠═══════════════════════════════════════════════════════════╣
║  OPTIONS:                                                 ║
║                                                           ║
║  🎵 Music:   [Mystical ▾]  Volume: [███░░] 20%           ║
║  🗣 Voice:   [Pandit Ji ▾] Speed: [██░░░] 1.0x           ║
║  🎨 Theme:   [Celestial ▾]                               ║
║  📝 Style:   [Dramatic ▾]                                ║
║                                                           ║
║  [🔄 Regenerate]  [✏️ Edit Script]  [✅ Approve]          ║
║  [📥 Download]    [❌ Discard]                            ║
╚═══════════════════════════════════════════════════════════╝
```

### Iteration loop

Each change triggers only the affected step:
- Change music → re-mix audio only (30 seconds)
- Change voice → re-generate TTS + re-mix (2 minutes)
- Edit script text → re-generate TTS + re-render affected scenes (3 minutes)
- Change style → full regeneration (5 minutes)
- Change theme → re-render visuals only (2 minutes)

---

## Step 7: Approve & Publish

### Approval gate

User must explicitly type "APPROVE" or click approve button. No auto-posting.

### Publishing options

```
Video approved! Where to publish?

  [1] YouTube (upload via API — requires OAuth)
  [2] Instagram Reel (download MP4, manual upload)
  [3] Twitter (upload via API — configured)
  [4] Website embed (save to /public/videos/)
  [5] All of the above
  [6] Just download MP4

  [D] Schedule for later (pick date/time)

> _
```

### YouTube upload automation

```ts
// Uses YouTube Data API v3
async function uploadToYouTube(video: FinalVideo, metadata: VideoMetadata) {
  const youtube = google.youtube({ version: 'v3', auth: oauthClient });
  
  await youtube.videos.insert({
    part: ['snippet', 'status'],
    requestBody: {
      snippet: {
        title: metadata.title,          // "27 Nakshatras — Your Cosmic DNA | Dekho Panchang"
        description: metadata.description, // Full description with timestamps + links
        tags: metadata.tags,            // ['vedic astrology', 'nakshatras', 'jyotish', ...]
        categoryId: '22',              // People & Blogs (or 27: Education)
        defaultLanguage: metadata.language,
        defaultAudioLanguage: metadata.language,
      },
      status: {
        privacyStatus: 'public',       // or 'unlisted' for review
        selfDeclaredMadeForKids: false,
        embeddable: true,
      },
    },
    media: {
      body: fs.createReadStream(video.filePath),
    },
  });
}
```

### Metadata generation

Auto-generated from script:
```ts
interface VideoMetadata {
  title: string;              // "27 Nakshatras — आपका ब्रह्माण्डीय DNA | Dekho Panchang"
  description: string;        // timestamps, links to learn pages, hashtags
  tags: string[];             // SEO tags
  thumbnail?: string;         // auto-generated from title card frame
  playlistId?: string;        // add to "Learn Jyotish" playlist
  endScreen?: {               // "Subscribe" + "Watch next" cards
    subscribeAt: number;      // timestamp to show subscribe button
    nextVideoAt: number;      // timestamp to show next video
  };
}
```

---

## File Structure

```
src/video/
├── config/
│   ├── voices.ts              # Voice profile definitions
│   ├── music.ts               # Music library metadata
│   ├── themes.ts              # Visual theme definitions
│   └── styles.ts              # Script style presets
├── pipeline/
│   ├── topic-selector.ts      # Auto-suggest topics from content
│   ├── script-generator.ts    # Content → narration script via Claude API
│   ├── voice-generator.ts     # Script → TTS audio segments
│   ├── visual-renderer.ts     # Script → Remotion visual frames
│   ├── music-selector.ts      # Auto-select + mix background music
│   ├── composer.ts            # FFmpeg composition
│   ├── preview-server.ts      # Browser-based preview
│   └── publisher.ts           # YouTube/Instagram/Twitter upload
├── components/                 # Remotion visual components
│   ├── TitleCard.tsx
│   ├── ZodiacWheel.tsx
│   ├── KundaliChart.tsx
│   ├── NakshatraCard.tsx
│   ├── TextReveal.tsx
│   ├── SignCarousel.tsx
│   ├── Timeline.tsx
│   ├── DataTable.tsx
│   ├── Quote.tsx
│   ├── CTA.tsx
│   └── Transitions.tsx
├── compositions/               # Full video compositions
│   ├── Short.tsx              # 30-60s vertical
│   ├── Explainer.tsx          # 5-8min horizontal
│   └── Course.tsx             # 20-30min horizontal
├── templates/
│   ├── short-didyouknow.json  # Pre-built script template
│   ├── short-yoursign.json
│   ├── short-dailypanchang.json
│   ├── explainer-topic.json
│   └── course-module.json
└── assets/
    ├── fonts/                 # Cinzel, Inter, Noto Devanagari
    ├── music/                 # Royalty-free tracks by mood
    ├── sfx/                   # Sound effects
    └── overlays/              # Watermarks, logos, lower-thirds
```

---

## API Routes

```
POST /api/video/create          # Start video creation pipeline
  body: { topic, type, language, style, voice, music, theme }
  returns: { jobId, status: 'generating_script' }

GET  /api/video/status/:jobId   # Check pipeline progress
  returns: { status, currentStep, script?, previewUrl? }

POST /api/video/edit/:jobId     # Edit script or settings
  body: { scenes?, style?, voice?, music?, theme? }
  returns: { status: 'regenerating' }

POST /api/video/approve/:jobId  # Approve for publishing
  body: { platforms: ['youtube', 'instagram'] }
  returns: { status: 'publishing', urls: {} }

GET  /api/video/library         # List all created videos
  returns: { videos: [], stats: { total, published, views } }
```

---

## Cost Model

| Component | Cost per Short (60s) | Cost per Explainer (5min) |
|---|---|---|
| Script (Claude API) | $0.02 | $0.10 |
| Voice (ElevenLabs) | $0.15 | $1.50 |
| Visuals (Remotion render) | $0.00 (local) | $0.00 |
| Music | $0.00 (royalty-free) | $0.00 |
| FFmpeg composition | $0.00 (local) | $0.00 |
| YouTube upload | $0.00 | $0.00 |
| **Total** | **~$0.17** | **~$1.60** |

With Google Cloud TTS instead of ElevenLabs:
| **Total (budget)** | **~$0.03** | **~$0.18** |

---

## Quality Guardrails

1. **No video published without explicit user approval**
2. **Script accuracy check:** AI-generated scripts are reviewed against source learn page
3. **Sanskrit/Devanagari verification:** pronunciation check for mantras/shlokas
4. **Music licensing:** only royalty-free tracks from verified sources
5. **Brand consistency:** all videos use Dekho Panchang intro jingle + watermark
6. **Subtitles mandatory:** burned-in captions for accessibility + muted autoplay
7. **SEO metadata:** auto-generated but user-reviewed before publish
8. **A/B testing:** for Shorts, generate 2 thumbnail variants, publish the better performer
