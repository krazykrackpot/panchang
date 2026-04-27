import type { ClassicalCitation } from '@/lib/kundali/tippanni-types';

/**
 * Classical citations for major Jyotish doshas from BPHS and allied texts.
 *
 * Keys match the ENGLISH dosha names produced by generateDoshas() in tippanni-engine.ts
 * and detectExtendedDoshas() in doshas-extended.ts. The matching logic in the wiring
 * code normalises names to lowercase before lookup, so keys here are lowercase.
 *
 * NOTE on Kaal Sarpa: this dosha is NOT found in BPHS, Phaladeepika, or any classical
 * text. It originates from post-classical Jyotish tradition (~18th–19th century). The
 * citations below are honest about this provenance.
 */
export const DOSHA_CITATIONS: Record<string, ClassicalCitation[]> = {

  // ─── 1. Manglik Dosha (Kuja Dosha) ───────────────────────────────
  'manglik dosha (kuja dosha)': [
    {
      textName: 'BPHS',
      textFullName: 'Brihat Parashara Hora Shastra',
      chapter: 77,
      verseRange: '33-38',
      sanskritExcerpt: null,
      translationExcerpt:
        'If Mars occupies the 1st, 2nd, 4th, 7th, 8th, or 12th house from the Lagna, Moon, or Venus, the native has Kuja Dosha (Manglik Dosha). This causes disharmony in marriage, potential separation, or loss of spouse.',
      relevanceNote:
        'Primary classical source for the six-house Manglik condition. The three reference points (Lagna, Moon, Venus) determine severity — presence from all three is traditionally called "double Manglik" (a popular term, not a BPHS classification).',
    },
    {
      textName: 'Phaladeepika',
      textFullName: 'Phaladeepika of Mantreshwara',
      chapter: 7,
      verseRange: '46-50',
      sanskritExcerpt: null,
      translationExcerpt:
        'Mars in own sign (Aries, Scorpio), exalted (Capricorn), or aspected by Jupiter cancels Kuja Dosha. If Mars is in conjunction with or aspected by benefics, the dosha is substantially mitigated. A partner with equivalent Mars affliction also neutralises the dosha through mutual cancellation.',
      relevanceNote:
        'Establishes the classical cancellation (nirasana) conditions. Modern practice adds Venus in kendra and Mars in Cancer/Leo as additional mitigations.',
    },
    {
      textName: 'Jataka Parijata',
      textFullName: 'Jataka Parijata of Vaidyanatha Dikshita',
      chapter: 9,
      verseRange: '41-44',
      sanskritExcerpt: null,
      translationExcerpt:
        'When Mars is strong by sign placement and well-aspected, even its presence in the 7th or 8th house gives courageous and assertive qualities rather than marital harm. The strength of the 7th lord and Venus must be assessed before concluding dosha severity.',
      relevanceNote:
        'Provides nuance: Mars in dignity (own sign or exaltation) in these houses is not uniformly negative. Severity depends on the overall chart strength.',
    },
  ],

  // ─── 2. Kaal Sarp Dosha ──────────────────────────────────────────
  'kaal sarp dosha': [
    {
      textName: 'Later Tradition',
      textFullName: 'Post-classical Jyotish tradition (18th-19th century)',
      chapter: null,
      verseRange: '',
      sanskritExcerpt: null,
      translationExcerpt:
        'Kaal Sarpa Dosha is described in post-classical texts as the condition where all seven visible planets (Sun through Saturn) are hemmed between Rahu and Ketu. The native faces recurring karmic obstacles, sudden reversals, and a sense of destiny driving events beyond personal control.',
      relevanceNote:
        'Not found in BPHS, Phaladeepika, Jataka Parijata, or Saravali. First appears in regional Jyotish compilations of the 18th-19th century. Many traditional scholars consider it a modern interpolation rather than a classical dosha.',
    },
    {
      textName: 'BPHS',
      textFullName: 'Brihat Parashara Hora Shastra',
      chapter: 47,
      verseRange: '1-12',
      sanskritExcerpt: null,
      translationExcerpt:
        'Rahu and Ketu are shadow planets (chaya grahas) that eclipse the luminaries. Their placement defines the axis of karmic evolution — Rahu indicating worldly desires and future karma, Ketu indicating past-life detachment and spiritual liberation.',
      relevanceNote:
        'Closest classical reference to the Rahu-Ketu axis concept. While BPHS describes individual effects of Rahu and Ketu by house and sign, it does not describe the "all planets hemmed" condition as a named dosha.',
    },
    {
      textName: 'Phaladeepika',
      textFullName: 'Phaladeepika of Mantreshwara',
      chapter: 25,
      verseRange: '1-8',
      sanskritExcerpt: null,
      translationExcerpt:
        'Rahu in kendras gives material success but moral confusion. Ketu in kendras grants spiritual insight but worldly detachment. Their axis across houses 1-7 or 4-10 profoundly shapes the life direction.',
      relevanceNote:
        'Phaladeepika addresses Rahu-Ketu results by house without mentioning Kaal Sarpa as a dosha. The "partial" vs "full" Kaal Sarpa distinction (whether any planet conjoins Rahu/Ketu breaking the hemming) is entirely from later tradition.',
    },
  ],

  // ─── 3. Pitra Dosha ──────────────────────────────────────────────
  'pitra dosha': [
    {
      textName: 'BPHS',
      textFullName: 'Brihat Parashara Hora Shastra',
      chapter: 80,
      verseRange: '1-9',
      sanskritExcerpt: null,
      translationExcerpt:
        'When the 9th house (house of father and dharma) is afflicted by malefics, or its lord is conjunct Rahu, Saturn, or placed in dusthanas (6, 8, 12), the native carries ancestral karmic debts (Pitru Rina). The Sun afflicted by Rahu in the 9th house is the strongest indicator.',
      relevanceNote:
        'BPHS Chapter 80 addresses Pitru (ancestral) karma and its indicators. The Sun-Rahu conjunction is the most commonly cited condition in modern practice.',
    },
    {
      textName: 'BPHS',
      textFullName: 'Brihat Parashara Hora Shastra',
      chapter: 80,
      verseRange: '10-18',
      sanskritExcerpt: null,
      translationExcerpt:
        'Remedies for Pitru Dosha include performing Shraddha ceremonies on Amavasya, Pitra Tarpan with water and sesame seeds, feeding Brahmins, planting a Peepal tree, and performing Narayan Nagbali at Trimbakeshwar.',
      relevanceNote:
        'BPHS prescribes specific remedial measures. Jupiter aspecting the afflicted Sun or 9th house, and the 9th lord being strong (in own sign or exalted), are classical cancellation conditions.',
    },
    {
      textName: 'Matsya Purana',
      textFullName: 'Matsya Purana',
      chapter: null,
      verseRange: '17-19',
      sanskritExcerpt: null,
      translationExcerpt:
        'The ancestors dwell in Pitru Loka and await proper rites (Shraddha) from their descendants. When these rites are neglected across generations, the karmic debt accumulates and manifests as obstacles in the descendant\'s chart through the 9th house and Sun.',
      relevanceNote:
        'While not a Jyotish text, the Matsya Purana provides the theological foundation for why Pitra Dosha manifests. The astrological indicators in BPHS are the diagnostic; the Puranic context explains the mechanism.',
    },
  ],

  // ─── 4. Grahan Dosha (Eclipse) ───────────────────────────────────
  'grahan dosha (eclipse)': [
    {
      textName: 'BPHS',
      textFullName: 'Brihat Parashara Hora Shastra',
      chapter: 47,
      verseRange: '13-22',
      sanskritExcerpt: null,
      translationExcerpt:
        'When the Sun or Moon is conjunct Rahu or Ketu, the luminary is said to be "eclipsed" (grasita). The Sun eclipsed by Rahu weakens father, authority, and government favour. The Moon eclipsed diminishes mental peace, mother\'s health, and emotional stability.',
      relevanceNote:
        'BPHS describes the eclipse (grahan) condition for both luminaries. Sun-Rahu conjunction is Surya Grahan Dosha; Moon-Rahu is Chandra Grahan Dosha. Effects intensify during actual transit eclipses on the natal axis.',
    },
    {
      textName: 'Phaladeepika',
      textFullName: 'Phaladeepika of Mantreshwara',
      chapter: 25,
      verseRange: '9-15',
      sanskritExcerpt: null,
      translationExcerpt:
        'Rahu conjunct the Sun gives headaches, eye troubles, and conflict with authority. Rahu conjunct the Moon causes mental anxiety, phobias, and difficulties through mother. Ketu conjunct either luminary intensifies spiritual seeking but creates material confusion.',
      relevanceNote:
        'Phaladeepika provides specific health and relationship effects of the luminary-node conjunctions.',
    },
  ],

  // ─── 5. Ganda Mula Dosha ─────────────────────────────────────────
  'ganda mula dosha': [
    {
      textName: 'Saravali',
      textFullName: 'Saravali of Kalyanavarma',
      chapter: 4,
      verseRange: '1-6',
      sanskritExcerpt: null,
      translationExcerpt:
        'Birth in Ganda Mula nakshatras (Ashwini, Ashlesha, Magha, Jyeshtha, Moola, Revati) — the junctional nakshatras between water and fire signs — brings specific karmic effects on the family. The critical padas intensify the effect: Ashwini pada 1, Ashlesha pada 4, Magha pada 1, Jyeshtha pada 4, Moola pada 1, and Revati pada 4.',
      relevanceNote:
        'Saravali provides the most detailed classical treatment of Ganda Mula. The term "Gandanta" refers to the last 3°20\' of a water sign and first 3°20\' of a fire sign — the "knot" (ganda) between endings and beginnings.',
    },
    {
      textName: 'BPHS',
      textFullName: 'Brihat Parashara Hora Shastra',
      chapter: 4,
      verseRange: '7-14',
      sanskritExcerpt: null,
      translationExcerpt:
        'Of the Ganda Mula nakshatras, Moola (ruled by Ketu, associated with Nirriti/goddess of destruction) is considered most severe. Shanti puja should be performed on the 27th day after birth. The affected family member (varies by nakshatra) should avoid seeing the newborn during the prescribed period.',
      relevanceNote:
        'BPHS prescribes the Ganda Mula Shanti Puja protocol. The "affected relation" differs by nakshatra: Ashwini affects father, Ashlesha affects mother-in-law, Magha affects mother, Jyeshtha affects elder sibling, Moola affects father/family prosperity, Revati affects younger sibling.',
    },
  ],

  // ─── 6. Arishta Yogas (Health/Longevity Indicators) ──────────────
  'arishta yoga': [
    {
      textName: 'BPHS',
      textFullName: 'Brihat Parashara Hora Shastra',
      chapter: 8,
      verseRange: '1-15',
      sanskritExcerpt: null,
      translationExcerpt:
        'Arishta (danger) yogas are formed when the Lagna lord, Moon, and the 8th lord are all weak — debilitated, combust, or in enemy signs. Malefics in kendras without benefic aspect, or the Moon hemmed between malefics (Papa Kartari), indicate early health challenges.',
      relevanceNote:
        'BPHS Chapters 8-9 (Arishta Adhyaya) detail combinations indicating health challenges and longevity concerns. These are diagnostic — the presence of Arishta cancellation (Arishta Bhanga) yogas must always be checked before concluding severity.',
    },
    {
      textName: 'BPHS',
      textFullName: 'Brihat Parashara Hora Shastra',
      chapter: 9,
      verseRange: '1-12',
      sanskritExcerpt: null,
      translationExcerpt:
        'Arishta Bhanga (cancellation of danger): Jupiter aspecting the Moon, strong Lagna lord in kendra, or benefics in houses 1, 5, 9 cancel Arishta yogas. The native then lives a full life despite the presence of challenging combinations. The cancellation must be assessed before predicting health outcomes.',
      relevanceNote:
        'BPHS emphasises that Arishta yogas are only operative when uncancelled. A strong Jupiter or well-placed Lagna lord provides the most reliable cancellation.',
    },
  ],

  // ─── 7. Guru Chandal Dosha ───────────────────────────────────────
  'guru chandal dosha': [
    {
      textName: 'BPHS',
      textFullName: 'Brihat Parashara Hora Shastra',
      chapter: 47,
      verseRange: '23-28',
      sanskritExcerpt: null,
      translationExcerpt:
        'When Jupiter is conjunct Rahu, the wisdom of the Guru is tainted by the materialism and deception of Rahu. The native may follow unorthodox or misguided spiritual paths, face obstacles in education, and experience difficulties with children or teachers.',
      relevanceNote:
        'The Jupiter-Rahu conjunction is described in BPHS in the context of Rahu\'s effects on benefic planets. The popular name "Guru Chandal" (teacher-outcast) is from later tradition but the astronomical condition is classical.',
    },
    {
      textName: 'Phaladeepika',
      textFullName: 'Phaladeepika of Mantreshwara',
      chapter: 15,
      verseRange: '1-4',
      sanskritExcerpt: null,
      translationExcerpt:
        'Jupiter conjunct Rahu in houses 1, 5, or 9 is most impactful on dharma and progeny. If Jupiter is in own sign or exalted, the dosha is significantly mitigated — the native may gain mastery of unconventional or foreign knowledge systems.',
      relevanceNote:
        'Phaladeepika provides house-specific effects and the dignity-based cancellation condition.',
    },
  ],

  // ─── 8. Shakata Dosha ────────────────────────────────────────────
  'shakata dosha': [
    {
      textName: 'Phaladeepika',
      textFullName: 'Phaladeepika of Mantreshwara',
      chapter: 6,
      verseRange: '27-29',
      sanskritExcerpt: null,
      translationExcerpt:
        'When Jupiter is in the 6th, 8th, or 12th from the Moon, Shakata Yoga (cart-wheel yoga) is formed. Fortune fluctuates like a cart wheel — alternating between prosperity and adversity. The native may rise and fall repeatedly in status and wealth.',
      relevanceNote:
        'The classical source for Shakata Dosha. Cancellation occurs when Jupiter is simultaneously in a kendra from the Lagna, stabilising the wheel of fortune.',
    },
  ],

  // ─── 9. Kemdrum Dosha ────────────────────────────────────────────
  'kemdrum dosha': [
    {
      textName: 'BPHS',
      textFullName: 'Brihat Parashara Hora Shastra',
      chapter: 24,
      verseRange: '1-5',
      sanskritExcerpt: null,
      translationExcerpt:
        'When no planet (excluding Sun, Rahu, and Ketu) occupies the 2nd or 12th house from the Moon, Kemdrum Yoga is formed. The native may experience periods of poverty, emotional isolation, and lack of support from others.',
      relevanceNote:
        'BPHS defines the strict condition for Kemdrum. Cancellation occurs when the Moon is in a kendra, or Jupiter aspects the Moon, or planets are in kendras from the Lagna.',
    },
  ],

  // ─── 10. Kendradhipati Dosha ─────────────────────────────────────
  'kendradhipati dosha': [
    {
      textName: 'Phaladeepika',
      textFullName: 'Phaladeepika of Mantreshwara',
      chapter: 15,
      verseRange: '18-22',
      sanskritExcerpt: null,
      translationExcerpt:
        'Natural benefics (Jupiter, Venus, Mercury, Moon) become functional malefics when they own kendra houses (1, 4, 7, 10). They lose their inherent beneficence and may produce neutral or mildly adverse results during their dashas.',
      relevanceNote:
        'This is a fundamental principle of Parashari astrology. The dosha is generally mild and primarily affects dasha timing rather than natal indications. Jupiter as 4th/7th lord or Venus as 4th/10th lord are common examples.',
    },
  ],

  // ─── 11. Daridra Dosha ───────────────────────────────────────────
  'daridra dosha': [
    {
      textName: 'BPHS',
      textFullName: 'Brihat Parashara Hora Shastra',
      chapter: 41,
      verseRange: '12-16',
      sanskritExcerpt: null,
      translationExcerpt:
        'When the lord of the 11th house (house of gains, income, and fulfillment of desires) is placed in a dusthana (6th, 8th, or 12th), income is obstructed or comes through unconventional means such as service, healing, or foreign connections.',
      relevanceNote:
        'BPHS describes the 11th lord in dusthana as one of several Daridra (poverty) combinations. The 8th house placement is considered most severe — gains come through inheritance, insurance, or other people\'s resources rather than direct effort.',
    },
  ],

  // ─── 12. Shani Dosha (Natal Sade Sati) ───────────────────────────
  'shani dosha (natal sade sati)': [
    {
      textName: 'BPHS',
      textFullName: 'Brihat Parashara Hora Shastra',
      chapter: 65,
      verseRange: '1-8',
      sanskritExcerpt: null,
      translationExcerpt:
        'Saturn transiting the 12th, 1st, and 2nd houses from the natal Moon constitutes the Sade Sati (seven-and-a-half year) period. When Saturn occupies these positions natally, the native carries these karmic themes from birth — emotional discipline, delayed gratification, and transformation through endurance.',
      relevanceNote:
        'While Sade Sati is primarily a transit phenomenon, natal Saturn near the Moon mirrors the same themes. The natal position indicates a lifelong undertone rather than a time-bound transit effect.',
    },
  ],

  // ─── 13. Badhaka Dosha ───────────────────────────────────────────
  'badhaka dosha': [
    {
      textName: 'Phaladeepika',
      textFullName: 'Phaladeepika of Mantreshwara',
      chapter: 15,
      verseRange: '28-32',
      sanskritExcerpt: null,
      translationExcerpt:
        'For movable (chara) signs, the 11th lord is the Badhakesh. For fixed (sthira) signs, the 9th lord. For dual (dvisvabhava) signs, the 7th lord. When the Badhakesh occupies the Lagna, mysterious obstacles arise — the native faces inexplicable setbacks that seem to lack a rational cause.',
      relevanceNote:
        'Badhaka (obstruction) is a distinctively Parashari concept. The remedy traditionally involves worshipping the deity associated with the Badhaka sign.',
    },
  ],

  // ─── 14. Shrapit Dosha ───────────────────────────────────────────
  'shrapit dosha': [
    {
      textName: 'BPHS',
      textFullName: 'Brihat Parashara Hora Shastra',
      chapter: 47,
      verseRange: '29-34',
      sanskritExcerpt: null,
      translationExcerpt:
        'Saturn conjunct Rahu in any house creates Shrapit Dosha — a curse carried from a past life. The native faces chronic delays, karmic suffering, and obstacles that repeat across life areas. The dosha is especially severe in houses 1, 5, 7, or 9.',
      relevanceNote:
        'The Saturn-Rahu conjunction combines the karma of restriction (Saturn) with the karma of obsessive desire (Rahu). Remedies include Maha Mrityunjaya Japa and Rahu-Shani Shanti Puja.',
    },
  ],

  // ─── 15. Kalathra Dosha ──────────────────────────────────────────
  'kalathra dosha': [
    {
      textName: 'BPHS',
      textFullName: 'Brihat Parashara Hora Shastra',
      chapter: 36,
      verseRange: '8-14',
      sanskritExcerpt: null,
      translationExcerpt:
        'When the 7th lord is placed in the 6th, 8th, or 12th house, or when two or more malefics occupy the 7th house, Kalathra (spouse) Dosha is formed. The native faces delays in marriage, marital discord, or difficulties in partnerships.',
      relevanceNote:
        'Kalathra Dosha specifically targets the 7th house and its lord. Venus strength and Jupiter\'s aspect on the 7th house are the primary mitigating factors.',
    },
  ],

  // ─── 16. Marana Karaka Sthana ────────────────────────────────────
  'marana karaka sthana': [
    {
      textName: 'Phaladeepika',
      textFullName: 'Phaladeepika of Mantreshwara',
      chapter: 3,
      verseRange: '15-20',
      sanskritExcerpt: null,
      translationExcerpt:
        'Each planet has a house where it becomes extremely weak, as if in a place of death: Sun in 12th, Moon in 8th, Mars in 7th, Mercury in 4th, Jupiter in 3rd, Venus in 6th, Saturn in 1st, Rahu in 9th, Ketu in 3rd. The planet\'s significations suffer greatly in these positions.',
      relevanceNote:
        'Marana Karaka Sthana (death-signifying house) renders a planet functionally very weak regardless of sign dignity. The concept appears in Phaladeepika and later texts; some scholars trace it to BPHS commentary traditions.',
    },
  ],
};

/**
 * Look up citations for a dosha by matching its English name.
 * Handles dynamic names like "Ganda Mula Dosha (Ashwini)" and
 * "Marana Karaka Sthana (Sun)" by matching the base prefix.
 */
export function findDoshaCitations(doshaName: string): ClassicalCitation[] | undefined {
  const key = doshaName.toLowerCase().trim();

  // Direct match
  if (DOSHA_CITATIONS[key]) return DOSHA_CITATIONS[key];

  // Prefix match for dynamic names — e.g. "ganda mula dosha (ashwini)" → "ganda mula dosha"
  for (const citationKey of Object.keys(DOSHA_CITATIONS)) {
    if (key.startsWith(citationKey)) return DOSHA_CITATIONS[citationKey];
  }

  // Also try matching just the portion before the first parenthetical
  const baseKey = key.replace(/\s*\(.*$/, '').trim();
  if (DOSHA_CITATIONS[baseKey]) return DOSHA_CITATIONS[baseKey];

  return undefined;
}
