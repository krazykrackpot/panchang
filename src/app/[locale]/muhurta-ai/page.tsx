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
    edTitle: 'What is Muhurta — The Vedic Science of Auspicious Timing',
    edIntro: 'Muhurta (electional astrology) is the branch of Jyotish Shastra dedicated to selecting the most favourable moment for initiating important actions. The foundational principle is simple yet profound: time is not neutral. The Vedic tradition holds that Kaal (Time) is the supreme force — every moment carries a unique energetic signature shaped by the positions of the Sun, Moon, and planets. A marriage begun under an auspicious muhurta inherits the cosmic support of that moment; a business launched during Vishti Karana or Rahu Kaal inherits their obstruction.',
    edElementsTitle: 'The Five Elements of Muhurta (Panchanga Shuddhi)',
    edElements: 'A muhurta is evaluated through five simultaneous lenses, collectively called Panchanga Shuddhi. Tithi (lunar day) — each of the 30 tithis per month has a ruling deity and intrinsic quality. Nanda tithis (1, 6, 11) favour joyful occasions; Bhadra tithis (2, 7, 12) suit prosperity-oriented acts. Nakshatra (lunar mansion) — the 27 nakshatras are classified as Fixed, Movable, Sharp, Soft, or Mixed, each suited to different activities. Deva nakshatras like Pushya and Revati are universally auspicious. Yoga — the 27 nitya yogas arise from the combined longitude of Sun and Moon. Siddhi, Amrita, and Shubha yogas amplify success; Vyatipata and Vaidhriti are avoided. Karana (half-tithi) — 11 karanas rotate through each lunar month. Vishti (Bhadra) karana is universally inauspicious. Vara (weekday) — each day is ruled by a graha. Thursday (Guru) and Friday (Shukra) are broadly favourable; Saturday and Tuesday require careful evaluation.',
    edClassicalTitle: 'Classical Scriptural Basis',
    edClassical: 'The primary texts for muhurta selection are the Muhurta Chintamani by Rama Daivagya and the Muhurta Martanda by Narayana Daivagya. These 16th-17th century treatises codify rules from earlier sources including the Brihat Samhita of Varahamihira and the Kalaprakashika. They define specific conditions for each type of activity — marriage requires a fixed nakshatra on a Monday, Wednesday, Thursday, or Friday with Shukla Paksha tithi, for instance — and enumerate hundreds of special yogas (Sarvartha Siddhi, Amrita Siddhi, Ravi Yoga) that enhance or diminish a window.',
    edScoringTitle: 'How Our AI Scoring Engine Works',
    edScoring: 'Our engine evaluates every 90-minute window within your selected date range across 20+ activities. Each window receives a composite score (0-100) computed from four weighted dimensions: Panchang quality (tithi + nakshatra + yoga + karana + vara alignment for the specific activity), Transit strength (current positions of Jupiter, Saturn, Rahu, Ketu relative to your birth chart), Timing factors (hora lord, choghadiya quality, absence of Rahu Kaal, Yamaghanda, and Gulika Kaal), and Personal compatibility (Tara Bala and Chandra Bala from your birth nakshatra, if provided). The weights shift by activity type: marriage prioritises nakshatra and tithi; travel prioritises vara and hora.',
    edAvoidTitle: 'What Makes a Good Muhurta',
    edAvoid: 'A well-chosen muhurta combines the presence of positive factors with the absence of negative ones. The engine checks for Rahu Kaal (the 90-minute daily window ruled by Rahu — universally avoided for new beginnings), Vishti Karana (Bhadra — the inauspicious half-tithi that recurs 8 times per lunar month), Panchaka dosha (five-fold affliction when Moon transits Dhanishtha through Revati), Gandanta zones (junctional degrees between water and fire signs where Moon is vulnerable), and combustion or retrogression of key planets. When all five panchanga elements are clean and no negative windows overlap, the result is a Sarva Shuddhi muhurta — the highest quality.',
  },
  hi: {
    edTitle: 'मुहूर्त क्या है — शुभ समय का वैदिक विज्ञान',
    edIntro: 'मुहूर्त (निर्वाचन ज्योतिष) ज्योतिष शास्त्र की वह शाखा है जो महत्वपूर्ण कार्यों के आरम्भ के लिए सर्वाधिक अनुकूल क्षण का चयन करती है। मूल सिद्धान्त सरल किन्तु गहन है: समय तटस्थ नहीं है। वैदिक परम्परा मानती है कि काल (समय) सर्वोच्च शक्ति है — प्रत्येक क्षण सूर्य, चन्द्र और ग्रहों की स्थिति से निर्मित एक अद्वितीय ऊर्जा हस्ताक्षर वहन करता है। शुभ मुहूर्त में आरम्भ किया गया विवाह उस क्षण का ब्रह्माण्डीय समर्थन प्राप्त करता है; विष्टि करण या राहुकाल में आरम्भ किया गया व्यवसाय उनकी बाधा।',
    edElementsTitle: 'मुहूर्त के पाँच तत्व (पंचांग शुद्धि)',
    edElements: 'मुहूर्त का मूल्यांकन पाँच एक साथ दृष्टिकोणों से होता है, जिसे सामूहिक रूप से पंचांग शुद्धि कहते हैं। तिथि — प्रत्येक मास की 30 तिथियों का एक अधिष्ठाता देवता और आन्तरिक गुण होता है। नन्दा तिथियाँ (1, 6, 11) आनन्दपूर्ण अवसरों के अनुकूल हैं। नक्षत्र — 27 नक्षत्र स्थिर, चर, तीक्ष्ण, मृदु या मिश्र के रूप में वर्गीकृत हैं। पुष्य और रेवती जैसे देव नक्षत्र सार्वभौमिक रूप से शुभ हैं। योग — 27 नित्य योग सूर्य और चन्द्र के संयुक्त देशान्तर से उत्पन्न होते हैं। करण — 11 करण प्रत्येक चान्द्र मास में घूमते हैं; विष्टि (भद्रा) सार्वभौमिक रूप से अशुभ है। वार — प्रत्येक दिन एक ग्रह द्वारा शासित है।',
    edClassicalTitle: 'शास्त्रीय आधार',
    edClassical: 'मुहूर्त चयन के प्रमुख ग्रन्थ राम दैवज्ञ की मुहूर्त चिन्तामणि और नारायण दैवज्ञ की मुहूर्त मार्तण्ड हैं। ये 16वीं-17वीं शताब्दी के ग्रन्थ वराहमिहिर की बृहत् संहिता और कालप्रकाशिका सहित पूर्ववर्ती स्रोतों के नियमों को संहिताबद्ध करते हैं। ये प्रत्येक कार्य प्रकार के लिए विशिष्ट शर्तें निर्धारित करते हैं और सैकड़ों विशेष योगों (सर्वार्थ सिद्धि, अमृत सिद्धि, रवि योग) की गणना करते हैं।',
    edScoringTitle: 'हमारा AI स्कोरिंग इंजन कैसे काम करता है',
    edScoring: 'हमारा इंजन आपकी चयनित तिथि सीमा के भीतर प्रत्येक 90-मिनट की खिड़की का 20+ गतिविधियों के लिए मूल्यांकन करता है। प्रत्येक खिड़की को चार भारित आयामों से गणना किया गया समग्र अंक (0-100) प्राप्त होता है: पंचांग गुणवत्ता (विशिष्ट गतिविधि के लिए तिथि + नक्षत्र + योग + करण + वार), गोचर शक्ति (गुरु, शनि, राहु, केतु की वर्तमान स्थिति), समय कारक (होरा स्वामी, चौघड़िया, राहुकाल अनुपस्थिति), और व्यक्तिगत अनुकूलता (तारा बल और चन्द्र बल)।',
    edAvoidTitle: 'अच्छा मुहूर्त क्या बनाता है',
    edAvoid: 'सुचयनित मुहूर्त सकारात्मक कारकों की उपस्थिति और नकारात्मक कारकों की अनुपस्थिति का संयोजन है। इंजन जाँचता है: राहुकाल (राहु द्वारा शासित 90-मिनट की दैनिक खिड़की — नए कार्यों के लिए सार्वभौमिक रूप से वर्जित), विष्टि करण (भद्रा — प्रति चान्द्र मास 8 बार आने वाला अशुभ अर्ध-तिथि), पंचक दोष (धनिष्ठा से रेवती तक चन्द्र गोचर में पंचगुणा पीड़ा), गण्डान्त क्षेत्र, और प्रमुख ग्रहों का अस्त या वक्री होना। जब सभी पाँच पंचांग तत्व शुद्ध हों — यह सर्वशुद्धि मुहूर्त है।',
  },
  sa: {
    edTitle: '', edIntro: '', edElementsTitle: '', edElements: '', edClassicalTitle: '', edClassical: '', edScoringTitle: '', edScoring: '', edAvoidTitle: '', edAvoid: '',
  },
  ta: {
    edTitle: '', edIntro: '', edElementsTitle: '', edElements: '', edClassicalTitle: '', edClassical: '', edScoringTitle: '', edScoring: '', edAvoidTitle: '', edAvoid: '',
  },
  te: {
    edTitle: '', edIntro: '', edElementsTitle: '', edElements: '', edClassicalTitle: '', edClassical: '', edScoringTitle: '', edScoring: '', edAvoidTitle: '', edAvoid: '',
  },
  bn: {
    edTitle: '', edIntro: '', edElementsTitle: '', edElements: '', edClassicalTitle: '', edClassical: '', edScoringTitle: '', edScoring: '', edAvoidTitle: '', edAvoid: '',
  },
  kn: {
    edTitle: '', edIntro: '', edElementsTitle: '', edElements: '', edClassicalTitle: '', edClassical: '', edScoringTitle: '', edScoring: '', edAvoidTitle: '', edAvoid: '',
  },
  gu: {
    edTitle: '', edIntro: '', edElementsTitle: '', edElements: '', edClassicalTitle: '', edClassical: '', edScoringTitle: '', edScoring: '', edAvoidTitle: '', edAvoid: '',
  },
  mr: {
    edTitle: '', edIntro: '', edElementsTitle: '', edElements: '', edClassicalTitle: '', edClassical: '', edScoringTitle: '', edScoring: '', edAvoidTitle: '', edAvoid: '',
  },
  mai: {
    edTitle: '', edIntro: '', edElementsTitle: '', edElements: '', edClassicalTitle: '', edClassical: '', edScoringTitle: '', edScoring: '', edAvoidTitle: '', edAvoid: '',
  },
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
            <p>मुहूर्त सही समय चुनने का वैदिक विज्ञान है। जैसे सही मौसम में बोए गए बीज बेहतर उगते हैं, वैसे ही शुभ समय पर शुरू किए गए कार्य अधिक सफल होते हैं। हमारा AI प्रत्येक समय खंड को 0-100 के पैमाने पर अंकित करता है: तिथि गुण, नक्षत्र प्रकृति, योग शुभता, ग्रह होरा, चौघड़िया और वर्तमान गोचर।</p>
          ) : (
            <p>Muhurta is the Vedic science of choosing the right time. Just as seeds planted in the right season grow better, actions started at auspicious times succeed more easily. Our AI scores each time window (0-100) by combining: tithi quality, nakshatra nature, yoga auspiciousness, planetary hora, choghadiya, and current transits.</p>
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
          <div className="p-5 bg-bg-secondary/50 border border-gold-primary/10 rounded-xl space-y-2">
            <h3 className="text-base font-semibold text-gold-light" style={headingFont}>
              {t.edElementsTitle || L.en.edElementsTitle}
            </h3>
            <p className="text-text-secondary text-sm leading-relaxed" style={bodyFont}>
              {t.edElements || L.en.edElements}
            </p>
          </div>

          {/* Classical Basis card */}
          <div className="p-5 bg-bg-secondary/50 border border-gold-primary/10 rounded-xl space-y-2">
            <h3 className="text-base font-semibold text-gold-light" style={headingFont}>
              {t.edClassicalTitle || L.en.edClassicalTitle}
            </h3>
            <p className="text-text-secondary text-sm leading-relaxed" style={bodyFont}>
              {t.edClassical || L.en.edClassical}
            </p>
          </div>

          {/* AI Scoring card */}
          <div className="p-5 bg-bg-secondary/50 border border-gold-primary/10 rounded-xl space-y-2">
            <h3 className="text-base font-semibold text-gold-light" style={headingFont}>
              {t.edScoringTitle || L.en.edScoringTitle}
            </h3>
            <p className="text-text-secondary text-sm leading-relaxed" style={bodyFont}>
              {t.edScoring || L.en.edScoring}
            </p>
          </div>

          {/* Good Muhurta card */}
          <div className="p-5 bg-bg-secondary/50 border border-gold-primary/10 rounded-xl space-y-2">
            <h3 className="text-base font-semibold text-gold-light" style={headingFont}>
              {t.edAvoidTitle || L.en.edAvoidTitle}
            </h3>
            <p className="text-text-secondary text-sm leading-relaxed" style={bodyFont}>
              {t.edAvoid || L.en.edAvoid}
            </p>
          </div>
        </div>

        <div className="mt-4">
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
