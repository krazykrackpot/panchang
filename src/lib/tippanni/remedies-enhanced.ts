/**
 * Enhanced Remedies System
 * Based on BPHS Ch.83-84, Uttara Kalamrita Ch.5
 *
 * Full gemstone data, beej mantras (Devanagari), Vedic mantras,
 * charity details, fasting, colors, and directions for all 9 planets.
 */

import type { Locale } from '@/types/panchang';
import type { PlanetPosition, ShadBala } from '@/types/kundali';
import type { Tri } from './utils';
import { triLocale } from './utils';
import type { RemedySection, RemedyItem } from '@/lib/kundali/tippanni-types';
import { GRAHAS } from '@/lib/constants/grahas';
import type { LifeStage } from '@/lib/kundali/life-stage';

export interface PlanetRemedyFull {
  gemstone: {
    name: Tri;
    alternates: Tri[];
    metal: Tri;
    finger: Tri;
    weight: string;
  };
  beejMantra: Tri;
  vedicMantra: Tri;
  count: number;
  charity: {
    items: Tri;
    day: Tri;
    deity: Tri;
  };
  fasting: Tri;
  color: Tri;
  direction: Tri;
}

export const PLANET_REMEDIES_FULL: Record<number, PlanetRemedyFull> = {
  // SUN (0)
  0: {
    gemstone: {
      name: { en: 'Ruby (Manikya)', hi: 'माणिक्य (रूबी)', sa: 'माणिक्यम्' },
      alternates: [{ en: 'Red Garnet', hi: 'लाल गार्नेट', sa: 'रक्तगार्नेटम्' }, { en: 'Red Spinel', hi: 'लाल स्पिनेल', sa: 'रक्तस्पिनेलम्' }],
      metal: { en: 'Gold', hi: 'सोना', sa: 'सुवर्णम्' },
      finger: { en: 'Ring finger', hi: 'अनामिका', sa: 'अनामिका' },
      weight: '3-5 carats',
    },
    beejMantra: { en: 'Om Hraam Hreem Hraum Sah Suryaya Namah', hi: 'ॐ ह्रां ह्रीं ह्रौं सः सूर्याय नमः', sa: 'ॐ ह्रां ह्रीं ह्रौं सः सूर्याय नमः' },
    vedicMantra: { en: 'Om Aakrishnen Rajasaa Vartamaano Niveshayann Amritam Martyam Cha', hi: 'ॐ आकृष्णेन रजसा वर्तमानो निवेशयन्नमृतं मर्त्यं च', sa: 'ॐ आकृष्णेन रजसा वर्तमानो निवेशयन्नमृतं मर्त्यं च' },
    count: 7000,
    charity: {
      items: { en: 'Wheat, jaggery, copper, red cloth', hi: 'गेहूँ, गुड़, ताँबा, लाल वस्त्र', sa: 'गोधूमः गुडः ताम्रं रक्तवस्त्रं च' },
      day: { en: 'Sunday', hi: 'रविवार', sa: 'रविवासरः' },
      deity: { en: 'Lord Surya / Shiva', hi: 'भगवान सूर्य / शिव', sa: 'सूर्यदेवः / शिवः' },
    },
    fasting: { en: 'Sundays — eat once before sunset', hi: 'रविवार — सूर्यास्त से पहले एक बार भोजन', sa: 'रविवासरे — सूर्यास्तात् पूर्वम् एकवारं भोजनम्' },
    color: { en: 'Red, Copper, Orange', hi: 'लाल, ताम्र, नारंगी', sa: 'रक्तः ताम्रः नारङ्गश्च' },
    direction: { en: 'East', hi: 'पूर्व', sa: 'पूर्वा' },
  },
  // MOON (1)
  1: {
    gemstone: {
      name: { en: 'Pearl (Moti)', hi: 'मोती', sa: 'मुक्ता' },
      alternates: [{ en: 'Moonstone', hi: 'चन्द्रकान्त मणि', sa: 'चन्द्रकान्तमणिः' }],
      metal: { en: 'Silver', hi: 'चाँदी', sa: 'रजतम्' },
      finger: { en: 'Little finger', hi: 'कनिष्ठिका', sa: 'कनिष्ठिका' },
      weight: '4-6 carats',
    },
    beejMantra: { en: 'Om Shraam Shreem Shraum Sah Chandraya Namah', hi: 'ॐ श्रां श्रीं श्रौं सः चन्द्राय नमः', sa: 'ॐ श्रां श्रीं श्रौं सः चन्द्राय नमः' },
    vedicMantra: { en: 'Om Imam Devaa Asapatnam Suvadhwam Mahate Kshtraaya Mahate Jyaishthhyaaya', hi: 'ॐ इमं देवा असपत्नं सुवध्वं महते क्षत्राय महते ज्यैष्ठ्याय', sa: 'ॐ इमं देवा असपत्नं सुवध्वं महते क्षत्राय महते ज्यैष्ठ्याय' },
    count: 11000,
    charity: {
      items: { en: 'Rice, white cloth, silver, milk', hi: 'चावल, सफेद वस्त्र, चाँदी, दूध', sa: 'तण्डुलः श्वेतवस्त्रं रजतं दुग्धं च' },
      day: { en: 'Monday', hi: 'सोमवार', sa: 'सोमवासरः' },
      deity: { en: 'Lord Shiva / Parvati', hi: 'भगवान शिव / पार्वती', sa: 'शिवः / पार्वती' },
    },
    fasting: { en: 'Mondays — eat kheer or milk-based food', hi: 'सोमवार — खीर या दूध-आधारित भोजन', sa: 'सोमवासरे — पायसं दुग्धाधारितं भोजनं वा' },
    color: { en: 'White, Silver, Cream', hi: 'सफेद, रजत, क्रीम', sa: 'श्वेतः रजतः क्रीमवर्णश्च' },
    direction: { en: 'Northwest', hi: 'वायव्य', sa: 'वायव्यदिशा' },
  },
  // MARS (2)
  2: {
    gemstone: {
      name: { en: 'Red Coral (Moonga)', hi: 'मूँगा (लाल प्रवाल)', sa: 'प्रवालम्' },
      alternates: [{ en: 'Carnelian', hi: 'कार्नेलियन', sa: 'कार्नेलियनम्' }],
      metal: { en: 'Gold or Copper', hi: 'सोना या ताँबा', sa: 'सुवर्णं ताम्रं वा' },
      finger: { en: 'Ring finger', hi: 'अनामिका', sa: 'अनामिका' },
      weight: '5-7 carats',
    },
    beejMantra: { en: 'Om Kraam Kreem Kraum Sah Bhaumaya Namah', hi: 'ॐ क्रां क्रीं क्रौं सः भौमाय नमः', sa: 'ॐ क्रां क्रीं क्रौं सः भौमाय नमः' },
    vedicMantra: { en: 'Om Agnir Murdhaa Divah Kakut Patih Prithivyaa Ayam', hi: 'ॐ अग्निर्मूर्धा दिवः ककुत्पतिः पृथिव्या अयम्', sa: 'ॐ अग्निर्मूर्धा दिवः ककुत्पतिः पृथिव्या अयम्' },
    count: 10000,
    charity: {
      items: { en: 'Red lentils, jaggery, red cloth, copper vessel', hi: 'मसूर दाल, गुड़, लाल वस्त्र, ताम्र पात्र', sa: 'मसूरदालं गुडः रक्तवस्त्रं ताम्रपात्रं च' },
      day: { en: 'Tuesday', hi: 'मंगलवार', sa: 'मङ्गलवासरः' },
      deity: { en: 'Lord Hanuman / Kartikeya', hi: 'भगवान हनुमान / कार्तिकेय', sa: 'हनुमान् / कार्तिकेयः' },
    },
    fasting: { en: 'Tuesdays — eat only once, avoid salt', hi: 'मंगलवार — एक बार भोजन, नमक त्यागें', sa: 'मङ्गलवासरे — एकवारं भोजनं, लवणं त्यजेत्' },
    color: { en: 'Red, Scarlet, Coral', hi: 'लाल, लाली, प्रवाल', sa: 'रक्तः प्रवालवर्णश्च' },
    direction: { en: 'South', hi: 'दक्षिण', sa: 'दक्षिणा' },
  },
  // MERCURY (3)
  3: {
    gemstone: {
      name: { en: 'Emerald (Panna)', hi: 'पन्ना', sa: 'मरकतम्' },
      alternates: [{ en: 'Green Tourmaline', hi: 'हरा टूरमैलीन', sa: 'हरिततूर्मालिनम्' }, { en: 'Peridot', hi: 'पेरिडॉट', sa: 'पेरिडॉटम्' }],
      metal: { en: 'Gold', hi: 'सोना', sa: 'सुवर्णम्' },
      finger: { en: 'Little finger', hi: 'कनिष्ठिका', sa: 'कनिष्ठिका' },
      weight: '3-5 carats',
    },
    beejMantra: { en: 'Om Braam Breem Braum Sah Budhaya Namah', hi: 'ॐ ब्रां ब्रीं ब्रौं सः बुधाय नमः', sa: 'ॐ ब्रां ब्रीं ब्रौं सः बुधाय नमः' },
    vedicMantra: { en: 'Om Udbudhyasvaagne Prati Jaagrihi Tvam Ishtaapoorte Sam Srijethaam Ayam Cha', hi: 'ॐ उद्बुध्यस्वाग्ने प्रति जागृहि त्वम् इष्टापूर्ते सं सृजेथाम् अयं च', sa: 'ॐ उद्बुध्यस्वाग्ने प्रति जागृहि त्वम् इष्टापूर्ते सं सृजेथाम् अयं च' },
    count: 9000,
    charity: {
      items: { en: 'Green moong dal, green cloth, green vegetables', hi: 'हरी मूँग दाल, हरा वस्त्र, हरी सब्जियाँ', sa: 'हरितमुद्गदालं हरितवस्त्रं हरितशाकानि च' },
      day: { en: 'Wednesday', hi: 'बुधवार', sa: 'बुधवासरः' },
      deity: { en: 'Lord Vishnu / Saraswati', hi: 'भगवान विष्णु / सरस्वती', sa: 'विष्णुः / सरस्वती' },
    },
    fasting: { en: 'Wednesdays — eat green vegetables only', hi: 'बुधवार — केवल हरी सब्जियाँ', sa: 'बुधवासरे — केवलं हरितशाकानि' },
    color: { en: 'Green', hi: 'हरा', sa: 'हरितः' },
    direction: { en: 'North', hi: 'उत्तर', sa: 'उत्तरा' },
  },
  // JUPITER (4)
  4: {
    gemstone: {
      name: { en: 'Yellow Sapphire (Pukhraj)', hi: 'पुखराज (पीला नीलम)', sa: 'पुष्पराजम्' },
      alternates: [{ en: 'Yellow Topaz', hi: 'पीला पुखराज', sa: 'पीतपुष्परागः' }, { en: 'Citrine', hi: 'सिट्रीन', sa: 'सिट्रीनम्' }],
      metal: { en: 'Gold', hi: 'सोना', sa: 'सुवर्णम्' },
      finger: { en: 'Index finger', hi: 'तर्जनी', sa: 'तर्जनी' },
      weight: '3-5 carats',
    },
    beejMantra: { en: 'Om Graam Greem Graum Sah Gurave Namah', hi: 'ॐ ग्रां ग्रीं ग्रौं सः गुरवे नमः', sa: 'ॐ ग्रां ग्रीं ग्रौं सः गुरवे नमः' },
    vedicMantra: { en: 'Om Brihaspataye Vidmahe Divya Dehaaya Dheemahi Tanno Guruh Prachodayaat', hi: 'ॐ बृहस्पतये विद्महे दिव्यदेहाय धीमहि तन्नो गुरुः प्रचोदयात्', sa: 'ॐ बृहस्पतये विद्महे दिव्यदेहाय धीमहि तन्नो गुरुः प्रचोदयात्' },
    count: 19000,
    charity: {
      items: { en: 'Yellow cloth, turmeric, gram dal, gold, books', hi: 'पीला वस्त्र, हल्दी, चना दाल, सोना, पुस्तकें', sa: 'पीतवस्त्रं हरिद्रा चणदालं सुवर्णं पुस्तकानि च' },
      day: { en: 'Thursday', hi: 'गुरुवार', sa: 'गुरुवासरः' },
      deity: { en: 'Lord Vishnu / Brihaspati', hi: 'भगवान विष्णु / बृहस्पति', sa: 'विष्णुः / बृहस्पतिः' },
    },
    fasting: { en: 'Thursdays — eat yellow food, banana, turmeric milk', hi: 'गुरुवार — पीला भोजन, केला, हल्दी दूध', sa: 'गुरुवासरे — पीतभोजनं कदलीफलं हरिद्रादुग्धं च' },
    color: { en: 'Yellow, Gold, Saffron', hi: 'पीला, सुनहरा, केसरिया', sa: 'पीतः सुवर्णवर्णः केसरवर्णश्च' },
    direction: { en: 'Northeast', hi: 'ईशान', sa: 'ईशानदिशा' },
  },
  // VENUS (5)
  5: {
    gemstone: {
      name: { en: 'Diamond (Heera)', hi: 'हीरा', sa: 'वज्रम्' },
      alternates: [{ en: 'White Sapphire', hi: 'सफेद नीलम', sa: 'श्वेतनीलम्' }, { en: 'Zircon', hi: 'ज़िरकॉन', sa: 'जिर्कोनम्' }],
      metal: { en: 'Silver or Platinum', hi: 'चाँदी या प्लैटिनम', sa: 'रजतं प्लैटिनं वा' },
      finger: { en: 'Middle finger', hi: 'मध्यमा', sa: 'मध्यमा' },
      weight: '1-2 carats',
    },
    beejMantra: { en: 'Om Draam Dreem Draum Sah Shukraya Namah', hi: 'ॐ द्रां द्रीं द्रौं सः शुक्राय नमः', sa: 'ॐ द्रां द्रीं द्रौं सः शुक्राय नमः' },
    vedicMantra: { en: 'Om Shukraaya Vidmahe Shvetavaahanaaya Dheemahi Tanno Shukrah Prachodayaat', hi: 'ॐ शुक्राय विद्महे श्वेतवाहनाय धीमहि तन्नो शुक्रः प्रचोदयात्', sa: 'ॐ शुक्राय विद्महे श्वेतवाहनाय धीमहि तन्नो शुक्रः प्रचोदयात्' },
    count: 16000,
    charity: {
      items: { en: 'White clothes, sugar, rice, ghee, camphor', hi: 'सफेद वस्त्र, शक्कर, चावल, घी, कपूर', sa: 'श्वेतवस्त्रं शर्करा तण्डुलं घृतं कर्पूरं च' },
      day: { en: 'Friday', hi: 'शुक्रवार', sa: 'शुक्रवासरः' },
      deity: { en: 'Goddess Lakshmi / Devi', hi: 'देवी लक्ष्मी / देवी', sa: 'लक्ष्मीदेवी' },
    },
    fasting: { en: 'Fridays — eat sweet food, fruits', hi: 'शुक्रवार — मिष्ठान्न, फल', sa: 'शुक्रवासरे — मिष्टान्नं फलानि च' },
    color: { en: 'White, Pink, Pastel', hi: 'सफेद, गुलाबी, पेस्टल', sa: 'श्वेतः गुलाबी पेस्टलश्च' },
    direction: { en: 'Southeast', hi: 'आग्नेय', sa: 'आग्नेयदिशा' },
  },
  // SATURN (6)
  6: {
    gemstone: {
      name: { en: 'Blue Sapphire (Neelam)', hi: 'नीलम', sa: 'नीलमणिः' },
      alternates: [{ en: 'Amethyst', hi: 'जामुनिया', sa: 'जामुनीयम्' }, { en: 'Iolite', hi: 'आइओलाइट', sa: 'आइओलाइटम्' }],
      metal: { en: 'Iron or Steel (Panchdhatu)', hi: 'लोहा या पंचधातु', sa: 'लोहं पञ्चधातुः वा' },
      finger: { en: 'Middle finger', hi: 'मध्यमा', sa: 'मध्यमा' },
      weight: '3-5 carats',
    },
    beejMantra: { en: 'Om Praam Preem Praum Sah Shanaischaraya Namah', hi: 'ॐ प्रां प्रीं प्रौं सः शनैश्चराय नमः', sa: 'ॐ प्रां प्रीं प्रौं सः शनैश्चराय नमः' },
    vedicMantra: { en: 'Om Shanaischaraaya Vidmahe Manda Gataye Dheemahi Tanno Mandah Prachodayaat', hi: 'ॐ शनैश्चराय विद्महे मन्दगतये धीमहि तन्नो मन्दः प्रचोदयात्', sa: 'ॐ शनैश्चराय विद्महे मन्दगतये धीमहि तन्नो मन्दः प्रचोदयात्' },
    count: 23000,
    charity: {
      items: { en: 'Black sesame, mustard oil, iron, black cloth, leather shoes', hi: 'काले तिल, सरसों तेल, लोहा, काला वस्त्र, चमड़े के जूते', sa: 'कृष्णतिलाः सर्षपतैलं लोहं कृष्णवस्त्रं चर्मपादुके च' },
      day: { en: 'Saturday', hi: 'शनिवार', sa: 'शनिवासरः' },
      deity: { en: 'Lord Shani Dev / Hanuman', hi: 'भगवान शनि देव / हनुमान', sa: 'शनिदेवः / हनुमान्' },
    },
    fasting: { en: 'Saturdays — eat only once, donate oil', hi: 'शनिवार — एक बार भोजन, तेल दान', sa: 'शनिवासरे — एकवारं भोजनं, तैलदानम्' },
    color: { en: 'Black, Dark Blue, Navy', hi: 'काला, गहरा नीला', sa: 'कृष्णः गहननीलश्च' },
    direction: { en: 'West', hi: 'पश्चिम', sa: 'पश्चिमा' },
  },
  // RAHU (7)
  7: {
    gemstone: {
      name: { en: 'Hessonite Garnet (Gomed)', hi: 'गोमेद', sa: 'गोमेदम्' },
      alternates: [{ en: 'Tsavorite', hi: 'सावोराइट', sa: 'सावोराइटम्' }],
      metal: { en: 'Ashtadhatu (8 metals)', hi: 'अष्टधातु', sa: 'अष्टधातुः' },
      finger: { en: 'Middle finger', hi: 'मध्यमा', sa: 'मध्यमा' },
      weight: '4-6 carats',
    },
    beejMantra: { en: 'Om Bhraam Bhreem Bhraum Sah Rahave Namah', hi: 'ॐ भ्रां भ्रीं भ्रौं सः राहवे नमः', sa: 'ॐ भ्रां भ्रीं भ्रौं सः राहवे नमः' },
    vedicMantra: { en: 'Om Rahave Namah — Ardha Kaayam Maha Veeryam Chandraaditya Vimardanam', hi: 'ॐ राहवे नमः — अर्धकायं महावीर्यं चन्द्रादित्यविमर्दनम्', sa: 'ॐ राहवे नमः — अर्धकायं महावीर्यं चन्द्रादित्यविमर्दनम्' },
    count: 18000,
    charity: {
      items: { en: 'Blue/black cloth, lead, blanket, mustard seeds', hi: 'नीला/काला वस्त्र, सीसा, कम्बल, सरसों', sa: 'नीलकृष्णवस्त्रं सीसं कम्बलं सर्षपाश्च' },
      day: { en: 'Saturday', hi: 'शनिवार', sa: 'शनिवासरः' },
      deity: { en: 'Goddess Durga / Saraswati', hi: 'देवी दुर्गा / सरस्वती', sa: 'दुर्गादेवी / सरस्वती' },
    },
    fasting: { en: 'Saturdays — avoid meat and intoxicants', hi: 'शनिवार — माँस और नशे से बचें', sa: 'शनिवासरे — मांसं मादकद्रव्याणि च वर्जयेत्' },
    color: { en: 'Dark Blue, Smoke, Lead Grey', hi: 'गहरा नीला, धूम्र, सीसा ग्रे', sa: 'गहननीलः धूम्रः सीसावर्णश्च' },
    direction: { en: 'Southwest', hi: 'नैऋत्य', sa: 'नैऋत्यदिशा' },
  },
  // KETU (8)
  8: {
    gemstone: {
      name: { en: 'Cat\'s Eye (Lehsuniya)', hi: 'लहसुनिया (वैदूर्य)', sa: 'वैदूर्यम्' },
      alternates: [{ en: 'Tiger\'s Eye', hi: 'टाइगर आई', sa: 'व्याघ्रनेत्रम्' }],
      metal: { en: 'Panchdhatu or Silver', hi: 'पंचधातु या चाँदी', sa: 'पञ्चधातुः रजतं वा' },
      finger: { en: 'Ring finger', hi: 'अनामिका', sa: 'अनामिका' },
      weight: '3-5 carats',
    },
    beejMantra: { en: 'Om Sraam Sreem Sraum Sah Ketave Namah', hi: 'ॐ स्रां स्रीं स्रौं सः केतवे नमः', sa: 'ॐ स्रां स्रीं स्रौं सः केतवे नमः' },
    vedicMantra: { en: 'Om Ketave Namah — Palasha Pushpa Sankaasham Taarakaagraha Mastakam', hi: 'ॐ केतवे नमः — पलाशपुष्पसङ्काशं ताराकाग्रहमस्तकम्', sa: 'ॐ केतवे नमः — पलाशपुष्पसङ्काशं ताराकाग्रहमस्तकम्' },
    count: 17000,
    charity: {
      items: { en: 'Blanket, sour items, sesame, seven grains', hi: 'कम्बल, खट्टे पदार्थ, तिल, सप्तधान्य', sa: 'कम्बलं अम्लपदार्थाः तिलाः सप्तधान्यानि च' },
      day: { en: 'Tuesday or Saturday', hi: 'मंगलवार या शनिवार', sa: 'मङ्गलवासरः शनिवासरः वा' },
      deity: { en: 'Lord Ganesha / Chitragupta', hi: 'भगवान गणेश / चित्रगुप्त', sa: 'गणेशः / चित्रगुप्तः' },
    },
    fasting: { en: 'Tuesdays — feed stray dogs, donate blankets', hi: 'मंगलवार — आवारा कुत्तों को खिलाएँ, कम्बल दान', sa: 'मङ्गलवासरे — भ्रमणशुनकेभ्यः भोजनं, कम्बलदानं च' },
    color: { en: 'Grey, Smoke, Brown', hi: 'धूसर, धूम्र, भूरा', sa: 'धूसरः धूम्रः भूरश्च' },
    direction: { en: 'South', hi: 'दक्षिण', sa: 'दक्षिणा' },
  },
};

/** Get full remedy data for a planet */
export function getRemediesForPlanet(planetId: number, locale: Locale): PlanetRemedyFull | null {
  return PLANET_REMEDIES_FULL[planetId] || null;
}

/** Generate enhanced remedy section for weak planets */
export function getRemediesForWeakPlanets(
  planets: PlanetPosition[],
  shadbala: ShadBala[],
  ascSign: number,
  locale: Locale,
  stage?: LifeStage,
): RemedySection {
  const gemstones: RemedyItem[] = [];
  const mantras: RemedyItem[] = [];
  const practices: RemedyItem[] = [];

  // Find weak/afflicted planets
  const weakPlanets = planets.filter(p =>
    p.isDebilitated || (p.planet.id <= 6 && (shadbala.find(s => s.planet === p.planet.name.en)?.totalStrength ?? 50) < 40)
  );

  // Also consider lagna lord — but only if it is actually weak
  const signLords: Record<number, number> = { 1: 2, 2: 5, 3: 3, 4: 1, 5: 0, 6: 3, 7: 5, 8: 2, 9: 4, 10: 6, 11: 6, 12: 4 };
  const lagnaLordId = signLords[ascSign];

  const targetIds = new Set<number>();
  for (const p of weakPlanets) targetIds.add(p.planet.id);
  // Only add lagna lord if it's weak too (totalStrength < 40)
  if (lagnaLordId !== undefined) {
    const lagnaLordStrength = shadbala.find(s => s.planet === planets.find(p => p.planet.id === lagnaLordId)?.planet.name.en)?.totalStrength ?? 50;
    if (lagnaLordStrength < 40) targetIds.add(lagnaLordId);
  }

  for (const id of targetIds) {
    if (id > 8) continue;
    const remedy = PLANET_REMEDIES_FULL[id];
    if (!remedy) continue;
    const graha = GRAHAS[id];
    const planetName = graha.name[locale];

    // Gemstone
    gemstones.push({
      name: triLocale(remedy.gemstone.name, locale),
      planet: planetName || '',
      description: locale === 'hi'
        ? `${graha.name.hi} को मजबूत करने के लिए ${triLocale(remedy.gemstone.name, 'hi')} ${triLocale(remedy.gemstone.metal, 'hi')} में ${triLocale(remedy.gemstone.finger, 'hi')} में ${remedy.gemstone.weight} धारण करें। ${triLocale(remedy.charity.day, 'hi')} को धारण करें।`
        : `Wear ${triLocale(remedy.gemstone.name, 'en')} (${remedy.gemstone.weight}) in ${triLocale(remedy.gemstone.metal, 'en')} on ${triLocale(remedy.gemstone.finger, 'en')} on a ${triLocale(remedy.charity.day, 'en')} to strengthen ${graha.name.en}. Alternatives: ${remedy.gemstone.alternates.map(a => triLocale(a, 'en')).join(', ')}.`,
    });

    // Mantra
    mantras.push({
      name: triLocale(remedy.beejMantra, locale),
      planet: planetName || '',
      description: locale === 'hi'
        ? `बीज मन्त्र: ${remedy.beejMantra.hi} — ${remedy.count} बार जप करें, ${triLocale(remedy.charity.day, 'hi')} से प्रारम्भ करें। ${triLocale(remedy.charity.deity, 'hi')} को समर्पित।`
        : `Beej Mantra: ${remedy.beejMantra.en} — chant ${remedy.count} times starting on ${triLocale(remedy.charity.day, 'en')}. Dedicated to ${triLocale(remedy.charity.deity, 'en')}.`,
    });

    // Practices
    practices.push({
      name: locale === 'hi' ? `${graha.name.hi} उपचार` : `${graha.name.en} Remedy`,
      planet: planetName || '',
      description: locale === 'hi'
        ? `व्रत: ${triLocale(remedy.fasting, 'hi')}। दान: ${triLocale(remedy.charity.items, 'hi')} — ${triLocale(remedy.charity.day, 'hi')} को। रंग: ${triLocale(remedy.color, 'hi')}। दिशा: ${triLocale(remedy.direction, 'hi')}।`
        : `Fast: ${triLocale(remedy.fasting, 'en')}. Donate: ${triLocale(remedy.charity.items, 'en')} on ${triLocale(remedy.charity.day, 'en')}. Wear ${triLocale(remedy.color, 'en')} colors. Face ${triLocale(remedy.direction, 'en')} for meditation.`,
    });
  }

  // ── Stage-aware sorting and fasting advisory ──
  if (stage) {
    // Import stage remedy preferences from life-stage.ts is avoided at runtime;
    // instead, we use a static preference map matching the STAGE_REMEDIES structure.
    const STAGE_PREFERRED: Record<LifeStage, string[]> = {
      student:      ['mantra', 'study', 'charity', 'fasting'],
      early_career: ['mantra', 'gemstone', 'charity', 'fasting'],
      householder:  ['puja', 'gemstone', 'charity', 'yantra'],
      established:  ['charity', 'puja', 'mantra', 'lifestyle'],
      elder:        ['mantra', 'puja', 'lifestyle', 'charity'],
      sage:         ['mantra', 'meditation', 'charity', 'lifestyle'],
    };
    const preferred = STAGE_PREFERRED[stage] || [];

    // Sort each remedy array: items whose category-keyword appears earlier in `preferred` rank higher
    const sortByPreference = (items: RemedyItem[], categoryKeywords: string[]) => {
      items.sort((a, b) => {
        const aIdx = categoryKeywords.findIndex(kw => a.name.toLowerCase().includes(kw) || a.description.toLowerCase().includes(kw));
        const bIdx = categoryKeywords.findIndex(kw => b.name.toLowerCase().includes(kw) || b.description.toLowerCase().includes(kw));
        return (aIdx === -1 ? 999 : aIdx) - (bIdx === -1 ? 999 : bIdx);
      });
    };

    sortByPreference(gemstones, preferred);
    sortByPreference(mantras, preferred);
    sortByPreference(practices, preferred);

    // For elder/sage stages, append fasting advisory to fasting-related practice items
    if (stage === 'elder' || stage === 'sage') {
      const fastingAdvisory = locale === 'hi'
        ? ' ध्यान दें: इस आयु में कठोर व्रत की अनुशंसा नहीं है। हल्का भोजन या फलाहार पर्याप्त है — चिकित्सक से परामर्श लें।'
        : ' Note: Strict fasting is not recommended at this stage of life. Light meals or fruit-based fasting is sufficient — consult your physician.';
      for (const item of practices) {
        if (item.description.toLowerCase().includes('fast') || item.description.toLowerCase().includes('व्रत')) {
          item.description += fastingAdvisory;
        }
      }
    }
  }

  return { gemstones, mantras, practices };
}
