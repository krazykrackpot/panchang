/**
 * Domain Remedy Selection
 *
 * Selects and prioritises Vedic remedies for weak domain planets.
 * Each planet has three remedy types: gemstone, mantra, and practice (charity/ritual).
 *
 * Planet IDs: 0=Sun, 1=Moon, 2=Mars, 3=Mercury, 4=Jupiter,
 *             5=Venus, 6=Saturn, 7=Rahu, 8=Ketu
 */

import type { DomainRemedy } from './types';
import type { DomainConfig } from './types';

// ---------------------------------------------------------------------------
// Input type
// ---------------------------------------------------------------------------

export interface RemedyInput {
  domainConfig: DomainConfig;
  weakPlanets: {
    planetId: number;
    isDebilitated: boolean;
    isLordOfDomainHouse: boolean;
    shadbalaRupa: number;
  }[];
}

// ---------------------------------------------------------------------------
// Internal remedy entry
// ---------------------------------------------------------------------------

interface PlanetRemedyEntry {
  gemstone: {
    name: { en: string; hi: string };
    instructions: { en: string; hi: string };
  };
  mantra: {
    name: { en: string; hi: string };
    instructions: { en: string; hi: string };
  };
  practice: {
    name: { en: string; hi: string };
    instructions: { en: string; hi: string };
  };
}

// ---------------------------------------------------------------------------
// Remedy database
// ---------------------------------------------------------------------------

const PLANET_REMEDIES: Record<number, PlanetRemedyEntry> = {
  // Sun
  0: {
    gemstone: {
      name: {
        en: 'Ruby (Manik)',
        hi: 'माणिक (Ruby)',
      },
      instructions: {
        en: 'Wear a natural Ruby of at least 3 carats set in gold on the ring finger of the right hand on a Sunday morning after sunrise.',
        hi: 'रविवार की सुबह सूर्योदय के बाद सोने में जड़ा कम से कम 3 रत्ती का प्राकृतिक माणिक दाहिने हाथ की अनामिका में पहनें।',
      },
    },
    mantra: {
      name: {
        en: 'Om Suryaya Namah',
        hi: 'ॐ सूर्याय नमः',
      },
      instructions: {
        en: 'Chant "Om Suryaya Namah" 108 times daily at sunrise, preferably facing east.',
        hi: 'प्रतिदिन सूर्योदय के समय पूर्व दिशा की ओर मुख करके "ॐ सूर्याय नमः" का 108 बार जाप करें।',
      },
    },
    practice: {
      name: {
        en: 'Sun Salutation Offering',
        hi: 'सूर्य अर्घ्य',
      },
      instructions: {
        en: 'Offer water to the rising Sun every morning using a copper vessel, reciting the Gayatri Mantra.',
        hi: 'प्रतिदिन सुबह ताँबे के पात्र से उगते सूर्य को गायत्री मंत्र का पाठ करते हुए अर्घ्य दें।',
      },
    },
  },

  // Moon
  1: {
    gemstone: {
      name: {
        en: 'Pearl (Moti)',
        hi: 'मोती (Pearl)',
      },
      instructions: {
        en: 'Wear a natural Pearl of at least 4 carats set in silver on the little finger of the right hand on a Monday during Shukla Paksha.',
        hi: 'शुक्ल पक्ष के सोमवार को चाँदी में जड़ा कम से कम 4 रत्ती का प्राकृतिक मोती दाहिने हाथ की कनिष्ठिका में पहनें।',
      },
    },
    mantra: {
      name: {
        en: 'Om Chandraya Namah',
        hi: 'ॐ चंद्राय नमः',
      },
      instructions: {
        en: 'Chant "Om Chandraya Namah" 108 times daily in the evening, preferably on Mondays.',
        hi: 'प्रतिदिन सायंकाल, विशेषकर सोमवार को "ॐ चंद्राय नमः" का 108 बार जाप करें।',
      },
    },
    practice: {
      name: {
        en: 'Monday White Donation',
        hi: 'सोमवार श्वेत दान',
      },
      instructions: {
        en: 'Donate white items such as rice, milk, white cloth, or sugar on Mondays to strengthen the Moon.',
        hi: 'चंद्रमा को बल देने के लिए सोमवार को चावल, दूध, सफेद वस्त्र या चीनी जैसी सफेद वस्तुएँ दान करें।',
      },
    },
  },

  // Mars
  2: {
    gemstone: {
      name: {
        en: 'Red Coral (Moonga)',
        hi: 'मूँगा (Red Coral)',
      },
      instructions: {
        en: 'Wear a natural Red Coral of at least 6 carats set in gold or copper on the ring finger of the right hand on a Tuesday after sunrise.',
        hi: 'मंगलवार को सूर्योदय के बाद सोने या ताँबे में जड़ा कम से कम 6 रत्ती का प्राकृतिक मूँगा दाहिने हाथ की अनामिका में पहनें।',
      },
    },
    mantra: {
      name: {
        en: 'Om Mangalaya Namah',
        hi: 'ॐ मंगलाय नमः',
      },
      instructions: {
        en: 'Chant "Om Mangalaya Namah" 108 times daily, especially on Tuesdays.',
        hi: 'प्रतिदिन, विशेषकर मंगलवार को "ॐ मंगलाय नमः" का 108 बार जाप करें।',
      },
    },
    practice: {
      name: {
        en: 'Hanuman Puja on Tuesday',
        hi: 'मंगलवार हनुमान पूजा',
      },
      instructions: {
        en: 'Perform Hanuman puja on Tuesdays, offering red flowers and sindoor. Recite the Hanuman Chalisa.',
        hi: 'मंगलवार को लाल फूल और सिंदूर चढ़ाकर हनुमान पूजा करें। हनुमान चालीसा का पाठ करें।',
      },
    },
  },

  // Mercury
  3: {
    gemstone: {
      name: {
        en: 'Emerald (Panna)',
        hi: 'पन्ना (Emerald)',
      },
      instructions: {
        en: 'Wear a natural Emerald of at least 3 carats set in gold on the little finger of the right hand on a Wednesday morning.',
        hi: 'बुधवार की सुबह सोने में जड़ा कम से कम 3 रत्ती का प्राकृतिक पन्ना दाहिने हाथ की कनिष्ठिका में पहनें।',
      },
    },
    mantra: {
      name: {
        en: 'Om Budhaya Namah',
        hi: 'ॐ बुधाय नमः',
      },
      instructions: {
        en: 'Chant "Om Budhaya Namah" 108 times daily, especially on Wednesdays.',
        hi: 'प्रतिदिन, विशेषकर बुधवार को "ॐ बुधाय नमः" का 108 बार जाप करें।',
      },
    },
    practice: {
      name: {
        en: 'Feed Green Vegetables to Cows',
        hi: 'गाय को हरी सब्जी खिलाएँ',
      },
      instructions: {
        en: 'Feed green vegetables (spinach, grass, green fodder) to cows on Wednesdays to strengthen Mercury.',
        hi: 'बुध को बल देने के लिए बुधवार को गायों को हरी सब्जियाँ (पालक, घास, हरा चारा) खिलाएँ।',
      },
    },
  },

  // Jupiter
  4: {
    gemstone: {
      name: {
        en: 'Yellow Sapphire (Pukhraj)',
        hi: 'पुखराज (Yellow Sapphire)',
      },
      instructions: {
        en: 'Wear a natural Yellow Sapphire of at least 4 carats set in gold on the index finger of the right hand on a Thursday morning.',
        hi: 'गुरुवार की सुबह सोने में जड़ा कम से कम 4 रत्ती का प्राकृतिक पुखराज दाहिने हाथ की तर्जनी में पहनें।',
      },
    },
    mantra: {
      name: {
        en: 'Om Guruve Namah',
        hi: 'ॐ गुरवे नमः',
      },
      instructions: {
        en: 'Chant "Om Guruve Namah" 108 times daily, especially on Thursdays.',
        hi: 'प्रतिदिन, विशेषकर गुरुवार को "ॐ गुरवे नमः" का 108 बार जाप करें।',
      },
    },
    practice: {
      name: {
        en: 'Donate Turmeric and Gold on Thursday',
        hi: 'गुरुवार हल्दी और सोने का दान',
      },
      instructions: {
        en: 'Donate turmeric, yellow cloth, gold, or banana to Brahmins or temples on Thursdays.',
        hi: 'गुरुवार को ब्राह्मणों या मंदिरों में हल्दी, पीला वस्त्र, सोना या केला दान करें।',
      },
    },
  },

  // Venus
  5: {
    gemstone: {
      name: {
        en: 'Diamond (Heera)',
        hi: 'हीरा (Diamond)',
      },
      instructions: {
        en: 'Wear a natural Diamond of at least 0.5 carats set in silver or platinum on the middle finger of the right hand on a Friday morning.',
        hi: 'शुक्रवार की सुबह चाँदी या प्लेटिनम में जड़ा कम से कम 0.5 रत्ती का प्राकृतिक हीरा दाहिने हाथ की मध्यमा में पहनें।',
      },
    },
    mantra: {
      name: {
        en: 'Om Shukraya Namah',
        hi: 'ॐ शुक्राय नमः',
      },
      instructions: {
        en: 'Chant "Om Shukraya Namah" 108 times daily, especially on Fridays.',
        hi: 'प्रतिदिन, विशेषकर शुक्रवार को "ॐ शुक्राय नमः" का 108 बार जाप करें।',
      },
    },
    practice: {
      name: {
        en: 'Donate White Items on Friday',
        hi: 'शुक्रवार श्वेत वस्तुओं का दान',
      },
      instructions: {
        en: 'Donate white items such as white clothes, silver, rice, or perfume on Fridays to strengthen Venus.',
        hi: 'शुक्र को बल देने के लिए शुक्रवार को सफेद वस्त्र, चाँदी, चावल या इत्र जैसी सफेद वस्तुएँ दान करें।',
      },
    },
  },

  // Saturn
  6: {
    gemstone: {
      name: {
        en: 'Blue Sapphire (Neelam)',
        hi: 'नीलम (Blue Sapphire)',
      },
      instructions: {
        en: 'Wear a natural Blue Sapphire of at least 3 carats set in iron or silver on the middle finger on a Saturday. Always test for 3 days before wearing permanently.',
        hi: 'शनिवार को लोहे या चाँदी में जड़ा कम से कम 3 रत्ती का प्राकृतिक नीलम मध्यमा में पहनें। स्थायी रूप से पहनने से पहले 3 दिन परीक्षण अवश्य करें।',
      },
    },
    mantra: {
      name: {
        en: 'Om Shanaischaraya Namah',
        hi: 'ॐ शनैश्चराय नमः',
      },
      instructions: {
        en: 'Chant "Om Shanaischaraya Namah" 108 times daily, especially on Saturdays.',
        hi: 'प्रतिदिन, विशेषकर शनिवार को "ॐ शनैश्चराय नमः" का 108 बार जाप करें।',
      },
    },
    practice: {
      name: {
        en: 'Donate Iron and Oil on Saturday',
        hi: 'शनिवार को लोहे और तेल का दान',
      },
      instructions: {
        en: 'Donate iron utensils, black sesame seeds, mustard oil, or black cloth to the needy on Saturdays.',
        hi: 'शनिवार को जरूरतमंदों को लोहे के बर्तन, काले तिल, सरसों का तेल या काला कपड़ा दान करें।',
      },
    },
  },

  // Rahu
  7: {
    gemstone: {
      name: {
        en: 'Hessonite (Gomed)',
        hi: 'गोमेद (Hessonite)',
      },
      instructions: {
        en: 'Wear a natural Hessonite Garnet of at least 6 carats set in silver or panchdhatu on the middle finger on a Saturday evening.',
        hi: 'शनिवार की शाम को चाँदी या पंचधातु में जड़ा कम से कम 6 रत्ती का प्राकृतिक गोमेद मध्यमा में पहनें।',
      },
    },
    mantra: {
      name: {
        en: 'Om Rahuve Namah',
        hi: 'ॐ राहवे नमः',
      },
      instructions: {
        en: 'Chant "Om Rahuve Namah" 108 times daily at dusk, especially on Saturdays.',
        hi: 'प्रतिदिन संध्याकाल, विशेषकर शनिवार को "ॐ राहवे नमः" का 108 बार जाप करें।',
      },
    },
    practice: {
      name: {
        en: 'Donate Blue and Black Items on Saturday',
        hi: 'शनिवार को नीली-काली वस्तुओं का दान',
      },
      instructions: {
        en: 'Donate blue or black items such as black sesame, blue cloth, or coconut on Saturdays for Rahu pacification.',
        hi: 'राहु शांति के लिए शनिवार को काले तिल, नीला वस्त्र या नारियल जैसी नीली-काली वस्तुएँ दान करें।',
      },
    },
  },

  // Ketu
  8: {
    gemstone: {
      name: {
        en: "Cat's Eye (Lahsuniya)",
        hi: 'लहसुनिया (Cat\'s Eye)',
      },
      instructions: {
        en: "Wear a natural Cat's Eye Chrysoberyl of at least 4 carats set in silver on the middle finger on a Tuesday evening.",
        hi: "मंगलवार की शाम को चाँदी में जड़ा कम से कम 4 रत्ती का प्राकृतिक लहसुनिया मध्यमा में पहनें।",
      },
    },
    mantra: {
      name: {
        en: 'Om Ketave Namah',
        hi: 'ॐ केतवे नमः',
      },
      instructions: {
        en: 'Chant "Om Ketave Namah" 108 times daily, especially on Tuesdays.',
        hi: 'प्रतिदिन, विशेषकर मंगलवार को "ॐ केतवे नमः" का 108 बार जाप करें।',
      },
    },
    practice: {
      name: {
        en: 'Donate Sesame on Tuesday',
        hi: 'मंगलवार को तिल का दान',
      },
      instructions: {
        en: 'Donate sesame seeds, grey or multi-coloured blankets, or dog food on Tuesdays for Ketu pacification.',
        hi: 'केतु शांति के लिए मंगलवार को तिल, भूरे या रंगीन कंबल या कुत्ते का भोजन दान करें।',
      },
    },
  },
};

// ---------------------------------------------------------------------------
// Priority computation
// ---------------------------------------------------------------------------

/**
 * Computes an internal priority score (1–5) for a weak planet in a domain.
 *
 * 5 — debilitated AND lords the domain house (most urgent)
 * 4 — weak shadbala (< 1.0 rupa) AND lords the domain house
 * 3 — debilitated but not a house lord (still significant)
 * 2 — weak shadbala only (mild)
 * 1 — already acceptable strength, preventive only
 */
function computePriority(planet: RemedyInput['weakPlanets'][number]): number {
  const isWeakShadbala = planet.shadbalaRupa < 1.0;

  if (planet.isDebilitated && planet.isLordOfDomainHouse) return 5;
  if (isWeakShadbala && planet.isLordOfDomainHouse) return 4;
  if (planet.isDebilitated) return 3;
  if (isWeakShadbala) return 2;
  return 1;
}

// ---------------------------------------------------------------------------
// Main selection function
// ---------------------------------------------------------------------------

/**
 * Selects and prioritises Vedic remedies for weak planets in a given domain.
 *
 * Algorithm:
 * 1. Filter `weakPlanets` to those relevant to the domain
 *    (primaryPlanets ∪ lords of primaryHouses).
 * 2. Compute a priority score (1–5) for each planet.
 * 3. Sort by priority descending.
 * 4. For each planet (top 3), emit up to 2 remedies:
 *    - priority ≥ 4 → gemstone + mantra
 *    - priority = 3 → mantra + practice
 *    - priority ≤ 2 → practice only (easy, preventive)
 * 5. Return at most 6 remedies total.
 */
export function selectDomainRemedies(params: RemedyInput): DomainRemedy[] {
  const { domainConfig, weakPlanets } = params;

  if (weakPlanets.length === 0) return [];

  // Step 1: filter to planets relevant to this domain
  const relevantPlanets = weakPlanets.filter(
    (p) =>
      domainConfig.primaryPlanets.includes(p.planetId) ||
      p.isLordOfDomainHouse,
  );

  if (relevantPlanets.length === 0) return [];

  // Step 2 & 3: score and sort
  const scored = relevantPlanets
    .map((p) => ({ planet: p, priority: computePriority(p) }))
    .sort((a, b) => b.priority - a.priority);

  // Step 4: build remedies — top 3 planets, ≤2 remedies each
  const remedies: DomainRemedy[] = [];

  for (const { planet, priority } of scored.slice(0, 3)) {
    const db = PLANET_REMEDIES[planet.planetId];
    if (!db) continue;

    if (priority >= 4) {
      // gemstone + mantra
      remedies.push({
        type: 'gemstone',
        name: db.gemstone.name,
        instructions: db.gemstone.instructions,
        targetPlanetId: planet.planetId,
        difficulty: 'moderate',
      });
      remedies.push({
        type: 'mantra',
        name: db.mantra.name,
        instructions: db.mantra.instructions,
        targetPlanetId: planet.planetId,
        difficulty: 'easy',
      });
    } else if (priority === 3) {
      // mantra + practice
      remedies.push({
        type: 'mantra',
        name: db.mantra.name,
        instructions: db.mantra.instructions,
        targetPlanetId: planet.planetId,
        difficulty: 'easy',
      });
      remedies.push({
        type: 'charity',
        name: db.practice.name,
        instructions: db.practice.instructions,
        targetPlanetId: planet.planetId,
        difficulty: 'easy',
      });
    } else {
      // practice only
      remedies.push({
        type: 'charity',
        name: db.practice.name,
        instructions: db.practice.instructions,
        targetPlanetId: planet.planetId,
        difficulty: 'easy',
      });
    }

    // Stop once we hit 6
    if (remedies.length >= 6) break;
  }

  return remedies.slice(0, 6);
}
