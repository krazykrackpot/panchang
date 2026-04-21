/**
 * Current Period Synthesiser
 *
 * Produces a CurrentPeriodReading by analysing the native's active
 * Vimshottari dasha period, planetary dignities, and upcoming transitions.
 *
 * Planet IDs: 0=Sun, 1=Moon, 2=Mars, 3=Mercury, 4=Jupiter,
 *             5=Venus, 6=Saturn, 7=Rahu, 8=Ketu
 */

import type { LocaleText } from '@/types/panchang';
import type { DashaEntry, PlanetPosition } from '@/types/kundali';
import type { CurrentPeriodReading, Rating, RatingInfo } from './types';
import { GRAHAS } from '@/lib/constants/grahas';

// ---------------------------------------------------------------------------
// Input interface
// ---------------------------------------------------------------------------

export interface CurrentPeriodInput {
  dashas: DashaEntry[];
  planets: PlanetPosition[];
  moonSign: number; // 1-12
  currentDate: Date;
  sadeSatiStatus?: { active: boolean; phase?: string };
}

// ---------------------------------------------------------------------------
// Planet name → ID mapping
// ---------------------------------------------------------------------------

const PLANET_NAME_TO_ID: Record<string, number> = {
  Sun: 0, Moon: 1, Mars: 2, Mercury: 3, Jupiter: 4,
  Venus: 5, Saturn: 6, Rahu: 7, Ketu: 8,
};

function planetId(name: string): number {
  return PLANET_NAME_TO_ID[name] ?? -1;
}

function planetLocaleName(id: number): LocaleText {
  const g = GRAHAS.find(g => g.id === id);
  return g ? g.name : { en: 'Unknown' };
}

// ---------------------------------------------------------------------------
// Natural benefic / malefic classification
// ---------------------------------------------------------------------------

/** Natural benefics: Jupiter (4), Venus (5), Moon (1), Mercury (3). */
const NATURAL_BENEFICS = new Set([1, 3, 4, 5]);
/** Natural malefics: Sun (0), Mars (2), Saturn (6), Rahu (7), Ketu (8). */
const NATURAL_MALEFICS = new Set([0, 2, 6, 7, 8]);

function isBenefic(id: number): boolean {
  return NATURAL_BENEFICS.has(id);
}

// ---------------------------------------------------------------------------
// Natural friendship table (simplified Vedic naisargika maitri)
// ---------------------------------------------------------------------------

type Relationship = 'friend' | 'neutral' | 'enemy';

/**
 * Simplified natural friendship. Key = planetId, value = set of friend IDs.
 * Planets not listed as friends or enemies are neutral.
 */
const FRIENDS: Record<number, Set<number>> = {
  0: new Set([1, 2, 4]),       // Sun friends: Moon, Mars, Jupiter
  1: new Set([0, 3]),           // Moon friends: Sun, Mercury
  2: new Set([0, 1, 4]),       // Mars friends: Sun, Moon, Jupiter
  3: new Set([0, 5]),           // Mercury friends: Sun, Venus
  4: new Set([0, 1, 2]),       // Jupiter friends: Sun, Moon, Mars
  5: new Set([3, 6]),           // Venus friends: Mercury, Saturn
  6: new Set([3, 5]),           // Saturn friends: Mercury, Venus
  7: new Set([]),               // Rahu — treated case-by-case
  8: new Set([]),               // Ketu — treated case-by-case
};

const ENEMIES: Record<number, Set<number>> = {
  0: new Set([5, 6]),           // Sun enemies: Venus, Saturn
  1: new Set([]),               // Moon — no natural enemies
  2: new Set([3]),              // Mars enemies: Mercury
  3: new Set([1]),              // Mercury enemies: Moon
  4: new Set([3, 5]),           // Jupiter enemies: Mercury, Venus
  5: new Set([0, 1]),           // Venus enemies: Sun, Moon
  6: new Set([0, 1, 2]),       // Saturn enemies: Sun, Moon, Mars
  7: new Set([0, 1]),           // Rahu enemies: Sun, Moon
  8: new Set([1]),              // Ketu enemies: Moon
};

function naturalRelationship(a: number, b: number): Relationship {
  if (a === b) return 'friend'; // same planet = cooperative
  if (FRIENDS[a]?.has(b) && FRIENDS[b]?.has(a)) return 'friend';
  if (ENEMIES[a]?.has(b) || ENEMIES[b]?.has(a)) return 'enemy';
  return 'neutral';
}

// ---------------------------------------------------------------------------
// Rating helpers (reuse scorer pattern)
// ---------------------------------------------------------------------------

const RATING_TEMPLATES: { rating: Rating; label: LocaleText; color: string }[] = [
  { rating: 'uttama',    label: { en: 'Strong (Uttama)',      hi: 'प्रबल (उत्तम)' },    color: 'text-emerald-400' },
  { rating: 'madhyama',  label: { en: 'Moderate (Madhyama)',  hi: 'मध्यम (मध्यम)' },    color: 'text-gold-primary' },
  { rating: 'adhama',    label: { en: 'Challenging (Adhama)', hi: 'चुनौतीपूर्ण (अधम)' }, color: 'text-amber-400' },
  { rating: 'atyadhama', label: { en: 'Critical (Atyadhama)', hi: 'गंभीर (अत्यधम)' },   color: 'text-red-400' },
];

function makeRating(rating: Rating, score: number): RatingInfo {
  const tpl = RATING_TEMPLATES.find(t => t.rating === rating) ?? RATING_TEMPLATES[3];
  return { rating, score, label: tpl.label, color: tpl.color };
}

// ---------------------------------------------------------------------------
// Dasha scanning
// ---------------------------------------------------------------------------

interface ActiveDasha {
  mahaLordName: string;
  mahaLordId: number;
  mahaStart: string;
  mahaEnd: string;
  antarLordName: string;
  antarLordId: number;
  antarStart: string;
  antarEnd: string;
  pratyantarLordName?: string;
  pratyantarLordId?: number;
  pratyantarStart?: string;
  pratyantarEnd?: string;
  /** The next antardasha after the current one (for upcoming dates). */
  nextAntar?: DashaEntry;
  /** The next pratyantardasha after the current one. */
  nextPratyantar?: DashaEntry;
}

function findActiveDasha(dashas: DashaEntry[], date: Date): ActiveDasha | null {
  const ts = date.getTime();

  for (const maha of dashas) {
    if (maha.level !== 'maha') continue;
    const mahaStart = new Date(maha.startDate).getTime();
    const mahaEnd = new Date(maha.endDate).getTime();
    if (ts < mahaStart || ts >= mahaEnd) continue;

    // Found active mahadasha — now find antardasha
    const subs = maha.subPeriods ?? [];
    for (let i = 0; i < subs.length; i++) {
      const antar = subs[i];
      const aStart = new Date(antar.startDate).getTime();
      const aEnd = new Date(antar.endDate).getTime();
      if (ts < aStart || ts >= aEnd) continue;

      const result: ActiveDasha = {
        mahaLordName: maha.planet,
        mahaLordId: planetId(maha.planet),
        mahaStart: maha.startDate,
        mahaEnd: maha.endDate,
        antarLordName: antar.planet,
        antarLordId: planetId(antar.planet),
        antarStart: antar.startDate,
        antarEnd: antar.endDate,
        nextAntar: subs[i + 1] ?? undefined,
      };

      // Find pratyantardasha if available
      const pratySubs = antar.subPeriods ?? [];
      for (let j = 0; j < pratySubs.length; j++) {
        const praty = pratySubs[j];
        const pStart = new Date(praty.startDate).getTime();
        const pEnd = new Date(praty.endDate).getTime();
        if (ts >= pStart && ts < pEnd) {
          result.pratyantarLordName = praty.planet;
          result.pratyantarLordId = planetId(praty.planet);
          result.pratyantarStart = praty.startDate;
          result.pratyantarEnd = praty.endDate;
          result.nextPratyantar = pratySubs[j + 1] ?? undefined;
          break;
        }
      }

      return result;
    }

    // If no antardasha matched, return just mahadasha
    return {
      mahaLordName: maha.planet,
      mahaLordId: planetId(maha.planet),
      mahaStart: maha.startDate,
      mahaEnd: maha.endDate,
      antarLordName: maha.planet,
      antarLordId: planetId(maha.planet),
      antarStart: maha.startDate,
      antarEnd: maha.endDate,
    };
  }

  return null;
}

// ---------------------------------------------------------------------------
// Dignity check (simplified from natal positions)
// ---------------------------------------------------------------------------

function isInStrongDignity(id: number, planets: PlanetPosition[]): boolean {
  const p = planets.find(pp => pp.planet.id === id);
  if (!p) return false;
  return p.isExalted || p.isOwnSign;
}

// ---------------------------------------------------------------------------
// Overall rating heuristic
// ---------------------------------------------------------------------------

function computeOverallRating(
  mahaId: number,
  antarId: number,
  planets: PlanetPosition[],
): { rating: Rating; score: number } {
  const mahaBenefic = isBenefic(mahaId);
  const antarBenefic = isBenefic(antarId);

  if (mahaBenefic && antarBenefic) {
    return { rating: 'uttama', score: 8.0 };
  }

  if (mahaBenefic || antarBenefic) {
    return { rating: 'madhyama', score: 6.0 };
  }

  // Both malefic — check dignity
  const mahaStrong = isInStrongDignity(mahaId, planets);
  const antarStrong = isInStrongDignity(antarId, planets);

  if (mahaStrong || antarStrong) {
    return { rating: 'madhyama', score: 5.0 };
  }

  return { rating: 'adhama', score: 3.0 };
}

// ---------------------------------------------------------------------------
// Interaction theme
// ---------------------------------------------------------------------------

function interactionTheme(mahaId: number, antarId: number): LocaleText {
  const rel = naturalRelationship(mahaId, antarId);
  switch (rel) {
    case 'friend':
      return {
        en: 'Supportive period — both lords cooperate harmoniously.',
        hi: 'सहयोगी काल — दोनों ग्रह मिलकर कार्य करते हैं।',
      };
    case 'enemy':
      return {
        en: 'Tense period — conflicting energies require careful navigation.',
        hi: 'तनावपूर्ण काल — विरोधी ऊर्जाओं में सावधानी आवश्यक।',
      };
    default:
      return {
        en: 'Balanced period — results depend on house activations.',
        hi: 'संतुलित काल — परिणाम भाव सक्रियता पर निर्भर।',
      };
  }
}

// ---------------------------------------------------------------------------
// Guidance
// ---------------------------------------------------------------------------

function guidance(rating: Rating): LocaleText {
  switch (rating) {
    case 'uttama':
      return {
        en: 'This is a favorable period for initiative and growth.',
        hi: 'यह पहल और विकास के लिए अनुकूल समय है।',
      };
    case 'madhyama':
      return {
        en: 'A balanced period — focus on steady progress.',
        hi: 'एक संतुलित काल — स्थिर प्रगति पर ध्यान दें।',
      };
    case 'adhama':
      return {
        en: 'A challenging period — patience and remedies are advised.',
        hi: 'एक चुनौतीपूर्ण काल — धैर्य और उपाय की सलाह दी जाती है।',
      };
    case 'atyadhama':
      return {
        en: 'A difficult period requiring caution. Lean on spiritual practice.',
        hi: 'एक कठिन काल जिसमें सावधानी आवश्यक। आध्यात्मिक साधना का सहारा लें।',
      };
  }
}

// ---------------------------------------------------------------------------
// Upcoming dates
// ---------------------------------------------------------------------------

interface UpcomingEvent {
  date: string; // ISO
  event: LocaleText;
}

function computeUpcomingDates(
  active: ActiveDasha,
  planets: PlanetPosition[],
  currentDate: Date,
): UpcomingEvent[] {
  const events: UpcomingEvent[] = [];
  const now = currentDate.getTime();

  // Next antardasha change
  if (active.nextAntar) {
    const d = new Date(active.nextAntar.startDate);
    if (d.getTime() > now) {
      const lordName = active.nextAntar.planet;
      events.push({
        date: active.nextAntar.startDate,
        event: {
          en: `${active.mahaLordName}-${lordName} Antardasha begins`,
          hi: `${active.mahaLordName}-${lordName} अन्तर्दशा आरम्भ`,
        },
      });
    }
  } else {
    // Current antardasha end = end of current antar
    const antarEnd = new Date(active.antarEnd);
    if (antarEnd.getTime() > now) {
      events.push({
        date: active.antarEnd,
        event: {
          en: `${active.mahaLordName}-${active.antarLordName} Antardasha ends`,
          hi: `${active.mahaLordName}-${active.antarLordName} अन्तर्दशा समाप्त`,
        },
      });
    }
  }

  // Next pratyantardasha change
  if (active.nextPratyantar) {
    const d = new Date(active.nextPratyantar.startDate);
    if (d.getTime() > now) {
      events.push({
        date: active.nextPratyantar.startDate,
        event: {
          en: `Pratyantardasha of ${active.nextPratyantar.planet} begins`,
          hi: `${active.nextPratyantar.planet} प्रत्यन्तर्दशा आरम्भ`,
        },
      });
    }
  }

  // Approximate next Saturn ingress
  // Saturn moves ~1° per 12.4 days. A sign is 30°.
  const saturn = planets.find(p => p.planet.id === 6);
  if (saturn) {
    const degInSign = saturn.longitude % 30;
    const degRemaining = 30 - degInSign;
    // Saturn's effective speed: use actual speed if available, else ~0.0334°/day
    const speedDegPerDay = Math.abs(saturn.speed) > 0.001 ? Math.abs(saturn.speed) : 0.0334;
    const daysToIngress = Math.round(degRemaining / speedDegPerDay);
    const ingressDate = new Date(currentDate);
    ingressDate.setDate(ingressDate.getDate() + daysToIngress);
    const nextSign = (saturn.sign % 12) + 1;
    const nextSignName = planetLocaleName(6); // just use Saturn's name for the event

    events.push({
      date: ingressDate.toISOString().slice(0, 10),
      event: {
        en: `Saturn ingress into sign ${nextSign} (approximate)`,
        hi: `शनि राशि ${nextSign} में प्रवेश (अनुमानित)`,
      },
    });
  }

  // Sort by date and take up to 5
  events.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  return events.slice(0, 5);
}

// ---------------------------------------------------------------------------
// Retrogrades affecting (simplified)
// ---------------------------------------------------------------------------

interface RetrogradeFlag {
  planetId: number;
  planetName: LocaleText;
  transitHouseFromMoon: number;
}

function retrogradesAffecting(
  planets: PlanetPosition[],
  moonSign: number,
): RetrogradeFlag[] {
  const flags: RetrogradeFlag[] = [];
  // Check outer planets: Mars (2), Jupiter (4), Saturn (6)
  // Also Rahu (7) and Ketu (8) — always retrograde, so skip them
  const outerIds = [2, 4, 6];

  for (const id of outerIds) {
    const p = planets.find(pp => pp.planet.id === id);
    if (!p) continue;

    // Compute transit house from moon sign
    const transitHouse = ((p.sign - moonSign + 12) % 12) + 1;

    // Flag if retrograde OR if Saturn/Jupiter are in sensitive houses from Moon (1, 4, 7, 8, 10, 12)
    const sensitiveHouses = new Set([1, 4, 7, 8, 10, 12]);
    if (p.isRetrograde || (sensitiveHouses.has(transitHouse) && (id === 4 || id === 6))) {
      flags.push({
        planetId: id,
        planetName: p.planet.name,
        transitHouseFromMoon: transitHouse,
      });
    }
  }

  return flags;
}

// ---------------------------------------------------------------------------
// Key transits (slow planets relative to Moon sign)
// ---------------------------------------------------------------------------

function computeKeyTransits(
  planets: PlanetPosition[],
  moonSign: number,
): CurrentPeriodReading['keyTransits'] {
  const slowPlanets = [4, 6, 7, 8]; // Jupiter, Saturn, Rahu, Ketu
  const transits: CurrentPeriodReading['keyTransits'] = [];

  for (const id of slowPlanets) {
    const p = planets.find(pp => pp.planet.id === id);
    if (!p) continue;

    const transitHouse = ((p.sign - moonSign + 12) % 12) + 1;

    // Simplified nature assessment based on house
    const beneficHouses = new Set([1, 2, 5, 9, 11]);
    const maleficHouses = new Set([6, 8, 12]);
    let nature: 'benefic' | 'malefic' | 'neutral' = 'neutral';
    if (beneficHouses.has(transitHouse)) nature = isBenefic(id) ? 'benefic' : 'neutral';
    if (maleficHouses.has(transitHouse)) nature = 'malefic';

    const houseLabel = transitHouse;
    transits.push({
      planetId: id,
      transitSign: p.sign,
      transitHouse,
      nature,
      summary: {
        en: `${p.planet.name.en} transiting ${houseLabel}th house from Moon`,
        hi: `${p.planet.name.hi ?? p.planet.name.en} चन्द्र से ${houseLabel}वें भाव में गोचर`,
      },
    });
  }

  return transits;
}

// ---------------------------------------------------------------------------
// Main synthesiser
// ---------------------------------------------------------------------------

export function synthesizeCurrentPeriod(params: CurrentPeriodInput): CurrentPeriodReading {
  const { dashas, planets, moonSign, currentDate, sadeSatiStatus } = params;

  // 1. Find active dasha
  const active = findActiveDasha(dashas, currentDate);

  if (!active) {
    // Fallback: no matching dasha found — return a minimal reading
    return {
      dashaSummary: {
        en: 'Dasha period could not be determined for the current date.',
        hi: 'वर्तमान तिथि के लिए दशा काल निर्धारित नहीं हो सका।',
      },
      keyTransits: computeKeyTransits(planets, moonSign),
      activeDomainsNow: [],
      challengedDomainsNow: [],
      periodScore: 5.0,
      periodRating: makeRating('madhyama', 5.0),
      summary: {
        en: 'Unable to determine the active dasha period. General transit influences apply.',
        hi: 'सक्रिय दशा काल निर्धारित नहीं हो सका। सामान्य गोचर प्रभाव लागू हैं।',
      },
    };
  }

  // 2. Interaction theme
  const theme = interactionTheme(active.mahaLordId, active.antarLordId);

  // 3. Overall rating
  const { rating, score } = computeOverallRating(
    active.mahaLordId,
    active.antarLordId,
    planets,
  );
  const periodRating = makeRating(rating, score);

  // 4. Upcoming dates
  const upcomingDates = computeUpcomingDates(active, planets, currentDate);

  // 5. Guidance
  const guidanceText = guidance(rating);

  // 6. Key transits
  const keyTransits = computeKeyTransits(planets, moonSign);

  // 7. Retrogrades
  const retros = retrogradesAffecting(planets, moonSign);

  // 8. Determine active/challenged domains (heuristic based on dasha lords)
  const activeDomainsNow: CurrentPeriodReading['activeDomainsNow'] = [];
  const challengedDomainsNow: CurrentPeriodReading['challengedDomainsNow'] = [];

  // Jupiter/Venus maha → wealth/spiritual active; Saturn/Rahu maha → career challenged
  if (active.mahaLordId === 4 || active.mahaLordId === 5) {
    activeDomainsNow.push('wealth', 'spiritual');
  }
  if (active.mahaLordId === 6 || active.mahaLordId === 7) {
    challengedDomainsNow.push('career', 'health');
  }
  if (active.mahaLordId === 2) {
    activeDomainsNow.push('career');
    challengedDomainsNow.push('marriage');
  }
  if (active.mahaLordId === 1) {
    activeDomainsNow.push('family');
  }

  // Sade Sati adds challenges to Moon-linked / emotional domains
  if (sadeSatiStatus?.active) {
    if (!challengedDomainsNow.includes('family')) challengedDomainsNow.push('family');
    if (!challengedDomainsNow.includes('marriage')) challengedDomainsNow.push('marriage');
    if (!challengedDomainsNow.includes('health')) challengedDomainsNow.push('health');
  }

  // Build dasha summary
  const mahaName = planetLocaleName(active.mahaLordId);
  const antarName = planetLocaleName(active.antarLordId);
  let dashaSummaryEn = `${mahaName.en} Mahadasha, ${antarName.en} Antardasha (${active.antarStart} to ${active.antarEnd}). ${theme.en}`;
  let dashaSummaryHi = `${mahaName.hi ?? mahaName.en} महादशा, ${antarName.hi ?? antarName.en} अन्तर्दशा (${active.antarStart} से ${active.antarEnd})। ${theme.hi ?? theme.en}`;

  if (active.pratyantarLordName) {
    const pratyName = planetLocaleName(active.pratyantarLordId!);
    dashaSummaryEn += ` Pratyantardasha: ${pratyName.en}.`;
    dashaSummaryHi += ` प्रत्यन्तर्दशा: ${pratyName.hi ?? pratyName.en}।`;
  }

  // Build full summary narrative
  const retroNote = retros.length > 0
    ? ` ${retros.map(r => r.planetName.en).join(', ')} ${retros.length === 1 ? 'is' : 'are'} in a sensitive position from your Moon sign.`
    : '';
  const sadeSatiNote = sadeSatiStatus?.active
    ? ` Sade Sati is active (${sadeSatiStatus.phase ?? 'ongoing'} phase).`
    : '';

  const summaryEn = `${guidanceText.en}${retroNote}${sadeSatiNote} ${upcomingDates.length > 0 ? `Next key event: ${upcomingDates[0].event.en} on ${upcomingDates[0].date}.` : ''}`;
  const summaryHi = `${guidanceText.hi}${sadeSatiStatus?.active ? ` साढ़े साती सक्रिय है (${sadeSatiStatus.phase ?? 'चालू'} चरण)।` : ''} ${upcomingDates.length > 0 ? `अगली प्रमुख घटना: ${upcomingDates[0].event.hi ?? upcomingDates[0].event.en} ${upcomingDates[0].date} को।` : ''}`;

  return {
    dashaSummary: { en: dashaSummaryEn, hi: dashaSummaryHi },
    keyTransits,
    activeDomainsNow,
    challengedDomainsNow,
    periodScore: score,
    periodRating,
    summary: { en: summaryEn.trim(), hi: summaryHi.trim() },
  };
}
