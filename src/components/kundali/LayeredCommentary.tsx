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

// ─── Prose generator: synthesises factors into a Jyotishi-style reading ──────

/** Extract the planet name from a label like "4th Lord Jupiter" or "Mercury (intellect karaka)" */
function extractPlanet(label: string): string {
  // "4th Lord Jupiter" → "Jupiter"
  const lordMatch = label.match(/Lord\s+(\w+)/);
  if (lordMatch) return lordMatch[1];
  // "Mercury (education karaka)" → "Mercury"
  const karakaMatch = label.match(/^(\w+)\s*\(/);
  if (karakaMatch) return karakaMatch[1];
  // "Moon in 5th — benefic occupant" → "Moon"
  const occupantMatch = label.match(/^(\w+)\s+in/);
  if (occupantMatch) return occupantMatch[1];
  return label.split(' ')[0];
}

/** Extract placement detail: "Own Sign in 4th house (Sagittarius)" → { dignity: "Own Sign", house: "4th", sign: "Sagittarius" } */
function parsePlacement(value: string): { dignity: string; house: string; sign: string; avastha: string; context: string } {
  const lastDash = value.lastIndexOf(' — ');
  const raw = lastDash >= 0 ? value.slice(0, lastDash) : value;
  const context = lastDash >= 0 ? value.slice(lastDash + 3) : '';
  const houseMatch = raw.match(/in (\d+\w+) house/);
  const signMatch = raw.match(/\(([A-Z][a-z]+)\)/);
  const avMatch = raw.match(/(Mrita \(Dead\)|Bala \(Infant\)|Yuva \(Adult\)|Vriddha \(Old\)|Kumara \(Youth\))/);
  const dignityParts = raw.split(/\s+in\s+\d/);
  return {
    dignity: dignityParts[0]?.trim() ?? raw,
    house: houseMatch?.[1] ?? '',
    sign: signMatch?.[1] ?? '',
    avastha: avMatch?.[1] ?? '',
    context,
  };
}

function generateNatalProse(
  factors: ScoringFactor[],
  domainName: string,
  rating: Rating,
  isHi: boolean,
): string {
  // Skip yogas/doshas — they're rendered as structured lists
  const regular = factors.filter(f => f.label.en !== 'Active Yogas' && f.label.en !== 'Active Doshas');
  if (regular.length === 0) return '';

  // Group by verdict
  const positives = regular.filter(f => f.verdict === 'positive');
  const negatives = regular.filter(f => f.verdict === 'negative');
  const neutrals = regular.filter(f => f.verdict === 'neutral');

  if (isHi) return generateHindiProse(positives, negatives, neutrals, domainName, rating);
  return generateEnglishProse(positives, negatives, neutrals, domainName, rating);
}

function generateEnglishProse(
  positives: ScoringFactor[],
  negatives: ScoringFactor[],
  neutrals: ScoringFactor[],
  domain: string,
  rating: Rating,
): string {
  const parts: string[] = [];

  // ── Lead with dominant narrative ──
  if (positives.length > 0 && positives.length >= negatives.length) {
    // Strength-led narrative
    if (positives.length === 1) {
      const f = positives[0];
      const p = parsePlacement(f.value);
      const planet = extractPlanet(f.label.en);
      const isLord = f.label.en.includes('Lord');
      if (isLord) {
        if (p.dignity.includes('Own Sign') || p.dignity.includes('Exalted')) {
          parts.push(`${planet} rules this area and sits in ${p.dignity.toLowerCase()}${p.sign ? ` (${p.sign})` : ''} — like a king in his own court. This is the chart's anchor for ${domain}.`);
        } else {
          parts.push(`${planet} rules this area from a position of comfort${p.sign ? ` in ${p.sign}` : ''}, lending dependable strength to ${domain}.`);
        }
      } else {
        parts.push(`${planet}, the natural significator, is well-placed${p.sign ? ` in ${p.sign}` : ''} — its influence supports ${domain} from a solid foundation.`);
      }
    } else {
      // Multiple positive factors — synthesise
      const planets = positives.map(f => extractPlanet(f.label.en));
      const lords = positives.filter(f => f.label.en.includes('Lord'));
      const karakas = positives.filter(f => f.label.en.includes('karaka'));
      if (lords.length > 0 && karakas.length > 0) {
        const lordPlanets = lords.map(f => extractPlanet(f.label.en));
        const karakaPlanets = karakas.map(f => extractPlanet(f.label.en));
        parts.push(`Both the house lord${lords.length > 1 ? 's' : ''} (${lordPlanets.join(', ')}) and natural significator${karakas.length > 1 ? 's' : ''} (${karakaPlanets.join(', ')}) are well-placed — when lord and karaka agree, the promise is reinforced from multiple directions.`);
      } else {
        parts.push(`${planets.join(' and ')} combine to give ${domain} a strong foundation — ${planets.length} of your significators are in positions of strength.`);
      }
    }
  } else if (negatives.length > 0 && negatives.length > positives.length) {
    // Challenge-led narrative
    if (negatives.length === 1) {
      const f = negatives[0];
      const p = parsePlacement(f.value);
      const planet = extractPlanet(f.label.en);
      if (p.avastha.includes('Mrita')) {
        parts.push(`${planet} governs this area but is in Mrita (dead) avastha — the potential exists but delivery is blocked, like a teacher who knows the subject but cannot speak.`);
      } else if (p.dignity.includes('Debilitated')) {
        parts.push(`${planet} rules this area from debilitation${p.sign ? ` in ${p.sign}` : ''} — it struggles to fulfil its promise, making ${domain} an area that requires conscious effort.`);
      } else {
        parts.push(`${planet} faces difficulty in delivering results for ${domain}${p.avastha ? ` (${p.avastha} reduces effectiveness)` : ''}.`);
      }
    } else {
      const planets = negatives.map(f => extractPlanet(f.label.en));
      const listStr = planets.length <= 3
        ? planets.join(' and ')
        : `${planets.slice(0, -1).join(', ')} and ${planets[planets.length - 1]}`;
      parts.push(`Multiple significators for this area — ${listStr} — are under pressure. This doesn't block ${domain} entirely, but results come slowly and require sustained effort.`);
    }
  } else if (neutrals.length > 0 && positives.length === 0 && negatives.length === 0) {
    parts.push(`The significators for ${domain} are in moderate positions — neither strongly supported nor afflicted. Outcomes here depend heavily on effort and timing.`);
  }

  // ── Contrast: mention the other side briefly ──
  if (positives.length > 0 && negatives.length > 0) {
    if (parts.length > 0) {
      // Already wrote the lead, now contrast
      if (negatives.length <= positives.length) {
        const weakPlanets = negatives.map(f => {
          const planet = extractPlanet(f.label.en);
          const p = parsePlacement(f.value);
          return p.avastha ? `${planet} (${p.avastha.split(' ')[0]})` : planet;
        });
        const weakStr = weakPlanets.length <= 2
          ? weakPlanets.join(' and ')
          : `${weakPlanets.slice(0, -1).join(', ')} and ${weakPlanets[weakPlanets.length - 1]}`;
        parts.push(`However, ${weakStr} introduce${negatives.length === 1 ? 's' : ''} some friction — expect uneven progress rather than a smooth ride.`);
      } else {
        const strongPlanets = positives.map(f => extractPlanet(f.label.en));
        const strongStr = strongPlanets.length <= 2
          ? strongPlanets.join(' and ')
          : `${strongPlanets.slice(0, -1).join(', ')} and ${strongPlanets[strongPlanets.length - 1]}`;
        parts.push(`The saving grace: ${strongStr} provide${positives.length === 1 ? 's' : ''} a foothold of strength that prevents the difficulties from becoming overwhelming.`);
      }
    }
  }

  // ── Closing: must be coherent with what the bullets show ──
  const total = positives.length + negatives.length + neutrals.length;
  if (total > 2) {
    const hasMix = positives.length > 0 && negatives.length > 0;
    const CLOSING: Record<Rating, string> = {
      uttama: hasMix
        ? `On balance, the positives outweigh the friction — but don't ignore the weaker placements. Address them and this becomes one of your chart's best domains.`
        : `The chart's promise here is clear and well-supported.`,
      madhyama: `Strengths and weaknesses roughly balance out — effort and timing will decide which side dominates.`,
      adhama: hasMix
        ? `The bright spots exist but the headwinds are real. Remedial measures for the afflicted planets will make the difference.`
        : `Patience and the right remedial measures can shift this trajectory.`,
      atyadhama: `This area requires conscious effort and remedies — but every chart has its challenging domain, and awareness is the first step.`,
    };
    parts.push(CLOSING[rating]);
  }

  return parts.join(' ');
}

function generateHindiProse(
  positives: ScoringFactor[],
  negatives: ScoringFactor[],
  neutrals: ScoringFactor[],
  domain: string,
  rating: Rating,
): string {
  const parts: string[] = [];

  if (positives.length > 0 && positives.length >= negatives.length) {
    if (positives.length === 1) {
      const planet = extractPlanet(positives[0].label.en);
      const p = parsePlacement(positives[0].value);
      if (p.dignity.includes('Own') || p.dignity.includes('Exalted')) {
        parts.push(`${planet} इस क्षेत्र का स्वामी है और ${p.dignity.includes('Exalted') ? 'उच्च' : 'स्वगृह'} में बैठा है — यह ${domain} के लिए कुण्डली का मुख्य बल है।`);
      } else {
        parts.push(`${planet} इस क्षेत्र को अनुकूल स्थिति से सहारा दे रहा है।`);
      }
    } else {
      const planets = positives.map(f => extractPlanet(f.label.en));
      parts.push(`${planets.join(' और ')} दोनों सुदृढ़ स्थिति में हैं — जब स्वामी और कारक दोनों बली हों तो ${domain} का वादा और पुष्ट होता है।`);
    }
  } else if (negatives.length > 0 && negatives.length > positives.length) {
    if (negatives.length === 1) {
      const planet = extractPlanet(negatives[0].label.en);
      const p = parsePlacement(negatives[0].value);
      if (p.avastha.includes('Mrita')) {
        parts.push(`${planet} इस क्षेत्र का स्वामी है पर मृत अवस्था में है — क्षमता है पर फलदायक नहीं हो पा रहा।`);
      } else {
        parts.push(`${planet} ${domain} के लिए चुनौतीपूर्ण स्थिति में है — प्रयास अधिक, फल धीरे।`);
      }
    } else {
      parts.push(`${domain} में अनेक चुनौतियाँ हैं — पर यह असफलता नहीं, अधिक प्रयास और सही समय की आवश्यकता है।`);
    }
  } else if (neutrals.length > 0 && positives.length === 0 && negatives.length === 0) {
    parts.push(`${domain} के कारक मध्यम स्थिति में हैं — फल प्रयास और समय पर निर्भर करेगा।`);
  }

  if (positives.length > 0 && negatives.length > 0) {
    if (negatives.length <= positives.length) {
      parts.push('कुछ बाधाएँ हैं — सम प्रगति की बजाय उतार-चढ़ाव रहेगा।');
    } else {
      parts.push('बलवान ग्रह सहारा देते हैं — कठिनाइयाँ पूर्ण रूप से हावी नहीं होंगी।');
    }
  }

  const total = positives.length + negatives.length + neutrals.length;
  if (total > 2) {
    const CLOSING_HI: Record<Rating, string> = {
      uttama: 'कुण्डली का वादा यहाँ स्पष्ट और सुदृढ़ है।',
      madhyama: 'बल और दुर्बलता में लगभग सन्तुलन है।',
      adhama: 'धैर्य और उचित उपाय इस दिशा को बदल सकते हैं।',
      atyadhama: 'केन्द्रित उपाय और समय की सजगता यहाँ अत्यन्त आवश्यक है।',
    };
    parts.push(CLOSING_HI[rating]);
  }

  return parts.join(' ');
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
