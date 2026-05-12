import type { ActiveFactor } from './verdict-types';

// ─── Configurable conflict-resolution constants ───────────────────────────────
// When Abhijit overlaps a hard block (Rahu Kaal / Yamaganda / Gulika), the slot
// is demoted to 'caution' rather than fully blocked — classical texts differ on
// whether Abhijit overrides these; 'caution' is the conservative middle ground.
export const ABHIJIT_DURING_HARD_BLOCK: 'caution' | 'avoid' | 'good' = 'caution';

// Abhijit Muhurta is inauspicious on Wednesdays (Budha's day) per Muhurta Chintamani.
export const ABHIJIT_WEDNESDAY_VERDICT: 'caution' | 'good' = 'caution';

// ─── N1–N6: Hard blocks (override all positives unless configured otherwise) ──

export const HARD_BLOCKS: ActiveFactor[] = [
  {
    id: 'vishti',
    name: 'Vishti (Bhadra)',
    nameHi: 'विष्टि (भद्रा)',
    type: 'hard_block',
    rank: 'N1',
    source: 'Muhurta Chintamani 2.4',
    effect: 'Inauspicious karana — avoid all important beginnings, travel, and transactions.',
    effectHi: 'अशुभ करण — सभी महत्वपूर्ण कार्य, यात्रा और लेन-देन से बचें।',
  },
  {
    id: 'vyatipata',
    name: 'Vyatipata Yoga',
    nameHi: 'व्यतीपात योग',
    type: 'hard_block',
    rank: 'N2',
    source: 'Brihat Samhita 99.8',
    effect: 'Highly malefic day-level yoga — avoid muhurta selection entirely on this day.',
    effectHi: 'अत्यंत अशुभ दिवस योग — इस दिन मुहूर्त चयन से पूर्णतः बचें।',
  },
  {
    id: 'vaidhriti',
    name: 'Vaidhriti Yoga',
    nameHi: 'वैधृति योग',
    type: 'hard_block',
    rank: 'N3',
    source: 'Brihat Samhita 99.9',
    effect: 'Malefic day-level yoga — inauspicious for most undertakings.',
    effectHi: 'अशुभ दिवस योग — अधिकांश कार्यों के लिए अशुभ।',
  },
  {
    id: 'rahu_kaal',
    name: 'Rahu Kaal',
    nameHi: 'राहु काल',
    type: 'hard_block',
    rank: 'N4',
    source: 'Muhurta Chintamani 3.1',
    effect: 'Ruled by Rahu — avoid new beginnings, travel, and auspicious ceremonies.',
    effectHi: 'राहु का काल — नए कार्य, यात्रा और शुभ कार्यक्रम से बचें।',
  },
  {
    id: 'yamaganda',
    name: 'Yamaganda',
    nameHi: 'यमगंड',
    type: 'hard_block',
    rank: 'N5',
    source: 'Muhurta Chintamani 3.2',
    effect: "Ruled by Yama (death) — avoid auspicious activities, especially travel.",
    effectHi: 'यम का काल — शुभ कार्य, विशेषतः यात्रा से बचें।',
  },
  {
    id: 'gulika_kaal',
    name: 'Gulika Kaal',
    nameHi: 'गुलिक काल',
    type: 'hard_block',
    rank: 'N6',
    source: 'Muhurta Chintamani 3.3',
    effect: 'Ruled by Gulika (son of Saturn) — inauspicious for auspicious ceremonies.',
    effectHi: 'गुलिक का काल — शुभ संस्कारों के लिए अशुभ।',
  },
];

// ─── N7–N9: Conditional blocks (context-dependent; can be overridden) ─────────

export const CONDITIONAL_BLOCKS: ActiveFactor[] = [
  {
    id: 'varjyam',
    name: 'Varjyam',
    nameHi: 'वर्ज्यम्',
    type: 'conditional_block',
    rank: 'N7',
    source: 'Muhurta Chintamani 4.6',
    effect:
      'Moon in inauspicious nakshatra ghati — avoid for most activities; acceptable for spiritual practice.',
    effectHi:
      'चंद्रमा की अशुभ नक्षत्र घटी — अधिकांश कार्यों के लिए वर्जित; आध्यात्मिक अभ्यास के लिए स्वीकार्य।',
  },
  {
    id: 'durmuhurta',
    name: 'Durmuhurta',
    nameHi: 'दुर्मुहूर्त',
    type: 'conditional_block',
    rank: 'N8',
    source: 'Muhurta Chintamani 2.11',
    effect: 'Two inauspicious muhurtas per day (solar based) — demotes but does not fully block.',
    effectHi:
      'दिन के दो अशुभ मुहूर्त (सौर आधारित) — योग्यता घटाता है, पूर्णतः नहीं रोकता।',
  },
  {
    id: 'visha_ghatika',
    name: 'Visha Ghatika',
    nameHi: 'विष घटिका',
    type: 'conditional_block',
    rank: 'N9',
    source: 'Muhurta Chintamani 4.8',
    effect:
      'Poison ghati of the lunar day — avoid for medicine, food preparation, and important ceremonies.',
    effectHi:
      'तिथि की विष घटिका — औषध, भोजन और महत्वपूर्ण संस्कारों से बचें।',
  },
];

// ─── P1–P10: Positives (ranked by classical strength) ─────────────────────────

export interface PositiveFactor extends ActiveFactor {
  strength: number;
}

export const POSITIVES: PositiveFactor[] = [
  {
    id: 'guru_pushya',
    name: 'Guru Pushya Yoga',
    nameHi: 'गुरु पुष्य योग',
    type: 'positive',
    rank: 'P1',
    source: 'Jyotish Ratnakar 7.12',
    effect:
      'Most auspicious yoga — Jupiter on Pushya nakshatra. Excellent for new beginnings, gold purchase, education.',
    effectHi:
      'सर्वश्रेष्ठ योग — गुरुवार पुष्य नक्षत्र। नए कार्य, सोना खरीद, शिक्षा के लिए उत्तम।',
    strength: 100,
  },
  {
    id: 'ravi_pushya',
    name: 'Ravi Pushya Yoga',
    nameHi: 'रवि पुष्य योग',
    type: 'positive',
    rank: 'P2',
    source: 'Jyotish Ratnakar 7.13',
    effect:
      'Highly auspicious yoga — Sunday on Pushya nakshatra. Excellent for spiritual and material undertakings.',
    effectHi:
      'अत्यंत शुभ योग — रविवार पुष्य नक्षत्र। आध्यात्मिक और भौतिक कार्यों के लिए उत्तम।',
    strength: 95,
  },
  {
    id: 'amrit_siddhi',
    name: 'Amrit Siddhi Yoga',
    nameHi: 'अमृत सिद्धि योग',
    type: 'positive',
    rank: 'P3',
    source: 'Muhurta Chintamani 5.3',
    effect:
      'Nectar-granting yoga (weekday + nakshatra combination) — activities initiated here bear fruit quickly.',
    effectHi:
      'अमृत सिद्धि योग — यहाँ आरंभ कार्य शीघ्र फलदायी होते हैं।',
    strength: 90,
  },
  {
    id: 'abhijit',
    name: 'Abhijit Muhurta',
    nameHi: 'अभिजित मुहूर्त',
    type: 'positive',
    rank: 'P4',
    source: 'Muhurta Chintamani 2.1',
    effect:
      "Midday victory muhurta — most powerful daily muhurta. Overcomes many doshas. Avoid on Wednesdays.",
    effectHi:
      'मध्याह्न विजय मुहूर्त — दिन का सबसे शक्तिशाली मुहूर्त। अधिकांश दोषों को नष्ट करता है। बुधवार को वर्जित।',
    strength: 88,
  },
  {
    id: 'sarvartha_siddhi',
    name: 'Sarvartha Siddhi Yoga',
    nameHi: 'सर्वार्थ सिद्धि योग',
    type: 'positive',
    rank: 'P5',
    source: 'Muhurta Chintamani 5.1',
    effect: 'All-purpose accomplishment yoga — excellent for any important work.',
    effectHi: 'सर्व कार्य सिद्धि योग — किसी भी महत्वपूर्ण कार्य के लिए उत्तम।',
    strength: 85,
  },
  {
    id: 'amrit_kalam',
    name: 'Amrit Kalam',
    nameHi: 'अमृत काल',
    type: 'positive',
    rank: 'P6',
    source: 'Muhurta Chintamani 4.5',
    effect:
      'Nectar period of the nakshatra — auspicious window for new beginnings and ceremonies.',
    effectHi:
      'नक्षत्र का अमृत काल — नए कार्य और संस्कारों के लिए शुभ समय।',
    strength: 75,
  },
  {
    id: 'brahma_muhurta',
    name: 'Brahma Muhurta',
    nameHi: 'ब्रह्म मुहूर्त',
    type: 'positive',
    rank: 'P7',
    source: 'Ashtanga Hridayam Sutrasthana 2.1',
    effect:
      'Pre-dawn sacred period (96 min before sunrise) — ideal for meditation, study, and spiritual practice.',
    effectHi:
      'सूर्योदय से 96 मिनट पूर्व — ध्यान, अध्ययन और आध्यात्मिक अभ्यास के लिए आदर्श।',
    strength: 72,
  },
  {
    id: 'siddha_yoga',
    name: 'Siddha Yoga',
    nameHi: 'सिद्ध योग',
    type: 'positive',
    rank: 'P8',
    source: 'Muhurta Chintamani 5.2',
    effect:
      'Accomplishment yoga (weekday + nakshatra combination) — favourable for most activities.',
    effectHi: 'सिद्ध योग — अधिकांश कार्यों के लिए अनुकूल।',
    strength: 70,
  },
  {
    id: 'vijaya_muhurta',
    name: 'Vijaya Muhurta',
    nameHi: 'विजय मुहूर्त',
    type: 'positive',
    rank: 'P9',
    source: 'Muhurta Chintamani 2.3',
    effect:
      'Victory muhurta (afternoon period) — particularly good for competitive activities and travel.',
    effectHi:
      'विजय मुहूर्त (अपराह्न) — प्रतिस्पर्धी कार्यों और यात्रा के लिए विशेष रूप से शुभ।',
    strength: 68,
  },
  {
    id: 'godhuli',
    name: 'Godhuli Lagna',
    nameHi: 'गोधूलि लग्न',
    type: 'positive',
    rank: 'P10',
    source: 'Muhurta Chintamani 2.5',
    effect:
      'Cow-dust twilight — auspicious for marriages, home-entering ceremonies (griha pravesh), and new beginnings.',
    effectHi:
      'गोधूलि वेला — विवाह, गृह प्रवेश और नए कार्यों के लिए शुभ।',
    strength: 60,
  },
];
