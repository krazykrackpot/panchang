// archetype-engine.ts  –  Cosmic Blueprint synthesis engine
// Combines Shadbala, Dasha, and Yoga data into a psychological archetype profile.
import { ARCHETYPES, YOGA_PSYCH_INSIGHTS, LAGNA_MODIFIERS, type ArchetypeId } from '@/lib/constants/archetype-data-with-overlay';
import type { ShadBalaComplete } from './shadbala';
import type { LocaleText, Locale } from '@/types/panchang';
import { tl } from '@/lib/utils/trilingual';
import {
  renderHeadline,
  renderTransitionNote,
  renderExpression,
} from './archetype-engine-messages';

// Planet name -> ID mapping (0=Sun through 8=Ketu)
const PLANET_NAME_TO_ID: Record<string, number> = {
  Sun: 0, Moon: 1, Mars: 2, Mercury: 3, Jupiter: 4,
  Venus: 5, Saturn: 6, Rahu: 7, Ketu: 8,
};

export interface CosmicBlueprint {
  primary: {
    archetype: ArchetypeId;
    name: LocaleText;
    planet: number;
    strength: number;
    description: string;
    traits: string[];
    blindSpot: string;
  };
  shadow: {
    archetype: ArchetypeId;
    name: LocaleText;
    planet: number;
    strength: number;
    description: string;
    growthArea: string;
  };
  currentChapter: {
    archetype: ArchetypeId;
    name: LocaleText;
    dashaLord: number;
    startDate: Date;
    endDate: Date;
    yearsRemaining: number;
    description: string;
    themes: string[];
  };
  nextChapter: {
    archetype: ArchetypeId;
    name: LocaleText;
    dashaLord: number;
    startDate: Date;
    transitionNote: string;
  };
  persona: {
    lagnaSign: number;
    expression: string;
  };
  activeYogas: {
    name: LocaleText;
    influence: string;
  }[];
  headline: string;
}

export interface BlueprintInput {
  shadbala: ShadBalaComplete[];
  dashas: { planet: string; startDate: Date; endDate: Date; years: number }[];
  yogas: { id: string; name: LocaleText; present: boolean; strength: string; isAuspicious: boolean }[];
  ascendantSign: number; // 1-12 rashi ID
  planets: { id: number; longitude: number }[];
  rahuLongitude?: number;
  ketuLongitude?: number;
  lagnaLordId?: number;
  moonLongitude?: number;
}

function findCurrentDasha(dashas: BlueprintInput['dashas'], now: Date) {
  return dashas.find(d => now >= d.startDate && now < d.endDate);
}

function findNextDasha(dashas: BlueprintInput['dashas'], now: Date) {
  const currentIdx = dashas.findIndex(d => now >= d.startDate && now < d.endDate);
  if (currentIdx >= 0 && currentIdx < dashas.length - 1) {
    return dashas[currentIdx + 1];
  }
  return null;
}

/**
 * Check if Rahu or Ketu should override the primary archetype.
 * Rahu/Ketu replace primary when conjunct lagna lord or Moon within 10 degrees.
 * Returns planet ID (7 for Rahu, 8 for Ketu) or null.
 */
function shouldRahuKetuOverride(input: BlueprintInput): number | null {
  if (input.rahuLongitude === undefined || input.ketuLongitude === undefined) return null;
  if (input.lagnaLordId === undefined && input.moonLongitude === undefined) return null;

  const lagnaLordPlanet = input.planets.find(p => p.id === input.lagnaLordId);

  const checkConjunction = (nodeLong: number, targetLong: number): boolean => {
    const diff = Math.abs(nodeLong - targetLong);
    const normalized = diff > 180 ? 360 - diff : diff;
    return normalized <= 10;
  };

  // Check Rahu first (takes precedence)
  if (lagnaLordPlanet && checkConjunction(input.rahuLongitude, lagnaLordPlanet.longitude)) return 7;
  if (input.moonLongitude !== undefined && checkConjunction(input.rahuLongitude, input.moonLongitude)) return 7;

  // Then Ketu
  if (lagnaLordPlanet && checkConjunction(input.ketuLongitude, lagnaLordPlanet.longitude)) return 8;
  if (input.moonLongitude !== undefined && checkConjunction(input.ketuLongitude, input.moonLongitude)) return 8;

  return null;
}

/**
 * Generate a Cosmic Blueprint from already-computed kundali data.
 *
 * Primary archetype = highest Shadbala strengthRatio planet (Sun-Saturn, IDs 0-6).
 * Rahu/Ketu can override primary if conjunct lagna lord or Moon within 10 degrees.
 * Shadow archetype = lowest Shadbala strengthRatio planet (Sun-Saturn).
 * Current chapter = active Vimshottari Mahadasha lord's archetype.
 * Next chapter = next Mahadasha lord's archetype.
 *
 * `locale` selects the language for description, traits, blindSpot,
 * growthArea, theme labels, and the three narrative templates
 * (headline / transitionNote / expression). Defaults to 'en' so older
 * callers stay backwards-compatible.
 */
export function generateCosmicBlueprint(
  input: BlueprintInput,
  locale: Locale = 'en',
): CosmicBlueprint {
  const now = new Date();

  // --- Primary archetype ---
  const nodeOverride = shouldRahuKetuOverride(input);

  let primaryPlanetId: number;
  let primaryStrength: number;

  if (nodeOverride !== null) {
    primaryPlanetId = nodeOverride;
    primaryStrength = 0; // Nodes don't have classical Shadbala
  } else {
    // Highest strengthRatio from Sun-Saturn (IDs 0-6)
    const sorted = [...input.shadbala]
      .filter(s => s.planetId <= 6)
      .sort((a, b) => (b.strengthRatio ?? 0) - (a.strengthRatio ?? 0));
    primaryPlanetId = sorted[0]?.planetId ?? 0;
    primaryStrength = sorted[0]?.strengthRatio ?? 0;
  }

  const primaryDef = ARCHETYPES[primaryPlanetId];

  // --- Shadow archetype ---
  const sortedAsc = [...input.shadbala]
    .filter(s => s.planetId <= 6)
    .sort((a, b) => (a.strengthRatio ?? 0) - (b.strengthRatio ?? 0));
  const shadowPlanetId = sortedAsc[0]?.planetId ?? 6;
  const shadowStrength = sortedAsc[0]?.strengthRatio ?? 0;
  const shadowDef = ARCHETYPES[shadowPlanetId];

  // --- Current chapter (active Mahadasha) ---
  const currentDasha = findCurrentDasha(input.dashas, now);
  const currentDashaLordId = currentDasha ? (PLANET_NAME_TO_ID[currentDasha.planet] ?? 0) : 0;
  const currentChapterDef = ARCHETYPES[currentDashaLordId];
  const yearsRemaining = currentDasha
    ? Math.max(0, (currentDasha.endDate.getTime() - now.getTime()) / (365.25 * 24 * 60 * 60 * 1000))
    : 0;

  // --- Next chapter (next Mahadasha) ---
  const nextDasha = findNextDasha(input.dashas, now);
  const nextDashaLordId = nextDasha ? (PLANET_NAME_TO_ID[nextDasha.planet] ?? 0) : 0;
  const nextChapterDef = ARCHETYPES[nextDashaLordId];

  // --- Persona modifier (lagna sign) ---
  const lagnaModifier = tl(LAGNA_MODIFIERS[input.ascendantSign], locale) || '';

  // --- Yoga influences (top 3 present yogas with psychological insights) ---
  const presentYogas = input.yogas.filter(y => y.present);
  const activeYogas = presentYogas
    .map(y => {
      const insightLt = YOGA_PSYCH_INSIGHTS[y.id];
      if (!insightLt) return null;
      return { name: y.name, influence: tl(insightLt, locale) };
    })
    .filter((y): y is { name: LocaleText; influence: string } => y !== null)
    .slice(0, 3);

  // --- Locale-resolved archetype names for templates ---
  const primaryName = tl(primaryDef.name, locale);
  const currentName = tl(currentChapterDef.name, locale);
  const nextName = tl(nextChapterDef.name, locale);

  // --- Headline ---
  const headline = renderHeadline({
    primary: primaryName,
    current: currentName,
    next: nextDasha ? nextName : undefined,
    year: nextDasha ? nextDasha.startDate.getFullYear() : undefined,
  }, locale);

  // --- Transition note ---
  // EN-specific cleanup of "The " prefix + lowercase only applies to en;
  // other locales' archetype names don't carry an English article so
  // we pass the locale-rendered name straight through.
  const stripPrefix = (n: string): string =>
    locale === 'en' ? n.replace(/^The /, '').toLowerCase() : n;
  const currentTheme = currentChapterDef.chapterThemes[0]
    ? tl(currentChapterDef.chapterThemes[0], locale)
    : '';
  const nextTheme = nextChapterDef.chapterThemes[0]
    ? tl(nextChapterDef.chapterThemes[0], locale)
    : '';
  const transitionNote = renderTransitionNote({
    fromName: stripPrefix(currentName),
    toName: stripPrefix(nextName),
    fromTheme: currentTheme,
    toTheme: nextTheme,
  }, locale);

  // --- Expression ---
  const expression = renderExpression({
    primaryName,
    lagnaModifier,
  }, locale);

  return {
    primary: {
      archetype: primaryDef.id,
      name: primaryDef.name,
      planet: primaryPlanetId,
      strength: primaryStrength,
      description: tl(primaryDef.coreDescription, locale),
      traits: primaryDef.traits.map(t => tl(t, locale)),
      blindSpot: tl(primaryDef.blindSpot, locale),
    },
    shadow: {
      archetype: shadowDef.id,
      name: shadowDef.name,
      planet: shadowPlanetId,
      strength: shadowStrength,
      description: tl(shadowDef.shadowDescription, locale),
      growthArea: tl(shadowDef.growthArea, locale),
    },
    currentChapter: {
      archetype: currentChapterDef.id,
      name: currentChapterDef.name,
      dashaLord: currentDashaLordId,
      startDate: currentDasha?.startDate ?? now,
      endDate: currentDasha?.endDate ?? now,
      yearsRemaining: Math.round(yearsRemaining * 10) / 10,
      description: tl(currentChapterDef.chapterDescription, locale),
      themes: currentChapterDef.chapterThemes.map(t => tl(t, locale)),
    },
    nextChapter: {
      archetype: nextChapterDef.id,
      name: nextChapterDef.name,
      dashaLord: nextDashaLordId,
      startDate: nextDasha?.startDate ?? now,
      transitionNote,
    },
    persona: {
      lagnaSign: input.ascendantSign,
      expression,
    },
    activeYogas,
    headline,
  };
}
