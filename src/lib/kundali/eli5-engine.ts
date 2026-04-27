/**
 * ELI5 (Explain Like I'm 5) Engine
 *
 * Transforms a KundaliData into a beginner-friendly, plain-language narrative.
 * Each section is 2-4 sentences max, bilingual (en/hi), with a learn-more link.
 * Tone: warm, encouraging, non-fatalistic.
 */

import type { KundaliData, PlanetPosition, DashaEntry, ShadBala } from '@/types/kundali';
import type { LocaleText } from '@/types/panchang';
import { RASHIS } from '@/lib/constants/rashis';
import { NAKSHATRAS } from '@/lib/constants/nakshatras';
import { GRAHAS } from '@/lib/constants/grahas';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface ELI5Section {
  title: { en: string; hi: string };
  emoji: string; // internal classification only — not rendered in UI
  body: { en: string; hi: string };
  learnMoreHref?: string;
  learnMoreLabel?: { en: string; hi: string };
}

export interface ELI5Result {
  headline: { en: string; hi: string };
  sections: ELI5Section[];
}

// ---------------------------------------------------------------------------
// Sign personality data — short traits per rashi (index = sign-1)
// ---------------------------------------------------------------------------

const SIGN_TRAITS: { en: string[]; hi: string[] }[] = [
  { en: ['bold', 'energetic', 'a natural leader'], hi: ['साहसी', 'ऊर्जावान', 'स्वाभाविक नेता'] },
  { en: ['patient', 'loyal', 'lover of comfort'], hi: ['धैर्यवान', 'वफ़ादार', 'आराम-पसंद'] },
  { en: ['curious', 'witty', 'great communicator'], hi: ['जिज्ञासु', 'चतुर', 'बेहतरीन वक्ता'] },
  { en: ['nurturing', 'intuitive', 'emotionally deep'], hi: ['पालन-पोषक', 'अंतर्ज्ञानी', 'भावनात्मक रूप से गहरे'] },
  { en: ['confident', 'generous', 'natural performer'], hi: ['आत्मविश्वासी', 'उदार', 'प्राकृतिक कलाकार'] },
  { en: ['analytical', 'detail-oriented', 'practical'], hi: ['विश्लेषणात्मक', 'विवरण-प्रेमी', 'व्यावहारिक'] },
  { en: ['diplomatic', 'fair-minded', 'harmony-seeking'], hi: ['कूटनीतिक', 'न्यायप्रिय', 'सामंजस्य-प्रेमी'] },
  { en: ['intense', 'perceptive', 'deeply resourceful'], hi: ['तीव्र', 'सूक्ष्मदर्शी', 'अत्यंत साधन-संपन्न'] },
  { en: ['adventurous', 'optimistic', 'philosophical'], hi: ['साहसी', 'आशावादी', 'दार्शनिक'] },
  { en: ['disciplined', 'ambitious', 'pragmatic'], hi: ['अनुशासित', 'महत्वाकांक्षी', 'व्यावहारिक'] },
  { en: ['independent', 'innovative', 'humanitarian'], hi: ['स्वतंत्र', 'नवप्रवर्तक', 'मानवतावादी'] },
  { en: ['compassionate', 'imaginative', 'spiritually inclined'], hi: ['करुणामय', 'कल्पनाशील', 'आध्यात्मिक'] },
];

// Planet domain keywords for ELI5
const PLANET_DOMAINS: Record<string, { en: string; hi: string }> = {
  Sun:     { en: 'confidence, authority, and vitality', hi: 'आत्मविश्वास, अधिकार और जीवन-शक्ति' },
  Moon:    { en: 'emotions, intuition, and nurturing', hi: 'भावनाएँ, अंतर्ज्ञान और देखभाल' },
  Mars:    { en: 'courage, energy, and drive', hi: 'साहस, ऊर्जा और प्रेरणा' },
  Mercury: { en: 'communication, intellect, and learning', hi: 'संवाद, बुद्धि और सीखना' },
  Jupiter: { en: 'wisdom, growth, and good fortune', hi: 'ज्ञान, विकास और सौभाग्य' },
  Venus:   { en: 'love, beauty, and creativity', hi: 'प्रेम, सौंदर्य और रचनात्मकता' },
  Saturn:  { en: 'discipline, responsibility, and perseverance', hi: 'अनुशासन, जिम्मेदारी और दृढ़ता' },
  Rahu:    { en: 'ambition, unconventional desires, and worldly growth', hi: 'महत्वाकांक्षा, अपारंपरिक इच्छाएँ और सांसारिक विकास' },
  Ketu:    { en: 'spirituality, detachment, and past-life wisdom', hi: 'आध्यात्मिकता, वैराग्य और पूर्व-जन्म ज्ञान' },
};

// Yoga ELI5 explanations (top common ones)
const YOGA_ELI5: Record<string, { en: string; hi: string }> = {
  gajakesari:    { en: 'Jupiter and Moon support each other in your chart, boosting wisdom and popularity.', hi: 'बृहस्पति और चंद्र आपकी कुंडली में एक-दूसरे का सहारा देते हैं, ज्ञान और लोकप्रियता बढ़ाते हैं।' },
  budhaditya:    { en: 'Sun and Mercury together sharpen your intellect and communication skills.', hi: 'सूर्य और बुध मिलकर आपकी बुद्धि और संवाद कौशल को तेज़ करते हैं।' },
  hamsa:         { en: 'Jupiter in a key position gives you a generous, wise personality.', hi: 'बृहस्पति प्रमुख स्थान में होने से आपका व्यक्तित्व उदार और ज्ञानी बनता है।' },
  malavya:       { en: 'Venus in a strong house blesses you with charm, artistic talent, and comfort.', hi: 'शुक्र मज़बूत भाव में होकर आपको आकर्षण, कला-प्रतिभा और सुख-सुविधा देता है।' },
  ruchaka:       { en: 'Mars in a powerful position gives you tremendous courage and leadership.', hi: 'मंगल शक्तिशाली स्थान में होने से आपको अपार साहस और नेतृत्व मिलता है।' },
  bhadra:        { en: 'Mercury in its own domain makes you an excellent thinker and communicator.', hi: 'बुध अपने ही क्षेत्र में होने से आपको उत्तम विचारक और संवादी बनाता है।' },
  shasha:        { en: 'Saturn in a strong house gives you remarkable discipline and endurance.', hi: 'शनि मज़बूत भाव में होने से आपको उल्लेखनीय अनुशासन और सहनशीलता मिलती है।' },
  chandra_mangala: { en: 'Moon-Mars combination gives you emotional courage and strong willpower.', hi: 'चंद्र-मंगल का संयोग आपको भावनात्मक साहस और दृढ़ इच्छाशक्ति देता है।' },
  dhana:         { en: 'Wealth-house lords connect well, indicating financial growth potential.', hi: 'धन-भावों के स्वामी अच्छी स्थिति में हैं, आर्थिक विकास की संभावना दर्शाते हैं।' },
  raja:          { en: 'Lords of key houses combine to bring recognition and influence.', hi: 'प्रमुख भावों के स्वामी मिलकर मान-सम्मान और प्रभाव देते हैं।' },
  viparita_raja: { en: 'A challenging placement that paradoxically turns obstacles into unexpected gains.', hi: 'एक चुनौतीपूर्ण स्थिति जो विपरीत रूप से बाधाओं को अप्रत्याशित लाभ में बदलती है।' },
  neecha_bhanga: { en: 'A planet that looks weak actually gets rescued by another, turning a weakness into hidden strength.', hi: 'एक कमज़ोर दिखने वाला ग्रह दूसरे से सहारा पाकर कमज़ोरी को छिपी ताक़त में बदल देता है।' },
  kemadruma:     { en: 'Moon stands alone without close planetary support. This can make emotions feel intense but also builds self-reliance.', hi: 'चंद्र बिना निकटतम ग्रहीय सहारे के अकेला है। भावनाएँ तीव्र हो सकती हैं, पर आत्मनिर्भरता भी बनती है।' },
  manglik:       { en: 'Mars sits in a marriage-related house. Classical texts flag this for timing in relationships, not doom.', hi: 'मंगल विवाह-संबंधित भाव में है। शास्त्र इसे संबंधों के समय के लिए चिह्नित करते हैं, किसी अशुभता के लिए नहीं।' },
  kaal_sarpa:    { en: 'All planets fall between Rahu and Ketu, creating a focused but sometimes intense life pattern.', hi: 'सभी ग्रह राहु और केतु के बीच हैं, जो एक केंद्रित पर कभी-कभी तीव्र जीवन-पद्धति बनाता है।' },
};

// Maha Dasha planet themes for ELI5
const DASHA_THEMES: Record<string, { en: string; hi: string }> = {
  Sun:     { en: 'self-expression, career recognition, and health', hi: 'आत्म-अभिव्यक्ति, करियर में पहचान और स्वास्थ्य' },
  Moon:    { en: 'emotional well-being, family, and travel', hi: 'भावनात्मक सुख, परिवार और यात्रा' },
  Mars:    { en: 'action, property matters, and physical energy', hi: 'कार्य, संपत्ति के मामले और शारीरिक ऊर्जा' },
  Mercury: { en: 'business, education, and communication', hi: 'व्यापार, शिक्षा और संवाद' },
  Jupiter: { en: 'spiritual growth, children, and wisdom', hi: 'आध्यात्मिक विकास, संतान और ज्ञान' },
  Venus:   { en: 'relationships, luxury, and artistic pursuits', hi: 'रिश्ते, विलासिता और कला' },
  Saturn:  { en: 'hard work, structure, and long-term rewards', hi: 'कड़ी मेहनत, संरचना और दीर्घकालिक पुरस्कार' },
  Rahu:    { en: 'unconventional opportunities and foreign connections', hi: 'अपारंपरिक अवसर और विदेशी संबंध' },
  Ketu:    { en: 'introspection, spirituality, and letting go', hi: 'आत्मनिरीक्षण, आध्यात्मिकता और त्याग' },
};

// ---------------------------------------------------------------------------
// Helper: safely access locale text
// ---------------------------------------------------------------------------
function lt(obj: LocaleText | Record<string, string> | undefined | null, locale: string): string {
  if (!obj) return '';
  return (obj as Record<string, string>)[locale] || (obj as Record<string, string>).en || '';
}

// ---------------------------------------------------------------------------
// Main generator
// ---------------------------------------------------------------------------

export function generateELI5(kundali: KundaliData): ELI5Result {
  const sections: ELI5Section[] = [];

  // --- 1. Rising Sign ---
  const ascSign = kundali.ascendant.sign; // 1-12
  const rashi = RASHIS[ascSign - 1];
  const traits = SIGN_TRAITS[ascSign - 1];
  if (rashi && traits) {
    sections.push({
      title: { en: 'Your Rising Sign', hi: 'आपकी लग्न राशि' },
      emoji: 'door',
      body: {
        en: `Your Lagna is ${rashi.name.en}. Think of this as your "front door" — it shapes how the world sees you and how you approach life. ${rashi.name.en} rising people tend to be ${traits.en.join(', ')}. This is a tendency, not a destiny.`,
        hi: `आपकी लग्न ${rashi.name.hi} है। इसे अपने "मुख्य द्वार" की तरह समझें — यह तय करता है कि दुनिया आपको कैसे देखती है। ${rashi.name.hi} लग्न वाले लोग अक्सर ${traits.hi.join(', ')} होते हैं। यह एक प्रवृत्ति है, भाग्य नहीं।`,
      },
      learnMoreHref: '/learn/modules/3-1',
      learnMoreLabel: { en: 'Learn about Rashis', hi: 'राशियों के बारे में जानें' },
    });
  }

  // --- 2. Moon Sign + Nakshatra ---
  const moon = kundali.planets.find(p => p.planet.id === 1);
  if (moon) {
    const moonRashi = RASHIS[moon.sign - 1];
    const moonNak = NAKSHATRAS.find(n => n.id === moon.nakshatra.id);
    const moonSignName = moonRashi ? moonRashi.name : moon.signName;
    const moonNakName = moonNak ? moonNak.name : moon.nakshatra.name;
    const moonTraits = moon.sign >= 1 && moon.sign <= 12 ? SIGN_TRAITS[moon.sign - 1] : null;

    sections.push({
      title: { en: 'Your Moon', hi: 'आपका चन्द्र' },
      emoji: 'moon',
      body: {
        en: `Your Moon is in ${lt(moonSignName, 'en')} in the nakshatra ${lt(moonNakName, 'en')}. The Moon represents your emotional core — how you feel, what comforts you, and your instincts.${moonTraits ? ` ${lt(moonSignName, 'en')} Moon people are often ${moonTraits.en.join(', ')}.` : ''} Your nakshatra adds a unique flavor to this emotional signature.`,
        hi: `आपका चन्द्र ${lt(moonSignName, 'hi')} राशि में ${lt(moonNakName, 'hi')} नक्षत्र में है। चन्द्र आपके भावनात्मक केंद्र का प्रतिनिधित्व करता है — आप कैसा महसूस करते हैं, क्या आपको सुकून देता है।${moonTraits ? ` ${lt(moonSignName, 'hi')} चन्द्र वाले लोग अक्सर ${moonTraits.hi.join(', ')} होते हैं।` : ''} आपका नक्षत्र इस भावनात्मक पहचान में एक विशेष रंग जोड़ता है।`,
      },
      learnMoreHref: '/learn/modules/4-1',
      learnMoreLabel: { en: 'Learn about Nakshatras', hi: 'नक्षत्रों के बारे में जानें' },
    });
  }

  // --- 3. Strengths — strongest planet by Shadbala ---
  const strengthSection = buildStrengthSection(kundali);
  if (strengthSection) sections.push(strengthSection);

  // --- 4. Active Yogas ---
  const yogaSection = buildYogaSection(kundali);
  if (yogaSection) sections.push(yogaSection);

  // --- 5. Current Period (Dasha) ---
  const dashaSection = buildDashaSection(kundali);
  if (dashaSection) sections.push(dashaSection);

  // --- 6. What to Watch ---
  const watchSection = buildWatchSection(kundali);
  if (watchSection) sections.push(watchSection);

  return {
    headline: {
      en: 'Your Chart in Plain Language',
      hi: 'आपकी कुंडली सरल भाषा में',
    },
    sections,
  };
}

// ---------------------------------------------------------------------------
// Section builders
// ---------------------------------------------------------------------------

function buildStrengthSection(kundali: KundaliData): ELI5Section | null {
  // First try Shadbala strongest planet
  let strongestName: string | null = null;
  let strongestNameHi: string | null = null;
  let domain: { en: string; hi: string } | null = null;

  if (kundali.shadbala && kundali.shadbala.length > 0) {
    const sorted = [...kundali.shadbala].sort((a, b) => b.totalStrength - a.totalStrength);
    const top = sorted[0];
    const nameEn = lt(top.planetName, 'en');
    strongestName = nameEn;
    strongestNameHi = lt(top.planetName, 'hi');
    domain = PLANET_DOMAINS[nameEn] || null;
  }

  // Fallback: look for exalted planets
  if (!strongestName) {
    const exalted = kundali.planets.find(p => p.isExalted && p.planet.id <= 6); // skip nodes
    if (exalted) {
      strongestName = lt(exalted.planet.name, 'en');
      strongestNameHi = lt(exalted.planet.name, 'hi');
      domain = PLANET_DOMAINS[strongestName] || null;
    }
  }

  if (!strongestName || !domain) return null;

  return {
    title: { en: 'Your Strengths', hi: 'आपकी शक्तियाँ' },
    emoji: 'star',
    body: {
      en: `Your strongest planet is ${strongestName} — think of it as your superpower in the area of ${domain.en}. When this planet is strong, its themes come naturally to you. Lean into these areas; they are where you shine brightest.`,
      hi: `आपका सबसे मज़बूत ग्रह ${strongestNameHi} है — इसे ${domain.hi} के क्षेत्र में अपनी महाशक्ति समझें। जब यह ग्रह बलवान हो, तो इसके विषय आपके लिए स्वाभाविक होते हैं। इन क्षेत्रों में आगे बढ़ें; यहीं आप सबसे चमकते हैं।`,
    },
    learnMoreHref: '/learn/modules/2-1',
    learnMoreLabel: { en: 'Learn about Grahas', hi: 'ग्रहों के बारे में जानें' },
  };
}

function buildYogaSection(kundali: KundaliData): ELI5Section | null {
  const yogas = kundali.yogasComplete;
  if (!yogas || yogas.length === 0) return null;

  const present = yogas.filter(y => y.present);
  if (present.length === 0) return null;

  // Prioritize: strong > moderate > weak; auspicious first
  const sorted = [...present].sort((a, b) => {
    const strengthOrder = { Strong: 0, Moderate: 1, Weak: 2 };
    if (a.isAuspicious !== b.isAuspicious) return a.isAuspicious ? -1 : 1;
    return (strengthOrder[a.strength] || 2) - (strengthOrder[b.strength] || 2);
  });

  const top3 = sorted.slice(0, 3);

  const enLines: string[] = [];
  const hiLines: string[] = [];

  for (const y of top3) {
    const nameEn = lt(y.name, 'en');
    const nameHi = lt(y.name, 'hi');
    const idNormalized = y.id.toLowerCase().replace(/[^a-z_]/g, '');
    const eli5 = YOGA_ELI5[idNormalized];

    if (eli5) {
      enLines.push(`${nameEn}: ${eli5.en}`);
      hiLines.push(`${nameHi}: ${eli5.hi}`);
    } else {
      // Fallback to the yoga's own description
      const descEn = lt(y.description, 'en');
      const descHi = lt(y.description, 'hi');
      enLines.push(`${nameEn}: ${descEn || (y.isAuspicious ? 'An auspicious combination in your chart.' : 'A pattern to be mindful of.')}`);
      hiLines.push(`${nameHi}: ${descHi || (y.isAuspicious ? 'आपकी कुंडली में एक शुभ संयोग।' : 'एक ध्यान देने योग्य संयोग।')}`);
    }
  }

  const moreCount = present.length - top3.length;

  return {
    title: { en: 'Special Patterns (Yogas)', hi: 'विशेष योग' },
    emoji: 'sparkles',
    body: {
      en: `Your chart has ${present.length} active yoga${present.length > 1 ? 's' : ''} — special planet combinations. Here are the highlights:\n\n${enLines.join('\n\n')}${moreCount > 0 ? `\n\n...and ${moreCount} more in the detailed view.` : ''}`,
      hi: `आपकी कुंडली में ${present.length} सक्रिय योग हैं — ग्रहों के विशेष संयोग। मुख्य बातें:\n\n${hiLines.join('\n\n')}${moreCount > 0 ? `\n\n...और ${moreCount} और विस्तृत दृश्य में।` : ''}`,
    },
    learnMoreHref: '/learn/modules/6-1',
    learnMoreLabel: { en: 'Learn about Yogas', hi: 'योगों के बारे में जानें' },
  };
}

function buildDashaSection(kundali: KundaliData): ELI5Section | null {
  if (!kundali.dashas || kundali.dashas.length === 0) return null;

  const now = Date.now();
  // Find current Maha Dasha
  const currentMaha = kundali.dashas.find(d =>
    d.level === 'maha' && new Date(d.startDate).getTime() <= now && new Date(d.endDate).getTime() > now
  );
  if (!currentMaha) return null;

  const mahaNameEn = lt(currentMaha.planetName, 'en');
  const mahaNameHi = lt(currentMaha.planetName, 'hi');
  const mahaStart = new Date(currentMaha.startDate).getFullYear();
  const mahaEnd = new Date(currentMaha.endDate).getFullYear();
  const mahaYears = mahaEnd - mahaStart;
  const mahaThemes = DASHA_THEMES[mahaNameEn] || { en: 'this planet\'s themes', hi: 'इस ग्रह के विषय' };

  // Find current Antar Dasha
  let antarLine = { en: '', hi: '' };
  if (currentMaha.subPeriods && currentMaha.subPeriods.length > 0) {
    const currentAntar = currentMaha.subPeriods.find(d =>
      new Date(d.startDate).getTime() <= now && new Date(d.endDate).getTime() > now
    );
    if (currentAntar) {
      const antarNameEn = lt(currentAntar.planetName, 'en');
      const antarNameHi = lt(currentAntar.planetName, 'hi');
      const antarThemes = DASHA_THEMES[antarNameEn] || { en: 'its own themes', hi: 'अपने विषय' };
      const aEnd = new Date(currentAntar.endDate);
      const months = Math.max(1, Math.round((aEnd.getTime() - now) / (30.44 * 24 * 60 * 60 * 1000)));
      antarLine = {
        en: ` Within that, the current sub-chapter is ${antarNameEn} (about ${months} month${months > 1 ? 's' : ''} remaining), emphasizing ${antarThemes.en}.`,
        hi: ` इसमें वर्तमान उप-अध्याय ${antarNameHi} है (लगभग ${months} महीने शेष), जो ${antarThemes.hi} पर ज़ोर देता है।`,
      };
    }
  }

  return {
    title: { en: 'Current Life Chapter', hi: 'वर्तमान जीवन-अध्याय' },
    emoji: 'book',
    body: {
      en: `Right now you are in the ${mahaNameEn} Maha Dasha (${mahaStart}–${mahaEnd}), a roughly ${mahaYears}-year chapter where themes of ${mahaThemes.en} take center stage.${antarLine.en} Think of it as the season your life is in — not good or bad, just a particular focus.`,
      hi: `अभी आप ${mahaNameHi} महादशा (${mahaStart}–${mahaEnd}) में हैं, लगभग ${mahaYears} वर्षों का अध्याय जहाँ ${mahaThemes.hi} मुख्य विषय रहते हैं।${antarLine.hi} इसे अपने जीवन के मौसम की तरह समझें — अच्छा या बुरा नहीं, बस एक विशेष दिशा।`,
    },
    learnMoreHref: '/learn/modules/8-1',
    learnMoreLabel: { en: 'Learn about Dashas', hi: 'दशाओं के बारे में जानें' },
  };
}

function buildWatchSection(kundali: KundaliData): ELI5Section | null {
  const items: { en: string; hi: string }[] = [];

  // Check for Manglik (Mars in houses 1,4,7,8,12)
  const mars = kundali.planets.find(p => p.planet.id === 2);
  if (mars && [1, 4, 7, 8, 12].includes(mars.house)) {
    items.push({
      en: `Mars is in your ${ordinal(mars.house)} house, which classical texts flag as "Manglik." This is about timing in relationships, not bad luck. Many people share this placement and have happy marriages — awareness helps you plan, not worry.`,
      hi: `मंगल आपके ${mars.house}वें भाव में है, जिसे शास्त्र "मांगलिक" कहते हैं। यह रिश्तों के समय के बारे में है, दुर्भाग्य नहीं। बहुत से लोगों की कुंडली में यह है और वे सुखी विवाहित हैं — जानकारी चिंता के लिए नहीं, योजना के लिए है।`,
    });
  }

  // Check for Sade Sati
  if (kundali.sadeSati && kundali.sadeSati.isActive) {
    items.push({
      en: `Saturn is currently transiting near your Moon — this is called "Sade Sati." It is a period of deep growth through patience. Things may feel slower, but the lessons learned now build lasting foundations.`,
      hi: `शनि अभी आपके चन्द्र के पास गोचर कर रहा है — इसे "साढ़े साती" कहते हैं। यह धैर्य से गहरे विकास का काल है। चीज़ें धीमी लग सकती हैं, पर अभी सीखे गए सबक स्थायी नींव रखते हैं।`,
    });
  }

  // Check for debilitated planets (non-node, non-combust — just debilitated)
  const debilitated = kundali.planets.filter(p => p.isDebilitated && p.planet.id <= 6);
  if (debilitated.length > 0) {
    const pNameEn = lt(debilitated[0].planet.name, 'en');
    const pNameHi = lt(debilitated[0].planet.name, 'hi');
    const dom = PLANET_DOMAINS[pNameEn] || { en: 'its domain', hi: 'इसके क्षेत्र' };
    items.push({
      en: `${pNameEn} is in a less comfortable sign (debilitated). This doesn't mean it can't work — it just works differently. In the area of ${dom.en}, you may need extra conscious effort, which often builds unusual depth.`,
      hi: `${pNameHi} एक कम अनुकूल राशि में है (नीच)। इसका मतलब यह नहीं कि यह काम नहीं कर सकता — बस अलग तरीके से करता है। ${dom.hi} के क्षेत्र में आपको अतिरिक्त सचेत प्रयास की ज़रूरत हो सकती है, जो अक्सर असाधारण गहराई विकसित करता है।`,
    });
  }

  if (items.length === 0) {
    // Nothing challenging found — give a positive default
    items.push({
      en: `No major classical challenges stand out in your chart. This is a good foundation — focus on leveraging your strengths and exploring the yogas above for growth areas.`,
      hi: `आपकी कुंडली में कोई प्रमुख शास्त्रीय चुनौती नहीं दिखती। यह एक अच्छी नींव है — अपनी शक्तियों का लाभ उठाएँ और ऊपर दिए योगों को विकास के लिए देखें।`,
    });
  }

  return {
    title: { en: 'What to Watch', hi: 'ध्यान देने योग्य' },
    emoji: 'eye',
    body: {
      en: items.map(i => i.en).join('\n\n'),
      hi: items.map(i => i.hi).join('\n\n'),
    },
    learnMoreHref: '/learn/modules/6-1',
    learnMoreLabel: { en: 'Learn about Doshas & Yogas', hi: 'दोष और योग के बारे में जानें' },
  };
}

// ---------------------------------------------------------------------------
// Utility
// ---------------------------------------------------------------------------

function ordinal(n: number): string {
  const s = ['th', 'st', 'nd', 'rd'];
  const v = n % 100;
  return n + (s[(v - 20) % 10] || s[v] || s[0]);
}
