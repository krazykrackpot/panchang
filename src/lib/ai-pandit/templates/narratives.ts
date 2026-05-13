/**
 * Template Narratives — Slot-fill templates for Tier 0 responses.
 *
 * 4 verdicts × 8 categories × 2 locales = 64 template functions.
 * Filled from SAC data — no LLM involved.
 *
 * Locale support: EN and HI only in v1. Tamil (ta), Bengali (bn), and
 * other locales fall through to English. Hindi templates use proper
 * Jyotish register (दशा, गोचर, भाव — not Hinglish).
 */

import type { StructuredAstrologicalContext, Verdict, QueryCategory } from '../types';
import { GRAHAS } from '@/lib/constants/grahas';

// ─────────────────────────────────────────────────────────────────────────────
// Domain names (bilingual)
// ─────────────────────────────────────────────────────────────────────────────

const DOMAIN_EN: Record<QueryCategory, string> = {
  career: 'career', relationship: 'relationships', health: 'health',
  wealth: 'finances', children: 'children', education: 'education',
  spiritual: 'spiritual growth', general: 'overall life',
};

const DOMAIN_HI: Record<QueryCategory, string> = {
  career: 'करियर', relationship: 'संबंध', health: 'स्वास्थ्य',
  wealth: 'आर्थिक स्थिति', children: 'संतान', education: 'शिक्षा',
  spiritual: 'आध्यात्मिक उन्नति', general: 'समग्र जीवन',
};

// ─────────────────────────────────────────────────────────────────────────────
// Verdict adjectives
// ─────────────────────────────────────────────────────────────────────────────

const VERDICT_EN: Record<Verdict, string> = {
  FAVOURABLE: 'strongly supportive', MIXED: 'showing mixed influences',
  CAUTION: 'requiring careful attention', CHALLENGING: 'demanding patience and remedial action',
};

const VERDICT_HI: Record<Verdict, string> = {
  FAVOURABLE: 'अत्यंत अनुकूल', MIXED: 'मिश्रित प्रभाव वाली',
  CAUTION: 'सावधानी की आवश्यकता वाली', CHALLENGING: 'धैर्य और उपायों की आवश्यकता वाली',
};

// ─────────────────────────────────────────────────────────────────────────────
// Slot extraction
// ─────────────────────────────────────────────────────────────────────────────

function getDashaLord(sac: StructuredAstrologicalContext, locale: string): string {
  const id = sac.dasha.mahadasha.lordId;
  const graha = GRAHAS[id];
  if (!graha) return sac.dasha.mahadasha.lordName;
  return locale === 'hi' ? (graha.name.hi ?? graha.name.en) : graha.name.en;
}

function getPositiveFactors(sac: StructuredAstrologicalContext, locale: string): string {
  const pos = sac.primaryFactors.filter(f => f.sentiment === 'positive');
  if (pos.length === 0) {
    return locale === 'hi' ? 'इस समय कोई विशेष शुभ कारक सक्रिय नहीं है।' : 'No strong positive factors are active at this time.';
  }
  return pos.map(f => f.detail).join(locale === 'hi' ? '। ' : '. ');
}

function getNegativeFactors(sac: StructuredAstrologicalContext, locale: string): string {
  const neg = sac.primaryFactors.filter(f => f.sentiment === 'negative');
  if (neg.length === 0) return '';
  return neg.map(f => f.detail).join(locale === 'hi' ? '। ' : '. ');
}

function getSadeSatiNote(sac: StructuredAstrologicalContext, locale: string): string {
  if (!sac.sadeSati.active) return '';
  const phase = sac.sadeSati.phase ?? 'active';
  return locale === 'hi'
    ? `साढ़ेसाती का ${phase === 'peak' ? 'शिखर' : phase === 'rising' ? 'आरम्भिक' : 'अंतिम'} चरण सक्रिय है।`
    : `Sade Sati is in its ${phase} phase.`;
}

// ─────────────────────────────────────────────────────────────────────────────
// Template generator
// ─────────────────────────────────────────────────────────────────────────────

export function generateTemplateNarrative(
  sac: StructuredAstrologicalContext,
  category: QueryCategory,
  locale: string,
): string {
  const dashaLord = getDashaLord(sac, locale);
  const domain = locale === 'hi' ? DOMAIN_HI[category] : DOMAIN_EN[category];
  const verdict = locale === 'hi' ? VERDICT_HI[sac.primaryVerdict] : VERDICT_EN[sac.primaryVerdict];
  const positive = getPositiveFactors(sac, locale);
  const negative = getNegativeFactors(sac, locale);
  const sadeSati = getSadeSatiNote(sac, locale);

  if (locale === 'hi') {
    return buildHindiTemplate(dashaLord, domain, verdict, positive, negative, sadeSati, sac.primaryVerdict);
  }
  return buildEnglishTemplate(dashaLord, domain, verdict, positive, negative, sadeSati, sac.primaryVerdict);
}

function buildEnglishTemplate(
  dashaLord: string, domain: string, verdict: string,
  positive: string, negative: string, sadeSati: string,
  verdictCode: Verdict,
): string {
  const paras: string[] = [];

  paras.push(`During your ${dashaLord} Mahadasha, the planetary influences on ${domain} are ${verdict}.`);
  paras.push(positive);

  if (negative) {
    paras.push(`However, some challenges are present. ${negative}`);
  }

  if (sadeSati) {
    paras.push(sadeSati);
  }

  if (verdictCode === 'CAUTION' || verdictCode === 'CHALLENGING') {
    paras.push('Classical tradition recommends specific remedies to mitigate these influences. Patience and consistent effort during this period will yield results over time.');
  } else if (verdictCode === 'FAVOURABLE') {
    paras.push('This is an excellent window to take initiative and pursue your goals with confidence.');
  } else {
    paras.push('Balance optimism with prudence. Leverage the positive influences while remaining mindful of the challenging ones.');
  }

  return paras.filter(Boolean).join('\n\n');
}

function buildHindiTemplate(
  dashaLord: string, domain: string, verdict: string,
  positive: string, negative: string, sadeSati: string,
  verdictCode: Verdict,
): string {
  const paras: string[] = [];

  paras.push(`आपकी ${dashaLord} महादशा में ${domain} से संबंधित ग्रह प्रभाव ${verdict} हैं।`);
  paras.push(positive);

  if (negative) {
    paras.push(`हालाँकि, कुछ चुनौतियाँ भी विद्यमान हैं। ${negative}`);
  }

  if (sadeSati) {
    paras.push(sadeSati);
  }

  if (verdictCode === 'CAUTION' || verdictCode === 'CHALLENGING') {
    paras.push('शास्त्रों के अनुसार विशिष्ट उपाय इन प्रभावों को कम कर सकते हैं। इस काल में धैर्य और निरंतर प्रयास से समय के साथ परिणाम अवश्य मिलेंगे।');
  } else if (verdictCode === 'FAVOURABLE') {
    paras.push('यह अपने लक्ष्यों की ओर आत्मविश्वास से आगे बढ़ने का उत्तम समय है।');
  } else {
    paras.push('आशावाद और विवेक का संतुलन बनाए रखें। शुभ प्रभावों का लाभ उठाएँ और चुनौतीपूर्ण प्रभावों के प्रति सतर्क रहें।');
  }

  return paras.filter(Boolean).join('\n\n');
}
