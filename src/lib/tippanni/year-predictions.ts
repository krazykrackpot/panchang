/**
 * Year Predictions Engine
 * Generates dynamic current-year predictions by computing transits
 * of Saturn, Jupiter, Rahu/Ketu against the natal chart, plus
 * scanning dasha data for transitions within the year.
 */

import type { KundaliData, DashaEntry } from '@/types/kundali';
import type { Locale , LocaleText} from '@/types/panchang';
import type { YearPredictionSection, YearEvent, QuarterForecast } from '@/lib/kundali/tippanni-types';
import { getPlanetaryPositions, dateToJD, toSidereal, getRashiNumber } from '@/lib/ephem/astronomical';
import { RASHIS } from '@/lib/constants/rashis';
import { GRAHAS } from '@/lib/constants/grahas';

function t(locale: Locale, en: string, hi: string, _sa?: string): string {
  // 'sa' (Sanskrit) retired — _sa param kept for call-site compat but ignored
  return locale === 'hi' ? hi : en;
}

/** Get rashi name in given locale */
function rashiName(signNum: number, locale: Locale): string {
  const r = RASHIS[signNum - 1];
  return r ? r.name[locale] || "" : '';
}

/** Get graha name in given locale */
function grahaName(id: number, locale: Locale): string {
  const g = GRAHAS[id];
  return g ? g.name[locale] || "" : '';
}

/** Compute house number from transit sign relative to a reference sign (1-based) */
function houseFromSign(transitSign: number, refSign: number): number {
  return ((transitSign - refSign + 12) % 12) + 1;
}

/** Get current transit sidereal signs for Saturn, Jupiter, Rahu, Ketu */
function getCurrentTransits(): { saturnSign: number; jupiterSign: number; rahuSign: number; ketuSign: number; jd: number } {
  const now = new Date();
  const jd = dateToJD(now.getFullYear(), now.getMonth() + 1, now.getDate(), now.getHours());
  const positions = getPlanetaryPositions(jd);

  const saturnLong = toSidereal(positions[6].longitude, jd);
  const jupiterLong = toSidereal(positions[4].longitude, jd);
  const rahuLong = toSidereal(positions[7].longitude, jd);
  const ketuLong = toSidereal(positions[8].longitude, jd);

  return {
    saturnSign: getRashiNumber(saturnLong),
    jupiterSign: getRashiNumber(jupiterLong),
    rahuSign: getRashiNumber(rahuLong),
    ketuSign: getRashiNumber(ketuLong),
    jd,
  };
}

/** Detect Sade Sati (Saturn 12th, 1st, or 2nd from natal Moon) */
function detectSadeSati(saturnSign: number, natalMoonSign: number, locale: Locale): YearEvent | null {
  const house = houseFromSign(saturnSign, natalMoonSign);

  if (house !== 12 && house !== 1 && house !== 2) return null;

  const phase = house === 12 ? 'rising' : house === 1 ? 'peak' : 'setting';

  const phaseLabels = {
    rising: {
      en: 'Rising Phase (Saturn in 12th from Moon)',
      hi: 'आरोहण चरण (चन्द्र से 12वें भाव में शनि)',
      sa: 'आरोहणचरणः (चन्द्रात् द्वादशभावे शनिः)',
    },
    peak: {
      en: 'Peak Phase (Saturn conjunct natal Moon)',
      hi: 'शिखर चरण (शनि जन्म चन्द्रमा पर)',
      sa: 'शिखरचरणः (शनिः जन्मचन्द्रे)',
    },
    setting: {
      en: 'Setting Phase (Saturn in 2nd from Moon)',
      hi: 'अवरोहण चरण (चन्द्र से 2रे भाव में शनि)',
      sa: 'अवरोहणचरणः (चन्द्रात् द्वितीयभावे शनिः)',
    },
  };

  const descriptions = {
    rising: {
      en: `Sade Sati's rising phase brings mental restlessness and emotional turbulence. Saturn transiting ${rashiName(saturnSign, 'en')} in the 12th from your natal Moon initiates a 7.5-year cycle of transformation. Focus on inner strength, spiritual practices, and detachment from material worries. This phase tests emotional resilience but builds deep character.`,
      hi: `साढ़े साती का आरोहण चरण मानसिक अशान्ति और भावनात्मक उथल-पुथल लाता है। ${rashiName(saturnSign, 'hi')} में शनि का गोचर आपके जन्म चन्द्रमा से 12वें भाव में 7.5 वर्ष के परिवर्तन चक्र का आरम्भ करता है। आन्तरिक शक्ति, आध्यात्मिक अभ्यास और वैराग्य पर ध्यान दें।`,
    },
    peak: {
      en: `Sade Sati's peak phase is the most intense period. Saturn directly transiting your natal Moon sign ${rashiName(natalMoonSign, 'en')} brings significant life changes — career shifts, relationship tests, and health awareness. This is a time of deep karmic reckoning and maturation. Challenges faced now build lasting resilience and wisdom.`,
      hi: `साढ़े साती का शिखर चरण सबसे तीव्र काल है। शनि सीधे आपकी जन्म चन्द्र राशि ${rashiName(natalMoonSign, 'hi')} पर गोचर कर रहा है — कैरियर में बदलाव, सम्बन्धों की परीक्षा और स्वास्थ्य जागरूकता। यह गहन कार्मिक परिपक्वता का समय है।`,
    },
    setting: {
      en: `Sade Sati's setting phase brings financial pressures and family adjustments. Saturn in ${rashiName(saturnSign, 'en')} (2nd from Moon) affects speech, savings, and family dynamics. While challenges are easing, maintain discipline in finances and communication. This final phase consolidates the lessons of the entire cycle.`,
      hi: `साढ़े साती का अवरोहण चरण आर्थिक दबाव और पारिवारिक समायोजन लाता है। ${rashiName(saturnSign, 'hi')} में शनि (चन्द्र से 2रे) वाणी, बचत और पारिवारिक गतिशीलता को प्रभावित करता है। चुनौतियाँ कम हो रही हैं, किन्तु वित्तीय अनुशासन बनाए रखें।`,
    },
  };

  const remedyText = t(locale,
    'Remedies: Recite Shani Chalisa on Saturdays. Donate black sesame and mustard oil. Visit Shani temple. Wear blue sapphire only after consultation. Practice patience and service to the elderly.',
    'उपाय: शनिवार को शनि चालीसा पाठ करें। काले तिल और सरसों तेल दान करें। शनि मन्दिर दर्शन। नीलम केवल परामर्श के बाद धारण करें। धैर्य और वृद्धजन सेवा का अभ्यास करें।',
    'उपायाः: शनिवासरे शनिचालीसापाठः। कृष्णतिलसर्षपतैलदानम्। शनिमन्दिरदर्शनम्। धैर्यं वृद्धजनसेवा च।'
  );

  return {
    type: 'sade_sati',
    title: t(locale,
      `Sade Sati — ${phaseLabels[phase].en}`,
      `साढ़े साती — ${phaseLabels[phase].hi}`,
      `साढेसाती — ${phaseLabels[phase].sa}`
    ),
    description: t(locale,
      descriptions[phase].en,
      descriptions[phase].hi,
    ),
    period: t(locale, 'Ongoing this year', 'इस वर्ष जारी', 'अस्मिन् वर्षे प्रचलितम्'),
    impact: phase === 'peak' ? 'challenging' : 'mixed',
    remedies: remedyText,
  };
}

/** Analyze Jupiter transit effects */
function analyzeJupiterTransit(jupiterSign: number, natalMoonSign: number, ascSign: number, locale: Locale): YearEvent {
  const houseFromMoon = houseFromSign(jupiterSign, natalMoonSign);
  const houseFromAsc = houseFromSign(jupiterSign, ascSign);

  // Favorable houses from Moon: 2, 5, 7, 9, 11 (Kendra/Trikona from Moon)
  const favorable = [2, 5, 7, 9, 11];
  // Challenging: 3, 6, 8, 12
  const challenging = [3, 6, 8, 12];

  const impact: YearEvent['impact'] = favorable.includes(houseFromMoon)
    ? 'favorable'
    : challenging.includes(houseFromMoon)
      ? 'challenging'
      : 'mixed';

  const houseEffects: Record<number, LocaleText> = {
    1: { en: 'Jupiter transiting your Moon sign brings renewed optimism, health improvement, and fresh opportunities. A year of personal growth and self-confidence.', hi: 'बृहस्पति आपकी चन्द्र राशि पर गोचर करते हुए नवीन आशावाद, स्वास्थ्य सुधार और नए अवसर लाते हैं।', sa: 'बृहस्पति आपकी चन्द्र राशि पर गोचर करते हुए नवीन आशावाद, स्वास्थ्य सुधार और नए अवसर लाते हैं।', mai: 'बृहस्पति आपकी चन्द्र राशि पर गोचर करते हुए नवीन आशावाद, स्वास्थ्य सुधार और नए अवसर लाते हैं।', mr: 'बृहस्पति आपकी चन्द्र राशि पर गोचर करते हुए नवीन आशावाद, स्वास्थ्य सुधार और नए अवसर लाते हैं।', ta: 'குரு உங்கள் சந்திர ராசியில் கோள்பெயர்ச்சி புதுப்பிக்கப்பட்ட நம்பிக்கை, உடல்நல மேம்பாடு, புதிய வாய்ப்புகளை கொண்டு வருகிறார். தனிப்பட்ட வளர்ச்சி மற்றும் தன்னம்பிக்கையின் ஆண்டு.', te: 'మీ చంద్ర రాశిలో గురు గోచారం నవీకృత ఆశావాదం, ఆరోగ్య మెరుగుదల, కొత్త అవకాశాలను తెస్తుంది. వ్యక్తిగత వృద్ధి మరియు ఆత్మవిశ్వాసం యొక్క సంవత్సరం.', bn: 'আপনার চন্দ্র রাশিতে বৃহস্পতি গোচর নবীন আশাবাদ, স্বাস্থ্য উন্নতি ও নতুন সুযোগ আনে। ব্যক্তিগত বিকাশ ও আত্মবিশ্বাসের বছর।', kn: 'ನಿಮ್ಮ ಚಂದ್ರ ರಾಶಿಯಲ್ಲಿ ಗುರು ಗೋಚಾರ ಹೊಸ ಆಶಾವಾದ, ಆರೋಗ್ಯ ಸುಧಾರಣೆ, ಹೊಸ ಅವಕಾಶಗಳನ್ನು ತರುತ್ತದೆ. ವೈಯಕ್ತಿಕ ಬೆಳವಣಿಗೆ ಮತ್ತು ಆತ್ಮವಿಶ್ವಾಸದ ವರ್ಷ.', gu: 'તમારી ચંદ્ર રાશિમાં ગુરુ ગોચર નવી આશાવાદ, સ્વાસ્થ્ય સુધારો, તાજી તકો લાવે છે. વ્યક્તિગત વિકાસ અને આત્મવિશ્વાસનું વર્ષ.' },
    2: { en: 'Jupiter in 2nd from Moon enhances wealth, family harmony, and eloquent speech. Financial gains through wisdom and righteous means.', hi: 'चन्द्र से 2रे भाव में बृहस्पति धन, पारिवारिक सामंजस्य और वाक्पटुता बढ़ाते हैं।', sa: 'चन्द्र से 2रे भाव में बृहस्पति धन, पारिवारिक सामंजस्य और वाक्पटुता बढ़ाते हैं।', mai: 'चन्द्र से 2रे भाव में बृहस्पति धन, पारिवारिक सामंजस्य और वाक्पटुता बढ़ाते हैं।', mr: 'चन्द्र से 2रे भाव में बृहस्पति धन, पारिवारिक सामंजस्य और वाक्पटुता बढ़ाते हैं।', ta: 'சந்திரனிலிருந்து 2-ல் குரு செல்வம், குடும்ப நல்லிணக்கம், சொற்பொழிவை மேம்படுத்துகிறார். ஞானம் மற்றும் நேர்மையான வழிகளில் நிதி லாபம்.', te: 'చంద్రుని నుండి 2వ స్థానంలో గురు సంపద, కుటుంబ సామరస్యం, వాగ్ధాటిని పెంచుతాడు. జ్ఞానం మరియు ధర్మమార్గం ద్వారా ఆర్థిక లాభాలు.', bn: 'চন্দ্র থেকে ২য় স্থানে বৃহস্পতি সম্পদ, পারিবারিক সম্প্রীতি ও বাগ্মিতা বাড়ায়। জ্ঞান ও ন্যায়পরায়ণ উপায়ে আর্থিক লাভ।', kn: 'ಚಂದ್ರನಿಂದ 2ನೇ ಸ್ಥಾನದಲ್ಲಿ ಗುರು ಸಂಪತ್ತು, ಕುಟುಂಬ ಸಾಮರಸ್ಯ, ವಾಗ್ಮಿತೆ ಹೆಚ್ಚಿಸುತ್ತಾನೆ. ಜ್ಞಾನ ಮತ್ತು ಧರ್ಮ ಮಾರ್ಗದಿಂದ ಆರ್ಥಿಕ ಲಾಭ.', gu: 'ચંદ્રથી 2જા સ્થાનમાં ગુરુ ધન, કુટુંબ સુમેળ, વાક્ચાતુર્ય વધારે છે. જ્ઞાન અને ધર્મના માર્ગે નાણાકીય લાભ.' },
    3: { en: 'Jupiter in 3rd from Moon may bring some stagnation in initiatives. Extra effort needed for communication success. Sibling relations need attention.', hi: 'चन्द्र से 3रे भाव में बृहस्पति पहल में कुछ ठहराव ला सकते हैं। संवाद में अतिरिक्त प्रयास आवश्यक।', sa: 'चन्द्र से 3रे भाव में बृहस्पति पहल में कुछ ठहराव ला सकते हैं। संवाद में अतिरिक्त प्रयास आवश्यक।', mai: 'चन्द्र से 3रे भाव में बृहस्पति पहल में कुछ ठहराव ला सकते हैं। संवाद में अतिरिक्त प्रयास आवश्यक।', mr: 'चन्द्र से 3रे भाव में बृहस्पति पहल में कुछ ठहराव ला सकते हैं। संवाद में अतिरिक्त प्रयास आवश्यक।', ta: 'சந்திரனிலிருந்து 3-ல் குரு முயற்சிகளில் சில தேக்கநிலையை கொண்டு வரலாம். தகவல் தொடர்பு வெற்றிக்கு கூடுதல் முயற்சி தேவை.', te: 'చంద్రుని నుండి 3వ స్థానంలో గురు కార్యక్రమాలలో కొంత స్తబ్దతను తేవచ్చు. సంభాషణ విజయానికి అదనపు ప్రయత్నం అవసరం.', bn: 'চন্দ্র থেকে ৩য় স্থানে বৃহস্পতি উদ্যোগে কিছু স্থবিরতা আনতে পারে। যোগাযোগ সাফল্যের জন্য অতিরিক্ত প্রচেষ্টা প্রয়োজন।', kn: 'ಚಂದ್ರನಿಂದ 3ನೇ ಸ್ಥಾನದಲ್ಲಿ ಗುರು ಉಪಕ್ರಮಗಳಲ್ಲಿ ಕೆಲವು ನಿಶ್ಚಲತೆ ತರಬಹುದು. ಸಂವಹನ ಯಶಸ್ಸಿಗೆ ಹೆಚ್ಚುವರಿ ಪ್ರಯತ್ನ ಬೇಕು.', gu: 'ચંદ્રથી 3જા સ્થાનમાં ગુરુ પહેલોમાં કેટલીક સ્થગિતતા લાવી શકે. સંવાદ સફળતા માટે વધારાના પ્રયત્ન જરૂરી.' },
    4: { en: 'Jupiter in 4th from Moon brings mixed results — domestic changes, vehicle purchase possibility, but emotional fluctuations. Mother\'s health needs attention.', hi: 'चन्द्र से 4थे भाव में बृहस्पति मिश्रित फल — घरेलू परिवर्तन, वाहन योग, किन्तु भावनात्मक उतार-चढ़ाव।' },
    5: { en: 'Jupiter in 5th from Moon is excellent — intelligence sharpens, children prosper, creative projects succeed, and romantic life flourishes. A blessed year for education.', hi: 'चन्द्र से 5वें भाव में बृहस्पति उत्कृष्ट — बुद्धि तीक्ष्ण, सन्तान प्रगति, रचनात्मक सफलता और शिक्षा में आशीर्वाद।', sa: 'चन्द्र से 5वें भाव में बृहस्पति उत्कृष्ट — बुद्धि तीक्ष्ण, सन्तान प्रगति, रचनात्मक सफलता और शिक्षा में आशीर्वाद।', mai: 'चन्द्र से 5वें भाव में बृहस्पति उत्कृष्ट — बुद्धि तीक्ष्ण, सन्तान प्रगति, रचनात्मक सफलता और शिक्षा में आशीर्वाद।', mr: 'चन्द्र से 5वें भाव में बृहस्पति उत्कृष्ट — बुद्धि तीक्ष्ण, सन्तान प्रगति, रचनात्मक सफलता और शिक्षा में आशीर्वाद।', ta: 'Jupiter in 5th from Moon is excellent — intelligence sharpens, children prosper, creative projects succeed, and romantic life flourishes. A blessed year for education.', te: 'Jupiter in 5th from Moon is excellent — intelligence sharpens, children prosper, creative projects succeed, and romantic life flourishes. A blessed year for education.', bn: 'Jupiter in 5th from Moon is excellent — intelligence sharpens, children prosper, creative projects succeed, and romantic life flourishes. A blessed year for education.', kn: 'Jupiter in 5th from Moon is excellent — intelligence sharpens, children prosper, creative projects succeed, and romantic life flourishes. A blessed year for education.', gu: 'Jupiter in 5th from Moon is excellent — intelligence sharpens, children prosper, creative projects succeed, and romantic life flourishes. A blessed year for education.' },
    6: { en: 'Jupiter in 6th from Moon presents challenges through opponents and health concerns. However, debts may be cleared and legal matters can resolve. Stay vigilant about health.', hi: 'चन्द्र से 6ठे भाव में बृहस्पति शत्रुओं और स्वास्थ्य चिन्ताओं से चुनौतियाँ। किन्तु ऋण मुक्ति और कानूनी मामले सुलझ सकते हैं।', sa: 'चन्द्र से 6ठे भाव में बृहस्पति शत्रुओं और स्वास्थ्य चिन्ताओं से चुनौतियाँ। किन्तु ऋण मुक्ति और कानूनी मामले सुलझ सकते हैं।', mai: 'चन्द्र से 6ठे भाव में बृहस्पति शत्रुओं और स्वास्थ्य चिन्ताओं से चुनौतियाँ। किन्तु ऋण मुक्ति और कानूनी मामले सुलझ सकते हैं।', mr: 'चन्द्र से 6ठे भाव में बृहस्पति शत्रुओं और स्वास्थ्य चिन्ताओं से चुनौतियाँ। किन्तु ऋण मुक्ति और कानूनी मामले सुलझ सकते हैं।', ta: 'சந்திரனிலிருந்து 6-ல் குரு எதிரிகள் மற்றும் உடல்நலம் மூலம் சவால்களை முன்வைக்கிறார். இருப்பினும், கடன்கள் தீரலாம், சட்ட விவகாரங்கள் தீர்வாகலாம்.', te: 'చంద్రుని నుండి 6వ స్థానంలో గురు ప్రత్యర్థులు మరియు ఆరోగ్య సమస్యల ద్వారా సవాళ్లు ఇస్తాడు. అయితే, ఋణాలు తీరవచ్చు, న్యాయ విషయాలు పరిష్కారమవచ్చు.', bn: 'চন্দ্র থেকে ৬ষ্ঠ স্থানে বৃহস্পতি প্রতিদ্বন্দ্বী ও স্বাস্থ্যের মাধ্যমে চ্যালেঞ্জ দেয়। তবে, ঋণ মুক্ত হতে পারে এবং আইনি বিষয় সমাধান হতে পারে।', kn: 'ಚಂದ್ರನಿಂದ 6ನೇ ಸ್ಥಾನದಲ್ಲಿ ಗುರು ಪ್ರತಿಸ್ಪರ್ಧಿಗಳು ಮತ್ತು ಆರೋಗ್ಯ ಕಾಳಜಿಯ ಮೂಲಕ ಸವಾಲುಗಳನ್ನು ನೀಡುತ್ತಾನೆ. ಆದರೆ, ಋಣಗಳು ತೀರಬಹುದು, ಕಾನೂನು ವಿಷಯಗಳು ಪರಿಹಾರವಾಗಬಹುದು.', gu: 'ચંદ્રથી 6ઠ્ઠા સ્થાનમાં ગુરુ વિરોધીઓ અને સ્વાસ્થ્ય ચિંતાઓ દ્વારા પડકારો રજૂ કરે છે. જોકે, દેવાં ચૂકતે થઈ શકે, કાનૂની બાબતો ઉકેલાઈ શકે.' },
    7: { en: 'Jupiter in 7th from Moon is highly favorable for marriage, partnerships, and public dealings. Business partnerships thrive. Spouse\'s fortune improves.', hi: 'चन्द्र से 7वें भाव में बृहस्पति विवाह, साझेदारी और सार्वजनिक व्यवहार के लिए अत्यन्त शुभ। व्यापार साझेदारी फलती-फूलती।' },
    8: { en: 'Jupiter in 8th from Moon brings obstacles, delays, and possible health issues. Travel difficulties and mental stress. Focus on spiritual practices for relief.', hi: 'चन्द्र से 8वें भाव में बृहस्पति बाधाएँ, विलम्ब और सम्भावित स्वास्थ्य समस्याएँ। आध्यात्मिक अभ्यास पर ध्यान दें।', sa: 'चन्द्र से 8वें भाव में बृहस्पति बाधाएँ, विलम्ब और सम्भावित स्वास्थ्य समस्याएँ। आध्यात्मिक अभ्यास पर ध्यान दें।', mai: 'चन्द्र से 8वें भाव में बृहस्पति बाधाएँ, विलम्ब और सम्भावित स्वास्थ्य समस्याएँ। आध्यात्मिक अभ्यास पर ध्यान दें।', mr: 'चन्द्र से 8वें भाव में बृहस्पति बाधाएँ, विलम्ब और सम्भावित स्वास्थ्य समस्याएँ। आध्यात्मिक अभ्यास पर ध्यान दें।', ta: 'சந்திரனிலிருந்து 8-ல் குரு தடைகள், தாமதங்கள், உடல்நலப் பிரச்சனைகளை கொண்டு வருகிறார். பயண சிரமங்கள் மற்றும் மன அழுத்தம். நிவாரணத்திற்கு ஆன்மீக பயிற்சிகளில் கவனம் செலுத்துங்கள்.', te: 'చంద్రుని నుండి 8వ స్థానంలో గురు అడ్డంకులు, ఆలస్యాలు, ఆరోగ్య సమస్యలు తెస్తాడు. ప్రయాణ ఇబ్బందులు మరియు మానసిక ఒత్తిడి. ఉపశమనం కోసం ఆధ్యాత్మిక సాధనలపై దృష్టి పెట్టండి.', bn: 'চন্দ্র থেকে ৮ম স্থানে বৃহস্পতি বাধা, বিলম্ব ও সম্ভাব্য স্বাস্থ্য সমস্যা আনে। ভ্রমণে অসুবিধা ও মানসিক চাপ। স্বস্তির জন্য আধ্যাত্মিক অনুশীলনে মনোযোগ দিন।', kn: 'ಚಂದ್ರನಿಂದ 8ನೇ ಸ್ಥಾನದಲ್ಲಿ ಗುರು ಅಡ್ಡಿಗಳು, ವಿಳಂಬ, ಆರೋಗ್ಯ ಸಮಸ್ಯೆಗಳನ್ನು ತರುತ್ತಾನೆ. ಪ್ರಯಾಣ ತೊಂದರೆ ಮತ್ತು ಮಾನಸಿಕ ಒತ್ತಡ. ಪರಿಹಾರಕ್ಕಾಗಿ ಆಧ್ಯಾತ್ಮಿಕ ಅಭ್ಯಾಸಗಳ ಮೇಲೆ ಗಮನಹರಿಸಿ.', gu: 'ચંદ્રથી 8મા સ્થાનમાં ગુરુ અવરોધો, વિલંબ, સ્વાસ્થ્ય સમસ્યાઓ લાવે છે. મુસાફરી મુશ્કેલીઓ અને માનસિક તણાવ. રાહત માટે આધ્યાત્મિક સાધના પર ધ્યાન કેન્દ્રિત કરો.' },
    9: { en: 'Jupiter in 9th from Moon is the most auspicious transit — fortune smiles, pilgrimages bear fruit, father\'s blessings flow, and higher education excels. A year of dharmic growth.', hi: 'चन्द्र से 9वें भाव में बृहस्पति सबसे शुभ गोचर — भाग्योदय, तीर्थयात्रा फलदायी, पिता का आशीर्वाद और उच्च शिक्षा में उत्कृष्टता।' },
    10: { en: 'Jupiter in 10th from Moon brings career challenges but also potential for repositioning. Avoid impulsive job changes. Authority figures may be difficult to deal with.', hi: 'चन्द्र से 10वें भाव में बृहस्पति कैरियर चुनौतियाँ किन्तु पुनर्स्थापन की सम्भावना। आवेगपूर्ण नौकरी परिवर्तन से बचें।', sa: 'चन्द्र से 10वें भाव में बृहस्पति कैरियर चुनौतियाँ किन्तु पुनर्स्थापन की सम्भावना। आवेगपूर्ण नौकरी परिवर्तन से बचें।', mai: 'चन्द्र से 10वें भाव में बृहस्पति कैरियर चुनौतियाँ किन्तु पुनर्स्थापन की सम्भावना। आवेगपूर्ण नौकरी परिवर्तन से बचें।', mr: 'चन्द्र से 10वें भाव में बृहस्पति कैरियर चुनौतियाँ किन्तु पुनर्स्थापन की सम्भावना। आवेगपूर्ण नौकरी परिवर्तन से बचें।', ta: 'சந்திரனிலிருந்து 10-ல் குரு தொழில் சவால்களை கொண்டு வருகிறார் ஆனால் மறுநிலைப்படுத்தலுக்கான வாய்ப்பும் உண்டு. தூண்டுதல் வேலை மாற்றங்களைத் தவிர்க்கவும்.', te: 'చంద్రుని నుండి 10వ స్థానంలో గురు వృత్తి సవాళ్లను తెస్తాడు కానీ పునఃస్థాపన అవకాశం కూడా ఉంది. ఆవేశపూరిత ఉద్యోగ మార్పులు నివారించండి.', bn: 'চন্দ্র থেকে ১০ম স্থানে বৃহস্পতি কর্মজীবনে চ্যালেঞ্জ আনে কিন্তু পুনর্বিন্যাসের সুযোগও। আবেগপ্রবণ চাকরি পরিবর্তন এড়িয়ে চলুন।', kn: 'ಚಂದ್ರನಿಂದ 10ನೇ ಸ್ಥಾನದಲ್ಲಿ ಗುರು ವೃತ್ತಿ ಸವಾಲುಗಳನ್ನು ತರುತ್ತಾನೆ ಆದರೆ ಮರುಸ್ಥಾಪನೆ ಅವಕಾಶವೂ ಇದೆ. ಆವೇಶದ ಉದ್ಯೋಗ ಬದಲಾವಣೆ ತಪ್ಪಿಸಿ.', gu: 'ચંદ્રથી 10મા સ્થાનમાં ગુરુ કારકિર્દીમાં પડકારો લાવે છે પણ પુનઃસ્થાપનની તક પણ છે. આવેગી નોકરી ફેરફારો ટાળો.' },
    11: { en: 'Jupiter in 11th from Moon is excellent for gains — income increases, ambitions are fulfilled, elder siblings support, and social network expands. One of the best transits.', hi: 'चन्द्र से 11वें भाव में बृहस्पति लाभ के लिए उत्कृष्ट — आय वृद्धि, महत्वाकांक्षा पूर्ति, बड़े भाई-बहन का सहयोग।', sa: 'चन्द्र से 11वें भाव में बृहस्पति लाभ के लिए उत्कृष्ट — आय वृद्धि, महत्वाकांक्षा पूर्ति, बड़े भाई-बहन का सहयोग।', mai: 'चन्द्र से 11वें भाव में बृहस्पति लाभ के लिए उत्कृष्ट — आय वृद्धि, महत्वाकांक्षा पूर्ति, बड़े भाई-बहन का सहयोग।', mr: 'चन्द्र से 11वें भाव में बृहस्पति लाभ के लिए उत्कृष्ट — आय वृद्धि, महत्वाकांक्षा पूर्ति, बड़े भाई-बहन का सहयोग।', ta: 'Jupiter in 11th from Moon is excellent for gains — income increases, ambitions are fulfilled, elder siblings support, and social network expands. One of the best transits.', te: 'Jupiter in 11th from Moon is excellent for gains — income increases, ambitions are fulfilled, elder siblings support, and social network expands. One of the best transits.', bn: 'Jupiter in 11th from Moon is excellent for gains — income increases, ambitions are fulfilled, elder siblings support, and social network expands. One of the best transits.', kn: 'Jupiter in 11th from Moon is excellent for gains — income increases, ambitions are fulfilled, elder siblings support, and social network expands. One of the best transits.', gu: 'Jupiter in 11th from Moon is excellent for gains — income increases, ambitions are fulfilled, elder siblings support, and social network expands. One of the best transits.' },
    12: { en: 'Jupiter in 12th from Moon indicates expenses, foreign travel, and spiritual awakening. Material losses possible but spiritual gains are significant. Avoid risky investments.', hi: 'चन्द्र से 12वें भाव में बृहस्पति व्यय, विदेश यात्रा और आध्यात्मिक जागृति। भौतिक हानि सम्भव किन्तु आध्यात्मिक लाभ महत्वपूर्ण।', sa: 'चन्द्र से 12वें भाव में बृहस्पति व्यय, विदेश यात्रा और आध्यात्मिक जागृति। भौतिक हानि सम्भव किन्तु आध्यात्मिक लाभ महत्वपूर्ण।', mai: 'चन्द्र से 12वें भाव में बृहस्पति व्यय, विदेश यात्रा और आध्यात्मिक जागृति। भौतिक हानि सम्भव किन्तु आध्यात्मिक लाभ महत्वपूर्ण।', mr: 'चन्द्र से 12वें भाव में बृहस्पति व्यय, विदेश यात्रा और आध्यात्मिक जागृति। भौतिक हानि सम्भव किन्तु आध्यात्मिक लाभ महत्वपूर्ण।', ta: 'சந்திரனிலிருந்து 12-ல் குரு செலவுகள், வெளிநாட்டு பயணம், ஆன்மீக விழிப்பை குறிக்கிறார். பொருள் இழப்பு சாத்தியம் ஆனால் ஆன்மீக லாபம் குறிப்பிடத்தக்கது.', te: 'చంద్రుని నుండి 12వ స్థానంలో గురు ఖర్చులు, విదేశీ ప్రయాణం, ఆధ్యాత్మిక మేల్కొలుపును సూచిస్తాడు. భౌతిక నష్టాలు సాధ్యం కానీ ఆధ్యాత్మిక లాభాలు గణనీయం.', bn: 'চন্দ্র থেকে ১২তম স্থানে বৃহস্পতি ব্যয়, বিদেশ ভ্রমণ ও আধ্যাত্মিক জাগরণ নির্দেশ করে। বৈষয়িক ক্ষতি সম্ভব কিন্তু আধ্যাত্মিক লাভ উল্লেখযোগ্য।', kn: 'ಚಂದ್ರನಿಂದ 12ನೇ ಸ್ಥಾನದಲ್ಲಿ ಗುರು ಖರ್ಚು, ವಿದೇಶ ಪ್ರಯಾಣ, ಆಧ್ಯಾತ್ಮಿಕ ಜಾಗೃತಿ ಸೂಚಿಸುತ್ತಾನೆ. ಭೌತಿಕ ನಷ್ಟ ಸಾಧ್ಯ ಆದರೆ ಆಧ್ಯಾತ್ಮಿಕ ಲಾಭ ಗಣನೀಯ.', gu: 'ચંદ્રથી 12મા સ્થાનમાં ગુરુ ખર્ચ, વિદેશ પ્રવાસ, આધ્યાત્મિક જાગૃતિ સૂચવે છે. ભૌતિક નુકસાન શક્ય પણ આધ્યાત્મિક લાભ નોંધપાત્ર છે.' },
  };

  const effect = houseEffects[houseFromMoon] || houseEffects[1];

  return {
    type: 'jupiter_transit',
    title: t(locale,
      `Jupiter Transit in ${rashiName(jupiterSign, 'en')} (${houseFromMoon}th from Moon, ${houseFromAsc}th from Ascendant)`,
      `बृहस्पति गोचर ${rashiName(jupiterSign, 'hi')} में (चन्द्र से ${houseFromMoon}वाँ, लग्न से ${houseFromAsc}वाँ)`,
      `गुरुगोचरः ${rashiName(jupiterSign, 'sa')} राश्याम् (चन्द्रात् ${houseFromMoon}, लग्नात् ${houseFromAsc})`
    ),
    description: t(locale, effect.en, effect.hi || ""),
    period: t(locale, 'Ongoing this year', 'इस वर्ष जारी', 'अस्मिन् वर्षे प्रचलितम्'),
    impact,
  };
}

/** Analyze Rahu-Ketu transit axis */
function analyzeRahuKetuTransit(rahuSign: number, ketuSign: number, ascSign: number, natalMoonSign: number, locale: Locale): YearEvent {
  const rahuHouseFromAsc = houseFromSign(rahuSign, ascSign);
  const ketuHouseFromAsc = houseFromSign(ketuSign, ascSign);

  // Rahu in upachaya (3,6,10,11) = favorable; dusthana = challenging
  const favorable = [3, 6, 10, 11];
  const impact: YearEvent['impact'] = favorable.includes(rahuHouseFromAsc) ? 'favorable'
    : [1, 5, 7, 9].includes(rahuHouseFromAsc) ? 'mixed' : 'challenging';

  const axisEffects: Record<string, LocaleText> = {
    '1-7': { en: 'Rahu-Ketu across the 1st-7th axis activates themes of self vs. partnerships. Identity transformation and relationship karmic lessons dominate.', hi: '1-7 अक्ष पर राहु-केतु आत्म बनाम साझेदारी के विषय सक्रिय करते हैं। पहचान परिवर्तन और सम्बन्ध कार्मिक पाठ प्रमुख।', sa: '1-7 अक्ष पर राहु-केतु आत्म बनाम साझेदारी के विषय सक्रिय करते हैं। पहचान परिवर्तन और सम्बन्ध कार्मिक पाठ प्रमुख।', mai: '1-7 अक्ष पर राहु-केतु आत्म बनाम साझेदारी के विषय सक्रिय करते हैं। पहचान परिवर्तन और सम्बन्ध कार्मिक पाठ प्रमुख।', mr: '1-7 अक्ष पर राहु-केतु आत्म बनाम साझेदारी के विषय सक्रिय करते हैं। पहचान परिवर्तन और सम्बन्ध कार्मिक पाठ प्रमुख।', ta: '1-7 அச்சில் ராகு-கேது சுயம் எதிர் பங்காளிகள் என்ற கருப்பொருளை செயல்படுத்துகிறது. அடையாள மாற்றம் மற்றும் உறவு கர்ம பாடங்கள் ஆதிக்கம் செலுத்துகின்றன.', te: '1-7 అక్షం వెంట రాహు-కేతు ఆత్మ vs. భాగస్వామ్యాల థీమ్‌లను సక్రియం చేస్తారు. గుర్తింపు పరివర్తన మరియు సంబంధ కర్మ పాఠాలు ఆధిపత్యం చెలాయిస్తాయి.', bn: '১-৭ অক্ষে রাহু-কেতু স্বয়ং বনাম অংশীদারিত্বের বিষয় সক্রিয় করে। পরিচয় রূপান্তর ও সম্পর্কের কর্ম পাঠ প্রাধান্য পায়।', kn: '1-7 ಅಕ್ಷದಲ್ಲಿ ರಾಹು-ಕೇತು ಸ್ವಯಂ vs. ಪಾಲುದಾರಿಕೆ ವಿಷಯಗಳನ್ನು ಸಕ್ರಿಯಗೊಳಿಸುತ್ತಾರೆ. ಗುರುತಿನ ಪರಿವರ್ತನೆ ಮತ್ತು ಸಂಬಂಧ ಕರ್ಮ ಪಾಠಗಳು ಪ್ರಾಬಲ್ಯ ಹೊಂದಿವೆ.', gu: '1-7 અક્ષ પર રાહુ-કેતુ સ્વયં vs. ભાગીદારીના વિષયો સક્રિય કરે છે. ઓળખ પરિવર્તન અને સંબંધ કર્મ પાઠ પ્રભુત્વ ધરાવે છે.' },
    '2-8': { en: 'Rahu-Ketu across the 2nd-8th axis stirs financial transformations and hidden matters. Inheritance, investments, and family wealth undergo karmic adjustments.', hi: '2-8 अक्ष पर राहु-केतु वित्तीय परिवर्तन और गुप्त मामले। विरासत, निवेश और पारिवारिक धन में कार्मिक समायोजन।', sa: '2-8 अक्ष पर राहु-केतु वित्तीय परिवर्तन और गुप्त मामले। विरासत, निवेश और पारिवारिक धन में कार्मिक समायोजन।', mai: '2-8 अक्ष पर राहु-केतु वित्तीय परिवर्तन और गुप्त मामले। विरासत, निवेश और पारिवारिक धन में कार्मिक समायोजन।', mr: '2-8 अक्ष पर राहु-केतु वित्तीय परिवर्तन और गुप्त मामले। विरासत, निवेश और पारिवारिक धन में कार्मिक समायोजन।', ta: '2-8 அச்சில் ராகு-கேது நிதி மாற்றங்கள் மற்றும் மறைந்த விவகாரங்களை தூண்டுகிறது. பரம்பரை, முதலீடுகள், குடும்ப செல்வம் கர்ம சரிசெய்தலுக்கு உள்ளாகின்றன.', te: '2-8 అక్షం వెంట రాహు-కేతు ఆర్థిక పరివర్తనలు మరియు దాగిన విషయాలను కదిలిస్తారు. వారసత్వం, పెట్టుబడులు, కుటుంబ సంపద కర్మ సర్దుబాట్లకు గురవుతాయి.', bn: '২-৮ অক্ষে রাহু-কেতু আর্থিক রূপান্তর ও গোপন বিষয় নাড়া দেয়। উত্তরাধিকার, বিনিয়োগ, পারিবারিক সম্পদ কর্ম সমন্বয়ের মধ্য দিয়ে যায়।', kn: '2-8 ಅಕ್ಷದಲ್ಲಿ ರಾಹು-ಕೇತು ಆರ್ಥಿಕ ಪರಿವರ್ತನೆ ಮತ್ತು ಅಡಗಿರುವ ವಿಷಯಗಳನ್ನು ಕೆರಳಿಸುತ್ತಾರೆ. ಉತ್ತರಾಧಿಕಾರ, ಹೂಡಿಕೆ, ಕುಟುಂಬ ಸಂಪತ್ತು ಕರ್ಮ ಹೊಂದಾಣಿಕೆಗೆ ಒಳಗಾಗುತ್ತವೆ.', gu: '2-8 અક્ષ પર રાહુ-કેતુ નાણાકીય પરિવર્તનો અને છુપાયેલી બાબતોને ઉશ્કેરે છે. વારસો, રોકાણ, કુટુંબ સંપત્તિ કર્મ સમાયોજનમાંથી પસાર થાય છે.' },
    '3-9': { en: 'Rahu-Ketu across the 3rd-9th axis brings unconventional communication, foreign connections, and shifts in belief systems. Short and long journeys are highlighted.', hi: '3-9 अक्ष पर राहु-केतु अपरम्परागत संवाद, विदेशी सम्पर्क और विश्वास प्रणाली में बदलाव। छोटी-बड़ी यात्राएँ प्रमुख।', sa: '3-9 अक्ष पर राहु-केतु अपरम्परागत संवाद, विदेशी सम्पर्क और विश्वास प्रणाली में बदलाव। छोटी-बड़ी यात्राएँ प्रमुख।', mai: '3-9 अक्ष पर राहु-केतु अपरम्परागत संवाद, विदेशी सम्पर्क और विश्वास प्रणाली में बदलाव। छोटी-बड़ी यात्राएँ प्रमुख।', mr: '3-9 अक्ष पर राहु-केतु अपरम्परागत संवाद, विदेशी सम्पर्क और विश्वास प्रणाली में बदलाव। छोटी-बड़ी यात्राएँ प्रमुख।', ta: '3-9 அச்சில் ராகு-கேது வழக்கத்திற்கு மாறான தகவல் தொடர்பு, வெளிநாட்டு தொடர்புகள், நம்பிக்கை அமைப்புகளில் மாற்றங்களை கொண்டு வருகிறது.', te: '3-9 అక్షం వెంట రాహు-కేతు అసాంప్రదాయ సంభాషణ, విదేశీ సంబంధాలు, నమ్మకాల్లో మార్పులను తెస్తారు.', bn: '৩-৯ অক্ষে রাহু-কেতু অপ্রচলিত যোগাযোগ, বিদেশি সংযোগ এবং বিশ্বাস ব্যবস্থায় পরিবর্তন আনে।', kn: '3-9 ಅಕ್ಷದಲ್ಲಿ ರಾಹು-ಕೇತು ಅಸಾಂಪ್ರದಾಯಿಕ ಸಂವಹನ, ವಿದೇಶಿ ಸಂಪರ್ಕ, ನಂಬಿಕೆ ವ್ಯವಸ್ಥೆಗಳಲ್ಲಿ ಬದಲಾವಣೆಗಳನ್ನು ತರುತ್ತಾರೆ.', gu: '3-9 અક્ષ પર રાહુ-કેતુ અપરંપરાગત સંવાદ, વિદેશી સંબંધો, માન્યતા પ્રણાલીઓમાં ફેરફારો લાવે છે.' },
    '4-10': { en: 'Rahu-Ketu across the 4th-10th axis creates tension between home and career. Major professional or domestic changes are likely. Mother or home situation transforms.', hi: '4-10 अक्ष पर राहु-केतु घर और कैरियर के बीच तनाव। प्रमुख पेशेवर या घरेलू परिवर्तन सम्भव।', sa: '4-10 अक्ष पर राहु-केतु घर और कैरियर के बीच तनाव। प्रमुख पेशेवर या घरेलू परिवर्तन सम्भव।', mai: '4-10 अक्ष पर राहु-केतु घर और कैरियर के बीच तनाव। प्रमुख पेशेवर या घरेलू परिवर्तन सम्भव।', mr: '4-10 अक्ष पर राहु-केतु घर और कैरियर के बीच तनाव। प्रमुख पेशेवर या घरेलू परिवर्तन सम्भव।', ta: '4-10 அச்சில் ராகு-கேது வீட்டிற்கும் தொழிலுக்கும் இடையே பதற்றத்தை உருவாக்குகிறது. பெரிய தொழில் அல்லது குடும்ப மாற்றங்கள் சாத்தியம்.', te: '4-10 అక్షం వెంట రాహు-కేతు ఇల్లు మరియు వృత్తి మధ్య ఉద్రిక్తతను సృష్టిస్తారు. పెద్ద వృత్తిపరమైన లేదా గృహ మార్పులు సంభవించవచ్చు.', bn: '৪-১০ অক্ষে রাহু-কেতু ঘর ও কর্মজীবনের মধ্যে উত্তেজনা সৃষ্টি করে। বড় পেশাগত বা ঘরোয়া পরিবর্তন সম্ভব।', kn: '4-10 ಅಕ್ಷದಲ್ಲಿ ರಾಹು-ಕೇತು ಮನೆ ಮತ್ತು ವೃತ್ತಿ ನಡುವೆ ಉದ್ವೇಗ ಸೃಷ್ಟಿಸುತ್ತಾರೆ. ದೊಡ್ಡ ವೃತ್ತಿಪರ ಅಥವಾ ಗೃಹ ಬದಲಾವಣೆಗಳು ಸಾಧ್ಯ.', gu: '4-10 અક્ષ પર રાહુ-કેતુ ઘર અને કારકિર્દી વચ્ચે તણાવ સર્જે છે. મોટા વ્યાવસાયિક અથવા ઘરેલું ફેરફારો સંભવ છે.' },
    '5-11': { en: 'Rahu-Ketu across the 5th-11th axis activates creativity vs. gains. Children, romance, and speculative ventures interact with social networks and ambitions.', hi: '5-11 अक्ष पर राहु-केतु रचनात्मकता बनाम लाभ। सन्तान, प्रेम और सट्टा उद्यम सामाजिक जालों और महत्वाकांक्षाओं से परस्पर क्रिया।', sa: '5-11 अक्ष पर राहु-केतु रचनात्मकता बनाम लाभ। सन्तान, प्रेम और सट्टा उद्यम सामाजिक जालों और महत्वाकांक्षाओं से परस्पर क्रिया।', mai: '5-11 अक्ष पर राहु-केतु रचनात्मकता बनाम लाभ। सन्तान, प्रेम और सट्टा उद्यम सामाजिक जालों और महत्वाकांक्षाओं से परस्पर क्रिया।', mr: '5-11 अक्ष पर राहु-केतु रचनात्मकता बनाम लाभ। सन्तान, प्रेम और सट्टा उद्यम सामाजिक जालों और महत्वाकांक्षाओं से परस्पर क्रिया।', ta: '5-11 அச்சில் ராகு-கேது படைப்பாற்றல் எதிர் லாபத்தை செயல்படுத்துகிறது. குழந்தைகள், காதல், ஊகவணிக முயற்சிகள் சமூக வலைப்பின்னல்கள் மற்றும் லட்சியங்களுடன் தொடர்பு கொள்கின்றன.', te: '5-11 అక్షం వెంట రాహు-కేతు సృజనాత్మకత vs. లాభాలను సక్రియం చేస్తారు. సంతానం, ప్రేమ, ఊహాజనిత వెంచర్లు సామాజిక నెట్‌వర్క్‌లు మరియు ఆశయాలతో సంభాషిస్తాయి.', bn: '৫-১১ অক্ষে রাহু-কেতু সৃজনশীলতা বনাম লাভ সক্রিয় করে। সন্তান, প্রেম, ফটকা উদ্যোগ সামাজিক নেটওয়ার্ক ও উচ্চাকাঙ্ক্ষার সাথে যোগাযোগ করে।', kn: '5-11 ಅಕ್ಷದಲ್ಲಿ ರಾಹು-ಕೇತು ಸೃಜನಶೀಲತೆ vs. ಲಾಭವನ್ನು ಸಕ್ರಿಯಗೊಳಿಸುತ್ತಾರೆ. ಮಕ್ಕಳು, ಪ್ರೇಮ, ಊಹಾತ್ಮಕ ಉದ್ಯಮಗಳು ಸಾಮಾಜಿಕ ಜಾಲಗಳು ಮತ್ತು ಮಹತ್ವಾಕಾಂಕ್ಷೆಗಳೊಂದಿಗೆ ಸಂವಹಿಸುತ್ತವೆ.', gu: '5-11 અક્ષ પર રાહુ-કેતુ સર્જનાત્મકતા vs. લાભ સક્રિય કરે છે. સંતાન, પ્રેમ, સટ્ટાકીય સાહસો સામાજિક નેટવર્ક અને મહત્ત્વાકાંક્ષાઓ સાથે ક્રિયાપ્રતિક્રિયા કરે છે.' },
    '6-12': { en: 'Rahu-Ketu across the 6th-12th axis highlights health, service, and spiritual growth. Enemies and obstacles are karmic. Foreign connections or foreign residence possible.', hi: '6-12 अक्ष पर राहु-केतु स्वास्थ्य, सेवा और आध्यात्मिक विकास। शत्रु और बाधाएँ कार्मिक। विदेशी सम्बन्ध या निवास सम्भव।', sa: '6-12 अक्ष पर राहु-केतु स्वास्थ्य, सेवा और आध्यात्मिक विकास। शत्रु और बाधाएँ कार्मिक। विदेशी सम्बन्ध या निवास सम्भव।', mai: '6-12 अक्ष पर राहु-केतु स्वास्थ्य, सेवा और आध्यात्मिक विकास। शत्रु और बाधाएँ कार्मिक। विदेशी सम्बन्ध या निवास सम्भव।', mr: '6-12 अक्ष पर राहु-केतु स्वास्थ्य, सेवा और आध्यात्मिक विकास। शत्रु और बाधाएँ कार्मिक। विदेशी सम्बन्ध या निवास सम्भव।', ta: '6-12 அச்சில் ராகு-கேது உடல்நலம், சேவை, ஆன்மீக வளர்ச்சியை முன்னிலைப்படுத்துகிறது. எதிரிகளும் தடைகளும் கர்ம சம்பந்தமானவை. வெளிநாட்டு தொடர்புகள் சாத்தியம்.', te: '6-12 అక్షం వెంట రాహు-కేతు ఆరోగ్యం, సేవ, ఆధ్యాత్మిక ఎదుగుదలను హైలైట్ చేస్తారు. శత్రువులు మరియు అడ్డంకులు కర్మ సంబంధం. విదేశీ సంబంధాలు సాధ్యం.', bn: '৬-১২ অক্ষে রাহু-কেতু স্বাস্থ্য, সেবা, আধ্যাত্মিক বিকাশকে তুলে ধরে। শত্রু ও বাধা কর্ম সম্পর্কিত। বিদেশি সংযোগ সম্ভব।', kn: '6-12 ಅಕ್ಷದಲ್ಲಿ ರಾಹು-ಕೇತು ಆರೋಗ್ಯ, ಸೇವೆ, ಆಧ್ಯಾತ್ಮಿಕ ಬೆಳವಣಿಗೆಯನ್ನು ಎತ್ತಿ ತೋರಿಸುತ್ತಾರೆ. ಶತ್ರುಗಳು ಮತ್ತು ಅಡ್ಡಿಗಳು ಕರ್ಮ ಸಂಬಂಧಿ. ವಿದೇಶಿ ಸಂಪರ್ಕ ಸಾಧ್ಯ.', gu: '6-12 અક્ષ પર રાહુ-કેતુ સ્વાસ્થ્ય, સેવા, આધ્યાત્મિક વિકાસને પ્રકાશિત કરે છે. શત્રુઓ અને અવરોધો કર્મ સંબંધિત છે. વિદેશી સંબંધો શક્ય.' },
  };

  // Determine axis key
  const low = Math.min(rahuHouseFromAsc, ketuHouseFromAsc);
  const high = Math.max(rahuHouseFromAsc, ketuHouseFromAsc);
  const axisKey = `${low}-${high}`;
  const effect = axisEffects[axisKey] || {
    en: `Rahu in the ${rahuHouseFromAsc}th house and Ketu in the ${ketuHouseFromAsc}th house activate a karmic axis in your chart. The ${rahuHouseFromAsc}th house themes amplify worldly desires while the ${ketuHouseFromAsc}th house themes facilitate spiritual release.`,
    hi: `${rahuHouseFromAsc}वें भाव में राहु और ${ketuHouseFromAsc}वें भाव में केतु आपकी कुण्डली में कार्मिक अक्ष सक्रिय करते हैं।`,
  };

  return {
    type: 'rahu_ketu',
    title: t(locale,
      `Rahu in ${rashiName(rahuSign, 'en')} (H${rahuHouseFromAsc}) — Ketu in ${rashiName(ketuSign, 'en')} (H${ketuHouseFromAsc})`,
      `राहु ${rashiName(rahuSign, 'hi')} (भाव ${rahuHouseFromAsc}) — केतु ${rashiName(ketuSign, 'hi')} (भाव ${ketuHouseFromAsc})`,
      `राहुः ${rashiName(rahuSign, 'sa')} (भावः ${rahuHouseFromAsc}) — केतुः ${rashiName(ketuSign, 'sa')} (भावः ${ketuHouseFromAsc})`
    ),
    description: t(locale, effect.en, effect.hi || ""),
    period: t(locale, 'Ongoing this year', 'इस वर्ष जारी', 'अस्मिन् वर्षे प्रचलितम्'),
    impact,
  };
}

/** Scan dashas for transitions within the current year */
function findDashaTransitions(dashas: DashaEntry[], locale: Locale): YearEvent[] {
  const events: YearEvent[] = [];
  const year = new Date().getFullYear();
  // Lesson L: use Date.UTC for year boundaries to avoid timezone edge cases near Dec 31/Jan 1
  const yearStart = new Date(Date.UTC(year, 0, 1));
  const yearEnd = new Date(Date.UTC(year, 11, 31));

  // Planet effect summaries for dasha transitions
  const planetEffects: Record<string, LocaleText> = {
    Sun: { en: 'authority, career prominence, government relations, father', hi: 'अधिकार, कैरियर प्रमुखता, सरकारी सम्बन्ध, पिता', sa: 'अधिकार, कैरियर प्रमुखता, सरकारी सम्बन्ध, पिता', mai: 'अधिकार, कैरियर प्रमुखता, सरकारी सम्बन्ध, पिता', mr: 'अधिकार, कैरियर प्रमुखता, सरकारी सम्बन्ध, पिता', ta: 'அதிகாரம், தொழில் முன்னேற்றம், அரசு தொடர்புகள், தந்தை', te: 'అధికారం, వృత్తి ప్రాముఖ్యత, ప్రభుత్వ సంబంధాలు, తండ్రి', bn: 'কর্তৃত্ব, পেশাগত উন্নতি, সরকারি সম্পর্ক, পিতা', kn: 'ಅಧಿಕಾರ, ವೃತ್ತಿ ಪ್ರಾಮುಖ್ಯತೆ, ಸರ್ಕಾರಿ ಸಂಬಂಧಗಳು, ತಂದೆ', gu: 'સત્તા, કારકિર્દી પ્રગતિ, સરકારી સંબંધો, પિતા' },
    Moon: { en: 'emotions, mother, mental peace, public dealings', hi: 'भावनाएँ, माता, मानसिक शान्ति, सार्वजनिक व्यवहार', sa: 'भावनाएँ, माता, मानसिक शान्ति, सार्वजनिक व्यवहार', mai: 'भावनाएँ, माता, मानसिक शान्ति, सार्वजनिक व्यवहार', mr: 'भावनाएँ, माता, मानसिक शान्ति, सार्वजनिक व्यवहार', ta: 'உணர்வுகள், தாய், மன அமைதி, பொது விவகாரங்கள்', te: 'భావాలు, తల్లి, మానసిక శాంతి, బహిరంగ వ్యవహారాలు', bn: 'আবেগ, মাতা, মানসিক শান্তি, সর্বজনীন কর্মকাণ্ড', kn: 'ಭಾವನೆಗಳು, ತಾಯಿ, ಮಾನಸಿಕ ಶಾಂತಿ, ಸಾರ್ವಜನಿಕ ವ್ಯವಹಾರಗಳು', gu: 'ભાવનાઓ, માતા, માનસિક શાંતિ, જાહેર વ્યવહારો' },
    Mars: { en: 'courage, property, siblings, energy, competition', hi: 'साहस, सम्पत्ति, भाई-बहन, ऊर्जा, प्रतिस्पर्धा', sa: 'साहस, सम्पत्ति, भाई-बहन, ऊर्जा, प्रतिस्पर्धा', mai: 'साहस, सम्पत्ति, भाई-बहन, ऊर्जा, प्रतिस्पर्धा', mr: 'साहस, सम्पत्ति, भाई-बहन, ऊर्जा, प्रतिस्पर्धा', ta: 'தைரியம், சொத்து, உடன்பிறப்புகள், ஆற்றல், போட்டி', te: 'ధైర్యం, ఆస్తి, సోదరులు, శక్తి, పోటీ', bn: 'সাহস, সম্পত্তি, ভাইবোন, শক্তি, প্রতিযোগিতা', kn: 'ಧೈರ್ಯ, ಆಸ್ತಿ, ಸಹೋದರರು, ಶಕ್ತಿ, ಸ್ಪರ್ಧೆ', gu: 'સાહસ, સંપત્તિ, ભાઈ-બહેન, ઊર્જા, સ્પર્ધા' },
    Mercury: { en: 'intellect, communication, business, education', hi: 'बुद्धि, संवाद, व्यापार, शिक्षा', sa: 'बुद्धि, संवाद, व्यापार, शिक्षा', mai: 'बुद्धि, संवाद, व्यापार, शिक्षा', mr: 'बुद्धि, संवाद, व्यापार, शिक्षा', ta: 'புத்தி, தகவல் தொடர்பு, வணிகம், கல்வி', te: 'బుద్ధి, సంభాషణ, వ్యాపారం, విద్య', bn: 'বুদ্ধি, যোগাযোগ, ব্যবসা, শিক্ষা', kn: 'ಬುದ್ಧಿ, ಸಂವಹನ, ವ್ಯಾಪಾರ, ಶಿಕ್ಷಣ', gu: 'બુદ્ધિ, સંવાદ, વ્યાપાર, શિક્ષા' },
    Jupiter: { en: 'wisdom, fortune, children, dharma, expansion', hi: 'ज्ञान, भाग्य, सन्तान, धर्म, विस्तार', sa: 'ज्ञान, भाग्य, सन्तान, धर्म, विस्तार', mai: 'ज्ञान, भाग्य, सन्तान, धर्म, विस्तार', mr: 'ज्ञान, भाग्य, सन्तान, धर्म, विस्तार', ta: 'ஞானம், பாக்கியம், குழந்தைகள், தர்மம், விரிவாக்கம்', te: 'జ్ఞానం, భాగ్యం, సంతానం, ధర్మం, విస్తరణ', bn: 'জ্ঞান, ভাগ্য, সন্তান, ধর্ম, বিস্তার', kn: 'ಜ್ಞಾನ, ಭಾಗ್ಯ, ಮಕ್ಕಳು, ಧರ್ಮ, ವಿಸ್ತರಣೆ', gu: 'જ્ઞાન, ભાગ્ય, સંતાન, ધર્મ, વિસ્તાર' },
    Venus: { en: 'love, luxury, arts, marriage, comfort', hi: 'प्रेम, विलासिता, कला, विवाह, सुख', sa: 'प्रेम, विलासिता, कला, विवाह, सुख', mai: 'प्रेम, विलासिता, कला, विवाह, सुख', mr: 'प्रेम, विलासिता, कला, विवाह, सुख', ta: 'காதல், ஆடம்பரம், கலைகள், திருமணம், சுகம்', te: 'ప్రేమ, విలాసం, కళలు, వివాహం, సుఖం', bn: 'প্রেম, বিলাসিতা, কলা, বিবাহ, সুখ', kn: 'ಪ್ರೇಮ, ವೈಭವ, ಕಲೆಗಳು, ವಿವಾಹ, ಸುಖ', gu: 'પ્રેમ, વૈભવ, કળાઓ, વિવાહ, સુખ' },
    Saturn: { en: 'discipline, karma, longevity, service, hard work', hi: 'अनुशासन, कर्म, दीर्घायु, सेवा, कठिन परिश्रम', sa: 'अनुशासन, कर्म, दीर्घायु, सेवा, कठिन परिश्रम', mai: 'अनुशासन, कर्म, दीर्घायु, सेवा, कठिन परिश्रम', mr: 'अनुशासन, कर्म, दीर्घायु, सेवा, कठिन परिश्रम', ta: 'ஒழுக்கம், கர்மா, ஆயுள், சேவை, கடின உழைப்பு', te: 'క్రమశిక్షణ, కర్మ, ఆయుష్షు, సేవ, కఠిన పరిశ్రమ', bn: 'শৃঙ্খলা, কর্ম, দীর্ঘায়ু, সেবা, কঠোর পরিশ্রম', kn: 'ಶಿಸ್ತು, ಕರ್ಮ, ದೀರ್ಘಾಯುಷ್ಯ, ಸೇವೆ, ಕಠಿಣ ಪರಿಶ್ರಮ', gu: 'શિસ્ત, કર્મ, દીર્ઘાયુ, સેવા, કઠોર પરિશ્રમ' },
    Rahu: { en: 'worldly ambitions, unconventional paths, foreign connections', hi: 'सांसारिक महत्वाकांक्षा, अपरम्परागत मार्ग, विदेशी सम्पर्क', sa: 'सांसारिक महत्वाकांक्षा, अपरम्परागत मार्ग, विदेशी सम्पर्क', mai: 'सांसारिक महत्वाकांक्षा, अपरम्परागत मार्ग, विदेशी सम्पर्क', mr: 'सांसारिक महत्वाकांक्षा, अपरम्परागत मार्ग, विदेशी सम्पर्क', ta: 'உலக லட்சியங்கள், வழக்கத்திற்கு மாறான பாதைகள், வெளிநாட்டு தொடர்புகள்', te: 'లౌకిక ఆశయాలు, అసాంప్రదాయ మార్గాలు, విదేశీ సంబంధాలు', bn: 'পার্থিব উচ্চাকাঙ্ক্ষা, অপ্রচলিত পথ, বিদেশি সম্পর্ক', kn: 'ಲೌಕಿಕ ಮಹತ್ವಾಕಾಂಕ್ಷೆಗಳು, ಅಸಾಂಪ್ರದಾಯಿಕ ಮಾರ್ಗಗಳು, ವಿದೇಶಿ ಸಂಪರ್ಕಗಳು', gu: 'સાંસારિક મહત્ત્વાકાંક્ષાઓ, અપરંપરાગત માર્ગો, વિદેશી સંબંધો' },
    Ketu: { en: 'spiritual growth, detachment, past-life karma, liberation', hi: 'आध्यात्मिक विकास, वैराग्य, पूर्वजन्म कर्म, मोक्ष', sa: 'आध्यात्मिक विकास, वैराग्य, पूर्वजन्म कर्म, मोक्ष', mai: 'आध्यात्मिक विकास, वैराग्य, पूर्वजन्म कर्म, मोक्ष', mr: 'आध्यात्मिक विकास, वैराग्य, पूर्वजन्म कर्म, मोक्ष', ta: 'ஆன்மீக வளர்ச்சி, பற்றின்மை, முற்பிறவி கர்மா, விடுதலை', te: 'ఆధ్యాత్మిక ఎదుగుదల, వైరాగ్యం, పూర్వజన్మ కర్మ, మోక్షం', bn: 'আধ্যাত্মিক বিকাশ, বৈরাগ্য, পূর্বজন্মের কর্ম, মোক্ষ', kn: 'ಆಧ್ಯಾತ್ಮಿಕ ಬೆಳವಣಿಗೆ, ವೈರಾಗ್ಯ, ಪೂರ್ವಜನ್ಮ ಕರ್ಮ, ಮೋಕ್ಷ', gu: 'આધ્યાત્મિક વિકાસ, વૈરાગ્ય, પૂર્વજન્મ કર્મ, મોક્ષ' },
  };

  for (const maha of dashas) {
    const mahaStart = new Date(maha.startDate);
    const mahaEnd = new Date(maha.endDate);

    // Check if Mahadasha transition happens this year
    if (mahaStart >= yearStart && mahaStart <= yearEnd) {
      const effects = planetEffects[maha.planet] || { en: 'new phase of life', hi: 'जीवन का नया चरण', sa: 'जीवन का नया चरण', mai: 'जीवन का नया चरण', mr: 'जीवन का नया चरण', ta: 'வாழ்க்கையின் புதிய கட்டம்', te: 'జీవితంలో కొత్త దశ', bn: 'জীবনের নতুন পর্ব', kn: 'ಜೀವನದ ಹೊಸ ಹಂತ', gu: 'જીવનનો નવો તબક્કો' };
      events.push({
        type: 'dasha_transition',
        title: t(locale,
          `Mahadasha Change: ${maha.planet} period begins`,
          `महादशा परिवर्तन: ${maha.planetName[locale]} दशा आरम्भ`,
          `महादशापरिवर्तनम्: ${maha.planetName.sa} दशा आरभते`
        ),
        description: t(locale,
          `A major Mahadasha transition begins on ${maha.startDate}. The ${maha.planet} Mahadasha activates themes of ${effects.en}. This is a rare and significant shift that will define the next several years. Prepare for a fundamentally new chapter in life.`,
          `${maha.startDate} को एक प्रमुख महादशा परिवर्तन आरम्भ होता है। ${maha.planetName[locale]} महादशा ${effects.hi} के विषय सक्रिय करती है। यह दुर्लभ और महत्वपूर्ण परिवर्तन जीवन के अगले कई वर्ष निर्धारित करेगा।`
        ),
        period: maha.startDate,
        impact: 'mixed',
      });
    }

    // Only scan subperiods of the Mahadasha covering current year
    if (mahaEnd < yearStart || mahaStart > yearEnd) continue;
    if (!maha.subPeriods) continue;

    for (const sub of maha.subPeriods) {
      const subStart = new Date(sub.startDate);
      if (subStart >= yearStart && subStart <= yearEnd) {
        const effects = planetEffects[sub.planet] || { en: 'shifting energies', hi: 'ऊर्जा परिवर्तन', sa: 'ऊर्जा परिवर्तन', mai: 'ऊर्जा परिवर्तन', mr: 'ऊर्जा परिवर्तन', ta: 'மாறும் சக்திகள்', te: 'మారుతున్న శక్తులు', bn: 'পরিবর্তনশীল শক্তি', kn: 'ಬದಲಾಗುತ್ತಿರುವ ಶಕ್ತಿಗಳು', gu: 'બદલાતી ઊર્જાઓ' };
        events.push({
          type: 'dasha_transition',
          title: t(locale,
            `Antardasha: ${maha.planet}-${sub.planet} begins`,
            `अन्तर्दशा: ${maha.planetName[locale]}-${sub.planetName[locale]} आरम्भ`,
            `अन्तर्दशा: ${maha.planetName.sa}-${sub.planetName.sa} आरभते`
          ),
          description: t(locale,
            `On ${sub.startDate}, the ${sub.planet} Antardasha within ${maha.planet} Mahadasha begins, bringing focus to ${effects.en}. This sub-period modulates the main dasha themes with ${sub.planet}'s influence.`,
            `${sub.startDate} को ${maha.planetName[locale]} महादशा में ${sub.planetName[locale]} अन्तर्दशा आरम्भ होती है, ${effects.hi} पर ध्यान केन्द्रित। यह उपकाल मुख्य दशा विषयों को ${sub.planetName[locale]} के प्रभाव से संशोधित करता है।`
          ),
          period: sub.startDate,
          impact: 'mixed',
        });
      }
    }
  }

  return events;
}

/** Build quarterly forecasts combining transit and dasha data */
function buildQuarterlyForecasts(
  events: YearEvent[],
  saturnSign: number,
  jupiterSign: number,
  natalMoonSign: number,
  locale: Locale
): QuarterForecast[] {
  const year = new Date().getFullYear();
  const quarterLabels = [
    { en: `Q1 (Jan–Mar ${year})`, hi: `Q1 (जन–मार्च ${year})`, sa: `Q1 (जनवरी–मार्चः ${year})` },
    { en: `Q2 (Apr–Jun ${year})`, hi: `Q2 (अप्रैल–जून ${year})`, sa: `Q2 (अप्रैलः–जूनः ${year})` },
    { en: `Q3 (Jul–Sep ${year})`, hi: `Q3 (जुला–सित ${year})`, sa: `Q3 (जुलाई–सितम्बरः ${year})` },
    { en: `Q4 (Oct–Dec ${year})`, hi: `Q4 (अक्तू–दिस ${year})`, sa: `Q4 (अक्तूबरः–दिसम्बरः ${year})` },
  ];

  const jupHouse = houseFromSign(jupiterSign, natalMoonSign);
  const satHouse = houseFromSign(saturnSign, natalMoonSign);
  const isSadeSati = satHouse === 12 || satHouse === 1 || satHouse === 2;
  const jupFavorable = [2, 5, 7, 9, 11].includes(jupHouse);

  return quarterLabels.map((label, qi) => {
    // Count events in this quarter
    const qEvents = events.filter(e => {
      if (e.period && (e.period.includes('/') || e.period.includes('-'))) {
        const d = new Date(e.period);
        const m = d.getMonth();
        return Math.floor(m / 3) === qi;
      }
      return true; // "Ongoing" events count for all
    });

    const challengeCount = qEvents.filter(e => e.impact === 'challenging').length;
    const favorableCount = qEvents.filter(e => e.impact === 'favorable').length;

    // Base outlook from transits
    let outlook: QuarterForecast['outlook'];
    if (isSadeSati && !jupFavorable) {
      outlook = qi < 2 ? 'challenging' : 'mixed';
    } else if (jupFavorable && !isSadeSati) {
      outlook = 'favorable';
    } else if (favorableCount > challengeCount) {
      outlook = 'favorable';
    } else if (challengeCount > favorableCount) {
      outlook = 'challenging';
    } else {
      outlook = 'mixed';
    }

    // Vary by quarter for more natural variation
    if (qi === 1 && outlook === 'challenging') outlook = 'mixed'; // Q2 typically mellows
    if (qi === 3 && jupFavorable) outlook = 'favorable'; // Q4 year-end gains

    const summaries: Record<QuarterForecast['outlook'], LocaleText[]> = {
      favorable: [
        { en: 'A promising period with Jupiter\'s blessings. Career and financial prospects look bright. Leverage opportunities that come your way.', hi: 'बृहस्पति के आशीर्वाद से आशाजनक काल। कैरियर और वित्तीय सम्भावनाएँ उज्ज्वल।' },
        { en: 'Growth and expansion define this quarter. Relationships improve, health stabilizes, and creative ventures succeed.', hi: 'विकास और विस्तार इस तिमाही को परिभाषित करते हैं। सम्बन्ध सुधरते हैं, स्वास्थ्य स्थिर।', sa: 'विकास और विस्तार इस तिमाही को परिभाषित करते हैं। सम्बन्ध सुधरते हैं, स्वास्थ्य स्थिर।', mai: 'विकास और विस्तार इस तिमाही को परिभाषित करते हैं। सम्बन्ध सुधरते हैं, स्वास्थ्य स्थिर।', mr: 'विकास और विस्तार इस तिमाही को परिभाषित करते हैं। सम्बन्ध सुधरते हैं, स्वास्थ्य स्थिर।', ta: 'வளர்ச்சியும் விரிவாக்கமும் இந்த காலாண்டை வரையறுக்கின்றன. உறவுகள் மேம்படும், உடல்நலம் நிலைப்படும், படைப்பாற்றல் முயற்சிகள் வெற்றி பெறும்.', te: 'వృద్ధి మరియు విస్తరణ ఈ త్రైమాసికాన్ని నిర్వచిస్తాయి. సంబంధాలు మెరుగుపడతాయి, ఆరోగ్యం స్థిరపడుతుంది, సృజనాత్మక వెంచర్లు విజయవంతమవుతాయి.', bn: 'বৃদ্ধি ও বিস্তার এই প্রান্তিককে সংজ্ঞায়িত করে। সম্পর্ক উন্নত হয়, স্বাস্থ্য স্থিতিশীল হয়, সৃজনশীল উদ্যোগ সফল হয়।', kn: 'ಬೆಳವಣಿಗೆ ಮತ್ತು ವಿಸ್ತರಣೆ ಈ ತ್ರೈಮಾಸಿಕವನ್ನು ವ್ಯಾಖ್ಯಾನಿಸುತ್ತವೆ. ಸಂಬಂಧಗಳು ಸುಧಾರಿಸುತ್ತವೆ, ಆರೋಗ್ಯ ಸ್ಥಿರಗೊಳ್ಳುತ್ತದೆ, ಸೃಜನಶೀಲ ಉದ್ಯಮಗಳು ಯಶಸ್ವಿಯಾಗುತ್ತವೆ.', gu: 'વૃદ્ધિ અને વિસ્તરણ આ ત્રિમાસિકને વ્યાખ્યાયિત કરે છે. સંબંધો સુધરે છે, સ્વાસ્થ્ય સ્થિર થાય છે, સર્જનાત્મક સાહસો સફળ થાય છે.' },
        { en: 'Positive planetary alignments support your goals. A good time for new initiatives, education, and social connections.', hi: 'अनुकूल ग्रह योग आपके लक्ष्यों का समर्थन करते हैं। नई पहल, शिक्षा और सामाजिक सम्पर्क के लिए उत्तम।', sa: 'अनुकूल ग्रह योग आपके लक्ष्यों का समर्थन करते हैं। नई पहल, शिक्षा और सामाजिक सम्पर्क के लिए उत्तम।', mai: 'अनुकूल ग्रह योग आपके लक्ष्यों का समर्थन करते हैं। नई पहल, शिक्षा और सामाजिक सम्पर्क के लिए उत्तम।', mr: 'अनुकूल ग्रह योग आपके लक्ष्यों का समर्थन करते हैं। नई पहल, शिक्षा और सामाजिक सम्पर्क के लिए उत्तम।', ta: 'நேர்மறை கிரக அமைப்புகள் உங்கள் இலக்குகளை ஆதரிக்கின்றன. புதிய முயற்சிகள், கல்வி, சமூக தொடர்புகளுக்கு நல்ல நேரம்.', te: 'సానుకూల గ్రహ స్థానాలు మీ లక్ష్యాలకు మద్దతు ఇస్తాయి. కొత్త కార్యక్రమాలు, విద్య, సామాజిక సంబంధాలకు మంచి సమయం.', bn: 'ইতিবাচক গ্রহ সংযোজন আপনার লক্ষ্যকে সমর্থন করে। নতুন উদ্যোগ, শিক্ষা, সামাজিক সংযোগের জন্য ভালো সময়।', kn: 'ಸಕಾರಾತ್ಮಕ ಗ್ರಹ ಸ್ಥಾನಗಳು ನಿಮ್ಮ ಗುರಿಗಳನ್ನು ಬೆಂಬಲಿಸುತ್ತವೆ. ಹೊಸ ಉಪಕ್ರಮಗಳು, ಶಿಕ್ಷಣ, ಸಾಮಾಜಿಕ ಸಂಪರ್ಕಗಳಿಗೆ ಒಳ್ಳೆಯ ಸಮಯ.', gu: 'સકારાત્મક ગ્રહ ગોઠવણી તમારા લક્ષ્યોને ટેકો આપે છે. નવી પહેલો, શિક્ષણ, સામાજિક જોડાણો માટે સારો સમય.' },
        { en: 'Fortune favors the bold this quarter. Take calculated risks, invest in self-improvement, and embrace change.', hi: 'इस तिमाही में भाग्य साहसी का साथ देता है। सोच-समझकर जोखिम लें और आत्म-सुधार में निवेश करें।', sa: 'इस तिमाही में भाग्य साहसी का साथ देता है। सोच-समझकर जोखिम लें और आत्म-सुधार में निवेश करें।', mai: 'इस तिमाही में भाग्य साहसी का साथ देता है। सोच-समझकर जोखिम लें और आत्म-सुधार में निवेश करें।', mr: 'इस तिमाही में भाग्य साहसी का साथ देता है। सोच-समझकर जोखिम लें और आत्म-सुधार में निवेश करें।', ta: 'இந்த காலாண்டில் தைரியசாலிகளை பாக்கியம் ஆதரிக்கிறது. கணக்கிடப்பட்ட இடர் எடுங்கள், சுய முன்னேற்றத்தில் முதலீடு செய்யுங்கள், மாற்றத்தை ஏற்றுக்கொள்ளுங்கள்.', te: 'ఈ త్రైమాసికంలో భాగ్యం ధైర్యవంతులను ఆదరిస్తుంది. లెక్కగట్టిన రిస్క్‌లు తీసుకోండి, స్వయం-అభివృద్ధిలో పెట్టుబడి పెట్టండి, మార్పును స్వీకరించండి.', bn: 'এই প্রান্তিকে ভাগ্য সাহসীদের সমর্থন করে। পরিমিত ঝুঁকি নিন, আত্মউন্নয়নে বিনিয়োগ করুন, পরিবর্তন গ্রহণ করুন।', kn: 'ಈ ತ್ರೈಮಾಸಿಕದಲ್ಲಿ ಭಾಗ್ಯ ಧೈರ್ಯಶಾಲಿಗಳನ್ನು ಬೆಂಬಲಿಸುತ್ತದೆ. ಲೆಕ್ಕಾಚಾರದ ಅಪಾಯ ತೆಗೆದುಕೊಳ್ಳಿ, ಸ್ವಯಂ-ಸುಧಾರಣೆಯಲ್ಲಿ ಹೂಡಿಕೆ ಮಾಡಿ, ಬದಲಾವಣೆ ಸ್ವೀಕರಿಸಿ.', gu: 'આ ત્રિમાસિકમાં ભાગ્ય હિંમતવાનોને ટેકો આપે છે. ગણતરીપૂર્વક જોખમ લો, સ્વ-સુધારણામાં રોકાણ કરો, પરિવર્તન અપનાવો.' },
      ],
      mixed: [
        { en: 'A balanced period with both opportunities and challenges. Stay adaptable, maintain discipline, and focus on priorities.', hi: 'अवसरों और चुनौतियों दोनों का सन्तुलित काल। अनुकूलनशील रहें, अनुशासन बनाएं।', sa: 'अवसरों और चुनौतियों दोनों का सन्तुलित काल। अनुकूलनशील रहें, अनुशासन बनाएं।', mai: 'अवसरों और चुनौतियों दोनों का सन्तुलित काल। अनुकूलनशील रहें, अनुशासन बनाएं।', mr: 'अवसरों और चुनौतियों दोनों का सन्तुलित काल। अनुकूलनशील रहें, अनुशासन बनाएं।', ta: 'வாய்ப்புகளும் சவால்களும் கொண்ட சமநிலையான காலம். மாற்றத்திற்கு ஏற்ப மாறுங்கள், ஒழுக்கத்தைப் பேணுங்கள், முன்னுரிமைகளில் கவனம் செலுத்துங்கள்.', te: 'అవకాశాలు మరియు సవాళ్లు రెండూ ఉన్న సమతుల్య కాలం. అనుకూలంగా ఉండండి, క్రమశిక్షణ పాటించండి, ప్రాధాన్యతలపై దృష్టి పెట్టండి.', bn: 'সুযোগ ও চ্যালেঞ্জ উভয়ের সমন্বিত কাল। মানিয়ে চলুন, শৃঙ্খলা বজায় রাখুন, অগ্রাধিকারে মনোযোগ দিন।', kn: 'ಅವಕಾಶ ಮತ್ತು ಸವಾಲು ಎರಡೂ ಇರುವ ಸಮತೋಲಿತ ಅವಧಿ. ಹೊಂದಿಕೊಳ್ಳಿ, ಶಿಸ್ತು ಕಾಪಾಡಿ, ಆದ್ಯತೆಗಳ ಮೇಲೆ ಗಮನಹರಿಸಿ.', gu: 'તકો અને પડકારો બંને સાથે સંતુલિત સમયગાળો. અનુકૂળ રહો, શિસ્ત જાળવો, પ્રાથમિકતાઓ પર ધ્યાન કેન્દ્રિત કરો.' },
        { en: 'Some areas progress while others need patience. Professional life may demand extra effort. Health and relationships need conscious attention.', hi: 'कुछ क्षेत्र प्रगति करते हैं जबकि अन्य में धैर्य की आवश्यकता। पेशेवर जीवन में अतिरिक्त प्रयास।', sa: 'कुछ क्षेत्र प्रगति करते हैं जबकि अन्य में धैर्य की आवश्यकता। पेशेवर जीवन में अतिरिक्त प्रयास।', mai: 'कुछ क्षेत्र प्रगति करते हैं जबकि अन्य में धैर्य की आवश्यकता। पेशेवर जीवन में अतिरिक्त प्रयास।', mr: 'कुछ क्षेत्र प्रगति करते हैं जबकि अन्य में धैर्य की आवश्यकता। पेशेवर जीवन में अतिरिक्त प्रयास।', ta: 'சில பகுதிகள் முன்னேறும் போது மற்றவைக்கு பொறுமை தேவை. தொழில் வாழ்க்கை கூடுதல் முயற்சி கோரலாம். உடல்நலம் மற்றும் உறவுகளுக்கு நனவான கவனிப்பு தேவை.', te: 'కొన్ని రంగాలు పురోగమిస్తాయి, ఇతరాలకు ఓపిక అవసరం. వృత్తి జీవితం అదనపు ప్రయత్నం డిమాండ్ చేయవచ్చు. ఆరోగ్యం మరియు సంబంధాలకు చైతన్యవంతమైన శ్రద్ధ అవసరం.', bn: 'কিছু ক্ষেত্রে অগ্রগতি হলেও অন্যগুলোতে ধৈর্য দরকার। পেশাগত জীবন অতিরিক্ত প্রচেষ্টা দাবি করতে পারে। স্বাস্থ্য ও সম্পর্কে সচেতন মনোযোগ প্রয়োজন।', kn: 'ಕೆಲವು ಕ್ಷೇತ್ರಗಳಲ್ಲಿ ಪ್ರಗತಿ ಆದರೆ ಇತರರಿಗೆ ತಾಳ್ಮೆ ಬೇಕು. ವೃತ್ತಿ ಜೀವನ ಹೆಚ್ಚುವರಿ ಪ್ರಯತ್ನ ಕೇಳಬಹುದು. ಆರೋಗ್ಯ ಮತ್ತು ಸಂಬಂಧಗಳಿಗೆ ಜಾಗೃತ ಗಮನ ಬೇಕು.', gu: 'કેટલાક ક્ષેત્રો આગળ વધે છે જ્યારે બીજાને ધીરજ જોઈએ. વ્યાવસાયિક જીવન વધારાના પ્રયત્નની માંગ કરી શકે. સ્વાસ્થ્ય અને સંબંધોને સભાન ધ્યાનની જરૂર છે.' },
        { en: 'Transit energies pull in different directions. Prioritize what matters most and postpone non-essential decisions.', hi: 'गोचर ऊर्जाएँ विभिन्न दिशाओं में खींचती हैं। सबसे महत्वपूर्ण को प्राथमिकता दें।', sa: 'गोचर ऊर्जाएँ विभिन्न दिशाओं में खींचती हैं। सबसे महत्वपूर्ण को प्राथमिकता दें।', mai: 'गोचर ऊर्जाएँ विभिन्न दिशाओं में खींचती हैं। सबसे महत्वपूर्ण को प्राथमिकता दें।', mr: 'गोचर ऊर्जाएँ विभिन्न दिशाओं में खींचती हैं। सबसे महत्वपूर्ण को प्राथमिकता दें।', ta: 'கோள்பெயர்ச்சி சக்திகள் வெவ்வேறு திசைகளில் இழுக்கின்றன. மிக முக்கியமானதை முன்னுரிமை வையுங்கள், அத்தியாவசியமற்ற முடிவுகளை ஒத்திவையுங்கள்.', te: 'గోచార శక్తులు వేర్వేరు దిశల్లో లాగుతాయి. అత్యంత ముఖ్యమైనదానికి ప్రాధాన్యత ఇవ్వండి, అనవసరమైన నిర్ణయాలు వాయిదా వేయండి.', bn: 'গোচর শক্তি ভিন্ন দিকে টানছে। সবচেয়ে গুরুত্বপূর্ণটিকে অগ্রাধিকার দিন, অপ্রয়োজনীয় সিদ্ধান্ত পিছিয়ে দিন।', kn: 'ಗೋಚಾರ ಶಕ್ತಿಗಳು ವಿವಿಧ ದಿಕ್ಕುಗಳಲ್ಲಿ ಎಳೆಯುತ್ತವೆ. ಅತ್ಯಂತ ಮಹತ್ವದ್ದಕ್ಕೆ ಆದ್ಯತೆ ನೀಡಿ, ಅನಗತ್ಯ ನಿರ್ಧಾರಗಳನ್ನು ಮುಂದೂಡಿ.', gu: 'ગોચર ઊર્જાઓ વિવિધ દિશાઓમાં ખેંચે છે. સૌથી મહત્ત્વનું પ્રાથમિકતા આપો, બિનજરૂરી નિર્ણયો મુલતવી રાખો.' },
        { en: 'A period of recalibration. Review goals, adjust strategies, and consolidate gains from previous quarters.', hi: 'पुनर्अंशांकन का काल। लक्ष्यों की समीक्षा करें, रणनीतियाँ समायोजित करें।', sa: 'पुनर्अंशांकन का काल। लक्ष्यों की समीक्षा करें, रणनीतियाँ समायोजित करें।', mai: 'पुनर्अंशांकन का काल। लक्ष्यों की समीक्षा करें, रणनीतियाँ समायोजित करें।', mr: 'पुनर्अंशांकन का काल। लक्ष्यों की समीक्षा करें, रणनीतियाँ समायोजित करें।', ta: 'மறுசீரமைப்பு காலம். இலக்குகளை மறுபரிசீலனை செய்யுங்கள், உத்திகளை சரிசெய்யுங்கள், முந்தைய காலாண்டு லாபங்களை ஒருங்கிணையுங்கள்.', te: 'పునర్వ్యవస్థీకరణ కాలం. లక్ష్యాలను సమీక్షించండి, వ్యూహాలను సర్దుబాటు చేయండి, గత త్రైమాసికాల లాభాలను సుస్థిరం చేయండి.', bn: 'পুনর্বিন্যাসের সময়। লক্ষ্য পর্যালোচনা করুন, কৌশল সমন্বয় করুন, পূর্ববর্তী প্রান্তিকের অর্জন সুসংহত করুন।', kn: 'ಮರುಹೊಂದಾಣಿಕೆ ಅವಧಿ. ಗುರಿಗಳನ್ನು ಪರಿಶೀಲಿಸಿ, ತಂತ್ರಗಳನ್ನು ಸರಿಹೊಂದಿಸಿ, ಹಿಂದಿನ ತ್ರೈಮಾಸಿಕ ಲಾಭಗಳನ್ನು ಬಲಪಡಿಸಿ.', gu: 'પુનઃસંતુલનનો સમયગાળો. લક્ષ્યોની સમીક્ષા કરો, વ્યૂહરચનાઓ સમાયોજિત કરો, અગાઉના ત્રિમાસિક લાભોને મજબૂત કરો.' },
      ],
      challenging: [
        { en: 'Saturn\'s influence demands patience and perseverance. Avoid impulsive decisions. Focus on responsibilities and long-term goals.', hi: 'शनि का प्रभाव धैर्य और दृढ़ता की माँग करता है। आवेगपूर्ण निर्णयों से बचें।' },
        { en: 'A testing period that builds character. Health needs attention, finances require caution. Spiritual practices provide relief.', hi: 'चरित्र निर्माण का परीक्षण काल। स्वास्थ्य पर ध्यान, वित्त में सावधानी। आध्यात्मिक अभ्यास राहत देते हैं।', sa: 'चरित्र निर्माण का परीक्षण काल। स्वास्थ्य पर ध्यान, वित्त में सावधानी। आध्यात्मिक अभ्यास राहत देते हैं।', mai: 'चरित्र निर्माण का परीक्षण काल। स्वास्थ्य पर ध्यान, वित्त में सावधानी। आध्यात्मिक अभ्यास राहत देते हैं।', mr: 'चरित्र निर्माण का परीक्षण काल। स्वास्थ्य पर ध्यान, वित्त में सावधानी। आध्यात्मिक अभ्यास राहत देते हैं।', ta: 'குணத்தை வளர்க்கும் சோதனை காலம். உடல்நலம் கவனிப்பு தேவை, நிதிக்கு எச்சரிக்கை தேவை. ஆன்மீக பயிற்சிகள் நிவாரணம் அளிக்கும்.', te: 'వ్యక్తిత్వాన్ని నిర్మించే పరీక్షా కాలం. ఆరోగ్యానికి శ్రద్ధ అవసరం, ఆర్థిక విషయాల్లో జాగ్రత్త అవసరం. ఆధ్యాత్మిక సాధనలు ఉపశమనం ఇస్తాయి.', bn: 'চরিত্র গড়ার পরীক্ষামূলক সময়। স্বাস্থ্যে মনোযোগ দিন, অর্থে সতর্কতা প্রয়োজন। আধ্যাত্মিক অনুশীলন স্বস্তি দেয়।', kn: 'ವ್ಯಕ್ತಿತ್ವ ನಿರ್ಮಿಸುವ ಪರೀಕ್ಷಾ ಅವಧಿ. ಆರೋಗ್ಯಕ್ಕೆ ಗಮನ ಬೇಕು, ಹಣಕಾಸಿನಲ್ಲಿ ಎಚ್ಚರಿಕೆ ಅಗತ್ಯ. ಆಧ್ಯಾತ್ಮಿಕ ಅಭ್ಯಾಸಗಳು ಪರಿಹಾರ ನೀಡುತ್ತವೆ.', gu: 'ચારિત્ર્ય ઘડતો પરીક્ષાનો સમયગાળો. સ્વાસ્થ્ય પર ધ્યાન જરૂરી, નાણાંમાં સાવધાની જરૂરી. આધ્યાત્મિક સાધના રાહત આપે છે.' },
        { en: 'Obstacles may arise in career and relationships. Stay grounded, seek wise counsel, and avoid confrontations.', hi: 'कैरियर और सम्बन्धों में बाधाएँ आ सकती हैं। स्थिर रहें, बुद्धिमान परामर्श लें।', sa: 'कैरियर और सम्बन्धों में बाधाएँ आ सकती हैं। स्थिर रहें, बुद्धिमान परामर्श लें।', mai: 'कैरियर और सम्बन्धों में बाधाएँ आ सकती हैं। स्थिर रहें, बुद्धिमान परामर्श लें।', mr: 'कैरियर और सम्बन्धों में बाधाएँ आ सकती हैं। स्थिर रहें, बुद्धिमान परामर्श लें।', ta: 'தொழில் மற்றும் உறவுகளில் தடைகள் எழலாம். நிலைத்திருங்கள், புத்திசாலித்தனமான ஆலோசனை பெறுங்கள், மோதல்களைத் தவிர்க்கவும்.', te: 'వృత్తి మరియు సంబంధాలలో అడ్డంకులు తలెత్తవచ్చు. భూమిపై నిలబడండి, తెలివైన సలహా కోరండి, ఘర్షణలు నివారించండి.', bn: 'কর্মজীবন ও সম্পর্কে বাধা আসতে পারে। স্থির থাকুন, বুদ্ধিমান পরামর্শ নিন, সংঘর্ষ এড়িয়ে চলুন।', kn: 'ವೃತ್ತಿ ಮತ್ತು ಸಂಬಂಧಗಳಲ್ಲಿ ಅಡ್ಡಿಗಳು ಉದ್ಭವಿಸಬಹುದು. ಸ್ಥಿರವಾಗಿರಿ, ಬುದ್ಧಿವಂತ ಸಲಹೆ ಪಡೆಯಿರಿ, ಘರ್ಷಣೆ ತಪ್ಪಿಸಿ.', gu: 'કારકિર્દી અને સંબંધોમાં અવરોધો આવી શકે. સ્થિર રહો, સમજદાર સલાહ લો, મુકાબલો ટાળો.' },
        { en: 'Difficult but transformative. Every challenge carries a hidden lesson. Embrace austerity and emerge stronger.', hi: 'कठिन किन्तु परिवर्तनकारी। प्रत्येक चुनौती में छिपा सबक। तपस्या अपनाएँ और मजबूत बनें।', sa: 'कठिन किन्तु परिवर्तनकारी। प्रत्येक चुनौती में छिपा सबक। तपस्या अपनाएँ और मजबूत बनें।', mai: 'कठिन किन्तु परिवर्तनकारी। प्रत्येक चुनौती में छिपा सबक। तपस्या अपनाएँ और मजबूत बनें।', mr: 'कठिन किन्तु परिवर्तनकारी। प्रत्येक चुनौती में छिपा सबक। तपस्या अपनाएँ और मजबूत बनें।', ta: 'கடினமான ஆனால் உருமாற்றமளிக்கும். ஒவ்வொரு சவாலிலும் மறைந்த பாடம் உள்ளது. கடுமையை ஏற்றுக்கொண்டு வலிமையாக வெளிவாருங்கள்.', te: 'కఠినం కానీ పరివర్తనకరం. ప్రతి సవాలులో దాగిన పాఠం ఉంది. కాఠిన్యాన్ని స్వీకరించి బలంగా బయటపడండి.', bn: 'কঠিন কিন্তু রূপান্তরকারী। প্রতিটি চ্যালেঞ্জে লুকানো শিক্ষা আছে। কঠোরতা গ্রহণ করুন এবং শক্তিশালী হয়ে উঠুন।', kn: 'ಕಠಿಣ ಆದರೆ ಪರಿವರ್ತನಕಾರಿ. ಪ್ರತಿ ಸವಾಲಿನಲ್ಲಿ ಅಡಗಿರುವ ಪಾಠ ಇದೆ. ಕಾಠಿಣ್ಯವನ್ನು ಸ್ವೀಕರಿಸಿ ಬಲಶಾಲಿಯಾಗಿ ಹೊರಬನ್ನಿ.', gu: 'કઠિન પણ રૂપાંતરકારી. દરેક પડકારમાં છુપાયેલ પાઠ છે. કઠોરતાને અપનાવો અને મજબૂત બનીને બહાર આવો.' },
      ],
    };

    const pool = summaries[outlook];
    const summary = pool[qi % pool.length];

    return {
      quarter: t(locale, label.en, label.hi, label.sa),
      outlook,
      summary: t(locale, summary.en, summary.hi || ""),
    };
  });
}

/** Generate overall year summary */
function generateOverview(events: YearEvent[], quarters: QuarterForecast[], locale: Locale): string {
  const favorableQ = quarters.filter(q => q.outlook === 'favorable').length;
  const challengingQ = quarters.filter(q => q.outlook === 'challenging').length;
  const hasSadeSati = events.some(e => e.type === 'sade_sati');
  const hasJupiterFavorable = events.some(e => e.type === 'jupiter_transit' && e.impact === 'favorable');

  if (hasSadeSati && !hasJupiterFavorable) {
    return t(locale,
      `This year carries the weight of Sade Sati, demanding patience, discipline, and inner strength. While challenges in career, health, or relationships may test your resolve, this is fundamentally a period of karmic maturation. Saturn teaches through restriction — embrace the lessons. ${favorableQ > 0 ? 'Some quarters show relief and progress, so pace yourself wisely.' : 'Consistent spiritual practice and service will provide the greatest relief.'}`,
      `इस वर्ष साढ़े साती का भार है, जो धैर्य, अनुशासन और आन्तरिक शक्ति की माँग करता है। कैरियर, स्वास्थ्य या सम्बन्धों में चुनौतियाँ आपके संकल्प की परीक्षा ले सकती हैं, किन्तु यह मूलतः कार्मिक परिपक्वता का काल है। शनि प्रतिबन्ध के माध्यम से सिखाता है — पाठ स्वीकार करें।`
    );
  }

  if (hasJupiterFavorable && !hasSadeSati) {
    return t(locale,
      `Jupiter's favorable transit blesses this year with growth, wisdom, and expanding opportunities. ${favorableQ >= 3 ? 'Most quarters look promising — this is an excellent year for career advancement, education, relationships, and spiritual growth.' : 'Several quarters show strong potential for progress.'} Leverage Jupiter's benevolence by acting with dharma and generosity. Knowledge-based pursuits and ethical endeavors will yield the greatest returns.`,
      `बृहस्पति का अनुकूल गोचर इस वर्ष को विकास, ज्ञान और बढ़ते अवसरों से आशीर्वादित करता है। ${favorableQ >= 3 ? 'अधिकांश तिमाहियाँ आशाजनक — कैरियर उन्नति, शिक्षा, सम्बन्ध और आध्यात्मिक विकास के लिए उत्कृष्ट वर्ष।' : 'कई तिमाहियाँ प्रगति की प्रबल सम्भावना दर्शाती हैं।'} धर्म और उदारता से कार्य करके बृहस्पति की कृपा का लाभ उठाएँ।`
    );
  }

  // Mixed year
  const mixedQ = 4 - favorableQ - challengingQ;
  const enParts: string[] = [];
  if (favorableQ > 0) enParts.push(`${favorableQ} quarter${favorableQ > 1 ? 's' : ''} look${favorableQ === 1 ? 's' : ''} favorable`);
  if (challengingQ > 0) enParts.push(`${challengingQ} may require extra effort`);
  if (mixedQ > 0 && favorableQ === 0 && challengingQ === 0) enParts.push('all quarters show a blend of opportunities and challenges');
  else if (mixedQ > 0) enParts.push(`${mixedQ} show${mixedQ === 1 ? 's' : ''} a mix of both`);
  const enSummary = enParts.join(', while ');

  const hiParts: string[] = [];
  if (favorableQ > 0) hiParts.push(`${favorableQ} तिमाही अनुकूल`);
  if (challengingQ > 0) hiParts.push(`${challengingQ} में अतिरिक्त प्रयास आवश्यक`);
  if (mixedQ > 0 && favorableQ === 0 && challengingQ === 0) hiParts.push('सभी तिमाहियों में अवसरों और चुनौतियों का मिश्रण');
  else if (mixedQ > 0) hiParts.push(`${mixedQ} में दोनों का मिश्रण`);
  const hiSummary = hiParts.join(', जबकि ');

  return t(locale,
    `This year presents a blend of planetary influences requiring both initiative and caution. ${enSummary}. Transit dynamics between major planets create a year of transformation and growth through diverse experiences. Balance ambition with wisdom, and action with patience.`,
    `इस वर्ष ग्रहीय प्रभावों का मिश्रण है जिसमें पहल और सावधानी दोनों आवश्यक हैं। ${hiSummary}। प्रमुख ग्रहों के गोचर विविध अनुभवों से परिवर्तन और विकास का वर्ष बनाते हैं। महत्वाकांक्षा और ज्ञान में, क्रिया और धैर्य में सन्तुलन बनाएं।`
  );
}

/** Generate key advice for the year */
function generateKeyAdvice(events: YearEvent[], locale: Locale): string {
  const hasSadeSati = events.some(e => e.type === 'sade_sati');
  const jupiterEvent = events.find(e => e.type === 'jupiter_transit');
  const hasDashaChange = events.some(e => e.type === 'dasha_transition' && e.title.includes('Mahadasha'));

  if (hasSadeSati) {
    return t(locale,
      'Key guidance: Prioritize health, maintain financial discipline, and deepen spiritual practice. Avoid major speculative risks. Serve the elderly and practice gratitude. Saturn rewards those who embrace responsibility with humility. This challenging period will forge lasting strength.',
      'मुख्य मार्गदर्शन: स्वास्थ्य को प्राथमिकता दें, वित्तीय अनुशासन बनाएं, और आध्यात्मिक अभ्यास गहन करें। प्रमुख सट्टा जोखिमों से बचें। वृद्धजनों की सेवा करें और कृतज्ञता का अभ्यास करें।',
      'मुख्यमार्गदर्शनम्: स्वास्थ्यं प्राथमिकतया रक्षतु, वित्तीयानुशासनं पालयतु, आध्यात्मिकाभ्यासं गाढं करोतु।'
    );
  }

  if (jupiterEvent?.impact === 'favorable') {
    return t(locale,
      'Key guidance: This is a year to expand — pursue higher education, travel, invest in growth, and strengthen relationships. Jupiter\'s blessings favor dharmic action, teaching, and mentoring. Share your knowledge generously. Financial planning now yields long-term wealth.',
      'मुख्य मार्गदर्शन: यह विस्तार का वर्ष है — उच्च शिक्षा, यात्रा, विकास में निवेश और सम्बन्ध मजबूत करें। बृहस्पति का आशीर्वाद धार्मिक कार्य, शिक्षण और मार्गदर्शन को अनुकूल। ज्ञान उदारता से बाँटें।',
      'मुख्यमार्गदर्शनम्: विस्तारस्य वर्षम् एतत् — उच्चशिक्षा, यात्रा, विकासे निवेशः सम्बन्धानां सुदृढीकरणं च।'
    );
  }

  if (hasDashaChange) {
    return t(locale,
      'Key guidance: A major dasha transition this year signals a turning point. Embrace change gracefully, update your goals to align with the new planetary period, and maintain flexibility. The transition period (2-3 months around the change) requires extra awareness.',
      'मुख्य मार्गदर्शन: इस वर्ष एक प्रमुख दशा परिवर्तन एक मोड़ का संकेत है। परिवर्तन को सहजता से स्वीकारें, नए ग्रह काल के अनुसार अपने लक्ष्य अद्यतन करें, और लचीलापन बनाएं।',
      'मुख्यमार्गदर्शनम्: अस्मिन् वर्षे प्रमुखदशापरिवर्तनं परिवर्तनबिन्दुं सूचयति।'
    );
  }

  return t(locale,
    'Key guidance: Maintain a balanced approach throughout the year. Invest in self-improvement, strengthen family bonds, and pursue your career goals with steady determination. Regular spiritual practice and healthy routines will be your greatest assets.',
    'मुख्य मार्गदर्शन: वर्ष भर सन्तुलित दृष्टिकोण बनाएं। आत्म-सुधार में निवेश करें, पारिवारिक बन्धन मजबूत करें, और स्थिर दृढ़ संकल्प से कैरियर लक्ष्यों का अनुसरण करें।',
    'मुख्यमार्गदर्शनम्: वर्षपर्यन्तं सन्तुलितदृष्टिकोणं पालयतु। आत्मसुधारे निवेशयतु, पारिवारिकबन्धनानि सुदृढीकरोतु।'
  );
}

// ===== MAIN EXPORT =====

export function generateYearPredictions(
  kundali: KundaliData,
  locale: Locale
): YearPredictionSection {
  const year = new Date().getFullYear();

  // Get natal Moon sign
  const moonPlanet = kundali.planets.find(p => p.planet.id === 1);
  const natalMoonSign = moonPlanet?.sign || 1;
  const ascSign = kundali.ascendant.sign;

  // Get current transit positions
  const transits = getCurrentTransits();

  // Collect all events
  const events: YearEvent[] = [];

  // A. Sade Sati — use pre-computed data when available, fall back to transit-based detection
  if (kundali.sadeSati?.isActive) {
    const ss = kundali.sadeSati;
    const phaseMap: Record<string, string> = { rising: t(locale, 'Rising Phase', 'चढ़ाव चरण'), peak: t(locale, 'Peak Phase', 'चरम चरण'), setting: t(locale, 'Setting Phase', 'उतार चरण') };
    const phaseLabel = phaseMap[ss.currentPhase || ''] || ss.currentPhase || '';
    events.push({
      type: 'sade_sati',
      title: t(locale, `Sade Sati — ${phaseLabel}`, `साढ़े साती — ${phaseLabel}`),
      period: t(locale, 'Ongoing', 'जारी'),
      impact: 'challenging',
      description: t(locale,
        `Saturn is transiting ${ss.currentPhase === 'rising' ? '12th' : ss.currentPhase === 'peak' ? '1st (over Moon)' : '2nd'} from your natal Moon. ${ss.overallIntensity ? `Intensity: ${ss.overallIntensity}/10.` : ''} This is a period of karmic restructuring requiring patience and discipline.`,
        `शनि आपके चन्द्रमा से ${ss.currentPhase === 'rising' ? '12वें' : ss.currentPhase === 'peak' ? '1ले (चन्द्र पर)' : '2रे'} भाव में गोचर कर रहा है। धैर्य और अनुशासन का समय।`),
      remedies: t(locale,
        'Recite Shani Chalisa on Saturdays. Donate black sesame and mustard oil. Visit Shani temples. Practice patience and serve elders.',
        'शनिवार को शनि चालीसा पाठ। काले तिल और सरसों तेल दान। शनि मन्दिर। धैर्य और वृद्धजन सेवा।'),
    });
  } else {
    const sadeSatiEvent = detectSadeSati(transits.saturnSign, natalMoonSign, locale);
    if (sadeSatiEvent) events.push(sadeSatiEvent);
  }

  // B. Jupiter transit
  const jupiterEvent = analyzeJupiterTransit(transits.jupiterSign, natalMoonSign, ascSign, locale);
  events.push(jupiterEvent);

  // C. Rahu-Ketu transit
  const rahuKetuEvent = analyzeRahuKetuTransit(transits.rahuSign, transits.ketuSign, ascSign, natalMoonSign, locale);
  events.push(rahuKetuEvent);

  // D. Dasha transitions
  const dashaEvents = findDashaTransitions(kundali.dashas, locale);
  events.push(...dashaEvents);

  // E. Quarterly forecasts
  const quarters = buildQuarterlyForecasts(events, transits.saturnSign, transits.jupiterSign, natalMoonSign, locale);

  // F. Overview & advice
  const overview = generateOverview(events, quarters, locale);
  const keyAdvice = generateKeyAdvice(events, locale);

  return {
    year,
    overview,
    events,
    quarters,
    keyAdvice,
  };
}
