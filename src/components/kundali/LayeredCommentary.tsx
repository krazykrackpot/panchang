'use client';

import type { DomainReading, Rating, ScoringFactor } from '@/lib/kundali/domain-synthesis/types';
import { getDomainConfig } from '@/lib/kundali/domain-synthesis/config';
import { GRAHAS } from '@/lib/constants/grahas';
import { tl } from '@/lib/utils/trilingual';

interface LayeredCommentaryProps {
  domain: DomainReading;
  locale: string;
}

const TIER_LABELS: Record<Rating, { en: string; hi: string }> = {
  uttama:    { en: 'Strong',      hi: 'प्रबल' },
  madhyama:  { en: 'Moderate',    hi: 'मध्यम' },
  adhama:    { en: 'Challenging',  hi: 'चुनौतीपूर्ण' },
  atyadhama: { en: 'Critical',    hi: 'गंभीर' },
};

function pName(id: number, locale: string): string {
  const g = GRAHAS[id];
  return g ? tl(g.name, locale) : '';
}

function ordinal(n: number, locale: string): string {
  if (locale === 'hi' || locale === 'sa') return `${n}वें`;
  const s = ['th', 'st', 'nd', 'rd'];
  const v = n % 100;
  return `${n}${s[(v - 20) % 10] || s[v] || s[0]}`;
}

// ─── Prose generator: weaves factors into flowing Jyotishi-style narrative ──

function generateNatalProse(
  factors: ScoringFactor[],
  domainName: string,
  rating: Rating,
  isHi: boolean,
): string {
  if (factors.length === 0) return '';

  const sentences: string[] = [];

  for (const f of factors) {
    const label = isHi ? f.label.hi : f.label.en;
    const value = f.value;

    // Split value on " — " to separate placement from context.
    // Use LAST " — " as the split point since the domain context is always last.
    const lastDash = value.lastIndexOf(' — ');
    const [placement, context] = lastDash >= 0
      ? [value.slice(0, lastDash), value.slice(lastDash + 3)]
      : [value, ''];

    if (f.verdict === 'positive') {
      if (value.includes('benefic occupant')) {
        sentences.push(`${label} — ${value}.`);
      } else if (context) {
        sentences.push(`${label} is in ${placement} — a position of strength for ${context}.`);
      } else {
        sentences.push(`${label} in ${placement} supports ${domainName}.`);
      }
    } else if (f.verdict === 'negative') {
      if (value.includes('malefic occupant')) {
        sentences.push(`${label} — ${value}.`);
      } else if (value.includes('Mrita') || value.includes('Bala')) {
        // Extract the avastha part and the context separately
        const avMatch = placement.match(/(Mrita \(Dead\)|Bala \(Infant\))/);
        const avName = avMatch?.[1] ?? 'weak avastha';
        sentences.push(`${label} is in ${placement.split(',')[0]}, but ${avName} significantly reduces delivery${context ? ` for ${context}` : ''}.`);
      } else if (value.includes('enemy sign') || value.includes('debilitated')) {
        sentences.push(`${label} is in ${placement} — an uncomfortable position${context ? ` that creates friction for ${context}` : ''}.`);
      } else {
        sentences.push(`${label} in ${placement} poses challenges${context ? ` for ${context}` : ''}.`);
      }
    } else {
      sentences.push(`${label} is in ${placement}${context ? ` — a steady influence on ${context}` : ' — a moderate influence'}.`);
    }
  }

  // Add a closing summary based on the overall tier
  const CLOSING: Record<Rating, string> = {
    uttama: `Overall, the chart provides strong support for ${domainName}.`,
    madhyama: `On balance, ${domainName} has moderate support — some strengths offset the challenges.`,
    adhama: `Overall, ${domainName} faces headwinds — patience and remedial measures will help.`,
    atyadhama: `${domainName} is under significant pressure — focused remedies are recommended.`,
  };
  const CLOSING_HI: Record<Rating, string> = {
    uttama: `कुल मिलाकर, कुण्डली ${domainName} के लिए प्रबल सहयोग देती है।`,
    madhyama: `संतुलन में, ${domainName} को मध्यम सहयोग है — कुछ बल चुनौतियों की भरपाई करते हैं।`,
    adhama: `कुल मिलाकर, ${domainName} को चुनौतियाँ हैं — धैर्य और उपाय सहायक होंगे।`,
    atyadhama: `${domainName} पर महत्वपूर्ण दबाव है — केन्द्रित उपायों की सिफारिश है।`,
  };

  sentences.push(isHi ? CLOSING_HI[rating] : CLOSING[rating]);

  return sentences.join(' ');
}

// ─── Significator factor line ───────────────────────────────────────────────

function SignificatorLine({ factor, isHi }: { factor: ScoringFactor; isHi: boolean }) {
  const icon = factor.verdict === 'positive' ? '✓'
    : factor.verdict === 'negative' ? '✗'
    : '◎';
  const colorClass = factor.verdict === 'positive' ? 'text-emerald-400'
    : factor.verdict === 'negative' ? 'text-red-400/80'
    : 'text-text-secondary';

  return (
    <div className="flex items-start gap-1.5 text-xs leading-relaxed">
      <span className={`${colorClass} font-bold shrink-0 mt-0.5`}>{icon}</span>
      <span className="text-text-secondary">
        <span className="text-text-primary font-medium">{isHi ? factor.label.hi : factor.label.en}</span>
        {': '}
        {factor.value}
      </span>
    </div>
  );
}

// ─── Component ──────────────────────────────────────────────────────────────

export default function LayeredCommentary({ domain, locale }: LayeredCommentaryProps) {
  const isHi = locale === 'hi' || locale === 'sa';
  const config = getDomainConfig(domain.domain);
  const domainName = config ? tl(config.name, locale) : domain.domain;
  const rating = domain.overallRating.rating;
  const act = domain.currentActivation;
  const factors = domain.overallRating.factors ?? [];

  const mahaName = pName(act.mahaDashaLordId, locale);
  const antarName = pName(act.antarDashaLordId, locale);

  // ── Layer 1: Natal Promise — significator breakdown ──
  const tier = TIER_LABELS[rating];
  const natalHeadline = isHi
    ? `${domainName} के लिए ${tier.hi} वादा`
    : `${tier.en} promise for ${domainName}`;

  // ── Layer 2: Mahadasha ──
  let dashaText: string;
  if (act.isDashaActive && act.dashaActivationScore >= 6) {
    dashaText = isHi
      ? `${mahaName} महादशा इस क्षेत्र को प्रबल रूप से सक्रिय कर रही है`
      : `${mahaName} Mahadasha is strongly activating ${domainName}`;
  } else if (act.isDashaActive) {
    dashaText = isHi
      ? `${mahaName} महादशा इस क्षेत्र से जुड़ी है, हल्का प्रभाव`
      : `${mahaName} Mahadasha has a mild connection to ${domainName}`;
  } else {
    dashaText = isHi
      ? `${mahaName} महादशा का ${domainName} पर कोई सीधा प्रभाव नहीं — यह दशा अन्य क्षेत्रों पर केन्द्रित है`
      : `${mahaName} Mahadasha does not directly impact ${domainName} — this period is focused on other life areas`;
  }

  // ── Layer 3: Current Period ──
  const parts: string[] = [];
  if (antarName) {
    parts.push(isHi ? `${antarName} अन्तर्दशा चल रही है` : `${antarName} Antardasha is running`);
  }
  if (act.transitInfluences.length > 0) {
    const top = act.transitInfluences.reduce((a, b) => {
      const rank = { high: 3, medium: 2, low: 1 };
      return (rank[b.intensity] ?? 0) > (rank[a.intensity] ?? 0) ? b : a;
    }, act.transitInfluences[0]);
    const tPlanet = pName(top.planetId, locale);
    const hStr = ordinal(top.transitHouse, locale);
    const nature = top.nature === 'benefic' ? (isHi ? 'अनुकूल' : 'favourable')
      : top.nature === 'malefic' ? (isHi ? 'चुनौतीपूर्ण' : 'challenging') : '';
    parts.push(isHi
      ? `${tPlanet} का ${hStr} भाव से ${nature} गोचर`
      : `${tPlanet} ${nature} transit through ${hStr} house`);
    if (act.transitInfluences.length > 1) {
      parts.push(isHi ? `(+${act.transitInfluences.length - 1} और)` : `(+${act.transitInfluences.length - 1} more)`);
    }
  }
  const currentText = parts.length > 0
    ? parts.join('. ')
    : (isHi ? `इस समय कोई प्रमुख प्रभाव ${domainName} पर नहीं` : `No significant current influences on ${domainName}`);

  const bodyFont = isHi ? { fontFamily: 'var(--font-devanagari-body)' } : undefined;

  // ── Generate flowing prose from factors ──
  // Weave the significator assessments into a Jyotishi-style narrative paragraph
  const prose = generateNatalProse(factors, domainName, rating, isHi);

  return (
    <div className="space-y-3 mt-3" style={bodyFont}>
      {/* Layer 1: Natal — factors first, then prose interpretation */}
      <div className="border-l-2 border-[#34d399]/50 pl-3">
        <p className="text-xs font-semibold text-text-primary mb-1.5">{natalHeadline}</p>
        {/* Factor breakdown — the evidence */}
        <div className="space-y-1 mb-2">
          {factors.map((f, i) => (
            <SignificatorLine key={i} factor={f} isHi={isHi} />
          ))}
        </div>
        {/* Flowing prose — interpretation of the factors above */}
        <p className="text-sm leading-relaxed text-text-secondary pt-2 border-t border-white/5">
          {prose}
        </p>
      </div>

      {/* Layer 2: Mahadasha */}
      <p className="text-xs leading-relaxed text-text-secondary pl-3 border-l-2 border-[#818cf8]/50">
        {dashaText}
      </p>

      {/* Layer 3: Current period */}
      <p className="text-xs leading-relaxed text-text-secondary pl-3 border-l-2 border-[#22d3ee]/50">
        {currentText}
      </p>
    </div>
  );
}
