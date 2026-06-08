/**
 * Per-planet Mahadasha forecast prose, by strength band
 * (strong / adequate / weak / action). EN/HI authored inline; rest
 * via Gemini overlay JSON. Consumers read via
 * `tlScript(PLANET_DASHA_FORECAST[id].strong, locale)`.
 */
import type { LocaleText } from '@/types/panchang';
import OVERLAY from '@/lib/constants/planet-dasha-forecast-overlay.json';

type Axis = 'strong' | 'adequate' | 'weak' | 'action';
type OverlayShape = Partial<Record<string, Record<string, string>>>;
const overlay = OVERLAY as OverlayShape;

const AUTHORED_EN: Record<number, Record<Axis, string>> = {
  0: {
    strong: 'Career breakthroughs, government recognition, leadership roles. Authority figures support you.',
    adequate: 'Steady career growth, father relationships improve, vitality is reliable.',
    weak: 'Career setbacks likely, eye/heart health needs attention. Avoid conflicts with authority figures.',
    action: 'Apply for promotions, take on leadership roles, strengthen relationship with father.',
  },
  1: {
    strong: 'Emotional peace, public popularity, mother relationship flourishes. Best period for public-facing work.',
    adequate: 'Emotional stability, modest public recognition, family life pleasant.',
    weak: 'Mental fluctuations, sleep issues, mother\'s health may be a concern. Avoid major decisions in emotional states.',
    action: 'Launch public ventures, nurture close relationships, work with the public or media.',
  },
  2: {
    strong: 'Property acquisition, physical achievement, courage rewarded. Siblings and allies are supportive.',
    adequate: 'Energy and initiative carry you forward in concrete, material goals.',
    weak: 'Injury risk, property disputes, temper issues. Avoid impulsive decisions and risky physical activities.',
    action: 'Buy property, start a fitness regimen, take bold but calculated risks.',
  },
  3: {
    strong: 'Business success, communication wins, education thrives. Writing, media, and analytical work excel.',
    adequate: 'Good for studies, business deals, networking, and intellectual pursuits.',
    weak: 'Miscommunication, nervous system sensitivity, indecision. Double-check all agreements before signing.',
    action: 'Start studies, sign contracts, launch media or writing projects, network actively.',
  },
  4: {
    strong: 'Wisdom grows, wealth expands, children succeed. Excellent judgment and spiritual advancement. Best period for higher education and investment.',
    adequate: 'Growth and expansion in key life areas. Guidance and good fortune come when needed.',
    weak: 'Poor advice leads to costly mistakes, financial misjudgments, children may face challenges. Consult trusted mentors before major decisions.',
    action: 'Invest for the long term, pursue higher education, have children, find a guru or mentor.',
  },
  5: {
    strong: 'Happy marriage or relationship, artistic success, financial gains from beauty/art/luxury. Life feels pleasurable.',
    adequate: 'Relationships are pleasant, creative projects succeed moderately, comforts increase.',
    weak: 'Relationship friction, kidney or reproductive health needs monitoring, overspending risk. Be deliberate in romantic decisions.',
    action: 'Get married, launch creative ventures, invest in beauty or luxury sector, deepen artistic practice.',
  },
  6: {
    strong: 'Career stability, disciplined wealth building, longevity confirmed. Hard work is consistently rewarded.',
    adequate: 'Slow but steady progress. Discipline and persistence reliably pay off.',
    weak: 'Delays, chronic health issues (joints, bones, teeth), career obstacles. Extra patience and persistence are essential.',
    action: 'Build long-term assets, establish daily routines, take on serious responsibilities, do inner work.',
  },
};

function build(planetId: number, axis: Axis): LocaleText {
  const en = AUTHORED_EN[planetId][axis];
  const key = `p${planetId}_${axis}`;
  const out: LocaleText = { en };
  for (const locale of ['hi', 'mai', 'mr', 'ta', 'te', 'kn', 'gu', 'bn'] as const) {
    const v = overlay[locale]?.[key];
    if (v) out[locale] = v;
  }
  return out;
}

export const PLANET_DASHA_FORECAST: Record<number, Record<Axis, LocaleText>> = (() => {
  const out: Record<number, Record<Axis, LocaleText>> = {};
  for (const id of Object.keys(AUTHORED_EN).map(Number)) {
    out[id] = {
      strong: build(id, 'strong'),
      adequate: build(id, 'adequate'),
      weak: build(id, 'weak'),
      action: build(id, 'action'),
    };
  }
  return out;
})();
