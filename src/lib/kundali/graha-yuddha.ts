import type { LocaleText } from '@/types/panchang';
// graha-yuddha.ts — Planetary War (Graha Yuddha) Analysis
// Source: BPHS Ch. 3, Brihat Jataka
// Two planets within 1° of each other engage in war.
// Winner: higher ecliptic latitude (closer to ecliptic). Loser loses ~25% Shadbala.
// Only applies to Mars, Mercury, Jupiter, Venus, Saturn (not Sun/Moon/nodes).

export interface GrahaYuddhaResult {
  planet1Id: number;
  planet1Name: LocaleText;
  planet2Id: number;
  planet2Name: LocaleText;
  separation: number;          // degrees
  winnerId: number;
  winnerName: LocaleText;
  loserId: number;
  loserName: LocaleText;
  interpretation: LocaleText;
}

const PLANET_NAMES: LocaleText[] = [
  { en: 'Sun',     hi: 'सूर्य',      sa: 'सूर्यः'      },
  { en: 'Moon',    hi: 'चन्द्र',     sa: 'चन्द्रः'     },
  { en: 'Mars',    hi: 'मंगल',       sa: 'मङ्गलः'      },
  { en: 'Mercury', hi: 'बुध',        sa: 'बुधः'        },
  { en: 'Jupiter', hi: 'बृहस्पति',   sa: 'बृहस्पतिः'   },
  { en: 'Venus',   hi: 'शुक्र',      sa: 'शुक्रः'      },
  { en: 'Saturn',  hi: 'शनि',        sa: 'शनिः'        },
];

// Domain themes for each planet (what they govern)
const PLANET_DOMAINS: Record<number, LocaleText> = {
  2: { en: 'energy, courage, and physical vitality', hi: 'ऊर्जा, साहस और शारीरिक शक्ति', sa: 'ऊर्जा, साहस और शारीरिक शक्ति', mai: 'ऊर्जा, साहस और शारीरिक शक्ति', mr: 'ऊर्जा, साहस और शारीरिक शक्ति', ta: 'ஆற்றல், தைரியம் மற்றும் உடல் வலிமை', te: 'శక్తి, ధైర్యం మరియు శారీరక బలం', bn: 'শক্তি, সাহস এবং শারীরিক প্রাণশক্তি', kn: 'ಶಕ್ತಿ, ಧೈರ್ಯ ಮತ್ತು ದೈಹಿಕ ಚೈತನ್ಯ', gu: 'ઊર્જા, સાહસ અને શારીરિક શક્તિ' },
  3: { en: 'intellect, communication, and business acumen', hi: 'बुद्धि, संचार और व्यापार कुशलता', sa: 'बुद्धि, संचार और व्यापार कुशलता', mai: 'बुद्धि, संचार और व्यापार कुशलता', mr: 'बुद्धि, संचार और व्यापार कुशलता', ta: 'அறிவுத்திறன், தகவல் தொடர்பு மற்றும் வணிக நுண்ணறிவு', te: 'బుద్ధి, సంభాషణ మరియు వ్యాపార నైపుణ్యం', bn: 'বুদ্ধি, যোগাযোগ এবং ব্যবসায়িক দক্ষতা', kn: 'ಬುದ್ಧಿ, ಸಂವಹನ ಮತ್ತು ವ್ಯಾಪಾರ ಕುಶಲತೆ', gu: 'બુદ્ધિ, સંવાદ અને વ્યાપાર કુશળતા' },
  4: { en: 'wisdom, higher learning, and spiritual guidance', hi: 'ज्ञान, उच्च शिक्षा और आध्यात्मिक मार्गदर्शन', sa: 'ज्ञान, उच्च शिक्षा और आध्यात्मिक मार्गदर्शन', mai: 'ज्ञान, उच्च शिक्षा और आध्यात्मिक मार्गदर्शन', mr: 'ज्ञान, उच्च शिक्षा और आध्यात्मिक मार्गदर्शन', ta: 'ஞானம், உயர்கல்வி மற்றும் ஆன்மிக வழிகாட்டுதல்', te: 'జ్ఞానం, ఉన్నత విద్య మరియు ఆధ్యాత్మిక మార్గదర్శకత్వం', bn: 'জ্ঞান, উচ্চশিক্ষা এবং আধ্যাত্মিক পথনির্দেশ', kn: 'ಜ್ಞಾನ, ಉನ್ನತ ಶಿಕ್ಷಣ ಮತ್ತು ಆಧ್ಯಾತ್ಮಿಕ ಮಾರ್ಗದರ್ಶನ', gu: 'જ્ઞાન, ઉચ્ચ શિક્ષણ અને આધ્યાત્મિક માર્ગદર્શન' },
  5: { en: 'love, luxury, creativity, and relationships', hi: 'प्रेम, विलासिता, रचनात्मकता और संबंध', sa: 'प्रेम, विलासिता, रचनात्मकता और संबंध', mai: 'प्रेम, विलासिता, रचनात्मकता और संबंध', mr: 'प्रेम, विलासिता, रचनात्मकता और संबंध', ta: 'காதல், ஆடம்பரம், படைப்பாற்றல் மற்றும் உறவுகள்', te: 'ప్రేమ, విలాసం, సృజనాత్మకత మరియు సంబంధాలు', bn: 'প্রেম, বিলাসিতা, সৃজনশীলতা এবং সম্পর্ক', kn: 'ಪ್ರೇಮ, ವೈಭವ, ಸೃಜನಶೀಲತೆ ಮತ್ತು ಸಂಬಂಧಗಳು', gu: 'પ્રેમ, વૈભવ, સર્જનાત્મકતા અને સંબંધો' },
  6: { en: 'discipline, karma, patience, and perseverance', hi: 'अनुशासन, कर्म, धैर्य और दृढ़ता', sa: 'अनुशासन, कर्म, धैर्य और दृढ़ता', mai: 'अनुशासन, कर्म, धैर्य और दृढ़ता', mr: 'अनुशासन, कर्म, धैर्य और दृढ़ता', ta: 'ஒழுக்கம், கர்மா, பொறுமை மற்றும் விடாமுயற்சி', te: 'క్రమశిక్షణ, కర్మ, ఓర్పు మరియు పట్టుదల', bn: 'শৃঙ্খলা, কর্ম, ধৈর্য এবং অধ্যবসায়', kn: 'ಶಿಸ್ತು, ಕರ್ಮ, ತಾಳ್ಮೆ ಮತ್ತು ಛಲ', gu: 'શિસ્ત, કર્મ, ધીરજ અને દ્રઢતા' },
};

// Planets eligible for war (not Sun, Moon, Rahu, Ketu)
const WAR_PLANETS = new Set([2, 3, 4, 5, 6]);

interface PlanetInput {
  id: number;
  longitude: number;
  latitude: number; // ecliptic latitude — determines winner
}

export function detectGrahaYuddha(planets: PlanetInput[]): GrahaYuddhaResult[] {
  const results: GrahaYuddhaResult[] = [];
  const eligible = planets.filter(p => WAR_PLANETS.has(p.id));

  for (let i = 0; i < eligible.length; i++) {
    for (let j = i + 1; j < eligible.length; j++) {
      const p1 = eligible[i];
      const p2 = eligible[j];

      // Angular separation in longitude
      let sep = Math.abs(p1.longitude - p2.longitude);
      if (sep > 180) sep = 360 - sep;

      if (sep > 1) continue; // Only war if within 1°

      // Winner: planet with greater northern latitude wins (BPHS Ch.3, Sl.18-19;
      // Surya Siddhanta). Higher positive latitude = more northward = victor.
      const winner = p1.latitude >= p2.latitude ? p1 : p2;
      const loser  = winner === p1 ? p2 : p1;

      const winnerName = PLANET_NAMES[winner.id];
      const loserName  = PLANET_NAMES[loser.id];
      const winnerDomain = PLANET_DOMAINS[winner.id];
      const loserDomain  = PLANET_DOMAINS[loser.id];

      results.push({
        planet1Id:   p1.id,
        planet1Name: PLANET_NAMES[p1.id],
        planet2Id:   p2.id,
        planet2Name: PLANET_NAMES[p2.id],
        separation:  Math.round(sep * 60) / 60, // round to arcminutes
        winnerId:    winner.id,
        winnerName,
        loserId:     loser.id,
        loserName,
        interpretation: {
          en: `${winnerName.en} and ${loserName.en} are in Planetary War (${sep.toFixed(2)}° apart). ${winnerName.en} wins (higher ecliptic latitude) — its themes of ${winnerDomain?.en} are amplified. ${loserName.en} loses — its themes of ${loserDomain?.en} are compromised. The loser's Shadbala is reduced by ~25%, weakening its significations during its dasha periods.`,
          hi: `${winnerName.hi} और ${loserName.hi} ग्रह युद्ध में हैं (${sep.toFixed(2)}° अंतर)। ${winnerName.hi} विजयी — इसके ${winnerDomain?.hi} के विषय प्रबल होते हैं। ${loserName.hi} पराजित — इसके ${loserDomain?.hi} के विषय कमजोर पड़ते हैं।`,
          sa: `${winnerName.sa} ${loserName.sa}च ग्रहयुद्धे स्तः। ${winnerName.sa} विजयी, ${loserName.sa} पराजितः।`,
        },
      });
    }
  }

  return results;
}
