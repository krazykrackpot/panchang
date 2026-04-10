'use client';

import { useMemo } from 'react';
import { useLocale } from 'next-intl';
import { motion } from 'framer-motion';
import { computeHinduMonths, formatMonthDate } from '@/lib/calendar/hindu-months';
import type { Locale } from '@/types/panchang';

const MONTHS_DETAIL = [
  { n: 1, en: 'Chaitra', hi: 'चैत्र', sa: 'चैत्रः', deity: { en: 'Vishnu (as Vasudeva)', hi: 'विष्णु (वासुदेव)' }, nakshatra: { en: 'Chitra', hi: 'चित्रा' }, festivals: { en: 'Ugadi, Gudi Padwa, Nav Samvatsar, Chaitra Navratri, Ram Navami, Hanuman Jayanti', hi: 'उगादि, गुड़ी पड़वा, नव संवत्सर, चैत्र नवरात्रि, राम नवमी, हनुमान जयंती' }, significance: { en: 'First month of the Hindu year. Chaitra Shukla Pratipada marks the New Year (Vikram Samvat). Named after Chitra nakshatra — the Full Moon falls near Chitra (Spica). Spring harvest season. Considered the most sacred month for new beginnings.', hi: 'हिन्दू वर्ष का प्रथम मास। चैत्र शुक्ल प्रतिपदा नव वर्ष (विक्रम संवत्)। चित्रा नक्षत्र से नामकरण — पूर्णिमा चित्रा के पास। वसंत ऋतु फसल। नई शुरुआत के लिए सबसे पवित्र मास।' } },
  { n: 2, en: 'Vaishakha', hi: 'वैशाख', sa: 'वैशाखः', deity: { en: 'Vishnu (as Madhava)', hi: 'विष्णु (माधव)' }, nakshatra: { en: 'Vishakha', hi: 'विशाखा' }, festivals: { en: 'Akshaya Tritiya, Buddha Purnima, Parashurama Jayanti', hi: 'अक्षय तृतीया, बुद्ध पूर्णिमा, परशुराम जयंती' }, significance: { en: 'Named after Vishakha nakshatra. Akshaya Tritiya — the day when anything started never diminishes (akshaya = inexhaustible). Sacred bathing in Ganga. Peak summer heat begins.', hi: 'विशाखा नक्षत्र से नामकरण। अक्षय तृतीया — इस दिन शुरू किया कार्य कभी क्षय नहीं होता। गंगा स्नान पवित्र।' } },
  { n: 3, en: 'Jyeshtha', hi: 'ज्येष्ठ', sa: 'ज्येष्ठः', deity: { en: 'Vishnu (as Trivikrama)', hi: 'विष्णु (त्रिविक्रम)' }, nakshatra: { en: 'Jyeshtha', hi: 'ज्येष्ठा' }, festivals: { en: 'Ganga Dussehra, Nirjala Ekadashi, Vat Savitri', hi: 'गंगा दशहरा, निर्जला एकादशी, वट सावित्री' }, significance: { en: 'Named after Jyeshtha nakshatra (the "eldest"). Hottest month. Nirjala Ekadashi — fasting without even water, considered equivalent to observing all 24 Ekadashis. Ganga descended to Earth on Ganga Dussehra.', hi: 'ज्येष्ठा नक्षत्र से नामकरण ("सबसे बड़ा")। सबसे गर्म मास। निर्जला एकादशी — बिना जल के उपवास।' } },
  { n: 4, en: 'Ashadha', hi: 'आषाढ़', sa: 'आषाढः', deity: { en: 'Vishnu (as Vamana)', hi: 'विष्णु (वामन)' }, nakshatra: { en: 'Purva/Uttara Ashadha', hi: 'पूर्वा/उत्तरा आषाढ़ा' }, festivals: { en: 'Guru Purnima (Vyasa Purnima), Jagannath Rath Yatra, Devshayani Ekadashi', hi: 'गुरु पूर्णिमा (व्यास पूर्णिमा), जगन्नाथ रथ यात्रा, देवशयनी एकादशी' }, significance: { en: 'Monsoon arrives. Guru Purnima — honoring the teacher tradition (Vyasa composed the Vedas). Devshayani Ekadashi — Vishnu goes to sleep; no auspicious ceremonies (marriages, griha pravesh) for the next 4 months (Chaturmas). The pause period for spiritual introspection.', hi: 'वर्षा ऋतु आरम्भ। गुरु पूर्णिमा — गुरु परंपरा सम्मान। देवशयनी एकादशी — विष्णु निद्रा; अगले 4 मास (चातुर्मास) शुभ कार्य वर्जित।' } },
  { n: 5, en: 'Shravana', hi: 'श्रावण', sa: 'श्रावणः', deity: { en: 'Vishnu (as Hrishikesha)', hi: 'विष्णु (हृषीकेश)' }, nakshatra: { en: 'Shravana', hi: 'श्रवण' }, festivals: { en: 'Shravan Somvar (Shiva worship every Monday), Nag Panchami, Raksha Bandhan, Kajari Teej', hi: 'श्रावण सोमवार (शिव पूजा), नाग पंचमी, रक्षा बंधन, कजरी तीज' }, significance: { en: 'The holiest month for Shiva worship. Every Monday of Shravan is observed with fasting and Shiva puja. Peak monsoon — rivers overflow, nature is at its lushest. Shravan Somvar attracts the largest temple crowds of the year. Named after Shravana nakshatra (the ear) — the month of LISTENING and learning.', hi: 'शिव पूजा का सबसे पवित्र मास। प्रत्येक सोमवार उपवास और शिव पूजा। चरम वर्षा। श्रवण नक्षत्र (कान) — सुनने और सीखने का मास।' } },
  { n: 6, en: 'Bhadrapada', hi: 'भाद्रपद', sa: 'भाद्रपदः', deity: { en: 'Vishnu (as Padmanabha)', hi: 'विष्णु (पद्मनाभ)' }, nakshatra: { en: 'Purva/Uttara Bhadrapada', hi: 'पूर्वा/उत्तरा भाद्रपद' }, festivals: { en: 'Ganesh Chaturthi, Krishna Janmashtami, Hartalika Teej, Onam, Pitru Paksha (Shraddha fortnight)', hi: 'गणेश चतुर्थी, कृष्ण जन्माष्टमी, हरतालिका तीज, ओणम, पितृ पक्ष (श्राद्ध)' }, significance: { en: 'One of the most festival-dense months. Krishna was born on Bhadrapada Krishna Ashtami. Ganesh Chaturthi — the 10-day Ganesha festival. Pitru Paksha — the fortnight dedicated to honoring ancestors through Shraddha rituals. The Krishna Paksha of Bhadrapada is considered the most important period for ancestral rites.', hi: 'सबसे अधिक त्योहारों वाले मासों में। कृष्ण जन्माष्टमी। गणेश चतुर्थी — 10 दिवसीय गणेश उत्सव। पितृ पक्ष — पूर्वजों के श्राद्ध का पखवाड़ा।' } },
  { n: 7, en: 'Ashvina', hi: 'आश्विन', sa: 'आश्विनः', deity: { en: 'Vishnu (as Damodara)', hi: 'विष्णु (दामोदर)' }, nakshatra: { en: 'Ashvini', hi: 'अश्विनी' }, festivals: { en: 'Sharad Navratri, Dussehra (Vijayadashami), Sharad Purnima', hi: 'शरद नवरात्रि, दशहरा (विजयादशमी), शरद पूर्णिमा' }, significance: { en: 'The great Navratri — 9 nights of Goddess Durga worship culminating in Vijayadashami (victory of good over evil, Rama over Ravana). Sharad Purnima — the brightest Full Moon of the year; Moon is closest to Earth. Kheer is placed under moonlight to absorb healing rays. Post-monsoon clarity.', hi: 'महा नवरात्रि — देवी दुर्गा की 9 रातें, विजयादशमी पर समाप्त। शरद पूर्णिमा — वर्ष की सबसे चमकीली पूर्णिमा।' } },
  { n: 8, en: 'Kartika', hi: 'कार्तिक', sa: 'कार्तिकः', deity: { en: 'Vishnu (as Keshava)', hi: 'विष्णु (केशव)' }, nakshatra: { en: 'Krittika', hi: 'कृत्तिका' }, festivals: { en: 'Diwali, Govardhan Puja, Bhai Dooj, Chhath Puja, Kartik Purnima, Tulsi Vivah, Dev Uthani Ekadashi', hi: 'दीवाली, गोवर्धन पूजा, भाई दूज, छठ पूजा, कार्तिक पूर्णिमा, तुलसी विवाह, देव उठनी एकादशी' }, significance: { en: 'THE festival month — Diwali (Kartika Amavasya) celebrates Rama\'s return to Ayodhya and the victory of light over darkness. Dev Uthani Ekadashi — Vishnu wakes from 4-month sleep; auspicious ceremonies resume. Tulsi Vivah — marriage of Tulsi plant to Vishnu, marks the beginning of wedding season. Kartik snaan (bathing in sacred rivers at dawn) throughout the month.', hi: 'त्योहारों का मास — दीवाली (कार्तिक अमावस्या) राम की अयोध्या वापसी। देव उठनी एकादशी — विष्णु जागते हैं; शुभ कार्य पुनः आरम्भ। तुलसी विवाह — विवाह मौसम आरम्भ।' } },
  { n: 9, en: 'Margashirsha', hi: 'मार्गशीर्ष', sa: 'मार्गशीर्षः', deity: { en: 'Vishnu (as Narayana)', hi: 'विष्णु (नारायण)' }, nakshatra: { en: 'Mrigashira', hi: 'मृगशिरा' }, festivals: { en: 'Gita Jayanti (Bhagavad Gita day), Dattatreya Jayanti, Vivah Panchami', hi: 'गीता जयंती, दत्तात्रेय जयंती, विवाह पंचमी' }, significance: { en: 'Krishna says in the Bhagavad Gita (10.35): "Among months, I am Margashirsha" — making this the most spiritually elevated month. Gita Jayanti on Margashirsha Shukla Ekadashi celebrates the day Krishna spoke the Gita to Arjuna on the battlefield of Kurukshetra. Pleasant winter weather, ideal for spiritual practice.', hi: 'कृष्ण गीता (10.35) में कहते हैं: "मासों में मैं मार्गशीर्ष हूँ" — आध्यात्मिक रूप से सबसे उन्नत मास। गीता जयंती — कुरुक्षेत्र में कृष्ण ने अर्जुन को गीता सुनाई।' } },
  { n: 10, en: 'Pausha', hi: 'पौष', sa: 'पौषः', deity: { en: 'Vishnu (as Govinda)', hi: 'विष्णु (गोविन्द)' }, nakshatra: { en: 'Pushya', hi: 'पुष्य' }, festivals: { en: 'Makar Sankranti / Pongal / Lohri / Uttarayan, Pausha Putrada Ekadashi', hi: 'मकर संक्रांति / पोंगल / लोहड़ी / उत्तरायण, पौष पुत्रदा एकादशी' }, significance: { en: 'Makar Sankranti — the Sun enters Capricorn (Makara), marking the beginning of Uttarayana (northward journey). One of the few Hindu festivals based on the SOLAR calendar (not lunar). Celebrated across India under different names: Pongal (Tamil Nadu), Lohri (Punjab), Bihu (Assam). Sesame and jaggery are traditional foods. Kite flying tradition. The shortest days of the year end.', hi: 'मकर संक्रांति — सूर्य मकर राशि में, उत्तरायण आरम्भ। सौर कैलेंडर पर आधारित (चंद्र नहीं)। पोंगल, लोहड़ी, बिहू — विभिन्न नाम। तिल-गुड़।' } },
  { n: 11, en: 'Magha', hi: 'माघ', sa: 'माघः', deity: { en: 'Vishnu (as Madhusudana)', hi: 'विष्णु (मधुसूदन)' }, nakshatra: { en: 'Magha', hi: 'मघा' }, festivals: { en: 'Vasant Panchami (Saraswati Puja), Maghi Purnima, Ravidas Jayanti', hi: 'वसंत पंचमी (सरस्वती पूजा), माघी पूर्णिमा, रविदास जयंती' }, significance: { en: 'Vasant Panchami — Goddess Saraswati is worshipped; children are initiated into learning (Vidyarambham). Yellow is worn to celebrate spring\'s arrival. Magha snaan — bathing in Triveni Sangam (Prayagraj) during Magha is considered extremely meritorious. Kumbh Mela holy dips occur in Magha. The month when spring begins to assert itself.', hi: 'वसंत पंचमी — सरस्वती पूजा; बच्चों की विद्यारम्भम। पीला रंग पहनें। माघ स्नान — प्रयागराज त्रिवेणी संगम में स्नान अत्यंत पुण्यदायी। कुम्भ मेला।' } },
  { n: 12, en: 'Phalguna', hi: 'फाल्गुन', sa: 'फाल्गुनः', deity: { en: 'Vishnu (as Narasimha)', hi: 'विष्णु (नरसिंह)' }, nakshatra: { en: 'Purva/Uttara Phalguni', hi: 'पूर्वा/उत्तरा फाल्गुनी' }, festivals: { en: 'Maha Shivaratri, Holi (Phalguna Purnima), Holika Dahan', hi: 'महा शिवरात्रि, होली (फाल्गुन पूर्णिमा), होलिका दहन' }, significance: { en: 'Maha Shivaratri — the "Great Night of Shiva," all-night vigil and worship. Holi — the festival of colors on Phalguna Purnima, celebrating the burning of Holika and the triumph of devotion (Prahlada). The last month of the Hindu year. Spring is in full bloom. Named after Phalguni nakshatras. Marks the end of winter and the completion of the annual cycle.', hi: 'महा शिवरात्रि — शिव की महान रात्रि, रात्रि जागरण। होली — फाल्गुन पूर्णिमा पर रंगों का त्योहार। हिन्दू वर्ष का अंतिम मास।' } },
];

export default function MasaPage() {
  const locale = useLocale() as Locale;
  const isHi = locale !== 'en';
  const hf = isHi ? { fontFamily: 'var(--font-devanagari-heading)' } : { fontFamily: 'var(--font-heading)' };

  const currentYear = new Date().getFullYear();
  const hinduMonths = useMemo(() => computeHinduMonths(currentYear), [currentYear]);

  return (
    <div className="space-y-10">
      <div>
        <h2 className="text-3xl font-bold text-gold-gradient mb-3" style={hf}>
          {isHi ? 'मास — हिन्दू चान्द्र मास' : 'Masa — The Hindu Lunar Months'}
        </h2>
        <p className="text-text-secondary text-sm leading-relaxed max-w-3xl">
          {isHi
            ? 'हिन्दू कैलेंडर चंद्रमा पर आधारित है — प्रत्येक मास अमावस्या (नवचंद्र) से अगली अमावस्या तक ~29.5 दिन का होता है। 12 चान्द्र मास मिलकर ~354 दिन बनाते हैं — सौर वर्ष (365.25 दिन) से ~11 दिन कम। इस अंतर को पूरा करने के लिए हर ~33 मास में एक "अधिक मास" (intercalary month) जोड़ा जाता है।'
            : 'The Hindu calendar is lunar — each month runs from one Amavasya (New Moon) to the next, spanning ~29.5 days. Twelve lunar months total ~354 days — about 11 days short of a solar year (365.25 days). To reconcile this, an "Adhika Masa" (intercalary month) is inserted every ~33 months.'}
        </p>
      </div>

      {/* Two Systems */}
      <div className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-2xl p-6">
        <h3 className="text-gold-light font-bold text-lg mb-4" style={hf}>
          {isHi ? 'दो प्रणालियाँ — अमान्त और पूर्णिमान्त' : 'Two Systems — Amant and Purnimant'}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div className="p-4 rounded-xl bg-blue-500/5 border border-blue-500/15">
            <div className="text-blue-300 font-bold text-sm mb-2">{isHi ? 'अमान्त (अमावस्यान्त)' : 'Amant (Amanta)'}</div>
            <p className="text-text-secondary text-xs leading-relaxed">{isHi
              ? 'मास अमावस्या (नवचंद्र) पर समाप्त होता है। दक्षिण भारत (गुजरात, महाराष्ट्र, आंध्र, कर्नाटक, तमिलनाडु) में प्रचलित। भारत सरकार का आधिकारिक मानक (1956 कैलेंडर सुधार)।'
              : 'Month ends on Amavasya (New Moon). Used in South & West India (Gujarat, Maharashtra, Andhra, Karnataka, Tamil Nadu). Official standard of the Indian Government (1956 Calendar Reform).'}</p>
          </div>
          <div className="p-4 rounded-xl bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-amber-500/15">
            <div className="text-amber-400 font-bold text-sm mb-2">{isHi ? 'पूर्णिमान्त' : 'Purnimant'}</div>
            <p className="text-text-secondary text-xs leading-relaxed">{isHi
              ? 'मास पूर्णिमा (पूर्ण चंद्र) पर समाप्त होता है। उत्तर भारत (उत्तर प्रदेश, बिहार, राजस्थान, मध्य प्रदेश) में प्रचलित। एक ही चंद्र मास को अमान्त और पूर्णिमान्त में अलग नाम मिल सकता है।'
              : 'Month ends on Purnima (Full Moon). Used in North India (UP, Bihar, Rajasthan, MP). The same lunar month can have different names in Amant vs Purnimant — the Purnimant month is named one month ahead.'}</p>
          </div>
        </div>

        {/* Visual diagram */}
        <svg viewBox="0 0 600 120" className="w-full max-w-2xl mx-auto">
          {/* Amant line */}
          <line x1="50" y1="35" x2="550" y2="35" stroke="#4a9eff" strokeWidth="2" opacity="0.4" />
          <text x="30" y="20" fill="#4a9eff" fontSize="9" fontWeight="bold">Amant</text>
          {/* Amant month boundaries (New Moons) */}
          {[50, 200, 350, 500].map((x, i) => (
            <g key={`a${i}`}>
              <circle cx={x} cy={35} r={4} fill="#4a9eff" />
              <text x={x} y={55} textAnchor="middle" fill="#4a9eff" fontSize="7" opacity="0.6">{['Amavasya', 'Amavasya', 'Amavasya', 'Amavasya'][i]}</text>
            </g>
          ))}
          <text x={125} y={30} textAnchor="middle" fill="#4a9eff" fontSize="9" fontWeight="bold">Chaitra</text>
          <text x={275} y={30} textAnchor="middle" fill="#4a9eff" fontSize="9" fontWeight="bold">Vaishakha</text>
          <text x={425} y={30} textAnchor="middle" fill="#4a9eff" fontSize="9" fontWeight="bold">Jyeshtha</text>

          {/* Purnimant line */}
          <line x1="50" y1="90" x2="550" y2="90" stroke="#f0d48a" strokeWidth="2" opacity="0.4" />
          <text x="20" y="78" fill="#f0d48a" fontSize="9" fontWeight="bold">Purnimant</text>
          {/* Purnimant boundaries (Full Moons) — offset ~15 days */}
          {[125, 275, 425].map((x, i) => (
            <g key={`p${i}`}>
              <circle cx={x} cy={90} r={4} fill="#f0d48a" />
              <text x={x} y={110} textAnchor="middle" fill="#f0d48a" fontSize="7" opacity="0.6">Purnima</text>
            </g>
          ))}
          <text x={200} y={85} textAnchor="middle" fill="#f0d48a" fontSize="9" fontWeight="bold">Chaitra</text>
          <text x={350} y={85} textAnchor="middle" fill="#f0d48a" fontSize="9" fontWeight="bold">Vaishakha</text>

          {/* Connecting arrows showing offset */}
          <line x1="125" y1="40" x2="125" y2="85" stroke="#ff6b6b" strokeWidth="0.5" strokeDasharray="3 2" />
          <text x="135" y="65" fill="#ff6b6b" fontSize="7">~15d offset</text>
        </svg>
      </div>

      {/* Adhika Masa */}
      <div className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-2xl p-6 border border-violet-500/20 bg-gradient-to-br from-violet-500/5 to-transparent">
        <h3 className="text-violet-400 font-bold text-lg mb-4" style={hf}>
          {isHi ? 'अधिक मास (मलमास / पुरुषोत्तम मास)' : 'Adhika Masa (Intercalary Month)'}
        </h3>
        <div className="space-y-3 text-text-secondary text-sm leading-relaxed">
          <p>{isHi
            ? '12 चान्द्र मास = ~354 दिन, लेकिन सौर वर्ष = ~365.25 दिन। अंतर = ~11 दिन प्रति वर्ष। 3 वर्ष में ~33 दिन जमा हो जाते हैं — एक पूरे मास के बराबर। इसलिए हर ~33 मास में एक अतिरिक्त मास जोड़ा जाता है।'
            : '12 lunar months = ~354 days, but a solar year = ~365.25 days. Difference = ~11 days per year. Over 3 years, this accumulates to ~33 days — roughly one full month. So an extra month is inserted every ~33 months.'}</p>
          <p><span className="text-violet-300 font-bold">{isHi ? 'कैसे निर्धारित होता है:' : 'How it\'s determined:'}</span> {isHi
            ? 'जब एक चान्द्र मास (अमावस्या से अमावस्या) के दौरान सूर्य कोई संक्रांति (राशि परिवर्तन) नहीं करता, तो वह अधिक मास कहलाता है। सामान्यतः सूर्य हर ~30.44 दिन में एक राशि बदलता है, लेकिन चान्द्र मास ~29.5 दिन का है — कभी-कभी दोनों अमावस्याओं के बीच कोई संक्रांति नहीं होती।'
            : 'When a lunar month (New Moon to New Moon) passes without the Sun making a Sankranti (sign change), that month becomes Adhika. Normally the Sun changes sign every ~30.44 days, but a lunar month is ~29.5 days — sometimes no Sankranti falls between two New Moons.'}</p>
          <p><span className="text-violet-300 font-bold">{isHi ? 'नाम:' : 'Name:'}</span> {isHi
            ? 'अधिक मास उसी नाम से जाना जाता है जो अगले "शुद्ध" (नियमित) मास का है, पर "अधिक" उपसर्ग लगता है। उदाहरण: "अधिक श्रावण" = श्रावण से पहले का अतिरिक्त मास।'
            : 'The Adhika Masa takes the name of the NEXT regular (Shuddha) month with "Adhika" prefix. Example: "Adhika Shravana" = the extra month before regular Shravana.'}</p>
        </div>

        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 rounded-xl bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-red-500/15">
            <div className="text-red-400 text-xs uppercase tracking-widest font-bold mb-1">{isHi ? 'अशुभ — वर्जित कार्य' : 'Inauspicious — Avoided'}</div>
            <p className="text-text-secondary text-xs leading-relaxed">{isHi
              ? 'अधिक मास में विवाह, गृह प्रवेश, मुंडन, नामकरण, उपनयन जैसे शुभ संस्कार वर्जित हैं। इसे "मलमास" (अशुद्ध मास) भी कहते हैं।'
              : 'Marriage, Griha Pravesh, Mundan, Namakarana, Upanayana and other auspicious samskaras are avoided. It\'s also called "Malamasa" (impure month).'}</p>
          </div>
          <div className="p-4 rounded-xl bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-emerald-500/15">
            <div className="text-emerald-400 text-xs uppercase tracking-widest font-bold mb-1">{isHi ? 'शुभ — विशेष पुण्य' : 'Auspicious — Special Merit'}</div>
            <p className="text-text-secondary text-xs leading-relaxed">{isHi
              ? 'पुरुषोत्तम मास (विष्णु का मास) — दान, जप, व्रत, तीर्थ यात्रा का विशेष पुण्य। इस मास में किया गया कोई भी पुण्य कार्य सामान्य से कई गुना फलदायी। भागवत पुराण पठन विशेष शुभ।'
              : 'Also called Purushottam Masa (Vishnu\'s month) — charity, japa, vrat, pilgrimage carry special merit. Any meritorious act during this month yields many times the normal result. Bhagavat Purana reading is especially auspicious.'}</p>
          </div>
        </div>

        <div className="mt-4 p-3 rounded-xl bg-violet-500/5 border border-violet-500/15">
          <div className="text-violet-300 text-xs">
            <span className="font-bold">{isHi ? '💡 गणित:' : '💡 The Math:'}</span> {isHi
              ? ' 19 सौर वर्षों में 235 चान्द्र मास = 7 अधिक मास। यह मेटोनिक चक्र है — 19 वर्ष बाद चंद्र कलाएं लगभग उन्हीं तिथियों पर पुनरावृत्त होती हैं। भारतीय और ग्रीक खगोलशास्त्रियों ने इसे स्वतंत्र रूप से खोजा।'
              : ' In 19 solar years there are 235 lunar months = exactly 7 Adhika Masas. This is the Metonic Cycle — after 19 years, lunar phases repeat on nearly the same dates. Discovered independently by Indian and Greek astronomers.'}
          </div>
        </div>
      </div>

      {/* Month naming — why are they named this way */}
      <div className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-2xl p-6">
        <h3 className="text-gold-light font-bold text-lg mb-4" style={hf}>
          {isHi ? 'मासों के नाम क्यों?' : 'Why Are Months Named This Way?'}
        </h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-4">{isHi
          ? 'प्रत्येक हिन्दू मास का नाम उस नक्षत्र से है जिसमें पूर्णिमा (पूर्ण चंद्र) आती है। चैत्र मास की पूर्णिमा चित्रा नक्षत्र के पास होती है, वैशाख की विशाखा के पास, इत्यादि। यह नक्षत्र-आधारित नामकरण चंद्रमा की स्थिति को मास से सीधे जोड़ता है।'
          : 'Each Hindu month is named after the Nakshatra near which the Full Moon (Purnima) falls. Chaitra\'s Full Moon is near Chitra nakshatra, Vaishakha\'s near Vishakha, and so on. This nakshatra-based naming directly links the Moon\'s position to the month identity.'}</p>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead><tr className="border-b border-gold-primary/15">
              <th className="text-left py-2 px-2 text-gold-dark">{isHi ? 'मास' : 'Month'}</th>
              <th className="text-left py-2 px-2 text-gold-dark">{isHi ? 'पूर्णिमा नक्षत्र' : 'Purnima Nakshatra'}</th>
              <th className="text-left py-2 px-2 text-gold-dark">{isHi ? 'अधिदेवता (विष्णु रूप)' : 'Presiding Deity (Vishnu Form)'}</th>
            </tr></thead>
            <tbody className="divide-y divide-gold-primary/5">
              {MONTHS_DETAIL.map(m => (
                <tr key={m.n} className="hover:bg-gold-primary/3">
                  <td className="py-1.5 px-2 text-gold-light font-medium" style={hf}>{isHi ? m.hi : m.en}</td>
                  <td className="py-1.5 px-2 text-text-secondary">{isHi ? m.nakshatra.hi : m.nakshatra.en}</td>
                  <td className="py-1.5 px-2 text-text-secondary">{isHi ? m.deity.hi : m.deity.en}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Exact dates for current year */}
      <div className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-2xl p-6">
        <h3 className="text-gold-light font-bold text-lg mb-4" style={hf}>
          {isHi ? `${currentYear} की सटीक तिथियाँ` : `Exact Dates for ${currentYear}`}
        </h3>
        <p className="text-text-secondary text-xs mb-3">
          {isHi ? 'वास्तविक अमावस्या (नवचंद्र) स्थितियों से गणित' : 'Computed from actual New Moon (Amavasya) positions'}
        </p>
        {hinduMonths.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead><tr className="border-b border-gold-primary/15">
                <th className="text-left py-2 px-2 text-gold-dark">#</th>
                <th className="text-left py-2 px-2 text-gold-dark">{isHi ? 'मास' : 'Month'}</th>
                <th className="text-left py-2 px-2 text-gold-dark">{isHi ? 'आरम्भ' : 'Start'}</th>
                <th className="text-left py-2 px-2 text-gold-dark">{isHi ? 'समाप्ति' : 'End'}</th>
                <th className="text-left py-2 px-2 text-gold-dark">{isHi ? 'दिन' : 'Days'}</th>
              </tr></thead>
              <tbody className="divide-y divide-gold-primary/5">
                {hinduMonths.map(m => {
                  const start = new Date(m.startDate);
                  const end = new Date(m.endDate);
                  const days = Math.round((end.getTime() - start.getTime()) / 86400000);
                  const todayStr = `${new Date().getFullYear()}-${(new Date().getMonth()+1).toString().padStart(2,'0')}-${new Date().getDate().toString().padStart(2,'0')}`;
                  const isCurrent = todayStr >= m.startDate && todayStr < m.endDate;
                  return (
                    <tr key={`${m.n}-${m.startDate}`} className={`hover:bg-gold-primary/3 ${isCurrent ? 'bg-gold-primary/8' : ''} ${m.isAdhika ? 'italic' : ''}`}>
                      <td className="py-1.5 px-2 text-text-tertiary">{m.n}</td>
                      <td className="py-1.5 px-2 font-medium" style={hf}>
                        <span className={m.isAdhika ? 'text-violet-400' : 'text-gold-light'}>{isHi ? m.hi : m.en}</span>
                        {isCurrent && <span className="ml-1 text-xs px-1 py-0.5 rounded bg-gold-primary/20 text-gold-primary not-italic">{isHi ? 'अभी' : 'NOW'}</span>}
                      </td>
                      <td className="py-1.5 px-2 text-text-secondary font-mono">{formatMonthDate(m.startDate, locale)}</td>
                      <td className="py-1.5 px-2 text-text-secondary font-mono">{formatMonthDate(m.endDate, locale)}</td>
                      <td className="py-1.5 px-2 text-text-tertiary">{days}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-text-tertiary text-xs">{isHi ? 'गणना हो रही है...' : 'Computing...'}</p>
        )}
      </div>

      {/* Detailed month cards */}
      <div>
        <h3 className="text-gold-gradient font-bold text-xl mb-4" style={hf}>
          {isHi ? '12 मासों का विस्तृत वर्णन' : 'Detailed Description of All 12 Months'}
        </h3>
        <div className="space-y-4">
          {MONTHS_DETAIL.map((m, i) => (
            <motion.div key={m.n} initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-2xl p-5">
              <div className="flex items-start gap-4 mb-3">
                <div className="w-10 h-10 rounded-full bg-gold-primary/10 border border-gold-primary/20 flex items-center justify-center text-gold-primary font-bold text-sm shrink-0">{m.n}</div>
                <div>
                  <div className="text-gold-light font-bold text-lg" style={hf}>{isHi ? m.hi : m.en} <span className="text-text-tertiary text-xs font-normal" style={{ fontFamily: 'var(--font-devanagari-body)' }}>({m.sa})</span></div>
                  <div className="text-text-tertiary text-xs">{isHi ? m.nakshatra.hi : m.nakshatra.en} {isHi ? 'नक्षत्र से नामकरण' : 'nakshatra based naming'} · {isHi ? m.deity.hi : m.deity.en}</div>
                </div>
              </div>
              <p className="text-text-secondary text-xs leading-relaxed mb-3">{isHi ? m.significance.hi : m.significance.en}</p>
              <div className="p-3 rounded-xl bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-amber-500/15">
                <div className="text-amber-400 text-xs uppercase tracking-widest font-bold mb-1">{isHi ? 'प्रमुख त्योहार' : 'Key Festivals'}</div>
                <div className="text-text-secondary text-xs">{isHi ? m.festivals.hi : m.festivals.en}</div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Six Ritus */}
      <div className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-2xl p-6">
        <h3 className="text-gold-light font-bold text-lg mb-4" style={hf}>
          {isHi ? 'षड् ऋतु — छह ऋतुएं' : 'Shad Ritu — The Six Seasons'}
        </h3>
        <p className="text-text-secondary text-xs mb-4 leading-relaxed">{isHi
          ? 'भारतीय कैलेंडर 6 ऋतुओं को मान्यता देता है (पश्चिमी 4 के विपरीत)। प्रत्येक ऋतु 2 मासों की होती है।'
          : 'The Indian calendar recognizes 6 seasons (unlike the Western 4). Each Ritu spans 2 months.'}</p>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {[
            { en: 'Vasanta (Spring)', hi: 'वसन्त', months: 'Chaitra–Vaishakha', color: 'text-emerald-400 border-emerald-500/20 bg-emerald-500/5', desc: { en: 'New growth, harvest, New Year', hi: 'नई वृद्धि, फसल, नव वर्ष' } },
            { en: 'Grishma (Summer)', hi: 'ग्रीष्म', months: 'Jyeshtha–Ashadha', color: 'text-amber-400 border-amber-500/20 bg-amber-500/5', desc: { en: 'Peak heat, mangoes, water scarcity', hi: 'चरम गर्मी, आम, जल अभाव' } },
            { en: 'Varsha (Monsoon)', hi: 'वर्षा', months: 'Shravana–Bhadrapada', color: 'text-blue-400 border-blue-500/20 bg-blue-500/5', desc: { en: 'Rains, revival of rivers, Chaturmas', hi: 'वर्षा, नदियों का पुनर्जीवन, चातुर्मास' } },
            { en: 'Sharad (Autumn)', hi: 'शरद्', months: 'Ashvina–Kartika', color: 'text-gold-light border-gold-primary/20 bg-gold-primary/5', desc: { en: 'Clear skies, Navratri, Diwali', hi: 'स्वच्छ आकाश, नवरात्रि, दीवाली' } },
            { en: 'Hemanta (Pre-Winter)', hi: 'हेमन्त', months: 'Margashirsha–Pausha', color: 'text-sky-300 border-sky-500/20 bg-sky-500/5', desc: { en: 'Cool, pleasant, Sankranti', hi: 'शीतल, सुखद, संक्रांति' } },
            { en: 'Shishira (Winter)', hi: 'शिशिर', months: 'Magha–Phalguna', color: 'text-indigo-300 border-indigo-500/20 bg-indigo-500/5', desc: { en: 'Cold, dew, Shivaratri, Holi', hi: 'ठंड, ओस, शिवरात्रि, होली' } },
          ].map((r, i) => (
            <div key={i} className={`p-3 rounded-xl border ${r.color}`}>
              <div className={`font-bold text-sm mb-0.5 ${r.color.split(' ')[0]}`}>{isHi ? r.hi : r.en}</div>
              <div className="text-text-tertiary text-xs">{r.months}</div>
              <div className="text-text-secondary text-xs mt-1">{isHi ? r.desc.hi : r.desc.en}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
