/**
 * /[locale]/regional — server component.
 *
 * Heavy lifting (computeRegionalMonthBoundaries × 9 calendars, each
 * calling buildYearlyTithiTable that runs thousands of binary searches
 * on Sun/Moon elongations) happens HERE, on the server, where
 * loadPrecomputedTable can read tithi-tables/<year>/<city>.json from
 * the filesystem in near-zero CPU.
 *
 * The previous all-client implementation froze the browser main thread
 * for several seconds on first render and on every year change (Gemini
 * PR #355 round-1 HIGH). This split moves the compute server-side and
 * only ships rendered card data to the browser. Year changes navigate
 * via router.push('?year=N') in the client wrapper, which triggers a
 * fresh server render with the new year — no client-side engine work
 * at any point.
 *
 * `RegionalCalendarsClient` (the wrapper below) owns: year-picker
 * buttons (navigate via router.push), chip-picker scroll-spy (needs
 * IntersectionObserver), and framer-motion animations (needs client).
 */

import { setRequestLocale } from 'next-intl/server';
import type { LocaleText, Locale } from '@/types/panchang';
import {
  computeRegionalMonthBoundaries,
  getRegionalNewYearDate,
  getCurrentMonthIndex,
  type RegionalCalendarId,
} from '@/lib/calendar/regional-calendar-boundaries';
import RegionalCalendarsClient, { YEAR_RANGE, type CalendarCard } from './Client';

interface RegionalCalendar {
  id: RegionalCalendarId;
  name: LocaleText;
  type: 'solar' | 'lunisolar';
  script: string;
  description: LocaleText;
  festivals: { name: string; month: number; description: LocaleText }[];
}

// ── Static calendar metadata (engine-independent narrative content) ──
// `months` and `newYear` fields are NO LONGER stored here. Real per-year
// boundaries come from the engine below.
//
// Bengali first (47% of /regional evergreen traffic, audit 2026-06-01).
// Mithila added 2026-06-02 — the 9th calendar, completes the set
// already implied by the comparison table at the bottom of Client.tsx.
const REGIONAL_CALENDARS: RegionalCalendar[] = [
  {
    id: 'bengali',
    name: { en: 'Bengali (Bangla)', hi: 'बंगाली (बांग्ला)', sa: 'बङ्गीयपञ्चाङ्गम्' },
    type: 'solar',
    script: 'বাংলা',
    description: {
      en: 'The Bengali calendar (Bangabda) was reformed by Mughal emperor Akbar for tax collection purposes. It\'s a solar calendar tracking the Sun\'s sidereal transit. The Bengali year starts with Boishakh.',
      hi: 'बंगाली पंचांग (बंगाब्द) मुगल सम्राट अकबर द्वारा कर संग्रह हेतु सुधारित। यह सौर पंचांग है।',
      sa: 'बङ्गीयपञ्चाङ्गं सौरपद्धत्या चलति।',
    },
    festivals: [
      { name: 'Pohela Boishakh', month: 1, description: { en: 'Bengali New Year. Mangal Shobhajatra procession, Halkhata (opening new ledgers), and cultural programs.', hi: 'बंगाली नववर्ष। मंगल शोभायात्रा, हालखाता और सांस्कृतिक कार्यक्रम।', sa: 'बङ्गीयनववर्षम्।' } },
      { name: 'Durga Puja (দুর্গা পূজা)', month: 6, description: { en: 'The grandest Bengali festival  –  five days of Durga worship from Shashthi to Dashami with elaborate pandals.', hi: 'भव्य बंगाली उत्सव  –  षष्ठी से दशमी तक पाँच दिवसीय दुर्गा पूजा।', sa: 'दुर्गापूजा  –  षष्ठ्याः दशम्यां यावत्।' } },
      { name: 'Kali Puja (কালী পূজা)', month: 7, description: { en: 'Worship of Goddess Kali on the night of Diwali. Special to Bengal.', hi: 'दीवाली की रात काली माँ की पूजा। बंगाल की विशेष परम्परा।', sa: 'कालीपूजा।' } },
      { name: 'Poush Parbon', month: 9, description: { en: 'Winter harvest festival. Pithe-puli (rice cakes) festival celebrating the harvest of new rice.', hi: 'शीतकालीन फसल उत्सव। नए चावल की फसल का उत्सव।', sa: 'पौषपर्वन्।' } },
    ],
  },
  {
    id: 'tamil',
    name: { en: 'Tamil (Thiruvalluvar)', hi: 'तमिल (तिरुवल्लुवर)', sa: 'द्रविडपञ्चाङ्गम्' },
    type: 'solar',
    script: 'தமிழ்',
    description: {
      en: 'The Tamil calendar is a sidereal solar calendar based on the Sun\'s transit through the 12 Rashi signs. Each month begins when the Sun enters a new sign. It\'s one of the oldest calendar systems in continuous use.',
      hi: 'तमिल पंचांग सूर्य के 12 राशियों में गोचर पर आधारित सायन सौर पंचांग है। प्रत्येक मास सूर्य के नई राशि में प्रवेश से आरम्भ होता है।',
      sa: 'द्रविडपञ्चाङ्गं सूर्यस्य द्वादशराशिषु गोचरे आधारितम्।',
    },
    festivals: [
      { name: 'Pongal (பொங்கல்)', month: 10, description: { en: 'Harvest festival celebrating the Sun\'s journey north (Uttarayan). Four-day celebration with Bhogi, Thai Pongal, Mattu Pongal, and Kaanum Pongal.', hi: 'सूर्य की उत्तर यात्रा (उत्तरायण) का उत्सव। चार दिवसीय उत्सव।', sa: 'उत्तरायणस्य उत्सवः।' } },
      { name: 'Chithirai Thiruvizha', month: 1, description: { en: 'Tamil New Year and Meenakshi Thirukalyanam at Madurai temple.', hi: 'तमिल नववर्ष और मदुरै मन्दिर में मीनाक्षी तिरुकल्याणम्।', sa: 'तमिलनववर्षम्।' } },
      { name: 'Aadi Perukku', month: 4, description: { en: 'Water festival celebrating the rise of river waters and agricultural fertility.', hi: 'नदी जल वृद्धि और कृषि उर्वरता का उत्सव।', sa: 'जलोत्सवः।' } },
      { name: 'Karthigai Deepam', month: 8, description: { en: 'Festival of lights at Tiruvannamalai  –  the Mahadeepam on the hill.', hi: 'तिरुवन्नामलाई में दीपोत्सव  –  पहाड़ पर महादीपम्।', sa: 'कार्तिकदीपोत्सवः।' } },
    ],
  },
  {
    id: 'telugu',
    name: { en: 'Telugu (Shalivahana Shaka)', hi: 'तेलुगु (शालिवाहन शक)', sa: 'आन्ध्रपञ्चाङ्गम्' },
    type: 'lunisolar',
    script: 'తెలుగు',
    description: {
      en: 'The Telugu calendar follows the Shalivahana Shaka era (starts 78 CE). It is lunisolar  –  months are based on the lunar cycle (Amanta system, ending on Amavasya) while years track the solar cycle.',
      hi: 'तेलुगु पंचांग शालिवाहन शक युग (78 ई.) का अनुसरण करता है। यह चान्द्र-सौर पद्धति है  –  अमान्त प्रणाली।',
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
    description: {
      en: 'The Kannada calendar also uses Shalivahana Shaka with the lunisolar Amanta system. Very similar to the Telugu system but with distinct regional festival traditions.',
      hi: 'कन्नड़ पंचांग भी शालिवाहन शक और अमान्त चान्द्र-सौर पद्धति का उपयोग करता है।',
      sa: 'कर्णाटकपञ्चाङ्गम् अपि शालिवाहनशकम् अमान्तपद्धतिं च उपयुनक्ति।',
    },
    festivals: [
      { name: 'Yugadi (ಯುಗಾದಿ)', month: 1, description: { en: 'Kannada New Year. Bevu-Bella (neem-jaggery) symbolizes life\'s bitter and sweet.', hi: 'कन्नड़ नववर्ष। बेवु-बेल्ला (नीम-गुड़) जीवन के कड़वे-मीठे का प्रतीक।', sa: 'कर्णाटकनववर्षम्।' } },
      { name: 'Varamahalakshmi', month: 5, description: { en: 'Worship of Goddess Lakshmi on the Friday before Purnima in Shravana.', hi: 'श्रावण में पूर्णिमा से पहले शुक्रवार को लक्ष्मी पूजन।', sa: 'वरमहालक्ष्मीपूजा।' } },
      { name: 'Dasara (ದಸರಾ)', month: 7, description: { en: 'Grand Mysore Dasara  –  10-day festival culminating in a majestic procession with the golden howdah.', hi: 'भव्य मैसूर दशहरा  –  स्वर्ण अम्बारी के साथ 10 दिवसीय उत्सव।', sa: 'मैसूरदशहरा।' } },
      { name: 'Makar Sankranti (ಸಂಕ್ರಾಂತಿ)', month: 10, description: { en: 'Ellu-Bella exchange (sesame-jaggery) with the greeting "Ellu Bella thindu, olle maathu aadu."', hi: 'एल्लु-बेल्ला विनिमय (तिल-गुड़)।', sa: 'मकरसंक्रान्तिः।' } },
    ],
  },
  {
    id: 'gujarati',
    name: { en: 'Gujarati (Vikram Samvat)', hi: 'गुजराती (विक्रम संवत)', sa: 'गुर्जरपञ्चाङ्गम्' },
    type: 'lunisolar',
    script: 'ગુજરાતી',
    description: {
      en: 'The Gujarati calendar uniquely starts its year after Diwali (Kartik Shukla Pratipada), unlike most Indian calendars starting in Chaitra. It follows Vikram Samvat with the Amanta lunar system.',
      hi: 'गुजराती पंचांग अनूठे रूप से दीवाली के बाद (कार्तिक शुक्ल प्रतिपदा) नववर्ष मनाता है। विक्रम संवत अमान्त पद्धति।',
      sa: 'गुर्जरपञ्चाङ्गं दीपावल्यनन्तरं नववर्षम् आरभते। विक्रमसंवत् अमान्तपद्धतिः।',
    },
    festivals: [
      { name: 'Navratri (નવરાત્રી)', month: 12, description: { en: 'Gujarat\'s iconic nine-night Garba and Dandiya Raas celebration  –  the world\'s longest dance festival.', hi: 'गुजरात का प्रतिष्ठित नौ रात्रि गरबा और डांडिया रास उत्सव।', sa: 'नवरात्रोत्सवः  –  गरबा-दण्डियारासोत्सवः।' } },
      { name: 'Uttarayan (ઉત્તરાયણ)', month: 4, description: { en: 'International Kite Festival on Makar Sankranti. Skies filled with colorful kites across Gujarat.', hi: 'मकर संक्रान्ति पर अन्तर्राष्ट्रीय पतंग उत्सव।', sa: 'उत्तरायणपतङ्गोत्सवः।' } },
      { name: 'Janmashtami (જન્માષ્ટમી)', month: 11, description: { en: 'Krishna Janmashtami with Dahi Handi and temple celebrations across Gujarat.', hi: 'दही हांडी और मन्दिर उत्सव के साथ कृष्ण जन्माष्टमी।', sa: 'कृष्णजन्माष्टमी।' } },
      { name: 'Bestu Varas', month: 1, description: { en: 'Gujarati New Year  –  day after Diwali. Account books opened, temples decorated.', hi: 'गुजराती नववर्ष  –  दीवाली के अगले दिन।', sa: 'गुर्जरनववर्षम्।' } },
    ],
  },
  {
    id: 'marathi',
    name: { en: 'Marathi (Shalivahana Shaka)', hi: 'मराठी (शालिवाहन शक)', sa: 'महाराष्ट्रपञ्चाङ्गम्' },
    type: 'lunisolar',
    script: 'मराठी',
    description: {
      en: 'The Marathi calendar follows the Shalivahana Shaka era and the Amanta (Amant) system where the month ends with Amavasya (new moon). Gudi Padwa marks the new year  –  a decorated gudi (flag) is hoisted to celebrate.',
      hi: 'मराठी पंचांग शालिवाहन शक और अमान्त प्रणाली (मास अमावस्या पर समाप्त) का अनुसरण करता है। गुढी पाडवा नववर्ष है।',
      sa: 'महाराष्ट्रपञ्चाङ्गं शालिवाहनशकेन अमान्तपद्धत्या च चलति।',
    },
    festivals: [
      { name: 'Gudi Padwa (गुढी पाडवा)', month: 1, description: { en: 'Marathi New Year. A gudi (decorated pole with silk cloth, neem, mango, and garland topped with an inverted kalash) is hoisted outside homes.', hi: 'मराठी नववर्ष। घर के बाहर गुढी (सजा हुआ ध्वज) फहराया जाता है।', sa: 'महाराष्ट्रनववर्षम्।' } },
      { name: 'Ganesh Chaturthi (गणेश चतुर्थी)', month: 6, description: { en: 'Maharashtra\'s grandest festival  –  10-day celebration of Lord Ganesha with elaborate pandals, immersion processions, and community worship.', hi: 'महाराष्ट्र का सबसे भव्य उत्सव  –  10 दिवसीय गणेश पूजा, विसर्जन शोभायात्रा।', sa: 'गणेशचतुर्थी  –  दशदिनोत्सवः।' } },
      { name: 'Makar Sankranti (मकर संक्रान्ति)', month: 10, description: { en: 'Kite flying and til-gul distribution with the greeting "Tilgul ghya god god bola" (eat sesame-jaggery and speak sweetly).', hi: 'पतंगबाजी और तिल-गुड़ वितरण।', sa: 'मकरसंक्रान्तिः  –  तिलगुडवितरणम्।' } },
      { name: 'Ashadhi Ekadashi', month: 4, description: { en: 'Massive Wari pilgrimage to Pandharpur. Lakhs of Warkaris walk carrying palkhis of Sant Dnyaneshwar and Sant Tukaram.', hi: 'पंढरपुर वारी  –  लाखों वारकरी संत ज्ञानेश्वर और तुकाराम की पालखी लेकर चलते हैं।', sa: 'आषाढ्येकादशी  –  पण्ढरपुरतीर्थयात्रा।' } },
    ],
  },
  {
    id: 'malayalam',
    name: { en: 'Malayalam (Kollam Era)', hi: 'मलयालम (कोल्लम संवत)', sa: 'केरलपञ्चाङ्गम्' },
    type: 'solar',
    script: 'മലയാളം',
    description: {
      en: 'The Malayalam calendar (Kolla Varsham) is a solar calendar starting from Chingam (Leo). It begins from 825 CE (Kollam Era). The year starts with the Chingam month but Vishu (Medam 1) is celebrated as the astronomical new year.',
      hi: 'मलयालम पंचांग (कोल्ल वर्षम्) चिंगम (सिंह) से शुरू होने वाला सौर पंचांग है। 825 ई. (कोल्लम संवत) से आरम्भ।',
      sa: 'केरलपञ्चाङ्गं चिङ्गमतः आरम्भमाणं सौरपञ्चाङ्गम्।',
    },
    festivals: [
      { name: 'Vishu (വിഷു)', month: 9, description: { en: 'Malayalam astronomical new year. Vishukkani (auspicious arrangement of fruits, gold, and rice) is viewed first thing in the morning.', hi: 'मलयालम खगोलीय नववर्ष। विषुक्कणि  –  फल, सोना और चावल की शुभ व्यवस्था प्रातः देखी जाती है।', sa: 'विषुपर्वन्  –  मलयालनववर्षम्।' } },
      { name: 'Onam (ഓണം)', month: 1, description: { en: 'Kerala\'s grandest festival  –  10-day celebration honoring King Mahabali. Pookalam (flower carpets), Onasadya (feast with 26+ dishes), Vallam Kali (boat races).', hi: 'केरल का सबसे भव्य उत्सव  –  राजा महाबली की स्मृति में 10 दिन। पूक्कलम्, ओणसद्या, वल्लम् काली।', sa: 'ओणोत्सवः  –  महाबलिसम्माननम्।' } },
      { name: 'Thiruvathira (തിരുവാതിര)', month: 5, description: { en: 'Festival of Lord Shiva. Women perform the Thiruvathira Kali dance and fast for marital bliss.', hi: 'शिव पर्व। महिलाएँ तिरुवातिरा काली नृत्य करती हैं।', sa: 'तिरुवातिरापर्वन्।' } },
      { name: 'Thrissur Pooram', month: 9, description: { en: 'Greatest temple festival of Kerala at Vadakkunnathan Temple. Spectacular elephant processions, Kudamattam (umbrella ceremony), and fireworks.', hi: 'केरल का सबसे बड़ा मन्दिर उत्सव। भव्य हाथी शोभायात्रा, कुडमट्टम् और आतिशबाजी।', sa: 'त्रिशूरपूरम्  –  केरलस्य महोत्सवः।' } },
    ],
  },
  {
    id: 'odia',
    name: { en: 'Odia (Odia Era)', hi: 'ओड़िया (ओड़िया संवत)', sa: 'उत्कलपञ्चाङ्गम्' },
    type: 'solar',
    script: 'ଓଡ଼ିଆ',
    description: {
      en: 'The Odia calendar starts with Baisakha (Mesha Sankranti). It\'s primarily solar but with lunisolar elements for festivals. Closely linked with the Jagannath Temple tradition at Puri.',
      hi: 'ओड़िया पंचांग बैशाख (मेष संक्रान्ति) से आरम्भ होता है। जगन्नाथ मन्दिर पुरी की परम्परा से जुड़ा है।',
      sa: 'उत्कलपञ्चाङ्गं बैशाखात् आरभ्यते। जगन्नाथमन्दिरपरम्परया सम्बद्धम्।',
    },
    festivals: [
      { name: 'Rath Yatra (ରଥ ଯାତ୍ରା)', month: 3, description: { en: 'The world-famous chariot festival of Lord Jagannath at Puri. Three massive chariots carry Jagannath, Balabhadra, and Subhadra through the streets.', hi: 'पुरी में जगन्नाथ की विश्व प्रसिद्ध रथ यात्रा।', sa: 'रथयात्रा  –  जगन्नाथपुर्याम्।' } },
      { name: 'Raja Parba (ରଜ ପର୍ବ)', month: 3, description: { en: 'Unique three-day festival celebrating femininity and the Earth\'s menstruation cycle. Women swing on ropes and rest from fieldwork.', hi: 'नारीत्व और पृथ्वी की उर्वरता का तीन दिवसीय उत्सव।', sa: 'रजपर्वन्  –  नारीत्वोत्सवः।' } },
      { name: 'Kumar Purnima (କୁମାର ପୂର୍ଣିମା)', month: 6, description: { en: 'Festival of youth and beauty on Ashwin Purnima. Young women worship the moon and play traditional games.', hi: 'आश्विन पूर्णिमा पर यौवन और सौन्दर्य का उत्सव।', sa: 'कुमारपूर्णिमा।' } },
    ],
  },
  {
    id: 'mithila',
    name: { en: 'Mithila (Maithili Panchang)', hi: 'मिथिला (मैथिली पञ्जिका)', sa: 'मैथिलपञ्चाङ्गम्' },
    type: 'lunisolar',
    script: 'मैथिली',
    description: {
      en: 'The Maithili calendar follows the Vikram Samvat era and the Purnimanta lunisolar system (months end on Purnima / Full Moon). Centred on the Mithila region — Darbhanga, Madhubani, Janakpur. Major festivals are tied to the agricultural cycle of north Bihar and the Terai.',
      hi: 'मैथिली पंचांग विक्रम संवत और पूर्णिमान्त चान्द्र-सौर पद्धति का अनुसरण करता है (मास पूर्णिमा पर समाप्त)। मिथिला क्षेत्र  –  दरभंगा, मधुबनी, जनकपुर पर केन्द्रित।',
      sa: 'मैथिलपञ्चाङ्गं विक्रमसंवत् पौर्णमान्तपद्धतिं च अनुसरति। मिथिलाक्षेत्रे प्रचलितम्।',
    },
    festivals: [
      { name: 'Chhath Puja (छठ पूजा)', month: 7, description: { en: 'Four-day sun-worship festival in Kartik. Devotees stand in rivers offering arghya to Surya at sunrise and sunset. The most important festival of Mithila + greater Bihar.', hi: 'कार्तिक मास में चार दिवसीय सूर्य उपासना। श्रद्धालु नदी में खड़े होकर सूर्योदय और सूर्यास्त पर अर्घ्य देते हैं। मिथिला और बिहार का सर्वाधिक महत्वपूर्ण पर्व।', sa: 'कार्तिकमासे चतुर्दिनात्मकं सूर्योपासनापर्व।' } },
      { name: 'Sama Chakeva (सामा चकेवा)', month: 7, description: { en: 'Sister-brother festival celebrated in Kartik. Sisters fashion clay birds (sama and chakeva) and pray for their brothers\' long life.', hi: 'कार्तिक मास में मनाया जाने वाला भाई-बहन का पर्व। बहनें मिट्टी के पक्षी (सामा और चकेवा) बनाकर भाइयों की दीर्घायु की कामना करती हैं।', sa: 'भगिनीभ्रातृसम्बन्धपर्व।' } },
      { name: 'Vivaha Panchami (विवाह पञ्चमी)', month: 8, description: { en: 'Margashirsha Shukla Panchami marks the wedding day of Sita and Rama in Janakpur, Mithila. Re-enactments and yatras draw lakhs of devotees.', hi: 'मार्गशीर्ष शुक्ल पञ्चमी  –  जनकपुर मिथिला में सीता-राम के विवाह का दिन। पुनरभिनय और यात्राएँ लाखों श्रद्धालुओं को आकर्षित करती हैं।', sa: 'सीतारामविवाहोत्सवः  –  जनकपुर्याम्।' } },
      { name: 'Jur Sital (जुड़ शीतल)', month: 2, description: { en: 'Maithili cultural new year on Vaishakh 2 (the day after Mesha Sankranti). Elders sprinkle cool water on younger members\' heads as blessing.', hi: 'वैशाख 2 (मेष संक्रान्ति के अगले दिन)  –  मैथिली सांस्कृतिक नववर्ष। वरिष्ठ लोग छोटों के सिर पर शीतल जल छिड़कते हैं आशीर्वाद रूप में।', sa: 'मैथिलनववर्षम्  –  वैशाखद्वितीयायाम्।' } },
    ],
  },
];

/**
 * "Today" in Asia/Kolkata time. All 9 regional calendars are culturally
 * anchored to India; computing `today` in IST keeps the current-month
 * highlight consistent for users in diaspora time zones (US/UK/etc.).
 * Gemini PR #355 round-1 MEDIUM.
 */
function todayIST(): string {
  const n = new Date();
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: 'Asia/Kolkata',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(n);
  const y = parts.find(p => p.type === 'year')?.value ?? '';
  const m = parts.find(p => p.type === 'month')?.value ?? '';
  const d = parts.find(p => p.type === 'day')?.value ?? '';
  return `${y}-${m}-${d}`;
}

function todayISTYear(): number {
  const iso = todayIST();
  return parseInt(iso.substring(0, 4), 10);
}

export default async function RegionalCalendarsPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ year?: string }>;
}) {
  const { locale } = await params;
  const sp = await searchParams;
  setRequestLocale(locale);

  // Year: from ?year=N (clamped to range) or current IST year.
  const urlYear = parseInt(sp.year ?? '', 10);
  const year = Number.isFinite(urlYear) && urlYear >= YEAR_RANGE.min && urlYear <= YEAR_RANGE.max
    ? urlYear
    : todayISTYear();

  // Pre-compute all 9 cards' boundaries + new-year info + current
  // month index SERVER-SIDE. The engine has filesystem access here,
  // so loadPrecomputedTable returns precomputed tithi-tables for
  // the 5 lunisolar calendars from public/data/tithi-tables/.
  const today = todayIST();
  const cards: CalendarCard[] = REGIONAL_CALENDARS.map((cal) => {
    const boundaries = computeRegionalMonthBoundaries(cal.id, year);
    const newYearInfo = getRegionalNewYearDate(cal.id, year);
    const currentIdx = getCurrentMonthIndex(boundaries, today);
    return { ...cal, boundaries, newYearInfo, currentIdx };
  });

  return <RegionalCalendarsClient cards={cards} year={year} locale={locale as Locale} />;
}
