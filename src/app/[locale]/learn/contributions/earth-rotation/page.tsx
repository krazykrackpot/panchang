import { tl } from '@/lib/utils/trilingual';
import { lt } from '@/lib/learn/translations';
import type { LocaleText } from '@/lib/learn/translations';
import L from '@/messages/learn/contributions-earth-rotation.json';
import { Link } from '@/lib/i18n/navigation';
import type { Locale } from '@/types/panchang';
import { ShareRow } from '@/components/ui/ShareButton';
import { isDevanagariLocale } from '@/lib/utils/locale-fonts';

/* ════════════════════════════════════════════════════════════════
   LABELS — bilingual (en / hi)
   ════════════════════════════════════════════════════════════════ */

const TIMELINE = [
  { year: '499 CE', person: 'Aryabhata', event: { en: 'States Earth rotates on its axis, in Aryabhatiya Golapada', hi: 'आर्यभटीय गोलपाद में पृथ्वी के अक्षीय घूर्णन का कथन', sa: 'आर्यभटीय गोलपाद में पृथ्वी के अक्षीय घूर्णन का कथन', mai: 'आर्यभटीय गोलपाद में पृथ्वी के अक्षीय घूर्णन का कथन', mr: 'आर्यभटीय गोलपाद में पृथ्वी के अक्षीय घूर्णन का कथन', ta: 'ஆர்யபடீயம் கோலபாதத்தில் பூமி தன் அச்சில் சுழல்கிறது என்று கூறினார்', te: 'ఆర్యభటీయ గోళపాదలో భూమి తన అక్షంపై తిరుగుతుందని పేర్కొన్నారు', bn: 'আর্যভটীয় গোলপাদে পৃথিবী নিজ অক্ষে ঘোরে বলে বর্ণনা করেন', kn: 'ಆರ್ಯಭಟೀಯ ಗೋಲಪಾದದಲ್ಲಿ ಭೂಮಿ ತನ್ನ ಅಕ್ಷದ ಮೇಲೆ ತಿರುಗುತ್ತದೆ ಎಂದು ಹೇಳಿದರು', gu: 'આર્યભટીય ગોલપાદમાં પૃથ્વી પોતાની ધરી પર ફરે છે તેમ જણાવ્યું' }, color: '#f0d48a' },
  { year: '628 CE', person: 'Brahmagupta', event: { en: 'Disputes Aryabhata — active scientific debate', hi: 'आर्यभट का विरोध — सक्रिय वैज्ञानिक बहस', sa: 'आर्यभट का विरोध — सक्रिय वैज्ञानिक बहस', mai: 'आर्यभट का विरोध — सक्रिय वैज्ञानिक बहस', mr: 'आर्यभट का विरोध — सक्रिय वैज्ञानिक बहस', ta: 'ஆர்யபடரை மறுத்தார் — சுறுசுறுப்பான அறிவியல் விவாதம்', te: 'ఆర్యభటను వివాదం చేశారు — సజీవ శాస్త్రీయ చర్చ', bn: 'আর্যভটকে বিতর্ক করলেন — সক্রিয় বৈজ্ঞানিক বিতর্ক', kn: 'ಆರ್ಯಭಟರನ್ನು ವಿವಾದಿಸಿದರು — ಸಕ್ರಿಯ ವೈಜ್ಞಾನಿಕ ಚರ್ಚೆ', gu: 'આર્યભટ સાથે મતભેદ — સક્રિય વૈજ્ઞાનિક ચર્ચા' }, color: '#60a5fa' },
  { year: '1000 CE', person: 'Al-Biruni', event: { en: 'Arab scholar visits India, translates Aryabhatiya', hi: 'अरब विद्वान भारत आए, आर्यभटीय का अनुवाद किया', sa: 'अरब विद्वान भारत आए, आर्यभटीय का अनुवाद किया', mai: 'अरब विद्वान भारत आए, आर्यभटीय का अनुवाद किया', mr: 'अरब विद्वान भारत आए, आर्यभटीय का अनुवाद किया', ta: 'அரபு அறிஞர் இந்தியா வருகை, ஆர்யபடீயத்தை மொழிபெயர்த்தார்', te: 'అరబ్ పండితుడు భారతదేశాన్ని సందర్శించారు, ఆర్యభటీయను అనువదించారు', bn: 'আরব পণ্ডিত ভারত পরিদর্শন, আর্যভটীয় অনুবাদ করলেন', kn: 'ಅರಬ್ ವಿದ್ವಾಂಸ ಭಾರತಕ್ಕೆ ಭೇಟಿ, ಆರ್ಯಭಟೀಯವನ್ನು ಅನುವಾದಿಸಿದರು', gu: 'અરબ વિદ્વાન ભારત મુલાકાત, આર્યભટીયનો અનુવાદ કર્યો' }, color: '#a78bfa' },
  { year: '1543 CE', person: 'Copernicus', event: { en: 'Publishes heliocentric model in Europe', hi: 'यूरोप में सौर-केंद्रित मॉडल प्रकाशित किया', sa: 'यूरोप में सौर-केंद्रित मॉडल प्रकाशित किया', mai: 'यूरोप में सौर-केंद्रित मॉडल प्रकाशित किया', mr: 'यूरोप में सौर-केंद्रित मॉडल प्रकाशित किया', ta: 'ஐரோப்பாவில் சூரிய மையக் கோட்பாட்டை வெளியிட்டார்', te: 'యూరప్‌లో సూర్యకేంద్ర నమూనాను ప్రచురించారు', bn: 'ইউরোপে সূর্যকেন্দ্রিক মডেল প্রকাশ করলেন', kn: 'ಯುರೋಪ್‌ನಲ್ಲಿ ಸೂರ್ಯಕೇಂದ್ರಿತ ಮಾದರಿ ಪ್ರಕಟಿಸಿದರು', gu: 'યુરોપમાં સૂર્યકેન્દ્રી મોડેલ પ્રકાશિત કર્યું' }, color: '#f87171' },
  { year: '1632 CE', person: 'Galileo', event: { en: 'Imprisoned for teaching Earth moves', hi: 'पृथ्वी के गतिशील होने का पाठ पढ़ाने पर कारावास', sa: 'पृथ्वी के गतिशील होने का पाठ पढ़ाने पर कारावास', mai: 'पृथ्वी के गतिशील होने का पाठ पढ़ाने पर कारावास', mr: 'पृथ्वी के गतिशील होने का पाठ पढ़ाने पर कारावास', ta: 'பூமி நகர்கிறது என்று கற்பித்ததற்காக சிறையில் அடைக்கப்பட்டார்', te: 'భూమి కదులుతుందని బోధించినందుకు జైలు', bn: 'পৃথিবী ঘোরে শেখানোর জন্য কারাবন্দী', kn: 'ಭೂಮಿ ಚಲಿಸುತ್ತದೆ ಎಂದು ಕಲಿಸಿದ್ದಕ್ಕೆ ಸೆರೆಮನೆ', gu: 'પૃથ્વી ફરે છે તે શીખવવા બદલ કેદ' }, color: '#f87171' },
  { year: '1687 CE', person: 'Newton', event: { en: 'Resolves the "thrown stone" objection with inertia', hi: 'जड़त्व से "फेंके गए पत्थर" की आपत्ति हल की', sa: 'जड़त्व से "फेंके गए पत्थर" की आपत्ति हल की', mai: 'जड़त्व से "फेंके गए पत्थर" की आपत्ति हल की', mr: 'जड़त्व से "फेंके गए पत्थर" की आपत्ति हल की', ta: 'ஜட़த்வ ஸே "फேம்கே கஎ பத்थர" கீ ஆபத்தி ஹல கீ', te: 'జడ़త్వ సే "ఫేంకే గఏ పత్థర" కీ ఆపత్తి హల కీ', bn: 'জড়ত্ব সে "ফেংকে গএ পত্থর" কী আপত্তি হল কী', kn: 'ಜಡ़ತ್ವ ಸೇ "ಫೇಂಕೇ ಗಏ ಪತ್ಥರ" ಕೀ ಆಪತ್ತಿ ಹಲ ಕೀ', gu: 'જડ़ત્વ સે "ફેંકે ગએ પત્થર" કી આપત્તિ હલ કી' }, color: '#34d399' },
];

const ACHIEVEMENTS = [
  { metric: 'Sidereal day', aryabhata: '23h 56m 4.1s', modern: '23h 56m 4.091s', accuracy: '99.999%' },
  { metric: "Earth's circumference", aryabhata: '39,736 miles', modern: '24,901 miles', accuracy: '99.4%' },
  { metric: "Earth's diameter", aryabhata: '8,316 miles', modern: '7,917 miles', accuracy: '95%' },
  { metric: 'Year length', aryabhata: '365d 6h 12m 30s', modern: '365d 6h 9m 10s', accuracy: '99.99%' },
  { metric: 'Moon\'s orbit period', aryabhata: '27.32 days', modern: '27.32 days', accuracy: '99.99%' },
];

export default async function EarthRotationPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params as { locale: Locale };
  const isHi = isDevanagariLocale(locale);
  const hf = isHi ? { fontFamily: 'var(--font-devanagari-heading)' } : { fontFamily: 'var(--font-heading)' };
  const t = (key: string) => lt((L as unknown as Record<string, LocaleText>)[key], locale);
  const l = (obj: LocaleText | Record<string, string>) => lt(obj as LocaleText, locale);

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

      {/* ── Section 1: The Quote ─────────────────────────────────── */}
      <div
        className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-2xl p-6"
      >
        <h3 className="text-gold-light font-bold text-xl mb-4" style={hf}>{t('s1Title')}</h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-5">{t('s1Body')}</p>

        {/* Sanskrit verse */}
        <div className="p-5 rounded-xl bg-gold-primary/8 border border-gold-primary/20 mb-4">
          <p className="text-xs text-text-secondary mb-2 font-semibold">{tl({ en: 'Aryabhatiya, Golapada, Verse 9', hi: 'आर्यभटीय, गोलपाद, श्लोक 9', sa: 'आर्यभटीय, गोलपाद, श्लोक 9' }, locale)}</p>
          <p className="text-gold-light text-base font-mono leading-relaxed mb-3" style={{ fontFamily: 'var(--font-devanagari-body)' }}>
            {t('s1Sanskrit')}
          </p>
          <p className="text-text-secondary text-sm leading-relaxed italic">
            {t('s1Quote1')}
          </p>
        </div>

        <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
          <p className="text-emerald-300 text-xs">
            {tl({ en: "✦ Aryabhata used the boat analogy — a person on a moving boat sees the stationary shore moving backward. This is the same starting point as Einstein\'s principle of relativity.", hi: "✦ आर्यभट ने नाव के उपमा का उपयोग किया — एक चलती नाव पर एक व्यक्ति स्थिर किनारे को पीछे जाते देखता है। यह आइंस्टाइन के सापेक्षता के सिद्धांत का वही प्रारंभिक बिंदु है।", sa: "✦ आर्यभट ने नाव के उपमा का उपयोग किया — एक चलती नाव पर एक व्यक्ति स्थिर किनारे को पीछे जाते देखता है। यह आइंस्टाइन के सापेक्षता के सिद्धांत का वही प्रारंभिक बिंदु है।" }, locale)}
          </p>
        </div>
      </div>

      {/* ── Section 2: Why Revolutionary ────────────────────────── */}
      <div
        className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-2xl p-6"
      >
        <h3 className="text-gold-light font-bold text-xl mb-4" style={hf}>{t('s2Title')}</h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-4">{t('s2Body')}</p>

        {/* Comparison */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 rounded-xl bg-red-500/8 border border-red-500/15">
            <div className="text-red-300 font-semibold text-sm mb-2">{tl({ en: 'Ptolemaic Model (~150 CE)', hi: 'टॉलेमी का मॉडल (~150 CE)', sa: 'टॉलेमी का मॉडल (~150 CE)' }, locale)}</div>
            <ul className="text-text-secondary text-xs space-y-1">
              <li>• {tl({ en: 'Earth fixed at center', hi: 'पृथ्वी केंद्र में स्थिर', sa: 'पृथ्वी केंद्र में स्थिर' }, locale)}</li>
              <li>• {tl({ en: 'Sun, Moon, planets orbit Earth', hi: 'सूर्य, चंद्रमा, ग्रह — पृथ्वी के चारों ओर घूमते हैं', sa: 'सूर्य, चंद्रमा, ग्रह — पृथ्वी के चारों ओर घूमते हैं' }, locale)}</li>
              <li>• {tl({ en: 'Dominated Europe for 1,400 years', hi: '1,400 वर्षों तक यूरोप में प्रभुत्व', sa: '1,400 वर्षों तक यूरोप में प्रभुत्व' }, locale)}</li>
              <li>• {tl({ en: 'Accepted as Church dogma', hi: 'चर्च द्वारा हठधर्मिता के रूप में स्वीकृत', sa: 'चर्च द्वारा हठधर्मिता के रूप में स्वीकृत' }, locale)}</li>
            </ul>
          </div>
          <div className="p-4 rounded-xl bg-emerald-500/8 border border-emerald-500/15">
            <div className="text-emerald-300 font-semibold text-sm mb-2">{tl({ en: "Aryabhata's Model (499 CE)", hi: "आर्यभट का मॉडल (499 CE)", sa: "आर्यभट का मॉडल (499 CE)" }, locale)}</div>
            <ul className="text-text-secondary text-xs space-y-1">
              <li>• {tl({ en: 'Earth rotates on its axis', hi: 'पृथ्वी अपनी धुरी पर घूमती है', sa: 'पृथ्वी अपनी धुरी पर घूमती है' }, locale)}</li>
              <li>• {tl({ en: "Stars' apparent motion due to Earth's rotation", hi: "तारों की स्पष्ट गति पृथ्वी के घूर्णन के कारण", sa: "तारों की स्पष्ट गति पृथ्वी के घूर्णन के कारण" }, locale)}</li>
              <li>• {tl({ en: 'Principle of relative motion stated', hi: 'सापेक्ष गति का सिद्धांत प्रस्तुत किया', sa: 'सापेक्ष गति का सिद्धांत प्रस्तुत किया' }, locale)}</li>
              <li>• {tl({ en: 'Later extended by Kerala School', hi: 'आगे चलकर केरल स्कूल ने इसे विकसित किया', sa: 'आगे चलकर केरल स्कूल ने इसे विकसित किया' }, locale)}</li>
            </ul>
          </div>
        </div>
      </div>

      {/* ── Section 3: Brahmagupta Debate ───────────────────────── */}
      <div
        className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-2xl p-6"
      >
        <h3 className="text-gold-light font-bold text-xl mb-4" style={hf}>{t('s3Title')}</h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-4">{t('s3Body')}</p>

        <div className="p-4 rounded-xl bg-blue-500/8 border border-blue-500/15">
          <p className="text-blue-200 font-semibold text-xs mb-2">{tl({ en: "Brahmagupta's Objection (628 CE)", hi: "ब्रह्मगुप्त की आपत्ति (628 CE)", sa: "ब्रह्मगुप्त की आपत्ति (628 CE)" }, locale)}</p>
          <p className="text-text-secondary text-sm italic">
            {tl({ en: '"If the Earth rotates, why does an object thrown upward not land to the west?" — Brahmasphutasiddhanta, Ch. 11', hi: '"यदि पृथ्वी घूमती है, तो ऊपर फेंकी गई वस्तु पश्चिम में क्यों नहीं गिरती?" — ब्रह्मस्फुटसिद्धांत, अध्याय 11', sa: '"यदि पृथ्वी घूमती है, तो ऊपर फेंकी गई वस्तु पश्चिम में क्यों नहीं गिरती?" — ब्रह्मस्फुटसिद्धांत, अध्याय 11' }, locale)}
          </p>
          <p className="text-text-secondary text-xs mt-2">
            {tl({ en: "→ Answer: Newton\'s inertia — the object carries the Earth\'s motion with it. Discovered 1,059 years later.", hi: "→ उत्तर: न्यूटन का जड़त्व — वस्तु पृथ्वी की गति को साथ लेती है। 1,059 वर्षों में खोजा गया।", sa: "→ उत्तर: न्यूटन का जड़त्व — वस्तु पृथ्वी की गति को साथ लेती है। 1,059 वर्षों में खोजा गया।" }, locale)}
          </p>
        </div>
      </div>

      {/* ── Section 4: Circumference ────────────────────────────── */}
      <div
        className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-2xl p-6"
      >
        <h3 className="text-gold-light font-bold text-xl mb-4" style={hf}>{t('s4Title')}</h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-5">{t('s4Body')}</p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="p-4 rounded-xl bg-gold-primary/8 border border-gold-primary/15 text-center">
            <div className="text-gold-light text-2xl font-bold">39,968 km</div>
            <div className="text-text-secondary text-xs mt-1">{tl({ en: "Aryabhata's calculation", hi: "आर्यभट की गणना", sa: "आर्यभट की गणना" }, locale)}</div>
          </div>
          <div className="p-4 rounded-xl bg-white/[0.03] border border-white/5 text-center">
            <div className="text-text-primary text-2xl font-bold">40,075 km</div>
            <div className="text-text-secondary text-xs mt-1">{tl({ en: 'Modern value', hi: 'आधुनिक मान', sa: 'आधुनिक मान' }, locale)}</div>
          </div>
          <div className="p-4 rounded-xl bg-emerald-500/8 border border-emerald-500/15 text-center">
            <div className="text-emerald-400 text-2xl font-bold">99.7%</div>
            <div className="text-text-secondary text-xs mt-1">{tl({ en: 'Accuracy (in 499 CE!)', hi: 'सटीकता (499 CE में!)', sa: 'सटीकता (499 CE में!)' }, locale)}</div>
          </div>
        </div>
      </div>

      {/* ── Section 5: Sidereal / Ayanamsha ─────────────────────── */}
      <div
        className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-2xl p-6"
      >
        <h3 className="text-gold-light font-bold text-xl mb-4" style={hf}>{t('s5Title')}</h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-5">{t('s5Body')}</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 rounded-xl bg-white/[0.03] border border-gold-primary/10">
            <div className="text-text-secondary text-xs mb-2 font-semibold">{tl({ en: 'Sidereal Day — Aryabhata', hi: 'नाक्षत्र दिन — आर्यभट', sa: 'नाक्षत्र दिन — आर्यभट' }, locale)}</div>
            <div className="text-gold-light text-lg font-mono">23h 56m 4.1s</div>
          </div>
          <div className="p-4 rounded-xl bg-white/[0.03] border border-gold-primary/10">
            <div className="text-text-secondary text-xs mb-2 font-semibold">{tl({ en: 'Sidereal Day — Modern', hi: 'नाक्षत्र दिन — आधुनिक', sa: 'नाक्षत्र दिन — आधुनिक' }, locale)}</div>
            <div className="text-emerald-400 text-lg font-mono">23h 56m 4.091s</div>
          </div>
        </div>
        <p className="text-text-secondary text-xs mt-3 italic">
          {tl({ en: "→ Difference: 0.009 seconds. After 1,500 years. This is not because he guessed lucky — it\'s because he had a mathematical model.", hi: "→ अंतर: 0.009 सेकंड। 1,500 वर्षों के बाद। यह इसलिए नहीं है कि उन्होंने भाग्य से अनुमान लगाया — यह इसलिए है कि उनके पास गणितीय मॉडल था।", sa: "→ अंतर: 0.009 सेकंड। 1,500 वर्षों के बाद। यह इसलिए नहीं है कि उन्होंने भाग्य से अनुमान लगाया — यह इसलिए है कि उनके पास गणितीय मॉडल था।" }, locale)}
        </p>
      </div>

      {/* ── Section 6: Timeline ──────────────────────────────────── */}
      <div
        className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-2xl p-6"
      >
        <h3 className="text-gold-light font-bold text-xl mb-6" style={hf}>{t('s6Title')}</h3>
        <div className="relative">
          <div className="absolute left-8 top-0 bottom-0 w-px bg-gold-primary/20" />
          <div className="space-y-4">
            {TIMELINE.map((item, i) => (
              <div key={i} className="flex gap-4 items-start">
                <div
                  className="flex-shrink-0 w-16 h-16 rounded-xl flex flex-col items-center justify-center text-center z-10 border"
                  style={{ background: `${item.color}15`, borderColor: `${item.color}30` }}
                >
                  <span className="text-xs font-bold" style={{ color: item.color }}>{item.year}</span>
                </div>
                <div className="pt-1">
                  <div className="text-text-primary text-sm font-semibold">{item.person}</div>
                  <div className="text-text-secondary text-xs leading-relaxed">{l(item.event)}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Section 7: Achievements Table ───────────────────────── */}
      <div
        className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-2xl p-6"
      >
        <h3 className="text-gold-light font-bold text-xl mb-4" style={hf}>{t('s7Title')}</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-gold-primary/15">
                <th className="text-left text-gold-light py-2 pr-4">{tl({ en: 'Measurement', hi: 'माप', sa: 'माप' }, locale)}</th>
                <th className="text-right text-gold-light py-2 pr-4">{tl({ en: 'Aryabhata (499 CE)', hi: 'आर्यभट (499 CE)', sa: 'आर्यभट (499 CE)' }, locale)}</th>
                <th className="text-right text-gold-light py-2 pr-4">{tl({ en: 'Modern Value', hi: 'आधुनिक मान', sa: 'आधुनिक मान' }, locale)}</th>
                <th className="text-right text-gold-light py-2">{tl({ en: 'Accuracy', hi: 'सटीकता', sa: 'सटीकता' }, locale)}</th>
              </tr>
            </thead>
            <tbody>
              {ACHIEVEMENTS.map((row, i) => (
                <tr key={i} className={`border-b border-gold-primary/8 ${i % 2 === 0 ? 'bg-white/[0.01]' : ''}`}>
                  <td className="text-text-primary py-2 pr-4">{row.metric}</td>
                  <td className="text-right text-text-secondary py-2 pr-4 font-mono">{row.aryabhata}</td>
                  <td className="text-right text-text-secondary py-2 pr-4 font-mono">{row.modern}</td>
                  <td className="text-right text-emerald-400 py-2 font-mono font-semibold">{row.accuracy}</td>
                </tr>
              ))}
            </tbody>
          </table>
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
          <Link href="/learn/contributions/sine" className="px-4 py-2 rounded-xl bg-gold-primary/10 border border-gold-primary/15 text-gold-light text-sm hover:bg-gold-primary/20 transition-colors">
            ← {t('prevPage')}
          </Link>
          <Link href="/learn/contributions/calculus" className="px-4 py-2 rounded-xl bg-gold-primary/15 border border-gold-primary/20 text-gold-light text-sm hover:bg-gold-primary/25 transition-colors">
            {t('nextPage')} →
          </Link>
        </div>
      </div>

    </div>
  );
}
