'use client';

import { tl } from '@/lib/utils/trilingual';
import ModuleContainer, { type ModuleMeta, type ModuleQuestion, useModuleLocale } from '@/components/learn/ModuleContainer';
import { isDevanagariLocale } from '@/lib/utils/locale-fonts';
import { lt } from '@/lib/learn/translations';
import type { LocaleText } from '@/lib/learn/translations';
import L from '@/messages/learn/modules/29-1.json';

const META: ModuleMeta = {
  id: 'mod_29_1', phase: 8, topic: 'Medical Jyotish', moduleNumber: '29.1',
  title: L.title as Record<string, string>,
  subtitle: L.subtitle as Record<string, string>,
  estimatedMinutes: 14,
  crossRefs: [
    { label: L.crossRefs[0].label as Record<string, string>, href: '/learn/modules/10-1' },
    { label: L.crossRefs[1].label as Record<string, string>, href: '/learn/modules/29-2' },
  ],
};

const QUESTIONS: ModuleQuestion[] = [
  {
    id: 'q29_1_01', type: 'mcq',
    question: L.questions[0].question as Record<string, string>,
    options: L.questions[0].options as LocaleText[],
    correctAnswer: 1,
    explanation: L.questions[0].explanation as Record<string, string>,
  },
  {
    id: 'q29_1_02', type: 'mcq',
    question: L.questions[1].question as Record<string, string>,
    options: L.questions[1].options as LocaleText[],
    correctAnswer: 2,
    explanation: L.questions[1].explanation as Record<string, string>,
  },
  {
    id: 'q29_1_03', type: 'mcq',
    question: L.questions[2].question as Record<string, string>,
    options: L.questions[2].options as LocaleText[],
    correctAnswer: 0,
    explanation: L.questions[2].explanation as Record<string, string>,
  },
  {
    id: 'q29_1_04', type: 'true_false',
    question: L.questions[3].question as Record<string, string>,
    correctAnswer: 0,
    explanation: L.questions[3].explanation as Record<string, string>,
  },
];

/* ---- Planet-Body mapping (hoisted) ---- */
const PLANET_BODY_MAP = [
  { planet: 'Sun', planetHi: 'सूर्य', body: 'Heart, spine, right eye, vitality, bones', bodyHi: 'हृदय, रीढ़, दाहिनी आँख, जीवन शक्ति, अस्थि' },
  { planet: 'Moon', planetHi: 'चन्द्र', body: 'Mind, blood, left eye, breasts, fluids', bodyHi: 'मन, रक्त, बाईं आँख, स्तन, शारीरिक तरल' },
  { planet: 'Mars', planetHi: 'मंगल', body: 'Muscles, blood (red cells), marrow, bile', bodyHi: 'माँसपेशियाँ, रक्त (लाल कोशिकाएँ), मज्जा, पित्त' },
  { planet: 'Mercury', planetHi: 'बुध', body: 'Nervous system, skin, lungs, speech', bodyHi: 'तन्त्रिका तन्त्र, त्वचा, फेफड़े, वाणी' },
  { planet: 'Jupiter', planetHi: 'गुरु', body: 'Liver, fat, ears, thighs, pancreas', bodyHi: 'यकृत, वसा, कान, जंघा, अग्न्याशय' },
  { planet: 'Venus', planetHi: 'शुक्र', body: 'Reproductive system, kidneys, face, throat', bodyHi: 'प्रजनन तन्त्र, गुर्दे, मुख, कण्ठ' },
  { planet: 'Saturn', planetHi: 'शनि', body: 'Bones, joints, teeth, chronic disease, aging', bodyHi: 'हड्डियाँ, जोड़, दाँत, दीर्घकालिक रोग, वृद्धावस्था' },
  { planet: 'Rahu', planetHi: 'राहु', body: 'Poisons, allergies, epidemics, mysterious illness', bodyHi: 'विष, एलर्जी, महामारी, रहस्यमय रोग' },
  { planet: 'Ketu', planetHi: 'केतु', body: 'Wounds, viral infections, psychosomatic illness', bodyHi: 'घाव, वायरल संक्रमण, मनोदैहिक रोग' },
];

function Page1() {
  const locale = useModuleLocale();
  const isHi = isDevanagariLocale(locale);
  return (
    <div className="space-y-6">
      <section>
        <h3 className="text-gold-light font-bold text-lg mb-3" style={{ fontFamily: 'var(--font-heading)' }}>
          {tl({ en: 'Planets and the Body', hi: 'ग्रह और शरीर', sa: 'ग्रह और शरीर' }, locale)}
        </h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          {isHi
            ? <>चिकित्सा ज्योतिष (Medical Astrology) वैदिक ज्योतिष की वह शाखा है जो जन्म कुण्डली से स्वास्थ्य प्रवृत्तियों, रोग सम्भावनाओं और उपचार समय का विश्लेषण करती है। आयुर्वेद और ज्योतिष में मौलिक सम्बन्ध है — दोनों पंचभूत (पाँच तत्व) और त्रिदोष (वात, पित्त, कफ) सिद्धान्त पर आधारित हैं। प्रत्येक ग्रह विशिष्ट शारीरिक अंगों, अंग प्रणालियों और रोग प्रकारों से सम्बन्धित है।</>
            : <>Medical Jyotish is the branch of Vedic astrology that analyzes health tendencies, disease probabilities, and healing timing from the birth chart. There is a fundamental connection between Ayurveda and Jyotish — both are based on the Pancha Bhuta (five elements) and Tridosha (Vata, Pitta, Kapha) theory. Each planet corresponds to specific body parts, organ systems, and disease types.</>}
        </p>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5">
        <h4 className="text-gold-dark text-xs uppercase tracking-widest font-bold mb-3">
          {tl({ en: 'Planet-Body Correspondences', hi: 'ग्रह-शरीर सम्बन्ध', sa: 'ग्रह-शरीर सम्बन्ध' }, locale)}
        </h4>
        <div className="space-y-1.5">
          {PLANET_BODY_MAP.map((row, i) => (
            <p key={i} className="text-text-secondary text-xs leading-relaxed">
              <span className="text-gold-light font-semibold">{isHi ? row.planetHi : row.planet}:</span>{' '}
              {isHi ? row.bodyHi : row.body}
            </p>
          ))}
        </div>
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
          {tl({ en: 'Disease Houses: 6th, 8th & 12th', hi: 'रोग भाव: 6, 8 और 12', sa: 'रोग भाव: 6, 8 और 12' }, locale)}
        </h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          {isHi
            ? <>स्वास्थ्य विश्लेषण में तीन "दुस्थान" भाव केन्द्रीय हैं। छठा भाव (शत्रु/रोग भाव) तीव्र रोग, दैनिक स्वास्थ्य समस्याएँ और प्रतिरक्षा प्रणाली दिखाता है। आठवाँ भाव (आयु भाव) दीर्घकालिक रोग, शल्य चिकित्सा, दुर्घटनाएँ और आयु दर्शाता है। बारहवाँ भाव (व्यय भाव) अस्पताल में भर्ती, शय्या सुख की हानि और स्वास्थ्य पर व्यय को इंगित करता है।</>
            : <>Three &quot;dusthana&quot; houses are central to health analysis. The 6th house (Shatru/Roga Bhava) shows acute illness, daily health issues, and immunity. The 8th house (Ayu Bhava) indicates chronic disease, surgery, accidents, and longevity. The 12th house (Vyaya Bhava) points to hospitalization, bed pleasures lost, and health expenditure.</>}
        </p>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-emerald-500/15 rounded-xl p-5">
        <h4 className="text-emerald-400 text-xs uppercase tracking-widest font-bold mb-3">
          {tl({ en: 'Rashi & Body Parts', hi: 'राशि और शरीर के अंग', sa: 'राशि और शरीर के अंग' }, locale)}
        </h4>
        <p className="text-text-secondary text-xs leading-relaxed mb-2">
          {isHi
            ? <>मेष = सिर, वृषभ = मुख/गला, मिथुन = भुजाएँ/फेफड़े, कर्क = छाती/पेट, सिंह = हृदय/पीठ, कन्या = आँतें/तन्त्रिकाएँ, तुला = गुर्दे/कमर, वृश्चिक = प्रजनन अंग, धनु = जंघाएँ/कूल्हे, मकर = घुटने/हड्डियाँ, कुम्भ = पिण्डलियाँ/टखने, मीन = पैर/लसीका तन्त्र। यह "काल पुरुष" (ब्रह्माण्डीय पुरुष) सिद्धान्त है — मेष सिर से प्रारम्भ होता है और मीन पैरों पर समाप्त होता है।</>
            : <>Aries = head, Taurus = face/throat, Gemini = arms/lungs, Cancer = chest/stomach, Leo = heart/back, Virgo = intestines/nerves, Libra = kidneys/lower back, Scorpio = reproductive organs, Sagittarius = thighs/hips, Capricorn = knees/bones, Aquarius = calves/ankles, Pisces = feet/lymphatic system. This is the &quot;Kalapurusha&quot; (cosmic person) principle — Aries begins at the head and Pisces ends at the feet.</>}
        </p>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-red-500/15 rounded-xl p-5">
        <h4 className="text-red-400 text-xs uppercase tracking-widest font-bold mb-3">
          {tl({ en: 'Important Disclaimer', hi: 'महत्वपूर्ण अस्वीकरण', sa: 'महत्वपूर्ण अस्वीकरण' }, locale)}
        </h4>
        <p className="text-text-secondary text-xs leading-relaxed">
          {tl({ en: 'Medical Jyotish is a traditional knowledge system and should NEVER replace professional medical advice, diagnosis, or treatment. It can offer insight into health tendencies and timing, but all health decisions must be made in consultation with qualified medical professionals. Jyotish is a complementary perspective, not a substitute for modern medicine.', hi: 'चिकित्सा ज्योतिष एक पारम्परिक ज्ञान प्रणाली है और इसे कभी भी पेशेवर चिकित्सा सलाह, निदान या उपचार का विकल्प नहीं बनाना चाहिए। यह स्वास्थ्य प्रवृत्तियों और समय के बारे में अन्तर्दृष्टि दे सकती है, परन्तु सभी स्वास्थ्य निर्णय योग्य चिकित्सा पेशेवरों के परामर्श से लिए जाने चाहिए।', sa: 'चिकित्सा ज्योतिष एक पारम्परिक ज्ञान प्रणाली है।' }, locale)}
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
          {tl({ en: 'Timing Health Events', hi: 'स्वास्थ्य घटनाओं का समय', sa: 'स्वास्थ्य घटनाओं का समय' }, locale)}
        </h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          {isHi
            ? <>स्वास्थ्य समस्याएँ विशिष्ट दशा और गोचर में प्रकट होती हैं। 6वें या 8वें भावेश की दशा/अन्तर्दशा में रोग की सम्भावना बढ़ती है। शनि का 6वें या 8वें भाव पर गोचर दीर्घकालिक स्वास्थ्य चुनौतियों का संकेत है। साढ़े साती और कण्टक शनि काल में विशेष सतर्कता आवश्यक है। मंगल-शनि की युति या दृष्टि शल्य चिकित्सा या दुर्घटना का संकेत हो सकती है।</>
            : <>Health problems manifest during specific dashas and transits. The dasha/antardasha of the 6th or 8th lord increases the probability of illness. Saturn transiting the 6th or 8th house signals chronic health challenges. Sade Sati and Kantaka Shani periods require special vigilance. Mars-Saturn conjunction or aspect can indicate surgery or accidents. The key insight: medical Jyotish is about probability and timing, not inevitability.</>}
        </p>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-purple-500/15 rounded-xl p-5">
        <h4 className="text-purple-300 text-xs uppercase tracking-widest font-bold mb-3">
          {tl({ en: 'Longevity Assessment (Ayurdaya)', hi: 'आयु निर्धारण (आयुर्दाय)', sa: 'आयु निर्धारण (आयुर्दाय)' }, locale)}
        </h4>
        <p className="text-text-secondary text-xs leading-relaxed">
          {isHi
            ? <>BPHS में आयुर्दाय (आयु गणना) के कई सूत्र हैं। तीन श्रेणियाँ हैं: अल्पायु (0-32), मध्यायु (32-64), और दीर्घायु (64-100+)। लग्नेश, 8वें भावेश, और शनि की स्थिति इसमें प्रमुख हैं। हालाँकि, आधुनिक ज्योतिषी आयु भविष्यवाणी में अत्यन्त सतर्क रहते हैं — चिकित्सा विज्ञान ने जीवनकाल को मूलभूत रूप से बदल दिया है, और किसी की मृत्यु का समय बताना नैतिक रूप से संवेदनशील विषय है।</>
            : <>BPHS contains multiple formulas for Ayurdaya (lifespan calculation). Three categories exist: Alpaayu (0-32), Madhyaayu (32-64), and Deerghayu (64-100+). The Lagna lord, 8th lord, and Saturn&apos;s position are key factors. However, modern astrologers are extremely cautious with longevity prediction — medical science has fundamentally changed lifespans, and predicting someone&apos;s death is an ethically sensitive matter that responsible astrologers approach with great care.</>}
        </p>
      </section>
    </div>
  );
}

export default function Module29_1Page() {
  return <ModuleContainer meta={META} pages={[<Page1 key="p1" />, <Page2 key="p2" />, <Page3 key="p3" />]} questions={QUESTIONS} />;
}
