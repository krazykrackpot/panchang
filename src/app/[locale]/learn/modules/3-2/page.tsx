'use client';

import ModuleContainer, { type ModuleMeta, type ModuleQuestion, useModuleLocale } from '@/components/learn/ModuleContainer';
import { isDevanagariLocale } from '@/lib/utils/locale-fonts';

const META: ModuleMeta = {
  id: 'mod_3_2', phase: 1, topic: 'Rashis', moduleNumber: '3.2',
  title: { en: "Sign Qualities — Chara, Sthira, Dwiswabhava", hi: "राशि गुण — चर, स्थिर, द्विस्वभाव", sa: "राशि गुण — चर, स्थिर, द्विस्वभाव", mai: "राशि गुण — चर, स्थिर, द्विस्वभाव", mr: "राशि गुण — चर, स्थिर, द्विस्वभाव", ta: "Sign Qualities — Chara, Sthira, Dwiswabhava", te: "Sign Qualities — Chara, Sthira, Dwiswabhava", bn: "Sign Qualities — Chara, Sthira, Dwiswabhava", kn: "Sign Qualities — Chara, Sthira, Dwiswabhava", gu: "Sign Qualities — Chara, Sthira, Dwiswabhava" },
  subtitle: { en: "Movable, Fixed, and Dual signs combined with Fire, Earth, Air, and Water create 12 unique energy patterns", hi: "चर, स्थिर और द्विस्वभाव राशियाँ अग्नि, पृथ्वी, वायु और जल के साथ मिलकर 12 अद्वितीय ऊर्जा प्रतिरूप बनाती हैं", sa: "चर, स्थिर और द्विस्वभाव राशियाँ अग्नि, पृथ्वी, वायु और जल के साथ मिलकर 12 अद्वितीय ऊर्जा प्रतिरूप बनाती हैं", mai: "चर, स्थिर और द्विस्वभाव राशियाँ अग्नि, पृथ्वी, वायु और जल के साथ मिलकर 12 अद्वितीय ऊर्जा प्रतिरूप बनाती हैं", mr: "चर, स्थिर और द्विस्वभाव राशियाँ अग्नि, पृथ्वी, वायु और जल के साथ मिलकर 12 अद्वितीय ऊर्जा प्रतिरूप बनाती हैं", ta: "Movable, Fixed, and Dual signs combined with Fire, Earth, Air, and Water create 12 unique energy patterns", te: "Movable, Fixed, and Dual signs combined with Fire, Earth, Air, and Water create 12 unique energy patterns", bn: "Movable, Fixed, and Dual signs combined with Fire, Earth, Air, and Water create 12 unique energy patterns", kn: "Movable, Fixed, and Dual signs combined with Fire, Earth, Air, and Water create 12 unique energy patterns", gu: "Movable, Fixed, and Dual signs combined with Fire, Earth, Air, and Water create 12 unique energy patterns" },
  estimatedMinutes: 15,
  crossRefs: [
    { label: { en: 'Module 3-1: The 12 Signs', hi: 'मॉड्यूल 3-1: 12 राशियाँ', sa: 'मॉड्यूल 3-1: 12 राशियाँ', mai: 'मॉड्यूल 3-1: 12 राशियाँ', mr: 'मॉड्यूल 3-1: 12 राशियाँ', ta: 'Module 3-1: The 12 Signs', te: 'Module 3-1: The 12 Signs', bn: 'Module 3-1: The 12 Signs', kn: 'Module 3-1: The 12 Signs', gu: 'Module 3-1: The 12 Signs' }, href: '/learn/modules/3-1' },
    { label: { en: 'Module 3-3: Sign Rulerships', hi: 'मॉड्यूल 3-3: राशि स्वामित्व', sa: 'मॉड्यूल 3-3: राशि स्वामित्व', mai: 'मॉड्यूल 3-3: राशि स्वामित्व', mr: 'मॉड्यूल 3-3: राशि स्वामित्व', ta: 'Module 3-3: Sign Rulerships', te: 'Module 3-3: Sign Rulerships', bn: 'Module 3-3: Sign Rulerships', kn: 'Module 3-3: Sign Rulerships', gu: 'Module 3-3: Sign Rulerships' }, href: '/learn/modules/3-3' },
    { label: { en: 'Rashis Deep Dive', hi: 'राशि विस्तार', sa: 'राशि विस्तार', mai: 'राशि विस्तार', mr: 'राशि विस्तार', ta: 'Rashis Deep Dive', te: 'Rashis Deep Dive', bn: 'Rashis Deep Dive', kn: 'Rashis Deep Dive', gu: 'Rashis Deep Dive' }, href: '/learn/rashis' },
  ],
};

const QUESTIONS: ModuleQuestion[] = [
  {
    id: 'q3_2_01', type: 'mcq',
    question: { en: "Which signs are Movable (Chara)?", hi: "कौन सी राशियाँ चर (गतिशील) हैं?", sa: "कौन सी राशियाँ चर (गतिशील) हैं?", mai: "कौन सी राशियाँ चर (गतिशील) हैं?", mr: "कौन सी राशियाँ चर (गतिशील) हैं?", ta: "Which signs are Movable (Chara)?", te: "Which signs are Movable (Chara)?", bn: "Which signs are Movable (Chara)?", kn: "Which signs are Movable (Chara)?", gu: "Which signs are Movable (Chara)?" },
    options: [
      { en: "Taurus, Leo, Scorpio, Aquarius", hi: "वृषभ, सिंह, वृश्चिक, कुम्भ", sa: "वृषभ, सिंह, वृश्चिक, कुम्भ", mai: "वृषभ, सिंह, वृश्चिक, कुम्भ", mr: "वृषभ, सिंह, वृश्चिक, कुम्भ", ta: "Taurus, Leo, Scorpio, Aquarius", te: "Taurus, Leo, Scorpio, Aquarius", bn: "Taurus, Leo, Scorpio, Aquarius", kn: "Taurus, Leo, Scorpio, Aquarius", gu: "Taurus, Leo, Scorpio, Aquarius" },
      { en: "Aries, Cancer, Libra, Capricorn", hi: "मेष, कर्क, तुला, मकर", sa: "मेष, कर्क, तुला, मकर", mai: "मेष, कर्क, तुला, मकर", mr: "मेष, कर्क, तुला, मकर", ta: "Aries, Cancer, Libra, Capricorn", te: "Aries, Cancer, Libra, Capricorn", bn: "Aries, Cancer, Libra, Capricorn", kn: "Aries, Cancer, Libra, Capricorn", gu: "Aries, Cancer, Libra, Capricorn" },
      { en: "Gemini, Virgo, Sagittarius, Pisces", hi: "मिथुन, कन्या, धनु, मीन", sa: "मिथुन, कन्या, धनु, मीन", mai: "मिथुन, कन्या, धनु, मीन", mr: "मिथुन, कन्या, धनु, मीन", ta: "Gemini, Virgo, Sagittarius, Pisces", te: "Gemini, Virgo, Sagittarius, Pisces", bn: "Gemini, Virgo, Sagittarius, Pisces", kn: "Gemini, Virgo, Sagittarius, Pisces", gu: "Gemini, Virgo, Sagittarius, Pisces" },
      { en: "All fire signs", hi: "सभी अग्नि राशियाँ", sa: "सभी अग्नि राशियाँ", mai: "सभी अग्नि राशियाँ", mr: "सभी अग्नि राशियाँ", ta: "All fire signs", te: "All fire signs", bn: "All fire signs", kn: "All fire signs", gu: "All fire signs" },
    ],
    correctAnswer: 1,
    explanation: { en: "Movable signs are at the 4 cardinal points: 1st(Aries), 4th(Cancer), 7th(Libra), 10th(Capricorn). These correspond to the Kendras (angular houses).", hi: "चर राशियाँ 4 कार्डिनल बिन्दुओं पर हैं: 1(मेष), 4(कर्क), 7(तुला), 10(मकर)। ये केन्द्र भावों से मेल खाती हैं।", sa: "चर राशियाँ 4 कार्डिनल बिन्दुओं पर हैं: 1(मेष), 4(कर्क), 7(तुला), 10(मकर)। ये केन्द्र भावों से मेल खाती हैं।", mai: "चर राशियाँ 4 कार्डिनल बिन्दुओं पर हैं: 1(मेष), 4(कर्क), 7(तुला), 10(मकर)। ये केन्द्र भावों से मेल खाती हैं।", mr: "चर राशियाँ 4 कार्डिनल बिन्दुओं पर हैं: 1(मेष), 4(कर्क), 7(तुला), 10(मकर)। ये केन्द्र भावों से मेल खाती हैं।", ta: "Movable signs are at the 4 cardinal points: 1st(Aries), 4th(Cancer), 7th(Libra), 10th(Capricorn). These correspond to the Kendras (angular houses).", te: "Movable signs are at the 4 cardinal points: 1st(Aries), 4th(Cancer), 7th(Libra), 10th(Capricorn). These correspond to the Kendras (angular houses).", bn: "Movable signs are at the 4 cardinal points: 1st(Aries), 4th(Cancer), 7th(Libra), 10th(Capricorn). These correspond to the Kendras (angular houses).", kn: "Movable signs are at the 4 cardinal points: 1st(Aries), 4th(Cancer), 7th(Libra), 10th(Capricorn). These correspond to the Kendras (angular houses).", gu: "Movable signs are at the 4 cardinal points: 1st(Aries), 4th(Cancer), 7th(Libra), 10th(Capricorn). These correspond to the Kendras (angular houses)." },
    classicalRef: "BPHS Ch.4 v.7",
  },
  {
    id: 'q3_2_02', type: 'mcq',
    question: { en: "What element is Aquarius?", hi: "कुम्भ राशि का तत्व क्या है?", sa: "कुम्भ राशि का तत्व क्या है?", mai: "कुम्भ राशि का तत्व क्या है?", mr: "कुम्भ राशि का तत्व क्या है?", ta: "What element is Aquarius?", te: "What element is Aquarius?", bn: "What element is Aquarius?", kn: "What element is Aquarius?", gu: "What element is Aquarius?" },
    options: [
      { en: "Fire", hi: "अग्नि", sa: "अग्नि", mai: "अग्नि", mr: "अग्नि", ta: "Fire", te: "Fire", bn: "Fire", kn: "Fire", gu: "Fire" },
      { en: "Earth", hi: "पृथ्वी", sa: "पृथ्वी", mai: "पृथ्वी", mr: "पृथ्वी", ta: "Earth", te: "Earth", bn: "Earth", kn: "Earth", gu: "Earth" },
      { en: "Air", hi: "वायु", sa: "वायु", mai: "वायु", mr: "वायु", ta: "Air", te: "Air", bn: "Air", kn: "Air", gu: "Air" },
      { en: "Water", hi: "जल", sa: "जल", mai: "जल", mr: "जल", ta: "Water", te: "Water", bn: "Water", kn: "Water", gu: "Water" },
    ],
    correctAnswer: 2,
    explanation: { en: "Aquarius is an AIR sign despite the water-bearer imagery. Air signs: Gemini, Libra, Aquarius. The water-bearer represents distribution of knowledge, not the water element.", hi: "कुम्भ जल-वाहक चित्रण के बावजूद वायु राशि है। वायु राशियाँ: मिथुन, तुला, कुम्भ। जल-वाहक ज्ञान के वितरण का प्रतीक है, जल तत्व का नहीं।", sa: "कुम्भ जल-वाहक चित्रण के बावजूद वायु राशि है। वायु राशियाँ: मिथुन, तुला, कुम्भ। जल-वाहक ज्ञान के वितरण का प्रतीक है, जल तत्व का नहीं।", mai: "कुम्भ जल-वाहक चित्रण के बावजूद वायु राशि है। वायु राशियाँ: मिथुन, तुला, कुम्भ। जल-वाहक ज्ञान के वितरण का प्रतीक है, जल तत्व का नहीं।", mr: "कुम्भ जल-वाहक चित्रण के बावजूद वायु राशि है। वायु राशियाँ: मिथुन, तुला, कुम्भ। जल-वाहक ज्ञान के वितरण का प्रतीक है, जल तत्व का नहीं।", ta: "Aquarius is an AIR sign despite the water-bearer imagery. Air signs: Gemini, Libra, Aquarius. The water-bearer represents distribution of knowledge, not the water element.", te: "Aquarius is an AIR sign despite the water-bearer imagery. Air signs: Gemini, Libra, Aquarius. The water-bearer represents distribution of knowledge, not the water element.", bn: "Aquarius is an AIR sign despite the water-bearer imagery. Air signs: Gemini, Libra, Aquarius. The water-bearer represents distribution of knowledge, not the water element.", kn: "Aquarius is an AIR sign despite the water-bearer imagery. Air signs: Gemini, Libra, Aquarius. The water-bearer represents distribution of knowledge, not the water element.", gu: "Aquarius is an AIR sign despite the water-bearer imagery. Air signs: Gemini, Libra, Aquarius. The water-bearer represents distribution of knowledge, not the water element." },
  },
  {
    id: 'q3_2_03', type: 'true_false',
    question: { en: "Odd-numbered signs (1,3,5,7,9,11) are Male and Diurnal.", hi: "विषम-संख्या राशियाँ (1,3,5,7,9,11) पुरुष और दिवाचर हैं।", sa: "विषम-संख्या राशियाँ (1,3,5,7,9,11) पुरुष और दिवाचर हैं।", mai: "विषम-संख्या राशियाँ (1,3,5,7,9,11) पुरुष और दिवाचर हैं।", mr: "विषम-संख्या राशियाँ (1,3,5,7,9,11) पुरुष और दिवाचर हैं।", ta: "Odd-numbered signs (1,3,5,7,9,11) are Male and Diurnal.", te: "Odd-numbered signs (1,3,5,7,9,11) are Male and Diurnal.", bn: "Odd-numbered signs (1,3,5,7,9,11) are Male and Diurnal.", kn: "Odd-numbered signs (1,3,5,7,9,11) are Male and Diurnal.", gu: "Odd-numbered signs (1,3,5,7,9,11) are Male and Diurnal." },
    correctAnswer: true,
    explanation: { en: "Correct. Odd = Male/Purusha/Day-strong. Even = Female/Stri/Night-strong. This alternating pattern creates balance in the zodiac.", hi: "सही। विषम = पुरुष/दिवा-बली। सम = स्त्री/रात्रि-बली। यह वैकल्पिक प्रतिरूप राशिचक्र में सन्तुलन बनाता है।", sa: "सही। विषम = पुरुष/दिवा-बली। सम = स्त्री/रात्रि-बली। यह वैकल्पिक प्रतिरूप राशिचक्र में सन्तुलन बनाता है।", mai: "सही। विषम = पुरुष/दिवा-बली। सम = स्त्री/रात्रि-बली। यह वैकल्पिक प्रतिरूप राशिचक्र में सन्तुलन बनाता है।", mr: "सही। विषम = पुरुष/दिवा-बली। सम = स्त्री/रात्रि-बली। यह वैकल्पिक प्रतिरूप राशिचक्र में सन्तुलन बनाता है।", ta: "Correct. Odd = Male/Purusha/Day-strong. Even = Female/Stri/Night-strong. This alternating pattern creates balance in the zodiac.", te: "Correct. Odd = Male/Purusha/Day-strong. Even = Female/Stri/Night-strong. This alternating pattern creates balance in the zodiac.", bn: "Correct. Odd = Male/Purusha/Day-strong. Even = Female/Stri/Night-strong. This alternating pattern creates balance in the zodiac.", kn: "Correct. Odd = Male/Purusha/Day-strong. Even = Female/Stri/Night-strong. This alternating pattern creates balance in the zodiac.", gu: "Correct. Odd = Male/Purusha/Day-strong. Even = Female/Stri/Night-strong. This alternating pattern creates balance in the zodiac." },
    classicalRef: "BPHS Ch.4",
  },
  {
    id: 'q3_2_04', type: 'mcq',
    question: { en: "Shirshodaya signs manifest events:", hi: "शीर्षोदय राशियाँ घटनाओं को प्रकट करती हैं:", sa: "शीर्षोदय राशियाँ घटनाओं को प्रकट करती हैं:", mai: "शीर्षोदय राशियाँ घटनाओं को प्रकट करती हैं:", mr: "शीर्षोदय राशियाँ घटनाओं को प्रकट करती हैं:", ta: "Shirshodaya signs manifest events:", te: "Shirshodaya signs manifest events:", bn: "Shirshodaya signs manifest events:", kn: "Shirshodaya signs manifest events:", gu: "Shirshodaya signs manifest events:" },
    options: [
      { en: "Slowly", hi: "धीरे", sa: "धीरे", mai: "धीरे", mr: "धीरे", ta: "Slowly", te: "Slowly", bn: "Slowly", kn: "Slowly", gu: "Slowly" },
      { en: "Quickly (head rises first)", hi: "शीघ्र (सिर पहले उदय होता है)", sa: "शीघ्र (सिर पहले उदय होता है)", mai: "शीघ्र (सिर पहले उदय होता है)", mr: "शीघ्र (सिर पहले उदय होता है)", ta: "Quickly (head rises first)", te: "Quickly (head rises first)", bn: "Quickly (head rises first)", kn: "Quickly (head rises first)", gu: "Quickly (head rises first)" },
      { en: "Only at night", hi: "केवल रात में", sa: "केवल रात में", mai: "केवल रात में", mr: "केवल रात में", ta: "Only at night", te: "Only at night", bn: "Only at night", kn: "Only at night", gu: "Only at night" },
      { en: "Never", hi: "कभी नहीं", sa: "कभी नहीं", mai: "कभी नहीं", mr: "कभी नहीं", ta: "Never", te: "Never", bn: "Never", kn: "Never", gu: "Never" },
    ],
    correctAnswer: 1,
    explanation: { en: "Shirshodaya = head-first rising. Events from these signs (Gemini, Leo, Virgo, Libra, Scorpio, Aquarius) manifest quickly. This is especially important in Prashna astrology.", hi: "शीर्षोदय = सिर-पहले उदय। इन राशियों (मिथुन, सिंह, कन्या, तुला, वृश्चिक, कुम्भ) की घटनाएँ शीघ्र प्रकट होती हैं।", sa: "शीर्षोदय = सिर-पहले उदय। इन राशियों (मिथुन, सिंह, कन्या, तुला, वृश्चिक, कुम्भ) की घटनाएँ शीघ्र प्रकट होती हैं।", mai: "शीर्षोदय = सिर-पहले उदय। इन राशियों (मिथुन, सिंह, कन्या, तुला, वृश्चिक, कुम्भ) की घटनाएँ शीघ्र प्रकट होती हैं।", mr: "शीर्षोदय = सिर-पहले उदय। इन राशियों (मिथुन, सिंह, कन्या, तुला, वृश्चिक, कुम्भ) की घटनाएँ शीघ्र प्रकट होती हैं।", ta: "Shirshodaya = head-first rising. Events from these signs (Gemini, Leo, Virgo, Libra, Scorpio, Aquarius) manifest quickly. This is especially important in Prashna astrology.", te: "Shirshodaya = head-first rising. Events from these signs (Gemini, Leo, Virgo, Libra, Scorpio, Aquarius) manifest quickly. This is especially important in Prashna astrology.", bn: "Shirshodaya = head-first rising. Events from these signs (Gemini, Leo, Virgo, Libra, Scorpio, Aquarius) manifest quickly. This is especially important in Prashna astrology.", kn: "Shirshodaya = head-first rising. Events from these signs (Gemini, Leo, Virgo, Libra, Scorpio, Aquarius) manifest quickly. This is especially important in Prashna astrology.", gu: "Shirshodaya = head-first rising. Events from these signs (Gemini, Leo, Virgo, Libra, Scorpio, Aquarius) manifest quickly. This is especially important in Prashna astrology." },
  },
  {
    id: 'q3_2_05', type: 'mcq',
    question: { en: "3 Qualities × 4 Elements = ?", hi: "3 गुण × 4 तत्व = ?", sa: "3 गुण × 4 तत्व = ?", mai: "3 गुण × 4 तत्व = ?", mr: "3 गुण × 4 तत्व = ?", ta: "3 Qualities × 4 Elements = ?", te: "3 Qualities × 4 Elements = ?", bn: "3 Qualities × 4 Elements = ?", kn: "3 Qualities × 4 Elements = ?", gu: "3 Qualities × 4 Elements = ?" },
    options: [
      { en: "8 combinations", hi: "8 संयोजन", sa: "8 संयोजन", mai: "8 संयोजन", mr: "8 संयोजन", ta: "8 combinations", te: "8 combinations", bn: "8 combinations", kn: "8 combinations", gu: "8 combinations" },
      { en: "10 combinations", hi: "10 संयोजन", sa: "10 संयोजन", mai: "10 संयोजन", mr: "10 संयोजन", ta: "10 combinations", te: "10 combinations", bn: "10 combinations", kn: "10 combinations", gu: "10 combinations" },
      { en: "12 unique combinations (= 12 signs)", hi: "12 अद्वितीय संयोजन (= 12 राशियाँ)", sa: "12 अद्वितीय संयोजन (= 12 राशियाँ)", mai: "12 अद्वितीय संयोजन (= 12 राशियाँ)", mr: "12 अद्वितीय संयोजन (= 12 राशियाँ)", ta: "12 unique combinations (= 12 signs)", te: "12 unique combinations (= 12 signs)", bn: "12 unique combinations (= 12 signs)", kn: "12 unique combinations (= 12 signs)", gu: "12 unique combinations (= 12 signs)" },
      { en: "16 combinations", hi: "16 संयोजन", sa: "16 संयोजन", mai: "16 संयोजन", mr: "16 संयोजन", ta: "16 combinations", te: "16 combinations", bn: "16 combinations", kn: "16 combinations", gu: "16 combinations" },
    ],
    correctAnswer: 2,
    explanation: { en: "3 × 4 = 12 — each sign has a unique quality-element combination. This is NOT coincidental; it's the mathematical structure of the zodiac.", hi: "3 × 4 = 12 — प्रत्येक राशि का एक अद्वितीय गुण-तत्व संयोजन है। यह संयोग नहीं; यह राशिचक्र की गणितीय संरचना है।", sa: "3 × 4 = 12 — प्रत्येक राशि का एक अद्वितीय गुण-तत्व संयोजन है। यह संयोग नहीं; यह राशिचक्र की गणितीय संरचना है।", mai: "3 × 4 = 12 — प्रत्येक राशि का एक अद्वितीय गुण-तत्व संयोजन है। यह संयोग नहीं; यह राशिचक्र की गणितीय संरचना है।", mr: "3 × 4 = 12 — प्रत्येक राशि का एक अद्वितीय गुण-तत्व संयोजन है। यह संयोग नहीं; यह राशिचक्र की गणितीय संरचना है।", ta: "3 × 4 = 12 — each sign has a unique quality-element combination. This is NOT coincidental; it's the mathematical structure of the zodiac.", te: "3 × 4 = 12 — each sign has a unique quality-element combination. This is NOT coincidental; it's the mathematical structure of the zodiac.", bn: "3 × 4 = 12 — each sign has a unique quality-element combination. This is NOT coincidental; it's the mathematical structure of the zodiac.", kn: "3 × 4 = 12 — each sign has a unique quality-element combination. This is NOT coincidental; it's the mathematical structure of the zodiac.", gu: "3 × 4 = 12 — each sign has a unique quality-element combination. This is NOT coincidental; it's the mathematical structure of the zodiac." },
  },
  {
    id: 'q3_2_06', type: 'true_false',
    question: { en: "Cancer is a Movable Water sign.", hi: "कर्क एक चर जल राशि है।", sa: "कर्क एक चर जल राशि है।", mai: "कर्क एक चर जल राशि है।", mr: "कर्क एक चर जल राशि है।", ta: "Cancer is a Movable Water sign.", te: "Cancer is a Movable Water sign.", bn: "Cancer is a Movable Water sign.", kn: "Cancer is a Movable Water sign.", gu: "Cancer is a Movable Water sign." },
    correctAnswer: true,
    explanation: { en: "Correct. Cancer = Movable (initiates) + Water (emotion). It initiates emotional connections, home-building, and nurturing — all water-like actions with cardinal energy.", hi: "सही। कर्क = चर (आरम्भ करता है) + जल (भावना)। यह भावनात्मक सम्बन्ध, गृह-निर्माण और पोषण आरम्भ करता है।", sa: "सही। कर्क = चर (आरम्भ करता है) + जल (भावना)। यह भावनात्मक सम्बन्ध, गृह-निर्माण और पोषण आरम्भ करता है।", mai: "सही। कर्क = चर (आरम्भ करता है) + जल (भावना)। यह भावनात्मक सम्बन्ध, गृह-निर्माण और पोषण आरम्भ करता है।", mr: "सही। कर्क = चर (आरम्भ करता है) + जल (भावना)। यह भावनात्मक सम्बन्ध, गृह-निर्माण और पोषण आरम्भ करता है।", ta: "Correct. Cancer = Movable (initiates) + Water (emotion). It initiates emotional connections, home-building, and nurturing — all water-like actions with cardinal energy.", te: "Correct. Cancer = Movable (initiates) + Water (emotion). It initiates emotional connections, home-building, and nurturing — all water-like actions with cardinal energy.", bn: "Correct. Cancer = Movable (initiates) + Water (emotion). It initiates emotional connections, home-building, and nurturing — all water-like actions with cardinal energy.", kn: "Correct. Cancer = Movable (initiates) + Water (emotion). It initiates emotional connections, home-building, and nurturing — all water-like actions with cardinal energy.", gu: "Correct. Cancer = Movable (initiates) + Water (emotion). It initiates emotional connections, home-building, and nurturing — all water-like actions with cardinal energy." },
  },
  {
    id: 'q3_2_07', type: 'mcq',
    question: { en: "Which house positions do the Fixed signs occupy?", hi: "स्थिर राशियाँ किन भाव स्थानों पर होती हैं?", sa: "स्थिर राशियाँ किन भाव स्थानों पर होती हैं?", mai: "स्थिर राशियाँ किन भाव स्थानों पर होती हैं?", mr: "स्थिर राशियाँ किन भाव स्थानों पर होती हैं?", ta: "Which house positions do the Fixed signs occupy?", te: "Which house positions do the Fixed signs occupy?", bn: "Which house positions do the Fixed signs occupy?", kn: "Which house positions do the Fixed signs occupy?", gu: "Which house positions do the Fixed signs occupy?" },
    options: [
      { en: "1, 4, 7, 10", hi: "1, 4, 7, 10", sa: "1, 4, 7, 10", mai: "1, 4, 7, 10", mr: "1, 4, 7, 10", ta: "1, 4, 7, 10", te: "1, 4, 7, 10", bn: "1, 4, 7, 10", kn: "1, 4, 7, 10", gu: "1, 4, 7, 10" },
      { en: "2, 5, 8, 11", hi: "2, 5, 8, 11", sa: "2, 5, 8, 11", mai: "2, 5, 8, 11", mr: "2, 5, 8, 11", ta: "2, 5, 8, 11", te: "2, 5, 8, 11", bn: "2, 5, 8, 11", kn: "2, 5, 8, 11", gu: "2, 5, 8, 11" },
      { en: "3, 6, 9, 12", hi: "3, 6, 9, 12", sa: "3, 6, 9, 12", mai: "3, 6, 9, 12", mr: "3, 6, 9, 12", ta: "3, 6, 9, 12", te: "3, 6, 9, 12", bn: "3, 6, 9, 12", kn: "3, 6, 9, 12", gu: "3, 6, 9, 12" },
      { en: "1, 2, 3, 4", hi: "1, 2, 3, 4", sa: "1, 2, 3, 4", mai: "1, 2, 3, 4", mr: "1, 2, 3, 4", ta: "1, 2, 3, 4", te: "1, 2, 3, 4", bn: "1, 2, 3, 4", kn: "1, 2, 3, 4", gu: "1, 2, 3, 4" },
    ],
    correctAnswer: 1,
    explanation: { en: "Fixed signs = houses 2, 5, 8, 11 (Panaphara houses). Movable = 1,4,7,10 (Kendras). Dual = 3,6,9,12 (Apoklima).", hi: "स्थिर राशियाँ = भाव 2, 5, 8, 11 (पणफर भाव)। चर = 1,4,7,10 (केन्द्र)। द्वि = 3,6,9,12 (आपोक्लिम)।", sa: "स्थिर राशियाँ = भाव 2, 5, 8, 11 (पणफर भाव)। चर = 1,4,7,10 (केन्द्र)। द्वि = 3,6,9,12 (आपोक्लिम)।", mai: "स्थिर राशियाँ = भाव 2, 5, 8, 11 (पणफर भाव)। चर = 1,4,7,10 (केन्द्र)। द्वि = 3,6,9,12 (आपोक्लिम)।", mr: "स्थिर राशियाँ = भाव 2, 5, 8, 11 (पणफर भाव)। चर = 1,4,7,10 (केन्द्र)। द्वि = 3,6,9,12 (आपोक्लिम)।", ta: "Fixed signs = houses 2, 5, 8, 11 (Panaphara houses). Movable = 1,4,7,10 (Kendras). Dual = 3,6,9,12 (Apoklima).", te: "Fixed signs = houses 2, 5, 8, 11 (Panaphara houses). Movable = 1,4,7,10 (Kendras). Dual = 3,6,9,12 (Apoklima).", bn: "Fixed signs = houses 2, 5, 8, 11 (Panaphara houses). Movable = 1,4,7,10 (Kendras). Dual = 3,6,9,12 (Apoklima).", kn: "Fixed signs = houses 2, 5, 8, 11 (Panaphara houses). Movable = 1,4,7,10 (Kendras). Dual = 3,6,9,12 (Apoklima).", gu: "Fixed signs = houses 2, 5, 8, 11 (Panaphara houses). Movable = 1,4,7,10 (Kendras). Dual = 3,6,9,12 (Apoklima)." },
  },
  {
    id: 'q3_2_08', type: 'mcq',
    question: { en: "A chart with most planets in Fire signs suggests a person who is:", hi: "अग्नि राशियों में अधिकांश ग्रहों वाली कुण्डली व्यक्ति को सुझाती है:", sa: "अग्नि राशियों में अधिकांश ग्रहों वाली कुण्डली व्यक्ति को सुझाती है:", mai: "अग्नि राशियों में अधिकांश ग्रहों वाली कुण्डली व्यक्ति को सुझाती है:", mr: "अग्नि राशियों में अधिकांश ग्रहों वाली कुण्डली व्यक्ति को सुझाती है:", ta: "A chart with most planets in Fire signs suggests a person who is:", te: "A chart with most planets in Fire signs suggests a person who is:", bn: "A chart with most planets in Fire signs suggests a person who is:", kn: "A chart with most planets in Fire signs suggests a person who is:", gu: "A chart with most planets in Fire signs suggests a person who is:" },
    options: [
      { en: "Emotionally sensitive and intuitive", hi: "भावनात्मक रूप से संवेदनशील और अन्तर्ज्ञानी", sa: "भावनात्मक रूप से संवेदनशील और अन्तर्ज्ञानी", mai: "भावनात्मक रूप से संवेदनशील और अन्तर्ज्ञानी", mr: "भावनात्मक रूप से संवेदनशील और अन्तर्ज्ञानी", ta: "Emotionally sensitive and intuitive", te: "Emotionally sensitive and intuitive", bn: "Emotionally sensitive and intuitive", kn: "Emotionally sensitive and intuitive", gu: "Emotionally sensitive and intuitive" },
      { en: "Practical, methodical, and grounded", hi: "व्यावहारिक, व्यवस्थित और ज़मीन से जुड़ा", sa: "व्यावहारिक, व्यवस्थित और ज़मीन से जुड़ा", mai: "व्यावहारिक, व्यवस्थित और ज़मीन से जुड़ा", mr: "व्यावहारिक, व्यवस्थित और ज़मीन से जुड़ा", ta: "Practical, methodical, and grounded", te: "Practical, methodical, and grounded", bn: "Practical, methodical, and grounded", kn: "Practical, methodical, and grounded", gu: "Practical, methodical, and grounded" },
      { en: "Action-oriented, energetic, possibly aggressive", hi: "कर्म-उन्मुख, ऊर्जावान, सम्भवतः आक्रामक", sa: "कर्म-उन्मुख, ऊर्जावान, सम्भवतः आक्रामक", mai: "कर्म-उन्मुख, ऊर्जावान, सम्भवतः आक्रामक", mr: "कर्म-उन्मुख, ऊर्जावान, सम्भवतः आक्रामक", ta: "Action-oriented, energetic, possibly aggressive", te: "Action-oriented, energetic, possibly aggressive", bn: "Action-oriented, energetic, possibly aggressive", kn: "Action-oriented, energetic, possibly aggressive", gu: "Action-oriented, energetic, possibly aggressive" },
      { en: "Intellectual, communicative, and detached", hi: "बौद्धिक, संवादशील और निर्लिप्त", sa: "बौद्धिक, संवादशील और निर्लिप्त", mai: "बौद्धिक, संवादशील और निर्लिप्त", mr: "बौद्धिक, संवादशील और निर्लिप्त", ta: "Intellectual, communicative, and detached", te: "Intellectual, communicative, and detached", bn: "Intellectual, communicative, and detached", kn: "Intellectual, communicative, and detached", gu: "Intellectual, communicative, and detached" },
    ],
    correctAnswer: 2,
    explanation: { en: "Fire (Agni) element = action, energy, initiative, leadership. Too much fire can manifest as aggression, impatience, or burnout. Fire signs: Aries, Leo, Sagittarius.", hi: "अग्नि तत्व = क्रिया, ऊर्जा, पहल, नेतृत्व। अत्यधिक अग्नि आक्रामकता या अधीरता के रूप में प्रकट हो सकती है।", sa: "अग्नि तत्व = क्रिया, ऊर्जा, पहल, नेतृत्व। अत्यधिक अग्नि आक्रामकता या अधीरता के रूप में प्रकट हो सकती है।", mai: "अग्नि तत्व = क्रिया, ऊर्जा, पहल, नेतृत्व। अत्यधिक अग्नि आक्रामकता या अधीरता के रूप में प्रकट हो सकती है।", mr: "अग्नि तत्व = क्रिया, ऊर्जा, पहल, नेतृत्व। अत्यधिक अग्नि आक्रामकता या अधीरता के रूप में प्रकट हो सकती है।", ta: "Fire (Agni) element = action, energy, initiative, leadership. Too much fire can manifest as aggression, impatience, or burnout. Fire signs: Aries, Leo, Sagittarius.", te: "Fire (Agni) element = action, energy, initiative, leadership. Too much fire can manifest as aggression, impatience, or burnout. Fire signs: Aries, Leo, Sagittarius.", bn: "Fire (Agni) element = action, energy, initiative, leadership. Too much fire can manifest as aggression, impatience, or burnout. Fire signs: Aries, Leo, Sagittarius.", kn: "Fire (Agni) element = action, energy, initiative, leadership. Too much fire can manifest as aggression, impatience, or burnout. Fire signs: Aries, Leo, Sagittarius.", gu: "Fire (Agni) element = action, energy, initiative, leadership. Too much fire can manifest as aggression, impatience, or burnout. Fire signs: Aries, Leo, Sagittarius." },
  },
  {
    id: 'q3_2_09', type: 'mcq',
    question: { en: "Which element is associated with intellectual and communicative energy?", hi: "कौन सा तत्व बौद्धिक और संवादात्मक ऊर्जा से जुड़ा है?", sa: "कौन सा तत्व बौद्धिक और संवादात्मक ऊर्जा से जुड़ा है?", mai: "कौन सा तत्व बौद्धिक और संवादात्मक ऊर्जा से जुड़ा है?", mr: "कौन सा तत्व बौद्धिक और संवादात्मक ऊर्जा से जुड़ा है?", ta: "Which element is associated with intellectual and communicative energy?", te: "Which element is associated with intellectual and communicative energy?", bn: "Which element is associated with intellectual and communicative energy?", kn: "Which element is associated with intellectual and communicative energy?", gu: "Which element is associated with intellectual and communicative energy?" },
    options: [
      { en: "Fire (Agni)", hi: "अग्नि", sa: "अग्नि", mai: "अग्नि", mr: "अग्नि", ta: "Fire (Agni)", te: "Fire (Agni)", bn: "Fire (Agni)", kn: "Fire (Agni)", gu: "Fire (Agni)" },
      { en: "Earth (Prithvi)", hi: "पृथ्वी", sa: "पृथ्वी", mai: "पृथ्वी", mr: "पृथ्वी", ta: "Earth (Prithvi)", te: "Earth (Prithvi)", bn: "Earth (Prithvi)", kn: "Earth (Prithvi)", gu: "Earth (Prithvi)" },
      { en: "Air (Vayu)", hi: "वायु", sa: "वायु", mai: "वायु", mr: "वायु", ta: "Air (Vayu)", te: "Air (Vayu)", bn: "Air (Vayu)", kn: "Air (Vayu)", gu: "Air (Vayu)" },
      { en: "Water (Jala)", hi: "जल", sa: "जल", mai: "जल", mr: "जल", ta: "Water (Jala)", te: "Water (Jala)", bn: "Water (Jala)", kn: "Water (Jala)", gu: "Water (Jala)" },
    ],
    correctAnswer: 2,
    explanation: { en: "Air (Vayu) governs intellect, communication, ideas, and social connections. Air signs (Gemini, Libra, Aquarius) are thinkers, communicators, and relationship-oriented.", hi: "वायु बुद्धि, संवाद, विचार और सामाजिक सम्बन्धों को नियन्त्रित करती है। वायु राशियाँ (मिथुन, तुला, कुम्भ) विचारक, संवादक और सम्बन्ध-उन्मुख हैं।", sa: "वायु बुद्धि, संवाद, विचार और सामाजिक सम्बन्धों को नियन्त्रित करती है। वायु राशियाँ (मिथुन, तुला, कुम्भ) विचारक, संवादक और सम्बन्ध-उन्मुख हैं।", mai: "वायु बुद्धि, संवाद, विचार और सामाजिक सम्बन्धों को नियन्त्रित करती है। वायु राशियाँ (मिथुन, तुला, कुम्भ) विचारक, संवादक और सम्बन्ध-उन्मुख हैं।", mr: "वायु बुद्धि, संवाद, विचार और सामाजिक सम्बन्धों को नियन्त्रित करती है। वायु राशियाँ (मिथुन, तुला, कुम्भ) विचारक, संवादक और सम्बन्ध-उन्मुख हैं।", ta: "Air (Vayu) governs intellect, communication, ideas, and social connections. Air signs (Gemini, Libra, Aquarius) are thinkers, communicators, and relationship-oriented.", te: "Air (Vayu) governs intellect, communication, ideas, and social connections. Air signs (Gemini, Libra, Aquarius) are thinkers, communicators, and relationship-oriented.", bn: "Air (Vayu) governs intellect, communication, ideas, and social connections. Air signs (Gemini, Libra, Aquarius) are thinkers, communicators, and relationship-oriented.", kn: "Air (Vayu) governs intellect, communication, ideas, and social connections. Air signs (Gemini, Libra, Aquarius) are thinkers, communicators, and relationship-oriented.", gu: "Air (Vayu) governs intellect, communication, ideas, and social connections. Air signs (Gemini, Libra, Aquarius) are thinkers, communicators, and relationship-oriented." },
  },
  {
    id: 'q3_2_10', type: 'true_false',
    question: { en: "Pisces is the only sign that rises both head-first and back-first (Ubhayodaya).", hi: "मीन एकमात्र राशि है जो सिर-पहले और पीठ-पहले दोनों तरह उदय होती है (उभयोदय)।", sa: "मीन एकमात्र राशि है जो सिर-पहले और पीठ-पहले दोनों तरह उदय होती है (उभयोदय)।", mai: "मीन एकमात्र राशि है जो सिर-पहले और पीठ-पहले दोनों तरह उदय होती है (उभयोदय)।", mr: "मीन एकमात्र राशि है जो सिर-पहले और पीठ-पहले दोनों तरह उदय होती है (उभयोदय)।", ta: "Pisces is the only sign that rises both head-first and back-first (Ubhayodaya).", te: "Pisces is the only sign that rises both head-first and back-first (Ubhayodaya).", bn: "Pisces is the only sign that rises both head-first and back-first (Ubhayodaya).", kn: "Pisces is the only sign that rises both head-first and back-first (Ubhayodaya).", gu: "Pisces is the only sign that rises both head-first and back-first (Ubhayodaya)." },
    correctAnswer: true,
    explanation: { en: "Correct. Pisces is Ubhayodaya — it can manifest events quickly or slowly depending on other factors. All other signs are either Shirshodaya (head-first, quick) or Prishtodaya (back-first, slow).", hi: "सही। मीन उभयोदय है — यह अन्य कारकों के आधार पर घटनाओं को शीघ्र या धीरे प्रकट कर सकती है।", sa: "सही। मीन उभयोदय है — यह अन्य कारकों के आधार पर घटनाओं को शीघ्र या धीरे प्रकट कर सकती है।", mai: "सही। मीन उभयोदय है — यह अन्य कारकों के आधार पर घटनाओं को शीघ्र या धीरे प्रकट कर सकती है।", mr: "सही। मीन उभयोदय है — यह अन्य कारकों के आधार पर घटनाओं को शीघ्र या धीरे प्रकट कर सकती है।", ta: "Correct. Pisces is Ubhayodaya — it can manifest events quickly or slowly depending on other factors. All other signs are either Shirshodaya (head-first, quick) or Prishtodaya (back-first, slow).", te: "Correct. Pisces is Ubhayodaya — it can manifest events quickly or slowly depending on other factors. All other signs are either Shirshodaya (head-first, quick) or Prishtodaya (back-first, slow).", bn: "Correct. Pisces is Ubhayodaya — it can manifest events quickly or slowly depending on other factors. All other signs are either Shirshodaya (head-first, quick) or Prishtodaya (back-first, slow).", kn: "Correct. Pisces is Ubhayodaya — it can manifest events quickly or slowly depending on other factors. All other signs are either Shirshodaya (head-first, quick) or Prishtodaya (back-first, slow).", gu: "Correct. Pisces is Ubhayodaya — it can manifest events quickly or slowly depending on other factors. All other signs are either Shirshodaya (head-first, quick) or Prishtodaya (back-first, slow)." },
  },
];

function Page1() {
  const locale = useModuleLocale();
  const isHi = isDevanagariLocale(locale);
  return (
    <div className="space-y-6">
      <section>
        <h3 className="text-gold-light font-bold text-lg mb-3" style={{ fontFamily: 'var(--font-heading)' }}>Three Qualities (Gunas): How Signs Act</h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">Every sign has a fundamental quality that determines HOW it operates. Quality is the engine of behavior — it tells you whether a sign initiates, sustains, or adapts. Understanding quality is essential for both personality reading and muhurta (timing) work.</p>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5">
        <h4 className="text-gold-dark text-xs uppercase tracking-widest font-bold mb-3">Chara (Cardinal / Movable)</h4>
        <p className="text-text-secondary text-sm leading-relaxed mb-2">
          <span className="text-gold-light font-bold">Signs: Aries, Cancer, Libra, Capricorn</span> (houses 1, 4, 7, 10 = Kendras)
        </p>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          Chara signs INITIATE. They are the starters, the pioneers, the ones who get things moving. Aries initiates with fire (bold action), Cancer initiates with water (emotional bonding), Libra initiates with air (relationships and diplomacy), Capricorn initiates with earth (structures and ambitions). In muhurta, Chara signs are ideal for starting journeys, beginning new ventures, and anything requiring forward momentum.
        </p>
        <p className="text-text-secondary text-sm leading-relaxed">
          <span className="text-amber-400 text-xs font-bold">PERSONALITY:</span> People with many planets in Chara signs are restless, ambitious, always starting new projects. Their weakness: they may not finish what they start.
        </p>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5">
        <h4 className="text-gold-dark text-xs uppercase tracking-widest font-bold mb-3">Sthira (Fixed)</h4>
        <p className="text-text-secondary text-sm leading-relaxed mb-2">
          <span className="text-gold-light font-bold">Signs: Taurus, Leo, Scorpio, Aquarius</span> (houses 2, 5, 8, 11 = Panapharas)
        </p>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          Sthira signs SUSTAIN. They hold, preserve, and resist change. Taurus sustains earth (wealth, possessions), Leo sustains fire (creativity, authority), Scorpio sustains water (intensity, secrets), Aquarius sustains air (ideals, networks). In muhurta, Sthira signs are ideal for laying foundations, installing things meant to last, and ceremonies of permanence (like housewarming).
        </p>
        <p className="text-text-secondary text-sm leading-relaxed">
          <span className="text-amber-400 text-xs font-bold">PERSONALITY:</span> People with many planets in Sthira signs are determined, reliable, stubborn. Their weakness: resistance to necessary change, getting stuck.
        </p>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5">
        <h4 className="text-gold-dark text-xs uppercase tracking-widest font-bold mb-3">Dwiswabhava (Dual / Mutable)</h4>
        <p className="text-text-secondary text-sm leading-relaxed mb-2">
          <span className="text-gold-light font-bold">Signs: Gemini, Virgo, Sagittarius, Pisces</span> (houses 3, 6, 9, 12 = Apoklimas)
        </p>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          Dwiswabhava signs ADAPT. They are flexible, versatile, and can switch between modes. Gemini adapts with air (communication, learning), Virgo adapts with earth (analysis, service), Sagittarius adapts with fire (philosophy, exploration), Pisces adapts with water (spirituality, imagination). In muhurta, Dual signs suit learning, teaching, healing, and any activity requiring flexibility.
        </p>
        <p className="text-text-secondary text-sm leading-relaxed">
          <span className="text-amber-400 text-xs font-bold">PERSONALITY:</span> People with many Dual sign planets are adaptable, versatile, and multitalented. Their weakness: indecisiveness, scattered energy, lack of focus.
        </p>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5 border border-amber-500/15 mt-4">
        <h4 className="text-amber-300 text-xs uppercase tracking-widest font-bold mb-3">Quality and Activity Timing</h4>
        <div className="space-y-2 text-text-secondary text-xs leading-relaxed">
          <p><span className="text-gold-light font-medium">Starting a business?</span> Choose a Chara (Movable) Lagna — Aries, Cancer, Libra, or Capricorn rising at the muhurta moment.</p>
          <p><span className="text-gold-light font-medium">Laying a foundation?</span> Choose a Sthira (Fixed) Lagna — Taurus, Leo, Scorpio, or Aquarius for permanence.</p>
          <p><span className="text-gold-light font-medium">Starting a course?</span> Choose a Dwiswabhava (Dual) Lagna — Gemini, Virgo, Sagittarius, or Pisces for learning and growth.</p>
        </div>
      </section>
    </div>
  );
}

function Page2() {
  const locale = useModuleLocale();
  const isHi = isDevanagariLocale(locale);
  return (
    <div className="space-y-6">
      <section>
        <h3 className="text-gold-light font-bold text-lg mb-3" style={{ fontFamily: 'var(--font-heading)' }}>Four Elements (Tattvas): What Energy Signs Carry</h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">While quality tells you HOW a sign acts, the element tells you WHAT kind of energy it carries. The four Tattvas (elements) are fundamental to Indian philosophy — they appear in Ayurveda, Yoga, and Tantra as well as Jyotish. Each element contains 3 signs, one of each quality.</p>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5 border border-red-500/15">
        <h4 className="text-red-400 text-xs uppercase tracking-widest font-bold mb-3">Agni (Fire) — Action and Transformation</h4>
        <p className="text-text-secondary text-sm leading-relaxed mb-2">
          <span className="text-red-300 font-bold">Signs: Aries (Cardinal), Leo (Fixed), Sagittarius (Mutable)</span>
        </p>
        <p className="text-text-secondary text-sm leading-relaxed mb-2">Fire is the energy of action, courage, leadership, and transformation. Fire signs are visible, dynamic, and assertive. They are the doers of the zodiac.</p>
        <p className="text-text-secondary text-sm leading-relaxed">
          <span className="text-red-300 text-xs font-bold">EXCESS:</span> Aggression, anger, impatience, burnout, domineering behavior. <span className="text-blue-300 text-xs font-bold ml-2">DEFICIENCY:</span> Lack of motivation, passivity, fear, inability to lead.
        </p>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5 border border-amber-500/15">
        <h4 className="text-amber-400 text-xs uppercase tracking-widest font-bold mb-3">Prithvi (Earth) — Material and Stability</h4>
        <p className="text-text-secondary text-sm leading-relaxed mb-2">
          <span className="text-amber-300 font-bold">Signs: Taurus (Fixed), Virgo (Mutable), Capricorn (Cardinal)</span>
        </p>
        <p className="text-text-secondary text-sm leading-relaxed mb-2">Earth is the energy of material reality, structure, practicality, and endurance. Earth signs build, accumulate, and ground abstract ideas into tangible results.</p>
        <p className="text-text-secondary text-sm leading-relaxed">
          <span className="text-red-300 text-xs font-bold">EXCESS:</span> Materialism, stubbornness, heaviness, resistance to spiritual growth. <span className="text-blue-300 text-xs font-bold ml-2">DEFICIENCY:</span> Impractical, ungrounded, financially unstable, lacks follow-through.
        </p>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5 border border-cyan-500/15">
        <h4 className="text-cyan-400 text-xs uppercase tracking-widest font-bold mb-3">Vayu (Air) — Intellect and Connection</h4>
        <p className="text-text-secondary text-sm leading-relaxed mb-2">
          <span className="text-cyan-300 font-bold">Signs: Gemini (Mutable), Libra (Cardinal), Aquarius (Fixed)</span>
        </p>
        <p className="text-text-secondary text-sm leading-relaxed mb-2">Air is the energy of intellect, communication, ideas, and social connection. Air signs think, analyze, relate, and conceptualize. They are the connectors of the zodiac.</p>
        <p className="text-text-secondary text-sm leading-relaxed">
          <span className="text-red-300 text-xs font-bold">EXCESS:</span> Overthinking, anxiety, detachment from emotions, superficiality. <span className="text-blue-300 text-xs font-bold ml-2">DEFICIENCY:</span> Poor communication, social isolation, narrow thinking, inability to see others&apos; viewpoints.
        </p>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5 border border-blue-500/15">
        <h4 className="text-blue-400 text-xs uppercase tracking-widest font-bold mb-3">Jala (Water) — Emotion and Intuition</h4>
        <p className="text-text-secondary text-sm leading-relaxed mb-2">
          <span className="text-blue-300 font-bold">Signs: Cancer (Cardinal), Scorpio (Fixed), Pisces (Mutable)</span>
        </p>
        <p className="text-text-secondary text-sm leading-relaxed mb-2">Water is the energy of emotion, intuition, nurturing, and depth. Water signs feel deeply, connect emotionally, and have strong psychic sensitivity. They are the feelers of the zodiac.</p>
        <p className="text-text-secondary text-sm leading-relaxed">
          <span className="text-red-300 text-xs font-bold">EXCESS:</span> Emotional overwhelm, moodiness, dependency, escapism, inability to set boundaries. <span className="text-blue-300 text-xs font-bold ml-2">DEFICIENCY:</span> Emotional coldness, disconnection, inability to empathize, dry personality.
        </p>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5 mt-4">
        <h4 className="text-gold-dark text-xs uppercase tracking-widest font-bold mb-3">Reading Element Balance in a Chart</h4>
        <p className="text-text-secondary text-sm leading-relaxed mb-2">Count how many of the 9 planets fall in each element group. A balanced chart has planets spread across all 4 elements. Most charts are imbalanced — and that imbalance IS the person&apos;s temperament:</p>
        <div className="space-y-1 text-text-secondary text-xs leading-relaxed mt-2">
          <p><span className="text-gold-light font-medium">4+ planets in Fire:</span> Dominant leader, high energy, needs to learn patience and empathy</p>
          <p><span className="text-gold-light font-medium">4+ planets in Earth:</span> Material achiever, practical builder, needs to develop spiritual awareness</p>
          <p><span className="text-gold-light font-medium">4+ planets in Air:</span> Intellectual communicator, social butterfly, needs to develop emotional depth</p>
          <p><span className="text-gold-light font-medium">4+ planets in Water:</span> Emotional empath, intuitive healer, needs to develop practical grounding</p>
          <p><span className="text-gold-light font-medium">0 planets in an element:</span> That element&apos;s qualities are the person&apos;s blindspot — the area they must consciously develop</p>
        </div>
      </section>
    </div>
  );
}

function Page3() {
  const locale = useModuleLocale();
  const isHi = isDevanagariLocale(locale);
  return (
    <div className="space-y-6">
      <section>
        <h3 className="text-gold-light font-bold text-lg mb-3" style={{ fontFamily: 'var(--font-heading)' }}>The Quality-Element Matrix — 12 Unique Combinations</h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">Every sign is a unique combination of one quality and one element. 3 qualities x 4 elements = exactly 12, which is why there are exactly 12 signs. This is the fundamental mathematical structure of the zodiac, not an arbitrary choice.</p>
      </section>

      <div className="overflow-x-auto bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-4">
        <table className="w-full text-xs">
          <thead><tr className="border-b border-gold-primary/15">
            <th className="text-left py-2 px-2 text-gold-dark">Element / Quality</th>
            <th className="text-left py-2 px-2 text-gold-dark">Chara (Cardinal)</th>
            <th className="text-left py-2 px-2 text-gold-dark">Sthira (Fixed)</th>
            <th className="text-left py-2 px-2 text-gold-dark">Dwiswabhava (Dual)</th>
          </tr></thead>
          <tbody className="divide-y divide-gold-primary/5">
            <tr className="hover:bg-gold-primary/3">
              <td className="py-2 px-2 text-red-400 font-bold">Agni (Fire)</td>
              <td className="py-2 px-2 text-text-secondary">Aries — initiates action</td>
              <td className="py-2 px-2 text-text-secondary">Leo — sustains authority</td>
              <td className="py-2 px-2 text-text-secondary">Sagittarius — adapts philosophy</td>
            </tr>
            <tr className="hover:bg-gold-primary/3">
              <td className="py-2 px-2 text-amber-400 font-bold">Prithvi (Earth)</td>
              <td className="py-2 px-2 text-text-secondary">Capricorn — initiates structures</td>
              <td className="py-2 px-2 text-text-secondary">Taurus — sustains wealth</td>
              <td className="py-2 px-2 text-text-secondary">Virgo — adapts through service</td>
            </tr>
            <tr className="hover:bg-gold-primary/3">
              <td className="py-2 px-2 text-cyan-400 font-bold">Vayu (Air)</td>
              <td className="py-2 px-2 text-text-secondary">Libra — initiates relationships</td>
              <td className="py-2 px-2 text-text-secondary">Aquarius — sustains ideals</td>
              <td className="py-2 px-2 text-text-secondary">Gemini — adapts communication</td>
            </tr>
            <tr className="hover:bg-gold-primary/3">
              <td className="py-2 px-2 text-blue-400 font-bold">Jala (Water)</td>
              <td className="py-2 px-2 text-text-secondary">Cancer — initiates nurturing</td>
              <td className="py-2 px-2 text-text-secondary">Scorpio — sustains intensity</td>
              <td className="py-2 px-2 text-text-secondary">Pisces — adapts spiritually</td>
            </tr>
          </tbody>
        </table>
      </div>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5">
        <h4 className="text-gold-dark text-xs uppercase tracking-widest font-bold mb-3">How to Read Chart Distribution</h4>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">To assess temperament, count planets in each quality AND each element separately:</p>
        <div className="space-y-2 text-text-secondary text-xs leading-relaxed">
          <p><span className="text-gold-light font-medium">Quality distribution:</span> Most planets in Cardinal = initiator/leader. Most in Fixed = determined/stubborn. Most in Mutable = adaptable/scattered. This tells you the person&apos;s MODE of operation.</p>
          <p><span className="text-gold-light font-medium">Element distribution:</span> Dominant Fire = active/aggressive. Dominant Earth = practical/materialistic. Dominant Air = intellectual/social. Dominant Water = emotional/intuitive. This tells you the person&apos;s ENERGY type.</p>
          <p><span className="text-gold-light font-medium">Combined reading:</span> Cardinal Fire (Aries dominance) = aggressive pioneer. Fixed Water (Scorpio dominance) = deeply intense, emotionally unyielding. Mutable Earth (Virgo dominance) = adaptable analyst, service-oriented perfectionist. Each combination paints a unique portrait.</p>
        </div>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5">
        <h4 className="text-gold-dark text-xs uppercase tracking-widest font-bold mb-3">Additional Classifications</h4>
        <div className="space-y-3 text-text-secondary text-sm leading-relaxed">
          <div>
            <p className="text-gold-light font-medium text-xs mb-1">Gender (Linga)</p>
            <p className="text-xs">ODD signs (1,3,5,7,9,11) = Male/Purusha/Diurnal/Cruel. EVEN signs (2,4,6,8,10,12) = Female/Stri/Nocturnal/Gentle.</p>
          </div>
          <div>
            <p className="text-gold-light font-medium text-xs mb-1">Rising Type (Udaya)</p>
            <p className="text-xs">Shirshodaya (head-first, quick results): Gemini, Leo, Virgo, Libra, Scorpio, Aquarius. Prishtodaya (back-first, slow results): Aries, Taurus, Cancer, Sagittarius, Capricorn. Ubhayodaya (both ways): Pisces only.</p>
          </div>
          <div>
            <p className="text-gold-light font-medium text-xs mb-1">Fruitfulness</p>
            <p className="text-xs">Water signs (Cancer, Scorpio, Pisces) are Fruitful — favorable for conception and fertility questions. Fire signs are Barren. Earth and Air signs are Semi-fruitful.</p>
          </div>
        </div>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5 border border-red-500/15">
        <h4 className="text-red-400 text-xs uppercase tracking-widest font-bold mb-3">Common Misconceptions</h4>
        <div className="space-y-2 text-text-secondary text-xs leading-relaxed">
          <p><span className="text-red-300 font-bold">MISCONCEPTION: &apos;Aquarius is a water sign because of the water-bearer symbol.&apos;</span><br />
          <span className="text-emerald-300">REALITY: Aquarius is an AIR sign. The water-bearer represents the distribution of knowledge and humanitarian ideals — NOT the water element.</span></p>
          <p><span className="text-red-300 font-bold">MISCONCEPTION: &apos;Fixed signs never change.&apos;</span><br />
          <span className="text-emerald-300">REALITY: Fixed signs resist change but CAN change — they just take longer. Think of them as having high inertia, not immobility.</span></p>
          <p><span className="text-red-300 font-bold">MISCONCEPTION: &apos;Mutable signs are weak.&apos;</span><br />
          <span className="text-emerald-300">REALITY: Mutable signs are adaptable, not weak. Flexibility is a strength — these signs survive by evolving. The greatest teachers (Sagittarius) and healers (Virgo) are Mutable.</span></p>
        </div>
      </section>
    </div>
  );
}

export default function Module3_2Page() {
  return <ModuleContainer meta={META} pages={[<Page1 key="p1" />, <Page2 key="p2" />, <Page3 key="p3" />]} questions={QUESTIONS} />;
}
