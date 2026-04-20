'use client';

import { tl } from '@/lib/utils/trilingual';
import { getDomainConfig } from '@/lib/kundali/domain-synthesis/config';
import DomainCard from '@/components/kundali/DomainCard';
import CurrentPeriodCard from '@/components/kundali/CurrentPeriodCard';
import type {
  PersonalReading,
  DomainType,
  CrossDomainLink,
} from '@/lib/kundali/domain-synthesis/types';

// ---------------------------------------------------------------------------
// Labels
// ---------------------------------------------------------------------------

const LABELS = {
  lifeAtAGlance: { en: 'Your Life at a Glance', hi: 'आपके जीवन पर एक नज़र', sa: 'जीवनावलोकनम्', ta: 'உங்கள் வாழ்க்கையின் சுருக்கம்' },
  connections: { en: 'Connections Across Your Life', hi: 'आपके जीवन में संबंध', sa: 'जीवनसम्बन्धाः', ta: 'உங்கள் வாழ்வின் தொடர்புகள்' },
  technicalToggle: { en: 'Advanced: Technical Chart Data', hi: 'उन्नत: तकनीकी कुंडली डेटा', sa: 'उन्नतम्: तान्त्रिककुण्डलीसूचनाः', ta: 'மேம்பட்ட: தொழில்நுட்ப வரைபட தரவு' },
};

const LINK_TYPE_LABELS: Record<string, Record<string, string>> = {
  supports: { en: 'supports', hi: 'सहायता', sa: 'सहायकम्', ta: 'ஆதரவு' },
  conflicts: { en: 'conflicts with', hi: 'संघर्ष', sa: 'विरोधः', ta: 'முரண்பாடு' },
  depends_on: { en: 'depends on', hi: 'निर्भर', sa: 'निर्भरम्', ta: 'சார்ந்துள்ளது' },
};

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------

interface LifeReadingDashboardProps {
  reading: PersonalReading;
  locale: string;
  onDomainClick: (domain: DomainType) => void;
  onToggleTechnical: () => void;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Collect unique cross-domain links from all domains, capped at 5. */
function collectCrossDomainLinks(
  reading: PersonalReading,
): { fromDomain: DomainType; link: CrossDomainLink }[] {
  const seen = new Set<string>();
  const results: { fromDomain: DomainType; link: CrossDomainLink }[] = [];

  for (const domain of reading.domains) {
    for (const link of domain.crossDomainLinks) {
      // De-duplicate bidirectional links (A↔B and B↔A)
      const key = [domain.domain, link.linkedDomain].sort().join('::');
      if (seen.has(key)) continue;
      seen.add(key);
      results.push({ fromDomain: domain.domain, link });
      if (results.length >= 5) return results;
    }
  }

  return results;
}

function domainDisplayName(domain: DomainType, locale: string): string {
  const config = getDomainConfig(domain);
  return config ? tl(config.name, locale) : domain;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function LifeReadingDashboard({
  reading,
  locale,
  onDomainClick,
  onToggleTechnical,
}: LifeReadingDashboardProps) {
  const crossLinks = collectCrossDomainLinks(reading);

  return (
    <div className="w-full space-y-0">
      {/* ----------------------------------------------------------------- */}
      {/* 1. Life Overview */}
      {/* ----------------------------------------------------------------- */}
      <section className="bg-gradient-to-br from-[#2d1b69]/20 to-transparent border border-gold-primary/10 rounded-2xl p-6">
        <p className="text-gold-dark text-xs uppercase tracking-widest mb-2">
          {tl(LABELS.lifeAtAGlance, locale)}
        </p>
        <p className="text-text-secondary text-base leading-relaxed italic font-heading">
          {tl(reading.topInsight, locale)}
        </p>
      </section>

      {/* ----------------------------------------------------------------- */}
      {/* 2. Current Period Card */}
      {/* ----------------------------------------------------------------- */}
      <div className="mt-6">
        <CurrentPeriodCard period={reading.currentPeriod} locale={locale} />
      </div>

      {/* ----------------------------------------------------------------- */}
      {/* 3. Domain Cards Grid */}
      {/* ----------------------------------------------------------------- */}
      <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 stagger-children">
        {reading.domains.map((domainReading) => (
          <DomainCard
            key={domainReading.domain}
            reading={domainReading}
            locale={locale}
            onClick={() => onDomainClick(domainReading.domain)}
          />
        ))}
      </div>

      {/* ----------------------------------------------------------------- */}
      {/* 4. Cross-Domain Links */}
      {/* ----------------------------------------------------------------- */}
      {crossLinks.length > 0 && (
        <section className="mt-8">
          <h3 className="text-gold-gradient text-lg font-bold mb-4">
            {tl(LABELS.connections, locale)}
          </h3>
          <div className="flex flex-wrap gap-3">
            {crossLinks.map(({ fromDomain, link }, i) => (
              <div
                key={`${fromDomain}-${link.linkedDomain}-${i}`}
                className="bg-bg-secondary/50 border border-gold-primary/8 rounded-xl p-4 max-w-xs flex-1 min-w-[200px]"
              >
                <p className="text-gold-light text-sm font-semibold mb-1">
                  {domainDisplayName(fromDomain, locale)}
                  {' '}
                  <span className="text-text-secondary">&#8596;</span>
                  {' '}
                  {domainDisplayName(link.linkedDomain, locale)}
                </p>
                <p className="text-text-secondary text-xs mb-1.5 italic">
                  {tl(LINK_TYPE_LABELS[link.linkType] ?? LINK_TYPE_LABELS.supports, locale)}
                </p>
                <p className="text-text-secondary text-sm leading-relaxed">
                  {tl(link.explanation, locale)}
                </p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ----------------------------------------------------------------- */}
      {/* 5. Technical Details Toggle */}
      {/* ----------------------------------------------------------------- */}
      <div className="mt-10 border-t border-gold-primary/10 pt-4 text-center">
        <button
          type="button"
          onClick={onToggleTechnical}
          className="text-text-secondary text-sm hover:text-gold-primary transition-colors cursor-pointer"
        >
          {tl(LABELS.technicalToggle, locale)} &#9662;
        </button>
      </div>
    </div>
  );
}
