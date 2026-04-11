/**
 * Canonical learning module sequence for the Jyotish curriculum.
 * 50 modules across 6 phases (0–5).
 * No React dependencies — safe to import in Zustand stores and server utilities.
 */

export interface ModuleRef {
  id: string;
  phase: number;
  topic: string;
  title: { en: string; hi: string };
}

export const MODULE_SEQUENCE: ModuleRef[] = [
  // ── Phase 0: Pre-Foundation ──────────────────────────────────────────────
  { id: '0-1', phase: 0, topic: 'Getting Started', title: { en: 'What is Jyotish?',          hi: 'ज्योतिष क्या है?' } },
  { id: '0-2', phase: 0, topic: 'Getting Started', title: { en: 'The Hindu Calendar',         hi: 'हिन्दू पंचांग' } },
  { id: '0-3', phase: 0, topic: 'Getting Started', title: { en: 'Your Cosmic Address',        hi: 'आपका ब्रह्माण्डीय पता' } },
  { id: '0-4', phase: 0, topic: 'Getting Started', title: { en: "Reading Today's Panchang",   hi: 'आज का पंचांग पढ़ना' } },
  { id: '0-5', phase: 0, topic: 'Getting Started', title: { en: 'What is a Kundali?',         hi: 'कुण्डली क्या है?' } },
  { id: '0-6', phase: 0, topic: 'Foundations',     title: { en: 'Rituals & Astronomy',         hi: 'कर्मकाण्ड और खगोल' } },

  // ── Phase 1: The Sky ─────────────────────────────────────────────────────
  // Foundations
  { id: '1-1', phase: 1, topic: 'Foundations', title: { en: 'The Night Sky & Ecliptic',       hi: 'रात्रि आकाश एवं क्रान्तिवृत्त' } },
  { id: '1-2', phase: 1, topic: 'Foundations', title: { en: 'Measuring the Sky',              hi: 'आकाश मापन' } },
  { id: '1-3', phase: 1, topic: 'Foundations', title: { en: 'The Zodiac Belt',                hi: 'राशिचक्र पट्टी' } },
  // Grahas
  { id: '2-1', phase: 1, topic: 'Grahas',      title: { en: 'The Nine Grahas',                hi: 'नवग्रह' } },
  { id: '2-2', phase: 1, topic: 'Grahas',      title: { en: 'Planetary Relationships',        hi: 'ग्रह संबंध' } },
  { id: '2-3', phase: 1, topic: 'Grahas',      title: { en: 'Dignities',                      hi: 'ग्रह गरिमा' } },
  { id: '2-4', phase: 1, topic: 'Grahas',      title: { en: 'Retrograde, Combustion & War',   hi: 'वक्री, अस्त एवं ग्रह युद्ध' } },
  // Rashis
  { id: '3-1', phase: 1, topic: 'Rashis',      title: { en: 'The 12 Rashis',                  hi: '12 राशियाँ' } },
  { id: '3-2', phase: 1, topic: 'Rashis',      title: { en: 'Sign Qualities',                 hi: 'राशि गुण' } },
  { id: '3-3', phase: 1, topic: 'Rashis',      title: { en: 'Sign Lordship',                  hi: 'राशि स्वामित्व' } },
  // Ayanamsha
  { id: '4-1', phase: 1, topic: 'Ayanamsha',   title: { en: 'Earth Wobble',                   hi: 'अयनगति भौतिकी' } },
  { id: '4-2', phase: 1, topic: 'Ayanamsha',   title: { en: 'Two Zodiacs',                    hi: 'दो राशिचक्र' } },
  { id: '4-3', phase: 1, topic: 'Ayanamsha',   title: { en: 'Ayanamsha Systems',              hi: 'अयनांश पद्धतियाँ' } },

  // ── Phase 2: Pancha Anga ─────────────────────────────────────────────────
  // Tithi
  { id: '5-1', phase: 2, topic: 'Tithi',                 title: { en: 'What Is a Tithi?',            hi: 'तिथि क्या है?' } },
  { id: '5-2', phase: 2, topic: 'Tithi',                 title: { en: 'Shukla & Krishna Paksha',     hi: 'शुक्ल एवं कृष्ण पक्ष' } },
  { id: '5-3', phase: 2, topic: 'Tithi',                 title: { en: 'Special Tithis & Vrat',       hi: 'विशेष तिथियाँ' } },
  // Nakshatra
  { id: '6-1', phase: 2, topic: 'Nakshatra',             title: { en: 'The 27 Nakshatras',           hi: '27 नक्षत्र' } },
  { id: '6-2', phase: 2, topic: 'Nakshatra',             title: { en: 'Padas & Navamsha',            hi: 'पाद एवं नवांश' } },
  { id: '6-3', phase: 2, topic: 'Nakshatra',             title: { en: 'Nakshatra Dasha Lords',       hi: 'दशा स्वामी' } },
  { id: '6-4', phase: 2, topic: 'Nakshatra',             title: { en: 'Gana, Yoni, Nadi',            hi: 'गण, योनि, नाडी' } },
  // Yoga, Karana & Vara
  { id: '7-1', phase: 2, topic: 'Yoga, Karana & Vara',   title: { en: 'Panchang Yoga',               hi: 'पंचांग योग' } },
  { id: '7-2', phase: 2, topic: 'Yoga, Karana & Vara',   title: { en: 'Karana',                      hi: 'करण' } },
  { id: '7-3', phase: 2, topic: 'Yoga, Karana & Vara',   title: { en: 'Vara & Hora',                 hi: 'वार एवं होरा' } },
  { id: '7-4', phase: 2, topic: 'Yoga, Karana & Vara',   title: { en: 'Why 7 Days? — Chaldean Order', hi: '7 दिन क्यों? — कैल्डियन क्रम' } },
  // Muhurta
  { id: '8-1', phase: 2, topic: 'Muhurta',               title: { en: '30 Muhurtas Per Day',         hi: '30 मुहूर्त' } },

  // ── Phase 3: The Chart ───────────────────────────────────────────────────
  // Kundali
  { id: '9-1',  phase: 3, topic: 'Kundali',   title: { en: 'What Is a Birth Chart?',           hi: 'जन्म कुण्डली' } },
  { id: '9-2',  phase: 3, topic: 'Kundali',   title: { en: 'Computing the Lagna',              hi: 'लग्न गणना' } },
  { id: '9-3',  phase: 3, topic: 'Kundali',   title: { en: 'Placing Planets',                  hi: 'ग्रह स्थापन' } },
  { id: '9-4',  phase: 3, topic: 'Kundali',   title: { en: 'Reading a Chart',                  hi: 'कुण्डली पठन' } },
  // Bhavas
  { id: '10-1', phase: 3, topic: 'Bhavas',    title: { en: '12 Houses',                        hi: '12 भाव' } },
  { id: '10-2', phase: 3, topic: 'Bhavas',    title: { en: 'Kendra, Trikona, Dusthana',        hi: 'केंद्र, त्रिकोण, दुःस्थान' } },
  { id: '10-3', phase: 3, topic: 'Bhavas',    title: { en: 'House Lords',                      hi: 'भावेश' } },
  // Vargas
  { id: '11-1', phase: 3, topic: 'Vargas',    title: { en: 'Why Divisional Charts?',           hi: 'विभागीय चार्ट' } },
  { id: '11-2', phase: 3, topic: 'Vargas',    title: { en: 'Navamsha (D9)',                    hi: 'नवांश' } },
  { id: '11-3', phase: 3, topic: 'Vargas',    title: { en: 'Key Vargas D2-D60',                hi: 'प्रमुख वर्ग' } },
  // Dashas
  { id: '12-1', phase: 3, topic: 'Dashas',    title: { en: 'Vimshottari',                      hi: 'विंशोत्तरी' } },
  { id: '12-2', phase: 3, topic: 'Dashas',    title: { en: 'Reading Dasha Periods',            hi: 'दशा पठन' } },
  { id: '12-3', phase: 3, topic: 'Dashas',    title: { en: 'Timing Events',                    hi: 'घटना समय' } },
  // Transits
  { id: '13-1', phase: 3, topic: 'Transits',  title: { en: 'How Transits Work',                hi: 'गोचर' } },
  { id: '13-2', phase: 3, topic: 'Transits',  title: { en: 'Sade Sati',                        hi: 'साढ़े साती' } },
  { id: '13-3', phase: 3, topic: 'Transits',  title: { en: 'Ashtakavarga Transit Scoring',     hi: 'अष्टकवर्ग गोचर' } },
  { id: '13-4', phase: 3, topic: 'Transits',  title: { en: 'Eclipses — Grahan & Rahu-Ketu Axis', hi: 'ग्रहण — राहु-केतु अक्ष' } },

  // ── Phase 4: Applied Jyotish ─────────────────────────────────────────────
  // Compatibility
  { id: '14-1', phase: 4, topic: 'Compatibility',    title: { en: 'Ashta Kuta',               hi: 'अष्ट कूट' } },
  { id: '14-2', phase: 4, topic: 'Compatibility',    title: { en: 'Key Kutas & Doshas',       hi: 'प्रमुख कूट' } },
  { id: '14-3', phase: 4, topic: 'Compatibility',    title: { en: 'Beyond Kuta',              hi: 'कूट से परे' } },
  // Yogas & Doshas
  { id: '15-1', phase: 4, topic: 'Yogas & Doshas',   title: { en: 'Pancha Mahapurusha',       hi: 'पंच महापुरुष' } },
  { id: '15-2', phase: 4, topic: 'Yogas & Doshas',   title: { en: 'Raja & Dhana Yogas',       hi: 'राज एवं धन योग' } },
  { id: '15-3', phase: 4, topic: 'Yogas & Doshas',   title: { en: 'Common Doshas',            hi: 'प्रमुख दोष' } },
  { id: '15-4', phase: 4, topic: 'Yogas & Doshas',   title: { en: 'Remedial Measures',        hi: 'उपाय' } },

  // ── Phase 5: Classical Knowledge ─────────────────────────────────────────
  { id: '16-1', phase: 5, topic: 'Classical Texts',  title: { en: 'Astronomical Texts',       hi: 'खगोलशास्त्रीय' } },
  { id: '16-2', phase: 5, topic: 'Classical Texts',  title: { en: 'Hora Texts',               hi: 'होरा ग्रंथ' } },
  { id: '16-3', phase: 5, topic: 'Classical Texts',  title: { en: "India's Contributions",    hi: 'भारत का योगदान' } },
  // Muhurta
  { id: '17-1', phase: 5, topic: 'Muhurta',          title: { en: 'Muhurta Selection',         hi: 'मुहूर्त चयन' } },
  { id: '17-2', phase: 5, topic: 'Muhurta',          title: { en: 'Muhurta for Marriage',      hi: 'विवाह मुहूर्त' } },
  { id: '17-3', phase: 5, topic: 'Muhurta',          title: { en: 'Muhurta for Property',      hi: 'सम्पत्ति मुहूर्त' } },
  { id: '17-4', phase: 5, topic: 'Muhurta',          title: { en: 'Muhurta for Education',     hi: 'शिक्षा मुहूर्त' } },
  // Strength
  { id: '18-1', phase: 5, topic: 'Strength',         title: { en: 'Shadbala — 6-Fold Strength', hi: 'षड्बल' } },
  { id: '18-2', phase: 5, topic: 'Strength',         title: { en: 'Bhavabala — House Strength', hi: 'भावबल' } },
  { id: '18-3', phase: 5, topic: 'Strength',         title: { en: 'Ashtakavarga — Bindu Scoring', hi: 'अष्टकवर्ग' } },
  { id: '18-4', phase: 5, topic: 'Strength',         title: { en: 'Avasthas — Planetary States', hi: 'अवस्थाएँ' } },
  { id: '18-5', phase: 5, topic: 'Strength',         title: { en: 'Vimshopaka — Varga Strength', hi: 'विंशोपक बल' } },

  // ── Phase 6: Jaimini ──────────────────────────────────────────────────────
  { id: '19-1', phase: 6, topic: 'Jaimini',          title: { en: 'Chara Karakas',             hi: 'चर कारक' } },
  { id: '19-2', phase: 6, topic: 'Jaimini',          title: { en: 'Rashi Drishti',             hi: 'राशि दृष्टि' } },
  { id: '19-3', phase: 6, topic: 'Jaimini',          title: { en: 'Argala',                    hi: 'अर्गला' } },
  { id: '19-4', phase: 6, topic: 'Jaimini',          title: { en: 'Special Lagnas',            hi: 'विशेष लग्न' } },

  // ── Phase 7: KP System ────────────────────────────────────────────────────
  { id: '20-1', phase: 7, topic: 'KP System',        title: { en: 'Placidus Houses',           hi: 'प्लेसिडस भाव' } },
  { id: '20-2', phase: 7, topic: 'KP System',        title: { en: '249 Sub-Lord Table',        hi: '249 उप-स्वामी सारणी' } },
  { id: '20-3', phase: 7, topic: 'KP System',        title: { en: 'Significators',             hi: 'कारकत्व' } },
  { id: '20-4', phase: 7, topic: 'KP System',        title: { en: 'Ruling Planets',            hi: 'शासक ग्रह' } },

  // ── Phase 8: Varshaphal ───────────────────────────────────────────────────
  { id: '21-1', phase: 8, topic: 'Varshaphal',       title: { en: 'Tajika Aspects',            hi: 'ताजिक दृष्टि' } },
  { id: '21-2', phase: 8, topic: 'Varshaphal',       title: { en: 'Sahams',                    hi: 'सहम' } },
  { id: '21-3', phase: 8, topic: 'Varshaphal',       title: { en: 'Mudda Dasha',               hi: 'मुद्दा दशा' } },
  { id: '21-4', phase: 8, topic: 'Varshaphal',       title: { en: 'Tithi Pravesha',            hi: 'तिथि प्रवेश' } },

  // ── Phase 9: Astronomy ────────────────────────────────────────────────────
  { id: '22-1', phase: 9, topic: 'Astronomy',        title: { en: 'Julian Day',                hi: 'जूलियन दिवस' } },
  { id: '22-2', phase: 9, topic: 'Astronomy',        title: { en: 'Finding the Sun',           hi: 'सूर्य की खोज' } },
  { id: '22-3', phase: 9, topic: 'Astronomy',        title: { en: 'Finding the Moon',          hi: 'चन्द्रमा की खोज' } },
  { id: '22-4', phase: 9, topic: 'Astronomy',        title: { en: 'Sunrise Calculation',       hi: 'सूर्योदय गणना' } },
  { id: '22-5', phase: 9, topic: 'Astronomy',        title: { en: 'Moonrise Calculation',      hi: 'चन्द्रोदय गणना' } },
  { id: '22-6', phase: 9, topic: 'Astronomy',        title: { en: 'Equation of Time',          hi: 'समय का समीकरण' } },

  // ── Phase 10: Advanced Prediction ─────────────────────────────────────────
  { id: '23-1', phase: 10, topic: 'Prediction',      title: { en: 'Eclipse Prediction',        hi: 'ग्रहण भविष्यवाणी' } },
  { id: '23-2', phase: 10, topic: 'Prediction',      title: { en: 'Retrograde & Combustion',   hi: 'वक्री और अस्त' } },
  { id: '23-3', phase: 10, topic: 'Prediction',      title: { en: 'Chakra Systems',            hi: 'चक्र प्रणालियाँ' } },
  { id: '23-4', phase: 10, topic: 'Prediction',      title: { en: 'Sphutas & Sensitive Points', hi: 'स्फुट एवं संवेदनशील बिन्दु' } },
  { id: '23-5', phase: 10, topic: 'Prediction',      title: { en: 'Prashna Yogas',             hi: 'प्रश्न योग' } },
  { id: '24-1', phase: 10, topic: 'Prediction',      title: { en: 'Ganda Mula Nakshatras',    hi: 'गण्ड मूल नक्षत्र' } },

  // ── Phase 11: India's Contributions to Science ────────────────────────────
  // Mathematics
  { id: '25-1', phase: 11, topic: 'Mathematics',     title: { en: 'Zero — The Most Dangerous Idea',          hi: 'शून्य — सबसे खतरनाक विचार' } },
  { id: '25-2', phase: 11, topic: 'Mathematics',     title: { en: "Sine Is Sanskrit — Jya to Sine",          hi: 'Sine संस्कृत है — ज्या से Sine' } },
  { id: '25-3', phase: 11, topic: 'Mathematics',     title: { en: 'π = 3.1416 — Aryabhata Nailed It',        hi: 'π = 3.1416 — आर्यभट की सटीक गणना' } },
  { id: '25-4', phase: 11, topic: 'Mathematics',     title: { en: 'Negative Numbers — Less Than Nothing',     hi: 'ऋणात्मक संख्याएँ — शून्य से कम' } },
  { id: '25-5', phase: 11, topic: 'Mathematics',     title: { en: 'Binary Code — 1,800 Years Early',          hi: 'द्विआधारी — 1,800 वर्ष पहले' } },
  { id: '25-6', phase: 11, topic: 'Mathematics',     title: { en: 'Fibonacci Started With Music',             hi: 'फिबोनाची संगीत से शुरू हुआ' } },
  { id: '25-7', phase: 11, topic: 'Mathematics',     title: { en: 'Calculus — Kerala, Not Cambridge',         hi: 'कैलकुलस — केरल, कैम्ब्रिज नहीं' } },
  { id: '25-8', phase: 11, topic: 'Mathematics',     title: { en: "Pythagorean Theorem — 300 Years Before Pythagoras", hi: "पाइथागोरस प्रमेय — पाइथागोरस से 300 वर्ष पहले" } },
  // Astronomy & Physics
  { id: '26-1', phase: 11, topic: 'Astronomy & Physics', title: { en: 'Earth Rotates — 1,000 Years Before Europe', hi: 'पृथ्वी घूमती है — यूरोप से 1,000 वर्ष पहले' } },
  { id: '26-2', phase: 11, topic: 'Astronomy & Physics', title: { en: 'Gravity — 500 Years Before Newton',      hi: 'गुरुत्वाकर्षण — न्यूटन से 500 वर्ष पहले' } },
  { id: '26-3', phase: 11, topic: 'Astronomy & Physics', title: { en: 'Speed of Light — 14th Century Text',      hi: 'प्रकाश की गति — 14वीं शताब्दी' } },
  { id: '26-4', phase: 11, topic: 'Astronomy & Physics', title: { en: '4.32 Billion Years — How Did They Know?', hi: '4.32 अरब वर्ष — कैसे पता था?' } },
];

export const TOTAL_MODULES = MODULE_SEQUENCE.length;

// ── Phase metadata ────────────────────────────────────────────────────────────

interface PhaseInfo {
  phase: number;
  title: { en: string; hi: string };
  count: number;
}

export const PHASE_INFO: PhaseInfo[] = [
  { phase: 0, title: { en: 'Pre-Foundation',       hi: 'पूर्व-आधार' },         count: MODULE_SEQUENCE.filter(m => m.phase === 0).length },
  { phase: 1, title: { en: 'The Sky',               hi: 'आकाश' },               count: MODULE_SEQUENCE.filter(m => m.phase === 1).length },
  { phase: 2, title: { en: 'Pancha Anga',           hi: 'पंच अंग' },            count: MODULE_SEQUENCE.filter(m => m.phase === 2).length },
  { phase: 3, title: { en: 'The Chart',             hi: 'कुण्डली' },            count: MODULE_SEQUENCE.filter(m => m.phase === 3).length },
  { phase: 4, title: { en: 'Applied Jyotish',       hi: 'व्यावहारिक ज्योतिष' }, count: MODULE_SEQUENCE.filter(m => m.phase === 4).length },
  { phase: 5, title: { en: 'Classical Knowledge',   hi: 'शास्त्रीय ज्ञान' },   count: MODULE_SEQUENCE.filter(m => m.phase === 5).length },
  { phase: 6, title: { en: 'Jaimini System',        hi: 'जैमिनी पद्धति' },     count: MODULE_SEQUENCE.filter(m => m.phase === 6).length },
  { phase: 7, title: { en: 'KP System',             hi: 'केपी पद्धति' },        count: MODULE_SEQUENCE.filter(m => m.phase === 7).length },
  { phase: 8, title: { en: 'Varshaphal',            hi: 'वर्षफल' },             count: MODULE_SEQUENCE.filter(m => m.phase === 8).length },
  { phase: 9, title: { en: 'Astronomy Engine',      hi: 'खगोलीय गणना' },       count: MODULE_SEQUENCE.filter(m => m.phase === 9).length },
  { phase: 10, title: { en: 'Advanced Prediction',  hi: 'उन्नत भविष्यवाणी' },  count: MODULE_SEQUENCE.filter(m => m.phase === 10).length },
];

// ── Internal index map for O(1) lookups ───────────────────────────────────────

const _indexById = new Map<string, number>(
  MODULE_SEQUENCE.map((m, i) => [m.id, i])
);

// ── Helper functions ──────────────────────────────────────────────────────────

/** Returns the ModuleRef for a given ID, or undefined if not found. */
export function getModuleRef(id: string): ModuleRef | undefined {
  const idx = _indexById.get(id);
  return idx !== undefined ? MODULE_SEQUENCE[idx] : undefined;
}

/** Returns the next module's ID, or null if this is the last module. */
export function getNextModuleId(currentId: string): string | null {
  const idx = _indexById.get(currentId);
  if (idx === undefined) return null;
  const next = MODULE_SEQUENCE[idx + 1];
  return next ? next.id : null;
}

/** Returns the previous module's ID, or null if this is the first module. */
export function getPrevModuleId(currentId: string): string | null {
  const idx = _indexById.get(currentId);
  if (idx === undefined || idx === 0) return null;
  return MODULE_SEQUENCE[idx - 1].id;
}

/** Returns all modules belonging to a given phase number. */
export function getPhaseModules(phase: number): ModuleRef[] {
  return MODULE_SEQUENCE.filter(m => m.phase === phase);
}

/** Returns true if the module is the last one in its phase. */
export function isLastInPhase(id: string): boolean {
  const mod = getModuleRef(id);
  if (!mod) return false;
  const phaseModules = getPhaseModules(mod.phase);
  return phaseModules[phaseModules.length - 1].id === id;
}
