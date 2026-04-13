import type { LocaleText } from '@/types/panchang';
import type { ConvergenceInput, TransitInsight, AshtakHighlight } from './types';
import { isMalefic } from '@/lib/tippanni/utils';

// House effect descriptions for transit planets
const TRANSIT_HOUSE_EFFECTS: Record<number, LocaleText> = {
  1: { en: 'Transiting your 1st house — affects health, self-image, and personal energy.', hi: 'प्रथम भाव में गोचर — स्वास्थ्य, आत्म-छवि और व्यक्तिगत ऊर्जा प्रभावित।', sa: 'प्रथम भाव में गोचर — स्वास्थ्य, आत्म-छवि और व्यक्तिगत ऊर्जा प्रभावित।', mai: 'प्रथम भाव में गोचर — स्वास्थ्य, आत्म-छवि और व्यक्तिगत ऊर्जा प्रभावित।', mr: 'प्रथम भाव में गोचर — स्वास्थ्य, आत्म-छवि और व्यक्तिगत ऊर्जा प्रभावित।', ta: 'Transiting your 1st house — affects health, self-image, and personal energy.', te: 'Transiting your 1st house — affects health, self-image, and personal energy.', bn: 'Transiting your 1st house — affects health, self-image, and personal energy.', kn: 'Transiting your 1st house — affects health, self-image, and personal energy.', gu: 'Transiting your 1st house — affects health, self-image, and personal energy.' },
  2: { en: 'Transiting your 2nd house — affects finances, family, and speech.', hi: 'द्वितीय भाव में — वित्त, परिवार और वाणी प्रभावित।', sa: 'द्वितीय भाव में — वित्त, परिवार और वाणी प्रभावित।', mai: 'द्वितीय भाव में — वित्त, परिवार और वाणी प्रभावित।', mr: 'द्वितीय भाव में — वित्त, परिवार और वाणी प्रभावित।', ta: 'Transiting your 2nd house — affects finances, family, and speech.', te: 'Transiting your 2nd house — affects finances, family, and speech.', bn: 'Transiting your 2nd house — affects finances, family, and speech.', kn: 'Transiting your 2nd house — affects finances, family, and speech.', gu: 'Transiting your 2nd house — affects finances, family, and speech.' },
  3: { en: 'Transiting your 3rd house — affects courage, siblings, and communication.', hi: 'तृतीय भाव में — साहस, भाई-बहन और संवाद प्रभावित।', sa: 'तृतीय भाव में — साहस, भाई-बहन और संवाद प्रभावित।', mai: 'तृतीय भाव में — साहस, भाई-बहन और संवाद प्रभावित।', mr: 'तृतीय भाव में — साहस, भाई-बहन और संवाद प्रभावित।', ta: 'Transiting your 3rd house — affects courage, siblings, and communication.', te: 'Transiting your 3rd house — affects courage, siblings, and communication.', bn: 'Transiting your 3rd house — affects courage, siblings, and communication.', kn: 'Transiting your 3rd house — affects courage, siblings, and communication.', gu: 'Transiting your 3rd house — affects courage, siblings, and communication.' },
  4: { en: 'Transiting your 4th house — affects home, mother, and emotional peace.', hi: 'चतुर्थ भाव में — घर, माता और मानसिक शांति प्रभावित।', sa: 'चतुर्थ भाव में — घर, माता और मानसिक शांति प्रभावित।', mai: 'चतुर्थ भाव में — घर, माता और मानसिक शांति प्रभावित।', mr: 'चतुर्थ भाव में — घर, माता और मानसिक शांति प्रभावित।', ta: 'Transiting your 4th house — affects home, mother, and emotional peace.', te: 'Transiting your 4th house — affects home, mother, and emotional peace.', bn: 'Transiting your 4th house — affects home, mother, and emotional peace.', kn: 'Transiting your 4th house — affects home, mother, and emotional peace.', gu: 'Transiting your 4th house — affects home, mother, and emotional peace.' },
  5: { en: 'Transiting your 5th house — affects children, romance, and creativity.', hi: 'पंचम भाव में — संतान, प्रेम और सृजनशीलता प्रभावित।', sa: 'पंचम भाव में — संतान, प्रेम और सृजनशीलता प्रभावित।', mai: 'पंचम भाव में — संतान, प्रेम और सृजनशीलता प्रभावित।', mr: 'पंचम भाव में — संतान, प्रेम और सृजनशीलता प्रभावित।', ta: 'Transiting your 5th house — affects children, romance, and creativity.', te: 'Transiting your 5th house — affects children, romance, and creativity.', bn: 'Transiting your 5th house — affects children, romance, and creativity.', kn: 'Transiting your 5th house — affects children, romance, and creativity.', gu: 'Transiting your 5th house — affects children, romance, and creativity.' },
  6: { en: 'Transiting your 6th house — affects health, enemies, and debts.', hi: 'षष्ठ भाव में — स्वास्थ्य, शत्रु और ऋण प्रभावित।', sa: 'षष्ठ भाव में — स्वास्थ्य, शत्रु और ऋण प्रभावित।', mai: 'षष्ठ भाव में — स्वास्थ्य, शत्रु और ऋण प्रभावित।', mr: 'षष्ठ भाव में — स्वास्थ्य, शत्रु और ऋण प्रभावित।', ta: 'Transiting your 6th house — affects health, enemies, and debts.', te: 'Transiting your 6th house — affects health, enemies, and debts.', bn: 'Transiting your 6th house — affects health, enemies, and debts.', kn: 'Transiting your 6th house — affects health, enemies, and debts.', gu: 'Transiting your 6th house — affects health, enemies, and debts.' },
  7: { en: 'Transiting your 7th house — affects marriage, partnerships, and contracts.', hi: 'सप्तम भाव में — विवाह, साझेदारी और अनुबंध प्रभावित।', sa: 'सप्तम भाव में — विवाह, साझेदारी और अनुबंध प्रभावित।', mai: 'सप्तम भाव में — विवाह, साझेदारी और अनुबंध प्रभावित।', mr: 'सप्तम भाव में — विवाह, साझेदारी और अनुबंध प्रभावित।', ta: 'Transiting your 7th house — affects marriage, partnerships, and contracts.', te: 'Transiting your 7th house — affects marriage, partnerships, and contracts.', bn: 'Transiting your 7th house — affects marriage, partnerships, and contracts.', kn: 'Transiting your 7th house — affects marriage, partnerships, and contracts.', gu: 'Transiting your 7th house — affects marriage, partnerships, and contracts.' },
  8: { en: 'Transiting your 8th house — affects longevity, hidden matters, and transformation.', hi: 'अष्टम भाव में — दीर्घायु, गुप्त मामले और परिवर्तन प्रभावित।', sa: 'अष्टम भाव में — दीर्घायु, गुप्त मामले और परिवर्तन प्रभावित।', mai: 'अष्टम भाव में — दीर्घायु, गुप्त मामले और परिवर्तन प्रभावित।', mr: 'अष्टम भाव में — दीर्घायु, गुप्त मामले और परिवर्तन प्रभावित।', ta: 'Transiting your 8th house — affects longevity, hidden matters, and transformation.', te: 'Transiting your 8th house — affects longevity, hidden matters, and transformation.', bn: 'Transiting your 8th house — affects longevity, hidden matters, and transformation.', kn: 'Transiting your 8th house — affects longevity, hidden matters, and transformation.', gu: 'Transiting your 8th house — affects longevity, hidden matters, and transformation.' },
  9: { en: 'Transiting your 9th house — affects luck, father, and higher learning.', hi: 'नवम भाव में — भाग्य, पिता और उच्च शिक्षा प्रभावित।', sa: 'नवम भाव में — भाग्य, पिता और उच्च शिक्षा प्रभावित।', mai: 'नवम भाव में — भाग्य, पिता और उच्च शिक्षा प्रभावित।', mr: 'नवम भाव में — भाग्य, पिता और उच्च शिक्षा प्रभावित।', ta: 'Transiting your 9th house — affects luck, father, and higher learning.', te: 'Transiting your 9th house — affects luck, father, and higher learning.', bn: 'Transiting your 9th house — affects luck, father, and higher learning.', kn: 'Transiting your 9th house — affects luck, father, and higher learning.', gu: 'Transiting your 9th house — affects luck, father, and higher learning.' },
  10: { en: 'Transiting your 10th house — affects career, reputation, and authority.', hi: 'दशम भाव में — करियर, प्रतिष्ठा और अधिकार प्रभावित।', sa: 'दशम भाव में — करियर, प्रतिष्ठा और अधिकार प्रभावित।', mai: 'दशम भाव में — करियर, प्रतिष्ठा और अधिकार प्रभावित।', mr: 'दशम भाव में — करियर, प्रतिष्ठा और अधिकार प्रभावित।', ta: 'Transiting your 10th house — affects career, reputation, and authority.', te: 'Transiting your 10th house — affects career, reputation, and authority.', bn: 'Transiting your 10th house — affects career, reputation, and authority.', kn: 'Transiting your 10th house — affects career, reputation, and authority.', gu: 'Transiting your 10th house — affects career, reputation, and authority.' },
  11: { en: 'Transiting your 11th house — affects gains, friends, and aspirations.', hi: 'एकादश भाव में — लाभ, मित्र और आकांक्षाएँ प्रभावित।', sa: 'एकादश भाव में — लाभ, मित्र और आकांक्षाएँ प्रभावित।', mai: 'एकादश भाव में — लाभ, मित्र और आकांक्षाएँ प्रभावित।', mr: 'एकादश भाव में — लाभ, मित्र और आकांक्षाएँ प्रभावित।', ta: 'Transiting your 11th house — affects gains, friends, and aspirations.', te: 'Transiting your 11th house — affects gains, friends, and aspirations.', bn: 'Transiting your 11th house — affects gains, friends, and aspirations.', kn: 'Transiting your 11th house — affects gains, friends, and aspirations.', gu: 'Transiting your 11th house — affects gains, friends, and aspirations.' },
  12: { en: 'Transiting your 12th house — affects expenses, sleep, and foreign connections.', hi: 'द्वादश भाव में — व्यय, नींद और विदेशी संपर्क प्रभावित।', sa: 'द्वादश भाव में — व्यय, नींद और विदेशी संपर्क प्रभावित।', mai: 'द्वादश भाव में — व्यय, नींद और विदेशी संपर्क प्रभावित।', mr: 'द्वादश भाव में — व्यय, नींद और विदेशी संपर्क प्रभावित।', ta: 'Transiting your 12th house — affects expenses, sleep, and foreign connections.', te: 'Transiting your 12th house — affects expenses, sleep, and foreign connections.', bn: 'Transiting your 12th house — affects expenses, sleep, and foreign connections.', kn: 'Transiting your 12th house — affects expenses, sleep, and foreign connections.', gu: 'Transiting your 12th house — affects expenses, sleep, and foreign connections.' },
};

const PLANET_NAMES_EN = ['Sun', 'Moon', 'Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn', 'Rahu', 'Ketu'];
const PLANET_NAMES_HI = ['सूर्य', 'चन्द्रमा', 'मंगल', 'बुध', 'बृहस्पति', 'शुक्र', 'शनि', 'राहु', 'केतु'];

/**
 * Compute the transit overlay — current planetary transit snapshot personalized to Moon sign.
 * Only includes slow-moving planets (Mars through Ketu) — Sun and Moon change too fast for daily caching.
 */
export function computeTransitOverlay(input: ConvergenceInput): {
  snapshot: TransitInsight[];
  retroStatus: { planetId: number; effect: LocaleText }[];
  combustStatus: { planetId: number; effect: LocaleText }[];
  ashtakavargaHighlights: AshtakHighlight[];
} {
  const snapshot: TransitInsight[] = [];
  const retroStatus: { planetId: number; effect: LocaleText }[] = [];
  const combustStatus: { planetId: number; effect: LocaleText }[] = [];
  const ashtakavargaHighlights: AshtakHighlight[] = [];

  // Only slow planets: Mars(2), Mercury(3), Jupiter(4), Venus(5), Saturn(6), Rahu(7), Ketu(8)
  const slowPlanets = input.transits.filter(t => t.planetId >= 2 && t.planetId <= 8);

  for (const transit of slowPlanets) {
    const houseFromMoon = input.relationships.transitHouses[transit.planetId];
    if (!houseFromMoon) continue;

    const bindus = input.ashtakavargaSAV[transit.sign - 1] ?? 28;
    const houseEffect = TRANSIT_HOUSE_EFFECTS[houseFromMoon];
    if (!houseEffect) continue;

    snapshot.push({
      planetId: transit.planetId,
      transitSign: transit.sign,
      houseFromMoon,
      isRetrograde: transit.isRetrograde,
      ashtakavargaBindus: bindus,
      effect: houseEffect,
    });

    // Retrograde status
    if (transit.isRetrograde) {
      const name_en = PLANET_NAMES_EN[transit.planetId] || `Planet ${transit.planetId}`;
      const name_hi = PLANET_NAMES_HI[transit.planetId] || `ग्रह ${transit.planetId}`;
      retroStatus.push({
        planetId: transit.planetId,
        effect: {
          en: `${name_en} is retrograde — its significations turn inward. Effects are felt more psychologically than externally.`,
          hi: `${name_hi} वक्री — प्रभाव बाहरी से अधिक मनोवैज्ञानिक।`,
        },
      });
    }

    // Combustion (only natal planets, check from input.planets)
    const natalPlanet = input.planets.find(p => p.id === transit.planetId);
    if (natalPlanet?.isCombust) {
      const name_en = PLANET_NAMES_EN[transit.planetId] || `Planet ${transit.planetId}`;
      const name_hi = PLANET_NAMES_HI[transit.planetId] || `ग्रह ${transit.planetId}`;
      combustStatus.push({
        planetId: transit.planetId,
        effect: {
          en: `${name_en} is combust — too close to the Sun, its independent strength is diminished.`,
          hi: `${name_hi} अस्त — सूर्य के बहुत निकट, स्वतंत्र शक्ति क्षीण।`,
        },
      });
    }

    // Ashtakavarga highlights (strong or weak transits)
    if (bindus >= 30) {
      const name_en = PLANET_NAMES_EN[transit.planetId];
      const name_hi = PLANET_NAMES_HI[transit.planetId];
      ashtakavargaHighlights.push({
        planetId: transit.planetId,
        sign: transit.sign,
        bindus,
        text: {
          en: `${name_en} transits with strong Ashtakavarga support (${bindus} bindus) — pronounced effects in your ${houseFromMoon}${['st','nd','rd'][houseFromMoon-1]||'th'} house.`,
          hi: `${name_hi} गोचर मजबूत अष्टकवर्ग (${bindus} बिन्दु) के साथ — ${houseFromMoon}वें भाव में प्रबल प्रभाव।`,
        },
      });
    } else if (bindus <= 22) {
      const name_en = PLANET_NAMES_EN[transit.planetId];
      const name_hi = PLANET_NAMES_HI[transit.planetId];
      ashtakavargaHighlights.push({
        planetId: transit.planetId,
        sign: transit.sign,
        bindus,
        text: {
          en: `${name_en} transits with weak Ashtakavarga support (${bindus} bindus) — muted effects in your ${houseFromMoon}${['st','nd','rd'][houseFromMoon-1]||'th'} house.`,
          hi: `${name_hi} गोचर कमजोर अष्टकवर्ग (${bindus} बिन्दु) — ${houseFromMoon}वें भाव में मंद प्रभाव।`,
        },
      });
    }
  }

  return { snapshot, retroStatus, combustStatus, ashtakavargaHighlights };
}
