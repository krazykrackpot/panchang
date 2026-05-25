'use client';

import { useLocale } from 'next-intl';
import { isDevanagariLocale } from '@/lib/utils/locale-fonts';
import LearnLink from '@/components/ui/LearnLink';
import InfoBlock from '@/components/ui/InfoBlock';
import { lt } from '@/lib/learn/translations';
import MSG from '@/messages/pages/muhurta-ai.json';
import type { LocaleText } from '@/types/panchang';
import MuhurtaScannerClient from './MuhurtaScannerClient';

const msg = (key: string, locale: string) => lt((MSG as unknown as Record<string, LocaleText>)[key], locale);

const L: Record<string, Record<string, string>> = {
  en: {
    edTitle: 'What is Muhurta  –  The Vedic Science of Auspicious Timing',
    edIntro: 'Muhurta (electional astrology) is the branch of Jyotish Shastra dedicated to selecting the most favourable moment for initiating important actions. The foundational principle is simple yet profound: time is not neutral. The Vedic tradition holds that Kaal (Time) is the supreme force  –  every moment carries a unique energetic signature shaped by the positions of the Sun, Moon, and planets. A marriage begun under an auspicious muhurta inherits the cosmic support of that moment; a business launched during Vishti Karana or Rahu Kaal inherits their obstruction.',
    edElementsTitle: 'The Five Elements of Muhurta (Panchanga Shuddhi)',
    edElements: 'A muhurta is evaluated through five simultaneous lenses, collectively called Panchanga Shuddhi. Tithi (lunar day)  –  each of the 30 tithis per month has a ruling deity and intrinsic quality. Nanda tithis (1, 6, 11) favour joyful occasions; Bhadra tithis (2, 7, 12) suit prosperity-oriented acts. Nakshatra (lunar mansion)  –  the 27 nakshatras are classified as Fixed, Movable, Sharp, Soft, or Mixed, each suited to different activities. Deva nakshatras like Pushya and Revati are universally auspicious. Yoga  –  the 27 nitya yogas arise from the combined longitude of Sun and Moon. Siddhi, Amrita, and Shubha yogas amplify success; Vyatipata and Vaidhriti are avoided. Karana (half-tithi)  –  11 karanas rotate through each lunar month. Vishti (Bhadra) karana is universally inauspicious. Vara (weekday)  –  each day is ruled by a graha. Thursday (Guru) and Friday (Shukra) are broadly favourable; Saturday and Tuesday require careful evaluation.',
    edClassicalTitle: 'Classical Scriptural Basis',
    edClassical: 'The primary texts for muhurta selection are the Muhurta Chintamani by Rama Daivagya and the Muhurta Martanda by Narayana Daivagya. These 16th-17th century treatises codify rules from earlier sources including the Brihat Samhita of Varahamihira and the Kalaprakashika. They define specific conditions for each type of activity  –  marriage requires a fixed nakshatra on a Monday, Wednesday, Thursday, or Friday with Shukla Paksha tithi, for instance  –  and enumerate hundreds of special yogas (Sarvartha Siddhi, Amrita Siddhi, Ravi Yoga) that enhance or diminish a window.',
    edScoringTitle: 'Classical 36-Rule Scoring Engine',
    edScoring: 'Our engine applies 36 discrete rules sourced from 7 classical texts: Muhurta Chintamani (MC), Dharma Sindhu, BPHS, Brihat Samhita, Prashna Marga, B.V. Raman\'s Muhurtha, and Kalaprakashika. Rules are organised into a 5-tier authority system: (1) Absolute vetoes  –  Venus/Jupiter combustion, Adhika Masa, Chaturmas with exact Devshayani→Prabodhini Ekadashi boundaries; (2) Override rules  –  Godhuli Lagna (sunset ±24 min) overrides all defects for marriage per Brihat Samhita Ch.103, and Venus/Mercury/Jupiter in the ascendant cancels all other flaws per MC Ch.7; (3) Major factors  –  nakshatra suitability, tithi-vara alignment, 8th house vacancy; (4) Standard scoring  –  yoga, karana, hora lord, choghadiya; (5) Cancellable factors  –  weak karana or minor dosha that a strong lagna compensates. This is classical cancellation logic, not additive scoring: a powerful lagna genuinely removes defects rather than merely offsetting them numerically. When birth data is provided, the engine adds personalised dimensions: Tara Bala (nakshatra compatibility), Chandra Bala (Moon transit strength), and Dasha Harmony (current Vimshottari period alignment). Each scored window shows pandit-style reasoning with chapter-level citations.',
    edAvoidTitle: 'What Makes a Good Muhurta',
    edAvoid: 'A well-chosen muhurta requires both the presence of auspicious factors and the verified absence of inauspicious periods. The engine detects: Dur Muhurtam (the 48-minute daily window that shifts by weekday), Varjyam (nakshatra-specific inauspicious ghatis), Tithi-Gandanthara (junctional tithis at paksha boundaries), Rahu Kaal and Yamaghanda, Vishti Karana (Bhadra), Panchaka dosha (Moon in nakshatras 23-27), Venus/Jupiter combustion with BPHS-standard orbs (Venus 10°, 8° retrograde; Jupiter 11°), exact Chaturmas boundaries computed from real Devshayani and Prabodhini Ekadashi dates (not month approximations), and 8th house vacancy check for marriage. Unlike binary pass/fail systems, our engine grades windows 0-100 with differentiated reasoning  –  a window during Rahu Kaal with perfect lagna and excellent nakshatra will score differently from one with multiple minor flaws, because the cancellation hierarchy (MC Ch.7: "strong lagna removes all defects") genuinely elevates certain combinations above their individual components.',
  },
  hi: {
    edTitle: 'मुहूर्त क्या है  –  शुभ समय का वैदिक विज्ञान',
    edIntro: 'मुहूर्त (निर्वाचन ज्योतिष) ज्योतिष शास्त्र की वह शाखा है जो महत्वपूर्ण कार्यों के आरम्भ के लिए सर्वाधिक अनुकूल क्षण का चयन करती है। मूल सिद्धान्त सरल किन्तु गहन है: समय तटस्थ नहीं है। वैदिक परम्परा मानती है कि काल (समय) सर्वोच्च शक्ति है  –  प्रत्येक क्षण सूर्य, चन्द्र और ग्रहों की स्थिति से निर्मित एक अद्वितीय ऊर्जा हस्ताक्षर वहन करता है। शुभ मुहूर्त में आरम्भ किया गया विवाह उस क्षण का ब्रह्माण्डीय समर्थन प्राप्त करता है; विष्टि करण या राहुकाल में आरम्भ किया गया व्यवसाय उनकी बाधा।',
    edElementsTitle: 'मुहूर्त के पाँच तत्व (पंचांग शुद्धि)',
    edElements: 'मुहूर्त का मूल्यांकन पाँच एक साथ दृष्टिकोणों से होता है, जिसे सामूहिक रूप से पंचांग शुद्धि कहते हैं। तिथि  –  प्रत्येक मास की 30 तिथियों का एक अधिष्ठाता देवता और आन्तरिक गुण होता है। नन्दा तिथियाँ (1, 6, 11) आनन्दपूर्ण अवसरों के अनुकूल हैं। नक्षत्र  –  27 नक्षत्र स्थिर, चर, तीक्ष्ण, मृदु या मिश्र के रूप में वर्गीकृत हैं। पुष्य और रेवती जैसे देव नक्षत्र सार्वभौमिक रूप से शुभ हैं। योग  –  27 नित्य योग सूर्य और चन्द्र के संयुक्त देशान्तर से उत्पन्न होते हैं। करण  –  11 करण प्रत्येक चान्द्र मास में घूमते हैं; विष्टि (भद्रा) सार्वभौमिक रूप से अशुभ है। वार  –  प्रत्येक दिन एक ग्रह द्वारा शासित है।',
    edClassicalTitle: 'शास्त्रीय आधार',
    edClassical: 'मुहूर्त चयन के प्रमुख ग्रन्थ राम दैवज्ञ की मुहूर्त चिन्तामणि और नारायण दैवज्ञ की मुहूर्त मार्तण्ड हैं। ये 16वीं-17वीं शताब्दी के ग्रन्थ वराहमिहिर की बृहत् संहिता और कालप्रकाशिका सहित पूर्ववर्ती स्रोतों के नियमों को संहिताबद्ध करते हैं। ये प्रत्येक कार्य प्रकार के लिए विशिष्ट शर्तें निर्धारित करते हैं और सैकड़ों विशेष योगों (सर्वार्थ सिद्धि, अमृत सिद्धि, रवि योग) की गणना करते हैं।',
    edScoringTitle: 'शास्त्रीय 36-नियम स्कोरिंग इंजन',
    edScoring: 'हमारा इंजन 7 शास्त्रीय ग्रन्थों  –  मुहूर्त चिन्तामणि (MC), धर्मसिन्धु, BPHS, बृहत् संहिता, प्रश्न मार्ग, बी.वी. रमन की मुहूर्थ, और कालप्रकाशिका  –  से 36 विशिष्ट नियम लागू करता है। नियम 5-स्तरीय प्राधिकार प्रणाली में संगठित हैं: (1) पूर्ण निषेध  –  शुक्र/गुरु अस्त, अधिक मास, देवशयनी→प्रबोधिनी एकादशी की वास्तविक सीमाओं वाला चातुर्मास; (2) अधिभावी नियम  –  गोधूलि लग्न (सूर्यास्त ±24 मिनट) बृहत् संहिता अध्याय 103 के अनुसार विवाह में सभी दोषों को दूर करता है, और MC अध्याय 7 के अनुसार लग्न में शुक्र/बुध/गुरु सभी दोषों का निवारण करते हैं; (3) प्रमुख कारक  –  नक्षत्र, तिथि-वार, अष्टम भाव शून्यता; (4) सामान्य स्कोरिंग  –  योग, करण, होरा, चौघड़िया; (5) निवारणीय कारक  –  दुर्बल करण जिसे बलवान लग्न क्षतिपूर्ति करता है। यह शास्त्रीय निवारण तर्क है, योगात्मक अंकन नहीं। जन्म डेटा देने पर तारा बल, चन्द्र बल और दशा सामंजस्य भी जुड़ते हैं।',
    edAvoidTitle: 'अच्छा मुहूर्त क्या बनाता है',
    edAvoid: 'सुचयनित मुहूर्त में शुभ कारकों की उपस्थिति और अशुभ काल की सत्यापित अनुपस्थिति दोनों आवश्यक हैं। इंजन पहचानता है: दुर्मुहूर्तम् (वार-विशिष्ट 48-मिनट की अशुभ खिड़की), वर्ज्यम् (नक्षत्र-विशिष्ट अशुभ घटी), तिथि-गण्डान्तर (पक्ष सीमा पर संधि तिथियाँ), राहुकाल और यमघण्ट, विष्टि करण (भद्रा), पंचक दोष (नक्षत्र 23-27 में चन्द्र), शुक्र/गुरु अस्त BPHS मानक कोणों पर (शुक्र 10°, वक्री 8°; गुरु 11°), वास्तविक देवशयनी-प्रबोधिनी एकादशी तिथियों से गणित चातुर्मास सीमा, और विवाह में अष्टम भाव शून्यता जाँच। बाइनरी हाँ/नहीं प्रणालियों के विपरीत, हमारा इंजन 0-100 श्रेणीकरण करता है  –  MC अध्याय 7 का सिद्धान्त "बलवान लग्न सभी दोषों का निवारण करता है" यथार्थ रूप से लागू होता है।',
  },
  // Per-locale blocks for sa/ta/te/bn/kn/gu/mr/mai removed May 2026 — they
  // were empty strings and `{ ...L.en, ...localeL }` was OVERRIDING the EN
  // values with `''`. Net effect: blank `<h2>` + blank `<p>` for 6 locales.
  // With the locale keys absent, the spread falls through to L.en — users
  // see English content until proper translations are written. Audit §B2.
};

export default function MuhurtaAIPage() {
  const locale = useLocale();
  const isDevanagari = isDevanagariLocale(locale);
  const headingFont = isDevanagari ? { fontFamily: 'var(--font-devanagari-heading)' } : { fontFamily: 'var(--font-heading)' };
  const bodyFont = isDevanagari ? { fontFamily: 'var(--font-devanagari-body)' } : {};

  const localeL = (L as Record<string, Partial<typeof L.en>>)[locale] || {};
  const t = { ...L.en, ...localeL };

  return (
    <main className="min-h-screen bg-[#0a0e27] pb-20">
      <MuhurtaScannerClient />

      {/* ── Editorial SEO content (preserved from original page) ──────────── */}
      <section className="mx-auto max-w-5xl px-4 mt-16 space-y-8">
        {/* Muhurta Intro InfoBlock */}
        <InfoBlock
          id="muhurta-ai-intro"
          title={msg('infoBlockTitle', locale)}
          defaultOpen={false}
        >
          {isDevanagari ? (
            <p>मुहूर्त सही समय चुनने का वैदिक विज्ञान है। जैसे सही मौसम में बोए गए बीज बेहतर उगते हैं, वैसे ही शुभ समय पर शुरू किए गए कार्य अधिक सफल होते हैं। हमारा 36-नियम शास्त्रीय इंजन प्रत्येक समय खंड को 0-100 के पैमाने पर अंकित करता है: तिथि गुण, नक्षत्र प्रकृति, योग शुभता, ग्रह होरा, चौघड़िया और वर्तमान गोचर।</p>
          ) : (
            <p>Muhurta is the Vedic science of choosing the right time. Just as seeds planted in the right season grow better, actions started at auspicious times succeed more easily. Our 36-rule classical engine scores each time window (0-100) by combining: tithi quality, nakshatra nature, yoga auspiciousness, planetary hora, choghadiya, and current transits.</p>
          )}
        </InfoBlock>

        {/* Editorial cards */}
        <h2 className="text-2xl font-bold text-gold-light" style={headingFont}>
          {t.edTitle || L.en.edTitle}
        </h2>
        <p className="text-text-secondary text-sm leading-relaxed" style={bodyFont}>
          {t.edIntro || L.en.edIntro}
        </p>

        <div className="grid md:grid-cols-2 gap-4">
          {/* Five Elements card */}
          <div className="p-5 bg-gradient-to-br from-[#2d1b69]/30 via-[#1a1040]/40 to-[#0a0e27] border border-gold-primary/10 rounded-xl space-y-2">
            <h3 className="text-base font-semibold text-gold-light" style={headingFont}>
              {t.edElementsTitle || L.en.edElementsTitle}
            </h3>
            <p className="text-text-secondary text-sm leading-relaxed" style={bodyFont}>
              {t.edElements || L.en.edElements}
            </p>
          </div>

          {/* Classical Basis card */}
          <div className="p-5 bg-gradient-to-br from-[#2d1b69]/30 via-[#1a1040]/40 to-[#0a0e27] border border-gold-primary/10 rounded-xl space-y-2">
            <h3 className="text-base font-semibold text-gold-light" style={headingFont}>
              {t.edClassicalTitle || L.en.edClassicalTitle}
            </h3>
            <p className="text-text-secondary text-sm leading-relaxed" style={bodyFont}>
              {t.edClassical || L.en.edClassical}
            </p>
          </div>

          {/* Classical Scoring card */}
          <div className="p-5 bg-gradient-to-br from-[#2d1b69]/30 via-[#1a1040]/40 to-[#0a0e27] border border-gold-primary/10 rounded-xl space-y-2">
            <h3 className="text-base font-semibold text-gold-light" style={headingFont}>
              {t.edScoringTitle || L.en.edScoringTitle}
            </h3>
            <p className="text-text-secondary text-sm leading-relaxed" style={bodyFont}>
              {t.edScoring || L.en.edScoring}
            </p>
          </div>

          {/* Good Muhurta card */}
          <div className="p-5 bg-gradient-to-br from-[#2d1b69]/30 via-[#1a1040]/40 to-[#0a0e27] border border-gold-primary/10 rounded-xl space-y-2">
            <h3 className="text-base font-semibold text-gold-light" style={headingFont}>
              {t.edAvoidTitle || L.en.edAvoidTitle}
            </h3>
            <p className="text-text-secondary text-sm leading-relaxed" style={bodyFont}>
              {t.edAvoid || L.en.edAvoid}
            </p>
          </div>
        </div>

        {/* ── Methodology Section ──────────────────────────────────────── */}
        <div className="mt-12 space-y-6">
          <h2 className="text-2xl font-bold text-gold-light" style={headingFont}>
            {isDevanagari ? 'हमारी गणना पद्धति' : 'How We Calculate'}
          </h2>
          <p className="text-text-secondary text-sm leading-relaxed" style={bodyFont}>
            {isDevanagari
              ? 'हमारा स्कोरिंग इंजन 7 प्रामाणिक ग्रन्थों से 36 विशिष्ट नियमों पर आधारित है: मुहूर्त चिन्तामणि (अध्याय 6-7), धर्मसिन्धु, BPHS, बृहत् संहिता (अध्याय 103), प्रश्न मार्ग, बी.वी. रमन की मुहूर्थ, और कालप्रकाशिका। प्रत्येक नियम एक विशिष्ट अध्याय या श्लोक से जुड़ा है।'
              : 'Our scoring engine applies 36 discrete rules from 7 authoritative texts: Muhurta Chintamani (Ch. 6-7, Vivah/Lagna Prakarana), Dharma Sindhu (Chaturmas/Adhika Masa prohibitions), BPHS (combustion orbs), Brihat Samhita (Ch. 103, Godhuli Lagna), Prashna Marga, B.V. Raman\'s Muhurtha, and Kalaprakashika. Every rule traces to a specific chapter or verse.'}
          </p>

          {/* Hard prohibitions */}
          <div className="rounded-xl border border-red-500/15 bg-red-500/5 p-5">
            <h3 className="text-red-400 text-sm font-bold mb-2">
              {isDevanagari ? 'कठोर निषेध (पूर्ण वर्जित)' : 'Hard Prohibitions (Absolute Vetoes)'}
            </h3>
            <ul className="text-text-secondary text-sm space-y-1.5 list-none" style={bodyFont}>
              <li className="flex items-start gap-2"><span className="text-red-400 flex-shrink-0">&#10007;</span>
                {isDevanagari
                  ? 'शुक्र/गुरु अस्त  –  BPHS मानक: शुक्र 10° (वक्री 8°), गुरु 11°। हम शास्त्रीय 10° मानक का पालन करते हैं।'
                  : 'Venus/Jupiter combustion  –  BPHS standard orbs: Venus 10° (8° retro), Jupiter 11°. We follow the classical 10° standard.'}
              </li>
              <li className="flex items-start gap-2"><span className="text-red-400 flex-shrink-0">&#10007;</span>
                {isDevanagari ? 'अधिक मास  –  धर्मसिन्धु: अधिमास में संस्कार वर्जित।' : 'Adhika Masa  –  Dharmasindhu: samskaras prohibited in intercalary months.'}
              </li>
              <li className="flex items-start gap-2"><span className="text-red-400 flex-shrink-0">&#10007;</span>
                {isDevanagari ? 'चातुर्मास  –  धर्मसिन्धु: श्रावण से आश्विन तक विवाह/गृह प्रवेश वर्जित।' : 'Chaturmas  –  Dharmasindhu: marriage/griha pravesh prohibited Shravana through Ashwina.'}
              </li>
              <li className="flex items-start gap-2"><span className="text-red-400 flex-shrink-0">&#10007;</span>
                {isDevanagari ? 'खरमास  –  सूर्य धनु या मीन में हो तो विवाह वर्जित।' : 'Kharmas  –  marriage prohibited when Sun is in Dhanu (Sagittarius) or Mina (Pisces).'}
              </li>
              <li className="flex items-start gap-2"><span className="text-red-400 flex-shrink-0">&#10007;</span>
                {isDevanagari ? 'वर्जित नक्षत्र  –  मुहूर्त चिन्तामणि + ज्योतिर्निबन्ध: प्रत्येक संस्कार के लिए विशिष्ट।' : 'Forbidden nakshatras  –  per Muhurta Chintamani + Jyotirnibandha: activity-specific.'}
              </li>
            </ul>
          </div>

          {/* 5-tier scoring */}
          <div className="rounded-xl border border-gold-primary/12 bg-gradient-to-br from-[#2d1b69]/30 via-[#1a1040]/40 to-[#0a0e27] p-5">
            <h3 className="text-gold-primary text-sm font-bold mb-2">
              {isDevanagari ? '5-स्तरीय निवारण तर्क' : '5-Tier Cancellation Logic'}
            </h3>
            <p className="text-text-secondary text-sm leading-relaxed mb-3" style={bodyFont}>
              {isDevanagari
                ? 'यह बाइनरी हाँ/नहीं प्रणाली नहीं है। कठोर निषेधों (स्तर 1) को पार करने के बाद, शेष दिनों को 5-स्तरीय प्राधिकार क्रम से स्कोर किया जाता है। अधिभावी नियम (स्तर 2)  –  गोधूलि लग्न (सूर्यास्त ±24 मिनट, बृहत् संहिता अध्याय 103) या लग्न में शुक्र/बुध/गुरु (MC अध्याय 7)  –  सभी निचले दोषों को वास्तव में निवारित करते हैं। प्रमुख कारक (स्तर 3) में नक्षत्र, तिथि-वार, अष्टम भाव शून्यता। सामान्य (स्तर 4) में योग, करण, होरा, चौघड़िया। निवारणीय (स्तर 5)  –  दुर्बल करण जिसे बलवान लग्न क्षतिपूर्ति करता है।'
                : 'This is not binary pass/fail. After hard prohibitions (Tier 1), remaining days are scored via a 5-tier authority hierarchy. Override rules (Tier 2)  –  Godhuli Lagna (sunset +/-24 min, Brihat Samhita Ch.103) or Venus/Mercury/Jupiter in lagna (MC Ch.7)  –  genuinely cancel all lower-tier defects. Major factors (Tier 3) include nakshatra, tithi-vara alignment, 8th house vacancy. Standard (Tier 4) covers yoga, karana, hora, choghadiya. Cancellable (Tier 5)  –  weak karana that a strong lagna compensates.'}
            </p>
            <div className="flex flex-wrap gap-2">
              <span className="text-xs px-2.5 py-1 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/20">72+ = {isDevanagari ? 'उत्कृष्ट' : 'Excellent'}</span>
              <span className="text-xs px-2.5 py-1 rounded-full bg-gold-primary/15 text-gold-light border border-gold-primary/20">58-71 = {isDevanagari ? 'शुभ' : 'Good'}</span>
              <span className="text-xs px-2.5 py-1 rounded-full bg-amber-500/15 text-amber-400 border border-amber-500/20">50-57 = {isDevanagari ? 'सामान्य' : 'Fair'}</span>
            </div>
          </div>

          {/* Activity-specific rules */}
          <div className="rounded-xl border border-gold-primary/12 bg-gradient-to-br from-[#2d1b69]/30 via-[#1a1040]/40 to-[#0a0e27] p-5">
            <h3 className="text-gold-primary text-sm font-bold mb-2">
              {isDevanagari ? 'संस्कार-विशिष्ट नियम' : 'Activity-Specific Rules'}
            </h3>
            <p className="text-text-secondary text-sm leading-relaxed" style={bodyFont}>
              {isDevanagari
                ? 'शास्त्रीय ग्रन्थ प्रत्येक संस्कार के लिए भिन्न नियम निर्धारित करते हैं। विवाह सबसे कठोर है (सभी 7 निषेध लागू)। मुण्डन में उत्तरायण अनिवार्य है (मुहूर्त चिन्तामणि)। नामकरण समयबद्ध संस्कार है  –  कालखण्ड-स्तरीय प्रतिबन्ध लागू नहीं होते। प्रत्येक संस्कार के लिए विशिष्ट नक्षत्र सूची शास्त्रों से ली गई है। समय विश्लेषण 15-मिनट की सटीकता से किया जाता है।'
                : 'Classical texts prescribe different rules for each samskara. Marriage is the strictest (all 7 restrictions apply). Mundan requires Uttarayana (MC Chudakarana Prakarana). Namakarana is time-bound  –  period-level restrictions do not apply. Each activity has a specific nakshatra list sourced from classical texts. Time windows are scored at 15-minute granularity for precision.'}
            </p>
          </div>

          {/* 15-minute granularity note */}
          <div className="rounded-xl border border-gold-primary/12 bg-gradient-to-br from-[#2d1b69]/30 via-[#1a1040]/40 to-[#0a0e27] p-5">
            <h3 className="text-gold-primary text-sm font-bold mb-2">
              {isDevanagari ? '15-मिनट की सटीकता' : '15-Minute Precision'}
            </h3>
            <p className="text-text-secondary text-sm leading-relaxed" style={bodyFont}>
              {isDevanagari
                ? 'इंजन प्रत्येक दिन को 15-मिनट के खण्डों में विभाजित करता है और प्रत्येक खण्ड को स्वतन्त्र रूप से स्कोर करता है। इसका अर्थ है कि एक ही दिन में प्रातः 6:00 और 10:00 बजे के बीच स्कोर में 30+ अंकों का अन्तर हो सकता है  –  क्योंकि होरा स्वामी, चौघड़िया, और लग्न निरन्तर बदलते हैं। प्रत्येक स्कोर किए गए खण्ड में कारक-दर-कारक विश्लेषण अध्याय-स्तरीय सन्दर्भों के साथ दिखाया जाता है।'
                : 'The engine divides each day into 15-minute windows and scores each independently. This means scores on the same day can differ by 30+ points between 6:00 AM and 10:00 AM  –  because hora lord, choghadiya, and lagna change continuously. Each scored window shows factor-by-factor analysis with chapter-level citations.'}
            </p>
          </div>
        </div>

        <div className="mt-6">
          <LearnLink
            href="/learn/muhurtas"
            label={isDevanagari ? 'मुहूर्त के बारे में और जानें' : 'Learn more about Muhurta'}
            showIcon
          />
        </div>
      </section>
    </main>
  );
}
