import type { ClassicalCitation } from '@/lib/kundali/tippanni-types';

/**
 * Classical citations for major Jyotish yogas from BPHS, Phaladeepika, and Saravali.
 * Keyed by yoga English name (lowercase), matching the `name` field in YogaInsight
 * after locale resolution via y.name[locale].
 *
 * Sources:
 * - BPHS = Brihat Parashara Hora Shastra (tr. Girish Chand Sharma / R. Santhanam)
 * - PD = Phaladeepika by Mantreshwara (tr. S.S. Sareen)
 * - SAR = Saravali by Kalyana Varma (tr. R. Santhanam)
 */
export const YOGA_CITATIONS: Record<string, ClassicalCitation[]> = {
  // =========================================================================
  // Pancha Mahapurusha Yogas (BPHS Ch.75, PD Ch.7)
  // =========================================================================

  'ruchaka yoga': [
    {
      textName: 'BPHS',
      textFullName: 'Brihat Parashara Hora Shastra',
      chapter: 75,
      verseRange: '1-5',
      sanskritExcerpt: null,
      translationExcerpt:
        'If Mars occupies a kendra in its own sign (Aries/Scorpio) or exaltation (Capricorn), Ruchaka Yoga is formed. The native will be valorous, famous, equal to a king, conforming to traditions, and with a long face and handsome appearance.',
      relevanceNote:
        'Mars must be in Aries, Scorpio, or Capricorn AND in house 1, 4, 7, or 10 from Lagna.',
    },
    {
      textName: 'Phaladeepika',
      textFullName: 'Phaladeepika by Mantreshwara',
      chapter: 7,
      verseRange: '1-3',
      sanskritExcerpt: null,
      translationExcerpt:
        'Ruchaka Yoga: the native will have a strong body, be famous, well-versed in ancient lore, a commander of armies, and endowed with wealth.',
      relevanceNote:
        'Phaladeepika confirms BPHS formation and adds martial qualities.',
    },
  ],

  'bhadra yoga': [
    {
      textName: 'BPHS',
      textFullName: 'Brihat Parashara Hora Shastra',
      chapter: 75,
      verseRange: '6-10',
      sanskritExcerpt: null,
      translationExcerpt:
        'If Mercury occupies a kendra in its own sign (Gemini/Virgo) or exaltation (Virgo), Bhadra Yoga is formed. The native will be learned, eloquent, strong-bodied, and will live long.',
      relevanceNote:
        'Mercury must be in Gemini or Virgo AND in house 1, 4, 7, or 10.',
    },
    {
      textName: 'Phaladeepika',
      textFullName: 'Phaladeepika by Mantreshwara',
      chapter: 7,
      verseRange: '4-6',
      sanskritExcerpt: null,
      translationExcerpt:
        'Bhadra Yoga gives intellectual brilliance, skill in speech, a lion-like gait, and a long life of about seventy years.',
      relevanceNote:
        'Classical result — intellect and communication prowess.',
    },
  ],

  'hansa yoga': [
    {
      textName: 'BPHS',
      textFullName: 'Brihat Parashara Hora Shastra',
      chapter: 75,
      verseRange: '11-15',
      sanskritExcerpt: null,
      translationExcerpt:
        'If Jupiter occupies a kendra in its own sign (Sagittarius/Pisces) or exaltation (Cancer), Hansa Yoga is formed. The native will be righteous, handsome, fair-complexioned, with an elevated nose, and will be a king or equal to one.',
      relevanceNote:
        'Jupiter must be in Sagittarius, Pisces, or Cancer AND in house 1, 4, 7, or 10.',
    },
    {
      textName: 'Phaladeepika',
      textFullName: 'Phaladeepika by Mantreshwara',
      chapter: 7,
      verseRange: '7-9',
      sanskritExcerpt: null,
      translationExcerpt:
        'Hansa Yoga bestows a beautiful body, virtuous conduct, spiritual inclination, and renown. The native is respected by the learned.',
      relevanceNote:
        'Jupiter-based Mahapurusha yoga — wisdom and dharma.',
    },
  ],

  'malavya yoga': [
    {
      textName: 'BPHS',
      textFullName: 'Brihat Parashara Hora Shastra',
      chapter: 75,
      verseRange: '16-20',
      sanskritExcerpt: null,
      translationExcerpt:
        'If Venus occupies a kendra in its own sign (Taurus/Libra) or exaltation (Pisces), Malavya Yoga is formed. The native will possess vehicles, be well-built, resolute, wealthy, blessed with wife and children, and famous.',
      relevanceNote:
        'Venus must be in Taurus, Libra, or Pisces AND in house 1, 4, 7, or 10.',
    },
    {
      textName: 'Phaladeepika',
      textFullName: 'Phaladeepika by Mantreshwara',
      chapter: 7,
      verseRange: '10-12',
      sanskritExcerpt: null,
      translationExcerpt:
        'Malavya Yoga gives a strong and handsome body, wealth from a devoted spouse, enjoyment of luxuries, and fame spread in many lands.',
      relevanceNote:
        'Venus-based Mahapurusha yoga — luxury and conjugal happiness.',
    },
  ],

  'shasha yoga': [
    {
      textName: 'BPHS',
      textFullName: 'Brihat Parashara Hora Shastra',
      chapter: 75,
      verseRange: '21-25',
      sanskritExcerpt: null,
      translationExcerpt:
        'If Saturn occupies a kendra in its own sign (Capricorn/Aquarius) or exaltation (Libra), Shasha Yoga is formed. The native commands servants, is powerful, head of a town or village, wicked in disposition but prosperous.',
      relevanceNote:
        'Saturn must be in Capricorn, Aquarius, or Libra AND in house 1, 4, 7, or 10.',
    },
    {
      textName: 'Phaladeepika',
      textFullName: 'Phaladeepika by Mantreshwara',
      chapter: 7,
      verseRange: '13-15',
      sanskritExcerpt: null,
      translationExcerpt:
        'Shasha Yoga: the native will command authority over others, be fond of forests and mountains, possess wealth, and be versed in metallurgy and weapons.',
      relevanceNote:
        'Saturn-based Mahapurusha yoga — authority and discipline.',
    },
  ],

  // =========================================================================
  // Moon-Based Yogas (BPHS Ch.24-25, PD Ch.6)
  // =========================================================================

  'gajakesari yoga': [
    {
      textName: 'BPHS',
      textFullName: 'Brihat Parashara Hora Shastra',
      chapter: 36,
      verseRange: '3-5',
      sanskritExcerpt: null,
      translationExcerpt:
        'If Jupiter is in a kendra from the Moon (houses 1, 4, 7, or 10), Gajakesari Yoga is formed. The native will be illustrious, overpowering, virtuous, wealthy, and favored by the sovereign.',
      relevanceNote:
        'Jupiter must be in 1st, 4th, 7th, or 10th house from Moon. Common yoga (~25% of charts).',
    },
    {
      textName: 'Phaladeepika',
      textFullName: 'Phaladeepika by Mantreshwara',
      chapter: 6,
      verseRange: '1-2',
      sanskritExcerpt: null,
      translationExcerpt:
        'When Jupiter occupies a kendra from the Moon, Gajakesari Yoga arises. The native destroys opponents as an elephant destroys a lion, builds villages and towns, and is endowed with lasting fame.',
      relevanceNote:
        'Gaja (elephant) + Kesari (lion) — the name denotes majestic power.',
    },
  ],

  'chandra mangala yoga': [
    {
      textName: 'BPHS',
      textFullName: 'Brihat Parashara Hora Shastra',
      chapter: 36,
      verseRange: '7-8',
      sanskritExcerpt: null,
      translationExcerpt:
        'If Mars is conjoined with the Moon, Chandra-Mangala Yoga is formed. The native earns money through unscrupulous means, deals in earth/minerals, is daring, and cruel but wealthy.',
      relevanceNote:
        'Moon-Mars conjunction in the same house. Common (~8% of charts).',
    },
    {
      textName: 'Phaladeepika',
      textFullName: 'Phaladeepika by Mantreshwara',
      chapter: 6,
      verseRange: '5',
      sanskritExcerpt: null,
      translationExcerpt:
        'Chandra-Mangala Yoga: The native will be a trader dealing in women-related goods, earthy products, or liquids; prosperous but of questionable morals.',
      relevanceNote:
        'Classical result is wealth through trade but moral complexity.',
    },
  ],

  'sunapha yoga': [
    {
      textName: 'BPHS',
      textFullName: 'Brihat Parashara Hora Shastra',
      chapter: 24,
      verseRange: '2-3',
      sanskritExcerpt: null,
      translationExcerpt:
        'If any planet other than the Sun occupies the 2nd house from the Moon, Sunapha Yoga is formed. The native will be a king or equal to one, intelligent, wealthy, and of good reputation.',
      relevanceNote:
        'Any planet (except Sun, Rahu, Ketu) in 2nd from Moon.',
    },
  ],

  'anapha yoga': [
    {
      textName: 'BPHS',
      textFullName: 'Brihat Parashara Hora Shastra',
      chapter: 24,
      verseRange: '4-5',
      sanskritExcerpt: null,
      translationExcerpt:
        'If any planet other than the Sun occupies the 12th house from the Moon, Anapha Yoga is formed. The native will be a king, healthy, affable, renowned, and happy.',
      relevanceNote:
        'Any planet (except Sun, Rahu, Ketu) in 12th from Moon.',
    },
  ],

  'durdhara yoga': [
    {
      textName: 'BPHS',
      textFullName: 'Brihat Parashara Hora Shastra',
      chapter: 24,
      verseRange: '6-7',
      sanskritExcerpt: null,
      translationExcerpt:
        'If planets other than the Sun occupy both the 2nd and 12th houses from the Moon, Durudhura Yoga is formed. The native will enjoy much wealth, vehicles, and will be generous and noble.',
      relevanceNote:
        'Planets in both 2nd AND 12th from Moon — combines Sunapha + Anapha.',
    },
  ],

  'kemadruma yoga': [
    {
      textName: 'BPHS',
      textFullName: 'Brihat Parashara Hora Shastra',
      chapter: 24,
      verseRange: '8-10',
      sanskritExcerpt: null,
      translationExcerpt:
        'If no planet occupies the 2nd or 12th house from the Moon and the Moon is not aspected by or conjoined with a benefic, Kemadruma Yoga is formed. The native will be dirty, sorrowful, poverty-stricken, and dependent on others.',
      relevanceNote:
        'No planets in 2nd/12th from Moon AND no benefic aspect/conjunction cancels it.',
    },
    {
      textName: 'Phaladeepika',
      textFullName: 'Phaladeepika by Mantreshwara',
      chapter: 6,
      verseRange: '8-9',
      sanskritExcerpt: null,
      translationExcerpt:
        'Kemadruma: the native is bereft of education, wealth, intelligence, and happiness, and may be reduced to servitude even if born royal.',
      relevanceNote:
        'Cancellation occurs if Moon is in kendra, conjunct a planet, or aspected by Jupiter.',
    },
  ],

  'shakata yoga': [
    {
      textName: 'Phaladeepika',
      textFullName: 'Phaladeepika by Mantreshwara',
      chapter: 6,
      verseRange: '15-16',
      sanskritExcerpt: null,
      translationExcerpt:
        'When Moon occupies the 6th, 8th, or 12th house from Jupiter, Shakata Yoga is formed. The native suffers fluctuating fortunes — wealth comes and goes like the movement of a cart wheel.',
      relevanceNote:
        'Moon in dusthana from Jupiter. Indicates instability in fortune.',
    },
  ],

  // =========================================================================
  // Raja Yogas (BPHS Ch.41)
  // =========================================================================

  'raja yoga': [
    {
      textName: 'BPHS',
      textFullName: 'Brihat Parashara Hora Shastra',
      chapter: 41,
      verseRange: '1-13',
      sanskritExcerpt: null,
      translationExcerpt:
        'When lords of kendra (1, 4, 7, 10) and trikona (1, 5, 9) houses conjoin, aspect each other, or exchange signs, Raja Yoga is produced. The native attains kingship, authority, and high status.',
      relevanceNote:
        'Kendra lord + Trikona lord in mutual relationship. Many sub-varieties exist.',
    },
  ],

  'dharma-karmadhipati yoga': [
    {
      textName: 'BPHS',
      textFullName: 'Brihat Parashara Hora Shastra',
      chapter: 41,
      verseRange: '14-16',
      sanskritExcerpt: null,
      translationExcerpt:
        'When the lord of the 9th house (Dharma) and the lord of the 10th house (Karma) conjoin or mutually aspect, the most powerful Raja Yoga called Dharma-Karmadhipati is formed. The native becomes a ruler, achieves great fame, and performs righteous deeds.',
      relevanceNote:
        '9th lord + 10th lord conjunction/aspect — considered the strongest Raja Yoga.',
    },
  ],

  'lakshmi yoga': [
    {
      textName: 'BPHS',
      textFullName: 'Brihat Parashara Hora Shastra',
      chapter: 41,
      verseRange: '17-19',
      sanskritExcerpt: null,
      translationExcerpt:
        'If the lord of the 9th house is in own sign or exalted and placed in a kendra, Lakshmi Yoga is formed. The native will be wealthy, noble, learned, virtuous, and will enjoy all comforts.',
      relevanceNote:
        '9th lord in own/exalted sign AND in kendra (1, 4, 7, 10).',
    },
  ],

  'viparita raja yoga': [
    {
      textName: 'BPHS',
      textFullName: 'Brihat Parashara Hora Shastra',
      chapter: 41,
      verseRange: '28-32',
      sanskritExcerpt: null,
      translationExcerpt:
        'When the lords of the 6th, 8th, or 12th houses are placed in the 6th, 8th, or 12th houses (mutual exchange or placement), Viparita Raja Yoga is formed. The native gains through misfortunes of enemies, rises after initial adversity, and achieves unexpected success.',
      relevanceNote:
        'Dusthana lords in dusthana houses — "reverse" Raja Yoga. Three sub-types: Harsha (6L in 6/8/12), Sarala (8L), Vimala (12L).',
    },
  ],

  'neechabhanga raja yoga': [
    {
      textName: 'BPHS',
      textFullName: 'Brihat Parashara Hora Shastra',
      chapter: 28,
      verseRange: '20-24',
      sanskritExcerpt: null,
      translationExcerpt:
        'When a debilitated planet has its debilitation cancelled — by the lord of the debilitation sign being in kendra from Lagna or Moon, or by the exaltation lord of that sign being in kendra — Neechabhanga Raja Yoga is formed. The native rises from humble origins to great heights.',
      relevanceNote:
        'Debilitated planet whose debilitation is cancelled by specific conditions.',
    },
  ],

  // =========================================================================
  // Dhana / Wealth Yogas (BPHS Ch.42)
  // =========================================================================

  'dhana yoga': [
    {
      textName: 'BPHS',
      textFullName: 'Brihat Parashara Hora Shastra',
      chapter: 42,
      verseRange: '1-5',
      sanskritExcerpt: null,
      translationExcerpt:
        'When the lords of the 2nd and 11th houses are in kendra or trikona positions, or when they conjoin with the lord of the 5th or 9th house, Dhana Yoga is formed. The native accumulates great wealth.',
      relevanceNote:
        '2nd/11th lords in favorable positions with trikona lords.',
    },
  ],

  'vasumati yoga': [
    {
      textName: 'BPHS',
      textFullName: 'Brihat Parashara Hora Shastra',
      chapter: 42,
      verseRange: '6-8',
      sanskritExcerpt: null,
      translationExcerpt:
        'When ALL natural benefics (Jupiter, Venus, Mercury, Moon) occupy upachaya houses (3, 6, 10, 11) from the Moon, Vasumati Yoga is formed. The native is immensely wealthy and never faces poverty.',
      relevanceNote:
        'All benefics in upachaya from Moon — ALL must satisfy the condition, not just some (<5% of charts).',
    },
  ],

  // =========================================================================
  // Auspicious Yogas
  // =========================================================================

  'amala yoga': [
    {
      textName: 'BPHS',
      textFullName: 'Brihat Parashara Hora Shastra',
      chapter: 36,
      verseRange: '20-21',
      sanskritExcerpt: null,
      translationExcerpt:
        'When a natural benefic planet occupies the 10th house from the Lagna or from the Moon, Amala Yoga is formed. The native will earn lasting fame through righteous and virtuous deeds.',
      relevanceNote:
        'Benefic (Jupiter, Venus, Mercury, Moon) in 10th from Lagna or Moon.',
    },
    {
      textName: 'Saravali',
      textFullName: 'Saravali by Kalyana Varma',
      chapter: 35,
      verseRange: '1-3',
      sanskritExcerpt: null,
      translationExcerpt:
        'Amala Yoga produces a person whose fame is unblemished (amala = spotless). Such a native performs charitable deeds and is praised by sovereigns.',
      relevanceNote:
        'Amala literally means "spotless" — the native\'s reputation remains untarnished.',
    },
  ],

  'parvata yoga': [
    {
      textName: 'BPHS',
      textFullName: 'Brihat Parashara Hora Shastra',
      chapter: 36,
      verseRange: '24-26',
      sanskritExcerpt: null,
      translationExcerpt:
        'When benefic planets occupy kendra houses and no malefic planet is in a kendra, Parvata Yoga is formed. The native will be wealthy, eloquent, learned, charitable, and famous — firm like a mountain.',
      relevanceNote:
        'Benefics in kendras with no malefics in kendras — rare and highly auspicious.',
    },
  ],

  'kahala yoga': [
    {
      textName: 'BPHS',
      textFullName: 'Brihat Parashara Hora Shastra',
      chapter: 36,
      verseRange: '28-29',
      sanskritExcerpt: null,
      translationExcerpt:
        'When the lords of the 4th and 9th houses are in mutual kendras and the Lagna lord is strong, Kahala Yoga is formed. The native is bold, daring, heads an army, and is stubborn but successful.',
      relevanceNote:
        '4th and 9th lords in mutual kendra relationship + strong Lagna lord.',
    },
  ],

  'budhaditya yoga': [
    {
      textName: 'BPHS',
      textFullName: 'Brihat Parashara Hora Shastra',
      chapter: 36,
      verseRange: '10-11',
      sanskritExcerpt: null,
      translationExcerpt:
        'When the Sun and Mercury are conjoined in the same house, Budhaditya Yoga is formed. The native is highly intelligent, skillful, earns good reputation, and is learned in many disciplines.',
      relevanceNote:
        'Sun-Mercury conjunction — common since Mercury is never more than 28 degrees from the Sun. Strength depends on house placement and combustion status.',
    },
    {
      textName: 'Saravali',
      textFullName: 'Saravali by Kalyana Varma',
      chapter: 38,
      verseRange: '5-6',
      sanskritExcerpt: null,
      translationExcerpt:
        'Budhaditya Yoga is most effective when Mercury is not combust and both planets are in kendra or trikona houses. When Mercury is combust, the yoga\'s results are significantly diminished.',
      relevanceNote:
        'Combustion of Mercury weakens this yoga — check Sun-Mercury distance.',
    },
  ],

  'saraswati yoga': [
    {
      textName: 'BPHS',
      textFullName: 'Brihat Parashara Hora Shastra',
      chapter: 36,
      verseRange: '30-32',
      sanskritExcerpt: null,
      translationExcerpt:
        'When Jupiter, Venus, and Mercury occupy kendra, trikona, or the 2nd house, and Jupiter is in own, exalted, or friendly sign, Saraswati Yoga is formed. The native is learned in all sciences, a poet, skilled in arts, and renowned worldwide.',
      relevanceNote:
        'Jupiter + Venus + Mercury in kendra/trikona/2nd with Jupiter strong.',
    },
  ],

  'chamara yoga': [
    {
      textName: 'BPHS',
      textFullName: 'Brihat Parashara Hora Shastra',
      chapter: 36,
      verseRange: '33-34',
      sanskritExcerpt: null,
      translationExcerpt:
        'When the Lagna lord is exalted and placed in a kendra house, aspected by Jupiter, Chamara Yoga is formed. The native will be a king, learned, long-lived, and eloquent.',
      relevanceNote:
        'Lagna lord exalted in kendra + Jupiter aspect.',
    },
  ],

  'adhi yoga': [
    {
      textName: 'BPHS',
      textFullName: 'Brihat Parashara Hora Shastra',
      chapter: 36,
      verseRange: '15-17',
      sanskritExcerpt: null,
      translationExcerpt:
        'When benefic planets occupy the 6th, 7th, and 8th houses from the Moon, Adhi Yoga is formed. The native will be a polite, trustworthy minister or king, will vanquish enemies, and be long-lived.',
      relevanceNote:
        'Benefics in 6th, 7th, 8th from Moon — leads to political/administrative power.',
    },
  ],

  'chatussagara yoga': [
    {
      textName: 'Phaladeepika',
      textFullName: 'Phaladeepika by Mantreshwara',
      chapter: 6,
      verseRange: '30-31',
      sanskritExcerpt: null,
      translationExcerpt:
        'When all four kendra houses (1, 4, 7, 10) are occupied by planets, Chatussagara Yoga (Four Oceans) is formed. The native is equal to a king, renowned, long-lived, and his fame spreads across the four seas.',
      relevanceNote:
        'All four kendras must have at least one planet each.',
    },
  ],

  'rajalakshana yoga': [
    {
      textName: 'Phaladeepika',
      textFullName: 'Phaladeepika by Mantreshwara',
      chapter: 6,
      verseRange: '32-33',
      sanskritExcerpt: null,
      translationExcerpt:
        'When the Lagna lord and the 9th lord are in mutual kendras, and the 2nd lord is also strong, Rajalakshana Yoga gives royal traits, noble bearing, and inherent leadership qualities.',
      relevanceNote:
        'Lagna lord and 9th lord in mutual kendra — signs of natural royalty.',
    },
  ],

  'mahabhagya yoga': [
    {
      textName: 'BPHS',
      textFullName: 'Brihat Parashara Hora Shastra',
      chapter: 36,
      verseRange: '35-37',
      sanskritExcerpt: null,
      translationExcerpt:
        'For a male native: if birth is during daytime, and the Sun, Moon, and Lagna are all in odd signs — Mahabhagya Yoga is formed. For a female: night birth with Sun, Moon, and Lagna in even signs. The native is of great fortune, long-lived, and a leader.',
      relevanceNote:
        'Check lagna SIGN (not lagna lord\'s sign), Sun sign, Moon sign — all odd for male day birth, all even for female night birth.',
    },
  ],

  'pushkala yoga': [
    {
      textName: 'Phaladeepika',
      textFullName: 'Phaladeepika by Mantreshwara',
      chapter: 6,
      verseRange: '35-36',
      sanskritExcerpt: null,
      translationExcerpt:
        'When the Lagna lord and the Moon sign lord are in mutual aspect or conjunction, and a benefic is in the Lagna, Pushkala Yoga is formed. The native is wealthy, famous, and commands respect from rulers.',
      relevanceNote:
        'Lagna lord + Moon sign lord in mutual aspect/conjunction + benefic in Lagna.',
    },
  ],

  // =========================================================================
  // Inauspicious / Dosha Yogas
  // =========================================================================

  'guru chandal yoga': [
    {
      textName: 'BPHS',
      textFullName: 'Brihat Parashara Hora Shastra',
      chapter: 36,
      verseRange: '40-42',
      sanskritExcerpt: null,
      translationExcerpt:
        'When Jupiter is conjoined with or aspected by Rahu or Ketu, Guru Chandala Yoga is formed. The native acts against tradition, defies teachers and elders, behaves unethically, and may face punishment from authorities.',
      relevanceNote:
        'Jupiter with Rahu/Ketu — "teacher-outcast" combination. Disrupts guru-shishya (teacher-student) relationships.',
    },
    {
      textName: 'Saravali',
      textFullName: 'Saravali by Kalyana Varma',
      chapter: 40,
      verseRange: '12-13',
      sanskritExcerpt: null,
      translationExcerpt:
        'Jupiter afflicted by the nodes produces a person who challenges orthodoxy. In modern context, may indicate an unconventional spiritual path or reform-minded approach to religion.',
      relevanceNote:
        'Classical inauspicious but modern interpretations note innovation and non-conformist wisdom.',
    },
  ],

  'grahan yoga': [
    {
      textName: 'BPHS',
      textFullName: 'Brihat Parashara Hora Shastra',
      chapter: 36,
      verseRange: '43-45',
      sanskritExcerpt: null,
      translationExcerpt:
        'When the Sun or Moon is conjoined with Rahu or Ketu, Grahan (Eclipse) Yoga is formed. The native suffers from health issues related to the afflicted luminary, faces obstacles in career (Sun) or mental peace (Moon), and may have a troubled relationship with father (Sun) or mother (Moon).',
      relevanceNote:
        'Sun/Moon with Rahu = partial Grahan; Sun/Moon with Ketu = more karmic. Degree proximity matters.',
    },
  ],

  'daridra yoga': [
    {
      textName: 'BPHS',
      textFullName: 'Brihat Parashara Hora Shastra',
      chapter: 42,
      verseRange: '10-12',
      sanskritExcerpt: null,
      translationExcerpt:
        'When the lord of the 11th house is placed in the 6th, 8th, or 12th house, Daridra Yoga is formed. The native faces poverty, financial losses through debts, enemies, or expenditure, and struggles to accumulate wealth.',
      relevanceNote:
        '11th lord (house of gains) in dusthana (loss houses) — directly obstructs income.',
    },
  ],

  'angarak yoga': [
    {
      textName: 'BPHS',
      textFullName: 'Brihat Parashara Hora Shastra',
      chapter: 36,
      verseRange: '46-47',
      sanskritExcerpt: null,
      translationExcerpt:
        'When Mars is conjoined with Rahu, Angarak Yoga is formed. The native faces accidents, surgical interventions, sudden conflicts, and explosive temperament. However, this also grants extraordinary courage and ability to overcome seemingly impossible odds.',
      relevanceNote:
        'Mars-Rahu conjunction — "burning coal" yoga. Amplifies Mars energy unpredictably.',
    },
  ],

  'pitra dosha': [
    {
      textName: 'BPHS',
      textFullName: 'Brihat Parashara Hora Shastra',
      chapter: 36,
      verseRange: '50-52',
      sanskritExcerpt: null,
      translationExcerpt:
        'When the Sun is conjoined with Rahu or Ketu in the 1st, 5th, or 9th house, or when the 9th lord is afflicted by nodes, Pitru Dosha is indicated. The native faces obstacles in progeny, strained relationship with father, and ancestral karmic debts.',
      relevanceNote:
        'Sun + Rahu/Ketu in specific houses, or 9th lord affliction — ancestral karma.',
    },
  ],

  'shrapit dosha': [
    {
      textName: 'BPHS',
      textFullName: 'Brihat Parashara Hora Shastra',
      chapter: 36,
      verseRange: '53-54',
      sanskritExcerpt: null,
      translationExcerpt:
        'When Saturn and Rahu are conjoined, Shrapit Dosha is formed, indicating past-life curses. The native experiences chronic delays, persistent anxiety, fear of authority, and obstacles in all undertakings until the karmic debt is resolved.',
      relevanceNote:
        'Saturn-Rahu conjunction — "cursed" combination. Slow, grinding karmic difficulties.',
    },
  ],

  // Also keyed as the variant name in yogas-complete.ts
  'shani-rahu yoga': [
    {
      textName: 'BPHS',
      textFullName: 'Brihat Parashara Hora Shastra',
      chapter: 36,
      verseRange: '53-54',
      sanskritExcerpt: null,
      translationExcerpt:
        'When Saturn and Rahu are conjoined, past-life karmic debts manifest as chronic delays, fear, and anxiety. However, intense perseverance and eventual breakthrough after the Saturn maturity age of 36.',
      relevanceNote:
        'Saturn-Rahu conjunction — variant name for Shrapit Dosha.',
    },
  ],

  'kendradhipati dosha': [
    {
      textName: 'BPHS',
      textFullName: 'Brihat Parashara Hora Shastra',
      chapter: 34,
      verseRange: '1-5',
      sanskritExcerpt: null,
      translationExcerpt:
        'Natural benefics (Jupiter, Venus, Mercury, Moon) owning kendra houses lose their benefic nature and become neutral or even harmful for the native. They do not produce Raja Yoga on their own, and their dasha periods may not yield expected good results.',
      relevanceNote:
        'Benefics owning kendras (1, 4, 7, 10) lose their natural beneficence — Parashara\'s functional malefic rule.',
    },
  ],

  // =========================================================================
  // Additional Sun-Based Yogas
  // =========================================================================

  'veshi yoga': [
    {
      textName: 'BPHS',
      textFullName: 'Brihat Parashara Hora Shastra',
      chapter: 25,
      verseRange: '1-3',
      sanskritExcerpt: null,
      translationExcerpt:
        'When any planet (other than Moon) occupies the 2nd house from the Sun, Veshi Yoga is formed. The native is truthful, lazy but eloquent, and has a balanced temperament.',
      relevanceNote:
        'Planet in 2nd from Sun — the result varies by which planet occupies the 2nd.',
    },
  ],

  'vasi yoga': [
    {
      textName: 'BPHS',
      textFullName: 'Brihat Parashara Hora Shastra',
      chapter: 25,
      verseRange: '4-6',
      sanskritExcerpt: null,
      translationExcerpt:
        'When any planet (other than Moon) occupies the 12th house from the Sun, Vasi Yoga is formed. The native is charitable, powerful, prosperous, and favored by those in authority.',
      relevanceNote:
        'Planet in 12th from Sun — complements Veshi (2nd from Sun).',
    },
  ],

  'obhayachari yoga': [
    {
      textName: 'BPHS',
      textFullName: 'Brihat Parashara Hora Shastra',
      chapter: 25,
      verseRange: '7-9',
      sanskritExcerpt: null,
      translationExcerpt:
        'When planets (other than Moon) occupy both the 2nd and 12th houses from the Sun, Ubhayachari (Obhayachari) Yoga is formed. The native is a king or equal to one, eloquent, attractive, and enjoys all comforts.',
      relevanceNote:
        'Planets flanking the Sun on both sides — combines Veshi + Vasi.',
    },
  ],

  // =========================================================================
  // Nabhasa / Pattern Yogas
  // =========================================================================

  'graha malika yoga': [
    {
      textName: 'BPHS',
      textFullName: 'Brihat Parashara Hora Shastra',
      chapter: 35,
      verseRange: '10-14',
      sanskritExcerpt: null,
      translationExcerpt:
        'When all seven planets (Sun through Saturn) occupy consecutive houses forming an unbroken chain (garland), Graha Malika Yoga is formed. The result depends on the starting house — if from a kendra, the native becomes a ruler; from a trikona, wealthy and virtuous.',
      relevanceNote:
        'Planets in consecutive houses without gaps — "planetary garland."',
    },
  ],

  // =========================================================================
  // Longevity Yogas
  // =========================================================================

  'balarishta yoga': [
    {
      textName: 'BPHS',
      textFullName: 'Brihat Parashara Hora Shastra',
      chapter: 8,
      verseRange: '1-8',
      sanskritExcerpt: null,
      translationExcerpt:
        'When malefics occupy kendras and trikonas with no benefic aspect, and the Moon is weak and afflicted, Balarishta Yoga indicates childhood difficulties. The severity depends on the number and strength of afflictions.',
      relevanceNote:
        'Childhood health/longevity concern — check Moon strength and benefic aspects for cancellation.',
    },
  ],

  // =========================================================================
  // Miscellaneous
  // =========================================================================

  'pravrajya yoga': [
    {
      textName: 'BPHS',
      textFullName: 'Brihat Parashara Hora Shastra',
      chapter: 77,
      verseRange: '1-5',
      sanskritExcerpt: null,
      translationExcerpt:
        'When four or more planets conjoin in a single house, or when Saturn aspects the Moon without any other benefic influence, Pravrajya Yoga may form. The native renounces worldly life and takes to asceticism or monastic living.',
      relevanceNote:
        'Renunciation yoga — strong detachment from material world.',
    },
  ],

  'mangala dosha': [
    {
      textName: 'BPHS',
      textFullName: 'Brihat Parashara Hora Shastra',
      chapter: 77,
      verseRange: '30-38',
      sanskritExcerpt: null,
      translationExcerpt:
        'Mars placed in houses 1, 2, 4, 7, 8, or 12 from the Lagna creates Mangala Dosha (Kuja Dosha). It affects marital harmony, causing conflicts, separation, or delayed marriage. Cancellation occurs when Mars is in own/exalted sign, Jupiter aspects Mars or the 7th house, or both partners are Manglik.',
      relevanceNote:
        'Most widely checked dosha for marriage compatibility. Multiple cancellation conditions exist.',
    },
  ],

  'gauri yoga': [
    {
      textName: 'Phaladeepika',
      textFullName: 'Phaladeepika by Mantreshwara',
      chapter: 6,
      verseRange: '40-41',
      sanskritExcerpt: null,
      translationExcerpt:
        'When the Lagna lord aspects Jupiter and Moon in the 9th house, or when Jupiter is in a trikona from Moon aspecting the Lagna, Gauri Yoga is formed. The native comes from a noble family and is devoted to righteous acts.',
      relevanceNote:
        'Aspect direction matters — Jupiter must aspect FROM its position toward the target, not the reverse.',
    },
  ],

  'bharati yoga': [
    {
      textName: 'Saravali',
      textFullName: 'Saravali by Kalyana Varma',
      chapter: 37,
      verseRange: '5-7',
      sanskritExcerpt: null,
      translationExcerpt:
        'When the lord of the navamsa occupied by the 2nd lord is exalted and conjoins with the 5th lord, Bharati Yoga is formed. The native is a celebrated scholar, a master of multiple arts, and famed across regions.',
      relevanceNote:
        'Navamsa-linked yoga — indicates scholarship and artistic mastery.',
    },
  ],

  'shankha yoga': [
    {
      textName: 'BPHS',
      textFullName: 'Brihat Parashara Hora Shastra',
      chapter: 36,
      verseRange: '50-51',
      sanskritExcerpt: null,
      translationExcerpt:
        'When the lords of the 5th and 6th houses are in mutual kendras, and the Lagna lord is strong, Shankha Yoga is formed. The native is fond of charitable acts, enjoys comforts, is learned, and lives a long life.',
      relevanceNote:
        '5th and 6th lords in mutual kendras + strong Lagna lord.',
    },
  ],

  'bheri yoga': [
    {
      textName: 'BPHS',
      textFullName: 'Brihat Parashara Hora Shastra',
      chapter: 36,
      verseRange: '52-53',
      sanskritExcerpt: null,
      translationExcerpt:
        'When the Lagna lord, Jupiter, and Venus are in mutual kendras, and the 9th lord is strong, Bheri Yoga is formed. The native is religious, powerful, has many servants, and is renowned.',
      relevanceNote:
        'Lagna lord + Jupiter + Venus in mutual kendras + strong 9th lord.',
    },
  ],
};
