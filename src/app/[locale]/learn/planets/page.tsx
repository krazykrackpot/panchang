'use client';

import { useLocale } from 'next-intl';
import { motion } from 'framer-motion';
import LessonSection from '@/components/learn/LessonSection';
import SanskritTermCard from '@/components/learn/SanskritTermCard';
import { Link } from '@/lib/i18n/navigation';
import type { Locale } from '@/types/panchang';
import { isDevanagariLocale } from '@/lib/utils/locale-fonts';

const L = {
  title: { en: 'Planetary Positions — Graha Sthiti', hi: 'ग्रह स्थिति — ग्रहों की स्थिति', sa: 'ग्रहस्थितिः — ग्रहाणां स्थानम्' , ta: 'கிரக நிலைகள் — கிரக ஸ்திதி' },
  subtitle: { en: 'Understanding where the nine Vedic planets sit in your chart and what they signify', hi: 'नवग्रहों की कुण्डली में स्थिति और उनके अर्थ को समझना', sa: 'नवग्रहाणां कुण्डल्यां स्थितिं तेषां अर्थं च अवगन्तुम्' },

  whatTitle: { en: 'What are Planetary Positions?', hi: 'ग्रह स्थिति क्या है?', sa: 'ग्रहस्थितिः का?' },
  whatContent: {
    en: 'In Vedic astrology, the positions of nine celestial bodies — the Navagraha — form the foundation of every chart reading. These are not merely astronomical coordinates; they represent cosmic forces that shape personality, destiny, and the rhythm of life events. Each planet\'s position is measured as a precise longitude (0-360 degrees) along the sidereal zodiac.',
    hi: 'वैदिक ज्योतिष में नौ खगोलीय पिण्डों — नवग्रह — की स्थिति प्रत्येक कुण्डली पठन का आधार है। ये केवल खगोलीय निर्देशांक नहीं हैं; ये ब्रह्माण्डीय शक्तियों का प्रतिनिधित्व करती हैं जो व्यक्तित्व, भाग्य और जीवन की घटनाओं की लय को आकार देती हैं।',
    sa: 'वैदिकज्योतिषे नवानां खगोलपिण्डानां — नवग्रहाणां — स्थितिः प्रत्येककुण्डलीपठनस्य आधारः। एते केवलं खगोलनिर्देशाङ्काः न, अपितु ब्रह्माण्डीयशक्तीनां प्रतिनिधयः।'
  },
  whatContent2: {
    en: 'The nine Vedic planets are: Sun (Surya), Moon (Chandra), Mars (Mangal), Mercury (Budha), Jupiter (Guru), Venus (Shukra), Saturn (Shani), Rahu (North Node), and Ketu (South Node). Unlike Western astrology, Vedic Jyotish does not use Uranus, Neptune, or Pluto — it considers only the luminaries (Sun, Moon), the five visible planets (Mars through Saturn), and the two lunar nodes (Rahu, Ketu). The lunar nodes are mathematical points where the Moon\'s orbit crosses the ecliptic, responsible for eclipses and karmic patterns.',
    hi: 'नौ वैदिक ग्रह हैं: सूर्य, चन्द्र, मंगल, बुध, गुरु, शुक्र, शनि, राहु और केतु। पश्चिमी ज्योतिष के विपरीत, वैदिक ज्योतिष यूरेनस, नेपच्यून या प्लूटो का प्रयोग नहीं करता — केवल ज्योतियाँ (सूर्य, चन्द्र), पाँच दृश्य ग्रह (मंगल से शनि), और दो चन्द्र पात (राहु, केतु) माने जाते हैं।',
    sa: 'नव वैदिकग्रहाः — सूर्यः, चन्द्रः, मङ्गलः, बुधः, गुरुः, शुक्रः, शनिः, राहुः, केतुश्च। पाश्चात्यज्योतिषात् भिन्नं वैदिकज्योतिषं यूरेनस्-नेप्च्यून्-प्लूटो न प्रयुङ्क्ते।'
  },
  whatContent3: {
    en: 'Each planet\'s position encodes five key pieces of information: its longitude (degree 0-360), its sign or Rashi (1-12), the house it occupies (1-12), its Nakshatra (1-27), and its Nakshatra Pada (quarter, 1-4). Together, these layers create a multi-dimensional portrait of how that planet expresses itself in your life.',
    hi: 'प्रत्येक ग्रह की स्थिति पाँच प्रमुख जानकारी संकेतित करती है: देशान्तर (0-360 अंश), राशि (1-12), भाव (1-12), नक्षत्र (1-27), और नक्षत्र पाद (चतुर्थांश, 1-4)। ये सभी परतें मिलकर ग्रह की अभिव्यक्ति का बहुआयामी चित्र बनाती हैं।',
    sa: 'प्रत्येकग्रहस्य स्थितिः पञ्च मुख्यसूचनाः सङ्केतयति: देशान्तरं (0-360), राशिः (1-12), भावः (1-12), नक्षत्रम् (1-27), नक्षत्रपादः (1-4)।'
  },

  navagrahaTitle: { en: 'The Nine Vedic Planets (Navagraha)', hi: 'नवग्रह — नौ वैदिक ग्रह', sa: 'नवग्रहाः — नव वैदिकग्रहाः' },

  readingTitle: { en: 'Reading the Planets Table', hi: 'ग्रह तालिका पढ़ना', sa: 'ग्रहसारणीपठनम्' },
  readingContent: {
    en: 'When you generate a Kundali on this site, the Planets tab shows a table with columns for each planet. Here is what each column tells you and why it matters for interpretation:',
    hi: 'जब आप इस साइट पर कुण्डली बनाते हैं, ग्रह टैब प्रत्येक ग्रह के लिए स्तम्भों वाली तालिका दिखाता है। प्रत्येक स्तम्भ क्या बताता है और व्याख्या के लिए क्यों महत्वपूर्ण है:',
    sa: 'यदा अत्र कुण्डलीं जनयथ, ग्रहपत्रं प्रत्येकग्रहस्य स्तम्भान् दर्शयति।'
  },

  signMeaning: { en: 'Sign (Rashi) — The Quality', hi: 'राशि — गुणवत्ता', sa: 'राशिः — गुणः' },
  signDesc: {
    en: 'The sign tells you HOW the planet expresses itself. Mars in Cancer acts emotionally and protectively; Mars in Capricorn acts with disciplined ambition. The sign is the "costume" the planet wears.',
    hi: 'राशि बताती है कि ग्रह कैसे अभिव्यक्त होता है। कर्क में मंगल भावनात्मक और रक्षात्मक ढंग से कार्य करता है; मकर में मंगल अनुशासित महत्वाकांक्षा से। राशि ग्रह का "वेश" है।',
    sa: 'राशिः ग्रहस्य अभिव्यक्तिप्रकारं वदति। कर्के मङ्गलः भावनात्मकं रक्षात्मकं च कार्यं करोति; मकरे अनुशासितमहत्त्वाकाङ्क्षया।'
  },
  houseMeaning: { en: 'House (Bhava) — The Arena', hi: 'भाव — क्षेत्र', sa: 'भावः — क्षेत्रम्' },
  houseDesc: {
    en: 'The house tells you WHERE in life the planet acts. Mars in the 10th house drives career ambition; Mars in the 4th affects home life and emotions. Houses are the "stage" on which planets perform.',
    hi: 'भाव बताता है कि ग्रह जीवन के किस क्षेत्र में कार्य करता है। 10वें भाव में मंगल करियर को चलाता है; 4थे भाव में गृह जीवन को प्रभावित करता है। भाव वह "मंच" है जिस पर ग्रह प्रदर्शन करते हैं।',
    sa: 'भावः जीवनस्य कस्मिन् क्षेत्रे ग्रहः कार्यं करोतीति वदति। दशमभावे मङ्गलः जीविकां चालयति।'
  },
  nakshatraMeaning: { en: 'Nakshatra — The Flavour', hi: 'नक्षत्र — स्वाद', sa: 'नक्षत्रम् — रसः' },
  nakshatraDesc: {
    en: 'The Nakshatra adds a deeper flavour to the planet\'s expression. Mars in Mrigashira (the Searching Star) acts with curiosity and restless exploration; Mars in Bharani (the Bearer) acts with intensity and transformative force. There are 27 Nakshatras, each spanning 13 degrees 20 minutes.',
    hi: 'नक्षत्र ग्रह की अभिव्यक्ति में गहरा स्वाद जोड़ता है। मृगशिरा में मंगल जिज्ञासा और अथक खोज से कार्य करता है; भरणी में मंगल तीव्रता और परिवर्तनकारी शक्ति से। 27 नक्षत्र हैं, प्रत्येक 13 अंश 20 कला का।',
    sa: 'नक्षत्रं ग्रहस्य अभिव्यक्तौ गभीरं रसं योजयति। मृगशिरसि मङ्गलः जिज्ञासया अन्वेषणेन च कार्यं करोति।'
  },
  retroMeaning: { en: 'Retrograde — Internalized Energy', hi: 'वक्री — आन्तरिक ऊर्जा', sa: 'वक्री — आन्तरिकशक्तिः' },
  retroDesc: {
    en: 'A retrograde planet appears to move backward in the sky (an optical illusion from Earth\'s vantage point). In Jyotish, retrograde planets are NOT "bad" — they represent internalized, intensified energy. A retrograde Jupiter turns philosophical inquiry inward; retrograde Saturn makes one deeply introspective about duty. Retrograde planets are considered strong (Cheshta Bala) and often deliver unexpected, non-linear results.',
    hi: 'वक्री ग्रह आकाश में पीछे चलता प्रतीत होता है (पृथ्वी से एक दृष्टिभ्रम)। ज्योतिष में वक्री ग्रह "बुरे" नहीं हैं — ये आन्तरिक, तीव्र ऊर्जा का प्रतिनिधित्व करते हैं। वक्री गुरु दार्शनिक जिज्ञासा को अन्तर्मुखी करता है; वक्री शनि कर्तव्य पर गहन आत्मनिरीक्षण कराता है।',
    sa: 'वक्रीग्रहः आकाशे पश्चाद्गतिं करोतीव प्रतीयते। ज्योतिषे वक्रीग्रहाः "अशुभाः" न — आन्तरिकतीव्रशक्तेः प्रतिनिधयः।'
  },

  elementTitle: { en: 'Planet-in-Sign: Element Meanings', hi: 'राशि में ग्रह: तत्व अर्थ', sa: 'राशौ ग्रहः: तत्त्वार्थाः' },
  elementContent: {
    en: 'A quick reference for how each planet behaves in signs of each element. Fire signs (Aries, Leo, Sagittarius) amplify action and confidence; Earth signs (Taurus, Virgo, Capricorn) ground and stabilize; Air signs (Gemini, Libra, Aquarius) intellectualize and socialize; Water signs (Cancer, Scorpio, Pisces) deepen emotion and intuition.',
    hi: 'प्रत्येक तत्व की राशियों में ग्रह कैसे व्यवहार करता है इसका त्वरित सन्दर्भ। अग्नि राशियाँ (मेष, सिंह, धनु) क्रिया और आत्मविश्वास बढ़ाती हैं; पृथ्वी (वृषभ, कन्या, मकर) स्थिर करती हैं; वायु (मिथुन, तुला, कुम्भ) बौद्धिक बनाती हैं; जल (कर्क, वृश्चिक, मीन) भावना गहरी करती हैं।',
    sa: 'प्रत्येकतत्त्वस्य राशिषु ग्रहः कथं व्यवहरतीति त्वरितसन्दर्भः। अग्निराशयः क्रियां वर्धयन्ति; पृथ्वीराशयः स्थिरयन्ति; वायुराशयः बौद्धिकयन्ति; जलराशयः भावनां गभीरयन्ति।'
  },

  dignityTitle: { en: 'Key Dignities — Planetary Strength', hi: 'प्रमुख गरिमाएँ — ग्रह बल', sa: 'प्रमुखगौरवाणि — ग्रहबलम्' },
  dignityContent: {
    en: 'A planet\'s dignity describes its comfort level in a sign. When a planet is in its exaltation sign, it functions at peak capacity — like a king in his own palace. In debilitation, the planet struggles — like a king exiled to hostile territory. Own sign (Swakshetra) gives comfortable, reliable results. Moolatrikona is a special zone of strength within a planet\'s own or friendly sign.',
    hi: 'ग्रह की गरिमा किसी राशि में उसके आराम के स्तर का वर्णन करती है। जब ग्रह अपनी उच्च राशि में होता है, वह चरम क्षमता पर कार्य करता है — जैसे राजा अपने महल में। नीच में ग्रह संघर्ष करता है — शत्रु भूमि में निर्वासित राजा। स्वराशि आरामदायक, विश्वसनीय परिणाम देती है। मूलत्रिकोण स्वराशि या मित्रराशि में बल का विशेष क्षेत्र है।',
    sa: 'ग्रहस्य गौरवं राशौ तस्य सुखस्तरं वर्णयति। उच्चराशौ ग्रहः शिखरक्षमतया कार्यं करोति। नीचे संघर्षम्। स्वक्षेत्रे सुखदफलानि। मूलत्रिकोणे विशेषबलम्।'
  },

  exaltationLabel: { en: 'Exaltation (Uchcha)', hi: 'उच्च', sa: 'उच्चम्' },
  debilitationLabel: { en: 'Debilitation (Neecha)', hi: 'नीच', sa: 'नीचम्' },
  ownSignLabel: { en: 'Own Sign (Swakshetra)', hi: 'स्वराशि', sa: 'स्वक्षेत्रम्' },
  moolTriLabel: { en: 'Moolatrikona', hi: 'मूलत्रिकोण', sa: 'मूलत्रिकोणम्' },

  modulesTitle: { en: 'Related Lessons & Tools', hi: 'सम्बन्धित पाठ और उपकरण', sa: 'सम्बद्धपाठसाधनानि' },
  tryIt: { en: 'Generate Your Kundali — See Your Planetary Positions', hi: 'अपनी कुण्डली बनाएँ — ग्रह स्थिति देखें', sa: 'स्वकुण्डलीं जनयतु — ग्रहस्थितिं पश्यतु' },
};

const NAVAGRAHA = [
  { en: 'Sun', hi: 'सूर्य', sa: 'सूर्यः', sanskrit: 'Surya', nature: { en: 'Soul, authority, father, government', hi: 'आत्मा, अधिकार, पिता, सरकार', sa: 'आत्मा, अधिकारः, पिता, शासनम्' }, color: '#f59e0b', id: 0 },
  { en: 'Moon', hi: 'चन्द्र', sa: 'चन्द्रः', sanskrit: 'Chandra', nature: { en: 'Mind, emotions, mother, nurturing', hi: 'मन, भावनाएँ, माता, पोषण', sa: 'मनः, भावनाः, माता, पोषणम्' }, color: '#e2e8f0', id: 1 },
  { en: 'Mars', hi: 'मंगल', sa: 'मङ्गलः', sanskrit: 'Mangal', nature: { en: 'Energy, courage, siblings, property', hi: 'ऊर्जा, साहस, भाई-बहन, सम्पत्ति', sa: 'ऊर्जा, साहसं, भ्रातरः, सम्पत्तिः' }, color: '#ef4444', id: 2 },
  { en: 'Mercury', hi: 'बुध', sa: 'बुधः', sanskrit: 'Budha', nature: { en: 'Intellect, speech, commerce, learning', hi: 'बुद्धि, वाणी, व्यापार, विद्या', sa: 'बुद्धिः, वाक्, वाणिज्यं, विद्या' }, color: '#22c55e', id: 3 },
  { en: 'Jupiter', hi: 'गुरु', sa: 'गुरुः', sanskrit: 'Guru', nature: { en: 'Wisdom, expansion, dharma, children', hi: 'ज्ञान, विस्तार, धर्म, संतान', sa: 'ज्ञानं, विस्तारः, धर्मः, सन्ततिः' }, color: '#f0d48a', id: 4 },
  { en: 'Venus', hi: 'शुक्र', sa: 'शुक्रः', sanskrit: 'Shukra', nature: { en: 'Love, beauty, luxury, marriage', hi: 'प्रेम, सौन्दर्य, विलास, विवाह', sa: 'प्रेम, सौन्दर्यं, विलासः, विवाहः' }, color: '#ec4899', id: 5 },
  { en: 'Saturn', hi: 'शनि', sa: 'शनिः', sanskrit: 'Shani', nature: { en: 'Discipline, karma, longevity, service', hi: 'अनुशासन, कर्म, दीर्घायु, सेवा', sa: 'अनुशासनं, कर्म, दीर्घायुः, सेवा' }, color: '#3b82f6', id: 6 },
  { en: 'Rahu', hi: 'राहु', sa: 'राहुः', sanskrit: 'Rahu', nature: { en: 'Obsession, illusion, foreign, ambition', hi: 'जुनून, माया, विदेश, महत्वाकांक्षा', sa: 'आसक्तिः, माया, विदेशः, महत्त्वाकाङ्क्षा' }, color: '#6366f1', id: 7 },
  { en: 'Ketu', hi: 'केतु', sa: 'केतुः', sanskrit: 'Ketu', nature: { en: 'Detachment, liberation, past karma, occult', hi: 'वैराग्य, मोक्ष, पूर्वकर्म, गूढ़', sa: 'वैराग्यं, मोक्षः, पूर्वकर्म, गूढम्' }, color: '#9ca3af', id: 8 },
];

const ELEMENT_GRID = [
  {
    element: { en: 'Fire Signs', hi: 'अग्नि राशियाँ', sa: 'अग्नि राशयः' },
    signs: 'Aries, Leo, Sagittarius',
    signsHi: 'मेष, सिंह, धनु',
    color: 'border-red-400/20 bg-red-400/5',
    planets: [
      { p: { en: 'Sun', hi: 'सूर्य' }, desc: { en: 'Confident, commanding leader; strong identity', hi: 'आत्मविश्वासी, प्रभावशाली नेता' } },
      { p: { en: 'Moon', hi: 'चन्द्र' }, desc: { en: 'Passionate emotions, bold instincts, quick reactions', hi: 'तीव्र भावनाएँ, साहसी प्रवृत्ति' } },
      { p: { en: 'Mars', hi: 'मंगल' }, desc: { en: 'Peak warrior energy; decisive, fearless action', hi: 'चरम योद्धा ऊर्जा; निर्णायक, निर्भय' } },
      { p: { en: 'Mercury', hi: 'बुध' }, desc: { en: 'Quick-witted, enthusiastic communicator', hi: 'तीक्ष्णबुद्धि, उत्साही वक्ता' } },
      { p: { en: 'Jupiter', hi: 'गुरु' }, desc: { en: 'Expansive optimism, philosophical fire, inspiring teacher', hi: 'विस्तृत आशावाद, दार्शनिक अग्नि' } },
      { p: { en: 'Venus', hi: 'शुक्र' }, desc: { en: 'Dramatic love expression, generous, theatrical taste', hi: 'नाटकीय प्रेम अभिव्यक्ति, उदार' } },
      { p: { en: 'Saturn', hi: 'शनि' }, desc: { en: 'Restless discipline; struggles with patience, gains leadership through trials', hi: 'अधीर अनुशासन; धैर्य में कठिनाई' } },
    ],
  },
  {
    element: { en: 'Earth Signs', hi: 'पृथ्वी राशियाँ', sa: 'पृथ्वी राशयः' },
    signs: 'Taurus, Virgo, Capricorn',
    signsHi: 'वृषभ, कन्या, मकर',
    color: 'border-emerald-400/20 bg-emerald-400/5',
    planets: [
      { p: { en: 'Sun', hi: 'सूर्य' }, desc: { en: 'Practical authority, steady self-expression, material builder', hi: 'व्यावहारिक अधिकार, स्थिर आत्मअभिव्यक्ति' } },
      { p: { en: 'Moon', hi: 'चन्द्र' }, desc: { en: 'Stable emotions, sensory comfort, grounded nurturing', hi: 'स्थिर भावनाएँ, इन्द्रिय सुख' } },
      { p: { en: 'Mars', hi: 'मंगल' }, desc: { en: 'Patient, methodical action; builds rather than battles', hi: 'धैर्यवान, व्यवस्थित कार्य; युद्ध नहीं निर्माण' } },
      { p: { en: 'Mercury', hi: 'बुध' }, desc: { en: 'Analytical, detail-oriented, practical intelligence', hi: 'विश्लेषणात्मक, विस्तार-उन्मुख बुद्धि' } },
      { p: { en: 'Jupiter', hi: 'गुरु' }, desc: { en: 'Grounded wisdom, wealth accumulation, steady growth', hi: 'भूमिगत ज्ञान, धन संचय, स्थिर विकास' } },
      { p: { en: 'Venus', hi: 'शुक्र' }, desc: { en: 'Sensual pleasure, fine taste, loyal love, material beauty', hi: 'इन्द्रिय सुख, उत्तम रुचि, वफादार प्रेम' } },
      { p: { en: 'Saturn', hi: 'शनि' }, desc: { en: 'Strong placement; disciplined, patient, hardworking, enduring', hi: 'शक्तिशाली स्थिति; अनुशासित, धैर्यवान' } },
    ],
  },
  {
    element: { en: 'Air Signs', hi: 'वायु राशियाँ', sa: 'वायु राशयः' },
    signs: 'Gemini, Libra, Aquarius',
    signsHi: 'मिथुन, तुला, कुम्भ',
    color: 'border-sky-400/20 bg-sky-400/5',
    planets: [
      { p: { en: 'Sun', hi: 'सूर्य' }, desc: { en: 'Intellectual authority, social leadership, idea-driven identity', hi: 'बौद्धिक अधिकार, सामाजिक नेतृत्व' } },
      { p: { en: 'Moon', hi: 'चन्द्र' }, desc: { en: 'Restless mind, social emotions, needs mental stimulation', hi: 'चंचल मन, सामाजिक भावनाएँ' } },
      { p: { en: 'Mars', hi: 'मंगल' }, desc: { en: 'Strategic action, debates rather than fights, intellectual aggression', hi: 'रणनीतिक कार्य, बहस, बौद्धिक आक्रामकता' } },
      { p: { en: 'Mercury', hi: 'बुध' }, desc: { en: 'Peak intellect; brilliant communicator, versatile, quick learner', hi: 'शिखर बुद्धि; शानदार वक्ता, बहुमुखी' } },
      { p: { en: 'Jupiter', hi: 'गुरु' }, desc: { en: 'Philosophical breadth, humanitarian ideals, teaching through dialogue', hi: 'दार्शनिक विस्तार, मानवतावादी आदर्श' } },
      { p: { en: 'Venus', hi: 'शुक्र' }, desc: { en: 'Aesthetic refinement, intellectual romance, social charm', hi: 'सौन्दर्यबोध शोधन, बौद्धिक रोमांस' } },
      { p: { en: 'Saturn', hi: 'शनि' }, desc: { en: 'Systematic thinking, structured reforms, social responsibility', hi: 'व्यवस्थित सोच, संरचित सुधार' } },
    ],
  },
  {
    element: { en: 'Water Signs', hi: 'जल राशियाँ', sa: 'जल राशयः' },
    signs: 'Cancer, Scorpio, Pisces',
    signsHi: 'कर्क, वृश्चिक, मीन',
    color: 'border-blue-400/20 bg-blue-400/5',
    planets: [
      { p: { en: 'Sun', hi: 'सूर्य' }, desc: { en: 'Empathetic authority, intuitive leadership, protective', hi: 'सहानुभूतिपूर्ण अधिकार, अन्तर्ज्ञानी नेतृत्व' } },
      { p: { en: 'Moon', hi: 'चन्द्र' }, desc: { en: 'Deep emotions, psychic sensitivity, strong attachment, nurturing', hi: 'गहरी भावनाएँ, मानसिक संवेदनशीलता' } },
      { p: { en: 'Mars', hi: 'मंगल' }, desc: { en: 'Emotional intensity, hidden anger, transformative force', hi: 'भावनात्मक तीव्रता, छिपा क्रोध' } },
      { p: { en: 'Mercury', hi: 'बुध' }, desc: { en: 'Intuitive thinking, poetic expression, absorbs through feeling', hi: 'अन्तर्ज्ञानी सोच, काव्यात्मक अभिव्यक्ति' } },
      { p: { en: 'Jupiter', hi: 'गुरु' }, desc: { en: 'Spiritual wisdom, devotional expansion, compassionate teaching', hi: 'आध्यात्मिक ज्ञान, भक्ति विस्तार' } },
      { p: { en: 'Venus', hi: 'शुक्र' }, desc: { en: 'Deep romantic bonds, artistic soul, selfless love, devotion', hi: 'गहरे रोमांटिक बन्ध, कलात्मक आत्मा' } },
      { p: { en: 'Saturn', hi: 'शनि' }, desc: { en: 'Emotional heaviness, deep karmic lessons, spiritual discipline through suffering', hi: 'भावनात्मक भारीपन, गहरे कार्मिक पाठ' } },
    ],
  },
];

const DIGNITY_TABLE = [
  { planet: { en: 'Sun', hi: 'सूर्य' }, color: '#f59e0b', exalt: { en: 'Aries 10\u00b0', hi: 'मेष 10\u00b0' }, debi: { en: 'Libra 10\u00b0', hi: 'तुला 10\u00b0' }, own: { en: 'Leo', hi: 'सिंह' }, moola: { en: 'Leo 0-20\u00b0', hi: 'सिंह 0-20\u00b0' } },
  { planet: { en: 'Moon', hi: 'चन्द्र' }, color: '#e2e8f0', exalt: { en: 'Taurus 3\u00b0', hi: 'वृषभ 3\u00b0' }, debi: { en: 'Scorpio 3\u00b0', hi: 'वृश्चिक 3\u00b0' }, own: { en: 'Cancer', hi: 'कर्क' }, moola: { en: 'Taurus 4-30\u00b0', hi: 'वृषभ 4-30\u00b0' } },
  { planet: { en: 'Mars', hi: 'मंगल' }, color: '#ef4444', exalt: { en: 'Capricorn 28\u00b0', hi: 'मकर 28\u00b0' }, debi: { en: 'Cancer 28\u00b0', hi: 'कर्क 28\u00b0' }, own: { en: 'Aries, Scorpio', hi: 'मेष, वृश्चिक' }, moola: { en: 'Aries 0-12\u00b0', hi: 'मेष 0-12\u00b0' } },
  { planet: { en: 'Mercury', hi: 'बुध' }, color: '#22c55e', exalt: { en: 'Virgo 15\u00b0', hi: 'कन्या 15\u00b0' }, debi: { en: 'Pisces 15\u00b0', hi: 'मीन 15\u00b0' }, own: { en: 'Gemini, Virgo', hi: 'मिथुन, कन्या' }, moola: { en: 'Virgo 16-20\u00b0', hi: 'कन्या 16-20\u00b0' } },
  { planet: { en: 'Jupiter', hi: 'गुरु' }, color: '#f0d48a', exalt: { en: 'Cancer 5\u00b0', hi: 'कर्क 5\u00b0' }, debi: { en: 'Capricorn 5\u00b0', hi: 'मकर 5\u00b0' }, own: { en: 'Sagittarius, Pisces', hi: 'धनु, मीन' }, moola: { en: 'Sagittarius 0-10\u00b0', hi: 'धनु 0-10\u00b0' } },
  { planet: { en: 'Venus', hi: 'शुक्र' }, color: '#ec4899', exalt: { en: 'Pisces 27\u00b0', hi: 'मीन 27\u00b0' }, debi: { en: 'Virgo 27\u00b0', hi: 'कन्या 27\u00b0' }, own: { en: 'Taurus, Libra', hi: 'वृषभ, तुला' }, moola: { en: 'Libra 0-15\u00b0', hi: 'तुला 0-15\u00b0' } },
  { planet: { en: 'Saturn', hi: 'शनि' }, color: '#3b82f6', exalt: { en: 'Libra 20\u00b0', hi: 'तुला 20\u00b0' }, debi: { en: 'Aries 20\u00b0', hi: 'मेष 20\u00b0' }, own: { en: 'Capricorn, Aquarius', hi: 'मकर, कुम्भ' }, moola: { en: 'Aquarius 0-20\u00b0', hi: 'कुम्भ 0-20\u00b0' } },
];

const TABLE_COLUMNS = [
  { key: 'planet', en: 'Planet', hi: 'ग्रह' },
  { key: 'sign', en: 'Sign', hi: 'राशि' },
  { key: 'house', en: 'House', hi: 'भाव' },
  { key: 'degree', en: 'Degree', hi: 'अंश' },
  { key: 'nakshatra', en: 'Nakshatra', hi: 'नक्षत्र' },
  { key: 'pada', en: 'Pada', hi: 'पाद' },
  { key: 'retro', en: 'Retro', hi: 'वक्री' },
];

export default function LearnPlanetsPage() {
  const locale = useLocale() as Locale;
  const isHi = isDevanagariLocale(locale);
  const headingFont = isHi ? { fontFamily: 'var(--font-devanagari-heading)' } : { fontFamily: 'var(--font-heading)' };
  const bodyFont = isHi ? { fontFamily: 'var(--font-devanagari-body)' } : {};

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-2xl sm:text-3xl font-bold text-gold-gradient mb-2" style={headingFont}>
          {((L.title as Record<string, string>)[locale] ?? L.title.en)}
        </h2>
        <p className="text-text-secondary" style={bodyFont}>{((L.subtitle as Record<string, string>)[locale] ?? L.subtitle.en)}</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mb-8">
        <SanskritTermCard term="Graha" devanagari="ग्रह" transliteration="Graha" meaning="Planet (seizer)" />
        <SanskritTermCard term="Sthiti" devanagari="स्थिति" transliteration="Sthiti" meaning="Position / placement" />
        <SanskritTermCard term="Uchcha" devanagari="उच्च" transliteration="Uccha" meaning="Exaltation" />
        <SanskritTermCard term="Neecha" devanagari="नीच" transliteration="Nicha" meaning="Debilitation" />
        <SanskritTermCard term="Vakri" devanagari="वक्री" transliteration="Vakri" meaning="Retrograde" />
      </div>

      {/* Section 1: What are Planetary Positions */}
      <LessonSection number={1} title={((L.whatTitle as Record<string, string>)[locale] ?? L.whatTitle.en)}>
        <p style={bodyFont}>{((L.whatContent as Record<string, string>)[locale] ?? L.whatContent.en)}</p>
        <p className="mt-3" style={bodyFont}>{((L.whatContent2 as Record<string, string>)[locale] ?? L.whatContent2.en)}</p>
        <p className="mt-3" style={bodyFont}>{((L.whatContent3 as Record<string, string>)[locale] ?? L.whatContent3.en)}</p>
      </LessonSection>

      {/* Section 2: Navagraha grid */}
      <LessonSection number={2} title={((L.navagrahaTitle as Record<string, string>)[locale] ?? L.navagrahaTitle.en)}>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mt-4">
          {NAVAGRAHA.map((g, i) => (
            <motion.div
              key={g.en}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-4"
            >
              <div className="flex items-center gap-3 mb-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: g.color }} />
                <span className="text-gold-light font-bold text-sm" style={headingFont}>
                  {isHi ? g.hi : g.en}
                </span>
                <span className="text-text-tertiary text-xs font-mono">
                  {g.sanskrit}
                </span>
              </div>
              <p className="text-text-secondary text-xs leading-relaxed" style={bodyFont}>
                {g.nature[locale]}
              </p>
            </motion.div>
          ))}
        </div>
      </LessonSection>

      {/* Section 3: Reading the Planets Table */}
      <LessonSection number={3} title={((L.readingTitle as Record<string, string>)[locale] ?? L.readingTitle.en)}>
        <p style={bodyFont}>{((L.readingContent as Record<string, string>)[locale] ?? L.readingContent.en)}</p>

        {/* Example table structure */}
        <div className="mt-4 bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-2xl p-4 overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-gold-primary/10">
                {TABLE_COLUMNS.map(col => (
                  <th key={col.key} className="text-left py-2 px-2 text-gold-dark">
                    {isHi ? col.hi : col.en}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gold-primary/5">
              <tr className="text-text-secondary">
                <td className="py-2 px-2 font-medium" style={{ color: '#ef4444' }}>{isHi ? 'मंगल' : 'Mars'}</td>
                <td className="py-2 px-2">{isHi ? 'मकर' : 'Capricorn'}</td>
                <td className="py-2 px-2 font-mono">10</td>
                <td className="py-2 px-2 font-mono">28\u00b015&apos;</td>
                <td className="py-2 px-2">{isHi ? 'धनिष्ठा' : 'Dhanishta'}</td>
                <td className="py-2 px-2 font-mono">3</td>
                <td className="py-2 px-2">-</td>
              </tr>
              <tr className="text-text-secondary">
                <td className="py-2 px-2 font-medium" style={{ color: '#f0d48a' }}>{isHi ? 'गुरु' : 'Jupiter'}</td>
                <td className="py-2 px-2">{isHi ? 'कर्क' : 'Cancer'}</td>
                <td className="py-2 px-2 font-mono">4</td>
                <td className="py-2 px-2 font-mono">5\u00b012&apos;</td>
                <td className="py-2 px-2">{isHi ? 'पुष्य' : 'Pushya'}</td>
                <td className="py-2 px-2 font-mono">1</td>
                <td className="py-2 px-2 text-amber-400">R</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* What each column means */}
        <div className="mt-6 space-y-4">
          {[
            { title: ((L.signMeaning as Record<string, string>)[locale] ?? L.signMeaning.en), desc: ((L.signDesc as Record<string, string>)[locale] ?? L.signDesc.en), color: 'border-violet-400/20 bg-violet-400/5' },
            { title: ((L.houseMeaning as Record<string, string>)[locale] ?? L.houseMeaning.en), desc: ((L.houseDesc as Record<string, string>)[locale] ?? L.houseDesc.en), color: 'border-emerald-400/20 bg-emerald-400/5' },
            { title: ((L.nakshatraMeaning as Record<string, string>)[locale] ?? L.nakshatraMeaning.en), desc: ((L.nakshatraDesc as Record<string, string>)[locale] ?? L.nakshatraDesc.en), color: 'border-amber-400/20 bg-amber-400/5' },
            { title: ((L.retroMeaning as Record<string, string>)[locale] ?? L.retroMeaning.en), desc: ((L.retroDesc as Record<string, string>)[locale] ?? L.retroDesc.en), color: 'border-sky-400/20 bg-sky-400/5' },
          ].map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -15 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className={`rounded-xl p-4 border ${item.color}`}
            >
              <div className="text-gold-light text-sm font-bold mb-1" style={headingFont}>{item.title}</div>
              <p className="text-text-secondary text-xs leading-relaxed" style={bodyFont}>{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </LessonSection>

      {/* Section 4: Planet-in-Sign Element Grid */}
      <LessonSection number={4} title={((L.elementTitle as Record<string, string>)[locale] ?? L.elementTitle.en)}>
        <p style={bodyFont}>{((L.elementContent as Record<string, string>)[locale] ?? L.elementContent.en)}</p>

        <div className="mt-6 space-y-6">
          {ELEMENT_GRID.map((el, elIdx) => (
            <motion.div
              key={el.element.en}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: elIdx * 0.1 }}
              className={`rounded-2xl p-4 border ${el.color}`}
            >
              <div className="flex items-center gap-2 mb-3">
                <span className="text-gold-light text-sm font-bold" style={headingFont}>{el.element[locale]}</span>
                <span className="text-text-tertiary text-xs font-mono">
                  ({isHi ? el.signsHi : el.signs})
                </span>
              </div>
              <div className="space-y-2">
                {el.planets.map((pl) => (
                  <div key={pl.p.en} className="flex gap-3 items-start">
                    <div className="w-16 flex-shrink-0 text-xs font-semibold text-gold-dark text-right pt-0.5" style={headingFont}>
                      {isHi ? pl.p.hi : pl.p.en}
                    </div>
                    <div className="text-text-secondary text-xs leading-relaxed flex-1" style={bodyFont}>
                      {(pl.desc as Record<string, string>)[locale] || pl.desc.en}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </LessonSection>

      {/* Section 5: Key Dignities */}
      <LessonSection number={5} title={((L.dignityTitle as Record<string, string>)[locale] ?? L.dignityTitle.en)} variant="highlight">
        <p style={bodyFont}>{((L.dignityContent as Record<string, string>)[locale] ?? L.dignityContent.en)}</p>

        <div className="mt-6 bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-2xl p-4 overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-gold-primary/10">
                <th className="text-left py-2 px-2 text-gold-dark">{isHi ? 'ग्रह' : 'Planet'}</th>
                <th className="text-left py-2 px-2 text-gold-dark">{((L.exaltationLabel as Record<string, string>)[locale] ?? L.exaltationLabel.en)}</th>
                <th className="text-left py-2 px-2 text-gold-dark">{((L.debilitationLabel as Record<string, string>)[locale] ?? L.debilitationLabel.en)}</th>
                <th className="text-left py-2 px-2 text-gold-dark">{((L.ownSignLabel as Record<string, string>)[locale] ?? L.ownSignLabel.en)}</th>
                <th className="text-left py-2 px-2 text-gold-dark">{((L.moolTriLabel as Record<string, string>)[locale] ?? L.moolTriLabel.en)}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gold-primary/5">
              {DIGNITY_TABLE.map((row) => (
                <tr key={row.planet.en} className="hover:bg-gold-primary/3">
                  <td className="py-2 px-2 font-medium" style={{ color: row.color }}>
                    {isHi ? row.planet.hi : row.planet.en}
                  </td>
                  <td className="py-2 px-2 text-emerald-400">{isHi ? row.exalt.hi : row.exalt.en}</td>
                  <td className="py-2 px-2 text-red-400">{isHi ? row.debi.hi : row.debi.en}</td>
                  <td className="py-2 px-2 text-text-secondary">{isHi ? row.own.hi : row.own.en}</td>
                  <td className="py-2 px-2 text-text-secondary/70">{isHi ? row.moola.hi : row.moola.en}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
          {[
            { label: ((L.exaltationLabel as Record<string, string>)[locale] ?? L.exaltationLabel.en), desc: { en: 'Planet at peak strength. Results come easily and abundantly. Like a king honoured in his own court.', hi: 'ग्रह चरम बल पर। परिणाम सहजता और प्रचुरता से आते हैं। अपने दरबार में सम्मानित राजा।', sa: 'ग्रहः शिखरबले। फलानि सहजतया प्रचुरतया च आगच्छन्ति।' }, color: 'emerald' },
            { label: ((L.debilitationLabel as Record<string, string>)[locale] ?? L.debilitationLabel.en), desc: { en: 'Planet at weakest. Results are delayed, distorted, or come through struggle. Can be cancelled by Neechabhanga Raja Yoga.', hi: 'ग्रह सबसे कमज़ोर। परिणाम विलम्बित या संघर्ष से आते हैं। नीचभंग राजयोग से रद्द हो सकता है।', sa: 'ग्रहः दुर्बलतमः। फलानि विलम्बितानि संघर्षेण वा।' }, color: 'red' },
            { label: ((L.ownSignLabel as Record<string, string>)[locale] ?? L.ownSignLabel.en), desc: { en: 'Planet comfortable and reliable. Gives steady, dependable results in its significations. Like being at home.', hi: 'ग्रह सुखी और विश्वसनीय। अपने संकेतों में स्थिर, भरोसेमन्द परिणाम देता है। घर पर होने जैसा।', sa: 'ग्रहः सुखी विश्वसनीयश्च। स्वसङ्केतेषु स्थिरफलानि ददाति।' }, color: 'blue' },
            { label: ((L.moolTriLabel as Record<string, string>)[locale] ?? L.moolTriLabel.en), desc: { en: 'A special zone of strength within a sign. Planet performs with authority and clarity, especially for its primary significations.', hi: 'राशि के भीतर बल का विशेष क्षेत्र। ग्रह अधिकार और स्पष्टता से कार्य करता है, विशेषकर प्राथमिक संकेतों के लिए।', sa: 'राशेः अन्तः बलस्य विशेषक्षेत्रम्। ग्रहः अधिकारेण स्पष्टतया च कार्यं करोति।' }, color: 'amber' },
          ].map((item) => {
            const colorClasses: Record<string, string> = {
              emerald: 'border-emerald-400/20 bg-emerald-400/5 text-emerald-400',
              amber: 'border-amber-400/20 bg-amber-400/5 text-amber-400',
              red: 'border-red-400/20 bg-red-400/5 text-red-400',
              blue: 'border-blue-400/20 bg-blue-400/5 text-blue-400',
            };
            const cls = colorClasses[item.color] || colorClasses.amber;
            return (
            <div key={item.label} className={`rounded-lg p-3 border ${cls.split(' ').slice(0, 2).join(' ')}`}>
              <div className={`${cls.split(' ')[2]} text-sm font-semibold mb-1`} style={headingFont}>{item.label}</div>
              <div className="text-text-secondary text-xs leading-relaxed" style={bodyFont}>{item.desc[locale]}</div>
            </div>
            );
          })}
        </div>
      </LessonSection>

      {/* Section 6: Related modules */}
      <LessonSection number={6} title={((L.modulesTitle as Record<string, string>)[locale] ?? L.modulesTitle.en)}>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {[
            { href: '/learn/modules/9-1', label: { en: 'Lesson 9-1: Planets in Houses', hi: 'पाठ 9-1: भावों में ग्रह', sa: 'पाठः 9-1: भावेषु ग्रहाः' } },
            { href: '/learn/modules/9-3', label: { en: 'Lesson 9-3: Planetary Aspects', hi: 'पाठ 9-3: ग्रह दृष्टि', sa: 'पाठः 9-3: ग्रहदृष्टिः' } },
            { href: '/learn/modules/2-1', label: { en: 'Lesson 2-1: The Grahas (Planets)', hi: 'पाठ 2-1: ग्रह', sa: 'पाठः 2-1: ग्रहाः' } },
            { href: '/learn/modules/2-3', label: { en: 'Lesson 2-3: Planetary Relationships', hi: 'पाठ 2-3: ग्रह सम्बन्ध', sa: 'पाठः 2-3: ग्रहसम्बन्धाः' } },
            { href: '/learn/grahas', label: { en: 'Reference: The Nine Grahas', hi: 'सन्दर्भ: नवग्रह', sa: 'सन्दर्भः: नवग्रहाः' } },
            { href: '/kundali', label: { en: 'Tool: Generate Kundali', hi: 'उपकरण: कुण्डली बनाएँ', sa: 'साधनम्: कुण्डलीजननम्' } },
          ].map((mod) => (
            <Link
              key={mod.href}
              href={mod.href}
              className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-lg p-3 hover:border-gold-primary/30 transition-colors block"
            >
              <span className="text-gold-light text-xs font-medium" style={headingFont}>
                {mod.label[locale]}
              </span>
            </Link>
          ))}
        </div>
      </LessonSection>

      <div className="mt-6 text-center">
        <Link
          href="/kundali"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-gold-primary/10 border border-gold-primary/30 text-gold-light hover:bg-gold-primary/20 transition-colors text-sm font-medium"
        >
          {((L.tryIt as Record<string, string>)[locale] ?? L.tryIt.en)} →
        </Link>
      </div>
    </div>
  );
}
