'use client';

import { tl } from '@/lib/utils/trilingual';
import { useState } from 'react';
import { useLocale } from 'next-intl';
import { motion, AnimatePresence } from 'framer-motion';
import { Skull, ShieldAlert, Sword, Gem } from 'lucide-react';
import { Link } from '@/lib/i18n/navigation';
import type { Locale } from '@/types/panchang';
import { isDevanagariLocale } from '@/lib/utils/locale-fonts';
import { lt } from '@/lib/learn/translations';
import type { LocaleText } from '@/lib/learn/translations';
import LT from '@/messages/learn/advanced-houses.json';

/* ── Trilingual Labels ──────────────────────────────────────────────── */
const L: Record<string, LocaleText> = {
  title:    { en: 'Advanced House Concepts', hi: 'उन्नत भाव सिद्धान्त', sa: 'उन्नतभावसिद्धान्ताः' , ta: 'மேம்பட்ட பாவ கருத்துக்கள்' },
  subtitle: { en: 'MKS, Badhaka, Maraka, and Functional Nature of Planets', hi: 'मारक कारक स्थान, बाधक, मारक, एवं ग्रहों की कार्यात्मक प्रकृति', sa: 'मारककारकस्थानं, बाधकः, मारकः, ग्रहाणां कार्यात्मकस्वभावश्च' },
  mksTitle: { en: 'Marana Karaka Sthana (MKS) --- The Death Place', hi: 'मारक कारक स्थान (MKS) --- मृत्यु स्थान', sa: 'मारककारकस्थानम् --- मृत्युस्थानम्' },
  mksDesc:  { en: 'Certain planets are severely weakened in specific houses --- their "death place." An MKS planet gives EXTREMELY weak results regardless of sign dignity. Even an exalted planet in MKS suffers --- the house overrides the sign.', hi: 'कुछ ग्रह विशिष्ट भावों में अत्यधिक दुर्बल हो जाते हैं --- उनका "मृत्यु स्थान"। MKS ग्रह राशि गरिमा की परवाह किए बिना अत्यन्त दुर्बल फल देता है। उच्च ग्रह भी MKS में पीड़ित रहता है।', sa: 'केचन ग्रहाः विशिष्टभावेषु अतीव दुर्बलाः भवन्ति --- तेषां मृत्युस्थानम्। MKS ग्रहः राशिगौरवं विना अतीव दुर्बलफलं ददाति।' },
  planet:   { en: 'Planet', hi: 'ग्रह', sa: 'ग्रहः' },
  mksHouse: { en: 'MKS House', hi: 'MKS भाव', sa: 'MKS भावः' },
  why:      { en: 'Why', hi: 'क्यों', sa: 'कारणम्' },
  remedy:   { en: 'Remedy', hi: 'उपाय', sa: 'उपायः' },
  badhakaTitle: { en: 'Badhaka --- The Obstruction Lord', hi: 'बाधक --- अवरोध स्वामी', sa: 'बाधकः --- अवरोधस्वामी' },
  badhakaDesc:  { en: 'The Badhakesh causes inexplicable obstacles, chronic blocks, and unexplained failures. When the Badhakesh dasha runs and transit activates it, expect the most frustrating period of life.', hi: 'बाधकेश अकथनीय बाधाएँ, दीर्घकालिक अवरोध और अस्पष्ट विफलताएँ उत्पन्न करता है। जब बाधकेश दशा चलती है और गोचर उसे सक्रिय करता है, जीवन का सबसे निराशाजनक काल होता है।', sa: 'बाधकेशः अवर्णनीयान् विघ्नान्, दीर्घकालिकान् अवरोधान्, अस्पष्टान् विफलतान् च जनयति।' },
  badhakaRemedy: { en: 'Remedy: worship the deity of the Badhakesh and address the house it occupies.', hi: 'उपाय: बाधकेश के देवता की पूजा करें और जिस भाव में वह बैठा है उसे सम्बोधित करें।', sa: 'उपायः: बाधकेशस्य देवतां पूजयतु तद्भावं च सम्बोधयतु।' },
  lagnaType:    { en: 'Lagna Type', hi: 'लग्न प्रकार', sa: 'लग्नप्रकारः' },
  lagnas:       { en: 'Lagnas', hi: 'लग्न', sa: 'लग्नानि' },
  badhakaHouse: { en: 'Badhaka House', hi: 'बाधक भाव', sa: 'बाधकभावः' },
  marakaTitle:  { en: 'Maraka --- The Death-Inflicting Lords', hi: 'मारक --- मृत्यु-कारक स्वामी', sa: 'मारकः --- मृत्युकारकस्वामिनः' },
  marakaDesc:   { en: 'The 2nd and 7th house lords are called Maraka (killer) planets. During a Maraka planet\'s dasha combined with old age, expect health crises. In younger charts, Maraka dasha brings illness, not death. The most dangerous period: Maraka dasha + Sade Sati + 8th lord transit.', hi: '2रे और 7वें भाव के स्वामी मारक (हत्यारे) ग्रह कहलाते हैं। वृद्धावस्था में मारक दशा के दौरान स्वास्थ्य संकट आता है। युवा कुण्डली में मारक दशा रोग लाती है, मृत्यु नहीं।', sa: 'द्वितीयसप्तमभावस्वामिनौ मारकौ (हन्तारौ) ग्रहौ उच्येते। वार्धक्ये मारकदशायां स्वास्थ्यसङ्कटं भवति।' },
  funcTitle: { en: 'Functional Nature of Planets', hi: 'ग्रहों की कार्यात्मक प्रकृति', sa: 'ग्रहाणां कार्यात्मकस्वभावः' },
  funcDesc:  { en: 'The same planet can be benefic for one lagna and malefic for another. This is WHY generic gemstone advice is DANGEROUS --- you must check functional nature first. Saturn is YOGAKARAKA (best planet) for Taurus and Libra lagna, yet Jupiter is a functional malefic for Taurus lagna.', hi: 'एक ही ग्रह एक लग्न के लिए शुभ और दूसरे के लिए अशुभ हो सकता है। इसीलिए सामान्य रत्न सलाह खतरनाक है --- पहले कार्यात्मक स्वभाव जाँचें।', sa: 'एकः एव ग्रहः एकस्य लग्नस्य शुभः अपरस्य अशुभः भवितुम् अर्हति। अतः सामान्यरत्नसलाहः भयावहा।' },
  lagna:     { en: 'Lagna', hi: 'लग्न', sa: 'लग्नम्' },
  yogakaraka: { en: 'Yogakaraka', hi: 'योगकारक', sa: 'योगकारकः' },
  benefic:   { en: 'Benefic', hi: 'शुभ', sa: 'शुभः' },
  malefic:   { en: 'Malefic', hi: 'अशुभ', sa: 'अशुभः' },
  maraka:    { en: 'Maraka', hi: 'मारक', sa: 'मारकः' },
  relLinks:  { en: 'Related Pages', hi: 'सम्बन्धित पृष्ठ', sa: 'सम्बद्धपृष्ठानि' },
};

/* ── Data ───────────────────────────────────────────────────────────── */
const MKS_DATA: { planet: LocaleText; house: number; why: LocaleText; remedy: LocaleText }[] = [
  { planet: { en: 'Sun', hi: 'सूर्य', sa: 'सूर्यः' }, house: 12, why: { en: 'Authority dissolves in house of loss and isolation', hi: 'हानि और एकान्त के भाव में अधिकार विलीन हो जाता है', sa: 'हानिएकान्तभावे अधिकारः विलीयते' }, remedy: { en: 'Surya Namaskar at dawn, donate wheat on Sundays', hi: 'सूर्योदय पर सूर्य नमस्कार, रविवार को गेहूँ दान', sa: 'प्रातःकाले सूर्यनमस्कारः, रविवासरे गोधूमदानम्' } },
  { planet: { en: 'Moon', hi: 'चन्द्र', sa: 'चन्द्रः' }, house: 8, why: { en: 'Mind tortured in house of secrets and death', hi: 'रहस्य और मृत्यु के भाव में मन पीड़ित', sa: 'रहस्यमृत्युभावे मनः पीड्यते' }, remedy: { en: 'Worship Devi on Mondays, donate rice and milk', hi: 'सोमवार को देवी पूजा, चावल और दूध दान', sa: 'सोमवासरे देवीपूजा, तण्डुलक्षीरदानम्' } },
  { planet: { en: 'Mars', hi: 'मंगल', sa: 'मङ्गलः' }, house: 7, why: { en: 'Warrior energy misplaced in house of diplomacy', hi: 'कूटनीति के भाव में योद्धा ऊर्जा अनुपयुक्त', sa: 'कूटनीतिभावे योद्धृशक्तिः अनुचिता' }, remedy: { en: 'Hanuman Chalisa on Tuesdays, donate red lentils', hi: 'मंगलवार को हनुमान चालीसा, मसूर दाल दान', sa: 'मङ्गलवासरे हनुमच्चालीसा, रक्तमसूरदानम्' } },
  { planet: { en: 'Mercury', hi: 'बुध', sa: 'बुधः' }, house: 4, why: { en: 'Intellect disturbed in house of emotions', hi: 'भावनाओं के भाव में बुद्धि विक्षुब्ध', sa: 'भावनाभावे बुद्धिः विक्षुब्धा' }, remedy: { en: 'Chant Vishnu Sahasranama, donate green moong', hi: 'विष्णु सहस्रनाम पाठ, हरी मूँग दान', sa: 'विष्णुसहस्रनामपाठः, हरितमुद्गदानम्' } },
  { planet: { en: 'Jupiter', hi: 'गुरु', sa: 'गुरुः' }, house: 3, why: { en: 'Wisdom diminished in house of mere efforts', hi: 'केवल प्रयास के भाव में ज्ञान क्षीण', sa: 'केवलप्रयासभावे ज्ञानं क्षीयते' }, remedy: { en: 'Guru Puja on Thursdays, donate yellow items and turmeric', hi: 'गुरुवार को गुरु पूजा, पीली वस्तुएँ और हल्दी दान', sa: 'गुरुवासरे गुरुपूजा, पीतवस्तुहरिद्रादानम्' } },
  { planet: { en: 'Venus', hi: 'शुक्र', sa: 'शुक्रः' }, house: 6, why: { en: 'Love destroyed in house of enemies and disease', hi: 'शत्रु और रोग के भाव में प्रेम नष्ट', sa: 'शत्रुरोगभावे प्रेम नश्यति' }, remedy: { en: 'Lakshmi Puja on Fridays, donate white clothes and sugar', hi: 'शुक्रवार को लक्ष्मी पूजा, सफेद वस्त्र और चीनी दान', sa: 'शुक्रवासरे लक्ष्मीपूजा, श्वेतवस्त्रशर्करादानम्' } },
  { planet: { en: 'Saturn', hi: 'शनि', sa: 'शनिः' }, house: 1, why: { en: 'Discipline crushes the self and body', hi: 'अनुशासन स्वयं और शरीर को कुचलता है', sa: 'अनुशासनम् आत्मानं शरीरं च पीडयति' }, remedy: { en: 'Feed crows on Saturdays, donate black sesame and oil', hi: 'शनिवार को कौओं को खिलाएँ, काले तिल और तेल दान', sa: 'शनिवासरे काकेभ्यो भोजनं, कृष्णतिलतैलदानम्' } },
  { planet: { en: 'Rahu', hi: 'राहु', sa: 'राहुः' }, house: 9, why: { en: 'Obsession corrupts dharma and faith', hi: 'जुनून धर्म और आस्था को भ्रष्ट करता है', sa: 'व्यसनं धर्मं श्रद्धां च दूषयति' }, remedy: { en: 'Durga worship, donate to orphanages, avoid deception', hi: 'दुर्गा पूजा, अनाथालय में दान, छल से बचें', sa: 'दुर्गापूजा, अनाथालयदानं, छलं वर्जयेत्' } },
  { planet: { en: 'Ketu', hi: 'केतु', sa: 'केतुः' }, house: 5, why: { en: 'Detachment harms children and creativity', hi: 'वैराग्य सन्तान और सृजनशीलता को हानि पहुँचाता है', sa: 'वैराग्यं सन्तानं सृजनशीलतां च हिनस्ति' }, remedy: { en: 'Ganesh worship, donate blankets, chant Om Namah Shivaya', hi: 'गणेश पूजा, कम्बल दान, ॐ नमः शिवाय जप', sa: 'गणेशपूजा, कम्बलदानं, ॐ नमः शिवाय जपः' } },
];

const BADHAKA_DATA: { type: LocaleText; lagnas: LocaleText; house: LocaleText }[] = [
  { type: { en: 'Movable (Chara)', hi: 'चर', sa: 'चरः' }, lagnas: { en: 'Aries, Cancer, Libra, Capricorn', hi: 'मेष, कर्क, तुला, मकर', sa: 'मेषः, कर्कटः, तुला, मकरः' }, house: { en: '11th house lord', hi: '11वें भाव स्वामी', sa: 'एकादशभावस्वामी' } },
  { type: { en: 'Fixed (Sthira)', hi: 'स्थिर', sa: 'स्थिरः' }, lagnas: { en: 'Taurus, Leo, Scorpio, Aquarius', hi: 'वृषभ, सिंह, वृश्चिक, कुम्भ', sa: 'वृषभः, सिंहः, वृश्चिकः, कुम्भः' }, house: { en: '9th house lord', hi: '9वें भाव स्वामी', sa: 'नवमभावस्वामी' } },
  { type: { en: 'Dual (Dwiswabhava)', hi: 'द्विस्वभाव', sa: 'द्विस्वभावः' }, lagnas: { en: 'Gemini, Virgo, Sagittarius, Pisces', hi: 'मिथुन, कन्या, धनु, मीन', sa: 'मिथुनं, कन्या, धनुः, मीनः' }, house: { en: '7th house lord', hi: '7वें भाव स्वामी', sa: 'सप्तमभावस्वामी' } },
];

const BADHAKESH_TABLE: { lagna: LocaleText; badhakesh: LocaleText }[] = [
  { lagna: { en: 'Aries', hi: 'मेष', sa: 'मेषः' }, badhakesh: { en: 'Saturn (Aquarius 11H)', hi: 'शनि (कुम्भ 11भ)', sa: 'शनिः (कुम्भः 11भा)' } },
  { lagna: { en: 'Taurus', hi: 'वृषभ', sa: 'वृषभः' }, badhakesh: { en: 'Saturn (Capricorn 9H)', hi: 'शनि (मकर 9भ)', sa: 'शनिः (मकरः 9भा)' } },
  { lagna: { en: 'Gemini', hi: 'मिथुन', sa: 'मिथुनम्' }, badhakesh: { en: 'Jupiter (Sagittarius 7H)', hi: 'गुरु (धनु 7भ)', sa: 'गुरुः (धनुः 7भा)' } },
  { lagna: { en: 'Cancer', hi: 'कर्क', sa: 'कर्कटः' }, badhakesh: { en: 'Venus (Taurus 11H)', hi: 'शुक्र (वृषभ 11भ)', sa: 'शुक्रः (वृषभः 11भा)' } },
  { lagna: { en: 'Leo', hi: 'सिंह', sa: 'सिंहः' }, badhakesh: { en: 'Mars (Aries 9H)', hi: 'मंगल (मेष 9भ)', sa: 'मङ्गलः (मेषः 9भा)' } },
  { lagna: { en: 'Virgo', hi: 'कन्या', sa: 'कन्या' }, badhakesh: { en: 'Jupiter (Pisces 7H)', hi: 'गुरु (मीन 7भ)', sa: 'गुरुः (मीनः 7भा)' } },
  { lagna: { en: 'Libra', hi: 'तुला', sa: 'तुला' }, badhakesh: { en: 'Sun (Leo 11H)', hi: 'सूर्य (सिंह 11भ)', sa: 'सूर्यः (सिंहः 11भा)' } },
  { lagna: { en: 'Scorpio', hi: 'वृश्चिक', sa: 'वृश्चिकः' }, badhakesh: { en: 'Moon (Cancer 9H)', hi: 'चन्द्र (कर्क 9भ)', sa: 'चन्द्रः (कर्कटः 9भा)' } },
  { lagna: { en: 'Sagittarius', hi: 'धनु', sa: 'धनुः' }, badhakesh: { en: 'Mercury (Gemini 7H)', hi: 'बुध (मिथुन 7भ)', sa: 'बुधः (मिथुनम् 7भा)' } },
  { lagna: { en: 'Capricorn', hi: 'मकर', sa: 'मकरः' }, badhakesh: { en: 'Mars (Scorpio 11H)', hi: 'मंगल (वृश्चिक 11भ)', sa: 'मङ्गलः (वृश्चिकः 11भा)' } },
  { lagna: { en: 'Aquarius', hi: 'कुम्भ', sa: 'कुम्भः' }, badhakesh: { en: 'Venus (Libra 9H)', hi: 'शुक्र (तुला 9भ)', sa: 'शुक्रः (तुला 9भा)' } },
  { lagna: { en: 'Pisces', hi: 'मीन', sa: 'मीनः' }, badhakesh: { en: 'Mercury (Virgo 7H)', hi: 'बुध (कन्या 7भ)', sa: 'बुधः (कन्या 7भा)' } },
];

const MARAKA_TABLE: { lagna: LocaleText; lord2: LocaleText; lord7: LocaleText }[] = [
  { lagna: { en: 'Aries', hi: 'मेष', sa: 'मेषः' }, lord2: { en: 'Venus (Taurus)', hi: 'शुक्र (वृषभ)', sa: 'शुक्रः (वृषभः)' }, lord7: { en: 'Venus (Libra)', hi: 'शुक्र (तुला)', sa: 'शुक्रः (तुला)' } },
  { lagna: { en: 'Taurus', hi: 'वृषभ', sa: 'वृषभः' }, lord2: { en: 'Mercury (Gemini)', hi: 'बुध (मिथुन)', sa: 'बुधः (मिथुनम्)' }, lord7: { en: 'Mars (Scorpio)', hi: 'मंगल (वृश्चिक)', sa: 'मङ्गलः (वृश्चिकः)' } },
  { lagna: { en: 'Gemini', hi: 'मिथुन', sa: 'मिथुनम्' }, lord2: { en: 'Moon (Cancer)', hi: 'चन्द्र (कर्क)', sa: 'चन्द्रः (कर्कटः)' }, lord7: { en: 'Jupiter (Sagittarius)', hi: 'गुरु (धनु)', sa: 'गुरुः (धनुः)' } },
  { lagna: { en: 'Cancer', hi: 'कर्क', sa: 'कर्कटः' }, lord2: { en: 'Sun (Leo)', hi: 'सूर्य (सिंह)', sa: 'सूर्यः (सिंहः)' }, lord7: { en: 'Saturn (Capricorn)', hi: 'शनि (मकर)', sa: 'शनिः (मकरः)' } },
  { lagna: { en: 'Leo', hi: 'सिंह', sa: 'सिंहः' }, lord2: { en: 'Mercury (Virgo)', hi: 'बुध (कन्या)', sa: 'बुधः (कन्या)' }, lord7: { en: 'Saturn (Aquarius)', hi: 'शनि (कुम्भ)', sa: 'शनिः (कुम्भः)' } },
  { lagna: { en: 'Virgo', hi: 'कन्या', sa: 'कन्या' }, lord2: { en: 'Venus (Libra)', hi: 'शुक्र (तुला)', sa: 'शुक्रः (तुला)' }, lord7: { en: 'Jupiter (Pisces)', hi: 'गुरु (मीन)', sa: 'गुरुः (मीनः)' } },
  { lagna: { en: 'Libra', hi: 'तुला', sa: 'तुला' }, lord2: { en: 'Mars (Scorpio)', hi: 'मंगल (वृश्चिक)', sa: 'मङ्गलः (वृश्चिकः)' }, lord7: { en: 'Mars (Aries)', hi: 'मंगल (मेष)', sa: 'मङ्गलः (मेषः)' } },
  { lagna: { en: 'Scorpio', hi: 'वृश्चिक', sa: 'वृश्चिकः' }, lord2: { en: 'Jupiter (Sagittarius)', hi: 'गुरु (धनु)', sa: 'गुरुः (धनुः)' }, lord7: { en: 'Venus (Taurus)', hi: 'शुक्र (वृषभ)', sa: 'शुक्रः (वृषभः)' } },
  { lagna: { en: 'Sagittarius', hi: 'धनु', sa: 'धनुः' }, lord2: { en: 'Saturn (Capricorn)', hi: 'शनि (मकर)', sa: 'शनिः (मकरः)' }, lord7: { en: 'Mercury (Gemini)', hi: 'बुध (मिथुन)', sa: 'बुधः (मिथुनम्)' } },
  { lagna: { en: 'Capricorn', hi: 'मकर', sa: 'मकरः' }, lord2: { en: 'Saturn (Aquarius)', hi: 'शनि (कुम्भ)', sa: 'शनिः (कुम्भः)' }, lord7: { en: 'Moon (Cancer)', hi: 'चन्द्र (कर्क)', sa: 'चन्द्रः (कर्कटः)' } },
  { lagna: { en: 'Aquarius', hi: 'कुम्भ', sa: 'कुम्भः' }, lord2: { en: 'Jupiter (Pisces)', hi: 'गुरु (मीन)', sa: 'गुरुः (मीनः)' }, lord7: { en: 'Sun (Leo)', hi: 'सूर्य (सिंह)', sa: 'सूर्यः (सिंहः)' } },
  { lagna: { en: 'Pisces', hi: 'मीन', sa: 'मीनः' }, lord2: { en: 'Mars (Aries)', hi: 'मंगल (मेष)', sa: 'मङ्गलः (मेषः)' }, lord7: { en: 'Mercury (Virgo)', hi: 'बुध (कन्या)', sa: 'बुधः (कन्या)' } },
];

const FUNC_TABLE: { lagna: LocaleText; yogakaraka: LocaleText; benefic: LocaleText; malefic: LocaleText }[] = [
  { lagna: { en: 'Aries', hi: 'मेष', sa: 'मेषः' }, yogakaraka: { en: 'Sun', hi: 'सूर्य', sa: 'सूर्यः' }, benefic: { en: 'Jupiter, Mars', hi: 'गुरु, मंगल', sa: 'गुरुः, मङ्गलः' }, malefic: { en: 'Mercury, Venus, Saturn', hi: 'बुध, शुक्र, शनि', sa: 'बुधः, शुक्रः, शनिः' } },
  { lagna: { en: 'Taurus', hi: 'वृषभ', sa: 'वृषभः' }, yogakaraka: { en: 'Saturn', hi: 'शनि', sa: 'शनिः' }, benefic: { en: 'Sun, Mercury, Saturn', hi: 'सूर्य, बुध, शनि', sa: 'सूर्यः, बुधः, शनिः' }, malefic: { en: 'Jupiter, Venus, Moon', hi: 'गुरु, शुक्र, चन्द्र', sa: 'गुरुः, शुक्रः, चन्द्रः' } },
  { lagna: { en: 'Gemini', hi: 'मिथुन', sa: 'मिथुनम्' }, yogakaraka: { en: 'Venus', hi: 'शुक्र', sa: 'शुक्रः' }, benefic: { en: 'Venus, Saturn', hi: 'शुक्र, शनि', sa: 'शुक्रः, शनिः' }, malefic: { en: 'Mars, Jupiter, Sun', hi: 'मंगल, गुरु, सूर्य', sa: 'मङ्गलः, गुरुः, सूर्यः' } },
  { lagna: { en: 'Cancer', hi: 'कर्क', sa: 'कर्कटः' }, yogakaraka: { en: 'Mars', hi: 'मंगल', sa: 'मङ्गलः' }, benefic: { en: 'Mars, Jupiter, Moon', hi: 'मंगल, गुरु, चन्द्र', sa: 'मङ्गलः, गुरुः, चन्द्रः' }, malefic: { en: 'Mercury, Venus, Saturn', hi: 'बुध, शुक्र, शनि', sa: 'बुधः, शुक्रः, शनिः' } },
  { lagna: { en: 'Leo', hi: 'सिंह', sa: 'सिंहः' }, yogakaraka: { en: 'Mars', hi: 'मंगल', sa: 'मङ्गलः' }, benefic: { en: 'Sun, Mars, Jupiter', hi: 'सूर्य, मंगल, गुरु', sa: 'सूर्यः, मङ्गलः, गुरुः' }, malefic: { en: 'Mercury, Venus, Saturn', hi: 'बुध, शुक्र, शनि', sa: 'बुधः, शुक्रः, शनिः' } },
  { lagna: { en: 'Virgo', hi: 'कन्या', sa: 'कन्या' }, yogakaraka: { en: 'Mercury', hi: 'बुध', sa: 'बुधः' }, benefic: { en: 'Mercury, Venus', hi: 'बुध, शुक्र', sa: 'बुधः, शुक्रः' }, malefic: { en: 'Mars, Jupiter, Moon', hi: 'मंगल, गुरु, चन्द्र', sa: 'मङ्गलः, गुरुः, चन्द्रः' } },
  { lagna: { en: 'Libra', hi: 'तुला', sa: 'तुला' }, yogakaraka: { en: 'Saturn', hi: 'शनि', sa: 'शनिः' }, benefic: { en: 'Mercury, Venus, Saturn', hi: 'बुध, शुक्र, शनि', sa: 'बुधः, शुक्रः, शनिः' }, malefic: { en: 'Sun, Mars, Jupiter', hi: 'सूर्य, मंगल, गुरु', sa: 'सूर्यः, मङ्गलः, गुरुः' } },
  { lagna: { en: 'Scorpio', hi: 'वृश्चिक', sa: 'वृश्चिकः' }, yogakaraka: { en: 'Sun', hi: 'सूर्य', sa: 'सूर्यः' }, benefic: { en: 'Sun, Moon, Jupiter', hi: 'सूर्य, चन्द्र, गुरु', sa: 'सूर्यः, चन्द्रः, गुरुः' }, malefic: { en: 'Mercury, Venus, Saturn', hi: 'बुध, शुक्र, शनि', sa: 'बुधः, शुक्रः, शनिः' } },
  { lagna: { en: 'Sagittarius', hi: 'धनु', sa: 'धनुः' }, yogakaraka: { en: 'Sun', hi: 'सूर्य', sa: 'सूर्यः' }, benefic: { en: 'Sun, Mars, Jupiter', hi: 'सूर्य, मंगल, गुरु', sa: 'सूर्यः, मङ्गलः, गुरुः' }, malefic: { en: 'Mercury, Venus, Saturn', hi: 'बुध, शुक्र, शनि', sa: 'बुधः, शुक्रः, शनिः' } },
  { lagna: { en: 'Capricorn', hi: 'मकर', sa: 'मकरः' }, yogakaraka: { en: 'Venus', hi: 'शुक्र', sa: 'शुक्रः' }, benefic: { en: 'Mercury, Venus, Saturn', hi: 'बुध, शुक्र, शनि', sa: 'बुधः, शुक्रः, शनिः' }, malefic: { en: 'Mars, Jupiter, Moon', hi: 'मंगल, गुरु, चन्द्र', sa: 'मङ्गलः, गुरुः, चन्द्रः' } },
  { lagna: { en: 'Aquarius', hi: 'कुम्भ', sa: 'कुम्भः' }, yogakaraka: { en: 'Venus', hi: 'शुक्र', sa: 'शुक्रः' }, benefic: { en: 'Venus, Saturn, Sun', hi: 'शुक्र, शनि, सूर्य', sa: 'शुक्रः, शनिः, सूर्यः' }, malefic: { en: 'Mars, Jupiter, Moon', hi: 'मंगल, गुरु, चन्द्र', sa: 'मङ्गलः, गुरुः, चन्द्रः' } },
  { lagna: { en: 'Pisces', hi: 'मीन', sa: 'मीनः' }, yogakaraka: { en: 'Mars', hi: 'मंगल', sa: 'मङ्गलः' }, benefic: { en: 'Moon, Mars, Jupiter', hi: 'चन्द्र, मंगल, गुरु', sa: 'चन्द्रः, मङ्गलः, गुरुः' }, malefic: { en: 'Sun, Mercury, Venus, Saturn', hi: 'सूर्य, बुध, शुक्र, शनि', sa: 'सूर्यः, बुधः, शुक्रः, शनिः' } },
];

const SECTIONS = [
  { id: 'mks',      icon: Skull,       color: '#f87171' },
  { id: 'badhaka',  icon: ShieldAlert, color: '#a78bfa' },
  { id: 'maraka',   icon: Sword,       color: '#fb923c' },
  { id: 'func',     icon: Gem,         color: '#34d399' },
] as const;

const sectionKeys = ['mks', 'badhaka', 'maraka', 'func'] as const;
type SectionId = typeof sectionKeys[number];

const SECTION_TITLES: Record<SectionId, LocaleText> = {
  mks: L.mksTitle, badhaka: L.badhakaTitle, maraka: L.marakaTitle, func: L.funcTitle,
};

/* ── Shared Glass Card ──────────────────────────────────────────────── */
function Glass({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`rounded-2xl border border-gold-primary/10 bg-card-dark/60 backdrop-blur-md shadow-lg shadow-black/20 ${className}`}>
      {children}
    </div>
  );
}

/* ── Component ──────────────────────────────────────────────────────── */
export default function AdvancedHousesPage() {
  const locale = useLocale() as Locale;
  const t = (key: string) => lt((LT as unknown as Record<string, LocaleText>)[key], locale);
  const [active, setActive] = useState<SectionId>('mks');

  return (
    <div className="max-w-5xl mx-auto px-4 py-10 space-y-10">
      {/* Hero */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center space-y-3">
        <h1 className="text-3xl md:text-4xl font-bold text-gold-light font-heading">{t('title')}</h1>
        <p className="text-text-secondary max-w-2xl mx-auto">{t('subtitle')}</p>
      </motion.div>

      {/* Section Tabs */}
      <div className="flex flex-wrap justify-center gap-2">
        {SECTIONS.map(({ id, icon: Icon, color }) => (
          <button key={id} onClick={() => setActive(id)} className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${active === id ? 'border-2 text-gold-light scale-105' : 'border border-white/10 text-text-secondary hover:text-text-primary'}`} style={active === id ? { borderColor: color, backgroundColor: `${color}18` } : {}}>
            <Icon size={16} style={{ color }} />
            <span className="hidden sm:inline">{t(id === 'mks' ? 'mksTitle' : id === 'badhaka' ? 'badhakaTitle' : id === 'maraka' ? 'marakaTitle' : 'funcTitle')}</span>
          </button>
        ))}
      </div>

      {/* Animated Section Content */}
      <AnimatePresence mode="wait">
        {/* ── MKS Section ─── */}
        {active === 'mks' && (
          <motion.div key="mks" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} className="space-y-6">
            <Glass className="p-6">
              <h2 className="text-xl font-bold text-red-400 mb-3">{t('mksTitle')}</h2>
              <p className="text-text-secondary text-sm leading-relaxed">{t('mksDesc')}</p>
            </Glass>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gold-primary/20">
                    <th className="text-left py-3 px-3 text-gold-light font-semibold">{t('planet')}</th>
                    <th className="text-center py-3 px-3 text-gold-light font-semibold">{t('mksHouse')}</th>
                    <th className="text-left py-3 px-3 text-gold-light font-semibold">{t('why')}</th>
                    <th className="text-left py-3 px-3 text-gold-light font-semibold">{t('remedy')}</th>
                  </tr>
                </thead>
                <tbody>
                  {MKS_DATA.map((row, i) => (
                    <tr key={i} className="border-b border-white/5 hover:bg-gold-primary/5 transition-colors">
                      <td className="py-3 px-3 text-text-primary font-medium">{row.planet[locale]}</td>
                      <td className="py-3 px-3 text-center"><span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-red-500/15 text-red-400 font-bold text-xs">{row.house}</span></td>
                      <td className="py-3 px-3 text-text-secondary">{row.why[locale]}</td>
                      <td className="py-3 px-3 text-emerald-400/80 text-xs">{row.remedy[locale]}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}

        {/* ── Badhaka Section ─── */}
        {active === 'badhaka' && (
          <motion.div key="badhaka" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} className="space-y-6">
            <Glass className="p-6">
              <h2 className="text-xl font-bold text-purple-400 mb-3">{t('badhakaTitle')}</h2>
              <p className="text-text-secondary text-sm leading-relaxed mb-3">{t('badhakaDesc')}</p>
              <p className="text-amber-400/80 text-xs italic">{t('badhakaRemedy')}</p>
            </Glass>
            {/* Rule by Lagna Type */}
            <div className="grid md:grid-cols-3 gap-4">
              {BADHAKA_DATA.map((row, i) => (
                <Glass key={i} className="p-5 text-center space-y-2">
                  <div className="text-purple-400 font-bold text-sm">{row.type[locale]}</div>
                  <div className="text-text-secondary text-xs">{row.lagnas[locale]}</div>
                  <div className="text-gold-light font-semibold text-sm mt-2">{row.house[locale]}</div>
                </Glass>
              ))}
            </div>
            {/* Full Badhakesh Table */}
            <Glass className="p-4 overflow-x-auto">
              <h3 className="text-sm font-bold text-gold-light mb-3">{t('badhakeshAllTitle')}</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {BADHAKESH_TABLE.map((row, i) => (
                  <div key={i} className="flex items-center gap-2 p-2 rounded-lg bg-white/3 border border-white/5">
                    <span className="text-text-primary text-xs font-medium min-w-[70px]">{row.lagna[locale]}</span>
                    <span className="text-purple-300/80 text-xs">{row.badhakesh[locale]}</span>
                  </div>
                ))}
              </div>
            </Glass>
          </motion.div>
        )}

        {/* ── Maraka Section ─── */}
        {active === 'maraka' && (
          <motion.div key="maraka" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} className="space-y-6">
            <Glass className="p-6">
              <h2 className="text-xl font-bold text-orange-400 mb-3">{t('marakaTitle')}</h2>
              <p className="text-text-secondary text-sm leading-relaxed">{t('marakaDesc')}</p>
            </Glass>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gold-primary/20">
                    <th className="text-left py-3 px-3 text-gold-light font-semibold">{t('lagna')}</th>
                    <th className="text-left py-3 px-3 text-gold-light font-semibold">{t('lord2Maraka')}</th>
                    <th className="text-left py-3 px-3 text-gold-light font-semibold">{t('lord7Maraka')}</th>
                  </tr>
                </thead>
                <tbody>
                  {MARAKA_TABLE.map((row, i) => (
                    <tr key={i} className="border-b border-white/5 hover:bg-gold-primary/5 transition-colors">
                      <td className="py-2.5 px-3 text-text-primary font-medium">{row.lagna[locale]}</td>
                      <td className="py-2.5 px-3 text-orange-300/80">{row.lord2[locale]}</td>
                      <td className="py-2.5 px-3 text-orange-300/80">{row.lord7[locale]}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}

        {/* ── Functional Nature Section ─── */}
        {active === 'func' && (
          <motion.div key="func" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} className="space-y-6">
            <Glass className="p-6">
              <h2 className="text-xl font-bold text-emerald-400 mb-3">{t('funcTitle')}</h2>
              <p className="text-text-secondary text-sm leading-relaxed">{t('funcDesc')}</p>
            </Glass>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gold-primary/20">
                    <th className="text-left py-3 px-3 text-gold-light font-semibold">{t('lagna')}</th>
                    <th className="text-left py-3 px-3 text-gold-light font-semibold">{t('yogakaraka')}</th>
                    <th className="text-left py-3 px-3 text-gold-light font-semibold">{t('benefic')}</th>
                    <th className="text-left py-3 px-3 text-gold-light font-semibold">{t('malefic')}</th>
                  </tr>
                </thead>
                <tbody>
                  {FUNC_TABLE.map((row, i) => (
                    <tr key={i} className="border-b border-white/5 hover:bg-gold-primary/5 transition-colors">
                      <td className="py-2.5 px-3 text-text-primary font-medium">{row.lagna[locale]}</td>
                      <td className="py-2.5 px-3"><span className="px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 text-xs font-bold">{row.yogakaraka[locale]}</span></td>
                      <td className="py-2.5 px-3 text-sky-300/80">{row.benefic[locale]}</td>
                      <td className="py-2.5 px-3 text-red-400/70">{row.malefic[locale]}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Related Links */}
      <Glass className="p-6">
        <h3 className="text-sm font-bold text-gold-light mb-4">{t('relLinks')}</h3>
        <div className="flex flex-wrap gap-3">
          {[
            { href: '/kundali', label: { en: t('relGenKundali'), hi: t('relGenKundali'), sa: t('relGenKundali') } },
            { href: '/learn/bhavas', label: { en: '12 Houses (Bhavas)', hi: '12 भाव', sa: '12 भावाः' } },
            { href: '/learn/remedies', label: { en: 'Remedies', hi: 'उपाय', sa: 'उपायाः' } },
            { href: '/learn/planet-in-house', label: { en: 'Planet in House', hi: 'भाव में ग्रह', sa: 'भावे ग्रहः' } },
          ].map((link) => (
            <Link key={link.href} href={link.href} className="px-4 py-2 rounded-lg bg-gold-primary/8 border border-gold-primary/20 text-gold-light text-sm hover:bg-gold-primary/15 transition-colors">
              {tl(link.label, locale)}
            </Link>
          ))}
        </div>
      </Glass>
    </div>
  );
}
