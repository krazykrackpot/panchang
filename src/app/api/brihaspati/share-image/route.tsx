/**
 * POST /api/brihaspati/share-image
 *
 * Generate a 1080×1350 (vertical 4:5, Instagram-friendly) PNG share card
 * for a completed Brihaspati answer. The user must own the question.
 *
 * Why POST: the only call site is the BrihaspatiShare client component,
 * which uses an authenticated `fetch()` and downloads the blob via
 * `URL.createObjectURL`. POST keeps the questionId out of browser /
 * server-access logs and avoids any "image-via-img-src" auth gymnastics.
 *
 * Body: { questionId: string }
 * Returns: image/png stream
 */
import { NextRequest } from 'next/server';
import { ImageResponse } from 'next/og';
import { getServerSupabase } from '@/lib/supabase/server';

// `next/og` (Satori under the hood) ships with default Latin coverage.
// For Devanagari we lazy-fetch Noto Serif Devanagari from Google Fonts
// on cold-start; subsequent invocations hit the runtime fetch cache.
//
// NOTE on next/font: the Next 16 validator suggests next/font here, but
// next/font is Node-only and runs at build time — it can't be used by
// an edge-runtime ImageResponse, which generates the PNG at request
// time. Runtime Google-Fonts fetch is the canonical Vercel pattern for
// ImageResponse (see Vercel /og examples + Satori docs).
//
// Non-Latin scripts we DON'T yet ship a font for (Bengali, Tamil,
// Telugu, Kannada, Gujarati) fall back to the default font — glyphs
// may render as boxes for those locales. Tracked as v2 work.
async function loadGoogleFont(family: string, weight: 400 | 700, text?: string): Promise<ArrayBuffer> {
  const params = new URLSearchParams({
    family: `${family}:wght@${weight}`,
    // `text=` returns a subset covering only the characters used in
    // this render — keeps the font payload to ~10–30 KB.
    ...(text ? { text } : {}),
    display: 'swap',
  });
  const cssRes = await fetch(`https://fonts.googleapis.com/css2?${params.toString()}`, {
    headers: { 'User-Agent': 'Mozilla/5.0' },
  });
  if (!cssRes.ok) throw new Error(`Google Fonts css fetch failed (${cssRes.status})`);
  const css = await cssRes.text();
  const m = css.match(/src:\s*url\((https:\/\/[^)]+)\)/);
  if (!m) throw new Error('font URL not found in Google Fonts CSS');
  const fontRes = await fetch(m[1]);
  if (!fontRes.ok) throw new Error(`font binary fetch failed (${fontRes.status})`);
  return await fontRes.arrayBuffer();
}

// Category → palette. Drives the gradient frame, accent border, and
// caption colour. Categories without a bespoke entry fall back to gold.
const PALETTES: Record<string, { from: string; via: string; to: string; accent: string }> = {
  career:        { from: '#451a03', via: '#92400e', to: '#d97706', accent: '#fbbf24' },
  marriage:      { from: '#4c0519', via: '#9f1239', to: '#e11d48', accent: '#fda4af' },
  health:        { from: '#052e16', via: '#065f46', to: '#10b981', accent: '#6ee7b7' },
  finance:       { from: '#1a2e05', via: '#365314', to: '#65a30d', accent: '#bef264' },
  children:      { from: '#451a03', via: '#92400e', to: '#f59e0b', accent: '#fde68a' },
  education:     { from: '#172554', via: '#1e3a8a', to: '#3b82f6', accent: '#93c5fd' },
  dasha:         { from: '#2e1065', via: '#5b21b6', to: '#8b5cf6', accent: '#c4b5fd' },
  remedies:      { from: '#451a03', via: '#9a3412', to: '#fb923c', accent: '#fed7aa' },
  compatibility: { from: '#500724', via: '#9d174d', to: '#ec4899', accent: '#fbcfe8' },
  timing:        { from: '#042f2e', via: '#155e75', to: '#06b6d4', accent: '#67e8f9' },
  transit:       { from: '#1e1b4b', via: '#3730a3', to: '#6366f1', accent: '#a5b4fc' },
  general:       { from: '#451a03', via: '#92400e', to: '#d4a853', accent: '#f0d48a' },
};

function paletteFor(category: string | null | undefined) {
  return PALETTES[(category ?? 'general').toLowerCase()] ?? PALETTES.general;
}

// Truncate to ~max chars on a word boundary, never mid-conjunct.
function truncate(s: string, max: number): string {
  const collapsed = s.replace(/\s+/g, ' ').trim();
  if (collapsed.length <= max) return collapsed;
  const slice = collapsed.slice(0, max);
  const lastSpace = slice.lastIndexOf(' ');
  return (lastSpace > 0 ? slice.slice(0, lastSpace) : slice) + '…';
}

// next/og runs on Vercel's edge runtime by default — set explicitly.
export const runtime = 'edge';

export async function POST(req: NextRequest) {
  try {
    const supabase = getServerSupabase();
    if (!supabase) {
      return new Response(JSON.stringify({ error: 'Not configured' }), { status: 503 });
    }

    const authHeader = req.headers.get('authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
    }
    const { data: { user }, error: authError } = await supabase.auth.getUser(authHeader.slice(7).trim());
    if (authError || !user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
    }

    let body: { questionId?: unknown };
    try {
      body = await req.json();
    } catch {
      return new Response(JSON.stringify({ error: 'Invalid JSON' }), { status: 400 });
    }
    const questionId = typeof body.questionId === 'string' ? body.questionId : '';
    if (!questionId) {
      return new Response(JSON.stringify({ error: 'questionId required' }), { status: 400 });
    }

    // Verify ownership + completion.
    const { data: row, error: rowErr } = await supabase
      .from('brihaspati_questions')
      .select('id, user_id, question, answer, query_category, locale, status')
      .eq('id', questionId)
      .maybeSingle();
    if (rowErr) {
      console.error('[brihaspati/share-image] question fetch failed:', rowErr.message);
      return new Response(JSON.stringify({ error: 'Failed to load question' }), { status: 500 });
    }
    if (!row || row.user_id !== user.id) {
      return new Response(JSON.stringify({ error: 'Not found' }), { status: 404 });
    }
    if (row.status !== 'completed' || !row.answer) {
      return new Response(JSON.stringify({ error: 'Answer not ready' }), { status: 409 });
    }

    const palette = paletteFor(row.query_category as string | null);
    const question = truncate(String(row.question ?? ''), 140);
    const answer = truncate(String(row.answer ?? ''), 380);
    const locale = String(row.locale ?? 'en');
    const isDevanagari = locale === 'hi' || locale === 'sa' || locale === 'mai' || locale === 'mr';

    // Subset characters we actually need (keeps font payload tiny).
    const textForSubset = `${question}${answer} BRIHASPATI Vedic AI Astrologer Read full reading dekhopanchang.com QA Q:`;

    // Load fonts in parallel. Devanagari only when the answer is in a
    // matching script; Latin is loaded unconditionally for the chrome.
    const [serif400, serif700, devSerif400] = await Promise.all([
      loadGoogleFont('Noto Serif', 400, textForSubset),
      loadGoogleFont('Noto Serif', 700, 'BRIHASPATI Vedic AI Astrologer Read full reading dekhopanchang com Q:'),
      isDevanagari ? loadGoogleFont('Noto Serif Devanagari', 400, textForSubset) : Promise.resolve(null),
    ]);

    const fonts: { name: string; data: ArrayBuffer; style: 'normal'; weight: 400 | 700 }[] = [
      { name: 'Noto Serif', data: serif400, style: 'normal', weight: 400 },
      { name: 'Noto Serif', data: serif700, style: 'normal', weight: 700 },
    ];
    if (devSerif400) {
      fonts.push({ name: 'Noto Serif Devanagari', data: devSerif400, style: 'normal', weight: 400 });
    }
    const fontStack = isDevanagari
      ? '"Noto Serif Devanagari", "Noto Serif", serif'
      : '"Noto Serif", serif';

    return new ImageResponse(
      (
        <div
          style={{
            width: 1080,
            height: 1350,
            display: 'flex',
            flexDirection: 'column',
            background: `linear-gradient(160deg, ${palette.from} 0%, ${palette.via} 40%, #0a0e27 100%)`,
            padding: 64,
            fontFamily: fontStack,
            color: '#f0e8d4',
            position: 'relative',
          }}
        >
          {/* Ornate inner border */}
          <div
            style={{
              position: 'absolute',
              top: 32,
              left: 32,
              right: 32,
              bottom: 32,
              border: `2px solid ${palette.accent}`,
              borderRadius: 24,
              opacity: 0.4,
              display: 'flex',
            }}
          />

          {/* Header — medallion + brand */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: 32 }}>
            <div
              style={{
                width: 160,
                height: 160,
                borderRadius: 80,
                background: `radial-gradient(circle, #d4a853 0%, ${palette.via} 60%, ${palette.from} 100%)`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: `4px solid ${palette.accent}`,
                color: '#1a0f00',
                fontSize: 80,
                fontWeight: 700,
                fontFamily: '"Noto Serif", serif',
              }}
            >
              ॐ
            </div>
            <div
              style={{
                marginTop: 24,
                fontSize: 56,
                fontWeight: 700,
                letterSpacing: 12,
                color: palette.accent,
                fontFamily: '"Noto Serif", serif',
              }}
            >
              BRIHASPATI
            </div>
            <div
              style={{
                marginTop: 4,
                fontSize: 22,
                color: '#d4a853',
                opacity: 0.85,
                fontStyle: 'italic',
                fontFamily: '"Noto Serif", serif',
              }}
            >
              Vedic AI Astrologer
            </div>
          </div>

          {/* Divider */}
          <div
            style={{
              marginTop: 40,
              alignSelf: 'center',
              width: 200,
              height: 2,
              background: palette.accent,
              opacity: 0.5,
              display: 'flex',
            }}
          />

          {/* Question */}
          <div
            style={{
              marginTop: 32,
              padding: '0 32px',
              fontSize: 26,
              fontStyle: 'italic',
              color: palette.accent,
              textAlign: 'center',
              lineHeight: 1.4,
              display: 'flex',
              justifyContent: 'center',
            }}
          >
            “{question}”
          </div>

          {/* Answer */}
          <div
            style={{
              marginTop: 32,
              padding: '0 32px',
              fontSize: 30,
              color: '#f5ecd6',
              lineHeight: 1.5,
              display: 'flex',
              flex: 1,
              textAlign: 'left',
            }}
          >
            {answer}
          </div>

          {/* Footer — back-link */}
          <div
            style={{
              marginTop: 24,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 8,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, color: palette.accent, fontSize: 22 }}>
              <span>✦</span>
              <span style={{ fontStyle: 'italic' }}>Read the full reading</span>
              <span>✦</span>
            </div>
            <div style={{ color: '#f0d48a', fontSize: 30, fontWeight: 700, letterSpacing: 2 }}>
              dekhopanchang.com/brihaspati
            </div>
          </div>
        </div>
      ),
      {
        width: 1080,
        height: 1350,
        fonts,
      },
    );
  } catch (err) {
    console.error('[brihaspati/share-image] failed:', err);
    return new Response(JSON.stringify({ error: 'Image generation failed' }), { status: 500 });
  }
}
