/**
 * Expected SAC output for the sample-kundali fixture.
 *
 * This is the ground truth that the Context Builder should produce
 * from SAMPLE_KUNDALI. Tests compare buildContext() output against this.
 */

import type { StructuredAstrologicalContext } from '../../types';

export const EXPECTED_SAC: StructuredAstrologicalContext = {
  birth: {
    date: '1990-06-15',
    time: '10:30',
    place: 'Bern, Switzerland',
    coordinates: [46.9481, 7.4474],
    timezone: 'Europe/Zurich',
  },

  ascendant: {
    sign: 1,
    signName: 'Aries',
    degree: '25°30\'00"',
    nakshatra: 'Bharani',   // 25.5° Aries falls in Bharani (13.33°-26.67°)
    pada: 4,                // (25.5 - 13.33) / 3.33 ≈ 3.65 → pada 4
  },

  planets: [
    { id: 0, name: 'Sun',     sign: 3,  signName: 'Gemini',    house: 3,  degree: '00°15\'00"', nakshatra: 'Punarvasu',  pada: 1, dignity: 'neutral',     isRetrograde: false, isCombust: false, speed: 0.96 },
    { id: 1, name: 'Moon',    sign: 2,  signName: 'Taurus',    house: 2,  degree: '03°42\'00"', nakshatra: 'Rohini',     pada: 1, dignity: 'exalted',     isRetrograde: false, isCombust: false, speed: 13.2 },
    { id: 2, name: 'Mars',    sign: 1,  signName: 'Aries',     house: 1,  degree: '10°30\'00"', nakshatra: 'Ashwini',    pada: 3, dignity: 'own',         isRetrograde: false, isCombust: false, speed: 0.6 },
    { id: 3, name: 'Mercury', sign: 3,  signName: 'Gemini',    house: 3,  degree: '15°48\'00"', nakshatra: 'Punarvasu',  pada: 4, dignity: 'own',         isRetrograde: false, isCombust: false, speed: 1.8 },
    { id: 4, name: 'Jupiter', sign: 4,  signName: 'Cancer',    house: 4,  degree: '05°00\'00"', nakshatra: 'Pushya',     pada: 1, dignity: 'exalted',     isRetrograde: false, isCombust: false, speed: 0.12 },
    { id: 5, name: 'Venus',   sign: 2,  signName: 'Taurus',    house: 2,  degree: '15°18\'00"', nakshatra: 'Mrigashira', pada: 1, dignity: 'own',         isRetrograde: false, isCombust: false, speed: 1.2 },
    { id: 6, name: 'Saturn',  sign: 7,  signName: 'Libra',     house: 7,  degree: '20°30\'00"', nakshatra: 'Vishakha',   pada: 1, dignity: 'exalted',     isRetrograde: true,  isCombust: false, speed: -0.05 },
    { id: 7, name: 'Rahu',    sign: 10, signName: 'Capricorn', house: 10, degree: '10°00\'00"', nakshatra: 'Shravana',   pada: 4, dignity: 'neutral',     isRetrograde: true,  isCombust: false, speed: -0.053 },
    { id: 8, name: 'Ketu',    sign: 4,  signName: 'Cancer',    house: 4,  degree: '20°00\'00"', nakshatra: 'Ashlesha',   pada: 2, dignity: 'neutral',     isRetrograde: true,  isCombust: false, speed: -0.053 },
  ],

  dasha: {
    mahadasha: { lordId: 6, lordName: 'Saturn', start: '2023-04-15', end: '2042-04-15' },
    // In 2026, Mercury antardasha should be active (2026-04-18 to 2029-01-01)
    antardasha: { lordId: 3, lordName: 'Mercury', start: '2026-04-18', end: '2029-01-01' },
    pratyantardasha: undefined,
  },

  yogas: [
    { name: 'Gajakesari Yoga', planets: [], strength: 'strong',   category: 'moon_based', isAuspicious: true,  classicalRef: '' },
    { name: 'Budhaditya Yoga', planets: [], strength: 'moderate', category: 'sun_based',  isAuspicious: true,  classicalRef: '' },
  ],

  doshas: [
    { name: 'Mangal Dosha', severity: 'moderate' },
  ],

  // Transits are computed live — this is a placeholder for test assertions.
  // The actual test should verify structure, not exact transit values
  // (since transits change daily).
  transits: [],

  sadeSati: { active: true, phase: 'peak' },
  kaalSarpa: { active: false, type: null },

  shadbala: {
    0: { total: 420, required: 390, ratio: 420 / 390 },   // Sun: strong
    1: { total: 480, required: 360, ratio: 480 / 360 },   // Moon: very strong
    2: { total: 380, required: 300, ratio: 380 / 300 },   // Mars: strong
    3: { total: 500, required: 420, ratio: 500 / 420 },   // Mercury: strong
    4: { total: 520, required: 390, ratio: 520 / 390 },   // Jupiter: very strong
    5: { total: 400, required: 330, ratio: 400 / 330 },   // Venus: strong
    6: { total: 450, required: 300, ratio: 450 / 300 },   // Saturn: very strong
  },

  ashtakavarga: {
    houseScores: [28, 32, 25, 30, 35, 22, 29, 26, 33, 31, 27, 24],
  },

  // Domain verdicts — would be computed by scoreDomain() in real code.
  // For tests, we set them explicitly.
  domainVerdicts: {
    career: {
      verdict: 'MIXED',
      score: 6.5,
      factors: [
        { type: 'dignity', detail: 'Saturn (10th lord) exalted in 7th — strong but placed in kendra, not 10th', sentiment: 'positive', weight: 0.7 },
        { type: 'transit', detail: 'Rahu in 10th house — unconventional career path', sentiment: 'neutral', weight: 0.5 },
        { type: 'special', detail: 'Sade Sati peak phase active', sentiment: 'negative', weight: 0.8 },
      ],
    },
    relationship: {
      verdict: 'CAUTION',
      score: 4.0,
      factors: [
        { type: 'dosha', detail: 'Mangal Dosha — Mars in 1st house', sentiment: 'negative', weight: 0.8 },
        { type: 'dignity', detail: 'Saturn exalted in 7th — delays but eventual stability', sentiment: 'positive', weight: 0.6 },
        { type: 'special', detail: 'Saturn retrograde in 7th — karmic relationship patterns', sentiment: 'negative', weight: 0.7 },
      ],
    },
    health: {
      verdict: 'FAVOURABLE',
      score: 7.5,
      factors: [
        { type: 'dignity', detail: 'Mars in own sign Aries in lagna — strong vitality', sentiment: 'positive', weight: 0.8 },
        { type: 'yoga', detail: 'Moon exalted in 2nd — emotional stability', sentiment: 'positive', weight: 0.6 },
      ],
    },
  },

  primaryVerdict: 'MIXED',
  primaryFactors: [
    { type: 'dignity', detail: 'Saturn (10th lord) exalted in 7th', sentiment: 'positive', weight: 0.7 },
    { type: 'special', detail: 'Sade Sati peak phase active', sentiment: 'negative', weight: 0.8 },
  ],
};
