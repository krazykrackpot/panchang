/**
 * Google Cloud Text-to-Speech — narration generator
 *
 * Uses WaveNet voices for natural-sounding narration.
 * Free tier: 1M WaveNet chars/month, 4M Standard chars/month.
 *
 * Setup:
 *   1. Enable Cloud TTS API: https://console.cloud.google.com/apis/library/texttospeech.googleapis.com
 *   2. Create API key: https://console.cloud.google.com/apis/credentials
 *   3. Add to .env.local: GOOGLE_CLOUD_TTS_KEY=your_key_here
 *
 * Usage:
 *   npx tsx scripts/video/lib/google-tts.ts --lang en --input scripts/video/001-seven-days/narration-en.txt --output scripts/video/001-seven-days/narration-en.mp3
 */

import { writeFileSync, readFileSync, mkdirSync } from 'fs';
import { dirname } from 'path';

// ---------------------------------------------------------------------------
// Voice configs — best quality WaveNet voices for each language
// ---------------------------------------------------------------------------

interface VoiceConfig {
  languageCode: string;
  name: string;
  label: string;
  speakingRate: number;
}

const VOICES: Record<string, VoiceConfig> = {
  en: {
    languageCode: 'en-IN',
    name: 'en-IN-Wavenet-D', // Male, Indian English, deep and authoritative
    label: 'English (Indian)',
    speakingRate: 0.92, // slightly slower for educational content
  },
  hi: {
    languageCode: 'hi-IN',
    name: 'hi-IN-Wavenet-C', // Male, Hindi, clear and warm
    label: 'Hindi',
    speakingRate: 0.90,
  },
  ta: {
    languageCode: 'ta-IN',
    name: 'ta-IN-Wavenet-C', // Male, Tamil
    label: 'Tamil',
    speakingRate: 0.90,
  },
  bn: {
    languageCode: 'bn-IN',
    name: 'bn-IN-Wavenet-B', // Male, Bengali
    label: 'Bengali',
    speakingRate: 0.90,
  },
  te: {
    languageCode: 'te-IN',
    name: 'te-IN-Standard-B', // Male, Telugu (WaveNet may not be available)
    label: 'Telugu',
    speakingRate: 0.90,
  },
};

// ---------------------------------------------------------------------------
// API call
// ---------------------------------------------------------------------------

async function synthesize(
  text: string,
  lang: string,
  outputPath: string,
): Promise<void> {
  const apiKey = process.env.GOOGLE_CLOUD_TTS_KEY;
  if (!apiKey) {
    console.error('Missing GOOGLE_CLOUD_TTS_KEY in environment. Set it in .env.local');
    console.error('Get one at: https://console.cloud.google.com/apis/credentials');
    process.exit(1);
  }

  const voice = VOICES[lang];
  if (!voice) {
    console.error(`No voice config for language "${lang}". Available: ${Object.keys(VOICES).join(', ')}`);
    process.exit(1);
  }

  console.log(`Synthesizing ${voice.label} narration (${text.length} chars)...`);

  // Split into chunks of 5000 chars (API limit per request)
  const MAX_CHARS = 4800;
  const chunks: string[] = [];
  let remaining = text;
  while (remaining.length > 0) {
    if (remaining.length <= MAX_CHARS) {
      chunks.push(remaining);
      break;
    }
    // Find last sentence boundary within limit
    const slice = remaining.slice(0, MAX_CHARS);
    const lastPeriod = Math.max(slice.lastIndexOf('. '), slice.lastIndexOf('। '), slice.lastIndexOf('? '), slice.lastIndexOf('! '));
    const breakAt = lastPeriod > 0 ? lastPeriod + 2 : MAX_CHARS;
    chunks.push(remaining.slice(0, breakAt));
    remaining = remaining.slice(breakAt);
  }

  console.log(`Split into ${chunks.length} chunk(s)`);

  const audioBuffers: Buffer[] = [];

  for (let i = 0; i < chunks.length; i++) {
    console.log(`  Chunk ${i + 1}/${chunks.length} (${chunks[i].length} chars)...`);

    const response = await fetch(
      `https://texttospeech.googleapis.com/v1/text:synthesize?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          input: { text: chunks[i] },
          voice: {
            languageCode: voice.languageCode,
            name: voice.name,
          },
          audioConfig: {
            audioEncoding: 'MP3',
            speakingRate: voice.speakingRate,
            pitch: 0, // natural pitch
            volumeGainDb: 0,
            effectsProfileId: ['large-home-entertainment-class-device'], // rich bass
          },
        }),
      },
    );

    if (!response.ok) {
      const err = await response.text();
      console.error(`API error (${response.status}):`, err);
      process.exit(1);
    }

    const data = await response.json() as { audioContent: string };
    audioBuffers.push(Buffer.from(data.audioContent, 'base64'));
  }

  // Concatenate audio buffers
  const combined = Buffer.concat(audioBuffers);
  mkdirSync(dirname(outputPath), { recursive: true });
  writeFileSync(outputPath, combined);
  console.log(`✓ Saved: ${outputPath} (${(combined.length / 1024).toFixed(0)} KB)`);
}

// ---------------------------------------------------------------------------
// Extract narration text from script markdown
// ---------------------------------------------------------------------------

function extractNarration(scriptPath: string): string {
  const content = readFileSync(scriptPath, 'utf-8');
  // Extract all text between > quotes (narration blocks)
  const lines = content.split('\n');
  const narration: string[] = [];
  for (const line of lines) {
    const match = line.match(/^>\s*"(.+)"$/);
    if (match) {
      narration.push(match[1]);
    } else if (line.startsWith('> ')) {
      // Multi-line narration without quotes
      const text = line.replace(/^>\s*/, '').replace(/^"/, '').replace(/"$/, '');
      if (text.length > 5) narration.push(text);
    }
  }
  return narration.join('\n\n');
}

// ---------------------------------------------------------------------------
// CLI
// ---------------------------------------------------------------------------

async function main() {
  const args = process.argv.slice(2);
  const langIdx = args.indexOf('--lang');
  const inputIdx = args.indexOf('--input');
  const outputIdx = args.indexOf('--output');
  const textIdx = args.indexOf('--text');

  const lang = langIdx >= 0 ? args[langIdx + 1] : 'en';
  const outputPath = outputIdx >= 0 ? args[outputIdx + 1] : `scripts/video/output/narration-${lang}.mp3`;

  let text: string;
  if (textIdx >= 0) {
    text = args[textIdx + 1];
  } else if (inputIdx >= 0) {
    const inputPath = args[inputIdx + 1];
    if (inputPath.endsWith('.md')) {
      text = extractNarration(inputPath);
    } else {
      text = readFileSync(inputPath, 'utf-8');
    }
  } else {
    console.log('Usage:');
    console.log('  npx tsx scripts/video/lib/google-tts.ts --lang en --input script-en.md --output narration-en.mp3');
    console.log('  npx tsx scripts/video/lib/google-tts.ts --lang hi --text "नमस्ते" --output test.mp3');
    console.log(`\nAvailable languages: ${Object.keys(VOICES).join(', ')}`);
    process.exit(0);
  }

  if (!text.trim()) {
    console.error('No narration text found. Check input file format.');
    process.exit(1);
  }

  console.log(`\nLanguage: ${VOICES[lang]?.label || lang}`);
  console.log(`Text length: ${text.length} chars`);
  console.log(`Output: ${outputPath}\n`);

  await synthesize(text, lang, outputPath);
}

main().catch(err => {
  console.error('Fatal:', err);
  process.exit(1);
});
