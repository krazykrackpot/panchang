import { setRequestLocale } from 'next-intl/server';
import { loadPrecomputedTable, buildYearlyTithiTable, lookupAllTithiByNumber, type TithiEntry } from '@/lib/calendar/tithi-table';
import Link from 'next/link';
import DateCategoryClient from './Client';

export const revalidate = 86400;

// Reference city for SSR: Delhi (has pre-computed tithi table, avoids heavy computation at build)
const REF_LAT = 28.6139;
const REF_LON = 77.2090;
const REF_TZ = 'Asia/Kolkata';

const WEEKDAYS_EN = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const WEEKDAYS_HI = ['रविवार', 'सोमवार', 'मंगलवार', 'बुधवार', 'गुरुवार', 'शुक्रवार', 'शनिवार'];

const MONTH_NAMES_EN = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];
const MONTH_NAMES_HI = [
  'जनवरी', 'फरवरी', 'मार्च', 'अप्रैल', 'मई', 'जून',
  'जुलाई', 'अगस्त', 'सितम्बर', 'अक्टूबर', 'नवम्बर', 'दिसम्बर',
];

const MASA_LABELS_EN: Record<string, string> = {
  chaitra: 'Chaitra', vaishakha: 'Vaishakha', jyeshtha: 'Jyeshtha', ashadha: 'Ashadha',
  shravana: 'Shravana', bhadrapada: 'Bhadrapada', ashwin: 'Ashwin', kartik: 'Kartik',
  margashirsha: 'Margashirsha', pausha: 'Pausha', magha: 'Magha', phalguna: 'Phalguna',
};
const MASA_LABELS_HI: Record<string, string> = {
  chaitra: 'चैत्र', vaishakha: 'वैशाख', jyeshtha: 'ज्येष्ठ', ashadha: 'आषाढ़',
  shravana: 'श्रावण', bhadrapada: 'भाद्रपद', ashwin: 'आश्विन', kartik: 'कार्तिक',
  margashirsha: 'मार्गशीर्ष', pausha: 'पौष', magha: 'माघ', phalguna: 'फाल्गुन',
};

// Ekadashi names by Amanta month + paksha (canonical 24 names)
const EKADASHI_NAMES: Record<string, Record<string, { en: string; hi: string }>> = {
  chaitra: { shukla: { en: 'Kamada', hi: 'कामदा' }, krishna: { en: 'Papamochani', hi: 'पापमोचनी' } },
  vaishakha: { shukla: { en: 'Mohini', hi: 'मोहिनी' }, krishna: { en: 'Varuthini', hi: 'वरूथिनी' } },
  jyeshtha: { shukla: { en: 'Nirjala', hi: 'निर्जला' }, krishna: { en: 'Apara', hi: 'अपरा' } },
  ashadha: { shukla: { en: 'Yogini', hi: 'योगिनी' }, krishna: { en: 'Devshayani', hi: 'देवशयनी' } },
  shravana: { shukla: { en: 'Kamika', hi: 'कामिका' }, krishna: { en: 'Putrada', hi: 'पुत्रदा' } },
  bhadrapada: { shukla: { en: 'Aja', hi: 'अजा' }, krishna: { en: 'Parivartini', hi: 'परिवर्तिनी' } },
  ashwin: { shukla: { en: 'Indira', hi: 'इन्दिरा' }, krishna: { en: 'Papankusha', hi: 'पापाङ्कुशा' } },
  kartik: { shukla: { en: 'Rama', hi: 'रमा' }, krishna: { en: 'Devutthana', hi: 'देवउत्थान' } },
  margashirsha: { shukla: { en: 'Utpanna', hi: 'उत्पन्ना' }, krishna: { en: 'Mokshada', hi: 'मोक्षदा' } },
  pausha: { shukla: { en: 'Saphala', hi: 'सफला' }, krishna: { en: 'Putrada', hi: 'पुत्रदा' } },
  magha: { shukla: { en: 'Shattila', hi: 'षट्तिला' }, krishna: { en: 'Jaya', hi: 'जया' } },
  phalguna: { shukla: { en: 'Vijaya', hi: 'विजया' }, krishna: { en: 'Amalaki', hi: 'आमलकी' } },
};

// Special Amavasya labels
function getAmavasyaLabel(entry: TithiEntry, isHi: boolean): string {
  const dow = getDow(entry.sunriseDate);
  if (dow === 1) return isHi ? 'सोमवती अमावस्या' : 'Somvati Amavasya';
  if (dow === 6) return isHi ? 'शनि अमावस्या' : 'Shani Amavasya';
  const m = entry.masa.amanta;
  if (m === 'kartik') return isHi ? 'दीपावली अमावस्या' : 'Diwali Amavasya';
  if (m === 'magha') return isHi ? 'मौनी अमावस्या' : 'Mauni Amavasya';
  return isHi ? 'अमावस्या' : 'Amavasya';
}

// Special Purnima labels
function getPurnimaLabel(entry: TithiEntry, isHi: boolean): string {
  const m = entry.masa.amanta;
  const labels: Record<string, { en: string; hi: string }> = {
    ashadha: { en: 'Guru Purnima', hi: 'गुरु पूर्णिमा' },
    shravana: { en: 'Raksha Bandhan', hi: 'रक्षा बन्धन' },
    ashwin: { en: 'Sharad Purnima', hi: 'शरद पूर्णिमा' },
    kartik: { en: 'Kartik Purnima', hi: 'कार्तिक पूर्णिमा' },
    vaishakha: { en: 'Buddha Purnima', hi: 'बुद्ध पूर्णिमा' },
    phalguna: { en: 'Holi (Holika Dahan)', hi: 'होली (होलिका दहन)' },
    magha: { en: 'Maghi Purnima', hi: 'माघी पूर्णिमा' },
    chaitra: { en: 'Hanuman Jayanti', hi: 'हनुमान जयन्ती' },
  };
  const label = labels[m];
  if (label) return isHi ? label.hi : label.en;
  const masaLabel = isHi ? MASA_LABELS_HI[m] || m : MASA_LABELS_EN[m] || m;
  return isHi ? `${masaLabel} पूर्णिमा` : `${masaLabel} Purnima`;
}

function getDow(dateStr: string): number {
  const [y, m, d] = dateStr.split('-').map(Number);
  return new Date(Date.UTC(y, m - 1, d)).getUTCDay(); // 0=Sun
}

function formatDate(dateStr: string, isHi: boolean): string {
  const [, m, d] = dateStr.split('-').map(Number);
  const months = isHi ? MONTH_NAMES_HI : MONTH_NAMES_EN;
  return `${d} ${months[m - 1]}`;
}

const VALID_CATEGORIES = ['ekadashi', 'purnima', 'amavasya', 'pradosham', 'chaturthi'] as const;
type Category = typeof VALID_CATEGORIES[number];

// Tithi number lookup for each category (both Shukla and Krishna for each)
const TITHI_NUMBERS: Record<Category, number[]> = {
  amavasya: [30],        // Amavasya = tithi 30
  purnima: [15],          // Purnima = tithi 15
  ekadashi: [11, 26],     // Shukla Ekadashi = 11, Krishna Ekadashi = 26
  pradosham: [13, 28],    // Shukla Trayodashi = 13, Krishna Trayodashi = 28
  chaturthi: [4, 19],     // Shukla Chaturthi = 4, Krishna Chaturthi = 19
};

const CATEGORY_TITLE: Record<Category, { en: string; hi: string }> = {
  amavasya: { en: 'Amavasya', hi: 'अमावस्या' },
  purnima: { en: 'Purnima', hi: 'पूर्णिमा' },
  ekadashi: { en: 'Ekadashi', hi: 'एकादशी' },
  pradosham: { en: 'Pradosham', hi: 'प्रदोष' },
  chaturthi: { en: 'Chaturthi', hi: 'चतुर्थी' },
};

interface DateRow {
  date: string;
  dow: number;
  paksha: 'shukla' | 'krishna';
  masa: string;
  label: string;
}

function buildDateRows(category: Category, entries: TithiEntry[], year: number, isHi: boolean): DateRow[] {
  const rows: DateRow[] = [];
  for (const entry of entries) {
    // Only include entries whose sunriseDate falls in the target year
    if (!entry.sunriseDate.startsWith(String(year))) continue;

    let label = '';
    if (category === 'amavasya') {
      label = getAmavasyaLabel(entry, isHi);
    } else if (category === 'purnima') {
      label = getPurnimaLabel(entry, isHi);
    } else if (category === 'ekadashi') {
      const ekName = EKADASHI_NAMES[entry.masa.amanta]?.[entry.paksha];
      label = ekName ? (isHi ? ekName.hi : ekName.en) : '';
    } else if (category === 'pradosham') {
      const dow = getDow(entry.sunriseDate);
      if (dow === 6) label = isHi ? 'शनि प्रदोष' : 'Shani Pradosham';
      else if (dow === 1) label = isHi ? 'सोम प्रदोष' : 'Soma Pradosham';
      else label = isHi ? 'प्रदोष' : 'Pradosham';
    } else if (category === 'chaturthi') {
      label = entry.paksha === 'krishna'
        ? (isHi ? 'संकष्टी चतुर्थी' : 'Sankashti Chaturthi')
        : (isHi ? 'विनायक चतुर्थी' : 'Vinayaka Chaturthi');
    }

    rows.push({
      date: entry.sunriseDate,
      dow: getDow(entry.sunriseDate),
      paksha: entry.paksha,
      masa: entry.masa.amanta,
      label,
    });
  }
  rows.sort((a, b) => a.date.localeCompare(b.date));
  return rows;
}

// ─── Explanatory Content ────────────────────────────────────────
const EXPLANATIONS: Record<Category, { en: string[]; hi: string[] }> = {
  amavasya: {
    en: [
      'Amavasya is the new moon day, the thirtieth and final tithi of Krishna Paksha when the moon is entirely invisible. In the Amanta calendar system followed in Gujarat, Maharashtra, Karnataka, and South India, Amavasya marks the last day of the lunar month. The word derives from Sanskrit "ama" (together) and "vasya" (to dwell), signifying the conjunction of Sun and Moon at the same ecliptic longitude.',
      'Amavasya holds paramount importance for Pitru Tarpan -- ritual offerings of water, sesame seeds, and kusha grass to departed ancestors. The Garuda Purana prescribes Amavasya as the day when the Pitru Loka (ancestral realm) is most accessible. Somvati Amavasya (falling on Monday) is especially potent for tarpan and peepal tree worship. Mauni Amavasya (Magha) prescribes maun vrat (vow of silence) and sacred river bathing.',
      'Diwali falls on Kartik Amavasya, transforming the otherwise sombre new moon into the most celebrated night of the year. Shani Amavasya (Saturday) is observed with mustard oil offerings to Lord Shani. In Ayurveda, Vata dosha increases on Amavasya, so warm grounding foods and oil massage (abhyanga) are recommended.',
      'Shani Amavasya (Amavasya falling on Saturday) is considered among the most powerful days for Saturn worship. Devotees visit Shani temples, offer mustard oil and black sesame (til), and light a sesame-oil lamp. Those undergoing Sade Sati or Shani Dhaiya find this day especially significant for remedial practices. A single Shani Amavasya puja is said to counteract months of Shani affliction.',
      'Somvati Amavasya (Amavasya on Monday) combines the lunar significance of Monday (Somvar, ruled by the Moon) with the new moon\'s ancestral power. It is prescribed for the Saubhagya Vrat observed by married women, who circumambulate the peepal tree and offer water, milk, and a sacred thread. The Skanda Purana holds that a single Somvati Amavasya puja equals the merit of a thousand Amavasyas. In 2026, check the table below to identify which Amavasyas fall on Saturday or Monday.',
      'While Amavasya is traditionally considered inauspicious for starting new ventures, it is regarded as deeply powerful for meditation and introspective practices. The absence of moonlight is said to support deeper states of consciousness. The table below lists all Amavasya dates for the current year with the prevailing Hindu month and any special significance.',
    ],
    hi: [
      'अमावस्या कृष्ण पक्ष की तीसवीं और अन्तिम तिथि है जब चन्द्रमा पूर्णतः अदृश्य होता है। अमान्त पंचांग में अमावस्या मास का अन्तिम दिन है। संस्कृत में "अमा" (साथ) और "वस्य" (निवास) -- सूर्य और चन्द्रमा का एक ही अंश पर संयोग।',
      'अमावस्या पितृ तर्पण के लिए सर्वाधिक महत्वपूर्ण है -- जल, तिल और कुश से पितरों को अर्पण किया जाता है। गरुड़ पुराण के अनुसार अमावस्या पर पितृ लोक सबसे सुलभ होता है। सोमवती अमावस्या (सोमवार) तर्पण और पीपल पूजा के लिए विशेष शुभ है।',
      'दीपावली कार्तिक अमावस्या पर पड़ती है। शनि अमावस्या (शनिवार) पर शनि देव को सरसों का तेल अर्पित किया जाता है। आयुर्वेद के अनुसार अमावस्या पर वात दोष बढ़ता है -- गर्म पौष्टिक भोजन और तेल मालिश की सलाह दी जाती है।',
      'शनि अमावस्या (शनिवार को पड़ने वाली अमावस्या) शनि उपासना के लिए अत्यन्त शक्तिशाली मानी जाती है। भक्त शनि मन्दिरों में सरसों का तेल, काला तिल और तेल का दीपक अर्पित करते हैं। साढ़े साती या शनि ढय्या से पीड़ित जातकों के लिए यह दिन विशेष उपचारात्मक है। एक शनि अमावस्या की पूजा महीनों के शनि दोष को निवारण करने में सहायक मानी जाती है।',
      'सोमवती अमावस्या (सोमवार को पड़ने वाली अमावस्या) चन्द्रमा के दिन (सोमवार) और अमावस्या की पितृ-शक्ति का संयोग है। विवाहित महिलाएँ सौभाग्य व्रत रखती हैं और पीपल वृक्ष की 108 परिक्रमाएँ करती हैं। स्कन्द पुराण के अनुसार एक सोमवती अमावस्या की पूजा हजार अमावस्याओं के बराबर फल देती है। नीचे की तालिका में देखें कि 2026 में कौन सी अमावस्या शनिवार या सोमवार को पड़ती है।',
      'अमावस्या नए कार्य के लिए अशुभ मानी जाती है किन्तु ध्यान और आन्तरिक साधना के लिए अत्यन्त शक्तिशाली है। नीचे दी गई तालिका में वर्तमान वर्ष की सभी अमावस्या तिथियाँ हिन्दू मास और विशेष महत्व सहित दी गई हैं।',
    ],
  },
  purnima: {
    en: [
      'Purnima is the full moon day, the fifteenth and final tithi of Shukla Paksha when the lunar disc reaches complete illumination. In the Purnimant calendar system used across North India, Purnima marks the boundary between months. The Hindu year contains 12 to 13 named Purnimas, each tied to a specific observance and festival.',
      'Each of the 12 principal Purnimas carries its own name and significance: Chaitra Purnima (Hanuman Jayanti), Vaishakha Purnima (Buddha Purnima — birth of Gautama Buddha), Jyeshtha Purnima (Vat Savitri Purnima in South India), Ashadha Purnima (Guru Purnima — honouring the guru lineage and Veda Vyasa), Shravana Purnima (Raksha Bandhan and Narali Purnima in Maharashtra), Bhadrapada Purnima, Ashwin Purnima (Sharad Purnima — the harvest moon when amrit is believed to fall), Kartik Purnima (Dev Deepavali and Tripuri Purnima), Margashirsha Purnima, Pausha Purnima (Shakambhari Purnima), Magha Purnima (Maghi — sacred bathing at Prayagraj), and Phalguna Purnima (Holi — Holika Dahan).',
      'Guru Purnima (Ashadha) honours the guru lineage and Vyasa. Sharad Purnima (Ashwin) is the harvest moon celebration when the moon is believed to shower amrit. Kartik Purnima coincides with Dev Deepavali. Buddha Purnima (Vaishakha) celebrates the birth of Gautama Buddha. Holi falls on Phalguna Purnima, and Raksha Bandhan on Shravana Purnima.',
      'Ayurveda and the Surya Siddhanta both document the moon\'s influence on biological rhythms. The Charaka Samhita notes that Kapha dosha peaks on Purnima, recommending lighter meals and meditative practice. Modern chronobiology confirms altered sleep architecture around the full moon.',
      'Purnima observances include Satyanarayan Katha, fasting (Nirjala to Phalahari), and charity (daan). The table below lists all Purnima dates for the year with their associated festivals and Hindu months.',
    ],
    hi: [
      'पूर्णिमा शुक्ल पक्ष की पन्द्रहवीं और अन्तिम तिथि है जब चन्द्र बिम्ब पूर्ण प्रकाशित होता है। पूर्णिमान्त पंचांग में पूर्णिमा मास की सीमा है। हिन्दू वर्ष में 12 से 13 नामित पूर्णिमाएँ होती हैं, प्रत्येक एक विशेष पर्व से जुड़ी है।',
      'प्रत्येक पूर्णिमा का अपना नाम और महत्व है: चैत्र पूर्णिमा (हनुमान जयन्ती), वैशाख पूर्णिमा (बुद्ध पूर्णिमा), ज्येष्ठ पूर्णिमा (वट सावित्री पूर्णिमा), आषाढ़ पूर्णिमा (गुरु पूर्णिमा — वेदव्यास और गुरु परम्परा को समर्पित), श्रावण पूर्णिमा (रक्षा बन्धन), भाद्रपद पूर्णिमा, आश्विन पूर्णिमा (शरद पूर्णिमा — अमृत वर्षा), कार्तिक पूर्णिमा (देव दीपावली), मार्गशीर्ष पूर्णिमा, पौष पूर्णिमा (शाकम्भरी पूर्णिमा), माघ पूर्णिमा (प्रयागराज में पवित्र स्नान), और फाल्गुन पूर्णिमा (होली — होलिका दहन)।',
      'गुरु पूर्णिमा (आषाढ़) गुरु परम्परा और वेदव्यास को समर्पित है। शरद पूर्णिमा (आश्विन) को चन्द्रमा अमृत वर्षा करता है। कार्तिक पूर्णिमा देव दीपावली से जुड़ी है। बुद्ध पूर्णिमा (वैशाख) गौतम बुद्ध का जन्मोत्सव है। होली फाल्गुन पूर्णिमा पर और रक्षा बन्धन श्रावण पूर्णिमा पर पड़ता है।',
      'आयुर्वेद और सूर्य सिद्धान्त चन्द्रमा के जैविक लय पर प्रभाव का वर्णन करते हैं। चरक संहिता के अनुसार पूर्णिमा पर कफ दोष बढ़ता है। आधुनिक शोध भी पूर्णिमा पर नींद के पैटर्न में बदलाव की पुष्टि करता है।',
      'पूर्णिमा पर सत्यनारायण कथा, उपवास और दान प्रमुख अनुष्ठान हैं। नीचे दी गई तालिका में वर्ष की सभी पूर्णिमा तिथियाँ उनके सम्बद्ध पर्व और हिन्दू मास सहित दी गई हैं।',
    ],
  },
  ekadashi: {
    en: [
      'Ekadashi is the eleventh tithi of each lunar fortnight, falling twice every month -- once during Shukla Paksha (waxing moon) and once during Krishna Paksha (waning moon). This yields approximately 24 named Ekadashis per year, each carrying a distinct spiritual narrative rooted in the Padma Purana and Bhavishya Purana.',
      'The 24 canonical Ekadashis are: Papamochani (Chaitra Krishna), Kamada (Chaitra Shukla), Varuthini (Vaishakha Krishna), Mohini (Vaishakha Shukla), Apara (Jyeshtha Krishna), Nirjala (Jyeshtha Shukla), Yogini (Ashadha Krishna), Devshayani (Ashadha Shukla — Chaturmas begins), Kamika (Shravana Krishna), Putrada (Shravana Shukla), Aja (Bhadrapada Krishna), Parivartini (Bhadrapada Shukla), Indira (Ashwin Krishna), Papankusha (Ashwin Shukla), Rama (Kartik Krishna), Devutthana (Kartik Shukla — Chaturmas ends), Utpanna (Margashirsha Krishna), Mokshada (Margashirsha Shukla — Gita Jayanti), Saphala (Pausha Krishna), Putrada (Pausha Shukla), Shattila (Magha Krishna), Jaya (Magha Shukla), Vijaya (Phalguna Krishna), and Amalaki (Phalguna Shukla). The most important are Nirjala (merit equal to all 24), Devutthana (marks Vishnu\'s awakening), and Mokshada (Bhagavad Gita recitation).',
      'The 24 Ekadashi cycle includes Nirjala Ekadashi (Jyeshtha Shukla), the most austere -- devotees abstain from both food and water. Papankusha Ekadashi (Ashwin Shukla) absolves accumulated sins. Devutthana Ekadashi (Kartik Shukla) marks the end of Chaturmas when Lord Vishnu awakens from cosmic sleep.',
      'Ekadashi fasting rules are codified in the Hari Bhakti Vilasa. The standard practice is a complete fast from grains and beans. Permitted foods include fruits, nuts, milk, root vegetables, sabudana, and rock salt. Parana (breaking the fast) must be done the next day after sunrise but before the end of Dwadashi tithi.',
      'The table below lists all Ekadashi dates for the year with their traditional names (from the Amanta month system), paksha, and Hindu month. Both Shukla and Krishna Paksha Ekadashis are included.',
    ],
    hi: [
      'एकादशी प्रत्येक चान्द्र पक्ष की ग्यारहवीं तिथि है। प्रत्येक माह में दो एकादशियाँ होती हैं -- एक शुक्ल पक्ष में और एक कृष्ण पक्ष में, जिससे वर्ष में लगभग 24 नामित एकादशियाँ आती हैं।',
      '24 प्रमुख एकादशियाँ हैं: पापमोचनी (चैत्र कृष्ण), कामदा (चैत्र शुक्ल), वरूथिनी (वैशाख कृष्ण), मोहिनी (वैशाख शुक्ल), अपरा (ज्येष्ठ कृष्ण), निर्जला (ज्येष्ठ शुक्ल), योगिनी (आषाढ़ कृष्ण), देवशयनी (आषाढ़ शुक्ल — चातुर्मास आरम्भ), कामिका (श्रावण कृष्ण), पुत्रदा (श्रावण शुक्ल), अजा (भाद्रपद कृष्ण), परिवर्तिनी (भाद्रपद शुक्ल), इन्दिरा (आश्विन कृष्ण), पापाङ्कुशा (आश्विन शुक्ल), रमा (कार्तिक कृष्ण), देवउत्थान (कार्तिक शुक्ल — चातुर्मास समाप्त), उत्पन्ना (मार्गशीर्ष कृष्ण), मोक्षदा (मार्गशीर्ष शुक्ल — गीता जयन्ती), सफला (पौष कृष्ण), पुत्रदा (पौष शुक्ल), षट्तिला (माघ कृष्ण), जया (माघ शुक्ल), विजया (फाल्गुन कृष्ण), और आमलकी (फाल्गुन शुक्ल)। सबसे महत्वपूर्ण: निर्जला (24 का पुण्य), देवउत्थान, और मोक्षदा।',
      'निर्जला एकादशी (ज्येष्ठ शुक्ल) सबसे कठोर मानी जाती है। पापाङ्कुशा एकादशी (आश्विन शुक्ल) पापों के नाश के लिए प्रसिद्ध है। देवउत्थान एकादशी (कार्तिक शुक्ल) चातुर्मास के अन्त में भगवान विष्णु के जागरण का पर्व है।',
      'एकादशी व्रत के नियम हरि भक्ति विलास में संहिताबद्ध हैं। अन्न और दालों का पूर्ण त्याग मुख्य नियम है। फल, मेवे, दूध, कन्द-मूल और सेंधा नमक अनुमत हैं। पारण अगले दिन सूर्योदय के बाद द्वादशी समाप्ति से पहले करना अनिवार्य है।',
      'नीचे दी गई तालिका में वर्ष की सभी एकादशी तिथियाँ उनके पारम्परिक नाम (अमान्त मास), पक्ष और हिन्दू मास सहित दी गई हैं।',
    ],
  },
  pradosham: {
    en: [
      'Pradosham falls on the thirteenth tithi (Trayodashi) of each lunar fortnight, both Shukla and Krishna Paksha, yielding approximately 24 Pradosham days per year. The word "Pradosha" means "the first part of the night" -- the twilight period between sunset and nightfall, a 90-minute window considered most sacred for Lord Shiva worship.',
      'The origin story comes from the Skanda Purana. During the churning of the cosmic ocean (Samudra Manthan), the deadly poison Halahala emerged during the Pradosh Kaal of Trayodashi. Lord Shiva consumed the poison, and Parvati pressed his throat to prevent it from descending, turning his throat blue (Neelakantha).',
      'Shani Pradosham (Saturday Trayodashi) is regarded as the most powerful Pradosham variant for overcoming obstacles, karmic debts, and Saturn afflictions such as Sade Sati and Shani Dhaiya. Devotees offer blue flowers, sesame seeds, and mustard oil to Lord Shiva and Lord Shani simultaneously. The combined energy of Shiva\'s transformative grace and Saturn\'s karmic resolution is said to accelerate spiritual progress and remove long-standing life obstacles. Those in a Saturn Mahadasha or Antardasha are especially encouraged to observe Shani Pradosham.',
      'Soma Pradosham (Monday Trayodashi) combines the Moon\'s nurturing lunar energy with Shiva\'s blessings, making it particularly auspicious for mental peace, emotional healing, and family harmony. As Monday (Somvar) is naturally dedicated to Lord Shiva, a Pradosham on this day doubles the potency of the twilight worship. The standard Soma Pradosham puja includes Abhishek (ritual bath of Shiva Linga with milk, honey, and rosewater), bilva leaf offerings, and recitation of the Shiva Panchakshara mantra (Om Namah Shivaya).',
      'The Pradosham puja involves lighting a ghee lamp at twilight, offering bilva leaves, and chanting Maha Mrityunjaya Mantra.',
      'The table below lists all Pradosham (Trayodashi) dates for the year, noting which fall on Saturday (Shani Pradosham) or Monday (Soma Pradosham) for special observance.',
    ],
    hi: [
      'प्रदोष प्रत्येक पक्ष की त्रयोदशी (13वीं) तिथि पर पड़ता है -- शुक्ल और कृष्ण दोनों पक्षों में, जिससे वर्ष में लगभग 24 प्रदोष आते हैं। "प्रदोष" का अर्थ "रात्रि का प्रथम भाग" है -- सूर्यास्त और रात्रि के बीच का 90 मिनट का सन्ध्याकाल जो शिव पूजा के लिए सर्वश्रेष्ठ माना जाता है।',
      'प्रदोष की कथा स्कन्द पुराण से आती है। समुद्र मन्थन में त्रयोदशी के प्रदोष काल में हालाहल विष प्रकट हुआ। भगवान शिव ने सृष्टि रक्षा हेतु विष पान किया और नीलकण्ठ कहलाए।',
      'शनि प्रदोष (शनिवार त्रयोदशी) बाधाओं, कर्म ऋण और साढ़े साती जैसे शनि दोषों के निवारण के लिए सबसे शक्तिशाली प्रदोष माना जाता है। भक्त भगवान शिव और शनि देव दोनों को नील पुष्प, तिल और सरसों का तेल अर्पित करते हैं। शिव की अनुग्रह-शक्ति और शनि के कर्म-समाधान का संयुक्त प्रभाव आध्यात्मिक प्रगति को त्वरित करता है। शनि महादशा या अन्तर्दशा में चल रहे जातकों को शनि प्रदोष विशेष रूप से लाभदायक होता है।',
      'सोम प्रदोष (सोमवार त्रयोदशी) चन्द्रमा की पोषण-ऊर्जा और शिव के आशीर्वाद का संयोग है -- मानसिक शान्ति, भावनात्मक उपचार और पारिवारिक सौहार्द के लिए विशेष शुभ। सोमवार स्वाभाविक रूप से शिव को समर्पित है, इसलिए उस दिन प्रदोष का संयोग पूजा की शक्ति को दोगुना कर देता है। सोम प्रदोष में शिव लिंग का दूध, शहद और गुलाबजल से अभिषेक, बिल्व पत्र अर्पण और पंचाक्षर मन्त्र (ॐ नमः शिवाय) का जाप प्रमुख है।',
      'प्रदोष पूजा में सन्ध्याकाल में घी का दीपक, बिल्व पत्र और महामृत्युञ्जय मन्त्र का पाठ शामिल है।',
      'नीचे दी गई तालिका में वर्ष की सभी प्रदोष (त्रयोदशी) तिथियाँ दी गई हैं, जिनमें शनि प्रदोष और सोम प्रदोष विशेष चिह्नित हैं।',
    ],
  },
  chaturthi: {
    en: [
      'Chaturthi is the fourth tithi of each lunar fortnight, sacred to Lord Ganesha. Two types recur monthly: Sankashti Chaturthi (Krishna Paksha) is the primary monthly Ganesha vrat, while Vinayaka Chaturthi (Shukla Paksha) is observed with morning puja and modak offerings.',
      'On Sankashti Chaturthi, devotees fast from sunrise until moonrise and break the fast only after sighting the moon and performing Ganesh Puja. The grand Ganesh Chaturthi festival (Bhadrapada Shukla Chaturthi) is a 10-day celebration culminating in visarjan.',
      'The Chaturthi Chandra Dosha is unique: on Bhadrapada Shukla Chaturthi, looking at the moon brings false accusations (Syamantaka gem curse). If seen accidentally, reciting the Syamantaka story is the prescribed remedy. Modak (21) and Durva grass (3 or 5 blades) are the traditional offerings.',
      'The table below lists all Chaturthi dates for the year, distinguishing Sankashti (Krishna Paksha) and Vinayaka (Shukla Paksha) observances.',
    ],
    hi: [
      'चतुर्थी प्रत्येक पक्ष की चौथी तिथि है, जो भगवान गणेश को समर्पित है। संकष्टी चतुर्थी (कृष्ण पक्ष) मुख्य मासिक गणेश व्रत है, जबकि विनायक चतुर्थी (शुक्ल पक्ष) में प्रातः पूजा और मोदक अर्पण किया जाता है।',
      'संकष्टी चतुर्थी पर भक्त सूर्योदय से चन्द्रोदय तक उपवास रखते हैं और चन्द्र दर्शन व गणेश पूजा के बाद ही व्रत तोड़ते हैं। गणेश चतुर्थी (भाद्रपद शुक्ल चतुर्थी) 10 दिन का उत्सव है जो विसर्जन पर समाप्त होता है।',
      'चतुर्थी चन्द्र दोष -- भाद्रपद शुक्ल चतुर्थी पर चन्द्र दर्शन से मिथ्या आरोप लगने की मान्यता है। भूल से दिख जाए तो स्यमन्तक कथा का पाठ करें। 21 मोदक और दूर्वा (3 या 5 पत्तियाँ) पारम्परिक अर्पण हैं।',
      'नीचे दी गई तालिका में वर्ष की सभी चतुर्थी तिथियाँ दी गई हैं -- संकष्टी (कृष्ण पक्ष) और विनायक (शुक्ल पक्ष) अलग-अलग चिह्नित हैं।',
    ],
  },
};

export default async function DateCategoryPage({ params }: { params: Promise<{ locale: string; category: string }> }) {
  const { locale, category: rawCategory } = await params;
  setRequestLocale(locale);
  const category = (VALID_CATEGORIES.includes(rawCategory as Category) ? rawCategory : 'ekadashi') as Category;
  const isHi = locale === 'hi' || locale === 'sa' || locale === 'mr' || locale === 'mai';
  const year = 2026;
  const title = isHi ? CATEGORY_TITLE[category].hi : CATEGORY_TITLE[category].en;

  // Build SSR tithi data from Delhi reference (pre-computed table avoids heavy build-time computation)
  let rows: DateRow[] = [];
  try {
    const table = loadPrecomputedTable(year, REF_LAT, REF_LON) ?? buildYearlyTithiTable(year, REF_LAT, REF_LON, REF_TZ);
    const tithiNumbers = TITHI_NUMBERS[category];
    const entries: TithiEntry[] = [];
    for (const tn of tithiNumbers) {
      entries.push(...lookupAllTithiByNumber(table, tn));
    }
    rows = buildDateRows(category, entries, year, isHi);
  } catch (err) {
    console.error('[dates/category] SSR tithi table build failed:', err);
  }

  const explanations = EXPLANATIONS[category];
  const texts = isHi ? explanations.hi : explanations.en;

  return (
    <main className="min-h-screen bg-bg-primary">
      {/* ═══ SSR SEO Content ═══ */}
      <div className="max-w-4xl mx-auto px-4 pt-10 pb-6 sm:px-6 lg:px-8">
        <h1
          className="text-3xl sm:text-4xl font-bold text-gold-light"
          style={{ fontFamily: 'var(--font-heading)' }}
        >
          {isHi ? `${title} ${year} — सम्पूर्ण तिथियाँ और समय` : `${title} ${year} — Complete Dates & Timings`}
        </h1>

        <p className="text-text-primary text-lg mt-4">
          {isHi
            ? `वर्ष ${year} में कुल ${rows.length} ${title} तिथियाँ हैं। नीचे दी गई तालिका में प्रत्येक ${title} की तारीख, वार, हिन्दू मास और विशेष महत्व दिया गया है (दिल्ली सन्दर्भ)।`
            : `There are ${rows.length} ${title} dates in ${year}. The table below lists every ${title} with its date, day of the week, Hindu month, and significance (Delhi reference).`}
        </p>

        {/* ═══ Explanatory Content ═══ */}
        <div className="mt-6 space-y-4 text-text-secondary text-sm leading-relaxed">
          <h2 className="text-gold-light text-lg font-semibold" style={{ fontFamily: 'var(--font-heading)' }}>
            {isHi ? `${title} क्या है?` : `What is ${title}?`}
          </h2>
          {texts.map((t, i) => (
            <p key={i}>{t}</p>
          ))}
        </div>

        {/* ═══ SSR Date Table ═══ */}
        {rows.length > 0 && (
          <div className="mt-8 rounded-xl border border-gold-primary/12 overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gold-primary/[0.06] border-b border-gold-primary/12">
                  <th className="text-left py-2.5 px-4 text-gold-light text-xs font-semibold uppercase tracking-wider">
                    {isHi ? 'तारीख' : 'Date'}
                  </th>
                  <th className="text-left py-2.5 px-4 text-gold-light text-xs font-semibold uppercase tracking-wider">
                    {isHi ? 'वार' : 'Day'}
                  </th>
                  <th className="text-left py-2.5 px-4 text-gold-light text-xs font-semibold uppercase tracking-wider hidden sm:table-cell">
                    {isHi ? 'हिन्दू मास' : 'Hindu Month'}
                  </th>
                  <th className="text-left py-2.5 px-4 text-gold-light text-xs font-semibold uppercase tracking-wider hidden sm:table-cell">
                    {isHi ? 'पक्ष' : 'Paksha'}
                  </th>
                  <th className="text-left py-2.5 px-4 text-gold-light text-xs font-semibold uppercase tracking-wider">
                    {isHi ? 'विशेष / नाम' : 'Name / Significance'}
                  </th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row, i) => (
                  <tr key={`${row.date}-${row.paksha}-${i}`} className="border-b border-white/[0.04] hover:bg-white/[0.02]">
                    <td className="py-2 px-4 text-text-primary font-medium whitespace-nowrap">{formatDate(row.date, isHi)}</td>
                    <td className="py-2 px-4 text-text-secondary">{isHi ? WEEKDAYS_HI[row.dow] : WEEKDAYS_EN[row.dow]}</td>
                    <td className="py-2 px-4 text-text-secondary hidden sm:table-cell">
                      {isHi ? (MASA_LABELS_HI[row.masa] || row.masa) : (MASA_LABELS_EN[row.masa] || row.masa)}
                    </td>
                    <td className="py-2 px-4 hidden sm:table-cell">
                      <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${
                        row.paksha === 'shukla'
                          ? 'bg-emerald-500/15 text-emerald-300'
                          : 'bg-violet-500/15 text-violet-300'
                      }`}>
                        {row.paksha === 'shukla' ? (isHi ? 'शुक्ल' : 'Shukla') : (isHi ? 'कृष्ण' : 'Krishna')}
                      </span>
                    </td>
                    <td className="py-2 px-4 text-text-primary font-medium">{row.label}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Internal links */}
        <nav className="flex flex-wrap gap-2 mt-6 text-xs" aria-label="Related pages">
          {[
            { href: '/panchang', en: "Today's Panchang", hi: 'आज का पंचांग' },
            { href: '/calendar', en: 'Festival Calendar', hi: 'त्योहार कैलेंडर' },
            { href: '/dates/ekadashi', en: 'Ekadashi Dates', hi: 'एकादशी तिथियाँ' },
            { href: '/dates/purnima', en: 'Purnima Dates', hi: 'पूर्णिमा तिथियाँ' },
            { href: '/dates/amavasya', en: 'Amavasya Dates', hi: 'अमावस्या तिथियाँ' },
            { href: '/dates/pradosham', en: 'Pradosham Dates', hi: 'प्रदोष तिथियाँ' },
            { href: '/learn/tithis', en: 'Learn about Tithis', hi: 'तिथियों के बारे में जानें' },
            { href: '/calendar/eclipses', en: 'Eclipse Calendar', hi: 'ग्रहण कैलेंडर' },
          ].filter(l => !l.href.includes(category)).map((link, i) => (
            <span key={link.href}>
              {i > 0 && <span className="text-text-secondary/30 mr-2">·</span>}
              <Link href={link.href} className="text-gold-primary/70 hover:text-gold-light transition-colors">
                {isHi ? link.hi : link.en}
              </Link>
            </span>
          ))}
        </nav>
      </div>

      {/* ═══ Client Island: interactive year selector, location-based data ═══ */}
      <DateCategoryClient />
    </main>
  );
}
