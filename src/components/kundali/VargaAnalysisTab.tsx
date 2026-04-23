'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { tl } from '@/lib/utils/trilingual';
import { lt } from '@/lib/learn/translations';
import KMSG from '@/messages/pages/kundali-inline.json';
import { RASHIS } from '@/lib/constants/rashis';
import { isDevanagariLocale } from '@/lib/utils/locale-fonts';
import { generateVargaTippanni } from '@/lib/tippanni/varga-tippanni';
import type { KundaliData } from '@/types/kundali';
import type { Locale, LocaleText } from '@/types/panchang';

const msg = (key: string, locale: string): string =>
  lt((KMSG as unknown as Record<string, LocaleText>)[key], locale);

export default function VargaAnalysisTab({ kundali, locale, headingFont }: {
  kundali: KundaliData; locale: Locale; headingFont: React.CSSProperties;
}) {
  const synthesis = useMemo(() => generateVargaTippanni(kundali, locale), [kundali, locale]);
  const isHi = isDevanagariLocale(locale);
  const [selectedVarga, setSelectedVarga] = useState<string | null>(null);
  const sC: Record<string, string> = { strong: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20', moderate: 'text-amber-400 bg-amber-500/10 border-amber-500/20', weak: 'text-red-400 bg-red-500/10 border-red-500/20' };
  const sL: Record<string, LocaleText> = { strong: { en: 'Strong', hi: 'बलवान', sa: 'बलवान', mai: 'बलवान', mr: 'बलवान', ta: 'வலிமையான', te: 'బలమైన', bn: 'শক্তিশালী', kn: 'ಬಲಿಷ್ಠ', gu: 'મજબૂત' }, moderate: { en: 'Moderate', hi: 'मध्यम', sa: 'मध्यम', mai: 'मध्यम', mr: 'मध्यम', ta: 'மிதமான', te: 'మోస్తరు', bn: 'মাঝারি', kn: 'ಮಧ್ಯಮ', gu: 'મધ્યમ' }, weak: { en: 'Weak', hi: 'दुर्बल', sa: 'दुर्बल', mai: 'दुर्बल', mr: 'दुर्बल', ta: 'பலவீனம்', te: 'బలహీన', bn: 'দুর্বল', kn: 'ದುರ್ಬಲ', gu: 'નબળું' } };
  const PLANET_NAMES_EN = ['Sun','Moon','Mars','Mercury','Jupiter','Venus','Saturn','Rahu','Ketu'];
  const PLANET_NAMES_HI = ['सूर्य','चन्द्र','मंगल','बुध','गुरु','शुक्र','शनि','राहु','केतु'];
  const selectedInsight = synthesis.vargaInsights.find(v => v.chart === selectedVarga);

  return (
    <div className="space-y-8">
      {/* Overall Synthesis */}
      <div className="rounded-2xl bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 p-6 border border-gold-primary/20 bg-gradient-to-br from-gold-primary/5 to-transparent">
        <h3 className="text-gold-gradient text-xl font-bold mb-4 text-center" style={headingFont}>
          {msg('vargaSynthesisTitle', locale)}
        </h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-4">{tl(synthesis.overall, locale)}</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {synthesis.strongAreas.length > 0 && (
            <div className="p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/15">
              <div className="text-emerald-400 text-xs uppercase tracking-wider font-bold mb-2">{msg('strongAreas', locale)}</div>
              {synthesis.strongAreas.map((a, i) => (
                <div key={i} className="text-emerald-300 text-xs mb-1">+ {tl(a, locale)}</div>
              ))}
            </div>
          )}
          {synthesis.weakAreas.length > 0 && (
            <div className="p-4 rounded-xl bg-red-500/5 border border-red-500/15">
              <div className="text-red-400 text-xs uppercase tracking-wider font-bold mb-2">{msg('needsAttention', locale)}</div>
              {synthesis.weakAreas.map((a, i) => (
                <div key={i} className="text-red-300 text-xs mb-1">- {tl(a, locale)}</div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Clickable strength grid */}
      <div>
        <h3 className="text-gold-light text-lg font-bold mb-2 text-center" style={headingFont}>
          {msg('vargaStrengthOverview', locale)}
        </h3>
        <p className="text-text-secondary/60 text-xs text-center mb-4">
          {msg('clickChartForAnalysis', locale)}
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-7 gap-1.5">
          {synthesis.vargaInsights.map((v, i) => (
            <button key={i}
              onClick={() => setSelectedVarga(prev => prev === v.chart ? null : v.chart)}
              className={`rounded-lg p-2 border text-center transition-all cursor-pointer ${sC[v.strength]} ${selectedVarga === v.chart ? 'ring-2 ring-gold-primary/50 scale-105' : 'hover:scale-[1.03] hover:brightness-110'}`}
            >
              <div className="font-bold text-xs">{v.chart}</div>
              <div className="text-xs text-text-tertiary leading-tight mt-0.5">{tl(v.meaning, locale)}</div>
              <div className="text-xs font-medium mt-0.5">{isHi ? sL[v.strength].hi : sL[v.strength].en}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Selected chart detailed commentary */}
      <AnimatePresence mode="wait">
        {selectedInsight && (
          <motion.div key={selectedInsight.chart}
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
            className="space-y-6"
          >
            <div className="rounded-2xl bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 overflow-hidden">
              {/* Header */}
              <div className={`flex items-center justify-between px-5 py-3 border-b border-gold-primary/10 ${sC[selectedInsight.strength].split(' ').slice(1).join(' ')}`}>
                <div className="flex items-center gap-3">
                  <span className="text-gold-light font-bold text-lg">{selectedInsight.chart}</span>
                  <span className="text-text-secondary text-xs">{tl(selectedInsight.label, locale)}</span>
                </div>
                <span className={`text-xs font-bold px-2 py-0.5 rounded-full border ${sC[selectedInsight.strength]}`}>
                  {isHi ? sL[selectedInsight.strength].hi : sL[selectedInsight.strength].en}
                </span>
              </div>

              <div className="p-5 space-y-4">
                {/* Overall Commentary */}
                <div>
                  <div className="text-gold-dark text-xs uppercase tracking-widest font-bold mb-2">
                    {msg('overallCommentary', locale)}
                  </div>
                  <div className="text-text-secondary text-xs leading-relaxed whitespace-pre-line">
                    {tl(selectedInsight.overallCommentary, locale)}
                  </div>
                </div>

                {/* Key Findings */}
                {selectedInsight.keyFindings.length > 0 && (
                  <div>
                    <div className="text-gold-dark text-xs uppercase tracking-widest font-bold mb-2">
                      {msg('keyFindings', locale)}
                    </div>
                    <div className="space-y-1">
                      {selectedInsight.keyFindings.map((f, j) => (
                        <div key={j} className="text-text-secondary text-xs leading-relaxed flex gap-2">
                          <span className="text-gold-dark mt-0.5 shrink-0">•</span>
                          <span>{tl(f, locale)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Prognosis */}
                <div className="p-4 rounded-xl bg-indigo-500/5 border border-indigo-500/15">
                  <div className="text-indigo-400 text-xs uppercase tracking-widest font-bold mb-2">
                    {msg('yearPrognosis', locale)}
                  </div>
                  <div className="text-text-secondary text-xs leading-relaxed">
                    {tl(selectedInsight.prognosis, locale)}
                  </div>
                </div>

                {/* Deep Analysis — dignity shifts, yogas, promise/delivery */}
                {selectedInsight.deepAnalysis && (() => {
                  const da = selectedInsight.deepAnalysis!;
                  const cc = da.crossCorrelation;
                  const pd = da.promiseDelivery;
                  return (
                    <div className="space-y-4 pt-2">
                      {/* Promise / Delivery Gauge */}
                      {pd && (
                        <div className="rounded-xl bg-white/[0.02] border border-gold-primary/10 p-4">
                          <div className="text-gold-dark text-xs uppercase tracking-widest font-bold mb-3">
                            {isHi ? 'वादा बनाम वितरण' : 'Promise vs Delivery'}
                          </div>
                          <div className="grid grid-cols-2 gap-4 mb-3">
                            <div>
                              <div className="text-text-secondary text-[10px] mb-1">{isHi ? 'D1 वादा' : 'D1 Promise'}</div>
                              <div className="flex items-center gap-2">
                                <div className="flex-1 h-2 rounded-full bg-white/5 overflow-hidden">
                                  <div className="h-full rounded-full bg-gradient-to-r from-blue-600 to-blue-400" style={{ width: `${pd.d1Promise}%` }} />
                                </div>
                                <span className="text-blue-400 text-xs font-bold w-8">{pd.d1Promise}</span>
                              </div>
                            </div>
                            <div>
                              <div className="text-text-secondary text-[10px] mb-1">{isHi ? selectedInsight.chart + ' वितरण' : selectedInsight.chart + ' Delivery'}</div>
                              <div className="flex items-center gap-2">
                                <div className="flex-1 h-2 rounded-full bg-white/5 overflow-hidden">
                                  <div className="h-full rounded-full bg-gradient-to-r from-emerald-600 to-emerald-400" style={{ width: `${pd.dxxDelivery}%` }} />
                                </div>
                                <span className="text-emerald-400 text-xs font-bold w-8">{pd.dxxDelivery}</span>
                              </div>
                            </div>
                          </div>
                          <p className="text-text-secondary/80 text-xs leading-relaxed">
                            {tl(pd.verdict, locale)}
                          </p>
                        </div>
                      )}

                      {/* Dignity Shifts — D1 vs Dxx */}
                      {cc.dignityShifts.length > 0 && (
                        <div className="rounded-xl bg-white/[0.02] border border-gold-primary/10 p-4">
                          <div className="text-gold-dark text-xs uppercase tracking-widest font-bold mb-3">
                            {isHi ? 'D1 → ' + selectedInsight.chart + ' बल परिवर्तन' : 'D1 → ' + selectedInsight.chart + ' Dignity Shifts'}
                          </div>
                          <div className="space-y-2">
                            {cc.dignityShifts.slice(0, 5).map((ds, idx) => {
                              const pName = isHi ? (PLANET_NAMES_HI[ds.planetId] ?? '') : (PLANET_NAMES_EN[ds.planetId] ?? '');
                              const arrow = ds.dxxDignity === 'exalted' || ds.dxxDignity === 'own' ? '↑' : ds.dxxDignity === 'debilitated' ? '↓' : '→';
                              const color = ds.dxxDignity === 'exalted' || ds.dxxDignity === 'own' ? 'text-emerald-400' : ds.dxxDignity === 'debilitated' ? 'text-red-400' : 'text-text-secondary';
                              return (
                                <div key={idx} className="flex items-center gap-2 text-xs">
                                  <span className="text-gold-light font-medium w-14 shrink-0">{pName}</span>
                                  <span className="text-text-secondary/50">{ds.d1Dignity}</span>
                                  <span className={`font-bold ${color}`}>{arrow}</span>
                                  <span className={color}>{ds.dxxDignity}</span>
                                  {ds.isVargottama && <span className="px-1.5 py-0.5 rounded-full bg-gold-primary/20 text-gold-light text-[9px] font-bold">Vgm</span>}
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )}

                      {/* Yogas in this chart */}
                      {cc.yogasInChart.length > 0 && (
                        <div className="rounded-xl bg-white/[0.02] border border-gold-primary/10 p-4">
                          <div className="text-gold-dark text-xs uppercase tracking-widest font-bold mb-3">
                            {isHi ? 'इस चार्ट में योग' : 'Yogas in ' + selectedInsight.chart}
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {cc.yogasInChart.map((y, idx) => (
                              <div key={idx} className="rounded-lg border border-emerald-500/20 bg-emerald-500/5 px-3 py-2">
                                <div className="text-emerald-400 text-xs font-semibold">{y.name}</div>
                                <div className="text-text-secondary/70 text-[10px] mt-0.5">{tl(y.significance, locale)}</div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Dispositor Chain */}
                      {cc.dispositorChain.chain.length > 1 && (
                        <div className="rounded-xl bg-white/[0.02] border border-gold-primary/10 p-4">
                          <div className="text-gold-dark text-xs uppercase tracking-widest font-bold mb-2">
                            {isHi ? 'अधिपति शृंखला' : 'Dispositor Chain'}
                          </div>
                          <div className="flex items-center gap-1.5 text-xs text-text-secondary flex-wrap">
                            {cc.dispositorChain.chain.map((node, idx) => (
                              <span key={idx} className="flex items-center gap-1.5">
                                <span className={`font-medium ${node.planetId === cc.dispositorChain.finalDispositor ? 'text-gold-light' : 'text-text-primary'}`}>
                                  {isHi ? (PLANET_NAMES_HI[node.planetId] ?? '') : (PLANET_NAMES_EN[node.planetId] ?? '')}
                                </span>
                                {idx < cc.dispositorChain.chain.length - 1 && <span className="text-gold-primary/40">→</span>}
                              </span>
                            ))}
                          </div>
                          <p className="text-text-secondary/60 text-[10px] mt-1.5">{tl(cc.dispositorChain.narrative, locale)}</p>
                        </div>
                      )}
                    </div>
                  );
                })()}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

            {/* Deep-dive sections — only shown for the selected chart */}

            {/* D2 Hora */}
            {selectedVarga === 'D2' && (
              <>
      {/* P2-09: D2 Hora Chart — Full Classical Interpretation */}
      {(() => {
        const lagnaSign = kundali.ascendant.sign;
        // In Hora: odd signs (Ar,Ge,Le,Li,Sa,Aq) = Sun's hora; even signs = Moon's hora
        // Planet's Hora sign: degree 0-14.99 → same-sign hora; 15-29.99 → next-sign hora
        // Actually classical rule: Sun hora = Leo (odd signs for first half, even signs for second half)
        // Standard: degree 0-15 of odd sign = Sun; 15-30 = Moon. Even sign = opposite.
        const getHora = (planet: { planet: { id: number }; sign: number; longitude: number; isRetrograde: boolean }): 'sun' | 'moon' => {
          const signIsOdd = planet.sign % 2 === 1; // 1=Ar, 3=Ge etc
          const degInSign = planet.longitude % 30;
          const firstHalf = degInSign < 15;
          // Odd sign first half = Sun hora; second half = Moon hora
          // Even sign first half = Moon hora; second half = Sun hora
          return (signIsOdd && firstHalf) || (!signIsOdd && !firstHalf) ? 'sun' : 'moon';
        };

        const SUN_HORA_RESULTS: Record<number, LocaleText> = {
          0: { en: 'Soul purpose and authority manifest strongly. Father benefits. Government or leadership gains. Right-side body energy is amplified.', hi: 'आत्म उद्देश्य और अधिकार प्रबल। पिता लाभान्वित। सरकार/नेतृत्व से लाभ।', sa: 'आत्म उद्देश्य और अधिकार प्रबल। पिता लाभान्वित। सरकार/नेतृत्व से लाभ।', mai: 'आत्म उद्देश्य और अधिकार प्रबल। पिता लाभान्वित। सरकार/नेतृत्व से लाभ।', mr: 'आत्म उद्देश्य और अधिकार प्रबल। पिता लाभान्वित। सरकार/नेतृत्व से लाभ।', ta: 'ஆன்ம நோக்கமும் அதிகாரமும் வலுவாக வெளிப்படும். தந்தைக்கு நன்மை. அரசு அல்லது தலைமை லாபம். வலது பக்க உடல் ஆற்றல் பெருகும்.', te: 'ఆత్మ ఉద్దేశ్యం మరియు అధికారం బలంగా వ్యక్తమవుతాయి. తండ్రికి ప్రయోజనం. ప్రభుత్వ లేదా నాయకత్వ లాభాలు.', bn: 'আত্মার উদ্দেশ্য ও কর্তৃত্ব দৃঢ়ভাবে প্রকাশ পায়। পিতার উপকার। সরকার বা নেতৃত্বে লাভ।', kn: 'ಆತ್ಮ ಉದ್ದೇಶ ಮತ್ತು ಅಧಿಕಾರ ಬಲವಾಗಿ ವ್ಯಕ್ತವಾಗುತ್ತದೆ. ತಂದೆಗೆ ಲಾಭ. ಸರ್ಕಾರ ಅಥವಾ ನಾಯಕತ್ವ ಲಾಭ.', gu: 'આત્મા ઉદ્દેશ અને સત્તા મજબૂત રીતે પ્રગટ થાય. પિતાને લાભ. સરકાર કે નેતૃત્વ લાભ.' },
          1: { en: 'Mental resources and maternal wealth. Income through public or emotional intelligence. Female gains through Sun hora create ambition.', hi: 'मानसिक संसाधन और मातृ धन। सार्वजनिक बुद्धि से आय।', sa: 'मानसिक संसाधन और मातृ धन। सार्वजनिक बुद्धि से आय।', mai: 'मानसिक संसाधन और मातृ धन। सार्वजनिक बुद्धि से आय।', mr: 'मानसिक संसाधन और मातृ धन। सार्वजनिक बुद्धि से आय।', ta: 'மன வளங்கள் மற்றும் தாய்வழி செல்வம். பொது அல்லது உணர்ச்சி புத்திசாலித்தனத்தின் மூலம் வருமானம்.', te: 'మానసిక వనరులు మరియు మాతృ సంపద. బహిరంగ లేదా భావోద్వేగ బుద్ధి ద్వారా ఆదాయం.', bn: 'মানসিক সম্পদ ও মাতৃসম্পদ। জনসাধারণ বা আবেগজ বুদ্ধির মাধ্যমে আয়।', kn: 'ಮಾನಸಿಕ ಸಂಪನ್ಮೂಲ ಮತ್ತು ತಾಯಿ ಸಂಪತ್ತು. ಸಾರ್ವಜನಿಕ ಅಥವಾ ಭಾವನಾತ್ಮಕ ಬುದ್ಧಿಯ ಮೂಲಕ ಆದಾಯ.', gu: 'માનસિક સંસાધન અને માતૃ સંપત્તિ. જાહેર કે ભાવનાત્મક બુદ્ધિ દ્વારા આવક.' },
          2: { en: 'Earned through courage, real estate, or siblings. Property from masculine effort. Mars energy drives income.', hi: 'साहस, सम्पत्ति या भाई-बहन से धन। मर्दाना प्रयास से सम्पत्ति।', sa: 'साहस, सम्पत्ति या भाई-बहन से धन। मर्दाना प्रयास से सम्पत्ति।', mai: 'साहस, सम्पत्ति या भाई-बहन से धन। मर्दाना प्रयास से सम्पत्ति।', mr: 'साहस, सम्पत्ति या भाई-बहन से धन। मर्दाना प्रयास से सम्पत्ति।', ta: 'தைரியம், ரியல் எஸ்டேட் அல்லது உடன்பிறப்புகள் மூலம் சம்பாதித்தது. ஆண்மை முயற்சியால் சொத்து. செவ்வாய் ஆற்றல் வருமானத்தை இயக்குகிறது.', te: 'ధైర్యం, రియల్ ఎస్టేట్ లేదా తోబుట్టువుల ద్వారా సంపాదన. పురుష ప్రయత్నం ద్వారా ఆస్తి.', bn: 'সাহস, রিয়েল এস্টেট বা ভাইবোনের মাধ্যমে অর্জিত। পুরুষ প্রচেষ্টায় সম্পত্তি।', kn: 'ಧೈರ್ಯ, ರಿಯಲ್ ಎಸ್ಟೇಟ್ ಅಥವಾ ಒಡಹುಟ್ಟಿದವರ ಮೂಲಕ ಗಳಿಕೆ. ಪುರುಷ ಪ್ರಯತ್ನದಿಂದ ಆಸ್ತಿ.', gu: 'સાહસ, રિયલ એસ્ટેટ કે ભાઈ-બહેન દ્વારા કમાણી. પુરુષ પ્રયાસથી સંપત્તિ.' },
          3: { en: 'Intellectual wealth and communication income. Business, media, and trade are strongly supported. Mercury doubles Sun power.', hi: 'बौद्धिक धन और संचार आय। व्यापार, मीडिया दृढ़ता से समर्थित।', sa: 'बौद्धिक धन और संचार आय। व्यापार, मीडिया दृढ़ता से समर्थित।', mai: 'बौद्धिक धन और संचार आय। व्यापार, मीडिया दृढ़ता से समर्थित।', mr: 'बौद्धिक धन और संचार आय। व्यापार, मीडिया दृढ़ता से समर्थित।', ta: 'அறிவுசார் செல்வம் மற்றும் தகவல்தொடர்பு வருமானம். வணிகம், ஊடகம் மற்றும் வர்த்தகம் வலுவாக ஆதரிக்கப்படுகின்றன.', te: 'బౌద్ధిక సంపద మరియు సంభాషణ ఆదాయం. వ్యాపారం, మీడియా మరియు వాణిజ్యం బలంగా మద్దతు పొందుతాయి.', bn: 'বৌদ্ধিক সম্পদ ও যোগাযোগ আয়। ব্যবসা, মিডিয়া ও বাণিজ্য দৃঢ়ভাবে সমর্থিত।', kn: 'ಬೌದ್ಧಿಕ ಸಂಪತ್ತು ಮತ್ತು ಸಂವಹನ ಆದಾಯ. ವ್ಯಾಪಾರ, ಮಾಧ್ಯಮ ಮತ್ತು ವಾಣಿಜ್ಯ ಬಲವಾಗಿ ಬೆಂಬಲಿತ.', gu: 'બૌદ્ધિક સંપત્તિ અને સંવાદ આવક. વ્યાપાર, મીડિયા અને વેપાર મજબૂત ટેકો.' },
          4: { en: 'Wisdom, children, and dharmic wealth. Speculative gains strongly supported. Wealth from Jupiter\'s benevolence here.', hi: 'ज्ञान, संतान और धार्मिक धन। सट्टा लाभ प्रबल।' },
          5: { en: 'Luxury, arts, and relationship wealth. Income through beauty, entertainment, or spouse. Feminine wealth through masculine hora.', hi: 'विलासिता, कला और सम्बन्ध धन। सौन्दर्य/मनोरंजन से आय।', sa: 'विलासिता, कला और सम्बन्ध धन। सौन्दर्य/मनोरंजन से आय।', mai: 'विलासिता, कला और सम्बन्ध धन। सौन्दर्य/मनोरंजन से आय।', mr: 'विलासिता, कला और सम्बन्ध धन। सौन्दर्य/मनोरंजन से आय।', ta: 'ஆடம்பரம், கலைகள் மற்றும் உறவு செல்வம். அழகு, பொழுதுபோக்கு அல்லது துணைவர் மூலம் வருமானம்.', te: 'విలాసం, కళలు మరియు సంబంధ సంపద. అందం, వినోదం లేదా భాగస్వామి ద్వారా ఆదాయం.', bn: 'বিলাসিতা, কলা ও সম্পর্ক সম্পদ। সৌন্দর্য, বিনোদন বা স্ত্রী/স্বামীর মাধ্যমে আয়।', kn: 'ವೈಭವ, ಕಲೆಗಳು ಮತ್ತು ಸಂಬಂಧ ಸಂಪತ್ತು. ಸೌಂದರ್ಯ, ಮನರಂಜನೆ ಅಥವಾ ಸಂಗಾತಿ ಮೂಲಕ ಆದಾಯ.', gu: 'વૈભવ, કળાઓ અને સંબંધ સંપત્તિ. સૌંદર્ય, મનોરંજન કે જીવનસાથી દ્વારા આવક.' },
          6: { en: 'Career and authority-driven income. Discipline and hard work yield Saturn\'s slow-but-certain wealth.', hi: 'कैरियर और अधिकार से आय। अनुशासन और परिश्रम से सतत् धन।' },
          7: { en: 'Unconventional or foreign wealth. Ambition and technology drive income. Rahu intensifies Sun hora.', hi: 'असामान्य या विदेशी धन। महत्वाकांक्षा और प्रौद्योगिकी से आय।', sa: 'असामान्य या विदेशी धन। महत्वाकांक्षा और प्रौद्योगिकी से आय।', mai: 'असामान्य या विदेशी धन। महत्वाकांक्षा और प्रौद्योगिकी से आय।', mr: 'असामान्य या विदेशी धन। महत्वाकांक्षा और प्रौद्योगिकी से आय।', ta: 'வழக்கத்திற்கு மாறான அல்லது வெளிநாட்டு செல்வம். லட்சியமும் தொழில்நுட்பமும் வருமானத்தை இயக்குகின்றன.', te: 'అసాంప్రదాయ లేదా విదేశీ సంపద. ఆకాంక్ష మరియు సాంకేతికత ఆదాయాన్ని నడిపిస్తాయి.', bn: 'অপ্রচলিত বা বিদেশি সম্পদ। উচ্চাকাঙ্ক্ষা ও প্রযুক্তি আয় চালায়।', kn: 'ಅಸಾಂಪ್ರದಾಯಿಕ ಅಥವಾ ವಿದೇಶಿ ಸಂಪತ್ತು. ಮಹತ್ವಾಕಾಂಕ್ಷೆ ಮತ್ತು ತಂತ್ರಜ್ಞಾನ ಆದಾಯವನ್ನು ನಡೆಸುತ್ತದೆ.', gu: 'અપરંપરાગત કે વિદેશી સંપત્તિ. મહત્ત્વાકાંક્ષા અને ટેક્નોલોજી આવક ચલાવે છે.' },
          8: { en: 'Spiritual detachment from material. Ketu in Sun hora = income through knowledge or past-life merit. Intermittent gains.', hi: 'भौतिक से आध्यात्मिक वैराग्य। ज्ञान या पूर्व जन्म के पुण्य से आय।', sa: 'भौतिक से आध्यात्मिक वैराग्य। ज्ञान या पूर्व जन्म के पुण्य से आय।', mai: 'भौतिक से आध्यात्मिक वैराग्य। ज्ञान या पूर्व जन्म के पुण्य से आय।', mr: 'भौतिक से आध्यात्मिक वैराग्य। ज्ञान या पूर्व जन्म के पुण्य से आय।', ta: 'பொருளிலிருந்து ஆன்மிக பற்றின்மை. சூரிய ஹோராவில் கேது = அறிவு அல்லது முன்வினை புண்ணியம் மூலம் வருமானம். இடைவிடாத லாபம்.', te: 'భౌతికం నుండి ఆధ్యాత్మిక వైరాగ్యం. సూర్య హోరలో కేతు = జ్ఞానం లేదా పూర్వజన్మ పుణ్యం ద్వారా ఆదాయం.', bn: 'বৈষয়িক থেকে আধ্যাত্মিক বৈরাগ্য। সূর্য হোরায় কেতু = জ্ঞান বা পূর্বজন্ম পুণ্যের মাধ্যমে আয়।', kn: 'ಭೌತಿಕದಿಂದ ಅಧ್ಯಾತ್ಮಿಕ ವೈರಾಗ್ಯ. ಸೂರ್ಯ ಹೋರಾದಲ್ಲಿ ಕೇತು = ಜ್ಞಾನ ಅಥವಾ ಪೂರ್ವಜನ್ಮ ಪುಣ್ಯದ ಮೂಲಕ ಆದಾಯ.', gu: 'ભૌતિકથી આધ્યાત્મિક વૈરાગ્ય. સૂર્ય હોરામાં કેતુ = જ્ઞાન કે પૂર્વજન્મ પુણ્ય દ્વારા આવક.' },
        };
        const MOON_HORA_RESULTS: Record<number, LocaleText> = {
          0: { en: 'Authority serving others — income through public service or maternal care. Soul wealth through giving. Leadership gains lunar quality (popular, fluctuating).', hi: 'सार्वजनिक सेवा से आय। मातृ देखभाल। नेतृत्व लोकप्रिय पर अस्थिर।', sa: 'सार्वजनिक सेवा से आय। मातृ देखभाल। नेतृत्व लोकप्रिय पर अस्थिर।', mai: 'सार्वजनिक सेवा से आय। मातृ देखभाल। नेतृत्व लोकप्रिय पर अस्थिर।', mr: 'सार्वजनिक सेवा से आय। मातृ देखभाल। नेतृत्व लोकप्रिय पर अस्थिर।', ta: 'மற்றவர்களுக்கு சேவை செய்யும் அதிகாரம் — பொது சேவை அல்லது தாய்வழி பராமரிப்பு மூலம் வருமானம். கொடுப்பதன் மூலம் ஆன்ம செல்வம்.', te: 'ఇతరులకు సేవ చేసే అధికారం — ప్రజాసేవ లేదా మాతృ సంరక్షణ ద్వారా ఆదాయం. ఇచ్చుట ద్వారా ఆత్మ సంపద.', bn: 'অন্যদের সেবায় কর্তৃত্ব — জনসেবা বা মাতৃযত্নের মাধ্যমে আয়। দানের মাধ্যমে আত্মিক সম্পদ।', kn: 'ಇತರರಿಗೆ ಸೇವೆ ಮಾಡುವ ಅಧಿಕಾರ — ಸಾರ್ವಜನಿಕ ಸೇವೆ ಅಥವಾ ತಾಯಿ ಆರೈಕೆ ಮೂಲಕ ಆದಾಯ. ನೀಡುವ ಮೂಲಕ ಆತ್ಮ ಸಂಪತ್ತು.', gu: 'બીજાની સેવામાં સત્તા — જાહેર સેવા કે માતૃ સંભાળ દ્વારા આવક. આપવાથી આત્મ સંપત્તિ.' },
          1: { en: 'Emotional wealth and intuition. Moon in Moon hora = excellent for maternal inheritance, public income, and emotional business. Most powerful Moon placement.', hi: 'भावनात्मक धन और अन्तर्ज्ञान। मातृ विरासत और सार्वजनिक आय के लिए उत्तम।', sa: 'भावनात्मक धन और अन्तर्ज्ञान। मातृ विरासत और सार्वजनिक आय के लिए उत्तम।', mai: 'भावनात्मक धन और अन्तर्ज्ञान। मातृ विरासत और सार्वजनिक आय के लिए उत्तम।', mr: 'भावनात्मक धन और अन्तर्ज्ञान। मातृ विरासत और सार्वजनिक आय के लिए उत्तम।', ta: 'உணர்ச்சி செல்வமும் உள்ளுணர்வும். சந்திர ஹோராவில் சந்திரன் = தாய்வழி வாரிசுரிமை, பொது வருமானம் மற்றும் உணர்ச்சி வணிகத்திற்கு சிறந்தது.', te: 'భావోద్వేగ సంపద మరియు అంతర్దృష్టి. చంద్ర హోరలో చంద్రుడు = మాతృ వారసత్వం, ప్రజా ఆదాయం మరియు భావోద్వేగ వ్యాపారానికి అద్భుతం.', bn: 'আবেগজ সম্পদ ও অন্তর্জ্ঞান। চন্দ্র হোরায় চন্দ্র = মাতৃ উত্তরাধিকার, জন আয় ও আবেগজ ব্যবসায় চমৎকার।', kn: 'ಭಾವನಾತ್ಮಕ ಸಂಪತ್ತು ಮತ್ತು ಅಂತಃಪ್ರಜ್ಞೆ. ಚಂದ್ರ ಹೋರಾದಲ್ಲಿ ಚಂದ್ರ = ತಾಯಿ ಉತ್ತರಾಧಿಕಾರ, ಸಾರ್ವಜನಿಕ ಆದಾಯ ಮತ್ತು ಭಾವನಾತ್ಮಕ ವ್ಯಾಪಾರಕ್ಕೆ ಅತ್ಯುತ್ತಮ.', gu: 'ભાવનાત્મક સંપત્તિ અને અંતર્જ્ઞાન. ચંદ્ર હોરામાં ચંદ્ર = માતૃ વારસો, જાહેર આવક અને ભાવનાત્મક વ્યાપાર માટે ઉત્તમ.' },
          2: { en: 'Property and courage nurtured. Real estate through feminine resources. Siblings support emotionally. Nurturing mother income.', hi: 'सम्पत्ति और साहस का पोषण। स्त्री संसाधनों से अचल सम्पत्ति।', sa: 'सम्पत्ति और साहस का पोषण। स्त्री संसाधनों से अचल सम्पत्ति।', mai: 'सम्पत्ति और साहस का पोषण। स्त्री संसाधनों से अचल सम्पत्ति।', mr: 'सम्पत्ति और साहस का पोषण। स्त्री संसाधनों से अचल सम्पत्ति।', ta: 'சொத்தும் தைரியமும் வளர்க்கப்படுகின்றன. பெண் வளங்கள் மூலம் ரியல் எஸ்டேட். உடன்பிறப்புகள் உணர்ச்சி ரீதியாக ஆதரிக்கின்றனர்.', te: 'ఆస్తి మరియు ధైర్యం పోషించబడతాయి. స్త్రీ వనరుల ద్వారా రియల్ ఎస్టేట్. తోబుట్టువులు భావోద్వేగపరంగా మద్దతు.', bn: 'সম্পত্তি ও সাহস পোষিত। নারী সম্পদের মাধ্যমে রিয়েল এস্টেট। ভাইবোন আবেগের সমর্থন দেয়।', kn: 'ಆಸ್ತಿ ಮತ್ತು ಧೈರ್ಯ ಪೋಷಿಸಲ್ಪಡುತ್ತದೆ. ಸ್ತ್ರೀ ಸಂಪನ್ಮೂಲಗಳ ಮೂಲಕ ರಿಯಲ್ ಎಸ್ಟೇಟ್.', gu: 'સંપત્તિ અને સાહસ પોષાય. સ્ત્રી સંસાધન દ્વારા રિયલ એસ્ટેટ. ભાઈ-બહેન ભાવનાત્મક ટેકો.' },
          3: { en: 'Communication wealth from emotional intelligence. Writing, teaching, counselling. Mercury in Moon hora amplifies empathetic commerce.', hi: 'भावनात्मक बुद्धि से व्यापारिक धन। लेखन, शिक्षण, परामर्श।', sa: 'भावनात्मक बुद्धि से व्यापारिक धन। लेखन, शिक्षण, परामर्श।', mai: 'भावनात्मक बुद्धि से व्यापारिक धन। लेखन, शिक्षण, परामर्श।', mr: 'भावनात्मक बुद्धि से व्यापारिक धन। लेखन, शिक्षण, परामर्श।', ta: 'உணர்ச்சி புத்திசாலித்தனத்திலிருந்து தகவல்தொடர்பு செல்வம். எழுத்து, கற்பித்தல், ஆலோசனை.', te: 'భావోద్వేగ బుద్ధి నుండి సంభాషణ సంపద. రాయడం, బోధించడం, సలహా ఇవ్వడం.', bn: 'আবেগজ বুদ্ধি থেকে যোগাযোগ সম্পদ। লেখা, শেখানো, পরামর্শ দেওয়া।', kn: 'ಭಾವನಾತ್ಮಕ ಬುದ್ಧಿಯಿಂದ ಸಂವಹನ ಸಂಪತ್ತು. ಬರವಣಿಗೆ, ಬೋಧನೆ, ಸಮಾಲೋಚನೆ.', gu: 'ભાવનાત્મક બુદ્ધિથી સંવાદ સંપત્તિ. લેખન, શિક્ષણ, પરામર્શ.' },
          4: { en: 'Dharmic wealth through emotional wisdom. Children, charity, spiritual growth. Jupiter in Moon hora = abundant nurturing wealth.', hi: 'धार्मिक धन। बच्चे, दान, आध्यात्मिक विकास। प्रचुर पोषण धन।', sa: 'धार्मिक धन। बच्चे, दान, आध्यात्मिक विकास। प्रचुर पोषण धन।', mai: 'धार्मिक धन। बच्चे, दान, आध्यात्मिक विकास। प्रचुर पोषण धन।', mr: 'धार्मिक धन। बच्चे, दान, आध्यात्मिक विकास। प्रचुर पोषण धन।', ta: 'உணர்ச்சி ஞானத்தின் மூலம் தர்ம செல்வம். குழந்தைகள், தர்மம், ஆன்மிக வளர்ச்சி.', te: 'భావోద్వేగ జ్ఞానం ద్వారా ధార్మిక సంపద. సంతానం, దానం, ఆధ్యాత్మిక అభివృద్ధి.', bn: 'আবেগজ প্রজ্ঞার মাধ্যমে ধর্মীয় সম্পদ। সন্তান, দান, আধ্যাত্মিক বিকাশ।', kn: 'ಭಾವನಾತ್ಮಕ ಜ್ಞಾನದ ಮೂಲಕ ಧಾರ್ಮಿಕ ಸಂಪತ್ತು. ಮಕ್ಕಳು, ದಾನ, ಅಧ್ಯಾತ್ಮಿಕ ಬೆಳವಣಿಗೆ.', gu: 'ભાવનાત્મક જ્ઞાન દ્વારા ધાર્મિક સંપત્તિ. સંતાન, દાન, આધ્યાત્મિક વિકાસ.' },
          5: { en: 'Love, beauty, and relationship wealth fully expressed. Venus in Moon hora = supreme luxury, arts, and marital wealth. Most natural placement for Venus.', hi: 'प्रेम, सौन्दर्य और सम्बन्ध धन पूर्ण। विलासिता, कला और वैवाहिक धन।', sa: 'प्रेम, सौन्दर्य और सम्बन्ध धन पूर्ण। विलासिता, कला और वैवाहिक धन।', mai: 'प्रेम, सौन्दर्य और सम्बन्ध धन पूर्ण। विलासिता, कला और वैवाहिक धन।', mr: 'प्रेम, सौन्दर्य और सम्बन्ध धन पूर्ण। विलासिता, कला और वैवाहिक धन।', ta: 'காதல், அழகு மற்றும் உறவு செல்வம் முழுமையாக வெளிப்படுகிறது. சந்திர ஹோராவில் சுக்கிரன் = உயர்ந்த ஆடம்பரம், கலைகள் மற்றும் திருமண செல்வம்.', te: 'ప్రేమ, అందం మరియు సంబంధ సంపద పూర్తిగా వ్యక్తమవుతుంది. చంద్ర హోరలో శుక్రుడు = అత్యున్నత విలాసం, కళలు మరియు వివాహ సంపద.', bn: 'প্রেম, সৌন্দর্য ও সম্পর্ক সম্পদ পূর্ণরূপে প্রকাশিত। চন্দ্র হোরায় শুক্র = সর্বোচ্চ বিলাসিতা, কলা ও বৈবাহিক সম্পদ।', kn: 'ಪ್ರೇಮ, ಸೌಂದರ್ಯ ಮತ್ತು ಸಂಬಂಧ ಸಂಪತ್ತು ಪೂರ್ಣವಾಗಿ ವ್ಯಕ್ತವಾಗುತ್ತದೆ. ಚಂದ್ರ ಹೋರಾದಲ್ಲಿ ಶುಕ್ರ = ಅತ್ಯುನ್ನತ ವೈಭವ, ಕಲೆಗಳು ಮತ್ತು ವೈವಾಹಿಕ ಸಂಪತ್ತು.', gu: 'પ્રેમ, સૌંદર્ય અને સંબંધ સંપત્તિ સંપૂર્ણ રીતે વ્યક્ત. ચંદ્ર હોરામાં શુક્ર = ઉત્કૃષ્ટ વૈભવ, કળા અને વૈવાહિક સંપત્તિ.' },
          6: { en: 'Disciplined earning through persistence. Saturn in Moon hora = slow, consistent wealth through service, farming, or mass industries.', hi: 'दृढ़ता से अनुशासित कमाई। सेवा, कृषि या जन उद्योग से धन।', sa: 'दृढ़ता से अनुशासित कमाई। सेवा, कृषि या जन उद्योग से धन।', mai: 'दृढ़ता से अनुशासित कमाई। सेवा, कृषि या जन उद्योग से धन।', mr: 'दृढ़ता से अनुशासित कमाई। सेवा, कृषि या जन उद्योग से धन।', ta: 'விடாமுயற்சி மூலம் ஒழுக்கமான சம்பாத்தியம். சந்திர ஹோராவில் சனி = சேவை, விவசாயம் அல்லது பெருந்தொழில்கள் மூலம் மெதுவான, நிலையான செல்வம்.', te: 'పట్టుదల ద్వారా క్రమశిక్షణాబద్ధమైన సంపాదన. చంద్ర హోరలో శని = సేవ, వ్యవసాయం లేదా భారీ పరిశ్రమల ద్వారా నెమ్మదిగా, స్థిరంగా సంపద.', bn: 'অধ্যবসায়ের মাধ্যমে শৃঙ্খলাবদ্ধ আয়। চন্দ্র হোরায় শনি = সেবা, কৃষি বা গণশিল্পের মাধ্যমে ধীর, স্থিতিশীল সম্পদ।', kn: 'ಛಲದಿಂದ ಶಿಸ್ತುಬದ್ಧ ಗಳಿಕೆ. ಚಂದ್ರ ಹೋರಾದಲ್ಲಿ ಶನಿ = ಸೇವೆ, ಕೃಷಿ ಅಥವಾ ಸಮೂಹ ಉದ್ಯಮಗಳ ಮೂಲಕ ನಿಧಾನ, ಸ್ಥಿರ ಸಂಪತ್ತು.', gu: 'ખંત દ્વારા શિસ્તબદ્ધ કમાણી. ચંદ્ર હોરામાં શનિ = સેવા, ખેતી કે વિશાળ ઉદ્યોગ દ્વારા ધીમી, સ્થિર સંપત્તિ.' },
          7: { en: 'Foreign or unconventional income. Rahu in Moon hora = wealthy through international dealings, technology, or unusual means. Fluctuating but large.', hi: 'विदेशी या असामान्य आय। अंतर्राष्ट्रीय व्यापार या प्रौद्योगिकी से बड़ा धन।', sa: 'विदेशी या असामान्य आय। अंतर्राष्ट्रीय व्यापार या प्रौद्योगिकी से बड़ा धन।', mai: 'विदेशी या असामान्य आय। अंतर्राष्ट्रीय व्यापार या प्रौद्योगिकी से बड़ा धन।', mr: 'विदेशी या असामान्य आय। अंतर्राष्ट्रीय व्यापार या प्रौद्योगिकी से बड़ा धन।', ta: 'வெளிநாட்டு அல்லது வழக்கத்திற்கு மாறான வருமானம். சந்திர ஹோராவில் ராகு = சர்வதேச வர்த்தகம், தொழில்நுட்பம் அல்லது அசாதாரண வழிகள் மூலம் செல்வம்.', te: 'విదేశీ లేదా అసాంప్రదాయ ఆదాయం. చంద్ర హోరలో రాహు = అంతర్జాతీయ వ్యాపారాలు, సాంకేతికత లేదా అసాధారణ మార్గాల ద్వారా సంపద.', bn: 'বিদেশি বা অপ্রচলিত আয়। চন্দ্র হোরায় রাহু = আন্তর্জাতিক লেনদেন, প্রযুক্তি বা অস্বাভাবিক মাধ্যমে সম্পদ।', kn: 'ವಿದೇಶಿ ಅಥವಾ ಅಸಾಂಪ್ರದಾಯಿಕ ಆದಾಯ. ಚಂದ್ರ ಹೋರಾದಲ್ಲಿ ರಾಹು = ಅಂತಾರಾಷ್ಟ್ರೀಯ ವ್ಯವಹಾರ, ತಂತ್ರಜ್ಞಾನ ಅಥವಾ ಅಸಾಮಾನ್ಯ ಮಾರ್ಗಗಳ ಮೂಲಕ ಸಂಪತ್ತು.', gu: 'વિદેશી કે અપરંપરાગત આવક. ચંદ્ર હોરામાં રાહુ = આંતરરાષ્ટ્રીય વ્યવહાર, ટેક્નોલોજી કે અસામાન્ય માર્ગ દ્વારા સંપત્તિ.' },
          8: { en: 'Ketu in Moon hora = spiritual renunciation of material. Gains through healing, meditation, or moksha-oriented work. Minimal material attachment.', hi: 'आध्यात्मिक वैराग्य। उपचार, ध्यान से आय। भौतिक आसक्ति न्यूनतम।', sa: 'आध्यात्मिक वैराग्य। उपचार, ध्यान से आय। भौतिक आसक्ति न्यूनतम।', mai: 'आध्यात्मिक वैराग्य। उपचार, ध्यान से आय। भौतिक आसक्ति न्यूनतम।', mr: 'आध्यात्मिक वैराग्य। उपचार, ध्यान से आय। भौतिक आसक्ति न्यूनतम।', ta: 'சந்திர ஹோராவில் கேது = பொருளின் ஆன்மிக துறப்பு. குணப்படுத்துதல், தியானம் அல்லது மோட்ச சார்ந்த பணி மூலம் லாபம்.', te: 'చంద్ర హోరలో కేతు = భౌతిక వైరాగ్యం. వైద్యం, ధ్యానం లేదా మోక్ష ఆధారిత పని ద్వారా లాభం.', bn: 'চন্দ্র হোরায় কেতু = বৈষয়িকের আধ্যাত্মিক ত্যাগ। নিরাময়, ধ্যান বা মোক্ষমুখী কাজের মাধ্যমে লাভ।', kn: 'ಚಂದ್ರ ಹೋರಾದಲ್ಲಿ ಕೇತು = ಭೌತಿಕದ ಅಧ್ಯಾತ್ಮಿಕ ತ್ಯಾಗ. ಗುಣಪಡಿಸುವಿಕೆ, ಧ್ಯಾನ ಅಥವಾ ಮೋಕ್ಷ ಆಧಾರಿತ ಕೆಲಸದ ಮೂಲಕ ಲಾಭ.', gu: 'ચંદ્ર હોરામાં કેતુ = ભૌતિકનો આધ્યાત્મિક ત્યાગ. ઉપચાર, ધ્યાન કે મોક્ષલક્ષી કાર્ય દ્વારા લાભ.' },
        };

        const planetHoras = kundali.planets.map(p => ({
          planet: p,
          hora: getHora(p),
          interpretation: getHora(p) === 'sun' ? SUN_HORA_RESULTS[p.planet.id] : MOON_HORA_RESULTS[p.planet.id],
        }));

        const sunHoraCount = planetHoras.filter(ph => ph.hora === 'sun').length;
        const moonHoraCount = planetHoras.filter(ph => ph.hora === 'moon').length;
        // Wealth timing: planet with most planets in its hora rules
        const dominantHora = sunHoraCount >= moonHoraCount ? 'sun' : 'moon';

        return (
          <div className="rounded-2xl bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-amber-500/20 p-6">
            <h3 className="text-gold-gradient text-xl font-bold mb-1 text-center" style={headingFont}>
              {msg('d2HoraTitle', locale)}
            </h3>
            <p className="text-text-secondary/70 text-xs text-center mb-5" style={isHi ? { fontFamily: 'var(--font-devanagari-body)' } : undefined}>
              {msg('horaChartDesc', locale)}
            </p>
            {/* Dominant Hora */}
            <div className={`rounded-xl p-4 mb-4 text-center border ${dominantHora === 'sun' ? 'bg-amber-500/10 border-amber-500/25' : 'bg-blue-500/10 border-blue-500/25'}`}>
              <div className={`font-bold text-lg mb-1 ${dominantHora === 'sun' ? 'text-amber-300' : 'text-blue-300'}`} style={headingFont}>
                {dominantHora === 'sun'
                  ? (msg('sunHoraDominant', locale))
                  : (msg('moonHoraDominant', locale))}
              </div>
              <p className="text-text-secondary/70 text-xs" style={isHi ? { fontFamily: 'var(--font-devanagari-body)' } : undefined}>
                {dominantHora === 'sun'
                  ? (msg('wealthSunHora', locale))
                  : (msg('wealthMoonHora', locale))}
              </p>
            </div>
            {/* Planet grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {planetHoras.map((ph, i) => (
                <div key={i} className={`rounded-xl p-3 border ${ph.hora === 'sun' ? 'border-amber-500/15 bg-amber-500/5' : 'border-blue-500/15 bg-blue-500/5'}`}>
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className={`text-xs font-bold px-1.5 py-0.5 rounded ${ph.hora === 'sun' ? 'bg-amber-500/20 text-amber-300' : 'bg-blue-500/20 text-blue-300'}`}>
                      {ph.hora === 'sun' ? (msg('sunLabel', locale)) : (msg('moonLabel', locale))}
                    </span>
                    <span className="text-gold-light font-semibold text-sm" style={headingFont}>{ph.planet.planet.name[locale as Locale] || ph.planet.planet.name.en}</span>
                    <span className="text-text-secondary/65 text-xs">H{ph.planet.house} · {ph.planet.signName[locale as Locale] || ph.planet.signName.en}</span>
                  </div>
                  {ph.interpretation && (
                    <p className="text-text-secondary/75 text-xs leading-relaxed" style={isHi ? { fontFamily: 'var(--font-devanagari-body)' } : undefined}>
                      {ph.interpretation[msg('localeKey', locale)]}
                    </p>
                  )}
                </div>
              ))}
            </div>
            <p className="text-text-secondary/55 text-xs text-center mt-4">
              {tl({ en: `Sun Hora: ${sunHoraCount} planets | Moon Hora: ${moonHoraCount} planets | Lagna: ${RASHIS[lagnaSign-1]?.name?.en || lagnaSign}`, hi: `सूर्य होरा: ${sunHoraCount} ग्रह | चन्द्र होरा: ${moonHoraCount} ग्रह | लग्न राशि: ${RASHIS[lagnaSign-1]?.name?.hi || lagnaSign}`, sa: `सूर्य होरा: ${sunHoraCount} ग्रह | चन्द्र होरा: ${moonHoraCount} ग्रह | लग्न राशि: ${RASHIS[lagnaSign-1]?.name?.hi || lagnaSign}` }, locale)}
            </p>
          </div>
        );
      })()}
              </>
            )}

            {/* D9 Navamsha */}
            {selectedVarga === 'D9' && kundali.divisionalCharts?.D9 && (() => {
        const d9 = kundali.divisionalCharts.D9;
        const d9Asc = d9.ascendantSign;
        const d9AscName = RASHIS[(d9Asc - 1) % 12]?.name;
        const d1Asc = kundali.ascendant.sign;
        const isVargottamaLagna = d9Asc === d1Asc;

        // Map planets to their D9 sign
        const planetD9 = kundali.planets.map(p => {
          let d9Sign = 0;
          for (let h = 0; h < 12; h++) {
            if (d9.houses[h]?.includes(p.planet.id)) { d9Sign = ((d9Asc - 1 + h) % 12) + 1; break; }
          }
          const isVgm = d9Sign === p.sign;
          return { planet: p, d9Sign, isVargottama: isVgm };
        });

        const D9_PLANET_MEANING: Record<number, LocaleText> = {
          0: { en: 'Soul purpose and dharma — how your inner authority and father-karma truly manifest after maturity.', hi: 'आत्मा का उद्देश्य और धर्म — आपका आंतरिक अधिकार और पिता-कर्म परिपक्वता के बाद कैसे प्रकट होता है।', sa: 'आत्मा का उद्देश्य और धर्म — आपका आंतरिक अधिकार और पिता-कर्म परिपक्वता के बाद कैसे प्रकट होता है।', mai: 'आत्मा का उद्देश्य और धर्म — आपका आंतरिक अधिकार और पिता-कर्म परिपक्वता के बाद कैसे प्रकट होता है।', mr: 'आत्मा का उद्देश्य और धर्म — आपका आंतरिक अधिकार और पिता-कर्म परिपक्वता के बाद कैसे प्रकट होता है।', ta: 'ஆன்ம நோக்கமும் தர்மமும் — உங்கள் உள் அதிகாரமும் தந்தை-கர்மமும் முதிர்ச்சிக்குப் பின் உண்மையில் எவ்வாறு வெளிப்படுகின்றன.', te: 'ఆత్మ ఉద్దేశ్యం మరియు ధర్మం — మీ అంతర అధికారం మరియు తండ్రి-కర్మ పరిపక్వత తర్వాత నిజంగా ఎలా వ్యక్తమవుతాయి.', bn: 'আত্মার উদ্দেশ্য ও ধর্ম — আপনার অভ্যন্তরীণ কর্তৃত্ব ও পিতৃকর্ম পরিপক্বতার পর কীভাবে প্রকাশ পায়।', kn: 'ಆತ್ಮ ಉದ್ದೇಶ ಮತ್ತು ಧರ್ಮ — ನಿಮ್ಮ ಆಂತರಿಕ ಅಧಿಕಾರ ಮತ್ತು ತಂದೆ-ಕರ್ಮ ಪಕ್ವತೆಯ ನಂತರ ನಿಜವಾಗಿ ಹೇಗೆ ವ್ಯಕ್ತವಾಗುತ್ತದೆ.', gu: 'આત્મા ઉદ્દેશ અને ધર્મ — તમારી આંતરિક સત્તા અને પિતા-કર્મ પરિપક્વતા પછી ખરેખર કેવી રીતે પ્રગટ થાય.' },
          1: { en: 'Inner emotional nature — how your mind and feelings truly operate beneath the surface. Spouse\'s emotional quality.', hi: 'आंतरिक भावनात्मक स्वभाव — मन और भावनाएं सतह के नीचे कैसे कार्य करती हैं। जीवनसाथी का भावनात्मक गुण।' },
          2: { en: 'Courage and initiative in marriage/dharma — how drive and energy express in partnerships and spiritual pursuits.', hi: 'विवाह/धर्म में साहस और पहल — भागीदारी और आध्यात्मिक साधना में ऊर्जा की अभिव्यक्ति।', sa: 'विवाह/धर्म में साहस और पहल — भागीदारी और आध्यात्मिक साधना में ऊर्जा की अभिव्यक्ति।', mai: 'विवाह/धर्म में साहस और पहल — भागीदारी और आध्यात्मिक साधना में ऊर्जा की अभिव्यक्ति।', mr: 'विवाह/धर्म में साहस और पहल — भागीदारी और आध्यात्मिक साधना में ऊर्जा की अभिव्यक्ति।', ta: 'திருமணம்/தர்மத்தில் தைரியமும் முன்முயற்சியும் — கூட்டு மற்றும் ஆன்மிக முயற்சிகளில் உந்துதலும் ஆற்றலும் எவ்வாறு வெளிப்படுகின்றன.', te: 'వివాహం/ధర్మంలో ధైర్యం మరియు చొరవ — భాగస్వామ్యాలు మరియు ఆధ్యాత్మిక కార్యక్రమాలలో ఉత్తేజం మరియు శక్తి ఎలా వ్యక్తమవుతాయి.', bn: 'বিবাহ/ধর্মে সাহস ও উদ্যোগ — অংশীদারিত্ব ও আধ্যাত্মিক সাধনায় চালনা ও শক্তি কীভাবে প্রকাশ পায়।', kn: 'ವಿವಾಹ/ಧರ್ಮದಲ್ಲಿ ಧೈರ್ಯ ಮತ್ತು ಉದ್ಯಮಶೀಲತೆ — ಪಾಲುದಾರಿಕೆ ಮತ್ತು ಅಧ್ಯಾತ್ಮಿಕ ಸಾಧನೆಯಲ್ಲಿ ಚಾಲನೆ ಮತ್ತು ಶಕ್ತಿ ಹೇಗೆ ವ್ಯಕ್ತವಾಗುತ್ತದೆ.', gu: 'લગ્ન/ધર્મમાં સાહસ અને પહેલ — ભાગીદારી અને આધ્યાત્મિક પ્રયાસોમાં ઉત્સાહ અને શક્તિ કેવી રીતે વ્યક્ત થાય.' },
          3: { en: 'Communication in relationships — how intellect and expression function in marriage and spiritual life.', hi: 'रिश्तों में संवाद — विवाह और आध्यात्मिक जीवन में बुद्धि और अभिव्यक्ति कैसे कार्य करती है।', sa: 'रिश्तों में संवाद — विवाह और आध्यात्मिक जीवन में बुद्धि और अभिव्यक्ति कैसे कार्य करती है।', mai: 'रिश्तों में संवाद — विवाह और आध्यात्मिक जीवन में बुद्धि और अभिव्यक्ति कैसे कार्य करती है।', mr: 'रिश्तों में संवाद — विवाह और आध्यात्मिक जीवन में बुद्धि और अभिव्यक्ति कैसे कार्य करती है।', ta: 'உறவுகளில் தகவல்தொடர்பு — திருமணம் மற்றும் ஆன்மிக வாழ்க்கையில் புத்தியும் வெளிப்பாடும் எவ்வாறு செயல்படுகின்றன.', te: 'సంబంధాలలో సంభాషణ — వివాహం మరియు ఆధ్యాత్మిక జీవితంలో బుద్ధి మరియు వ్యక్తీకరణ ఎలా పనిచేస్తాయి.', bn: 'সম্পর্কে যোগাযোগ — বিবাহ ও আধ্যাত্মিক জীবনে বুদ্ধি ও প্রকাশ কীভাবে কাজ করে।', kn: 'ಸಂಬಂಧಗಳಲ್ಲಿ ಸಂವಹನ — ವಿವಾಹ ಮತ್ತು ಅಧ್ಯಾತ್ಮಿಕ ಜೀವನದಲ್ಲಿ ಬುದ್ಧಿ ಮತ್ತು ಅಭಿವ್ಯಕ್ತಿ ಹೇಗೆ ಕಾರ್ಯನಿರ್ವಹಿಸುತ್ತದೆ.', gu: 'સંબંધોમાં સંવાદ — લગ્ન અને આધ્યાત્મિક જીવનમાં બુદ્ધિ અને અભિવ્યક્તિ કેવી રીતે કાર્ય કરે.' },
          4: { en: 'Wisdom and dharma — Jupiter\'s D9 placement is crucial for spiritual evolution, children\'s destiny, and guru connections.', hi: 'ज्ञान और धर्म — गुरु की D9 स्थिति आध्यात्मिक विकास, संतान भाग्य और गुरु संबंध के लिए महत्वपूर्ण।' },
          5: { en: 'Marriage quality — Venus\'s D9 sign is the PRIMARY indicator of spouse nature, marital happiness, and partnership quality.', hi: 'विवाह गुणवत्ता — शुक्र की D9 राशि जीवनसाथी के स्वभाव, वैवाहिक सुख और साझेदारी की प्राथमिक सूचक है।' },
          6: { en: 'Karmic discipline in relationships — how Saturn\'s lessons manifest in marriage and dharmic responsibilities.', hi: 'रिश्तों में कार्मिक अनुशासन — शनि के पाठ विवाह और धार्मिक जिम्मेदारियों में कैसे प्रकट होते हैं।' },
          7: { en: 'Obsessive desires in partnerships — Rahu\'s D9 sign shows what you crave most in relationships and spiritual path.', hi: 'साझेदारी में तीव्र इच्छा — राहु की D9 राशि बताती है कि रिश्तों और आध्यात्मिक मार्ग में आप सबसे अधिक क्या चाहते हैं।' },
          8: { en: 'Spiritual detachment — Ketu\'s D9 placement shows where past-life mastery exists and what you naturally release in relationships.', hi: 'आध्यात्मिक वैराग्य — केतु की D9 स्थिति पूर्वजन्म की महारत और रिश्तों में स्वाभाविक विरक्ति दर्शाती है।' },
        };

        const DIGNITY_IN_D9: Record<string, LocaleText> = {
          exalted: { en: 'Exalted in D9 — this planet\'s marriage/dharma results are exceptionally strong. Its promises in D1 are confirmed and amplified.', hi: 'D9 में उच्च — इस ग्रह के विवाह/धर्म परिणाम असाधारण रूप से बलवान। D1 के वादे निश्चित और प्रवर्धित।' },
          own: { en: 'Own sign in D9 — comfortable and natural expression in marriage/dharma. Reliable, self-sufficient results.', hi: 'D9 में स्वगृह — विवाह/धर्म में सहज और प्राकृतिक अभिव्यक्ति। विश्वसनीय, आत्मनिर्भर परिणाम।', sa: 'D9 में स्वगृह — विवाह/धर्म में सहज और प्राकृतिक अभिव्यक्ति। विश्वसनीय, आत्मनिर्भर परिणाम।', mai: 'D9 में स्वगृह — विवाह/धर्म में सहज और प्राकृतिक अभिव्यक्ति। विश्वसनीय, आत्मनिर्भर परिणाम।', mr: 'D9 में स्वगृह — विवाह/धर्म में सहज और प्राकृतिक अभिव्यक्ति। विश्वसनीय, आत्मनिर्भर परिणाम।', ta: 'நவாம்சத்தில் சொந்த ராசி — திருமணம்/தர்மத்தில் வசதியான இயல்பான வெளிப்பாடு. நம்பகமான, தன்னிறைவான பலன்கள்.', te: 'D9లో స్వరాశి — వివాహం/ధర్మంలో సౌకర్యవంతమైన సహజ వ్యక్తీకరణ. నమ్మదగిన, స్వయం సమృద్ధ ఫలితాలు.', bn: 'D9তে স্বরাশি — বিবাহ/ধর্মে স্বাচ্ছন্দ্যময় স্বাভাবিক প্রকাশ। নির্ভরযোগ্য, স্বয়ংসম্পূর্ণ ফলাফল।', kn: 'D9ರಲ್ಲಿ ಸ್ವರಾಶಿ — ವಿವಾಹ/ಧರ್ಮದಲ್ಲಿ ಆರಾಮದಾಯಕ ಸ್ವಾಭಾವಿಕ ಅಭಿವ್ಯಕ್ತಿ. ವಿಶ್ವಾಸಾರ್ಹ, ಸ್ವಾವಲಂಬಿ ಫಲಿತಾಂಶ.', gu: 'D9માં સ્વરાશિ — લગ્ન/ધર્મમાં આરામદાયક કુદરતી અભિવ્યક્તિ. ભરોસાપાત્ર, સ્વનિર્ભર પરિણામ.' },
          debilitated: { en: 'Debilitated in D9 — this planet\'s marriage/dharma results face challenges. May need Neecha Bhanga or remedies to unlock potential.', hi: 'D9 में नीच — विवाह/धर्म में चुनौतियां। नीच भंग या उपायों से क्षमता मुक्त हो सकती है।' },
          vargottama: { en: 'Vargottama — same sign in D1 and D9. Considered equal to exaltation strength. This planet\'s results are doubly confirmed.', hi: 'वर्गोत्तम — D1 और D9 में एक ही राशि। उच्च बल के समान। इस ग्रह के परिणाम दोहरे निश्चित।' },
        };

        const EXALTATION_SIGNS: Record<number, number> = { 0: 1, 1: 2, 2: 10, 3: 6, 4: 4, 5: 12, 6: 7 };
        const DEBILITATION_SIGNS: Record<number, number> = { 0: 7, 1: 8, 2: 4, 3: 12, 4: 10, 5: 6, 6: 1 };
        const OWN_SIGNS: Record<number, number[]> = { 0: [5], 1: [4], 2: [1, 8], 3: [3, 6], 4: [9, 12], 5: [2, 7], 6: [10, 11] };

        function getDignity(pid: number, sign: number, isVgm: boolean): string | null {
          if (isVgm) return 'vargottama';
          if (EXALTATION_SIGNS[pid] === sign) return 'exalted';
          if (DEBILITATION_SIGNS[pid] === sign) return 'debilitated';
          if (OWN_SIGNS[pid]?.includes(sign)) return 'own';
          return null;
        }

        return (
          <div className="rounded-2xl bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-purple-500/20 p-6 mt-8">
            <h3 className="text-gold-gradient text-xl font-bold mb-1 text-center" style={headingFont}>
              {msg('d9NavamshaTitle', locale)}
            </h3>
            <p className="text-text-secondary/70 text-xs text-center mb-5">
              {msg('navamshaDesc', locale)}
            </p>

            {/* D9 Lagna */}
            <div className={`rounded-xl p-4 mb-4 text-center border ${isVargottamaLagna ? 'bg-emerald-500/10 border-emerald-500/25' : 'bg-purple-500/10 border-purple-500/25'}`}>
              <div className={`font-bold text-lg mb-1 ${isVargottamaLagna ? 'text-emerald-300' : 'text-purple-300'}`} style={headingFont}>
                {msg('d9Ascendant', locale)}{d9AscName?.[locale] || d9AscName?.en}
              </div>
              <p className="text-text-secondary/70 text-xs">
                {isVargottamaLagna
                  ? (msg('vargottamaLagna', locale))
                  : tl({ en: `D1 Ascendant ${RASHIS[(d1Asc-1)%12]?.name?.en} shifts to D9 ${d9AscName?.en} — this is your inner self, which becomes dominant especially after age 36.`, hi: `D1 लग्न ${RASHIS[(d1Asc-1)%12]?.name?.hi} से D9 लग्न ${d9AscName?.hi} में — यह आपका आंतरिक स्व है, जो विशेषतः 36 वर्ष के बाद प्रमुख होता है।`, sa: `D1 लग्न ${RASHIS[(d1Asc-1)%12]?.name?.hi} से D9 लग्न ${d9AscName?.hi} में — यह आपका आंतरिक स्व है, जो विशेषतः 36 वर्ष के बाद प्रमुख होता है।` }, locale)}
              </p>
            </div>

            {/* Planet grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {planetD9.map((pd, i) => {
                const pid = pd.planet.planet.id;
                const d9SignName = RASHIS[(pd.d9Sign - 1) % 12]?.name;
                const dignity = getDignity(pid, pd.d9Sign, pd.isVargottama);
                const dignityInfo = dignity ? DIGNITY_IN_D9[dignity] : null;
                const meaning = D9_PLANET_MEANING[pid];

                return (
                  <div key={i} className={`rounded-xl p-3 border ${
                    dignity === 'exalted' || dignity === 'vargottama' ? 'border-emerald-500/15 bg-emerald-500/5' :
                    dignity === 'debilitated' ? 'border-red-500/15 bg-red-500/5' :
                    dignity === 'own' ? 'border-sky-500/15 bg-sky-500/5' :
                    'border-purple-500/15 bg-purple-500/5'
                  }`}>
                    <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                      <span className="text-gold-light font-semibold text-sm" style={headingFont}>{pd.planet.planet.name[locale] || pd.planet.planet.name.en}</span>
                      <span className="text-text-secondary/65 text-xs">
                        {msg('d9Sign', locale)} {d9SignName?.[locale] || d9SignName?.en}
                      </span>
                      {dignity && (
                        <span className={`text-xs font-bold px-1.5 py-0.5 rounded ${
                          dignity === 'exalted' ? 'bg-emerald-500/20 text-emerald-300' :
                          dignity === 'vargottama' ? 'bg-gold-primary/20 text-gold-light' :
                          dignity === 'own' ? 'bg-sky-500/20 text-sky-300' :
                          'bg-red-500/20 text-red-300'
                        }`}>
                          {dignity === 'vargottama' ? 'Vgm' : dignity === 'exalted' ? (msg('exaltedLabel', locale)) : dignity === 'own' ? (msg('ownLabel', locale)) : (msg('debilLabel', locale))}
                        </span>
                      )}
                    </div>
                    {meaning && (
                      <p className="text-text-secondary/75 text-xs leading-relaxed">{meaning[msg('localeKey', locale)]}</p>
                    )}
                    {dignityInfo && (
                      <p className={`text-xs leading-relaxed mt-1 italic ${
                        dignity === 'exalted' || dignity === 'vargottama' ? 'text-emerald-400/80' :
                        dignity === 'debilitated' ? 'text-red-400/80' : 'text-sky-400/80'
                      }`}>{dignityInfo[msg('localeKey', locale)]}</p>
                    )}
                  </div>
                );
              })}
            </div>

            {/* 7th house of D9 = spouse nature */}
            {(() => {
              const h7planets = d9.houses[6] || [];
              const h7Sign = ((d9Asc - 1 + 6) % 12) + 1;
              const h7SignName = RASHIS[(h7Sign - 1) % 12]?.name;
              return (
                <div className="mt-4 p-4 rounded-xl bg-purple-500/5 border border-purple-500/15">
                  <div className="text-purple-300 text-xs uppercase tracking-wider font-bold mb-2">
                    {msg('d9SpouseTitle', locale)}
                  </div>
                  <p className="text-text-secondary/75 text-xs leading-relaxed">
                    {tl({ en: `7th house in ${h7SignName?.en}`, hi: `7वां भाव ${h7SignName?.hi} में`, sa: `7वां भाव ${h7SignName?.hi} में` }, locale)}
                    {h7planets.length > 0
                      ? tl({ en: ` — planets: ${h7planets.map(p => PLANET_NAMES_EN[p] || '').join(', ')}. These planets directly influence spouse nature and marriage quality.`, hi: ` — ग्रह: ${h7planets.map(p => PLANET_NAMES_HI[p] || '').join(', ')}। ये ग्रह जीवनसाथी के स्वभाव और विवाह गुणवत्ता को सीधे प्रभावित करते हैं।`, sa: ` — ग्रह: ${h7planets.map(p => PLANET_NAMES_HI[p] || '').join(', ')}। ये ग्रह जीवनसाथी के स्वभाव और विवाह गुणवत्ता को सीधे प्रभावित करते हैं।` }, locale)
                      : (msg('noSpousePlanets', locale))}
                  </p>
                </div>
              );
            })()}
          </div>
        );
      })()}

            {/* D10 Dashamsha */}
            {selectedVarga === 'D10' && kundali.divisionalCharts?.D10 && (() => {
        const d10 = kundali.divisionalCharts.D10;
        const d10Asc = d10.ascendantSign;
        const d10AscName = RASHIS[(d10Asc - 1) % 12]?.name;

        const planetD10 = kundali.planets.map(p => {
          let d10House = 0;
          for (let h = 0; h < 12; h++) {
            if (d10.houses[h]?.includes(p.planet.id)) { d10House = h + 1; break; }
          }
          return { planet: p, d10House };
        });

        const D10_PLANET_MEANING: Record<number, LocaleText> = {
          0: { en: 'Authority and leadership in career — government, executive roles, public visibility. Sun in kendras of D10 gives commanding professional presence.', hi: 'करियर में अधिकार और नेतृत्व — सरकार, कार्यकारी भूमिकाएं, सार्वजनिक दृश्यता।', sa: 'करियर में अधिकार और नेतृत्व — सरकार, कार्यकारी भूमिकाएं, सार्वजनिक दृश्यता।', mai: 'करियर में अधिकार और नेतृत्व — सरकार, कार्यकारी भूमिकाएं, सार्वजनिक दृश्यता।', mr: 'करियर में अधिकार और नेतृत्व — सरकार, कार्यकारी भूमिकाएं, सार्वजनिक दृश्यता।', ta: 'தொழிலில் அதிகாரமும் தலைமையும் — அரசு, நிர்வாக பதவிகள், பொது தெரிவு. D10 கேந்திரத்தில் சூரியன் ஆணையிடும் தொழில்முறை இருப்பை அளிக்கிறது.', te: 'వృత్తిలో అధికారం మరియు నాయకత్వం — ప్రభుత్వం, కార్యనిర్వాహక పాత్రలు, బహిరంగ దృశ్యమానత. D10 కేంద్రాలలో సూర్యుడు ఆజ్ఞాపించే వృత్తిపరమైన సన్నిధిని ఇస్తాడు.', bn: 'কর্মজীবনে কর্তৃত্ব ও নেতৃত্ব — সরকার, কার্যনির্বাহী পদ, জনদৃশ্যমানতা। D10 কেন্দ্রে সূর্য কমান্ডিং পেশাদার উপস্থিতি দেয়।', kn: 'ವೃತ್ತಿಯಲ್ಲಿ ಅಧಿಕಾರ ಮತ್ತು ನಾಯಕತ್ವ — ಸರ್ಕಾರ, ಕಾರ್ಯನಿರ್ವಾಹಕ ಪಾತ್ರಗಳು, ಸಾರ್ವಜನಿಕ ಗೋಚರತೆ. D10 ಕೇಂದ್ರಗಳಲ್ಲಿ ಸೂರ್ಯ ಆಜ್ಞಾಧಿಕಾರಿ ವೃತ್ತಿಪರ ಉಪಸ್ಥಿತಿ ನೀಡುತ್ತಾನೆ.', gu: 'કારકિર્દીમાં સત્તા અને નેતૃત્વ — સરકાર, કાર્યકારી ભૂમિકા, જાહેર દૃશ્યતા. D10 કેન્દ્રમાં સૂર્ય પ્રભાવશાળી વ્યાવસાયિક ઉપસ્થિતિ આપે છે.' },
          1: { en: 'Public-facing career — popularity, emotional intelligence in work, changing roles. Moon in D10 kendras suits public service, hospitality, healthcare.', hi: 'सार्वजनिक करियर — लोकप्रियता, कार्य में भावनात्मक बुद्धि। जनसेवा, आतिथ्य, स्वास्थ्य सेवा।', sa: 'सार्वजनिक करियर — लोकप्रियता, कार्य में भावनात्मक बुद्धि। जनसेवा, आतिथ्य, स्वास्थ्य सेवा।', mai: 'सार्वजनिक करियर — लोकप्रियता, कार्य में भावनात्मक बुद्धि। जनसेवा, आतिथ्य, स्वास्थ्य सेवा।', mr: 'सार्वजनिक करियर — लोकप्रियता, कार्य में भावनात्मक बुद्धि। जनसेवा, आतिथ्य, स्वास्थ्य सेवा।', ta: 'பொதுமக்கள் சார்ந்த தொழில் — பிரபலம், வேலையில் உணர்ச்சி புத்திசாலித்தனம், மாறும் பாத்திரங்கள். D10 கேந்திரத்தில் சந்திரன் பொது சேவை, விருந்தோம்பல், உடல்நலப் பராமரிப்புக்கு ஏற்றது.', te: 'ప్రజాభిముఖ వృత్తి — జనాదరణ, పనిలో భావోద్వేగ బుద్ధి, మారుతున్న పాత్రలు. D10 కేంద్రాలలో చంద్రుడు ప్రజాసేవ, ఆతిథ్యం, ఆరోగ్య సంరక్షణకు అనుకూలం.', bn: 'জনমুখী কর্মজীবন — জনপ্রিয়তা, কাজে আবেগজ বুদ্ধি, পরিবর্তনশীল ভূমিকা। D10 কেন্দ্রে চন্দ্র জনসেবা, আতিথেয়তা, স্বাস্থ্যসেবায় উপযুক্ত।', kn: 'ಸಾರ್ವಜನಿಕ ಮುಖ ವೃತ್ತಿ — ಜನಪ್ರಿಯತೆ, ಕೆಲಸದಲ್ಲಿ ಭಾವನಾತ್ಮಕ ಬುದ್ಧಿ, ಬದಲಾಗುವ ಪಾತ್ರಗಳು. D10 ಕೇಂದ್ರಗಳಲ್ಲಿ ಚಂದ್ರ ಸಾರ್ವಜನಿಕ ಸೇವೆ, ಆತಿಥ್ಯ, ಆರೋಗ್ಯ ಸೇವೆಗೆ ಸೂಕ್ತ.', gu: 'જાહેર સામનાની કારકિર્દી — લોકપ્રિયતા, કામમાં ભાવનાત્મક બુદ્ધિ, બદલાતી ભૂમિકા. D10 કેન્દ્રમાં ચંદ્ર જાહેર સેવા, આતિથ્ય, આરોગ્ય સેવા માટે યોગ્ય.' },
          2: { en: 'Technical and action-oriented career — engineering, military, surgery, sports, real estate. Mars in D10 kendras gives dominant professional drive.', hi: 'तकनीकी और क्रियाशील करियर — इंजीनियरिंग, सैन्य, शल्य, खेल, रियल एस्टेट।', sa: 'तकनीकी और क्रियाशील करियर — इंजीनियरिंग, सैन्य, शल्य, खेल, रियल एस्टेट।', mai: 'तकनीकी और क्रियाशील करियर — इंजीनियरिंग, सैन्य, शल्य, खेल, रियल एस्टेट।', mr: 'तकनीकी और क्रियाशील करियर — इंजीनियरिंग, सैन्य, शल्य, खेल, रियल एस्टेट।', ta: 'தொழில்நுட்ப மற்றும் செயல்முறை சார்ந்த தொழில் — பொறியியல், இராணுவம், அறுவை சிகிச்சை, விளையாட்டு, ரியல் எஸ்டேட். D10 கேந்திரத்தில் செவ்வாய் ஆதிக்கமான தொழில்முறை உந்துதலை அளிக்கிறது.', te: 'సాంకేతిక మరియు చర్య ఆధారిత వృత్తి — ఇంజినీరింగ్, మిలిటరీ, శస్త్రచికిత్స, క్రీడలు, రియల్ ఎస్టేట్. D10 కేంద్రాలలో కుజుడు ఆధిపత్య వృత్తిపరమైన చోదకాన్ని ఇస్తాడు.', bn: 'প্রযুক্তিগত ও কর্মমুখী কর্মজীবন — ইঞ্জিনিয়ারিং, সেনাবাহিনী, সার্জারি, খেলাধুলা, রিয়েল এস্টেট। D10 কেন্দ্রে মঙ্গল প্রভাবশালী পেশাদার চালনা দেয়।', kn: 'ತಾಂತ್ರಿಕ ಮತ್ತು ಕ್ರಿಯಾ ಆಧಾರಿತ ವೃತ್ತಿ — ಎಂಜಿನಿಯರಿಂಗ್, ಸೈನ್ಯ, ಶಸ್ತ್ರಚಿಕಿತ್ಸೆ, ಕ್ರೀಡೆ, ರಿಯಲ್ ಎಸ್ಟೇಟ್. D10 ಕೇಂದ್ರಗಳಲ್ಲಿ ಮಂಗಳ ಪ್ರಬಲ ವೃತ್ತಿಪರ ಚಾಲನೆ ನೀಡುತ್ತಾನೆ.', gu: 'ટેકનિકલ અને ક્રિયાલક્ષી કારકિર્દી — એન્જિનિયરિંગ, લશ્કર, સર્જરી, રમતગમત, રિયલ એસ્ટેટ. D10 કેન્દ્રમાં મંગળ પ્રબળ વ્યાવસાયિક ચાલક બળ આપે છે.' },
          3: { en: 'Communication and analytical career — business, writing, media, accounting, IT. Mercury in D10 kendras excels in commerce and information work.', hi: 'संचार और विश्लेषणात्मक करियर — व्यापार, लेखन, मीडिया, लेखा, आईटी।', sa: 'संचार और विश्लेषणात्मक करियर — व्यापार, लेखन, मीडिया, लेखा, आईटी।', mai: 'संचार और विश्लेषणात्मक करियर — व्यापार, लेखन, मीडिया, लेखा, आईटी।', mr: 'संचार और विश्लेषणात्मक करियर — व्यापार, लेखन, मीडिया, लेखा, आईटी।', ta: 'தகவல்தொடர்பு மற்றும் பகுப்பாய்வு தொழில் — வணிகம், எழுத்து, ஊடகம், கணக்கு, IT. D10 கேந்திரத்தில் புதன் வணிகம் மற்றும் தகவல் பணியில் சிறந்து விளங்குகிறது.', te: 'సంభాషణ మరియు విశ్లేషణాత్మక వృత్తి — వ్యాపారం, రాయడం, మీడియా, అకౌంటింగ్, IT. D10 కేంద్రాలలో బుధుడు వాణిజ్యం మరియు సమాచార పనిలో రాణిస్తాడు.', bn: 'যোগাযোগ ও বিশ্লেষণমূলক কর্মজীবন — ব্যবসা, লেখা, মিডিয়া, অ্যাকাউন্টিং, IT। D10 কেন্দ্রে বুধ বাণিজ্য ও তথ্য কাজে উৎকর্ষ।', kn: 'ಸಂವಹನ ಮತ್ತು ವಿಶ್ಲೇಷಣಾತ್ಮಕ ವೃತ್ತಿ — ವ್ಯಾಪಾರ, ಬರವಣಿಗೆ, ಮಾಧ್ಯಮ, ಲೆಕ್ಕಪತ್ರ, IT. D10 ಕೇಂದ್ರಗಳಲ್ಲಿ ಬುಧ ವಾಣಿಜ್ಯ ಮತ್ತು ಮಾಹಿತಿ ಕೆಲಸದಲ್ಲಿ ಶ್ರೇಷ್ಠ.', gu: 'સંવાદ અને વિશ્લેષણાત્મક કારકિર્દી — વ્યાપાર, લેખન, મીડિયા, એકાઉન્ટિંગ, IT. D10 કેન્દ્રમાં બુધ વાણિજ્ય અને માહિતી કાર્યમાં ઉત્કૃષ્ટ.' },
          4: { en: 'Wisdom and advisory career — teaching, law, finance, religion, counselling. Jupiter in D10 kendras is one of the strongest career indicators.', hi: 'ज्ञान और सलाहकार करियर — शिक्षण, कानून, वित्त, धर्म, परामर्श। D10 केंद्र में गुरु सबसे शक्तिशाली करियर संकेत।', sa: 'ज्ञान और सलाहकार करियर — शिक्षण, कानून, वित्त, धर्म, परामर्श। D10 केंद्र में गुरु सबसे शक्तिशाली करियर संकेत।', mai: 'ज्ञान और सलाहकार करियर — शिक्षण, कानून, वित्त, धर्म, परामर्श। D10 केंद्र में गुरु सबसे शक्तिशाली करियर संकेत।', mr: 'ज्ञान और सलाहकार करियर — शिक्षण, कानून, वित्त, धर्म, परामर्श। D10 केंद्र में गुरु सबसे शक्तिशाली करियर संकेत।', ta: 'ஞானம் மற்றும் ஆலோசனை தொழில் — கற்பித்தல், சட்டம், நிதி, மதம், ஆலோசனை. D10 கேந்திரத்தில் குரு வலிமையான தொழில் குறிகாட்டிகளில் ஒன்று.', te: 'జ్ఞానం మరియు సలహా వృత్తి — బోధన, న్యాయం, ఆర్థికం, మతం, సలహా. D10 కేంద్రాలలో గురువు బలమైన వృత్తి సూచికలలో ఒకటి.', bn: 'জ্ঞান ও পরামর্শমূলক কর্মজীবন — শিক্ষাদান, আইন, অর্থ, ধর্ম, পরামর্শ। D10 কেন্দ্রে বৃহস্পতি শক্তিশালী কর্মজীবন সূচকগুলির একটি।', kn: 'ಜ್ಞಾನ ಮತ್ತು ಸಲಹೆ ವೃತ್ತಿ — ಬೋಧನೆ, ಕಾನೂನು, ಹಣಕಾಸು, ಧರ್ಮ, ಸಮಾಲೋಚನೆ. D10 ಕೇಂದ್ರಗಳಲ್ಲಿ ಗುರು ಬಲಿಷ್ಠ ವೃತ್ತಿ ಸೂಚಕಗಳಲ್ಲಿ ಒಂದು.', gu: 'જ્ઞાન અને સલાહકાર કારકિર્દી — શિક્ષણ, કાયદો, નાણાં, ધર્મ, પરામર્શ. D10 કેન્દ્રમાં ગુરુ સૌથી મજબૂત કારકિર્દી સૂચકોમાંનું એક.' },
          5: { en: 'Creative and luxury career — arts, entertainment, fashion, beauty, hospitality. Venus in D10 kendras brings success through aesthetics and relationships.', hi: 'रचनात्मक और विलासिता करियर — कला, मनोरंजन, फैशन, सौंदर्य, आतिथ्य।', sa: 'रचनात्मक और विलासिता करियर — कला, मनोरंजन, फैशन, सौंदर्य, आतिथ्य।', mai: 'रचनात्मक और विलासिता करियर — कला, मनोरंजन, फैशन, सौंदर्य, आतिथ्य।', mr: 'रचनात्मक और विलासिता करियर — कला, मनोरंजन, फैशन, सौंदर्य, आतिथ्य।', ta: 'படைப்பாற்றல் மற்றும் ஆடம்பர தொழில் — கலைகள், பொழுதுபோக்கு, பேஷன், அழகு, விருந்தோம்பல். D10 கேந்திரத்தில் சுக்கிரன் அழகியல் மற்றும் உறவுகள் மூலம் வெற்றி தருகிறது.', te: 'సృజనాత్మక మరియు విలాస వృత్తి — కళలు, వినోదం, ఫ్యాషన్, అందం, ఆతిథ్యం. D10 కేంద్రాలలో శుక్రుడు సౌందర్యశాస్త్రం మరియు సంబంధాల ద్వారా విజయం తెస్తాడు.', bn: 'সৃজনশীল ও বিলাসবহুল কর্মজীবন — কলা, বিনোদন, ফ্যাশন, সৌন্দর্য, আতিথেয়তা। D10 কেন্দ্রে শুক্র নান্দনিকতা ও সম্পর্কের মাধ্যমে সাফল্য আনে।', kn: 'ಸೃಜನಾತ್ಮಕ ಮತ್ತು ವೈಭವ ವೃತ್ತಿ — ಕಲೆಗಳು, ಮನರಂಜನೆ, ಫ್ಯಾಷನ್, ಸೌಂದರ್ಯ, ಆತಿಥ್ಯ. D10 ಕೇಂದ್ರಗಳಲ್ಲಿ ಶುಕ್ರ ಸೌಂದರ್ಯಶಾಸ್ತ್ರ ಮತ್ತು ಸಂಬಂಧಗಳ ಮೂಲಕ ಯಶಸ್ಸು ತರುತ್ತಾನೆ.', gu: 'સર્જનાત્મક અને વૈભવી કારકિર્દી — કળાઓ, મનોરંજન, ફેશન, સૌંદર્ય, આતિથ્ય. D10 કેન્દ્રમાં શુક્ર સૌંદર્યશાસ્ત્ર અને સંબંધો દ્વારા સફળતા લાવે છે.' },
          6: { en: 'Structured and disciplined career — management, administration, agriculture, mining, manufacturing. Saturn in D10 kendras gives lasting but slow-building career success.', hi: 'संरचित और अनुशासित करियर — प्रबंधन, प्रशासन, कृषि, खनन, विनिर्माण।', sa: 'संरचित और अनुशासित करियर — प्रबंधन, प्रशासन, कृषि, खनन, विनिर्माण।', mai: 'संरचित और अनुशासित करियर — प्रबंधन, प्रशासन, कृषि, खनन, विनिर्माण।', mr: 'संरचित और अनुशासित करियर — प्रबंधन, प्रशासन, कृषि, खनन, विनिर्माण।', ta: 'கட்டமைக்கப்பட்ட ஒழுக்கமான தொழில் — நிர்வாகம், ஆட்சி, விவசாயம், சுரங்கம், உற்பத்தி. D10 கேந்திரத்தில் சனி நீடித்த ஆனால் மெதுவாக கட்டமைக்கும் தொழில் வெற்றி தருகிறது.', te: 'నిర్మాణాత్మక మరియు క్రమశిక్షణాబద్ధ వృత్తి — నిర్వహణ, పరిపాలన, వ్యవసాయం, గనుల తవ్వకం, తయారీ. D10 కేంద్రాలలో శని శాశ్వతమైన కానీ నెమ్మదిగా నిర్మించే వృత్తి విజయం ఇస్తాడు.', bn: 'কাঠামোগত ও শৃঙ্খলাবদ্ধ কর্মজীবন — ব্যবস্থাপনা, প্রশাসন, কৃষি, খনন, উৎপাদন। D10 কেন্দ্রে শনি দীর্ঘস্থায়ী কিন্তু ধীরে নির্মিত কর্মজীবন সাফল্য দেয়।', kn: 'ರಚನಾತ್ಮಕ ಮತ್ತು ಶಿಸ್ತುಬದ್ಧ ವೃತ್ತಿ — ನಿರ್ವಹಣೆ, ಆಡಳಿತ, ಕೃಷಿ, ಗಣಿಗಾರಿಕೆ, ಉತ್ಪಾದನೆ. D10 ಕೇಂದ್ರಗಳಲ್ಲಿ ಶನಿ ಶಾಶ್ವತ ಆದರೆ ನಿಧಾನವಾಗಿ ನಿರ್ಮಿಸುವ ವೃತ್ತಿ ಯಶಸ್ಸು ನೀಡುತ್ತಾನೆ.', gu: 'માળખાગત અને શિસ્તબદ્ધ કારકિર્દી — વ્યવસ્થાપન, વહીવટ, ખેતી, ખાણકામ, ઉત્પાદન. D10 કેન્દ્રમાં શનિ ટકાઉ પણ ધીમે-ધીમે બનતી કારકિર્દી સફળતા આપે છે.' },
          7: { en: 'Unconventional career — technology, foreign companies, research, aviation, innovation. Rahu in D10 kendras drives ambitious, boundary-breaking career moves.', hi: 'अपारंपरिक करियर — प्रौद्योगिकी, विदेशी कंपनियां, अनुसंधान, विमानन, नवाचार।', sa: 'अपारंपरिक करियर — प्रौद्योगिकी, विदेशी कंपनियां, अनुसंधान, विमानन, नवाचार।', mai: 'अपारंपरिक करियर — प्रौद्योगिकी, विदेशी कंपनियां, अनुसंधान, विमानन, नवाचार।', mr: 'अपारंपरिक करियर — प्रौद्योगिकी, विदेशी कंपनियां, अनुसंधान, विमानन, नवाचार।', ta: 'வழக்கத்திற்கு மாறான தொழில் — தொழில்நுட்பம், வெளிநாட்டு நிறுவனங்கள், ஆராய்ச்சி, விமானப்போக்குவரத்து, புதுமை. D10 கேந்திரத்தில் ராகு லட்சியமான, எல்லை தாண்டும் தொழில் நகர்வுகளை இயக்குகிறது.', te: 'అసాంప్రదాయ వృత్తి — సాంకేతికత, విదేశీ కంపెనీలు, పరిశోధన, విమానయానం, ఆవిష్కరణ. D10 కేంద్రాలలో రాహు ఆకాంక్షపూరిత, సరిహద్దులు ఛేదించే వృత్తి చర్యలను నడిపిస్తాడు.', bn: 'অপ্রচলিত কর্মজীবন — প্রযুক্তি, বিদেশি কোম্পানি, গবেষণা, বিমান, উদ্ভাবন। D10 কেন্দ্রে রাহু উচ্চাকাঙ্ক্ষী, সীমা ভাঙা কর্মজীবন পদক্ষেপ চালায়।', kn: 'ಅಸಾಂಪ್ರದಾಯಿಕ ವೃತ್ತಿ — ತಂತ್ರಜ್ಞಾನ, ವಿದೇಶಿ ಕಂಪನಿಗಳು, ಸಂಶೋಧನೆ, ವಿಮಾನಯಾನ, ನಾವೀನ್ಯ. D10 ಕೇಂದ್ರಗಳಲ್ಲಿ ರಾಹು ಮಹತ್ವಾಕಾಂಕ್ಷೆಯ, ಗಡಿ ಮೀರುವ ವೃತ್ತಿ ನಡೆಗಳನ್ನು ನಡೆಸುತ್ತಾನೆ.', gu: 'અપરંપરાગત કારકિર્દી — ટેક્નોલોજી, વિદેશી કંપનીઓ, સંશોધન, ઉડ્ડયન, નવીનતા. D10 કેન્દ્રમાં રાહુ મહત્ત્વાકાંક્ષી, સીમા તોડતી કારકિર્દી ચાલ ચલાવે છે.' },
          8: { en: 'Spiritual or research career — healing, astrology, occult sciences, renunciation-oriented work. Ketu in D10 gives expertise through intuition rather than formal training.', hi: 'आध्यात्मिक या अनुसंधान करियर — उपचार, ज्योतिष, गुप्त विज्ञान। केतु औपचारिक प्रशिक्षण के बजाय अंतर्ज्ञान से विशेषज्ञता देता है।', sa: 'आध्यात्मिक या अनुसंधान करियर — उपचार, ज्योतिष, गुप्त विज्ञान। केतु औपचारिक प्रशिक्षण के बजाय अंतर्ज्ञान से विशेषज्ञता देता है।', mai: 'आध्यात्मिक या अनुसंधान करियर — उपचार, ज्योतिष, गुप्त विज्ञान। केतु औपचारिक प्रशिक्षण के बजाय अंतर्ज्ञान से विशेषज्ञता देता है।', mr: 'आध्यात्मिक या अनुसंधान करियर — उपचार, ज्योतिष, गुप्त विज्ञान। केतु औपचारिक प्रशिक्षण के बजाय अंतर्ज्ञान से विशेषज्ञता देता है।', ta: 'ஆன்மிக அல்லது ஆராய்ச்சி தொழில் — குணப்படுத்துதல், ஜோதிடம், அமானுஷ்ய அறிவியல், துறவு சார்ந்த பணி. D10 கேது முறையான பயிற்சியை விட உள்ளுணர்வு மூலம் நிபுணத்துவம் தருகிறது.', te: 'ఆధ్యాత్మిక లేదా పరిశోధన వృత్తి — వైద్యం, జ్యోతిషం, అతీంద్రియ శాస్త్రాలు, సన్యాస ఆధారిత పని. D10లో కేతు అధికారిక శిక్షణ కంటే అంతర్దృష్టి ద్వారా నైపుణ్యం ఇస్తాడు.', bn: 'আধ্যাত্মিক বা গবেষণা কর্মজীবন — নিরাময়, জ্যোতিষ, গুপ্তবিদ্যা, সন্ন্যাসমূলক কাজ। D10তে কেতু আনুষ্ঠানিক প্রশিক্ষণের চেয়ে অন্তর্জ্ঞানের মাধ্যমে দক্ষতা দেয়।', kn: 'ಅಧ್ಯಾತ್ಮಿಕ ಅಥವಾ ಸಂಶೋಧನೆ ವೃತ್ತಿ — ಗುಣಪಡಿಸುವಿಕೆ, ಜ್ಯೋತಿಷ, ಗುಪ್ತವಿದ್ಯೆಗಳು, ಸನ್ಯಾಸ ಆಧಾರಿತ ಕೆಲಸ. D10ರಲ್ಲಿ ಕೇತು ಔಪಚಾರಿಕ ತರಬೇತಿಗಿಂತ ಅಂತಃಪ್ರಜ್ಞೆಯ ಮೂಲಕ ಪರಿಣತಿ ನೀಡುತ್ತಾನೆ.', gu: 'આધ્યાત્મિક કે સંશોધન કારકિર્દી — ઉપચાર, જ્યોતિષ, ગૂઢવિદ્યા, ત્યાગલક્ષી કાર્ય. D10માં કેતુ ઔપચારિક તાલીમ કરતાં અંતર્જ્ઞાન દ્વારા નિપુણતા આપે છે.' },
        };

        const KENDRAS_SET = new Set([1, 4, 7, 10]);
        const TRIKONAS_SET = new Set([1, 5, 9]);

        return (
          <div className="rounded-2xl bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-sky-500/20 p-6 mt-8">
            <h3 className="text-gold-gradient text-xl font-bold mb-1 text-center" style={headingFont}>
              {msg('d10DashaTitle', locale)}
            </h3>
            <p className="text-text-secondary/70 text-xs text-center mb-5">
              {msg('dashashaDesc', locale)}
            </p>

            {/* D10 Lagna */}
            <div className="rounded-xl p-4 mb-4 text-center border bg-sky-500/10 border-sky-500/25">
              <div className="font-bold text-lg mb-1 text-sky-300" style={headingFont}>
                {msg('d10Ascendant', locale)}{d10AscName?.[locale] || d10AscName?.en}
              </div>
              <p className="text-text-secondary/70 text-xs">
                {tl({ en: "D10 ascendant shows the nature of your professional persona — how you appear in the workplace and your career\'s fundamental character.", hi: "D10 लग्न आपके करियर के स्वरूप और पेशेवर व्यक्तित्व को दर्शाता है — आप कार्यस्थल पर कैसे दिखते हैं।", sa: "D10 लग्न आपके करियर के स्वरूप और पेशेवर व्यक्तित्व को दर्शाता है — आप कार्यस्थल पर कैसे दिखते हैं।" }, locale)}
              </p>
            </div>

            {/* Planet grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {planetD10.map((pd, i) => {
                const pid = pd.planet.planet.id;
                const meaning = D10_PLANET_MEANING[pid];
                const isInKendra = KENDRAS_SET.has(pd.d10House);
                const isInTrikona = TRIKONAS_SET.has(pd.d10House);
                const isInDusthana = new Set([6, 8, 12]).has(pd.d10House);

                return (
                  <div key={i} className={`rounded-xl p-3 border ${
                    isInKendra ? 'border-emerald-500/15 bg-emerald-500/5' :
                    isInTrikona ? 'border-sky-500/15 bg-sky-500/5' :
                    isInDusthana ? 'border-amber-500/15 bg-amber-500/5' :
                    'border-sky-500/10 bg-sky-500/3'
                  }`}>
                    <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                      <span className="text-gold-light font-semibold text-sm" style={headingFont}>{pd.planet.planet.name[locale] || pd.planet.planet.name.en}</span>
                      <span className="text-text-secondary/65 text-xs">
                        {msg('d10House', locale)} {pd.d10House}
                      </span>
                      {isInKendra && (
                        <span className="text-xs font-bold px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300">
                          {msg('kendraLabel', locale)}
                        </span>
                      )}
                      {isInTrikona && !isInKendra && (
                        <span className="text-xs font-bold px-1.5 py-0.5 rounded bg-sky-500/20 text-sky-300">
                          {msg('trikonaLabel', locale)}
                        </span>
                      )}
                      {isInDusthana && (
                        <span className="text-xs font-bold px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300">
                          {msg('dusthanaLabel', locale)}
                        </span>
                      )}
                    </div>
                    {meaning && (
                      <p className="text-text-secondary/75 text-xs leading-relaxed">{meaning[msg('localeKey', locale)]}</p>
                    )}
                    {isInKendra && (
                      <p className="text-emerald-400/80 text-xs mt-1 italic">
                        {msg('kendraDesc', locale)}
                      </p>
                    )}
                    {isInDusthana && (
                      <p className="text-amber-400/80 text-xs mt-1 italic">
                        {msg('dusthanaDesc', locale)}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>

            {/* 10th house summary */}
            {(() => {
              const h10planets = d10.houses[9] || [];
              const h10Sign = ((d10Asc - 1 + 9) % 12) + 1;
              const h10SignName = RASHIS[(h10Sign - 1) % 12]?.name;
              return (
                <div className="mt-4 p-4 rounded-xl bg-sky-500/5 border border-sky-500/15">
                  <div className="text-sky-300 text-xs uppercase tracking-wider font-bold mb-2">
                    {msg('d10CareerZenith', locale)}
                  </div>
                  <p className="text-text-secondary/75 text-xs leading-relaxed">
                    {tl({ en: `10th house in ${h10SignName?.en}`, hi: `10वां भाव ${h10SignName?.hi} में`, sa: `10वां भाव ${h10SignName?.hi} में` }, locale)}
                    {h10planets.length > 0
                      ? tl({ en: ` — planets: ${h10planets.map(p => PLANET_NAMES_EN[p] || '').join(', ')}. These planets directly influence your career zenith — your most visible professional achievements.`, hi: ` — ग्रह: ${h10planets.map(p => PLANET_NAMES_HI[p] || '').join(', ')}। ये ग्रह सीधे करियर के उच्चतम बिंदु को प्रभावित करते हैं — आपकी सबसे दृश्यमान व्यावसायिक उपलब्धियां।`, sa: ` — ग्रह: ${h10planets.map(p => PLANET_NAMES_HI[p] || '').join(', ')}। ये ग्रह सीधे करियर के उच्चतम बिंदु को प्रभावित करते हैं — आपकी सबसे दृश्यमान व्यावसायिक उपलब्धियां।` }, locale)
                      : (msg('noCareerZenithPlanets', locale))}
                  </p>
                </div>
              );
            })()}
          </div>
        );
      })()}

            {/* D7 Saptamsha */}
            {selectedVarga === 'D7' && kundali.divisionalCharts?.D7 && (() => {
        const d7 = kundali.divisionalCharts.D7;
        const d7Asc = d7.ascendantSign;
        const d7AscName = RASHIS[(d7Asc - 1) % 12]?.name;

        const h5planets = d7.houses[4] || []; // 5th house = first child
        const h5Sign = ((d7Asc - 1 + 4) % 12) + 1;
        const jupHouse = (() => { for (let h = 0; h < 12; h++) { if (d7.houses[h]?.includes(4)) return h + 1; } return 0; })();

        return (
          <div className="rounded-2xl bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-teal-500/20 p-6 mt-8">
            <h3 className="text-gold-gradient text-xl font-bold mb-1 text-center" style={headingFont}>
              {msg('d7SaptamshaTitle', locale)}
            </h3>
            <p className="text-text-secondary/70 text-xs text-center mb-5">
              {msg('saptamshaDesc', locale)}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Jupiter placement — most important for children */}
              <div className={`rounded-xl p-4 border ${jupHouse && new Set([1,4,5,7,9,10]).has(jupHouse) ? 'border-emerald-500/20 bg-emerald-500/5' : 'border-teal-500/15 bg-teal-500/5'}`}>
                <div className="text-teal-300 text-xs uppercase tracking-wider font-bold mb-2">
                  {msg('jupiterPlacementTitle', locale)}
                </div>
                <p className="text-text-secondary/75 text-xs leading-relaxed">
                  {jupHouse
                    ? tl({ en: `Jupiter in ${jupHouse}th house of D7 — ${new Set([1,4,5,7,9,10]).has(jupHouse) ? 'Auspicious position — strong indicator of children\'s happiness and success.' : new Set([6,8,12]).has(jupHouse) ? 'Challenging position — delay or difficulty with children possible. Jupiter remedies help.' : 'Moderate position — normal children fortune.'}`, hi: `D7 में गुरु ${jupHouse}वें भाव में — ${new Set([1,4,5,7,9,10]).has(jupHouse) ? 'शुभ स्थान — संतान सुख और उनकी सफलता का बलवान संकेत।' : new Set([6,8,12]).has(jupHouse) ? 'चुनौतीपूर्ण स्थान — संतान में विलंब या कठिनाई संभव। गुरु उपाय सहायक।' : 'मध्यम स्थान — सामान्य संतान सुख।'}`, sa: `D7 में गुरु ${jupHouse}वें भाव में — ${new Set([1,4,5,7,9,10]).has(jupHouse) ? 'शुभ स्थान — संतान सुख और उनकी सफलता का बलवान संकेत।' : new Set([6,8,12]).has(jupHouse) ? 'चुनौतीपूर्ण स्थान — संतान में विलंब या कठिनाई संभव। गुरु उपाय सहायक।' : 'मध्यम स्थान — सामान्य संतान सुख।'}` }, locale)
                    : (msg('jupiterD7Undetermined', locale))}
                </p>
              </div>

              {/* 5th house — first child */}
              <div className="rounded-xl p-4 border border-teal-500/15 bg-teal-500/5">
                <div className="text-teal-300 text-xs uppercase tracking-wider font-bold mb-2">
                  {msg('fifthHouseChild', locale)}
                </div>
                <p className="text-text-secondary/75 text-xs leading-relaxed">
                  {tl({ en: `In ${RASHIS[(h5Sign-1)%12]?.name?.en}`, hi: `${RASHIS[(h5Sign-1)%12]?.name?.hi} में`, sa: `${RASHIS[(h5Sign-1)%12]?.name?.hi} में` }, locale)}
                  {h5planets.length > 0
                    ? tl({ en: ` — planets: ${h5planets.map(p => PLANET_NAMES_EN[p] || '').join(', ')}. ${h5planets.some(p => new Set([1,3,4,5]).has(p)) ? 'Benefic influence — happiness from first child.' : 'Malefic influence — challenges possible with first child.'}`, hi: ` — ग्रह: ${h5planets.map(p => PLANET_NAMES_HI[p] || '').join(', ')}। ${h5planets.some(p => new Set([1,3,4,5]).has(p)) ? 'शुभ ग्रह — प्रथम संतान से सुख।' : 'पाप ग्रह — प्रथम संतान में चुनौतियां संभव।'}`, sa: ` — ग्रह: ${h5planets.map(p => PLANET_NAMES_HI[p] || '').join(', ')}। ${h5planets.some(p => new Set([1,3,4,5]).has(p)) ? 'शुभ ग्रह — प्रथम संतान से सुख।' : 'पाप ग्रह — प्रथम संतान में चुनौतियां संभव।'}` }, locale)
                    : (msg('noFifthHousePlanets', locale))}
                </p>
              </div>
            </div>
          </div>
        );
      })()}

    </div>
  );
}
