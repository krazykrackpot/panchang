// src/lib/tippanni/convergence/evaluator.ts

import { isBenefic } from '@/lib/tippanni/utils';
import type { ConvergenceInput, PatternCondition } from './types';
import { isPlanetStrong, isHouseAfflicted, matchesPlanetFilter } from './utils';

// Kendra distances (0, 3, 6, 9 signs away = aspects in Vedic astrology)
const KENDRA_DISTANCES = new Set([0, 3, 6, 9]);

/**
 * Evaluates a single PatternCondition against the provided ConvergenceInput.
 * Returns true if the condition is satisfied, false otherwise.
 */
export function evaluateCondition(
  cond: PatternCondition,
  input: ConvergenceInput,
): boolean {
  // ── Natal conditions ──────────────────────────────────────────────────────

  if (cond.type === 'natal') {
    switch (cond.check) {
      case 'planet-in-house': {
        return input.planets.some(
          (p) => p.house === cond.house && matchesPlanetFilter(cond.planet, p.id),
        );
      }

      case 'lord-strong': {
        const lordId = input.relationships.houseRulers[cond.house];
        if (lordId === undefined) return false;
        return isPlanetStrong(lordId, input);
      }

      case 'lord-afflicted': {
        return isHouseAfflicted(cond.house, input);
      }

      case 'yoga-present': {
        return input.yogaIds.includes(cond.yogaId);
      }

      case 'dosha-present': {
        return input.doshaIds.includes(cond.doshaId);
      }

      case 'benefic-aspect-to-house': {
        // Find the sign of the target house
        const houseData = input.houses.find((h) => h.house === cond.house);
        if (!houseData) return false;
        const targetSign = houseData.sign; // 1-based

        // Check if any benefic planet's sign is at a kendra distance from target sign
        return input.planets.some((p) => {
          if (!isBenefic(p.id)) return false;
          const distance = ((p.sign - targetSign + 12) % 12);
          return KENDRA_DISTANCES.has(distance);
        });
      }
    }
  }

  // ── Transit conditions ────────────────────────────────────────────────────

  if (cond.type === 'transit') {
    switch (cond.check) {
      case 'planet-in-house-from-moon': {
        return input.relationships.transitHouses[cond.planet] === cond.house;
      }
    }
  }

  // ── Dasha conditions ──────────────────────────────────────────────────────

  if (cond.type === 'dasha') {
    switch (cond.check) {
      case 'lord-rules-or-occupies': {
        const { dashaLord, antarLord } = input;
        const rulerOfHouse = input.relationships.houseRulers[cond.house];

        // Does dashaLord or antarLord rule this house?
        if (dashaLord === rulerOfHouse || antarLord === rulerOfHouse) return true;

        // Does dashaLord or antarLord occupy this house?
        const dashaLordHouse = input.relationships.planetHouses[dashaLord];
        const antarLordHouse = input.relationships.planetHouses[antarLord];
        if (dashaLordHouse === cond.house || antarLordHouse === cond.house) return true;

        return false;
      }

      case 'lord-is-planet': {
        return input.dashaLord === cond.planet || input.antarLord === cond.planet;
      }
    }
  }

  // ── Retro conditions ──────────────────────────────────────────────────────

  if (cond.type === 'retro') {
    switch (cond.check) {
      case 'planet-retrograde': {
        const planet = input.planets.find((p) => p.id === cond.planet);
        return planet?.isRetrograde ?? false;
      }
    }
  }

  // ── Combust conditions ────────────────────────────────────────────────────

  if (cond.type === 'combust') {
    switch (cond.check) {
      case 'planet-combust': {
        const planet = input.planets.find((p) => p.id === cond.planet);
        return planet?.isCombust ?? false;
      }
    }
  }

  return false;
}
