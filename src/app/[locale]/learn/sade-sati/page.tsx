'use client';

import { useLocale } from 'next-intl';
import { motion } from 'framer-motion';
import { Moon, Clock, ShieldAlert, Heart, Sparkles, Star, AlertTriangle, CheckCircle, ArrowRight } from 'lucide-react';
import LessonSection from '@/components/learn/LessonSection';
import { Link } from '@/lib/i18n/navigation';
import type { Locale } from '@/types/panchang';

/* ── Inline trilingual labels ─────────────────────────────────────── */
const L = {
  title: { en: 'Sade Sati — Saturn\'s 7.5-Year Transit', hi: 'साढ़े साती — शनि का साढ़े सात वर्षीय गोचर', sa: 'साढेसाती — शनेः सार्धसप्तवर्षीयगोचरः' },
  subtitle: {
    en: 'Saturn\'s transit over your Moon sign is the most discussed period in Vedic astrology. Understanding its three phases — and why it affects each person differently — transforms fear into preparation.',
    hi: 'आपकी चन्द्र राशि पर शनि का गोचर वैदिक ज्योतिष में सबसे अधिक चर्चित अवधि है। इसके तीन चरणों को समझना — और यह प्रत्येक व्यक्ति को अलग-अलग क्यों प्रभावित करता है — भय को तैयारी में बदल देता है।',
    sa: 'चन्द्रराशौ शनेः गोचरः वैदिकज्योतिषे सर्वाधिकचर्चिता अवधिः। तस्य त्रयाणां चरणानाम् अवगमनं भयं सज्जतायां परिवर्तयति।'
  },
  whatTitle: { en: 'What is Sade Sati?', hi: 'साढ़े साती क्या है?', sa: 'साढेसाती का?' },
  whatContent: {
    en: '"Sade Sati" literally means "seven and a half" in Hindi — referring to the approximately 7.5 years Saturn takes to transit through three consecutive signs: the 12th from your Moon sign, your Moon sign itself, and the 2nd from your Moon sign. Since Saturn spends roughly 2.5 years in each sign, the total transit spans about 7.5 years.',
    hi: '"साढ़े साती" का शाब्दिक अर्थ है "साढ़े सात" — यह लगभग 7.5 वर्षों को संदर्भित करता है जो शनि को तीन क्रमिक राशियों से गुज़रने में लगते हैं: आपकी चन्द्र राशि से 12वीं, स्वयं आपकी चन्द्र राशि, और आपकी चन्द्र राशि से 2री। चूँकि शनि प्रत्येक राशि में लगभग 2.5 वर्ष बिताता है, कुल गोचर लगभग 7.5 वर्ष का होता है।',
    sa: '"साढेसाती" इत्यस्य शाब्दिकार्थः "सार्धसप्त" — प्रायः 7.5 वर्षान् सूचयति यान् शनिः चन्द्रराशेः 12 तमे, स्वयं चन्द्रराश्यां, चन्द्रराशेः 2 तमे च गोचरन् व्यतीतयति।'
  },
  whatContent2: {
    en: 'The Moon represents the mind (Manas) in Vedic astrology. When Saturn — the planet of discipline, restriction, karma, and hard lessons — transits over the Moon, it directly pressures your mental and emotional state. This is not random suffering — it is a structured period of karmic acceleration where Saturn forces you to confront unresolved issues.',
    hi: 'वैदिक ज्योतिष में चन्द्र मन (मानस) का प्रतिनिधित्व करता है। जब शनि — अनुशासन, प्रतिबन्ध, कर्म और कठिन सबक का ग्रह — चन्द्र पर गोचर करता है, तो यह सीधे आपकी मानसिक और भावनात्मक स्थिति पर दबाव डालता है। यह यादृच्छिक कष्ट नहीं है — यह कार्मिक त्वरण की संरचित अवधि है।',
    sa: 'वैदिकज्योतिषे चन्द्रः मनसः (मानसस्य) प्रतिनिधिः। यदा शनिः — अनुशासनस्य कर्मणः कठिनपाठानां च ग्रहः — चन्द्रं गोचरति, मानसिकभावनात्मकस्थितौ सीधा दबावं करोति।'
  },
  phasesTitle: { en: 'The Three Phases', hi: 'तीन चरण', sa: 'त्रयः चरणाः' },
  phasesContent: {
    en: 'Sade Sati unfolds in three distinct phases, each lasting approximately 2.5 years. Each phase challenges a different dimension of life.',
    hi: 'साढ़े साती तीन विशिष्ट चरणों में प्रकट होती है, प्रत्येक लगभग 2.5 वर्ष का। प्रत्येक चरण जीवन के एक अलग आयाम को चुनौती देता है।',
    sa: 'साढेसाती त्रिषु विशिष्टचरणेषु प्रकटति, प्रत्येकं प्रायः 2.5 वर्षस्य। प्रत्येकचरणः जीवनस्य भिन्नम् आयामं चुनौतयति।'
  },
  severityTitle: { en: 'How Severe is YOUR Sade Sati?', hi: 'आपकी साढ़े साती कितनी कठिन है?', sa: 'भवतः साढेसाती कियती कठिना?' },
  severityContent: {
    en: 'Not all Sade Satis are equal. The severity depends on multiple factors in your natal chart. Some people thrive during Sade Sati — they build empires, gain wisdom, and achieve lasting success. Others struggle. The difference lies in the birth chart configuration.',
    hi: 'सभी साढ़े साती समान नहीं होतीं। गम्भीरता आपकी जन्म कुण्डली के कई कारकों पर निर्भर करती है। कुछ लोग साढ़े साती में फलते-फूलते हैं — वे साम्राज्य बनाते हैं, ज्ञान प्राप्त करते हैं। अन्तर जन्म कुण्डली विन्यास में है।',
    sa: 'सर्वाः साढेसात्यः न समानाः। गाम्भीर्यं जन्मकुण्डल्याः अनेकेषु कारकेषु निर्भरति।'
  },
  lifeCycleTitle: { en: 'Life Cycle Patterns', hi: 'जीवन चक्र प्रतिरूप', sa: 'जीवनचक्रप्रतिरूपाणि' },
  lifeCycleContent: {
    en: 'Most people experience 2-3 Sade Satis in a lifetime (Saturn\'s orbit is ~29.5 years, so the cycle repeats roughly every 30 years). Each occurrence corresponds to a major life transition.',
    hi: 'अधिकांश लोग जीवनकाल में 2-3 साढ़े साती अनुभव करते हैं (शनि की कक्षा ~29.5 वर्ष है, इसलिए चक्र लगभग हर 30 वर्ष में दोहराता है)। प्रत्येक घटना एक बड़े जीवन परिवर्तन से मेल खाती है।',
    sa: 'अधिकांशाः जनाः जीवनकाले 2-3 साढेसातीः अनुभवन्ति (शनेः कक्षा ~29.5 वर्षाः)। प्रत्येकं घटना महत्जीवनपरिवर्तनेन सह मेलति।'
  },
  remediesTitle: { en: 'Remedies & Mitigation', hi: 'उपाय एवं शमन', sa: 'उपायाः शमनं च' },
  remediesContent: {
    en: 'Traditional remedies for Sade Sati are designed to align your actions with Saturn\'s principles: discipline, service, and karmic responsibility. Saturn rewards those who work with its energy rather than against it.',
    hi: 'साढ़े साती के पारंपरिक उपाय आपके कार्यों को शनि के सिद्धान्तों के अनुरूप बनाने के लिए हैं: अनुशासन, सेवा और कार्मिक उत्तरदायित्व। शनि उन्हें पुरस्कृत करता है जो उसकी ऊर्जा के साथ कार्य करते हैं, उसके विरुद्ध नहीं।',
    sa: 'साढेसात्याः पारम्परिकोपायाः कर्माणि शनेः सिद्धान्तैः सह संरेखयितुं निर्मिताः: अनुशासनं, सेवा, कार्मिकोत्तरदायित्वं च।'
  },
  mythsTitle: { en: 'Myths Debunked', hi: 'मिथक खंडन', sa: 'मिथकखण्डनम्' },
  mythsContent: {
    en: 'Fear-mongering about Sade Sati has been a staple of commercial astrology for centuries. Let us separate fact from fiction.',
    hi: 'साढ़े साती के बारे में भय फैलाना सदियों से व्यावसायिक ज्योतिष का मुख्य आधार रहा है। आइए तथ्य और कल्पना को अलग करें।',
    sa: 'साढेसात्याः विषये भयप्रसारणं शताब्दीभ्यः वाणिज्यज्योतिषस्य प्रधानम् आधारम्। तथ्यं कल्पनां च पृथक्कुर्मः।'
  },
  famousTitle: { en: 'Famous People Who Thrived During Sade Sati', hi: 'साढ़े साती में सफल प्रसिद्ध व्यक्ति', sa: 'साढेसात्यां सफलाः प्रसिद्धजनाः' },
  crossRefTitle: { en: 'Related Topics', hi: 'सम्बन्धित विषय', sa: 'सम्बद्धविषयाः' },
};

/* ── Three phases data ────────────────────────────────────────────── */
const PHASES = [
  {
    num: 1,
    name: { en: 'Rising Phase', hi: 'उदय चरण', sa: 'उदयचरणः' },
    transit: { en: '12th from Moon (2.5 years)', hi: 'चन्द्र से 12वीं राशि (2.5 वर्ष)', sa: 'चन्द्रात् 12 तमा राशिः (2.5 वर्षाः)' },
    color: '#7dd3fc',
    themes: {
      en: 'Anxiety, preparation, spiritual awakening, financial stress, sleep disturbances, increased expenses, detachment from comforts. Saturn in the 12th from Moon triggers subconscious processing — old fears surface, isolation increases, and meditation becomes especially powerful.',
      hi: 'चिन्ता, तैयारी, आध्यात्मिक जागृति, वित्तीय तनाव, नींद में बाधा, बढ़ते खर्चे, सुख-सुविधाओं से वैराग्य। चन्द्र से 12वें में शनि अवचेतन प्रसंस्करण को प्रेरित करता है — पुराने भय सामने आते हैं, एकान्तवास बढ़ता है।',
      sa: 'चिन्ता, सज्जता, आध्यात्मिकजागृतिः, वित्तीयतनावः, निद्राबाधा, व्ययवृद्धिः, सुखेभ्यः वैराग्यम्।'
    },
    advice: {
      en: 'Focus on spiritual practices. Reduce unnecessary expenses. This is a preparation phase — clear old karmic debts.',
      hi: 'आध्यात्मिक साधनाओं पर ध्यान दें। अनावश्यक खर्चे कम करें। यह तैयारी का चरण है — पुराने कार्मिक ऋणों को मुक्त करें।',
      sa: 'आध्यात्मिकसाधनासु ध्यानं ददत। अनावश्यकव्ययान् न्यूनीकुरुत।'
    },
  },
  {
    num: 2,
    name: { en: 'Peak Phase', hi: 'चरम चरण', sa: 'चरमचरणः' },
    transit: { en: 'Over Moon sign (2.5 years)', hi: 'चन्द्र राशि पर (2.5 वर्ष)', sa: 'चन्द्रराश्याम् (2.5 वर्षाः)' },
    color: '#f97316',
    themes: {
      en: 'Maximum pressure, deep transformation, character building, health issues (especially mental health), career upheaval or restructuring, relationship tests, loss of comfort zone. Saturn sits directly on the Moon — the mind is compressed, tested, and ultimately strengthened. This phase can bring depression, anxiety, but also extraordinary resilience.',
      hi: 'अधिकतम दबाव, गहरा परिवर्तन, चरित्र निर्माण, स्वास्थ्य समस्याएँ (विशेषकर मानसिक स्वास्थ्य), करियर उथल-पुथल, सम्बन्ध परीक्षण, सुख क्षेत्र की हानि। शनि सीधे चन्द्र पर बैठता है — मन संकुचित, परीक्षित और अन्ततः सुदृढ़ होता है।',
      sa: 'अधिकतमदबावः, गभीरपरिवर्तनम्, चरित्रनिर्माणम्, आरोग्यसमस्याः, वृत्त्युथलपुथलम्, सम्बन्धपरीक्षणम्।'
    },
    advice: {
      en: 'Prioritize health. Stay disciplined. Avoid major risks. This is transformation — do not fight it, work with it.',
      hi: 'स्वास्थ्य को प्राथमिकता दें। अनुशासित रहें। बड़े जोखिमों से बचें। यह परिवर्तन है — इससे न लड़ें, इसके साथ कार्य करें।',
      sa: 'आरोग्यं प्राथम्ये ददत। अनुशासिताः तिष्ठत। इदं परिवर्तनम् — तेन सह कार्यं कुरुत।'
    },
  },
  {
    num: 3,
    name: { en: 'Setting Phase', hi: 'अस्त चरण', sa: 'अस्तचरणः' },
    transit: { en: '2nd from Moon (2.5 years)', hi: 'चन्द्र से 2री राशि (2.5 वर्ष)', sa: 'चन्द्रात् 2 तमा राशिः (2.5 वर्षाः)' },
    color: '#86efac',
    themes: {
      en: 'Financial recovery, reputation rebuilding, family dynamics shifting, speech becoming more measured, wisdom gained through suffering, gradual return of stability. Saturn in the 2nd from Moon affects wealth and family — this is the cleanup phase where you rebuild from the ground up with hard-won wisdom.',
      hi: 'वित्तीय सुधार, प्रतिष्ठा पुनर्निर्माण, पारिवारिक गतिशीलता बदलना, वाणी अधिक संयमित, कष्ट से प्राप्त ज्ञान, स्थिरता की क्रमिक वापसी। चन्द्र से 2रे में शनि धन और परिवार को प्रभावित करता है — यह सफाई चरण है जहाँ आप कठिन-परिश्रम से अर्जित ज्ञान के साथ पुनर्निर्माण करते हैं।',
      sa: 'वित्तीयसुधारः, प्रतिष्ठापुनर्निर्माणम्, कुटुम्बगतिशीलताया परिवर्तनम्, वाक् अधिकसंयमिता, कष्टात् प्राप्तज्ञानम्।'
    },
    advice: {
      en: 'Rebuild finances carefully. Invest in family bonds. Share the wisdom you gained. The worst is over.',
      hi: 'सावधानीपूर्वक वित्त पुनर्निर्माण करें। पारिवारिक बन्धनों में निवेश करें। अर्जित ज्ञान साझा करें। सबसे कठिन समय बीत गया।',
      sa: 'सावधानं वित्तं पुनर्निर्मात। कुटुम्बबन्धेषु निवेशयत। प्राप्तज्ञानं विभजत।'
    },
  },
];

/* ── Severity factors ─────────────────────────────────────────────── */
const SEVERITY_FACTORS = [
  { factor: { en: 'Natal Saturn Dignity', hi: 'जन्म शनि की गरिमा', sa: 'जन्मशनेः गरिमा' }, mild: { en: 'Exalted (Libra) or Own Sign (Cap/Aqu)', hi: 'उच्च (तुला) या स्वराशि (मकर/कुम्भ)', sa: 'उच्चः (तुला) स्वराशिः वा' }, severe: { en: 'Debilitated (Aries) or enemy sign', hi: 'नीच (मेष) या शत्रु राशि', sa: 'नीचः (मेषे) शत्रुराशिः वा' } },
  { factor: { en: 'Moon Strength', hi: 'चन्द्र बल', sa: 'चन्द्रबलम्' }, mild: { en: 'Bright Moon (Shukla Paksha), strong Nakshatra', hi: 'उज्ज्वल चन्द्र (शुक्ल पक्ष), प्रबल नक्षत्र', sa: 'उज्ज्वलचन्द्रः, प्रबलनक्षत्रम्' }, severe: { en: 'Dark Moon (Krishna Paksha), weak Nakshatra', hi: 'कमज़ोर चन्द्र (कृष्ण पक्ष)', sa: 'दुर्बलचन्द्रः' } },
  { factor: { en: 'Ashtakavarga Bindus', hi: 'अष्टकवर्ग बिन्दु', sa: 'अष्टकवर्गबिन्दवः' }, mild: { en: 'Saturn has 4+ bindus in transit sign', hi: 'गोचर राशि में शनि के 4+ बिन्दु', sa: 'गोचरराश्यां शनेः 4+ बिन्दवः' }, severe: { en: 'Saturn has 0-2 bindus in transit sign', hi: 'गोचर राशि में शनि के 0-2 बिन्दु', sa: 'गोचरराश्यां शनेः 0-2 बिन्दवः' } },
  { factor: { en: 'Current Dasha', hi: 'वर्तमान दशा', sa: 'वर्तमानदशा' }, mild: { en: 'Running Jupiter or Venus Dasha', hi: 'गुरु या शुक्र दशा चल रही है', sa: 'गुरुशुक्रदशा चलति' }, severe: { en: 'Running Saturn or Rahu Dasha', hi: 'शनि या राहु दशा चल रही है', sa: 'शनिराहुदशा चलति' } },
  { factor: { en: 'Saturn as Yogakaraka', hi: 'योगकारक शनि', sa: 'योगकारकशनिः' }, mild: { en: 'Yes (for Taurus/Libra Lagna)', hi: 'हाँ (वृषभ/तुला लग्न)', sa: 'आम् (वृषभ/तुलालग्ने)' }, severe: { en: 'No (Saturn is a functional malefic)', hi: 'नहीं (शनि कार्यात्मक पाप है)', sa: 'न (शनिः कार्यात्मकपापः)' } },
];

/* ── Life cycle patterns ──────────────────────────────────────────── */
const LIFE_CYCLES = [
  { cycle: { en: 'First Sade Sati (~age 22-30)', hi: 'प्रथम साढ़े साती (~22-30 वर्ष)', sa: 'प्रथमा साढेसाती (~22-30 वर्षाः)' }, theme: { en: 'Career establishment, leaving comfort zone, first major responsibilities. Often coincides with first job, marriage, or moving away from parents. Saturn teaches self-reliance.', hi: 'करियर स्थापना, सुख क्षेत्र छोड़ना, प्रथम बड़ी ज़िम्मेदारियाँ। अक्सर पहली नौकरी, विवाह या माता-पिता से दूर जाने के साथ मेल खाता है। शनि आत्मनिर्भरता सिखाता है।', sa: 'वृत्तिस्थापनम्, सुखक्षेत्रात् निर्गमनम्, प्रथमा महती उत्तरदायित्वानि।' } },
  { cycle: { en: 'Second Sade Sati (~age 52-60)', hi: 'द्वितीय साढ़े साती (~52-60 वर्ष)', sa: 'द्वितीया साढेसाती (~52-60 वर्षाः)' }, theme: { en: 'Health issues emerge, parents may need care or pass away, career reaches peak or demands major pivot. Wisdom from the first Sade Sati makes this one more manageable — you know Saturn\'s language now.', hi: 'स्वास्थ्य समस्याएँ उभरती हैं, माता-पिता को देखभाल की आवश्यकता या निधन, करियर शिखर या बड़ा मोड़। प्रथम साढ़े साती का ज्ञान इसे अधिक प्रबन्धनीय बनाता है।', sa: 'आरोग्यसमस्याः उदयन्ति, पितरौ देखभालार्थं वा निधनं, वृत्तिशिखरम्। प्रथमसाढेसात्याः ज्ञानम् इमां अधिकप्रबन्धनीयां करोति।' } },
  { cycle: { en: 'Third Sade Sati (~age 82-90)', hi: 'तृतीय साढ़े साती (~82-90 वर्ष)', sa: 'तृतीया साढेसाती (~82-90 वर्षाः)' }, theme: { en: 'End-of-life contemplation, spiritual culmination, legacy questions, physical limitations accepted. This Sade Sati is about closure — completing the soul\'s karmic curriculum for this lifetime.', hi: 'जीवन के अन्तिम चिन्तन, आध्यात्मिक परिणति, विरासत प्रश्न, शारीरिक सीमाओं की स्वीकृति। यह साढ़े साती समापन के बारे में है — इस जीवनकाल के कार्मिक पाठ्यक्रम को पूरा करना।', sa: 'जीवनान्तचिन्तनम्, आध्यात्मिकपरिणतिः, वंशप्रश्नाः, शारीरिकसीमानां स्वीकृतिः।' } },
];

/* ── Remedies ──────────────────────────────────────────────────────── */
const REMEDIES = [
  { name: { en: 'Shani Dev Worship', hi: 'शनि देव पूजा', sa: 'शनिदेवपूजा' }, desc: { en: 'Visit Shani temple on Saturdays. Light sesame oil lamp. Offer black flowers and mustard oil. The Shani Chalisa and Dashrath Shani Stotra are particularly potent.', hi: 'शनिवार को शनि मन्दिर जाएँ। तिल के तेल का दीपक जलाएँ। काले फूल और सरसों का तेल अर्पित करें। शनि चालीसा और दशरथ शनि स्तोत्र विशेष प्रभावी हैं।', sa: 'शनिवासरे शनिमन्दिरं गच्छत। तिलतैलदीपं प्रज्वालयत। कृष्णपुष्पाणि सर्षपतैलं च अर्पयत।' }, icon: Star },
  { name: { en: 'Maha Mrityunjaya Mantra', hi: 'महा मृत्युंजय मन्त्र', sa: 'महामृत्युञ्जयमन्त्रः' }, desc: { en: 'For health protection during Peak Phase. "Om Tryambakam Yajamahe..." — recite 108 times daily. This mantra specifically addresses Saturn\'s impact on health and longevity.', hi: 'चरम चरण में स्वास्थ्य रक्षा के लिए। "ॐ त्र्यम्बकं यजामहे..." — प्रतिदिन 108 बार जपें। यह मन्त्र विशेष रूप से स्वास्थ्य और दीर्घायु पर शनि के प्रभाव को सम्बोधित करता है।', sa: 'चरमचरणे आरोग्यरक्षार्थम्। "ॐ त्र्यम्बकं यजामहे..." — प्रतिदिनम् 108 वारं जपत।' }, icon: Heart },
  { name: { en: 'Community Service (Karma Yoga)', hi: 'सामुदायिक सेवा (कर्म योग)', sa: 'सामुदायिकसेवा (कर्मयोगः)' }, desc: { en: 'Saturn rules the working class and the underprivileged. Serving those less fortunate directly aligns with Saturn\'s energy. Feed the poor on Saturdays, donate to charities, volunteer consistently.', hi: 'शनि श्रमिक वर्ग और वंचितों पर शासन करता है। कम भाग्यशाली लोगों की सेवा सीधे शनि की ऊर्जा से संरेखित होती है। शनिवार को गरीबों को भोजन कराएँ, दान करें, नियमित स्वयंसेवा करें।', sa: 'शनिः श्रमिकवर्गं वञ्चितान् च शासति। अल्पभाग्यशालिनां सेवा सीधा शनेः ऊर्जया सह संरेखिता।' }, icon: Sparkles },
  { name: { en: 'Blue Sapphire (WITH CAUTION)', hi: 'नीलम (सावधानी सहित)', sa: 'नीलमणिः (सावधान्या सह)' }, desc: { en: 'ONLY if Saturn is a Yogakaraka for your Lagna (Taurus/Libra ascendant) AND you have consulted a qualified astrologer. Blue Sapphire is the most powerful gemstone — it can dramatically help OR harm. Never wear based on generic advice. Trial period of 5-7 days mandatory.', hi: 'केवल तभी यदि शनि आपके लग्न के लिए योगकारक है (वृषभ/तुला लग्न) और आपने योग्य ज्योतिषी से परामर्श किया है। नीलम सबसे शक्तिशाली रत्न है — यह नाटकीय रूप से मदद या हानि कर सकता है। 5-7 दिन की परीक्षण अवधि अनिवार्य।', sa: 'केवलं यदि शनिः लग्नस्य योगकारकः (वृषभ/तुलालग्ने)। नीलमणिः सर्वाधिकशक्तिशालिरत्नम् — नाटकीयरूपेण सहायतां हानिं वा कर्तुं शक्नोति।' }, icon: AlertTriangle },
];

/* ── Myths ─────────────────────────────────────────────────────────── */
const MYTHS = [
  {
    myth: { en: '"Sade Sati is ALWAYS terrible"', hi: '"साढ़े साती सदैव भयानक होती है"', sa: '"साढेसाती सदा भयानका"' },
    truth: { en: 'FALSE. Saturn rewards discipline, hard work, and karma. For Yogakaraka Saturn (Taurus/Libra Lagna), Sade Sati can bring career breakthroughs, authority, and lasting wealth. Many CEOs and leaders built their empires during Sade Sati.', hi: 'गलत। शनि अनुशासन, कठोर परिश्रम और कर्म को पुरस्कृत करता है। योगकारक शनि (वृषभ/तुला लग्न) के लिए, साढ़े साती करियर सफलता, अधिकार और स्थायी धन ला सकती है।', sa: 'असत्यम्। शनिः अनुशासनं कठोरपरिश्रमं कर्म च पुरस्करोति।' },
    verdict: 'false',
  },
  {
    myth: { en: '"Avoid marriage during Sade Sati"', hi: '"साढ़े साती में विवाह से बचें"', sa: '"साढेसात्यां विवाहात् निवर्तत"' },
    truth: { en: 'FALSE. Many successful marriages happen during Sade Sati. Saturn brings commitment, stability, and seriousness to relationships — qualities that build lasting partnerships. The key is choosing a mature, compatible partner.', hi: 'गलत। कई सफल विवाह साढ़े साती में होते हैं। शनि सम्बन्धों में प्रतिबद्धता, स्थिरता और गम्भीरता लाता है — गुण जो स्थायी साझेदारी बनाते हैं।', sa: 'असत्यम्। अनेकानि सफलविवाहानि साढेसात्यां भवन्ति।' },
    verdict: 'false',
  },
  {
    myth: { en: '"Blue Sapphire always helps in Sade Sati"', hi: '"नीलम साढ़े साती में सदा मदद करता है"', sa: '"नीलमणिः साढेसात्यां सदा सहायते"' },
    truth: { en: 'DANGEROUS myth. Blue Sapphire amplifies Saturn\'s energy — if Saturn is malefic for your chart, it amplifies the NEGATIVE effects. For Cancer, Leo, Scorpio, and Sagittarius Lagnas, Blue Sapphire can be harmful. Always consult a qualified Jyotishi and do a trial period.', hi: 'खतरनाक मिथक। नीलम शनि की ऊर्जा बढ़ाता है — यदि शनि आपकी कुण्डली के लिए पाप है, तो यह नकारात्मक प्रभावों को बढ़ाता है। कर्क, सिंह, वृश्चिक और धनु लग्न के लिए नीलम हानिकारक हो सकता है।', sa: 'भयङ्करमिथकम्। नीलमणिः शनेः ऊर्जां वर्धयति — यदि शनिः कुण्डल्याः पापः, नकारात्मकप्रभावान् वर्धयति।' },
    verdict: 'dangerous',
  },
  {
    myth: { en: '"Nothing good can happen in Sade Sati"', hi: '"साढ़े साती में कुछ अच्छा नहीं हो सकता"', sa: '"साढेसात्यां किमपि शुभं न भवितुं शक्नोति"' },
    truth: { en: 'FALSE. Sade Sati is a period of karmic acceleration — it accelerates BOTH good and bad karma. If your karma is positive and your natal Saturn is well-placed, Sade Sati can be your most productive period. Saturn is the planet of hard-won achievement.', hi: 'गलत। साढ़े साती कार्मिक त्वरण की अवधि है — यह अच्छे और बुरे दोनों कर्मों को तेज़ करती है। यदि आपका कर्म सकारात्मक है और शनि सुस्थित है, तो साढ़े साती आपकी सबसे उत्पादक अवधि हो सकती है।', sa: 'असत्यम्। साढेसाती कार्मिकत्वरणकालः — शुभाशुभकर्माणि उभौ त्वरयति।' },
    verdict: 'false',
  },
];

/* ── Cross-references ─────────────────────────────────────────────── */
const CROSS_REFS = [
  { href: '/sade-sati', label: { en: 'Check Your Sade Sati', hi: 'अपनी साढ़े साती जाँचें', sa: 'स्वसाढेसातीं परीक्षत' }, desc: { en: 'Enter your Moon sign to check current Sade Sati status', hi: 'वर्तमान साढ़े साती स्थिति जाँचने के लिए अपनी चन्द्र राशि दर्ज करें', sa: 'वर्तमानसाढेसातीस्थितिं परीक्षितुं चन्द्रराशिं प्रविशत' } },
  { href: '/kundali', label: { en: 'Generate Your Kundali', hi: 'अपनी कुण्डली बनाएं', sa: 'स्वकुण्डलीं रचयत' }, desc: { en: 'See your natal Saturn and Moon for accurate Sade Sati analysis', hi: 'सटीक साढ़े साती विश्लेषण के लिए जन्म शनि और चन्द्र देखें', sa: 'यथार्थसाढेसातीविश्लेषणाय जन्मशनिचन्द्रौ पश्यत' } },
  { href: '/learn/grahas', label: { en: 'Saturn (Shani)', hi: 'शनि ग्रह', sa: 'शनिग्रहः' }, desc: { en: 'Deep dive into Saturn\'s significations', hi: 'शनि के कारकत्वों में गहरा अध्ययन', sa: 'शनेः कारकत्वेषु गभीरम् अध्ययनम्' } },
  { href: '/learn/dashas', label: { en: 'Dasha Systems', hi: 'दशा पद्धतियाँ', sa: 'दशापद्धतयः' }, desc: { en: 'How Sade Sati interacts with your running Dasha', hi: 'चल रही दशा के साथ साढ़े साती कैसे अन्तःक्रिया करती है', sa: 'चलन्त्या दशया सह साढेसाती कथम् अन्तःक्रियां करोति' } },
];

/* ── Page component ───────────────────────────────────────────────── */
export default function SadeSatiLearnPage() {
  const locale = useLocale() as Locale;
  const loc = (locale === 'hi' || locale === 'sa') ? 'hi' as const : 'en' as const;

  return (
    <div className="max-w-4xl mx-auto px-4 py-10 space-y-2">
      {/* ── Hero ──────────────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-10"
      >
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gold-primary/15 border border-gold-primary/30 mb-4">
          <Moon className="w-8 h-8 text-gold-primary" />
        </div>
        <h1
          className="text-3xl sm:text-4xl md:text-5xl font-bold text-gold-gradient mb-4"
          style={{ fontFamily: 'var(--font-heading)' }}
        >
          {L.title[locale]}
        </h1>
        <p className="text-text-secondary max-w-2xl mx-auto text-base sm:text-lg leading-relaxed">
          {L.subtitle[locale]}
        </p>
      </motion.div>

      {/* ── Section 1: What is Sade Sati? ─────────────────────────── */}
      <LessonSection number={1} title={L.whatTitle[locale]}>
        <p>{L.whatContent[locale]}</p>
        <p>{L.whatContent2[locale]}</p>

        {/* Visual timeline */}
        <div className="mt-6 p-4 rounded-xl bg-bg-primary/40 border border-gold-primary/10">
          <p className="text-gold-light text-xs font-semibold text-center mb-4">
            {locale === 'en' ? 'Sade Sati Transit Path' : 'साढ़े साती गोचर मार्ग'}
          </p>
          <div className="flex items-center justify-center gap-2 sm:gap-4 flex-wrap">
            {[
              { label: { en: '12th from Moon', hi: 'चन्द्र से 12वाँ' }, color: '#7dd3fc', years: '2.5 yr' },
              { label: { en: 'Moon Sign', hi: 'चन्द्र राशि' }, color: '#f97316', years: '2.5 yr' },
              { label: { en: '2nd from Moon', hi: 'चन्द्र से 2रा' }, color: '#86efac', years: '2.5 yr' },
            ].map((phase, i) => (
              <div key={i} className="flex items-center gap-2">
                <div className="text-center">
                  <div
                    className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl flex flex-col items-center justify-center border"
                    style={{ backgroundColor: phase.color + '10', borderColor: phase.color + '30', color: phase.color }}
                  >
                    <span className="text-xs sm:text-xs font-semibold">{phase.label[loc]}</span>
                    <span className="text-lg font-bold mt-1">{phase.years}</span>
                  </div>
                </div>
                {i < 2 && <ArrowRight className="w-4 h-4 text-gold-primary/40" />}
              </div>
            ))}
          </div>
          <p className="text-center text-gold-primary/60 text-xs font-mono mt-3">
            {locale === 'en' ? 'Total: 2.5 + 2.5 + 2.5 = 7.5 years' : 'कुल: 2.5 + 2.5 + 2.5 = 7.5 वर्ष'}
          </p>
        </div>
      </LessonSection>

      {/* ── Section 2: The Three Phases ────────────────────────────── */}
      <LessonSection number={2} title={L.phasesTitle[locale]}>
        <p>{L.phasesContent[locale]}</p>

        <div className="mt-6 space-y-4">
          {PHASES.map((phase, i) => (
            <motion.div
              key={phase.num}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.12 }}
              className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-6"
            >
              <div className="flex items-center gap-3 mb-3">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold"
                  style={{ backgroundColor: phase.color + '20', color: phase.color }}
                >
                  {phase.num}
                </div>
                <div>
                  <h4 className="text-gold-light font-semibold">{phase.name[locale]}</h4>
                  <span className="text-text-secondary/70 text-xs font-mono">{phase.transit[locale]}</span>
                </div>
              </div>
              <p className="text-text-secondary text-sm mb-3 leading-relaxed">{phase.themes[locale]}</p>
              <div className="p-3 rounded-lg bg-gold-primary/5 border border-gold-primary/10">
                <p className="text-gold-light/80 text-sm">
                  <span className="font-semibold">{locale === 'en' ? 'Advice: ' : 'सलाह: '}</span>
                  {phase.advice[locale]}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </LessonSection>

      {/* ── Section 3: Severity ────────────────────────────────────── */}
      <LessonSection number={3} title={L.severityTitle[locale]}>
        <p>{L.severityContent[locale]}</p>

        <div className="mt-6 overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="border-b border-gold-primary/20">
                <th className="text-left py-3 px-3 text-gold-light font-semibold">{locale === 'en' ? 'Factor' : 'कारक'}</th>
                <th className="text-left py-3 px-3 text-emerald-400 font-semibold">{locale === 'en' ? 'Mild Sade Sati' : 'हल्की साढ़े साती'}</th>
                <th className="text-left py-3 px-3 text-red-400 font-semibold">{locale === 'en' ? 'Severe Sade Sati' : 'कठिन साढ़े साती'}</th>
              </tr>
            </thead>
            <tbody>
              {SEVERITY_FACTORS.map((row, i) => (
                <motion.tr
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.06 }}
                  className="border-b border-gold-primary/5 hover:bg-gold-primary/5 transition-colors"
                >
                  <td className="py-3 px-3 text-gold-primary/80 font-medium">{row.factor[locale]}</td>
                  <td className="py-3 px-3 text-emerald-300/70">{row.mild[locale]}</td>
                  <td className="py-3 px-3 text-red-300/70">{row.severe[locale]}</td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </LessonSection>

      {/* ── Section 4: Life Cycle Patterns ─────────────────────────── */}
      <LessonSection number={4} title={L.lifeCycleTitle[locale]}>
        <p>{L.lifeCycleContent[locale]}</p>

        <div className="mt-6 space-y-4">
          {LIFE_CYCLES.map((lc, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="flex items-start gap-4 p-4 rounded-lg border border-gold-primary/10 bg-bg-primary/30"
            >
              <Clock className="w-5 h-5 text-gold-primary flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="text-gold-light font-semibold text-sm mb-1">{lc.cycle[locale]}</h4>
                <p className="text-text-secondary text-sm leading-relaxed">{lc.theme[locale]}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </LessonSection>

      {/* ── Section 5: Remedies ────────────────────────────────────── */}
      <LessonSection number={5} title={L.remediesTitle[locale]}>
        <p>{L.remediesContent[locale]}</p>

        <div className="mt-6 space-y-4">
          {REMEDIES.map((rem, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -15 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className={`bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5 border ${
                rem.icon === AlertTriangle ? 'border-amber-500/20 bg-amber-500/3' : 'border-gold-primary/10'
              }`}
            >
              <div className="flex items-start gap-3">
                <rem.icon className={`w-5 h-5 flex-shrink-0 mt-0.5 ${
                  rem.icon === AlertTriangle ? 'text-amber-400' : 'text-gold-primary'
                }`} />
                <div>
                  <h4 className="text-gold-light font-semibold text-sm mb-1">{rem.name[locale]}</h4>
                  <p className="text-text-secondary text-sm leading-relaxed">{rem.desc[locale]}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </LessonSection>

      {/* ── Section 6: Myths Debunked ─────────────────────────────── */}
      <LessonSection number={6} title={L.mythsTitle[locale]}>
        <p>{L.mythsContent[locale]}</p>

        <div className="mt-6 space-y-4">
          {MYTHS.map((m, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className={`rounded-xl p-5 border ${
                m.verdict === 'dangerous'
                  ? 'bg-red-500/5 border-red-500/20'
                  : 'bg-bg-primary/30 border-gold-primary/10'
              }`}
            >
              <div className="flex items-center gap-2 mb-2">
                {m.verdict === 'dangerous' ? (
                  <ShieldAlert className="w-5 h-5 text-red-400 flex-shrink-0" />
                ) : (
                  <CheckCircle className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                )}
                <h4 className="text-gold-light font-semibold text-sm">{m.myth[locale]}</h4>
              </div>
              <p className="text-text-secondary text-sm leading-relaxed ml-7">{m.truth[locale]}</p>
            </motion.div>
          ))}
        </div>
      </LessonSection>

      {/* ── Section 7: Cross References ───────────────────────────── */}
      <LessonSection number={7} title={L.crossRefTitle[locale]}>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {CROSS_REFS.map((ref) => (
            <Link
              key={ref.href}
              href={ref.href as '/sade-sati'}
              className="block p-4 rounded-lg border border-gold-primary/10 bg-bg-primary/30 hover:bg-gold-primary/10 hover:border-gold-primary/30 transition-all group"
            >
              <div className="text-gold-light font-semibold text-sm group-hover:text-gold-primary transition-colors">{ref.label[loc]}</div>
              <p className="text-text-secondary/75 text-xs mt-1">{ref.desc[loc]}</p>
            </Link>
          ))}
        </div>
      </LessonSection>

      {/* ── CTA ───────────────────────────────────────────────────── */}
      <div className="mt-6 text-center">
        <Link
          href="/sade-sati"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-gold-primary/10 border border-gold-primary/30 text-gold-light hover:bg-gold-primary/20 transition-colors text-sm font-medium"
        >
          {locale === 'en' ? 'Check Your Sade Sati Status' : 'अपनी साढ़े साती स्थिति जाँचें'}
        </Link>
      </div>
    </div>
  );
}
