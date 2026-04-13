/**
 * Ashtamangala Prashna — Question Categories
 * Maps the 12 bhava-based question categories with Trilingual content,
 * relevant houses, and conditions for favorable/unfavorable outcomes.
 */

import type { LocaleText,} from '@/types/panchang';
import type { QuestionCategory } from '@/types/prashna';

export interface CategoryData {
  label: LocaleText;
  house: number;
  relevantHouses: number[];
  favorableConditions: LocaleText;
  unfavorableConditions: LocaleText;
}

export const QUESTION_CATEGORIES: Record<QuestionCategory, CategoryData> = {
  health: {
    label: { en: 'Health', hi: 'स्वास्थ्य', sa: 'आरोग्यम्' },
    house: 1,
    relevantHouses: [1, 6, 8],
    favorableConditions: {
      en: 'Lagna lord strong, benefics in lagna or trines, 6th lord weak',
      hi: 'लग्नेश बलवान, लग्न या त्रिकोण में शुभ ग्रह, षष्ठेश निर्बल',
      sa: 'लग्नाधिपतिः बली, लग्ने त्रिकोणे वा शुभग्रहाः, षष्ठाधिपतिः दुर्बलः',
    },
    unfavorableConditions: {
      en: 'Malefics in lagna, lagna lord afflicted or in 6th/8th/12th',
      hi: 'लग्न में पाप ग्रह, लग्नेश पीड़ित या 6/8/12 में',
      sa: 'लग्ने पापग्रहाः, लग्नाधिपतिः पीडितः षष्ठे अष्टमे द्वादशे वा',
    },
  },
  wealth: {
    label: { en: 'Wealth', hi: 'धन', sa: 'धनम्' },
    house: 2,
    relevantHouses: [2, 5, 9, 11],
    favorableConditions: {
      en: '2nd lord strong, benefics in 2nd/11th, Jupiter aspects 2nd house',
      hi: 'द्वितीयेश बलवान, 2/11 में शुभ ग्रह, बृहस्पति की दृष्टि द्वितीय पर',
      sa: 'द्वितीयाधिपतिः बली, द्वितीये एकादशे वा शुभग्रहाः, गुरोः दृष्टिः द्वितीये',
    },
    unfavorableConditions: {
      en: '2nd lord weak or combust, malefics in 2nd, 12th lord in 2nd',
      hi: 'द्वितीयेश निर्बल या अस्त, 2 में पाप ग्रह, द्वादशेश 2 में',
      sa: 'द्वितीयाधिपतिः दुर्बलः अस्तः वा, द्वितीये पापग्रहाः, द्वादशाधिपतिः द्वितीये',
    },
  },
  siblings: {
    label: { en: 'Siblings', hi: 'भाई-बहन', sa: 'भ्रातरः' },
    house: 3,
    relevantHouses: [3, 9, 11],
    favorableConditions: {
      en: '3rd lord strong, benefics in 3rd, Mars well-placed',
      hi: 'तृतीयेश बलवान, 3 में शुभ ग्रह, मंगल शुभ स्थिति में',
      sa: 'तृतीयाधिपतिः बली, तृतीये शुभग्रहाः, मङ्गलः शुभस्थाने',
    },
    unfavorableConditions: {
      en: '3rd lord afflicted, malefics in 3rd, Mars debilitated',
      hi: 'तृतीयेश पीड़ित, 3 में पाप ग्रह, मंगल नीच',
      sa: 'तृतीयाधिपतिः पीडितः, तृतीये पापग्रहाः, मङ्गलः नीचस्थः',
    },
  },
  property: {
    label: { en: 'Property', hi: 'सम्पत्ति', sa: 'सम्पत्तिः' },
    house: 4,
    relevantHouses: [4, 2, 11],
    favorableConditions: {
      en: '4th lord strong, benefics in 4th, Moon well-placed',
      hi: 'चतुर्थेश बलवान, 4 में शुभ ग्रह, चन्द्र शुभ स्थिति में',
      sa: 'चतुर्थाधिपतिः बली, चतुर्थे शुभग्रहाः, चन्द्रः शुभस्थाने',
    },
    unfavorableConditions: {
      en: '4th lord in 6/8/12, malefics in 4th, Saturn afflicts 4th',
      hi: 'चतुर्थेश 6/8/12 में, 4 में पाप ग्रह, शनि की पीड़ा 4 पर',
      sa: 'चतुर्थाधिपतिः षष्ठे अष्टमे द्वादशे वा, चतुर्थे पापग्रहाः, शनेः पीडा चतुर्थे',
    },
  },
  children: {
    label: { en: 'Children', hi: 'सन्तान', sa: 'सन्तानम्' },
    house: 5,
    relevantHouses: [5, 2, 9, 11],
    favorableConditions: {
      en: '5th lord strong, Jupiter aspects 5th, benefics in 5th',
      hi: 'पंचमेश बलवान, बृहस्पति की दृष्टि 5 पर, 5 में शुभ ग्रह',
      sa: 'पञ्चमाधिपतिः बली, गुरोः दृष्टिः पञ्चमे, पञ्चमे शुभग्रहाः',
    },
    unfavorableConditions: {
      en: '5th lord weak, malefics in 5th, 5th lord with Rahu/Ketu',
      hi: 'पंचमेश निर्बल, 5 में पाप ग्रह, पंचमेश राहु/केतु के साथ',
      sa: 'पञ्चमाधिपतिः दुर्बलः, पञ्चमे पापग्रहाः, पञ्चमाधिपतिः राहुकेतुभ्यां सह',
    },
  },
  enemies: {
    label: { en: 'Enemies & Litigation', hi: 'शत्रु एवं मुकदमा', sa: 'शत्रवः विवादश्च' },
    house: 6,
    relevantHouses: [6, 1, 7],
    favorableConditions: {
      en: '6th lord weak, lagna lord stronger than 6th lord, Mars in 6th',
      hi: 'षष्ठेश निर्बल, लग्नेश षष्ठेश से बलवान, मंगल 6 में',
      sa: 'षष्ठाधिपतिः दुर्बलः, लग्नाधिपतिः षष्ठाधिपतेः बलवान्, मङ्गलः षष्ठे',
    },
    unfavorableConditions: {
      en: '6th lord strong, lagna lord in 6th, malefics aspect lagna',
      hi: 'षष्ठेश बलवान, लग्नेश 6 में, लग्न पर पाप दृष्टि',
      sa: 'षष्ठाधिपतिः बली, लग्नाधिपतिः षष्ठे, लग्ने पापदृष्टिः',
    },
  },
  marriage: {
    label: { en: 'Marriage', hi: 'विवाह', sa: 'विवाहः' },
    house: 7,
    relevantHouses: [7, 1, 2, 5],
    favorableConditions: {
      en: '7th lord strong, Venus well-placed, benefics in 7th',
      hi: 'सप्तमेश बलवान, शुक्र शुभ स्थिति में, 7 में शुभ ग्रह',
      sa: 'सप्तमाधिपतिः बली, शुक्रः शुभस्थाने, सप्तमे शुभग्रहाः',
    },
    unfavorableConditions: {
      en: '7th lord afflicted, malefics in 7th, Venus combust',
      hi: 'सप्तमेश पीड़ित, 7 में पाप ग्रह, शुक्र अस्त',
      sa: 'सप्तमाधिपतिः पीडितः, सप्तमे पापग्रहाः, शुक्रः अस्तः',
    },
  },
  longevity: {
    label: { en: 'Longevity', hi: 'आयु', sa: 'आयुः' },
    house: 8,
    relevantHouses: [8, 1, 3],
    favorableConditions: {
      en: '8th lord in favorable house, Saturn strong, no malefics in 8th',
      hi: 'अष्टमेश शुभ भाव में, शनि बलवान, 8 में पाप ग्रह नहीं',
      sa: 'अष्टमाधिपतिः शुभभावे, शनिः बली, अष्टमे पापग्रहाः न सन्ति',
    },
    unfavorableConditions: {
      en: '8th lord in 1st, malefics in 8th and 1st, lagna lord in 8th',
      hi: 'अष्टमेश 1 में, 8 और 1 में पाप ग्रह, लग्नेश 8 में',
      sa: 'अष्टमाधिपतिः लग्ने, अष्टमे लग्ने च पापग्रहाः, लग्नाधिपतिः अष्टमे',
    },
  },
  fortune: {
    label: { en: 'Fortune & Dharma', hi: 'भाग्य एवं धर्म', sa: 'भाग्यं धर्मश्च' },
    house: 9,
    relevantHouses: [9, 1, 5],
    favorableConditions: {
      en: '9th lord strong, Jupiter in kendra/trikona, benefics in 9th',
      hi: '9 का स्वामी बलवान, बृहस्पति केन्द्र/त्रिकोण में, 9 में शुभ ग्रह',
      sa: 'नवमाधिपतिः बली, गुरुः केन्द्रे त्रिकोणे वा, नवमे शुभग्रहाः',
    },
    unfavorableConditions: {
      en: '9th lord in trik houses, malefics in 9th, Jupiter afflicted',
      hi: 'नवमेश त्रिक भाव में, 9 में पाप ग्रह, बृहस्पति पीड़ित',
      sa: 'नवमाधिपतिः त्रिकभावे, नवमे पापग्रहाः, गुरुः पीडितः',
    },
  },
  career: {
    label: { en: 'Career', hi: 'व्यवसाय', sa: 'वृत्तिः' },
    house: 10,
    relevantHouses: [10, 1, 2, 6, 7],
    favorableConditions: {
      en: '10th lord strong, Sun/Saturn well-placed, benefics in 10th',
      hi: 'दशमेश बलवान, सूर्य/शनि शुभ स्थिति में, 10 में शुभ ग्रह',
      sa: 'दशमाधिपतिः बली, सूर्यः शनिः वा शुभस्थाने, दशमे शुभग्रहाः',
    },
    unfavorableConditions: {
      en: '10th lord in 6/8/12, malefics in 10th, 10th lord combust',
      hi: 'दशमेश 6/8/12 में, 10 में पाप ग्रह, दशमेश अस्त',
      sa: 'दशमाधिपतिः षष्ठे अष्टमे द्वादशे वा, दशमे पापग्रहाः, दशमाधिपतिः अस्तः',
    },
  },
  gains: {
    label: { en: 'Gains & Income', hi: 'लाभ एवं आय', sa: 'लाभः आयश्च' },
    house: 11,
    relevantHouses: [11, 2, 9],
    favorableConditions: {
      en: '11th lord strong, benefics in 11th, 2nd and 11th lords connected',
      hi: 'एकादशेश बलवान, 11 में शुभ ग्रह, 2 और 11 के स्वामी का सम्बन्ध',
      sa: 'एकादशाधिपतिः बली, एकादशे शुभग्रहाः, द्वितीयैकादशाधिपत्योः सम्बन्धः',
    },
    unfavorableConditions: {
      en: '11th lord in 6/8/12, malefics in 11th, 11th lord combust',
      hi: 'एकादशेश 6/8/12 में, 11 में पाप ग्रह, एकादशेश अस्त',
      sa: 'एकादशाधिपतिः षष्ठे अष्टमे द्वादशे वा, एकादशे पापग्रहाः, एकादशाधिपतिः अस्तः',
    },
  },
  loss: {
    label: { en: 'Loss & Expenses', hi: 'हानि एवं व्यय', sa: 'हानिः व्ययश्च' },
    house: 12,
    relevantHouses: [12, 6, 8],
    favorableConditions: {
      en: '12th lord weak, lagna lord strong, benefics in lagna, no planets in 12th',
      hi: 'द्वादशेश निर्बल, लग्नेश बलवान, लग्न में शुभ ग्रह, 12 में कोई ग्रह नहीं',
      sa: 'द्वादशाधिपतिः दुर्बलः, लग्नाधिपतिः बली, लग्ने शुभग्रहाः, द्वादशे ग्रहाः न सन्ति',
    },
    unfavorableConditions: {
      en: '12th lord strong and in lagna, malefics in lagna, lagna lord in 12th',
      hi: 'द्वादशेश बलवान और लग्न में, लग्न में पाप ग्रह, लग्नेश 12 में',
      sa: 'द्वादशाधिपतिः बली लग्ने च, लग्ने पापग्रहाः, लग्नाधिपतिः द्वादशे',
    },
  },
};
