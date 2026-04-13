import type { LocaleText,} from '@/types/panchang';
import type { UserSnapshot } from './types';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface PersonalRemedy {
  category: 'weak_planet' | 'dosha' | 'dasha' | 'transit';
  planetId?: number;
  title: LocaleText;
  description: LocaleText;
  mantra?: string;
  gemstone?: LocaleText;
  donation?: LocaleText;
  day?: LocaleText;
  priority: 'high' | 'medium' | 'low';
}

// ---------------------------------------------------------------------------
// Planet remedy data (indexed by planet id 0-8)
// ---------------------------------------------------------------------------

interface PlanetRemedyData {
  mantra: string;
  gemstone: LocaleText;
  donation: LocaleText;
  day: LocaleText;
  weakTitle: LocaleText;
  weakDesc: LocaleText;
}

const PLANET_REMEDIES: Record<number, PlanetRemedyData> = {
  0: {
    mantra: 'ॐ ह्रां ह्रीं ह्रौं सः सूर्याय नमः',
    gemstone: { en: 'Ruby (Manikya)', hi: 'माणिक्य (रूबी)', sa: 'माणिक्यम्' },
    donation: { en: 'Wheat, jaggery, copper — donate on Sunday', hi: 'गेहूँ, गुड़, ताम्बा — रविवार को दान करें', sa: 'गोधूमः गुडं ताम्रं च — रविवासरे दानं कुर्यात्' },
    day: { en: 'Sunday', hi: 'रविवार', sa: 'रविवासरः' },
    weakTitle: { en: 'Strengthen Sun', hi: 'सूर्य को बलवान करें', sa: 'सूर्यं बलवन्तं कुर्यात्' },
    weakDesc: { en: 'Sun is weak in your chart. Strengthening Sun improves confidence, authority, and vitality.', hi: 'आपकी कुण्डली में सूर्य दुर्बल है। सूर्य को बलवान करने से आत्मविश्वास, अधिकार और ऊर्जा बढ़ती है।', sa: 'भवतः कुण्डल्यां सूर्यः दुर्बलः। सूर्यबलवर्धनेन आत्मविश्वासः अधिकारः ऊर्जा च वर्धन्ते।' },
  },
  1: {
    mantra: 'ॐ श्रां श्रीं श्रौं सः चन्द्राय नमः',
    gemstone: { en: 'Pearl (Moti)', hi: 'मोती (पर्ल)', sa: 'मुक्ता' },
    donation: { en: 'Rice, milk, white cloth — donate on Monday', hi: 'चावल, दूध, सफेद वस्त्र — सोमवार को दान करें', sa: 'तण्डुलः क्षीरं श्वेतवस्त्रं च — सोमवासरे दानं कुर्यात्' },
    day: { en: 'Monday', hi: 'सोमवार', sa: 'सोमवासरः' },
    weakTitle: { en: 'Strengthen Moon', hi: 'चन्द्र को बलवान करें', sa: 'चन्द्रं बलवन्तं कुर्यात्' },
    weakDesc: { en: 'Moon is weak in your chart. Strengthening Moon improves emotional stability and mental peace.', hi: 'आपकी कुण्डली में चन्द्र दुर्बल है। चन्द्र को बलवान करने से भावनात्मक स्थिरता और मानसिक शान्ति बढ़ती है।', sa: 'भवतः कुण्डल्यां चन्द्रः दुर्बलः। चन्द्रबलवर्धनेन भावनात्मकस्थिरता मानसिकशान्तिश्च वर्धन्ते।' },
  },
  2: {
    mantra: 'ॐ क्रां क्रीं क्रौं सः भौमाय नमः',
    gemstone: { en: 'Red Coral (Moonga)', hi: 'मूँगा (रेड कोरल)', sa: 'प्रवालम्' },
    donation: { en: 'Red lentils (masoor), jaggery — donate on Tuesday', hi: 'मसूर दाल, गुड़ — मंगलवार को दान करें', sa: 'मसूरदालं गुडं च — मङ्गलवासरे दानं कुर्यात्' },
    day: { en: 'Tuesday', hi: 'मंगलवार', sa: 'मङ्गलवासरः' },
    weakTitle: { en: 'Strengthen Mars', hi: 'मंगल को बलवान करें', sa: 'मङ्गलं बलवन्तं कुर्यात्' },
    weakDesc: { en: 'Mars is weak in your chart. Strengthening Mars improves courage, energy, and physical vitality.', hi: 'आपकी कुण्डली में मंगल दुर्बल है। मंगल को बलवान करने से साहस, ऊर्जा और शारीरिक बल बढ़ता है।', sa: 'भवतः कुण्डल्यां मङ्गलः दुर्बलः। मङ्गलबलवर्धनेन साहसम् ऊर्जा शारीरिकबलं च वर्धन्ते।' },
  },
  3: {
    mantra: 'ॐ ब्रां ब्रीं ब्रौं सः बुधाय नमः',
    gemstone: { en: 'Emerald (Panna)', hi: 'पन्ना (एमरल्ड)', sa: 'मरकतम्' },
    donation: { en: 'Green moong dal, green cloth — donate on Wednesday', hi: 'हरी मूँग दाल, हरा वस्त्र — बुधवार को दान करें', sa: 'हरितमुद्गदालं हरितवस्त्रं च — बुधवासरे दानं कुर्यात्' },
    day: { en: 'Wednesday', hi: 'बुधवार', sa: 'बुधवासरः' },
    weakTitle: { en: 'Strengthen Mercury', hi: 'बुध को बलवान करें', sa: 'बुधं बलवन्तं कुर्यात्' },
    weakDesc: { en: 'Mercury is weak in your chart. Strengthening Mercury improves communication, intellect, and business acumen.', hi: 'आपकी कुण्डली में बुध दुर्बल है। बुध को बलवान करने से वाणी, बुद्धि और व्यापार कौशल बढ़ता है।', sa: 'भवतः कुण्डल्यां बुधः दुर्बलः। बुधबलवर्धनेन वाक् बुद्धिः वाणिज्यकौशलं च वर्धन्ते।' },
  },
  4: {
    mantra: 'ॐ ग्रां ग्रीं ग्रौं सः गुरवे नमः',
    gemstone: { en: 'Yellow Sapphire (Pukhraj)', hi: 'पुखराज (यलो सफायर)', sa: 'पुष्पराजम्' },
    donation: { en: 'Chana dal, turmeric, yellow cloth — donate on Thursday', hi: 'चना दाल, हल्दी, पीला वस्त्र — गुरुवार को दान करें', sa: 'चणकदालं हरिद्रा पीतवस्त्रं च — गुरुवासरे दानं कुर्यात्' },
    day: { en: 'Thursday', hi: 'गुरुवार', sa: 'गुरुवासरः' },
    weakTitle: { en: 'Strengthen Jupiter', hi: 'बृहस्पति को बलवान करें', sa: 'बृहस्पतिं बलवन्तं कुर्यात्' },
    weakDesc: { en: 'Jupiter is weak in your chart. Strengthening Jupiter improves wisdom, fortune, and spiritual growth.', hi: 'आपकी कुण्डली में बृहस्पति दुर्बल है। बृहस्पति को बलवान करने से ज्ञान, भाग्य और आध्यात्मिक विकास बढ़ता है।', sa: 'भवतः कुण्डल्यां बृहस्पतिः दुर्बलः। बृहस्पतिबलवर्धनेन ज्ञानं भाग्यम् आध्यात्मिकविकासश्च वर्धन्ते।' },
  },
  5: {
    mantra: 'ॐ द्रां द्रीं द्रौं सः शुक्राय नमः',
    gemstone: { en: 'Diamond / Opal (Heera)', hi: 'हीरा / ओपल', sa: 'वज्रम् / ओपलम्' },
    donation: { en: 'White items, rice, sugar, white cloth — donate on Friday', hi: 'सफेद वस्तुएँ, चावल, शक्कर, सफेद वस्त्र — शुक्रवार को दान करें', sa: 'श्वेतवस्तूनि तण्डुलः शर्करा श्वेतवस्त्रं च — शुक्रवासरे दानं कुर्यात्' },
    day: { en: 'Friday', hi: 'शुक्रवार', sa: 'शुक्रवासरः' },
    weakTitle: { en: 'Strengthen Venus', hi: 'शुक्र को बलवान करें', sa: 'शुक्रं बलवन्तं कुर्यात्' },
    weakDesc: { en: 'Venus is weak in your chart. Strengthening Venus improves relationships, comfort, and artistic abilities.', hi: 'आपकी कुण्डली में शुक्र दुर्बल है। शुक्र को बलवान करने से सम्बन्ध, सुख और कला में वृद्धि होती है।', sa: 'भवतः कुण्डल्यां शुक्रः दुर्बलः। शुक्रबलवर्धनेन सम्बन्धाः सुखं कलाश्च वर्धन्ते।' },
  },
  6: {
    mantra: 'ॐ प्रां प्रीं प्रौं सः शनैश्चराय नमः',
    gemstone: { en: 'Blue Sapphire (Neelam)', hi: 'नीलम (ब्लू सफायर)', sa: 'नीलम्' },
    donation: { en: 'Black sesame, mustard oil, iron items — donate on Saturday', hi: 'काले तिल, सरसों का तेल, लोहे की वस्तुएँ — शनिवार को दान करें', sa: 'कृष्णतिलाः सर्षपतैलम् लोहवस्तूनि च — शनिवासरे दानं कुर्यात्' },
    day: { en: 'Saturday', hi: 'शनिवार', sa: 'शनिवासरः' },
    weakTitle: { en: 'Strengthen Saturn', hi: 'शनि को बलवान करें', sa: 'शनिं बलवन्तं कुर्यात्' },
    weakDesc: { en: 'Saturn is weak in your chart. Strengthening Saturn improves discipline, career stability, and karmic balance.', hi: 'आपकी कुण्डली में शनि दुर्बल है। शनि को बलवान करने से अनुशासन, करियर स्थिरता और कर्मिक सन्तुलन बढ़ता है।', sa: 'भवतः कुण्डल्यां शनिः दुर्बलः। शनिबलवर्धनेन अनुशासनं व्यवसायस्थिरता कर्मसन्तुलनं च वर्धन्ते।' },
  },
  7: {
    mantra: 'ॐ भ्रां भ्रीं भ्रौं सः राहवे नमः',
    gemstone: { en: 'Hessonite (Gomed)', hi: 'गोमेद (हेसोनाइट)', sa: 'गोमेदम्' },
    donation: { en: 'Black blanket, mustard, coconut — donate on Saturday', hi: 'काला कम्बल, सरसों, नारियल — शनिवार को दान करें', sa: 'कृष्णकम्बलं सर्षपं नारिकेलं च — शनिवासरे दानं कुर्यात्' },
    day: { en: 'Saturday', hi: 'शनिवार', sa: 'शनिवासरः' },
    weakTitle: { en: 'Pacify Rahu', hi: 'राहु को शान्त करें', sa: 'राहुं शान्तं कुर्यात्' },
    weakDesc: { en: 'Rahu is afflicted in your chart. Pacifying Rahu reduces confusion, obsession, and illusion.', hi: 'आपकी कुण्डली में राहु पीड़ित है। राहु को शान्त करने से भ्रम, जुनून और माया कम होती है।', sa: 'भवतः कुण्डल्यां राहुः पीडितः। राहुशान्त्या भ्रमः आसक्तिः मायाश्च न्यूनाः भवन्ति।' },
  },
  8: {
    mantra: 'ॐ स्रां स्रीं स्रौं सः केतवे नमः',
    gemstone: { en: "Cat's Eye (Lehsunia)", hi: 'लहसुनिया (कैट्स आई)', sa: 'वैदूर्यम्' },
    donation: { en: 'Blanket, sesame, seven grains — donate on Tuesday', hi: 'कम्बल, तिल, सात अनाज — मंगलवार को दान करें', sa: 'कम्बलं तिलाः सप्तधान्यानि च — मङ्गलवासरे दानं कुर्यात्' },
    day: { en: 'Tuesday', hi: 'मंगलवार', sa: 'मङ्गलवासरः' },
    weakTitle: { en: 'Pacify Ketu', hi: 'केतु को शान्त करें', sa: 'केतुं शान्तं कुर्यात्' },
    weakDesc: { en: 'Ketu is afflicted in your chart. Pacifying Ketu improves focus and reduces aimlessness.', hi: 'आपकी कुण्डली में केतु पीड़ित है। केतु को शान्त करने से एकाग्रता बढ़ती है और लक्ष्यहीनता कम होती है।', sa: 'भवतः कुण्डल्यां केतुः पीडितः। केतुशान्त्या एकाग्रता वर्धते लक्ष्यहीनता च न्यूना भवति।' },
  },
};

// ---------------------------------------------------------------------------
// Sade Sati remedies
// ---------------------------------------------------------------------------

const SADE_SATI_REMEDIES: PersonalRemedy[] = [
  {
    category: 'transit',
    planetId: 6,
    title: { en: 'Hanuman Chalisa for Sade Sati', hi: 'साढ़े साती के लिए हनुमान चालीसा', sa: 'साढ़ेसात्यर्थं हनुमच्चालीसा' },
    description: {
      en: 'Recite Hanuman Chalisa daily, especially on Tuesdays and Saturdays, to mitigate the effects of Sade Sati.',
      hi: 'साढ़े साती के प्रभाव को कम करने के लिए प्रतिदिन हनुमान चालीसा का पाठ करें, विशेषकर मंगलवार और शनिवार को।',
      sa: 'साढ़ेसातिप्रभावन्यूनीकरणाय प्रतिदिनं हनुमच्चालीसापाठं कुर्यात्, विशेषतः मङ्गलशनिवासरयोः।',
    },
    mantra: 'श्रीगुरु चरन सरोज रज, निज मनु मुकुरु सुधारि। बरनउँ रघुबर बिमल जसु, जो दायकु फल चारि॥',
    priority: 'high',
  },
  {
    category: 'transit',
    planetId: 6,
    title: { en: 'Sesame Oil Lamp', hi: 'तिल तेल का दीपक', sa: 'तिलतैलदीपः' },
    description: {
      en: 'Light a sesame oil lamp under a Peepal tree on Saturdays. Offer black sesame seeds and mustard oil to Lord Shani.',
      hi: 'शनिवार को पीपल के वृक्ष के नीचे तिल के तेल का दीपक जलाएँ। भगवान शनि को काले तिल और सरसों का तेल अर्पित करें।',
      sa: 'शनिवासरे पिप्पलवृक्षाधः तिलतैलदीपं प्रज्वालयेत्। शनिदेवाय कृष्णतिलान् सर्षपतैलं च अर्पयेत्।',
    },
    donation: { en: 'Black sesame, mustard oil', hi: 'काले तिल, सरसों का तेल', sa: 'कृष्णतिलाः सर्षपतैलम्' },
    day: { en: 'Saturday', hi: 'शनिवार', sa: 'शनिवासरः' },
    priority: 'high',
  },
  {
    category: 'transit',
    planetId: 6,
    title: { en: 'Shani Temple Visit', hi: 'शनि मन्दिर दर्शन', sa: 'शनिमन्दिरदर्शनम्' },
    description: {
      en: 'Visit a Shani temple on Saturdays. Pour sesame oil on the Shani idol and offer black cloth.',
      hi: 'शनिवार को शनि मन्दिर जाएँ। शनि देव की मूर्ति पर तिल का तेल चढ़ाएँ और काला वस्त्र अर्पित करें।',
      sa: 'शनिवासरे शनिमन्दिरं गच्छेत्। शनिदेवमूर्तौ तिलतैलम् अभिषिञ्चेत् कृष्णवस्त्रं च अर्पयेत्।',
    },
    day: { en: 'Saturday', hi: 'शनिवार', sa: 'शनिवासरः' },
    priority: 'high',
  },
];

// ---------------------------------------------------------------------------
// Kala Sarpa remedies
// ---------------------------------------------------------------------------

const KALA_SARPA_REMEDIES: PersonalRemedy[] = [
  {
    category: 'dosha',
    planetId: 7,
    title: { en: 'Kala Sarpa Dosha Remedies', hi: 'काल सर्प दोष उपाय', sa: 'कालसर्पदोषोपायाः' },
    description: {
      en: 'Perform Rahu-Ketu puja, visit Trimbakeshwar or Kalahasti temple. Chant Rahu and Ketu mantras regularly.',
      hi: 'राहु-केतु पूजा करवाएँ, त्र्यम्बकेश्वर या कालहस्ती मन्दिर जाएँ। नियमित रूप से राहु और केतु मन्त्र का जाप करें।',
      sa: 'राहुकेतुपूजां कारयेत्, त्र्यम्बकेश्वरं कालहस्तिमन्दिरं वा गच्छेत्। नियमितरूपेण राहुकेतुमन्त्रजापं कुर्यात्।',
    },
    mantra: 'ॐ नमः शिवाय। ॐ भ्रां भ्रीं भ्रौं सः राहवे नमः। ॐ स्रां स्रीं स्रौं सः केतवे नमः।',
    gemstone: { en: 'Hessonite + Cat\'s Eye', hi: 'गोमेद + लहसुनिया', sa: 'गोमेदं वैदूर्यं च' },
    priority: 'high',
  },
];

// ---------------------------------------------------------------------------
// Mangala Dosha remedies
// ---------------------------------------------------------------------------

const MANGALA_DOSHA_REMEDIES: PersonalRemedy[] = [
  {
    category: 'dosha',
    planetId: 2,
    title: { en: 'Mangala Dosha Remedies', hi: 'मंगल दोष उपाय', sa: 'मङ्गलदोषोपायाः' },
    description: {
      en: 'Perform Mangal puja, chant Hanuman Chalisa, fast on Tuesdays. Kumbh Vivah may be recommended for severe cases.',
      hi: 'मंगल पूजा करवाएँ, हनुमान चालीसा पढ़ें, मंगलवार को व्रत रखें। गम्भीर मामलों में कुम्भ विवाह की सिफारिश हो सकती है।',
      sa: 'मङ्गलपूजां कारयेत्, हनुमच्चालीसां पठेत्, मङ्गलवासरे व्रतं धारयेत्। गम्भीरावस्थासु कुम्भविवाहः अनुशंसितः।',
    },
    mantra: 'ॐ क्रां क्रीं क्रौं सः भौमाय नमः',
    gemstone: { en: 'Red Coral (Moonga)', hi: 'मूँगा', sa: 'प्रवालम्' },
    donation: { en: 'Red lentils, jaggery — on Tuesday', hi: 'मसूर दाल, गुड़ — मंगलवार को', sa: 'मसूरदालं गुडं च — मङ्गलवासरे' },
    day: { en: 'Tuesday', hi: 'मंगलवार', sa: 'मङ्गलवासरः' },
    priority: 'high',
  },
];

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

interface PlanetPosition {
  id?: number;
  planetId?: number;
  shadbala?: { total?: number; required?: number; ratio?: number };
  strengthRatio?: number;
  yogas?: string[];
}

interface DashaEntry {
  planet: string;
  startDate: string;
  endDate: string;
}

function getWeakPlanets(positions: unknown[]): number[] {
  const weak: number[] = [];
  if (!Array.isArray(positions)) return weak;

  for (const p of positions as PlanetPosition[]) {
    const pid = p.id ?? p.planetId;
    if (pid == null || pid > 8) continue;

    // Check shadbala ratio
    let ratio = p.strengthRatio;
    if (!ratio && p.shadbala) {
      ratio = p.shadbala.ratio ?? (p.shadbala.total && p.shadbala.required ? p.shadbala.total / p.shadbala.required : undefined);
    }
    if (ratio != null && ratio < 1.0) {
      weak.push(pid);
    }
  }
  return weak;
}

function getCurrentDashaLord(dashaTimeline: unknown[]): number | null {
  if (!Array.isArray(dashaTimeline) || dashaTimeline.length === 0) return null;
  const now = new Date();
  const PLANET_KEY_MAP: Record<string, number> = {
    sun: 0, moon: 1, mars: 2, mercury: 3, jupiter: 4,
    venus: 5, saturn: 6, rahu: 7, ketu: 8,
  };

  for (const entry of dashaTimeline as DashaEntry[]) {
    const start = new Date(entry.startDate);
    const end = new Date(entry.endDate);
    if (now >= start && now <= end) {
      const key = entry.planet?.toLowerCase();
      return PLANET_KEY_MAP[key] ?? null;
    }
  }
  return null;
}

function hasMangalaDosha(positions: unknown[]): boolean {
  if (!Array.isArray(positions)) return false;
  // Mars in 1st, 2nd, 4th, 7th, 8th, or 12th house indicates Mangala Dosha
  for (const p of positions as PlanetPosition[]) {
    const pid = p.id ?? p.planetId;
    if (pid !== 2) continue;
    // Check yogas array for Mangala Dosha
    if (p.yogas && Array.isArray(p.yogas)) {
      for (const y of p.yogas) {
        if (typeof y === 'string' && y.toLowerCase().includes('mangal')) return true;
      }
    }
  }
  return false;
}

function hasKalaSarpa(positions: unknown[]): boolean {
  if (!Array.isArray(positions)) return false;
  // Simplified check: look for Kala Sarpa in yogas
  for (const p of positions as PlanetPosition[]) {
    if (p.yogas && Array.isArray(p.yogas)) {
      for (const y of p.yogas) {
        if (typeof y === 'string' && y.toLowerCase().includes('kala sarpa')) return true;
        if (typeof y === 'string' && y.toLowerCase().includes('kaal sarp')) return true;
      }
    }
  }
  return false;
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

export function computePersonalRemedies(snapshot: UserSnapshot): PersonalRemedy[] {
  const remedies: PersonalRemedy[] = [];

  // 1. Weak planets
  const weakIds = getWeakPlanets(snapshot.planetPositions);
  for (const pid of weakIds) {
    const data = PLANET_REMEDIES[pid];
    if (!data) continue;
    remedies.push({
      category: 'weak_planet',
      planetId: pid,
      title: data.weakTitle,
      description: data.weakDesc,
      mantra: data.mantra,
      gemstone: data.gemstone,
      donation: data.donation,
      day: data.day,
      priority: 'high',
    });
  }

  // 2. Active Sade Sati
  if (snapshot.sadeSati && typeof snapshot.sadeSati === 'object') {
    const ss = snapshot.sadeSati as { isActive?: boolean };
    if (ss.isActive) {
      remedies.push(...SADE_SATI_REMEDIES);
    }
  }

  // 3. Current Dasha lord remedy (medium priority)
  const dashaLord = getCurrentDashaLord(snapshot.dashaTimeline);
  if (dashaLord != null) {
    const data = PLANET_REMEDIES[dashaLord];
    if (data) {
      // Avoid duplicating if already present as weak planet
      const alreadyPresent = remedies.some((r) => r.category === 'weak_planet' && r.planetId === dashaLord);
      if (!alreadyPresent) {
        remedies.push({
          category: 'dasha',
          planetId: dashaLord,
          title: {
            en: `Dasha Lord: ${data.weakTitle.en.replace('Strengthen ', '').replace('Pacify ', '')}`,
            hi: `दशा स्वामी: ${data.weakTitle.hi!.replace(' को बलवान करें', '').replace(' को शान्त करें', '')}`,
            sa: `दशास्वामी: ${data.weakTitle.sa!.replace('बलवन्तं कुर्यात्', '').replace('शान्तं कुर्यात्', '').trim()}`,
          },
          description: {
            en: `You are currently in the ${data.weakTitle.en.replace('Strengthen ', '').replace('Pacify ', '')} dasha period. Propitiating this planet can enhance its positive effects.`,
            hi: `आप वर्तमान में ${data.weakTitle.hi!.replace(' को बलवान करें', '').replace(' को शान्त करें', '')} दशा काल में हैं। इस ग्रह को प्रसन्न करने से इसके शुभ प्रभाव बढ़ सकते हैं।`,
            sa: `भवान् वर्तमानं ${data.weakTitle.sa!.replace(' बलवन्तं कुर्यात्', '').replace(' शान्तं कुर्यात्', '').trim()} दशाकाले वर्तते। अस्य ग्रहस्य प्रसन्नीकरणेन शुभप्रभावाः वर्धन्ते।`,
          },
          mantra: data.mantra,
          gemstone: data.gemstone,
          donation: data.donation,
          day: data.day,
          priority: 'medium',
        });
      }
    }
  }

  // 4. Doshas
  if (hasMangalaDosha(snapshot.planetPositions)) {
    remedies.push(...MANGALA_DOSHA_REMEDIES);
  }
  if (hasKalaSarpa(snapshot.planetPositions)) {
    remedies.push(...KALA_SARPA_REMEDIES);
  }

  // Sort: high → medium → low
  const priorityOrder = { high: 0, medium: 1, low: 2 };
  remedies.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);

  return remedies;
}
