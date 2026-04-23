'use client';

import { tl } from '@/lib/utils/trilingual';
import { GrahaIconById } from '@/components/icons/GrahaIcons';
import type { BhavaBalaResult } from '@/lib/kundali/bhavabala';
import type { Locale, LocaleText } from '@/types/panchang';

export default function BhavabalaTab({ bhavabala, locale, isDevanagari, headingFont }: {
  bhavabala: BhavaBalaResult[];
  locale: Locale;
  isDevanagari: boolean;
  headingFont: React.CSSProperties;
}) {
  const isTamil = String(locale) === 'ta';
  const bodyFont = isDevanagari ? { fontFamily: 'var(--font-devanagari-body)' } : {};

  const HOUSE_NAMES: Record<number, LocaleText> = {
    1: { en: 'Self / Lagna', hi: 'तनु / लग्न', sa: 'तनु / लग्न', mai: 'तनु / लग्न', mr: 'तनु / लग्न', ta: 'சுயம் / லக்னம்', te: 'ఆత్మ / లగ్నం', bn: 'আত্ম / লগ্ন', kn: 'ಸ್ವಯಂ / ಲಗ್ನ', gu: 'સ્વ / લગ્ન' },
    2: { en: 'Wealth / Dhana', hi: 'धन', sa: 'धन', mai: 'धन', mr: 'धन', ta: 'செல்வம் / தனம்', te: 'ధనం / ధన', bn: 'ধন / ধন', kn: 'ಧನ / ಧನ', gu: 'ધન / ધન' },
    3: { en: 'Siblings / Sahaja', hi: 'सहज', sa: 'सहज', mai: 'सहज', mr: 'सहज', ta: 'உடன்பிறப்பு / சகஜம்', te: 'తోబుట్టువులు / సహజ', bn: 'ভাইবোন / সহজ', kn: 'ಒಡಹುಟ್ಟಿದವರು / ಸಹಜ', gu: 'ભાઈ-બહેન / સહજ' },
    4: { en: 'Mother / Sukha', hi: 'सुख / मातृ', sa: 'सुख / मातृ', mai: 'सुख / मातृ', mr: 'सुख / मातृ', ta: 'தாய் / சுகம்', te: 'తల్లి / సుఖ', bn: 'মাতা / সুখ', kn: 'ತಾಯಿ / ಸುಖ', gu: 'માતા / સુખ' },
    5: { en: 'Children / Putra', hi: 'पुत्र / संतान', sa: 'पुत्र / संतान', mai: 'पुत्र / संतान', mr: 'पुत्र / संतान', ta: 'குழந்தைகள் / புத்திரம்', te: 'సంతానం / పుత్ర', bn: 'সন্তান / পুত্র', kn: 'ಮಕ್ಕಳು / ಪುತ್ರ', gu: 'સંતાન / પુત્ર' },
    6: { en: 'Enemies / Ripu', hi: 'रिपु / शत्रु', sa: 'रिपु / शत्रु', mai: 'रिपु / शत्रु', mr: 'रिपु / शत्रु', ta: 'எதிரிகள் / ரிபு', te: 'శత్రువులు / రిపు', bn: 'শত্রু / রিপু', kn: 'ಶತ್ರು / ರಿಪು', gu: 'શત્રુ / રિપુ' },
    7: { en: 'Spouse / Yuvati', hi: 'युवती / जाया', sa: 'युवती / जाया', mai: 'युवती / जाया', mr: 'युवती / जाया', ta: 'துணைவர் / யுவதி', te: 'భాగస్వామి / యువతి', bn: 'স্ত্রী / যুবতী', kn: 'ಸಂಗಾತಿ / ಯುವತಿ', gu: 'જીવનસાથી / યુવતી' },
    8: { en: 'Longevity / Randhra', hi: 'रन्ध्र / आयु', sa: 'रन्ध्र / आयु', mai: 'रन्ध्र / आयु', mr: 'रन्ध्र / आयु', ta: 'ஆயுள் / ரந்திரம்', te: 'ఆయుష్షు / రంధ్ర', bn: 'দীর্ঘায়ু / রন্ধ্র', kn: 'ಆಯುಷ್ಯ / ರಂಧ್ರ', gu: 'આયુષ્ય / રંધ્ર' },
    9: { en: 'Fortune / Dharma', hi: 'धर्म / भाग्य', sa: 'धर्म / भाग्य', mai: 'धर्म / भाग्य', mr: 'धर्म / भाग्य', ta: 'பாக்கியம் / தர்மம்', te: 'భాగ్యం / ధర్మ', bn: 'ভাগ্য / ধর্ম', kn: 'ಭಾಗ್ಯ / ಧರ್ಮ', gu: 'ભાગ્ય / ધર્મ' },
    10: { en: 'Career / Karma', hi: 'कर्म / राज्य', sa: 'कर्म / राज्य', mai: 'कर्म / राज्य', mr: 'कर्म / राज्य', ta: 'தொழில் / கர்மம்', te: 'వృత్తి / కర్మ', bn: 'কর্মজীবন / কর্ম', kn: 'ವೃತ್ತಿ / ಕರ್ಮ', gu: 'કારકિર્દી / કર્મ' },
    11: { en: 'Gains / Labha', hi: 'लाभ', sa: 'लाभ', mai: 'लाभ', mr: 'लाभ', ta: 'லாபம் / லாபம்', te: 'లాభం / లాభ', bn: 'লাভ / লাভ', kn: 'ಲಾಭ / ಲಾಭ', gu: 'લાભ / લાભ' },
    12: { en: 'Loss / Vyaya', hi: 'व्यय', sa: 'व्यय', mai: 'व्यय', mr: 'व्यय', ta: 'நஷ்டம் / வியயம்', te: 'నష్టం / వ్యయ', bn: 'ক্ষতি / ব্যয়', kn: 'ನಷ್ಟ / ವ್ಯಯ', gu: 'ખોટ / વ્યય' },
  };

  const maxTotal = Math.max(...bhavabala.map(b => b.total));

  return (
    <div className="space-y-6">
      <h3 className="text-2xl font-bold text-gold-gradient text-center" style={headingFont}>
        {locale === 'en' || isTamil ? 'Bhavabala — House Strength' : 'भावबल — भाव शक्ति'}
      </h3>

      <div className="rounded-xl bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 p-4 sm:p-6 overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-text-secondary border-b border-gold-primary/15 text-xs uppercase tracking-wider">
              <th className="text-left py-3 px-2" style={bodyFont}>{locale === 'en' || isTamil ? 'Bhava' : 'भाव'}</th>
              <th className="text-left py-3 px-2" style={bodyFont}>{locale === 'en' || isTamil ? 'Signification' : 'कारकत्व'}</th>
              <th className="text-left py-3 px-2" style={bodyFont}>{locale === 'en' || isTamil ? 'Lord' : 'स्वामी'}</th>
              <th className="text-right py-3 px-2">{locale === 'en' || isTamil ? 'Lord Bala' : 'स्वामी बल'}</th>
              <th className="text-right py-3 px-2">{locale === 'en' || isTamil ? 'Dig Bala' : 'दिग्बल'}</th>
              <th className="text-right py-3 px-2">{locale === 'en' || isTamil ? 'Drishti' : 'दृष्टि'}</th>
              <th className="text-right py-3 px-2">{locale === 'en' || isTamil ? 'Total' : 'कुल'}</th>
              <th className="text-right py-3 px-2">%</th>
            </tr>
          </thead>
          <tbody>
            {bhavabala.map(b => {
              const houseName = HOUSE_NAMES[b.bhava] || { en: `House ${b.bhava}`, hi: `भाव ${b.bhava}`, sa: `भाव ${b.bhava}`, mai: `भाव ${b.bhava}`, mr: `भाव ${b.bhava}`, ta: `House ${b.bhava}`, te: `House ${b.bhava}`, bn: `House ${b.bhava}`, kn: `House ${b.bhava}`, gu: `House ${b.bhava}` };
              const pct = b.strengthPercent;
              const color = pct >= 120 ? 'text-green-400' : pct >= 90 ? 'text-gold-light' : 'text-red-400';
              return (
                <tr key={b.bhava} className="border-b border-gold-primary/5 hover:bg-gold-primary/5">
                  <td className="py-2.5 px-2 text-gold-light font-bold">{b.bhava}</td>
                  <td className="py-2.5 px-2 text-text-secondary text-xs" style={bodyFont}>{tl(houseName, locale)}</td>
                  <td className="py-2.5 px-2">
                    {b.lordId <= 6 && <GrahaIconById id={b.lordId} size={16} />}
                    <span className="text-text-primary text-xs ml-1">{b.lordName}</span>
                  </td>
                  <td className="py-2.5 px-2 text-right text-text-secondary font-mono text-xs">{b.bhavadhipatiBala.toFixed(0)}</td>
                  <td className="py-2.5 px-2 text-right text-text-secondary font-mono text-xs">{b.bhavaDigBala.toFixed(0)}</td>
                  <td className="py-2.5 px-2 text-right font-mono text-xs">
                    <span className={b.bhavaDrishtiBala >= 0 ? 'text-green-400' : 'text-red-400'}>
                      {b.bhavaDrishtiBala >= 0 ? '+' : ''}{b.bhavaDrishtiBala.toFixed(0)}
                    </span>
                  </td>
                  <td className={`py-2.5 px-2 text-right font-mono text-xs font-bold ${color}`}>{b.total.toFixed(0)}</td>
                  <td className={`py-2.5 px-2 text-right font-mono text-xs font-bold ${color}`}>{pct}%</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Visual bar chart */}
      <div className="rounded-xl bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 p-6">
        <h4 className="text-gold-primary text-xs uppercase tracking-wider mb-4 font-bold text-center" style={bodyFont}>
          {locale === 'en' || isTamil ? 'House Strength Distribution' : 'भाव बल वितरण'}
        </h4>
        <div className="space-y-2">
          {bhavabala.map(b => {
            const pct = Math.min(100, (b.total / maxTotal) * 100);
            const color = b.strengthPercent >= 120 ? '#4ade80' : b.strengthPercent >= 90 ? '#d4a853' : '#f87171';
            const houseName = HOUSE_NAMES[b.bhava] || { en: `H${b.bhava}`, hi: `भा${b.bhava}`, sa: `भा${b.bhava}`, mai: `भा${b.bhava}`, mr: `भा${b.bhava}`, ta: `H${b.bhava}`, te: `H${b.bhava}`, bn: `H${b.bhava}`, kn: `H${b.bhava}`, gu: `H${b.bhava}` };
            return (
              <div key={b.bhava} className="flex items-center gap-3">
                <div className="w-6 text-right text-xs text-gold-light font-bold">{b.bhava}</div>
                <div className="w-16 sm:w-24 text-right text-xs text-text-secondary truncate" style={bodyFont}>{tl(houseName, locale)}</div>
                <div className="flex-1 bg-gold-primary/10 rounded-full h-4 overflow-hidden">
                  <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, backgroundColor: color }} />
                </div>
                <div className="w-12 text-right text-xs font-mono" style={{ color }}>{b.strengthPercent}%</div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
