'use client';

import { useState, useMemo, useEffect } from 'react';
import { useLocale } from 'next-intl';
import { motion } from 'framer-motion';
import GoldDivider from '@/components/ui/GoldDivider';
import { RashiIconById } from '@/components/icons/RashiIcons';
import { RASHIS } from '@/lib/constants/rashis';
import { dateToJD, sunLongitude, toSidereal, normalizeDeg, getRashiNumber, formatDegrees } from '@/lib/ephem/astronomical';
import { useBirthDataStore } from '@/stores/birth-data-store';
import { Link } from '@/lib/i18n/navigation';
import { Shield, Zap } from 'lucide-react';
import type { Locale, Trilingual } from '@/types/panchang';

// ─── Upagraha nature & sign-based interpretation data ────────────────────────

interface UpagrahaInfo {
  name: Trilingual;
  nature: 'malefic' | 'benefic' | 'mixed';
  ruler: Trilingual;
  significations: { en: string; hi: string };
  whenStrong: { en: string; hi: string };
  whenAfflicted: { en: string; hi: string };
  signEffects: Record<number, { en: string; hi: string }>; // 1-12
}

const UPAGRAHA_DATA: Record<string, UpagrahaInfo> = {
  dhuma: {
    name: { en: 'Dhuma', hi: 'धूम', sa: 'धूमः' },
    nature: 'malefic',
    ruler: { en: 'Sun (shadow)', hi: 'सूर्य (छाया)', sa: 'सूर्यः (छाया)' },
    significations: {
      en: 'Hidden dangers, smoke-like confusion, veiled obstacles, deceptive situations, and clouded judgment. Dhuma literally means "smoke" — it obscures clarity wherever it sits.',
      hi: 'छिपे खतरे, धुएँ जैसा भ्रम, आवरित बाधाएँ, भ्रामक स्थितियाँ और धुँधला निर्णय। धूम शाब्दिक अर्थ "धुआँ" है — यह जहाँ बैठता है वहाँ स्पष्टता को ढक देता है।',
    },
    whenStrong: {
      en: 'Ability to see through deception, detect hidden threats, and navigate uncertain situations. Strong Dhuma in upachaya houses (3, 6, 10, 11) can give street-smart intelligence.',
      hi: 'छल को पहचानने, छिपे खतरों का पता लगाने और अनिश्चित स्थितियों में मार्ग निकालने की क्षमता। उपचय भावों (3, 6, 10, 11) में बलवान धूम व्यावहारिक बुद्धि देता है।',
    },
    whenAfflicted: {
      en: 'Chronic confusion, being misled by others, hidden health issues (especially respiratory), scandals, and loss through deception. Struggles with clarity in the house it occupies.',
      hi: 'दीर्घकालिक भ्रम, दूसरों द्वारा गुमराह किया जाना, छिपी स्वास्थ्य समस्याएँ (विशेषतः श्वसन), कलंक और छल से हानि।',
    },
    signEffects: {
      1: { en: 'Smoky personality — others find you hard to read. Can mask true intentions well. Guard against self-deception.', hi: 'धुँधला व्यक्तित्व — दूसरे आपको समझ नहीं पाते। आत्म-भ्रम से सावधान रहें।' },
      2: { en: 'Hidden financial matters. Income sources may be unclear to others. Watch for deceptive deals in family business.', hi: 'छिपे वित्तीय मामले। आय स्रोत दूसरों को अस्पष्ट। पारिवारिक व्यवसाय में भ्रामक सौदों से सावधान।' },
      3: { en: 'Favorable — courage through cunning, ability to out-maneuver rivals. Siblings may have secretive nature.', hi: 'अनुकूल — चतुराई से साहस, प्रतिद्वंद्वियों को पछाड़ने की क्षमता। भाई-बहन गोपनीय स्वभाव के।' },
      4: { en: 'Domestic unrest, hidden issues in home life. Property matters can involve disputes or unclear titles.', hi: 'घरेलू अशांति, गृह जीवन में छिपी समस्याएँ। संपत्ति विवाद या अस्पष्ट स्वामित्व।' },
      5: { en: 'Clouded creative judgment. Children may cause hidden worry. Speculative investments carry extra risk.', hi: 'धुँधला सृजनात्मक निर्णय। संतान से छिपी चिंता। सट्टा निवेश में अतिरिक्त जोखिम।' },
      6: { en: 'Favorable — smoke blinds your enemies. Good at defeating hidden opponents. But watch for undiagnosed health issues.', hi: 'अनुकूल — शत्रुओं को भ्रमित करने में सक्षम। लेकिन अज्ञात स्वास्थ्य समस्याओं से सावधान।' },
      7: { en: 'Partner may be enigmatic or deceptive. Relationships involve misunderstandings. Contracts need extra scrutiny.', hi: 'साथी रहस्यमय या भ्रामक हो सकता है। संबंधों में गलतफहमी। अनुबंधों की अतिरिक्त जाँच आवश्यक।' },
      8: { en: 'Amplifies the 8th house mystery. Hidden transformations, occult abilities, but also concealed health problems.', hi: 'अष्टम भाव के रहस्य को बढ़ाता है। गुप्त परिवर्तन, तांत्रिक क्षमताएँ, लेकिन छिपी स्वास्थ्य समस्याएँ भी।' },
      9: { en: 'Guru or father figure may not be what they seem. Spiritual path involves cutting through illusion.', hi: 'गुरु या पिता तुल्य व्यक्ति जैसे दिखते हैं वैसे नहीं हो सकते। आध्यात्मिक मार्ग में माया भेदन।' },
      10: { en: 'Favorable — career involves behind-the-scenes work, intelligence, or investigation. Public image is mysterious.', hi: 'अनुकूल — करियर में पर्दे के पीछे कार्य, जासूसी या जाँच। सार्वजनिक छवि रहस्यमय।' },
      11: { en: 'Favorable — gains through unconventional or hidden channels. Network includes secretive contacts.', hi: 'अनुकूल — अपरंपरागत या छिपे माध्यमों से लाभ। मित्रमंडल में गोपनीय संपर्क।' },
      12: { en: 'Expenses from hidden causes. Sleep disturbed by worry. But good for spiritual practices involving detachment.', hi: 'छिपे कारणों से व्यय। चिंता से नींद में बाधा। लेकिन वैराग्य साधना के लिए अच्छा।' },
    },
  },
  vyatipata: {
    name: { en: 'Vyatipata', hi: 'व्यतीपात', sa: 'व्यतीपातः' },
    nature: 'malefic',
    ruler: { en: 'Rahu (shadow)', hi: 'राहु (छाया)', sa: 'राहुः (छाया)' },
    significations: {
      en: 'Calamity, sudden downfall, destruction, and inauspicious transformation. Vyatipata means "the great fall" — it marks points of karmic disruption and upheaval in the chart.',
      hi: 'विपत्ति, अचानक पतन, विनाश और अशुभ परिवर्तन। व्यतीपात का अर्थ "महान पतन" है — यह कुंडली में कार्मिक उथल-पुथल के बिंदुओं को चिह्नित करता है।',
    },
    whenStrong: {
      en: 'Remarkable ability to recover from crises. Like Rahu, it can give worldly success through unconventional means when well-placed in upachaya houses.',
      hi: 'संकटों से उबरने की उल्लेखनीय क्षमता। राहु की भाँति, उपचय भावों में अच्छी स्थिति में अपरंपरागत तरीकों से सांसारिक सफलता दे सकता है।',
    },
    whenAfflicted: {
      en: 'Sudden reversals of fortune, accidents, falls from grace, public humiliation. The house it occupies faces unexpected crises.',
      hi: 'भाग्य का अचानक पलटना, दुर्घटनाएँ, प्रतिष्ठा से पतन, सार्वजनिक अपमान। जिस भाव में बैठता है वहाँ अप्रत्याशित संकट।',
    },
    signEffects: {
      1: { en: 'Life marked by dramatic ups and downs. Personality undergoes sudden transformations. Accident-prone constitution.', hi: 'जीवन में नाटकीय उतार-चढ़ाव। व्यक्तित्व में अचानक परिवर्तन। दुर्घटना-प्रवण।' },
      2: { en: 'Sudden financial losses possible. Family faces unexpected crises. Speech can inadvertently cause trouble.', hi: 'अचानक आर्थिक हानि संभव। परिवार अप्रत्याशित संकट का सामना करता है।' },
      3: { en: 'Favorable in upachaya — gives courage born from crisis. Younger siblings face turbulence but overcome.', hi: 'उपचय में अनुकूल — संकट से जन्मा साहस। छोटे भाई-बहनों को उथल-पुथल लेकिन विजय।' },
      4: { en: 'Domestic instability, property disputes, sudden relocation. Mother\'s health may face crises.', hi: 'घरेलू अस्थिरता, संपत्ति विवाद, अचानक स्थानांतरण। माता के स्वास्थ्य में संकट।' },
      5: { en: 'Creative breakthroughs through crisis. Children face sudden events. Speculative losses possible.', hi: 'संकट से सृजनात्मक सफलता। संतान को अचानक घटनाएँ। सट्टा हानि संभव।' },
      6: { en: 'Favorable — enemies face sudden defeat. Diseases resolve dramatically. Legal victories through upheaval.', hi: 'अनुकूल — शत्रुओं का अचानक पतन। रोग नाटकीय रूप से ठीक। कानूनी विजय।' },
      7: { en: 'Partnerships face sudden changes. Marriage may begin or end abruptly. Business deals have dramatic turns.', hi: 'साझेदारी में अचानक परिवर्तन। विवाह अचानक आरंभ या समाप्त। व्यापारिक मोड़।' },
      8: { en: 'Intensifies 8th house volatility. Inheritance disputes, sudden health events, but also deep transformation.', hi: 'अष्टम भाव की अस्थिरता तीव्र। विरासत विवाद, अचानक स्वास्थ्य घटनाएँ, लेकिन गहन परिवर्तन भी।' },
      9: { en: 'Fortune comes and goes suddenly. Father figure faces crises. Spiritual path involves radical shifts.', hi: 'भाग्य अचानक आता-जाता है। पिता को संकट। आध्यात्मिक मार्ग में मूलभूत बदलाव।' },
      10: { en: 'Career marked by dramatic changes — sudden promotions or demotions. Public life is volatile.', hi: 'करियर में नाटकीय परिवर्तन — अचानक पदोन्नति या पदावनति। सार्वजनिक जीवन अस्थिर।' },
      11: { en: 'Favorable — gains through crises that others flee from. Elder siblings face upheaval.', hi: 'अनुकूल — दूसरों के भागने पर संकट से लाभ। बड़े भाई-बहनों को उथल-पुथल।' },
      12: { en: 'Sudden expenses, hospitalization risks. But also sudden spiritual awakening through loss.', hi: 'अचानक व्यय, अस्पताल का जोखिम। लेकिन हानि से अचानक आध्यात्मिक जागृति भी।' },
    },
  },
  parivesha: {
    name: { en: 'Parivesha', hi: 'परिवेश', sa: 'परिवेषः' },
    nature: 'benefic',
    ruler: { en: 'Sun (aura)', hi: 'सूर्य (प्रभा)', sa: 'सूर्यः (प्रभा)' },
    significations: {
      en: 'The halo around the Sun — fame, radiance, spiritual aura, divine protection, and magnetic influence. Parivesha elevates the significations of the house it occupies.',
      hi: 'सूर्य के चारों ओर का प्रभामंडल — यश, तेज, आध्यात्मिक आभा, दैवी सुरक्षा और चुंबकीय प्रभाव। परिवेश जिस भाव में बैठता है उसके फल को ऊँचा करता है।',
    },
    whenStrong: {
      en: 'Natural charisma, respected presence, spiritual authority. People are drawn to you without knowing why. Protective energy around the house significations.',
      hi: 'स्वाभाविक करिश्मा, सम्मानित उपस्थिति, आध्यात्मिक अधिकार। लोग बिना कारण जाने आपकी ओर आकर्षित होते हैं।',
    },
    whenAfflicted: {
      en: 'False prestige, being put on a pedestal then knocked down, hollow fame. The "halo" becomes an illusion that eventually shatters.',
      hi: 'झूठी प्रतिष्ठा, ऊँचे आसन पर बैठाकर गिराया जाना, खोखली प्रसिद्धि।',
    },
    signEffects: {
      1: { en: 'Radiant personality, natural authority. People trust and follow you instinctively. Strong spiritual aura.', hi: 'तेजस्वी व्यक्तित्व, स्वाभाविक अधिकार। लोग सहज ही विश्वास करते हैं। मजबूत आध्यात्मिक आभा।' },
      2: { en: 'Wealth comes with prestige. Family has respected standing. Speech carries weight and influence.', hi: 'धन प्रतिष्ठा के साथ आता है। परिवार का सम्मानित स्थान। वाणी में प्रभाव।' },
      3: { en: 'Creative expression earns admiration. Siblings benefit from your aura. Bold actions bring fame.', hi: 'सृजनात्मक अभिव्यक्ति प्रशंसा अर्जित करती है। साहसिक कार्य यश लाते हैं।' },
      4: { en: 'Beautiful home, respected in community. Mother has dignified nature. Property brings prestige.', hi: 'सुंदर गृह, समुदाय में सम्मान। माता गरिमापूर्ण स्वभाव की। संपत्ति प्रतिष्ठा लाती है।' },
      5: { en: 'Creative genius, children bring pride, romance has a destined quality. Speculation can be fortunate.', hi: 'सृजनात्मक प्रतिभा, संतान गर्व लाती है, प्रेम में नियति का गुण। अटकलें भाग्यशाली।' },
      6: { en: 'Diseases heal with grace. Enemies respect you even in opposition. Service work brings recognition.', hi: 'रोग सहजता से ठीक होते हैं। शत्रु विरोध में भी सम्मान करते हैं। सेवा कार्य मान्यता लाता है।' },
      7: { en: 'Attracts dignified partners. Marriage has a "blessed" quality. Business partnerships are respected.', hi: 'गरिमापूर्ण साथी आकर्षित करता है। विवाह में "आशीर्वाद" का गुण। व्यापार साझेदारी सम्मानित।' },
      8: { en: 'Protected through crises. Occult knowledge brings respect. Inheritance comes with honor.', hi: 'संकट में सुरक्षा। गूढ़ ज्ञान सम्मान लाता है। विरासत मान के साथ।' },
      9: { en: 'Exceptional fortune, respected guru figures, spiritual authority. Pilgrimages are transformative.', hi: 'असाधारण भाग्य, सम्मानित गुरु, आध्यात्मिक अधिकार। तीर्थयात्राएँ परिवर्तनकारी।' },
      10: { en: 'Excellent — career crowned with prestige. Public image is radiant. Authority comes naturally.', hi: 'उत्कृष्ट — करियर प्रतिष्ठा से मुकुटित। सार्वजनिक छवि तेजस्वी। अधिकार सहज।' },
      11: { en: 'Gains come with honor. Social circle includes influential people. Aspirations are fulfilled with grace.', hi: 'लाभ मान के साथ। मित्रमंडल में प्रभावशाली लोग। आकांक्षाएँ सहजता से पूर्ण।' },
      12: { en: 'Spiritual liberation has a luminous quality. Foreign lands bring recognition. Losses lead to wisdom.', hi: 'आध्यात्मिक मुक्ति में प्रकाश का गुण। विदेश मान्यता लाता है। हानि ज्ञान की ओर ले जाती है।' },
    },
  },
  chapa: {
    name: { en: 'Chapa (Indra Dhanus)', hi: 'चाप (इन्द्रधनुष)', sa: 'चापः (इन्द्रधनुः)' },
    nature: 'benefic',
    ruler: { en: 'Jupiter (grace)', hi: 'गुरु (कृपा)', sa: 'गुरुः (कृपा)' },
    significations: {
      en: 'The Rainbow — Indra\'s bow. Divine grace, protection in danger, auspicious turning points, and celestial blessings. Where Chapa sits, Providence intervenes.',
      hi: 'इन्द्रधनुष — इन्द्र का धनुष। दैवी कृपा, खतरे में सुरक्षा, शुभ मोड़ और दिव्य आशीर्वाद। जहाँ चाप बैठता है, वहाँ ईश्वरीय कृपा हस्तक्षेप करती है।',
    },
    whenStrong: {
      en: 'Miraculous escapes, timely divine help, blessed outcomes even from difficult situations. The rainbow after the storm.',
      hi: 'चमत्कारी बचाव, समय पर दैवी सहायता, कठिन स्थितियों से भी शुभ परिणाम। तूफान के बाद इन्द्रधनुष।',
    },
    whenAfflicted: {
      en: 'Over-reliance on luck, missed opportunities for grace, taking divine protection for granted.',
      hi: 'भाग्य पर अत्यधिक निर्भरता, कृपा के अवसर चूकना, दैवी सुरक्षा को हल्के में लेना।',
    },
    signEffects: {
      1: { en: 'Divinely protected personality. Near-misses in life that feel miraculous. Natural optimism and grace.', hi: 'दैवी सुरक्षित व्यक्तित्व। जीवन में चमत्कारी बचाव। स्वाभाविक आशावाद और कृपा।' },
      2: { en: 'Wealth protected by fortune. Family blessed with abundance. Speech has a healing quality.', hi: 'भाग्य से धन सुरक्षित। परिवार समृद्धि से आशीर्वादित। वाणी में उपचार का गुण।' },
      3: { en: 'Courageous actions blessed with success. Siblings are fortunate. Communication has divine timing.', hi: 'साहसिक कार्य सफलता से आशीर्वादित। भाई-बहन भाग्यशाली। संवाद में दैवी समय।' },
      4: { en: 'Home is a sanctuary. Mother is a source of grace. Property acquisition is blessed.', hi: 'घर एक आश्रय। माता कृपा का स्रोत। संपत्ति अधिग्रहण आशीर्वादित।' },
      5: { en: 'Children are blessings, romance has a fated quality. Creative works are divinely inspired.', hi: 'संतान आशीर्वाद, प्रेम में नियति। सृजनात्मक कार्य दिव्य प्रेरित।' },
      6: { en: 'Diseases heal by grace. Protection from enemies. Debts resolve favorably.', hi: 'रोग कृपा से ठीक। शत्रुओं से सुरक्षा। ऋण अनुकूल रूप से समाप्त।' },
      7: { en: 'Marriage blessed by divine grace. Partner is a source of good fortune. Harmonious alliances.', hi: 'विवाह दैवी कृपा से आशीर्वादित। साथी सौभाग्य का स्रोत। सामंजस्यपूर्ण गठबंधन।' },
      8: { en: 'Protected through transformations. Longevity is blessed. Occult studies bring grace, not danger.', hi: 'परिवर्तन में सुरक्षा। दीर्घायु आशीर्वादित। गूढ़ अध्ययन कृपा लाते हैं।' },
      9: { en: 'Exceptional — double blessing on fortune house. Guru brings divine knowledge. Pilgrimages are magical.', hi: 'असाधारण — भाग्य भाव पर दोहरा आशीर्वाद। गुरु दिव्य ज्ञान लाते हैं। तीर्थ चमत्कारी।' },
      10: { en: 'Career blessed with divine timing. Right opportunities appear at right moments. Public respect.', hi: 'करियर दैवी समय से आशीर्वादित। सही अवसर सही क्षण पर। सार्वजनिक सम्मान।' },
      11: { en: 'Gains arrive as blessings. Social circle is supportive and fortunate. Wishes manifest easily.', hi: 'लाभ आशीर्वाद के रूप में। मित्रमंडल सहायक और भाग्यशाली। इच्छाएँ सहज पूर्ण।' },
      12: { en: 'Spiritual liberation through grace. Foreign connections are blessed. Losses lead to higher gains.', hi: 'कृपा से आध्यात्मिक मुक्ति। विदेशी संपर्क आशीर्वादित। हानि उच्चतर लाभ की ओर।' },
    },
  },
  upaketu: {
    name: { en: 'Upaketu', hi: 'उपकेतु', sa: 'उपकेतुः' },
    nature: 'mixed',
    ruler: { en: 'Ketu (shadow)', hi: 'केतु (छाया)', sa: 'केतुः (छाया)' },
    significations: {
      en: 'The "sub-Ketu" — karmic echoes, sudden spiritual awakenings, past-life impressions surfacing, and events that feel destined. Like Ketu, it severs attachments in the house it occupies.',
      hi: '"उप-केतु" — कार्मिक प्रतिध्वनि, अचानक आध्यात्मिक जागृति, पूर्वजन्म के संस्कार उभरना, और नियति जैसी घटनाएँ। केतु की भाँति, जिस भाव में बैठता है वहाँ मोह तोड़ता है।',
    },
    whenStrong: {
      en: 'Deep spiritual insight, psychic sensitivity, ability to release attachments gracefully. Past-life talents become accessible.',
      hi: 'गहन आध्यात्मिक अंतर्दृष्टि, मानसिक संवेदनशीलता, सहजता से मोह त्यागने की क्षमता। पूर्वजन्म की प्रतिभाएँ सुलभ।',
    },
    whenAfflicted: {
      en: 'Sudden losses, disorientation, feeling detached against your will, karmic debts surfacing painfully.',
      hi: 'अचानक हानि, विचलन, इच्छा के विरुद्ध वैराग्य, कार्मिक ऋण दर्दनाक रूप से उभरना।',
    },
    signEffects: {
      1: { en: 'Otherworldly quality to personality. Past-life memories may surface. Spiritual seeker by nature.', hi: 'व्यक्तित्व में अलौकिक गुण। पूर्वजन्म की स्मृतियाँ उभर सकती हैं। स्वभाव से आध्यात्मिक खोजी।' },
      2: { en: 'Detachment from wealth, spiritual speech. Family has karmic patterns. Ancestral connections strong.', hi: 'धन से वैराग्य, आध्यात्मिक वाणी। परिवार में कार्मिक पैटर्न। पूर्वजों से गहरा संबंध।' },
      3: { en: 'Sudden courage from unknown source. Siblings share karmic bonds. Writing has mystical quality.', hi: 'अज्ञात स्रोत से अचानक साहस। भाई-बहनों के साथ कार्मिक बंधन। लेखन में रहस्यमय गुण।' },
      4: { en: 'Home may change suddenly. Mother has spiritual inclinations. Property matters have karmic dimensions.', hi: 'घर अचानक बदल सकता है। माता आध्यात्मिक प्रवृत्ति की। संपत्ति में कार्मिक आयाम।' },
      5: { en: 'Children have old-soul quality. Past-life creative talents emerge. Romance feels destined.', hi: 'संतान में पुरानी आत्मा का गुण। पूर्वजन्म की सृजनात्मक प्रतिभा उभरती है। प्रेम नियति जैसा।' },
      6: { en: 'Karmic debts resolved through service. Health issues with mysterious origins. Enemies from past lives.', hi: 'सेवा से कार्मिक ऋण समाप्त। रहस्यमय मूल की स्वास्थ्य समस्याएँ। पूर्वजन्म के शत्रु।' },
      7: { en: 'Partner from past life. Marriage has karmic purpose. Sudden separations or destined meetings.', hi: 'पूर्वजन्म का साथी। विवाह का कार्मिक उद्देश्य। अचानक वियोग या नियत मिलन।' },
      8: { en: 'Deep occult abilities, past-life regression potential. Transformation through spiritual crisis.', hi: 'गहरी तांत्रिक क्षमताएँ, पूर्वजन्म प्रत्यागमन की संभावना। आध्यात्मिक संकट से परिवर्तन।' },
      9: { en: 'Guru appears from karmic connection. Pilgrimage to past-life locations. Sudden dharmic awakening.', hi: 'कार्मिक संबंध से गुरु प्रकट। पूर्वजन्म स्थलों की तीर्थयात्रा। अचानक धार्मिक जागृति।' },
      10: { en: 'Career path feels destined. Sudden changes in profession aligned with soul purpose.', hi: 'करियर पथ नियति जैसा। आत्मा के उद्देश्य के अनुरूप पेशे में अचानक परिवर्तन।' },
      11: { en: 'Gains from past-life merit. Friends share karmic bonds. Aspirations have spiritual dimension.', hi: 'पूर्वजन्म के पुण्य से लाभ। मित्रों के साथ कार्मिक बंधन। आकांक्षाओं में आध्यात्मिक आयाम।' },
      12: { en: 'Excellent for moksha. Past-life karma resolves through withdrawal. Dreams are prophetic.', hi: 'मोक्ष के लिए उत्कृष्ट। वैराग्य से पूर्वजन्म का कर्म समाप्त। स्वप्न भविष्यसूचक।' },
    },
  },
};

const UPAGRAHA_KEYS = ['dhuma', 'vyatipata', 'parivesha', 'chapa', 'upaketu'] as const;

// House-level effects for personalized reading (from Moon sign)
const HOUSE_UPAGRAHA_EFFECT: Record<string, Record<number, { en: string; hi: string }>> = {
  dhuma: {
    1: { en: 'Dhuma in your 1st house clouds your self-perception today. You may feel foggy or unsure of yourself. Avoid important presentations.', hi: 'आपके प्रथम भाव में धूम — आत्म-धारणा धुँधली। महत्वपूर्ण प्रस्तुतियों से बचें।' },
    2: { en: 'Dhuma transits your 2nd house — finances may be unclear. Double-check bank statements and avoid lending money today.', hi: 'धूम द्वितीय भाव में — वित्त अस्पष्ट। बैंक विवरण दोबारा जाँचें, आज उधार देने से बचें।' },
    3: { en: 'Dhuma in your 3rd house — favorable! You can use smoke-and-mirrors tactics to outmaneuver competitors.', hi: 'तृतीय भाव में — अनुकूल! प्रतिस्पर्धियों को पछाड़ने के लिए चतुराई का प्रयोग करें।' },
    4: { en: 'Dhuma clouds your 4th house — domestic peace is disturbed. Hidden plumbing or electrical issues may surface at home.', hi: 'चतुर्थ भाव में — घरेलू शांति बाधित। घर में छिपी समस्याएँ सतह पर आ सकती हैं।' },
    5: { en: 'Dhuma obscures your 5th house — creative blocks likely. Children may be hiding something. Avoid speculative investments.', hi: 'पंचम भाव में — सृजनात्मक अवरोध। संतान कुछ छिपा सकती है। सट्टा निवेश से बचें।' },
    6: { en: 'Dhuma in your 6th house — favorable! Enemies are confused and cannot see you clearly. Good for competitive exams.', hi: 'षष्ठ भाव में — अनुकूल! शत्रु भ्रमित। प्रतियोगी परीक्षाओं के लिए अच्छा।' },
    7: { en: 'Dhuma in your 7th house — miscommunication with partner likely. Contracts may have hidden clauses. Read the fine print.', hi: 'सप्तम भाव में — साथी से गलतफहमी। अनुबंधों में छिपी शर्तें हो सकती हैं।' },
    8: { en: 'Dhuma deepens 8th house mystery — hidden matters become even more opaque. Not a good day for investigating secrets.', hi: 'अष्टम भाव में — रहस्य और गहरे। गुप्त मामलों की जाँच के लिए अच्छा दिन नहीं।' },
    9: { en: 'Dhuma clouds your 9th house of fortune — luck feels elusive today. Travel plans may go awry. Guru\'s advice unclear.', hi: 'नवम भाव में — भाग्य अस्पष्ट। यात्रा योजनाएँ बिगड़ सकती हैं। गुरु की सलाह अस्पष्ट।' },
    10: { en: 'Dhuma in your 10th house — favorable for behind-the-scenes career work, investigation, research. Avoid public spotlight.', hi: 'दशम भाव में — पर्दे के पीछे के करियर कार्य के लिए अनुकूल। सार्वजनिक प्रकाश से बचें।' },
    11: { en: 'Dhuma in your 11th house — gains may come from unexpected or unclear sources. Network contacts may be unreliable.', hi: 'एकादश भाव में — अप्रत्याशित स्रोतों से लाभ। मित्रमंडल के संपर्क अविश्वसनीय हो सकते हैं।' },
    12: { en: 'Dhuma in your 12th house — sleep disturbed, hidden expenses surface. But good for meditation and spiritual withdrawal.', hi: 'द्वादश भाव में — नींद बाधित, छिपे व्यय। लेकिन ध्यान और आध्यात्मिक एकान्त के लिए अच्छा।' },
  },
  vyatipata: {
    1: { en: 'Vyatipata in your 1st house — sudden health disruption or identity crisis possible. Take extra care today.', hi: 'प्रथम भाव में — अचानक स्वास्थ्य बाधा या पहचान संकट। आज विशेष सावधानी रखें।' },
    2: { en: 'Vyatipata transits your 2nd house — watch for sudden financial losses or family disputes erupting unexpectedly.', hi: 'द्वितीय भाव में — अचानक आर्थिक हानि या पारिवारिक विवाद से सावधान।' },
    3: { en: 'Vyatipata in your 3rd house — favorable! Courage born from crisis. Bold moves succeed when others hesitate.', hi: 'तृतीय भाव में — अनुकूल! संकट से जन्मा साहस। जहाँ दूसरे हिचकिचाते हैं, साहसिक कदम सफल।' },
    4: { en: 'Vyatipata disturbs your 4th house — domestic upheaval, arguments at home, or sudden appliance breakdowns.', hi: 'चतुर्थ भाव में — घरेलू उथल-पुथल, घर पर बहस, या उपकरणों की अचानक खराबी।' },
    5: { en: 'Vyatipata in your 5th house — creative breakthroughs through disruption. Children may surprise you. Avoid gambling.', hi: 'पंचम भाव में — बाधा से सृजनात्मक सफलता। संतान आश्चर्यचकित कर सकती है। जुआ से बचें।' },
    6: { en: 'Vyatipata in your 6th house — excellent! Enemies suffer sudden defeat. Health issues resolve dramatically.', hi: 'षष्ठ भाव में — उत्कृष्ट! शत्रुओं का अचानक पतन। स्वास्थ्य समस्याएँ नाटकीय रूप से ठीक।' },
    7: { en: 'Vyatipata in your 7th house — partnerships face sudden strain. Arguments with spouse likely. Avoid signing agreements.', hi: 'सप्तम भाव में — साझेदारी पर अचानक तनाव। जीवनसाथी से बहस। समझौतों पर हस्ताक्षर से बचें।' },
    8: { en: 'Vyatipata intensifies 8th house volatility — be careful with joint finances, insurance matters, and physical safety.', hi: 'अष्टम भाव में — संयुक्त वित्त, बीमा और शारीरिक सुरक्षा में सावधानी।' },
    9: { en: 'Vyatipata in your 9th house — travel disruptions, unexpected changes in fortune. Father may face challenges.', hi: 'नवम भाव में — यात्रा बाधित, भाग्य में अप्रत्याशित बदलाव। पिता को चुनौतियाँ।' },
    10: { en: 'Vyatipata in your 10th house — career upheaval possible. Could be a sudden promotion OR a sudden setback. Stay alert.', hi: 'दशम भाव में — करियर में उथल-पुथल। अचानक पदोन्नति या पदावनति। सतर्क रहें।' },
    11: { en: 'Vyatipata in your 11th house — favorable! Gains through crises others flee from. Social circle reshuffles.', hi: 'एकादश भाव में — अनुकूल! दूसरों के भागने पर संकट से लाभ। मित्रमंडल में बदलाव।' },
    12: { en: 'Vyatipata in your 12th house — sudden expenses or hospitalization risk. But can trigger spiritual awakening.', hi: 'द्वादश भाव में — अचानक व्यय या अस्पताल। लेकिन आध्यात्मिक जागृति का कारण बन सकता है।' },
  },
  parivesha: {
    1: { en: 'Parivesha blesses your 1st house — you radiate authority and charisma today. People trust you instinctively.', hi: 'प्रथम भाव में — आज आप अधिकार और करिश्मा विकीर्ण करते हैं। लोग सहज ही विश्वास करते हैं।' },
    2: { en: 'Parivesha in your 2nd house — speech carries weight, financial matters go smoothly, family harmony is enhanced.', hi: 'द्वितीय भाव में — वाणी में प्रभाव, वित्तीय मामले सुचारू, पारिवारिक सद्भाव बढ़ा।' },
    3: { en: 'Parivesha in your 3rd house — creative expression earns admiration. Bold communications are well-received.', hi: 'तृतीय भाव में — सृजनात्मक अभिव्यक्ति प्रशंसा अर्जित। साहसिक संवाद अच्छे से प्राप्त।' },
    4: { en: 'Parivesha graces your 4th house — home feels like a sanctuary. Good day for property matters or family gatherings.', hi: 'चतुर्थ भाव में — घर आश्रय जैसा। संपत्ति या पारिवारिक सभा के लिए अच्छा दिन।' },
    5: { en: 'Parivesha in your 5th house — creative genius flows freely. Romance has a blessed quality. Children bring joy.', hi: 'पंचम भाव में — सृजनात्मक प्रतिभा मुक्त। प्रेम आशीर्वादित। संतान आनंद लाती है।' },
    6: { en: 'Parivesha in your 6th house — diseases heal gracefully, enemies respect you. Service work brings recognition.', hi: 'षष्ठ भाव में — रोग सहजता से ठीक, शत्रु सम्मान करते हैं। सेवा कार्य मान्यता लाता है।' },
    7: { en: 'Parivesha blesses your 7th house — excellent for partnerships, negotiations, and marriage. Harmonious energy.', hi: 'सप्तम भाव में — साझेदारी, वार्ता और विवाह के लिए उत्कृष्ट। सामंजस्यपूर्ण ऊर्जा।' },
    8: { en: 'Parivesha protects your 8th house — you are shielded through transformations. Good for occult study.', hi: 'अष्टम भाव में — परिवर्तन में सुरक्षा। गूढ़ अध्ययन के लिए अच्छा।' },
    9: { en: 'Parivesha in your 9th house — exceptional fortune today! Guru guidance is luminous. Pilgrimage is blessed.', hi: 'नवम भाव में — आज असाधारण भाग्य! गुरु मार्गदर्शन प्रकाशमान। तीर्थ आशीर्वादित।' },
    10: { en: 'Parivesha crowns your 10th house — career prestige peaks. Public image is radiant. Authority comes naturally.', hi: 'दशम भाव में — करियर प्रतिष्ठा शिखर पर। सार्वजनिक छवि तेजस्वी।' },
    11: { en: 'Parivesha in your 11th house — gains come with honor. Influential people support you. Wishes are fulfilled.', hi: 'एकादश भाव में — लाभ मान के साथ। प्रभावशाली लोग सहायता करते हैं। इच्छाएँ पूर्ण।' },
    12: { en: 'Parivesha in your 12th house — spiritual liberation has a luminous quality. Foreign connections bring honor.', hi: 'द्वादश भाव में — आध्यात्मिक मुक्ति में प्रकाश। विदेशी संपर्क मान लाते हैं।' },
  },
  chapa: {
    1: { en: 'Chapa blesses your 1st house — you are divinely protected today. Near-misses turn into fortunate outcomes.', hi: 'प्रथम भाव में — आज आप दैवी सुरक्षित। संकट सौभाग्य में बदलते हैं।' },
    2: { en: 'Chapa graces your 2nd house — wealth is protected by fortune. Good day for financial decisions.', hi: 'द्वितीय भाव में — धन भाग्य से सुरक्षित। वित्तीय निर्णयों के लिए अच्छा दिन।' },
    3: { en: 'Chapa in your 3rd house — courageous actions are blessed with success. Bold communications land perfectly.', hi: 'तृतीय भाव में — साहसिक कार्य सफलता से आशीर्वादित। साहसिक संवाद सटीक।' },
    4: { en: 'Chapa protects your 4th house — home is a sanctuary. Property matters resolve favorably. Mother is blessed.', hi: 'चतुर्थ भाव में — घर आश्रय। संपत्ति मामले अनुकूल। माता आशीर्वादित।' },
    5: { en: 'Chapa in your 5th house — children are blessings today. Creative inspiration is divinely guided. Romance is magical.', hi: 'पंचम भाव में — संतान आशीर्वाद। सृजनात्मक प्रेरणा दिव्य मार्गदर्शित। प्रेम जादुई।' },
    6: { en: 'Chapa in your 6th house — diseases heal by grace. Protection from enemies. Debts resolve unexpectedly.', hi: 'षष्ठ भाव में — रोग कृपा से ठीक। शत्रुओं से सुरक्षा। ऋण अप्रत्याशित रूप से समाप्त।' },
    7: { en: 'Chapa blesses your 7th house — partnerships are divinely guided. Marriage proposals are fortunate. Sign contracts.', hi: 'सप्तम भाव में — साझेदारी दिव्य मार्गदर्शित। विवाह प्रस्ताव भाग्यशाली। अनुबंध करें।' },
    8: { en: 'Chapa protects your 8th house — you are safe through transformations. Inheritance arrives. Occult study is blessed.', hi: 'अष्टम भाव में — परिवर्तन में सुरक्षा। विरासत प्राप्त। गूढ़ अध्ययन आशीर्वादित।' },
    9: { en: 'Chapa in your 9th house — double blessing! Fortune smiles broadly. Guru brings divine wisdom. Travel is magical.', hi: 'नवम भाव में — दोहरा आशीर्वाद! भाग्य मुस्कुराता है। गुरु दिव्य ज्ञान लाते हैं।' },
    10: { en: 'Chapa in your 10th house — career opportunities appear at the perfect moment. Public recognition arrives gracefully.', hi: 'दशम भाव में — करियर अवसर सही क्षण पर। सार्वजनिक मान्यता सहजता से।' },
    11: { en: 'Chapa in your 11th house — wishes manifest easily. Social connections are supportive. Gains arrive as blessings.', hi: 'एकादश भाव में — इच्छाएँ सहज पूर्ण। सामाजिक संपर्क सहायक। लाभ आशीर्वाद के रूप में।' },
    12: { en: 'Chapa in your 12th house — spiritual practices are blessed. Foreign connections prosper. Losses lead to higher gains.', hi: 'द्वादश भाव में — आध्यात्मिक अभ्यास आशीर्वादित। विदेशी संपर्क समृद्ध। हानि उच्चतर लाभ की ओर।' },
  },
  upaketu: {
    1: { en: 'Upaketu in your 1st house — past-life impressions surface. You may feel otherworldly or detached. Good for meditation.', hi: 'प्रथम भाव में — पूर्वजन्म के संस्कार उभरते हैं। अलौकिक या वैरागी अनुभव। ध्यान के लिए अच्छा।' },
    2: { en: 'Upaketu in your 2nd house — karmic patterns in family finances surface. Ancestral connections feel strong.', hi: 'द्वितीय भाव में — पारिवारिक वित्त में कार्मिक पैटर्न। पूर्वजों से गहरा संबंध।' },
    3: { en: 'Upaketu in your 3rd house — sudden courage from an unknown source. Writings have a mystical quality today.', hi: 'तृतीय भाव में — अज्ञात स्रोत से अचानक साहस। आज लेखन में रहस्यमय गुण।' },
    4: { en: 'Upaketu in your 4th house — home feels different, almost otherworldly. Mother may share spiritual insights.', hi: 'चतुर्थ भाव में — घर अलग, लगभग अलौकिक लगता है। माता आध्यात्मिक अंतर्दृष्टि साझा कर सकती हैं।' },
    5: { en: 'Upaketu in your 5th house — past-life creative talents emerge. Romance feels destined. Children show old-soul wisdom.', hi: 'पंचम भाव में — पूर्वजन्म की सृजनात्मक प्रतिभा उभरती है। प्रेम नियति जैसा।' },
    6: { en: 'Upaketu in your 6th house — karmic debts can be resolved through service today. Health issues may have past-life roots.', hi: 'षष्ठ भाव में — आज सेवा से कार्मिक ऋण समाप्त हो सकते हैं। स्वास्थ्य समस्याओं की पूर्वजन्म जड़ें।' },
    7: { en: 'Upaketu in your 7th house — partner from a past life may appear. Existing relationship feels karmically charged.', hi: 'सप्तम भाव में — पूर्वजन्म का साथी प्रकट हो सकता है। मौजूदा संबंध कार्मिक रूप से आवेशित।' },
    8: { en: 'Upaketu in your 8th house — deep occult abilities activate. Past-life regression meditation is powerful today.', hi: 'अष्टम भाव में — गहन तांत्रिक क्षमताएँ सक्रिय। पूर्वजन्म ध्यान आज शक्तिशाली।' },
    9: { en: 'Upaketu in your 9th house — a guru from a karmic connection may appear. Sudden dharmic awakening possible.', hi: 'नवम भाव में — कार्मिक संबंध से गुरु प्रकट हो सकते हैं। अचानक धार्मिक जागृति संभव।' },
    10: { en: 'Upaketu in your 10th house — career feels destined today. Sudden changes align with your soul purpose.', hi: 'दशम भाव में — आज करियर नियति जैसा। अचानक बदलाव आत्मा के उद्देश्य के अनुरूप।' },
    11: { en: 'Upaketu in your 11th house — gains from past-life merit arrive. Friends share deep karmic bonds.', hi: 'एकादश भाव में — पूर्वजन्म के पुण्य से लाभ। मित्रों के साथ गहरे कार्मिक बंधन।' },
    12: { en: 'Upaketu in your 12th house — excellent for moksha. Dreams are prophetic. Past-life karma resolves through surrender.', hi: 'द्वादश भाव में — मोक्ष के लिए उत्कृष्ट। स्वप्न भविष्यसूचक। समर्पण से पूर्वजन्म कर्म समाप्त।' },
  },
};

function getHouseFromMoon(moonSign: number, transitSign: number): number {
  return ((transitSign - moonSign + 12) % 12) + 1;
}

// ─── Computation ─────────────────────────────────────────────────────────────

interface UpagrahaResult {
  key: string;
  info: UpagrahaInfo;
  longitude: number;
  sign: number;
  signName: Trilingual;
  degree: string;
}

function computeUpagrahas(jd: number): UpagrahaResult[] {
  const sunTrop = sunLongitude(jd);
  const sunSid = toSidereal(sunTrop, jd);

  const dhumaLong = normalizeDeg(sunSid + 133 + 20/60);
  const vyatipataLong = normalizeDeg(360 - dhumaLong);
  const pariveshaLong = normalizeDeg(vyatipataLong + 180);
  const chapaLong = normalizeDeg(360 - pariveshaLong);
  const upaketuLong = normalizeDeg(chapaLong + 16 + 40/60);

  const longs = [dhumaLong, vyatipataLong, pariveshaLong, chapaLong, upaketuLong];

  return UPAGRAHA_KEYS.map((key, i) => {
    const lng = longs[i];
    const sign = getRashiNumber(lng);
    return {
      key,
      info: UPAGRAHA_DATA[key],
      longitude: lng,
      sign,
      signName: RASHIS[sign - 1].name,
      degree: formatDegrees(lng % 30),
    };
  });
}

// ─── Page ────────────────────────────────────────────────────────────────────

export default function UpagrahaPage() {
  const locale = useLocale() as Locale;
  const isDevanagari = locale !== 'en';
  const headingFont = isDevanagari ? { fontFamily: 'var(--font-devanagari-heading)' } : { fontFamily: 'var(--font-heading)' };
  const bodyFont = isDevanagari ? { fontFamily: 'var(--font-devanagari-body)' } : undefined;

  const t2 = (obj: { en: string; hi: string }): string => locale === 'en' ? obj.en : obj.hi;

  const [dateStr, setDateStr] = useState(new Date().toISOString().split('T')[0]);
  const [expanded, setExpanded] = useState<string | null>(null);
  const { birthRashi, isSet: hasBirthData } = useBirthDataStore();

  useEffect(() => { useBirthDataStore.getState().loadFromStorage(); }, []);

  const upagrahas = useMemo(() => {
    const [y, m, d] = dateStr.split('-').map(Number);
    const tzOffset = -(new Date().getTimezoneOffset() / 60);
    const jd = dateToJD(y, m, d, 12 - tzOffset);
    return computeUpagrahas(jd);
  }, [dateStr]);

  const natureColor = (n: string) => n === 'malefic' ? 'text-red-400' : n === 'benefic' ? 'text-emerald-400' : 'text-amber-400';
  const natureBg = (n: string) => n === 'malefic' ? 'bg-red-500/15 border-red-500/25 text-red-300' : n === 'benefic' ? 'bg-emerald-500/15 border-emerald-500/25 text-emerald-300' : 'bg-amber-500/15 border-amber-500/25 text-amber-300';
  const natureLabel = (n: string) => n === 'malefic' ? (locale === 'en' ? 'Malefic' : 'पापी') : n === 'benefic' ? (locale === 'en' ? 'Benefic' : 'शुभ') : (locale === 'en' ? 'Mixed' : 'मिश्र');

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

      {/* Hero */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
        <h1 className="text-5xl sm:text-6xl font-bold mb-4" style={headingFont}>
          <span className="text-gold-gradient">{locale === 'en' ? 'Upagraha' : 'उपग्रह'}</span>
        </h1>
        <p className="text-2xl text-gold-dark mb-4" style={headingFont}>
          {locale !== 'en' && 'Upagraha'}
        </p>
        <p className="text-text-secondary text-lg max-w-2xl mx-auto leading-relaxed" style={bodyFont}>
          {locale === 'en'
            ? 'The five shadow sub-planets derived from the Sun\'s sidereal longitude. Unlike the nine Grahas, Upagrahas have no physical body — they are mathematically computed sensitive points that reveal hidden karmic influences in the chart.'
            : 'सूर्य की सायन देशांतर से व्युत्पन्न पाँच छाया उपग्रह। नवग्रहों के विपरीत, उपग्रहों का कोई भौतिक शरीर नहीं है — ये गणितीय रूप से गणना किए गए संवेदनशील बिंदु हैं जो कुंडली में छिपे कार्मिक प्रभावों को प्रकट करते हैं।'}
        </p>
      </motion.div>

      {/* Context box */}
      <div className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-2xl p-6 mb-10">
        <h3 className="text-gold-light font-bold text-sm mb-3" style={headingFont}>
          {locale === 'en' ? 'Why Upagrahas Matter' : 'उपग्रह क्यों महत्वपूर्ण हैं'}
        </h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-4" style={bodyFont}>
          {locale === 'en'
            ? 'Classical texts like Surya Siddhanta and Brihat Parashara Hora Shastra describe Upagrahas as supplementary points that fine-tune chart analysis. They act as "sub-influences" — Dhuma and Vyatipata bring hidden challenges, while Parivesha and Chapa bring grace and protection. Upaketu bridges the material and spiritual. When an Upagraha conjuncts a natal planet or falls in a sensitive house, it amplifies or modifies that area of life in subtle but significant ways.'
            : 'सूर्य सिद्धांत और बृहत् पाराशर होरा शास्त्र जैसे शास्त्रीय ग्रंथ उपग्रहों को पूरक बिंदुओं के रूप में वर्णित करते हैं जो कुंडली विश्लेषण को सूक्ष्मतर बनाते हैं। ये "उप-प्रभाव" के रूप में कार्य करते हैं — धूम और व्यतीपात छिपी चुनौतियाँ लाते हैं, जबकि परिवेश और चाप कृपा और सुरक्षा लाते हैं। उपकेतु भौतिक और आध्यात्मिक को जोड़ता है।'}
        </p>
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: locale === 'en' ? 'Malefic' : 'पापी', names: 'Dhuma, Vyatipata', color: 'border-red-500/20 bg-red-500/5', dot: 'bg-red-400' },
            { label: locale === 'en' ? 'Benefic' : 'शुभ', names: 'Parivesha, Chapa', color: 'border-emerald-500/20 bg-emerald-500/5', dot: 'bg-emerald-400' },
            { label: locale === 'en' ? 'Mixed' : 'मिश्र', names: 'Upaketu', color: 'border-amber-500/20 bg-amber-500/5', dot: 'bg-amber-400' },
          ].map(c => (
            <div key={c.label} className={`rounded-lg p-3 border ${c.color} text-center`}>
              <div className="flex items-center justify-center gap-1.5 mb-1">
                <span className={`w-2 h-2 rounded-full ${c.dot}`} />
                <span className="text-text-primary text-xs font-bold">{c.label}</span>
              </div>
              <span className="text-text-secondary/75 text-xs">{c.names}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Personalized Synthesis */}
      {hasBirthData ? (() => {
        const moonName = RASHIS[birthRashi - 1]?.name;
        // Compute house positions for all upagrahas
        const housePlacements = upagrahas.map(u => ({
          key: u.key,
          name: u.info.name,
          nature: u.info.nature,
          house: getHouseFromMoon(birthRashi, u.sign),
          signName: u.signName,
        }));

        // Identify sensitive houses (1, 4, 7, 10 = kendras; 1, 5, 9 = trines)
        const kendraHits = housePlacements.filter(h => [1, 4, 7, 10].includes(h.house));
        const maleficsInKendras = kendraHits.filter(h => h.nature === 'malefic');
        const beneficsInKendras = kendraHits.filter(h => h.nature === 'benefic');
        const upachayaHits = housePlacements.filter(h => [3, 6, 10, 11].includes(h.house));
        const maleficsInUpachaya = upachayaHits.filter(h => h.nature === 'malefic');
        const trikHits = housePlacements.filter(h => [6, 8, 12].includes(h.house));

        // Overall tone
        const beneficScore = housePlacements.reduce((acc, h) => {
          if (h.nature === 'benefic') {
            if ([1, 4, 5, 7, 9, 10].includes(h.house)) return acc + 2;
            return acc + 1;
          }
          if (h.nature === 'malefic') {
            if ([3, 6, 11].includes(h.house)) return acc + 1; // malefics do well here
            if ([1, 4, 5, 7, 9, 10].includes(h.house)) return acc - 2;
            return acc - 1;
          }
          return acc;
        }, 0);

        const tone = beneficScore >= 3 ? 'positive' : beneficScore <= -3 ? 'challenging' : 'mixed';
        const toneColor = tone === 'positive' ? 'emerald' : tone === 'challenging' ? 'red' : 'amber';
        const toneIcon = tone === 'positive' ? '☀' : tone === 'challenging' ? '⚡' : '◐';

        // Build narrative
        const buildSynthesis = (): { en: string; hi: string } => {
          const parts_en: string[] = [];
          const parts_hi: string[] = [];

          if (tone === 'positive') {
            parts_en.push('Today\'s Upagraha configuration is largely favorable for you.');
            parts_hi.push('आज का उपग्रह विन्यास आपके लिए अधिकतर अनुकूल है।');
          } else if (tone === 'challenging') {
            parts_en.push('Today\'s Upagraha configuration brings some challenges — awareness is your best shield.');
            parts_hi.push('आज का उपग्रह विन्यास कुछ चुनौतियाँ लाता है — जागरूकता आपका सबसे अच्छा कवच है।');
          } else {
            parts_en.push('Today\'s Upagraha picture is mixed — some areas are protected while others need caution.');
            parts_hi.push('आज का उपग्रह चित्र मिश्रित है — कुछ क्षेत्र सुरक्षित हैं, कुछ में सावधानी चाहिए।');
          }

          if (beneficsInKendras.length > 0) {
            const names = beneficsInKendras.map(h => h.name.en).join(' and ');
            const houses = beneficsInKendras.map(h => `${h.house}${['st','nd','rd'][h.house-1]||'th'}`).join(', ');
            parts_en.push(`${names} ${beneficsInKendras.length > 1 ? 'bless' : 'blesses'} your angular house${beneficsInKendras.length > 1 ? 's' : ''} (${houses}) — bringing grace and protection to core life areas.`);
            const namesHi = beneficsInKendras.map(h => h.name.hi).join(' और ');
            parts_hi.push(`${namesHi} आपके केन्द्र भाव (${beneficsInKendras.map(h => h.house).join(', ')}) को आशीर्वादित ${beneficsInKendras.length > 1 ? 'करते हैं' : 'करता है'} — जीवन के मूल क्षेत्रों में कृपा और सुरक्षा।`);
          }

          if (maleficsInKendras.length > 0) {
            const names = maleficsInKendras.map(h => h.name.en).join(' and ');
            const houses = maleficsInKendras.map(h => `${h.house}${['st','nd','rd'][h.house-1]||'th'}`).join(', ');
            parts_en.push(`${names} ${maleficsInKendras.length > 1 ? 'sit' : 'sits'} in your kendra (${houses}) — be vigilant about ${maleficsInKendras.some(h => h.house === 1) ? 'health' : ''}${maleficsInKendras.some(h => h.house === 4) ? 'home matters' : ''}${maleficsInKendras.some(h => h.house === 7) ? 'partnerships' : ''}${maleficsInKendras.some(h => h.house === 10) ? 'career' : ''}.`);
            const namesHi = maleficsInKendras.map(h => h.name.hi).join(' और ');
            parts_hi.push(`${namesHi} आपके केन्द्र (${maleficsInKendras.map(h => h.house).join(', ')}) में — सतर्कता आवश्यक।`);
          }

          if (maleficsInUpachaya.length > 0 && maleficsInKendras.length === 0) {
            parts_en.push(`Malefic Upagrahas are in upachaya houses (growth houses) — their negativity is converted into drive and competitive edge.`);
            parts_hi.push(`पापी उपग्रह उपचय भावों (विकास भाव) में — उनकी नकारात्मकता ऊर्जा और प्रतिस्पर्धात्मक लाभ में बदलती है।`);
          }

          if (trikHits.filter(h => h.nature === 'benefic').length > 0) {
            parts_en.push(`Benefic Upagrahas in trik houses (6/8/12) may feel somewhat muted — their protective energy is channeled into healing and spiritual work rather than material gains.`);
            parts_hi.push(`त्रिक भावों (6/8/12) में शुभ उपग्रह — उनकी सुरक्षात्मक ऊर्जा भौतिक लाभ के बजाय उपचार और आध्यात्मिक कार्य में लगती है।`);
          }

          return { en: parts_en.join(' '), hi: parts_hi.join(' ') };
        };

        const synthesis = buildSynthesis();

        return (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className={`rounded-2xl p-6 border-2 mb-8 bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] ${
              toneColor === 'emerald' ? 'border-emerald-500/30' : toneColor === 'red' ? 'border-red-500/30' : 'border-amber-500/30'
            }`}
          >
            {/* Header */}
            <div className="flex items-center gap-3 mb-4">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg ${
                toneColor === 'emerald' ? 'bg-emerald-500/15' : toneColor === 'red' ? 'bg-red-500/15' : 'bg-amber-500/15'
              }`}>
                {toneIcon}
              </div>
              <div>
                <h3 className="text-gold-light font-bold text-lg" style={headingFont}>
                  {locale === 'en' ? 'Your Upagraha Snapshot' : 'आपका उपग्रह सारांश'}
                </h3>
                <div className="flex items-center gap-2 text-xs text-text-secondary">
                  <Shield className="w-3 h-3 text-emerald-400" />
                  <span>{locale === 'en' ? `Moon in ${moonName?.en}` : `चन्द्र ${moonName?.hi} में`}</span>
                  <span className="text-gold-primary/20">|</span>
                  <span className={`font-bold ${toneColor === 'emerald' ? 'text-emerald-400' : toneColor === 'red' ? 'text-red-400' : 'text-amber-400'}`}>
                    {tone === 'positive' ? (locale === 'en' ? 'Favorable Day' : 'अनुकूल दिन') :
                     tone === 'challenging' ? (locale === 'en' ? 'Caution Needed' : 'सावधानी आवश्यक') :
                     (locale === 'en' ? 'Mixed Influences' : 'मिश्रित प्रभाव')}
                  </span>
                </div>
              </div>
            </div>

            {/* Synthesis narrative */}
            <p className="text-text-primary text-sm leading-relaxed mb-5" style={bodyFont}>
              {t2(synthesis)}
            </p>

            {/* House placement summary grid */}
            <div className="grid grid-cols-5 gap-2">
              {housePlacements.map(h => (
                <div key={h.key} className={`rounded-lg p-2.5 text-center border ${
                  h.nature === 'malefic'
                    ? ([3, 6, 11].includes(h.house) ? 'border-amber-500/20 bg-amber-500/5' : 'border-red-500/20 bg-red-500/5')
                    : h.nature === 'benefic'
                      ? 'border-emerald-500/20 bg-emerald-500/5'
                      : 'border-gold-primary/15 bg-gold-primary/5'
                }`}>
                  <div className={`text-xs font-bold mb-0.5 ${
                    h.nature === 'malefic'
                      ? ([3, 6, 11].includes(h.house) ? 'text-amber-300' : 'text-red-300')
                      : h.nature === 'benefic' ? 'text-emerald-300' : 'text-amber-300'
                  }`}>
                    {locale === 'en' ? h.name.en.split(' ')[0] : h.name.hi}
                  </div>
                  <div className="text-gold-light text-lg font-bold font-mono">{h.house}</div>
                  <div className="text-text-secondary/70 text-xs">
                    {locale === 'en'
                      ? `${h.house}${['st','nd','rd'][h.house-1]||'th'} house`
                      : `${h.house}वाँ भाव`}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        );
      })() : (
        <div className="rounded-xl p-4 bg-gold-primary/5 border border-gold-primary/15 mb-8 text-center">
          <p className="text-text-secondary text-sm" style={bodyFont}>
            {locale === 'en'
              ? 'Generate a Kundali to see a personalized synthesis of how today\'s Upagrahas affect your specific houses.'
              : 'आज के उपग्रह आपके विशिष्ट भावों को कैसे प्रभावित करते हैं, इसका व्यक्तिगत सारांश दे���ने के लिए कुंडली बनाएँ।'}
            {' '}
            <Link href="/kundali" className="text-gold-primary hover:text-gold-light font-bold underline">
              {locale === 'en' ? 'Generate Kundali' : 'कुंडली बनाएँ'}
            </Link>
          </p>
        </div>
      )}

      {/* Date selector */}
      <div className="flex justify-center mb-10">
        <input type="date" value={dateStr} onChange={e => setDateStr(e.target.value)}
          className="px-5 py-3 rounded-xl bg-bg-tertiary/50 border border-gold-primary/20 text-gold-light text-lg font-mono focus:outline-none focus:border-gold-primary/50"
        />
      </div>

      <GoldDivider />

      {/* Upagraha Cards with interpretation */}
      <div className="space-y-5 my-10">
        {upagrahas.map((u, i) => {
          const isExpanded = expanded === u.key;
          const signEffect = u.info.signEffects[u.sign];
          const house = hasBirthData ? getHouseFromMoon(birthRashi, u.sign) : 0;
          const houseEffect = house ? HOUSE_UPAGRAHA_EFFECT[u.key]?.[house] : null;
          return (
            <motion.div key={u.key}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
            >
              <div
                className={`bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border rounded-2xl overflow-hidden transition-all duration-300 ${isExpanded ? 'border-gold-primary/30' : 'border-gold-primary/12'}`}
              >
                {/* Main card */}
                <div className="p-6">
                  <div className="flex items-start gap-4">
                    <RashiIconById id={u.sign} size={48} />
                    <div className="flex-1 min-w-0">
                      {/* Name + badges */}
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <span className="text-gold-light text-xl font-bold" style={headingFont}>
                          {u.info.name[locale]}
                        </span>
                        <span className={`px-2 py-0.5 text-xs font-bold uppercase rounded-full border ${natureBg(u.info.nature)}`}>
                          {natureLabel(u.info.nature)}
                        </span>
                        <span className="text-text-secondary/70 text-xs">
                          {locale === 'en' ? 'Ruler:' : 'स्वामी:'} <span className={natureColor(u.info.nature)}>{u.info.ruler[locale]}</span>
                        </span>
                      </div>

                      {/* Position */}
                      <div className="flex items-center gap-3 mb-3 flex-wrap">
                        <span className="text-gold-primary font-bold text-lg font-mono">{u.degree}</span>
                        <span className="text-text-secondary text-sm" style={bodyFont}>
                          {locale === 'en' ? 'in' : 'में'} <span className="text-gold-light font-semibold">{u.signName[locale]}</span>
                        </span>
                        <span className="text-text-secondary/65 text-xs font-mono">({u.longitude.toFixed(2)}°)</span>
                      </div>

                      {/* Sign-specific interpretation — always visible */}
                      <div className="rounded-xl p-4 bg-bg-primary/50 border border-gold-primary/10 mb-3">
                        <div className="text-gold-dark text-xs uppercase tracking-wider font-bold mb-1.5">
                          {locale === 'en' ? `${u.info.name.en} in ${u.signName.en} — What it means for you` : `${u.info.name.hi} ${u.signName.hi} में — आपके लिए क्या अर्थ है`}
                        </div>
                        <p className="text-text-primary text-sm leading-relaxed" style={bodyFont}>
                          {t2(signEffect)}
                        </p>
                      </div>

                      {/* Personalized house effect */}
                      {hasBirthData && houseEffect && (
                        <div className="rounded-xl p-4 bg-bg-primary/50 border border-emerald-500/15 mb-3">
                          <div className="flex items-center gap-2 mb-2">
                            <Zap className="w-3.5 h-3.5 text-emerald-400" />
                            <span className="text-emerald-400 text-xs uppercase tracking-wider font-bold">
                              {locale === 'en' ? `For you — ${house}${['st','nd','rd'][house-1] || 'th'} house from Moon` : `आपके लिए — चन्द्र से ${house}वाँ भाव`}
                            </span>
                          </div>
                          <p className="text-text-primary text-sm leading-relaxed" style={bodyFont}>
                            {t2(houseEffect)}
                          </p>
                        </div>
                      )}

                      {/* General signification summary */}
                      <p className="text-text-secondary/70 text-xs leading-relaxed" style={bodyFont}>
                        {t2(u.info.significations)}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Expand toggle */}
                <button
                  onClick={() => setExpanded(isExpanded ? null : u.key)}
                  className="w-full px-6 py-3 text-center text-xs font-bold uppercase tracking-wider border-t border-gold-primary/10 text-gold-dark hover:text-gold-light hover:bg-gold-primary/5 transition-all"
                >
                  {isExpanded
                    ? (locale === 'en' ? 'Show less' : 'कम दिखाएँ')
                    : (locale === 'en' ? 'Show detailed analysis' : 'विस्तृत विश्लेषण दिखाएँ')}
                </button>

                {/* Expanded detail */}
                {isExpanded && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="border-t border-gold-primary/10 px-6 py-5 space-y-5"
                  >
                    {/* When strong / when afflicted */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="rounded-xl p-4 bg-emerald-500/5 border border-emerald-500/15">
                        <div className="text-emerald-400 text-xs uppercase tracking-wider font-bold mb-2">
                          {locale === 'en' ? 'When Well-Placed' : 'शुभ स्थिति में'}
                        </div>
                        <p className="text-text-secondary text-xs leading-relaxed" style={bodyFont}>
                          {t2(u.info.whenStrong)}
                        </p>
                      </div>
                      <div className="rounded-xl p-4 bg-red-500/5 border border-red-500/15">
                        <div className="text-red-400 text-xs uppercase tracking-wider font-bold mb-2">
                          {locale === 'en' ? 'When Afflicted' : 'पीड़ित स्थिति में'}
                        </div>
                        <p className="text-text-secondary text-xs leading-relaxed" style={bodyFont}>
                          {t2(u.info.whenAfflicted)}
                        </p>
                      </div>
                    </div>

                    {/* All 12 sign effects */}
                    <div>
                      <div className="text-gold-dark text-xs uppercase tracking-wider font-bold mb-3">
                        {locale === 'en' ? `${u.info.name.en} through the 12 Signs` : `12 राशियों में ${u.info.name.hi}`}
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {Array.from({ length: 12 }, (_, idx) => {
                          const signId = idx + 1;
                          const effect = u.info.signEffects[signId];
                          const isCurrent = signId === u.sign;
                          return (
                            <div key={signId} className={`rounded-lg px-3 py-2.5 flex items-start gap-2.5 ${isCurrent ? 'bg-gold-primary/8 border border-gold-primary/25' : 'bg-bg-primary/30 border border-gold-primary/5'}`}>
                              <div className="flex-shrink-0 mt-0.5">
                                <RashiIconById id={signId} size={20} />
                              </div>
                              <div className="min-w-0">
                                <div className="flex items-center gap-1.5">
                                  <span className={`font-bold text-xs ${isCurrent ? 'text-gold-light' : 'text-text-primary'}`}>
                                    {RASHIS[signId - 1].name[locale]}
                                  </span>
                                  {isCurrent && <span className="px-1 py-0 text-xs bg-gold-primary/20 text-gold-primary rounded font-bold uppercase">{locale === 'en' ? 'NOW' : 'अभी'}</span>}
                                </div>
                                <p className="text-text-secondary/75 text-xs leading-snug mt-0.5" style={bodyFont}>{t2(effect)}</p>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Formula explanation */}
      <div className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-2xl p-6">
        <h3 className="text-gold-light text-lg font-bold mb-2" style={headingFont}>
          {locale === 'en' ? 'Derivation Formulae' : 'व्युत्पत्ति सूत्र'}
        </h3>
        <p className="text-text-secondary text-xs mb-4 leading-relaxed" style={bodyFont}>
          {locale === 'en'
            ? 'All five Upagrahas are mathematically derived from the Sun\'s sidereal longitude. They form a chain — each computed from the previous, creating a symmetric pattern around the zodiac.'
            : 'सभी पाँच उपग्रह सूर्य की सायन देशांतर से गणितीय रूप से व्युत्पन्न हैं। वे एक शृंखला बनाते हैं — प्रत्येक पिछले से गणना, राशिचक्र के चारों ओर एक सममित पैटर्न बनाते हैं।'}
        </p>
        <div className="space-y-2 text-sm font-mono">
          {[
            { formula: 'Dhuma = Sun + 133°20\'', desc: locale === 'en' ? 'Sun\'s smoke — always ahead of the Sun' : 'सूर्य का धूम — सदैव सूर्य से आगे' },
            { formula: 'Vyatipata = 360° − Dhuma', desc: locale === 'en' ? 'Mirror of Dhuma — the fall point' : 'धूम का दर्पण — पतन बिंदु' },
            { formula: 'Parivesha = Vyatipata + 180°', desc: locale === 'en' ? 'Opposite of the fall — the halo' : 'पतन का विपरीत — प्रभामंडल' },
            { formula: 'Chapa = 360° − Parivesha', desc: locale === 'en' ? 'Mirror of halo — Indra\'s rainbow' : 'प्रभामंडल का दर्पण — इन्द्रधनुष' },
            { formula: 'Upaketu = Chapa + 16°40\'', desc: locale === 'en' ? 'Chapa\'s karmic tail — the sub-Ketu' : 'चाप की कार्मिक पूँछ — उपकेतु' },
          ].map(f => (
            <div key={f.formula} className="flex items-start gap-3 rounded-lg p-3 bg-bg-primary/30 border border-gold-primary/5">
              <span className="text-gold-light font-bold text-xs flex-shrink-0 w-56">{f.formula}</span>
              <span className="text-text-secondary/75 text-xs">{f.desc}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
