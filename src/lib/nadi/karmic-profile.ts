/**
 * Karmic Profile — Past-life analysis for BNN readings.
 *
 * Three primary indicators:
 *  1. Ketu's sign + house      → primary past-life indicator
 *  2. 5th lord placement       → Purva Punya (past merit/blessings carried forward)
 *  3. 9th lord placement       → dharmic inheritance
 *
 * Sign lordship (Parashari): sign (1-12) → planet id (0=Sun..6=Saturn)
 */

import type { KundaliData } from '@/types/kundali';
import { RASHIS } from '@/lib/constants/rashis';
import { tl } from '@/lib/utils/trilingual';

// Sign lordship: sign → planet id
const SIGN_LORD: Record<number, number> = {
  1: 2, // Aries → Mars
  2: 5, // Taurus → Venus
  3: 3, // Gemini → Mercury
  4: 1, // Cancer → Moon
  5: 0, // Leo → Sun
  6: 3, // Virgo → Mercury
  7: 5, // Libra → Venus
  8: 2, // Scorpio → Mars
  9: 4, // Sagittarius → Jupiter
  10: 6, // Capricorn → Saturn
  11: 6, // Aquarius → Saturn
  12: 4, // Pisces → Jupiter
};

const PLANET_NAMES_EN: Record<number, string> = {
  0: 'Sun', 1: 'Moon', 2: 'Mars', 3: 'Mercury',
  4: 'Jupiter', 5: 'Venus', 6: 'Saturn', 7: 'Rahu', 8: 'Ketu',
};

const PLANET_NAMES_HI: Record<number, string> = {
  0: 'सूर्य', 1: 'चन्द्र', 2: 'मंगल', 3: 'बुध',
  4: 'बृहस्पति', 5: 'शुक्र', 6: 'शनि', 7: 'राहु', 8: 'केतु',
};

// Past-life themes by Ketu sign
const KETU_PAST_LIFE_THEMES: Record<number, { en: string; hi: string }> = {
  1: { en: 'a warrior, pioneer, or leader who mastered individual courage and independent action', hi: 'एक योद्धा, अग्रणी या नेता जिसने व्यक्तिगत साहस और स्वतंत्र क्रिया में निपुणता प्राप्त की' },
  2: { en: 'a person of substantial wealth, agricultural mastery, or material stewardship', hi: 'पर्याप्त धन, कृषि महारत या भौतिक प्रबंधन का व्यक्ति' },
  3: { en: 'a merchant, scholar, writer, or communicator who navigated multiple streams of knowledge', hi: 'एक व्यापारी, विद्वान, लेखक या संवादकर्ता जिसने ज्ञान की अनेक धाराओं को नेविगेट किया' },
  4: { en: 'a devoted family person, householder, or community nurturer deeply attached to home and heritage', hi: 'एक समर्पित परिवार व्यक्ति, गृहस्थ या समुदाय पोषक जो घर और विरासत से गहराई से जुड़ा था' },
  5: { en: 'a king, creative artist, or authority figure whose gifts centred on expression and rulership', hi: 'एक राजा, रचनात्मक कलाकार या अधिकार व्यक्ति जिसके उपहार अभिव्यक्ति और शासन पर केंद्रित थे' },
  6: { en: 'a healer, servant, or skilled craftsperson whose life was oriented toward precise service and duty', hi: 'एक चिकित्सक, सेवक या कुशल शिल्पकार जिसका जीवन सटीक सेवा और कर्तव्य की ओर उन्मुख था' },
  7: { en: 'a diplomat, partner, artist, or judge whose life centred on relationships, justice, and harmony', hi: 'एक कूटनीतिज्ञ, साथी, कलाकार या न्यायाधीश जिसका जीवन संबंधों, न्याय और सामंजस्य पर केंद्रित था' },
  8: { en: 'a researcher, mystic, surgeon, or crisis navigator who mastered the depths of transformation and hidden knowledge', hi: 'एक शोधकर्ता, रहस्यवादी, शल्यचिकित्सक या संकट नेविगेटर जिसने रूपांतरण और छिपे ज्ञान की गहराइयों में महारत हासिल की' },
  9: { en: 'a philosopher, priest, pilgrim, or teacher whose life was centred on dharma, truth, and higher wisdom', hi: 'एक दार्शनिक, पुजारी, तीर्थयात्री या शिक्षक जिसका जीवन धर्म, सत्य और उच्च ज्ञान पर केंद्रित था' },
  10: { en: 'an administrator, ruler, builder, or institutional leader who mastered worldly authority and long-term achievement', hi: 'एक प्रशासक, शासक, निर्माता या संस्थागत नेता जिसने सांसारिक अधिकार और दीर्घकालिक उपलब्धि में महारत हासिल की' },
  11: { en: 'a reformer, community organiser, scientist, or visionary who worked to elevate collective life', hi: 'एक सुधारक, सामुदायिक आयोजक, वैज्ञानिक या दूरदर्शी जिसने सामूहिक जीवन को ऊँचा उठाने के लिए काम किया' },
  12: { en: 'a monk, mystic, renunciant, or spiritual aspirant whose life was oriented toward liberation and the dissolution of the personal self', hi: 'एक भिक्षु, रहस्यवादी, संन्यासी या आध्यात्मिक साधक जिसका जीवन मुक्ति और व्यक्तिगत स्व के विघटन की ओर उन्मुख था' },
};

// Purva Punya themes by 5th lord sign
const PURVA_PUNYA_THEMES: Record<number, { en: string; hi: string }> = {
  1: { en: 'courage, initiative, and the merit of decisive action taken in service of a worthy cause', hi: 'साहस, पहल और किसी योग्य कारण की सेवा में लिए गए निर्णायक कार्य का पुण्य' },
  2: { en: 'generosity, financial stewardship, and the merit of providing for family and community', hi: 'उदारता, वित्तीय प्रबंधन और परिवार और समुदाय के लिए प्रदान करने का पुण्य' },
  3: { en: 'intellectual service, teaching, and the merit of sharing knowledge freely', hi: 'बौद्धिक सेवा, शिक्षण और ज्ञान को स्वतंत्र रूप से साझा करने का पुण्य' },
  4: { en: 'devotion to family, ancestral service, and the merit of protecting and nurturing those in one\'s care', hi: 'परिवार के प्रति भक्ति, पूर्वज सेवा और अपनी देखभाल में लोगों की रक्षा और पोषण करने का पुण्य' },
  5: { en: 'creative expression, righteous rulership, and the merit of inspiring and uplifting others through art or authority', hi: 'रचनात्मक अभिव्यक्ति, धर्मी शासन और कला या अधिकार के माध्यम से दूसरों को प्रेरित और ऊपर उठाने का पुण्य' },
  6: { en: 'healing, precise service, and the merit of selfless technical work done in service of others\' welfare', hi: 'चिकित्सा, सटीक सेवा और दूसरों के कल्याण की सेवा में किए गए निस्वार्थ तकनीकी कार्य का पुण्य' },
  7: { en: 'partnership dharma, diplomacy, and the merit of creating harmonious relationships and just agreements', hi: 'साझेदारी धर्म, कूटनीति और सामंजस्यपूर्ण संबंध और न्यायपूर्ण समझौते बनाने का पुण्य' },
  8: { en: 'spiritual transformation, occult service, and the merit of guiding others through crisis and renewal', hi: 'आध्यात्मिक रूपांतरण, गूढ़ सेवा और संकट और नवीकरण के माध्यम से दूसरों का मार्गदर्शन करने का पुण्य' },
  9: { en: 'dharmic teaching, pilgrimage, and the merit of spreading wisdom and upholding sacred knowledge', hi: 'धार्मिक शिक्षण, तीर्थयात्रा और ज्ञान फैलाने और पवित्र ज्ञान को बनाए रखने का पुण्य' },
  10: { en: 'dutiful administration, ethical leadership, and the merit of sustained responsible service to society', hi: 'कर्तव्यपूर्ण प्रशासन, नैतिक नेतृत्व और समाज की निरंतर जिम्मेदार सेवा का पुण्य' },
  11: { en: 'collective service, social reform, and the merit of elevating communities and working for universal welfare', hi: 'सामूहिक सेवा, सामाजिक सुधार और समुदायों को ऊँचा उठाने और सार्वभौमिक कल्याण के लिए काम करने का पुण्य' },
  12: { en: 'spiritual renunciation, compassionate service, and the merit of deep meditation and liberation-oriented practice', hi: 'आध्यात्मिक त्याग, करुणापूर्ण सेवा और गहरे ध्यान और मुक्ति-उन्मुख अभ्यास का पुण्य' },
};

export interface KarmicProfile {
  ketuSign: number;
  ketuSignName: string;
  ketuHouse: number;
  rahuSign: number;
  rahuSignName: string;
  rahuHouse: number;
  ketuReading: string;
  pastLifeTheme: string;
  purvaPunya: string;
  dharmaPath: string;
  summary: string;
}

/**
 * Compute the karmic profile from a kundali.
 */
export function computeKarmicProfile(kundali: KundaliData, locale: string): KarmicProfile {
  const planets = kundali.planets;
  const ascendantSign = kundali.ascendant.sign;

  // Find Ketu and Rahu
  const ketuPlanet = planets.find(p => p.planet.id === 8);
  const rahuPlanet = planets.find(p => p.planet.id === 7);

  const ketuSign = ketuPlanet?.sign ?? 1;
  const ketuHouse = ketuPlanet?.house ?? 1;
  const rahuSign = rahuPlanet?.sign ?? 7;
  const rahuHouse = rahuPlanet?.house ?? 7;

  const ketuRashi = RASHIS.find(r => r.id === ketuSign);
  const rahuRashi = RASHIS.find(r => r.id === rahuSign);

  const ketuSignName = tl(ketuRashi?.name ?? { en: 'Unknown' }, locale);
  const rahuSignName = tl(rahuRashi?.name ?? { en: 'Unknown' }, locale);

  // House names
  const HOUSE_NAMES_EN: Record<number, string> = {
    1: '1st', 2: '2nd', 3: '3rd', 4: '4th', 5: '5th', 6: '6th',
    7: '7th', 8: '8th', 9: '9th', 10: '10th', 11: '11th', 12: '12th',
  };
  const HOUSE_NAMES_HI: Record<number, string> = {
    1: 'प्रथम', 2: 'द्वितीय', 3: 'तृतीय', 4: 'चतुर्थ', 5: 'पंचम', 6: 'षष्ठ',
    7: 'सप्तम', 8: 'अष्टम', 9: 'नवम', 10: 'दशम', 11: 'एकादश', 12: 'द्वादश',
  };

  // Ketu reading
  const ketuTheme = KETU_PAST_LIFE_THEMES[ketuSign];
  const ketuThemeText = locale === 'hi' ? (ketuTheme?.hi ?? '') : (ketuTheme?.en ?? '');
  const ketuHouseName = locale === 'hi' ? HOUSE_NAMES_HI[ketuHouse] : HOUSE_NAMES_EN[ketuHouse];
  const ketuReading = locale === 'hi'
    ? `${ketuSignName} राशि में ${ketuHouseName} भाव में केतु इंगित करता है कि आप पूर्व जन्म में ${ketuThemeText} थे। यह क्षेत्र इस जीवन में स्वाभाविक रूप से आता है लेकिन अकेले पूर्णता प्रदान नहीं करता।`
    : `Ketu in ${ketuSignName} in the ${ketuHouseName} house indicates you were ${ketuThemeText} in past lives. This domain comes naturally in this life but no longer provides complete fulfilment on its own.`;

  // Past-life theme narrative
  const pastLifeTheme = locale === 'hi'
    ? `पूर्व जन्म का मुख्य विषय: ${ketuSignName} में ${ketuHouseName} भाव के केतु की ऊर्जाओं में महारत। इस जीवन में इन पुराने पैटर्नों को जाने देना आत्मा के विकास की कुंजी है।`
    : `Primary past-life theme: mastery in the energies of Ketu in ${ketuSignName} in the ${ketuHouseName} house. Releasing these old patterns in this life is key to the soul\'s forward movement.`;

  // 5th lord analysis → Purva Punya
  const fifthHouseSign = ((ascendantSign - 1 + 4) % 12) + 1;
  const fifthLordId = SIGN_LORD[fifthHouseSign];
  const fifthLordPlanet = planets.find(p => p.planet.id === fifthLordId);
  const fifthLordSign = fifthLordPlanet?.sign ?? fifthHouseSign;
  const purvaPunyaTheme = PURVA_PUNYA_THEMES[fifthLordSign];
  const fifthLordName = locale === 'hi' ? (PLANET_NAMES_HI[fifthLordId] ?? '') : (PLANET_NAMES_EN[fifthLordId] ?? '');
  const fifthLordSignRashi = RASHIS.find(r => r.id === fifthLordSign);
  const fifthLordSignName = tl(fifthLordSignRashi?.name ?? { en: 'Unknown' }, locale);
  const purvaPunyaThemeText = locale === 'hi' ? (purvaPunyaTheme?.hi ?? '') : (purvaPunyaTheme?.en ?? '');

  const purvaPunya = locale === 'hi'
    ? `पंचम भाव के स्वामी ${fifthLordName} ${fifthLordSignName} राशि में स्थित हैं, जो पूर्व पुण्य दर्शाता है: ${purvaPunyaThemeText}। यह पुण्य इस जन्म में अनुग्रह, सहायता और अनायास अवसरों के रूप में प्रकट होता है।`
    : `The 5th lord ${fifthLordName} is placed in ${fifthLordSignName}, indicating Purva Punya (past merit) in the area of ${purvaPunyaThemeText}. This merit manifests as grace, support, and unexpected opportunities in this life.`;

  // 9th lord analysis → dharmic inheritance
  const ninthHouseSign = ((ascendantSign - 1 + 8) % 12) + 1;
  const ninthLordId = SIGN_LORD[ninthHouseSign];
  const ninthLordPlanet = planets.find(p => p.planet.id === ninthLordId);
  const ninthLordSign = ninthLordPlanet?.sign ?? ninthHouseSign;
  const ninthLordSignRashi = RASHIS.find(r => r.id === ninthLordSign);
  const ninthLordSignName = tl(ninthLordSignRashi?.name ?? { en: 'Unknown' }, locale);
  const ninthLordName = locale === 'hi' ? (PLANET_NAMES_HI[ninthLordId] ?? '') : (PLANET_NAMES_EN[ninthLordId] ?? '');
  const rahuHouseName = locale === 'hi' ? HOUSE_NAMES_HI[rahuHouse] : HOUSE_NAMES_EN[rahuHouse];

  const dharmaPath = locale === 'hi'
    ? `नवम भाव के स्वामी ${ninthLordName} ${ninthLordSignName} में हैं, जो इस जन्म का धर्म विरासत दर्शाता है। राहु ${rahuSignName} में ${rahuHouseName} भाव में है — ${rahuSignName} की ऊर्जाओं और ${rahuHouseName} भाव के विषयों में कदम रखना ही इस आत्मा का आगे बढ़ने का मार्ग है।`
    : `The 9th lord ${ninthLordName} in ${ninthLordSignName} indicates the dharmic inheritance of this incarnation. Rahu in ${rahuSignName} in the ${rahuHouseName} house points the way forward — stepping into the energies of ${rahuSignName} and the themes of the ${rahuHouseName} house is the soul\'s evolutionary directive.`;

  // Summary
  const summary = locale === 'hi'
    ? `आपकी आत्मा ${ketuSignName} और ${ketuHouseName} भाव में पूर्व जन्म की महारत लेकर आई है। इस जन्म का उद्देश्य ${rahuSignName} और ${rahuHouseName} भाव की चुनौतियों में विकसित होना है, ${purvaPunyaThemeText} के पुण्य का उपयोग करते हुए।`
    : `Your soul carries past-life mastery in ${ketuSignName} and the ${ketuHouseName} house. This life\'s purpose is to evolve into the challenges of ${rahuSignName} and the ${rahuHouseName} house, drawing on the merit of ${purvaPunyaThemeText}.`;

  return {
    ketuSign,
    ketuSignName,
    ketuHouse,
    rahuSign,
    rahuSignName,
    rahuHouse,
    ketuReading,
    pastLifeTheme,
    purvaPunya,
    dharmaPath,
    summary,
  };
}
