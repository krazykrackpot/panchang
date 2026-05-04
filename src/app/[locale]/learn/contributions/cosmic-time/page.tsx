import { tl } from '@/lib/utils/trilingual';
import { lt } from '@/lib/learn/translations';
import type { LocaleText } from '@/lib/learn/translations';
import L from '@/messages/learn/contributions-cosmic-time.json';
import { Link } from '@/lib/i18n/navigation';
import type { Locale } from '@/types/panchang';
import { ShareRow } from '@/components/ui/ShareButton';
import { isDevanagariLocale } from '@/lib/utils/locale-fonts';

export const revalidate = 604800; // 7 days — static educational content


/* ════════════════════════════════════════════════════════════════
   LABELS — bilingual (en / hi)
   ════════════════════════════════════════════════════════════════ */

const YUGA_DATA = [
  { name: 'Satya Yuga', sanskrit: 'सत्य युग', years: 1728000, color: '#f0d48a', desc: { en: 'Golden Age — full cosmic virtue', hi: 'स्वर्ण युग — पूर्ण ब्रह्मांडीय सद्गुण', sa: 'स्वर्ण युग — पूर्ण ब्रह्मांडीय सद्गुण', mai: 'स्वर्ण युग — पूर्ण ब्रह्मांडीय सद्गुण', mr: 'स्वर्ण युग — पूर्ण ब्रह्मांडीय सद्गुण', ta: 'பொற்காலம் — முழு பிரபஞ்ச புண்ணியம்', te: 'స్వర్ణ యుగం — పూర్ణ విశ్వ సద్గుణం', bn: 'স্বর্ণ যুগ — পূর্ণ বিশ্ব সদ্গুণ', kn: 'ಸ್ವರ್ಣ ಯುಗ — ಪೂರ್ಣ ವಿಶ್ವ ಸದ್ಗುಣ', gu: 'સુવર્ણ યુગ — પૂર્ણ બ્રહ્માંડીય સદ્ગુણ' } },
  { name: 'Treta Yuga', sanskrit: 'त्रेता युग', years: 1296000, color: '#93c5fd', desc: { en: 'Silver Age — three-quarters virtue', hi: 'रजत युग — तीन-चौथाई सद्गुण', sa: 'रजत युग — तीन-चौथाई सद्गुण', mai: 'रजत युग — तीन-चौथाई सद्गुण', mr: 'रजत युग — तीन-चौथाई सद्गुण', ta: 'வெள்ளிக் காலம் — முக்கால் புண்ணியம்', te: 'రజత యుగం — మూడు వంతుల సద్గుణం', bn: 'রজত যুগ — তিন-চতুর্থাংশ সদ্গুণ', kn: 'ರಜತ ಯುಗ — ಮುಕ್ಕಾಲು ಸದ್ಗುಣ', gu: 'રજત યુગ — ત્રણ-ચતુર્થાંશ સદ્ગુણ' } },
  { name: 'Dwapara Yuga', sanskrit: 'द्वापर युग', years: 864000, color: '#c4b5fd', desc: { en: 'Copper Age — half virtue', hi: 'ताम्र युग — आधा सद्गुण', sa: 'ताम्र युग — आधा सद्गुण', mai: 'ताम्र युग — आधा सद्गुण', mr: 'ताम्र युग — आधा सद्गुण', ta: 'செப்புக் காலம் — அரை புண்ணியம்', te: 'రాగి యుగం — సగం సద్గుణం', bn: 'তাম্র যুগ — অর্ধেক সদ্গুণ', kn: 'ತಾಮ್ರ ಯುಗ — ಅರ್ಧ ಸದ್ಗುಣ', gu: 'તામ્ર યુગ — અડધો સદ્ગુણ' } },
  { name: 'Kali Yuga', sanskrit: 'कलि युग', years: 432000, color: '#f87171', desc: { en: 'Iron Age — quarter virtue (current)', hi: 'लौह युग — एक-चौथाई सद्गुण (वर्तमान)', sa: 'लौह युग — एक-चौथाई सद्गुण (वर्तमान)', mai: 'लौह युग — एक-चौथाई सद्गुण (वर्तमान)', mr: 'लौह युग — एक-चौथाई सद्गुण (वर्तमान)', ta: 'இரும்புக் காலம் — கால் புண்ணியம் (நடப்பு)', te: 'ఇనుప యుగం — పావు సద్గుణం (ప్రస్తుతం)', bn: 'লৌহ যুগ — এক-চতুর্থাংশ সদ্গুণ (বর্তমান)', kn: 'ಕಬ್ಬಿಣ ಯುಗ — ಕಾಲು ಸದ್ಗುಣ (ಪ್ರಸ್ತುತ)', gu: 'લોહ યુગ — ચોથા ભાગનો સદ્ગુણ (વર્તમાન)' } },
];

const SCALE_COMPARE = [
  { label: { en: 'Kali Yuga', hi: 'कलि युग', sa: 'कलि युग', mai: 'कलि युग', mr: 'कलि युग', ta: 'கலியுகம்', te: 'కలియుగం', bn: 'কলিযুগ', kn: 'ಕಲಿಯುಗ', gu: 'કલિયુગ' }, value: '432,000', unit: { en: 'years', hi: 'वर्ष', sa: 'वर्ष', mai: 'वर्ष', mr: 'वर्ष', ta: 'ஆண்டுகள்', te: 'సంవత్సరాలు', bn: 'বছর', kn: 'ವರ್ಷಗಳು', gu: 'વર્ષ' }, color: '#f87171' },
  { label: { en: 'Mahayuga', hi: 'महायुग', sa: 'महायुग', mai: 'महायुग', mr: 'महायुग', ta: 'மகாயுகம்', te: 'మహాయుగం', bn: 'মহাযুগ', kn: 'ಮಹಾಯುಗ', gu: 'મહાયુગ' }, value: '4.32 million', unit: { en: 'years', hi: 'वर्ष', sa: 'वर्ष', mai: 'वर्ष', mr: 'वर्ष', ta: 'ஆண்டுகள்', te: 'సంవత్సరాలు', bn: 'বছর', kn: 'ವರ್ಷಗಳು', gu: 'વર્ષ' }, color: '#fbbf24' },
  { label: { en: 'Kalpa (1 day of Brahma)', hi: 'कल्प (ब्रह्मा का 1 दिन)', sa: 'कल्प (ब्रह्मा का 1 दिन)', mai: 'कल्प (ब्रह्मा का 1 दिन)', mr: 'कल्प (ब्रह्मा का 1 दिन)', ta: 'கல்பம் (பிரம்மாவின் 1 நாள்)', te: 'కల్పం (బ్రహ్మ యొక్క 1 రోజు)', bn: 'কল্প (ব্রহ্মার ১ দিন)', kn: 'ಕಲ್ಪ (ಬ್ರಹ್ಮನ 1 ದಿನ)', gu: 'કલ્પ (બ્રહ્માનો 1 દિવસ)' }, value: '4.32 billion', unit: { en: 'years', hi: 'वर्ष', sa: 'वर्ष', mai: 'वर्ष', mr: 'वर्ष', ta: 'ஆண்டுகள்', te: 'సంవత్సరాలు', bn: 'বছর', kn: 'ವರ್ಷಗಳು', gu: 'વર્ષ' }, color: '#a78bfa' },
  { label: { en: "Brahma's lifespan", hi: 'ब्रह्मा का जीवनकाल', sa: 'ब्रह्मा का जीवनकाल', mai: 'ब्रह्मा का जीवनकाल', mr: 'ब्रह्मा का जीवनकाल', ta: "பிரம்மாவின் ஆயுட்காலம்", te: "బ్రహ్మ ఆయుష్షు", bn: "ব্রহ্মার আয়ুষ্কাল", kn: "ಬ್ರಹ್ಮನ ಆಯುಷ್ಕಾಲ", gu: "બ્રહ્માનું આયુષ્ય" }, value: '311 trillion', unit: { en: 'years', hi: 'वर्ष', sa: 'वर्ष', mai: 'वर्ष', mr: 'वर्ष', ta: 'ஆண்டுகள்', te: 'సంవత్సరాలు', bn: 'বছর', kn: 'ವರ್ಷಗಳು', gu: 'વર્ષ' }, color: '#34d399' },
];

const SCIENCE_COMPARE = [
  { label: { en: 'Kali Yuga', hi: 'कलि युग', sa: 'कलि युग', mai: 'कलि युग', mr: 'कलि युग', ta: 'கலியுகம்', te: 'కలియుగం', bn: 'কলিযুগ', kn: 'ಕಲಿಯುಗ', gu: 'કલિયુગ' }, vedic: '432,000 yrs', modern: { en: '~Holocene epoch', hi: '~होलोसीन काल', sa: '~होलोसीन काल', mai: '~होलोसीन काल', mr: '~होलोसीन काल', ta: '~ஹொலோசீன் யுகம்', te: '~హోలోసీన్ యుగం', bn: '~হলোসিন যুগ', kn: '~ಹೊಲೊಸೀನ್ ಯುಗ', gu: '~હોલોસીન યુગ' }, match: 'context', color: '#f87171' },
  { label: { en: 'Kalpa', hi: 'कल्प', sa: 'कल्प', mai: 'कल्प', mr: 'कल्प', ta: 'கல்பம்', te: 'కల్పం', bn: 'কল্প', kn: 'ಕಲ್ಪ', gu: 'કલ્પ' }, vedic: '4.32 billion yrs', modern: { en: "Earth's age: 4.54 B yrs", hi: 'पृथ्वी की आयु: 4.54 अरब वर्ष', sa: 'पृथ्वी की आयु: 4.54 अरब वर्ष', mai: 'पृथ्वी की आयु: 4.54 अरब वर्ष', mr: 'पृथ्वी की आयु: 4.54 अरब वर्ष', ta: "பூமியின் வயது: 4.54 பில்லியன் ஆண்டுகள்", te: "భూమి వయసు: 4.54 బిలియన్ సంవత్సరాలు", bn: "পৃথিবীর বয়স: ৪.৫৪ বিলিয়ন বছর", kn: "ಭೂಮಿಯ ವಯಸ್ಸು: 4.54 ಶತಕೋಟಿ ವರ್ಷ", gu: "પૃથ્વીની ઉંમર: 4.54 અબજ વર્ષ" }, match: '95%', color: '#a78bfa' },
  { label: { en: "Brahma's day+night", hi: 'ब्रह्मा का दिन+रात', sa: 'ब्रह्मा का दिन+रात', mai: 'ब्रह्मा का दिन+रात', mr: 'ब्रह्मा का दिन+रात', ta: "பிரம்மாவின் பகல்+இரவு", te: "బ్రహ్మ పగలు+రాత్రి", bn: "ব্রহ্মার দিন+রাত", kn: "ಬ್ರಹ್ಮನ ಹಗಲು+ರಾತ್ರಿ", gu: "બ્રહ્માનો દિવસ+રાત" }, vedic: '8.64 billion yrs', modern: { en: 'Age of Sun: 4.6 B | Half Universe: ~7 B', hi: 'सूर्य की आयु: 4.6 अरब | आधा ब्रह्मांड: ~7 अरब', sa: 'सूर्य की आयु: 4.6 अरब | आधा ब्रह्मांड: ~7 अरब', mai: 'सूर्य की आयु: 4.6 अरब | आधा ब्रह्मांड: ~7 अरब', mr: 'सूर्य की आयु: 4.6 अरब | आधा ब्रह्मांड: ~7 अरब', ta: 'சூரியனின் வயது: 4.6 பில்லியன் | அரை பிரபஞ்சம்: ~7 பில்லியன்', te: 'సూర్యుని వయసు: 4.6 బిలియన్ | సగం విశ్వం: ~7 బిలియన్', bn: 'সূর্যের বয়স: ৪.৬ বিলিয়ন | অর্ধেক মহাবিশ্ব: ~৭ বিলিয়ন', kn: 'ಸೂರ್ಯನ ವಯಸ್ಸು: 4.6 ಶತಕೋಟಿ | ಅರ್ಧ ವಿಶ್ವ: ~7 ಶತಕೋಟಿ', gu: 'સૂર્યની ઉંમર: 4.6 અબજ | અડધું બ્રહ્માંડ: ~7 અબજ' }, match: 'order', color: '#60a5fa' },
  { label: { en: 'Universe lifespan (est.)', hi: 'ब्रह्मांड जीवनकाल (अनुमानित)', sa: 'ब्रह्मांड जीवनकाल (अनुमानित)', mai: 'ब्रह्मांड जीवनकाल (अनुमानित)', mr: 'ब्रह्मांड जीवनकाल (अनुमानित)', ta: 'அண்டத்தின் ஆயுட்காலம் (மதிப்பீடு)', te: 'విశ్వం ఆయుష్షు (అంచనా)', bn: 'মহাবিশ্বের আয়ুষ্কাল (আনুমানিক)', kn: 'ವಿಶ್ವದ ಆಯುಷ್ಕಾಲ (ಅಂದಾಜು)', gu: 'બ્રહ્માંડનું આયુષ્ય (અંદાજ)' }, vedic: '~311 trillion yrs', modern: { en: 'Unknown — far beyond current 13.8 B', hi: 'अज्ञात — वर्तमान 13.8 अरब से बहुत आगे', sa: 'अज्ञात — वर्तमान 13.8 अरब से बहुत आगे', mai: 'अज्ञात — वर्तमान 13.8 अरब से बहुत आगे', mr: 'अज्ञात — वर्तमान 13.8 अरब से बहुत आगे', ta: 'அறியப்படவில்லை — தற்போதைய 13.8 பில்லியனுக்கு அப்பால்', te: 'తెలియదు — ప్రస్తుత 13.8 బిలియన్‌కు చాలా దూరం', bn: 'অজানা — বর্তমান ১৩.৮ বিলিয়নের অনেক পরে', kn: 'ಅಜ್ಞಾತ — ಪ್ರಸ್ತುತ 13.8 ಶತಕೋಟಿಯನ್ನು ಮೀರಿ', gu: 'અજ્ઞાત — વર્તમાન 13.8 અબજથી ઘણું આગળ' }, match: 'open', color: '#34d399' },
];

export default async function CosmicTimePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params as { locale: Locale };
  const isHi = isDevanagariLocale(locale);
  const hf = isHi ? { fontFamily: 'var(--font-devanagari-heading)' } : { fontFamily: 'var(--font-heading)' };
  const t = (key: string) => lt((L as unknown as Record<string, LocaleText>)[key], locale);
  const l = (obj: LocaleText | Record<string, string>) => lt(obj as LocaleText, locale);

  const totalMahayuga = YUGA_DATA.reduce((sum, y) => sum + y.years, 0);

  return (
    <div className="space-y-10">

      {/* ── Hero ─────────────────────────────────────────────────────── */}
      <div>
        <h2 className="text-3xl font-bold text-gold-gradient mb-3" style={hf}>{t('title')}</h2>
        <p className="text-text-secondary text-sm leading-relaxed max-w-3xl">{t('subtitle')}</p>
        <div className="flex justify-center mt-4">
          <ShareRow pageTitle={t('title')} locale={locale} />
        </div>
      </div>

      {/* ── Section 1: The Time Scale ────────────────────────────────── */}
      <div
        className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-2xl p-6"
      >
        <h3 className="text-gold-light font-bold text-xl mb-4" style={hf}>{t('s1Title')}</h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-6">{t('s1Body')}</p>

        <div className="space-y-3">
          {SCALE_COMPARE.map((item, i) => (
            <div key={i} className="flex items-center gap-4 p-3 rounded-xl bg-white/[0.03] border border-white/5">
              <div className="flex-shrink-0 w-2 h-8 rounded-full" style={{ background: item.color }} />
              <div className="flex-1 min-w-0">
                <span className="text-text-primary text-sm font-semibold">{l(item.label)}</span>
              </div>
              <div className="text-right">
                <span className="font-mono text-sm font-bold" style={{ color: item.color }}>{item.value}</span>
                <span className="text-text-secondary text-xs ml-1">{l(item.unit)}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Section 2: The Math ──────────────────────────────────────── */}
      <div
        className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-2xl p-6"
      >
        <h3 className="text-gold-light font-bold text-xl mb-4" style={hf}>{t('s2Title')}</h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-6">{t('s2Body')}</p>

        <div className="space-y-3 mb-5">
          {YUGA_DATA.map((yuga, i) => {
            const pct = Math.round((yuga.years / totalMahayuga) * 100);
            return (
              <div key={i} className="p-4 rounded-xl bg-white/[0.03] border border-white/5">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <span className="text-sm font-semibold" style={{ color: yuga.color }}>{yuga.name}</span>
                    <span className="text-text-secondary text-xs ml-2" style={{ fontFamily: 'var(--font-devanagari-body)' }}>{yuga.sanskrit}</span>
                  </div>
                  <div className="text-right">
                    <span className="font-mono text-sm" style={{ color: yuga.color }}>{yuga.years.toLocaleString()}</span>
                    <span className="text-text-secondary text-xs ml-1">{tl({ en: 'years', hi: 'वर्ष', sa: 'वर्षाणि' }, locale)}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 mb-1">
                  <div className="flex-1 h-1.5 rounded-full bg-white/5">
                    <div className="h-full rounded-full" style={{ width: `${pct}%`, background: yuga.color }} />
                  </div>
                  <span className="text-text-secondary text-xs w-8 text-right">{pct}%</span>
                </div>
                <p className="text-text-secondary text-xs">{l(yuga.desc)}</p>
              </div>
            );
          })}
        </div>

        <div className="p-4 rounded-xl bg-gold-primary/8 border border-gold-primary/20 text-center">
          <p className="text-text-secondary text-xs mb-1">{tl({ en: '1 Mahayuga = Satya + Treta + Dwapara + Kali', hi: '1 महायुग = सत्य + त्रेता + द्वापर + कलि', sa: '1 महायुगम् = सत्य + त्रेता + द्वापर + कलि' }, locale)}</p>
          <p className="text-gold-light text-lg font-mono font-bold">1,728,000 + 1,296,000 + 864,000 + 432,000</p>
          <p className="text-gold-light text-2xl font-mono font-bold mt-1">= 4,320,000 {tl({ en: 'years', hi: 'वर्ष', sa: 'वर्षाणि' }, locale)}</p>
          <p className="text-text-secondary text-xs mt-2">{tl({ en: '× 1,000 = 1 Kalpa = 4,320,000,000 years', hi: '× 1,000 = 1 कल्प = 4,320,000,000 वर्ष', sa: '× 1,000 = 1 कल्पः = 4,320,000,000 वर्षाणि' }, locale)}</p>
        </div>
      </div>

      {/* ── Section 3: Compare With Science ─────────────────────────── */}
      <div
        className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-2xl p-6"
      >
        <h3 className="text-gold-light font-bold text-xl mb-4" style={hf}>{t('s3Title')}</h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-6">{t('s3Body')}</p>

        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-gold-primary/15">
                <th className="text-left text-gold-light py-2 pr-4">{tl({ en: 'Unit', hi: 'इकाई', sa: 'एककम्' }, locale)}</th>
                <th className="text-right text-gold-light py-2 pr-4">{tl({ en: 'Vedic', hi: 'वैदिक', sa: 'वैदिकम्' }, locale)}</th>
                <th className="text-right text-gold-light py-2 pr-4">{tl({ en: 'Modern Science', hi: 'आधुनिक विज्ञान', sa: 'आधुनिकं विज्ञानम्' }, locale)}</th>
                <th className="text-right text-gold-light py-2">{tl({ en: 'Match', hi: 'मिलान', sa: 'मिलनम्' }, locale)}</th>
              </tr>
            </thead>
            <tbody>
              {SCIENCE_COMPARE.map((row, i) => (
                <tr key={i} className={`border-b border-gold-primary/8 ${i % 2 === 0 ? 'bg-white/[0.01]' : ''}`}>
                  <td className="py-2 pr-4" style={{ color: row.color }}>{l(row.label)}</td>
                  <td className="text-right text-text-primary py-2 pr-4 font-mono">{row.vedic}</td>
                  <td className="text-right text-text-secondary py-2 pr-4">{l(row.modern)}</td>
                  <td className="text-right py-2">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                      row.match === '95%' ? 'bg-emerald-500/15 text-emerald-300' :
                      row.match === 'order' ? 'bg-amber-500/15 text-amber-300' :
                      'bg-white/5 text-text-secondary'
                    }`}>
                      {row.match}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-4 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
          <p className="text-emerald-200 text-xs">
            {tl({ en: "Kalpa (4.32 billion years) vs Earth\'s age (4.54 billion years): only 5% difference. Achieved without radiometric dating, thousands of years ago.", hi: "Kalpa (4.32 अरब वर्ष) बनाम पृथ्वी की आयु (4.54 अरब वर्ष): केवल 5% अंतर। यह रेडियोमेट्रिक डेटिंग के बिना हासिल किया गया, हजारों वर्ष पहले।", sa: "Kalpa (4.32 अरब वर्ष) बनाम पृथ्वी की आयु (4.54 अरब वर्ष): केवल 5% अंतर। यह रेडियोमेट्रिक डेटिंग के बिना हासिल किया गया, हजारों वर्ष पहले।" }, locale)}
          </p>
        </div>
      </div>

      {/* ── Section 4: Sources ──────────────────────────────────────── */}
      <div
        className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-2xl p-6"
      >
        <h3 className="text-gold-light font-bold text-xl mb-4" style={hf}>{t('s4Title')}</h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-5">{t('s4Body')}</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 rounded-xl bg-gold-primary/8 border border-gold-primary/20">
            <p className="text-gold-light font-semibold text-sm mb-2">{tl({ en: 'Surya Siddhanta (~400 CE)', hi: 'सूर्य सिद्धांत (~400 CE)', sa: 'सूर्यसिद्धान्तः (~400 CE)' }, locale)}</p>
            <p className="text-text-secondary text-xs leading-relaxed mb-3">
              {tl({ en: 'One of the oldest surviving astronomical texts. Gives the precise number: 1 Kalpa = 4,320,000,000 years, and derives planetary revolutions from this epoch.', hi: 'प्राचीनतम जीवित खगोलीय ग्रंथों में से एक। एक कल्प = 4,320,000,000 वर्ष की सटीक संख्या प्रदान करता है और ग्रहीय चक्करों की गणना इसी आधार पर करता है।', sa: 'जीवितेषु प्राचीनतमेषु खगोलशास्त्रग्रन्थेषु अन्यतमः। एकः कल्पः = 4,320,000,000 वर्षाणि इति स्पष्टसंख्यां ददाति, तथा च अस्मादेव युगात् ग्रहपरिक्रमणानि व्युत्पादयति।' }, locale)}
            </p>
            <div className="p-2 rounded-lg bg-white/[0.04] border border-gold-primary/10">
              <p className="text-gold-light font-mono text-xs">{tl({ en: '1 Kalpa = 4,320,000,000 years', hi: '1 कल्प = 4,32,00,00,000 वर्ष', sa: '1 कल्पः = 4,320,000,000 वर्षाणि' }, locale)}</p>
              <p className="text-text-secondary text-xs mt-0.5">{tl({ en: '= 1000 Mahayugas × 4,320,000', hi: '= 1000 महायुग × 4,320,000', sa: '= 1000 महायुगानि × 4,320,000' }, locale)}</p>
            </div>
          </div>
          <div className="p-4 rounded-xl bg-purple-500/8 border border-purple-500/20">
            <p className="text-purple-300 font-semibold text-sm mb-2">{tl({ en: 'Vishnu Purana', hi: 'विष्णु पुराण', sa: 'विष्णुपुराणम्' }, locale)}</p>
            <p className="text-text-secondary text-xs leading-relaxed mb-3">
              {tl({ en: "Describes the full nested hierarchy from Kali Yuga to Brahma\'s lifespan. Numbers are consistent and interlocking — not folklore, but mathematics.", hi: "कलि युग से ब्रह्मा के जीवनकाल तक पूर्ण नेस्टेड पदानुक्रम का वर्णन करता है। संख्याएँ सुसंगत और परस्पर जुड़ी हुई हैं — लोककथा नहीं, गणित।", sa: "कलि युग से ब्रह्मा के जीवनकाल तक पूर्ण नेस्टेड पदानुक्रम का वर्णन करता है। संख्याएँ सुसंगत और परस्पर जुड़ी हुई हैं — लोककथा नहीं, गणित।" }, locale)}
            </p>
            <div className="p-2 rounded-lg bg-white/[0.04] border border-purple-500/10">
              <p className="text-purple-300 font-mono text-xs">{tl({ en: "Brahma's lifespan = 311,040,000,000,000 years", hi: "ब्रह्मा का जीवनकाल = 311,040,000,000,000 वर्ष", sa: "ब्रह्मा का जीवनकाल = 311,040,000,000,000 वर्ष" }, locale)}</p>
              <p className="text-text-secondary text-xs mt-0.5">{tl({ en: '= 2 × 360 × 1000 × 2 × 1000 Mahayugas', hi: '= 2 × 360 × 1000 × 2 × 1000 महायुग', sa: '= 2 × 360 × 1000 × 2 × 1000 महायुगानि' }, locale)}</p>
            </div>
          </div>
        </div>
      </div>

      {/* ── Section 5: Carl Sagan ────────────────────────────────────── */}
      <div
        className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-2xl p-6"
      >
        <h3 className="text-gold-light font-bold text-xl mb-5" style={hf}>{t('s5Title')}</h3>

        <div className="p-5 rounded-xl bg-blue-500/8 border-l-4 border-blue-400/50 mb-5">
          <p className="text-blue-100 text-sm leading-relaxed italic mb-3">{t('s5Quote')}</p>
          <p className="text-blue-300 text-xs font-semibold">— Carl Sagan, Cosmos (1980)</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {[
            { label: { en: "Sagan's \"day of Brahma\"", hi: 'सागन का "ब्रह्मा का दिन"' }, value: '8.64 billion yrs', color: '#60a5fa' },
            { label: { en: 'Age of Earth (modern)', hi: 'पृथ्वी की आयु (आधुनिक)', sa: 'पृथ्वी की आयु (आधुनिक)', mai: 'पृथ्वी की आयु (आधुनिक)', mr: 'पृथ्वी की आयु (आधुनिक)', ta: 'பூமியின் வயது (நவீன)', te: 'భూమి వయసు (ఆధునిక)', bn: 'পৃথিবীর বয়স (আধুনিক)', kn: 'ಭೂಮಿಯ ವಯಸ್ಸು (ಆಧುನಿಕ)', gu: 'પૃથ્વીની ઉંમર (આધુનિક)' }, value: '4.54 billion yrs', color: '#34d399' },
            { label: { en: 'Kalpa (1 day of Brahma)', hi: 'कल्प (ब्रह्मा का 1 दिन)', sa: 'कल्प (ब्रह्मा का 1 दिन)', mai: 'कल्प (ब्रह्मा का 1 दिन)', mr: 'कल्प (ब्रह्मा का 1 दिन)', ta: 'கல்பம் (பிரம்மாவின் 1 நாள்)', te: 'కల్పం (బ్రహ్మ యొక్క 1 రోజు)', bn: 'কল্প (ব্রহ্মার ১ দিন)', kn: 'ಕಲ್ಪ (ಬ್ರಹ್ಮನ 1 ದಿನ)', gu: 'કલ્પ (બ્રહ્માનો 1 દિવસ)' }, value: '4.32 billion yrs', color: '#f0d48a' },
          ].map((stat, i) => (
            <div key={i} className="p-3 rounded-xl bg-white/[0.03] border border-white/5 text-center">
              <div className="font-mono text-base font-bold mb-1" style={{ color: stat.color }}>{stat.value}</div>
              <div className="text-text-secondary text-xs">{l(stat.label)}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Section 6: App Connection ────────────────────────────────── */}
      <div
        className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-2xl p-6"
      >
        <h3 className="text-gold-light font-bold text-xl mb-4" style={hf}>{t('s6Title')}</h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-5">{t('s6Body')}</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-5">
          {[
            { label: { en: 'Samvatsara (60-yr cycle)', hi: 'संवत्सर (60 वर्षीय चक्र)', sa: 'संवत्सर (60 वर्षीय चक्र)', mai: 'संवत्सर (60 वर्षीय चक्र)', mr: 'संवत्सर (60 वर्षीय चक्र)', ta: 'சம்வத்சரம் (60 ஆண்டு சுழற்சி)', te: 'సంవత్సరం (60 సంవత్సర చక్రం)', bn: 'সংবৎসর (60 বছরের চক্র)', kn: 'ಸಂವತ್ಸರ (60 ವರ್ಷ ಚಕ್ರ)', gu: 'સંવત્સર (60 વર્ષ ચક્ર)' }, detail: { en: 'Jupiter-Saturn conjunction cycle — sub-unit of Yuga time', hi: 'बृहस्पति-शनि संयुति चक्र — युग काल की उप-इकाई', sa: 'बृहस्पति-शनि संयुति चक्र — युग काल की उप-इकाई', mai: 'बृहस्पति-शनि संयुति चक्र — युग काल की उप-इकाई', mr: 'बृहस्पति-शनि संयुति चक्र — युग काल की उप-इकाई', ta: 'வியாழன்-சனி சேர்க்கை சுழற்சி — யுக காலத்தின் உப-அலகு', te: 'గురు-శని యుతి చక్రం — యుగ కాలం యొక్క ఉప-భాగం', bn: 'বৃহস্পতি-শনি যুতি চক্র — যুগ কালের উপ-একক', kn: 'ಗುರು-ಶನಿ ಯುತಿ ಚಕ್ರ — ಯುಗ ಕಾಲದ ಉಪ-ಘಟಕ', gu: 'ગુરુ-શનિ યુતિ ચક્ર — યુગ સમયનો ઉપ-એકમ' }, color: '#f0d48a' },
            { label: { en: 'Kali Yuga epoch (3102 BCE)', hi: 'कलि युग युग (3102 BCE)', sa: 'कलि युग युग (3102 BCE)', mai: 'कलि युग युग (3102 BCE)', mr: 'कलि युग युग (3102 BCE)', ta: 'கலியுக ஆரம்பம் (கி.மு. 3102)', te: 'కలియుగ ప్రారంభం (క్రీ.పూ. 3102)', bn: 'কলিযুগ আরম্ভ (খ্রি.পূ. 3102)', kn: 'ಕಲಿಯುಗ ಆರಂಭ (ಕ್ರಿ.ಪೂ. 3102)', gu: 'કલિયુગ આરંભ (ઈ.સ.પૂ. 3102)' }, detail: { en: 'Starting date used in Surya Siddhanta for all planetary positions', hi: 'सूर्य सिद्धांत में सभी ग्रहीय स्थितियों के लिए उपयोग की जाने वाली प्रारंभिक तिथि', sa: 'सूर्य सिद्धांत में सभी ग्रहीय स्थितियों के लिए उपयोग की जाने वाली प्रारंभिक तिथि', mai: 'सूर्य सिद्धांत में सभी ग्रहीय स्थितियों के लिए उपयोग की जाने वाली प्रारंभिक तिथि', mr: 'सूर्य सिद्धांत में सभी ग्रहीय स्थितियों के लिए उपयोग की जाने वाली प्रारंभिक तिथि', ta: 'அனைத்து கிரக நிலைகளுக்கும் சூர்ய சித்தாந்தத்தில் பயன்படுத்தப்பட்ட தொடக்க தேதி', te: 'అన్ని గ్రహ స్థానాలకు సూర్య సిద్ధాంతంలో ఉపయోగించిన ప్రారంభ తేదీ', bn: 'সমস্ত গ্রহ অবস্থানের জন্য সূর্য সিদ্ধান্তে ব্যবহৃত প্রারম্ভিক তারিখ', kn: 'ಎಲ್ಲಾ ಗ್ರಹ ಸ್ಥಾನಗಳಿಗೆ ಸೂರ್ಯ ಸಿದ್ಧಾಂತದಲ್ಲಿ ಬಳಸಲಾದ ಪ್ರಾರಂಭ ದಿನಾಂಕ', gu: 'તમામ ગ્રહ સ્થિતિઓ માટે સૂર્ય સિદ્ધાંતમાં વપરાયેલી શરૂઆતની તારીખ' }, color: '#f87171' },
            { label: { en: 'Vedic Time display', hi: 'वैदिक समय प्रदर्शन', sa: 'वैदिक समय प्रदर्शन', mai: 'वैदिक समय प्रदर्शन', mr: 'वैदिक समय प्रदर्शन', ta: 'வேத கால காட்சி', te: 'వేద కాల ప్రదర్శన', bn: 'বৈদিক সময় প্রদর্শন', kn: 'ವೈದಿಕ ಕಾಲ ಪ್ರದರ್ಶನ', gu: 'વૈદિક સમય પ્રદર્શન' }, detail: { en: 'Shows your current Manvantara, Mahayuga, Yuga, and position within Kali Yuga', hi: 'आपका वर्तमान मन्वंतर, महायुग, युग और कलि युग के भीतर स्थिति दिखाता है', sa: 'आपका वर्तमान मन्वंतर, महायुग, युग और कलि युग के भीतर स्थिति दिखाता है', mai: 'आपका वर्तमान मन्वंतर, महायुग, युग और कलि युग के भीतर स्थिति दिखाता है', mr: 'आपका वर्तमान मन्वंतर, महायुग, युग और कलि युग के भीतर स्थिति दिखाता है', ta: 'உங்கள் தற்போதைய மன்வந்தரம், மகாயுகம், யுகம் மற்றும் கலியுகத்தில் நிலையைக் காட்டுகிறது', te: 'మీ ప్రస్తుత మన్వంతరం, మహాయుగం, యుగం మరియు కలియుగంలో స్థానాన్ని చూపిస్తుంది', bn: 'আপনার বর্তমান মন্বন্তর, মহাযুগ, যুগ এবং কলিযুগের মধ্যে অবস্থান দেখায়', kn: 'ನಿಮ್ಮ ಪ್ರಸ್ತುತ ಮನ್ವಂತರ, ಮಹಾಯುಗ, ಯುಗ ಮತ್ತು ಕಲಿಯುಗದಲ್ಲಿ ಸ್ಥಾನವನ್ನು ತೋರಿಸುತ್ತದೆ', gu: 'તમારું વર્તમાન મન્વંતર, મહાયુગ, યુગ અને કલિયુગમાં સ્થિતિ બતાવે છે' }, color: '#a78bfa' },
            { label: { en: 'Ayanamsha (precession)', hi: 'अयनांश (अग्रगमन)', sa: 'अयनांश (अग्रगमन)', mai: 'अयनांश (अग्रगमन)', mr: 'अयनांश (अग्रगमन)', ta: 'அயனாம்சம் (பூர்வகதி)', te: 'అయనాంశ (విషువత్ చలనం)', bn: 'অয়নাংশ (বিষুবচলন)', kn: 'ಅಯನಾಂಶ (ವಿಷುವದ್ ಚಲನೆ)', gu: 'અયનાંશ (વિષુવચલન)' }, detail: { en: 'Precession cycle (~26,000 yrs) is a sub-harmonic of Yuga mathematics', hi: 'अग्रगमन चक्र (~26,000 वर्ष) युग गणित का एक उप-हार्मोनिक है', sa: 'अग्रगमन चक्र (~26,000 वर्ष) युग गणित का एक उप-हार्मोनिक है', mai: 'अग्रगमन चक्र (~26,000 वर्ष) युग गणित का एक उप-हार्मोनिक है', mr: 'अग्रगमन चक्र (~26,000 वर्ष) युग गणित का एक उप-हार्मोनिक है', ta: 'பூர்வகதி சுழற்சி (~26,000 ஆண்டுகள்) யுக கணிதத்தின் உப-ஒத்திசைவு', te: 'విషువత్ చలన చక్రం (~26,000 సంవత్సరాలు) యుగ గణితం యొక్క ఉప-హార్మోనిక్', bn: 'বিষুবচলন চক্র (~26,000 বছর) যুগ গণিতের উপ-হারমোনিক', kn: 'ವಿಷುವದ್ ಚಲನೆ ಚಕ್ರ (~26,000 ವರ್ಷ) ಯುಗ ಗಣಿತದ ಉಪ-ಹಾರ್ಮೋನಿಕ್', gu: 'વિષુવચલન ચક્ર (~26,000 વર્ષ) યુગ ગણિતનો ઉપ-હાર્મોનિક છે' }, color: '#34d399' },
          ].map((item, i) => (
            <div key={i} className="p-4 rounded-xl bg-white/[0.03] border border-white/5 flex items-start gap-3">
              <div className="w-2 h-2 rounded-full flex-shrink-0 mt-1.5" style={{ background: item.color }} />
              <div>
                <div className="text-sm font-semibold mb-1" style={{ color: item.color }}>{l(item.label)}</div>
                <div className="text-text-secondary text-xs">{l(item.detail)}</div>
              </div>
            </div>
          ))}
        </div>

        <Link
          href="/vedic-time"
          className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-gold-primary/15 border border-gold-primary/25 text-gold-light text-sm font-semibold hover:bg-gold-primary/25 transition-colors"
        >
          {tl({ en: 'Explore Vedic Time Tool', hi: 'वैदिक समय उपकरण देखें', sa: 'वैदिककालोपकरणम् अन्वेषयतु' }, locale)} →
        </Link>
      </div>

      {/* ── Navigation ──────────────────────────────────────────────── */}
      <div
        className="flex flex-col sm:flex-row gap-3 pt-4"
      >
        <Link href="/learn" className="text-text-secondary hover:text-gold-light text-sm transition-colors">
          {t('backLink')}
        </Link>
        <div className="flex gap-3 sm:ml-auto">
          <Link href="/learn/contributions/gravity" className="px-4 py-2 rounded-xl bg-gold-primary/15 border border-gold-primary/20 text-gold-light text-sm hover:bg-gold-primary/25 transition-colors">
            ← {t('gravity')}
          </Link>
          <Link href="/vedic-time" className="px-4 py-2 rounded-xl bg-gold-primary/15 border border-gold-primary/20 text-gold-light text-sm hover:bg-gold-primary/25 transition-colors">
            {t('vedicTime')} →
          </Link>
        </div>
      </div>

    </div>
  );
}
