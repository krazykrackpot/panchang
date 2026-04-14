import { tl } from '@/lib/utils/trilingual';
import { lt } from '@/lib/learn/translations';
import type { LocaleText } from '@/lib/learn/translations';
import L from '@/messages/learn/contributions-calculus.json';
import { Link } from '@/lib/i18n/navigation';
import type { Locale } from '@/types/panchang';
import { ShareRow } from '@/components/ui/ShareButton';
import { isDevanagariLocale } from '@/lib/utils/locale-fonts';

const SCHOOL_CHAIN = [
  { name: 'Madhava', years: 'c. 1340–1425 CE', contrib: { en: 'π series, sin/cos/arctan series, correction terms', hi: 'π श्रेणी, sin/cos/arctan श्रेणी, सुधार पद', sa: 'π श्रेणी, sin/cos/arctan श्रेणी, सुधार पद', mai: 'π श्रेणी, sin/cos/arctan श्रेणी, सुधार पद', mr: 'π श्रेणी, sin/cos/arctan श्रेणी, सुधार पद', ta: 'π தொடர், sin/cos/arctan தொடர், திருத்தச் சொற்கள்', te: 'π శ్రేణి, sin/cos/arctan శ్రేణి, సవరణ పదాలు', bn: 'π ধারা, sin/cos/arctan ধারা, সংশোধন পদ', kn: 'π ಸರಣಿ, sin/cos/arctan ಸರಣಿ, ತಿದ್ದುಪಡಿ ಪದಗಳು', gu: 'π શ્રેણી, sin/cos/arctan શ્રેણી, સુધારા પદ' } },
  { name: 'Parameshvara', years: 'c. 1380–1460 CE', contrib: { en: 'Drigganita system, eclipse observations, mean motion corrections', hi: 'दृग्गणित प्रणाली, ग्रहण अवलोकन, मध्यम गति सुधार', sa: 'दृग्गणित प्रणाली, ग्रहण अवलोकन, मध्यम गति सुधार', mai: 'दृग्गणित प्रणाली, ग्रहण अवलोकन, मध्यम गति सुधार', mr: 'दृग्गणित प्रणाली, ग्रहण अवलोकन, मध्यम गति सुधार', ta: 'திருக்கணித முறை, கிரகண அவதானிப்புகள், சராசரி இயக்கத் திருத்தங்கள்', te: 'దృగ్గణిత వ్యవస్థ, గ్రహణ పరిశీలనలు, సగటు చలన సవరణలు', bn: 'দৃগ্গণিত পদ্ধতি, গ্রহণ পর্যবেক্ষণ, গড় গতি সংশোধন', kn: 'ದೃಗ್ಗಣಿತ ವ್ಯವಸ್ಥೆ, ಗ್ರಹಣ ಅವಲೋಕನಗಳು, ಸರಾಸರಿ ಚಲನೆ ತಿದ್ದುಪಡಿಗಳು', gu: 'દૃગ્ગણિત પદ્ધતિ, ગ્રહણ નિરીક્ષણો, સરેરાશ ગતિ સુધારા' } },
  { name: 'Nilakantha Somayaji', years: 'c. 1444–1544 CE', contrib: { en: 'Tantrasangraha (1501) — revised planetary model, partial heliocentrism', hi: 'तंत्रसंग्रह (1501) — संशोधित ग्रहीय मॉडल, आंशिक सौर-केंद्रवाद', sa: 'तंत्रसंग्रह (1501) — संशोधित ग्रहीय मॉडल, आंशिक सौर-केंद्रवाद', mai: 'तंत्रसंग्रह (1501) — संशोधित ग्रहीय मॉडल, आंशिक सौर-केंद्रवाद', mr: 'तंत्रसंग्रह (1501) — संशोधित ग्रहीय मॉडल, आंशिक सौर-केंद्रवाद', ta: 'தந்திரசங்கிரகம் (1501) — திருத்திய கிரக மாதிரி, பகுதி சூரிய மையவாதம்', te: 'తంత్రసంగ్రహం (1501) — సవరించిన గ్రహ నమూనా, పాక్షిక సూర్యకేంద్రవాదం', bn: 'তন্ত্রসংগ্রহ (১৫০১) — সংশোধিত গ্রহ মডেল, আংশিক সূর্যকেন্দ্রিকতা', kn: 'ತಂತ್ರಸಂಗ್ರಹ (1501) — ಪರಿಷ್ಕೃತ ಗ್ರಹ ಮಾದರಿ, ಭಾಗಶಃ ಸೂರ್ಯಕೇಂದ್ರಿತ', gu: 'તંત્રસંગ્રહ (1501) — સુધારેલ ગ્રહ મોડેલ, આંશિક સૂર્યકેન્દ્રવાદ' } },
  { name: 'Jyeshthadeva', years: 'c. 1500–1575 CE', contrib: { en: 'Yuktibhasha — full proofs of all Kerala results in Malayalam', hi: 'युक्तिभाषा — मलयालम में सभी केरल परिणामों के पूर्ण प्रमाण', sa: 'युक्तिभाषा — मलयालम में सभी केरल परिणामों के पूर्ण प्रमाण', mai: 'युक्तिभाषा — मलयालम में सभी केरल परिणामों के पूर्ण प्रमाण', mr: 'युक्तिभाषा — मलयालम में सभी केरल परिणामों के पूर्ण प्रमाण', ta: 'யுக்திபாஷா — கேரள முடிவுகளின் முழு நிரூபணங்கள் மலையாளத்தில்', te: 'యుక్తిభాష — కేరళ ఫలితాల పూర్తి నిరూపణలు మలయాళంలో', bn: 'যুক্তিভাষা — কেরলের সমস্ত ফলাফলের পূর্ণ প্রমাণ মালায়ালমে', kn: 'ಯುಕ್ತಿಭಾಷಾ — ಕೇರಳ ಫಲಿತಾಂಶಗಳ ಪೂರ್ಣ ಸಾಕ್ಷ್ಯಗಳು ಮಲಯಾಳಂನಲ್ಲಿ', gu: 'યુક્તિભાષા — કેરળના તમામ પરિણામોના સંપૂર્ણ પુરાવા મલયાલમમાં' } },
  { name: 'Citrabhanu', years: 'c. 1475–1550 CE', contrib: { en: 'Algebraic solutions to pairs of equations', hi: 'समीकरणों के युग्मों के बीजगणितीय हल', sa: 'समीकरणों के युग्मों के बीजगणितीय हल', mai: 'समीकरणों के युग्मों के बीजगणितीय हल', mr: 'समीकरणों के युग्मों के बीजगणितीय हल', ta: 'சமன்பாட்டு இணைகளின் இயற்கணிதத் தீர்வுகள்', te: 'సమీకరణ జంటలకు బీజగణిత పరిష్కారాలు', bn: 'সমীকরণ জোড়ার বীজগাণিতিক সমাধান', kn: 'ಸಮೀಕರಣ ಜೋಡಿಗಳ ಬೀಜಗಣಿತ ಪರಿಹಾರಗಳು', gu: 'સમીકરણ યુગ્મોના બીજગણિતીય ઉકેલ' } },
  { name: 'Sankara Variyar', years: 'c. 1500–1556 CE', contrib: { en: 'Commentaries synthesizing the full Kerala tradition', hi: 'पूर्ण केरल परंपरा को संश्लेषित करने वाली टिप्पणियाँ', sa: 'पूर्ण केरल परंपरा को संश्लेषित करने वाली टिप्पणियाँ', mai: 'पूर्ण केरल परंपरा को संश्लेषित करने वाली टिप्पणियाँ', mr: 'पूर्ण केरल परंपरा को संश्लेषित करने वाली टिप्पणियाँ', ta: 'முழு கேரள மரபை ஒருங்கிணைக்கும் வ்யாக்யானங்கள்', te: 'సంపూర్ణ కేరళ సంప్రదాయాన్ని సంశ్లేషించే వ్యాఖ్యానాలు', bn: 'সম্পূর্ণ কেরল ঐতিহ্যকে সংশ্লেষিত করা ভাষ্য', kn: 'ಸಂಪೂರ್ಣ ಕೇರಳ ಸಂಪ್ರದಾಯವನ್ನು ಸಂಶ್ಲೇಷಿಸುವ ವ್ಯಾಖ್ಯಾನಗಳು', gu: 'સમગ્ર કેરળ પરંપરાનું સંશ્લેષણ કરતી ટીકાઓ' } },
];

const SERIES_COMPARISON = [
  {
    name: 'π series',
    formula: 'π/4 = 1 − 1/3 + 1/5 − 1/7 + ...',
    india: { who: 'Madhava', when: 'c. 1375 CE' },
    europe: { who: 'Leibniz', when: '1676 CE' },
    gap: '~300 years',
  },
  {
    name: 'Sine series',
    formula: 'sin x = x − x³/3! + x⁵/5! − ...',
    india: { who: 'Madhava', when: 'c. 1400 CE' },
    europe: { who: 'Taylor / Maclaurin', when: '1715–1742 CE' },
    gap: '~315–342 years',
  },
  {
    name: 'Cosine series',
    formula: 'cos x = 1 − x²/2! + x⁴/4! − ...',
    india: { who: 'Madhava', when: 'c. 1400 CE' },
    europe: { who: 'Taylor / Maclaurin', when: '1715–1742 CE' },
    gap: '~315–342 years',
  },
  {
    name: 'Arctangent series',
    formula: 'arctan x = x − x³/3 + x⁵/5 − ...',
    india: { who: 'Madhava', when: 'c. 1400 CE' },
    europe: { who: 'James Gregory', when: '1671 CE' },
    gap: '~271 years',
  },
];

const KEY_TEXTS = [
  {
    title: 'Tantrasangraha (तंत्रसंग्रह)',
    author: 'Nilakantha Somayaji',
    year: '1501 CE',
    lang: 'Sanskrit',
    desc: { en: 'Revised planetary model with partial heliocentric framework. First accurate model of Mercury and Venus orbits.', hi: 'आंशिक सौर-केंद्रित ढाँचे के साथ संशोधित ग्रहीय मॉडल। बुध और शुक्र कक्षाओं का पहला सटीक मॉडल।', sa: 'आंशिक सौर-केंद्रित ढाँचे के साथ संशोधित ग्रहीय मॉडल। बुध और शुक्र कक्षाओं का पहला सटीक मॉडल।', mai: 'आंशिक सौर-केंद्रित ढाँचे के साथ संशोधित ग्रहीय मॉडल। बुध और शुक्र कक्षाओं का पहला सटीक मॉडल।', mr: 'आंशिक सौर-केंद्रित ढाँचे के साथ संशोधित ग्रहीय मॉडल। बुध और शुक्र कक्षाओं का पहला सटीक मॉडल।', ta: 'பகுதி சூரிய மையக் கட்டமைப்புடன் திருத்திய கிரக மாதிரி. புதன் மற்றும் சுக்கிரன் சுற்றுப்பாதைகளின் முதல் துல்லியமான மாதிரி.', te: 'పాక్షిక సూర్యకేంద్ర చట్రంతో సవరించిన గ్రహ నమూనా. బుధ మరియు శుక్ర కక్ష్యల మొదటి ఖచ్చితమైన నమూనా.', bn: 'আংশিক সূর্যকেন্দ্রিক কাঠামোসহ সংশোধিত গ্রহ মডেল। বুধ ও শুক্র কক্ষপথের প্রথম নির্ভুল মডেল।', kn: 'ಭಾಗಶಃ ಸೂರ್ಯಕೇಂದ್ರಿತ ಚೌಕಟ್ಟಿನೊಂದಿಗೆ ಪರಿಷ್ಕೃತ ಗ್ರಹ ಮಾದರಿ. ಬುಧ ಮತ್ತು ಶುಕ್ರ ಕಕ್ಷೆಗಳ ಮೊದಲ ನಿಖರ ಮಾದರಿ.', gu: 'આંશિક સૂર્યકેન્દ્રી માળખા સાથે સુધારેલ ગ્રહ મોડેલ. બુધ અને શુક્ર ભ્રમણકક્ષાનું પ્રથમ ચોક્કસ મોડેલ.' },
  },
  {
    title: 'Yuktibhasha (युक्तिभाषा)',
    author: 'Jyeshthadeva',
    year: '~1530 CE',
    lang: 'Malayalam',
    desc: { en: 'Contains full proofs of the infinite series for π and trig functions. First mathematics text to provide proofs in a vernacular language.', hi: 'π और त्रिकोणमितीय कार्यों के लिए अनंत श्रेणी के पूर्ण प्रमाण। एक स्थानीय भाषा में प्रमाण प्रदान करने वाला पहला गणित ग्रंथ।', sa: 'π और त्रिकोणमितीय कार्यों के लिए अनंत श्रेणी के पूर्ण प्रमाण। एक स्थानीय भाषा में प्रमाण प्रदान करने वाला पहला गणित ग्रंथ।', mai: 'π और त्रिकोणमितीय कार्यों के लिए अनंत श्रेणी के पूर्ण प्रमाण। एक स्थानीय भाषा में प्रमाण प्रदान करने वाला पहला गणित ग्रंथ।', mr: 'π और त्रिकोणमितीय कार्यों के लिए अनंत श्रेणी के पूर्ण प्रमाण। एक स्थानीय भाषा में प्रमाण प्रदान करने वाला पहला गणित ग्रंथ।', ta: 'π மற்றும் முக்கோணவியல் செயல்பாடுகளுக்கான எல்லையற்ற தொடர்களின் முழு நிரூபணங்களைக் கொண்டுள்ளது. உள்நாட்டு மொழியில் நிரூபணங்கள் வழங்கிய முதல் கணித நூல்.', te: 'π మరియు త్రికోణమితి ఫంక్షన్ల అనంత శ్రేణుల పూర్తి నిరూపణలు కలిగి ఉంది. స్థానిక భాషలో నిరూపణలు అందించిన మొదటి గణిత గ్రంథం.', bn: 'π এবং ত্রিকোণমিতি ফাংশনের অসীম ধারার পূর্ণ প্রমাণ ধারণ করে। স্থানীয় ভাষায় প্রমাণ প্রদানকারী প্রথম গণিত গ্রন্থ।', kn: 'π ಮತ್ತು ತ್ರಿಕೋನಮಿತಿ ಕಾರ್ಯಗಳ ಅನಂತ ಸರಣಿಗಳ ಪೂರ್ಣ ಸಾಕ್ಷ್ಯಗಳನ್ನು ಒಳಗೊಂಡಿದೆ. ಸ್ಥಳೀಯ ಭಾಷೆಯಲ್ಲಿ ಸಾಕ್ಷ್ಯಗಳನ್ನು ಒದಗಿಸಿದ ಮೊದಲ ಗಣಿತ ಗ್ರಂಥ.', gu: 'π અને ત્રિકોણમિતિ ફંક્શન માટે અનંત શ્રેણીના સંપૂર્ણ પુરાવા ધરાવે છે. સ્થાનિક ભાષામાં પુરાવા આપનાર પ્રથમ ગણિત ગ્રંથ.' },
  },
  {
    title: 'Sadratnamala (सद्रत्नमाला)',
    author: 'Sankara Varman',
    year: '1819 CE',
    lang: 'Sanskrit',
    desc: { en: 'Last major Kerala text. Contains series for π accurate to 17 decimal places — computed before modern computers.', hi: 'अंतिम प्रमुख केरल ग्रंथ। 17 दशमलव स्थानों तक सटीक π की श्रेणी — आधुनिक कंप्यूटर से पहले गणित।', sa: 'अंतिम प्रमुख केरल ग्रंथ। 17 दशमलव स्थानों तक सटीक π की श्रेणी — आधुनिक कंप्यूटर से पहले गणित।', mai: 'अंतिम प्रमुख केरल ग्रंथ। 17 दशमलव स्थानों तक सटीक π की श्रेणी — आधुनिक कंप्यूटर से पहले गणित।', mr: 'अंतिम प्रमुख केरल ग्रंथ। 17 दशमलव स्थानों तक सटीक π की श्रेणी — आधुनिक कंप्यूटर से पहले गणित।', ta: 'கடைசி முக்கிய கேரள நூல். 17 தசம இடங்கள் வரை துல்லியமான π தொடர் — நவீன கணினிகளுக்கு முன் கணக்கிடப்பட்டது.', te: 'చివరి ప్రధాన కేరళ గ్రంథం. 17 దశాంశ స్థానాల వరకు ఖచ్చితమైన π శ్రేణి — ఆధునిక కంప్యూటర్ల కంటే ముందు గణించబడింది.', bn: 'শেষ প্রধান কেরল গ্রন্থ। ১৭ দশমিক স্থান পর্যন্ত সঠিক π ধারা — আধুনিক কম্পিউটারের আগে গণনা করা হয়েছিল।', kn: 'ಕೊನೆಯ ಪ್ರಮುಖ ಕೇರಳ ಗ್ರಂಥ. 17 ದಶಮಾಂಶ ಸ್ಥಾನಗಳಿಗೆ ನಿಖರವಾದ π ಸರಣಿ — ಆಧುನಿಕ ಕಂಪ್ಯೂಟರ್‌ಗಳ ಮೊದಲು ಲೆಕ್ಕ ಹಾಕಲಾಗಿದೆ.', gu: 'છેલ્લો મુખ્ય કેરળ ગ્રંથ. 17 દશાંશ સ્થાનો સુધી ચોક્કસ π શ્રેણી — આધુનિક કમ્પ્યુટર્સ પહેલાં ગણતરી કરવામાં આવી.' },
  },
];

export default async function CalculusPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params as { locale: Locale };
  const isHi = isDevanagariLocale(locale);
  const hf = isHi ? { fontFamily: 'var(--font-devanagari-heading)' } : { fontFamily: 'var(--font-heading)' };
  const t = (key: string) => lt((L as unknown as Record<string, LocaleText>)[key], locale);

  return (
    <div className="space-y-10">

      {/* ── Hero ─────────────────────────────────────────────────── */}
      <div>
        <h2 className="text-3xl font-bold text-gold-gradient mb-3" style={hf}>{t('title')}</h2>
        <p className="text-text-secondary text-sm leading-relaxed max-w-3xl">{t('subtitle')}</p>
        <div className="flex justify-center mt-4">
          <ShareRow pageTitle={t('title')} locale={locale} />
        </div>
      </div>

      {/* ── Section 1: Who Was Madhava ───────────────────────────── */}
      <div
        className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-2xl p-6"
      >
        <h3 className="text-gold-light font-bold text-xl mb-4" style={hf}>{t('s1Title')}</h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-4">{t('s1Body')}</p>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { label: { en: 'Born', hi: 'जन्म', sa: 'जन्म', mai: 'जन्म', mr: 'जन्म', ta: 'பிறப்பு', te: 'జన్మ', bn: 'জন্ম', kn: 'ಜನನ', gu: 'જન્મ' }, value: 'c. 1340 CE' },
            { label: { en: 'Died', hi: 'निधन', sa: 'निधन', mai: 'निधन', mr: 'निधन', ta: 'மறைவு', te: 'మరణం', bn: 'মৃত্যু', kn: 'ಮರಣ', gu: 'મૃત્યુ' }, value: 'c. 1425 CE' },
            { label: { en: 'Location', hi: 'स्थान', sa: 'स्थान', mai: 'स्थान', mr: 'स्थान', ta: 'இடம்', te: 'ప్రదేశం', bn: 'স্থান', kn: 'ಸ್ಥಳ', gu: 'સ્થળ' }, value: 'Sangamagrama, Kerala' },
            { label: { en: 'School founded', hi: 'स्कूल स्थापित', sa: 'स्कूल स्थापित', mai: 'स्कूल स्थापित', mr: 'स्कूल स्थापित', ta: 'பள்ளி நிறுவப்பட்டது', te: 'పాఠశాల స్థాపన', bn: 'বিদ্যালয় স্থাপিত', kn: 'ಶಾಲೆ ಸ್ಥಾಪನೆ', gu: 'શાળા સ્થાપના' }, value: '~1375 CE' },
          ].map((stat, i) => (
            <div key={i} className="p-3 rounded-xl bg-gold-primary/8 border border-gold-primary/15 text-center">
              <div className="text-gold-light text-sm font-bold">{stat.value}</div>
              <div className="text-text-secondary text-xs mt-1">{lt(stat.label as LocaleText, locale)}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Section 2: π Series ──────────────────────────────────── */}
      <div
        className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-2xl p-6"
      >
        <h3 className="text-gold-light font-bold text-xl mb-4" style={hf}>{t('s2Title')}</h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-5">{t('s2Body')}</p>

        {/* Formula display */}
        <div className="p-5 rounded-xl bg-gold-primary/8 border border-gold-primary/20 mb-4 text-center">
          <p className="text-xs text-text-secondary mb-2">{tl({ en: "Madhava's π Series (~1375 CE)", hi: "माधव की π श्रेणी (~1375 CE)", sa: "माधव की π श्रेणी (~1375 CE)" }, locale)}</p>
          <p className="text-gold-light text-lg font-mono">π/4 = 1 − 1/3 + 1/5 − 1/7 + 1/9 − ...</p>
          <p className="text-text-secondary text-xs mt-2">{tl({ en: 'Called "Leibniz formula" in the West, 1676 CE', hi: 'पश्चिम में "लाइबनिज फॉर्मूला" कहा जाता है, 1676 CE', sa: 'पश्चिम में "लाइबनिज फॉर्मूला" कहा जाता है, 1676 CE' }, locale)}</p>
        </div>

        <div className="p-4 rounded-xl bg-gold-primary/6 border-l-4 border-gold-primary/50">
          <p className="text-text-secondary text-xs font-semibold mb-1">{tl({ en: 'Yuktibhasha (~1530 CE)', hi: 'युक्तिभाषा (Yuktibhasha), ~1530 CE', sa: 'युक्तिभाषा (Yuktibhasha), ~1530 CE' }, locale)}</p>
          <p className="text-text-secondary text-xs">{t('s2Source')}</p>
        </div>
      </div>

      {/* ── Priority Comparison Table ────────────────────────────── */}
      <div
        className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-2xl p-6"
      >
        <h3 className="text-gold-light font-bold text-xl mb-4" style={hf}>{t('s3Title')}</h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-5">{t('s3Body')}</p>

        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-gold-primary/15">
                <th className="text-left text-gold-light py-2 pr-3">{tl({ en: 'Series', hi: 'श्रेणी', sa: 'श्रेणी' }, locale)}</th>
                <th className="text-left text-gold-light py-2 pr-3">{tl({ en: 'India', hi: 'भारत में', sa: 'भारत में' }, locale)}</th>
                <th className="text-left text-gold-light py-2 pr-3">{tl({ en: 'Europe', hi: 'यूरोप में', sa: 'यूरोप में' }, locale)}</th>
                <th className="text-right text-gold-light py-2">{tl({ en: 'Gap', hi: 'अंतर', sa: 'अंतर' }, locale)}</th>
              </tr>
            </thead>
            <tbody>
              {SERIES_COMPARISON.map((row, i) => (
                <tr key={i} className={`border-b border-gold-primary/8 ${i % 2 === 0 ? 'bg-white/[0.01]' : ''}`}>
                  <td className="py-2 pr-3">
                    <div className="text-text-primary font-semibold">{row.name}</div>
                    <div className="text-text-secondary font-mono text-xs mt-0.5">{row.formula}</div>
                  </td>
                  <td className="py-2 pr-3">
                    <div className="text-emerald-400 font-semibold">{row.india.who}</div>
                    <div className="text-text-secondary">{row.india.when}</div>
                  </td>
                  <td className="py-2 pr-3">
                    <div className="text-text-secondary">{row.europe.who}</div>
                    <div className="text-text-secondary">{row.europe.when}</div>
                  </td>
                  <td className="text-right py-2 text-amber-400 font-bold">{row.gap}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Section 4: The School Chain ─────────────────────────── */}
      <div
        className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-2xl p-6"
      >
        <h3 className="text-gold-light font-bold text-xl mb-5" style={hf}>{t('s4Title')}</h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-5">{t('s4Body')}</p>

        <div className="space-y-3">
          {SCHOOL_CHAIN.map((person, i) => (
            <div key={i} className="flex gap-3 items-start p-3 rounded-xl bg-white/[0.02] border border-gold-primary/8">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gold-primary/20 border border-gold-primary/30 flex items-center justify-center text-gold-light font-bold text-sm">
                {i + 1}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-text-primary font-semibold text-sm">{person.name}</span>
                  <span className="text-text-secondary text-xs">{person.years}</span>
                </div>
                <div className="text-text-secondary text-xs mt-1">{lt(person.contrib as LocaleText, locale)}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Section 5: Transmission ─────────────────────────────── */}
      <div
        className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-2xl p-6"
      >
        <h3 className="text-gold-light font-bold text-xl mb-4" style={hf}>{t('s5Title')}</h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-4">{t('s5Body')}</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 rounded-xl bg-amber-500/8 border border-amber-500/20">
            <p className="text-amber-300 font-semibold text-xs mb-2">{tl({ en: 'Possible Transmission Evidence', hi: 'संभावित संचरण साक्ष्य', sa: 'संभावित संचरण साक्ष्य' }, locale)}</p>
            <ul className="text-text-secondary text-xs space-y-1">
              <li>• {tl({ en: 'Jesuit presence in Kerala from ~1500 CE', hi: '1500 CE से केरल में जेसुइट उपस्थिति', sa: '1500 CE से केरल में जेसुइट उपस्थिति' }, locale)}</li>
              <li>• {tl({ en: 'Jesuit College at Cochin — Indian manuscripts', hi: 'कोचीन जेसुइट कॉलेज — भारतीय पांडुलिपियाँ', sa: 'कोचीन जेसुइट कॉलेज — भारतीय पांडुलिपियाँ' }, locale)}</li>
              <li>• {tl({ en: 'Mersenne ↔ India Jesuit correspondence', hi: 'मेर्सेन ↔ भारत जेसुइट पत्राचार', sa: 'मेर्सेन ↔ भारत जेसुइट पत्राचार' }, locale)}</li>
            </ul>
          </div>
          <div className="p-4 rounded-xl bg-emerald-500/8 border border-emerald-500/20">
            <p className="text-emerald-300 font-semibold text-xs mb-2">{tl({ en: 'What Is Undisputed', hi: 'जो निर्विवाद है', sa: 'जो निर्विवाद है' }, locale)}</p>
            <ul className="text-text-secondary text-xs space-y-1">
              <li>• {tl({ en: "Madhava's results are 250–350 years earlier", hi: "माधव के परिणाम — 250-350 वर्ष पहले", sa: "माधव के परिणाम — 250-350 वर्ष पहले" }, locale)}</li>
              <li>• {tl({ en: 'Kerala texts contain full proofs', hi: 'केरल ग्रंथों में पूर्ण प्रमाण हैं', sa: 'केरल ग्रंथों में पूर्ण प्रमाण हैं' }, locale)}</li>
              <li>• {tl({ en: 'Priority of discovery is Indian', hi: 'खोज की प्राथमिकता भारतीय है', sa: 'खोज की प्राथमिकता भारतीय है' }, locale)}</li>
            </ul>
          </div>
        </div>
      </div>

      {/* ── Section 6: App Connection ──────────────────────────── */}
      <div
        className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-2xl p-6"
      >
        <h3 className="text-gold-light font-bold text-xl mb-4" style={hf}>{t('s6Title')}</h3>
        <p className="text-text-secondary text-sm leading-relaxed">{t('s6Body')}</p>
      </div>

      {/* ── Section 7: Key Texts ─────────────────────────────────── */}
      <div
        className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-2xl p-6"
      >
        <h3 className="text-gold-light font-bold text-xl mb-5" style={hf}>{t('s7Title')}</h3>
        <div className="space-y-4">
          {KEY_TEXTS.map((text, i) => (
            <div key={i} className="p-4 rounded-xl bg-white/[0.03] border border-gold-primary/12">
              <div className="flex items-start justify-between gap-2 flex-wrap mb-2">
                <div>
                  <span className="text-gold-light font-semibold text-sm">{text.title}</span>
                  <span className="text-text-secondary text-xs ml-2">— {text.author}</span>
                </div>
                <div className="flex gap-2">
                  <span className="text-xs px-2 py-0.5 rounded-full bg-gold-primary/15 text-gold-light">{text.year}</span>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-white/5 text-text-secondary">{text.lang}</span>
                </div>
              </div>
              <p className="text-text-secondary text-xs leading-relaxed">{lt(text.desc as LocaleText, locale)}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── Navigation ──────────────────────────────────────────── */}
      <div
        className="flex flex-col sm:flex-row gap-3 pt-4"
      >
        <Link href="/learn" className="text-text-secondary hover:text-gold-light text-sm transition-colors">
          {t('backLink')}
        </Link>
        <div className="flex gap-3 sm:ml-auto">
          <Link href="/learn/contributions/earth-rotation" className="px-4 py-2 rounded-xl bg-gold-primary/10 border border-gold-primary/15 text-gold-light text-sm hover:bg-gold-primary/20 transition-colors">
            ← {t('prevPage')}
          </Link>
          <Link href="/learn/contributions/speed-of-light" className="px-4 py-2 rounded-xl bg-gold-primary/15 border border-gold-primary/20 text-gold-light text-sm hover:bg-gold-primary/25 transition-colors">
            {t('nextPage')} →
          </Link>
        </div>
      </div>

    </div>
  );
}
