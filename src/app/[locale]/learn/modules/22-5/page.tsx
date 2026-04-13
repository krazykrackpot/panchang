'use client';

import ModuleContainer, { type ModuleMeta, type ModuleQuestion, useModuleLocale } from '@/components/learn/ModuleContainer';
import { isDevanagariLocale } from '@/lib/utils/locale-fonts';
import { lt } from '@/lib/learn/translations';
import type { LocaleText } from '@/lib/learn/translations';
import L from '@/messages/learn/modules/22-5.json';

const META: ModuleMeta = {
  id: 'mod_22_5', phase: 9, topic: 'Astronomy', moduleNumber: '22.5',
  title: L.title as unknown as Record<string, string>,
  subtitle: L.subtitle as unknown as Record<string, string>,
  estimatedMinutes: 14,
  crossRefs: L.crossRefs as unknown as Array<{label: Record<string, string>; href: string}>,
};

const QUESTIONS: ModuleQuestion[] = [
  {
    id: 'q22_5_01', type: 'mcq',
    question: {
      en: 'Why can\'t we use the same hour-angle formula for moonrise as we do for sunrise?',
      hi: 'चन्द्रोदय के लिए सूर्योदय वाला घण्टा-कोण सूत्र क्यों नहीं उपयोग कर सकते?',
    },
    options: [
      { en: 'The Moon has no declination', hi: 'चन्द्रमा की कोई क्रान्ति नहीं है', sa: 'चन्द्रमा की कोई क्रान्ति नहीं है', mai: 'चन्द्रमा की कोई क्रान्ति नहीं है', mr: 'चन्द्रमा की कोई क्रान्ति नहीं है', ta: 'The Moon has no declination', te: 'The Moon has no declination', bn: 'The Moon has no declination', kn: 'The Moon has no declination', gu: 'The Moon has no declination' },
      { en: 'The Moon moves ~13°/day, changing position significantly during the computation', hi: 'चन्द्रमा ~13°/दिन चलता है, गणना के दौरान स्थिति महत्त्वपूर्ण रूप से बदलती है', sa: 'चन्द्रमा ~13°/दिन चलता है, गणना के दौरान स्थिति महत्त्वपूर्ण रूप से बदलती है', mai: 'चन्द्रमा ~13°/दिन चलता है, गणना के दौरान स्थिति महत्त्वपूर्ण रूप से बदलती है', mr: 'चन्द्रमा ~13°/दिन चलता है, गणना के दौरान स्थिति महत्त्वपूर्ण रूप से बदलती है', ta: 'The Moon moves ~13°/day, changing position significantly during the computation', te: 'The Moon moves ~13°/day, changing position significantly during the computation', bn: 'The Moon moves ~13°/day, changing position significantly during the computation', kn: 'The Moon moves ~13°/day, changing position significantly during the computation', gu: 'The Moon moves ~13°/day, changing position significantly during the computation' },
      { en: 'The Moon has no atmosphere', hi: 'चन्द्रमा का कोई वायुमण्डल नहीं है', sa: 'चन्द्रमा का कोई वायुमण्डल नहीं है', mai: 'चन्द्रमा का कोई वायुमण्डल नहीं है', mr: 'चन्द्रमा का कोई वायुमण्डल नहीं है', ta: 'The Moon has no atmosphere', te: 'The Moon has no atmosphere', bn: 'The Moon has no atmosphere', kn: 'The Moon has no atmosphere', gu: 'The Moon has no atmosphere' },
      { en: 'The Moon is always above the horizon', hi: 'चन्द्रमा सदैव क्षितिज से ऊपर है', sa: 'चन्द्रमा सदैव क्षितिज से ऊपर है', mai: 'चन्द्रमा सदैव क्षितिज से ऊपर है', mr: 'चन्द्रमा सदैव क्षितिज से ऊपर है', ta: 'The Moon is always above the horizon', te: 'The Moon is always above the horizon', bn: 'The Moon is always above the horizon', kn: 'The Moon is always above the horizon', gu: 'The Moon is always above the horizon' },
    ],
    correctAnswer: 1,
    explanation: {
      en: 'The hour-angle formula assumes the object\'s position is nearly constant during the rise event. The Sun moves ~1°/day so this works. The Moon moves ~13°/day — it shifts ~0.5° during the hour it takes to rise, invalidating the static assumption.',
      hi: 'घण्टा-कोण सूत्र मानता है कि उदय घटना के दौरान पिण्ड की स्थिति लगभग स्थिर है। सूर्य ~1°/दिन चलता है अतः यह कार्य करता है। चन्द्रमा ~13°/दिन चलता है — उदय में लगने वाले घण्टे में ~0.5° खिसकता है, स्थैतिक धारणा को अमान्य करता है।',
    },
  },
  {
    id: 'q22_5_02', type: 'mcq',
    question: {
      en: 'How does our engine find moonrise?',
      hi: 'हमारा इंजन चन्द्रोदय कैसे ढूँढता है?',
    },
    options: [
      { en: 'Direct hour-angle formula like sunrise', hi: 'सूर्योदय जैसा प्रत्यक्ष घण्टा-कोण सूत्र', sa: 'सूर्योदय जैसा प्रत्यक्ष घण्टा-कोण सूत्र', mai: 'सूर्योदय जैसा प्रत्यक्ष घण्टा-कोण सूत्र', mr: 'सूर्योदय जैसा प्रत्यक्ष घण्टा-कोण सूत्र', ta: 'Direct hour-angle formula like sunrise', te: 'Direct hour-angle formula like sunrise', bn: 'Direct hour-angle formula like sunrise', kn: 'Direct hour-angle formula like sunrise', gu: 'Direct hour-angle formula like sunrise' },
      { en: 'Scan Moon altitude every 5 minutes for 24 hours, then binary search the crossing', hi: '24 घण्टे प्रत्येक 5 मिनट पर चन्द्र ऊँचाई जाँचें, फिर क्रॉसिंग पर द्विआधारी खोज', sa: '24 घण्टे प्रत्येक 5 मिनट पर चन्द्र ऊँचाई जाँचें, फिर क्रॉसिंग पर द्विआधारी खोज', mai: '24 घण्टे प्रत्येक 5 मिनट पर चन्द्र ऊँचाई जाँचें, फिर क्रॉसिंग पर द्विआधारी खोज', mr: '24 घण्टे प्रत्येक 5 मिनट पर चन्द्र ऊँचाई जाँचें, फिर क्रॉसिंग पर द्विआधारी खोज', ta: 'Scan Moon altitude every 5 minutes for 24 hours, then binary search the crossing', te: 'Scan Moon altitude every 5 minutes for 24 hours, then binary search the crossing', bn: 'Scan Moon altitude every 5 minutes for 24 hours, then binary search the crossing', kn: 'Scan Moon altitude every 5 minutes for 24 hours, then binary search the crossing', gu: 'Scan Moon altitude every 5 minutes for 24 hours, then binary search the crossing' },
      { en: 'Look up a pre-computed table', hi: 'पूर्व-गणित सारणी देखें', sa: 'पूर्व-गणित सारणी देखें', mai: 'पूर्व-गणित सारणी देखें', mr: 'पूर्व-गणित सारणी देखें', ta: 'Look up a pre-computed table', te: 'Look up a pre-computed table', bn: 'Look up a pre-computed table', kn: 'Look up a pre-computed table', gu: 'Look up a pre-computed table' },
      { en: 'Use the same algorithm as sunrise with different refraction', hi: 'भिन्न अपवर्तन के साथ सूर्योदय का एल्गोरिदम उपयोग करें', sa: 'भिन्न अपवर्तन के साथ सूर्योदय का एल्गोरिदम उपयोग करें', mai: 'भिन्न अपवर्तन के साथ सूर्योदय का एल्गोरिदम उपयोग करें', mr: 'भिन्न अपवर्तन के साथ सूर्योदय का एल्गोरिदम उपयोग करें', ta: 'Use the same algorithm as sunrise with different refraction', te: 'Use the same algorithm as sunrise with different refraction', bn: 'Use the same algorithm as sunrise with different refraction', kn: 'Use the same algorithm as sunrise with different refraction', gu: 'Use the same algorithm as sunrise with different refraction' },
    ],
    correctAnswer: 1,
    explanation: {
      en: 'We compute the Moon\'s topocentric altitude every 5 minutes over 24 hours, looking for sign changes (altitude crossing the threshold from negative to positive). When found, we use binary search (15 iterations) to refine the crossing to ~0.03-second precision.',
      hi: '24 घण्टों में प्रत्येक 5 मिनट पर चन्द्रमा की स्थलकेन्द्रीय ऊँचाई गणित करते हैं, चिह्न परिवर्तन (ऊँचाई का सीमा को ऋणात्मक से धनात्मक पार करना) ढूँढते हैं। मिलने पर, क्रॉसिंग को ~0.03 सेकण्ड सटीकता तक शोधित करने के लिए द्विआधारी खोज (15 पुनरावृत्तियाँ) करते हैं।',
    },
  },
  {
    id: 'q22_5_03', type: 'mcq',
    question: {
      en: 'The moonrise altitude threshold h₀ is approximately:',
      hi: 'चन्द्रोदय ऊँचाई सीमा h₀ लगभग है:',
    },
    options: [
      { en: '-0.8333° (same as sunrise)', hi: '-0.8333° (सूर्योदय के समान)', sa: '-0.8333° (सूर्योदय के समान)', mai: '-0.8333° (सूर्योदय के समान)', mr: '-0.8333° (सूर्योदय के समान)', ta: '-0.8333° (same as sunrise)', te: '-0.8333° (same as sunrise)', bn: '-0.8333° (same as sunrise)', kn: '-0.8333° (same as sunrise)', gu: '-0.8333° (same as sunrise)' },
      { en: '0° (geometric horizon)', hi: '0° (ज्यामितीय क्षितिज)', sa: '0° (ज्यामितीय क्षितिज)', mai: '0° (ज्यामितीय क्षितिज)', mr: '0° (ज्यामितीय क्षितिज)', ta: '0° (geometric horizon)', te: '0° (geometric horizon)', bn: '0° (geometric horizon)', kn: '0° (geometric horizon)', gu: '0° (geometric horizon)' },
      { en: '-0.3° (semi-diameter minus refraction, with parallax applied separately)', hi: '-0.3° (अर्ध-व्यास ऋण अपवर्तन, लम्बन अलग से लागू)', sa: '-0.3° (अर्ध-व्यास ऋण अपवर्तन, लम्बन अलग से लागू)', mai: '-0.3° (अर्ध-व्यास ऋण अपवर्तन, लम्बन अलग से लागू)', mr: '-0.3° (अर्ध-व्यास ऋण अपवर्तन, लम्बन अलग से लागू)', ta: '-0.3° (semi-diameter minus refraction, with parallax applied separately)', te: '-0.3° (semi-diameter minus refraction, with parallax applied separately)', bn: '-0.3° (semi-diameter minus refraction, with parallax applied separately)', kn: '-0.3° (semi-diameter minus refraction, with parallax applied separately)', gu: '-0.3° (semi-diameter minus refraction, with parallax applied separately)' },
      { en: '-6° (civil twilight)', hi: '-6° (नागरिक गोधूलि)', sa: '-6° (नागरिक गोधूलि)', mai: '-6° (नागरिक गोधूलि)', mr: '-6° (नागरिक गोधूलि)', ta: '-6° (civil twilight)', te: '-6° (civil twilight)', bn: '-6° (civil twilight)', kn: '-6° (civil twilight)', gu: '-6° (civil twilight)' },
    ],
    correctAnswer: 2,
    explanation: {
      en: 'The Moon\'s threshold is ~-0.3°, not the Sun\'s -0.8333°. The Moon\'s semi-diameter (~16\') nearly cancels with refraction (~34\'), but parallax is applied separately as a topocentric correction because it depends on the Moon\'s distance and the observer\'s exact location.',
      hi: 'चन्द्रमा की सीमा ~-0.3° है, सूर्य की -0.8333° नहीं। चन्द्र अर्ध-व्यास (~16\') अपवर्तन (~34\') से लगभग सन्तुलित हो जाता है, किन्तु लम्बन स्थलकेन्द्रीय सुधार के रूप में अलग से लागू होता है क्योंकि यह चन्द्र दूरी और प्रेक्षक के सटीक स्थान पर निर्भर करता है।',
    },
  },
  {
    id: 'q22_5_04', type: 'true_false',
    question: {
      en: 'The Moon\'s parallax at the horizon can be nearly 1 degree.',
      hi: 'क्षितिज पर चन्द्रमा का लम्बन लगभग 1 अंश हो सकता है।',
    },
    correctAnswer: true,
    explanation: {
      en: 'True. The Moon\'s horizontal parallax ranges from 54\' to 61\' depending on distance (356k-407k km). At perigee, it exceeds 1°. This means the Moon\'s observed position from Earth\'s surface differs from its geocentric position by nearly a full degree at the horizon.',
      hi: 'सत्य। चन्द्रमा का क्षैतिज लम्बन दूरी (356k-407k किमी) के आधार पर 54\' से 61\' तक होता है। उपभू पर यह 1° से अधिक होता है। इसका अर्थ है कि पृथ्वी सतह से चन्द्रमा की प्रेक्षित स्थिति क्षितिज पर भूकेन्द्रीय स्थिति से लगभग एक पूर्ण अंश भिन्न होती है।',
    },
  },
  {
    id: 'q22_5_05', type: 'mcq',
    question: {
      en: 'The topocentric correction for the Moon\'s altitude is:',
      hi: 'चन्द्र ऊँचाई का स्थलकेन्द्रीय सुधार है:',
    },
    options: [
      { en: 'alt_topo = alt_geo + HP x cos(alt)', hi: 'alt_topo = alt_geo + HP × cos(alt)', sa: 'alt_topo = alt_geo + HP × cos(alt)', mai: 'alt_topo = alt_geo + HP × cos(alt)', mr: 'alt_topo = alt_geo + HP × cos(alt)', ta: 'alt_topo = alt_geo + HP x cos(alt)', te: 'alt_topo = alt_geo + HP x cos(alt)', bn: 'alt_topo = alt_geo + HP x cos(alt)', kn: 'alt_topo = alt_geo + HP x cos(alt)', gu: 'alt_topo = alt_geo + HP x cos(alt)' },
      { en: 'alt_topo = alt_geo - HP x cos(alt)', hi: 'alt_topo = alt_geo - HP × cos(alt)', sa: 'alt_topo = alt_geo - HP × cos(alt)', mai: 'alt_topo = alt_geo - HP × cos(alt)', mr: 'alt_topo = alt_geo - HP × cos(alt)', ta: 'alt_topo = alt_geo - HP x cos(alt)', te: 'alt_topo = alt_geo - HP x cos(alt)', bn: 'alt_topo = alt_geo - HP x cos(alt)', kn: 'alt_topo = alt_geo - HP x cos(alt)', gu: 'alt_topo = alt_geo - HP x cos(alt)' },
      { en: 'alt_topo = alt_geo - HP x sin(alt)', hi: 'alt_topo = alt_geo - HP × sin(alt)', sa: 'alt_topo = alt_geo - HP × sin(alt)', mai: 'alt_topo = alt_geo - HP × sin(alt)', mr: 'alt_topo = alt_geo - HP × sin(alt)', ta: 'alt_topo = alt_geo - HP x sin(alt)', te: 'alt_topo = alt_geo - HP x sin(alt)', bn: 'alt_topo = alt_geo - HP x sin(alt)', kn: 'alt_topo = alt_geo - HP x sin(alt)', gu: 'alt_topo = alt_geo - HP x sin(alt)' },
      { en: 'alt_topo = alt_geo / HP', hi: 'alt_topo = alt_geo / HP', sa: 'alt_topo = alt_geo / HP', mai: 'alt_topo = alt_geo / HP', mr: 'alt_topo = alt_geo / HP', ta: 'alt_topo = alt_geo / HP', te: 'alt_topo = alt_geo / HP', bn: 'alt_topo = alt_geo / HP', kn: 'alt_topo = alt_geo / HP', gu: 'alt_topo = alt_geo / HP' },
    ],
    correctAnswer: 1,
    explanation: {
      en: 'The topocentric altitude is lower than the geocentric: alt_topo = alt_geo - HP x cos(alt). At the horizon (alt ≈ 0°), the correction is maximum: alt_topo ≈ alt_geo - HP. The parallax pushes the Moon\'s apparent position downward toward the horizon.',
      hi: 'स्थलकेन्द्रीय ऊँचाई भूकेन्द्रीय से कम है: alt_topo = alt_geo - HP × cos(alt)। क्षितिज (alt ≈ 0°) पर सुधार अधिकतम है: alt_topo ≈ alt_geo - HP। लम्बन चन्द्रमा की दृश्य स्थिति को क्षितिज की ओर नीचे धकेलता है।',
    },
  },
  {
    id: 'q22_5_06', type: 'mcq',
    question: {
      en: 'The horizontal parallax (HP) varies from 54\' to 61\' because:',
      hi: 'क्षैतिज लम्बन (HP) 54\' से 61\' तक भिन्न होता है क्योंकि:',
    },
    options: [
      { en: 'Earth\'s radius changes with latitude', hi: 'पृथ्वी की त्रिज्या अक्षांश से बदलती है' },
      { en: 'The Moon\'s distance varies between perigee (356k km) and apogee (407k km)', hi: 'चन्द्र दूरी उपभू (356k किमी) और अपभू (407k किमी) के बीच भिन्न होती है' },
      { en: 'Atmospheric pressure changes', hi: 'वायुमण्डलीय दाब परिवर्तन', sa: 'वायुमण्डलीय दाब परिवर्तन', mai: 'वायुमण्डलीय दाब परिवर्तन', mr: 'वायुमण्डलीय दाब परिवर्तन', ta: 'Atmospheric pressure changes', te: 'Atmospheric pressure changes', bn: 'Atmospheric pressure changes', kn: 'Atmospheric pressure changes', gu: 'Atmospheric pressure changes' },
      { en: 'The Moon\'s diameter changes', hi: 'चन्द्रमा का व्यास बदलता है' },
    ],
    correctAnswer: 1,
    explanation: {
      en: 'HP = arcsin(6378/distance). When the Moon is at perigee (~356,000 km), HP ≈ 61\'. At apogee (~407,000 km), HP ≈ 54\'. This 7-arcminute variation is computed from the 14 cosine distance terms of Meeus Table 47.A.',
      hi: 'HP = arcsin(6378/दूरी)। जब चन्द्रमा उपभू (~356,000 किमी) पर है, HP ≈ 61\'। अपभू (~407,000 किमी) पर, HP ≈ 54\'। यह 7 कला भिन्नता मीयस सारणी 47.A के 14 कोज्या दूरी पदों से गणित होती है।',
    },
  },
  {
    id: 'q22_5_07', type: 'mcq',
    question: {
      en: 'How many binary search iterations does our engine use, and what precision does this achieve?',
      hi: 'हमारा इंजन कितनी द्विआधारी खोज पुनरावृत्तियाँ करता है, और इससे कितनी सटीकता प्राप्त होती है?',
    },
    options: [
      { en: '5 iterations, ~10 second precision', hi: '5 पुनरावृत्तियाँ, ~10 सेकण्ड सटीकता', sa: '5 पुनरावृत्तियाँ, ~10 सेकण्ड सटीकता', mai: '5 पुनरावृत्तियाँ, ~10 सेकण्ड सटीकता', mr: '5 पुनरावृत्तियाँ, ~10 सेकण्ड सटीकता', ta: '5 iterations, ~10 second precision', te: '5 iterations, ~10 second precision', bn: '5 iterations, ~10 second precision', kn: '5 iterations, ~10 second precision', gu: '5 iterations, ~10 second precision' },
      { en: '15 iterations, ~0.03 second precision', hi: '15 पुनरावृत्तियाँ, ~0.03 सेकण्ड सटीकता', sa: '15 पुनरावृत्तियाँ, ~0.03 सेकण्ड सटीकता', mai: '15 पुनरावृत्तियाँ, ~0.03 सेकण्ड सटीकता', mr: '15 पुनरावृत्तियाँ, ~0.03 सेकण्ड सटीकता', ta: '15 iterations, ~0.03 second precision', te: '15 iterations, ~0.03 second precision', bn: '15 iterations, ~0.03 second precision', kn: '15 iterations, ~0.03 second precision', gu: '15 iterations, ~0.03 second precision' },
      { en: '100 iterations, ~0.001 second precision', hi: '100 पुनरावृत्तियाँ, ~0.001 सेकण्ड सटीकता', sa: '100 पुनरावृत्तियाँ, ~0.001 सेकण्ड सटीकता', mai: '100 पुनरावृत्तियाँ, ~0.001 सेकण्ड सटीकता', mr: '100 पुनरावृत्तियाँ, ~0.001 सेकण्ड सटीकता', ta: '100 iterations, ~0.001 second precision', te: '100 iterations, ~0.001 second precision', bn: '100 iterations, ~0.001 second precision', kn: '100 iterations, ~0.001 second precision', gu: '100 iterations, ~0.001 second precision' },
      { en: '3 iterations, ~1 minute precision', hi: '3 पुनरावृत्तियाँ, ~1 मिनट सटीकता', sa: '3 पुनरावृत्तियाँ, ~1 मिनट सटीकता', mai: '3 पुनरावृत्तियाँ, ~1 मिनट सटीकता', mr: '3 पुनरावृत्तियाँ, ~1 मिनट सटीकता', ta: '3 iterations, ~1 minute precision', te: '3 iterations, ~1 minute precision', bn: '3 iterations, ~1 minute precision', kn: '3 iterations, ~1 minute precision', gu: '3 iterations, ~1 minute precision' },
    ],
    correctAnswer: 1,
    explanation: {
      en: '15 bisection iterations on a 5-minute bracket: 5 min / 2^15 = 5 x 60 / 32768 ≈ 0.009 seconds. In practice, the Moon\'s position uncertainty (~0.3°) limits the actual accuracy to about 2 minutes, but the binary search itself is not the bottleneck.',
      hi: '5 मिनट के कोष्ठक पर 15 द्विभाजन पुनरावृत्तियाँ: 5 मिनट / 2^15 = 5 × 60 / 32768 ≈ 0.009 सेकण्ड। व्यवहार में, चन्द्र स्थिति अनिश्चितता (~0.3°) वास्तविक सटीकता को लगभग 2 मिनट तक सीमित करती है, किन्तु द्विआधारी खोज स्वयं बाधक नहीं है।',
    },
  },
  {
    id: 'q22_5_08', type: 'true_false',
    question: {
      en: 'On some days, the Moon does not rise at all (no moonrise event within 24 hours).',
      hi: 'कुछ दिनों में चन्द्रमा बिल्कुल उदित नहीं होता (24 घण्टों में कोई चन्द्रोदय घटना नहीं)।',
    },
    correctAnswer: true,
    explanation: {
      en: 'True. Because the Moon rises ~50 minutes later each day, there are occasional days when moonrise falls just before midnight one day and just after midnight the next, leaving a calendar day with no moonrise. This is a normal astronomical occurrence, not a calculation error.',
      hi: 'सत्य। चन्द्रमा प्रतिदिन ~50 मिनट देर से उदित होता है, अतः कभी-कभी चन्द्रोदय एक दिन मध्यरात्रि से ठीक पहले और अगले दिन ठीक बाद आता है, जिससे एक कैलेण्डर दिन बिना चन्द्रोदय के रह जाता है। यह सामान्य खगोलीय घटना है, गणना त्रुटि नहीं।',
    },
  },
  {
    id: 'q22_5_09', type: 'mcq',
    question: {
      en: 'Our moonrise result is typically within how many minutes of Drik Panchang?',
      hi: 'हमारा चन्द्रोदय परिणाम दृक् पंचांग से सामान्यतः कितने मिनटों के भीतर है?',
    },
    options: [
      { en: 'Within 10 seconds', hi: '10 सेकण्ड के भीतर', sa: '10 सेकण्ड के भीतर', mai: '10 सेकण्ड के भीतर', mr: '10 सेकण्ड के भीतर', ta: 'Within 10 seconds', te: 'Within 10 seconds', bn: 'Within 10 seconds', kn: 'Within 10 seconds', gu: 'Within 10 seconds' },
      { en: 'Within 2 minutes', hi: '2 मिनट के भीतर', sa: '2 मिनट के भीतर', mai: '2 मिनट के भीतर', mr: '2 मिनट के भीतर', ta: 'Within 2 minutes', te: 'Within 2 minutes', bn: 'Within 2 minutes', kn: 'Within 2 minutes', gu: 'Within 2 minutes' },
      { en: 'Within 15 minutes', hi: '15 मिनट के भीतर', sa: '15 मिनट के भीतर', mai: '15 मिनट के भीतर', mr: '15 मिनट के भीतर', ta: 'Within 15 minutes', te: 'Within 15 minutes', bn: 'Within 15 minutes', kn: 'Within 15 minutes', gu: 'Within 15 minutes' },
      { en: 'Within 1 hour', hi: '1 घण्टे के भीतर', sa: '1 घण्टे के भीतर', mai: '1 घण्टे के भीतर', mr: '1 घण्टे के भीतर', ta: 'Within 1 hour', te: 'Within 1 hour', bn: 'Within 1 hour', kn: 'Within 1 hour', gu: 'Within 1 hour' },
    ],
    correctAnswer: 1,
    explanation: {
      en: 'Our moonrise is typically within 2 minutes of Drik Panchang. The remaining ~2 minute error comes primarily from the Moon\'s longitude accuracy (~0.3° from the 60-term Meeus algorithm). The binary search and parallax corrections are precise enough — it is the lunar position that limits us.',
      hi: 'हमारा चन्द्रोदय सामान्यतः दृक् पंचांग से 2 मिनट के भीतर है। शेष ~2 मिनट त्रुटि मुख्यतः चन्द्र भोगांश सटीकता (~0.3° 60-पद मीयस एल्गोरिदम से) से आती है। द्विआधारी खोज और लम्बन सुधार पर्याप्त सटीक हैं — चन्द्र स्थिति हमें सीमित करती है।',
    },
  },
  {
    id: 'q22_5_10', type: 'mcq',
    question: {
      en: 'Why does the Moon rise about 50 minutes later each successive day?',
      hi: 'चन्द्रमा प्रत्येक अगले दिन लगभग 50 मिनट देर से क्यों उदित होता है?',
    },
    options: [
      { en: 'Because the Moon orbits retrograde', hi: 'क्योंकि चन्द्रमा वक्री कक्षा में है', sa: 'क्योंकि चन्द्रमा वक्री कक्षा में है', mai: 'क्योंकि चन्द्रमा वक्री कक्षा में है', mr: 'क्योंकि चन्द्रमा वक्री कक्षा में है', ta: 'Because the Moon orbits retrograde', te: 'Because the Moon orbits retrograde', bn: 'Because the Moon orbits retrograde', kn: 'Because the Moon orbits retrograde', gu: 'Because the Moon orbits retrograde' },
      { en: 'Because Earth\'s rotation slows down each day', hi: 'क्योंकि पृथ्वी का घूर्णन प्रतिदिन धीमा होता है' },
      { en: 'Because the Moon moves ~13° eastward daily, and Earth must rotate an extra ~50 minutes to catch up', hi: 'क्योंकि चन्द्रमा प्रतिदिन ~13° पूर्व की ओर चलता है, और पृथ्वी को पकड़ने के लिए अतिरिक्त ~50 मिनट घूमना पड़ता है', sa: 'क्योंकि चन्द्रमा प्रतिदिन ~13° पूर्व की ओर चलता है, और पृथ्वी को पकड़ने के लिए अतिरिक्त ~50 मिनट घूमना पड़ता है', mai: 'क्योंकि चन्द्रमा प्रतिदिन ~13° पूर्व की ओर चलता है, और पृथ्वी को पकड़ने के लिए अतिरिक्त ~50 मिनट घूमना पड़ता है', mr: 'क्योंकि चन्द्रमा प्रतिदिन ~13° पूर्व की ओर चलता है, और पृथ्वी को पकड़ने के लिए अतिरिक्त ~50 मिनट घूमना पड़ता है', ta: 'Because the Moon moves ~13° eastward daily, and Earth must rotate an extra ~50 minutes to catch up', te: 'Because the Moon moves ~13° eastward daily, and Earth must rotate an extra ~50 minutes to catch up', bn: 'Because the Moon moves ~13° eastward daily, and Earth must rotate an extra ~50 minutes to catch up', kn: 'Because the Moon moves ~13° eastward daily, and Earth must rotate an extra ~50 minutes to catch up', gu: 'Because the Moon moves ~13° eastward daily, and Earth must rotate an extra ~50 minutes to catch up' },
      { en: 'Because of tidal forces', hi: 'ज्वारीय बलों के कारण', sa: 'ज्वारीय बलों के कारण', mai: 'ज्वारीय बलों के कारण', mr: 'ज्वारीय बलों के कारण', ta: 'Because of tidal forces', te: 'Because of tidal forces', bn: 'Because of tidal forces', kn: 'Because of tidal forces', gu: 'Because of tidal forces' },
    ],
    correctAnswer: 2,
    explanation: {
      en: 'The Moon moves ~13° eastward per day in its orbit. Earth rotates 360° in 24 hours (15°/hour), so it takes an extra 13°/15 ≈ 0.87 hours ≈ 52 minutes to rotate that additional amount and bring the Moon back to the same horizon position.',
      hi: 'चन्द्रमा अपनी कक्षा में प्रतिदिन ~13° पूर्व की ओर चलता है। पृथ्वी 24 घण्टों में 360° (15°/घण्टा) घूमती है, अतः उस अतिरिक्त मात्रा को घूमने और चन्द्रमा को उसी क्षितिज स्थिति पर लाने में 13°/15 ≈ 0.87 घण्टे ≈ 52 मिनट अतिरिक्त लगते हैं।',
    },
  },
];

function Page1() {
  const locale = useModuleLocale();
  const isHi = isDevanagariLocale(locale);
  return (
    <div className="space-y-6">
      <section>
        <h3 className="text-gold-light font-bold text-lg mb-3" style={{ fontFamily: 'var(--font-heading)' }}>
          {isHi ? 'चन्द्रोदय सूर्योदय से कठिन क्यों है' : 'Why Moonrise Is Harder Than Sunrise'}
        </h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">{isHi ? <>सूर्योदय के लिए हमने एक सुन्दर घण्टा-कोण सूत्र उपयोग किया जो मानता है कि उदय घटना के दौरान सूर्य की स्थिति मूलतः स्थिर है। सूर्य प्रतिदिन केवल ~1° चलता है, अतः मध्याह्न (जब हम प्राचल गणित करते हैं) और सूर्योदय के बीच ~6 घण्टों में इसकी क्रान्ति और विषुवांश मुश्किल से बदलते हैं। चन्द्रमा इस धारणा को तोड़ता है। ~13.2° प्रतिदिन चलने का अर्थ है कि चन्द्रमा एक घण्टे में ~0.5° खिसकता है — उन अपवर्तन और लम्बन सुधारों के तुल्य जो हम लगाने का प्रयास कर रहे हैं। एक &quot;स्नैपशॉट&quot; स्थिति से चन्द्रोदय गणित करने वाला विश्लेषणात्मक सूत्र 10-30 मिनट गलत होगा। इसके बजाय, हमें पुनरावृत्तीय दृष्टिकोण उपयोग करना चाहिए।</> : <>For sunrise, we used an elegant hour-angle formula that assumes the Sun&apos;s position is essentially fixed during the rise event. The Sun moves only ~1° per day, so its declination and right ascension barely change in the ~6 hours between noon (when we compute the parameters) and sunrise. The Moon shatters this assumption. Moving ~13.2° per day means the Moon shifts ~0.5° in a single hour — comparable to the refraction and parallax corrections we&apos;re trying to apply. An analytical formula that computes moonrise from a &quot;snapshot&quot; position would be off by 10-30 minutes. Instead, we must use an iterative approach.</>}</p>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">{isHi ? <>हमारा दृष्टिकोण: 24 घण्टों में प्रत्येक 5 मिनट पर क्षितिज से चन्द्र ऊँचाई गणित करें। प्रत्येक चरण पर, पूर्ण 60-पद मीयस एल्गोरिदम से चन्द्र भूकेन्द्रीय स्थिति (भोगांश, अक्षांश, दूरी) गणित करें, क्षैतिज निर्देशांकों (दिगंश और ऊँचाई) में बदलें, और फिर स्थलकेन्द्रीय लम्बन सुधार लगाएँ। जब दो क्रमागत बिन्दु मिलें जहाँ ऊँचाई ऋणात्मक से धनात्मक बदलती है (चन्द्रमा उदय सीमा पार करता है), तो चन्द्रोदय घटना 5-मिनट खिड़की में कोष्ठकित हो गई।</> : <>Our approach: compute the Moon&apos;s altitude above the horizon every 5 minutes for 24 hours. At each step, we calculate the Moon&apos;s geocentric position (longitude, latitude, distance) using the full 60-term Meeus algorithm, convert to horizontal coordinates (azimuth and altitude), and then apply the topocentric parallax correction. When we find two consecutive points where the altitude changes from negative to positive (the Moon crosses the rise threshold), we have bracketed the moonrise event in a 5-minute window.</>}</p>
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
        <h3 className="text-gold-light font-bold text-lg mb-3" style={{ fontFamily: 'var(--font-heading)' }}>
          {isHi ? 'स्थलकेन्द्रीय सुधार — लम्बन क्यों महत्त्वपूर्ण है' : 'Topocentric Correction — Why Parallax Matters'}
        </h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">{isHi ? <>चन्द्रमा एकमात्र ऐसा आकाशीय पिण्ड है जो पृथ्वी से इतना निकट है कि लम्बन — प्रेक्षक के केन्द्र के बजाय सतह पर होने से दृश्य स्थिति में खिसकाव — महत्त्वपूर्ण अन्तर डालता है। सूर्य का लम्बन केवल 8.8 कला-सेकण्ड (नगण्य) है। चन्द्रमा का क्षैतिज लम्बन 54&apos; से 61&apos; तक — लगभग 1 अंश! क्षितिज पर (जहाँ ऊँचाई 0° के निकट), लम्बन सुधार अधिकतम है: alt_topo = alt_geo - HP × cos(alt)। cos(0°) = 1 होने से, पूर्ण HP मान क्षितिज पर ज्यामितीय ऊँचाई से घटाया जाता है।</> : <>The Moon is the one celestial object close enough to Earth that parallax — the shift in apparent position due to the observer being on the surface rather than at the center of the Earth — makes a significant difference. The Sun&apos;s parallax is only 8.8 arcseconds (negligible). The Moon&apos;s horizontal parallax ranges from 54&apos; to 61&apos; — nearly 1 degree! At the horizon (where altitude is close to 0°), the parallax correction is at its maximum: alt_topo = alt_geo - HP x cos(alt). Since cos(0°) = 1, the full HP value is subtracted from the geometric altitude at the horizon.</>}</p>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">{isHi ? <>HP स्वयं चन्द्र दूरी से गणित होता है: sin(HP) = 6378.14 / दूरी, जहाँ 6378.14 किमी पृथ्वी की विषुवतीय त्रिज्या है। दूरी मीयस सारणी 47.A के 14 कोज्या पदों से आती है। उपभू (~356,000 किमी) पर HP ≈ 61&apos; (चन्द्रमा बड़ा दिखता है — यही &quot;सुपरमून&quot; का समय है)। अपभू (~407,000 किमी) पर HP ≈ 54&apos;। लम्बन में यह 7 कला भिन्नता उपभू और अपभू के बीच चन्द्रोदय समय को कई मिनट खिसकाती है, उसी आकाश स्थिति के लिए भी।</> : <>The HP itself is computed from the Moon&apos;s distance: sin(HP) = 6378.14 / distance, where 6378.14 km is Earth&apos;s equatorial radius. The distance comes from the 14 cosine terms of Meeus Table 47.A. At perigee (~356,000 km), HP ≈ 61&apos; (the Moon appears larger — this is when &quot;supermoons&quot; occur). At apogee (~407,000 km), HP ≈ 54&apos;. This 7-arcminute variation in parallax causes moonrise times to shift by several minutes between perigee and apogee, even for the same sky position.</>}</p>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5">
        <h4 className="text-gold-dark text-xs uppercase tracking-widest font-bold mb-2">{isHi ? 'उदय सीमा' : 'The Rise Threshold'}</h4>
        <p className="text-text-secondary text-sm leading-relaxed mb-2">{isHi ? <>चन्द्रोदय सीमा h₀ ≈ -0.3°। यह सूर्य के -0.8333° से भिन्न है क्योंकि चन्द्र अर्ध-व्यास (~16&apos;) और वायुमण्डलीय अपवर्तन (~34&apos;) आंशिक रूप से एक-दूसरे को सन्तुलित करते हैं, और बड़ा लम्बन सुधार स्थलकेन्द्रीय रूपान्तरण में अलग से संभाला जाता है। सटीक सीमा चन्द्र दूरी के साथ थोड़ी भिन्न होती है (अर्ध-व्यास 14.7&apos; से 16.7&apos; तक), किन्तु -0.3° एक अच्छा औसत है।</> : <>The moonrise threshold h₀ ≈ -0.3°. This differs from the Sun&apos;s -0.8333° because the Moon&apos;s semi-diameter (~16&apos;) and atmospheric refraction (~34&apos;) partially cancel, and the large parallax correction is handled separately in the topocentric conversion. The exact threshold varies slightly with the Moon&apos;s distance (semi-diameter ranges from 14.7&apos; to 16.7&apos;), but -0.3° is a good average.</>}</p>
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
        <h3 className="text-gold-light font-bold text-lg mb-3" style={{ fontFamily: 'var(--font-heading)' }}>
          {isHi ? 'द्विआधारी खोज शोधन' : 'Binary Search Refinement'}
        </h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">{isHi ? <>5-मिनट अन्वेषण से कोष्ठक मिलने पर (मान लें मिनट 420 पर ऊँचाई -0.5° और मिनट 425 पर +0.3°), द्विआधारी खोज करते हैं। मध्यबिन्दु मिनट 422.5 है। उस क्षण चन्द्र स्थलकेन्द्रीय ऊँचाई गणित करते हैं। ऋणात्मक हो तो उदय 422.5 और 425 के बीच। धनात्मक हो तो 420 और 422.5 के बीच। 15 पुनरावृत्तियों के बाद, कोष्ठक चौड़ाई 5 मिनट / 2^15 = 0.009 सेकण्ड — आवश्यकता से बहुत अधिक सटीकता। अन्तिम कोष्ठक का मध्यबिन्दु चन्द्रोदय समय लेते हैं।</> : <>Once the 5-minute scan finds a bracket (say, at minute 420 the altitude is -0.5° and at minute 425 it is +0.3°), we perform binary search. The midpoint is minute 422.5. We compute the Moon&apos;s topocentric altitude at that instant. If it&apos;s negative, the rise is between 422.5 and 425. If positive, between 420 and 422.5. After 15 iterations, the bracket width is 5 minutes / 2^15 = 0.009 seconds — far more precision than we need. We take the midpoint of the final bracket as the moonrise time.</>}</p>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">{isHi ? <>परिणाम को स्थानीय समय में बदलना: द्विआधारी खोज हमें आंशिक सटीकता वाला जूलियन दिवस देती है। UT घण्टे (JD_fractional - 0.5) × 24 के रूप में निकालते हैं, फिर प्रेक्षक के स्थान का समयक्षेत्र ऑफ़सेट जोड़ते हैं। हमारा परिणाम: अधिकांश तिथियों और स्थानों पर दृक् पंचांग से 2 मिनट के भीतर। ~2 मिनट शेष त्रुटि लगभग पूर्णतः चन्द्र भोगांश सटीकता (~0.3° 60-पद मीयस एल्गोरिदम से) से आती है, अन्वेषण या लम्बन सुधारों से नहीं।</> : <>Converting the result to local time: the binary search gives us a Julian Day with fractional precision. We extract the UT hours as (JD_fractional - 0.5) x 24, then add the timezone offset for the observer&apos;s location. Our result: within 2 minutes of Drik Panchang for most dates and locations. The ~2 minute residual error comes almost entirely from the Moon&apos;s longitude accuracy (~0.3° from the 60-term Meeus algorithm), not from the scanning or parallax corrections.</>}</p>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5 border border-emerald-500/15">
        <h4 className="text-emerald-400 text-xs uppercase tracking-widest font-bold mb-3">{isHi ? 'विशेष स्थितियाँ' : 'Edge Cases'}</h4>
        <p className="text-text-secondary text-xs leading-relaxed mb-2">{isHi ? <><span className="text-gold-light font-medium">चन्द्रोदय नहीं:</span> चन्द्रमा प्रतिदिन ~50 मिनट देर से उदित होने से, कभी-कभी ऐसी तिथि आती है जब चन्द्रोदय एक दिन मध्यरात्रि से ठीक पहले और अगला अगले दिन मध्यरात्रि के बाद आता है, जिससे एक कैलेण्डर तिथि बिना चन्द्रोदय रह जाती है। हमारा स्कैनर 24-घण्टे अन्वेषण में ऋणात्मक-से-धनात्मक क्रॉसिंग न मिलने पर &quot;चन्द्रोदय नहीं&quot; सही रूप से प्रतिवेदित करता है।</> : <><span className="text-gold-light font-medium">No moonrise:</span> Because the Moon rises ~50 minutes later each day, there are occasional dates when moonrise falls just before midnight and the next moonrise after midnight the following day, leaving one calendar date with no moonrise event. Our scanner correctly handles this by reporting &quot;no moonrise&quot; when the 24-hour scan finds no negative-to-positive crossing.</>}</p>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5 border border-red-500/15">
        <h4 className="text-red-400 text-xs uppercase tracking-widest font-bold mb-3">{isHi ? 'सामान्य भ्रान्तियाँ' : 'Common Misconceptions'}</h4>
        <p className="text-text-secondary text-xs leading-relaxed mb-2">{isHi ? <><span className="text-gold-light font-medium">भ्रान्ति:</span> &quot;चन्द्रोदय लम्बन सूर्य की तरह नगण्य है।&quot; सूर्य का लम्बन (8.8&quot;) वास्तव में नगण्य है। चन्द्रमा का लम्बन (~57&apos;) 400 गुना बड़ा है और दृश्य चन्द्रोदय समय को 3-5 मिनट खिसकाता है। इसकी अनदेखी करने से हमारा चन्द्रोदय लगातार कई मिनट देर से आता।</> : <><span className="text-gold-light font-medium">Misconception:</span> &quot;Moonrise parallax is negligible like the Sun&apos;s.&quot; The Sun&apos;s parallax (8.8&quot;) is indeed negligible. The Moon&apos;s parallax (~57&apos;) is 400 times larger and shifts the apparent moonrise time by 3-5 minutes. Ignoring it would make our moonrise consistently late by several minutes.</>}</p>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5 border border-blue-500/15">
        <h4 className="text-blue-300 text-xs uppercase tracking-widest font-bold mb-3">{isHi ? 'आधुनिक प्रासंगिकता' : 'Modern Relevance'}</h4>
        <p className="text-text-secondary text-xs leading-relaxed mb-2">{isHi ? <>चन्द्रोदय समय पंचांग के लिए अत्यन्त महत्त्वपूर्ण है: करवा चौथ पर चन्द्रोदय समय व्रत-भंग अनुष्ठान निर्धारित करता है। शरद पूर्णिमा पर चन्द्रोदय समय अनुष्ठान समय-निर्धारण प्रभावित करता है। हमारा अन्वेषण + द्विआधारी खोज दृष्टिकोण पूर्ण 60-पद चन्द्र स्थिति ~300 बार (288 अन्वेषण बिन्दु + ~15 द्विआधारी खोज पुनरावृत्तियाँ) गणित करने के बावजूद आधुनिक हार्डवेयर पर 100ms से कम में चलता है, जिससे यह वास्तविक-समय वेब अनुप्रयोगों के लिए व्यावहारिक है।</> : <>Moonrise timing is crucial for Panchang: the Chandrodaya (moonrise) time on Karva Chauth determines when the fast-breaking ritual occurs. On Sharad Purnima, moonrise timing affects ritual scheduling. Our scanning + binary search approach runs in under 100ms on modern hardware despite computing the full 60-term Moon position ~300 times (288 scan points + ~15 binary search iterations), making it practical for real-time web applications.</>}</p>
      </section>
    </div>
  );
}

export default function Module22_5Page() {
  return <ModuleContainer meta={META} pages={[<Page1 key="p1" />, <Page2 key="p2" />, <Page3 key="p3" />]} questions={QUESTIONS} />;
}