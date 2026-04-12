'use client';

import { useState } from 'react';
import { useLocale } from 'next-intl';
import { motion } from 'framer-motion';
import { ExternalLink, BookOpen } from 'lucide-react';
import type { Locale } from '@/types/panchang';
import { isDevanagariLocale } from '@/lib/utils/locale-fonts';

// ─── Data ────────────────────────────────────────────────────────────────────

type Category =
  | 'astronomy'
  | 'natal'
  | 'predictive'
  | 'muhurta'
  | 'prashna'
  | 'kp'
  | 'jaimini'
  | 'nadi';

type License = 'pd' | 'cc0' | 'open';

interface Text {
  name: string;
  nameHi: string;
  author: string;
  year: string;
  category: Category;
  license: License;
  url: string;
  desc: string;
  descHi: string;
}

const TEXTS: Text[] = [
  // ── ASTRONOMY ──────────────────────────────────────────────────────────────
  {
    name: 'Vedanga Jyotisha',
    nameHi: 'वेदांग ज्योतिष',
    author: 'Lagadha',
    year: '~1200 BCE',
    category: 'astronomy',
    license: 'pd',
    url: 'https://archive.org/details/VedangaJyotisa',
    desc: 'The oldest surviving Vedic astronomical text — the origin of Jyotish as a Vedanga. Covers tithi, nakshatra, and ritual timing through solar and lunar positions. 36 verses (Rigvedic recension), 43 verses (Yajurvedic). The root from which the entire tradition grew.',
    descHi: 'सबसे प्राचीन वैदिक ज्योतिष ग्रंथ — वेदांग ज्योतिष की उत्पत्ति। तिथि, नक्षत्र और सौर-चंद्र स्थिति से अनुष्ठान समय की गणना।',
  },
  {
    name: 'Aryabhatiya',
    nameHi: 'आर्यभटीय',
    author: 'Aryabhata I',
    year: '499 CE',
    category: 'astronomy',
    license: 'pd',
    url: 'https://archive.org/details/Aryabhatiya-with-English-commentary',
    desc: 'The earliest surviving complete Indian mathematical-astronomical work, written at age 23 in 121 verses. Covers arithmetic, algebra, trigonometry, and planetary calculation. Introduced the sine table and proposed a rotating Earth. Eclipse calculation methods here directly inform how Vedic software computes Rahu/Ketu.',
    descHi: '121 श्लोकों में संपूर्ण भारतीय गणितीय-खगोलशास्त्र का प्राचीनतम ग्रंथ। त्रिकोणमिति, ग्रह गणना और पृथ्वी के घूर्णन का प्रतिपादन।',
  },
  {
    name: 'Surya Siddhanta',
    nameHi: 'सूर्य सिद्धान्त',
    author: 'Anonymous (trans. Burgess, 1858)',
    year: '~400 CE (Burgess trans. 1858)',
    category: 'astronomy',
    license: 'pd',
    url: 'https://archive.org/details/SuryaSiddhantaTranslation',
    desc: 'The foundational Hindu astronomical treatise. Defines the computational framework for planetary positions, eclipses, ayanamsha, sidereal time, and time cycles (Maha Yuga, Kalpa) that all Hindu calendars follow. Synodic month value is accurate to 0.08 seconds. Burgess\'s 1858 translation with mathematical notes is the standard English reference.',
    descHi: 'हिंदू खगोलशास्त्र का आधारभूत ग्रंथ। ग्रह स्थिति, ग्रहण, अयनांश की गणना प्रणाली। संयुग्मी मास 0.08 सेकंड तक सटीक।',
  },
  {
    name: 'Panchasiddhantika',
    nameHi: 'पञ्चसिद्धान्तिका',
    author: 'Varahamihira (trans. Thibaut & Dvivedi, 1889)',
    year: '~550 CE (trans. 1889)',
    category: 'astronomy',
    license: 'pd',
    url: 'https://archive.org/details/wg1078',
    desc: 'Varahamihira\'s comparative summary of five earlier siddhantas: Surya, Romaka, Paulisa, Vasishtha, and Paitamaha. Essential for understanding the diversity of ancient Indian planetary computation schools and their differing mean-planet tables and eclipse methods. Thibaut\'s 1889 translation is definitively public domain.',
    descHi: 'वराहमिहिर द्वारा पाँच सिद्धान्तों का सार: सूर्य, रोमक, पौलिश, वासिष्ठ, पैतामह। प्राचीन ग्रह गणना पद्धतियों की विविधता का अध्ययन।',
  },
  {
    name: 'Brahmasphutasiddhanta',
    nameHi: 'ब्रह्मस्फुटसिद्धान्त',
    author: 'Brahmagupta',
    year: '628 CE',
    category: 'astronomy',
    license: 'open',
    url: 'https://archive.org/details/Brahmasphutasiddhanta_Vol_1',
    desc: 'The major astronomical text after the Surya Siddhanta. Famous for the first explicit rules of arithmetic with zero and negative numbers. Covers planetary computation, eclipse prediction, and gnomon calculations. Foundational for understanding mean planet positions in the Vedic tradition.',
    descHi: 'सूर्य सिद्धान्त के बाद का प्रमुख खगोलीय ग्रंथ। शून्य और ऋणात्मक संख्याओं के नियम, ग्रह गणना और ग्रहण भविष्यवाणी।',
  },
  // ── NATAL ──────────────────────────────────────────────────────────────────
  {
    name: 'Brihat Parashara Hora Shastra',
    nameHi: 'बृहत् पाराशर होरा शास्त्र',
    author: 'Maharishi Parashara (trans. Santhanam)',
    year: '~7th–8th c. CE',
    category: 'natal',
    license: 'open',
    url: 'https://archive.org/details/BPHSEnglish',
    desc: 'The single most important text in Vedic astrology. Covers rashi significations, planetary karakatvas, house lordships, the complete yoga catalog, Vimshottari dasha, ashtakavarga, all 16 divisional charts (D1–D60), and remedial measures. Everything taught in modern Jyotish either derives from or is cross-referenced against this text. Santhanam\'s two-volume English translation is the standard.',
    descHi: 'वैदिक ज्योतिष का सर्वाधिक महत्वपूर्ण ग्रंथ। राशि, ग्रह, भाव, योग, विंशोत्तरी दशा, अष्टकवर्ग, सभी 16 वर्ग चार्ट और उपाय।',
  },
  {
    name: 'Brihat Jataka',
    nameHi: 'बृहत् जातक',
    author: 'Varahamihira (trans. Suryanarain Rao, 1905)',
    year: '~580 CE (trans. 1905)',
    category: 'natal',
    license: 'pd',
    url: 'https://archive.org/details/BrihatJatakaOfVarahamihiraBySwamiVijnananda',
    desc: 'The most authoritative pre-medieval natal astrology text, written with mathematical precision by the author of the Panchasiddhantika. Covers planetary natures, house meanings, planetary conjunctions, shadbala (planetary strength), longevity calculation (ayurdaya), and female horoscopy. More concise and technically rigorous than BPHS; used as a check against it.',
    descHi: 'पूर्व-मध्यकालीन जन्म ज्योतिष का सर्वाधिक प्रामाणिक ग्रंथ। षड्बल, आयुर्दाय, स्त्री जातक और ग्रह योग।',
  },
  {
    name: 'Brihat Samhita',
    nameHi: 'बृहत् संहिता',
    author: 'Varahamihira (trans. Subrahmanya Sastri, 1946)',
    year: '~550 CE',
    category: 'natal',
    license: 'open',
    url: 'https://archive.org/details/varahamihira-brihat-samhita-panditabhushana-v-subrahmanya-sastri-1946-with-english-ocr-layer',
    desc: 'A vast encyclopedic work covering mundane astrology (political predictions from planetary transits), eclipse interpretation, nakshatra character, weather, omens, and architecture. Essential for understanding the broader Vedic worldview in which Jyotish is embedded. The OCR version on archive.org is fully searchable.',
    descHi: 'वराहमिहिर का विश्वकोशीय ग्रंथ। राजनीतिक ज्योतिष, ग्रहण व्याख्या, नक्षत्र गुण, वास्तु और मौसम भविष्यवाणी।',
  },
  {
    name: 'Saravali',
    nameHi: 'सारावली',
    author: 'Kalyana Varma (trans. Santhanam)',
    year: '~800 CE',
    category: 'natal',
    license: 'open',
    url: 'https://archive.org/details/KalyanaVarmasSaravali',
    desc: 'A comprehensive natal chart text covering planetary effects in each of the 12 houses, wealth and poverty combinations, longevity, and character readings. Fills many interpretive gaps in BPHS with explicit sloka-by-sloka results for planetary placements. Second only to BPHS in practical interpretive utility for house lords and combinations.',
    descHi: 'प्रत्येक भाव में ग्रह प्रभाव, धन-दारिद्र्य और आयु का विस्तृत विवरण। BPHS के बाद सर्वाधिक प्रयुक्त व्याख्यात्मक ग्रंथ।',
  },
  {
    name: 'Phaladeepika',
    nameHi: 'फलदीपिका',
    author: 'Mantreshwara (trans. Subrahmanya Sastri, 1950)',
    year: '~16th c. CE',
    category: 'natal',
    license: 'open',
    url: 'https://archive.org/details/Phaladeepika2ndEd.1950ByVSubrahmanyaSastri',
    desc: 'A highly respected predictive text covering planetary states (combustion, retrogression, exaltation), dasha results, yogas, and house results in a concise format. Popular in South Indian Jyotish practice. Includes original Sanskrit slokas. Widely used as a practitioner\'s day-to-day reference alongside BPHS.',
    descHi: 'ग्रह स्थितियाँ, दशा फल, योग और भाव फलों का संक्षिप्त एवं व्यावहारिक विवेचन। दक्षिण भारतीय ज्योतिष में विशेष लोकप्रिय।',
  },
  {
    name: 'Jataka Parijata',
    nameHi: 'जातक परिजात',
    author: 'Vaidyanatha Dikshita (trans. Subrahmanya Sastri, 1932)',
    year: '~1425 CE (trans. 1932)',
    category: 'natal',
    license: 'open',
    url: 'https://archive.org/details/JatakaParijataVolIOfIIByVSubrahmanyaSastri',
    desc: 'An exhaustive three-volume work covering ayurdaya (longevity calculation), the complete yoga catalog, house meanings, Vimshottari dasha, ashtakavarga, and female horoscopy. One of the most technically complete classical texts, with worked examples and comparative notes. Essential for deep-level natal analysis.',
    descHi: 'तीन खंडों में आयुर्दाय, योग, भाव फल, विंशोत्तरी दशा और अष्टकवर्ग का विस्तृत विवेचन। गहन जन्मपत्री विश्लेषण के लिए अनिवार्य।',
  },
  {
    name: 'Sarvartha Chintamani',
    nameHi: 'सर्वार्थ चिन्तामणि',
    author: 'Venkatesa Sarma (trans. Suryanarain Rao, 1899)',
    year: '~13th c. CE (trans. 1899)',
    category: 'natal',
    license: 'pd',
    url: 'https://archive.org/details/Astrology_Books_by_B_Suryanarayana_Row',
    desc: 'One of the most cited classical texts on planetary yogas. An extremely detailed catalog of rajayogas, dhana yogas, and negative combinations — over 2,000 slokas covering almost every possible planetary combination. Rao\'s 1899 translation is definitively public domain and remains the standard English version.',
    descHi: '2,000 से अधिक श्लोकों में राजयोग, धन योग और दुष्ट योगों का विस्तृत वर्गीकरण। ग्रह योग पहचान का प्रमुख संदर्भ ग्रंथ।',
  },
  {
    name: 'Bhavartha Ratnakara',
    nameHi: 'भावार्थ रत्नाकर',
    author: 'Ramanujacharya (trans. B.V. Raman)',
    year: 'Traditional',
    category: 'natal',
    license: 'open',
    url: 'https://archive.org/details/BhavarthaRatnakaraByBVRaman',
    desc: 'Organised by bhava (house), giving sloka-by-sloka planetary combinations for each house\'s significations. Exceptionally practical — used by astrologers as a quick reference for house lord combinations and inter-house relationships. B.V. Raman\'s translation is clear and accessible even for beginners.',
    descHi: 'भाव-आधारित संरचना में ग्रह संयोगों का श्लोकशः विवरण। भाव स्वामी संयोगों के त्वरित संदर्भ के लिए उत्तम।',
  },
  {
    name: 'Chamatkar Chintamani',
    nameHi: 'चमत्कार चिन्तामणि',
    author: 'Bhatta Narayana',
    year: 'Traditional',
    category: 'natal',
    license: 'open',
    url: 'https://archive.org/details/chamatkar-chintamani-of-bhatta-narayana-pdf',
    desc: 'A concise text giving specific results of each planet placed in each of the 12 rashis, written in a direct, aphoristic style popular among practitioners. Widely used as a quick reference for rashi-based planetary interpretation. Compact enough to be memorised; direct enough to be immediately applied.',
    descHi: 'प्रत्येक राशि में ग्रह फल का सूत्रात्मक विवेचन। अभ्यास में तत्काल प्रयोगनीय, ज्योतिषियों में अत्यंत लोकप्रिय।',
  },
  {
    name: 'Hora Sara',
    nameHi: 'होरा सार',
    author: 'Prithuyasas (trans. Santhanam)',
    year: '~6th c. CE',
    category: 'natal',
    license: 'open',
    url: 'https://archive.org/details/HoraSaraRSanthanamEng',
    desc: 'A 1,209-sloka natal astrology text by the son of Varahamihira, bridging the style of Varahamihira and the later BPHS tradition. Covers planetary natures, house results, and yogas. Historically significant as one of the earliest post-Varahamihira texts and evidence of how the tradition evolved.',
    descHi: '1,209 श्लोकों में जन्म ज्योतिष — वराहमिहिर-पुत्र का ग्रंथ। BPHS परम्परा और वराहमिहिर के बीच सेतु।',
  },
  // ── PREDICTIVE / DASHA ─────────────────────────────────────────────────────
  {
    name: 'Laghu Parashari (Jataka Chandrika)',
    nameHi: 'लघु पाराशरी',
    author: 'Parashara school (trans. O.P. Verma)',
    year: 'Traditional',
    category: 'predictive',
    license: 'open',
    url: 'https://archive.org/details/LaghuParashariOPVerma',
    desc: 'The essential short text focused exclusively on Vimshottari dasha interpretation — house lord results during maha dasha and antardasha sequences. More compact and immediately applicable than the full BPHS dasha chapters. The standard starter text for learning Vimshottari timing; most practitioners memorise its core slokas.',
    descHi: 'विंशोत्तरी दशा व्याख्या का आवश्यक लघु ग्रंथ। महादशा और अंतर्दशा में भाव स्वामी फलों का सटीक विवेचन।',
  },
  {
    name: 'Uttara Kalamrita',
    nameHi: 'उत्तर कालामृत',
    author: 'Kalidasa (trans. Subrahmanya Sastri)',
    year: 'Traditional',
    category: 'predictive',
    license: 'open',
    url: 'https://archive.org/details/uttkalamrita-kalidas-ps-sastri',
    desc: 'Covers karakas (planetary significators) and their role in dasha interpretation; also house meanings and yogas. The Karakamsha (navamsha of the atmakaraka) is elaborated in detail here. Widely cited in Jaimini discussions due to overlapping karakatva concepts. Essential for understanding significator-based timing.',
    descHi: 'ग्रह कारकत्व और दशा व्याख्या में उनकी भूमिका। करकांश का विस्तृत विवेचन — जैमिनी पद्धति के लिए आवश्यक।',
  },
  {
    name: 'Deva Keralam / Chandra Kala Nadi (3 vols.)',
    nameHi: 'देव केरलम् / चन्द्र कला नाडी',
    author: 'Achyuta & Venkatesa (trans. Santhanam)',
    year: 'Traditional Kerala',
    category: 'predictive',
    license: 'open',
    url: 'https://archive.org/details/deva-keralam-1-chandrakala-nadi_202309',
    desc: '9,181 slokas, fully translated in three volumes. Organised by Moon-sign and nakshatra, giving specific predictions for planetary combinations. Uses transit triggers over natal positions for event timing — a distinct methodology from Vimshottari dasha. One of the most important Nadi predictive texts for detailed life-event timing.',
    descHi: '9,181 श्लोकों में चन्द्र राशि और नक्षत्र आधारित विस्तृत भविष्यवाणी। केरल नाडी पद्धति का प्रमुख ग्रंथ।',
  },
  // ── JAIMINI ────────────────────────────────────────────────────────────────
  {
    name: 'Jaimini Sutras',
    nameHi: 'जैमिनि सूत्र',
    author: 'Maharishi Jaimini (trans. Suryanarain Rao, 1902)',
    year: 'Ancient (trans. 1902)',
    category: 'jaimini',
    license: 'pd',
    url: 'https://archive.org/details/in.ernet.dli.2015.486584',
    desc: 'The foundational text of the Jaimini system — the second major classical Vedic astrology tradition. Covers Chara Karakas (planetary significators that rotate each chart), Chara Dashas (time periods based on signs), Argala (planetary intervention), Arudha padas, and Karakamsha interpretation. All Jaimini features derive from these sutras.',
    descHi: 'जैमिनी पद्धति का मूल ग्रंथ। चर कारक, चर दशा, अर्गला, आरूढ़ पद और करकांश — सभी जैमिनी सुविधाएं इसी से उद्भूत।',
  },
  // ── MUHURTA ────────────────────────────────────────────────────────────────
  {
    name: 'Muhurta Chintamani',
    nameHi: 'मुहूर्त चिन्तामणि',
    author: 'Rama Daivagya',
    year: '~1600 CE',
    category: 'muhurta',
    license: 'open',
    url: 'https://archive.org/details/muhurta-chintamani-kedar-datt-joshi',
    desc: 'The standard classical reference for Muhurta — selection of auspicious times. Covers nakshatra qualifications for each type of activity, tithi suitability, vara and hora selection, Panchaka dosha, and activity-specific rules for weddings, travel, surgery, business opening, and more. Written at Kashi (~1600 CE). All Muhurta AI scoring rules derive from this text.',
    descHi: 'मुहूर्त शास्त्र का मानक ग्रंथ। नक्षत्र योग्यता, तिथि, वार, होरा और विशेष कार्यों के नियम। विवाह, यात्रा, व्यापार सभी के लिए।',
  },
  {
    name: 'Muhurtha or Electional Astrology',
    nameHi: 'मुहूर्त एवं निर्वाचन ज्योतिष',
    author: 'B.V. Raman',
    year: '1942',
    category: 'muhurta',
    license: 'open',
    url: 'https://archive.org/details/in.ernet.dli.2015.128092',
    desc: 'A practical English-language synthesis of classical Muhurta principles covering nakshatras, tithis, yogas, and specific event elections (marriage, travel, building construction, etc.). More accessible than the Sanskrit originals. Raman synthesises multiple classical sources and resolves their contradictions for modern practitioners.',
    descHi: 'अंग्रेजी में मुहूर्त सिद्धांतों का व्यावहारिक संश्लेषण। विवाह, यात्रा, निर्माण आदि के लिए सुगम मार्गदर्शन।',
  },
  // ── PRASHNA ────────────────────────────────────────────────────────────────
  {
    name: 'Prasna Marga (2 vols.)',
    nameHi: 'प्रश्न मार्ग',
    author: 'Kerala tradition (trans. B.V. Raman)',
    year: '~16th–17th c. CE',
    category: 'prashna',
    license: 'open',
    url: 'https://archive.org/details/PrasnaMargaBVR',
    desc: 'The most comprehensive classical text on Prashna (horary) astrology, from the Kerala tradition. Covers Prashna chart casting, Arudha lagna, Prana/Deha/Mrityu lords, omens (Shakuna), lost articles, illness, travel, and death timing. Two large volumes with the original Malayalam-Sanskrit text and extensive commentary.',
    descHi: 'केरल परम्परा का होरारी ज्योतिष का सर्वाधिक व्यापक ग्रंथ। प्रश्न कुण्डली, आरूढ़ लग्न, शकुन और रोग-मृत्यु काल निर्धारण।',
  },
  {
    name: 'Prasna Tantra',
    nameHi: 'प्रश्न तन्त्र',
    author: 'B.V. Raman',
    year: '1952',
    category: 'prashna',
    license: 'cc0',
    url: 'https://archive.org/details/UJrg_prasna-tantra-by-b.-v.-raman-raman-publication',
    desc: 'Raman\'s systematic treatment of horary astrology covering Prashna chart casting, house significators, and event timing. More systematic than Prasna Marga for modern practitioners. CC0 public domain dedication makes this the legally cleanest modern text in the collection.',
    descHi: 'होरारी ज्योतिष का व्यवस्थित विवेचन। प्रश्न कुण्डली, भाव कारक और घटना काल — CC0 लाइसेंस।',
  },
  {
    name: 'Chappanna (Prasna Shastra)',
    nameHi: 'चप्पन्ना / प्रश्न शास्त्र',
    author: 'B. Suryanarain Rao',
    year: '1946',
    category: 'prashna',
    license: 'open',
    url: 'https://archive.org/details/ChappannaOrPrasanaSastraBSuryanarainRao1946Text',
    desc: 'A practical horary astrology text covering 56 classical rules for Prashna chart reading. Includes determination of outcome from planetary positions at the moment of a query. Suryanarain Rao was the foremost English translator of Jyotish texts in the early 20th century.',
    descHi: 'प्रश्न कुण्डली पाठन के 56 शास्त्रीय नियम। प्रश्न क्षण की ग्रह स्थिति से फल निर्धारण।',
  },
  // ── KP SYSTEM ──────────────────────────────────────────────────────────────
  {
    name: 'KP Readers I–VI',
    nameHi: 'केपी रीडर्स I–VI',
    author: 'K.S. Krishnamurti',
    year: '1960s',
    category: 'kp',
    license: 'open',
    url: 'https://archive.org/details/kp-readers',
    desc: 'The foundational texts of the Krishnamurti Padhdhati system — the six-volume series covering: (I) casting the horoscope, (II) fundamental principles, (III) predictive stellar astrology, (IV) marriage and children, (V) transits, (VI) horary. The KP system uses Placidus houses, a 249-division sub-lord table, and refined significators for precise event timing.',
    descHi: 'कृष्णमूर्ति पद्धति के छह मूल खंड: कुण्डली निर्माण, मूल सिद्धांत, तारकीय ज्योतिष, विवाह-संतान, गोचर और प्रश्न।',
  },
  {
    name: 'Advanced Stellar Astrology',
    nameHi: 'उन्नत तारकीय ज्योतिष',
    author: 'K.S. Krishnamurti',
    year: '1970s',
    category: 'kp',
    license: 'open',
    url: 'https://archive.org/details/in.ernet.dli.2015.352942',
    desc: 'Supplementary KP text covering advanced applications of the sub-lord system, including medical astrology, finance, and fine-grained event timing. Useful for practitioners who have mastered the six KP Readers and wish to extend the system into specialised domains.',
    descHi: 'उप-स्वामी पद्धति के उन्नत अनुप्रयोग — चिकित्सा ज्योतिष, वित्त और घटना काल का सूक्ष्म निर्धारण।',
  },
  // ── NADI ───────────────────────────────────────────────────────────────────
  {
    name: 'Bhrigu Nandi Nadi',
    nameHi: 'भृगु नन्दी नाडी',
    author: 'R.G. Rao (Bhrigu tradition)',
    year: '1980s',
    category: 'nadi',
    license: 'open',
    url: 'https://archive.org/details/jyotish-bhrigu-nandi-nadi-rg-rao',
    desc: 'Key English-language work on the Bhrigu Nandi Nadi system — prediction based on planetary pairs and their inter-relationships rather than standard house analysis. Uses Jupiter as the primary significator and interprets planetary conjunctions in a manner distinct from classical Parashara. Relevant to the Bhrigu Bindu concept used in this application.',
    descHi: 'भृगु नन्दी नाडी पद्धति — ग्रह युगलों और उनके संबंधों पर आधारित भविष्यवाणी। बृहस्पति प्रमुख कारक।',
  },
  {
    name: 'Brighu Naadi Sangraha',
    nameHi: 'भृगु नाडी संग्रह',
    author: 'N. Srinivasan Shastry',
    year: 'Modern',
    category: 'nadi',
    license: 'open',
    url: 'https://archive.org/details/brighu-naadi-sangraha-n-srinivasan-shastry',
    desc: 'An English compilation of Bhrigu Nadi principles and predictions. Covers the interpretation of planetary position sequences as found in the original Bhrigu leaf manuscripts. Useful alongside the R.G. Rao text for cross-referencing the Bhrigu Nadi tradition.',
    descHi: 'भृगु नाडी ताड़पत्र पाण्डुलिपियों में वर्णित ग्रह स्थिति अनुक्रमों की व्याख्या।',
  },
];

// ─── Config ───────────────────────────────────────────────────────────────────

const CATEGORIES: { key: Category | 'all'; label: string; labelHi: string }[] = [
  { key: 'all',        label: 'All Texts',    labelHi: 'सभी ग्रंथ' },
  { key: 'astronomy',  label: 'Astronomy',    labelHi: 'खगोलशास्त्र' },
  { key: 'natal',      label: 'Natal',        labelHi: 'जन्म कुण्डली' },
  { key: 'predictive', label: 'Predictive',   labelHi: 'भविष्यवाणी' },
  { key: 'jaimini',    label: 'Jaimini',      labelHi: 'जैमिनी' },
  { key: 'muhurta',    label: 'Muhurta',      labelHi: 'मुहूर्त' },
  { key: 'prashna',    label: 'Prashna',      labelHi: 'प्रश्न' },
  { key: 'kp',         label: 'KP System',    labelHi: 'केपी पद्धति' },
  { key: 'nadi',       label: 'Nadi',         labelHi: 'नाडी' },
];

const LICENSE_BADGE: Record<License, { label: string; cls: string }> = {
  pd:   { label: 'Public Domain', cls: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/25' },
  cc0:  { label: 'CC0',           cls: 'bg-blue-500/15 text-blue-300 border-blue-500/25' },
  open: { label: 'Open Access',   cls: 'bg-amber-500/15 text-amber-300 border-amber-500/25' },
};

const CATEGORY_COLOR: Record<Category, string> = {
  astronomy:  'text-amber-400',
  natal:      'text-gold-light',
  predictive: 'text-violet-400',
  jaimini:    'text-cyan-400',
  muhurta:    'text-rose-400',
  prashna:    'text-emerald-400',
  kp:         'text-purple-400',
  nadi:       'text-orange-400',
};

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function LibraryPage() {
  const locale = useLocale() as Locale;
  const isHi = isDevanagariLocale(locale);
  const headingFont = isHi ? { fontFamily: 'var(--font-devanagari-heading)' } : { fontFamily: 'var(--font-heading)' };
  const bodyFont   = isHi ? { fontFamily: 'var(--font-devanagari-body)' } : {};

  const [activeCategory, setActiveCategory] = useState<Category | 'all'>('all');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const filtered = activeCategory === 'all'
    ? TEXTS
    : TEXTS.filter(t => t.category === activeCategory);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-10">
        <div className="flex items-center gap-3 mb-3">
          <BookOpen className="w-7 h-7 text-gold-primary" />
          <h1 className="text-4xl sm:text-5xl font-bold text-gold-gradient" style={headingFont}>
            {isHi ? 'शास्त्रीय ग्रंथागार' : 'Classical Texts Library'}
          </h1>
        </div>
        <p className="text-text-secondary text-base max-w-3xl" style={bodyFont}>
          {isHi
            ? '28 शास्त्रीय ज्योतिष एवं खगोलशास्त्र ग्रंथों का संकलन — सभी archive.org पर निःशुल्क उपलब्ध। नाम पर क्लिक करके पढ़ें या डाउनलोड करें।'
            : '28 classical Vedic astronomy and astrology texts — all free to read and download via archive.org. Click any title to open the source.'}
        </p>
        <div className="mt-4 flex flex-wrap gap-3 text-xs">
          {Object.entries(LICENSE_BADGE).map(([key, b]) => (
            <span key={key} className={`px-2.5 py-1 rounded-full border font-medium ${b.cls}`}>{b.label}</span>
          ))}
          <span className="text-text-secondary self-center">— license classification</span>
        </div>
      </motion.div>

      {/* Category filter */}
      <div className="flex flex-wrap gap-2 mb-8">
        {CATEGORIES.map(cat => (
          <button
            key={cat.key}
            onClick={() => setActiveCategory(cat.key)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors border ${
              activeCategory === cat.key
                ? 'bg-gold-primary/20 border-gold-primary/50 text-gold-light'
                : 'bg-white/3 border-white/10 text-text-secondary hover:border-gold-primary/30 hover:text-text-primary'
            }`}
            style={bodyFont}
          >
            {isHi ? cat.labelHi : cat.label}
            {cat.key !== 'all' && (
              <span className="ml-1.5 opacity-60">
                {TEXTS.filter(t => t.category === cat.key).length}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="rounded-2xl border border-gold-primary/12 overflow-hidden">

        {/* Table header — desktop */}
        <div className="hidden md:grid grid-cols-[2fr_1.4fr_0.8fr_0.9fr_auto] gap-4 px-5 py-3 bg-gold-primary/5 border-b border-gold-primary/10 text-text-secondary text-xs uppercase tracking-wider font-semibold">
          <span>{isHi ? 'ग्रंथ' : 'Text'}</span>
          <span>{isHi ? 'लेखक' : 'Author'}</span>
          <span>{isHi ? 'वर्ष' : 'Year'}</span>
          <span>{isHi ? 'श्रेणी' : 'Category'}</span>
          <span>{isHi ? 'लाइसेंस' : 'License'}</span>
        </div>

        {/* Rows */}
        {filtered.map((text, i) => {
          const badge   = LICENSE_BADGE[text.license];
          const catColor = CATEGORY_COLOR[text.category];
          const catLabel = CATEGORIES.find(c => c.key === text.category);
          const isOpen  = expandedId === `${text.name}-${i}`;

          return (
            <motion.div
              key={`${text.name}-${i}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: i * 0.02 }}
              className="border-b border-gold-primary/8 last:border-0"
            >
              {/* Main row */}
              <div
                className="grid grid-cols-1 md:grid-cols-[2fr_1.4fr_0.8fr_0.9fr_auto] gap-2 md:gap-4 px-5 py-4 hover:bg-gold-primary/4 cursor-pointer transition-colors"
                onClick={() => setExpandedId(isOpen ? null : `${text.name}-${i}`)}
              >
                {/* Name */}
                <div className="flex items-start gap-2 min-w-0">
                  <div className="min-w-0">
                    <a
                      href={text.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gold-light font-semibold text-sm hover:text-gold-primary transition-colors flex items-center gap-1.5 group"
                      style={headingFont}
                      onClick={e => e.stopPropagation()}
                    >
                      {isHi ? text.nameHi : text.name}
                      <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-70 transition-opacity shrink-0" />
                    </a>
                    {isHi && (
                      <p className="text-text-secondary text-xs mt-0.5">{text.name}</p>
                    )}
                    {/* Mobile only: author + year inline */}
                    <p className="md:hidden text-text-secondary text-xs mt-1">{text.author} · {text.year}</p>
                    <div className="md:hidden flex gap-2 mt-1">
                      <span className={`text-xs font-medium ${catColor}`}>{isHi ? catLabel?.labelHi : catLabel?.label}</span>
                      <span className={`text-xs px-1.5 py-0.5 rounded border ${badge.cls}`}>{badge.label}</span>
                    </div>
                  </div>
                </div>

                {/* Author */}
                <div className="hidden md:block text-text-secondary text-sm self-center" style={bodyFont}>
                  {text.author}
                </div>

                {/* Year */}
                <div className="hidden md:block text-text-secondary text-sm self-center font-mono">
                  {text.year}
                </div>

                {/* Category */}
                <div className="hidden md:block self-center">
                  <span className={`text-xs font-semibold ${catColor}`} style={bodyFont}>
                    {isHi ? catLabel?.labelHi : catLabel?.label}
                  </span>
                </div>

                {/* License */}
                <div className="hidden md:flex self-center">
                  <span className={`text-xs px-2 py-0.5 rounded-full border font-medium whitespace-nowrap ${badge.cls}`}>
                    {badge.label}
                  </span>
                </div>
              </div>

              {/* Expanded description */}
              {isOpen && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="px-5 pb-4 bg-gold-primary/3 border-t border-gold-primary/8"
                >
                  <p className="text-text-primary text-sm leading-relaxed pt-3 max-w-3xl" style={bodyFont}>
                    {isHi ? text.descHi : text.desc}
                  </p>
                  <a
                    href={text.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 mt-3 text-gold-primary text-xs font-semibold hover:text-gold-light transition-colors"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    {isHi ? 'archive.org पर खोलें / डाउनलोड करें' : 'Open on archive.org / Download'}
                  </a>
                </motion.div>
              )}
            </motion.div>
          );
        })}
      </div>

      {/* Footer note */}
      <div className="mt-6 rounded-xl bg-gold-primary/5 border border-gold-primary/10 px-5 py-4 text-text-secondary text-xs leading-relaxed" style={bodyFont}>
        {isHi
          ? 'सभी ग्रंथ archive.org पर निःशुल्क उपलब्ध हैं। "Public Domain" ग्रंथ निश्चित रूप से मुक्त हैं (1928 से पूर्व प्रकाशित)। "CC0" ग्रंथ अपलोडकर्ता द्वारा सार्वजनिक डोमेन में दिए गए हैं। "Open Access" ग्रंथ archive.org पर स्वतंत्र रूप से उपलब्ध हैं।'
          : 'All texts are freely available on archive.org. "Public Domain" entries are definitively clear (pre-1928 publications or explicitly cleared). "CC0" entries are dedicated to the public domain by their uploader. "Open Access" entries are freely hosted on archive.org — individual copyright status for post-1928 Indian publications may vary, but no active enforcement is known.'}
      </div>
    </div>
  );
}
