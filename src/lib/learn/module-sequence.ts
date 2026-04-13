/**
 * Canonical learning module sequence for the Jyotish curriculum.
 * 50 modules across 6 phases (0–5).
 * No React dependencies — safe to import in Zustand stores and server utilities.
 */

export interface ModuleRef {
  id: string;
  phase: number;
  topic: string;
  title: Record<string, string>;
}

export const MODULE_SEQUENCE: ModuleRef[] = [
  // ── Phase 0: Pre-Foundation ──────────────────────────────────────────────
  { id: '0-1', phase: 0, topic: 'Getting Started', title: { en: 'What is Jyotish?', hi: 'ज्योतिष क्या है?', sa: 'ज्योतिष क्या है?', mai: 'ज्योतिष क्या है?', mr: 'ज्योतिष क्या है?', ta: 'What is Jyotish?', te: 'What is Jyotish?', bn: 'What is Jyotish?', kn: 'What is Jyotish?', gu: 'What is Jyotish?' } },
  { id: '0-2', phase: 0, topic: 'Getting Started', title: { en: 'The Hindu Calendar', hi: 'हिन्दू पंचांग', sa: 'हिन्दू पंचांग', mai: 'हिन्दू पंचांग', mr: 'हिन्दू पंचांग', ta: 'The Hindu Calendar', te: 'The Hindu Calendar', bn: 'The Hindu Calendar', kn: 'The Hindu Calendar', gu: 'The Hindu Calendar' } },
  { id: '0-3', phase: 0, topic: 'Getting Started', title: { en: 'Your Cosmic Address', hi: 'आपका ब्रह्माण्डीय पता', sa: 'आपका ब्रह्माण्डीय पता', mai: 'आपका ब्रह्माण्डीय पता', mr: 'आपका ब्रह्माण्डीय पता', ta: 'Your Cosmic Address', te: 'Your Cosmic Address', bn: 'Your Cosmic Address', kn: 'Your Cosmic Address', gu: 'Your Cosmic Address' } },
  { id: '0-4', phase: 0, topic: 'Getting Started', title: { en: "Reading Today's Panchang", hi: 'आज का पंचांग पढ़ना', sa: 'आज का पंचांग पढ़ना', mai: 'आज का पंचांग पढ़ना', mr: 'आज का पंचांग पढ़ना', ta: "Reading Today's Panchang", te: "Reading Today's Panchang", bn: "Reading Today's Panchang", kn: "Reading Today's Panchang", gu: "Reading Today's Panchang" } },
  { id: '0-5', phase: 0, topic: 'Getting Started', title: { en: 'What is a Kundali?', hi: 'कुण्डली क्या है?', sa: 'कुण्डली क्या है?', mai: 'कुण्डली क्या है?', mr: 'कुण्डली क्या है?', ta: 'What is a Kundali?', te: 'What is a Kundali?', bn: 'What is a Kundali?', kn: 'What is a Kundali?', gu: 'What is a Kundali?' } },
  { id: '0-6', phase: 0, topic: 'Foundations',     title: { en: 'Rituals & Astronomy', hi: 'कर्मकाण्ड और खगोल', sa: 'कर्मकाण्ड और खगोल', mai: 'कर्मकाण्ड और खगोल', mr: 'कर्मकाण्ड और खगोल', ta: 'Rituals & Astronomy', te: 'Rituals & Astronomy', bn: 'Rituals & Astronomy', kn: 'Rituals & Astronomy', gu: 'Rituals & Astronomy' } },

  // ── Phase 1: The Sky ─────────────────────────────────────────────────────
  // Foundations
  { id: '1-1', phase: 1, topic: 'Foundations', title: { en: 'The Night Sky & Ecliptic', hi: 'रात्रि आकाश एवं क्रान्तिवृत्त', sa: 'रात्रि आकाश एवं क्रान्तिवृत्त', mai: 'रात्रि आकाश एवं क्रान्तिवृत्त', mr: 'रात्रि आकाश एवं क्रान्तिवृत्त', ta: 'The Night Sky & Ecliptic', te: 'The Night Sky & Ecliptic', bn: 'The Night Sky & Ecliptic', kn: 'The Night Sky & Ecliptic', gu: 'The Night Sky & Ecliptic' } },
  { id: '1-2', phase: 1, topic: 'Foundations', title: { en: 'Measuring the Sky', hi: 'आकाश मापन', sa: 'आकाश मापन', mai: 'आकाश मापन', mr: 'आकाश मापन', ta: 'Measuring the Sky', te: 'Measuring the Sky', bn: 'Measuring the Sky', kn: 'Measuring the Sky', gu: 'Measuring the Sky' } },
  { id: '1-3', phase: 1, topic: 'Foundations', title: { en: 'The Zodiac Belt', hi: 'राशिचक्र पट्टी', sa: 'राशिचक्र पट्टी', mai: 'राशिचक्र पट्टी', mr: 'राशिचक्र पट्टी', ta: 'The Zodiac Belt', te: 'The Zodiac Belt', bn: 'The Zodiac Belt', kn: 'The Zodiac Belt', gu: 'The Zodiac Belt' } },
  // Grahas
  { id: '2-1', phase: 1, topic: 'Grahas',      title: { en: 'The Nine Grahas', hi: 'नवग्रह', sa: 'नवग्रह', mai: 'नवग्रह', mr: 'नवग्रह', ta: 'The Nine Grahas', te: 'The Nine Grahas', bn: 'The Nine Grahas', kn: 'The Nine Grahas', gu: 'The Nine Grahas' } },
  { id: '2-2', phase: 1, topic: 'Grahas',      title: { en: 'Planetary Relationships', hi: 'ग्रह संबंध', sa: 'ग्रह संबंध', mai: 'ग्रह संबंध', mr: 'ग्रह संबंध', ta: 'Planetary Relationships', te: 'Planetary Relationships', bn: 'Planetary Relationships', kn: 'Planetary Relationships', gu: 'Planetary Relationships' } },
  { id: '2-3', phase: 1, topic: 'Grahas',      title: { en: 'Dignities', hi: 'ग्रह गरिमा', sa: 'ग्रह गरिमा', mai: 'ग्रह गरिमा', mr: 'ग्रह गरिमा', ta: 'Dignities', te: 'Dignities', bn: 'Dignities', kn: 'Dignities', gu: 'Dignities' } },
  { id: '2-4', phase: 1, topic: 'Grahas',      title: { en: 'Retrograde, Combustion & War', hi: 'वक्री, अस्त एवं ग्रह युद्ध', sa: 'वक्री, अस्त एवं ग्रह युद्ध', mai: 'वक्री, अस्त एवं ग्रह युद्ध', mr: 'वक्री, अस्त एवं ग्रह युद्ध', ta: 'Retrograde, Combustion & War', te: 'Retrograde, Combustion & War', bn: 'Retrograde, Combustion & War', kn: 'Retrograde, Combustion & War', gu: 'Retrograde, Combustion & War' } },
  // Rashis
  { id: '3-1', phase: 1, topic: 'Rashis',      title: { en: 'The 12 Rashis', hi: '12 राशियाँ', sa: '12 राशियाँ', mai: '12 राशियाँ', mr: '12 राशियाँ', ta: 'The 12 Rashis', te: 'The 12 Rashis', bn: 'The 12 Rashis', kn: 'The 12 Rashis', gu: 'The 12 Rashis' } },
  { id: '3-2', phase: 1, topic: 'Rashis',      title: { en: 'Sign Qualities', hi: 'राशि गुण', sa: 'राशि गुण', mai: 'राशि गुण', mr: 'राशि गुण', ta: 'Sign Qualities', te: 'Sign Qualities', bn: 'Sign Qualities', kn: 'Sign Qualities', gu: 'Sign Qualities' } },
  { id: '3-3', phase: 1, topic: 'Rashis',      title: { en: 'Sign Lordship', hi: 'राशि स्वामित्व', sa: 'राशि स्वामित्व', mai: 'राशि स्वामित्व', mr: 'राशि स्वामित्व', ta: 'Sign Lordship', te: 'Sign Lordship', bn: 'Sign Lordship', kn: 'Sign Lordship', gu: 'Sign Lordship' } },
  // Ayanamsha
  { id: '4-1', phase: 1, topic: 'Ayanamsha',   title: { en: 'Earth Wobble', hi: 'अयनगति भौतिकी', sa: 'अयनगति भौतिकी', mai: 'अयनगति भौतिकी', mr: 'अयनगति भौतिकी', ta: 'Earth Wobble', te: 'Earth Wobble', bn: 'Earth Wobble', kn: 'Earth Wobble', gu: 'Earth Wobble' } },
  { id: '4-2', phase: 1, topic: 'Ayanamsha',   title: { en: 'Two Zodiacs', hi: 'दो राशिचक्र', sa: 'दो राशिचक्र', mai: 'दो राशिचक्र', mr: 'दो राशिचक्र', ta: 'Two Zodiacs', te: 'Two Zodiacs', bn: 'Two Zodiacs', kn: 'Two Zodiacs', gu: 'Two Zodiacs' } },
  { id: '4-3', phase: 1, topic: 'Ayanamsha',   title: { en: 'Ayanamsha Systems', hi: 'अयनांश पद्धतियाँ', sa: 'अयनांश पद्धतियाँ', mai: 'अयनांश पद्धतियाँ', mr: 'अयनांश पद्धतियाँ', ta: 'Ayanamsha Systems', te: 'Ayanamsha Systems', bn: 'Ayanamsha Systems', kn: 'Ayanamsha Systems', gu: 'Ayanamsha Systems' } },

  // ── Phase 2: Pancha Anga ─────────────────────────────────────────────────
  // Tithi
  { id: '5-1', phase: 2, topic: 'Tithi',                 title: { en: 'What Is a Tithi?', hi: 'तिथि क्या है?', sa: 'तिथि क्या है?', mai: 'तिथि क्या है?', mr: 'तिथि क्या है?', ta: 'What Is a Tithi?', te: 'What Is a Tithi?', bn: 'What Is a Tithi?', kn: 'What Is a Tithi?', gu: 'What Is a Tithi?' } },
  { id: '5-2', phase: 2, topic: 'Tithi',                 title: { en: 'Shukla & Krishna Paksha', hi: 'शुक्ल एवं कृष्ण पक्ष', sa: 'शुक्ल एवं कृष्ण पक्ष', mai: 'शुक्ल एवं कृष्ण पक्ष', mr: 'शुक्ल एवं कृष्ण पक्ष', ta: 'Shukla & Krishna Paksha', te: 'Shukla & Krishna Paksha', bn: 'Shukla & Krishna Paksha', kn: 'Shukla & Krishna Paksha', gu: 'Shukla & Krishna Paksha' } },
  { id: '5-3', phase: 2, topic: 'Tithi',                 title: { en: 'Special Tithis & Vrat', hi: 'विशेष तिथियाँ', sa: 'विशेष तिथियाँ', mai: 'विशेष तिथियाँ', mr: 'विशेष तिथियाँ', ta: 'Special Tithis & Vrat', te: 'Special Tithis & Vrat', bn: 'Special Tithis & Vrat', kn: 'Special Tithis & Vrat', gu: 'Special Tithis & Vrat' } },
  // Nakshatra
  { id: '6-1', phase: 2, topic: 'Nakshatra',             title: { en: 'The 27 Nakshatras', hi: '27 नक्षत्र', sa: '27 नक्षत्र', mai: '27 नक्षत्र', mr: '27 नक्षत्र', ta: 'The 27 Nakshatras', te: 'The 27 Nakshatras', bn: 'The 27 Nakshatras', kn: 'The 27 Nakshatras', gu: 'The 27 Nakshatras' } },
  { id: '6-2', phase: 2, topic: 'Nakshatra',             title: { en: 'Padas & Navamsha', hi: 'पाद एवं नवांश', sa: 'पाद एवं नवांश', mai: 'पाद एवं नवांश', mr: 'पाद एवं नवांश', ta: 'Padas & Navamsha', te: 'Padas & Navamsha', bn: 'Padas & Navamsha', kn: 'Padas & Navamsha', gu: 'Padas & Navamsha' } },
  { id: '6-3', phase: 2, topic: 'Nakshatra',             title: { en: 'Nakshatra Dasha Lords', hi: 'दशा स्वामी', sa: 'दशा स्वामी', mai: 'दशा स्वामी', mr: 'दशा स्वामी', ta: 'Nakshatra Dasha Lords', te: 'Nakshatra Dasha Lords', bn: 'Nakshatra Dasha Lords', kn: 'Nakshatra Dasha Lords', gu: 'Nakshatra Dasha Lords' } },
  { id: '6-4', phase: 2, topic: 'Nakshatra',             title: { en: 'Gana, Yoni, Nadi', hi: 'गण, योनि, नाडी', sa: 'गण, योनि, नाडी', mai: 'गण, योनि, नाडी', mr: 'गण, योनि, नाडी', ta: 'Gana, Yoni, Nadi', te: 'Gana, Yoni, Nadi', bn: 'Gana, Yoni, Nadi', kn: 'Gana, Yoni, Nadi', gu: 'Gana, Yoni, Nadi' } },
  // Yoga, Karana & Vara
  { id: '7-1', phase: 2, topic: 'Yoga, Karana & Vara',   title: { en: 'Panchang Yoga', hi: 'पंचांग योग', sa: 'पंचांग योग', mai: 'पंचांग योग', mr: 'पंचांग योग', ta: 'Panchang Yoga', te: 'Panchang Yoga', bn: 'Panchang Yoga', kn: 'Panchang Yoga', gu: 'Panchang Yoga' } },
  { id: '7-2', phase: 2, topic: 'Yoga, Karana & Vara',   title: { en: 'Karana', hi: 'करण', sa: 'करण', mai: 'करण', mr: 'करण', ta: 'Karana', te: 'Karana', bn: 'Karana', kn: 'Karana', gu: 'Karana' } },
  { id: '7-3', phase: 2, topic: 'Yoga, Karana & Vara',   title: { en: 'Vara & Hora', hi: 'वार एवं होरा', sa: 'वार एवं होरा', mai: 'वार एवं होरा', mr: 'वार एवं होरा', ta: 'Vara & Hora', te: 'Vara & Hora', bn: 'Vara & Hora', kn: 'Vara & Hora', gu: 'Vara & Hora' } },
  { id: '7-4', phase: 2, topic: 'Yoga, Karana & Vara',   title: { en: 'Why 7 Days? — Chaldean Order', hi: '7 दिन क्यों? — कैल्डियन क्रम', sa: '7 दिन क्यों? — कैल्डियन क्रम', mai: '7 दिन क्यों? — कैल्डियन क्रम', mr: '7 दिन क्यों? — कैल्डियन क्रम', ta: 'Why 7 Days? — Chaldean Order', te: 'Why 7 Days? — Chaldean Order', bn: 'Why 7 Days? — Chaldean Order', kn: 'Why 7 Days? — Chaldean Order', gu: 'Why 7 Days? — Chaldean Order' } },
  // Muhurta
  { id: '8-1', phase: 2, topic: 'Muhurta',               title: { en: '30 Muhurtas Per Day', hi: '30 मुहूर्त', sa: '30 मुहूर्त', mai: '30 मुहूर्त', mr: '30 मुहूर्त', ta: '30 Muhurtas Per Day', te: '30 Muhurtas Per Day', bn: '30 Muhurtas Per Day', kn: '30 Muhurtas Per Day', gu: '30 Muhurtas Per Day' } },

  // ── Phase 3: The Chart ───────────────────────────────────────────────────
  // Kundali
  { id: '9-1',  phase: 3, topic: 'Kundali',   title: { en: 'What Is a Birth Chart?', hi: 'जन्म कुण्डली', sa: 'जन्म कुण्डली', mai: 'जन्म कुण्डली', mr: 'जन्म कुण्डली', ta: 'What Is a Birth Chart?', te: 'What Is a Birth Chart?', bn: 'What Is a Birth Chart?', kn: 'What Is a Birth Chart?', gu: 'What Is a Birth Chart?' } },
  { id: '9-2',  phase: 3, topic: 'Kundali',   title: { en: 'Computing the Lagna', hi: 'लग्न गणना', sa: 'लग्न गणना', mai: 'लग्न गणना', mr: 'लग्न गणना', ta: 'Computing the Lagna', te: 'Computing the Lagna', bn: 'Computing the Lagna', kn: 'Computing the Lagna', gu: 'Computing the Lagna' } },
  { id: '9-3',  phase: 3, topic: 'Kundali',   title: { en: 'Placing Planets', hi: 'ग्रह स्थापन', sa: 'ग्रह स्थापन', mai: 'ग्रह स्थापन', mr: 'ग्रह स्थापन', ta: 'Placing Planets', te: 'Placing Planets', bn: 'Placing Planets', kn: 'Placing Planets', gu: 'Placing Planets' } },
  { id: '9-4',  phase: 3, topic: 'Kundali',   title: { en: 'Reading a Chart', hi: 'कुण्डली पठन', sa: 'कुण्डली पठन', mai: 'कुण्डली पठन', mr: 'कुण्डली पठन', ta: 'Reading a Chart', te: 'Reading a Chart', bn: 'Reading a Chart', kn: 'Reading a Chart', gu: 'Reading a Chart' } },
  // Bhavas
  { id: '10-1', phase: 3, topic: 'Bhavas',    title: { en: '12 Houses', hi: '12 भाव', sa: '12 भाव', mai: '12 भाव', mr: '12 भाव', ta: '12 Houses', te: '12 Houses', bn: '12 Houses', kn: '12 Houses', gu: '12 Houses' } },
  { id: '10-2', phase: 3, topic: 'Bhavas',    title: { en: 'Kendra, Trikona, Dusthana', hi: 'केंद्र, त्रिकोण, दुःस्थान', sa: 'केंद्र, त्रिकोण, दुःस्थान', mai: 'केंद्र, त्रिकोण, दुःस्थान', mr: 'केंद्र, त्रिकोण, दुःस्थान', ta: 'Kendra, Trikona, Dusthana', te: 'Kendra, Trikona, Dusthana', bn: 'Kendra, Trikona, Dusthana', kn: 'Kendra, Trikona, Dusthana', gu: 'Kendra, Trikona, Dusthana' } },
  { id: '10-3', phase: 3, topic: 'Bhavas',    title: { en: 'House Lords', hi: 'भावेश', sa: 'भावेश', mai: 'भावेश', mr: 'भावेश', ta: 'House Lords', te: 'House Lords', bn: 'House Lords', kn: 'House Lords', gu: 'House Lords' } },
  // Vargas
  { id: '11-1', phase: 3, topic: 'Vargas',    title: { en: 'Why Divisional Charts?', hi: 'विभागीय चार्ट', sa: 'विभागीय चार्ट', mai: 'विभागीय चार्ट', mr: 'विभागीय चार्ट', ta: 'Why Divisional Charts?', te: 'Why Divisional Charts?', bn: 'Why Divisional Charts?', kn: 'Why Divisional Charts?', gu: 'Why Divisional Charts?' } },
  { id: '11-2', phase: 3, topic: 'Vargas',    title: { en: 'Navamsha (D9)', hi: 'नवांश', sa: 'नवांश', mai: 'नवांश', mr: 'नवांश', ta: 'Navamsha (D9)', te: 'Navamsha (D9)', bn: 'Navamsha (D9)', kn: 'Navamsha (D9)', gu: 'Navamsha (D9)' } },
  { id: '11-3', phase: 3, topic: 'Vargas',    title: { en: 'Key Vargas D2-D60', hi: 'प्रमुख वर्ग', sa: 'प्रमुख वर्ग', mai: 'प्रमुख वर्ग', mr: 'प्रमुख वर्ग', ta: 'Key Vargas D2-D60', te: 'Key Vargas D2-D60', bn: 'Key Vargas D2-D60', kn: 'Key Vargas D2-D60', gu: 'Key Vargas D2-D60' } },
  // Dashas
  { id: '12-1', phase: 3, topic: 'Dashas',    title: { en: 'Vimshottari', hi: 'विंशोत्तरी', sa: 'विंशोत्तरी', mai: 'विंशोत्तरी', mr: 'विंशोत्तरी', ta: 'Vimshottari', te: 'Vimshottari', bn: 'Vimshottari', kn: 'Vimshottari', gu: 'Vimshottari' } },
  { id: '12-2', phase: 3, topic: 'Dashas',    title: { en: 'Reading Dasha Periods', hi: 'दशा पठन', sa: 'दशा पठन', mai: 'दशा पठन', mr: 'दशा पठन', ta: 'Reading Dasha Periods', te: 'Reading Dasha Periods', bn: 'Reading Dasha Periods', kn: 'Reading Dasha Periods', gu: 'Reading Dasha Periods' } },
  { id: '12-3', phase: 3, topic: 'Dashas',    title: { en: 'Timing Events', hi: 'घटना समय', sa: 'घटना समय', mai: 'घटना समय', mr: 'घटना समय', ta: 'Timing Events', te: 'Timing Events', bn: 'Timing Events', kn: 'Timing Events', gu: 'Timing Events' } },
  // Transits
  { id: '13-1', phase: 3, topic: 'Transits',  title: { en: 'How Transits Work', hi: 'गोचर', sa: 'गोचर', mai: 'गोचर', mr: 'गोचर', ta: 'How Transits Work', te: 'How Transits Work', bn: 'How Transits Work', kn: 'How Transits Work', gu: 'How Transits Work' } },
  { id: '13-2', phase: 3, topic: 'Transits',  title: { en: 'Sade Sati', hi: 'साढ़े साती', sa: 'साढ़े साती', mai: 'साढ़े साती', mr: 'साढ़े साती', ta: 'Sade Sati', te: 'Sade Sati', bn: 'Sade Sati', kn: 'Sade Sati', gu: 'Sade Sati' } },
  { id: '13-3', phase: 3, topic: 'Transits',  title: { en: 'Ashtakavarga Transit Scoring', hi: 'अष्टकवर्ग गोचर', sa: 'अष्टकवर्ग गोचर', mai: 'अष्टकवर्ग गोचर', mr: 'अष्टकवर्ग गोचर', ta: 'Ashtakavarga Transit Scoring', te: 'Ashtakavarga Transit Scoring', bn: 'Ashtakavarga Transit Scoring', kn: 'Ashtakavarga Transit Scoring', gu: 'Ashtakavarga Transit Scoring' } },
  { id: '13-4', phase: 3, topic: 'Transits',  title: { en: 'Eclipses — Grahan & Rahu-Ketu Axis', hi: 'ग्रहण — राहु-केतु अक्ष', sa: 'ग्रहण — राहु-केतु अक्ष', mai: 'ग्रहण — राहु-केतु अक्ष', mr: 'ग्रहण — राहु-केतु अक्ष', ta: 'Eclipses — Grahan & Rahu-Ketu Axis', te: 'Eclipses — Grahan & Rahu-Ketu Axis', bn: 'Eclipses — Grahan & Rahu-Ketu Axis', kn: 'Eclipses — Grahan & Rahu-Ketu Axis', gu: 'Eclipses — Grahan & Rahu-Ketu Axis' } },

  // ── Phase 4: Applied Jyotish ─────────────────────────────────────────────
  // Compatibility
  { id: '14-1', phase: 4, topic: 'Compatibility',    title: { en: 'Ashta Kuta', hi: 'अष्ट कूट', sa: 'अष्ट कूट', mai: 'अष्ट कूट', mr: 'अष्ट कूट', ta: 'Ashta Kuta', te: 'Ashta Kuta', bn: 'Ashta Kuta', kn: 'Ashta Kuta', gu: 'Ashta Kuta' } },
  { id: '14-2', phase: 4, topic: 'Compatibility',    title: { en: 'Key Kutas & Doshas', hi: 'प्रमुख कूट', sa: 'प्रमुख कूट', mai: 'प्रमुख कूट', mr: 'प्रमुख कूट', ta: 'Key Kutas & Doshas', te: 'Key Kutas & Doshas', bn: 'Key Kutas & Doshas', kn: 'Key Kutas & Doshas', gu: 'Key Kutas & Doshas' } },
  { id: '14-3', phase: 4, topic: 'Compatibility',    title: { en: 'Beyond Kuta', hi: 'कूट से परे', sa: 'कूट से परे', mai: 'कूट से परे', mr: 'कूट से परे', ta: 'Beyond Kuta', te: 'Beyond Kuta', bn: 'Beyond Kuta', kn: 'Beyond Kuta', gu: 'Beyond Kuta' } },
  // Yogas & Doshas
  { id: '15-1', phase: 4, topic: 'Yogas & Doshas',   title: { en: 'Pancha Mahapurusha', hi: 'पंच महापुरुष', sa: 'पंच महापुरुष', mai: 'पंच महापुरुष', mr: 'पंच महापुरुष', ta: 'Pancha Mahapurusha', te: 'Pancha Mahapurusha', bn: 'Pancha Mahapurusha', kn: 'Pancha Mahapurusha', gu: 'Pancha Mahapurusha' } },
  { id: '15-2', phase: 4, topic: 'Yogas & Doshas',   title: { en: 'Raja & Dhana Yogas', hi: 'राज एवं धन योग', sa: 'राज एवं धन योग', mai: 'राज एवं धन योग', mr: 'राज एवं धन योग', ta: 'Raja & Dhana Yogas', te: 'Raja & Dhana Yogas', bn: 'Raja & Dhana Yogas', kn: 'Raja & Dhana Yogas', gu: 'Raja & Dhana Yogas' } },
  { id: '15-3', phase: 4, topic: 'Yogas & Doshas',   title: { en: 'Common Doshas', hi: 'प्रमुख दोष', sa: 'प्रमुख दोष', mai: 'प्रमुख दोष', mr: 'प्रमुख दोष', ta: 'Common Doshas', te: 'Common Doshas', bn: 'Common Doshas', kn: 'Common Doshas', gu: 'Common Doshas' } },
  { id: '15-4', phase: 4, topic: 'Yogas & Doshas',   title: { en: 'Remedial Measures', hi: 'उपाय', sa: 'उपाय', mai: 'उपाय', mr: 'उपाय', ta: 'Remedial Measures', te: 'Remedial Measures', bn: 'Remedial Measures', kn: 'Remedial Measures', gu: 'Remedial Measures' } },

  // ── Phase 5: Classical Knowledge ─────────────────────────────────────────
  { id: '16-1', phase: 5, topic: 'Classical Texts',  title: { en: 'Astronomical Texts', hi: 'खगोलशास्त्रीय', sa: 'खगोलशास्त्रीय', mai: 'खगोलशास्त्रीय', mr: 'खगोलशास्त्रीय', ta: 'Astronomical Texts', te: 'Astronomical Texts', bn: 'Astronomical Texts', kn: 'Astronomical Texts', gu: 'Astronomical Texts' } },
  { id: '16-2', phase: 5, topic: 'Classical Texts',  title: { en: 'Hora Texts', hi: 'होरा ग्रंथ', sa: 'होरा ग्रंथ', mai: 'होरा ग्रंथ', mr: 'होरा ग्रंथ', ta: 'Hora Texts', te: 'Hora Texts', bn: 'Hora Texts', kn: 'Hora Texts', gu: 'Hora Texts' } },
  { id: '16-3', phase: 5, topic: 'Classical Texts',  title: { en: "India's Contributions", hi: 'भारत का योगदान', sa: 'भारत का योगदान', mai: 'भारत का योगदान', mr: 'भारत का योगदान', ta: "India's Contributions", te: "India's Contributions", bn: "India's Contributions", kn: "India's Contributions", gu: "India's Contributions" } },
  // Muhurta
  { id: '17-1', phase: 5, topic: 'Muhurta',          title: { en: 'Muhurta Selection', hi: 'मुहूर्त चयन', sa: 'मुहूर्त चयन', mai: 'मुहूर्त चयन', mr: 'मुहूर्त चयन', ta: 'Muhurta Selection', te: 'Muhurta Selection', bn: 'Muhurta Selection', kn: 'Muhurta Selection', gu: 'Muhurta Selection' } },
  { id: '17-2', phase: 5, topic: 'Muhurta',          title: { en: 'Muhurta for Marriage', hi: 'विवाह मुहूर्त', sa: 'विवाह मुहूर्त', mai: 'विवाह मुहूर्त', mr: 'विवाह मुहूर्त', ta: 'Muhurta for Marriage', te: 'Muhurta for Marriage', bn: 'Muhurta for Marriage', kn: 'Muhurta for Marriage', gu: 'Muhurta for Marriage' } },
  { id: '17-3', phase: 5, topic: 'Muhurta',          title: { en: 'Muhurta for Property', hi: 'सम्पत्ति मुहूर्त', sa: 'सम्पत्ति मुहूर्त', mai: 'सम्पत्ति मुहूर्त', mr: 'सम्पत्ति मुहूर्त', ta: 'Muhurta for Property', te: 'Muhurta for Property', bn: 'Muhurta for Property', kn: 'Muhurta for Property', gu: 'Muhurta for Property' } },
  { id: '17-4', phase: 5, topic: 'Muhurta',          title: { en: 'Muhurta for Education', hi: 'शिक्षा मुहूर्त', sa: 'शिक्षा मुहूर्त', mai: 'शिक्षा मुहूर्त', mr: 'शिक्षा मुहूर्त', ta: 'Muhurta for Education', te: 'Muhurta for Education', bn: 'Muhurta for Education', kn: 'Muhurta for Education', gu: 'Muhurta for Education' } },
  // Strength
  { id: '18-1', phase: 5, topic: 'Strength',         title: { en: 'Shadbala — 6-Fold Strength', hi: 'षड्बल', sa: 'षड्बल', mai: 'षड्बल', mr: 'षड्बल', ta: 'Shadbala — 6-Fold Strength', te: 'Shadbala — 6-Fold Strength', bn: 'Shadbala — 6-Fold Strength', kn: 'Shadbala — 6-Fold Strength', gu: 'Shadbala — 6-Fold Strength' } },
  { id: '18-2', phase: 5, topic: 'Strength',         title: { en: 'Bhavabala — House Strength', hi: 'भावबल', sa: 'भावबल', mai: 'भावबल', mr: 'भावबल', ta: 'Bhavabala — House Strength', te: 'Bhavabala — House Strength', bn: 'Bhavabala — House Strength', kn: 'Bhavabala — House Strength', gu: 'Bhavabala — House Strength' } },
  { id: '18-3', phase: 5, topic: 'Strength',         title: { en: 'Ashtakavarga — Bindu Scoring', hi: 'अष्टकवर्ग', sa: 'अष्टकवर्ग', mai: 'अष्टकवर्ग', mr: 'अष्टकवर्ग', ta: 'Ashtakavarga — Bindu Scoring', te: 'Ashtakavarga — Bindu Scoring', bn: 'Ashtakavarga — Bindu Scoring', kn: 'Ashtakavarga — Bindu Scoring', gu: 'Ashtakavarga — Bindu Scoring' } },
  { id: '18-4', phase: 5, topic: 'Strength',         title: { en: 'Avasthas — Planetary States', hi: 'अवस्थाएँ', sa: 'अवस्थाएँ', mai: 'अवस्थाएँ', mr: 'अवस्थाएँ', ta: 'Avasthas — Planetary States', te: 'Avasthas — Planetary States', bn: 'Avasthas — Planetary States', kn: 'Avasthas — Planetary States', gu: 'Avasthas — Planetary States' } },
  { id: '18-5', phase: 5, topic: 'Strength',         title: { en: 'Vimshopaka — Varga Strength', hi: 'विंशोपक बल', sa: 'विंशोपक बल', mai: 'विंशोपक बल', mr: 'विंशोपक बल', ta: 'Vimshopaka — Varga Strength', te: 'Vimshopaka — Varga Strength', bn: 'Vimshopaka — Varga Strength', kn: 'Vimshopaka — Varga Strength', gu: 'Vimshopaka — Varga Strength' } },

  // ── Phase 6: Jaimini ──────────────────────────────────────────────────────
  { id: '19-1', phase: 6, topic: 'Jaimini',          title: { en: 'Chara Karakas', hi: 'चर कारक', sa: 'चर कारक', mai: 'चर कारक', mr: 'चर कारक', ta: 'Chara Karakas', te: 'Chara Karakas', bn: 'Chara Karakas', kn: 'Chara Karakas', gu: 'Chara Karakas' } },
  { id: '19-2', phase: 6, topic: 'Jaimini',          title: { en: 'Rashi Drishti', hi: 'राशि दृष्टि', sa: 'राशि दृष्टि', mai: 'राशि दृष्टि', mr: 'राशि दृष्टि', ta: 'Rashi Drishti', te: 'Rashi Drishti', bn: 'Rashi Drishti', kn: 'Rashi Drishti', gu: 'Rashi Drishti' } },
  { id: '19-3', phase: 6, topic: 'Jaimini',          title: { en: 'Argala', hi: 'अर्गला', sa: 'अर्गला', mai: 'अर्गला', mr: 'अर्गला', ta: 'Argala', te: 'Argala', bn: 'Argala', kn: 'Argala', gu: 'Argala' } },
  { id: '19-4', phase: 6, topic: 'Jaimini',          title: { en: 'Special Lagnas', hi: 'विशेष लग्न', sa: 'विशेष लग्न', mai: 'विशेष लग्न', mr: 'विशेष लग्न', ta: 'Special Lagnas', te: 'Special Lagnas', bn: 'Special Lagnas', kn: 'Special Lagnas', gu: 'Special Lagnas' } },

  // ── Phase 7: KP System ────────────────────────────────────────────────────
  { id: '20-1', phase: 7, topic: 'KP System',        title: { en: 'Placidus Houses', hi: 'प्लेसिडस भाव', sa: 'प्लेसिडस भाव', mai: 'प्लेसिडस भाव', mr: 'प्लेसिडस भाव', ta: 'Placidus Houses', te: 'Placidus Houses', bn: 'Placidus Houses', kn: 'Placidus Houses', gu: 'Placidus Houses' } },
  { id: '20-2', phase: 7, topic: 'KP System',        title: { en: '249 Sub-Lord Table', hi: '249 उप-स्वामी सारणी', sa: '249 उप-स्वामी सारणी', mai: '249 उप-स्वामी सारणी', mr: '249 उप-स्वामी सारणी', ta: '249 Sub-Lord Table', te: '249 Sub-Lord Table', bn: '249 Sub-Lord Table', kn: '249 Sub-Lord Table', gu: '249 Sub-Lord Table' } },
  { id: '20-3', phase: 7, topic: 'KP System',        title: { en: 'Significators', hi: 'कारकत्व', sa: 'कारकत्व', mai: 'कारकत्व', mr: 'कारकत्व', ta: 'Significators', te: 'Significators', bn: 'Significators', kn: 'Significators', gu: 'Significators' } },
  { id: '20-4', phase: 7, topic: 'KP System',        title: { en: 'Ruling Planets', hi: 'शासक ग्रह', sa: 'शासक ग्रह', mai: 'शासक ग्रह', mr: 'शासक ग्रह', ta: 'Ruling Planets', te: 'Ruling Planets', bn: 'Ruling Planets', kn: 'Ruling Planets', gu: 'Ruling Planets' } },

  // ── Phase 8: Varshaphal ───────────────────────────────────────────────────
  { id: '21-1', phase: 8, topic: 'Varshaphal',       title: { en: 'Tajika Aspects', hi: 'ताजिक दृष्टि', sa: 'ताजिक दृष्टि', mai: 'ताजिक दृष्टि', mr: 'ताजिक दृष्टि', ta: 'Tajika Aspects', te: 'Tajika Aspects', bn: 'Tajika Aspects', kn: 'Tajika Aspects', gu: 'Tajika Aspects' } },
  { id: '21-2', phase: 8, topic: 'Varshaphal',       title: { en: 'Sahams', hi: 'सहम', sa: 'सहम', mai: 'सहम', mr: 'सहम', ta: 'Sahams', te: 'Sahams', bn: 'Sahams', kn: 'Sahams', gu: 'Sahams' } },
  { id: '21-3', phase: 8, topic: 'Varshaphal',       title: { en: 'Mudda Dasha', hi: 'मुद्दा दशा', sa: 'मुद्दा दशा', mai: 'मुद्दा दशा', mr: 'मुद्दा दशा', ta: 'Mudda Dasha', te: 'Mudda Dasha', bn: 'Mudda Dasha', kn: 'Mudda Dasha', gu: 'Mudda Dasha' } },
  { id: '21-4', phase: 8, topic: 'Varshaphal',       title: { en: 'Tithi Pravesha', hi: 'तिथि प्रवेश', sa: 'तिथि प्रवेश', mai: 'तिथि प्रवेश', mr: 'तिथि प्रवेश', ta: 'Tithi Pravesha', te: 'Tithi Pravesha', bn: 'Tithi Pravesha', kn: 'Tithi Pravesha', gu: 'Tithi Pravesha' } },

  // ── Phase 9: Astronomy ────────────────────────────────────────────────────
  { id: '22-1', phase: 9, topic: 'Astronomy',        title: { en: 'Julian Day', hi: 'जूलियन दिवस', sa: 'जूलियन दिवस', mai: 'जूलियन दिवस', mr: 'जूलियन दिवस', ta: 'Julian Day', te: 'Julian Day', bn: 'Julian Day', kn: 'Julian Day', gu: 'Julian Day' } },
  { id: '22-2', phase: 9, topic: 'Astronomy',        title: { en: 'Finding the Sun', hi: 'सूर्य की खोज', sa: 'सूर्य की खोज', mai: 'सूर्य की खोज', mr: 'सूर्य की खोज', ta: 'Finding the Sun', te: 'Finding the Sun', bn: 'Finding the Sun', kn: 'Finding the Sun', gu: 'Finding the Sun' } },
  { id: '22-3', phase: 9, topic: 'Astronomy',        title: { en: 'Finding the Moon', hi: 'चन्द्रमा की खोज', sa: 'चन्द्रमा की खोज', mai: 'चन्द्रमा की खोज', mr: 'चन्द्रमा की खोज', ta: 'Finding the Moon', te: 'Finding the Moon', bn: 'Finding the Moon', kn: 'Finding the Moon', gu: 'Finding the Moon' } },
  { id: '22-4', phase: 9, topic: 'Astronomy',        title: { en: 'Sunrise Calculation', hi: 'सूर्योदय गणना', sa: 'सूर्योदय गणना', mai: 'सूर्योदय गणना', mr: 'सूर्योदय गणना', ta: 'Sunrise Calculation', te: 'Sunrise Calculation', bn: 'Sunrise Calculation', kn: 'Sunrise Calculation', gu: 'Sunrise Calculation' } },
  { id: '22-5', phase: 9, topic: 'Astronomy',        title: { en: 'Moonrise Calculation', hi: 'चन्द्रोदय गणना', sa: 'चन्द्रोदय गणना', mai: 'चन्द्रोदय गणना', mr: 'चन्द्रोदय गणना', ta: 'Moonrise Calculation', te: 'Moonrise Calculation', bn: 'Moonrise Calculation', kn: 'Moonrise Calculation', gu: 'Moonrise Calculation' } },
  { id: '22-6', phase: 9, topic: 'Astronomy',        title: { en: 'Equation of Time', hi: 'समय का समीकरण', sa: 'समय का समीकरण', mai: 'समय का समीकरण', mr: 'समय का समीकरण', ta: 'Equation of Time', te: 'Equation of Time', bn: 'Equation of Time', kn: 'Equation of Time', gu: 'Equation of Time' } },

  // ── Phase 10: Advanced Prediction ─────────────────────────────────────────
  { id: '23-1', phase: 10, topic: 'Prediction',      title: { en: 'Eclipse Prediction', hi: 'ग्रहण भविष्यवाणी', sa: 'ग्रहण भविष्यवाणी', mai: 'ग्रहण भविष्यवाणी', mr: 'ग्रहण भविष्यवाणी', ta: 'Eclipse Prediction', te: 'Eclipse Prediction', bn: 'Eclipse Prediction', kn: 'Eclipse Prediction', gu: 'Eclipse Prediction' } },
  { id: '23-2', phase: 10, topic: 'Prediction',      title: { en: 'Retrograde & Combustion', hi: 'वक्री और अस्त', sa: 'वक्री और अस्त', mai: 'वक्री और अस्त', mr: 'वक्री और अस्त', ta: 'Retrograde & Combustion', te: 'Retrograde & Combustion', bn: 'Retrograde & Combustion', kn: 'Retrograde & Combustion', gu: 'Retrograde & Combustion' } },
  { id: '23-3', phase: 10, topic: 'Prediction',      title: { en: 'Chakra Systems', hi: 'चक्र प्रणालियाँ', sa: 'चक्र प्रणालियाँ', mai: 'चक्र प्रणालियाँ', mr: 'चक्र प्रणालियाँ', ta: 'Chakra Systems', te: 'Chakra Systems', bn: 'Chakra Systems', kn: 'Chakra Systems', gu: 'Chakra Systems' } },
  { id: '23-4', phase: 10, topic: 'Prediction',      title: { en: 'Sphutas & Sensitive Points', hi: 'स्फुट एवं संवेदनशील बिन्दु', sa: 'स्फुट एवं संवेदनशील बिन्दु', mai: 'स्फुट एवं संवेदनशील बिन्दु', mr: 'स्फुट एवं संवेदनशील बिन्दु', ta: 'Sphutas & Sensitive Points', te: 'Sphutas & Sensitive Points', bn: 'Sphutas & Sensitive Points', kn: 'Sphutas & Sensitive Points', gu: 'Sphutas & Sensitive Points' } },
  { id: '23-5', phase: 10, topic: 'Prediction',      title: { en: 'Prashna Yogas', hi: 'प्रश्न योग', sa: 'प्रश्न योग', mai: 'प्रश्न योग', mr: 'प्रश्न योग', ta: 'Prashna Yogas', te: 'Prashna Yogas', bn: 'Prashna Yogas', kn: 'Prashna Yogas', gu: 'Prashna Yogas' } },
  { id: '24-1', phase: 10, topic: 'Prediction',      title: { en: 'Ganda Mula Nakshatras', hi: 'गण्ड मूल नक्षत्र', sa: 'गण्ड मूल नक्षत्र', mai: 'गण्ड मूल नक्षत्र', mr: 'गण्ड मूल नक्षत्र', ta: 'Ganda Mula Nakshatras', te: 'Ganda Mula Nakshatras', bn: 'Ganda Mula Nakshatras', kn: 'Ganda Mula Nakshatras', gu: 'Ganda Mula Nakshatras' } },

  // ── Phase 11: India's Contributions to Science ────────────────────────────
  // Mathematics
  { id: '25-1', phase: 11, topic: 'Mathematics',     title: { en: 'Zero — The Most Dangerous Idea', hi: 'शून्य — सबसे खतरनाक विचार', sa: 'शून्य — सबसे खतरनाक विचार', mai: 'शून्य — सबसे खतरनाक विचार', mr: 'शून्य — सबसे खतरनाक विचार', ta: 'Zero — The Most Dangerous Idea', te: 'Zero — The Most Dangerous Idea', bn: 'Zero — The Most Dangerous Idea', kn: 'Zero — The Most Dangerous Idea', gu: 'Zero — The Most Dangerous Idea' } },
  { id: '25-2', phase: 11, topic: 'Mathematics',     title: { en: "Sine Is Sanskrit — Jya to Sine", hi: 'Sine संस्कृत है — ज्या से Sine', sa: 'Sine संस्कृत है — ज्या से Sine', mai: 'Sine संस्कृत है — ज्या से Sine', mr: 'Sine संस्कृत है — ज्या से Sine', ta: "Sine Is Sanskrit — Jya to Sine", te: "Sine Is Sanskrit — Jya to Sine", bn: "Sine Is Sanskrit — Jya to Sine", kn: "Sine Is Sanskrit — Jya to Sine", gu: "Sine Is Sanskrit — Jya to Sine" } },
  { id: '25-3', phase: 11, topic: 'Mathematics',     title: { en: 'π = 3.1416 — Aryabhata Nailed It', hi: 'π = 3.1416 — आर्यभट की सटीक गणना', sa: 'π = 3.1416 — आर्यभट की सटीक गणना', mai: 'π = 3.1416 — आर्यभट की सटीक गणना', mr: 'π = 3.1416 — आर्यभट की सटीक गणना', ta: 'π = 3.1416 — Aryabhata Nailed It', te: 'π = 3.1416 — Aryabhata Nailed It', bn: 'π = 3.1416 — Aryabhata Nailed It', kn: 'π = 3.1416 — Aryabhata Nailed It', gu: 'π = 3.1416 — Aryabhata Nailed It' } },
  { id: '25-4', phase: 11, topic: 'Mathematics',     title: { en: 'Negative Numbers — Less Than Nothing', hi: 'ऋणात्मक संख्याएँ — शून्य से कम', sa: 'ऋणात्मक संख्याएँ — शून्य से कम', mai: 'ऋणात्मक संख्याएँ — शून्य से कम', mr: 'ऋणात्मक संख्याएँ — शून्य से कम', ta: 'Negative Numbers — Less Than Nothing', te: 'Negative Numbers — Less Than Nothing', bn: 'Negative Numbers — Less Than Nothing', kn: 'Negative Numbers — Less Than Nothing', gu: 'Negative Numbers — Less Than Nothing' } },
  { id: '25-5', phase: 11, topic: 'Mathematics',     title: { en: 'Binary Code — 1,800 Years Early', hi: 'द्विआधारी — 1,800 वर्ष पहले', sa: 'द्विआधारी — 1,800 वर्ष पहले', mai: 'द्विआधारी — 1,800 वर्ष पहले', mr: 'द्विआधारी — 1,800 वर्ष पहले', ta: 'Binary Code — 1,800 Years Early', te: 'Binary Code — 1,800 Years Early', bn: 'Binary Code — 1,800 Years Early', kn: 'Binary Code — 1,800 Years Early', gu: 'Binary Code — 1,800 Years Early' } },
  { id: '25-6', phase: 11, topic: 'Mathematics',     title: { en: 'Fibonacci Started With Music', hi: 'फिबोनाची संगीत से शुरू हुआ', sa: 'फिबोनाची संगीत से शुरू हुआ', mai: 'फिबोनाची संगीत से शुरू हुआ', mr: 'फिबोनाची संगीत से शुरू हुआ', ta: 'Fibonacci Started With Music', te: 'Fibonacci Started With Music', bn: 'Fibonacci Started With Music', kn: 'Fibonacci Started With Music', gu: 'Fibonacci Started With Music' } },
  { id: '25-7', phase: 11, topic: 'Mathematics',     title: { en: 'Calculus — Kerala, Not Cambridge', hi: 'कैलकुलस — केरल, कैम्ब्रिज नहीं', sa: 'कैलकुलस — केरल, कैम्ब्रिज नहीं', mai: 'कैलकुलस — केरल, कैम्ब्रिज नहीं', mr: 'कैलकुलस — केरल, कैम्ब्रिज नहीं', ta: 'Calculus — Kerala, Not Cambridge', te: 'Calculus — Kerala, Not Cambridge', bn: 'Calculus — Kerala, Not Cambridge', kn: 'Calculus — Kerala, Not Cambridge', gu: 'Calculus — Kerala, Not Cambridge' } },
  { id: '25-8', phase: 11, topic: 'Mathematics',     title: { en: "Pythagorean Theorem — 300 Years Before Pythagoras", hi: "पाइथागोरस प्रमेय — पाइथागोरस से 300 वर्ष पहले", sa: "पाइथागोरस प्रमेय — पाइथागोरस से 300 वर्ष पहले", mai: "पाइथागोरस प्रमेय — पाइथागोरस से 300 वर्ष पहले", mr: "पाइथागोरस प्रमेय — पाइथागोरस से 300 वर्ष पहले", ta: "Pythagorean Theorem — 300 Years Before Pythagoras", te: "Pythagorean Theorem — 300 Years Before Pythagoras", bn: "Pythagorean Theorem — 300 Years Before Pythagoras", kn: "Pythagorean Theorem — 300 Years Before Pythagoras", gu: "Pythagorean Theorem — 300 Years Before Pythagoras" } },
  { id: '25-9', phase: 11, topic: 'Mathematics',     title: { en: 'Kerala School — When India Invented Calculus', hi: 'केरल स्कूल — जब भारत ने कलनशास्त्र खोजा', sa: 'केरल स्कूल — जब भारत ने कलनशास्त्र खोजा', mai: 'केरल स्कूल — जब भारत ने कलनशास्त्र खोजा', mr: 'केरल स्कूल — जब भारत ने कलनशास्त्र खोजा', ta: 'Kerala School — When India Invented Calculus', te: 'Kerala School — When India Invented Calculus', bn: 'Kerala School — When India Invented Calculus', kn: 'Kerala School — When India Invented Calculus', gu: 'Kerala School — When India Invented Calculus' } },
  // Astronomy & Physics
  { id: '26-1', phase: 11, topic: 'Astronomy & Physics', title: { en: 'Earth Rotates — 1,000 Years Before Europe', hi: 'पृथ्वी घूमती है — यूरोप से 1,000 वर्ष पहले', sa: 'पृथ्वी घूमती है — यूरोप से 1,000 वर्ष पहले', mai: 'पृथ्वी घूमती है — यूरोप से 1,000 वर्ष पहले', mr: 'पृथ्वी घूमती है — यूरोप से 1,000 वर्ष पहले', ta: 'Earth Rotates — 1,000 Years Before Europe', te: 'Earth Rotates — 1,000 Years Before Europe', bn: 'Earth Rotates — 1,000 Years Before Europe', kn: 'Earth Rotates — 1,000 Years Before Europe', gu: 'Earth Rotates — 1,000 Years Before Europe' } },
  { id: '26-2', phase: 11, topic: 'Astronomy & Physics', title: { en: 'Gravity — 500 Years Before Newton', hi: 'गुरुत्वाकर्षण — न्यूटन से 500 वर्ष पहले', sa: 'गुरुत्वाकर्षण — न्यूटन से 500 वर्ष पहले', mai: 'गुरुत्वाकर्षण — न्यूटन से 500 वर्ष पहले', mr: 'गुरुत्वाकर्षण — न्यूटन से 500 वर्ष पहले', ta: 'Gravity — 500 Years Before Newton', te: 'Gravity — 500 Years Before Newton', bn: 'Gravity — 500 Years Before Newton', kn: 'Gravity — 500 Years Before Newton', gu: 'Gravity — 500 Years Before Newton' } },
  { id: '26-3', phase: 11, topic: 'Astronomy & Physics', title: { en: 'Speed of Light — 14th Century Text', hi: 'प्रकाश की गति — 14वीं शताब्दी', sa: 'प्रकाश की गति — 14वीं शताब्दी', mai: 'प्रकाश की गति — 14वीं शताब्दी', mr: 'प्रकाश की गति — 14वीं शताब्दी', ta: 'Speed of Light — 14th Century Text', te: 'Speed of Light — 14th Century Text', bn: 'Speed of Light — 14th Century Text', kn: 'Speed of Light — 14th Century Text', gu: 'Speed of Light — 14th Century Text' } },
  { id: '26-4', phase: 11, topic: 'Astronomy & Physics', title: { en: '4.32 Billion Years — How Did They Know?', hi: '4.32 अरब वर्ष — कैसे पता था?', sa: '4.32 अरब वर्ष — कैसे पता था?', mai: '4.32 अरब वर्ष — कैसे पता था?', mr: '4.32 अरब वर्ष — कैसे पता था?', ta: '4.32 Billion Years — How Did They Know?', te: '4.32 Billion Years — How Did They Know?', bn: '4.32 Billion Years — How Did They Know?', kn: '4.32 Billion Years — How Did They Know?', gu: '4.32 Billion Years — How Did They Know?' } },
];

export const TOTAL_MODULES = MODULE_SEQUENCE.length;

// ── Phase metadata ────────────────────────────────────────────────────────────

interface PhaseInfo {
  phase: number;
  title: Record<string, string>;
  count: number;
}

export const PHASE_INFO: PhaseInfo[] = [
  { phase: 0, title: { en: 'Pre-Foundation', hi: 'पूर्व-आधार', sa: 'पूर्व-आधार', mai: 'पूर्व-आधार', mr: 'पूर्व-आधार', ta: 'Pre-Foundation', te: 'Pre-Foundation', bn: 'Pre-Foundation', kn: 'Pre-Foundation', gu: 'Pre-Foundation' },         count: MODULE_SEQUENCE.filter(m => m.phase === 0).length },
  { phase: 1, title: { en: 'The Sky', hi: 'आकाश', sa: 'आकाश', mai: 'आकाश', mr: 'आकाश', ta: 'The Sky', te: 'The Sky', bn: 'The Sky', kn: 'The Sky', gu: 'The Sky' },               count: MODULE_SEQUENCE.filter(m => m.phase === 1).length },
  { phase: 2, title: { en: 'Pancha Anga', hi: 'पंच अंग', sa: 'पंच अंग', mai: 'पंच अंग', mr: 'पंच अंग', ta: 'Pancha Anga', te: 'Pancha Anga', bn: 'Pancha Anga', kn: 'Pancha Anga', gu: 'Pancha Anga' },            count: MODULE_SEQUENCE.filter(m => m.phase === 2).length },
  { phase: 3, title: { en: 'The Chart', hi: 'कुण्डली', sa: 'कुण्डली', mai: 'कुण्डली', mr: 'कुण्डली', ta: 'The Chart', te: 'The Chart', bn: 'The Chart', kn: 'The Chart', gu: 'The Chart' },            count: MODULE_SEQUENCE.filter(m => m.phase === 3).length },
  { phase: 4, title: { en: 'Applied Jyotish', hi: 'व्यावहारिक ज्योतिष', sa: 'व्यावहारिक ज्योतिष', mai: 'व्यावहारिक ज्योतिष', mr: 'व्यावहारिक ज्योतिष', ta: 'Applied Jyotish', te: 'Applied Jyotish', bn: 'Applied Jyotish', kn: 'Applied Jyotish', gu: 'Applied Jyotish' }, count: MODULE_SEQUENCE.filter(m => m.phase === 4).length },
  { phase: 5, title: { en: 'Classical Knowledge', hi: 'शास्त्रीय ज्ञान', sa: 'शास्त्रीय ज्ञान', mai: 'शास्त्रीय ज्ञान', mr: 'शास्त्रीय ज्ञान', ta: 'Classical Knowledge', te: 'Classical Knowledge', bn: 'Classical Knowledge', kn: 'Classical Knowledge', gu: 'Classical Knowledge' },   count: MODULE_SEQUENCE.filter(m => m.phase === 5).length },
  { phase: 6, title: { en: 'Jaimini System', hi: 'जैमिनी पद्धति', sa: 'जैमिनी पद्धति', mai: 'जैमिनी पद्धति', mr: 'जैमिनी पद्धति', ta: 'Jaimini System', te: 'Jaimini System', bn: 'Jaimini System', kn: 'Jaimini System', gu: 'Jaimini System' },     count: MODULE_SEQUENCE.filter(m => m.phase === 6).length },
  { phase: 7, title: { en: 'KP System', hi: 'केपी पद्धति', sa: 'केपी पद्धति', mai: 'केपी पद्धति', mr: 'केपी पद्धति', ta: 'KP System', te: 'KP System', bn: 'KP System', kn: 'KP System', gu: 'KP System' },        count: MODULE_SEQUENCE.filter(m => m.phase === 7).length },
  { phase: 8, title: { en: 'Varshaphal', hi: 'वर्षफल', sa: 'वर्षफल', mai: 'वर्षफल', mr: 'वर्षफल', ta: 'Varshaphal', te: 'Varshaphal', bn: 'Varshaphal', kn: 'Varshaphal', gu: 'Varshaphal' },             count: MODULE_SEQUENCE.filter(m => m.phase === 8).length },
  { phase: 9, title: { en: 'Astronomy Engine', hi: 'खगोलीय गणना', sa: 'खगोलीय गणना', mai: 'खगोलीय गणना', mr: 'खगोलीय गणना', ta: 'Astronomy Engine', te: 'Astronomy Engine', bn: 'Astronomy Engine', kn: 'Astronomy Engine', gu: 'Astronomy Engine' },       count: MODULE_SEQUENCE.filter(m => m.phase === 9).length },
  { phase: 10, title: { en: 'Advanced Prediction', hi: 'उन्नत भविष्यवाणी', sa: 'उन्नत भविष्यवाणी', mai: 'उन्नत भविष्यवाणी', mr: 'उन्नत भविष्यवाणी', ta: 'Advanced Prediction', te: 'Advanced Prediction', bn: 'Advanced Prediction', kn: 'Advanced Prediction', gu: 'Advanced Prediction' },  count: MODULE_SEQUENCE.filter(m => m.phase === 10).length },
  { phase: 11, title: { en: "India's Contributions", hi: 'भारत का योगदान', sa: 'भारत का योगदान', mai: 'भारत का योगदान', mr: 'भारत का योगदान', ta: "India's Contributions", te: "India's Contributions", bn: "India's Contributions", kn: "India's Contributions", gu: "India's Contributions" },    count: MODULE_SEQUENCE.filter(m => m.phase === 11).length },
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
