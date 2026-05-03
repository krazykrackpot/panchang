/**
 * Fetches the latest YouTube video from the channel's public RSS feed.
 * Zero API quota — uses Atom XML feed. Cached in-memory for 1 hour.
 */

const CHANNEL_ID = 'UCbUSikGE9CjE8rXiCWQFQ9g'; // @DekhoPanchang
const FEED_URL = `https://www.youtube.com/feeds/videos.xml?channel_id=${CHANNEL_ID}`;

export interface LatestVideo {
  videoId: string;
  title: string;
  thumbnail: string;
  published: string; // ISO date
}

let cached: { data: LatestVideo | null; fetchedAt: number } = { data: null, fetchedAt: 0 };
const CACHE_TTL = 60 * 60 * 1000; // 1 hour

export async function getLatestVideo(): Promise<LatestVideo | null> {
  const now = Date.now();
  if (cached.data && now - cached.fetchedAt < CACHE_TTL) {
    return cached.data;
  }

  try {
    const res = await fetch(FEED_URL, { next: { revalidate: 3600 } });
    if (!res.ok) return cached.data;

    const xml = await res.text();

    // Parse first <entry> from Atom feed — simple regex, no XML parser needed
    const entryMatch = xml.match(/<entry>([\s\S]*?)<\/entry>/);
    if (!entryMatch) return null;

    const entry = entryMatch[1];
    const videoId = entry.match(/<yt:videoId>([^<]+)<\/yt:videoId>/)?.[1];
    const title = entry.match(/<title>([^<]+)<\/title>/)?.[1];
    const published = entry.match(/<published>([^<]+)<\/published>/)?.[1];

    if (!videoId) return null;

    const data: LatestVideo = {
      videoId,
      title: title || 'Daily Panchang',
      thumbnail: `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`,
      published: published || new Date().toISOString(),
    };

    cached = { data, fetchedAt: now };
    return data;
  } catch (err) {
    console.error('[youtube] RSS feed fetch failed:', err);
    return cached.data; // return stale data on error
  }
}
