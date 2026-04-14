'use client';

import { tl } from '@/lib/utils/trilingual';
import ModuleContainer, { type ModuleMeta, type ModuleQuestion, useModuleLocale } from '@/components/learn/ModuleContainer';
import ExampleChart from '@/components/learn/ExampleChart';
import { isDevanagariLocale } from '@/lib/utils/locale-fonts';
import { lt } from '@/lib/learn/translations';
import type { LocaleText } from '@/lib/learn/translations';
import L from '@/messages/learn/modules/18-2.json';

const META: ModuleMeta = {
  id: 'mod_18_2', phase: 5, topic: 'Strength', moduleNumber: '18.2',
  title: L.title as unknown as ModuleMeta['title'],
  subtitle: L.subtitle as unknown as ModuleMeta['subtitle'],
  estimatedMinutes: 12,
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
          {tl({ en: 'House Strength vs. Planet Strength', hi: 'भाव शक्ति बनाम ग्रह शक्ति', sa: 'भाव शक्ति बनाम ग्रह शक्ति' }, locale)}
        </h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          {isHi
            ? <>षड्बल बताता है कि ग्रह कितना बलवान है। परन्तु ज्योतिष में बारह भाव जीवन के बारह क्षेत्रों का प्रतिनिधित्व करते हैं &mdash; स्वयं, धन, भाई, सुख, सन्तान, शत्रु, विवाह, आयु, भाग्य, कर्म, लाभ और मोक्ष। कोई भाव बलवान हो सकता है भले ही उसका स्वामी मध्यम हो, या दुर्बल हो सकता है शक्तिशाली स्वामी होने पर भी, क्योंकि भाव शक्ति तीन स्वतन्त्र कारकों का समग्र है।</>
            : <>Shadbala tells us how strong a planet is. But in Jyotish, the twelve houses (bhavas) represent the twelve domains of life &mdash; self, wealth, siblings, happiness, children, enemies, marriage, longevity, fortune, career, gains, and liberation. A house can be strong even if its lord is middling, or weak despite having a powerful lord, because house strength is a composite of three independent factors.</>}
        </p>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          {isHi
            ? <><strong>भावबल</strong> = <strong>भावाधिपति बल</strong> (स्वामी का षड्बल योगदान) + <strong>भाव दिग्बल</strong> (भाव की अन्तर्निहित स्थिति शक्ति) + <strong>भाव दृष्टि बल</strong> (भाव को प्राप्त शुद्ध दृष्टियाँ)। दुर्बल स्वामी पर प्रबल शुभ दृष्टि (जैसे सप्तम पर बृहस्पति दृष्टि) वाला भाव भी अच्छा कार्य कर सकता है। इसके विपरीत, उत्कृष्ट षड्बल वाले स्वामी का भाव जो शनि और मंगल की दृष्टि प्राप्त करता है, कम प्रदर्शन कर सकता है।</>
            : <><strong>Bhavabala</strong> = <strong>Bhavadhipati Bala</strong> (lord&apos;s Shadbala contribution) + <strong>Bhava Dig Bala</strong> (inherent positional strength of the house) + <strong>Bhava Drishti Bala</strong> (net aspects received by the house). A house with a weak lord but strong benefic aspects (Jupiter aspecting the 7th, for example) can still function well. Conversely, a house whose lord has excellent Shadbala but receives Saturn&apos;s and Mars&apos;s aspects may underperform.</>}
        </p>
      </section>
      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5">
        <h4 className="text-gold-dark text-xs uppercase tracking-widest font-bold mb-2">{tl({ en: 'Classical Origin', hi: 'शास्त्रीय उद्गम', sa: 'शास्त्रीय उद्गम' }, locale)}</h4>
        <p className="text-text-secondary text-sm leading-relaxed">
          {isHi
            ? <>भावबल BPHS (बृहत् पाराशर होरा शास्त्र) में षड्बल के स्वाभाविक विस्तार के रूप में परिभाषित है। पराशर ने पहचाना कि केवल ग्रह शक्ति जानना अपर्याप्त है &mdash; ज्योतिषी को यह भी जानना चाहिए कि कौन-से जीवन क्षेत्र बलवान या दुर्बल हैं। त्रिपक्षीय सूत्र (स्वामी बल + स्थिति गरिमा + दृष्टि प्रभाव) उन तीन तरीकों को सुन्दर रूप से पकड़ता है जिनसे भाव शक्ति प्राप्त कर सकता है।</>
            : <>Bhavabala is defined in BPHS (Brihat Parashara Hora Shastra) as a natural extension of Shadbala. Parashara recognized that knowing planetary strength alone is insufficient &mdash; the astrologer must also know which life domains are strong or weak. The tripartite formula (lord strength + positional dignity + aspectual influence) elegantly captures the three ways a house can derive power, mirroring the holistic approach of Vedic philosophy.</>}
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
          {isHi
            ? <><strong>भावाधिपति बल:</strong> स्वामी के कुल षड्बल को आनुपातिकता गुणक से मापकर भाव में उसका योगदान निकाला जाता है। यदि सप्तमेश (जैसे शुक्र) का कुल षड्बल 400 षष्ट्यंश है, तो उसका भावाधिपति योगदान आनुपातिक रूप से उच्च है। यदि वही स्वामी केवल 200 अंकित है, तो भाव कमजोर नींव से आरम्भ होता है।</>
            : <><strong>Bhavadhipati Bala:</strong> The lord&apos;s total Shadbala is scaled by a proportionality factor to derive its contribution to the house. If the 7th lord (Venus, for example) has a total Shadbala of 400 shashtiamsas, its Bhavadhipati contribution is proportionally high. If the same lord scores only 200, the house starts with a weaker foundation.</>}
        </p>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          {isHi
            ? <><strong>भाव दिग्बल:</strong> भावों की अन्तर्निहित स्थिति शक्ति होती है। प्रथम और सप्तम भाव (क्षितिज अक्ष) अन्तर्निहित रूप से सबसे बलवान हैं। चतुर्थ और दशम (याम्योत्तर अक्ष) उसके बाद। दुःस्थान भाव (6, 8, 12) की अन्तर्निहित दिग्बल सबसे कम है। यह एक स्थिर संरचनात्मक घटक है जो कुण्डलियों में नहीं बदलता।</>
            : <><strong>Bhava Dig Bala:</strong> Houses have inherent positional strength. The 1st and 7th houses (the horizon axis) are inherently strongest. The 4th and 10th (meridian axis) follow. The dusthana houses (6th, 8th, 12th) have the lowest inherent Dig Bala. This is a fixed structural component that does not change between charts.</>}
        </p>
      </section>
      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5 border border-emerald-500/15">
        <h4 className="text-emerald-400 text-xs uppercase tracking-widest font-bold mb-3">{tl({ en: 'Worked Example: 7th House for Marriage', hi: 'कार्यरत उदाहरण: विवाह हेतु सप्तम भाव', sa: 'कार्यरत उदाहरण: विवाह हेतु सप्तम भाव' }, locale)}</h4>
        <ExampleChart
          ascendant={1}
          planets={{ 12: [5], 5: [4], 3: [6] }}
          title={tl({ en: 'Aries Lagna — Venus in Pisces (12th), Jupiter in 5th, Saturn in 3rd', hi: 'मेष लग्न — शुक्र मीन में (12वें), बृहस्पति 5वें में, शनि 3रे में', sa: 'मेष लग्न — शुक्र मीन में (12वें), बृहस्पति 5वें में, शनि 3रे में' }, locale)}
          highlight={[7, 12]}
        />
        <p className="text-text-secondary text-xs leading-relaxed mb-2">
          <span className="text-gold-light font-medium">Chart: Aries Lagna, 7th lord Venus in Pisces (exalted), Jupiter aspects the 7th house, Saturn also aspects the 7th.</span>
        </p>
        <p className="text-text-secondary text-xs leading-relaxed mb-1">Bhavadhipati Bala: Venus (exalted, strong Shadbala ~420) contributes high lord strength &mdash; approximately 70 shashtiamsas scaled.</p>
        <p className="text-text-secondary text-xs leading-relaxed mb-1">Bhava Dig Bala: 7th house = horizon axis = inherently strong &mdash; approximately 50 shashtiamsas.</p>
        <p className="text-text-secondary text-xs leading-relaxed mb-1">Bhava Drishti Bala: Jupiter full aspect = +60, Saturn full aspect = -60, net = 0 shashtiamsas.</p>
        <p className="text-text-secondary text-xs leading-relaxed mb-2 font-medium">
          {isHi
            ? <><span className="text-gold-light">कुल सप्तम भावबल: ~120 षष्ट्यंश।</span> मध्यम-से-अच्छा। विवाह बलवान स्वामी द्वारा समर्थित है, पर बृहस्पति की सुरक्षा के बावजूद शनि की दृष्टि कुछ विलम्ब कर सकती है।</>
            : <>Total 7th Bhavabala: ~120 shashtiamsas. Moderate-to-good. Marriage is supported by the strong lord, but Saturn&apos;s aspect may cause some delays despite Jupiter&apos;s protection.</>}
        </p>
      </section>
      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5 border border-red-500/15">
        <h4 className="text-red-400 text-xs uppercase tracking-widest font-bold mb-2">{tl({ en: 'Common Misconceptions', hi: 'सामान्य भ्रम', sa: 'सामान्य भ्रम' }, locale)}</h4>
        <p className="text-text-secondary text-sm leading-relaxed">
          {isHi
            ? <>एक सामान्य त्रुटि भाव शक्ति को उसमें स्थित ग्रहों की संख्या से समकक्ष करना है। तीन ग्रहों वाला भाव स्वतः उस रिक्त भाव से बलवान नहीं है जिसके स्वामी का उत्कृष्ट षड्बल हो और बृहस्पति की दृष्टि प्राप्त हो। अधिभोग भाव में सक्रियता बनाता है, पर भावबल भाव की सकारात्मक परिणाम देने की अन्तर्निहित क्षमता मापता है। पापी ग्रहों से भरा भाव वास्तव में सुदृष्ट रिक्त भाव से कम भावबल रख सकता है।</>
            : <>A frequent error is equating house strength with the number of planets occupying it. A house with three planets in it is not automatically stronger than an empty house whose lord has excellent Shadbala and receives Jupiter&apos;s aspect. Occupancy creates activity in a house, but Bhavabala measures the house&apos;s inherent capacity to deliver positive results. An overcrowded house with malefic occupants can actually have lower Bhavabala than a well-aspected empty house.</>}
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
          {tl({ en: 'Practical Interpretation', hi: 'व्यावहारिक व्याख्या', sa: 'व्यावहारिक व्याख्या' }, locale)}
        </h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          {isHi
            ? <>कुण्डली का सबसे बलवान भाव सबसे अधिक स्वाभाविक सफलता के जीवन क्षेत्र को दर्शाता है &mdash; वह क्षेत्र जहाँ कार्य न्यूनतम प्रतिरोध से प्रवाहित होते हैं। यदि दशम भाव अग्रणी है तो करियर सहज आता है। यदि द्वितीय भाव सबसे बलवान है तो धन संचय स्वाभाविक है। सबसे दुर्बल भाव इंगित करता है कि जातक को कहाँ सबसे अधिक सचेत प्रयास और उपचारात्मक उपाय (मन्त्र, रत्न, दान) करने चाहिए।</>
            : <>The strongest Bhava in a chart reveals the life area of greatest natural success &mdash; the domain where things flow with minimal resistance. If the 10th house leads, career comes easily. If the 2nd house is strongest, wealth accumulation is natural. The weakest Bhava indicates where the native must invest the most conscious effort and where remedial measures (mantras, gemstones, charitable acts) can have the greatest impact.</>}
        </p>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          {isHi
            ? <>एक ही लग्न की दो कुण्डलियों की तुलना इसे शक्तिशाली रूप से दर्शाती है। व्यक्ति A (मेष लग्न) का सप्तम भाव बलवान (उच्च शुक्र स्वामी, बृहस्पति दृष्टि) और दशम दुर्बल (नीच शनि स्वामी, शुभ दृष्टि नहीं) हो सकता है। व्यक्ति B (भी मेष लग्न) इसका विपरीत दिखा सकता है। एक ही लग्न, विवाह बनाम करियर में पूर्णतया भिन्न जीवन अनुभव, सब भावबल वितरण द्वारा व्याख्यायित।</>
            : <>Comparing two charts with the same lagna illustrates this powerfully. Person A (Aries lagna) may have a strong 7th house (exalted Venus as lord, Jupiter aspecting) and a weak 10th (Saturn debilitated as lord, no benefic aspects). Person B (also Aries lagna) may show the reverse. Same lagna, completely different life experiences in marriage versus career, all explained by Bhavabala distribution.</>}
        </p>
      </section>
      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5 border border-blue-500/15">
        <h4 className="text-blue-300 text-xs uppercase tracking-widest font-bold mb-2">{tl({ en: 'Modern Relevance', hi: 'आधुनिक प्रासंगिकता', sa: 'आधुनिक प्रासंगिकता' }, locale)}</h4>
        <p className="text-text-secondary text-sm leading-relaxed">
          {isHi
            ? <>भावबल कुण्डली व्याख्या को अस्पष्ट सामान्यीकरण (&ldquo;आपका सप्तम भाव ठीक है&rdquo;) से सटीक परिमाणित मूल्यांकन (&ldquo;आपका सप्तम भाव 142 षष्ट्यंश अंकित है, 12 भावों में तीसरे स्थान पर&rdquo;) में बदलता है। हमारा ऐप कुण्डली बल टैब में षड्बल के साथ भावबल की गणना करता है, जिससे उपयोगकर्ता शीघ्र अपने सबसे बलवान और दुर्बल जीवन क्षेत्रों की पहचान कर सकते हैं। यह अधिक लक्षित टिप्पणी विवरण को शक्ति देता है।</>
            : <>Bhavabala transforms Kundali interpretation from vague generalizations (&ldquo;your 7th house is okay&rdquo;) into precise quantified assessments (&ldquo;your 7th house scores 142 shashtiamsas, ranking 3rd among your 12 houses&rdquo;). Our app computes Bhavabala alongside Shadbala in the Kundali strength tab, allowing users to quickly identify their strongest and weakest life domains. This powers more targeted Tippanni commentary &mdash; instead of covering all 12 houses equally, the narrative prioritizes the houses that matter most in a particular chart.</>}
        </p>
      </section>
    </div>
  );
}

export default function Module18_2Page() {
  return <ModuleContainer meta={META} pages={[<Page1 key="p1" />, <Page2 key="p2" />, <Page3 key="p3" />]} questions={QUESTIONS} />;
}
