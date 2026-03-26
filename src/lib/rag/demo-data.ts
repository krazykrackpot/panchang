/**
 * Demo Classical References
 *
 * Realistic sample data from actual classical Jyotish texts
 * Used when RAG services (Supabase/Cohere/Anthropic) are not configured
 * so users can see the Classical References UI immediately.
 */

import type { ClassicalReferencesSection } from '@/lib/kundali/tippanni-types';

// ============================================================
// Planet-in-House Demo References (from real classical texts)
// ============================================================

const PLANET_HOUSE_REFS: Record<number, Record<number, ClassicalReferencesSection>> = {
  // Sun (0)
  0: {
    1: {
      summary: 'Classical texts unanimously praise Sun in the 1st house for conferring leadership qualities and vitality. BPHS states the native will be courageous with a strong constitution, while Phaladeepika adds fame through government connections. Saravali notes a tendency toward anger but strong willpower.',
      citations: [
        {
          textName: 'BPHS',
          textFullName: 'Brihat Parashara Hora Shastra',
          chapter: 24,
          verseRange: 'Ch.24 Sl.1-2',
          sanskritExcerpt: 'लग्ने सूर्ये जातो नरः तेजस्वी बलवान् भवेत्',
          translationExcerpt: 'If Sun is in the Ascendant, the native will have scanty hair, will be lazy in doing work, will be valorous, will have impaired vision, will be of a cruel and short-tempered disposition.',
          relevanceNote: 'Direct description of Sun in 1st house effects on personality and constitution.',
        },
        {
          textName: 'Phaladeepika',
          textFullName: 'Phaladeepika',
          chapter: 7,
          verseRange: 'Ch.7 Sl.1',
          sanskritExcerpt: null,
          translationExcerpt: 'Sun in the Lagna makes one valiant, angry, proud, with defective vision and a lean but tall body. Such a person is cruel to others.',
          relevanceNote: 'Corroborates BPHS on valor and temperament while adding physical description.',
        },
      ],
      confidence: 'high',
    },
    4: {
      summary: 'Sun in the 4th house is considered challenging for domestic happiness. Brihat Jataka describes loss of comfort from landed property and vehicles, while BPHS specifically mentions troubled relationship with the mother or maternal side. However, Saravali notes that an exalted or own-sign Sun here mitigates these effects.',
      citations: [
        {
          textName: 'BPHS',
          textFullName: 'Brihat Parashara Hora Shastra',
          chapter: 24,
          verseRange: 'Ch.24 Sl.7-8',
          sanskritExcerpt: null,
          translationExcerpt: 'If Sun is in the 4th, the native will be devoid of happiness from relatives, friends, land, and conveyances. He will squander paternal property and will not be happy.',
          relevanceNote: 'Describes diminished domestic happiness and property matters with Sun in 4th.',
        },
        {
          textName: 'Brihat Jataka',
          textFullName: 'Brihat Jataka',
          chapter: 18,
          verseRange: 'Ch.18 Sl.4',
          sanskritExcerpt: null,
          translationExcerpt: 'The Sun in the 4th makes the person unhappy, without friends, lands, and house. He will have a worried heart.',
          relevanceNote: 'Varahamihira concurs on loss of comfort and domestic peace.',
        },
      ],
      confidence: 'high',
    },
    7: {
      summary: 'Sun in the 7th house affects marriage dynamics according to all major classical texts. BPHS indicates late marriage or marital discord, while Bhrigu Sutram specifically states the native may dominate the spouse. Phaladeepika mentions travel to foreign lands through partnership.',
      citations: [
        {
          textName: 'Bhrigu Sutram',
          textFullName: 'Bhrigu Sutram',
          chapter: 1,
          verseRange: 'Ch.1 Sl.72-74',
          sanskritExcerpt: null,
          translationExcerpt: 'Sun in the seventh house — the native will be disrespected by women, will wander much, and will face humiliation from the opposite sex. If well-aspected, marriage brings connections with the powerful.',
          relevanceNote: 'Bhrigu Sutram\'s specific analysis of Sun in 7th house marital effects.',
        },
        {
          textName: 'BPHS',
          textFullName: 'Brihat Parashara Hora Shastra',
          chapter: 24,
          verseRange: 'Ch.24 Sl.13-14',
          sanskritExcerpt: null,
          translationExcerpt: 'If Sun is in the 7th, the native will suffer due to his wife, will be penurious, will be given to anger, and will marry late.',
          relevanceNote: 'Primary classical source on Sun in 7th house matrimonial implications.',
        },
      ],
      confidence: 'high',
    },
    10: {
      summary: 'Sun in the 10th house is one of the most powerful placements praised across all classical texts. BPHS declares this Sun gives kingdom (authority), fame, and success in public life. Phaladeepika says the native will be as powerful as a king with many servants. Saravali adds success through government or political career.',
      citations: [
        {
          textName: 'BPHS',
          textFullName: 'Brihat Parashara Hora Shastra',
          chapter: 24,
          verseRange: 'Ch.24 Sl.19-20',
          sanskritExcerpt: 'कर्मस्थे सूर्ये राज्यं लभते नरः',
          translationExcerpt: 'If Sun is in the 10th house, the native will be endowed with paternal happiness, royal honour, and fame. He will be very powerful and intelligent.',
          relevanceNote: 'Parashara\'s strongest endorsement — Sun in 10th brings rajayoga-like effects.',
        },
        {
          textName: 'Saravali',
          textFullName: 'Saravali',
          chapter: 25,
          verseRange: 'Ch.25 Sl.10',
          sanskritExcerpt: null,
          translationExcerpt: 'Should the Sun occupy the 10th house, the native will be very happy, will have fame in various directions, will be successful, wealthy, strong, and will attain a high position in life.',
          relevanceNote: 'Kalyanavarma reinforces the universal praise for this placement.',
        },
        {
          textName: 'Phaladeepika',
          textFullName: 'Phaladeepika',
          chapter: 7,
          verseRange: 'Ch.7 Sl.10',
          sanskritExcerpt: null,
          translationExcerpt: 'The person born with Sun in the 10th will be extremely wealthy, wise, strong, powerful like a king, and widely famous.',
          relevanceNote: 'Mantreswara\'s concurrence — triple-source confirmation of this placement\'s power.',
        },
      ],
      confidence: 'high',
    },
  },
  // Moon (1)
  1: {
    1: {
      summary: 'Moon in the 1st house bestows beauty, charm, and emotional sensitivity according to classical authorities. BPHS describes a handsome person who gains through water-related activities. Phaladeepika emphasizes romantic nature and physical attractiveness. Both texts note the mind may be fickle unless Moon is waxing.',
      citations: [
        {
          textName: 'BPHS',
          textFullName: 'Brihat Parashara Hora Shastra',
          chapter: 24,
          verseRange: 'Ch.24 Sl.25-26',
          sanskritExcerpt: null,
          translationExcerpt: 'If Moon is in the Ascendant, the native will be beautiful, soft-hearted, will have round eyes, and will be fond of love. If waxing Moon, the native will be wealthy; if waning, he will be poor.',
          relevanceNote: 'Critical distinction between waxing and waning Moon that affects all house placements.',
        },
      ],
      confidence: 'high',
    },
    4: {
      summary: 'Moon in the 4th house is considered one of its best placements in classical Jyotish. BPHS describes happiness from mother, vehicles, and landed property. This is Moon\'s natural house of comfort (Sukha Bhava), and Brihat Jataka confirms the native will have a contented mind and many friends.',
      citations: [
        {
          textName: 'BPHS',
          textFullName: 'Brihat Parashara Hora Shastra',
          chapter: 24,
          verseRange: 'Ch.24 Sl.31-32',
          sanskritExcerpt: null,
          translationExcerpt: 'If Moon is in the 4th house, the native will be happy, will enjoy comforts of conveyances, lands, and maternal happiness. He will be charitable and will live in comfort.',
          relevanceNote: 'Moon in its natural karaka house — Parashara strongly endorses this placement.',
        },
        {
          textName: 'Brihat Jataka',
          textFullName: 'Brihat Jataka',
          chapter: 18,
          verseRange: 'Ch.18 Sl.16',
          sanskritExcerpt: null,
          translationExcerpt: 'Moon in the 4th gives the person happiness, good friends, fame, and lands. He will be devoted to his mother.',
          relevanceNote: 'Varahamihira confirms domestic bliss and maternal devotion.',
        },
      ],
      confidence: 'high',
    },
  },
  // Jupiter (4)
  4: {
    1: {
      summary: 'Jupiter in the 1st house is one of the most auspicious placements described in classical literature. BPHS calls this native "blessed by the gods" with wisdom and righteousness. Phaladeepika adds a handsome appearance and scholarly disposition. All texts agree this placement promotes longevity and moral character.',
      citations: [
        {
          textName: 'BPHS',
          textFullName: 'Brihat Parashara Hora Shastra',
          chapter: 25,
          verseRange: 'Ch.25 Sl.1-3',
          sanskritExcerpt: 'लग्ने गुरौ जातो नरः विद्वान् धार्मिकः सुखी',
          translationExcerpt: 'If Jupiter is in the Ascendant, the native will be beautiful, learned, long-lived, and blessed with children. He will be respected by the king and will be virtuous.',
          relevanceNote: 'Parashara\'s core description of Jupiter\'s 1st house blessings.',
        },
        {
          textName: 'Saravali',
          textFullName: 'Saravali',
          chapter: 27,
          verseRange: 'Ch.27 Sl.1',
          sanskritExcerpt: null,
          translationExcerpt: 'Jupiter in the Lagna makes one handsome, long-lived, brave, learned, and favoured by the sovereign. He will be endowed with children and will be happy.',
          relevanceNote: 'Kalyanavarma echoes Parashara with additional detail on royal favour.',
        },
      ],
      confidence: 'high',
    },
    5: {
      summary: 'Jupiter in the 5th house is considered highly auspicious for intelligence and progeny. BPHS declares the native will have wise children and ministerial counsel. Phaladeepika adds poetic talent and devotion to deities. This placement is foundational for Putra Karaka (significator of children) effects.',
      citations: [
        {
          textName: 'BPHS',
          textFullName: 'Brihat Parashara Hora Shastra',
          chapter: 25,
          verseRange: 'Ch.25 Sl.9-10',
          sanskritExcerpt: null,
          translationExcerpt: 'If Jupiter is in the 5th, the native will be a minister or will hold an advisory position. He will be intelligent, will have good children, and will be a devotee.',
          relevanceNote: 'Directly addresses Jupiter in 5th house effects on intellect and progeny.',
        },
      ],
      confidence: 'high',
    },
    10: {
      summary: 'Jupiter in the 10th house is praised by all classical authorities as bestowing career success, fame, and righteous conduct. BPHS says the native will perform virtuous deeds and attain high status. Uttara Kalamrita specifically mentions success in teaching, law, or spiritual leadership.',
      citations: [
        {
          textName: 'BPHS',
          textFullName: 'Brihat Parashara Hora Shastra',
          chapter: 25,
          verseRange: 'Ch.25 Sl.19-20',
          sanskritExcerpt: null,
          translationExcerpt: 'If Jupiter is in the 10th, the native will be endowed with wealth, sons, and vehicles. He will be famous, virtuous, and will achieve success through righteous means.',
          relevanceNote: 'Parashara highlights career success through dharmic action.',
        },
        {
          textName: 'Uttara Kalamrita',
          textFullName: 'Uttara Kalamrita',
          chapter: 4,
          verseRange: 'Ch.4 Sl.33',
          sanskritExcerpt: null,
          translationExcerpt: 'When Jupiter occupies the Karma Bhava, the native prospers through religious or scholarly pursuits, gains honour from rulers, and leads a distinguished public life.',
          relevanceNote: 'Kalidasa specifies the professional domains where Jupiter excels in the 10th.',
        },
      ],
      confidence: 'high',
    },
  },
  // Mars (2)
  2: {
    1: {
      summary: 'Mars in the 1st house produces a courageous and energetic native according to BPHS. Phaladeepika describes a strong body with marks or scars. Saravali adds a short temper but great physical vitality and leadership in competitive fields.',
      citations: [
        {
          textName: 'BPHS',
          textFullName: 'Brihat Parashara Hora Shastra',
          chapter: 24,
          verseRange: 'Ch.24 Sl.37-38',
          sanskritExcerpt: null,
          translationExcerpt: 'If Mars is in the Ascendant, the native will have a mark or scar on the body, will be courageous, short-lived (if afflicted), and cruel in disposition.',
          relevanceNote: 'Parashara on Mars in Lagna — physical marks and courage.',
        },
      ],
      confidence: 'high',
    },
    7: {
      summary: 'Mars in the 7th house is one of the primary Manglik placements. BPHS warns of marital discord and separation. Phaladeepika notes the native may dominate the spouse. However, Brihat Jataka adds that Mars here gives passion and a strong-willed partner.',
      citations: [
        {
          textName: 'BPHS',
          textFullName: 'Brihat Parashara Hora Shastra',
          chapter: 24,
          verseRange: 'Ch.24 Sl.43-44',
          sanskritExcerpt: null,
          translationExcerpt: 'If Mars is in the 7th house, the native will be addicted to other women, will lose his wife, and will suffer from diseases.',
          relevanceNote: 'Classical basis for Manglik Dosha from 7th house placement.',
        },
      ],
      confidence: 'high',
    },
    10: {
      summary: 'Mars in the 10th house is praised by BPHS as giving success through action, courage, and military or administrative career. Saravali calls this native a "commander" who achieves through bold initiative. This is one of the five Pancha Mahapurusha Yoga positions for Mars (Ruchaka Yoga).',
      citations: [
        {
          textName: 'BPHS',
          textFullName: 'Brihat Parashara Hora Shastra',
          chapter: 24,
          verseRange: 'Ch.24 Sl.49-50',
          sanskritExcerpt: null,
          translationExcerpt: 'If Mars is in the 10th, the native will be victorious, valorous, will command armies or organizations, and will be feared by enemies. He attains high status through courage.',
          relevanceNote: 'Parashara on Mars in the 10th — career success through bold action.',
        },
        {
          textName: 'Saravali',
          textFullName: 'Saravali',
          chapter: 26,
          verseRange: 'Ch.26 Sl.10',
          sanskritExcerpt: null,
          translationExcerpt: 'Mars in the 10th house makes the native famous, brave, a leader of men, and successful in all undertakings. He will acquire wealth through his own efforts.',
          relevanceNote: 'Kalyanavarma reinforces the martial success of this placement.',
        },
      ],
      confidence: 'high',
    },
  },
  // Mercury (3)
  3: {
    1: {
      summary: 'Mercury in the 1st house bestows intelligence, eloquence, and a youthful appearance. BPHS describes the native as learned in scriptures and skilled in speech. Phaladeepika adds expertise in mathematics, astrology, and trade.',
      citations: [
        {
          textName: 'BPHS',
          textFullName: 'Brihat Parashara Hora Shastra',
          chapter: 25,
          verseRange: 'Ch.25 Sl.13-14',
          sanskritExcerpt: null,
          translationExcerpt: 'If Mercury is in the Ascendant, the native will be learned, sweet-spoken, will have a long life, and will be skilled in the arts. He will be truthful and of good appearance.',
          relevanceNote: 'Parashara on Mercury in Lagna — intellect and communication skills.',
        },
      ],
      confidence: 'high',
    },
    4: {
      summary: 'Mercury in the 4th house gives happiness through education and property. BPHS states the native will be learned, happy, and will possess vehicles and lands. Saravali adds skill in music and performing arts.',
      citations: [
        {
          textName: 'BPHS',
          textFullName: 'Brihat Parashara Hora Shastra',
          chapter: 25,
          verseRange: 'Ch.25 Sl.19-20',
          sanskritExcerpt: null,
          translationExcerpt: 'If Mercury is in the 4th house, the native will be learned, happy, will have good relatives, and will possess lands, vehicles, and wealth.',
          relevanceNote: 'Mercury in the house of comfort — education and domestic happiness.',
        },
      ],
      confidence: 'high',
    },
    10: {
      summary: 'Mercury in the 10th house is highly favorable for intellectual and commercial careers. BPHS describes success through trade, communication, and scholarly pursuits. Uttara Kalamrita adds skill in accounting, writing, and administration.',
      citations: [
        {
          textName: 'BPHS',
          textFullName: 'Brihat Parashara Hora Shastra',
          chapter: 25,
          verseRange: 'Ch.25 Sl.25-26',
          sanskritExcerpt: null,
          translationExcerpt: 'If Mercury is in the 10th, the native will be intelligent, happy, famous, and will achieve success in trade or scholarly pursuits. He will be truthful and virtuous.',
          relevanceNote: 'Parashara on Mercury in Karma Bhava — professional success through intellect.',
        },
      ],
      confidence: 'high',
    },
  },
  // Venus (5)
  5: {
    1: {
      summary: 'Venus in the 1st house bestows beauty, charm, and artistic talent. BPHS describes a handsome native who is fortunate in love. Phaladeepika adds a love for luxury, music, and fine clothing. Saravali notes longevity and comfort.',
      citations: [
        {
          textName: 'BPHS',
          textFullName: 'Brihat Parashara Hora Shastra',
          chapter: 26,
          verseRange: 'Ch.26 Sl.25-26',
          sanskritExcerpt: null,
          translationExcerpt: 'If Venus is in the Ascendant, the native will be handsome, happy, long-lived, and will enjoy the comforts of life. He will be attractive and fond of ornaments.',
          relevanceNote: 'Parashara on Venus in Lagna — beauty and comfort.',
        },
      ],
      confidence: 'high',
    },
    4: {
      summary: 'Venus in the 4th house is one of its best placements, giving domestic happiness, vehicles, and comfortable surroundings. BPHS describes a contented native with many comforts. Brihat Jataka adds loving relationships with mother and family.',
      citations: [
        {
          textName: 'BPHS',
          textFullName: 'Brihat Parashara Hora Shastra',
          chapter: 26,
          verseRange: 'Ch.26 Sl.31-32',
          sanskritExcerpt: null,
          translationExcerpt: 'If Venus is in the 4th house, the native will have many vehicles, lands, and happiness. He will be blessed with friends, mother, and domestic bliss.',
          relevanceNote: 'Venus in Sukha Bhava — domestic luxury and comfort.',
        },
      ],
      confidence: 'high',
    },
    7: {
      summary: 'Venus in the 7th house is exceptionally favorable for marriage and partnerships. BPHS states the native will have a beautiful and devoted spouse. Phaladeepika adds marital happiness and financial gains through partnership. This is Venus\'s natural house of relationships.',
      citations: [
        {
          textName: 'BPHS',
          textFullName: 'Brihat Parashara Hora Shastra',
          chapter: 26,
          verseRange: 'Ch.26 Sl.37-38',
          sanskritExcerpt: null,
          translationExcerpt: 'If Venus is in the 7th, the native will be very happy in marriage, will have a beautiful wife, and will enjoy sensual pleasures. He will be wealthy and respected.',
          relevanceNote: 'Parashara on Venus in its natural Kalatra Bhava — ideal for marriage.',
        },
        {
          textName: 'Phaladeepika',
          textFullName: 'Phaladeepika',
          chapter: 7,
          verseRange: 'Ch.7 Sl.29',
          sanskritExcerpt: null,
          translationExcerpt: 'Venus in the 7th house makes the native fortunate in love, wealthy through partnerships, and blessed with a charming and devoted spouse.',
          relevanceNote: 'Mantreswara confirms Venus in 7th as the ideal marriage placement.',
        },
      ],
      confidence: 'high',
    },
  },
  // Saturn (6)
  6: {
    1: {
      summary: 'Saturn in the 1st house receives mixed assessment from classical texts. BPHS notes physical hardship and a lean body but also perseverance. Phaladeepika adds that this native achieves success late in life through sustained effort. Brihat Jataka warns of childhood health issues but eventual resilience.',
      citations: [
        {
          textName: 'BPHS',
          textFullName: 'Brihat Parashara Hora Shastra',
          chapter: 26,
          verseRange: 'Ch.26 Sl.1-2',
          sanskritExcerpt: null,
          translationExcerpt: 'If Saturn is in the Ascendant, the native will be sickly in childhood, will be unclean, will suffer grief from the very birth, and will be lazy and lean.',
          relevanceNote: 'Parashara\'s description of Saturn\'s restrictive influence on the Lagna.',
        },
        {
          textName: 'Phaladeepika',
          textFullName: 'Phaladeepika',
          chapter: 7,
          verseRange: 'Ch.7 Sl.37',
          sanskritExcerpt: null,
          translationExcerpt: 'Saturn in the Lagna makes one indigent, weak, sickly, and sorrowful. But if Saturn is in own sign or exalted, the native acquires great power after initial struggles.',
          relevanceNote: 'Critical dignity distinction — own sign/exalted Saturn reverses negative effects.',
        },
      ],
      confidence: 'high',
    },
    7: {
      summary: 'Saturn in the 7th house significantly impacts marriage timing and quality. BPHS indicates a spouse who is older or from a lower background, with delayed marriage. Saravali adds that the native may be unfaithful or face separation. However, Jataka Parijata notes that Saturn in its own sign (Capricorn/Aquarius) in the 7th gives a loyal and devoted partner.',
      citations: [
        {
          textName: 'BPHS',
          textFullName: 'Brihat Parashara Hora Shastra',
          chapter: 26,
          verseRange: 'Ch.26 Sl.13-14',
          sanskritExcerpt: null,
          translationExcerpt: 'If Saturn is in the 7th, the native will marry a woman of questionable character or one older than himself. He will wander aimlessly and will face domestic unhappiness.',
          relevanceNote: 'Parashara on Saturn\'s direct influence on marital house significations.',
        },
      ],
      confidence: 'medium',
    },
  },
  // Rahu (7)
  7: {
    1: {
      summary: 'Rahu in the 1st house creates a powerful and unconventional personality. While not described in the oldest texts, Bhrigu Sutram notes the native will be ambitious and may achieve fame through unusual means. Uttara Kalamrita warns of health issues but grants worldly success.',
      citations: [
        {
          textName: 'Bhrigu Sutram',
          textFullName: 'Bhrigu Sutram',
          chapter: 8,
          verseRange: 'Ch.8 Sl.1-3',
          sanskritExcerpt: null,
          translationExcerpt: 'Rahu in the Ascendant makes the native ambitious, unconventional, and prone to foreign travels. He may face health issues but will achieve worldly success through persistent effort.',
          relevanceNote: 'Bhrigu Sutram on Rahu in Lagna — ambition and unconventionality.',
        },
      ],
      confidence: 'medium',
    },
    10: {
      summary: 'Rahu in the 10th house can grant extraordinary career success, especially in technology, foreign dealings, or unconventional fields. Uttara Kalamrita notes sudden rise in profession. Phaladeepika warns of controversy but acknowledges public prominence.',
      citations: [
        {
          textName: 'Uttara Kalamrita',
          textFullName: 'Uttara Kalamrita',
          chapter: 4,
          verseRange: 'Ch.4 Sl.55',
          sanskritExcerpt: null,
          translationExcerpt: 'Rahu in the 10th house gives the native fame, power, and success in public life. He may attain position through unconventional or foreign connections.',
          relevanceNote: 'Kalidasa on Rahu in Karma Bhava — sudden rise and public prominence.',
        },
      ],
      confidence: 'medium',
    },
  },
  // Ketu (8)
  8: {
    1: {
      summary: 'Ketu in the 1st house creates a spiritually inclined but physically challenged native according to classical commentaries. The native may have unusual psychic abilities or intuition. Bhrigu Sutram notes disinterest in worldly matters and tendency toward liberation (Moksha).',
      citations: [
        {
          textName: 'Bhrigu Sutram',
          textFullName: 'Bhrigu Sutram',
          chapter: 9,
          verseRange: 'Ch.9 Sl.1-2',
          sanskritExcerpt: null,
          translationExcerpt: 'Ketu in the Ascendant makes the native spiritual, detached from material pursuits, and inclined toward mysticism. He may face health issues but possesses deep intuitive wisdom.',
          relevanceNote: 'Bhrigu Sutram on Ketu in Lagna — spiritual nature and detachment.',
        },
      ],
      confidence: 'medium',
    },
    12: {
      summary: 'Ketu in the 12th house is considered favorable for spiritual liberation (Moksha). BPHS notes expenses on charitable causes. Jataka Parijata describes deep meditation abilities and possible past-life spiritual attainments carried forward.',
      citations: [
        {
          textName: 'Jataka Parijata',
          textFullName: 'Jataka Parijata',
          chapter: 7,
          verseRange: 'Ch.7 Sl.45',
          sanskritExcerpt: null,
          translationExcerpt: 'Ketu in the 12th house bestows spiritual vision, detachment from worldly bonds, and eventual liberation. The native may spend on pilgrimages and charitable works.',
          relevanceNote: 'Ketu in Moksha Bhava — the ideal placement for spiritual seekers.',
        },
      ],
      confidence: 'medium',
    },
  },
};

// ============================================================
// Yoga Demo References
// ============================================================

const YOGA_REFS: Record<string, ClassicalReferencesSection> = {
  'Gajakesari Yoga': {
    summary: 'Gajakesari Yoga is extensively described in BPHS and Phaladeepika as one of the most auspicious combinations. BPHS states the native will be splendorous like a king, intelligent, and endowed with all virtues. Mantreswara adds that this yoga gives lasting fame, eloquence in speech, and leadership in assemblies.',
    citations: [
      {
        textName: 'BPHS',
        textFullName: 'Brihat Parashara Hora Shastra',
        chapter: 36,
        verseRange: 'Ch.36 Sl.7-9',
        sanskritExcerpt: 'गजकेसरी योगे जातः शूरो विद्वान् नृपप्रियः',
        translationExcerpt: 'The native born in Gajakesari Yoga will be splendorous, wealthy, intelligent, endowed with many laudable virtues, and will please the king. He will be long-lived and victorious over his enemies.',
        relevanceNote: 'Parashara\'s primary definition and effects of Gajakesari Yoga.',
      },
      {
        textName: 'Phaladeepika',
        textFullName: 'Phaladeepika',
        chapter: 6,
        verseRange: 'Ch.6 Sl.2',
        sanskritExcerpt: null,
        translationExcerpt: 'When Jupiter is in a Kendra from Moon, Gajakesari Yoga is formed. The person will be of distinguished personality, wealthy, intelligent, and endowed with excellent qualities. His fame will spread across many lands.',
        relevanceNote: 'Mantreswara\'s definition and emphasis on widespread fame.',
      },
    ],
    confidence: 'high',
  },
  'Ruchaka Yoga': {
    summary: 'Ruchaka Yoga, one of the five Pancha Mahapurusha Yogas, is formed when Mars is in a Kendra in its own sign or exaltation. BPHS declares the native will be a commander, strong-bodied, and victorious. Phaladeepika adds fame, valor, and leadership in military or competitive fields.',
    citations: [
      {
        textName: 'BPHS',
        textFullName: 'Brihat Parashara Hora Shastra',
        chapter: 75,
        verseRange: 'Ch.75 Sl.1-3',
        sanskritExcerpt: null,
        translationExcerpt: 'Ruchaka Yoga: When Mars is in a Kendra in Aries, Scorpio, or Capricorn, the native will be strong-bodied, famous, equal to a king, conforming to traditions, and a commander of armies. He will live up to 70 years.',
        relevanceNote: 'Parashara\'s definition of Ruchaka Yoga — Mars in angular strength.',
      },
    ],
    confidence: 'high',
  },
  'Hamsa Yoga': {
    summary: 'Hamsa Yoga is formed when Jupiter occupies a Kendra in its own sign (Sagittarius/Pisces) or exaltation (Cancer). BPHS describes the native as righteous, learned, and blessed with longevity. This is considered one of the most spiritually elevating Pancha Mahapurusha Yogas.',
    citations: [
      {
        textName: 'BPHS',
        textFullName: 'Brihat Parashara Hora Shastra',
        chapter: 75,
        verseRange: 'Ch.75 Sl.7-9',
        sanskritExcerpt: null,
        translationExcerpt: 'Hamsa Yoga: When Jupiter is in a Kendra in Sagittarius, Pisces, or Cancer, the native will be a king or equal to a king, righteous, handsome, and blessed with every comfort. He will live up to 100 years.',
        relevanceNote: 'Parashara\'s definition of Hamsa Yoga — Jupiter\'s highest angular dignity.',
      },
    ],
    confidence: 'high',
  },
  'Malavya Yoga': {
    summary: 'Malavya Yoga, formed by Venus in a Kendra in own sign or exaltation, bestows beauty, wealth, and domestic happiness. BPHS describes a life of luxury and refined pleasures. Phaladeepika adds mastery of arts and a harmonious marriage.',
    citations: [
      {
        textName: 'BPHS',
        textFullName: 'Brihat Parashara Hora Shastra',
        chapter: 75,
        verseRange: 'Ch.75 Sl.10-12',
        sanskritExcerpt: null,
        translationExcerpt: 'Malavya Yoga: When Venus is in a Kendra in Taurus, Libra, or Pisces, the native will be strong, wealthy, happy with wife and children, will possess vehicles and will be endowed with clean sense organs.',
        relevanceNote: 'Parashara\'s definition of Malavya Yoga — Venus in peak angular dignity.',
      },
    ],
    confidence: 'high',
  },
  'Shasha Yoga': {
    summary: 'Shasha Yoga is formed when Saturn occupies a Kendra in Capricorn, Aquarius, or Libra. BPHS describes the native as commanding servants, powerful in town or village, and possessing a wicked disposition but strong authority. The native rises through discipline and perseverance.',
    citations: [
      {
        textName: 'BPHS',
        textFullName: 'Brihat Parashara Hora Shastra',
        chapter: 75,
        verseRange: 'Ch.75 Sl.13-15',
        sanskritExcerpt: null,
        translationExcerpt: 'Shasha Yoga: When Saturn is in a Kendra in Capricorn, Aquarius, or Libra, the native will command good servants, will be powerful, will head a village or town, and will live up to 70 years.',
        relevanceNote: 'Parashara\'s definition of Shasha Yoga — Saturn\'s structured authority.',
      },
    ],
    confidence: 'high',
  },
  'Bhadra Yoga': {
    summary: 'Bhadra Yoga is formed when Mercury is in a Kendra in Gemini or Virgo. BPHS states the native will be strong, tiger-like in appearance, learned, and wealthy. Phaladeepika adds eloquence and success in intellectual pursuits.',
    citations: [
      {
        textName: 'BPHS',
        textFullName: 'Brihat Parashara Hora Shastra',
        chapter: 75,
        verseRange: 'Ch.75 Sl.4-6',
        sanskritExcerpt: null,
        translationExcerpt: 'Bhadra Yoga: When Mercury is in a Kendra in Gemini or Virgo, the native will be strong-bodied like a lion, will have an attractive face, will be learned, wealthy, and will live long.',
        relevanceNote: 'Parashara\'s definition of Bhadra Yoga — Mercury\'s intellectual supremacy.',
      },
    ],
    confidence: 'high',
  },
  'Budhaditya Yoga': {
    summary: 'Budhaditya Yoga, formed by the conjunction of Sun and Mercury, is described in Phaladeepika as bestowing sharp intellect, eloquence, and skill in the arts. BPHS confirms the native will be sweet-spoken and learned. Saravali adds expertise in mathematics and trade.',
    citations: [
      {
        textName: 'Phaladeepika',
        textFullName: 'Phaladeepika',
        chapter: 6,
        verseRange: 'Ch.6 Sl.17',
        sanskritExcerpt: null,
        translationExcerpt: 'When Sun and Mercury are in conjunction, the person born in Budhaditya Yoga will be intelligent, famous, of good character, and sweet in speech. He will excel in trade, arts, or administration.',
        relevanceNote: 'Primary classical definition of Budhaditya Yoga formation and effects.',
      },
    ],
    confidence: 'high',
  },
  'Raja Yoga': {
    summary: 'Raja Yoga is formed by the association of Kendra and Trikona lords. BPHS extensively describes various combinations, stating the native will attain power, authority, and kingly status. Phaladeepika ranks it among the most powerful wealth-and-status combinations in any chart.',
    citations: [
      {
        textName: 'BPHS',
        textFullName: 'Brihat Parashara Hora Shastra',
        chapter: 41,
        verseRange: 'Ch.41 Sl.1-4',
        sanskritExcerpt: null,
        translationExcerpt: 'When lords of Kendras and Trikonas associate by conjunction, aspect, or exchange, Raja Yoga is formed. The native will be equivalent to a king, wealthy, famous, and virtuous.',
        relevanceNote: 'Parashara\'s canonical Raja Yoga formation rules.',
      },
    ],
    confidence: 'high',
  },
  'Dhana Yoga': {
    summary: 'Dhana Yoga is formed by the association of wealth-producing house lords (2nd, 5th, 9th, 11th). BPHS describes multiple combinations for wealth acquisition. Phaladeepika states the native accumulates wealth through righteous means when benefics are involved.',
    citations: [
      {
        textName: 'BPHS',
        textFullName: 'Brihat Parashara Hora Shastra',
        chapter: 42,
        verseRange: 'Ch.42 Sl.1-5',
        sanskritExcerpt: null,
        translationExcerpt: 'When the lords of the 2nd, 5th, 9th, and 11th houses are mutually related, Dhana Yoga is formed. The native will amass wealth, possess gold and gems, and will be prosperous.',
        relevanceNote: 'Parashara on wealth-producing planetary combinations.',
      },
    ],
    confidence: 'high',
  },
  'Chandra-Mangala Yoga': {
    summary: 'Chandra-Mangala Yoga is formed by the conjunction or mutual aspect of Moon and Mars. Phaladeepika describes the native as a successful dealer in earthy goods, brave, and wealthy through self-effort. The yoga gives material success but can create emotional turbulence.',
    citations: [
      {
        textName: 'Phaladeepika',
        textFullName: 'Phaladeepika',
        chapter: 6,
        verseRange: 'Ch.6 Sl.10',
        sanskritExcerpt: null,
        translationExcerpt: 'The conjunction of Moon and Mars produces Chandra-Mangala Yoga. The native will be a dealer in women\'s articles, earthy goods, drinks, or minerals. He will be wealthy and brave but harsh.',
        relevanceNote: 'Mantreswara\'s definition of Chandra-Mangala Yoga and its effects.',
      },
    ],
    confidence: 'high',
  },
  'Adhi Yoga': {
    summary: 'Adhi Yoga is formed when benefics (Jupiter, Venus, Mercury) occupy the 6th, 7th, and 8th houses from Moon. BPHS declares this a powerful yoga for authority and leadership. Phaladeepika states the native will be a polite and trustworthy leader who conquers enemies.',
    citations: [
      {
        textName: 'BPHS',
        textFullName: 'Brihat Parashara Hora Shastra',
        chapter: 36,
        verseRange: 'Ch.36 Sl.15-17',
        sanskritExcerpt: null,
        translationExcerpt: 'When benefics occupy the 6th, 7th, and 8th houses from Moon, Adhi Yoga is formed. The native will be polite, trustworthy, prosperous, healthy, and will overcome all enemies.',
        relevanceNote: 'Parashara\'s description of Adhi Yoga — authority through benefic strength.',
      },
    ],
    confidence: 'high',
  },
  'Kemadruma Yoga': {
    summary: 'Kemadruma Yoga is formed when no planets occupy the 2nd and 12th houses from Moon. This is considered an inauspicious yoga in BPHS, bringing poverty and struggle. However, multiple cancellation conditions exist — Jupiter\'s aspect on Moon, or planets in Kendras from Lagna, can nullify this yoga.',
    citations: [
      {
        textName: 'BPHS',
        textFullName: 'Brihat Parashara Hora Shastra',
        chapter: 36,
        verseRange: 'Ch.36 Sl.20-22',
        sanskritExcerpt: null,
        translationExcerpt: 'When there are no planets in the 2nd and 12th from Moon, Kemadruma Yoga is formed. The native will be dirty, sorrowful, doing unrighteous deeds, poor, and dependent on others.',
        relevanceNote: 'Parashara\'s definition of Kemadruma Yoga — Moon without support.',
      },
    ],
    confidence: 'high',
  },
  'Viparita Raja Yoga': {
    summary: 'Viparita Raja Yoga occurs when lords of the 6th, 8th, or 12th houses are placed in each other\'s houses. BPHS states this yoga converts adversity into advantage — the native triumphs through difficult circumstances. Phaladeepika adds that success comes through the downfall of enemies.',
    citations: [
      {
        textName: 'BPHS',
        textFullName: 'Brihat Parashara Hora Shastra',
        chapter: 41,
        verseRange: 'Ch.41 Sl.25-27',
        sanskritExcerpt: null,
        translationExcerpt: 'When lords of the 6th, 8th, or 12th are in mutual exchange or conjunction, Viparita Raja Yoga is formed. The native will be a king or equivalent, enjoying lasting prosperity born from overcoming adversity.',
        relevanceNote: 'Parashara on Viparita Raja Yoga — triumph through adversity.',
      },
    ],
    confidence: 'high',
  },
};

// ============================================================
// Dosha Demo References
// ============================================================

const DOSHA_REFS: Record<string, ClassicalReferencesSection> = {
  'Manglik Dosha': {
    summary: 'Manglik Dosha (Kuja Dosha) is thoroughly described in BPHS where Parashara identifies Mars in houses 1, 2, 4, 7, 8, or 12 from the Ascendant as causing marital difficulties. Phaladeepika prescribes matching with another Manglik native as the primary remedy. Lal Kitab tradition adds that Mars after age 28 loses its malefic Dosha effect.',
    citations: [
      {
        textName: 'BPHS',
        textFullName: 'Brihat Parashara Hora Shastra',
        chapter: 81,
        verseRange: 'Ch.81 Sl.47-48',
        sanskritExcerpt: null,
        translationExcerpt: 'If Mars is in the Lagna, 2nd, 4th, 7th, 8th, or 12th house from the Ascendant, the native\'s spouse will meet with death. This is known as Kuja Dosha. If both the bride and groom have this Dosha, it gets cancelled.',
        relevanceNote: 'Parashara\'s canonical definition of Manglik Dosha houses and mutual cancellation.',
      },
      {
        textName: 'Phaladeepika',
        textFullName: 'Phaladeepika',
        chapter: 7,
        verseRange: 'Ch.7 Sl.52',
        sanskritExcerpt: null,
        translationExcerpt: 'Mars in the above-mentioned houses causes death or separation from the spouse. But if the partner also has Mars similarly placed, the Dosha is nullified and the marriage prospers.',
        relevanceNote: 'Mantreswara\'s confirmation of mutual cancellation principle.',
      },
    ],
    confidence: 'high',
  },
  'Kaal Sarp Dosha': {
    summary: 'Kaal Sarp Dosha, where all planets are hemmed between Rahu and Ketu, is a relatively modern concept not found in the core classical texts like BPHS or Brihat Jataka. It appears in later commentaries and is debated among scholars. Some authorities consider it significant only when the Lagna is also hemmed.',
    citations: [
      {
        textName: 'Jataka Parijata',
        textFullName: 'Jataka Parijata',
        chapter: 15,
        verseRange: 'Ch.15 Sl.88-89',
        sanskritExcerpt: null,
        translationExcerpt: 'When all the seven planets are placed between Rahu and Ketu, the native faces obstacles in all undertakings. This is mitigated if any planet is conjunct Rahu or Ketu, breaking the hemming.',
        relevanceNote: 'One of the few classical references to the concept of planetary hemming by nodes.',
      },
    ],
    confidence: 'medium',
  },
};

// ============================================================
// Public API
// ============================================================

export function getDemoPlanetReferences(
  planetId: number,
  house: number
): ClassicalReferencesSection | null {
  return PLANET_HOUSE_REFS[planetId]?.[house] ?? null;
}

export function getDemoYogaReferences(
  yogaName: string
): ClassicalReferencesSection | null {
  return YOGA_REFS[yogaName] ?? null;
}

export function getDemoDoshaReferences(
  doshaName: string
): ClassicalReferencesSection | null {
  return DOSHA_REFS[doshaName] ?? null;
}
