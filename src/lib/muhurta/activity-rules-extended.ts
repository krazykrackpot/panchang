/**
 * Extended Activity Rules for Muhurta Engine
 *
 * 20 activities with classical nakshatra/tithi/weekday/hora rules.
 *
 * DESIGN PRINCIPLE (classical constraint-based, NOT scoring-based):
 *   "If not explicitly permitted → reject"
 *   NOT: "If not explicitly forbidden → accept"
 *
 * Each goodNakshatras list is a WHITELIST  –  only classically verified
 * nakshatras for that specific activity. Everything not in the list
 * scores 0 (neutral) or negative (if in avoidNakshatras).
 *
 * hardAvoidNakshatras = Tier 0 absolute veto (window rejected outright).
 * avoidNakshatras = Tier 3 penalty (-5 points, cancellable by strong lagna).
 *
 * Nakshatra nature reference:
 *   Kshipra (swift): 1-Ashwini, 8-Pushya, 13-Hasta
 *   Mrdu (soft): 5-Mrigashira, 14-Chitra, 17-Anuradha, 27-Revati
 *   Sthira (fixed): 4-Rohini, 12-U.Phalguni, 21-U.Ashadha, 26-U.Bhadrapada
 *   Chara (movable): 7-Punarvasu, 15-Swati, 22-Shravana, 23-Dhanishtha, 24-Shatabhisha
 *   Tikshna (sharp): 6-Ardra, 9-Ashlesha, 18-Jyeshtha, 19-Mula
 *   Ugra (fierce): 2-Bharani, 3-Krittika, 10-Magha, 11-P.Phalguni, 20-P.Ashadha, 25-P.Bhadrapada
 *   Mishra (mixed): 16-Vishakha
 *
 * Sources: Muhurta Chintamani (MC) Ch.6-7, B.V. Raman Muhurtha Ch.12-13,
 * Jyotirnibandha, Dharmasindhu. Cross-verified with ChatGPT classical analysis
 * and Gemini per-activity correction (May 2026 audit).
 */

import type { ExtendedActivity, ExtendedActivityId } from '@/types/muhurta-ai';
import { CAREER_ACTIVITIES } from '@/lib/career/career-activities';

export const EXTENDED_ACTIVITIES: Record<ExtendedActivityId, ExtendedActivity> = {

  // ═══════════════════════════════════════════════════════════════════
  // SAMSKARAS (Life ceremonies  –  strictest classical rules)
  // ═══════════════════════════════════════════════════════════════════

  marriage: {
    id: 'marriage',
    label: { en: 'Marriage (Vivah)', hi: 'विवाह', sa: 'विवाहः' },
    goodTithis: [2, 3, 5, 7, 10, 11, 13],
    // Muhurta Chintamani Vivah Prakarana  –  11 BEST nakshatras for marriage:
    // Rohini(4), Mrigashira(5), Magha(10), U.Phalguni(12), Hasta(13),
    // Swati(15), Anuradha(17), Moola(19), U.Ashadha(21), U.Bhadrapada(26), Revati(27)
    // PADA RESTRICTIONS: first quarter of Magha(10) & Moola(19), last quarter of Revati(27) are inauspicious.
    // SECOND-TIER (moderate, kept in goodNakshatras): Chitra(14), Shravana(22), Dhanishtha(23)
    // REMOVED from good list: Punarvasu(7), Pushya(8)  –  NOT in any marriage-specific classical list
    goodNakshatras: [4, 5, 10, 12, 13, 14, 15, 17, 19, 21, 22, 23, 26, 27],
    goodWeekdays: [1, 3, 4, 5], // Mon, Wed, Thu, Fri
    // Rikta tithis (4, 9, 14) + Amavasya (30) only.
    // Purnima(15) is neutral for marriage, not avoided. Ashtami(8) is NOT a Rikta tithi.
    avoidTithis: [4, 9, 14, 30],
    // Ugra + Tikshna + unsuitable: Ashwini(1)=impulsive, Bharani(2)=Yama, Krittika(3)=Agni,
    // Punarvasu(7)=not marriage-specific, Pushya(8)=not marriage-specific,
    // P.Phalguni(11)=pleasure, P.Ashadha(20)=purification,
    // Shatabhisha(24)=healing, P.Bhadrapada(25)=fierce
    avoidNakshatras: [1, 2, 3, 7, 8, 11, 20, 24, 25],
    // Absolute vetoes  –  MC "death-dealing / widowhood" nakshatras:
    // Ardra(6)=Rudra destruction, Ashlesha(9)=serpent/death of groom,
    // Vishakha(16)=bride suffering, Jyeshtha(18)=death of elder brother
    hardAvoidNakshatras: [6, 9, 16, 18],
    goodHoras: [5, 4, 1], // Venus, Jupiter, Moon
    relevantHouses: [2, 7, 11],
  },

  engagement: {
    id: 'engagement',
    label: { en: 'Engagement', hi: 'सगाई', sa: 'वाग्दानम्' },
    goodTithis: [2, 3, 5, 7, 10, 11, 13],
    // Same base as marriage  –  Muhurta Chintamani Vivah Prakarana nakshatras
    // Rohini(4), Mrigashira(5), Magha(10), U.Phalguni(12), Hasta(13),
    // Chitra(14), Swati(15), Anuradha(17), Moola(19), U.Ashadha(21),
    // Shravana(22), U.Bhadrapada(26), Revati(27)
    goodNakshatras: [4, 5, 10, 12, 13, 14, 15, 17, 19, 21, 22, 26, 27],
    goodWeekdays: [1, 3, 4, 5],
    // Rikta tithis (4, 9, 14) + Amavasya (30) only
    avoidTithis: [4, 9, 14, 30],
    avoidNakshatras: [1, 2, 3, 7, 8, 11, 20, 23, 24, 25],
    // Ardra(6)=Rudra tears, not for engagement
    hardAvoidNakshatras: [6],
    goodHoras: [5, 4, 1], // Venus, Jupiter, Moon
    relevantHouses: [2, 7, 11],
  },

  griha_pravesh: {
    id: 'griha_pravesh',
    label: { en: 'Griha Pravesh', hi: 'गृह प्रवेश', sa: 'गृहप्रवेशः' },
    goodTithis: [2, 3, 5, 7, 10, 11, 12, 13],
    // House entry needs STABILITY  –  Sthira nakshatras primary, select Mrdu/Chara
    // Rohini(4), Punarvasu(7), Pushya(8), U.Phalguni(12), Hasta(13),
    // Chitra(14), Anuradha(17), U.Ashadha(21), Shravana(22),
    // U.Bhadrapada(26), Revati(27)
    goodNakshatras: [4, 7, 8, 12, 13, 14, 17, 21, 22, 26, 27],
    goodWeekdays: [1, 3, 4, 5],
    avoidTithis: [4, 8, 9, 14, 15, 30],
    avoidNakshatras: [1, 2, 3, 5, 6, 9, 11, 15, 16, 18, 19, 20, 23, 24, 25],
    // Bharani(2)=death energy, Krittika(3)=fire in home, Ardra(6)=storms,
    // Ashlesha(9)=serpent, Vishakha(16)=split, Jyeshtha(18)=conflict
    hardAvoidNakshatras: [2, 3, 6, 9, 16, 18],
    goodHoras: [4, 5, 1], // Jupiter, Venus, Moon
    relevantHouses: [4, 7, 10],
  },

  mundan: {
    id: 'mundan',
    label: { en: 'Mundan (First Haircut)', hi: 'मुण्डन', sa: 'मुण्डनम्' },
    goodTithis: [2, 3, 5, 7, 10, 11, 13],
    // MC Chudakarana Prakarana: Kshipra + Mrdu + select Chara
    // Ashwini(1), Rohini(4), Mrigashira(5), Punarvasu(7), Pushya(8),
    // Hasta(13), Chitra(14), Swati(15), Shravana(22), Dhanishtha(23),
    // Shatabhisha(24), Revati(27)
    // Note: Jyeshtha(18) specifically permitted by MC for Chudakarana (protective)
    goodNakshatras: [1, 4, 5, 7, 8, 13, 14, 15, 18, 22, 23, 24, 27],
    goodWeekdays: [1, 3, 4, 5],
    avoidTithis: [4, 6, 8, 9, 14, 15, 30],
    avoidNakshatras: [2, 3, 6, 9, 10, 11, 16, 17, 19, 20, 25, 26],
    // Ardra(6)=Rudra destruction on child, Ashlesha(9)=serpent danger
    hardAvoidNakshatras: [6, 9],
    goodHoras: [4, 5, 0], // Jupiter, Venus, Sun
    relevantHouses: [1, 5, 11],
  },

  namakarana: {
    id: 'namakarana',
    label: { en: 'Namakarana (Naming)', hi: 'नामकरण', sa: 'नामकरणम्' },
    goodTithis: [1, 2, 3, 5, 7, 10, 11, 12, 13],
    // Grhya Sutras: broad list since namakarana is time-bound (11th/12th day)
    // Ashwini(1), Rohini(4), Mrigashira(5), Punarvasu(7), Pushya(8),
    // U.Phalguni(12), Hasta(13), Chitra(14), Swati(15), Anuradha(17),
    // U.Ashadha(21), Shravana(22), Dhanishtha(23), Shatabhisha(24),
    // U.Bhadrapada(26), Revati(27)
    goodNakshatras: [1, 4, 5, 7, 8, 12, 13, 14, 15, 17, 21, 22, 23, 24, 26, 27],
    goodWeekdays: [1, 3, 4, 5],
    avoidTithis: [4, 6, 8, 9, 14, 15, 30],
    avoidNakshatras: [2, 3, 6, 9, 10, 11, 16, 18, 19, 20, 25],
    // Only Ashlesha(9) has unanimous agreement for namakarana veto
    hardAvoidNakshatras: [9],
    goodHoras: [4, 5, 1], // Jupiter, Venus, Moon
    relevantHouses: [1, 5, 11],
  },

  upanayana: {
    id: 'upanayana',
    label: { en: 'Upanayana (Thread)', hi: 'उपनयन', sa: 'उपनयनम्' },
    goodTithis: [2, 3, 5, 7, 10, 11, 13],
    // Thread ceremony = initiation into learning  –  needs clarity + stability
    // Ashwini(1), Rohini(4), Mrigashira(5), Punarvasu(7), Pushya(8),
    // U.Phalguni(12), Hasta(13), Chitra(14), Swati(15), Anuradha(17),
    // Shravana(22), Revati(27)
    goodNakshatras: [1, 4, 5, 7, 8, 12, 13, 14, 15, 17, 22, 27],
    goodWeekdays: [1, 3, 4, 5],
    avoidTithis: [4, 6, 8, 9, 14, 15, 30],
    avoidNakshatras: [2, 3, 6, 9, 10, 11, 16, 18, 19, 20, 21, 23, 24, 25, 26],
    // Ardra(6)=Rudra energy inappropriate for sacred thread initiation
    hardAvoidNakshatras: [6],
    goodHoras: [4, 0, 3], // Jupiter, Sun, Mercury
    relevantHouses: [1, 5, 9],
  },

  // ═══════════════════════════════════════════════════════════════════
  // COMMERCE & FINANCE (stability + growth nakshatras)
  // ═══════════════════════════════════════════════════════════════════

  business: {
    id: 'business',
    label: { en: 'New Business', hi: 'नया व्यापार', sa: 'नवव्यापारः' },
    goodTithis: [1, 2, 3, 5, 7, 10, 11, 13],
    // Strict whitelist: only classically verified for business initiation
    // Rohini(4)=growth, Punarvasu(7)=restoration, Pushya(8)=BEST universal,
    // U.Phalguni(12)=commitment, Hasta(13)=skill, Chitra(14)=creative brilliance,
    // Anuradha(17)=loyalty, Shravana(22)=learning, Revati(27)=completion
    // Dhanishtha(23)=Vasus/wealth (conditional  –  good for structured enterprise)
    // Swati(15)=Vayu/trade (conditional  –  good for trading/brokerage, volatile for lock-in)
    goodNakshatras: [4, 7, 8, 12, 13, 14, 15, 17, 22, 23, 27],
    goodWeekdays: [1, 3, 4, 5],
    avoidTithis: [4, 8, 9, 14, 15, 30],
    // All Tikshna/Ugra + nakshatras unsuitable for new ventures
    avoidNakshatras: [1, 2, 3, 5, 6, 9, 10, 11, 16, 18, 19, 20, 21, 24, 25, 26],
    // Ardra(6)=Rudra destruction, Ashlesha(9)=serpentine binding
    hardAvoidNakshatras: [6, 9],
    goodHoras: [3, 4, 5], // Mercury, Jupiter, Venus
    relevantHouses: [2, 7, 10, 11],
  },

  property: {
    id: 'property',
    label: { en: 'Property Purchase', hi: 'भूमि/सम्पत्ति', sa: 'भूमिक्रयः' },
    goodTithis: [2, 3, 5, 7, 10, 11, 12, 13],
    // Property = FIXED assets  –  Sthira nakshatras dominate
    // Rohini(4)=fertile stability, Pushya(8)=universal, U.Phalguni(12)=commitment,
    // Hasta(13)=skill/precision, Anuradha(17)=loyalty, U.Ashadha(21)=final victory,
    // Shravana(22)=stability, U.Bhadrapada(26)=deep roots, Revati(27)=completion
    goodNakshatras: [4, 8, 12, 13, 17, 21, 22, 26, 27],
    goodWeekdays: [1, 3, 4, 5],
    avoidTithis: [4, 8, 9, 14, 30],
    avoidNakshatras: [1, 2, 3, 5, 6, 7, 9, 10, 11, 14, 15, 16, 18, 19, 20, 23, 24, 25],
    // Ardra(6)=unstable for fixed assets
    hardAvoidNakshatras: [6],
    goodHoras: [4, 5, 6], // Jupiter, Venus, Saturn
    relevantHouses: [4, 10, 11],
  },

  gold_purchase: {
    id: 'gold_purchase',
    label: { en: 'Gold Purchase', hi: 'स्वर्ण खरीद', sa: 'स्वर्णक्रयः' },
    goodTithis: [1, 2, 3, 5, 7, 10, 11, 13],
    // Gold = durable wealth  –  Sthira + select Mrdu
    // Rohini(4), Punarvasu(7), Pushya(8), U.Phalguni(12), Hasta(13),
    // Anuradha(17), U.Ashadha(21), Shravana(22), U.Bhadrapada(26), Revati(27)
    goodNakshatras: [4, 7, 8, 12, 13, 17, 21, 22, 26, 27],
    goodWeekdays: [1, 3, 4, 5],
    avoidTithis: [4, 8, 9, 14, 30],
    avoidNakshatras: [1, 2, 3, 5, 6, 9, 10, 11, 14, 15, 16, 18, 19, 20, 23, 24, 25],
    // Ardra(6)=volatility in precious metals
    hardAvoidNakshatras: [6],
    goodHoras: [4, 5, 0], // Jupiter, Venus, Sun
    relevantHouses: [2, 5, 11],
  },

  financial_signing: {
    id: 'financial_signing',
    label: { en: 'Financial Signing', hi: 'वित्तीय हस्ताक्षर', sa: 'वित्तहस्ताक्षरम्' },
    goodTithis: [1, 2, 3, 5, 7, 10, 11, 13],
    // Financial contracts need precision + stability  –  Sthira dominant
    // Rohini(4), Mrigashira(5)=careful assessment, Pushya(8), U.Phalguni(12),
    // Hasta(13)=precision, Anuradha(17), U.Ashadha(21), Shravana(22),
    // U.Bhadrapada(26), Revati(27)
    goodNakshatras: [4, 5, 8, 12, 13, 17, 21, 22, 26, 27],
    goodWeekdays: [1, 3, 4, 5],
    avoidTithis: [4, 8, 9, 14, 30],
    avoidNakshatras: [1, 2, 3, 6, 7, 9, 10, 11, 14, 15, 16, 18, 19, 20, 23, 24, 25],
    // Bharani(2)=Yama/death energy in finance, Ardra(6)=contract destruction
    hardAvoidNakshatras: [2, 6],
    goodHoras: [3, 4, 5], // Mercury, Jupiter, Venus
    relevantHouses: [2, 6, 10, 11],
  },

  agriculture: {
    id: 'agriculture',
    label: { en: 'Agriculture', hi: 'कृषि', sa: 'कृषिः' },
    goodTithis: [2, 3, 5, 7, 10, 11, 12, 13],
    // Sowing/planting = Sthira nakshatras (fixed growth)
    // Rohini(4)=fertility, Pushya(8)=nourishment, U.Phalguni(12)=stability,
    // Hasta(13)=skill, Anuradha(17)=devotion, U.Ashadha(21)=harvest,
    // Shravana(22)=growth, U.Bhadrapada(26)=deep roots, Revati(27)=completion
    goodNakshatras: [4, 8, 12, 13, 17, 21, 22, 26, 27],
    goodWeekdays: [1, 3, 4, 5],
    avoidTithis: [4, 8, 9, 14, 15, 30],
    avoidNakshatras: [1, 2, 3, 5, 6, 7, 9, 10, 11, 14, 15, 16, 18, 19, 20, 23, 24, 25],
    // Ardra(6)=storms destroy crops
    hardAvoidNakshatras: [6],
    goodHoras: [1, 5, 4], // Moon, Venus, Jupiter
    relevantHouses: [4, 6, 11],
  },

  // ═══════════════════════════════════════════════════════════════════
  // TRAVEL & MOVEMENT (Chara + Kshipra nakshatras)
  // ═══════════════════════════════════════════════════════════════════

  vehicle: {
    id: 'vehicle',
    label: { en: 'Vehicle Purchase', hi: 'वाहन खरीद', sa: 'वाहनक्रयः' },
    goodTithis: [1, 2, 3, 5, 6, 7, 10, 11, 12, 13, 15],
    // Vehicles = movement + durability  –  Chara/Kshipra primary, Sthira for durability
    // Ashwini(1)=swift vehicles, Rohini(4)=durability, Mrigashira(5)=travel,
    // Punarvasu(7), Pushya(8), U.Phalguni(12), Hasta(13), Chitra(14)=design,
    // Swati(15)=movement, Anuradha(17), U.Ashadha(21), Shravana(22),
    // Dhanishtha(23), Shatabhisha(24), U.Bhadrapada(26), Revati(27)
    goodNakshatras: [1, 4, 5, 7, 8, 12, 13, 14, 15, 17, 21, 22, 23, 24, 26, 27],
    goodWeekdays: [0, 1, 3, 4, 5],
    avoidTithis: [4, 8, 9, 14, 30],
    avoidNakshatras: [2, 3, 6, 9, 10, 11, 16, 18, 19, 20, 25],
    // Ashlesha(9)=accident, Jyeshtha(18)=accident
    hardAvoidNakshatras: [9, 18],
    goodHoras: [5, 4, 3], // Venus, Jupiter, Mercury
    relevantHouses: [4, 9, 11],
  },

  travel: {
    id: 'travel',
    label: { en: 'Travel', hi: 'यात्रा', sa: 'यात्रा' },
    goodTithis: [2, 3, 5, 7, 10, 11, 13],
    // Travel = safety + mobility  –  Kshipra/Chara/Mrdu nakshatras
    // Ashwini(1)=swift, Rohini(4)=safe, Mrigashira(5)=searching,
    // Punarvasu(7)=return, Pushya(8)=protected, U.Phalguni(12),
    // Hasta(13), Chitra(14), Swati(15)=wind/movement, Anuradha(17),
    // Shravana(22), Dhanishtha(23), Revati(27)=safe journeys
    goodNakshatras: [1, 4, 5, 7, 8, 12, 13, 14, 15, 17, 22, 23, 27],
    goodWeekdays: [1, 3, 4, 5],
    avoidTithis: [4, 8, 9, 14, 15, 30],
    avoidNakshatras: [2, 3, 6, 9, 10, 11, 16, 18, 19, 20, 21, 24, 25, 26],
    // Ardra(6)=storms, Ashlesha(9)=danger
    hardAvoidNakshatras: [6, 9],
    goodHoras: [3, 5, 1], // Mercury, Venus, Moon
    relevantHouses: [3, 9, 12],
  },

  relocation: {
    id: 'relocation',
    label: { en: 'Relocation', hi: 'स्थानान्तरण', sa: 'स्थानान्तरणम्' },
    goodTithis: [2, 3, 5, 7, 10, 11, 12, 13],
    // Moving/settling = stability at destination  –  Chara for movement + Sthira for settling
    // Rohini(4), Mrigashira(5), Punarvasu(7), Pushya(8), U.Phalguni(12),
    // Hasta(13), Swati(15)=movement, Anuradha(17), Shravana(22),
    // Dhanishtha(23), Revati(27)
    goodNakshatras: [4, 5, 7, 8, 12, 13, 15, 17, 22, 23, 27],
    goodWeekdays: [1, 3, 4, 5],
    avoidTithis: [4, 8, 9, 14, 15, 30],
    avoidNakshatras: [1, 2, 3, 6, 9, 10, 11, 14, 16, 18, 19, 20, 21, 24, 25, 26],
    // Ardra(6)=instability at new location
    hardAvoidNakshatras: [6],
    goodHoras: [4, 5, 1], // Jupiter, Venus, Moon
    relevantHouses: [3, 4, 9, 12],
  },

  // ═══════════════════════════════════════════════════════════════════
  // EDUCATION & KNOWLEDGE
  // ═══════════════════════════════════════════════════════════════════

  education: {
    id: 'education',
    label: { en: 'Education Start', hi: 'विद्यारम्भ', sa: 'विद्यारम्भः' },
    goodTithis: [1, 2, 3, 5, 7, 10, 11, 13],
    // Learning = clarity + receptivity  –  Kshipra/Mrdu + intellectual Chara
    // Ashwini(1)=quick grasp, Rohini(4)=steady learning, Mrigashira(5)=curiosity,
    // Punarvasu(7)=understanding, Pushya(8)=nourishment, U.Phalguni(12),
    // Hasta(13)=skill, Swati(15)=independent thought, Anuradha(17)=devotion,
    // Shravana(22)=BEST for learning (deity Vishnu/listening), Dhanishtha(23), Revati(27)
    goodNakshatras: [1, 4, 5, 7, 8, 12, 13, 15, 17, 22, 23, 27],
    goodWeekdays: [1, 3, 4, 5],
    avoidTithis: [4, 8, 9, 14, 15, 30],
    avoidNakshatras: [2, 3, 6, 9, 10, 11, 14, 16, 18, 19, 20, 21, 24, 25, 26],
    // Ashlesha(9)=confusion/deception in learning
    hardAvoidNakshatras: [9],
    goodHoras: [3, 4, 0], // Mercury, Jupiter, Sun
    relevantHouses: [4, 5, 9],
  },

  exam: {
    id: 'exam',
    label: { en: 'Examination', hi: 'परीक्षा', sa: 'परीक्षा' },
    goodTithis: [1, 2, 3, 5, 7, 10, 11, 13],
    // Exams = clarity + performance  –  same base as education
    goodNakshatras: [1, 4, 5, 7, 8, 12, 13, 15, 17, 22, 23, 27],
    goodWeekdays: [1, 3, 4, 5],
    avoidTithis: [4, 8, 9, 14, 15, 30],
    avoidNakshatras: [2, 3, 6, 9, 10, 11, 14, 16, 18, 19, 20, 21, 24, 25, 26],
    hardAvoidNakshatras: [9],
    goodHoras: [3, 4, 0], // Mercury, Jupiter, Sun
    relevantHouses: [4, 5, 9],
  },

  // ═══════════════════════════════════════════════════════════════════
  // MEDICAL & SURGERY (Tikshna nakshatras become GOOD here)
  // ═══════════════════════════════════════════════════════════════════

  medical_treatment: {
    id: 'medical_treatment',
    label: { en: 'Medical Treatment', hi: 'चिकित्सा', sa: 'चिकित्सा' },
    goodTithis: [2, 3, 5, 7, 10, 11, 13],
    // Medicine = healing  –  Rudra IS the Celestial Physician
    // Ashwini(1)=Ashwini Kumaras/divine healers, Rohini(4)=nourishment,
    // Ardra(6)=Rudra healing, Punarvasu(7)=restoration, Pushya(8)=nourishment,
    // Hasta(13)=skill, Swati(15)=independence, Anuradha(17)=devotion,
    // Shravana(22)=listening/diagnosis, Shatabhisha(24)=100 physicians, Revati(27)
    goodNakshatras: [1, 4, 6, 7, 8, 13, 15, 17, 22, 24, 27],
    goodWeekdays: [1, 3, 4, 5],
    avoidTithis: [4, 6, 8, 9, 14, 15, 30],
    avoidNakshatras: [2, 3, 5, 9, 10, 11, 12, 14, 16, 18, 19, 20, 21, 23, 25, 26],
    goodHoras: [4, 0, 1], // Jupiter, Sun, Moon
    relevantHouses: [1, 6, 11],
  },

  surgery: {
    id: 'surgery',
    label: { en: 'Surgery', hi: 'शल्य चिकित्सा', sa: 'शल्यचिकित्सा' },
    goodTithis: [2, 3, 5, 7, 10, 11, 13],
    // Surgery = CUTTING  –  Tikshna/Ugra nakshatras are CORRECT here
    // This is the classical INVERSION: "bad" nakshatras become good for surgery
    // Ashwini(1)=divine surgeons, Ardra(6)=Rudra cuts, Pushya(8)=universal,
    // Ashlesha(9)=serpent precision, Magha(10)=authority, Hasta(13)=hands/skill,
    // Jyeshtha(18)=decisive, Mula(19)=uprooting disease
    goodNakshatras: [1, 6, 8, 9, 10, 13, 18, 19],
    goodWeekdays: [1, 2, 4], // Mon, Tue(Mars=surgery), Thu
    avoidTithis: [4, 6, 8, 9, 14, 15, 30],
    // Soft/stable nakshatras are WRONG for surgery  –  no cutting energy
    avoidNakshatras: [4, 5, 7, 11, 12, 14, 15, 16, 17, 20, 21, 22, 23, 24, 25, 26, 27],
    goodHoras: [2, 0, 4], // Mars, Sun, Jupiter
    relevantHouses: [1, 6, 8, 11],
  },

  // ═══════════════════════════════════════════════════════════════════
  // LEGAL & CONFLICT (Tikshna/Ugra nakshatras HELP here)
  // ═══════════════════════════════════════════════════════════════════

  court_case: {
    id: 'court_case',
    label: { en: 'Court Case', hi: 'न्यायालय', sa: 'न्यायालयः' },
    goodTithis: [2, 3, 5, 7, 10, 11, 13],
    // Litigation = aggressive action  –  fierce nakshatras HELP
    // Ashwini(1)=swift, Bharani(2)=Yama/justice, Krittika(3)=Agni/burning opposition,
    // Ardra(6)=Rudra/destruction of enemy, Pushya(8)=universal, Hasta(13)=skill,
    // Chitra(14)=precision, Jyeshtha(18)=seniority/authority, Mula(19)=uprooting
    goodNakshatras: [1, 2, 3, 6, 8, 13, 14, 18, 19],
    goodWeekdays: [1, 2, 4, 5], // Mon, Tue(Mars=fight), Thu, Fri
    avoidTithis: [4, 8, 9, 14, 15, 30],
    // Soft/gentle nakshatras don't help in court
    avoidNakshatras: [4, 5, 7, 9, 10, 11, 12, 15, 16, 17, 20, 21, 22, 23, 24, 25, 26, 27],
    goodHoras: [0, 4, 2], // Sun, Jupiter, Mars
    relevantHouses: [6, 7, 11],
  },

  // ═══════════════════════════════════════════════════════════════════
  // SPIRITUAL (Tikshna valid for intense tapas/sadhana)
  // ═══════════════════════════════════════════════════════════════════

  spiritual_practice: {
    id: 'spiritual_practice',
    label: { en: 'Spiritual Practice', hi: 'साधना', sa: 'साधना' },
    goodTithis: [1, 2, 3, 5, 7, 10, 11, 13, 15],
    // Spiritual practice accepts broader range  –  Tikshna valid for intense tapas
    // Ashwini(1), Bharani(2)=Yama/mortality awareness, Krittika(3)=purification fire,
    // Ardra(6)=Rudra tapas, Punarvasu(7), Pushya(8), U.Phalguni(12),
    // Hasta(13), Chitra(14), Anuradha(17), Mula(19)=roots of liberation,
    // P.Ashadha(20)=invincibility, U.Ashadha(21), Shravana(22),
    // P.Bhadrapada(25)=fierce austerity, Revati(27)
    goodNakshatras: [1, 2, 3, 6, 7, 8, 12, 13, 14, 17, 19, 20, 21, 22, 25, 27],
    goodWeekdays: [0, 1, 4], // Sun, Mon, Thu
    avoidTithis: [4, 8, 9, 14, 30],
    avoidNakshatras: [5, 9, 10, 11, 15, 16, 18, 23, 24, 26],
    goodHoras: [4, 0, 1], // Jupiter, Sun, Moon
    relevantHouses: [5, 9, 12],
  },

  // ─── Career activities ─────────────────────────────────────────────
  // The 8 career-muhurta entries live in src/lib/career/career-activities.ts
  // (separated for review/audit clarity since they were added together).
  // They satisfy the same `ExtendedActivity` contract so the verdict-engine
  // consumes them identically. See docs/superpowers/specs/2026-05-27-
  // career-muhurta-design.md for the full design.
  ...CAREER_ACTIVITIES,
};

export function getExtendedActivity(id: ExtendedActivityId): ExtendedActivity {
  return EXTENDED_ACTIVITIES[id];
}

export function getAllExtendedActivities(): ExtendedActivity[] {
  return Object.values(EXTENDED_ACTIVITIES);
}
