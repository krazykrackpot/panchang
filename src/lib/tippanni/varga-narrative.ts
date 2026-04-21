/**
 * Varga Narrative Builder
 *
 * Transforms structured DeepVargaResult data into coherent multi-paragraph
 * prose (EN + HI). Up to 7 paragraphs, each a pure function of the data:
 *
 *   P1 — Chart Identity (ascendant, lagna lord, dispositor chain)
 *   P2 — Dignity Shifts (D1↔Dxx, vargottama, pushkara, gandanta)
 *   P3 — Key House & Lordship (lords, argala, jaimini, parivartana)
 *   P4 — Yogas & Strengths (yogas, varga visesha, SAV overlay)
 *   P5 — Promise vs Delivery (scores, verdict)
 *   P6 — Timing & Dasha (dasha lord placement, combustion/retro)
 *   P7 — Practical Guidance (actionable insights)
 *
 * Planet IDs: 0=Sun, 1=Moon, 2=Mars, 3=Mercury, 4=Jupiter,
 *             5=Venus, 6=Saturn, 7=Rahu, 8=Ketu
 * Rashi IDs: 1-based (1–12)
 */

import type {
  DeepVargaResult,
  CrossCorrelation,
  PromiseDeliveryScore,
  DignityShift,
  DignityLevel,
  VargaVisesha,
  VargaDomain,
} from './varga-tippanni-types-v2';

// ---------------------------------------------------------------------------
// Lookup tables
// ---------------------------------------------------------------------------

const SIGN_EN = ['', 'Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo',
  'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'];
const SIGN_HI = ['', 'मेष', 'वृषभ', 'मिथुन', 'कर्क', 'सिंह', 'कन्या',
  'तुला', 'वृश्चिक', 'धनु', 'मकर', 'कुम्भ', 'मीन'];

const PLANET_EN = ['Sun', 'Moon', 'Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn', 'Rahu', 'Ketu'];
const PLANET_HI = ['सूर्य', 'चन्द्र', 'मंगल', 'बुध', 'गुरु', 'शुक्र', 'शनि', 'राहु', 'केतु'];

/** Sign lord mapping (rashi 1–12 → planet ID) */
const SIGN_LORD: Record<number, number> = {
  1: 2, 2: 5, 3: 3, 4: 1, 5: 0, 6: 3,
  7: 5, 8: 2, 9: 4, 10: 6, 11: 6, 12: 4,
};

const DOMAIN_LABEL_EN: Record<VargaDomain, string> = {
  marriage: 'marriage and partnership',
  career: 'career and profession',
  children: 'children and progeny',
  wealth: 'wealth and financial stability',
  spiritual: 'spiritual growth and moksha',
  health: 'health and vitality',
  family: 'family and ancestral connections',
  education: 'education and learning',
};

const DOMAIN_LABEL_HI: Record<VargaDomain, string> = {
  marriage: 'विवाह एवं साझेदारी',
  career: 'व्यवसाय एवं कर्म',
  children: 'सन्तान एवं वंश',
  wealth: 'धन एवं आर्थिक स्थिरता',
  spiritual: 'आध्यात्मिक विकास एवं मोक्ष',
  health: 'स्वास्थ्य एवं जीवन-शक्ति',
  family: 'परिवार एवं पैतृक सम्बन्ध',
  education: 'शिक्षा एवं विद्या',
};

const DIGNITY_EN: Record<DignityLevel, string> = {
  exalted: 'exalted', own: 'in own sign', friend: 'in a friendly sign',
  neutral: 'neutral', enemy: 'in an enemy sign', debilitated: 'debilitated',
};

const DIGNITY_HI: Record<DignityLevel, string> = {
  exalted: 'उच्च', own: 'स्वगृही', friend: 'मित्र राशि में',
  neutral: 'समराशि में', enemy: 'शत्रु राशि में', debilitated: 'नीच',
};

const VISESHA_EN: Record<VargaVisesha, string> = {
  parijatamsha: 'Parijatamsha (good)', uttamamsha: 'Uttamamsha (excellent)',
  gopuramsha: 'Gopuramsha (strong)', simhasanamsha: 'Simhasanamsha (royal)',
  paravatamsha: 'Paravatamsha (divine)', devalokamsha: 'Devalokamsha (supreme)',
  none: '',
};

const VISESHA_HI: Record<VargaVisesha, string> = {
  parijatamsha: 'पारिजातांश (शुभ)', uttamamsha: 'उत्तमांश (उत्कृष्ट)',
  gopuramsha: 'गोपुरांश (बलवान)', simhasanamsha: 'सिंहासनांश (राजयोग)',
  paravatamsha: 'पारावतांश (दिव्य)', devalokamsha: 'देवलोकांश (सर्वोच्च)',
  none: '',
};

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function pEN(id: number): string { return PLANET_EN[id] ?? `Planet${id}`; }
function pHI(id: number): string { return PLANET_HI[id] ?? `ग्रह${id}`; }
function sEN(id: number): string { return SIGN_EN[id] ?? `Sign${id}`; }
function sHI(id: number): string { return SIGN_HI[id] ?? `राशि${id}`; }

function ordinal(n: number): string {
  if (n === 1) return '1st';
  if (n === 2) return '2nd';
  if (n === 3) return '3rd';
  return `${n}th`;
}

function hindiOrdinal(n: number): string {
  return `${n}वें`;
}

/** Rank dignity shifts by magnitude (exalted=5, debilitated=0). */
const DIGNITY_RANK: Record<DignityLevel, number> = {
  exalted: 5, own: 4, friend: 3, neutral: 2, enemy: 1, debilitated: 0,
};

function shiftMagnitude(ds: DignityShift): number {
  return Math.abs(DIGNITY_RANK[ds.dxxDignity] - DIGNITY_RANK[ds.d1Dignity]);
}

// ---------------------------------------------------------------------------
// P1 — Chart Identity
// ---------------------------------------------------------------------------

function buildP1(cc: CrossCorrelation, chartId: string, domain: VargaDomain): { en: string; hi: string } {
  const parts_en: string[] = [];
  const parts_hi: string[] = [];

  // Lagna from first keyHouseLord entry for house 1, or from dispositor chain
  const lagnaLord = cc.keyHouseLords.find(k => k.house === 1);
  const dc = cc.dispositorChain;

  if (lagnaLord) {
    const lagnaSign = lagnaLord.lordSign;
    // The lagna sign is the sign of house 1; the lord's sign is where the lord sits
    parts_en.push(
      `Your ${chartId} chart for ${DOMAIN_LABEL_EN[domain]} has ${sEN(lagnaSign)} influences, ` +
      `with the ${ordinal(1)} house lord ${pEN(lagnaLord.lordId)} placed ${DIGNITY_EN[lagnaLord.lordDignity]}.`
    );
    parts_hi.push(
      `${DOMAIN_LABEL_HI[domain]} हेतु आपके ${chartId} वर्ग में ${sHI(lagnaSign)} का प्रभाव है, ` +
      `लग्नेश ${pHI(lagnaLord.lordId)} ${DIGNITY_HI[lagnaLord.lordDignity]} स्थित हैं।`
    );
  } else {
    parts_en.push(`Your ${chartId} chart governs ${DOMAIN_LABEL_EN[domain]}.`);
    parts_hi.push(`आपका ${chartId} वर्ग ${DOMAIN_LABEL_HI[domain]} को दर्शाता है।`);
  }

  // Functional nature
  const yogaKarakaIds = cc.keyHouseLords
    .filter(k => k.lordDignity === 'own' || k.lordDignity === 'exalted')
    .map(k => k.lordId);
  if (yogaKarakaIds.length > 0) {
    const names_en = yogaKarakaIds.slice(0, 3).map(pEN).join(', ');
    const names_hi = yogaKarakaIds.slice(0, 3).map(pHI).join(', ');
    parts_en.push(`${names_en} ${yogaKarakaIds.length === 1 ? 'functions' : 'function'} as dignified planet${yogaKarakaIds.length > 1 ? 's' : ''} in this chart.`);
    parts_hi.push(`${names_hi} इस वर्ग में गरिमायुक्त ग्रह ${yogaKarakaIds.length === 1 ? 'है' : 'हैं'}।`);
  }

  // Dispositor chain
  if (dc.chain.length > 0) {
    if (dc.finalDispositor !== null) {
      parts_en.push(
        `The dispositor chain terminates at ${pEN(dc.finalDispositor)} — ` +
        `this planet's significations colour the entire ${DOMAIN_LABEL_EN[domain]} theme.`
      );
      parts_hi.push(
        `अधिपति-श्रृंखला ${pHI(dc.finalDispositor)} पर समाप्त होती है — ` +
        `यह ग्रह सम्पूर्ण ${DOMAIN_LABEL_HI[domain]} के विषय को प्रभावित करता है।`
      );
    } else if (dc.isCircular) {
      parts_en.push('The dispositor chain forms a closed loop — multiple planets share control over this domain.');
      parts_hi.push('अधिपति-श्रृंखला एक वृत्ताकार पाश बनाती है — अनेक ग्रह इस क्षेत्र पर सम्मिलित नियन्त्रण रखते हैं।');
    }
  }

  return { en: parts_en.join(' '), hi: parts_hi.join(' ') };
}

// ---------------------------------------------------------------------------
// P2 — Dignity Shifts
// ---------------------------------------------------------------------------

function buildP2(cc: CrossCorrelation): { en: string; hi: string } {
  const parts_en: string[] = [];
  const parts_hi: string[] = [];

  // Top 3–4 most significant dignity shifts
  const sorted = [...cc.dignityShifts]
    .filter(ds => ds.shift !== 'same')
    .sort((a, b) => shiftMagnitude(b) - shiftMagnitude(a))
    .slice(0, 4);

  if (sorted.length === 0 && cc.vargottamaPlanets.length === 0) {
    return { en: '', hi: '' };
  }

  for (const ds of sorted) {
    const dir = ds.shift === 'improved' ? 'improves' : ds.shift === 'declined' ? 'declines' : 'shifts';
    const dirHi = ds.shift === 'improved' ? 'सुधार' : ds.shift === 'declined' ? 'गिरावट' : 'परिवर्तन';

    parts_en.push(
      `${pEN(ds.planetId)} moves from ${sEN(ds.d1Sign)} (D1, ${DIGNITY_EN[ds.d1Dignity]}) ` +
      `to ${sEN(ds.dxxSign)} (${DIGNITY_EN[ds.dxxDignity]}) — a significant ${dir}.`
    );
    parts_hi.push(
      `${pHI(ds.planetId)} ${sHI(ds.d1Sign)} (D1, ${DIGNITY_HI[ds.d1Dignity]}) से ` +
      `${sHI(ds.dxxSign)} (${DIGNITY_HI[ds.dxxDignity]}) में जाता है — उल्लेखनीय ${dirHi}।`
    );
  }

  // Vargottama
  if (cc.vargottamaPlanets.length > 0) {
    const names_en = cc.vargottamaPlanets.map(pEN).join(', ');
    const names_hi = cc.vargottamaPlanets.map(pHI).join(', ');
    parts_en.push(
      `${names_en} ${cc.vargottamaPlanets.length === 1 ? 'is' : 'are'} Vargottama (same sign in D1 and this varga) — ` +
      `a mark of consistent strength.`
    );
    parts_hi.push(
      `${names_hi} वर्गोत्तम ${cc.vargottamaPlanets.length === 1 ? 'है' : 'हैं'} (D1 और इस वर्ग में एक ही राशि) — ` +
      `यह निरन्तर बल का चिह्न है।`
    );
  }

  // Pushkara
  const pushkara = cc.pushkaraChecks.filter(p => p.isPushkaraNavamsha || p.isPushkaraBhaga);
  if (pushkara.length > 0) {
    const names_en = pushkara.map(p => pEN(p.planetId)).join(', ');
    const names_hi = pushkara.map(p => pHI(p.planetId)).join(', ');
    parts_en.push(`${names_en} ${pushkara.length === 1 ? 'occupies' : 'occupy'} a Pushkara position — exceptionally benefic placement.`);
    parts_hi.push(`${names_hi} पुष्कर स्थान में ${pushkara.length === 1 ? 'है' : 'हैं'} — अत्यन्त शुभ स्थिति।`);
  }

  // Gandanta
  const gandanta = cc.gandantaChecks.filter(g => g.isGandanta && g.severity !== 'none');
  if (gandanta.length > 0) {
    for (const g of gandanta.slice(0, 2)) {
      parts_en.push(
        `${pEN(g.planetId)} is at a Gandanta junction (${g.junction}, ${g.severity} severity) — ` +
        `a zone of karmic intensity requiring conscious navigation.`
      );
      parts_hi.push(
        `${pHI(g.planetId)} गण्डान्त सन्धि (${g.junction}, ${g.severity === 'severe' ? 'गम्भीर' : g.severity === 'moderate' ? 'मध्यम' : 'सौम्य'}) पर है — ` +
        `यह कार्मिक तीव्रता का क्षेत्र है जिसमें सचेतन प्रयास आवश्यक है।`
      );
    }
  }

  return { en: parts_en.join(' '), hi: parts_hi.join(' ') };
}

// ---------------------------------------------------------------------------
// P3 — Key House & Lordship
// ---------------------------------------------------------------------------

function buildP3(cc: CrossCorrelation, domain: VargaDomain): { en: string; hi: string } {
  const parts_en: string[] = [];
  const parts_hi: string[] = [];

  // Key house lords (skip house 1 which was covered in P1)
  const nonLagnaLords = cc.keyHouseLords.filter(k => k.house !== 1);
  for (const khl of nonLagnaLords.slice(0, 3)) {
    parts_en.push(
      `The ${ordinal(khl.house)} house lord ${pEN(khl.lordId)} is placed in ${sEN(khl.lordSign)}, ` +
      `${DIGNITY_EN[khl.lordDignity]}.`
    );
    parts_hi.push(
      `${hindiOrdinal(khl.house)} भाव का स्वामी ${pHI(khl.lordId)} ${sHI(khl.lordSign)} में ` +
      `${DIGNITY_HI[khl.lordDignity]} स्थित है।`
    );
  }

  // Argala on key houses
  for (const arg of cc.argalaOnKeyHouses.slice(0, 2)) {
    if (arg.supporting.length > 0) {
      const supporters_en = arg.supporting.map(pEN).join(', ');
      const supporters_hi = arg.supporting.map(pHI).join(', ');
      parts_en.push(
        `The ${ordinal(arg.house)} house receives supporting Argala from ${supporters_en}.`
      );
      parts_hi.push(
        `${hindiOrdinal(arg.house)} भाव को ${supporters_hi} से पोषक अर्गला प्राप्त है।`
      );
    }
    if (arg.obstructing.length > 0) {
      const obs_en = arg.obstructing.map(pEN).join(', ');
      const obs_hi = arg.obstructing.map(pHI).join(', ');
      parts_en.push(`However, obstructing Argala from ${obs_en} limits its full expression.`);
      parts_hi.push(`किन्तु ${obs_hi} से विरोधी अर्गला इसकी पूर्ण अभिव्यक्ति सीमित करती है।`);
    }
  }

  // Jaimini karakas
  for (const jk of cc.jaiminiKarakas.slice(0, 2)) {
    parts_en.push(
      `Your ${jk.karaka} (${pEN(jk.planetId)}) falls in the ${ordinal(jk.house)} house in ${sEN(jk.sign)}.`
    );
    parts_hi.push(
      `आपका ${jk.karaka} (${pHI(jk.planetId)}) ${sHI(jk.sign)} में ${hindiOrdinal(jk.house)} भाव में स्थित है।`
    );
  }

  // Parivartana
  for (const pv of cc.parivartanas.slice(0, 2)) {
    parts_en.push(
      `${pEN(pv.planet1Id)} and ${pEN(pv.planet2Id)} form a Parivartana Yoga ` +
      `(mutual exchange between ${sEN(pv.sign1)} and ${sEN(pv.sign2)}) — ${pv.significance.en || 'strengthening both houses'}.`
    );
    parts_hi.push(
      `${pHI(pv.planet1Id)} और ${pHI(pv.planet2Id)} परिवर्तन योग बनाते हैं ` +
      `(${sHI(pv.sign1)} और ${sHI(pv.sign2)} का आपसी विनिमय) — ${pv.significance.hi || pv.significance.en || 'दोनों भावों को बल प्रदान करता है'}।`
    );
  }

  if (parts_en.length === 0) {
    return { en: '', hi: '' };
  }

  return { en: parts_en.join(' '), hi: parts_hi.join(' ') };
}

// ---------------------------------------------------------------------------
// P4 — Yogas & Strengths
// ---------------------------------------------------------------------------

function buildP4(cc: CrossCorrelation, chartId: string): { en: string; hi: string } {
  const parts_en: string[] = [];
  const parts_hi: string[] = [];

  // Yogas
  if (cc.yogasInChart.length > 0) {
    for (const yoga of cc.yogasInChart.slice(0, 3)) {
      const planetNames_en = yoga.planets.map(pEN).join(', ');
      const planetNames_hi = yoga.planets.map(pHI).join(', ');
      parts_en.push(
        `${yoga.name} forms in your ${chartId} (involving ${planetNames_en}) — ${yoga.significance.en || 'a notable combination'}.`
      );
      parts_hi.push(
        `${yoga.name} आपके ${chartId} में बनता है (${planetNames_hi} सम्मिलित) — ${yoga.significance.hi || yoga.significance.en || 'एक उल्लेखनीय योग'}।`
      );
    }
  }

  // Varga Visesha
  const notable = cc.vargaVisesha.filter(v => v.classification !== 'none');
  if (notable.length > 0) {
    for (const v of notable.slice(0, 3)) {
      const label_en = VISESHA_EN[v.classification];
      const label_hi = VISESHA_HI[v.classification];
      if (label_en) {
        parts_en.push(`${pEN(v.planetId)} holds ${label_en} classification across the Shad-Varga scheme.`);
        parts_hi.push(`${pHI(v.planetId)} षड्-वर्ग योजना में ${label_hi} वर्गीकरण रखता है।`);
      }
    }
  }

  // SAV overlay
  const strongSav = cc.savOverlay.filter(s => s.quality === 'strong');
  const weakSav = cc.savOverlay.filter(s => s.quality === 'weak');
  if (strongSav.length > 0) {
    const signs_en = strongSav.map(s => `${sEN(s.sign)} (${s.bindus} bindus)`).join(', ');
    const signs_hi = strongSav.map(s => `${sHI(s.sign)} (${s.bindus} बिन्दु)`).join(', ');
    parts_en.push(`Sarvashtakavarga shows strong support at ${signs_en}.`);
    parts_hi.push(`सर्वाष्टकवर्ग ${signs_hi} पर प्रबल सहयोग दर्शाता है।`);
  }
  if (weakSav.length > 0) {
    const signs_en = weakSav.map(s => `${sEN(s.sign)} (${s.bindus} bindus)`).join(', ');
    const signs_hi = weakSav.map(s => `${sHI(s.sign)} (${s.bindus} बिन्दु)`).join(', ');
    parts_en.push(`Caution is warranted at ${signs_en} where SAV bindus are low.`);
    parts_hi.push(`${signs_hi} पर SAV बिन्दु कम हैं, सावधानी आवश्यक है।`);
  }

  // Aspects on key houses
  const beneficAspects = cc.aspectsOnKeyHouses.filter(
    a => a.aspectingPlanets.some(p => p.type === 'benefic')
  );
  if (beneficAspects.length > 0) {
    const first = beneficAspects[0];
    const benefics_en = first.aspectingPlanets
      .filter(p => p.type === 'benefic')
      .map(p => pEN(p.id))
      .join(', ');
    const benefics_hi = first.aspectingPlanets
      .filter(p => p.type === 'benefic')
      .map(p => pHI(p.id))
      .join(', ');
    if (benefics_en) {
      parts_en.push(`Benefic aspects from ${benefics_en} on the ${ordinal(first.house)} house add protective grace.`);
      parts_hi.push(`${hindiOrdinal(first.house)} भाव पर ${benefics_hi} की शुभ दृष्टि सुरक्षात्मक कृपा प्रदान करती है।`);
    }
  }

  if (parts_en.length === 0) {
    return { en: '', hi: '' };
  }

  return { en: parts_en.join(' '), hi: parts_hi.join(' ') };
}

// ---------------------------------------------------------------------------
// P5 — Promise vs Delivery
// ---------------------------------------------------------------------------

function buildP5(pd: PromiseDeliveryScore, domain: VargaDomain): { en: string; hi: string } {
  const en =
    `D1 promise score: ${pd.d1Promise}/100. ` +
    `Divisional delivery score: ${pd.dxxDelivery}/100. ` +
    `${pd.verdict.en || 'Assessment unavailable.'}`;

  const hi =
    `D1 वचन अंक: ${pd.d1Promise}/100। ` +
    `वर्ग-फल अंक: ${pd.dxxDelivery}/100। ` +
    `${pd.verdict.hi || pd.verdict.en || 'मूल्यांकन उपलब्ध नहीं है।'}`;

  return { en, hi };
}

// ---------------------------------------------------------------------------
// P6 — Timing & Dasha
// ---------------------------------------------------------------------------

function buildP6(cc: CrossCorrelation, chartId: string, domain: VargaDomain): { en: string; hi: string } {
  const dl = cc.dashaLordPlacement;
  if (!dl) {
    return { en: '', hi: '' };
  }

  const parts_en: string[] = [];
  const parts_hi: string[] = [];

  parts_en.push(
    `The current Mahadasha lord ${pEN(dl.lordId)} is placed in the ${ordinal(dl.house)} house ` +
    `of your ${chartId} in ${sEN(dl.sign)}, ${DIGNITY_EN[dl.dignity]}.`
  );
  parts_hi.push(
    `वर्तमान महादशा स्वामी ${pHI(dl.lordId)} आपके ${chartId} में ${sHI(dl.sign)} में ` +
    `${hindiOrdinal(dl.house)} भाव में ${DIGNITY_HI[dl.dignity]} स्थित है।`
  );

  // Interpret house placement
  const kendras = [1, 4, 7, 10];
  const trikonas = [1, 5, 9];
  const dusthanas = [6, 8, 12];

  if (kendras.includes(dl.house)) {
    parts_en.push(`Placement in a kendra house (${ordinal(dl.house)}) activates ${DOMAIN_LABEL_EN[domain]} themes powerfully during this period.`);
    parts_hi.push(`केन्द्र भाव (${hindiOrdinal(dl.house)}) में स्थिति इस अवधि में ${DOMAIN_LABEL_HI[domain]} के विषयों को प्रबलता से सक्रिय करती है।`);
  } else if (trikonas.includes(dl.house)) {
    parts_en.push(`Trikona placement (${ordinal(dl.house)}) brings dharmic support to ${DOMAIN_LABEL_EN[domain]} during this period.`);
    parts_hi.push(`त्रिकोण स्थिति (${hindiOrdinal(dl.house)}) इस अवधि में ${DOMAIN_LABEL_HI[domain]} को धार्मिक सहयोग देती है।`);
  } else if (dusthanas.includes(dl.house)) {
    parts_en.push(`Dusthana placement (${ordinal(dl.house)}) indicates challenges in ${DOMAIN_LABEL_EN[domain]} — patience and remedial measures are advised.`);
    parts_hi.push(`दुःस्थान स्थिति (${hindiOrdinal(dl.house)}) ${DOMAIN_LABEL_HI[domain]} में चुनौतियों का संकेत है — धैर्य और उपचार आवश्यक हैं।`);
  }

  // Dignity-based commentary
  if (dl.dignity === 'exalted' || dl.dignity === 'own') {
    parts_en.push(`The dasha lord is strong here — favourable outcomes are likely.`);
    parts_hi.push(`दशा स्वामी यहाँ बलवान है — अनुकूल परिणाम सम्भावित हैं।`);
  } else if (dl.dignity === 'debilitated' || dl.dignity === 'enemy') {
    parts_en.push(`The dasha lord is weakened — this period may require extra effort in ${DOMAIN_LABEL_EN[domain]}.`);
    parts_hi.push(`दशा स्वामी दुर्बल है — ${DOMAIN_LABEL_HI[domain]} में इस अवधि में अतिरिक्त प्रयास आवश्यक हो सकता है।`);
  }

  return { en: parts_en.join(' '), hi: parts_hi.join(' ') };
}

// ---------------------------------------------------------------------------
// P7 — Practical Guidance
// ---------------------------------------------------------------------------

function buildP7(
  cc: CrossCorrelation,
  pd: PromiseDeliveryScore,
  domain: VargaDomain,
): { en: string; hi: string } {
  const insights_en: string[] = [];
  const insights_hi: string[] = [];

  // Insight from dignity improvements
  const improved = cc.dignityShifts.filter(ds => ds.shift === 'improved');
  if (improved.length > 0) {
    const best = improved.sort((a, b) => shiftMagnitude(b) - shiftMagnitude(a))[0];
    insights_en.push(`Leverage ${pEN(best.planetId)}'s strengthened position — its significations are amplified in this domain.`);
    insights_hi.push(`${pHI(best.planetId)} की सुदृढ़ स्थिति का लाभ उठाएँ — इसके कारकत्व इस क्षेत्र में प्रबल हैं।`);
  }

  // Insight from dignity declines
  const declined = cc.dignityShifts.filter(ds => ds.shift === 'declined');
  if (declined.length > 0) {
    const worst = declined.sort((a, b) => shiftMagnitude(b) - shiftMagnitude(a))[0];
    insights_en.push(`Be mindful of ${pEN(worst.planetId)}'s weakened state — remedial measures (gemstone, mantra, charity) may help.`);
    insights_hi.push(`${pHI(worst.planetId)} की दुर्बल स्थिति के प्रति सचेत रहें — उपचार (रत्न, मन्त्र, दान) सहायक हो सकते हैं।`);
  }

  // Insight from gandanta
  const gandanta = cc.gandantaChecks.filter(g => g.isGandanta && g.severity !== 'none');
  if (gandanta.length > 0) {
    insights_en.push(`Gandanta placements indicate karmic lessons — embrace transformation rather than resisting it.`);
    insights_hi.push(`गण्डान्त स्थितियाँ कार्मिक शिक्षा दर्शाती हैं — परिवर्तन को स्वीकार करें, प्रतिरोध न करें।`);
  }

  // Insight from promise/delivery gap
  if (pd.d1Promise > 60 && pd.dxxDelivery < 40) {
    insights_en.push(`There is a significant gap between promise and delivery — focused effort and appropriate timing (muhurta selection) can bridge it.`);
    insights_hi.push(`वचन और फल में बड़ा अन्तर है — केन्द्रित प्रयास और उचित समय (मुहूर्त चयन) से इसे पाटा जा सकता है।`);
  } else if (pd.dxxDelivery > pd.d1Promise + 15) {
    insights_en.push(`The divisional chart delivers more than the natal promise — this domain has hidden potential waiting to unfold.`);
    insights_hi.push(`वर्ग-चार्ट जन्मकुण्डली के वचन से अधिक फल देता है — इस क्षेत्र में छिपी सम्भावनाएँ प्रकट होने की प्रतीक्षा में हैं।`);
  }

  // Vargottama insight
  if (cc.vargottamaPlanets.length > 0) {
    const names_en = cc.vargottamaPlanets.map(pEN).join(' and ');
    const names_hi = cc.vargottamaPlanets.map(pHI).join(' और ');
    insights_en.push(`${names_en}'s Vargottama status is a natural asset — trust the consistency it brings to ${DOMAIN_LABEL_EN[domain]}.`);
    insights_hi.push(`${names_hi} की वर्गोत्तम स्थिति एक स्वाभाविक सम्पदा है — ${DOMAIN_LABEL_HI[domain]} में इसकी निरन्तरता पर भरोसा रखें।`);
  }

  if (insights_en.length === 0) {
    insights_en.push(`Continue nurturing ${DOMAIN_LABEL_EN[domain]} with awareness and intention — the planetary pattern supports steady growth.`);
    insights_hi.push(`${DOMAIN_LABEL_HI[domain]} को जागरूकता और संकल्प से पोषित करते रहें — ग्रह-स्थिति स्थिर विकास का समर्थन करती है।`);
  }

  // Cap at 4 insights
  const final_en = insights_en.slice(0, 4);
  const final_hi = insights_hi.slice(0, 4);

  return {
    en: 'Practical guidance: ' + final_en.join(' '),
    hi: 'व्यावहारिक मार्गदर्शन: ' + final_hi.join(' '),
  };
}

// ---------------------------------------------------------------------------
// Main entry point
// ---------------------------------------------------------------------------

/**
 * Build a multi-paragraph narrative from structured deep varga analysis data.
 * Produces up to 7 paragraphs in both EN and HI.
 *
 * @param result - The complete deep analysis result for a divisional chart
 * @param locale - User's locale (used for future locale-specific logic)
 * @returns Object with en and hi narrative strings, paragraphs separated by double newlines
 */
export function buildVargaNarrative(
  result: DeepVargaResult,
  locale: string,
): { en: string; hi: string } {
  const { crossCorrelation: cc, promiseDelivery: pd, chartId, domain } = result;

  const paragraphs: { en: string; hi: string }[] = [
    buildP1(cc, chartId, domain),
    buildP2(cc),
    buildP3(cc, domain),
    buildP4(cc, chartId),
    buildP5(pd, domain),
    buildP6(cc, chartId, domain),
    buildP7(cc, pd, domain),
  ];

  const en = paragraphs.map(p => p.en).filter(Boolean).join('\n\n');
  const hi = paragraphs.map(p => p.hi).filter(Boolean).join('\n\n');

  return { en, hi };
}
