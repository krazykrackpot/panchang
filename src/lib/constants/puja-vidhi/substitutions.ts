import type { LocaleText } from '@/types/panchang';

export interface SubstitutionEntry {
  original: LocaleText;
  substitute: LocaleText;
  note: LocaleText;
  availability: 'grocery' | 'health_store' | 'indian_store' | 'online' | 'any';
}

export const COMMON_SUBSTITUTIONS: Record<string, SubstitutionEntry> = {
  durva: {
    original: { en: 'Durva grass', hi: 'दूर्वा घास', sa: 'दूर्वा' },
    substitute: { en: 'Fresh wheatgrass', hi: 'गेहूँ की घास', sa: 'गोधूमतृणम्' },
    note: {
      en: 'Available at health food stores or juice bars. Can also grow at home from wheat berries in a tray within 7–10 days.',
      hi: 'स्वास्थ्य खाद्य दुकानों या जूस बार में उपलब्ध। गेहूँ के दानों से घर पर भी 7–10 दिन में उगा सकते हैं।',
      sa: 'आरोग्यखाद्यविपण्यां रसशालासु वा लभ्यते। गोधूमबीजैः गृहे अपि सप्तदशदिनेषु वर्धयितुं शक्यते।',
    },
    availability: 'health_store',
  },
  tulsi: {
    original: { en: 'Tulsi (Holy Basil)', hi: 'तुलसी', sa: 'तुलसी' },
    substitute: { en: 'Sweet Basil', hi: 'मीठी तुलसी', sa: 'मधुरतुलसी' },
    note: {
      en: 'Same plant family (Ocimum), available at any grocery store. Italian basil works as a substitute in puja.',
      hi: 'एक ही पौधा परिवार (ओसिमम), किसी भी किराने की दुकान में मिलता है। इटालियन तुलसी पूजा में विकल्प के रूप में चलती है।',
      sa: 'समानवनस्पतिकुलम् (ओसिमम्), सर्वत्र आपणेषु लभ्यते। पूजायां विकल्परूपेण उपयोक्तुं शक्यते।',
    },
    availability: 'grocery',
  },
  bilva: {
    original: { en: 'Bilva/Bel leaves', hi: 'बेल पत्र', sa: 'बिल्वपत्रम्' },
    substitute: { en: 'Order dried bilva online', hi: 'सूखे बेल पत्र ऑनलाइन', sa: 'शुष्कबिल्वपत्राणि' },
    note: {
      en: 'Search "dried bel patra" on Amazon or Indian grocery websites. Dried leaves are accepted in Shiva puja when fresh ones are unavailable.',
      hi: 'Amazon या भारतीय किराना वेबसाइट पर "dried bel patra" खोजें। ताज़े न मिलें तो सूखे पत्र शिव पूजा में स्वीकार्य हैं।',
      sa: 'अन्तर्जाले "dried bel patra" इति अन्विष्य क्रेतुं शक्यते। नूतनपत्राणां अभावे शुष्कपत्राणि शिवपूजायां स्वीकार्याणि।',
    },
    availability: 'online',
  },
  camphor: {
    original: { en: 'Camphor (Bhimseni)', hi: 'कपूर (भीमसेनी)', sa: 'कर्पूरम्' },
    substitute: { en: 'Edible camphor tablets', hi: 'खाने योग्य कपूर', sa: 'भक्ष्यकर्पूरवटिकाः' },
    note: {
      en: 'Search "edible camphor" or "pachai karpooram" on Amazon. Do not use synthetic/industrial camphor — only food-grade for puja.',
      hi: 'Amazon पर "edible camphor" या "पचई कर्पूरम" खोजें। औद्योगिक कपूर न लें — केवल खाद्य श्रेणी का कपूर पूजा के लिए उपयुक्त है।',
      sa: 'अन्तर्जाले "edible camphor" इति अन्विष्यतु। औद्योगिककर्पूरं न ग्राह्यम् — भक्ष्यश्रेण्याः कर्पूरमेव पूजार्थं योग्यम्।',
    },
    availability: 'online',
  },
  kumkum: {
    original: { en: 'Kumkum (Vermillion)', hi: 'कुमकुम', sa: 'कुङ्कुमम्' },
    substitute: { en: 'Turmeric + lime juice', hi: 'हल्दी + नींबू रस', sa: 'हरिद्रा + निम्बूरसः' },
    note: {
      en: 'Mix turmeric powder with a few drops of lime juice to get a red kumkum-like colour. This is the traditional method of making kumkum.',
      hi: 'हल्दी पाउडर में कुछ बूँद नींबू रस मिलाएँ — लाल कुमकुम जैसा रंग आ जाएगा। यह कुमकुम बनाने की पारंपरिक विधि है।',
      sa: 'हरिद्राचूर्णे किञ्चित् निम्बूरसं मिश्रयतु — रक्तवर्णः कुङ्कुमसदृशः भवति। एषा कुङ्कुमनिर्माणस्य पारम्परिकी विधिः।',
    },
    availability: 'grocery',
  },
  supari: {
    original: { en: 'Supari (Betel nut)', hi: 'सुपारी', sa: 'पूगीफलम्' },
    substitute: { en: 'Available at Indian stores', hi: 'भारतीय दुकान', sa: 'भारतीयविपण्यां' },
    note: {
      en: 'Most Indian grocery stores stock whole supari. In puja, even a small piece suffices as a symbolic offering.',
      hi: 'अधिकांश भारतीय किराना दुकानों में साबुत सुपारी मिलती है। पूजा में प्रतीकात्मक अर्पण हेतु एक छोटा टुकड़ा भी पर्याप्त है।',
      sa: 'प्रायः सर्वेषु भारतीयविपणिषु पूर्णा पूगी लभ्यते। पूजायां प्रतीकात्मकार्पणार्थं लघुखण्डमपि पर्याप्तम्।',
    },
    availability: 'indian_store',
  },
  akshat: {
    original: { en: 'Akshat (unbroken rice)', hi: 'अक्षत', sa: 'अक्षतम्' },
    substitute: { en: 'Any unbroken white rice', hi: 'साबुत सफेद चावल', sa: 'अखण्डश्वेततण्डुलाः' },
    note: {
      en: 'Any unbroken long-grain or basmati white rice works. Ensure the grains are whole — broken rice should not be used in puja.',
      hi: 'कोई भी साबुत लंबे दाने या बासमती सफेद चावल चलेगा। ध्यान रहे दाने टूटे न हों — टूटे चावल पूजा में वर्जित हैं।',
      sa: 'सर्वे अखण्डाः दीर्घकणाः श्वेततण्डुलाः उपयोक्तव्याः। भग्नतण्डुलाः पूजायां निषिद्धाः।',
    },
    availability: 'any',
  },
  sindoor: {
    original: { en: 'Sindoor', hi: 'सिन्दूर', sa: 'सिन्दूरम्' },
    substitute: { en: 'Available at Indian stores', hi: 'भारतीय दुकानों में', sa: 'भारतीयविपण्यां' },
    note: {
      en: 'Find at Indian grocery stores in the puja supplies section. Lead-free sindoor is recommended — check for "lead-free" on the label.',
      hi: 'भारतीय किराना दुकानों में पूजा सामग्री अनुभाग में मिलता है। सीसा-मुक्त (lead-free) सिन्दूर लें — लेबल अवश्य जाँचें।',
      sa: 'भारतीयविपणिषु पूजासामग्रीविभागे लभ्यते। सीसमुक्तं सिन्दूरम् अनुशस्यते — पत्रिकां परीक्षयतु।',
    },
    availability: 'indian_store',
  },
  cowdung: {
    original: { en: 'Cow dung cakes', hi: 'गोबर के उपले', sa: 'गोमयोपलानि' },
    substitute: { en: 'Order online or skip', hi: 'ऑनलाइन मँगाएँ', sa: 'अन्तर्जाले क्रीणातु' },
    note: {
      en: 'Search "cow dung cakes" on Amazon or Indian grocery sites. If unavailable, this item can be omitted — the puja remains valid without it.',
      hi: 'Amazon या भारतीय किराना साइट पर "cow dung cakes" खोजें। न मिले तो छोड़ सकते हैं — पूजा बिना इसके भी मान्य है।',
      sa: 'अन्तर्जाले "cow dung cakes" इति अन्विष्यतु। अलभ्ये सति त्यक्तुं शक्यते — विना तेन अपि पूजा प्रमाणिका भवति।',
    },
    availability: 'online',
  },
  paan: {
    original: { en: 'Paan (Betel leaves)', hi: 'पान', sa: 'ताम्बूलपत्रम्' },
    substitute: { en: 'Any broad green leaf', hi: 'चौड़ा हरा पत्ता', sa: 'विस्तृतहरितपत्रम्' },
    note: {
      en: 'Check Indian stores first. If unavailable, a broad green leaf like spinach or chard can serve as a symbolic substitute.',
      hi: 'पहले भारतीय दुकान में देखें। न मिले तो पालक या चार्ड जैसा चौड़ा हरा पत्ता प्रतीकात्मक विकल्प के रूप में चलेगा।',
      sa: 'प्रथमं भारतीयविपणिं पश्यतु। अलभ्ये सति पालकादि विस्तृतहरितपत्रं प्रतीकात्मकविकल्परूपेण उपयोक्तुं शक्यते।',
    },
    availability: 'indian_store',
  },
};
