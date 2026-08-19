/**
 * MCP tool: get_matching
 *
 * Ashta Kuta (36-point Guna Milan) compatibility score for two people.
 * Inputs are the Moon-sign facts (nakshatra, rashi, optional pada) for
 * each person — the classical inputs, no birth-time needed. When the
 * caller only has birth details, use get_kundali first and read
 * moonNakshatra / moonRashi off the resulting planets array.
 *
 * Reuses src/lib/matching/ashta-kuta.ts.
 */

import { z } from 'zod';
import { computeAshtaKuta, type MatchInput } from '@/lib/matching/ashta-kuta';
import { calculateDashaKoota } from '@/lib/matching/dasha-koota';

const personSchema = z.object({
  moonNakshatra: z
    .number()
    .int()
    .min(1)
    .max(27)
    .describe('Moon nakshatra number 1-27 (1 = Ashwini, 27 = Revati)'),
  moonRashi: z
    .number()
    .int()
    .min(1)
    .max(12)
    .describe('Moon rashi number 1-12 (1 = Mesha/Aries, 12 = Meena/Pisces)'),
  moonPada: z
    .number()
    .int()
    .min(1)
    .max(4)
    .optional()
    .describe(
      'Moon nakshatra pada 1-4. Optional — used to detect the N4 same-pada Nadi dosha cancellation.',
    ),
});

export const matchingInputSchema = {
  personA: personSchema.describe(
    'Person A (traditionally the boy in Ashta Kuta convention)',
  ),
  personB: personSchema.describe(
    'Person B (traditionally the girl in Ashta Kuta convention)',
  ),
  system: z
    .enum(['ashta_kuta', 'dasha_koota'])
    .optional()
    .describe(
      "Matching system. Default 'ashta_kuta' (36-point Guna Milan). 'dasha_koota' returns the 3-koota subset historically used for quick screening.",
    ),
};

export async function runGetMatching(args: {
  personA: MatchInput;
  personB: MatchInput;
  system?: 'ashta_kuta' | 'dasha_koota';
}) {
  const system = args.system ?? 'ashta_kuta';

  if (system === 'dasha_koota') {
    const result = calculateDashaKoota(
      { moonNakshatra: args.personA.moonNakshatra, moonRashi: args.personA.moonRashi },
      { moonNakshatra: args.personB.moonNakshatra, moonRashi: args.personB.moonRashi },
    );
    return {
      source: 'dekhopanchang.com',
      system: 'Dasha Koota (3-koota subset)',
      result,
      citation: {
        attribution: 'Computed by @dekhopanchang/mcp — Matching Engine',
        methodology: 'https://dekhopanchang.com/en/about/methodology',
        sources: ['Brihat Parashara Hora Shastra (BPHS)', 'Muhurta Chintamani'],
      },
    };
  }

  const result = computeAshtaKuta(args.personA, args.personB);
  return {
    source: 'dekhopanchang.com',
    system: 'Ashta Kuta (36-point Guna Milan)',
    result: {
      totalScore: result.totalScore,
      maxScore: result.maxScore,
      percentage: result.percentage,
      verdict: result.verdict,
      verdictText: result.verdictText.en,
      nadiDoshaPresent: result.nadiDoshaPresent,
      nadiDoshaCancelled: result.nadiDoshaCancelled ?? false,
      kutas: result.kutas.map((k) => ({
        name: k.name.en,
        maxPoints: k.maxPoints,
        scored: k.scored,
        description: k.description.en,
        personADetail: k.boyDetail,
        personBDetail: k.girlDetail,
      })),
    },
    citation: {
      attribution: 'Computed by @dekhopanchang/mcp — Matching Engine',
      methodology: 'https://dekhopanchang.com/en/about/methodology',
      sources: [
        'Brihat Parashara Hora Shastra (BPHS)',
        'Muhurta Chintamani (Rama Daivajna)',
      ],
    },
  };
}
