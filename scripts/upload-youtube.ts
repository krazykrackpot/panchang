/**
 * Upload video to YouTube using OAuth2 credentials.
 *
 * Usage:
 *   npx tsx scripts/upload-youtube.ts <video-path> <language>
 *
 * Example:
 *   npx tsx scripts/upload-youtube.ts public/videos/sade-sati-en.mp4 en
 *   npx tsx scripts/upload-youtube.ts public/videos/sade-sati-hi.mp4 hi
 *
 * Prerequisites:
 *   YOUTUBE_CLIENT_ID, YOUTUBE_CLIENT_SECRET, YOUTUBE_REFRESH_TOKEN in .env.local
 */

import { readFileSync, createReadStream, existsSync } from 'fs';
import path from 'path';

// Load .env.local
const envPath = path.resolve('.env.local');
if (existsSync(envPath)) {
  for (const line of readFileSync(envPath, 'utf-8').split('\n')) {
    const match = line.match(/^([^#=]+)=(.*)$/);
    if (match) {
      const key = match[1].trim();
      const value = match[2].trim();
      if (!process.env[key]) process.env[key] = value;
    }
  }
}

const CLIENT_ID = process.env.YOUTUBE_CLIENT_ID?.trim();
const CLIENT_SECRET = process.env.YOUTUBE_CLIENT_SECRET?.trim();
const REFRESH_TOKEN = process.env.YOUTUBE_REFRESH_TOKEN?.trim();

if (!CLIENT_ID || !CLIENT_SECRET || !REFRESH_TOKEN) {
  console.error('[youtube] Missing YOUTUBE_CLIENT_ID, YOUTUBE_CLIENT_SECRET, or YOUTUBE_REFRESH_TOKEN in .env.local');
  process.exit(1);
}

interface VideoMeta {
  title: string;
  description: string;
  tags: string[];
  categoryId: string;
  language: string;
}

const VIDEO_META: Record<string, VideoMeta> = {
  en: {
    title: "Sade Sati — Is It Real or Superstition? | Saturn's 7.5 Year Test Explained",
    description: `Sade Sati — साढ़े साती — is the most feared period in Vedic astrology. But is it real? Or just superstition?

In this video, we use pure mathematics to prove that the ancient sages knew Saturn's orbital period — 29.4 years — over 1,500 years before NASA confirmed it at 29.46 years. 99.8% accurate. Without telescopes.

How did they know?

🔢 The Math:
• Sade Sati = 7.5 years across 3 zodiac signs
• 7.5 ÷ 3 = 2.5 years per sign
• 12 signs × 2.5 = 30 years (Saturn's full orbit)
• NASA confirms: 29.46 years
• Surya Siddhanta (1,500+ years ago): 29.4 years

📖 What happens during Sade Sati:
• Phase 1: Pressure builds — finances, sleep, hidden anxieties
• Phase 2 (Peak): Saturn conjunct Moon — careers shift, relationships tested
• Phase 3: You emerge forged, refined, unbreakable

🪐 Check your Sade Sati status FREE:
https://dekhopanchang.com/en/sade-sati

🕉️ More Vedic astrology tools — all FREE:
• Kundali (Birth Chart): https://dekhopanchang.com/en/kundali
• Today's Panchang: https://dekhopanchang.com/en/panchang
• Compatibility Matching: https://dekhopanchang.com/en/matching

#SadeSati #Saturn #VedicAstrology #Jyotish #ShaniDev #Astrology #Kundali #Panchang #DekhoPanchang #SuryaSiddhanta #NASA #AncientWisdom`,
    tags: ['Sade Sati', 'Saturn', 'Vedic Astrology', 'Jyotish', 'Shani Dev', 'Astrology', 'Kundali', 'Panchang', 'Dekho Panchang', 'Surya Siddhanta', 'NASA', 'Ancient Wisdom', 'Hindu Astrology', 'Moon Sign', 'Birth Chart', 'Sidereal Zodiac'],
    categoryId: '27', // Education
    language: 'en',
  },
  hi: {
    title: 'साढ़े साती — सच या अंधविश्वास? | शनि की 7.5 साल की परीक्षा | Sade Sati Explained',
    description: `साढ़े साती — करोड़ों लोग इससे डरते हैं। लेकिन क्या ये सच में असर करती है? या सिर्फ अंधविश्वास है?

इस वीडियो में हम गणित से साबित करते हैं कि हमारे पूर्वजों ने शनि की कक्षा — 29.4 वर्ष — NASA से 1,500 साल पहले जान ली थी। 99.8% सटीक। बिना दूरबीन के।

उन्हें कैसे पता चला?

🔢 गणित:
• साढ़े साती = 3 राशियों में 7.5 साल
• 7.5 ÷ 3 = 2.5 साल प्रति राशि
• 12 राशि × 2.5 = 30 साल (शनि का पूरा चक्र)
• NASA: 29.46 वर्ष
• सूर्य सिद्धांत (1,500+ वर्ष पुराना): 29.4 वर्ष

📖 साढ़े साती में क्या होता है:
• चरण 1: दबाव बढ़ता है — पैसे, नींद, चिंता
• चरण 2 (चरम): शनि चंद्रमा पर — करियर बदलता है, रिश्ते टूटते हैं
• चरण 3: आप अटूट बनकर निकलते हैं

🪐 अपनी साढ़े साती जानें — मुफ़्त:
https://dekhopanchang.com/hi/sade-sati

🕉️ और वैदिक ज्योतिष टूल्स — सब मुफ़्त:
• कुंडली: https://dekhopanchang.com/hi/kundali
• आज का पंचांग: https://dekhopanchang.com/hi/panchang
• कुंडली मिलान: https://dekhopanchang.com/hi/matching

#साढ़ेसाती #शनि #वैदिकज्योतिष #ज्योतिष #ShaniDev #SadeSati #कुंडली #पंचांग #DekhoPanchang #सूर्यसिद्धांत #NASA`,
    tags: ['साढ़े साती', 'शनि', 'वैदिक ज्योतिष', 'ज्योतिष', 'Sade Sati', 'Saturn', 'Shani Dev', 'Vedic Astrology', 'Jyotish', 'कुंडली', 'पंचांग', 'Dekho Panchang', 'सूर्य सिद्धांत', 'NASA', 'Hindu Astrology'],
    categoryId: '27', // Education
    language: 'hi',
  },
};

async function getAccessToken(): Promise<string> {
  const res = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      client_id: CLIENT_ID!,
      client_secret: CLIENT_SECRET!,
      refresh_token: REFRESH_TOKEN!,
      grant_type: 'refresh_token',
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`[youtube] Token refresh failed (${res.status}): ${err}`);
  }

  const data = await res.json();
  return data.access_token;
}

async function uploadVideo(filePath: string, meta: VideoMeta, accessToken: string): Promise<string> {
  const fileSize = readFileSync(filePath).length;

  console.log(`[youtube] Initiating resumable upload (${(fileSize / 1024 / 1024).toFixed(1)}MB)...`);

  // Step 1: Initiate resumable upload
  const initRes = await fetch(
    'https://www.googleapis.com/upload/youtube/v3/videos?uploadType=resumable&part=snippet,status',
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json; charset=UTF-8',
        'X-Upload-Content-Length': String(fileSize),
        'X-Upload-Content-Type': 'video/mp4',
      },
      body: JSON.stringify({
        snippet: {
          title: meta.title,
          description: meta.description,
          tags: meta.tags,
          categoryId: meta.categoryId,
          defaultLanguage: meta.language,
          defaultAudioLanguage: meta.language,
        },
        status: {
          privacyStatus: 'public',
          selfDeclaredMadeForKids: false,
          embeddable: true,
        },
      }),
    }
  );

  if (!initRes.ok) {
    const err = await initRes.text();
    throw new Error(`[youtube] Upload init failed (${initRes.status}): ${err}`);
  }

  const uploadUrl = initRes.headers.get('location');
  if (!uploadUrl) throw new Error('[youtube] No upload URL in response');

  console.log(`[youtube] Uploading video...`);

  // Step 2: Upload the file
  const videoData = readFileSync(filePath);
  const uploadRes = await fetch(uploadUrl, {
    method: 'PUT',
    headers: {
      'Content-Type': 'video/mp4',
      'Content-Length': String(fileSize),
    },
    body: videoData,
  });

  if (!uploadRes.ok) {
    const err = await uploadRes.text();
    throw new Error(`[youtube] Upload failed (${uploadRes.status}): ${err}`);
  }

  const result = await uploadRes.json();
  const videoId = result.id;
  console.log(`[youtube] Uploaded! Video ID: ${videoId}`);
  console.log(`[youtube] URL: https://www.youtube.com/watch?v=${videoId}`);

  return videoId;
}

async function main() {
  const videoPath = process.argv[2];
  const lang = process.argv[3] || 'en';

  if (!videoPath) {
    console.error('Usage: npx tsx scripts/upload-youtube.ts <video-path> <en|hi>');
    process.exit(1);
  }

  const fullPath = path.resolve(videoPath);
  if (!existsSync(fullPath)) {
    console.error(`[youtube] File not found: ${fullPath}`);
    process.exit(1);
  }

  const meta = VIDEO_META[lang];
  if (!meta) {
    console.error(`[youtube] Unknown language: ${lang}. Use 'en' or 'hi'`);
    process.exit(1);
  }

  console.log(`[youtube] Title: ${meta.title}`);
  console.log(`[youtube] Language: ${lang}`);
  console.log(`[youtube] File: ${fullPath}`);
  console.log('');

  const accessToken = await getAccessToken();
  console.log('[youtube] Auth OK');

  await uploadVideo(fullPath, meta, accessToken);
}

main().catch((err) => {
  console.error('[youtube] Fatal:', err);
  process.exit(1);
});
