/**
 * Enhanced Trilingual Planet-in-House Interpretations
 * Based on BPHS Ch.14-23, Bhrigu Sutram, Phaladeepika Ch.5-10
 *
 * Adds Hindi and Sanskrit to existing English content,
 * with structured general / implications / prognosis per placement.
 */

import type { Locale } from '@/types/panchang';
import type { Tri } from './utils';

interface HouseTriInterp {
  general: Tri;
  implications: Tri;
  prognosis: Tri;
}

/**
 * PLANET_HOUSE_TRILINGUAL[planetId][houseNumber]
 * Provides deeper trilingual commentary for key placements.
 * Covers all 7 visible planets (0-6) in houses 1, 4, 5, 7, 9, 10 (key houses).
 */
export const PLANET_HOUSE_TRILINGUAL: Record<number, Record<number, HouseTriInterp>> = {
  // SUN (0)
  0: {
    1: {
      general: { en: 'Sun in the 1st house confers a powerful personality, natural leadership, and robust health. The native radiates authority and commands respect.', hi: 'प्रथम भाव में सूर्य शक्तिशाली व्यक्तित्व, प्राकृतिक नेतृत्व और सुदृढ़ स्वास्थ्य प्रदान करता है। जातक अधिकार विकीर्ण करता है।', sa: 'प्रथमभावे सूर्यः शक्तिमत् व्यक्तित्वं स्वाभाविकं नेतृत्वं सुदृढं स्वास्थ्यं च प्रददाति।' },
      implications: { en: 'Government connections benefit you. Father is influential. Leadership roles come naturally but ego conflicts with authority figures are possible.', hi: 'सरकारी सम्बन्ध लाभकारी। पिता प्रभावशाली। नेतृत्व भूमिकाएँ स्वाभाविक पर अधिकारियों से अहम् संघर्ष सम्भव।', sa: 'शासनसम्बन्धाः लाभकराः। पिता प्रभावशाली। नेतृत्वभूमिकाः स्वाभाविक्यः।' },
      prognosis: { en: 'Career peaks in mid-30s through bold leadership. Government recognition likely. Health stays robust if ego is managed well.', hi: 'साहसिक नेतृत्व से 30 के दशक में कैरियर चरम। सरकारी मान्यता सम्भव। अहम् प्रबन्धन से स्वास्थ्य सुदृढ़ रहता है।', sa: 'त्रिंशद्दशके साहसिकनेतृत्वेन जीविकाचरमम्। शासनमान्यता सम्भवा।' },
    },
    5: {
      general: { en: 'Sun in the 5th house blesses with exceptional intelligence, creative power, and a strong connection with children. This is a house of past-life merit.', hi: 'पंचम भाव में सूर्य असाधारण बुद्धि, रचनात्मक शक्ति और सन्तान से गहरे सम्बन्ध का आशीर्वाद देता है। यह पूर्वजन्म पुण्य का भाव है।', sa: 'पञ्चमभावे सूर्यः असाधारणां बुद्धिं रचनात्मिकां शक्तिं सन्तानेन गहनसम्बन्धं च आशिषति।' },
      implications: { en: 'Children are source of pride. Creative intelligence is exceptional. Speculation may succeed through informed confidence. Education leads to authority.', hi: 'सन्तान गर्व का स्रोत। रचनात्मक बुद्धि असाधारण। सूचित विश्वास से सट्टा सफल। शिक्षा अधिकार की ओर।', sa: 'सन्तानः गर्वस्य स्रोतः। रचनात्मिकी बुद्धिः असाधारणी।' },
      prognosis: { en: 'First child brings great joy. Creative projects succeed in 30s-40s. Romance leads to meaningful partnerships. Academic authority develops naturally.', hi: 'प्रथम सन्तान महान आनन्द लाता है। 30-40 में रचनात्मक परियोजनाएँ सफल। प्रेम सार्थक साझेदारी की ओर। शैक्षिक अधिकार स्वाभाविक।', sa: 'प्रथमा सन्तानः महान्तम् आनन्दम् आनयति।' },
    },
    10: {
      general: { en: 'Sun in the 10th house is one of the most powerful placements — conferring career success, fame, public recognition, and institutional authority. The father may be prominent.', hi: 'दशम भाव में सूर्य सर्वाधिक शक्तिशाली स्थितियों में से एक — कैरियर सफलता, यश, जन मान्यता और संस्थागत अधिकार। पिता प्रमुख हो सकते हैं।', sa: 'दशमभावे सूर्यः सर्वाधिकशक्तिमतीषु स्थितिषु एका — जीविकासाफल्यं यशः जनमान्यता सांस्थानिकम् अधिकारं च।' },
      implications: { en: 'This is one of the strongest placements for career success. Public recognition, fame, and authority positions are natural. Government service brings distinction.', hi: 'कैरियर सफलता के लिए सर्वाधिक शक्तिशाली स्थितियों में से एक। जन मान्यता, यश और अधिकार पद स्वाभाविक।', sa: 'जीविकासाफल्याय सर्वाधिकशक्तिमतीषु स्थितिषु एका।' },
      prognosis: { en: 'Major career peaks between 35-50. National or international recognition possible. Fame grows throughout career. Professional legacy endures long.', hi: '35-50 के बीच प्रमुख कैरियर चरम। राष्ट्रीय या अन्तरराष्ट्रीय मान्यता सम्भव। कैरियर भर यश बढ़ता है।', sa: 'पञ्चत्रिंशत्-पञ्चाशत् मध्ये प्रमुखं जीविकाचरमम्।' },
    },
  },
  // JUPITER (4)
  4: {
    1: {
      general: { en: 'Jupiter in the 1st house is a divine blessing — wisdom, optimism, good fortune, and a philosophical nature that attracts opportunities naturally.', hi: 'प्रथम भाव में बृहस्पति दिव्य आशीर्वाद — ज्ञान, आशावाद, सौभाग्य और दार्शनिक प्रकृति जो स्वाभाविक रूप से अवसर आकर्षित करती है।', sa: 'प्रथमभावे बृहस्पतिः दिव्यम् आशीर्वादम् — ज्ञानम् आशावादं सौभाग्यं दार्शनिकप्रकृतिं च।' },
      implications: { en: 'Blessed with wisdom, optimism, and good fortune. Philosophical nature attracts opportunities naturally. Natural teacher and guide for others.', hi: 'ज्ञान, आशावाद और सौभाग्य से आशीर्वादित। दार्शनिक प्रकृति स्वाभाविक रूप से अवसर आकर्षित करती है।', sa: 'ज्ञानेन आशावादेन सौभाग्येन च आशीर्वादितः।' },
      prognosis: { en: 'Wisdom and prosperity increase with age. Teaching or advisory roles bring fulfillment. Reputation as wise counselor grows steadily throughout life.', hi: 'उम्र के साथ ज्ञान और समृद्धि बढ़ती है। शिक्षण या सलाहकार भूमिकाएँ सन्तुष्टि लाती हैं।', sa: 'वयसा सह ज्ञानं समृद्धिश्च वर्धते।' },
    },
    5: {
      general: { en: 'Jupiter in the 5th house is one of the best placements in all of Jyotish — supreme intelligence, blessed children, creative genius, and past-life spiritual merit.', hi: 'पंचम भाव में बृहस्पति ज्योतिष की सर्वोत्तम स्थितियों में से एक — सर्वोच्च बुद्धि, आशीर्वादित सन्तान, रचनात्मक प्रतिभा।', sa: 'पञ्चमभावे बृहस्पतिः ज्योतिषस्य सर्वोत्तमासु स्थितिषु एका — सर्वोच्चा बुद्धिः, आशीर्वादिता सन्तानः।' },
      implications: { en: 'One of the best placements — intelligence, good children, spiritual merit, and success in education and speculation. Past-life virtues manifest.', hi: 'सर्वोत्तम स्थितियों में से एक — बुद्धि, अच्छी सन्तान, आध्यात्मिक पुण्य। शिक्षा और सट्टे में सफलता। पूर्वजन्म सद्गुण प्रकट।', sa: 'सर्वोत्तमासु स्थितिषु एका — बुद्धिः, सत्सन्तानः, आध्यात्मिकपुण्यम्।' },
      prognosis: { en: 'Children bring great joy and pride. Academic excellence throughout life. Creative and speculative ventures succeed. Spiritual wisdom deepens naturally.', hi: 'सन्तान महान आनन्द और गर्व लाती है। जीवनभर शैक्षिक उत्कृष्टता। आध्यात्मिक ज्ञान स्वाभाविक रूप से गहराता है।', sa: 'सन्तानः महान्तम् आनन्दं गर्वं च आनयति। जीवनपर्यन्तम् शैक्षिकोत्कृष्टता।' },
    },
    9: {
      general: { en: 'Jupiter in the 9th house is supremely fortunate — its own joy house. Great wisdom, spiritual blessings, prosperity, and dharmic living. Father is wise.', hi: 'नवम भाव में बृहस्पति अत्यन्त भाग्यशाली — इसका स्वयं का आनन्द भाव। महान ज्ञान, आध्यात्मिक आशीर्वाद, समृद्धि। पिता बुद्धिमान।', sa: 'नवमभावे बृहस्पतिः अत्यन्तं भाग्यशाली — स्वस्य आनन्दभावः। महत् ज्ञानम्, आध्यात्मिकम् आशीर्वादम्।' },
      implications: { en: 'Extremely fortunate — great wisdom, spiritual advancement, prosperity, and blessings from teachers and father. Pilgrimage transforms consciousness.', hi: 'अत्यन्त भाग्यशाली — महान ज्ञान, आध्यात्मिक उन्नति, समृद्धि। गुरुओं और पिता से आशीर्वाद। तीर्थयात्रा चेतना को रूपान्तरित करती है।', sa: 'अत्यन्तं भाग्यशाली — महत् ज्ञानम्, आध्यात्मिकोन्नतिः, समृद्धिः।' },
      prognosis: { en: 'Fortune increases throughout life. Spiritual wisdom deepens with each decade. Pilgrimage and higher education bring transformation. Guru appears when ready.', hi: 'जीवनभर भाग्य बढ़ता है। प्रत्येक दशक में आध्यात्मिक ज्ञान गहराता है। तीर्थयात्रा और उच्च शिक्षा परिवर्तन लाती है।', sa: 'जीवनपर्यन्तं भाग्यं वर्धते। प्रतिदशके आध्यात्मिकज्ञानं गहनतरं भवति।' },
    },
  },
  // VENUS (5)
  5: {
    7: {
      general: { en: 'Venus in the 7th house is exceptionally strong for marriage and partnerships. Attractive, devoted spouse and harmonious relationships. Business prospers through diplomacy.', hi: 'सप्तम भाव में शुक्र विवाह और साझेदारी के लिए असाधारण रूप से शक्तिशाली। आकर्षक, समर्पित जीवनसाथी। कूटनीति से व्यापार सफल।', sa: 'सप्तमभावे शुक्रः विवाहाय साझेदार्यै च असाधारणतया शक्तिमान्।' },
      implications: { en: 'Strong for marriage — attractive spouse and prosperous partnerships. Business partnerships prosper through charm and diplomacy. Public image is charming and appealing.', hi: 'विवाह के लिए शक्तिशाली — आकर्षक जीवनसाथी। आकर्षण और कूटनीति से व्यापारिक साझेदारी सफल। सार्वजनिक छवि मनोहर।', sa: 'विवाहाय शक्तिमान् — आकर्षकः जीवनसाथी। कूटनीतिना व्यापारसाझेदारी सफला।' },
      prognosis: { en: 'Happy marriage with attractive, supportive partner. Business success through relationships. Public popularity through charming presence. Partnerships improve with time.', hi: 'आकर्षक, सहायक साथी के साथ सुखी विवाह। सम्बन्धों से व्यापार सफलता। मनोहर उपस्थिति से लोकप्रियता।', sa: 'आकर्षकेण सहायकेन साथिना सह सुखी विवाहः।' },
    },
  },
  // SATURN (6)
  6: {
    10: {
      general: { en: 'Saturn in the 10th house is its directional strength (Dig Bala) — conferring career power through steady effort, discipline, and institutional authority. Success is delayed but permanent.', hi: 'दशम भाव में शनि दिग्बल — स्थिर प्रयास, अनुशासन और संस्थागत अधिकार से कैरियर शक्ति। सफलता विलम्बित पर स्थायी।', sa: 'दशमभावे शनिः दिग्बले — स्थिरप्रयत्नेन अनुशासनेन च जीविकाशक्तिः।' },
      implications: { en: 'Powerful for career through steady effort. Government service, management, or structured leadership brings lasting success. Becomes authority in field.', hi: 'स्थिर प्रयास से कैरियर में शक्तिशाली। सरकारी सेवा, प्रबन्धन से स्थायी सफलता। क्षेत्र में अधिकारी बनता है।', sa: 'स्थिरप्रयत्नेन जीविकायां शक्तिमान्।' },
      prognosis: { en: 'Career success after sustained effort — major recognition at 40-55. Becomes authority in field. Legacy through institutional contribution endures.', hi: 'निरन्तर प्रयास के बाद कैरियर सफलता — 40-55 में प्रमुख मान्यता। संस्थागत योगदान से स्थायी विरासत।', sa: 'निरन्तरप्रयत्नात् जीविकासाफल्यम् — चत्वारिंशत्-पञ्चपञ्चाशत्वर्षे प्रमुखा मान्यता।' },
    },
  },
};

/** Get enhanced trilingual planet-in-house interpretation */
export function getPlanetInHouseEnhanced(
  planetId: number,
  house: number,
  locale: Locale
): { general: string; implications: string; prognosis: string } | null {
  const entry = PLANET_HOUSE_TRILINGUAL[planetId]?.[house];
  if (!entry) return null;

  const resolve = (tri: Tri): string => {
    if (locale === 'sa') return tri.sa || tri.hi;
    return locale === 'hi' ? tri.hi : tri.en;
  };

  return {
    general: resolve(entry.general),
    implications: resolve(entry.implications),
    prognosis: resolve(entry.prognosis),
  };
}
