/**
 * Tajika Aspects and Yogas for Varshaphal
 * Detects Ithasala, Ishrafa, Nakta, Yamaya, Manaú yogas
 */

import { normalizeDeg } from '@/lib/ephem/astronomical';
import { GRAHAS } from '@/lib/constants/grahas';
import type { PlanetPosition } from '@/types/kundali';
import type { TajikaYoga } from '@/types/varshaphal';
import type { Trilingual } from '@/types/panchang';

// ─── P2-04: Planet-pair year-prediction matrix ──────────────────────────────
// Classical Tajika: planet pairs have specific annual meanings based on their nature.
// This gives richer interpretation for Ithasala / Ishrafa yogas.
// Reference: Neelakantha's Tajika Neelakanthi, Somanatha's Tajika Shastra

const PLANET_PAIR_YEAR_MEANING: Record<string, { en: string; hi: string }> = {
  // Sun combinations
  '0-4': { en: 'Sun–Jupiter: Career elevation, recognition from authorities, dharmic growth, honors and promotions likely.',      hi: 'सूर्य–गुरु: करियर उन्नति, अधिकारियों से मान्यता, धर्मिक विकास, पदोन्नति संभव।' },
  '4-0': { en: 'Sun–Jupiter: Career elevation, recognition from authorities, dharmic growth, honors and promotions likely.',      hi: 'सूर्य–गुरु: करियर उन्नति, अधिकारियों से मान्यता, धर्मिक विकास, पदोन्नति संभव।' },
  '0-1': { en: 'Sun–Moon: Public recognition, emotional and professional harmony, relationship with father and public.',           hi: 'सूर्य–चन्द्र: सार्वजनिक मान्यता, भावनात्मक और व्यावसायिक सामंजस्य।' },
  '1-0': { en: 'Sun–Moon: Public recognition, emotional and professional harmony, relationship with father and public.',           hi: 'सूर्य–चन्द्र: सार्वजनिक मान्यता, भावनात्मक और व्यावसायिक सामंजस्य।' },
  '0-2': { en: 'Sun–Mars: Dynamic ambition, competitive success, physical vitality — but also injury, conflict, or aggression.',  hi: 'सूर्य–मंगल: गतिशील महत्वाकांक्षा, प्रतिस्पर्धात्मक सफलता — किन्तु चोट, विवाद की भी संभावना।' },
  '2-0': { en: 'Sun–Mars: Dynamic ambition, competitive success, physical vitality — but also injury, conflict, or aggression.',  hi: 'सूर्य–मंगल: गतिशील महत्वाकांक्षा, प्रतिस्पर्धात्मक सफलता — किन्तु चोट, विवाद की भी संभावना।' },
  '0-5': { en: 'Sun–Venus: Success in arts, creativity, government favor, romantic developments, social prestige.',              hi: 'सूर्य–शुक्र: कला में सफलता, रचनात्मकता, सरकारी कृपा, प्रेम संबंध, सामाजिक प्रतिष्ठा।' },
  '5-0': { en: 'Sun–Venus: Success in arts, creativity, government favor, romantic developments, social prestige.',              hi: 'सूर्य–शुक्र: कला में सफलता, रचनात्मकता, सरकारी कृपा, प्रेम संबंध, सामाजिक प्रतिष्ठा।' },
  '0-6': { en: 'Sun–Saturn: Challenges from authority, hard-won success after delays, disciplined effort rewarded late in year.', hi: 'सूर्य–शनि: सत्ता से चुनौती, विलंब के बाद कड़ी मेहनत से सफलता, अनुशासित प्रयास।' },
  '6-0': { en: 'Sun–Saturn: Challenges from authority, hard-won success after delays, disciplined effort rewarded late in year.', hi: 'सूर्य–शनि: सत्ता से चुनौती, विलंब के बाद कड़ी मेहनत से सफलता, अनुशासित प्रयास।' },
  '0-3': { en: 'Sun–Mercury: Intellectual recognition, administrative success, writing/publishing matters, communication with government.', hi: 'सूर्य–बुध: बौद्धिक मान्यता, प्रशासनिक सफलता, लेखन/प्रकाशन, सरकार से संवाद।' },
  '3-0': { en: 'Sun–Mercury: Intellectual recognition, administrative success, writing/publishing matters, communication with government.', hi: 'सूर्य–बुध: बौद्धिक मान्यता, प्रशासनिक सफलता, लेखन/प्रकाशन, सरकार से संवाद।' },
  // Moon combinations
  '1-4': { en: 'Moon–Jupiter: Emotional fulfillment, family expansion, financial gains through public, spiritual contentment.',   hi: 'चन्द्र–गुरु: भावनात्मक तृप्ति, परिवार विस्तार, सार्वजनिक लाभ, आध्यात्मिक संतोष।' },
  '4-1': { en: 'Moon–Jupiter: Emotional fulfillment, family expansion, financial gains through public, spiritual contentment.',   hi: 'चन्द्र–गुरु: भावनात्मक तृप्ति, परिवार विस्तार, सार्वजनिक लाभ, आध्यात्मिक संतोष।' },
  '1-5': { en: 'Moon–Venus: Romantic happiness, domestic beauty, artistic success, social pleasure, good food and hospitality.', hi: 'चन्द्र–शुक्र: रोमांटिक खुशी, घरेलू सुंदरता, कलात्मक सफलता, सामाजिक आनंद।' },
  '5-1': { en: 'Moon–Venus: Romantic happiness, domestic beauty, artistic success, social pleasure, good food and hospitality.', hi: 'चन्द्र–शुक्र: रोमांटिक खुशी, घरेलू सुंदरता, कलात्मक सफलता, सामाजिक आनंद।' },
  '1-6': { en: 'Moon–Saturn: Emotional discipline tested, separation possible, property dealings, service matters, endurance required.', hi: 'चन्द्र–शनि: भावनात्मक परीक्षण, विच्छेद संभव, संपत्ति व्यवहार, सेवा, धैर्य आवश्यक।' },
  '6-1': { en: 'Moon–Saturn: Emotional discipline tested, separation possible, property dealings, service matters, endurance required.', hi: 'चन्द्र–शनि: भावनात्मक परीक्षण, विच्छेद संभव, संपत्ति व्यवहार, सेवा, धैर्य आवश्यक।' },
  '1-2': { en: 'Moon–Mars: Emotional intensity, domestic conflicts or passion, quick financial decisions, health of mother, accidents possible.', hi: 'चन्द्र–मंगल: भावनात्मक तीव्रता, घरेलू संघर्ष या जुनून, त्वरित वित्तीय निर्णय।' },
  '2-1': { en: 'Moon–Mars: Emotional intensity, domestic conflicts or passion, quick financial decisions, health of mother, accidents possible.', hi: 'चन्द्र–मंगल: भावनात्मक तीव्रता, घरेलू संघर्ष या जुनून, त्वरित वित्तीय निर्णय।' },
  // Mars combinations
  '2-4': { en: 'Mars–Jupiter: Courageous expansion, legal matters resolved favorably, surgery/medical success, religious travel, property gains.', hi: 'मंगल–गुरु: साहसी विस्तार, कानूनी विजय, शल्य चिकित्सा सफलता, धार्मिक यात्रा।' },
  '4-2': { en: 'Mars–Jupiter: Courageous expansion, legal matters resolved favorably, surgery/medical success, religious travel, property gains.', hi: 'मंगल–गुरु: साहसी विस्तार, कानूनी विजय, शल्य चिकित्सा सफलता, धार्मिक यात्रा।' },
  '2-5': { en: 'Mars–Venus: Passionate creativity, romantic intensity, artistic or athletic achievement, property beautification, sensual excess possible.', hi: 'मंगल–शुक्र: भावुक रचनात्मकता, रोमांटिक तीव्रता, संपत्ति सौंदर्यीकरण।' },
  '5-2': { en: 'Mars–Venus: Passionate creativity, romantic intensity, artistic or athletic achievement, property beautification, sensual excess possible.', hi: 'मंगल–शुक्र: भावुक रचनात्मकता, रोमांटिक तीव्रता, संपत्ति सौंदर्यीकरण।' },
  '2-6': { en: 'Mars–Saturn: Iron discipline — either great engineering achievement or injury, accident, obstruction. Karmic tests of strength.', hi: 'मंगल–शनि: लौह अनुशासन — महान इंजीनियरिंग उपलब्धि या चोट, दुर्घटना, अवरोध।' },
  '6-2': { en: 'Mars–Saturn: Iron discipline — either great engineering achievement or injury, accident, obstruction. Karmic tests of strength.', hi: 'मंगल–शनि: लौह अनुशासन — महान इंजीनियरिंग उपलब्धि या चोट, दुर्घटना, अवरोध।' },
  // Mercury combinations
  '3-4': { en: 'Mercury–Jupiter: Exceptional learning and teaching year, publishing success, legal matters, philosophical study, financial wisdom.', hi: 'बुध–गुरु: असाधारण सीखने और पढ़ाने का वर्ष, प्रकाशन सफलता, कानूनी मामले।' },
  '4-3': { en: 'Mercury–Jupiter: Exceptional learning and teaching year, publishing success, legal matters, philosophical study, financial wisdom.', hi: 'बुध–गुरु: असाधारण सीखने और पढ़ाने का वर्ष, प्रकाशन सफलता, कानूनी मामले।' },
  '3-5': { en: 'Mercury–Venus: Creative writing, music, arts, business partnerships, social diplomacy, lucrative communication-based work.', hi: 'बुध–शुक्र: रचनात्मक लेखन, संगीत, कला, व्यापार साझेदारी, सामाजिक कूटनीति।' },
  '5-3': { en: 'Mercury–Venus: Creative writing, music, arts, business partnerships, social diplomacy, lucrative communication-based work.', hi: 'बुध–शुक्र: रचनात्मक लेखन, संगीत, कला, व्यापार साझेदारी, सामाजिक कूटनीति।' },
  '3-6': { en: 'Mercury–Saturn: Systematic analysis, legal documentation, disciplined research, delayed communication, structural work succeeds.', hi: 'बुध–शनि: व्यवस्थित विश्लेषण, कानूनी दस्तावेज़ीकरण, अनुशासित शोध, संरचनात्मक कार्य।' },
  '6-3': { en: 'Mercury–Saturn: Systematic analysis, legal documentation, disciplined research, delayed communication, structural work succeeds.', hi: 'बुध–शनि: व्यवस्थित विश्लेषण, कानूनी दस्तावेज़ीकरण, अनुशासित शोध, संरचनात्मक कार्य।' },
  // Jupiter combinations
  '4-5': { en: 'Jupiter–Venus: Prosperous year for marriage, arts, luxury, spiritual devotion, financial abundance and social grace.', hi: 'गुरु–शुक्र: विवाह, कला, विलासिता, आध्यात्मिक भक्ति के लिए समृद्ध वर्ष।' },
  '5-4': { en: 'Jupiter–Venus: Prosperous year for marriage, arts, luxury, spiritual devotion, financial abundance and social grace.', hi: 'गुरु–शुक्र: विवाह, कला, विलासिता, आध्यात्मिक भक्ति के लिए समृद्ध वर्ष।' },
  '4-6': { en: 'Jupiter–Saturn: Karmic turning point — hard work eventually yields lasting reward. Wisdom through restriction. Structural life changes.', hi: 'गुरु–शनि: कार्मिक転换点 — कठिन परिश्रम स्थायी पुरस्कार देता है। संरचनात्मक जीवन परिवर्तन।' },
  '6-4': { en: 'Jupiter–Saturn: Karmic turning point — hard work eventually yields lasting reward. Wisdom through restriction. Structural life changes.', hi: 'गुरु–शनि: कार्मिक転换点 — कठिन परिश्रम स्थायी पुरस्कार देता है। संरचनात्मक जीवन परिवर्तन।' },
  // Venus–Saturn
  '5-6': { en: 'Venus–Saturn: Dedication to art or partnership, delayed pleasures, disciplined beauty, long-term commitments solidify.', hi: 'शुक्र–शनि: कला या साझेदारी के प्रति समर्पण, विलंबित सुख, दीर्घकालिक प्रतिबद्धता।' },
  '6-5': { en: 'Venus–Saturn: Dedication to art or partnership, delayed pleasures, disciplined beauty, long-term commitments solidify.', hi: 'शुक्र–शनि: कला या साझेदारी के प्रति समर्पण, विलंबित सुख, दीर्घकालिक प्रतिबद्धता।' },
};

function getPairMeaning(id1: number, id2: number): { en: string; hi: string } | null {
  const key = `${Math.min(id1, id2)}-${Math.max(id1, id2)}`;
  return PLANET_PAIR_YEAR_MEANING[`${id1}-${id2}`] || PLANET_PAIR_YEAR_MEANING[`${id2}-${id1}`] || null;
}

// Tajika aspect angles
const TAJIKA_ASPECTS = [
  { angle: 0, name: 'conjunction', label: { en: 'Conjunction', hi: 'युति', sa: 'युतिः' } },
  { angle: 60, name: 'sextile', label: { en: 'Sextile', hi: 'षष्ठांश', sa: 'षष्ठांशः' } },
  { angle: 90, name: 'square', label: { en: 'Square', hi: 'चतुर्थांश', sa: 'चतुर्थांशः' } },
  { angle: 120, name: 'trine', label: { en: 'Trine', hi: 'त्रिकोण', sa: 'त्रिकोणः' } },
  { angle: 180, name: 'opposition', label: { en: 'Opposition', hi: 'सप्तम', sa: 'सप्तमः' } },
];

// Orbs: luminaries (Sun/Moon) get 12°, others get 8°
function getOrb(id1: number, id2: number): number {
  if (id1 <= 1 || id2 <= 1) return 12;
  return 8;
}

// Approximate daily motion (degrees/day) for speed comparison
const PLANET_SPEEDS: Record<number, number> = {
  0: 1.0,    // Sun
  1: 13.2,   // Moon
  2: 0.52,   // Mars
  3: 1.38,   // Mercury
  4: 0.083,  // Jupiter
  5: 1.2,    // Venus
  6: 0.034,  // Saturn
  7: 0.053,  // Rahu
  8: 0.053,  // Ketu
};

export function detectTajikaYogas(planets: PlanetPosition[]): TajikaYoga[] {
  const yogas: TajikaYoga[] = [];
  const mainPlanets = planets.filter(p => p.planet.id <= 6); // Sun through Saturn

  for (let i = 0; i < mainPlanets.length; i++) {
    for (let j = i + 1; j < mainPlanets.length; j++) {
      const p1 = mainPlanets[i];
      const p2 = mainPlanets[j];
      const diff = Math.abs(angleDiff(p1.longitude, p2.longitude));
      const orb = getOrb(p1.planet.id, p2.planet.id);

      for (const aspect of TAJIKA_ASPECTS) {
        const aspectDiff = Math.abs(diff - aspect.angle);
        if (aspectDiff <= orb) {
          // Determine faster planet (higher speed = faster)
          const speed1 = Math.abs(p1.speed || PLANET_SPEEDS[p1.planet.id] || 0);
          const speed2 = Math.abs(p2.speed || PLANET_SPEEDS[p2.planet.id] || 0);
          const faster = speed1 > speed2 ? p1 : p2;
          const slower = speed1 > speed2 ? p2 : p1;

          // Is the aspect applying (getting closer) or separating?
          const isApplying = isAspectApplying(faster, slower, aspect.angle);

          if (isApplying) {
            // ITHASALA — faster planet applies to slower
            const pairMeaning = getPairMeaning(faster.planet.id, slower.planet.id);
            const aspectQuality = aspect.angle === 120 || aspect.angle === 60 ? 'harmoniously' : aspect.angle === 90 || aspect.angle === 180 ? 'with tension' : 'powerfully';
            const ithasalaCore = {
              en: `${faster.planet.name.en} applies to ${slower.planet.name.en} by ${aspect.label.en} ${aspectQuality} — this year's matter will materialise. ${pairMeaning ? pairMeaning.en : ''}`,
              hi: `${faster.planet.name.hi} ${slower.planet.name.hi} से ${aspect.label.hi} बना रहा है — कार्य सिद्ध होगा। ${pairMeaning ? pairMeaning.hi : ''}`,
              sa: `${faster.planet.name.sa} ${slower.planet.name.sa} ${aspect.label.sa} योगं करोति — कार्यसिद्धिः।`,
            };
            yogas.push({
              name: { en: `Ithasala (${aspect.label.en})`, hi: `इत्थशाल (${aspect.label.hi})`, sa: `इत्थशालः (${aspect.label.sa})` },
              type: 'ithasala',
              planet1: faster.planet.name,
              planet2: slower.planet.name,
              favorable: aspect.angle !== 90 && aspect.angle !== 180,
              description: ithasalaCore,
            });
          } else {
            // ISHRAFA — separating aspect
            const pairMeaning = getPairMeaning(faster.planet.id, slower.planet.id);
            yogas.push({
              name: { en: `Ishrafa (${aspect.label.en})`, hi: `ईशराफ (${aspect.label.hi})`, sa: `ईशराफः (${aspect.label.sa})` },
              type: 'ishrafa',
              planet1: faster.planet.name,
              planet2: slower.planet.name,
              favorable: false,
              description: {
                en: `${faster.planet.name.en} separates from ${slower.planet.name.en} — the window for this matter has partially closed; results from its earlier activation may still arrive. ${pairMeaning ? pairMeaning.en : ''}`,
                hi: `${faster.planet.name.hi} ${slower.planet.name.hi} से विमुख हो रहा है — यह अवसर आंशिक रूप से बीत चुका है; पहले के प्रभाव से परिणाम अभी भी आ सकते हैं। ${pairMeaning ? pairMeaning.hi : ''}`,
                sa: `${faster.planet.name.sa} ${slower.planet.name.sa} विमुखः — अवसरः आंशिकतः अतीतः।`,
              },
            });
          }
          break; // Only one aspect per pair
        }
      }
    }
  }

  // Check for Nakta (a third planet transfers light)
  if (yogas.length >= 2) {
    const naktaYoga = detectNakta(mainPlanets, yogas);
    if (naktaYoga) yogas.push(naktaYoga);
  }

  // P2-04: Yamaya Yoga — two planets in exact opposition (Tajika) = contention, conflict
  detectYamaya(mainPlanets, yogas);
  // P2-04: Manaú Yoga — faster planet aspects slower, but slower is combust/debilitated = denied
  detectManau(mainPlanets, yogas);
  // P2-04: Khallasara — chain transfer through 3 planets
  detectKhallasara(mainPlanets, yogas);
  // P2-04: Dutthottha — recently separated but within 1° residual orb
  detectDutthottha(mainPlanets, yogas);

  return yogas;
}

function isAspectApplying(faster: PlanetPosition, slower: PlanetPosition, aspectAngle: number): boolean {
  const currentDiff = angleDiff(faster.longitude, slower.longitude);
  const futureFaster = faster.longitude + (faster.speed || PLANET_SPEEDS[faster.planet.id] || 0);
  const futureSlower = slower.longitude + (slower.speed || PLANET_SPEEDS[slower.planet.id] || 0);
  const futureDiff = angleDiff(futureFaster, futureSlower);

  return Math.abs(futureDiff - aspectAngle) < Math.abs(currentDiff - aspectAngle);
}

function angleDiff(a: number, b: number): number {
  let d = normalizeDeg(a - b);
  if (d > 180) d -= 360;
  return Math.abs(d);
}

function detectNakta(planets: PlanetPosition[], existingYogas: TajikaYoga[]): TajikaYoga | null {
  // Nakta: When planet A can't reach planet B, but planet C mediates
  // Simplified: if we have both Ishrafa and Ithasala involving a common planet
  const ishrafas = existingYogas.filter(y => y.type === 'ishrafa');
  const ithasalas = existingYogas.filter(y => y.type === 'ithasala');

  for (const ish of ishrafas) {
    for (const ith of ithasalas) {
      if (ish.planet2.en === ith.planet1.en || ish.planet1.en === ith.planet2.en) {
        const mediator = ish.planet2.en === ith.planet1.en ? ish.planet2 : ish.planet1;
        return {
          name: { en: 'Nakta Yoga', hi: 'नक्त योग', sa: 'नक्तयोगः' },
          type: 'nakta',
          planet1: ish.planet1,
          planet2: ith.planet2,
          favorable: true,
          description: {
            en: `${mediator.en} transfers light between planets — event happens through an intermediary.`,
            hi: `${mediator.hi} मध्यस्थता करता है — कार्य मध्यस्थ द्वारा होगा।`,
            sa: `${mediator.sa} ज्योतिसंक्रमणं करोति — कार्यं मध्यस्थेन भवति।`,
          },
        };
      }
    }
  }

  return null;
}

// P2-04: Yamaya Yoga — two planets in exact opposition with tight orb ≤ 3°
function detectYamaya(planets: PlanetPosition[], yogas: TajikaYoga[]): void {
  const mainPlanets = planets.filter(p => p.planet.id <= 6);
  for (let i = 0; i < mainPlanets.length; i++) {
    for (let j = i + 1; j < mainPlanets.length; j++) {
      const p1 = mainPlanets[i];
      const p2 = mainPlanets[j];
      const diff = Math.abs(angleDiff(p1.longitude, p2.longitude));
      if (Math.abs(diff - 180) <= 3) {
        yogas.push({
          name: { en: 'Yamaya Yoga', hi: 'यमाय योग', sa: 'यमाययोगः' },
          type: 'yamaya',
          planet1: p1.planet.name,
          planet2: p2.planet.name,
          favorable: false,
          description: {
            en: `${p1.planet.name.en} and ${p2.planet.name.en} in tight opposition — contention, conflict, and delays are indicated.`,
            hi: `${p1.planet.name.hi} और ${p2.planet.name.hi} सप्तम कोण में — विवाद, संघर्ष और विलंब की संभावना।`,
            sa: `${p1.planet.name.sa} ${p2.planet.name.sa} च सप्तमे — विवादः संघर्षः विलम्बश्च।`,
          },
        });
      }
    }
  }
}

// P2-04: Manaú Yoga — Ithasala exists but slower planet is combust or debilitated → denied
function detectManau(planets: PlanetPosition[], yogas: TajikaYoga[]): void {
  const COMBUST_ORB: Record<number, number> = { 1: 12, 2: 17, 3: 14, 4: 11, 5: 10, 6: 15 };
  const DEBIL_SIGN: Record<number, number> = { 0: 7, 1: 8, 2: 4, 3: 6, 4: 10, 5: 6, 6: 1 };

  const ithasalas = yogas.filter(y => y.type === 'ithasala');
  for (const ith of ithasalas) {
    // Find the slower planet (planet2 in ithasala)
    const slowerP = planets.find(p => p.planet.name.en === ith.planet2.en);
    if (!slowerP) continue;
    const id = slowerP.planet.id;
    if (id === 0) continue; // Sun can't be combust

    // Check combustion
    const sunP = planets.find(p => p.planet.id === 0);
    const combOrb = COMBUST_ORB[id];
    const isCombust = sunP && combOrb !== undefined
      ? Math.abs(angleDiff(slowerP.longitude, sunP.longitude)) <= combOrb
      : false;

    // Check debilitation
    const isDebilitated = DEBIL_SIGN[id] !== undefined && slowerP.sign === DEBIL_SIGN[id];

    if (isCombust || isDebilitated) {
      const reason = isCombust ? 'combust' : 'debilitated';
      const reasonHi = isCombust ? 'अस्त' : 'नीच';
      const reasonSa = isCombust ? 'अस्तः' : 'नीचस्थः';
      yogas.push({
        name: { en: 'Manaú Yoga', hi: 'मनाउ योग', sa: 'मनाउयोगः' },
        type: 'manau',
        planet1: ith.planet1,
        planet2: ith.planet2,
        favorable: false,
        description: {
          en: `${ith.planet1.en} applies to ${ith.planet2.en} but ${ith.planet2.en} is ${reason} — promise is denied or greatly reduced.`,
          hi: `${ith.planet1.hi} ${ith.planet2.hi} से इत्थशाल बना रहा है किन्तु ${ith.planet2.hi} ${reasonHi} है — कार्यसिद्धि नहीं होगी।`,
          sa: `${ith.planet1.sa} ${ith.planet2.sa} इत्थशालं करोति परन्तु ${ith.planet2.sa} ${reasonSa} — कार्यसिद्धिर्नास्ति।`,
        },
      });
    }
  }
}

// P2-04: Khallasara — chain: A applies to B (Ithasala), B applies to C (Ithasala)
function detectKhallasara(planets: PlanetPosition[], yogas: TajikaYoga[]): void {
  const ithasalas = yogas.filter(y => y.type === 'ithasala');
  for (const ith1 of ithasalas) {
    for (const ith2 of ithasalas) {
      if (ith1 === ith2) continue;
      // Chain: ith1.planet2 === ith2.planet1 → A→B→C
      if (ith1.planet2.en === ith2.planet1.en) {
        const A = ith1.planet1;
        const B = ith1.planet2;
        const C = ith2.planet2;
        // Avoid duplicates (same A-B-C triple)
        const already = yogas.some(y => y.type === 'khallasara' && y.planet1.en === A.en && y.planet2.en === C.en);
        if (already) continue;
        yogas.push({
          name: { en: 'Khallasara Yoga', hi: 'खल्लसार योग', sa: 'खल्लसारयोगः' },
          type: 'khallasara',
          planet1: A,
          planet2: C,
          favorable: true,
          description: {
            en: `${A.en} → ${B.en} → ${C.en}: light transfers through a chain — results come through a sequence of events.`,
            hi: `${A.hi} → ${B.hi} → ${C.hi}: श्रृंखला से प्रकाश स्थानांतरण — क्रमशः परिणाम मिलेगा।`,
            sa: `${A.sa} → ${B.sa} → ${C.sa}: श्रृंखलया ज्योतिसंक्रमणम् — क्रमेण कार्यसिद्धिः।`,
          },
        });
      }
    }
  }
}

// P2-04: Dutthottha — separated but within 1° residual orb (potential residual results)
function detectDutthottha(planets: PlanetPosition[], yogas: TajikaYoga[]): void {
  const mainPlanets = planets.filter(p => p.planet.id <= 6);
  for (let i = 0; i < mainPlanets.length; i++) {
    for (let j = i + 1; j < mainPlanets.length; j++) {
      const p1 = mainPlanets[i];
      const p2 = mainPlanets[j];
      const diff = Math.abs(angleDiff(p1.longitude, p2.longitude));

      for (const aspect of [0, 60, 90, 120, 180]) {
        const residual = Math.abs(diff - aspect);
        if (residual > 0 && residual <= 1) {
          // Confirm it's separating (not applying — those are Ithasala/Ishrafa)
          const speed1 = Math.abs(p1.speed || PLANET_SPEEDS[p1.planet.id] || 0);
          const speed2 = Math.abs(p2.speed || PLANET_SPEEDS[p2.planet.id] || 0);
          const faster = speed1 > speed2 ? p1 : p2;
          const slower = speed1 > speed2 ? p2 : p1;
          const applying = isAspectApplying(faster, slower, aspect);
          if (applying) continue; // applying = Ithasala, skip

          const alreadyIshrafa = yogas.some(
            y => y.type === 'ishrafa' && ((y.planet1.en === p1.planet.name.en && y.planet2.en === p2.planet.name.en) || (y.planet1.en === p2.planet.name.en && y.planet2.en === p1.planet.name.en))
          );
          if (alreadyIshrafa) continue;

          yogas.push({
            name: { en: 'Dutthottha Yoga', hi: 'दुत्थोत्थ योग', sa: 'दुत्थोत्थयोगः' },
            type: 'dutthottha',
            planet1: p1.planet.name,
            planet2: p2.planet.name,
            favorable: true,
            description: {
              en: `${p1.planet.name.en} and ${p2.planet.name.en} just separated (within 1°) — residual effects of the aspect still carry results.`,
              hi: `${p1.planet.name.hi} और ${p2.planet.name.hi} अभी-अभी अलग हुए (1° के भीतर) — योग का अवशेष प्रभाव बना रहेगा।`,
              sa: `${p1.planet.name.sa} ${p2.planet.name.sa} च अद्यतनं विभक्तौ (1° अन्तर्गतम्) — योगशेषफलं भवति।`,
            },
          });
          break;
        }
      }
    }
  }
}
