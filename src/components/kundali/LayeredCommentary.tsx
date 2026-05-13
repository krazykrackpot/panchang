'use client';

import type { DomainReading, Rating, ScoringFactor } from '@/lib/kundali/domain-synthesis/types';
import { getDomainConfig } from '@/lib/kundali/domain-synthesis/config';
import { GRAHAS } from '@/lib/constants/grahas';
import { YOGA_DETAIL_DATA } from '@/lib/constants/yoga-details';
import { tl } from '@/lib/utils/trilingual';
import { Link } from '@/lib/i18n/navigation';

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

/**
 * Generates flowing Jyotishi-style prose from the factor breakdown.
 * Each factor type gets its own narrative treatment:
 * - Lords: "Your 4th lord Jupiter sits in own sign — strong foundation for education"
 * - Karakas: "Mercury, the natural intellect karaka, offers support from a friendly sign"
 * - Occupants: "Moon's presence in the 5th house enriches learning"
 * - Yogas: "Amala Yoga brings spotless reputation to your career"
 * - Doshas: "Mangal Dosha creates friction in partnerships — remedies can help"
 */
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
    const enLabel = f.label.en; // always check English label for type detection

    // Split value on " — " to separate placement from context.
    const lastDash = value.lastIndexOf(' — ');
    const [placement, context] = lastDash >= 0
      ? [value.slice(0, lastDash), value.slice(lastDash + 3)]
      : [value, ''];

    // ── Yoga/Dosha factors — render with descriptions and links ──
    // These are handled specially in the JSX below, not as prose sentences
    if (enLabel === 'Active Yogas' || enLabel === 'Active Doshas') {
      continue; // Skip — rendered as structured list in JSX
    }

    // ── Lord factors ──
    if (enLabel.includes('Lord')) {
      if (f.verdict === 'positive') {
        if (context) {
          sentences.push(`${label} is placed in ${placement} — a position of strength for ${context}.`);
        } else {
          sentences.push(`${label} is well-placed in ${placement}, supporting ${domainName}.`);
        }
      } else if (f.verdict === 'negative') {
        if (value.includes('Mrita') || value.includes('Bala')) {
          const avMatch = placement.match(/(Mrita \(Dead\)|Bala \(Infant\))/);
          const avName = avMatch?.[1] ?? 'weak avastha';
          sentences.push(`${label} is in ${placement.split(',')[0]}, but ${avName} significantly reduces delivery${context ? ` for ${context}` : ''}.`);
        } else if (value.includes('enemy sign') || value.includes('debilitated')) {
          sentences.push(`${label} is in ${placement} — an uncomfortable position${context ? ` that creates friction for ${context}` : ''}.`);
        } else {
          sentences.push(`${label} in ${placement} faces challenges${context ? ` for ${context}` : ''}.`);
        }
      } else {
        sentences.push(`${label} is in ${placement}${context ? ` — a steady influence on ${context}` : ''}.`);
      }
      continue;
    }

    // ── Karaka factors ──
    if (enLabel.includes('karaka') || enLabel.includes('Karaka')) {
      if (f.verdict === 'positive') {
        sentences.push(`${label}, placed in ${placement}, lends natural strength to ${domainName}.`);
      } else if (f.verdict === 'negative') {
        if (value.includes('Mrita') || value.includes('Bala')) {
          sentences.push(`${label} is weakened by ${value.includes('Mrita') ? 'Mrita (dead) avastha' : 'Bala (infant) avastha'} — its natural support for ${domainName} is diminished.`);
        } else {
          sentences.push(`${label} in ${placement} struggles to fully support ${domainName}.`);
        }
      } else {
        sentences.push(`${label} in ${placement} provides moderate natural support.`);
      }
      continue;
    }

    // ── Occupant factors ──
    if (value.includes('benefic occupant')) {
      sentences.push(`${label} — a benefic presence that enriches ${context || domainName}.`);
      continue;
    }
    if (value.includes('malefic occupant')) {
      sentences.push(`${label} — a malefic presence that creates friction in ${context || domainName}, but also builds resilience.`);
      continue;
    }

    // ── Fallback for any unrecognised factor type ──
    if (f.verdict === 'positive') {
      sentences.push(`${label} in ${placement} supports ${domainName}.`);
    } else if (f.verdict === 'negative') {
      sentences.push(`${label} in ${placement} creates challenges for ${domainName}.`);
    } else {
      sentences.push(`${label} is in ${placement} — a moderate influence.`);
    }
  }

  // Closing summary
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

  // ── Generate flowing prose from non-yoga factors ──
  const prose = generateNatalProse(factors, domainName, rating, isHi);

  // ── Extract yoga/dosha factors for structured rendering ──
  const yogaFactor = factors.find(f => f.label.en === 'Active Yogas');
  const doshaFactor = factors.find(f => f.label.en === 'Active Doshas');
  const regularFactors = factors.filter(f => f.label.en !== 'Active Yogas' && f.label.en !== 'Active Doshas');

  // Check which yoga IDs have detail pages
  const hasDetailPage = (id: string) => !!YOGA_DETAIL_DATA[id];

  return (
    <div className="space-y-3 mt-3" style={bodyFont}>
      {/* Layer 1: Natal — factors first, then prose interpretation */}
      <div className="border-l-2 border-[#34d399]/50 pl-3">
        <p className="text-xs font-semibold text-text-primary mb-1.5">{natalHeadline}</p>
        {/* Factor breakdown — lords, karakas, occupants */}
        <div className="space-y-1 mb-2">
          {regularFactors.map((f, i) => (
            <SignificatorLine key={i} factor={f} isHi={isHi} />
          ))}
        </div>

        {/* Yoga details — each with description and optional link */}
        {yogaFactor && yogaFactor.yogaDetails && yogaFactor.yogaDetails.length > 0 && (
          <div className="mt-2 pt-2 border-t border-white/5">
            <p className="text-[10px] font-bold text-emerald-400/80 uppercase tracking-wider mb-1">
              {isHi ? 'सक्रिय शुभ योग' : 'Active Yogas'}
            </p>
            <div className="space-y-1">
              {yogaFactor.yogaDetails.map((yd) => (
                <div key={yd.id} className="flex items-start gap-1.5 text-xs leading-relaxed">
                  <span className="text-emerald-400 font-bold shrink-0 mt-0.5">✦</span>
                  <span className="text-text-secondary">
                    {hasDetailPage(yd.id) ? (
                      <Link href={`/learn/yoga/${yd.id}` as any} className="text-gold-primary hover:text-gold-light font-medium transition-colors">
                        {yd.name}
                      </Link>
                    ) : (
                      <span className="text-text-primary font-medium">{yd.name}</span>
                    )}
                    {yd.summary ? ` — ${yd.summary}` : ''}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Dosha details — each with description and optional link */}
        {doshaFactor && doshaFactor.yogaDetails && doshaFactor.yogaDetails.length > 0 && (
          <div className="mt-2 pt-2 border-t border-white/5">
            <p className="text-[10px] font-bold text-red-400/80 uppercase tracking-wider mb-1">
              {isHi ? 'सक्रिय दोष' : 'Active Doshas'}
            </p>
            <div className="space-y-1">
              {doshaFactor.yogaDetails.map((yd) => (
                <div key={yd.id} className="flex items-start gap-1.5 text-xs leading-relaxed">
                  <span className="text-red-400/80 font-bold shrink-0 mt-0.5">⚠</span>
                  <span className="text-text-secondary">
                    {hasDetailPage(yd.id) ? (
                      <Link href={`/learn/yoga/${yd.id}` as any} className="text-gold-primary hover:text-gold-light font-medium transition-colors">
                        {yd.name}
                      </Link>
                    ) : (
                      <span className="text-text-primary font-medium">{yd.name}</span>
                    )}
                    {yd.summary ? ` — ${yd.summary}` : ''}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Flowing prose — interpretation of all factors above */}
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
