'use client';

import { tl } from '@/lib/utils/trilingual';
import ModuleContainer, { type ModuleMeta, type ModuleQuestion, useModuleLocale } from '@/components/learn/ModuleContainer';
import ExampleChart from '@/components/learn/ExampleChart';
import { isDevanagariLocale } from '@/lib/utils/locale-fonts';
import { lt } from '@/lib/learn/translations';
import type { LocaleText } from '@/lib/learn/translations';
import L from '@/messages/learn/modules/19-2.json';
import KeyTakeaway from '@/components/learn/KeyTakeaway';

const META: ModuleMeta = {
  id: 'mod_19_2', phase: 6, topic: 'Jaimini', moduleNumber: '19.2',
  title: L.title as unknown as Record<string, string>,
  subtitle: L.subtitle as unknown as Record<string, string>,
  estimatedMinutes: 12,
  crossRefs: L.crossRefs as unknown as Array<{label: Record<string, string>; href: string}>,
};

const QUESTIONS: ModuleQuestion[] = L.questions as unknown as ModuleQuestion[];

function Page1() {
  const locale = useModuleLocale();
  const isHi = isDevanagariLocale(locale);
  return (
    <div className="space-y-6">
      <KeyTakeaway
        points={[
          'Jaimini\'s aspects are sign-based, not planet-based — entire signs aspect entire signs with no orbs or partial aspects.',
          'Movable signs aspect fixed signs (except adjacent), fixed signs aspect movable signs (except adjacent), dual signs aspect each other.',
        ]}
        locale={locale}
      />
      <section>
        <h3 className="text-gold-light font-bold text-lg mb-3" style={{ fontFamily: 'var(--font-heading)' }}>
          {tl({ en: 'Signs Aspect Signs', hi: 'राशियाँ राशियों को दृष्ट करती हैं', sa: 'राशियाँ राशियों को दृष्ट करती हैं' }, locale)}
        </h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          {isHi
            ? <>पाराशरी ज्योतिष में ग्रह अन्य ग्रहों और भावों को दृष्ट करते हैं। मंगल की विशेष चौथी, सातवीं और आठवीं दृष्टि है; बृहस्पति की पाँचवीं, सातवीं और नौवीं; शनि की तीसरी, सातवीं और दसवीं। ये ग्रह दृष्टियाँ स्वयं ग्रह में निहित हैं। जैमिनी ने इस सम्पूर्ण पद्धति को त्यागकर कुछ मूलतः भिन्न प्रस्तुत किया: <strong>राशियाँ राशियों को दृष्ट करती हैं</strong>। राशि दृष्टि में इससे कोई अन्तर नहीं पड़ता कि कौन-सा ग्रह है — महत्त्वपूर्ण यह है कि वह किस राशि में है। एक राशि के सभी ग्रह समान दृष्टियाँ साझा करते हैं।</>
            : <>In Parashari astrology, planets aspect other planets and houses. Mars has a special 4th, 7th, and 8th aspect; Jupiter has a 5th, 7th, and 9th; Saturn has a 3rd, 7th, and 10th. These planetary aspects are inherent to the planet itself. Jaimini threw out this entire system and replaced it with something radically different: <strong>signs aspect signs</strong>. In Rashi Drishti, it does not matter which planet is involved — what matters is which sign it occupies. All planets in a sign share the same aspects.</>}
        </p>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          {isHi
            ? <>नियम सुरुचिपूर्ण और सरल हैं। 12 राशियाँ तीन समूहों में वर्गीकृत हैं: <strong>चर</strong> — मेष, कर्क, तुला, मकर; <strong>स्थिर</strong> — वृषभ, सिंह, वृश्चिक, कुम्भ; <strong>द्विस्वभाव</strong> — मिथुन, कन्या, धनु, मीन। चर राशियाँ सभी स्थिर राशियों को दृष्ट करती हैं — निकटवर्ती को छोड़कर। स्थिर राशियाँ सभी चर राशियों को दृष्ट करती हैं — निकटवर्ती को छोड़कर। द्विस्वभाव राशियाँ एक-दूसरे को दृष्ट करती हैं।</>
            : <>The rules are elegant and simple. The 12 signs are classified into three groups: <strong>Movable (Chara)</strong> — Aries, Cancer, Libra, Capricorn; <strong>Fixed (Sthira)</strong> — Taurus, Leo, Scorpio, Aquarius; <strong>Dual (Dvisabhava)</strong> — Gemini, Virgo, Sagittarius, Pisces. Movable signs aspect all fixed signs except the adjacent one. Fixed signs aspect all movable signs except the adjacent one. Dual signs aspect each other.</>}
        </p>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5">
        <h4 className="text-gold-dark text-xs uppercase tracking-widest font-bold mb-2">{tl({ en: 'Complete Aspect Table', hi: 'सम्पूर्ण दृष्टि सारणी', sa: 'सम्पूर्ण दृष्टि सारणी' }, locale)}</h4>
        <p className="text-text-secondary text-xs leading-relaxed mb-1">
          <span className="text-gold-light font-medium">Aries (Movable):</span> aspects Leo, Scorpio, Aquarius (not Taurus)
        </p>
        <p className="text-text-secondary text-xs leading-relaxed mb-1">
          <span className="text-gold-light font-medium">Cancer (Movable):</span> aspects Taurus, Scorpio, Aquarius (not Leo)
        </p>
        <p className="text-text-secondary text-xs leading-relaxed mb-1">
          <span className="text-gold-light font-medium">Libra (Movable):</span> aspects Taurus, Leo, Aquarius (not Scorpio)
        </p>
        <p className="text-text-secondary text-xs leading-relaxed mb-1">
          <span className="text-gold-light font-medium">Capricorn (Movable):</span> aspects Taurus, Leo, Scorpio (not Aquarius)
        </p>
        <p className="text-text-secondary text-xs leading-relaxed mb-1">
          <span className="text-gold-light font-medium">Taurus (Fixed):</span> aspects Cancer, Libra, Capricorn (not Aries)
        </p>
        <p className="text-text-secondary text-xs leading-relaxed mb-1">
          <span className="text-gold-light font-medium">Leo (Fixed):</span> aspects Aries, Libra, Capricorn (not Cancer)
        </p>
        <p className="text-text-secondary text-xs leading-relaxed mb-1">
          <span className="text-gold-light font-medium">Scorpio (Fixed):</span> aspects Aries, Cancer, Capricorn (not Libra)
        </p>
        <p className="text-text-secondary text-xs leading-relaxed mb-1">
          <span className="text-gold-light font-medium">Aquarius (Fixed):</span> aspects Aries, Cancer, Libra (not Capricorn)
        </p>
        <p className="text-text-secondary text-xs leading-relaxed">
          <span className="text-gold-light font-medium">Dual signs:</span> Gemini, Virgo, Sagittarius, Pisces all aspect each other mutually.
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
          {tl({ en: 'Why Rashi Drishti Creates Different Patterns', hi: 'राशि दृष्टि भिन्न प्रतिरूप क्यों बनाती है', sa: 'राशि दृष्टि भिन्न प्रतिरूप क्यों बनाती है' }, locale)}
        </h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          {isHi
            ? <>एक कुण्डली पर विचार करें जिसमें मंगल मेष में और शुक्र वृश्चिक में है। पाराशरी में मंगल मेष से चौथे (कर्क), सातवें (तुला) और आठवें (वृश्चिक) को दृष्ट करता है — अतः मंगल वृश्चिक में शुक्र को दृष्ट करता है। शुक्र की केवल सातवीं दृष्टि वृश्चिक से वृषभ पर है — शुक्र मेष में मंगल को दृष्ट नहीं करता। सम्बन्ध एकदिशीय है। जैमिनी में, मेष (चर) सिंह, वृश्चिक और कुम्भ को दृष्ट करता है — मेष के सभी ग्रह वृश्चिक के सभी ग्रहों को दृष्ट करते हैं। वृश्चिक (स्थिर) मेष, कर्क और मकर को दृष्ट करता है — वृश्चिक के सभी ग्रह मेष के सभी ग्रहों को दृष्ट करते हैं। सम्बन्ध पारस्परिक और पूर्ण है।</>
            : <>Consider a chart with Mars in Aries and Venus in Scorpio. In Parashari astrology, Mars aspects the 4th (Cancer), 7th (Libra), and 8th (Scorpio) from Aries — so Mars aspects Venus in Scorpio. Venus has only a 7th aspect from Scorpio to Taurus — Venus does NOT aspect Mars in Aries. The relationship is one-directional. In Jaimini, Aries (movable) aspects Leo, Scorpio, and Aquarius — ALL planets in Aries aspect ALL planets in Scorpio. Scorpio (fixed) aspects Aries, Cancer, and Capricorn — ALL planets in Scorpio aspect ALL planets in Aries. The relationship is mutual and total.</>}
        <ExampleChart ascendant={1} planets={{ 1: [2], 4: [1], 9: [4], 10: [0] }} title={tl({ en: 'Example Chart', hi: 'उदाहरण कुण्डली', sa: 'उदाहरणकुण्डली' }, locale)} />
        </p>
        <p className="text-text-secondary text-sm leading-relaxed">
          This means that Jaimini aspects create broader webs of mutual influence. Where Parashari might show a one-sided power dynamic (Mars dominates Venus through its special aspect), Jaimini shows a mutual exchange. This fundamentally changes how relationships, conflicts, and collaborations are interpreted in the chart.
        </p>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5 border border-emerald-500/15">
        <h4 className="text-emerald-400 text-xs uppercase tracking-widest font-bold mb-3">{tl({ en: 'Worked Comparison', hi: 'कार्यान्वित तुलना', sa: 'कार्यान्वित तुलना' }, locale)}</h4>
        <p className="text-text-secondary text-xs leading-relaxed mb-2">
          <span className="text-gold-light font-medium">Chart:</span> Sun and Mercury in Gemini, Mars in Virgo, Jupiter in Sagittarius, Venus in Pisces.
        </p>
        <p className="text-text-secondary text-xs leading-relaxed mb-2">
          <span className="text-gold-light font-medium">Parashari:</span> Mars in Virgo aspects 4th (Sagittarius = Jupiter), 7th (Pisces = Venus), 8th (Aries = empty). Jupiter in Sagittarius aspects 5th (Aries = empty), 7th (Gemini = Sun/Mercury), 9th (Leo = empty). Many relationships are one-directional.
        </p>
        <p className="text-text-secondary text-xs leading-relaxed mb-2">
          {isHi
            ? <><span className="text-gold-light font-medium">जैमिनी:</span> चारों राशियाँ (मिथुन, कन्या, धनु, मीन) द्विस्वभाव हैं। द्विस्वभाव राशियाँ एक-दूसरे को दृष्ट करती हैं। अतः इस कुण्डली के सभी ग्रह पारस्परिक रूप से सभी अन्य ग्रहों को दृष्ट करते हैं — एक पूर्णतया अन्तर्सम्बद्ध जाल।</>
            : <><span className="text-gold-light font-medium">Jaimini:</span> All four signs (Gemini, Virgo, Sagittarius, Pisces) are dual signs. Dual signs aspect each other. Therefore, ALL planets in this chart mutually aspect ALL other planets. Sun/Mercury see Mars, Jupiter, Venus — and all see them back. A completely interconnected web.</>}
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
          {tl({ en: 'Practical Application with Char Dasha', hi: 'चर दशा के साथ व्यावहारिक अनुप्रयोग', sa: 'चर दशा के साथ व्यावहारिक अनुप्रयोग' }, locale)}
        </h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          {isHi
            ? <>जैमिनी दृष्टियाँ जैमिनी की अपनी समय पद्धति के साथ कार्य करने के लिए बनी हैं — मुख्यतः चर दशा (राशि दशा भी कहलाती है)। चर दशा में प्रत्येक अवधि एक राशि (ग्रह नहीं) द्वारा शासित होती है। मेष दशा में, उदाहरणार्थ, आप मेष और राशि दृष्टि से मेष द्वारा दृष्ट सभी राशियों (सिंह, वृश्चिक, कुम्भ) के फल का मूल्यांकन करते हैं। उन दृष्ट राशियों के ग्रह मेष दशा काल को प्रभावित करेंगे। यह विंशोत्तरी + पाराशरी दृष्टियों से मूलतः भिन्न भविष्यवाणी ढाँचा बनाता है।</>
            : <>Jaimini aspects are designed to work with Jaimini&apos;s own timing system — primarily Char Dasha (also called Chara Dasha or Rashi Dasha). In Char Dasha, each period is ruled by a sign (not a planet). During the Aries dasha, for instance, you evaluate the results of Aries and all signs that Aries aspects via Rashi Drishti (Leo, Scorpio, Aquarius). Planets in those aspected signs will influence the Aries dasha period. This creates a fundamentally different predictive framework from Vimshottari + Parashari aspects.</>}
        </p>
      </section>

      <section>
        <h3 className="text-gold-light font-bold text-lg mb-3" style={{ fontFamily: 'var(--font-heading)' }}>
          {tl({ en: 'Whole-Sign Nature — No Orbs', hi: 'सम्पूर्ण-राशि स्वभाव — कोई ओर्ब नहीं', sa: 'सम्पूर्ण-राशि स्वभाव — कोई ओर्ब नहीं' }, locale)}
        </h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          {isHi
            ? <>जैमिनी पद्धति का सम्भवतः सबसे मुक्तिदायक पहलू ओर्ब का उन्मूलन है। पाराशरी ज्योतिष में बहुत विवाद इस पर केन्द्रित होता है कि युति &quot;निकट&quot; है या &quot;दूर&quot;, 8° या 10° अधिकतम ओर्ब होना चाहिए। जैमिनी इसे पूर्णतया टाल देता है। मेष में 1° का ग्रह मेष में 29° के ग्रह के ठीक समान राशि दृष्टि रखता है। कोई आंशिक दृष्टि नहीं, अंश द्वारा घटती शक्ति नहीं। या तो राशि दूसरी राशि को दृष्ट करती है, या नहीं करती। यह द्विचर सरलता जैमिनी दृष्टियों को शीघ्र गणना और स्पष्ट व्याख्या योग्य बनाती है।</>
            : <>Perhaps the most liberating aspect of Jaimini&apos;s system is the elimination of orbs. In Parashari astrology, much debate centers on whether a conjunction is &quot;tight&quot; or &quot;wide&quot;, whether 8° or 10° should be the maximum orb for a planetary aspect. Jaimini sidesteps this entirely. A planet at 1° of Aries has exactly the same Rashi Drishti as a planet at 29° of Aries. There are no partial aspects, no declining strength by degree. Either a sign aspects another sign, or it does not. This binary simplicity makes Jaimini aspects fast to compute and unambiguous to interpret.</>}
        </p>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5 border border-red-500/15">
        <h4 className="text-red-400 text-xs uppercase tracking-widest font-bold mb-3">{tl({ en: 'Common Misconceptions', hi: 'सामान्य भ्रान्तियाँ', sa: 'सामान्याः भ्रान्तयः' }, locale)}</h4>
        <p className="text-text-secondary text-xs leading-relaxed mb-2">
          {isHi
            ? <><span className="text-gold-light font-medium">भ्रान्ति:</span> &quot;राशि दृष्टि पाराशरी दृष्टियों का प्रतिस्थापन है।&quot; कोई भी पद्धति दूसरी का प्रतिस्थापन नहीं करती। ये भिन्न ऋषियों के समान्तर ढाँचे हैं। पाराशरी दृष्टियों का प्रयोग विंशोत्तरी दशा और पाराशरी नियमों के साथ करें। राशि दृष्टि का प्रयोग चर दशा और जैमिनी नियमों के साथ। अनेक उन्नत ज्योतिषी दोनों पद्धतियों का प्रयोग पारस्परिक सत्यापन हेतु साथ-साथ करते हैं, किन्तु एक विश्लेषण श्रृंखला में कभी मिलाते नहीं।</>
            : <><span className="text-gold-light font-medium">Misconception:</span> &quot;Rashi Drishti replaces Parashari aspects.&quot; Neither system replaces the other. They are parallel frameworks from different rishis. Use Parashari aspects with Vimshottari Dasha and Parashari rules. Use Rashi Drishti with Char Dasha and Jaimini rules. Many advanced astrologers use both systems side by side for cross-validation, but never mix them within a single analytical chain.</>}
        </p>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5 border border-blue-500/15">
        <h4 className="text-blue-300 text-xs uppercase tracking-widest font-bold mb-3">{tl({ en: 'Modern Relevance', hi: 'आधुनिक प्रासंगिकता', sa: 'आधुनिकी प्रासङ्गिकता' }, locale)}</h4>
        <p className="text-text-secondary text-xs leading-relaxed mb-2">
          {isHi
            ? <>जैमिनी राशि दृष्टि ने 21वीं शताब्दी में पुनरुत्थान देखा है, विशेषकर के.एन. राव और संजय रथ जैसे विद्वानों के कार्य से जिन्होंने आधुनिक अभ्यासकर्ताओं के लिए जैमिनी तकनीकों को व्यवस्थित किया। राशि-आधारित दृष्टियों की सरलता उन्हें कम्प्यूटरीकृत ज्योतिष के लिए उपयुक्त बनाती है — कोई अस्पष्ट ओर्ब गणना आवश्यक नहीं। हमारा कुण्डली इंजन राशि दृष्टि सम्बन्धों की तत्काल गणना कर सकता है, पारम्परिक पाराशरी दृष्टियों के साथ एक अतिरिक्त विश्लेषणात्मक परत प्रदान करता है।</>
            : <>Jaimini Rashi Drishti has seen a revival in the 21st century, particularly through the work of scholars like K.N. Rao and Sanjay Rath who have systematized Jaimini techniques for modern practitioners. The simplicity of sign-based aspects makes them well-suited for computerized astrology — no ambiguous orb calculations needed. Our Kundali engine can compute Rashi Drishti relationships instantly, providing an additional analytical layer alongside traditional Parashari aspects.</>}
        </p>
      </section>
    </div>
  );
}

export default function Module19_2Page() {
  return <ModuleContainer meta={META} pages={[<Page1 key="p1" />, <Page2 key="p2" />, <Page3 key="p3" />]} questions={QUESTIONS} />;
}
