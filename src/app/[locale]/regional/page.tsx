'use client';

import { useMemo } from 'react';
import { useLocale } from 'next-intl';
import { motion } from 'framer-motion';
import GoldDivider from '@/components/ui/GoldDivider';
import { dateToJD, sunLongitude, toSidereal, getRashiNumber, moonLongitude, calculateTithi } from '@/lib/ephem/astronomical';
import type { Locale, Trilingual } from '@/types/panchang';

// =================================================================
// Regional Calendar Data
// =================================================================

interface RegionalCalendar {
  id: string;
  name: Trilingual;
  type: 'solar' | 'lunisolar';
  script: string;
  months: { name: string; approxGregorian: string }[];
  newYear: { name: string; approxDate: string };
  description: Trilingual;
  festivals: { name: string; month: number; description: Trilingual }[];
}

const REGIONAL_CALENDARS: RegionalCalendar[] = [
  {
    id: 'tamil',
    name: { en: 'Tamil (Thiruvalluvar)', hi: 'तमिल (तिरुवल्लुवर)', sa: 'द्रविडपञ्चाङ्गम्' },
    type: 'solar',
    script: 'தமிழ்',
    months: [
      { name: 'Chithirai (சித்திரை)', approxGregorian: 'Apr 14 – May 14' },
      { name: 'Vaikasi (வைகாசி)', approxGregorian: 'May 15 – Jun 14' },
      { name: 'Aani (ஆனி)', approxGregorian: 'Jun 15 – Jul 16' },
      { name: 'Aadi (ஆடி)', approxGregorian: 'Jul 17 – Aug 16' },
      { name: 'Aavani (ஆவணி)', approxGregorian: 'Aug 17 – Sep 16' },
      { name: 'Purattasi (புரட்டாசி)', approxGregorian: 'Sep 17 – Oct 17' },
      { name: 'Aippasi (ஐப்பசி)', approxGregorian: 'Oct 18 – Nov 15' },
      { name: 'Karthigai (கார்த்திகை)', approxGregorian: 'Nov 16 – Dec 15' },
      { name: 'Margazhi (மார்கழி)', approxGregorian: 'Dec 16 – Jan 13' },
      { name: 'Thai (தை)', approxGregorian: 'Jan 14 – Feb 12' },
      { name: 'Maasi (மாசி)', approxGregorian: 'Feb 13 – Mar 13' },
      { name: 'Panguni (பங்குனி)', approxGregorian: 'Mar 14 – Apr 13' },
    ],
    newYear: { name: 'Puthandu (புத்தாண்டு)', approxDate: 'April 14' },
    description: {
      en: 'The Tamil calendar is a sidereal solar calendar based on the Sun\'s transit through the 12 Rashi signs. Each month begins when the Sun enters a new sign. It\'s one of the oldest calendar systems in continuous use.',
      hi: 'तमिल पंचांग सूर्य के 12 राशियों में गोचर पर आधारित सायन सौर पंचांग है। प्रत्येक मास सूर्य के नई राशि में प्रवेश से आरम्भ होता है।',
      sa: 'द्रविडपञ्चाङ्गं सूर्यस्य द्वादशराशिषु गोचरे आधारितम्।',
    },
    festivals: [
      { name: 'Pongal (பொங்கல்)', month: 10, description: { en: 'Harvest festival celebrating the Sun\'s journey north (Uttarayan). Four-day celebration with Bhogi, Thai Pongal, Mattu Pongal, and Kaanum Pongal.', hi: 'सूर्य की उत्तर यात्रा (उत्तरायण) का उत्सव। चार दिवसीय उत्सव।', sa: 'उत्तरायणस्य उत्सवः।' } },
      { name: 'Chithirai Thiruvizha', month: 1, description: { en: 'Tamil New Year and Meenakshi Thirukalyanam at Madurai temple.', hi: 'तमिल नववर्ष और मदुरै मन्दिर में मीनाक्षी तिरुकल्याणम्।', sa: 'तमिलनववर्षम्।' } },
      { name: 'Aadi Perukku', month: 4, description: { en: 'Water festival celebrating the rise of river waters and agricultural fertility.', hi: 'नदी जल वृद्धि और कृषि उर्वरता का उत्सव।', sa: 'जलोत्सवः।' } },
      { name: 'Karthigai Deepam', month: 8, description: { en: 'Festival of lights at Tiruvannamalai — the Mahadeepam on the hill.', hi: 'तिरुवन्नामलाई में दीपोत्सव — पहाड़ पर महादीपम्।', sa: 'कार्तिकदीपोत्सवः।' } },
    ],
  },
  {
    id: 'telugu',
    name: { en: 'Telugu (Shalivahana Shaka)', hi: 'तेलुगु (शालिवाहन शक)', sa: 'आन्ध्रपञ्चाङ्गम्' },
    type: 'lunisolar',
    script: 'తెలుగు',
    months: [
      { name: 'Chaitra (చైత్రము)', approxGregorian: 'Mar/Apr' },
      { name: 'Vaishakha (వైశాఖము)', approxGregorian: 'Apr/May' },
      { name: 'Jyeshtha (జ్యేష్ఠము)', approxGregorian: 'May/Jun' },
      { name: 'Ashadha (ఆషాఢము)', approxGregorian: 'Jun/Jul' },
      { name: 'Shravana (శ్రావణము)', approxGregorian: 'Jul/Aug' },
      { name: 'Bhadrapada (భాద్రపదము)', approxGregorian: 'Aug/Sep' },
      { name: 'Ashvija (ఆశ్వయుజము)', approxGregorian: 'Sep/Oct' },
      { name: 'Karthika (కార్తీకము)', approxGregorian: 'Oct/Nov' },
      { name: 'Margashira (మార్గశీర్షము)', approxGregorian: 'Nov/Dec' },
      { name: 'Pushya (పుష్యము)', approxGregorian: 'Dec/Jan' },
      { name: 'Magha (మాఘము)', approxGregorian: 'Jan/Feb' },
      { name: 'Phalguna (ఫాల్గుణము)', approxGregorian: 'Feb/Mar' },
    ],
    newYear: { name: 'Ugadi (ఉగాది)', approxDate: 'Chaitra Shukla Pratipada (Mar/Apr)' },
    description: {
      en: 'The Telugu calendar follows the Shalivahana Shaka era (starts 78 CE). It is lunisolar — months are based on the lunar cycle (Amanta system, ending on Amavasya) while years track the solar cycle.',
      hi: 'तेलुगु पंचांग शालिवाहन शक युग (78 ई.) का अनुसरण करता है। यह चान्द्र-सौर पद्धति है — अमान्त प्रणाली।',
      sa: 'तेलुगुपञ्चाङ्गं शालिवाहनशकयुगम् अनुसरति। अमान्तपद्धतिः।',
    },
    festivals: [
      { name: 'Ugadi (ఉగాది)', month: 1, description: { en: 'Telugu New Year. Ugadi Pachadi with six tastes symbolizing life\'s varied experiences.', hi: 'तेलुगु नववर्ष। छह स्वादों वाला उगादि पचड़ी।', sa: 'तेलुगुनववर्षम्।' } },
      { name: 'Bathukamma (బతుకమ్మ)', month: 7, description: { en: 'Telangana\'s floral festival honoring Goddess Gauri. Nine-day celebration.', hi: 'तेलंगाना का पुष्प उत्सव। नौ दिवसीय आयोजन।', sa: 'पुष्पोत्सवः।' } },
      { name: 'Bonalu (బోనాలు)', month: 4, description: { en: 'Offering festival to Goddess Mahakali in Hyderabad/Secunderabad.', hi: 'हैदराबाद में महाकाली को भोग अर्पण उत्सव।', sa: 'महाकालीपूजोत्सवः।' } },
      { name: 'Sankranti (సంక్రాంతి)', month: 10, description: { en: 'Three-day harvest festival: Bhogi, Makara Sankranti, Kanuma.', hi: 'तीन दिवसीय फसल उत्सव: भोगी, मकर संक्रान्ति, कनुमा।', sa: 'मकरसंक्रान्तिः।' } },
    ],
  },
  {
    id: 'kannada',
    name: { en: 'Kannada (Shalivahana Shaka)', hi: 'कन्नड़ (शालिवाहन शक)', sa: 'कर्णाटकपञ्चाङ्गम्' },
    type: 'lunisolar',
    script: 'ಕನ್ನಡ',
    months: [
      { name: 'Chaitra (ಚೈತ್ರ)', approxGregorian: 'Mar/Apr' },
      { name: 'Vaishakha (ವೈಶಾಖ)', approxGregorian: 'Apr/May' },
      { name: 'Jyeshtha (ಜ್ಯೇಷ್ಠ)', approxGregorian: 'May/Jun' },
      { name: 'Ashadha (ಆಷಾಢ)', approxGregorian: 'Jun/Jul' },
      { name: 'Shravana (ಶ್ರಾವಣ)', approxGregorian: 'Jul/Aug' },
      { name: 'Bhadrapada (ಭಾದ್ರಪದ)', approxGregorian: 'Aug/Sep' },
      { name: 'Ashvija (ಆಶ್ವಯುಜ)', approxGregorian: 'Sep/Oct' },
      { name: 'Karthika (ಕಾರ್ತೀಕ)', approxGregorian: 'Oct/Nov' },
      { name: 'Margashira (ಮಾರ್ಗಶಿರ)', approxGregorian: 'Nov/Dec' },
      { name: 'Pushya (ಪುಷ್ಯ)', approxGregorian: 'Dec/Jan' },
      { name: 'Magha (ಮಾಘ)', approxGregorian: 'Jan/Feb' },
      { name: 'Phalguna (ಫಾಲ್ಗುಣ)', approxGregorian: 'Feb/Mar' },
    ],
    newYear: { name: 'Yugadi (ಯುಗಾದಿ)', approxDate: 'Chaitra Shukla Pratipada (Mar/Apr)' },
    description: {
      en: 'The Kannada calendar also uses Shalivahana Shaka with the lunisolar Amanta system. Very similar to the Telugu system but with distinct regional festival traditions.',
      hi: 'कन्नड़ पंचांग भी शालिवाहन शक और अमान्त चान्द्र-सौर पद्धति का उपयोग करता है।',
      sa: 'कर्णाटकपञ्चाङ्गम् अपि शालिवाहनशकम् अमान्तपद्धतिं च उपयुनक्ति।',
    },
    festivals: [
      { name: 'Yugadi (ಯುಗಾದಿ)', month: 1, description: { en: 'Kannada New Year. Bevu-Bella (neem-jaggery) symbolizes life\'s bitter and sweet.', hi: 'कन्नड़ नववर्ष। बेवु-बेल्ला (नीम-गुड़) जीवन के कड़वे-मीठे का प्रतीक।', sa: 'कर्णाटकनववर्षम्।' } },
      { name: 'Varamahalakshmi', month: 5, description: { en: 'Worship of Goddess Lakshmi on the Friday before Purnima in Shravana.', hi: 'श्रावण में पूर्णिमा से पहले शुक्रवार को लक्ष्मी पूजन।', sa: 'वरमहालक्ष्मीपूजा।' } },
      { name: 'Dasara (ದಸರಾ)', month: 7, description: { en: 'Grand Mysore Dasara — 10-day festival culminating in a majestic procession with the golden howdah.', hi: 'भव्य मैसूर दशहरा — स्वर्ण अम्बारी के साथ 10 दिवसीय उत्सव।', sa: 'मैसूरदशहरा।' } },
      { name: 'Makar Sankranti (ಸಂಕ್ರಾಂತಿ)', month: 10, description: { en: 'Ellu-Bella exchange (sesame-jaggery) with the greeting "Ellu Bella thindu, olle maathu aadu."', hi: 'एल्लु-बेल्ला विनिमय (तिल-गुड़)।', sa: 'मकरसंक्रान्तिः।' } },
    ],
  },
  {
    id: 'bengali',
    name: { en: 'Bengali (Bangla)', hi: 'बंगाली (बांग्ला)', sa: 'बङ्गीयपञ्चाङ्गम्' },
    type: 'solar',
    script: 'বাংলা',
    months: [
      { name: 'Boishakh (বৈশাখ)', approxGregorian: 'Apr 14 – May 14' },
      { name: 'Joishtho (জ্যৈষ্ঠ)', approxGregorian: 'May 15 – Jun 14' },
      { name: 'Asharh (আষাঢ়)', approxGregorian: 'Jun 15 – Jul 15' },
      { name: 'Shrabon (শ্রাবণ)', approxGregorian: 'Jul 16 – Aug 15' },
      { name: 'Bhadro (ভাদ্র)', approxGregorian: 'Aug 16 – Sep 15' },
      { name: 'Ashwin (আশ্বিন)', approxGregorian: 'Sep 16 – Oct 15' },
      { name: 'Kartik (কার্তিক)', approxGregorian: 'Oct 16 – Nov 14' },
      { name: 'Ogrohayon (অগ্রহায়ণ)', approxGregorian: 'Nov 15 – Dec 14' },
      { name: 'Poush (পৌষ)', approxGregorian: 'Dec 15 – Jan 13' },
      { name: 'Magh (মাঘ)', approxGregorian: 'Jan 14 – Feb 12' },
      { name: 'Falgun (ফাল্গুন)', approxGregorian: 'Feb 13 – Mar 14' },
      { name: 'Choitro (চৈত্র)', approxGregorian: 'Mar 15 – Apr 13' },
    ],
    newYear: { name: 'Pohela Boishakh (পহেলা বৈশাখ)', approxDate: 'April 14' },
    description: {
      en: 'The Bengali calendar (Bangabda) was reformed by Mughal emperor Akbar for tax collection purposes. It\'s a solar calendar tracking the Sun\'s sidereal transit. The Bengali year starts with Boishakh.',
      hi: 'बंगाली पंचांग (बंगाब्द) मुगल सम्राट अकबर द्वारा कर संग्रह हेतु सुधारित। यह सौर पंचांग है।',
      sa: 'बङ्गीयपञ्चाङ्गं सौरपद्धत्या चलति।',
    },
    festivals: [
      { name: 'Pohela Boishakh', month: 1, description: { en: 'Bengali New Year. Mangal Shobhajatra procession, Halkhata (opening new ledgers), and cultural programs.', hi: 'बंगाली नववर्ष। मंगल शोभायात्रा, हालखाता और सांस्कृतिक कार्यक्रम।', sa: 'बङ्गीयनववर्षम्।' } },
      { name: 'Durga Puja (দুর্গা পূজা)', month: 6, description: { en: 'The grandest Bengali festival — five days of Durga worship from Shashthi to Dashami with elaborate pandals.', hi: 'भव्य बंगाली उत्सव — षष्ठी से दशमी तक पाँच दिवसीय दुर्गा पूजा।', sa: 'दुर्गापूजा — षष्ठ्याः दशम्यां यावत्।' } },
      { name: 'Kali Puja (কালী পূজা)', month: 7, description: { en: 'Worship of Goddess Kali on the night of Diwali. Special to Bengal.', hi: 'दीवाली की रात काली माँ की पूजा। बंगाल की विशेष परम्परा।', sa: 'कालीपूजा।' } },
      { name: 'Poush Parbon', month: 9, description: { en: 'Winter harvest festival. Pithe-puli (rice cakes) festival celebrating the harvest of new rice.', hi: 'शीतकालीन फसल उत्सव। नए चावल की फसल का उत्सव।', sa: 'पौषपर्वन्।' } },
    ],
  },
  {
    id: 'gujarati',
    name: { en: 'Gujarati (Vikram Samvat)', hi: 'गुजराती (विक्रम संवत)', sa: 'गुर्जरपञ्चाङ्गम्' },
    type: 'lunisolar',
    script: 'ગુજરાતી',
    months: [
      { name: 'Kartik (કારતક)', approxGregorian: 'Oct/Nov' },
      { name: 'Magshar (માગશર)', approxGregorian: 'Nov/Dec' },
      { name: 'Posh (પોષ)', approxGregorian: 'Dec/Jan' },
      { name: 'Maha (મહા)', approxGregorian: 'Jan/Feb' },
      { name: 'Fagan (ફાગણ)', approxGregorian: 'Feb/Mar' },
      { name: 'Chaitra (ચૈત્ર)', approxGregorian: 'Mar/Apr' },
      { name: 'Vaishakh (વૈશાખ)', approxGregorian: 'Apr/May' },
      { name: 'Jeth (જેઠ)', approxGregorian: 'May/Jun' },
      { name: 'Ashadh (અષાઢ)', approxGregorian: 'Jun/Jul' },
      { name: 'Shravan (શ્રાવણ)', approxGregorian: 'Jul/Aug' },
      { name: 'Bhadarvo (ભાદરવો)', approxGregorian: 'Aug/Sep' },
      { name: 'Aso (આસો)', approxGregorian: 'Sep/Oct' },
    ],
    newYear: { name: 'Bestu Varas (બેસ્તુ વરસ)', approxDate: 'Day after Diwali (Kartik Shukla Pratipada)' },
    description: {
      en: 'The Gujarati calendar uniquely starts its year after Diwali (Kartik Shukla Pratipada), unlike most Indian calendars starting in Chaitra. It follows Vikram Samvat with the Amanta lunar system.',
      hi: 'गुजराती पंचांग अनूठे रूप से दीवाली के बाद (कार्तिक शुक्ल प्रतिपदा) नववर्ष मनाता है। विक्रम संवत अमान्त पद्धति।',
      sa: 'गुर्जरपञ्चाङ्गं दीपावल्यनन्तरं नववर्षम् आरभते। विक्रमसंवत् अमान्तपद्धतिः।',
    },
    festivals: [
      { name: 'Navratri (નવરાત્રી)', month: 12, description: { en: 'Gujarat\'s iconic nine-night Garba and Dandiya Raas celebration — the world\'s longest dance festival.', hi: 'गुजरात का प्रतिष्ठित नौ रात्रि गरबा और डांडिया रास उत्सव।', sa: 'नवरात्रोत्सवः — गरबा-दण्डियारासोत्सवः।' } },
      { name: 'Uttarayan (ઉત્તરાયણ)', month: 4, description: { en: 'International Kite Festival on Makar Sankranti. Skies filled with colorful kites across Gujarat.', hi: 'मकर संक्रान्ति पर अन्तर्राष्ट्रीय पतंग उत्सव।', sa: 'उत्तरायणपतङ्गोत्सवः।' } },
      { name: 'Janmashtami (જન્માષ્ટમી)', month: 11, description: { en: 'Krishna Janmashtami with Dahi Handi and temple celebrations across Gujarat.', hi: 'दही हांडी और मन्दिर उत्सव के साथ कृष्ण जन्माष्टमी।', sa: 'कृष्णजन्माष्टमी।' } },
      { name: 'Bestu Varas', month: 1, description: { en: 'Gujarati New Year — day after Diwali. Account books opened, temples decorated.', hi: 'गुजराती नववर्ष — दीवाली के अगले दिन।', sa: 'गुर्जरनववर्षम्।' } },
    ],
  },
  {
    id: 'marathi',
    name: { en: 'Marathi (Shalivahana Shaka)', hi: 'मराठी (शालिवाहन शक)', sa: 'महाराष्ट्रपञ्चाङ्गम्' },
    type: 'lunisolar',
    script: 'मराठी',
    months: [
      { name: 'Chaitra (चैत्र)', approxGregorian: 'Mar – Apr' },
      { name: 'Vaishakh (वैशाख)', approxGregorian: 'Apr – May' },
      { name: 'Jyeshtha (ज्येष्ठ)', approxGregorian: 'May – Jun' },
      { name: 'Ashadh (आषाढ)', approxGregorian: 'Jun – Jul' },
      { name: 'Shravan (श्रावण)', approxGregorian: 'Jul – Aug' },
      { name: 'Bhadrapad (भाद्रपद)', approxGregorian: 'Aug – Sep' },
      { name: 'Ashwin (आश्विन)', approxGregorian: 'Sep – Oct' },
      { name: 'Kartik (कार्तिक)', approxGregorian: 'Oct – Nov' },
      { name: 'Margashirsha (मार्गशीर्ष)', approxGregorian: 'Nov – Dec' },
      { name: 'Paush (पौष)', approxGregorian: 'Dec – Jan' },
      { name: 'Magh (माघ)', approxGregorian: 'Jan – Feb' },
      { name: 'Phalgun (फाल्गुन)', approxGregorian: 'Feb – Mar' },
    ],
    newYear: { name: 'Gudi Padwa (गुढी पाडवा)', approxDate: 'March/April (Chaitra Shukla Pratipada)' },
    description: {
      en: 'The Marathi calendar follows the Shalivahana Shaka era and the Amanta (Amant) system where the month ends with Amavasya (new moon). Gudi Padwa marks the new year — a decorated gudi (flag) is hoisted to celebrate.',
      hi: 'मराठी पंचांग शालिवाहन शक और अमान्त प्रणाली (मास अमावस्या पर समाप्त) का अनुसरण करता है। गुढी पाडवा नववर्ष है।',
      sa: 'महाराष्ट्रपञ्चाङ्गं शालिवाहनशकेन अमान्तपद्धत्या च चलति।',
    },
    festivals: [
      { name: 'Gudi Padwa (गुढी पाडवा)', month: 1, description: { en: 'Marathi New Year. A gudi (decorated pole with silk cloth, neem, mango, and garland topped with an inverted kalash) is hoisted outside homes.', hi: 'मराठी नववर्ष। घर के बाहर गुढी (सजा हुआ ध्वज) फहराया जाता है।', sa: 'महाराष्ट्रनववर्षम्।' } },
      { name: 'Ganesh Chaturthi (गणेश चतुर्थी)', month: 6, description: { en: 'Maharashtra\'s grandest festival — 10-day celebration of Lord Ganesha with elaborate pandals, immersion processions, and community worship.', hi: 'महाराष्ट्र का सबसे भव्य उत्सव — 10 दिवसीय गणेश पूजा, विसर्जन शोभायात्रा।', sa: 'गणेशचतुर्थी — दशदिनोत्सवः।' } },
      { name: 'Makar Sankranti (मकर संक्रान्ति)', month: 10, description: { en: 'Kite flying and til-gul distribution with the greeting "Tilgul ghya god god bola" (eat sesame-jaggery and speak sweetly).', hi: 'पतंगबाजी और तिल-गुड़ वितरण।', sa: 'मकरसंक्रान्तिः — तिलगुडवितरणम्।' } },
      { name: 'Ashadhi Ekadashi', month: 4, description: { en: 'Massive Wari pilgrimage to Pandharpur. Lakhs of Warkaris walk carrying palkhis of Sant Dnyaneshwar and Sant Tukaram.', hi: 'पंढरपुर वारी — लाखों वारकरी संत ज्ञानेश्वर और तुकाराम की पालखी लेकर चलते हैं।', sa: 'आषाढ्येकादशी — पण्ढरपुरतीर्थयात्रा।' } },
    ],
  },
  {
    id: 'malayalam',
    name: { en: 'Malayalam (Kollam Era)', hi: 'मलयालम (कोल्लम संवत)', sa: 'केरलपञ्चाङ्गम्' },
    type: 'solar',
    script: 'മലയാളം',
    months: [
      { name: 'Chingam (ചിങ്ങം)', approxGregorian: 'Aug 17 – Sep 16' },
      { name: 'Kanni (കന്നി)', approxGregorian: 'Sep 17 – Oct 16' },
      { name: 'Thulam (തുലാം)', approxGregorian: 'Oct 17 – Nov 15' },
      { name: 'Vrischikam (വൃശ്ചികം)', approxGregorian: 'Nov 16 – Dec 15' },
      { name: 'Dhanu (ധനു)', approxGregorian: 'Dec 16 – Jan 13' },
      { name: 'Makaram (മകരം)', approxGregorian: 'Jan 14 – Feb 12' },
      { name: 'Kumbham (കുംഭം)', approxGregorian: 'Feb 13 – Mar 13' },
      { name: 'Meenam (മീനം)', approxGregorian: 'Mar 14 – Apr 13' },
      { name: 'Medam (മേടം)', approxGregorian: 'Apr 14 – May 14' },
      { name: 'Edavam (ഇടവം)', approxGregorian: 'May 15 – Jun 14' },
      { name: 'Mithunam (മിഥുനം)', approxGregorian: 'Jun 15 – Jul 16' },
      { name: 'Karkidakam (കര്‍ക്കിടകം)', approxGregorian: 'Jul 17 – Aug 16' },
    ],
    newYear: { name: 'Vishu (വിഷു)', approxDate: 'April 14 (Medam 1)' },
    description: {
      en: 'The Malayalam calendar (Kolla Varsham) is a solar calendar starting from Chingam (Leo). It begins from 825 CE (Kollam Era). The year starts with the Chingam month but Vishu (Medam 1) is celebrated as the astronomical new year.',
      hi: 'मलयालम पंचांग (कोल्ल वर्षम्) चिंगम (सिंह) से शुरू होने वाला सौर पंचांग है। 825 ई. (कोल्लम संवत) से आरम्भ।',
      sa: 'केरलपञ्चाङ्गं चिङ्गमतः आरम्भमाणं सौरपञ्चाङ्गम्।',
    },
    festivals: [
      { name: 'Vishu (വിഷു)', month: 9, description: { en: 'Malayalam astronomical new year. Vishukkani (auspicious arrangement of fruits, gold, and rice) is viewed first thing in the morning.', hi: 'मलयालम खगोलीय नववर्ष। विषुक्कणि — फल, सोना और चावल की शुभ व्यवस्था प्रातः देखी जाती है।', sa: 'विषुपर्वन् — मलयालनववर्षम्।' } },
      { name: 'Onam (ഓണം)', month: 1, description: { en: 'Kerala\'s grandest festival — 10-day celebration honoring King Mahabali. Pookalam (flower carpets), Onasadya (feast with 26+ dishes), Vallam Kali (boat races).', hi: 'केरल का सबसे भव्य उत्सव — राजा महाबली की स्मृति में 10 दिन। पूक्कलम्, ओणसद्या, वल्लम् काली।', sa: 'ओणोत्सवः — महाबलिसम्माननम्।' } },
      { name: 'Thiruvathira (തിരുവാതിര)', month: 5, description: { en: 'Festival of Lord Shiva. Women perform the Thiruvathira Kali dance and fast for marital bliss.', hi: 'शिव पर्व। महिलाएँ तिरुवातिरा काली नृत्य करती हैं।', sa: 'तिरुवातिरापर्वन्।' } },
      { name: 'Thrissur Pooram', month: 9, description: { en: 'Greatest temple festival of Kerala at Vadakkunnathan Temple. Spectacular elephant processions, Kudamattam (umbrella ceremony), and fireworks.', hi: 'केरल का सबसे बड़ा मन्दिर उत्सव। भव्य हाथी शोभायात्रा, कुडमट्टम् और आतिशबाजी।', sa: 'त्रिशूरपूरम् — केरलस्य महोत्सवः।' } },
    ],
  },
  {
    id: 'odia',
    name: { en: 'Odia (Odia Era)', hi: 'ओड़िया (ओड़िया संवत)', sa: 'उत्कलपञ्चाङ्गम्' },
    type: 'lunisolar',
    script: 'ଓଡ଼ିଆ',
    months: [
      { name: 'Baisakha (ବୈଶାଖ)', approxGregorian: 'Apr 14 – May 14' },
      { name: 'Jyeshtha (ଜ୍ୟେଷ୍ଠ)', approxGregorian: 'May 15 – Jun 14' },
      { name: 'Ashadha (ଆଷାଢ଼)', approxGregorian: 'Jun 15 – Jul 16' },
      { name: 'Shrabana (ଶ୍ରାବଣ)', approxGregorian: 'Jul 17 – Aug 16' },
      { name: 'Bhadra (ଭାଦ୍ର)', approxGregorian: 'Aug 17 – Sep 16' },
      { name: 'Ashwina (ଆଶ୍ୱିନ)', approxGregorian: 'Sep 17 – Oct 16' },
      { name: 'Kartika (କାର୍ତ୍ତିକ)', approxGregorian: 'Oct 17 – Nov 15' },
      { name: 'Margashira (ମାର୍ଗଶିର)', approxGregorian: 'Nov 16 – Dec 15' },
      { name: 'Pausha (ପୌଷ)', approxGregorian: 'Dec 16 – Jan 13' },
      { name: 'Magha (ମାଘ)', approxGregorian: 'Jan 14 – Feb 12' },
      { name: 'Phalguna (ଫାଲ୍ଗୁନ)', approxGregorian: 'Feb 13 – Mar 13' },
      { name: 'Chaitra (ଚୈତ୍ର)', approxGregorian: 'Mar 14 – Apr 13' },
    ],
    newYear: { name: 'Pana Sankranti (ପଣା ସଂକ୍ରାନ୍ତି)', approxDate: 'April 14 (Maha Vishuba Sankranti)' },
    description: {
      en: 'The Odia calendar starts with Baisakha (Mesha Sankranti). It\'s primarily solar but with lunisolar elements for festivals. Closely linked with the Jagannath Temple tradition at Puri.',
      hi: 'ओड़िया पंचांग बैशाख (मेष संक्रान्ति) से आरम्भ होता है। जगन्नाथ मन्दिर पुरी की परम्परा से जुड़ा है।',
      sa: 'उत्कलपञ्चाङ्गं बैशाखात् आरभ्यते। जगन्नाथमन्दिरपरम्परया सम्बद्धम्।',
    },
    festivals: [
      { name: 'Rath Yatra (ରଥ ଯାତ୍ରା)', month: 3, description: { en: 'The world-famous chariot festival of Lord Jagannath at Puri. Three massive chariots carry Jagannath, Balabhadra, and Subhadra through the streets.', hi: 'पुरी में जगन्नाथ की विश्व प्रसिद्ध रथ यात्रा।', sa: 'रथयात्रा — जगन्नाथपुर्याम्।' } },
      { name: 'Raja Parba (ରଜ ପର୍ବ)', month: 3, description: { en: 'Unique three-day festival celebrating femininity and the Earth\'s menstruation cycle. Women swing on ropes and rest from fieldwork.', hi: 'नारीत्व और पृथ्वी की उर्वरता का तीन दिवसीय उत्सव।', sa: 'रजपर्वन् — नारीत्वोत्सवः।' } },
      { name: 'Kumar Purnima (କୁମାର ପୂର୍ଣିମା)', month: 6, description: { en: 'Festival of youth and beauty on Ashwin Purnima. Young women worship the moon and play traditional games.', hi: 'आश्विन पूर्णिमा पर यौवन और सौन्दर्य का उत्सव।', sa: 'कुमारपूर्णिमा।' } },
    ],
  },
];

// =================================================================
// Determine approximate current regional month from Sun's position
// =================================================================
function getCurrentRegionalInfo(cal: RegionalCalendar): { currentMonth: number; monthName: string } {
  const now = new Date();
  const jd = dateToJD(now.getFullYear(), now.getMonth() + 1, now.getDate(), 6);

  if (cal.type === 'solar') {
    // Solar calendars: month determined by Sun's sidereal sign
    const sunSid = toSidereal(sunLongitude(jd), jd);
    const sunSign = getRashiNumber(sunSid);
    // Tamil: Mesha(1)=Chithirai(0), Rishabha(2)=Vaikasi(1), etc.
    // Bengali: similar offset (starts with Boishakh = Mesha)
    if (cal.id === 'tamil') {
      const monthIdx = sunSign - 1; // 0-indexed
      return { currentMonth: monthIdx, monthName: cal.months[monthIdx].name };
    }
    if (cal.id === 'bengali') {
      const monthIdx = sunSign - 1;
      return { currentMonth: monthIdx, monthName: cal.months[monthIdx].name };
    }
  }

  // Lunisolar calendars: approximate from lunar month
  // The lunar month is roughly determined by the Moon's longitude relative to the Sun
  const tithi = calculateTithi(jd);
  const moonSid = toSidereal(moonLongitude(jd), jd);
  const moonSign = getRashiNumber(moonSid);

  // Chaitra starts when Full Moon is in/near Chitra nakshatra (Virgo/Libra area)
  // Approximate: lunar month ≈ Moon sign at Purnima ≈ month index
  // Simpler: Sun sign roughly determines the lunar month name
  const sunSid = toSidereal(sunLongitude(jd), jd);
  const sunSign = getRashiNumber(sunSid);

  if (cal.id === 'gujarati') {
    // Gujarati year starts at Kartik, offset from standard
    // Standard Chaitra=1 → Gujarati index: Kartik=0 means Chaitra=6
    const stdMonth = sunSign; // 1=Mesha≈Chaitra, 2=Vrishabha≈Vaishakha...
    const gujIdx = (stdMonth + 5) % 12; // Kartik is ~7 months before Chaitra cycle start
    return { currentMonth: gujIdx, monthName: cal.months[gujIdx].name };
  }

  // Telugu/Kannada: Chaitra(0) ≈ Mesha(1)
  const monthIdx = sunSign - 1;
  return { currentMonth: Math.max(0, Math.min(11, monthIdx)), monthName: cal.months[Math.max(0, Math.min(11, monthIdx))].name };
}

// =================================================================
// Page Component
// =================================================================
export default function RegionalCalendarsPage() {
  const locale = useLocale() as Locale;
  const isDevanagari = locale !== 'en';
  const headingFont = isDevanagari ? { fontFamily: 'var(--font-devanagari-heading)' } : { fontFamily: 'var(--font-heading)' };

  const calendarsWithCurrent = useMemo(() => {
    return REGIONAL_CALENDARS.map(cal => ({
      ...cal,
      current: getCurrentRegionalInfo(cal),
    }));
  }, []);

  const typeColors = {
    solar: { border: 'border-amber-500/30', bg: 'bg-amber-500/5', badge: 'bg-amber-500/20 text-amber-300' },
    lunisolar: { border: 'border-indigo-500/30', bg: 'bg-indigo-500/5', badge: 'bg-indigo-500/20 text-indigo-300' },
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
        <h1 className="text-5xl sm:text-6xl font-bold mb-4" style={headingFont}>
          <span className="text-gold-gradient">
            {locale === 'en' || String(locale) === 'ta' ? 'Regional Calendars' : locale === 'hi' ? 'क्षेत्रीय पंचांग' : 'प्रादेशिकपञ्चाङ्गानि'}
          </span>
        </h1>
        <p className="text-text-secondary text-lg max-w-3xl mx-auto">
          {locale === 'en'
            ? 'India\'s diverse calendar traditions — Tamil, Telugu, Kannada, Bengali, and Gujarati — each with unique month names, new year dates, and regional festivals'
            : 'भारत की विविध पंचांग परम्पराएँ — तमिल, तेलुगु, कन्नड़, बंगाली और गुजराती — प्रत्येक की अपनी मास नाम, नववर्ष तिथि और क्षेत्रीय उत्सव'}
        </p>
      </motion.div>

      {/* Legend */}
      <div className="flex justify-center gap-6 mb-10">
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-amber-500/60" />
          <span className="text-text-secondary text-sm">{locale === 'en' || String(locale) === 'ta' ? 'Solar Calendar' : 'सौर पंचांग'}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-indigo-500/60" />
          <span className="text-text-secondary text-sm">{locale === 'en' || String(locale) === 'ta' ? 'Lunisolar Calendar' : 'चान्द्र-सौर पंचांग'}</span>
        </div>
      </div>

      {/* Calendar Cards */}
      <div className="space-y-10">
        {calendarsWithCurrent.map((cal, i) => {
          const colors = typeColors[cal.type];
          return (
            <motion.div
              key={cal.id}
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className={`bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-2xl overflow-hidden border-2 ${colors.border}`}
            >
              {/* Header */}
              <div className={`p-6 sm:p-8 ${colors.bg}`}>
                <div className="flex items-start justify-between flex-wrap gap-4">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <h2 className="text-gold-light text-2xl sm:text-3xl font-bold" style={headingFont}>
                        {cal.name[locale]}
                      </h2>
                      <span className={`px-3 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider ${colors.badge}`}>
                        {cal.type}
                      </span>
                    </div>
                    <div className="text-text-secondary/75 text-lg font-mono">{cal.script}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-gold-dark text-xs uppercase tracking-wider mb-1">
                      {locale === 'en' || String(locale) === 'ta' ? 'Current Month' : 'वर्तमान मास'}
                    </div>
                    <div className="text-gold-light text-lg font-bold">{cal.current.monthName}</div>
                  </div>
                </div>
                <p className="text-text-secondary text-sm mt-4 leading-relaxed" style={isDevanagari ? { fontFamily: 'var(--font-devanagari-body)' } : undefined}>
                  {cal.description[locale]}
                </p>
              </div>

              {/* New Year */}
              <div className="px-6 sm:px-8 py-4 border-t border-b border-gold-primary/10 bg-gold-primary/5">
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-gold-primary font-bold">{locale === 'en' || String(locale) === 'ta' ? 'New Year:' : 'नववर्ष:'}</span>
                  <span className="text-gold-light font-bold">{cal.newYear.name}</span>
                  <span className="text-text-secondary/70">—</span>
                  <span className="text-text-secondary text-xs">{cal.newYear.approxDate}</span>
                </div>
              </div>

              {/* Month Grid */}
              <div className="p-6 sm:p-8">
                <h3 className="text-gold-dark text-xs uppercase tracking-[0.2em] font-bold mb-4">
                  {locale === 'en' || String(locale) === 'ta' ? 'Months' : 'मास'}
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
                  {cal.months.map((month, j) => {
                    const isCurrent = j === cal.current.currentMonth;
                    return (
                      <div
                        key={j}
                        className={`rounded-lg p-3 text-center transition-all ${
                          isCurrent
                            ? 'bg-gold-primary/15 border border-gold-primary/40 ring-1 ring-gold-primary/20'
                            : 'bg-bg-tertiary/20 border border-gold-primary/5'
                        }`}
                      >
                        <div className={`text-sm font-bold ${isCurrent ? 'text-gold-light' : 'text-text-secondary'}`}>
                          {month.name}
                        </div>
                        <div className="text-text-secondary/65 text-xs mt-0.5">{month.approxGregorian}</div>
                        {isCurrent && (
                          <div className="text-gold-primary text-xs font-bold mt-1 animate-pulse">
                            {locale === 'en' || String(locale) === 'ta' ? 'NOW' : 'अभी'}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Festivals */}
              <div className="px-6 sm:px-8 pb-6 sm:pb-8">
                <GoldDivider />
                <h3 className="text-gold-dark text-xs uppercase tracking-[0.2em] font-bold mb-4 mt-4">
                  {locale === 'en' || String(locale) === 'ta' ? 'Key Festivals' : 'प्रमुख उत्सव'}
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {cal.festivals.map((fest, k) => (
                    <div key={k} className="rounded-lg p-4 bg-bg-primary/40 border border-gold-primary/10">
                      <div className="text-gold-light text-sm font-bold mb-1">{fest.name}</div>
                      <p className="text-text-secondary/70 text-xs leading-relaxed" style={isDevanagari ? { fontFamily: 'var(--font-devanagari-body)' } : undefined}>
                        {fest.description[locale]}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Comparison Table */}
      <div className="mt-12">
        <h2 className="text-gold-gradient text-2xl font-bold text-center mb-6" style={headingFont}>
          {locale === 'en' || String(locale) === 'ta' ? 'Calendar Comparison' : 'पंचांग तुलना'}
        </h2>
        <div className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gold-primary/20">
                <th className="text-left px-4 py-3 text-gold-dark text-xs uppercase tracking-wider">{locale === 'en' || String(locale) === 'ta' ? 'Tradition' : 'परम्परा'}</th>
                <th className="text-left px-4 py-3 text-gold-dark text-xs uppercase tracking-wider">{locale === 'en' || String(locale) === 'ta' ? 'Type' : 'प्रकार'}</th>
                <th className="text-left px-4 py-3 text-gold-dark text-xs uppercase tracking-wider">{locale === 'en' || String(locale) === 'ta' ? 'Era' : 'युग'}</th>
                <th className="text-left px-4 py-3 text-gold-dark text-xs uppercase tracking-wider">{locale === 'en' || String(locale) === 'ta' ? 'Year Starts' : 'वर्षारम्भ'}</th>
                <th className="text-left px-4 py-3 text-gold-dark text-xs uppercase tracking-wider">{locale === 'en' || String(locale) === 'ta' ? 'First Month' : 'प्रथम मास'}</th>
              </tr>
            </thead>
            <tbody>
              {[
                { name: 'Tamil', type: 'Solar', era: 'Thiruvalluvar', start: 'Chithirai (Apr 14)', first: 'Chithirai' },
                { name: 'Telugu', type: 'Lunisolar', era: 'Shalivahana Shaka', start: 'Chaitra Sh. Pratipada', first: 'Chaitra' },
                { name: 'Kannada', type: 'Lunisolar', era: 'Shalivahana Shaka', start: 'Chaitra Sh. Pratipada', first: 'Chaitra' },
                { name: 'Bengali', type: 'Solar', era: 'Bangabda', start: 'Boishakh (Apr 14)', first: 'Boishakh' },
                { name: 'Gujarati', type: 'Lunisolar', era: 'Vikram Samvat', start: 'Day after Diwali', first: 'Kartik' },
              ].map((row, i) => (
                <tr key={i} className="border-b border-gold-primary/5 hover:bg-gold-primary/5 transition-colors">
                  <td className="px-4 py-3 text-gold-light font-bold">{row.name}</td>
                  <td className="px-4 py-3 text-text-secondary">{row.type}</td>
                  <td className="px-4 py-3 text-text-secondary">{row.era}</td>
                  <td className="px-4 py-3 text-text-secondary">{row.start}</td>
                  <td className="px-4 py-3 text-text-secondary">{row.first}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
