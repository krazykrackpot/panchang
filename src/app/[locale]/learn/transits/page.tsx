'use client';

import { useLocale } from 'next-intl';
import LessonSection from '@/components/learn/LessonSection';
import { Link } from '@/lib/i18n/navigation';
import type { Locale } from '@/types/panchang';

const L = {
  title: { en: 'Understanding Planetary Transits (Gochar)', hi: 'ग्रह गोचर को समझें' },
  subtitle: {
    en: 'How the moving planets in the sky activate your birth chart in real time',
    hi: 'कैसे आकाश में चलते ग्रह वास्तविक समय में आपकी जन्म कुण्डली को सक्रिय करते हैं',
  },

  whatTitle: { en: 'What are Transits?', hi: 'गोचर क्या है?' },
  whatP1: {
    en: 'Your birth chart is a frozen snapshot of the sky at your birth moment — but the sky keeps moving. The planets continue their orbits, passing through different signs and houses day by day. These current planetary positions, viewed against the backdrop of your birth chart, are called transits (Gochar).',
    hi: 'आपकी जन्म कुण्डली आपके जन्म क्षण का एक जमा हुआ चित्र है — लेकिन आकाश चलता रहता है। ग्रह अपनी कक्षाओं में चलते रहते हैं, प्रतिदिन विभिन्न राशियों और भावों से गुज़रते हैं। आपकी जन्म कुण्डली की पृष्ठभूमि में देखी गई ये वर्तमान ग्रह स्थितियाँ गोचर कहलाती हैं।',
  },
  whatP2: {
    en: 'Think of your birth chart as a fixed landscape (mountains, rivers, cities) and transits as the weather moving across it. The landscape determines the terrain of your life; the transiting weather determines what happens on any given day, month, or year.',
    hi: 'अपनी जन्म कुण्डली को एक स्थिर भूदृश्य (पहाड़, नदियाँ, शहर) और गोचर को उस पर चलते मौसम की तरह समझें। भूदृश्य आपके जीवन का भूभाग निर्धारित करता है; गोचर मौसम निर्धारित करता है कि किसी दिन, माह या वर्ष में क्या होता है।',
  },

  slowPlanetsTitle: { en: 'Why Slow Planets Matter More', hi: 'धीमे ग्रह अधिक क्यों मायने रखते हैं' },
  slowPlanetsP1: {
    en: 'Not all transits carry equal weight. The slower a planet moves, the longer it stays in one sign, and the deeper its impact. Fast planets (Moon, Mercury, Venus, Sun) change signs every few days to a month — their transits create short-lived moods and events. Slow planets reshape entire chapters of your life:',
    hi: 'सभी गोचर समान भार नहीं रखते। ग्रह जितना धीमा, उतना लम्बा एक राशि में रहता है और उतना गहरा प्रभाव। तेज़ ग्रह (चन्द्र, बुध, शुक्र, सूर्य) कुछ दिनों से एक माह में राशि बदलते हैं। धीमे ग्रह आपके जीवन के सम्पूर्ण अध्यायों को बदलते हैं:',
  },
  transitDurations: [
    { planet: { en: 'Saturn (Shani)', hi: 'शनि' }, duration: { en: '~2.5 years per sign', hi: '~2.5 वर्ष प्रति राशि' }, impact: { en: 'Deepest structural changes — career shifts, maturation, karmic lessons. Saturn transits over your Moon (Sade Sati) are life-defining.', hi: 'सबसे गहरे संरचनात्मक परिवर्तन — कैरियर बदलाव, परिपक्वता, कर्मिक पाठ। चन्द्र पर शनि गोचर (साढ़े साती) जीवन-निर्धारक।' } },
    { planet: { en: 'Jupiter (Guru)', hi: 'गुरु' }, duration: { en: '~1 year per sign', hi: '~1 वर्ष प्रति राशि' }, impact: { en: 'Expansion, opportunities, grace. Jupiter transiting your 1st, 5th, 9th, or 11th houses brings the best results. The annual Jupiter sign change is a major predictive event.', hi: 'विस्तार, अवसर, कृपा। गुरु का 1, 5, 9 या 11वें भाव से गोचर सर्वोत्तम। वार्षिक गुरु राशि परिवर्तन एक प्रमुख भविष्यसूचक घटना।' } },
    { planet: { en: 'Rahu/Ketu', hi: 'राहु/केतु' }, duration: { en: '~1.5 years per sign', hi: '~1.5 वर्ष प्रति राशि' }, impact: { en: 'Obsession axis — Rahu amplifies desires in the house it transits, Ketu brings detachment and spiritual growth. Their sign changes often coincide with major societal shifts.', hi: 'जुनून अक्ष — राहु जिस भाव से गुज़रता है उसमें इच्छाएँ बढ़ाता है, केतु वैराग्य और आध्यात्मिक विकास लाता है। उनका राशि परिवर्तन अक्सर प्रमुख सामाजिक बदलावों से मेल खाता है।' } },
    { planet: { en: 'Mars (Mangal)', hi: 'मंगल' }, duration: { en: '~1.5 months per sign', hi: '~1.5 माह प्रति राशि' }, impact: { en: 'Energy bursts, conflicts, motivation. Mars transits are shorter but intense — accidents, arguments, and breakthroughs tend to cluster during Mars transits over sensitive chart points.', hi: 'ऊर्जा विस्फोट, संघर्ष, प्रेरणा। मंगल गोचर छोटे पर तीव्र — दुर्घटनाएँ, विवाद और सफलताएँ मंगल गोचर के दौरान संकुलित होती हैं।' } },
  ],

  activationTitle: { en: 'How Transits Activate Your Chart', hi: 'गोचर आपकी कुण्डली को कैसे सक्रिय करते हैं' },
  activationP1: {
    en: 'When a transiting planet enters a sign, it activates the corresponding house in your birth chart. But the activation is not uniform — several factors determine the strength and nature of the transit:',
    hi: 'जब गोचर ग्रह किसी राशि में प्रवेश करता है, तो यह आपकी जन्म कुण्डली में सम्बन्धित भाव को सक्रिय करता है। लेकिन सक्रियण समान नहीं होता — कई कारक गोचर की शक्ति और प्रकृति निर्धारित करते हैं:',
  },
  activationFactors: [
    { factor: { en: 'Transit house from Moon', hi: 'चन्द्र से गोचर भाव' }, detail: { en: 'In Vedic astrology, transits are primarily judged from the Moon sign (not Ascendant). Jupiter transiting 2nd from Moon gives wealth; 8th from Moon gives obstacles. This is the traditional Gochar framework.', hi: 'वैदिक ज्योतिष में गोचर मुख्यतः चन्द्र राशि से आँकते हैं (लग्न से नहीं)। गुरु चन्द्र से 2रे भाव से गोचर करे तो धन; 8वें से तो बाधाएँ। यह पारम्परिक गोचर ढाँचा है।' } },
    { factor: { en: 'Natal planets contacted', hi: 'जन्म ग्रहों से सम्पर्क' }, detail: { en: 'When a transit planet crosses the exact degree of a natal planet, it activates that natal planet\'s themes. Saturn crossing over your natal Venus can trigger relationship tests; Jupiter over natal Mercury expands career opportunities.', hi: 'जब गोचर ग्रह जन्म ग्रह के सटीक अंश को पार करता है, वह जन्म ग्रह के विषयों को सक्रिय करता है। शनि जन्म शुक्र पर = सम्बन्ध परीक्षा; गुरु जन्म बुध पर = कैरियर अवसर विस्तार।' } },
    { factor: { en: 'Return transits', hi: 'वापसी गोचर' }, detail: { en: 'When a planet returns to its natal position (e.g., Saturn return at ~29.5 years), it triggers a major life review for that planet\'s themes. Jupiter returns (~12 year cycle) bring wisdom and expansion cycles.', hi: 'जब ग्रह अपनी जन्म स्थिति पर लौटता है (शनि वापसी ~29.5 वर्ष), तो उस ग्रह के विषयों की बड़ी जीवन समीक्षा होती है। गुरु वापसी (~12 वर्ष चक्र) ज्ञान और विस्तार चक्र लाती है।' } },
    { factor: { en: 'Ashtakavarga score', hi: 'अष्टकवर्ग अंक' }, detail: { en: 'The Ashtakavarga system gives each sign a score (0-8) for each planet, indicating how favorable that transit will be. High scores (5+) = positive transit; low scores (0-2) = challenging transit. This is the most precise transit evaluation tool.', hi: 'अष्टकवर्ग प्रणाली प्रत्येक राशि को प्रत्येक ग्रह के लिए एक अंक (0-8) देती है। उच्च अंक (5+) = शुभ गोचर; निम्न अंक (0-2) = चुनौतीपूर्ण। यह सबसे सटीक गोचर मूल्यांकन उपकरण है।' } },
  ],

  ashtakavargaTitle: { en: 'Ashtakavarga and Transits', hi: 'अष्टकवर्ग और गोचर' },
  ashtakavargaP1: {
    en: 'Ashtakavarga is a point-based system that evaluates how favorable each sign is for each planet\'s transit. The Sarvashtakavarga (SAV) combines all planets\' contributions to give a total score (0-56) for each sign. This is the most objective way to assess transit quality:',
    hi: 'अष्टकवर्ग एक अंक-आधारित प्रणाली है जो मूल्यांकन करती है कि प्रत्येक राशि प्रत्येक ग्रह के गोचर के लिए कितनी अनुकूल है। सर्वाष्टकवर्ग (SAV) सभी ग्रहों के योगदान को मिलाकर प्रत्येक राशि के लिए कुल अंक (0-56) देता है:',
  },
  savThresholds: [
    { range: { en: '28+ bindus', hi: '28+ बिन्दु' }, meaning: { en: 'Strong zone — transiting planets here give positive results. Initiatives, investments, and new ventures are supported.', hi: 'बलवान क्षेत्र — यहाँ गोचर ग्रह सकारात्मक परिणाम देते हैं। पहल, निवेश और नए उद्यम समर्थित।' }, color: 'text-emerald-400' },
    { range: { en: '25-27 bindus', hi: '25-27 बिन्दु' }, meaning: { en: 'Average zone — mixed results, neither strongly positive nor negative. Normal life flow.', hi: 'सामान्य क्षेत्र — मिश्रित परिणाम, न अधिक सकारात्मक न नकारात्मक। सामान्य जीवन प्रवाह।' }, color: 'text-amber-400' },
    { range: { en: '<22 bindus', hi: '<22 बिन्दु' }, meaning: { en: 'Weak zone — transiting planets here encounter resistance. Exercise caution with major decisions; delays and obstacles are likely.', hi: 'कमज़ोर क्षेत्र — यहाँ गोचर ग्रहों को प्रतिरोध मिलता है। बड़े निर्णयों में सावधानी; विलम्ब और बाधाएँ सम्भव।' }, color: 'text-red-400' },
  ],

  radarTitle: { en: 'The Transit Radar — What It Shows', hi: 'गोचर रडार — यह क्या दिखाता है' },
  radarP1: {
    en: 'The Transit Radar on the Kundali page visualizes the Sarvashtakavarga scores as a circular heatmap around the 12 signs. It shows you at a glance which areas of your zodiac are currently "green light" (favorable for transiting planets) and which are "caution zones":',
    hi: 'कुण्डली पृष्ठ पर गोचर रडार सर्वाष्टकवर्ग अंकों को 12 राशियों के चारों ओर एक वृत्ताकार हीटमैप के रूप में प्रदर्शित करता है। यह एक नज़र में दिखाता है कि आपकी राशिचक्र के कौन से क्षेत्र वर्तमान में "हरी बत्ती" (अनुकूल) और कौन से "सावधानी क्षेत्र" हैं:',
  },
  radarFeatures: [
    { feature: { en: 'Green segments', hi: 'हरे खण्ड' }, detail: { en: 'Signs with high SAV scores (28+). When slow planets (Jupiter, Saturn) transit these signs, expect positive developments in the corresponding house areas of your life.', hi: 'उच्च SAV अंक (28+) वाली राशियाँ। जब धीमे ग्रह (गुरु, शनि) इन राशियों से गोचर करें, सम्बन्धित भाव क्षेत्रों में सकारात्मक विकास अपेक्षित।' } },
    { feature: { en: 'Red segments', hi: 'लाल खण्ड' }, detail: { en: 'Signs with low SAV scores (<22). Transits through these signs bring challenges. Knowing this in advance lets you prepare, postpone major decisions, or take protective measures.', hi: 'निम्न SAV अंक (<22) वाली राशियाँ। इन राशियों से गोचर चुनौतियाँ लाते हैं। पहले से जानने से तैयारी, बड़े निर्णय स्थगित या सुरक्षात्मक उपाय सम्भव।' } },
    { feature: { en: 'Current planet markers', hi: 'वर्तमान ग्रह चिह्नक' }, detail: { en: 'The radar shows where the major planets currently are, so you can see which zone each slow planet is currently transiting for your chart.', hi: 'रडार दिखाता है कि प्रमुख ग्रह वर्तमान में कहाँ हैं, ताकि आप देख सकें कि प्रत्येक धीमा ग्रह आपकी कुण्डली के किस क्षेत्र में गोचर कर रहा है।' } },
  ],

  practicalTitle: { en: 'Practical Advice for Favorable and Challenging Transits', hi: 'अनुकूल और चुनौतीपूर्ण गोचर के लिए व्यावहारिक सलाह' },
  favorableAdvice: [
    { advice: { en: 'Start new ventures, investments, and relationships during favorable Jupiter transits (5th, 9th, 11th from Moon)', hi: 'अनुकूल गुरु गोचर (चन्द्र से 5, 9, 11वें) में नए उद्यम, निवेश और सम्बन्ध शुरू करें' } },
    { advice: { en: 'Schedule important meetings and negotiations when Mercury transits strong SAV signs in your chart', hi: 'जब बुध आपकी कुण्डली में बलवान SAV राशियों से गोचर करे तब महत्वपूर्ण बैठकें और वार्ता निर्धारित करें' } },
    { advice: { en: 'Use Saturn\'s favorable transits (3rd, 6th, 11th from Moon) for hard work that builds lasting structures', hi: 'शनि के अनुकूल गोचर (चन्द्र से 3, 6, 11वें) में कठिन परिश्रम करें जो स्थायी संरचनाएँ बनाए' } },
  ],
  challengingAdvice: [
    { advice: { en: 'During Sade Sati (Saturn over Moon), focus on discipline, health, and inner growth rather than expansion', hi: 'साढ़े साती (शनि चन्द्र पर) में विस्तार की बजाय अनुशासन, स्वास्थ्य और आन्तरिक विकास पर ध्यान दें' } },
    { advice: { en: 'When Saturn transits the 8th from Moon, avoid risky financial decisions and focus on consolidation', hi: 'जब शनि चन्द्र से 8वें से गोचर करे, जोखिम भरे वित्तीय निर्णयों से बचें और समेकन पर ध्यान दें' } },
    { advice: { en: 'During Rahu-Ketu transit over your natal Moon, expect emotional confusion — meditation and grounding practices help', hi: 'जन्म चन्द्र पर राहु-केतु गोचर में भावनात्मक भ्रम — ध्यान और ग्राउंडिंग अभ्यास सहायक' } },
    { advice: { en: 'Mars transits over natal Saturn: control anger, avoid impulsive decisions, channel energy into exercise', hi: 'जन्म शनि पर मंगल गोचर: क्रोध नियंत्रण, आवेगी निर्णयों से बचें, ऊर्जा व्यायाम में लगाएँ' } },
  ],

  dashaInteractionTitle: { en: 'How Transits Interact with Your Dasha', hi: 'गोचर और दशा कैसे परस्पर क्रिया करते हैं' },
  dashaInteractionP1: {
    en: 'Transits and Dashas are the two timing systems in Vedic astrology. For the most accurate predictions, both must agree. A challenging transit during a favorable Dasha is experienced mildly; a challenging transit during a challenging Dasha is felt strongly. The principle:',
    hi: 'गोचर और दशा वैदिक ज्योतिष की दो समय प्रणालियाँ हैं। सबसे सटीक भविष्यवाणियों के लिए दोनों का सहमत होना ज़रूरी। अनुकूल दशा में चुनौतीपूर्ण गोचर हल्का अनुभव होता है; चुनौतीपूर्ण दशा में चुनौतीपूर्ण गोचर तीव्र। सिद्धान्त:',
  },
  dashaInteractionPoints: [
    { point: { en: 'Dasha = the base vibration (what themes are active for years)', hi: 'दशा = आधार कम्पन (कौन से विषय वर्षों से सक्रिय)' } },
    { point: { en: 'Transit = the trigger (what activates events within those themes)', hi: 'गोचर = ट्रिगर (उन विषयों में घटनाओं को क्या सक्रिय करता है)' } },
    { point: { en: 'Event = when both Dasha and Transit point to the same house/planet/theme simultaneously', hi: 'घटना = जब दशा और गोचर दोनों एक साथ एक ही भाव/ग्रह/विषय की ओर इंगित करें' } },
    { point: { en: 'Example: Jupiter Dasha + Jupiter transiting the 10th house = career breakthrough', hi: 'उदाहरण: गुरु दशा + गुरु 10वें भाव से गोचर = कैरियर सफलता' } },
  ],

  furtherTitle: { en: 'Related Topics', hi: 'सम्बन्धित विषय' },
  furtherLinks: [
    { href: '/learn/ashtakavarga', label: { en: 'Ashtakavarga System', hi: 'अष्टकवर्ग प्रणाली' } },
    { href: '/learn/sade-sati', label: { en: 'Sade Sati — Saturn over Moon', hi: 'साढ़े साती — शनि चन्द्र पर' } },
    { href: '/learn/gochar', label: { en: 'Gochar — Transit Framework', hi: 'गोचर — गोचर ढाँचा' } },
    { href: '/learn/dashas', label: { en: 'Dashas — Life Timing', hi: 'दशा — जीवन समय' } },
    { href: '/learn/birth-chart', label: { en: 'Understanding Your Birth Chart', hi: 'जन्म कुण्डली समझें' } },
  ],
};

export default function TransitsPage() {
  const locale = useLocale() as Locale;
  const isHi = locale !== 'en';
  const headingFont = isHi ? { fontFamily: 'var(--font-devanagari-heading)' } : { fontFamily: 'var(--font-heading)' };

  return (
    <article className="max-w-4xl mx-auto px-4 py-12 space-y-2">
      <header className="text-center mb-8">
        <h1 className="text-3xl sm:text-4xl font-bold text-gold-gradient mb-3" style={headingFont}>
          {isHi ? L.title.hi : L.title.en}
        </h1>
        <p className="text-text-secondary max-w-2xl mx-auto">{isHi ? L.subtitle.hi : L.subtitle.en}</p>
      </header>

      {/* 1. What are transits */}
      <LessonSection number={1} title={isHi ? L.whatTitle.hi : L.whatTitle.en}>
        <div className="space-y-4 text-text-secondary text-sm leading-relaxed">
          <p>{isHi ? L.whatP1.hi : L.whatP1.en}</p>
          <p>{isHi ? L.whatP2.hi : L.whatP2.en}</p>
        </div>
      </LessonSection>

      {/* 2. Slow planets */}
      <LessonSection number={2} title={isHi ? L.slowPlanetsTitle.hi : L.slowPlanetsTitle.en}>
        <div className="space-y-4 text-text-secondary text-sm leading-relaxed">
          <p>{isHi ? L.slowPlanetsP1.hi : L.slowPlanetsP1.en}</p>
          <div className="space-y-3 mt-4">
            {L.transitDurations.map((td, i) => (
              <div key={i} className="rounded-lg bg-bg-primary/40 border border-gold-primary/10 p-4">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-gold-light font-bold text-sm">{isHi ? td.planet.hi : td.planet.en}</span>
                  <span className="text-text-secondary/40 text-xs ml-auto">{isHi ? td.duration.hi : td.duration.en}</span>
                </div>
                <p className="text-text-secondary text-xs leading-relaxed">{isHi ? td.impact.hi : td.impact.en}</p>
              </div>
            ))}
          </div>
        </div>
      </LessonSection>

      {/* 3. How transits activate */}
      <LessonSection number={3} title={isHi ? L.activationTitle.hi : L.activationTitle.en}>
        <div className="space-y-4 text-text-secondary text-sm leading-relaxed">
          <p>{isHi ? L.activationP1.hi : L.activationP1.en}</p>
          <div className="space-y-3 mt-4">
            {L.activationFactors.map((af, i) => (
              <div key={i} className="rounded-lg bg-bg-primary/40 border border-gold-primary/10 p-4">
                <h4 className="text-gold-light font-bold text-xs mb-1">{isHi ? af.factor.hi : af.factor.en}</h4>
                <p className="text-text-secondary text-xs leading-relaxed">{isHi ? af.detail.hi : af.detail.en}</p>
              </div>
            ))}
          </div>
        </div>
      </LessonSection>

      {/* 4. Ashtakavarga */}
      <LessonSection number={4} title={isHi ? L.ashtakavargaTitle.hi : L.ashtakavargaTitle.en}>
        <div className="space-y-4 text-text-secondary text-sm leading-relaxed">
          <p>{isHi ? L.ashtakavargaP1.hi : L.ashtakavargaP1.en}</p>
          <div className="space-y-2 mt-4">
            {L.savThresholds.map((s, i) => (
              <div key={i} className="flex gap-3 p-3 rounded-lg bg-bg-primary/40 border border-gold-primary/10">
                <span className={`font-bold text-xs shrink-0 ${s.color}`}>{isHi ? s.range.hi : s.range.en}</span>
                <span className="text-text-secondary text-xs">{isHi ? s.meaning.hi : s.meaning.en}</span>
              </div>
            ))}
          </div>
          <p className="text-xs">
            <Link href="/learn/ashtakavarga" className="text-gold-primary/70 hover:text-gold-light transition-colors">
              {isHi ? 'अष्टकवर्ग का गहन अध्ययन →' : 'Deep dive into Ashtakavarga →'}
            </Link>
          </p>
        </div>
      </LessonSection>

      {/* 5. Transit Radar */}
      <LessonSection number={5} title={isHi ? L.radarTitle.hi : L.radarTitle.en}>
        <div className="space-y-4 text-text-secondary text-sm leading-relaxed">
          <p>{isHi ? L.radarP1.hi : L.radarP1.en}</p>
          <div className="space-y-3 mt-4">
            {L.radarFeatures.map((rf, i) => (
              <div key={i} className="rounded-lg bg-bg-primary/40 border border-gold-primary/10 p-3">
                <h4 className="text-gold-light font-semibold text-xs mb-1">{isHi ? rf.feature.hi : rf.feature.en}</h4>
                <p className="text-text-secondary text-xs leading-relaxed">{isHi ? rf.detail.hi : rf.detail.en}</p>
              </div>
            ))}
          </div>
        </div>
      </LessonSection>

      {/* 6. Practical advice */}
      <LessonSection number={6} title={isHi ? L.practicalTitle.hi : L.practicalTitle.en}>
        <div className="space-y-4">
          <div className="rounded-lg bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-emerald-500/15 p-4">
            <h4 className="text-emerald-400 font-bold text-sm mb-3" style={headingFont}>
              {isHi ? 'अनुकूल गोचर में' : 'During Favorable Transits'}
            </h4>
            <ul className="space-y-2">
              {L.favorableAdvice.map((a, i) => (
                <li key={i} className="flex gap-2 text-xs">
                  <span className="text-emerald-400 shrink-0 mt-0.5">&#x2022;</span>
                  <span className="text-text-secondary">{isHi ? a.advice.hi : a.advice.en}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-lg bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-red-500/15 p-4">
            <h4 className="text-red-400 font-bold text-sm mb-3" style={headingFont}>
              {isHi ? 'चुनौतीपूर्ण गोचर में' : 'During Challenging Transits'}
            </h4>
            <ul className="space-y-2">
              {L.challengingAdvice.map((a, i) => (
                <li key={i} className="flex gap-2 text-xs">
                  <span className="text-red-400 shrink-0 mt-0.5">&#x2022;</span>
                  <span className="text-text-secondary">{isHi ? a.advice.hi : a.advice.en}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </LessonSection>

      {/* 7. Dasha interaction */}
      <LessonSection number={7} title={isHi ? L.dashaInteractionTitle.hi : L.dashaInteractionTitle.en}>
        <div className="space-y-4 text-text-secondary text-sm leading-relaxed">
          <p>{isHi ? L.dashaInteractionP1.hi : L.dashaInteractionP1.en}</p>
          <ul className="space-y-2 mt-3">
            {L.dashaInteractionPoints.map((d, i) => (
              <li key={i} className="flex gap-2 text-xs">
                <span className="text-gold-primary shrink-0 mt-0.5">&#x2022;</span>
                <span className="text-text-secondary">{isHi ? d.point.hi : d.point.en}</span>
              </li>
            ))}
          </ul>
        </div>
      </LessonSection>

      {/* Further learning */}
      <LessonSection title={isHi ? L.furtherTitle.hi : L.furtherTitle.en}>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {L.furtherLinks.map((link, i) => (
            <Link
              key={i}
              href={link.href}
              className="text-gold-primary/70 hover:text-gold-light transition-colors text-sm p-2 rounded-lg hover:bg-gold-primary/5"
            >
              {isHi ? link.label.hi : link.label.en} →
            </Link>
          ))}
        </div>
      </LessonSection>
    </article>
  );
}
