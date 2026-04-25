/**
 * GET /api/dasha-diary
 *
 * Returns the current dasha period info + a generated reflection prompt for the
 * authenticated user, reading from kundali_snapshots.dasha_timeline.
 *
 * Auth: Bearer token required.
 *
 * Response:
 *  {
 *    currentMaha: DashaEntry,
 *    currentAntar: DashaEntry | null,
 *    prompt: string,
 *    natalPlanetInfo: { houseRuled: number[]; signPlacement: string; housePlacement: number }
 *  }
 */

import { NextRequest, NextResponse } from 'next/server';
import { getServerSupabase } from '@/lib/supabase/server';
import { generateDashaPrompt } from '@/lib/personalization/dasha-prompts';
import type { DashaEntry } from '@/types/kundali';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Sign names (1-based) */
const SIGN_NAMES: Record<number, string> = {
  1:'Aries',2:'Taurus',3:'Gemini',4:'Cancer',5:'Leo',6:'Virgo',
  7:'Libra',8:'Scorpio',9:'Sagittarius',10:'Capricorn',11:'Aquarius',12:'Pisces',
};

/** Classical exaltation signs (planet name → rashi id) */
const EXALT: Record<string, number> = {
  Sun:4,Moon:2,Mars:10,Mercury:6,Jupiter:4,Venus:12,Saturn:7,Rahu:3,Ketu:9,
};
/** Classical debilitation signs */
const DEBIL: Record<string, number> = {
  Sun:7,Moon:8,Mars:4,Mercury:12,Jupiter:10,Venus:6,Saturn:1,Rahu:9,Ketu:3,
};

function dignityLabel(planet: string, sign: number): string {
  if (EXALT[planet] === sign) return 'exalted';
  if (DEBIL[planet] === sign) return 'debilitated';
  return '';
}

/** Planet sign lordship — each planet rules certain rashis */
const LORDSHIPS: Record<string, number[]> = {
  Sun:    [5],
  Moon:   [4],
  Mars:   [1, 8],
  Mercury:[3, 6],
  Jupiter:[9, 12],
  Venus:  [2, 7],
  Saturn: [10, 11],
  Rahu:   [],
  Ketu:   [],
};

/**
 * Given an ascendant sign (1-12) and planet sign, derive which houses the
 * planet rules (equal-house, each sign = one house).
 */
function housesRuled(planetName: string, ascSign: number): number[] {
  const ruledSigns = LORDSHIPS[planetName] ?? [];
  return ruledSigns.map((s) => ((s - ascSign + 12) % 12) + 1);
}

function signOfPlanet(planetName: string, snapshot: Record<string, unknown>): number {
  const planets = snapshot.planets as Array<{ name: string; sign: number }> | undefined;
  if (!planets) return 1;
  const match = planets.find((p) => p.name === planetName);
  return match?.sign ?? 1;
}

function houseOfPlanet(planetName: string, ascSign: number, planetSign: number): number {
  return ((planetSign - ascSign + 12) % 12) + 1;
}

// ---------------------------------------------------------------------------
// Find current dasha from timeline
// ---------------------------------------------------------------------------
function findCurrentDasha(
  timeline: DashaEntry[]
): { maha: DashaEntry; antar: DashaEntry | null } | null {
  const now = new Date().toISOString().slice(0, 10); // YYYY-MM-DD

  for (const maha of timeline) {
    if (maha.startDate <= now && now < maha.endDate) {
      let antar: DashaEntry | null = null;
      if (maha.subPeriods) {
        for (const ap of maha.subPeriods) {
          if (ap.startDate <= now && now < ap.endDate) {
            antar = ap;
            break;
          }
        }
      }
      return { maha, antar };
    }
  }
  return null;
}

// ---------------------------------------------------------------------------
// Route handler
// ---------------------------------------------------------------------------
export async function GET(req: NextRequest) {
  const supabase = getServerSupabase();
  if (!supabase) return NextResponse.json({ error: 'Not configured' }, { status: 503 });

  // Auth
  const authHeader = req.headers.get('authorization');
  if (!authHeader?.startsWith('Bearer ')) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const token = authHeader.slice(7).trim();
  const { data: { user }, error: authErr } = await supabase.auth.getUser(token);
  if (authErr || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Read locale from query (defaults to 'en')
  const { searchParams } = new URL(req.url);
  const locale = searchParams.get('locale') ?? 'en';
  // NOTE: searchParams is accessed via URL constructor here (not Next.js async
  // searchParams prop), so no await is needed — new URL().searchParams is sync.

  try {
    // Fetch snapshot
    const { data: snapshot, error: snapErr } = await supabase
      .from('kundali_snapshots')
      .select('dasha_timeline, ascendant_sign, planetary_snapshot')
      .eq('user_id', user.id)
      .maybeSingle();

    if (snapErr) {
      console.error('[dasha-diary] snapshot fetch failed:', snapErr);
      return NextResponse.json({ error: 'Failed to load snapshot' }, { status: 500 });
    }
    if (!snapshot?.dasha_timeline) {
      return NextResponse.json({ error: 'No dasha timeline found. Generate your kundali first.' }, { status: 404 });
    }

    const timeline = snapshot.dasha_timeline as DashaEntry[];
    const current = findCurrentDasha(timeline);
    if (!current) {
      return NextResponse.json({ error: 'Could not determine current dasha period.' }, { status: 404 });
    }

    const { maha, antar } = current;
    // Use antardasha lord for the prompt if available, otherwise mahadasha lord
    const activePlanet = antar ? antar.planet : maha.planet;
    const periodLabel = antar ? 'Antardasha' : 'Mahadasha';

    const ascSign: number = snapshot.ascendant_sign ?? 1;
    const planetarySnapshot = (snapshot.planetary_snapshot ?? {}) as Record<string, unknown>;
    const pSign = signOfPlanet(activePlanet, planetarySnapshot);
    const pHouse = houseOfPlanet(activePlanet, ascSign, pSign);
    const ruled = housesRuled(activePlanet, ascSign);
    const dignity = dignityLabel(activePlanet, pSign);
    const signName = SIGN_NAMES[pSign] ?? 'Unknown';
    const signPlacement = dignity ? `${signName} (${dignity})` : signName;

    const prompt = generateDashaPrompt(
      activePlanet,
      ruled,
      signPlacement,
      pHouse,
      locale,
      periodLabel,
    );

    return NextResponse.json({
      currentMaha: maha,
      currentAntar: antar,
      prompt,
      natalPlanetInfo: {
        houseRuled: ruled,
        signPlacement,
        housePlacement: pHouse,
      },
    });
  } catch (err) {
    console.error('[dasha-diary] unexpected error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
