'use client';

import { tl } from '@/lib/utils/trilingual';
import ModuleContainer, { type ModuleMeta, type ModuleQuestion, useModuleLocale } from '@/components/learn/ModuleContainer';
import ExampleChart from '@/components/learn/ExampleChart';
import { isDevanagariLocale } from '@/lib/utils/locale-fonts';

import { lt } from '@/lib/learn/translations';
import type { LocaleText } from '@/lib/learn/translations';
import L from '@/messages/learn/modules/0-3.json';

const META: ModuleMeta = {
  id: 'mod_0_3',
  phase: 0,
  topic: 'Pre-Foundation',
  moduleNumber: '0.3',
  title: L.title as unknown as ModuleMeta['title'],
  subtitle: L.subtitle as unknown as ModuleMeta['subtitle'],
  estimatedMinutes: 12,
  crossRefs: L.crossRefs as unknown as ModuleMeta['crossRefs'],
};

const QUESTIONS: ModuleQuestion[] = L.questions as unknown as ModuleQuestion[];

// ─── Content Pages ──────────────────────────────────────────────────────────

function Page1() {
  const locale = useModuleLocale();
  const isHi = isDevanagariLocale(locale);
  return (
    <div className="space-y-6">
      <section>
        <h3 className="text-gold-light font-bold text-lg mb-3" style={{ fontFamily: 'var(--font-heading)' }}>
          {tl({ en: `"What's Your Sign?" — The Answer Depends on Who's Asking`, hi: `"आपकी राशि क्या है?" — उत्तर इस पर निर्भर करता है कि कौन पूछ रहा है`, sa: `"आपकी राशि क्या है?" — उत्तर इस पर निर्भर करता है कि कौन पूछ रहा है` }, locale)}
        </h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          {tl({ en: `Here's a party trick: next time someone asks "What's your sign?", give them TWO answers. "In the Western system I'm a Gemini, but my Vedic Moon sign is Taurus." Watch their confusion — and then explain why.`, hi: `एक पार्टी ट्रिक: अगली बार जब कोई पूछे "आपकी राशि क्या है?", दो उत्तर दीजिए। "पश्चिमी प्रणाली में मैं मिथुन हूँ, लेकिन मेरी वैदिक चन्द्र राशि वृषभ है।" उनकी उलझन देखिए — और फिर समझाइए क्यों।`, sa: `एक पार्टी ट्रिक: अगली बार जब कोई पूछे "आपकी राशि क्या है?", दो उत्तर दीजिए। "पश्चिमी प्रणाली में मैं मिथुन हूँ, लेकिन मेरी वैदिक चन्द्र राशि वृषभ है।" उनकी उलझन देखिए — और फिर समझाइए क्यों।` }, locale)}
        </p>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          {tl({ en: `If a Western friend asks, you might say "I'm a Gemini" — the Sun was in Gemini at birth, in the tropical zodiac. But if an Indian astrologer asks, the answer might be "My rashi is Vrishabha (Taurus)" — the Moon was in Taurus at birth, in the sidereal zodiac.`, hi: `यदि कोई पश्चिमी मित्र पूछे, आप कह सकते हैं "मैं मिथुन (Gemini) हूँ" — सूर्य जन्म के समय मिथुन में था, ट्रॉपिकल राशिचक्र में। किन्तु यदि कोई भारतीय ज्योतिषी पूछे, उत्तर हो सकता है "मेरी राशि वृषभ है" — चन्द्रमा जन्म के समय वृषभ में था, साइडरियल राशिचक्र में।`, sa: `यदि कोई पश्चिमी मित्र पूछे, आप कह सकते हैं "मैं मिथुन (Gemini) हूँ" — सूर्य जन्म के समय मिथुन में था, ट्रॉपिकल राशिचक्र में। किन्तु यदि कोई भारतीय ज्योतिषी पूछे, उत्तर हो सकता है "मेरी राशि वृषभ है" — चन्द्रमा जन्म के समय वृषभ में था, साइडरियल राशिचक्र में।` }, locale)}
        </p>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          {tl({ en: 'Two big differences are at play here:', hi: 'दो बड़े अन्तर यहाँ काम करते हैं:', sa: 'दो बड़े अन्तर यहाँ काम करते हैं:' }, locale)}
        </p>

        <div className="grid gap-3 mb-4">
          <div className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-lg p-4">
            <p className="text-gold-light text-sm font-bold mb-2">{tl({ en: 'The ~24 Degree Gap (Ayanamsha)', hi: '~24° अन्तर (अयनांश)', sa: '~24° अन्तर (अयनांश)' }, locale)}</p>
            <p className="text-text-secondary text-xs leading-relaxed">
              {tl({ en: `The tropical zodiac is tied to seasons (equinoxes). The sidereal is tied to stars. Due to precession, they\'ve diverged by ~24 degrees today. Since each sign is 30 degrees, your Vedic Sun sign is usually ONE sign behind your Western sign. Western Gemini = Vedic Vrishabha (Taurus)!`, hi: `ट्रॉपिकल राशिचक्र ऋतुओं (विषुव) से बँधा है। साइडरियल तारों से। अयन गति (precession) के कारण ये आज ~24° विचलित हैं। प्रत्येक राशि 30° की है, इसलिए आपकी वैदिक सूर्य राशि प्रायः पश्चिमी से एक राशि पीछे होती है। पश्चिमी Gemini = वैदिक Vrishabha (Taurus)!`, sa: `ट्रॉपिकल राशिचक्र ऋतुओं (विषुव) से बँधा है। साइडरियल तारों से। अयन गति (precession) के कारण ये आज ~24° विचलित हैं। प्रत्येक राशि 30° की है, इसलिए आपकी वैदिक सूर्य राशि प्रायः पश्चिमी से एक राशि पीछे होती है। पश्चिमी Gemini = वैदिक Vrishabha (Taurus)!` }, locale)}
            </p>
          </div>
          <div className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-lg p-4 border border-emerald-500/15">
            <p className="text-emerald-400 text-sm font-bold mb-2">{tl({ en: 'Moon vs Sun', hi: 'चन्द्रमा बनाम सूर्य', sa: 'चन्द्रमा बनाम सूर्य' }, locale)}</p>
            <p className="text-text-secondary text-xs leading-relaxed">
              {tl({ en: 'Western astrology centers on the Sun sign — the Sun spends 30 days per sign. Vedic astrology prioritizes the Moon sign — the Moon spends only 2.25 days per sign, making it far more personal. Also, in Vedic thought, the Moon governs the mind (manas).', hi: 'पश्चिमी ज्योतिष सूर्य राशि पर केन्द्रित है — सूर्य 30 दिन प्रति राशि रहता है। वैदिक ज्योतिष चन्द्र राशि प्रमुख मानता है — चन्द्रमा केवल 2.25 दिन प्रति राशि रहता है, बहुत अधिक व्यक्तिगत। साथ ही, वैदिक विचार में चन्द्रमा मन (मनस्) का शासक है।', sa: 'पश्चिमी ज्योतिष सूर्य राशि पर केन्द्रित है — सूर्य 30 दिन प्रति राशि रहता है। वैदिक ज्योतिष चन्द्र राशि प्रमुख मानता है — चन्द्रमा केवल 2.25 दिन प्रति राशि रहता है, बहुत अधिक व्यक्तिगत। साथ ही, वैदिक विचार में चन्द्रमा मन (मनस्) का शासक है।' }, locale)}
            </p>
          </div>
        </div>

        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          {tl({ en: 'Why does Vedic use the MOON as primary? The Moon changes sign every 2.25 days. The Sun takes 30 days to change sign. That means everyone born in a given month has the same Sun sign — but Moon sign changes every 2 days, giving 12x more specificity. Add the nakshatra (which changes every 24 hours) and pada (every 6 hours), and you get a cosmic fingerprint far more unique than Western sun signs. Your Vedic chart is like a hi-res photo where Western is a thumbnail. Your nakshatra is like a cosmic ZIP code — way more specific than a zodiac sign.', hi: 'वैदिक ज्योतिष चन्द्रमा को प्रमुख क्यों मानता है? चन्द्रमा हर 2.25 दिन में राशि बदलता है। सूर्य को 30 दिन लगते हैं। इसका अर्थ है कि एक ही महीने में जन्मे सभी लोगों की सूर्य राशि एक ही होती है — लेकिन चन्द्र राशि हर 2 दिन बदलती है, 12 गुना अधिक विशिष्टता देते हुए। इसमें नक्षत्र जोड़िए (जो हर 24 घण्टे बदलता है) और पद (हर 6 घण्टे), और आपको एक ब्रह्माण्डीय फिंगरप्रिंट मिलता है जो पश्चिमी सूर्य राशि से कहीं अधिक अनूठा है। आपकी वैदिक कुण्डली एक हाई-रेज़ फ़ोटो जैसी है जहाँ पश्चिमी एक थम्बनेल है। आपका नक्षत्र एक ब्रह्माण्डीय पिन कोड जैसा है — राशि चिह्न से कहीं अधिक विशिष्ट।', sa: 'वैदिक ज्योतिष चन्द्रमा को प्रमुख क्यों मानता है? चन्द्रमा हर 2.25 दिन में राशि बदलता है। सूर्य को 30 दिन लगते हैं। इसका अर्थ है कि एक ही महीने में जन्मे सभी लोगों की सूर्य राशि एक ही होती है — लेकिन चन्द्र राशि हर 2 दिन बदलती है, 12 गुना अधिक विशिष्टता देते हुए। इसमें नक्षत्र जोड़िए (जो हर 24 घण्टे बदलता है) और पद (हर 6 घण्टे), और आपको एक ब्रह्माण्डीय फिंगरप्रिंट मिलता है जो पश्चिमी सूर्य राशि से कहीं अधिक अनूठा है। आपकी वैदिक कुण्डली एक हाई-रेज़ फ़ोटो जैसी है जहाँ पश्चिमी एक थम्बनेल है। आपका नक्षत्र एक ब्रह्माण्डीय पिन कोड जैसा है — राशि चिह्न से कहीं अधिक विशिष्ट।' }, locale)}
        </p>
      </section>

      {/* Classical Origin — Gold card */}
      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5">
        <h4 className="text-gold-dark text-xs uppercase tracking-widest font-bold mb-2">
          {tl({ en: 'Classical Origin', hi: 'शास्त्रीय उत्पत्ति', sa: 'शास्त्रीयः उद्भवः' }, locale)}
        </h4>
        <p className="text-text-secondary text-sm leading-relaxed mb-2">
          {tl({ en: 'The 12 zodiac signs originated in Mesopotamia but were independently adopted and MODIFIED in India. The Indian system added the 27-nakshatra overlay, which has no Mesopotamian equivalent.', hi: '12 राशियाँ मेसोपोटामिया में उत्पन्न हुईं किन्तु भारत में स्वतन्त्र रूप से अपनाई और संशोधित की गईं। भारतीय प्रणाली ने 27-नक्षत्र परत जोड़ी, जिसका कोई मेसोपोटामियाई समकक्ष नहीं।', sa: '12 राशियाँ मेसोपोटामिया में उत्पन्न हुईं किन्तु भारत में स्वतन्त्र रूप से अपनाई और संशोधित की गईं। भारतीय प्रणाली ने 27-नक्षत्र परत जोड़ी, जिसका कोई मेसोपोटामियाई समकक्ष नहीं।' }, locale)}
        </p>
        <p className="text-text-secondary text-sm leading-relaxed">
          {tl({ en: `Each nakshatra spans 13 degrees 20 minutes — dividing the ecliptic into 27 equal parts based on the Moon\'s 27.3-day sidereal period. This is astronomically elegant: one day = one nakshatra.`, hi: `प्रत्येक नक्षत्र 13°20\' का है — क्रान्तिवृत्त को 27 बराबर भागों में विभाजित करते हुए, चन्द्रमा के 27.3 दिन के नाक्षत्र काल पर आधारित। यह खगोलीय रूप से सुन्दर है: एक दिन = एक नक्षत्र।`, sa: `प्रत्येक नक्षत्र 13°20\' का है — क्रान्तिवृत्त को 27 बराबर भागों में विभाजित करते हुए, चन्द्रमा के 27.3 दिन के नाक्षत्र काल पर आधारित। यह खगोलीय रूप से सुन्दर है: एक दिन = एक नक्षत्र।` }, locale)}
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
          {tl({ en: 'The 12 Rashis in 2 Minutes', hi: '12 राशियाँ 2 मिनट में', sa: '12 राशियाँ 2 मिनट में' }, locale)}
        </h3>

        {/* Rashi grid */}
        <div className="grid grid-cols-2 gap-2 mb-4">
          {[
            { n: 1, en: 'Mesha', hi: 'मेष', sym: 'Aries', ruler: tl({ en: 'Mars', hi: 'मंगल', sa: 'मङ्गलः' }, locale), elem: tl({ en: 'Fire', hi: 'अग्नि', sa: 'अग्नि' }, locale) },
            { n: 2, en: 'Vrishabha', hi: 'वृषभ', sym: 'Taurus', ruler: tl({ en: 'Venus', hi: 'शुक्र', sa: 'शुक्रः' }, locale), elem: tl({ en: 'Earth', hi: 'पृथ्वी', sa: 'पृथ्वी' }, locale) },
            { n: 3, en: 'Mithuna', hi: 'मिथुन', sym: 'Gemini', ruler: tl({ en: 'Mercury', hi: 'बुध', sa: 'बुधः' }, locale), elem: tl({ en: 'Air', hi: 'वायु', sa: 'वायु' }, locale) },
            { n: 4, en: 'Karka', hi: 'कर्क', sym: 'Cancer', ruler: tl({ en: 'Moon', hi: 'चन्द्र', sa: 'चन्द्रः' }, locale), elem: tl({ en: 'Water', hi: 'जल', sa: 'जल' }, locale) },
            { n: 5, en: 'Simha', hi: 'सिंह', sym: 'Leo', ruler: tl({ en: 'Sun', hi: 'सूर्य', sa: 'सूर्यः' }, locale), elem: tl({ en: 'Fire', hi: 'अग्नि', sa: 'अग्नि' }, locale) },
            { n: 6, en: 'Kanya', hi: 'कन्या', sym: 'Virgo', ruler: tl({ en: 'Mercury', hi: 'बुध', sa: 'बुधः' }, locale), elem: tl({ en: 'Earth', hi: 'पृथ्वी', sa: 'पृथ्वी' }, locale) },
            { n: 7, en: 'Tula', hi: 'तुला', sym: 'Libra', ruler: tl({ en: 'Venus', hi: 'शुक्र', sa: 'शुक्रः' }, locale), elem: tl({ en: 'Air', hi: 'वायु', sa: 'वायु' }, locale) },
            { n: 8, en: 'Vrischika', hi: 'वृश्चिक', sym: 'Scorpio', ruler: tl({ en: 'Mars', hi: 'मंगल', sa: 'मङ्गलः' }, locale), elem: tl({ en: 'Water', hi: 'जल', sa: 'जल' }, locale) },
            { n: 9, en: 'Dhanu', hi: 'धनु', sym: 'Sagittarius', ruler: tl({ en: 'Jupiter', hi: 'गुरु', sa: 'गुरुः' }, locale), elem: tl({ en: 'Fire', hi: 'अग्नि', sa: 'अग्नि' }, locale) },
            { n: 10, en: 'Makara', hi: 'मकर', sym: 'Capricorn', ruler: tl({ en: 'Saturn', hi: 'शनि', sa: 'शनिः' }, locale), elem: tl({ en: 'Earth', hi: 'पृथ्वी', sa: 'पृथ्वी' }, locale) },
            { n: 11, en: 'Kumbha', hi: 'कुम्भ', sym: 'Aquarius', ruler: tl({ en: 'Saturn', hi: 'शनि', sa: 'शनिः' }, locale), elem: tl({ en: 'Air', hi: 'वायु', sa: 'वायु' }, locale) },
            { n: 12, en: 'Meena', hi: 'मीन', sym: 'Pisces', ruler: tl({ en: 'Jupiter', hi: 'गुरु', sa: 'गुरुः' }, locale), elem: tl({ en: 'Water', hi: 'जल', sa: 'जल' }, locale) },
          ].map(r => (
            <div key={r.n} className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-lg p-2 text-center">
              <p className="text-gold-light text-xs font-bold">{r.n}. {isHi ? r.hi : r.en}</p>
              <p className="text-text-tertiary text-xs">{r.sym}</p>
              <p className="text-text-secondary text-xs">{r.ruler} · {r.elem}</p>
            </div>
          ))}
        </div>
        <p className="text-text-secondary text-sm leading-relaxed mt-4 mb-3">
          {tl({ en: `Here's something that blows people's minds: your birth nakshatra traditionally determines the FIRST SYLLABLE of your name. Hasta nakshatra pada 1 = "Pu" sounds. Pada 2 = "Sha". Pada 3 = "Na". Pada 4 = "Tha". This isn't arbitrary — it creates a mnemonic link between your name and your cosmic moment of birth. When a pandit asks for your name to cast your chart, the NAME ITSELF encodes astronomical information. It's like a QR code from 3,000 years ago.`, hi: `एक बात जो लोगों को चौंका देती है: आपका जन्म नक्षत्र पारम्परिक रूप से आपके नाम का पहला अक्षर निर्धारित करता है। हस्त नक्षत्र पद 1 = "पू" ध्वनि। पद 2 = "ष"। पद 3 = "ण"। पद 4 = "ठ"। यह मनमाना नहीं — यह आपके नाम और आपके जन्म के ब्रह्माण्डीय क्षण के बीच एक स्मरण-सूत्र बनाता है। जब एक पण्डित आपका नाम पूछते हैं कुण्डली बनाने के लिए, तो नाम स्वयं खगोलीय जानकारी को कोड करता है। यह 3,000 वर्ष पुराना QR कोड जैसा है।`, sa: `एक बात जो लोगों को चौंका देती है: आपका जन्म नक्षत्र पारम्परिक रूप से आपके नाम का पहला अक्षर निर्धारित करता है। हस्त नक्षत्र पद 1 = "पू" ध्वनि। पद 2 = "ष"। पद 3 = "ण"। पद 4 = "ठ"। यह मनमाना नहीं — यह आपके नाम और आपके जन्म के ब्रह्माण्डीय क्षण के बीच एक स्मरण-सूत्र बनाता है। जब एक पण्डित आपका नाम पूछते हैं कुण्डली बनाने के लिए, तो नाम स्वयं खगोलीय जानकारी को कोड करता है। यह 3,000 वर्ष पुराना QR कोड जैसा है।` }, locale)}
        </p>
      </section>

      <section>
        <h3 className="text-gold-light font-bold text-base mb-2" style={{ fontFamily: 'var(--font-heading)' }}>
          {tl({ en: 'The 27 Nakshatras — Quick Preview', hi: '27 नक्षत्र — संक्षिप्त झलक', sa: '27 नक्षत्र — संक्षिप्त झलक' }, locale)}
        </h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          {tl({ en: 'Each nakshatra is ruled by a planet (in Vimshottari order). Your birth nakshatra lord determines which Mahadasha your life begins with.', hi: 'प्रत्येक नक्षत्र एक ग्रह द्वारा शासित है (विंशोत्तरी क्रम में)। आपका जन्म नक्षत्र स्वामी निर्धारित करता है कि आपकी महादशा किस ग्रह से शुरू होती है।', sa: 'प्रत्येक नक्षत्र एक ग्रह द्वारा शासित है (विंशोत्तरी क्रम में)। आपका जन्म नक्षत्र स्वामी निर्धारित करता है कि आपकी महादशा किस ग्रह से शुरू होती है।' }, locale)}
        </p>

        {/* Emerald fact card */}
        <ExampleChart
          ascendant={6}
          planets={{ 6: [1], 1: [0], 4: [4] }}
          title="Moon in Hasta (Virgo) — Birth Nakshatra Example"
          highlight={[6]}
        />
        <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5 border border-emerald-500/15">
          <h4 className="text-emerald-400 text-xs uppercase tracking-widest font-bold mb-3">
            {tl({ en: 'Worked Example', hi: 'उदाहरण', sa: 'सोदाहरणं कार्यम्' }, locale)}
          </h4>
          <p className="text-text-secondary text-xs leading-relaxed mb-2">
            {tl({ en: `Suppose the Moon was in Hasta nakshatra at birth. Hasta\'s lord is the Moon. Therefore:`, hi: `मान लीजिए जन्म के समय चन्द्रमा हस्त नक्षत्र में था। हस्त का स्वामी चन्द्रमा है। इसलिए:`, sa: `मान लीजिए जन्म के समय चन्द्रमा हस्त नक्षत्र में था। हस्त का स्वामी चन्द्रमा है। इसलिए:` }, locale)}
          </p>
          <ul className="text-text-secondary text-xs space-y-1 ml-3">
            <li>{tl({ en: '• Moon Mahadasha starts at birth (10 years)', hi: '• जन्म पर चन्द्र महादशा शुरू होती है (10 वर्ष)', sa: '• जन्म पर चन्द्र महादशा शुरू होती है (10 वर्ष)' }, locale)}</li>
            <li>{tl({ en: '• Moon sign: Kanya/Virgo (Hasta falls in Virgo)', hi: '• चन्द्र राशि: कन्या (हस्त कन्या राशि में है)', sa: '• चन्द्र राशि: कन्या (हस्त कन्या राशि में है)' }, locale)}</li>
            <li>{tl({ en: '• Pada 3 → name syllable "Nu" sound', hi: '• पद 3 → नाम अक्षर "णू" ध्वनि', sa: '• पद 3 → नाम अक्षर "णू" ध्वनि' }, locale)}</li>
          </ul>
          <p className="text-text-secondary text-xs leading-relaxed mt-3">
            <span className="text-gold-light font-bold">{tl({ en: 'Try it now:', hi: 'अभी प्रयोग करें:', sa: 'अभी प्रयोग करें:' }, locale)}</span>{' '}
            {tl({ en: 'Head to our Sign Calculator and find your own rashi and nakshatra!', hi: 'हमारे राशि कैलकुलेटर पर जाएँ और अपनी राशि और नक्षत्र खोजें!', sa: 'हमारे राशि कैलकुलेटर पर जाएँ और अपनी राशि और नक्षत्र खोजें!' }, locale)}
          </p>
        </section>
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
          {tl({ en: 'Why Your Nakshatra Matters More Than You Think', hi: 'आपका नक्षत्र आपकी सोच से कहीं अधिक महत्वपूर्ण है', sa: 'आपका नक्षत्र आपकी सोच से कहीं अधिक महत्वपूर्ण है' }, locale)}
        </h3>

        <div className="space-y-4">
          <div className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-lg p-4">
            <p className="text-gold-light text-sm font-bold mb-2">{tl({ en: 'NAMING', hi: 'नामकरण', sa: 'नामकरण' }, locale)}</p>
            <p className="text-text-secondary text-xs leading-relaxed">
              {tl({ en: `The first syllable of your name traditionally comes from your birth nakshatra's pada (quarter). Hasta pada 3 = "Nu" sounds. This isn't random — it's a mnemonic linking you to your cosmic moment of birth.`, hi: `आपके नाम का पहला अक्षर पारम्परिक रूप से जन्म नक्षत्र के पद (चरण) से आता है। हस्त पद 3 = "णू" ध्वनि। यह यादृच्छिक नहीं — यह एक स्मरण-सूत्र है जो आपको आपके ब्रह्माण्डीय क्षण से जोड़ता है।`, sa: `आपके नाम का पहला अक्षर पारम्परिक रूप से जन्म नक्षत्र के पद (चरण) से आता है। हस्त पद 3 = "णू" ध्वनि। यह यादृच्छिक नहीं — यह एक स्मरण-सूत्र है जो आपको आपके ब्रह्माण्डीय क्षण से जोड़ता है।` }, locale)}
            </p>
          </div>

          <div className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-lg p-4">
            <p className="text-gold-light text-sm font-bold mb-2">{tl({ en: 'DASHA (Timing System)', hi: 'दशा (समय प्रणाली)', sa: 'दशा (समय प्रणाली)' }, locale)}</p>
            <p className="text-text-secondary text-xs leading-relaxed">
              {tl({ en: `Your entire life's planetary period sequence (120-year cycle) is determined by your birth nakshatra lord. This is one of Jyotish's most powerful features — the ability to predict WHEN, not just what.`, hi: `आपके पूरे जीवन का ग्रहीय काल क्रम (120 वर्ष चक्र) जन्म नक्षत्र स्वामी से निर्धारित होता है। यह ज्योतिष की सबसे शक्तिशाली विशेषताओं में से एक है — "कब" होगा बताने की क्षमता।`, sa: `आपके पूरे जीवन का ग्रहीय काल क्रम (120 वर्ष चक्र) जन्म नक्षत्र स्वामी से निर्धारित होता है। यह ज्योतिष की सबसे शक्तिशाली विशेषताओं में से एक है — "कब" होगा बताने की क्षमता।` }, locale)}
            </p>
          </div>

          <div className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-lg p-4">
            <p className="text-gold-light text-sm font-bold mb-2">{tl({ en: 'MARRIAGE MATCHING', hi: 'विवाह मिलान', sa: 'विवाह मिलान' }, locale)}</p>
            <p className="text-text-secondary text-xs leading-relaxed">
              {tl({ en: 'Ashta Kuta compatibility is 100% nakshatra-based. It compares birth nakshatras of both partners across 8 categories, max 36 points. Millions of families across India still check this before marriage.', hi: 'अष्ट कूट अनुकूलता 100% नक्षत्र-आधारित है। दोनों साथियों के जन्म नक्षत्रों की 8 श्रेणियों में तुलना, अधिकतम 36 अंक। आज भी भारत में करोड़ों परिवार विवाह से पहले यह जाँचते हैं।', sa: 'अष्ट कूट अनुकूलता 100% नक्षत्र-आधारित है। दोनों साथियों के जन्म नक्षत्रों की 8 श्रेणियों में तुलना, अधिकतम 36 अंक। आज भी भारत में करोड़ों परिवार विवाह से पहले यह जाँचते हैं।' }, locale)}
            </p>
          </div>

          <div className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-lg p-4 border border-emerald-500/15">
            <p className="text-emerald-400 text-sm font-bold mb-2">{tl({ en: 'THE 120-YEAR TIMELINE', hi: '120 वर्ष की समय-रेखा', sa: '120 वर्ष की समय-रेखा' }, locale)}</p>
            <p className="text-text-secondary text-xs leading-relaxed">
              {tl({ en: `Your birth nakshatra determines your ENTIRE Vimshottari Dasha sequence — a 120-year timeline of planetary periods. Born in Rohini? Moon Mahadasha starts. Born in Ashwini? Ketu starts. This single data point — which star the Moon was visiting when you were born — sets the clock for your entire life\'s planetary chapters. No other astrological system in the world has this level of temporal specificity. Think of it as Spotify Wrapped — but for your entire life.`, hi: `आपका जन्म नक्षत्र आपका सम्पूर्ण विंशोत्तरी दशा क्रम निर्धारित करता है — ग्रहीय कालों की 120 वर्षीय समय-रेखा। रोहिणी में जन्म? चन्द्र महादशा शुरू। अश्विनी में जन्म? केतु शुरू। यह एकमात्र डेटा बिन्दु — जन्म के समय चन्द्रमा किस तारे से मिल रहा था — आपके पूरे जीवन के ग्रहीय अध्यायों की घड़ी सेट करता है। दुनिया की किसी अन्य ज्योतिष प्रणाली में इस स्तर की कालिक विशिष्टता नहीं है। इसे ऐसे सोचिए: Spotify Wrapped — लेकिन आपके पूरे जीवन के लिए।`, sa: `आपका जन्म नक्षत्र आपका सम्पूर्ण विंशोत्तरी दशा क्रम निर्धारित करता है — ग्रहीय कालों की 120 वर्षीय समय-रेखा। रोहिणी में जन्म? चन्द्र महादशा शुरू। अश्विनी में जन्म? केतु शुरू। यह एकमात्र डेटा बिन्दु — जन्म के समय चन्द्रमा किस तारे से मिल रहा था — आपके पूरे जीवन के ग्रहीय अध्यायों की घड़ी सेट करता है। दुनिया की किसी अन्य ज्योतिष प्रणाली में इस स्तर की कालिक विशिष्टता नहीं है। इसे ऐसे सोचिए: Spotify Wrapped — लेकिन आपके पूरे जीवन के लिए।` }, locale)}
            </p>
          </div>

          <div className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-lg p-4">
            <p className="text-gold-light text-sm font-bold mb-2">{tl({ en: 'JANMA NAKSHATRA DAY', hi: 'जन्म नक्षत्र दिवस', sa: 'जन्म नक्षत्र दिवस' }, locale)}</p>
            <p className="text-text-secondary text-xs leading-relaxed">
              {tl({ en: 'Each month when the Moon returns to your birth nakshatra, that is your "Janma Nakshatra day" — considered especially auspicious for you personally.', hi: 'प्रत्येक मास जब चन्द्रमा आपके जन्म नक्षत्र में लौटता है, वह आपका "जन्म नक्षत्र दिवस" है — आपके लिए विशेष रूप से शुभ।', sa: 'प्रत्येक मास जब चन्द्रमा आपके जन्म नक्षत्र में लौटता है, वह आपका "जन्म नक्षत्र दिवस" है — आपके लिए विशेष रूप से शुभ।' }, locale)}
            </p>
          </div>
        </div>
      </section>

      {/* Red — Misconceptions */}
      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5 border border-red-500/15">
        <h4 className="text-red-400 text-xs uppercase tracking-widest font-bold mb-3">
          {tl({ en: 'Common Misconceptions', hi: 'सामान्य भ्रान्तियाँ', sa: 'सामान्याः भ्रान्तयः' }, locale)}
        </h4>
        <div className="space-y-3 text-text-secondary text-xs leading-relaxed">
          <p>
            <span className="text-red-300 font-bold">{tl({ en: 'Misconception:', hi: 'भ्रान्ति:', sa: 'भ्रान्ति:' }, locale)}</span>{' '}
            {tl({ en: '"My sign is Leo because I was born in August"', hi: '"मेरी राशि सिंह है क्योंकि मैं अगस्त में पैदा हुआ"', sa: '"मेरी राशि सिंह है क्योंकि मैं अगस्त में पैदा हुआ"' }, locale)}
            <br />
            <span className="text-emerald-300">{tl({ en: 'Reality:', hi: 'वास्तविकता:', sa: 'वास्तविकता:' }, locale)}</span>{' '}
            {tl({ en: `That's only your Western tropical Sun sign. In Vedic astrology, your Sun sign might be Cancer (24-degree ayanamsha), and your "rashi" (Moon sign) could be anything!`, hi: `यह केवल पश्चिमी ट्रॉपिकल सूर्य राशि है। वैदिक ज्योतिष में आपकी सूर्य राशि कर्क हो सकती है (24° अयनांश) और आपकी "राशि" (चन्द्र राशि) कुछ भी हो सकती है!`, sa: `यह केवल पश्चिमी ट्रॉपिकल सूर्य राशि है। वैदिक ज्योतिष में आपकी सूर्य राशि कर्क हो सकती है (24° अयनांश) और आपकी "राशि" (चन्द्र राशि) कुछ भी हो सकती है!` }, locale)}
          </p>
          <p>
            <span className="text-red-300 font-bold">{tl({ en: 'Misconception:', hi: 'भ्रान्ति:', sa: 'भ्रान्ति:' }, locale)}</span>{' '}
            {tl({ en: '"Nakshatras are just Indian names for Western constellations"', hi: '"नक्षत्र बस पश्चिमी नक्षत्रमंडल (constellations) के भारतीय नाम हैं"', sa: '"नक्षत्र बस पश्चिमी नक्षत्रमंडल (constellations) के भारतीय नाम हैं"' }, locale)}
            <br />
            <span className="text-emerald-300">{tl({ en: 'Reality:', hi: 'वास्तविकता:', sa: 'वास्तविकता:' }, locale)}</span>{' '}
            {tl({ en: `Completely different. Nakshatras are equal 13 degree 20 minute segments — mathematical divisions. Western constellations are irregular, imaginary shapes. Nakshatras are ON the ecliptic; Western constellations span the entire sky.`, hi: `पूर्णतः भिन्न। नक्षत्र 13°20\' के बराबर भाग हैं — गणितीय विभाजन। पश्चिमी नक्षत्रमंडल अनियमित, काल्पनिक आकृतियाँ हैं। नक्षत्र क्रान्तिवृत्त पर हैं; पश्चिमी नक्षत्रमंडल पूरे आकाश में फैले हैं।`, sa: `पूर्णतः भिन्न। नक्षत्र 13°20\' के बराबर भाग हैं — गणितीय विभाजन। पश्चिमी नक्षत्रमंडल अनियमित, काल्पनिक आकृतियाँ हैं। नक्षत्र क्रान्तिवृत्त पर हैं; पश्चिमी नक्षत्रमंडल पूरे आकाश में फैले हैं।` }, locale)}
          </p>
        </div>
      </section>

      {/* Blue — Modern Relevance */}
      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5 border border-blue-500/15">
        <h4 className="text-blue-300 text-xs uppercase tracking-widest font-bold mb-3">
          {tl({ en: 'Modern Relevance', hi: 'आधुनिक प्रासंगिकता', sa: 'आधुनिकी प्रासङ्गिकता' }, locale)}
        </h4>
        <p className="text-text-secondary text-xs leading-relaxed mb-2">
          <span className="text-blue-300 font-bold">{tl({ en: 'Historical record:', hi: 'ऐतिहासिक रिकॉर्ड:', sa: 'ऐतिहासिक रिकॉर्ड:' }, locale)}</span>{' '}
          {tl({ en: 'The Rigveda (c. 1500 BCE) mentions nakshatras — making this the oldest continuously used astronomical coordinate system in human history. The Western zodiac signs are only ~2,500 years old. Indian nakshatras are 3,500+ years old — and still used daily by hundreds of millions of people.', hi: 'ऋग्वेद (लगभग 1500 ई.पू.) में नक्षत्रों का उल्लेख है — यह मानव इतिहास में सबसे प्राचीन निरन्तर प्रयुक्त खगोलीय निर्देशांक प्रणाली है। पश्चिमी राशियाँ केवल ~2,500 वर्ष पुरानी हैं। भारतीय नक्षत्र 3,500+ वर्ष पुराने हैं — और आज भी प्रतिदिन करोड़ों लोग इनका उपयोग करते हैं।', sa: 'ऋग्वेद (लगभग 1500 ई.पू.) में नक्षत्रों का उल्लेख है — यह मानव इतिहास में सबसे प्राचीन निरन्तर प्रयुक्त खगोलीय निर्देशांक प्रणाली है। पश्चिमी राशियाँ केवल ~2,500 वर्ष पुरानी हैं। भारतीय नक्षत्र 3,500+ वर्ष पुराने हैं — और आज भी प्रतिदिन करोड़ों लोग इनका उपयोग करते हैं।' }, locale)}
        </p>
        <p className="text-text-secondary text-xs leading-relaxed">
          {tl({ en: 'Our app calculates your exact Moon sign, nakshatra, and pada using pure mathematics — the same astronomical algorithms NASA uses. Try our Sign Calculator now and discover your cosmic address!', hi: 'हमारा ऐप आपकी सटीक चन्द्र राशि, नक्षत्र और पद की गणना शुद्ध गणित से करता है — वही खगोलीय कलनविधि जो NASA उपयोग करता है। अपना राशि कैलकुलेटर अभी आज़माएँ और अपना ब्रह्माण्डीय पता खोजें!', sa: 'हमारा ऐप आपकी सटीक चन्द्र राशि, नक्षत्र और पद की गणना शुद्ध गणित से करता है — वही खगोलीय कलनविधि जो NASA उपयोग करता है। अपना राशि कैलकुलेटर अभी आज़माएँ और अपना ब्रह्माण्डीय पता खोजें!' }, locale)}
        </p>
        <p className="text-text-secondary text-xs leading-relaxed mt-3">
          {tl({ en: `Chronobiology (the study of biological clocks) earned the 2017 Nobel Prize. The researchers found that every cell in your body has a clock tuned to external light cycles. The nakshatra system is, at its core, a 27-phase lunar clock that ancient Indians correlated with human temperament, health, and life patterns. Whether the correlations hold up to modern statistical scrutiny is an open research question — but the framework is scientifically coherent. Your phone\'s GPS uses the same orbital mechanics that power these calculations.`, hi: `कालजैविकी (Chronobiology) — जैविक घड़ियों का अध्ययन — को 2017 का नोबेल पुरस्कार मिला। शोधकर्ताओं ने पाया कि आपके शरीर की हर कोशिका में बाहरी प्रकाश चक्रों से जुड़ी एक घड़ी है। नक्षत्र प्रणाली, अपने मूल में, 27-चरणीय चान्द्र घड़ी है जिसे प्राचीन भारतीयों ने मानव स्वभाव, स्वास्थ्य और जीवन प्रतिरूपों से सहसम्बन्धित किया। क्या ये सहसम्बन्ध आधुनिक सांख्यिकीय जाँच में टिकते हैं — यह एक खुला शोध प्रश्न है — लेकिन ढाँचा वैज्ञानिक रूप से सुसंगत है। आपके फ़ोन का GPS उन्हीं कक्षीय यान्त्रिकी का उपयोग करता है जो ये गणनाएँ करती हैं।`, sa: `कालजैविकी (Chronobiology) — जैविक घड़ियों का अध्ययन — को 2017 का नोबेल पुरस्कार मिला। शोधकर्ताओं ने पाया कि आपके शरीर की हर कोशिका में बाहरी प्रकाश चक्रों से जुड़ी एक घड़ी है। नक्षत्र प्रणाली, अपने मूल में, 27-चरणीय चान्द्र घड़ी है जिसे प्राचीन भारतीयों ने मानव स्वभाव, स्वास्थ्य और जीवन प्रतिरूपों से सहसम्बन्धित किया। क्या ये सहसम्बन्ध आधुनिक सांख्यिकीय जाँच में टिकते हैं — यह एक खुला शोध प्रश्न है — लेकिन ढाँचा वैज्ञानिक रूप से सुसंगत है। आपके फ़ोन का GPS उन्हीं कक्षीय यान्त्रिकी का उपयोग करता है जो ये गणनाएँ करती हैं।` }, locale)}
        </p>
      </section>
    </div>
  );
}

// ─── Module Page ─────────────────────────────────────────────────────────────

export default function Module0_3Page() {
  return (
    <ModuleContainer
      meta={META}
      pages={[<Page1 key="p1" />, <Page2 key="p2" />, <Page3 key="p3" />]}
      questions={QUESTIONS}
    />
  );
}
