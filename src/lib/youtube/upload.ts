/**
 * YouTube Upload Utility — uploads Shorts to the @dekhopanchang channel.
 *
 * Uses YouTube Data API v3 via raw fetch (no googleapis package — it's 50MB+
 * and causes OOM during tsc). OAuth2 refresh token flow handled manually.
 *
 * Required env vars:
 *   YOUTUBE_CLIENT_ID, YOUTUBE_CLIENT_SECRET, YOUTUBE_REFRESH_TOKEN
 */

const TOKEN_URL = 'https://oauth2.googleapis.com/token';
const UPLOAD_URL = 'https://www.googleapis.com/upload/youtube/v3/videos?uploadType=resumable&part=snippet,status';

/** Exchange refresh token for a fresh access token */
async function getAccessToken(): Promise<string> {
  const clientId = process.env.YOUTUBE_CLIENT_ID?.trim();
  const clientSecret = process.env.YOUTUBE_CLIENT_SECRET?.trim();
  const refreshToken = process.env.YOUTUBE_REFRESH_TOKEN?.trim();

  if (!clientId || !clientSecret || !refreshToken) {
    throw new Error('[youtube] Missing YOUTUBE_CLIENT_ID, YOUTUBE_CLIENT_SECRET, or YOUTUBE_REFRESH_TOKEN');
  }

  const res = await fetch(TOKEN_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      client_id: clientId,
      client_secret: clientSecret,
      refresh_token: refreshToken,
      grant_type: 'refresh_token',
    }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`[youtube] Token refresh failed (${res.status}): ${text}`);
  }

  const data = await res.json();
  return data.access_token;
}

export interface YouTubeUploadOptions {
  /** Video file as Buffer */
  videoBuffer: Buffer;
  /** Title (max 100 chars) */
  title: string;
  /** Description */
  description: string;
  /** Tags for discovery */
  tags: string[];
  /** Category ID — 22 = "People & Blogs", 27 = "Education" */
  categoryId?: string;
  /** Privacy: 'public' | 'private' | 'unlisted' */
  privacy?: 'public' | 'private' | 'unlisted';
  /** Whether this is a Short (adds #Shorts tag) */
  isShort?: boolean;
}

/**
 * Upload a video to YouTube using the resumable upload protocol.
 * Returns the video ID on success.
 */
export async function uploadToYouTube(opts: YouTubeUploadOptions): Promise<string> {
  const accessToken = await getAccessToken();

  let tags = [...opts.tags];
  if (opts.isShort && !tags.includes('#Shorts')) {
    tags.push('#Shorts');
  }
  // YouTube API limit: total tag string must be ≤500 chars
  // Trim tags from the end until within limit
  while (tags.join(',').length > 490 && tags.length > 1) {
    tags.pop();
  }
  // Remove any tags with characters YouTube rejects (< > are banned)
  tags = tags.filter(t => !/<|>/.test(t));

  const metadata = {
    snippet: {
      title: opts.title,
      description: opts.description,
      tags,
      categoryId: opts.categoryId || '27', // Education
      defaultLanguage: 'en',
    },
    status: {
      privacyStatus: opts.privacy || 'public',
      selfDeclaredMadeForKids: false,
    },
  };

  // Step 1: Initiate resumable upload — get the upload URI
  const initRes = await fetch(UPLOAD_URL, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json; charset=UTF-8',
      'X-Upload-Content-Type': 'video/mp4',
      'X-Upload-Content-Length': String(opts.videoBuffer.byteLength),
    },
    body: JSON.stringify(metadata),
  });

  if (!initRes.ok) {
    const text = await initRes.text();
    throw new Error(`[youtube] Upload init failed (${initRes.status}): ${text}`);
  }

  const uploadUri = initRes.headers.get('location');
  if (!uploadUri) {
    throw new Error('[youtube] No upload URI returned from init');
  }

  // Step 2: Upload the video bytes
  const uploadRes = await fetch(uploadUri, {
    method: 'PUT',
    headers: {
      'Content-Type': 'video/mp4',
      'Content-Length': String(opts.videoBuffer.byteLength),
    },
    body: new Uint8Array(opts.videoBuffer),
  });

  if (!uploadRes.ok) {
    const text = await uploadRes.text();
    throw new Error(`[youtube] Video upload failed (${uploadRes.status}): ${text}`);
  }

  const result = await uploadRes.json();
  const videoId = result.id;
  if (!videoId) {
    throw new Error('[youtube] Upload succeeded but no video ID returned');
  }

  console.log(`[youtube] Uploaded: https://youtube.com/shorts/${videoId}`);
  return videoId;
}
