/**
 * Unified Chart Narrative — the "pandit's opening statement."
 *
 * Weaves the 3-5 most significant chart threads into a single coherent story.
 * This replaces the "here are 10 independent sections" approach with
 * "here is what your chart is SAYING, and here's why."
 *
 * A real pandit doesn't list facts — they tell a story:
 *   "Your Saturn in the 10th makes you a natural leader, but Saturn is debilitated,
 *    so authority comes through struggle. HOWEVER — your Gaja Kesari Yoga from
 *    Jupiter in the 4th CANCELS much of that weakness. Combined with your current
 *    Jupiter Mahadasha AND Jupiter transiting your 10th this year — THIS IS YOUR
 *    WINDOW. The career breakthrough you've been building toward is imminent."
 *
 * That's one story connecting: planet placement + dignity + yoga + dasha + transit.
 * That's what this module builds.
 */

import type { KundaliData, PlanetPosition } from '@/types/kundali';
import type { LifeStageContext } from './life-stage';
import type { TippanniContent } from './tippanni-types';
import { NAKSHATRAS } from '@/lib/constants/nakshatras';
import { NAKSHATRA_DETAILS } from '@/lib/constants/nakshatra-details';

export interface ChartThread {
  /** Theme this thread addresses */
  theme: string;
  /** Importance score (0-10) — determines which threads make the narrative */
  weight: number;
  /** The individual chart factors that form this thread */
  factors: string[];
  /** The synthesized narrative paragraph for this thread */
  narrative: { en: string; hi: string };
  /** Actionable takeaway — 1 sentence */
  action: { en: string; hi: string };
}

export interface UnifiedNarrative {
  /** Opening line — the single most important thing about this chart */
  headline: { en: string; hi: string };
  /** 3-5 woven threads, ordered by importance */
  threads: ChartThread[];
  /** Closing synthesis — ties everything together */
  synthesis: { en: string; hi: string };
  /** Whether the overall reading is positive, mixed, or challenging */
  tone: 'positive' | 'mixed' | 'challenging';
}

/**
 * Build the unified chart narrative from tippanni content + kundali data.
 *
 * Strategy:
 * 1. Identify the strongest chart factors (best yoga, worst dosha, dominant planet,
 *    current dasha lord, most significant transit)
 * 2. Find connections between them (same planet appears in multiple factors,
 *    same house activated by different mechanisms)
 * 3. Weave connected factors into threads
 * 4. Order threads by life-stage relevance
 * 5. Generate narrative paragraphs that reference preceding threads
 */
export function buildChartNarrative(
  kundali: KundaliData,
  tippanni: TippanniContent,
  locale: string,
  stageCtx?: LifeStageContext,
): UnifiedNarrative {
  const isHi = locale === 'hi' || locale === 'ta' || locale === 'bn' || locale === 'te' || locale === 'gu' || locale === 'kn';
  const t = (obj: { en: string; hi: string }) => isHi ? obj.hi : obj.en;

  const threads: ChartThread[] = [];

  // ── Factor 1: Dominant planet (strongest shadbala) ──
  const dominantPlanet = findDominantPlanet(kundali);

  // ── Factor 2: Current dasha lord ──
  const currentDasha = findCurrentDasha(kundali);

  // ── Factor 3: Strongest yoga ──
  const strongestYoga = tippanni.yogas.find(y => y.present && y.strength === 'Strong');

  // ── Factor 4: Active dosha ──
  const activeDosha = tippanni.doshas.find(d => d.present);

  // ── Factor 5: Life area extremes ──
  const { strongest: strongArea, weakest: weakArea } = findLifeAreaExtremes(tippanni);

  // ── Thread 1: Core Identity + Destiny ──
  // Connect ascendant lord + dominant planet + strongest yoga
  if (dominantPlanet) {
    const dp = dominantPlanet;
    const dpName = dp.planet.name.en;
    const dpHouse = dp.house;
    const dpSign = dp.signName?.en || '';
    const yogaConnection = strongestYoga?.name || '';

    const hasYogaLink = yogaConnection && strongestYoga?.description?.toLowerCase().includes(dpName.toLowerCase());

    threads.push({
      theme: 'identity',
      weight: 9,
      factors: [`${dpName} dominant (strongest shadbala)`, `${dpName} in house ${dpHouse}`, yogaConnection ? `${yogaConnection} yoga` : ''].filter(Boolean),
      narrative: {
        en: `${dpName} is the most powerful planet in your chart, placed in the ${ordinal(dpHouse)} house in ${dpSign}. This planet colors everything — your instincts, your decisions, your life path. ${hasYogaLink ? `It also forms ${yogaConnection}, amplifying its influence across multiple life areas.` : strongestYoga ? `Combined with your ${yogaConnection} yoga, your chart carries significant potential for ${strongestYoga.type === 'dhana' ? 'wealth accumulation' : strongestYoga.type === 'raja' ? 'authority and leadership' : 'distinctive achievement'}.` : 'Its strength gives you a natural advantage that unfolds throughout life.'}`,
        hi: `${dp.planet.name.hi} आपकी कुण्डली का सबसे शक्तिशाली ग्रह है, ${dpHouse}वें भाव में ${dp.signName?.hi || ''} में स्थित। यह ग्रह सब कुछ प्रभावित करता है — आपकी प्रवृत्ति, निर्णय, जीवन पथ। ${strongestYoga ? `आपके ${yogaConnection} योग के साथ मिलकर, आपकी कुण्डली में विशिष्ट उपलब्धि की महत्वपूर्ण क्षमता है।` : 'इसकी शक्ति आपको स्वाभाविक लाभ देती है जो जीवन भर प्रकट होता है।'}`,
      },
      action: {
        en: `Strengthen ${dpName} through its remedies — this amplifies your entire chart.`,
        hi: `${dp.planet.name.hi} को उपायों से मजबूत करें — यह आपकी पूरी कुण्डली को शक्तिशाली बनाता है।`,
      },
    });
  }

  // ── Thread 2: Current Life Chapter (Dasha + Transit) ──
  if (currentDasha) {
    const dashaLord = currentDasha.planet;
    const dashaAnalysis = tippanni.dashaInsight.currentMahaAnalysis || '';

    // Collect ALL major transits this year — name them specifically
    const transitEvents = (tippanni.yearPredictions.events || [])
      .filter(e => e.type === 'jupiter_transit' || e.type === 'sade_sati' || e.type === 'rahu_ketu')
      .map(e => e.title)
      .slice(0, 3);
    const transitSummary = transitEvents.length > 0
      ? transitEvents.join(', ')
      : '';

    // Find if dasha lord connects to any yoga or life area
    const dashaYogaLink = tippanni.yogas.find(y =>
      y.present && y.description?.toLowerCase().includes(dashaLord.toLowerCase())
    );

    threads.push({
      theme: 'timing',
      weight: 8.5,
      factors: [`${dashaLord} Mahadasha active`, transitSummary || ''].filter(Boolean),
      narrative: {
        en: `You are currently in ${dashaLord} Mahadasha — this planetary period defines the dominant energy of your life right now. ${dashaYogaLink ? `Crucially, ${dashaLord} is connected to your ${dashaYogaLink.name} yoga, meaning this dasha period ACTIVATES that yoga's promise.` : ''} ${dashaAnalysis ? dashaAnalysis.split('.').slice(0, 2).join('.') + '.' : `${dashaLord}'s placement and dignity shape what unfolds during this period.`}`,
        hi: `आप वर्तमान में ${currentDasha.planetName?.hi || dashaLord} महादशा में हैं — यह ग्रह काल अभी आपके जीवन की प्रमुख ऊर्जा निर्धारित करता है। ${dashaYogaLink ? `महत्वपूर्ण बात — ${currentDasha.planetName?.hi || dashaLord} आपके ${dashaYogaLink.name} योग से जुड़ा है, अर्थात् यह दशा उस योग के वादे को सक्रिय करती है।` : ''} ${dashaLord} की स्थिति और गरिमा इस काल में जो प्रकट होता है उसे आकार देती है।`,
      },
      action: {
        en: `Honor ${dashaLord}'s energy — align your efforts with what this planet governs.`,
        hi: `${currentDasha.planetName?.hi || dashaLord} की ऊर्जा का सम्मान करें — अपने प्रयासों को इस ग्रह के क्षेत्रों से जोड़ें।`,
      },
    });
  }

  // ── Thread 3: Challenge + Growth ──
  if (activeDosha || weakArea) {
    const challengeSource = activeDosha?.name || `${weakArea?.label || 'life area'} challenges`;
    const challengeDetail = activeDosha?.description || weakArea?.summary || '';

    // Find if there's a remedy connection
    const hasRemedy = (tippanni.remedies.gemstones?.length > 0 || tippanni.remedies.mantras?.length > 0 || tippanni.remedies.practices?.length > 0);

    threads.push({
      theme: 'challenge',
      weight: 7,
      factors: [activeDosha?.name || '', weakArea?.label || ''].filter(Boolean),
      narrative: {
        en: `Every chart has its tension points — yours centers on ${challengeSource}. ${challengeDetail.split('.').slice(0, 2).join('.') + '.'} ${hasRemedy ? 'However, classical texts provide specific remedies for this — see the remedies section below.' : 'Awareness is the first step toward transformation.'} ${dominantPlanet ? `Your strong ${dominantPlanet.planet.name.en} provides the inner resource to work through this challenge.` : ''}`,
        hi: `हर कुण्डली में तनाव बिन्दु होते हैं — आपका केन्द्र ${challengeSource} पर है। ${hasRemedy ? 'हालाँकि, शास्त्रों में इसके विशिष्ट उपाय बताए गए हैं — नीचे उपाय अनुभाग देखें।' : 'जागरूकता परिवर्तन का पहला कदम है।'} ${dominantPlanet ? `आपका मजबूत ${dominantPlanet.planet.name.hi} इस चुनौती से निपटने की आन्तरिक शक्ति प्रदान करता है।` : ''}`,
      },
      action: {
        en: activeDosha ? `Address ${activeDosha.name} through the prescribed remedies — this is your chart's primary growth edge.` : `Focus on strengthening your ${weakArea?.label || 'challenging area'} through targeted effort.`,
        hi: activeDosha ? `निर्धारित उपायों से ${activeDosha.name} का समाधान करें — यह आपकी कुण्डली का प्राथमिक विकास क्षेत्र है।` : `लक्षित प्रयास से अपने ${weakArea?.label || 'चुनौतीपूर्ण क्षेत्र'} को मजबूत करने पर ध्यान दें।`,
      },
    });
  }

  // ── Thread 4: Hidden Strength ──
  // Find a yoga or placement the user might not realize is significant
  const hiddenStrength = tippanni.yogas.find(y =>
    y.present && y.strength !== 'Strong' && y.type !== 'daridra'
  );
  if (hiddenStrength && threads.length < 4) {
    threads.push({
      theme: 'hidden',
      weight: 5,
      factors: [hiddenStrength.name],
      narrative: {
        en: `Your chart holds a quieter strength that deserves attention: ${hiddenStrength.name}. ${hiddenStrength.description.split('.')[0]}. While not the loudest signal in your chart, this yoga provides a foundation that supports your other strengths — like bedrock beneath a building.`,
        hi: `आपकी कुण्डली में एक शान्त शक्ति है जो ध्यान देने योग्य है: ${hiddenStrength.name}। यह योग अन्य शक्तियों को सहारा देता है — जैसे भवन के नीचे की चट्टान।`,
      },
      action: {
        en: `Don't overlook ${hiddenStrength.name} — it quietly supports your bigger ambitions.`,
        hi: `${hiddenStrength.name} को नज़रअन्दाज़ न करें — यह चुपचाप आपकी बड़ी महत्वाकांक्षाओं का समर्थन करता है।`,
      },
    });
  }

  // ── Thread: Birth Nakshatra — character foundation ──
  const moon = kundali.planets.find(p => p.planet.id === 1);
  if (moon) {
    // Moon's nakshatra is stored on the planet's grahaDetails or can be derived from longitude
    // PlanetPosition doesn't have nakshatra directly — derive from sidereal longitude
    // 24.21 = Lahiri ayanamsha for ~2026 — fallback only; ayanamshaValue should always be set
    const moonSidLng = moon.longitude - (kundali.ayanamshaValue ?? 24.21);
    const normalizedLng = ((moonSidLng % 360) + 360) % 360;
    const nakId = Math.floor(normalizedLng / (360 / 27)) + 1;
    const nak = NAKSHATRAS[nakId - 1];
    const nakDetails = NAKSHATRA_DETAILS.find(d => d.id === nakId);
    const nakName = nak ? nak.name.en : `Nakshatra ${nakId}`;
    const nakNameHi = nak ? nak.name.hi : `नक्षत्र ${nakId}`;
    const nakDeity = nak ? nak.deity.en : '';
    const nakNature = nak ? nak.nature.en : '';
    const nakRuler = nak ? nak.ruler : '';
    const isGandaMoola = [1, 10, 19, 6, 15, 24].includes(nakId); // Ashwini, Magha, Moola, Ardra, Swati, Shatabhisha — junction nakshatras
    const isMoola = nakId === 19; // Moola specifically

    let nakNarrative = `Your birth nakshatra is ${nakName} — ruled by ${nakRuler}, with ${nakDeity} as its deity. This nakshatra's ${nakNature} nature shapes your emotional core and instinctive reactions.`;
    let nakNarrativeHi = `आपका जन्म नक्षत्र ${nakNameHi} है — ${nakRuler} द्वारा शासित। यह नक्षत्र आपके भावनात्मक मूल और सहज प्रतिक्रियाओं को आकार देता है।`;

    if (nakDetails) {
      nakNarrative += ` ${nakDetails.characteristics.en.split('.')[0]}.`;
    }

    if (isMoola) {
      nakNarrative += ' Moola nakshatra borns carry a transformative intensity — they are natural investigators who dig to the root of everything. The deity Nirriti (goddess of destruction) grants the power to tear down and rebuild. This can manifest as spiritual depth, research ability, or periodic upheavals that lead to profound growth.';
      nakNarrativeHi += ' मूल नक्षत्र में जन्मे लोग परिवर्तनकारी तीव्रता रखते हैं — वे स्वाभाविक अन्वेषक हैं जो हर चीज़ की जड़ तक जाते हैं। देवी निर्ऋति विनाश और पुनर्निर्माण की शक्ति प्रदान करती हैं।';
    } else if (isGandaMoola) {
      nakNarrative += ' As a Ganda Moola nakshatra, your birth carries junction energy — a transition point between elemental forces. Classical texts recommend specific shanti pujas, but this energy also grants unusual resilience and the ability to navigate transformational life changes.';
      nakNarrativeHi += ' गण्ड मूल नक्षत्र के रूप में, आपका जन्म संधि ऊर्जा वहन करता है। शास्त्र विशेष शान्ति पूजा की अनुशंसा करते हैं, लेकिन यह ऊर्जा असाधारण लचीलापन भी प्रदान करती है।';
    }

    threads.push({
      theme: 'nakshatra',
      weight: isMoola ? 7.5 : isGandaMoola ? 6.5 : 5.5,
      factors: [`${nakName} nakshatra`, nakRuler ? `${nakRuler} ruled` : ''].filter(Boolean),
      narrative: { en: nakNarrative, hi: nakNarrativeHi },
      action: {
        en: isMoola
          ? `Moola's transformative power is your gift — channel it into deep study, research, or spiritual practice rather than resisting change.`
          : isGandaMoola
            ? `Consider Ganda Moola shanti puja if not already done. Your junction energy is a strength when consciously directed.`
            : `Connect with ${nakName}'s deity ${nakDeity} through regular acknowledgment — this strengthens your emotional foundation.`,
        hi: isMoola
          ? `मूल की परिवर्तनकारी शक्ति आपकी भेंट है — इसे गहन अध्ययन, शोध या आध्यात्मिक साधना में लगाएँ।`
          : isGandaMoola
            ? `यदि पहले नहीं किया तो गण्ड मूल शान्ति पूजा पर विचार करें। आपकी संधि ऊर्जा सचेत रूप से निर्देशित होने पर शक्ति है।`
            : `${nakNameHi} के देवता ${nak?.deity.hi || ''} से नियमित जुड़ाव रखें — यह आपकी भावनात्मक नींव मजबूत करता है।`,
      },
    });
  }

  // ── Thread 5: Life stage integration ──
  if (stageCtx && strongArea) {
    const stageLabel = stageCtx.stage.replace('_', ' ');
    threads.push({
      theme: 'lifephase',
      weight: 6,
      factors: [`${stageLabel} phase`, `${strongArea.label} strongest area`],
      narrative: {
        en: `At ${stageCtx.age}, you are in the ${stageLabel} phase. Your chart's strongest domain — ${strongArea.label} (${strongArea.rating}/10) — aligns well with this life stage. ${stageCtx.priorityOrder[0] === 'career' && strongArea.label.toLowerCase().includes('career') ? 'This is a powerful alignment — your chart\'s natural strength matches your life stage\'s primary concern.' : `Your life stage prioritizes ${stageCtx.priorityOrder[0]}, and the chart factors above suggest how to navigate it.`}`,
        hi: `${stageCtx.age} वर्ष की आयु में, आप ${stageLabel} चरण में हैं। आपकी कुण्डली का सबसे मजबूत क्षेत्र — ${strongArea.label} (${strongArea.rating}/10) — इस जीवन चरण के साथ अच्छी तरह संरेखित है।`,
      },
      action: {
        en: `Lean into your natural ${strongArea.label.toLowerCase()} strength — this is where your chart and your life stage converge.`,
        hi: `अपनी प्राकृतिक ${strongArea.label} शक्ति पर भरोसा करें — यहीं आपकी कुण्डली और जीवन चरण एक साथ आते हैं।`,
      },
    });
  }

  // ── Sort threads by weight, apply life-stage boost ──
  if (stageCtx) {
    const stageBoosts: Record<string, string[]> = {
      student: ['identity', 'hidden'],
      early_career: ['timing', 'identity'],
      householder: ['timing', 'challenge'],
      established: ['challenge', 'lifephase'],
      elder: ['lifephase', 'hidden'],
      sage: ['lifephase', 'hidden'],
    };
    const boostThemes = stageBoosts[stageCtx.stage] || [];
    for (const thread of threads) {
      if (boostThemes.includes(thread.theme)) thread.weight += 1;
    }
  }

  threads.sort((a, b) => b.weight - a.weight);
  const topThreads = threads.slice(0, 5);

  // ── Build headline from the #1 thread ──
  const topThread = topThreads[0];
  const headline = topThread
    ? {
        en: topThread.factors.slice(0, 2).join(' + ') + ' — this is the defining pattern of your chart.',
        hi: topThread.factors.slice(0, 2).join(' + ') + ' — यह आपकी कुण्डली का निर्णायक पैटर्न है।',
      }
    : { en: 'Your chart reveals a unique combination of strengths and growth areas.', hi: 'आपकी कुण्डली शक्तियों और विकास क्षेत्रों का एक अद्वितीय संयोजन दर्शाती है।' };

  // ── Build closing synthesis ──
  const positiveCount = topThreads.filter(t => t.theme !== 'challenge').length;
  const tone: UnifiedNarrative['tone'] = positiveCount >= 3 ? 'positive' : positiveCount >= 2 ? 'mixed' : 'challenging';

  const synthesis = {
    en: `In summary: ${topThreads.map(t => t.factors[0]).filter(Boolean).join(', ')} — these are the threads that define your chart. ${tone === 'positive' ? 'The overall picture is encouraging — your strengths significantly outweigh your challenges.' : tone === 'mixed' ? 'Your chart is a balance of promise and effort — the strengths are real, and the challenges are workable.' : 'Your chart demands effort, but the classical texts are clear: awareness of challenges is itself a powerful remedy.'} Every section below expands on one of these threads.`,
    hi: `सारांश: ${topThreads.map(t => t.factors[0]).filter(Boolean).join(', ')} — ये वो धागे हैं जो आपकी कुण्डली को परिभाषित करते हैं। ${tone === 'positive' ? 'समग्र चित्र उत्साहजनक है — आपकी शक्तियाँ चुनौतियों से काफ़ी अधिक हैं।' : tone === 'mixed' ? 'आपकी कुण्डली वादे और प्रयास का सन्तुलन है — शक्तियाँ वास्तविक हैं, और चुनौतियाँ हल करने योग्य।' : 'आपकी कुण्डली प्रयास माँगती है, लेकिन शास्त्र स्पष्ट हैं: चुनौतियों की जागरूकता स्वयं एक शक्तिशाली उपाय है।'} नीचे प्रत्येक अनुभाग इन्हीं धागों का विस्तार करता है।`,
  };

  return { headline, threads: topThreads, synthesis, tone };
}

// ── Helpers ──

function ordinal(n: number): string {
  const suffixes = ['th', 'st', 'nd', 'rd'];
  const v = n % 100;
  return n + (suffixes[(v - 20) % 10] || suffixes[v] || suffixes[0]);
}

function findDominantPlanet(kundali: KundaliData): PlanetPosition | undefined {
  if (!kundali.shadbala || kundali.shadbala.length === 0) return kundali.planets[0];
  const maxShadbala = kundali.shadbala.reduce((max, sb) =>
    sb.totalStrength > (max?.totalStrength || 0) ? sb : max, kundali.shadbala[0]);
  return kundali.planets.find(p => p.planet.name.en === maxShadbala.planet);
}

function findCurrentDasha(kundali: KundaliData): (typeof kundali.dashas[0]) | undefined {
  const now = new Date();
  return kundali.dashas.find(d => {
    const start = new Date(d.startDate);
    const end = new Date(d.endDate);
    return now >= start && now <= end;
  });
}

interface AreaInfo { label: string; rating: number; summary: string }

function findLifeAreaExtremes(tippanni: TippanniContent): { strongest: AreaInfo | null; weakest: AreaInfo | null } {
  const areas: AreaInfo[] = [
    { label: tippanni.lifeAreas.career.label, rating: tippanni.lifeAreas.career.rating, summary: tippanni.lifeAreas.career.summary },
    { label: tippanni.lifeAreas.wealth.label, rating: tippanni.lifeAreas.wealth.rating, summary: tippanni.lifeAreas.wealth.summary },
    { label: tippanni.lifeAreas.marriage.label, rating: tippanni.lifeAreas.marriage.rating, summary: tippanni.lifeAreas.marriage.summary },
    { label: tippanni.lifeAreas.health.label, rating: tippanni.lifeAreas.health.rating, summary: tippanni.lifeAreas.health.summary },
    { label: tippanni.lifeAreas.education.label, rating: tippanni.lifeAreas.education.rating, summary: tippanni.lifeAreas.education.summary },
  ];
  areas.sort((a, b) => b.rating - a.rating);
  return { strongest: areas[0] || null, weakest: areas[areas.length - 1] || null };
}
