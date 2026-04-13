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
  { year: '499 CE', person: 'Aryabhata', event: { en: 'States Earth rotates on its axis, in Aryabhatiya Golapada', hi: 'आर्यभटीय गोलपाद में पृथ्वी के अक्षीय घूर्णन का कथन', sa: 'आर्यभटीय गोलपाद में पृथ्वी के अक्षीय घूर्णन का कथन', mai: 'आर्यभटीय गोलपाद में पृथ्वी के अक्षीय घूर्णन का कथन', mr: 'आर्यभटीय गोलपाद में पृथ्वी के अक्षीय घूर्णन का कथन', ta: 'States Earth rotates on its axis, in Aryabhatiya Golapada', te: 'States Earth rotates on its axis, in Aryabhatiya Golapada', bn: 'States Earth rotates on its axis, in Aryabhatiya Golapada', kn: 'States Earth rotates on its axis, in Aryabhatiya Golapada', gu: 'States Earth rotates on its axis, in Aryabhatiya Golapada' }, color: '#f0d48a' },
  { year: '628 CE', person: 'Brahmagupta', event: { en: 'Disputes Aryabhata — active scientific debate', hi: 'आर्यभट का विरोध — सक्रिय वैज्ञानिक बहस', sa: 'आर्यभट का विरोध — सक्रिय वैज्ञानिक बहस', mai: 'आर्यभट का विरोध — सक्रिय वैज्ञानिक बहस', mr: 'आर्यभट का विरोध — सक्रिय वैज्ञानिक बहस', ta: 'Disputes Aryabhata — active scientific debate', te: 'Disputes Aryabhata — active scientific debate', bn: 'Disputes Aryabhata — active scientific debate', kn: 'Disputes Aryabhata — active scientific debate', gu: 'Disputes Aryabhata — active scientific debate' }, color: '#60a5fa' },
  { year: '1000 CE', person: 'Al-Biruni', event: { en: 'Arab scholar visits India, translates Aryabhatiya', hi: 'अरब विद्वान भारत आए, आर्यभटीय का अनुवाद किया', sa: 'अरब विद्वान भारत आए, आर्यभटीय का अनुवाद किया', mai: 'अरब विद्वान भारत आए, आर्यभटीय का अनुवाद किया', mr: 'अरब विद्वान भारत आए, आर्यभटीय का अनुवाद किया', ta: 'Arab scholar visits India, translates Aryabhatiya', te: 'Arab scholar visits India, translates Aryabhatiya', bn: 'Arab scholar visits India, translates Aryabhatiya', kn: 'Arab scholar visits India, translates Aryabhatiya', gu: 'Arab scholar visits India, translates Aryabhatiya' }, color: '#a78bfa' },
  { year: '1543 CE', person: 'Copernicus', event: { en: 'Publishes heliocentric model in Europe', hi: 'यूरोप में सौर-केंद्रित मॉडल प्रकाशित किया', sa: 'यूरोप में सौर-केंद्रित मॉडल प्रकाशित किया', mai: 'यूरोप में सौर-केंद्रित मॉडल प्रकाशित किया', mr: 'यूरोप में सौर-केंद्रित मॉडल प्रकाशित किया', ta: 'Publishes heliocentric model in Europe', te: 'Publishes heliocentric model in Europe', bn: 'Publishes heliocentric model in Europe', kn: 'Publishes heliocentric model in Europe', gu: 'Publishes heliocentric model in Europe' }, color: '#f87171' },
  { year: '1632 CE', person: 'Galileo', event: { en: 'Imprisoned for teaching Earth moves', hi: 'पृथ्वी के गतिशील होने का पाठ पढ़ाने पर कारावास', sa: 'पृथ्वी के गतिशील होने का पाठ पढ़ाने पर कारावास', mai: 'पृथ्वी के गतिशील होने का पाठ पढ़ाने पर कारावास', mr: 'पृथ्वी के गतिशील होने का पाठ पढ़ाने पर कारावास', ta: 'Imprisoned for teaching Earth moves', te: 'Imprisoned for teaching Earth moves', bn: 'Imprisoned for teaching Earth moves', kn: 'Imprisoned for teaching Earth moves', gu: 'Imprisoned for teaching Earth moves' }, color: '#f87171' },
  { year: '1687 CE', person: 'Newton', event: { en: 'Resolves the "thrown stone" objection with inertia', hi: 'जड़त्व से "फेंके गए पत्थर" की आपत्ति हल की', sa: 'जड़त्व से "फेंके गए पत्थर" की आपत्ति हल की', mai: 'जड़त्व से "फेंके गए पत्थर" की आपत्ति हल की', mr: 'जड़त्व से "फेंके गए पत्थर" की आपत्ति हल की', ta: 'Resolves the "thrown stone" objection with inertia', te: 'Resolves the "thrown stone" objection with inertia', bn: 'Resolves the "thrown stone" objection with inertia', kn: 'Resolves the "thrown stone" objection with inertia', gu: 'Resolves the "thrown stone" objection with inertia' }, color: '#34d399' },
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
          <p className="text-xs text-text-secondary mb-2 font-semibold">{isHi ? 'आर्यभटीय, गोलपाद, श्लोक 9' : 'Aryabhatiya, Golapada, Verse 9'}</p>
          <p className="text-gold-light text-base font-mono leading-relaxed mb-3" style={{ fontFamily: 'var(--font-devanagari-body)' }}>
            {t('s1Sanskrit')}
          </p>
          <p className="text-text-secondary text-sm leading-relaxed italic">
            {t('s1Quote1')}
          </p>
        </div>

        <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
          <p className="text-emerald-300 text-xs">
            {isHi
              ? '✦ आर्यभट ने नाव के उपमा का उपयोग किया — एक चलती नाव पर एक व्यक्ति स्थिर किनारे को पीछे जाते देखता है। यह आइंस्टाइन के सापेक्षता के सिद्धांत का वही प्रारंभिक बिंदु है।'
              : '✦ Aryabhata used the boat analogy — a person on a moving boat sees the stationary shore moving backward. This is the same starting point as Einstein\'s principle of relativity.'}
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
            <div className="text-red-300 font-semibold text-sm mb-2">{isHi ? 'टॉलेमी का मॉडल (~150 CE)' : 'Ptolemaic Model (~150 CE)'}</div>
            <ul className="text-text-secondary text-xs space-y-1">
              <li>• {isHi ? 'पृथ्वी केंद्र में स्थिर' : 'Earth fixed at center'}</li>
              <li>• {isHi ? 'सूर्य, चंद्रमा, ग्रह — पृथ्वी के चारों ओर घूमते हैं' : 'Sun, Moon, planets orbit Earth'}</li>
              <li>• {isHi ? '1,400 वर्षों तक यूरोप में प्रभुत्व' : 'Dominated Europe for 1,400 years'}</li>
              <li>• {isHi ? 'चर्च द्वारा हठधर्मिता के रूप में स्वीकृत' : 'Accepted as Church dogma'}</li>
            </ul>
          </div>
          <div className="p-4 rounded-xl bg-emerald-500/8 border border-emerald-500/15">
            <div className="text-emerald-300 font-semibold text-sm mb-2">{isHi ? 'आर्यभट का मॉडल (499 CE)' : "Aryabhata's Model (499 CE)"}</div>
            <ul className="text-text-secondary text-xs space-y-1">
              <li>• {isHi ? 'पृथ्वी अपनी धुरी पर घूमती है' : 'Earth rotates on its axis'}</li>
              <li>• {isHi ? 'तारों की स्पष्ट गति पृथ्वी के घूर्णन के कारण' : "Stars' apparent motion due to Earth's rotation"}</li>
              <li>• {isHi ? 'सापेक्ष गति का सिद्धांत प्रस्तुत किया' : 'Principle of relative motion stated'}</li>
              <li>• {isHi ? 'आगे चलकर केरल स्कूल ने इसे विकसित किया' : 'Later extended by Kerala School'}</li>
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
          <p className="text-blue-200 font-semibold text-xs mb-2">{isHi ? 'ब्रह्मगुप्त की आपत्ति (628 CE)' : "Brahmagupta's Objection (628 CE)"}</p>
          <p className="text-text-secondary text-sm italic">
            {isHi
              ? '"यदि पृथ्वी घूमती है, तो ऊपर फेंकी गई वस्तु पश्चिम में क्यों नहीं गिरती?" — ब्रह्मस्फुटसिद्धांत, अध्याय 11'
              : '"If the Earth rotates, why does an object thrown upward not land to the west?" — Brahmasphutasiddhanta, Ch. 11'}
          </p>
          <p className="text-text-secondary text-xs mt-2">
            {isHi
              ? '→ उत्तर: न्यूटन का जड़त्व — वस्तु पृथ्वी की गति को साथ लेती है। 1,059 वर्षों में खोजा गया।'
              : '→ Answer: Newton\'s inertia — the object carries the Earth\'s motion with it. Discovered 1,059 years later.'}
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
            <div className="text-text-secondary text-xs mt-1">{isHi ? 'आर्यभट की गणना' : "Aryabhata's calculation"}</div>
          </div>
          <div className="p-4 rounded-xl bg-white/[0.03] border border-white/5 text-center">
            <div className="text-text-primary text-2xl font-bold">40,075 km</div>
            <div className="text-text-secondary text-xs mt-1">{isHi ? 'आधुनिक मान' : 'Modern value'}</div>
          </div>
          <div className="p-4 rounded-xl bg-emerald-500/8 border border-emerald-500/15 text-center">
            <div className="text-emerald-400 text-2xl font-bold">99.7%</div>
            <div className="text-text-secondary text-xs mt-1">{isHi ? 'सटीकता (499 CE में!)' : 'Accuracy (in 499 CE!)'}</div>
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
            <div className="text-text-secondary text-xs mb-2 font-semibold">{isHi ? 'नाक्षत्र दिन — आर्यभट' : 'Sidereal Day — Aryabhata'}</div>
            <div className="text-gold-light text-lg font-mono">23h 56m 4.1s</div>
          </div>
          <div className="p-4 rounded-xl bg-white/[0.03] border border-gold-primary/10">
            <div className="text-text-secondary text-xs mb-2 font-semibold">{isHi ? 'नाक्षत्र दिन — आधुनिक' : 'Sidereal Day — Modern'}</div>
            <div className="text-emerald-400 text-lg font-mono">23h 56m 4.091s</div>
          </div>
        </div>
        <p className="text-text-secondary text-xs mt-3 italic">
          {isHi
            ? '→ अंतर: 0.009 सेकंड। 1,500 वर्षों के बाद। यह इसलिए नहीं है कि उन्होंने भाग्य से अनुमान लगाया — यह इसलिए है कि उनके पास गणितीय मॉडल था।'
            : '→ Difference: 0.009 seconds. After 1,500 years. This is not because he guessed lucky — it\'s because he had a mathematical model.'}
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
                <th className="text-left text-gold-light py-2 pr-4">{isHi ? 'माप' : 'Measurement'}</th>
                <th className="text-right text-gold-light py-2 pr-4">{isHi ? 'आर्यभट (499 CE)' : 'Aryabhata (499 CE)'}</th>
                <th className="text-right text-gold-light py-2 pr-4">{isHi ? 'आधुनिक मान' : 'Modern Value'}</th>
                <th className="text-right text-gold-light py-2">{isHi ? 'सटीकता' : 'Accuracy'}</th>
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
