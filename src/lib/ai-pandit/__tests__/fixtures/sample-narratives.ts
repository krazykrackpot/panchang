/**
 * Sample LLM output fixtures for validation testing.
 *
 * Each fixture is a complete LLMOutput object representing what the model
 * would return. Fixtures are tagged by language and expected validation result.
 *
 * All fixtures reference the SAMPLE_KUNDALI chart:
 * - Saturn in house 7, sign Libra, exalted, retrograde
 * - Jupiter in house 4, sign Cancer, exalted
 * - Moon in house 2, Taurus, exalted
 * - Mars in house 1, Aries, own sign
 * - Mercury in house 3, Gemini, own sign
 * - Active Sade Sati (peak)
 * - Gajakesari + Budhaditya present, Mangal Dosha present
 * - Saturn Mahadasha, Mercury Antardasha
 */

import type { LLMOutput } from '../../types';

// ─────────────────────────────────────────────────────────────────────────────
// GOOD NARRATIVES — should PASS all validation layers
// ─────────────────────────────────────────────────────────────────────────────

/** English narrative — MIXED verdict, career query. Should pass all layers. */
export const GOOD_EN_CAREER_MIXED: LLMOutput = {
  narrative: `Your career prospects present a mixed picture during this Saturn-Mercury dasha period. Saturn, your 10th lord, holds an exalted position in the 7th house, which brings underlying strength to professional matters, though its placement away from the 10th creates an indirect expression of career energy.

The presence of Gajakesari Yoga in your chart — formed by the auspicious relationship between Jupiter and Moon — supports wisdom and recognition in your field. However, the active Sade Sati in its peak phase introduces a period of testing and restructuring. This is Saturn's way of refining your path, not blocking it.

Budhaditya Yoga in the 3rd house enhances communication skills, which serves well in any professional context. Mars in its own sign in the lagna gives you the drive and initiative to push through obstacles.

Classical texts (BPHS Ch.26) note that an exalted Saturn, even when retrograde, eventually delivers its promises — often through patience and perseverance rather than sudden breakthroughs. The current period favours consolidation over expansion.

Remedy: Regular recitation of Shani Beej Mantra on Saturdays can help ease the intensity of Sade Sati. Donating dark-coloured items to the needy is also recommended during this transit.`,

  claims: [
    { type: 'planet_house', data: { planet: 6, house: 7 } },          // Saturn in 7th — correct
    { type: 'planet_dignity', data: { planet: 6, dignity: 'exalted' } }, // Saturn exalted — correct
    { type: 'dasha_reference', data: { major: 6, sub: 3 } },           // Saturn-Mercury — correct
    { type: 'yoga_mentioned', data: { name: 'gajakesari' } },          // Present in SAC
    { type: 'yoga_mentioned', data: { name: 'budhaditya' } },          // Present in SAC
    { type: 'sade_sati', data: { active: true } },                     // Correct
    { type: 'planet_house', data: { planet: 2, house: 1 } },          // Mars in 1st — correct
    { type: 'verdict_tone', data: { tone: 'mixed' } },
  ],

  remedies: [
    { type: 'mantra', name: 'Shani Beej Mantra', instructions: 'Recite "Om Praam Preem Praum Sah Shanaischaraya Namah" 108 times on Saturdays' },
    { type: 'charity', name: 'Saturn charity', instructions: 'Donate dark-coloured items (black sesame, mustard oil) to the needy on Saturdays' },
  ],

  classicalCitations: [
    { text: 'BPHS Ch.26', claim: 'Exalted Saturn delivers promises through patience' },
  ],
};

/** Hindi narrative — CAUTION verdict, relationship query. Should pass all layers. */
export const GOOD_HI_RELATIONSHIP_CAUTION: LLMOutput = {
  narrative: `आपकी कुण्डली में वैवाहिक जीवन के विषय में कुछ सावधानी की आवश्यकता है। शनि की आपके सप्तम भाव में उच्च राशि में स्थिति यह दर्शाती है कि विवाह में विलम्ब हो सकता है, किन्तु अन्ततः स्थिरता प्राप्त होगी।

मंगल दोष की उपस्थिति — मंगल प्रथम भाव में स्वराशि में — वैवाहिक सामंजस्य में कुछ चुनौतियाँ उत्पन्न कर सकती है। बृहत् पाराशर होरा शास्त्र (अध्याय 26) के अनुसार, प्रथम भाव का मंगल विवाह में तीव्रता लाता है।

शनि की वक्री गति सप्तम भाव में कार्मिक संबंधों का संकेत देती है। वर्तमान शनि-बुध दशा काल में संबंधों के विषय में धैर्य रखना श्रेयस्कर है।

साढ़ेसाती का शिखर चरण सक्रिय होने से इस समय अतिरिक्त सावधानी आवश्यक है। यह काल कठिन अवश्य है, परन्तु उपायों से इसका शमन सम्भव है।

उपाय: शनिवार को हनुमान चालीसा का पाठ करें। नीलम रत्न का विचार ज्योतिषी के परामर्श से करें।`,

  claims: [
    { type: 'planet_house', data: { planet: 6, house: 7 } },          // शनि सप्तम भाव — correct
    { type: 'planet_dignity', data: { planet: 6, dignity: 'exalted' } },
    { type: 'planet_retrograde', data: { planet: 6, isRetrograde: true } },
    { type: 'dosha_mentioned', data: { name: 'mangal dosha' } },
    { type: 'planet_house', data: { planet: 2, house: 1 } },          // मंगल प्रथम भाव — correct
    { type: 'dasha_reference', data: { major: 6, sub: 3 } },
    { type: 'sade_sati', data: { active: true } },
    { type: 'verdict_tone', data: { tone: 'caution' } },
  ],

  remedies: [
    { type: 'mantra', name: 'Hanuman Chalisa', instructions: 'शनिवार को हनुमान चालीसा का पाठ करें' },
    { type: 'gemstone', name: 'Neelam (Blue Sapphire)', instructions: 'ज्योतिषी के परामर्श से नीलम रत्न धारण करें' },
  ],

  classicalCitations: [
    { text: 'BPHS Ch.26', claim: 'Mars in 1st house brings intensity to marriage' },
  ],
};

// ─────────────────────────────────────────────────────────────────────────────
// BAD NARRATIVES — should FAIL specific validation layers
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Layer 1 FAIL: Verdict is CAUTION but narrative is overwhelmingly positive.
 * The tone doesn't match the engine's directional assessment.
 */
export const BAD_L1_TONE_MISMATCH: LLMOutput = {
  narrative: `This is an excellent period for your relationships! Highly auspicious planetary alignments make this the best time for marriage. Everything is शुभ and मंगलकारी — you are blessed with wonderful prospects. This golden phase will bring prosperous and thriving partnerships. An ideal and rewarding time for love.`,

  claims: [
    { type: 'planet_house', data: { planet: 6, house: 7 } },
    { type: 'verdict_tone', data: { tone: 'favourable' } },
  ],
  remedies: [],
  classicalCitations: [],
};

/**
 * Layer 2 FAIL: Claims Jupiter in house 10, but SAC says house 4.
 * Hallucinated planet position.
 */
export const BAD_L2_WRONG_CLAIM: LLMOutput = {
  narrative: `Jupiter in your 10th house brings excellent career prospects. This powerful placement of the guru graha directly influences your professional standing. Combined with Saturn's presence in the 7th house, the period shows mixed signals for overall growth.`,

  claims: [
    { type: 'planet_house', data: { planet: 4, house: 10 } },  // WRONG — Jupiter is in house 4
    { type: 'planet_house', data: { planet: 6, house: 7 } },   // Correct
    { type: 'verdict_tone', data: { tone: 'mixed' } },
  ],
  remedies: [],
  classicalCitations: [],
};

/**
 * Layer 2 FAIL: Claims a yoga that doesn't exist in the chart.
 * Hallucinated yoga.
 */
export const BAD_L2_HALLUCINATED_YOGA: LLMOutput = {
  narrative: `The presence of Hamsa Yoga in your chart — one of the Pancha Mahapurusha Yogas — grants you spiritual wisdom and a noble character. This powerful formation combined with the testing period of Sade Sati creates a balanced outlook with some challenges.`,

  claims: [
    { type: 'yoga_mentioned', data: { name: 'hamsa' } },       // NOT in SAC yogas
    { type: 'sade_sati', data: { active: true } },
    { type: 'verdict_tone', data: { tone: 'mixed' } },
  ],
  remedies: [],
  classicalCitations: [],
};

/**
 * Layer 2b FAIL: Narrative contains a wrong planet-house claim not in claims array.
 * The narrative scanner should extract "Venus in the 7th house" and find
 * it contradicts the SAC (Venus is in house 2).
 */
export const BAD_L2B_NARRATIVE_CLAIM: LLMOutput = {
  narrative: `Venus in the 7th house brings a natural charm to your partnerships, softening Saturn's serious influence there. This combination creates a mixed period for relationships — some challenges from Sade Sati but beauty and harmony from Venus.`,

  claims: [
    // Notice: the claims array does NOT include the Venus-7th claim.
    // Layer 2 would pass. Layer 2b (narrative scanner) should catch it.
    { type: 'planet_house', data: { planet: 6, house: 7 } },   // Saturn 7th — correct
    { type: 'sade_sati', data: { active: true } },
    { type: 'verdict_tone', data: { tone: 'mixed' } },
  ],
  remedies: [],
  classicalCitations: [],
};

/**
 * Layer 3 FAIL: Jupiter called a natural malefic.
 * Violates immutable Jyotish rule — Jupiter is ALWAYS a natural benefic.
 */
export const BAD_L3_TRADITION_EN: LLMOutput = {
  narrative: `Jupiter, being a natural malefic, creates obstacles in your 4th house related to domestic peace. Combined with Sade Sati's challenges, this is a difficult period. The presence of Ketu alongside this malefic Jupiter compounds the issue.`,

  claims: [
    { type: 'planet_house', data: { planet: 4, house: 4 } },   // Position is correct
    { type: 'sade_sati', data: { active: true } },
    { type: 'verdict_tone', data: { tone: 'caution' } },
  ],
  remedies: [],
  classicalCitations: [],
};

/**
 * Layer 3 FAIL (Hindi): बृहस्पति called पाप ग्रह.
 * Same rule violation in Hindi.
 */
export const BAD_L3_TRADITION_HI: LLMOutput = {
  narrative: `बृहस्पति एक प्राकृतिक पाप ग्रह होने के कारण चतुर्थ भाव में गृह शान्ति में बाधाएँ उत्पन्न करते हैं। साढ़ेसाती की चुनौतियों के साथ यह कठिन समय है। केतु की इस पाप बृहस्पति के साथ युति समस्या को बढ़ाती है।`,

  claims: [
    { type: 'planet_house', data: { planet: 4, house: 4 } },
    { type: 'sade_sati', data: { active: true } },
    { type: 'verdict_tone', data: { tone: 'caution' } },
  ],
  remedies: [],
  classicalCitations: [],
};

/**
 * Layer 3 WARNING (not FAIL): Hindi narrative with Hinglish code-switching.
 * Should produce warnings but NOT block delivery.
 */
export const WARN_HINGLISH_CODESWITCHING: LLMOutput = {
  narrative: `Saturn ka transit aapke 7th house mein hai aur ye ek challenging period hai. Jupiter ka aspect positive hai lekin Sade Sati ke karan kuch difficulties aa sakti hain. Career mein patience rakhna hoga. Dasha period mein caution zaroori hai. Overall ye time thoda mixed hai — good aur bad dono possibilities hain.`,

  claims: [
    { type: 'planet_house', data: { planet: 6, house: 7 } },
    { type: 'sade_sati', data: { active: true } },
    { type: 'verdict_tone', data: { tone: 'mixed' } },
  ],
  remedies: [],
  classicalCitations: [],
};

/**
 * Layer 3 FAIL (EN): Wrong special aspect — Mars given Jupiter's 5th/9th aspect.
 */
export const BAD_L3_WRONG_ASPECT: LLMOutput = {
  narrative: `Mars aspects the 5th and 9th houses from its position in the lagna, providing courage and initiative to these life areas. Combined with Sade Sati challenges, the overall picture is one of cautious progress.`,

  claims: [
    { type: 'planet_house', data: { planet: 2, house: 1 } },
    { type: 'sade_sati', data: { active: true } },
    { type: 'verdict_tone', data: { tone: 'caution' } },
  ],
  remedies: [],
  classicalCitations: [],
};

/**
 * Good narrative with empty claims array — tests Layer 2b as primary gate.
 * The narrative itself is correct but structured claims are missing.
 * Layer 2 passes trivially (no claims to check).
 * Layer 2b should extract and verify from prose.
 */
export const GOOD_EN_NO_STRUCTURED_CLAIMS: LLMOutput = {
  narrative: `Saturn in the 7th house during this Saturn-Mercury period creates a phase of patience in relationships. Jupiter's exalted position in the 4th house provides domestic comfort and wisdom. The active Sade Sati in peak phase adds some challenges but remedies can help.`,

  claims: [], // Empty — simulates a model that ignores JSON structure
  remedies: [],
  classicalCitations: [],
};
