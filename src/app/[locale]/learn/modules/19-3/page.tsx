'use client';

import { tl } from '@/lib/utils/trilingual';
import ModuleContainer, { type ModuleMeta, type ModuleQuestion, useModuleLocale } from '@/components/learn/ModuleContainer';
import ExampleChart from '@/components/learn/ExampleChart';
import { isDevanagariLocale } from '@/lib/utils/locale-fonts';
import { lt } from '@/lib/learn/translations';
import type { LocaleText } from '@/lib/learn/translations';
import L from '@/messages/learn/modules/19-3.json';

const META: ModuleMeta = {
  id: 'mod_19_3', phase: 6, topic: 'Jaimini', moduleNumber: '19.3',
  title: L.title as unknown as Record<string, string>,
  subtitle: L.subtitle as unknown as Record<string, string>,
  estimatedMinutes: 13,
  crossRefs: L.crossRefs as unknown as Array<{label: Record<string, string>; href: string}>,
};

const QUESTIONS: ModuleQuestion[] = [
  {
    id: 'q19_3_01', type: 'mcq',
    question: {
      en: 'Argala on a house is created by planets in the:',
      hi: 'किसी भाव पर अर्गला किन भावों के ग्रहों द्वारा बनती है?',
    },
    options: [
      { en: '1st, 5th, and 9th from that house', hi: 'उस भाव से पहले, पाँचवें और नौवें', sa: 'तस्मात् भावात् प्रथमः पञ्चमः नवमश्च', mai: 'ओहि भावसँ पहिल, पाँचम आ नवम', mr: 'त्या भावापासून पहिला, पाचवा आणि नववा', ta: 'அந்த பாவத்திலிருந்து 1, 5, 9வது', te: 'ఆ భావం నుండి 1, 5, 9వ', bn: 'সেই ভাব থেকে ১, ৫, ৯তম', kn: 'ಆ ಭಾವದಿಂದ 1, 5, 9ನೇ', gu: 'તે ભાવથી 1, 5, 9મો' },
      { en: '2nd, 4th, and 11th from that house', hi: 'उस भाव से दूसरे, चौथे और ग्यारहवें', sa: 'तस्मात् भावात् द्वितीयः चतुर्थः एकादशश्च', mai: 'ओहि भावसँ दोसर, चौथ आ एगारहम', mr: 'त्या भावापासून दुसरा, चौथा आणि अकरावा', ta: 'அந்த பாவத்திலிருந்து 2, 4, 11வது', te: 'ఆ భావం నుండి 2, 4, 11వ', bn: 'সেই ভাব থেকে ২, ৪, ১১তম', kn: 'ಆ ಭಾವದಿಂದ 2, 4, 11ನೇ', gu: 'તે ભાવથી 2, 4, 11મો' },
      { en: '3rd, 7th, and 10th from that house', hi: 'उस भाव से तीसरे, सातवें और दसवें', sa: 'तस्मात् भावात् तृतीयः सप्तमः दशमश्च', mai: 'ओहि भावसँ तेसर, सातम आ दसम', mr: 'त्या भावापासून तिसरा, सातवा आणि दहावा', ta: 'அந்த பாவத்திலிருந்து 3, 7, 10வது', te: 'ఆ భావం నుండి 3, 7, 10వ', bn: 'সেই ভাব থেকে ৩, ৭, ১০তম', kn: 'ಆ ಭಾವದಿಂದ 3, 7, 10ನೇ', gu: 'તે ભાવથી 3, 7, 10મો' },
      { en: '6th, 8th, and 12th from that house', hi: 'उस भाव से छठे, आठवें और बारहवें', sa: 'तस्मात् भावात् षष्ठः अष्टमः द्वादशश्च', mai: 'ओहि भावसँ छठ, आठम आ बारहम', mr: 'त्या भावापासून सहावा, आठवा आणि बारावा', ta: 'அந்த பாவத்திலிருந்து 6, 8, 12வது', te: 'ఆ భావం నుండి 6, 8, 12వ', bn: 'সেই ভাব থেকে ৬, ৮, ১২তম', kn: 'ಆ ಭಾವದಿಂದ 6, 8, 12ನೇ', gu: 'તે ભાવથી 6, 8, 12મો' },
    ],
    correctAnswer: 1,
    explanation: {
      en: 'Argala (positive intervention or "bolt") is created by planets in the 2nd, 4th, and 11th houses from any reference house. These positions provide support, resources, and fulfillment to the house in question.',
      hi: 'अर्गला (सकारात्मक हस्तक्षेप या "चिटकनी") उस भाव से दूसरे, चौथे और ग्यारहवें भाव के ग्रहों द्वारा बनती है। ये स्थितियाँ विचाराधीन भाव को सहायता, संसाधन और पूर्णता प्रदान करती हैं।',
    },
  },
  {
    id: 'q19_3_02', type: 'mcq',
    question: {
      en: 'Virodha Argala (obstruction) on a house is caused by planets in the:',
      hi: 'विरोध अर्गला (बाधा) किसी भाव पर किन भावों के ग्रहों से होती है?',
    },
    options: [
      { en: '2nd, 4th, and 11th', hi: 'दूसरे, चौथे और ग्यारहवें', sa: 'द्वितीयः चतुर्थः एकादशश्च', mai: 'दोसर, चौथ आ एगारहम', mr: 'दुसरा, चौथा आणि अकरावा', ta: '2, 4, 11வது', te: '2, 4, 11వ', bn: '২, ৪, ১১তম', kn: '2, 4, 11ನೇ', gu: '2, 4, 11મો' },
      { en: '3rd, 10th, and 12th', hi: 'तीसरे, दसवें और बारहवें', sa: 'तृतीयः दशमः द्वादशश्च', mai: 'तेसर, दसम आ बारहम', mr: 'तिसरा, दहावा आणि बारावा', ta: '3, 10, 12வது', te: '3, 10, 12వ', bn: '৩, ১০, ১২তম', kn: '3, 10, 12ನೇ', gu: '3, 10, 12મો' },
      { en: '6th, 8th, and 12th', hi: 'छठे, आठवें और बारहवें', sa: 'षष्ठः अष्टमः द्वादशश्च', mai: 'छठ, आठम आ बारहम', mr: 'सहावा, आठवा आणि बारावा', ta: '6, 8, 12வது', te: '6, 8, 12వ', bn: '৬, ৮, ১২তম', kn: '6, 8, 12ನೇ', gu: '6, 8, 12મો' },
      { en: '1st, 7th, and 10th', hi: 'पहले, सातवें और दसवें', sa: 'प्रथमः सप्तमः दशमश्च', mai: 'पहिल, सातम आ दसम', mr: 'पहिला, सातवा आणि दहावा', ta: '1, 7, 10வது', te: '1, 7, 10వ', bn: '১, ৭, ১০তম', kn: '1, 7, 10ನೇ', gu: '1, 7, 10મો' },
    ],
    correctAnswer: 1,
    explanation: {
      en: 'Virodha Argala (counter-intervention/obstruction) comes from planets in the 3rd (counters 2nd Argala), 10th (counters 4th Argala), and 12th (counters 11th Argala). These positions can neutralize the support provided by Argala planets.',
      hi: 'विरोध अर्गला (प्रति-हस्तक्षेप/बाधा) तीसरे (दूसरे की अर्गला का विरोध), दसवें (चौथे की अर्गला का विरोध), और बारहवें (ग्यारहवें की अर्गला का विरोध) भाव के ग्रहों से आती है। ये स्थितियाँ अर्गला ग्रहों द्वारा प्रदत्त सहायता को निष्प्रभावित कर सकती हैं।',
    },
  },
  {
    id: 'q19_3_03', type: 'true_false',
    question: {
      en: 'If the Virodha Argala planets are equal in number or stronger than the Argala planets, the Argala is cancelled.',
      hi: 'यदि विरोध अर्गला ग्रह संख्या या शक्ति में अर्गला ग्रहों के बराबर या अधिक हों, तो अर्गला निरस्त हो जाती है।',
    },
    correctAnswer: true,
    explanation: {
      en: 'True. Argala holds only when the Argala-causing planets are stronger (by number of planets, or by benefic/malefic nature) than the Virodha Argala planets. If the obstruction is equal or greater, the Argala is effectively cancelled.',
      hi: 'सत्य। अर्गला तभी बनी रहती है जब अर्गला बनाने वाले ग्रह विरोध अर्गला ग्रहों से शक्तिशाली हों (ग्रहों की संख्या, या शुभ/अशुभ स्वभाव से)। यदि बाधा बराबर या अधिक हो, तो अर्गला प्रभावतः निरस्त हो जाती है।',
    },
  },
  {
    id: 'q19_3_04', type: 'mcq',
    question: {
      en: 'The 2nd house Argala is associated with:',
      hi: 'दूसरे भाव की अर्गला किससे सम्बन्धित है?',
    },
    options: [
      { en: 'Emotional and property intervention', hi: 'भावनात्मक और सम्पत्ति हस्तक्षेप', sa: 'भावनात्मकं सम्पत्तिहस्तक्षेपश्च', mai: 'भावनात्मक आ सम्पत्ति हस्तक्षेप', mr: 'भावनात्मक आणि मालमत्ता हस्तक्षेप', ta: 'உணர்ச்சி மற்றும் சொத்து தலையீடு', te: 'భావోద్వేగ మరియు ఆస్తి జోక్యం', bn: 'আবেগ ও সম্পত্তি হস্তক্ষেপ', kn: 'ಭಾವನಾತ್ಮಕ ಮತ್ತು ಆಸ್ತಿ ಹಸ್ತಕ್ಷೇಪ', gu: 'ભાવનાત્મક અને સંપત્તિ હસ્તક્ષેપ' },
      { en: 'Wealth and resource intervention', hi: 'धन और संसाधन हस्तक्षेप', sa: 'धनं संसाधनहस्तक्षेपश्च', mai: 'धन आ संसाधन हस्तक्षेप', mr: 'धन आणि संसाधन हस्तक्षेप', ta: 'செல்வம் மற்றும் வள தலையீடு', te: 'సంపద మరియు వనరుల జోక్యం', bn: 'ধন ও সম্পদ হস্তক্ষেপ', kn: 'ಸಂಪತ್ತು ಮತ್ತು ಸಂಪನ್ಮೂಲ ಹಸ್ತಕ್ಷೇಪ', gu: 'ધન અને સંસાધન હસ્તક્ષેપ' },
      { en: 'Gains and fulfillment intervention', hi: 'लाभ और पूर्णता हस्तक्षेप', sa: 'लाभः पूर्णताहस्तक्षेपश्च', mai: 'लाभ आ पूर्णता हस्तक्षेप', mr: 'लाभ आणि पूर्णता हस्तक्षेप', ta: 'லாபம் மற்றும் நிறைவு தலையீடு', te: 'లాభం మరియు సాఫల్య జోక్యం', bn: 'লাভ ও পূর্ণতা হস্তক্ষেপ', kn: 'ಲಾಭ ಮತ್ತು ಪೂರ್ಣತೆ ಹಸ್ತಕ್ಷೇಪ', gu: 'લાભ અને પૂર્ણતા હસ્તક્ષેપ' },
      { en: 'Children and creativity intervention', hi: 'सन्तान और सृजनशीलता हस्तक्षेप', sa: 'सन्तानं सृजनशीलताहस्तक्षेपश्च', mai: 'सन्तान आ सृजनशीलता हस्तक्षेप', mr: 'संतान आणि सृजनशीलता हस्तक्षेप', ta: 'குழந்தை மற்றும் படைப்பாற்றல் தலையீடு', te: 'సంతానం మరియు సృజనాత్మకత జోక్యం', bn: 'সন্তান ও সৃজনশীলতা হস্তক্ষেপ', kn: 'ಮಕ್ಕಳು ಮತ್ತು ಸೃಜನಶೀಲತೆ ಹಸ್ತಕ್ಷೇಪ', gu: 'સંતાન અને સર્જનાત્મકતા હસ્તક્ષેપ' },
    ],
    correctAnswer: 1,
    explanation: {
      en: 'The 2nd house represents wealth, family resources, and speech. When planets in the 2nd from a house create Argala, they provide financial/resource support to that house\'s significations. This is called Dhana (wealth) Argala.',
      hi: 'दूसरा भाव धन, पारिवारिक संसाधन और वाणी का प्रतिनिधित्व करता है। जब किसी भाव से दूसरे के ग्रह अर्गला बनाते हैं, वे उस भाव के फलादेशों को आर्थिक/संसाधन सहायता प्रदान करते हैं। इसे धन अर्गला कहते हैं।',
    },
  },
  {
    id: 'q19_3_05', type: 'mcq',
    question: {
      en: 'Which house creates the special "Putra Argala"?',
      hi: 'कौन-सा भाव विशेष "पुत्र अर्गला" बनाता है?',
    },
    options: [
      { en: '2nd house', hi: 'दूसरा भाव', sa: 'द्वितीयभावः', mai: 'दोसर भाव', mr: 'दुसरा भाव', ta: '2வது பாவம்', te: '2వ భావం', bn: '২য় ভাব', kn: '2ನೇ ಭಾವ', gu: '2જો ભાવ' },
      { en: '4th house', hi: 'चौथा भाव', sa: 'चतुर्थभावः', mai: 'चौथ भाव', mr: 'चौथा भाव', ta: '4வது பாவம்', te: '4వ భావం', bn: '৪র্থ ভাব', kn: '4ನೇ ಭಾವ', gu: '4થો ભાવ' },
      { en: '5th house', hi: 'पाँचवाँ भाव', sa: 'पञ्चमभावः', mai: 'पाँचम भाव', mr: 'पाचवा भाव', ta: '5வது பாவம்', te: '5వ భావం', bn: '৫ম ভাব', kn: '5ನೇ ಭಾವ', gu: '5મો ભાવ' },
      { en: '9th house', hi: 'नौवाँ भाव', sa: 'नवमभावः', mai: 'नवम भाव', mr: 'नववा भाव', ta: '9வது பாவம்', te: '9వ భావం', bn: '৯ম ভাব', kn: '9ನೇ ಭಾವ', gu: '9મો ભાવ' },
    ],
    correctAnswer: 2,
    explanation: {
      en: 'The 5th house from any reference creates Putra Argala — a special intervention related to children, creativity, and past-life merit (Poorva Punya). This is an additional Argala beyond the standard 2nd, 4th, and 11th.',
      hi: 'किसी भी सन्दर्भ से पाँचवाँ भाव पुत्र अर्गला बनाता है — सन्तान, सृजनशीलता और पूर्वजन्म के पुण्य (पूर्व पुण्य) से सम्बन्धित विशेष हस्तक्षेप। यह मानक दूसरे, चौथे और ग्यारहवें की अर्गला के अतिरिक्त है।',
    },
  },
  {
    id: 'q19_3_06', type: 'true_false',
    question: {
      en: 'The word "Argala" literally means "bolt" or "lock," referring to how planets lock in support for a house.',
      hi: '"अर्गला" शब्द का शाब्दिक अर्थ "चिटकनी" या "ताला" है, जो दर्शाता है कि ग्रह किसी भाव के लिए सहायता को कैसे बन्द कर देते हैं।',
    },
    correctAnswer: true,
    explanation: {
      en: 'True. "Argala" literally means a bolt or bar (like a door bolt). Just as a bolt secures a door, Argala planets "bolt" or "lock in" certain influences on a house, ensuring that those significations manifest — unless the bolt is removed by Virodha Argala.',
      hi: 'सत्य। "अर्गला" का शाब्दिक अर्थ चिटकनी या सिटकनी (जैसे दरवाज़े की चिटकनी) है। जैसे चिटकनी दरवाज़े को सुरक्षित करती है, वैसे ही अर्गला ग्रह किसी भाव पर निश्चित प्रभावों को "बन्द" कर देते हैं, यह सुनिश्चित करते हुए कि वे फलादेश प्रकट हों — जब तक विरोध अर्गला द्वारा चिटकनी न खोली जाए।',
    },
  },
  {
    id: 'q19_3_07', type: 'mcq',
    question: {
      en: 'The 4th house Argala provides what kind of intervention?',
      hi: 'चौथे भाव की अर्गला किस प्रकार का हस्तक्षेप प्रदान करती है?',
    },
    options: [
      { en: 'Wealth and speech support', hi: 'धन और वाणी सहायता', sa: 'धनवाक्सहायता', mai: 'धन आ वाणी सहायता', mr: 'धन आणि वाणी सहाय्य', ta: 'செல்வம் மற்றும் வாக்கு ஆதரவு', te: 'సంపద మరియు వాక్కు ఆధారం', bn: 'ধন ও বাক্ সহায়তা', kn: 'ಸಂಪತ್ತು ಮತ್ತು ವಾಕ್ ಬೆಂಬಲ', gu: 'ધન અને વાણી ટેકો' },
      { en: 'Emotional comfort, property, and happiness support', hi: 'भावनात्मक सुख, सम्पत्ति और आनन्द सहायता', sa: 'भावनात्मकसुखं सम्पत्तिः आनन्दसहायता च', mai: 'भावनात्मक सुख, सम्पत्ति आ आनन्द सहायता', mr: 'भावनिक सुख, मालमत्ता आणि आनंद सहाय्य', ta: 'உணர்ச்சி ஆறுதல், சொத்து, மற்றும் மகிழ்ச்சி ஆதரவு', te: 'భావోద్వేగ సౌకర్యం, ఆస్తి, సుఖ ఆధారం', bn: 'আবেগীয় স্বাচ্ছন্দ্য, সম্পত্তি ও সুখ সহায়তা', kn: 'ಭಾವನಾತ್ಮಕ ಸೌಕರ್ಯ, ಆಸ್ತಿ, ಸಂತೋಷ ಬೆಂಬಲ', gu: 'ભાવનાત્મક આરામ, સંપત્તિ, અને સુખ ટેકો' },
      { en: 'Gains and network support', hi: 'लाभ और जाल सहायता', sa: 'लाभः सञ्जालसहायता च', mai: 'लाभ आ जाल सहायता', mr: 'लाभ आणि जाळे सहाय्य', ta: 'லாபம் மற்றும் வலையமைப்பு ஆதரவு', te: 'లాభం మరియు జాలం ఆధారం', bn: 'লাভ ও যোগাযোগ সহায়তা', kn: 'ಲಾಭ ಮತ್ತು ಸಂಪರ್ಕ ಬೆಂಬಲ', gu: 'લાભ અને સંપર્ક ટેકો' },
      { en: 'Spiritual and father support', hi: 'आध्यात्मिक और पितृ सहायता', sa: 'आध्यात्मिकं पितृसहायता च', mai: 'आध्यात्मिक आ पितृ सहायता', mr: 'आध्यात्मिक आणि पितृ सहाय्य', ta: 'ஆன்மீகம் மற்றும் தந்தை ஆதரவு', te: 'ఆధ్యాత్మిక మరియు తండ్రి ఆధారం', bn: 'আধ্যাত্মিক ও পিতৃ সহায়তা', kn: 'ಆಧ್ಯಾತ್ಮಿಕ ಮತ್ತು ಪಿತೃ ಬೆಂಬಲ', gu: 'આધ્યાત્મિક અને પિતૃ ટેકો' },
    ],
    correctAnswer: 1,
    explanation: {
      en: 'The 4th house represents emotional happiness (sukha), property, vehicles, and mother. When planets in the 4th from a house create Argala, they provide emotional comfort and material stability to that house\'s affairs. This is Sukha Argala.',
      hi: 'चौथा भाव भावनात्मक सुख (सुख), सम्पत्ति, वाहन और माता का प्रतिनिधित्व करता है। जब किसी भाव से चौथे के ग्रह अर्गला बनाते हैं, वे उस भाव के मामलों को भावनात्मक सुख और भौतिक स्थिरता प्रदान करते हैं। यह सुख अर्गला है।',
    },
  },
  {
    id: 'q19_3_08', type: 'mcq',
    question: {
      en: 'Which position creates Virodha (obstruction) for the 4th house Argala?',
      hi: 'चौथे भाव की अर्गला के लिए विरोध (बाधा) कौन-सी स्थिति बनाती है?',
    },
    options: [
      { en: '3rd from the reference house', hi: 'सन्दर्भ भाव से तीसरा', sa: 'सन्दर्भभावात् तृतीयः', mai: 'सन्दर्भ भाव सँ तेसर', mr: 'संदर्भ भावापासून तिसरा', ta: 'குறிப்பு பாவத்திலிருந்து 3வது', te: 'సంబంధిత భావం నుండి 3వ', bn: 'সংশ্লিষ্ট ভাব থেকে ৩য়', kn: 'ಸಂದರ್ಭ ಭಾವದಿಂದ 3ನೇ', gu: 'સંદર્ભ ભાવથી 3જો' },
      { en: '10th from the reference house', hi: 'सन्दर्भ भाव से दसवाँ', sa: 'सन्दर्भभावात् दशमः', mai: 'सन्दर्भ भाव सँ दसम', mr: 'संदर्भ भावापासून दहावा', ta: 'குறிப்பு பாவத்திலிருந்து 10வது', te: 'సంబంధిత భావం నుండి 10వ', bn: 'সংশ্লিষ্ট ভাব থেকে ১০ম', kn: 'ಸಂದರ್ಭ ಭಾವದಿಂದ 10ನೇ', gu: 'સંદર્ભ ભાવથી 10મો' },
      { en: '12th from the reference house', hi: 'सन्दर्भ भाव से बारहवाँ', sa: 'सन्दर्भभावात् द्वादशः', mai: 'सन्दर्भ भाव सँ बारहम', mr: 'संदर्भ भावापासून बारावा', ta: 'குறிப்பு பாவத்திலிருந்து 12வது', te: 'సంబంధిత భావం నుండి 12వ', bn: 'সংশ্লিষ্ট ভাব থেকে ১২তম', kn: 'ಸಂದರ್ಭ ಭಾವದಿಂದ 12ನೇ', gu: 'સંદર્ભ ભાવથી 12મો' },
      { en: '8th from the reference house', hi: 'सन्दर्भ भाव से आठवाँ', sa: 'सन्दर्भभावात् अष्टमः', mai: 'सन्दर्भ भाव सँ आठम', mr: 'संदर्भ भावापासून आठवा', ta: 'குறிப்பு பாவத்திலிருந்து 8வது', te: 'సంబంధిత భావం నుండి 8వ', bn: 'সংশ্লিষ্ট ভাব থেকে ৮ম', kn: 'ಸಂದರ್ಭ ಭಾವದಿಂದ 8ನೇ', gu: 'સંદર્ભ ભાવથી 8મો' },
    ],
    correctAnswer: 1,
    explanation: {
      en: 'The 10th house from the reference creates Virodha Argala for the 4th house Argala. The pairing is: 2nd Argala vs 3rd Virodha, 4th Argala vs 10th Virodha, 11th Argala vs 12th Virodha.',
      hi: 'सन्दर्भ से दसवाँ भाव चौथे की अर्गला के लिए विरोध अर्गला बनाता है। जोड़ी है: दूसरी अर्गला बनाम तीसरी विरोध, चौथी अर्गला बनाम दसवीं विरोध, ग्यारहवीं अर्गला बनाम बारहवीं विरोध।',
    },
  },
  {
    id: 'q19_3_09', type: 'true_false',
    question: {
      en: 'Malefic planets can create beneficial Argala just as effectively as benefic planets.',
      hi: 'अशुभ ग्रह भी शुभ ग्रहों के समान प्रभावी ढंग से लाभकारी अर्गला बना सकते हैं।',
    },
    correctAnswer: true,
    explanation: {
      en: 'True. Both benefics and malefics create Argala. However, the nature of the intervention differs: benefic planets in the 2nd create supportive wealth Argala, while malefic planets in the 2nd create Argala through struggle, effort, or forced accumulation. The Argala still "bolts" the influence, but its quality depends on the planet\'s nature.',
      hi: 'सत्य। शुभ और अशुभ दोनों ग्रह अर्गला बनाते हैं। किन्तु हस्तक्षेप का स्वभाव भिन्न होता है: दूसरे में शुभ ग्रह सहायक धन अर्गला बनाते हैं, जबकि दूसरे में अशुभ ग्रह संघर्ष, प्रयास या बलपूर्वक संचय द्वारा अर्गला बनाते हैं। अर्गला प्रभाव को "बन्द" तो करती है, किन्तु उसकी गुणवत्ता ग्रह के स्वभाव पर निर्भर है।',
    },
  },
  {
    id: 'q19_3_10', type: 'mcq',
    question: {
      en: 'Jupiter is in the 8th house (2nd from the 7th). No planet is in the 9th house (3rd from the 7th). What does this indicate for the 7th house?',
      hi: 'बृहस्पति आठवें भाव (सातवें से दूसरा) में है। नौवें भाव (सातवें से तीसरा) में कोई ग्रह नहीं। यह सातवें भाव के लिए क्या दर्शाता है?',
    },
    options: [
      { en: 'No effect on the 7th house', hi: 'सातवें भाव पर कोई प्रभाव नहीं', sa: 'सप्तमभावे न कोऽपि प्रभावः', mai: 'सातम भाव पर कोनो प्रभाव नहि', mr: 'सातव्या भावावर कोणताही परिणाम नाही', ta: '7வது பாவத்தில் எந்த விளைவும் இல்லை', te: '7వ భావంపై ప్రభావం లేదు', bn: '৭ম ভাবে কোনো প্রভাব নেই', kn: '7ನೇ ಭಾವದ ಮೇಲೆ ಪ್ರಭಾವ ಇಲ್ಲ', gu: '7મા ભાવ પર કોઈ અસર નથી' },
      { en: 'Unobstructed wealth Argala on marriage — marriage brings prosperity', hi: 'विवाह पर अबाधित धन अर्गला — विवाह समृद्धि लाता है', sa: 'विवाहे अबाधितधनार्गला — विवाहः समृद्धिं आनयति', mai: 'विवाह पर अबाधित धन अर्गला — विवाह समृद्धि आनैत अछि', mr: 'विवाहावर अबाधित धन अर्गला — विवाह समृद्धी आणतो', ta: 'திருமணத்தில் தடையற்ற தன அர்கலா — திருமணம் செழிப்பு தருகிறது', te: 'వివాహంపై అడ్డులేని ధన అర్గళ — వివాహం సమృద్ధి తెస్తుంది', bn: 'বিবাহে অবাধ ধন অর্গলা — বিবাহ সমৃদ্ধি আনে', kn: 'ವಿವಾಹದಲ್ಲಿ ಅಡ್ಡಿಯಿಲ್ಲದ ಧನ ಅರ್ಗಳ — ವಿವಾಹ ಸಮೃದ್ಧಿ ತರುತ್ತದೆ', gu: 'લગ્નમાં અવરોધ વિનાનો ધન અર્ગલા — લગ્ન સમૃદ્ધિ લાવે છે' },
      { en: 'Virodha Argala blocks marriage', hi: 'विरोध अर्गला विवाह को अवरुद्ध करती है', sa: 'विरोधार्गला विवाहं अवरुणद्धि', mai: 'विरोध अर्गला विवाह केँ अवरुद्ध करैत अछि', mr: 'विरोध अर्गला विवाह अडवतो', ta: 'விரோத அர்கலா திருமணத்தைத் தடுக்கிறது', te: 'విరోధ అర్గళ వివాహాన్ని అడ్డుకుంటుంది', bn: 'বিরোধ অর্গলা বিবাহ আটকায়', kn: 'ವಿರೋಧ ಅರ್ಗಳ ವಿವಾಹವನ್ನು ತಡೆಯುತ್ತದೆ', gu: 'વિરોધ અર્ગલા લગ્ન રોકે છે' },
      { en: 'Jupiter causes delay in marriage', hi: 'बृहस्पति विवाह में विलम्ब करता है', sa: 'गुरुः विवाहे विलम्बं करोति', mai: 'बृहस्पति विवाह मे विलम्ब करैत अछि', mr: 'गुरू विवाहात विलंब करतो', ta: 'குரு திருமணத்தில் தாமதம் ஏற்படுத்துகிறது', te: 'గురువు వివాహంలో ఆలస్యం కలిగిస్తాడు', bn: 'বৃহস্পতি বিবাহে বিলম্ব ঘটায়', kn: 'ಗುರು ವಿವಾಹದಲ್ಲಿ ವಿಳಂಬ ಉಂಟುಮಾಡುತ್ತಾನೆ', gu: 'ગુરુ લગ્નમાં વિલંબ કરે છે' },
    ],
    correctAnswer: 1,
    explanation: {
      en: 'Jupiter in the 2nd from the 7th creates Dhana (wealth) Argala on the 7th house (marriage/partnerships). The 3rd from the 7th (9th house) has no planet, so there is no Virodha Argala to counter it. The Argala holds unobstructed — meaning marriage brings wealth and prosperity.',
      hi: 'सातवें से दूसरे में बृहस्पति सातवें भाव (विवाह/साझेदारी) पर धन अर्गला बनाता है। सातवें से तीसरे (नौवें भाव) में कोई ग्रह नहीं, अतः कोई विरोध अर्गला नहीं। अर्गला अबाधित बनी रहती है — अर्थात् विवाह धन और समृद्धि लाता है।',
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
          {tl({ en: 'What Is Argala?', hi: 'अर्गला क्या है?', sa: 'अर्गला क्या है?' }, locale)}
        </h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          {isHi
            ? <>अर्गला जैमिनी के सर्वाधिक व्यावहारिक उपकरणों में से एक है — यह निर्धारित करने की पद्धति कि कौन-से भाव ग्रहीय हस्तक्षेप द्वारा &quot;समर्थित&quot; या &quot;बन्द&quot; हैं, और कौन-से असुरक्षित छोड़े गये हैं। &quot;अर्गला&quot; शब्द का शाब्दिक अर्थ चिटकनी या सिटकनी है, जैसे दरवाज़े की चिटकनी जो प्रवेश को सुरक्षित करती है। ज्योतिषीय दृष्टि से, जब ग्रह किसी भाव के सापेक्ष निश्चित स्थितियों में हों, वे उस भाव को अपने प्रभाव से &quot;बन्द&quot; कर देते हैं, यह सुनिश्चित करते हुए कि भाव के फलादेश जातक के जीवन में प्रकट हों।</>
            : <>Argala is one of Jaimini&apos;s most practical tools — a system for determining which houses are &quot;supported&quot; or &quot;bolted&quot; by planetary intervention, and which are left exposed. The word &quot;argala&quot; literally means a bolt or bar, like a door-bolt that secures an entrance. In astrological terms, when planets occupy certain positions relative to a house, they &quot;bolt&quot; that house with their influence, ensuring that the house&apos;s significations manifest in the native&apos;s life.</>}
        </p>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          {isHi
            ? <>तीन प्राथमिक अर्गला स्थितियाँ हैं: सन्दर्भ से <strong>दूसरा भाव</strong> — धन (धन/संसाधन) अर्गला; <strong>चौथा भाव</strong> — सुख (आनन्द/सम्पत्ति) अर्गला; <strong>ग्यारहवाँ भाव</strong> — लाभ (प्राप्ति/पूर्णता) अर्गला। इसके अतिरिक्त, <strong>पाँचवाँ भाव</strong> विशेष पुत्र अर्गला बनाता है जो सन्तान, सृजनशीलता और पूर्वजन्म के पुण्य से सम्बन्धित है।</>
            : <>The three primary Argala positions are: <strong>2nd house</strong> from the reference — Dhana (wealth/resource) Argala; <strong>4th house</strong> — Sukha (happiness/property) Argala; <strong>11th house</strong> — Labha (gains/fulfillment) Argala. Additionally, the <strong>5th house</strong> creates a special Putra Argala related to children, creativity, and past-life merit.</>}
        </p>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5">
        <h4 className="text-gold-dark text-xs uppercase tracking-widest font-bold mb-2">{tl({ en: 'Virodha Argala — The Counter-Bolt', hi: 'विरोध अर्गला — प्रतिचिटकनी', sa: 'विरोध अर्गला — प्रतिचिटकनी' }, locale)}</h4>
        <p className="text-text-secondary text-sm leading-relaxed mb-2">
          {isHi
            ? <>प्रत्येक अर्गला स्थिति के लिए एक संगत विरोध अर्गला (बाधा) स्थिति है। <strong>तीसरे</strong> भाव के ग्रह दूसरे भाव की अर्गला का प्रतिकार करते हैं। <strong>दसवें</strong> के ग्रह चौथे की अर्गला का। <strong>बारहवें</strong> के ग्रह ग्यारहवें की अर्गला का। यदि विरोध अर्गला ग्रह संख्या या शक्ति में अर्गला ग्रहों के बराबर या अधिक हों, हस्तक्षेप निष्प्रभावित हो जाता है — चिटकनी &quot;खुल&quot; जाती है।</>
            : <>For every Argala position, there is a corresponding Virodha Argala (obstruction) position. Planets in the <strong>3rd</strong> house counter the 2nd house Argala. Planets in the <strong>10th</strong> house counter the 4th house Argala. Planets in the <strong>12th</strong> house counter the 11th house Argala. If the Virodha Argala planets are equal in number or stronger than the Argala planets, the intervention is neutralized — the bolt is &quot;unlocked.&quot;</>}
        </p>
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
          {tl({ en: 'Types of Argala in Detail', hi: 'अर्गला के प्रकार विस्तार से', sa: 'अर्गला के प्रकार विस्तार से' }, locale)}
        </h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          {isHi
            ? <><strong>धन अर्गला (दूसरा भाव):</strong> धन, पारिवारिक संसाधन और वाणी। जब शुभ ग्रह किसी भाव से दूसरे में हों, वे सुनिश्चित करते हैं कि भाव को आर्थिक पोषण मिले। सातवें भाव से दूसरे में बृहस्पति, उदाहरणार्थ, विवाह क्षेत्र को समृद्धि से बन्द करता है — पत्नी/पति धन ला सकता है, या विवाह जातक की आर्थिक स्थिति सुधार सकता है।</>
            : <><strong>Dhana Argala (2nd house):</strong> Wealth, family resources, and speech. When benefic planets occupy the 2nd from a house, they ensure that the house receives financial nourishment. Jupiter in the 2nd from the 7th house, for example, bolts the marriage sector with prosperity — the spouse may bring wealth, or the marriage may improve the native&apos;s financial status. If malefics are in the 2nd, the Argala still exists but operates through struggle or forced accumulation.</>}
        </p>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          {isHi
            ? <><strong>सुख अर्गला (चौथा भाव):</strong> भावनात्मक सुख, सम्पत्ति, वाहन और माता का प्रभाव। किसी भाव से चौथे के ग्रह उस भाव के मामलों को सुख और भावनात्मक आधार प्रदान करते हैं। <strong>लाभ अर्गला (ग्यारहवाँ भाव):</strong> प्राप्ति, पूर्णता और सामाजिक जाल। यह उपलब्धि की अर्गला है — यहाँ के ग्रह सुनिश्चित करते हैं कि भाव के वादे वास्तव में फलित हों और जातक को उनसे लाभ मिले।</>
            : <><strong>Sukha Argala (4th house):</strong> Emotional happiness, property, vehicles, and mother&apos;s influence. Planets in the 4th from a house provide comfort and emotional grounding to that house&apos;s affairs. Venus in the 4th from the lagna bolts the self with luxury and aesthetic pleasure. <strong>Labha Argala (11th house):</strong> Gains, fulfillment, and social networks. This is the Argala of achievement — planets here ensure that the house&apos;s promises actually bear fruit and the native gains from them.</>}
        </p>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5 border border-emerald-500/15">
        <h4 className="text-emerald-400 text-xs uppercase tracking-widest font-bold mb-3">{tl({ en: 'Putra Argala — The Special 5th', hi: 'पुत्र अर्गला — विशेष पाँचवाँ', sa: 'पुत्र अर्गला — विशेष पाँचवाँ' }, locale)}</h4>
        <p className="text-text-secondary text-xs leading-relaxed mb-2">
          {isHi
            ? <><span className="text-gold-light font-medium">विशेष प्रकरण:</span> किसी भी सन्दर्भ से पाँचवाँ भाव पुत्र अर्गला बनाता है — सृजनशीलता, सन्तान, बुद्धि और पूर्वजन्म के पुण्य (पूर्व पुण्य) में निहित हस्तक्षेप। यह अर्गला विशेष मानी जाती है क्योंकि पाँचवाँ भाव संचित आध्यात्मिक पुण्य का प्रतिनिधित्व करता है। जब किसी भाव से पाँचवें में शक्तिशाली शुभ ग्रह हों, भाव को &quot;दैवी सहायता&quot; मिलती है — पूर्व कर्मों के आशीर्वाद जो अकथनीय भाग्य या सुगम परिणामों के रूप में प्रकट होते हैं।</>
            : <><span className="text-gold-light font-medium">Special case:</span> The 5th house from any reference creates Putra Argala — an intervention rooted in creativity, children, intelligence, and past-life merit (Poorva Punya). This Argala is considered special because the 5th house represents accumulated spiritual credit. When the 5th from a house has strong benefics, the house receives &quot;divine support&quot; — blessings from past actions that manifest as unexplained luck or smooth outcomes. The Virodha for Putra Argala comes from the 9th house (which is the 5th from the 5th, creating an interesting recursive pattern).</>}
        </p>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5 border border-red-500/15">
        <h4 className="text-red-400 text-xs uppercase tracking-widest font-bold mb-3">{tl({ en: 'Common Misconceptions', hi: 'सामान्य भ्रान्तियाँ', sa: 'सामान्य भ्रान्तियाँ' }, locale)}</h4>
        <p className="text-text-secondary text-xs leading-relaxed mb-2">
          {isHi
            ? <><span className="text-gold-light font-medium">भ्रान्ति:</span> &quot;अर्गला केवल शुभ ग्रहों से कार्य करती है।&quot; यह असत्य है। शुभ और अशुभ दोनों ग्रह अर्गला बनाते हैं। सातवें से दूसरे में शनि भी विवाह पर धन अर्गला बनाता है — किन्तु धन कठिन परिश्रम, विलम्बित सन्तुष्टि या वरिष्ठ साथियों द्वारा आ सकता है। अर्गला विद्यमान है; उसकी गुणवत्ता ग्रह के स्वभाव से रंगित होती है।</>
            : <><span className="text-gold-light font-medium">Misconception:</span> &quot;Argala only works with benefic planets.&quot; This is false. Both benefic and malefic planets create Argala. Saturn in the 2nd from the 7th still creates Dhana Argala on marriage — but the wealth may come through hard work, delayed gratification, or older partners. The Argala is present; its quality is colored by the planet&apos;s nature.</>}
        </p>
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
          {tl({ en: 'Using Argala in Prediction', hi: 'भविष्यवाणी में अर्गला का प्रयोग', sa: 'भविष्यवाणी में अर्गला का प्रयोग' }, locale)}
        </h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          {isHi
            ? <>व्यावहारिक विधि सरल है: प्रत्येक भाव जिसका आप विश्लेषण करना चाहते हैं, देखें कि उससे दूसरे, चौथे, पाँचवें और ग्यारहवें में ग्रह हैं या नहीं। यदि हैं, तो उस भाव पर अर्गला है — वह &quot;समर्थित&quot; है और उसके फलादेश शक्तिशाली रूप से प्रकट होने की अधिक सम्भावना है। फिर देखें कि संगत विरोध स्थितियों (तीसरे, दसवें, नौवें और बारहवें) में ग्रह हैं या नहीं। यदि विरोध कमज़ोर है, तो अर्गला बनी रहती है। अनेक अबाधित अर्गलाओं वाले भाव कुण्डली में सर्वाधिक शक्तिशाली हैं — ये जीवन के वे क्षेत्र हैं जहाँ जातक को सर्वाधिक ठोस परिणाम मिलेंगे।</>
            : <>The practical method is straightforward: for each house you want to analyze, check if planets exist in the 2nd, 4th, 5th, and 11th from it. If they do, that house has Argala — it is &quot;supported&quot; and its significations are more likely to manifest strongly. Then check if planets exist in the corresponding Virodha positions (3rd, 10th, 9th, and 12th). If the Virodha is weaker, the Argala holds. Houses with multiple unobstructed Argalas are the strongest in the chart — they are the areas of life where the native will experience the most tangible results.</>}
        </p>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5 border border-emerald-500/15">
        <h4 className="text-emerald-400 text-xs uppercase tracking-widest font-bold mb-3">{tl({ en: 'Worked Example', hi: 'कार्यान्वित उदाहरण', sa: 'कार्यान्वित उदाहरण' }, locale)}</h4>
        <ExampleChart ascendant={1} planets={{ 1: [2], 4: [1], 9: [4], 10: [0] }} title={tl({ en: 'Example Chart', hi: 'उदाहरण कुण्डली', sa: 'उदाहरण कुण्डली' }, locale)} />
        <p className="text-text-secondary text-xs leading-relaxed mb-2">
          <span className="text-gold-light font-medium">Analyzing the 7th house (marriage):</span> Jupiter is in the 8th house (2nd from 7th = Dhana Argala). Venus is in the 10th house (4th from 7th = Sukha Argala). Moon is in the 5th house (11th from 7th = Labha Argala). The 7th house has three Argalas!
        </p>
        <p className="text-text-secondary text-xs leading-relaxed mb-2">
          <span className="text-gold-light font-medium">Checking Virodha:</span> 9th house (3rd from 7th) = empty. No Virodha for Jupiter&apos;s Argala. 4th house (10th from 7th) = Saturn. Saturn creates Virodha for Venus&apos;s Sukha Argala. Since Venus (benefic, alone) vs Saturn (malefic, alone) — one planet each, but Venus as benefic may be considered stronger. The Sukha Argala may partially hold. 6th house (12th from 7th) = empty. No Virodha for Moon&apos;s Argala.
        </p>
        <p className="text-text-secondary text-xs leading-relaxed">
          <span className="text-gold-light font-medium">Result:</span> The 7th house has strong, mostly unobstructed Argala. Marriage will bring wealth (Jupiter), some emotional comfort despite challenges (Venus vs Saturn), and fulfillment through social connections (Moon). This native&apos;s married life is a well-supported area of their chart.
        </p>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5 border border-blue-500/15">
        <h4 className="text-blue-300 text-xs uppercase tracking-widest font-bold mb-3">{tl({ en: 'Modern Relevance', hi: 'आधुनिक प्रासंगिकता', sa: 'आधुनिक प्रासंगिकता' }, locale)}</h4>
        <p className="text-text-secondary text-xs leading-relaxed mb-2">
          {isHi
            ? <>अर्गला विश्लेषण शीघ्रता से मूल्यांकन करने का मार्ग प्रदान करता है कि कौन-से जीवन क्षेत्र ग्रहीय सहायता से &quot;सुवित्तपोषित&quot; हैं। आधुनिक अभ्यास में ज्योतिषी परामर्श के दौरान प्राथमिकता निर्धारण के लिए अर्गला का प्रयोग करते हैं — शक्तिशाली अबाधित अर्गला वाले भाव वे क्षेत्र हैं जहाँ जातक को ऊर्जा लगानी चाहिए, जबकि अर्गला-रहित या विरोध द्वारा अवरुद्ध भावों को उपचारात्मक उपायों की आवश्यकता हो सकती है। सॉफ्टवेयर सभी 12 भावों की समस्त अर्गला और विरोध सम्बन्धों की तत्काल गणना कर सकता है।</>
            : <>Argala analysis provides a quick way to assess which life areas are &quot;well-funded&quot; by planetary support. In modern practice, astrologers use Argala to prioritize during consultation — houses with strong unobstructed Argala are areas where the native should invest energy, while houses lacking Argala or blocked by Virodha may need remedial measures. Software can instantly calculate all Argala and Virodha relationships across all 12 houses, generating an &quot;Argala map&quot; that reveals the chart&apos;s strongest and weakest sectors at a glance.</>}
        </p>
      </section>
    </div>
  );
}

export default function Module19_3Page() {
  return <ModuleContainer meta={META} pages={[<Page1 key="p1" />, <Page2 key="p2" />, <Page3 key="p3" />]} questions={QUESTIONS} />;
}
