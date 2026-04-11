'use client';

import { useLocale } from 'next-intl';
import { motion } from 'framer-motion';
import LessonSection from '@/components/learn/LessonSection';
import SanskritTermCard from '@/components/learn/SanskritTermCard';
import { Link } from '@/lib/i18n/navigation';
import type { Locale } from '@/types/panchang';

const L = {
  title: { en: 'Lagna — The Ascendant', hi: 'लग्न — उदय राशि', sa: 'लग्नम् — उदयराशिः' },
  subtitle: {
    en: 'The most important point in Vedic astrology — your cosmic identity card',
    hi: 'वैदिक ज्योतिष का सबसे महत्वपूर्ण बिन्दु — आपका ब्रह्माण्डीय पहचान पत्र',
  },

  whatTitle: { en: 'What is the Lagna?', hi: 'लग्न क्या है?' },
  whatContent: {
    en: 'The Lagna (Ascendant) is the exact degree of the zodiac sign rising on the eastern horizon at the moment and place of birth. It is the single most important point in a Vedic birth chart (Kundali). While your Sun sign shows your soul\'s purpose and your Moon sign reflects your mind and emotions, the Lagna reveals how the world perceives you, your physical body, your temperament, and your life direction. In Sanskrit, "Lagna" literally means "that which is attached" — the sign that was attached to the eastern horizon at your first breath.',
    hi: 'लग्न (उदय राशि) जन्म के क्षण और स्थान पर पूर्वी क्षितिज पर उदित होने वाली राशि का ठीक वही अंश है। यह वैदिक कुण्डली का सर्वाधिक महत्वपूर्ण बिन्दु है। जहाँ आपकी सूर्य राशि आत्मा का उद्देश्य दिखाती है और चन्द्र राशि मन और भावनाओं को प्रतिबिम्बित करती है, लग्न यह उजागर करता है कि संसार आपको कैसे देखता है — आपका शरीर, स्वभाव और जीवन दिशा। संस्कृत में "लग्न" का शाब्दिक अर्थ है "जो जुड़ा हुआ है" — वह राशि जो आपकी पहली श्वास पर पूर्वी क्षितिज से जुड़ी थी।',
  },

  whyTitle: { en: 'Why Lagna is Supreme', hi: 'लग्न सर्वोपरि क्यों है' },
  whyContent: {
    en: 'Parashara calls the Lagna "Tanu Bhava" (house of the body) — it governs your physical constitution, health, longevity, appearance, and personality. Every other house in the chart is numbered relative to the Lagna. The entire interpretation of a horoscope pivots on this one point. Two people born on the same day with the same planetary positions but different Lagnas will have completely different charts, because the houses rotate. This is why an error of just a few minutes in birth time can alter the entire reading. The Lagna lord (the planet ruling the ascendant sign) becomes the chart\'s most important planet — its strength, placement, and aspects color the entire life.',
    hi: 'पराशर लग्न को "तनु भाव" (शरीर का भाव) कहते हैं — यह आपकी शारीरिक संरचना, स्वास्थ्य, दीर्घायु, रूप और व्यक्तित्व को नियन्त्रित करता है। कुण्डली का प्रत्येक अन्य भाव लग्न के सापेक्ष गिना जाता है। सम्पूर्ण फलादेश इसी एक बिन्दु पर निर्भर करता है। एक ही दिन जन्मे दो व्यक्ति भिन्न लग्नों से सर्वथा भिन्न कुण्डलियाँ पाते हैं। लग्नेश (लग्न राशि का स्वामी ग्रह) कुण्डली का सबसे महत्वपूर्ण ग्रह बन जाता है।',
  },

  calcTitle: { en: 'How the Lagna is Calculated', hi: 'लग्न की गणना कैसे होती है' },
  calcContent: {
    en: 'The Lagna calculation requires three inputs: date, exact time, and geographical coordinates of birth. Here is the process:',
    hi: 'लग्न गणना के लिए तीन आदानों की आवश्यकता होती है: तिथि, सटीक समय, और जन्म स्थान के भौगोलिक निर्देशांक। प्रक्रिया इस प्रकार है:',
  },
  calcSteps: [
    { en: '1. Convert birth time to Universal Time (UT) by subtracting the timezone offset', hi: '1. जन्म समय को UTC में बदलें (समयक्षेत्र घटाकर)' },
    { en: '2. Calculate the Julian Day Number (JD) from the date and UT', hi: '2. तिथि और UT से जूलियन दिवस संख्या (JD) निकालें' },
    { en: '3. Compute the Local Sidereal Time (LST) from JD + geographic longitude', hi: '3. JD + भौगोलिक देशान्तर से स्थानीय नाक्षत्र काल (LST) निकालें' },
    { en: '4. Apply the ascendant formula: tan(Lagna) = cos(LST) / [−sin(LST)·cos(ε) + tan(φ)·sin(ε)]', hi: '4. लग्न सूत्र: tan(लग्न) = cos(LST) / [−sin(LST)·cos(ε) + tan(φ)·sin(ε)]' },
    { en: '5. Subtract the Ayanamsha to convert from tropical to sidereal (Vedic) Lagna', hi: '5. उष्णकटिबन्धीय से सायन (वैदिक) लग्न में बदलने हेतु अयनांश घटाएं' },
  ],
  calcNote: {
    en: 'Where ε is the obliquity of the ecliptic (~23.44°) and φ is the geographic latitude. Our engine uses Swiss Ephemeris for sub-arcsecond precision.',
    hi: 'जहाँ ε क्रान्तिवृत्त का नमन (~23.44°) और φ भौगोलिक अक्षांश है। हमारा इंजन Swiss Ephemeris का उपयोग करता है।',
  },

  changeTitle: { en: 'How Fast Does the Lagna Change?', hi: 'लग्न कितनी तेज़ी से बदलता है?' },
  changeContent: {
    en: 'The Earth completes one rotation in ~24 hours, so all 12 signs rise in that period. On average, each sign takes about 2 hours to rise — but this varies significantly by latitude and sign. At the equator, signs rise more uniformly. At higher latitudes (like northern Europe or Canada), some signs rise in less than an hour while others take over 3 hours. This is why the "signs of long ascension" and "signs of short ascension" matter:',
    hi: 'पृथ्वी ~24 घण्टे में एक चक्कर पूरा करती है, इसलिए सभी 12 राशियाँ इस अवधि में उदित होती हैं। औसतन, प्रत्येक राशि को उदित होने में लगभग 2 घण्टे लगते हैं — लेकिन यह अक्षांश और राशि के अनुसार बहुत भिन्न होता है:',
  },
  longAsc: {
    en: 'Signs of Long Ascension (northern hemisphere): Cancer, Leo, Virgo, Libra, Scorpio, Sagittarius — these take longer to rise (2.5-3+ hours)',
    hi: 'दीर्घ उदय राशियाँ (उत्तरी गोलार्ध): कर्क, सिंह, कन्या, तुला, वृश्चिक, धनु — ये उदित होने में अधिक समय (2.5-3+ घण्टे) लेती हैं',
  },
  shortAsc: {
    en: 'Signs of Short Ascension (northern hemisphere): Capricorn, Aquarius, Pisces, Aries, Taurus, Gemini — these rise quickly (1-1.5 hours)',
    hi: 'लघु उदय राशियाँ (उत्तरी गोलार्ध): मकर, कुम्भ, मीन, मेष, वृषभ, मिथुन — ये शीघ्र उदित होती हैं (1-1.5 घण्टे)',
  },

  twelveLagnaTitle: { en: 'The 12 Lagnas — Personality & Life Direction', hi: '12 लग्न — व्यक्तित्व और जीवन दिशा' },
  lagnas: [
    { sign: { en: 'Aries (Mesha)', hi: 'मेष' }, lord: { en: 'Mars', hi: 'मंगल' }, traits: { en: 'Pioneer, courageous, impulsive, athletic build, scar on head/face likely, natural leader. Life theme: self-assertion and initiative.', hi: 'अग्रदूत, साहसी, आवेगी, खिलाड़ी शरीर, सिर/चेहरे पर निशान, स्वाभाविक नेता।' } },
    { sign: { en: 'Taurus (Vrishabha)', hi: 'वृषभ' }, lord: { en: 'Venus', hi: 'शुक्र' }, traits: { en: 'Steady, artistic, sensual, stocky/solid build, beautiful eyes, loves comfort. Life theme: building security and beauty.', hi: 'स्थिर, कलात्मक, संवेदनशील, मजबूत शरीर, सुन्दर आँखें, सुख-प्रेमी।' } },
    { sign: { en: 'Gemini (Mithuna)', hi: 'मिथुन' }, lord: { en: 'Mercury', hi: 'बुध' }, traits: { en: 'Intellectual, communicative, versatile, slender build, youthful appearance, dual nature. Life theme: learning and connecting.', hi: 'बौद्धिक, संवादकुशल, बहुमुखी, दुबला शरीर, युवा दिखावट, द्विस्वभाव।' } },
    { sign: { en: 'Cancer (Karka)', hi: 'कर्क' }, lord: { en: 'Moon', hi: 'चन्द्र' }, traits: { en: 'Nurturing, emotional, intuitive, round face, love of home and family. Life theme: emotional security and caregiving.', hi: 'पालनकर्ता, भावुक, सहजज्ञानी, गोल चेहरा, गृह और परिवार प्रेमी।' } },
    { sign: { en: 'Leo (Simha)', hi: 'सिंह' }, lord: { en: 'Sun', hi: 'सूर्य' }, traits: { en: 'Regal, confident, generous, broad chest, prominent forehead, charismatic presence. Life theme: self-expression and leadership.', hi: 'राजसी, आत्मविश्वासी, उदार, चौड़ी छाती, प्रमुख ललाट, आकर्षक उपस्थिति।' } },
    { sign: { en: 'Virgo (Kanya)', hi: 'कन्या' }, lord: { en: 'Mercury', hi: 'बुध' }, traits: { en: 'Analytical, perfectionist, health-conscious, slender build, youthful, service-oriented. Life theme: analysis and improvement.', hi: 'विश्लेषणात्मक, पूर्णतावादी, स्वास्थ्य-सजग, दुबला, सेवा-उन्मुख।' } },
    { sign: { en: 'Libra (Tula)', hi: 'तुला' }, lord: { en: 'Venus', hi: 'शुक्र' }, traits: { en: 'Diplomatic, aesthetic, partnership-seeking, attractive features, balanced build. Life theme: harmony and relationships.', hi: 'कूटनीतिक, सौन्दर्यप्रेमी, साझेदारी-खोजी, आकर्षक, सन्तुलित।' } },
    { sign: { en: 'Scorpio (Vrishchika)', hi: 'वृश्चिक' }, lord: { en: 'Mars', hi: 'मंगल' }, traits: { en: 'Intense, secretive, transformative, magnetic eyes, muscular build, investigative mind. Life theme: transformation and power.', hi: 'तीव्र, गुप्त, परिवर्तनशील, चुम्बकीय आँखें, पेशीय, अन्वेषी मन।' } },
    { sign: { en: 'Sagittarius (Dhanu)', hi: 'धनु' }, lord: { en: 'Jupiter', hi: 'गुरु' }, traits: { en: 'Philosophical, adventurous, optimistic, tall/large frame, prominent thighs, teacher archetype. Life theme: wisdom and expansion.', hi: 'दार्शनिक, साहसिक, आशावादी, लम्बा/बड़ा शरीर, गुरु स्वरूप।' } },
    { sign: { en: 'Capricorn (Makara)', hi: 'मकर' }, lord: { en: 'Saturn', hi: 'शनि' }, traits: { en: 'Disciplined, ambitious, patient, lean build, prominent bones/knees, ages in reverse. Life theme: achievement through persistence.', hi: 'अनुशासित, महत्वाकांक्षी, धैर्यवान, दुबला, प्रमुख हड्डियाँ, उलटी उम्र।' } },
    { sign: { en: 'Aquarius (Kumbha)', hi: 'कुम्भ' }, lord: { en: 'Saturn', hi: 'शनि' }, traits: { en: 'Humanitarian, eccentric, scientific, tall, prominent calves, detached yet idealistic. Life theme: innovation and social reform.', hi: 'मानवतावादी, विलक्षण, वैज्ञानिक, लम्बा, आदर्शवादी पर विरक्त।' } },
    { sign: { en: 'Pisces (Meena)', hi: 'मीन' }, lord: { en: 'Jupiter', hi: 'गुरु' }, traits: { en: 'Mystical, compassionate, creative, soft features, dreamy eyes, spiritual inclination. Life theme: transcendence and spiritual growth.', hi: 'रहस्यमय, करुणामय, सृजनात्मक, कोमल, स्वप्निल आँखें, आध्यात्मिक।' } },
  ],

  lagnaLordTitle: { en: 'The Lagna Lord — Chart\'s Key Planet', hi: 'लग्नेश — कुण्डली का प्रमुख ग्रह' },
  lagnaLordContent: {
    en: 'The planet ruling the ascendant sign is called the Lagna Lord (Lagnadhipati or Lagnesh). Its placement determines the primary direction of life energy. A strong, well-placed Lagna Lord in a kendra (1,4,7,10) or trikona (1,5,9) gives health, confidence, and success. A weak or afflicted Lagna Lord in dusthana (6,8,12) can indicate health challenges and life struggles. The Lagna Lord\'s conjunction with benefics (Jupiter, Venus) strengthens the personality; conjunction with malefics (Saturn, Rahu) adds challenges that build character.',
    hi: 'लग्न राशि का स्वामी ग्रह लग्नेश (लग्नाधिपति) कहलाता है। इसका स्थान जीवन ऊर्जा की प्राथमिक दिशा निर्धारित करता है। केन्द्र (1,4,7,10) या त्रिकोण (1,5,9) में बलवान लग्नेश स्वास्थ्य, आत्मविश्वास और सफलता देता है। दुःस्थान (6,8,12) में दुर्बल लग्नेश स्वास्थ्य चुनौतियाँ और जीवन संघर्ष सूचित करता है। लग्नेश का शुभ ग्रहों (गुरु, शुक्र) से योग व्यक्तित्व को सशक्त करता है।',
  },

  specialTitle: { en: 'Special Lagnas in Vedic Astrology', hi: 'वैदिक ज्योतिष में विशेष लग्न' },
  specialContent: {
    en: 'Beyond the birth Lagna (Udaya Lagna), Jyotish uses several other reference points as alternative ascendants. Each illuminates a specific dimension of life:',
    hi: 'जन्म लग्न (उदय लग्न) के अतिरिक्त, ज्योतिष कई अन्य सन्दर्भ बिन्दुओं को वैकल्पिक लग्न के रूप में प्रयोग करता है:',
  },
  specialLagnas: [
    { name: { en: 'Chandra Lagna (Moon Ascendant)', hi: 'चन्द्र लग्न' }, desc: { en: 'Using the Moon\'s sign as the 1st house. Reveals the emotional and mental landscape. In South India, charts are often read from both Lagna and Chandra Lagna to get a complete picture.', hi: 'चन्द्रमा की राशि को प्रथम भाव मानकर। भावनात्मक और मानसिक परिदृश्य उजागर करता है।' } },
    { name: { en: 'Surya Lagna (Sun Ascendant)', hi: 'सूर्य लग्न' }, desc: { en: 'Using the Sun\'s sign as the 1st house. Illuminates career, authority, and the soul\'s purpose. Particularly important for daytime births.', hi: 'सूर्य की राशि को प्रथम भाव मानकर। कैरियर, अधिकार और आत्मा का उद्देश्य प्रकाशित करता है।' } },
    { name: { en: 'Hora Lagna', hi: 'होरा लग्न' }, desc: { en: 'Advances at the rate of one sign per hour from sunrise. Specifically reveals wealth potential and financial trajectory.', hi: 'सूर्योदय से प्रति घण्टा एक राशि बढ़ता है। विशेष रूप से धन क्षमता और वित्तीय गति उजागर करता है।' } },
    { name: { en: 'Ghati Lagna (Ghatika Lagna)', hi: 'घटी लग्न' }, desc: { en: 'Advances at the rate of one sign per ghati (24 minutes). Related to power, authority, and public reputation.', hi: 'प्रति घटी (24 मिनट) एक राशि बढ़ता है। शक्ति, अधिकार और सार्वजनिक प्रतिष्ठा से सम्बन्धित।' } },
    { name: { en: 'Varnada Lagna', hi: 'वर्णद लग्न' }, desc: { en: 'Computed from the interaction of Lagna and Hora Lagna. Used in Jaimini astrology for determining varna (social standing) and longevity.', hi: 'लग्न और होरा लग्न की अन्तर्क्रिया से गणना। जैमिनी ज्योतिष में वर्ण और दीर्घायु निर्धारण हेतु।' } },
    { name: { en: 'Arudha Lagna (Pada Lagna)', hi: 'आरूढ लग्न (पद लग्न)' }, desc: { en: 'The "image" lagna — shows how the world perceives you versus who you actually are. Calculated as: count from Lagna to its lord, then count the same distance forward from the lord. Crucial in Jaimini system.', hi: 'प्रतिबिम्ब लग्न — दिखाता है कि संसार आपको कैसे देखता है बनाम आप वास्तव में कौन हैं। जैमिनी पद्धति में अत्यन्त महत्वपूर्ण।' } },
  ],

  rectTitle: { en: 'Birth Time Rectification', hi: 'जन्म समय शोधन' },
  rectContent: {
    en: 'Since the Lagna changes every ~2 hours, an inaccurate birth time can place the wrong sign on the ascendant, invalidating the entire chart. Birth time rectification is the art of correcting the recorded time using life events. Common techniques include:',
    hi: 'चूँकि लग्न हर ~2 घण्टे में बदलता है, गलत जन्म समय गलत राशि को लग्न पर रख सकता है, सम्पूर्ण कुण्डली को अमान्य कर सकता है। जन्म समय शोधन जीवन घटनाओं का उपयोग करके दर्ज समय को सही करने की कला है:',
  },
  rectMethods: [
    { en: 'Tattwa Shodhana — checking birth-time against the ruling element (fire/earth/air/water) of the Lagna', hi: 'तत्त्व शोधन — लग्न के शासक तत्व से जन्म समय की जाँच' },
    { en: 'Pranapada — verifying using the Pranapada Lagna position', hi: 'प्राणपद — प्राणपद लग्न स्थिति से सत्यापन' },
    { en: 'Event-based — matching major life events (marriage, children, career changes) to dasha transitions', hi: 'घटना-आधारित — प्रमुख जीवन घटनाओं को दशा परिवर्तनों से मिलान' },
    { en: 'Navamsha verification — ensuring the D9 chart is consistent with marriage and dharmic life patterns', hi: 'नवांश सत्यापन — D9 कुण्डली विवाह और धार्मिक जीवन पैटर्न से सुसंगत है' },
  ],

  lagnaVsMoonTitle: { en: 'Lagna vs Moon Sign vs Sun Sign', hi: 'लग्न बनाम चन्द्र राशि बनाम सूर्य राशि' },
  lagnaVsMoonContent: {
    en: 'A common question: "Which matters more — Lagna or Moon sign?" In Vedic astrology, all three luminaries serve distinct purposes:',
    hi: 'एक सामान्य प्रश्न: "लग्न या चन्द्र राशि — कौन अधिक महत्वपूर्ण?" वैदिक ज्योतिष में तीनों ज्योतियाँ भिन्न उद्देश्यों की पूर्ति करती हैं:',
  },
  comparison: [
    { aspect: { en: 'Lagna (Ascendant)', hi: 'लग्न' }, governs: { en: 'Physical body, appearance, personality, overall life direction, health, longevity', hi: 'शारीरिक शरीर, रूप, व्यक्तित्व, जीवन दिशा, स्वास्थ्य' }, changes: { en: 'Every ~2 hours', hi: 'हर ~2 घण्टे' } },
    { aspect: { en: 'Moon Sign (Rashi)', hi: 'चन्द्र राशि' }, governs: { en: 'Mind, emotions, instincts, habits, comfort zone, mother', hi: 'मन, भावनाएँ, सहज वृत्तियाँ, आदतें, माता' }, changes: { en: 'Every ~2.5 days', hi: 'हर ~2.5 दिन' } },
    { aspect: { en: 'Sun Sign (Rashi)', hi: 'सूर्य राशि' }, governs: { en: 'Soul, ego, authority, father, government, vitality', hi: 'आत्मा, अहंकार, अधिकार, पिता, सरकार' }, changes: { en: 'Every ~30 days', hi: 'हर ~30 दिन' } },
  ],

  misconceptionsTitle: { en: 'Common Misconceptions', hi: 'सामान्य भ्रान्तियाँ' },
  misconceptions: [
    { myth: { en: '"My Sun sign is my main sign"', hi: '"मेरी सूर्य राशि मेरी मुख्य राशि है"' }, truth: { en: 'In Vedic astrology, the Lagna and Moon sign are far more important than the Sun sign. The Western system\'s emphasis on Sun signs has no equivalent in Jyotish.', hi: 'वैदिक ज्योतिष में लग्न और चन्द्र राशि सूर्य राशि से कहीं अधिक महत्वपूर्ण हैं।' } },
    { myth: { en: '"The Lagna is just one of 12 houses"', hi: '"लग्न केवल 12 भावों में से एक है"' }, truth: { en: 'The Lagna is the ANCHOR of all 12 houses. Without a correct Lagna, every house analysis is wrong. It\'s not just one house — it determines ALL houses.', hi: 'लग्न सभी 12 भावों का आधार है। सही लग्न के बिना, प्रत्येक भाव विश्लेषण गलत है।' } },
    { myth: { en: '"Birth time doesn\'t matter much"', hi: '"जन्म समय ज्यादा मायने नहीं रखता"' }, truth: { en: 'A 4-minute error in birth time shifts the Lagna by 1° — enough to change the Navamsha (D9) division, altering marriage predictions entirely.', hi: 'जन्म समय में 4 मिनट की त्रुटि लग्न को 1° खिसकाती है — नवांश बदलने और विवाह भविष्यवाणी बदलने के लिए पर्याप्त।' } },
    { myth: { en: '"Twins have the same chart"', hi: '"जुड़वों की कुण्डली समान होती है"' }, truth: { en: 'Even a few minutes difference can change the Lagna degree, Navamsha, dasha balance, and sub-lord in KP system. Twins often show different D9 charts.', hi: 'कुछ मिनटों का अन्तर भी लग्न अंश, नवांश, दशा सन्तुलन बदल सकता है।' } },
  ],

  muhurtaTitle: { en: 'Lagna in Muhurta Selection — Puja Timing', hi: 'मुहूर्त चयन में लग्न — पूजा समय' },
  muhurtaContent: {
    en: 'One of the most practical uses of Lagna is in selecting auspicious times (Muhurta) for rituals, pujas, and important activities. Websites like Drik Panchang show exact Lagna windows for festivals — for example, "Lakshmi Puja during Vrishabha Lagna: 7:12 PM – 9:04 PM" on Diwali. This is because the rising sign at the time of performing a puja becomes the "birth chart" of that ritual, and different signs are auspicious for different activities.',
    hi: 'लग्न का सबसे व्यावहारिक उपयोग अनुष्ठानों, पूजाओं और महत्वपूर्ण कार्यों के लिए शुभ समय (मुहूर्त) चयन में है। दृक् पंचांग जैसी वेबसाइटें त्यौहारों के लिए सटीक लग्न खिड़कियाँ दिखाती हैं — उदाहरण के लिए, दीवाली पर "वृषभ लग्न में लक्ष्मी पूजा: 7:12 PM – 9:04 PM"। पूजा के समय उदित राशि उस अनुष्ठान की "जन्म कुण्डली" बन जाती है।',
  },
  muhurtaLagnas: [
    { sign: { en: 'Taurus (Vrishabha)', hi: 'वृषभ' }, use: { en: 'Lakshmi Puja, wealth rituals, financial ventures — Venus-ruled, attracts abundance', hi: 'लक्ष्मी पूजा, धन अनुष्ठान, वित्तीय उद्यम — शुक्र-शासित, समृद्धि आकर्षित' } },
    { sign: { en: 'Leo (Simha)', hi: 'सिंह' }, use: { en: 'Government work, authority rituals, Surya puja — Sun-ruled, commands power', hi: 'सरकारी कार्य, अधिकार अनुष्ठान, सूर्य पूजा — सूर्य-शासित, शक्ति प्रदान' } },
    { sign: { en: 'Sagittarius (Dhanu)', hi: 'धनु' }, use: { en: 'Satyanarayan Katha, educational events, guru puja — Jupiter-ruled, spiritual expansion', hi: 'सत्यनारायण कथा, शैक्षिक आयोजन, गुरु पूजा — गुरु-शासित, आध्यात्मिक विस्तार' } },
    { sign: { en: 'Cancer (Karka)', hi: 'कर्क' }, use: { en: 'Griha Pravesh, domestic rituals, nourishment — Moon-ruled, emotional wellbeing', hi: 'गृह प्रवेश, घरेलू अनुष्ठान, पोषण — चन्द्र-शासित, भावनात्मक कल्याण' } },
    { sign: { en: 'Virgo (Kanya)', hi: 'कन्या' }, use: { en: 'Medical procedures, health rituals, service activities — Mercury-ruled, precision', hi: 'चिकित्सा प्रक्रियाएँ, स्वास्थ्य अनुष्ठान, सेवा — बुध-शासित, सटीकता' } },
    { sign: { en: 'Libra (Tula)', hi: 'तुला' }, use: { en: 'Marriage ceremonies, partnerships, art inaugurations — Venus-ruled, harmony', hi: 'विवाह संस्कार, साझेदारी, कला उद्घाटन — शुक्र-शासित, सामंजस्य' } },
  ],
  muhurtaAvoid: {
    en: 'Avoid: Starting pujas during Rahu Kalam or when the rising sign\'s lord is combust, debilitated, or retrograde. Scorpio and Capricorn Lagnas are generally avoided for auspicious ceremonies.',
    hi: 'टालें: राहु काल में पूजा आरम्भ या जब उदय राशि का स्वामी अस्त, नीच या वक्री हो। वृश्चिक और मकर लग्न शुभ संस्कारों के लिए सामान्यतः टाले जाते हैं।',
  },
  muhurtaOurTool: {
    en: 'Our Panchang page shows the Udaya Lagna (rising sign windows) throughout each day, calculated using Swiss Ephemeris for your exact location. Use these windows to time your rituals with the most auspicious rising sign.',
    hi: 'हमारा पंचांग पृष्ठ प्रत्येक दिन उदय लग्न (उदित राशि खिड़कियाँ) दिखाता है, जो Swiss Ephemeris द्वारा आपके सटीक स्थान के लिए गणित है। अपने अनुष्ठानों का समय सबसे शुभ उदय राशि से मिलाएं।',
  },

  classicalTitle: { en: 'Classical References', hi: 'शास्त्रीय सन्दर्भ' },
  classicalContent: {
    en: 'Brihat Parashara Hora Shastra (BPHS) Chapter 3, Verses 1-4 describe the ascendant: "The sign rising at the eastern horizon at birth is the Lagna. From this, the 12 bhavas are counted. The Lagna lord\'s strength determines the native\'s overall fortune." Saravali by Kalyana Varma dedicates Chapter 4 entirely to the effects of different ascendant signs. Phaladeepika by Mantreshwara states: "When the Lagna lord is strong and well-placed, the native will be healthy, handsome, intelligent, and fortunate."',
    hi: 'बृहत्पराशरहोराशास्त्र (BPHS) अध्याय 3, श्लोक 1-4 में लग्न का वर्णन: "जन्म पर पूर्वी क्षितिज पर उदित राशि लग्न है। इससे 12 भाव गिने जाते हैं। लग्नेश की शक्ति जातक का समग्र भाग्य निर्धारित करती है।" सारावली (कल्याण वर्मा) का अध्याय 4 पूर्णतः विभिन्न लग्नों के प्रभावों को समर्पित है।',
  },
};

export default function LagnaPage() {
  const locale = useLocale() as Locale;
  const isDevanagari = locale !== 'en';
  const headingFont = { fontFamily: isDevanagari ? 'var(--font-devanagari-heading)' : 'var(--font-heading)' };
  const bodyFont = isDevanagari ? { fontFamily: 'var(--font-devanagari-body)' } : undefined;
  const t = (obj: { en: string; hi: string; sa?: string }) => obj[locale as 'en' | 'hi'] || obj.en;

  return (
    <div className="max-w-4xl mx-auto space-y-10">
      {/* Title */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
        <h1 className="text-4xl sm:text-5xl font-bold text-gold-gradient mb-4" style={headingFont}>{t(L.title)}</h1>
        <p className="text-text-secondary text-lg max-w-2xl mx-auto" style={bodyFont}>{t(L.subtitle)}</p>
        <SanskritTermCard term="लग्नम्" transliteration="Lagnam" meaning={locale === 'en' || String(locale) === 'ta' ? '"That which is attached" — the sign clinging to the eastern horizon at birth' : '"जो जुड़ा हुआ है" — जन्म पर पूर्वी क्षितिज से जुड़ी राशि'} />
      </motion.div>

      {/* What is Lagna */}
      <LessonSection title={t(L.whatTitle)}>
        <p className="text-text-secondary leading-relaxed" style={bodyFont}>{t(L.whatContent)}</p>
      </LessonSection>

      {/* Why Lagna is Supreme */}
      <LessonSection title={t(L.whyTitle)}>
        <p className="text-text-secondary leading-relaxed" style={bodyFont}>{t(L.whyContent)}</p>
      </LessonSection>

      {/* How Lagna is Calculated */}
      <LessonSection title={t(L.calcTitle)}>
        <p className="text-text-secondary leading-relaxed mb-4" style={bodyFont}>{t(L.calcContent)}</p>
        <div className="space-y-2 mb-4">
          {L.calcSteps.map((step, i) => (
            <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.25 + i * 0.05 }}
              className="p-3 bg-bg-primary/30 rounded-lg border border-gold-primary/10 text-text-secondary text-sm" style={bodyFont}>
              {t(step)}
            </motion.div>
          ))}
        </div>
        <div className="p-3 bg-gold-primary/5 rounded-lg border border-gold-primary/20">
          <p className="text-gold-primary/80 text-xs" style={bodyFont}>{t(L.calcNote)}</p>
        </div>
      </LessonSection>

      {/* How Fast Does Lagna Change */}
      <LessonSection title={t(L.changeTitle)}>
        <p className="text-text-secondary leading-relaxed mb-4" style={bodyFont}>{t(L.changeContent)}</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="p-4 bg-orange-500/5 rounded-lg border border-orange-500/10">
            <p className="text-orange-400 text-sm font-semibold mb-1">{locale === 'en' || String(locale) === 'ta' ? 'Long Ascension' : 'दीर्घ उदय'}</p>
            <p className="text-text-secondary text-sm" style={bodyFont}>{t(L.longAsc)}</p>
          </div>
          <div className="p-4 bg-blue-500/5 rounded-lg border border-blue-500/10">
            <p className="text-blue-400 text-sm font-semibold mb-1">{locale === 'en' || String(locale) === 'ta' ? 'Short Ascension' : 'लघु उदय'}</p>
            <p className="text-text-secondary text-sm" style={bodyFont}>{t(L.shortAsc)}</p>
          </div>
        </div>
      </LessonSection>

      {/* 12 Lagnas */}
      <LessonSection title={t(L.twelveLagnaTitle)}>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {L.lagnas.map((lagna, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 + i * 0.03 }}
              className="p-4 bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl">
              <div className="flex items-center justify-between mb-2">
                <span className="text-gold-light font-semibold" style={headingFont}>{t(lagna.sign)}</span>
                <span className="text-text-tertiary text-xs">{locale === 'en' || String(locale) === 'ta' ? 'Lord' : 'स्वामी'}: {t(lagna.lord)}</span>
              </div>
              <p className="text-text-secondary text-sm" style={bodyFont}>{t(lagna.traits)}</p>
            </motion.div>
          ))}
        </div>
      </LessonSection>

      {/* Lagna Lord */}
      <LessonSection title={t(L.lagnaLordTitle)}>
        <p className="text-text-secondary leading-relaxed" style={bodyFont}>{t(L.lagnaLordContent)}</p>
      </LessonSection>

      {/* Special Lagnas */}
      <LessonSection title={t(L.specialTitle)}>
        <p className="text-text-secondary leading-relaxed mb-4" style={bodyFont}>{t(L.specialContent)}</p>
        <div className="space-y-3">
          {L.specialLagnas.map((sl, i) => (
            <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.45 + i * 0.05 }}
              className="p-4 bg-bg-primary/30 rounded-lg border border-gold-primary/10">
              <h4 className="text-gold-primary font-semibold text-sm mb-1" style={headingFont}>{t(sl.name)}</h4>
              <p className="text-text-secondary text-sm" style={bodyFont}>{t(sl.desc)}</p>
            </motion.div>
          ))}
        </div>
      </LessonSection>

      {/* Birth Time Rectification */}
      <LessonSection title={t(L.rectTitle)}>
        <p className="text-text-secondary leading-relaxed mb-4" style={bodyFont}>{t(L.rectContent)}</p>
        <div className="space-y-2">
          {L.rectMethods.map((method, i) => (
            <div key={i} className="flex items-start gap-2 text-sm">
              <span className="text-gold-primary mt-0.5">&#x2022;</span>
              <span className="text-text-secondary" style={bodyFont}>{t(method)}</span>
            </div>
          ))}
        </div>
      </LessonSection>

      {/* Lagna in Muhurta / Puja Timing */}
      <LessonSection title={t(L.muhurtaTitle)}>
        <p className="text-text-secondary leading-relaxed mb-4" style={bodyFont}>{t(L.muhurtaContent)}</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
          {L.muhurtaLagnas.map((ml, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 + i * 0.04 }}
              className="p-4 bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl">
              <span className="text-gold-light font-semibold text-sm" style={headingFont}>{t(ml.sign)}</span>
              <p className="text-text-secondary text-xs mt-1" style={bodyFont}>{t(ml.use)}</p>
            </motion.div>
          ))}
        </div>
        <div className="p-3 bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] rounded-lg border border-red-500/10 mb-3">
          <p className="text-red-400/80 text-sm" style={bodyFont}>{t(L.muhurtaAvoid)}</p>
        </div>
        <div className="p-3 bg-gold-primary/5 rounded-lg border border-gold-primary/20">
          <p className="text-gold-primary/80 text-sm" style={bodyFont}>
            {t(L.muhurtaOurTool)}{' '}
            <Link href="/panchang" className="text-gold-light underline hover:text-gold-primary">{locale === 'en' || String(locale) === 'ta' ? 'View Today\'s Lagna Windows →' : 'आज की लग्न खिड़कियाँ देखें →'}</Link>
          </p>
        </div>
      </LessonSection>

      {/* Lagna vs Moon vs Sun */}
      <LessonSection title={t(L.lagnaVsMoonTitle)}>
        <p className="text-text-secondary leading-relaxed mb-4" style={bodyFont}>{t(L.lagnaVsMoonContent)}</p>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-gold-primary border-b border-gold-primary/10">
                <th className="text-left py-2 px-3">{locale === 'en' || String(locale) === 'ta' ? 'Reference' : 'सन्दर्भ'}</th>
                <th className="text-left py-2 px-3">{locale === 'en' || String(locale) === 'ta' ? 'Governs' : 'शासन'}</th>
                <th className="text-right py-2 px-3">{locale === 'en' || String(locale) === 'ta' ? 'Changes' : 'परिवर्तन'}</th>
              </tr>
            </thead>
            <tbody>
              {L.comparison.map((row, i) => (
                <tr key={i} className="border-b border-gold-primary/5 text-text-secondary">
                  <td className="py-2 px-3 text-gold-light font-semibold" style={headingFont}>{t(row.aspect)}</td>
                  <td className="py-2 px-3" style={bodyFont}>{t(row.governs)}</td>
                  <td className="py-2 px-3 text-right text-text-tertiary">{t(row.changes)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </LessonSection>

      {/* Misconceptions */}
      <LessonSection title={t(L.misconceptionsTitle)}>
        <div className="space-y-4">
          {L.misconceptions.map((mc, i) => (
            <div key={i} className="p-4 bg-bg-primary/30 rounded-lg border border-gold-primary/10">
              <p className="text-red-400 text-sm font-semibold mb-1" style={bodyFont}>{t(mc.myth)}</p>
              <p className="text-text-secondary text-sm" style={bodyFont}>{t(mc.truth)}</p>
            </div>
          ))}
        </div>
      </LessonSection>

      {/* Classical References */}
      <LessonSection title={t(L.classicalTitle)}>
        <p className="text-text-secondary leading-relaxed" style={bodyFont}>{t(L.classicalContent)}</p>
      </LessonSection>

      {/* Cross-references */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.65 }}
        className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-6 text-center space-y-3">
        <h3 className="text-gold-gradient text-lg font-bold" style={headingFont}>{locale === 'en' || String(locale) === 'ta' ? 'Continue Learning' : 'आगे सीखें'}</h3>
        <div className="flex flex-wrap gap-3 justify-center">
          {[
            { href: '/learn/bhavas', label: locale === 'en' || String(locale) === 'ta' ? 'Bhavas (Houses)' : 'भाव' },
            { href: '/learn/grahas', label: locale === 'en' || String(locale) === 'ta' ? 'Grahas (Planets)' : 'ग्रह' },
            { href: '/learn/kundali', label: locale === 'en' || String(locale) === 'ta' ? 'How a Kundali is Made' : 'कुण्डली कैसे बनती है' },
            { href: '/learn/rashis', label: locale === 'en' || String(locale) === 'ta' ? 'Rashis (Signs)' : 'राशियाँ' },
            { href: '/learn/vargas', label: locale === 'en' || String(locale) === 'ta' ? 'Divisional Charts' : 'विभागीय कुण्डलियाँ' },
          ].map(link => (
            <Link key={link.href} href={link.href}
              className="px-4 py-2 rounded-lg border border-gold-primary/20 text-gold-primary text-sm hover:bg-gold-primary/10 transition-colors">
              {link.label}
            </Link>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
