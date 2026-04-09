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
];

export const TOTAL_MODULES = MODULE_SEQUENCE.length; // 55 (task spec listed 50 but the canonical list has 55)

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
