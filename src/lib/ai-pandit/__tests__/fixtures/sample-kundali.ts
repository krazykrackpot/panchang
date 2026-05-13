/**
 * Sample KundaliData fixture for AI Pandit tests.
 *
 * Represents a real chart (anonymised birth data):
 * - Ascendant: Aries (1)
 * - Moon in Taurus (2) — house 2 (exalted)
 * - Saturn in Libra (7) — house 7 (exalted, retrograde)
 * - Jupiter in Cancer (4) — house 4 (exalted)
 * - Active Sade Sati (peak phase)
 * - Saturn Mahadasha, Mercury Antardasha
 * - Gajakesari Yoga present, Mangal Dosha present
 *
 * This chart has mixed factors: strong benefics (Jupiter exalted, Moon exalted)
 * but challenging Saturn placement (7th house, Sade Sati). Good for testing
 * MIXED and CAUTION verdicts.
 */

import type { KundaliData } from '@/types/kundali';

export const SAMPLE_KUNDALI: KundaliData = {
  birthData: {
    name: 'Test Native',
    date: '1990-06-15',
    time: '10:30',
    place: 'Bern, Switzerland',
    lat: 46.9481,
    lng: 7.4474,
    timezone: 'Europe/Zurich',
    ayanamsha: 'lahiri',
  },

  ascendant: {
    degree: 25.5,
    sign: 1, // Aries
    signName: { en: 'Aries', hi: 'मेष', sa: 'मेषः' },
  },

  planets: [
    {
      planet: { id: 0, name: { en: 'Sun', hi: 'सूर्य', sa: 'सूर्यः' }, symbol: '☉', color: '#e67e22' },
      longitude: 60.25, latitude: 0, speed: 0.96,
      sign: 3, signName: { en: 'Gemini', hi: 'मिथुन', sa: 'मिथुनम्' },
      house: 3,
      nakshatra: { id: 7, name: { en: 'Punarvasu', hi: 'पुनर्वसु', sa: 'पुनर्वसुः' }, deity: { en: 'Aditi' }, ruler: 'Jupiter', rulerName: { en: 'Jupiter' }, startDeg: 80, endDeg: 93.33, symbol: '🏹', nature: { en: 'Light' } },
      pada: 1, degree: '00°15\'00"',
      isRetrograde: false, isCombust: false, isExalted: false, isDebilitated: false, isOwnSign: false,
    },
    {
      planet: { id: 1, name: { en: 'Moon', hi: 'चन्द्र', sa: 'चन्द्रः' }, symbol: '☽', color: '#ecf0f1' },
      longitude: 33.7, latitude: 0, speed: 13.2,
      sign: 2, signName: { en: 'Taurus', hi: 'वृषभ', sa: 'वृषभम्' },
      house: 2,
      nakshatra: { id: 4, name: { en: 'Rohini', hi: 'रोहिणी', sa: 'रोहिणी' }, deity: { en: 'Brahma' }, ruler: 'Moon', rulerName: { en: 'Moon' }, startDeg: 40, endDeg: 53.33, symbol: '🐂', nature: { en: 'Fixed' } },
      pada: 1, degree: '03°42\'00"',
      isRetrograde: false, isCombust: false, isExalted: true, isDebilitated: false, isOwnSign: false,
    },
    {
      planet: { id: 2, name: { en: 'Mars', hi: 'मंगल', sa: 'मङ्गलः' }, symbol: '♂', color: '#e74c3c' },
      longitude: 10.5, latitude: 0, speed: 0.6,
      sign: 1, signName: { en: 'Aries', hi: 'मेष', sa: 'मेषम्' },
      house: 1,
      nakshatra: { id: 1, name: { en: 'Ashwini', hi: 'अश्विनी', sa: 'अश्विनी' }, deity: { en: 'Ashwini Kumaras' }, ruler: 'Ketu', rulerName: { en: 'Ketu' }, startDeg: 0, endDeg: 13.33, symbol: '🐴', nature: { en: 'Light' } },
      pada: 3, degree: '10°30\'00"',
      isRetrograde: false, isCombust: false, isExalted: false, isDebilitated: false, isOwnSign: true,
    },
    {
      planet: { id: 3, name: { en: 'Mercury', hi: 'बुध', sa: 'बुधः' }, symbol: '☿', color: '#2ecc71' },
      longitude: 75.8, latitude: 0, speed: 1.8,
      sign: 3, signName: { en: 'Gemini', hi: 'मिथुन', sa: 'मिथुनम्' },
      house: 3,
      nakshatra: { id: 7, name: { en: 'Punarvasu', hi: 'पुनर्वसु', sa: 'पुनर्वसुः' }, deity: { en: 'Aditi' }, ruler: 'Jupiter', rulerName: { en: 'Jupiter' }, startDeg: 80, endDeg: 93.33, symbol: '🏹', nature: { en: 'Light' } },
      pada: 4, degree: '15°48\'00"',
      isRetrograde: false, isCombust: false, isExalted: false, isDebilitated: false, isOwnSign: true,
    },
    {
      planet: { id: 4, name: { en: 'Jupiter', hi: 'बृहस्पति', sa: 'बृहस्पतिः' }, symbol: '♃', color: '#f39c12' },
      longitude: 95.0, latitude: 0, speed: 0.12,
      sign: 4, signName: { en: 'Cancer', hi: 'कर्क', sa: 'कर्कटम्' },
      house: 4,
      nakshatra: { id: 8, name: { en: 'Pushya', hi: 'पुष्य', sa: 'पुष्यः' }, deity: { en: 'Brihaspati' }, ruler: 'Saturn', rulerName: { en: 'Saturn' }, startDeg: 93.33, endDeg: 106.67, symbol: '🌸', nature: { en: 'Light' } },
      pada: 1, degree: '05°00\'00"',
      isRetrograde: false, isCombust: false, isExalted: true, isDebilitated: false, isOwnSign: false,
    },
    {
      planet: { id: 5, name: { en: 'Venus', hi: 'शुक्र', sa: 'शुक्रः' }, symbol: '♀', color: '#e8e6e3' },
      longitude: 45.3, latitude: 0, speed: 1.2,
      sign: 2, signName: { en: 'Taurus', hi: 'वृषभ', sa: 'वृषभम्' },
      house: 2,
      nakshatra: { id: 5, name: { en: 'Mrigashira', hi: 'मृगशिरा', sa: 'मृगशिरा' }, deity: { en: 'Soma' }, ruler: 'Mars', rulerName: { en: 'Mars' }, startDeg: 53.33, endDeg: 66.67, symbol: '🦌', nature: { en: 'Soft' } },
      pada: 1, degree: '15°18\'00"',
      isRetrograde: false, isCombust: false, isExalted: false, isDebilitated: false, isOwnSign: true,
    },
    {
      planet: { id: 6, name: { en: 'Saturn', hi: 'शनि', sa: 'शनिः' }, symbol: '♄', color: '#3498db' },
      longitude: 200.5, latitude: 0, speed: -0.05,
      sign: 7, signName: { en: 'Libra', hi: 'तुला', sa: 'तुला' },
      house: 7,
      nakshatra: { id: 16, name: { en: 'Vishakha', hi: 'विशाखा', sa: 'विशाखा' }, deity: { en: 'Indra-Agni' }, ruler: 'Jupiter', rulerName: { en: 'Jupiter' }, startDeg: 200, endDeg: 213.33, symbol: '🌿', nature: { en: 'Mixed' } },
      pada: 1, degree: '20°30\'00"',
      isRetrograde: true, isCombust: false, isExalted: true, isDebilitated: false, isOwnSign: false,
    },
    {
      planet: { id: 7, name: { en: 'Rahu', hi: 'राहु', sa: 'राहुः' }, symbol: '☊', color: '#8e44ad' },
      longitude: 290.0, latitude: 0, speed: -0.053,
      sign: 10, signName: { en: 'Capricorn', hi: 'मकर', sa: 'मकरम्' },
      house: 10,
      nakshatra: { id: 22, name: { en: 'Shravana', hi: 'श्रवण', sa: 'श्रवणम्' }, deity: { en: 'Vishnu' }, ruler: 'Moon', rulerName: { en: 'Moon' }, startDeg: 280, endDeg: 293.33, symbol: '👂', nature: { en: 'Movable' } },
      pada: 4, degree: '10°00\'00"',
      isRetrograde: true, isCombust: false, isExalted: false, isDebilitated: false, isOwnSign: false,
    },
    {
      planet: { id: 8, name: { en: 'Ketu', hi: 'केतु', sa: 'केतुः' }, symbol: '☋', color: '#95a5a6' },
      longitude: 110.0, latitude: 0, speed: -0.053,
      sign: 4, signName: { en: 'Cancer', hi: 'कर्क', sa: 'कर्कटम्' },
      house: 4,
      nakshatra: { id: 9, name: { en: 'Ashlesha', hi: 'आश्लेषा', sa: 'आश्लेषा' }, deity: { en: 'Naga' }, ruler: 'Mercury', rulerName: { en: 'Mercury' }, startDeg: 106.67, endDeg: 120, symbol: '🐍', nature: { en: 'Sharp' } },
      pada: 2, degree: '20°00\'00"',
      isRetrograde: true, isCombust: false, isExalted: false, isDebilitated: false, isOwnSign: false,
    },
  ],

  houses: [
    { house: 1, degree: 25.5, sign: 1, signName: { en: 'Aries' }, lord: 'Mars', lordName: { en: 'Mars' } },
    { house: 2, degree: 55.5, sign: 2, signName: { en: 'Taurus' }, lord: 'Venus', lordName: { en: 'Venus' } },
    { house: 3, degree: 85.5, sign: 3, signName: { en: 'Gemini' }, lord: 'Mercury', lordName: { en: 'Mercury' } },
    { house: 4, degree: 115.5, sign: 4, signName: { en: 'Cancer' }, lord: 'Moon', lordName: { en: 'Moon' } },
    { house: 5, degree: 145.5, sign: 5, signName: { en: 'Leo' }, lord: 'Sun', lordName: { en: 'Sun' } },
    { house: 6, degree: 175.5, sign: 6, signName: { en: 'Virgo' }, lord: 'Mercury', lordName: { en: 'Mercury' } },
    { house: 7, degree: 205.5, sign: 7, signName: { en: 'Libra' }, lord: 'Venus', lordName: { en: 'Venus' } },
    { house: 8, degree: 235.5, sign: 8, signName: { en: 'Scorpio' }, lord: 'Mars', lordName: { en: 'Mars' } },
    { house: 9, degree: 265.5, sign: 9, signName: { en: 'Sagittarius' }, lord: 'Jupiter', lordName: { en: 'Jupiter' } },
    { house: 10, degree: 295.5, sign: 10, signName: { en: 'Capricorn' }, lord: 'Saturn', lordName: { en: 'Saturn' } },
    { house: 11, degree: 325.5, sign: 11, signName: { en: 'Aquarius' }, lord: 'Saturn', lordName: { en: 'Saturn' } },
    { house: 12, degree: 355.5, sign: 12, signName: { en: 'Pisces' }, lord: 'Jupiter', lordName: { en: 'Jupiter' } },
  ],

  chart: {
    houses: [
      [2],     // H1: Mars
      [1, 5],  // H2: Moon, Venus
      [0, 3],  // H3: Sun, Mercury
      [4, 8],  // H4: Jupiter, Ketu
      [],      // H5
      [],      // H6
      [6],     // H7: Saturn
      [],      // H8
      [],      // H9
      [7],     // H10: Rahu
      [],      // H11
      [],      // H12
    ],
    ascendantDeg: 25.5,
    ascendantSign: 1,
  },

  navamshaChart: {
    houses: [[], [], [], [], [], [], [], [], [], [], [], []],
    ascendantDeg: 0,
    ascendantSign: 1,
  },

  ashtakavarga: {
    bpiTable: Array(7).fill(null).map(() => Array(12).fill(4)),
    savTable: [28, 32, 25, 30, 35, 22, 29, 26, 33, 31, 27, 24],
    reducedBpiTable: Array(7).fill(null).map(() => Array(12).fill(3)),
    reducedSavTable: [22, 26, 20, 24, 28, 18, 23, 21, 27, 25, 22, 19],
    pindaAshtakavarga: [150, 160, 140, 170, 180, 155, 145],
    planetNames: ['Sun', 'Moon', 'Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn'],
  },

  dashas: [
    {
      planet: 'Saturn',
      planetName: { en: 'Saturn', hi: 'शनि' },
      startDate: '2023-04-15',
      endDate: '2042-04-15',
      level: 'maha' as const,
      subPeriods: [
        {
          planet: 'Saturn',
          planetName: { en: 'Saturn', hi: 'शनि' },
          startDate: '2023-04-15',
          endDate: '2026-04-18',
          level: 'antar' as const,
        },
        {
          planet: 'Mercury',
          planetName: { en: 'Mercury', hi: 'बुध' },
          startDate: '2026-04-18',
          endDate: '2029-01-01',
          level: 'antar' as const,
        },
      ],
    },
  ],

  shadbala: [
    { planet: 'Sun', planetName: { en: 'Sun' }, totalStrength: 420, sthanaBala: 120, digBala: 60, kalaBala: 90, cheshtaBala: 50, naisargikaBala: 60, drikBala: 40 },
    { planet: 'Moon', planetName: { en: 'Moon' }, totalStrength: 480, sthanaBala: 150, digBala: 50, kalaBala: 100, cheshtaBala: 60, naisargikaBala: 51, drikBala: 69 },
    { planet: 'Mars', planetName: { en: 'Mars' }, totalStrength: 380, sthanaBala: 130, digBala: 40, kalaBala: 80, cheshtaBala: 50, naisargikaBala: 17, drikBala: 63 },
    { planet: 'Mercury', planetName: { en: 'Mercury' }, totalStrength: 500, sthanaBala: 160, digBala: 70, kalaBala: 95, cheshtaBala: 55, naisargikaBala: 25, drikBala: 95 },
    { planet: 'Jupiter', planetName: { en: 'Jupiter' }, totalStrength: 520, sthanaBala: 170, digBala: 80, kalaBala: 100, cheshtaBala: 60, naisargikaBala: 34, drikBala: 76 },
    { planet: 'Venus', planetName: { en: 'Venus' }, totalStrength: 400, sthanaBala: 140, digBala: 45, kalaBala: 85, cheshtaBala: 45, naisargikaBala: 42, drikBala: 43 },
    { planet: 'Saturn', planetName: { en: 'Saturn' }, totalStrength: 450, sthanaBala: 155, digBala: 55, kalaBala: 88, cheshtaBala: 52, naisargikaBala: 8, drikBala: 92 },
  ],

  // Sade Sati active — Saturn transiting near Moon sign (Taurus)
  sadeSati: {
    isActive: true,
    currentPhase: 'peak' as const,
    phaseProgress: 0.6,
    cycleProgress: 0.5,
    saturnDegree: 20.5,
    saturnSign: 2,
  } as import('@/lib/kundali/sade-sati-analysis').SadeSatiAnalysis,

  // Yogas — using YogaComplete format
  yogasComplete: [
    {
      id: 'gajakesari',
      name: { en: 'Gajakesari Yoga', hi: 'गजकेसरी योग' },
      category: 'moon_based' as const,
      isAuspicious: true,
      present: true,
      strength: 'Strong' as const,
      formationRule: { en: 'Jupiter in kendra from Moon' },
      description: { en: 'Grants wisdom, fame, and wealth' },
    },
    {
      id: 'budhaditya',
      name: { en: 'Budhaditya Yoga', hi: 'बुधादित्य योग' },
      category: 'sun_based' as const,
      isAuspicious: true,
      present: true,
      strength: 'Moderate' as const,
      formationRule: { en: 'Sun and Mercury in same house' },
      description: { en: 'Intelligence and communication skills' },
    },
    {
      id: 'mangal_dosha',
      name: { en: 'Mangal Dosha', hi: 'मंगल दोष' },
      category: 'dosha' as const,
      isAuspicious: false,
      present: true,
      strength: 'Moderate' as const,
      formationRule: { en: 'Mars in 1st house from ascendant' },
      description: { en: 'Challenges in marital harmony' },
    },
    {
      id: 'raja_yoga_1',
      name: { en: 'Raja Yoga', hi: 'राज योग' },
      category: 'raja' as const,
      isAuspicious: true,
      present: false, // NOT present — tests should NOT include this
      strength: 'Weak' as const,
      formationRule: { en: 'Kendra-trikona lord conjunction' },
      description: { en: 'Power and authority' },
    },
  ] as import('@/lib/kundali/yogas-complete').YogaComplete[],

  ayanamshaValue: 24.1,
  julianDay: 2448084.9375,
};
