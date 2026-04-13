'use client';

import ModuleContainer, { type ModuleMeta, type ModuleQuestion, useModuleLocale } from '@/components/learn/ModuleContainer';
import { isDevanagariLocale } from '@/lib/utils/locale-fonts';

const META: ModuleMeta = {
  id: 'mod_25_7', phase: 5, topic: 'Indian Mathematics', moduleNumber: '25.7',
  title: { en: 'Calculus — Kerala, Not Cambridge', hi: 'कलन — केम्ब्रिज नहीं, केरल में', sa: 'कलन — केम्ब्रिज नहीं, केरल में', mai: 'कलन — केम्ब्रिज नहीं, केरल में', mr: 'कलन — केम्ब्रिज नहीं, केरल में', ta: 'Calculus — Kerala, Not Cambridge', te: 'Calculus — Kerala, Not Cambridge', bn: 'Calculus — Kerala, Not Cambridge', kn: 'Calculus — Kerala, Not Cambridge', gu: 'Calculus — Kerala, Not Cambridge' },
  subtitle: {
    en: 'How Madhava of Sangamagrama discovered infinite series, proto-calculus, and convergence acceleration ~250 years before Newton and Leibniz',
    hi: 'संगमग्राम के माधव ने Newton और Leibniz से ~250 वर्ष पहले अनन्त श्रृंखला, प्रोटो-कलन और अभिसरण त्वरण की खोज कैसे की',
  },
  estimatedMinutes: 14,
  crossRefs: [
    { label: { en: 'Module 25-3: Pi = 3.1416', hi: 'मॉड्यूल 25-3: π = 3.1416', sa: 'मॉड्यूल 25-3: π = 3.1416', mai: 'मॉड्यूल 25-3: π = 3.1416', mr: 'मॉड्यूल 25-3: π = 3.1416', ta: 'Module 25-3: Pi = 3.1416', te: 'Module 25-3: Pi = 3.1416', bn: 'Module 25-3: Pi = 3.1416', kn: 'Module 25-3: Pi = 3.1416', gu: 'Module 25-3: Pi = 3.1416' }, href: '/learn/modules/25-3' },
    { label: { en: 'Module 25-2: Sine Is Sanskrit', hi: 'मॉड्यूल 25-2: ज्या से Sine', sa: 'मॉड्यूल 25-2: ज्या से Sine', mai: 'मॉड्यूल 25-2: ज्या से Sine', mr: 'मॉड्यूल 25-2: ज्या से Sine', ta: 'Module 25-2: Sine Is Sanskrit', te: 'Module 25-2: Sine Is Sanskrit', bn: 'Module 25-2: Sine Is Sanskrit', kn: 'Module 25-2: Sine Is Sanskrit', gu: 'Module 25-2: Sine Is Sanskrit' }, href: '/learn/modules/25-2' },
    { label: { en: 'Module 25-1: Zero', hi: 'मॉड्यूल 25-1: शून्य', sa: 'मॉड्यूल 25-1: शून्य', mai: 'मॉड्यूल 25-1: शून्य', mr: 'मॉड्यूल 25-1: शून्य', ta: 'Module 25-1: Zero', te: 'Module 25-1: Zero', bn: 'Module 25-1: Zero', kn: 'Module 25-1: Zero', gu: 'Module 25-1: Zero' }, href: '/learn/modules/25-1' },
  ],
};

const QUESTIONS: ModuleQuestion[] = [
  {
    id: 'q25_7_01', type: 'mcq',
    question: {
      en: 'Who is considered the founder of the Kerala School of Mathematics and discovered infinite series for trigonometric functions?',
      hi: 'केरल गणित स्कूल के संस्थापक और त्रिकोणमितीय फलनों के लिए अनन्त श्रृंखलाओं की खोज किसने की?',
    },
    options: [
      { en: 'Nilakantha Somayaji', hi: 'नीलकण्ठ सोमयाजी', sa: 'नीलकण्ठ सोमयाजी', mai: 'नीलकण्ठ सोमयाजी', mr: 'नीलकण्ठ सोमयाजी', ta: 'Nilakantha Somayaji', te: 'Nilakantha Somayaji', bn: 'Nilakantha Somayaji', kn: 'Nilakantha Somayaji', gu: 'Nilakantha Somayaji' },
      { en: 'Madhava of Sangamagrama', hi: 'संगमग्राम के माधव', sa: 'संगमग्राम के माधव', mai: 'संगमग्राम के माधव', mr: 'संगमग्राम के माधव', ta: 'Madhava of Sangamagrama', te: 'Madhava of Sangamagrama', bn: 'Madhava of Sangamagrama', kn: 'Madhava of Sangamagrama', gu: 'Madhava of Sangamagrama' },
      { en: 'Jyeshthadeva', hi: 'ज्येष्ठदेव', sa: 'ज्येष्ठदेव', mai: 'ज्येष्ठदेव', mr: 'ज्येष्ठदेव', ta: 'Jyeshthadeva', te: 'Jyeshthadeva', bn: 'Jyeshthadeva', kn: 'Jyeshthadeva', gu: 'Jyeshthadeva' },
      { en: 'Parameshvara', hi: 'परमेश्वर', sa: 'परमेश्वर', mai: 'परमेश्वर', mr: 'परमेश्वर', ta: 'Parameshvara', te: 'Parameshvara', bn: 'Parameshvara', kn: 'Parameshvara', gu: 'Parameshvara' },
    ],
    correctAnswer: 1,
    explanation: {
      en: 'Madhava of Sangamagrama (c. 1350–1425 CE) is considered the founder of the Kerala School of Mathematics and Astronomy. He discovered infinite series for sine, cosine, and the arctangent (which gives the Madhava-Leibniz series for π). These are now attributed in Western textbooks to Newton and Leibniz (for sin/cos series) and Gregory and Leibniz (for π series) — all of whom worked 250+ years later. Madhava\'s village Sangamagrama is believed to be the modern town of Irinjalakuda in Kerala.',
      hi: 'संगमग्राम के माधव (लगभग 1350–1425 ई.) को केरल खगोल विज्ञान और गणित स्कूल का संस्थापक माना जाता है। उन्होंने sine, cosine और arctangent (जो π के लिए माधव-लाइबनित्ज़ श्रृंखला देता है) के लिए अनन्त श्रृंखलाएँ खोजीं। पश्चिमी पाठ्यपुस्तकों में इन्हें Newton और Leibniz (sin/cos श्रृंखलाओं के लिए) और Gregory और Leibniz (π श्रृंखला के लिए) को श्रेय दिया जाता है — जो सभी 250+ वर्ष बाद काम किए।',
    },
  },
  {
    id: 'q25_7_02', type: 'mcq',
    question: {
      en: 'Approximately what century did Madhava of Sangamagrama live and work?',
      hi: 'संगमग्राम के माधव लगभग किस शताब्दी में रहे और काम किया?',
    },
    options: [
      { en: '10th century CE', hi: '10वीं शताब्दी ई.', sa: '10वीं शताब्दी ई.', mai: '10वीं शताब्दी ई.', mr: '10वीं शताब्दी ई.', ta: '10th century CE', te: '10th century CE', bn: '10th century CE', kn: '10th century CE', gu: '10th century CE' },
      { en: '12th century CE', hi: '12वीं शताब्दी ई.', sa: '12वीं शताब्दी ई.', mai: '12वीं शताब्दी ई.', mr: '12वीं शताब्दी ई.', ta: '12th century CE', te: '12th century CE', bn: '12th century CE', kn: '12th century CE', gu: '12th century CE' },
      { en: '14th century CE (~1350 CE)', hi: '14वीं शताब्दी ई. (~1350 ई.)', sa: '14वीं शताब्दी ई. (~1350 ई.)', mai: '14वीं शताब्दी ई. (~1350 ई.)', mr: '14वीं शताब्दी ई. (~1350 ई.)', ta: '14th century CE (~1350 CE)', te: '14th century CE (~1350 CE)', bn: '14th century CE (~1350 CE)', kn: '14th century CE (~1350 CE)', gu: '14th century CE (~1350 CE)' },
      { en: '16th century CE', hi: '16वीं शताब्दी ई.', sa: '16वीं शताब्दी ई.', mai: '16वीं शताब्दी ई.', mr: '16वीं शताब्दी ई.', ta: '16th century CE', te: '16th century CE', bn: '16th century CE', kn: '16th century CE', gu: '16th century CE' },
    ],
    correctAnswer: 2,
    explanation: {
      en: 'Madhava lived approximately from 1350 to 1425 CE — squarely in the 14th century. This was about 250–340 years before Isaac Newton (1643–1727) and Gottfried Leibniz (1646–1716), who are credited with the formal development of calculus in Europe. Madhava\'s work is known primarily through quotations in later Kerala school texts, as his original works have mostly been lost. The Yuktibhasha (1530 CE) and Tantrasangraha contain detailed accounts of his results.',
      hi: 'माधव लगभग 1350 से 1425 ई. तक — पूरी तरह 14वीं शताब्दी में — रहे। यह आइज़ैक Newton (1643–1727) और गॉटफ्रीड लाइबनित्ज़ (1646–1716) से लगभग 250–340 वर्ष पहले था, जिन्हें यूरोप में कलन के औपचारिक विकास का श्रेय दिया जाता है।',
    },
  },
  {
    id: 'q25_7_03', type: 'mcq',
    question: {
      en: 'What is the Madhava-Leibniz series for π/4?',
      hi: 'π/4 के लिए माधव-लाइबनित्ज़ श्रृंखला क्या है?',
    },
    options: [
      { en: 'π/4 = 1 + 1/2 + 1/4 + 1/8 + ...', hi: 'π/4 = 1 + 1/2 + 1/4 + 1/8 + ...', sa: 'π/4 = 1 + 1/2 + 1/4 + 1/8 + ...', mai: 'π/4 = 1 + 1/2 + 1/4 + 1/8 + ...', mr: 'π/4 = 1 + 1/2 + 1/4 + 1/8 + ...', ta: 'π/4 = 1 + 1/2 + 1/4 + 1/8 + ...', te: 'π/4 = 1 + 1/2 + 1/4 + 1/8 + ...', bn: 'π/4 = 1 + 1/2 + 1/4 + 1/8 + ...', kn: 'π/4 = 1 + 1/2 + 1/4 + 1/8 + ...', gu: 'π/4 = 1 + 1/2 + 1/4 + 1/8 + ...' },
      { en: 'π/4 = 1 − 1/3 + 1/5 − 1/7 + 1/9 − ...', hi: 'π/4 = 1 − 1/3 + 1/5 − 1/7 + 1/9 − ...', sa: 'π/4 = 1 − 1/3 + 1/5 − 1/7 + 1/9 − ...', mai: 'π/4 = 1 − 1/3 + 1/5 − 1/7 + 1/9 − ...', mr: 'π/4 = 1 − 1/3 + 1/5 − 1/7 + 1/9 − ...', ta: 'π/4 = 1 − 1/3 + 1/5 − 1/7 + 1/9 − ...', te: 'π/4 = 1 − 1/3 + 1/5 − 1/7 + 1/9 − ...', bn: 'π/4 = 1 − 1/3 + 1/5 − 1/7 + 1/9 − ...', kn: 'π/4 = 1 − 1/3 + 1/5 − 1/7 + 1/9 − ...', gu: 'π/4 = 1 − 1/3 + 1/5 − 1/7 + 1/9 − ...' },
      { en: 'π/4 = 1/1² + 1/2² + 1/3² + ...', hi: 'π/4 = 1/1² + 1/2² + 1/3² + ...', sa: 'π/4 = 1/1² + 1/2² + 1/3² + ...', mai: 'π/4 = 1/1² + 1/2² + 1/3² + ...', mr: 'π/4 = 1/1² + 1/2² + 1/3² + ...', ta: 'π/4 = 1/1² + 1/2² + 1/3² + ...', te: 'π/4 = 1/1² + 1/2² + 1/3² + ...', bn: 'π/4 = 1/1² + 1/2² + 1/3² + ...', kn: 'π/4 = 1/1² + 1/2² + 1/3² + ...', gu: 'π/4 = 1/1² + 1/2² + 1/3² + ...' },
      { en: 'π/4 = 2 × 4/3 × 4/5 × 6/5 × ...', hi: 'π/4 = 2 × 4/3 × 4/5 × 6/5 × ...', sa: 'π/4 = 2 × 4/3 × 4/5 × 6/5 × ...', mai: 'π/4 = 2 × 4/3 × 4/5 × 6/5 × ...', mr: 'π/4 = 2 × 4/3 × 4/5 × 6/5 × ...', ta: 'π/4 = 2 × 4/3 × 4/5 × 6/5 × ...', te: 'π/4 = 2 × 4/3 × 4/5 × 6/5 × ...', bn: 'π/4 = 2 × 4/3 × 4/5 × 6/5 × ...', kn: 'π/4 = 2 × 4/3 × 4/5 × 6/5 × ...', gu: 'π/4 = 2 × 4/3 × 4/5 × 6/5 × ...' },
    ],
    correctAnswer: 1,
    explanation: {
      en: 'The Madhava-Leibniz series is π/4 = 1 − 1/3 + 1/5 − 1/7 + 1/9 − ... (the alternating sum of reciprocals of odd positive integers). This is actually the arctangent series evaluated at x=1 (since arctan(1) = π/4). Madhava discovered this around 1350 CE. In the West, it was independently found by James Gregory (1671) and Gottfried Leibniz (1673). Recognition of Madhava\'s priority only came in the 20th century through careful historical research.',
      hi: 'माधव-लाइबनित्ज़ श्रृंखला है: π/4 = 1 − 1/3 + 1/5 − 1/7 + 1/9 − ... (विषम धनात्मक पूर्णांकों के व्युत्क्रमों का एकान्तर योग)। यह x=1 पर arctan श्रृंखला है (चूँकि arctan(1) = π/4)। माधव ने इसे ~1350 ई. में खोजा। पश्चिम में, इसे जेम्स ग्रेगरी (1671) और लाइबनित्ज़ (1673) ने स्वतन्त्र रूप से खोजा। माधव की प्राथमिकता की पहचान 20वीं शताब्दी में सावधानीपूर्वक ऐतिहासिक शोध से आई।',
    },
  },
  {
    id: 'q25_7_04', type: 'mcq',
    question: {
      en: 'Who wrote the Yuktibhasha — the text that contains formal proofs of Kerala School results?',
      hi: 'युक्तिभाषा — केरल स्कूल के परिणामों के औपचारिक प्रमाण वाला ग्रन्थ — किसने लिखा?',
    },
    options: [
      { en: 'Madhava of Sangamagrama', hi: 'संगमग्राम के माधव', sa: 'संगमग्राम के माधव', mai: 'संगमग्राम के माधव', mr: 'संगमग्राम के माधव', ta: 'Madhava of Sangamagrama', te: 'Madhava of Sangamagrama', bn: 'Madhava of Sangamagrama', kn: 'Madhava of Sangamagrama', gu: 'Madhava of Sangamagrama' },
      { en: 'Jyeshthadeva', hi: 'ज्येष्ठदेव', sa: 'ज्येष्ठदेव', mai: 'ज्येष्ठदेव', mr: 'ज्येष्ठदेव', ta: 'Jyeshthadeva', te: 'Jyeshthadeva', bn: 'Jyeshthadeva', kn: 'Jyeshthadeva', gu: 'Jyeshthadeva' },
      { en: 'Nilakantha Somayaji', hi: 'नीलकण्ठ सोमयाजी', sa: 'नीलकण्ठ सोमयाजी', mai: 'नीलकण्ठ सोमयाजी', mr: 'नीलकण्ठ सोमयाजी', ta: 'Nilakantha Somayaji', te: 'Nilakantha Somayaji', bn: 'Nilakantha Somayaji', kn: 'Nilakantha Somayaji', gu: 'Nilakantha Somayaji' },
      { en: 'Narayana Pandita', hi: 'नारायण पण्डित', sa: 'नारायण पण्डित', mai: 'नारायण पण्डित', mr: 'नारायण पण्डित', ta: 'Narayana Pandita', te: 'Narayana Pandita', bn: 'Narayana Pandita', kn: 'Narayana Pandita', gu: 'Narayana Pandita' },
    ],
    correctAnswer: 1,
    explanation: {
      en: 'Jyeshthadeva wrote the Yuktibhasha (~1530 CE), which is arguably the most important mathematical text produced by the Kerala School. "Yuktibhasha" means "language of reasoning/proofs" in Malayalam. It provides rigorous proofs for Madhava\'s infinite series results, including the series for π, sine, and cosine. Remarkably, it is written in Malayalam (not Sanskrit), making it more accessible. It also contains clear demonstrations of what we today recognise as fundamental calculus concepts.',
      hi: 'ज्येष्ठदेव ने युक्तिभाषा (~1530 ई.) लिखी, जो केरल स्कूल द्वारा उत्पादित सबसे महत्त्वपूर्ण गणितीय ग्रन्थ है। "युक्तिभाषा" का अर्थ मलयालम में "तर्क/प्रमाण की भाषा" है। यह माधव के अनन्त श्रृंखला परिणामों के लिए कठोर प्रमाण प्रदान करता है, जिसमें π, sine और cosine की श्रृंखलाएँ शामिल हैं।',
    },
  },
  {
    id: 'q25_7_05', type: 'mcq',
    question: {
      en: 'Approximately what year was the Yuktibhasha written?',
      hi: 'युक्तिभाषा लगभग किस वर्ष लिखी गई?',
    },
    options: [
      { en: '~1350 CE', hi: '~1350 ई.', sa: '~1350 ई.', mai: '~1350 ई.', mr: '~1350 ई.', ta: '~1350 CE', te: '~1350 CE', bn: '~1350 CE', kn: '~1350 CE', gu: '~1350 CE' },
      { en: '~1450 CE', hi: '~1450 ई.', sa: '~1450 ई.', mai: '~1450 ई.', mr: '~1450 ई.', ta: '~1450 CE', te: '~1450 CE', bn: '~1450 CE', kn: '~1450 CE', gu: '~1450 CE' },
      { en: '~1530 CE', hi: '~1530 ई.', sa: '~1530 ई.', mai: '~1530 ई.', mr: '~1530 ई.', ta: '~1530 CE', te: '~1530 CE', bn: '~1530 CE', kn: '~1530 CE', gu: '~1530 CE' },
      { en: '~1620 CE', hi: '~1620 ई.', sa: '~1620 ई.', mai: '~1620 ई.', mr: '~1620 ई.', ta: '~1620 CE', te: '~1620 CE', bn: '~1620 CE', kn: '~1620 CE', gu: '~1620 CE' },
    ],
    correctAnswer: 2,
    explanation: {
      en: '~1530 CE. The Yuktibhasha ("language of proofs") was written by Jyeshthadeva around 1530 CE. This means it was written approximately 100 years after Madhava\'s death (Madhava died ~1425 CE) but compiled his results along with those of Nilakantha Somayaji and others. Newton\'s Principia Mathematica was 1687 — 157 years after the Yuktibhasha. Leibniz published his calculus in 1684 — 154 years after. The Kerala School was doing proto-calculus while Europe was still in the early Renaissance.',
      hi: '~1530 ई.। युक्तिभाषा ("प्रमाणों की भाषा") ज्येष्ठदेव ने ~1530 ई. के आसपास लिखी। इसका मतलब है कि यह माधव की मृत्यु के लगभग 100 वर्ष बाद लिखी गई लेकिन उनके परिणाम और नीलकण्ठ सोमयाजी आदि के परिणाम संकलित किए। Newton के Principia Mathematica (1687) से 157 वर्ष पहले। लाइबनित्ज़ ने 1684 में — 154 वर्ष बाद — प्रकाशित किया।',
    },
  },
  {
    id: 'q25_7_06', type: 'mcq',
    question: {
      en: 'How many years before Newton did Madhava develop his infinite series results?',
      hi: 'माधव ने Newton से कितने वर्ष पहले अपनी अनन्त श्रृंखला के परिणाम विकसित किए?',
    },
    options: [
      { en: 'About 50 years', hi: 'लगभग 50 वर्ष', sa: 'लगभग 50 वर्ष', mai: 'लगभग 50 वर्ष', mr: 'लगभग 50 वर्ष', ta: 'About 50 years', te: 'About 50 years', bn: 'About 50 years', kn: 'About 50 years', gu: 'About 50 years' },
      { en: 'About 100 years', hi: 'लगभग 100 वर्ष', sa: 'लगभग 100 वर्ष', mai: 'लगभग 100 वर्ष', mr: 'लगभग 100 वर्ष', ta: 'About 100 years', te: 'About 100 years', bn: 'About 100 years', kn: 'About 100 years', gu: 'About 100 years' },
      { en: 'About 250–340 years', hi: 'लगभग 250–340 वर्ष', sa: 'लगभग 250–340 वर्ष', mai: 'लगभग 250–340 वर्ष', mr: 'लगभग 250–340 वर्ष', ta: 'About 250–340 years', te: 'About 250–340 years', bn: 'About 250–340 years', kn: 'About 250–340 years', gu: 'About 250–340 years' },
      { en: 'About 500 years', hi: 'लगभग 500 वर्ष', sa: 'लगभग 500 वर्ष', mai: 'लगभग 500 वर्ष', mr: 'लगभग 500 वर्ष', ta: 'About 500 years', te: 'About 500 years', bn: 'About 500 years', kn: 'About 500 years', gu: 'About 500 years' },
    ],
    correctAnswer: 2,
    explanation: {
      en: 'Madhava (~1350 CE) developed his infinite series results approximately 250–340 years before Newton (1643–1727). Newton began his serious mathematical work around 1664–1668 CE, giving roughly 300 years of priority to Madhava. Leibniz (1646–1716) worked even later. The specific series results Madhava discovered — sine series, cosine series, arctangent series — are exactly what Newton and Leibniz independently rediscovered as part of their development of calculus.',
      hi: 'माधव (~1350 ई.) ने अपनी अनन्त श्रृंखला के परिणाम Newton (1643–1727) से लगभग 250–340 वर्ष पहले विकसित किए। Newton ने अपना गंभीर गणितीय काम ~1664–1668 ई. के आसपास शुरू किया, माधव को लगभग 300 वर्षों की प्राथमिकता देते हुए। माधव द्वारा खोजी गई विशिष्ट श्रृंखलाएँ — sine श्रृंखला, cosine श्रृंखला, arctangent श्रृंखला — वही हैं जो Newton और Leibniz ने स्वतन्त्र रूप से पुनः खोजीं।',
    },
  },
  {
    id: 'q25_7_07', type: 'mcq',
    question: {
      en: 'Who was Newton\'s European contemporary who independently developed calculus at the same time?',
      hi: 'Newton का वह यूरोपीय समकालीन कौन था जिसने उसी समय स्वतन्त्र रूप से कलन विकसित किया?',
    },
    options: [
      { en: 'René Descartes', hi: 'रेने देकार्त', sa: 'रेने देकार्त', mai: 'रेने देकार्त', mr: 'रेने देकार्त', ta: 'René Descartes', te: 'René Descartes', bn: 'René Descartes', kn: 'René Descartes', gu: 'René Descartes' },
      { en: 'Gottfried Leibniz', hi: 'गॉटफ्रीड लाइबनित्ज़', sa: 'गॉटफ्रीड लाइबनित्ज़', mai: 'गॉटफ्रीड लाइबनित्ज़', mr: 'गॉटफ्रीड लाइबनित्ज़', ta: 'Gottfried Leibniz', te: 'Gottfried Leibniz', bn: 'Gottfried Leibniz', kn: 'Gottfried Leibniz', gu: 'Gottfried Leibniz' },
      { en: 'Blaise Pascal', hi: 'ब्लेज़ पास्कल', sa: 'ब्लेज़ पास्कल', mai: 'ब्लेज़ पास्कल', mr: 'ब्लेज़ पास्कल', ta: 'Blaise Pascal', te: 'Blaise Pascal', bn: 'Blaise Pascal', kn: 'Blaise Pascal', gu: 'Blaise Pascal' },
      { en: 'Pierre de Fermat', hi: 'पियर डे फर्मा', sa: 'पियर डे फर्मा', mai: 'पियर डे फर्मा', mr: 'पियर डे फर्मा', ta: 'Pierre de Fermat', te: 'Pierre de Fermat', bn: 'Pierre de Fermat', kn: 'Pierre de Fermat', gu: 'Pierre de Fermat' },
    ],
    correctAnswer: 1,
    explanation: {
      en: 'Gottfried Wilhelm Leibniz (1646–1716) independently developed calculus at the same time as Newton, leading to the famous "calculus priority dispute." Newton developed his "method of fluxions" in the 1660s but published late. Leibniz published his notation-based calculus in 1684, which became the standard (the ∫ and d/dx notation we use today comes from Leibniz, not Newton). The Madhava-Newton-Leibniz connection remains a fascinating chapter in the history of mathematics.',
      hi: 'गॉटफ्रीड विल्हेम लाइबनित्ज़ (1646–1716) ने Newton के साथ ही स्वतन्त्र रूप से कलन विकसित किया, जिससे प्रसिद्ध "कलन प्राथमिकता विवाद" हुआ। Newton ने 1660 के दशक में अपनी "फ्लक्सन विधि" विकसित की लेकिन देर से प्रकाशित किया। लाइबनित्ज़ ने 1684 में प्रकाशित किया। हम आज जो ∫ और d/dx संकेतन उपयोग करते हैं, वह Newton से नहीं — लाइबनित्ज़ से आता है।',
    },
  },
  {
    id: 'q25_7_08', type: 'mcq',
    question: {
      en: 'What did the Kerala School have that made their series more practically useful than just the basic Madhava-Leibniz series?',
      hi: 'केरल स्कूल के पास क्या था जिसने उनकी श्रृंखलाओं को केवल मूल माधव-लाइबनित्ज़ श्रृंखला से अधिक व्यावहारिक रूप से उपयोगी बनाया?',
    },
    options: [
      { en: 'Negative number arithmetic', hi: 'ऋण संख्या गणित', sa: 'ऋण संख्या गणित', mai: 'ऋण संख्या गणित', mr: 'ऋण संख्या गणित', ta: 'Negative number arithmetic', te: 'Negative number arithmetic', bn: 'Negative number arithmetic', kn: 'Negative number arithmetic', gu: 'Negative number arithmetic' },
      { en: 'Correction terms for faster convergence', hi: 'तेज़ अभिसरण के लिए सुधार पद', sa: 'तेज़ अभिसरण के लिए सुधार पद', mai: 'तेज़ अभिसरण के लिए सुधार पद', mr: 'तेज़ अभिसरण के लिए सुधार पद', ta: 'Correction terms for faster convergence', te: 'Correction terms for faster convergence', bn: 'Correction terms for faster convergence', kn: 'Correction terms for faster convergence', gu: 'Correction terms for faster convergence' },
      { en: 'Logarithm tables', hi: 'लघुगणक सारणियाँ', sa: 'लघुगणक सारणियाँ', mai: 'लघुगणक सारणियाँ', mr: 'लघुगणक सारणियाँ', ta: 'Logarithm tables', te: 'Logarithm tables', bn: 'Logarithm tables', kn: 'Logarithm tables', gu: 'Logarithm tables' },
      { en: 'A mechanical calculator', hi: 'एक यांत्रिक गणना यन्त्र', sa: 'एक यांत्रिक गणना यन्त्र', mai: 'एक यांत्रिक गणना यन्त्र', mr: 'एक यांत्रिक गणना यन्त्र', ta: 'A mechanical calculator', te: 'A mechanical calculator', bn: 'A mechanical calculator', kn: 'A mechanical calculator', gu: 'A mechanical calculator' },
    ],
    correctAnswer: 1,
    explanation: {
      en: 'The Kerala School, particularly Madhava, developed correction terms (also called "end-correction terms") that dramatically accelerated the convergence of their series. The basic π/4 series needs thousands of terms for even a few correct decimal places. Madhava\'s correction terms (of the form n/(4n²+1)) allow achieving the same accuracy with far fewer terms. This technique is closely related to what modern numerical analysts call "acceleration of convergence" — a sophisticated concept that predates its Western rediscovery by centuries.',
      hi: 'केरल स्कूल, विशेष रूप से माधव, ने सुधार पद ("अन्त-सुधार पद") विकसित किए जिन्होंने उनकी श्रृंखलाओं के अभिसरण को नाटकीय रूप से त्वरित किया। मूल π/4 श्रृंखला को कुछ सही दशमलव के लिए भी हजारों पदों की आवश्यकता है। माधव के सुधार पद (n/(4n²+1) के रूप में) बहुत कम पदों के साथ समान सटीकता प्राप्त करने देते हैं। यह तकनीक आधुनिक संख्यात्मक विश्लेषण में "अभिसरण का त्वरण" कहलाती है।',
    },
  },
  {
    id: 'q25_7_09', type: 'true_false',
    question: {
      en: 'Kerala mathematicians had developed correction terms for faster convergence of their infinite series — an advanced technique modern analysts call "acceleration of convergence."',
      hi: 'केरल गणितज्ञों ने अपनी अनन्त श्रृंखलाओं के तेज़ अभिसरण के लिए सुधार पद विकसित किए थे — एक उन्नत तकनीक जिसे आधुनिक विश्लेषक "अभिसरण का त्वरण" कहते हैं।',
    },
    correctAnswer: true,
    explanation: {
      en: 'True. The Yuktibhasha and other Kerala school texts describe correction terms for Madhava\'s series that dramatically reduce the number of terms needed for a given accuracy. For example, after n terms of the π/4 series, adding the correction term n/(4n²+1) gives a much better approximation than using n terms alone. This is a genuine pre-calculus technique for accelerating convergence — not known in European mathematics until the 18th century (Euler and others).',
      hi: 'सत्य। युक्तिभाषा और अन्य केरल स्कूल ग्रन्थ माधव की श्रृंखलाओं के लिए सुधार पद का वर्णन करते हैं जो किसी दी गई सटीकता के लिए आवश्यक पदों की संख्या को नाटकीय रूप से कम करते हैं। यह अभिसरण को त्वरित करने के लिए एक वास्तविक पूर्व-कलन तकनीक है — यूरोपीय गणित में 18वीं शताब्दी (Euler और अन्य) तक ज्ञात नहीं थी।',
    },
  },
  {
    id: 'q25_7_10', type: 'true_false',
    question: {
      en: 'There is plausible but unconfirmed evidence that Kerala mathematical knowledge may have been transmitted to Europe via Jesuit missionaries in the 16th–17th centuries.',
      hi: 'प्रशंसनीय लेकिन अपुष्ट प्रमाण है कि 16वीं-17वीं शताब्दी में जेसुइट मिशनरियों के माध्यम से केरल गणितीय ज्ञान यूरोप में प्रेषित हुआ होगा।',
    },
    correctAnswer: true,
    explanation: {
      en: 'True — though "plausible but unconfirmed" is the correct characterisation. Scholars like George Gheverghese Joseph and M.D. Srinivas have pointed to suggestive historical connections: Jesuit missionaries were active in Kerala in the 16th–17th centuries (the same period as the late Kerala School), and some Kerala texts on mathematics and astronomy were collected. However, no smoking-gun document has been found showing direct transmission. The debate continues in the history of mathematics community. Most historians acknowledge the temporal and circumstantial connections but require more evidence.',
      hi: 'सत्य — हालाँकि "प्रशंसनीय लेकिन अपुष्ट" सही लक्षण-वर्णन है। George Gheverghese Joseph और M.D. Srinivas जैसे विद्वानों ने सुझावात्मक ऐतिहासिक सम्बन्धों की ओर इशारा किया है: जेसुइट मिशनरी 16वीं-17वीं शताब्दी में केरल में सक्रिय थे, और कुछ केरल ग्रन्थ एकत्र किए गए। हालाँकि, सीधे प्रसार को दिखाने वाला कोई निर्णायक दस्तावेज़ नहीं मिला है। गणित के इतिहास समुदाय में बहस जारी है।',
    },
  },
];

/* ------------------------------------------------------------------ */
/*  PAGE 1 — Madhava and the Kerala School                              */
/* ------------------------------------------------------------------ */
function Page1() {
  const locale = useModuleLocale();
  const isHi = isDevanagariLocale(locale);
  return (
    <div className="space-y-6">
      <section>
        <h3 className="text-gold-light font-bold text-lg mb-3" style={{ fontFamily: 'var(--font-heading)' }}>
          {isHi ? 'माधव और केरल स्कूल — कलन का असली जन्मस्थान' : 'Madhava and the Kerala School — The Real Birthplace of Calculus'}
        </h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          {isHi
            ? <>1350 ई. के आसपास, जब यूरोप मध्ययुग के अंत में था और Black Death से उबर रहा था, केरल के एक गाँव में एक गणितज्ञ ऐसी गणनाएँ कर रहा था जो यूरोपीय कलन से 250+ वर्ष आगे थीं।</>
            : <>Around 1350 CE, when Europe was emerging from the Middle Ages and recovering from the Black Death, a mathematician in a Kerala village was performing calculations that would not be matched in Europe for another 250+ years.</>}
        </p>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5">
        <h4 className="text-gold-dark text-xs uppercase tracking-widest font-bold mb-3">
          {isHi ? 'माधव की महान खोजें' : "Madhava's Great Discoveries"}
        </h4>
        <div className="space-y-2">
          <p className="text-text-secondary text-xs leading-relaxed">
            <span className="text-gold-light font-semibold">{isHi ? 'π के लिए अनन्त श्रृंखला:' : 'Infinite series for π:'}</span>{' '}
            {isHi ? 'π/4 = 1 − 1/3 + 1/5 − 1/7 + ... (माधव-लाइबनित्ज़ श्रृंखला)। Europe में 1673 में।' : 'π/4 = 1 − 1/3 + 1/5 − 1/7 + ... (Madhava-Leibniz series). In Europe only in 1673.'}
          </p>
          <p className="text-text-secondary text-xs leading-relaxed">
            <span className="text-gold-light font-semibold">{isHi ? 'sine की अनन्त श्रृंखला:' : 'Infinite series for sine:'}</span>{' '}
            {isHi ? 'sin(x) = x − x³/3! + x⁵/5! − x⁷/7! + ... (माधव-Newton श्रृंखला)। Newton को श्रेय ~1670।' : 'sin(x) = x − x³/3! + x⁵/5! − x⁷/7! + ... (Madhava-Newton series). Credit to Newton ~1670.'}
          </p>
          <p className="text-text-secondary text-xs leading-relaxed">
            <span className="text-gold-light font-semibold">{isHi ? 'cosine की अनन्त श्रृंखला:' : 'Infinite series for cosine:'}</span>{' '}
            {isHi ? 'cos(x) = 1 − x²/2! + x⁴/4! − x⁶/6! + ... Newton को श्रेय।' : 'cos(x) = 1 − x²/2! + x⁴/4! − x⁶/6! + ... Credit to Newton.'}
          </p>
          <p className="text-text-secondary text-xs leading-relaxed">
            <span className="text-gold-light font-semibold">{isHi ? 'π का 11 दशमलव तक मान:' : 'Pi to 11 decimal places:'}</span>{' '}
            {isHi ? '3.14159265359 — यूरोप में ~1600 ई. तक नहीं।' : '3.14159265359 — not matched in Europe until ~1600 CE.'}
          </p>
          <p className="text-text-secondary text-xs leading-relaxed">
            <span className="text-gold-light font-semibold">{isHi ? 'अभिसरण त्वरण:' : 'Convergence acceleration:'}</span>{' '}
            {isHi ? 'श्रृंखलाओं के लिए सुधार पद जो तेज़ अभिसरण देते हैं — Euler से 300+ वर्ष पहले।' : 'Correction terms for series giving faster convergence — 300+ years before Euler.'}
          </p>
        </div>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-amber-500/15 rounded-xl p-5">
        <h4 className="text-amber-400 text-xs uppercase tracking-widest font-bold mb-3">
          {isHi ? 'माधव की ऐतिहासिक स्थिति' : "Madhava's Historical Position"}
        </h4>
        <p className="text-text-secondary text-xs leading-relaxed mb-2">
          {isHi
            ? <>माधव के मूल ग्रन्थ अधिकतर खो गए हैं। उनका काम बाद के केरल स्कूल के ग्रन्थों में उद्धरणों के माध्यम से जाना जाता है — विशेष रूप से युक्तिभाषा (ज्येष्ठदेव, ~1530) और तन्त्रसंग्रह (नीलकण्ठ सोमयाजी, ~1501)।</>
            : <>Madhava's original works are mostly lost. His work is known through quotations in later Kerala School texts — particularly the Yuktibhasha (Jyeshthadeva, ~1530) and Tantrasangraha (Nilakantha Somayaji, ~1501).</>}
        </p>
        <p className="text-text-secondary text-xs leading-relaxed">
          {isHi
            ? <>20वीं शताब्दी में, विद्वानों (विशेष रूप से K.V. Sarma) के शोध ने माधव के योगदान की सीमा को स्पष्ट किया। 1994 में, गणितज्ञ Victor Katz ने पुष्टि की कि माधव की श्रृंखलाएँ Newton और Leibniz की "टेलर श्रृंखलाओं" के समान हैं।</>
            : <>In the 20th century, scholarship (particularly K.V. Sarma's work) clarified the extent of Madhava's contributions. In 1994, mathematician Victor Katz confirmed that Madhava's series are identical to Newton and Leibniz's "Taylor series."</>}
        </p>
      </section>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  PAGE 2 — The Yuktibhasha: Proofs and Proto-Calculus                 */
/* ------------------------------------------------------------------ */
function Page2() {
  const locale = useModuleLocale();
  const isHi = isDevanagariLocale(locale);
  return (
    <div className="space-y-6">
      <section>
        <h3 className="text-gold-light font-bold text-lg mb-3" style={{ fontFamily: 'var(--font-heading)' }}>
          {isHi ? 'युक्तिभाषा — प्रोटो-कलन की प्रमाण-पुस्तक' : 'Yuktibhasha — The Proof-Text of Proto-Calculus'}
        </h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          {isHi
            ? <>~1530 ई. में ज्येष्ठदेव की युक्तिभाषा केरल स्कूल की सबसे महत्त्वपूर्ण विरासत है। यह मलयालम में लिखा गया एकमात्र प्राचीन भारतीय गणित ग्रन्थ है — और इसमें ऐसी गणितीय अवधारणाएँ हैं जो आधुनिक कलन की अग्रदूत हैं।</>
            : <>Jyeshthadeva's Yuktibhasha (~1530 CE) is the most important legacy of the Kerala School. It is the only ancient Indian mathematics text written in Malayalam — and contains mathematical concepts that are precursors to modern calculus.</>}
        </p>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5">
        <h4 className="text-gold-dark text-xs uppercase tracking-widest font-bold mb-3">
          {isHi ? 'युक्तिभाषा में क्या है?' : 'What Is in the Yuktibhasha?'}
        </h4>
        <div className="space-y-2">
          <p className="text-text-secondary text-xs leading-relaxed">
            <span className="text-gold-light font-semibold">{isHi ? 'π की अनन्त श्रृंखला का प्रमाण:' : 'Proof of the infinite series for π:'}</span>{' '}
            {isHi ? 'एक जटिल लेकिन कठोर ज्यामितीय-बीजगणितीय प्रमाण जो माधव की π श्रृंखला को व्युत्पन्न करता है।' : 'A complex but rigorous geometric-algebraic proof that derives Madhava\'s π series.'}
          </p>
          <p className="text-text-secondary text-xs leading-relaxed">
            <span className="text-gold-light font-semibold">{isHi ? 'Sine और Cosine श्रृंखलाओं के प्रमाण:' : 'Proofs of sine and cosine series:'}</span>{' '}
            {isHi ? 'विस्तृत प्रमाण जो sin(x) और cos(x) को अनन्त बहुपदों के रूप में व्यक्त करते हैं।' : 'Detailed proofs expressing sin(x) and cos(x) as infinite polynomials.'}
          </p>
          <p className="text-text-secondary text-xs leading-relaxed">
            <span className="text-gold-light font-semibold">{isHi ? 'पुनरावृत्ति और सीमाएँ:' : 'Iteration and limits:'}</span>{' '}
            {isHi ? 'आधुनिक "limit" अवधारणा के अग्रदूत — किसी प्रक्रिया को अनन्त बार दोहराकर एक निश्चित मान पर पहुँचना।' : 'Precursor to modern "limit" concept — reaching a definite value by iterating a process infinitely many times.'}
          </p>
          <p className="text-text-secondary text-xs leading-relaxed">
            <span className="text-gold-light font-semibold">{isHi ? 'सुधार पद:' : 'Correction terms:'}</span>{' '}
            {isHi ? 'n/(4n²+1) रूप के सुधार पद जो श्रृंखला को बहुत तेज़ी से अभिसरण करते हैं।' : 'Correction terms of the form n/(4n²+1) that make the series converge much faster.'}
          </p>
        </div>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-emerald-500/15 rounded-xl p-5">
        <h4 className="text-emerald-400 text-xs uppercase tracking-widest font-bold mb-3">
          {isHi ? 'कलन की मूल अवधारणाएँ — केरल स्कूल में' : 'Core Calculus Concepts — in the Kerala School'}
        </h4>
        <div className="space-y-2">
          <p className="text-text-secondary text-xs leading-relaxed">
            <span className="text-gold-light font-semibold">{isHi ? 'सीमा (Limit):' : 'Limit:'}</span>{' '}
            {isHi ? 'युक्तिभाषा में अनन्त प्रक्रियाओं के माध्यम से निश्चित मानों पर पहुँचने का स्पष्ट विचार।' : 'Clear idea of reaching definite values through infinite processes in the Yuktibhasha.'}
          </p>
          <p className="text-text-secondary text-xs leading-relaxed">
            <span className="text-gold-light font-semibold">{isHi ? 'अनन्त श्रृंखला योग:' : 'Infinite series summation:'}</span>{' '}
            {isHi ? 'अनन्त पदों के योग के परिणामस्वरूप परिमित संख्या — कलन का मूल तत्व।' : 'The sum of infinitely many terms resulting in a finite number — a core element of calculus.'}
          </p>
          <p className="text-text-secondary text-xs leading-relaxed">
            <span className="text-gold-light font-semibold">{isHi ? 'सूक्ष्म भिन्नता (Infinitesimal):' : 'Infinitesimals:'}</span>{' '}
            {isHi ? 'श्रृंखला व्युत्पत्तियों में अनन्त रूप से छोटे मात्राओं का अंतर्निहित उपयोग।' : 'Implicit use of infinitely small quantities in the series derivations.'}
          </p>
        </div>
      </section>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  PAGE 3 — The Transmission Question and Legacy                       */
/* ------------------------------------------------------------------ */
function Page3() {
  const locale = useModuleLocale();
  const isHi = isDevanagariLocale(locale);
  return (
    <div className="space-y-6">
      <section>
        <h3 className="text-gold-light font-bold text-lg mb-3" style={{ fontFamily: 'var(--font-heading)' }}>
          {isHi ? 'संचरण प्रश्न और विरासत' : 'The Transmission Question and Legacy'}
        </h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          {isHi
            ? <>सबसे बड़ा प्रश्न: क्या केरल स्कूल का ज्ञान यूरोप में पहुँचा? और यदि नहीं, तो इसका इतिहास में क्या स्थान है?</>
            : <>The biggest question: did Kerala School knowledge reach Europe? And if not, what is its place in history?</>}
        </p>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-amber-500/15 rounded-xl p-5">
        <h4 className="text-amber-400 text-xs uppercase tracking-widest font-bold mb-3">
          {isHi ? 'क्या ज्ञान यूरोप पहुँचा? — बहस' : 'Did Knowledge Reach Europe? — The Debate'}
        </h4>
        <p className="text-text-secondary text-xs leading-relaxed mb-2">
          {isHi
            ? <><span className="text-gold-light font-medium">पक्ष में:</span> जेसुइट मिशनरी 16वीं-17वीं शताब्दी में केरल में सक्रिय थे। मत्तेओ रिक्की और क्रिस्टोफर क्लेवियस जैसे जेसुइट पुजारी भारतीय खगोल विज्ञान में रुचि रखते थे। कुछ केरल ग्रन्थ यूरोप भेजे गए होंगे।</>
            : <><span className="text-gold-light font-medium">Evidence for:</span> Jesuit missionaries were active in Kerala in the 16th–17th centuries. Jesuit priests like Matteo Ricci and Christopher Clavius were interested in Indian astronomy. Some Kerala texts may have been sent to Europe.</>}
        </p>
        <p className="text-text-secondary text-xs leading-relaxed mb-2">
          {isHi
            ? <><span className="text-gold-light font-medium">विपक्ष में:</span> कोई सीधा दस्तावेज़ी प्रमाण नहीं। Newton और Leibniz के पत्र-व्यवहार में केरल का कोई उल्लेख नहीं। स्वतन्त्र खोज असंभव नहीं।</>
            : <><span className="text-gold-light font-medium">Evidence against:</span> No direct documentary evidence found. No mention of Kerala in Newton or Leibniz correspondence. Independent discovery is not impossible.</>}
        </p>
        <p className="text-text-secondary text-xs leading-relaxed">
          {isHi
            ? <><span className="text-gold-light font-medium">वर्तमान सहमति:</span> अधिकांश इतिहासकार इसे "प्रशंसनीय लेकिन अपुष्ट" मानते हैं। सबसे महत्त्वपूर्ण तथ्य यह है कि भारत में कलन 250+ वर्ष पहले विकसित हुआ — चाहे यूरोप ने इसे जाना या नहीं।</>
            : <><span className="text-gold-light font-medium">Current consensus:</span> Most historians consider it "plausible but unconfirmed." The key fact remains: calculus developed in India 250+ years before Europe — whether Europe knew it or not.</>}
        </p>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-purple-500/15 rounded-xl p-5">
        <h4 className="text-purple-300 text-xs uppercase tracking-widest font-bold mb-3">
          {isHi ? 'केरल स्कूल की विरासत' : "The Kerala School's Legacy"}
        </h4>
        <p className="text-text-secondary text-xs leading-relaxed mb-2">
          {isHi
            ? <>केरल स्कूल ने साबित किया कि कलन के विकास के लिए न्यूटनीय भौतिकी की आवश्यकता नहीं थी — खगोल विज्ञान और त्रिकोणमिति की ज़रूरतें पर्याप्त थीं। अधिक सटीक ग्रहण की भविष्यवाणी, बेहतर नौवहन, और सूर्योदय/अस्त का सटीक समय — ये व्यावहारिक ज़रूरतें गणित को आगे धकेल रही थीं।</>
            : <>The Kerala School proved that calculus didn't require Newtonian physics — the needs of astronomy and trigonometry were sufficient. More precise eclipse prediction, better navigation, and accurate sunrise/sunset times — these practical needs were driving mathematics forward.</>}
        </p>
        <p className="text-text-secondary text-xs leading-relaxed">
          {isHi
            ? <>यह पञ्चाङ्ग प्रतिदिन ग्रहों की स्थिति, सूर्योदय, और ग्रहण की गणना करता है। इन गणनाओं में आर्यभट की ज्या सारणी, माधव की श्रृंखला-त्वरण तकनीक, और ब्रह्मगुप्त के शून्य — तीनों एक साथ काम करते हैं। भारतीय गणित का जीवित उपयोग।</>
            : <>This Panchang computes planetary positions, sunrise, and eclipses every day. In these calculations, Aryabhata's jya table, Madhava's series-acceleration technique, and Brahmagupta's zero all work together. Living use of Indian mathematics.</>}
        </p>
      </section>
    </div>
  );
}

export default function Module25_7Page() {
  return <ModuleContainer meta={META} pages={[<Page1 key="p1" />, <Page2 key="p2" />, <Page3 key="p3" />]} questions={QUESTIONS} />;
}
