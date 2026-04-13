'use client';

import { useLocale } from 'next-intl';
import { motion } from 'framer-motion';
import { Link } from '@/lib/i18n/navigation';
import { BookOpen, ChevronRight } from 'lucide-react';
import type { Locale } from '@/types/panchang';
import { useEffect } from 'react';
import { useLearningProgressStore } from '@/stores/learning-progress-store';
import ProgressIndicator from '@/components/learn/ProgressIndicator';
import LevelBadge from '@/components/learn/LevelBadge';
import { isDevanagariLocale } from '@/lib/utils/locale-fonts';

const PHASES = [
  { phase: 0, label: { en: 'Pre-Foundation', hi: 'पूर्व-आधार', sa: 'पूर्व-आधार', mai: 'पूर्व-आधार', mr: 'पूर्व-आधार', ta: 'Pre-Foundation', te: 'Pre-Foundation', bn: 'Pre-Foundation', kn: 'Pre-Foundation', gu: 'Pre-Foundation' }, color: 'border-gold-primary/20', topics: [
    { topic: 'Getting Started', modules: [
      { id: '0-1', title: { en: 'What is Jyotish? (And What It Isn\'t)', hi: 'ज्योतिष क्या है?' } },
      { id: '0-2', title: { en: 'The Hindu Calendar — Why It\'s Different', hi: 'हिन्दू पंचांग — यह अलग क्यों है' } },
      { id: '0-3', title: { en: 'Your Cosmic Address — Sun, Moon, Nakshatra', hi: 'आपका ब्रह्माण्डीय पता', sa: 'आपका ब्रह्माण्डीय पता', mai: 'आपका ब्रह्माण्डीय पता', mr: 'आपका ब्रह्माण्डीय पता', ta: 'Your Cosmic Address — Sun, Moon, Nakshatra', te: 'Your Cosmic Address — Sun, Moon, Nakshatra', bn: 'Your Cosmic Address — Sun, Moon, Nakshatra', kn: 'Your Cosmic Address — Sun, Moon, Nakshatra', gu: 'Your Cosmic Address — Sun, Moon, Nakshatra' } },
      { id: '0-4', title: { en: 'Reading Today\'s Panchang', hi: 'आज का पंचांग पढ़ना' } },
      { id: '0-5', title: { en: 'What is a Kundali?', hi: 'कुण्डली क्या है?', sa: 'कुण्डली क्या है?', mai: 'कुण्डली क्या है?', mr: 'कुण्डली क्या है?', ta: 'What is a Kundali?', te: 'What is a Kundali?', bn: 'What is a Kundali?', kn: 'What is a Kundali?', gu: 'What is a Kundali?' } },
    ]},
  ]},
  { phase: 1, label: { en: 'The Sky', hi: 'आकाश', sa: 'आकाश', mai: 'आकाश', mr: 'आकाश', ta: 'The Sky', te: 'The Sky', bn: 'The Sky', kn: 'The Sky', gu: 'The Sky' }, color: 'border-blue-500/20', topics: [
    { topic: 'Foundations', modules: [
      { id: '1-1', title: { en: 'The Night Sky & Ecliptic', hi: 'रात्रि आकाश एवं क्रान्तिवृत्त', sa: 'रात्रि आकाश एवं क्रान्तिवृत्त', mai: 'रात्रि आकाश एवं क्रान्तिवृत्त', mr: 'रात्रि आकाश एवं क्रान्तिवृत्त', ta: 'The Night Sky & Ecliptic', te: 'The Night Sky & Ecliptic', bn: 'The Night Sky & Ecliptic', kn: 'The Night Sky & Ecliptic', gu: 'The Night Sky & Ecliptic' } },
      { id: '1-2', title: { en: 'Measuring the Sky — Degrees, Signs & Nakshatras', hi: 'आकाश मापन', sa: 'आकाश मापन', mai: 'आकाश मापन', mr: 'आकाश मापन', ta: 'Measuring the Sky — Degrees, Signs & Nakshatras', te: 'Measuring the Sky — Degrees, Signs & Nakshatras', bn: 'Measuring the Sky — Degrees, Signs & Nakshatras', kn: 'Measuring the Sky — Degrees, Signs & Nakshatras', gu: 'Measuring the Sky — Degrees, Signs & Nakshatras' } },
      { id: '1-3', title: { en: 'The Zodiac Belt — Fixed Stars vs Moving Planets', hi: 'राशिचक्र पट्टी', sa: 'राशिचक्र पट्टी', mai: 'राशिचक्र पट्टी', mr: 'राशिचक्र पट्टी', ta: 'The Zodiac Belt — Fixed Stars vs Moving Planets', te: 'The Zodiac Belt — Fixed Stars vs Moving Planets', bn: 'The Zodiac Belt — Fixed Stars vs Moving Planets', kn: 'The Zodiac Belt — Fixed Stars vs Moving Planets', gu: 'The Zodiac Belt — Fixed Stars vs Moving Planets' } },
    ]},
    { topic: 'Grahas', modules: [
      { id: '2-1', title: { en: 'The Nine Grahas — Nature & Karakatva', hi: 'नवग्रह — प्रकृति एवं कारकत्व', sa: 'नवग्रह — प्रकृति एवं कारकत्व', mai: 'नवग्रह — प्रकृति एवं कारकत्व', mr: 'नवग्रह — प्रकृति एवं कारकत्व', ta: 'The Nine Grahas — Nature & Karakatva', te: 'The Nine Grahas — Nature & Karakatva', bn: 'The Nine Grahas — Nature & Karakatva', kn: 'The Nine Grahas — Nature & Karakatva', gu: 'The Nine Grahas — Nature & Karakatva' } },
      { id: '2-2', title: { en: 'Planetary Relationships — Friendship Matrix', hi: 'ग्रह संबंध — मित्रता सारणी', sa: 'ग्रह संबंध — मित्रता सारणी', mai: 'ग्रह संबंध — मित्रता सारणी', mr: 'ग्रह संबंध — मित्रता सारणी', ta: 'Planetary Relationships — Friendship Matrix', te: 'Planetary Relationships — Friendship Matrix', bn: 'Planetary Relationships — Friendship Matrix', kn: 'Planetary Relationships — Friendship Matrix', gu: 'Planetary Relationships — Friendship Matrix' } },
      { id: '2-3', title: { en: 'Dignities — Where Planets Thrive & Suffer', hi: 'ग्रह गरिमा', sa: 'ग्रह गरिमा', mai: 'ग्रह गरिमा', mr: 'ग्रह गरिमा', ta: 'Dignities — Where Planets Thrive & Suffer', te: 'Dignities — Where Planets Thrive & Suffer', bn: 'Dignities — Where Planets Thrive & Suffer', kn: 'Dignities — Where Planets Thrive & Suffer', gu: 'Dignities — Where Planets Thrive & Suffer' } },
      { id: '2-4', title: { en: 'Retrograde, Combustion & Planetary War', hi: 'वक्री, अस्त एवं ग्रह युद्ध', sa: 'वक्री, अस्त एवं ग्रह युद्ध', mai: 'वक्री, अस्त एवं ग्रह युद्ध', mr: 'वक्री, अस्त एवं ग्रह युद्ध', ta: 'Retrograde, Combustion & Planetary War', te: 'Retrograde, Combustion & Planetary War', bn: 'Retrograde, Combustion & Planetary War', kn: 'Retrograde, Combustion & Planetary War', gu: 'Retrograde, Combustion & Planetary War' } },
    ]},
    { topic: 'Rashis', modules: [
      { id: '3-1', title: { en: "The 12 Rashis — Parashara's Description", hi: '12 राशियाँ', sa: '12 राशियाँ', mai: '12 राशियाँ', mr: '12 राशियाँ', ta: "The 12 Rashis — Parashara's Description", te: "The 12 Rashis — Parashara's Description", bn: "The 12 Rashis — Parashara's Description", kn: "The 12 Rashis — Parashara's Description", gu: "The 12 Rashis — Parashara's Description" } },
      { id: '3-2', title: { en: 'Sign Qualities — Chara, Sthira, Dwiswabhava', hi: 'राशि गुण', sa: 'राशि गुण', mai: 'राशि गुण', mr: 'राशि गुण', ta: 'Sign Qualities — Chara, Sthira, Dwiswabhava', te: 'Sign Qualities — Chara, Sthira, Dwiswabhava', bn: 'Sign Qualities — Chara, Sthira, Dwiswabhava', kn: 'Sign Qualities — Chara, Sthira, Dwiswabhava', gu: 'Sign Qualities — Chara, Sthira, Dwiswabhava' } },
      { id: '3-3', title: { en: 'Sign Lordship & Luminaries', hi: 'राशि स्वामित्व', sa: 'राशि स्वामित्व', mai: 'राशि स्वामित्व', mr: 'राशि स्वामित्व', ta: 'Sign Lordship & Luminaries', te: 'Sign Lordship & Luminaries', bn: 'Sign Lordship & Luminaries', kn: 'Sign Lordship & Luminaries', gu: 'Sign Lordship & Luminaries' } },
    ]},
    { topic: 'Ayanamsha', modules: [
      { id: '4-1', title: { en: 'Earth Wobble — Precession Physics', hi: 'अयनगति भौतिकी', sa: 'अयनगति भौतिकी', mai: 'अयनगति भौतिकी', mr: 'अयनगति भौतिकी', ta: 'Earth Wobble — Precession Physics', te: 'Earth Wobble — Precession Physics', bn: 'Earth Wobble — Precession Physics', kn: 'Earth Wobble — Precession Physics', gu: 'Earth Wobble — Precession Physics' } },
      { id: '4-2', title: { en: 'Two Zodiacs — Tropical vs Sidereal', hi: 'दो राशिचक्र', sa: 'दो राशिचक्र', mai: 'दो राशिचक्र', mr: 'दो राशिचक्र', ta: 'Two Zodiacs — Tropical vs Sidereal', te: 'Two Zodiacs — Tropical vs Sidereal', bn: 'Two Zodiacs — Tropical vs Sidereal', kn: 'Two Zodiacs — Tropical vs Sidereal', gu: 'Two Zodiacs — Tropical vs Sidereal' } },
      { id: '4-3', title: { en: 'Ayanamsha Systems — The Great Debate', hi: 'अयनांश पद्धतियाँ', sa: 'अयनांश पद्धतियाँ', mai: 'अयनांश पद्धतियाँ', mr: 'अयनांश पद्धतियाँ', ta: 'Ayanamsha Systems — The Great Debate', te: 'Ayanamsha Systems — The Great Debate', bn: 'Ayanamsha Systems — The Great Debate', kn: 'Ayanamsha Systems — The Great Debate', gu: 'Ayanamsha Systems — The Great Debate' } },
    ]},
  ]},
  { phase: 2, label: { en: 'Pancha Anga', hi: 'पंच अंग', sa: 'पंच अंग', mai: 'पंच अंग', mr: 'पंच अंग', ta: 'Pancha Anga', te: 'Pancha Anga', bn: 'Pancha Anga', kn: 'Pancha Anga', gu: 'Pancha Anga' }, color: 'border-amber-500/20', topics: [
    { topic: 'Tithi', modules: [
      { id: '5-1', title: { en: 'What Is a Tithi?', hi: 'तिथि क्या है?', sa: 'तिथि क्या है?', mai: 'तिथि क्या है?', mr: 'तिथि क्या है?', ta: 'What Is a Tithi?', te: 'What Is a Tithi?', bn: 'What Is a Tithi?', kn: 'What Is a Tithi?', gu: 'What Is a Tithi?' } },
      { id: '5-2', title: { en: 'Shukla & Krishna Paksha', hi: 'शुक्ल एवं कृष्ण पक्ष', sa: 'शुक्ल एवं कृष्ण पक्ष', mai: 'शुक्ल एवं कृष्ण पक्ष', mr: 'शुक्ल एवं कृष्ण पक्ष', ta: 'Shukla & Krishna Paksha', te: 'Shukla & Krishna Paksha', bn: 'Shukla & Krishna Paksha', kn: 'Shukla & Krishna Paksha', gu: 'Shukla & Krishna Paksha' } },
      { id: '5-3', title: { en: 'Special Tithis & Vrat Calendar', hi: 'विशेष तिथियाँ', sa: 'विशेष तिथियाँ', mai: 'विशेष तिथियाँ', mr: 'विशेष तिथियाँ', ta: 'Special Tithis & Vrat Calendar', te: 'Special Tithis & Vrat Calendar', bn: 'Special Tithis & Vrat Calendar', kn: 'Special Tithis & Vrat Calendar', gu: 'Special Tithis & Vrat Calendar' } },
    ]},
    { topic: 'Nakshatra', modules: [
      { id: '6-1', title: { en: 'The 27 Nakshatras', hi: '27 नक्षत्र', sa: '27 नक्षत्र', mai: '27 नक्षत्र', mr: '27 नक्षत्र', ta: 'The 27 Nakshatras', te: 'The 27 Nakshatras', bn: 'The 27 Nakshatras', kn: 'The 27 Nakshatras', gu: 'The 27 Nakshatras' } },
      { id: '6-2', title: { en: 'Padas & Navamsha Connection', hi: 'पाद एवं नवांश', sa: 'पाद एवं नवांश', mai: 'पाद एवं नवांश', mr: 'पाद एवं नवांश', ta: 'Padas & Navamsha Connection', te: 'Padas & Navamsha Connection', bn: 'Padas & Navamsha Connection', kn: 'Padas & Navamsha Connection', gu: 'Padas & Navamsha Connection' } },
      { id: '6-3', title: { en: 'Nakshatra Dasha Lords', hi: 'दशा स्वामी', sa: 'दशा स्वामी', mai: 'दशा स्वामी', mr: 'दशा स्वामी', ta: 'Nakshatra Dasha Lords', te: 'Nakshatra Dasha Lords', bn: 'Nakshatra Dasha Lords', kn: 'Nakshatra Dasha Lords', gu: 'Nakshatra Dasha Lords' } },
      { id: '6-4', title: { en: 'Gana, Yoni, Nadi & Compatibility', hi: 'गण, योनि, नाडी', sa: 'गण, योनि, नाडी', mai: 'गण, योनि, नाडी', mr: 'गण, योनि, नाडी', ta: 'Gana, Yoni, Nadi & Compatibility', te: 'Gana, Yoni, Nadi & Compatibility', bn: 'Gana, Yoni, Nadi & Compatibility', kn: 'Gana, Yoni, Nadi & Compatibility', gu: 'Gana, Yoni, Nadi & Compatibility' } },
    ]},
    { topic: 'Yoga, Karana & Vara', modules: [
      { id: '7-1', title: { en: 'Panchang Yoga — Sun-Moon Sum', hi: 'पंचांग योग', sa: 'पंचांग योग', mai: 'पंचांग योग', mr: 'पंचांग योग', ta: 'Panchang Yoga — Sun-Moon Sum', te: 'Panchang Yoga — Sun-Moon Sum', bn: 'Panchang Yoga — Sun-Moon Sum', kn: 'Panchang Yoga — Sun-Moon Sum', gu: 'Panchang Yoga — Sun-Moon Sum' } },
      { id: '7-2', title: { en: 'Karana — Half-Tithi System', hi: 'करण', sa: 'करण', mai: 'करण', mr: 'करण', ta: 'Karana — Half-Tithi System', te: 'Karana — Half-Tithi System', bn: 'Karana — Half-Tithi System', kn: 'Karana — Half-Tithi System', gu: 'Karana — Half-Tithi System' } },
      { id: '7-3', title: { en: 'Vara & the Hora System', hi: 'वार एवं होरा', sa: 'वार एवं होरा', mai: 'वार एवं होरा', mr: 'वार एवं होरा', ta: 'Vara & the Hora System', te: 'Vara & the Hora System', bn: 'Vara & the Hora System', kn: 'Vara & the Hora System', gu: 'Vara & the Hora System' } },
      { id: '7-4', title: { en: 'Why 7 Days? — Chaldean Order & Indian Origins', hi: '7 दिन क्यों? — कैल्डियन क्रम और भारतीय उत्पत्ति', sa: '7 दिन क्यों? — कैल्डियन क्रम और भारतीय उत्पत्ति', mai: '7 दिन क्यों? — कैल्डियन क्रम और भारतीय उत्पत्ति', mr: '7 दिन क्यों? — कैल्डियन क्रम और भारतीय उत्पत्ति', ta: 'Why 7 Days? — Chaldean Order & Indian Origins', te: 'Why 7 Days? — Chaldean Order & Indian Origins', bn: 'Why 7 Days? — Chaldean Order & Indian Origins', kn: 'Why 7 Days? — Chaldean Order & Indian Origins', gu: 'Why 7 Days? — Chaldean Order & Indian Origins' } },
    ]},
    { topic: 'Muhurta', modules: [
      { id: '8-1', title: { en: '30 Muhurtas Per Day', hi: '30 मुहूर्त', sa: '30 मुहूर्त', mai: '30 मुहूर्त', mr: '30 मुहूर्त', ta: '30 Muhurtas Per Day', te: '30 Muhurtas Per Day', bn: '30 Muhurtas Per Day', kn: '30 Muhurtas Per Day', gu: '30 Muhurtas Per Day' } },
    ]},
  ]},
  { phase: 3, label: { en: 'The Chart', hi: 'कुण्डली', sa: 'कुण्डली', mai: 'कुण्डली', mr: 'कुण्डली', ta: 'The Chart', te: 'The Chart', bn: 'The Chart', kn: 'The Chart', gu: 'The Chart' }, color: 'border-emerald-500/20', topics: [
    { topic: 'Kundali', modules: [
      { id: '9-1', title: { en: 'What Is a Birth Chart?', hi: 'जन्म कुण्डली', sa: 'जन्म कुण्डली', mai: 'जन्म कुण्डली', mr: 'जन्म कुण्डली', ta: 'What Is a Birth Chart?', te: 'What Is a Birth Chart?', bn: 'What Is a Birth Chart?', kn: 'What Is a Birth Chart?', gu: 'What Is a Birth Chart?' } },
      { id: '9-2', title: { en: 'Computing the Lagna', hi: 'लग्न गणना', sa: 'लग्न गणना', mai: 'लग्न गणना', mr: 'लग्न गणना', ta: 'Computing the Lagna', te: 'Computing the Lagna', bn: 'Computing the Lagna', kn: 'Computing the Lagna', gu: 'Computing the Lagna' } },
      { id: '9-3', title: { en: 'Placing Planets', hi: 'ग्रह स्थापन', sa: 'ग्रह स्थापन', mai: 'ग्रह स्थापन', mr: 'ग्रह स्थापन', ta: 'Placing Planets', te: 'Placing Planets', bn: 'Placing Planets', kn: 'Placing Planets', gu: 'Placing Planets' } },
      { id: '9-4', title: { en: 'Reading a Chart', hi: 'कुण्डली पठन', sa: 'कुण्डली पठन', mai: 'कुण्डली पठन', mr: 'कुण्डली पठन', ta: 'Reading a Chart', te: 'Reading a Chart', bn: 'Reading a Chart', kn: 'Reading a Chart', gu: 'Reading a Chart' } },
    ]},
    { topic: 'Bhavas', modules: [
      { id: '10-1', title: { en: '12 Houses — Significations', hi: '12 भाव', sa: '12 भाव', mai: '12 भाव', mr: '12 भाव', ta: '12 Houses — Significations', te: '12 Houses — Significations', bn: '12 Houses — Significations', kn: '12 Houses — Significations', gu: '12 Houses — Significations' } },
      { id: '10-2', title: { en: 'Kendra, Trikona, Dusthana', hi: 'केंद्र, त्रिकोण, दुःस्थान', sa: 'केंद्र, त्रिकोण, दुःस्थान', mai: 'केंद्र, त्रिकोण, दुःस्थान', mr: 'केंद्र, त्रिकोण, दुःस्थान', ta: 'Kendra, Trikona, Dusthana', te: 'Kendra, Trikona, Dusthana', bn: 'Kendra, Trikona, Dusthana', kn: 'Kendra, Trikona, Dusthana', gu: 'Kendra, Trikona, Dusthana' } },
      { id: '10-3', title: { en: 'House Lords', hi: 'भावेश', sa: 'भावेश', mai: 'भावेश', mr: 'भावेश', ta: 'House Lords', te: 'House Lords', bn: 'House Lords', kn: 'House Lords', gu: 'House Lords' } },
    ]},
    { topic: 'Vargas', modules: [
      { id: '11-1', title: { en: 'Why Divisional Charts?', hi: 'विभागीय चार्ट', sa: 'विभागीय चार्ट', mai: 'विभागीय चार्ट', mr: 'विभागीय चार्ट', ta: 'Why Divisional Charts?', te: 'Why Divisional Charts?', bn: 'Why Divisional Charts?', kn: 'Why Divisional Charts?', gu: 'Why Divisional Charts?' } },
      { id: '11-2', title: { en: 'Navamsha (D9)', hi: 'नवांश', sa: 'नवांश', mai: 'नवांश', mr: 'नवांश', ta: 'Navamsha (D9)', te: 'Navamsha (D9)', bn: 'Navamsha (D9)', kn: 'Navamsha (D9)', gu: 'Navamsha (D9)' } },
      { id: '11-3', title: { en: 'Key Vargas D2-D60', hi: 'प्रमुख वर्ग', sa: 'प्रमुख वर्ग', mai: 'प्रमुख वर्ग', mr: 'प्रमुख वर्ग', ta: 'Key Vargas D2-D60', te: 'Key Vargas D2-D60', bn: 'Key Vargas D2-D60', kn: 'Key Vargas D2-D60', gu: 'Key Vargas D2-D60' } },
    ]},
    { topic: 'Dashas', modules: [
      { id: '12-1', title: { en: 'Vimshottari — 120-Year Cycle', hi: 'विंशोत्तरी', sa: 'विंशोत्तरी', mai: 'विंशोत्तरी', mr: 'विंशोत्तरी', ta: 'Vimshottari — 120-Year Cycle', te: 'Vimshottari — 120-Year Cycle', bn: 'Vimshottari — 120-Year Cycle', kn: 'Vimshottari — 120-Year Cycle', gu: 'Vimshottari — 120-Year Cycle' } },
      { id: '12-2', title: { en: 'Reading Dasha Periods', hi: 'दशा पठन', sa: 'दशा पठन', mai: 'दशा पठन', mr: 'दशा पठन', ta: 'Reading Dasha Periods', te: 'Reading Dasha Periods', bn: 'Reading Dasha Periods', kn: 'Reading Dasha Periods', gu: 'Reading Dasha Periods' } },
      { id: '12-3', title: { en: 'Timing Events', hi: 'घटना समय', sa: 'घटना समय', mai: 'घटना समय', mr: 'घटना समय', ta: 'Timing Events', te: 'Timing Events', bn: 'Timing Events', kn: 'Timing Events', gu: 'Timing Events' } },
    ]},
    { topic: 'Transits', modules: [
      { id: '13-1', title: { en: 'How Transits Work', hi: 'गोचर', sa: 'गोचर', mai: 'गोचर', mr: 'गोचर', ta: 'How Transits Work', te: 'How Transits Work', bn: 'How Transits Work', kn: 'How Transits Work', gu: 'How Transits Work' } },
      { id: '13-2', title: { en: 'Sade Sati', hi: 'साढ़े साती', sa: 'साढ़े साती', mai: 'साढ़े साती', mr: 'साढ़े साती', ta: 'Sade Sati', te: 'Sade Sati', bn: 'Sade Sati', kn: 'Sade Sati', gu: 'Sade Sati' } },
      { id: '13-3', title: { en: 'Ashtakavarga Transit Scoring', hi: 'अष्टकवर्ग गोचर', sa: 'अष्टकवर्ग गोचर', mai: 'अष्टकवर्ग गोचर', mr: 'अष्टकवर्ग गोचर', ta: 'Ashtakavarga Transit Scoring', te: 'Ashtakavarga Transit Scoring', bn: 'Ashtakavarga Transit Scoring', kn: 'Ashtakavarga Transit Scoring', gu: 'Ashtakavarga Transit Scoring' } },
      { id: '13-4', title: { en: 'Eclipses — Grahan & the Rahu-Ketu Axis', hi: 'ग्रहण — राहु-केतु अक्ष', sa: 'ग्रहण — राहु-केतु अक्ष', mai: 'ग्रहण — राहु-केतु अक्ष', mr: 'ग्रहण — राहु-केतु अक्ष', ta: 'Eclipses — Grahan & the Rahu-Ketu Axis', te: 'Eclipses — Grahan & the Rahu-Ketu Axis', bn: 'Eclipses — Grahan & the Rahu-Ketu Axis', kn: 'Eclipses — Grahan & the Rahu-Ketu Axis', gu: 'Eclipses — Grahan & the Rahu-Ketu Axis' } },
    ]},
  ]},
  { phase: 4, label: { en: 'Applied Jyotish', hi: 'प्रयुक्त ज्योतिष', sa: 'प्रयुक्त ज्योतिष', mai: 'प्रयुक्त ज्योतिष', mr: 'प्रयुक्त ज्योतिष', ta: 'Applied Jyotish', te: 'Applied Jyotish', bn: 'Applied Jyotish', kn: 'Applied Jyotish', gu: 'Applied Jyotish' }, color: 'border-pink-500/20', topics: [
    { topic: 'Compatibility', modules: [
      { id: '14-1', title: { en: 'Ashta Kuta — 8-Factor Matching', hi: 'अष्ट कूट', sa: 'अष्ट कूट', mai: 'अष्ट कूट', mr: 'अष्ट कूट', ta: 'Ashta Kuta — 8-Factor Matching', te: 'Ashta Kuta — 8-Factor Matching', bn: 'Ashta Kuta — 8-Factor Matching', kn: 'Ashta Kuta — 8-Factor Matching', gu: 'Ashta Kuta — 8-Factor Matching' } },
      { id: '14-2', title: { en: 'Key Kutas & Doshas', hi: 'प्रमुख कूट', sa: 'प्रमुख कूट', mai: 'प्रमुख कूट', mr: 'प्रमुख कूट', ta: 'Key Kutas & Doshas', te: 'Key Kutas & Doshas', bn: 'Key Kutas & Doshas', kn: 'Key Kutas & Doshas', gu: 'Key Kutas & Doshas' } },
      { id: '14-3', title: { en: 'Beyond Kuta — Chart Analysis', hi: 'कूट से परे', sa: 'कूट से परे', mai: 'कूट से परे', mr: 'कूट से परे', ta: 'Beyond Kuta — Chart Analysis', te: 'Beyond Kuta — Chart Analysis', bn: 'Beyond Kuta — Chart Analysis', kn: 'Beyond Kuta — Chart Analysis', gu: 'Beyond Kuta — Chart Analysis' } },
    ]},
    { topic: 'Yogas & Doshas', modules: [
      { id: '15-1', title: { en: 'Pancha Mahapurusha Yogas', hi: 'पंच महापुरुष', sa: 'पंच महापुरुष', mai: 'पंच महापुरुष', mr: 'पंच महापुरुष', ta: 'Pancha Mahapurusha Yogas', te: 'Pancha Mahapurusha Yogas', bn: 'Pancha Mahapurusha Yogas', kn: 'Pancha Mahapurusha Yogas', gu: 'Pancha Mahapurusha Yogas' } },
      { id: '15-2', title: { en: 'Raja & Dhana Yogas', hi: 'राज एवं धन योग', sa: 'राज एवं धन योग', mai: 'राज एवं धन योग', mr: 'राज एवं धन योग', ta: 'Raja & Dhana Yogas', te: 'Raja & Dhana Yogas', bn: 'Raja & Dhana Yogas', kn: 'Raja & Dhana Yogas', gu: 'Raja & Dhana Yogas' } },
      { id: '15-3', title: { en: 'Common Doshas', hi: 'प्रमुख दोष', sa: 'प्रमुख दोष', mai: 'प्रमुख दोष', mr: 'प्रमुख दोष', ta: 'Common Doshas', te: 'Common Doshas', bn: 'Common Doshas', kn: 'Common Doshas', gu: 'Common Doshas' } },
      { id: '15-4', title: { en: 'Remedial Measures', hi: 'उपाय', sa: 'उपाय', mai: 'उपाय', mr: 'उपाय', ta: 'Remedial Measures', te: 'Remedial Measures', bn: 'Remedial Measures', kn: 'Remedial Measures', gu: 'Remedial Measures' } },
    ]},
  ]},
  { phase: 5, label: { en: 'Classical Knowledge', hi: 'शास्त्रीय ज्ञान', sa: 'शास्त्रीय ज्ञान', mai: 'शास्त्रीय ज्ञान', mr: 'शास्त्रीय ज्ञान', ta: 'Classical Knowledge', te: 'Classical Knowledge', bn: 'Classical Knowledge', kn: 'Classical Knowledge', gu: 'Classical Knowledge' }, color: 'border-gold-primary/20', topics: [
    { topic: 'Classical Texts', modules: [
      { id: '16-1', title: { en: 'Astronomical Texts', hi: 'खगोलशास्त्रीय', sa: 'खगोलशास्त्रीय', mai: 'खगोलशास्त्रीय', mr: 'खगोलशास्त्रीय', ta: 'Astronomical Texts', te: 'Astronomical Texts', bn: 'Astronomical Texts', kn: 'Astronomical Texts', gu: 'Astronomical Texts' } },
      { id: '16-2', title: { en: 'Hora Texts', hi: 'होरा ग्रंथ', sa: 'होरा ग्रंथ', mai: 'होरा ग्रंथ', mr: 'होरा ग्रंथ', ta: 'Hora Texts', te: 'Hora Texts', bn: 'Hora Texts', kn: 'Hora Texts', gu: 'Hora Texts' } },
      { id: '16-3', title: { en: "India's Contributions", hi: 'भारत का योगदान', sa: 'भारत का योगदान', mai: 'भारत का योगदान', mr: 'भारत का योगदान', ta: "India's Contributions", te: "India's Contributions", bn: "India's Contributions", kn: "India's Contributions", gu: "India's Contributions" } },
    ]},
  ]},
  { phase: 6, label: { en: "India's Contributions to Science", hi: 'विज्ञान में भारत का योगदान', sa: 'विज्ञान में भारत का योगदान', mai: 'विज्ञान में भारत का योगदान', mr: 'विज्ञान में भारत का योगदान', ta: "India's Contributions to Science", te: "India's Contributions to Science", bn: "India's Contributions to Science", kn: "India's Contributions to Science", gu: "India's Contributions to Science" }, color: 'border-emerald-500/20', topics: [
    { topic: 'Mathematics', modules: [
      { id: '25-1', title: { en: 'Zero — The Most Dangerous Idea in History', hi: 'शून्य — इतिहास का सबसे खतरनाक विचार', sa: 'शून्य — इतिहास का सबसे खतरनाक विचार', mai: 'शून्य — इतिहास का सबसे खतरनाक विचार', mr: 'शून्य — इतिहास का सबसे खतरनाक विचार', ta: 'Zero — The Most Dangerous Idea in History', te: 'Zero — The Most Dangerous Idea in History', bn: 'Zero — The Most Dangerous Idea in History', kn: 'Zero — The Most Dangerous Idea in History', gu: 'Zero — The Most Dangerous Idea in History' } },
      { id: '25-2', title: { en: "Did You Know 'Sine' Is Sanskrit?", hi: "क्या आप जानते हैं 'Sine' संस्कृत है?", sa: "क्या आप जानते हैं 'Sine' संस्कृत है?", mai: "क्या आप जानते हैं 'Sine' संस्कृत है?", mr: "क्या आप जानते हैं 'Sine' संस्कृत है?", ta: "Did You Know 'Sine' Is Sanskrit?", te: "Did You Know 'Sine' Is Sanskrit?", bn: "Did You Know 'Sine' Is Sanskrit?", kn: "Did You Know 'Sine' Is Sanskrit?", gu: "Did You Know 'Sine' Is Sanskrit?" } },
      { id: '25-3', title: { en: 'π = 3.1416 — How Aryabhata Nailed It', hi: 'π = 3.1416 — आर्यभट ने कैसे सटीक गणना की', sa: 'π = 3.1416 — आर्यभट ने कैसे सटीक गणना की', mai: 'π = 3.1416 — आर्यभट ने कैसे सटीक गणना की', mr: 'π = 3.1416 — आर्यभट ने कैसे सटीक गणना की', ta: 'π = 3.1416 — How Aryabhata Nailed It', te: 'π = 3.1416 — How Aryabhata Nailed It', bn: 'π = 3.1416 — How Aryabhata Nailed It', kn: 'π = 3.1416 — How Aryabhata Nailed It', gu: 'π = 3.1416 — How Aryabhata Nailed It' } },
      { id: '25-4', title: { en: 'Negative Numbers — Less Than Nothing', hi: 'ऋणात्मक संख्याएँ — शून्य से कम', sa: 'ऋणात्मक संख्याएँ — शून्य से कम', mai: 'ऋणात्मक संख्याएँ — शून्य से कम', mr: 'ऋणात्मक संख्याएँ — शून्य से कम', ta: 'Negative Numbers — Less Than Nothing', te: 'Negative Numbers — Less Than Nothing', bn: 'Negative Numbers — Less Than Nothing', kn: 'Negative Numbers — Less Than Nothing', gu: 'Negative Numbers — Less Than Nothing' } },
      { id: '25-5', title: { en: 'Binary Code — 1,800 Years Before Computers', hi: 'द्विआधारी — कम्प्यूटर से 1,800 वर्ष पहले', sa: 'द्विआधारी — कम्प्यूटर से 1,800 वर्ष पहले', mai: 'द्विआधारी — कम्प्यूटर से 1,800 वर्ष पहले', mr: 'द्विआधारी — कम्प्यूटर से 1,800 वर्ष पहले', ta: 'Binary Code — 1,800 Years Before Computers', te: 'Binary Code — 1,800 Years Before Computers', bn: 'Binary Code — 1,800 Years Before Computers', kn: 'Binary Code — 1,800 Years Before Computers', gu: 'Binary Code — 1,800 Years Before Computers' } },
      { id: '25-6', title: { en: "Fibonacci Was Indian — It Started With Music", hi: 'फिबोनाची भारतीय था — यह संगीत से शुरू हुआ', sa: 'फिबोनाची भारतीय था — यह संगीत से शुरू हुआ', mai: 'फिबोनाची भारतीय था — यह संगीत से शुरू हुआ', mr: 'फिबोनाची भारतीय था — यह संगीत से शुरू हुआ', ta: "Fibonacci Was Indian — It Started With Music", te: "Fibonacci Was Indian — It Started With Music", bn: "Fibonacci Was Indian — It Started With Music", kn: "Fibonacci Was Indian — It Started With Music", gu: "Fibonacci Was Indian — It Started With Music" } },
      { id: '25-7', title: { en: 'Calculus — Invented in Kerala, Not Cambridge', hi: 'कैलकुलस — केरल में खोजा, कैम्ब्रिज में नहीं', sa: 'कैलकुलस — केरल में खोजा, कैम्ब्रिज में नहीं', mai: 'कैलकुलस — केरल में खोजा, कैम्ब्रिज में नहीं', mr: 'कैलकुलस — केरल में खोजा, कैम्ब्रिज में नहीं', ta: 'Calculus — Invented in Kerala, Not Cambridge', te: 'Calculus — Invented in Kerala, Not Cambridge', bn: 'Calculus — Invented in Kerala, Not Cambridge', kn: 'Calculus — Invented in Kerala, Not Cambridge', gu: 'Calculus — Invented in Kerala, Not Cambridge' } },
      { id: '25-8', title: { en: "The 'Pythagorean' Theorem — 300 Years Before Pythagoras", hi: "'पाइथागोरस प्रमेय' — पाइथागोरस से 300 वर्ष पहले", sa: "'पाइथागोरस प्रमेय' — पाइथागोरस से 300 वर्ष पहले", mai: "'पाइथागोरस प्रमेय' — पाइथागोरस से 300 वर्ष पहले", mr: "'पाइथागोरस प्रमेय' — पाइथागोरस से 300 वर्ष पहले", ta: "The 'Pythagorean' Theorem — 300 Years Before Pythagoras", te: "The 'Pythagorean' Theorem — 300 Years Before Pythagoras", bn: "The 'Pythagorean' Theorem — 300 Years Before Pythagoras", kn: "The 'Pythagorean' Theorem — 300 Years Before Pythagoras", gu: "The 'Pythagorean' Theorem — 300 Years Before Pythagoras" } },
    ]},
    { topic: 'Astronomy & Physics', modules: [
      { id: '26-1', title: { en: 'Earth Rotates — 1,000 Years Before Europe', hi: 'पृथ्वी घूमती है — यूरोप से 1,000 वर्ष पहले', sa: 'पृथ्वी घूमती है — यूरोप से 1,000 वर्ष पहले', mai: 'पृथ्वी घूमती है — यूरोप से 1,000 वर्ष पहले', mr: 'पृथ्वी घूमती है — यूरोप से 1,000 वर्ष पहले', ta: 'Earth Rotates — 1,000 Years Before Europe', te: 'Earth Rotates — 1,000 Years Before Europe', bn: 'Earth Rotates — 1,000 Years Before Europe', kn: 'Earth Rotates — 1,000 Years Before Europe', gu: 'Earth Rotates — 1,000 Years Before Europe' } },
      { id: '26-2', title: { en: 'Gravity — 500 Years Before Newton', hi: 'गुरुत्वाकर्षण — न्यूटन से 500 वर्ष पहले', sa: 'गुरुत्वाकर्षण — न्यूटन से 500 वर्ष पहले', mai: 'गुरुत्वाकर्षण — न्यूटन से 500 वर्ष पहले', mr: 'गुरुत्वाकर्षण — न्यूटन से 500 वर्ष पहले', ta: 'Gravity — 500 Years Before Newton', te: 'Gravity — 500 Years Before Newton', bn: 'Gravity — 500 Years Before Newton', kn: 'Gravity — 500 Years Before Newton', gu: 'Gravity — 500 Years Before Newton' } },
      { id: '26-3', title: { en: 'Speed of Light — In a 14th Century Text', hi: 'प्रकाश की गति — 14वीं शताब्दी के ग्रन्थ में', sa: 'प्रकाश की गति — 14वीं शताब्दी के ग्रन्थ में', mai: 'प्रकाश की गति — 14वीं शताब्दी के ग्रन्थ में', mr: 'प्रकाश की गति — 14वीं शताब्दी के ग्रन्थ में', ta: 'Speed of Light — In a 14th Century Text', te: 'Speed of Light — In a 14th Century Text', bn: 'Speed of Light — In a 14th Century Text', kn: 'Speed of Light — In a 14th Century Text', gu: 'Speed of Light — In a 14th Century Text' } },
      { id: '26-4', title: { en: '4.32 Billion Years — How Did They Know?', hi: '4.32 अरब वर्ष — उन्हें कैसे पता था?', sa: '4.32 अरब वर्ष — उन्हें कैसे पता था?', mai: '4.32 अरब वर्ष — उन्हें कैसे पता था?', mr: '4.32 अरब वर्ष — उन्हें कैसे पता था?', ta: '4.32 Billion Years — How Did They Know?', te: '4.32 Billion Years — How Did They Know?', bn: '4.32 Billion Years — How Did They Know?', kn: '4.32 Billion Years — How Did They Know?', gu: '4.32 Billion Years — How Did They Know?' } },
    ]},
  ]},
];

export default function ModuleIndexPage() {
  const locale = useLocale() as Locale;
  const isHi = isDevanagariLocale(locale);
  const hf = isHi ? { fontFamily: 'var(--font-devanagari-heading)' } : { fontFamily: 'var(--font-heading)' };

  let moduleCount = 0;
  PHASES.forEach(p => p.topics.forEach(t => { moduleCount += t.modules.length; }));

  const { hydrated, hydrateFromStorage, getModuleStatus, getPhaseProgress, getOverallProgress, getNextModule } = useLearningProgressStore();

  useEffect(() => { hydrateFromStorage(); }, [hydrateFromStorage]);

  const overall = hydrated ? getOverallProgress() : null;
  const nextModuleId = hydrated ? getNextModule() : null;

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold text-gold-gradient mb-3" style={hf}>
          {isHi ? 'सम्पूर्ण पाठ्यक्रम — 50 मॉड्यूल' : 'Complete Curriculum — 50 Modules'}
        </h2>
        <p className="text-text-secondary text-sm leading-relaxed max-w-2xl">
          {isHi
            ? 'प्रत्येक मॉड्यूल 10-15 मिनट का गहन पाठ है — सामग्री, उदाहरण, और ज्ञान परीक्षा के साथ। मॉड्यूल 1.1 से शुरू करें और क्रम में आगे बढ़ें।'
            : 'Each module is a 10-15 minute deep lesson with content, worked examples, and a knowledge check. Start with Module 1.1 and progress in order.'}
        </p>
      </div>

      {/* Overall progress */}
      {hydrated && overall && overall.mastered > 0 && (
        <div className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-2xl p-5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gold-light font-bold text-lg" style={hf}>
              {isHi ? 'आपकी प्रगति' : 'Your Progress'}
            </span>
            <span className="text-gold-primary text-sm font-mono">{overall.mastered}/{overall.total}</span>
          </div>
          <div className="h-2 bg-white/5 rounded-full overflow-hidden mb-2">
            <div className="h-full bg-gradient-to-r from-gold-primary to-gold-light rounded-full" style={{ width: `${overall.percent}%` }} />
          </div>
          <div className="flex items-center justify-between">
            <p className="text-text-secondary/60 text-xs">
              {isHi ? `${overall.percent}% पूर्ण` : `${overall.percent}% complete`}
            </p>
            <LevelBadge masteredCount={overall.mastered} locale={locale} variant="compact" />
          </div>
        </div>
      )}

      {/* Start button */}
      <div className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-2xl p-5 bg-gradient-to-r from-gold-primary/5 to-indigo-500/5 flex items-center justify-between">
        <div>
          <div className="text-gold-light font-bold text-lg" style={hf}>{isHi ? 'शुरू करें' : 'Start Learning'}</div>
          <p className="text-text-secondary text-xs mt-1">{isHi ? 'मॉड्यूल 1.1 — रात्रि आकाश एवं क्रान्तिवृत्त' : 'Module 1.1 — The Night Sky & Ecliptic'}</p>
        </div>
        <Link href="/learn/modules/1-1" className="shrink-0 px-6 py-2.5 rounded-xl bg-gold-primary text-bg-primary font-semibold text-sm hover:bg-gold-light transition-colors">
          {isHi ? 'आरम्भ →' : 'Begin →'}
        </Link>
      </div>

      {/* Phase sections */}
      {PHASES.map((phase) => (
        <div key={phase.phase}>
          <div className="flex items-center gap-2 mb-4">
            <span className="w-6 h-6 rounded-full bg-gold-primary/10 border border-gold-primary/20 flex items-center justify-center text-xs text-gold-primary font-bold">{phase.phase}</span>
            <h3 className="text-gold-light font-bold text-lg" style={hf}>{isHi ? phase.label.hi : phase.label.en}</h3>
            {hydrated && (() => {
              const pp = getPhaseProgress(phase.phase);
              return pp.mastered > 0 ? (
                <div className="flex items-center gap-2 ml-auto">
                  <div className="w-20 h-1 bg-white/5 rounded-full overflow-hidden">
                    <div className={`h-full rounded-full ${pp.mastered === pp.total ? 'bg-emerald-500' : 'bg-gold-primary'}`}
                      style={{ width: `${pp.percent}%` }} />
                  </div>
                  <span className="text-[10px] text-text-secondary/40">{pp.mastered}/{pp.total}</span>
                </div>
              ) : null;
            })()}
          </div>

          <div className="space-y-3">
            {phase.topics.map((topic) => (
              <div key={topic.topic} className={`bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl border ${phase.color} overflow-hidden`}>
                <div className="px-4 py-2 border-b border-gold-primary/5">
                  <span className="text-gold-dark text-xs uppercase tracking-widest font-bold">{topic.topic}</span>
                </div>
                <div className="divide-y divide-gold-primary/5">
                  {topic.modules.map((mod, i) => (
                    <motion.div key={mod.id} initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
                      <Link href={`/learn/modules/${mod.id}`}
                        className="flex items-center justify-between px-4 py-3 hover:bg-gold-primary/5 transition-colors group">
                        <div className="flex items-center gap-3">
                          {hydrated && <ProgressIndicator status={getModuleStatus(mod.id)} size={14} />}
                          <span className="text-text-tertiary text-xs font-mono w-8">{mod.id.replace('-', '.')}</span>
                          <span className={`text-sm group-hover:text-gold-light transition-colors ${
                            hydrated && getModuleStatus(mod.id) === 'mastered' ? 'text-text-secondary/60' : 'text-text-primary'
                          }`} style={isHi ? { fontFamily: 'var(--font-devanagari-body)' } : undefined}>
                            {isHi ? mod.title.hi : mod.title.en}
                          </span>
                          {mod.id === nextModuleId && (
                            <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/20 font-bold">
                              {isHi ? 'अगला' : 'NEXT'}
                            </span>
                          )}
                        </div>
                        <ChevronRight className="w-4 h-4 text-text-tertiary group-hover:text-gold-primary transition-colors" />
                      </Link>
                    </motion.div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
