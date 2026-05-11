/**
 * Vrat Type Definitions
 *
 * Canonical list of trackable vrats for the VratTracker feature.
 * Each vrat_type id matches the key stored in user_vrat_preferences.vrat_type.
 *
 * The `category` field maps to festival-defs.ts categories for date lookup.
 */

import type { LocaleText } from '@/types/panchang';

export interface VratType {
  id: string;
  name: LocaleText;
  description: LocaleText;
  frequency: 'twice-monthly' | 'monthly' | 'weekly' | 'annual';
  category: 'ekadashi' | 'chaturthi' | 'pradosham' | 'lunar' | 'weekday' | 'shivaratri';
  /** For weekly vrats: 0=Sunday, 1=Monday, ..., 6=Saturday (matches Date.getUTCDay()) */
  weekday?: number;
}

export const VRAT_TYPES: VratType[] = [
  {
    id: 'ekadashi',
    name: { en: 'Ekadashi', hi: 'एकादशी', sa: 'एकादशी' },
    description: {
      en: 'Twice-monthly fast on the 11th tithi — dedicated to Lord Vishnu',
      hi: 'शुक्ल और कृष्ण पक्ष की एकादशी — भगवान विष्णु को समर्पित',
      sa: 'शुक्लकृष्णपक्षयोः एकादशी — विष्णुभगवते समर्पिता',
    },
    frequency: 'twice-monthly',
    category: 'ekadashi',
  },
  {
    id: 'pradosh',
    name: { en: 'Pradosh Vrat', hi: 'प्रदोष व्रत', sa: 'प्रदोषव्रतम्' },
    description: {
      en: 'Twice-monthly fast on Trayodashi (13th tithi) — for Lord Shiva',
      hi: 'शुक्ल और कृष्ण पक्ष की त्रयोदशी — भगवान शिव को समर्पित',
      sa: 'शुक्लकृष्णपक्षयोः त्रयोदशी — शिवभगवते समर्पिता',
    },
    frequency: 'twice-monthly',
    category: 'pradosham',
  },
  {
    id: 'sankashti',
    name: { en: 'Sankashti Chaturthi', hi: 'संकष्टी चतुर्थी', sa: 'सङ्कष्टीचतुर्थी' },
    description: {
      en: 'Monthly fast on Krishna Chaturthi — for Lord Ganesha, broken at moonrise',
      hi: 'कृष्ण पक्ष चतुर्थी — गणेश भगवान को समर्पित, चन्द्रोदय पर व्रत खोलें',
      sa: 'कृष्णपक्षचतुर्थी — गणेशभगवते समर्पिता',
    },
    frequency: 'monthly',
    category: 'chaturthi',
  },
  {
    id: 'purnima',
    name: { en: 'Purnima Vrat', hi: 'पूर्णिमा व्रत', sa: 'पूर्णिमाव्रतम्' },
    description: {
      en: 'Monthly fast on the Full Moon day — auspicious for sattvic practices',
      hi: 'पूर्णिमा के दिन व्रत — सात्विक साधना के लिए शुभ',
      sa: 'पूर्णिमायां व्रतम् — सात्विकसाधनायै शुभम्',
    },
    frequency: 'monthly',
    category: 'lunar',
  },
  {
    id: 'amavasya',
    name: { en: 'Amavasya Vrat', hi: 'अमावस्या व्रत', sa: 'अमावस्याव्रतम्' },
    description: {
      en: 'Monthly fast on the New Moon day — for pitru tarpan and introspection',
      hi: 'अमावस्या के दिन व्रत — पितृ तर्पण और आत्मचिन्तन के लिए',
      sa: 'अमावस्यायां व्रतम् — पितृतर्पणाय आत्मचिन्तनाय च',
    },
    frequency: 'monthly',
    category: 'lunar',
  },
  {
    id: 'masik-shivaratri',
    name: { en: 'Masik Shivaratri', hi: 'मासिक शिवरात्रि', sa: 'मासिकशिवरात्रिः' },
    description: {
      en: 'Monthly fast on Krishna Chaturdashi — Shiva worship through the night',
      hi: 'कृष्ण पक्ष चतुर्दशी — रात्रि पूजा भगवान शिव के लिए',
      sa: 'कृष्णपक्षचतुर्दशी — शिवपूजा रात्रौ',
    },
    frequency: 'monthly',
    category: 'shivaratri',
  },
  {
    id: 'somvar',
    name: { en: 'Somvar Vrat (Monday)', hi: 'सोमवार व्रत', sa: 'सोमवारव्रतम्' },
    description: {
      en: 'Weekly Monday fast — dedicated to Lord Shiva',
      hi: 'प्रत्येक सोमवार व्रत — भगवान शिव को समर्पित',
      sa: 'प्रतिसोमवारे व्रतम् — शिवभगवते समर्पितम्',
    },
    frequency: 'weekly',
    category: 'weekday',
    weekday: 1, // 0=Sun, 1=Mon, ..., 6=Sat
  },
  {
    id: 'mangalvar',
    name: { en: 'Mangalvar Vrat (Tuesday)', hi: 'मंगलवार व्रत', sa: 'मङ्गलवारव्रतम्' },
    description: {
      en: 'Weekly Tuesday fast — dedicated to Lord Hanuman',
      hi: 'प्रत्येक मंगलवार व्रत — हनुमान जी को समर्पित',
      sa: 'प्रतिमङ्गलवारे व्रतम् — हनुमते समर्पितम्',
    },
    frequency: 'weekly',
    category: 'weekday',
    weekday: 2,
  },
  {
    id: 'guruvar',
    name: { en: 'Guruvar Vrat (Thursday)', hi: 'गुरुवार व्रत', sa: 'गुरुवारव्रतम्' },
    description: {
      en: 'Weekly Thursday fast — dedicated to Lord Vishnu / Brihaspati',
      hi: 'प्रत्येक गुरुवार व्रत — विष्णु / बृहस्पति को समर्पित',
      sa: 'प्रतिगुरुवारे व्रतम् — विष्णुभगवते बृहस्पतये च समर्पितम्',
    },
    frequency: 'weekly',
    category: 'weekday',
    weekday: 4,
  },
  {
    id: 'shanivar',
    name: { en: 'Shanivar Vrat (Saturday)', hi: 'शनिवार व्रत', sa: 'शनिवारव्रतम्' },
    description: {
      en: 'Weekly Saturday fast — to appease Shani Dev and reduce malefic effects',
      hi: 'प्रत्येक शनिवार व्रत — शनि देव की कृपा और अशुभ प्रभाव में कमी',
      sa: 'प्रतिशनिवारे व्रतम् — शनिदेवकृपार्थम्',
    },
    frequency: 'weekly',
    category: 'weekday',
    weekday: 6,
  },
  {
    id: 'satyanarayan',
    name: { en: 'Satyanarayan Purnima', hi: 'सत्यनारायण पूर्णिमा', sa: 'सत्यनारायणपूर्णिमा' },
    description: {
      en: 'Monthly Purnima Katha — Lord Vishnu as Satyanarayan',
      hi: 'पूर्णिमा पर सत्यनारायण कथा — भगवान विष्णु',
      sa: 'पूर्णिमायां सत्यनारायणकथा — विष्णुभगवान्',
    },
    frequency: 'monthly',
    category: 'lunar',
  },
];

/** Look up a VratType by its id */
export function getVratType(id: string): VratType | undefined {
  return VRAT_TYPES.find(v => v.id === id);
}
