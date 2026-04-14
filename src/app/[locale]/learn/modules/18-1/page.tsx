'use client';

import { tl } from '@/lib/utils/trilingual';
import ModuleContainer, { type ModuleMeta, type ModuleQuestion, useModuleLocale } from '@/components/learn/ModuleContainer';
import ExampleChart from '@/components/learn/ExampleChart';
import { isDevanagariLocale } from '@/lib/utils/locale-fonts';
import { lt } from '@/lib/learn/translations';
import type { LocaleText } from '@/lib/learn/translations';
import L from '@/messages/learn/modules/18-1.json';

const META: ModuleMeta = {
  id: 'mod_18_1', phase: 5, topic: 'Strength', moduleNumber: '18.1',
  title: L.title as unknown as ModuleMeta['title'],
  subtitle: L.subtitle as unknown as ModuleMeta['subtitle'],
  estimatedMinutes: 15,
  crossRefs: (L.crossRefs as unknown as Array<{ label: ModuleMeta['title']; href: string }>).map(cr => ({ label: cr.label, href: cr.href })),
};

const QUESTIONS: ModuleQuestion[] = (L.questions as unknown as ModuleQuestion[]);

function Page1() {
  const locale = useModuleLocale();
  const isHi = isDevanagariLocale(locale);
  return (
    <div className="space-y-6">
      <section>
        <h3 className="text-gold-light font-bold text-lg mb-3" style={{ fontFamily: 'var(--font-heading)' }}>
          {tl({ en: 'What is Shadbala?', hi: 'षड्बल क्या है?', sa: 'षड्बल क्या है?' }, locale)}
        </h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          {tl({ en: 'Shadbala (\u201Csix strengths\u201D) is the most comprehensive system in Vedic astrology for quantifying how powerful a planet truly is. A planet may sit in exaltation yet be combust, or occupy its own sign yet languish in a dusthana house. Shadbala resolves these contradictions by computing six independent measurements and summing them into a single composite score measured in shashtiamsas (sixtieths of a rupa).', hi: 'षड्बल (\u201Cछह शक्तियाँ\u201D) वैदिक ज्योतिष में ग्रह की वास्तविक शक्ति को परिमाणित करने की सर्वाधिक व्यापक पद्धति है। कोई ग्रह उच्च में हो सकता है पर अस्त भी, या स्वराशि में हो पर दुःस्थान में। षड्बल छह स्वतन्त्र माप गणनाओं को जोड़कर एकल समग्र अंक (षष्ट्यंश में) देता है जो इन विरोधाभासों को सुलझाता है।', sa: 'षड्बल (\u201Cछह शक्तियाँ\u201D) वैदिक ज्योतिष में ग्रह की वास्तविक शक्ति को परिमाणित करने की सर्वाधिक व्यापक पद्धति है। कोई ग्रह उच्च में हो सकता है पर अस्त भी, या स्वराशि में हो पर दुःस्थान में। षड्बल छह स्वतन्त्र माप गणनाओं को जोड़कर एकल समग्र अंक (षष्ट्यंश में) देता है जो इन विरोधाभासों को सुलझाता है।' }, locale)}
        </p>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          {isHi
            ? <>छह घटक हैं: <strong>स्थानबल</strong> (स्थिति) — 5 उप-भाग: उच्च, सप्तवर्गज, ओजा-युग्म, केन्द्रादि, द्रेक्काण। <strong>दिग्बल</strong> (दिशा) — बृहस्पति/बुध पूर्व में, सूर्य/मंगल दक्षिण में, शनि पश्चिम में, चन्द्र/शुक्र उत्तर में सबसे बलवान। <strong>कालबल</strong> (समय) — दिवस/रात्रि स्वामित्व, होरा, मास/वर्ष स्वामी। <strong>चेष्टाबल</strong> (गति) — वक्री ग्रह को अधिकतम शक्ति। <strong>नैसर्गिकबल</strong> (प्राकृतिक) — स्थिर मान, सूर्य सबसे बलवान, शनि सबसे दुर्बल। <strong>दृग्बल</strong> (दृष्टि) — शुभ दृष्टि जोड़ती है, पापी दृष्टि घटाती है। न्यूनतम प्रभावी सीमा 1.0 रूपा (60 षष्ट्यंश) है।</>
            : <>The six components are: <strong>Sthana Bala</strong> (positional) with 5 sub-parts &mdash; Uccha (exaltation), Saptavargaja (7 divisional charts), Ojha-Yugma (odd/even sign), Kendradi (angular placement), Drekkana (decanate). <strong>Dig Bala</strong> (directional) &mdash; Jupiter/Mercury strongest in the East (lagna), Sun/Mars in the South (10th), Saturn in the West (7th), Moon/Venus in the North (4th). <strong>Kala Bala</strong> (temporal) &mdash; day/night rulership, hora lord, month/year lords. <strong>Cheshta Bala</strong> (motional) &mdash; retrograde planets gain maximum strength. <strong>Naisargika Bala</strong> (natural) &mdash; fixed values, Sun strongest, Saturn weakest. <strong>Drig Bala</strong> (aspectual) &mdash; benefic aspects add, malefic aspects subtract.</>}
        </p>
      </section>
      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5">
        <h4 className="text-gold-dark text-xs uppercase tracking-widest font-bold mb-2">{tl({ en: 'Classical Origin', hi: 'शास्त्रीय उद्गम', sa: 'शास्त्रीय उद्गम' }, locale)}</h4>
        <p className="text-text-secondary text-sm leading-relaxed">
          {tl({ en: 'Shadbala originates from Parashara\u2019s Brihat Parashara Hora Shastra (BPHS), chapters 27-30, where Maharishi Parashara systematically defines each strength component. The system was later refined by Varahamihira in Brihat Jataka and by Nilakantha in Tajika Neelakanthi. The mathematical precision of Shadbala reflects the empirical astronomical tradition of ancient Indian scholars who sought to move beyond subjective judgment to measurable planetary potency.', hi: 'षड्बल का उद्गम पराशर की बृहत् पाराशर होरा शास्त्र (BPHS), अध्याय 27-30 से है, जहाँ महर्षि पराशर ने प्रत्येक बल घटक को व्यवस्थित रूप से परिभाषित किया। इस पद्धति को बाद में वराहमिहिर ने बृहत् जातक में और नीलकण्ठ ने ताजिक नीलकण्ठी में परिष्कृत किया। षड्बल की गणितीय सटीकता प्राचीन भारतीय विद्वानों की प्रायोगिक खगोलीय परम्परा को दर्शाती है।', sa: 'षड्बल का उद्गम पराशर की बृहत् पाराशर होरा शास्त्र (BPHS), अध्याय 27-30 से है, जहाँ महर्षि पराशर ने प्रत्येक बल घटक को व्यवस्थित रूप से परिभाषित किया। इस पद्धति को बाद में वराहमिहिर ने बृहत् जातक में और नीलकण्ठ ने ताजिक नीलकण्ठी में परिष्कृत किया। षड्बल की गणितीय सटीकता प्राचीन भारतीय विद्वानों की प्रायोगिक खगोलीय परम्परा को दर्शाती है।' }, locale)}
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
          {tl({ en: 'Computing Each Component', hi: 'प्रत्येक घटक की गणना', sa: 'प्रत्येक घटक की गणना' }, locale)}
        </h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          {tl({ en: 'Let us walk through a concrete calculation for Mars in Capricorn (exalted) placed in the 10th house of a daytime chart. Each of the six components contributes independently to the total score.', hi: 'आइये मकर राशि (उच्च) में दशम भाव में स्थित मंगल के लिए एक ठोस गणना देखें। छह में से प्रत्येक घटक कुल अंक में स्वतन्त्र रूप से योगदान करता है।', sa: 'आइये मकर राशि (उच्च) में दशम भाव में स्थित मंगल के लिए एक ठोस गणना देखें। छह में से प्रत्येक घटक कुल अंक में स्वतन्त्र रूप से योगदान करता है।' }, locale)}
        </p>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          {isHi
            ? <><strong>स्थानबल:</strong> उच्चबल — मंगल 28&deg; मकर (सटीक उच्च अंश) पर = 60 षष्ट्यंश। यह अधिकतम है। नीच बिन्दु (28&deg; कर्क) पर 0 होगा। सूत्र रैखिक है: शक्ति = 60 &times; (180 &minus; उच्च से दूरी) / 180।</>
            : <><strong>Sthana Bala (positional):</strong> Uccha Bala &mdash; Mars at 28&deg; Capricorn (exact exaltation degree) = 60 shashtiamsas. This is the maximum. At its debilitation point (28&deg; Cancer) it would score 0. The formula is linear: strength = 60 &times; (180 &minus; distance from exaltation) / 180.</>}
        </p>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          {isHi
            ? <><strong>दिग्बल:</strong> मंगल को दक्षिण (दशम भाव) में अधिकतम दिग्बल = 60 षष्ट्यंश मिलता है। विपरीत दिशा उत्तर (चतुर्थ भाव) में 0 होगा। हमारा मंगल दशम में है, अतः पूरे 60 अंक।</>
            : <><strong>Dig Bala (directional):</strong> Mars gains maximum Dig Bala in the South (10th house) = 60 shashtiamsas. In the opposite direction, North (4th house), it would score 0. Since our Mars IS in the 10th house, full 60 points.</>}
        </p>
        <p className="text-text-secondary text-sm leading-relaxed">
          {isHi
            ? <><strong>कालबल:</strong> मंगल रात्रिचर ग्रह है, अतः रात्रि कुण्डली में शक्ति प्राप्त करता है। दिवस कुण्डली में कम कालबल — लगभग 30 षष्ट्यंश। <strong>चेष्टाबल:</strong> यदि मंगल मार्गी (वक्री नहीं), मध्यम गति शक्ति ~30। <strong>नैसर्गिकबल:</strong> मंगल का स्थिर प्राकृतिक बल 17.14 षष्ट्यंश (7 ग्रहों में 6ठा)। <strong>दृग्बल:</strong> प्राप्त दृष्टियों पर निर्भर — बृहस्पति दृष्टि +15; शनि दृष्टि -15। काल्पनिक शुद्ध: +10।</>
            : <><strong>Kala Bala:</strong> Mars is a nocturnal planet, so it gains strength in a night chart. In a daytime chart, it gets reduced Kala Bala &mdash; approximately 30 shashtiamsas instead of 60. <strong>Cheshta Bala:</strong> If Mars is direct (not retrograde), moderate motional strength of ~30. <strong>Naisargika Bala:</strong> Mars has a fixed natural strength of 17.14 shashtiamsas (6th of 7 planets). <strong>Drig Bala:</strong> Depends on aspects received &mdash; if Jupiter aspects this Mars, add ~15; if Saturn aspects, subtract ~15. Hypothetical net: +10.</>}
        </p>
      </section>
      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5 border border-emerald-500/15">
        <h4 className="text-emerald-400 text-xs uppercase tracking-widest font-bold mb-3">{tl({ en: 'Worked Example', hi: 'कार्यरत उदाहरण', sa: 'कार्यरत उदाहरण' }, locale)}</h4>
        <ExampleChart
          ascendant={1}
          planets={{ 10: [2], 2: [4] }}
          title={tl({ en: 'Aries Lagna — Mars in 10th (Capricorn), Jupiter in 2nd', hi: 'मेष लग्न — मंगल दशम में (मकर), बृहस्पति द्वितीय में', sa: 'मेष लग्न — मंगल दशम में (मकर), बृहस्पति द्वितीय में' }, locale)}
          highlight={[10, 2]}
        />
        <p className="text-text-secondary text-xs leading-relaxed mb-2">
          <span className="text-gold-light font-medium">{tl({ en: 'Mars in Capricorn, 10th house, daytime chart, direct motion, Jupiter aspecting:', hi: 'मंगल मकर में, दशम भाव, दिवस कुण्डली, मार्गी गति, बृहस्पति दृष्टि:', sa: 'मंगल मकर में, दशम भाव, दिवस कुण्डली, मार्गी गति, बृहस्पति दृष्टि:' }, locale)}</span>
        </p>
        <p className="text-text-secondary text-xs leading-relaxed mb-1">{tl({ en: 'Sthana Bala: ~150 (Uccha 60 + Saptavargaja ~50 + Ojha-Yugma ~15 + Kendradi ~15 + Drekkana ~10)', hi: 'स्थानबल: ~150 (उच्च 60 + सप्तवर्गज ~50 + ओजा-युग्म ~15 + केन्द्रादि ~15 + द्रेक्काण ~10)', sa: 'स्थानबल: ~150 (उच्च 60 + सप्तवर्गज ~50 + ओजा-युग्म ~15 + केन्द्रादि ~15 + द्रेक्काण ~10)' }, locale)}</p>
        <p className="text-text-secondary text-xs leading-relaxed mb-1">{tl({ en: 'Dig Bala: 60 (10th house = South = maximum for Mars)', hi: 'दिग्बल: 60 (दशम भाव = दक्षिण = मंगल हेतु अधिकतम)', sa: 'दिग्बल: 60 (दशम भाव = दक्षिण = मंगल हेतु अधिकतम)' }, locale)}</p>
        <p className="text-text-secondary text-xs leading-relaxed mb-1">{tl({ en: 'Kala Bala: ~95 (day-night ~30 + hora ~10 + month ~20 + year ~20 + other ~15)', hi: 'कालबल: ~95 (दिवस-रात्रि ~30 + होरा ~10 + मास ~20 + वर्ष ~20 + अन्य ~15)', sa: 'कालबल: ~95 (दिवस-रात्रि ~30 + होरा ~10 + मास ~20 + वर्ष ~20 + अन्य ~15)' }, locale)}</p>
        <p className="text-text-secondary text-xs leading-relaxed mb-1">{tl({ en: 'Cheshta Bala: ~30 (direct motion, moderate speed)', hi: 'चेष्टाबल: ~30 (मार्गी गति, मध्यम वेग)', sa: 'चेष्टाबल: ~30 (मार्गी गति, मध्यम वेग)' }, locale)}</p>
        <p className="text-text-secondary text-xs leading-relaxed mb-1">{tl({ en: 'Naisargika Bala: 17.14 (fixed value for Mars)', hi: 'नैसर्गिकबल: 17.14 (मंगल का स्थिर मान)', sa: 'नैसर्गिकबल: 17.14 (मंगल का स्थिर मान)' }, locale)}</p>
        <p className="text-text-secondary text-xs leading-relaxed mb-2">{tl({ en: 'Drig Bala: ~10 (Jupiter aspect +15, minor malefic aspect -5)', hi: 'दृग्बल: ~10 (बृहस्पति दृष्टि +15, लघु पापी दृष्टि -5)', sa: 'दृग्बल: ~10 (बृहस्पति दृष्टि +15, लघु पापी दृष्टि -5)' }, locale)}</p>
        <p className="text-text-secondary text-xs leading-relaxed font-medium">
          {isHi
            ? <><span className="text-gold-light">कुल: ~362 षष्ट्यंश = 6.03 रूपा।</span> मंगल की न्यूनतम आवश्यकता 5.0 रूपा है, अतः यह मंगल प्रभावी और बलवान है।</>
            : 'Total: ~362 shashtiamsas = 6.03 rupas. Mars minimum requirement is 5.0 rupas, so this Mars is effective and strong.'}
        </p>
      </section>
      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5 border border-red-500/15">
        <h4 className="text-red-400 text-xs uppercase tracking-widest font-bold mb-2">{tl({ en: 'Common Misconceptions', hi: 'सामान्य भ्रम', sa: 'सामान्य भ्रम' }, locale)}</h4>
        <p className="text-text-secondary text-sm leading-relaxed">
          {tl({ en: 'Many beginners assume that an exalted planet is automatically the strongest in the chart. Exaltation only contributes to Uccha Bala (one sub-component of Sthana Bala). A debilitated planet with strong Dig Bala, Kala Bala, and benefic Drig Bala can outperform an exalted planet that is combust, retrograde in an unfavorable direction, and aspected by malefics. Shadbala\u2019s whole purpose is to go beyond simplistic single-factor assessments.', hi: 'कई आरम्भकर्ता मानते हैं कि उच्च ग्रह स्वतः कुण्डली में सबसे बलवान होता है। उच्च केवल उच्चबल (स्थानबल का एक उप-घटक) में योगदान करता है। एक नीच ग्रह जिसका दिग्बल, कालबल और शुभ दृग्बल प्रबल हो, वह उच्च ग्रह से श्रेष्ठ प्रदर्शन कर सकता है जो अस्त, प्रतिकूल दिशा में वक्री और पापी दृष्टि से ग्रस्त हो। षड्बल का सम्पूर्ण उद्देश्य सरल एकल-कारक मूल्यांकन से परे जाना है।', sa: 'कई आरम्भकर्ता मानते हैं कि उच्च ग्रह स्वतः कुण्डली में सबसे बलवान होता है। उच्च केवल उच्चबल (स्थानबल का एक उप-घटक) में योगदान करता है। एक नीच ग्रह जिसका दिग्बल, कालबल और शुभ दृग्बल प्रबल हो, वह उच्च ग्रह से श्रेष्ठ प्रदर्शन कर सकता है जो अस्त, प्रतिकूल दिशा में वक्री और पापी दृष्टि से ग्रस्त हो। षड्बल का सम्पूर्ण उद्देश्य सरल एकल-कारक मूल्यांकन से परे जाना है।' }, locale)}
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
          {tl({ en: 'Interpretation and Practical Use', hi: 'व्याख्या एवं व्यावहारिक उपयोग', sa: 'व्याख्या एवं व्यावहारिक उपयोग' }, locale)}
        </h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          {tl({ en: 'The planet with the highest total Shadbala is the chart\u2019s \u201Ccaptain\u201D \u2014 its significations dominate the native\u2019s life. If Jupiter leads, the person gravitates toward wisdom, teaching, and expansion. If Venus leads, aesthetics, relationships, and comfort define them. The weakest planet reveals the life area requiring the most conscious effort and remedial measures.', hi: 'सर्वाधिक कुल षड्बल वाला ग्रह कुण्डली का \u201Cकप्तान\u201D है \u2014 उसके कारकत्व जातक के जीवन में प्रभुत्व रखते हैं। यदि बृहस्पति अग्रणी हो तो व्यक्ति ज्ञान, शिक्षण और विस्तार की ओर आकर्षित होता है। यदि शुक्र अग्रणी हो तो सौन्दर्य, सम्बन्ध और सुख परिभाषित करते हैं। सबसे दुर्बल ग्रह उस जीवन क्षेत्र को दर्शाता है जिसमें सबसे अधिक सचेत प्रयास और उपचारात्मक उपायों की आवश्यकता है।', sa: 'सर्वाधिक कुल षड्बल वाला ग्रह कुण्डली का \u201Cकप्तान\u201D है \u2014 उसके कारकत्व जातक के जीवन में प्रभुत्व रखते हैं। यदि बृहस्पति अग्रणी हो तो व्यक्ति ज्ञान, शिक्षण और विस्तार की ओर आकर्षित होता है। यदि शुक्र अग्रणी हो तो सौन्दर्य, सम्बन्ध और सुख परिभाषित करते हैं। सबसे दुर्बल ग्रह उस जीवन क्षेत्र को दर्शाता है जिसमें सबसे अधिक सचेत प्रयास और उपचारात्मक उपायों की आवश्यकता है।' }, locale)}
        </p>
        <p className="text-text-secondary text-sm leading-relaxed">
          {tl({ en: 'Shadbala is particularly powerful for resolving contradictions: an exalted but combust planet, a planet in its own sign but in a dusthana, a retrograde planet in debilitation. In each case, the six-fold analysis provides a definitive net score that clarifies whether the planet functions as strong or weak in practice.', hi: 'षड्बल विशेष रूप से विरोधाभासों को सुलझाने में शक्तिशाली है: उच्च पर अस्त ग्रह, स्वराशि में पर दुःस्थान में, नीच में वक्री ग्रह। प्रत्येक स्थिति में छह-आयामी विश्लेषण एक निर्णायक शुद्ध अंक देता है जो स्पष्ट करता है कि ग्रह व्यवहार में बलवान कार्य करता है या दुर्बल।', sa: 'षड्बल विशेष रूप से विरोधाभासों को सुलझाने में शक्तिशाली है: उच्च पर अस्त ग्रह, स्वराशि में पर दुःस्थान में, नीच में वक्री ग्रह। प्रत्येक स्थिति में छह-आयामी विश्लेषण एक निर्णायक शुद्ध अंक देता है जो स्पष्ट करता है कि ग्रह व्यवहार में बलवान कार्य करता है या दुर्बल।' }, locale)}
        </p>
      </section>
      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5 border border-blue-500/15">
        <h4 className="text-blue-300 text-xs uppercase tracking-widest font-bold mb-2">{tl({ en: 'Modern Relevance', hi: 'आधुनिक प्रासंगिकता', sa: 'आधुनिक प्रासंगिकता' }, locale)}</h4>
        <p className="text-text-secondary text-sm leading-relaxed">
          {tl({ en: 'Shadbala has gained renewed interest in the age of computation. Before computers, calculating all six components for all seven planets was a tedious multi-hour task done only by advanced pandits. Today, our Kundali engine computes complete Shadbala in milliseconds and displays it in the Strength tab. This democratization means every user can access the same depth of analysis that was once reserved for royal court astrologers. The planetary strength ranking directly affects our Tippanni commentary, dasha predictions, and remedy recommendations.', hi: 'कम्प्यूटर युग में षड्बल को नवीन रुचि प्राप्त हुई है। कम्प्यूटर से पहले, सात ग्रहों के सभी छह घटकों की गणना कई घण्टों का श्रमसाध्य कार्य था जो केवल उन्नत पण्डित करते थे। आज हमारा कुण्डली इंजन मिलीसेकण्ड में पूर्ण षड्बल गणना करता है और बल टैब में प्रदर्शित करता है। यह लोकतान्त्रीकरण हर उपयोगकर्ता को वही विश्लेषण गहराई प्रदान करता है जो कभी राजदरबारी ज्योतिषियों के लिए आरक्षित थी।', sa: 'कम्प्यूटर युग में षड्बल को नवीन रुचि प्राप्त हुई है। कम्प्यूटर से पहले, सात ग्रहों के सभी छह घटकों की गणना कई घण्टों का श्रमसाध्य कार्य था जो केवल उन्नत पण्डित करते थे। आज हमारा कुण्डली इंजन मिलीसेकण्ड में पूर्ण षड्बल गणना करता है और बल टैब में प्रदर्शित करता है। यह लोकतान्त्रीकरण हर उपयोगकर्ता को वही विश्लेषण गहराई प्रदान करता है जो कभी राजदरबारी ज्योतिषियों के लिए आरक्षित थी।' }, locale)}
        </p>
      </section>
    </div>
  );
}

export default function Module18_1Page() {
  return <ModuleContainer meta={META} pages={[<Page1 key="p1" />, <Page2 key="p2" />, <Page3 key="p3" />]} questions={QUESTIONS} />;
}
