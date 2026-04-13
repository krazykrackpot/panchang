'use client';

import { useState } from 'react';
import { useLocale } from 'next-intl';
import { authedFetch } from '@/lib/api/authed-fetch';
import { parseGateError, type GateError } from '@/lib/api/parse-gate-error';
import UsageLimitBanner from '@/components/ui/UsageLimitBanner';
import { motion, AnimatePresence } from 'framer-motion';
import ChartNorth from '@/components/kundali/ChartNorth';
import GoldDivider from '@/components/ui/GoldDivider';
import InfoBlock from '@/components/ui/InfoBlock';
import LocationSearch from '@/components/ui/LocationSearch';
import { getUTCOffsetForDate } from '@/lib/utils/timezone';
import { GrahaIconById } from '@/components/icons/GrahaIcons';
import { GRAHAS } from '@/lib/constants/grahas';
import type { Locale } from '@/types/panchang';
import type { KPChartData } from '@/types/kp';
import { tl } from '@/lib/utils/trilingual';
import { isDevanagariLocale } from '@/lib/utils/locale-fonts';

// ---------------------------------------------------------------------------
// Life area readings: per-planet × per-area (strong / weak)
// ---------------------------------------------------------------------------
const LIFE_READINGS: Record<string, Record<number, { strong: string; weak: string }>> = {
  marriage: {
    0: {
      strong: 'The Sun presides over your 7th cusp — marriage brings social prominence and public recognition. Your partner will be dignified, commanding, and likely prominent in their field. This is a union built on mutual respect and shared social standing, not mere romance.',
      weak: 'The Sun at the 7th cusp creates ego-friction within partnership. Pride and the need for dominance may delay or disrupt committed relationships. Marriage flourishes when solar pride consciously makes room for another sovereign.',
    },
    1: {
      strong: 'The Moon governs your 7th cusp — a deeply emotional, nurturing marriage is promised. Your partner is caring, domestic, and family-centred. The bond forms instinctively and deepens through daily attunement. Home and children become the very heart of this union.',
      weak: 'The Moon creates emotional turbulence in partnerships — partners who are changeable, moody, or unstable. The promise of deep love exists but timing fluctuates. Emotional groundedness within yourself is the key to stabilising this bond.',
    },
    2: {
      strong: 'Mars rules your 7th sub-lord — marriage is passionate, courageous, and dynamic. Your partner will be energetic, action-oriented, and strong-willed. The union thrives when both channel this fire into shared achievements rather than conflict with each other.',
      weak: 'Mars disrupts the 7th cusp with arguments, legal friction, and possible separation. Marriage timing is delayed until Mars-related karma is resolved. The passion is undeniable; sustained harmony requires significant conscious effort.',
    },
    3: {
      strong: 'Mercury governs your 7th sub-lordship — your partner is intelligent, communicative, and commercially astute. Business and romance naturally combine. The relationship thrives on mental stimulation, wit, and shared curiosity. A youthful or versatile spouse is indicated.',
      weak: 'Mercury here creates indecision and mental incompatibility in choosing a partner. Over-analysis delays commitment. Multiple short alliances precede the lasting bond. Learning to feel first and think second opens the door to enduring love.',
    },
    4: {
      strong: 'Jupiter as 7th cusp sub-lord is the supreme blessing for marriage. A wise, generous, and spiritually evolved partner is promised. The union brings abundance, children, and mutual elevation. This is a dharmic marriage — purposeful, expansive, and deeply fulfilling.',
      weak: 'Even a challenged Jupiter promises marriage — but delays and over-idealisation hinder commitment. You place your partner on a pedestal no human can sustain. Accepting a real, imperfect person with grace is the key to this placement\'s fulfilment.',
    },
    5: {
      strong: 'Venus sub-lords your 7th cusp — marriage is written in gold. Beauty, harmony, and deep mutual affection define this union. Your partner is charming, creative, and pleasure-loving. Venus in its home domain makes marriage not just promised but glorified — a source of enduring joy.',
      weak: 'Venus denied at the 7th cusp creates romantic dissatisfaction — beautiful partners who disappoint, or beauty without depth. The promise of love is present but requires moving beyond surface attraction into genuine vulnerability and shared values.',
    },
    6: {
      strong: 'Saturn sub-lords your 7th cusp — marriage arrives late but proves enduring beyond measure. Your partner may be older, serious, or from a different background. Saturn demands patience; the reward is a partnership forged in deep trust, duty, and the alchemy of shared time.',
      weak: 'Saturn delaying the 7th cusp creates significant postponement or a marriage burdened by karmic weight. Loneliness or separation may accompany this placement until Saturn\'s discipline is internalised. Late marriage brings greater wisdom to the union.',
    },
    7: {
      strong: 'Rahu governs your 7th sub-lordship — marriage has a destined, unconventional character. Your partner may be foreign, from a different culture, or uniquely unconventional. The relationship defies convention, carries intense karmic charge, and is ultimately written in the cosmic plan.',
      weak: 'Rahu disrupts the 7th cusp with obsessive attractions, illusions, and unusual complications in marriage timing. Attraction to unsuitable partners recurs. Clarity of intent and spiritual grounding are essential before committing to partnership.',
    },
    8: {
      strong: 'Ketu as 7th sub-lord indicates a spiritually charged, karmic marriage. This partner is known from past lives — the recognition is instantaneous. The union transcends ordinary convention and is oriented toward liberation rather than material satisfaction.',
      weak: 'Ketu at the 7th cusp creates themes of detachment and separation in partnership. Marriage may be avoided, or spiritualised to the point of avoiding human intimacy. The soul is learning non-attachment through the school of relationship.',
    },
  },
  career: {
    0: {
      strong: 'The Sun governs your 10th cusp — career in government, administration, medicine, or authority is powerfully indicated. Public recognition and social status through your profession are promised. You are built for leadership; the professional world acknowledges your solar presence.',
      weak: 'The Sun\'s pride at the 10th cusp creates conflicts with authority figures and bosses. Career advancement comes through periods of resistance. Learning to work within systems before reshaping them is the Sun\'s necessary lesson.',
    },
    1: {
      strong: 'The Moon governs your 10th cusp — career in nurturing, public service, hospitality, or emotional commerce is indicated. Your professional life is people-oriented and emotionally rich. Public reputation waxes and wanes but always returns to prominence.',
      weak: 'The Moon\'s fluctuating nature at the 10th cusp creates career inconsistency — frequent changes of direction, emotional professional decisions, or instability of reputation. A stable professional anchor transforms this fluid energy.',
    },
    2: {
      strong: 'Mars commands your 10th cusp — career in engineering, surgery, military, law enforcement, or competitive business is powerfully favoured. You execute with precision and courage. Professional success comes through decisive action and the willingness to lead under pressure.',
      weak: 'Mars frustrated at the 10th cusp brings conflicts with colleagues, impulsive career decisions, and professional setbacks through aggression or haste. Channelling Mars into disciplined action rather than reaction reshapes the trajectory dramatically.',
    },
    3: {
      strong: 'Mercury governs your 10th cusp — career in communications, commerce, technology, writing, or education is strongly indicated. Your professional currency is intelligence and adaptability. Multiple career streams may coexist simultaneously and all may prosper.',
      weak: 'Mercury\'s duality at the 10th cusp creates professional indecision, multiple false starts, or difficulty committing to a single career path. Scattering energy dilutes impact. Focus and follow-through are the essential correctives.',
    },
    4: {
      strong: 'Jupiter blesses your 10th cusp — career in law, finance, education, spirituality, or consulting brings recognition and abundance. Professional growth is expansive and dharmic. You are sought as a teacher, guide, or advisor. The world rewards your wisdom generously.',
      weak: 'Jupiter over-expanding at the 10th cusp leads to over-promising in commitments or ethical lapses in career ambition. The lesson is integrity above opportunity. When ethics anchor the career, Jupiter\'s promised abundance arrives.',
    },
    5: {
      strong: 'Venus presides over your 10th cusp — career in the arts, fashion, beauty, entertainment, finance, or diplomacy is strongly favoured. Professional success comes with elegance and natural charm. You make difficult things look effortless; recognition in aesthetics defines your identity.',
      weak: 'Venus at the 10th cusp delayed or denied creates professional dissatisfaction — aesthetics without impact, charm without substance. Moving from superficiality to depth in professional expression unlocks this placement\'s considerable promise.',
    },
    6: {
      strong: 'Saturn governs your 10th cusp — career is built slowly, methodically, and to exceptional durability. Success comes later in life but is more solid than any other placement. You excel in law, administration, real estate, or construction. Endurance is your professional superpower.',
      weak: 'Saturn delaying the 10th cusp creates a career that struggles to gain momentum — obstacles, late recognition, and systemic resistance. Consistent effort over time without attachment to immediate reward is the only remedy Saturn accepts.',
    },
    7: {
      strong: 'Rahu governs your 10th cusp — unconventional, innovative, or foreign-connected career is strongly indicated. You excel in technology, media, politics, or any field that rewards disruption and ambition. Professional rise can be rapid and startling in its trajectory.',
      weak: 'Rahu at the 10th cusp creates professional instability, sudden reversals of fortune, or career advancement through questionable means that leads to eventual fall. Authentic ambition with ethical foundations is the only stable path through Rahu\'s professional maze.',
    },
    8: {
      strong: 'Ketu governs your 10th cusp — career in healing, occult sciences, spirituality, research, or ancient knowledge fields is strongly favoured. You bring wisdom to professional contexts that others cannot replicate. Extraordinary mastery in a narrow specialisation is your professional gift.',
      weak: 'Ketu at the 10th cusp creates professional detachment, difficulty sustaining career ambition, or sudden abandonments of promising paths. Finding purpose-aligned work rather than conventional success activates this placement\'s deep competence.',
    },
  },
  wealth: {
    0: {
      strong: 'The Sun governs your 2nd cusp — wealth flows through authority, government, or professional prominence. Financial resources are tied to your social status and reputation. Income rises with your public standing. Gold and stable assets are the Sun\'s favoured investments.',
      weak: 'The Sun blocked at the 2nd cusp creates financial struggles tied to pride — overspending to maintain status, conflicts over family wealth, or losses through authoritative figures. Humility in financial matters preserves what the Sun otherwise scatters.',
    },
    1: {
      strong: 'The Moon governs your 2nd cusp — wealth through nurturing, public service, hospitality, or emotional commerce. Financial flow is cyclical — waxing and waning but always returning. Real estate, liquid assets, and businesses serving the public are especially favoured.',
      weak: 'The Moon at the 2nd cusp creates financial instability — emotional spending, fluctuating income, or loss through domestic situations. Building emotional discipline around money decisions stabilises this otherwise fluid energy.',
    },
    2: {
      strong: 'Mars governs your 2nd cusp — wealth through industry, technical work, real estate, or competitive business. Financial gains come through courage and decisive action. Mars gives strong earning power; guard against impulsive expenditure that erodes accumulated wealth.',
      weak: 'Mars frustrated at the 2nd cusp brings financial losses through aggression, legal disputes over money, or reckless spending on impulse. Patience and planning around finances — virtues Mars resists — are the keys to turning this placement toward prosperity.',
    },
    3: {
      strong: 'Mercury governs your 2nd cusp — wealth through commerce, communication, technology, or trade. You are financially intelligent and versatile. Multiple income streams serve you well. Your financial mind is sharp; you understand markets, negotiations, and the value of information.',
      weak: 'Mercury\'s dual nature at the 2nd cusp leads to financial inconsistency — smart decisions followed by poor ones, or wealth scattered across too many ventures. Concentrating financial energy on fewer, deeper commitments dramatically improves the outcome.',
    },
    4: {
      strong: 'Jupiter blesses your 2nd cusp — one of the most auspicious positions for accumulated wealth. Fortune grows through wisdom, generosity, and righteous action. Financial gains through education, law, or growth investments are strongly promised. What you give returns multiplied.',
      weak: 'Jupiter over-expanding at the 2nd cusp leads to over-generosity at the expense of savings, or financial speculation beyond one\'s means. Dharmic wealth requires both giving and responsible stewardship. Jupiter still promises abundance — on the condition of financial integrity.',
    },
    5: {
      strong: 'Venus governs your 2nd cusp — wealth through arts, beauty, luxury, entertainment, or relationship-based commerce. Financial comfort is a natural companion to your life. Home, adornment, and aesthetic pleasures are both the source and reward of your wealth.',
      weak: 'Venus denied at the 2nd cusp creates financial dissatisfaction — income that comes but is quickly spent on pleasures, or loss through partnerships and luxury. Distinguishing genuine enjoyment from compensatory spending is the financial discipline this placement demands.',
    },
    6: {
      strong: 'Saturn governs your 2nd cusp — wealth arrives through disciplined effort, service industries, or slow-compounding investments. Financial success is delayed but extremely durable once established. You build wealth the way Saturn builds character — one year of honest work at a time.',
      weak: 'Saturn delaying the 2nd cusp creates financial hardship early in life and a slow climb toward stability. A fear-based relationship with money may develop. Breaking this pattern requires Saturn\'s own remedy: consistent, structured savings regardless of how small the amount.',
    },
    7: {
      strong: 'Rahu governs your 2nd cusp — wealth through unconventional, foreign, or technology-linked channels. Financial gains can be sudden and dramatic. You may accumulate wealth in ways others find puzzling. Foreign income and digital economy opportunities are especially favoured.',
      weak: 'Rahu at the 2nd cusp creates sudden financial reversals — money appearing and vanishing in unusual ways. Deceptive dealings around finances or losses through speculation are risks. Conservative, transparent financial practices provide the grounding Rahu lacks.',
    },
    8: {
      strong: 'Ketu governs your 2nd cusp — wealth through specialised mastery, research, or healing arts. Financial gains may come through unconventional means or unexpected sources. Ketu is indifferent to wealth but paradoxically often receives it through accumulated past-life karma.',
      weak: 'Ketu at the 2nd cusp creates financial detachment and possible sudden losses in family wealth or inherited assets. The soul\'s disinterest in accumulation requires practical compensation — disciplined financial habits imposed from outside when inner motivation for wealth is minimal.',
    },
  },
  health: {
    0: {
      strong: 'The Sun governs your 1st cusp — vitality is strong, constitution robust, and physical resilience considerable. Heart, spine, and eyes are areas of natural strength. You radiate health when in alignment with your life\'s purpose. Solar energy makes you naturally vitalising to others.',
      weak: 'The Sun blocked at the 1st cusp creates vulnerability in heart, circulation, or vision. Pride about health may delay seeking treatment. The physical body needs conscious rest; the Sun\'s fire burns bright but requires fuel. Preventive care is essential.',
    },
    1: {
      strong: 'The Moon governs your 1st cusp — health is closely tied to emotional wellbeing. When your inner life is settled, physical health flourishes. Digestion, lungs, and the lymphatic system are key strength areas. Aligning lifestyle with lunar rhythms brings natural vitality.',
      weak: 'The Moon at the 1st cusp creates health that fluctuates with emotional states — psychosomatic tendencies, digestive sensitivity, and fluid imbalances. Emotional hygiene is as important as physical. Unprocessed feelings manifest physically with this placement.',
    },
    2: {
      strong: 'Mars governs your 1st cusp — physical constitution is strong, muscular, and energetic. You possess considerable stamina and recover rapidly from illness. Mars here gives athletic potential and a proactive relationship with your body. Direct, physical activity is essential for wellbeing.',
      weak: 'Mars frustrated at the 1st cusp creates accident-proneness, fevers, and inflammatory conditions. Recklessness in physical activities risks the very body Mars energises. Disciplined exercise and preventive care transform this placement\'s challenging potential.',
    },
    3: {
      strong: 'Mercury governs your 1st cusp — health is mental in orientation. A clear, active mind correlates with physical vitality. Nervousness and over-thinking are the primary health risks. Lungs, nervous system, and communication organs are key areas of natural capability.',
      weak: 'Mercury at the 1st cusp creates nervous disorders, respiratory sensitivity, or anxiety-related physical symptoms. The mind\'s constant activity becomes a health liability when unmanaged. Meditation, structured rest, and limiting information overload are the most effective remedies.',
    },
    4: {
      strong: 'Jupiter governs your 1st cusp — constitution is generally robust and self-repairing. The body\'s natural intelligence is high. Liver, fat metabolism, and arterial health are key focus areas. Spiritual practice enhances physical immunity dramatically.',
      weak: 'Jupiter over-expanding at the 1st cusp creates weight-related health concerns, liver vulnerabilities, or excess in lifestyle that undermines what should be a strong constitution. Moderation — Jupiter\'s most challenging teaching — is the primary health prescription.',
    },
    5: {
      strong: 'Venus governs your 1st cusp — physical constitution favours beauty, balance, and grace. The reproductive system, kidneys, and skin are areas of natural vitality. Pleasurable lifestyle interventions — good food, beautiful environments, satisfying relationships — literally improve your physical health.',
      weak: 'Venus denied at the 1st cusp creates health concerns in the reproductive system, kidneys, or skin. Indulgence in pleasures undermines what it promises. The remedy is beauty in moderation — enjoying Venus\'s gifts without allowing excess to erode the physical foundation.',
    },
    6: {
      strong: 'Saturn governs your 1st cusp — constitution is lean, durable, and built for longevity rather than explosive energy. Joints, bones, and the musculoskeletal system are key strength areas. Health challenges early in life build extraordinary physical resilience over time.',
      weak: 'Saturn at the 1st cusp creates chronic conditions, joint and bone vulnerabilities, or constitutional weakness demanding ongoing management. The body ages but endures. Structured lifestyle, consistent routine, and avoiding cold and damp environments are Saturn\'s specific prescriptions.',
    },
    7: {
      strong: 'Rahu governs your 1st cusp — health is unconventional in its expression. You may be drawn to alternative medicine, foreign health systems, or cutting-edge interventions. The immune system operates unusually; trust your body\'s unique signals even when they defy convention.',
      weak: 'Rahu disrupting the 1st cusp creates mysterious or difficult-to-diagnose health conditions and unusual susceptibilities. Mainstream medicine may not fully capture what ails you. Integrative, holistic approaches — including addressing karmic dimensions of health — are particularly effective.',
    },
    8: {
      strong: 'Ketu governs your 1st cusp — health has a strong psychic and karmic dimension. Acute illness and rapid recovery alternate through life. You possess unusual healing ability — both to heal yourself and to intuit others\' health needs. Past-life karma surfaces through the body as wisdom.',
      weak: 'Ketu at the 1st cusp creates abrupt health events, sudden energy losses, or chronic conditions of mysterious origin tied to past-life karma. The body serves as the karmic settlement ledger. Spiritual practice — especially mantra and pranayama — is uniquely effective for Ketu-type conditions.',
    },
  },
  property: {
    0: {
      strong: 'The Sun governing your 4th cusp brings property through authority, government, or prominent family connections. Grand, status-affirming property is indicated. Ancestral and institutional real estate may feature prominently in your story.',
      weak: 'The Sun blocked at the 4th cusp creates conflict over ancestral or domestic property. Disputes with father or authority figures over home matters are common. Ego-driven property decisions invite unnecessary loss.',
    },
    1: {
      strong: 'The Moon governs your 4th cusp — domestic happiness and property are emotionally fulfilling. Multiple residential changes through life, but each home is deeply felt. Real estate near water or in emotionally resonant locations is especially favoured.',
      weak: 'The Moon at the 4th cusp creates domestic instability — frequent moves and emotional disruption in the home environment. Building emotional security independently of physical address is the essential inner work.',
    },
    2: {
      strong: 'Mars governs your 4th cusp — property is acquired through decisive action, competitive bidding, or construction. You may own land or property with industrial or agricultural utility. Mars gives the drive to acquire property even against significant obstacles.',
      weak: 'Mars frustrated at the 4th cusp brings property disputes, legal battles over real estate, or losses through fire or conflict at home. Patience in real estate decisions prevents the impulsive moves Mars tempts here.',
    },
    3: {
      strong: 'Mercury governs your 4th cusp — property may involve commercial utility: shops, technology-linked real estate, or multi-purpose spaces. Multiple properties or frequent renegotiation of terms is characteristic. Smart investment through information advantage is your edge.',
      weak: 'Mercury at the 4th cusp creates indecision in property matters — many options, no clear choice. Rental and short-term arrangements may dominate over outright ownership. Committing to one decision and following through is the necessary corrective.',
    },
    4: {
      strong: 'Jupiter governs your 4th cusp — a powerful blessing for property and domestic happiness. Large, auspicious property in excellent locations is strongly indicated. The home becomes a place of learning, gathering, and abundance. Ancestral blessings through property are common.',
      weak: 'Jupiter over-expanding at the 4th cusp leads to over-investment in property or domestic comfort beyond one\'s means. Grounding Jupiter\'s expansive property dreams in financial reality protects the considerable promise this placement still carries.',
    },
    5: {
      strong: 'Venus governs your 4th cusp — property is beautiful, comfortable, and aesthetically refined. Your home is a sanctuary of beauty and pleasure. Real estate in artistic, scenic, or luxurious locations is favoured. Property acquired through partnership or the arts is strongly indicated.',
      weak: 'Venus denied at the 4th cusp creates domestic dissatisfaction — beautiful homes that remain out of reach, or property obtained at significant personal cost. Examining the relationship between home comfort and personal values brings clarity.',
    },
    6: {
      strong: 'Saturn governs your 4th cusp — property is acquired slowly and with sustained effort, but what is built endures for generations. Old property, farmland, and structural real estate are favoured. Late in life, a solid and permanent home base is firmly established.',
      weak: 'Saturn at the 4th cusp creates domestic hardship, austere home environments, and delayed property acquisition. Living arrangements impose karmic lessons. Building practical home security without waiting for ideal conditions is Saturn\'s counsel.',
    },
    7: {
      strong: 'Rahu governs your 4th cusp — property in foreign lands, unconventional locations, or connected to unusual circumstances. Sudden property gains are possible. Technology-linked real estate or property in rapidly changing areas features prominently in your story.',
      weak: 'Rahu at the 4th cusp creates domestic upheaval, property matters connected to deception, or a home environment that is never quite stable. Realistic assessment of domestic commitments prevents Rahu from dispersing domestic peace.',
    },
    8: {
      strong: 'Ketu governs your 4th cusp — domestic life has a spiritual or hermit-like quality. Ancestral property with deep karmic history may feature. The home as a place of retreat, meditation, and inner work is especially meaningful and productive for your soul\'s evolution.',
      weak: 'Ketu at the 4th cusp creates sudden domestic disruptions, detachment from property, or loss of ancestral land through unusual circumstances. The home as a karmic completion point — what was given must eventually return — is the underlying theme.',
    },
  },
  fortune: {
    0: {
      strong: 'The Sun governs your 9th cusp — fortune comes through authority, government connections, and your father\'s lineage. Higher education in prestigious institutions is favoured. Dharmic action in public roles generates extraordinary luck. Divine protection follows you in public life.',
      weak: 'The Sun blocked at the 9th cusp creates conflicts with teachers, gurus, or father figures that delay fortune. Pride in belief systems closes doors that humility would open. True fortune arrives when the solar ego submits to a higher principle.',
    },
    1: {
      strong: 'The Moon governs your 9th cusp — fortune flows through emotional intelligence, intuition, and the wisdom of the feminine principle. Long journeys and foreign lands bring unexpected blessings. Your mother\'s karma carries auspicious grace into your life.',
      weak: 'The Moon at the 9th cusp creates fluctuating fortune — periods of extraordinary luck followed by drought. Faith waxes and wanes. Anchoring spiritual practice regardless of external fortune stabilises the Moon\'s promised blessings.',
    },
    2: {
      strong: 'Mars governs your 9th cusp — fortune is earned through courage, pioneering action, and willingness to venture into unknown territory. Long journeys, especially to challenging destinations, bring significant blessings. Dharmic warriors are especially favoured by Mars here.',
      weak: 'Mars frustrated at the 9th cusp creates conflicts with religious or educational establishments and losses through long journeys. Righteous anger misdirected as intolerance invites misfortune. Disciplined courage rather than reactive bravado is the corrective.',
    },
    3: {
      strong: 'Mercury governs your 9th cusp — fortune through education, publishing, communication, and the exchange of ideas across distances. Multiple gurus and teachers contribute to your wisdom. The life of the mind is where your fortune multiplies most readily.',
      weak: 'Mercury at the 9th cusp creates scattered philosophical thinking or fortune lost to intellectual pride. The mind must serve wisdom rather than replace it. Committing to a genuine spiritual path — Mercury\'s greatest challenge — unlocks the considerable promise of this placement.',
    },
    4: {
      strong: 'Jupiter governing your 9th cusp is the most auspicious position for fortune, dharma, and divine grace. You are cosmically protected. Higher wisdom, genuine gurus, and the full spectrum of life\'s blessings are accessible to you. This indicates a soul that has earned extraordinary fortune through past-life dharmic action.',
      weak: 'Even a challenged Jupiter on the 9th cusp carries profound promise — fortune is not absent but access is blocked by dogma, over-expansion of belief, or misuse of knowledge. Genuine humility before the infinite opens what pride has temporarily closed.',
    },
    5: {
      strong: 'Venus governs your 9th cusp — fortune flows through beauty, the arts, and the grace of relationship. Study in aesthetics, law, or diplomacy brings recognition. Foreign cultures and artistic traditions are sources of spiritual enrichment and material fortune. Love itself is a dharmic path for you.',
      weak: 'Venus denied at the 9th cusp creates fortune lost to indulgence or over-attachment to pleasures that derail spiritual development. The path of beauty must be walked with discernment — grace rather than excess — for Venus\'s considerable fortune to materialise.',
    },
    6: {
      strong: 'Saturn governs your 9th cusp — fortune is built slowly through disciplined dharmic action and service to those who suffer. Legal work and service-based institutions carry karmic rewards. Your spiritual path is one of structured practice. Fortune arrives reliably in the second half of life.',
      weak: 'Saturn at the 9th cusp creates a heavy, burdensome relationship with dharma and fortune. Spiritual practice feels laborious; gurus bring more challenge than liberation. Consistent, humble adherence to dharmic duty — even when luck seems absent — is the only path through Saturn\'s intentional obstruction.',
    },
    7: {
      strong: 'Rahu governs your 9th cusp — fortune through unconventional spiritual paths, foreign pilgrimages, or cutting-edge philosophical systems. You attract unusual gurus and exotic blessings. Rahu\'s ambition applied to dharma creates a unique and powerful spiritual biography. Foreign lands are specifically lucky for you.',
      weak: 'Rahu disrupting the 9th cusp creates false gurus, spiritual illusions, or fortune lost to unconventional belief systems. Authentic spiritual seeking — rather than exotic or trendy alternatives — is Rahu\'s corrective. Discernment is the single most important spiritual faculty here.',
    },
    8: {
      strong: 'Ketu governs your 9th cusp — fortune through mystical knowledge, past-life wisdom, and the deep inner spiritual life. You are naturally drawn to esoteric traditions. Pilgrimage, renunciation, and the pursuit of liberation carry extraordinary karmic rewards. True fortune for you is freedom from the cycle itself.',
      weak: 'Ketu at the 9th cusp creates detachment from conventional dharma — a disinterest in organised religion or outer spiritual forms. The universe\'s blessings arrive through the internal rather than external. Surrendering to the deeper spiritual current without needing tradition\'s validation resolves this placement.',
    },
  },
};

// Life area configuration
const LIFE_AREAS_CONFIG = [
  {
    key: 'marriage', keyCusp: 7,
    title: { en: 'Marriage & Partnership', hi: 'विवाह और साझेदारी', sa: 'विवाहः' },
    axis: { en: 'H2 · H7 · H11', hi: 'भाव 2, 7, 11', sa: 'भावाः 2, 7, 11' },
    border: 'border-rose-500/25', bg: 'bg-rose-500/5', label: 'bg-rose-500/15 text-rose-300', hue: 'text-rose-300',
  },
  {
    key: 'career', keyCusp: 10,
    title: { en: 'Career & Status', hi: 'करियर और प्रतिष्ठा', sa: 'व्यवसायः' },
    axis: { en: 'H2 · H6 · H10 · H11', hi: 'भाव 2, 6, 10, 11', sa: 'भावाः 2, 6, 10, 11' },
    border: 'border-blue-500/25', bg: 'bg-blue-500/5', label: 'bg-blue-500/15 text-blue-300', hue: 'text-blue-300',
  },
  {
    key: 'wealth', keyCusp: 2,
    title: { en: 'Wealth & Prosperity', hi: 'धन और समृद्धि', sa: 'धनम्' },
    axis: { en: 'H2 · H6 · H11', hi: 'भाव 2, 6, 11', sa: 'भावाः 2, 6, 11' },
    border: 'border-amber-500/25', bg: 'bg-amber-500/5', label: 'bg-amber-500/15 text-amber-300', hue: 'text-amber-300',
  },
  {
    key: 'health', keyCusp: 1,
    title: { en: 'Health & Vitality', hi: 'स्वास्थ्य और जीवनशक्ति', sa: 'स्वास्थ्यम्' },
    axis: { en: 'H1 · H5 · H11', hi: 'भाव 1, 5, 11', sa: 'भावाः 1, 5, 11' },
    border: 'border-emerald-500/25', bg: 'bg-emerald-500/5', label: 'bg-emerald-500/15 text-emerald-300', hue: 'text-emerald-300',
  },
  {
    key: 'property', keyCusp: 4,
    title: { en: 'Property & Home', hi: 'संपत्ति और घर', sa: 'गृहम्' },
    axis: { en: 'H4 · H11', hi: 'भाव 4, 11', sa: 'भावाः 4, 11' },
    border: 'border-cyan-500/25', bg: 'bg-cyan-500/5', label: 'bg-cyan-500/15 text-cyan-300', hue: 'text-cyan-300',
  },
  {
    key: 'fortune', keyCusp: 9,
    title: { en: 'Fortune & Wisdom', hi: 'भाग्य और ज्ञान', sa: 'भाग्यम्' },
    axis: { en: 'H3 · H9 · H12', hi: 'भाव 3, 9, 12', sa: 'भावाः 3, 9, 12' },
    border: 'border-violet-500/25', bg: 'bg-violet-500/5', label: 'bg-violet-500/15 text-violet-300', hue: 'text-violet-300',
  },
];

// Ruling planet oracle text
const RULING_PLANET_ORACLE: Record<number, { role: string; oracle: string }> = {
  0: { role: 'Power & Authority', oracle: 'Solar energy governs this moment. Acts connected to authority, government, or public life carry maximum cosmic force. Stand tall; the Sun rewards those who act from a place of genuine dignity.' },
  1: { role: 'Emotion & Intuition', oracle: 'Lunar energy holds this moment. Decisions made from the heart, especially around family and domestic matters, are especially favoured. Let feeling guide intellect, not the reverse.' },
  2: { role: 'Energy & Action', oracle: 'Mars charges this moment. Courageous action and technical execution are cosmically supported. This is a time to move decisively on plans already formed. Conflicts, however, should be consciously avoided.' },
  3: { role: 'Intellect & Commerce', oracle: 'Mercury quickens this moment. Communications, contracts, and commerce initiated now carry Mercury\'s precision and adaptability. The written word and spoken idea have unusual force here.' },
  4: { role: 'Wisdom & Expansion', oracle: 'Jupiter blesses this moment with divine grace. Undertakings begun now carry dharmic protection. Spiritual practices, acts of genuine generosity, and decisions rooted in wisdom yield extraordinary results.' },
  5: { role: 'Love & Beauty', oracle: 'Venus graces this moment. Matters of love, art, finance, and beauty are under divine favour. Elegance in action brings the best results; harshness closes doors that charm would open.' },
  6: { role: 'Discipline & Karma', oracle: 'Saturn presides over this moment with karmic authority. Patience and structured action are required. Shortcuts will fail. What is begun now endures — build it carefully, for it will last exactly as well as it is built.' },
  7: { role: 'Ambition & Innovation', oracle: 'Rahu charges this moment with intense, unconventional ambition. Innovative, foreign, and technologically-oriented approaches succeed where traditional ones stall. Guard carefully against illusion and deception from all directions.' },
  8: { role: 'Liberation & Insight', oracle: 'Ketu purifies this moment of worldly noise. Spiritual practice, deep research, and conscious detachment from outcomes bring the most enduring rewards now. What the ego grasps for, Ketu dissolves; what the soul is ready for, Ketu delivers.' },
};

const T = {
  en: {
    title: 'KP System', subtitle: 'Krishnamurti Paddhati — Sub-Lord Analysis',
    desc: 'Placidus house system with the 249 sub-lord table. Each degree has a Sign Lord, Star Lord, and Sub Lord for precise event prediction.',
    generate: 'Generate KP Chart', generating: 'Computing Sub-Lords...',
    name: 'Name', date: 'Birth Date', time: 'Birth Time', place: 'Place', lat: 'Latitude', lng: 'Longitude', tz: 'Timezone',
    cuspalTable: 'Cuspal Sub-Lord Table', planetTable: 'Planetary Sub-Lord Table',
    cuspalAnalysis: 'House-by-House Signification',
    significators: 'Significator Table', rulingPlanets: 'Ruling Planets',
    cusp: 'Cusp', sign: 'Sign Lord', star: 'Star Lord', sub: 'Sub Lord', subsub: 'Sub-Sub Lord', degree: 'Degree',
    planet: 'Planet', house: 'House', h: 'House', l1: 'L1', l2: 'L2', l3: 'L3', l4: 'L4', combined: 'Combined',
    asc: 'Asc', moon: 'Moon', day: 'Day',
    signifies: 'Signifies', materialises: 'Promised', denied: 'Denied',
    lifeMandate: 'Life Mandate', lifeMandateDesc: 'KP\'s verdict on the six domains of your life — what is written, what is withheld.',
    sublord: 'Sub-lord', signifiedHouses: 'Signifies houses',
    oracle: 'Ruling Planet Oracle', oracleDesc: 'The five planets governing this moment — your current cosmic operating system.',
    referenceData: 'Reference Data',
  },
  hi: {
    title: 'केपी पद्धति', subtitle: 'कृष्णमूर्ति पद्धति — उप-स्वामी विश्लेषण',
    desc: 'प्लेसिडस भाव पद्धति और 249 उप-स्वामी तालिका। प्रत्येक अंश का राशि स्वामी, नक्षत्र स्वामी और उप-स्वामी।',
    generate: 'केपी कुण्डली बनाएं', generating: 'उप-स्वामी गणना...',
    name: 'नाम', date: 'जन्म तिथि', time: 'जन्म समय', place: 'स्थान', lat: 'अक्षांश', lng: 'देशान्तर', tz: 'समयक्षेत्र',
    cuspalTable: 'कस्प उप-स्वामी तालिका', planetTable: 'ग्रह उप-स्वामी तालिका',
    cuspalAnalysis: 'भाव-दर-भाव सूचन विश्लेषण',
    significators: 'कारक तालिका', rulingPlanets: 'शासक ग्रह',
    cusp: 'कस्प', sign: 'राशि स्वामी', star: 'नक्षत्र स्वामी', sub: 'उप-स्वामी', subsub: 'उप-उप-स्वामी', degree: 'अंश',
    planet: 'ग्रह', house: 'भाव', h: 'भाव', l1: 'स्तर1', l2: 'स्तर2', l3: 'स्तर3', l4: 'स्तर4', combined: 'संयुक्त',
    asc: 'लग्न', moon: 'चन्द्र', day: 'वार',
    signifies: 'सूचित भाव', materialises: 'फलदायी', denied: 'अभाव',
    lifeMandate: 'जीवन आदेश', lifeMandateDesc: 'आपके जीवन के छह क्षेत्रों पर केपी का निर्णय।',
    sublord: 'उप-स्वामी', signifiedHouses: 'सूचित भाव',
    oracle: 'शासक ग्रह ओरेकल', oracleDesc: 'इस क्षण के पाँच शासक ग्रह — आपका वर्तमान ब्रह्मांडीय संचालन तंत्र।',
    referenceData: 'संदर्भ डेटा',
  },
  sa: {
    title: 'केपी पद्धतिः', subtitle: 'कृष्णमूर्तिपद्धतिः — उपस्वामिविश्लेषणम्',
    desc: 'प्लेसिडसभावपद्धतिः 249 उपस्वामिसारणी च।',
    generate: 'केपी कुण्डलीं रचयतु', generating: 'उपस्वामिगणना...',
    name: 'नाम', date: 'जन्मतिथिः', time: 'जन्मसमयः', place: 'स्थानम्', lat: 'अक्षांशः', lng: 'देशान्तरः', tz: 'समयक्षेत्रम्',
    cuspalTable: 'कस्पोपस्वामिसारणी', planetTable: 'ग्रहोपस्वामिसारणी',
    cuspalAnalysis: 'भावशःसूचनविश्लेषणम्',
    significators: 'कारकसारणी', rulingPlanets: 'शासकग्रहाः',
    cusp: 'कस्पः', sign: 'राशिस्वामी', star: 'नक्षत्रस्वामी', sub: 'उपस्वामी', subsub: 'उपउपस्वामी', degree: 'अंशः',
    planet: 'ग्रहः', house: 'भावः', h: 'भावः', l1: 'स्तर1', l2: 'स्तर2', l3: 'स्तर3', l4: 'स्तर4', combined: 'संयुक्तम्',
    asc: 'लग्नम्', moon: 'चन्द्रः', day: 'वारः',
    signifies: 'सूचितभावाः', materialises: 'फलितम्', denied: 'अभावः',
    lifeMandate: 'जीवनादेशः', lifeMandateDesc: 'षट्क्षेत्रेषु केपीनिर्णयः।',
    sublord: 'उपस्वामी', signifiedHouses: 'सूचितभावाः',
    oracle: 'शासकग्रहओरेकल', oracleDesc: 'अस्य क्षणस्य पञ्च शासकग्रहाः।',
    referenceData: 'संदर्भडेटा',
  },
  ta: {
    title: 'கே.பி. முறை', subtitle: 'கிருஷ்ணமூர்த்தி பத்ததி — உப அதிபதி பகுப்பாய்வு',
    desc: '249 உப அதிபதி அட்டவணையுடன் கூடிய பிளாசிடஸ் பாவ முறை. ஒவ்வொரு பாகையிலும் ராசி அதிபதி, நட்சத்திர அதிபதி மற்றும் உப அதிபதி.',
    generate: 'கே.பி. குண்டலி உருவாக்கு', generating: 'உப அதிபதிகளை கணக்கிடுகிறது...',
    name: 'பெயர்', date: 'பிறந்த தேதி', time: 'பிறந்த நேரம்', place: 'இடம்', lat: 'அட்சரேகை', lng: 'தீர்க்கரேகை', tz: 'நேர வலயம்',
    cuspalTable: 'கஸ்ப உப அதிபதி அட்டவணை', planetTable: 'கிரக உப அதிபதி அட்டவணை',
    cuspalAnalysis: 'பாவம் வாரியான குறிப்பீட்டு பகுப்பாய்வு',
    significators: 'குறிப்பீட்டாளர் அட்டவணை', rulingPlanets: 'ஆளும் கிரகங்கள்',
    cusp: 'கஸ்ப', sign: 'ராசி அதிபதி', star: 'நட்சத்திர அதிபதி', sub: 'உப அதிபதி', subsub: 'உப-உப அதிபதி', degree: 'பாகை',
    planet: 'கிரகம்', house: 'பாவம்', h: 'பாவம்', l1: 'L1', l2: 'L2', l3: 'L3', l4: 'L4', combined: 'ஒருங்கிணைந்த',
    asc: 'லக்னம்', moon: 'சந்திரன்', day: 'நாள்',
    signifies: 'குறிப்பிடுகிறது', materialises: 'நிறைவேறும்', denied: 'மறுக்கப்பட்டது',
    lifeMandate: 'வாழ்க்கை ஆணை', lifeMandateDesc: 'உங்கள் வாழ்வின் ஆறு துறைகளில் கே.பி. தீர்ப்பு.',
    sublord: 'உப அதிபதி', signifiedHouses: 'குறிப்பிடும் பாவங்கள்',
    oracle: 'ஆளும் கிரக ஆரூடம்', oracleDesc: 'இந்த தருணத்தை ஆளும் ஐந்து கிரகங்கள்.',
    referenceData: 'குறிப்பு தரவு',
  },
  te: {
    title: 'కేపీ పద్ధతి', subtitle: 'కృష్ణమూర్తి పద్ధతి — ఉప అధిపతి విశ్లేషణ',
    desc: '249 ఉప అధిపతి పట్టికతో ప్లాసిడస్ భావ పద్ధతి. ప్రతి డిగ్రీకి రాశి అధిపతి, నక్షత్ర అధిపతి మరియు ఉప అధిపతి.',
    generate: 'కేపీ కుండలి రూపొందించు', generating: 'ఉప అధిపతులు గణించబడుతోంది...',
    name: 'పేరు', date: 'పుట్టిన తేదీ', time: 'పుట్టిన సమయం', place: 'ప్రదేశం', lat: 'అక్షాంశం', lng: 'రేఖాంశం', tz: 'సమయమండలం',
    cuspalTable: 'కస్ప్ ఉప అధిపతి పట్టిక', planetTable: 'గ్రహ ఉప అధిపతి పట్టిక',
    cuspalAnalysis: 'భావం వారీగా సూచన విశ్లేషణ',
    significators: 'కారక పట్టిక', rulingPlanets: 'పాలక గ్రహాలు',
    cusp: 'కస్ప్', sign: 'రాశి అధిపతి', star: 'నక్షత్ర అధిపతి', sub: 'ఉప అధిపతి', subsub: 'ఉప-ఉప అధిపతి', degree: 'డిగ్రీ',
    planet: 'గ్రహం', house: 'భావం', h: 'భావం', l1: 'L1', l2: 'L2', l3: 'L3', l4: 'L4', combined: 'సంయుక్త',
    asc: 'లగ్నం', moon: 'చంద్రుడు', day: 'వారం',
    signifies: 'సూచిస్తుంది', materialises: 'ఫలితం', denied: 'నిరాకరణ',
    lifeMandate: 'జీవిత ఆదేశం', lifeMandateDesc: 'మీ జీవితంలోని ఆరు రంగాలపై కేపీ తీర్పు.',
    sublord: 'ఉప అధిపతి', signifiedHouses: 'సూచిత భావాలు',
    oracle: 'పాలక గ్రహ ఆరూఢం', oracleDesc: 'ఈ క్షణాన్ని పాలించే ఐదు గ్రహాలు.',
    referenceData: 'సందర్భ డేటా',
  },
  bn: {
    title: 'কেপি পদ্ধতি', subtitle: 'কৃষ্ণমূর্তি পদ্ধতি — উপ-অধিপতি বিশ্লেষণ',
    desc: '249 উপ-অধিপতি সারণী সহ প্লাসিডাস ভাব পদ্ধতি। প্রতিটি ডিগ্রির রাশি অধিপতি, নক্ষত্র অধিপতি ও উপ-অধিপতি।',
    generate: 'কেপি কুণ্ডলী তৈরি করুন', generating: 'উপ-অধিপতি গণনা হচ্ছে...',
    name: 'নাম', date: 'জন্ম তারিখ', time: 'জন্ম সময়', place: 'স্থান', lat: 'অক্ষাংশ', lng: 'দ্রাঘিমাংশ', tz: 'সময় অঞ্চল',
    cuspalTable: 'কাস্প উপ-অধিপতি সারণী', planetTable: 'গ্রহ উপ-অধিপতি সারণী',
    cuspalAnalysis: 'ভাব অনুসারে সূচক বিশ্লেষণ',
    significators: 'কারক সারণী', rulingPlanets: 'শাসক গ্রহ',
    cusp: 'কাস্প', sign: 'রাশি অধিপতি', star: 'নক্ষত্র অধিপতি', sub: 'উপ-অধিপতি', subsub: 'উপ-উপ-অধিপতি', degree: 'ডিগ্রি',
    planet: 'গ্রহ', house: 'ভাব', h: 'ভাব', l1: 'L1', l2: 'L2', l3: 'L3', l4: 'L4', combined: 'সংযুক্ত',
    asc: 'লগ্ন', moon: 'চন্দ্র', day: 'বার',
    signifies: 'সূচিত ভাব', materialises: 'ফলদায়ী', denied: 'অভাব',
    lifeMandate: 'জীবন আদেশ', lifeMandateDesc: 'আপনার জীবনের ছয়টি ক্ষেত্রে কেপি রায়।',
    sublord: 'উপ-অধিপতি', signifiedHouses: 'সূচিত ভাব',
    oracle: 'শাসক গ্রহ ওরাকল', oracleDesc: 'এই মুহূর্তের পাঁচ শাসক গ্রহ।',
    referenceData: 'রেফারেন্স ডেটা',
  },
  kn: {
    title: 'ಕೆಪಿ ಪದ್ಧತಿ', subtitle: 'ಕೃಷ್ಣಮೂರ್ತಿ ಪದ್ಧತಿ — ಉಪ ಅಧಿಪತಿ ವಿಶ್ಲೇಷಣೆ',
    desc: '249 ಉಪ ಅಧಿಪತಿ ಕೋಷ್ಟಕದೊಂದಿಗೆ ಪ್ಲಾಸಿಡಸ್ ಭಾವ ಪದ್ಧತಿ. ಪ್ರತಿ ಡಿಗ್ರಿಗೆ ರಾಶಿ ಅಧಿಪತಿ, ನಕ್ಷತ್ರ ಅಧಿಪತಿ ಮತ್ತು ಉಪ ಅಧಿಪತಿ.',
    generate: 'ಕೆಪಿ ಜಾತಕ ರಚಿಸಿ', generating: 'ಉಪ ಅಧಿಪತಿಗಳನ್ನು ಲೆಕ್ಕ ಹಾಕುತ್ತಿದೆ...',
    name: 'ಹೆಸರು', date: 'ಹುಟ್ಟಿದ ದಿನಾಂಕ', time: 'ಹುಟ್ಟಿದ ಸಮಯ', place: 'ಸ್ಥಳ', lat: 'ಅಕ್ಷಾಂಶ', lng: 'ರೇಖಾಂಶ', tz: 'ಸಮಯ ವಲಯ',
    cuspalTable: 'ಕಸ್ಪ ಉಪ ಅಧಿಪತಿ ಕೋಷ್ಟಕ', planetTable: 'ಗ್ರಹ ಉಪ ಅಧಿಪತಿ ಕೋಷ್ಟಕ',
    cuspalAnalysis: 'ಭಾವವಾರು ಸೂಚಕ ವಿಶ್ಲೇಷಣೆ',
    significators: 'ಕಾರಕ ಕೋಷ್ಟಕ', rulingPlanets: 'ಆಳುವ ಗ್ರಹಗಳು',
    cusp: 'ಕಸ್ಪ', sign: 'ರಾಶಿ ಅಧಿಪತಿ', star: 'ನಕ್ಷತ್ರ ಅಧಿಪತಿ', sub: 'ಉಪ ಅಧಿಪತಿ', subsub: 'ಉಪ-ಉಪ ಅಧಿಪತಿ', degree: 'ಡಿಗ್ರಿ',
    planet: 'ಗ್ರಹ', house: 'ಭಾವ', h: 'ಭಾವ', l1: 'L1', l2: 'L2', l3: 'L3', l4: 'L4', combined: 'ಸಂಯುಕ್ತ',
    asc: 'ಲಗ್ನ', moon: 'ಚಂದ್ರ', day: 'ವಾರ',
    signifies: 'ಸೂಚಿಸುತ್ತದೆ', materialises: 'ಫಲಿತ', denied: 'ನಿರಾಕರಣೆ',
    lifeMandate: 'ಜೀವನ ಆದೇಶ', lifeMandateDesc: 'ನಿಮ್ಮ ಜೀವನದ ಆರು ಕ್ಷೇತ್ರಗಳಲ್ಲಿ ಕೆಪಿ ತೀರ್ಪು.',
    sublord: 'ಉಪ ಅಧಿಪತಿ', signifiedHouses: 'ಸೂಚಿತ ಭಾವಗಳು',
    oracle: 'ಆಳುವ ಗ್ರಹ ಆರೂಢ', oracleDesc: 'ಈ ಕ್ಷಣವನ್ನು ಆಳುವ ಐದು ಗ್ರಹಗಳು.',
    referenceData: 'ಸಂದರ್ಭ ಡೇಟಾ',
  },
  gu: {
    title: 'કેપી પદ્ધતિ', subtitle: 'કૃષ્ણમૂર્તિ પદ્ધતિ — ઉપ અધિપતિ વિશ્લેષણ',
    desc: '249 ઉપ અધિપતિ કોષ્ટક સાથે પ્લેસિડસ ભાવ પદ્ધતિ. દરેક ડિગ્રીના રાશિ અધિપતિ, નક્ષત્ર અધિપતિ અને ઉપ અધિપતિ.',
    generate: 'કેપી કુંડળી બનાવો', generating: 'ઉપ અધિપતિ ગણતરી...',
    name: 'નામ', date: 'જન્મ તારીખ', time: 'જન્મ સમય', place: 'સ્થળ', lat: 'અક્ષાંશ', lng: 'રેખાંશ', tz: 'સમય ક્ષેત્ર',
    cuspalTable: 'કસ્પ ઉપ અધિપતિ કોષ્ટક', planetTable: 'ગ્રહ ઉપ અધિપતિ કોષ્ટક',
    cuspalAnalysis: 'ભાવ પ્રમાણે સૂચક વિશ્લેષણ',
    significators: 'કારક કોષ્ટક', rulingPlanets: 'શાસક ગ્રહો',
    cusp: 'કસ્પ', sign: 'રાશિ અધિપતિ', star: 'નક્ષત્ર અધિપતિ', sub: 'ઉપ અધિપતિ', subsub: 'ઉપ-ઉપ અધિપતિ', degree: 'ડિગ્રી',
    planet: 'ગ્રહ', house: 'ભાવ', h: 'ભાવ', l1: 'L1', l2: 'L2', l3: 'L3', l4: 'L4', combined: 'સંયુક્ત',
    asc: 'લગ્ન', moon: 'ચંદ્ર', day: 'વાર',
    signifies: 'સૂચિત ભાવ', materialises: 'ફળદાયી', denied: 'અભાવ',
    lifeMandate: 'જીવન આદેશ', lifeMandateDesc: 'તમારા જીવનના છ ક્ષેત્રો પર કેપી ચુકાદો.',
    sublord: 'ઉપ અધિપતિ', signifiedHouses: 'સૂચિત ભાવો',
    oracle: 'શાસક ગ્રહ ઓરેકલ', oracleDesc: 'આ ક્ષણના પાંચ શાસક ગ્રહો.',
    referenceData: 'સંદર્ભ ડેટા',
  },
  mr: {
    title: 'केपी पद्धती', subtitle: 'कृष्णमूर्ती पद्धती — उप-स्वामी विश्लेषण',
    desc: '249 उप-स्वामी तक्त्यासह प्लेसिडस भाव पद्धती. प्रत्येक अंशाचा राशी स्वामी, नक्षत्र स्वामी आणि उप-स्वामी.',
    generate: 'केपी कुंडली बनवा', generating: 'उप-स्वामी गणना...',
    name: 'नाव', date: 'जन्मतिथी', time: 'जन्म वेळ', place: 'स्थान', lat: 'अक्षांश', lng: 'रेखांश', tz: 'वेळक्षेत्र',
    cuspalTable: 'कस्प उप-स्वामी तक्ता', planetTable: 'ग्रह उप-स्वामी तक्ता',
    cuspalAnalysis: 'भावनिहाय सूचन विश्लेषण',
    significators: 'कारक तक्ता', rulingPlanets: 'शासक ग्रह',
    cusp: 'कस्प', sign: 'राशी स्वामी', star: 'नक्षत्र स्वामी', sub: 'उप-स्वामी', subsub: 'उप-उप-स्वामी', degree: 'अंश',
    planet: 'ग्रह', house: 'भाव', h: 'भाव', l1: 'स्तर1', l2: 'स्तर2', l3: 'स्तर3', l4: 'स्तर4', combined: 'संयुक्त',
    asc: 'लग्न', moon: 'चंद्र', day: 'वार',
    signifies: 'सूचित भाव', materialises: 'फलदायी', denied: 'अभाव',
    lifeMandate: 'जीवन आदेश', lifeMandateDesc: 'तुमच्या जीवनाच्या सहा क्षेत्रांवरील केपी निकाल.',
    sublord: 'उप-स्वामी', signifiedHouses: 'सूचित भाव',
    oracle: 'शासक ग्रह ओरेकल', oracleDesc: 'या क्षणाचे पाच शासक ग्रह.',
    referenceData: 'संदर्भ डेटा',
  },
  mai: {
    title: 'केपी पद्धति', subtitle: 'कृष्णमूर्ति पद्धति — उप-स्वामी विश्लेषण',
    desc: '249 उप-स्वामी तालिकाक संग प्लेसिडस भाव पद्धति। प्रत्येक अंशक राशि स्वामी, नक्षत्र स्वामी आ उप-स्वामी।',
    generate: 'केपी कुण्डली बनाउ', generating: 'उप-स्वामी गणना...',
    name: 'नाम', date: 'जन्म तिथि', time: 'जन्म समय', place: 'स्थान', lat: 'अक्षांश', lng: 'देशान्तर', tz: 'समय क्षेत्र',
    cuspalTable: 'कस्प उप-स्वामी तालिका', planetTable: 'ग्रह उप-स्वामी तालिका',
    cuspalAnalysis: 'भाव-दर-भाव सूचन विश्लेषण',
    significators: 'कारक तालिका', rulingPlanets: 'शासक ग्रह',
    cusp: 'कस्प', sign: 'राशि स्वामी', star: 'नक्षत्र स्वामी', sub: 'उप-स्वामी', subsub: 'उप-उप-स्वामी', degree: 'अंश',
    planet: 'ग्रह', house: 'भाव', h: 'भाव', l1: 'स्तर1', l2: 'स्तर2', l3: 'स्तर3', l4: 'स्तर4', combined: 'संयुक्त',
    asc: 'लग्न', moon: 'चन्द्र', day: 'वार',
    signifies: 'सूचित भाव', materialises: 'फलदायी', denied: 'अभाव',
    lifeMandate: 'जीवन आदेश', lifeMandateDesc: 'अहाँक जीवनक छह क्षेत्रमे केपी निर्णय।',
    sublord: 'उप-स्वामी', signifiedHouses: 'सूचित भाव',
    oracle: 'शासक ग्रह ओरेकल', oracleDesc: 'एहि क्षणक पाँच शासक ग्रह।',
    referenceData: 'संदर्भ डेटा',
  },
};

export default function KPSystemPage() {
  const locale = useLocale() as Locale;
  const isTamil = String(locale) === 'ta';
  const t = (T as Record<string, typeof T.en>)[locale] || T.en;
  const isDevanagari = isDevanagariLocale(locale);
  const headingFont = isDevanagari ? { fontFamily: 'var(--font-devanagari-heading)' } : { fontFamily: 'var(--font-heading)' };
  const bodyFont = isDevanagari ? { fontFamily: 'var(--font-devanagari-body)' } : {};

  const [form, setForm] = useState({ name: '', date: '1990-01-15', time: '08:00', ayanamsha: 'lahiri' as const });
  const [placeName, setPlaceName] = useState('');
  const [placeLat, setPlaceLat] = useState<number | null>(null);
  const [placeLng, setPlaceLng] = useState<number | null>(null);
  const [placeTimezone, setPlaceTimezone] = useState<string | null>(null);
  const [data, setData] = useState<KPChartData | null>(null);
  const [loading, setLoading] = useState(false);
  const [showRefData, setShowRefData] = useState(false);
  const [gateError, setGateError] = useState<GateError | null>(null);

  const handleSubmit = async () => {
    if (placeLat === null || placeLng === null) return;
    setLoading(true);
    setGateError(null);

    const [y, m, d] = form.date.split('-').map(Number);
    if (!placeTimezone) return;
    const tz = getUTCOffsetForDate(y, m, d, placeTimezone);
    try {
      const res = await authedFetch('/api/kp-system', {
        method: 'POST',
        body: JSON.stringify({ ...form, place: placeName, lat: placeLat, lng: placeLng, timezone: String(tz) }),
      });
      const gate = await parseGateError(res);
      if (gate) { setGateError(gate); setLoading(false); return; }
      const result = await res.json();
      if (result.error) throw new Error(result.error);
      setData(result);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  const planetName = (id: number) => {
    const g = GRAHAS[id];
    return g ? tl(g.name, locale) : `P${id}`;
  };

  // Compute a life area reading from cuspal analysis + per-planet table
  const getAreaReading = (areaKey: string, keyCusp: number) => {
    if (!data) return null;
    const cusp = data.cusps.find(c => c.house === keyCusp);
    const analysis = data.cuspalAnalysis.find(ca => ca.house === keyCusp);
    if (!cusp || !analysis) return null;
    const subLordId = cusp.subLordInfo.subLord.id;
    const subLordName = tl(cusp.subLordInfo.subLord.name, locale);
    const areaReadings = LIFE_READINGS[areaKey];
    const planetReadings = areaReadings?.[subLordId];
    const reading = planetReadings
      ? (analysis.favorable ? planetReadings.strong : planetReadings.weak)
      : tl(analysis.interpretation, locale);
    return { favorable: analysis.favorable, subLordName, subLordId, reading, signifiedHouses: analysis.signifiedHouses };
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4" style={headingFont}>
          <span className="text-gold-gradient">{t.title}</span>
        </h1>
        <p className="text-text-secondary text-lg max-w-3xl mx-auto" style={bodyFont}>{t.desc}</p>
      </motion.div>

      {/* KP Intro */}
      <InfoBlock
        id="kp-intro"
        title={!isDevanagariLocale(locale) ? 'What is the KP System?' : isDevanagari ? 'केपी पद्धति क्या है?' : 'केपी पद्धतिः किम्?'}
        defaultOpen={false}
      >
        {isDevanagari ? (
          <p>कृष्णमूर्ति पद्धति (KP) वैदिक ज्योतिष का एक आधुनिक परिष्करण है। यह प्रत्येक नक्षत्र को &apos;उप-स्वामी&apos; नामक 9 उपखंडों में विभाजित करता है, जिससे बहुत सटीक भविष्यवाणी संभव होती है। जहां पारंपरिक ज्योतिष कहता है &apos;करियर के लिए शुभ&apos;, वहीं KP बता सकता है &apos;15-22 मार्च के बीच पदोन्नति संभव।&apos; यह वैदिक सिद्धांतों के साथ प्लेसिडस भाव पद्धति का उपयोग करता है।</p>
        ) : (
          <p>Krishnamurti Paddhati (KP) is a modern refinement of Vedic astrology. It divides each nakshatra into 9 sub-divisions called &apos;sub-lords&apos;, giving much more precise predictions. While traditional astrology tells you &apos;good for career&apos;, KP can pinpoint &apos;promotion likely between March 15–22.&apos; It uses the Placidus house system with Vedic principles.</p>
        )}
      </InfoBlock>

      <div className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-2xl p-6 mb-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {(['name', 'date', 'time'] as const).map(f => (
            <label key={f} className="block">
              <span className="text-text-secondary text-xs uppercase tracking-wider" style={bodyFont}>{t[f]}</span>
              <input type={f === 'date' ? 'date' : f === 'time' ? 'time' : 'text'} value={form[f]} onChange={e => setForm({ ...form, [f]: e.target.value })}
                className="w-full mt-1 bg-bg-primary/60 border border-gold-primary/20 rounded-lg px-3 py-2 text-text-primary text-sm focus:border-gold-primary/50 focus:outline-none" />
            </label>
          ))}
          <label className="block">
            <span className="text-text-secondary text-xs uppercase tracking-wider" style={bodyFont}>{t.place}</span>
            <LocationSearch value={placeName} onSelect={(loc) => { setPlaceName(loc.name); setPlaceLat(loc.lat); setPlaceLng(loc.lng); setPlaceTimezone(loc.timezone); }} placeholder={!isDevanagariLocale(locale) ? 'Search birth place...' : 'जन्म स्थान खोजें...'} />
          </label>
        </div>
        <div className="text-center mt-6">
          <motion.button onClick={handleSubmit} disabled={loading} whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
            className="px-10 py-4 bg-gradient-to-r from-gold-primary/20 to-gold-primary/10 border-2 border-gold-primary/40 rounded-2xl text-gold-light text-lg font-bold hover:bg-gold-primary/30 disabled:opacity-50" style={headingFont}>
            {loading ? t.generating : t.generate}
          </motion.button>
        </div>
      </div>

      {gateError && (
        <div className="mt-8">
          <UsageLimitBanner
            type={gateError.type}
            feature={gateError.feature}
            featureName={gateError.featureName}
            requiredTier={gateError.requiredTier}
            limit={gateError.limit}
            message={gateError.message}
            source="kp-system"
          />
        </div>
      )}

      <AnimatePresence>
        {data && (
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="space-y-10">
            <GoldDivider />

            {/* Chart */}
            <div className="flex justify-center">
              <ChartNorth data={data.chart} title={t.title} size={460} />
            </div>

            {/* ── LIFE MANDATE ─────────────────────────────────────────────── */}
            <div>
              <div className="mb-6">
                <h2 className="text-2xl sm:text-3xl font-bold text-gold-light mb-2" style={headingFont}>{t.lifeMandate}</h2>
                <p className="text-text-secondary text-sm" style={bodyFont}>{t.lifeMandateDesc}</p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {LIFE_AREAS_CONFIG.map(area => {
                  const r = getAreaReading(area.key, area.keyCusp);
                  if (!r) return null;
                  return (
                    <motion.div
                      key={area.key}
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`rounded-2xl p-5 border ${area.border} ${area.bg} flex flex-col gap-3`}
                    >
                      {/* Header */}
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <h3 className={`font-bold text-base ${area.hue}`} style={headingFont}>{tl(area.title, locale)}</h3>
                          <p className="text-text-secondary text-xs mt-0.5">{tl(area.axis, locale)}</p>
                        </div>
                        <span className={`shrink-0 text-xs font-bold px-2.5 py-1 rounded-full ${r.favorable ? 'bg-emerald-500/15 text-emerald-300' : 'bg-red-500/15 text-red-300'}`}>
                          {r.favorable ? (!isDevanagariLocale(locale) ? 'PROMISED' : isDevanagari ? 'फलदायी' : 'फलितम्') : (!isDevanagariLocale(locale) ? 'WITHHELD' : isDevanagari ? 'अभाव' : 'अभावः')}
                        </span>
                      </div>

                      {/* Sub-lord + what it signifies */}
                      <div className="flex items-center gap-3 bg-black/20 rounded-xl px-3 py-2">
                        <GrahaIconById id={r.subLordId} size={28} />
                        <div className="min-w-0">
                          <p className="text-text-primary text-sm font-semibold" style={bodyFont}>{r.subLordName}</p>
                          <p className="text-text-secondary text-xs">{t.sublord} H{area.keyCusp} · {t.signifies}: <span className="text-gold-primary">{r.signifiedHouses.length > 0 ? r.signifiedHouses.join(', ') : '—'}</span></p>
                        </div>
                      </div>

                      {/* The prophecy */}
                      <p className="text-text-primary text-sm leading-relaxed flex-1" style={bodyFont}>{r.reading}</p>
                    </motion.div>
                  );
                })}
              </div>
            </div>

            {/* ── RULING PLANET ORACLE ─────────────────────────────────────── */}
            <div className="bg-gradient-to-br from-[#1a1040]/70 to-[#0a0e27] border border-gold-primary/20 rounded-2xl p-6">
              <div className="mb-5">
                <h2 className="text-xl font-bold text-gold-light mb-1" style={headingFont}>{t.oracle}</h2>
                <p className="text-text-secondary text-sm" style={bodyFont}>{t.oracleDesc}</p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-5 gap-3 mb-6">
                {[
                  { label: !isDevanagariLocale(locale) ? 'Asc Sign Lord' : isDevanagari ? 'लग्न राशि स्वामी' : 'लग्नराशिस्वामी', planet: data.rulingPlanets.ascSignLord },
                  { label: !isDevanagariLocale(locale) ? 'Asc Star Lord' : isDevanagari ? 'लग्न नक्षत्र स्वामी' : 'लग्ननक्षत्रस्वामी', planet: data.rulingPlanets.ascStarLord },
                  { label: !isDevanagariLocale(locale) ? 'Moon Sign Lord' : isDevanagari ? 'चन्द्र राशि स्वामी' : 'चन्द्रराशिस्वामी', planet: data.rulingPlanets.moonSignLord },
                  { label: !isDevanagariLocale(locale) ? 'Moon Star Lord' : isDevanagari ? 'चन्द्र नक्षत्र स्वामी' : 'चन्द्रनक्षत्रस्वामी', planet: data.rulingPlanets.moonStarLord },
                  { label: !isDevanagariLocale(locale) ? 'Day Lord' : isDevanagari ? 'वार स्वामी' : 'वारस्वामी', planet: data.rulingPlanets.dayLord },
                ].map((rp, i) => {
                  const oracle = RULING_PLANET_ORACLE[rp.planet.id];
                  return (
                    <div key={i} className="rounded-xl p-3 bg-gold-primary/5 border border-gold-primary/15 text-center">
                      <GrahaIconById id={rp.planet.id} size={30} />
                      <p className="text-gold-light font-bold text-sm mt-2" style={bodyFont}>{tl(rp.planet.name, locale)}</p>
                      <p className="text-text-secondary text-xs mt-0.5">{rp.label}</p>
                      {oracle && (
                        <p className="text-text-secondary/70 text-xs mt-1.5 leading-relaxed">{oracle.role}</p>
                      )}
                    </div>
                  );
                })}
              </div>
              {/* Combined oracle reading */}
              {(() => {
                const allPlanets = [
                  data.rulingPlanets.ascSignLord.id,
                  data.rulingPlanets.ascStarLord.id,
                  data.rulingPlanets.moonSignLord.id,
                  data.rulingPlanets.moonStarLord.id,
                  data.rulingPlanets.dayLord.id,
                ];
                const BENEFICS = new Set([1, 3, 4, 5]);
                const MALEFICS = new Set([2, 6, 7, 8]);
                const beneficCount = allPlanets.filter(id => BENEFICS.has(id)).length;
                const maleficCount = allPlanets.filter(id => MALEFICS.has(id)).length;
                const hasJupiter = allPlanets.includes(4);
                const hasVenus = allPlanets.includes(5);
                const hasSaturnMars = allPlanets.includes(6) && allPlanets.includes(2);

                let summary = '';
                if (locale === 'en') {
                  if (hasJupiter && hasVenus) {
                    summary = 'Jupiter and Venus both rule this moment — a Dhana Yoga of the cosmos. Material and spiritual blessings converge. Auspicious beginnings of all kinds are especially favoured right now.';
                  } else if (hasSaturnMars) {
                    summary = 'Saturn and Mars together rule this moment. Conflict karaka energy is present. This is a time for disciplined, patient action — not impulsive decisions. What is built carefully now will endure.';
                  } else if (beneficCount >= 3) {
                    summary = `${beneficCount} of your 5 ruling planets are natural benefics — this is a highly auspicious moment for beginning any important endeavour. The cosmic currents are running in your favour.`;
                  } else if (maleficCount >= 3) {
                    summary = `${maleficCount} of your 5 ruling planets are natural malefics. This is a period of karmic intensity — actions taken now have heavy, lasting consequences. Proceed with exceptional care and deliberation.`;
                  } else {
                    summary = 'A balanced mix of ruling planets governs this moment — neither overwhelmingly auspicious nor challenging. Your intentions and the care with which you act will determine the outcome more than cosmic timing will.';
                  }
                } else {
                  summary = isDevanagari
                    ? `आपके शासक ग्रहों का संयोजन ${beneficCount >= 3 ? 'अत्यंत शुभ' : maleficCount >= 3 ? 'कर्म की दृष्टि से सतर्क रहने वाला' : 'संतुलित'} है।`
                    : `शासकग्रहसंयोगः ${beneficCount >= 3 ? 'अत्यन्तशुभः' : 'सन्तुलितः'} अस्ति।`;
                }

                return (
                  <div className="rounded-xl bg-gold-primary/5 border border-gold-primary/15 p-4">
                    <p className="text-text-secondary text-xs uppercase tracking-wider mb-2 font-semibold">
                      {!isDevanagariLocale(locale) ? 'Combined Oracle' : isDevanagari ? 'संयुक्त ओरेकल' : 'संयुक्तओरेकल'}
                    </p>
                    <p className="text-text-primary text-sm leading-relaxed" style={bodyFont}>{summary}</p>
                    {locale === 'en' && (
                      <div className="mt-3 space-y-1.5">
                        {[
                          data.rulingPlanets.ascSignLord,
                          data.rulingPlanets.ascStarLord,
                          data.rulingPlanets.moonSignLord,
                          data.rulingPlanets.moonStarLord,
                          data.rulingPlanets.dayLord,
                        ].map((p, i) => {
                          const oracle = RULING_PLANET_ORACLE[p.id];
                          return oracle ? (
                            <p key={i} className="text-xs text-text-secondary leading-relaxed">
                              <span className="text-gold-primary font-medium">{p.name.en}:</span> {oracle.oracle}
                            </p>
                          ) : null;
                        })}
                      </div>
                    )}
                  </div>
                );
              })()}
            </div>

            {/* ── HOUSE-BY-HOUSE SIGNIFICATION ─────────────────────────────── */}
            <div className="bg-gradient-to-br from-[#1a1040]/60 via-[#0a0e27]/80 to-[#0a0e27] border border-amber-500/20 rounded-xl p-6">
              <h2 className="text-amber-400 text-sm uppercase tracking-wider mb-1 font-bold">{t.cuspalAnalysis}</h2>
              <p className="text-text-secondary text-xs mb-4">
                {!isDevanagariLocale(locale) ? 'The sub-lord of each cusp determines whether that house\'s matters will materialise in this lifetime.' : isDevanagari ? 'प्रत्येक कस्प के उप-स्वामी से उस भाव के फल का निर्धारण होता है।' : 'प्रत्येककस्पस्योपस्वामी तद्भावफलं निर्धारयति।'}
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {data.cuspalAnalysis.map(ca => (
                  <div key={ca.house} className={`rounded-lg p-3 border ${ca.favorable ? 'border-emerald-500/20 bg-emerald-500/5' : 'border-red-500/20 bg-red-500/5'}`}>
                    <div className="flex items-start justify-between mb-1">
                      <span className="text-gold-light font-bold text-sm">H{ca.house}</span>
                      <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${ca.favorable ? 'bg-emerald-500/15 text-emerald-400' : 'bg-red-500/15 text-red-400'}`}>
                        {ca.favorable ? t.materialises : t.denied}
                      </span>
                    </div>
                    <div className="text-xs text-text-secondary mb-1" style={bodyFont}>
                      <span className="text-text-primary">{tl(ca.subLordName, locale)}</span> → <span className="text-amber-400/80">{tl(ca.subSubLordName, locale)}</span>
                    </div>
                    <div className="text-xs text-text-secondary">
                      {t.signifies}: <span className="text-gold-primary">{ca.signifiedHouses.length > 0 ? ca.signifiedHouses.join(', ') : '—'}</span>
                    </div>
                    <p className="text-xs text-text-secondary mt-1.5 leading-relaxed">{tl(ca.interpretation, locale)}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* ── REFERENCE DATA (collapsible) ─────────────────────────────── */}
            <div>
              <button
                onClick={() => setShowRefData(v => !v)}
                className="w-full flex items-center justify-between px-5 py-3 rounded-xl border border-gold-primary/15 bg-gold-primary/5 hover:bg-gold-primary/10 transition-colors"
              >
                <span className="text-gold-primary text-sm font-semibold uppercase tracking-wider">{t.referenceData}</span>
                <span className="text-text-secondary text-xs">{showRefData ? (!isDevanagariLocale(locale) ? 'Hide' : 'छुपाएं') : (!isDevanagariLocale(locale) ? 'Show tables' : 'तालिकाएं देखें')}</span>
              </button>

              <AnimatePresence>
                {showRefData && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="overflow-hidden space-y-6 mt-4"
                  >
                    {/* Cuspal Sub-Lord Table */}
                    <div className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-6 overflow-x-auto">
                      <h2 className="text-gold-primary text-sm uppercase tracking-wider mb-4 font-bold">{t.cuspalTable}</h2>
                      <table className="w-full text-sm">
                        <thead><tr className="text-text-secondary border-b border-gold-primary/10">
                          <th className="text-left py-2 px-2">{t.cusp}</th>
                          <th className="text-left py-2 px-2">{t.degree}</th>
                          <th className="text-left py-2 px-2" style={bodyFont}>{t.sign}</th>
                          <th className="text-left py-2 px-2" style={bodyFont}>{t.star}</th>
                          <th className="text-left py-2 px-2" style={bodyFont}>{t.sub}</th>
                          <th className="text-left py-2 px-2 text-amber-400/80" style={bodyFont}>{t.subsub}</th>
                        </tr></thead>
                        <tbody>{data.cusps.map(c => (
                          <tr key={c.house} className="border-b border-gold-primary/5 hover:bg-gold-primary/5">
                            <td className="py-2 px-2 text-gold-light font-bold">{c.house}</td>
                            <td className="py-2 px-2 text-text-secondary font-mono text-xs">{c.degree.toFixed(2)}°</td>
                            <td className="py-2 px-2 text-text-secondary" style={bodyFont}>{tl(c.subLordInfo.signLord.name, locale)}</td>
                            <td className="py-2 px-2 text-text-secondary" style={bodyFont}>{tl(c.subLordInfo.starLord.name, locale)}</td>
                            <td className="py-2 px-2 text-gold-light font-medium" style={bodyFont}>{tl(c.subLordInfo.subLord.name, locale)}</td>
                            <td className="py-2 px-2 text-amber-400/80 text-xs" style={bodyFont}>{tl(c.subLordInfo.subSubLord.name, locale)}</td>
                          </tr>
                        ))}</tbody>
                      </table>
                    </div>

                    {/* Planetary Sub-Lord Table */}
                    <div className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-6 overflow-x-auto">
                      <h2 className="text-gold-primary text-sm uppercase tracking-wider mb-4 font-bold">{t.planetTable}</h2>
                      <table className="w-full text-sm">
                        <thead><tr className="text-text-secondary border-b border-gold-primary/10">
                          <th className="text-left py-2 px-2" style={bodyFont}>{t.planet}</th>
                          <th className="text-left py-2 px-2">{t.degree}</th>
                          <th className="text-left py-2 px-2">{t.house}</th>
                          <th className="text-left py-2 px-2" style={bodyFont}>{t.sign}</th>
                          <th className="text-left py-2 px-2" style={bodyFont}>{t.star}</th>
                          <th className="text-left py-2 px-2" style={bodyFont}>{t.sub}</th>
                          <th className="text-left py-2 px-2 text-amber-400/80" style={bodyFont}>{t.subsub}</th>
                        </tr></thead>
                        <tbody>{data.planets.map(p => (
                          <tr key={p.planet.id} className="border-b border-gold-primary/5 hover:bg-gold-primary/5">
                            <td className="py-2 px-2"><div className="flex items-center gap-2"><GrahaIconById id={p.planet.id} size={20} /><span className="text-gold-light font-medium" style={bodyFont}>{tl(p.planet.name, locale)}</span></div></td>
                            <td className="py-2 px-2 text-text-secondary font-mono text-xs">{p.longitude.toFixed(2)}°</td>
                            <td className="py-2 px-2 text-text-secondary">{p.house}</td>
                            <td className="py-2 px-2 text-text-secondary" style={bodyFont}>{tl(p.subLordInfo.signLord.name, locale)}</td>
                            <td className="py-2 px-2 text-text-secondary" style={bodyFont}>{tl(p.subLordInfo.starLord.name, locale)}</td>
                            <td className="py-2 px-2 text-gold-light font-medium" style={bodyFont}>{tl(p.subLordInfo.subLord.name, locale)}</td>
                            <td className="py-2 px-2 text-amber-400/80 text-xs" style={bodyFont}>{tl(p.subLordInfo.subSubLord.name, locale)}</td>
                          </tr>
                        ))}</tbody>
                      </table>
                    </div>

                    {/* Significator Table */}
                    <div className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-6 overflow-x-auto">
                      <h2 className="text-gold-primary text-sm uppercase tracking-wider mb-4 font-bold">{t.significators}</h2>
                      <table className="w-full text-sm">
                        <thead><tr className="text-text-secondary border-b border-gold-primary/10">
                          <th className="text-left py-2 px-2">{t.h}</th>
                          <th className="text-left py-2 px-2">{t.l1}</th>
                          <th className="text-left py-2 px-2">{t.l2}</th>
                          <th className="text-left py-2 px-2">{t.l3}</th>
                          <th className="text-left py-2 px-2">{t.l4}</th>
                          <th className="text-left py-2 px-2 text-gold-light">{t.combined}</th>
                        </tr></thead>
                        <tbody>{data.significators.map(s => (
                          <tr key={s.house} className="border-b border-gold-primary/5 hover:bg-gold-primary/5">
                            <td className="py-2 px-2 text-gold-light font-bold">{s.house}</td>
                            <td className="py-2 px-2 text-text-secondary text-xs" style={bodyFont}>{s.level1.map(id => planetName(id)).join(', ') || '-'}</td>
                            <td className="py-2 px-2 text-text-secondary text-xs" style={bodyFont}>{s.level2.map(id => planetName(id)).join(', ') || '-'}</td>
                            <td className="py-2 px-2 text-text-secondary text-xs" style={bodyFont}>{s.level3.map(id => planetName(id)).join(', ') || '-'}</td>
                            <td className="py-2 px-2 text-text-secondary text-xs" style={bodyFont}>{s.level4.map(id => planetName(id)).join(', ') || '-'}</td>
                            <td className="py-2 px-2 text-gold-light text-xs font-medium" style={bodyFont}>{s.combined.map(id => planetName(id)).join(', ') || '-'}</td>
                          </tr>
                        ))}</tbody>
                      </table>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
