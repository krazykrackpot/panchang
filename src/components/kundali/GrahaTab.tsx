'use client';

import { tl } from '@/lib/utils/trilingual';
import { GrahaIconById } from '@/components/icons/GrahaIcons';
import { RashiIconById } from '@/components/icons/RashiIcons';
import type { GrahaDetail, UpagrahaPosition } from '@/types/kundali';
import type { PlanetInsight } from '@/lib/kundali/tippanni-types';
import type { Locale, LocaleText } from '@/types/panchang';

export default function GrahaTab({ grahaDetails, upagrahas, locale, isDevanagari, headingFont, planetInsights }: {
  grahaDetails: GrahaDetail[];
  upagrahas: UpagrahaPosition[];
  locale: Locale;
  isDevanagari: boolean;
  headingFont: React.CSSProperties;
  planetInsights?: PlanetInsight[];
}) {
  const isTamil = String(locale) === 'ta';
  const bodyFont = isDevanagari ? { fontFamily: 'var(--font-devanagari-body)' } : {};
  return (
    <div className="space-y-8">
      <h3 className="text-2xl font-bold text-gold-gradient text-center" style={headingFont}>
        {locale === 'en' || isTamil ? 'Graha Details' : 'ग्रह विवरण'}
      </h3>

      {/* Graha Table */}
      <div className="rounded-xl bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 p-4 sm:p-6 overflow-x-auto">
        <table className="w-full text-sm whitespace-nowrap">
          <thead>
            <tr className="text-text-secondary border-b border-gold-primary/15 text-xs uppercase tracking-wider">
              <th className="text-left py-3 px-2" style={bodyFont}>{locale === 'en' || isTamil ? 'Graha' : 'ग्रह'}</th>
              <th className="text-center py-3 px-1">R</th>
              <th className="text-center py-3 px-1">C</th>
              <th className="text-left py-3 px-2" style={bodyFont}>{locale === 'en' || isTamil ? 'Longitude' : 'भोगांश'}</th>
              <th className="text-left py-3 px-2" style={bodyFont}>{locale === 'en' || isTamil ? 'Nakshatra / Swami' : 'नक्षत्र / स्वामी'}</th>
              <th className="text-right py-3 px-2">{locale === 'en' || isTamil ? 'Raw L.' : 'कच्चा अं.'}</th>
              <th className="text-right py-3 px-2">{locale === 'en' || isTamil ? 'Latitude' : 'अक्षांश'}</th>
              <th className="text-right py-3 px-2">{locale === 'en' || isTamil ? 'R.A.' : 'विषु.अं.'}</th>
              <th className="text-right py-3 px-2">{locale === 'en' || isTamil ? 'Declination' : 'क्रान्ति'}</th>
              <th className="text-right py-3 px-2">{locale === 'en' || isTamil ? 'Speed °/day' : 'गति °/दि'}</th>
            </tr>
          </thead>
          <tbody>
            {grahaDetails.map((g) => (
              <tr key={g.planetId} className="border-b border-gold-primary/5 hover:bg-gold-primary/5">
                <td className="py-2.5 px-2">
                  <div className="flex items-center gap-2">
                    <GrahaIconById id={g.planetId} size={20} />
                    <span className="text-gold-light font-medium" style={bodyFont}>{tl(g.planetName, locale)}</span>
                  </div>
                </td>
                <td className="text-center py-2.5 px-1">
                  {g.isRetrograde && <span className="text-red-400 font-bold text-xs">R</span>}
                </td>
                <td className="text-center py-2.5 px-1">
                  {g.isCombust && <span className="text-orange-400 font-bold text-xs">C</span>}
                </td>
                <td className="py-2.5 px-2">
                  <span className="text-text-primary">{tl(g.signName, locale)}</span>
                  <span className="text-text-secondary ml-1">{g.signDegree}</span>
                </td>
                <td className="py-2.5 px-2">
                  <span className="text-text-primary" style={bodyFont}>{tl(g.nakshatraName, locale)}</span>
                  <span className="text-gold-dark ml-1 text-xs">P{g.nakshatraPada}</span>
                  <span className="text-text-secondary/75 ml-1 text-xs">/ {tl(g.nakshatraLord, locale)}</span>
                </td>
                <td className="py-2.5 px-2 text-right text-text-secondary font-mono text-xs">{g.longitude.toFixed(2)}°</td>
                <td className="py-2.5 px-2 text-right text-text-secondary font-mono text-xs">{g.latitude.toFixed(4)}°</td>
                <td className="py-2.5 px-2 text-right text-text-secondary font-mono text-xs">{g.rightAscension.toFixed(2)}°</td>
                <td className="py-2.5 px-2 text-right text-text-secondary font-mono text-xs">{g.declination.toFixed(2)}°</td>
                <td className="py-2.5 px-2 text-right font-mono text-xs">
                  <span className={g.speed < 0 ? 'text-red-400' : 'text-text-secondary'}>{g.speed.toFixed(4)}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Planetary Interpretations */}
      {planetInsights && planetInsights.length > 0 && (() => {
        const PLANET_PALETTE: Record<number, { border: string; glow: string; badge: string; label: string }> = {
          0: { border: 'border-amber-500/30',  glow: 'bg-amber-500/5',   badge: 'bg-amber-500/15 border-amber-500/25 text-amber-300',   label: 'text-amber-200' },  // Sun
          1: { border: 'border-slate-400/30',  glow: 'bg-slate-400/5',   badge: 'bg-slate-400/15 border-slate-400/25 text-slate-300',   label: 'text-slate-200' },  // Moon
          2: { border: 'border-red-500/30',    glow: 'bg-red-500/5',     badge: 'bg-red-500/15 border-red-500/25 text-red-300',         label: 'text-red-200'   },  // Mars
          3: { border: 'border-emerald-500/30',glow: 'bg-emerald-500/5', badge: 'bg-emerald-500/15 border-emerald-500/25 text-emerald-300', label: 'text-emerald-200' }, // Mercury
          4: { border: 'border-yellow-500/30', glow: 'bg-yellow-500/5',  badge: 'bg-yellow-500/15 border-yellow-500/25 text-yellow-300', label: 'text-yellow-200' }, // Jupiter
          5: { border: 'border-rose-400/30',   glow: 'bg-rose-400/5',    badge: 'bg-rose-400/15 border-rose-400/25 text-rose-300',       label: 'text-rose-200'  },  // Venus
          6: { border: 'border-indigo-400/30', glow: 'bg-indigo-400/5',  badge: 'bg-indigo-400/15 border-indigo-400/25 text-indigo-300', label: 'text-indigo-200' }, // Saturn
          7: { border: 'border-violet-500/30', glow: 'bg-violet-500/5',  badge: 'bg-violet-500/15 border-violet-500/25 text-violet-300', label: 'text-violet-200' }, // Rahu
          8: { border: 'border-orange-700/30', glow: 'bg-orange-700/5',  badge: 'bg-orange-700/15 border-orange-700/25 text-orange-300', label: 'text-orange-200' }, // Ketu
        };
        return (
          <div className="mt-8">
            <h4 className="text-lg font-bold text-gold-light mb-4" style={headingFont}>
              {locale === 'en' || isTamil ? 'Planetary Interpretations' : 'ग्रह व्याख्या'}
            </h4>
            <div className="space-y-3">
              {grahaDetails.map((g) => {
                const insight = planetInsights.find(pi => pi.planetId === g.planetId);
                if (!insight) return null;
                const pal = PLANET_PALETTE[g.planetId] ?? PLANET_PALETTE[0];
                return (
                  <div key={g.planetId} className={`relative overflow-hidden rounded-xl border ${pal.border} bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] p-4`}>
                    <div className={`absolute -top-8 -right-8 w-28 h-28 rounded-full ${pal.glow} blur-2xl pointer-events-none`} />
                    <div className="relative z-10">
                      <div className="flex items-center gap-2 mb-2 flex-wrap">
                        <GrahaIconById id={g.planetId} size={22} />
                        <span className={`font-bold text-sm ${pal.label}`} style={bodyFont}>{tl(g.planetName, locale)}</span>
                        <span className={`text-xs px-2 py-0.5 rounded-full border font-medium ${pal.badge}`} style={bodyFont}>
                          {tl(g.signName, locale)}
                        </span>
                        <span className="text-text-secondary/70 text-xs" style={bodyFont}>
                          {locale === 'en' || isTamil ? `House ${insight.house}` : `भाव ${insight.house}`}
                        </span>
                      </div>
                      <p className="text-text-secondary text-sm leading-relaxed" style={bodyFont}>{insight.description}</p>
                      {insight.implications && (
                        <p className="text-text-secondary/65 text-sm mt-2 leading-relaxed border-t border-white/5 pt-2" style={bodyFont}>{insight.implications}</p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })()}

      {/* Upagrahas */}
      {upagrahas.length > 0 && (() => {
        const UPAGRAHA_NOTES: Record<string, LocaleText> = {
          'Dhuma': { en: 'Smoke of the Sun — indicates obstacles and hidden enemies when afflicted', hi: 'सूर्य का धूम — पीड़ित होने पर बाधाएँ और छिपे शत्रु', sa: 'सूर्य का धूम — पीड़ित होने पर बाधाएँ और छिपे शत्रु', mai: 'सूर्य का धूम — पीड़ित होने पर बाधाएँ और छिपे शत्रु', mr: 'सूर्य का धूम — पीड़ित होने पर बाधाएँ और छिपे शत्रु', ta: 'சூரியனின் புகை — பாதிக்கப்படும்போது தடைகள் மற்றும் மறைந்த எதிரிகளைக் குறிக்கிறது', te: 'సూర్యుని పొగ — బాధితమైనప్పుడు అడ్డంకులు మరియు దాగిన శత్రువులను సూచిస్తుంది', bn: 'সূর্যের ধূম — পীড়িত হলে বাধা ও গোপন শত্রু নির্দেশ করে', kn: 'ಸೂರ್ಯನ ಹೊಗೆ — ಪೀಡಿತವಾದಾಗ ಅಡ್ಡಿ ಮತ್ತು ಗುಪ್ತ ಶತ್ರುಗಳನ್ನು ಸೂಚಿಸುತ್ತದೆ', gu: 'સૂર્યનો ધુમાડો — પીડિત હોય ત્યારે અવરોધ અને છુપાયેલા શત્રુ દર્શાવે છે' },
          'Vyatipata': { en: 'Calamity point — sensitive degree that can trigger sudden events', hi: 'आपत्ति बिन्दु — अचानक घटनाओं को उत्प्रेरित करने वाला संवेदनशील अंश', sa: 'आपत्ति बिन्दु — अचानक घटनाओं को उत्प्रेरित करने वाला संवेदनशील अंश', mai: 'आपत्ति बिन्दु — अचानक घटनाओं को उत्प्रेरित करने वाला संवेदनशील अंश', mr: 'आपत्ति बिन्दु — अचानक घटनाओं को उत्प्रेरित करने वाला संवेदनशील अंश', ta: 'ஆபத்து புள்ளி — திடீர் நிகழ்வுகளைத் தூண்டக்கூடிய உணர்திறன் பாகை', te: 'ఉపద్రవ బిందువు — ఆకస్మిక సంఘటనలను ప్రేరేపించగల సున్నితమైన డిగ్రీ', bn: 'দুর্যোগ বিন্দু — আকস্মিক ঘটনা ঘটাতে পারে এমন সংবেদনশীল ডিগ্রি', kn: 'ವಿಪತ್ತು ಬಿಂದು — ಆಕಸ್ಮಿಕ ಘಟನೆಗಳನ್ನು ಪ್ರಚೋದಿಸಬಹುದಾದ ಸೂಕ್ಷ್ಮ ಡಿಗ್ರಿ', gu: 'આપત્તિ બિંદુ — અચાનક ઘટનાઓ ઉત્તેજિત કરી શકે તેવી સંવેદનશીલ ડિગ્રી' },
          'Parivesha': { en: 'Halo of the Moon — spiritual awareness and intuitive perception', hi: 'चन्द्र का परिवेश — आध्यात्मिक जागरूकता और अन्तर्ज्ञान', sa: 'चन्द्र का परिवेश — आध्यात्मिक जागरूकता और अन्तर्ज्ञान', mai: 'चन्द्र का परिवेश — आध्यात्मिक जागरूकता और अन्तर्ज्ञान', mr: 'चन्द्र का परिवेश — आध्यात्मिक जागरूकता और अन्तर्ज्ञान', ta: 'சந்திரனின் ஒளிவட்டம் — ஆன்மிக விழிப்புணர்வு மற்றும் உள்ளுணர்வு', te: 'చంద్రుని ప్రభా — ఆధ్యాత్మిక అవగాహన మరియు అంతర్దృష్టి', bn: 'চন্দ্রের আভামণ্ডল — আধ্যাত্মিক সচেতনতা ও অন্তর্জ্ঞান', kn: 'ಚಂದ್ರನ ಪ್ರಭಾವಲಯ — ಅಧ್ಯಾತ್ಮಿಕ ಜಾಗೃತಿ ಮತ್ತು ಅಂತಃಪ್ರಜ್ಞೆ', gu: 'ચંદ્રનું પ્રભામંડળ — આધ્યાત્મિક જાગૃતિ અને અંતર્જ્ઞાન' },
          'Indrachapa': { en: 'Indra\'s bow — rainbow point indicating divine grace and protection', hi: 'इन्द्रचाप — दिव्य कृपा और सुरक्षा का सूचक इन्द्रधनुष बिन्दु' },
          'Upaketu': { en: 'Sub-Ketu — deepens Ketu\'s spiritual and detachment effects', hi: 'उपकेतु — केतु के आध्यात्मिक और वैराग्य प्रभावों को गहन करता है' },
          'Kala': { en: 'Time — indicates karmic timing and fateful periods in life', hi: 'काल — कार्मिक समय और जीवन के भाग्यपूर्ण काल का सूचक', sa: 'काल — कार्मिक समय और जीवन के भाग्यपूर्ण काल का सूचक', mai: 'काल — कार्मिक समय और जीवन के भाग्यपूर्ण काल का सूचक', mr: 'काल — कार्मिक समय और जीवन के भाग्यपूर्ण काल का सूचक', ta: 'காலம் — கர்ம நேரம் மற்றும் விதியான காலகட்டங்களைக் குறிக்கிறது', te: 'కాలం — కర్మ సమయం మరియు విధి నిర్ణయించే కాలాలను సూచిస్తుంది', bn: 'কাল — কর্মগত সময় ও ভাগ্যনির্ধারক কাল নির্দেশ করে', kn: 'ಕಾಲ — ಕಾರ್ಮಿಕ ಸಮಯ ಮತ್ತು ವಿಧಿನಿರ್ಣಾಯಕ ಅವಧಿಗಳನ್ನು ಸೂಚಿಸುತ್ತದೆ', gu: 'કાળ — કર્મ સમય અને ભાગ્યનિર્ધારક કાળ દર્શાવે છે' },
          'Mrityu': { en: 'Death point — sensitive degree related to health vulnerabilities', hi: 'मृत्यु बिन्दु — स्वास्थ्य कमजोरियों से सम्बन्धित संवेदनशील अंश', sa: 'मृत्यु बिन्दु — स्वास्थ्य कमजोरियों से सम्बन्धित संवेदनशील अंश', mai: 'मृत्यु बिन्दु — स्वास्थ्य कमजोरियों से सम्बन्धित संवेदनशील अंश', mr: 'मृत्यु बिन्दु — स्वास्थ्य कमजोरियों से सम्बन्धित संवेदनशील अंश', ta: 'மரண புள்ளி — உடல்நல பாதிப்புகளுடன் தொடர்புடைய உணர்திறன் பாகை', te: 'మృత్యు బిందువు — ఆరోగ్య బలహీనతలకు సంబంధించిన సున్నితమైన డిగ్రీ', bn: 'মৃত্যু বিন্দু — স্বাস্থ্য দুর্বলতার সাথে সম্পর্কিত সংবেদনশীল ডিগ্রি', kn: 'ಮೃತ್ಯು ಬಿಂದು — ಆರೋಗ್ಯ ದುರ್ಬಲತೆಗಳಿಗೆ ಸಂಬಂಧಿಸಿದ ಸೂಕ್ಷ್ಮ ಡಿಗ್ರಿ', gu: 'મૃત્યુ બિંદુ — આરોગ્ય નબળાઈ સાથે સંબંધિત સંવેદનશીલ ડિગ્રી' },
          'Ardhaprahara': { en: 'Half-watch — indicates midpoint energy and balance in the chart', hi: 'अर्धप्रहर — कुण्डली में मध्यबिन्दु ऊर्जा और सन्तुलन का सूचक', sa: 'अर्धप्रहर — कुण्डली में मध्यबिन्दु ऊर्जा और सन्तुलन का सूचक', mai: 'अर्धप्रहर — कुण्डली में मध्यबिन्दु ऊर्जा और सन्तुलन का सूचक', mr: 'अर्धप्रहर — कुण्डली में मध्यबिन्दु ऊर्जा और सन्तुलन का सूचक', ta: 'அரை காவல் — குண்டலியில் மத்தியப் புள்ளி ஆற்றல் மற்றும் சமநிலையைக் குறிக்கிறது', te: 'అర్ధప్రహర — జాతకంలో మధ్యబిందు శక్తి మరియు సమతుల్యతను సూచిస్తుంది', bn: 'অর্ধপ্রহর — কুণ্ডলীতে মধ্যবিন্দু শক্তি ও ভারসাম্য নির্দেশ করে', kn: 'ಅರ್ಧಪ್ರಹರ — ಕುಂಡಲಿಯಲ್ಲಿ ಮಧ್ಯಬಿಂದು ಶಕ್ತಿ ಮತ್ತು ಸಮತೋಲನವನ್ನು ಸೂಚಿಸುತ್ತದೆ', gu: 'અર્ધપ્રહર — કુંડળીમાં મધ્યબિંદુ શક્તિ અને સમતુલા દર્શાવે છે' },
          'Gulika': { en: 'Son of Saturn — malefic point indicating chronic issues and karmic debts', hi: 'शनि पुत्र — दीर्घकालिक समस्याओं और कार्मिक ऋणों का अशुभ बिन्दु', sa: 'शनि पुत्र — दीर्घकालिक समस्याओं और कार्मिक ऋणों का अशुभ बिन्दु', mai: 'शनि पुत्र — दीर्घकालिक समस्याओं और कार्मिक ऋणों का अशुभ बिन्दु', mr: 'शनि पुत्र — दीर्घकालिक समस्याओं और कार्मिक ऋणों का अशुभ बिन्दु', ta: 'சனியின் மகன் — நாள்பட்ட பிரச்சினைகள் மற்றும் கர்ம கடன்களைக் குறிக்கும் பாபப் புள்ளி', te: 'శనికుమారుడు — దీర్ఘకాలిక సమస్యలు మరియు కర్మ ఋణాలను సూచించే పాపబిందువు', bn: 'শনির পুত্র — দীর্ঘস্থায়ী সমস্যা ও কর্মঋণ নির্দেশকারী পাপবিন্দু', kn: 'ಶನಿಯ ಮಗ — ದೀರ್ಘಕಾಲಿಕ ಸಮಸ್ಯೆ ಮತ್ತು ಕರ್ಮಋಣವನ್ನು ಸೂಚಿಸುವ ಪಾಪಬಿಂದು', gu: 'શનિનો પુત્ર — લાંબી સમસ્યાઓ અને કર્મઋણ દર્શાવતો પાપબિંદુ' },
          'Mandi': { en: 'Son of Saturn — similar to Gulika, indicates delays and karmic blocks', hi: 'शनि पुत्र — गुलिक के समान, विलम्ब और कार्मिक अवरोधों का सूचक', sa: 'शनि पुत्र — गुलिक के समान, विलम्ब और कार्मिक अवरोधों का सूचक', mai: 'शनि पुत्र — गुलिक के समान, विलम्ब और कार्मिक अवरोधों का सूचक', mr: 'शनि पुत्र — गुलिक के समान, विलम्ब और कार्मिक अवरोधों का सूचक', ta: 'சனியின் மகன் — குளிகை போன்றது, தாமதங்கள் மற்றும் கர்ம தடைகளைக் குறிக்கிறது', te: 'శనికుమారుడు — గులికతో సమానం, ఆలస్యాలు మరియు కర్మ అడ్డంకులను సూచిస్తుంది', bn: 'শনির পুত্র — গুলিকার অনুরূপ, বিলম্ব ও কর্মগত বাধা নির্দেশ করে', kn: 'ಶನಿಯ ಮಗ — ಗುಳಿಕೆಯಂತೆ, ವಿಳಂಬ ಮತ್ತು ಕಾರ್ಮಿಕ ಅಡ್ಡಿಗಳನ್ನು ಸೂಚಿಸುತ್ತದೆ', gu: 'શનિનો પુત્ર — ગુલિકા જેવું, વિલંબ અને કર્મ અવરોધ દર્શાવે છે' },
        };
        return (
          <div>
            <h3 className="text-xl font-bold text-gold-gradient text-center mb-4" style={headingFont}>
              {locale === 'en' || isTamil ? 'Upagraha Positions' : 'उपग्रह स्थिति'}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-3">
              {upagrahas.map((u, i) => (
                <div key={i} className="rounded-xl bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 p-4 text-center">
                  <p className="text-gold-light font-bold text-sm mb-1" style={bodyFont}>{tl(u.name, locale)}</p>
                  <RashiIconById id={u.sign} size={28} />
                  <p className="text-text-primary text-sm mt-1" style={bodyFont}>{tl(u.signName, locale)} {u.degree}</p>
                  <p className="text-text-secondary/75 text-xs mt-0.5" style={bodyFont}>{tl(u.nakshatra, locale)}</p>
                  <p className="text-text-secondary/70 text-xs mt-1 leading-relaxed">{UPAGRAHA_NOTES[u.name.en]?.[locale === 'en' || isTamil ? 'en' : 'hi'] || ''}</p>
                </div>
              ))}
            </div>
          </div>
        );
      })()}
    </div>
  );
}
