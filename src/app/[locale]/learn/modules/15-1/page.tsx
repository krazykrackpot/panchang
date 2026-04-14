'use client';

import { tl } from '@/lib/utils/trilingual';
import ModuleContainer, { type ModuleMeta, type ModuleQuestion, useModuleLocale } from '@/components/learn/ModuleContainer';
import { isDevanagariLocale } from '@/lib/utils/locale-fonts';
import { lt } from '@/lib/learn/translations';
import type { LocaleText } from '@/lib/learn/translations';
import L from '@/messages/learn/modules/15-1.json';

const META: ModuleMeta = {
  id: 'mod_15_1', phase: 4, topic: 'Remedial Measures', moduleNumber: '15.1',
  title: L.title as unknown as ModuleMeta['title'],
  subtitle: L.subtitle as unknown as ModuleMeta['subtitle'],
  estimatedMinutes: 14,
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
          {tl({ en: 'Ratna Shastra — The Science of Gemstones', hi: 'रत्न शास्त्र — रत्नों का विज्ञान', sa: 'रत्न शास्त्र — रत्नों का विज्ञान' }, locale)}
        </h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          {tl({ en: 'Ratna Shastra (gem science) is one of the most popular branches of Jyotish remedial measures. The core principle is straightforward: each of the nine grahas (planets) resonates with a specific gemstone, and wearing that gemstone in contact with the skin amplifies the planet\u2019s energy in the wearer\u2019s life. This is not merely ornamental — it is a deliberate intervention in the planetary dynamics of one\u2019s birth chart.', hi: 'रत्न शास्त्र ज्योतिष उपचारों की सबसे लोकप्रिय शाखाओं में से एक है। मूल सिद्धान्त सरल है: नौ ग्रहों में से प्रत्येक एक विशिष्ट रत्न से अनुनादित होता है, और उस रत्न को त्वचा के सम्पर्क में पहनने से धारक के जीवन में उस ग्रह की ऊर्जा प्रवर्धित होती है। यह केवल अलंकार नहीं है — यह जन्म कुण्डली की ग्रह गतिकी में एक जानबूझकर किया गया हस्तक्षेप है।', sa: 'रत्न शास्त्र ज्योतिष उपचारों की सबसे लोकप्रिय शाखाओं में से एक है। मूल सिद्धान्त सरल है: नौ ग्रहों में से प्रत्येक एक विशिष्ट रत्न से अनुनादित होता है, और उस रत्न को त्वचा के सम्पर्क में पहनने से धारक के जीवन में उस ग्रह की ऊर्जा प्रवर्धित होती है। यह केवल अलंकार नहीं है — यह जन्म कुण्डली की ग्रह गतिकी में एक जानबूझकर किया गया हस्तक्षेप है।' }, locale)}
        </p>
        <p className="text-text-secondary text-sm leading-relaxed">
          {tl({ en: 'The nine planet-gem correspondences are: Sun = Ruby (Manikya), Moon = Pearl (Moti), Mars = Red Coral (Moonga), Mercury = Emerald (Panna), Jupiter = Yellow Sapphire (Pukhraj), Venus = Diamond (Heera), Saturn = Blue Sapphire (Neelam), Rahu = Hessonite (Gomed), and Ketu = Cat\u2019s Eye (Lehsunia). Each gemstone captures and transmits the specific wavelength of cosmic energy associated with its planet. The gem acts as an antenna — it does not generate energy but focuses and channels what is already present.', hi: 'नौ ग्रह-रत्न सम्बन्ध हैं: सूर्य = माणिक्य (रूबी), चन्द्र = मोती (पर्ल), मंगल = मूँगा (रेड कोरल), बुध = पन्ना (एमरल्ड), गुरु = पुखराज (यलो सैफायर), शुक्र = हीरा (डायमंड), शनि = नीलम (ब्लू सैफायर), राहु = गोमेद (हेसोनाइट), और केतु = लहसुनिया (कैट्स आई)। प्रत्येक रत्न अपने ग्रह से जुड़ी ब्रह्माण्डीय ऊर्जा की विशिष्ट तरंगदैर्ध्य को ग्रहण और संचारित करता है। रत्न एक एंटीना की भाँति कार्य करता है — यह ऊर्जा उत्पन्न नहीं करता बल्कि जो पहले से विद्यमान है उसे केन्द्रित और संचालित करता है।', sa: 'नौ ग्रह-रत्न सम्बन्ध हैं: सूर्य = माणिक्य (रूबी), चन्द्र = मोती (पर्ल), मंगल = मूँगा (रेड कोरल), बुध = पन्ना (एमरल्ड), गुरु = पुखराज (यलो सैफायर), शुक्र = हीरा (डायमंड), शनि = नीलम (ब्लू सैफायर), राहु = गोमेद (हेसोनाइट), और केतु = लहसुनिया (कैट्स आई)। प्रत्येक रत्न अपने ग्रह से जुड़ी ब्रह्माण्डीय ऊर्जा की विशिष्ट तरंगदैर्ध्य को ग्रहण और संचारित करता है। रत्न एक एंटीना की भाँति कार्य करता है — यह ऊर्जा उत्पन्न नहीं करता बल्कि जो पहले से विद्यमान है उसे केन्द्रित और संचालित करता है।' }, locale)}
        </p>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5">
        <h4 className="text-gold-dark text-xs uppercase tracking-widest font-bold mb-2">{tl({ en: 'The Nine Gems at a Glance', hi: 'नौ रत्न एक दृष्टि में', sa: 'नौ रत्न एक दृष्टि में' }, locale)}</h4>
        <p className="text-text-secondary text-sm leading-relaxed">
          {tl({ en: 'The gemstone must be natural, untreated, and free of major flaws (cracks, inclusions, cloudiness). A flawed gemstone is worse than no gemstone — it transmits distorted energy. The gem must touch the skin (open-back setting) so that its vibrations make direct contact with the body. Synthetic or lab-created stones are not considered effective in Jyotish tradition, as they lack the natural crystallization process that is believed to encode planetary resonance.', hi: 'रत्न प्राकृतिक, अनुपचारित और प्रमुख दोषों (दरारें, समावेशन, धुँधलापन) से मुक्त होना चाहिए। दोषपूर्ण रत्न बिना रत्न से भी बदतर है — यह विकृत ऊर्जा संचारित करता है। रत्न को त्वचा को स्पर्श करना चाहिए (ओपन-बैक सेटिंग) ताकि इसके कम्पन सीधे शरीर से सम्पर्क करें। कृत्रिम या प्रयोगशाला-निर्मित रत्न ज्योतिष परम्परा में प्रभावी नहीं माने जाते, क्योंकि उनमें वह प्राकृतिक क्रिस्टलीकरण प्रक्रिया नहीं होती जो ग्रहीय अनुनाद को संकेतित करती है।', sa: 'रत्न प्राकृतिक, अनुपचारित और प्रमुख दोषों (दरारें, समावेशन, धुँधलापन) से मुक्त होना चाहिए। दोषपूर्ण रत्न बिना रत्न से भी बदतर है — यह विकृत ऊर्जा संचारित करता है। रत्न को त्वचा को स्पर्श करना चाहिए (ओपन-बैक सेटिंग) ताकि इसके कम्पन सीधे शरीर से सम्पर्क करें। कृत्रिम या प्रयोगशाला-निर्मित रत्न ज्योतिष परम्परा में प्रभावी नहीं माने जाते, क्योंकि उनमें वह प्राकृतिक क्रिस्टलीकरण प्रक्रिया नहीं होती जो ग्रहीय अनुनाद को संकेतित करती है।' }, locale)}
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
          {tl({ en: 'When to Wear and When NOT to Wear', hi: 'कब पहनें और कब न पहनें', sa: 'कब पहनें और कब न पहनें' }, locale)}
        </h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          {tl({ en: 'The cardinal rule of Ratna Shastra: never wear a gemstone for a functional malefic planet. A planet that lords over the 6th, 8th, or 12th house from your lagna becomes a functional malefic regardless of its natural benefic status. For example, Jupiter is a natural benefic, but for Taurus lagna it rules the 8th and 11th houses — wearing Yellow Sapphire would amplify 8th-house problems (accidents, chronic illness, sudden losses). You must always analyze house lordships from the specific lagna before prescribing any gem.', hi: 'रत्न शास्त्र का मूल नियम: कार्यात्मक पापी ग्रह का रत्न कभी न पहनें। जो ग्रह आपके लग्न से 6, 8 या 12वें भाव का स्वामी हो, वह अपनी प्राकृतिक शुभता की परवाह किए बिना कार्यात्मक पापी बन जाता है। उदाहरणार्थ, बृहस्पति प्राकृतिक शुभ है, परन्तु वृषभ लग्न के लिए यह 8वें और 11वें भाव का स्वामी है — पुखराज पहनने से 8वें भाव की समस्याएँ (दुर्घटनाएँ, दीर्घकालिक रोग, आकस्मिक हानि) प्रवर्धित होंगी। किसी भी रत्न निर्धारण से पहले विशिष्ट लग्न से भाव स्वामित्व का विश्लेषण अनिवार्य है।', sa: 'रत्न शास्त्र का मूल नियम: कार्यात्मक पापी ग्रह का रत्न कभी न पहनें। जो ग्रह आपके लग्न से 6, 8 या 12वें भाव का स्वामी हो, वह अपनी प्राकृतिक शुभता की परवाह किए बिना कार्यात्मक पापी बन जाता है। उदाहरणार्थ, बृहस्पति प्राकृतिक शुभ है, परन्तु वृषभ लग्न के लिए यह 8वें और 11वें भाव का स्वामी है — पुखराज पहनने से 8वें भाव की समस्याएँ (दुर्घटनाएँ, दीर्घकालिक रोग, आकस्मिक हानि) प्रवर्धित होंगी। किसी भी रत्न निर्धारण से पहले विशिष्ट लग्न से भाव स्वामित्व का विश्लेषण अनिवार्य है।' }, locale)}
        </p>
        <p className="text-text-secondary text-sm leading-relaxed">
          {tl({ en: 'The best candidates for gemstones are: (1) the Lagna Lord — always a functional benefic, strengthening it improves overall health, confidence, and life direction; (2) the Yogakaraka — a planet that simultaneously lords a kendra and a trikona, the most auspicious planet for that lagna; (3) strong trine lords (5th and 9th) — they bring fortune, wisdom, and children. Prioritize planets that are functional benefics but placed in weak positions (debilitated, combust, in dusthana) — these benefit most from gemstone support.', hi: 'रत्नों के लिए सर्वोत्तम उम्मीदवार हैं: (1) लग्नेश — सदैव कार्यात्मक शुभ, इसे सशक्त करना समग्र स्वास्थ्य, आत्मविश्वास और जीवन दिशा में सुधार करता है; (2) योगकारक — वह ग्रह जो एक साथ केन्द्र और त्रिकोण का स्वामी हो, उस लग्न का सबसे शुभ ग्रह; (3) प्रबल त्रिकोण स्वामी (5वाँ और 9वाँ) — ये भाग्य, विद्या और सन्तान लाते हैं। उन ग्रहों को प्राथमिकता दें जो कार्यात्मक शुभ हों परन्तु दुर्बल स्थिति में हों (नीच, अस्त, दुस्थान में) — इन्हें रत्न सहायता से सर्वाधिक लाभ होता है।', sa: 'रत्नों के लिए सर्वोत्तम उम्मीदवार हैं: (1) लग्नेश — सदैव कार्यात्मक शुभ, इसे सशक्त करना समग्र स्वास्थ्य, आत्मविश्वास और जीवन दिशा में सुधार करता है; (2) योगकारक — वह ग्रह जो एक साथ केन्द्र और त्रिकोण का स्वामी हो, उस लग्न का सबसे शुभ ग्रह; (3) प्रबल त्रिकोण स्वामी (5वाँ और 9वाँ) — ये भाग्य, विद्या और सन्तान लाते हैं। उन ग्रहों को प्राथमिकता दें जो कार्यात्मक शुभ हों परन्तु दुर्बल स्थिति में हों (नीच, अस्त, दुस्थान में) — इन्हें रत्न सहायता से सर्वाधिक लाभ होता है।' }, locale)}
        </p>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5 border border-emerald-500/15">
        <h4 className="text-emerald-400 text-xs uppercase tracking-widest font-bold mb-3">{tl({ en: 'Planet-Gem-Metal-Finger Reference', hi: 'ग्रह-रत्न-धातु-उँगली सन्दर्भ', sa: 'ग्रह-रत्न-धातु-उँगली सन्दर्भ' }, locale)}</h4>
        <p className="text-text-secondary text-xs leading-relaxed mb-2">

          {isHi

            ? <><span className="text-gold-light font-medium">सूर्य:</span> माणिक्य, स्वर्ण, अनामिका, रविवार। <span className="text-gold-light font-medium">चन्द्र:</span> मोती, चाँदी, कनिष्ठिका, सोमवार। <span className="text-gold-light font-medium">मंगल:</span> मूँगा, स्वर्ण/ताँबा, अनामिका, मंगलवार। <span className="text-gold-light font-medium">बुध:</span> पन्ना, स्वर्ण, कनिष्ठिका, बुधवार। <span className="text-gold-light font-medium">गुरु:</span> पुखराज, स्वर्ण, तर्जनी, गुरुवार।</>

            : <><span className="text-gold-light font-medium">Sun:</span> Ruby, Gold, Ring finger, Sunday. <span className="text-gold-light font-medium">Moon:</span> Pearl, Silver, Little finger, Monday. <span className="text-gold-light font-medium">Mars:</span> Red Coral, Gold/Copper, Ring finger, Tuesday. <span className="text-gold-light font-medium">Mercury:</span> Emerald, Gold, Little finger, Wednesday. <span className="text-gold-light font-medium">Jupiter:</span> Yellow Sapphire, Gold, Index finger, Thursday.</>}

        </p>
        <p className="text-text-secondary text-xs leading-relaxed">
          <span className="text-gold-light font-medium">Venus:</span> Diamond, Platinum/Silver, Middle/Ring finger, Friday. <span className="text-gold-light font-medium">Saturn:</span> Blue Sapphire, Silver/Panchdhatu, Middle finger, Saturday. <span className="text-gold-light font-medium">Rahu:</span> Hessonite, Silver/Panchdhatu, Middle finger, Saturday. <span className="text-gold-light font-medium">Ketu:</span> Cat&apos;s Eye, Silver/Panchdhatu, Little/Ring finger, Tuesday/Saturday. Blue Sapphire requires a 7-day trial period. Minimum weight: 2-3 carats for precious, 5-7 carats for semi-precious.
        </p>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5 border border-red-500/15">
        <h4 className="text-red-400 text-xs uppercase tracking-widest font-bold mb-3">{tl({ en: 'Blue Sapphire Warning', hi: 'नीलम चेतावनी', sa: 'नीलम चेतावनी' }, locale)}</h4>
        <p className="text-text-secondary text-xs leading-relaxed mb-2">
          Blue Sapphire (Neelam) is the most powerful and potentially dangerous gemstone in Jyotish. Saturn&apos;s energy is intense, karmic, and unforgiving. If Blue Sapphire suits your chart, results can be spectacularly positive — rapid financial gains, career breakthroughs, obstacles dissolving overnight. But if it doesn&apos;t suit you, the consequences are equally dramatic — accidents, losses, depression, or sudden downturns within days of wearing it.
        </p>
        <p className="text-text-secondary text-xs leading-relaxed">
          नीलम ज्योतिष में सबसे शक्तिशाली और सम्भावित रूप से खतरनाक रत्न है। शनि की ऊर्जा तीव्र, कार्मिक और अक्षम्य है। यदि नीलम आपकी कुण्डली के अनुकूल है, तो परिणाम आश्चर्यजनक रूप से सकारात्मक हो सकते हैं — तीव्र आर्थिक लाभ, कैरियर में सफलता, बाधाओं का रातोंरात समाधान। परन्तु यदि यह अनुकूल नहीं है, तो परिणाम उतने ही नाटकीय हैं — पहनने के कुछ दिनों में दुर्घटनाएँ, हानि, अवसाद, या अचानक पतन। इसलिए 7 दिनों की परीक्षण अवधि अनिवार्य है।
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
        <h3 className="text-gold-light font-bold text-lg mb-3" style={{ fontFamily: 'var(--font-heading)' }}>{isHi ? 'महा-विवाद — क्या रत्न वास्तव में कार्य करते हैं?' : 'The Great Debate — Do Gemstones Actually Work?'}</h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">

          {isHi

            ? <>रत्नों की प्रभावकारिता ज्योतिष में सबसे विवादित विषय है। सन्देहवादी इस ओर इंगित करते हैं कि आपकी उँगली पर क्रिस्टल ग्रहीय ऊर्जाओं को कैसे प्रभावित कर सकता है, इसकी कोई वैज्ञानिक रूप से स्थापित प्रक्रिया नहीं है। प्लेसीबो परिकल्पना सुझाती है कि श्रद्धापूर्वक रत्न धारण करने की क्रिया मनोवैज्ञानिक आत्मविश्वास उत्पन्न करती है, जो बदले में व्यवहार और परिणाम बदलती है — एक स्व-पूर्ण भविष्यवाणी। यह कोई तुच्छ व्याख्या नहीं है; प्लेसीबो प्रभाव चिकित्सा में सबसे शक्तिशाली बलों में से एक है।</>

            : <>The efficacy of gemstones is the most debated topic in Jyotish. Skeptics point to the absence of any scientifically established mechanism by which a crystal on your finger could influence planetary energies. The placebo hypothesis suggests that the act of wearing a gemstone with faith creates psychological confidence, which in turn changes behavior and outcomes — a self-fulfilling prophecy. This is not a trivial explanation; the placebo effect is one of the most powerful forces in medicine.</>}

        </p>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">

          {isHi

            ? <>पारम्परिक वैदिक दृष्टिकोण मानता है कि रत्न ग्रहीय अनुनाद के माध्यम से कार्य करते हैं — प्रत्येक क्रिस्टल अपने शासक ग्रह के अनुरूप आवृत्ति पर कम्पन करता है, उस ग्रहीय प्रभाव को प्रवर्धित या संशोधित करता है। समर्थक गरुड़ पुराण और रत्न परीक्षा ग्रन्थों को प्रामाणिक स्रोत के रूप में उद्धृत करते हैं। कुछ आधुनिक समर्थक क्रोमोथेरेपी (रंग चिकित्सा) या क्रिस्टलों के पीज़ोइलेक्ट्रिक गुणों का आह्वान करते हैं, यद्यपि ये व्याख्याएँ मुख्यधारा विज्ञान से बाहर रहती हैं।</>

            : <>The traditional Vedic view holds that gems work through planetary resonance — each crystal vibrates at a frequency that corresponds to its ruling planet, amplifying or modulating that planetary influence. Proponents cite the Garuda Purana and Ratna Pariksha texts as authorities. Some modern proponents invoke chromotherapy (color healing) or piezoelectric properties of crystals, though these explanations remain outside mainstream science.</>}

        </p>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5 border border-emerald-500/15">
        <h4 className="text-emerald-400 text-xs uppercase tracking-widest font-bold mb-3">{tl({ en: 'The Navaratna Alternative', hi: 'नवरत्न विकल्प', sa: 'नवरत्न विकल्प' }, locale)}</h4>
        <p className="text-text-secondary text-xs leading-relaxed mb-2">

          {isHi

            ? <>नवरत्न (नौ रत्नों का पेंडेंट या अँगूठी) सभी नौ ग्रहीय रत्नों को एक मण्डल पैटर्न में व्यवस्थित करता है जिसमें माणिक्य (सूर्य का प्रतिनिधि) केन्द्र में होता है और शेष आठ अपने ग्रहीय क्रम में चारों ओर। तर्क यह है कि सभी नौ को सम्मिलित करने से कोई एक ग्रह अत्यधिक प्रवर्धित नहीं होता — बल्कि समग्र ब्रह्माण्डीय सामंजस्य प्राप्त होता है। यह उनके लिए सबसे सुरक्षित विकल्प माना जाता है जो गलत ग्रह को सशक्त करने के जोखिम के बिना रत्न-आधारित उपचार चाहते हैं।</>

            : <>The Navaratna (nine-gem pendant or ring) arranges all nine planetary gemstones in a mandala pattern with Ruby at the center (representing the Sun) surrounded by the remaining eight in their planetary order. The logic is that by including all nine, no single planet is excessively amplified — instead, overall cosmic harmony is achieved. This is considered the safest option for those who want gem-based remedies without the risk of strengthening a wrong planet.</>}

        </p>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5 border border-red-500/15">
        <h4 className="text-red-400 text-xs uppercase tracking-widest font-bold mb-3">{tl({ en: 'Why a Wrong Gemstone Can Cause Harm', hi: 'गलत रत्न हानिकारक क्यों', sa: 'गलत रत्न हानिकारक क्यों' }, locale)}</h4>
        <p className="text-text-secondary text-xs leading-relaxed mb-2">

          {isHi

            ? <>कल्पना करें शनि आपके लग्न के लिए कार्यात्मक पापी है, 8वें भाव का स्वामी। नीलम पहनने से शनि के फलादेश प्रवर्धित होते हैं — परन्तु 8वाँ भाव दीर्घकालिक रोग, दुर्घटनाओं और आकस्मिक परिवर्तनों का शासक है। आपने वास्तव में उस चैनल की ध्वनि बढ़ा दी जो बेसुरा संगीत बजा रहा था। इसी प्रकार, जब शुक्र 6वें भाव (ऋण, शत्रु, रोग) का स्वामी हो तो हीरा पहनना उन्हीं समस्याओं को सशक्त करता है। रत्न आपका इरादा नहीं जानता; यह केवल ग्रह को प्रवर्धित करता है। इसीलिए कुण्डली-विशिष्ट निर्धारण सामान्य "अपना जन्म-रत्न पहनें" सलाह से सदैव श्रेष्ठ है।</>

            : <>Imagine Saturn is a functional malefic for your lagna, ruling the 8th house. Wearing Blue Sapphire amplifies Saturn&apos;s significations — but the 8th house governs chronic disease, accidents, and sudden transformations. You have effectively boosted the volume on a channel that was playing dissonant music. Similarly, wearing Diamond when Venus rules the 6th house (debts, enemies, illness) strengthens those very problems. The gemstone does not know your intention; it simply amplifies the planet.</>}

        </p>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5 border border-blue-500/15">
        <h4 className="text-blue-300 text-xs uppercase tracking-widest font-bold mb-3">{tl({ en: 'Chart-Specific Over Generic', hi: 'सामान्य से ऊपर कुण्डली-विशिष्ट', sa: 'सामान्य से ऊपर कुण्डली-विशिष्ट' }, locale)}</h4>
        <p className="text-text-secondary text-xs leading-relaxed">
          The most important takeaway from Ratna Shastra: gemstone prescription must be chart-specific. Generic advice like &quot;Sagittarius people should wear Yellow Sapphire&quot; is dangerously oversimplified. The same Jupiter that blesses one chart can devastate another depending on house lordships from the lagna. Always consult a competent astrologer who analyzes your full birth chart — lagna, planetary dignities, dasha periods, and transits — before investing in a gemstone. Our Kundali tool provides the foundation for this analysis.
        </p>
      </section>
    </div>
  );
}

export default function Module15_1Page() {
  return <ModuleContainer meta={META} pages={[<Page1 key="p1" />, <Page2 key="p2" />, <Page3 key="p3" />]} questions={QUESTIONS} />;
}
