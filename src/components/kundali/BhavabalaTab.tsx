'use client';

import { useMemo } from 'react';
import { tl } from '@/lib/utils/trilingual';
import { GrahaIconById } from '@/components/icons/GrahaIcons';
import type { BhavaBalaResult } from '@/lib/kundali/bhavabala';
import type { Locale, LocaleText } from '@/types/panchang';

/* ------------------------------------------------------------------ */
/*  Static data — hoisted to module level per codebase performance rule */
/* ------------------------------------------------------------------ */

const HOUSE_NAMES: Record<number, LocaleText> = {
  1: { en: 'Self / Lagna', hi: 'तनु / लग्न', sa: 'तनु / लग्न', mai: 'तनु / लग्न', mr: 'तनु / लग्न', ta: 'சுயம் / லக்னம்', te: 'ఆత్మ / లగ్నం', bn: 'আত্ম / লগ্ন', kn: 'ಸ್ವಯಂ / ಲಗ್ನ', gu: 'સ્વ / લગ્ન' },
  2: { en: 'Wealth / Dhana', hi: 'धन', sa: 'धन', mai: 'धन', mr: 'धन', ta: 'செல்வம் / தனம்', te: 'ధనం / ధన', bn: 'ধন / ধন', kn: 'ಧನ / ಧನ', gu: 'ધન / ધન' },
  3: { en: 'Siblings / Sahaja', hi: 'सहज', sa: 'सहज', mai: 'सहज', mr: 'सहज', ta: 'உடன்பிறப்பு / சகஜம்', te: 'తోబుట్టువులు / సహజ', bn: 'ভাইবোন / সহজ', kn: 'ಒಡಹುಟ್ಟಿದವರು / ಸಹಜ', gu: 'ભાઈ-બહેન / સહજ' },
  4: { en: 'Mother / Sukha', hi: 'सुख / मातृ', sa: 'सुख / मातृ', mai: 'सुख / मातृ', mr: 'सुख / मातृ', ta: 'தாய் / சுகம்', te: 'తల్లి / సుఖ', bn: 'মাতা / সুখ', kn: 'ತಾಯಿ / ಸುಖ', gu: 'માતા / સુખ' },
  5: { en: 'Children / Putra', hi: 'पुत्र / संतान', sa: 'पुत्र / संतान', mai: 'पुत्र / संतान', mr: 'पुत्र / संतान', ta: 'குழந்தைகள் / புத்திரம்', te: 'సంతానం / పుత్ర', bn: 'সন্তান / পুত্র', kn: 'ಮಕ್ಕಳು / ಪುತ್ರ', gu: 'સંતાન / પુત્ર' },
  6: { en: 'Enemies / Ripu', hi: 'रिपु / शत्रु', sa: 'रिपु / शत्रु', mai: 'रिपु / शत्रु', mr: 'रिपु / शत्रु', ta: 'எதிரிகள் / ரிபு', te: 'శత్రువులు / రిపు', bn: 'শত্রু / রিপু', kn: 'ಶತ್ರು / ರಿಪು', gu: 'શત્રુ / રિપુ' },
  7: { en: 'Spouse / Yuvati', hi: 'युवती / जाया', sa: 'युवती / जाया', mai: 'युवती / जाया', mr: 'युवती / जाया', ta: 'துணைவர் / யுவதி', te: 'భాగస్వామి / యువతి', bn: 'স্ত্রী / যুবতী', kn: 'ಸಂಗಾತಿ / ಯುವತಿ', gu: 'જીવનસાથી / યુવતી' },
  8: { en: 'Longevity / Randhra', hi: 'रन्ध्र / आयु', sa: 'रन्ध्र / आयु', mai: 'रन्ध्र / आयु', mr: 'रन्ध्र / आयु', ta: 'ஆயுள் / ரந்திரம்', te: 'ఆయుష్షు / రంధ్ర', bn: 'দীর্ঘায়ু / রন্ধ্র', kn: 'ಆಯುಷ್ಯ / ರಂಧ್ರ', gu: 'આયુષ્ય / રંધ્ર' },
  9: { en: 'Fortune / Dharma', hi: 'धर्म / भाग्य', sa: 'धर्म / भाग्य', mai: 'धर्म / भाग्य', mr: 'धर्म / भाग्य', ta: 'பாக்கியம் / தர்மம்', te: 'భాగ్యం / ధర్మ', bn: 'ভাগ্য / ধর্ম', kn: 'ಭಾಗ್ಯ / ಧರ್ಮ', gu: 'ભાગ્ય / ધર્મ' },
  10: { en: 'Career / Karma', hi: 'कर्म / राज्य', sa: 'कर्म / राज्य', mai: 'कर्म / राज्य', mr: 'कर्म / राज्य', ta: 'தொழில் / கர்மம்', te: 'వృత్తి / కర్మ', bn: 'কর্মজীবন / কর্ম', kn: 'ವೃತ್ತಿ / ಕರ್ಮ', gu: 'કારકિર્દી / કર્મ' },
  11: { en: 'Gains / Labha', hi: 'लाभ', sa: 'लाभ', mai: 'लाभ', mr: 'लाभ', ta: 'லாபம் / லாபம்', te: 'లాభం / లాభ', bn: 'লাভ / লাভ', kn: 'ಲಾಭ / ಲಾಭ', gu: 'લાભ / લાભ' },
  12: { en: 'Loss / Vyaya', hi: 'व्यय', sa: 'व्यय', mai: 'व्यय', mr: 'व्यय', ta: 'நஷ்டம் / வியயம்', te: 'నష్టం / వ్యయ', bn: 'ক্ষতি / ব্যয়', kn: 'ನಷ್ಟ / ವ್ಯಯ', gu: 'ખોટ / વ્યય' },
};

/** Short life-theme descriptions per house (used for interpretive commentary) */
const HOUSE_THEMES_EN: Record<number, { theme: string; strong: string; weak: string; question: string }> = {
  1: {
    theme: 'personality, physical body, and overall life direction',
    strong: 'Strong self-identity and physical vitality. You project confidence naturally and people notice your presence.',
    weak: 'Self-expression may not come easily. You might struggle to assert yourself or feel unsure about your identity.',
    question: 'Do people frequently describe you as having a strong personality or commanding presence?',
  },
  2: {
    theme: 'wealth, family values, speech, and accumulated resources',
    strong: 'Financial accumulation comes relatively easily. You likely have a way with words and strong family bonds.',
    weak: 'Building wealth may require extra effort. Speech patterns or family dynamics could be sources of friction.',
    question: 'Has saving money or building financial stability felt natural, or has it been an uphill battle?',
  },
  3: {
    theme: 'courage, siblings, communication, and short travels',
    strong: 'You have natural courage and initiative. Sibling relationships are supportive, and you communicate with impact.',
    weak: 'Taking bold action may feel difficult. Communication or sibling dynamics could be challenging areas.',
    question: 'When faced with a tough decision, do you tend to act boldly or hesitate and overthink?',
  },
  4: {
    theme: 'home, mother, emotional peace, property, and education',
    strong: 'Domestic happiness and emotional security are strong. Property matters tend to go well for you.',
    weak: 'Finding inner peace or settling into a stable home may be a lifelong work-in-progress.',
    question: 'Do you feel emotionally grounded at home, or does domestic life often feel unsettled?',
  },
  5: {
    theme: 'children, creativity, intelligence, romance, and past-life merit',
    strong: 'Creative expression flows naturally. Romance, children, and intellectual pursuits bring joy.',
    weak: 'Creative blocks or challenges with children/romance may surface. Past-life karma needs active working through.',
    question: 'Do creative ideas come easily to you, or do you often feel blocked when trying to express yourself?',
  },
  6: {
    theme: 'enemies, health challenges, debts, and daily service',
    strong: 'You overcome obstacles and enemies effectively. Strong capacity to handle competition and health rebounds quickly.',
    weak: 'Health issues, debts, or workplace conflicts may be persistent. Preventive care is especially important.',
    question: 'When rivals or obstacles appear, do you tend to overcome them decisively or get bogged down?',
  },
  7: {
    theme: 'marriage, partnerships, business alliances, and public dealings',
    strong: 'Partnerships and marriage bring fulfillment. You attract supportive allies and business collaborators.',
    weak: 'Relationships require more conscious effort. Partnerships may bring lessons through difficulty.',
    question: 'Do your close partnerships (romantic or business) generally uplift you, or do they tend to drain your energy?',
  },
  8: {
    theme: 'longevity, transformation, sudden events, inheritance, and occult',
    strong: 'Strong resilience and regenerative capacity. Inheritance or insurance matters favor you. Deep intuition.',
    weak: 'Sudden upheavals or health crises may surface unexpectedly. Transformation comes through difficult passages.',
    question: 'Have you experienced major life transformations that ultimately made you stronger, even if painful at first?',
  },
  9: {
    theme: 'fortune, higher learning, father, spirituality, and long journeys',
    strong: 'Luck and fortune favor you. Higher education, spiritual growth, and long-distance travel bring expansion.',
    weak: 'Fortune may feel elusive. Spiritual growth or higher education could require more persistence than expected.',
    question: 'Do you feel generally lucky in life, or does it seem like good fortune often passes you by?',
  },
  10: {
    theme: 'career, public reputation, authority, and life achievement',
    strong: 'Career success comes naturally. You gain recognition and can handle positions of authority well.',
    weak: 'Professional achievements require sustained effort. Public recognition may be slow in coming.',
    question: 'Has career advancement felt relatively smooth, or have you faced repeated obstacles in your professional life?',
  },
  11: {
    theme: 'gains, income, social networks, elder siblings, and fulfilled desires',
    strong: 'Your social network is a genuine asset. Income streams multiply, and desires manifest relatively easily.',
    weak: 'Gains and income growth may be slow. Social networks could feel thin or unreliable.',
    question: 'Do your friendships and social connections often lead to real opportunities, or do they remain surface-level?',
  },
  12: {
    theme: 'losses, spirituality, foreign lands, bed pleasures, and liberation',
    strong: 'Strong spiritual inclination and success abroad. Expenses are well-managed, sleep is restful.',
    weak: 'Unexpected expenses or feelings of isolation may recur. Sleep quality or foreign ventures may be problematic.',
    question: 'Do you find peace in solitude and spiritual practice, or does being alone tend to make you anxious?',
  },
};

const HOUSE_THEMES_HI: Record<number, { theme: string; strong: string; weak: string; question: string }> = {
  1: {
    theme: 'व्यक्तित्व, शारीरिक स्वास्थ्य और जीवन की दिशा',
    strong: 'मजबूत आत्मविश्वास और शारीरिक ऊर्जा। आप स्वाभाविक रूप से प्रभावशाली हैं।',
    weak: 'आत्म-अभिव्यक्ति कठिन हो सकती है। पहचान को लेकर अनिश्चितता हो सकती है।',
    question: 'क्या लोग आपको प्रभावशाली व्यक्तित्व वाला बताते हैं?',
  },
  2: {
    theme: 'धन, परिवार, वाणी और संचित संसाधन',
    strong: 'धन-संचय सहज है। वाणी प्रभावशाली और पारिवारिक बंधन मजबूत हैं।',
    weak: 'धन-निर्माण में अतिरिक्त प्रयास लग सकता है। वाणी या पारिवारिक गतिशीलता चुनौतीपूर्ण हो सकती है।',
    question: 'क्या बचत और वित्तीय स्थिरता स्वाभाविक रही है, या यह कठिन रहा है?',
  },
  3: {
    theme: 'साहस, भाई-बहन, संवाद और छोटी यात्राएँ',
    strong: 'स्वाभाविक साहस और पहल क्षमता। भाई-बहन सहायक हैं।',
    weak: 'निर्णायक कार्रवाई कठिन लग सकती है। संवाद या भाई-बहन संबंध चुनौतीपूर्ण हो सकते हैं।',
    question: 'कठिन निर्णय में क्या आप साहसपूर्वक कार्य करते हैं या अधिक सोचते हैं?',
  },
  4: {
    theme: 'घर, माता, भावनात्मक शांति, संपत्ति और शिक्षा',
    strong: 'घरेलू सुख और भावनात्मक सुरक्षा मजबूत है। संपत्ति मामले अनुकूल रहते हैं।',
    weak: 'आंतरिक शांति या स्थिर घर पाना जीवनभर की यात्रा हो सकती है।',
    question: 'क्या आप घर में भावनात्मक रूप से स्थिर महसूस करते हैं?',
  },
  5: {
    theme: 'संतान, रचनात्मकता, बुद्धि, प्रेम और पूर्वजन्म के पुण्य',
    strong: 'रचनात्मक अभिव्यक्ति सहज है। प्रेम, संतान और बौद्धिक कार्य आनंददायक हैं।',
    weak: 'रचनात्मक अवरोध या संतान/प्रेम में चुनौतियाँ आ सकती हैं।',
    question: 'क्या रचनात्मक विचार सहज आते हैं या अवरुद्ध महसूस होता है?',
  },
  6: {
    theme: 'शत्रु, स्वास्थ्य चुनौतियाँ, ऋण और सेवा',
    strong: 'बाधाओं और शत्रुओं पर प्रभावी विजय। स्वास्थ्य शीघ्र ठीक होता है।',
    weak: 'स्वास्थ्य, ऋण या कार्यस्थल संघर्ष लगातार हो सकते हैं।',
    question: 'क्या प्रतिद्वंद्वी या बाधाएँ आने पर आप निर्णायक रूप से जीतते हैं?',
  },
  7: {
    theme: 'विवाह, साझेदारी, व्यापारिक गठबंधन',
    strong: 'साझेदारी और विवाह संतोषजनक हैं। सहायक सहयोगी मिलते हैं।',
    weak: 'संबंधों में अधिक सचेत प्रयास चाहिए। साझेदारी कठिनाइयों से सिखाती है।',
    question: 'क्या आपकी साझेदारियाँ आपको उत्थान देती हैं या ऊर्जा खींचती हैं?',
  },
  8: {
    theme: 'दीर्घायु, परिवर्तन, अचानक घटनाएँ, विरासत',
    strong: 'मजबूत लचीलापन और पुनर्जनन क्षमता। विरासत अनुकूल है।',
    weak: 'अचानक उथल-पुथल या स्वास्थ्य संकट अप्रत्याशित रूप से आ सकते हैं।',
    question: 'क्या जीवन के बड़े परिवर्तनों ने आपको मजबूत बनाया है?',
  },
  9: {
    theme: 'भाग्य, उच्च शिक्षा, पिता, आध्यात्मिकता',
    strong: 'भाग्य और सौभाग्य अनुकूल हैं। उच्च शिक्षा और आध्यात्मिक विकास विस्तारकारी हैं।',
    weak: 'भाग्य कभी-कभी दूर लगता है। आध्यात्मिक विकास में अधिक धैर्य चाहिए।',
    question: 'क्या आप जीवन में आम तौर पर भाग्यशाली महसूस करते हैं?',
  },
  10: {
    theme: 'करियर, प्रतिष्ठा, अधिकार और उपलब्धि',
    strong: 'करियर सफलता सहज है। मान्यता मिलती है और अधिकार संभालना आसान है।',
    weak: 'व्यावसायिक उपलब्धियों में निरंतर प्रयास चाहिए। मान्यता धीमी हो सकती है।',
    question: 'क्या करियर में प्रगति सहज रही है या बार-बार बाधाएँ आई हैं?',
  },
  11: {
    theme: 'लाभ, आय, सामाजिक नेटवर्क और पूर्ण इच्छाएँ',
    strong: 'सामाजिक नेटवर्क वास्तविक संपत्ति है। आय बढ़ती है और इच्छाएँ पूर्ण होती हैं।',
    weak: 'लाभ और आय वृद्धि धीमी हो सकती है। सामाजिक नेटवर्क कमजोर लग सकता है।',
    question: 'क्या आपकी मित्रताएँ वास्तविक अवसरों की ओर ले जाती हैं?',
  },
  12: {
    theme: 'व्यय, आध्यात्मिकता, विदेश, शय्या सुख और मोक्ष',
    strong: 'मजबूत आध्यात्मिक झुकाव और विदेश में सफलता। व्यय नियंत्रित है।',
    weak: 'अप्रत्याशित व्यय या अकेलापन बार-बार आ सकता है।',
    question: 'क्या एकांत और आध्यात्मिक साधना में आपको शांति मिलती है?',
  },
};

export default function BhavabalaTab({ bhavabala, locale, isDevanagari, headingFont }: {
  bhavabala: BhavaBalaResult[];
  locale: Locale;
  isDevanagari: boolean;
  headingFont: React.CSSProperties;
}) {
  const isTamil = String(locale) === 'ta';
  const isEn = locale === 'en' || isTamil;
  const bodyFont = isDevanagari ? { fontFamily: 'var(--font-devanagari-body)' } : {};

  const maxTotal = Math.max(...bhavabala.map(b => b.total));

  // Derive strongest / weakest houses for the summary
  const analysis = useMemo(() => {
    const sorted = [...bhavabala].sort((a, b) => b.total - a.total);
    const strongest = sorted.slice(0, 3);
    const weakest = sorted.slice(-3).reverse();
    const strongCount = bhavabala.filter(b => b.strengthPercent >= 120).length;
    const avgCount = bhavabala.filter(b => b.strengthPercent >= 90 && b.strengthPercent < 120).length;
    const weakCount = bhavabala.filter(b => b.strengthPercent < 90).length;
    return { strongest, weakest, strongCount, avgCount, weakCount };
  }, [bhavabala]);

  const themes = isEn ? HOUSE_THEMES_EN : HOUSE_THEMES_HI;

  return (
    <div className="space-y-6">
      <h3 className="text-2xl font-bold text-gold-gradient text-center" style={headingFont}>
        {isEn ? 'Bhavabala — House Strength' : 'भावबल — भाव शक्ति'}
      </h3>

      {/* A) What is Bhavabala — explainer */}
      <div className="rounded-xl bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 p-5">
        <h4 className="text-gold-light font-bold text-sm mb-2" style={bodyFont}>
          {isEn ? 'What is Bhavabala?' : 'भावबल क्या है?'}
        </h4>
        <p className="text-text-secondary text-sm leading-relaxed" style={bodyFont}>
          {isEn
            ? 'Bhavabala measures how strong each house (life area) is in your chart. A strong house means its themes manifest easily and prominently in your life — you naturally excel in that area. A weak house means those themes require more conscious effort, but this is a growth opportunity, not a life sentence. Think of it as a map of where your energy flows most naturally.'
            : 'भावबल मापता है कि आपकी कुण्डली में प्रत्येक भाव (जीवन क्षेत्र) कितना शक्तिशाली है। शक्तिशाली भाव का अर्थ है कि उसके विषय आपके जीवन में सहज रूप से प्रकट होते हैं। कमजोर भाव का अर्थ है कि उन विषयों में अधिक सचेत प्रयास चाहिए — यह विकास का अवसर है, दण्ड नहीं।'}
        </p>
        {/* Quick snapshot */}
        <div className="flex flex-wrap gap-3 mt-3">
          <span className="text-xs px-3 py-1 rounded-full bg-green-500/10 border border-green-500/20 text-green-400">
            {analysis.strongCount} {isEn ? 'strong' : 'शक्तिशाली'}
          </span>
          <span className="text-xs px-3 py-1 rounded-full bg-gold-primary/10 border border-gold-primary/20 text-gold-light">
            {analysis.avgCount} {isEn ? 'average' : 'सामान्य'}
          </span>
          <span className="text-xs px-3 py-1 rounded-full bg-red-500/10 border border-red-500/20 text-red-400">
            {analysis.weakCount} {isEn ? 'needs effort' : 'प्रयास चाहिए'}
          </span>
        </div>
      </div>

      {/* Data table */}
      <div className="rounded-xl bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 p-4 sm:p-6 overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-text-secondary border-b border-gold-primary/15 text-xs uppercase tracking-wider">
              <th className="text-left py-3 px-2" style={bodyFont}>{isEn ? 'Bhava' : 'भाव'}</th>
              <th className="text-left py-3 px-2" style={bodyFont}>{isEn ? 'Signification' : 'कारकत्व'}</th>
              <th className="text-left py-3 px-2" style={bodyFont}>{isEn ? 'Lord' : 'स्वामी'}</th>
              <th className="text-right py-3 px-2">{isEn ? 'Lord Bala' : 'स्वामी बल'}</th>
              <th className="text-right py-3 px-2">{isEn ? 'Dig Bala' : 'दिग्बल'}</th>
              <th className="text-right py-3 px-2">{isEn ? 'Drishti' : 'दृष्टि'}</th>
              <th className="text-right py-3 px-2">{isEn ? 'Total' : 'कुल'}</th>
              <th className="text-right py-3 px-2">%</th>
            </tr>
          </thead>
          <tbody>
            {bhavabala.map(b => {
              const houseName = HOUSE_NAMES[b.bhava] || { en: `House ${b.bhava}`, hi: `भाव ${b.bhava}`, sa: `भाव ${b.bhava}`, mai: `भाव ${b.bhava}`, mr: `भाव ${b.bhava}`, ta: `House ${b.bhava}`, te: `House ${b.bhava}`, bn: `House ${b.bhava}`, kn: `House ${b.bhava}`, gu: `House ${b.bhava}` };
              const pct = b.strengthPercent;
              const color = pct >= 120 ? 'text-green-400' : pct >= 90 ? 'text-gold-light' : 'text-red-400';
              return (
                <tr key={b.bhava} className="border-b border-gold-primary/5 hover:bg-gold-primary/5">
                  <td className="py-2.5 px-2 text-gold-light font-bold">{b.bhava}</td>
                  <td className="py-2.5 px-2 text-text-secondary text-xs" style={bodyFont}>{tl(houseName, locale)}</td>
                  <td className="py-2.5 px-2">
                    {b.lordId <= 6 && <GrahaIconById id={b.lordId} size={16} />}
                    <span className="text-text-primary text-xs ml-1">{b.lordName}</span>
                  </td>
                  <td className="py-2.5 px-2 text-right text-text-secondary font-mono text-xs">{b.bhavadhipatiBala.toFixed(0)}</td>
                  <td className="py-2.5 px-2 text-right text-text-secondary font-mono text-xs">{b.bhavaDigBala.toFixed(0)}</td>
                  <td className="py-2.5 px-2 text-right font-mono text-xs">
                    <span className={b.bhavaDrishtiBala >= 0 ? 'text-green-400' : 'text-red-400'}>
                      {b.bhavaDrishtiBala >= 0 ? '+' : ''}{b.bhavaDrishtiBala.toFixed(0)}
                    </span>
                  </td>
                  <td className={`py-2.5 px-2 text-right font-mono text-xs font-bold ${color}`}>{b.total.toFixed(0)}</td>
                  <td className={`py-2.5 px-2 text-right font-mono text-xs font-bold ${color}`}>{pct}%</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Visual bar chart */}
      <div className="rounded-xl bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 p-6">
        <h4 className="text-gold-primary text-xs uppercase tracking-wider mb-4 font-bold text-center" style={bodyFont}>
          {isEn ? 'House Strength Distribution' : 'भाव बल वितरण'}
        </h4>
        <div className="space-y-2">
          {bhavabala.map(b => {
            const pct = Math.min(100, (b.total / maxTotal) * 100);
            const color = b.strengthPercent >= 120 ? '#4ade80' : b.strengthPercent >= 90 ? '#d4a853' : '#f87171';
            const houseName = HOUSE_NAMES[b.bhava] || { en: `H${b.bhava}`, hi: `भा${b.bhava}`, sa: `भा${b.bhava}`, mai: `भा${b.bhava}`, mr: `भा${b.bhava}`, ta: `H${b.bhava}`, te: `H${b.bhava}`, bn: `H${b.bhava}`, kn: `H${b.bhava}`, gu: `H${b.bhava}` };
            return (
              <div key={b.bhava} className="flex items-center gap-3">
                <div className="w-6 text-right text-xs text-gold-light font-bold">{b.bhava}</div>
                <div className="w-16 sm:w-24 text-right text-xs text-text-secondary truncate" style={bodyFont}>{tl(houseName, locale)}</div>
                <div className="flex-1 bg-gold-primary/10 rounded-full h-4 overflow-hidden">
                  <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, backgroundColor: color }} />
                </div>
                <div className="w-12 text-right text-xs font-mono" style={{ color }}>{b.strengthPercent}%</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* B) Per-house interpretive commentary — strongest houses */}
      <div className="rounded-xl bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 p-5">
        <h4 className="text-gold-light font-bold text-sm mb-4" style={headingFont}>
          {isEn ? 'Your Strongest Life Areas' : 'आपके सबसे शक्तिशाली जीवन क्षेत्र'}
        </h4>
        <div className="space-y-4">
          {analysis.strongest.map((b, i) => {
            const t = themes[b.bhava];
            if (!t) return null;
            const houseName = HOUSE_NAMES[b.bhava];
            return (
              <div key={b.bhava} className="border-l-2 border-green-500/40 pl-4">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-green-400 font-bold text-sm">#{i + 1}</span>
                  <span className="text-gold-light font-bold text-sm" style={bodyFont}>
                    {isEn ? `House ${b.bhava}` : `भाव ${b.bhava}`} — {tl(houseName!, locale)}
                  </span>
                  <span className="text-green-400 font-mono text-xs ml-auto">{b.strengthPercent}%</span>
                </div>
                <p className="text-text-secondary text-sm leading-relaxed" style={bodyFont}>
                  {t.strong}
                </p>
                <p className="text-text-secondary/60 text-xs mt-1.5 italic" style={bodyFont}>
                  {isEn ? 'Life theme: ' : 'जीवन विषय: '}{t.theme}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* C) Weakest houses — growth opportunities */}
      <div className="rounded-xl bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 p-5">
        <h4 className="text-gold-light font-bold text-sm mb-4" style={headingFont}>
          {isEn ? 'Growth Opportunities' : 'विकास के अवसर'}
        </h4>
        <div className="space-y-4">
          {analysis.weakest.map((b, i) => {
            const t = themes[b.bhava];
            if (!t) return null;
            const houseName = HOUSE_NAMES[b.bhava];
            return (
              <div key={b.bhava} className="border-l-2 border-red-500/30 pl-4">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-red-400/70 font-bold text-sm">#{i + 1}</span>
                  <span className="text-gold-light font-bold text-sm" style={bodyFont}>
                    {isEn ? `House ${b.bhava}` : `भाव ${b.bhava}`} — {tl(houseName!, locale)}
                  </span>
                  <span className="text-red-400 font-mono text-xs ml-auto">{b.strengthPercent}%</span>
                </div>
                <p className="text-text-secondary text-sm leading-relaxed" style={bodyFont}>
                  {t.weak}
                </p>
                <p className="text-text-secondary/60 text-xs mt-1.5 italic" style={bodyFont}>
                  {isEn ? 'Life theme: ' : 'जीवन विषय: '}{t.theme}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* D) Self-assessment questions */}
      <div className="rounded-xl bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 p-5">
        <h4 className="text-gold-light font-bold text-sm mb-3" style={headingFont}>
          {isEn ? 'Reflect on Your Chart' : 'अपनी कुण्डली पर चिंतन करें'}
        </h4>
        <p className="text-text-secondary/70 text-xs mb-4" style={bodyFont}>
          {isEn
            ? 'These questions are derived from your strongest and weakest houses. See if they resonate with your lived experience.'
            : 'ये प्रश्न आपके सबसे शक्तिशाली और कमजोर भावों से निकाले गए हैं। देखें कि ये आपके अनुभव से मेल खाते हैं या नहीं।'}
        </p>
        <div className="space-y-3">
          {[...analysis.strongest.slice(0, 2), ...analysis.weakest.slice(0, 2)].map(b => {
            const t = themes[b.bhava];
            if (!t) return null;
            const isStrong = b.strengthPercent >= 120;
            return (
              <div key={`q-${b.bhava}`} className="flex gap-3 items-start">
                <span className={`mt-0.5 flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${isStrong ? 'bg-green-500/15 text-green-400 border border-green-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'}`}>
                  {b.bhava}
                </span>
                <p className="text-text-secondary text-sm leading-relaxed" style={bodyFont}>
                  {t.question}
                  <span className="text-text-secondary/50 text-xs ml-1">
                    ({isEn ? `House ${b.bhava} — ${b.strengthPercent}%` : `भाव ${b.bhava} — ${b.strengthPercent}%`})
                  </span>
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
