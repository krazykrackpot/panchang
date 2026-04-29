'use client';

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { tl } from '@/lib/utils/trilingual';
import { RASHIS } from '@/lib/constants/rashis';
import { GRAHAS } from '@/lib/constants/grahas';
import { GrahaIconById } from '@/components/icons/GrahaIcons';
import { RashiIconById } from '@/components/icons/RashiIcons';
import { getPlanetaryPositions, toSidereal, dateToJD } from '@/lib/ephem/astronomical';
import InfoBlock from '@/components/ui/InfoBlock';
import type { AshtakavargaData } from '@/types/kundali';
import type { Locale } from '@/types/panchang';

// House theme for each sign relative to lagna — used for concrete transit guidance
// signId (1-12) mapped to lagna-relative house (computed at render time)
const HOUSE_LIFE_THEMES: Record<number, { en: string; hi: string }> = {
  1:  { en: 'self, health, and personal identity', hi: 'आत्म, स्वास्थ्य और व्यक्तिगत पहचान' },
  2:  { en: 'wealth, family, and speech', hi: 'धन, परिवार और वाणी' },
  3:  { en: 'courage, siblings, and communication', hi: 'साहस, भाई-बहन और संवाद' },
  4:  { en: 'home, mother, and emotional peace', hi: 'घर, माता और मानसिक शान्ति' },
  5:  { en: 'children, creativity, and intelligence', hi: 'संतान, रचनात्मकता और बुद्धि' },
  6:  { en: 'health, enemies, and daily work', hi: 'स्वास्थ्य, शत्रु और दैनिक कार्य' },
  7:  { en: 'marriage, partnerships, and business', hi: 'विवाह, साझेदारी और व्यापार' },
  8:  { en: 'transformation, hidden matters, and longevity', hi: 'परिवर्तन, गुप्त विषय और आयु' },
  9:  { en: 'fortune, dharma, and higher learning', hi: 'भाग्य, धर्म और उच्च शिक्षा' },
  10: { en: 'career, reputation, and public life', hi: 'करियर, प्रतिष्ठा और सार्वजनिक जीवन' },
  11: { en: 'gains, desires, and social networks', hi: 'लाभ, इच्छाएँ और सामाजिक नेटवर्क' },
  12: { en: 'expenses, spirituality, and foreign connections', hi: 'व्यय, आध्यात्मिकता और विदेश' },
};

export default function AshtakavargaTab({ ashtakavarga, locale, isDevanagari, headingFont, t, lagnaSign }: {
  ashtakavarga: AshtakavargaData; locale: Locale; isDevanagari: boolean;
  headingFont: React.CSSProperties; t: (key: string) => string; lagnaSign?: number;
}) {
  const isTamil = String(locale) === 'ta';
  const isBengali = String(locale) === 'bn';
  const isEn = locale === 'en' || isTamil;
  const [viewMode, setViewMode] = useState<'sav' | 'bpi' | 'reduced'>('sav');

  // Compute insights from SAV
  const strongSigns = RASHIS.filter((_, i) => ashtakavarga.savTable[i] >= 28).map(r => tl(r.name, locale));
  const weakSigns = RASHIS.filter((_, i) => ashtakavarga.savTable[i] < 22).map(r => tl(r.name, locale));
  const strongSignIds = RASHIS.filter((_, i) => ashtakavarga.savTable[i] >= 28).map(r => r.id);
  const weakSignIds = RASHIS.filter((_, i) => ashtakavarga.savTable[i] < 22).map(r => r.id);

  // Compute transit windows for slow planets through strong AND weak signs
  type TransitEntry = { planet: string; planetId: number; sign: string; period: string; startYear: number; startMonth: number; endYear: number; endMonth: number; type: 'strong' | 'weak' };
  const allTransits = useMemo(() => {
    const targetIds = [...strongSignIds.map(id => ({ id, type: 'strong' as const })), ...weakSignIds.map(id => ({ id, type: 'weak' as const }))];
    if (targetIds.length === 0) return [] as TransitEntry[];
    const results: TransitEntry[] = [];
    const slowPlanets = [
      { id: 6, name: { en: 'Saturn', hi: 'शनि', sa: 'शनि', mai: 'शनि', mr: 'शनि', ta: 'சனி', te: 'శని', bn: 'শনি', kn: 'ಶನಿ', gu: 'શனિ' } },
      { id: 4, name: { en: 'Jupiter', hi: 'बृहस्पति', sa: 'बृहस्पति', mai: 'बृहस्पति', mr: 'बृहस्पति', ta: 'குரு', te: 'గురువు', bn: 'বৃহস্পதি', kn: 'ಗುರು', gu: 'ગુરુ' } },
      { id: 7, name: { en: 'Rahu', hi: 'राहु', sa: 'राहु', mai: 'राहु', mr: 'राहु', ta: 'ராகு', te: 'రాహు', bn: 'রাহু', kn: 'ರಾಹು', gu: 'રાહુ' } },
    ];
    const now = new Date();
    const startJd = dateToJD(now.getFullYear(), now.getMonth() + 1, 15, 12);
    const monthsToScan = 180;

    for (const planet of slowPlanets) {
      for (const target of targetIds) {
        let entryMonth: string | null = null;
        let entryDate: Date | null = null;
        let lastInSign = false;

        for (let m = 0; m <= monthsToScan; m++) {
          const jd = startJd + m * 30.44;
          const positions = getPlanetaryPositions(jd);
          const pos = positions.find(p => p.id === planet.id);
          if (!pos) continue;
          const sidLon = toSidereal(pos.longitude, jd);
          const sign = Math.floor(sidLon / 30) + 1;
          const inSign = sign === target.id;

          if (inSign && !lastInSign) {
            entryDate = new Date(now.getTime() + m * 30.44 * 24 * 3600000);
            entryMonth = entryDate.toLocaleDateString('en-US', { year: 'numeric', month: 'short' });
          }
          if (!inSign && lastInSign && entryMonth && entryDate) {
            const exitDate = new Date(now.getTime() + m * 30.44 * 24 * 3600000);
            const exitMonth = exitDate.toLocaleDateString('en-US', { year: 'numeric', month: 'short' });
            results.push({
              planet: planet.name[locale === 'en' || isTamil ? 'en' : 'hi'], planetId: planet.id,
              sign: tl(RASHIS[target.id - 1].name, locale), period: `${entryMonth} – ${exitMonth}`,
              startYear: entryDate.getFullYear(), startMonth: entryDate.getMonth(),
              endYear: exitDate.getFullYear(), endMonth: exitDate.getMonth(), type: target.type,
            });
            entryMonth = null; entryDate = null;
          }
          lastInSign = inSign;
        }
        if (lastInSign && entryMonth && entryDate) {
          const scanEnd = new Date(now.getTime() + monthsToScan * 30.44 * 24 * 3600000);
          results.push({
            planet: planet.name[locale === 'en' || isTamil ? 'en' : 'hi'], planetId: planet.id,
            sign: tl(RASHIS[target.id - 1].name, locale), period: `${entryMonth} – ...`,
            startYear: entryDate.getFullYear(), startMonth: entryDate.getMonth(),
            endYear: scanEnd.getFullYear(), endMonth: scanEnd.getMonth(), type: target.type,
          });
        }
      }
    }
    // Sort chronologically
    results.sort((a, b) => a.startYear * 12 + a.startMonth - b.startYear * 12 - b.startMonth);
    return results;
  }, [strongSignIds, weakSignIds, locale]);
  const weakTransits = allTransits.filter(t => t.type === 'weak');
  const strongTransits = allTransits.filter(t => t.type === 'strong');
  const totalBindu = ashtakavarga.savTable.reduce((a, b) => a + b, 0);

  return (
    <div className="space-y-8">
      <h3 className="text-2xl font-bold text-gold-gradient text-center" style={headingFont}>{t('ashtakavarga')}</h3>

      {/* What is Ashtakavarga */}
      <InfoBlock
        id="kundali-ashtakavarga"
        title={locale === 'en' || isTamil ? 'What is Ashtakavarga and how does it affect you?' : 'अष्टकवर्ग क्या है और यह आपको कैसे प्रभावित करता है?'}
        defaultOpen={false}
      >
        {locale === 'en' || isTamil ? (
          <div className="space-y-3">
            <p><strong>Ashtakavarga</strong> is a point-based system that tells you which zodiac signs are <em>lucky zones</em> for transiting planets to pass through — and which are challenging. Every planet in your birth chart casts &quot;votes&quot; (called <strong>bindus</strong>) to every sign. The sign that gets the most votes is the most receptive for planetary transits.</p>
            <p><strong>Reading the score (what the numbers mean for YOU):</strong></p>
            <ul className="list-disc ml-4 space-y-1 text-xs">
              <li><strong className="text-emerald-400">30+ bindus</strong> — Excellent zone. When a planet transits this sign, it brings its best results. Great time to launch ventures, make investments, or take action in that planet&apos;s domain.</li>
              <li><strong className="text-amber-300">25–29 bindus</strong> — Above average. Generally favourable transits with some friction.</li>
              <li><strong className="text-text-secondary">22–24 bindus</strong> — Average. Mixed results — modest gains, no major setbacks.</li>
              <li><strong className="text-red-400">Below 22 bindus</strong> — Weak zone. Planets transiting here underperform. Saturn or Rahu transiting a weak sign can be a difficult period — plan conservatively.</li>
            </ul>
            <p><strong>Practical examples:</strong></p>
            <ul className="list-disc ml-4 space-y-1 text-xs">
              <li>Jupiter (wealth/wisdom) transiting a sign with 30+ bindus = excellent year for education, spiritual growth, and financial gains.</li>
              <li>Saturn transiting a sign with &lt;22 bindus = a challenging 2.5-year stretch — not a time to take on heavy debt or risky ventures.</li>
              <li>Your current transits page shows where planets are NOW — cross-reference with your bindus for precise timing.</li>
            </ul>
            <p><strong>SAV vs BPI:</strong> SAV (Sarvashtakavarga) = total votes for each sign from ALL planets combined — your general lucky/unlucky sign map. BPI (Bhinnashtakavarga) = each planet&apos;s individual score — more specific, used when checking a specific planet&apos;s transit.</p>
          </div>
        ) : (
          <div className="space-y-3">
            <p><strong>अष्टकवर्ग</strong> एक बिन्दु-आधारित पद्धति है जो बताती है कि गोचर ग्रहों के लिए कौन-सी राशियाँ <em>शुभ क्षेत्र</em> हैं। आपकी जन्म कुण्डली के प्रत्येक ग्रह प्रत्येक राशि को &quot;बिन्दु&quot; (शुभ अंक) देते हैं।</p>
            <p><strong>स्कोर का अर्थ (आपके लिए):</strong></p>
            <ul className="list-disc ml-4 space-y-1 text-xs">
              <li><strong className="text-emerald-400">30+ बिन्दु</strong> — उत्कृष्ट क्षेत्र। जब कोई ग्रह इस राशि से गुजरे, तो नए कार्य, निवेश और उद्यम शुरू करें।</li>
              <li><strong className="text-amber-300">25–29 बिन्दु</strong> — औसत से ऊपर। सामान्यतः अनुकूल।</li>
              <li><strong className="text-text-secondary">22–24 बिन्दु</strong> — औसत। मिश्रित परिणाम।</li>
              <li><strong className="text-red-400">22 से कम बिन्दु</strong> — कमज़ोर क्षेत्र। यहाँ से गुजरने वाले ग्रह कम फल देते हैं। शनि/राहु का गोचर कठिन हो सकता है।</li>
            </ul>
            <p><strong>SAV बनाम BPI:</strong> SAV = सभी ग्रहों का कुल स्कोर (समग्र शुभ/अशुभ राशि नक्शा)। BPI = प्रत्येक ग्रह का व्यक्तिगत स्कोर — किसी विशेष ग्रह गोचर की जाँच हेतु।</p>
          </div>
        )}
      </InfoBlock>

      {/* Top-level summary paragraph */}
      <div className="rounded-xl bg-gradient-to-br from-[#2d1b69]/30 via-[#1a1040]/40 to-[#0a0e27] border border-gold-primary/10 p-5">
        <p className="text-sm text-text-primary/85 leading-relaxed" style={isDevanagari ? { fontFamily: 'var(--font-devanagari-body)' } : undefined}>
          {isEn
            ? 'Ashtakavarga is the most reliable transit prediction tool in Vedic astrology. It tells you which signs in the zodiac are supportive for you and which are challenging. When slow-moving planets like Saturn and Jupiter transit through your strong signs, life flows more easily. When they pass through weak signs, extra caution and patience are needed. Use these scores to time major decisions — job changes, investments, and life commitments.'
            : 'अष्टकवर्ग वैदिक ज्योतिष का सबसे विश्वसनीय गोचर भविष्यवाणी उपकरण है। यह बताता है कि राशि चक्र की कौन-सी राशियाँ आपके लिए सहायक हैं और कौन-सी चुनौतीपूर्ण। जब शनि और बृहस्पति जैसे मन्द ग्रह आपकी बलवान राशियों से गुजरते हैं, तो जीवन सुगम होता है। दुर्बल राशियों में गोचर के समय अतिरिक्त सावधानी आवश्यक है। बड़े निर्णयों — नौकरी बदलना, निवेश, जीवन के बड़े फैसले — का समय निर्धारित करने के लिए इन अंकों का उपयोग करें।'}
        </p>
      </div>

      {/* Quick insight — with house-theme context */}
      {(strongSigns.length > 0 || weakSigns.length > 0) && (
        <div className="rounded-xl bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 p-5">
          <h4 className="text-gold-dark text-xs uppercase tracking-wider font-bold mb-3">{isEn ? 'Your Supportive & Challenging Zones' : 'आपके सहायक एवं चुनौतीपूर्ण क्षेत्र'}</h4>
          <div className="space-y-3 text-sm" style={isDevanagari ? { fontFamily: 'var(--font-devanagari-body)' } : undefined}>
            {strongSignIds.map((signId, idx) => {
              // Compute house from lagna: house = ((signId - lagnaSign + 12) % 12) + 1
              const house = lagnaSign ? ((signId - lagnaSign + 12) % 12) + 1 : 0;
              const theme = house ? HOUSE_LIFE_THEMES[house] : null;
              return (
                <div key={signId} className="flex items-start gap-2">
                  <span className="text-emerald-400 mt-0.5 shrink-0">●</span>
                  <p className="text-emerald-400/80">
                    {isEn
                      ? <>
                          <strong>{strongSigns[idx]}</strong> (SAV {ashtakavarga.savTable[signId - 1]})
                          {theme && <> — When planets transit here, you experience support and positive outcomes in <em>{theme.en}</em>.</>}
                          {!theme && <> — planets transiting this sign bring favorable results.</>}
                        </>
                      : <>
                          <strong>{strongSigns[idx]}</strong> (SAV {ashtakavarga.savTable[signId - 1]})
                          {theme && <> — जब ग्रह यहाँ से गुजरते हैं, तो <em>{theme.hi}</em> में सहयोग और शुभ फल मिलते हैं।</>}
                          {!theme && <> — इस राशि में गोचर शुभ फल देते हैं।</>}
                        </>}
                  </p>
                </div>
              );
            })}
            {weakSignIds.map((signId, idx) => {
              const house = lagnaSign ? ((signId - lagnaSign + 12) % 12) + 1 : 0;
              const theme = house ? HOUSE_LIFE_THEMES[house] : null;
              return (
                <div key={signId} className="flex items-start gap-2">
                  <span className="text-red-400 mt-0.5 shrink-0">●</span>
                  <p className="text-red-400/70">
                    {isEn
                      ? <>
                          <strong>{weakSigns[idx]}</strong> (SAV {ashtakavarga.savTable[signId - 1]})
                          {theme && <> — Transits here may bring challenges in <em>{theme.en}</em>. Extra caution advised during these periods.</>}
                          {!theme && <> — transits through this sign may bring challenges.</>}
                        </>
                      : <>
                          <strong>{weakSigns[idx]}</strong> (SAV {ashtakavarga.savTable[signId - 1]})
                          {theme && <> — यहाँ गोचर <em>{theme.hi}</em> में चुनौतियाँ ला सकते हैं। इन अवधियों में अतिरिक्त सावधानी रखें।</>}
                          {!theme && <> — इस राशि में गोचर चुनौतीपूर्ण हो सकते हैं।</>}
                        </>}
                  </p>
                </div>
              );
            })}
            <p className="text-text-secondary/70 text-xs mt-2">
              {isEn
                ? `Total SAV: ${totalBindu} (average: ${Math.round(totalBindu / 12)} per sign). Values above 28 are strong, below 22 are weak.`
                : `कुल SAV: ${totalBindu} (औसत: ${Math.round(totalBindu / 12)} प्रति राशि)। 28 से ऊपर बलवान, 22 से नीचे दुर्बल।`}
            </p>
          </div>
        </div>
      )}

      {/* Transit Timeline — strong + weak periods */}
      {allTransits.length > 0 && (() => {
        const minY = Math.min(...allTransits.map(t => t.startYear));
        const maxY = Math.max(...allTransits.map(t => t.endYear));
        const totalMonths = (maxY - minY) * 12 + 12;
        const toPercent = (y: number, m: number) => Math.max(0, Math.min(100, ((y - minY) * 12 + m) / totalMonths * 100));
        const years: number[] = [];
        for (let y = minY; y <= maxY; y++) years.push(y);
        const planetGroups = [
          { id: 4, name: locale === 'en' || isTamil ? 'Jupiter' : 'बृहस्पति' },
          { id: 6, name: locale === 'en' || isTamil ? 'Saturn' : 'शनि' },
          { id: 7, name: locale === 'en' || isTamil ? 'Rahu' : 'राहु' },
        ];
        const PLANET_TEXT: Record<number, string> = { 4: 'text-amber-300', 6: 'text-indigo-300', 7: 'text-slate-300' };
        return (
          <div className="rounded-xl bg-gradient-to-br from-[#2d1b69]/30 via-[#1a1040]/40 to-[#0a0e27] border border-gold-primary/12 p-4 sm:p-5">
            <h4 className="text-gold-light text-sm font-bold mb-1">{locale === 'en' || isTamil ? 'Transit Forecast — Next 15 Years' : 'गोचर पूर्वानुमान — अगले 15 वर्ष'}</h4>
            <p className="text-text-secondary/60 text-xs mb-4">
              {locale === 'en' || isTamil
                ? 'Green = transiting your strong signs (favorable). Red = transiting your weak signs (challenging).'
                : 'हरा = आपकी बलवान राशियों में गोचर (शुभ)। लाल = दुर्बल राशियों में गोचर (चुनौतीपूर्ण)।'}
            </p>
            <div className="relative overflow-x-auto">
            <div className="pointer-events-none absolute inset-y-0 right-0 w-8 bg-gradient-to-l from-[#0a0e27] to-transparent sm:hidden z-10" />
            <div className="min-w-[320px] sm:min-w-[480px]">
            <div className="relative h-5 mb-1 ml-14 sm:ml-16">
              {years.map(y => (
                <span key={y} className="absolute text-[9px] text-gray-600 font-mono -translate-x-1/2" style={{ left: `${toPercent(y, 0)}%` }}>
                  {`'${String(y).slice(2)}`}
                </span>
              ))}
            </div>
            <div className="space-y-3">
              {planetGroups.map(pg => {
                const transits = allTransits.filter(t => t.planetId === pg.id);
                if (transits.length === 0) return null;
                return (
                  <div key={pg.id}>
                    <div className="flex items-center gap-0">
                      <div className="w-14 sm:w-16 shrink-0 text-right pr-2">
                        <span className={`text-[10px] font-bold ${PLANET_TEXT[pg.id] || 'text-gray-400'}`}>{pg.name}</span>
                      </div>
                      <div className="flex-1 relative h-6 bg-bg-tertiary/15 rounded-md overflow-hidden">
                        {years.map(y => (
                          <div key={y} className="absolute top-0 bottom-0 border-l border-white/[0.03]" style={{ left: `${toPercent(y, 0)}%` }} />
                        ))}
                        {transits.map((tr, idx) => {
                          const left = toPercent(tr.startYear, tr.startMonth);
                          const right = toPercent(tr.endYear, tr.endMonth);
                          const width = Math.max(right - left, 1);
                          const isStrong = tr.type === 'strong';
                          const barClass = isStrong ? 'bg-emerald-500/70 hover:bg-emerald-500/90' : 'bg-red-500/70 hover:bg-red-500/90';
                          return (
                            <div key={idx} className={`absolute top-0.5 bottom-0.5 rounded-sm ${barClass} cursor-default group/bar transition-colors`} style={{ left: `${left}%`, width: `${width}%` }} title={`${tr.sign}: ${tr.period}`}>
                              {width > 5 && (
                                <span className="absolute inset-0 flex items-center justify-center text-[8px] font-bold text-white/90 truncate px-0.5">
                                  {tr.sign}
                                </span>
                              )}
                              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 hidden group-hover/bar:block z-10 pointer-events-none">
                                <div className="bg-bg-primary/95 border border-gold-primary/20 rounded-md px-2 py-1 shadow-lg whitespace-nowrap">
                                  <span className={`text-[9px] font-bold ${isStrong ? 'text-emerald-400' : 'text-red-400'}`}>{tr.sign}</span>
                                  <span className="text-[9px] text-gray-400 ml-1">{tr.period}</span>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                        <div className="absolute top-0 bottom-0 w-px bg-gold-primary/80" style={{ left: `${toPercent(new Date().getFullYear(), new Date().getMonth())}%` }} />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            </div>
            </div>
            <div className="flex items-center justify-between mt-3 ml-14 sm:ml-16">
              <div className="flex items-center gap-4 text-[10px]">
                <span className="flex items-center gap-1"><span className="w-3 h-2 rounded-sm bg-emerald-500/70" /><span className="text-gray-500">{locale === 'en' || isTamil ? 'Favorable' : 'शुभ'}</span></span>
                <span className="flex items-center gap-1"><span className="w-3 h-2 rounded-sm bg-red-500/70" /><span className="text-gray-500">{locale === 'en' || isTamil ? 'Challenging' : 'चुनौतीपूर्ण'}</span></span>
                <span className="flex items-center gap-1"><span className="w-px h-3 bg-gold-primary/80" /><span className="text-gold-primary/70">NOW</span></span>
              </div>
            </div>
          </div>
        );
      })()}

      <div className="flex justify-center items-center gap-3 mb-6 flex-wrap">
        <button onClick={() => setViewMode('sav')}
          className={`px-5 py-2 rounded-lg text-sm font-bold transition-all ${viewMode === 'sav' ? 'bg-gold-primary/20 text-gold-light border border-gold-primary/40' : 'text-text-secondary border border-gold-primary/10 hover:bg-gold-primary/10'}`}>
          {t('sarvashtakavarga')}
        </button>
        <button onClick={() => setViewMode('bpi')}
          className={`px-5 py-2 rounded-lg text-sm font-bold transition-all ${viewMode === 'bpi' ? 'bg-gold-primary/20 text-gold-light border border-gold-primary/40' : 'text-text-secondary border border-gold-primary/10 hover:bg-gold-primary/10'}`}>
          {t('bhinnashtakavarga')}
        </button>
        <button onClick={() => setViewMode('reduced')}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${viewMode === 'reduced' ? 'bg-gold-primary/20 text-gold-light border border-gold-primary/30' : 'text-text-secondary hover:text-white border border-white/5'}`}>
          {isBengali ? 'শোধিত' : locale === 'en' || isTamil ? 'Reduced (Shodhana)' : 'शोधित'}
        </button>
        <button
          onClick={() => {
            const printWindow = window.open('', '_blank');
            if (!printWindow) return;

            const table = viewMode === 'reduced' && ashtakavarga.reducedBpiTable
              ? ashtakavarga.reducedBpiTable
              : ashtakavarga.bpiTable;
            const savRow = viewMode === 'reduced' && ashtakavarga.reducedSavTable
              ? ashtakavarga.reducedSavTable
              : ashtakavarga.savTable;

            const signs = ['Ari', 'Tau', 'Gem', 'Can', 'Leo', 'Vir', 'Lib', 'Sco', 'Sag', 'Cap', 'Aqu', 'Pis'];
            const planets = ashtakavarga.planetNames;

            let html = `<html><head><title>Ashtakavarga \u2014 ${viewMode === 'reduced' ? 'Reduced (Shodhana)' : 'Raw'}</title>
              <style>
                body { font-family: monospace; padding: 20px; }
                table { border-collapse: collapse; width: 100%; margin-top: 10px; }
                th, td { border: 1px solid #ccc; padding: 6px 8px; text-align: center; font-size: 12px; }
                th { background: #f0f0f0; font-weight: bold; }
                .high { background: #d4edda; }
                .low { background: #f8d7da; }
                h2 { margin-top: 20px; }
                .footer { text-align: center; margin-top: 24px; font-size: 10px; color: #999; border-top: 1px solid #ddd; padding-top: 12px; }
              </style></head><body>`;

            html += `<h1 style="font-family:serif;color:#8B6914;border-bottom:2px solid #d4a853;padding-bottom:12px;margin-bottom:20px">Ashtakavarga \u2014 ${viewMode === 'reduced' ? 'Reduced (Shodhana)' : 'Raw BAV'}</h1>`;
            html += '<table><tr><th>Planet</th>';
            signs.forEach(s => { html += `<th>${s}</th>`; });
            html += '<th>Total</th></tr>';

            table.forEach((row, pIdx) => {
              html += `<tr><td><strong>${planets[pIdx]}</strong></td>`;
              row.forEach(val => {
                const cls = val >= 5 ? 'high' : val <= 1 ? 'low' : '';
                html += `<td class="${cls}">${val}</td>`;
              });
              html += `<td><strong>${row.reduce((a, b) => a + b, 0)}</strong></td></tr>`;
            });

            // SAV row
            html += '<tr style="border-top:2px solid #ccc"><td><strong>SAV</strong></td>';
            savRow.forEach(val => {
              const cls = val >= 28 ? 'high' : val < 22 ? 'low' : '';
              html += `<td class="${cls}"><strong>${val}</strong></td>`;
            });
            html += `<td><strong>${savRow.reduce((a, b) => a + b, 0)}</strong></td></tr></table>`;

            // Pinda section
            if (ashtakavarga.pindaAshtakavarga && ashtakavarga.pindaAshtakavarga.some(v => v > 0)) {
              html += '<h2 style="font-family:serif;color:#8B6914;margin-top:20px">Pinda Ashtakavarga</h2><table><tr><th>Planet</th><th>Pinda</th><th>Rating</th></tr>';
              ashtakavarga.pindaAshtakavarga.forEach((p, i) => {
                const rating = p > 200 ? 'High' : p > 100 ? 'Medium' : 'Low';
                html += `<tr><td>${planets[i]}</td><td>${p}</td><td>${rating}</td></tr>`;
              });
              html += '</table>';
            }

            html += '<div class="footer">Generated by Dekho Panchang \u2014 dekhopanchang.com</div>';
            html += '</body></html>';
            printWindow.document.write(html);
            printWindow.document.close();
            // Wait for fonts/layout before printing
            printWindow.addEventListener('load', () => printWindow.print());
          }}
          className="px-3 py-1.5 rounded-lg text-xs font-medium text-text-secondary hover:text-white border border-white/5 hover:border-white/15 transition-all"
        >
          {isBengali ? 'প্রিন্ট' : locale === 'en' || isTamil ? 'Print BAV' : 'प्रिंट'}
        </button>
      </div>

      {viewMode === 'sav' && (
        <div className="space-y-6">
          <div className="rounded-xl bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 p-4 sm:p-6">
            <h4 className="text-gold-light text-lg font-semibold mb-1" style={headingFont}>{t('sarvashtakavarga')}</h4>
            <p className="text-text-secondary/70 text-xs mb-4">
              {locale === 'en' || isTamil ? 'Total bindu per sign. ≥28 = strong (green), <22 = weak (red).' : 'प्रति राशि कुल बिन्दु। ≥28 = बलवान (हरा), <22 = दुर्बल (लाल)।'}
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-12 gap-3">
              {RASHIS.map((r, i) => {
                const val = ashtakavarga.savTable[i];
                const strong = val >= 28;
                const weak = val < 22;
                const pct = Math.round((val / 56) * 100);
                const barColor = strong ? 'bg-emerald-500/60' : weak ? 'bg-red-500/50' : 'bg-gold-primary/40';
                const borderColor = strong ? 'border-emerald-500/40' : weak ? 'border-red-500/30' : 'border-gold-primary/15';
                const bgColor = strong ? 'bg-emerald-500/8' : weak ? 'bg-red-500/5' : 'bg-bg-tertiary/30';
                return (
                  <motion.div key={r.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.03 }}
                    className={`rounded-xl p-3 text-center border ${borderColor} ${bgColor} relative overflow-hidden`}
                  >
                    <div className={`absolute bottom-0 left-0 right-0 ${barColor} transition-all duration-700`} style={{ height: `${pct}%` }} />
                    <div className="relative z-10">
                      <RashiIconById id={r.id} size={32} />
                      <div className="text-sm font-semibold text-text-secondary mt-1.5" style={isDevanagari ? { fontFamily: 'var(--font-devanagari-body)' } : undefined}>{tl(r.name, locale)}</div>
                      <div className={`text-2xl font-bold mt-1 ${strong ? 'text-emerald-300' : weak ? 'text-red-300' : 'text-gold-light'}`}>{val}</div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
            <div className="flex items-center justify-center gap-6 mt-5 text-xs">
              <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-sm bg-emerald-500/60" />{locale === 'en' || isTamil ? '≥28 Strong' : '≥28 बलवान'}</span>
              <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-sm bg-gold-primary/40" />{locale === 'en' || isTamil ? '22–27 Average' : '22–27 औसत'}</span>
              <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-sm bg-red-500/50" />{locale === 'en' || isTamil ? '<22 Weak' : '<22 दुर्बल'}</span>
            </div>
            <div className="text-center text-text-secondary text-sm font-semibold mt-3">
              {t('totalBindu')}: {ashtakavarga.savTable.reduce((a, b) => a + b, 0)}
            </div>
          </div>

          <div className="rounded-xl bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 p-5">
            <h4 className="text-gold-light font-semibold text-sm mb-1" style={headingFont}>
              {isBengali ? 'ত্রিকোণ + একাধিপত্য শোধন (পরিমার্জিত SAV)' : locale === 'en' || isTamil ? 'Trikona + Ekadhipatya Shodhana (Refined SAV)' : 'त्रिकोण + एकाधिपत्य शोधन (परिष्कृत SAV)'}
            </h4>
            <p className="text-text-secondary/70 text-xs mb-4">
              {locale === 'en' || isTamil
                ? 'After Trikona & Ekadhipatya reductions per BPHS Ch.66-67 — the essential signal. Higher = genuinely strong for transits.'
                : 'BPHS अ.66-67 अनुसार त्रिकोण और एकाधिपत्य शोधन के बाद — मूल संकेत। अधिक = गोचर के लिए वास्तविक बलवान।'}
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-12 gap-1.5">
              {RASHIS.map((r, i) => {
                const val = ashtakavarga.reducedSavTable[i];
                const color = val >= 5 ? 'text-emerald-400' : val <= 1 ? 'text-red-400' : 'text-gold-primary/80';
                return (
                  <div key={r.id} className="text-center p-2 rounded-lg bg-bg-secondary/30 border border-gold-primary/8">
                    <div className="text-[9px] text-text-secondary/65 mb-0.5" style={isDevanagari ? { fontFamily: 'var(--font-devanagari-body)' } : undefined}>{tl(r.name, locale).slice(0, 3)}</div>
                    <div className={`text-lg font-bold font-mono ${color}`}>{val}</div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {viewMode === 'bpi' && (
        <div className="rounded-xl bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 p-6 overflow-x-auto">
          <h4 className="text-gold-light text-lg font-semibold mb-4" style={headingFont}>{t('bhinnashtakavarga')}</h4>
          <p className="text-text-secondary text-xs mb-4">
            {locale === 'en' || isTamil ? 'Individual planet bindu points per sign (max 8 per cell).' : 'प्रत्येक ग्रह के बिन्दु प्रति राशि (अधिकतम 8 प्रति कक्ष)।'}
          </p>
          <div className="min-w-[320px] sm:min-w-[640px]">
            <table className="w-full text-[10px] sm:text-xs md:text-sm">
              <thead>
                <tr>
                  <th className="text-left text-gold-dark text-xs p-2">{locale === 'en' || isTamil ? 'Planet' : 'ग्रह'}</th>
                  {RASHIS.map(r => (
                    <th key={r.id} className="text-center p-1">
                      <div className="flex flex-col items-center">
                        <RashiIconById id={r.id} size={16} />
                        <span className="text-xs text-text-secondary/75 mt-0.5" style={isDevanagari ? { fontFamily: 'var(--font-devanagari-body)' } : undefined}>{tl(r.name, locale).slice(0, 3)}</span>
                      </div>
                    </th>
                  ))}
                  <th className="text-center text-gold-dark text-xs p-2">{locale === 'en' || isTamil ? 'Total' : 'कुल'}</th>
                </tr>
              </thead>
              <tbody>
                {ashtakavarga.bpiTable.map((row, pi) => {
                  const graha = GRAHAS[pi];
                  const total = row.reduce((a, b) => a + b, 0);
                  return (
                    <tr key={pi} className="border-t border-gold-primary/5">
                      <td className="p-2">
                        <div className="flex items-center gap-1.5">
                          <GrahaIconById id={pi} size={20} />
                          <span className="text-xs font-medium" style={{ color: graha.color, ...(isDevanagari ? { fontFamily: 'var(--font-devanagari-body)' } : {}) }}>{tl(graha.name, locale)}</span>
                        </div>
                      </td>
                      {row.map((val, si) => (
                        <td key={si} className="text-center p-1">
                          <span className={`text-xs font-mono ${val >= 5 ? 'text-emerald-400' : val <= 2 ? 'text-red-400/70' : 'text-text-secondary'}`}>{val}</span>
                        </td>
                      ))}
                      <td className="text-center p-2 font-bold text-gold-light text-xs">{total}</td>
                    </tr>
                  );
                })}
                <tr className="border-t-2 border-gold-primary/20">
                  <td className="p-2 font-bold text-gold-dark text-xs">SAV</td>
                  {ashtakavarga.savTable.map((val, si) => (
                    <td key={si} className="text-center p-1">
                      <span className={`text-xs font-bold ${val >= 28 ? 'text-emerald-400' : val < 22 ? 'text-red-400' : 'text-gold-light'}`}>{val}</span>
                    </td>
                  ))}
                  <td className="text-center p-2 font-bold text-gold-primary text-sm">{ashtakavarga.savTable.reduce((a, b) => a + b, 0)}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {viewMode === 'reduced' && ashtakavarga.reducedBpiTable && (
        <div className="space-y-4">
          <p className="text-text-secondary text-xs">
            {isBengali
              ? 'ত্রিকোণ ও একাধিপত্য শোধনের পর (BPHS অ.৬৬-৬৭)। শোধিত মান প্রতি রাশিতে গ্রহের আপেক্ষিক বল দেখায়।'
              : locale === 'en' || isTamil
              ? 'After Trikona & Ekadhipatya Shodhana (BPHS Ch.66-67). Reduced values show relative planetary strength per sign.'
              : 'त्रिकोण और एकाधिपत्य शोधन (BPHS अ.66-67) के बाद। शोधित मान प्रति राशि ग्रह का सापेक्ष बल दर्शाते हैं।'}
          </p>
          {ashtakavarga.reducedBpiTable.map((row, pIdx) => (
            <div key={pIdx} className="rounded-lg border border-gold-primary/10 p-3">
              <div className="text-gold-light text-sm font-semibold mb-2">{ashtakavarga.planetNames[pIdx]}</div>
              <div className="grid grid-cols-12 gap-1">
                {row.map((val, sIdx) => (
                  <div key={sIdx} className={`text-center text-xs font-mono rounded py-1 ${val === 0 ? 'bg-white/[0.02] text-white/20' : val <= 2 ? 'bg-gold-primary/10 text-gold-dark' : val <= 4 ? 'bg-gold-primary/20 text-gold-light' : 'bg-emerald-500/20 text-emerald-300'}`}>
                    {val}
                  </div>
                ))}
              </div>
              <div className="text-right text-xs text-text-secondary mt-1">
                {isBengali ? 'মোট' : locale === 'en' || isTamil ? 'Total' : 'कुल'}: {row.reduce((a, b) => a + b, 0)}
              </div>
            </div>
          ))}
          <div className="rounded-lg border border-gold-primary/15 p-4 mt-4">
            <div className="text-gold-light text-sm font-semibold mb-3">
              {isBengali ? 'SAV তুলনা: মূল বনাম শোধিত' : locale === 'en' || isTamil ? 'SAV Comparison: Raw vs Reduced' : 'SAV तुलना: मूल बनाम शोधित'}
            </div>
            <div className="grid grid-cols-12 gap-1">
              {ashtakavarga.reducedSavTable.map((val, sIdx) => (
                <div key={sIdx} className="text-center">
                  <div className="text-[9px] text-text-secondary mb-0.5">{RASHIS[sIdx]?.name?.en?.slice(0, 3)}</div>
                  <div className="h-16 relative bg-white/[0.03] rounded overflow-hidden">
                    <div className="absolute bottom-0 w-full border border-gold-primary/20 rounded-sm" style={{ height: `${Math.min(100, (ashtakavarga.savTable[sIdx] / 40) * 100)}%` }} />
                    <div className={`absolute bottom-0 w-full rounded-sm ${val >= 20 ? 'bg-emerald-500/40' : val >= 14 ? 'bg-gold-primary/30' : 'bg-red-500/30'}`} style={{ height: `${Math.min(100, (val / 40) * 100)}%` }} />
                  </div>
                  <div className="text-[10px] font-mono text-gold-light mt-0.5">{val}</div>
                </div>
              ))}
            </div>
            <div className="flex justify-center gap-4 mt-2 text-[9px] text-text-secondary">
              <span className="flex items-center gap-1"><span className="w-3 h-2 border border-gold-primary/20 rounded-sm inline-block" /> {isBengali ? 'মূল SAV' : locale === 'en' || isTamil ? 'Raw SAV' : 'मूल SAV'}</span>
              <span className="flex items-center gap-1"><span className="w-3 h-2 bg-gold-primary/30 rounded-sm inline-block" /> {isBengali ? 'শোধিত SAV' : locale === 'en' || isTamil ? 'Reduced SAV' : 'शोधित SAV'}</span>
            </div>
          </div>
        </div>
      )}

      {/* Pinda Ashtakavarga (BPHS Ch.69) */}
      {ashtakavarga.pindaAshtakavarga && ashtakavarga.pindaAshtakavarga.some(v => v > 0) && (
        <div className="mt-6">
          <h4 className="text-gold-light text-sm font-bold mb-3">
            {isBengali ? 'পিণ্ড অষ্টকবর্গ (BPHS অ.৬৯)' : locale === 'en' || isTamil ? 'Pinda Ashtakavarga (BPHS Ch.69)' : 'पिण्ड अष्टकवर्ग (BPHS अ.69)'}
          </h4>
          <p className="text-text-secondary text-xs mb-3">
            {isBengali
              ? 'প্রতি গ্রহের ভারিত সামগ্রিক বল। উচ্চ পিণ্ড = দশা ও গোচর কালে ফল দেওয়ার অধিক ক্ষমতা।'
              : locale === 'en' || isTamil
              ? 'Weighted composite strength per planet. Higher Pinda = stronger capacity to deliver results during dasha and transit periods.'
              : 'प्रति ग्रह भारित समग्र बल। उच्च पिण्ड = दशा और गोचर काल में फल देने की अधिक क्षमता।'}
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
            {ashtakavarga.pindaAshtakavarga.map((pinda, pIdx) => {
              const label = pinda > 200 ? 'High' : pinda > 100 ? 'Medium' : 'Low';
              const labelHi = pinda > 200 ? 'उच्च' : pinda > 100 ? 'मध्यम' : 'न्यून';
              const labelBn = pinda > 200 ? 'উচ্চ' : pinda > 100 ? 'মধ্যম' : 'নিম্ন';
              const color = pinda > 200 ? 'text-emerald-400 border-emerald-500/20' : pinda > 100 ? 'text-gold-light border-gold-primary/20' : 'text-red-400 border-red-500/20';
              return (
                <div key={pIdx} className={`rounded-xl border p-3 text-center ${color}`}>
                  <div className="text-text-secondary text-xs mb-1">{ashtakavarga.planetNames[pIdx]}</div>
                  <div className="text-2xl font-bold font-mono">{pinda}</div>
                  <div className="text-xs mt-1 opacity-70">{isBengali ? labelBn : locale === 'en' || isTamil ? label : labelHi}</div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
